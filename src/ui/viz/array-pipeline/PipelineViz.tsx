'use client'

import { AnimatePresence, m } from 'motion/react'
import { ConsolePanel, SPRING } from '../engine/Panel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { pipelineScenarios, type Item, type PipelineFrame, type Stage } from './scenarios'

function Lane({ title, method, items, frame, active, input, rejected = [] }: { title: string; method?: string; items: readonly Item[]; frame: PipelineFrame; active: boolean; input: boolean; rejected?: readonly string[] }) {
  return (
    <div className="viz-lane" data-active={active ? '' : undefined}>
      <div className="viz-lane-head">
        {method ? <code>{method}</code> : null}
        <span>{title}</span>
      </div>
      <div className="viz-lane-items">
        <AnimatePresence initial={false}>
          {items.map((it) => (
            <m.span
              key={it.id}
              className="viz-fruit"
              data-current={input && frame.current === it.id ? '' : undefined}
              data-rejected={rejected.includes(it.id) ? '' : undefined}
              initial={{ opacity: 0, y: -18, scale: 0.8 }}
              animate={{ opacity: rejected.includes(it.id) ? 0.4 : 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={SPRING}
            >
              <span className="viz-fruit-emoji" aria-hidden="true">
                {it.emoji}
              </span>
              <span className="tabular">{it.price}</span>
              {rejected.includes(it.id) ? <span className="viz-fruit-x">✗</span> : null}
            </m.span>
          ))}
        </AnimatePresence>
        {items.length === 0 ? <span className="viz-empty">[ ]</span> : null}
      </div>
    </div>
  )
}

const ORDER: Stage[] = ['source', 'map', 'filter', 'reduce', 'done']

function Pipeline({ frame }: { frame: PipelineFrame }) {
  const at = ORDER.indexOf(frame.stage)
  return (
    <div className="viz-pipeline" aria-label="Конвеєр масиву">
      <Lane title="basket" items={frame.source} frame={frame} active={frame.stage === 'source' || frame.stage === 'map'} input={frame.stage === 'map'} />
      <div className="viz-pipe" data-on={at >= 1 ? '' : undefined} aria-hidden="true">
        ↓ <code>.map(x =&gt; ×0.8)</code>
      </div>
      <Lane title="новий масив" items={frame.mapped} frame={frame} active={frame.stage === 'map' || frame.stage === 'filter'} input={frame.stage === 'filter'} rejected={frame.rejected} />
      <div className="viz-pipe" data-on={at >= 2 ? '' : undefined} aria-hidden="true">
        ↓ <code>.filter(x =&gt; x.price &lt; 40)</code>
      </div>
      <Lane title="ще один новий масив" items={frame.filtered} frame={frame} active={frame.stage === 'filter' || frame.stage === 'reduce'} input={frame.stage === 'reduce'} />
      <div className="viz-pipe" data-on={at >= 3 ? '' : undefined} aria-hidden="true">
        ↓ <code>.reduce((sum, x) =&gt; sum + x.price, 0)</code>
      </div>
      <div className="viz-lane viz-acc" data-active={frame.stage === 'reduce' || frame.stage === 'done' ? '' : undefined}>
        <div className="viz-lane-head">
          <span>🧮 sum</span>
        </div>
        <AnimatePresence mode="popLayout" initial={false}>
          <m.span key={String(frame.acc)} className="viz-acc-value tabular" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }} transition={SPRING}>
            {frame.acc ?? '—'}
          </m.span>
        </AnimatePresence>
      </div>
    </div>
  )
}

export function PipelineViz({ scenario }: VizProps) {
  const data = pipelineScenarios[scenario] ?? pipelineScenarios['map-filter-reduce']!
  return <StepPlayer scenario={data} label="map → filter → reduce" side={(f) => <Pipeline frame={f} />} below={(f) => <ConsolePanel lines={f.output} />} />
}
