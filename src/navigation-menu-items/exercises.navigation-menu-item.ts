import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { ALL_EXERCISES_VIEW_ID } from 'src/views/all-exercises.view';

// Targets the app view rather than the object: the engine-owned INDEX view
// currently misses relation columns for fields created in the same batch as
// their object (https://github.com/twentyhq/core-team-issues/issues/2749).
export default defineNavigationMenuItem({
  universalIdentifier: '0ab5b00d-38e9-41a0-b278-6832aa14e819',
  position: 1,
  type: NavigationMenuItemType.VIEW,
  name: 'Exercises',
  icon: 'IconBarbell',
  viewUniversalIdentifier: ALL_EXERCISES_VIEW_ID,
});
