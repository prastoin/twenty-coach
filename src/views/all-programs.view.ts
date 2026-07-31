import { defineView, ViewType } from 'twenty-sdk/define';

import {
  PROGRAM_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_STARTED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_UNIVERSAL_IDENTIFIER,
} from 'src/objects/program.object';
import { PROGRAM_EXERCISES_ON_PROGRAM_ID } from 'src/fields/program-on-program-exercise.field';
import { SESSIONS_ON_PROGRAM_ID } from 'src/fields/program-on-session.field';

export const ALL_PROGRAMS_VIEW_ID = '64da3f07-edfb-4526-bf81-052c9d88d5bf';

export default defineView({
  universalIdentifier: ALL_PROGRAMS_VIEW_ID,
  name: 'All Programs',
  objectUniversalIdentifier: PROGRAM_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconClipboardList',
  position: 0,
  fields: [
    {
      universalIdentifier: '63fce31e-14df-41f7-a8e6-46f198790aed',
      fieldMetadataUniversalIdentifier: PROGRAM_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      position: 0,
      isVisible: true,
      size: 240,
    },
    {
      universalIdentifier: '373f565a-5708-442c-ba7a-2230e18fbb03',
      fieldMetadataUniversalIdentifier:
        PROGRAM_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      position: 1,
      isVisible: true,
      size: 150,
    },
    {
      universalIdentifier: '6d1b8aad-69a1-4fa1-8d73-c3845995a806',
      fieldMetadataUniversalIdentifier:
        PROGRAM_STARTED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      position: 2,
      isVisible: true,
      size: 180,
    },
    {
      universalIdentifier: '5145d9cb-0bfd-497b-8e43-ad1baa640439',
      fieldMetadataUniversalIdentifier: PROGRAM_EXERCISES_ON_PROGRAM_ID,
      position: 3,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: '2edba5dc-a22f-4889-be2b-3f58d55a8f99',
      fieldMetadataUniversalIdentifier: SESSIONS_ON_PROGRAM_ID,
      position: 4,
      isVisible: true,
      size: 220,
    },
  ],
});
