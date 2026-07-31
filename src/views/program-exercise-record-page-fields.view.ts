import { defineView, ViewType } from 'twenty-sdk/define';

import {
  PROGRAM_EXERCISE_DAY_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_NOTES_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_ORDER_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_REST_SECONDS_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_SET_SCHEME_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_TARGET_PERCENT_1RM_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_TARGET_REPS_MAX_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_TARGET_REPS_MIN_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_TARGET_RIR_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_TARGET_SETS_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_TARGET_WEIGHT_KG_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_TEMPO_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_WEEK_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER,
} from 'src/objects/program-exercise.object';
import { PROGRAM_ON_PROGRAM_EXERCISE_ID } from 'src/fields/program-on-program-exercise.field';
import { EXERCISE_ON_PROGRAM_EXERCISE_ID } from 'src/fields/exercise-on-program-exercise.field';
import { SET_LOGS_ON_PROGRAM_EXERCISE_ID } from 'src/fields/program-exercise-on-set-log.field';

export const PROGRAM_EXERCISE_RECORD_PAGE_FIELDS_VIEW_ID =
  '01349fbe-13b9-4f4a-8162-ca4a4c07be42';

export default defineView({
  universalIdentifier: PROGRAM_EXERCISE_RECORD_PAGE_FIELDS_VIEW_ID,
  name: 'Program Exercise Record Page Fields',
  objectUniversalIdentifier: PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER,
  type: ViewType.FIELDS_WIDGET,
  fields: [
    { universalIdentifier: '0994b4cb-5834-4c6c-82a0-24f0abf70a5e', fieldMetadataUniversalIdentifier: PROGRAM_EXERCISE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true },
    { universalIdentifier: 'a97c9402-fe78-4d38-8546-8fc426cecf99', fieldMetadataUniversalIdentifier: PROGRAM_ON_PROGRAM_EXERCISE_ID, position: 1, isVisible: true },
    { universalIdentifier: '9118e9c7-5cb0-4ea0-8cc5-31ae4ef3e113', fieldMetadataUniversalIdentifier: EXERCISE_ON_PROGRAM_EXERCISE_ID, position: 2, isVisible: true },
    { universalIdentifier: 'a9d91e20-a130-44a1-8fef-5b54619efdef', fieldMetadataUniversalIdentifier: PROGRAM_EXERCISE_DAY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true },
    { universalIdentifier: '4350136c-49fc-4dc1-b92f-bca0ffb7b629', fieldMetadataUniversalIdentifier: PROGRAM_EXERCISE_WEEK_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true },
    { universalIdentifier: 'd22eb3ce-a5da-49c5-9071-7f0c92ca627c', fieldMetadataUniversalIdentifier: PROGRAM_EXERCISE_ORDER_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true },
    { universalIdentifier: 'f08db25d-a3ed-42a6-bd95-066fb3ae222f', fieldMetadataUniversalIdentifier: PROGRAM_EXERCISE_SET_SCHEME_FIELD_UNIVERSAL_IDENTIFIER, position: 6, isVisible: true },
    { universalIdentifier: '2ad30ba1-5c03-4ada-a845-ab734cbd999c', fieldMetadataUniversalIdentifier: PROGRAM_EXERCISE_TARGET_SETS_FIELD_UNIVERSAL_IDENTIFIER, position: 7, isVisible: true },
    { universalIdentifier: '3d12bbf2-cb9c-41a9-9b11-01ae8c3a01a3', fieldMetadataUniversalIdentifier: PROGRAM_EXERCISE_TARGET_REPS_MIN_FIELD_UNIVERSAL_IDENTIFIER, position: 8, isVisible: true },
    { universalIdentifier: '7f78ee9e-f5da-4c7a-8ef3-3c1578e22545', fieldMetadataUniversalIdentifier: PROGRAM_EXERCISE_TARGET_REPS_MAX_FIELD_UNIVERSAL_IDENTIFIER, position: 9, isVisible: true },
    { universalIdentifier: '90ab4535-5dab-4a0f-a900-8b1e0fb0db2f', fieldMetadataUniversalIdentifier: PROGRAM_EXERCISE_TARGET_WEIGHT_KG_FIELD_UNIVERSAL_IDENTIFIER, position: 10, isVisible: true },
    { universalIdentifier: '9b97db2d-27b7-41db-9c37-d189cfd25900', fieldMetadataUniversalIdentifier: PROGRAM_EXERCISE_TARGET_PERCENT_1RM_FIELD_UNIVERSAL_IDENTIFIER, position: 11, isVisible: true },
    { universalIdentifier: 'ca9232f0-d3bb-4615-8d45-d227f3499b12', fieldMetadataUniversalIdentifier: PROGRAM_EXERCISE_TARGET_RIR_FIELD_UNIVERSAL_IDENTIFIER, position: 12, isVisible: true },
    { universalIdentifier: '87a56953-fef4-46ec-9939-16bc87e63655', fieldMetadataUniversalIdentifier: PROGRAM_EXERCISE_REST_SECONDS_FIELD_UNIVERSAL_IDENTIFIER, position: 13, isVisible: true },
    { universalIdentifier: '510026df-e456-4cba-8c4d-19529bdedaa1', fieldMetadataUniversalIdentifier: PROGRAM_EXERCISE_TEMPO_FIELD_UNIVERSAL_IDENTIFIER, position: 14, isVisible: true },
    { universalIdentifier: 'cae52ab0-022d-425c-9cbf-21522f79a1a5', fieldMetadataUniversalIdentifier: PROGRAM_EXERCISE_NOTES_FIELD_UNIVERSAL_IDENTIFIER, position: 15, isVisible: true },
    { universalIdentifier: 'd18a203e-27d1-496c-85e5-46e1ed40df34', fieldMetadataUniversalIdentifier: SET_LOGS_ON_PROGRAM_EXERCISE_ID, position: 16, isVisible: true },
  ],
});
