import type { Metadata } from 'next'
import Link from 'next/link'
import { PiArrowRightBold } from 'react-icons/pi'
import { loadAnalytics } from '@/server/admin/analytics'
import { hrefOf, METRICS, parseQuery, type SearchParams } from '@/server/admin/analytics-query'
import { requireAdminArea } from '@/server/admin/guard'
import { AreaChart } from '@/ui/admin/AreaChart'
import { BreakdownCard, BreakdownList } from '@/ui/admin/BreakdownList'
import { Delta } from '@/ui/admin/Delta'
import { fmtMetric, fmtNumber, METRIC_META } from '@/ui/admin/format'
import { PeriodPicker } from '@/ui/admin/PeriodPicker'
import { Sparkline } from '@/ui/admin/Sparkline'
import { pickerOf, rowsOf } from '@/ui/admin/view'
import { Button } from '@/ui/design/Button'

export const metadata: Metadata = { title: 'Огляд' }

// Admin overview (docs/ANALYTICS.md): the period's KPIs vs the previous period with sparklines, visitors over time,
// who is online now, and the top pages / sources / countries. Details live on /admin/analytics.

const DETAIL = '/admin/analytics'

export default async function AdminOverview({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdminArea()
  const parsed = parseQuery(await searchParams)
  // the overview is never filtered and always compares
  const q = { ...parsed, filters: {}, compare: true, gran: undefined, before: undefined }
  const d = await loadAnalytics(q, 'overview')
  const p = d.period
  const picker = pickerOf(q, d, false)
  const detail = (patch: Record<string, string | null> = {}) => hrefOf(DETAIL, q, patch)
  const common = { total: d.cur.visitors, q, base: DETAIL }
  const acc = d.accounts

  return (
    <main className="adm ana" id="ana-root">
      <header className="ana-head">
        <div className="ana-head-text">
          <h1 className="ana-title">Огляд</h1>
          <p className="ana-lead">
            {p.label} · порівняно з попереднім таким самим періодом
            <span className="ana-live" title="Відвідувачі з подією за останні 5 хвилин">
              <i aria-hidden="true" />
              {fmtNumber(d.online)} онлайн зараз
            </span>
          </p>
        </div>
        <PeriodPicker key={`${q.range}|${picker.fromDay}|${picker.toDay}`} {...picker} />
      </header>

      {d.issues.length > 0 ? (
        <p className="adm-issues" role="alert">
          Не завантажилось: {d.issues.join(', ')} — спробуй оновити сторінку.
        </p>
      ) : null}

      <section className="ana-kpis" aria-label="Головні показники">
        {METRICS.map((m) => {
          const meta = METRIC_META[m]
          return (
            <Link key={m} href={detail({ metric: m === 'visitors' ? null : m })} className="ana-kpi">
              <span className="ana-kpi-label">{meta.label}</span>
              <span className="ana-kpi-value tabular">{fmtMetric(m, d.cur[m])}</span>
              <Delta cur={d.cur[m]} prev={d.prev[m]} invert={meta.invert} points={meta.unit === 'percent'} prevText={fmtMetric(m, d.prev[m])} />
              <Sparkline values={d.series.values[m]} />
            </Link>
          )
        })}
        <div className="ana-kpi">
          <span className="ana-kpi-label">Увійшли в акаунт</span>
          <span className="ana-kpi-value tabular">{fmtNumber(d.cur.signedIn)}</span>
          <Delta cur={d.cur.signedIn} prev={d.prev.signedIn} prevText={fmtNumber(d.prev.signedIn)} />
        </div>
        {acc ? (
          <div className="ana-kpi">
            <span className="ana-kpi-label">Нові акаунти</span>
            <span className="ana-kpi-value tabular">{fmtNumber(acc.newCur)}</span>
            <Delta cur={acc.newCur} prev={acc.newPrev} prevText={fmtNumber(acc.newPrev)} />
            <span className="ana-kpi-note">усього {fmtNumber(acc.total)}</span>
          </div>
        ) : null}
      </section>

      <section className="ana-card ana-main">
        <div className="ana-card-head">
          <h2 className="ana-h2">Відвідувачі</h2>
          <Link href={detail()} className="ana-link">
            Інші метрики
          </Link>
        </div>
        <AreaChart metric="visitors" gran={p.gran} buckets={d.series.buckets} values={d.series.values.visitors} prevBuckets={d.prevSeries?.buckets} prevValues={d.prevSeries?.values.visitors ?? null} />
      </section>

      <div className="ana-grid ana-grid-3">
        <BreakdownCard title="Сторінки">
          <BreakdownList rows={rowsOf(d.pages, { ...common, key: 'path', mono: true })} limit={5} />
        </BreakdownCard>
        <BreakdownCard title="Джерела">
          <BreakdownList rows={rowsOf(d.dims.ref, { ...common, key: 'ref', dropEmpty: true }).slice(0, 5)} empty="Лише прямі заходи" limit={5} />
        </BreakdownCard>
        <BreakdownCard title="Країни">
          <BreakdownList rows={rowsOf(d.dims.country, { ...common, key: 'country' })} limit={5} />
        </BreakdownCard>
      </div>

      <div className="ana-cta">
        <Button href={detail()} variant="secondary" iconEnd={<PiArrowRightBold aria-hidden="true" />}>
          Детальна аналітика
        </Button>
      </div>
    </main>
  )
}
