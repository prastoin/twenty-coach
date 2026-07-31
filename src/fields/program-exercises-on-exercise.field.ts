import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

import { EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/exercise.object';
import { PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/program-exercise.object';
import {
  EXERCISE_ON_PROGRAM_EXERCISE_ID,
  PROGRAM_EXERCISES_ON_EXERCISE_ID,
} from 'src/fields/exercise-on-program-exercise.field';

export default defineField({
  universalIdentifier: PROGRAM_EXERCISES_ON_EXERCISE_ID,
  objectUniversalIdentifier: EXERCISE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'programExercises',
  label: 'Program Exercises',
  icon: 'IconListDetails',
  relationTargetObjectMetadataUniversalIdentifier:
    PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    EXERCISE_ON_PROGRAM_EXERCISE_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
