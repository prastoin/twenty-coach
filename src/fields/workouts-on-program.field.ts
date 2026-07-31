import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

import { PROGRAM_UNIVERSAL_IDENTIFIER } from 'src/objects/program.object';
import { WORKOUT_UNIVERSAL_IDENTIFIER } from 'src/objects/workout.object';
import {
  PROGRAM_ON_WORKOUT_ID,
  WORKOUTS_ON_PROGRAM_ID,
} from 'src/fields/program-on-workout.field';

export default defineField({
  universalIdentifier: WORKOUTS_ON_PROGRAM_ID,
  objectUniversalIdentifier: PROGRAM_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'workouts',
  label: 'Workouts',
  icon: 'IconCalendarEvent',
  relationTargetObjectMetadataUniversalIdentifier:
    WORKOUT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: PROGRAM_ON_WORKOUT_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
