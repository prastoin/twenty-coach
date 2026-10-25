import {
  definePageLayoutTab,
  getSystemRecordPageLayoutUniversalIdentifier,
  PageLayoutTabLayoutMode,
} from 'twenty-sdk/define';

import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { SESSION_UNIVERSAL_IDENTIFIER } from 'src/objects/session.object';
import { SESSION_SHEET_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from 'src/front-components/session-sheet.front-component';

export default definePageLayoutTab({
  universalIdentifier: 'e16e4168-470c-49c5-bc6b-22dd50d35b6d',
  title: 'Sheet',
  position: 15,
  icon: 'IconListCheck',
  layoutMode: PageLayoutTabLayoutMode.GRID,
  pageLayoutUniversalIdentifier: getSystemRecordPageLayoutUniversalIdentifier({
    objectMetadataApplicationUniversalIdentifier:
      APPLICATION_UNIVERSAL_IDENTIFIER,
    objectUniversalIdentifier: SESSION_UNIVERSAL_IDENTIFIER,
  }),
  widgets: [
    {
      universalIdentifier: 'bdb83df0-5253-45c5-ad81-d5893b1212b3',
      title: 'Session Sheet',
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
          SESSION_SHEET_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
      },
    },
  ],
});
