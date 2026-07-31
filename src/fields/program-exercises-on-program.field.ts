import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

import { PROGRAM_UNIVERSAL_IDENTIFIER } from 'src/objects/program.object';
import { PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/program-exercise.object';
import {
  PROGRAM_EXERCISES_ON_PROGRAM_ID,
  PROGRAM_ON_PROGRAM_EXERCISE_ID,
} from 'src/fields/program-on-program-exercise.field';

export default defineField({
  universalIdentifier: PROGRAM_EXERCISES_ON_PROGRAM_ID,
  objectUniversalIdentifier: PROGRAM_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'programExercises',
  label: 'Program Exercises',
  icon: 'IconListDetails',
  relationTargetObjectMetadataUniversalIdentifier:
    PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    PROGRAM_ON_PROGRAM_EXERCISE_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
