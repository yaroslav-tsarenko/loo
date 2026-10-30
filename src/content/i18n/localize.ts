import type { Root, RootContent } from 'mdast'
import { visit } from 'unist-util-visit'
import type { FlashcardUnit, Heading, LearningUnit, QuizUnit, TaskUnit } from '../model'
import type { WikiLink } from '../parse/nodes'
import { headingSlug } from '../render/to-hast'
import { sameTaskCode } from './code'
import { headingSlugOf, headingSlugs, segmentRoot, type Segment } from './segments'

// A topic page in another language (docs/COURSE_FORMAT.md «Переклад курсів (i18n)»): the SOURCE document's structure,
// each segment taken from the translation when it has it, otherwise from the source inside an «not translated yet»
// marker. Exercises keep their source identity — id, option ids, correct flags, answers — and take only their texts
// from the translation, so grading, progress and SRS are the same in every language. Pure.

export interface LocalizableDocument {
  root: Root
  headings: Heading[]
  units: ReadonlyMap<string, LearningUnit>
}

export interface LocalizedDocument {
  root: Root
  headings: Heading[]
  // unit id → the unit to show (translated texts, source identity)
  units: Map<string, LearningUnit>
  // source segments shown in the source language
  missing: string[]
}

export interface LocalizeOptions {
  sourceLang: string
  // «not translated yet» in the reader's UI locale, and that locale
  label: string
  labelLang: string
}

const clone = <T>(value: T): T => structuredClone(value)

// Texts from the translation, identity from the source; anything structural that differs keeps the source.
export function localizeUnit(source: LearningUnit, translated: LearningUnit | undefined): LearningUnit {
  if (!translated || translated.kind !== source.kind) return source
  if (source.kind === 'flashcard') {
    const tr = translated as FlashcardUnit
    // [!word] cards are target-language data
    if (source.word) return source
    return { ...source, question: tr.question, questionText: tr.questionText, answer: tr.answer, searchText: tr.searchText }
  }
  if (source.kind === 'quiz') {
    const tr = translated as QuizUnit
    if (tr.options.length !== source.options.length || tr.mode !== source.mode) return source
    let exercise = source.exercise
    if (source.exercise?.kind === 'fill' && tr.exercise?.kind === 'fill') {
      const a = source.exercise.segments.filter((s) => s.kind === 'blank')
      const b = tr.exercise.segments.filter((s) => s.kind === 'blank')
      if (JSON.stringify(a) === JSON.stringify(b)) exercise = { ...tr.exercise, bank: source.exercise.bank }
    } else if (source.exercise?.kind === 'order' && tr.exercise?.kind === 'order') {
      // pieces keep their ids (the key is their order), only the text is the translation's
      const s = source.exercise
      const t = tr.exercise
      if (t.pieces.length === s.pieces.length && t.pieces.every((p, i) => p.distractor === s.pieces[i]!.distractor)) exercise = { ...s, pieces: s.pieces.map((p, i) => ({ ...p, code: t.pieces[i]!.code })) }
    }
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
  const code = src.code && tr.code && sameTaskCode(src.code.starter, tr.code.starter, lang) && sameTaskCode(src.code.tests, tr.code.tests, lang) ? { ...src.code, starter: tr.code.starter, tests: tr.code.tests } : src.code
  return {
    ...src,
    title: tr.title,
    titleText: tr.titleText,
    statement: tr.statement,
    hints: tr.hints.length === src.hints.length ? tr.hints : src.hints,
    solution: tr.solution ?? src.solution,
    code,
    searchText: tr.searchText,
  }
}

function setHeadingId(node: RootContent, slug: string, extra: Record<string, string> = {}): RootContent {
  if (node.type !== 'heading') return node
  return { ...node, data: { ...node.data, hProperties: { ...(node.data?.hProperties as Record<string, unknown> | undefined), id: slug, ...extra } } }
}

export function localizeDocument(source: LocalizableDocument, translated: LocalizableDocument, opts: LocalizeOptions): LocalizedDocument {
  const slugs = headingSlugs(source.root)
  const srcSegs = segmentRoot(source.root)
  const trSegs = new Map(segmentRoot(translated.root, { headingSlugs: slugs }).map((s) => [s.id, s]))

  // anchors: a translated heading keeps its source slug, so links into the page (TOC, other topics, cards) still land;
  // a translated link to a translated heading is pointed at that slug too.
  const trHeadingNodes = translated.root.children.filter((n) => n.type === 'heading')
  const srcHeadingText = new Map<string, string>()
  source.headings.forEach((h) => srcHeadingText.set(h.slug, h.text))
  const anchor = new Map<string, string>()
  trHeadingNodes.forEach((n, i) => {
    const own = headingSlugOf(n)
    const target = slugs[i]
    if (own && target) anchor.set(own, target)
  })

  const children: RootContent[] = []
  const missing: string[] = []
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
    const ok = tr && tr.signature === seg.signature && tr.kind === seg.kind
    if (ok) {
      const nodes = tr.nodes.map((i) => clone(translated.root.children[i]!))
      for (const n of nodes) retargetLinks(n, anchor, srcHeadingText)
      if (seg.kind === 'heading') {
        const slug = headingSlugOf(node)!
        children.push(setHeadingId(nodes[0]!, slug))
        translatedHeadings.set(slug, (translated.headings.find((h) => h.slug === headingSlugOf(nodes[0]!))?.text ?? null) ?? srcHeadingText.get(slug) ?? '')
      } else children.push(...nodes)
      return
    }
    const nodes = seg.nodes.map((i) => source.root.children[i]!)
    missing.push(seg.id)
    // an untranslated heading stays a heading (the TOC and anchors need it), marked by its lang only
    if (seg.kind === 'heading') children.push(setHeadingId(nodes[0]!, headingSlugOf(node)!, { lang: opts.sourceLang }))
    else children.push({ type: 'i18nFallback', lang: opts.sourceLang, label: opts.label, labelLang: opts.labelLang, children: nodes as never })
  })

  const units = new Map<string, LearningUnit>()
  for (const [id, unit] of source.units) units.set(id, localizeUnit(unit, translated.units.get(id)))
  const headings = source.headings.map((h) => ({ ...h, text: translatedHeadings.get(h.slug) || h.text }))
  return { root: { type: 'root', children }, headings, units, missing }
}

// `[[#Translated heading]]` / `[[Topic#Translated heading|…]]` inside the translation → the source heading the
// translated one stands for (kept source-language anchors resolve as they are).
function retargetLinks(node: RootContent, anchor: ReadonlyMap<string, string>, srcHeadingText: ReadonlyMap<string, string>) {
  visit(node, 'wikiLink', (link: WikiLink) => {
    if (!link.heading) return
    const own = headingSlug(link.heading)
    if (srcHeadingText.has(own)) return
    const target = anchor.get(own)
    const text = target ? srcHeadingText.get(target) : undefined
    if (!text) return
    if (!link.alias) link.alias = link.target ? null : link.heading
    link.heading = text
  })
}
