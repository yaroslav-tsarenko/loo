import type { Root, RootContent } from 'mdast'
import { visit } from 'unist-util-visit'
import type { FlashcardUnit, Heading, LearningUnit, QuizUnit, TaskUnit } from '../model'
import type { UnitRef, WikiLink } from '../parse/nodes'
import { headingSlug } from '../render/to-hast'
import { codeSkeleton, compareFences, fencesOfRoot, sameTaskCode } from './code'
import { headingSlugOf, headingSlugs, segmentRoot, type Segment } from './segments'

// A topic page in another language (docs/COURSE_FORMAT.md «Переклад курсів (i18n)»): the SOURCE document's structure,
// each segment taken from the translation when it is safe to, otherwise from the source inside an «not translated
// yet» marker. The rule everywhere: when in doubt, show the source — a translation must never change what a learner
// is graded on or where a heading points. Exercises keep their source identity — id, option ids, correct flags,
// answers — and take only their texts from the translation, so grading, progress and SRS are the same in every
// language. Pure.

export interface LocalizableDocument {
  root: Root
  headings: Heading[]
  units: ReadonlyMap<string, LearningUnit>
}

export interface LocalizedDocument {
  root: Root
  headings: Heading[]
  // unit id → the unit to show (translated texts, source identity; the source unit where its segment falls back)
  units: Map<string, LearningUnit>
  // source segments shown in the source language
  missing: string[]
}

export interface LocalizeOptions {
  sourceLang: string
  // «not translated yet» in the reader's UI locale, and that locale
  label: string
  labelLang: string
  // the reviewed lock (`.lock.json` segments): a segment is shown translated only while the source still hashes to
  // the locked value. Needs `sourceText` (the source markdown) to hash. Absent → no lock check (tests, tools).
  lock?: Readonly<Record<string, string>>
  sourceText?: string
  // a wiki-link target that names this topic (only such links are retargeted to translated headings); default: none
  isSelf?: (target: string) => boolean
}

const clone = <T>(value: T): T => structuredClone(value)

const sameFences = (a: Root | null | undefined, b: Root | null | undefined, strict: boolean): boolean => {
  if (!a || !b) return !a === !b
  return compareFences(fencesOfRoot(a, strict), fencesOfRoot(b, strict)).length === 0
}

