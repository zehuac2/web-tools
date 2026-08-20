import { type FC } from 'react';
import { css, cx } from 'styled-system/css';
import { button } from 'styled-system/recipes';

import { useTheme } from '@/theme/useTheme';
import type { ThemePreference } from '@/theme/theme';

export interface ThemeToggleProps {
  className?: string;
}

const GLYPHS: Record<ThemePreference, string> = {
  system: '◐',
  light: '☀',
  dark: '☾',
};

const LABELS: Record<ThemePreference, string> = {
  system: 'Theme: follow system',
  light: 'Theme: light',
  dark: 'Theme: dark',
};

/**
 * Header button that steps the theme through system, light, and dark.
 *
 * The accessible name stays constant and the state rides on `aria-pressed`
 * and the title, so a screen reader announces one stable control.
 */
const ThemeToggle: FC<ThemeToggleProps> = ({ className }) => {
  const { preference, cyclePreference } = useTheme();

  return (
    <button
      type="button"
      onClick={cyclePreference}
      aria-label="Theme"
      aria-pressed={preference !== 'system'}
      title={LABELS[preference]}
      className={cx(
        button({ variant: 'ghost' }),
        // A fixed box keeps the header from reflowing as the glyph changes.
        css({
          width: '9',
          height: '9',
          p: '0',
          fontSize: 'md',
          lineHeight: '[1]',
          flexShrink: 0,
        }),
        className,
      )}
    >
      <span aria-hidden="true">{GLYPHS[preference]}</span>
    </button>
  );
};

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;
