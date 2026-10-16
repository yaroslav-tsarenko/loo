import { rng, shuffle, type Seed } from '../rng'
import { byLevel, courseLadder, courseLevels, levelAt, levelRank, PLACEMENT_SKILLS, type CourseBundle, type Level, type PlacementItem, type PlacementSkill } from '../schema'
import { ieltsBand, type IeltsBand } from './ielts'

// Adaptive placement test, over the course's own ladder (noob…god, or A1…C2 for language courses). Stateless: the
// server replays the answers so far to get the next question. Two modes:
//
// * bank (`bundle.placement.bank`, a calibrated `_placement/` bank — docs/LANGUAGE_COURSE.md «Вступний тест»):
//   starts in the middle of the ladder (B1), binary search biased upwards; `perLevel` (4–5) questions per probed
//   level mixing skills and difficulties; a level passes at ≥ `pass` (75 %) right AND with most diff ≥ 2 items right
//   (only easy items right = not passed). The result needs the level below it passed too (a lucky streak on one level
//   doesn't place anyone); a pass above a fail is an inconsistency → search below both. «Не знаю» is wrong but not a
//   guess (the guess-corrected score doesn't penalise it). Confidence high / medium / low from the boundary margins;
//   below high a short follow-up (`followUp` questions around the boundary) can be taken. Per-skill levels come from
//   a small Bayesian estimate (guessing-aware) shrunk towards the overall level.
// * lessons (no bank — the JavaScript course): levels probed easier → harder: first the second-lowest level, then a
//   binary search over the rest, 2–3 questions per level (2 right → pass, 2 wrong → fail, 1:1 → a third question).

export interface PlacementAnswer {
  exerciseId: string
  correct: boolean
  // «Не знаю»: counted as wrong, but not as a guess
  dontKnow?: boolean
}

export interface PlacementOptions {
  // the learner asked for the follow-up after a not-so-confident result (bank mode)
  followUp?: boolean
}

export interface PlacementStep {
  done: boolean
  // next question to ask, null when done
  next: string | null
  probing: Level | null
  asked: number
  maxQuestions: number
  // bank mode: the adaptive search or the follow-up around the boundary
  phase?: 'main' | 'follow-up'
}

export interface LevelTally {
  asked: number
  correct: number
  // bank mode
  dontKnow?: number
  hardAsked?: number
  hardCorrect?: number
}

export type PlacementConfidence = 'high' | 'medium' | 'low'

export interface SkillEstimate {
  level: Level
  asked: number
  correct: number
  // fewer than 2 questions of the skill: the level is the overall one
  measured: boolean
  // guess-corrected share of right answers (−⅓ for a wrong guess of 4 options, 0 for «Не знаю»), 0…1
  score: number
  ielts: IeltsBand | null
}

export interface PlacementResult {
  level: Level
  // index of the first section to study; earlier sections count as known (tested out)
  sectionIndex: number
  sectionId: string | null
  perLevel: Record<Level, LevelTally>
  // false when the question limit cut the search short (bank mode: confidence is not high)
  confident: boolean
  // ── bank mode ──
  confidence?: PlacementConfidence
  // a follow-up test is offered (low confidence, not taken yet)
  followUp?: boolean
  // the follow-up was taken
  followedUp?: boolean
  skills?: Partial<Record<PlacementSkill, SkillEstimate>>
  // measured skills clearly above / below the overall level, strongest / weakest first
  strong?: PlacementSkill[]
  weak?: PlacementSkill[]
  ielts?: IeltsBand | null
  // false: the level's lessons are still `planned` — the start section is the highest level that has lessons
  lessonsReady?: boolean
  startLevel?: Level
}

type Verdict = 'pass' | 'fail' | 'open'

export function placementTest(bundle: CourseBundle, answers: readonly PlacementAnswer[], seed: Seed, opts: PlacementOptions = {}): PlacementStep {
  const { maxQuestions, enabled } = bundle.placement
  if (!enabled) return { done: true, next: null, probing: null, asked: 0, maxQuestions }
  if (bundle.placement.bank) return bankStep(bundle, answers, seed, opts)
  const r = replay(bundle, answers)
  if (r.done || !r.probing) return { done: true, next: null, probing: null, asked: r.total, maxQuestions }
  const next = placementQueue(bundle, r.probing, seed).find((id) => !r.asked.has(id)) ?? null
  return { done: next === null, next, probing: next ? r.probing : null, asked: r.total, maxQuestions }
}

