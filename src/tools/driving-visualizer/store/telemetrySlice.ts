import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TelemetryData } from '../scene/Scene';
import { DEFAULT_PARAMS } from '../sim/CarModel';

export type { TelemetryData };

const initialState: TelemetryData = {
  x: 0,
  y: 0,
  headingDeg: 90,
  steeringDeg: 0,
  turningRadius: Infinity,
  speed: DEFAULT_PARAMS.speed,
  driving: false,
};

const telemetrySlice = createSlice({
  name: 'telemetry',
  initialState,
  reducers: {
    setTelemetry(_state, action: PayloadAction<TelemetryData>) {
      return action.payload;
    },
  },
});

export const { setTelemetry } = telemetrySlice.actions;
export default telemetrySlice;
