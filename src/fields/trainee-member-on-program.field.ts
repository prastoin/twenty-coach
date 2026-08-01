import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PROGRAM_UNIVERSAL_IDENTIFIER } from 'src/objects/program.object';

export const TRAINEE_MEMBER_ON_PROGRAM_ID =
  '8241eff0-6aa4-4811-aa8a-bd8958d1ff7d';
export const TRAINEE_PROGRAMS_ON_WORKSPACE_MEMBER_ID =
  'ade2f3fc-985f-4379-8e97-7694e3c3705b';

// Denormalized from trainee.workspaceMember: row-level permission
// predicates cannot traverse relations, so the trainee role filters
// "own records" on this direct workspace-member link.
export default defineField({
  universalIdentifier: TRAINEE_MEMBER_ON_PROGRAM_ID,
  objectUniversalIdentifier: PROGRAM_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'traineeMember',
  label: 'Trainee member',
  description: 'The trainee login this program belongs to',
  icon: 'IconUserCircle',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    TRAINEE_PROGRAMS_ON_WORKSPACE_MEMBER_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'traineeMemberId',
  },
});
