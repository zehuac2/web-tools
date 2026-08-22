# Grid Maker

Generates a printable dot/line grid sized to a chosen paper size and cell size.
`src/pages/grid-maker.astro` mounts `App.tsx` as a `client:only="react"` island.

The root `AGENTS.md` applies. This file adds tool-specific rules.

## Layout

```
App.tsx                          Entry point. Wraps the tool in EventsProvider.
AppContent.tsx                   Two-column layout: preview card + Configuration.
Configuration.tsx                Settings form. Owns ConfigurationValues and its defaults.
contexts/EventsContext.tsx       RxJS subjects bridging the form to the canvas render.
components/PreviewHeader.tsx     Preview card heading; shows live grid/paper dimensions.
components/Grid/Grid.tsx         Canvas render, dimension math, <img> output.
components/Grid/theme.ts         Resolves grid.* and fonts.grid Panda tokens to CSS vars.
components/Grid/InvalidConfiguration/  Fallback shown when cell size is invalid.
papers/index.ts                  Papers registry: displayName + width/height in inches.
units/index.ts                   Nominal Inch/Pixel types and inchToPixel conversion.
```

## Data flow

1. `Configuration` is an `react-hook-form` form. Each field's `onChange` both
   updates form state and pushes the raw value onto its RxJS subject
   (`paperKey$`, `cellSize$`, `fontSize$`) from `EventsContext`.
2. `EventsContext` combines those three subjects into `configuration$`,
   debounces it (`DEBOUNCE_MS = 300`), and writes the settled value to a second
   set of subjects: `renderPaperKey$`, `renderCellSize$`, `renderFontSize$`.
3. `Grid` and `PreviewHeader` read only the `render*` subjects through
   `useBehaviorSubject`. This decouples every keystroke (fast, cheap form state)
   from the canvas redraw (debounced, since it re-rasterizes the whole grid).
4. `Grid` computes `GridDimensions` from `calculateGridDimensions`, draws lines
   and cell coordinates to an off-screen `<canvas>`, then reads it back with
   `toDataURL()` into an `<img>`. The `<canvas>` itself stays `display: none`;
   only the `<img>` is visible. This keeps the DOM printable — canvases do not
   reliably print, images do.
5. `Configuration`'s submit handler calls `window.print()`.

## Invariants

- `Grid` renders at `window.devicePixelRatio` and scales back down via the
  `<img>`'s `width`/`height` attributes, so the print/screen output stays sharp
  on high-DPI screens. Any new draw call in `Grid.tsx` must multiply by `dpr`
  the same way the existing ones do.
- `pixelCellSize <= 0` renders `InvalidConfiguration` instead of drawing. Never
  let `calculateGridDimensions` divide by a zero or negative cell size.
- `Inch` and `Pixel` (`units/index.ts`) are nominally-typed numbers. Do not mix
  them without going through `inchToPixel`; a raw `number` will not type-check
  where an `Inch` or `Pixel` is expected.
- Grid line/text colors are read live from CSS custom properties
  (`getGridLineVariable()`, `getGridTextVariable()`) via
  `computedStyle.getPropertyValue`, not hard-coded, because canvas cannot read
  Panda tokens directly. Follow `theme.ts`'s pattern for any new grid color.
- `grid.text` and `grid.line` have no dark-mode value (see root `AGENTS.md` Dark
  mode section): the grid is meant to print as dark ink on white paper in both
  themes.

## RxJS

Follow the root `AGENTS.md` RxJS convention: read subjects with
`useBehaviorSubject`, never subscribe manually. `EventsContext` is the only file
that constructs subjects or pipes them (`combineLatest`, `debounceTime`,
`distinctUntilChanged`); components downstream only read.

The two-tier subject split (`paperKey$`/`cellSize$`/`fontSize$` for form state
vs. `renderPaperKey$`/`renderCellSize$`/`renderFontSize$` for the debounced
render) is deliberate. Add a new configuration field the same way: one raw
subject wired into `configuration$`, one `render*` subject the debounce
subscription writes to, and read only the `render*` version from `Grid` or
`PreviewHeader`.
