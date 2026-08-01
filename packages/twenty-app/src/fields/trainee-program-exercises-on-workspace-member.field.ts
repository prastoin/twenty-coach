import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER } from 'src/objects/program-exercise.object';
import {
  TRAINEE_MEMBER_ON_PROGRAM_EXERCISE_ID,
  TRAINEE_PROGRAM_EXERCISES_ON_WORKSPACE_MEMBER_ID,
} from 'src/fields/trainee-member-on-program-exercise.field';

export default defineField({
  universalIdentifier: TRAINEE_PROGRAM_EXERCISES_ON_WORKSPACE_MEMBER_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'traineeProgramExercises',
  label: 'Trainee prescriptions',
  icon: 'IconListDetails',
  relationTargetObjectMetadataUniversalIdentifier:
    PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    TRAINEE_MEMBER_ON_PROGRAM_EXERCISE_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
