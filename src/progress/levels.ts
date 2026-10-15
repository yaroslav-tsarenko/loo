export interface Rank {
  id: string
  title: string
  fromLevel: number
}

export const RANKS: readonly Rank[] = [
  { id: 'trainee', title: 'Trainee', fromLevel: 1 },
  { id: 'junior', title: 'Junior', fromLevel: 5 },
  { id: 'middle', title: 'Middle', fromLevel: 12 },
  { id: 'senior', title: 'Senior', fromLevel: 22 },
  { id: 'staff', title: 'Staff', fromLevel: 35 },
  { id: 'principal', title: 'Principal', fromLevel: 50 },
]

export function xpToReach(level: number): number {
  if (level <= 1) return 0
  return Math.round(80 * Math.pow(level - 1, 1.6))
}

export interface LevelInfo {
  level: number
  rank: Rank
  nextRank: Rank | null
  xp: number
  floor: number
  ceiling: number
  progress: number
}

export function rankFor(level: number): Rank {
  let current = RANKS[0]!
  for (const rank of RANKS) if (level >= rank.fromLevel) current = rank
  return current
}

export function levelInfo(xp: number): LevelInfo {
  const total = Math.max(0, Math.floor(xp))
  let level = 1
  while (xpToReach(level + 1) <= total) level++
  const floor = xpToReach(level)
  const ceiling = xpToReach(level + 1)
  const rank = rankFor(level)
  const nextRank = RANKS.find((r) => r.fromLevel > level) ?? null
  return { level, rank, nextRank, xp: total, floor, ceiling, progress: (total - floor) / (ceiling - floor) }
}
