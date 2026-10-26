import {
  definePageLayoutTab,
  getSystemRecordPageLayoutUniversalIdentifier,
  PageLayoutTabLayoutMode,
} from 'twenty-sdk/define';

import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/exercise.object';
import { VOLUME_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from 'src/front-components/volume-dashboard.front-component';

export default definePageLayoutTab({
  universalIdentifier: '1508ca94-03f2-4a74-869a-f2f73b0073b2',
  title: 'Volume',
  position: 15,
  icon: 'IconChartBar',
  layoutMode: PageLayoutTabLayoutMode.GRID,
  pageLayoutUniversalIdentifier: getSystemRecordPageLayoutUniversalIdentifier({
    objectMetadataApplicationUniversalIdentifier:
      APPLICATION_UNIVERSAL_IDENTIFIER,
    objectUniversalIdentifier: EXERCISE_UNIVERSAL_IDENTIFIER,
  }),
  widgets: [
    {
      universalIdentifier: 'da630028-f739-484f-af4f-9f9722a5f09d',
      title: 'Volume',
      type: 'FRONT_COMPONENT',
      position: {
        layoutMode: PageLayoutTabLayoutMode.GRID,
        row: 0,
        column: 0,
        rowSpan: 24,
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
