import { describe, it, expect, vi, afterEach } from 'vitest';

import { THEME_BOOT_SCRIPT } from './bootScript';
import {
  applyTheme,
  isThemePreference,
  nextPreference,
  readAppliedTheme,
  readPreference,
  resolveTheme,
  systemTheme,
  writePreference,
  THEME_ATTRIBUTE,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from './theme';

/** Stub `matchMedia`, which jsdom does not implement. */
function stubMatchMedia(matches: boolean): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
  document.documentElement.removeAttribute(THEME_ATTRIBUTE);
});

describe('resolveTheme', () => {
  const cases: [ThemePreference, ResolvedTheme, ResolvedTheme][] = [
    ['light', 'dark', 'light'],
    ['light', 'light', 'light'],
    ['dark', 'light', 'dark'],
    ['dark', 'dark', 'dark'],
    ['system', 'light', 'light'],
    ['system', 'dark', 'dark'],
  ];

  it.each(cases)('%s preference on a %s system gives %s', (p, s, want) => {
    expect(resolveTheme(p, s)).toBe(want);
  });
});

describe('nextPreference', () => {
  it('cycles system, light, dark', () => {
    expect(nextPreference('system')).toBe('light');
    expect(nextPreference('light')).toBe('dark');
    expect(nextPreference('dark')).toBe('system');
  });

  it('returns to the start after three steps', () => {
    const start: ThemePreference = 'system';
    expect(nextPreference(nextPreference(nextPreference(start)))).toBe(start);
  });
});

describe('isThemePreference', () => {
  it('accepts the three valid values', () => {
    expect(isThemePreference('system')).toBe(true);
    expect(isThemePreference('light')).toBe(true);
    expect(isThemePreference('dark')).toBe(true);
  });

  it.each([null, undefined, '', 'Dark', 'auto', {}, 0])(
    'rejects %o',
    (value) => {
      expect(isThemePreference(value)).toBe(false);
    },
  );
});

describe('readPreference', () => {
  it('round-trips a valid stored value', () => {
    writePreference('dark');
    expect(readPreference()).toBe('dark');
  });

  it.each(['nonsense', ''])('falls back to system for %o', (stored) => {
    localStorage.setItem(THEME_STORAGE_KEY, stored);
    expect(readPreference()).toBe('system');
  });

  it('falls back to system when nothing is stored', () => {
    expect(readPreference()).toBe('system');
  });

  it('falls back to system when getItem throws', () => {
    const storage = {
      getItem: vi.fn(() => {
        throw new Error('private mode');
      }),
    };
    expect(readPreference(storage)).toBe('system');
  });
});

describe('writePreference', () => {
  it('writes the key', () => {
    writePreference('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('swallows a throwing setItem', () => {
    const storage = {
      setItem: vi.fn(() => {
        throw new Error('quota');
      }),
    };
    expect(() => writePreference('dark', storage)).not.toThrow();
  });
});

describe('systemTheme', () => {
  it('reports dark when the query matches', () => {
    stubMatchMedia(true);
    expect(systemTheme()).toBe('dark');
  });

  it('reports light when the query does not match', () => {
    stubMatchMedia(false);
    expect(systemTheme()).toBe('light');
  });

  it('reports light when matchMedia is absent', () => {
    // This is jsdom's real state, so the guard is load-bearing.
    expect(globalThis.matchMedia).toBeUndefined();
    expect(systemTheme()).toBe('light');
  });
});

describe('readAppliedTheme', () => {
  it('reads the attribute', () => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, 'dark');
    expect(readAppliedTheme()).toBe('dark');
  });

  it.each([undefined, 'nonsense'])('falls back to light for %o', (value) => {
    if (value) document.documentElement.setAttribute(THEME_ATTRIBUTE, value);
    expect(readAppliedTheme()).toBe('light');
  });
});

describe('applyTheme', () => {
  it('writes the concrete value and returns it', () => {
    expect(applyTheme('dark')).toBe('dark');
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
  });

  it('resolves system through matchMedia', () => {
    stubMatchMedia(true);
    expect(applyTheme('system')).toBe('dark');
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
  });

  it('sets the attribute before it dispatches', () => {
    // Subscribers read resolved token values with getComputedStyle, which is
    // only correct once the attribute is set.
    const seen = vi.fn();
    const listener = () =>
      seen(document.documentElement.getAttribute(THEME_ATTRIBUTE));

    window.addEventListener(THEME_CHANGE_EVENT, listener);
    applyTheme('dark');
    window.removeEventListener(THEME_CHANGE_EVENT, listener);

    expect(seen).toHaveBeenCalledWith('dark');
  });

  it('dispatches even when the concrete theme does not move', () => {
    stubMatchMedia(true);
    applyTheme('dark');

    const listener = vi.fn();
    window.addEventListener(THEME_CHANGE_EVENT, listener);
    // Still resolves to dark, but the preference changed.
    expect(applyTheme('system')).toBe('dark');
    window.removeEventListener(THEME_CHANGE_EVENT, listener);

    expect(listener).toHaveBeenCalledOnce();
  });
});

describe('THEME_BOOT_SCRIPT', () => {
  const run = () => new Function(THEME_BOOT_SCRIPT)();
  const applied = () => document.documentElement.getAttribute(THEME_ATTRIBUTE);

  it.each(['dark', 'light'])('applies the stored %s preference', (stored) => {
    stubMatchMedia(stored === 'light');
    localStorage.setItem(THEME_STORAGE_KEY, stored);
    run();
    expect(applied()).toBe(stored);
  });

  it.each(['system', 'nonsense'])(
    'resolves %o through matchMedia',
    (stored) => {
      stubMatchMedia(true);
      localStorage.setItem(THEME_STORAGE_KEY, stored);
      run();
      expect(applied()).toBe('dark');
    },
  );

  it('still sets the attribute when matchMedia throws', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => {
        throw new Error('unsupported');
      }),
    );
    run();
    expect(applied()).toBe('light');
  });
});
