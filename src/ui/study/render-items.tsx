import 'server-only'
import { Fragment, type ReactNode } from 'react'
import { gradedQuiz, type ExerciseView } from '@/content/blocks/quiz/view'
import { DIFFICULTY_LABEL, type LearningUnit, type QuizMode, type TaskCode } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { previewIntervals } from '@/progress/srs'
import { speechLangFor } from '@/server/courses/target'
import { userScope } from '@/server/auth'
import { srsMapIn, taskStatesIn } from '@/server/services/queue'
import { unitLabel } from '@/server/services/units-sync'
import { renderPhrasing } from '@/ui/markdown/UnitBlock'
import { renderMdast, type RenderEnv } from '@/ui/markdown/render'
import { ListenExercise } from '@/ui/lang/ListenExercise'
import { PairAudio, PairOption } from '@/ui/lang/PairExercise'
import type { SpeakView } from '@/ui/lang/SpeakExercise'
import { WordBack, WordFront } from '@/ui/lang/WordCard'
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
  // language blocks: the spoken language and, for [!speak], the phrase (public — it's what the learner reads aloud)
  lang: string | null
  speak: SpeakView | null
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
  // placement bank items (`_placement/`) render here too: only the placement page asks for them
  const units = ids.map((id) => snapshot.units.get(id) ?? snapshot.placementUnits.get(id)).filter((u): u is LearningUnit => Boolean(u))
  // card schedules and task states: one transaction, one round trip
  const [cards, tasks] = await userScope((db, userId) =>
    Promise.all([srsMapIn(db, userId, units.filter((u) => u.kind === 'flashcard').map((u) => u.id)), taskStatesIn(db, userId, units.filter((u) => u.kind === 'task').map((u) => u.id))]),
  )
  return Promise.all(
    units.map(async (unit): Promise<StudyItem> => {
      const bankChapter = snapshot.placementChapters.get(unit.chapterId)
      const chapter = snapshot.chapters.get(unit.chapterId) ?? bankChapter!
      const env: RenderEnv = { snapshot, chapter, depth: 0, variant: 'card' }
      const base: ItemBase = {
        unitId: unit.id,
        label: unitLabel(unit),
        // raw level id; LevelPill renders its tag
        level: unit.level ?? null,
        chapterTitle: chapter.kind === 'index' ? snapshot.guideById.get(chapter.guideId)?.title ?? chapter.title : chapter.title,
        // the bank is no article: nothing to link to
        chapterHref: bankChapter ? '' : `${chapterHref(snapshot, chapter)}#u-${unit.id}`,
      }
      if (unit.kind === 'flashcard' && unit.word) {
        const lang = await speechLangFor(unit)
        return {
          ...base,
          kind: 'flashcard',
          meta: ['слово'],
          question: <WordFront word={unit.word} lang={lang} />,
          answer: <WordBack word={unit.word} lang={lang} />,
          intervals: previewIntervals(cards.get(unit.id) ?? null, now),
        }
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
        const lang = unit.listen || unit.pair || unit.speak ? await speechLangFor(unit) : null
        // listening / minimal pairs: the audio is fetched on play (the transcript never ships with the item)
        const audio = unit.listen ? (
          <ListenExercise unitId={unit.id} lang={lang!} slow={unit.listen.slow} dialogue={new Set(unit.listen.lines.map((l) => l.speaker).filter(Boolean)).size > 1} />
        ) : unit.pair ? (
          <PairAudio unitId={unit.id} lang={lang!} />
        ) : null
        const pair = unit.pair
        return {
          ...base,
          kind: 'quiz',
          mode: payload.mode,
          multi: payload.multi,
          free: payload.free,
          prompt,
          body: audio ? (
            <>
              {audio}
              {body}
            </>
          ) : (
            body
          ),
          options: payload.optionIds.map((id, i) => ({ id, content: pair ? <PairOption word={pair.words[i]!.word} ipa={pair.words[i]!.ipa} lang={lang!} /> : options[i] })),
          exercise: payload.exercise,
          lang,
          speak: unit.speak ? { text: unit.speak.text, ipa: unit.speak.ipa, ipaUs: unit.speak.ipaUs, translation: unit.speak.translation, slow: unit.speak.slow } : null,
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
