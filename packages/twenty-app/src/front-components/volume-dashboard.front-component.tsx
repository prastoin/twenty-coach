import { useCallback, useEffect, useMemo, useState } from 'react';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineFrontComponent } from 'twenty-sdk/define';
import {
  useColorScheme,
  useRecordId,
  useSelectedObjectMetadata,
} from 'twenty-sdk/front-component';
import {
  adherence,
  oneRepMaxSeries,
  sessionsPerBucket,
  totalVolume,
  volumeBuckets,
  volumeByExercise,
  volumeTrendPercent,
  type Granularity,
  type PerformedSet,
} from '@coach-twenty/shared';

import {
  PlanThemeProvider,
  RecordChipLink,
  usePlanPalette,
} from 'src/front-components/training-plan-shared';
import {
  BarSeries,
  Card,
  ChartFrame,
  MeterRow,
  SectionTitle,
  Stat,
  StatRow,
  TrendLine,
  type BarDatum,
} from 'src/front-components/dashboard-ui';

export const VOLUME_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER =
  'a7b1c4e6-8d92-4f03-b5a7-1c2e9f4d6b80';

// Presentation lives in dashboard-ui, shared with every other surface in the
// app so they read as one product.
const CHART_HEIGHT = 150;
const LINE_HEIGHT = 120;

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const bucketLabel = (start: string, granularity: Granularity): string => {
  const [year, month, day] = start.split('-');
  return granularity === 'month'
    ? `${MONTHS[Number(month) - 1]} ${year.slice(2)}`
    : `${Number(day)} ${MONTHS[Number(month) - 1]}`;
};

const dayLabel = (iso: string): string => {
  const [, month, day] = iso.split('-');
  return `${Number(day)} ${MONTHS[Number(month) - 1]}`;
};

const formatTonnage = (kg: number): string =>
  kg >= 1000 ? `${Math.round(kg / 100) / 10}t` : `${kg}kg`;

type ScopeKind =
  | 'all'
  | 'exercise'
  | 'workout'
  | 'program'
  | 'session'
  | 'person';

type Scope = { kind: ScopeKind; id: string | null };

const SCOPED_OBJECTS: ScopeKind[] = [
  'exercise',
  'workout',
  'program',
  'session',
  'person',
];

type Fetched = {
  sets: PerformedSet[];
  sessionStarts: { startedAt: string | null }[];
  prescribedSets: number;
};

const SET_SELECTION = {
  id: true,
  reps: true,
  weightKg: true,
  createdAt: true,
  exercise: { id: true, name: true },
  session: { startedAt: true },
};

const toPerformedSet = (node: any): PerformedSet => ({
  exerciseId: node?.exercise?.id ?? null,
  exerciseName: node?.exercise?.name ?? null,
  reps: node?.reps ?? null,
  weightKg: node?.weightKg ?? null,
  // When it was trained, not when the row was written — a log typed up days
  // later still belongs to the session's week.
  performedAt: node?.session?.startedAt ?? node?.createdAt ?? null,
});

/**
 * Each scope filters a different column, and two need a lookup first: a set
 * has no workout (only its prescription does) and no person (only the
 * workspace member does).
 */
