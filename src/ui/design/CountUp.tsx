'use client'

import { useEffect, useRef, useState } from 'react'
import { cx } from './cx'

const NF = new Intl.NumberFormat('uk-UA')

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface CountUpProps {
  value: number
  /** ms */
  duration?: number
  format?: (n: number) => string
  className?: string
}

// Rolls the number from its previous value. The visible digits are owned by the effect; screen readers get the final value.
export function CountUp({ value, duration = 700, format = NF.format, className }: CountUpProps) {
  const [initial] = useState(value)
  const node = useRef<HTMLSpanElement>(null)
  const shown = useRef(value)

  useEffect(() => {
    const el = node.current
    const from = shown.current
    if (!el || from === value) return
    if (reducedMotion() || duration <= 0) {
      shown.current = value
      el.textContent = format(value)
      return
    }
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      shown.current = from + (value - from) * eased
      el.textContent = format(Math.round(shown.current))
      if (t < 1) raf = requestAnimationFrame(tick)
      else shown.current = value
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration, format])

  return (
    <span className={cx('lu-count', className)}>
      <span ref={node} aria-hidden="true">
        {format(initial)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </span>
  )
}
