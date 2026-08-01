import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

import { PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/program-exercise.object';
import { WORKOUT_UNIVERSAL_IDENTIFIER } from 'src/objects/workout.object';
import {
  PROGRAM_EXERCISES_ON_WORKOUT_ID,
  WORKOUT_ON_PROGRAM_EXERCISE_ID,
} from 'src/fields/workout-on-program-exercise.field';

export default defineField({
  universalIdentifier: PROGRAM_EXERCISES_ON_WORKOUT_ID,
  objectUniversalIdentifier: WORKOUT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'programExercises',
  label: 'Program Exercises',
  icon: 'IconListDetails',
  relationTargetObjectMetadataUniversalIdentifier:
    PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    WORKOUT_ON_PROGRAM_EXERCISE_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