const loadForScope = async (
  client: CoreApiClient,
  scope: Scope,
): Promise<Fetched> => {
  const setsWhere = async (filter?: any): Promise<PerformedSet[]> => {
    const result = (await client.query({
      setLogs: {
        __args: { ...(filter ? { filter } : {}), first: 1000 },
        edges: { node: SET_SELECTION },
      },
    } as any)) as any;
    return (result?.setLogs?.edges ?? []).map((edge: any) =>
      toPerformedSet(edge.node),
    );
  };

  const sessionsWhere = async (filter?: any) => {
    const result = (await client.query({
      sessions: {
        __args: { ...(filter ? { filter } : {}), first: 500 },
        edges: { node: { id: true, startedAt: true } },
      },
    } as any)) as any;
    return (result?.sessions?.edges ?? []).map((edge: any) => ({
      startedAt: edge.node?.startedAt ?? null,
    }));
  };

  const prescriptionsWhere = async (filter: any) => {
    const result = (await client.query({
      programExercises: {
        __args: { filter, first: 500 },
        edges: { node: { id: true, targetSets: true } },
      },
    } as any)) as any;
    return (result?.programExercises?.edges ?? []).map((edge: any) => edge.node);
  };

  const sumTargets = (nodes: any[]): number =>
    nodes.reduce((total, node) => total + (node?.targetSets ?? 0), 0);

  if (scope.kind === 'exercise' && scope.id) {
    return {
      sets: await setsWhere({ exerciseId: { eq: scope.id } }),
      sessionStarts: [],
      prescribedSets: 0,
    };
  }

  if (scope.kind === 'session' && scope.id) {
    return {
      sets: await setsWhere({ sessionId: { eq: scope.id } }),
      sessionStarts: [],
      prescribedSets: 0,
    };
  }

  if (scope.kind === 'workout' && scope.id) {
    const prescriptions = await prescriptionsWhere({
      workoutId: { eq: scope.id },
    });
    const ids = prescriptions.map((node: any) => node.id);
    return {
      sets:
        ids.length > 0
          ? await setsWhere({ programExerciseId: { in: ids } })
          : [],
      sessionStarts: [],
      prescribedSets: sumTargets(prescriptions),
    };
  }

  if (scope.kind === 'program' && scope.id) {
    const [sets, sessionStarts, workouts] = await Promise.all([
      setsWhere({ programId: { eq: scope.id } }),
      sessionsWhere({ programId: { eq: scope.id } }),
      client.query({
        workouts: {
          __args: { filter: { programId: { eq: scope.id } }, first: 200 },
          edges: { node: { id: true } },
        },
      } as any) as any,
    ]);
    const workoutIds = (workouts?.workouts?.edges ?? []).map(
      (edge: any) => edge.node.id,
    );
    return {
      sets,
      sessionStarts,
      prescribedSets:
        workoutIds.length > 0
          ? sumTargets(await prescriptionsWhere({ workoutId: { in: workoutIds } }))
          : 0,
    };
  }

  if (scope.kind === 'person' && scope.id) {
    const person = (await client.query({
      person: {
        __args: { filter: { id: { eq: scope.id } } },
        workspaceMember: { id: true },
      },
    } as any)) as any;
    const memberId = person?.person?.workspaceMember?.id ?? null;
    if (!memberId) {
      return { sets: [], sessionStarts: [], prescribedSets: 0 };
    }
    const [sets, sessionStarts] = await Promise.all([
      setsWhere({ traineeMemberId: { eq: memberId } }),
      sessionsWhere({ traineeMemberId: { eq: memberId } }),
    ]);
    return { sets, sessionStarts, prescribedSets: 0 };
  }

  const [sets, sessionStarts] = await Promise.all([
    setsWhere(),
    sessionsWhere(),
  ]);
  return { sets, sessionStarts, prescribedSets: 0 };
};

const VolumeDashboard = () => {
  const colorScheme = useColorScheme();
  const isDark = String(colorScheme ?? '')
    .toLowerCase()
    .includes('dark');
  return (
    <PlanThemeProvider isDark={isDark}>
      <VolumeDashboardContent />
    </PlanThemeProvider>
  );
};

