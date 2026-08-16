import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_PARAMS, type CarParams } from '../sim/CarModel';

const initialState: CarParams = DEFAULT_PARAMS;

const carParamsSlice = createSlice({
  name: 'carParams',
  initialState,
  reducers: {
    setWheelbase(state, action: PayloadAction<number>) {
      state.wheelbase = action.payload;
    },
    setFrontOverhang(state, action: PayloadAction<number>) {
      state.frontOverhang = action.payload;
    },
    setRearOverhang(state, action: PayloadAction<number>) {
      state.rearOverhang = action.payload;
    },
    setBodyWidth(state, action: PayloadAction<number>) {
      state.bodyWidth = action.payload;
    },
    setMaxSteeringAngle(state, action: PayloadAction<number>) {
      state.maxSteeringAngle = action.payload;
    },
    setSteeringRate(state, action: PayloadAction<number>) {
      state.steeringRate = action.payload;
    },
    setSpeed(state, action: PayloadAction<number>) {
      state.speed = action.payload;
    },
  },
});

export const {
  setWheelbase,
  setFrontOverhang,
  setRearOverhang,
  setBodyWidth,
  setMaxSteeringAngle,
  setSteeringRate,
  setSpeed,
} = carParamsSlice.actions;
export default carParamsSlice.reducer;
