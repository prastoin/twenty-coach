import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/program-exercise.object';

export const TRAINEE_MEMBER_ON_PROGRAM_EXERCISE_ID =
  '752b4139-e5fa-4038-a842-444789d241fd';
export const TRAINEE_PROGRAM_EXERCISES_ON_WORKSPACE_MEMBER_ID =
  '41a39c7d-65cb-4c52-a69a-d516779c1fb3';

// Denormalized from trainee.workspaceMember: row-level permission
// predicates cannot traverse relations, so the trainee role filters
// "own records" on this direct workspace-member link.
export default defineField({
  universalIdentifier: TRAINEE_MEMBER_ON_PROGRAM_EXERCISE_ID,
  objectUniversalIdentifier: PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'traineeMember',
  label: 'Trainee member',
  description: 'The trainee login this prescription belongs to',
  icon: 'IconUserCircle',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    TRAINEE_PROGRAM_EXERCISES_ON_WORKSPACE_MEMBER_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'traineeMemberId',
  },
});
