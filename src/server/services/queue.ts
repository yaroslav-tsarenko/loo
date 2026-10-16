import 'server-only'
import { and, desc, eq, gte, inArray, isNull, sql } from 'drizzle-orm'
import { first, type Conn } from '@/db/client'
import { attempts, mistakes, srsCards, taskState } from '@/db/schema'
import { LEVELS, type LearningUnit, type Level, type UnitKind } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { dayKey } from '@/progress/day'
import { nextEligibleAt } from '@/progress/mistakes'
import type { SrsCard } from '@/progress/srs'
import type { PracticeSignals } from '@/course'
import { userScope } from '../auth'
import { read, readAll, readOne, type Read } from '../db/batch'
import { signalReads } from '../courses/signals'
import { readSettings } from '../settings'

export interface StudyFilters {
  guide: string | null
  chapter: string | null
  levels: Level[]
  frequencies: string[]
  types: string[]
  mode: 'due' | 'all'
  size: number
  // «Усі курси»: ignore the active course (?scope=all)
  all: boolean
}

type Params = Record<string, string | string[] | undefined>

function list(value: string | string[] | undefined): string[] {
  if (!value) return []
  return (Array.isArray(value) ? value : value.split(',')).map((v) => v.trim()).filter(Boolean)
}

export function parseFilters(params: Params, defaultSize: number): StudyFilters {
  const one = (k: string) => {
    const v = params[k]
    return (Array.isArray(v) ? v[0] : v) || null
  }
  const size = Number(one('size'))
  return {
    guide: one('guide'),
    chapter: one('chapter'),
    levels: list(params.level).filter((l): l is Level => (LEVELS as readonly string[]).includes(l)),
    frequencies: list(params.freq),
    types: list(params.type),
    mode: one('mode') === 'all' ? 'all' : 'due',
    size: Number.isInteger(size) && size > 0 && size <= 200 ? size : defaultSize,
    all: one('scope') === 'all',
  }
}

export function filtersToQuery(f: StudyFilters, extra: Record<string, string> = {}): string {
  const q = new URLSearchParams()
  if (f.guide) q.set('guide', f.guide)
  if (f.chapter) q.set('chapter', f.chapter)
  if (f.levels.length) q.set('level', f.levels.join(','))
  if (f.frequencies.length) q.set('freq', f.frequencies.join(','))
  if (f.types.length) q.set('type', f.types.join(','))
  if (f.mode !== 'due') q.set('mode', f.mode)
  q.set('size', String(f.size))
  if (f.all) q.set('scope', 'all')
  for (const [k, v] of Object.entries(extra)) q.set(k, v)
  return q.toString()
}

export function unitOrder(snapshot: ContentSnapshot): Map<string, number> {
  const order = new Map<string, number>()
  let i = 0
  for (const guide of snapshot.guides) {
    for (const chapterId of [guide.indexChapterId, ...guide.chapterIds]) {
      if (!chapterId) continue
      for (const unit of snapshot.unitsByChapter.get(chapterId) ?? []) if (!order.has(unit.id)) order.set(unit.id, i++)
    }
  }
  return order
}

// scope: exercise ids of the active course (src/server/courses/enrollment.ts → studyScope); null = all content.
export function matchUnits(snapshot: ContentSnapshot, f: StudyFilters, kind: UnitKind, scope: ReadonlySet<string> | null = null): LearningUnit[] {
  const order = unitOrder(snapshot)
  const out: LearningUnit[] = []
  for (const unit of snapshot.units.values()) {
    if (unit.kind !== kind) continue
    if (scope && !scope.has(unit.id)) continue
    if (f.guide && unit.guideId !== f.guide) continue
    if (f.chapter && unit.chapterId !== f.chapter) continue
    if (f.levels.length && (!unit.level || !f.levels.includes(unit.level))) continue
    if (unit.kind === 'flashcard') {
      if (f.frequencies.length && (!unit.frequency || !f.frequencies.includes(unit.frequency))) continue
      if (f.types.length && (!unit.qtype || !f.types.includes(unit.qtype))) continue
    }
    if (unit.kind === 'quiz' && f.types.length && !f.types.includes(unit.mode)) continue
    // [!speak] needs a microphone: only when asked for explicitly («Вимова»)
    if (unit.kind === 'quiz' && unit.mode === 'speak' && !f.types.includes('speak')) continue
    if (unit.kind === 'task' && f.types.length && !f.types.includes(unit.difficulty)) continue
    out.push(unit)
  }
  return out.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))
}

