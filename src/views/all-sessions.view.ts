import { defineView, ViewType } from 'twenty-sdk/define';

import {
  SESSION_DAY_FIELD_UNIVERSAL_IDENTIFIER,
  SESSION_DURATION_MINUTES_FIELD_UNIVERSAL_IDENTIFIER,
  SESSION_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  SESSION_STARTED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  SESSION_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  SESSION_UNIVERSAL_IDENTIFIER,
} from 'src/objects/session.object';
import { PROGRAM_ON_SESSION_ID } from 'src/fields/program-on-session.field';
import { SET_LOGS_ON_SESSION_ID } from 'src/fields/session-on-set-log.field';

export const ALL_SESSIONS_VIEW_ID = '2874eefd-00d9-473a-a5d4-9aa88d639526';

export default defineView({
  universalIdentifier: ALL_SESSIONS_VIEW_ID,
  name: 'All Sessions',
  objectUniversalIdentifier: SESSION_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconRun',
  position: 0,
  fields: [
    {
      universalIdentifier: '3c93cfab-f079-4185-82ff-ecfa7fbcdb24',
      fieldMetadataUniversalIdentifier: SESSION_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      position: 0,
      isVisible: true,
      size: 240,
    },
    {
      universalIdentifier: 'aee3e0bb-06b5-4f0e-8399-1cb6c488c18d',
      fieldMetadataUniversalIdentifier: PROGRAM_ON_SESSION_ID,
      position: 1,
      isVisible: true,
      size: 180,
    },
    {
      universalIdentifier: '35ff74c1-89d5-4a9f-9790-76a98419cf1c',
      fieldMetadataUniversalIdentifier: SESSION_DAY_FIELD_UNIVERSAL_IDENTIFIER,
      position: 2,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: 'c05dffae-41d1-41e5-90fe-f088b1234d94',
      fieldMetadataUniversalIdentifier:
        SESSION_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      position: 3,
      isVisible: true,
      size: 150,
    },
    {
      universalIdentifier: '96cc7c14-5a62-4807-8c40-ef0a9f31e82d',
      fieldMetadataUniversalIdentifier:
        SESSION_STARTED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      position: 4,
      isVisible: true,
      size: 180,
    },
    {
      universalIdentifier: '315d51b1-7f19-4c74-8bcc-4467603cc131',
      fieldMetadataUniversalIdentifier:
        SESSION_DURATION_MINUTES_FIELD_UNIVERSAL_IDENTIFIER,
      position: 5,
      isVisible: true,
      size: 150,
    },
    {
      universalIdentifier: '4e1efdcc-1052-456b-a2ed-eb0d7664aac8',
      fieldMetadataUniversalIdentifier: SET_LOGS_ON_SESSION_ID,
      position: 6,
      isVisible: true,
      size: 200,
    },
  ],
});
