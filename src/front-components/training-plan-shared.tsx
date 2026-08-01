import 'twenty-ui/style.css';
import 'twenty-ui/theme-light.css';
import 'twenty-ui/theme-dark.css';
import type { CSSProperties, ReactNode } from 'react';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { AppPath, navigate } from 'twenty-sdk/front-component';
import { Tag, type TagColor } from 'twenty-ui/data-display';
import { ThemeProvider, useTheme } from 'twenty-ui/theme-constants';

export type PrescriptionRow = {
  id: string;
  name: string;
  exerciseId: string | null;
  order: number | null;
  setScheme: string | null;
  targetSets: number | null;
  targetRepsMin: number | null;
  targetRepsMax: number | null;
  targetWeightKg: number | null;
  targetPercent1Rm: number | null;
  targetRir: number | null;
  restSeconds: number | null;
  tempo: string | null;
  notes: string | null;
  exerciseName: string | null;
  workoutId: string | null;
};

export type WorkoutRow = {
  id: string;
  name: string;
  day: string | null;
  week: number | null;
  order: number | null;
  notes: string | null;
};

export type Palette = {
  cardBg: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  sectionBg: string;
};

// Wraps a front component in the twenty-ui css-variable theme so Tag and
// the useTheme tokens resolve for the host color scheme.
export const PlanThemeProvider = ({
  isDark,
  children,
}: {
  isDark: boolean;
  children: ReactNode;
}) => (
  <ThemeProvider colorScheme={isDark ? 'dark' : 'light'}>
    {children}
  </ThemeProvider>
);

export const usePlanPalette = (): Palette => {
  const theme = useTheme();
  return {
    cardBg: theme.background.secondary,
    border: theme.border.color.medium,
    textPrimary: theme.font.color.primary,
    textSecondary: theme.font.color.secondary,
    textMuted: theme.font.color.light,
    sectionBg: theme.background.tertiary,
  };
};

const SCHEME_TAG: Record<string, { label: string; color: TagColor }> = {
  TOP_SET: { label: 'Top set', color: 'red' },
  BACKOFF: { label: 'Backoff', color: 'orange' },
  DROPSET: { label: 'Dropset', color: 'purple' },
  CLUSTER: { label: 'Cluster', color: 'blue' },
  AMRAP: { label: 'AMRAP', color: 'pink' },
  EMOM: { label: 'EMOM', color: 'turquoise' },
  STRAIGHT: { label: 'Straight', color: 'gray' },
};

