import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import { SESSION_UNIVERSAL_IDENTIFIER } from 'src/objects/session.object';
import { WORKOUT_UNIVERSAL_IDENTIFIER } from 'src/objects/workout.object';

export const WORKOUT_ON_SESSION_ID = '2cb70e38-b292-4e34-949e-8327aa4ab6fe';
export const SESSIONS_ON_WORKOUT_ID = '541cdc94-0252-4bc2-ada9-5c2379acda61';

export default defineField({
  universalIdentifier: WORKOUT_ON_SESSION_ID,
  objectUniversalIdentifier: SESSION_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'workout',
  label: 'Workout',
  description:
    'The session template this session instantiates (history keeps its own day/week copies)',
  icon: 'IconCalendarEvent',
  relationTargetObjectMetadataUniversalIdentifier:
    WORKOUT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: SESSIONS_ON_WORKOUT_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'workoutId',
  },
});
