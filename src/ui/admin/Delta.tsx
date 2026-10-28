import { PiArrowDownRightBold, PiArrowUpRightBold, PiMinusBold } from 'react-icons/pi'
import { fmtOne } from './format'

// Change vs the previous period: «▲ 12%» in green / «▼ 5%» in red (inverted for metrics where less is better).
// `points` = show an absolute difference in percentage points (rates such as bounce).
export function Delta({ cur, prev, invert = false, points = false, prevText }: { cur: number | null; prev: number | null; invert?: boolean; points?: boolean; prevText?: string }) {
  if (cur === null || prev === null) return null
  let diff: number
  if (points) diff = cur - prev
  else if (prev === 0) {
    if (cur === 0) diff = 0
    else
      return (
        <span className="ana-delta" data-trend="new" title={prevText ? `Попередній період: ${prevText}` : undefined}>
          нове
        </span>
      )
  } else diff = ((cur - prev) / prev) * 100
  const rounded = Math.abs(diff) < 10 ? Math.round(diff * 10) / 10 : Math.round(diff)
  const trend = rounded === 0 ? 'flat' : rounded > 0 ? 'up' : 'down'
  const good = trend === 'flat' ? undefined : (trend === 'up') !== invert
  const Icon = trend === 'up' ? PiArrowUpRightBold : trend === 'down' ? PiArrowDownRightBold : PiMinusBold
  const text = `${rounded > 0 ? '+' : rounded < 0 ? '−' : ''}${fmtOne(Math.abs(rounded))}${points ? ' п.п.' : '%'}`
  return (
    <span className="ana-delta" data-trend={trend} data-good={good === undefined ? undefined : String(good)} title={prevText ? `Попередній період: ${prevText}` : undefined}>
      <Icon aria-hidden="true" />
      <span className="sr-only">{trend === 'up' ? 'зростання' : trend === 'down' ? 'спад' : 'без змін'}</span>
      {text}
    </span>
  )
}
