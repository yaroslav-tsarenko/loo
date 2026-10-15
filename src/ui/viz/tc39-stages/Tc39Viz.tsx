'use client'

import { m } from 'motion/react'
import { SPRING } from '../engine/Panel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { STAGES, tc39Scenarios, type Tc39Frame } from './scenarios'

function Card({ f }: { f: Tc39Frame }) {
  return (
    <m.div layoutId="tc39-card" className="viz-tc-card" data-done={f.edition ? '' : undefined} transition={SPRING}>
      <strong>
        <span aria-hidden="true">🔗</span> Optional chaining
      </strong>
      <code>{f.snippet}</code>
    </m.div>
  )
}

function Pipeline({ f }: { f: Tc39Frame }) {
  const idle = f.at === null && !f.edition
  return (
    <div className="viz-tc">
      <div className="viz-tc-dock" data-label="💭 ідеї спільноти">{idle ? <Card f={f} /> : null}</div>
      <ol className="viz-tc-stages" aria-label="Стадії TC39">
        {STAGES.map((s, i) => {
          const here = f.at === i
          const state = here ? 'current' : f.skipped.includes(s.id) ? 'skipped' : f.passed.includes(s.id) ? 'passed' : undefined
          return (
            <li key={s.id} className="viz-tc-stage" data-state={state} aria-current={here ? 'step' : undefined}>
              <div className="viz-tc-head">
                <span className="viz-tc-num">{s.label}</span>
                <span className="viz-tc-name">{s.name}</span>
                {s.since ? <span className="viz-tc-since">{s.since}</span> : null}
                {state === 'passed' ? <span aria-label="пройдено">✓</span> : state === 'skipped' ? <span aria-label="не існувала">⏭</span> : null}
              </div>
              <ul className="viz-tc-criteria">
                {s.criteria.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              {here ? <Card f={f} /> : null}
            </li>
          )
        })}
      </ol>
      <div className="viz-tc-dock" data-label="📘 щорічне видання" data-on={f.edition ? '' : undefined}>
        {f.edition ? (
          <>
            <span className="viz-tc-edition">ECMAScript {f.edition.replace('ES', '')}</span>
            <Card f={f} />
          </>
        ) : null}
      </div>
    </div>
  )
}

export function Tc39Viz({ scenario }: VizProps) {
  const data = tc39Scenarios[scenario] ?? tc39Scenarios.pipeline!
  return <StepPlayer scenario={data} label="Стадії TC39" hideCode side={(f) => <Pipeline f={f} />} />
}
