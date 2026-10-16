'use client'

import { Maximize2, Minimize2, Minus, Plus, Scan } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

// A Figma-like canvas (remount it with a new `key` to reset the view, e.g. when going full screen) for a diagram: the picture always fits the column (scaled down proportionally, never a
// scrollbar), and the reader can zoom (⌘/Ctrl + wheel, trackpad pinch, two-finger pinch, buttons, double-click),
// drag to pan once zoomed in, and open it full screen. Plain wheel / one-finger swipes keep scrolling the page.

const MAX_ZOOM = 4
// below this, a wide flow reads better stacked top → bottom (inline only; full screen keeps it wide)
const STACK_BELOW = 0.8
const STEP = 1.25

interface View {
  zoom: number // multiplier over «fit»
  x: number
  y: number
}

export function ZoomPan({ children, head, expanded, onExpand }: { children: ReactNode; head?: ReactNode; expanded: boolean; onExpand: (open: boolean) => void }) {
  const viewport = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ vw: 0, vh: 0, w: 0, h: 0 })
  const [view, setView] = useState<View>({ zoom: 1, x: 0, y: 0 })
  const [stacked, setStacked] = useState(false)
  // natural width of the wide (unstacked) picture, to know when there is room to unstack again
  const wide = useRef(0)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef<{ dist: number; zoom: number } | null>(null)

  // Natural size of the picture and of the frame around it
  useLayoutEffect(() => {
    const vp = viewport.current
    const st = stage.current
    if (!vp || !st) return
    const measure = () => {
      const next = { vw: vp.clientWidth, vh: vp.clientHeight, w: st.offsetWidth, h: st.offsetHeight }
      setBox(next)
      if (expanded) return
      const isStacked = st.hasAttribute('data-stacked')
      if (!isStacked && next.w > 0 && next.vw / next.w < STACK_BELOW) {
        wide.current = next.w
        setStacked(true)
      } else if (isStacked && wide.current > 0 && next.vw / wide.current >= STACK_BELOW) setStacked(false)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(vp)
    ro.observe(st)
    return () => ro.disconnect()
  }, [expanded])

  // inline: shrink to the column, never enlarge; full screen: fill the frame (up to 1.6×)
  const fit = box.w > 0 && box.h > 0 ? (expanded ? Math.min(1.6, (box.vw - 24) / box.w, (box.vh - 24) / box.h) : Math.min(1, box.vw / box.w)) : 1
  const scale = fit * view.zoom

  // Keep the picture inside the frame: centred when it fits, edges clamped when it doesn't.
  const clamp = useCallback(
    (v: View): View => {
      const s = fit * v.zoom
      const w = box.w * s
      const h = box.h * s
      const vh = expanded ? box.vh : box.h * fit
      const x = w <= box.vw ? (box.vw - w) / 2 : Math.min(0, Math.max(box.vw - w, v.x))
      const y = h <= vh ? (vh - h) / 2 : Math.min(0, Math.max(vh - h, v.y))
      return { zoom: v.zoom, x, y }
    },
    [box, fit, expanded],
  )

  const zoomAt = useCallback(
    (next: number, px: number, py: number) => {
      setView((v) => {
        const c = clamp(v)
        const zoom = Math.min(MAX_ZOOM, Math.max(1, next))
        const k = zoom / c.zoom
        return clamp({ zoom, x: px - (px - c.x) * k, y: py - (py - c.y) * k })
      })
    },
    [clamp],
  )
  const centre = () => ({ x: box.vw / 2, y: (expanded ? box.vh : box.h * fit) / 2 })
  const reset = useCallback(() => setView(clamp({ zoom: 1, x: 0, y: 0 })), [clamp])

  // ⌘/Ctrl + wheel and trackpad pinch (arrives as ctrl + wheel); needs a non-passive listener
  useEffect(() => {
    const vp = viewport.current
    if (!vp) return
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        if (view.zoom > 1 || expanded) {
          e.preventDefault()
          setView((v) => {
            const c = clamp(v)
            return clamp({ ...c, x: c.x - e.deltaX, y: c.y - e.deltaY })
          })
        }
        return
      }
      e.preventDefault()
      const r = vp.getBoundingClientRect()
      zoomAt(view.zoom * Math.exp(-e.deltaY * 0.01), e.clientX - r.left, e.clientY - r.top)
    }
    vp.addEventListener('wheel', onWheel, { passive: false })
    return () => vp.removeEventListener('wheel', onWheel)
  }, [view.zoom, expanded, zoomAt, clamp])


  // clamped at render, so a resized frame or picture re-fits by itself
  const shown = clamp(view)
  const zoomed = view.zoom > 1.001
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      gesture.current = { dist: Math.hypot(a!.x - b!.x, a!.y - b!.y), zoom: view.zoom }
    }
    if (zoomed || expanded || pointers.current.size === 2) e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId)
    if (!prev) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const r = e.currentTarget.getBoundingClientRect()
    if (pointers.current.size === 2 && gesture.current) {
      const [a, b] = [...pointers.current.values()]
      const dist = Math.hypot(a!.x - b!.x, a!.y - b!.y)
      zoomAt((gesture.current.zoom * dist) / gesture.current.dist, (a!.x + b!.x) / 2 - r.left, (a!.y + b!.y) / 2 - r.top)
    } else if (zoomed || expanded) {
      setView((v) => {
        const c = clamp(v)
        return clamp({ ...c, x: c.x + e.clientX - prev.x, y: c.y + e.clientY - prev.y })
      })
    }
  }
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) gesture.current = null
  }
  const onDoubleClick = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    if (zoomed) reset()
    else zoomAt(2, e.clientX - r.left, e.clientY - r.top)
  }

  const frameHeight = expanded ? undefined : Math.ceil(box.h * fit) || undefined
  const style = { '--dg-w': `${box.vw}px`, height: frameHeight } as CSSProperties
  return (
    <div className="dg-zoom">
      <div className="dg-head">
        {head}
        <div className="dg-zoombar">
          <button type="button" onClick={() => zoomAt(view.zoom / STEP, centre().x, centre().y)} disabled={!zoomed} aria-label="Зменшити" title="Зменшити">
            <Minus size={16} />
          </button>
          <button type="button" className="dg-zoom-pct" onClick={reset} title="Вмістити" aria-label="Вмістити">
            {Math.round(scale * 100)}%
          </button>
          <button type="button" onClick={() => zoomAt(view.zoom * STEP, centre().x, centre().y)} disabled={view.zoom >= MAX_ZOOM} aria-label="Збільшити" title="Збільшити (⌘/Ctrl + колесо)">
            <Plus size={16} />
          </button>
          {zoomed ? (
            <button type="button" onClick={reset} aria-label="Вмістити" title="Вмістити">
              <Scan size={16} />
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => onExpand(!expanded)}
            aria-label={expanded ? 'Згорнути' : 'На весь екран'}
            title={expanded ? 'Згорнути (Esc)' : 'На весь екран'}
          >
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>
      <div
        ref={viewport}
        className="dg-viewport"
        data-zoomed={zoomed ? '' : undefined}
        style={style}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
      >
        <div ref={stage} className="dg-stage" data-stacked={stacked && !expanded ? '' : undefined} style={{ transform: `translate(${shown.x}px, ${shown.y}px) scale(${scale})` }}>
          {children}
        </div>
      </div>
    </div>
  )
}
