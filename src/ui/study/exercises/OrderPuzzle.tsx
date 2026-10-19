'use client'

import { useEffect, useState, type KeyboardEvent } from 'react'
import { PiArrowCounterClockwiseBold, PiDotsSixVerticalBold } from 'react-icons/pi'
import type { OrderView } from '@/content/blocks/quiz/view'
import { highlightCode } from '@/ui/code/tokens'
import { Button } from '@/ui/design/Button'
import { ActionBar, submitLabel } from '../ActionBar'

interface Props {
  // shuffled on the server; ids are positions, not answers
  exercise: OrderView
  checked: boolean
  // the right pieces' code in order — known only after the server's verdict
  want: string[] | null
  variant: 'inline' | 'session'
  // the assembled code, piece by piece
  onSubmit: (codes: string[]) => void
  actionsSlot?: Element | null
}

// Parsons problem: tap a piece in the pool to append it, tap a placed piece to send it back.
export function OrderPuzzle({ exercise, checked, want, variant, onSubmit, actionsSlot }: Props) {
  const [answer, setAnswer] = useState<string[]>([])
  const byId = new Map(exercise.pieces.map((p) => [p.id, p]))
  const pool = exercise.pieces.filter((p) => !answer.includes(p.id))
  const codes = answer.map((id) => byId.get(id)?.code ?? '')
  const ok = want !== null && codes.length === want.length && codes.every((c, i) => c === want[i])

  const add = (id: string) => {
    if (!checked) setAnswer((a) => (a.includes(id) ? a : [...a, id]))
  }
  const remove = (id: string) => {
    if (!checked) setAnswer((a) => a.filter((x) => x !== id))
  }
  const submit = () => {
    if (checked || answer.length === 0) return
    onSubmit(codes)
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
          const state = checked && want ? (piece.code === want[i] ? 'right' : 'wrong') : 'idle'
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
          <span className="order-label">Шматки коду{exercise.distractors ? ' · є зайві' : ''}</span>
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
              {submitLabel(variant)}
            </Button>
          </ActionBar>
        </>
      ) : want && !ok ? (
        <div className="exercise-solution">
          <span className="order-label">Правильний порядок</span>
          <pre>
            <code>{highlightCode(want.join('\n'), 's')}</code>
          </pre>
        </div>
      ) : null}
    </div>
  )
}
