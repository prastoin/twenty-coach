import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';

import { PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/program-exercise.object';
import { PROGRAM_EXERCISE_RECORD_PAGE_FIELDS_VIEW_ID } from 'src/views/program-exercise-record-page-fields.view';

export default definePageLayout({
  universalIdentifier: '9a454b0b-b35d-4fd4-ab9f-4a84f754db91',
  name: 'Program Exercise Record Page',
  type: 'RECORD_PAGE',
  objectUniversalIdentifier: PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER,
  tabs: [
    {
      universalIdentifier: '72885a61-bedc-485e-ba42-a7af6178595e',
      title: 'Home',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '9e2ce7a8-7045-437b-85d6-decf5a287b03',
          title: 'Fields',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier:
              PROGRAM_EXERCISE_RECORD_PAGE_FIELDS_VIEW_ID,
          },
        },
      ],
    },
    {
      universalIdentifier: '8a86138c-a03d-42cb-90b0-8561ac8354f1',
      title: 'Timeline',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '8ca873e8-2ce4-4fc8-bab6-f9c7d56e2447',
          title: 'Timeline',
          type: 'TIMELINE',
          configuration: { configurationType: 'TIMELINE' },
        },
      ],
    },
  ],
});
