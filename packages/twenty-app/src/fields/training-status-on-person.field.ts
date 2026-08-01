import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export enum TrainingStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED',
}

export const TRAINING_STATUS_ON_PERSON_ID =
  '45604ffb-af3f-4d1c-a2f0-182cb25c1546';

// Empty means "not a trainee": the Trainees view filters on this field.
export default defineField({
  universalIdentifier: TRAINING_STATUS_ON_PERSON_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.SELECT,
  name: 'trainingStatus',
  label: 'Training status',
  description: 'Coaching status — empty for people who are not trainees',
  icon: 'IconBarbell',
  isNullable: true,
  options: [
    {
      id: '89e8e863-305b-4a66-be27-8bc0a666e72e',
      value: TrainingStatus.ACTIVE,
      label: 'Active',
      position: 0,
      color: 'green',
    },
    {
      id: 'cfccdf1e-fbd4-468a-8140-cbc3572807e4',
      value: TrainingStatus.PAUSED,
      label: 'Paused',
      position: 1,
      color: 'yellow',
    },
    {
      id: 'c94f248e-e592-4e1a-9bba-63449bba410f',
      value: TrainingStatus.ARCHIVED,
      label: 'Archived',
      position: 2,
      color: 'gray',
    },
  ],
});
