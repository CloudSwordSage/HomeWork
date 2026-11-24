import {spawnSync} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {existsSync, readdirSync} from 'node:fs';
import {mkdir, readFile, unlink, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const SCRIPT_PATH = path.join(ROOT, 'src', 'data', 'script.json');
const MANIFEST_PATH = path.join(ROOT, 'src', 'data', 'voiceover.generated.json');
const AUDIO_DIR = path.join(ROOT, 'public', 'audio');
const SUBTITLE_PATH = path.join(AUDIO_DIR, 'subtitles.json');
const API_URL = 'https://openspeech.bytedance.com/api/v3/tts/create';

// 每段开头加一个句号，让模型先输出停顿，再裁掉开头的初始瑕疵。
const REMOTION_SCOPE = path.join(ROOT, 'node_modules', '@remotion');

const findFfmpeg = () => {
  if (!existsSync(REMOTION_SCOPE)) {
    return 'ffmpeg';
  }

  const packageName = readdirSync(REMOTION_SCOPE).find((name) =>
    name.startsWith('compositor-'),
  );
  if (!packageName) {
    return 'ffmpeg';
  }

  const binary = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
  const candidate = path.join(REMOTION_SCOPE, packageName, binary);
  return existsSync(candidate) ? candidate : 'ffmpeg';
};

const FFMPEG = findFfmpeg();

const apiKey = process.env.VOLC_TTS_API_KEY?.trim();
const speaker = process.env.VOLC_TTS_SPEAKER?.trim();
const model = process.env.VOLC_TTS_MODEL?.trim() || 'seed-audio-1.0';
const speechRate = Number(process.env.VOLC_TTS_SPEECH_RATE || 0);

const args = process.argv.slice(2);
const force = args.includes('--force');
const noMute = args.includes('--no-mute') || args.includes('--no-trim');
const onlyIndex = args.indexOf('--only');
const only = onlyIndex >= 0 ? args[onlyIndex + 1] : null;

// 每段开头 0.12 秒置零：模型起始音在 0.025–0.07 秒，听起来像被切断的“嗯”。
const LEADING_MUTE = noMute ? 0 : 0.12;

if (!apiKey) {
  console.error('缺少 VOLC_TTS_API_KEY。请先编辑 remotion/.env 填入 API Key。');
  process.exit(1);
}

if (only && !/^S[0-5]$/.test(only)) {
  console.error(`--only 只接受 S0–S5，收到：${only}`);
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const readJson = async (file, fallback) => {
  if (!existsSync(file)) {
    return fallback;
  }
  return JSON.parse(await readFile(file, 'utf8'));
};

const script = JSON.parse(await readFile(SCRIPT_PATH, 'utf8'));
const manifest = await readJson(MANIFEST_PATH, {
  generatedAt: null,
  segments: [],
});
const subtitles = await readJson(SUBTITLE_PATH, {});

await mkdir(AUDIO_DIR, {recursive: true});

const segments = script.segments.filter((segment) => !only || segment.id === only);

if (segments.length === 0) {
  console.error('没有匹配的段落可生成。');
  process.exit(1);
}

const writeManifest = async () => {
  const ordered = script.segments
    .map((segment) => manifest.segments.find((item) => item.id === segment.id))
    .filter(Boolean);

  await writeFile(
    MANIFEST_PATH,
    `${JSON.stringify(
      {generatedAt: new Date().toISOString(), segments: ordered},
      null,
      2,
    )}\n`,
    'utf8',
  );
};

const requestAudio = async (segment) => {
  const availableSeconds =
    segment.end - segment.start - (segment.voiceoverOffset ?? 0);

  const payload = {
    model,
    text_prompt: `。${segment.narration.replace(/\n{2,}/g, '\n')}`,
    audio_config: {
      format: 'mp3',
      sample_rate: 48000,
      speech_rate: segment.speechRate ?? speechRate,
      loudness_rate: 0,
      pitch_rate: 0,
      enable_subtitle: true,
    },
    watermark: {},
  };

  if (speaker) {
    payload.references = [{speaker}];
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
      'X-Api-Request-Id': randomUUID(),
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(300_000),
  });

  const raw = await response.text();
  let result;

  try {
    result = JSON.parse(raw);
  } catch {
    throw new Error(`HTTP ${response.status}，响应不是 JSON：${raw.slice(0, 300)}`);
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}：${result.message ?? raw.slice(0, 300)}`);
  }

  if (result.code !== undefined && result.code !== 0) {
    throw new Error(`code ${result.code}：${result.message ?? '未知错误'}`);
  }

  const audioBase64 = result.audio ?? result.data;
  if (!audioBase64) {
    throw new Error(`响应中没有音频数据：${result.message ?? raw.slice(0, 300)}`);
  }

  const file = `audio/${segment.id}.mp3`;
  const rawPath = path.join(AUDIO_DIR, `${segment.id}.raw.mp3`);
  const targetPath = path.join(AUDIO_DIR, `${segment.id}.mp3`);
  await writeFile(rawPath, Buffer.from(audioBase64, 'base64'));

  const trimmed = spawnSync(
    FFMPEG,
    [
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',
      '-i',
      rawPath,
      '-af',
      `volume=enable='lt(t,${LEADING_MUTE})':volume=0`,
      '-c:a',
      'libmp3lame',
      '-b:a',
      '128k',
      targetPath,
    ],
    {encoding: 'utf8'},
  );

  if (trimmed.status !== 0) {
    throw new Error(
      `裁剪音频失败：${trimmed.stderr || trimmed.error?.message || 'unknown'}`,
    );
  }

  await unlink(rawPath);

  const duration = Number(result.duration ?? result.original_duration ?? 0);

  manifest.segments = manifest.segments.filter((item) => item.id !== segment.id);
  manifest.segments.push({
    id: segment.id,
    file,
    duration: Number.isFinite(duration) ? duration : 0,
  });

  const sentences = result.subtitle?.sentences;
  if (Array.isArray(sentences) && sentences.length > 0) {
    subtitles[segment.id] = sentences
      .map((sentence) => ({
        start: Number(sentence.start_time) / 1000,
        end: Number(sentence.end_time) / 1000,
        text: String(sentence.text ?? '')
          .replace(/^。\s*/, '')
          .trim(),
      }))
      .filter((sentence) => sentence.end > 0.05);
    await writeFile(
      SUBTITLE_PATH,
      `${JSON.stringify(subtitles, null, 2)}\n`,
      'utf8',
    );
  } else {
    console.warn(`  ⚠ ${segment.id} 未返回字幕时间戳，视频中将不显示该段旁白字幕`);
  }

  await writeManifest();

  return {duration, availableSeconds};
};

let failed = 0;

for (const [index, segment] of segments.entries()) {
  const label = `[${index + 1}/${segments.length}] ${segment.id} ${segment.label}`;
  const existing = manifest.segments.find((item) => item.id === segment.id);
  const fileExists = existsSync(path.join(AUDIO_DIR, `${segment.id}.mp3`));

  if (!force && existing && fileExists) {
    console.log(`${label} 已存在，跳过（加 --force 重新生成）`);
    continue;
  }

  console.log(`${label} 生成中…`);

  try {
    const {duration, availableSeconds} = await requestAudio(segment);
    console.log(
      `  完成：${duration.toFixed(2)}s，可用 ${availableSeconds.toFixed(2)}s`,
    );

    if (duration > availableSeconds + 0.1) {
      console.warn(
        `  ⚠ 超出 ${(duration - availableSeconds).toFixed(2)}s，成片结尾会被截断。` +
          '可调低 VOLC_TTS_SPEECH_RATE（如 -10）或延长该段时长。',
      );
    }
  } catch (error) {
    failed += 1;
    console.error(`  失败：${error.message}`);
  }
}

await writeManifest();

console.log('');
console.log('音频目录：public/audio');
console.log('清单文件：src/data/voiceover.generated.json');
console.log('字幕后文件：public/audio/subtitles.json');

if (failed > 0) {
  console.error(`有 ${failed} 段失败，请检查网络或 API Key 后重跑（已成功的段会跳过）。`);
  process.exit(1);
}
