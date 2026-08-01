import { defineView, ViewType } from 'twenty-sdk/define';

import {
  SESSION_COMMENT_FIELD_UNIVERSAL_IDENTIFIER,
  SESSION_DAY_FIELD_UNIVERSAL_IDENTIFIER,
  SESSION_DURATION_MINUTES_FIELD_UNIVERSAL_IDENTIFIER,
  SESSION_ENDED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  SESSION_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  SESSION_STARTED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  SESSION_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  SESSION_UNIVERSAL_IDENTIFIER,
  SESSION_WEEK_FIELD_UNIVERSAL_IDENTIFIER,
} from 'src/objects/session.object';
import { PROGRAM_ON_SESSION_ID } from 'src/fields/program-on-session.field';
import { SET_LOGS_ON_SESSION_ID } from 'src/fields/session-on-set-log.field';
import { WORKOUT_ON_SESSION_ID } from 'src/fields/workout-on-session.field';

export const SESSION_RECORD_PAGE_FIELDS_VIEW_ID =
  'a474a1b7-21c2-4252-b815-b51fd3d93e5e';

export default defineView({
  universalIdentifier: SESSION_RECORD_PAGE_FIELDS_VIEW_ID,
  name: 'Session Record Page Fields',
  objectUniversalIdentifier: SESSION_UNIVERSAL_IDENTIFIER,
  type: ViewType.FIELDS_WIDGET,
  fields: [
    { universalIdentifier: 'b3335506-d6f0-4815-ae87-293517ff731d', fieldMetadataUniversalIdentifier: SESSION_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true },
    { universalIdentifier: '9e5f78c4-c62e-4215-99ae-ae8102edd9f7', fieldMetadataUniversalIdentifier: PROGRAM_ON_SESSION_ID, position: 1, isVisible: true },
    { universalIdentifier: 'cc7a0e42-7183-4486-b515-6c45b0a93145', fieldMetadataUniversalIdentifier: WORKOUT_ON_SESSION_ID, position: 2, isVisible: true },
    { universalIdentifier: 'd924bba4-e0a4-4035-8436-b0035d4113dc', fieldMetadataUniversalIdentifier: SESSION_DAY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true },
    { universalIdentifier: '7438eefe-940a-4954-b3c4-f41d36c04109', fieldMetadataUniversalIdentifier: SESSION_WEEK_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true },
    { universalIdentifier: '1d2b070b-49a3-4974-a24e-16ead2a4a7e3', fieldMetadataUniversalIdentifier: SESSION_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true },
    { universalIdentifier: '8dd06526-78e9-48a0-98dc-d2b4da3e6469', fieldMetadataUniversalIdentifier: SESSION_STARTED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 6, isVisible: true },
    { universalIdentifier: '1369308a-8da9-420a-b2d3-82ecfaad883b', fieldMetadataUniversalIdentifier: SESSION_ENDED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 7, isVisible: true },
    { universalIdentifier: '39a5b51b-d16d-4c5f-b66f-14665633e9d8', fieldMetadataUniversalIdentifier: SESSION_DURATION_MINUTES_FIELD_UNIVERSAL_IDENTIFIER, position: 8, isVisible: true },
    { universalIdentifier: '8c4dc161-63f9-4af6-8b6b-113a8c73b347', fieldMetadataUniversalIdentifier: SESSION_COMMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 9, isVisible: true },
    { universalIdentifier: '3c5c718a-ad35-4560-8ec8-05970807fb18', fieldMetadataUniversalIdentifier: SET_LOGS_ON_SESSION_ID, position: 10, isVisible: true },
  ],
});
