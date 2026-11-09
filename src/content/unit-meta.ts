import type { LearningUnit, UnitMeta } from './model'
import { unitLabel } from './unit-label'

export function unitMeta(unit: LearningUnit): UnitMeta {
  const base = { id: unit.id, guideId: unit.guideId, chapterId: unit.chapterId, level: unit.level, idSource: unit.idSource, label: unitLabel(unit), ...(unit.kind !== 'task' && unit.lang ? { lang: unit.lang } : {}) }
  if (unit.kind === 'flashcard') return { ...base, kind: 'flashcard', frequency: unit.frequency, qtype: unit.qtype, hasWord: Boolean(unit.word) }
  if (unit.kind === 'quiz') return { ...base, kind: 'quiz', mode: unit.mode }
  return { ...base, kind: 'task', difficulty: unit.difficulty, hasTests: Boolean(unit.code?.tests) }
}
