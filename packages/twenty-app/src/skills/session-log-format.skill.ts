import { defineSkill } from 'twenty-sdk/define';

export const SESSION_LOG_FORMAT_SKILL_UNIVERSAL_IDENTIFIER =
  '9cedfd13-1b27-406a-8104-66e88639f213';

export default defineSkill({
  universalIdentifier: SESSION_LOG_FORMAT_SKILL_UNIVERSAL_IDENTIFIER,
  name: 'session-log-format',
  label: 'Training log notation',
  icon: 'IconNotes',
  description: 'How to read a hand-written session, whatever notation it uses',
  content: `# Training log notation

A session is typed on a phone, one exercise after another. Everyone writes
slightly differently, so your job is to work out **this** log's notation and
describe it as a *dialect*, then hand both the log and the dialect to the
\`log-session\` tool. The tool does the extraction.

## Structure (stable across dialects)

- A line that does **not** start with a digit is an **exercise name**.
- A line starting with the warm-up word lists **warm-up loads**,
  space-separated. \`Wu 40 80\` is two warm-up sets, at 40 and 80.
- Any other line is one **working set**, written as separated columns.
- A bare \`xN\` token anywhere in a set line repeats that set N times, so
  \`13.75 l 6 l 0 l x3\` is three identical sets.
- Blank lines are optional and carry no meaning.

## The dialect

Four things vary. Report only what differs from the default.

| Field | Default | Notes |
| --- | --- | --- |
| \`separator\` | \`["l", "|", "/"]\` | \`l\` is how \`|\` gets typed without a numpad. Could be \`;\`, \`-\`, \`,\`. |
| \`columns\` | \`["weight","reps","rir","rest","tempo","notes"]\` | Any order. Use \`"skip"\` to ignore a column, e.g. a leading set number. |
| \`warmUpPrefix\` | \`"wu"\` | Could be \`"warmup"\`, \`"échauffement"\`. |
| \`weightUnit\` | \`"kg"\` | \`"lb"\` is converted for you. |

### Working out the columns

Read the whole log before deciding, and use magnitudes and the prose around
it. Weight is usually the largest number and often fractional (\`13.75\`).
Reps are small, and may be fractional — \`4.5\` means the last rep was failed
halfway. RIR is \`0\`–\`5\`. Rest is in seconds, so a number in the hundreds.
Tempo is a word or a pattern (\`slow\`, \`slow+\`, \`0-3-3-0\`). Notes are free
text in any language.

Columns drop from the **right** when not recorded, so \`17.5 l 7 l 0\` is
weight, reps and RIR only — never shift the remaining values left to fill.

## Worked example (default dialect)

\`\`\`
Ohp barbell
Wu 20
60 l 6 l 0 l 230 l slow l good
60 l 4.5 l 0 l 230 l slow

Lat raises
13.75 l 6 l 0 l x3
\`\`\`

Two exercises: "Ohp barbell" with one warm-up at 20 kg and two working sets,
then "Lat raises" with three identical sets at 13.75 kg.

## Rules you must follow

1. **Never transcribe, recompute or reformat the numbers.** Pass \`rawLog\`
   through byte for byte. You choose the dialect; the tool reads the values.
2. **Never invent an exercise.** Every name must map to an existing Exercise
   record. Allow for abbreviations and other languages ("Ohp barbell" is an
   overhead press, "câble" is cable). If a name still has no confident match,
   stop and ask — near-duplicate library entries corrupt every later
   progression chart.
3. **Say which dialect you used**, so a wrong guess is visible and
   correctable rather than silently baked into the data.
4. A session logged this way has **no program and no workout**. That is
   expected and correct.`,
});
