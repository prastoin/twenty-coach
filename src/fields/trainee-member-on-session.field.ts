import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SESSION_UNIVERSAL_IDENTIFIER } from 'src/objects/session.object';

export const TRAINEE_MEMBER_ON_SESSION_ID =
  '67cfebb0-8da3-49b5-b168-6131800ce8ea';
export const TRAINEE_SESSIONS_ON_WORKSPACE_MEMBER_ID =
  'c34977fe-47d7-4f8e-bb73-17c19e6a3ce6';

// Denormalized from trainee.workspaceMember: row-level permission
// predicates cannot traverse relations, so the trainee role filters
// "own records" on this direct workspace-member link.
export default defineField({
  universalIdentifier: TRAINEE_MEMBER_ON_SESSION_ID,
  objectUniversalIdentifier: SESSION_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'traineeMember',
  label: 'Trainee member',
  description: 'The trainee login this session belongs to',
  icon: 'IconUserCircle',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    TRAINEE_SESSIONS_ON_WORKSPACE_MEMBER_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'traineeMemberId',
  },
});
