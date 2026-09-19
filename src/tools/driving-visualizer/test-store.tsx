// Test-only helper. It renders a component against a fresh store, so no test
// leaks state or listener subscriptions into the next one.

import type { ReactElement } from 'react';
import { render, type RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeStore, type AppStore } from './store/index';

export interface RenderWithStoreResult extends RenderResult {
  store: AppStore;
}

/**
 * Renders `ui` inside a Redux `<Provider>`.
 *
 * 1. Pass a store to seed state or to register listeners before the render.
 * 2. Omit it to get a new store at its initial state.
 *
 * The returned `store` lets a test dispatch into the tree and read state back.
 */
export function renderWithStore(
  ui: ReactElement,
  store: AppStore = makeStore(),
): RenderWithStoreResult {
  return { store, ...render(<Provider store={store}>{ui}</Provider>) };
}
