'use client'

import { useEffect, useId, useRef, useState } from 'react'

export interface ArrowLink {
  from: string
  to: string
  tone?: 'accent' | 'muted' | 'danger' | 'success'
  dashed?: boolean
}

interface Drawn {
  key: string
  d: string
  tone: string
  dashed: boolean
}

interface Box {
  left: number
  top: number
  right: number
  bottom: number
  cx: number
  cy: number
}

function boxOf(el: Element, host: DOMRect): Box {
  const r = el.getBoundingClientRect()
  const left = r.left - host.left
  const top = r.top - host.top
  return { left, top, right: left + r.width, bottom: top + r.height, cx: left + r.width / 2, cy: top + r.height / 2 }
}

function pathBetween(a: Box, b: Box): string {
  const gap = 6
  // target to the right
  if (b.left >= a.right - 4) {
    const x1 = a.right + 2
    const x2 = b.left - gap
    const dx = Math.max(24, (x2 - x1) / 2)
    return `M${x1},${a.cy} C${x1 + dx},${a.cy} ${x2 - dx},${b.cy} ${x2},${b.cy}`
  }
  // target to the left
  if (b.right <= a.left + 4) {
    const x1 = a.left - 2
    const x2 = b.right + gap
    const dx = Math.max(24, (x1 - x2) / 2)
    return `M${x1},${a.cy} C${x1 - dx},${a.cy} ${x2 + dx},${b.cy} ${x2},${b.cy}`
  }
  // below / above: vertical curve
  if (b.top >= a.cy) {
    const y1 = a.bottom + 2
    const y2 = b.top - gap
    const dy = Math.max(18, (y2 - y1) / 2)
    return `M${a.cx},${y1} C${a.cx},${y1 + dy} ${b.cx},${y2 - dy} ${b.cx},${y2}`
  }
  const y1 = a.top - 2
  const y2 = b.bottom + gap
  const dy = Math.max(18, (y1 - y2) / 2)
  return `M${a.cx},${y1} C${a.cx},${y1 - dy} ${b.cx},${y2 + dy} ${b.cx},${y2}`
}

// SVG overlay that connects elements marked with `data-anchor` inside the parent
// (which must be position: relative). Re-measures while layout animations run.
export function Arrows({ links }: { links: readonly ArrowLink[] }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [drawn, setDrawn] = useState<Drawn[]>([])
  const markerId = useId().replace(/:/g, '')
  const spec = JSON.stringify(links)

  useEffect(() => {
    const svg = svgRef.current
    const host = svg?.parentElement
    if (!svg || !host) return
    const list = JSON.parse(spec) as ArrowLink[]
    let raf = 0
    let until = performance.now() + 900
    const measure = () => {
      const hostBox = host.getBoundingClientRect()
      const next: Drawn[] = []
      for (const link of list) {
        const a = host.querySelector(`[data-anchor="${CSS.escape(link.from)}"]`)
        const b = host.querySelector(`[data-anchor="${CSS.escape(link.to)}"]`)
        if (!a || !b) continue
        next.push({ key: `${link.from}->${link.to}`, d: pathBetween(boxOf(a, hostBox), boxOf(b, hostBox)), tone: link.tone ?? 'accent', dashed: Boolean(link.dashed) })
      }
      setDrawn((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next))
    }
    const loop = () => {
      measure()
      if (performance.now() < until) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    const ro = new ResizeObserver(() => {
      until = performance.now() + 400
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(loop)
    })
    ro.observe(host)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [spec])

  return (
    <svg ref={svgRef} className="viz-arrows" aria-hidden="true">
      <defs>
        {['accent', 'muted', 'danger', 'success'].map((tone) => (
          <marker key={tone} id={`${markerId}-${tone}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
            <path d="M0,1 L9,5 L0,9 z" data-tone={tone} />
          </marker>
        ))}
      </defs>
      {drawn.map((a) => (
        <path key={a.key} d={a.d} data-tone={a.tone} strokeDasharray={a.dashed ? '4 4' : undefined} markerEnd={`url(#${markerId}-${a.tone})`} />
      ))}
    </svg>
  )
}
