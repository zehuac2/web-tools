import type { Inch } from '../units';

export interface Paper {
  readonly displayName: string;
  readonly width: Inch;
  readonly height: Inch;
}

export const Papers = {
  US_LETTER: {
    displayName: 'US Letter',
    width: 8.5 as Inch,
    height: 11 as Inch,
  },
  US_ENVELOPE_9: {
    displayName: 'US Envelope #9',
    width: 8.87 as Inch,
    height: 3.87 as Inch,
  },
  US_ENVELOPE_10: {
    displayName: 'US Envelope #10',
    width: 9.5 as Inch,
    height: 4.125 as Inch,
  },
} as const;

export type Papers = (typeof Papers)[keyof typeof Papers];
