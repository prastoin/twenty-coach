import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { ALL_PROGRAMS_VIEW_ID } from 'src/views/all-programs.view';

// Targets the app view rather than the object: the engine-owned INDEX view
// currently misses relation columns for fields created in the same batch as
// their object (https://github.com/twentyhq/core-team-issues/issues/2749).
export default defineNavigationMenuItem({
  universalIdentifier: '1c7bd1fa-c0ea-43eb-9e2c-614fbdcbb928',
  position: 0,
  type: NavigationMenuItemType.VIEW,
  name: 'Programs',
  icon: 'IconClipboardList',
  viewUniversalIdentifier: ALL_PROGRAMS_VIEW_ID,
});
