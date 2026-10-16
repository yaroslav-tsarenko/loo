'use client'

import { t } from '@/i18n'
import Link from 'next/link'
import { rankAt } from '@/game/ranks'
import { StatChip } from '@/ui/design/StatChip'
import { LooCharacter } from '@/ui/game/LooCharacter'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'
import { formatLeft, useClock } from './clock'
import { BOOST_KEY, GEMS_KEY, HEARTS_KEY, RANK_KEY, STREAK_KEY, STREAK_TODAY_KEY } from './constants'
import { useCounts } from './NavLinks'

// Streak (🧊 freezes applied), gems, hearts and XP — live from /api/counts; ⚡ while double XP runs.
export function ShellStats() {
  const counts = useCounts()
  const { xp } = useFeedback()
  const now = useClock(15_000)
  const boost = counts[BOOST_KEY] ?? 0
  const boosted = now > 0 && boost > now
  const evo = rankAt(counts[RANK_KEY] ?? 0)
  return (
    <div className="shell-stats" role="group" aria-label="Статистика">
      <Link href="/loo" className="shell-evo" title={`Мій Loo: ${evo.title}`} aria-label={`Мій Loo: ${evo.title}`}>
        <LooCharacter step={evo.index} size={26} animated={false} />
        <span className="shell-evo-title">{evo.title}</span>
      </Link>
      <StatChip kind="streak" value={counts[STREAK_KEY] ?? 0} active={(counts[STREAK_TODAY_KEY] ?? 0) > 0} href="/profile" size="sm" />
      <StatChip kind="gems" value={counts[GEMS_KEY] ?? 0} href="/shop" size="sm" />
      <StatChip kind="hearts" value={counts[HEARTS_KEY] ?? 5} href="/shop" size="sm" className="shell-stat-hearts" />
      {boosted ? (
        <span className="shell-boost" role="img" aria-label={t('game.boost.active', { min: Math.max(1, Math.round((boost - now) / 60_000)) })} title={formatLeft(boost - now)}>
          ⚡×2
        </span>
      ) : null}
      <StatChip kind="xp" value={xp} href="/profile" size="sm" className="shell-stat-xp" />
    </div>
  )
}
