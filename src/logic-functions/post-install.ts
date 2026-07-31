import { CoreApiClient } from 'twenty-client-sdk/core';
import { definePostInstallLogicFunction } from 'twenty-sdk/define';

import { seedExerciseLibrary } from 'src/utils/seed-exercise-library';

const handler = async () => {
  const client = new CoreApiClient();

  const { inserted, existing } = await seedExerciseLibrary(client);

  if (inserted === 0) {
    console.log(
      `Exercise library already seeded (${existing} exercises present), nothing to do.`,
    );
  } else {
    console.log(
      `Seeded ${inserted} exercises (${existing} were already present).`,
    );
  }

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
