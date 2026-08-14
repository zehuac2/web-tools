import { expect, test } from 'vitest';
import { getGridTextVariable, getGridLineVariable, getGridFont } from './theme';

const isCSSVariable = (value: string) => value.startsWith('--');
const isNotCSSVariable = (value: string) => !value.startsWith('--');

test('variables', () => {
  expect(getGridTextVariable()).toSatisfy(isCSSVariable);
  expect(getGridLineVariable()).toSatisfy(isCSSVariable);
});

test('values', () => {
  expect(getGridFont()).toSatisfy(isNotCSSVariable);
});
