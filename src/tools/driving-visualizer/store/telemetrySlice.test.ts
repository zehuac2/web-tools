import { describe, it, expect } from 'vitest';
import { DEFAULT_PARAMS } from '../sim/CarModel';
import telemetrySlice, {
  setTelemetry,
  type TelemetryData,
} from './telemetrySlice';

const reducer = telemetrySlice.reducer;

function initial(): TelemetryData {
  return reducer(undefined, { type: '@@INIT' });
}

function frame(over: Partial<TelemetryData> = {}): TelemetryData {
  return {
    x: 12.5,
    y: -3.25,
    headingDeg: 47.5,
    steeringDeg: -18,
    turningRadius: 8.4,
    speed: 6,
    driving: true,
    ...over,
  };
}

describe('telemetrySlice', () => {
  it('starts at the initial car pose', () => {
    // The car starts at the origin, facing +Y, stopped and going straight.
    expect(initial()).toEqual({
      x: 0,
      y: 0,
      headingDeg: 90,
      steeringDeg: 0,
      turningRadius: Infinity,
      speed: DEFAULT_PARAMS.speed,
      driving: false,
    });
  });

  it('stores the frame it is given', () => {
    expect(reducer(initial(), setTelemetry(frame()))).toEqual(frame());
  });

  it('replaces the previous frame instead of merging it', () => {
    const previous = reducer(initial(), setTelemetry(frame()));
    const next = frame({ x: 0, y: 0, driving: false, turningRadius: Infinity });

    expect(reducer(previous, setTelemetry(next))).toEqual(next);
  });

  it('ignores an action it does not own', () => {
    const state = initial();
    expect(reducer(state, { type: 'other/action' })).toBe(state);
  });
});
