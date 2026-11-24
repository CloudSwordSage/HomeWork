import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import {NoiseField} from '../components/NoiseField';
import {NoisyCat} from '../components/NoisyCat';
import {COLORS, FONT_FAMILY, MONO_FAMILY} from '../theme';

const SAMPLING_START = 180; // 6s
const FRAMES_PER_STEP = 60; // 2s
const STEPS = 8;
const DONE_AT = 660; // 22s

export const S4Sampling: React.FC = () => {
  const frame = useCurrentFrame();

  const rawStep = Math.max(0, (frame - SAMPLING_START) / FRAMES_PER_STEP);
  const step = Math.min(STEPS, Math.floor(rawStep));
  const within = Math.min(1, rawStep - step);
  const eased = interpolate(within, [0, 0.22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const clarity =
    frame < SAMPLING_START ? 0 : Math.min(1, (step + eased) / STEPS);
  const timeStep = Math.round(1000 - clarity * 1000);
  const sampleProgress = clarity;

  const doneOpacity = interpolate(frame, [DONE_AT, DONE_AT + 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const runningOpacity = 1 - doneOpacity;

  const introOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const finalSpring = interpolate(frame, [DONE_AT, DONE_AT + 40], [0.92, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{fontFamily: FONT_FAMILY}}>
      <NoisyCat
        clarity={clarity}
        frame={frame}
        size={660}
        style={{
          position: 'absolute',
          left: 140,
          top: 190,
          transform: `scale(${doneOpacity > 0 ? finalSpring : 1})`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 150,
          top: 872,
          width: 660,
          height: 10,
          borderRadius: 999,
          backgroundColor: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
          opacity: introOpacity,
        }}
      >
        <div
          style={{
            width: `${sampleProgress * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.violet})`,
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 138,
          top: 892,
          width: 680,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 20,
          color: COLORS.faint,
          opacity: introOpacity,
        }}
      >
        <span>纯噪声</span>
        <span>清晰图片</span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 900,
          top: 210,
          width: 560,
          opacity: introOpacity,
        }}
      >
        <div style={{fontSize: 20, letterSpacing: '0.18em', color: COLORS.accent}}>
          SAMPLING
        </div>
        <div style={{marginTop: 10, fontSize: 48, fontWeight: 700, lineHeight: 1.2}}>
          从纯噪声开始，反复去噪
        </div>

        <div style={{position: 'relative', marginTop: 40, minHeight: 430}}>
          {/* 采样进行中 */}
          <div style={{opacity: runningOpacity}}>
            <div style={{fontSize: 20, color: COLORS.faint, letterSpacing: '0.12em'}}>
              时间步
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
                fontFamily: MONO_FAMILY,
              }}
            >
              <span style={{fontSize: 27, color: COLORS.muted}}>t =</span>
              <span style={{fontSize: 62, color: COLORS.accent, fontWeight: 600}}>
                {Math.max(0, timeStep)}
              </span>
            </div>

            <div
              style={{
                marginTop: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 26,
              }}
            >
              <div>
                <div
                  style={{
                    position: 'relative',
                    width: 150,
                    height: 150,
                    borderRadius: 22,
                    overflow: 'hidden',
                    border: `1px solid ${COLORS.border}`,
                    backgroundColor: COLORS.backgroundSoft,
                  }}
                >
                  <NoiseField intensity={0.9} frame={frame + 7} />
                </div>
                <div
                  style={{
                    marginTop: 10,
                    textAlign: 'center',
                    fontSize: 20,
                    color: COLORS.muted,
                  }}
                >
                  预测噪声
                </div>
              </div>

              <div style={{fontSize: 44, color: COLORS.danger}}>−</div>

              <div>
                <div
                  style={{
                    width: 160,
                    height: 150,
                    borderRadius: 22,
                    border: `1px solid ${COLORS.border}`,
                    backgroundColor: COLORS.panel,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 19,
                    color: COLORS.muted,
                    textAlign: 'center',
                    lineHeight: 1.55,
                  }}
                >
                  减去大部分
                  <br />
                  保留少量随机性
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 26,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                fontSize: 24,
                color: COLORS.text,
              }}
            >
              <span
                style={{
                  fontFamily: MONO_FAMILY,
                  color: COLORS.accent,
                  fontSize: 30,
                }}
              >
                {frame < SAMPLING_START ? 0 : Math.min(step + 1, STEPS)} / {STEPS}
              </span>
              <span style={{color: COLORS.muted}}>步</span>
            </div>

            {frame < SAMPLING_START ? (
              <div
                style={{
                  marginTop: 20,
                  fontSize: 22,
                  color: COLORS.warm,
                }}
              >
                准备就绪，等待开始
              </div>
            ) : null}
          </div>

          {/* 完成态 */}
          <div style={{position: 'absolute', inset: 0, opacity: doneOpacity}}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: COLORS.success,
                letterSpacing: '0.04em',
              }}
            >
              生成完成
            </div>
            <div
              style={{
                marginTop: 22,
                padding: '24px 28px',
                borderRadius: 22,
                backgroundColor: COLORS.panel,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div style={{fontSize: 28, color: COLORS.text}}>
                同一个网络，重复调用
              </div>
              <div style={{marginTop: 10, fontSize: 22, color: COLORS.muted}}>
                步数：几十到上千，取决于采样方法与质量要求
              </div>
            </div>
            <div style={{marginTop: 24, display: 'flex', gap: 18}}>
              <div
                style={{
                  padding: '10px 18px',
                  borderRadius: 999,
                  backgroundColor: COLORS.accentSoft,
                  color: COLORS.accent,
                  fontSize: 22,
                }}
              >
                少步 · 快
              </div>
              <div
                style={{
                  padding: '10px 18px',
                  borderRadius: 999,
                  backgroundColor: COLORS.violetSoft,
                  color: COLORS.violet,
                  fontSize: 22,
                }}
              >
                多步 · 精
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
