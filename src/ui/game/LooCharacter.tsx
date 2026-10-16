import { rankAt, type LooStage } from '@/game'
import { cx } from '@/ui/design/cx'
import { Loo } from '@/ui/design/mascot/Loo'
import type { LooMood, LooSkin } from '@/ui/design/mascot/LooArt'

interface Props {
  // character step (src/game/ranks.ts) — or an explicit growth stage
  step?: number
  stage?: LooStage
  mood?: LooMood
  size?: number
  animated?: boolean
  // locked future steps: a dark silhouette
  silhouette?: boolean
  // explicit look (shop previews); default: the learner's equipped skins + gear
  skin?: LooSkin
  className?: string
  label?: string
}

// Loo at the size his rank has grown him to, wearing the equipped skins and gear.
export function LooCharacter({ step, stage, mood = 'idle', size = 120, animated, silhouette, skin, className, label }: Props) {
  const s = stage ?? (step !== undefined ? rankAt(step).stage : 'normal')
  return (
    <span className={cx('loo-character', className)} data-stage={s} data-silhouette={silhouette ? '' : undefined}>
      <Loo stage={s} mood={mood} size={size} animated={animated} skin={skin} label={label} decorative={!label} />
    </span>
  )
}
