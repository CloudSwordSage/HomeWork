import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Cat} from '../components/Cat';
import {COLORS, FONT_FAMILY} from '../theme';

const PHOTO_COUNT = 16;

const PHOTOS = Array.from({length: PHOTO_COUNT}, (_, index) => ({
  hue: (index * 47 + 196) % 360,
  shape: index % 3,
}));

const Shape: React.FC<{variant: number}> = ({variant}) => {
  const base: React.CSSProperties = {
    position: 'absolute',
    opacity: 0.34,
    backgroundColor: '#FFFFFF',
  };

  if (variant === 1) {
    return (
      <div
        style={{
          ...base,
          left: '32%',
          top: '24%',
          width: 92,
          height: 78,
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
        }}
      />
    );
  }

  if (variant === 2) {
    return (
      <div
        style={{
          ...base,
          left: '24%',
          top: '46%',
          width: 136,
          height: 54,
          borderRadius: '50% 50% 46% 54% / 60% 55% 45% 40%',
        }}
      />
    );
  }

  return (
    <div
      style={{
        ...base,
        left: '34%',
        top: '26%',
        width: 84,
        height: 84,
        borderRadius: '50%',
      }}
    />
  );
};

export const S1Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const gridOpacity = interpolate(frame, [200, 235], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const compareOpacity = interpolate(frame, [220, 250], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scrollX = interpolate(frame, [0, 260], [0, -240], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const newPhoto = spring({
    frame: frame - 100,
    fps,
    config: {damping: 16, stiffness: 110},
  });

  const arcProgress = interpolate(frame, [240, 300], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const stairProgress = interpolate(frame, [420, 516], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const stairPulse = 0.72 + 0.28 * Math.sin(frame / 9);

  const headlineOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const headline =
    frame < 240 ? '生成模型：造一张没见过的新图' : '从随机数到图片，怎么走？';

  return (
    <AbsoluteFill style={{fontFamily: FONT_FAMILY}}>
      <div
        style={{
          position: 'absolute',
          top: 128,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 46,
          fontWeight: 600,
          color: COLORS.text,
          opacity: headlineOpacity,
        }}
      >
        {headline}
      </div>

      {/* 镜头 4：图片库与"新图" */}
      <div style={{opacity: gridOpacity}}>
        <div
          style={{
            position: 'absolute',
            top: 262,
            left: -80,
            display: 'grid',
            gridTemplateColumns: `repeat(${PHOTO_COUNT / 2}, 260px)`,
            gridTemplateRows: '170px 170px',
            gap: 24,
            transform: `translateX(${scrollX}px)`,
          }}
        >
          {PHOTOS.map((photo, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                width: 260,
                height: 170,
                borderRadius: 18,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.12)',
                background: `linear-gradient(140deg, hsl(${photo.hue} 55% 42%), hsl(${photo.hue + 30} 62% 22%))`,
              }}
            >
              <Shape variant={photo.shape} />
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 452,
            transform: `translate(-50%, -50%) scale(${newPhoto})`,
            width: 320,
            height: 320,
            borderRadius: 30,
            backgroundColor: COLORS.backgroundSoft,
            border: `1px solid ${COLORS.accentSoft}`,
            boxShadow: `0 30px 90px rgba(0,0,0,0.55), 0 0 70px ${COLORS.accentSoft}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Cat size={250} />
          <div
            style={{
              position: 'absolute',
              right: -26,
              top: -26,
              width: 76,
              height: 76,
              borderRadius: '50%',
              backgroundColor: COLORS.warm,
              color: '#231506',
              fontSize: 44,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '6px solid #070B18',
            }}
          >
            ?
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 660,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 28,
            color: COLORS.muted,
          }}
        >
          它没有复制训练图片，而是从学到的分布里采样
        </div>
      </div>

      {/* 镜头 5：一步到位 vs 拆成小步 */}
      <div style={{opacity: compareOpacity}}>
        <svg
          viewBox="0 0 1520 500"
          width={1520}
          height={500}
          style={{position: 'absolute', top: 240, left: 200}}
        >
          {/* 左：一步跨越 */}
          <path
            d="M 110 400 Q 380 40 660 400"
            fill="none"
            stroke={COLORS.danger}
            strokeWidth={5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - arcProgress}
            strokeOpacity={0.7 + 0.3 * Math.sin(frame / 12)}
          />
          <circle cx="90" cy="400" r="10" fill={COLORS.muted} />
          <circle cx="670" cy="400" r="10" fill={COLORS.muted} />
          <text
            x="380"
            y="60"
            textAnchor="middle"
            fill={COLORS.danger}
            fontSize="30"
            fontWeight="600"
          >
            跨度太大
          </text>
          <text x="90" y="448" textAnchor="middle" fill={COLORS.faint} fontSize="24">
            随机数
          </text>
          <text x="670" y="448" textAnchor="middle" fill={COLORS.faint} fontSize="24">
            完整图片
          </text>

          {/* 右：多级台阶 */}
          {Array.from({length: 8}, (_, index) => {
            const height = 52 + index * 38;
            const x = 830 + index * 82;
            const baseY = 430 - height;
            const active = index / 8 < stairProgress;

            return (
              <rect
                key={index}
                x={x}
                y={baseY + (active ? 0 : 10)}
                width={62}
                height={height}
                rx={8}
                fill={active ? COLORS.success : 'rgba(255,255,255,0.12)'}
                opacity={active ? 0.55 + 0.45 * stairPulse : 0.45}
                stroke={active ? COLORS.success : 'none'}
                strokeWidth={2}
              />
            );
          })}
          <text
            x="1180"
            y="60"
            textAnchor="middle"
            fill={COLORS.success}
            fontSize="30"
            fontWeight="600"
          >
            拆成很多小步
          </text>
          <text x="830" y="470" textAnchor="middle" fill={COLORS.faint} fontSize="24">
            随机数
          </text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};
