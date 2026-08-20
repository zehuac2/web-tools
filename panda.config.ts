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

  // Key the light/dark conditions off `data-theme` on `<html>`, which the
  // inline script in `ToolLayout.astro` always sets to a concrete value.
  // Panda's built-in `_dark` is class-based (`.dark &`), so override it.
  // The `&[...]` half matters: `globalCss` targets `html, body`, and `<html>`
  // is the element that carries the attribute.
  conditions: {
    extend: {
      dark: '&[data-theme=dark], [data-theme=dark] &',
      light: '&[data-theme=light], [data-theme=light] &',
    },
  },

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
            // 7-13 are the dark-theme ramp. 1-6 stay the light ramp.
            7: { value: '#0b1220' },
            8: { value: '#111c2e' },
            9: { value: '#16223a' },
            10: { value: '#e2e8f0' },
            11: { value: '#94a3b8' },
            // Opaque dark-theme scene swatches, for the same three.js reason
            // as gray.6 above.
            12: { value: '#334155' },
            13: { value: '#475569' },
            a1: { value: 'rgba(15, 23, 42, 0.12)' },
            a2: { value: 'rgba(15, 23, 42, 0.18)' },
            // Dark-theme overlays. a3 is the glass tint; a4/a5 are light-ink
            // borders, the dark counterparts of a1/a2.
            a3: { value: 'rgba(11, 18, 32, 0.8)' },
            a4: { value: 'rgba(226, 232, 240, 0.14)' },
            a5: { value: 'rgba(226, 232, 240, 0.24)' },
          },
          blue: {
            a1: { value: 'rgba(2, 132, 199, 0.65)' },
            a2: { value: 'rgba(2, 132, 199, 0.2)' },
            // Opaque variant. three.js Color drops alpha, so the driving
            // visualizer's scene materials need a solid swatch, not a1/a2.
            solid: { value: '#0284c7' },
            // Dark-theme counterparts. The light blue reads against a dark
            // surface where blue.a1/a2/solid go muddy.
            a3: { value: 'rgba(56, 189, 248, 0.7)' },
            a4: { value: 'rgba(56, 189, 248, 0.22)' },
            light: { value: '#38bdf8' },
          },
          red: {
            1: { value: '#b91c1c' },
            2: { value: '#f87171' },
          },
          green: {
            1: { value: '#15803d' },
            2: { value: '#4ade80' },
          },
          // Swept-trail colors for the driving visualizer. Saturated enough
          // to stay legible against the light canvas. All opaque, for the
          // same reason as blue.solid above. The `2` variants are the
          // lighter dark-theme counterparts.
          amber: {
            1: { value: '#d97706' },
            2: { value: '#fbbf24' },
          },
          teal: {
            1: { value: '#0d9488' },
            2: { value: '#2dd4bf' },
          },
          violet: {
            1: { value: '#7c3aed' },
          },
          rose: {
            1: { value: '#e11d48' },
            2: { value: '#fb7185' },
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
              value: { base: '{colors.gray.1}', _dark: '{colors.gray.7}' },
              description: 'Page background',
            },
            subtle: {
              value: { base: '{colors.gray.2}', _dark: '{colors.gray.8}' },
              description: 'Page background subtle',
            },
          },
          surface: {
            card: {
              value: { base: '{colors.white}', _dark: '{colors.gray.9}' },
              description: 'Card/background surface',
            },
            glass: {
              value: { base: '{colors.white.a1}', _dark: '{colors.gray.a3}' },
              description: 'Translucent surface for sticky header',
            },
          },
          fg: {
            default: {
              value: { base: '{colors.gray.4}', _dark: '{colors.gray.10}' },
              description: 'Primary text',
            },
            muted: {
              value: { base: '{colors.gray.3}', _dark: '{colors.gray.11}' },
              description: 'Muted text',
            },
            hover: {
              value: { base: '{colors.gray.3}', _dark: '{colors.gray.10}' },
              description: 'Hovered text',
            },
            onBrand: {
              // Brand inverts between themes, so its text color inverts too.
              value: { base: '{colors.white}', _dark: '{colors.gray.4}' },
              description: 'Text on brand surfaces',
            },
          },
          border: {
            default: {
              value: { base: '{colors.gray.a1}', _dark: '{colors.gray.a4}' },
              description: 'Subtle border',
            },
            strong: {
              value: { base: '{colors.gray.a2}', _dark: '{colors.gray.a5}' },
              description: 'Stronger border (e.g. canvas preview)',
            },
          },
          brand: {
            // Monochrome and inverted: near-black on light, near-white on dark.
            solid: {
              value: { base: '{colors.gray.4}', _dark: '{colors.gray.10}' },
              description: 'Primary action background',
            },
            hover: {
              value: { base: '{colors.gray.5}', _dark: '{colors.white}' },
              description: 'Primary action hover background',
            },
          },
          accent: {
            solid: {
              value: { base: '{colors.blue.a1}', _dark: '{colors.blue.a3}' },
              description: 'Accent for active toggle buttons',
            },
            subtle: {
              value: { base: '{colors.blue.a2}', _dark: '{colors.blue.a4}' },
              description: 'Accent background for active toggle buttons',
            },
          },
          focus: {
            border: {
              value: { base: '{colors.blue.a1}', _dark: '{colors.blue.a3}' },
              description: 'Focus border color',
            },
          },
          danger: {
            fg: {
              value: { base: '{colors.red.1}', _dark: '{colors.red.2}' },
              description: 'Error text color',
            },
          },
          positive: {
            fg: {
              value: { base: '{colors.green.1}', _dark: '{colors.green.2}' },
              description: 'Positive result text color',
            },
          },
          // The grid is a print artifact: the canvas paints white paper and
          // exports a PNG. It stays dark-ink-on-white in both themes, so
          // these deliberately have no `_dark` value.
          grid: {
            text: {
              value: '{colors.gray.4}',
              description: 'Grid text color (print, theme-independent)',
            },
            line: {
              value: '{colors.gray.a1}',
              description: 'Grid line color (print, theme-independent)',
            },
          },
          // three.js Color drops alpha, so every `_dark` value here must
          // resolve to an opaque swatch.
          scene: {
            bg: {
              value: { base: '{colors.gray.1}', _dark: '{colors.gray.7}' },
              description: 'Driving visualizer 3D scene background',
            },
            grid: {
              value: { base: '{colors.gray.6}', _dark: '{colors.gray.12}' },
              description: 'Driving visualizer ground grid lines',
            },
            origin: {
              value: { base: '{colors.red.1}', _dark: '{colors.red.2}' },
              description: 'Origin marker',
            },
            body: {
              value: {
                base: '{colors.blue.solid}',
                _dark: '{colors.blue.light}',
              },
              description: 'Car body fill',
            },
            bodyOutline: {
              value: { base: '{colors.gray.4}', _dark: '{colors.gray.10}' },
              description: 'Car body outline',
            },
            wheel: {
              value: { base: '{colors.gray.3}', _dark: '{colors.gray.13}' },
              description: 'Car wheel fill',
            },
            wheelOutline: {
              value: { base: '{colors.gray.4}', _dark: '{colors.gray.10}' },
              description: 'Car wheel outline',
            },
            trailFrontLeft: {
              value: {
                base: '{colors.blue.solid}',
                _dark: '{colors.blue.light}',
              },
              description: 'Front-left corner swept-trail color',
            },
            trailFrontRight: {
              value: { base: '{colors.teal.1}', _dark: '{colors.teal.2}' },
              description: 'Front-right corner swept-trail color',
            },
            trailRearLeft: {
              value: { base: '{colors.amber.1}', _dark: '{colors.amber.2}' },
              description: 'Rear-left corner swept-trail color',
            },
            trailRearRight: {
              value: { base: '{colors.rose.1}', _dark: '{colors.rose.2}' },
              description: 'Rear-right corner swept-trail color',
            },
            fill: {
              value: { base: '{colors.gray.4}', _dark: '{colors.gray.10}' },
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
          // A dark surface needs a darker, heavier shadow to read at all.
          card: {
            value: {
              base: '0 12px 30px rgba(15, 23, 42, 0.08)',
              _dark: '0 12px 30px rgba(0, 0, 0, 0.45)',
            },
            description: 'Card shadow',
          },
          subtle: {
            value: {
              base: '0 1px 3px rgba(15, 23, 42, 0.08)',
              _dark: '0 1px 3px rgba(0, 0, 0, 0.4)',
            },
            description: 'Subtle shadow',
          },
          focus: {
            // Points at the semantic accent, so it follows the theme with no
            // _dark branch of its own.
            value: '0 0 0 3px {colors.accent.subtle}',
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
      // Makes native scrollbars and form controls follow the theme.
      colorScheme: { base: 'light', _dark: 'dark' },
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
});
