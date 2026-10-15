'use client'

import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react'

// One animated illustration at a time: every theater scene and auto-playing viz
// registers here; the most visible one (≥ 20% in view) wins.
interface Entry {
  ratio: number
  exclusive: boolean
  set: (on: boolean) => void
}

const registry = new Map<number, Entry>()
let nextId = 0

function elect() {
  let best: Entry | null = null
  for (const e of registry.values()) if (e.exclusive && e.ratio >= 0.2 && (!best || e.ratio > best.ratio)) best = e
  for (const e of registry.values()) e.set(!e.exclusive || e === best)
}

export function useElection(ref: RefObject<HTMLElement | null>, exclusive = true): { ratio: number; elected: boolean } {
  const [ratio, setRatio] = useState(0)
  const [elected, setElected] = useState(!exclusive)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const id = nextId++
    const entry: Entry = { ratio: 0, exclusive, set: (on) => setElected(on) }
    registry.set(id, entry)
    const io = new IntersectionObserver(
      (entries) => {
        const r = entries[entries.length - 1]?.intersectionRatio ?? 0
        entry.ratio = r
        setRatio(r)
        elect()
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      registry.delete(id)
      elect()
    }
  }, [ref, exclusive])
  return { ratio, elected }
}

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

export function useReducedMotionPref(): boolean {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  )
}

function subscribeVisibility(cb: () => void) {
  document.addEventListener('visibilitychange', cb)
  return () => document.removeEventListener('visibilitychange', cb)
}

export function usePageHidden(): boolean {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === 'hidden',
    () => false,
  )
}

function subscribeWide(cb: () => void) {
  const mq = window.matchMedia('(min-width: 640px)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

// Same breakpoint as the CSS that switches `auto` frames to a phone.
export function useWideViewport(): boolean {
  return useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia('(min-width: 640px)').matches,
    () => true,
  )
}
