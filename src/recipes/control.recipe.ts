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
    borderWidth: '[1px]',
    borderStyle: 'solid',
    borderColor: { base: 'border.default', _focus: 'focus.border' },
    boxShadow: { base: '[none]', _focus: 'focus' },
    bg: 'bg.canvas',
    color: 'fg.default',
    fontFamily: 'body',
    fontSize: 'ui14',
    outline: 'none',
  },
});
