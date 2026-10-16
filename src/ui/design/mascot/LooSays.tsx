import type { ReactNode } from 'react'
import { cx } from '../cx'
import { Loo, type LooBulb, type LooEyes, type LooForm, type LooMood, type LooSkin, type LooTier } from './Loo'

interface LooSaysProps {
  mood?: LooMood
  text?: ReactNode
  children?: ReactNode
  size?: number
  skin?: LooSkin
  eyes?: LooEyes
  bulb?: LooBulb
  form?: LooForm
  tier?: LooTier
  /** Where the bubble sits relative to Loo. */
  side?: 'right' | 'top'
  /** Announce changes (feedback after an answer). */
  live?: boolean
  className?: string
}

export function LooSays({ mood = 'idle', text, children, size = 96, skin, eyes, bulb, form, tier, side = 'right', live, className }: LooSaysProps) {
  return (
    <div className={cx('loo-says', className)} data-side={side}>
      <Loo mood={mood} size={size} skin={skin} eyes={eyes} bulb={bulb} form={form} tier={tier} decorative />
      <div className="loo-bubble" aria-live={live ? 'polite' : undefined}>
        {text ?? children}
      </div>
    </div>
  )
}
