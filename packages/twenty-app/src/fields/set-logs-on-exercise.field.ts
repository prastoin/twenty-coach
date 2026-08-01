import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

import { EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/exercise.object';
import { SET_LOG_UNIVERSAL_IDENTIFIER } from 'src/objects/set-log.object';
import {
  EXERCISE_ON_SET_LOG_ID,
  SET_LOGS_ON_EXERCISE_ID,
} from 'src/fields/exercise-on-set-log.field';

export default defineField({
  universalIdentifier: SET_LOGS_ON_EXERCISE_ID,
  objectUniversalIdentifier: EXERCISE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'setLogs',
  label: 'Set Logs',
  icon: 'IconChecklist',
  relationTargetObjectMetadataUniversalIdentifier:
    SET_LOG_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: EXERCISE_ON_SET_LOG_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
