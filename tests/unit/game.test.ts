import { describe, expect, it } from 'vitest'
import {
  boostActive,
  boostFull,
  cappedXp,
  COHORT_SIZE,
  DOUBLE_XP_MS,
  extendBoost,
  freezesToUse,
  gainHearts,
  HEART_REFILL_MS,
  isRankUp,
  leagueGems,
  lessonGems,
  LEAGUE_XP_REASONS,
  loseHeart,
  MAX_HEARTS,
  nextTier,
  pickCohort,
  purchaseBlock,
  rankCohort,
  rankOf,
  rankProgress,
  resultOf,
  sanitizeEquipped,
  settleHearts,
  shiftWeek,
  shopItem,
  skinLook,
  streakMilestones,
  weekKey,
  weekWindow,
  xpMultiplier,
  type Wallet,
} from '@/game'
import { computeStreak } from '@/progress/streak'

const H = 3_600_000

describe('hearts', () => {
  it('loses one per wrong answer and starts the refill clock', () => {
    const s = loseHeart({ hearts: 5, heartsAt: null }, 1000)
    expect(s).toMatchObject({ hearts: 4, heartsAt: 1000, nextAt: 1000 + HEART_REFILL_MS })
    const t = loseHeart(s, 2000)
    // the clock keeps running from the first loss
    expect(t).toMatchObject({ hearts: 3, heartsAt: 1000, fullAt: 1000 + 2 * HEART_REFILL_MS })
  })

  it('refills +1 every 4h lazily and stops at max', () => {
    const s = { hearts: 1, heartsAt: 0 }
    expect(settleHearts(s, 4 * H - 1).hearts).toBe(1)
    expect(settleHearts(s, 4 * H)).toMatchObject({ hearts: 2, heartsAt: 4 * H, nextAt: 8 * H })
    expect(settleHearts(s, 9 * H)).toMatchObject({ hearts: 3, heartsAt: 8 * H })
    expect(settleHearts(s, 100 * H)).toEqual({ hearts: MAX_HEARTS, heartsAt: null, nextAt: null, fullAt: null })
  })

  it('never goes below zero', () => {
    expect(loseHeart({ hearts: 0, heartsAt: 0 }, 1).hearts).toBe(0)
  })

  it('gains from practice and shop refills', () => {
    expect(gainHearts({ hearts: 0, heartsAt: 0 }, 1, 1)).toMatchObject({ hearts: 1, heartsAt: 0 })
    expect(gainHearts({ hearts: 2, heartsAt: 0 }, 1, MAX_HEARTS)).toMatchObject({ hearts: 5, heartsAt: null })
  })
})

describe('double XP', () => {
  it('multiplies only while active and extends by 15 min', () => {
    expect(xpMultiplier(null, 10)).toBe(1)
    const until = extendBoost(null, 1000)
    expect(until).toBe(1000 + DOUBLE_XP_MS)
    expect(boostActive(until, until - 1)).toBe(true)
    expect(xpMultiplier(until, until)).toBe(1)
    expect(extendBoost(until, 2000)).toBe(until + DOUBLE_XP_MS)
    // an hour ahead at most
    const hour = extendBoost(extendBoost(extendBoost(until, 1000), 1000), 1000)
    expect(boostFull(hour, 1000)).toBe(true)
    expect(boostFull(until, 1000)).toBe(false)
  })
})

describe('xp caps', () => {
  it('caps a source per day', () => {
    expect(cappedXp(50, 0, 'quiz')).toBe(50)
    expect(cappedXp(50, 880, 'quiz')).toBe(20)
    expect(cappedXp(50, 2000, 'quiz')).toBe(0)
    expect(cappedXp(10, 0, 'placement')).toBe(0)
  })

  it('counts only server-graded sources for leagues', () => {
    expect(LEAGUE_XP_REASONS).toContain('quiz')
    expect(LEAGUE_XP_REASONS).not.toContain('flashcard')
    expect(LEAGUE_XP_REASONS).not.toContain('task')
  })
})