export async function srsMap(ids: readonly string[]): Promise<Map<string, SrsCard>> {
  if (ids.length === 0) return new Map()
  return userScope((db, userId) => srsMapIn(db, userId, ids))
}

// A whole course's pool can be thousands of ids: past BIG_POOL the learner's cards come back in one query and are
// filtered here (a learner has at most a few thousand cards) instead of shipping every id as a parameter.
const BIG_POOL = 500

export async function srsMapIn(db: Conn, userId: string, ids: readonly string[]): Promise<Map<string, SrsCard>> {
  if (ids.length === 0) return new Map()
  const wanted = new Set(ids)
  const rows =
    ids.length > BIG_POOL
      ? (await db.select().from(srsCards).where(eq(srsCards.userId, userId))).filter((r) => wanted.has(r.unitId))
      : await db
          .select()
          .from(srsCards)
          .where(and(eq(srsCards.userId, userId), inArray(srsCards.unitId, [...ids])))
  return new Map(
    rows.map((r) => [
      r.unitId,
      {
        due: r.due,
        stability: r.stability,
        difficulty: r.difficulty,
        elapsedDays: r.elapsedDays,
        scheduledDays: r.scheduledDays,
        learningSteps: r.learningSteps,
        reps: r.reps,
        lapses: r.lapses,
        state: r.state,
        lastReview: r.lastReview,
      },
    ]),
  )
}

export async function newIntroducedToday(now: number): Promise<number> {
  return userScope((db, userId) => newIntroducedTodayIn(db, userId, now))
}

async function newIntroducedTodayIn(db: Conn, userId: string, now: number): Promise<number> {
  const today = dayKey(now)
  const firsts = db
    .select({ unitId: attempts.unitId, firstDay: sql<string>`min(${attempts.day})`.as('first_day') })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), eq(attempts.kind, 'flashcard')))
    .groupBy(attempts.unitId)
    .as('firsts')
  const row = await first(db.select({ n: sql<number>`count(*)` }).from(firsts).where(sql`${firsts.firstDay} = ${today}`))
  return Number(row?.n ?? 0)
}

export interface FlashQueue {
  ids: string[]
  due: number
  fresh: number
  total: number
  newLeft: number
}

// orderNew: the order new cards are introduced in (language courses: the learner's level first —
// src/server/courses/adaptive.ts → newWordOrder); default — document order.
export async function flashcardQueue(snapshot: ContentSnapshot, f: StudyFilters, now = Date.now(), scope: ReadonlySet<string> | null = null, orderNew?: (units: readonly LearningUnit[]) => LearningUnit[]): Promise<FlashQueue> {
  const candidates = matchUnits(snapshot, f, 'flashcard', scope)
  const settings = await readSettings()
  // one transaction, both reads in one round trip
  const [cards, introduced] = await userScope((db, userId) => Promise.all([srsMapIn(db, userId, candidates.map((u) => u.id)), newIntroducedTodayIn(db, userId, now)]))
  const due = candidates.filter((u) => cards.has(u.id) && cards.get(u.id)!.due <= now).sort((a, b) => cards.get(a.id)!.due - cards.get(b.id)!.due)
  const fresh = candidates.filter((u) => !cards.has(u.id))
  const unseen = orderNew ? orderNew(fresh) : fresh
  const newLeft = Math.max(0, settings.newCardsPerDay - introduced)
  let ids: string[]
  if (f.mode === 'all') ids = candidates.map((u) => u.id).slice(0, f.size)
  else ids = [...due.map((u) => u.id), ...unseen.slice(0, newLeft).map((u) => u.id)].slice(0, f.size)
  return { ids, due: due.length, fresh: unseen.length, total: candidates.length, newLeft }
}

