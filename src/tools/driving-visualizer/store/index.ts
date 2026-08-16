import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import carParamsReducer from './carParamsSlice';
import telemetryReducer from './telemetrySlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    carParams: carParamsReducer,
    telemetry: telemetryReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
