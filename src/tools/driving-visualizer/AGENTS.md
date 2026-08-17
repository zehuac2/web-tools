# Driving Visualizer

Top-down 2D visualizer for a car's swept path. It uses a kinematic bicycle model
(see `sim/CarModel.ts`). `src/pages/driving-visualizer.astro` mounts `App.tsx`
as a `client:only="react"` island.

The root `AGENTS.md` applies. This file adds tool-specific rules.

## Layout

```
App.tsx                 Entry point. Wraps the tool in the Redux <Provider>.
DrivingVisualizer.tsx   Full-bleed R3F <Canvas> with four floating overlay panels.
sim/                    Pure simulation. No React, no three.js.
scene/                  The R3F scene graph. Owns every three.js object.
store/                  Redux Toolkit store, slices, and scene commands.
ui/                     Overlay panels. Plain data and store hooks only.
testStore.tsx           Test-only `renderWithStore` helper.
```

This tool is the one exception to the repo's two-column tool layout. The page
passes `fullBleed` to `ToolLayout`, which turns the page shell into a `100dvh`
flex column and makes `<main>` a `position: relative` box that fills everything
below the header. The page never scrolls.

`DrivingVisualizer.tsx` covers that box with `position: absolute; inset: 0`.
Positioning absolutely, rather than with a `height: 100%` chain, is deliberate:
`client:only` islands mount inside an `<astro-island>` element, and a percentage
height would collapse there.

The `<Canvas>` is the first child, in normal flow. The four panels follow it, so
DOM order alone paints them on top and no `z-index` is needed.

- `sim/CarModel.ts` — bicycle model math: `step`, `getCorners`, `turningRadius`,
  `DEFAULT_PARAMS`. State anchors at the rear axle center.
- `sim/input.ts` — pure key mapping: held key codes to `StepInput`.
- `sim/useKeyboardInput.ts` — window key listeners. Exposes a stable
  `readInput()`. It never triggers re-renders.
- `scene/Scene.tsx` — the single `useFrame` loop and the scene graph.
- `scene/Car.tsx` — declarative car meshes. Geometry derives from `params`.
- `scene/SweptPath.tsx` — corner trails and the swept-fill mesh.
- `scene/theme.ts` — resolves `scene.*` Panda tokens to CSS color strings.
- `store/carParamsSlice.ts` — the `CarParams` slider values.
- `store/telemetrySlice.ts` — the latest telemetry frame. The `TelemetryData`
  type lives in `scene/Scene.tsx` and is re-exported here.
- `store/uiSlice.ts` — fill visibility.
- `store/sceneActions.ts` — toolbar commands. See "Scene commands" below.
- `ui/OverlayPanel.tsx` — the glass panel shell every overlay uses. It takes a
  `placement` and applies the shared `overlay()` recipe.

## Data flow

1. `useKeyboardInput` tracks held key codes in a ref.
2. The `useFrame` loop in `Scene` calls `readInput()` and `step()`. It writes
   the result to `carStateRef`.
3. The loop mutates three.js objects directly: the car group's position and
   rotation, and the front wheels' steering rotation.
4. While the throttle is on, the loop appends the body corners to `SweptPath`.
5. Every 66 ms (~15 Hz), the loop dispatches `setTelemetry`. The Telemetry panel
   re-renders at that rate, not at frame rate.
6. Slider changes dispatch to `carParamsSlice`. `Scene` and `Car` read them with
   `useAppSelector`. A param change re-renders once and rebuilds the car
   geometry through reconciliation.

## Invariants

Do not break these rules.

- Physics state lives in `carStateRef`, never in React state. There is one
  `useFrame` loop in `Scene`. Never call `setState` per frame.
- The canvas renders on demand (`frameloop="demand"`). Call `invalidate()` only
  while the car or its steering still changes. A keydown wakes the loop through
  `useKeyboardInput(onWake)`. `MapControls` and the scene command effects also
  call `invalidate()`.
- Telemetry dispatches stay throttled to ~15 Hz (`TELEMETRY_INTERVAL_MS`).
- `SweptPath` pre-allocates its buffers (`MAX_POINTS` points per corner). It
  grows them in place with `setDrawRange` and `addUpdateRange`. Never allocate a
  buffer per frame.
- Z-layering: grid `0`, origin marker `0.005`, traces `0.01`, car group `0.02`,
  wheels `0.03` (local), heading arrow `0.06` (local).
