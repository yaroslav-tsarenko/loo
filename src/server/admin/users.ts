import 'server-only'
import { sql, type SQL } from 'drizzle-orm'
import { getDb } from '@/db/client'
import { rankOf, type RankDef } from '@/game'
import { rankInput } from '../game/ranks'

// Learners for the admin area (docs/ADMIN.md): list with search / sort / pages and one learner's full card. Read as
// the system; statements run one at a time (Supabase's transaction pooler can't take pipelined statements).

type Row = Record<string, unknown>
const db = () => getDb()
const many = async <T extends Row>(q: SQL): Promise<T[]> => (await db().execute(q)) as unknown as T[]
const num = (v: unknown): number => Number(v ?? 0)
const str = (v: unknown): string => (v === null || v === undefined ? '' : String(v))
const opt = (v: unknown): number | null => (v === null || v === undefined ? null : Number(v))

// Supabase keeps emails in auth.users; a local PGlite has no auth schema.
let authUsers: boolean | null = null
async function hasAuthUsers(): Promise<boolean> {
  if (authUsers === null) authUsers = Boolean((await many<{ ok: unknown }>(sql`select to_regclass('auth.users') is not null as ok`))[0]?.ok)
  return authUsers
}
const emailOf = async (alias: SQL): Promise<SQL> => ((await hasAuthUsers()) ? sql`(select u.email from auth.users u where u.id = ${alias})` : sql`null::text`)

export const USER_SORTS = { joined: 'Реєстрація', seen: 'Останній візит', xp: 'XP', bucks: 'Бакси', gems: 'Кристали' } as const
export type UserSort = keyof typeof USER_SORTS
export const PAGE_SIZE = 50

export interface UserRow {
  id: string
  name: string
  email: string
  role: string
  joined: number
  lastSeen: number | null
  xp: number
  bucks: number
  gems: number
  banned: boolean
}

export async function listUsers(opts: { q: string; sort: UserSort; page: number }): Promise<{ rows: UserRow[]; total: number }> {
  const email = await emailOf(sql.raw('p.id'))
  const like = `%${opts.q.trim().toLowerCase()}%`
  const where = opts.q.trim() ? sql`where lower(coalesce(p.display_name, '')) like ${like} or lower(coalesce(${email}, '')) like ${like} or p.id::text = ${opts.q.trim()}` : sql``
  const order = { joined: sql`p.created_at desc`, seen: sql`last_seen desc nulls last`, xp: sql`xp desc`, bucks: sql`bucks desc`, gems: sql`gems desc` }[opts.sort]
  const offset = Math.max(0, opts.page - 1) * PAGE_SIZE
  // cross-user: admin list of learners with their balances (system read)
  const rows = await many(sql`select p.id, p.display_name as name, ${email} as email, p.role, p.created_at as joined, p.banned_at,
      (select max(e.at) from analytics_events e where e.user_id = p.id) as last_seen,
      (select coalesce(sum(x.amount), 0) from xp_ledger x where x.user_id = p.id) as xp,
      (select coalesce(sum(b.amount), 0) from buck_ledger b where b.user_id = p.id) as bucks,
      (select coalesce(sum(g.amount), 0) from gem_ledger g where g.user_id = p.id) as gems
    from profiles p ${where} order by ${order} limit ${PAGE_SIZE} offset ${offset}`)
  const total = num((await many(sql`select count(*) as n from profiles p ${where}`))[0]?.n)
  return {
    total,
    rows: rows.map((r) => ({ id: str(r.id), name: str(r.name) || 'без імені', email: str(r.email), role: str(r.role), joined: num(r.joined), lastSeen: opt(r.last_seen), xp: num(r.xp), bucks: num(r.bucks), gems: num(r.gems), banned: r.banned_at !== null && r.banned_at !== undefined })),
  }
}

export interface LedgerEntry {
  kind: 'xp' | 'bucks' | 'gems'
  amount: number
  reason: string
  at: number
}

