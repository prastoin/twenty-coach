import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import { PROGRAM_UNIVERSAL_IDENTIFIER } from 'src/objects/program.object';
import { SESSION_UNIVERSAL_IDENTIFIER } from 'src/objects/session.object';

export const PROGRAM_ON_SESSION_ID = '628a1a38-69de-463e-8084-7b1dd66dbb83';
export const SESSIONS_ON_PROGRAM_ID = 'a2dc853b-2f17-46c7-b9e3-b9386887d266';

export default defineField({
  universalIdentifier: PROGRAM_ON_SESSION_ID,
  objectUniversalIdentifier: SESSION_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'program',
  label: 'Program',
  icon: 'IconClipboardList',
  relationTargetObjectMetadataUniversalIdentifier:
    PROGRAM_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: SESSIONS_ON_PROGRAM_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'programId',
  },
});
