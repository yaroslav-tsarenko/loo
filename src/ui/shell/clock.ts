'use client'

import { useSyncExternalStore } from 'react'

// A coarse wall clock for countdowns (next heart, boost, league week): re-renders every `step` ms, 0 on the server.
export function useClock(step = 30_000): number {
  return useSyncExternalStore(
    (onChange) => {
      const id = window.setInterval(onChange, Math.min(step, 10_000))
      return () => window.clearInterval(id)
    },
    () => Math.floor(Date.now() / step) * step,
    () => 0,
  )
}

// «2 год 15 хв» / «12 хв» / «менше хвилини»
export function formatLeft(ms: number): string {
  const min = Math.max(0, Math.ceil(ms / 60_000))
  if (min < 1) return 'менше хвилини'
  const d = Math.floor(min / 1440)
  const h = Math.floor((min % 1440) / 60)
  const m = min % 60
  if (d > 0) return h > 0 ? `${d} д ${h} год` : `${d} д`
  if (h > 0) return m > 0 ? `${h} год ${m} хв` : `${h} год`
  return `${m} хв`
}