describe('gems', () => {
  it('pays lessons 5 / perfect 10 under a daily cap', () => {
    expect(lessonGems(0.8, 0)).toBe(5)
    expect(lessonGems(1, 0)).toBe(10)
    expect(lessonGems(1, 95)).toBe(5)
    expect(lessonGems(1, 100)).toBe(0)
  })

  it('reaches streak milestones', () => {
    expect(streakMilestones(6)).toEqual([])
    expect(streakMilestones(30).map((m) => m.days)).toEqual([7, 30])
  })
})

describe('streak freezes', () => {
  const goal = ['2026-10-10', '2026-10-11', '2026-10-12']

  it('covers missed days when there are enough freezes', () => {
    expect(freezesToUse(goal, [], '2026-10-14', 2)).toEqual(['2026-10-13'])
    expect(freezesToUse(goal, [], '2026-10-15', 2)).toEqual(['2026-10-13', '2026-10-14'])
  })

  it('keeps freezes when they cannot save the streak', () => {
    expect(freezesToUse(goal, [], '2026-10-16', 2)).toEqual([])
    expect(freezesToUse(goal, [], '2026-10-14', 0)).toEqual([])
    expect(freezesToUse([], [], '2026-10-14', 2)).toEqual([])
  })

  it('does nothing while the streak is alive', () => {
    expect(freezesToUse(goal, [], '2026-10-13', 2)).toEqual([])
    expect(freezesToUse(goal, [], '2026-10-12', 2)).toEqual([])
  })

  it('frozen days bridge the streak without counting', () => {
    const s = computeStreak([...goal, '2026-10-14'], '2026-10-14', ['2026-10-13'])
    expect(s.current).toBe(4)
    expect(s.best).toBe(4)
    expect(computeStreak(goal, '2026-10-14', ['2026-10-13']).current).toBe(3)
    expect(computeStreak(goal, '2026-10-14').current).toBe(0)
  })
})

describe('leagues', () => {
  const entries = (xps: number[]) => xps.map((xp, i) => ({ userId: `u${String(i).padStart(2, '0')}`, xp, joinedAt: i }))

  it('promotes the top 7 and demotes the bottom 5 of a full cohort', () => {
    const ranked = rankCohort(entries(Array.from({ length: COHORT_SIZE }, (_, i) => 1000 - i * 10)), 'gold')
    expect(ranked.filter((r) => r.zone === 'promote').map((r) => r.rank)).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(ranked.filter((r) => r.zone === 'demote').map((r) => r.rank)).toEqual([26, 27, 28, 29, 30])
  })

  it('handles small cohorts and the ends of the ladder', () => {
    expect(rankCohort(entries([50]), 'bronze').map((r) => r.zone)).toEqual(['promote'])
    expect(rankCohort(entries([50, 40, 30, 20, 10, 5, 4, 3, 2]), 'silver').map((r) => r.zone)).toEqual(['promote', 'promote', 'promote', 'promote', 'promote', 'promote', 'promote', 'demote', 'demote'])
    expect(rankCohort(entries([50, 0]), 'diamond').map((r) => r.zone)).toEqual(['stay', 'stay'])
    expect(rankCohort(entries(Array.from({ length: 10 }, (_, i) => 100 - i)), 'diamond').filter((r) => r.zone === 'demote').map((r) => r.rank)).toEqual([8, 9, 10])
    expect(rankCohort(entries([50, 0]), 'bronze').map((r) => r.zone)).toEqual(['promote', 'stay'])
  })

  it('breaks ties by who joined first', () => {
    const ranked = rankCohort([
      { userId: 'b', xp: 10, joinedAt: 2 },
      { userId: 'a', xp: 10, joinedAt: 1 },
    ], 'bronze')
    expect(ranked.map((r) => r.userId)).toEqual(['a', 'b'])
  })

  it('moves tiers and pays the podium', () => {
    expect(nextTier('bronze', 'promoted')).toBe('silver')
    expect(nextTier('bronze', 'demoted')).toBe('bronze')
    expect(nextTier('diamond', 'promoted')).toBe('diamond')
    expect(nextTier('ruby', resultOf('demote'))).toBe('sapphire')
    expect(leagueGems(1, 'promoted')).toBe(60)
    expect(leagueGems(7, 'promoted')).toBe(15)
    expect(leagueGems(9, 'stayed')).toBe(0)
  })

  it('joins the fullest open cohort', () => {
    expect(pickCohort([{ id: 'a', size: 3 }, { id: 'b', size: 29 }, { id: 'c', size: 30 }])?.id).toBe('b')
    expect(pickCohort([{ id: 'c', size: 30 }])).toBeNull()
  })
})

