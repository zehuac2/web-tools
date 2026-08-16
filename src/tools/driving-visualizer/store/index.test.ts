import { describe, it, expect, vi } from 'vitest';
import type { ActionCreatorWithoutPayload } from '@reduxjs/toolkit';
import { DEFAULT_PARAMS } from '../sim/CarModel';
import { addAppListener, makeStore } from './index';
import { setSpeed } from './carParamsSlice';
import {
  centerCamera,
  centerSteering,
  clearTraces,
  resetPose,
} from './sceneActions';
import { toggleFillVisible } from './uiSlice';

// Every scene command, in the order Scene subscribes to them.
const sceneCommands: [string, ActionCreatorWithoutPayload][] = [
  ['resetPose', resetPose],
  ['clearTraces', clearTraces],
  ['centerSteering', centerSteering],
  ['centerCamera', centerCamera],
];

describe('makeStore', () => {
  it('mounts every slice at its initial state', () => {
    expect(makeStore().getState()).toEqual({
      carParams: DEFAULT_PARAMS,
      telemetry: {
        x: 0,
        y: 0,
        headingDeg: 90,
        steeringDeg: 0,
        turningRadius: Infinity,
        speed: DEFAULT_PARAMS.speed,
        driving: false,
      },
      ui: { fillVisible: true },
    });
  });

  it('gives each store its own state', () => {
    const first = makeStore();
    const second = makeStore();

    first.dispatch(setSpeed(15));
    first.dispatch(toggleFillVisible());

    expect(second.getState().carParams.speed).toBe(DEFAULT_PARAMS.speed);
    expect(second.getState().ui.fillVisible).toBe(true);
  });
});

describe('scene command listeners', () => {
  it.each(sceneCommands)('delivers %s to its listener', (_name, command) => {
    const store = makeStore();
    const effect = vi.fn();
    store.dispatch(addAppListener({ actionCreator: command, effect }));

    store.dispatch(command());

    expect(effect).toHaveBeenCalledTimes(1);
  });

  it('delivers a command only to the listener that asked for it', () => {
    const store = makeStore();
    const onReset = vi.fn();
    const onClear = vi.fn();
    store.dispatch(
      addAppListener({ actionCreator: resetPose, effect: onReset }),
    );
    store.dispatch(
      addAppListener({ actionCreator: clearTraces, effect: onClear }),
    );

    store.dispatch(resetPose());

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onClear).not.toHaveBeenCalled();
  });

  it('stops delivery after the listener unsubscribes', () => {
    // Scene unsubscribes in its useEffect cleanup. A leak here would run every
    // scene command twice after a remount.
    const store = makeStore();
    const effect = vi.fn();
    const unsubscribe = store.dispatch(
      addAppListener({ actionCreator: resetPose, effect }),
    );

    store.dispatch(resetPose());
    unsubscribe();
    store.dispatch(resetPose());

    expect(effect).toHaveBeenCalledTimes(1);
  });

  it('keeps listeners on the store they were added to', () => {
    const subscribed = makeStore();
    const other = makeStore();
    const effect = vi.fn();
    subscribed.dispatch(addAppListener({ actionCreator: resetPose, effect }));

    other.dispatch(resetPose());

    expect(effect).not.toHaveBeenCalled();
  });

  it.each(sceneCommands)(
    'leaves reducer state untouched for %s',
    (_name, command) => {
      const store = makeStore();
      const before = store.getState();

      store.dispatch(command());

      expect(store.getState()).toBe(before);
    },
  );
});
