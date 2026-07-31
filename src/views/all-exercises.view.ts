import { defineView, ViewType } from 'twenty-sdk/define';

import {
  EXERCISE_EQUIPMENT_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
  EXERCISE_MUSCLE_GROUPS_FIELD_UNIVERSAL_IDENTIFIER,
  EXERCISE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  EXERCISE_UNIVERSAL_IDENTIFIER,
} from 'src/objects/exercise.object';

export const ALL_EXERCISES_VIEW_ID = '46f64dad-e657-4407-a7d9-19112ed9b0dd';

export default defineView({
  universalIdentifier: ALL_EXERCISES_VIEW_ID,
  name: 'All Exercises',
  objectUniversalIdentifier: EXERCISE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconBarbell',
  position: 0,
  fields: [
    {
      universalIdentifier: '61f7568e-c382-4f09-8612-a30e0e8c82de',
      fieldMetadataUniversalIdentifier:
        EXERCISE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      position: 0,
      isVisible: true,
      size: 240,
    },
    {
      universalIdentifier: '29e5c8aa-3657-4d57-b35c-16952a5d5d7c',
      fieldMetadataUniversalIdentifier:
        EXERCISE_MUSCLE_GROUPS_FIELD_UNIVERSAL_IDENTIFIER,
      position: 1,
      isVisible: true,
      size: 240,
    },
    {
      universalIdentifier: '724687f9-79f9-4337-8b51-4aff5e2e86d8',
      fieldMetadataUniversalIdentifier:
        EXERCISE_EQUIPMENT_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
      position: 2,
      isVisible: true,
      size: 150,
    },
  ],
});
