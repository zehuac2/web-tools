// Owns the R3F scene graph and the single per-frame simulation loop. Physics
// state lives in refs. useFrame advances it. It never lives in React state.
// The loop mutates the Three.js objects directly each frame. Rendering is
// on-demand: the loop calls invalidate() only while the car or its steering
// is still changing. When nothing moves, the canvas goes idle.

import { useEffect, useEffectEvent, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, MapControls } from '@react-three/drei';
import {
  step,
  getCorners,
  createInitialState,
  turningRadius,
} from '@/tools/driving-visualizer/sim/CarModel';
import type { CarState } from '@/tools/driving-visualizer/sim/CarModel';
import { useKeyboardInput } from '@/tools/driving-visualizer/sim/useKeyboardInput';
import {
  addAppListener,
  useAppDispatch,
  useAppSelector,
} from '@/tools/driving-visualizer/store/index';
import { setTelemetry } from '@/tools/driving-visualizer/store/telemetrySlice';
import {
  centerCamera,
  centerSteering,
  clearTraces,
  resetPose,
} from '@/tools/driving-visualizer/store/sceneActions';
import { Car } from './Car';
import { SweptPath, type SweptPathHandle } from './SweptPath';
import { getSceneColors } from './theme';

export interface TelemetryData {
  x: number;
  y: number;
  headingDeg: number;
  steeringDeg: number;
  turningRadius: number;
  speed: number;
  driving: boolean;
}

const INITIAL_HALF_HEIGHT = 30; // Visible half-height, in meters, at default zoom.
const TELEMETRY_INTERVAL_MS = 66; // About 15 Hz panel updates.
const STEERING_EPS = 1e-4;

export function Scene(): React.ReactElement {
  const invalidate = useThree((s) => s.invalidate);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  const dispatch = useAppDispatch();
  const params = useAppSelector((state) => state.carParams);
  const fillVisible = useAppSelector((state) => state.ui.fillVisible);

  const colors = useMemo(getSceneColors, []);

  // Shared mutable state. This never triggers React re-renders.
  const carStateRef = useRef<CarState>(createInitialState());
  const carGroupRef = useRef<THREE.Group>(null);
  const frontLeftRef = useRef<THREE.Object3D>(null);
  const frontRightRef = useRef<THREE.Object3D>(null);
  const sweptPathRef = useRef<SweptPathHandle>(null);
  const controlsRef = useRef<React.ComponentRef<typeof MapControls>>(null);
  const lastTelemetryRef = useRef(0);

  const { readInput } = useKeyboardInput(invalidate);

  // Map the old [5, 200] m view-size range onto orthographic zoom. This is
  // captured from the first measured viewport, so resizing does not reset
  // the user's zoom.
  const { initialZoom, minZoom, maxZoom } = useMemo(() => {
    const z = Math.max(1, size.height) / (2 * INITIAL_HALF_HEIGHT);
    return {
      initialZoom: z,
      minZoom: z * (INITIAL_HALF_HEIGHT / 200),
      maxZoom: z * (INITIAL_HALF_HEIGHT / 5),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect events for the toolbar's scene commands (see store/sceneActions.ts).
  // Each always reads the latest invalidate/camera without making the
  // subscribing effect below re-run when they change.
  const onResetPose = useEffectEvent(() => {
    carStateRef.current = createInitialState();
    invalidate();
  });
  const onClearTraces = useEffectEvent(() => {
    sweptPathRef.current?.clear();
    invalidate();
  });
  const onCenterSteering = useEffectEvent(() => {
    carStateRef.current = { ...carStateRef.current, steeringAngle: 0 };
    invalidate();
  });
  const onCenterCamera = useEffectEvent(() => {
    const { x, y } = carStateRef.current;
    const controls = controlsRef.current;
    if (controls) {
      controls.target.set(x, y, 0);
      camera.position.set(x, y, 100);
      controls.update();
    }
    invalidate();
  });

  // Subscribe those effect events to the toolbar's scene commands.
  useEffect(() => {
    const unsubscribers = [
      dispatch(
        addAppListener({ actionCreator: resetPose, effect: onResetPose }),
      ),
      dispatch(
        addAppListener({ actionCreator: clearTraces, effect: onClearTraces }),
      ),
      dispatch(
        addAppListener({
          actionCreator: centerSteering,
          effect: onCenterSteering,
        }),
      ),
      dispatch(
        addAppListener({ actionCreator: centerCamera, effect: onCenterCamera }),
      ),
    ];
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [dispatch]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const input = readInput();
    const next = step(carStateRef.current, params, input, dt);
    carStateRef.current = next;

    if (input.throttle !== 0) {
      sweptPathRef.current?.append(getCorners(next, params));
    }

    // Position the car. heading 0 means +X. Local +Y is forward, so rotate -90°.
    const group = carGroupRef.current;
    if (group) {
      group.position.set(next.x, next.y, 0.02);
      group.rotation.z = next.heading - Math.PI / 2;
    }
    if (frontLeftRef.current)
      frontLeftRef.current.rotation.z = next.steeringAngle;
    if (frontRightRef.current)
      frontRightRef.current.rotation.z = next.steeringAngle;

    // Telemetry is throttled, so App re-renders don't reconcile the tree at 60 fps.
    const now = performance.now();
    if (now - lastTelemetryRef.current >= TELEMETRY_INTERVAL_MS) {
      lastTelemetryRef.current = now;
      dispatch(
        setTelemetry({
          x: next.x,
          y: next.y,
          headingDeg: (next.heading * 180) / Math.PI,
          steeringDeg: (next.steeringAngle * 180) / Math.PI,
          turningRadius: turningRadius(params, next.steeringAngle),
          speed: params.speed,
          driving: input.throttle !== 0,
        }),
      );
    }

    // On-demand continuation: keeps the loop alive only while something changes.
    const selfCentering =
      !input.holdSteering &&
      input.steerDir === 0 &&
      Math.abs(next.steeringAngle) > STEERING_EPS;
    const active =
      input.throttle !== 0 ||
      input.steerDir !== 0 ||
      input.centerSteering ||
      selfCentering;
    if (active) invalidate();
  });

  return (
    <>
      <color attach="background" args={[colors.bg]} />

      <OrthographicCamera
        makeDefault
        position={[0, 0, 100]}
        near={0.1}
        far={1000}
        zoom={initialZoom}
      />
      <MapControls
        ref={controlsRef}
        enableRotate={false}
        enableDamping={false}
        screenSpacePanning
        minZoom={minZoom}
        maxZoom={maxZoom}
      />

      <gridHelper
        args={[200, 200, colors.grid, colors.grid]}
        rotation={[Math.PI / 2, 0, 0]}
      />

      {/* Origin marker. */}
      <mesh position={[0, 0, 0.005]}>
        <circleGeometry args={[0.1, 16]} />
        <meshBasicMaterial color={colors.origin} />
      </mesh>

      <SweptPath ref={sweptPathRef} fillVisible={fillVisible} />
      <Car
        params={params}
        groupRef={carGroupRef}
        frontLeftRef={frontLeftRef}
        frontRightRef={frontRightRef}
      />
    </>
  );
}
