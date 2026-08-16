import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { ActionCreatorWithoutPayload } from '@reduxjs/toolkit';
import { renderWithStore } from '@/tools/driving-visualizer/testStore';
import {
  addAppListener,
  makeStore,
} from '@/tools/driving-visualizer/store/index';
import {
  centerCamera,
  centerSteering,
  clearTraces,
  resetPose,
} from '@/tools/driving-visualizer/store/sceneActions';
import Toolbar from './Toolbar';

// Each button and the scene command it must send. The fill toggle is not here
// because it writes reducer state instead of commanding the scene.
const commandButtons: [string, ActionCreatorWithoutPayload][] = [
  ['↺ Reset Pose', resetPose],
  ['⌫ Clear Traces', clearTraces],
  ['⟵ Center Steering', centerSteering],
  ['⊙ Follow Car', centerCamera],
];

describe('Toolbar', () => {
  it('renders one button per action', () => {
    renderWithStore(<Toolbar />);

    expect(screen.getAllByRole('button')).toHaveLength(5);
  });

  it.each(commandButtons)(
    'dispatches its scene command when %s is clicked',
    async (label, command) => {
      // Listen the same way Scene does, so this fails if the wiring breaks.
      const store = makeStore();
      const effect = vi.fn();
      store.dispatch(addAppListener({ actionCreator: command, effect }));
      renderWithStore(<Toolbar />, store);

      await userEvent.click(screen.getByRole('button', { name: label }));

      expect(effect).toHaveBeenCalledTimes(1);
    },
  );

  it('offers to hide the fill while the fill is visible', () => {
    renderWithStore(<Toolbar />);

    expect(screen.getByRole('button', { name: '◈ Hide Fill' })).toBeVisible();
  });

  it('hides the fill and flips its own label when clicked', async () => {
    const { store } = renderWithStore(<Toolbar />);

    await userEvent.click(screen.getByRole('button', { name: '◈ Hide Fill' }));

    expect(store.getState().ui.fillVisible).toBe(false);
    expect(screen.getByRole('button', { name: '◈ Show Fill' })).toBeVisible();
  });

  it('shows the fill again on a second click', async () => {
    const { store } = renderWithStore(<Toolbar />);

    await userEvent.click(screen.getByRole('button', { name: '◈ Hide Fill' }));
    await userEvent.click(screen.getByRole('button', { name: '◈ Show Fill' }));

    expect(store.getState().ui.fillVisible).toBe(true);
  });
});