// The order in which a level's questions are asked for this seed.
export function placementQueue(bundle: CourseBundle, level: Level, seed: Seed): string[] {
  if (bundle.placement.bank) return bankQueue(bundle, level, seed)
  return shuffle(bundle.placement.pool[level] ?? [], rng(`placement|${level}|${seed}`))
}

// Every question the test can possibly ask for this seed: a level is decided within `perLevel` questions (plus the
// follow-up in bank mode) and always takes them from the front of its queue. Lets a page pre-render the candidates.
export function placementCandidates(bundle: CourseBundle, seed: Seed): string[] {
  if (!bundle.placement.enabled) return []
  const take = bundle.placement.perLevel + (bundle.placement.bank ? (bundle.placement.followUp ?? 0) : 0)
  return courseLevels(bundle.course).flatMap((l) => ((bundle.placement.pool[l]?.length ?? 0) >= 2 ? placementQueue(bundle, l, seed).slice(0, take) : []))
}

export function placementResult(bundle: CourseBundle, answers: readonly PlacementAnswer[]): PlacementResult {
  if (bundle.placement.bank) return bankResult(bundle, answers)
  const r = replay(bundle, answers)
  const lowest = lowestLevel(bundle)
  let level: Level
  if (r.best >= 0) level = r.levels[r.best]!
  else if (r.levels.length > 0) level = levelAt(Math.max(levelRank(lowest), levelRank(r.levels[0]!) - 1), courseLadder(bundle.course))
  else level = lowest
  const { index, id } = startSection(bundle, level)
  return { level, sectionIndex: index, sectionId: id, perLevel: r.tallies, confident: r.done && !r.capped }
}

// ── Lessons mode (courses without a bank) ─────────────────────────────────────────────────────────────────────

interface Replay {
  levels: Level[]
  tallies: Record<Level, LevelTally>
  asked: Set<string>
  total: number
  best: number
  probing: Level | null
  done: boolean
  capped: boolean
}

function verdict(t: LevelTally, perLevel: number, poolSize: number): Verdict {
  const needed = Math.ceil((perLevel * 2) / 3)
  if (t.correct >= needed) return 'pass'
  if (t.asked - t.correct > perLevel - needed) return 'fail'
  // pool ran out before the level was decided: judge by the ratio
  if (t.asked >= Math.min(perLevel, poolSize)) return t.asked > 0 && t.correct / t.asked >= 2 / 3 ? 'pass' : 'fail'
  return 'open'
}

function lowestLevel(bundle: CourseBundle): Level {
  return courseLevels(bundle.course)[0]!
}

function replay(bundle: CourseBundle, answers: readonly PlacementAnswer[]): Replay {
  const { pool, perLevel, maxQuestions } = bundle.placement
  const levels = courseLevels(bundle.course).filter((l) => (pool[l]?.length ?? 0) >= 2)
  const tallies = byLevel((): LevelTally => ({ asked: 0, correct: 0 }))
  const inPool = new Map<string, Level>()
  for (const l of levels) for (const id of pool[l] ?? []) inPool.set(id, l)
  const asked = new Set<string>()
  for (const a of answers) {
    const level = inPool.get(a.exerciseId)
    if (!level || asked.has(a.exerciseId)) continue
    asked.add(a.exerciseId)
    tallies[level].asked++
    if (a.correct) tallies[level].correct++
  }
  const total = asked.size
  const lowest = lowestLevel(bundle)
  let lo = 0
  let hi = levels.length - 1
  let best = -1
  let first = true
  while (lo <= hi) {
    const mid = first && hi >= 2 ? Math.min(1, hi) : (lo + hi) >> 1
    first = false
    const level = levels[mid]!
    // failing everything above the course's lowest level already means «lowest»: no need to probe it
    if (mid === 0 && level === lowest && hi < levels.length - 1 && tallies[level].asked === 0) break
    const v = verdict(tallies[level], perLevel, pool[level]?.length ?? 0)
    if (v === 'open') {
      const capped = total >= maxQuestions
      return { levels, tallies, asked, total, best, probing: capped ? null : level, done: capped, capped }
    }
    if (v === 'pass') {
      best = mid
      lo = mid + 1
    } else hi = mid - 1
  }
  return { levels, tallies, asked, total, best, probing: null, done: true, capped: false }
}

