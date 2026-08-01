import { defineView, ViewType } from 'twenty-sdk/define';

import {
  SET_LOG_COMMENT_FIELD_UNIVERSAL_IDENTIFIER,
  SET_LOG_EQUIPMENT_FIELD_UNIVERSAL_IDENTIFIER,
  SET_LOG_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  SET_LOG_REPS_FIELD_UNIVERSAL_IDENTIFIER,
  SET_LOG_REST_SECONDS_FIELD_UNIVERSAL_IDENTIFIER,
  SET_LOG_RIR_FIELD_UNIVERSAL_IDENTIFIER,
  SET_LOG_SET_NUMBER_FIELD_UNIVERSAL_IDENTIFIER,
  SET_LOG_TEMPO_FIELD_UNIVERSAL_IDENTIFIER,
  SET_LOG_UNIVERSAL_IDENTIFIER,
  SET_LOG_WEIGHT_KG_FIELD_UNIVERSAL_IDENTIFIER,
} from 'src/objects/set-log.object';
import { SESSION_ON_SET_LOG_ID } from 'src/fields/session-on-set-log.field';
import { EXERCISE_ON_SET_LOG_ID } from 'src/fields/exercise-on-set-log.field';
import { PROGRAM_EXERCISE_ON_SET_LOG_ID } from 'src/fields/program-exercise-on-set-log.field';

export const SET_LOG_RECORD_PAGE_FIELDS_VIEW_ID =
  '9be06fe8-21e4-4a9c-a6fc-cf08fe3b3237';

export default defineView({
  universalIdentifier: SET_LOG_RECORD_PAGE_FIELDS_VIEW_ID,
  name: 'Set Log Record Page Fields',
  objectUniversalIdentifier: SET_LOG_UNIVERSAL_IDENTIFIER,
  type: ViewType.FIELDS_WIDGET,
  fields: [
    { universalIdentifier: '438e27a3-708c-4093-90a2-9ab80eb3e41d', fieldMetadataUniversalIdentifier: SET_LOG_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true },
    { universalIdentifier: 'a34156e1-83b2-4d0d-9af7-4f40b381269e', fieldMetadataUniversalIdentifier: SESSION_ON_SET_LOG_ID, position: 1, isVisible: true },
    { universalIdentifier: '58d694bb-1cf5-43f8-a622-17abc2c014c6', fieldMetadataUniversalIdentifier: EXERCISE_ON_SET_LOG_ID, position: 2, isVisible: true },
    { universalIdentifier: 'f2b9220d-a655-4d2c-ab88-ff220e8646ea', fieldMetadataUniversalIdentifier: PROGRAM_EXERCISE_ON_SET_LOG_ID, position: 3, isVisible: true },
    { universalIdentifier: 'eeb01852-d4fd-4cbc-ba54-250206ff294a', fieldMetadataUniversalIdentifier: SET_LOG_SET_NUMBER_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true },
    { universalIdentifier: '81bf923c-7994-4d81-95e1-c4d6590fb6ca', fieldMetadataUniversalIdentifier: SET_LOG_REPS_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true },
    { universalIdentifier: '1c0e7348-f240-4530-8d01-28a8e074dcbc', fieldMetadataUniversalIdentifier: SET_LOG_WEIGHT_KG_FIELD_UNIVERSAL_IDENTIFIER, position: 6, isVisible: true },
    { universalIdentifier: '877ea736-c706-4ed1-90cb-3dfee1c7b991', fieldMetadataUniversalIdentifier: SET_LOG_RIR_FIELD_UNIVERSAL_IDENTIFIER, position: 7, isVisible: true },
    { universalIdentifier: '78d698ef-2698-4bcd-b823-00f5fe0e03ef', fieldMetadataUniversalIdentifier: SET_LOG_REST_SECONDS_FIELD_UNIVERSAL_IDENTIFIER, position: 8, isVisible: true },
    { universalIdentifier: 'fe789783-efb2-4c73-a97b-5b1404e4fa40', fieldMetadataUniversalIdentifier: SET_LOG_TEMPO_FIELD_UNIVERSAL_IDENTIFIER, position: 9, isVisible: true },
    { universalIdentifier: '913f677d-46b0-4adc-b021-effc4d2d35e3', fieldMetadataUniversalIdentifier: SET_LOG_EQUIPMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 10, isVisible: true },
    { universalIdentifier: 'c3b8455d-8ea8-4b81-8640-e639a62cbcc6', fieldMetadataUniversalIdentifier: SET_LOG_COMMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 11, isVisible: true },
  ],
});
