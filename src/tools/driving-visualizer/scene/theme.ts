// Bridge from Panda design tokens to resolved color strings. three.js
// materials cannot read CSS custom properties directly (no `var(...)`
// support), so this reads each token's *computed* value off the document
// root, the same way `src/tools/grid-maker/components/Grid/theme.ts` does
// for its canvas 2D context.

import { token, type Token } from 'styled-system/tokens';

function resolve(t: Token): string {
  const varName = token(t).replaceAll('var(', '').replaceAll(')', '');
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
}

export interface SceneColors {
  bg: string;
  grid: string;
  origin: string;
  body: string;
  bodyOutline: string;
  wheel: string;
  wheelOutline: string;
  trailFrontLeft: string;
  trailFrontRight: string;
  trailRearLeft: string;
  trailRearRight: string;
  fill: string;
}

/** Resolve every `scene.*` token to a CSS color string three.js can parse. */
export function getSceneColors(): SceneColors {
  return {
    bg: resolve('colors.scene.bg'),
    grid: resolve('colors.scene.grid'),
    origin: resolve('colors.scene.origin'),
    body: resolve('colors.scene.body'),
    bodyOutline: resolve('colors.scene.bodyOutline'),
    wheel: resolve('colors.scene.wheel'),
    wheelOutline: resolve('colors.scene.wheelOutline'),
    trailFrontLeft: resolve('colors.scene.trailFrontLeft'),
    trailFrontRight: resolve('colors.scene.trailFrontRight'),
    trailRearLeft: resolve('colors.scene.trailRearLeft'),
    trailRearRight: resolve('colors.scene.trailRearRight'),
    fill: resolve('colors.scene.fill'),
  };
}
