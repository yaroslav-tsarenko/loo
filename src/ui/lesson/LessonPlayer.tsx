'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PiArrowClockwiseBold, PiArrowRightBold, PiBandaidsFill, PiBookOpenTextFill, PiCheckBold, PiEyeFill, PiFlagCheckeredFill, PiLightbulbFill, PiMapTrifoldFill, PiXBold } from 'react-icons/pi'
import { MAX_HEARTS, PRACTICE_MIN_ANSWERS, shopItem } from '@/game'
import { answerQuiz } from '@/server/actions/answers'
import { completeLesson, startLesson } from '@/server/actions/lessons'
import { buyItem } from '@/server/actions/shop'
import { finishTask, rateFlashcard } from '@/server/actions/study'
import { t } from '@/i18n'
import { startTest, submitTest, type TestOutcome } from '@/server/actions/tests'
import type { Effect, FlashRating } from '@/progress/types'
import type { PlayerItem } from '@/server/services/lessons'
import { Pill } from '@/ui/design/Badge'
import { Button, IconButton } from '@/ui/design/Button'
import { burst, Confetti } from '@/ui/design/Confetti'
import { CountUp } from '@/ui/design/CountUp'
import { GameIcon } from '@/ui/design/GameIcon'
import { PixelIcon } from '@/ui/design/PixelIcon'
import { Loo, type LooMood } from '@/ui/design/mascot/Loo'
import { LooSays } from '@/ui/design/mascot/LooSays'
import { ProgressBar } from '@/ui/design/ProgressBar'
import { StatChip } from '@/ui/design/StatChip'
import { Icon } from '@/ui/icons/Icon'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'
import { ActionBar } from '@/ui/study/ActionBar'
import { formatLeft, useClock } from '@/ui/shell/clock'
import { QuizInline, type QuizCheck, type QuizResult, type QuizVerdict } from '@/ui/study/QuizInline'
import { RateButtons } from '@/ui/study/RateButtons'
import { TaskInline, type TaskResult } from '@/ui/study/TaskInline'
import type { FlashItem } from '@/ui/study/render-items'

// A scored run (topic test / section exam): no retry queue, every question must be answered, the server grades.
export interface TestSpec {
  id: string
  kind: 'topic-test' | 'section-exam'
  attempt: number
  needed: number
  total: number
  pass: number
  // the section isn't finished yet: passing the exam skips it
  testOut: boolean
  bestScore: number | null
  passedBefore: boolean
  backHref: string
}

interface Props {
  lessonId: string
  title: string
  // icon ref of the lesson kind / test (src/content/icons.ts)
  icon: string
  chapterTitle: string
  chapterHref: string
  items: PlayerItem[]
  nextHref: string | null
  nextLabel?: string | null
  // above-level («челендж») exercise ids
  challenges?: readonly string[]
  test?: TestSpec
  // hearts at page load (lessons spend them; tests need ≥ 1 to start) and bucks for an in-place refill
  hearts: HeartsInfo
  bucks: number
  // «Робота над помилками»: where practice refills hearts
  practiceHref: string
}

export interface HeartsInfo {
  hearts: number
  nextAt: number | null
}

const REFILL = shopItem('heart-refill')!

interface TestAnswer {
  id: string
  chosen: string[]
  text: string | null
  rating: FlashRating | null
}

interface Step {
  item: PlayerItem
  retry: boolean
  key: string
}

type Verdict = { correct: boolean; xp: number; quiz?: QuizVerdict } | null

const xpOf = (effects: readonly Effect[]) => effects.reduce((s, e) => s + (e.type === 'xp' ? e.amount : 0), 0)

const PRAISE = ['Чудово!', 'Так тримати!', 'Мегамозок!', 'Точно в ціль!', 'Бездоганно!', 'Ти машина!']
const COMFORT = ['Не зовсім — повторимо в кінці уроку', 'Майже! Це питання повернеться', 'Помилка — це теж навчання']
const MINUTE_FORMAT = (n: number) => `${n} хв`
const PERCENT_FORMAT = (n: number) => `${n}%`

