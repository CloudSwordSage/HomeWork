import React, {useId} from 'react';

type CatProps = {
  size?: number;
  style?: React.CSSProperties;
};

/**
 * 全片复用的猫插画。用矢量绘制，避免依赖外部图片素材。
 *
 * @param size 渲染边长（像素），SVG 内部按 400×400 坐标绘制
 */
export const Cat: React.FC<CatProps> = ({size = 520, style}) => {
  const uid = useId().replace(/:/g, '');
  const furId = `fur-${uid}`;
  const muzzleId = `muzzle-${uid}`;

  return (
    <svg
      viewBox="0 0 400 400"
      width={size}
      height={size}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={furId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFC078" />
          <stop offset="100%" stopColor="#E8894A" />
        </linearGradient>
        <radialGradient id={muzzleId} cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#FFF3E4" />
          <stop offset="100%" stopColor="#FFDFC0" />
        </radialGradient>
      </defs>

      {/* 耳朵 */}
      <path d="M110 142 L88 60 L174 104 Z" fill="#E8894A" />
      <path d="M290 142 L312 60 L226 104 Z" fill="#E8894A" />
      <path d="M120 128 L106 84 L154 108 Z" fill="#F7B7A3" />
      <path d="M280 128 L294 84 L246 108 Z" fill="#F7B7A3" />

      {/* 头部 */}
      <ellipse cx="200" cy="224" rx="128" ry="120" fill={`url(#${furId})`} />

      {/* 额头斑纹 */}
      <path
        d="M200 110 L200 154 M170 118 L178 152 M230 118 L222 152"
        stroke="#D9773A"
        strokeWidth="11"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* 口鼻区域 */}
      <ellipse cx="200" cy="262" rx="88" ry="64" fill={`url(#${muzzleId})`} />

      {/* 眼睛 */}
      <ellipse cx="152" cy="205" rx="19" ry="23" fill="#2B2118" />
      <ellipse cx="248" cy="205" rx="19" ry="23" fill="#2B2118" />
      <circle cx="146" cy="197" r="6" fill="#FFFFFF" />
      <circle cx="242" cy="197" r="6" fill="#FFFFFF" />

      {/* 鼻子与嘴 */}
      <path d="M200 240 L187 253 L213 253 Z" fill="#E76F51" />
      <path
        d="M200 253 L200 265 M200 265 Q187 278 174 267 M200 265 Q213 278 226 267"
        stroke="#8C4A2F"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      {/* 胡须 */}
      <path
        d="M112 250 L48 236 M112 266 L44 266 M114 282 L52 298 M288 250 L352 236 M288 266 L356 266 M286 282 L348 298"
        stroke="#8C4A2F"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
};
