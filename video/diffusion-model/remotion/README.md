# 扩散模型科普视频（Remotion）

用 Remotion 把 `../大纲.md`、`../细纲.md` 实现为约 2 分 28 秒的 1080p 视频。
旁白由火山引擎豆包语音的 HTTP 接口生成，音乐与音效需自行添加。

## 快速开始

```powershell
# 1. 安装依赖
npm install

# 2. 填写 API Key（编辑同目录下的 .env）
#    VOLC_TTS_API_KEY=...

# 3. 生成旁白与字幕（约 6 次请求，可重复执行，已生成的段会跳过）
npm run tts

# 4. 预览
npm run dev

# 5. 出片（输出 out/diffusion-model.mp4）
npm run render
```

没有 API Key 也可以先执行第 4 步：视频正常播放，只是没有旁白和字幕。

## 目录结构

```
remotion/
├── .env                          # API Key（不提交）
├── scripts/generate-voiceover.mjs # 分段调用语音接口、写音频与字幕
├── public/audio/                 # 生成的 mp3 与 subtitles.json
└── src/
    ├── data/script.json          # 旁白、分段、时间码（单一数据源）
    ├── data/timeline.ts          # 秒 → 帧的换算
    ├── data/voiceover.generated.json # 音频清单（由脚本生成）
    ├── components/               # 猫、噪声、字幕、页眉、公式
    ├── scenes/S0–S5.tsx          # 六个场景
    └── Video.tsx                 # 总装
```

## 语音合成说明

接口：`POST https://openspeech.bytedance.com/api/v3/tts/create`

- 鉴权：`X-Api-Key`（新版控制台）。
- 单次最长 120 秒，因此按 S0–S5 分段生成；每段都远低于上限。
- `enable_subtitle: true` 会返回句级时间戳，脚本写入 `public/audio/subtitles.json`，视频底部字幕直接使用这些时间戳。
- 可选 `VOLC_TTS_SPEAKER` 指定音色；留空使用 `seed-audio-1.0` 的默认音色。
- 可选 `VOLC_TTS_SPEECH_RATE` 调语速（-50 到 100）。旁白偏长时设为 `-10` 左右；单段可在 `script.json` 里用 `speechRate` 覆盖全局值（S0 目前设为 20，压进 12 秒）。

常用命令：

```powershell
npm run tts                 # 跳过已存在的段
npm run tts:force           # 全部重新生成（会重复计费）
node --env-file=.env scripts/generate-voiceover.mjs --only S3
```

每次成功生成都会立即更新清单，因此中途失败后重跑不会重复消耗已完成的段。

**超长警告**：脚本会比较接口返回的时长与该段可用时长。若提示超出，说明成片会截断该段结尾；优先调低语速，或按 `细纲.md` 压缩对应段落。

## 修改内容

- 旁白与分段：只改 `src/data/script.json`。`start`/`end` 是秒，`voiceoverOffset` 是旁白相对场景起点的延迟（S0 为 4 秒，S1–S4 为 0.2 秒，S5 为 0.5 秒）。
- 画面：每个场景一个文件，镜头节奏按 `细纲.md` 的时间码硬编码在组件里。改时间码时同步改 `script.json` 的 `start`/`end`。
- 全片总长：`script.json` 的 `duration`。当前 148.3 秒 = 4449 帧 @ 30fps。
- 音色：`.env` 的 `VOLC_TTS_SPEAKER` 固定为 `zh_male_liufei_uranus_bigtts`（刘飞 2.0）。改音色后需 `npm run tts:force` 重生成全部六段，避免音色混用。
- 开头静音：脚本会把每段前 0.12 秒置零，消除模型起始的短促“嗯”式瑕疵；`--no-mute` 可关闭。
- 字幕：由接口返回的时间戳驱动，不需要手工对轴。

## 画面设计

- 全片只用一张矢量猫图表达"数据状态"：`clarity` 从 1 降到 0 是前向加噪，从 0 阶梯升到 1 是采样。
- 噪声用内联 SVG `feTurbulence` 生成，不依赖外部素材；渲染时可缓存，不会逐帧重绘。
- 全片只出现一个公式，且不朗读，符合细纲的准确性约束。
- 字幕、页眉、进度条都是全片固定层，场景切换不影响。

## 渲染与字体

- 字体使用系统中文字体：微软雅黑 → 苹方 → Noto Sans SC。Windows 下默认即可；Linux 渲染前需安装 Noto Sans CJK，否则中文会变成方框。
- `remotion.config.ts` 里并发设为 4。机器内存较小时可降到 2。
- 首次渲染会自动下载 Chrome Headless Shell（约 131 MB），只下载一次。

## 已知限制

- 未内置背景音乐和音效。需要时把音频放进 `public/`，在 `Video.tsx` 里加一条 `<Audio>` 即可。
- 未做竖屏版。当前 1920×1080；竖屏发布需重新排版安全区。
- 语音接口返回的音色与语气由模型决定，脚本不做后处理。若某段语气不合适，可用 `--only` 单独重生成。

## 参考

- 语音接口文档：https://docs.volcengine.com/docs/doubao-voice/audio-generation-http?lang=zh
- Remotion 文档：https://www.remotion.dev/docs
