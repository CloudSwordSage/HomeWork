import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {NoisyCat} from '../components/NoisyCat';
import {COLORS, FONT_FAMILY} from '../theme';

export const S0Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // 从第 0 帧开始浮现，9s 完全清晰；12 级阶梯模拟采样过程
  const progress = interpolate(frame, [0, 270], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const clarity = Math.floor(progress * 12) / 12;

  const titleSpring = spring({
    frame: frame - 270,
    fps,
    config: {damping: 200, stiffness: 90},
  });
  const titleOpacity = interpolate(frame, [270, 315], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleY = interpolate(titleSpring, [0, 1], [40, 0]);

  const cardScale = 0.92 + 0.08 * Math.min(1, frame / 180);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'translateY(-92px)',
        }}
      >
        <div
          style={{
            position: 'relative',
            transform: `scale(${cardScale})`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: -70,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(110,231,249,${0.1 + clarity * 0.12}), transparent 68%)`,
              transform: `scale(${1 + 0.04 * Math.sin(frame / 18)})`,
            }}
          />
          <NoisyCat clarity={clarity} frame={frame} size={520} />
        </div>
      </AbsoluteFill>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 178,
          textAlign: 'center',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily: FONT_FAMILY,
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            color: COLORS.text,
            letterSpacing: '0.04em',
          }}
        >
          {'从一团噪声开始'.split('').map((char, index) => (
            <span
              key={index}
              style={{
                display: 'inline-block',
                opacity: interpolate(
                  frame,
                  [270 + index * 4, 285 + index * 4],
                  [0, 1],
                  {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  },
                ),
                transform: `translateY(${interpolate(
                  frame,
                  [270 + index * 4, 290 + index * 4],
                  [16, 0],
                  {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  },
                )}px)`,
              }}
            >
              {char}
            </span>
          ))}
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 27,
            color: COLORS.muted,
            letterSpacing: '0.14em',
            opacity: interpolate(frame, [300, 335], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          扩散模型 · 3 分钟原理速览
        </div>
      </div>
    </AbsoluteFill>
  );
};
