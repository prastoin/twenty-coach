import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  TRAINEES_ON_WORKSPACE_MEMBER_ID,
  WORKSPACE_MEMBER_ON_PERSON_ID,
} from 'src/fields/workspace-member-on-person.field';

export default defineField({
  universalIdentifier: TRAINEES_ON_WORKSPACE_MEMBER_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'trainees',
  label: 'Trainees',
  description: 'Person records linked to this workspace member',
  icon: 'IconUsers',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    WORKSPACE_MEMBER_ON_PERSON_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