export function shuffle<T>(items: readonly T[], seed: number): T[] {
  const out = items.slice()
  let s = seed || 1
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    const j = s % (i + 1)
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

export interface MistakeRow {
  unit: LearningUnit
  wrongCount: number
  correctStreak: number
  lastWrongAt: number
  eligibleAt: number | null
}

export async function openMistakeRows(snapshot: ContentSnapshot): Promise<MistakeRow[]> {
  const rows = await userScope((db, userId) =>
    db
      .select()
      .from(mistakes)
      .where(and(eq(mistakes.userId, userId), isNull(mistakes.resolvedAt))),
  )
  return openRowsFrom(snapshot, rows)
}

function openRowsFrom(snapshot: ContentSnapshot, rows: ReadonlyArray<typeof mistakes.$inferSelect>): MistakeRow[] {
  const out: MistakeRow[] = []
  for (const r of rows) {
    if (r.resolvedAt !== null) continue
    const unit = snapshot.units.get(r.unitId)
    if (!unit) continue
    out.push({ unit, wrongCount: r.wrongCount, correctStreak: r.correctStreak, lastWrongAt: r.lastWrongAt, eligibleAt: nextEligibleAt({ ...r }) })
  }
  return out.sort((a, b) => b.lastWrongAt - a.lastWrongAt)
}

export async function recentlyResolved(snapshot: ContentSnapshot, since: number): Promise<LearningUnit[]> {
  const rows = await userScope((db, userId) =>
    db
      .select()
      .from(mistakes)
      .where(and(eq(mistakes.userId, userId), gte(mistakes.resolvedAt, since))),
  )
  return rows.map((r) => snapshot.units.get(r.unitId)).filter((u): u is LearningUnit => Boolean(u))
}

export async function mistakeTopics(snapshot: ContentSnapshot): Promise<Array<{ chapterId: string; open: number; ever: number }>> {
  const rows = await userScope((db, userId) => db.select().from(mistakes).where(eq(mistakes.userId, userId)))
  return topicsFrom(snapshot, rows)
}

function topicsFrom(snapshot: ContentSnapshot, rows: ReadonlyArray<typeof mistakes.$inferSelect>): Array<{ chapterId: string; open: number; ever: number }> {
  const byChapter = new Map<string, { open: number; ever: number }>()
  for (const r of rows) {
    const unit = snapshot.units.get(r.unitId)
    if (!unit) continue
    const entry = byChapter.get(unit.chapterId) ?? { open: 0, ever: 0 }
    entry.ever++
    if (r.resolvedAt === null) entry.open++
    byChapter.set(unit.chapterId, entry)
  }
  return [...byChapter.entries()].map(([chapterId, v]) => ({ chapterId, ...v })).sort((a, b) => b.open - a.open || b.ever - a.ever)
}

// «Мої помилки» in one query: open rows, per-topic counts and the ones resolved since `since` all come from the
// learner's mistakes table (was three transactions).
// signalsFor (language courses): also the recent wrong answers and topic-test scores of that course, in the same
// statement (src/server/courses/signals.ts) — for ordering the session by level and topic trouble.
export async function mistakesOverview(
  snapshot: ContentSnapshot,
  since: number,
  signalsFor?: { courseId: string; now: number },
): Promise<{ open: MistakeRow[]; topics: Array<{ chapterId: string; open: number; ever: number }>; resolved: LearningUnit[]; signals: PracticeSignals | null }> {
  const { rows, signals } = await userScope(async (db, userId) => {
    const all = read(db.select().from(mistakes).where(eq(mistakes.userId, userId)), (r) => r)
    if (!signalsFor) return { rows: await readOne(db, all), signals: null }
    const [, recent, scores] = signalReads(db, userId, signalsFor.courseId, signalsFor.now)
    const [rows, recentWrong, topicScores] = await readAll(db, [all, recent, scores])
    const open = new Map(rows.filter((r) => r.resolvedAt === null).map((r) => [r.unitId, { wrongCount: r.wrongCount }]))
    return { rows, signals: { mistakes: open, recentWrong, topicScores } satisfies PracticeSignals }
  })
  return {
    signals,
    open: openRowsFrom(snapshot, rows),
    topics: topicsFrom(snapshot, rows),
    resolved: rows.filter((r) => r.resolvedAt !== null && r.resolvedAt >= since).flatMap((r) => snapshot.units.get(r.unitId) ?? []),
  }
}

export async function taskStates(ids: readonly string[]): Promise<Map<string, typeof taskState.$inferSelect>> {
  if (ids.length === 0) return new Map()
  return userScope((db, userId) => taskStatesIn(db, userId, ids))
}

export async function taskStatesIn(db: Conn, userId: string, ids: readonly string[]): Promise<Map<string, typeof taskState.$inferSelect>> {
  if (ids.length === 0) return new Map()
  const rows = await db
    .select()
    .from(taskState)
    .where(and(eq(taskState.userId, userId), inArray(taskState.unitId, [...ids])))
  return new Map(rows.map((r) => [r.unitId, r]))
}

export async function lastOutcomes(ids: readonly string[]): Promise<Map<string, boolean>> {
  if (ids.length === 0) return new Map()
  return userScope((db, userId) => lastOutcomesIn(db, userId, ids))
}

// The latest attempt's verdict per unit. Large pools (a whole course: thousands of ids) don't ship every id as a
// parameter: the latest attempt per unit the learner ever answered comes back (distinct on), filtered here.
export async function lastOutcomesIn(db: Conn, userId: string, ids: readonly string[]): Promise<Map<string, boolean>> {
  if (ids.length === 0) return new Map()
  return readOne(db, lastOutcomesRead(db, userId, ids))
}

export function lastOutcomesRead(db: Conn, userId: string, ids: readonly string[]): Read<Map<string, boolean>> {
  if (ids.length > 200) {
    const wanted = new Set(ids)
    return read(
      db
        .selectDistinctOn([attempts.unitId], { unitId: attempts.unitId, correct: attempts.correct })
        .from(attempts)
        .where(eq(attempts.userId, userId))
        .orderBy(attempts.unitId, desc(attempts.id)),
      (rows) => new Map(rows.filter((r) => wanted.has(r.unitId)).map((r) => [r.unitId, r.correct])),
    )
  }
  return read(
    db
      .select({ unitId: attempts.unitId, correct: attempts.correct, id: attempts.id })
      .from(attempts)
      .where(and(eq(attempts.userId, userId), inArray(attempts.unitId, ids.length > 0 ? [...ids] : [''])))
      .orderBy(attempts.id),
    (rows) => {
      const out = new Map<string, boolean>()
      for (const r of rows) out.set(r.unitId, r.correct)
      return out
    },
  )
}

export async function practiceQueue(
  snapshot: ContentSnapshot,
  f: StudyFilters,
  kind: 'quiz' | 'task',
  seed: number,
  scope: ReadonlySet<string> | null = null,
): Promise<{ ids: string[]; total: number; unseen: number; wrong: number }> {
  const candidates = matchUnits(snapshot, f, kind, scope)
  const last = await lastOutcomes(candidates.map((u) => u.id))
  const wrong = candidates.filter((u) => last.get(u.id) === false)
  const unseen = candidates.filter((u) => !last.has(u.id))
  const right = candidates.filter((u) => last.get(u.id) === true)
  const ordered = [...shuffle(wrong, seed), ...shuffle(unseen, seed + 1), ...shuffle(right, seed + 2)]
  return { ids: shuffle(ordered.slice(0, f.size), seed + 3).map((u) => u.id), total: candidates.length, unseen: unseen.length, wrong: wrong.length }
}