// Texts from the translation, identity from the source; anything structural or graded that differs keeps the source.
export function localizeUnit(source: LearningUnit, translated: LearningUnit | undefined): LearningUnit {
  if (!translated || translated.kind !== source.kind) return source
  if (source.kind === 'flashcard') {
    const tr = translated as FlashcardUnit
    // [!word] cards are target-language data
    if (source.word || !sameFences(source.answer, tr.answer, false)) return source
    return { ...source, question: tr.question, questionText: tr.questionText, answer: tr.answer, searchText: tr.searchText }
  }
  if (source.kind === 'quiz') {
    const tr = translated as QuizUnit
    if (tr.options.length !== source.options.length || tr.mode !== source.mode) return source
    // the key: every option keeps its place and its correctness
    if (tr.options.some((o, i) => o.correct !== source.options[i]!.correct)) return source
    // what the learner reasons about (code to read, «what does it print») and the explanation's code must be the same
    if (!sameFences(source.body, tr.body, false) || !sameFences(source.explanation, tr.explanation, false)) return source
    let exercise = source.exercise
    if (source.exercise?.kind === 'fill') {
      const s = source.exercise
      const t = tr.exercise
      if (t?.kind !== 'fill') return source
      const blanks = (e: typeof s) => JSON.stringify(e.segments.filter((x) => x.kind === 'blank'))
      const text = (e: typeof s) => (s.lang ? codeSkeleton({ lang: s.lang, role: 'lenient', value: e.segments.map((x) => (x.kind === 'text' ? x.value : '__')).join('') }) : '')
      if (blanks(s) !== blanks(t) || text(s) !== text(t)) return source
      exercise = { ...t, bank: s.bank }
    } else if (source.exercise?.kind === 'order') {
      // pieces keep their ids (the key is their order); code pieces must be the same code, only prose pieces translate
      const s = source.exercise
      const t = tr.exercise
      if (t?.kind !== 'order' || t.pieces.length !== s.pieces.length) return source
      const piece = (code: string) => (s.lang ? codeSkeleton({ lang: s.lang, role: 'lenient', value: code }) : '')
      if (t.pieces.some((p, i) => p.distractor !== s.pieces[i]!.distractor || piece(p.code) !== piece(s.pieces[i]!.code))) return source
      exercise = { ...s, pieces: s.pieces.map((p, i) => ({ ...p, code: t.pieces[i]!.code })) }
    } else if (tr.exercise) return source
    return {
      ...source,
      prompt: tr.prompt,
      promptText: tr.promptText,
      body: tr.body,
      explanation: tr.explanation,
      options: source.options.map((o, i) => ({ ...o, content: tr.options[i]!.content })),
      exercise,
      searchText: tr.searchText,
    }
  }
  const tr = translated as TaskUnit
  const src = source as TaskUnit
  const lang = src.code?.lang ?? 'js'
  // a task is code end to end: starter, tests, statement examples, hints and the reference — only comments and test
  // titles may differ, otherwise the whole task stays in the source language
  if (Boolean(src.code) !== Boolean(tr.code)) return src
  if (src.code && tr.code && !(sameTaskCode(src.code.starter, tr.code.starter, lang) && sameTaskCode(src.code.tests, tr.code.tests, lang))) return src
  if (tr.hints.length !== src.hints.length || tr.hints.some((h, i) => !sameFences(src.hints[i], h, true))) return src
  if (!sameFences(src.solution, tr.solution, true) || !sameFences(src.statement, tr.statement, true)) return src
  return {
    ...src,
    title: tr.title,
    titleText: tr.titleText,
    statement: tr.statement,
    hints: tr.hints,
    solution: tr.solution,
    code: src.code && tr.code ? { ...src.code, starter: tr.code.starter, tests: tr.code.tests } : src.code,
    searchText: tr.searchText,
  }
}

function setHeadingId(node: RootContent, slug: string, extra: Record<string, string> = {}): RootContent {
  if (node.type !== 'heading') return node
  return { ...node, data: { ...node.data, hProperties: { ...(node.data?.hProperties as Record<string, unknown> | undefined), id: slug, ...extra } } }
}

const headingDepths = (root: Root) => root.children.flatMap((n) => (n.type === 'heading' ? [n.depth] : []))

const unitIdsIn = (nodes: readonly RootContent[]): string[] => {
  const out: string[] = []
  for (const n of nodes) visit(n, 'unitRef', (r: UnitRef) => void out.push(r.unitId))
  return out
}

