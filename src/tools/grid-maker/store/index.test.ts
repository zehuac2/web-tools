import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  DEFAULT_CONFIGURATION_VALUES,
  type ConfigurationValues,
} from '../configuration-values';
import { type Inch } from '../units';
import { fieldChanged, printRequested } from './configuration-slice';
import { makeStore, DEBOUNCE_MS } from './index';

describe('grid-maker store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Settles a field change after the debounce window', async () => {
    const store = makeStore();

    expect(store.getState().gridMaker.settled.cellSize).to.equal(0.2);

    store.dispatch(fieldChanged({ cellSize: 0.5 as Inch }));

    // Inside the debounce window the render state is unchanged.
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS - 1);
    expect(store.getState().gridMaker.settled.cellSize).to.equal(0.2);

    await vi.advanceTimersByTimeAsync(1);
    expect(store.getState().gridMaker.settled.cellSize).to.equal(0.5);
  });

  it('Restarts the debounce window on every field change', async () => {
    const store = makeStore();

    store.dispatch(fieldChanged({ cellSize: 0.3 as Inch }));
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS - 100);
    store.dispatch(fieldChanged({ cellSize: 0.5 as Inch }));
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS - 100);

    // The second change cancelled the first timer, so nothing settled yet.
    expect(store.getState().gridMaker.settled.cellSize).to.equal(0.2);

    await vi.advanceTimersByTimeAsync(100);
    expect(store.getState().gridMaker.settled.cellSize).to.equal(0.5);
  });

  it('Ignores an unchanged field change', async () => {
    const store = makeStore();
    const settledBefore = store.getState().gridMaker.settled;

    store.dispatch(
      fieldChanged({ cellSize: DEFAULT_CONFIGURATION_VALUES.cellSize }),
    );
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);

    // A settle always creates a new settled object. The same reference means
    // no settle was dispatched.
    expect(store.getState().gridMaker.settled).to.equal(settledBefore);
  });

  it('Print waits for the configuration to settle', async () => {
    const store = makeStore();

    store.dispatch(fieldChanged({ cellSize: 0.5 as Inch }));
    store.dispatch(printRequested());

    expect(store.getState().gridMaker.printPending).to.be.true;

    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);

    const { settled, printPending } = store.getState().gridMaker;
    // The render state settles before the print request goes out.
    expect(settled.cellSize).to.equal(0.5);
    expect(printPending).to.be.false;
  });

  it('Print fires right away for a settled configuration', async () => {
    const store = makeStore();
    const initial: ConfigurationValues = store.getState().gridMaker.settled;

    store.dispatch(printRequested());
    await vi.advanceTimersByTimeAsync(0);

    expect(store.getState().gridMaker.printPending).to.be.false;
    expect(store.getState().gridMaker.settled).to.equal(initial);
  });
});
