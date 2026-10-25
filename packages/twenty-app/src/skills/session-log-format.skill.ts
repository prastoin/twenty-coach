import { defineSkill } from 'twenty-sdk/define';

export const SESSION_LOG_FORMAT_SKILL_UNIVERSAL_IDENTIFIER =
  '9cedfd13-1b27-406a-8104-66e88639f213';

export default defineSkill({
  universalIdentifier: SESSION_LOG_FORMAT_SKILL_UNIVERSAL_IDENTIFIER,
  name: 'session-log-format',
  label: 'Training log notation',
  icon: 'IconNotes',
  description: 'How coaches and trainees write a session by hand',
  content: `# Training log notation

A session is typed on a phone, one exercise after another. Blank lines are
optional and carry no meaning.

- A line that does **not** start with a digit is an **exercise name**.
- A line starting with \`Wu\` (case-insensitive) lists **warm-up loads**,
  space-separated. \`Wu 40 80\` is two warm-up sets, at 40 kg and 80 kg.
- Any other line is a **working set**.

## Working set columns

Columns are separated by a lone \`l\` (how \`|\` gets typed without a numpad),
\`|\` or \`/\`, always in this order:

\`\`\`
weight | reps | rir | rest | tempo | notes
\`\`\`

Weight is kilograms, rest is seconds, tempo is free notation (\`slow\`,
\`slow+\`, \`0-3-3-0\`), notes are free text and may contain punctuation and
any language. Columns are dropped from the right when not recorded, so
\`17.5 l 7 l 0\` is weight, reps and RIR only.

Reps may be fractional: \`4.5\` means the last rep was failed halfway.

A bare \`xN\` token anywhere in a set line repeats that set N times, so
\`13.75 l 6 l 0 l x3\` is three identical sets.

## Worked example

\`\`\`
Ohp barbell
Wu 20
60 l 6 l 0 l 230 l slow l good
60 l 5 l 0 l 230 l slow l good hard
60 l 4.5 l 0 l 230 l slow

Lat raises
13.75 l 6 l 0 l x3
\`\`\`

That is two exercises: "Ohp barbell" with one warm-up at 20 kg and three
working sets, then "Lat raises" with three identical sets at 13.75 kg.

## Rules you must follow

1. **Never recompute or reformat the numbers.** Pass the log through
   verbatim; the \`log-session\` tool parses it deterministically.
2. **Never invent an exercise.** Every name in the log must map to an
   existing Exercise record. Search the library, allow for abbreviations and
   other languages ("Ohp barbell" is an overhead press, "câble" is cable),
   and if a name still has no confident match, say so and ask rather than
   creating one. Near-duplicate library entries corrupt every later
   progression chart.
3. A session logged this way has **no program and no workout** — that is
   expected and correct.`,
});
