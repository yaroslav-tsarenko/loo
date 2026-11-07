import type { FillExercise, OrderExercise, QuizExercise, QuizMode, QuizUnit } from '../../model'
import { dictationMatches } from '../lang/grade'
import { blankMatches } from './exercise'
import { isFreeQuiz, normalizeFreeAnswer, type QuizAnswer } from './grade'

// What a quiz looks like on the client. In graded contexts (lessons, tests, exams, placement, feed, study sessions)
// the client gets the view only — no `correct` flags, no free answer, no piece order, no blank answers — and asks the
// server (answerQuiz) for the verdict. Article quizzes are practice: they also ship the key for instant feedback.

export interface OrderView {
  kind: 'order'
  lang: string | null
  // shuffled on the server per render; ids are positions in this list (they say nothing about the answer)
  pieces: Array<{ id: string; code: string }>
  distractors: boolean
}

export type FillViewSegment = { kind: 'text'; value: string } | { kind: 'blank'; id: string; width: number }

export interface FillView {
  kind: 'fill'
  lang: string | null
  segments: FillViewSegment[]
  // shuffled word bank, or null for free inputs
  bank: string[] | null
}

export type ExerciseView = OrderView | FillView

// The answer key, revealed after answering (or shipped up front for practice quizzes).
export interface QuizKey {
  // right option ids (single / multi / output with options)
  options: string[]
  // canonical answer of a free «what does it print» quiz
  free: string | null
  // order: the right pieces' code, in order
  order: string[] | null
  // fill: accepted answers per blank, in order
  blanks: string[][] | null
  // dictation ([!listen]): other accepted transcriptions
  accept?: string[]
}

export interface QuizShape {
  mode: QuizMode
  multi: boolean
  free: boolean
}

export function quizShape(unit: QuizUnit): QuizShape {
  return { mode: unit.mode, multi: unit.mode === 'multi' || unit.options.filter((o) => o.correct).length > 1, free: isFreeQuiz(unit) }
}

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

// Width hint for a blank, rounded up so it doesn't reveal the exact answer length.
const blankWidth = (answers: readonly string[]) => Math.ceil((Math.max(3, ...answers.map((a) => a.length)) + 1) / 4) * 4

function orderView(ex: OrderExercise, random: () => number): OrderView {
  let pieces = shuffled(ex.pieces, random)
  // Never show the solution order as the starting order.
  if (pieces.length > 1 && pieces.every((p, i) => p.id === ex.pieces[i]?.id)) pieces = [...pieces.slice(1), pieces[0]!]
  return { kind: 'order', lang: ex.lang, pieces: pieces.map((p, i) => ({ id: `s${i}`, code: p.code })), distractors: ex.pieces.some((p) => p.distractor) }
}

function fillView(ex: FillExercise, random: () => number): FillView {
  return {
    kind: 'fill',
    lang: ex.lang,
    segments: ex.segments.map((s) => (s.kind === 'text' ? s : { kind: 'blank', id: s.id, width: blankWidth(s.answers) })),
    bank: ex.bank ? shuffled(ex.bank, random) : null,
  }
}

// `random` is Math.random on the server (the shuffle can't be replayed from the unit id).
export function exerciseView(ex: QuizExercise | null, random: () => number = Math.random): ExerciseView | null {
  if (!ex) return null
  return ex.kind === 'order' ? orderView(ex, random) : fillView(ex, random)
}

export function quizKey(unit: QuizUnit): QuizKey {
  const ex = unit.exercise
  return {
    options: unit.options.filter((o) => o.correct).map((o) => o.id),
    free: isFreeQuiz(unit) ? unit.freeAnswer : null,
    order: unit.mode === 'order' && ex?.kind === 'order' ? ex.pieces.filter((p) => !p.distractor).map((p) => p.code) : null,
    blanks: (unit.mode === 'fill' || unit.mode === 'listen') && ex?.kind === 'fill' ? ex.segments.flatMap((s) => (s.kind === 'blank' ? [s.answers] : [])) : null,
    ...(unit.mode === 'listen' && unit.listen?.accept.length ? { accept: unit.listen.accept } : {}),
  }
}

// Client-side grading with a shipped key (practice quizzes only) — mirrors gradeQuiz on the server.
// Order answers are the pieces' code in the learner's order; fill answers are the blank values.
export function gradeWithKey(shape: QuizShape, key: QuizKey, answer: QuizAnswer, lang?: string | null): boolean {
  if (shape.mode === 'order') return key.order !== null && answer.chosen.length === key.order.length && answer.chosen.every((c, i) => c === key.order![i])
  if (shape.mode === 'fill' || (shape.mode === 'listen' && key.blanks)) return key.blanks !== null && key.blanks.length > 0 && answer.chosen.length === key.blanks.length && key.blanks.every((b, i) => blankMatches(b, answer.chosen[i] ?? '', shape.mode === 'listen'))
  if (shape.mode === 'speak') return false
  if (shape.mode === 'listen' && shape.free) return dictationMatches(answer.text ?? '', key.free ?? '', key.accept ?? [], lang)
  if (shape.free) {
    const text = answer.text ?? ''
    return text.trim() !== '' && normalizeFreeAnswer(text) === normalizeFreeAnswer(key.free ?? '')
  }
  const right = [...key.options].sort()
  const picked = [...new Set(answer.chosen)].sort()
  return right.length > 0 && right.length === picked.length && picked.every((id, i) => id === right[i])
}

// The canonical solution as plain code, from a view and a revealed key (review screens).
export function solutionText(view: ExerciseView, key: QuizKey): string {
  if (view.kind === 'order') return (key.order ?? []).join('\n')
  let n = 0
  return view.segments.map((s) => (s.kind === 'text' ? s.value : (key.blanks?.[n++]?.[0] ?? '…'))).join('')
}

// Everything about a graded quiz that goes to the browser except the rendered prompt/body/option content.
export interface GradedQuizPayload extends QuizShape {
  // In display order (shuffled per render): `id` is what the browser sends back, `index` the authored position (to
  // pick the rendered content). Authored ids (a, b, c…) follow the author's order, and authors put the right answer
  // second about half the time — so graded payloads never use them: the server passes opaque ids
  // (src/server/quiz-ids.ts) and resolves them back before grading.
  options: Array<{ id: string; index: number }>
  exercise: ExerciseView | null
}

export function gradedQuiz(unit: QuizUnit, random: () => number = Math.random, idOf: (optionId: string) => string = (id) => id): GradedQuizPayload {
  const options = shuffled(
    unit.options.map((o, index) => ({ id: idOf(o.id), index })),
    random,
  )
  return { ...quizShape(unit), options, exercise: exerciseView(unit.exercise, random) }
}
