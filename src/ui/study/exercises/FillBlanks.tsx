'use client'

import { useT } from '@/i18n/react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { blankMatches } from '@/content/blocks/quiz/exercise'
import type { FillView } from '@/content/blocks/quiz/view'
import { highlightCode } from '@/ui/code/tokens'
import { Button } from '@/ui/design/Button'
import { ActionBar, submitLabel } from '../ActionBar'

interface Props {
  // blanks without answers; the bank (if any) is shuffled on the server
  exercise: FillView
  checked: boolean
  // accepted answers per blank — known only after the server's verdict
  answers: string[][] | null
  variant: 'inline' | 'session'
  onSubmit: (values: string[]) => void
  actionsSlot?: Element | null
}

// Blanks inside code: free inputs, or a word bank of chips when the quiz has the `bank` flag.
export function FillBlanks({ exercise, checked, answers, variant, onSubmit, actionsSlot }: Props) {
  const t = useT()
  const blanks = exercise.segments.flatMap((s) => (s.kind === 'blank' ? [s] : []))
  const [values, setValues] = useState<Record<string, string>>({})
  // bank mode: blank id → chip index
  const [placed, setPlaced] = useState<Record<string, number>>({})
  const [active, setActive] = useState<string | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const bank = exercise.bank
  const chips = bank ? bank.map((word, index) => ({ word, index })) : []
  const usedChips = new Set(Object.values(placed))
  const valueOf = (id: string) => (bank ? (placed[id] !== undefined ? bank[placed[id]!] ?? '' : '') : values[id] ?? '')
  const filled = blanks.every((b) => valueOf(b.id).trim() !== '')

  const submit = () => {
    if (checked || !filled) return
    onSubmit(blanks.map((b) => valueOf(b.id)))
  }

  const place = (chip: number) => {
    if (checked || usedChips.has(chip)) return
    const target = active && placed[active] === undefined ? active : blanks.find((b) => placed[b.id] === undefined)?.id
    if (!target) return
    const next = { ...placed, [target]: chip }
    setPlaced(next)
    setActive(blanks.find((b) => next[b.id] === undefined)?.id ?? null)
  }

  const unplace = (id: string) => {
    if (checked) return
    if (placed[id] === undefined) return setActive(id)
    const next = { ...placed }
    delete next[id]
    setPlaced(next)
    setActive(id)
  }

  const handleKey = (e: { key: string; preventDefault: () => void }) => {
    if (checked || !bank) return
    const n = Number(e.key)
    const free = chips.filter((c) => !usedChips.has(c.index))
    if (n >= 1 && n <= Math.min(9, free.length)) {
      e.preventDefault()
      place(free[n - 1]!.index)
    } else if (e.key === 'Enter' && filled) {
      e.preventDefault()
      submit()
    }
  }

  useEffect(() => {
    if (variant !== 'session' || !bank) return
    const listener = (e: globalThis.KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      handleKey(e)
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  })

  const onInputKey = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    if (filled) return submit()
    const inputs = root.current?.querySelectorAll<HTMLInputElement>('input.fill-input') ?? []
    const empty = [...inputs].find((el, i) => i > index && !el.value.trim()) ?? [...inputs].find((el) => !el.value.trim())
    empty?.focus()
  }

  const indexOf = new Map(blanks.map((b, i) => [b.id, i]))
  return (
    <div className="fill" ref={root} onKeyDown={variant === 'inline' ? (e) => handleKey(e) : undefined}>
      <pre className="fill-code">
        <code>
          {exercise.segments.map((s, i) => {
            if (s.kind === 'text') return <span key={i}>{highlightCode(s.value, `f${i}-`)}</span>
            const index = indexOf.get(s.id) ?? 0
            const value = valueOf(s.id)
            const accepted = answers?.[index] ?? null
            const state = checked && accepted ? (blankMatches(accepted, value) ? 'right' : 'wrong') : 'idle'
            const width = `${s.width}ch`
            const reveal = state === 'wrong' ? <span className="fill-correct">{accepted?.[0]}</span> : null
            if (bank)
              return (
                <span key={i} className="fill-slot-wrap">
                  <button
                    type="button"
                    className="fill-slot"
                    data-state={state}
                    data-active={!checked && active === s.id ? '' : undefined}
                    style={{ minWidth: width }}
                    onClick={() => unplace(s.id)}
                    disabled={checked}
                    aria-label={`Пропуск ${index + 1}${value ? `: ${value}` : ''}`}
                  >
                    {value || ' '}
                  </button>
                  {reveal}
                </span>
              )
            return (
              <span key={i} className="fill-slot-wrap">
                <input
                  className="fill-input"
                  data-state={state}
                  style={{ width }}
                  value={value}
                  onChange={(e) => setValues((v) => ({ ...v, [s.id]: e.target.value }))}
                  onKeyDown={(e) => onInputKey(e, index)}
                  disabled={checked}
                  aria-label={`Пропуск ${index + 1}`}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint={index === blanks.length - 1 ? 'done' : 'next'}
                />
                {reveal}
              </span>
            )
          })}
        </code>
      </pre>
      {bank && !checked ? (
        <ul className="fill-bank" aria-label="Банк слів">
          {chips.map((c) => {
            const free = chips.filter((x) => !usedChips.has(x.index))
            const n = free.findIndex((x) => x.index === c.index)
            return (
              <li key={c.index}>
                <button type="button" className="fill-chip" onClick={() => place(c.index)} disabled={usedChips.has(c.index)}>
                  <code>{c.word}</code>
                  {n >= 0 && n < 9 ? <kbd aria-hidden="true">{n + 1}</kbd> : null}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
      {!checked ? (
        <ActionBar slot={actionsSlot} className="exercise-actions">
          {!filled ? <span className="quiz-hint">Лишилось пропусків: {blanks.filter((b) => !valueOf(b.id).trim()).length}</span> : null}
          <Button block={Boolean(actionsSlot)} size={actionsSlot ? 'lg' : 'sm'} disabled={!filled} onClick={submit}>
            {submitLabel(variant, t)}
          </Button>
        </ActionBar>
      ) : null}
    </div>
  )
}
