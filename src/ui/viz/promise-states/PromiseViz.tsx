'use client'

import { ConsolePanel, Panel, TokenList } from '../engine/Panel'
import { StackPanel } from '../engine/StackPanel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { Combinators } from './Combinators'
import { Lifecycle } from './Lifecycle'
import { promiseScenarios, type PromiseBox } from './scenarios'

const EMOJI = { pending: '⏳', fulfilled: '✅', rejected: '❌' }

function Promises({ list }: { list: readonly PromiseBox[] }) {
  return (
    <Panel title="Проміси" emoji="🤞">
      <div className="viz-promises">
        {list.map((p) => (
          <div key={p.id} className="viz-promise-chip" data-state={p.state}>
            <span className="viz-promise-chip-id">{p.label}</span>
            <span>
              {EMOJI[p.state]} {p.state}
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
            <Panel title="Web APIs" emoji="🌐">
              <TokenList items={f.webApis} direction="row" tone="api" empty="нічого не чекає" />
            </Panel>
            <Panel title="Мікрозадачі" emoji="✨" tone="micro">
              <TokenList items={f.microtasks} direction="row" tone="micro" />
            </Panel>
          </div>
          <ConsolePanel lines={f.output} />
        </>
      )}
    />
  )
}
