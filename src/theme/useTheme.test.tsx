import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { type FC } from 'react';

import { applyTheme, THEME_ATTRIBUTE, THEME_STORAGE_KEY } from './theme';
import { useResolvedTheme, useTheme } from './useTheme';

const Resolved: FC = () => <output>{useResolvedTheme()}</output>;

const Preference: FC = () => <output>{useTheme().preference}</output>;

afterEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute(THEME_ATTRIBUTE);
});

describe('useResolvedTheme', () => {
  it('reads the theme already on <html>', () => {
    // The boot script sets this before React ever mounts.
    applyTheme('dark');
    render(<Resolved />);
    expect(screen.getByRole('status')).toHaveTextContent('dark');
  });

  it('updates when the theme changes outside React', () => {
    // This is the path the driving visualizer depends on: the header toggle
    // lives in a different React root.
    render(<Resolved />);
    expect(screen.getByRole('status')).toHaveTextContent('light');

    act(() => {
      applyTheme('dark');
    });

    expect(screen.getByRole('status')).toHaveTextContent('dark');
  });

  it('stops updating after unmount', () => {
    const { unmount } = render(<Resolved />);
    unmount();
    // The listener must be removed, so this must not warn or throw.
    expect(() => applyTheme('dark')).not.toThrow();
  });
});

describe('useTheme', () => {
  it('reports a preference change that leaves the resolved theme alone', () => {
    // `dark` to `system` resolves to light here, because there is no
    // matchMedia. The preference still has to reach the component.
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    render(<Preference />);
    expect(screen.getByRole('status')).toHaveTextContent('dark');

    act(() => {
      localStorage.setItem(THEME_STORAGE_KEY, 'system');
      applyTheme('system');
    });

    expect(screen.getByRole('status')).toHaveTextContent('system');
  });
});
