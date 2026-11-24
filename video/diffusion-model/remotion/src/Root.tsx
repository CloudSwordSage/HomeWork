import React from 'react';
import {Composition} from 'remotion';
import {DiffusionVideo} from './Video';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './data/timeline';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DiffusionExplainer"
      component={DiffusionVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
