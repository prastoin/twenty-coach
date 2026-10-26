import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { VOLUME_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from 'src/page-layouts/volume-dashboard.page-layout';

export default defineNavigationMenuItem({
  universalIdentifier: '1233c931-418d-4794-93b5-04b39f81c615',
  position: 5,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  name: 'Volume',
  icon: 'IconChartBar',
  pageLayoutUniversalIdentifier:
    VOLUME_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
