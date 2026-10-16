import type { Attribute } from '@/game'
import { ATTRIBUTE_EMOJI } from '@/game'

// Six-axis radar of Loo's attributes (server-rendered SVG).
export function AttributeRadar({ attributes, label }: { attributes: readonly Attribute[]; label: string }) {
  const size = 260
  const c = size / 2
  const r = 92
  const n = attributes.length
  const point = (i: number, k: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n
    return [c + Math.cos(a) * r * k, c + Math.sin(a) * r * k] as const
  }
  const ring = (k: number) => attributes.map((_, i) => point(i, k).join(',')).join(' ')
  const shape = attributes.map((a, i) => point(i, Math.max(0.04, a.value / 100)).join(',')).join(' ')
  return (
    <svg className="attr-radar" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label}: ${attributes.map((a) => `${a.id} ${a.level}`).join(', ')}`}>
      {[0.25, 0.5, 0.75, 1].map((k) => (
        <polygon key={k} points={ring(k)} className="attr-radar-ring" />
      ))}
      {attributes.map((a, i) => {
        const [x, y] = point(i, 1)
        return <line key={a.id} x1={c} y1={c} x2={x} y2={y} className="attr-radar-axis" />
      })}
      <polygon points={shape} className="attr-radar-shape" />
      {attributes.map((a, i) => {
        const [x, y] = point(i, 1.2)
        return (
          <text key={a.id} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="attr-radar-label">
            {ATTRIBUTE_EMOJI[a.id]}
          </text>
        )
      })}
    </svg>
  )
}
