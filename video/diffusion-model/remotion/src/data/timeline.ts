import script from './script.json';

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export type SceneId = 'S0' | 'S1' | 'S2' | 'S3' | 'S4' | 'S5';

export type Scene = {
  id: SceneId;
  label: string;
  start: number;
  end: number;
  /** 旁白相对场景起点的延迟，S0 要等钩子画面先出现 */
  voiceoverOffset: number;
  /** 该段单独使用的语速，未设置时用环境变量 */
  speechRate?: number;
  narration: string;
  startFrame: number;
  endFrame: number;
  durationInFrames: number;
  voiceoverStartFrame: number;
};

export const SCENES: Scene[] = script.segments.map((segment) => ({
  ...segment,
  id: segment.id as SceneId,
  startFrame: Math.round(segment.start * FPS),
  endFrame: Math.round(segment.end * FPS),
  durationInFrames: Math.round((segment.end - segment.start) * FPS),
  voiceoverStartFrame: Math.round(
    (segment.start + segment.voiceoverOffset) * FPS,
  ),
}));

export const TOTAL_FRAMES = Math.round(script.duration * FPS);

export const VIDEO_TITLE = script.title;

export const getSceneAtTime = (seconds: number): Scene | undefined =>
  SCENES.find((scene) => seconds >= scene.start && seconds < scene.end);
