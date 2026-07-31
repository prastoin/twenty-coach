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
} from 'src/front-components/training-plan-shared';

export const WORKOUT_SHEET_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER =
  '076388e6-fda4-45cc-8102-d7c75c2cab08';

type WorkoutData = {
  name: string;
  day: string | null;
  week: number | null;
  notes: string | null;
  programName: string | null;
  prescriptions: PrescriptionRow[];
};

const WorkoutSheet = () => {
  const recordId = useRecordId();
  const colorScheme = useColorScheme();
  const isDark = String(colorScheme ?? '')
    .toLowerCase()
    .includes('dark');
  const palette = buildPalette(isDark);

  const [data, setData] = useState<WorkoutData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWorkout = useCallback(async () => {
    if (!recordId) {
      setLoading(false);
      setError('No record id');
      return;
    }
    try {
      const client = new CoreApiClient();
      const result = (await client.query({
        workout: {
          __args: { filter: { id: { eq: recordId } } },
          name: true,
          day: true,
          week: true,
          notes: true,
          program: { name: true },
        },
      } as any)) as any;

      const prescriptions = await fetchPrescriptionsForWorkouts(client, [
        recordId,
      ]);

      setData({
        name: result?.workout?.name ?? '',
        day: result?.workout?.day ?? null,
        week: result?.workout?.week ?? null,
        notes: result?.workout?.notes ?? null,
        programName: result?.workout?.program?.name ?? null,
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
    fetchWorkout();
  }, [fetchWorkout]);

  if (loading) {
    return (
      <div style={{ padding: '24px', fontSize: '13px', color: palette.textMuted }}>
        Loading workout…
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

  const meta = [
    data.programName,
    data.week !== null ? `Week ${data.week}` : null,
    data.day ? (DAY_LABEL[data.day] ?? data.day) : null,
    `${data.prescriptions.length} exercise${data.prescriptions.length === 1 ? '' : 's'}`,
  ].filter(Boolean);

  return (
    <div
      style={{
        padding: '16px 24px 32px',
        fontFamily: 'inherit',
        color: palette.textPrimary,
        maxWidth: '720px',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          color: palette.textSecondary,
          marginBottom: '12px',
        }}
      >
        {meta.join(' · ')}
      </div>
      <div
        style={{
          border: `1px solid ${palette.border}`,
          borderRadius: '10px',
          padding: '14px 18px',
          backgroundColor: palette.cardBg,
        }}
      >
        <PrescriptionList rows={data.prescriptions} palette={palette} />
      </div>
      {data.notes && (
        <div
          style={{
            fontSize: '12px',
            color: palette.textSecondary,
            marginTop: '12px',
            lineHeight: 1.5,
          }}
        >
          {data.notes}
        </div>
      )}
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: WORKOUT_SHEET_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'workout-sheet',
  description: 'Renders one workout as a session sheet of its prescriptions',
  component: WorkoutSheet,
});