export interface UserCard {
  id: string
  name: string
  email: string
  role: string
  joined: number
  lastSeen: number | null
  bannedAt: number | null
  banReason: string
  balances: { xp: number; bucks: number; gems: number }
  state: { hearts: number; freezes: number; boostUntil: number | null; boostActive: boolean; evoStep: number }
  rank: RankDef
  enrollments: Array<{ course: string; level: string; active: boolean; enrolledAt: number }>
  items: Array<{ id: string; at: number }>
  ledger: LedgerEntry[]
  events: Array<{ at: number; type: string; path: string; label: string; place: string; ip: string; device: string }>
  audit: Array<{ at: number; actor: string; action: string; payload: Record<string, unknown> }>
  stats: { views: number; sessions: number; attempts: number; lessons: number }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function userCard(id: string): Promise<UserCard | null> {
  if (!UUID.test(id)) return null
  const email = await emailOf(sql`${id}::uuid`)
  // cross-user: admin card of one learner (system reads, one statement each)
  const profile = (await many(sql`select display_name, role, created_at, banned_at, ban_reason, ${email} as email from profiles where id = ${id}`))[0]
  if (!profile) return null
  const bal = (await many(sql`select
      (select coalesce(sum(amount), 0) from xp_ledger where user_id = ${id}) as xp,
      (select coalesce(sum(amount), 0) from buck_ledger where user_id = ${id}) as bucks,
      (select coalesce(sum(amount), 0) from gem_ledger where user_id = ${id}) as gems,
      (select max(at) from analytics_events where user_id = ${id}) as last_seen,
      (select count(*) filter (where type = 'pageview') from analytics_events where user_id = ${id}) as views,
      (select count(distinct session_id) from analytics_events where user_id = ${id}) as sessions,
      (select count(*) from attempts where user_id = ${id}) as attempts,
      (select count(*) from lesson_progress where user_id = ${id} and completions > 0) as lessons`))[0] ?? {}
  const state = (await many(sql`select hearts, streak_freezes, double_xp_until, evo_step from user_state where user_id = ${id}`))[0]
  const enrollments = await many(sql`select course_id, level, active, enrolled_at from enrollments where user_id = ${id} order by enrolled_at`)
  const items = await many(sql`select item_id, acquired_at from inventory where user_id = ${id} order by acquired_at desc`)
  const ledger = await many(sql`(select 'xp' as kind, amount, reason, created_at as at from xp_ledger where user_id = ${id} order by created_at desc limit 15)
    union all (select 'bucks', amount, reason, created_at from buck_ledger where user_id = ${id} order by created_at desc limit 15)
    union all (select 'gems', amount, reason, created_at from gem_ledger where user_id = ${id} order by created_at desc limit 15)
    order by at desc limit 30`)
  const events = await many(sql`select at, type, path, coalesce(target->>'label', '') as label, concat_ws(', ', city, country) as place, coalesce(ip, '') as ip,
      concat_ws(' · ', device, browser, os) as device from analytics_events where user_id = ${id} order by at desc limit 30`)
  const audit = await many(sql`select at, actor, action, payload from admin_audit where target_user_id = ${id} order by at desc limit 30`)
  const rank = rankOf(await rankInput(db(), id))
  return {
    id,
    name: str(profile.display_name) || 'без імені',
    email: str(profile.email),
    role: str(profile.role),
    joined: num(profile.created_at),
    lastSeen: opt(bal.last_seen),
    bannedAt: opt(profile.banned_at),
    banReason: str(profile.ban_reason),
    balances: { xp: num(bal.xp), bucks: num(bal.bucks), gems: num(bal.gems) },
    state: { hearts: state ? num(state.hearts) : 5, freezes: state ? num(state.streak_freezes) : 0, boostUntil: state ? opt(state.double_xp_until) : null, boostActive: Boolean(state && num(state.double_xp_until) > Date.now()), evoStep: state ? num(state.evo_step) : 0 },
    rank,
    enrollments: enrollments.map((e) => ({ course: str(e.course_id), level: str(e.level), active: Boolean(e.active), enrolledAt: num(e.enrolled_at) })),
    items: items.map((i) => ({ id: str(i.item_id), at: num(i.acquired_at) })),
    ledger: ledger.map((l) => ({ kind: str(l.kind) as LedgerEntry['kind'], amount: num(l.amount), reason: str(l.reason), at: num(l.at) })),
    events: events.map((e) => ({ at: num(e.at), type: str(e.type), path: str(e.path), label: str(e.label), place: str(e.place), ip: str(e.ip), device: str(e.device) })),
    audit: audit.map((a) => ({ at: num(a.at), actor: str(a.actor), action: str(a.action), payload: (a.payload ?? {}) as Record<string, unknown> })),
    stats: { views: num(bal.views), sessions: num(bal.sessions), attempts: num(bal.attempts), lessons: num(bal.lessons) },
  }
}

export interface AuditRow {
  at: number
  actor: string
  action: string
  targetId: string | null
  targetName: string
  payload: Record<string, unknown>
}

export async function auditLog(limit = 200): Promise<AuditRow[]> {
  // cross-user: the admin audit log (system read)
  const rows = await many(sql`select a.at, a.actor, a.action, a.target_user_id, coalesce(p.display_name, '') as name, a.payload
    from admin_audit a left join profiles p on p.id = a.target_user_id order by a.at desc limit ${limit}`)
  return rows.map((r) => ({ at: num(r.at), actor: str(r.actor), action: str(r.action), targetId: r.target_user_id ? str(r.target_user_id) : null, targetName: str(r.name), payload: (r.payload ?? {}) as Record<string, unknown> }))
}

export async function tableSizes(): Promise<Array<{ table: string; rows: number }>> {
  const rows = await many(sql`select relname as table, n_live_tup as rows from pg_stat_user_tables where schemaname = 'public' order by n_live_tup desc limit 20`)
  return rows.map((r) => ({ table: str(r.table), rows: num(r.rows) }))
}
