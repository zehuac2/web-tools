import { describe, it, expect } from 'vitest';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CarParams } from '../sim/CarModel';
import { DEFAULT_PARAMS } from '../sim/CarModel';
import carParamsSlice, {
  setBodyWidth,
  setFrontOverhang,
  setMaxSteeringAngle,
  setRearOverhang,
  setSpeed,
  setSteeringRate,
  setWheelbase,
} from './carParamsSlice';

const reducer = carParamsSlice.reducer;

function initial(): CarParams {
  return reducer(undefined, { type: '@@INIT' });
}

// One row per setter: the action creator, the field it owns, and a value that
// differs from the default.
const setters: [
  string,
  (value: number) => PayloadAction<number>,
  keyof CarParams,
  number,
][] = [
  ['setWheelbase', setWheelbase, 'wheelbase', 3.5],
  ['setFrontOverhang', setFrontOverhang, 'frontOverhang', 1.25],
  ['setRearOverhang', setRearOverhang, 'rearOverhang', 1.1],
  ['setBodyWidth', setBodyWidth, 'bodyWidth', 2.4],
  ['setMaxSteeringAngle', setMaxSteeringAngle, 'maxSteeringAngle', 0.7],
  ['setSteeringRate', setSteeringRate, 'steeringRate', 1.4],
  ['setSpeed', setSpeed, 'speed', 12.5],
];

describe('carParamsSlice', () => {
  it('starts at DEFAULT_PARAMS', () => {
    expect(initial()).toEqual(DEFAULT_PARAMS);
  });

  it('ignores an action it does not own', () => {
    const state = initial();
    expect(reducer(state, { type: 'other/action' })).toBe(state);
  });

  it.each(setters)(
    '%s writes only its own field',
    (_name, action, field, value) => {
      const next = reducer(initial(), action(value));

      expect(next[field]).toBe(value);
      expect(next).toEqual({ ...DEFAULT_PARAMS, [field]: value });
    },
  );

  it('keeps earlier edits when a second field changes', () => {
    const withSpeed = reducer(initial(), setSpeed(9));
    const withBoth = reducer(withSpeed, setWheelbase(4));

    expect(withBoth).toEqual({
      ...DEFAULT_PARAMS,
      speed: 9,
      wheelbase: 4,
    });
  });

  it('does not mutate the state it is given', () => {
    const state = initial();
    reducer(state, setSpeed(20));

    expect(state.speed).toBe(DEFAULT_PARAMS.speed);
  });
});