// ── Bank mode ─────────────────────────────────────────────────────────────────────────────────────────────────

// Difficulty order inside a level's queue: the first `perLevel` questions mix easy, typical and hard items (one easy
// at most in a probe of 4–5), follow-up questions continue the pattern.
const DIFF_PATTERN = [2, 1, 3, 2, 2, 3, 1, 2] as const
// a pass with this guess-corrected score (or better) is a clear one: 5/5, 4/4, or 4/5 with the miss a «Не знаю»
const CLEAR_PASS = 0.8
// the level above failed clearly at ≤ this share right (2 of 5)
const CLEAR_FAIL = 0.4

interface BankTally {
  asked: number
  correct: number
  dontKnow: number
  hardAsked: number
  hardCorrect: number
  // guess-corrected points: +1 right, 0 «Не знаю», −1/(options−1) a wrong guess
  score: number
}

interface BankCfg {
  // levels with a bank (≥ 2 questions), in ladder order
  ladder: Level[]
  perLevel: number
  pass: number
  max: number
  followUp: number
  avail: Record<Level, number>
  start: number
}

type BankVerdict = Verdict | 'none'

interface Outcome {
  // index of the next level to probe; null → decided
  probe: number | null
  // index of the result level in the ladder; −1 → below the lowest probed level
  best: number
  // the first contradiction met: a pass right above a fail
  inconsistent: { lower: number; upper: number } | null
}

interface SearchEnd extends Outcome, Margins {
  // answers taken when the search ended
  count: number
  capped: boolean
}

// A targeted round over the narrow boundary levels: `budget` questions round robin (the upper level first), then
// the search resumes on the new evidence, all within `cap` questions in total.
interface Round {
  start: number
  unclear: number[]
  budget: number
  cap: number
}

interface Settled {
  outcome: Outcome
  margins: Margins
  count: number
}

interface BankRun {
  cfg: BankCfg
  tallies: Record<Level, BankTally>
  asked: Set<string>
  // bank items of the answers, in order (duplicates and unknown ids dropped)
  items: Array<{ item: PlacementItem; answer: PlacementAnswer }>
  // the binary search ended (null while it runs)
  search: SearchEnd | null
  // the automatic confirmation of narrow boundaries inside the main limit (null: not needed)
  confirm: Round | null
  // the main test's outcome: search + confirmation (null while it runs)
  main: Settled | null
  // the follow-up the learner asked for
  follow: Round | null
  // what to ask now; null → done
  next: { level: Level; phase: 'main' | 'follow-up' } | null
}

function bankCfg(bundle: CourseBundle): BankCfg {
  const p = bundle.placement
  const ladder = courseLevels(bundle.course).filter((l) => (p.pool[l]?.length ?? 0) >= 2)
  return {
    ladder,
    perLevel: p.perLevel,
    pass: p.pass ?? 0.75,
    max: p.maxQuestions,
    followUp: p.followUp ?? 0,
    avail: byLevel((l) => p.pool[l]?.length ?? 0),
    start: Math.floor((ladder.length - 1) / 2),
  }
}

const emptyTally = (): BankTally => ({ asked: 0, correct: 0, dontKnow: 0, hardAsked: 0, hardCorrect: 0, score: 0 })

// Guessing protection: most of the typical / hard (diff ≥ 2) items right, at least one.
const hardOk = (t: BankTally): boolean => t.hardCorrect >= 1 && t.hardCorrect * 2 >= t.hardAsked

const EPS = 1e-9

// A probe of `perLevel` questions (fewer when the bank is thin); decided early once the outcome can't change.
function bankVerdict(t: BankTally, cfg: BankCfg, level: Level): Verdict {
  const n = Math.min(cfg.perLevel, cfg.avail[level])
  const need = Math.ceil(cfg.pass * n - EPS)
  if (t.asked >= n) return t.correct >= cfg.pass * t.asked - EPS && hardOk(t) ? 'pass' : 'fail'
  if (t.correct >= need && hardOk(t)) return 'pass'
  if (t.asked - t.correct > n - need) return 'fail'
  return 'open'
}

