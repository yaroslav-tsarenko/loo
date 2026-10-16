'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { PiCheckBold, PiCodeBlockFill, PiExamFill, PiListChecksFill, PiPuzzlePieceFill, PiTerminalWindowFill, PiXBold } from 'react-icons/pi'
import { gradeWithKey, type ExerciseView, type QuizKey } from '@/content/blocks/quiz/view'
import type { QuizMode } from '@/content/model'
import { answerQuiz } from '@/server/actions/answers'
import { Pill } from '@/ui/design/Badge'
import { Button } from '@/ui/design/Button'
import type { Tone } from '@/ui/design/cx'
import { LooSays } from '@/ui/design/mascot/LooSays'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'
import { ActionBar } from './ActionBar'
import { LevelPill } from './LevelPill'
import { FillBlanks } from './exercises/FillBlanks'
import { OrderPuzzle } from './exercises/OrderPuzzle'

export interface QuizOptionView {
  id: string
  content: ReactNode
}

// The server's verdict (answerQuiz) or, for practice quizzes with a shipped key, the local one.
export interface QuizVerdict {
  // null: the host doesn't reveal correctness (placement) or the answer wasn't graded (out of hearts)
  correct: boolean | null
  key: QuizKey | null
  explanation: ReactNode
  outOfHearts?: boolean
}

export interface QuizAnswerInput {
  unitId: string
  chosen: string[]
  text: string | null
  durationMs: number
}

export type QuizCheck = (answer: QuizAnswerInput) => Promise<QuizVerdict>

export interface QuizResult extends QuizAnswerInput {
  correct: boolean | null
  verdict: QuizVerdict
}

interface Props {
  unitId: string
  mode: QuizMode
  level: string | null
  multi: boolean
  free: boolean
  prompt: ReactNode
  body: ReactNode
  options: QuizOptionView[]
  // order / fill payload (shuffled view, no answers)
  exercise?: ExerciseView | null
  /** Practice only (article quizzes): the key ships with the quiz for an instant verdict; XP still comes from the server. */
  answerKey?: QuizKey
  explanation?: ReactNode
  variant: 'inline' | 'session'
  sessionId?: string
  index?: number
  onResult?: (result: QuizResult) => void
  /** How the answer is graded. Default: answerQuiz as practice (records XP, no hearts). */
  check?: QuizCheck
  /** Where the check button goes (the lesson player's bottom bar). Defaults to in place. */
  actionsSlot?: Element | null
  /** `none`: the host shows the verdict and explanation itself (lesson player sheet). */
  verdict?: 'inline' | 'none'
}

function kindOf(mode: QuizMode, free: boolean, multi: boolean): { label: string; tone: Tone; icon: ReactNode } {
  if (mode === 'order') return { label: 'Склади код', tone: 'orange', icon: <PiPuzzlePieceFill /> }
  if (mode === 'fill') return { label: 'Заповни пропуски', tone: 'mint', icon: <PiCodeBlockFill /> }
  if (free || mode === 'output') return { label: 'Що виведе код', tone: 'blue', icon: <PiTerminalWindowFill /> }
  if (multi) return { label: 'Кілька відповідей', tone: 'pink', icon: <PiListChecksFill /> }
  return { label: 'Тест', tone: 'violet', icon: <PiExamFill /> }
}

type Phase = 'open' | 'checking' | 'done'

