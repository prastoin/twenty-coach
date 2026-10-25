/**
 * Parses a free-text training log into exercises and sets.
 *
 * Everyone writes their log slightly differently, so the notation is not
 * hardcoded: a `LogDialect` says which separator is used, which columns
 * appear and in what order, and which unit weights are in. Defaults match
 * the most common shape — `weight | reps | rir | rest | tempo | notes`
 * separated by a lone `l` (how `|` gets typed without a numpad).
 *
 *   Ohp barbell
 *   Wu 20
 *   60 l 6 l 0 l 230 l slow l good
 *   13.75 l 6 l 0 l x3
 *
 * The dialect is meant to be inferred once per log by a caller that can read
 * prose — an agent — and then applied here. That keeps value extraction
 * deterministic: whoever picks the dialect still never gets to decide what a
 * number is.
 *
 * Parsing stays total: anything unrecognised is reported in `warnings`
 * rather than thrown, so one malformed line never costs the rest of the
 * session.
 */

export const SET_COLUMNS = [
  'weight',
  'reps',
  'rir',
  'rest',
  'tempo',
  'notes',
  'skip',
] as const;

export type SetColumn = (typeof SET_COLUMNS)[number];

export type LogDialect = {
  separator?: string | string[];
  columns?: SetColumn[];
  warmUpPrefix?: string;
  weightUnit?: 'kg' | 'lb';
};

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
  dialect: Required<LogDialect>;
  warnings: string[];
};

const DEFAULT_COLUMNS: SetColumn[] = [
  'weight',
  'reps',
  'rir',
  'rest',
  'tempo',
  'notes',
];
const DEFAULT_SEPARATOR = ['l', '|', '/'];
const DEFAULT_WARM_UP_PREFIX = 'wu';
const POUNDS_TO_KILOS = 0.45359237;
const REPEAT_TOKEN = /^x\s*(\d+)$/i;

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// A word-like separator ("l", "x") must be surrounded by whitespace or it
// would match inside words; punctuation may be written tight ("60|6").
const buildSeparator = (separator: string | string[]): RegExp => {
  const alternatives = (Array.isArray(separator) ? separator : [separator])
    .filter((token) => token !== '')
    .map((token) =>
      /^[a-z0-9]+$/i.test(token)
        ? `\\s+${escapeRegExp(token)}\\s+`
        : `\\s*${escapeRegExp(token)}\\s*`,
    );

  return new RegExp(alternatives.join('|'));
};

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

const toKilos = (weight: number | null, unit: 'kg' | 'lb'): number | null => {
  if (weight === null || unit === 'kg') {
    return weight;
  }
  return Math.round(weight * POUNDS_TO_KILOS * 100) / 100;
};

// Splits on at most `limit - 1` separators so a separator-shaped word inside
// the trailing free-text column stays part of that column.
const splitColumns = (
  line: string,
  separator: RegExp,
  limit: number,
): string[] => {
  const columns: string[] = [];
  let rest = line;
  while (columns.length < Math.max(limit - 1, 0)) {
    const match = separator.exec(rest);
    if (match === null || match.index === undefined) {
      break;
    }
    columns.push(rest.slice(0, match.index));
    rest = rest.slice(match.index + match[0].length);
  }
  columns.push(rest);
  return columns.map((column) => column.trim());
};

const emptySet = (isWarmUp: boolean): ParsedSet => ({
  weightKg: null,
  reps: null,
  rir: null,
  restSeconds: null,
  tempo: null,
  notes: null,
  isWarmUp,
});

const assign = (
  set: ParsedSet,
  column: SetColumn,
  raw: string | undefined,
  weightUnit: 'kg' | 'lb',
): void => {
  switch (column) {
    case 'weight':
      set.weightKg = toKilos(toNumber(raw), weightUnit);
      break;
    case 'reps':
      set.reps = toNumber(raw);
      break;
    case 'rir':
      set.rir = toNumber(raw);
      break;
    case 'rest':
      set.restSeconds = toNumber(raw);
      break;
    case 'tempo':
      set.tempo = toText(raw);
      break;
    case 'notes':
      set.notes = toText(raw);
      break;
    case 'skip':
      break;
  }
};

export const parseSessionLog = (
  input: string,
  dialect: LogDialect = {},
): ParsedSessionLog => {
  const resolved: Required<LogDialect> = {
    separator: dialect.separator ?? DEFAULT_SEPARATOR,
    columns:
      dialect.columns && dialect.columns.length > 0
        ? dialect.columns
        : DEFAULT_COLUMNS,
    warmUpPrefix: dialect.warmUpPrefix ?? DEFAULT_WARM_UP_PREFIX,
    weightUnit: dialect.weightUnit ?? 'kg',
  };

  const separator = buildSeparator(resolved.separator);
  const warmUpLine = new RegExp(
    `^${escapeRegExp(resolved.warmUpPrefix)}\\b(.*)$`,
    'i',
  );

  const exercises: ParsedExercise[] = [];
  const warnings: string[] = [];
  let current: ParsedExercise | null = null;

  const parseWarmUp = (line: string): ParsedSet[] => {
    const loads = (warmUpLine.exec(line)?.[1] ?? '')
      .split(/[\s,|/]+/)
      .map((token) => toNumber(token))
      .filter((load): load is number => load !== null);

    return loads.map((load) => ({
      ...emptySet(true),
      weightKg: toKilos(load, resolved.weightUnit),
    }));
  };

  const parseSet = (line: string): ParsedSet[] => {
    const columns = splitColumns(line, separator, resolved.columns.length);

    let repeat = 1;
    const values = columns.filter((column) => {
      const match = REPEAT_TOKEN.exec(column);
      if (match === null) {
        return true;
      }
      repeat = Number(match[1]);
      return false;
    });

    const set = emptySet(false);
    resolved.columns.forEach((column, index) => {
      assign(set, column, values[index], resolved.weightUnit);
    });

    return Array.from({ length: Math.max(repeat, 1) }, () => ({ ...set }));
  };

  for (const rawLine of input.split('\n')) {
    const line = rawLine.trim();
    if (line === '') {
      continue;
    }

    const isWarmUp = warmUpLine.test(line);
    const isSet = !isWarmUp && /^[0-9]/.test(line);

    if (!isWarmUp && !isSet) {
      current = { name: line, sets: [] };
      exercises.push(current);
      continue;
    }

    if (current === null) {
      warnings.push(`Line before any exercise name: "${line}"`);
      continue;
    }

    current.sets.push(...(isWarmUp ? parseWarmUp(line) : parseSet(line)));
  }

  for (const exercise of exercises) {
    if (exercise.sets.length === 0) {
      warnings.push(`No sets recorded for "${exercise.name}"`);
    }
  }

  return { exercises, dialect: resolved, warnings };
};
