import {
  definePageLayout,
  PageLayoutTabLayoutMode,
  PageLayoutType,
} from 'twenty-sdk/define';

import { VOLUME_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from 'src/front-components/volume-dashboard.front-component';

export const VOLUME_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER =
  '2dfd2424-a46b-421d-809f-adf887fbdb98';

export default definePageLayout({
  universalIdentifier: VOLUME_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Training volume',
  type: PageLayoutType.STANDALONE_PAGE,
  tabs: [
    {
      universalIdentifier: 'dd7c110a-d4c1-431f-a9fd-d2aa55e77d78',
      title: 'Volume',
      position: 0,
      icon: 'IconChartBar',
      layoutMode: PageLayoutTabLayoutMode.GRID,
      widgets: [
        {
          universalIdentifier: '66f86f78-e4df-42eb-b7f8-b5221523bbec',
          title: 'Training volume',
          type: 'FRONT_COMPONENT',
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 0,
            column: 0,
            rowSpan: 32,
            columnSpan: 12,
          },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier:
              VOLUME_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
  ],
});
