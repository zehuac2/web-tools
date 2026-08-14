// Declarative car visuals. A group anchored at the rear axle contains the
// body, its outline, a heading arrow, and four wheels. Geometry derives from
// `params`. Changing a shape parameter rebuilds the meshes through React
// reconciliation. Each frame, the simulation loop mutates the forwarded refs:
// the group's position and rotation, and the front wheels' steering rotation.

import { useMemo, type RefObject } from 'react';
import * as THREE from 'three';
import type { CarParams } from '@/tools/driving-visualizer/sim/CarModel.ts';
import { getSceneColors } from './theme.ts';

const WHEEL_W = 0.22; // Visual wheel width, in meters.
const WHEEL_L = 0.5; // Visual wheel length, in meters.

/** A centered rectangle outline as a closed line loop, in the XY plane. */
function rectGeometry(
  width: number,
  height: number,
  z: number,
): THREE.BufferGeometry {
  const hw = width / 2;
  const hh = height / 2;
  return new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-hw, -hh, z),
    new THREE.Vector3(hw, -hh, z),
    new THREE.Vector3(hw, hh, z),
    new THREE.Vector3(-hw, hh, z),
  ]);
}

interface RectOutlineProps {
  width: number;
  height: number;
  color: string;
  position?: [number, number, number];
}

function RectOutline({
  width,
  height,
  color,
  position,
}: RectOutlineProps): React.ReactElement {
  const geometry = useMemo(
    () => rectGeometry(width, height, 0.001),
    [width, height],
  );
  return (
    <lineLoop geometry={geometry} position={position}>
      <lineBasicMaterial color={color} />
    </lineLoop>
  );
}

interface WheelProps {
  position: [number, number, number];
  color: string;
  outlineColor: string;
  wheelRef?: RefObject<THREE.Object3D | null>;
}

function Wheel({
  position,
  color,
  outlineColor,
  wheelRef,
}: WheelProps): React.ReactElement {
  return (
    <object3D ref={wheelRef} position={position}>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[WHEEL_W, WHEEL_L]} />
        <meshBasicMaterial color={color} />
        <RectOutline width={WHEEL_W} height={WHEEL_L} color={outlineColor} />
      </mesh>
    </object3D>
  );
}

export interface CarProps {
  params: CarParams;
  groupRef: RefObject<THREE.Group | null>;
  frontLeftRef: RefObject<THREE.Object3D | null>;
  frontRightRef: RefObject<THREE.Object3D | null>;
}

export function Car({
  params,
  groupRef,
  frontLeftRef,
  frontRightRef,
}: CarProps): React.ReactElement {
  const { wheelbase, frontOverhang, rearOverhang, bodyWidth } = params;
  const colors = useMemo(getSceneColors, []);

  const bodyLength = wheelbase + frontOverhang + rearOverhang;
  // Body center, relative to the rear axle. The rear axle is the group's
  // local origin.
  const centerOffset = (wheelbase + frontOverhang - rearOverhang) / 2;
  const halfW = bodyWidth / 2;
  const wheelX = halfW + WHEEL_W / 2;
  const arrowLen = wheelbase * 0.4;

  const arrowArgs = useMemo<
    [THREE.Vector3, THREE.Vector3, number, string, number, number]
  >(
    () => [
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0.06),
      arrowLen,
      colors.bodyOutline,
      arrowLen * 0.4,
      arrowLen * 0.25,
    ],
    [arrowLen, colors.bodyOutline],
  );

  return (
    <group ref={groupRef}>
      {/* Body, centered ahead of the rear axle. */}
      <mesh position={[0, centerOffset, 0.02]}>
        <planeGeometry args={[bodyWidth, bodyLength]} />
        <meshBasicMaterial color={colors.body} transparent opacity={0.85} />
        <RectOutline
          width={bodyWidth}
          height={bodyLength}
          color={colors.bodyOutline}
        />
      </mesh>

      {/* Heading arrow from the rear axle pointing forward. */}
      <arrowHelper args={arrowArgs} />

      {/* Wheels: rear at the axle, front at +wheelbase. Only front wheels steer. */}
      <Wheel
        position={[-wheelX, 0, 0]}
        color={colors.wheel}
        outlineColor={colors.wheelOutline}
      />
      <Wheel
        position={[wheelX, 0, 0]}
        color={colors.wheel}
        outlineColor={colors.wheelOutline}
      />
      <Wheel
        position={[-wheelX, wheelbase, 0]}
        color={colors.wheel}
        outlineColor={colors.wheelOutline}
        wheelRef={frontLeftRef}
      />
      <Wheel
        position={[wheelX, wheelbase, 0]}
        color={colors.wheel}
        outlineColor={colors.wheelOutline}
        wheelRef={frontRightRef}
      />
    </group>
  );
}
