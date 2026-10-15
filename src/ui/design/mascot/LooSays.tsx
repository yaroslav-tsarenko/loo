import type { ReactNode } from 'react'
import { cx } from '../cx'
import { Loo, type LooMood, type LooSkin } from './Loo'

interface LooSaysProps {
  mood?: LooMood
  text?: ReactNode
  children?: ReactNode
  size?: number
  skin?: LooSkin
  /** Where the bubble sits relative to Loo. */
  side?: 'right' | 'top'
  /** Announce changes (feedback after an answer). */
  live?: boolean
  className?: string
}

export function LooSays({ mood = 'idle', text, children, size = 96, skin, side = 'right', live, className }: LooSaysProps) {
  return (
    <div className={cx('loo-says', className)} data-side={side}>
      <Loo mood={mood} size={size} skin={skin} decorative />
      <div className="loo-bubble" aria-live={live ? 'polite' : undefined}>
        {text ?? children}
      </div>
    </div>
  )
}
