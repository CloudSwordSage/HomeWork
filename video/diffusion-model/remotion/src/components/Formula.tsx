import React from 'react';
import {COLORS} from '../theme';

/**
 * 扩散模型前向过程的公式，用 SVG 手工排版。
 *
 * 不引入 KaTeX：公式只有一条，SVG 能精确控制根号、上划线与下标位置，
 * 也不会在 Remotion 渲染时依赖额外的字体与 CSS。
 */
export const Formula: React.FC = () => {
  const mathFont = "'Times New Roman', 'Cambria Math', 'Georgia', serif";

  return (
    <svg
      viewBox="0 0 760 140"
      width={760}
      height={140}
      style={{display: 'block', margin: '0 auto'}}
      role="img"
      aria-label="x_t 等于根号 alpha bar_t 乘以 x_0，加上根号 1 减 alpha bar_t 乘以 epsilon"
    >
      <g
        fill={COLORS.text}
        stroke={COLORS.text}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* x_t */}
        <text
          x={10}
          y={92}
          fontSize={54}
          fontFamily={mathFont}
          fontStyle="italic"
          stroke="none"
        >
          x
        </text>
        <text x={38} y={112} fontSize={30} fontFamily={mathFont} stroke="none">
          t
        </text>

        {/* = */}
        <text x={68} y={92} fontSize={54} fontFamily={mathFont} stroke="none">
          =
        </text>

        {/* sqrt(alpha_bar_t) */}
        <path
          d="M 128 94 L 139 94 L 147 116 L 162 52 L 162 38 L 248 38"
          fill="none"
        />
        <text
          x={170}
          y={92}
          fontSize={54}
          fontFamily={mathFont}
          fontStyle="italic"
          stroke="none"
        >
          ᾱ
        </text>
        <text x={212} y={112} fontSize={30} fontFamily={mathFont} stroke="none">
          t
        </text>

        {/* · x_0 + */}
        <text x={246} y={88} fontSize={46} fontFamily={mathFont} stroke="none">
          ·
        </text>
        <text
          x={278}
          y={92}
          fontSize={54}
          fontFamily={mathFont}
          fontStyle="italic"
          stroke="none"
        >
          x
        </text>
        <text x={310} y={112} fontSize={30} fontFamily={mathFont} stroke="none">
          0
        </text>
        <text x={342} y={92} fontSize={54} fontFamily={mathFont} stroke="none">
          +
        </text>

        {/* sqrt(1 - alpha_bar_t) */}
        <path
          d="M 386 94 L 397 94 L 405 116 L 420 52 L 420 38 L 620 38"
          fill="none"
        />
        <text x={432} y={96} fontSize={54} fontFamily={mathFont} stroke="none">
          (
        </text>
        <text x={454} y={92} fontSize={54} fontFamily={mathFont} stroke="none">
          1
        </text>
        <line x1={486} y1={74} x2={512} y2={74} />
        <text
          x={524}
          y={92}
          fontSize={54}
          fontFamily={mathFont}
          fontStyle="italic"
          stroke="none"
        >
          ᾱ
        </text>
        <text x={566} y={112} fontSize={30} fontFamily={mathFont} stroke="none">
          t
        </text>
        <text x={588} y={96} fontSize={54} fontFamily={mathFont} stroke="none">
          )
        </text>

        {/* · epsilon */}
        <text x={632} y={88} fontSize={46} fontFamily={mathFont} stroke="none">
          ·
        </text>
        <text
          x={662}
          y={92}
          fontSize={54}
          fontFamily={mathFont}
          fontStyle="italic"
          stroke="none"
        >
          ε
        </text>
      </g>
    </svg>
  );
};
