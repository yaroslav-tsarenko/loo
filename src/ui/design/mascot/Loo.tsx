'use client'

import { LooArt, type LooProps } from './LooArt'
import { useLooSkin } from './LooSkin'

export type { LooBulb, LooEyes, LooGlasses, LooHat, LooMood, LooSkin, LooStage } from './pixels'

// Loo wearing the learner's equipped skin (from LooSkinProvider) unless a skin is passed explicitly
// (`skin={{}}` shows him bare, e.g. shop previews of other items).
export function Loo(props: LooProps) {
  const equipped = useLooSkin()
  return <LooArt {...props} skin={props.skin ?? equipped} />
}
