import { defineRecipe } from '@pandacss/dev';

export const cardRecipe = defineRecipe({
  className: 'card',
  description: 'Styles for card component',
  base: {
    bg: 'surface.card',
    border: { base: 'subtle', _print: 'none' },
    borderRadius: { base: 'card', _print: '[0]' },
    boxShadow: { base: 'card', _print: '[none]' },
    p: { base: '5', _print: '0' },
  },
});
