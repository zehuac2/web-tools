import { defineConfig } from '@pandacss/dev';
import { buttonRecipe } from './src/recipes/button.recipe';
import { cardRecipe } from './src/recipes/card.recipe';
import { controlRecipe } from './src/recipes/control.recipe';
import { overlayRecipe } from './src/recipes/overlay.recipe';
import { panelRecipe } from './src/recipes/panel.recipe';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  strictTokens: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx,astro}'],

  // Files to exclude
  exclude: [],

  // Generates JSX utilities with options of React, Preact, Qwik, Solid, Vue
  jsxFramework: 'react',

  cssVarRoot: ':where(:root, :host)',

  // Useful for theme customization
  theme: {
    extend: {
      breakpoints: {
        xs: '480px',
      },
      tokens: {
        colors: {
          white: {
            DEFAULT: { value: '#ffffff' },
            a1: { value: 'rgba(255, 255, 255, 0.8)' },
          },
          gray: {
            1: { value: '#f8fafc' },
            2: { value: '#f1f5f9' },
            3: { value: '#64748b' },
            4: { value: '#0f172a' },
            5: { value: '#111827' },
            // Opaque, visible-but-subtle gray. three.js Color drops alpha, so
            // the driving visualizer's ground grid needs a solid swatch
            // instead of the a1/a2 overlay tokens used in the DOM.
            6: { value: '#cbd5e1' },
            a1: { value: 'rgba(15, 23, 42, 0.12)' },
            a2: { value: 'rgba(15, 23, 42, 0.18)' },
          },
          blue: {
            a1: { value: 'rgba(2, 132, 199, 0.65)' },
            a2: { value: 'rgba(2, 132, 199, 0.2)' },
            // Opaque variant. three.js Color drops alpha, so the driving
            // visualizer's scene materials need a solid swatch, not a1/a2.
            solid: { value: '#0284c7' },
          },
          red: {
            1: { value: '#b91c1c' },
          },
          green: {
            1: { value: '#15803d' },
          },
          // Swept-trail colors for the driving visualizer. Saturated enough
          // to stay legible against the light canvas. All opaque, for the
          // same reason as blue.solid above.
          amber: {
            1: { value: '#d97706' },
          },
          teal: {
            1: { value: '#0d9488' },
          },
          violet: {
            1: { value: '#7c3aed' },
          },
          rose: {
            1: { value: '#e11d48' },
          },
        },
        spacing: {},
        sizes: {
          page: { value: '75rem' }, // 1200px, centered header/main column
          sidebar: { value: '23.125rem' }, // 370px, settings column in tool layouts
          telemetry: { value: '12.5rem' }, // 200px, telemetry readout floor width
        },
        fontWeights: {
          demibold: { value: '650' },
        },
        fonts: {
          sans: {
            value:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
          },
          mono: {
            value: "'SF Mono', 'Monaco', 'Consolas', ui-monospace, monospace",
          },
        },
      },
      semanticTokens: {
        colors: {
          bg: {
            canvas: {
              value: '{colors.gray.1}',
              description: 'Page background (light)',
            },
            subtle: {
              value: '{colors.gray.2}',
              description: 'Page background subtle (light)',
            },
          },
          surface: {
            card: {
              value: '{colors.white}',
              description: 'Card/background surface',
            },
            glass: {
              value: '{colors.white.a1}',
              description: 'Translucent surface for sticky header',
            },
          },
          fg: {
            default: { value: '{colors.gray.4}', description: 'Primary text' },
            muted: { value: '{colors.gray.3}', description: 'Muted text' },
            hover: { value: '{colors.gray.3}', description: 'Hovered text' },
            onBrand: {
              value: '{colors.white}',
              description: 'Text on brand surfaces',
            },
          },
          border: {
            default: {
              value: '{colors.gray.a1}',
              description: 'Subtle border',
            },
            strong: {
              value: '{colors.gray.a2}',
              description: 'Stronger border (e.g. canvas preview)',
            },
          },
          brand: {
            solid: {
              value: '{colors.gray.4}',
              description: 'Primary action background',
            },
            hover: {
              value: '{colors.gray.5}',
              description: 'Primary action hover background',
            },
          },
          accent: {
            solid: {
              value: '{colors.blue.a1}',
              description: 'Accent for active toggle buttons',
            },
            subtle: {
              value: '{colors.blue.a2}',
              description: 'Accent background for active toggle buttons',
            },
          },
          focus: {
            border: {
              value: '{colors.blue.a1}',
              description: 'Focus border color',
            },
          },
          danger: {
            fg: { value: '{colors.red.1}', description: 'Error text color' },
          },
          positive: {
            fg: {
              value: '{colors.green.1}',
              description: 'Positive result text color',
            },
          },
          grid: {
            text: {
              value: '{colors.gray.4}',
              description: 'Grid text color',
            },
            line: {
              value: '{colors.gray.a1}',
              description: 'Grid line color',
            },
          },
          scene: {
            bg: {
              value: '{colors.gray.1}',
              description: 'Driving visualizer 3D scene background',
            },
            grid: {
              value: '{colors.gray.6}',
              description: 'Driving visualizer ground grid lines',
            },
            origin: {
              value: '{colors.red.1}',
              description: 'Origin marker',
            },
            body: {
              value: '{colors.blue.solid}',
              description: 'Car body fill',
            },
            bodyOutline: {
              value: '{colors.gray.4}',
              description: 'Car body outline',
            },
            wheel: {
              value: '{colors.gray.3}',
              description: 'Car wheel fill',
            },
            wheelOutline: {
              value: '{colors.gray.4}',
              description: 'Car wheel outline',
            },
            trailFrontLeft: {
              value: '{colors.blue.solid}',
              description: 'Front-left corner swept-trail color',
            },
            trailFrontRight: {
              value: '{colors.teal.1}',
              description: 'Front-right corner swept-trail color',
            },
            trailRearLeft: {
              value: '{colors.amber.1}',
              description: 'Rear-left corner swept-trail color',
            },
            trailRearRight: {
              value: '{colors.rose.1}',
              description: 'Rear-right corner swept-trail color',
            },
            fill: {
              value: '{colors.gray.4}',
              description: 'Swept-area translucent fill tint',
            },
          },
        },
        radii: {
          card: { value: '{radii.xl}', description: 'Card radius' },
          control: { value: '{radii.lg}', description: 'Form control radius' },
          inner: { value: '{radii.lg}', description: 'Inner container radius' },
        },
        borders: {
          subtle: {
            value: '1px solid {colors.border.default}',
            description: 'Default hairline border',
          },
          strong: {
            value: '1px solid {colors.border.strong}',
            description:
              'Stronger hairline border (canvas preview, HUD panels)',
          },
        },
        shadows: {
          card: {
            value: '0 12px 30px rgba(15, 23, 42, 0.08)',
            description: 'Card shadow',
          },
          subtle: {
            value: '0 1px 3px rgba(15, 23, 42, 0.08)',
            description: 'Subtle shadow',
          },
          focus: {
            value: '0 0 0 3px {colors.blue.a2}',
            description: 'Focus ring shadow',
          },
        },
        fontWeights: {
          ui: {
            value: '{fontWeights.demibold}',
            description: 'UI semibold (650)',
          },
        },
        fonts: {
          body: {
            value: '{fonts.sans}',
            description: 'Default UI font stack',
          },
          grid: {
            // Only use non-copyrighted fonts because the grid can be printed.
            value: 'Roboto, Arial, "Open Sans", sans-serif',
            description: 'Grid font stack',
          },
        },
      },
      recipes: {
        button: buttonRecipe,
        card: cardRecipe,
        control: controlRecipe,
        overlay: overlayRecipe,
        panel: panelRecipe,
      },
    },
  },

  // `OverlayPanel` forwards `placement` as a prop, so the static extractor
  // cannot tell which variants are in use. Emit all of them.
  staticCss: {
    recipes: {
      overlay: [{ placement: ['*'] }],
    },
  },

  globalCss: {
    'html, body': {
      fontFamily: 'body',
      color: 'fg.default',
      bg: 'bg.canvas',
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
});
