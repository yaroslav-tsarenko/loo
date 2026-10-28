'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { Metric } from '@/server/admin/analytics-query'
import { bucketTick, bucketTitle, fmtMetric, fmtTick, METRIC_META } from './format'

// Area + line chart for one metric over time, with the previous period as a dashed line. Pure SVG, measured to the
// container (ResizeObserver) so text never scales. Hover = crosshair + tooltip; keyboard = one tab stop, arrows move
// between the points (roving tabindex). A visually-hidden table carries every value for screen readers.

export interface AreaChartProps {
  metric: Metric
  gran: 'hour' | 'day'
  buckets: string[]
  values: Array<number | null>
  prevBuckets?: string[]
  prevValues?: Array<number | null> | null
  height?: number
}

const PAD = { top: 14, right: 14, bottom: 28, left: 52 }

// 1, 2, 2.5, 5 × 10^k steps: the finest that gives at most 5 intervals (whole steps for counts)
export function niceTicks(max: number, unit: 'count' | 'percent' | 'seconds'): number[] {
  if (!(max > 0)) return [0, 1]
  const pow = 10 ** Math.floor(Math.log10(max / 5))
  let step = 0
  for (const m of [1, 2, 2.5, 5, 10, 20, 25, 50]) {
    const s = m * pow
    if (unit === 'count' && (s < 1 || !Number.isInteger(Math.round(s * 1e6) / 1e6))) continue
    if (Math.ceil(max / s - 1e-9) <= 5) {
      step = s
      break
    }
  }
  if (!step) step = unit === 'count' ? Math.max(1, Math.ceil(max / 5)) : max / 5
  const count = Math.ceil(max / step - 1e-9)
  return Array.from({ length: count + 1 }, (_, i) => Math.round(i * step * 1e6) / 1e6)
}

function pathOf(points: Array<[number, number] | null>): string {
  let d = ''
  let open = false
  for (const p of points) {
    if (!p) {
      open = false
      continue
    }
    d += `${open ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`
    open = true
  }
  return d
}

function areaOf(points: Array<[number, number] | null>, base: number): string {
  // one closed shape per unbroken run
  let d = ''
  let run: Array<[number, number]> = []
  const flush = () => {
    if (run.length > 0) d += `M${run[0]![0].toFixed(1)},${base}${run.map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('')}L${run.at(-1)![0].toFixed(1)},${base}Z`
    run = []
  }
  for (const p of points) {
    if (p) run.push(p)
    else flush()
  }
  flush()
  return d
}

