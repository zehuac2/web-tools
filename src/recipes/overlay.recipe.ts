import { defineRecipe } from '@pandacss/dev';

export const overlayRecipe = defineRecipe({
  className: 'overlay',
  description:
    'Styles for a translucent HUD panel that floats over a full-bleed canvas',
  base: {
    position: 'absolute',
    bg: 'surface.glass',
    backdropFilter: 'auto',
    backdropBlur: 'md',
    border: 'strong',
    borderRadius: 'card',
    boxShadow: 'card',
    // Tighter than card(). This is HUD chrome, not a page panel.
    p: '3.5',
    userSelect: 'none',
    maxWidth: '[calc(100vw - token(spacing.6))]',
  },
  variants: {
    // Each placement pins the panel to one edge or corner of its positioned
    // ancestor. The inset is the spacing.3 token.
    placement: {
      topLeft: { top: '3', left: '3' },
      topRight: { top: '3', right: '3' },
      bottomCenter: {
        bottom: '3',
        left: '[50%]',
        transform: '[translateX(-50%)]',
        width: '[min(token(sizes.xl), calc(100vw - token(spacing.6)))]',
      },
      bottomRight: { bottom: '3', right: '3' },
    },
  },
});
