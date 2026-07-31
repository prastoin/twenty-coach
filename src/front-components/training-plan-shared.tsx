import type {} from 'react';
import { CoreApiClient } from 'twenty-client-sdk/core';

export type PrescriptionRow = {
  id: string;
  name: string;
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

export const buildPalette = (isDark: boolean): Palette =>
  isDark
    ? {
        cardBg: '#1d1d1d',
        border: '#333333',
        textPrimary: '#ebebeb',
        textSecondary: '#a3a3a3',
        textMuted: '#737373',
        sectionBg: '#161616',
      }
    : {
        cardBg: '#ffffff',
        border: '#e5e5e5',
        textPrimary: '#1a1a1a',
        textSecondary: '#666666',
        textMuted: '#999999',
        sectionBg: '#fafafa',
      };

const SCHEME_STYLE: Record<string, { label: string; color: string }> = {
  TOP_SET: { label: 'top set', color: '#e05252' },
  BACKOFF: { label: 'backoff', color: '#e88c30' },
  DROPSET: { label: 'dropset', color: '#8e6cc9' },
  CLUSTER: { label: 'cluster', color: '#3f83d1' },
  AMRAP: { label: 'AMRAP', color: '#d4537e' },
  EMOM: { label: 'EMOM', color: '#1d9e75' },
  STRAIGHT: { label: 'straight', color: '#888888' },
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

const SchemeBadge = ({ scheme }: { scheme: string | null }) => {
  if (!scheme) {
    return null;
  }
  const style = SCHEME_STYLE[scheme] ?? { label: scheme, color: '#888888' };
  return (
    <span
      style={{
        fontSize: '10px',
        fontWeight: 600,
        padding: '1px 7px',
        borderRadius: '999px',
        color: '#ffffff',
        backgroundColor: style.color,
        whiteSpace: 'nowrap',
      }}
    >
      {style.label}
    </span>
  );
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
                {row.exerciseName ?? row.name}
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
  exercise: { name: true },
};

const toPrescriptionRow = (node: any): PrescriptionRow => ({
  id: node.id,
  name: node.name ?? '',
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
