import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

import { PROGRAM_UNIVERSAL_IDENTIFIER } from 'src/objects/program.object';
import { SESSION_UNIVERSAL_IDENTIFIER } from 'src/objects/session.object';
import {
  PROGRAM_ON_SESSION_ID,
  SESSIONS_ON_PROGRAM_ID,
} from 'src/fields/program-on-session.field';

export default defineField({
  universalIdentifier: SESSIONS_ON_PROGRAM_ID,
  objectUniversalIdentifier: PROGRAM_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'sessions',
  label: 'Sessions',
  icon: 'IconRun',
  relationTargetObjectMetadataUniversalIdentifier:
    SESSION_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: PROGRAM_ON_SESSION_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
