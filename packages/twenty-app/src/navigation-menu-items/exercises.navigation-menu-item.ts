import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/exercise.object';

// Fresh identifier: nav-item type switches must ship as delete + recreate —
// the update path drops the newly required target identifier from the to-state
// and fails validation (same wrinkle as OBJECT→VIEW on v2.26, still on v2.27).
export default defineNavigationMenuItem({
  universalIdentifier: '5784b404-c5b6-45c0-bf53-375e0667f72c',
  position: 1,
  type: NavigationMenuItemType.OBJECT,
  name: 'Exercises',
  icon: 'IconBarbell',
  targetObjectUniversalIdentifier: EXERCISE_UNIVERSAL_IDENTIFIER,
});
