// Reminder worker (docs/EMAIL.md). Runs hourly from GitHub Actions (.github/workflows/reminders.yml): picks the learners whose reminder
// slot is now (Kyiv time), claims each email in email_log (exactly once, at most one a day) and sends via Resend.
//
//   pnpm reminders                         — the hourly run (needs DATABASE_URL, RESEND_API_KEY)
//   pnpm reminders --dry-run [--hour 19]   — who would get what, nothing sent or written
//   pnpm reminders --preview you@mail.com  — sends one sample of every reminder to that address (no DB writes)
//
// Env: DATABASE_URL (Supabase pooler), RESEND_API_KEY, SITE_URL (default https://playloo.app),
//      REMINDERS_FROM (default «Loo <hello@playloo.app>»), REMINDERS_HOUR (override the Kyiv hour, testing only).
import { randomBytes } from 'node:crypto'
import postgres from 'postgres'
import { dayKey } from '@/progress/day'
import { kyivHour, pickReminder, reminderEmail, type Reminder, type ReminderKind } from '@/email/reminders'

const args = process.argv.slice(2)
const flag = (name: string) => args.includes(name)
const opt = (name: string) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : undefined
}

const SITE = (process.env.SITE_URL ?? 'https://playloo.app').replace(/\/$/, '')
const FROM = process.env.REMINDERS_FROM ?? 'Loo <hello@playloo.app>'
const REPLY_TO = 'support@playloo.app'
const DRY = flag('--dry-run')
const PREVIEW = opt('--preview')
const BATCH = 100

interface Outgoing {
  userId: string
  email: string
  reminder: Reminder
  subject: string
  html: string
  text: string
  /** Page with a confirm button — the link in the email body. */
  unsubscribeUrl: string
  /** RFC 8058 one-click endpoint — the List-Unsubscribe header (mail clients POST to it). */
  oneClickUrl: string
}

