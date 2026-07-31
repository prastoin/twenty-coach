import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { PROGRAM_UNIVERSAL_IDENTIFIER } from 'src/objects/program.object';

export default defineNavigationMenuItem({
  universalIdentifier: '1c7bd1fa-c0ea-43eb-9e2c-614fbdcbb928',
  position: 0,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: PROGRAM_UNIVERSAL_IDENTIFIER,
});