// No more questions: an unfinished level is judged by its share, an unprobed one is unknown.
function finalVerdict(t: BankTally, cfg: BankCfg, level: Level): BankVerdict {
  const v = bankVerdict(t, cfg, level)
  if (v !== 'open') return v
  if (t.asked === 0) return 'none'
  return t.correct >= cfg.pass * t.asked - EPS && hardOk(t) ? 'pass' : 'fail'
}

// Binary search (first probe in the middle, then biased upwards) + the level below the result must be passed too.
// `verdictOf` never returns 'open' in the final mode; 'none' (unknown) can't be claimed as a pass, and doesn't
// contradict a pass above it.
function resolve(cfg: BankCfg, lowestIsCourseLowest: boolean, verdictOf: (i: number) => BankVerdict, asked: (i: number) => number): Outcome {
  let hi = cfg.ladder.length - 1
  let first = true
  let inconsistent: Outcome['inconsistent'] = null
  for (;;) {
    let lo = 0
    let top = hi
    let best = -1
    while (lo <= top) {
      const mid = first ? Math.min(cfg.start, top) : Math.ceil((lo + top) / 2)
      first = false
      // everything above the course's lowest level failed: the result is the lowest level — no need to probe it
      if (mid === 0 && lowestIsCourseLowest && top < cfg.ladder.length - 1 && asked(0) === 0) break
      const v = verdictOf(mid)
      if (v === 'open') return { probe: mid, best, inconsistent }
      if (v === 'pass') {
        best = mid
        lo = mid + 1
      } else top = mid - 1
    }
    if (best <= 0) return { probe: null, best, inconsistent }
    const below = verdictOf(best - 1)
    if (below === 'open') return { probe: best - 1, best, inconsistent }
    if (below !== 'fail') return { probe: null, best, inconsistent }
    // a pass right above a fail: a lucky streak or a slip — the result has to come from below both
    inconsistent ??= { lower: best - 1, upper: best }
    hi = best - 2
    if (hi < 0) return { probe: null, best: -1, inconsistent }
  }
}

function corrected(t: BankTally): number {
  return t.asked > 0 ? Math.max(0, t.score / t.asked) : 0
}

interface Margins {
  confidence: PlacementConfidence
  // the boundary levels (ladder indexes) whose verdict was narrow — the follow-up asks about them
  unclear: number[]
}

// high: consistent, within the limit, the result level passed with a margin and the next one failed clearly;
// medium: one of the margins is narrow; low: both, a contradiction or the question limit.
function marginsOf(cfg: BankCfg, tallies: Record<Level, BankTally>, o: Outcome, capped: boolean): Margins {
  const L = cfg.ladder
  const r = o.best
  // the level right above the result (the lowest one skipped → the first probed level above it)
  let upIndex = r + 1
  if (r < 0 && L[0] && tallies[L[0]].asked === 0) upIndex = 1
  if (o.inconsistent) return { confidence: 'low', unclear: [o.inconsistent.lower, o.inconsistent.upper] }
  const unclear: number[] = []
  if (r >= 0 && corrected(tallies[L[r]!]) < CLEAR_PASS - EPS) unclear.push(r)
  const up = upIndex < L.length ? tallies[L[upIndex]!] : null
  // a clear fail: ≤ 40 % right over ≥ 4 questions, or nothing right at all (an early stop after 1 of 3 is a maybe)
  if (up && !(up.asked > 0 && up.correct / up.asked <= CLEAR_FAIL + EPS && (up.asked >= 4 || up.correct === 0))) unclear.push(upIndex)
  if (capped) return { confidence: 'low', unclear: unclear.length > 0 ? unclear : [Math.max(0, r), Math.min(L.length - 1, upIndex)].filter((v, i, a) => a.indexOf(v) === i) }
  return { confidence: unclear.length === 0 ? 'high' : unclear.length === 1 ? 'medium' : 'low', unclear }
}

