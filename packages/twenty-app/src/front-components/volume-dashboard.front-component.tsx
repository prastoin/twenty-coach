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
  type CountBucket,
  type Granularity,
  type OneRepMaxSeries,
  type PerformedSet,
  type VolumeBucket,
} from '@coach-twenty/shared';

import {
  PlanThemeProvider,
  RecordChipLink,
  usePlanPalette,
  type Palette,
} from 'src/front-components/training-plan-shared';

export const VOLUME_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER =
  'a7b1c4e6-8d92-4f03-b5a7-1c2e9f4d6b80';

// Bars are flexbox, not a chart library and not a scaled SVG viewBox. The
// libraries bring a ResizeObserver and an animation frameloop, which is what
// breaks inside the front-component sandbox; a scaled viewBox needs the
// widget's width or it stretches its own axis labels. The one place SVG
// earns its keep is the line, where geometry needs real coordinates — and
// there the labels stay in HTML beside it.
const CHART_HEIGHT = 150;
const LINE_HEIGHT = 120;
const BAR_GAP = 2;
const MAX_BAR_WIDTH = 56;
const ACCENT = '#6366f1';

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

const BarChart = <T,>({
  buckets,
  value,
  label,
  tooltip,
  palette,
}: {
  buckets: T[];
  value: (bucket: T) => number;
  label: (bucket: T) => string;
  tooltip: (bucket: T) => string;
  palette: Palette;
}) => {
  const peak = Math.max(...buckets.map(value), 1);
  const labelEvery = Math.ceil(buckets.length / 10);

  return (
    <div style={{ display: 'flex', gap: `${BAR_GAP}px` }}>
      {buckets.map((bucket, index) => (
        <div
          key={`${label(bucket)}-${index}`}
          title={tooltip(bucket)}
          style={{
            flex: '1 1 0',
            minWidth: 0,
            maxWidth: `${MAX_BAR_WIDTH}px`,
            display: 'flex',
            flexDirection: 'column',
            height: `${CHART_HEIGHT}px`,
          }}
        >
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
            <div
              style={{
                width: '100%',
                height: `${Math.round((value(bucket) / peak) * 100)}%`,
                minHeight: value(bucket) > 0 ? '2px' : 0,
                background: ACCENT,
                borderRadius: '2px 2px 0 0',
              }}
            />
          </div>
          <div
            style={{
              height: '18px',
              borderTop: `1px solid ${palette.border}`,
              paddingTop: '3px',
              fontSize: '9px',
              color: palette.textMuted,
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            {index % labelEvery === 0 ? label(bucket) : ''}
          </div>
        </div>
      ))}
    </div>
  );
};

/** Estimated 1RM over time — the question an exercise page is asking. */
const OneRepMaxChart = ({
  series,
  palette,
}: {
  series: OneRepMaxSeries;
  palette: Palette;
}) => {
  const { points } = series;
  if (points.length < 2) {
    return (
      <div style={{ fontSize: '12px', color: palette.textMuted }}>
        {points.length === 1
          ? `One session so far — ${points[0].oneRepMax}kg estimated.`
          : 'Not enough sets under 12 reps to estimate.'}
      </div>
    );
  }

  const values = points.map((point) => point.oneRepMax);
  const low = Math.min(...values);
  const span = Math.max(...values) - low || 1;
  const coords = points.map((point, index) => {
    const x = (index / (points.length - 1)) * 100;
    const y = 95 - ((point.oneRepMax - low) / span) * 90;
    return `${x},${y}`;
  });

  return (
    <div>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ width: '100%', height: `${LINE_HEIGHT}px`, display: 'block' }}
        role="img"
        aria-label={`Estimated 1RM for ${series.exerciseName}`}
      >
        <polyline
          points={coords.join(' ')}
          fill="none"
          stroke={ACCENT}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: `1px solid ${palette.border}`,
          paddingTop: '3px',
          fontSize: '9px',
          color: palette.textMuted,
        }}
      >
        <span>
          {dayLabel(points[0].date)} · {points[0].oneRepMax}kg
        </span>
        <span>
          {dayLabel(points[points.length - 1].date)} ·{' '}
          {points[points.length - 1].oneRepMax}kg
        </span>
      </div>
    </div>
  );
};

