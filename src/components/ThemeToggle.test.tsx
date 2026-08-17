import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, afterEach } from 'vitest';

import {
  THEME_ATTRIBUTE,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from '@/theme/theme';
import ThemeToggle from './ThemeToggle';

const applied = () => document.documentElement.getAttribute(THEME_ATTRIBUTE);
const stored = () => localStorage.getItem(THEME_STORAGE_KEY);

afterEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute(THEME_ATTRIBUTE);
});

describe('ThemeToggle', () => {
  it('renders one button with a stable accessible name', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: 'Theme' })).toBeInTheDocument();
  });

  it('applies and persists the theme on click', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    // Starts at `system`, so the first click selects `light`.
    await user.click(screen.getByRole('button', { name: 'Theme' }));
    expect(stored()).toBe('light');
    expect(applied()).toBe('light');

    await user.click(screen.getByRole('button', { name: 'Theme' }));
    expect(stored()).toBe('dark');
    expect(applied()).toBe('dark');
  });

  it('returns to the starting preference after three clicks', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: 'Theme' });

    for (let i = 0; i < 3; i++) await user.click(button);

    expect(stored()).toBe('system');
  });

  it('tracks the preference, not the resolved theme', async () => {
    // `system` must stay distinguishable from an explicit choice, even though
    // both resolve to `light` with no matchMedia.
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: 'Theme' });

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('title', 'Theme: follow system');

    await user.click(button);

    expect(applied()).toBe('light');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('title', 'Theme: light');
  });

  it('keeps two mounted toggles in sync', async () => {
    // The header toggle and each tool are separate React roots, so the store
    // must broadcast across them.
    const user = userEvent.setup();
    render(
      <>
        <ThemeToggle />
        <ThemeToggle />
      </>,
    );

    const [first, second] = screen.getAllByRole('button', { name: 'Theme' });
    await user.click(first);

    expect(second).toHaveAttribute('title', 'Theme: light');
  });

  it('starts from the stored preference', () => {
    const preference: ThemePreference = 'dark';
    localStorage.setItem(THEME_STORAGE_KEY, preference);
    document.documentElement.setAttribute(THEME_ATTRIBUTE, 'dark');

    render(<ThemeToggle />);

    expect(screen.getByRole('button', { name: 'Theme' })).toHaveAttribute(
      'title',
      'Theme: dark',
    );
  });
});
