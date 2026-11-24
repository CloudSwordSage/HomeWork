import React, {useEffect, useState} from 'react';
import {
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {FPS, getSceneAtTime} from '../data/timeline';
import {COLORS, FONT_FAMILY} from '../theme';

type SubtitleLine = {
  start: number;
  end: number;
  text: string;
};

type SubtitleMap = Record<string, SubtitleLine[]>;

let subtitlePromise: Promise<SubtitleMap | null> | null = null;

/**
 * 字幕文件由 `npm run tts` 生成；没有生成时返回 null，视频照常渲染。
 * 模块级缓存避免 Remotion 逐帧渲染时重复请求。
 */
const loadSubtitles = (): Promise<SubtitleMap | null> => {
  if (!subtitlePromise) {
    subtitlePromise = fetch(staticFile('audio/subtitles.json'))
      .then((response) => (response.ok ? (response.json() as Promise<SubtitleMap>) : null))
      .catch(() => null);
  }
  return subtitlePromise;
};

/**
 * 底部旁白字幕。时间戳来自语音合成接口，未生成音频时不显示。
 */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const [data, setData] = useState<SubtitleMap | null>(null);
  const [handle] = useState(() => delayRender('加载旁白字幕'));

  useEffect(() => {
    let cancelled = false;

    loadSubtitles()
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .finally(() => continueRender(handle));

    return () => {
      cancelled = true;
    };
  }, [handle]);

  const time = frame / FPS;
  const scene = getSceneAtTime(time);

  if (!data || !scene) {
    return null;
  }

  const sceneTime = time - scene.start - scene.voiceoverOffset;
  const lines = data[scene.id] ?? [];
  const line = lines.find(
    (item) => sceneTime >= item.start + 0.08 && sceneTime < item.end + 0.12,
  );

  if (!line) {
    return null;
  }

  const lineStart = line.start + 0.08;
  const lineEnd = line.end + 0.12;
  const fadeIn = interpolate(sceneTime - lineStart, [0, 0.12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(lineEnd - sceneTime, [0, 0.12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 58,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: Math.min(fadeIn, fadeOut),
      }}
    >
      <div
        style={{
          maxWidth: 1640,
          padding: '12px 64px 14px',
          borderRadius: 14,
          backgroundColor: 'rgba(4, 8, 18, 0.72)',
          border: '1px solid rgba(255,255,255,0.08)',
          fontFamily: FONT_FAMILY,
          fontSize: 32,
          lineHeight: 1.5,
          color: COLORS.text,
          textAlign: 'center',
          letterSpacing: '0.01em',
          wordBreak: 'break-word',
          textShadow: '0 2px 12px rgba(0,0,0,0.6)',
        }}
      >
        {line.text}
      </div>
    </div>
  );
};
