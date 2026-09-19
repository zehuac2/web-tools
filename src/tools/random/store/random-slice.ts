import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createSection, generateOutput, type RandomSection } from '../services';

export type RandomState = {
  output: string;
  sections: RandomSection[];
};

const initialState: RandomState = {
  output: 'Random String',
  sections: [createSection()],
};

const randomSlice = createSlice({
  name: 'random',
  initialState,
  reducers: {
    addSection(state) {
      state.sections.push(createSection());
    },
    deleteSection(state, action: PayloadAction<number>) {
      state.sections = state.sections.filter(
        (_, index) => index !== action.payload,
      );
    },
    updateSection(
      state,
      action: PayloadAction<{ index: number; section: RandomSection }>,
    ) {
      const { index, section } = action.payload;
      state.sections[index] = section;
    },
    generate(state) {
      if (state.sections.length === 0) {
        state.output = 'Must have at least one section';
        return;
      }

      state.output = generateOutput(state.sections);
    },
  },
});

export const { addSection, deleteSection, updateSection, generate } =
  randomSlice.actions;
export default randomSlice.reducer;
