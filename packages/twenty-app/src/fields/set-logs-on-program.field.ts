import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

import { PROGRAM_UNIVERSAL_IDENTIFIER } from 'src/objects/program.object';
import { SET_LOG_UNIVERSAL_IDENTIFIER } from 'src/objects/set-log.object';
import {
  PROGRAM_ON_SET_LOG_ID,
  SET_LOGS_ON_PROGRAM_ID,
} from 'src/fields/program-on-set-log.field';

export default defineField({
  universalIdentifier: SET_LOGS_ON_PROGRAM_ID,
  objectUniversalIdentifier: PROGRAM_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'setLogs',
  label: 'Set Logs',
  icon: 'IconChecklist',
  relationTargetObjectMetadataUniversalIdentifier: SET_LOG_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: PROGRAM_ON_SET_LOG_ID,
  universalSettings: { relationType: RelationType.ONE_TO_MANY },
});
