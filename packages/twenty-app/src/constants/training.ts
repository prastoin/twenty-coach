// The training vocabulary is declared in the shared domain core; the object
// definitions build their SELECT options from it, so the values flow
// shared → app → schema rather than being restated per package.
//
// Note there is no `@coach-twenty/shared` entry in this package's
// package.json: the logic-function executor installs the app package on its
// own and cannot resolve `workspace:*` (see #31). The import resolves
// through the workspace symlink and the SDK build inlines it.
export {
  DAY_LABEL,
  SET_SCHEME_LABEL,
  SetScheme,
  TrainingDay,
} from '@coach-twenty/shared';
