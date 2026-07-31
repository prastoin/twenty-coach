import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';

import { PROGRAM_UNIVERSAL_IDENTIFIER } from 'src/objects/program.object';
import { PROGRAM_RECORD_PAGE_FIELDS_VIEW_ID } from 'src/views/program-record-page-fields.view';

export default definePageLayout({
  universalIdentifier: 'ba603220-3030-4f31-8ffc-727cbdbf761c',
  name: 'Program Record Page',
  type: 'RECORD_PAGE',
  objectUniversalIdentifier: PROGRAM_UNIVERSAL_IDENTIFIER,
  tabs: [
    {
      universalIdentifier: '9a3163e2-0e4d-4bac-a1ba-835a804d91f0',
      title: 'Home',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '06bac3ac-a5ec-4dfe-8d30-390ccd97c8ea',
          title: 'Fields',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: PROGRAM_RECORD_PAGE_FIELDS_VIEW_ID,
          },
        },
      ],
    },
    {
      universalIdentifier: '4321f593-d207-49a0-b74b-b432ae2356e9',
      title: 'Timeline',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '12a6e6e7-3fc4-4d61-855b-215ca27becce',
          title: 'Timeline',
          type: 'TIMELINE',
          configuration: { configurationType: 'TIMELINE' },
        },
      ],
    },
  ],
});
