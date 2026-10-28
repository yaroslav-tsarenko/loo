import type { Metadata } from 'next'
import Link from 'next/link'
import { economy, type Flow } from '@/server/admin/economy'
import { requireAdminArea } from '@/server/admin/guard'
import { fmt } from '@/ui/admin/text'

export const metadata: Metadata = { title: 'Економіка' }

// The game economy (docs/ADMIN.md): currency in circulation, earned / spent by reason, the richest learners, items.

const RANGES = [7, 30, 90] as const

function Flows({ title, rows }: { title: string; rows: Flow[] }) {
  return (
    <section className="adm-card">
      <h2 className="adm-h2">{title}</h2>
      {rows.length === 0 ? (
        <p className="adm-empty">Поки порожньо</p>
      ) : (
        <table className="adm-table">
          <thead>
            <tr>
              <th>Причина</th>
              <th className="num">Нараховано</th>
              <th className="num">Витрачено</th>
              <th className="num">Людей</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.reason}>
                <td className="adm-mono">{r.reason}</td>
                <td className="num adm-pos">{r.earned ? `+${fmt.format(r.earned)}` : '—'}</td>
                <td className="num adm-neg">{r.spent ? `−${fmt.format(r.spent)}` : '—'}</td>
                <td className="num">{fmt.format(r.people)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default async function EconomyPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdminArea()
  const asked = Number((await searchParams).days)
  const days = (RANGES as readonly number[]).includes(asked) ? asked : 30
  const e = await economy(days)
  const kpis: Array<[string, string]> = [
    ['XP усього', fmt.format(e.totals.xp)],
    ['Баксів в обігу', fmt.format(e.totals.bucks)],
    ['Кристалів в обігу', fmt.format(e.totals.gems)],
    ['Активних бустів XP', fmt.format(e.totals.boosts)],
    ['Заморозок у запасі', fmt.format(e.totals.freezes)],
    ['Куплених предметів', fmt.format(e.totals.items)],
  ]
  return (
    <main className="adm">
      <header className="adm-top">
        <div>
          <h1 className="adm-title">Економіка</h1>
          <p className="adm-lead">Звідки беруться й куди йдуть валюти · рухи за {days} днів</p>
        </div>
        <nav className="adm-ranges" aria-label="Період">
          {RANGES.map((d) => (
            <Link key={d} href={`/admin/economy?days=${d}`} className="adm-chip" aria-current={d === days ? 'page' : undefined}>
              {d} днів
            </Link>
          ))}
        </nav>
      </header>

      <section className="adm-kpis">
        {kpis.map(([label, value]) => (
          <div key={label} className="adm-kpi">
            <span className="adm-kpi-value tabular">{value}</span>
            <span className="adm-kpi-label">{label}</span>
          </div>
        ))}
      </section>

      <div className="adm-grid">
        <Flows title="Бакси" rows={e.flows.bucks} />
        <Flows title="Кристали" rows={e.flows.gems} />
        <Flows title="XP" rows={e.flows.xp} />
        <section className="adm-card">
          <h2 className="adm-h2">Популярні предмети</h2>
          {e.items.length === 0 ? (
            <p className="adm-empty">Ще ніхто нічого не купив</p>
          ) : (
            <table className="adm-table">
              <tbody>
                {e.items.map((i) => (
                  <tr key={i.id}>
                    <td className="adm-mono">{i.id}</td>
                    <td className="num">{fmt.format(i.owners)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      <section className="adm-card">
        <h2 className="adm-h2">Найбагатші</h2>
        <table className="adm-table">
          <thead>
            <tr>
              <th>Користувач</th>
              <th className="num">Бакси</th>
              <th className="num">Кристали</th>
              <th className="num">XP</th>
            </tr>
          </thead>
          <tbody>
            {e.rich.map((r) => (
              <tr key={r.id}>
                <td>
                  <Link href={`/admin/users/${r.id}`} className="adm-user-link">
                    {r.name}
                  </Link>
                </td>
                <td className="num">{fmt.format(r.bucks)}</td>
                <td className="num">{fmt.format(r.gems)}</td>
                <td className="num">{fmt.format(r.xp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}
