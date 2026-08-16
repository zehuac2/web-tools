import { describe, it, expect } from 'vitest';
import uiSlice, { toggleFillVisible, type UiState } from './uiSlice';

const reducer = uiSlice.reducer;

function initial(): UiState {
  return reducer(undefined, { type: '@@INIT' });
}

describe('uiSlice', () => {
  it('starts with the swept-area fill visible', () => {
    expect(initial()).toEqual({ fillVisible: true });
  });

  it('hides the fill on the first toggle', () => {
    expect(reducer(initial(), toggleFillVisible())).toEqual({
      fillVisible: false,
    });
  });

  it('returns to visible on the second toggle', () => {
    const hidden = reducer(initial(), toggleFillVisible());

    expect(reducer(hidden, toggleFillVisible())).toEqual({
      fillVisible: true,
    });
  });

  it('ignores an action it does not own', () => {
    const state = initial();
    expect(reducer(state, { type: 'other/action' })).toBe(state);
  });
});
