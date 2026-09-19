// Vite's client types declare the `*?raw` modules. `theme/theme.test.ts`
// imports `tool-layout.astro?raw` to test the real boot script, and `tsc`
// rejects the import without this reference.
/// <reference types="vite/client" />
