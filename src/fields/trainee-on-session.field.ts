import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SESSION_UNIVERSAL_IDENTIFIER } from 'src/objects/session.object';

export const TRAINEE_ON_SESSION_ID = '4371d6b3-6c33-4cf9-bece-7ddc4eae1376';
export const SESSIONS_ON_PERSON_ID = '3339b2a5-2733-464e-b4e3-316eab5aad6d';

// Direct link so training history survives program archival or deletion.
export default defineField({
  universalIdentifier: TRAINEE_ON_SESSION_ID,
  objectUniversalIdentifier: SESSION_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'trainee',
  label: 'Trainee',
  icon: 'IconUser',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: SESSIONS_ON_PERSON_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'traineeId',
  },
});
