import Database from 'better-sqlite3'
import { sql } from 'drizzle-orm'
import { openDb, type Conn } from '../src/db/client'
import * as schema from '../src/db/schema'
import { LEGACY_USER_ID } from '../src/lib/supabase/config'

// One-off migration of the old local progress (.data/study.db) into Postgres. Rows go to the legacy owner
// (LEGACY_USER_ID): the first verified sign-in of an ADMIN_EMAILS address claims them.
// Usage: pnpm db:import-sqlite [path]   — refuses to run if the target already has attempts.
const file = process.argv[2] ?? '.data/study.db'
const lite = new Database(file, { readonly: true })
const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL / DIRECT_URL не задано')
const { db, sql: client } = openDb(url)

type Row = Record<string, unknown>
const rows = (table: string): Row[] => lite.prepare(`select * from ${table}`).all() as Row[]
const json = (v: unknown) => (typeof v === 'string' ? JSON.parse(v) : v)
const bool = (v: unknown) => v === 1 || v === true

const existing = await db.select({ n: sql<number>`count(*)` }).from(schema.attempts)
if (Number(existing[0]?.n ?? 0) > 0 && !process.argv.includes('--force')) {
  console.error('У Postgres уже є спроби — імпорт скасовано (додай --force, щоб перезаписати)')
  process.exit(1)
}

async function insert<T extends Parameters<typeof db.insert>[0]>(conn: Conn, table: T, values: Row[], label: string) {
  for (let i = 0; i < values.length; i += 500) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await conn.insert(table).values(values.slice(i, i + 500) as any).onConflictDoNothing()
  }
  console.log(`  ${label}: ${values.length}`)
}

const userId = LEGACY_USER_ID
await db.transaction(async (tx) => {
  const now = Date.now()
  await tx.insert(schema.profiles).values({ id: userId, displayName: 'Legacy owner', createdAt: now, updatedAt: now }).onConflictDoNothing()
  const settingRows = rows('settings')
  const internal = (key: unknown) => typeof key === 'string' && (key.startsWith('internal.') || key === 'vaultPath')
  await insert(tx, schema.userSettings, settingRows.filter((r) => !internal(r.key)).map((r) => ({ userId, key: r.key, value: json(r.value) })), 'user_settings')
  await insert(tx, schema.systemState, settingRows.filter((r) => internal(r.key) && r.key !== 'internal.unitsFingerprint').map((r) => ({ key: r.key, value: json(r.value) })), 'system_state')
  await insert(tx, 
    schema.units,
    rows('units').map((r) => ({
      id: r.id, kind: r.kind, guideId: r.guide_id, chapterId: r.chapter_id, level: r.level, frequency: r.frequency, qtype: r.qtype,
      label: r.label, idSource: r.id_source, firstSeen: r.first_seen, lastSeen: r.last_seen, missingSince: r.missing_since,
    })),
    'units',
  )
  await insert(tx, schema.unitAliases, rows('unit_aliases').map((r) => ({ oldId: r.old_id, newId: r.new_id, reason: r.reason, createdAt: r.created_at })), 'unit_aliases')
  await insert(tx, 
    schema.sessions,
    rows('sessions').map((r) => ({
      userId,
      id: r.id, mode: r.mode, filters: json(r.filters), unitIds: json(r.unit_ids), startedAt: r.started_at, endedAt: r.ended_at,
      total: r.total, correct: r.correct, xp: r.xp,
    })),
    'sessions',
  )
  await insert(tx, 
    schema.attempts,
    rows('attempts').map((r) => ({
      userId,
      id: r.id, unitId: r.unit_id, sessionId: r.session_id, kind: r.kind, outcome: r.outcome, correct: bool(r.correct), level: r.level,
      guideId: r.guide_id, chapterId: r.chapter_id, hintsUsed: r.hints_used, durationMs: r.duration_ms, xp: r.xp, answeredAt: r.answered_at, day: r.day,
    })),
    'attempts',
  )
  await insert(tx, 
    schema.srsCards,
    rows('srs_cards').map((r) => ({
      userId,
      unitId: r.unit_id, due: r.due, stability: r.stability, difficulty: r.difficulty, elapsedDays: r.elapsed_days, scheduledDays: r.scheduled_days,
      learningSteps: r.learning_steps, reps: r.reps, lapses: r.lapses, state: r.state, lastReview: r.last_review,
    })),
    'srs_cards',
  )
  await insert(tx, 
    schema.mistakes,
    rows('mistakes').map((r) => ({
      userId,
      unitId: r.unit_id, source: r.source, wrongCount: r.wrong_count, correctStreak: r.correct_streak, lastCorrectAt: r.last_correct_at,
      firstWrongAt: r.first_wrong_at, lastWrongAt: r.last_wrong_at, resolvedAt: r.resolved_at,
    })),
    'mistakes',
  )
  await insert(tx, 
    schema.chapterProgress,
    rows('chapter_progress').map((r) => ({
      userId,
      chapterId: r.chapter_id, guideId: r.guide_id, status: r.status, scrollPct: r.scroll_pct, timeMs: r.time_ms, studiedAt: r.studied_at, lastOpenedAt: r.last_opened_at,
    })),
    'chapter_progress',
  )
  await insert(tx, 
    schema.taskState,
    rows('task_state').map((r) => ({ userId, unitId: r.unit_id, hintsRevealed: r.hints_revealed, draft: r.draft, status: r.status, updatedAt: r.updated_at })),
    'task_state',
  )
  await insert(tx, 
    schema.xpLedger,
    rows('xp_ledger').map((r) => ({ userId, id: r.id, amount: r.amount, reason: r.reason, refId: r.ref_id, createdAt: r.created_at, day: r.day })),
    'xp_ledger',
  )
  await insert(tx, schema.achievements, rows('achievements').map((r) => ({ userId, id: r.id, unlockedAt: r.unlocked_at, context: json(r.context) })), 'achievements')
  await insert(tx, 
    schema.dailyActivity,
    rows('daily_activity').map((r) => ({
      userId,
      day: r.day, cards: r.cards, quizzes: r.quizzes, tasks: r.tasks, correct: r.correct, total: r.total, xp: r.xp, timeMs: r.time_ms, goalMet: bool(r.goal_met),
    })),
    'daily_activity',
  )
  // Identity columns were inserted with explicit ids: move the sequences past them.
  await tx.execute(sql`select setval(pg_get_serial_sequence('attempts', 'id'), coalesce((select max(id) from attempts), 0) + 1, false)`)
  await tx.execute(sql`select setval(pg_get_serial_sequence('xp_ledger', 'id'), coalesce((select max(id) from xp_ledger), 0) + 1, false)`)
})
// Content fingerprint must be recomputed against the new DB.
await db.delete(schema.systemState).where(sql`${schema.systemState.key} = 'internal.unitsFingerprint'`)
console.log('✅ Імпорт завершено')
await client.end()
lite.close()
