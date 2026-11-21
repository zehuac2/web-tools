# Grid Maker

Generates a printable dot/line grid sized to a chosen paper size and cell size.
`src/pages/grid-maker.astro` mounts `app.tsx` as a `client:only="react"` island.

The root `AGENTS.md` applies. This file adds tool-specific rules.

## Layout

```
app.tsx                          Entry point. Wraps the tool in the Redux <Provider>.
app-content.tsx                  Two-column layout: preview card + Configuration.
configuration.tsx                Settings form. Dispatches each field change to the store.
configuration-values.ts          ConfigurationValues, its defaults, and its comparator.
store/                           Redux Toolkit store, configuration slice, and listeners.
components/preview-header.tsx    Preview card heading; shows live grid/paper dimensions.
components/grid/grid.tsx         Canvas render, dimension math, <img> output.
components/grid/theme.ts         Resolves grid.* and fonts.grid Panda tokens to CSS vars.
components/grid/invalid-configuration/  Fallback shown when cell size is invalid.
papers/index.ts                  Papers registry: displayName + width/height in inches.
units/index.ts                   Nominal Inch/Pixel types and inchToPixel conversion.
```

## Data flow

1. `Configuration` is an `react-hook-form` form. Each field's `onChange` both
   updates form state and dispatches `fieldChanged` with the raw value to the
   store. The slice writes the value into `draft`.
2. A listener middleware (`store/index.ts`) debounces `fieldChanged`
   (`DEBOUNCE_MS = 300`) and de-duplicates it (`isSameConfiguration`) before it
   dispatches `configurationSettled`, which copies `draft` into `settled`.
3. `Grid` and `PreviewHeader` read only `state.gridMaker.settled` through
   `useAppSelector`. This decouples every keystroke (fast, cheap form state)
   from the canvas redraw (debounced, since it re-rasterizes the whole grid).
4. `Grid` computes `GridDimensions` from `calculateGridDimensions`, draws lines
   and cell coordinates to an off-screen `<canvas>`, then reads it back with
   `toDataURL()` into an `<img>`. The `<canvas>` itself stays `display: none`;
   only the `<img>` is visible. This keeps the DOM printable — canvases do not
   reliably print, images do.
5. `Configuration`'s submit handler dispatches `printRequested`. When `draft`
   already equals `settled`, a listener dispatches `printReady` at once.
   Otherwise the `configurationSettled` listener does it after the settle, so a
   print that starts inside the debounce window never prints the previous grid.
   `AppContent` listens for `printReady` via `addAppListener` and calls
   `window.print()`.

## Invariants

- `Grid` renders at `window.devicePixelRatio` and scales back down via the
  `<img>`'s `width`/`height` attributes, so the print/screen output stays sharp
  on high-DPI screens. Any new draw call in `grid.tsx` must multiply by `dpr`
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

## Store

- Use the typed hooks from `store/index.ts`: `useAppDispatch`, `useAppSelector`,
  `addAppListener`.
- `makeStore()` builds a store with its own listener middleware. `store` is the
  single instance the app uses. Tests call `makeStore()` so that state and
  listener subscriptions never leak between them.
- The `draft`/`settled` split is deliberate. `draft` holds the form's live
  values and updates on every keystroke. `settled` holds the debounced values
  and updates only through `configurationSettled`. `Grid` and `PreviewHeader`
  must read `settled` only.
- Add a new configuration field the same way: add it to `ConfigurationValues`
  and `isSameConfiguration` in `configuration-values.ts`, dispatch it with
  `fieldChanged`, and read it from `state.gridMaker.settled`. The debounce and
  the settle listener need no changes.
- `printReady` never carries state. It only tells `AppContent` that the grid in
  the document matches the form, so `window.print()` is safe. Do not move the
  `window.print()` call into the middleware; keep it in `AppContent`'s effect,
  following the driving-visualizer scene-command pattern.
- To test a component against the store, use `renderWithStore` from
  `store/test-store.tsx`.
