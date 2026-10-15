'use client'

import { AnimatePresence, m } from 'motion/react'
import { Badge, ConsolePanel, Panel, SPRING, TokenList } from '../engine/Panel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { SW_STATES } from './lifecycle'
import { serviceWorkerScenarios, type SwFrame, type SwWorker } from './scenarios'

function WorkerCard({ w, f }: { w: SwWorker; f: SwFrame }) {
  const waiting = w.state === 'installed' && f.workers.some((x) => x.id !== w.id && x.state === 'activated')
  const controls = f.tabs.filter((t) => t.controller === w.id).length
  return (
    <m.div layout="position" className="viz-sw-card" data-state={w.state} transition={SPRING}>
      <div className="viz-sw-card-head">
        <span>
          <span aria-hidden="true">⚙️</span> <code>{w.label}</code>
        </span>
        {waiting ? <Badge>⏳ waiting</Badge> : null}
        {controls > 0 ? <Badge tone="success">керує: {controls}</Badge> : null}
      </div>
      <ol className="viz-machine viz-sw-states" aria-label={`Стан ${w.label}`}>
        {SW_STATES.map((s) => (
          <li key={s.id} className="viz-machine-node" data-on={s.id === w.state ? '' : undefined} data-sw={s.id} aria-current={s.id === w.state ? 'step' : undefined}>
            {s.label}
          </li>
        ))}
      </ol>
    </m.div>
  )
}

function FetchFlow({ f }: { f: SwFrame }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {f.fetch ? (
        <m.div key={f.fetch.url} className="viz-sw-fetch" data-from={f.fetch.from} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={SPRING}>
          <code>{f.fetch.url}</code>
          <span aria-hidden="true">→</span>
          <span>⚙️ fetch</span>
          <span aria-hidden="true">→</span>
          <span>{f.fetch.from === 'cache' ? '🗄️ кеш ✅' : '🌐 мережа'}</span>
        </m.div>
      ) : null}
    </AnimatePresence>
  )
}

export function ServiceWorkerViz({ scenario }: VizProps) {
  const data = serviceWorkerScenarios[scenario] ?? serviceWorkerScenarios.lifecycle!
  return (
    <StepPlayer
      scenario={data}
      label="Життєвий цикл Service Worker"
      side={(f) => (
        <>
          <div className="viz-web-flags">{f.event ? <Badge tone="accent">📣 подія {f.event}</Badge> : <Badge>подій немає</Badge>}</div>
          {f.workers.map((w) => (
            <WorkerCard key={w.id} w={w} f={f} />
          ))}
          <FetchFlow f={f} />
        </>
      )}
      below={(f) => (
        <>
          <div className="viz-web-duo">
            <Panel title="Вкладки" emoji="🗂️" hint="controller">
              <TokenList items={f.tabs.map((t) => ({ id: `tab-${t.id}`, label: `🗂️ ${t.label}`, hint: t.controller ? `контролює ${t.controller}` : 'не контрольована' }))} empty="усі закрито" />
            </Panel>
            <Panel title="Cache Storage" emoji="🗄️">
              <TokenList items={f.caches} tone="api" empty="порожньо" />
            </Panel>
          </div>
          <ConsolePanel lines={f.output} />
        </>
      )}
    />
  )
}
