import { defineObject, FieldType } from 'twenty-sdk/define';

export enum ProgramStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export const PROGRAM_UNIVERSAL_IDENTIFIER =
  'abeffb15-d383-4632-a919-c31f1628e4df';

export const PROGRAM_NAME_FIELD_UNIVERSAL_IDENTIFIER =
  '231f0b9e-dd8a-4a05-8c5f-9e6317519681';
export const PROGRAM_STATUS_FIELD_UNIVERSAL_IDENTIFIER =
  'd05aab98-8625-44d6-bf13-08b8f3699d0e';
export const PROGRAM_STARTED_AT_FIELD_UNIVERSAL_IDENTIFIER =
  'b78b604a-5d5b-4bd5-b7b0-d7f24feed41e';

export default defineObject({
  universalIdentifier: PROGRAM_UNIVERSAL_IDENTIFIER,
  nameSingular: 'program',
  namePlural: 'programs',
  labelSingular: 'Program',
  labelPlural: 'Programs',
  description: 'A training program (the plan side, authored once)',
  icon: 'IconClipboardList',
  labelIdentifierFieldMetadataUniversalIdentifier:
    PROGRAM_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: PROGRAM_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: PROGRAM_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgress',
      defaultValue: `'${ProgramStatus.DRAFT}'`,
      options: [
        {
          id: 'ac5a895c-91b0-4787-86ea-a1b7a9ca44b9',
          value: ProgramStatus.DRAFT,
          label: 'Draft',
          position: 0,
          color: 'gray',
        },
        {
          id: '7ce7fc14-f943-4583-9e8b-5b678dd7e529',
          value: ProgramStatus.ACTIVE,
          label: 'Active',
          position: 1,
          color: 'green',
        },
        {
          id: '9dec9545-6d66-4044-8296-e7d7d185108b',
          value: ProgramStatus.ARCHIVED,
          label: 'Archived',
          position: 2,
          color: 'brown',
        },
      ],
    },
    {
      universalIdentifier: PROGRAM_STARTED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'startedAt',
      label: 'Started at',
      icon: 'IconPlayerPlay',
      isNullable: true,
    },
    {
      universalIdentifier: '17d77e76-e4ce-4d25-9944-f00b3084710f',
      type: FieldType.TEXT,
      name: 'notes',
      label: 'Notes',
      icon: 'IconNote',
      isNullable: true,
    },
  ],
});
