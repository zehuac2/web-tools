// Pure receipt-splitting math. No React, no formatting concerns beyond
// `formatCurrency`, which every strategy's UI needs.

export type Strategy = 'equal' | 'equalFees' | 'proportional';

export interface EqualInputs {
  orderTotal: number;
  people: number;
}

export interface EqualResult {
  /** What you pay. `null` when the inputs do not support a result. */
  amount: number | null;
}

export interface EqualFeesInputs {
  yourSubtotal: number;
  orderSubtotal: number;
  orderTotal: number;
  people: number;
}

export interface EqualFeesResult {
  amount: number | null;
  feesAndTips: number | null;
  feesPerPerson: number | null;
}

export interface ProportionalInputs {
  yourSubtotal: number;
  orderSubtotal: number;
  orderTotal: number;
}

export interface ProportionalResult {
  amount: number | null;
  percentage: number | null;
  feesAndTips: number | null;
  yourShareOfFeesAndTips: number | null;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function allFinite(values: readonly number[]): boolean {
  return values.every((value) => !isNaN(value));
}

/** Split the order total equally between everyone. */
export function splitEqual({ orderTotal, people }: EqualInputs): EqualResult {
  if (!allFinite([orderTotal, people]) || people === 0) {
    return { amount: null };
  }

  return { amount: orderTotal / people };
}

/** Split your own subtotal, plus an equal share of fees and tips. */
export function splitEqualFees({
  yourSubtotal,
  orderSubtotal,
  orderTotal,
  people,
}: EqualFeesInputs): EqualFeesResult {
  if (
    !allFinite([yourSubtotal, orderSubtotal, orderTotal, people]) ||
    people === 0
  ) {
    return { amount: null, feesAndTips: null, feesPerPerson: null };
  }

  const feesAndTips = orderTotal - orderSubtotal;
  const feesPerPerson = feesAndTips / people;

  return { amount: yourSubtotal + feesPerPerson, feesAndTips, feesPerPerson };
}

/** Split fees and tips in proportion to each person's share of the subtotal. */
export function splitProportional({
  yourSubtotal,
  orderSubtotal,
  orderTotal,
}: ProportionalInputs): ProportionalResult {
  if (
    !allFinite([yourSubtotal, orderSubtotal, orderTotal]) ||
    orderSubtotal === 0
  ) {
    return {
      amount: null,
      percentage: null,
      feesAndTips: null,
      yourShareOfFeesAndTips: null,
    };
  }

  const share = yourSubtotal / orderSubtotal;
  const feesAndTips = orderTotal - orderSubtotal;

  return {
    amount: share * orderTotal,
    percentage: share * 100,
    feesAndTips,
    yourShareOfFeesAndTips: share * feesAndTips,
  };
}
