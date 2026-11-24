import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS} from '../theme';

/**
 * 深色底、细网格与两团低饱和光晕，所有场景共用。
 */
export const Backdrop: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.background}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(900px 600px at 18% 12%, rgba(110,231,249,0.10), transparent 65%), radial-gradient(1000px 700px at 82% 88%, rgba(167,139,250,0.10), transparent 65%)',
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
          maskImage:
            'radial-gradient(1200px 800px at 50% 45%, black 30%, transparent 78%)',
        }}
      />
    </AbsoluteFill>
  );
};
