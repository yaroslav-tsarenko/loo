'use client'

import { useEffect, useRef, useState } from 'react'
import { trackReading } from '@/server/actions/study'
import { THEORY_READING } from '@/ui/shell/constants'

export function ReadingTracker({ chapterId }: { chapterId: string }) {
  const [pct, setPct] = useState(0)
  const maxPct = useRef(0)
  const activeMs = useRef(0)
  const lastTick = useRef(0)
  const lastInput = useRef(0)

  useEffect(() => {
    maxPct.current = 0
    activeMs.current = 0
    lastTick.current = Date.now()
    lastInput.current = Date.now()
    const article = document.querySelector<HTMLElement>('[data-reading]')
    const measure = () => {
      if (!article) return
      const rect = article.getBoundingClientRect()
      const total = rect.height - window.innerHeight * 0.6
      const done = total <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / total))
      const value = Math.round(done * 100)
      setPct(value)
      maxPct.current = Math.max(maxPct.current, value)
      lastInput.current = Date.now()
    }
    const bump = () => {
      lastInput.current = Date.now()
    }
    const tick = () => {
      const now = Date.now()
      if (document.visibilityState === 'visible' && now - lastInput.current < 90_000) activeMs.current += now - lastTick.current
      lastTick.current = now
    }
    const flush = () => {
      tick()
      if (activeMs.current < 1000 && maxPct.current === 0) return
      const delta = activeMs.current
      activeMs.current = 0
      void trackReading({ chapterId, scrollPct: maxPct.current, deltaMs: delta }).then(
        () => window.dispatchEvent(new CustomEvent(THEORY_READING, { detail: { chapterId } })),
        () => {},
      )
    }
    measure()
    const interval = window.setInterval(tick, 5000)
    const flushInterval = window.setInterval(flush, 20_000)
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('keydown', bump)
    window.addEventListener('pointermove', bump, { passive: true })
    const onHide = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    document.addEventListener('visibilitychange', onHide)
    return () => {
      flush()
      window.clearInterval(interval)
      window.clearInterval(flushInterval)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('keydown', bump)
      window.removeEventListener('pointermove', bump)
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [chapterId])

  return (
    <div className="read-progress" role="progressbar" aria-label="Прогрес читання" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ transform: `scaleX(${pct / 100})` }} />
    </div>
  )
}
