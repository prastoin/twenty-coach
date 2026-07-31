import { defineView, ViewType } from 'twenty-sdk/define';

import {
  WORKOUT_DAY_FIELD_UNIVERSAL_IDENTIFIER,
  WORKOUT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  WORKOUT_NOTES_FIELD_UNIVERSAL_IDENTIFIER,
  WORKOUT_ORDER_FIELD_UNIVERSAL_IDENTIFIER,
  WORKOUT_UNIVERSAL_IDENTIFIER,
  WORKOUT_WEEK_FIELD_UNIVERSAL_IDENTIFIER,
} from 'src/objects/workout.object';
import { PROGRAM_ON_WORKOUT_ID } from 'src/fields/program-on-workout.field';
import { PROGRAM_EXERCISES_ON_WORKOUT_ID } from 'src/fields/workout-on-program-exercise.field';
import { SESSIONS_ON_WORKOUT_ID } from 'src/fields/workout-on-session.field';

export const WORKOUT_RECORD_PAGE_FIELDS_VIEW_ID =
  '8bb49d71-76af-4f5e-be9f-1e037ef91035';

export default defineView({
  universalIdentifier: WORKOUT_RECORD_PAGE_FIELDS_VIEW_ID,
  name: 'Workout Record Page Fields',
  objectUniversalIdentifier: WORKOUT_UNIVERSAL_IDENTIFIER,
  type: ViewType.FIELDS_WIDGET,
  fields: [
    { universalIdentifier: '37a358c3-0ce7-47c3-b0d4-6e21041d91da', fieldMetadataUniversalIdentifier: WORKOUT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true },
    { universalIdentifier: '4ee99335-4373-424d-b517-00be21d4de4c', fieldMetadataUniversalIdentifier: PROGRAM_ON_WORKOUT_ID, position: 1, isVisible: true },
    { universalIdentifier: '633af30f-39f9-4d48-94cc-ab436204b323', fieldMetadataUniversalIdentifier: WORKOUT_WEEK_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true },
    { universalIdentifier: 'fc5f8477-b1bf-41f3-a6fd-54c4fc20b067', fieldMetadataUniversalIdentifier: WORKOUT_DAY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true },
    { universalIdentifier: '9fe6ad20-f181-4007-871d-19518d67e4f3', fieldMetadataUniversalIdentifier: WORKOUT_ORDER_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true },
    { universalIdentifier: '92a5e3be-9430-459b-bbab-181138d29744', fieldMetadataUniversalIdentifier: WORKOUT_NOTES_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true },
    { universalIdentifier: '7d7a5823-a26d-4fed-8ca3-3dddd53fcc03', fieldMetadataUniversalIdentifier: PROGRAM_EXERCISES_ON_WORKOUT_ID, position: 6, isVisible: true },
    { universalIdentifier: '05e8188e-92ba-4b9a-9680-663d00ef5b37', fieldMetadataUniversalIdentifier: SESSIONS_ON_WORKOUT_ID, position: 7, isVisible: true },
  ],
});
