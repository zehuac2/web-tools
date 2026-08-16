import { defineRecipe } from '@pandacss/dev';

export const overlayRecipe = defineRecipe({
  className: 'overlay',
  description:
    'Styles for a translucent HUD panel that floats over a full-bleed canvas',
  base: {
    position: 'absolute',
    bg: 'surface.glass',
    backdropFilter: '[blur(10px)]',
    borderWidth: '[1px]',
    borderStyle: 'solid',
    borderColor: 'border.strong',
    borderRadius: 'card',
    boxShadow: 'card',
    // Tighter than card(). This is HUD chrome, not a page panel.
    p: '3.5',
    userSelect: 'none',
    maxWidth: '[calc(100vw - 24px)]',
  },
  variants: {
    // Each placement pins the panel to one edge or corner of its positioned
    // ancestor. The 12px inset comes from the spacing.3 token.
    placement: {
      topLeft: { top: '3', left: '3' },
      topRight: { top: '3', right: '3' },
      bottomCenter: {
        bottom: '3',
        left: '[50%]',
        transform: '[translateX(-50%)]',
        width: '[min(560px, calc(100vw - 24px))]',
      },
      bottomRight: { bottom: '3', right: '3' },
    },
  },
});
