import { screen } from '@testing-library/react';
import { act } from 'react';
import { describe, it, expect } from 'vitest';
import { renderWithStore } from '@/tools/driving-visualizer/testStore';
import { makeStore } from '@/tools/driving-visualizer/store/index';
import {
  setTelemetry,
  type TelemetryData,
} from '@/tools/driving-visualizer/store/telemetrySlice';
import Telemetry from './Telemetry';

function frame(over: Partial<TelemetryData> = {}): TelemetryData {
  return {
    x: 0,
    y: 0,
    headingDeg: 90,
    steeringDeg: 0,
    turningRadius: Infinity,
    speed: 3,
    driving: false,
    ...over,
  };
}

/** Renders the panel with one telemetry frame already in the store. */
function renderFrame(over: Partial<TelemetryData> = {}) {
  const store = makeStore();
  store.dispatch(setTelemetry(frame(over)));
  return renderWithStore(<Telemetry />, store);
}

describe('Telemetry', () => {
  it('shows the initial pose from an untouched store', () => {
    renderWithStore(<Telemetry />);

    expect(screen.getByText('Stopped')).toBeVisible();
    expect(screen.getByText('(0.0, 0.0) m')).toBeVisible();
    expect(screen.getByText('90.0°')).toBeVisible();
    expect(screen.getByText('∞ (straight)')).toBeVisible();
    expect(screen.getByText('3.0 m/s')).toBeVisible();
  });

  it('reports the car as moving while the throttle is on', () => {
    renderFrame({ driving: true });

    expect(screen.getByText('Moving')).toBeVisible();
  });

  it('shows the position and speed of the latest frame', () => {
    renderFrame({ x: 12.34, y: -5.67, speed: 8.25 });

    expect(screen.getByText('(12.3, -5.7) m')).toBeVisible();
    expect(screen.getByText('8.3 m/s')).toBeVisible();
  });

  it('normalizes a negative heading into [0, 360)', () => {
    // Reversing past 0° drives headingDeg negative.
    renderFrame({ headingDeg: -90 });

    expect(screen.getByText('270.0°')).toBeVisible();
  });

  it('normalizes a heading past a full turn', () => {
    renderFrame({ headingDeg: 450 });

    expect(screen.getByText('90.0°')).toBeVisible();
  });

  it('drops the turn direction sign from the turning radius', () => {
    renderFrame({ turningRadius: -6.5, steeringDeg: -20 });

    expect(screen.getByText('6.50 m')).toBeVisible();
    expect(screen.getByText('-20.0°')).toBeVisible();
  });

  it('re-renders when a new frame arrives', async () => {
    const { store } = renderWithStore(<Telemetry />);

    await act(async () => {
      store.dispatch(setTelemetry(frame({ x: 42, driving: true })));
    });

    expect(screen.getByText('(42.0, 0.0) m')).toBeVisible();
    expect(screen.getByText('Moving')).toBeVisible();
  });
});
