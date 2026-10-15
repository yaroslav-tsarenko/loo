import MiniSearch from 'minisearch'
import { LEVEL_LABEL } from './model'
import type { ContentSnapshot } from './store'

export interface SearchDoc {
  id: string
  type: 'chapter' | 'flashcard' | 'quiz' | 'task'
  title: string
  context: string
  text: string
  chapterId: string
  guideId: string
}

export interface SearchHit {
  id: string
  type: SearchDoc['type']
  title: string
  context: string
  chapterId: string
  guideId: string
  score: number
}

const APOSTROPHES = /[ʼ'’`]/g

export function normalizeTerm(term: string): string | null {
  const t = term.toLowerCase().replace(APOSTROPHES, '').replace(/ґ/g, 'г')
  return t.length > 0 ? t : null
}

const indexes = new WeakMap<ContentSnapshot, MiniSearch<SearchDoc>>()

function build(snapshot: ContentSnapshot): MiniSearch<SearchDoc> {
  const mini = new MiniSearch<SearchDoc>({
    fields: ['title', 'text'],
    storeFields: ['type', 'title', 'context', 'chapterId', 'guideId'],
    processTerm: normalizeTerm,
    searchOptions: { boost: { title: 3 }, prefix: true, fuzzy: 0.18, combineWith: 'AND', processTerm: normalizeTerm },
  })
  const docs: SearchDoc[] = []
  for (const chapter of snapshot.chapters.values()) {
    const guide = snapshot.guideById.get(chapter.guideId)
    docs.push({
      id: `c:${chapter.id}`,
      type: 'chapter',
      title: chapter.kind === 'index' ? guide?.title ?? chapter.title : chapter.title,
      context: guide?.title ?? '',
      text: (snapshot.plainText.get(chapter.id) ?? '').slice(0, 60_000),
      chapterId: chapter.id,
      guideId: chapter.guideId,
    })
  }
  for (const unit of snapshot.units.values()) {
    const chapter = snapshot.chapters.get(unit.chapterId)
    const title = unit.kind === 'flashcard' ? unit.questionText : unit.kind === 'quiz' ? unit.promptText : unit.titleText
    docs.push({
      id: `u:${unit.id}`,
      type: unit.kind,
      title: unit.kind === 'quiz' && title === 'Що виведе код?' ? `${title} (${unit.id})` : title,
      context: [chapter?.title, unit.level ? LEVEL_LABEL[unit.level] : null].filter(Boolean).join(' · '),
      text: unit.searchText.slice(0, 4000),
      chapterId: unit.chapterId,
      guideId: unit.guideId,
    })
  }
  mini.addAll(docs)
  return mini
}

export function searchContent(snapshot: ContentSnapshot, query: string, limit = 24): SearchHit[] {
  const q = query.trim()
  if (!q) return []
  let mini = indexes.get(snapshot)
  if (!mini) {
    mini = build(snapshot)
    indexes.set(snapshot, mini)
  }
  let results = mini.search(q)
  if (results.length === 0) results = mini.search(q, { combineWith: 'OR' })
  return results.slice(0, limit).map((r) => ({
    id: String(r.id),
    type: r.type as SearchDoc['type'],
    title: String(r.title),
    context: String(r.context),
    chapterId: String(r.chapterId),
    guideId: String(r.guideId),
    score: r.score,
  }))
}
