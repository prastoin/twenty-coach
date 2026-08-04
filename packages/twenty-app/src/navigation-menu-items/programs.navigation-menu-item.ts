import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { PROGRAM_UNIVERSAL_IDENTIFIER } from 'src/objects/program.object';

// Fresh identifier: nav-item type switches must ship as delete + recreate —
// the update path drops the newly required target identifier from the to-state
// and fails validation (same wrinkle as OBJECT→VIEW on v2.26, still on v2.27).
export default defineNavigationMenuItem({
  universalIdentifier: '5bcae50a-461a-45dc-bb94-448a94346e36',
  position: 0,
  type: NavigationMenuItemType.OBJECT,
  name: 'Programs',
  icon: 'IconClipboardList',
  targetObjectUniversalIdentifier: PROGRAM_UNIVERSAL_IDENTIFIER,
});
