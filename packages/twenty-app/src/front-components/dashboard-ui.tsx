import type { CSSProperties, ReactNode } from 'react';

import type { Palette } from 'src/front-components/training-plan-shared';

/**
 * The app's own dashboard vocabulary.
 *
 * Twenty's native dashboard widgets are not a target to imitate — what
 * matters is that every surface we ship looks like the same product. So the
 * pieces here are deliberately few and shared: a card, a stat, a meter row,
 * and two charts that both sit in the same framed, gridded, labelled space.
 *
 * Everything takes colour from the theme palette. Nothing hardcodes a hex.
 */

export const Card = ({
  children,
  palette,
  style,
}: {
  children: ReactNode;
  palette: Palette;
  style?: CSSProperties;
}) => (
  <div
    style={{
      background: palette.cardBg,
      border: `1px solid ${palette.border}`,
      borderRadius: '8px',
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      ...style,
    }}
  >
    {children}
  </div>
);

export const SectionTitle = ({
  children,
  palette,
}: {
  children: ReactNode;
  palette: Palette;
}) => (
  <span
    style={{
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: palette.textMuted,
    }}
  >
    {children}
  </span>
);

/**
 * One stat carries the headline; the rest support it. Four equal numbers
 * read as a debug dump, which is what this replaces.
 */
export const Stat = ({
  label,
  value,
  hint,
  lead = false,
  palette,
}: {
  label: string;
  value: string;
  hint?: string;
  lead?: boolean;
  palette: Palette;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
    <span style={{ fontSize: '11px', color: palette.textMuted }}>{label}</span>
    <span
      style={{
        fontSize: lead ? '26px' : '15px',
        fontWeight: lead ? 700 : 600,
        lineHeight: 1.1,
        color: palette.textPrimary,
        letterSpacing: lead ? '-0.02em' : undefined,
      }}
    >
      {value}
    </span>
    {hint && (
      <span style={{ fontSize: '11px', color: palette.textMuted }}>{hint}</span>
    )}
  </div>
);

export const StatRow = ({
  children,
  palette,
}: {
  children: ReactNode;
  palette: Palette;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-end',
      gap: '28px',
      flexWrap: 'wrap',
      paddingBottom: '2px',
      borderBottom: `1px solid ${palette.gridline}`,
    }}
  >
    {children}
  </div>
);

/** Label, a proportional bar, and a value. Used for shares and adherence. */
export const MeterRow = ({
  label,
  fraction,
  value,
  hint,
  palette,
}: {
  label: ReactNode;
  fraction: number;
  value: string;
  hint?: string;
  palette: Palette;
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ minWidth: '190px', fontSize: '12px', color: palette.textPrimary }}>
      {label}
    </span>
    <span
      style={{
        flex: 1,
        height: '8px',
        background: palette.sectionBg,
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          display: 'block',
          height: '100%',
          width: `${Math.max(Math.min(fraction, 1), 0) * 100}%`,
          background: palette.accent,
          borderRadius: '4px',
        }}
      />
    </span>
    <span
      style={{
        fontSize: '12px',
        fontWeight: 600,
        color: palette.textSecondary,
        minWidth: '92px',
        textAlign: 'right',
      }}
    >
      {value}
      {hint && (
        <span style={{ fontWeight: 400, color: palette.textMuted }}> · {hint}</span>
      )}
    </span>
  </div>
);

const AXIS_WIDTH = 48;
const AXIS_HEIGHT = 20;
const BAR_GAP = 3;
const MAX_BAR_WIDTH = 48;

/**
 * The frame the bar charts share: a y-axis with rounded numbers, gridlines
 * behind the series, and the plot inset from the labels.
 *
 * The series sits in its own positioned layer. Absolutely positioned
 * gridlines paint above ordinary in-flow content whatever the DOM order, so
 * without this the lines are drawn across the bars and every bar looks
 * sliced in half.
 */
