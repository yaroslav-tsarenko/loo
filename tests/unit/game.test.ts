import { describe, expect, it } from 'vitest'
import { ACHIEVEMENTS } from '@/progress/achievements/catalog'
import { LADDERS } from '@/progress/stats/tiers'
import { ukGame } from '@/i18n/uk-game'
import { PIXEL_ICONS } from '@/ui/design/PixelIcon'
import { TIER_LOOK } from '@/ui/game/tiers'
import { messages } from '@/i18n'
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
  ATTRIBUTES,
  attributes,
  isRankUp,
  ATTRIBUTE_ICON,
  BUCKS,
  BUCKS_DAILY_CAP,
  buckRef,
  cappedBucks,
  courseRank,
  fromLegacyStep,
  gearStats,
  gemRef,
  GEAR_SLOTS,
  isGear,
  isLooStage,
  isSkin,
  minStep,
  rankStart,
  rankXp,
  sanitizeGear,
  STAT_ICON,
  levelIcon,
  STATS,
  STAGE_FROM,
  stageOf,
  tryOn,
  WARRIOR_ICON,
  WARRIOR_RANKS,
  LEAGUE_TIERS,
  levelBadge,
  levelLabel,
  levelTag,
  SHOP_ITEMS,
  LOO_STAGE_LABEL,
  LOO_STAGES,
  powerScore,
  rankAt,
  RANKS,
  sectionSkill,
  snapshotOf,
  stepsBetween,
  strengthsAndWeakness,
  topicSkill,
  type CharacterInput,
  leagueGems,
  lessonBucks,
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
import { LEVEL_LABEL as COURSE_LEVEL_LABEL } from '@/course'
import { LEVEL_LABEL as CONTENT_LEVEL_LABEL } from '@/content/model'
import { LOO_STAGE_LABEL as MASCOT_STAGE_LABEL, LOO_STAGES as MASCOT_STAGES } from '@/ui/design/mascot/pixels'

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

