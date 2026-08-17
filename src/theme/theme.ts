// Theme preference: storage, resolution, and the single DOM writer.
// This module is framework-free. It holds no React and no component state.
//
// `data-theme` on `<html>` is always a concrete value, never `system`. The
// inline boot script resolves the preference before first paint, so CSS and
// three.js only ever see `light` or `dark`.

/** What the user chose. `system` follows the operating system. */
export type ThemePreference = 'light' | 'dark' | 'system';

/** The concrete theme in effect. This is what `data-theme` holds. */
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'web-tools:theme';
export const THEME_ATTRIBUTE = 'data-theme';
export const THEME_CHANGE_EVENT = 'web-tools:themechange';
export const PREFERS_DARK_QUERY = '(prefers-color-scheme: dark)';
export const DEFAULT_PREFERENCE: ThemePreference = 'system';

const PREFERENCES: readonly ThemePreference[] = ['system', 'light', 'dark'];

/** Test whether an unknown value is a valid preference. */
export function isThemePreference(value: unknown): value is ThemePreference {
  return (
    typeof value === 'string' && PREFERENCES.includes(value as ThemePreference)
  );
}

/** Give the next preference in the toggle cycle: system, light, dark. */
export function nextPreference(preference: ThemePreference): ThemePreference {
  const index = PREFERENCES.indexOf(preference);
  return PREFERENCES[(index + 1) % PREFERENCES.length];
}

/** Apply the resolution rule. This is pure: it reads no DOM and no storage. */
export function resolveTheme(
  preference: ThemePreference,
  system: ResolvedTheme,
): ResolvedTheme {
  return preference === 'system' ? system : preference;
}

/**
 * Read the operating system preference.
 *
 * `matchMedia` is optional here on purpose. jsdom does not implement it, so a
 * direct call throws in every component test.
 */
export function systemTheme(): ResolvedTheme {
  return globalThis.matchMedia?.(PREFERS_DARK_QUERY).matches ? 'dark' : 'light';
}

/**
 * Read the stored preference. Any missing, unrecognized, or unreadable value
 * falls back to `system`. `localStorage` throws in Safari private mode.
 */
export function readPreference(
  storage: Pick<Storage, 'getItem'> | undefined = safeStorage(),
): ThemePreference {
  try {
    const stored = storage?.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : DEFAULT_PREFERENCE;
  } catch {
    return DEFAULT_PREFERENCE;
  }
}

/** Persist the preference. A storage failure is ignored, not thrown. */
export function writePreference(
  preference: ThemePreference,
  storage: Pick<Storage, 'setItem'> | undefined = safeStorage(),
): void {
  try {
    storage?.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Private mode or a full quota. The theme still applies for this page.
  }
}

/** Read the concrete theme now on `<html>`. */
export function readAppliedTheme(root?: HTMLElement): ResolvedTheme {
  const element = root ?? globalThis.document?.documentElement;
  return element?.getAttribute(THEME_ATTRIBUTE) === 'dark' ? 'dark' : 'light';
}

/**
 * Resolve a preference, write it to `<html>`, then announce the change.
 *
 * The order is load-bearing. Subscribers read the resolved token values with
 * `getComputedStyle`, which is only correct after the attribute is set. The
 * driving visualizer depends on this.
 *
 * This always dispatches, even when the concrete theme does not move. The
 * preference is part of the snapshot, so a `dark` to `system` change still
 * needs to reach the toggle.
 */
export function applyTheme(
  preference: ThemePreference,
  root?: HTMLElement,
): ResolvedTheme {
  const resolved = resolveTheme(preference, systemTheme());
  const element = root ?? globalThis.document?.documentElement;

  element?.setAttribute(THEME_ATTRIBUTE, resolved);
  globalThis.dispatchEvent?.(new Event(THEME_CHANGE_EVENT));

  return resolved;
}

// Touching `localStorage` throws outright in some privacy modes, so even
// reaching the object needs a guard.
function safeStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}
