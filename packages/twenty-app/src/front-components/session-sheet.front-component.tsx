import { useCallback, useEffect, useState } from 'react';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineFrontComponent } from 'twenty-sdk/define';
import { useColorScheme, useRecordId } from 'twenty-sdk/front-component';

import {
  formatRest,
  PlanThemeProvider,
  RecordChipLink,
  usePlanPalette,
  type Palette,
} from 'src/front-components/training-plan-shared';

export const SESSION_SHEET_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER =
  '88b220bc-b709-416e-95ab-919fb0ef0479';

type SetRow = {
  id: string;
  position: number;
  setNumber: number | null;
  reps: number | null;
  weightKg: number | null;
  rir: number | null;
  restSeconds: number | null;
  tempo: string | null;
  comment: string | null;
  exerciseId: string | null;
  exerciseName: string | null;
};

type ExerciseGroup = {
  exerciseId: string | null;
  exerciseName: string;
  sets: SetRow[];
};

type SessionData = {
  name: string;
  status: string | null;
  startedAt: string | null;
  comment: string | null;
  sets: SetRow[];
};

const SET_SELECTION = {
  id: true,
  position: true,
  setNumber: true,
  reps: true,
  weightKg: true,
  rir: true,
  restSeconds: true,
  tempo: true,
  comment: true,
  exercise: { id: true, name: true },
};

const toSetRow = (node: any): SetRow => ({
  id: node?.id,
  position: node?.position ?? 0,
  setNumber: node?.setNumber ?? null,
  reps: node?.reps ?? null,
  weightKg: node?.weightKg ?? null,
  rir: node?.rir ?? null,
  restSeconds: node?.restSeconds ?? null,
  tempo: node?.tempo ?? null,
  comment: node?.comment ?? null,
  exerciseId: node?.exercise?.id ?? null,
  exerciseName: node?.exercise?.name ?? null,
});

// A set with no setNumber is a warm-up: log-session only numbers working sets.
const isWarmUp = (set: SetRow): boolean => set.setNumber === null;

// Groups by exercise in the order each one first appears, which is the order
// it was performed — the sheet should read like the session did.
const groupByExercise = (sets: SetRow[]): ExerciseGroup[] => {
  const groups: ExerciseGroup[] = [];
  const byKey = new Map<string, ExerciseGroup>();

  for (const set of sets) {
    const key = set.exerciseId ?? set.exerciseName ?? 'unknown';
    let group = byKey.get(key);
    if (group === undefined) {
      group = {
        exerciseId: set.exerciseId,
        exerciseName: set.exerciseName ?? 'Unknown exercise',
        sets: [],
      };
      byKey.set(key, group);
      groups.push(group);
    }
    group.sets.push(set);
  }

  return groups;
};

const formatLoadAndReps = (set: SetRow): string => {
  const load = set.weightKg !== null ? `${set.weightKg} kg` : null;
  if (set.reps === null) {
    return load ?? '—';
  }
  return load === null ? `${set.reps} reps` : `${load} × ${set.reps}`;
};

const SetLine = ({ set, palette }: { set: SetRow; palette: Palette }) => {
  const details = [
    set.rir !== null ? `RIR ${set.rir}` : null,
    formatRest(set.restSeconds) !== null
      ? `rest ${formatRest(set.restSeconds)}`
      : null,
    set.tempo ? `tempo ${set.tempo}` : null,
  ].filter(Boolean);

  return (
    <div style={{ padding: '4px 0 4px 12px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <RecordChipLink
          objectNameSingular="setLog"
          recordId={set.id}
          name={isWarmUp(set) ? 'Warm-up' : `Set ${set.setNumber}`}
          showAvatar={false}
        />
        <span
          style={{
            fontSize: '13px',
            fontWeight: isWarmUp(set) ? 400 : 600,
            color: isWarmUp(set) ? palette.textSecondary : palette.textPrimary,
            whiteSpace: 'nowrap',
          }}
        >
          {formatLoadAndReps(set)}
        </span>
        {details.length > 0 && (
          <span style={{ fontSize: '11px', color: palette.textMuted }}>
            {details.join(' · ')}
          </span>
        )}
      </div>
      {set.comment && (
        <div
          style={{
            fontSize: '11px',
            color: palette.textMuted,
            fontStyle: 'italic',
            marginTop: '1px',
            paddingLeft: '8px',
          }}
        >
          {set.comment}
        </div>
      )}
    </div>
  );
};

const SessionSheet = () => {
  const colorScheme = useColorScheme();
  const isDark = String(colorScheme ?? '')
    .toLowerCase()
    .includes('dark');
  return (
    <PlanThemeProvider isDark={isDark}>
      <SessionSheetContent />
    </PlanThemeProvider>
  );
};

const SessionSheetContent = () => {
  const recordId = useRecordId();
  const palette = usePlanPalette();

  const [data, setData] = useState<SessionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    if (!recordId) {
      setLoading(false);
      setError('No record id');
      return;
    }
    try {
      const client = new CoreApiClient();
      const result = (await client.query({
        session: {
          __args: { filter: { id: { eq: recordId } } },
          name: true,
          status: true,
          startedAt: true,
          comment: true,
        },
        setLogs: {
          edges: { node: SET_SELECTION },
          __args: { filter: { sessionId: { eq: recordId } }, first: 500 },
        },
      } as any)) as any;

      const sets = (result?.setLogs?.edges ?? []).map((edge: any) =>
        toSetRow(edge.node),
      );

      setData({
        name: result?.session?.name ?? '',
        status: result?.session?.status ?? null,
        startedAt: result?.session?.startedAt ?? null,
        comment: result?.session?.comment ?? null,
        sets: sets.sort(
          (left: SetRow, right: SetRow) => left.position - right.position,
        ),
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [recordId]);

  useEffect(() => {
    void fetchSession();
  }, [fetchSession]);

  if (loading) {
    return (
      <div style={{ fontSize: '12px', color: palette.textMuted }}>Loading…</div>
    );
  }

  if (error !== null) {
    return <div style={{ fontSize: '12px', color: palette.textMuted }}>{error}</div>;
  }

  const groups = groupByExercise(data?.sets ?? []);
  const workingSetCount = (data?.sets ?? []).filter(
    (set) => !isWarmUp(set),
  ).length;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontFamily: 'inherit',
      }}
    >
      <div style={{ fontSize: '12px', color: palette.textSecondary }}>
        {groups.length} exercise{groups.length === 1 ? '' : 's'} ·{' '}
        {workingSetCount} working set{workingSetCount === 1 ? '' : 's'}
      </div>

      {groups.map((group) => (
        <div
          key={group.exerciseId ?? group.exerciseName}
          style={{
            background: palette.cardBg,
            border: `1px solid ${palette.border}`,
            borderRadius: '6px',
            padding: '8px 10px',
          }}
        >
          <div style={{ marginBottom: '2px' }}>
            {group.exerciseId ? (
              <RecordChipLink
                objectNameSingular="exercise"
                recordId={group.exerciseId}
                name={group.exerciseName}
              />
            ) : (
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: palette.textPrimary,
                }}
              >
                {group.exerciseName}
              </span>
            )}
          </div>
          {group.sets.map((set) => (
            <SetLine key={set.id} set={set} palette={palette} />
          ))}
        </div>
      ))}

      {groups.length === 0 && (
        <div style={{ fontSize: '12px', color: palette.textMuted }}>
          No sets logged yet.
        </div>
      )}
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: SESSION_SHEET_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'session-sheet',
  description: 'Shows a session’s logged sets grouped by exercise',
  component: SessionSheet,
});