- World axes: X right, Y up, ground plane `z = 0`. `heading = 0` points along
  +X. Headings increase counterclockwise. The car starts facing +Y. The car
  group's local +Y is forward, so the loop sets
  `rotation.z = heading - Math.PI / 2`.
- `step()` integrates in fixed sub-steps of 1/240 s. Keep it pure and free of
  side effects.

## Scene commands

The toolbar talks to the scene through the Redux listener middleware. It does
not use an imperative handle.

1. `store/sceneActions.ts` declares plain actions: `resetPose`, `clearTraces`,
   `centerSteering`, `centerCamera`. They carry no payload and update no reducer
   state.
2. `ui/Toolbar.tsx` dispatches them.
3. `scene/Scene.tsx` subscribes with `addAppListener`. Each listener effect is a
   `useEffectEvent`, so it always reads the latest `invalidate` and `camera`
   without re-subscribing.

Add a new command the same way: one `createAction`, one dispatch site, one
`addAppListener` in `Scene`, and one row in the `sceneCommands` table in
`store/index.test.ts`.

## Layer rules

- Keep `sim/` framework-free. `CarModel.ts` and `input.ts` are pure and have
  Vitest coverage (`*.test.ts`). Only `useKeyboardInput.ts` may touch React and
  the DOM. Run tests with `bun run test`.
- `store/` and `ui/` also have Vitest coverage. `scene/` has none: it needs an
  R3F canvas, and `@react-three/test-renderer` is not a dependency. Keep new
  logic out of `scene/` when a pure module or a slice can hold it.
- `ui/` components must not import from `scene/`. They use the typed store hooks
  and the shared components in `@/components`.
- `ui/` components follow the repo component pattern (`FC`, exported props
  interface, `displayName`, default export). `scene/` components are named
  function exports. `SweptPath` takes `ref` as a normal prop (React 19) and
  exposes `SweptPathHandle` through `useImperativeHandle`.
- three.js materials cannot read CSS variables. Use `getSceneColors()` from
  `scene/theme.ts`. Do not hard-code color strings in scene files.
- `Scene` is the only file here that reads the theme. It calls
  `useResolvedTheme()` from `@/theme`, re-resolves the colors, and passes them
  to `Car` and `SweptPath` as a prop. Do not call `getSceneColors()` anywhere
  else: each call costs 12 `getComputedStyle` reads.
- `SweptPath` never rebuilds its buffers on a theme change. It writes the
  material colors in place through `applyColors`, then calls `invalidate()`
  once. A rebuild would erase every trace the user drew. Its buffers live in a
  `useRef`, not a `useMemo`, because React Compiler may re-key a dependency
  array.
- Each `ui/` panel wraps itself in `OverlayPanel` and owns its own `placement`.
  Do not position panels from `DrivingVisualizer.tsx`.
- `OverlayPanel` passes `placement` through as a prop, so Panda cannot see which
  variants are used. `panda.config.ts` emits them all through `staticCss`. Add
  any new placement there too.
- The panels overlap each other below `lg`. Keep them short at that size: the
  toolbar wraps into rows and the parameter sliders start collapsed.

## Store

- Use the typed hooks from `store/index.ts`: `useAppDispatch`, `useAppSelector`,
  `addAppListener`.
- The store enables Redux DevTools under the name `driving-visualizer`.
  `actionCreators` includes the scene commands, so you can dispatch them from
  DevTools.
- `makeStore()` builds a store with its own listener middleware. `store` is the
  single instance the app uses. Tests call `makeStore()` so that state and
  listener subscriptions never leak between them.
- To test a component against the store, use `renderWithStore` from
  `testStore.tsx`. It wraps the element in a `<Provider>` and returns the store
  next to the Testing Library queries. Pass a store to seed state or to register
  listeners first; omit it to get a new store.

```tsx
const { store } = renderWithStore(<Toolbar />);
await userEvent.click(screen.getByRole('button', { name: '◈ Hide Fill' }));
expect(store.getState().ui.fillVisible).toBe(false);
```

## Keyboard input

- `W`/`↑` forward, `S`/`↓` reverse, `A`/`←` and `D`/`→` steer, `C` center
  steering, `Space` hold steering (suppresses self-centering). Scroll zooms.
  Drag pans.
- Steering self-centers at `steeringRate` when no steer key is held, unless
  `Space` is held.
- Key capture is ignored while focus is in an input or textarea.
- Arrow keys and `Space` call `preventDefault` to stop page scrolling.
