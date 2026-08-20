import { defineRecipe } from '@pandacss/dev';

export const controlRecipe = defineRecipe({
  className: 'control',
  description: 'Styles for text/number/select form controls',
  base: {
    width: '[100%]',
    minWidth: '0',
    px: '3',
    py: '2.5',
    borderRadius: 'control',
    border: 'subtle',
    borderColor: { _focus: 'focus.border' },
    boxShadow: { base: '[none]', _focus: 'focus' },
    bg: 'bg.canvas',
    color: 'fg.default',
    fontFamily: 'body',
    fontSize: 'sm',
    outline: 'none',
  },
});
