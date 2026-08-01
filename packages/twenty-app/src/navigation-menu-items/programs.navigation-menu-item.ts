import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { ALL_PROGRAMS_VIEW_ID } from 'src/views/all-programs.view';

// Targets the app view rather than the object: the engine-owned INDEX view
// currently misses relation columns for fields created in the same batch as
// their object (https://github.com/twentyhq/core-team-issues/issues/2749).
export default defineNavigationMenuItem({
  universalIdentifier: '07f9fcb8-a8bd-4045-a3aa-faf25c3c14a0',
  position: 0,
  type: NavigationMenuItemType.VIEW,
  name: 'Programs',
  icon: 'IconClipboardList',
  viewUniversalIdentifier: ALL_PROGRAMS_VIEW_ID,
});
