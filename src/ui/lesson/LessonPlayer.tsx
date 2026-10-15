'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { completeLesson, startLesson } from '@/server/actions/lessons'
import { finishTask, rateFlashcard, recordQuizAnswer } from '@/server/actions/study'
import type { Effect, FlashRating } from '@/progress/types'
import type { PlayerItem } from '@/server/services/lessons'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'
import { QuizInline, type QuizResult } from '@/ui/study/QuizInline'
import { TaskInline, type TaskResult } from '@/ui/study/TaskInline'
import type { FlashItem } from '@/ui/study/render-items'

interface Props {
  lessonId: string
  title: string
  emoji: string
  chapterTitle: string
  chapterHref: string
  items: PlayerItem[]
  nextHref: string | null
}

interface Step {
  item: PlayerItem
  retry: boolean
  key: string
}

type Verdict = { correct: boolean; xp: number } | null

const xpOf = (effects: readonly Effect[]) => effects.reduce((s, e) => s + (e.type === 'xp' ? e.amount : 0), 0)

const PRAISE = ['Чудово!', 'Так тримати!', 'Мегамозок 🧠', 'Точно в ціль!', 'Бездоганно!', 'Ти машина!']
const COMFORT = ['Не зовсім — повторимо в кінці уроку', 'Майже! Ця картка повернеться', 'Помилка — це теж навчання 💪']

function CardStep({ item, onRate }: { item: FlashItem; onRate: (rating: FlashRating, ms: number) => void }) {
  const [open, setOpen] = useState(false)
  const started = useRef(0)
  const feedback = useFeedback()
  useEffect(() => {
    started.current = Date.now()
  }, [])
  const rate = useCallback((r: FlashRating) => onRate(r, Date.now() - started.current), [onRate])
  return (
    <div className="lesson-card">
      <span className="lesson-kind">🧠 Пригадай</span>
      <div className="lesson-question">{item.question}</div>
      {open ? (
        <>
          <div className="lesson-answer prose-flow">{item.answer}</div>
          <div className="lesson-rate">
            <button type="button" className="lesson-rate-btn" data-tone="bad" onClick={() => rate('again')}>
              😵 Не знав
            </button>
            <button type="button" className="lesson-rate-btn" data-tone="mid" onClick={() => rate('hard')}>
              🤔 Важко
            </button>
            <button type="button" className="lesson-rate-btn" data-tone="good" onClick={() => rate('good')}>
              😎 Знав
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          className="lesson-primary"
          onClick={() => {
            feedback.play('flip')
            setOpen(true)
          }}
        >
          Показати відповідь
        </button>
      )}
    </div>
  )
}

function Summary({ xp, correct, total, ms, bestCombo, nextHref, chapterHref, bonus }: { xp: number; correct: number; total: number; ms: number; bestCombo: number; nextHref: string | null; chapterHref: string; bonus: number }) {
  const feedback = useFeedback()
  const [shown, setShown] = useState(0)
  const accuracy = total ? Math.round((correct / total) * 100) : 100
  useEffect(() => {
    feedback.play('complete')
    if (xp <= 0) return
    // Count XP up with coin ticks, like a slot machine settling.
    const steps = Math.min(xp, 20)
    let i = 0
    const timer = window.setInterval(() => {
      i++
      setShown(Math.round((xp * i) / steps))
      if (i % 2 === 0) feedback.play('xp')
      if (i >= steps) window.clearInterval(timer)
    }, 60)
    return () => window.clearInterval(timer)
  }, [xp, feedback])
  const minutes = Math.max(1, Math.round(ms / 60_000))
  return (
    <div className="lesson-summary">
      <div className="lesson-summary-emoji" aria-hidden="true">
        {accuracy === 100 ? '🏆' : accuracy >= 70 ? '🎉' : '💪'}
      </div>
      <h1 className="lesson-summary-title">{accuracy === 100 ? 'Бездоганний урок!' : 'Урок пройдено!'}</h1>
      <div className="lesson-stats">
        <div className="lesson-stat" data-tone="xp">
          <span className="lesson-stat-label">XP</span>
          <span className="lesson-stat-value tabular">+{shown}</span>
        </div>
        <div className="lesson-stat" data-tone="acc">
          <span className="lesson-stat-label">Точність</span>
          <span className="lesson-stat-value tabular">{accuracy}%</span>
        </div>
        <div className="lesson-stat" data-tone="time">
          <span className="lesson-stat-label">Час</span>
          <span className="lesson-stat-value tabular">{minutes} хв</span>
        </div>
      </div>
      <p className="lesson-summary-note">
        {bestCombo >= 3 ? `🔥 Найкраще комбо: ${bestCombo} поспіль. ` : ''}
        {bonus > 0 ? `Бонус за урок: +${bonus} XP.` : 'Повтор теж прокачує памʼять.'}
      </p>
      <div className="lesson-summary-actions">
        {nextHref ? (
          <Link href={nextHref} className="lesson-primary">
            Наступний урок →
          </Link>
        ) : null}
        <Link href="/path" className="lesson-secondary">
          🗺️ До шляху
        </Link>
        <Link href={chapterHref} className="lesson-link">
          📖 Перечитати теорію
        </Link>
      </div>
    </div>
  )
}

