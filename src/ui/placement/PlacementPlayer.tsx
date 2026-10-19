'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { PiArrowRightBold, PiCheckBold, PiFlaskFill, PiQuestionBold, PiSlidersHorizontalFill, PiTargetBold, PiXBold } from 'react-icons/pi'
import { t } from '@/i18n'
import { applyPlacement, placementStep, type PlacementReviewItem, type PlacementStepResult } from '@/server/actions/courses'
import type { PlayerItem } from '@/server/services/lessons'
import { Pill } from '@/ui/design/Badge'
import { Button, IconButton } from '@/ui/design/Button'
import { Confetti } from '@/ui/design/Confetti'
import { Loo } from '@/ui/design/mascot/Loo'
import { LooSays } from '@/ui/design/mascot/LooSays'
import { ProgressBar } from '@/ui/design/ProgressBar'
import { Icon } from '@/ui/icons/Icon'
import { QuizInline, type QuizCheck, type QuizResult } from '@/ui/study/QuizInline'

interface Answer {
  id: string
  chosen: string[]
  text: string | null
  dontKnow?: boolean
}

type Result = NonNullable<PlacementStepResult['result']>
type Skill = 'grammar' | 'vocabulary' | 'reading' | 'listening'

const SKILLS: readonly Skill[] = ['grammar', 'vocabulary', 'reading', 'listening']

interface Props {
  course: { id: string; title: string; icon: string | null }
  nonce: string
  first: string | null
  maxQuestions: number
  items: PlayerItem[]
  sections: Array<{ id: string; index: number; title: string; icon: string | null }>
  levels: Record<string, string>
  next: string
  zero: ReactNode
  zeroHint?: string
  // calibrated bank (language courses): «Не знаю», skills, confidence, follow-up, IELTS (docs/LANGUAGE_COURSE.md)
  bank?: { followUp: number; ladder: string[] }
}

// Placement answers are graded by placementStep on the server (all at once); a single answer gets no verdict here.
const collectOnly: QuizCheck = async () => ({ correct: null, key: null, explanation: null })

// A run in progress, saved after every answer (localStorage): reloading the page, switching the accent or coming back
// tomorrow continues the same run — placementStep replays it statelessly from (nonce, answers).
interface SavedRun {
  v: 1
  nonce: string
  answers: Answer[]
  followUp: boolean
  phase: 'main' | 'follow-up'
  mainCount: number
  at: number
}

const SAVE_TTL = 14 * 24 * 3600_000
// a run touched this recently was interrupted (remount, reload) rather than left: resume it without asking
const LIVE_MS = 20 * 60_000
const saveKey = (courseId: string) => `levelup.placement.${courseId}`

function readSaved(raw: string | null): SavedRun | null {
  if (!raw) return null
  try {
    const run = JSON.parse(raw) as SavedRun
    if (run.v !== 1 || !Array.isArray(run.answers) || run.answers.length === 0 || Date.now() - run.at > SAVE_TTL) return null
    return run
  } catch {
    return null
  }
}

// hydration renders the server snapshot (null); this tick makes React read localStorage right after mount
const afterMount = (notify: () => void) => {
  const id = window.setTimeout(notify, 0)
  return () => window.clearTimeout(id)
}

