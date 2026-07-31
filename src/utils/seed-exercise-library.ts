import { type CoreApiClient } from 'twenty-client-sdk/core';

import { EXERCISE_LIBRARY } from 'src/constants/exercise-library';

// Idempotent: only the exercises missing from the workspace (matched by
// name) are inserted, so reinstalls and repeated seed runs never duplicate
// the library or overwrite user edits.
export const seedExerciseLibrary = async (client: CoreApiClient) => {
  const { exercises } = (await client.query({
    exercises: {
      edges: { node: { name: true } },
      __args: { first: 500 },
    },
  } as any)) as any;

  const existingNames = new Set<string>(
    (exercises?.edges ?? []).map(
      (edge: { node: { name: string } }) => edge.node.name,
    ),
  );

  const missing = EXERCISE_LIBRARY.filter(
    (exercise) => !existingNames.has(exercise.name),
  );

  if (missing.length > 0) {
    await client.mutation({
      createExercises: {
        __args: { data: missing as any },
        id: true,
      },
    } as any);
  }

  return { inserted: missing.length, existing: existingNames.size };
};
