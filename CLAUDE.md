## Repo layout (yarn workspaces)

- `packages/twenty-app` — the Twenty application (npm name `coach-twenty`): objects, fields, roles, views, front components. All `yarn twenty …` commands run here; the root `yarn twenty` script delegates to it.
- `packages/trainee-pwa` — the trainee client (Vite + React). `yarn pwa:build` outputs into `packages/twenty-app/public/pwa` (gitignored), so `twenty apply` ships it as public assets. Build it before any apply/publish.
- `packages/shared` — domain core shared by both. Boundary rule: imports nothing from the other packages and nothing from twenty-sdk.
- **Direction of truth**: domain vocabulary (SELECT values, their labels) is declared in `shared` and imported by the app's object definitions, so it flows **shared → app → schema**. The generated schema is *downstream* of the app — never source declaration values from it; use it for API response shapes, and for the assertions in `shared/src/training.ts` that fail compilation when deployed metadata drifts from the declaration.
- `twenty-app` imports `@coach-twenty/shared` **without declaring it in package.json**: the logic-function executor installs the app package alone and cannot resolve `workspace:*`. The import resolves via the workspace symlink and the SDK build inlines it (verified: no `@coach-twenty/shared` in the built output). Adding it to `dependencies` breaks every logic function.
- **Generated API client**: `yarn api:client` re-emits `packages/shared/src/generated/client/` (TypeScript source only) from the client the SDK generates into `packages/twenty-app/node_modules` — so run `yarn twenty -r <remote> apply` first, and commit the result when metadata changes. `yarn api:client --check` fails on drift. Committed because the SDK's generated client is gitignored and only exists after generating against a live instance, while CI typechecks without one. Upstream ask for a native `--output`: twentyhq/core-team-issues#2752.
- The emitted client omits the SDK's `CoreApiClient` wrapper (`clientWrapperTemplateSource: ''`): it reads `process.env` at module scope and throws on import in a browser. Out-of-app consumers import `createClient` from `@coach-twenty/shared/api` and pass their own url/auth.
- **In-app code keeps importing `twenty-client-sdk/core`** — logic functions and front components get a client generated from the *installing* instance, while the committed one bakes this workspace's typeMap.
- **Don't run `yarn test` against the dev instance**: the integration teardown uninstalls the app, dropping app roles, member role assignments and all app data.
- Root scripts (`lint`, `typecheck`, `test`, `test:unit`, `twenty`, `pwa:*`) delegate to the right workspace — CI relies on them.

## Base documentation

- Getting started:
  - https://docs.twenty.com/developers/extend/apps/getting-started/quick-start.md
  - https://docs.twenty.com/developers/extend/apps/getting-started/concepts.md
  - https://docs.twenty.com/developers/extend/apps/getting-started/project-structure.md
  - https://docs.twenty.com/developers/extend/apps/getting-started/local-server.md
  - https://docs.twenty.com/developers/extend/apps/getting-started/scaffolding.md
  - https://docs.twenty.com/developers/extend/apps/getting-started/troubleshooting.md
- Config:
  - https://docs.twenty.com/developers/extend/apps/config/overview.md
  - https://docs.twenty.com/developers/extend/apps/config/application.md
  - https://docs.twenty.com/developers/extend/apps/config/roles.md
  - https://docs.twenty.com/developers/extend/apps/config/install-hooks.md
  - https://docs.twenty.com/developers/extend/apps/config/public-assets.md
- Data:
  - https://docs.twenty.com/developers/extend/apps/data/overview.md
  - https://docs.twenty.com/developers/extend/apps/data/objects.md
  - https://docs.twenty.com/developers/extend/apps/data/extending-objects.md
  - https://docs.twenty.com/developers/extend/apps/data/relations.md
- Logic:
  - https://docs.twenty.com/developers/extend/apps/logic/overview.md
  - https://docs.twenty.com/developers/extend/apps/logic/logic-functions.md
  - https://docs.twenty.com/developers/extend/apps/logic/skills-and-agents.md
  - https://docs.twenty.com/developers/extend/apps/logic/connections.md
- Layout:
  - https://docs.twenty.com/developers/extend/apps/layout/overview.md
  - https://docs.twenty.com/developers/extend/apps/layout/views.md
  - https://docs.twenty.com/developers/extend/apps/layout/navigation-menu-items.md
  - https://docs.twenty.com/developers/extend/apps/layout/page-layouts.md
  - https://docs.twenty.com/developers/extend/apps/layout/front-components.md
  - https://docs.twenty.com/developers/extend/apps/layout/command-menu-items.md
- Operations:
  - https://docs.twenty.com/developers/extend/apps/operations/overview.md
  - https://docs.twenty.com/developers/extend/apps/operations/cli.md
  - https://docs.twenty.com/developers/extend/apps/operations/testing.md
  - https://docs.twenty.com/developers/extend/apps/operations/publishing.md