const VolumeDashboardContent = () => {
  const recordId = useRecordId();
  const objectMetadata = useSelectedObjectMetadata();
  const palette = usePlanPalette();

  // The component asks what it is mounted on rather than being told, so each
  // placement stays a bare tab with no configuration.
  const scope = useMemo((): Scope => {
    const name = objectMetadata?.nameSingular as ScopeKind | undefined;
    if (!recordId || !name || !SCOPED_OBJECTS.includes(name)) {
      return { kind: 'all', id: null };
    }
    return { kind: name, id: recordId };
  }, [recordId, objectMetadata]);

  const [data, setData] = useState<Fetched | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [granularity, setGranularity] = useState<Granularity>(
    scope.kind === 'person' || scope.kind === 'all' ? 'month' : 'week',
  );

  const load = useCallback(async () => {
    try {
      setData(await loadForScope(new CoreApiClient(), scope));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to load');
    }
  }, [scope]);

  useEffect(() => {
    void load();
  }, [load]);

  const sets = useMemo(() => data?.sets ?? [], [data]);
  const buckets = useMemo(
    () => volumeBuckets(sets, granularity),
    [sets, granularity],
  );
  const consistency = useMemo(
    () => sessionsPerBucket(data?.sessionStarts ?? [], granularity),
    [data, granularity],
  );
  const perExercise = useMemo(
    () => (scope.kind === 'exercise' ? [] : volumeByExercise(sets).slice(0, 8)),
    [sets, scope],
  );
  const series = useMemo(() => oneRepMaxSeries(sets), [sets]);

  if (error !== null) {
    return <div style={{ fontSize: '12px', color: palette.textMuted }}>{error}</div>;
  }
  if (data === null) {
    return <div style={{ fontSize: '12px', color: palette.textMuted }}>Loading…</div>;
  }
  if (buckets.length === 0) {
    return (
      <div style={{ fontSize: '12px', color: palette.textMuted }}>
        No sets logged yet.
      </div>
    );
  }

  const trend = volumeTrendPercent(buckets);
  const trained = buckets.filter((bucket) => bucket.tonnage > 0);
  const periodWord = granularity === 'week' ? 'Weeks' : 'Months';
  const compliance = adherence(sets.length, data.prescribedSets);

  const volumeBars: BarDatum[] = buckets.map((bucket) => ({
    key: bucket.start,
    value: bucket.tonnage,
    label: bucketLabel(bucket.start, granularity),
    tooltip: `${bucketLabel(bucket.start, granularity)} — ${formatTonnage(
      bucket.tonnage,
    )}, ${bucket.sets} sets, ${bucket.days} day${bucket.days === 1 ? '' : 's'}`,
  }));
  const sessionBars: BarDatum[] = consistency.map((bucket) => ({
    key: bucket.start,
    value: bucket.count,
    label: bucketLabel(bucket.start, granularity),
    tooltip: `${bucketLabel(bucket.start, granularity)} — ${bucket.count} session${
      bucket.count === 1 ? '' : 's'
    }`,
  }));
  const volumePeak = Math.max(...buckets.map((bucket) => bucket.tonnage), 1);
  const sessionPeak = Math.max(...consistency.map((bucket) => bucket.count), 1);
  const headline =
    scope.kind === 'exercise' && series[0]
      ? { label: 'Best estimated 1RM', value: `${series[0].best}kg` }
      : { label: 'Total volume', value: formatTonnage(totalVolume(sets)) };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Card palette={palette}>
        <StatRow palette={palette}>
          <Stat
            lead
            label={headline.label}
            value={headline.value}
            palette={palette}
          />
          <Stat
            label={`${periodWord} trained`}
            value={`${trained.length}/${buckets.length}`}
            palette={palette}
          />
          <Stat
            label="Trend"
            value={trend === null ? '—' : `${trend > 0 ? '+' : ''}${trend}%`}
            hint={trend === null ? 'needs two periods' : undefined}
            palette={palette}
          />
          {scope.kind === 'exercise' && (
            <Stat
              label="Volume"
              value={formatTonnage(totalVolume(sets))}
              palette={palette}
            />
          )}
          <span style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['week', 'month'] as Granularity[]).map((option) => (
              <button
                key={option}
                onClick={() => setGranularity(option)}
                style={{
                  fontSize: '12px',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  border: `1px solid ${
                    option === granularity ? palette.accent : palette.border
                  }`,
                  background:
                    option === granularity ? palette.accentSoft : 'transparent',
                  color:
                    option === granularity
                      ? palette.textPrimary
                      : palette.textSecondary,
                }}
              >
                {option === 'week' ? 'Weekly' : 'Monthly'}
              </button>
            ))}
          </div>
        </StatRow>
      </Card>

      {scope.kind === 'exercise' && series[0] && series[0].points.length > 1 && (
        <Card palette={palette}>
          <SectionTitle palette={palette}>Estimated 1RM</SectionTitle>
          <TrendLine
            points={series[0].points.map((point) => ({
              label: dayLabel(point.date),
              value: point.oneRepMax,
            }))}
            height={LINE_HEIGHT}
            palette={palette}
            format={(value) => `${Math.round(value)}kg`}
          />
        </Card>
      )}

      <Card palette={palette}>
        <SectionTitle palette={palette}>
          Volume per {granularity}
        </SectionTitle>
        <ChartFrame
          height={CHART_HEIGHT}
          peak={volumePeak}
          format={formatTonnage}
          palette={palette}
        >
          <BarSeries
            data={volumeBars}
            height={CHART_HEIGHT}
            peak={volumePeak}
            palette={palette}
          />
        </ChartFrame>
      </Card>

      {consistency.length > 1 && (
        <Card palette={palette}>
          <SectionTitle palette={palette}>
            Sessions per {granularity}
          </SectionTitle>
          <ChartFrame
            height={110}
            peak={sessionPeak}
            format={(value) => String(Math.round(value))}
            palette={palette}
          >
            <BarSeries
              data={sessionBars}
              height={110}
              peak={sessionPeak}
              palette={palette}
            />
          </ChartFrame>
        </Card>
      )}

      {data.prescribedSets > 0 && (
        <Card palette={palette}>
          <SectionTitle palette={palette}>Adherence</SectionTitle>
          <MeterRow
            label="Sets logged against prescribed"
            fraction={compliance.prescribed > 0 ? compliance.logged / compliance.prescribed : 0}
            value={`${compliance.logged}/${compliance.prescribed}`}
            hint={compliance.percent !== null ? `${compliance.percent}%` : undefined}
            palette={palette}
          />
        </Card>
      )}

      {perExercise.length > 0 && (
        <Card palette={palette}>
          <SectionTitle palette={palette}>By exercise</SectionTitle>
          {perExercise.map((exercise) => (
            <MeterRow
              key={exercise.exerciseId}
              label={
                <RecordChipLink
                  objectNameSingular="exercise"
                  recordId={exercise.exerciseId}
                  name={exercise.exerciseName}
                  showAvatar={false}
                />
              }
              fraction={exercise.tonnage / perExercise[0].tonnage}
              value={formatTonnage(exercise.tonnage)}
              hint={
                exercise.bestOneRepMax !== null
                  ? `${exercise.bestOneRepMax}kg`
                  : undefined
              }
              palette={palette}
            />
          ))}
        </Card>
      )}
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: VOLUME_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'volume-dashboard',
  description:
    'Volume, strength and consistency, scoped to whatever it is mounted on',
  component: VolumeDashboard,
});
