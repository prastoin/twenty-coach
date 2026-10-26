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

/**
 * A labelled choice. Two of these sit side by side, and the labels matter:
 * a bare "Weekly / Monthly" pair reads as a filter when it only changes how
 * the bars are grouped.
 */
export const Toggle = <T,>({
  label,
  options,
  selected,
  onSelect,
  palette,
}: {
  label: string;
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
  palette: Palette;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
    <span style={{ fontSize: '10px', color: palette.textMuted }}>{label}</span>
    <div style={{ display: 'flex', gap: '3px' }}>
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <button
            key={String(option.value)}
            onClick={() => onSelect(option.value)}
            style={{
              fontSize: '12px',
              padding: '4px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              border: `1px solid ${
                isSelected ? palette.accent : palette.border
              }`,
              background: isSelected ? palette.accentSoft : 'transparent',
              color: isSelected ? palette.textPrimary : palette.textSecondary,
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </div>
);

/**
 * What the marks on a chart mean. A second series drawn without a key is
 * just an unexplained line.
 */
export const Legend = ({
  items,
  palette,
}: {
  items: { label: string; dashed?: boolean }[];
  palette: Palette;
}) => (
  <div
    style={{
      display: 'flex',
      gap: '14px',
      fontSize: '10px',
      color: palette.textMuted,
    }}
  >
    {items.map((item) => (
      <span
        key={item.label}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
      >
        <span
          style={{
            width: '12px',
            height: item.dashed ? '0' : '8px',
            borderTop: item.dashed
              ? `2px solid ${palette.textPrimary}`
              : undefined,
            opacity: item.dashed ? 0.55 : 1,
            background: item.dashed ? undefined : palette.accent,
            borderRadius: item.dashed ? 0 : '2px',
          }}
        />
        {item.label}
      </span>
    ))}
  </div>
);

/** Names the two numbers a list of meter rows puts on the right. */
export const ColumnHint = ({
  children,
  palette,
}: {
  children: ReactNode;
  palette: Palette;
}) => (
  <span
    style={{
      fontSize: '10px',
      color: palette.textMuted,
      textAlign: 'right',
      marginTop: '-4px',
    }}
  >
    {children}
  </span>
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
  // Bars carry labels under the plot; a line does not, and the axis must not
  // reserve room for captions that are never drawn.
  labelSpace = AXIS_HEIGHT,
}: {
  height: number;
  ticks: number[];
  format: (value: number) => string;
  children: ReactNode;
  palette: Palette;
  labelSpace?: number;
}) => (
  <div style={{ display: 'flex', gap: '8px' }}>
    <div
      style={{
        width: `${AXIS_WIDTH}px`,
        height: `${height - labelSpace}px`,
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
          inset: `0 0 ${labelSpace}px 0`,
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
 * A banded line: the series drawn against the same framed, gridded space the
 * bars use, so a value can be read off rather than guessed from the shape.
 *
 * The geometry is SVG because a line needs coordinates, but nothing that
 * must keep its proportions lives inside it. Stretching a viewBox to the
 * widget scales x and y by different factors, which fattens steep segments,
 * thins flat ones and turns a round marker into a wedge — so the stroke is
 * non-scaling and the end marker is an HTML dot positioned over the top.
 */
export const TrendLine = ({
  points,
  height,
  ticks,
  palette,
}: {
  points: LinePoint[];
  height: number;
  ticks: number[];
  palette: Palette;
}) => {
  const top = ticks[0];
  const bottom = ticks[ticks.length - 1];
  const span = top - bottom || 1;
  const fraction = (value: number) => (value - bottom) / span;
  const coord = (point: LinePoint, index: number): [number, number] => [
    points.length === 1 ? 50 : (index / (points.length - 1)) * 100,
    100 - fraction(point.value) * 100,
  ];
  const line = points.map(coord).map(([x, y]) => `${x},${y}`);
  const area = `0,100 ${line.join(' ')} 100,100`;
  const last = points[points.length - 1];

  return (
    <div style={{ position: 'relative', height: `${height}px` }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', display: 'block' }}
        role="img"
        aria-label="Trend over time"
      >
        <polygon points={area} fill={palette.accent} opacity={0.14} />
        <polyline
          points={line.join(' ')}
          fill="none"
          stroke={palette.accent}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span
        title={`${last.label} — ${last.value}`}
        style={{
          position: 'absolute',
          right: 0,
          bottom: `${fraction(last.value) * 100}%`,
          width: '7px',
          height: '7px',
          marginBottom: '-3.5px',
          borderRadius: '50%',
          background: palette.accent,
          border: `2px solid ${palette.cardBg}`,
          boxSizing: 'content-box',
        }}
      />
    </div>
  );
};

/** First and last point of a series, named, under the chart that drew them. */
export const TrendEnds = ({
  points,
  format,
  palette,
}: {
  points: LinePoint[];
  format: (value: number) => string;
  palette: Palette;
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
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
);
