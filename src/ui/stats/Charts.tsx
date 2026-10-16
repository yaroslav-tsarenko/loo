import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { t } from '@/i18n'
import { ChartTips } from './ChartTips'
import { longDay, niceMax, seconds, shortDay } from './format'

// Profile charts: plain HTML/SVG, one accent hue (--st-mark, validated for light and dark), thin marks with rounded
// data ends, hairline grid, hover/focus tooltips (ChartTips) and a table view. Server components.

function TableView({ head, rows }: { head: [string, string]; rows: Array<[string, string]> }) {
  return (
    <details className="st-table">
      <summary>{t('stats.charts.table')}</summary>
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">{head[0]}</th>
            <th scope="col">{head[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b]) => (
            <tr key={a}>
              <td>{a}</td>
              <td className="tabular">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  )
}

export function ChartCard({ title, sub, children, className }: { title: ReactNode; sub?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`lu-card st-chart ${className ?? ''}`} data-pad="md">
      <header className="st-chart-head">
        <h3 className="st-chart-title">{title}</h3>
        {sub ? <p className="st-chart-sub">{sub}</p> : null}
      </header>
      {children}
    </section>
  )
}

// Columns per day (XP): the best day carries its value; every column has a tooltip.
export function DayColumns({ days, unit, label }: { days: Array<{ day: string; value: number }>; unit: string; label: string }) {
  const max = Math.max(0, ...days.map((d) => d.value))
  const top = niceMax(max)
  const best = max > 0 ? days.findLastIndex((d) => d.value === max) : -1
  return (
    <>
      <ChartTips className="st-cols-wrap">
        <div className="st-axis-label" aria-hidden="true">
          {top}
        </div>
        <div className="st-cols" role="list" aria-label={label}>
          {days.map((d, i) => (
            <div
              key={d.day}
              role="listitem"
              className="st-col"
              tabIndex={0}
              aria-label={`${longDay(d.day)}: ${d.value} ${unit}`}
              data-tip={`${d.value} ${unit}`}
              data-tip-label={longDay(d.day)}
              data-zero={d.value === 0 ? '' : undefined}
              style={{ '--h': d.value / top } as CSSProperties}
            >
              {i === best ? <span className="st-col-value">{d.value}</span> : null}
              <span className="st-col-bar" />
            </div>
          ))}
        </div>
        <div className="st-x" aria-hidden="true">
          <span>{shortDay(days[0]!.day)}</span>
          <span>{shortDay(days[Math.floor(days.length / 2)]!.day)}</span>
          <span>{shortDay(days[days.length - 1]!.day)}</span>
        </div>
      </ChartTips>
      <TableView head={[t('stats.charts.day'), unit]} rows={days.filter((d) => d.value > 0).map((d) => [shortDay(d.day), String(d.value)])} />
    </>
  )
}

// Daily median seconds per question: 2px line + 10% wash, gaps on days without enough answers, crosshair per day.
export function SpeedLine({ days }: { days: Array<{ day: string; medianMs: number | null; n: number }> }) {
  const points = days.map((d, i) => ({ ...d, i })).filter((d): d is typeof d & { medianMs: number } => d.medianMs !== null)
  if (points.length < 2) return <p className="st-empty-note">{t('stats.charts.speedEmpty')}</p>
  const top = niceMax(Math.max(...points.map((p) => p.medianMs)) / 1000)
  const n = days.length
  const x = (i: number) => ((i + 0.5) / n) * 100
  const y = (ms: number) => 100 - (ms / 1000 / top) * 100
  // split into runs of consecutive days so missing days show as gaps
  const runs: (typeof points)[] = []
  for (const p of points) {
    const last = runs[runs.length - 1]
    if (last && last[last.length - 1]!.i === p.i - 1) last.push(p)
    else runs.push([p])
  }
  const lastPoint = points[points.length - 1]!
  return (
    <>
      <ChartTips className="st-line-wrap">
        <div className="st-axis-label" aria-hidden="true">
          {top} с
        </div>
        <div className="st-line">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {runs.map((run) =>
              run.length > 1 ? (
                <g key={run[0]!.day}>
                  <path className="st-area" d={`M${x(run[0]!.i)},100 ${run.map((p) => `L${x(p.i)},${y(p.medianMs)}`).join(' ')} L${x(run[run.length - 1]!.i)},100 Z`} />
                  <path className="st-path" d={`M${run.map((p) => `${x(p.i)},${y(p.medianMs)}`).join(' L')}`} />
                </g>
              ) : null,
            )}
          </svg>
          {points.map((p) => (
            <span key={p.day} className="st-dot" style={{ left: `${x(p.i)}%`, top: `${y(p.medianMs)}%` }} aria-hidden="true" />
          ))}
          <span className="st-end-label" style={{ left: `${x(lastPoint.i)}%`, top: `${y(lastPoint.medianMs)}%` }} aria-hidden="true">
            {seconds(lastPoint.medianMs)} с
          </span>
          <div className="st-hits" role="list" aria-label={t('stats.charts.speed')}>
            {days.map((d) => (
              <span
                key={d.day}
                role="listitem"
                className="st-hit"
                tabIndex={d.medianMs === null ? -1 : 0}
                aria-label={d.medianMs === null ? undefined : `${longDay(d.day)}: ${seconds(d.medianMs)} с`}
                data-tip={d.medianMs === null ? undefined : `${seconds(d.medianMs)} с`}
                data-tip-label={d.medianMs === null ? undefined : `${longDay(d.day)} · ${d.n} пит.`}
              />
            ))}
          </div>
        </div>
        <div className="st-x" aria-hidden="true">
          <span>{shortDay(days[0]!.day)}</span>
          <span>{shortDay(days[Math.floor(days.length / 2)]!.day)}</span>
          <span>{shortDay(days[days.length - 1]!.day)}</span>
        </div>
      </ChartTips>
      <TableView head={[t('stats.charts.day'), 'с']} rows={points.map((p) => [shortDay(p.day), seconds(p.medianMs)])} />
    </>
  )
}

export interface BarItem {
  key: string
  label: ReactNode
  // 0..1 of the track
  value: number
  display: string
  tip: string
  tipLabel: string
  href?: string
  flag?: ReactNode
}

// Horizontal bars with the value at the tip (topics, levels).
export function BarList({ items, label }: { items: BarItem[]; label: string }) {
  return (
    <ChartTips>
      <ul className="st-bars" aria-label={label}>
        {items.map((b) => {
          const body = (
            <>
              <span className="st-bar-label">
                {b.label}
                {b.flag}
              </span>
              <span className="st-bar-track">
                <span className="st-bar-fill" style={{ '--w': b.value } as CSSProperties} />
                <span className="st-bar-value tabular">{b.display}</span>
              </span>
            </>
          )
          return (
            <li key={b.key} data-tip={b.tip} data-tip-label={b.tipLabel}>
              {b.href ? (
                <Link href={b.href} className="st-bar">
                  {body}
                </Link>
              ) : (
                <span className="st-bar" tabIndex={0}>
                  {body}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </ChartTips>
  )
}
