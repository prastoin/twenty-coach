import {
  definePageLayoutTab,
  getSystemRecordPageLayoutUniversalIdentifier,
  PageLayoutTabLayoutMode,
} from 'twenty-sdk/define';

import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { WORKOUT_UNIVERSAL_IDENTIFIER } from 'src/objects/workout.object';
import { WORKOUT_SHEET_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from 'src/front-components/workout-sheet.front-component';

export default definePageLayoutTab({
  universalIdentifier: '7050a9e6-8f53-4531-9c04-0cbc4b3d8c55',
  title: 'Sheet',
  position: 15,
  icon: 'IconClipboardText',
  layoutMode: PageLayoutTabLayoutMode.GRID,
  pageLayoutUniversalIdentifier:
    getSystemRecordPageLayoutUniversalIdentifier({
      objectMetadataApplicationUniversalIdentifier:
        APPLICATION_UNIVERSAL_IDENTIFIER,
      objectUniversalIdentifier: WORKOUT_UNIVERSAL_IDENTIFIER,
    }),
  widgets: [
    {
      universalIdentifier: '630f8ddf-52b2-40db-8b1e-657a607d7fbf',
      title: 'Workout Sheet',
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
          WORKOUT_SHEET_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
      },
    },
  ],
});
