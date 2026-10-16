'use client'

import { AnimatePresence, m } from 'motion/react'
import { Play, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SPRING, VizGlyph } from '../engine/Panel'
import type { VizIcon } from '../engine/types'
import { COMBINATORS, combine, type CombinatorInput } from './combinator-model'

const NAMES: Array<{ name: string; icon: VizIcon; value: string; reason: string }> = [
  { name: 'A', icon: 'px:apple', value: 'яблуко', reason: 'помилка A' },
  { name: 'B', icon: 'px:banana', value: 'банан', reason: 'помилка B' },
  { name: 'C', icon: 'px:grapes', value: 'виноград', reason: 'помилка C' },
]

const INITIAL = [
  { ms: 1000, ok: true },
  { ms: 2000, ok: false },
  { ms: 1500, ok: true },
]

const MAX_MS = 3000

export function Combinators() {
  const [config, setConfig] = useState(INITIAL)
  const [t, setT] = useState<number | null>(null)
  const raf = useRef(0)
  const inputs: Array<CombinatorInput & { icon: VizIcon }> = config.map((c, i) => ({ ...NAMES[i]!, ...c }))
  const end = Math.max(...config.map((c) => c.ms)) + 400
  const running = t !== null && t < end

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const run = () => {
    cancelAnimationFrame(raf.current)
    const start = performance.now()
    const tick = () => {
      const elapsed = performance.now() - start
      setT(Math.min(elapsed, end))
      if (elapsed < end) raf.current = requestAnimationFrame(tick)
    }
    setT(0)
    raf.current = requestAnimationFrame(tick)
  }
  const reset = () => {
    cancelAnimationFrame(raf.current)
    setT(null)
  }
  const update = (i: number, patch: Partial<(typeof INITIAL)[number]>) => {
    reset()
    setConfig((prev) => prev.map((c, j) => (j === i ? { ...c, ...patch } : c)))
  }
  const now = t ?? 0
  const pct = (ms: number) => `${(ms / MAX_MS) * 100}%`

  return (
    <div className="viz-comb">
      <div className="viz-comb-inputs">
        {inputs.map((input, i) => {
          const settled = t !== null && now >= input.ms
          return (
            <div key={input.name} className="viz-comb-input">
              <span className="viz-comb-name">
                {input.name} <VizGlyph icon={input.icon} />
              </span>
              <button type="button" className="viz-yn" data-yes={input.ok ? '' : undefined} aria-pressed={input.ok} onClick={() => update(i, { ok: !input.ok })} aria-label={`Проміс ${input.name}: ${input.ok ? 'виконається' : 'впаде'}. Перемкнути`}>
                <VizGlyph icon={input.ok ? 'pi:PiCheckCircleFill' : 'pi:PiXCircleFill'} size={14} /> {input.ok ? 'resolve' : 'reject'}
              </button>
              <label className="viz-comb-ms">
                <input type="range" min={200} max={MAX_MS} step={100} value={input.ms} onChange={(e) => update(i, { ms: Number(e.target.value) })} aria-label={`Час проміса ${input.name}, мс`} />
                <span className="tabular">{input.ms} мс</span>
              </label>
              <div className="viz-track" aria-hidden="true">
                <span className="viz-track-mark" data-ok={input.ok ? '' : undefined} data-on={settled ? '' : undefined} style={{ left: pct(input.ms) }}>
                  <VizGlyph icon={settled ? (input.ok ? input.icon : 'px:cross') : 'px:hourglass'} />
                </span>
                {t !== null ? <span className="viz-track-cursor" style={{ left: pct(Math.min(now, MAX_MS)) }} /> : null}
              </div>
            </div>
          )
        })}
      </div>
      <div className="viz-row">
        <button type="button" className="viz-btn viz-btn-text" data-primary="" onClick={run} disabled={running}>
          <Play size={16} strokeWidth={1.8} /> Запустити
        </button>
        <button type="button" className="viz-btn viz-btn-text" onClick={reset} disabled={t === null} aria-label="Скинути таймлайн">
          <RotateCcw size={16} strokeWidth={1.8} /> Скинути
        </button>
        <span className="viz-muted tabular" aria-live="off">
          t = {(now / 1000).toFixed(1)} с
        </span>
      </div>
      <div className="viz-comb-results" aria-live="polite">
        {COMBINATORS.map((c) => {
          const outcome = combine(c.id, inputs)
          const done = t !== null && now >= outcome.at
          return (
            <div key={c.id} className="viz-comb-result" data-state={!done ? 'pending' : outcome.ok ? 'fulfilled' : 'rejected'}>
              <div className="viz-comb-result-head">
                <code>Promise.{c.id}</code>
                <span className="viz-muted">{c.rule}</span>
              </div>
              <div className="viz-track" aria-hidden="true">
                {done ? <span className="viz-track-at" data-ok={outcome.ok ? '' : undefined} style={{ left: pct(outcome.at) }} /> : null}
                {t !== null ? <span className="viz-track-cursor" style={{ left: pct(Math.min(now, MAX_MS)) }} /> : null}
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <m.div key={done ? 'done' : 'wait'} className="viz-comb-value" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={SPRING}>
                  {done ? (
                    <>
                      <VizGlyph icon={outcome.ok ? 'px:check' : 'px:cross'} size={14} /> {outcome.ok ? 'fulfilled' : 'rejected'} · <code>{outcome.value}</code> <span className="viz-muted">на {outcome.at} мс</span>
                    </>
                  ) : (
                    <>
                      <VizGlyph icon="px:hourglass" size={14} /> pending{t === null ? ' — натисни «Запустити»' : ''}
                    </>
                  )}
                </m.div>
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
