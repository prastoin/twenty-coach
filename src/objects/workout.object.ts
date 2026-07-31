import { defineObject, FieldType } from 'twenty-sdk/define';

import { TrainingDay } from 'src/constants/training';

export const WORKOUT_UNIVERSAL_IDENTIFIER =
  '0bdf0dec-70e5-4bec-bec2-753a0510314e';

export const WORKOUT_NAME_FIELD_UNIVERSAL_IDENTIFIER =
  'fbded240-fe9b-4e21-8ceb-1b287e895c49';
export const WORKOUT_DAY_FIELD_UNIVERSAL_IDENTIFIER =
  'c935f456-bf0e-41c8-8ff5-3bc00a8384a8';
export const WORKOUT_WEEK_FIELD_UNIVERSAL_IDENTIFIER =
  'dbcd1384-c519-46d5-9e2c-d70c2a16521e';
export const WORKOUT_ORDER_FIELD_UNIVERSAL_IDENTIFIER =
  '5faf9506-f398-4223-8feb-40dccbacb274';
export const WORKOUT_NOTES_FIELD_UNIVERSAL_IDENTIFIER =
  '91b7dec4-adab-4bec-87d9-47a185336bb5';

export default defineObject({
  universalIdentifier: WORKOUT_UNIVERSAL_IDENTIFIER,
  nameSingular: 'workout',
  namePlural: 'workouts',
  labelSingular: 'Workout',
  labelPlural: 'Workouts',
  description:
    'A session template within a program: one planned training day, holding its prescriptions',
  icon: 'IconCalendarEvent',
  labelIdentifierFieldMetadataUniversalIdentifier:
    WORKOUT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: WORKOUT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      description: 'e.g. "Monday W1 — squat & back"',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: WORKOUT_DAY_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'day',
      label: 'Day',
      icon: 'IconCalendarWeek',
      isNullable: true,
      options: [
        {
          id: '84f42bc2-2023-4b2a-bfb9-5bb5d8d3fcd6',
          value: TrainingDay.DAY_A,
          label: 'Day A',
          position: 0,
          color: 'blue',
        },
        {
          id: 'ac938b79-1066-4419-b6d4-54d614515c24',
          value: TrainingDay.DAY_B,
          label: 'Day B',
          position: 1,
          color: 'green',
        },
        {
          id: '8ea922c9-7481-4be8-93b1-0e2db51eafc7',
          value: TrainingDay.DAY_C,
          label: 'Day C',
          position: 2,
          color: 'orange',
        },
        {
          id: '7b9345c4-22fe-4a36-bf28-5e157b60761f',
          value: TrainingDay.DAY_D,
          label: 'Day D',
          position: 3,
          color: 'purple',
        },
        {
          id: '3c8baf4c-7f7a-402f-addc-11d8c4dec92f',
          value: TrainingDay.DAY_E,
          label: 'Day E',
          position: 4,
          color: 'pink',
        },
        {
          id: '290b4992-6183-40af-9080-d615b84f1a2c',
          value: TrainingDay.DAY_F,
          label: 'Day F',
          position: 5,
          color: 'turquoise',
        },
      ],
    },
    {
      universalIdentifier: WORKOUT_WEEK_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'week',
      label: 'Week',
      description: 'Cycle week this workout belongs to',
      icon: 'IconCalendarStats',
      isNullable: true,
    },
    {
      universalIdentifier: WORKOUT_ORDER_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'order',
      label: 'Order',
      description: 'Position of the workout within the week',
      icon: 'IconSortAscending',
      isNullable: true,
    },
    {
      universalIdentifier: WORKOUT_NOTES_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'notes',
      label: 'Notes',
      icon: 'IconNote',
      isNullable: true,
    },
  ],
});
