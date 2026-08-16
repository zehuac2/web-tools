import {
  addListener,
  configureStore,
  createListenerMiddleware,
} from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import carParamsSlice from './carParamsSlice';
import {
  centerCamera,
  centerSteering,
  clearTraces,
  resetPose,
} from './sceneActions';
import telemetrySlice from './telemetrySlice';
import uiSlice from './uiSlice';

// Carries scene commands (see sceneActions.ts) from the toolbar to Scene's
// listeners, without routing them through reducer state.
export const listenerMiddleware = createListenerMiddleware();

export const store = configureStore({
  reducer: {
    carParams: carParamsSlice.reducer,
    telemetry: telemetrySlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  devTools: {
    name: 'driving-visualizer',
    // Lets the Redux DevTools dispatcher dispatch these actions directly,
    // including the scene commands that never touch reducer state.
    actionCreators: {
      ...carParamsSlice.actions,
      ...telemetrySlice.actions,
      ...uiSlice.actions,
      resetPose,
      clearTraces,
      centerSteering,
      centerCamera,
    },
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const addAppListener = addListener.withTypes<RootState, AppDispatch>();