const AdherenceBar = ({
  logged,
  prescribed,
  percent,
  palette,
}: {
  logged: number;
  prescribed: number;
  percent: number | null;
  palette: Palette;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
    <span style={{ fontSize: '11px', color: palette.textMuted }}>
      Adherence — {logged} of {prescribed} prescribed sets
      {percent !== null ? ` · ${percent}%` : ''}
    </span>
    <span
      style={{
        height: '6px',
        background: palette.sectionBg,
        borderRadius: '3px',
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          display: 'block',
          height: '100%',
          width: `${Math.min(percent ?? 0, 100)}%`,
          background: ACCENT,
        }}
      />
    </span>
  </div>
);

const Stat = ({
  label,
  value,
  palette,
}: {
  label: string;
  value: string;
  palette: Palette;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
    <span style={{ fontSize: '11px', color: palette.textMuted }}>{label}</span>
    <span style={{ fontSize: '16px', fontWeight: 600, color: palette.textPrimary }}>
      {value}
    </span>
  </div>
);

const Section = ({
  title,
  children,
  palette,
}: {
  title: string;
  children: React.ReactNode;
  palette: Palette;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
    <span style={{ fontSize: '11px', color: palette.textMuted }}>{title}</span>
    {children}
  </div>
);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <Stat
          label="Total volume"
          value={formatTonnage(totalVolume(sets))}
          palette={palette}
        />
        <Stat
          label={`${periodWord} trained`}
          value={`${trained.length}/${buckets.length}`}
          palette={palette}
        />
        {scope.kind === 'exercise' && series[0] ? (
          <Stat label="Best e1RM" value={`${series[0].best}kg`} palette={palette} />
        ) : (
          <Stat
            label="Best"
            value={formatTonnage(Math.max(...buckets.map((bucket) => bucket.tonnage)))}
            palette={palette}
          />
        )}
        <Stat
          label="Trend"
          value={trend === null ? '—' : `${trend > 0 ? '+' : ''}${trend}%`}
          palette={palette}
        />
        <span style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['week', 'month'] as Granularity[]).map((option) => (
            <button
              key={option}
              onClick={() => setGranularity(option)}
              style={{
                fontSize: '12px',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                border: `1px solid ${palette.border}`,
                background: option === granularity ? palette.sectionBg : 'transparent',
                color:
                  option === granularity ? palette.textPrimary : palette.textSecondary,
              }}
            >
              {option === 'week' ? 'Weekly' : 'Monthly'}
            </button>
          ))}
        </div>
      </div>

      {scope.kind === 'exercise' && series[0] && (
        <Section title="Estimated 1RM" palette={palette}>
          <OneRepMaxChart series={series[0]} palette={palette} />
        </Section>
      )}

      <Section title={`Volume per ${granularity}`} palette={palette}>
        <BarChart<VolumeBucket>
          buckets={buckets}
          value={(bucket) => bucket.tonnage}
          label={(bucket) => bucketLabel(bucket.start, granularity)}
          tooltip={(bucket) =>
            `${bucketLabel(bucket.start, granularity)} — ${formatTonnage(
              bucket.tonnage,
            )}, ${bucket.sets} sets, ${bucket.days} day${
              bucket.days === 1 ? '' : 's'
            }`
          }
          palette={palette}
        />
      </Section>

      {consistency.length > 1 && (
        <Section title={`Sessions per ${granularity}`} palette={palette}>
          <BarChart<CountBucket>
            buckets={consistency}
            value={(bucket) => bucket.count}
            label={(bucket) => bucketLabel(bucket.start, granularity)}
            tooltip={(bucket) =>
              `${bucketLabel(bucket.start, granularity)} — ${
                bucket.count
              } session${bucket.count === 1 ? '' : 's'}`
            }
            palette={palette}
          />
        </Section>
      )}

      {data.prescribedSets > 0 && (
        <AdherenceBar
          logged={compliance.logged}
          prescribed={compliance.prescribed}
          percent={compliance.percent}
          palette={palette}
        />
      )}

      {perExercise.length > 0 && (
        <Section title="By exercise" palette={palette}>
          {perExercise.map((exercise) => (
            <div
              key={exercise.exerciseId}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span style={{ minWidth: '200px' }}>
                <RecordChipLink
                  objectNameSingular="exercise"
                  recordId={exercise.exerciseId}
                  name={exercise.exerciseName}
                  showAvatar={false}
                />
              </span>
              <span
                style={{
                  flex: 1,
                  height: '6px',
                  background: palette.sectionBg,
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    height: '100%',
                    width: `${Math.round(
                      (exercise.tonnage / perExercise[0].tonnage) * 100,
                    )}%`,
                    background: ACCENT,
                  }}
                />
              </span>
              <span
                style={{
                  fontSize: '12px',
                  color: palette.textSecondary,
                  minWidth: '80px',
                  textAlign: 'right',
                }}
              >
                {formatTonnage(exercise.tonnage)}
                {exercise.bestOneRepMax !== null && (
                  <span style={{ color: palette.textMuted }}>
                    {' '}
                    · {exercise.bestOneRepMax}kg
                  </span>
                )}
              </span>
            </div>
          ))}
        </Section>
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
