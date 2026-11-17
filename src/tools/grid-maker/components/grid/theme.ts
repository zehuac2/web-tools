import { token } from 'styled-system/tokens';
import type { Token } from 'styled-system/types';

function getVariable(t: Token): string {
  return token(t).replaceAll('var(', '').replaceAll(')', '');
}

export function getGridTextVariable(): string {
  return getVariable('colors.grid.text');
}

export function getGridLineVariable(): string {
  return getVariable('colors.grid.line');
}

export function getGridFont(): string {
  return getVariable('fonts.grid');
}
