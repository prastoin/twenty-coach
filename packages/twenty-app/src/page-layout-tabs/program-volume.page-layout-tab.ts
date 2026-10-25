import {
  definePageLayoutTab,
  getSystemRecordPageLayoutUniversalIdentifier,
  PageLayoutTabLayoutMode,
} from 'twenty-sdk/define';

import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { PROGRAM_UNIVERSAL_IDENTIFIER } from 'src/objects/program.object';
import { VOLUME_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from 'src/front-components/volume-dashboard.front-component';

export default definePageLayoutTab({
  universalIdentifier: '4bc32824-8979-45b6-b820-6b6244a6216e',
  title: 'Volume',
  position: 16,
  icon: 'IconChartBar',
  layoutMode: PageLayoutTabLayoutMode.GRID,
  pageLayoutUniversalIdentifier: getSystemRecordPageLayoutUniversalIdentifier({
    objectMetadataApplicationUniversalIdentifier:
      APPLICATION_UNIVERSAL_IDENTIFIER,
    objectUniversalIdentifier: PROGRAM_UNIVERSAL_IDENTIFIER,
  }),
  widgets: [
    {
      universalIdentifier: 'e92305bb-ec3a-41b0-97ec-f734c464ccb6',
      title: 'Volume',
      type: 'FRONT_COMPONENT',
      position: {
        layoutMode: PageLayoutTabLayoutMode.GRID,
        row: 0,
        column: 0,
        rowSpan: 28,
        columnSpan: 12,
      },
      configuration: {
        configurationType: 'FRONT_COMPONENT',
        frontComponentUniversalIdentifier:
          VOLUME_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
      },
    },
  ],
});
