'use client'

import { m } from 'motion/react'
import { Badge, Panel, SPRING } from '../engine/Panel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { FRAME_MS, STAGES, budget, type Block, type BlockKind } from './pipeline'
import { renderPipelineScenarios, type RenderFrame } from './scenarios'

const KIND_LABEL: Record<BlockKind, string> = {
  input: 'Input',
  js: 'JS',
  style: 'Style',
  layout: 'Layout',
  paint: 'Paint',
  composite: 'Composite',
  forced: 'Forced layout',
}

const STATE_LABEL = { run: 'зараз', done: 'готово', hit: 'потрібен', skip: 'пропуск' } as const

function Stages({ f }: { f: RenderFrame }) {
  return (
    <ol className="viz-rp-stages" aria-label="Етапи кадру">
      {STAGES.map((s) => {
        const state = f.stages[s.id]
        return (
          <li key={s.id} data-kind={s.id} data-state={state} aria-current={state === 'run' ? 'step' : undefined}>
            <span aria-hidden="true">{s.emoji}</span>
            <span className="viz-rp-stage-name">{s.label}</span>
            {state ? <span className="viz-rp-stage-state">{STATE_LABEL[state]}</span> : null}
          </li>
        )
      })}
    </ol>
  )
}

function BudgetBar({ blocks }: { blocks: readonly Block[] }) {
  const { used, over } = budget(blocks)
  const scale = Math.max(FRAME_MS * 1.3, used * 1.05)
  const pct = (ms: number) => `${(ms / scale) * 100}%`
  const kinds = [...new Set(blocks.map((b) => b.kind))]
  return (
    <Panel title="Бюджет кадру" emoji="⏱️" hint={`${used.toFixed(1)} / ${FRAME_MS.toFixed(1)} мс`} tone={over ? 'danger' : undefined}>
      <div className="viz-budget" data-over={over ? '' : undefined}>
        <div className="viz-budget-track" role="img" aria-label={`Використано ${used.toFixed(1)} мс із ${FRAME_MS.toFixed(1)}`}>
          {blocks.map((b) => (
            <m.span key={b.id} className="viz-budget-block" data-kind={b.kind} initial={{ width: 0, opacity: 0 }} animate={{ width: pct(b.ms), opacity: 1 }} transition={SPRING} title={`${KIND_LABEL[b.kind]} · ${b.ms} мс`}>
              {b.ms >= 2 ? KIND_LABEL[b.kind] : ''}
            </m.span>
          ))}
          <span className="viz-budget-line" style={{ left: pct(FRAME_MS) }} aria-hidden="true">
            <span>16.7</span>
          </span>
        </div>
        {kinds.length > 0 ? (
          <ul className="viz-budget-legend">
            {kinds.map((k) => (
              <li key={k} data-kind={k}>
                {KIND_LABEL[k]}
                {k === 'forced' ? ` ×${blocks.filter((b) => b.kind === 'forced').length}` : ''}
              </li>
            ))}
          </ul>
        ) : (
          <p className="viz-muted">кадр ще порожній</p>
        )}
      </div>
    </Panel>
  )
}

export function RenderPipelineViz({ scenario }: VizProps) {
  const data = renderPipelineScenarios[scenario] ?? renderPipelineScenarios.frame!
  return (
    <StepPlayer
      scenario={data}
      label="Конвеєр рендерингу"
      side={(f) => (
        <>
          <Stages f={f} />
          <div className="viz-web-flags">
            {f.prop ? (
              <Badge tone="accent">
                <code>style.{f.prop}</code>
              </Badge>
            ) : null}
            {f.thread ? <Badge tone={f.thread === 'compositor' ? 'success' : undefined}>{f.thread === 'compositor' ? '🧩 compositor-потік' : '🧵 головний потік'}</Badge> : null}
            {f.dirty !== undefined ? <Badge tone={f.dirty ? undefined : 'success'}>{f.dirty ? '📐 layout «брудний»' : '📐 layout актуальний'}</Badge> : null}
          </div>
          {f.warn ? (
            <m.p key={f.warn} className="viz-rp-warn" role="status" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
              {f.warn}
            </m.p>
          ) : null}
        </>
      )}
      below={(f) => <BudgetBar blocks={f.blocks} />}
    />
  )
}
