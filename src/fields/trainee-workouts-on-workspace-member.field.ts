import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { WORKOUT_UNIVERSAL_IDENTIFIER } from 'src/objects/workout.object';
import {
  TRAINEE_MEMBER_ON_WORKOUT_ID,
  TRAINEE_WORKOUTS_ON_WORKSPACE_MEMBER_ID,
} from 'src/fields/trainee-member-on-workout.field';

export default defineField({
  universalIdentifier: TRAINEE_WORKOUTS_ON_WORKSPACE_MEMBER_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'traineeWorkouts',
  label: 'Trainee workouts',
  icon: 'IconCalendarEvent',
  relationTargetObjectMetadataUniversalIdentifier:
    WORKOUT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: TRAINEE_MEMBER_ON_WORKOUT_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
