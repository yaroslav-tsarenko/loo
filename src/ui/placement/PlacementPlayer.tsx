'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { PiArrowRightBold, PiFlaskFill, PiSlidersHorizontalFill, PiXBold } from 'react-icons/pi'
import { t } from '@/i18n'
import { applyPlacement, placementStep, type PlacementStepResult } from '@/server/actions/courses'
import type { PlayerItem } from '@/server/services/lessons'
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
}

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
}

// Placement answers are graded by placementStep on the server (all at once); a single answer gets no verdict here.
const collectOnly: QuizCheck = async () => ({ correct: null, key: null, explanation: null })

// Adaptive placement in the lesson shell: one question at a time, the server picks the next one and grades.
export function PlacementPlayer({ course, nonce, first, maxQuestions, items, sections, levels, next, zero }: Props) {
  const router = useRouter()
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState<string | null>(first)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [pending, setPending] = useState<PlacementStepResult | null>(null)
  const [answered, setAnswered] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PlacementStepResult['result']>(null)
  const [dock, setDock] = useState<HTMLDivElement | null>(null)
  const byId = useMemo(() => new Map(items.map((i) => [i.unitId, i])), [items])
  const item = current ? byId.get(current) : undefined

  const send = useCallback(
    async (list: Answer[]) => {
      setBusy(true)
      setError(null)
      try {
        setPending(await placementStep({ course: course.id, nonce, answers: list }))
      } catch {
        setError(t('placement.error'))
      } finally {
        setBusy(false)
      }
    },
    [course.id, nonce],
  )

  const onResult = useCallback(
    (r: QuizResult) => {
      const list = [...answers, { id: r.unitId, chosen: r.chosen, text: r.text }]
      setAnswers(list)
      setAnswered(true)
      void send(list)
    },
    [answers, send],
  )

  const advance = useCallback(() => {
    if (!pending) return
    setAnswered(false)
    if (pending.done || !pending.next || !byId.has(pending.next)) {
      setResult(pending.result)
      setCurrent(null)
    } else setCurrent(pending.next)
    setPending(null)
  }, [pending, byId])

  const apply = useCallback(async () => {
    setBusy(true)
    try {
      await applyPlacement({ course: course.id, nonce, answers })
      router.push(next)
      router.refresh()
    } catch {
      setError(t('placement.error'))
      setBusy(false)
    }
  }, [answers, course.id, nonce, next, router])

  if (!started) {
    return (
      <div className="lesson-summary placement-intro">
        <div className="lesson-summary-hero">
          <Loo mood="wave" size={150} className="lesson-summary-loo" />
        </div>
        <p className="test-intro-eyebrow">
          <Icon name={course.icon ?? '📘'} size={20} /> {course.title}
        </p>
        <h1 className="lesson-summary-title">{t('placement.title')}</h1>
        <p className="lesson-summary-note">{t('placement.lead', { max: maxQuestions })}</p>
        <div className="lesson-summary-actions">
          <Button size="lg" block icon={<PiFlaskFill size={20} />} onClick={() => setStarted(true)} disabled={!first}>
            {t('placement.start')}
          </Button>
          {zero}
          <p className="choice-hint">{t('placement.zeroHint')}</p>
        </div>
      </div>
    )
  }

  if (!current || !item) {
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
        {section ? (
          <ol className="placement-sections">
            {sections
              .filter((s) => s.index <= (result?.sectionIndex ?? 0) + 1)
              .map((s) => (
                <li key={s.id} data-state={s.index < (result?.sectionIndex ?? 0) ? 'known' : s.index === result?.sectionIndex ? 'start' : 'next'}>
                  <Icon name={s.icon ?? '📍'} size={22} /> {s.title}
                </li>
              ))}
          </ol>
        ) : null}
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
  return (
    <div className="lesson placement">
      <header className="lesson-top">
        <IconButton label="Вийти з тесту" icon={<PiXBold size={24} />} className="lesson-close" onClick={() => router.push(`/courses/${course.id}`)} />
        <ProgressBar value={Math.min(1, asked / Math.max(1, Math.min(maxQuestions, 12)))} label="Прогрес тесту" size="lg" className="lesson-progress" />
      </header>
      <main className="lesson-stage">
        <p className="lesson-crumb">
          🧪 {t('placement.title')} · {t('placement.question', { n: asked + (answered ? 0 : 1) })}
        </p>
        <div key={item.unitId} className="lesson-item">
          {item.kind === 'quiz' ? (
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
          {answered ? (
            <div className="lesson-verdict" role="status">
              <LooSays mood={busy ? 'thinking' : 'happy'} size={64} className="lesson-verdict-loo">
                <strong className="lesson-verdict-title">{busy ? t('placement.checking') : error ?? 'Записав!'}</strong>
              </LooSays>
            </div>
          ) : null}
          <div ref={setDock} className="lesson-dock" hidden={answered} />
          {answered ? (
            <Button size="lg" block onClick={pending ? advance : () => void send(answers)} disabled={busy} loading={busy} className="lesson-cta">
              {t('placement.next')}
            </Button>
          ) : null}
        </div>
      </footer>
    </div>
  )
}