function CardStep({ item, onRate, dock }: { item: FlashItem; onRate: (rating: FlashRating, ms: number) => void; dock: Element | null }) {
  const [open, setOpen] = useState(false)
  const started = useRef(0)
  const feedback = useFeedback()
  useEffect(() => {
    started.current = Date.now()
  }, [])
  const rate = useCallback((r: FlashRating) => onRate(r, Date.now() - started.current), [onRate])
  const reveal = useCallback(() => {
    feedback.play('flip')
    setOpen(true)
  }, [feedback])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (!open && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        reveal()
      } else if (open && (e.key === '1' || e.key === '2' || e.key === '3')) {
        e.preventDefault()
        rate(e.key === '1' ? 'again' : e.key === '2' ? 'hard' : 'good')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, reveal, rate])
  return (
    <div className="lesson-card lesson-flash" data-open={open ? '' : undefined}>
      <Pill tone="violet" size="sm" className="lesson-kind" icon={<PiLightbulbFill />}>
        Пригадай
      </Pill>
      <div className="lesson-question">{item.question}</div>
      {open ? <div className="lesson-answer prose-flow">{item.answer}</div> : null}
      <ActionBar slot={dock} className="lesson-card-actions">
        {open ? (
          <RateButtons onRate={rate} className="lesson-rate" />
        ) : (
          <Button variant="secondary" size="lg" block icon={<PiEyeFill size={20} />} onClick={reveal}>
            Показати відповідь
          </Button>
        )}
      </ActionBar>
    </div>
  )
}

