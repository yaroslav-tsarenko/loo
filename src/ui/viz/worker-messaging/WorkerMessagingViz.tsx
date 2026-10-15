'use client'

import { AnimatePresence, m } from 'motion/react'
import { Panel, SPRING, TokenList } from '../engine/Panel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { workerMessagingScenarios, type LogLine, type MemBlock, type ThreadLane, type Wire, type WorkerFrame } from './scenarios'

const STATUS: Record<ThreadLane['status'], string> = { run: '▶️ виконує', idle: '💤 чекає подій', load: '⏳ вантажить скрипт' }

function Memory({ blocks, max }: { blocks: readonly MemBlock[]; max: number }) {
  return (
    <ul className="viz-wk-mem">
      <AnimatePresence initial={false}>
        {blocks.map((b) => (
          <m.li key={b.id} layout="position" data-state={b.state} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={SPRING}>
            <code className="viz-var-name">{b.name}</code>
            <span className="viz-wk-detail">{b.detail}</span>
            {b.bytes !== undefined ? (
              <span className="viz-wk-bar" aria-hidden="true">
                <m.span initial={false} animate={{ width: `${(b.bytes / max) * 100}%` }} transition={SPRING} />
              </span>
            ) : null}
          </m.li>
        ))}
      </AnimatePresence>
      {blocks.length === 0 ? <li className="viz-empty">порожньо</li> : null}
    </ul>
  )
}

function Thread({ title, emoji, lane, max }: { title: string; emoji: string; lane: ThreadLane; max: number }) {
  return (
    <section className="viz-wk-lane" data-status={lane.status} aria-label={title}>
      <header className="viz-wk-head">
        <span aria-hidden="true">{emoji}</span>
        <span className="viz-wk-title">{title}</span>
        <span className="viz-wk-status">{STATUS[lane.status]}</span>
      </header>
      <div className="viz-wk-sub">🥞 зараз виконується</div>
      <TokenList items={lane.task ? [lane.task] : []} tone="stack" activeId={lane.task?.id ?? null} empty="стек порожній" />
      <div className="viz-wk-sub">📬 черга повідомлень</div>
      <TokenList items={lane.queue} direction="row" tone="macro" empty="порожньо" />
      <div className="viz-wk-sub">🧠 своя пам’ять</div>
      <Memory blocks={lane.memory} max={max} />
    </section>
  )
}

function WireView({ wire }: { wire: Wire | null }) {
  return (
    <div className="viz-wk-wire" aria-live="off">
      <AnimatePresence mode="wait" initial={false}>
        {wire ? (
          <m.div key={`${wire.dir}-${wire.mode}-${wire.detail}`} className="viz-wk-msg" data-mode={wire.mode} data-dir={wire.dir} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={SPRING}>
            <span className="viz-wk-arrow" aria-hidden="true">
              {wire.mode === 'error' ? '✕' : wire.mode === 'transfer' ? '🚚' : '📋'}
            </span>
            <strong>{wire.label}</strong>
            <span className="viz-wk-detail">{wire.detail}</span>
            <span className="viz-wk-dir">{wire.dir === 'to-worker' ? 'main → worker' : 'worker → main'}</span>
          </m.div>
        ) : (
          <m.span key="none" className="viz-wk-idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            postMessage
          </m.span>
        )}
      </AnimatePresence>
    </div>
  )
}

function Log({ lines }: { lines: readonly LogLine[] }) {
  return (
    <Panel title="Console" emoji="🖥️" className="viz-console">
      <div className="viz-console-lines" role="log" aria-label="Вивід консолі">
        <AnimatePresence initial={false}>
          {lines.map((l, i) => (
            <m.div key={`${i}:${l.text}`} className="viz-console-line" data-error={l.error ? '' : undefined} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={SPRING}>
              <span className="viz-console-caret" aria-label={l.from === 'main' ? 'головний потік' : 'воркер'}>
                {l.from === 'main' ? '🧵' : '⚙️'}
              </span>
              {l.text}
            </m.div>
          ))}
        </AnimatePresence>
        {lines.length === 0 ? <span className="viz-empty">поки тихо</span> : null}
      </div>
    </Panel>
  )
}

function Compare() {
  return (
    <m.div className="viz-wk-compare" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
      <div data-mode="clone">
        <strong>📋 Копія</strong>
        <span>8 МБ скопійовано</span>
        <span>час росте з розміром</span>
        <span>відправник зберігає дані</span>
      </div>
      <div data-mode="transfer">
        <strong>🚚 Передача</strong>
        <span>0 Б скопійовано</span>
        <span>O(1)</span>
        <span>відправник отримує detached</span>
      </div>
    </m.div>
  )
}

function Stage({ frame }: { frame: WorkerFrame }) {
  const max = Math.max(1, ...[...frame.main.memory, ...frame.worker.memory].map((b) => b.bytes ?? 0))
  return (
    <>
      <div className="viz-wk">
        <Thread title="Головний потік" emoji="🧵" lane={frame.main} max={max} />
        <WireView wire={frame.wire} />
        <Thread title="Воркер" emoji="⚙️" lane={frame.worker} max={max} />
      </div>
      {frame.compare ? <Compare /> : null}
    </>
  )
}

export function WorkerMessagingViz({ scenario }: VizProps) {
  const data = workerMessagingScenarios[scenario] ?? workerMessagingScenarios.postmessage!
  return <StepPlayer scenario={data} label="Обмін повідомленнями з воркером" side={(f) => <Log lines={f.log} />} below={(f) => <Stage frame={f} />} />
}
