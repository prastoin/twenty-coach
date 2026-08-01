import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PROGRAM_UNIVERSAL_IDENTIFIER } from 'src/objects/program.object';
import {
  PROGRAMS_ON_PERSON_ID,
  TRAINEE_ON_PROGRAM_ID,
} from 'src/fields/trainee-on-program.field';

export default defineField({
  universalIdentifier: PROGRAMS_ON_PERSON_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.RELATION,
  name: 'programs',
  label: 'Programs',
  icon: 'IconClipboardList',
  relationTargetObjectMetadataUniversalIdentifier:
    PROGRAM_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: TRAINEE_ON_PROGRAM_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
