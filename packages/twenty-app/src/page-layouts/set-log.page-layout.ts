import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';

import { SET_LOG_UNIVERSAL_IDENTIFIER } from 'src/objects/set-log.object';
import { SET_LOG_RECORD_PAGE_FIELDS_VIEW_ID } from 'src/views/set-log-record-page-fields.view';

export default definePageLayout({
  universalIdentifier: 'b57804c9-1556-4e5e-a383-55db8c1146bb',
  name: 'Set Log Record Page',
  type: 'RECORD_PAGE',
  objectUniversalIdentifier: SET_LOG_UNIVERSAL_IDENTIFIER,
  tabs: [
    {
      universalIdentifier: '5b8f2a44-574d-440e-b263-dd084e14ad13',
      title: 'Home',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '595e1005-4317-49ab-97c3-e3420159916e',
          title: 'Fields',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: SET_LOG_RECORD_PAGE_FIELDS_VIEW_ID,
          },
        },
      ],
    },
    {
      universalIdentifier: '399243fe-4dc3-4312-a1bd-9d97cd924aa2',
      title: 'Timeline',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '58a6b79c-6204-43a3-a39e-a6037aa5e444',
          title: 'Timeline',
          type: 'TIMELINE',
          configuration: { configurationType: 'TIMELINE' },
        },
      ],
    },
  ],
});
