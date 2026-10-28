import type { Metadata } from 'next'
import Link from 'next/link'
import { adminStats, type Count } from '@/server/admin/stats'
import { requireAdminArea } from '@/server/admin/guard'

export const metadata: Metadata = { title: 'Адмінка', robots: { index: false, follow: false } }

// Loo admin MVP (docs/ANALYTICS.md): site statistics from the first-party analytics — visitors, page views, blog,
// sources, geography, devices, clicks, the latest events with IP, and the newest accounts.

const RANGES = [1, 7, 30, 90] as const

const fmt = new Intl.NumberFormat('uk-UA')
const when = new Intl.DateTimeFormat('uk-UA', { timeZone: 'Europe/Kyiv', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
const date = new Intl.DateTimeFormat('uk-UA', { timeZone: 'Europe/Kyiv', day: '2-digit', month: '2-digit', year: 'numeric' })

const TYPE: Record<string, string> = { pageview: 'перегляд', click: 'клік', leave: 'вихід' }

function Table({ title, rows, empty = 'Поки порожньо' }: { title: string; rows: Count[]; empty?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.visitors))
  return (
    <section className="adm-card">
      <h2 className="adm-h2">{title}</h2>
      {rows.length === 0 ? (
        <p className="adm-empty">{empty}</p>
      ) : (
        <table className="adm-table">
          <thead>
            <tr>
              <th />
              <th className="num">Відвідувачі</th>
              <th className="num">Події</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.key}|${r.sub ?? ''}`}>
                <td>
                  <span className="adm-bar" style={{ width: `${(r.visitors / max) * 100}%` }} aria-hidden="true" />
                  <span className="adm-key">
                    {r.key}
                    {r.sub ? <small> · {r.sub}</small> : null}
                  </span>
                </td>
                <td className="num">{fmt.format(r.visitors)}</td>
                <td className="num">{fmt.format(r.views)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const via = await requireAdminArea()
  const params = await searchParams
  const asked = Number(params.days)
  const days = (RANGES as readonly number[]).includes(asked) ? asked : 7
  const s = await adminStats(days)
  const peak = Math.max(1, ...s.daily.map((d) => d.views))
  const kpis: Array<[string, string]> = [
    ['Унікальні відвідувачі', fmt.format(s.kpi.visitors)],
    ['Сесії', fmt.format(s.kpi.sessions)],
    ['Перегляди сторінок', fmt.format(s.kpi.views)],
    ['Кліки', fmt.format(s.kpi.clicks)],
    ['Час на сторінці (сер.)', `${s.kpi.avgSeconds} с`],
    ['Увійшли в акаунт', fmt.format(s.kpi.signedIn)],
    ['Акаунтів усього', fmt.format(s.kpi.users)],
    ['Нових акаунтів', fmt.format(s.kpi.newUsers)],
  ]
  return (
    <main className="adm">
      <header className="adm-top">
        <div>
          <h1 className="adm-title">Loo · адмінка</h1>
          <p className="adm-lead">
            Статистика сайту за {days === 1 ? 'добу' : `${days} днів`} · вхід: {via === 'login' ? 'адмін-логін' : 'акаунт з роллю admin'} · {s.ms} мс
          </p>
        </div>
        <nav className="adm-ranges" aria-label="Період">
          {RANGES.map((d) => (
            <Link key={d} href={`/admin?days=${d}`} className="adm-chip" aria-current={d === days ? 'page' : undefined}>
              {d === 1 ? '24 год' : `${d} днів`}
            </Link>
          ))}
          {via === 'login' ? (
            <form action="/admin/sign-out" method="post">
              <button type="submit" className="adm-chip">
                Вийти
              </button>
            </form>
          ) : null}
        </nav>
      </header>

      {s.issues.length > 0 ? (
        <p className="adm-issues" role="alert">
          Не завантажилось: {s.issues.join(', ')} — спробуй оновити сторінку.
        </p>
      ) : null}

      <section className="adm-kpis">
        {kpis.map(([label, value]) => (
          <div key={label} className="adm-kpi">
            <span className="adm-kpi-value tabular">{value}</span>
            <span className="adm-kpi-label">{label}</span>
          </div>
        ))}
      </section>

      <section className="adm-card">
        <h2 className="adm-h2">Перегляди й відвідувачі по днях</h2>
        {s.daily.length === 0 ? (
          <p className="adm-empty">Ще немає даних — збір почався з цього деплою.</p>
        ) : (
          <div className="adm-chart" role="img" aria-label="Перегляди по днях">
            {s.daily.map((d) => (
              <div key={d.day} className="adm-col" title={`${d.day}: ${d.views} переглядів, ${d.visitors} відвідувачів`}>
                <span className="adm-col-bar" style={{ height: `${(d.views / peak) * 100}%` }} />
                <span className="adm-col-label">{d.day.slice(5)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="adm-grid">
        <Table title="Сторінки" rows={s.pages} />
        <Table title="Блог" rows={s.blog} empty="Статті блогу ще не переглядали" />
        <Table title="Звідки приходять" rows={s.referrers} empty="Лише прямі заходи" />
        <Table title="Країни" rows={s.countries} />
        <Table title="Міста" rows={s.cities} />
        <Table title="Пристрої" rows={s.devices} />
        <Table title="Браузери" rows={s.browsers} />
        <Table title="Системи" rows={s.systems} />
      </div>

      <section className="adm-card">
        <h2 className="adm-h2">Куди клікають</h2>
        {s.clicks.length === 0 ? (
          <p className="adm-empty">Поки порожньо</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Елемент</th>
                <th>Посилання</th>
                <th>Сторінка</th>
                <th className="num">Кліки</th>
              </tr>
            </thead>
            <tbody>
              {s.clicks.map((c) => (
                <tr key={`${c.label}|${c.href}|${c.page}`}>
                  <td>{c.label || '—'}</td>
                  <td className="adm-mono">{c.href || '—'}</td>
                  <td className="adm-mono">{c.page}</td>
                  <td className="num">{fmt.format(c.clicks)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="adm-card">
        <h2 className="adm-h2">Останні події</h2>
        <div className="adm-scroll">
          <table className="adm-table adm-recent">
            <thead>
              <tr>
                <th>Час</th>
                <th>Подія</th>
                <th>Сторінка / елемент</th>
                <th>Хто</th>
                <th>Де</th>
                <th>IP</th>
                <th>Пристрій</th>
              </tr>
            </thead>
            <tbody>
              {s.recent.map((e, i) => (
                <tr key={`${e.at}-${i}`}>
                  <td className="tabular">{when.format(e.at)}</td>
                  <td>
                    {TYPE[e.type] ?? e.type}
                    {e.durationMs !== null ? <small> · {Math.round(e.durationMs / 1000)} с</small> : null}
                  </td>
                  <td className="adm-mono">
                    {e.path}
                    {e.label ? <small> → {e.label}</small> : null}
                  </td>
                  <td>{e.user || <span className="adm-muted">гість {e.visitor}</span>}</td>
                  <td>{[e.city, e.country].filter(Boolean).join(', ') || '—'}</td>
                  <td className="adm-mono">{e.ip || '—'}</td>
                  <td>{[e.device, e.browser, e.os].filter(Boolean).join(' · ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="adm-card">
        <h2 className="adm-h2">Нові акаунти</h2>
        <table className="adm-table">
          <thead>
            <tr>
              <th>Імʼя</th>
              <th>Реєстрація</th>
              <th>Останній візит</th>
              <th className="num">Перегляди</th>
            </tr>
          </thead>
          <tbody>
            {s.people.map((p, i) => (
              <tr key={`${p.joined}-${i}`}>
                <td>
                  {p.name}
                  {p.role === 'admin' ? <small> · admin</small> : null}
                </td>
                <td className="tabular">{date.format(p.joined)}</td>
                <td className="tabular">{p.lastSeen ? when.format(p.lastSeen) : '—'}</td>
                <td className="num">{fmt.format(p.views)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}
