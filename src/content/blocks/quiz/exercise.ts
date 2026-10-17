import type { Code } from 'mdast'
import type { FillExercise, FillSegment, OrderExercise, OrderPiece, QuizUnit } from '../../model'
import { fenceWords } from '../meta'

// `// ✗` · `# ✗` · `-- ✗` in code; a bare ` ✗` too (language courses' sentence pieces have no comment syntax)
const DISTRACTOR = /\s*(?:(?:\/\/|#|--)\s*)?✗\s*$/
const BLANK = /\[\[([\s\S]+?)\]\]/g

// Real language of an exercise fence: ```js order → js, ```order → null
function fenceLang(node: Code, role: string): string | null {
  const lang = node.lang?.toLowerCase() ?? null
  return lang && lang !== role ? lang : null
}

export function isRoleFence(node: Code, role: string): boolean {
  return fenceWords(node).includes(role)
}

function trimBlankLines(lines: string[]): string[] {
  let start = 0
  let end = lines.length
  while (start < end && !lines[start]!.trim()) start++
  while (end > start && !lines[end - 1]!.trim()) end--
  return lines.slice(start, end)
}

// One piece per line; if the fence has blank lines, blank-line separated blocks are pieces
export function parseOrder(node: Code, role = 'order'): OrderExercise {
  const lines = trimBlankLines(node.value.replace(/\r\n?/g, '\n').split('\n'))
  const blocks = lines.some((l) => !l.trim())
  const chunks: string[][] = []
  if (blocks) {
    let current: string[] = []
    for (const line of lines) {
      if (line.trim()) current.push(line)
      else if (current.length) {
        chunks.push(current)
        current = []
      }
    }
    if (current.length) chunks.push(current)
  } else for (const line of lines) chunks.push([line])
  const pieces: OrderPiece[] = chunks.map((chunk, i) => {
    const distractor = chunk.some((l) => DISTRACTOR.test(l))
    return { id: `p${i}`, code: chunk.map((l) => l.replace(DISTRACTOR, '').replace(/\s+$/, '')).join('\n'), distractor }
  })
  return { kind: 'order', lang: fenceLang(node, role), pieces }
}

function splitAnswers(raw: string): string[] {
  return raw
    .split(/(?<!\\)\|/)
    .map((a) => a.replace(/\\\|/g, '|').trim())
    .filter(Boolean)
}

export function parseFill(node: Code, bank: boolean, extra: string[] = [], role = 'fill'): FillExercise {
  const value = node.value.replace(/\r\n?/g, '\n')
  const segments: FillSegment[] = []
  let last = 0
  let n = 0
  for (const m of value.matchAll(BLANK)) {
    if (m.index > last) segments.push({ kind: 'text', value: value.slice(last, m.index) })
    const answers = splitAnswers(m[1]!)
    segments.push({ kind: 'blank', id: `b${n++}`, answers: answers.length ? answers : [m[1]!] })
    last = m.index + m[0].length
  }
  if (last < value.length) segments.push({ kind: 'text', value: value.slice(last) })
  const words = segments.flatMap((s) => (s.kind === 'blank' ? [s.answers[0]!] : []))
  return { kind: 'fill', lang: fenceLang(node, role), segments, bank: bank ? [...words, ...extra] : null }
}

// Authoring problems surfaced by `pnpm content:check` and the settings panel
export function exerciseProblems(unit: QuizUnit): string[] {
  // [!listen] type: fill reports its own problems (src/content/blocks/listen/definition.ts)
  if (unit.mode !== 'order' && unit.mode !== 'fill') return []
  const ex = unit.exercise
  if (!ex || ex.kind !== unit.mode) return [`Тест ${unit.id} (type: ${unit.mode}) без блоку коду \`${unit.mode}\``]
  if (ex.kind === 'order') {
    const real = ex.pieces.filter((p) => !p.distractor)
    const out: string[] = []
    if (real.length < 3) out.push(`Тест ${unit.id}: для type: order потрібно ≥ 3 шматки коду (зараз ${real.length})`)
    const codes = new Set(real.map((p) => p.code))
    if (ex.pieces.some((p) => p.distractor && codes.has(p.code))) out.push(`Тест ${unit.id}: дистрактор збігається з правильним рядком`)
    return out
  }
  const blanks = ex.segments.filter((s) => s.kind === 'blank')
  if (blanks.length === 0) return [`Тест ${unit.id}: у type: fill немає пропусків [[відповідь]]`]
  return []
}

// Canonical answer as plain code: correct pieces in order / template with first answers
export function exerciseSolution(ex: OrderExercise | FillExercise): string {
  if (ex.kind === 'order') return ex.pieces.filter((p) => !p.distractor).map((p) => p.code).join('\n')
  return ex.segments.map((s) => (s.kind === 'text' ? s.value : s.answers[0])).join('')
}

// `loose` — [!listen] type: fill (IELTS form completion): case, inner spacing and a final full stop don't matter
const looseForm = (s: string) => s.trim().replace(/\s+/g, ' ').replace(/\.$/, '').toLowerCase()

export function blankMatches(answers: readonly string[], value: string, loose = false): boolean {
  const v = value.trim()
  if (v === '') return false
  if (loose) return answers.some((a) => looseForm(a) === looseForm(v))
  return answers.some((a) => a.trim() === v)
}

export function orderMatches(ex: OrderExercise, ids: readonly string[]): boolean {
  const byId = new Map(ex.pieces.map((p) => [p.id, p.code]))
  const want = ex.pieces.filter((p) => !p.distractor).map((p) => p.code)
  return ids.length === want.length && ids.every((id, i) => byId.get(id) === want[i])
}
