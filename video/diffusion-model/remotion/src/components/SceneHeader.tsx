import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY, MONO_FAMILY} from '../theme';
import {SCENES, VIDEO_TITLE, FPS} from '../data/timeline';

/**
 * 全片固定的页眉：左上角系列名，右上角当前段落编号。
 * 编号让观众知道进度，也方便课堂讲解时定位。
 */
export const SceneHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const seconds = frame / FPS;
  const scene = SCENES.find((item) => seconds >= item.start && seconds < item.end);
  const index = scene ? SCENES.indexOf(scene) + 1 : SCENES.length;
  const endFrame = SCENES[SCENES.length - 1].endFrame;
  const fadeOut = interpolate(frame, [endFrame - 110, endFrame - 80], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 44,
        left: 64,
        right: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: FONT_FAMILY,
        pointerEvents: 'none',
        opacity: fadeOut,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            backgroundColor: COLORS.accent,
            boxShadow: `0 0 16px ${COLORS.accent}`,
          }}
        />
        <span
          style={{
            fontSize: 22,
            letterSpacing: '0.08em',
            color: COLORS.muted,
          }}
        >
          {VIDEO_TITLE}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 22,
          color: COLORS.faint,
          fontFamily: MONO_FAMILY,
        }}
      >
        <span>
          {String(index).padStart(2, '0')} / {String(SCENES.length).padStart(2, '0')}
        </span>
        <span style={{color: COLORS.muted, fontFamily: FONT_FAMILY}}>
          {scene?.label ?? ''}
        </span>
      </div>
    </div>
  );
};

/** 底部的全片进度条，宽 2px，避免抢字幕。 */
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const total = SCENES[SCENES.length - 1].endFrame;
  const progress = interpolate(frame, [0, total], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [total - 110, total - 80], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.08)',
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.violet})`,
        }}
      />
    </div>
  );
};
