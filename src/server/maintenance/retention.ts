import 'server-only'
import { sql } from 'drizzle-orm'
import { getDb } from '@/db/client'
import { kyivDay } from '@/server/analytics/collect'
import { anonymizeIp, IP_TOKEN_PREFIX } from '@/server/analytics/ip'

// Daily housekeeping (/api/cron/cleanup, vercel.json). Every step is bounded (batches), idempotent and safe to
// re-run; what it removes can't affect a learner's progress, rewards or statistics:
//   * analytics_events older than ANALYTICS_RETENTION_DAYS (default 395: a year of year-over-year charts + a month)
//   * raw IPs from before hashing → network tokens (src/server/analytics/ip.ts)
//   * email_log older than 120 days — a reminder's ref is a date and is only due on that day; the longest gap is 45
//     days (src/email/reminders.ts), so older rows can never block or allow a send again
//   * study sessions ended more than 180 days ago keep their row (counts, totals, achievements read them) but drop
//     the per-session exercise list (unit_ids, filters) — the bulk of their size
//   * rate-limit windows expired more than a day ago

const DAY = 86_400_000
const BATCH = 5_000

export interface RetentionReport {
  analyticsDeleted: number
  ipsHashed: number
  emailLogDeleted: number
  sessionsCompacted: number
  rateLimitsDeleted: number
}

export function retentionDays(env: Record<string, string | undefined> = process.env): number {
  const n = Number(env.ANALYTICS_RETENTION_DAYS)
  return Number.isFinite(n) && n >= 30 ? Math.floor(n) : 395
}

const count = (rows: unknown) => (Array.isArray(rows) ? rows.length : Number((rows as { count?: number }).count ?? 0))

export async function runRetention(now: number, opts: { maxBatches?: number } = {}): Promise<RetentionReport> {
  // cross-user: system maintenance over every learner's rows (no learner-visible effect)
  const db = getDb()
  const maxBatches = opts.maxBatches ?? 20
  const report: RetentionReport = { analyticsDeleted: 0, ipsHashed: 0, emailLogDeleted: 0, sessionsCompacted: 0, rateLimitsDeleted: 0 }

  const analyticsBefore = now - retentionDays() * DAY
  for (let i = 0; i < maxBatches; i++) {
    const n = count(await db.execute(sql`delete from analytics_events where id in (select id from analytics_events where at < ${analyticsBefore} limit ${BATCH}) returning id`))
    report.analyticsDeleted += n
    if (n < BATCH) break
  }

  for (let i = 0; i < maxBatches; i++) {
    const rows = (await db.execute(sql`select distinct ip from analytics_events where ip is not null and ip not like ${IP_TOKEN_PREFIX + '%'} limit 500`)) as unknown as Array<{ ip: string }>
    if (rows.length === 0) break
    for (const { ip } of rows) {
      const n = count(await db.execute(sql`update analytics_events set ip = ${anonymizeIp(ip)} where ip = ${ip} returning id`))
      report.ipsHashed += n
    }
  }

  const emailBefore = kyivDay(now - 120 * DAY)
  report.emailLogDeleted = count(await db.execute(sql`delete from email_log where day < ${emailBefore} returning user_id`))

  const sessionsBefore = now - 180 * DAY
  for (let i = 0; i < maxBatches; i++) {
    const n = count(
      await db.execute(sql`update sessions set unit_ids = '[]'::jsonb, filters = '{}'::jsonb
        where id in (select id from sessions where ended_at is not null and ended_at < ${sessionsBefore} and unit_ids <> '[]'::jsonb limit ${BATCH})
        returning id`),
    )
    report.sessionsCompacted += n
    if (n < BATCH) break
  }

  report.rateLimitsDeleted = count(await db.execute(sql`delete from rate_limits where reset_at < ${now - DAY} returning key`))
  return report
}
