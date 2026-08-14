export type UnitName = 'pixel' | 'inch';

/**
 * See https://michalzalecki.com/nominal-typing-in-typescript/ for
 */
export type Unit<Name extends UnitName, T> = T & { __unit: Name };

export type NumberUnit<Name extends UnitName> = Unit<Name, number>;

/**
 * A css pixel unit (1/96 of an inch)
 */
export type Pixel = NumberUnit<'pixel'>;

/**
 * A css inch
 */
export type Inch = NumberUnit<'inch'>;

export function inchToPixel(inch: Inch): Pixel {
  if (isNaN(inch)) {
    return 0 as Pixel;
  }

  return Math.floor(inch * 96) as Pixel;
}

export function isValidPixel(inch: Inch): boolean {
  return !isNaN(inch) && inchToPixel(inch) !== 0;
}
