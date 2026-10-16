import { rankAt, type EvoTier, type LooForm } from '@/game'
import { cx } from '@/ui/design/cx'
import { Loo } from '@/ui/design/mascot/Loo'
import type { LooMood } from '@/ui/design/mascot/LooArt'

interface Props {
  // evolution step (src/game/ranks.ts) — or an explicit form + tier
  step?: number
  form?: LooForm
  tier?: EvoTier
  mood?: LooMood
  size?: number
  animated?: boolean
  // locked future forms: a dark silhouette
  silhouette?: boolean
  className?: string
  label?: string
}

// Loo in his evolution form (the mascot draws forms: <Loo form tier />), wearing the equipped shop skin.
export function LooCharacter({ step, form, tier, mood = 'idle', size = 120, animated, silhouette, className, label }: Props) {
  const def = step !== undefined ? rankAt(step) : null
  const f = form ?? def?.form ?? 'egg'
  const tr = tier ?? def?.tier ?? 1
  return (
    <span className={cx('loo-character', className)} data-form={f} data-tier={tr} data-silhouette={silhouette ? '' : undefined}>
      <Loo form={f} tier={f === 'legendary' ? undefined : tr} mood={mood} size={size} animated={animated} label={label} decorative={!label} />
    </span>
  )
}
