'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import type { QuizExercise, QuizMode } from '@/content/model'
import { recordQuizAnswer } from '@/server/actions/study'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'
import { Tag } from '@/ui/Tag'
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
}

const normalize = (s: string) => s.replace(/[\s,;]+/g, ' ').replace(/[`'"]/g, '').trim().toLowerCase()

export function QuizInline(props: Props) {
  const { unitId, mode, level, prompt, body, explanation, options, freeAnswer, variant, sessionId, onResult } = props
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

  const submit = (picked: string[], text: string) => {
    if (checked) return
    let ok: boolean
    if (free) ok = normalize(text) === normalize(freeAnswer ?? '')
    else {
      const right = options.filter((o) => o.correct).map((o) => o.id).sort()
      ok = right.length === picked.length && [...picked].sort().every((id, i) => id === right[i])
    }
    finalize(ok, picked)
  }

  const finalize = (ok: boolean, picked: string[]) => {
    if (checked) return
    setChecked(true)
    setCorrect(ok)
    const result: QuizResult = { unitId, correct: ok, chosen: picked, durationMs: Date.now() - started.current }
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

  return (
    <section className="quiz" id={variant === 'inline' ? `u-${unitId}` : undefined} data-variant={variant} data-state={checked ? (correct ? 'correct' : 'wrong') : 'open'} aria-labelledby={headingId} onKeyDown={onKey}>
      <header className="quiz-head">
        <span className="eyebrow">{mode === 'order' ? '🧩 Склади код' : mode === 'fill' ? '✍️ Заповни пропуски' : free ? 'Що виведе код' : multi ? 'Тест · кілька відповідей' : mode === 'output' ? 'Що виведе код' : 'Тест'}</span>
        {level ? <Tag>{level}</Tag> : null}
      </header>
      <div className="quiz-prompt" id={headingId}>
        {prompt}
      </div>
      {body ? <div className="quiz-body prose-flow">{body}</div> : null}
      {interactive ? (
        exercise?.kind === 'order' ? (
          <OrderPuzzle unitId={unitId} exercise={exercise} checked={checked} variant={variant} onSubmit={finalize} />
        ) : exercise?.kind === 'fill' ? (
          <FillBlanks unitId={unitId} exercise={exercise} checked={checked} variant={variant} onSubmit={finalize} />
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
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={checked}
            placeholder="Наприклад: 1 4 3 2"
            autoComplete="off"
            spellCheck={false}
          />
          <button className="ui-button" type="submit" disabled={checked || !typed.trim()}>
            Перевірити
          </button>
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
                  <kbd aria-hidden="true">{i + 1}</kbd>
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
        <div className="quiz-actions">
          <button type="button" className="ui-button" disabled={chosen.length === 0} onClick={() => submit(chosen, '')}>
            Перевірити <kbd>Enter</kbd>
          </button>
        </div>
      ) : null}
      {checked ? (
        <div className="quiz-verdict" role="status">
          <p className="quiz-verdict-line">
            {correct ? (interactive ? '🎉 Правильно!' : 'Правильно.') : free ? `Неправильно. Відповідь: ${freeAnswer}` : 'Неправильно — питання додано в «Мої помилки».'}
          </p>
          {explanation ? <div className="quiz-explain prose-flow">{explanation}</div> : null}
        </div>
      ) : null}
    </section>
  )
}
