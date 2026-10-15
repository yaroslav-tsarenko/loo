'use client'

import { AnimatePresence, m } from 'motion/react'
import { useState } from 'react'
import { Arrows, type ArrowLink } from '../engine/Arrows'
import { ConsolePanel, Panel, SPRING } from '../engine/Panel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { LOOKUP_PROPS, buildLookupScenario, prototypeScenarios, type LookupProp, type ProtoFrame, type ProtoObject } from './scenarios'

function walkedPath(frame: ProtoFrame): Set<string> {
  const visited = new Set<string>()
  if (!frame.from || !frame.cursor) return visited
  let id: string | null | undefined = frame.from
  while (id && id !== frame.cursor && !visited.has(id)) {
    visited.add(id)
    id = frame.objects.find((o) => o.id === id)?.proto
  }
  return visited
}

function ObjectCard({ obj, frame, visited }: { obj: ProtoObject; frame: ProtoFrame; visited: boolean }) {
  const isCursor = frame.cursor === obj.id
  const status = isCursor ? frame.status : visited ? 'miss' : undefined
  if (obj.id === 'null') {
    return (
      <m.div layout="position" className="viz-proto viz-proto-null" data-anchor="obj-null" data-status={status} transition={SPRING}>
        🚫 null
      </m.div>
    )
  }
  return (
    <m.div layout="position" className="viz-proto" data-anchor={`obj-${obj.id}`} data-status={status} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={SPRING}>
      <div className="viz-proto-head">
        <span aria-hidden="true">{obj.emoji}</span> {obj.label}
        {isCursor && frame.status === 'search' ? <span className="viz-proto-eye">🔍</span> : null}
      </div>
      <ul>
        {obj.props.map((p) => (
          <li key={p.key} data-hit={isCursor && frame.key === p.key && frame.status === 'found' ? '' : undefined}>
            <code>{p.key}</code>
            <span className="viz-var-val">{p.value}</span>
          </li>
        ))}
        {obj.props.length === 0 ? <li className="viz-empty">власних властивостей немає</li> : null}
      </ul>
    </m.div>
  )
}

function ProtoStage({ frame }: { frame: ProtoFrame }) {
  const visited = walkedPath(frame)
  const twoCols = frame.objects.some((o) => o.col === 0)
  const cols = twoCols ? [frame.objects.filter((o) => o.col === 0), frame.objects.filter((o) => o.col !== 0)] : [frame.objects]
  const links: ArrowLink[] = []
  for (const o of frame.objects) {
    if (o.proto) {
      const hot = (visited.has(o.id) || frame.cursor === o.id) && (visited.has(o.proto) || frame.cursor === o.proto)
      links.push({ from: `obj-${o.id}`, to: `obj-${o.proto}`, tone: hot ? 'accent' : 'muted' })
    }
    if (o.prototypeOf) links.push({ from: `obj-${o.id}`, to: `obj-${o.prototypeOf}`, tone: 'muted', dashed: true })
  }
  return (
    <Panel title="Об’єкти і [[Prototype]]" emoji="🧬" hint={frame.key ? `шукаємо «${frame.key}»` : twoCols ? '- - → .prototype' : undefined}>
      <div className="viz-rel viz-proto-cols" data-cols={cols.length}>
        {cols.map((col, i) => (
          <div key={i} className="viz-proto-col">
            {twoCols ? <span className="viz-proto-col-title">{i === 0 ? 'функції' : 'екземпляр і прототипи'}</span> : null}
            <AnimatePresence initial={false} mode="popLayout">
              {col.map((o) => (
                <ObjectCard key={o.id} obj={o} frame={frame} visited={visited.has(o.id)} />
              ))}
            </AnimatePresence>
          </div>
        ))}
        <Arrows links={links} />
      </div>
    </Panel>
  )
}

function Lookup() {
  const [prop, setProp] = useState<LookupProp>('walk')
  const scenario = buildLookupScenario(prop)
  return (
    <>
      <div className="viz-presets" role="group" aria-label="Яку властивість шукати">
        <span className="viz-presets-label">Шукати:</span>
        {LOOKUP_PROPS.map((p) => (
          <button key={p} type="button" className="viz-chip viz-chip-code" aria-pressed={p === prop} onClick={() => setProp(p)}>
            <code>bunny.{p}</code>
          </button>
        ))}
      </div>
      <StepPlayer key={prop} scenario={scenario} label="Пошук властивості" side={(f) => <ProtoStage frame={f} />} below={(f) => <ConsolePanel lines={f.output} />} />
    </>
  )
}

export function PrototypeViz({ scenario }: VizProps) {
  const data = prototypeScenarios[scenario]
  if (!data) return <Lookup />
  return <StepPlayer scenario={data} label="Прототипи" side={(f) => <ProtoStage frame={f} />} below={(f) => <ConsolePanel lines={f.output} />} />
}
