'use client'

import { AnimatePresence, m } from 'motion/react'
import { Arrows, type ArrowLink } from '../engine/Arrows'
import { ConsolePanel, SPRING } from '../engine/Panel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { moduleGraphScenarios, type ModBinding, type ModBox, type ModLane, type ModPhase, type ModuleFrame } from './scenarios'

const PHASES: Array<{ id: ModPhase; label: string; emoji: string }> = [
  { id: 'construct', label: '1 · Побудова', emoji: '🧱' },
  { id: 'link', label: '2 · Зв’язування', emoji: '🔗' },
  { id: 'evaluate', label: '3 · Виконання', emoji: '▶️' },
]

const KIND: Record<ModBinding['kind'], string> = { let: 'let', function: 'ƒ', import: 'import', const: 'const', prop: 'prop', entry: 'key' }

const anchorOf = (ref: string) => `mod-${ref.replace('.', '-')}`

function PhaseBar({ phase }: { phase: ModPhase | null }) {
  return (
    <ol className="viz-phases" aria-label="Фаза завантаження модулів">
      {PHASES.map((p) => (
        <li key={p.id} data-on={p.id === phase ? '' : undefined} aria-current={p.id === phase ? 'step' : undefined}>
          <span aria-hidden="true">{p.emoji}</span> {p.label}
        </li>
      ))}
    </ol>
  )
}

function Box({ box }: { box: ModBox }) {
  return (
    <m.div layout="position" className="viz-mod-box" data-tone={box.tone} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={SPRING}>
      <div className="viz-mod-head" data-anchor={`mod-${box.id}`}>
        <span aria-hidden="true">{box.emoji}</span>
        <code className="viz-mod-file">{box.file}</code>
        {box.order ? <span className="viz-mod-order" aria-label={`виконано ${box.order}-м`}>#{box.order}</span> : null}
        {box.status ? <span className="viz-mod-status">{box.status}</span> : null}
      </div>
      <ul className="viz-mod-bindings">
        {box.bindings.map((b) => (
          <li key={b.name} data-state={b.state} data-anchor={`mod-${box.id}-${b.name}`}>
            <span className="viz-mod-kind">{KIND[b.kind]}</span>
            <code className="viz-var-name">{b.name}</code>
            <m.span key={b.value} className="viz-var-val" data-anchor={b.ref ? `src-${box.id}-${b.name}` : undefined} data-changed={b.changed ? '' : undefined} initial={b.changed ? { scale: 1.25 } : false} animate={{ scale: 1 }} transition={SPRING}>
              {b.value}
            </m.span>
          </li>
        ))}
        {box.bindings.length === 0 ? <li className="viz-empty">оточення ще не створено</li> : null}
      </ul>
    </m.div>
  )
}

function Lane({ lane, deps }: { lane: ModLane; deps?: ModuleFrame['deps'] }) {
  const ids = new Set(lane.boxes.map((b) => b.id))
  const links: ArrowLink[] = []
  for (const [from, to] of deps ?? []) if (ids.has(from) && ids.has(to)) links.push({ from: `mod-${from}`, to: `mod-${to}`, tone: 'muted', dashed: true })
  for (const box of lane.boxes) {
    for (const b of box.bindings) {
      if (!b.ref) continue
      links.push({ from: `src-${box.id}-${b.name}`, to: anchorOf(b.ref), tone: b.state === 'error' ? 'danger' : b.state === 'live' ? 'accent' : 'muted' })
    }
  }
  return (
    <section className="viz-panel viz-mod-lane" data-lane={lane.id} aria-label={lane.title}>
      <header className="viz-panel-head">
        <span aria-hidden="true">{lane.emoji}</span>
        <span>{lane.title}</span>
        {lane.hint ? <span className="viz-panel-hint">{lane.hint}</span> : null}
      </header>
      <div className="viz-mod-grid viz-rel">
        <AnimatePresence initial={false}>
          {lane.boxes.map((box) => (
            <Box key={box.id} box={box} />
          ))}
        </AnimatePresence>
        {lane.boxes.length === 0 ? <span className="viz-empty">дійде черга після CommonJS</span> : null}
        <Arrows links={links} />
      </div>
    </section>
  )
}

export function ModuleGraphViz({ scenario }: VizProps) {
  const data = moduleGraphScenarios[scenario] ?? moduleGraphScenarios['esm-live-binding']!
  const phased = data.frames.some((f) => f.phase !== null && f.lanes.length === 1)
  return (
    <StepPlayer
      scenario={data}
      label="Модулі"
      side={(f) => (
        <>
          {phased ? <PhaseBar phase={f.phase} /> : null}
          <ConsolePanel lines={f.output} error={f.error} />
        </>
      )}
      below={(f) => (
        <div className="viz-mod-lanes" data-count={f.lanes.length}>
          {f.lanes.map((lane) => (
            <Lane key={lane.id} lane={lane} deps={f.deps} />
          ))}
        </div>
      )}
    />
  )
}
