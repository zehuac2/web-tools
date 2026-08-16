import { type FC } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './scene/Scene';
import Telemetry from './ui/Telemetry';
import Toolbar from './ui/Toolbar';
import ParameterPanel from './ui/ParameterPanel';
import Controls from './ui/Controls';

import { css, cx } from 'styled-system/css';
import { card } from 'styled-system/recipes';

const DrivingVisualizer: FC = () => {
  return (
    <div
      className={css({
        display: 'grid',
        gap: '6',
        gridTemplateColumns: {
          base: 'auto',
          lg: '[1fr 370px]',
        },
        alignItems: { lg: 'start' },
      })}
    >
      <section
        className={cx(
          card(),
          css({
            p: '0',
            overflow: 'hidden',
            height: { base: '[70vh]', lg: '[min(70vh,720px)]' },
          }),
        )}
      >
        <Canvas
          orthographic
          frameloop="demand"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <Scene />
        </Canvas>
      </section>

      <div
        className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}
      >
        <Telemetry />
        <Toolbar />
        <ParameterPanel />
        <Controls />
      </div>
    </div>
  );
};

DrivingVisualizer.displayName = 'DrivingVisualizer';

export default DrivingVisualizer;
