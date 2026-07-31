import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';

import { EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/exercise.object';
import { EXERCISE_RECORD_PAGE_FIELDS_VIEW_ID } from 'src/views/exercise-record-page-fields.view';

export default definePageLayout({
  universalIdentifier: 'c22cb786-3766-429e-8c33-c1f06fb5b15b',
  name: 'Exercise Record Page',
  type: 'RECORD_PAGE',
  objectUniversalIdentifier: EXERCISE_UNIVERSAL_IDENTIFIER,
  tabs: [
    {
      universalIdentifier: '02e4c9d3-417d-45bd-bae4-869919a7cfad',
      title: 'Home',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: 'ada13767-ac26-40c8-a900-69744fef3e0c',
          title: 'Fields',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: EXERCISE_RECORD_PAGE_FIELDS_VIEW_ID,
          },
        },
      ],
    },
    {
      universalIdentifier: 'af9c067c-888c-41c9-bc61-8d979781d85b',
      title: 'Timeline',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '9efc0c61-9b17-4fc5-b6b5-85d9b087ef0a',
          title: 'Timeline',
          type: 'TIMELINE',
          configuration: { configurationType: 'TIMELINE' },
        },
      ],
    },
  ],
});
