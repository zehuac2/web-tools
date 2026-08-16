import { type FC, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene, type SceneHandle, type TelemetryData } from './scene/Scene';
import Telemetry from './ui/Telemetry';
import Toolbar from './ui/Toolbar';
import ParameterPanel from './ui/ParameterPanel';
import Controls from './ui/Controls';
import { useAppDispatch, useAppSelector } from './store/index';
import { toggleFillVisible } from './store/uiSlice';
import { setTelemetry } from './store/telemetrySlice';

import { css, cx } from 'styled-system/css';
import { card } from 'styled-system/recipes';

const DrivingVisualizer: FC = () => {
  const sceneRef = useRef<SceneHandle>(null);
  const dispatch = useAppDispatch();

  const params = useAppSelector((state) => state.carParams);
  const fillVisible = useAppSelector((state) => state.ui.fillVisible);
  const telemetry = useAppSelector((state) => state.telemetry);

  const handleReset = useCallback(() => sceneRef.current?.reset(), []);
  const handleClearTraces = useCallback(
    () => sceneRef.current?.clearTraces(),
    [],
  );
  const handleCenterSteering = useCallback(
    () => sceneRef.current?.centerSteering(),
    [],
  );
  const handleToggleFill = useCallback(
    () => dispatch(toggleFillVisible()),
    [dispatch],
  );
  const handleCenterCamera = useCallback(
    () => sceneRef.current?.centerCamera(),
    [],
  );
  const handleTelemetry = useCallback(
    (data: TelemetryData) => dispatch(setTelemetry(data)),
    [dispatch],
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
          <Scene
            ref={sceneRef}
            params={params}
            fillVisible={fillVisible}
            onTelemetry={handleTelemetry}
          />
        </Canvas>
      </section>

      <div
        className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}
      >
        <Telemetry data={telemetry} />
        <Toolbar
          fillVisible={fillVisible}
          onReset={handleReset}
          onClearTraces={handleClearTraces}
          onCenterSteering={handleCenterSteering}
          onToggleFill={handleToggleFill}
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