function bankRun(bundle: CourseBundle, answers: readonly PlacementAnswer[], allowFollowUp: boolean): BankRun {
  const cfg = bankCfg(bundle)
  const bank = bundle.placement.bank ?? {}
  const tallies = byLevel(emptyTally)
  const asked = new Set<string>()
  const items: BankRun['items'] = []
  const inLadder = new Set(cfg.ladder)
  const lowestIsCourseLowest = cfg.ladder[0] === courseLevels(bundle.course)[0]
  const at = (i: number) => cfg.ladder[i]!
  const searchNow = () =>
    resolve(
      cfg,
      lowestIsCourseLowest,
      (i) => bankVerdict(tallies[at(i)], cfg, at(i)),
      (i) => tallies[at(i)].asked,
    )
  const final = () => finalOutcome(cfg, tallies, lowestIsCourseLowest)
  const has = (i: number) => tallies[at(i)].asked < cfg.avail[at(i)]
  const st: Omit<BankRun, 'cfg' | 'tallies' | 'asked' | 'items'> = { search: null, confirm: null, main: null, follow: null, next: null }

  // the next question of a round (a ladder index), or null when the round is over
  const roundAsk = (round: Round, total: number): number | null => {
    if (total >= round.cap) return null
    const extra = total - round.start
    if (extra < round.budget) {
      const upFirst = [...round.unclear].reverse()
      for (let i = 0; i < upFirst.length; i++) {
        const index = upFirst[(i + extra) % upFirst.length]!
        if (has(index)) return index
      }
    }
    // the new evidence may move the boundary (e.g. a slip on the first level sent the search down): resume it
    return searchNow().probe
  }

  // Deterministic policy: what to ask after `total` answers (advances the phase markers as it goes).
  const decide = (total: number): BankRun['next'] => {
    if (!st.search) {
      const o = searchNow()
      if (o.probe !== null && total < cfg.max) return { level: at(o.probe), phase: 'main' }
      const capped = o.probe !== null
      const out = capped ? final() : o
      st.search = { ...out, ...marginsOf(cfg, tallies, out, capped), count: total, capped }
    }
    if (!st.main) {
      if (!st.confirm) {
        const s = st.search
        if (s.confidence !== 'high' && !s.capped && cfg.followUp > 0 && s.unclear.length > 0 && total < cfg.max) st.confirm = { start: total, unclear: s.unclear, budget: cfg.followUp, cap: cfg.max }
        else st.main = { outcome: s, margins: s, count: total }
      }
      if (st.confirm && !st.main) {
        const index = roundAsk(st.confirm, total)
        if (index !== null) return { level: at(index), phase: 'main' }
        const out = final()
        st.main = { outcome: out, margins: marginsOf(cfg, tallies, out, false), count: total }
      }
    }
    const main = st.main!
    if (!allowFollowUp) return null
    if (!st.follow) {
      if (main.margins.confidence !== 'low' || cfg.followUp <= 0 || main.margins.unclear.length === 0) return null
      st.follow = { start: total, unclear: main.margins.unclear, budget: cfg.followUp, cap: cfg.max + cfg.followUp }
    }
    const index = roundAsk(st.follow, total)
    return index === null ? null : { level: at(index), phase: 'follow-up' }
  }

  for (const answer of answers) {
    decide(asked.size)
    const item = bank[answer.exerciseId]
    if (!item || asked.has(answer.exerciseId) || !inLadder.has(item.level)) continue
    asked.add(answer.exerciseId)
    items.push({ item, answer })
    const t = tallies[item.level]
    const right = answer.correct && !answer.dontKnow
    t.asked++
    if (right) t.correct++
    if (answer.dontKnow) t.dontKnow++
    if (item.diff >= 2) {
      t.hardAsked++
      if (right) t.hardCorrect++
    }
    t.score += right ? 1 : answer.dontKnow ? 0 : -1 / Math.max(1, item.options - 1)
  }
  st.next = decide(asked.size)
  return { cfg, tallies, asked, items, ...st }
}

function finalOutcome(cfg: BankCfg, tallies: Record<Level, BankTally>, lowestIsCourseLowest: boolean): Outcome {
  const at = (i: number) => cfg.ladder[i]!
  return resolve(
    cfg,
    lowestIsCourseLowest,
    (i) => finalVerdict(tallies[at(i)], cfg, at(i)),
    (i) => tallies[at(i)].asked,
  )
}

function bankStep(bundle: CourseBundle, answers: readonly PlacementAnswer[], seed: Seed, opts: PlacementOptions): PlacementStep {
  const run = bankRun(bundle, answers, opts.followUp === true)
  const total = run.asked.size
  const maxQuestions = run.cfg.max + (opts.followUp ? run.cfg.followUp : 0)
  const next = run.next ? (bankQueue(bundle, run.next.level, seed).find((id) => !run.asked.has(id)) ?? null) : null
  if (!next || !run.next) return { done: true, next: null, probing: null, asked: total, maxQuestions }
  return { done: false, next, probing: run.next.level, asked: total, maxQuestions, phase: run.next.phase }
}

