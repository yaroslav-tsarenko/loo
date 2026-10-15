'use client'

import { AnimatePresence, m } from 'motion/react'
import { Badge, Panel, SPRING } from '../engine/Panel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { IC_SHAPES, inlineCacheScenario, shapesScenario, type IcFrame, type IcState, type MapNode, type ObjCard, type ShapeFrame } from './scenarios'

// ── shapes ────────────────────────────────────────────────────────

function ObjChip({ o, active }: { o: ObjCard; active: boolean }) {
  return (
    <m.span layoutId={`hc-obj-${o.id}`} className="viz-hc-obj" data-active={active ? '' : undefined} transition={SPRING}>
      {o.name}
    </m.span>
  )
}

function MapRow({ node, frame, depth }: { node: MapNode; frame: ShapeFrame; depth: number }) {
  const children = frame.maps.filter((n) => n.parent === node.id)
  const here = frame.objects.filter((o) => o.map === node.id)
  const hot = frame.hot === node.id ? frame.event : undefined
  return (
    <li className="viz-hc-branch" style={{ ['--depth' as string]: depth }}>
      <m.div className="viz-hc-map" data-hot={hot} layout="position" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={SPRING}>
        {node.via ? <span className="viz-hc-via">+{node.via}</span> : null}
        <span className="viz-hc-map-id">{node.id}</span>
        <code className="viz-hc-props">{node.props.length ? `{ ${node.props.map((p, i) => `${p}:${i}`).join(', ')} }` : '{ }'}</code>
        <span className="viz-hc-objs">
          {here.map((o) => (
            <ObjChip key={o.id} o={o} active={frame.activeObj === o.id} />
          ))}
        </span>
      </m.div>
      {children.length ? (
        <ul className="viz-hc-children">
          {children.map((c) => (
            <MapRow key={c.id} node={c} frame={frame} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

function ShapesStage({ f }: { f: ShapeFrame }) {
  const roots = f.maps.filter((n) => n.parent === null)
  const dict = f.objects.filter((o) => o.map === null)
  return (
    <Panel title="Дерево переходів форм" emoji="🌳" hint="ключ:слот">
      <ul className="viz-hc-tree" aria-label="Форми (hidden classes) і переходи між ними">
        {roots.map((r) => (
          <MapRow key={r.id} node={r} frame={f} depth={0} />
        ))}
      </ul>
      <AnimatePresence initial={false}>
        {dict.length ? (
          <m.div className="viz-hc-dict" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={SPRING}>
            <span>🐢 dictionary mode</span>
            <span className="viz-hc-objs">
              {dict.map((o) => (
                <ObjChip key={o.id} o={o} active={f.activeObj === o.id} />
              ))}
            </span>
          </m.div>
        ) : null}
      </AnimatePresence>
    </Panel>
  )
}

function Objects({ f }: { f: ShapeFrame }) {
  return (
    <Panel title="Об’єкти" emoji="📦" hint="форма + значення у слотах">
      <ul className="viz-hc-cards">
        {f.objects.map((o) => (
          <li key={o.id} className="viz-hc-card" data-active={f.activeObj === o.id ? '' : undefined} data-dict={o.map === null ? '' : undefined}>
            <div className="viz-hc-card-head">
              <strong>{o.name}</strong>
              {o.map ? <Badge tone="accent">→ {o.map}</Badge> : <Badge>🐢 хеш-таблиця</Badge>}
            </div>
            <ul className="viz-hc-slots">
              {o.values.map((v, i) => (
                <li key={v.key}>
                  <span className="viz-muted">{o.map ? `[${i}]` : `"${v.key}"`}</span>
                  <code>
                    {v.key}: {v.value}
                  </code>
                </li>
              ))}
              {o.values.length === 0 ? <li className="viz-empty">порожньо</li> : null}
            </ul>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

// ── inline cache ──────────────────────────────────────────────────

const STATES: Array<{ id: IcState; label: string }> = [
  { id: 'uninitialized', label: 'uninitialized' },
  { id: 'monomorphic', label: 'mono · 1' },
  { id: 'polymorphic', label: 'poly · 2–4' },
  { id: 'megamorphic', label: 'mega · 5+' },
]

function IcStage({ f }: { f: IcFrame }) {
  return (
    <Panel title="Feedback vector функції getX" emoji="🗂️" hint="спрощено">
      <ol className="viz-phases viz-hc-states" aria-label="Стан inline cache">
        {STATES.map((s) => (
          <li key={s.id} data-on={s.id === f.state ? '' : undefined} data-state={s.id} aria-current={s.id === f.state ? 'step' : undefined}>
            {s.label}
          </li>
        ))}
      </ol>
      <div className="viz-hc-table" role="table" aria-label="Слоти feedback vector">
        <div role="row" className="viz-hc-tr viz-muted">
          <span role="columnheader">слот</span>
          <span role="columnheader">доступ</span>
          <span role="columnheader">стан і кеш: форма → слот x</span>
        </div>
        <div role="row" className="viz-hc-tr">
          <code role="cell">#0</code>
          <code role="cell">o.x</code>
          <span role="cell" className="viz-hc-cache">
            <span className="viz-hc-state" data-state={f.state}>
              {f.state}
            </span>
            <AnimatePresence initial={false} mode="popLayout">
              {f.entries.map((e) => (
                <m.code key={e.map} className="viz-hc-entry" data-hit={f.current === e.map && f.hit ? '' : undefined} layout="position" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={SPRING}>
                  {e.map} → [{e.slot}]
                </m.code>
              ))}
            </AnimatePresence>
            {f.state === 'megamorphic' ? <span className="viz-hc-entry" data-global="">🌐 глобальний stub cache</span> : null}
          </span>
        </div>
      </div>
    </Panel>
  )
}

function IcShapes({ f }: { f: IcFrame }) {
  return (
    <Panel title="Форми аргументів" emoji="🧩" hint={`побачено: ${f.seen.length}`}>
      <ul className="viz-hc-shapes">
        {IC_SHAPES.map((s) => {
          const seen = f.seen.includes(s.id)
          const current = f.current === s.id
          return (
            <li key={s.id} data-seen={seen ? '' : undefined} data-current={current ? '' : undefined}>
              <strong>{s.id}</strong>
              <code>{s.literal}</code>
              <span className="viz-muted">x у слоті {s.props.indexOf('x')}</span>
              {current && f.hit !== null ? <Badge tone={f.hit ? 'success' : undefined}>{f.hit ? 'хіт' : 'промах'}</Badge> : null}
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}

export function HiddenClassesViz({ scenario }: VizProps) {
  if (scenario === 'inline-cache') {
    return <StepPlayer scenario={inlineCacheScenario} label="Inline cache" side={(f) => <IcStage f={f} />} below={(f) => <IcShapes f={f} />} />
  }
  return <StepPlayer scenario={shapesScenario} label="Hidden classes" side={(f) => <ShapesStage f={f} />} below={(f) => <Objects f={f} />} />
}
