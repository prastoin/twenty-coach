import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

import { PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/program-exercise.object';
import { SET_LOG_UNIVERSAL_IDENTIFIER } from 'src/objects/set-log.object';
import {
  PROGRAM_EXERCISE_ON_SET_LOG_ID,
  SET_LOGS_ON_PROGRAM_EXERCISE_ID,
} from 'src/fields/program-exercise-on-set-log.field';

export default defineField({
  universalIdentifier: SET_LOGS_ON_PROGRAM_EXERCISE_ID,
  objectUniversalIdentifier: PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'setLogs',
  label: 'Set Logs',
  icon: 'IconChecklist',
  relationTargetObjectMetadataUniversalIdentifier:
    SET_LOG_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    PROGRAM_EXERCISE_ON_SET_LOG_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
