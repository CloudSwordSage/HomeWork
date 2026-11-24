import React from 'react';
import {AbsoluteFill, Sequence, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {Backdrop} from './components/Backdrop';
import {Captions} from './components/Captions';
import {ProgressBar, SceneHeader} from './components/SceneHeader';
import {SCENES, type SceneId} from './data/timeline';
import voiceoverJson from './data/voiceover.generated.json';
import {S0Hook} from './scenes/S0Hook';
import {S1Problem} from './scenes/S1Problem';
import {S2Forward} from './scenes/S2Forward';
import {S3Reverse} from './scenes/S3Reverse';
import {S4Sampling} from './scenes/S4Sampling';
import {S5Summary} from './scenes/S5Summary';
import {COLORS, FONT_FAMILY} from './theme';

type VoiceoverSegment = {
  id: SceneId;
  file: string;
  duration: number;
};

const manifest = voiceoverJson as {
  generatedAt: string | null;
  segments: VoiceoverSegment[];
};

const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  S0: S0Hook,
  S1: S1Problem,
  S2: S2Forward,
  S3: S3Reverse,
  S4: S4Sampling,
  S5: S5Summary,
};

export const DiffusionVideo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        fontFamily: FONT_FAMILY,
        color: COLORS.text,
      }}
    >
      <Backdrop />

      {SCENES.map((scene) => {
        const SceneComponent = SCENE_COMPONENTS[scene.id];

        return (
          <Sequence
            key={scene.id}
            name={`${scene.id} ${scene.label}`}
            from={scene.startFrame}
            durationInFrames={scene.durationInFrames}
          >
            <SceneComponent />
          </Sequence>
        );
      })}

      {manifest.segments.map((segment) => {
        const scene = SCENES.find((item) => item.id === segment.id);

        if (!scene) {
          return null;
        }

        return (
          <Sequence
            key={`voice-${segment.id}`}
            name={`voice ${segment.id}`}
            from={scene.voiceoverStartFrame}
            durationInFrames={Math.max(
              1,
              scene.endFrame - scene.voiceoverStartFrame,
            )}
          >
            <Audio src={staticFile(segment.file)} />
          </Sequence>
        );
      })}

      <SceneHeader />
      <ProgressBar />
      <Captions />
    </AbsoluteFill>
  );
};
