import { defineObject, FieldType } from 'twenty-sdk/define';

import { TrainingDay } from 'src/constants/training';

export enum SessionStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export const SESSION_UNIVERSAL_IDENTIFIER =
  '040cd7b3-0468-42b0-b64b-653c2af5c830';

export const SESSION_NAME_FIELD_UNIVERSAL_IDENTIFIER =
  '0f1eacc9-992e-4858-887f-b25aaa7f870a';
export const SESSION_DAY_FIELD_UNIVERSAL_IDENTIFIER =
  '0560a6f7-51f1-482f-a51e-3d7ca4a1cdb1';
export const SESSION_WEEK_FIELD_UNIVERSAL_IDENTIFIER =
  '8b63d7e8-717f-4beb-b6cf-8e1799e6bb62';
export const SESSION_STATUS_FIELD_UNIVERSAL_IDENTIFIER =
  '08baa9ac-8804-4486-b655-ade088736b54';
export const SESSION_STARTED_AT_FIELD_UNIVERSAL_IDENTIFIER =
  'b5d8c00d-e487-40f0-8a31-268c65d4d62f';
export const SESSION_DURATION_MINUTES_FIELD_UNIVERSAL_IDENTIFIER =
  '4615ba9c-a56d-46b0-9b51-daec7b61efb8';
export const SESSION_ENDED_AT_FIELD_UNIVERSAL_IDENTIFIER =
  '9740649f-3b68-4829-ab7a-691410f18ef0';
export const SESSION_COMMENT_FIELD_UNIVERSAL_IDENTIFIER =
  'e53420de-42e6-4676-8052-f718f8198ff7';

export default defineObject({
  universalIdentifier: SESSION_UNIVERSAL_IDENTIFIER,
  nameSingular: 'session',
  namePlural: 'sessions',
  labelSingular: 'Session',
  labelPlural: 'Sessions',
  description: 'One workout (the log side, append-only history)',
  icon: 'IconRun',
  labelIdentifierFieldMetadataUniversalIdentifier:
    SESSION_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: SESSION_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      description: 'e.g. "Day A — 2026-07-31"',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: SESSION_DAY_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'day',
      label: 'Day',
      description: 'Which program day this session instantiates',
      icon: 'IconCalendarWeek',
      isNullable: true,
      options: [
        {
          id: '18ae4bea-4184-4943-af70-470d6b9840a8',
          value: TrainingDay.DAY_A,
          label: 'Day A',
          position: 0,
          color: 'blue',
        },
        {
          id: 'af0fdaa3-0d32-4119-acf7-efc4d4d9374e',
          value: TrainingDay.DAY_B,
          label: 'Day B',
          position: 1,
          color: 'green',
        },
        {
          id: 'fb770305-274e-456e-a17c-dae9edb9e28c',
          value: TrainingDay.DAY_C,
          label: 'Day C',
          position: 2,
          color: 'orange',
        },
        {
          id: 'c60c59d8-c827-4f8a-8183-e383575ef858',
          value: TrainingDay.DAY_D,
          label: 'Day D',
          position: 3,
          color: 'purple',
        },
        {
          id: 'be38ba2c-fa21-4f6a-a377-8504feb165e7',
          value: TrainingDay.DAY_E,
          label: 'Day E',
          position: 4,
          color: 'pink',
        },
        {
          id: '63728003-aa28-4cd9-a390-a99c4578c113',
          value: TrainingDay.DAY_F,
          label: 'Day F',
          position: 5,
          color: 'turquoise',
        },
      ],
    },
    {
      universalIdentifier: SESSION_WEEK_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'week',
      label: 'Week',
      description: 'Cycle week this session instantiates',
      icon: 'IconCalendarStats',
      isNullable: true,
    },
    {
      universalIdentifier: SESSION_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgress',
      defaultValue: `'${SessionStatus.PLANNED}'`,
      options: [
        {
          id: 'f88352f8-47b9-4ff8-9424-4bae55b84d34',
          value: SessionStatus.PLANNED,
          label: 'Planned',
          position: 0,
          color: 'gray',
        },
        {
          id: '110e693f-fcc9-4738-a03f-63b1b0c034f2',
          value: SessionStatus.IN_PROGRESS,
          label: 'In progress',
          position: 1,
          color: 'orange',
        },
        {
          id: '2e7b29fc-18ad-4f27-9200-b626ab886b33',
          value: SessionStatus.COMPLETED,
          label: 'Completed',
          position: 2,
          color: 'green',
        },
      ],
    },
    {
      universalIdentifier: SESSION_STARTED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'startedAt',
      label: 'Started at',
      icon: 'IconPlayerPlay',
      isNullable: true,
    },
    {
      universalIdentifier: SESSION_ENDED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'endedAt',
      label: 'Ended at',
      icon: 'IconPlayerStop',
      isNullable: true,
    },
    {
      universalIdentifier: SESSION_DURATION_MINUTES_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'durationMinutes',
      label: 'Duration (minutes)',
      description: 'Written by the finish-session logic function',
      icon: 'IconStopwatch',
      isNullable: true,
    },
    {
      universalIdentifier: SESSION_COMMENT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'comment',
      label: 'Comment',
      icon: 'IconMessage',
      isNullable: true,
    },
  ],
});
