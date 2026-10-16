'use client'

import { ConsolePanel, Panel, TokenList, VizGlyph } from '../engine/Panel'
import { StackPanel } from '../engine/StackPanel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizIcon, VizProps } from '../engine/types'
import { eventLoopScenarios, type LoopPhase } from './scenarios'

const PHASES: Array<{ id: LoopPhase; label: string; icon: VizIcon }> = [
  { id: 'script', label: 'Скрипт', icon: 'px:scroll' },
  { id: 'micro', label: 'Мікрозадачі', icon: 'pi:PiSparkleFill' },
  { id: 'macro', label: 'Макрозадача', icon: 'px:alarm' },
  { id: 'idle', label: 'Очікування', icon: 'pi:PiMoonStarsFill' },
]

function PhaseBar({ phase }: { phase: LoopPhase }) {
  return (
    <ol className="viz-phases" aria-label="Фаза event loop">
      {PHASES.map((p) => (
        <li key={p.id} data-on={p.id === phase ? '' : undefined} aria-current={p.id === phase ? 'step' : undefined}>
          <VizGlyph icon={p.icon} size={14} /> {p.label}
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
          <Panel title="Web APIs" icon="px:globe" hint="таймери, fetch, DOM">
            <TokenList items={f.webApis} tone="api" empty="нічого не чекає" />
          </Panel>
        </>
      )}
      below={(f) => (
        <>
          <div className="viz-queues">
            <Panel title="Мікрозадачі" icon="pi:PiSparkleFill" hint="promise, await, queueMicrotask" tone="micro">
              <TokenList items={f.microtasks} direction="row" tone="micro" />
            </Panel>
            <Panel title="Макрозадачі" icon="px:alarm" hint="таймери, події, I/O" tone="macro">
              <TokenList items={f.macrotasks} direction="row" tone="macro" />
            </Panel>
          </div>
          <ConsolePanel lines={f.output} />
        </>
      )}
    />
  )
}
