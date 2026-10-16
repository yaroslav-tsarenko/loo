'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { PiCheckBold, PiCodeBlockFill, PiExamFill, PiListChecksFill, PiPuzzlePieceFill, PiTerminalWindowFill, PiXBold } from 'react-icons/pi'
import { normalizeFreeAnswer as normalize } from '@/content/blocks/quiz/grade'
import type { QuizExercise, QuizMode } from '@/content/model'
import { recordQuizAnswer } from '@/server/actions/study'
import { Pill } from '@/ui/design/Badge'
import { Button } from '@/ui/design/Button'
import type { Tone } from '@/ui/design/cx'
import { LooSays } from '@/ui/design/mascot/LooSays'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'
import { ActionBar } from './ActionBar'
import { FillBlanks } from './exercises/FillBlanks'
import { OrderPuzzle } from './exercises/OrderPuzzle'

export interface QuizOptionView {
  id: string
  correct: boolean
  content: ReactNode
}

export interface QuizResult {
  unitId: string
  correct: boolean
  chosen: string[]
  // typed answer of a free «what does it print» quiz (graded again on the server in tests and placement)
  text: string | null
  durationMs: number
}

interface Props {
  unitId: string
  mode: QuizMode
  level: string | null
  prompt: ReactNode
  body: ReactNode
  explanation: ReactNode
  options: QuizOptionView[]
  freeAnswer: string | null
  // order / fill payload; callers that don't pass it get a graceful fallback
  exercise?: QuizExercise | null
  variant: 'inline' | 'session'
  sessionId?: string
  index?: number
  onResult?: (result: QuizResult) => void
  /** Where the check button goes (the lesson player's bottom bar). Defaults to in place. */
  actionsSlot?: Element | null
  /** `none`: the host shows the verdict and explanation itself (lesson player sheet). */
  verdict?: 'inline' | 'none'
}

function kindOf(mode: QuizMode, free: boolean, multi: boolean): { label: string; tone: Tone; icon: ReactNode } {
  if (mode === 'order') return { label: 'Склади код', tone: 'orange', icon: <PiPuzzlePieceFill /> }
  if (mode === 'fill') return { label: 'Заповни пропуски', tone: 'green', icon: <PiCodeBlockFill /> }
  if (free || mode === 'output') return { label: 'Що виведе код', tone: 'blue', icon: <PiTerminalWindowFill /> }
  if (multi) return { label: 'Кілька відповідей', tone: 'pink', icon: <PiListChecksFill /> }
  return { label: 'Тест', tone: 'purple', icon: <PiExamFill /> }
}

