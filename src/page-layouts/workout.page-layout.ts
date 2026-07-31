import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';

import { WORKOUT_UNIVERSAL_IDENTIFIER } from 'src/objects/workout.object';
import { WORKOUT_RECORD_PAGE_FIELDS_VIEW_ID } from 'src/views/workout-record-page-fields.view';
import { WORKOUT_SHEET_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from 'src/front-components/workout-sheet.front-component';

export default definePageLayout({
  universalIdentifier: 'de3fc83d-df40-49d5-bb37-a0cff40e644e',
  name: 'Workout Record Page',
  type: 'RECORD_PAGE',
  objectUniversalIdentifier: WORKOUT_UNIVERSAL_IDENTIFIER,
  tabs: [
    {
      universalIdentifier: 'e5d0f8e4-dddb-47e4-8b85-6280ff3b83bb',
      title: 'Home',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '1c0435b9-4ff2-4aee-92da-490ad6c7b164',
          title: 'Fields',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: WORKOUT_RECORD_PAGE_FIELDS_VIEW_ID,
          },
        },
      ],
    },
    {
      universalIdentifier: '16ad44b0-86c1-4956-b0f6-f1e56dda3c86',
      title: 'Sheet',
      position: 15,
      icon: 'IconClipboardText',
      widgets: [
        {
          universalIdentifier: '70a62a80-c022-41fa-941f-167285f1118c',
          title: 'Workout Sheet',
          type: 'FRONT_COMPONENT',
          gridPosition: { row: 0, column: 0, rowSpan: 24, columnSpan: 12 },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier:
              WORKOUT_SHEET_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
    {
      universalIdentifier: '066f44a5-2627-41e3-94e9-1d86326a4e31',
      title: 'Timeline',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: 'c242cea4-30ee-4be6-96f5-bd867e03615b',
          title: 'Timeline',
          type: 'TIMELINE',
          configuration: { configurationType: 'TIMELINE' },
        },
      ],
    },
  ],
});
