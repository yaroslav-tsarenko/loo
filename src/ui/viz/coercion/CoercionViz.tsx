'use client'

import { AnimatePresence, m } from 'motion/react'
import { useState } from 'react'
import { SPRING } from '../engine/Panel'
import type { VizProps } from '../engine/types'
import { EQ_PRESETS, OPTIONS, PLUS_PRESETS, optionById, trace } from './algorithms'

function Picker({ label, value, onChange }: { label: string; value: string; onChange: (id: string) => void }) {
  return (
    <fieldset className="viz-picker">
      <legend>{label}</legend>
      <div className="viz-picker-grid">
        {OPTIONS.map((o) => (
          <button key={o.id} type="button" className="viz-pick" aria-pressed={o.id === value} onClick={() => onChange(o.id)}>
            <code>{o.label}</code>
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function CoercionViz({ scenario }: VizProps) {
  const mode = scenario === 'plus-operator' ? 'plus' : 'eq'
  const op = mode === 'eq' ? '==' : '+'
  const presets = mode === 'eq' ? EQ_PRESETS : PLUS_PRESETS
  const [pair, setPair] = useState<[string, string]>(presets[mode === 'eq' ? 3 : 2]!)
  const [x, y] = pair
  const result = trace(mode, x, y)
  const key = `${x}|${y}`
  const final = result.steps.at(-1)!

  return (
    <div className="viz-coercion">
      <div className="viz-presets" role="group" aria-label="Цікаві пари">
        <span className="viz-presets-label">Спробуй:</span>
        {presets.map(([a, b]) => (
          <button key={`${a}|${b}`} type="button" className="viz-chip viz-chip-code" aria-pressed={a === x && b === y} onClick={() => setPair([a, b])}>
            <code>
              {optionById(a).label} {op} {optionById(b).label}
            </code>
          </button>
        ))}
      </div>
      <div className="viz-pickers">
        <Picker label="Ліворуч (x)" value={x} onChange={(id) => setPair([id, y])} />
        <Picker label="Праворуч (y)" value={y} onChange={(id) => setPair([x, id])} />
      </div>
      <div className="viz-expr" aria-hidden="true">
        <code>
          {optionById(x).label} {op} {optionById(y).label}
        </code>
      </div>
      <ol className="viz-algo" aria-label={mode === 'eq' ? 'Кроки IsLooselyEqual' : 'Кроки оператора +'}>
        <AnimatePresence mode="popLayout" initial={false}>
          {result.steps.map((s, i) => (
            <m.li key={`${key}:${i}`} className="viz-algo-step" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0, transition: { ...SPRING, delay: i * 0.12 } }} exit={{ opacity: 0 }}>
              <span className="viz-algo-num" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <div className="viz-algo-rule">{s.rule}</div>
                <p>{s.detail}</p>
                <code className="viz-algo-expr">→ {s.expr}</code>
              </div>
            </m.li>
          ))}
        </AnimatePresence>
      </ol>
      <m.div key={key} className="viz-verdict" data-tone={mode === 'eq' ? (result.result ? 'success' : 'danger') : 'accent'} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1, transition: { ...SPRING, delay: result.steps.length * 0.12 } }} aria-live="polite">
        <code>
          {optionById(x).label} {op} {optionById(y).label}
        </code>
        <span aria-hidden="true">→</span>
        <strong>
          <code>{final.expr}</code>
        </strong>
      </m.div>
    </div>
  )
}
