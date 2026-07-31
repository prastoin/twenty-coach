import { defineObject, FieldType } from 'twenty-sdk/define';

import { Tempo, TrainingDay } from 'src/constants/training';

export const PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER =
  '6de406da-7680-4496-83a9-b90ed2eb2604';

export const PROGRAM_EXERCISE_NAME_FIELD_UNIVERSAL_IDENTIFIER =
  '2045ab10-3ebc-4c9a-a722-8942de311522';
export const PROGRAM_EXERCISE_DAY_FIELD_UNIVERSAL_IDENTIFIER =
  'aabdff5e-07f5-48fa-a0df-99892a3b172f';
export const PROGRAM_EXERCISE_TARGET_SETS_FIELD_UNIVERSAL_IDENTIFIER =
  '2738b87c-ff97-4d8d-a187-6a0648dfbbf8';
export const PROGRAM_EXERCISE_ORDER_FIELD_UNIVERSAL_IDENTIFIER =
  'de4839c9-cf8e-4d42-be66-0ac5c7aeb0f5';
export const PROGRAM_EXERCISE_TARGET_REPS_MIN_FIELD_UNIVERSAL_IDENTIFIER =
  '5c13bc7b-2f3c-4336-b92a-2646951c2923';
export const PROGRAM_EXERCISE_TARGET_REPS_MAX_FIELD_UNIVERSAL_IDENTIFIER =
  'b32107b5-35d6-494f-a0da-c21d25cd3ace';
export const PROGRAM_EXERCISE_TARGET_RIR_FIELD_UNIVERSAL_IDENTIFIER =
  '080c82d7-4a31-4a1e-89bb-d5262197ecfb';
export const PROGRAM_EXERCISE_REST_SECONDS_FIELD_UNIVERSAL_IDENTIFIER =
  'eed9667d-5062-46ef-8d75-ded453baaf80';
export const PROGRAM_EXERCISE_TEMPO_FIELD_UNIVERSAL_IDENTIFIER =
  '9df498e9-13d7-4649-afe6-1fbd548187e1';
export const PROGRAM_EXERCISE_NOTES_FIELD_UNIVERSAL_IDENTIFIER =
  'c2b629eb-c1f9-4586-aac5-2f4080b60a83';

export default defineObject({
  universalIdentifier: PROGRAM_EXERCISE_UNIVERSAL_IDENTIFIER,
  nameSingular: 'programExercise',
  namePlural: 'programExercises',
  labelSingular: 'Program Exercise',
  labelPlural: 'Program Exercises',
  description:
    'An exercise prescription within a program (junction program ↔ exercise)',
  icon: 'IconListDetails',
  labelIdentifierFieldMetadataUniversalIdentifier:
    PROGRAM_EXERCISE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: PROGRAM_EXERCISE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      description: 'e.g. "Squat — Day A"',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: PROGRAM_EXERCISE_DAY_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'day',
      label: 'Day',
      icon: 'IconCalendarWeek',
      isNullable: true,
      options: [
        {
          id: 'efd47616-8f33-4101-9907-f829a06f9367',
          value: TrainingDay.DAY_A,
          label: 'Day A',
          position: 0,
          color: 'blue',
        },
        {
          id: 'f291f0ce-7263-4515-9009-d0c8d1e83c05',
          value: TrainingDay.DAY_B,
          label: 'Day B',
          position: 1,
          color: 'green',
        },
        {
          id: 'bcf0da74-1caf-4979-aeb4-66fefc5437a5',
          value: TrainingDay.DAY_C,
          label: 'Day C',
          position: 2,
          color: 'orange',
        },
        {
          id: '2caa8e39-6db3-4c32-ac91-9ef317e6b587',
          value: TrainingDay.DAY_D,
          label: 'Day D',
          position: 3,
          color: 'purple',
        },
        {
          id: 'ce94435a-1db2-4221-bd38-f05c5eca9d7c',
          value: TrainingDay.DAY_E,
          label: 'Day E',
          position: 4,
          color: 'pink',
        },
        {
          id: 'd2723086-3550-4d6d-8920-409783f4db13',
          value: TrainingDay.DAY_F,
          label: 'Day F',
          position: 5,
          color: 'turquoise',
        },
      ],
    },
    {
      universalIdentifier: PROGRAM_EXERCISE_ORDER_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'order',
      label: 'Order',
      description: 'Position of the exercise within the day',
      icon: 'IconSortAscending',
      isNullable: true,
    },
    {
      universalIdentifier:
        PROGRAM_EXERCISE_TARGET_SETS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'targetSets',
      label: 'Target sets',
      icon: 'IconStack2',
      isNullable: true,
    },
    {
      universalIdentifier:
        PROGRAM_EXERCISE_TARGET_REPS_MIN_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'targetRepsMin',
      label: 'Target reps (min)',
      icon: 'IconRepeat',
      isNullable: true,
    },
    {
      universalIdentifier:
        PROGRAM_EXERCISE_TARGET_REPS_MAX_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'targetRepsMax',
      label: 'Target reps (max)',
      icon: 'IconRepeat',
      isNullable: true,
    },
    {
      universalIdentifier:
        PROGRAM_EXERCISE_TARGET_RIR_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'targetRir',
      label: 'Target RIR',
      description: 'Target reps in reserve (0-5)',
      icon: 'IconBattery2',
      isNullable: true,
    },
    {
      universalIdentifier:
        PROGRAM_EXERCISE_REST_SECONDS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'restSeconds',
      label: 'Rest (seconds)',
      icon: 'IconHourglass',
      isNullable: true,
    },
    {
      universalIdentifier: PROGRAM_EXERCISE_TEMPO_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'tempo',
      label: 'Tempo',
      icon: 'IconWaveSine',
      isNullable: true,
      options: [
        {
          id: '48aeb6ac-b2cb-4257-8f1a-96b1b5bc6289',
          value: Tempo.SLOW_MINUS,
          label: 'Slow-',
          position: 0,
          color: 'sky',
        },
        {
          id: '42305e47-b525-42d6-a437-bfa96c320994',
          value: Tempo.SLOW,
          label: 'Slow',
          position: 1,
          color: 'blue',
        },
        {
          id: '27b83eb5-0baf-4d7a-aca9-14d38c40028e',
          value: Tempo.SLOW_PLUS,
          label: 'Slow+',
          position: 2,
          color: 'purple',
        },
      ],
    },
    {
      universalIdentifier: PROGRAM_EXERCISE_NOTES_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'notes',
      label: 'Notes',
      icon: 'IconNote',
      isNullable: true,
    },
  ],
});
