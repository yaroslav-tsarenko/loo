import { t } from '@/i18n'
import type { HeatDay } from '@/progress/stats'
import { count } from '@/ui/format'
import { ChartTips } from '@/ui/stats/ChartTips'
import { longDay, weekdayIndex } from '@/ui/stats/format'

// The «commit squares»: one cell per study day for half a year, Levelup-green by share of the daily goal.
const CELL = 12
const GAP = 3
const LEFT = 26
const TOP = 18
const MONTHS = ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру']

function level(total: number, goal: number): number {
  if (total === 0) return 0
  const r = total / Math.max(1, goal)
  if (r < 0.25) return 1
  if (r < 0.5) return 2
  if (r < 1) return 3
  return 4
}

function tipLabel(d: HeatDay): string {
  if (d.total === 0) return t('stats.heatEmpty')
  const items = count(d.total, 'відповідь', 'відповіді', 'відповідей')
  return `${t('stats.heatTip', { xp: d.xp, minutes: d.minutes, items })}${d.goalMet ? ` · ${t('stats.heatGoal')}` : ''}`
}

export function Heatmap({ days, goal }: { days: HeatDay[]; goal: number }) {
  if (days.length === 0) return null
  const offset = weekdayIndex(days[0]!.day)
  const weeks = Math.ceil((days.length + offset) / 7)
  const width = LEFT + weeks * (CELL + GAP)
  const height = TOP + 7 * (CELL + GAP)
  const monthMarks: Array<{ x: number; label: string }> = []
  let lastMonth = -1
  days.forEach((d, i) => {
    const month = Number(d.day.slice(5, 7)) - 1
    const col = Math.floor((i + offset) / 7)
    if (month !== lastMonth && weekdayIndex(d.day) === 0) {
      monthMarks.push({ x: LEFT + col * (CELL + GAP), label: MONTHS[month]! })
      lastMonth = month
    }
  })
  const active = days.filter((d) => d.total > 0).length
  return (
    <figure className="heatmap st-heat">
      <ChartTips className="heatmap-scroll">
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={`Активність за пів року: ${count(active, 'активний день', 'активні дні', 'активних днів')}`}>
          {monthMarks.map((m) => (
            <text key={`${m.x}`} x={m.x} y={10} className="heatmap-label">
              {m.label}
            </text>
          ))}
          {(
            [
              ['Пн', 0],
              ['Ср', 2],
              ['Пт', 4],
            ] as const
          ).map(([label, row]) => (
            <text key={label} x={0} y={TOP + row * (CELL + GAP) + CELL - 2} className="heatmap-label">
              {label}
            </text>
          ))}
          {days.map((d, i) => {
            const col = Math.floor((i + offset) / 7)
            const row = weekdayIndex(d.day)
            return (
              <rect
                key={d.day}
                x={LEFT + col * (CELL + GAP)}
                y={TOP + row * (CELL + GAP)}
                width={CELL}
                height={CELL}
                rx={2}
                className="heat-cell"
                data-level={level(d.total, goal)}
                data-goal={d.goalMet ? '' : undefined}
                data-today={i === days.length - 1 ? '' : undefined}
                data-tip={longDay(d.day)}
                data-tip-label={tipLabel(d)}
              />
            )
          })}
        </svg>
      </ChartTips>
      <figcaption className="heatmap-legend">
        <span>{t('stats.heatLess')}</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <svg key={l} width={CELL} height={CELL} aria-hidden="true">
            <rect width={CELL} height={CELL} rx={2} className="heat-cell" data-level={l} />
          </svg>
        ))}
        <span>{t('stats.heatMore')}</span>
      </figcaption>
    </figure>
  )
}
