import { defineView, ViewType } from 'twenty-sdk/define';

import {
  PROGRAM_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_NOTES_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_STARTED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  PROGRAM_UNIVERSAL_IDENTIFIER,
} from 'src/objects/program.object';
import { WORKOUTS_ON_PROGRAM_ID } from 'src/fields/program-on-workout.field';
import { SESSIONS_ON_PROGRAM_ID } from 'src/fields/program-on-session.field';

export const PROGRAM_RECORD_PAGE_FIELDS_VIEW_ID =
  'e341713e-47a7-4602-bb07-7d744435d3d3';

export default defineView({
  universalIdentifier: PROGRAM_RECORD_PAGE_FIELDS_VIEW_ID,
  name: 'Program Record Page Fields',
  objectUniversalIdentifier: PROGRAM_UNIVERSAL_IDENTIFIER,
  type: ViewType.FIELDS_WIDGET,
  fields: [
    { universalIdentifier: '0d9a6990-1a43-4c34-a265-d545967181e7', fieldMetadataUniversalIdentifier: PROGRAM_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true },
    { universalIdentifier: '466f382a-eec1-45ba-ab2e-4e65a5ee2029', fieldMetadataUniversalIdentifier: PROGRAM_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true },
    { universalIdentifier: '06e8d7d4-4f7d-453a-a8c6-bdac6fbc1fd6', fieldMetadataUniversalIdentifier: PROGRAM_STARTED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true },
    { universalIdentifier: '782c69f0-bf9b-4a37-975d-c0cbcb0c8b62', fieldMetadataUniversalIdentifier: PROGRAM_NOTES_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true },
    { universalIdentifier: '609bbdf4-d66c-48f8-aaa6-15b409ab14b8', fieldMetadataUniversalIdentifier: WORKOUTS_ON_PROGRAM_ID, position: 4, isVisible: true },
    { universalIdentifier: 'af380c95-dc2c-4e33-a4ee-382260151b03', fieldMetadataUniversalIdentifier: SESSIONS_ON_PROGRAM_ID, position: 5, isVisible: true },
  ],
});
