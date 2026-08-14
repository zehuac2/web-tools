import { type FC, useCallback, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene, type SceneHandle, type TelemetryData } from './scene/Scene.tsx';
import { DEFAULT_PARAMS } from './sim/CarModel.ts';
import type { CarParams } from './sim/CarModel.ts';
import Telemetry from './ui/Telemetry.tsx';
import Toolbar from './ui/Toolbar.tsx';
import ParameterPanel from './ui/ParameterPanel.tsx';
import Controls from './ui/Controls.tsx';

import { css, cx } from 'styled-system/css';
import { card } from 'styled-system/recipes';

const INITIAL_TELEMETRY: TelemetryData = {
  x: 0,
  y: 0,
  headingDeg: 90,
  steeringDeg: 0,
  turningRadius: Infinity,
  speed: DEFAULT_PARAMS.speed,
  driving: false,
};

const App: FC = () => {
  const sceneRef = useRef<SceneHandle>(null);

  const [params, setParams] = useState<CarParams>(DEFAULT_PARAMS);
  const [telemetry, setTelemetry] = useState<TelemetryData>(INITIAL_TELEMETRY);
  const [fillVisible, setFillVisible] = useState(true);

  const handleParamChange = useCallback((p: CarParams) => setParams(p), []);
  const handleReset = useCallback(() => sceneRef.current?.reset(), []);
  const handleClearTraces = useCallback(
    () => sceneRef.current?.clearTraces(),
    [],
  );
  const handleCenterSteering = useCallback(
    () => sceneRef.current?.centerSteering(),
    [],
  );
  const handleToggleFill = useCallback(() => setFillVisible((v) => !v), []);
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
          <Scene
            ref={sceneRef}
            params={params}
            fillVisible={fillVisible}
            onTelemetry={setTelemetry}
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
        <ParameterPanel params={params} onChange={handleParamChange} />
        <Controls />
      </div>
    </div>
  );
};

App.displayName = 'App';

export default App;
