import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SESSION_UNIVERSAL_IDENTIFIER } from 'src/objects/session.object';
import {
  TRAINEE_MEMBER_ON_SESSION_ID,
  TRAINEE_SESSIONS_ON_WORKSPACE_MEMBER_ID,
} from 'src/fields/trainee-member-on-session.field';

export default defineField({
  universalIdentifier: TRAINEE_SESSIONS_ON_WORKSPACE_MEMBER_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'traineeSessions',
  label: 'Trainee sessions',
  icon: 'IconRun',
  relationTargetObjectMetadataUniversalIdentifier:
    SESSION_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: TRAINEE_MEMBER_ON_SESSION_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
