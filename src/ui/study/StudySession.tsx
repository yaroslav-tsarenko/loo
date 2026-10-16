'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { PiArrowRightBold, PiCheckBold, PiXBold } from 'react-icons/pi'
import { solutionText, type QuizKey } from '@/content/blocks/quiz/view'
import type { Effect, FlashRating } from '@/progress/types'
import { answerQuiz } from '@/server/actions/answers'
import { endSession, finishTask, rateFlashcard, startSession } from '@/server/actions/study'
import { highlightCode } from '@/ui/code/tokens'
import { Button } from '@/ui/design/Button'
import { Confetti } from '@/ui/design/Confetti'
import { CountUp } from '@/ui/design/CountUp'
import { GameIcon } from '@/ui/design/GameIcon'
import { Loo } from '@/ui/design/mascot/Loo'
import { ProgressBar } from '@/ui/design/ProgressBar'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'
import { FlashcardCard } from './FlashcardCard'
import { QuizInline, type QuizCheck, type QuizResult } from './QuizInline'
import type { StudyItem } from './render-items'
import { TaskInline, type TaskResult } from './TaskInline'

type SessionMode = 'flashcards' | 'quiz' | 'tasks' | 'mistakes'

interface ResultRow {
  unitId: string
  correct: boolean
  label: string
  chosen?: string[]
  // revealed by the server after answering
  key?: QuizKey | null
  explanation?: ReactNode
}

const OUTCOME_LABEL: Record<FlashRating, string> = { again: 'не знав', hard: 'важко', good: 'знав' }

function xpOf(effects: readonly Effect[]): number {
  return effects.reduce((sum, e) => sum + (e.type === 'xp' ? e.amount : 0), 0)
}

