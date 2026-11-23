import {
  addListener,
  configureStore,
  createListenerMiddleware,
} from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import {
  configurationSettled,
  fieldChanged,
  printReady,
  printRequested,
} from './configuration-slice';
import configurationReducer, {
  type GridMakerState,
} from './configuration-slice';
import { isSameConfiguration } from '../configuration-values';

/** How long a field change waits before it settles into the render state. */
export const DEBOUNCE_MS = 300;

/** The store's state tree. It also types the listener middleware. */
type StoreState = { gridMaker: GridMakerState };

/**
 * Build a store with its own listener middleware. The app uses the single
 * `store` below. Tests call this to get an isolated store per test.
 */
export function makeStore() {
  // The middleware is built before the store exists, so it cannot infer the
  // state tree. `StoreState` gives the listeners typed `api.getState()` calls.
  const listenerMiddleware = createListenerMiddleware<StoreState>();

  // Debounce form edits before they reach `settled`. The canvas re-rasterizes
  // the whole grid on every settle, so keystrokes land in `draft` first.
  // Earlier listeners are cancelled, so only the last edit inside the window
  // settles.
  listenerMiddleware.startListening({
    actionCreator: fieldChanged,
    effect: async (_, api) => {
      api.cancelActiveListeners();
      await api.delay(DEBOUNCE_MS);
      const { draft, settled } = api.getState().gridMaker;
      if (!isSameConfiguration(draft, settled)) {
        api.dispatch(configurationSettled());
      }
    },
  });

  // A print request for an already settled configuration prints right away.
  // The grid in the document already matches the form.
  listenerMiddleware.startListening({
    actionCreator: printRequested,
    effect: (_, api) => {
      const { draft, settled } = api.getState().gridMaker;
      if (isSameConfiguration(draft, settled)) {
        api.dispatch(printReady());
      }
    },
  });

  // A print request inside the debounce window waits for the configuration
  // to settle. This stops it from printing the previous grid.
  listenerMiddleware.startListening({
    actionCreator: configurationSettled,
    effect: (_, api) => {
      if (api.getState().gridMaker.printPending) {
        api.dispatch(printReady());
      }
    },
  });

  return configureStore({
    reducer: {
      gridMaker: configurationReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listenerMiddleware.middleware),
    devTools: {
      name: 'grid-maker',
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
