'use client'

import { ConsolePanel, Panel, TokenList, VizGlyph } from '../engine/Panel'
import { StackPanel } from '../engine/StackPanel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { Combinators } from './Combinators'
import { Lifecycle } from './Lifecycle'
import { STATE_ICON, promiseScenarios, type PromiseBox } from './scenarios'


function Promises({ list }: { list: readonly PromiseBox[] }) {
  return (
    <Panel title="Проміси" icon="px:hourglass">
      <div className="viz-promises">
        {list.map((p) => (
          <div key={p.id} className="viz-promise-chip" data-state={p.state}>
            <span className="viz-promise-chip-id">{p.label}</span>
            <span>
              <VizGlyph icon={STATE_ICON[p.state]} size={14} /> {p.state}
            </span>
            {p.value !== undefined ? <code>{p.value}</code> : null}
          </div>
        ))}
      </div>
    </Panel>
  )
}

export function PromiseViz({ scenario }: VizProps) {
  if (scenario === 'combinators') return <Combinators />
  const data = promiseScenarios[scenario]
  if (!data) return <Lifecycle />
  return (
    <StepPlayer
      scenario={data}
      label="Ланцюжок промісів"
      side={(f) => (
        <>
          <Promises list={f.promises} />
          <StackPanel stack={f.stack} />
        </>
      )}
      below={(f) => (
        <>
          <div className="viz-queues">
            <Panel title="Web APIs" icon="px:globe">
              <TokenList items={f.webApis} direction="row" tone="api" empty="нічого не чекає" />
            </Panel>
            <Panel title="Мікрозадачі" icon="pi:PiSparkleFill" tone="micro">
              <TokenList items={f.microtasks} direction="row" tone="micro" />
            </Panel>
          </div>
          <ConsolePanel lines={f.output} />
        </>
      )}
    />
  )
}