export const formatRest = (restSeconds: number | null): string | null => {
  if (restSeconds === null || restSeconds === undefined) {
    return null;
  }
  const minutes = Math.floor(restSeconds / 60);
  const seconds = restSeconds % 60;
  if (minutes === 0) {
    return `${seconds}s`;
  }
  return seconds === 0
    ? `${minutes}min`
    : `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export const formatSetsAndReps = (row: PrescriptionRow): string => {
  const reps =
    row.targetRepsMin !== null && row.targetRepsMax !== null
      ? `${row.targetRepsMin}-${row.targetRepsMax}`
      : row.targetRepsMin !== null
        ? `${row.targetRepsMin}`
        : row.setScheme === 'AMRAP'
          ? 'AMRAP'
          : '?';
  if (row.targetSets === null) {
    return `${reps} reps`;
  }
  return `${row.targetSets}×${reps}`;
};

export const formatLoad = (row: PrescriptionRow): string | null => {
  if (row.targetWeightKg !== null) {
    return `${row.targetWeightKg} kg`;
  }
  if (row.targetPercent1Rm !== null) {
    return `${row.targetPercent1Rm}% 1RM`;
  }
  return null;
};


// Rendered as a role="link" span instead of an anchor: raw anchors have
// known rendering issues inside front components, so navigation goes
// exclusively through the host navigate API.
export const RecordLink = ({
  objectNameSingular,
  recordId,
  children,
  style,
}: {
  objectNameSingular: string;
  recordId: string;
  children: ReactNode;
  style?: CSSProperties;
}) => {
  const goToRecord = () =>
    navigate(AppPath.RecordShowPage, {
      objectNameSingular,
      objectRecordId: recordId,
    });
  return (
    <span
      role="link"
      tabIndex={0}
      onClick={goToRecord}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          goToRecord();
        }
      }}
      style={{
        color: 'inherit',
        textDecoration: 'underline',
        textDecorationStyle: 'dotted',
        textUnderlineOffset: '3px',
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
    </span>
  );
};

const SchemeBadge = ({ scheme }: { scheme: string | null }) => {
  if (!scheme) {
    return null;
  }
  const tag = SCHEME_TAG[scheme] ?? { label: scheme, color: 'gray' as TagColor };
  return <Tag color={tag.color} text={tag.label} preventShrink />;
};

export const PrescriptionList = ({
  rows,
  palette,
}: {
  rows: PrescriptionRow[];
  palette: Palette;
}) => {
  const sorted = [...rows].sort(
    (left, right) => (left.order ?? 99) - (right.order ?? 99),
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {sorted.map((row, index) => {
        const details = [
          row.targetRir !== null ? `RIR ${row.targetRir}` : null,
          formatRest(row.restSeconds) !== null
            ? `rest ${formatRest(row.restSeconds)}`
            : null,
          row.tempo ? `tempo ${row.tempo}` : null,
        ].filter(Boolean);
        return (
          <div
            key={row.id}
            style={{
              padding: '8px 0',
              borderTop: index === 0 ? 'none' : `1px solid ${palette.border}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: palette.textPrimary,
                }}
              >
                {row.exerciseId ? (
                  <RecordLink
                    objectNameSingular="exercise"
                    recordId={row.exerciseId}
                    style={{ textDecorationColor: palette.textMuted }}
                  >
                    {row.exerciseName ?? row.name}
                  </RecordLink>
                ) : (
                  (row.exerciseName ?? row.name)
                )}
              </span>
              <SchemeBadge scheme={row.setScheme} />
              <span style={{ flex: 1 }} />
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: palette.textPrimary,
                  whiteSpace: 'nowrap',
                }}
              >
                {formatSetsAndReps(row)}
                {formatLoad(row) ? (
                  <span style={{ color: palette.textSecondary, fontWeight: 400 }}>
                    {' '}
                    @ {formatLoad(row)}
                  </span>
                ) : null}
              </span>
            </div>
            {(details.length > 0 || row.notes) && (
              <div
                style={{
                  fontSize: '11px',
                  color: palette.textMuted,
                  marginTop: '2px',
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}
              >
                {details.length > 0 && <span>{details.join(' · ')}</span>}
                {row.notes && (
                  <span style={{ fontStyle: 'italic' }}>{row.notes}</span>
                )}
              </div>
            )}
          </div>
        );
      })}
      {sorted.length === 0 && (
        <div style={{ fontSize: '12px', color: palette.textMuted }}>
          No prescriptions yet.
        </div>
      )}
    </div>
  );
};

export const DAY_LABEL: Record<string, string> = {
  DAY_A: 'Day A',
  DAY_B: 'Day B',
  DAY_C: 'Day C',
  DAY_D: 'Day D',
  DAY_E: 'Day E',
  DAY_F: 'Day F',
};

const PRESCRIPTION_SELECTION = {
  id: true,
  name: true,
  order: true,
  setScheme: true,
  targetSets: true,
  targetRepsMin: true,
  targetRepsMax: true,
  targetWeightKg: true,
  targetPercent1Rm: true,
  targetRir: true,
  restSeconds: true,
  tempo: true,
  notes: true,
  workoutId: true,
  exercise: { id: true, name: true },
};

const toPrescriptionRow = (node: any): PrescriptionRow => ({
  id: node.id,
  name: node.name ?? '',
  exerciseId: node.exercise?.id ?? null,
  order: node.order ?? null,
  setScheme: node.setScheme ?? null,
  targetSets: node.targetSets ?? null,
  targetRepsMin: node.targetRepsMin ?? null,
  targetRepsMax: node.targetRepsMax ?? null,
  targetWeightKg: node.targetWeightKg ?? null,
  targetPercent1Rm: node.targetPercent1Rm ?? null,
  targetRir: node.targetRir ?? null,
  restSeconds: node.restSeconds ?? null,
  tempo: node.tempo || null,
  notes: node.notes || null,
  exerciseName: node.exercise?.name ?? null,
  workoutId: node.workoutId ?? null,
});

export const fetchPrescriptionsForWorkouts = async (
  client: CoreApiClient,
  workoutIds: string[],
): Promise<PrescriptionRow[]> => {
  if (workoutIds.length === 0) {
    return [];
  }
  const result = (await client.query({
    programExercises: {
      edges: { node: PRESCRIPTION_SELECTION },
      __args: { filter: { workoutId: { in: workoutIds } }, first: 500 },
    },
  } as any)) as any;
  return (result?.programExercises?.edges ?? []).map((edge: any) =>
    toPrescriptionRow(edge.node),
  );
};
