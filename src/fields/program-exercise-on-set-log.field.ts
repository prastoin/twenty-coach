import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import { PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/program-exercise.object';
import { SET_LOG_UNIVERSAL_IDENTIFIER } from 'src/objects/set-log.object';

export const PROGRAM_EXERCISE_ON_SET_LOG_ID =
  '81603864-d244-4f2a-af1c-1fb63b8ee389';
export const SET_LOGS_ON_PROGRAM_EXERCISE_ID =
  'ef3a46ea-8046-479e-af4a-529f04541f67';

export default defineField({
  universalIdentifier: PROGRAM_EXERCISE_ON_SET_LOG_ID,
  objectUniversalIdentifier: SET_LOG_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'programExercise',
  label: 'Program Exercise',
  description:
    'Optional back-link: which prescription this set was executed against',
  icon: 'IconListDetails',
  relationTargetObjectMetadataUniversalIdentifier:
    PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    SET_LOGS_ON_PROGRAM_EXERCISE_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'programExerciseId',
  },
});
