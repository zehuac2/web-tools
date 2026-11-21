import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  type ConfigurationValues,
  DEFAULT_CONFIGURATION_VALUES,
} from '../configuration-values';

export type GridMakerState = {
  /** The values the form holds right now. Updates on every keystroke. */
  draft: ConfigurationValues;
  /** The debounced values the preview renders. Updates only after a settle. */
  settled: ConfigurationValues;
  /** True while a print request waits for the configuration to settle. */
  printPending: boolean;
};

const initialState: GridMakerState = {
  draft: DEFAULT_CONFIGURATION_VALUES,
  settled: DEFAULT_CONFIGURATION_VALUES,
  printPending: false,
};

const configurationSlice = createSlice({
  name: 'gridMaker',
  initialState,
  reducers: {
    fieldChanged(state, action: PayloadAction<Partial<ConfigurationValues>>) {
      state.draft = { ...state.draft, ...action.payload };
    },
    configurationSettled(state) {
      state.settled = { ...state.draft };
    },
    printRequested(state) {
      state.printPending = true;
    },
    printReady(state) {
      state.printPending = false;
    },
  },
});

export const {
  fieldChanged,
  configurationSettled,
  printRequested,
  printReady,
} = configurationSlice.actions;
export default configurationSlice.reducer;
