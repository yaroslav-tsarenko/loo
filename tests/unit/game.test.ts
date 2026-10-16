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
  ATTRIBUTES,
  attributes,
  isRankUp,
  LEGACY_RANK_STEP,
  levelLabel,
  levelTag,
  LOO_FORM_LABEL,
  LOO_FORMS,
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
import { LEVEL_LABEL as COURSE_LEVEL_LABEL } from '@/course'
import { LEVEL_LABEL as CONTENT_LEVEL_LABEL } from '@/content/model'
import { LOO_FORM_LABEL as MASCOT_FORM_LABEL, LOO_FORMS as MASCOT_FORMS } from '@/ui/design/mascot/pixels'

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

describe('evolution ranks', () => {
  const input = { xp: 0, lessons: 0, tests: 0, exams: 0, courses: 0 }

  it('has 8 forms × 3 tiers with a single Legendary step (22 steps)', () => {
    expect(RANKS).toHaveLength(22)
    expect(RANKS.filter((r) => r.form === 'legendary')).toHaveLength(1)
    for (const form of LOO_FORMS.filter((f) => f !== 'legendary')) expect(RANKS.filter((r) => r.form === form).map((r) => r.tier)).toEqual([1, 2, 3])
    expect(RANKS.map((r) => r.index)).toEqual(RANKS.map((_, i) => i))
    expect(rankAt(10).title).toBe('Ламповий II')
    expect(rankAt(21).title).toBe('Легендарний')
  })

  it('thresholds never go down, step by step, for every requirement', () => {
    for (let i = 1; i < RANKS.length; i++) {
      const a = RANKS[i - 1]!.needs
      const b = RANKS[i]!.needs
      for (const k of ['xp', 'lessons', 'tests', 'exams', 'courses'] as const) expect(b[k]).toBeGreaterThanOrEqual(a[k])
      expect(b.xp).toBeGreaterThan(a.xp)
      expect(RANKS[i]!.gems).toBeGreaterThan(0)
    }
  })

  it('needs XP and course milestones', () => {
    expect(rankOf(input).id).toBe('egg-1')
    expect(rankOf({ ...input, xp: 150, lessons: 1 }).id).toBe('pixel-1')
    // plenty of XP, but no topic tests yet → stuck before Піксель III
    expect(rankOf({ ...input, xp: 50_000, lessons: 50 }).id).toBe('pixel-2')
    expect(rankOf({ ...input, xp: 5_000, lessons: 40, tests: 12, exams: 1 }).id).toBe('lamp-1')
    expect(rankOf({ xp: 200_000, lessons: 500, tests: 80, exams: 9, courses: 1 }).id).toBe('legendary')
    expect(rankOf({ xp: 200_000, lessons: 500, tests: 80, exams: 9, courses: 0 }).id).toBe('crowned-3')
  })

  it('reports the gap to the next step and the steps passed', () => {
    const p = rankProgress({ ...input, xp: 500, lessons: 5, tests: 3 })
    expect(p.rank.id).toBe('pixel-2')
    expect(p.next?.id).toBe('pixel-3')
    expect(p.gaps.find((g) => g.key === 'lessons')).toEqual({ key: 'lessons', have: 5, need: 6 })
    expect(isRankUp('pixel-2', 'pixel-3')).toBe(true)
    expect(isRankUp(5, 5)).toBe(false)
    expect(stepsBetween(2, 5).map((r) => r.index)).toEqual([3, 4, 5])
  })

  it('maps the old Noob→God ladder onto evolution steps', () => {
    expect(rankAt(LEGACY_RANK_STEP.trainee!).id).toBe('pixel-1')
    expect(rankAt(LEGACY_RANK_STEP.middle!).id).toBe('lamp-1')
    expect(rankAt(LEGACY_RANK_STEP.senior!).id).toBe('armored-1')
    expect(rankAt(LEGACY_RANK_STEP.god!).id).toBe('legendary')
  })
})

describe('one difficulty scale (labels)', () => {
  it('shows every level as the Loo form it matches', () => {
    expect(levelLabel('noob')).toBe('Піксель')
    expect(levelLabel('junior')).toBe('Блок')
    expect(levelLabel('middle')).toBe('Ламповий')
    expect(levelLabel('senior')).toBe('Броньований')
    expect(levelLabel('god')).toBe('Легендарний')
    expect(levelLabel('techlead')).toBe('Легендарний')
    expect(levelTag('senior')).toBe('🛡️ для Броньованого')
    expect(COURSE_LEVEL_LABEL.middle).toBe('Ламповий')
    expect(CONTENT_LEVEL_LABEL.junior).toBe('Блок')
    expect(Object.keys(LOO_FORM_LABEL)).toEqual([...LOO_FORMS])
  })

  it('agrees with the mascot drawing the forms (one order, one set of names)', () => {
    expect([...MASCOT_FORMS]).toEqual([...LOO_FORMS])
    expect(MASCOT_FORM_LABEL).toEqual(LOO_FORM_LABEL)
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
    const a = snapshotOf(rankAt(9), attrs, skills)
    const b = snapshotOf(rankAt(9), [...attrs].reverse(), [...skills].reverse())
    expect(JSON.stringify(a)).toBe(JSON.stringify(b))
    expect(Object.keys(a)).toEqual(['version', 'form', 'tier', 'step', 'title', 'attributes', 'skills', 'power'])
    expect(Object.keys(a.attributes)).toEqual([...ATTRIBUTES])
    expect(a.skills.map((s) => s.id)).toEqual(['c:a', 'c:b'])
    expect(a).toMatchObject({ form: 'lamp', tier: 1, step: 9 })
    expect(powerScore(attrs, 21, skills)).toBeGreaterThan(powerScore(attrs, 0, skills))
  })
})