export function LessonPlayer({ lessonId, title, emoji, chapterTitle, chapterHref, items, nextHref }: Props) {
  const feedback = useFeedback()
  const router = useRouter()
  const [queue, setQueue] = useState<Step[]>(() => items.map((item, i) => ({ item, retry: false, key: `${item.unitId}-${i}` })))
  const [pos, setPos] = useState(0)
  const [verdict, setVerdict] = useState<Verdict>(null)
  const [answered, setAnswered] = useState(false)
  const [combo, setCombo] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [stats, setStats] = useState({ correct: 0, total: 0, xp: 0 })
  const [done, setDone] = useState<{ bonus: number; ms: number } | null>(null)
  const session = useRef<Promise<string | null> | null>(null)
  const started = useRef(0)
  const pending = useRef<Promise<unknown>>(Promise.resolve())

  useEffect(() => {
    started.current = Date.now()
    session.current = startLesson(lessonId).catch(() => null)
  }, [lessonId])

  const step = queue[pos]
  const total = queue.length

  const absorb = useCallback(
    (effects: Effect[]) => {
      feedback.effects(effects)
      const gained = xpOf(effects)
      setStats((s) => ({ ...s, xp: s.xp + gained }))
      return gained
    },
    [feedback],
  )

  // Graded steps update combo, stats and the retry queue; the server call runs in the background.
  const grade = useCallback(
    (correct: boolean, call: (sessionId: string | null) => Promise<Effect[]>) => {
      if (!step) return
      setAnswered(true)
      setStats((s) => ({ ...s, correct: s.correct + (correct && !step.retry ? 1 : 0), total: s.total + (step.retry ? 0 : 1) }))
      if (correct) {
        const next = combo + 1
        setCombo(next)
        setBestCombo((b) => Math.max(b, next))
        if (next === 3 || next === 5 || next % 10 === 0) window.setTimeout(() => feedback.play('combo'), 250)
      } else {
        setCombo(0)
        if (!step.retry) setQueue((q) => [...q, { item: step.item, retry: true, key: `${step.key}-retry` }])
      }
      setVerdict({ correct, xp: 0 })
      pending.current = (async () => {
        const id = session.current ? await session.current : null
        const gained = absorb(await call(id))
        setVerdict((v) => (v ? { ...v, xp: v.xp + gained } : v))
      })()
    },
    [step, combo, feedback, absorb],
  )

  const finish = useCallback(async () => {
    await pending.current
    const id = session.current ? await session.current : null
    const outcome = await completeLesson({ lessonId, sessionId: id, correct: stats.correct, total: stats.total })
    absorb(outcome.effects)
    setDone({ bonus: outcome.bonusXp, ms: Date.now() - started.current })
  }, [lessonId, stats.correct, stats.total, absorb])

  const advance = useCallback(() => {
    setVerdict(null)
    setAnswered(false)
    if (pos + 1 >= queue.length) void finish()
    else setPos((p) => p + 1)
  }, [pos, queue.length, finish])

  useEffect(() => {
    if (!answered) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        advance()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [answered, advance])

  const onQuiz = useCallback((r: QuizResult) => grade(r.correct, (id) => recordQuizAnswer({ unitId: r.unitId, correct: r.correct, durationMs: r.durationMs, sessionId: id })), [grade])
  const onTask = useCallback(
    (r: TaskResult) => grade(r.solved, (id) => finishTask({ unitId: r.unitId, solved: r.solved, hintsUsed: r.hintsUsed, durationMs: r.durationMs, sessionId: id })),
    [grade],
  )
  const onRate = useCallback(
    (rating: FlashRating, ms: number) => {
      if (!step) return
      feedback.answer(rating !== 'again')
      grade(rating !== 'again', (id) => rateFlashcard({ unitId: step.item.unitId, rating, durationMs: ms, sessionId: id }))
    },
    [step, feedback, grade],
  )

  if (done) return <Summary xp={stats.xp} correct={stats.correct} total={stats.total} ms={done.ms} bestCombo={bestCombo} nextHref={nextHref} chapterHref={chapterHref} bonus={done.bonus} />
  if (!step) return null

  const progress = (pos + (answered ? 1 : 0)) / total
  const item = step.item
  return (
    <div className="lesson">
      <header className="lesson-top">
        <button
          type="button"
          className="lesson-close"
          aria-label="Вийти з уроку"
          onClick={() => {
            if (pos === 0 || window.confirm('Вийти? Прогрес уроку не збережеться, але відповіді вже зараховано.')) router.push('/path')
          }}
        >
          ✕
        </button>
        <div className="lesson-progress" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
        <span className="lesson-combo tabular" data-hot={combo >= 3 ? '' : undefined} aria-label={`Комбо ${combo}`}>
          🔥 {combo}
        </span>
      </header>

      <main className="lesson-stage">
        <p className="lesson-crumb">
          {emoji} {title} · {chapterTitle}
          {step.retry ? <span className="lesson-retry"> · повтор помилки</span> : null}
        </p>
        <div key={step.key} className="lesson-item">
          {item.kind === 'reel' ? (
            <div className="lesson-card lesson-reel">
              <span className="lesson-kind">💡 Новий факт</span>
              <div className="lesson-reel-emoji" aria-hidden="true">
                {item.emoji}
              </div>
              <h2 className="lesson-reel-title">{item.title}</h2>
              <div className="prose-flow">{item.body}</div>
            </div>
          ) : item.kind === 'flashcard' ? (
            answered ? (
              <div className="lesson-card">
                <span className="lesson-kind">🧠 Пригадай</span>
                <div className="lesson-question">{item.question}</div>
                <div className="lesson-answer prose-flow">{item.answer}</div>
              </div>
            ) : (
              <CardStep item={item} onRate={onRate} />
            )
          ) : item.kind === 'quiz' ? (
            <QuizInline
              unitId={item.unitId}
              mode={item.mode}
              level={item.level}
              prompt={item.prompt}
              body={item.body}
              explanation={item.explanation}
              options={item.options}
              freeAnswer={item.freeAnswer}
              exercise={item.exercise}
              variant="session"
              onResult={onQuiz}
            />
          ) : (
            <TaskInline
              unitId={item.unitId}
              title={item.title}
              difficulty={item.difficulty}
              difficultyKey={item.difficultyKey}
              level={item.level}
              statement={item.statement}
              hints={item.hints}
              solution={item.solution}
              initialDraft={item.draft}
              initialHints={item.hintsRevealed}
              code={item.code}
              variant="session"
              onResult={onTask}
            />
          )}
        </div>
      </main>

      <footer className="lesson-foot" data-verdict={verdict ? (verdict.correct ? 'good' : 'bad') : undefined}>
        {verdict ? (
          <div className="lesson-verdict" role="status">
            <span className="lesson-verdict-emoji" aria-hidden="true">
              {verdict.correct ? '✅' : '❌'}
            </span>
            <div>
              <strong>{verdict.correct ? PRAISE[pos % PRAISE.length] : COMFORT[pos % COMFORT.length]}</strong>
              {verdict.xp > 0 ? <span className="lesson-verdict-xp tabular"> +{verdict.xp} XP</span> : null}
            </div>
          </div>
        ) : null}
        {item.kind === 'reel' ? (
          <button type="button" className="lesson-primary" onClick={advance}>
            Зрозуміло 👍
          </button>
        ) : answered ? (
          <button type="button" className="lesson-primary" data-tone={verdict && !verdict.correct ? 'bad' : undefined} onClick={advance} autoFocus>
            Продовжити
          </button>
        ) : null}
      </footer>
    </div>
  )
}
