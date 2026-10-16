'use client'

import { useEffect, useRef, type ReactNode, type RefObject } from 'react'

// A thin floating «island» scrollbar for any scroll pane. The native bar is hidden, but the pane still scrolls
// natively (wheel, keyboard, touch momentum, scrollIntoView); the island is drawn on top: a violet pill sized by
// viewport / content, shown on hover and while scrolling, fading out when idle, draggable with mouse, pen or finger.
// Styles: .island* in src/app/shell.css (reduced motion → no fades).

const IDLE_MS = 900
const MIN_THUMB = 28
// gap between the island and the pane's top / bottom edge
const INSET = 6

interface IslandRefs {
  root: RefObject<HTMLDivElement | null>
  viewport: RefObject<HTMLDivElement | null>
  content: RefObject<HTMLDivElement | null>
  thumb: RefObject<HTMLDivElement | null>
}

export function useIslandScroll({ root, viewport, content, thumb }: IslandRefs): void {
  useEffect(() => {
    const host = root.current
    const pane = viewport.current
    const bar = thumb.current
    if (!host || !pane || !bar) return
    let frame = 0
    let idle = 0
    let thumbSize = 0
    let travel = 0
    let drag: { pointer: number; y: number; top: number } | null = null

    const layout = () => {
      frame = 0
      const range = pane.scrollHeight - pane.clientHeight
      const overflow = range > 1
      if (overflow) host.dataset.overflow = ''
      else delete host.dataset.overflow
      if (!overflow) return
      const track = pane.clientHeight - INSET * 2
      thumbSize = Math.min(track, Math.max(MIN_THUMB, Math.round((track * pane.clientHeight) / pane.scrollHeight)))
      travel = track - thumbSize
      const top = INSET + (Math.min(range, Math.max(0, pane.scrollTop)) / range) * travel
      bar.style.height = `${thumbSize}px`
      bar.style.transform = `translate3d(0, ${top.toFixed(1)}px, 0)`
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(layout)
    }
    const wake = () => {
      host.dataset.active = ''
      window.clearTimeout(idle)
      idle = window.setTimeout(() => {
        if (!drag) delete host.dataset.active
      }, IDLE_MS)
    }
    const onScroll = () => {
      schedule()
      wake()
    }

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      e.preventDefault()
      e.stopPropagation()
      drag = { pointer: e.pointerId, y: e.clientY, top: pane.scrollTop }
      bar.setPointerCapture(e.pointerId)
      host.dataset.dragging = ''
      wake()
    }
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.pointer || travel <= 0) return
      pane.scrollTop = drag.top + ((e.clientY - drag.y) * (pane.scrollHeight - pane.clientHeight)) / travel
    }
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.pointer) return
      drag = null
      if (bar.hasPointerCapture(e.pointerId)) bar.releasePointerCapture(e.pointerId)
      delete host.dataset.dragging
      wake()
    }

    pane.addEventListener('scroll', onScroll, { passive: true })
    bar.addEventListener('pointerdown', onDown)
    bar.addEventListener('pointermove', onMove)
    bar.addEventListener('pointerup', onUp)
    bar.addEventListener('pointercancel', onUp)
    const resize = new ResizeObserver(schedule)
    resize.observe(pane)
    if (content.current) resize.observe(content.current)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(idle)
      resize.disconnect()
      pane.removeEventListener('scroll', onScroll)
      bar.removeEventListener('pointerdown', onDown)
      bar.removeEventListener('pointermove', onMove)
      bar.removeEventListener('pointerup', onUp)
      bar.removeEventListener('pointercancel', onUp)
    }
  }, [root, viewport, content, thumb])
}

export function IslandScroll({ className, children }: { className?: string; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const thumb = useRef<HTMLDivElement>(null)
  useIslandScroll({ root, viewport, content, thumb })
  return (
    <div ref={root} className={className ? `island ${className}` : 'island'}>
      <div ref={viewport} className="island-viewport">
        <div ref={content} className="island-content">
          {children}
        </div>
      </div>
      {/* Decorative: the pane itself stays scrollable by keyboard and assistive tech. */}
      <div ref={thumb} className="island-thumb" aria-hidden="true" />
    </div>
  )
}
