'use client'

import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { burst } from '../Confetti'
import { cx } from '../cx'
import { Loo } from './Loo'
import { LOO_FORM_LABEL, type LooForm, type LooMood, type LooTier } from './pixels'

type Phase = 'old' | 'oldW' | 'newW' | 'flash' | 'new'

// Classic monster-evolution beat: the old form, then white silhouettes of old/new swapping faster and faster,
// a flash, the new form (+ confetti). ≈2.5s. Reduced motion: a plain crossfade.
const BLINKS = [220, 180, 140, 110, 90, 70, 60]
const SCHEDULE: readonly (readonly [Phase, number])[] = [['old', 450], ...BLINKS.flatMap((ms) => [['oldW', ms] as const, ['newW', ms] as const]), ['flash', 220], ['new', 300]]
const CROSSFADE: readonly (readonly [Phase, number])[] = [['old', 300], ['new', 700]]

interface LooEvolveProps {
  from: LooForm
  to: LooForm
  fromTier?: LooTier
  toTier?: LooTier
  fromMood?: LooMood
  toMood?: LooMood
  size?: number
  /** Burst confetti when the new form appears (skipped for reduced motion). Default true. */
  confetti?: boolean
  /** Called once the new form has settled. */
  onDone?: () => void
  className?: string
}

/** Evolution cutscene from one Loo form to the next. Remount (change `key`) to replay. */
export function LooEvolve({ from, to, fromTier, toTier, fromMood = 'surprised', toMood = 'cheer', size = 160, confetti = true, onDone, className }: LooEvolveProps) {
  const [phase, setPhase] = useState<Phase>('old')
  const [reduced, setReduced] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const arrive = useEffectEvent(() => {
    if (confetti) burst({ from: box.current, count: 70, spread: 0.6 })
  })
  const finish = useEffectEvent(() => onDone?.())

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const plan = reduce ? CROSSFADE : SCHEDULE
    const timers: number[] = [window.setTimeout(() => setReduced(reduce), 0)]
    let at = 0
    for (const [p, ms] of plan) {
      timers.push(
        window.setTimeout(() => {
          setPhase(p)
          if (p === 'new') arrive()
        }, at),
      )
      at += ms
    }
    timers.push(window.setTimeout(finish, at))
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [from, to])

  const label = `Loo еволюціонує: ${LOO_FORM_LABEL[from]} → ${LOO_FORM_LABEL[to]}`
  return (
    <div ref={box} className={cx('loo-evolve', className)} data-phase={phase} data-reduced={reduced ? '' : undefined} style={{ width: size, height: size }}>
      <div className="loo-evolve-layer" data-layer="old">
        <Loo form={from} tier={fromTier} mood={fromMood} size={size} decorative />
      </div>
      <div className="loo-evolve-layer loo-evolve-white" data-layer="oldW">
        <Loo form={from} tier={fromTier} mood="idle" size={size} animated={false} decorative />
      </div>
      <div className="loo-evolve-layer loo-evolve-white" data-layer="newW">
        <Loo form={to} tier={toTier} mood="idle" size={size} animated={false} decorative />
      </div>
      <div className="loo-evolve-layer" data-layer="new">
        <Loo form={to} tier={toTier} mood={toMood} size={size} decorative />
      </div>
      <span className="sr-only" role="status">
        {phase === 'new' ? `${label}!` : label}
      </span>
    </div>
  )
}
