'use client'

import { useRef, useState, type ReactNode, type SyntheticEvent } from 'react'
import { cx } from '@/ui/design/cx'

interface Tip {
  value: string
  label: string
  x: number
  y: number
  edge?: 'start' | 'end'
  below: boolean
}

// One tooltip for a whole chart: any descendant with data-tip (value, the strong part) and data-tip-label (what it
// is) shows it on hover, tap or keyboard focus. Text comes from attributes and renders as text — never as HTML.
export function ChartTips({ children, className }: { children: ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [tip, setTip] = useState<Tip | null>(null)

  const show = (e: SyntheticEvent) => {
    const target = (e.target as Element).closest<HTMLElement | SVGElement>('[data-tip]')
    const root = box.current
    if (!target || !root || !root.contains(target)) return
    const r = target.getBoundingClientRect()
    const b = root.getBoundingClientRect()
    // visible offset decides the edge; scroll offset places it inside a scrolled box (the heatmap)
    const visible = r.left + r.width / 2 - b.left
    const edge = visible < 70 ? 'start' : visible > b.width - 70 ? 'end' : undefined
    // near the top of a clipping box (the heatmap scrolls) the tip goes under the mark
    const below = r.top - b.top < 56
    const y = (below ? r.bottom : r.top) - b.top + root.scrollTop
    setTip({ value: target.dataset.tip ?? '', label: target.dataset.tipLabel ?? '', x: visible + root.scrollLeft, y, edge, below })
  }
  const hide = () => setTip(null)

  return (
    <div ref={box} className={cx('st-tips', className)} onPointerOver={show} onFocus={show} onPointerLeave={hide} onBlur={hide}>
      {children}
      {tip ? (
        <div className="st-tip" aria-hidden="true" style={{ left: tip.x, top: tip.y }} data-edge={tip.edge} data-below={tip.below ? '' : undefined}>
          <strong>{tip.value}</strong>
          {tip.label ? <span>{tip.label}</span> : null}
        </div>
      ) : null}
    </div>
  )
}
