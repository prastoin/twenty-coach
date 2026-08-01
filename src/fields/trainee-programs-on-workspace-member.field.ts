import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PROGRAM_UNIVERSAL_IDENTIFIER } from 'src/objects/program.object';
import {
  TRAINEE_MEMBER_ON_PROGRAM_ID,
  TRAINEE_PROGRAMS_ON_WORKSPACE_MEMBER_ID,
} from 'src/fields/trainee-member-on-program.field';

export default defineField({
  universalIdentifier: TRAINEE_PROGRAMS_ON_WORKSPACE_MEMBER_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'traineePrograms',
  label: 'Trainee programs',
  icon: 'IconClipboardList',
  relationTargetObjectMetadataUniversalIdentifier:
    PROGRAM_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: TRAINEE_MEMBER_ON_PROGRAM_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
