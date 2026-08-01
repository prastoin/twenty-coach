import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

import { SESSION_UNIVERSAL_IDENTIFIER } from 'src/objects/session.object';
import { SET_LOG_UNIVERSAL_IDENTIFIER } from 'src/objects/set-log.object';
import {
  SESSION_ON_SET_LOG_ID,
  SET_LOGS_ON_SESSION_ID,
} from 'src/fields/session-on-set-log.field';

export default defineField({
  universalIdentifier: SET_LOGS_ON_SESSION_ID,
  objectUniversalIdentifier: SESSION_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'setLogs',
  label: 'Set Logs',
  icon: 'IconChecklist',
  relationTargetObjectMetadataUniversalIdentifier:
    SET_LOG_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: SESSION_ON_SET_LOG_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
