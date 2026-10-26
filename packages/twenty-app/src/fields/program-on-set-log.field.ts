import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import { PROGRAM_UNIVERSAL_IDENTIFIER } from 'src/objects/program.object';
import { SET_LOG_UNIVERSAL_IDENTIFIER } from 'src/objects/set-log.object';

export const PROGRAM_ON_SET_LOG_ID = 'cd1d0285-79d7-444d-a533-64e5b6002d71';
export const SET_LOGS_ON_PROGRAM_ID = '7543fc51-5bcf-45c6-9a5a-9ad4d13962de';

// Denormalised from session.program: a set's program is otherwise only
// reachable through its session, which neither chart filters nor a single
// query can traverse. Stamped wherever traineeMember is stamped.
export default defineField({
  universalIdentifier: PROGRAM_ON_SET_LOG_ID,
  objectUniversalIdentifier: SET_LOG_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'program',
  label: 'Program',
  icon: 'IconClipboardList',
  relationTargetObjectMetadataUniversalIdentifier: PROGRAM_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: SET_LOGS_ON_PROGRAM_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'programId',
  },
});
