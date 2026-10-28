import 'server-only'
import { sql, type SQL } from 'drizzle-orm'
import { getDb } from '@/db/client'

// The game economy for /admin/economy (docs/ADMIN.md): what was earned and spent per currency and reason, money in
// circulation, the richest learners, owned items, active boosts. System reads, one statement at a time.

type Row = Record<string, unknown>
const many = async (q: SQL): Promise<Row[]> => (await getDb().execute(q)) as unknown as Row[]
const num = (v: unknown): number => Number(v ?? 0)
const str = (v: unknown): string => (v === null || v === undefined ? '' : String(v))

export interface Flow {
  reason: string
  earned: number
  spent: number
  people: number
}

export interface Economy {
  days: number
  totals: { xp: number; bucks: number; gems: number; boosts: number; freezes: number; items: number }
  flows: { xp: Flow[]; bucks: Flow[]; gems: Flow[] }
  rich: Array<{ id: string; name: string; bucks: number; gems: number; xp: number }>
  items: Array<{ id: string; owners: number }>
}

const flows = (table: SQL, since: number): SQL => sql`select reason, coalesce(sum(amount) filter (where amount > 0), 0) as earned,
  coalesce(-sum(amount) filter (where amount < 0), 0) as spent, count(distinct user_id) as people
  from ${table} where created_at >= ${since} group by reason order by 2 desc, 3 desc limit 20`

const flowOf = (rows: Row[]): Flow[] => rows.map((r) => ({ reason: str(r.reason), earned: num(r.earned), spent: num(r.spent), people: num(r.people) }))

export async function economy(days: number, now = Date.now()): Promise<Economy> {
  const since = now - days * 86_400_000
  // cross-user: economy totals over every learner (system reads)
  const t = (await many(sql`select (select coalesce(sum(amount), 0) from xp_ledger) as xp, (select coalesce(sum(amount), 0) from buck_ledger) as bucks,
      (select coalesce(sum(amount), 0) from gem_ledger) as gems, (select count(*) from user_state where double_xp_until > ${now}) as boosts,
      (select coalesce(sum(streak_freezes), 0) from user_state) as freezes, (select count(*) from inventory) as items`))[0] ?? {}
  const xp = await many(flows(sql.raw('xp_ledger'), since))
  const bucks = await many(flows(sql.raw('buck_ledger'), since))
  const gems = await many(flows(sql.raw('gem_ledger'), since))
  const rich = await many(sql`select p.id, coalesce(p.display_name, 'без імені') as name,
      (select coalesce(sum(amount), 0) from buck_ledger b where b.user_id = p.id) as bucks,
      (select coalesce(sum(amount), 0) from gem_ledger g where g.user_id = p.id) as gems,
      (select coalesce(sum(amount), 0) from xp_ledger x where x.user_id = p.id) as xp
    from profiles p order by bucks desc limit 15`)
  const items = await many(sql`select item_id, count(*) as owners from inventory group by item_id order by 2 desc limit 20`)
  return {
    days,
    totals: { xp: num(t.xp), bucks: num(t.bucks), gems: num(t.gems), boosts: num(t.boosts), freezes: num(t.freezes), items: num(t.items) },
    flows: { xp: flowOf(xp), bucks: flowOf(bucks), gems: flowOf(gems) },
    rich: rich.map((r) => ({ id: str(r.id), name: str(r.name), bucks: num(r.bucks), gems: num(r.gems), xp: num(r.xp) })),
    items: items.map((r) => ({ id: str(r.item_id), owners: num(r.owners) })),
  }
}
