import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const WORKSPACE_MEMBER_ON_PERSON_ID =
  '0fc93a5e-fae5-40d1-895c-8cb833060c95';
export const TRAINEES_ON_WORKSPACE_MEMBER_ID =
  '76f43b58-3233-4880-9b2d-22f16b7665bd';

// The trainee's login. Anchor for row-level permission predicates
// ("this record belongs to the current workspace member").
export default defineField({
  universalIdentifier: WORKSPACE_MEMBER_ON_PERSON_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.RELATION,
  name: 'workspaceMember',
  label: 'Workspace member',
  description: 'The workspace member this trainee logs in as',
  icon: 'IconUserCircle',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    TRAINEES_ON_WORKSPACE_MEMBER_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'workspaceMemberId',
  },
});
