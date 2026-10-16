import 'server-only'
import { FREQUENCIES, LEVEL_LABEL, LEVELS, type LearningUnit, type QuizMode, type UnitKind } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import type { Option } from '@/ui/study/FilterForm'
import type { StudyFilters } from './queue'
import { unitOrder } from './queue'

export const QUIZ_MODE_LABEL: Record<QuizMode, string> = {
  single: 'Один варіант',
  multi: 'Кілька варіантів',
  output: 'Що виведе код',
  order: 'Склади код',
  fill: 'Заповни пропуски',
  listen: 'Аудіювання',
  pair: 'Мінімальні пари',
  speak: 'Вимова',
}

function tally<T extends string>(values: Iterable<T | null>): Map<T, number> {
  const map = new Map<T, number>()
  for (const v of values) if (v) map.set(v, (map.get(v) ?? 0) + 1)
  return map
}

// pool: exercise ids of the active course (counts without a guide pick); courseGuides: guides offered in the material
// select (the active course's; null = every guide, «усі курси»). A picked guide outside them stays selectable.
export function filterOptions(snapshot: ContentSnapshot, kind: UnitKind, f: StudyFilters, pool: ReadonlySet<string> | null = null, courseGuides: ReadonlySet<string> | null = null) {
  const every = [...snapshot.units.values()].filter((u): u is LearningUnit => u.kind === kind)
  const all = pool && !f.guide ? every.filter((u) => pool.has(u.id)) : every
  const byGuide = tally(every.map((u) => u.guideId))
  const guides: Option[] = snapshot.guides
    .filter((g) => byGuide.has(g.id) && (!courseGuides || courseGuides.has(g.id) || g.id === f.guide))
    .map((g) => ({ value: g.id, label: g.title, count: byGuide.get(g.id) }))
  const inGuide = f.guide ? all.filter((u) => u.guideId === f.guide) : []
  const byChapter = tally(inGuide.map((u) => u.chapterId))
  const order = unitOrder(snapshot)
  const chapters: Option[] = [...byChapter.keys()]
    .map((id) => snapshot.chapters.get(id)!)
    .filter(Boolean)
    .sort((a, b) => (order.get(snapshot.unitsByChapter.get(a.id)?.[0]?.id ?? '') ?? 0) - (order.get(snapshot.unitsByChapter.get(b.id)?.[0]?.id ?? '') ?? 0))
    .map((c) => ({ value: c.id, label: c.kind === 'index' ? 'Без розділу' : c.title, count: byChapter.get(c.id) }))
  const scope = (f.guide ? inGuide : all).filter((u) => !f.chapter || u.chapterId === f.chapter)
  const byLevel = tally(scope.map((u) => u.level))
  const levels: Option[] = LEVELS.filter((l) => byLevel.has(l)).map((l) => ({ value: l, label: LEVEL_LABEL[l], count: byLevel.get(l) }))
  const flash = scope.filter((u) => u.kind === 'flashcard')
  const byFreq = tally(flash.map((u) => (u.kind === 'flashcard' ? u.frequency : null)))
  const frequencies: Option[] = [...FREQUENCIES].reverse().filter((q) => byFreq.has(q)).map((q) => ({ value: q, label: q, count: byFreq.get(q) }))
  const byType = tally(flash.map((u) => (u.kind === 'flashcard' ? u.qtype : null)))
  const types: Option[] = [...byType.entries()].sort((a, b) => b[1] - a[1]).map(([t, n]) => ({ value: t, label: t, count: n }))
  const byMode = tally(scope.map((u) => (u.kind === 'quiz' ? u.mode : null)))
  const quizModes: Option[] = (Object.keys(QUIZ_MODE_LABEL) as QuizMode[]).filter((m) => byMode.has(m)).map((m) => ({ value: m, label: QUIZ_MODE_LABEL[m], count: byMode.get(m) }))
  return { guides, chapters, levels, frequencies, types, quizModes, scope }
}
