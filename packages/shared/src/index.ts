// Domain core shared between the Twenty app (coach cockpit) and the
// trainee PWA (capture surface). Boundary rule: this package imports
// nothing from the other packages and nothing from twenty-sdk — types,
// state machines, validation and progression logic only.
//
// Code moves here when session acquisition lands (see issue #31);
// until then this is the wiring seed.

export const SHARED_PACKAGE_SEED = true;
