// Domain core shared between the Twenty app (coach cockpit) and the
// trainee PWA (capture surface). Boundary rule: this package imports
// nothing from the other packages and nothing from twenty-sdk — types,
// state machines, validation and progression logic only.
//
// NOTE: the Twenty app cannot declare a workspace dependency on this
// package yet — the server-side logic-function executor installs the app
// package in isolation and fails to resolve `workspace:*` (see #31).
// Until a vendoring step exists, only the PWA consumes it.

export * from './training';
