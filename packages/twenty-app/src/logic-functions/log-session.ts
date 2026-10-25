import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction } from 'twenty-sdk/define';

import { parseSessionLog } from 'src/utils/parse-session-log';

/**
 * Writes a program-less session from a raw training log.
 *
 * The split of work is the point: this function parses the numbers itself
 * (deterministically, see parse-session-log) and the caller only supplies the
 * exercise-name → id mapping. An agent therefore cannot invent a weight, and
 * an unresolved exercise name aborts the whole write instead of silently
 * dropping sets or creating a near-duplicate library entry.
 */

type ExerciseResolution = {
  name: string;
  exerciseId: string;
};

type LogSessionInput = {
  rawLog: string;
  sessionName?: string;
  performedAt?: string;
  comment?: string;
  traineeMemberId?: string;
  exercises: ExerciseResolution[];
};

const normalize = (name: string): string => name.trim().toLowerCase();

const handler = async (input: LogSessionInput) => {
  const { exercises: parsedExercises, warnings } = parseSessionLog(
    input.rawLog ?? '',
  );

  if (parsedExercises.length === 0) {
    return { created: false, reason: 'No exercises found in the log', warnings };
  }

  const idByName = new Map(
    (input.exercises ?? []).map((entry) => [normalize(entry.name), entry.exerciseId]),
  );
  const unresolved = parsedExercises
    .map((exercise) => exercise.name)
    .filter((name) => !idByName.has(normalize(name)));

  if (unresolved.length > 0) {
    return {
      created: false,
      reason: 'Unresolved exercise names',
      unresolved,
      warnings,
    };
  }

  const client = new CoreApiClient();
  const performedAt = input.performedAt ?? new Date().toISOString();

  const { createSession } = (await client.mutation({
    createSession: {
      __args: {
        data: {
          name: input.sessionName ?? `Session — ${performedAt.slice(0, 10)}`,
          status: 'COMPLETED',
          startedAt: performedAt,
          comment: input.comment ?? null,
          traineeMemberId: input.traineeMemberId ?? null,
        },
      },
      id: true,
    },
  } as any)) as any;

  const sessionId = createSession.id;

  const rows = parsedExercises.flatMap((exercise) => {
    const exerciseId = idByName.get(normalize(exercise.name));
    let workingSetNumber = 0;

    return exercise.sets.map((set, index) => {
      if (!set.isWarmUp) {
        workingSetNumber += 1;
      }
      const label = set.isWarmUp
        ? `${exercise.name} — warm-up`
        : `${exercise.name} — set ${workingSetNumber}`;

      return {
        name: label,
        position: index + 1,
        sessionId,
        exerciseId,
        setNumber: set.isWarmUp ? null : workingSetNumber,
        reps: set.reps,
        weightKg: set.weightKg,
        rir: set.rir,
        restSeconds: set.restSeconds,
        tempo: set.tempo,
        comment: set.notes,
        traineeMemberId: input.traineeMemberId ?? null,
      };
    });
  });

  await client.mutation({
    createSetLogs: {
      __args: { data: rows as any },
      id: true,
    },
  } as any);

  return {
    created: true,
    sessionId,
    exerciseCount: parsedExercises.length,
    setLogCount: rows.length,
    warnings,
  };
};

export default defineLogicFunction({
  universalIdentifier: '2d2c8cd4-1ef0-4991-b205-bc6ed066780e',
  name: 'log-session',
  description:
    'Parses a raw training log and writes it as a program-less session with its set logs',
  timeoutSeconds: 60,
  toolTriggerSettings: {
    inputSchema: {
      type: 'object',
      properties: {
        rawLog: {
          type: 'string',
          description:
            'The training log exactly as written, newlines preserved. Never reformat or recompute it.',
        },
        sessionName: {
          type: 'string',
          description: 'Defaults to "Session — <date>".',
        },
        performedAt: {
          type: 'string',
          description: 'ISO 8601 datetime the session was performed.',
        },
        comment: { type: 'string', description: 'Session-level note.' },
        traineeMemberId: {
          type: 'string',
          description: 'Workspace member the session belongs to.',
        },
        exercises: {
          type: 'array',
          description:
            'One entry per exercise name appearing in the log, mapped to an existing Exercise record.',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'The name exactly as written in the log.',
              },
              exerciseId: {
                type: 'string',
                description: 'Id of the matching Exercise record.',
              },
            },
            required: ['name', 'exerciseId'],
          },
        },
      },
      required: ['rawLog', 'exercises'],
    },
  },
  handler,
});
