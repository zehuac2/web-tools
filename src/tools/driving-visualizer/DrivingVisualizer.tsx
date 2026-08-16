import { type FC, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene, type SceneHandle } from './scene/Scene';
import Telemetry from './ui/Telemetry';
import Toolbar from './ui/Toolbar';
import ParameterPanel from './ui/ParameterPanel';
import Controls from './ui/Controls';

import { css, cx } from 'styled-system/css';
import { card } from 'styled-system/recipes';

const DrivingVisualizer: FC = () => {
  const sceneRef = useRef<SceneHandle>(null);

  const handleReset = useCallback(() => sceneRef.current?.reset(), []);
  const handleClearTraces = useCallback(
    () => sceneRef.current?.clearTraces(),
    [],
  );
  const handleCenterSteering = useCallback(
    () => sceneRef.current?.centerSteering(),
    [],
  );
  const handleCenterCamera = useCallback(
    () => sceneRef.current?.centerCamera(),
    [],
  );

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
          <Scene ref={sceneRef} />
        </Canvas>
      </section>

      <div
        className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}
      >
        <Telemetry />
        <Toolbar
          onReset={handleReset}
          onClearTraces={handleClearTraces}
          onCenterSteering={handleCenterSteering}
          onCenterCamera={handleCenterCamera}
        />
        <ParameterPanel />
        <Controls />
      </div>
    </div>
  );
};

DrivingVisualizer.displayName = 'DrivingVisualizer';

export default DrivingVisualizer;