export function QuizInline(props: Props) {
  const { unitId, mode, level, prompt, body, explanation, options, freeAnswer, variant, sessionId, onResult, actionsSlot } = props
  const showVerdict = props.verdict !== 'none'
  const exercise = props.exercise ?? null
  const interactive = mode === 'order' || mode === 'fill'
  const [chosen, setChosen] = useState<string[]>([])
  const [typed, setTyped] = useState('')
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(false)
  const started = useRef(0)
  useEffect(() => {
    started.current = Date.now()
  }, [])
  const headingId = useId()
  const feedback = useFeedback()
  const multi = mode === 'multi' || options.filter((o) => o.correct).length > 1
  const free = !interactive && options.length === 0 && freeAnswer !== null
  const kind = kindOf(mode, free, multi)

  const submit = (picked: string[], text: string) => {
    if (checked) return
    let ok: boolean
    if (free) ok = normalize(text) === normalize(freeAnswer ?? '')
    else {
      const right = options.filter((o) => o.correct).map((o) => o.id).sort()
      ok = right.length === picked.length && [...picked].sort().every((id, i) => id === right[i])
    }
    finalize(ok, picked, free ? text : null)
  }

  const finalize = (ok: boolean, picked: string[], text: string | null = null) => {
    if (checked) return
    setChecked(true)
    setCorrect(ok)
    const result: QuizResult = { unitId, correct: ok, chosen: picked, text, durationMs: Date.now() - started.current }
    feedback.answer(ok)
    if (onResult) onResult(result)
    else void recordQuizAnswer({ unitId, correct: ok, durationMs: result.durationMs, sessionId: sessionId ?? null }).then((effects) => feedback.effects(effects))
  }

  const toggle = (id: string) => {
    if (checked) return
    if (multi) setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))
    else {
      setChosen([id])
      submit([id], '')
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
      submit(chosen, '')
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
  const verdictText = correct ? (interactive ? 'Правильно! Код зібрано 🎉' : 'Правильно!') : free ? `Не зовсім. Відповідь: ${freeAnswer}` : 'Неправильно — питання додано в «Мої помилки».'

  return (
    <section className="quiz" id={variant === 'inline' ? `u-${unitId}` : undefined} data-variant={variant} data-state={checked ? (correct ? 'correct' : 'wrong') : 'open'} aria-labelledby={headingId} onKeyDown={onKey}>
      <header className="quiz-head">
        <Pill tone={kind.tone} icon={kind.icon} size="sm" className="quiz-kind">
          {kind.label}
        </Pill>
        {level ? (
          <Pill size="sm" className="quiz-level">
            {level}
          </Pill>
        ) : null}
      </header>
      <div className="quiz-prompt" id={headingId}>
        {prompt}
      </div>
      {body ? <div className="quiz-body prose-flow">{body}</div> : null}
      {interactive ? (
        exercise?.kind === 'order' ? (
          <OrderPuzzle unitId={unitId} exercise={exercise} checked={checked} variant={variant} onSubmit={finalize} actionsSlot={actionsSlot} />
        ) : exercise?.kind === 'fill' ? (
          <FillBlanks unitId={unitId} exercise={exercise} checked={checked} variant={variant} onSubmit={finalize} actionsSlot={actionsSlot} />
        ) : (
          <p className="unit-meta">Ця вправа відкривається в розділі «Тести».</p>
        )
      ) : free ? (
        <form
          className="quiz-free"
          onSubmit={(e) => {
            e.preventDefault()
            if (typed.trim()) submit([], typed)
          }}
        >
          <label className="sr-only" htmlFor={`${headingId}-answer`}>
            Ваша відповідь
          </label>
          <input
            id={`${headingId}-answer`}
            className="quiz-input"
            data-state={checked ? (correct ? 'right' : 'wrong') : undefined}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={checked}
            placeholder="Наприклад: 1 4 3 2"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="done"
          />
          {!checked ? (
            actionsSlot ? (
              <ActionBar slot={actionsSlot}>
                <Button block size="lg" disabled={!typed.trim()} onClick={() => submit([], typed)}>
                  Перевірити
                </Button>
              </ActionBar>
            ) : (
              <Button type="submit" size={compact ? 'sm' : 'md'} disabled={!typed.trim()}>
                Перевірити
              </Button>
            )
          ) : null}
        </form>
      ) : (
        <ol className="quiz-options" role={multi ? 'group' : 'radiogroup'} aria-labelledby={headingId}>
          {options.map((o, i) => {
            const picked = chosen.includes(o.id)
            const state = checked ? (o.correct ? 'right' : picked ? 'wrong' : 'idle') : picked ? 'picked' : 'idle'
            return (
              <li key={o.id}>
                <button
                  type="button"
                  role={multi ? 'checkbox' : 'radio'}
                  aria-checked={picked}
                  className="quiz-option"
                  data-state={state}
                  onClick={() => toggle(o.id)}
                  disabled={checked}
                >
                  <span className="quiz-key" aria-hidden="true">
                    {state === 'right' ? <PiCheckBold /> : state === 'wrong' ? <PiXBold /> : multi && picked ? <PiCheckBold /> : i + 1}
                  </span>
                  <span className="quiz-option-text">{o.content}</span>
                  {checked && o.correct ? <span className="quiz-mark">правильно</span> : null}
                  {checked && picked && !o.correct ? <span className="quiz-mark">ваш вибір</span> : null}
                </button>
              </li>
            )
          })}
        </ol>
      )}
      {multi && !checked && !free && !interactive ? (
        <ActionBar slot={actionsSlot}>
          <Button block={Boolean(actionsSlot)} size={actionsSlot ? 'lg' : compact ? 'sm' : 'md'} disabled={chosen.length === 0} onClick={() => submit(chosen, '')}>
            Перевірити
          </Button>
          {!actionsSlot ? <span className="quiz-hint">або Enter · обрано {chosen.length}</span> : null}
        </ActionBar>
      ) : null}
      {!multi && !checked && !free && !interactive && actionsSlot ? (
        <ActionBar slot={actionsSlot}>
          <p className="quiz-dock-hint">
            Торкнись відповіді <span className="quiz-dock-keys">· або клавіші 1–{options.length}</span>
          </p>
        </ActionBar>
      ) : null}
      {checked && showVerdict ? (
        <div className="quiz-verdict" role="status">
          <LooSays className="quiz-loo" mood={correct ? 'happy' : 'sad'} size={compact ? 52 : 64}>
            <span className="quiz-verdict-line">{verdictText}</span>
          </LooSays>
          {explanation ? <div className="quiz-explain prose-flow">{explanation}</div> : null}
        </div>
      ) : null}
    </section>
  )
}