export function AreaChart({ metric, gran, buckets, values, prevBuckets, prevValues, height = 260 }: AreaChartProps) {
  const meta = METRIC_META[metric]
  const id = useId()
  const box = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const [width, setWidth] = useState(720)
  const [active, setActive] = useState<number | null>(null)
  const [focusAt, setFocusAt] = useState<number | null>(null)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setWidth(Math.max(240, Math.round(entry.contentRect.width)))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const n = values.length
  const prev = prevValues && prevValues.length > 0 ? prevValues : null
  const all = [...values, ...(prev ?? [])].filter((v): v is number => v !== null)
  const ticks = niceTicks(Math.max(0, ...all), meta.unit)
  const top = ticks.at(-1) || 1
  const innerW = Math.max(10, width - PAD.left - PAD.right)
  const innerH = height - PAD.top - PAD.bottom
  const x = (i: number) => PAD.left + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW)
  const y = (v: number) => PAD.top + innerH - (v / top) * innerH
  const base = PAD.top + innerH
  const curPts = values.map((v, i) => (v === null ? null : ([x(i), y(v)] as [number, number])))
  const prevPts = prev ? values.map((_, i) => (prev[i] === null || prev[i] === undefined ? null : ([x(i), y(prev[i]!)] as [number, number]))) : null

  // x labels: at most one per ~76px; hourly charts over several days show the date at midnight
  const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(innerW / 76))))
  const multiDay = gran === 'hour' && n > 24
  const labelAt = (i: number) => i % every === 0
  // keep edge labels inside the plot (~6px per character at 11px)
  const anchorAt = (i: number, label: string): 'start' | 'middle' | 'end' => {
    const half = label.length * 3
    return x(i) - half < PAD.left - 8 ? 'start' : x(i) + half > width ? 'end' : 'middle'
  }
  const focusIndex = focusAt ?? n - 1

  const titles = buckets.map((b) => bucketTitle(b, gran))
  const labels = buckets.map((_, i) => {
    const cur = `${titles[i]}: ${fmtMetric(metric, values[i])}`
    return prev ? `${cur}; попередній період (${bucketTitle(prevBuckets?.[i] ?? '', gran)}): ${fmtMetric(metric, prev[i])}` : cur
  })

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * width
    const i = n <= 1 ? 0 : Math.round(((px - PAD.left) / innerW) * (n - 1))
    setActive(Math.min(n - 1, Math.max(0, i)))
  }

  const focusPoint = (i: number) => {
    const j = Math.min(n - 1, Math.max(0, i))
    setFocusAt(j)
    setActive(j)
    svg.current?.querySelector<SVGElement>(`[data-i="${j}"]`)?.focus()
  }

  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    const step = e.shiftKey ? 7 : 1
    const moves: Record<string, number> = { ArrowRight: focusIndex + step, ArrowLeft: focusIndex - step, Home: 0, End: n - 1, PageUp: focusIndex - 7, PageDown: focusIndex + 7 }
    const to = moves[e.key]
    if (to === undefined) return
    e.preventDefault()
    focusPoint(to)
  }

  // summary for the aria-label
  const known = values.map((v, i) => [v, i] as const).filter((p): p is readonly [number, number] => p[0] !== null)
  const peak = known.reduce<readonly [number, number] | null>((best, p) => (!best || p[0] > best[0] ? p : best), null)
  const total = meta.unit === 'count' ? known.reduce((s, [v]) => s + v, 0) : null
  const summary = `${meta.label}, ${n} ${gran === 'hour' ? 'год.' : 'дн.'}${total !== null ? `, сума за точками ${fmtMetric(metric, total)}` : ''}${peak ? `, максимум ${fmtMetric(metric, peak[0])} (${titles[peak[1]]})` : ''}. Стрілки вліво/вправо — по точках.`

  const tipLeft = active === null ? 0 : (x(active) / width) * 100
  const tipFlip = active !== null && x(active) > width * 0.62

  return (
    <div className="ana-chart" ref={box}>
      {prev ? (
        <div className="ana-legend" aria-hidden="true">
          <span className="ana-legend-item">
            <i className="ana-key ana-key-cur" />
            Цей період
          </span>
          <span className="ana-legend-item">
            <i className="ana-key ana-key-prev" />
            Попередній
          </span>
        </div>
      ) : null}
      <div className="ana-chart-plot">
        <svg
          ref={svg}
          className="ana-chart-svg"
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="group"
          aria-label={summary}
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={() => setActive(null)}
          onKeyDown={onKey}
        >
          <defs>
            <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" className="ana-fill-top" />
              <stop offset="100%" className="ana-fill-bottom" />
            </linearGradient>
          </defs>
          <g className="ana-grid" aria-hidden="true">
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} />
                <text x={PAD.left - 8} y={y(t)} dy="0.35em" textAnchor="end">
                  {fmtTick(metric, t)}
                </text>
              </g>
            ))}
            {buckets.map((b, i) =>
              labelAt(i) ? (
                <text key={b} className="ana-xlabel" x={x(i)} y={height - 8} textAnchor={anchorAt(i, bucketTick(b, gran, multiDay && i === 0))}>
                  {bucketTick(b, gran, multiDay && i === 0)}
                </text>
              ) : null,
            )}
          </g>
          <path className="ana-area" d={areaOf(curPts, base)} fill={`url(#${id}-fill)`} aria-hidden="true" />
          {prevPts ? <path className="ana-line-prev" d={pathOf(prevPts)} aria-hidden="true" /> : null}
          <path className="ana-line" d={pathOf(curPts)} aria-hidden="true" />
          {active !== null ? <line className="ana-cross" x1={x(active)} x2={x(active)} y1={PAD.top} y2={base} aria-hidden="true" /> : null}
          {active !== null && prev && prev[active] !== null && prev[active] !== undefined ? <circle className="ana-dot-prev" cx={x(active)} cy={y(prev[active]!)} r={4} aria-hidden="true" /> : null}
          {values.map((v, i) => (
            <circle
              key={buckets[i] ?? i}
              data-i={i}
              className="ana-point"
              data-active={active === i ? 'true' : undefined}
              cx={x(i)}
              cy={y(v ?? 0)}
              r={active === i ? 5 : 3}
              tabIndex={i === focusIndex ? 0 : -1}
              role="img"
              aria-label={labels[i]}
              onFocus={() => {
                setFocusAt(i)
                setActive(i)
              }}
              onBlur={() => setActive(null)}
            />
          ))}
        </svg>
        {active !== null ? (
          <div className="ana-tip" data-flip={tipFlip ? 'true' : undefined} style={{ left: `${tipLeft}%` }} aria-hidden="true">
            <div className="ana-tip-title">{titles[active]}</div>
            <div className="ana-tip-row">
              <i className="ana-key ana-key-cur" />
              <strong>{fmtMetric(metric, values[active])}</strong>
              <span>{meta.label}</span>
            </div>
            {prev ? (
              <div className="ana-tip-row">
                <i className="ana-key ana-key-prev" />
                <strong>{fmtMetric(metric, prev[active])}</strong>
                <span>{bucketTick(prevBuckets?.[active] ?? '', gran, true)}</span>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <table className="sr-only">
        <caption>{meta.label}</caption>
        <thead>
          <tr>
            <th scope="col">{gran === 'hour' ? 'Година' : 'День'}</th>
            <th scope="col">Цей період</th>
            {prev ? <th scope="col">Попередній період</th> : null}
          </tr>
        </thead>
        <tbody>
          {buckets.map((b, i) => (
            <tr key={b}>
              <th scope="row">{titles[i]}</th>
              <td>{fmtMetric(metric, values[i])}</td>
              {prev ? <td>{fmtMetric(metric, prev[i])}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
