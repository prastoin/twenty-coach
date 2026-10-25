import {
  definePageLayoutTab,
  getSystemRecordPageLayoutUniversalIdentifier,
  PageLayoutTabLayoutMode,
} from 'twenty-sdk/define';

import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { WORKOUT_UNIVERSAL_IDENTIFIER } from 'src/objects/workout.object';
import { VOLUME_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from 'src/front-components/volume-dashboard.front-component';

export default definePageLayoutTab({
  universalIdentifier: '94ecbb01-c866-4907-aa38-ea1e1b4429ab',
  title: 'Volume',
  position: 16,
  icon: 'IconChartBar',
  layoutMode: PageLayoutTabLayoutMode.GRID,
  pageLayoutUniversalIdentifier: getSystemRecordPageLayoutUniversalIdentifier({
    objectMetadataApplicationUniversalIdentifier:
      APPLICATION_UNIVERSAL_IDENTIFIER,
    objectUniversalIdentifier: WORKOUT_UNIVERSAL_IDENTIFIER,
  }),
  widgets: [
    {
      universalIdentifier: '0a5d32c0-c259-407a-94b5-1efff11c839d',
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
