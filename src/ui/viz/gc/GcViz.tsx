'use client'

import { AnimatePresence, m } from 'motion/react'
import { RotateCcw } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { Panel } from '../engine/Panel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { MemoryStage } from '../memory-refs/MemoryStage'
import type { HeapObj } from '../memory-refs/scenarios'
import { EDGES, NODES, markOrder, type GraphEdge } from './graph'
import { gcScenarios } from './scenarios'

type Phase = 'idle' | 'marking' | 'marked' | 'swept'
const R = 19

const nodeById = new Map(NODES.map((n) => [n.id, n]))
const hasReverse = (e: GraphEdge) => EDGES.some((x) => x.from === e.to && x.to === e.from)

function edgePath(e: GraphEdge): { d: string; mx: number; my: number } {
  const a = nodeById.get(e.from)!
  const b = nodeById.get(e.to)!
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const bend = hasReverse(e) ? 12 : 0
  const x1 = a.x + ux * R
  const y1 = a.y + uy * R
  const x2 = b.x - ux * (R + 4)
  const y2 = b.y - uy * (R + 4)
  const cx = (x1 + x2) / 2 - uy * bend * 2
  const cy = (y1 + y2) / 2 + ux * bend * 2
  return { d: `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`, mx: (x1 + 2 * cx + x2) / 4, my: (y1 + 2 * cy + y2) / 4 }
}

