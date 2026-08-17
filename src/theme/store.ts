// External store backing `useTheme`. The header toggle and each tool mount as
// separate React roots, so React Context cannot carry the theme between them.
// A window event can.

import {
  applyTheme,
  readAppliedTheme,
  readPreference,
  PREFERS_DARK_QUERY,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from './theme';

export interface ThemeSnapshot {
  readonly preference: ThemePreference;
  readonly resolved: ResolvedTheme;
}

// One frozen object. `useSyncExternalStore` throws if `getServerSnapshot`
// returns a new object on each call.
const SERVER_SNAPSHOT: ThemeSnapshot = Object.freeze({
  preference: 'system' as ThemePreference,
  resolved: 'light' as ResolvedTheme,
});

let cached: ThemeSnapshot = SERVER_SNAPSHOT;

/**
 * Subscribe to theme changes.
 *
 * `applyTheme` is the only writer, so its event is the only notification
 * channel. The other two listeners are inputs: they re-resolve through
 * `applyTheme`, which then dispatches. That keeps one notification path.
 */
export function subscribeToTheme(onStoreChange: () => void): () => void {
  const reapply = () => {
    applyTheme(readPreference());
  };

  // The operating system changed. This only moves the theme while the
  // preference is `system`; otherwise `resolveTheme` ignores it and the
  // snapshot comparison below makes React bail out.
  const query = globalThis.matchMedia?.(PREFERS_DARK_QUERY);
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) reapply();
  };

  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  query?.addEventListener('change', reapply);
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    query?.removeEventListener('change', reapply);
    window.removeEventListener('storage', onStorage);
  };
}

/**
 * Recompute the snapshot, but keep object identity while nothing moved.
 *
 * Recomputing rather than tracking a dirty flag keeps the module
 * self-correcting, so tests need no reset hook between cases.
 */
export function getThemeSnapshot(): ThemeSnapshot {
  const preference = readPreference();
  const resolved = readAppliedTheme();

  if (preference !== cached.preference || resolved !== cached.resolved) {
    cached = { preference, resolved };
  }

  return cached;
}

export function getServerThemeSnapshot(): ThemeSnapshot {
  return SERVER_SNAPSHOT;
}

/** Primitive snapshot, for consumers that only need the concrete theme. */
export function getResolvedTheme(): ResolvedTheme {
  return getThemeSnapshot().resolved;
}

export function getServerResolvedTheme(): ResolvedTheme {
  return SERVER_SNAPSHOT.resolved;
}
