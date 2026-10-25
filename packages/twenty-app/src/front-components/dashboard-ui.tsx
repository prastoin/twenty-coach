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

const AXIS_WIDTH = 44;

/**
 * The frame both charts share: a y-axis with real numbers, gridlines behind
 * the series, and the plot area inset from the labels. Without this a reader
 * can see a shape but cannot read a magnitude.
 */
export const ChartFrame = ({
  height,
  peak,
  format,
  children,
  palette,
}: {
  height: number;
  peak: number;
  format: (value: number) => string;
  children: ReactNode;
  palette: Palette;
}) => {
  const ticks = [peak, peak / 2, 0];
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <div
        style={{
          width: `${AXIS_WIDTH}px`,
          height: `${height}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontSize: '9px',
          color: palette.textMuted,
        }}
      >
        {ticks.map((tick) => (
          <span key={tick} style={{ lineHeight: 1, transform: 'translateY(-3px)' }}>
            {format(tick)}
          </span>
        ))}
      </div>
      <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
        <div
          style={{
            position: 'absolute',
            inset: `0 0 ${18}px 0`,
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
        {children}
      </div>
    </div>
  );
};

export type BarDatum = {
  key: string;
  value: number;
  label: string;
  tooltip: string;
};

const BAR_GAP = 3;
const MAX_BAR_WIDTH = 48;
const AXIS_HEIGHT = 18;

/**
 * Every bucket gets a track, including the empty ones. A week with no
 * training rendering as blank space is indistinguishable from the chart
 * ending, which throws away the thing the contiguous bucketing computed.
 */
export const BarSeries = ({
  data,
  height,
  peak,
  palette,
}: {
  data: BarDatum[];
  height: number;
  peak: number;
  palette: Palette;
}) => {
  const labelEvery = Math.ceil(data.length / 9);
  const plotHeight = height - AXIS_HEIGHT;

  return (
    <div style={{ display: 'flex', gap: `${BAR_GAP}px`, height: `${height}px` }}>
      {data.map((datum, index) => (
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
              display: 'flex',
              alignItems: 'flex-end',
              // Neutral, not a tint of the series: the track marks where a
              // period would be, and must not read as a small value.
              background: palette.sectionBg,
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '100%',
                height: `${Math.round((datum.value / (peak || 1)) * 100)}%`,
                minHeight: datum.value > 0 ? '2px' : 0,
                background: palette.accent,
                borderRadius: '3px 3px 0 0',
              }}
            />
          </div>
          <div
            style={{
              height: `${AXIS_HEIGHT}px`,
              paddingTop: '4px',
              fontSize: '9px',
              color: palette.textMuted,
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            {index % labelEvery === 0 ? datum.label : ''}
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
