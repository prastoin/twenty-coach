import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewType,
} from 'twenty-sdk/define';

import { TRAINING_STATUS_ON_PERSON_ID } from 'src/fields/training-status-on-person.field';
import { WORKSPACE_MEMBER_ON_PERSON_ID } from 'src/fields/workspace-member-on-person.field';
import { PROGRAMS_ON_PERSON_ID } from 'src/fields/trainee-on-program.field';
import { SESSIONS_ON_PERSON_ID } from 'src/fields/trainee-on-session.field';

export const TRAINEES_VIEW_ID = '95fef630-a79d-4ee0-802e-e2cd09b30d9f';

const PERSON = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person;

// People with a training status are trainees; the rest of the person
// records stay plain CRM contacts.
export default defineView({
  universalIdentifier: TRAINEES_VIEW_ID,
  name: 'Trainees',
  objectUniversalIdentifier: PERSON.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconUsers',
  position: 0,
  filters: [
    {
      universalIdentifier: '862f6b54-6b34-4e85-978c-0772f9201497',
      fieldMetadataUniversalIdentifier: TRAINING_STATUS_ON_PERSON_ID,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: [],
    },
  ],
  fields: [
    {
      universalIdentifier: '7f7c89bf-35c3-4f25-89c9-ce6cc160933f',
      fieldMetadataUniversalIdentifier: PERSON.fields.name.universalIdentifier,
      position: 0,
      isVisible: true,
      size: 210,
    },
    {
      universalIdentifier: '102678a8-21a1-45b2-be27-15bf71507961',
      fieldMetadataUniversalIdentifier: TRAINING_STATUS_ON_PERSON_ID,
      position: 1,
      isVisible: true,
      size: 150,
    },
    {
      universalIdentifier: '852be3b3-d159-4647-afba-6e9bdd17b241',
      fieldMetadataUniversalIdentifier:
        PERSON.fields.emails.universalIdentifier,
      position: 2,
      isVisible: true,
      size: 210,
    },
    {
      universalIdentifier: '3abaf1de-465c-477d-838f-9f9d89cb04dc',
      fieldMetadataUniversalIdentifier: WORKSPACE_MEMBER_ON_PERSON_ID,
      position: 3,
      isVisible: true,
      size: 180,
    },
    {
      universalIdentifier: 'bd81dd2d-6e72-442e-98ab-f2a3374087cf',
      fieldMetadataUniversalIdentifier: PROGRAMS_ON_PERSON_ID,
      position: 4,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: '5868723b-f997-4dfc-8f7b-c2afdff941c8',
      fieldMetadataUniversalIdentifier: SESSIONS_ON_PERSON_ID,
      position: 5,
      isVisible: true,
      size: 220,
    },
  ],
});
