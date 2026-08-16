import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { renderWithStore } from '@/tools/driving-visualizer/testStore';
import { DEFAULT_PARAMS } from '@/tools/driving-visualizer/sim/CarModel';
import ParameterPanel from './ParameterPanel';

// SliderRow sets aria-label from its label, so each slider is reachable by name.
function slider(label: string): HTMLInputElement {
  return screen.getByLabelText(label);
}

/** Drives a range input. userEvent does not handle range inputs well. */
function setSlider(label: string, value: number): void {
  fireEvent.change(slider(label), { target: { value: String(value) } });
}

describe('ParameterPanel', () => {
  it('shows one slider per car parameter', () => {
    renderWithStore(<ParameterPanel />);

    expect(screen.getAllByRole('slider')).toHaveLength(7);
  });

  it('shows the store values in metres', () => {
    renderWithStore(<ParameterPanel />);

    expect(slider('Wheelbase').value).toBe(String(DEFAULT_PARAMS.wheelbase));
    expect(slider('Body Width').value).toBe(String(DEFAULT_PARAMS.bodyWidth));
    expect(slider('Speed').value).toBe(String(DEFAULT_PARAMS.speed));
  });

  it('converts the stored steering angles to degrees for display', () => {
    // DEFAULT_PARAMS holds radians. The panel is the only place that converts.
    // The round trip is not exact: 60° comes back as 59.99999999999999. The
    // readout rounds to 0 decimals, so the user still sees a whole degree.
    renderWithStore(<ParameterPanel />);

    expect(Number(slider('Max Steering Angle').value)).toBeCloseTo(35);
    expect(Number(slider('Steering Rate').value)).toBeCloseTo(60);
    expect(screen.getByText('35')).toBeVisible();
    expect(screen.getByText('60')).toBeVisible();
  });

  it('stores a new wheelbase as the slider reports it', () => {
    const { store } = renderWithStore(<ParameterPanel />);

    setSlider('Wheelbase', 3.5);

    expect(store.getState().carParams.wheelbase).toBe(3.5);
  });

  it('converts a steering angle back to radians before storing it', () => {
    const { store } = renderWithStore(<ParameterPanel />);

    setSlider('Max Steering Angle', 40);

    expect(store.getState().carParams.maxSteeringAngle).toBeCloseTo(
      (40 * Math.PI) / 180,
    );
  });

  it('converts a steering rate back to radians before storing it', () => {
    const { store } = renderWithStore(<ParameterPanel />);

    setSlider('Steering Rate', 90);

    expect(store.getState().carParams.steeringRate).toBeCloseTo(
      (90 * Math.PI) / 180,
    );
  });

  it('leaves the other parameters alone when one slider moves', () => {
    const { store } = renderWithStore(<ParameterPanel />);

    setSlider('Speed', 10);

    expect(store.getState().carParams).toEqual({
      ...DEFAULT_PARAMS,
      speed: 10,
    });
  });

  it('shows the new value after the store updates', () => {
    renderWithStore(<ParameterPanel />);

    setSlider('Body Width', 2.5);

    expect(slider('Body Width').value).toBe('2.5');
  });

  it('collapses the sliders on request', async () => {
    renderWithStore(<ParameterPanel />);

    await userEvent.click(screen.getByRole('button', { name: 'Hide sliders' }));

    expect(screen.queryAllByRole('slider')).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'Show sliders' })).toBeVisible();
  });
});