export const ChartFrame = ({
  height,
  ticks,
  format,
  children,
  palette,
}: {
  height: number;
  ticks: number[];
  format: (value: number) => string;
  children: ReactNode;
  palette: Palette;
}) => (
  <div style={{ display: 'flex', gap: '8px' }}>
    <div
      style={{
        width: `${AXIS_WIDTH}px`,
        height: `${height - AXIS_HEIGHT}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        fontSize: '9px',
        color: palette.textMuted,
      }}
    >
      {ticks.map((tick) => (
        <span key={tick} style={{ lineHeight: 1, transform: 'translateY(-4px)' }}>
          {format(tick)}
        </span>
      ))}
    </div>
    <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
      <div
        style={{
          position: 'absolute',
          inset: `0 0 ${AXIS_HEIGHT}px 0`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
      >
        {ticks.map((tick) => (
          <span
            key={tick}
            style={{ borderTop: `1px solid ${palette.gridline}`, width: '100%' }}
          />
        ))}
      </div>
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  </div>
);

export type BarDatum = {
  key: string;
  value: number;
  label: string;
  tooltip: string;
  /** Trailing average at this bucket, drawn as a mark across the column. */
  average?: number | null;
};

/**
 * Every bucket gets a track, including the empty ones — a period with no
 * training rendering as blank space is indistinguishable from the chart
 * ending, which throws away what the contiguous bucketing computed. The
 * track is a dashed floor rather than a fill: a filled slot reads as a
 * small value.
 *
 * The moving average is a mark per column rather than a line across the
 * chart, so it needs no coordinates and cannot drift out of step with the
 * bars it describes.
 */
export const BarSeries = ({
  data,
  height,
  top,
  palette,
}: {
  data: BarDatum[];
  height: number;
  top: number;
  palette: Palette;
}) => {
  const plotHeight = height - AXIS_HEIGHT;
  const scale = (value: number) => Math.round((value / (top || 1)) * 100);

  return (
    <div style={{ display: 'flex', gap: `${BAR_GAP}px`, height: `${height}px` }}>
      {data.map((datum, index) => {
        const isLatest = index === data.length - 1;
        return (
          <div
            key={datum.key}
            title={datum.tooltip}
            style={{
              flex: '1 1 0',
              minWidth: 0,
              maxWidth: `${MAX_BAR_WIDTH}px`,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                height: `${plotHeight}px`,
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                borderBottom:
                  datum.value > 0
                    ? 'none'
                    : `1px dashed ${palette.border}`,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: `${scale(datum.value)}%`,
                  minHeight: datum.value > 0 ? '2px' : 0,
                  background: palette.accent,
                  opacity: isLatest ? 1 : 0.75,
                  borderRadius: '2px 2px 0 0',
                }}
              />
              {datum.average != null && (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: `${scale(datum.average)}%`,
                    borderTop: `2px solid ${palette.textPrimary}`,
                    opacity: 0.55,
                  }}
                />
              )}
            </div>
            <div
              style={{
                height: `${AXIS_HEIGHT}px`,
                paddingTop: '5px',
                fontSize: '8px',
                color: isLatest ? palette.textSecondary : palette.textMuted,
                fontWeight: isLatest ? 600 : 400,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {datum.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export type ActivityCell = {
  date: string;
  week: number;
  weekday: number;
  count: number;
};

const WEEKDAY_INITIALS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
// Fixed, not fractional: stretching cells to the container turns a dense
// habit grid into a sparse wall of giant squares.
const CELL_SIZE = 11;
const CELL_GAP = 3;

/**
 * Days as weekday rows, one column per week — a training habit read at a
 * glance. Programs are built on weekdays, so "Saturday keeps getting
 * dropped" is a fact this shows and a weekly total cannot.
 *
 * Intensity is the session count, capped: nobody trains four times in a day
 * often enough to deserve its own shade.
 */
export const ActivityGrid = ({
  cells,
  palette,
  monthLabel,
}: {
  cells: ActivityCell[];
  palette: Palette;
  monthLabel: (date: string) => string | null;
}) => {
  const weeks = Math.max(...cells.map((cell) => cell.week)) + 1;
  const trackBorder = `1px solid ${palette.border}`;
  const opacityFor = (count: number): number =>
    Math.min(0.45 + count * 0.3, 1);

  const byWeekday = (weekday: number) =>
    cells.filter((cell) => cell.weekday === weekday).sort((a, b) => a.week - b.week);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${CELL_GAP}px`,
        overflowX: 'auto',
      }}
    >
      <div style={{ display: 'flex', gap: '6px' }}>
        <span style={{ width: '14px' }} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${weeks}, ${CELL_SIZE}px)`,
            gap: `${CELL_GAP}px`,
            fontSize: '8px',
            color: palette.textMuted,
          }}
        >
          {Array.from({ length: weeks }, (_, week) => {
            const monday = cells.find(
              (cell) => cell.week === week && cell.weekday === 0,
            );
            return (
              <span key={week} style={{ whiteSpace: 'nowrap' }}>
                {monday ? (monthLabel(monday.date) ?? '') : ''}
              </span>
            );
          })}
        </div>
      </div>

      {WEEKDAY_INITIALS.map((initial, weekday) => (
        <div
          key={weekday}
          style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
        >
          <span
            style={{
              width: '14px',
              fontSize: '9px',
              color: palette.textMuted,
              textAlign: 'right',
            }}
          >
            {initial}
          </span>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${weeks}, ${CELL_SIZE}px)`,
              gap: `${CELL_GAP}px`,
            }}
          >
            {byWeekday(weekday).map((cell) => (
              <span
                key={cell.date}
                title={`${cell.date} — ${cell.count} session${
                  cell.count === 1 ? '' : 's'
                }`}
                style={{
                  width: `${CELL_SIZE}px`,
                  height: `${CELL_SIZE}px`,
                  borderRadius: '2px',
                  background:
                    cell.count > 0 ? palette.accent : 'transparent',
                  border: cell.count > 0 ? 'none' : trackBorder,
                  opacity: cell.count > 0 ? opacityFor(cell.count) : 0.5,
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export type LinePoint = {
  label: string;
  value: number;
};

/**
 * Area under the line, and the latest point called out. A bare polyline
 * reads as a sparkline; the fill and the end marker make it a trend.
 *
 * Geometry is SVG because a line needs real coordinates, but every label
 * stays in HTML beside it — stretching the viewBox to the widget would
 * otherwise stretch the text with it.
 */
export const TrendLine = ({
  points,
  height,
  palette,
  format,
}: {
  points: LinePoint[];
  height: number;
  palette: Palette;
  format: (value: number) => string;
}) => {
  const values = points.map((point) => point.value);
  const low = Math.min(...values);
  const span = Math.max(...values) - low || 1;
  const coord = (point: LinePoint, index: number): [number, number] => [
    (index / (points.length - 1)) * 100,
    94 - ((point.value - low) / span) * 88,
  ];
  const line = points.map(coord).map(([x, y]) => `${x},${y}`);
  const area = `0,100 ${line.join(' ')} 100,100`;
  const [lastX, lastY] = coord(points[points.length - 1], points.length - 1);

  return (
    <div>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ width: '100%', height: `${height}px`, display: 'block' }}
        role="img"
        aria-label="Trend over time"
      >
        <polygon points={area} fill={palette.accentSoft} />
        <polyline
          points={line.join(' ')}
          fill="none"
          stroke={palette.accent}
          strokeWidth="2"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={lastX}
          cy={lastY}
          r="3"
          fill={palette.accent}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '4px',
          fontSize: '9px',
          color: palette.textMuted,
        }}
      >
        <span>
          {points[0].label} · {format(points[0].value)}
        </span>
        <span style={{ color: palette.textSecondary, fontWeight: 600 }}>
          {points[points.length - 1].label} ·{' '}
          {format(points[points.length - 1].value)}
        </span>
      </div>
    </div>
  );
};
