import { defineRecipe } from '@pandacss/dev';

export const buttonRecipe = defineRecipe({
  className: 'button',
  description: 'Styles for button component',
  base: {
    all: 'unset',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    px: '3.5',
    py: '3',
    borderRadius: 'card',
    fontWeight: 'ui',
    cursor: 'pointer',
    pointerEvents: 'auto',
    transition:
      '[transform 120ms ease, background-color 120ms ease, border-color 120ms ease]',
    _active: {
      transform: '[translateY(1px)]',
    },
    '& *': {
      pointerEvents: 'none',
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
  variants: {
    variant: {
      solid: {
        bg: 'brand.solid',
        color: 'fg.onBrand',
        _hover: {
          bg: 'brand.hover',
        },
      },
      subtle: {
        bg: 'bg.canvas',
        color: 'fg.default',
        border: 'subtle',
        _hover: {
          borderColor: 'border.strong',
        },
      },
      ghost: {
        bg: '[transparent]',
        color: 'fg.muted',
        _hover: {
          color: 'fg.default',
        },
      },
    },
    pressed: {
      true: {
        bg: 'accent.subtle',
        borderColor: 'accent.solid',
        color: 'fg.default',
      },
      false: {},
    },
  },
  defaultVariants: {
    variant: 'solid',
    pressed: false,
  },
});
