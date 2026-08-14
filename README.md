# Web Tools

A small collection of single-purpose web tools, hosted together as one Astro
site with one shared design system.

- **Grid Maker** — create custom printable grids for various paper sizes.
- **Driving Visualizer** — visualize a car's swept path through a maneuver,
  top-down, using a kinematic bicycle model.
- **Random** — generate random strings from configurable letter and number
  sections.
- **Receipt Splitter** — split a shared receipt equally, by fees, or
  proportionally.

## Development

1. `bun install`
2. `bun run prepare` — generates the Panda CSS `styled-system/` output
3. `bun run dev` — starts the dev server at `http://localhost:4321`

## Publishing

1. `bun install`
2. `bun run build`

GitHub Actions deploys on push to `main` via the Deploy to GitHub Pages
workflow.
