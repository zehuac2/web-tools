import { useSyncExternalStore } from 'react';

import {
  getResolvedTheme,
  getServerResolvedTheme,
  getServerThemeSnapshot,
  getThemeSnapshot,
  subscribeToTheme,
} from './store';
import {
  applyTheme,
  nextPreference,
  writePreference,
  type ResolvedTheme,
  type ThemePreference,
} from './theme';

export interface UseThemeResult {
  /** The stored preference. `system` follows the operating system. */
  preference: ThemePreference;
  /** The concrete theme now on `<html>`. */
  resolved: ResolvedTheme;
  /** Persist a preference and apply it. */
  setPreference: (preference: ThemePreference) => void;
  /** Step to the next preference, then persist and apply it. */
  cyclePreference: () => void;
}

/**
 * Read and set the theme.
 *
 * `useSyncExternalStore` supplies a server snapshot, so this is safe in a
 * `client:load` island. React uses that snapshot for both the server render
 * and the hydration render, so the markup matches.
 */
export function useTheme(): UseThemeResult {
  const { preference, resolved } = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const setPreference = (next: ThemePreference) => {
    writePreference(next);
    applyTheme(next);
  };

  return {
    preference,
    resolved,
    setPreference,
    cyclePreference: () => setPreference(nextPreference(preference)),
  };
}

/**
 * Read only the concrete theme.
 *
 * This returns a primitive, so a consumer does not re-render when only the
 * preference label changes, such as `dark` to `system` under a dark OS.
 */
export function useResolvedTheme(): ResolvedTheme {
  return useSyncExternalStore(
    subscribeToTheme,
    getResolvedTheme,
    getServerResolvedTheme,
  );
}