// null: the translation's headings don't line up with the source (a missing / extra / re-levelled heading) — the
// caller shows the source page. Otherwise per segment; a section whose blocks don't line up falls back whole.
export function localizeDocument(source: LocalizableDocument, translated: LocalizableDocument, opts: LocalizeOptions): LocalizedDocument | null {
  // headings are matched by position: their depth sequence must be the source's, or every anchor could shift
  if (headingDepths(source.root).join(',') !== headingDepths(translated.root).join(',')) return null
  const slugs = headingSlugs(source.root)
  const srcSegs = segmentRoot(source.root, opts.sourceText !== undefined ? { source: opts.sourceText } : {})
  const trList = segmentRoot(translated.root, { headingSlugs: slugs })
  const trSegs = new Map(trList.map((s) => [s.id, s]))

  // per section, the translation's blocks must be the source's in order (a missing tail is fine: it falls back)
  const bySection = (segs: readonly Segment[]) => {
    const m = new Map<string, string[]>()
    for (const s of segs) if (s.kind !== 'heading') m.set(s.section, [...(m.get(s.section) ?? []), `${s.id}:${s.signature}`])
    return m
  }
  const srcSections = bySection(srcSegs)
  const trSections = bySection(trList)
  const brokenSections = new Set<string>()
  for (const [section, tr] of trSections) {
    const src = srcSections.get(section) ?? []
    if (tr.length > src.length || tr.some((x, i) => x !== src[i])) brokenSections.add(section)
  }

  // anchors: a translated heading keeps its source slug, so links into the page (TOC, other topics, cards) still land;
  // a link of this topic to its own translated heading is pointed at that slug too.
  const srcHeadingText = new Map<string, string>()
  source.headings.forEach((h) => srcHeadingText.set(h.slug, h.text))
  const anchor = new Map<string, string>()
  translated.root.children
    .filter((n) => n.type === 'heading')
    .forEach((n, i) => {
      const own = headingSlugOf(n)
      const target = slugs[i]
      if (own && target) anchor.set(own, target)
    })
  const isSelf = opts.isSelf ?? (() => false)

  const children: RootContent[] = []
  const missing: string[] = []
  const shown = new Set<string>()
  const bySourceIndex = new Map<number, Segment>()
  for (const s of srcSegs) bySourceIndex.set(s.nodes[0]!, s)
  const covered = new Set(srcSegs.flatMap((s) => s.nodes))
  const translatedHeadings = new Map<string, string>()

  source.root.children.forEach((node, index) => {
    const seg = bySourceIndex.get(index)
    if (!seg) {
      if (!covered.has(index)) children.push(node)
      return
    }
    const tr = trSegs.get(seg.id)
    const locked = !opts.lock || (seg.hash !== '' && opts.lock[seg.id] === seg.hash)
    const ok = tr && tr.signature === seg.signature && tr.kind === seg.kind && locked && (seg.kind === 'heading' || !brokenSections.has(seg.section))
    if (ok) {
      const nodes = tr.nodes.map((i) => clone(translated.root.children[i]!))
      for (const n of nodes) retargetLinks(n, anchor, srcHeadingText, isSelf)
      for (const id of unitIdsIn(nodes)) shown.add(id)
      if (seg.kind === 'heading') {
        const slug = headingSlugOf(node)!
        children.push(setHeadingId(nodes[0]!, slug))
        translatedHeadings.set(slug, translated.headings.find((h) => h.slug === headingSlugOf(nodes[0]!))?.text ?? srcHeadingText.get(slug) ?? '')
      } else children.push(...nodes)
      return
    }
    const nodes = seg.nodes.map((i) => source.root.children[i]!)
    missing.push(seg.id)
    // an untranslated heading stays a heading (the TOC and anchors need it), marked by its lang only
    if (seg.kind === 'heading') children.push(setHeadingId(nodes[0]!, headingSlugOf(node)!, { lang: opts.sourceLang }))
    else children.push({ type: 'i18nFallback', lang: opts.sourceLang, label: opts.label, labelLang: opts.labelLang, children: nodes as never })
  })

  // an exercise is translated only where its block is shown translated; in a fallback block it is the source's
  const units = new Map<string, LearningUnit>()
  for (const [id, unit] of source.units) units.set(id, shown.has(id) ? localizeUnit(unit, translated.units.get(id)) : unit)
  const headings = source.headings.map((h) => ({ ...h, text: translatedHeadings.get(h.slug) || h.text }))
  return { root: { type: 'root', children }, headings, units, missing }
}

// `[[#Translated heading]]` / `[[This topic#Translated heading|…]]` → the source heading the translated one stands
// for (kept source-language anchors resolve as they are; links to OTHER topics are never touched).
function retargetLinks(node: RootContent, anchor: ReadonlyMap<string, string>, srcHeadingText: ReadonlyMap<string, string>, isSelf: (target: string) => boolean) {
  visit(node, 'wikiLink', (link: WikiLink) => {
    if (!link.heading) return
    if (link.target && !isSelf(link.target)) return
    const own = headingSlug(link.heading)
    if (srcHeadingText.has(own)) return
    const target = anchor.get(own)
    const text = target ? srcHeadingText.get(target) : undefined
    if (!text) return
    if (!link.alias) link.alias = link.target ? null : link.heading
    link.heading = text
  })
}
