import {
  addListener,
  configureStore,
  createListenerMiddleware,
} from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import carParamsReducer from './carParamsSlice';
import telemetryReducer from './telemetrySlice';
import uiReducer from './uiSlice';

// Carries scene commands (see sceneActions.ts) from the toolbar to Scene's
// listeners, without routing them through reducer state.
export const listenerMiddleware = createListenerMiddleware();

export const store = configureStore({
  reducer: {
    carParams: carParamsReducer,
    telemetry: telemetryReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const addAppListener = addListener.withTypes<RootState, AppDispatch>();