function Reachability() {
  const [cut, setCut] = useState<ReadonlySet<string>>(new Set())
  const [gone, setGone] = useState<ReadonlySet<string>>(new Set())
  const [phase, setPhase] = useState<Phase>('idle')
  const [shown, setShown] = useState(0)
  const [swept, setSwept] = useState<string[]>([])
  const markerId = useId().replace(/:/g, '')
  const order = markOrder(cut, gone)
  const marking = phase === 'marking' || phase === 'marked'
  const marked = new Set(marking ? order.slice(0, shown) : [])
  const garbage = NODES.filter((n) => !n.root && !gone.has(n.id) && !order.includes(n.id))

  useEffect(() => {
    if (phase !== 'marking') return
    const t = window.setTimeout(() => {
      if (shown < order.length) setShown(shown + 1)
      else setPhase('marked')
    }, 420)
    return () => window.clearTimeout(t)
  }, [phase, shown, order.length])

  const toggle = (id: string) => {
    if (phase === 'marking') return
    setCut((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setPhase('idle')
    setShown(0)
  }
  const mark = () => {
    setShown(0)
    setPhase('marking')
  }
  const sweep = () => {
    setSwept(garbage.map((n) => n.id))
    setGone(new Set([...gone, ...garbage.map((n) => n.id)]))
    setPhase('swept')
  }
  const reset = () => {
    setCut(new Set())
    setGone(new Set())
    setPhase('idle')
    setShown(0)
    setSwept([])
  }

  let note: string
  if (phase === 'marking') note = 'Mark: обходимо граф від коренів (globalThis і стек) і позначаємо все, до чого можна дійти.'
  else if (phase === 'marked') note = garbage.length > 0 ? `Позначено ${order.length - 2} об’єкт(ів). Непозначені — ${garbage.map((n) => n.emoji).join(' ')} — недосяжні, тобто сміття.` : 'Усе досяжне — сміття немає. Переріж якесь посилання ✂️ і спробуй знову.'
  else if (phase === 'swept') {
    const cycle = swept.includes('parent') && swept.includes('child')
    note = swept.length > 0 ? `Sweep звільнив ${swept.map((id) => nodeById.get(id)!.emoji).join(' ')}.${cycle ? ' Цикл 👨 ↔ 👶 теж прибрано: для mark & sweep важлива досяжність, а не те, чи посилаються об’єкти одне на одного.' : ''}` : 'Нічого не звільнено: усе було досяжним.'
  } else note = '🗑️ temp ні від кого не досяжний з самого початку. Переріж посилання ✂️ (на схемі або кнопками нижче) і запусти Mark.'

  return (
    <div className="viz-gc">
      <div className="viz-gc-graph">
        <svg viewBox="0 0 370 280" role="img" aria-label="Граф об’єктів: корені globalThis і стек">
          <defs>
            <marker id={`${markerId}-a`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
              <path d="M0,1 L9,5 L0,9 z" className="viz-gc-arrowhead" />
            </marker>
          </defs>
          {EDGES.map((e) => {
            if (gone.has(e.from) || gone.has(e.to)) return null
            const { d, mx, my } = edgePath(e)
            const isCut = cut.has(e.id)
            const hot = marked.has(e.from) && marked.has(e.to) && !isCut
            return (
              <g key={e.id} className="viz-gc-edge" data-cut={isCut ? '' : undefined} data-hot={hot ? '' : undefined}>
                <path d={d} markerEnd={isCut ? undefined : `url(#${markerId}-a)`} />
                <path d={d} className="viz-gc-hit" onClick={() => toggle(e.id)}>
                  <title>{`${isCut ? 'Відновити' : 'Перерізати'} ${e.label}`}</title>
                </path>
                {isCut ? (
                  <text x={mx} y={my + 5} textAnchor="middle" className="viz-gc-scissors">
                    ✂️
                  </text>
                ) : null}
              </g>
            )
          })}
          <AnimatePresence>
            {NODES.filter((n) => !gone.has(n.id)).map((n) => {
              const isMarked = marked.has(n.id)
              const isGarbage = phase === 'marked' && garbage.some((g) => g.id === n.id)
              return (
                <m.g key={n.id} className="viz-gc-node" data-root={n.root ? '' : undefined} data-marked={isMarked ? '' : undefined} data-garbage={isGarbage ? '' : undefined} initial={false} exit={{ opacity: 0, scale: 0.3 }} style={{ transformOrigin: `${n.x}px ${n.y}px` }} transition={{ duration: 0.5 }}>
                  <circle cx={n.x} cy={n.y} r={R} />
                  <text x={n.x} y={n.y + 6} textAnchor="middle" className="viz-gc-emoji">
                    {n.emoji}
                  </text>
                  <text x={n.x} y={n.y + R + 13} textAnchor="middle" className="viz-gc-label">
                    {n.label}
                  </text>
                  {isMarked ? (
                    <text x={n.x + R - 2} y={n.y - R + 6} textAnchor="middle" className="viz-gc-check">
                      ✓
                    </text>
                  ) : null}
                </m.g>
              )
            })}
          </AnimatePresence>
        </svg>
      </div>
      <div className="viz-gc-edges" role="group" aria-label="Посилання між об’єктами">
        {EDGES.filter((e) => !gone.has(e.from) && !gone.has(e.to)).map((e) => (
          <button key={e.id} type="button" className="viz-chip viz-chip-code" aria-pressed={cut.has(e.id)} onClick={() => toggle(e.id)} disabled={phase === 'marking'}>
            <span aria-hidden="true">{cut.has(e.id) ? '✂️' : '🔗'}</span> <code>{e.label}</code>
          </button>
        ))}
      </div>
      <div className="viz-row">
        <button type="button" className="viz-btn viz-btn-text" data-primary="" onClick={mark} disabled={phase === 'marking'}>
          🔍 Mark
        </button>
        <button type="button" className="viz-btn viz-btn-text" onClick={sweep} disabled={phase !== 'marked' || garbage.length === 0}>
          🧹 Sweep
        </button>
        <button type="button" className="viz-btn viz-btn-text" onClick={reset} aria-label="Відновити граф">
          <RotateCcw size={16} strokeWidth={1.8} /> Скинути
        </button>
      </div>
      <div className="viz-note">
        <span className="viz-note-step" aria-hidden="true">
          💬
        </span>
        <p aria-live="polite">{note}</p>
      </div>
    </div>
  )
}

function MemoryGauge({ heap }: { heap: readonly HeapObj[] }) {
  const big = heap.find((h) => h.id === 'arr')
  const status = !big ? 'звільнено ✨' : big.state === 'unreachable' ? 'недосяжний — чекає на GC' : big.state === 'reachable' ? 'досяжний від window — живе' : 'щойно створено'
  return (
    <Panel title="Пам’ять" emoji="📊" tone={big?.state === 'reachable' ? 'danger' : undefined}>
      <div className="viz-gauge" data-full={big ? '' : undefined} data-state={big?.state}>
        <span style={{ width: big ? '82%' : '8%' }} />
      </div>
      <p className="viz-muted">📦 big (~мегабайти): {status}</p>
    </Panel>
  )
}

export function GcViz({ scenario }: VizProps) {
  const data = gcScenarios[scenario]
  if (!data) return <Reachability />
  return <StepPlayer scenario={data} label="Витік пам’яті" side={(f) => <MemoryGauge heap={f.heap} />} below={(f) => <MemoryStage frame={f} rootsTitle="Корені GC" rootsEmoji="🌱" />} />
}
