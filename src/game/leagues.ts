// Weekly leagues: cohorts of up to 30 learners of one tier, ranked by weekly XP (server-graded sources only).
// At the end of the week the top 7 move up a tier and the bottom 5 move down (never past the ends of the ladder).

export const LEAGUE_TIERS = ['bronze', 'silver', 'gold', 'sapphire', 'ruby', 'emerald', 'amethyst', 'pearl', 'obsidian', 'diamond'] as const
export type LeagueTier = (typeof LEAGUE_TIERS)[number]

export const COHORT_SIZE = 30
export const PROMOTE_COUNT = 7
export const DEMOTE_COUNT = 5

export type LeagueResult = 'promoted' | 'stayed' | 'demoted'
export type Zone = 'promote' | 'stay' | 'demote'

export const isTier = (s: string): s is LeagueTier => (LEAGUE_TIERS as readonly string[]).includes(s)
export const tierIndex = (tier: LeagueTier): number => LEAGUE_TIERS.indexOf(tier)

export interface CohortEntry {
  userId: string
  xp: number
  joinedAt: number
}

export interface Standing extends CohortEntry {
  rank: number
  zone: Zone
}

// Ranked cohort: XP desc, then whoever joined first, then id (stable). Zero-XP learners never promote.
export function rankCohort(entries: readonly CohortEntry[], tier: LeagueTier): Standing[] {
  const sorted = [...entries].sort((a, b) => b.xp - a.xp || a.joinedAt - b.joinedAt || (a.userId < b.userId ? -1 : a.userId > b.userId ? 1 : 0))
  const n = sorted.length
  const top = tierIndex(tier) === LEAGUE_TIERS.length - 1
  const bottom = tierIndex(tier) === 0
  // The top 7 places are safe even in Diamond (nowhere to promote to): small cohorts don't demote everyone.
  const safe = Math.min(PROMOTE_COUNT, n)
  const promoteSlots = top ? 0 : safe
  const demoteSlots = bottom ? 0 : Math.min(DEMOTE_COUNT, n - safe)
  return sorted.map((e, i) => {
    const rank = i + 1
    const zone: Zone = rank <= promoteSlots && e.xp > 0 ? 'promote' : rank > n - demoteSlots ? 'demote' : 'stay'
    return { ...e, rank, zone }
  })
}

export const resultOf = (zone: Zone): LeagueResult => (zone === 'promote' ? 'promoted' : zone === 'demote' ? 'demoted' : 'stayed')

export function nextTier(tier: LeagueTier, result: LeagueResult | null): LeagueTier {
  const i = tierIndex(tier)
  const j = result === 'promoted' ? i + 1 : result === 'demoted' ? i - 1 : i
  return LEAGUE_TIERS[Math.max(0, Math.min(LEAGUE_TIERS.length - 1, j))]!
}

// Gems for the week's result: podium bonus on top of a promotion.
export function leagueGems(rank: number, result: LeagueResult): number {
  if (result !== 'promoted') return rank === 1 ? 20 : 0
  return rank === 1 ? 60 : rank === 2 ? 40 : rank === 3 ? 25 : 15
}

// The cohort a newcomer joins: the fullest open one of the tier (keeps leagues lively), else a new one.
export function pickCohort<T extends { id: string; size: number }>(open: readonly T[]): T | null {
  const fits = open.filter((c) => c.size < COHORT_SIZE).sort((a, b) => b.size - a.size || (a.id < b.id ? -1 : 1))
  return fits[0] ?? null
}
