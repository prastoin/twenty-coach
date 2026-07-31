import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/exercise.object';

export default defineNavigationMenuItem({
  universalIdentifier: '0ab5b00d-38e9-41a0-b278-6832aa14e819',
  position: 1,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: EXERCISE_UNIVERSAL_IDENTIFIER,
});
