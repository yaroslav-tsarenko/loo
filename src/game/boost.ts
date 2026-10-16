// ⚡ Double XP: 15 minutes per purchase; buying again extends the window (up to an hour ahead).

export const DOUBLE_XP_MS = 15 * 60_000
export const MAX_BOOST_AHEAD_MS = 60 * 60_000
export const DOUBLE_XP_FACTOR = 2

export const boostActive = (until: number | null, now: number): boolean => until !== null && until > now

export const xpMultiplier = (until: number | null, now: number): number => (boostActive(until, now) ? DOUBLE_XP_FACTOR : 1)

export function extendBoost(until: number | null, now: number): number {
  return Math.max(until ?? 0, now) + DOUBLE_XP_MS
}

// Another 15 minutes would push the window past an hour from now.
export const boostFull = (until: number | null, now: number): boolean => extendBoost(until, now) - now > MAX_BOOST_AHEAD_MS
