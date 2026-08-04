import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { SESSION_UNIVERSAL_IDENTIFIER } from 'src/objects/session.object';

// Fresh identifier: nav-item type switches must ship as delete + recreate —
// the update path drops the newly required target identifier from the to-state
// and fails validation (same wrinkle as OBJECT→VIEW on v2.26, still on v2.27).
export default defineNavigationMenuItem({
  universalIdentifier: 'df9a0965-23e9-4624-9f81-92299caa9ca8',
  position: 2,
  type: NavigationMenuItemType.OBJECT,
  name: 'Sessions',
  icon: 'IconRun',
  targetObjectUniversalIdentifier: SESSION_UNIVERSAL_IDENTIFIER,
});
