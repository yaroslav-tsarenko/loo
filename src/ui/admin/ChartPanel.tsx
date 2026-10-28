'use client'

import { useId, useState, type KeyboardEvent } from 'react'
import type { Metric } from '@/server/admin/analytics-query'
import { AreaChart } from './AreaChart'
import { Delta } from './Delta'
import { fmtMetric, METRIC_META } from './format'

// The KPI tabs over the main chart: each tab shows a metric's total and its change vs the previous period; picking
// one redraws the chart instantly (all series are already here) and keeps `?metric=` in the URL for sharing.

export interface MetricData {
  id: Metric
  value: number | null
  prev: number | null
  values: Array<number | null>
  prevValues: Array<number | null> | null
}

export function ChartPanel({ metrics, buckets, prevBuckets, gran, initial }: { metrics: MetricData[]; buckets: string[]; prevBuckets: string[] | null; gran: 'hour' | 'day'; initial: Metric }) {
  const [metric, setMetric] = useState<Metric>(initial)
  const id = useId()
  const current = metrics.find((m) => m.id === metric) ?? metrics[0]!

  const choose = (m: Metric) => {
    setMetric(m)
    const url = new URL(window.location.href)
    if (m === 'visitors') url.searchParams.delete('metric')
    else url.searchParams.set('metric', m)
    window.history.replaceState(null, '', url)
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = metrics.findIndex((m) => m.id === metric)
    const to = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? metrics.length - 1 : null
    if (to === null) return
    e.preventDefault()
    const next = metrics[(to + metrics.length) % metrics.length]!
    choose(next.id)
    document.getElementById(`${id}-tab-${next.id}`)?.focus()
  }

  return (
    <section className="ana-card ana-main" aria-label="Графік">
      <div className="ana-tabs" role="tablist" aria-label="Метрика графіка" onKeyDown={onKey}>
        {metrics.map((m) => {
          const meta = METRIC_META[m.id]
          const selected = m.id === metric
          return (
            <button
              key={m.id}
              id={`${id}-tab-${m.id}`}
              type="button"
              role="tab"
              className="ana-tab"
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => choose(m.id)}
            >
              <span className="ana-tab-label">{meta.label}</span>
              <span className="ana-tab-value tabular">{fmtMetric(m.id, m.value)}</span>
              <Delta cur={m.value} prev={m.prev} invert={meta.invert} points={meta.unit === 'percent'} prevText={fmtMetric(m.id, m.prev)} />
            </button>
          )
        })}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${metric}`} className="ana-main-plot">
        <AreaChart metric={metric} gran={gran} buckets={buckets} values={current.values} prevBuckets={prevBuckets ?? undefined} prevValues={current.prevValues} />
      </div>
    </section>
  )
}
