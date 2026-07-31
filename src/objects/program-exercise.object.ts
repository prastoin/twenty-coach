import { defineObject, FieldType } from 'twenty-sdk/define';

import { SetScheme, TrainingDay } from 'src/constants/training';

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
  '00c938d7-0eb6-4789-b193-75d4a124f62b';
export const PROGRAM_EXERCISE_NOTES_FIELD_UNIVERSAL_IDENTIFIER =
  'c2b629eb-c1f9-4586-aac5-2f4080b60a83';
export const PROGRAM_EXERCISE_WEEK_FIELD_UNIVERSAL_IDENTIFIER =
  '7bdbf94a-afc4-40d3-8edc-9d1d4f973b8f';
export const PROGRAM_EXERCISE_TARGET_WEIGHT_KG_FIELD_UNIVERSAL_IDENTIFIER =
  '0e22dfd0-4c77-492c-a89d-54c5dc5de36d';
export const PROGRAM_EXERCISE_TARGET_PERCENT_1RM_FIELD_UNIVERSAL_IDENTIFIER =
  '182bfd1a-ca2b-40da-90bb-0cda7296c6b1';
export const PROGRAM_EXERCISE_SET_SCHEME_FIELD_UNIVERSAL_IDENTIFIER =
  '214029a9-c134-4725-ad01-d4cdd2b86b8e';

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
      universalIdentifier: PROGRAM_EXERCISE_WEEK_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'week',
      label: 'Week',
      description:
        'Cycle week this prescription applies to (empty = every week)',
      icon: 'IconCalendarStats',
      isNullable: true,
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
      universalIdentifier: PROGRAM_EXERCISE_SET_SCHEME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'setScheme',
      label: 'Set scheme',
      description: 'How the prescribed sets are performed (empty = straight)',
      icon: 'IconStack2',
      isNullable: true,
      options: [
        { id: 'bcc76153-bd84-4f64-82b7-3093b5c33a37', value: SetScheme.STRAIGHT, label: 'Straight', position: 0, color: 'gray' },
        { id: 'a7705329-b17d-4974-afd4-a32556a1603e', value: SetScheme.TOP_SET, label: 'Top set', position: 1, color: 'red' },
        { id: 'aedaf39b-ee80-48dd-9769-25e006b533e2', value: SetScheme.BACKOFF, label: 'Backoff', position: 2, color: 'orange' },
        { id: '58ce2682-b224-4e9e-8bcb-2def60cd4903', value: SetScheme.DROPSET, label: 'Dropset', position: 3, color: 'purple' },
        { id: '6f1ef0d4-0718-456b-a3b1-94065e76c195', value: SetScheme.CLUSTER, label: 'Cluster', position: 4, color: 'blue' },
        { id: '939406fe-0d3b-4c1f-ac6c-3fae8a0c85ac', value: SetScheme.AMRAP, label: 'AMRAP', position: 5, color: 'pink' },
        { id: 'ec3da605-308f-4be8-a63d-9c70c1f27cee', value: SetScheme.EMOM, label: 'EMOM', position: 6, color: 'turquoise' },
      ],
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
        PROGRAM_EXERCISE_TARGET_WEIGHT_KG_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'targetWeightKg',
      label: 'Target weight (kg)',
      description: 'Expected load for the prescribed sets',
      icon: 'IconWeight',
      isNullable: true,
    },
    {
      universalIdentifier:
        PROGRAM_EXERCISE_TARGET_PERCENT_1RM_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'targetPercent1Rm',
      label: 'Target %1RM',
      description: 'Expected load as a percentage of the one-rep max',
      icon: 'IconPercentage',
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
      type: FieldType.TEXT,
      name: 'tempo',
      label: 'Tempo',
      description: 'Free notation, e.g. "0-3-3-0" or "slow+"',
      icon: 'IconWaveSine',
      isNullable: true,
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
