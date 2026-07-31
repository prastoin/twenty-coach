import { defineView, ViewType } from 'twenty-sdk/define';

import {
  PROGRAM_EXERCISE_DAY_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_TARGET_SETS_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER,
} from 'src/objects/program-exercise.object';
import { PROGRAM_ON_PROGRAM_EXERCISE_ID } from 'src/fields/program-on-program-exercise.field';
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
      universalIdentifier: 'f110e4db-6254-4c5c-8035-553eb4189124',
      fieldMetadataUniversalIdentifier: PROGRAM_ON_PROGRAM_EXERCISE_ID,
      position: 1,
      isVisible: true,
      size: 180,
    },
    {
      universalIdentifier: 'b26d2a64-d335-4080-aa64-47b56d537b45',
      fieldMetadataUniversalIdentifier: EXERCISE_ON_PROGRAM_EXERCISE_ID,
      position: 2,
      isVisible: true,
      size: 180,
    },
    {
      universalIdentifier: '4386a594-e4f1-4fac-8817-d101f11b5a9f',
      fieldMetadataUniversalIdentifier:
        PROGRAM_EXERCISE_DAY_FIELD_UNIVERSAL_IDENTIFIER,
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
  ],
});
