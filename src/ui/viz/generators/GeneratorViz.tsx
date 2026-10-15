'use client'

import { AnimatePresence, m } from 'motion/react'
import { ConsolePanel, SPRING } from '../engine/Panel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { generatorScenarios, type GenFrame, type GenState } from './scenarios'

const STATE_LABEL: Record<GenState, string> = {
  suspendedStart: '💤 suspendedStart',
  executing: '▶️ executing',
  suspendedYield: '⏸️ suspendedYield',
  completed: '🏁 completed',
}

function PingPong({ frame }: { frame: GenFrame }) {
  return (
    <div className="viz-pingpong">
      <div className="viz-side-box" data-active={frame.active === 'caller' ? '' : undefined}>
        <div className="viz-side-box-head">
          <span aria-hidden="true">📞</span> Виклик
        </div>
        <p className="viz-muted">gen.next(…)</p>
        {frame.active === 'caller' ? (
          <m.span layoutId="ball" className="viz-ball" transition={SPRING} aria-label="керування тут">
            🏓
          </m.span>
        ) : null}
      </div>
      <div className="viz-wire" aria-live="off">
        <AnimatePresence mode="wait" initial={false}>
          {frame.message ? (
            <m.div key={frame.message.text} className="viz-msg" data-dir={frame.message.dir} initial={{ opacity: 0, x: frame.message.dir === 'in' ? -30 : 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={SPRING}>
              <span aria-hidden="true">{frame.message.dir === 'in' ? '→' : '←'}</span>
              <code>{frame.message.text}</code>
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="viz-side-box" data-active={frame.active === 'generator' ? '' : undefined} data-state={frame.genState}>
        <div className="viz-side-box-head">
          <span aria-hidden="true">⚙️</span> Генератор
        </div>
        <span className="viz-badge" data-tone={frame.genState === 'executing' ? 'accent' : frame.genState === 'completed' ? 'success' : undefined}>
          {STATE_LABEL[frame.genState]}
        </span>
        <ul className="viz-vars">
          {frame.vars.map((v) => (
            <li key={v.name}>
              <code className="viz-var-name">{v.name}</code>
              <span className="viz-var-eq">=</span>
              <span className="viz-var-val">{v.value}</span>
            </li>
          ))}
        </ul>
        {frame.active === 'generator' ? (
          <m.span layoutId="ball" className="viz-ball" transition={SPRING} aria-label="керування тут">
            🏓
          </m.span>
        ) : null}
      </div>
    </div>
  )
}

export function GeneratorViz({ scenario }: VizProps) {
  const data = generatorScenarios[scenario] ?? generatorScenarios['yield-pingpong']!
  return <StepPlayer scenario={data} label="Генератори" side={(f) => <PingPong frame={f} />} below={(f) => <ConsolePanel lines={f.output} />} />
}
