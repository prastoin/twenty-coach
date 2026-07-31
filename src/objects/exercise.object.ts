import { defineObject, FieldType } from 'twenty-sdk/define';

export enum MuscleGroup {
  CHEST = 'CHEST',
  BACK = 'BACK',
  SHOULDERS = 'SHOULDERS',
  BICEPS = 'BICEPS',
  TRICEPS = 'TRICEPS',
  FOREARMS = 'FOREARMS',
  QUADS = 'QUADS',
  HAMSTRINGS = 'HAMSTRINGS',
  GLUTES = 'GLUTES',
  CALVES = 'CALVES',
  CORE = 'CORE',
}

export enum EquipmentType {
  BARBELL = 'BARBELL',
  DUMBBELL = 'DUMBBELL',
  MACHINE = 'MACHINE',
  CABLE = 'CABLE',
  BODYWEIGHT = 'BODYWEIGHT',
  KETTLEBELL = 'KETTLEBELL',
}

export const EXERCISE_UNIVERSAL_IDENTIFIER =
  '963a3a88-ff1c-4efa-a1f1-45c1988a8bdd';

export const EXERCISE_NAME_FIELD_UNIVERSAL_IDENTIFIER =
  '85be5cfe-0b97-492b-b2c9-7e1fc03ba830';
export const EXERCISE_MUSCLE_GROUPS_FIELD_UNIVERSAL_IDENTIFIER =
  'fc3e56fa-d8d3-4dd0-b5ed-897a96682501';
export const EXERCISE_EQUIPMENT_TYPE_FIELD_UNIVERSAL_IDENTIFIER =
  'f335d569-b733-4ba1-980f-ac553f6a3947';
export const EXERCISE_INSTRUCTIONS_FIELD_UNIVERSAL_IDENTIFIER =
  'c37393e8-4e05-4451-afdd-e0a268d6ae05';

export default defineObject({
  universalIdentifier: EXERCISE_UNIVERSAL_IDENTIFIER,
  nameSingular: 'exercise',
  namePlural: 'exercises',
  labelSingular: 'Exercise',
  labelPlural: 'Exercises',
  description: 'A movement from the exercise library',
  icon: 'IconBarbell',
  labelIdentifierFieldMetadataUniversalIdentifier:
    EXERCISE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: EXERCISE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: EXERCISE_MUSCLE_GROUPS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.MULTI_SELECT,
      name: 'muscleGroups',
      label: 'Muscle groups',
      icon: 'IconStretching',
      isNullable: true,
      options: [
        {
          id: '1f0547f3-7c51-4c9b-8657-9eb85653c875',
          value: MuscleGroup.CHEST,
          label: 'Chest',
          position: 0,
          color: 'red',
        },
        {
          id: '30fdc758-6984-4e82-a8c1-f540cd23836b',
          value: MuscleGroup.BACK,
          label: 'Back',
          position: 1,
          color: 'blue',
        },
        {
          id: '09a046ea-467f-4a91-888f-e853eea27dc7',
          value: MuscleGroup.SHOULDERS,
          label: 'Shoulders',
          position: 2,
          color: 'orange',
        },
        {
          id: '8ebdb178-f7e7-4b52-8e33-535db485acc9',
          value: MuscleGroup.BICEPS,
          label: 'Biceps',
          position: 3,
          color: 'purple',
        },
        {
          id: 'da067788-eadc-42e9-a92d-278c95c46f03',
          value: MuscleGroup.TRICEPS,
          label: 'Triceps',
          position: 4,
          color: 'pink',
        },
        {
          id: 'a818f25b-ef7a-4897-9863-bb622c19beff',
          value: MuscleGroup.FOREARMS,
          label: 'Forearms',
          position: 5,
          color: 'sky',
        },
        {
          id: 'a43d61b7-274c-4dab-8009-7b08eea5d503',
          value: MuscleGroup.QUADS,
          label: 'Quads',
          position: 6,
          color: 'green',
        },
        {
          id: '8d849a01-b2d5-4767-ad10-04399f778945',
          value: MuscleGroup.HAMSTRINGS,
          label: 'Hamstrings',
          position: 7,
          color: 'turquoise',
        },
        {
          id: 'eb054488-87ff-4561-9c20-f06d0aed7eb1',
          value: MuscleGroup.GLUTES,
          label: 'Glutes',
          position: 8,
          color: 'yellow',
        },
        {
          id: 'ef17e0ad-83a2-4769-adf2-0b65cbe293cf',
          value: MuscleGroup.CALVES,
          label: 'Calves',
          position: 9,
          color: 'brown',
        },
        {
          id: 'ce5d2287-fdb7-4126-be00-ecbef4711bb7',
          value: MuscleGroup.CORE,
          label: 'Core',
          position: 10,
          color: 'gray',
        },
      ],
    },
    {
      universalIdentifier: EXERCISE_EQUIPMENT_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'equipmentType',
      label: 'Equipment type',
      icon: 'IconTool',
      isNullable: true,
      options: [
        {
          id: '8b5403e5-084e-444a-aa25-1d134a4b9f35',
          value: EquipmentType.BARBELL,
          label: 'Barbell',
          position: 0,
          color: 'blue',
        },
        {
          id: '49370640-da82-43b7-8726-ef60ce2ae654',
          value: EquipmentType.DUMBBELL,
          label: 'Dumbbell',
          position: 1,
          color: 'green',
        },
        {
          id: '564dd5e3-7f4b-43d8-b842-fa21247d5c28',
          value: EquipmentType.MACHINE,
          label: 'Machine',
          position: 2,
          color: 'orange',
        },
        {
          id: '9b692007-c535-44bb-9af5-7dbbb219449b',
          value: EquipmentType.CABLE,
          label: 'Cable',
          position: 3,
          color: 'purple',
        },
        {
          id: '90a38e5b-3660-4a28-a325-ad6b83feeda6',
          value: EquipmentType.BODYWEIGHT,
          label: 'Bodyweight',
          position: 4,
          color: 'yellow',
        },
        {
          id: '5ae8aa40-065a-4514-af2c-529dc40cfe04',
          value: EquipmentType.KETTLEBELL,
          label: 'Kettlebell',
          position: 5,
          color: 'brown',
        },
      ],
    },
    {
      universalIdentifier: EXERCISE_INSTRUCTIONS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'instructions',
      label: 'Instructions',
      icon: 'IconFileDescription',
      isNullable: true,
    },
  ],
});