describe('league weeks (Monday 00:00 Europe/Kyiv)', () => {
  it('starts on Monday Kyiv time, across DST', () => {
    // Sunday 2026-10-18 21:30 UTC = Monday 00:30 Kyiv (UTC+3 until Oct 25)
    expect(weekKey(Date.UTC(2026, 9, 18, 21, 30))).toBe('2026-10-19')
    expect(weekKey(Date.UTC(2026, 9, 18, 20, 59))).toBe('2026-10-12')
    const w = weekWindow('2026-10-19')
    expect(w.start).toBe(Date.UTC(2026, 9, 18, 21, 0))
    // DST ends 2026-10-25: the next Monday starts at 22:00 UTC
    expect(w.end).toBe(Date.UTC(2026, 9, 25, 22, 0))
    expect(shiftWeek('2026-10-19', -1)).toBe('2026-10-12')
    expect(shiftWeek('2026-12-28', 1)).toBe('2027-01-04')
  })
})

describe('shop', () => {
  const wallet = (w: Partial<Wallet>): Wallet => ({ gems: 1000, hearts: 3, freezes: 0, boostUntil: null, owned: new Set(), now: 0, ...w })

  it('checks funds and limits', () => {
    expect(purchaseBlock(shopItem('streak-freeze'), wallet({}))).toBeNull()
    expect(purchaseBlock(shopItem('streak-freeze'), wallet({ freezes: 2 }))).toBe('max-freezes')
    expect(purchaseBlock(shopItem('heart-refill'), wallet({ hearts: 5 }))).toBe('hearts-full')
    expect(purchaseBlock(shopItem('hat-crown'), wallet({ gems: 10 }))).toBe('funds')
    expect(purchaseBlock(shopItem('hat-crown'), wallet({ owned: new Set(['hat-crown']) }))).toBe('owned')
    expect(purchaseBlock(shopItem('nope'), wallet({}))).toBe('unknown')
  })

  it('equips only owned skins, one per slot', () => {
    const owned = new Set(['hat-crown', 'scarf-pink'])
    expect(sanitizeEquipped({ hat: 'hat-crown', glasses: 'glasses-nerd', scarf: 'hat-crown' }, owned)).toEqual({ hat: 'hat-crown' })
    expect(skinLook({ hat: 'hat-crown', scarf: 'scarf-pink' })).toEqual({ hat: 'crown', scarf: '#FF86D0' })
  })
})

describe('ranks', () => {
  const input = { xp: 0, lessons: 0, tests: 0, exams: 0, courses: 0 }

  it('needs XP and course milestones', () => {
    expect(rankOf(input).id).toBe('noob')
    expect(rankOf({ ...input, xp: 150, lessons: 1 }).id).toBe('trainee')
    // plenty of XP, but no topic tests yet → stuck at Trainee
    expect(rankOf({ ...input, xp: 50_000, lessons: 50 }).id).toBe('trainee')
    expect(rankOf({ ...input, xp: 5_000, lessons: 40, tests: 12, exams: 1 }).id).toBe('middle')
    expect(rankOf({ xp: 200_000, lessons: 500, tests: 80, exams: 9, courses: 1 }).id).toBe('god')
    expect(rankOf({ xp: 200_000, lessons: 500, tests: 80, exams: 9, courses: 0 }).id).toBe('principal')
  })

  it('reports the gap to the next rank', () => {
    const p = rankProgress({ ...input, xp: 500, lessons: 5, tests: 3 })
    expect(p.rank.id).toBe('trainee')
    expect(p.next?.id).toBe('junior')
    expect(p.gaps.find((g) => g.key === 'lessons')).toEqual({ key: 'lessons', have: 5, need: 10 })
    expect(p.progress).toBe(0.5)
    expect(isRankUp('trainee', 'junior')).toBe(true)
    expect(isRankUp('junior', 'junior')).toBe(false)
  })
})
