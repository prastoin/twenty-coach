import { SetScheme, TrainingDay } from 'src/constants/training';

// PWRBLDNG Block 3 — 4 weeks × 4 days (lundi, mercredi, vendredi, samedi),
// transpiled from the coach's spreadsheet. Weeks 1/3 share template A,
// weeks 2/4 template B; the Friday deadlift varies every week.
// RPE is converted to RIR (RIR = 10 − RPE); ranges and ambiguities are
// preserved in notes.

export const BLOCK3_PROGRAM_NAME = 'PWRBLDNG Block 3';

export const BLOCK3_PROGRAM_NOTES =
  '4 semaines, 4 séances/sem (lundi, mercredi, vendredi, samedi). ' +
  "Instructions coach : if there's no tempo written don't do it. " +
  'Cluster : 2 reps puis 15s de repos intra-série. ' +
  '* = tempo. ** = tempo + un dropset avec 40% moins de charge, 10 reps full speed.';

const DROPSET_NOTE = '** : tempo + dropset à −40% de charge, 10 reps full speed';

export type Block3Prescription = {
  exercise: string;
  scheme?: SetScheme;
  sets?: number;
  repsMin?: number;
  repsMax?: number;
  weightKg?: number;
  percent1Rm?: number;
  rir?: number;
  restSeconds?: number;
  tempo?: string;
  notes?: string;
};

const LUNDI_A: Block3Prescription[] = [
  { exercise: 'Back Squat', scheme: SetScheme.TOP_SET, sets: 1, repsMin: 5, rir: 1, restSeconds: 180, notes: 'Top set RPE 9' },
  { exercise: 'Paused Squat', scheme: SetScheme.BACKOFF, sets: 5, repsMin: 3, rir: 2.5, restSeconds: 120, notes: 'Pause 3s ; RPE 7,5' },
  { exercise: 'Machine Row', sets: 3, repsMin: 8, rir: 2, restSeconds: 120, tempo: '0-3-3-0', notes: 'Hammer machine rows' },
  { exercise: 'Leg Extension', scheme: SetScheme.DROPSET, sets: 4, repsMin: 6, rir: 1, restSeconds: 89, tempo: '0-3-3-0', notes: DROPSET_NOTE },
  { exercise: 'Lateral Raise', scheme: SetScheme.DROPSET, sets: 3, repsMin: 5, rir: 1, restSeconds: 120, notes: '5 + 10 reps en dropset' },
  { exercise: 'Barbell Shrug', sets: 3, repsMin: 6, rir: 3, restSeconds: 60, notes: 'Zercher shrugs (ou barbell shrugs)' },
  { exercise: 'Hip Abduction', scheme: SetScheme.AMRAP, sets: 3, rir: 0, restSeconds: 90, notes: 'Abductors, AMRAP' },
];

const LUNDI_B: Block3Prescription[] = [
  { exercise: 'Back Squat', scheme: SetScheme.CLUSTER, sets: 10, repsMin: 2, percent1Rm: 75, restSeconds: 60, notes: '10×2 @75% 1RM — cluster (2 reps puis 15s selon instructions)' },
  { exercise: 'Dumbbell Row', sets: 3, repsMin: 6, rir: 1, restSeconds: 120, tempo: '0-3-3-0', notes: 'Bucheron' },
  { exercise: 'Overhead Press', sets: 3, repsMin: 8, rir: 2, restSeconds: 180, notes: 'Strict military press' },
  { exercise: 'Leg Extension', scheme: SetScheme.DROPSET, sets: 4, repsMin: 6, rir: 1, restSeconds: 89, tempo: '0-3-3-0', notes: DROPSET_NOTE },
  { exercise: 'Hammer Curl', sets: 4, repsMin: 8, rir: 0, restSeconds: 60, notes: 'Superset avec skullcrushers ; RPE 10' },
  { exercise: 'Skull Crusher', sets: 4, repsMin: 8, rir: 1, restSeconds: 60, notes: 'Superset avec hammer curls ; RPE 9' },
];

const MERCREDI_A: Block3Prescription[] = [
  { exercise: 'Bench Press', scheme: SetScheme.TOP_SET, sets: 1, repsMin: 5, rir: 1, restSeconds: 210, notes: 'Top set RPE 9 ; repos 3-4min' },
  { exercise: 'Bench Press', scheme: SetScheme.BACKOFF, sets: 5, repsMin: 3, restSeconds: 120, notes: '1/2 + 1 bench press ; −25% du top set' },
  { exercise: 'Romanian Deadlift', sets: 3, repsMin: 6, rir: 3, restSeconds: 120, tempo: 'descente 3s', notes: 'RPE 6-7' },
  { exercise: 'Seated Dumbbell Shoulder Press', sets: 3, repsMin: 5, rir: 2, restSeconds: 120 },
  { exercise: 'Cable Curl', scheme: SetScheme.DROPSET, sets: 5, repsMin: 8, rir: 1, restSeconds: 60, tempo: '0-3-4-0', notes: DROPSET_NOTE },
  { exercise: 'Lying Leg Curl', sets: 3, repsMin: 12, rir: 1, restSeconds: 90 },
];

const MERCREDI_B: Block3Prescription[] = [
  { exercise: 'Bench Press', scheme: SetScheme.TOP_SET, sets: 1, repsMin: 3, rir: 1, restSeconds: 210, notes: 'Top set RPE 9 ; repos 3-4min' },
  { exercise: 'Good Morning', repsMin: 6, rir: 2, restSeconds: 120, notes: 'Sets non précisés par le coach' },
  { exercise: 'Hip Abduction', scheme: SetScheme.AMRAP, sets: 3, rir: 0, restSeconds: 90, notes: 'Abductors, AMRAP' },
  { exercise: 'Lying Leg Curl', sets: 3, repsMin: 8, rir: 1, restSeconds: 90 },
  { exercise: 'Neck Flexion', sets: 3, repsMin: 6, rir: 3, restSeconds: 60, notes: 'Superset avec shrugs' },
  { exercise: 'Barbell Shrug', sets: 3, repsMin: 6, rir: 3, restSeconds: 60, notes: 'Superset avec neck flexions' },
];

