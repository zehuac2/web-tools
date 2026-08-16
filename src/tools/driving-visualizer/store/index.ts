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

/**
 * Builds a store with its own listener middleware. The app uses the single
 * `store` below. Tests call this to get an isolated store per test.
 */
export function makeStore() {
  // Carries scene commands (see sceneActions.ts) from the toolbar to Scene's
  // listeners, without routing them through reducer state.
  const listenerMiddleware = createListenerMiddleware();

  return configureStore({
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
}

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const addAppListener = addListener.withTypes<RootState, AppDispatch>();
