import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction } from 'twenty-sdk/define';

import {
  BLOCK3_PROGRAM_NAME,
  BLOCK3_PROGRAM_NOTES,
  BLOCK3_SESSIONS,
} from 'src/constants/block3-program';
import { seedExerciseLibrary } from 'src/utils/seed-exercise-library';

const DAY_LABEL: Record<string, string> = {
  DAY_A: 'Mon',
  DAY_B: 'Wed',
  DAY_C: 'Fri',
  DAY_D: 'Sat',
};

// Manually triggered (yarn twenty dev:function:exec -n seed-demo-data):
// seeds the exercise library, then the PWRBLDNG Block 3 demo program.
// Idempotent: no-op when the program already exists.
const handler = async () => {
  const client = new CoreApiClient();

  await seedExerciseLibrary(client);

  const { programs } = (await client.query({
    programs: {
      edges: { node: { id: true } },
      __args: { filter: { name: { eq: BLOCK3_PROGRAM_NAME } } },
    },
  } as any)) as any;

  if ((programs?.edges ?? []).length > 0) {
    console.log(`"${BLOCK3_PROGRAM_NAME}" already seeded, nothing to do.`);
    return {};
  }

  const { exercises } = (await client.query({
    exercises: {
      edges: { node: { id: true, name: true } },
      __args: { first: 500 },
    },
  } as any)) as any;
  const exerciseIdByName = new Map<string, string>(
    (exercises?.edges ?? []).map((edge: { node: { id: string; name: string } }) => [
      edge.node.name,
      edge.node.id,
    ]),
  );

  const { createProgram } = (await client.mutation({
    createProgram: {
      __args: {
        data: {
          name: BLOCK3_PROGRAM_NAME,
          status: 'ACTIVE',
          notes: BLOCK3_PROGRAM_NOTES,
        },
      },
      id: true,
    },
  } as any)) as any;
  const programId = createProgram.id;

  const rows = BLOCK3_SESSIONS.flatMap((session) =>
    session.prescriptions.map((prescription, index) => {
      const exerciseId = exerciseIdByName.get(prescription.exercise);
      if (!exerciseId) {
        throw new Error(`Unknown exercise "${prescription.exercise}"`);
      }
      const suffix =
        prescription.scheme === 'TOP_SET'
          ? ' (top set)'
          : prescription.scheme === 'BACKOFF'
            ? ' (backoff)'
            : '';
      return {
        name: `${prescription.exercise}${suffix} — W${session.week} ${DAY_LABEL[session.day]}`,
        day: session.day,
        week: session.week,
        order: index + 1,
        programId,
        exerciseId,
        ...(prescription.scheme ? { setScheme: prescription.scheme } : {}),
        ...(prescription.sets !== undefined ? { targetSets: prescription.sets } : {}),
        ...(prescription.repsMin !== undefined ? { targetRepsMin: prescription.repsMin } : {}),
        ...(prescription.repsMax !== undefined ? { targetRepsMax: prescription.repsMax } : {}),
        ...(prescription.weightKg !== undefined ? { targetWeightKg: prescription.weightKg } : {}),
        ...(prescription.percent1Rm !== undefined ? { targetPercent1Rm: prescription.percent1Rm } : {}),
        ...(prescription.rir !== undefined ? { targetRir: prescription.rir } : {}),
        ...(prescription.restSeconds !== undefined ? { restSeconds: prescription.restSeconds } : {}),
        ...(prescription.tempo ? { tempo: prescription.tempo } : {}),
        ...(prescription.notes ? { notes: prescription.notes } : {}),
      };
    }),
  );

  const BATCH_SIZE = 40;
  for (let start = 0; start < rows.length; start += BATCH_SIZE) {
    await client.mutation({
      createProgramExercises: {
        __args: { data: rows.slice(start, start + BATCH_SIZE) as any },
        id: true,
      },
    } as any);
  }

  console.log(
    `Seeded "${BLOCK3_PROGRAM_NAME}": ${rows.length} prescriptions across 4 weeks.`,
  );

  return {};
};

export default defineLogicFunction({
  universalIdentifier: '278b88a5-0cdd-4b03-9736-31e19cd48f60',
  name: 'seed-demo-data',
  description:
    'Seeds the PWRBLDNG Block 3 demo program (manually triggered, idempotent).',
  timeoutSeconds: 120,
  handler,
});
