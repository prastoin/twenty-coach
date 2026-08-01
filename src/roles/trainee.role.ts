import {
  defineRole,
  RowLevelPermissionPredicateOperand,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/exercise.object';
import { PROGRAM_UNIVERSAL_IDENTIFIER } from 'src/objects/program.object';
import { PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/program-exercise.object';
import { SESSION_UNIVERSAL_IDENTIFIER } from 'src/objects/session.object';
import { SET_LOG_UNIVERSAL_IDENTIFIER } from 'src/objects/set-log.object';
import { WORKOUT_UNIVERSAL_IDENTIFIER } from 'src/objects/workout.object';
import { WORKSPACE_MEMBER_ON_PERSON_ID } from 'src/fields/workspace-member-on-person.field';
import { TRAINEE_MEMBER_ON_PROGRAM_ID } from 'src/fields/trainee-member-on-program.field';
import { TRAINEE_MEMBER_ON_PROGRAM_EXERCISE_ID } from 'src/fields/trainee-member-on-program-exercise.field';
import { TRAINEE_MEMBER_ON_SESSION_ID } from 'src/fields/trainee-member-on-session.field';
import { TRAINEE_MEMBER_ON_SET_LOG_ID } from 'src/fields/trainee-member-on-set-log.field';
import { TRAINEE_MEMBER_ON_WORKOUT_ID } from 'src/fields/trainee-member-on-workout.field';

export const TRAINEE_ROLE_UNIVERSAL_IDENTIFIER =
  '71effe55-6ace-44bd-b197-80a8a4f77ea0';

const PERSON_UNIVERSAL_IDENTIFIER =
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier;
const CURRENT_MEMBER_ID =
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.fields.id
    .universalIdentifier;

// Trainees see only their own data: object permissions are limited to the
// training objects, and row-level predicates match each record's
// (denormalized) workspace-member link against the logged-in member.
// Only the exercise library is shared across trainees.
export default defineRole({
  universalIdentifier: TRAINEE_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'Trainee',
  description: 'Sees and logs only their own training data',
  icon: 'IconBarbell',
  canBeAssignedToUsers: true,
  canBeAssignedToAgents: false,
  canBeAssignedToApiKeys: false,
  canReadAllObjectRecords: false,
  canUpdateAllObjectRecords: false,
  canSoftDeleteAllObjectRecords: false,
  canDestroyAllObjectRecords: false,
  objectPermissions: [
    {
      objectUniversalIdentifier: PERSON_UNIVERSAL_IDENTIFIER,
      canReadObjectRecords: true,
    },
    {
      objectUniversalIdentifier: EXERCISE_UNIVERSAL_IDENTIFIER,
      canReadObjectRecords: true,
    },
    {
      objectUniversalIdentifier: PROGRAM_UNIVERSAL_IDENTIFIER,
      canReadObjectRecords: true,
    },
    {
      objectUniversalIdentifier: WORKOUT_UNIVERSAL_IDENTIFIER,
      canReadObjectRecords: true,
    },
    {
      objectUniversalIdentifier: PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER,
      canReadObjectRecords: true,
    },
    {
      objectUniversalIdentifier: SESSION_UNIVERSAL_IDENTIFIER,
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
    },
    {
      objectUniversalIdentifier: SET_LOG_UNIVERSAL_IDENTIFIER,
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
    },
  ],
  rowLevelPermissionPredicates: [
    {
      universalIdentifier: '42ac13c1-4554-4107-bf5a-b25a61611971',
      objectUniversalIdentifier: PERSON_UNIVERSAL_IDENTIFIER,
      fieldUniversalIdentifier: WORKSPACE_MEMBER_ON_PERSON_ID,
      operand: RowLevelPermissionPredicateOperand.IS,
      workspaceMemberFieldUniversalIdentifier: CURRENT_MEMBER_ID,
    },
    {
      universalIdentifier: '585c8a09-9843-413a-b871-4d4638f752d1',
      objectUniversalIdentifier: PROGRAM_UNIVERSAL_IDENTIFIER,
      fieldUniversalIdentifier: TRAINEE_MEMBER_ON_PROGRAM_ID,
      operand: RowLevelPermissionPredicateOperand.IS,
      workspaceMemberFieldUniversalIdentifier: CURRENT_MEMBER_ID,
    },
    {
      universalIdentifier: '3cbd7d20-025b-4735-8f25-a16e1cc23eca',
      objectUniversalIdentifier: WORKOUT_UNIVERSAL_IDENTIFIER,
      fieldUniversalIdentifier: TRAINEE_MEMBER_ON_WORKOUT_ID,
      operand: RowLevelPermissionPredicateOperand.IS,
      workspaceMemberFieldUniversalIdentifier: CURRENT_MEMBER_ID,
    },
    {
      universalIdentifier: '16dde70a-1068-484c-a08a-00b87bacde66',
      objectUniversalIdentifier: PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER,
      fieldUniversalIdentifier: TRAINEE_MEMBER_ON_PROGRAM_EXERCISE_ID,
      operand: RowLevelPermissionPredicateOperand.IS,
      workspaceMemberFieldUniversalIdentifier: CURRENT_MEMBER_ID,
    },
    {
      universalIdentifier: '4dffc991-6881-44f0-9751-40d56de04450',
      objectUniversalIdentifier: SESSION_UNIVERSAL_IDENTIFIER,
      fieldUniversalIdentifier: TRAINEE_MEMBER_ON_SESSION_ID,
      operand: RowLevelPermissionPredicateOperand.IS,
      workspaceMemberFieldUniversalIdentifier: CURRENT_MEMBER_ID,
    },
    {
      universalIdentifier: '23121086-740a-4f08-aadc-1954929e3491',
      objectUniversalIdentifier: SET_LOG_UNIVERSAL_IDENTIFIER,
      fieldUniversalIdentifier: TRAINEE_MEMBER_ON_SET_LOG_ID,
      operand: RowLevelPermissionPredicateOperand.IS,
      workspaceMemberFieldUniversalIdentifier: CURRENT_MEMBER_ID,
    },
  ],
});
