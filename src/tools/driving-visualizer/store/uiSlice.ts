import { createSlice } from '@reduxjs/toolkit';

export interface UiState {
  fillVisible: boolean;
}

const initialState: UiState = {
  fillVisible: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleFillVisible(state) {
      state.fillVisible = !state.fillVisible;
    },
  },
});

export const { toggleFillVisible } = uiSlice.actions;
export default uiSlice.reducer;
