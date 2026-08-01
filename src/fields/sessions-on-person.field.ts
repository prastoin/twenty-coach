import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SESSION_UNIVERSAL_IDENTIFIER } from 'src/objects/session.object';
import {
  SESSIONS_ON_PERSON_ID,
  TRAINEE_ON_SESSION_ID,
} from 'src/fields/trainee-on-session.field';

export default defineField({
  universalIdentifier: SESSIONS_ON_PERSON_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.RELATION,
  name: 'sessions',
  label: 'Sessions',
  icon: 'IconRun',
  relationTargetObjectMetadataUniversalIdentifier:
    SESSION_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: TRAINEE_ON_SESSION_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
