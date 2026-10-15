import type { PhrasingContent } from 'mdast'
import { toString } from 'mdast-util-to-string'
import type { Chapter, ContentIssue, FlashcardUnit, LearningUnit } from '../model'
import { parseMarkdown, toLevel } from '../parse/markdown'
import { normalizeForId } from '../ids'

export interface QuestionJsonEntry {
  id: string
  chapter: string | null
  level: string | null
  frequency: string | null
  type: string | null
  question: string
  answer: string
}

function str(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

export function parseQuestionsJson(text: string): { entries: QuestionJsonEntry[]; error: string | null } {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch (error) {
    return { entries: [], error: error instanceof Error ? error.message : String(error) }
  }
  const list = Array.isArray(data) ? data : data && typeof data === 'object' && Array.isArray((data as { questions?: unknown }).questions) ? (data as { questions: unknown[] }).questions : null
  if (!list) return { entries: [], error: 'Очікується масив питань' }
  const entries: QuestionJsonEntry[] = []
  for (const raw of list) {
    if (!raw || typeof raw !== 'object') continue
    const r = raw as Record<string, unknown>
    const id = str(r.id)
    const question = str(r.question)
    const answer = str(r.answer)
    if (!id || !question || !answer) continue
    entries.push({ id, chapter: str(r.chapter), level: str(r.level), frequency: str(r.frequency), type: str(r.type), question, answer })
  }
  return { entries, error: null }
}

function matchChapter(label: string | null, chapters: readonly Chapter[]): Chapter | null {
  if (!label) return null
  const number = /^(\d{1,3})/.exec(label.trim())
  const title = normalizeForId(label.replace(/^\d{1,3}[.\s_-]*/, ''))
  const candidates = chapters.filter((c) => c.kind !== 'index')
  if (title) {
    const byTitle = candidates.find((c) => normalizeForId(c.title) === title)
    if (byTitle) return byTitle
  }
  if (number) {
    const n = Number(number[1])
    const byNumber = candidates.find((c) => c.number === n)
    if (byNumber) return byNumber
  }
  return null
}

export function jsonUnits(
  entries: readonly QuestionJsonEntry[],
  guideId: string,
  chapters: readonly Chapter[],
  existing: ReadonlySet<string>,
  fallbackChapterId: string,
  path: string,
): { units: LearningUnit[]; issues: ContentIssue[] } {
  const units: LearningUnit[] = []
  const issues: ContentIssue[] = []
  for (const entry of entries) {
    if (existing.has(entry.id)) continue
    const chapter = matchChapter(entry.chapter, chapters)
    if (!chapter && entry.chapter) {
      issues.push({ severity: 'warning', code: 'broken-link', path, message: `Розділ «${entry.chapter}» для ${entry.id} не знайдено` })
    }
    const questionRoot = parseMarkdown(entry.question).root
    const first = questionRoot.children[0]
    const question: PhrasingContent[] = first && first.type === 'paragraph' ? first.children : [{ type: 'text', value: entry.question }]
    const answer = parseMarkdown(entry.answer).root
    const unit: FlashcardUnit = {
      id: entry.id,
      kind: 'flashcard',
      guideId,
      chapterId: chapter?.id ?? fallbackChapterId,
      sectionSlug: null,
      level: toLevel(entry.level),
      tags: [],
      idSource: 'explicit',
      frequency: entry.frequency,
      qtype: entry.type ? entry.type.toLowerCase() : null,
      question,
      questionText: entry.question,
      answer,
      origin: 'json',
      searchText: `${entry.question}\n${toString(answer)}`,
    }
    units.push(unit)
  }
  return { units, issues }
}
