// A tiny trend line for KPI cards (decorative: the numbers sit next to it, the full series is in the chart).
export function Sparkline({ values, width = 120, height = 32 }: { values: Array<number | null>; width?: number; height?: number }) {
  const pts = values.map((v) => v ?? 0)
  if (pts.length < 2) return null
  const max = Math.max(...pts)
  const min = Math.min(0, ...pts)
  const span = max - min || 1
  const x = (i: number) => (i / (pts.length - 1)) * width
  const y = (v: number) => height - 2 - ((v - min) / span) * (height - 4)
  const line = pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('')
  return (
    <svg className="ana-spark" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="ana-spark-area" d={`${line}L${width},${height}L0,${height}Z`} />
      <path className="ana-spark-line" d={line} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
