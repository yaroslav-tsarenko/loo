'use client'

import { StatChip } from '@/ui/design/StatChip'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'
import { STREAK_KEY, STREAK_TODAY_KEY } from './constants'
import { useCounts } from './NavLinks'

// Placeholders until the game layer (Phase 4) lands: gems start at 0, hearts are always full.
const GEMS_PLACEHOLDER = 0
const HEARTS_PLACEHOLDER = 5

export function ShellStats() {
  const counts = useCounts()
  const { xp } = useFeedback()
  return (
    <div className="shell-stats" role="group" aria-label="Статистика">
      <StatChip kind="streak" value={counts[STREAK_KEY] ?? 0} active={(counts[STREAK_TODAY_KEY] ?? 0) > 0} href="/profile" size="sm" />
      <StatChip kind="gems" value={GEMS_PLACEHOLDER} size="sm" />
      <StatChip kind="hearts" value={HEARTS_PLACEHOLDER} size="sm" />
      <StatChip kind="xp" value={xp} href="/profile" size="sm" className="shell-stat-xp" />
    </div>
  )
}
