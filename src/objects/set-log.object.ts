import { defineObject, FieldType } from 'twenty-sdk/define';

export enum SetEquipment {
  CHALK = 'CHALK',
  BANDS = 'BANDS',
  BELT = 'BELT',
  STRAPS = 'STRAPS',
  WRAPS = 'WRAPS',
}

export const SET_LOG_UNIVERSAL_IDENTIFIER =
  '5212abc7-7720-4364-a8d3-99f406b61123';

export const SET_LOG_NAME_FIELD_UNIVERSAL_IDENTIFIER =
  '121017ba-0e0b-4db7-8429-3a7e514132ac';
export const SET_LOG_SET_NUMBER_FIELD_UNIVERSAL_IDENTIFIER =
  '04dcdef3-1abb-4ec8-b74f-54ca8f3efd16';
export const SET_LOG_REPS_FIELD_UNIVERSAL_IDENTIFIER =
  'd43f7073-2e91-4374-96cd-38382bc2c3d8';
export const SET_LOG_WEIGHT_KG_FIELD_UNIVERSAL_IDENTIFIER =
  '108941f9-a86a-4721-907e-23234d5715a0';
export const SET_LOG_RIR_FIELD_UNIVERSAL_IDENTIFIER =
  'a703ffd8-d1b6-4ed6-9327-72e9d934f60d';
export const SET_LOG_REST_SECONDS_FIELD_UNIVERSAL_IDENTIFIER =
  '47214760-e138-41a7-8095-c898015863c1';
export const SET_LOG_TEMPO_FIELD_UNIVERSAL_IDENTIFIER =
  '5d41cf9c-fe33-4192-8836-1e15e95cad53';
export const SET_LOG_EQUIPMENT_FIELD_UNIVERSAL_IDENTIFIER =
  'ad8c8320-7f7b-4706-a21e-37e75db1cca6';
export const SET_LOG_COMMENT_FIELD_UNIVERSAL_IDENTIFIER =
  'a51bc2a9-a074-4b98-ac66-93209f890875';

export default defineObject({
  universalIdentifier: SET_LOG_UNIVERSAL_IDENTIFIER,
  nameSingular: 'setLog',
  namePlural: 'setLogs',
  labelSingular: 'Set Log',
  labelPlural: 'Set Logs',
  description: 'One performed set — the atomic unit of training history',
  icon: 'IconChecklist',
  labelIdentifierFieldMetadataUniversalIdentifier:
    SET_LOG_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: SET_LOG_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      description: 'e.g. "Squat — set 3"',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: SET_LOG_SET_NUMBER_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'setNumber',
      label: 'Set number',
      icon: 'IconHash',
      isNullable: true,
    },
    {
      universalIdentifier: SET_LOG_REPS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'reps',
      label: 'Reps',
      icon: 'IconRepeat',
      isNullable: true,
    },
    {
      universalIdentifier: SET_LOG_WEIGHT_KG_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'weightKg',
      label: 'Weight (kg)',
      icon: 'IconWeight',
      isNullable: true,
    },
    {
      universalIdentifier: SET_LOG_RIR_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'rir',
      label: 'RIR',
      description: 'Reps in reserve (0-5)',
      icon: 'IconBattery2',
      isNullable: true,
    },
    {
      universalIdentifier: SET_LOG_REST_SECONDS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'restSeconds',
      label: 'Rest (seconds)',
      icon: 'IconHourglass',
      isNullable: true,
    },
    {
      universalIdentifier: SET_LOG_TEMPO_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'tempo',
      label: 'Tempo',
      description: 'Free notation, e.g. "0-3-3-0" or "slow+"',
      icon: 'IconWaveSine',
      isNullable: true,
    },
    {
      universalIdentifier: SET_LOG_EQUIPMENT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.MULTI_SELECT,
      name: 'equipment',
      label: 'Equipment',
      description: 'Support equipment used for the set',
      icon: 'IconTool',
      isNullable: true,
      options: [
        {
          id: '6c849172-2da2-4376-aa12-5f71cf8e057f',
          value: SetEquipment.CHALK,
          label: 'Chalk',
          position: 0,
          color: 'gray',
        },
        {
          id: 'edbc3543-12bf-4255-94fd-8d1dd1cf0740',
          value: SetEquipment.BANDS,
          label: 'Bands',
          position: 1,
          color: 'red',
        },
        {
          id: '50ecc1b6-02be-40d3-9d2c-b45410d564db',
          value: SetEquipment.BELT,
          label: 'Belt',
          position: 2,
          color: 'brown',
        },
        {
          id: 'fca3daac-62ce-4c3e-a6e4-00790399bb84',
          value: SetEquipment.STRAPS,
          label: 'Straps',
          position: 3,
          color: 'blue',
        },
        {
          id: '3f7ae063-4d48-4dc5-ac57-f8fec324faeb',
          value: SetEquipment.WRAPS,
          label: 'Wraps',
          position: 4,
          color: 'purple',
        },
      ],
    },
    {
      universalIdentifier: SET_LOG_COMMENT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'comment',
      label: 'Comment',
      icon: 'IconMessage',
      isNullable: true,
    },
  ],
});