async function resendBatch(items: Outgoing[]): Promise<Array<{ id?: string; error?: string }>> {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not set')
  const res = await fetch('https://api.resend.com/emails/batch', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(
      items.map((o) => ({
        from: FROM,
        to: [o.email],
        reply_to: REPLY_TO,
        subject: o.subject,
        html: o.html,
        text: o.text,
        headers: { 'List-Unsubscribe': `<${o.oneClickUrl}>, <mailto:${REPLY_TO}?subject=unsubscribe>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
        tags: [{ name: 'kind', value: o.reminder.kind }],
      })),
    ),
  })
  const body = (await res.json().catch(() => ({}))) as { data?: Array<{ id: string }>; message?: string }
  if (!res.ok) return items.map(() => ({ error: `${res.status} ${body.message ?? res.statusText}`.slice(0, 300) }))
  return items.map((_, i) => ({ id: body.data?.[i]?.id }))
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function preview(to: string): Promise<void> {
  const unsubscribeUrl = `${SITE}/unsubscribe?t=preview`
  const oneClickUrl = `${SITE}/api/email/unsubscribe?t=preview`
  const samples: Reminder[] = [
    { kind: 'streak', ref: 'preview', streak: 7, daysAway: 0 },
    { kind: 'mission', ref: 'preview', streak: 0, daysAway: 1 },
    { kind: 'comeback', ref: 'preview', streak: 0, daysAway: 2 },
    { kind: 'comeback', ref: 'preview', streak: 0, daysAway: 6 },
    { kind: 'comeback', ref: 'preview', streak: 0, daysAway: 29 },
  ]
  const items = samples.map((reminder) => ({ userId: 'preview', email: to, reminder, unsubscribeUrl, oneClickUrl, ...reminderEmail(reminder, { name: 'Ярослав', siteUrl: SITE, unsubscribeUrl }) }))
  const results = await resendBatch(items)
  results.forEach((r, i) => console.log(`${samples[i]!.kind}/${samples[i]!.daysAway}: ${r.error ?? `sent ${r.id}`}`))
}

async function run(): Promise<void> {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  const sql = postgres(url, { prepare: false, max: 2, idle_timeout: 5 })
  const now = Date.now()
  const today = dayKey(now)
  const hour = process.env.REMINDERS_HOUR ? Number(process.env.REMINDERS_HOUR) : opt('--hour') ? Number(opt('--hour')) : kyivHour(now)
  console.log(`[reminders] ${new Date(now).toISOString()} day=${today} kyivHour=${hour}${DRY ? ' (dry run)' : ''}`)
  try {
    // Everyone with a confirmed email who has not had a reminder today. Facts are aggregated per learner.
    const rows = await sql<
      Array<{ id: string; email: string; name: string | null; goal_days: string[] | null; frozen_days: string[] | null; last_day: string | null; pref: unknown }>
    >`
      select u.id, u.email, p.display_name as name,
        (select array_agg(d.day) from daily_activity d where d.user_id = u.id and d.goal_met) as goal_days,
        (select array_agg(f.day) from frozen_days f where f.user_id = u.id) as frozen_days,
        (select max(d.day) from daily_activity d where d.user_id = u.id and (d.xp > 0 or d.total > 0 or d.cards > 0 or d.tasks > 0)) as last_day,
        (select s.value from user_settings s where s.user_id = u.id and s.key = 'emailReminders') as pref
      from auth.users u
      join profiles p on p.id = u.id
      where u.email is not null and u.email_confirmed_at is not null and u.deleted_at is null
        and (u.banned_until is null or u.banned_until < now())
        and not exists (select 1 from email_log l where l.user_id = u.id and l.day = ${today} and l.status <> 'failed')`
    const due = rows.flatMap((r) => {
      const reminder = pickReminder({ goalDays: r.goal_days ?? [], frozenDays: r.frozen_days ?? [], lastActiveDay: r.last_day, remindersOn: r.pref !== false }, today, hour)
      return reminder ? [{ row: r, reminder }] : []
    })
    const counts = due.reduce<Record<string, number>>((acc, d) => ({ ...acc, [d.reminder.kind]: (acc[d.reminder.kind] ?? 0) + 1 }), {})
    console.log(`[reminders] candidates=${rows.length} due=${due.length}`, counts)
    if (DRY || due.length === 0) return

    // Unsubscribe tokens (created on first need).
    const ids = due.map((d) => d.row.id)
    await sql`insert into email_tokens ${sql(due.map((d) => ({ user_id: d.row.id, token: randomBytes(18).toString('base64url'), created_at: now })))} on conflict (user_id) do nothing`
    const tokens = new Map((await sql<Array<{ user_id: string; token: string }>>`select user_id, token from email_tokens where user_id in ${sql(ids)}`).map((t) => [t.user_id, t.token]))

    // Claim: only the rows this run inserts get sent (overlapping runs can't double-send).
    const claimed = await sql<Array<{ user_id: string; kind: ReminderKind }>>`
      insert into email_log ${sql(due.map((d) => ({ user_id: d.row.id, kind: d.reminder.kind, ref: d.reminder.ref, day: today, status: 'pending', created_at: now })))}
      on conflict do nothing returning user_id, kind`
    const mine = new Set(claimed.map((c) => `${c.user_id}:${c.kind}`))
    const outgoing: Outgoing[] = due
      .filter((d) => mine.has(`${d.row.id}:${d.reminder.kind}`))
      .map((d) => {
        const token = tokens.get(d.row.id)
        const unsubscribeUrl = `${SITE}/unsubscribe?t=${token}`
        const oneClickUrl = `${SITE}/api/email/unsubscribe?t=${token}`
        return { userId: d.row.id, email: d.row.email, reminder: d.reminder, unsubscribeUrl, oneClickUrl, ...reminderEmail(d.reminder, { name: d.row.name ?? '', siteUrl: SITE, unsubscribeUrl }) }
      })

    let sent = 0
    let failed = 0
    for (let i = 0; i < outgoing.length; i += BATCH) {
      const chunk = outgoing.slice(i, i + BATCH)
      const results = await resendBatch(chunk)
      for (const [j, r] of results.entries()) {
        const o = chunk[j]!
        if (r.error) failed++
        else sent++
        await sql`update email_log set status = ${r.error ? 'failed' : 'sent'}, provider_id = ${r.id ?? null}, error = ${r.error ?? null}
          where user_id = ${o.userId} and kind = ${o.reminder.kind} and ref = ${o.reminder.ref}`
      }
      await sleep(600) // Resend: a few requests per second on the free plan
    }
    console.log(`[reminders] sent=${sent} failed=${failed}`)
    if (failed > 0) process.exitCode = 1
  } finally {
    await sql.end()
  }
}

if (PREVIEW) await preview(PREVIEW)
else await run()
