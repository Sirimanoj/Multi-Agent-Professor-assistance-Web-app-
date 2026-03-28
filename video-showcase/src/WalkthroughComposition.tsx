import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img, spring, interpolate, staticFile } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import screensData from './screens.json';

export const WalkthroughComposition: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#f8f9fa' }}>
      <TransitionSeries>
        {screensData.screens.map((screen, index) => {
          const durationFrames = screen.duration * fps;

          return (
            <TransitionSeries.Sequence
              key={screen.id}
              durationInFrames={durationFrames}
            >
              <ScreenSlide screen={screen} />
            </TransitionSeries.Sequence>
          );
        }).reduce((acc, current, i) => {
          if (i === 0) return [current];
          // 1-second crossfade transition between clips
          return [...acc, <TransitionSeries.Transition timing={linearTiming({ durationInFrames: 30 })} presentation={fade()} />, current];
        }, [] as React.ReactNode[])}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

const ScreenSlide: React.FC<{ screen: any }> = ({ screen }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle zoom-in pan over the duration of the slide
  const scale = interpolate(
    frame,
    [0, screen.duration * fps],
    [1, 1.05],
    { extrapolateRight: 'clamp' }
  );

  // Overlay text slide-up effect
  const textY = spring({
    frame: frame - 15,
    fps,
    delay: 0,
    config: { damping: 14, stiffness: 100 },
  });
  
  // Fade overlay text explicitly at start and before transition
  const textOpacity = interpolate(
    frame, 
    [15, 30, (screen.duration * fps) - 30, screen.duration * fps], 
    [0, 1, 1, 0],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <Img src={staticFile(screen.imagePath)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
      
      {/* Narrative Overlay */}
      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '80px' }}>
        <div style={{
          transform: `translateY(${100 - (textY * 100)}px)`,
          opacity: textOpacity,
          backgroundColor: 'rgba(25, 28, 29, 0.75)',
          color: 'white',
          padding: '32px 56px',
          borderRadius: '32px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center',
          boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(20px)',
          maxWidth: '1000px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h1 style={{ fontSize: '38px', margin: '0 0 12px 0', fontWeight: '800', tracking: '-0.02em' }}>
            {screen.title}
          </h1>
          <p style={{ fontSize: '22px', margin: 0, color: '#e2e8f0', lineHeight: '1.6', fontWeight: '500' }}>
            {screen.description}
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
