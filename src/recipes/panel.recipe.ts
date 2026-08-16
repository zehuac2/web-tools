import { defineRecipe } from '@pandacss/dev';

export const panelRecipe = defineRecipe({
  className: 'panel',
  description:
    'Styles for a muted, bordered sub-panel (info box, breakdown, telemetry)',
  base: {
    p: '3.5',
    borderRadius: 'card',
    borderWidth: '[1px]',
    borderStyle: 'solid',
    borderColor: 'border.default',
    bg: 'bg.canvas',
    color: 'fg.muted',
    fontSize: 'sm',
  },
});
