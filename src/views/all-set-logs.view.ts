import { defineView, ViewType } from 'twenty-sdk/define';

import {
  SET_LOG_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  SET_LOG_REPS_FIELD_UNIVERSAL_IDENTIFIER,
  SET_LOG_RIR_FIELD_UNIVERSAL_IDENTIFIER,
  SET_LOG_SET_NUMBER_FIELD_UNIVERSAL_IDENTIFIER,
  SET_LOG_UNIVERSAL_IDENTIFIER,
  SET_LOG_WEIGHT_KG_FIELD_UNIVERSAL_IDENTIFIER,
} from 'src/objects/set-log.object';
import { SESSION_ON_SET_LOG_ID } from 'src/fields/session-on-set-log.field';
import { EXERCISE_ON_SET_LOG_ID } from 'src/fields/exercise-on-set-log.field';
import { PROGRAM_EXERCISE_ON_SET_LOG_ID } from 'src/fields/program-exercise-on-set-log.field';

export const ALL_SET_LOGS_VIEW_ID = '0f45251e-4070-4428-96cf-db4b18f126d8';

export default defineView({
  universalIdentifier: ALL_SET_LOGS_VIEW_ID,
  name: 'All Set Logs',
  objectUniversalIdentifier: SET_LOG_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconChecklist',
  position: 0,
  fields: [
    {
      universalIdentifier: '63062955-13da-4051-8a8b-a63e7b188fa5',
      fieldMetadataUniversalIdentifier: SET_LOG_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      position: 0,
      isVisible: true,
      size: 240,
    },
    {
      universalIdentifier: '7c9b3353-56e8-46e8-819e-664395a7034d',
      fieldMetadataUniversalIdentifier: SESSION_ON_SET_LOG_ID,
      position: 1,
      isVisible: true,
      size: 180,
    },
    {
      universalIdentifier: '93777184-c4fc-4b28-86ca-7c5385b0ab5b',
      fieldMetadataUniversalIdentifier: EXERCISE_ON_SET_LOG_ID,
      position: 2,
      isVisible: true,
      size: 180,
    },
    {
      universalIdentifier: 'a9b0643c-255b-4c47-be9d-d436cfbf700f',
      fieldMetadataUniversalIdentifier:
        SET_LOG_SET_NUMBER_FIELD_UNIVERSAL_IDENTIFIER,
      position: 3,
      isVisible: true,
      size: 100,
    },
    {
      universalIdentifier: 'ab35cb6d-ddfe-4176-9e19-51113af2961a',
      fieldMetadataUniversalIdentifier: SET_LOG_REPS_FIELD_UNIVERSAL_IDENTIFIER,
      position: 4,
      isVisible: true,
      size: 100,
    },
    {
      universalIdentifier: '84c276bd-edcc-4b74-a059-ed4f1ce7fbfa',
      fieldMetadataUniversalIdentifier:
        SET_LOG_WEIGHT_KG_FIELD_UNIVERSAL_IDENTIFIER,
      position: 5,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: '26697152-81ca-4add-8c85-ac31f61d483a',
      fieldMetadataUniversalIdentifier: SET_LOG_RIR_FIELD_UNIVERSAL_IDENTIFIER,
      position: 6,
      isVisible: true,
      size: 100,
    },
    {
      universalIdentifier: 'f2d618c9-aea3-417f-b531-f7c35e60aaba',
      fieldMetadataUniversalIdentifier: PROGRAM_EXERCISE_ON_SET_LOG_ID,
      position: 7,
      isVisible: true,
      size: 200,
    },
  ],
});
