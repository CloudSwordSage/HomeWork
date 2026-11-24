import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import {NoiseField} from '../components/NoiseField';
import {NoisyCat} from '../components/NoisyCat';
import {COLORS, FONT_FAMILY, MONO_FAMILY} from '../theme';

const InputCard: React.FC<{
  clarity: number;
  frame: number;
  label: string;
  time: string;
  size?: number;
  timeOpacity?: number;
}> = ({clarity, frame, label, time, size = 340, timeOpacity = 1}) => (
  <div style={{width: size}}>
    <NoisyCat clarity={clarity} frame={frame} size={size} />
    <div
      style={{
        marginTop: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        fontFamily: FONT_FAMILY,
      }}
    >
      <span style={{fontSize: 24, color: COLORS.muted}}>{label}</span>
      <span
        style={{
          fontSize: 22,
          color: COLORS.accent,
          fontFamily: MONO_FAMILY,
          opacity: timeOpacity,
        }}
      >
        {time}
      </span>
    </div>
  </div>
);

export const S3Reverse: React.FC = () => {
  const frame = useCurrentFrame();

  const aOpacity = interpolate(frame, [255, 285], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bOpacity = interpolate(frame, [265, 295], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bOut = interpolate(frame, [1008, 1032], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cOpacity = interpolate(frame, [1008, 1032], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const trainingFrame = Math.max(0, frame - 270);
  const trainingRound = Math.floor(trainingFrame / 120) + 1;
  const cycleProgress = (trainingFrame % 120) / 120;
  const cycleEased = 1 - Math.pow(1 - cycleProgress, 2);
  const errorWidth = 330 - 250 * cycleEased;
  const predictionWidth = 340 - 60 * cycleEased;
  const netGlow = 0.3 + 0.25 * Math.sin(trainingFrame / 10);

  const activeInput = Math.floor(
    (Math.max(0, frame - 1008) / 60) % 3,
  );

  const titleIn = interpolate(frame, [270, 300], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const netIn = interpolate(frame, [315, 355], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const inputIn = interpolate(frame, [380, 415], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const timeIn = interpolate(frame, [470, 510], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outputIn = interpolate(frame, [530, 565], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const errorIn = interpolate(frame, [625, 660], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dataWallIn = interpolate(frame, [735, 780], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sharedIn = interpolate(frame, [1008, 1032], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const arrowColor = 'rgba(160, 178, 210, 0.65)';

  return (
    <AbsoluteFill style={{fontFamily: FONT_FAMILY}}>
      {/* A：反向过程是什么 */}
      <div style={{opacity: aOpacity}}>
        <div
          style={{
            position: 'absolute',
            top: 122,
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <div style={{fontSize: 20, letterSpacing: '0.18em', color: COLORS.violet}}>
            REVERSE PROCESS
          </div>
          <div style={{marginTop: 10, fontSize: 48, fontWeight: 700}}>
            反向过程：从噪声走回图片
          </div>
        </div>

        <div style={{position: 'absolute', left: 430, top: 330, width: 360}}>
          <NoisyCat clarity={0.04} frame={frame} size={360} />
          <div
            style={{
              marginTop: 16,
              textAlign: 'center',
              fontSize: 24,
              color: COLORS.muted,
            }}
          >
            现在：一团噪声
          </div>
        </div>

        <div style={{position: 'absolute', left: 1140, top: 330, width: 360}}>
          <NoisyCat clarity={1} frame={frame} size={360} />
          <div
            style={{
              marginTop: 16,
              textAlign: 'center',
              fontSize: 24,
              color: COLORS.muted,
            }}
          >
            目标：清晰图片
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 820,
            top: 442,
            width: 300,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 58,
              color: COLORS.warm,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            ?
          </div>
          <div style={{marginTop: 10, fontSize: 54, color: arrowColor}}>→</div>
          <div style={{marginTop: 10, fontSize: 22, color: COLORS.muted}}>
            该减掉多少？
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 760,
            textAlign: 'center',
            fontSize: 27,
            color: COLORS.muted,
          }}
        >
          知道噪声，就能减掉它；可我们并不知道每一步加了多少
        </div>
      </div>

      {/* B：训练网络预测噪声 */}
      <div style={{opacity: bOpacity * bOut}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: dataWallIn * 0.16,
            pointerEvents: 'none',
          }}
        >
          {Array.from({length: 28}).map((_, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: `${(index * 137) % 92}%`,
                top: `${(index * 83) % 88}%`,
                width: 74,
                height: 54,
                borderRadius: 8,
                background: `hsl(${(index * 47) % 360} 55% 35%)`,
                transform: `rotate(${((index % 5) - 2) * 4}deg)`,
              }}
            />
          ))}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 118,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: titleIn,
          }}
        >
          <div style={{fontSize: 20, letterSpacing: '0.18em', color: COLORS.accent}}>
            TRAINING
          </div>
          <div style={{marginTop: 10, fontSize: 48, fontWeight: 700}}>
            训练：让网络猜出混进的噪声
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 220,
            top: 300,
            opacity: inputIn,
            transform: `translateX(${(1 - inputIn) * -60}px)`,
          }}
        >
          <InputCard
            clarity={0.34}
            frame={frame}
            label="带噪图 x_t"
            time="t = 500"
            size={340}
            timeOpacity={timeIn}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 690,
            top: 420,
            fontSize: 54,
            color: arrowColor,
            opacity: Math.min(inputIn, netIn),
          }}
        >
          →
        </div>

        <div
          style={{
            position: 'absolute',
            left: 810,
            top: 356,
            width: 260,
            height: 260,
            borderRadius: 34,
            backgroundColor: 'rgba(110, 231, 249, 0.10)',
            border: `1px solid ${COLORS.accent}`,
            boxShadow: `0 0 ${40 + netGlow * 60}px rgba(110, 231, 249, ${0.18 + netGlow * 0.2})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: netIn,
            transform: `scale(${0.82 + netIn * 0.18})`,
          }}
        >
          <div style={{fontSize: 62, color: COLORS.accent, fontFamily: MONO_FAMILY}}>
            ε<sub style={{fontSize: '0.55em'}}>θ</sub>
          </div>
          <div style={{marginTop: 10, fontSize: 22, color: COLORS.muted}}>
            去噪网络
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 1140,
            top: 420,
            fontSize: 54,
            color: arrowColor,
            opacity: Math.min(outputIn, netIn),
          }}
        >
          →
        </div>

        <div
          style={{
            position: 'absolute',
            left: 1330,
            top: 300,
            opacity: outputIn,
            transform: `translateX(${(1 - outputIn) * 60}px)`,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: 340,
              height: 340,
              borderRadius: 36,
              overflow: 'hidden',
              backgroundColor: COLORS.backgroundSoft,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <NoiseField intensity={0.95} frame={frame} />
          </div>
          <div
            style={{
              marginTop: 16,
              textAlign: 'center',
              fontSize: 24,
              color: COLORS.muted,
            }}
          >
            输出：预测噪声 ε̂
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 410,
            top: 735,
            width: 1100,
            padding: '22px 30px',
            borderRadius: 22,
            backgroundColor: COLORS.panel,
            border: `1px solid ${COLORS.border}`,
            opacity: errorIn,
            transform: `translateY(${(1 - errorIn) * 40}px)`,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 14}}>
            <span style={{width: 120, fontSize: 22, color: COLORS.muted}}>预测</span>
            <div
              style={{
                width: 340,
                height: 18,
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.07)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: predictionWidth,
                  height: '100%',
                  backgroundColor: COLORS.accent,
                  opacity: 0.8,
                }}
              />
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <span style={{width: 120, fontSize: 22, color: COLORS.muted}}>真实</span>
            <div
              style={{
                width: 340,
                height: 18,
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.07)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: 340,
                  height: '100%',
                  backgroundColor: COLORS.muted,
                  opacity: 0.5,
                }}
              />
            </div>
            <span
              style={{
                marginLeft: 10,
                width: 140,
                height: 18,
                borderRadius: 999,
                backgroundColor: COLORS.danger,
                opacity: 0.75,
                transform: `scaleX(${errorWidth / 330})`,
                transformOrigin: 'left center',
              }}
            />
            <span style={{fontSize: 22, color: COLORS.danger}}>误差</span>
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
            <span>误差反传，调整网络参数；下一次预测更接近真实噪声</span>
            <span style={{color: COLORS.accent, fontFamily: MONO_FAMILY}}>
              第 {trainingRound} 轮
            </span>
          </div>
        </div>
      </div>

      {/* C：同一个网络处理不同时间步 */}
      <div style={{opacity: cOpacity}}>
        <div
          style={{
            position: 'absolute',
            top: 118,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: sharedIn,
          }}
        >
          <div style={{fontSize: 20, letterSpacing: '0.18em', color: COLORS.violet}}>
            ONE NETWORK
          </div>
          <div style={{marginTop: 10, fontSize: 48, fontWeight: 700}}>
            同一个网络，不同时间步
          </div>
        </div>

        <svg
          viewBox="0 0 1920 1080"
          width={1920}
          height={1080}
          style={{position: 'absolute', inset: 0, opacity: sharedIn}}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="8"
              refX="9"
              refY="4"
              orient="auto"
            >
              <path d="M 0 0 L 10 4 L 0 8 Z" fill={COLORS.accent} opacity="0.7" />
            </marker>
          </defs>
          <path
            d="M 600 310 C 720 310, 720 540, 830 540"
            fill="none"
            stroke={COLORS.accent}
            strokeWidth="3"
            opacity="0.45"
            strokeDasharray="10 12"
            strokeDashoffset={-frame * 0.8}
            markerEnd="url(#arrowhead)"
          />
          <path
            d="M 600 540 L 830 540"
            fill="none"
            stroke={COLORS.accent}
            strokeWidth="3"
            opacity="0.45"
            strokeDasharray="10 12"
            strokeDashoffset={-frame * 0.8}
            markerEnd="url(#arrowhead)"
          />
          <path
            d="M 600 770 C 720 770, 720 540, 830 540"
            fill="none"
            stroke={COLORS.accent}
            strokeWidth="3"
            opacity="0.45"
            strokeDasharray="10 12"
            strokeDashoffset={-frame * 0.8}
            markerEnd="url(#arrowhead)"
          />
          <path
            d="M 1160 540 L 1290 540"
            fill="none"
            stroke={COLORS.accent}
            strokeWidth="3"
            opacity="0.45"
            strokeDasharray="10 12"
            strokeDashoffset={-frame * 0.8}
            markerEnd="url(#arrowhead)"
          />
        </svg>

        <div style={{opacity: sharedIn}}>
          {[
            {clarity: 0.55, time: 't = 200', top: 220},
            {clarity: 0.42, time: 't = 500', top: 450},
            {clarity: 0.16, time: 't = 800', top: 680},
          ].map((item, index) => (
            <div
              key={item.time}
              style={{
                position: 'absolute',
                left: 280,
                top: item.top,
                display: 'flex',
                gap: 20,
                transform: `scale(${activeInput === index ? 1.04 : 1})`,
                filter:
                  activeInput === index
                    ? 'brightness(1.2)'
                    : 'brightness(0.78)',
              }}
            >
              <NoisyCat clarity={item.clarity} frame={frame} size={180} />
              <div style={{paddingTop: 54}}>
                <div style={{fontSize: 24, color: COLORS.muted}}>带噪图</div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 26,
                    color: COLORS.accent,
                    fontFamily: MONO_FAMILY,
                  }}
                >
                  {item.time}
                </div>
              </div>
            </div>
          ))}

          <div
            style={{
              position: 'absolute',
              left: 830,
              top: 396,
              width: 330,
              height: 288,
              borderRadius: 36,
              backgroundColor: 'rgba(167, 139, 250, 0.10)',
              border: `1px solid ${COLORS.violet}`,
              boxShadow: `0 0 ${70 + 20 * Math.sin(frame / 8)}px rgba(167, 139, 250, 0.18)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{fontSize: 58, color: COLORS.violet, fontFamily: MONO_FAMILY}}>
              ε<sub style={{fontSize: '0.55em'}}>θ</sub>
            </div>
            <div style={{marginTop: 8, fontSize: 24, color: COLORS.text}}>同一个网络</div>
            <div style={{marginTop: 6, fontSize: 20, color: COLORS.faint}}>
              参数共享
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              left: 1330,
              top: 404,
              width: 260,
              height: 260,
              borderRadius: 30,
              overflow: 'hidden',
              backgroundColor: COLORS.backgroundSoft,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <NoiseField intensity={0.92} frame={frame} />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 1330,
              top: 680,
              width: 260,
              textAlign: 'center',
              fontSize: 22,
              color: COLORS.muted,
            }}
          >
            预测噪声
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 890,
            textAlign: 'center',
            fontSize: 23,
            color: COLORS.faint,
            opacity: sharedIn,
          }}
        >
          海量图片 · 随机抽取时间步 · 反复训练
        </div>
      </div>
    </AbsoluteFill>
  );
};