// A level's questions for this seed, ordered so that every block of `perLevel` mixes the skills (shuffled order,
// cycling) and the difficulties (DIFF_PATTERN); the nearest match when the bank lacks the exact pair.
function bankQueue(bundle: CourseBundle, level: Level, seed: Seed): string[] {
  const bank = bundle.placement.bank ?? {}
  const rest = shuffle(bundle.placement.pool[level] ?? [], rng(`placement|${level}|${seed}`)).filter((id) => bank[id])
  const skills = shuffle(
    PLACEMENT_SKILLS.filter((s) => rest.some((id) => bank[id]!.skill === s)),
    rng(`placement-skills|${level}|${seed}`),
  )
  const out: string[] = []
  for (let i = 0; rest.length > 0; i++) {
    const skill = skills[i % skills.length]
    const diff = DIFF_PATTERN[i % DIFF_PATTERN.length]!
    const tests: Array<(m: PlacementItem) => boolean> = [
      (m) => m.skill === skill && m.diff === diff,
      (m) => m.skill === skill && (diff >= 2 ? m.diff >= 2 : m.diff <= 2),
      (m) => m.skill === skill,
      (m) => m.diff === diff,
      () => true,
    ]
    let at = -1
    for (const test of tests) {
      at = rest.findIndex((id) => test(bank[id]!))
      if (at >= 0) break
    }
    out.push(rest.splice(at, 1)[0]!)
  }
  return out
}

function bankResult(bundle: CourseBundle, answers: readonly PlacementAnswer[]): PlacementResult {
  const run = bankRun(bundle, answers, true)
  const { cfg, tallies } = run
  const lowestIsCourseLowest = cfg.ladder[0] === courseLevels(bundle.course)[0]
  const followed = run.follow !== null && run.asked.size > run.follow.start
  let outcome: Outcome
  let confidence: PlacementConfidence
  let offer = false
  if (!run.main) {
    // stopped before the end (not applied by the UI, but well-defined)
    outcome = finalOutcome(cfg, tallies, lowestIsCourseLowest)
    confidence = 'low'
  } else if (followed) {
    outcome = finalOutcome(cfg, tallies, lowestIsCourseLowest)
    confidence = marginsOf(cfg, tallies, outcome, false).confidence
  } else {
    outcome = run.main.outcome
    confidence = run.main.margins.confidence
    offer = confidence === 'low' && cfg.followUp > 0 && run.main.margins.unclear.length > 0
  }
  const lowest = lowestLevel(bundle)
  let level: Level
  if (outcome.best >= 0) level = cfg.ladder[outcome.best]!
  else if (cfg.ladder.length > 0) level = levelAt(Math.max(levelRank(lowest), levelRank(cfg.ladder[0]!) - 1), courseLadder(bundle.course))
  else level = lowest
  // a language level is studied in its own section (like the manual «Впевнено говорю · B1»); planned → the highest
  // level that has lessons
  const start = sectionForLevel(bundle, level)
  const startSec = bundle.sections[start.index]
  const lessonsReady = bundle.sections.some((s) => s.kind === 'path' && s.status !== 'planned' && levelRank(s.minLevel) <= levelRank(level) && levelRank(level) <= levelRank(s.level))
  const levels = courseLevels(bundle.course)
  const skills = estimateSkills(run.items, level, levels)
  const perLevel = byLevel((l): LevelTally => {
    const t = tallies[l]
    return { asked: t.asked, correct: t.correct, dontKnow: t.dontKnow, hardAsked: t.hardAsked, hardCorrect: t.hardCorrect }
  }, levels)
  return {
    level,
    sectionIndex: start.index,
    sectionId: start.id,
    perLevel,
    confident: confidence === 'high',
    confidence,
    followUp: offer,
    followedUp: followed,
    ...skills,
    ielts: ieltsBand(level),
    lessonsReady,
    startLevel: startSec?.level ?? level,
  }
}

