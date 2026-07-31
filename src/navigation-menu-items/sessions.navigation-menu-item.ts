import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { ALL_SESSIONS_VIEW_ID } from 'src/views/all-sessions.view';

// Targets the app view rather than the object: the engine-owned INDEX view
// currently misses relation columns for fields created in the same batch as
// their object (https://github.com/twentyhq/core-team-issues/issues/2749).
export default defineNavigationMenuItem({
  universalIdentifier: '64988463-75ae-4968-b4f3-64fbd232543e',
  position: 2,
  type: NavigationMenuItemType.VIEW,
  name: 'Sessions',
  icon: 'IconRun',
  viewUniversalIdentifier: ALL_SESSIONS_VIEW_ID,
});
