import type { Root } from 'mdast'
import type { ChapterMeta, LearningUnit } from '../model'
import { extractFile } from '../parse/extract'
import { parseMarkdown } from '../parse/markdown'
import { compareFences, fencesOf } from './code'
import { glossaryMisses, type Glossary } from './glossary'
import { headingSlugs, segmentRoot, type Segment } from './segments'

// Translation checks (pnpm i18n:check, docs/COURSE_FORMAT.md «Переклад курсів (i18n)»). Pure: markdown in, findings out.

export interface LockFile {
  // the source topic id (frontmatter `id`)
  sourceId: string
  // segment id → sha1 of the normalised source text, as reviewed
  segments: Record<string, string>
}

export interface SegmentedDocument {
  meta: ChapterMeta
  root: Root
  title: string | null
  units: LearningUnit[]
  segments: Segment[]
}

// Parse + extract + segment one markdown file. `headingSlugs`: the source's, for a translation.
export function segmentDocument(markdown: string, opts: { path?: string; headingSlugs?: readonly string[] } = {}): SegmentedDocument {
  const { root, meta } = parseMarkdown(markdown)
  const path = opts.path ?? 'i18n.md'
  const extracted = extractFile({ root, meta, guideId: 'i18n', chapterId: meta.id ?? path, path, fileName: path })
  const segments = segmentRoot(extracted.root, { source: markdown, headingSlugs: opts.headingSlugs })
  return { meta, root: extracted.root, title: meta.title ?? extracted.h1, units: extracted.units, segments }
}

export function sourceSlugs(doc: SegmentedDocument): string[] {
  return headingSlugs(doc.root)
}

// Lock of a reviewed translation: the source hashes of the segments the translation has.
export function stampLock(source: SegmentedDocument, translated: SegmentedDocument): LockFile {
  const present = new Set(translated.segments.map((s) => s.id))
  const segments: Record<string, string> = {}
  for (const s of source.segments) if (present.has(s.id)) segments[s.id] = s.hash
  return { sourceId: source.meta.id ?? '', segments }
}

export type FindingKind = 'structure' | 'code' | 'untranslated' | 'stale' | 'unstamped' | 'glossary'

export interface Finding {
  kind: FindingKind
  severity: 'error' | 'warning'
  segment: string | null
  message: string
}

export interface CheckInput {
  source: string
  translated: string
  lock: LockFile | null
  glossary: Glossary | null
}

export interface CheckResult {
  findings: Finding[]
  segments: number
  translated: number
}

const LETTERS = /\p{L}{3,}/u

export function checkTranslation(input: CheckInput): CheckResult {
  const findings: Finding[] = []
  const add = (kind: FindingKind, severity: Finding['severity'], segment: string | null, message: string) => findings.push({ kind, severity, segment, message })
  const source = segmentDocument(input.source)
  const slugs = sourceSlugs(source)
  const translated = segmentDocument(input.translated, { headingSlugs: slugs })
  const trHeadings = headingSlugs(translated.root).length
  if (trHeadings !== slugs.length) add('structure', 'error', null, `різна кількість заголовків: у джерелі ${slugs.length}, у перекладі ${trHeadings}`)

  const src = new Map(source.segments.map((s) => [s.id, s]))
  const tr = new Map(translated.segments.map((s) => [s.id, s]))
  // structure: segments the source doesn't have, block order, block kinds
  for (const s of translated.segments) if (!src.has(s.id)) add('structure', 'error', s.id, `сегмента «${s.id}» немає в джерелі (зайвий абзац, інший id вправи чи інший порядок заголовків)`)
  const order = (segs: readonly Segment[], other: Map<string, Segment>) => segs.filter((s) => other.has(s.id)).map((s) => s.id)
  const a = order(source.segments, tr)
  const b = order(translated.segments, src)
  if (a.join('\n') !== b.join('\n')) {
    const i = a.findIndex((id, k) => id !== b[k])
    add('structure', 'error', a[i] ?? null, `інший порядок блоків: очікується «${a[i]}», у перекладі «${b[i]}»`)
  }
  const srcUnits = new Map(source.units.map((u) => [u.id, u]))
  for (const u of translated.units) {
    const s = srcUnits.get(u.id)
    if (!s) continue
    if (s.kind !== u.kind || (s.kind === 'quiz' && u.kind === 'quiz' && (s.mode !== u.mode || s.options.length !== u.options.length || s.options.some((o, i) => o.correct !== u.options[i]!.correct)))) {
      add('structure', 'error', u.id, `вправа ${u.id}: інший тип, кількість варіантів чи правильні відповіді`)
    }
    if (s.kind === 'task' && u.kind === 'task' && s.hints.length !== u.hints.length) add('structure', 'error', u.id, `задача ${u.id}: інша кількість підказок (${s.hints.length} → ${u.hints.length})`)
  }
  for (const u of source.units) if (u.idSource === 'hash') add('structure', 'error', u.id, `вправа без явного id («${u.id}»): перед перекладом додай id у джерело`)

  let done = 0
  for (const s of source.segments) {
    const t = tr.get(s.id)
    if (!t) {
      add('untranslated', 'warning', s.id, `не перекладено — показується мовою джерела`)
      continue
    }
    done++
    if (s.signature !== t.signature) add('structure', 'error', s.id, `інший вид блоку: ${s.signature} → ${t.signature}`)
    if (s.kind !== 'heading' && t.text === s.text && LETTERS.test(s.text.replace(/`[^`]*`/g, ''))) add('untranslated', 'warning', s.id, 'текст збігається з джерелом (скопійовано без перекладу?)')
    if (s.kind !== 'heading') {
      for (const d of compareFences(fencesOf(s.text.length ? sliceSource(input.source, source, s) : ''), fencesOf(sliceSource(input.translated, translated, t)))) add('code', 'error', s.id, d.message)
    }
    if (input.lock) {
      const locked = input.lock.segments[s.id]
      if (locked === undefined) add('unstamped', 'warning', s.id, 'переклад ще не підтверджено (немає в .lock.json — pnpm i18n:stamp після рецензії)')
      else if (locked !== s.hash) add('stale', 'warning', s.id, 'джерело змінилося після перекладу — онови переклад і зроби i18n:stamp')
    }
    if (input.glossary) {
      for (const m of glossaryMisses(input.glossary, sliceSource(input.source, source, s), sliceSource(input.translated, translated, t))) {
        add('glossary', 'warning', s.id, m.kind === 'keepLatin' ? `«${m.term}» лишається латиницею` : `«${m.term}» → «${m.expected}» (глосарій)`)
      }
    }
  }
  if (!input.lock) add('unstamped', 'warning', null, 'немає .lock.json — переклад ще не рецензовано (pnpm i18n:stamp)')
  else if (input.lock.sourceId && source.meta.id && input.lock.sourceId !== source.meta.id) add('structure', 'error', null, `lock для теми «${input.lock.sourceId}», а джерело — «${source.meta.id}»`)
  return { findings, segments: source.segments.length, translated: done }
}

// Raw markdown of a segment (fences need it unnormalised).
function sliceSource(markdown: string, doc: SegmentedDocument, segment: Segment): string {
  const nodes = segment.nodes.map((i) => doc.root.children[i]!)
  const start = nodes[0]?.position?.start.offset
  const end = nodes.at(-1)?.position?.end.offset
  return start === undefined || end === undefined ? '' : markdown.slice(start, end)
}
