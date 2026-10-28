import type { Metadata } from 'next'
import Link from 'next/link'
import { PiArrowLeftBold, PiArrowRightBold } from 'react-icons/pi'
import { loadAnalytics } from '@/server/admin/analytics'
import { hrefOf, parseQuery, type Dim, type SearchParams } from '@/server/admin/analytics-query'
import { requireAdminArea } from '@/server/admin/guard'
import { BreakdownCard, BreakdownList } from '@/ui/admin/BreakdownList'
import { ChartPanel } from '@/ui/admin/ChartPanel'
import { FilterChips } from '@/ui/admin/FilterChips'
import { fmtDuration, fmtNumber, fmtTime } from '@/ui/admin/format'
import { PeriodPicker } from '@/ui/admin/PeriodPicker'
import { chipsOf, metricsOf, pickerOf, rowsOf, valueLabel } from '@/ui/admin/view'

export const metadata: Metadata = { title: 'Аналітика' }

// Detailed site analytics (docs/ANALYTICS.md): period + filters from the URL, KPI tabs over the main chart (vs the
// previous period), breakdowns whose rows add filters, clicks and the raw event log with IP and place.

const BASE = '/admin/analytics'
const TYPE: Record<string, string> = { pageview: 'перегляд', click: 'клік', leave: 'вихід' }

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdminArea()
  const q = parseQuery(await searchParams)
  const d = await loadAnalytics(q, 'full')
  const p = d.period
  const { chips, clearHref } = chipsOf(q, BASE)
  const visitors = d.cur.visitors
  const common = { total: visitors, q, base: BASE }
  const list = (dim: Dim, extra: { dropEmpty?: boolean; mono?: boolean } = {}) => rowsOf(d.dims[dim], { ...common, key: dim, ...extra })
  const picker = pickerOf(q, d, true)

  return (
    <main className="adm ana" id="ana-root">
      <header className="ana-head">
        <div className="ana-head-text">
          <h1 className="ana-title">Аналітика</h1>
          <p className="ana-lead">
            {p.label} · {p.gran === 'hour' ? 'по годинах' : 'по днях'} · час київський
            <span className="ana-live" title="Відвідувачі з подією за останні 5 хвилин">
              <i aria-hidden="true" />
              {fmtNumber(d.online)} онлайн
            </span>
          </p>
        </div>
        <PeriodPicker key={`${q.range}|${picker.fromDay}|${picker.toDay}`} {...picker} />
      </header>

      <FilterChips chips={chips} clearHref={clearHref} />

      {d.issues.length > 0 ? (
        <p className="adm-issues" role="alert">
          Не завантажилось: {d.issues.join(', ')} — спробуй оновити сторінку.
        </p>
      ) : null}

      <ChartPanel metrics={metricsOf(d)} buckets={d.series.buckets} prevBuckets={d.prevSeries?.buckets ?? null} gran={p.gran} initial={q.metric} />

      <div className="ana-grid">
        <BreakdownCard title="Сторінки">
          <BreakdownList rows={rowsOf(d.pages, { ...common, key: 'path', mono: true })} />
        </BreakdownCard>
        <BreakdownCard title="Блог">
          <BreakdownList rows={rowsOf(d.blog, { ...common, key: 'path', mono: true })} empty="Статті блогу за цей період не переглядали" />
        </BreakdownCard>
        <BreakdownCard title="Джерела">
          <BreakdownList rows={list('ref', { dropEmpty: true })} empty="Лише прямі заходи" />
        </BreakdownCard>
        <BreakdownCard
          title="Вхід і вихід"
          tabs={[
            { id: 'entry', label: 'Вхід', content: <BreakdownList rows={rowsOf(d.entry, { ...common, total: d.cur.sessions, key: 'path', value: 'views', mono: true })} valueLabel="Сесії" /> },
            { id: 'exit', label: 'Вихід', content: <BreakdownList rows={rowsOf(d.exit, { ...common, total: d.cur.sessions, key: 'path', value: 'views', mono: true })} valueLabel="Сесії" /> },
          ]}
        />
        <BreakdownCard
          title="UTM"
          tabs={[
            { id: 'source', label: 'Source', content: <BreakdownList rows={list('utm_source', { dropEmpty: true })} empty="Без UTM-міток" /> },
            { id: 'medium', label: 'Medium', content: <BreakdownList rows={list('utm_medium', { dropEmpty: true })} empty="Без UTM-міток" /> },
            { id: 'campaign', label: 'Campaign', content: <BreakdownList rows={list('utm_campaign', { dropEmpty: true })} empty="Без UTM-міток" /> },
          ]}
        />
        <BreakdownCard title="Країни">
          <BreakdownList rows={list('country')} />
        </BreakdownCard>
        <BreakdownCard title="Міста">
          <BreakdownList rows={list('city', { dropEmpty: true })} empty="Місто невідоме" />
        </BreakdownCard>
        <BreakdownCard title="Пристрої">
          <BreakdownList rows={list('device')} />
        </BreakdownCard>
        <BreakdownCard title="Браузери">
          <BreakdownList rows={list('browser')} />
        </BreakdownCard>
        <BreakdownCard title="ОС">
          <BreakdownList rows={list('os')} />
        </BreakdownCard>
        <BreakdownCard title="Мови">
          <BreakdownList rows={list('lang')} />
        </BreakdownCard>
        <BreakdownCard title="Екрани">
          <BreakdownList rows={list('screen', { mono: true })} />
        </BreakdownCard>
        <BreakdownCard title="Акаунт">
          <BreakdownList rows={list('auth')} />
        </BreakdownCard>
      </div>

      <section className="ana-card">
        <h2 className="ana-h2">Кліки</h2>
        {d.clicks.length === 0 ? (
          <p className="ana-empty">Кліків за цей період немає</p>
        ) : (
          <div className="ana-scroll">
            <table className="ana-table">
              <thead>
                <tr>
                  <th scope="col">Елемент</th>
                  <th scope="col">Посилання</th>
                  <th scope="col">Сторінка</th>
                  <th scope="col" className="num">
                    Відвідувачі
                  </th>
                  <th scope="col" className="num">
                    Кліки
                  </th>
                </tr>
              </thead>
              <tbody>
                {d.clicks.map((c) => (
                  <tr key={`${c.label}|${c.href}|${c.page}`}>
                    <td>{c.label || <span className="ana-muted">без тексту</span>}</td>
                    <td className="ana-mono">{c.href || '—'}</td>
                    <td className="ana-mono">
                      <Link href={hrefOf(BASE, q, { path: c.page })} scroll={false} className="ana-link">
                        {c.page}
                      </Link>
                    </td>
                    <td className="num">{fmtNumber(c.visitors)}</td>
                    <td className="num">{fmtNumber(c.clicks)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="ana-card" id="events">
        <div className="ana-card-head">
          <h2 className="ana-h2">Події</h2>
          <span className="ana-muted">{q.before ? 'старіші' : 'найновіші'} 200 · час київський</span>
        </div>
        {d.events.length === 0 ? (
          <p className="ana-empty">Подій немає</p>
        ) : (
          <div className="ana-scroll">
            <table className="ana-table ana-events">
              <thead>
                <tr>
                  <th scope="col">Час</th>
                  <th scope="col">Подія</th>
                  <th scope="col">Сторінка / елемент</th>
                  <th scope="col">Хто</th>
                  <th scope="col">Де</th>
                  <th scope="col">IP</th>
                  <th scope="col">Пристрій</th>
                </tr>
              </thead>
              <tbody>
                {d.events.map((e) => (
                  <tr key={e.id}>
                    <td className="tabular">{fmtTime(e.at)}</td>
                    <td>
                      <span className="ana-type" data-type={e.type}>
                        {TYPE[e.type] ?? e.type}
                      </span>
                      {e.durationMs !== null ? <small> · {fmtDuration(e.durationMs / 1000)}</small> : null}
                    </td>
                    <td className="ana-mono ana-wrap">
                      {e.path}
                      {e.label ? <small> → {e.label}</small> : null}
                    </td>
                    <td>{e.signedIn ? e.name || 'учень' : <span className="ana-muted">гість {e.visitor}</span>}</td>
                    <td>{[e.city, e.country ? valueLabel('country', e.country) : ''].filter(Boolean).join(', ') || '—'}</td>
                    <td className="ana-mono">{e.ip || '—'}</td>
                    <td>{[e.device ? valueLabel('device', e.device) : '', e.browser, e.os].filter(Boolean).join(' · ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {q.before || d.nextBefore ? (
          <nav className="ana-pager" aria-label="Сторінки подій">
            {q.before ? (
              <Link href={`${hrefOf(BASE, q)}#events`} className="ana-pager-link" scroll={false}>
                <PiArrowLeftBold aria-hidden="true" />
                Найновіші
              </Link>
            ) : (
              <span />
            )}
            {d.nextBefore ? (
              <Link href={`${hrefOf(BASE, q, { before: d.nextBefore })}#events`} className="ana-pager-link" scroll={false}>
                Старіші
                <PiArrowRightBold aria-hidden="true" />
              </Link>
            ) : null}
          </nav>
        ) : null}
      </section>
    </main>
  )
}
