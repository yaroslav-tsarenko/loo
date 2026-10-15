'use client'

import { ConsolePanel, Panel, TokenList } from '../engine/Panel'
import { StackPanel } from '../engine/StackPanel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { eventLoopScenarios, type LoopPhase } from './scenarios'

const PHASES: Array<{ id: LoopPhase; label: string; emoji: string }> = [
  { id: 'script', label: 'Скрипт', emoji: '📜' },
  { id: 'micro', label: 'Мікрозадачі', emoji: '✨' },
  { id: 'macro', label: 'Макрозадача', emoji: '⏰' },
  { id: 'idle', label: 'Очікування', emoji: '💤' },
]

function PhaseBar({ phase }: { phase: LoopPhase }) {
  return (
    <ol className="viz-phases" aria-label="Фаза event loop">
      {PHASES.map((p) => (
        <li key={p.id} data-on={p.id === phase ? '' : undefined} aria-current={p.id === phase ? 'step' : undefined}>
          <span aria-hidden="true">{p.emoji}</span> {p.label}
        </li>
      ))}
    </ol>
  )
}

export function EventLoopViz({ scenario }: VizProps) {
  const data = eventLoopScenarios[scenario] ?? eventLoopScenarios['basic-timeout']!
  return (
    <StepPlayer
      scenario={data}
      label="Event loop"
      side={(f) => (
        <>
          <PhaseBar phase={f.phase} />
          <StackPanel stack={f.stack} />
          <Panel title="Web APIs" emoji="🌐" hint="таймери, fetch, DOM">
            <TokenList items={f.webApis} tone="api" empty="нічого не чекає" />
          </Panel>
        </>
      )}
      below={(f) => (
        <>
          <div className="viz-queues">
            <Panel title="Мікрозадачі" emoji="✨" hint="promise, await, queueMicrotask" tone="micro">
              <TokenList items={f.microtasks} direction="row" tone="micro" />
            </Panel>
            <Panel title="Макрозадачі" emoji="⏰" hint="таймери, події, I/O" tone="macro">
              <TokenList items={f.macrotasks} direction="row" tone="macro" />
            </Panel>
          </div>
          <ConsolePanel lines={f.output} />
        </>
      )}
    />
  )
}