function Summary({ xp, correct, total, ms, bestCombo, streak, nextHref, nextLabel, chapterHref, bonus, bucks }: { xp: number; correct: number; total: number; ms: number; bestCombo: number; streak: number | null; nextHref: string | null; nextLabel: string | null; chapterHref: string; bonus: number; bucks: number }) {
  const feedback = useFeedback()
  const [shown, setShown] = useState({ xp: 0, accuracy: 0, minutes: 0 })
  const accuracy = total ? Math.round((correct / total) * 100) : 100
  const minutes = Math.max(1, Math.round(ms / 60_000))
  useEffect(() => {
    feedback.play('complete')
    // Roll the cards up a beat after the screen lands; coin ticks while XP settles.
    const show = window.setTimeout(() => setShown({ xp, accuracy, minutes }), 350)
    if (xp <= 0) return () => window.clearTimeout(show)
    let i = 0
    const ticks = window.setInterval(() => {
      i++
      feedback.play('xp')
      if (i >= 6) window.clearInterval(ticks)
    }, 110)
    return () => {
      window.clearTimeout(show)
      window.clearInterval(ticks)
    }
  }, [xp, accuracy, minutes, feedback])
  const perfect = accuracy === 100
  const mood: LooMood = perfect ? 'cheer' : accuracy >= 70 ? 'happy' : 'wave'
  return (
    <div className="lesson-summary">
      <div className="lesson-summary-hero">
        <Loo mood={mood} size={168} className="lesson-summary-loo" />
        <Confetti trigger={accuracy >= 50 ? 1 : 0} count={perfect ? 140 : 80} />
      </div>
      <h1 className="lesson-summary-title" data-perfect={perfect ? '' : undefined}>
        {perfect ? 'Бездоганний урок!' : 'Урок пройдено!'}
      </h1>
      <p className="lesson-summary-note">{bonus > 0 ? `Бонус за урок: +${bonus} XP` : 'Повтор теж прокачує памʼять'}</p>
      <dl className="lesson-stats">
        <div className="gstat" data-tone="yellow">
          <dt>Усього XP</dt>
          <dd className="tabular">
            <GameIcon name="bolt" size={22} />
            <CountUp value={shown.xp} duration={900} />
          </dd>
        </div>
        <div className="gstat" data-tone={accuracy >= 70 ? 'green' : 'orange'}>
          <dt>{perfect ? 'Ідеально' : 'Точність'}</dt>
          <dd className="tabular">
            <CountUp value={shown.accuracy} duration={900} format={PERCENT_FORMAT} />
          </dd>
        </div>
        <div className="gstat" data-tone="blue">
          <dt>Час</dt>
          <dd className="tabular">
            <CountUp value={shown.minutes} duration={600} format={MINUTE_FORMAT} />
          </dd>
        </div>
      </dl>
      {streak || bestCombo >= 3 || bucks > 0 ? (
        <div className="lesson-summary-chips">
          {bucks > 0 ? (
            <span className="lesson-summary-chip" data-tone="orange">
              <StatChip kind="bucks" value={bucks} size="sm" /> {t('game.bucks.title').toLowerCase()}
            </span>
          ) : null}
          {streak ? (
            <span className="lesson-summary-chip" data-tone="orange">
              <StatChip kind="streak" value={streak} size="sm" /> днів поспіль
            </span>
          ) : null}
          {bestCombo >= 3 ? (
            <span className="lesson-summary-chip" data-tone="red">
              <GameIcon name="fire" size={20} /> Комбо ×{bestCombo}
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="lesson-summary-actions">
        {nextHref ? (
          <Button href={nextHref} size="lg" block iconEnd={<PiArrowRightBold size={20} />}>
            {nextLabel ?? 'Наступний урок'}
          </Button>
        ) : null}
        <Button href="/path" variant={nextHref ? 'ghost' : 'primary'} size="lg" block icon={<PiMapTrifoldFill size={20} />}>
          До шляху
        </Button>
        <Link href={chapterHref} className="lesson-summary-link">
          <PiBookOpenTextFill aria-hidden="true" /> Перечитати теорію
        </Link>
      </div>
    </div>
  )
}

// No hearts left: practice («Робота над помилками») refills one per session, the shop refills all at once.
function OutOfHearts({ hearts, bucks, practiceHref, backHref, onRefilled }: { hearts: HeartsInfo; bucks: number; practiceHref: string; backHref: string; onRefilled: (bucks: number) => void }) {
  const now = useClock(30_000)
  const feedback = useFeedback()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const canBuy = bucks >= REFILL.price
  const refill = async () => {
    setBusy(true)
    setError(null)
    try {
      const out = await buyItem({ itemId: REFILL.id })
      if (!out.ok) {
        setError(t(`game.shop.blocks.${out.reason}`))
        return
      }
      feedback.effects(out.effects)
      feedback.play('complete')
      onRefilled(out.bucks)
    } catch {
      setError(t('game.shop.error'))
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="lesson-summary hearts-out" role="alertdialog" aria-labelledby="hearts-out-title">
      <div className="lesson-summary-hero">
        <Loo mood="dizzy" size={160} className="lesson-summary-loo" />
      </div>
      <h1 className="lesson-summary-title" id="hearts-out-title">
        {t('game.hearts.outTitle')}
      </h1>
      <p className="lesson-summary-note">{hearts.nextAt && now > 0 ? t('game.hearts.outLead', { when: `через ${formatLeft(hearts.nextAt - now)}` }) : t('game.hearts.outLeadFull')}</p>
      <div className="hearts-row" aria-label={`${hearts.hearts} з ${MAX_HEARTS}`}>
        {Array.from({ length: MAX_HEARTS }, (_, i) => (
          <GameIcon key={i} name="heart" size={34} muted={i >= hearts.hearts} />
        ))}
      </div>
      {error ? (
        <p className="auth-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="lesson-summary-actions">
        <Button href={practiceHref} size="lg" block variant="secondary" icon={<PiBandaidsFill size={20} />}>
          {t('game.hearts.practice')}
        </Button>
        <p className="choice-hint">{t('game.hearts.practiceHint', { n: PRACTICE_MIN_ANSWERS })}</p>
        <Button size="lg" block onClick={() => void refill()} loading={busy} disabled={!canBuy} icon={<PixelIcon name="buck" size={22} />}>
          {t('game.hearts.refill', { price: REFILL.price })}
        </Button>
        {!canBuy ? <p className="choice-hint">{t('game.hearts.notEnough', { price: REFILL.price, bucks })}</p> : null}
        <Button href={backHref} variant="ghost" size="lg" block icon={<PiMapTrifoldFill size={20} />}>
          {t('game.hearts.toPath')}
        </Button>
      </div>
    </div>
  )
}

function TestIntro({ test, title, icon, chapterTitle, busy, error, onStart }: { test: TestSpec; title: string; icon: string; chapterTitle: string; busy: boolean; error: string | null; onStart: () => void }) {
  const exam = test.kind === 'section-exam'
  return (
    <div className="lesson-summary test-intro">
      <div className="lesson-summary-hero">
        <Loo mood={exam ? 'thinking' : 'happy'} size={150} className="lesson-summary-loo" />
      </div>
      <p className="test-intro-eyebrow">
        <Icon name={icon} size={20} /> {exam ? (test.testOut ? t('tests.testOut') : t('tests.exam')) : t('tests.topic')}
      </p>
      <h1 className="lesson-summary-title">{title}</h1>
      <p className="lesson-summary-note">{chapterTitle}</p>
      <dl className="lesson-stats">
        <div className="gstat" data-tone="blue">
          <dt>{t('tests.questions')}</dt>
          <dd className="tabular">{test.total}</dd>
        </div>
        <div className="gstat" data-tone="violet">
          <dt>{t('tests.toPass')}</dt>
          <dd className="tabular">
            {test.needed}/{test.total}
          </dd>
        </div>
        <div className="gstat" data-tone="yellow">
          <dt>{t('tests.best')}</dt>
          <dd className="tabular">{test.bestScore === null ? '—' : `${Math.round(test.bestScore * 100)}%`}</dd>
        </div>
      </dl>
      <ul className="test-intro-rules">
        <li>{t('tests.ruleOrder')}</li>
        <li>{t('tests.ruleFirst')}</li>
        <li>{exam && test.testOut ? t('tests.ruleTestOut') : t('tests.rulePass', { pct: Math.round(test.pass * 100) })}</li>
      </ul>
      {error ? (
        <p className="auth-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="lesson-summary-actions">
        <Button size="lg" block onClick={onStart} loading={busy} icon={<PiFlagCheckeredFill size={20} />}>
          {test.passedBefore ? t('tests.again') : t('tests.start')}
        </Button>
        <Button href={test.backHref} variant="ghost" size="lg" block icon={<PiMapTrifoldFill size={20} />}>
          {t('tests.toPath')}
        </Button>
      </div>
    </div>
  )
}

function TestSummary({ test, outcome, nextHref, nextLabel, onRetry }: { test: TestSpec; outcome: TestOutcome; nextHref: string | null; nextLabel: string | null; onRetry: () => void }) {
  const feedback = useFeedback()
  const exam = test.kind === 'section-exam'
  const pct = Math.round(outcome.score * 100)
  useEffect(() => {
    feedback.play(outcome.passed ? 'complete' : 'wrong')
  }, [feedback, outcome.passed])
  const title = outcome.passed ? (exam ? (outcome.testOut ? t('tests.passedTestOut') : t('tests.passedExam')) : t('tests.passedTopic')) : t('tests.failed')
  return (
    <div className="lesson-summary test-summary" data-passed={outcome.passed ? '' : undefined}>
      <div className="lesson-summary-hero">
        <Loo mood={outcome.passed ? 'cheer' : 'sad'} size={168} className="lesson-summary-loo" />
        <Confetti trigger={outcome.passed ? 1 : 0} count={outcome.score >= 1 ? 160 : 110} />
      </div>
      <h1 className="lesson-summary-title" data-perfect={outcome.score >= 1 ? '' : undefined}>
        {title}
      </h1>
      <p className="lesson-summary-note">
        {outcome.passed
          ? outcome.bonusXp > 0
            ? `${t('tests.bonus', { xp: outcome.bonusXp })}${outcome.bucks > 0 ? ` · ${t('game.bucks.earned', { n: outcome.bucks })}` : ''}${outcome.gems > 0 ? ` · ${t('game.gems.earned', { n: outcome.gems })}` : ''}`
            : t('tests.saved')
          : t('tests.failedNote', { needed: outcome.needed, total: outcome.total, correct: outcome.correct })}
      </p>
      <dl className="lesson-stats">
        <div className="gstat" data-tone={outcome.passed ? 'green' : 'orange'}>
          <dt>{t('tests.result')}</dt>
          <dd className="tabular">
            {outcome.correct}/{outcome.total}
          </dd>
        </div>
        <div className="gstat" data-tone="blue">
          <dt>{t('tests.accuracy')}</dt>
          <dd className="tabular">{pct}%</dd>
        </div>
        <div className="gstat" data-tone="yellow">
          <dt>{t('tests.bonusXp')}</dt>
          <dd className="tabular">
            <GameIcon name="bolt" size={22} />
            {outcome.bonusXp}
          </dd>
        </div>
      </dl>
      <ol className="test-dots" aria-label="Відповіді по питаннях">
        {outcome.results.map((ok, i) => (
          <li key={i} data-ok={ok ? '' : undefined} aria-label={`Питання ${i + 1}: ${ok ? 'правильно' : 'помилка'}`}>
            {ok ? <PiCheckBold aria-hidden="true" /> : <PiXBold aria-hidden="true" />}
          </li>
        ))}
      </ol>
      <div className="lesson-summary-actions">
        {outcome.passed && nextHref ? (
          <Button href={nextHref} size="lg" block iconEnd={<PiArrowRightBold size={20} />}>
            {nextLabel ?? t('tests.next')}
          </Button>
        ) : null}
        {!outcome.passed ? (
          <Button size="lg" block onClick={onRetry} icon={<PiArrowClockwiseBold size={20} />}>
            {t('tests.retry')}
          </Button>
        ) : null}
        <Button href={test.backHref} variant={outcome.passed && !nextHref ? 'primary' : 'ghost'} size="lg" block icon={<PiMapTrifoldFill size={20} />}>
          {t('tests.toPath')}
        </Button>
      </div>
    </div>
  )
}

export function LessonPlayer({ lessonId, title, icon, chapterTitle, chapterHref, items, nextHref, nextLabel = null, challenges, test, hearts: initialHearts, bucks: initialBucks, practiceHref }: Props) {
  const feedback = useFeedback()
  const [begun, setBegun] = useState(!test)
  const [beginning, setBeginning] = useState(false)
  const [testError, setTestError] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<TestOutcome | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const answers = useRef<TestAnswer[]>([])
  // key of the last graded step: a double submit (fast double tap, key + click) counts once
  const graded = useRef<string | null>(null)
  const router = useRouter()
  const [queue, setQueue] = useState<Step[]>(() => items.map((item, i) => ({ item, retry: false, key: `${item.unitId}-${i}` })))
  const [pos, setPos] = useState(0)
  const [verdict, setVerdict] = useState<Verdict>(null)
  const [answered, setAnswered] = useState(false)
  const [combo, setCombo] = useState(0)
  const [misses, setMisses] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [streak, setStreak] = useState<number | null>(null)
  const [stats, setStats] = useState({ correct: 0, total: 0, xp: 0 })
  const [done, setDone] = useState<{ bonus: number; ms: number; bucks: number } | null>(null)
  const [hearts, setHearts] = useState<HeartsInfo>(initialHearts)
  const [bucks, setBucks] = useState(initialBucks)
  // Out-of-hearts sheet: no hearts to start / continue a graded lesson
  const [blocked, setBlocked] = useState(!test && initialHearts.hearts <= 0)
  const [dock, setDock] = useState<HTMLDivElement | null>(null)
  const comboRef = useRef<HTMLSpanElement>(null)
  const session = useRef<Promise<string | null> | null>(null)
  const started = useRef(0)
  const pending = useRef<Promise<unknown>>(Promise.resolve())
  // XP the server granted for the quiz answer being graded (shown on the verdict sheet)
  const quizXp = useRef(0)

  const openSession = useCallback(() => {
    started.current = Date.now()
    session.current = startLesson(lessonId).catch(() => null)
    void session.current.then((id) => {
      if (id === null) setBlocked(true)
    })
  }, [lessonId])

  useEffect(() => {
    if (test || initialHearts.hearts <= 0) return
    openSession()
  }, [test, initialHearts.hearts, openSession])

  const begin = useCallback(async () => {
    if (!test) return
    setBeginning(true)
    setTestError(null)
    try {
      const { ok, reason } = await startTest({ testId: test.id, attempt: test.attempt })
      if (!ok) {
        setTestError(reason === 'hearts' ? t('game.hearts.testNeedsHeart') : t('tests.stale'))
        return
      }
      started.current = Date.now()
      setBegun(true)
    } catch {
      setTestError(t('tests.startError'))
    } finally {
      setBeginning(false)
    }
  }, [test])

  const step = queue[pos]
  const total = queue.length

  const absorb = useCallback(
    (effects: Effect[]) => {
      feedback.effects(effects)
      const gained = xpOf(effects)
      const days = effects.find((e) => e.type === 'streak')
      if (days?.type === 'streak') setStreak(days.days)
      setStats((s) => ({ ...s, xp: s.xp + gained }))
      return gained
    },
    [feedback],
  )

  // Graded steps update combo, stats and the retry queue. Quizzes arrive already graded by the server (answerQuiz);
  // self-rated cards and tasks are recorded in the background.
  const grade = useCallback(
    (correct: boolean, call: ((sessionId: string | null) => Promise<Effect[]>) | null, quiz?: QuizVerdict, xp = 0) => {
      if (!step || graded.current === step.key) return
      graded.current = step.key
      setAnswered(true)
      setStats((s) => ({ ...s, correct: s.correct + (correct && !step.retry ? 1 : 0), total: s.total + (step.retry ? 0 : 1) }))
      setMisses((m) => (correct ? 0 : m + 1))
      if (correct) {
        const next = combo + 1
        setCombo(next)
        setBestCombo((b) => Math.max(b, next))
        if (next === 3 || next === 5 || next % 10 === 0)
          window.setTimeout(() => {
            feedback.play('combo')
            burst({ from: comboRef.current, count: next >= 5 ? 60 : 36, spread: 0.5 })
          }, 250)
      } else {
        setCombo(0)
        // Lessons bring a mistake back at the end; tests count the first answer only.
        if (!step.retry && !test) setQueue((q) => [...q, { item: step.item, retry: true, key: `${step.key}-retry` }])
      }
      setVerdict({ correct, xp, quiz })
      if (!call) return
      pending.current = (async () => {
        const id = session.current ? await session.current : null
        const gained = absorb(await call(id))
        setVerdict((v) => (v ? { ...v, xp: v.xp + gained } : v))
      })()
    },
    [step, combo, feedback, absorb, test],
  )

  const finish = useCallback(async () => {
    await pending.current
    if (test) {
      setSubmitting(true)
      try {
        const outcome = await submitTest({ testId: test.id, attempt: test.attempt, answers: answers.current })
        absorb(outcome.effects)
        setTestResult(outcome)
        setDone({ bonus: outcome.bonusXp, ms: Date.now() - started.current, bucks: outcome.bucks })
      } catch {
        setTestError(t('tests.saveError'))
      }
      return
    }
    const id = session.current ? await session.current : null
    const outcome = await completeLesson({ lessonId, sessionId: id })
    absorb(outcome.effects)
    setDone({ bonus: outcome.bonusXp, ms: Date.now() - started.current, bucks: outcome.bucks })
  }, [lessonId, absorb, test])

  const advance = useCallback(() => {
    setVerdict(null)
    setAnswered(false)
    if (pos + 1 >= queue.length) void finish()
    else {
      // Out of hearts mid-lesson: stop here (the session stays open — a refill continues it).
      if (!test && hearts.hearts <= 0) setBlocked(true)
      setPos((p) => p + 1)
    }
  }, [pos, queue.length, finish, test, hearts.hearts])

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

  // The server grades every quiz answer (lesson: in the session, charging a heart for a miss; test: stored as the
  // attempt's first answer for this question). The client never had the key.
  const checkQuiz = useCallback<QuizCheck>(
    async (answer) => {
      const id = test ? null : session.current ? await session.current : null
      const out = await answerQuiz({ ...answer, sessionId: id, test: test ? { testId: test.id, attempt: test.attempt, index: pos } : null })
      if (out.hearts) setHearts(out.hearts)
      if (out.outOfHearts) {
        setBlocked(true)
        return out
      }
      quizXp.current = absorb(out.effects)
      return out
    },
    [test, pos, absorb],
  )

  const onQuiz = useCallback(
    (r: QuizResult) => {
      if (!step || graded.current === step.key || r.correct === null) return
      if (test) answers.current[pos] = { id: r.unitId, chosen: r.chosen, text: r.text, rating: null }
      grade(r.correct, null, r.verdict, quizXp.current)
      quizXp.current = 0
    },
    [grade, test, step, pos],
  )

  const onRefilled = useCallback(
    (left: number) => {
      setBucks(left)
      setHearts({ hearts: MAX_HEARTS, nextAt: null })
      setBlocked(false)
      if (!session.current) openSession()
      else
        void session.current.then((id) => {
          if (id === null) openSession()
        })
    },
    [openSession],
  )
  const onTask = useCallback(
    (r: TaskResult) => grade(r.solved, (id) => finishTask({ unitId: r.unitId, solved: r.solved, hintsUsed: r.hintsUsed, durationMs: r.durationMs, sessionId: id })),
    [grade],
  )
  const onRate = useCallback(
    (rating: FlashRating, ms: number) => {
      if (!step || graded.current === step.key) return
      if (test) answers.current[pos] = { id: step.item.unitId, chosen: [], text: null, rating }
      feedback.answer(rating !== 'again')
      grade(rating !== 'again', (id) => rateFlashcard({ unitId: step.item.unitId, rating, durationMs: ms, sessionId: id }))
    },
    [step, feedback, grade, test, pos],
  )

  if (blocked && !done) return <OutOfHearts hearts={hearts} bucks={bucks} practiceHref={practiceHref} backHref={test?.backHref ?? '/path'} onRefilled={onRefilled} />
  if (test && !begun) return <TestIntro test={test} title={title} icon={icon} chapterTitle={chapterTitle} busy={beginning} error={testError} onStart={() => void begin()} />
  if (test && testResult) return <TestSummary test={test} outcome={testResult} nextHref={nextHref} nextLabel={nextLabel} onRetry={() => router.refresh()} />
  if (test && begun && (testError || (submitting && !testResult)))
    return testError ? (
      <div className="lesson-summary">
        <p className="auth-error" role="alert">
          {testError}
        </p>
        <div className="lesson-summary-actions">
          <Button href={test.backHref} size="lg" block icon={<PiMapTrifoldFill size={20} />}>
            {t('tests.toPath')}
          </Button>
        </div>
      </div>
    ) : (
      <div className="lesson-summary" aria-busy="true">
        <div className="lesson-summary-hero">
          <Loo mood="thinking" size={150} className="lesson-summary-loo" />
        </div>
        <p className="lesson-summary-note">{t('tests.counting')}</p>
      </div>
    )
  if (done) return <Summary xp={stats.xp} correct={stats.correct} total={stats.total} ms={done.ms} bestCombo={bestCombo} streak={streak} nextHref={nextHref} nextLabel={nextLabel} chapterHref={chapterHref} bonus={done.bonus} bucks={done.bucks} />
  if (!step) return null

  const progress = (pos + (answered ? 1 : 0)) / total
  const item = step.item
  // Loo reacts: a fixed mistake is a eureka, a combo is a cheer; three misses in a row (or the last heart) make him dizzy.
  const lowHearts = !test && hearts.hearts <= 1
  const mood: LooMood = verdict?.correct ? (step.retry ? 'eureka' : combo >= 3 ? 'cheer' : pos % 2 ? 'wink' : 'happy') : misses >= 3 || lowHearts ? 'dizzy' : pos % 2 ? 'thinking' : 'sad'
  const explanation = verdict?.quiz?.explanation ?? null
  const freeReveal = verdict && !verdict.correct && item.kind === 'quiz' && item.free ? (verdict.quiz?.key?.free ?? null) : null
  return (
    <div className="lesson">
      <header className="lesson-top">
        <IconButton
          label="Вийти з уроку"
          icon={<PiXBold size={24} />}
          className="lesson-close"
          onClick={() => {
            const message = test ? t('tests.leave') : 'Вийти? Прогрес уроку не збережеться, але відповіді вже зараховано.'
            if ((pos === 0 && !answered) || window.confirm(message)) router.push(test?.backHref ?? '/path')
          }}
        />
        <ProgressBar value={progress} label="Прогрес уроку" size="lg" striped={combo >= 3} className="lesson-progress" />
        <span ref={comboRef} className="lesson-combo tabular" data-hot={combo >= 3 ? '' : undefined} role="img" aria-label={`Комбо ${combo}`} title={`Комбо: ${combo} поспіль`}>
          <GameIcon name="fire" size={22} muted={combo === 0} />
          {combo}
        </span>
        {test ? null : <StatChip kind="hearts" value={hearts.hearts} size="sm" className="lesson-hearts" active={hearts.hearts > 0} />}
      </header>

      <main className="lesson-stage">
        <p className="lesson-crumb">
          <Icon name={icon} size={18} /> {title} · {chapterTitle}
          {step.retry ? (
            <Pill tone="orange" size="sm" className="lesson-retry">
              повтор помилки
            </Pill>
          ) : null}
          {test ? (
            <Pill tone="blue" size="sm" className="lesson-retry tabular">
              {pos + 1}/{total}
            </Pill>
          ) : null}
          {challenges?.includes(item.unitId) ? (
            <Pill tone="red" size="sm" className="lesson-retry" icon={<GameIcon name="fire" size={14} />}>
              челендж
            </Pill>
          ) : null}
        </p>
        <div key={step.key} className="lesson-item">
          {item.kind === 'reel' ? (
            <div className="lesson-card lesson-reel">
              <Pill tone="yellow" size="sm" className="lesson-kind" icon={<PiLightbulbFill />}>
                Новий факт
              </Pill>
              <div className="lesson-reel-emoji" aria-hidden="true">
                <Icon name={item.icon} size={72} />
              </div>
              <h2 className="lesson-reel-title">{item.title}</h2>
              <div className="lesson-reel-body prose-flow">{item.body}</div>
            </div>
          ) : item.kind === 'flashcard' ? (
            answered ? (
              <div className="lesson-card lesson-flash" data-open="">
                <Pill tone="violet" size="sm" className="lesson-kind" icon={<PiLightbulbFill />}>
                  Пригадай
                </Pill>
                <div className="lesson-question">{item.question}</div>
                <div className="lesson-answer prose-flow">{item.answer}</div>
              </div>
            ) : (
              <CardStep item={item} onRate={onRate} dock={dock} />
            )
          ) : item.kind === 'quiz' ? (
            <QuizInline
              unitId={item.unitId}
              mode={item.mode}
              multi={item.multi}
              free={item.free}
              level={item.level}
              prompt={item.prompt}
              body={item.body}
              options={item.options}
              exercise={item.exercise}
              variant="session"
              check={checkQuiz}
              onResult={onQuiz}
              actionsSlot={dock}
              verdict="none"
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
        <div className="lesson-foot-inner">
          {verdict ? (
            <div className="lesson-verdict" role="status">
              <LooSays mood={mood} size={72} className="lesson-verdict-loo">
                <strong className="lesson-verdict-title">{verdict.correct ? PRAISE[pos % PRAISE.length] : lowHearts && hearts.hearts > 0 ? t('game.hearts.lowLoo', { n: hearts.hearts }) : hearts.hearts <= 0 && !test ? t('game.hearts.outTitle') : COMFORT[pos % COMFORT.length]}</strong>
                {verdict.xp > 0 ? (
                  <span className="lesson-verdict-xp tabular">
                    <GameIcon name="bolt" size={18} />+{verdict.xp} XP
                  </span>
                ) : null}
              </LooSays>
              {freeReveal ? (
                <p className="lesson-verdict-answer">
                  Правильна відповідь: <code>{freeReveal}</code>
                </p>
              ) : null}
              {explanation ? <div className="lesson-explain prose-flow">{explanation}</div> : null}
            </div>
          ) : null}
          <div ref={setDock} className="lesson-dock" hidden={answered || item.kind === 'reel' || item.kind === 'task'} />
          {item.kind === 'reel' ? (
            <Button size="lg" block onClick={advance} className="lesson-cta" icon={<PiCheckBold size={20} />}>
              Зрозуміло
            </Button>
          ) : answered ? (
            <Button size="lg" block variant={verdict && !verdict.correct ? 'danger' : 'primary'} onClick={advance} autoFocus className="lesson-cta">
              Продовжити
            </Button>
          ) : null}
        </div>
      </footer>
    </div>
  )
}
