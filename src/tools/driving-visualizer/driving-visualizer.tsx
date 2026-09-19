import { type FC } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './scene/scene';
import Telemetry from './ui/telemetry';
import Toolbar from './ui/toolbar';
import ParameterPanel from './ui/parameter-panel';
import Controls from './ui/controls';

import { css } from 'styled-system/css';

// The page mounts this island in a `position: relative` full-bleed `<main>`.
// Absolute positioning skips the `<astro-island>` wrapper, which has no height
// of its own and would collapse a percentage-height chain.
const rootClassName = css({ position: 'absolute', inset: '[0]' });

const DrivingVisualizer: FC = () => {
  return (
    <div className={rootClassName}>
      <Canvas
        orthographic
        frameloop="demand"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <Scene />
      </Canvas>

      {/* The panels follow the canvas in the DOM, so they paint over it
          without needing a z-index. Each one pins itself to a corner. */}
      <Toolbar />
      <Telemetry />
      <ParameterPanel />
      <Controls />
    </div>
  );
};

DrivingVisualizer.displayName = 'DrivingVisualizer';

export default DrivingVisualizer;
