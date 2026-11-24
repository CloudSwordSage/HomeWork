import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Formula} from '../components/Formula';
import {NoisyCat} from '../components/NoisyCat';
import {COLORS, FONT_FAMILY, MONO_FAMILY} from '../theme';

const NOISE_STEPS = 14;

export const S2Forward: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const second = frame / fps;

  const t = interpolate(frame, [180, 480], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const steppedT = Math.floor(t * NOISE_STEPS) / NOISE_STEPS;
  const clarity = 1 - steppedT;

  const formulaOpacity = interpolate(frame, [480, 540], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const formulaReveal = interpolate(frame, [480, 560], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const formulaNoteOpacity = interpolate(frame, [560, 600], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const formulaY = interpolate(frame, [480, 540], [28, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const headerOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const stepLabel =
    t < 0.03
      ? '原图'
      : t < 0.45
        ? '细节减少'
        : t < 0.92
          ? '接近纯噪声'
          : '细节消失';

  return (
    <AbsoluteFill style={{fontFamily: FONT_FAMILY}}>
      <div style={{opacity: headerOpacity}}>
        <NoisyCat
          clarity={clarity}
          frame={frame}
          size={500}
          style={{position: 'absolute', left: 150, top: 200}}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 830,
          top: 220,
          width: 700,
          opacity: headerOpacity,
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: '0.18em',
            color: COLORS.accent,
            marginBottom: 14,
          }}
        >
          FORWARD PROCESS
        </div>
        <div style={{fontSize: 50, fontWeight: 700, color: COLORS.text}}>
          前向过程：逐步加噪
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 27,
            color: COLORS.muted,
            lineHeight: 1.55,
          }}
        >
          每次只加一点点高斯噪声，重复上千次。
        </div>
        <div style={{marginTop: 8, fontSize: 20, color: COLORS.faint}}>
          每个像素独立加噪，整张图同时变化
        </div>

        <div
          style={{
            marginTop: 44,
            padding: '30px 34px',
            borderRadius: 24,
            backgroundColor: COLORS.panel,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div style={{fontSize: 20, color: COLORS.faint, letterSpacing: '0.12em'}}>
            时间步
          </div>
          <div
            style={{
              marginTop: 6,
              display: 'flex',
              alignItems: 'baseline',
              gap: 14,
              fontFamily: MONO_FAMILY,
            }}
          >
            <span style={{fontSize: 28, color: COLORS.muted}}>t =</span>
            <span style={{fontSize: 66, color: COLORS.accent, fontWeight: 600}}>
              {Math.round(t * 1000)}
            </span>
            <span style={{fontSize: 24, color: COLORS.faint}}>/ 1000</span>
          </div>

          <div
            style={{
              marginTop: 24,
              height: 16,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${t * 100}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${COLORS.success}, ${COLORS.warm}, ${COLORS.danger})`,
              }}
            />
          </div>

          <div
            style={{
              marginTop: 14,
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 22,
              color: COLORS.faint,
            }}
          >
            <span>清晰</span>
            <span style={{color: COLORS.warm}}>{stepLabel}</span>
            <span>纯噪声</span>
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 710,
          display: 'flex',
          justifyContent: 'center',
          opacity: formulaOpacity,
          transform: `translateY(${formulaY}px)`,
        }}
      >
        <div
          style={{
            width: 1120,
            padding: '16px 32px 18px',
            borderRadius: 24,
            backgroundColor: 'rgba(13, 20, 40, 0.92)',
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 24px 70px rgba(0,0,0,0.45)',
          }}
        >
          <div
            style={{
              fontSize: 16,
              letterSpacing: '0.16em',
              color: COLORS.accent,
              marginBottom: 6,
            }}
          >
            任意时刻的加噪结果
          </div>
          <div style={{clipPath: `inset(0 ${(1 - formulaReveal) * 100}% 0 0)`}}>
            <Formula />
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 20,
              color: COLORS.muted,
              opacity: formulaNoteOpacity,
            }}
          >
            由原图和一份噪声直接算出，训练时不必逐步模拟
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
