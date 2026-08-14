import { defineRecipe } from '@pandacss/dev';

export const cardRecipe = defineRecipe({
  className: 'card',
  description: 'Styles for card component',
  base: {
    bg: 'surface.card',
    borderWidth: { base: '[1px]', _print: '[0]' },
    borderStyle: { base: 'solid', _print: 'none' },
    borderColor: 'border.default',
    borderRadius: { base: 'card', _print: '[0]' },
    boxShadow: { base: 'card', _print: '[none]' },
    p: { base: '5', _print: '0' },
  },
});
