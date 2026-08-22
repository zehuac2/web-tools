# AGENTS

## Stack

| Layer           | Technology                                                       |
| --------------- | ---------------------------------------------------------------- |
| Framework       | Astro 7, static output                                           |
| UI islands      | React 19 (`client:only="react"`) + React Compiler                |
| Styling         | Panda CSS (single design system, `src/recipes/`)                 |
| Forms           | react-hook-form (grid-maker, receipt-splitter)                   |
| State           | Redux Toolkit (random, driving-visualizer), RxJS (grid-maker)    |
| 3D              | three.js via @react-three/fiber + drei (driving-visualizer only) |
| Tests           | Vitest + Testing Library                                         |
| Package manager | Bun                                                              |

Always pin dependency versions. Do not use `^` or `~`. To add a dependency, pin
its exact version: `bun add <pkg>@<exact-version>`.

## Scripts

```sh
bun install       # install dependencies
bun run prepare   # panda codegen + cssgen (generates styled-system/, run once after install)
bun run dev       # Astro dev server
bun run build     # production build → dist/
bun run preview   # serve the production build locally
bun run check     # astro check + tsc --noEmit
bun run test      # run the Vitest suite; do not use bun test
bun run format    # format all files with Prettier
```

Run `bun run format` and `bun run check` after you change code.

## Layout

```
src/
├── meta.ts                 REPO_URL, the TOOLS registry (slug/title/glyph/blurb)
├── recipes/                shared Panda recipes: button, card, control, panel
├── styles/global.css       reset + print rules
├── layouts/ToolLayout.astro  sticky header shell, wraps every tool page
├── components/             shared React: InputField, ToolPanel, LabeledOutput, SliderRow
├── pages/                  one *.astro route per tool, plus index.astro (tool directory)
└── tools/                  one directory per tool; each owns its App.tsx and domain logic
    ├── grid-maker/
    ├── driving-visualizer/
    ├── random/
    └── receipt-splitter/
```

Each `pages/<slug>.astro` renders `ToolLayout` and mounts that tool's `App` as a
`client:only="react"` island — every tool is SPA-shaped and reads `window`
during render, so server/client hydration mismatches are not a concern this way,
at the cost of the tool body painting after its JS loads.

## Design system

One Panda config (`panda.config.ts`) drives every tool. Do not introduce a
second styling system (no MUI, no Emotion, no NativeWind, no inline
`CSSProperties` objects) and do not hand-write CSS outside
`src/styles/ global.css`. Style with the `css()` function and the recipes in
`src/recipes/`:

- `card()` — bordered/shadowed surface, used for every panel and tool card.
- `button({ variant, pressed })` — `variant` is `solid` (primary action),
  `subtle` (toolbar/secondary), or `ghost`; `pressed` styles an active toggle.
- `control()` — text/number/select input styling (border, focus ring, radius).
- `panel()` — muted bordered sub-panel (info boxes, telemetry, breakdowns).
- `overlay({ placement })` — translucent HUD panel that floats over a full-bleed
  canvas. `placement` is `topLeft`, `topRight`, `bottomCenter`, or
  `bottomRight`. Only the driving visualizer uses it.

Tokens live in `panda.config.ts` under `theme.extend.tokens` / `semanticTokens`.
Reach for a semantic token (`fg.default`, `border.default`, `bg.canvas`,
`scene.*`, …) before an ad hoc raw value. When a three.js material needs a
token's resolved CSS value, read it through `token()`/`getPropertyValue()`,
following the pattern in `src/tools/driving-visualizer/scene/theme.ts` and
`src/tools/grid-maker/components/Grid/theme.ts`.

Most tool pages use the same two-column layout: primary output/canvas on the
left in a `card()`, a `370px` settings/controls `card()` on the right
(`gridTemplateColumns: { base: 'auto', lg: '[1fr 370px]' }`).

The driving visualizer is the exception. Its page passes `fullBleed` to
`ToolLayout`, so the tool fills the viewport below the header and floats
`overlay()` panels over the canvas. `fullBleed` also stops the page scrolling.
Use it only for a tool that must own the whole viewport.

## Dark mode

`<html data-theme>` always holds a concrete `light` or `dark`. The blocking
inline script in `ToolLayout.astro` resolves the stored preference before first
paint, so nothing downstream ever sees `system`.

- Give a color both values: `value: { base: …, _dark: … }`. The `_dark`
  condition is defined in `panda.config.ts` and keys off `data-theme`.
- Because every recipe styles color through semantic tokens, a new dark value
  themes the whole DOM. Do not add `_dark` inside a recipe or a `css()` call.
- A `scene.*` dark value must be opaque. three.js `Color` drops alpha.
- `grid.text` and `grid.line` have **no** dark value on purpose. The grid is a
  print artifact, so it stays dark ink on white paper in both themes.
- `src/theme/` owns the preference. `theme.ts` holds the pure helpers and the
  single DOM writer, `store.ts` the `useSyncExternalStore` backing, and
  `useTheme.ts` the `useTheme`/`useResolvedTheme` hooks. The header toggle and
  each tool are separate React roots, so the store broadcasts on a window event.
  React Context cannot cross that boundary.
- `applyTheme` sets the attribute before it notifies. Code that resolves tokens
  with `getComputedStyle` depends on that order.

## Style guide

### Documentation and comments

Write all documentation and code comments in Simplified Technical English (STE).
Use short sentences. Cover one idea per sentence. Use active voice. Write
procedures as numbered steps.

### JS/TS

- Use single quotes.
- Use `import type` when you import a type.
- Use the `@/` alias for imports that cross a directory boundary (`@/` maps to
  `src/`). Same-directory imports use `./` as normal.

### React components

- One component per file.
- Declare components with `FC`. Define props in an exported `<Name>Props`
  interface. Always set `displayName`. Use a default export.

```ts
import { type FC } from 'react';

export interface FooProps {}

const Foo: FC<FooProps> = () => {
  return <div></div>;
};

Foo.displayName = 'Foo';

export default Foo;
```

### RxJS

```tsx
import useBehaviorSubject from '@/hooks/react/useBehaviorSubject';

const MyComponent = () => {
  const state = useBehaviorSubject(behaviorSubject$);
};
```

- Subscribe to changes using `useBehaviorSubject`;
- Only pass `BehaviorSubject` to `useBehaviorSubject`;

## Notes

- Do not commit secrets.
- Do not commit unless the user explicitly asks.

## Tools

- [Driving Visualizer](src/tools/driving-visualizer/AGENTS.md)
- [Grid Maker](src/tools/grid-maker/AGENTS.md)
