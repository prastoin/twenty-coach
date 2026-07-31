import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { SESSION_UNIVERSAL_IDENTIFIER } from 'src/objects/session.object';

export default defineNavigationMenuItem({
  universalIdentifier: 'c0b2d4d6-b3ef-45b2-9ef7-b38d51642980',
  position: 2,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: SESSION_UNIVERSAL_IDENTIFIER,
});
