import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SET_LOG_UNIVERSAL_IDENTIFIER } from 'src/objects/set-log.object';
import {
  TRAINEE_MEMBER_ON_SET_LOG_ID,
  TRAINEE_SET_LOGS_ON_WORKSPACE_MEMBER_ID,
} from 'src/fields/trainee-member-on-set-log.field';

export default defineField({
  universalIdentifier: TRAINEE_SET_LOGS_ON_WORKSPACE_MEMBER_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'traineeSetLogs',
  label: 'Trainee set logs',
  icon: 'IconChecklist',
  relationTargetObjectMetadataUniversalIdentifier:
    SET_LOG_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: TRAINEE_MEMBER_ON_SET_LOG_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
