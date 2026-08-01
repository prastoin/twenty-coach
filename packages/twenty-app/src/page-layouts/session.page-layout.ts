import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';

import { SESSION_UNIVERSAL_IDENTIFIER } from 'src/objects/session.object';
import { SESSION_RECORD_PAGE_FIELDS_VIEW_ID } from 'src/views/session-record-page-fields.view';

export default definePageLayout({
  universalIdentifier: 'c6250552-e632-47b9-9872-b5a44787d225',
  name: 'Session Record Page',
  type: 'RECORD_PAGE',
  objectUniversalIdentifier: SESSION_UNIVERSAL_IDENTIFIER,
  tabs: [
    {
      universalIdentifier: '327d4013-abd0-4367-956c-41d52b7f0bf0',
      title: 'Home',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '7ffabd1a-e4f6-4452-aa22-83d9fa81c03c',
          title: 'Fields',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: SESSION_RECORD_PAGE_FIELDS_VIEW_ID,
          },
        },
      ],
    },
    {
      universalIdentifier: '17068438-c7d9-49ab-bff1-fec94cbc328c',
      title: 'Timeline',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '18f09469-12da-4e4b-9f83-50f4ece0336f',
          title: 'Timeline',
          type: 'TIMELINE',
          configuration: { configurationType: 'TIMELINE' },
        },
      ],
    },
  ],
});