// Adaptive placement in the lesson shell: one question at a time. The learner picks an answer (can change it) and
// «Далі» sends it; the server grades it and picks the next question, which opens right away — no per-question verdict.
export function PlacementPlayer({ course, nonce: pageNonce, first, maxQuestions, items, sections, levels, next, zero, zeroHint, bank }: Props) {
  const router = useRouter()
  const key = saveKey(course.id)
  // the saved run as of the first render (null on the server)
  const savedRaw = useSyncExternalStore(afterMount, () => window.localStorage.getItem(key), () => null)
  const saved = useMemo(() => readSaved(savedRaw), [savedRaw])
  const [nonce, setNonce] = useState(pageNonce)
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState<string | null>(first)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [answered, setAnswered] = useState<'answer' | 'dontKnow' | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [review, setReview] = useState<PlacementReviewItem[]>([])
  const [followUp, setFollowUp] = useState(false)
  const [phase, setPhase] = useState<'main' | 'follow-up'>('main')
  const [mainCount, setMainCount] = useState(0)
  const [dock, setDock] = useState<HTMLDivElement | null>(null)
  // questions rendered on the fly by placementStep (beyond the page's pre-rendered candidates)
  const [extra, setExtra] = useState<PlayerItem[]>([])
  const byId = useMemo(() => new Map([...items, ...extra].map((i) => [i.unitId, i])), [items, extra])
  const item = current ? byId.get(current) : undefined

  const persist = useCallback(
    (run: Omit<SavedRun, 'v' | 'at'>) => {
      try {
        window.localStorage.setItem(key, JSON.stringify({ v: 1, at: Date.now(), ...run } satisfies SavedRun))
      } catch {
        // private mode / quota: the run just isn't resumable
      }
    },
    [key],
  )
  const forget = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      // ignore
    }
  }, [key])

  // Shows the step's next question (or the result).
  const goTo = useCallback((step: PlacementStepResult, known: ReadonlyMap<string, PlayerItem>) => {
    setAnswered(null)
    if (step.done || !step.next || !(known.has(step.next) || step.item?.unitId === step.next)) {
      setResult(step.result)
      setReview(step.review)
      setCurrent(null)
    } else {
      if (step.phase) setPhase(step.phase)
      setCurrent(step.next)
    }
  }, [])

  const send = useCallback(
    async (list: Answer[], opts: { more?: boolean; run?: string; withItem?: boolean } = {}) => {
      setBusy(true)
      setError(null)
      try {
        const step = await placementStep({ course: course.id, nonce: opts.run ?? nonce, answers: list, followUp: opts.more ?? followUp, withItem: opts.withItem })
        const fetched = step.item
        if (fetched) setExtra((x) => [...x, fetched])
        goTo(step, fetched ? new Map([...byId, [fetched.unitId, fetched]]) : byId)
        return step
      } catch {
        setError(t('placement.error'))
        return null
      } finally {
        setBusy(false)
      }
    },
    [course.id, nonce, followUp, goTo, byId],
  )

  const record = useCallback(
    (answer: Answer) => {
      // one answer per question: a late tap after «Не знаю» changes nothing
      if (answered || answer.id !== current) return
      const list = [...answers, answer]
      setAnswers(list)
      setAnswered(answer.dontKnow ? 'dontKnow' : 'answer')
      persist({ nonce, answers: list, followUp, phase, mainCount })
      void send(list)
    },
    [answers, answered, current, send, persist, nonce, followUp, phase, mainCount],
  )

  const onResult = useCallback((r: QuizResult) => record({ id: r.unitId, chosen: r.chosen, text: r.text }), [record])

  // Continue a saved run: its own nonce, its answers; the server renders the next question for this page.
  const resume = useCallback(
    async (run: SavedRun) => {
      setNonce(run.nonce)
      setAnswers(run.answers)
      setFollowUp(run.followUp)
      setPhase(run.phase)
      setMainCount(run.mainCount)
      setStarted(true)
      setAnswered('answer')
      const step = await send(run.answers, { more: run.followUp, run: run.nonce, withItem: true })
      if (!step) {
        // the saved run no longer replays (content changed): start over
        forget()
        setNonce(pageNonce)
        setAnswers([])
        setFollowUp(false)
        setPhase('main')
        setMainCount(0)
        setCurrent(first)
        setAnswered(null)
        setError(null)
      }
    },
    [send, forget, pageNonce, first],
  )

  const restart = useCallback(() => {
    forget()
    setStarted(true)
  }, [forget])

  // «Уточнити»: the same run continues with a few questions around the boundary
  const startFollowUp = useCallback(async () => {
    setFollowUp(true)
    setMainCount(answers.length)
    setPhase('follow-up')
    setResult(null)
    setReview([])
    persist({ nonce, answers, followUp: true, phase: 'follow-up', mainCount: answers.length })
    await send(answers, { more: true })
  }, [answers, nonce, persist, send])

  const apply = useCallback(
    async (start?: string) => {
      setBusy(true)
      try {
        await applyPlacement({ course: course.id, nonce, answers, followUp, start })
        forget()
        router.push(next)
        router.refresh()
      } catch {
        setError(t('placement.error'))
        setBusy(false)
      }
    },
    [answers, course.id, followUp, nonce, next, router, forget],
  )

  // an interrupted run (remount, reload a moment ago) continues by itself
  const autoResumed = useRef(false)
  useEffect(() => {
    if (autoResumed.current || started || !saved || Date.now() - saved.at > LIVE_MS) return
    autoResumed.current = true
    void resume(saved)
  }, [saved, started, resume])

  if (!started) {
    return (
      <div className="lesson-summary placement-intro">
        <div className="lesson-summary-hero">
          <Loo mood="wave" size={150} className="lesson-summary-loo" />
        </div>
        <p className="test-intro-eyebrow">
          <Icon name={course.icon ?? 'px:book'} size={20} /> {course.title}
        </p>
        <h1 className="lesson-summary-title">{t('placement.title')}</h1>
        <p className="lesson-summary-note">{saved ? t('placement.resumeLead', { n: saved.answers.length }) : bank ? t('placement.bankLead', { max: maxQuestions }) : t('placement.lead', { max: maxQuestions })}</p>
        <div className="lesson-summary-actions">
          {saved ? (
            <>
              <Button size="lg" block icon={<PiFlaskFill size={20} />} onClick={() => void resume(saved)} loading={busy}>
                {t('placement.resume', { n: saved.answers.length + 1 })}
              </Button>
              <Button variant="ghost" size="lg" block onClick={restart} disabled={!first || busy}>
                {t('placement.restart')}
              </Button>
            </>
          ) : (
            <Button size="lg" block icon={<PiFlaskFill size={20} />} onClick={() => setStarted(true)} disabled={!first}>
              {t('placement.start')}
            </Button>
          )}
          {error ? (
            <p className="auth-error" role="alert">
              {error}
            </p>
          ) : null}
          {zero}
          <p className="choice-hint">{zeroHint ?? t('placement.zeroHint')}</p>
        </div>
      </div>
    )
  }

  if (!current || !item) {
    if (!result && (busy || answered)) {
      return (
        <div className="lesson-summary placement-intro" aria-busy="true">
          <div className="lesson-summary-hero">
            <Loo mood="thinking" size={150} className="lesson-summary-loo" />
          </div>
          <p className="lesson-summary-note">{error ?? t('placement.checking')}</p>
          {error ? (
            <div className="lesson-summary-actions">
              <Button size="lg" block onClick={() => void send(answers, { withItem: true })}>
                {t('placement.retry')}
              </Button>
            </div>
          ) : null}
        </div>
      )
    }
    if (result && bank) return <BankResult result={result} review={review} items={byId} sections={sections} levels={levels} course={course} busy={busy} error={error} followUpCount={bank.followUp} onApply={apply} onFollowUp={startFollowUp} />
    const section = result ? sections[result.sectionIndex] : undefined
    const level = result ? levels[result.level] ?? result.level : '—'
    return (
      <div className="lesson-summary placement-result">
        <div className="lesson-summary-hero">
          <Loo mood="cheer" size={168} className="lesson-summary-loo" />
          <Confetti trigger={result ? 1 : 0} count={120} />
        </div>
        <h1 className="lesson-summary-title">{t('placement.resultTitle', { level })}</h1>
        <p className="lesson-summary-note">{section ? (result && result.sectionIndex > 0 ? t('placement.resultLead', { section: section.title }) : t('placement.resultFirst', { section: section.title })) : null}</p>
        {result && !result.confident ? <p className="choice-hint">{t('placement.notConfident')}</p> : null}
        {section ? <SectionList sections={sections} start={result?.sectionIndex ?? 0} /> : null}
        {error ? (
          <p className="auth-error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="lesson-summary-actions">
          <Button size="lg" block onClick={() => void apply()} loading={busy} iconEnd={<PiArrowRightBold size={20} />} disabled={!result}>
            {t('placement.apply')}
          </Button>
          <Button href={`/courses/${course.id}#level`} variant="ghost" size="lg" block icon={<PiSlidersHorizontalFill size={20} />}>
            {t('placement.other')}
          </Button>
        </div>
      </div>
    )
  }

  const asked = answers.length
  const n = asked + (answered ? 0 : 1)
  const inFollowUp = phase === 'follow-up' && bank
  const crumb = inFollowUp
    ? t('placement.followUpOf', { n: n - mainCount, max: bank.followUp })
    : bank
      ? t('placement.questionOf', { n, max: maxQuestions })
      : t('placement.question', { n })
  const progress = inFollowUp ? (asked - mainCount) / Math.max(1, bank.followUp) : asked / Math.max(1, bank ? maxQuestions : Math.min(maxQuestions, 12))
  return (
    <div className="lesson placement" data-bank={bank ? '' : undefined}>
      <header className="lesson-top">
        <IconButton label="Вийти з тесту" icon={<PiXBold size={24} />} className="lesson-close" onClick={() => router.push(`/courses/${course.id}`)} />
        <ProgressBar value={Math.min(1, progress)} label="Прогрес тесту" size="lg" className="lesson-progress" />
      </header>
      <main className="lesson-stage">
        <p className="lesson-crumb">
          <Icon name="px:testTube" size={18} /> {t('placement.title')} · {crumb}
        </p>
        <div key={item.unitId} className="lesson-item" inert={answered === 'dontKnow' ? true : undefined}>
          {item.kind === 'quiz' ? (
            <QuizInline
              unitId={item.unitId}
              mode={item.mode}
              multi={item.multi}
              free={item.free}
              // the item's level would give the adaptive search away
              level={bank ? null : item.level}
              prompt={item.prompt}
              body={item.body}
              options={item.options}
              exercise={item.exercise}
              speak={item.speak}
              lang={item.lang}
              variant="session"
              onResult={onResult}
              check={collectOnly}
              actionsSlot={dock}
              verdict="none"
            />
          ) : null}
        </div>
      </main>
      <footer className="lesson-foot">
        <div className="lesson-foot-inner">
          {answered && error ? (
            <div className="lesson-verdict" role="alert">
              <LooSays mood="thinking" size={64} className="lesson-verdict-loo">
                <strong className="lesson-verdict-title">{error}</strong>
              </LooSays>
            </div>
          ) : null}
          <div ref={setDock} className="lesson-dock" hidden={answered !== null} />
          {bank && !answered ? (
            <Button variant="ghost" size="lg" block className="placement-dont-know" icon={<PiQuestionBold size={20} />} onClick={() => record({ id: item.unitId, chosen: [], text: null, dontKnow: true })}>
              {t('placement.dontKnow')}
            </Button>
          ) : null}
          {answered ? (
            <Button size="lg" block onClick={() => void send(answers)} disabled={busy} loading={busy} className="lesson-cta">
              {error ? t('placement.retry') : t('placement.next')}
            </Button>
          ) : null}
        </div>
      </footer>
    </div>
  )
}

function SectionList({ sections, start }: { sections: Props['sections']; start: number }) {
  return (
    <ol className="placement-sections">
      {sections
        .filter((s) => s.index <= start + 1)
        .map((s) => (
          <li key={s.id} data-state={s.index < start ? 'known' : s.index === start ? 'start' : 'next'}>
            <Icon name={s.icon ?? 'px:map'} size={22} /> {s.title}
          </li>
        ))}
    </ol>
  )
}

interface BankResultProps {
  result: Result
  review: PlacementReviewItem[]
  items: Map<string, PlayerItem>
  sections: Props['sections']
  levels: Record<string, string>
  course: Props['course']
  busy: boolean
  error: string | null
  followUpCount: number
  onApply: (start?: string) => Promise<void>
  onFollowUp: () => Promise<void>
}

const listOf = (skills: readonly Skill[]) => skills.map((s) => t(`placement.skill.${s}`).toLowerCase()).join(', ')

// Result of the calibrated test: level + IELTS (approximate), confidence (+ follow-up), skills, where to start, mistakes.
function BankResult({ result, review, items, sections, levels, course, busy, error, followUpCount, onApply, onFollowUp }: BankResultProps) {
  const level = levels[result.level] ?? result.level
  const confidence = result.confidence ?? 'low'
  const [primary, secondary] = result.starts
  const strong = result.strong as Skill[]
  const weak = result.weak as Skill[]
  return (
    <div className="lesson-summary placement-result placement-bank-result">
      <div className="lesson-summary-hero">
        <Loo mood="cheer" size={150} className="lesson-summary-loo" />
        <Confetti trigger={1} count={120} />
      </div>
      <h1 className="lesson-summary-title">{t('placement.resultTitle', { level })}</h1>
      {result.ielts ? (
        <div className="placement-ielts">
          <Pill tone="blue" icon={<PiTargetBold />}>
            {t('placement.ielts', { band: result.ielts })}
          </Pill>
          <p className="choice-hint">{t('placement.ieltsNote')}</p>
        </div>
      ) : null}

      <section className="placement-confidence" data-confidence={confidence} aria-label={t(`placement.confidence.${confidence}`)}>
        <strong>{t(`placement.confidence.${confidence}`)}</strong>
        <span>{t(`placement.confidenceNote.${confidence}`)}</span>
      </section>
      {result.followUp ? (
        <section className="placement-followup lu-card">
          <LooSays mood="thinking" size={56}>
            <strong>{t('placement.followUpTitle')}</strong> {t('placement.followUpBody', { n: followUpCount })}
          </LooSays>
          <Button variant="secondary" size="lg" block onClick={() => void onFollowUp()} loading={busy}>
            {t('placement.followUpCta')}
          </Button>
        </section>
      ) : null}

      {result.skills ? (
        <section className="placement-skills" aria-label={t('placement.skillsTitle')}>
          <h2 className="summary-section-title">{t('placement.skillsTitle')}</h2>
          <ul>
            {SKILLS.map((s) => {
              const v = result.skills?.[s]
              if (!v) return null
              const mark = strong.includes(s) ? 'strong' : weak.includes(s) ? 'weak' : undefined
              return (
                <li key={s} data-mark={mark}>
                  <span className="placement-skill-name">{t(`placement.skill.${s}`)}</span>
                  <Pill size="sm" tone={mark === 'strong' ? 'green' : mark === 'weak' ? 'orange' : 'violet'}>
                    {v.level}
                  </Pill>
                  <span className="placement-skill-meta">
                    {v.measured ? `${v.correct}/${v.asked}` : t('placement.skillFew')}
                    {v.ielts ? ` · IELTS ~${v.ielts}` : ''}
                  </span>
                </li>
              )
            })}
          </ul>
          <p className="choice-hint">{strong.length + weak.length === 0 ? t('placement.even') : [strong.length > 0 ? t('placement.strong', { list: listOf(strong) }) : null, weak.length > 0 ? t('placement.weak', { list: listOf(weak) }) : null].filter(Boolean).join(' · ')}</p>
        </section>
      ) : null}

      {result.lessonsReady ? (
        <>
          <p className="lesson-summary-note">{sections[result.sectionIndex] ? (result.sectionIndex > 0 ? t('placement.resultLead', { section: sections[result.sectionIndex]!.title }) : t('placement.resultFirst', { section: sections[result.sectionIndex]!.title })) : null}</p>
          <SectionList sections={sections} start={result.sectionIndex} />
        </>
      ) : (
        <p className="lesson-summary-note placement-planned">{t('placement.plannedLead', { level: result.level, start: primary?.level ?? result.startLevel ?? '—' })}</p>
      )}

      {review.length > 0 ? <Review review={review} items={items} /> : null}

      {error ? (
        <p className="auth-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="lesson-summary-actions">
        <Button size="lg" block onClick={() => void onApply(primary?.id)} loading={busy} iconEnd={<PiArrowRightBold size={20} />}>
          {result.lessonsReady || !primary ? t('placement.apply') : t('placement.repeat', { level: primary.level })}
        </Button>
        {!result.lessonsReady && secondary ? (
          <Button variant="secondary" size="lg" block onClick={() => void onApply(secondary.id)} disabled={busy}>
            {t('placement.startAt', { level: secondary.level })}
          </Button>
        ) : null}
        <Button href={`/courses/${course.id}#level`} variant="ghost" size="lg" block icon={<PiSlidersHorizontalFill size={20} />}>
          {t('placement.other')}
        </Button>
      </div>
    </div>
  )
}

// The finished test's mistakes with the right answer and the explanation (the server reveals them only now).
function Review({ review, items }: { review: PlacementReviewItem[]; items: Map<string, PlayerItem> }) {
  return (
    <details className="summary-section review placement-review">
      <summary className="summary-section-title">{t('placement.reviewTitle', { n: review.length })}</summary>
      <ol className="review-list">
        {review.map((r) => {
          const item = items.get(r.id)
          if (!item || item.kind !== 'quiz') return null
          return (
            <li key={r.id}>
              <div className="review-item">
                <p className="review-q">
                  <span className="review-mark" role="img" aria-label="помилка">
                    <PiXBold />
                  </span>{' '}
                  {item.prompt}
                </p>
                <div className="review-body prose-flow">
                  {item.body}
                  <ul className="review-options">
                    {r.dontKnow ? (
                      <li data-state="wrong">
                        <span className="unit-meta">{t('placement.reviewDontKnow')}</span>
                      </li>
                    ) : null}
                    {item.options.map((o) => {
                      const right = r.key.includes(o.id)
                      const picked = r.chosen.includes(o.id)
                      if (!right && !picked) return null
                      return (
                        <li key={o.id} data-state={right ? 'right' : 'wrong'}>
                          <span className="unit-meta">
                            {right ? <PiCheckBold aria-hidden="true" /> : null} {right ? t('placement.reviewRight') : t('placement.reviewYours')}
                          </span>{' '}
                          {o.content}
                        </li>
                      )
                    })}
                  </ul>
                  {r.explanation ? <div className="quiz-explain prose-flow">{r.explanation}</div> : null}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </details>
  )
}
