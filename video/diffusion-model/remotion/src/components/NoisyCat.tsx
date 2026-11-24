import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Cat} from './Cat';
import {NoiseField} from './NoiseField';
import {COLORS} from '../theme';

type NoisyCatProps = {
  /** 0 = 纯噪声，1 = 完全清晰 */
  clarity: number;
  frame: number;
  size?: number;
  style?: React.CSSProperties;
  showFrame?: boolean;
};

/**
 * 猫图与噪声的叠加体。全片的"数据状态"都由这一个组件表达：
 * 前向是 clarity 下降，采样是 clarity 阶梯上升。
 */
export const NoisyCat: React.FC<NoisyCatProps> = ({
  clarity,
  frame,
  size = 560,
  style,
  showFrame = true,
}) => {
  const clamped = Math.max(0, Math.min(1, clarity));
  const blur = (1 - clamped) * 16;
  const catOpacity = interpolate(clamped, [0, 0.18, 1], [0, 0.75, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const noiseIntensity = Math.min(1, 0.06 + (1 - clamped) * 1.05);

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: 36,
        overflow: 'hidden',
        backgroundColor: COLORS.backgroundSoft,
        border: `1px solid ${COLORS.border}`,
        boxShadow: `0 30px 90px rgba(0,0,0,0.45), 0 0 80px rgba(110,231,249,${0.06 + clamped * 0.08})`,
        ...style,
      }}
    >
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          filter: `blur(${blur}px) saturate(${0.5 + clamped * 0.5})`,
          opacity: catOpacity,
          transform: `scale(${0.92 + clamped * 0.06})`,
        }}
      >
        <Cat size={size * 0.86} />
      </AbsoluteFill>

      <NoiseField intensity={noiseIntensity} frame={frame} />

      {showFrame ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 36,
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </div>
  );
};
