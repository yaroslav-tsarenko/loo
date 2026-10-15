'use client'

import { m } from 'motion/react'
import { ConsolePanel, Panel, SPRING } from '../engine/Panel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { findNode, pathTo, type DomNode, type EventPhase } from './dispatch'
import { eventPropagationScenarios, type PropFrame } from './scenarios'

const PHASES: Array<{ id: EventPhase; label: string }> = [
  { id: 1, label: '⬇ 1 capture' },
  { id: 2, label: '🎯 2 target' },
  { id: 3, label: '⬆ 3 bubble' },
]

function PhaseBar({ phase }: { phase: EventPhase }) {
  return (
    <ol className="viz-phases" aria-label="event.eventPhase">
      {PHASES.map((p) => (
        <li key={p.id} data-on={p.id === phase ? '' : undefined} aria-current={p.id === phase ? 'step' : undefined}>
          {p.label}
        </li>
      ))}
    </ol>
  )
}

function DomBox({ node, f, path }: { node: DomNode; f: PropFrame; path: readonly string[] }) {
  const listeners = f.listeners.filter((l) => l.node === node.id)
  const at = f.at === node.id
  return (
    <div
      className="viz-dom-node"
      data-at={at ? '' : undefined}
      data-phase={at ? f.phase : undefined}
      data-path={path.includes(node.id) ? '' : undefined}
      data-target={f.target === node.id ? '' : undefined}
      data-hit={f.hit === node.id ? '' : undefined}
      data-done={f.done?.includes(node.id) ? '' : undefined}
      data-stopped={at && f.stopped ? '' : undefined}
    >
      <div className="viz-dom-head">
        <code className="viz-dom-tag">{node.tag}</code>
        {node.text ? <span className="viz-dom-text">{node.text}</span> : null}
        {at ? <m.span layoutId="ev-dot" className="viz-dom-dot" transition={SPRING} aria-label="подія тут" /> : null}
        {listeners.length > 0 ? (
          <span className="viz-dom-ls">
            {listeners.map((l) => (
              <span key={l.id} className="viz-dom-l" data-cap={l.capture ? '' : undefined} data-stop={l.stops ? '' : undefined} data-ran={f.ran.includes(l.id) ? '' : undefined}>
                {l.capture ? '⬇' : '⬆'} {l.label}
              </span>
            ))}
          </span>
        ) : null}
      </div>
      {node.children ? (
        <div className="viz-dom-kids">
          {node.children.map((c) => (
            <DomBox key={c.id} node={c} f={f} path={path} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function tagOf(tree: DomNode, id: string | null): string {
  if (!id) return 'null'
  return findNode(tree, id)?.tag ?? id
}

function EventInfo({ f }: { f: PropFrame }) {
  const current = f.phase === 0 ? null : f.at
  const rows: Array<[string, string]> = [
    ['event.target', tagOf(f.tree, f.target)],
    ['event.currentTarget', tagOf(f.tree, current)],
    ['event.eventPhase', String(f.phase)],
  ]
  return (
    <Panel title="Об’єкт події" emoji="📨" hint={f.stopped ? '⛔ stopPropagation' : undefined} tone={f.stopped ? 'danger' : undefined}>
      <dl className="viz-ev-kv">
        {rows.map(([k, v]) => (
          <div key={k} data-same={k === 'event.currentTarget' && current !== null && current === f.target ? '' : undefined}>
            <dt>
              <code>{k}</code>
            </dt>
            <dd>
              <code>{v}</code>
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  )
}

export function EventPropagationViz({ scenario }: VizProps) {
  const data = eventPropagationScenarios[scenario] ?? eventPropagationScenarios['capture-bubble']!
  return (
    <StepPlayer
      scenario={data}
      label="Поширення подій"
      side={(f) => (
        <>
          <PhaseBar phase={f.phase} />
          <div className="viz-dom" aria-label="DOM-дерево і шлях події">
            <DomBox node={f.tree} f={f} path={f.target ? pathTo(f.tree, f.target) : []} />
          </div>
        </>
      )}
      below={(f) => (
        <div className="viz-web-duo">
          <EventInfo f={f} />
          <ConsolePanel lines={f.output} />
        </div>
      )}
    />
  )
}
