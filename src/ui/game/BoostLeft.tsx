'use client'

import { t } from '@/i18n'
import { useClock } from '@/ui/shell/clock'

// «⚡ Подвійний XP ще 12 хв» — live countdown.
export function BoostLeft({ until }: { until: number }) {
  const now = useClock(15_000)
  if (now === 0 || until <= now) return null
  return <span className="boost-left">{t('game.boost.active', { min: Math.max(1, Math.round((until - now) / 60_000)) })}</span>
}
