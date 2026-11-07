import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { t } from '@/i18n'
import { DEMOTE_COUNT, LEAGUE_TIERS, PROMOTE_COUNT, tierIndex, type LeagueTier } from '@/game'
import { nowMs } from '@/server/clock'
import { isAdmin, requireUser } from '@/server/auth'
import { joinBronzeLeague } from '@/server/actions/admin'
import { leagueView, type LeagueRow } from '@/server/game'
import { Avatar } from '@/ui/design/Avatar'
import { Button } from '@/ui/design/Button'
import { EmptyState } from '@/ui/design/EmptyState'
import { GameIcon } from '@/ui/design/GameIcon'
import { PixelIcon } from '@/ui/design/PixelIcon'
import { Loo } from '@/ui/design/mascot/Loo'
import { LooSays } from '@/ui/design/mascot/LooSays'
import { InviteButton, PromotionConfetti, WeekCountdown } from '@/ui/game/LeagueClient'
import { TIER_LOOK } from '@/ui/game/tiers'

export const metadata: Metadata = { title: 'Ліги' }
export const dynamic = 'force-dynamic'

const tierName = (tier: LeagueTier) => t(`game.leagues.tiers.${tier}`)
const tierStyle = (tier: LeagueTier) => ({ '--tier': TIER_LOOK[tier].color, '--tier-ink': TIER_LOOK[tier].ink }) as CSSProperties

function Row({ row, size }: { row: LeagueRow; size: number }) {
  // Zone separators: after the last promotion place, before the first demotion place.
  const lastPromote = Math.min(PROMOTE_COUNT, size)
  return (
    <li className="league-row" data-zone={row.zone} data-me={row.me ? '' : undefined} data-cut={row.rank === lastPromote && size > lastPromote ? 'promote' : undefined}>
      <span className="league-rank tabular" data-podium={row.rank <= 3 ? row.rank : undefined}>
        {row.rank}
      </span>
      <Avatar name={row.name} src={row.avatarUrl ?? undefined} size={40} ring={row.me ? 'green' : undefined} />
      <span className="league-name">
        {row.name}
        {row.me ? <span className="league-me"> · {t('game.leagues.you')}</span> : null}
      </span>
      <span className="league-xp tabular">{t('game.leagues.xp', { n: row.xp })}</span>
    </li>
  )
}

// /leagues: this week's cohort (≤ 30 learners of one tier), ranked by server-graded weekly XP. Names and avatars only.
export default async function LeaguesPage() {
  const user = await requireUser()
  const now = nowMs()
  const [view, admin] = await Promise.all([leagueView(user.id, now), isAdmin()])
  const look = TIER_LOOK[view.tier]
  const alone = view.joined && view.rows.length === 1
  const last = view.last
  const lastText = last
    ? last.result === 'promoted'
      ? t('game.leagues.lastPromoted', { rank: last.rank, tier: tierName(last.next) })
      : last.result === 'demoted'
        ? t('game.leagues.lastDemoted', { rank: last.rank, tier: tierName(last.next) })
        : t('game.leagues.lastStayed', { rank: last.rank, tier: tierName(last.next) })
    : null
  return (
    <div className="page leagues-page" data-width="wide" style={tierStyle(view.tier)}>
      <header className="league-hero">
        <span className="league-shield" aria-hidden="true">
          <PixelIcon name={look.icon} size={96} />
        </span>
        <div className="league-hero-text">
          <h1 className="ghead-title">{t('game.leagues.league', { tier: tierName(view.tier) })}</h1>
          <p className="ghead-lead">{t('game.leagues.lead', { up: PROMOTE_COUNT, down: DEMOTE_COUNT })}</p>
          <WeekCountdown end={view.week.end} />
        </div>
      </header>

      <ol className="league-ladder" aria-label={t('game.leagues.ladder')}>
        {LEAGUE_TIERS.map((tier) => (
          <li key={tier} data-state={tier === view.tier ? 'current' : tierIndex(tier) < tierIndex(view.tier) ? 'done' : 'locked'} title={tierName(tier)}>
            <PixelIcon name={TIER_LOOK[tier].icon} size={36} />
            <span className="sr-only">{tierName(tier)}</span>
          </li>
        ))}
      </ol>

      {last && lastText ? (
        <div className="league-last" data-result={last.result} role="status">
          {last.result === 'promoted' ? <PromotionConfetti week={last.week} /> : null}
          <Loo mood={last.result === 'promoted' ? 'cheer' : last.result === 'demoted' ? 'sad' : 'happy'} size={64} />
          <p>{lastText}</p>
        </div>
      ) : null}

      {!view.joined ? (
        <EmptyState title={t('game.leagues.joinTitle')} mood="thinking" action={<Button href="/path">{t('game.leagues.joinCta')}</Button>}>
          {t('game.leagues.joinBody')}
        </EmptyState>
      ) : (
        <>
          <ol className="league-board" aria-label={t('game.leagues.league', { tier: tierName(view.tier) })}>
            {view.rows.map((row) => (
              <Row key={`${row.rank}-${row.name}`} row={row} size={view.rows.length} />
            ))}
          </ol>
          {alone ? (
            <div className="league-alone">
              <LooSays mood="wave" size={96}>
                <strong>{t('game.leagues.aloneTitle')}</strong>
                <span> — {t('game.leagues.aloneBody')}</span>
              </LooSays>
              <InviteButton />
            </div>
          ) : null}
        </>
      )}
      <p className="league-note">
        <GameIcon name="bolt" size={18} /> {t('game.leagues.onlyGraded')}
      </p>
      {admin && (view.tier !== 'bronze' || !view.joined || alone) ? (
        // owner testing: watch the newcomers' league from inside
        <form action={joinBronzeLeague} className="admin-grant">
          <span className="unit-meta">Адмін:</span>
          <Button type="submit" variant="ghost" size="sm">
            Перейти в бронзову лігу до новачків
          </Button>
        </form>
      ) : null}
    </div>
  )
}
