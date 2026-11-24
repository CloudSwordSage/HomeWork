import React from 'react';
import {AbsoluteFill} from 'remotion';

/**
 * 生成一张静态噪点纹理的 data URI。
 *
 * 用 SVG feTurbulence 而不是逐帧 Canvas：纹理在浏览器内可缓存，
 * 渲染 5000 多帧时不会因为每帧重绘噪声而拖慢出片。
 */
const noiseUri = (seed: number): string => {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="270">` +
    `<filter id="n" x="0" y="0" width="100%" height="100%">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.86" numOctaves="2" seed="${seed}" stitchTiles="stitch"/>` +
    `<feColorMatrix type="saturate" values="2.4"/>` +
    `</filter>` +
    `<rect width="100%" height="100%" filter="url(#n)"/>` +
    `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

const NOISE_TEXTURES = [noiseUri(3), noiseUri(17), noiseUri(41)];

type NoiseFieldProps = {
  /** 0–1，噪声层不透明度 */
  intensity: number;
  /** 当前帧，用于轮换纹理制造颗粒闪烁 */
  frame: number;
  style?: React.CSSProperties;
};

/**
 * 全屏或局部噪点层。需放在深色背景上，`screen` 混合模式负责提亮颗粒。
 */
export const NoiseField: React.FC<NoiseFieldProps> = ({
  intensity,
  frame,
  style,
}) => {
  const variant = Math.floor(frame / 2) % NOISE_TEXTURES.length;

  return (
    <AbsoluteFill
      style={{
        backgroundImage: NOISE_TEXTURES[variant],
        backgroundSize: '420px 236px',
        opacity: Math.max(0, Math.min(1, intensity)),
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};