export function QuizInline(props: Props) {
  const { unitId, mode, level, multi, free, prompt, body, options, variant, sessionId, onResult, actionsSlot, answerKey, check } = props
  const showVerdict = props.verdict !== 'none'
  const exercise = props.exercise ?? null
  const interactive = mode === 'order' || mode === 'fill'
  const [chosen, setChosen] = useState<string[]>([])
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState<Phase>('open')
  const [verdict, setVerdict] = useState<QuizVerdict | null>(null)
  const [error, setError] = useState<string | null>(null)
  const started = useRef(0)
  useEffect(() => {
    started.current = Date.now()
  }, [])
  const headingId = useId()
  const feedback = useFeedback()
  const kind = kindOf(mode, free, multi)
  const checked = phase !== 'open'
  const key = verdict?.key ?? null
  const correct = verdict?.correct ?? null

  const finish = (v: QuizVerdict, answer: QuizAnswerInput) => {
    setVerdict(v)
    setPhase('done')
    if (v.correct !== null) feedback.answer(v.correct)
    onResult?.({ ...answer, correct: v.correct, verdict: v })
  }

  const serverCheck: QuizCheck = async (answer) => {
    const out = await answerQuiz({ ...answer, sessionId: sessionId ?? null })
    feedback.effects(out.effects)
    return out
  }

  const submit = async (picked: string[], text: string | null) => {
    if (phase !== 'open') return
    setError(null)
    const answer: QuizAnswerInput = { unitId, chosen: picked, text, durationMs: Date.now() - started.current }
    if (answerKey) {
      // Practice: instant verdict from the shipped key; the server re-grades the same answer and grants XP.
      finish({ correct: gradeWithKey({ mode, multi, free }, answerKey, { chosen: picked, text }), key: answerKey, explanation: props.explanation ?? null }, answer)
      void serverCheck(answer).catch(() => {})
      return
    }
    setPhase('checking')
    try {
      finish(await (check ?? serverCheck)(answer), answer)
    } catch {
      setPhase('open')
      setError('Не вдалося перевірити відповідь. Спробуй ще раз.')
    }
  }

  const toggle = (id: string) => {
    if (checked) return
    if (multi) setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))
    else {
      setChosen([id])
      void submit([id], null)
    }
  }

  const handleKey = (e: { key: string; preventDefault: () => void }) => {
    if (checked || free || interactive) return
    const n = Number(e.key)
    if (n >= 1 && n <= options.length) {
      e.preventDefault()
      toggle(options[n - 1]!.id)
    } else if (e.key === 'Enter' && multi && chosen.length > 0) {
      e.preventDefault()
      void submit(chosen, null)
    }
  }

  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    if (variant !== 'session') handleKey(e)
  }

  useEffect(() => {
    if (variant !== 'session') return
    const listener = (e: globalThis.KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      handleKey(e)
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  })

  const compact = variant === 'inline'
  const verdictText = correct ? (interactive ? 'Правильно! Код зібрано' : 'Правильно!') : free && key?.free ? `Не зовсім. Відповідь: ${key.free}` : 'Неправильно — питання додано в «Мої помилки».'
  const state = phase === 'checking' ? 'checking' : phase === 'done' ? (correct === null ? 'answered' : correct ? 'correct' : 'wrong') : 'open'

  return (
    <section className="quiz" id={variant === 'inline' ? `u-${unitId}` : undefined} data-variant={variant} data-state={state} aria-labelledby={headingId} aria-busy={phase === 'checking' || undefined} onKeyDown={onKey}>
      <header className="quiz-head">
        <Pill tone={kind.tone} icon={kind.icon} size="sm" className="quiz-kind">
          {kind.label}
        </Pill>
        {level ? <LevelPill level={level} className="quiz-level" /> : null}
      </header>
      <div className="quiz-prompt" id={headingId}>
        {prompt}
      </div>
      {body ? <div className="quiz-body prose-flow">{body}</div> : null}
      {interactive ? (
        exercise?.kind === 'order' ? (
          <OrderPuzzle exercise={exercise} checked={checked} want={key?.order ?? null} variant={variant} onSubmit={(codes) => void submit(codes, null)} actionsSlot={actionsSlot} />
        ) : exercise?.kind === 'fill' ? (
          <FillBlanks exercise={exercise} checked={checked} answers={key?.blanks ?? null} variant={variant} onSubmit={(values) => void submit(values, null)} actionsSlot={actionsSlot} />
        ) : (
          <p className="unit-meta">Ця вправа відкривається в розділі «Тести».</p>
        )
      ) : free ? (
        <form
          className="quiz-free"
          onSubmit={(e) => {
            e.preventDefault()
            if (typed.trim()) void submit([], typed)
          }}
        >
          <label className="sr-only" htmlFor={`${headingId}-answer`}>
            Ваша відповідь
          </label>
          <input
            id={`${headingId}-answer`}
            className="quiz-input"
            data-state={phase === 'done' && correct !== null ? (correct ? 'right' : 'wrong') : undefined}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={checked}
            placeholder="Наприклад: 1 4 3 2"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="done"
          />
          {phase !== 'done' ? (
            actionsSlot ? (
              <ActionBar slot={actionsSlot}>
                <Button block size="lg" disabled={!typed.trim()} loading={phase === 'checking'} onClick={() => void submit([], typed)}>
                  Перевірити
                </Button>
              </ActionBar>
            ) : (
              <Button type="submit" size={compact ? 'sm' : 'md'} disabled={!typed.trim()} loading={phase === 'checking'}>
                Перевірити
              </Button>
            )
          ) : null}
        </form>
      ) : (
        <ol className="quiz-options" role={multi ? 'group' : 'radiogroup'} aria-labelledby={headingId}>
          {options.map((o, i) => {
            const picked = chosen.includes(o.id)
            const right = key?.options.includes(o.id) ?? false
            const optionState = phase === 'done' && key ? (right ? 'right' : picked ? 'wrong' : 'idle') : picked ? 'picked' : 'idle'
            return (
              <li key={o.id}>
                <button
                  type="button"
                  role={multi ? 'checkbox' : 'radio'}
                  aria-checked={picked}
                  className="quiz-option"
                  data-state={optionState}
                  data-pending={phase === 'checking' && picked ? '' : undefined}
                  onClick={() => toggle(o.id)}
                  disabled={checked}
                >
                  <span className="quiz-key" aria-hidden="true">
                    {optionState === 'right' ? <PiCheckBold /> : optionState === 'wrong' ? <PiXBold /> : multi && picked ? <PiCheckBold /> : i + 1}
                  </span>
                  <span className="quiz-option-text">{o.content}</span>
                  {phase === 'done' && key && right ? <span className="quiz-mark">правильно</span> : null}
                  {phase === 'done' && key && picked && !right ? <span className="quiz-mark">ваш вибір</span> : null}
                </button>
              </li>
            )
          })}
        </ol>
      )}
      {multi && phase !== 'done' && !free && !interactive ? (
        <ActionBar slot={actionsSlot}>
          <Button block={Boolean(actionsSlot)} size={actionsSlot ? 'lg' : compact ? 'sm' : 'md'} disabled={chosen.length === 0} loading={phase === 'checking'} onClick={() => void submit(chosen, null)}>
            Перевірити
          </Button>
          {!actionsSlot ? <span className="quiz-hint">або Enter · обрано {chosen.length}</span> : null}
        </ActionBar>
      ) : null}
      {!multi && phase !== 'done' && !free && !interactive && actionsSlot ? (
        <ActionBar slot={actionsSlot}>
          <p className="quiz-dock-hint">
            {phase === 'checking' ? (
              'Перевіряю…'
            ) : (
              <>
                Торкнись відповіді <span className="quiz-dock-keys">· або клавіші 1–{options.length}</span>
              </>
            )}
          </p>
        </ActionBar>
      ) : null}
      {phase === 'checking' && !actionsSlot && !multi && !free && !interactive ? (
        <p className="quiz-hint" role="status">
          Перевіряю…
        </p>
      ) : null}
      {error ? (
        <p className="quiz-error" role="alert">
          {error}
        </p>
      ) : null}
      {phase === 'done' && showVerdict && correct !== null ? (
        <div className="quiz-verdict" role="status">
          <LooSays className="quiz-loo" mood={correct ? 'happy' : 'sad'} size={compact ? 52 : 64}>
            <span className="quiz-verdict-line">{verdictText}</span>
          </LooSays>
          {verdict?.explanation ? <div className="quiz-explain prose-flow">{verdict.explanation}</div> : null}
        </div>
      ) : null}
    </section>
  )
}
