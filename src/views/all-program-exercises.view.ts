import { defineView, ViewType } from 'twenty-sdk/define';

import {
  PROGRAM_EXERCISE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_SET_SCHEME_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_TARGET_PERCENT_1RM_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_TARGET_SETS_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_TARGET_WEIGHT_KG_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER,
} from 'src/objects/program-exercise.object';
import { WORKOUT_ON_PROGRAM_EXERCISE_ID } from 'src/fields/workout-on-program-exercise.field';
import { EXERCISE_ON_PROGRAM_EXERCISE_ID } from 'src/fields/exercise-on-program-exercise.field';

export const ALL_PROGRAM_EXERCISES_VIEW_ID =
  'c9f2899b-f2c2-46a1-9fe8-42a61bb78137';

export default defineView({
  universalIdentifier: ALL_PROGRAM_EXERCISES_VIEW_ID,
  name: 'All Program Exercises',
  objectUniversalIdentifier: PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconListDetails',
  position: 0,
  fields: [
    {
      universalIdentifier: '08f79cc3-fb9f-407a-b829-ae79b712dbf4',
      fieldMetadataUniversalIdentifier:
        PROGRAM_EXERCISE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      position: 0,
      isVisible: true,
      size: 240,
    },
    {
      universalIdentifier: '5d9556ea-3185-4a59-a473-f30124930219',
      fieldMetadataUniversalIdentifier: WORKOUT_ON_PROGRAM_EXERCISE_ID,
      position: 1,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: 'b26d2a64-d335-4080-aa64-47b56d537b45',
      fieldMetadataUniversalIdentifier: EXERCISE_ON_PROGRAM_EXERCISE_ID,
      position: 2,
      isVisible: true,
      size: 180,
    },
    {
      universalIdentifier: 'd0ddcdb9-ecce-4105-b1e0-ff561f9d8548',
      fieldMetadataUniversalIdentifier:
        PROGRAM_EXERCISE_SET_SCHEME_FIELD_UNIVERSAL_IDENTIFIER,
      position: 3,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: 'f42ad9ca-dc36-46d7-bbbd-010d06af02e7',
      fieldMetadataUniversalIdentifier:
        PROGRAM_EXERCISE_TARGET_SETS_FIELD_UNIVERSAL_IDENTIFIER,
      position: 4,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: '864b9429-3f4a-4c2c-a11c-6077cef97f52',
      fieldMetadataUniversalIdentifier:
        PROGRAM_EXERCISE_TARGET_WEIGHT_KG_FIELD_UNIVERSAL_IDENTIFIER,
      position: 5,
      isVisible: true,
      size: 140,
    },
    {
      universalIdentifier: '422e45b5-5808-4d48-8b1a-f5f1eeab5073',
      fieldMetadataUniversalIdentifier:
        PROGRAM_EXERCISE_TARGET_PERCENT_1RM_FIELD_UNIVERSAL_IDENTIFIER,
      position: 6,
      isVisible: true,
      size: 120,
    },
  ],
});
