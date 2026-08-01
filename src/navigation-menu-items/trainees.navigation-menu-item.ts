import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { TRAINEES_VIEW_ID } from 'src/views/trainees.view';

export default defineNavigationMenuItem({
  universalIdentifier: 'defed42e-4ffb-47a9-8c50-feda1a8780db',
  position: 3,
  type: NavigationMenuItemType.VIEW,
  name: 'Trainees',
  icon: 'IconUsers',
  viewUniversalIdentifier: TRAINEES_VIEW_ID,
});
