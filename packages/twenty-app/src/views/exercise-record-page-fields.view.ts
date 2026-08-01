import { defineView, ViewType } from 'twenty-sdk/define';

import {
  EXERCISE_EQUIPMENT_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
  EXERCISE_INSTRUCTIONS_FIELD_UNIVERSAL_IDENTIFIER,
  EXERCISE_MUSCLE_GROUPS_FIELD_UNIVERSAL_IDENTIFIER,
  EXERCISE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  EXERCISE_UNIVERSAL_IDENTIFIER,
} from 'src/objects/exercise.object';
import { PROGRAM_EXERCISES_ON_EXERCISE_ID } from 'src/fields/exercise-on-program-exercise.field';
import { SET_LOGS_ON_EXERCISE_ID } from 'src/fields/exercise-on-set-log.field';

export const EXERCISE_RECORD_PAGE_FIELDS_VIEW_ID =
  '8789b4c9-41c1-41c0-b5af-5cddbddccfdb';

export default defineView({
  universalIdentifier: EXERCISE_RECORD_PAGE_FIELDS_VIEW_ID,
  name: 'Exercise Record Page Fields',
  objectUniversalIdentifier: EXERCISE_UNIVERSAL_IDENTIFIER,
  type: ViewType.FIELDS_WIDGET,
  fields: [
    { universalIdentifier: '3cf1ce3d-7a1b-44c3-96a8-668972d1c568', fieldMetadataUniversalIdentifier: EXERCISE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true },
    { universalIdentifier: '9313f13d-4c70-4c91-8257-4787ab249021', fieldMetadataUniversalIdentifier: EXERCISE_MUSCLE_GROUPS_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true },
    { universalIdentifier: 'e22e24c8-b340-41be-abb7-2f9211fb5a31', fieldMetadataUniversalIdentifier: EXERCISE_EQUIPMENT_TYPE_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true },
    { universalIdentifier: '8d80e8ec-ecd9-400d-b4ac-e2f2581251a9', fieldMetadataUniversalIdentifier: EXERCISE_INSTRUCTIONS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true },
    { universalIdentifier: '0cdac5db-35ad-4e8a-bab4-dc1cbb1b9616', fieldMetadataUniversalIdentifier: PROGRAM_EXERCISES_ON_EXERCISE_ID, position: 4, isVisible: true },
    { universalIdentifier: '5ba877e7-42f5-428e-8450-90e08f9565bd', fieldMetadataUniversalIdentifier: SET_LOGS_ON_EXERCISE_ID, position: 5, isVisible: true },
  ],
});
