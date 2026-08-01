import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PROGRAM_UNIVERSAL_IDENTIFIER } from 'src/objects/program.object';

export const TRAINEE_ON_PROGRAM_ID = 'a9c982cd-2165-4db7-9765-14f540c6ae23';
export const PROGRAMS_ON_PERSON_ID = '14a56bbe-44f7-435e-982a-f649cf67ffe4';

// Program history = all programs of a person; the current program is the
// one with an ACTIVE status (no pointer field, single source of truth).
export default defineField({
  universalIdentifier: TRAINEE_ON_PROGRAM_ID,
  objectUniversalIdentifier: PROGRAM_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'trainee',
  label: 'Trainee',
  icon: 'IconUser',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: PROGRAMS_ON_PERSON_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'traineeId',
  },
});
