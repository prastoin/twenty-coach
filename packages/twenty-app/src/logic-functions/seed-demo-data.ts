import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction } from 'twenty-sdk/define';

import {
  BLOCK3_PROGRAM_NAME,
  BLOCK3_PROGRAM_NOTES,
  BLOCK3_WORKOUTS,
} from 'src/constants/block3-program';
import { seedExerciseLibrary } from 'src/utils/seed-exercise-library';

const DEMO_TRAINEE_FIRST_NAME = 'Demo';
const DEMO_TRAINEE_LAST_NAME = 'Trainee';

type DemoTrainee = {
  traineeId: string;
  traineeMemberId: string | null;
};

// Finds or creates the demo trainee person, linked to a workspace member so
// row-level permissions can be exercised right after seeding. Prefers a
// member with "trainee" in their email, then the second member (the first
// one is typically the coach/admin, whose role bypasses the predicates),
// then whoever is left.
const ensureDemoTrainee = async (client: CoreApiClient): Promise<DemoTrainee> => {
  const { workspaceMembers } = (await client.query({
    workspaceMembers: {
      edges: { node: { id: true, userEmail: true } },
      __args: { first: 10 },
    },
  } as any)) as any;
  const members = (workspaceMembers?.edges ?? []).map(
    (edge: { node: { id: string; userEmail: string | null } }) => edge.node,
  );
  const memberId: string | null =
    members.find((member: { userEmail: string | null }) =>
      member.userEmail?.toLowerCase().includes('trainee'),
    )?.id ??
    members[1]?.id ??
    members[0]?.id ??
    null;

  const { people } = (await client.query({
    people: {
      edges: {
        node: {
          id: true,
          workspaceMemberId: true,
          name: { firstName: true, lastName: true },
        },
      },
      __args: { first: 200 },
    },
  } as any)) as any;
  const demo = (people?.edges ?? []).find(
    (edge: any) =>
      edge.node.name?.firstName === DEMO_TRAINEE_FIRST_NAME &&
      edge.node.name?.lastName === DEMO_TRAINEE_LAST_NAME,
  )?.node;

  if (!demo) {
    const { createPerson } = (await client.mutation({
      createPerson: {
        __args: {
          data: {
            name: {
              firstName: DEMO_TRAINEE_FIRST_NAME,
              lastName: DEMO_TRAINEE_LAST_NAME,
            },
            trainingStatus: 'ACTIVE',
            ...(memberId ? { workspaceMemberId: memberId } : {}),
          },
        },
        id: true,
      },
    } as any)) as any;
    return { traineeId: createPerson.id, traineeMemberId: memberId };
  }

  // The demo person is seed-owned: converge its member link to the
  // preferred member so re-runs pick up membership changes.
  if (memberId && demo.workspaceMemberId !== memberId) {
    await client.mutation({
      updatePerson: {
        __args: { id: demo.id, data: { workspaceMemberId: memberId } },
        id: true,
      },
    } as any);
  }

  return { traineeId: demo.id, traineeMemberId: memberId };
};

// Stamps the trainee links onto a program seeded before the trainee model
// existed, so predicates keep working without a destroy-and-reseed.
const backfillTrainee = async (
  client: CoreApiClient,
  programId: string,
  trainee: DemoTrainee,
) => {
  await client.mutation({
    updateProgram: {
      __args: {
        id: programId,
        data: {
          traineeId: trainee.traineeId,
          traineeMemberId: trainee.traineeMemberId,
        },
      },
      id: true,
    },
  } as any);

  await client.mutation({
    updateWorkouts: {
      __args: {
        filter: { programId: { eq: programId } },
        data: { traineeMemberId: trainee.traineeMemberId },
      },
      id: true,
    },
  } as any);

  const { workouts } = (await client.query({
    workouts: {
      edges: { node: { id: true } },
      __args: { filter: { programId: { eq: programId } }, first: 100 },
    },
  } as any)) as any;
  const workoutIds = (workouts?.edges ?? []).map(
    (edge: { node: { id: string } }) => edge.node.id,
  );
  if (workoutIds.length > 0) {
    await client.mutation({
      updateProgramExercises: {
        __args: {
          filter: { workoutId: { in: workoutIds } },
          data: { traineeMemberId: trainee.traineeMemberId },
        },
        id: true,
      },
    } as any);
  }
};

