import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import { SESSION_UNIVERSAL_IDENTIFIER } from 'src/objects/session.object';
import { SET_LOG_UNIVERSAL_IDENTIFIER } from 'src/objects/set-log.object';

export const SESSION_ON_SET_LOG_ID = '9ae87d60-263b-4333-bb5c-b5b85563f46d';
export const SET_LOGS_ON_SESSION_ID = 'ded72ff3-261e-4fc8-a343-14aac41cc879';

export default defineField({
  universalIdentifier: SESSION_ON_SET_LOG_ID,
  objectUniversalIdentifier: SET_LOG_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'session',
  label: 'Session',
  icon: 'IconRun',
  relationTargetObjectMetadataUniversalIdentifier:
    SESSION_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: SET_LOGS_ON_SESSION_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.CASCADE,
    joinColumnName: 'sessionId',
  },
});
