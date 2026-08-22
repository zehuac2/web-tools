import { type Papers } from './papers';
import { type Inch, type Pixel } from './units';

export interface ConfigurationValues {
  paperKey: keyof typeof Papers;
  cellSize: Inch;
  fontSize: Pixel;
}

export const DEFAULT_CONFIGURATION_VALUES: ConfigurationValues = {
  paperKey: 'US_ENVELOPE_9',
  cellSize: 0.2 as Inch,
  fontSize: 6 as Pixel,
};

/**
 * Compare two configurations field by field.
 *
 * `Object.is` is used because a cleared number input gives `NaN`, and `NaN`
 * must count as unchanged.
 */
export function isSameConfiguration(
  a: ConfigurationValues,
  b: ConfigurationValues,
): boolean {
  return (
    Object.is(a.paperKey, b.paperKey) &&
    Object.is(a.cellSize, b.cellSize) &&
    Object.is(a.fontSize, b.fontSize)
  );
}
