import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SET_LOG_UNIVERSAL_IDENTIFIER } from 'src/objects/set-log.object';

export const TRAINEE_MEMBER_ON_SET_LOG_ID =
  '1d3961ac-39a5-4421-9479-f9e9c3a2a72c';
export const TRAINEE_SET_LOGS_ON_WORKSPACE_MEMBER_ID =
  '728fc9a7-4eb6-4e41-9a91-c039069eacaa';

// Denormalized from trainee.workspaceMember: row-level permission
// predicates cannot traverse relations, so the trainee role filters
// "own records" on this direct workspace-member link.
export default defineField({
  universalIdentifier: TRAINEE_MEMBER_ON_SET_LOG_ID,
  objectUniversalIdentifier: SET_LOG_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'traineeMember',
  label: 'Trainee member',
  description: 'The trainee login this set log belongs to',
  icon: 'IconUserCircle',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    TRAINEE_SET_LOGS_ON_WORKSPACE_MEMBER_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'traineeMemberId',
  },
});