describe('currencies', () => {
  it('pays lessons 10 / perfect 20 bucks under a daily cap', () => {
    expect(lessonBucks(0.8, 0)).toBe(BUCKS.lesson)
    expect(lessonBucks(1, 0)).toBe(BUCKS.lessonPerfect)
    expect(lessonBucks(1, BUCKS_DAILY_CAP.lesson - 5)).toBe(5)
    expect(lessonBucks(1, BUCKS_DAILY_CAP.lesson)).toBe(0)
  })

  it('caps every routine bucks source per day', () => {
    for (const reason of ['lesson', 'topic-test', 'mission', 'practice'] as const) {
      expect(cappedBucks(10_000, 0, reason)).toBe(BUCKS_DAILY_CAP[reason])
      expect(cappedBucks(10, BUCKS_DAILY_CAP[reason], reason)).toBe(0)
    }
    expect(BUCKS.mission).toBeLessThanOrEqual(BUCKS_DAILY_CAP.mission)
  })

  it('keeps stable, distinct refs per award', () => {
    expect(buckRef.lesson('s1')).toBe('lesson:s1')
    expect(buckRef.practice('s1')).toBe('practice:s1')
    expect(gemRef.rank(5)).toBe('rank:5')
    // the old 22-step ladder paid under evo:<n>; the new one never reuses those refs
    expect(gemRef.rank(5)).not.toBe('evo:5')
  })

  it('reaches streak milestones', () => {
    expect(streakMilestones(6)).toEqual([])
    expect(streakMilestones(30).map((m) => m.days)).toEqual([7, 30])
    expect(streakMilestones(400).map((m) => m.days)).toEqual([7, 30, 100, 365])
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
  const wallet = (w: Partial<Wallet>): Wallet => ({ bucks: 10_000, gems: 10_000, hearts: 3, freezes: 0, boostUntil: null, owned: new Set(), step: 55, now: 0, ...w })

  it('checks funds in the item currency and limits', () => {
    expect(purchaseBlock(shopItem('streak-freeze'), wallet({}))).toBeNull()
    expect(purchaseBlock(shopItem('streak-freeze'), wallet({ freezes: 2 }))).toBe('max-freezes')
    expect(purchaseBlock(shopItem('heart-refill'), wallet({ hearts: 5 }))).toBe('hearts-full')
    // consumables cost bucks: plenty of gems doesn't help
    expect(purchaseBlock(shopItem('streak-freeze'), wallet({ bucks: 10 }))).toBe('no-bucks')
    expect(purchaseBlock(shopItem('streak-freeze'), wallet({ gems: 0 }))).toBeNull()
    // a rare skin costs gems
    expect(purchaseBlock(shopItem('hat-crown'), wallet({ gems: 10 }))).toBe('no-gems')
    expect(purchaseBlock(shopItem('hat-crown'), wallet({ bucks: 0 }))).toBeNull()
    expect(purchaseBlock(shopItem('hat-crown'), wallet({ owned: new Set(['hat-crown']) }))).toBe('owned')
    expect(purchaseBlock(shopItem('nope'), wallet({}))).toBe('unknown')
  })

  it('prices by rarity: common / rare in bucks, epic / legendary in gems; skins mostly bucks', () => {
    for (const item of SHOP_ITEMS) {
      if (isGear(item)) expect(item.currency, item.id).toBe(item.rarity === 'common' || item.rarity === 'rare' ? 'bucks' : 'gems')
      else if (isSkin(item)) expect(item.currency, item.id).toBe(item.rarity === 'rare' ? 'gems' : 'bucks')
      else expect(item.currency, item.id).toBe('bucks')
      expect(item.price, item.id).toBeGreaterThan(0)
    }
    // within a slot, a rarer item never costs less in the same currency
    for (const slot of GEAR_SLOTS) {
      const items = SHOP_ITEMS.filter(isGear).filter((g) => g.slot === slot)
      expect(items.map((g) => g.rarity)).toEqual(['common', 'rare', 'epic', 'legendary'])
      for (let i = 1; i < items.length; i++) if (items[i]!.currency === items[i - 1]!.currency) expect(items[i]!.price).toBeGreaterThan(items[i - 1]!.price)
    }
    // hoodies differ in price
    expect(new Set(SHOP_ITEMS.filter(isSkin).filter((i) => i.slot === 'hoodie').map((i) => `${i.price}${i.currency}`)).size).toBe(4)
  })

  it('gates epic gear behind Лицар and legendary behind Чемпіон', () => {
    expect(minStep(shopItem('helm-leather')!)).toBe(0)
    expect(minStep(shopItem('helm-knight')!)).toBe(rankStart('knight'))
    expect(minStep(shopItem('crown-sun')!)).toBe(rankStart('champion'))
    expect(rankAt(rankStart('knight')).title).toBe('Лицар I')
    expect(purchaseBlock(shopItem('helm-knight'), wallet({ step: rankStart('knight') - 1 }))).toBe('rank')
    expect(purchaseBlock(shopItem('helm-knight'), wallet({ step: rankStart('knight') }))).toBeNull()
    expect(purchaseBlock(shopItem('crown-sun'), wallet({ step: rankStart('champion') - 1 }))).toBe('rank')
    // rank is checked before funds: the learner sees the lock first
    expect(purchaseBlock(shopItem('crown-sun'), wallet({ step: 0, gems: 0 }))).toBe('rank')
  })

  it('sums gear stats without caps; rarer items are stronger', () => {
    const sum = (id: string) => STATS.reduce((n, st) => n + ((shopItem(id) as { stats: Partial<Record<string, number>> }).stats[st] ?? 0), 0)
    for (const slot of GEAR_SLOTS) {
      const items = SHOP_ITEMS.filter(isGear).filter((g) => g.slot === slot)
      for (let i = 1; i < items.length; i++) expect(sum(items[i]!.id), items[i]!.id).toBeGreaterThan(sum(items[i - 1]!.id))
    }
    const all = { head: 'crown-sun', body: 'armor-royal', weapon: 'sword-legend', amulet: 'bulb-sun', aura: 'aura-legend' }
    const total = gearStats(all)
    // no clamp: focus stacks fully (8 + 4 + 10 + 4)
    expect(total.focus).toBe(26)
    expect(total.attack).toBe(22)
    expect(gearStats({})).toEqual({ attack: 0, defense: 0, energy: 0, focus: 0, speed: 0 })
    // an item in the wrong slot counts for nothing
    expect(gearStats({ head: 'sword-wood' }).attack).toBe(0)
  })

  it('equips only owned skins / gear, one per slot, gear within the rank', () => {
    const owned = new Set(['hat-crown', 'scarf-pink', 'helm-knight', 'sword-wood'])
    expect(sanitizeEquipped({ hat: 'hat-crown', glasses: 'glasses-nerd', scarf: 'hat-crown' }, owned)).toEqual({ hat: 'hat-crown' })
    expect(skinLook({ hat: 'hat-crown', scarf: 'scarf-pink' })).toEqual({ hat: 'crown', scarf: '#FF86D0' })
    expect(sanitizeGear({ head: 'helm-knight', weapon: 'sword-wood', body: 'armor-chain' }, owned, 55)).toEqual({ head: 'helm-knight', weapon: 'sword-wood' })
    expect(sanitizeGear({ head: 'helm-knight' }, owned, 10)).toEqual({})
    expect(skinLook({}, { head: 'helm-knight', weapon: 'sword-wood' })).toEqual({ head: 'knight', weapon: 'wood' })
    expect(tryOn({ hat: 'hat-crown' }, {}, shopItem('armor-plate') as never)).toEqual({ hat: 'crown', body: 'plate' })
  })
})

describe('шлях воїна (character rank)', () => {
  const input = { xp: 0, lessons: 0, tests: 0, exams: 0, courses: 0 }

  it('has 11 ranks × I–V plus a single Легенда (56 steps)', () => {
    expect(RANKS).toHaveLength(56)
    expect(WARRIOR_RANKS).toHaveLength(12)
    expect(RANKS.filter((r) => r.rank === 'legend')).toHaveLength(1)
    for (const r of WARRIOR_RANKS.filter((w) => w !== 'legend')) expect(RANKS.filter((d) => d.rank === r).map((d) => d.tier)).toEqual([1, 2, 3, 4, 5])
    expect(RANKS.map((r) => r.index)).toEqual(RANKS.map((_, i) => i))
    expect(rankAt(0).title).toBe('Новобранець I')
    expect(rankAt(32).title).toBe('Лицар III')
    expect(rankAt(55).title).toBe('Легенда')
  })

  it('grows XP ~quadratically to ≈120–150k, thresholds never go down', () => {
    expect(RANKS[55]!.needs.xp).toBeGreaterThanOrEqual(120_000)
    expect(RANKS[55]!.needs.xp).toBeLessThanOrEqual(150_000)
    expect(rankXp(0)).toBe(0)
    for (let i = 1; i < RANKS.length; i++) {
      const a = RANKS[i - 1]!.needs
      const b = RANKS[i]!.needs
      for (const k of ['xp', 'lessons', 'tests', 'exams', 'courses'] as const) expect(b[k], `${i} ${k}`).toBeGreaterThanOrEqual(a[k])
      expect(b.xp).toBeGreaterThan(a.xp)
      // gaps widen (quadratic), allowing for rounding
      if (i >= 2) expect(b.xp - a.xp).toBeGreaterThanOrEqual(a.xp - RANKS[i - 2]!.needs.xp - 100)
      expect(RANKS[i]!.gems).toBeGreaterThan(0)
    }
  })

  it('pays gems once per step, more for a new rank (step I)', () => {
    expect(RANKS[0]!.gems).toBe(0)
    for (const r of RANKS.slice(1, 55)) if (r.tier === 1) expect(r.gems, r.id).toBeGreaterThan(RANKS[r.index - 1]!.gems)
    expect(RANKS[55]!.gems).toBeGreaterThan(RANKS[54]!.gems)
  })

  it('needs XP and course milestones — no skipping a gate', () => {
    expect(rankOf(input).id).toBe('novice-1')
    expect(rankOf({ ...input, xp: 100, lessons: 1 }).id).toBe('novice-2')
    // plenty of XP, but no lessons → stuck at the first step
    expect(rankOf({ ...input, xp: 500_000 }).id).toBe('novice-1')
    // lots of XP and lessons, no section exam → stuck before Воїн I
    expect(rankOf({ ...input, xp: 500_000, lessons: 1_000, tests: 100 }).id).toBe('fighter-5')
    expect(rankOf({ xp: 40_200, lessons: 170, tests: 30, exams: 3, courses: 0 }).id).toBe('knight-1')
    expect(rankOf({ xp: 200_000, lessons: 1_000, tests: 100, exams: 20, courses: 2 }).id).toBe('legend')
    expect(rankOf({ xp: 200_000, lessons: 1_000, tests: 100, exams: 20, courses: 1 }).id).toBe('hero-5')
  })

  it('reports the gap to the next step, keeps a stored floor, lists steps passed', () => {
    const p = rankProgress({ ...input, xp: 500, lessons: 4, tests: 1 })
    expect(p.rank.id).toBe('novice-4')
    expect(p.next?.id).toBe('novice-5')
    expect(p.gaps.find((g) => g.key === 'lessons')).toEqual({ key: 'lessons', have: 4, need: RANKS[4]!.needs.lessons })
    expect(rankProgress(input, 8).rank.index).toBe(8)
    expect(isRankUp('novice-2', 'novice-3')).toBe(true)
    expect(isRankUp(5, 5)).toBe(false)
    expect(stepsBetween(2, 5).map((r) => r.index)).toEqual([3, 4, 5])
  })

  it('maps the old 22-step evolution proportionally (migration 0009)', () => {
    expect(fromLegacyStep(0)).toBe(0)
    expect(fromLegacyStep(3)).toBe(8)
    expect(fromLegacyStep(21)).toBe(55)
    for (let i = 1; i < 22; i++) expect(fromLegacyStep(i)).toBeGreaterThan(fromLegacyStep(i - 1))
  })

  it('Loo only grows with the rank: egg → small → normal', () => {
    expect(stageOf(0)).toBe('egg')
    expect(stageOf(STAGE_FROM.small)).toBe('small')
    expect(stageOf(STAGE_FROM.normal)).toBe('normal')
    expect(stageOf(55)).toBe('normal')
    expect(RANKS.map((r) => r.stage).filter((st, i, a) => st !== a[i - 1])).toEqual(['egg', 'small', 'normal'])
  })
})

describe('two scales: IT career for courses and difficulty', () => {
  it('labels every level with an IT rank', () => {
    expect(levelLabel('noob')).toBe('Trainee')
    expect(levelLabel('beginner')).toBe('Trainee')
    expect(levelLabel('junior')).toBe('Junior')
    expect(levelLabel('middle')).toBe('Middle')
    expect(levelLabel('senior')).toBe('Senior')
    expect(levelLabel('techlead')).toBe('Staff')
    expect(levelLabel('god')).toBe('Principal')
    expect(levelTag('senior')).toBe('для Senior')
    expect(levelBadge('senior')).toBe('Senior')
    expect(COURSE_LEVEL_LABEL.middle).toBe('Middle')
    expect(CONTENT_LEVEL_LABEL.junior).toBe('Junior')
  })

  it('ranks course mastery Trainee → Principal (Principal needs every exam)', () => {
    const m = (done: number, passed: number, exams: number, accuracy: number | null) => ({ lessons: { done, total: 100 }, tests: { passed, total: 10 }, exams: { passed: exams, total: 4 }, accuracy })
    expect(courseRank(m(0, 0, 0, null))).toBe('trainee')
    expect(courseRank(m(40, 2, 0, 0.7))).toBe('junior')
    expect(courseRank(m(70, 6, 2, 0.8))).toBe('senior')
    expect(courseRank(m(100, 10, 3, 1))).toBe('staff')
    expect(courseRank(m(100, 10, 4, 0.9))).toBe('principal')
  })

  it('agrees with the mascot on stages (one order, one set of names)', () => {
    expect([...MASCOT_STAGES]).toEqual([...LOO_STAGES])
    expect(MASCOT_STAGE_LABEL).toEqual(LOO_STAGE_LABEL)
  })
})

describe('character sheet', () => {
  const empty: CharacterInput = {
    answers: { total: 0, correct: 0 },
    topics: { touched: 0, avgCrowns: 0 },
    speed: { medianMs: null, n: 0 },
    memory: { cards: 0, longTerm: 0 },
    tasks: { easy: 0, medium: 0, hard: 0, attempted: 0, firstTry: 0 },
    rhythm: { streak: 0, active30: 0, frozen30: 0 },
    volume: { totalMs: 0, weekMs: 0 },
  }
  const strong: CharacterInput = {
    answers: { total: 5000, correct: 4800 },
    topics: { touched: 60, avgCrowns: 5 },
    speed: { medianMs: 1000, n: 500 },
    memory: { cards: 2000, longTerm: 1900 },
    tasks: { easy: 50, medium: 80, hard: 60, attempted: 190, firstTry: 180 },
    rhythm: { streak: 400, active30: 30, frozen30: 0 },
    volume: { totalMs: 900 * 3_600_000, weekMs: 20 * 3_600_000 },
  }

  it('keeps every attribute within 1–100, even for odd inputs', () => {
    const odd: CharacterInput = { ...empty, answers: { total: -5, correct: 99 }, speed: { medianMs: Number.NaN, n: -1 }, rhythm: { streak: 0, active30: 90, frozen30: 50 } }
    for (const input of [empty, strong, odd]) {
      for (const a of attributes(input)) {
        expect(a.value).toBeGreaterThanOrEqual(1)
        expect(a.value).toBeLessThanOrEqual(100)
        expect(a.level).toBeGreaterThanOrEqual(1)
        expect(a.progress).toBeGreaterThanOrEqual(0)
        expect(a.progress).toBeLessThanOrEqual(1)
      }
    }
    expect(attributes(empty).every((a) => a.level === 1)).toBe(true)
    expect(attributes(strong).every((a) => a.level >= 75)).toBe(true)
  })

  it('grows with practice and rewards rhythm without freezes', () => {
    const more = { ...empty, answers: { total: 200, correct: 170 } }
    const intellect = (c: CharacterInput) => attributes(c).find((a) => a.id === 'intellect')!.value
    expect(intellect(more)).toBeGreaterThan(intellect(empty))
    const resilience = (c: CharacterInput) => attributes(c).find((a) => a.id === 'resilience')!.value
    const clean = { ...empty, rhythm: { streak: 20, active30: 25, frozen30: 0 } }
    expect(resilience(clean)).toBeGreaterThan(resilience({ ...clean, rhythm: { ...clean.rhythm, frozen30: 4 } }))
    const speed = (c: CharacterInput) => attributes(c).find((a) => a.id === 'speed')!.value
    expect(speed({ ...empty, speed: { medianMs: 4_000, n: 60 } })).toBeGreaterThan(speed({ ...empty, speed: { medianMs: 20_000, n: 60 } }))
  })

  it('names strengths and the weakest attribute', () => {
    const attrs = attributes({ ...empty, memory: { cards: 300, longTerm: 280 }, tasks: { easy: 5, medium: 10, hard: 5, attempted: 20, firstTry: 15 } })
    const { strengths, weakest } = strengthsAndWeakness(attrs)
    expect(strengths.map((a) => a.id).slice(0, 2).sort()).toEqual(['craft', 'memory'])
    expect(weakest.level).toBe(1)
  })

  it('unlocks skills from mastered topics and passed exams', () => {
    const base = { courseId: 'javascript-noob-to-god', courseTitle: 'JS', icon: '🎒', ratio: 0.8 }
    expect(topicSkill({ ...base, topicId: 'javascript-noob-to-god:core:jsd-ch-05', title: 'Замикання', crowns: 2 })).toBeNull()
    const closure = topicSkill({ ...base, topicId: 'javascript-noob-to-god:core:jsd-ch-05', title: 'Замикання', crowns: 3 })!
    expect(closure).toMatchObject({ id: 'javascript-noob-to-god:core:jsd-ch-05', name: 'Майстер замикань', kind: 'topic' })
    expect(closure.power).toBeGreaterThanOrEqual(1)
    expect(closure.power).toBeLessThanOrEqual(100)
    const generic = topicSkill({ ...base, courseId: 'english', topicId: 'english:a1:past-simple', title: 'Past Simple', icon: null, crowns: 5, ratio: 1 })!
    expect(generic.name).toBe('Past Simple · майстерність')
    expect(generic.power).toBe(100)
    const exam = sectionSkill({ courseId: 'javascript-noob-to-god', courseTitle: 'JS', sectionId: 'javascript-noob-to-god:core', title: 'Ядро мови', icon: '🧱', score: 0.8 })
    expect(exam).toMatchObject({ kind: 'section', name: 'Серце мови', power: 60 })
  })

  it('produces a stable battle snapshot', () => {
    const attrs = attributes(strong)
    const skills = [
      topicSkill({ courseId: 'c', courseTitle: 'C', topicId: 'c:b', title: 'B', icon: null, crowns: 4, ratio: 0.5 })!,
      topicSkill({ courseId: 'c', courseTitle: 'C', topicId: 'c:a', title: 'A', icon: null, crowns: 4, ratio: 0.5 })!,
    ]
    const equipped = { weapon: 'sword-iron', head: 'helm-leather' }
    const gear = { equipped, stats: gearStats(equipped) }
    const a = snapshotOf(rankAt(32), attrs, skills, gear)
    const b = snapshotOf(rankAt(32), [...attrs].reverse(), [...skills].reverse(), { equipped: { head: 'helm-leather', weapon: 'sword-iron' }, stats: gear.stats })
    expect(JSON.stringify(a)).toBe(JSON.stringify(b))
    expect(Object.keys(a)).toEqual(['version', 'rank', 'tier', 'step', 'title', 'attributes', 'skills', 'gear', 'power'])
    expect(Object.keys(a.attributes)).toEqual([...ATTRIBUTES])
    expect(Object.keys(a.gear.equipped)).toEqual(['head', 'weapon'])
    expect(Object.keys(a.gear.stats)).toEqual([...STATS])
    expect(a.skills.map((s) => s.id)).toEqual(['c:a', 'c:b'])
    expect(a).toMatchObject({ version: 2, rank: 'knight', tier: 3, step: 32, title: 'Лицар III' })
    expect(a.gear.stats).toMatchObject({ attack: 6, defense: 2, energy: 2, speed: 2 })
    expect(powerScore(attrs, 55, skills)).toBeGreaterThan(powerScore(attrs, 0, skills))
    expect(powerScore(attrs, 10, skills, gear.stats)).toBeGreaterThan(powerScore(attrs, 10, skills))
    expect(snapshotOf(rankAt(0), attrs, skills).gear).toEqual({ equipped: {}, stats: { attack: 0, defense: 0, energy: 0, focus: 0, speed: 0 } })
  })
})

describe('game icons (no emoji in the UI)', () => {
  // emoji glyphs (© / ® / ™ are plain text)
  const EMOJI = /(?![©®™])\p{Extended_Pictographic}/u
  const known = (ref: string) => {
    if (ref.startsWith('loo:')) return isLooStage(ref.slice(4))
    return ref.startsWith('px:') && (PIXEL_ICONS as readonly string[]).includes(ref.slice(3))
  }

  it('every power-up, attribute and achievement points at a real icon', () => {
    for (const item of SHOP_ITEMS) if ('icon' in item) expect(known(item.icon), item.id).toBe(true)
    for (const s of STATS) expect(known(STAT_ICON[s]), s).toBe(true)
    for (const l of ['noob', 'junior', 'middle', 'senior', 'techlead', 'god']) expect(known(levelIcon(l)), l).toBe(true)
    for (const icon of ['buck', 'sword', 'staff', 'helmet', 'armor', 'amulet', 'spark', 'insignia']) expect(PIXEL_ICONS, icon).toContain(icon)
    for (const icon of Object.values(ATTRIBUTE_ICON)) expect(known(icon), icon).toBe(true)
    for (const a of ACHIEVEMENTS) expect(known(a.icon), a.id).toBe(true)
  })

  it('every warrior rank has its own emblem', () => {
    const icons = WARRIOR_RANKS.map((r) => WARRIOR_ICON[r])
    for (const icon of icons) expect(PIXEL_ICONS, icon).toContain(icon)
    expect(new Set(icons).size).toBe(WARRIOR_RANKS.length)
  })

  it('league tiers have pixel badges and titles have icons', () => {
    for (const tier of LEAGUE_TIERS) expect(PIXEL_ICONS).toContain(TIER_LOOK[tier].icon)
    const tiers = messages().stats.tiers as unknown as Record<string, Record<string, { icon: string } | string>>
    for (const [dim, ids] of Object.entries(LADDERS)) for (const id of ids.ids) expect(known((tiers[dim]![id] as { icon: string }).icon), id).toBe(true)
  })

  it('catalog texts carry no emoji', () => {
    for (const a of ACHIEVEMENTS) expect(`${a.title} ${a.description}`, a.id).not.toMatch(EMOJI)
    expect(JSON.stringify(ukGame)).not.toMatch(EMOJI)
    expect(JSON.stringify(messages())).not.toMatch(EMOJI)
    for (const level of ['noob', 'junior', 'middle', 'senior', 'god']) expect(`${levelBadge(level)} ${levelTag(level)}`).not.toMatch(EMOJI)
  })
})
