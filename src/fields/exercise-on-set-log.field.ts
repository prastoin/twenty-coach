import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import { EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/exercise.object';
import { SET_LOG_UNIVERSAL_IDENTIFIER } from 'src/objects/set-log.object';

export const EXERCISE_ON_SET_LOG_ID = '97d63349-3463-4125-b9de-a70894d2033d';
export const SET_LOGS_ON_EXERCISE_ID = '3b064447-7628-4c01-8246-602d6fc861c8';

export default defineField({
  universalIdentifier: EXERCISE_ON_SET_LOG_ID,
  objectUniversalIdentifier: SET_LOG_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'exercise',
  label: 'Exercise',
  icon: 'IconBarbell',
  relationTargetObjectMetadataUniversalIdentifier:
    EXERCISE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: SET_LOGS_ON_EXERCISE_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'exerciseId',
  },
});
