import { describe, it, expect } from 'vitest';
import {
  splitEqual,
  splitEqualFees,
  splitProportional,
  formatCurrency,
} from './split';

describe('formatCurrency', () => {
  it('formats a number as USD', () => {
    expect(formatCurrency(12.5)).toBe('$12.50');
  });
});

describe('splitEqual', () => {
  it('divides the order total evenly', () => {
    expect(splitEqual({ orderTotal: 100, people: 4 })).toEqual({ amount: 25 });
  });

  it('returns null when people is zero', () => {
    expect(splitEqual({ orderTotal: 100, people: 0 })).toEqual({
      amount: null,
    });
  });

  it('returns null when an input does not parse', () => {
    expect(splitEqual({ orderTotal: NaN, people: 4 })).toEqual({
      amount: null,
    });
  });
});

describe('splitEqualFees', () => {
  it('adds an equal share of fees and tips to your own subtotal', () => {
    const result = splitEqualFees({
      yourSubtotal: 20,
      orderSubtotal: 80,
      orderTotal: 100,
      people: 4,
    });
    // feesAndTips = 100 - 80 = 20; feesPerPerson = 20 / 4 = 5; amount = 20 + 5 = 25
    expect(result).toEqual({ amount: 25, feesAndTips: 20, feesPerPerson: 5 });
  });

  it('returns nulls when people is zero', () => {
    const result = splitEqualFees({
      yourSubtotal: 20,
      orderSubtotal: 80,
      orderTotal: 100,
      people: 0,
    });
    expect(result).toEqual({
      amount: null,
      feesAndTips: null,
      feesPerPerson: null,
    });
  });

  it('returns nulls when an input does not parse', () => {
    const result = splitEqualFees({
      yourSubtotal: NaN,
      orderSubtotal: 80,
      orderTotal: 100,
      people: 4,
    });
    expect(result).toEqual({
      amount: null,
      feesAndTips: null,
      feesPerPerson: null,
    });
  });
});

describe('splitProportional', () => {
  it('splits fees and tips proportionally to your share of the subtotal', () => {
    const result = splitProportional({
      yourSubtotal: 20,
      orderSubtotal: 80,
      orderTotal: 100,
    });
    // share = 20/80 = 0.25; amount = 0.25 * 100 = 25; percentage = 25
    // feesAndTips = 100 - 80 = 20; yourShareOfFeesAndTips = 0.25 * 20 = 5
    expect(result).toEqual({
      amount: 25,
      percentage: 25,
      feesAndTips: 20,
      yourShareOfFeesAndTips: 5,
    });
  });

  it('returns nulls when orderSubtotal is zero', () => {
    const result = splitProportional({
      yourSubtotal: 20,
      orderSubtotal: 0,
      orderTotal: 100,
    });
    expect(result).toEqual({
      amount: null,
      percentage: null,
      feesAndTips: null,
      yourShareOfFeesAndTips: null,
    });
  });

  it('returns nulls when an input does not parse', () => {
    const result = splitProportional({
      yourSubtotal: 20,
      orderSubtotal: 80,
      orderTotal: NaN,
    });
    expect(result).toEqual({
      amount: null,
      percentage: null,
      feesAndTips: null,
      yourShareOfFeesAndTips: null,
    });
  });
});
