import {
  definePageLayoutTab,
  getSystemRecordPageLayoutUniversalIdentifier,
  PageLayoutTabLayoutMode,
} from 'twenty-sdk/define';

import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { PROGRAM_UNIVERSAL_IDENTIFIER } from 'src/objects/program.object';
import { PROGRAM_OVERVIEW_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from 'src/front-components/program-overview.front-component';

export default definePageLayoutTab({
  universalIdentifier: '3eb6a822-eac4-4c2d-9d86-92298632f12c',
  title: 'Plan',
  position: 15,
  icon: 'IconLayoutGrid',
  layoutMode: PageLayoutTabLayoutMode.GRID,
  pageLayoutUniversalIdentifier:
    getSystemRecordPageLayoutUniversalIdentifier({
      objectMetadataApplicationUniversalIdentifier:
        APPLICATION_UNIVERSAL_IDENTIFIER,
      objectUniversalIdentifier: PROGRAM_UNIVERSAL_IDENTIFIER,
    }),
  widgets: [
    {
      universalIdentifier: '9b30c034-0ba6-4489-b074-7990acf18f96',
      title: 'Program Plan',
      type: 'FRONT_COMPONENT',
      position: {
        layoutMode: PageLayoutTabLayoutMode.GRID,
        row: 0,
        column: 0,
        rowSpan: 40,
        columnSpan: 12,
      },
      configuration: {
        configurationType: 'FRONT_COMPONENT',
        frontComponentUniversalIdentifier:
          PROGRAM_OVERVIEW_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
      },
    },
  ],
});
