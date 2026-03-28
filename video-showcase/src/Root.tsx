import React from 'react';
import { Composition } from 'remotion';
import { WalkthroughComposition } from './WalkthroughComposition';
import screensData from './screens.json';

export const RemotionRoot: React.FC = () => {
  const fps = 30;
  // Calculate total duration based on all screen durations
  const totalDuration = screensData.screens.reduce((acc, s) => acc + (s.duration * fps), 0);

  return (
    <>
      <Composition
        id="WalkthroughComposition"
        component={WalkthroughComposition}
        durationInFrames={totalDuration}
        fps={fps}
        width={1440}
        height={900}
      />
    </>
  );
};
