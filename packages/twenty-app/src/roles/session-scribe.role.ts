import { defineRole, STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from 'twenty-sdk/define';

import { EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/exercise.object';
import { SESSION_UNIVERSAL_IDENTIFIER } from 'src/objects/session.object';
import { SET_LOG_UNIVERSAL_IDENTIFIER } from 'src/objects/set-log.object';

export const SESSION_SCRIBE_ROLE_UNIVERSAL_IDENTIFIER =
  '2801f838-d2b0-4c3a-8ac7-08c448f47679';

// Deliberately narrower than the app's default role: the scribe only ever
// reads the exercise library to resolve names and appends sessions and set
// logs. It cannot delete, and it cannot touch programs or prescriptions.
export default defineRole({
  universalIdentifier: SESSION_SCRIBE_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'Session Scribe',
  description: 'Transcribes free-text training logs into sessions',
  icon: 'IconPencil',
  canBeAssignedToUsers: false,
  canBeAssignedToAgents: true,
  canBeAssignedToApiKeys: false,
  canReadAllObjectRecords: false,
  canUpdateAllObjectRecords: false,
  canSoftDeleteAllObjectRecords: false,
  canDestroyAllObjectRecords: false,
  objectPermissions: [
    {
      objectUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember
          .universalIdentifier,
      canReadObjectRecords: true,
    },
    {
      objectUniversalIdentifier: EXERCISE_UNIVERSAL_IDENTIFIER,
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
});
