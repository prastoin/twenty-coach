import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import { PROGRAM_UNIVERSAL_IDENTIFIER } from 'src/objects/program.object';
import { WORKOUT_UNIVERSAL_IDENTIFIER } from 'src/objects/workout.object';

export const PROGRAM_ON_WORKOUT_ID = '832d9ef7-e333-460e-af7c-cfd6996fdf39';
export const WORKOUTS_ON_PROGRAM_ID = '57b2b6ea-3ea2-4746-8501-aac352da7d8f';

export default defineField({
  universalIdentifier: PROGRAM_ON_WORKOUT_ID,
  objectUniversalIdentifier: WORKOUT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'program',
  label: 'Program',
  icon: 'IconClipboardList',
  relationTargetObjectMetadataUniversalIdentifier:
    PROGRAM_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: WORKOUTS_ON_PROGRAM_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.CASCADE,
    joinColumnName: 'programId',
  },
});
