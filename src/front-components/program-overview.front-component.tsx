import { useCallback, useEffect, useState } from 'react';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineFrontComponent } from 'twenty-sdk/define';
import { useColorScheme, useRecordId } from 'twenty-sdk/front-component';

import {
  buildPalette,
  DAY_LABEL,
  fetchPrescriptionsForWorkouts,
  PrescriptionList,
  type PrescriptionRow,
  type WorkoutRow,
} from 'src/front-components/training-plan-shared';

export const PROGRAM_OVERVIEW_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER =
  'a5bd6b51-117d-44a6-9206-9985a71f2678';

type ProgramData = {
  name: string;
  status: string | null;
  notes: string | null;
  workouts: WorkoutRow[];
  prescriptions: PrescriptionRow[];
};

const ProgramOverview = () => {
  const recordId = useRecordId();
  const colorScheme = useColorScheme();
  const isDark = String(colorScheme ?? '')
    .toLowerCase()
    .includes('dark');
  const palette = buildPalette(isDark);

  const [data, setData] = useState<ProgramData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProgram = useCallback(async () => {
    if (!recordId) {
      setLoading(false);
      setError('No record id');
      return;
    }
    try {
      const client = new CoreApiClient();
      const result = (await client.query({
        program: {
          __args: { filter: { id: { eq: recordId } } },
          name: true,
          status: true,
          notes: true,
        },
        workouts: {
          edges: {
            node: {
              id: true,
              name: true,
              day: true,
              week: true,
              order: true,
              notes: true,
            },
          },
          __args: { filter: { programId: { eq: recordId } }, first: 200 },
        },
      } as any)) as any;

      const workouts: WorkoutRow[] = (result?.workouts?.edges ?? []).map(
        (edge: any) => edge.node,
      );
      const prescriptions = await fetchPrescriptionsForWorkouts(
        client,
        workouts.map((workout) => workout.id),
      );

      setData({
        name: result?.program?.name ?? '',
        status: result?.program?.status ?? null,
        notes: result?.program?.notes ?? null,
        workouts,
        prescriptions,
      });
      setError(null);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : String(fetchError),
      );
    }
    setLoading(false);
  }, [recordId]);

  useEffect(() => {
    fetchProgram();
  }, [fetchProgram]);

  if (loading) {
    return (
      <div style={{ padding: '24px', fontSize: '13px', color: palette.textMuted }}>
        Loading program…
      </div>
    );
  }
  if (error || !data) {
    return (
      <div style={{ padding: '24px', fontSize: '13px', color: '#e05252' }}>
        {error ?? 'No data'}
      </div>
    );
  }

  const weeks = [
    ...new Set(data.workouts.map((workout) => workout.week ?? 0)),
  ].sort((left, right) => left - right);

  const prescriptionsByWorkout = new Map<string, PrescriptionRow[]>();
  for (const prescription of data.prescriptions) {
    if (!prescription.workoutId) {
      continue;
    }
    const rows = prescriptionsByWorkout.get(prescription.workoutId) ?? [];
    rows.push(prescription);
    prescriptionsByWorkout.set(prescription.workoutId, rows);
  }

  return (
    <div
      style={{
        padding: '16px 24px 32px',
        fontFamily: 'inherit',
        color: palette.textPrimary,
      }}
    >
      {data.notes && (
        <div
          style={{
            fontSize: '12px',
            color: palette.textSecondary,
            border: `1px solid ${palette.border}`,
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '20px',
            backgroundColor: palette.sectionBg,
            lineHeight: 1.5,
          }}
        >
          {data.notes}
        </div>
      )}
      {weeks.map((week) => {
        const weekWorkouts = data.workouts
          .filter((workout) => (workout.week ?? 0) === week)
          .sort((left, right) => (left.order ?? 99) - (right.order ?? 99));
        return (
          <div key={week} style={{ marginBottom: '24px' }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '10px',
                color: palette.textPrimary,
              }}
            >
              {week > 0 ? `Week ${week}` : 'Workouts'}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '12px',
              }}
            >
              {weekWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  style={{
                    border: `1px solid ${palette.border}`,
                    borderRadius: '10px',
                    padding: '12px 16px',
                    backgroundColor: palette.cardBg,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '8px',
                      marginBottom: '6px',
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>
                      {workout.name}
                    </span>
                    <span style={{ flex: 1 }} />
                    {workout.day && (
                      <span
                        style={{ fontSize: '11px', color: palette.textMuted }}
                      >
                        {DAY_LABEL[workout.day] ?? workout.day}
                      </span>
                    )}
                  </div>
                  <PrescriptionList
                    rows={prescriptionsByWorkout.get(workout.id) ?? []}
                    palette={palette}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {data.workouts.length === 0 && (
        <div style={{ fontSize: '13px', color: palette.textMuted }}>
          This program has no workouts yet.
        </div>
      )}
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: PROGRAM_OVERVIEW_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'program-overview',
  description:
    'Renders the whole program: weeks, workouts and their prescriptions',
  component: ProgramOverview,
});