// ── Skills ──
// Per skill: posterior mean of the ability θ (in levels: θ ∈ [i, i+1) ⇔ level i) on a grid, with a normal prior on
// the overall level (σ 0.75) — few questions per skill, so the overall result anchors it. An item of level i, diff d
// has difficulty b = i + 0.25 + 0.3·(d − 2); P(right) = c + (1 − c)·σ(K(θ − b)), c = 1/options (a blind guess);
// «Не знаю» is wrong with no guessing (P = 1 − σ). A skill clearly above / below the overall level (|θ − mid| ≥ 0.35)
// is strong / weak.
const K = 2.77
const PRIOR_SD = 0.75
const SKILL_MARGIN = 0.35

const sigmoid = (x: number): number => 1 / (1 + Math.exp(-x))

function estimateSkills(items: BankRun['items'], overall: Level, levels: readonly Level[]): Pick<PlacementResult, 'skills' | 'strong' | 'weak'> {
  const n = levels.length
  const mid = levels.indexOf(overall) + 0.5
  const grid: number[] = []
  for (let x = -1; x <= n + 1e-9; x += 0.05) grid.push(x)
  const skills: Partial<Record<PlacementSkill, SkillEstimate>> = {}
  const shift: Array<{ skill: PlacementSkill; d: number }> = []
  for (const skill of PLACEMENT_SKILLS) {
    const mine = items.filter((x) => x.item.skill === skill)
    const asked = mine.length
    const correct = mine.filter((x) => x.answer.correct && !x.answer.dontKnow).length
    const points = mine.reduce((sum, x) => sum + (x.answer.correct && !x.answer.dontKnow ? 1 : x.answer.dontKnow ? 0 : -1 / Math.max(1, x.item.options - 1)), 0)
    let weight = 0
    let mean = 0
    const logs = grid.map((theta) => {
      let lp = -((theta - mid) ** 2) / (2 * PRIOR_SD ** 2)
      for (const { item, answer } of mine) {
        const b = levels.indexOf(item.level) + 0.25 + 0.3 * (item.diff - 2)
        const s = sigmoid(K * (theta - b))
        const right = answer.correct && !answer.dontKnow
        const c = answer.dontKnow ? 0 : 1 / Math.max(2, item.options)
        const p = c + (1 - c) * s
        lp += Math.log(Math.max(1e-12, right ? p : 1 - p))
      }
      return lp
    })
    const peak = Math.max(...logs)
    logs.forEach((lp, i) => {
      const w = Math.exp(lp - peak)
      weight += w
      mean += w * grid[i]!
    })
    const theta = mean / weight
    const measured = asked >= 2
    const level = measured ? levels[Math.max(0, Math.min(n - 1, Math.floor(theta)))]! : overall
    skills[skill] = { level, asked, correct, measured, score: asked > 0 ? Math.max(0, points / asked) : 0, ielts: ieltsBand(level) }
    if (measured) shift.push({ skill, d: theta - mid })
  }
  const strong = shift.filter((s) => s.d >= SKILL_MARGIN).sort((a, b) => b.d - a.d).map((s) => s.skill)
  const weak = shift.filter((s) => s.d <= -SKILL_MARGIN).sort((a, b) => a.d - b.d).map((s) => s.skill)
  return { skills, strong, weak }
}

// First path section that is harder than the level; all-known → the last path section. Planned sections («скоро»)
// have nothing to study yet.
export function startSection(bundle: CourseBundle, level: Level): { index: number; id: string | null } {
  const path = bundle.sections.filter((s) => s.kind === 'path' && s.status !== 'planned')
  const target = path.find((s) => levelRank(s.level) > levelRank(level)) ?? path.at(-1) ?? bundle.sections[0]
  return target ? { index: target.index, id: target.id } : { index: 0, id: null }
}

// A manual start («з нуля» → the lowest level, «трохи знаю» → A2…): the first path section that teaches the level
// (earlier sections count as known). Planned sections are skipped.
export function sectionForLevel(bundle: CourseBundle, level: Level): { index: number; id: string | null } {
  const path = bundle.sections.filter((s) => s.kind === 'path' && s.status !== 'planned')
  const target = path.find((s) => levelRank(s.level) >= levelRank(level)) ?? path.at(-1) ?? bundle.sections[0]
  return target ? { index: target.index, id: target.id } : { index: 0, id: null }
}
