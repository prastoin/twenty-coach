import { useCallback, useEffect, useMemo, useState } from 'react';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineFrontComponent } from 'twenty-sdk/define';
import { useColorScheme, useRecordId } from 'twenty-sdk/front-component';
import {
  totalVolume,
  volumeBuckets,
  volumeByExercise,
  volumeTrendPercent,
  type Granularity,
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

// Charts are drawn by hand rather than with a chart library. They are bars
// and a baseline; the libraries bring a ResizeObserver and an animation
// frameloop, both of which are what breaks inside the front-component
// sandbox. Flexbox sizes the bars without anyone measuring anything — an
// SVG viewBox would need the widget's width, or it distorts its own labels.
const CHART_HEIGHT = 160;
const BAR_GAP = 2;
// A handful of buckets should not become a wall of colour.
const MAX_BAR_WIDTH = 56;
const AXIS_HEIGHT = 18;

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const bucketLabel = (start: string, granularity: Granularity): string => {
  const [year, month, day] = start.split('-');
  return granularity === 'month'
    ? `${MONTHS[Number(month) - 1]} ${year.slice(2)}`
    : `${Number(day)} ${MONTHS[Number(month) - 1]}`;
};

const formatTonnage = (kg: number): string =>
  kg >= 1000 ? `${Math.round(kg / 100) / 10}t` : `${kg}kg`;

const VolumeChart = ({
  buckets,
  granularity,
  palette,
}: {
  buckets: VolumeBucket[];
  granularity: Granularity;
  palette: Palette;
}) => {
  const peak = Math.max(...buckets.map((bucket) => bucket.tonnage), 1);
  // Enough labels to orient, never so many they collide.
  const labelEvery = Math.ceil(buckets.length / 10);

  return (
    <div
      style={{ display: 'flex', alignItems: 'stretch', gap: `${BAR_GAP}px` }}
      role="img"
      aria-label={`Volume per ${granularity}`}
    >
      {buckets.map((bucket, index) => (
        <div
          key={bucket.start}
          title={`${bucketLabel(bucket.start, granularity)} — ${formatTonnage(
            bucket.tonnage,
          )}, ${bucket.sets} sets, ${bucket.days} day${
            bucket.days === 1 ? '' : 's'
          }`}
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
                height: `${Math.round((bucket.tonnage / peak) * 100)}%`,
                minHeight: bucket.tonnage > 0 ? '2px' : 0,
                background: '#6366f1',
                borderRadius: '2px 2px 0 0',
              }}
            />
          </div>
          <div
            style={{
              height: `${AXIS_HEIGHT}px`,
              borderTop: `1px solid ${palette.border}`,
              paddingTop: '3px',
              fontSize: '9px',
              color: palette.textMuted,
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'visible',
            }}
          >
            {index % labelEvery === 0 ? bucketLabel(bucket.start, granularity) : ''}
          </div>
        </div>
      ))}
    </div>
  );
};

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
    <span
      style={{ fontSize: '16px', fontWeight: 600, color: palette.textPrimary }}
    >
      {value}
    </span>
  </div>
);

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
  // Present on an exercise record page, absent on a standalone page. That is
  // the whole difference between the two placements: one exercise or all.
  const exerciseId = useRecordId();
  const palette = usePlanPalette();

  const [sets, setSets] = useState<PerformedSet[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [granularity, setGranularity] = useState<Granularity>('week');

  const fetchSets = useCallback(async () => {
    try {
      const client = new CoreApiClient();
      const result = (await client.query({
        setLogs: {
          __args: {
            ...(exerciseId
              ? { filter: { exerciseId: { eq: exerciseId } } }
              : {}),
            first: 1000,
          },
          edges: {
            node: {
              id: true,
              reps: true,
              weightKg: true,
              createdAt: true,
              exercise: { id: true, name: true },
              session: { startedAt: true },
            },
          },
        },
      } as any)) as any;

      setSets(
        (result?.setLogs?.edges ?? []).map((edge: any) => ({
          exerciseId: edge.node?.exercise?.id ?? null,
          exerciseName: edge.node?.exercise?.name ?? null,
          reps: edge.node?.reps ?? null,
          weightKg: edge.node?.weightKg ?? null,
          // When the set was trained, not when the row was written — a log
          // typed up days later still belongs to the session's week.
          performedAt:
            edge.node?.session?.startedAt ?? edge.node?.createdAt ?? null,
        })),
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to load');
    }
  }, [exerciseId]);

  useEffect(() => {
    void fetchSets();
  }, [fetchSets]);

  const buckets = useMemo(
    () => (sets ? volumeBuckets(sets, granularity) : []),
    [sets, granularity],
  );
  const perExercise = useMemo(
    () => (sets && !exerciseId ? volumeByExercise(sets).slice(0, 8) : []),
    [sets, exerciseId],
  );

  if (error !== null) {
    return (
      <div style={{ fontSize: '12px', color: palette.textMuted }}>{error}</div>
    );
  }
  if (sets === null) {
    return (
      <div style={{ fontSize: '12px', color: palette.textMuted }}>Loading…</div>
    );
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
  const peakTonnage = Math.max(...buckets.map((bucket) => bucket.tonnage));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
          label={granularity === 'week' ? 'Weeks trained' : 'Months trained'}
          value={`${trained.length}/${buckets.length}`}
          palette={palette}
        />
        <Stat label="Best" value={formatTonnage(peakTonnage)} palette={palette} />
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
                background:
                  option === granularity ? palette.sectionBg : 'transparent',
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
      </div>

      <VolumeChart
        buckets={buckets}
        granularity={granularity}
        palette={palette}
      />

      {perExercise.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: palette.textMuted }}>
            By exercise
          </span>
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
                    background: '#6366f1',
                  }}
                />
              </span>
              <span
                style={{
                  fontSize: '12px',
                  color: palette.textSecondary,
                  minWidth: '70px',
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
        </div>
      )}
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: VOLUME_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'volume-dashboard',
  description: 'Training volume per week or month, overall or for one exercise',
  component: VolumeDashboard,
});
