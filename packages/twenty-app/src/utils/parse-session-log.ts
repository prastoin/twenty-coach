/**
 * Parses a free-text training log into exercises and sets.
 *
 * The notation is the one coaches already type on their phone: an exercise
 * name on its own line, an optional warm-up line, then one line per working
 * set whose columns are `weight | reps | rir | rest | tempo | notes`.
 * Columns are separated by a lone `l` (how `|` gets typed without a numpad),
 * `|` or `/`, and may be dropped from the right. A bare `xN` token anywhere
 * in a set line repeats that set N times.
 *
 *   Ohp barbell
 *   Wu 20
 *   60 l 6 l 0 l 230 l slow l good
 *   13.75 l 6 l 0 l x3
 *
 * Parsing stays deterministic and total: anything unrecognised is reported in
 * `warnings` rather than thrown, so a single malformed line never costs the
 * rest of the session.
 */

export type ParsedSet = {
  weightKg: number | null;
  reps: number | null;
  rir: number | null;
  restSeconds: number | null;
  tempo: string | null;
  notes: string | null;
  isWarmUp: boolean;
};

export type ParsedExercise = {
  name: string;
  sets: ParsedSet[];
};

export type ParsedSessionLog = {
  exercises: ParsedExercise[];
  warnings: string[];
};

const COLUMN_SEPARATOR = /\s+[l|/]\s+/;
const REPEAT_TOKEN = /^x\s*(\d+)$/i;
const WARM_UP_LINE = /^wu\b(.*)$/i;
const MAX_COLUMNS = 6;

const startsWithNumber = (line: string): boolean => /^[0-9]/.test(line);

const toNumber = (raw: string | undefined): number | null => {
  if (raw === undefined) {
    return null;
  }
  const normalized = raw.replace(',', '.').trim();
  if (normalized === '') {
    return null;
  }
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
};

const toText = (raw: string | undefined): string | null => {
  const trimmed = raw?.trim();
  return trimmed ? trimmed : null;
};

// Splits on at most MAX_COLUMNS - 1 separators so a separator-shaped word
// inside the trailing notes column stays part of the notes.
const splitColumns = (line: string): string[] => {
  const columns: string[] = [];
  let rest = line;
  while (columns.length < MAX_COLUMNS - 1) {
    const match = COLUMN_SEPARATOR.exec(rest);
    if (match === null || match.index === undefined) {
      break;
    }
    columns.push(rest.slice(0, match.index));
    rest = rest.slice(match.index + match[0].length);
  }
  columns.push(rest);
  return columns.map((column) => column.trim());
};

const parseWarmUpLine = (line: string): ParsedSet[] => {
  const match = WARM_UP_LINE.exec(line);
  const loads = (match?.[1] ?? '')
    .split(/[\s,|/]+/)
    .map((token) => toNumber(token))
    .filter((load): load is number => load !== null);

  return loads.map((weightKg) => ({
    weightKg,
    reps: null,
    rir: null,
    restSeconds: null,
    tempo: null,
    notes: null,
    isWarmUp: true,
  }));
};

const parseSetLine = (line: string): ParsedSet[] => {
  const columns = splitColumns(line);

  let repeat = 1;
  const values = columns.filter((column) => {
    const match = REPEAT_TOKEN.exec(column);
    if (match === null) {
      return true;
    }
    repeat = Number(match[1]);
    return false;
  });

  const set: ParsedSet = {
    weightKg: toNumber(values[0]),
    reps: toNumber(values[1]),
    rir: toNumber(values[2]),
    restSeconds: toNumber(values[3]),
    tempo: toText(values[4]),
    notes: toText(values[5]),
    isWarmUp: false,
  };

  return Array.from({ length: Math.max(repeat, 1) }, () => ({ ...set }));
};

export const parseSessionLog = (input: string): ParsedSessionLog => {
  const exercises: ParsedExercise[] = [];
  const warnings: string[] = [];
  let current: ParsedExercise | null = null;

  for (const rawLine of input.split('\n')) {
    const line = rawLine.trim();
    if (line === '') {
      continue;
    }

    if (WARM_UP_LINE.test(line)) {
      if (current === null) {
        warnings.push(`Warm-up line before any exercise name: "${line}"`);
        continue;
      }
      current.sets.push(...parseWarmUpLine(line));
      continue;
    }

    if (startsWithNumber(line)) {
      if (current === null) {
        warnings.push(`Set line before any exercise name: "${line}"`);
        continue;
      }
      current.sets.push(...parseSetLine(line));
      continue;
    }

    current = { name: line, sets: [] };
    exercises.push(current);
  }

  for (const exercise of exercises) {
    if (exercise.sets.length === 0) {
      warnings.push(`No sets recorded for "${exercise.name}"`);
    }
  }

  return { exercises, warnings };
};