export function StudySession({
  items,
  mode,
  filters,
  restartHref,
  backHref,
  backLabel,
}: {
  items: StudyItem[]
  mode: SessionMode
  filters: Record<string, unknown>
  restartHref: string
  backHref: string
  backLabel: string
}) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [busy, setBusy] = useState(false)
  const [results, setResults] = useState<ResultRow[]>([])
  const [xp, setXp] = useState(0)
  const [resolved, setResolved] = useState(0)
  const [done, setDone] = useState(false)
  const feedback = useFeedback()
  const pending = useRef<Promise<unknown>>(Promise.resolve())
  const sessionPromise = useRef<Promise<string> | null>(null)

  useEffect(() => {
    if (sessionPromise.current || items.length === 0) return
    sessionPromise.current = startSession({ mode, unitIds: items.map((i) => i.unitId), filters })
    void sessionPromise.current.then(setSessionId)
  }, [items, mode, filters])

  const current = items[index]

  const absorb = useCallback(
    (effects: Effect[]) => {
      feedback.effects(effects)
      setXp((v) => v + xpOf(effects))
      setResolved((v) => v + effects.filter((e) => e.type === 'mistake-resolved').length)
    },
    [feedback],
  )

  const finish = useCallback(async () => {
    setDone(true)
    await pending.current
    const id = sessionId ?? (await sessionPromise.current)
    if (id) absorb(await endSession({ sessionId: id }))
  }, [sessionId, absorb])

  const next = useCallback(() => {
    setAnswered(false)
    if (index + 1 >= items.length) void finish()
    else setIndex((i) => i + 1)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [index, items.length, finish])

  const record = useCallback(
    (row: ResultRow, call: (id: string | null) => Promise<Effect[]>) => {
      setResults((r) => [...r, row])
      setBusy(true)
      const run = (async () => {
        const id = sessionId ?? (sessionPromise.current ? await sessionPromise.current : null)
        const effects = await call(id)
        absorb(effects)
      })()
      pending.current = run.finally(() => setBusy(false))
      return run
    },
    [sessionId, absorb],
  )

  const onRate = useCallback(
    (rating: FlashRating, durationMs: number) => {
      if (!current || current.kind !== 'flashcard') return
      feedback.answer(rating !== 'again')
      void record({ unitId: current.unitId, correct: rating !== 'again', label: OUTCOME_LABEL[rating] }, (id) => rateFlashcard({ unitId: current.unitId, rating, durationMs, sessionId: id }))
      next()
    },
    [current, feedback, record, next],
  )

  // The server grades (and records) the answer inside the session; the verdict comes back with the key.
  const checkQuiz = useCallback<QuizCheck>(
    async (answer) => {
      const id = sessionId ?? (sessionPromise.current ? await sessionPromise.current : null)
      const out = await answerQuiz({ ...answer, sessionId: id })
      absorb(out.effects)
      return out
    },
    [sessionId, absorb],
  )

  const onQuiz = useCallback((r: QuizResult) => {
    setAnswered(true)
    const correct = r.correct === true
    setResults((rows) => [...rows, { unitId: r.unitId, correct, label: correct ? 'правильно' : 'помилка', chosen: r.chosen, key: r.verdict.key, explanation: r.verdict.explanation }])
  }, [])

  const onTask = useCallback(
    (r: TaskResult) => {
      setAnswered(true)
      void record({ unitId: r.unitId, correct: r.solved, label: r.solved ? 'розв’язано' : 'не вийшло' }, (id) =>
        finishTask({ unitId: r.unitId, solved: r.solved, hintsUsed: r.hintsUsed, durationMs: r.durationMs, sessionId: id }),
      )
    },
    [record],
  )

  useEffect(() => {
    if (!answered) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        next()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [answered, next])

  if (items.length === 0) return null

  if (done) {
    const correct = results.filter((r) => r.correct).length
    const wrong = results.filter((r) => !r.correct)
    const accuracy = results.length ? Math.round((correct / results.length) * 100) : 0
    const mood = results.length === 0 ? 'idle' : accuracy >= 80 ? 'cheer' : accuracy >= 50 ? 'happy' : 'thinking'
    return (
      <section className="summary" aria-live="polite">
        <div className="summary-hero">
          <Loo mood={mood} size={140} />
          <Confetti trigger={results.length > 0 && accuracy >= 80} />
          <span className="summary-eyebrow">Сесію завершено</span>
          <h2 className="summary-title">
            {correct} з {results.length}
            <span className="summary-sub"> · {accuracy}%</span>
          </h2>
        </div>
        <dl className="gstats">
          <div className="gstat" data-tone="yellow">
            <dt>Здобуто</dt>
            <dd className="tabular">
              <GameIcon name="bolt" size={22} />
              <span>
                +<CountUp value={xp} />
              </span>
            </dd>
          </div>
          <div className="gstat" data-tone="red">
            <dt>До помилок</dt>
            <dd className="tabular">
              <CountUp value={wrong.length} />
            </dd>
          </div>
          <div className="gstat" data-tone="green">
            <dt>Закрито</dt>
            <dd className="tabular">
              <CountUp value={resolved} />
            </dd>
          </div>
        </dl>
        {wrong.length > 0 && mode !== 'quiz' ? (
          <div className="summary-section summary-wrong">
            <h3 className="summary-section-title">Варто перечитати</h3>
            <ol>
              {wrong.map((w) => {
                const item = items.find((i) => i.unitId === w.unitId)
                return item ? (
                  <li key={w.unitId}>
                    <Link href={item.chapterHref}>
                      {item.label}
                      <span className="unit-meta">
                        {item.chapterTitle} · {w.label}
                      </span>
                    </Link>
                  </li>
                ) : null
              })}
            </ol>
          </div>
        ) : null}
        <QuizReview items={items} results={results} />
        <div className="summary-actions">
          {/* A full load on purpose: the session state must reset with the new queue. */}
          <a className="lu-btn" data-variant="primary" data-size="md" href={restartHref}>
            <span className="lu-btn-content">
              <span className="lu-btn-label">Ще одна сесія</span>
            </span>
          </a>
          {wrong.length > 0 && mode !== 'mistakes' ? (
            <Button variant="ghost" href="/mistakes">
              До «Моїх помилок»
            </Button>
          ) : null}
          <Button variant="ghost" href={backHref}>
            {backLabel}
          </Button>
        </div>
      </section>
    )
  }

  if (!current) return null
  const progress = (index + (answered ? 1 : 0)) / items.length

  return (
    <section className="session" aria-label="Сесія навчання">
      <div className="session-bar">
        <span className="tabular session-count">
          {index + 1} / {items.length}
        </span>
        <ProgressBar value={progress} label="Прогрес сесії" size="lg" />
        <span className="tabular session-xp">
          <GameIcon name="bolt" size={20} />+{xp}
        </span>
        <Button variant="ghost" size="sm" onClick={() => void finish()}>
          Завершити
        </Button>
      </div>
      <div className="session-stage" key={current.unitId}>
        {current.kind === 'flashcard' ? (
          <FlashcardCard item={current} onRate={onRate} disabled={false} />
        ) : current.kind === 'quiz' ? (
          <QuizInline
            unitId={current.unitId}
            mode={current.mode}
            level={current.level}
            multi={current.multi}
            free={current.free}
            prompt={current.prompt}
            body={current.body}
            options={current.options}
            exercise={current.exercise}
            speak={current.speak}
            lang={current.lang}
            variant="session"
            check={checkQuiz}
            onResult={onQuiz}
          />
        ) : (
          <TaskInline
            unitId={current.unitId}
            title={current.title}
            difficulty={current.difficulty}
            difficultyKey={current.difficultyKey}
            level={current.level}
            statement={current.statement}
            hints={current.hints}
            solution={current.solution}
            initialDraft={current.draft}
            code={current.code}
            variant="session"
            onResult={onTask}
          />
        )}
        {answered ? (
          <div className="session-next">
            <Button size="lg" onClick={next} disabled={busy && index + 1 >= items.length} iconEnd={<PiArrowRightBold size={18} />}>
              {index + 1 >= items.length ? 'Підсумок' : 'Далі'}
            </Button>
            {current.kind !== 'flashcard' ? (
              <Link href={current.chapterHref} target="_blank">
                Розділ: {current.chapterTitle}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
      <p className="session-foot unit-meta">Лишилось: {items.length - index - (answered ? 1 : 0)} · прогрес зберігається після кожної відповіді</p>
    </section>
  )
}

function QuizReview({ items, results }: { items: StudyItem[]; results: ResultRow[] }) {
  const quizzes = results
    .map((r) => ({ r, item: items.find((i) => i.unitId === r.unitId) }))
    .filter((x): x is { r: ResultRow; item: Extract<StudyItem, { kind: 'quiz' }> } => x.item?.kind === 'quiz')
  if (quizzes.length === 0) return null
  return (
    <section className="summary-section review" aria-label="Розбір">
      <h3 className="summary-section-title">Розбір</h3>
      <ol className="review-list">
        {quizzes.map(({ r, item }, n) => (
          <li key={item.unitId}>
            <details className="review-item" data-correct={r.correct ? '' : undefined} open={!r.correct}>
              <summary>
                <span className="review-mark" role="img" aria-label={r.correct ? 'правильно' : 'помилка'}>
                  {r.correct ? <PiCheckBold /> : <PiXBold />}
                </span>
                <span className="review-q">
                  {n + 1}. {item.prompt}
                </span>
              </summary>
              <div className="review-body prose-flow">
                {item.body}
                {!r.key ? null : item.options.length > 0 ? (
                  <ul className="review-options">
                    {item.options.map((o) => {
                      const picked = r.chosen?.includes(o.id) ?? false
                      const right = r.key?.options.includes(o.id) ?? false
                      if (!right && !picked) return null
                      return (
                        <li key={o.id} data-state={right ? 'right' : 'wrong'}>
                          <span className="unit-meta">{right ? (picked ? 'ваш вибір, правильно' : 'правильна відповідь') : 'ваш вибір'}</span> {o.content}
                        </li>
                      )
                    })}
                  </ul>
                ) : item.exercise ? (
                  <div className="exercise-solution">
                    <span className="unit-meta">Відповідь:</span>
                    <pre>
                      <code>{highlightCode(solutionText(item.exercise, r.key), 'r')}</code>
                    </pre>
                  </div>
                ) : (
                  <p>
                    <span className="unit-meta">Відповідь:</span> <code>{r.key.free}</code>
                  </p>
                )}
                {r.explanation}
              </div>
            </details>
          </li>
        ))}
      </ol>
    </section>
  )
}
