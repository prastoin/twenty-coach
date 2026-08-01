import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import { EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/exercise.object';
import { PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/program-exercise.object';

export const EXERCISE_ON_PROGRAM_EXERCISE_ID =
  '5675284c-124c-4506-a5b4-819dbf684489';
export const PROGRAM_EXERCISES_ON_EXERCISE_ID =
  '9b4eef86-5a35-4d0c-b77e-1f0340ea4c2f';

export default defineField({
  universalIdentifier: EXERCISE_ON_PROGRAM_EXERCISE_ID,
  objectUniversalIdentifier: PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'exercise',
  label: 'Exercise',
  icon: 'IconBarbell',
  relationTargetObjectMetadataUniversalIdentifier:
    EXERCISE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    PROGRAM_EXERCISES_ON_EXERCISE_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'exerciseId',
  },
});