- Rich app example: https://github.com/twentyhq/twenty/tree/main/packages/twenty-apps/examples/postcard

## UUID requirement

- All generated UUIDs must be valid UUID v4.

## Metadata & sync rules

- Universal identifiers are valid, unique **UUID v4** (`uuidgen | tr 'A-Z' 'a-z'`). Check duplicates before applying.
- **Field metadata type is immutable.** To change a type, create a new field under a new universal identifier and destroy the old one (`apply --force`) — data-lossy, acceptable pre-release. The sync error is a misleading "Options are required for enum fields".
- **View-field universal identifiers are identities, not slots.** Never re-point an existing viewField identifier at a different field — the sync rejects duplicate (view, field) pairs. When refactoring a view, keep each identifier attached to its original field.
- Workspace-created viewFields collide with app-declared ones for the same (view, field) pair — delete the manual one before applying.
- **The engine owns INDEX views** — apps cannot declare `key: INDEX` (rejected by the validator). Engine INDEX views currently miss relation columns for same-batch fields (twentyhq/core-team-issues#2749); workaround: app-declared views + VIEW-type navigation menu items pointing at them (removal tracked in #7).
- **Record pages show relations only via a `FIELDS_WIDGET` view + `RECORD_PAGE` page layout per object** (removal tracked in #11 once twentyhq/twenty#23651 ships).
- `FRONT_COMPONENT` page-layout widgets need an explicit `gridPosition` (e.g. `{ row: 0, column: 0, rowSpan: 40, columnSpan: 12 }`) or they render in a tiny default cell.
- On v2.26.x, updating a navigationMenuItem from OBJECT to VIEW type fails validation (update path loses `viewUniversalIdentifier`); ship such switches as delete + recreate with fresh identifiers.

## Front components

- **Never render raw anchors** — known rendering issues. Navigation goes through the host API: `navigate(AppPath.RecordShowPage, { objectNameSingular, objectRecordId })` on a keyboard-accessible `role="link"` span.
- **twenty-ui is adopted** (alpha): `Tag` for select-chip styling (same ThemeColor names as SELECT options), `Chip` + `Avatar` (`placeholderColorSeed` = record id) composed as record chips, `ThemeProvider` + `useTheme` for tokens, color scheme from `useColorScheme`.
- twenty-ui styling requires importing `twenty-ui/style.css`, `twenty-ui/theme-light.css` and `twenty-ui/theme-dark.css` in the component bundle — `ThemeProvider` only toggles classes and reads CSS variables from those stylesheets; without them everything renders unstyled with zero errors. The SDK build inlines and injects css imports. `src/types/css.d.ts` declares `*.css` for the typechecker.
- Fetch data client-side with `twenty-client-sdk` from `useRecordId()`; sort client-side (don't rely on API ordering).

## Common Pitfalls

- Creating an object without an index view associated. Unless this is a technical object, user will need to visualize it.
- Creating a view without a navigationMenuItem associated. This will make the view available on the left sidebar.
- Creating a front-end component that has a scroll instead of being responsive to its fixed widget height and width, unless it is specifically meant to be used in a canvas tab.

## Best practice

It's highly recommended to create new app entities using `yarn twenty dev:add`. These are the options:

| Entity type          | Command                                  | Generated file                        |
| -------------------- | ---------------------------------------- | ------------------------------------- |
| Object               | `yarn twenty dev:add object`             | `src/objects/<name>.ts`               |
| Field                | `yarn twenty dev:add field`              | `src/fields/<name>.ts`                |
| Logic function       | `yarn twenty dev:add logicFunction`      | `src/logic-functions/<name>.ts`       |
| Front component      | `yarn twenty dev:add frontComponent`     | `src/front-components/<name>.tsx`     |
| Role                 | `yarn twenty dev:add role`               | `src/roles/<name>.ts`                 |
| Skill                | `yarn twenty dev:add skill`              | `src/skills/<name>.ts`                |
| Agent                | `yarn twenty dev:add agent`              | `src/agents/<name>.ts`                |
| View                 | `yarn twenty dev:add view`               | `src/views/<name>.ts`                 |
| Navigation menu item | `yarn twenty dev:add navigationMenuItem` | `src/navigation-menu-items/<name>.ts` |
| Page layout          | `yarn twenty dev:add pageLayout`         | `src/page-layouts/<name>.ts`          |
| Page layout tab      | `yarn twenty dev:add pageLayoutTab`      | `src/page-layout-tabs/<name>.ts`      |
| Command menu item    | `yarn twenty dev:add commandMenuItem`    | `src/command-menu-items/<name>.ts`    |
| View field           | `yarn twenty dev:add viewField`          | `src/view-fields/<name>.ts`           |
| Connection provider  | `yarn twenty dev:add connectionProvider` | `src/connection-providers/<name>.ts`  |

This helps automatically generate required IDs etc.
