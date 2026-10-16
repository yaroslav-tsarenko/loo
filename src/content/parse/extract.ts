import GithubSlugger from 'github-slugger'
import type { Heading as MdHeading, Root, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'
import { visit } from 'unist-util-visit'
import { renderBlockFor, unitDefinitionFor } from '../blocks/registry'
import { levelFromHeading } from '../blocks/meta'
import { exerciseProblems } from '../blocks/quiz/exercise'
import { taskCodeProblems } from '../blocks/task/code'
import type { ExtractContext } from '../blocks/types'
import { unitHashId } from '../ids'
import type { ChapterMeta, ContentIssue, FlashcardUnit, Heading, Level, LearningUnit } from '../model'
import type { Callout, WikiLink } from './nodes'

export interface ExtractInput {
  root: Root
  meta: ChapterMeta
  guideId: string
  chapterId: string
  path: string
  fileName: string
}

export interface ExtractResult {
  root: Root
  h1: string | null
  headings: Heading[]
  units: LearningUnit[]
  links: WikiLink[]
  tags: string[]
  issues: ContentIssue[]
  wordCount: number
  codeBlocks: number
  languages: Map<string, number>
}

const EMOJI = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu
const SKIP_QA_HEADINGS = /^(джерела|зміст|пов[ʼ'’]?язан|related|sources|посилання)/i
export const QA_FILE = /(q\s*&\s*a|interview|співбесід)/i

function headingText(node: MdHeading): string {
  return toString(node).trim()
}

function stripNumber(text: string): string {
  return text.replace(/^\d+[.)]\s+/, '').trim()
}

export function extractFile(input: ExtractInput): ExtractResult {
  const { root, meta, guideId, chapterId, path } = input
  const issues: ContentIssue[] = []
  const slugger = new GithubSlugger()
  const headings: Heading[] = []
  let h1: string | null = null
  const tags = new Set(meta.tags)
  const links: WikiLink[] = []
  let codeBlocks = 0
  let words = 0
  const languages = new Map<string, number>()

  const firstContent = root.children[0]
  if (firstContent?.type === 'heading' && firstContent.depth === 1) {
    h1 = headingText(firstContent)
    root.children.shift()
  }

  visit(root, (node) => {
    if (node.type === 'heading') {
      const headingLevel = levelFromHeading(headingText(node))
      if (headingLevel) {
        for (const child of node.children) if (child.type === 'text') child.value = child.value.replace(EMOJI, '').replace(/^\s+/, '')
      }
      const text = headingText(node)
      const slug = slugger.slug(text)
      node.data = { ...node.data, hProperties: headingLevel ? { id: slug, dataLevel: headingLevel } : { id: slug } }
      if (node.depth >= 2 && node.depth <= 3) headings.push({ depth: node.depth, text, slug })
      if (node.depth === 1 && !h1) h1 = text
    } else if (node.type === 'wikiLink') {
      links.push(node)
    } else if (node.type === 'tag') {
      tags.add(node.value)
    } else if (node.type === 'code') {
      codeBlocks++
      if (node.lang) languages.set(node.lang, (languages.get(node.lang) ?? 0) + 1)
    } else if (node.type === 'text') {
      words += node.value.split(/\s+/).filter(Boolean).length
    }
  })

  const units: LearningUnit[] = []
  const seen = new Set<string>()
  const resolveId = (explicit: string | null, basis: string) => {
    if (explicit) return { id: explicit, source: 'explicit' as const }
    let id = unitHashId(guideId, path, basis)
    while (seen.has(id)) id = unitHashId(guideId, path, `${basis}#${id}`)
    seen.add(id)
    issues.push({ severity: 'warning', code: 'missing-id', path, message: `Немає id: «${basis.split('\n')[0]!.slice(0, 80)}» → ${id}` })
    return { id, source: 'hash' as const }
  }

  const report = (severity: 'warning' | 'error', message: string) => {
    issues.push({ severity, code: severity === 'error' ? 'exercise-invalid' : 'block-warning', path, message })
  }

  let sectionSlug: string | null = null
  let level: Level | null = meta.level ?? null
  let levelDepth = 7

  const walk = (children: RootContent[]) => {
    for (let i = 0; i < children.length; i++) {
      const node = children[i]!
      if (node.type === 'heading') {
        const slug = (node.data?.hProperties as { id?: string } | undefined)?.id ?? null
        if (node.depth === 2) sectionSlug = slug
        if (node.depth <= 3) {
          const found = levelFromHeading(headingText(node))
          if (found) {
            level = found
            levelDepth = node.depth
          } else if (node.depth <= levelDepth) {
            level = meta.level ?? null
            levelDepth = 7
          }
        }
        continue
      }
      if (node.type === 'callout') {
        const block = renderBlockFor(node.calloutType)
        if (block) {
          const { node: rendered, warnings } = block.transform(node as Callout)
          for (const message of warnings) issues.push({ severity: 'warning', code: 'unknown-block', path, message })
          children[i] = rendered
          continue
        }
        const definition = unitDefinitionFor(node.calloutType)
        if (definition) {
          const ctx: ExtractContext = { guideId, chapterId, chapterPath: path, sectionSlug, level, resolveId, report }
          const unit = definition.extract(node as Callout, ctx)
          if (unit) {
            units.push(unit)
            children[i] = { type: 'unitRef', unitId: unit.id }
            continue
          }
        }
        walk(node.children as RootContent[])
        continue
      }
      if ('children' in node && node.type !== 'paragraph' && node.type !== 'table') {
        walk(node.children as RootContent[])
      }
    }
  }
  walk(root.children)

  const qaMode = meta.kind === 'qa' || (units.length === 0 && QA_FILE.test(input.fileName))
  if (qaMode) units.push(...extractHeadingQa(root, input, resolveId))

  for (const unit of units) {
    if (unit.kind === 'quiz' && unit.options.length > 0 && !unit.options.some((o) => o.correct)) {
      issues.push({ severity: 'error', code: 'quiz-no-correct', path, message: `Тест ${unit.id} без правильної відповіді` })
    }
    if (unit.kind === 'task' && !unit.solution) {
      issues.push({ severity: 'warning', code: 'task-no-solution', path, message: `Задача ${unit.id} без рішення` })
    }
    const problems = unit.kind === 'quiz' ? exerciseProblems(unit) : unit.kind === 'task' ? taskCodeProblems(unit) : []
    for (const message of problems) issues.push({ severity: 'error', code: 'exercise-invalid', path, message })
  }

  return { root, h1, headings, units, links, tags: [...tags], issues, wordCount: words, codeBlocks, languages }
}

function extractHeadingQa(
  root: Root,
  input: ExtractInput,
  resolveId: ExtractContext['resolveId'],
): FlashcardUnit[] {
  const out: FlashcardUnit[] = []
  const fileLevel = input.meta.level ?? levelFromHeading(input.fileName)
  const children = root.children
  for (let i = 0; i < children.length; i++) {
    const node = children[i]!
    if (node.type !== 'heading' || node.depth !== 2) continue
    const questionText = stripNumber(headingText(node))
    if (!questionText || SKIP_QA_HEADINGS.test(questionText)) continue
    let end = i + 1
    while (end < children.length) {
      const next = children[end]!
      if (next.type === 'heading' && next.depth <= 2) break
      end++
    }
    const body = children.slice(i + 1, end)
    let explicit: string | null = null
    const firstBody = body[0]
    if (firstBody?.type === 'idMarker') {
      explicit = firstBody.value
      body.shift()
    }
    if (body.length === 0) continue
    const answer: Root = { type: 'root', children: body.filter((n) => n.type !== 'thematicBreak') }
    const { id, source } = resolveId(explicit, questionText)
    const slug = (node.data?.hProperties as { id?: string } | undefined)?.id ?? null
    out.push({
      id,
      kind: 'flashcard',
      guideId: input.guideId,
      chapterId: input.chapterId,
      sectionSlug: slug,
      level: fileLevel,
      tags: [],
      idSource: source,
      frequency: null,
      qtype: 'теорія',
      question: [{ type: 'text', value: questionText }],
      questionText,
      answer,
      origin: 'heading',
      searchText: `${questionText}\n${toString(answer)}`,
    })
  }
  return out
}
