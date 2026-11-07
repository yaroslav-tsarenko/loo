import { sql } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { startTestDb, type TestDb } from './harness'

vi.mock('server-only', () => ({}))

// The daily cleanup (src/server/maintenance/retention.ts) on the real schema: what it removes, and what it must keep.
const U = '33333333-3333-4333-8333-333333333333'
const DAY = 86_400_000
const NOW = Date.UTC(2026, 10, 7, 3, 15)
let db: TestDb

beforeAll(async () => {
  db = await startTestDb(54392)
  Object.assign(process.env, { DATABASE_URL: db.url, DATABASE_POOL_MAX: '1', DATABASE_PIPELINE: '0', ANALYTICS_IP_SALT: 'test-salt' })
  await db.pg.exec(`
    insert into auth.users values ('${U}');
    insert into profiles (id, created_at, updated_at) values ('${U}', 0, 0);
    insert into analytics_events (at, day, type, path, visitor_id, session_id, ip, device, browser, os) values
      (${NOW - 400 * DAY}, '2025-10-03', 'pageview', '/old', 'v', 's', '91.200.12.34', 'desktop', 'Chrome', 'macOS'),
      (${NOW - 10 * DAY}, '2026-10-28', 'pageview', '/new', 'v', 's', '91.200.12.99', 'desktop', 'Chrome', 'macOS');
    insert into email_log (user_id, kind, ref, day, status, created_at) values
      ('${U}', 'comeback', '2026-01-01+45', '2026-02-15', 'sent', 0),
      ('${U}', 'streak', '2026-11-06', '2026-11-06', 'sent', 0);
    insert into sessions (id, user_id, mode, filters, unit_ids, started_at, ended_at, total, correct) values
      ('old', '${U}', 'quiz', '{"a":1}', '["u1","u2"]', ${NOW - 200 * DAY}, ${NOW - 200 * DAY}, 10, 10),
      ('recent', '${U}', 'quiz', '{"a":1}', '["u1"]', ${NOW - 5 * DAY}, ${NOW - 5 * DAY}, 1, 1),
      ('open', '${U}', 'lesson', '{}', '["u1"]', ${NOW - 300 * DAY}, null, 0, 0);
    insert into rate_limits (key, count, reset_at) values ('old', 1, ${NOW - 2 * DAY}), ('live', 1, ${NOW + 60_000});
  `)
}, 120_000)

afterAll(async () => {
  await db?.close()
})

describe('data retention', () => {
  it('removes what is expired, hashes raw IPs, keeps everything progress depends on', async () => {
    const { runRetention } = await import('@/server/maintenance/retention')
    const report = await runRetention(NOW)
    expect(report).toMatchObject({ analyticsDeleted: 1, ipsHashed: 1, emailLogDeleted: 1, sessionsCompacted: 1, rateLimitsDeleted: 1 })

    const { getDb } = await import('@/db/client')
    const q = async <T,>(text: ReturnType<typeof sql>) => (await getDb().execute(text)) as unknown as T[]
    const events = await q<{ path: string; ip: string }>(sql`select path, ip from analytics_events`)
    expect(events.map((e) => e.path)).toEqual(['/new'])
    expect(events[0]!.ip).toMatch(/^h:/)
    expect((await q<{ ref: string }>(sql`select ref from email_log`)).map((r) => r.ref)).toEqual(['2026-11-06'])
    const sessions = await q<{ id: string; unit_ids: string[]; total: number }>(sql`select id, unit_ids, total from sessions order by id`)
    // the old session stays (its counts feed achievements), only its exercise list is dropped
    expect(sessions).toEqual([
      { id: 'old', unit_ids: [], total: 10 },
      { id: 'open', unit_ids: ['u1'], total: 0 },
      { id: 'recent', unit_ids: ['u1'], total: 1 },
    ])
    expect((await q<{ key: string }>(sql`select key from rate_limits`)).map((r) => r.key)).toEqual(['live'])

    // idempotent
    expect(await runRetention(NOW)).toEqual({ analyticsDeleted: 0, ipsHashed: 0, emailLogDeleted: 0, sessionsCompacted: 0, rateLimitsDeleted: 0 })
  }, 60_000)
})
