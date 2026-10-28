import Link from 'next/link'
import type { ReactNode } from 'react'
import { PiFunnelSimpleBold } from 'react-icons/pi'
import { fmtNumber, fmtOne } from './format'
import { Tabs } from './Tabs'

// A ranked list with a share bar behind each row (value and % of all visitors). Rows link to the same view with
// that value added as a filter. Rows past `limit` fold into «Ще N».

export interface BreakdownRow {
  key: string
  label: string
  sub?: string
  value: number
  // 0..1 of the period's total
  share: number
  href?: string
  mono?: boolean
}

function Row({ r }: { r: BreakdownRow }) {
  const inner = (
    <>
      <span className="ana-row-bar" style={{ width: `${Math.min(100, Math.max(0.5, r.share * 100))}%` }} aria-hidden="true" />
      <span className="ana-row-label" data-mono={r.mono ? 'true' : undefined}>
        {r.label}
        {r.sub ? <small>{r.sub}</small> : null}
      </span>
      <span className="ana-row-value tabular">{fmtNumber(r.value)}</span>
      <span className="ana-row-pct tabular">{r.share >= 0.1 ? `${Math.round(r.share * 100)}%` : r.share >= 0.001 ? `${fmtOne(r.share * 100)}%` : '<0,1%'}</span>
      {r.href ? <PiFunnelSimpleBold className="ana-row-filter" aria-hidden="true" /> : null}
    </>
  )
  return (
    <li className="ana-row">
      {r.href ? (
        <Link href={r.href} className="ana-row-in" scroll={false} title={`Фільтр: ${r.label}`}>
          {inner}
        </Link>
      ) : (
        <span className="ana-row-in">{inner}</span>
      )}
    </li>
  )
}

export function BreakdownList({ rows, valueLabel = 'Відвідувачі', empty = 'Поки порожньо', limit = 8 }: { rows: BreakdownRow[]; valueLabel?: string; empty?: string; limit?: number }) {
  if (rows.length === 0) return <p className="ana-empty">{empty}</p>
  const shown = rows.slice(0, limit)
  const rest = rows.slice(limit)
  return (
    <div className="ana-list">
      <div className="ana-list-head" aria-hidden="true">
        <span />
        <span>{valueLabel}</span>
        <span>%</span>
      </div>
      <ul className="ana-rows" aria-label={valueLabel}>
        {shown.map((r) => (
          <Row key={`${r.key}|${r.sub ?? ''}`} r={r} />
        ))}
      </ul>
      {rest.length > 0 ? (
        <details className="ana-more">
          <summary>Ще {rest.length}</summary>
          <ul className="ana-rows">
            {rest.map((r) => (
              <Row key={`${r.key}|${r.sub ?? ''}`} r={r} />
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  )
}

// A card around one list, or around several lists switched by tabs.
export function BreakdownCard({ title, children, tabs }: { title: string; children?: ReactNode; tabs?: Array<{ id: string; label: string; content: ReactNode }> }) {
  return (
    <section className="ana-card ana-breakdown">
      {tabs ? (
        <Tabs title={title} tabs={tabs} />
      ) : (
        <>
          <h2 className="ana-h2">{title}</h2>
          {children}
        </>
      )}
    </section>
  )
}
