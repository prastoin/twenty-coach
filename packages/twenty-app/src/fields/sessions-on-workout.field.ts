import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

import { SESSION_UNIVERSAL_IDENTIFIER } from 'src/objects/session.object';
import { WORKOUT_UNIVERSAL_IDENTIFIER } from 'src/objects/workout.object';
import {
  SESSIONS_ON_WORKOUT_ID,
  WORKOUT_ON_SESSION_ID,
} from 'src/fields/workout-on-session.field';

export default defineField({
  universalIdentifier: SESSIONS_ON_WORKOUT_ID,
  objectUniversalIdentifier: WORKOUT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'sessions',
  label: 'Sessions',
  icon: 'IconRun',
  relationTargetObjectMetadataUniversalIdentifier:
    SESSION_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: WORKOUT_ON_SESSION_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
