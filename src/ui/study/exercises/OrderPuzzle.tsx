'use client'

import { useEffect, useState, type KeyboardEvent } from 'react'
import { exerciseSolution, orderMatches } from '@/content/blocks/quiz/exercise'
import { PiArrowCounterClockwiseBold, PiDotsSixVerticalBold } from 'react-icons/pi'
import type { OrderExercise } from '@/content/model'
import { highlightCode } from '@/ui/code/tokens'
import { Button } from '@/ui/design/Button'
import { ActionBar } from '../ActionBar'
import { seededShuffle } from './shuffle'

interface Props {
  unitId: string
  exercise: OrderExercise
  checked: boolean
  variant: 'inline' | 'session'
  onSubmit: (correct: boolean, chosen: string[]) => void
  actionsSlot?: Element | null
}

// Parsons problem: tap a piece in the pool to append it, tap a placed piece to send it back.
export function OrderPuzzle({ unitId, exercise, checked, variant, onSubmit, actionsSlot }: Props) {
  const [answer, setAnswer] = useState<string[]>([])
  const byId = new Map(exercise.pieces.map((p) => [p.id, p]))
  const want = exercise.pieces.filter((p) => !p.distractor).map((p) => p.code)
  let shuffled = seededShuffle(exercise.pieces, unitId)
  if (shuffled.every((p, i) => p.code === exercise.pieces[i]?.code)) shuffled = [...shuffled].reverse()
  const pool = shuffled.filter((p) => !answer.includes(p.id))
  const ok = checked && orderMatches(exercise, answer)

  const add = (id: string) => {
    if (!checked) setAnswer((a) => (a.includes(id) ? a : [...a, id]))
  }
  const remove = (id: string) => {
    if (!checked) setAnswer((a) => a.filter((x) => x !== id))
  }
  const submit = () => {
    if (checked || answer.length === 0) return
    onSubmit(orderMatches(exercise, answer), answer)
  }

  const handleKey = (e: { key: string; preventDefault: () => void }) => {
    if (checked) return
    const n = Number(e.key)
    if (n >= 1 && n <= Math.min(9, pool.length)) {
      e.preventDefault()
      add(pool[n - 1]!.id)
    } else if (e.key === 'Backspace' && answer.length > 0) {
      e.preventDefault()
      remove(answer[answer.length - 1]!)
    } else if (e.key === 'Enter' && answer.length > 0) {
      e.preventDefault()
      submit()
    }
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

  const lang = exercise.lang
  return (
    <div className="order" onKeyDown={variant === 'inline' ? (e: KeyboardEvent) => handleKey(e) : undefined}>
      <span className="order-label">Твоя відповідь</span>
      <ol className="order-answer" data-empty={answer.length === 0 ? '' : undefined} aria-label="Зібраний код">
        {answer.map((id, i) => {
          const piece = byId.get(id)!
          const state = checked ? (piece.code === want[i] ? 'right' : 'wrong') : 'idle'
          return (
            <li key={id}>
              <button type="button" className="order-piece" data-state={state} onClick={() => remove(id)} disabled={checked} aria-label={`Рядок ${i + 1}: ${piece.code.trim()} — прибрати`}>
                <span className="order-line tabular" aria-hidden="true">
                  {i + 1}
                </span>
                <code data-lang={lang ?? undefined}>{highlightCode(piece.code, id)}</code>
              </button>
            </li>
          )
        })}
        {answer.length === 0 ? <li className="order-placeholder">Торкнись шматка коду нижче, щоб додати його сюди</li> : null}
      </ol>
      {!checked ? (
        <>
          <span className="order-label">Шматки коду{exercise.pieces.some((p) => p.distractor) ? ' · є зайві' : ''}</span>
          <ul className="order-pool" aria-label="Доступні шматки">
            {pool.map((p, i) => (
              <li key={p.id}>
                <button type="button" className="order-piece" data-pool="" onClick={() => add(p.id)} aria-label={`Додати: ${p.code.trim()}`}>
                  <PiDotsSixVerticalBold className="order-grip" aria-hidden="true" />
                  {i < 9 ? <kbd aria-hidden="true">{i + 1}</kbd> : null}
                  <code>{highlightCode(p.code, p.id)}</code>
                </button>
              </li>
            ))}
            {pool.length === 0 ? <li className="order-placeholder">Усі шматки використано</li> : null}
          </ul>
          <ActionBar slot={actionsSlot} className="exercise-actions">
            {answer.length > 0 ? <Button variant="ghost" size={actionsSlot ? 'lg' : 'sm'} icon={<PiArrowCounterClockwiseBold size={18} />} onClick={() => setAnswer([])} aria-label="Очистити" className="exercise-clear" /> : null}
            <Button block={Boolean(actionsSlot)} size={actionsSlot ? 'lg' : 'sm'} disabled={answer.length === 0} onClick={submit}>
              Перевірити
            </Button>
          </ActionBar>
        </>
      ) : !ok ? (
        <div className="exercise-solution">
          <span className="order-label">Правильний порядок</span>
          <pre>
            <code>{highlightCode(exerciseSolution(exercise), 's')}</code>
          </pre>
        </div>
      ) : null}
    </div>
  )
}
