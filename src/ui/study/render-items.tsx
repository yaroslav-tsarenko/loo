import 'server-only'
import { Fragment, type ReactNode } from 'react'
import { gradedQuiz, type ExerciseView } from '@/content/blocks/quiz/view'
import { DIFFICULTY_LABEL, LEVEL_LABEL, type LearningUnit, type QuizMode, type TaskCode } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { previewIntervals } from '@/progress/srs'
import { srsMap, taskStates } from '@/server/services/queue'
import { unitLabel } from '@/server/services/units-sync'
import { renderPhrasing } from '@/ui/markdown/UnitBlock'
import { renderMdast, type RenderEnv } from '@/ui/markdown/render'
import { chapterHref } from '@/ui/routes'

interface ItemBase {
  unitId: string
  label: string
  level: string | null
  chapterTitle: string
  chapterHref: string
}

export interface FlashItem extends ItemBase {
  kind: 'flashcard'
  meta: string[]
  question: ReactNode
  answer: ReactNode
  intervals: { again: number; hard: number; good: number }
}

// A graded quiz as the client sees it: no answer key (no `correct` flags, free answer, piece order or blank answers),
// no explanation — the server's answerQuiz returns those after the answer (src/server/actions/answers.ts).
export interface QuizItem extends ItemBase {
  kind: 'quiz'
  mode: QuizMode
  multi: boolean
  free: boolean
  prompt: ReactNode
  body: ReactNode
  options: Array<{ id: string; content: ReactNode }>
  exercise: ExerciseView | null
}

export interface TaskItem extends ItemBase {
  kind: 'task'
  title: ReactNode
  difficulty: string
  difficultyKey: 'easy' | 'medium' | 'hard'
  statement: ReactNode
  hints: ReactNode[]
  solution: ReactNode
  draft: string
  hintsRevealed: number
  code: TaskCode | null
}

export type StudyItem = FlashItem | QuizItem | TaskItem

export async function renderStudyItems(snapshot: ContentSnapshot, ids: readonly string[], now = Date.now()): Promise<StudyItem[]> {
  const units = ids.map((id) => snapshot.units.get(id)).filter((u): u is LearningUnit => Boolean(u))
  const cards = await srsMap(units.filter((u) => u.kind === 'flashcard').map((u) => u.id))
  const tasks = await taskStates(units.filter((u) => u.kind === 'task').map((u) => u.id))
  return Promise.all(
    units.map(async (unit): Promise<StudyItem> => {
      const chapter = snapshot.chapters.get(unit.chapterId)!
      const env: RenderEnv = { snapshot, chapter, depth: 0, variant: 'card' }
      const base: ItemBase = {
        unitId: unit.id,
        label: unitLabel(unit),
        level: unit.level ? LEVEL_LABEL[unit.level] : null,
        chapterTitle: chapter.kind === 'index' ? snapshot.guideById.get(chapter.guideId)?.title ?? chapter.title : chapter.title,
        chapterHref: `${chapterHref(snapshot, chapter)}#u-${unit.id}`,
      }
      if (unit.kind === 'flashcard') {
        const [question, answer] = await Promise.all([renderPhrasing(unit.question, env), renderMdast(unit.answer, env)])
        return {
          ...base,
          kind: 'flashcard',
          meta: [unit.frequency, unit.qtype].filter((v): v is string => Boolean(v)),
          question,
          answer,
          intervals: previewIntervals(cards.get(unit.id) ?? null, now),
        }
      }
      if (unit.kind === 'quiz') {
        const [prompt, body, ...options] = await Promise.all([
          renderPhrasing(unit.prompt, env),
          unit.body.children.length > 0 ? renderMdast(unit.body, env) : Promise.resolve(null),
          ...unit.options.map((o) => renderPhrasing(o.content, env)),
        ])
        const payload = gradedQuiz(unit)
        return {
          ...base,
          kind: 'quiz',
          mode: payload.mode,
          multi: payload.multi,
          free: payload.free,
          prompt,
          body,
          options: payload.optionIds.map((id, i) => ({ id, content: options[i] })),
          exercise: payload.exercise,
        }
      }
      const [title, statement, solution, ...hints] = await Promise.all([
        renderPhrasing(unit.title, env),
        renderMdast(unit.statement, env),
        unit.solution ? renderMdast(unit.solution, env) : Promise.resolve(null),
        ...unit.hints.map((h) => renderMdast(h, env)),
      ])
      const state = tasks.get(unit.id)
      return {
        ...base,
        kind: 'task',
        title,
        difficulty: DIFFICULTY_LABEL[unit.difficulty],
        difficultyKey: unit.difficulty,
        statement,
        hints: hints.map((h, i) => <Fragment key={i}>{h}</Fragment>),
        solution,
        draft: state?.draft ?? '',
        hintsRevealed: 0,
        code: unit.code,
      }
    }),
  )
}
