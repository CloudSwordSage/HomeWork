import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {NoiseField} from '../components/NoiseField';
import {Cat} from '../components/Cat';
import {COLORS, FONT_FAMILY} from '../theme';

type StepCardProps = {
  index: number;
  title: string;
  subtitle: string;
  active: boolean;
  progress: number;
  children: React.ReactNode;
};

const StepCard: React.FC<StepCardProps> = ({
  index,
  title,
  subtitle,
  active,
  progress,
  children,
}) => (
  <div
    style={{
      width: 400,
      height: 300,
      padding: '30px 32px',
      borderRadius: 28,
      backgroundColor: active ? COLORS.panelStrong : COLORS.panel,
      border: `1px solid ${active ? COLORS.accent : COLORS.border}`,
      boxShadow: active ? `0 0 60px ${COLORS.accentSoft}` : 'none',
      opacity: 0.24 + Math.min(1, progress) * 0.76,
      transform: `translateY(${(1 - Math.min(1, progress)) * 18}px)`,
      fontFamily: FONT_FAMILY,
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 20,
        color: active ? COLORS.accent : COLORS.faint,
      }}
    >
      <span>STEP {String(index).padStart(2, '0')}</span>
      <span>{active ? '●' : '○'}</span>
    </div>
    <div style={{marginTop: 24, height: 96}}>{children}</div>
    <div style={{marginTop: 20, fontSize: 38, fontWeight: 700, color: COLORS.text}}>
      {title}
    </div>
    <div style={{marginTop: 8, fontSize: 22, color: COLORS.muted}}>{subtitle}</div>
  </div>
);

const MiniNoise: React.FC<{frame: number; size?: number}> = ({frame, size = 92}) => (
  <div
    style={{
      position: 'relative',
      width: size,
      height: size,
      borderRadius: 14,
      overflow: 'hidden',
      border: `1px solid ${COLORS.border}`,
      backgroundColor: COLORS.backgroundSoft,
    }}
  >
    <NoiseField intensity={0.9} frame={frame} />
  </div>
);

const MiniCat: React.FC<{size?: number}> = ({size = 92}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 14,
      overflow: 'hidden',
      border: `1px solid ${COLORS.border}`,
      backgroundColor: COLORS.backgroundSoft,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Cat size={size * 0.92} />
  </div>
);

export const S5Summary: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const active1 = spring({frame: frame - 45, fps, config: {damping: 18}});
  const active2 = spring({frame: frame - 120, fps, config: {damping: 18}});
  const active3 = spring({frame: frame - 195, fps, config: {damping: 18}});

  const cardsOut = interpolate(frame, [285, 309], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cardsY = interpolate(frame, [285, 309], [0, -40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const quoteOpacity = interpolate(frame, [315, 350], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const quoteY = interpolate(frame, [315, 360], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const quoteOut = interpolate(frame, [600, 615], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const endOpacity = interpolate(frame, [615, 630], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{fontFamily: FONT_FAMILY}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 60,
          opacity: cardsOut,
          transform: `translateY(${cardsY}px)`,
        }}
      >
        <StepCard
          index={1}
          title="加噪"
          subtitle="把图片变成噪声"
          active={active1 > 0.5}
          progress={active1}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <MiniCat />
            <span style={{fontSize: 28, color: COLORS.faint}}>→</span>
            <MiniNoise frame={frame} />
          </div>
        </StepCard>

        <StepCard
          index={2}
          title="学去噪"
          subtitle="预测每一步的噪声"
          active={active2 > 0.5}
          progress={active2}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <MiniNoise frame={frame + 4} size={62} />
            <span style={{fontSize: 18, color: COLORS.faint}}>→</span>
            <div
              style={{
                width: 104,
                height: 88,
                borderRadius: 14,
                border: `1px solid ${COLORS.violet}`,
                backgroundColor: COLORS.violetSoft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: COLORS.violet,
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              εθ
            </div>
            <span style={{fontSize: 18, color: COLORS.faint}}>→</span>
            <MiniNoise frame={frame + 9} size={62} />
          </div>
        </StepCard>

        <StepCard
          index={3}
          title="迭代生成"
          subtitle="从纯噪声走回图片"
          active={active3 > 0.5}
          progress={active3}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <MiniNoise frame={frame} />
            <span style={{fontSize: 28, color: COLORS.faint}}>→</span>
            <MiniCat />
          </div>
        </StepCard>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: quoteOpacity * quoteOut,
          transform: `translateY(${quoteY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: '0.04em',
            background: `linear-gradient(100deg, ${COLORS.accent}, ${COLORS.violet} 55%, ${COLORS.warm})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          多步简单，替代一步困难
        </div>
        <div style={{marginTop: 26, fontSize: 26, color: COLORS.muted, letterSpacing: '0.12em'}}>
          扩散模型的核心思路
        </div>
      </div>

      <AbsoluteFill
        style={{
          backgroundColor: '#000000',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: endOpacity,
        }}
      >
        <div style={{fontSize: 28, color: COLORS.muted, letterSpacing: '0.1em'}}>
          扩散模型 · 3 分钟原理速览
        </div>
        <div
          style={{
            position: 'absolute',
            right: 64,
            bottom: 56,
            fontSize: 18,
            color: COLORS.faint,
            letterSpacing: '0.08em',
          }}
        >
          Remotion 制作
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
