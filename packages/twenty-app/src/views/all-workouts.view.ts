import { defineView, ViewType } from 'twenty-sdk/define';

import {
  WORKOUT_DAY_FIELD_UNIVERSAL_IDENTIFIER,
  WORKOUT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  WORKOUT_UNIVERSAL_IDENTIFIER,
  WORKOUT_WEEK_FIELD_UNIVERSAL_IDENTIFIER,
} from 'src/objects/workout.object';
import { PROGRAM_ON_WORKOUT_ID } from 'src/fields/program-on-workout.field';

export const ALL_WORKOUTS_VIEW_ID = 'c39746bc-1af1-4437-ba8e-d39e3d350507';

export default defineView({
  universalIdentifier: ALL_WORKOUTS_VIEW_ID,
  name: 'All Workouts',
  objectUniversalIdentifier: WORKOUT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconCalendarEvent',
  position: 0,
  fields: [
    {
      universalIdentifier: '757c1fb2-a6de-4166-b63a-dcd33ac5d37e',
      fieldMetadataUniversalIdentifier: WORKOUT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      position: 0,
      isVisible: true,
      size: 260,
    },
    {
      universalIdentifier: 'cdfbb11b-2224-46df-bb06-b7d8055faa7b',
      fieldMetadataUniversalIdentifier: PROGRAM_ON_WORKOUT_ID,
      position: 1,
      isVisible: true,
      size: 180,
    },
    {
      universalIdentifier: '11da79b0-3dfd-4ae2-be4f-f955572bde7d',
      fieldMetadataUniversalIdentifier: WORKOUT_WEEK_FIELD_UNIVERSAL_IDENTIFIER,
      position: 2,
      isVisible: true,
      size: 100,
    },
    {
      universalIdentifier: 'e91f1153-c2c4-4869-8453-6fab73d5105f',
      fieldMetadataUniversalIdentifier: WORKOUT_DAY_FIELD_UNIVERSAL_IDENTIFIER,
      position: 3,
      isVisible: true,
      size: 120,
    },
  ],
});
