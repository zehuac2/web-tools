// Vite's client types declare the `*?raw` modules. `theme/theme.test.ts`
// imports `ToolLayout.astro?raw` to test the real boot script, and `tsc`
// rejects the import without this reference.
/// <reference types="vite/client" />
