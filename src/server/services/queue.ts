import 'server-only'
import { and, eq, gte, inArray, isNull, sql } from 'drizzle-orm'
import { first } from '@/db/client'
import { attempts, mistakes, srsCards, taskState } from '@/db/schema'
import { LEVELS, type LearningUnit, type Level, type UnitKind } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { dayKey } from '@/progress/day'
import { nextEligibleAt } from '@/progress/mistakes'
import type { SrsCard } from '@/progress/srs'
import { userScope } from '../auth'
import { readSettings } from '../settings'

export interface StudyFilters {
  guide: string | null
  chapter: string | null
  levels: Level[]
  frequencies: string[]
  types: string[]
  mode: 'due' | 'all'
  size: number
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
    if (unit.kind === 'task' && f.types.length && !f.types.includes(unit.difficulty)) continue
    out.push(unit)
  }
  return out.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))
}

export async function srsMap(ids: readonly string[]): Promise<Map<string, SrsCard>> {
  if (ids.length === 0) return new Map()
  const rows = await userScope(async (db, userId) => {
    const out: (typeof srsCards.$inferSelect)[] = []
    for (let i = 0; i < ids.length; i += 500) {
      out.push(
        ...(await db
          .select()
          .from(srsCards)
          .where(and(eq(srsCards.userId, userId), inArray(srsCards.unitId, ids.slice(i, i + 500))))),
      )
    }
    return out
  })
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
  const today = dayKey(now)
  const row = await userScope((db, userId) => {
    const firsts = db
      .select({ unitId: attempts.unitId, firstDay: sql<string>`min(${attempts.day})`.as('first_day') })
      .from(attempts)
      .where(and(eq(attempts.userId, userId), eq(attempts.kind, 'flashcard')))
      .groupBy(attempts.unitId)
      .as('firsts')
    return first(db.select({ n: sql<number>`count(*)` }).from(firsts).where(sql`${firsts.firstDay} = ${today}`))
  })
  return Number(row?.n ?? 0)
}

export interface FlashQueue {
  ids: string[]
  due: number
  fresh: number
  total: number
  newLeft: number
}

export async function flashcardQueue(snapshot: ContentSnapshot, f: StudyFilters, now = Date.now(), scope: ReadonlySet<string> | null = null): Promise<FlashQueue> {
  const candidates = matchUnits(snapshot, f, 'flashcard', scope)
  const cards = await srsMap(candidates.map((u) => u.id))
  const due = candidates.filter((u) => cards.has(u.id) && cards.get(u.id)!.due <= now).sort((a, b) => cards.get(a.id)!.due - cards.get(b.id)!.due)
  const unseen = candidates.filter((u) => !cards.has(u.id))
  const settings = await readSettings()
  const newLeft = Math.max(0, settings.newCardsPerDay - (await newIntroducedToday(now)))
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
  const out: MistakeRow[] = []
  for (const r of rows) {
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

export async function taskStates(ids: readonly string[]): Promise<Map<string, typeof taskState.$inferSelect>> {
  if (ids.length === 0) return new Map()
  const rows = await userScope((db, userId) =>
    db
      .select()
      .from(taskState)
      .where(and(eq(taskState.userId, userId), inArray(taskState.unitId, [...ids]))),
  )
  return new Map(rows.map((r) => [r.unitId, r]))
}

export async function lastOutcomes(ids: readonly string[]): Promise<Map<string, boolean>> {
  if (ids.length === 0) return new Map()
  const rows = await userScope((db, userId) =>
    db
      .select({ unitId: attempts.unitId, correct: attempts.correct, id: attempts.id })
      .from(attempts)
      .where(and(eq(attempts.userId, userId), inArray(attempts.unitId, [...ids])))
      .orderBy(attempts.id),
  )
  const out = new Map<string, boolean>()
  for (const r of rows) out.set(r.unitId, r.correct)
  return out
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