// Manually triggered (yarn twenty dev:function:exec -n seed-demo-data):
// seeds the exercise library, the demo trainee person, then the PWRBLDNG
// Block 3 demo program as 16 workouts (4 weeks x 4 days) holding their
// prescriptions, all stamped with the trainee links the row-level
// permissions rely on. Idempotent: no-op when the program already exists,
// backfilling the trainee links if they are missing.
const handler = async () => {
  const client = new CoreApiClient();

  await seedExerciseLibrary(client);

  const trainee = await ensureDemoTrainee(client);

  const { programs } = (await client.query({
    programs: {
      edges: { node: { id: true, traineeId: true, traineeMemberId: true } },
      __args: { filter: { name: { eq: BLOCK3_PROGRAM_NAME } } },
    },
  } as any)) as any;

  const existingProgram = programs?.edges?.[0]?.node;
  if (existingProgram) {
    if (
      !existingProgram.traineeId ||
      existingProgram.traineeMemberId !== trainee.traineeMemberId
    ) {
      await backfillTrainee(client, existingProgram.id, trainee);
      console.log(
        `"${BLOCK3_PROGRAM_NAME}" already seeded: backfilled trainee links.`,
      );
    } else {
      console.log(`"${BLOCK3_PROGRAM_NAME}" already seeded, nothing to do.`);
    }
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
          traineeId: trainee.traineeId,
          traineeMemberId: trainee.traineeMemberId,
        },
      },
      id: true,
    },
  } as any)) as any;
  const programId = createProgram.id;

  // The system position field drives every native ordering surface
  // (relation chips, tables, boards); it is written from the semantic
  // order so display never depends on creation sequence.
  const sortedWorkouts = [...BLOCK3_WORKOUTS].sort(
    (left, right) => left.week - right.week || left.order - right.order,
  );

  const { createWorkouts } = (await client.mutation({
    createWorkouts: {
      __args: {
        data: sortedWorkouts.map((workout, index) => ({
          name: workout.name,
          day: workout.day,
          week: workout.week,
          order: workout.order,
          position: index + 1,
          programId,
          traineeMemberId: trainee.traineeMemberId,
        })) as any,
      },
      id: true,
      name: true,
    },
  } as any)) as any;
  const workoutIdByName = new Map<string, string>(
    createWorkouts.map((workout: { id: string; name: string }) => [
      workout.name,
      workout.id,
    ]),
  );

  let runningPosition = 0;
  const rows = sortedWorkouts.flatMap((workout) =>
    workout.prescriptions.map((prescription, index) => {
      const exerciseId = exerciseIdByName.get(prescription.exercise);
      if (!exerciseId) {
        throw new Error(`Unknown exercise "${prescription.exercise}"`);
      }
      const workoutId = workoutIdByName.get(workout.name);
      if (!workoutId) {
        throw new Error(`Unknown workout "${workout.name}"`);
      }
      const suffix =
        prescription.scheme === 'TOP_SET'
          ? ' (top set)'
          : prescription.scheme === 'BACKOFF'
            ? ' (backoff)'
            : '';
      runningPosition += 1;
      return {
        name: `${prescription.exercise}${suffix}`,
        order: index + 1,
        position: runningPosition,
        workoutId,
        exerciseId,
        traineeMemberId: trainee.traineeMemberId,
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
    `Seeded "${BLOCK3_PROGRAM_NAME}": ${createWorkouts.length} workouts, ${rows.length} prescriptions across 4 weeks, assigned to the demo trainee.`,
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
