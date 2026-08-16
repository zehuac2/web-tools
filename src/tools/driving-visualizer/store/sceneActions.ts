// Commands the toolbar dispatches for the scene to carry out. These carry no
// payload and update no store state; Scene listens for them via the listener
// middleware and applies the effect imperatively (see store/index.ts).

import { createAction } from '@reduxjs/toolkit';

export const resetPose = createAction('scene/resetPose');
export const clearTraces = createAction('scene/clearTraces');
export const centerSteering = createAction('scene/centerSteering');
export const centerCamera = createAction('scene/centerCamera');
