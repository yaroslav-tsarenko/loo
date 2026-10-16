'use client'

import { AnimatePresence, m } from 'motion/react'
import { Arrows, type ArrowLink } from '../engine/Arrows'
import { ConsolePanel, SPRING, VizGlyph } from '../engine/Panel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { proxyTrapsScenarios, TRAPS, type ProxyFrame } from './scenarios'

const DEFINED = new Set(['get', 'set'])
const SHOWN = TRAPS.slice(0, 6)

function ProxyStage({ frame }: { frame: ProxyFrame }) {
  const trap = frame.trap
  const links: ArrowLink[] = []
  if (frame.op && trap && frame.stage !== 'idle') {
    links.push({ from: 'px-op', to: `px-trap-${trap.name}`, tone: frame.stage === 'throw' ? 'danger' : trap.defined ? 'accent' : 'muted', dashed: !trap.defined })
    if (frame.stage === 'target') links.push({ from: `px-trap-${trap.name}`, to: 'px-target', tone: trap.defined ? 'success' : 'muted', dashed: !trap.defined })
  }
  return (
    <div className="viz-px viz-rel">
      <section className="viz-px-box" aria-label="Код, що звертається до proxy">
        <header className="viz-px-head">
          <VizGlyph icon="px:phone" /> Виклик
        </header>
        <AnimatePresence mode="wait" initial={false}>
          {frame.op ? (
            <m.div key={frame.op} className="viz-px-op" data-anchor="px-op" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={SPRING}>
              <code>{frame.op}</code>
              {frame.internal ? <span className="viz-px-internal">{frame.internal}</span> : null}
            </m.div>
          ) : (
            <m.span key="none" className="viz-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              операції ще немає
            </m.span>
          )}
        </AnimatePresence>
        {frame.result ? (
          <m.div key={`${frame.op}-${frame.result.text}`} className="viz-px-result" data-tone={frame.result.tone} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={SPRING}>
            {frame.result.tone === 'error' ? (
              '✕ кидає '
            ) : (
              <>
                <VizGlyph icon="pi:PiArrowBendUpLeftBold" size={14} />{' '}
              </>
            )}
            <code>{frame.result.text}</code>
          </m.div>
        ) : null}
      </section>

      <section className="viz-px-box" data-tone="proxy" aria-label="Проксі та handler" data-active={frame.stage === 'trap' || frame.stage === 'throw' ? '' : undefined}>
        <header className="viz-px-head">
          <VizGlyph icon="px:mirror" /> proxy · handler
        </header>
        <ul className="viz-px-traps">
          {SHOWN.map((name) => {
            const defined = DEFINED.has(name)
            const active = trap?.name === name && frame.stage !== 'idle'
            return (
              <li key={name} data-anchor={`px-trap-${name}`} data-defined={defined ? '' : undefined} data-active={active ? '' : undefined} data-tone={active && frame.stage === 'throw' ? 'danger' : undefined}>
                <code>{name}</code>
                <span className="viz-px-trap-state">{defined ? 'пастка ✓' : active ? 'немає → target' : '—'}</span>
                {active && defined && frame.args ? (
                  <span className="viz-px-args">
                    ({frame.args.map((a, i) => (
                      <code key={i}>
                        {a}
                        {i < frame.args!.length - 1 ? ', ' : ''}
                      </code>
                    ))})
                  </span>
                ) : null}
              </li>
            )
          })}
        </ul>
        <p className="viz-px-more">+ ще {TRAPS.length - SHOWN.length} пасток без обробників</p>
      </section>

      <section className="viz-px-box" data-tone="target" aria-label="Цільовий об’єкт" data-active={frame.stage === 'target' ? '' : undefined}>
        <header className="viz-px-head" data-anchor="px-target">
          <VizGlyph icon="px:target" /> target · user
        </header>
        <ul className="viz-vars">
          {frame.target.map((p) => (
            <li key={p.key} data-hit={p.hit ? '' : undefined}>
              <code className="viz-var-name">{p.key}</code>
              <span className="viz-var-eq" aria-hidden="true">
                :
              </span>
              <m.span key={p.value} className="viz-var-val" data-changed={p.changed ? '' : undefined} initial={p.changed ? { scale: 1.25 } : false} animate={{ scale: 1 }} transition={SPRING}>
                {p.value}
              </m.span>
            </li>
          ))}
        </ul>
      </section>
      <Arrows links={links} />
    </div>
  )
}

export function ProxyTrapsViz({ scenario }: VizProps) {
  const data = proxyTrapsScenarios[scenario] ?? proxyTrapsScenarios['get-set']!
  return <StepPlayer scenario={data} label="Proxy і пастки" side={(f) => <ProxyStage frame={f} />} below={(f) => <ConsolePanel lines={f.output} error={f.error} />} />
}
