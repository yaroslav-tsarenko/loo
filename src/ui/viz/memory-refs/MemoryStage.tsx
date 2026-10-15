'use client'

import { AnimatePresence, m } from 'motion/react'
import { Arrows, type ArrowLink } from '../engine/Arrows'
import { SPRING } from '../engine/Panel'
import type { HeapObj, MemFrame, MemValue } from './scenarios'

function Value({ value, anchor, heap }: { value: MemValue; anchor: string; heap: readonly HeapObj[] }) {
  if ('prim' in value) return <span className="viz-var-val">{value.prim}</span>
  const target = heap.find((h) => h.id === value.ref)
  return (
    <span className="viz-ref" data-anchor={anchor}>
      → {target ? target.label.split(' ')[0] : '?'}
    </span>
  )
}

// Stack (or GC roots) on the left, heap on the right, references as arrows.
export function MemoryStage({ frame, rootsTitle = 'Стек · змінні', rootsEmoji = '🗂️' }: { frame: MemFrame; rootsTitle?: string; rootsEmoji?: string }) {
  const links: ArrowLink[] = []
  for (const s of frame.stack) if ('ref' in s.value) links.push({ from: `slot-${s.name}`, to: `heap-${s.value.ref}`, tone: 'accent' })
  for (const h of frame.heap) {
    for (const f of h.fields) {
      if ('ref' in f.value) links.push({ from: `field-${h.id}-${f.key}`, to: `heap-${f.value.ref}`, tone: h.state === 'unreachable' ? 'danger' : h.state === 'reachable' ? 'success' : 'muted' })
    }
  }
  return (
    <div className="viz-mem viz-rel">
      <section className="viz-mem-col" aria-label={rootsTitle}>
        <header className="viz-panel-head">
          <span aria-hidden="true">{rootsEmoji}</span> {rootsTitle}
        </header>
        <ul className="viz-slots">
          <AnimatePresence initial={false}>
            {frame.stack.map((s) => (
              <m.li key={s.name} layout="position" data-changed={s.changed ? '' : undefined} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={SPRING}>
                <code className="viz-var-name">{s.name}</code>
                <Value value={s.value} anchor={`slot-${s.name}`} heap={frame.heap} />
              </m.li>
            ))}
          </AnimatePresence>
          {frame.stack.length === 0 ? <li className="viz-empty">порожньо</li> : null}
        </ul>
      </section>
      <section className="viz-mem-col" aria-label="Купа · об’єкти">
        <header className="viz-panel-head">
          <span aria-hidden="true">🧺</span> Купа · об’єкти
        </header>
        <div className="viz-heap">
          <AnimatePresence initial={false} mode="popLayout">
            {frame.heap.map((h) => (
              <m.div key={h.id} layout="position" className="viz-obj" data-anchor={`heap-${h.id}`} data-state={h.state} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: h.state === 'unreachable' ? 0.55 : 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6, filter: 'blur(2px)' }} transition={SPRING}>
                <div className="viz-obj-head">
                  <span aria-hidden="true">{h.emoji}</span> {h.label}
                  {h.state === 'unreachable' ? <span className="viz-obj-flag">недосяжний</span> : null}
                </div>
                <ul>
                  {h.fields.map((f) => (
                    <li key={f.key} data-changed={f.changed ? '' : undefined}>
                      <code>{f.key}</code>
                      <Value value={f.value} anchor={`field-${h.id}-${f.key}`} heap={frame.heap} />
                    </li>
                  ))}
                  {h.fields.length === 0 ? <li className="viz-empty">—</li> : null}
                </ul>
              </m.div>
            ))}
          </AnimatePresence>
          {frame.heap.length === 0 ? <span className="viz-empty">поки порожньо</span> : null}
        </div>
      </section>
      <Arrows links={links} />
    </div>
  )
}