const VENDREDI_ACCESSORIES_A: Block3Prescription[] = [
  { exercise: 'Bulgarian Split Squat', sets: 3, repsMin: 5, weightKg: 35, rir: 1, restSeconds: 120, notes: 'DB 35kg' },
  { exercise: 'Dip', sets: 5, repsMin: 3, rir: 2, restSeconds: 120, notes: 'Lestés' },
  { exercise: 'Face Pull', sets: 3, repsMin: 8, rir: 2, restSeconds: 120 },
];

const VENDREDI_ACCESSORIES_B: Block3Prescription[] = [
  { exercise: 'Dip', sets: 3, repsMin: 6, rir: 3, restSeconds: 120, notes: 'Lestés' },
  { exercise: 'Barbell Curl', sets: 3, repsMin: 6, rir: 0, restSeconds: 120, notes: '5s peak pause' },
  { exercise: 'Back Extension', sets: 4, repsMin: 15, rir: 1, restSeconds: 90, notes: 'Glute focused' },
];

const DEADLIFT_BY_WEEK: Record<number, Block3Prescription[]> = {
  1: [{ exercise: 'Deadlift', sets: 5, repsMin: 3, percent1Rm: 85, restSeconds: 120, notes: '85-87% 1RM' }],
  2: [
    { exercise: 'Deadlift', scheme: SetScheme.TOP_SET, sets: 1, repsMin: 1, rir: 1, restSeconds: 120, notes: 'Top single RPE 9' },
    { exercise: 'Deadlift', scheme: SetScheme.BACKOFF, sets: 8, repsMin: 2, percent1Rm: 70, restSeconds: 60, notes: '8×2 @70%' },
  ],
  3: [{ exercise: 'Deadlift', sets: 5, repsMin: 3, percent1Rm: 70, restSeconds: 120, notes: '70% 1RM' }],
  4: [
    { exercise: 'Deadlift', scheme: SetScheme.TOP_SET, sets: 1, repsMin: 4, rir: 2, restSeconds: 120, notes: 'Top set 4 reps RPE 8' },
    { exercise: 'Deadlift', scheme: SetScheme.BACKOFF, sets: 8, repsMin: 2, percent1Rm: 70, restSeconds: 60, notes: '8×2 @70%' },
  ],
};

const SAMEDI_A: Block3Prescription[] = [
  { exercise: 'Incline Dumbbell Press', sets: 4, repsMin: 6, rir: 2, restSeconds: 150 },
  { exercise: 'Lat Pulldown', sets: 3, repsMin: 6, rir: 2, restSeconds: 120, notes: 'Prise supination' },
  { exercise: 'Triceps Pushdown', scheme: SetScheme.DROPSET, sets: 3, repsMin: 8, rir: 0, restSeconds: 120, tempo: '0-3-4-2', notes: 'Cable tricep extension ; ' + DROPSET_NOTE },
  { exercise: 'Back Extension', sets: 4, repsMin: 15, rir: 2, restSeconds: 89, notes: 'Glute focused' },
  { exercise: 'Hip Abduction', scheme: SetScheme.EMOM, sets: 4, repsMin: 15, rir: 0, notes: 'Abductors, EMOM' },
];

const SAMEDI_B: Block3Prescription[] = [
  { exercise: 'Incline Dumbbell Press', sets: 3, repsMin: 3, rir: 2, restSeconds: 150 },
  { exercise: 'Pull-Up', sets: 3, repsMin: 6, rir: 2, restSeconds: 120 },
  { exercise: 'Bulgarian Split Squat', sets: 3, repsMin: 5, rir: 1, restSeconds: 120 },
  { exercise: 'Hip Abduction', scheme: SetScheme.EMOM, sets: 4, repsMin: 15, rir: 0, notes: 'Abductors, EMOM' },
];

export type Block3Session = {
  day: TrainingDay;
  week: number;
  prescriptions: Block3Prescription[];
};

const TEMPLATE_A_WEEKS = [1, 3];
const TEMPLATE_B_WEEKS = [2, 4];

export const BLOCK3_SESSIONS: Block3Session[] = [
  ...TEMPLATE_A_WEEKS.flatMap((week): Block3Session[] => [
    { day: TrainingDay.DAY_A, week, prescriptions: LUNDI_A },
    { day: TrainingDay.DAY_B, week, prescriptions: MERCREDI_A },
    { day: TrainingDay.DAY_C, week, prescriptions: [...DEADLIFT_BY_WEEK[week], ...VENDREDI_ACCESSORIES_A] },
    { day: TrainingDay.DAY_D, week, prescriptions: SAMEDI_A },
  ]),
  ...TEMPLATE_B_WEEKS.flatMap((week): Block3Session[] => [
    { day: TrainingDay.DAY_A, week, prescriptions: LUNDI_B },
    { day: TrainingDay.DAY_B, week, prescriptions: MERCREDI_B },
    { day: TrainingDay.DAY_C, week, prescriptions: [...DEADLIFT_BY_WEEK[week], ...VENDREDI_ACCESSORIES_B] },
    { day: TrainingDay.DAY_D, week, prescriptions: SAMEDI_B },
  ]),
];
