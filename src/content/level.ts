import { LEVELS, type Level } from './model'

// Level names as authors write them (frontmatter, block meta, questions JSON) → Level. Pure: imported by the
// block definitions, which also run in the browser (quiz grading) — keep parsers (yaml, remark) out of here.

const CEFR = /^\s*([abc][12])\s*$/i

export function toLevel(value: unknown): Level | null {
  if (typeof value !== 'string') return null
  // CEFR (language guides): a1 / A1 → 'A1'
  const cefr = CEFR.exec(value)
  if (cefr) return cefr[1]!.toUpperCase() as Level
  const normalized = value.toLowerCase().replace(/[\s_-]+/g, '')
  if (normalized === 'teamlead' || normalized === 'lead') return 'techlead'
  return (LEVELS as readonly string[]).includes(normalized) && !CEFR.test(normalized) ? (normalized as Level) : null
}
