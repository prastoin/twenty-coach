import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import { PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/program-exercise.object';
import { WORKOUT_UNIVERSAL_IDENTIFIER } from 'src/objects/workout.object';

export const WORKOUT_ON_PROGRAM_EXERCISE_ID =
  '4dbb0826-bda1-4ae0-8154-bd6f2764bd01';
export const PROGRAM_EXERCISES_ON_WORKOUT_ID =
  '12e2e467-a76b-42bb-8eb9-2a2fc32b365a';

export default defineField({
  universalIdentifier: WORKOUT_ON_PROGRAM_EXERCISE_ID,
  objectUniversalIdentifier: PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'workout',
  label: 'Workout',
  icon: 'IconCalendarEvent',
  relationTargetObjectMetadataUniversalIdentifier:
    WORKOUT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    PROGRAM_EXERCISES_ON_WORKOUT_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.CASCADE,
    joinColumnName: 'workoutId',
  },
});
