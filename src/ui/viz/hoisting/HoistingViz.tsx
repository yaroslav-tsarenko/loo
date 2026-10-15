'use client'

import { AnimatePresence, m } from 'motion/react'
import { ConsolePanel, Panel, SPRING } from '../engine/Panel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { hoistingScenarios, type ExecContext, type HoistFrame } from './scenarios'

const KIND_TONE: Record<string, string> = { var: 'orange', let: 'blue', const: 'blue', function: 'purple' }

function ContextCard({ ctx, frame, top }: { ctx: ExecContext; frame: HoistFrame; top: boolean }) {
  const looking = frame.lookup?.context === ctx.id ? frame.lookup.name : null
  return (
    <m.div layout="position" className="viz-ctx" data-top={top ? '' : undefined} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={SPRING}>
      <div className="viz-ctx-head">
        <span className="viz-ctx-name">{ctx.name}</span>
        <span className="viz-ctx-phases">
          <span data-on={ctx.phase === 'creation' ? '' : undefined}>1 · створення</span>
          <span data-on={ctx.phase === 'execution' ? '' : undefined}>2 · виконання</span>
        </span>
      </div>
      <ul className="viz-bindings">
        <AnimatePresence initial={false}>
          {ctx.bindings.map((b) => (
            <m.li
              key={b.name}
              layout="position"
              data-state={b.state}
              data-hit={looking === b.name ? '' : undefined}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={SPRING}
            >
              <span className="viz-kind" data-tone={KIND_TONE[b.kind]}>
                {b.kind}
              </span>
              <code className="viz-var-name">{b.name}</code>
              <m.span key={b.value} className="viz-var-val" data-changed={b.changed ? '' : undefined} initial={b.changed ? { scale: 1.2 } : false} animate={{ scale: 1 }} transition={SPRING}>
                {b.state === 'tdz' ? '⛔ TDZ' : b.value}
              </m.span>
            </m.li>
          ))}
        </AnimatePresence>
        {ctx.bindings.length === 0 ? <li className="viz-empty">рушій сканує оголошення…</li> : null}
      </ul>
    </m.div>
  )
}

export function HoistingViz({ scenario }: VizProps) {
  const data = hoistingScenarios[scenario] ?? hoistingScenarios['var-let-function']!
  return (
    <StepPlayer
      scenario={data}
      label="Hoisting"
      side={(f) => (
        <Panel title="Контексти виконання" emoji="🎈" hint="новий — зверху" tone={f.error ? 'danger' : undefined}>
          <div className="viz-ctx-list">
            <AnimatePresence initial={false} mode="popLayout">
              {[...f.contexts].reverse().map((ctx, i) => (
                <ContextCard key={ctx.id} ctx={ctx} frame={f} top={i === 0} />
              ))}
            </AnimatePresence>
          </div>
        </Panel>
      )}
      below={(f) => <ConsolePanel lines={f.output} error={f.error} />}
    />
  )
}
