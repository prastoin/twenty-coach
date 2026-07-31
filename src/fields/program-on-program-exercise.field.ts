import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import { PROGRAM_UNIVERSAL_IDENTIFIER } from 'src/objects/program.object';
import { PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/program-exercise.object';

export const PROGRAM_ON_PROGRAM_EXERCISE_ID =
  '4023472c-79ce-40c2-93b8-340f50a7b765';
export const PROGRAM_EXERCISES_ON_PROGRAM_ID =
  '161fb453-a253-4515-9713-cff15eb6a505';

export default defineField({
  universalIdentifier: PROGRAM_ON_PROGRAM_EXERCISE_ID,
  objectUniversalIdentifier: PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'program',
  label: 'Program',
  icon: 'IconClipboardList',
  relationTargetObjectMetadataUniversalIdentifier:
    PROGRAM_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    PROGRAM_EXERCISES_ON_PROGRAM_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.CASCADE,
    joinColumnName: 'programId',
  },
});
