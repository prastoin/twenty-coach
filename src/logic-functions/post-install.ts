import { CoreApiClient } from 'twenty-client-sdk/core';
import { definePostInstallLogicFunction } from 'twenty-sdk/define';

import { EXERCISE_LIBRARY } from 'src/constants/exercise-library';

// Idempotent: post-install runs again on reinstall/upgrade, so only the
// exercises missing from the workspace (matched by name) are inserted.
const handler = async () => {
  const client = new CoreApiClient();

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

  if (missing.length === 0) {
    console.log(
      `Exercise library already seeded (${existingNames.size} exercises present), nothing to do.`,
    );
    return {};
  }

  await client.mutation({
    createExercises: {
      __args: { data: missing as any },
      id: true,
    },
  } as any);

  console.log(
    `Seeded ${missing.length} exercises (${existingNames.size} were already present).`,
  );

  return {};
};

export default definePostInstallLogicFunction({
  universalIdentifier: '946a90cc-fb6b-4be3-901f-92e335df5f34',
  name: 'post-install',
  description: 'Seeds the exercise library (idempotent, insert-missing only).',
  timeoutSeconds: 120,
  shouldRunSynchronously: true,
  handler,
});
