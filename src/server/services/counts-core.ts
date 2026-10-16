import type { LearningUnit } from '@/content/model'
import { DUE_KEY, LISTEN_KEY, MISTAKES_KEY, PRON_KEY, TASKS_KEY, WORDS_KEY } from '@/ui/shell/constants'

// Practice badges, scoped to the active course (framework-free for unit tests; I/O in ./counts.ts).

export interface PracticeRows {
  // unit ids of due SRS cards, open mistakes and tasks in progress (task_state.status = 'open')
  due: readonly string[]
  mistakes: readonly string[]
  tasks: readonly string[]
}

interface Has {
  has(id: string): boolean
}

// exists: units still in the content store; pool: exercise ids of the active course (null = no course → everything).
export function practiceCounts(rows: PracticeRows, exists: Has, pool: Has | null): Record<string, number> {
  const count = (ids: readonly string[]) => ids.filter((id) => exists.has(id) && (!pool || pool.has(id))).length
  return { [DUE_KEY]: count(rows.due), [MISTAKES_KEY]: count(rows.mistakes), [TASKS_KEY]: count(rows.tasks) }
}

// Language practice badges (docs/LANGUAGE_COURSE.md): due [!word] cards («Слова»), open mistakes in listening items
// («Аудіювання») and in minimal pairs («Вимова»). [!speak] misses are never recorded, so they never show up here.
export function languageCounts(rows: Pick<PracticeRows, 'due' | 'mistakes'>, units: ReadonlyMap<string, LearningUnit>, pool: Has | null): Record<string, number> {
  const count = (ids: readonly string[], test: (u: LearningUnit) => boolean) =>
    ids.filter((id) => {
      const u = units.get(id)
      return u !== undefined && (!pool || pool.has(id)) && test(u)
    }).length
  return {
    [WORDS_KEY]: count(rows.due, (u) => u.kind === 'flashcard' && u.word !== undefined),
    [LISTEN_KEY]: count(rows.mistakes, (u) => u.kind === 'quiz' && u.mode === 'listen'),
    [PRON_KEY]: count(rows.mistakes, (u) => u.kind === 'quiz' && u.mode === 'pair'),
  }
}
