import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { WORKOUT_UNIVERSAL_IDENTIFIER } from 'src/objects/workout.object';

export const TRAINEE_MEMBER_ON_WORKOUT_ID =
  '1ef8a46a-3225-4d45-a143-130f9cd7a6ed';
export const TRAINEE_WORKOUTS_ON_WORKSPACE_MEMBER_ID =
  'b17fe58a-9759-43ee-a18e-5ce6dfe441f2';

// Denormalized from trainee.workspaceMember: row-level permission
// predicates cannot traverse relations, so the trainee role filters
// "own records" on this direct workspace-member link.
export default defineField({
  universalIdentifier: TRAINEE_MEMBER_ON_WORKOUT_ID,
  objectUniversalIdentifier: WORKOUT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'traineeMember',
  label: 'Trainee member',
  description: 'The trainee login this workout belongs to',
  icon: 'IconUserCircle',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    TRAINEE_WORKOUTS_ON_WORKSPACE_MEMBER_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'traineeMemberId',
  },
});
