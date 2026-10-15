import type { HeatDay } from '@/server/services/stats'
import { count } from '@/ui/format'

const CELL = 11
const GAP = 3
const MONTHS = ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру']

function weekday(day: string): number {
  const [y, m, d] = day.split('-').map(Number) as [number, number, number]
  return (new Date(y, m - 1, d).getDay() + 6) % 7
}

function level(total: number, goal: number): number {
  if (total === 0) return 0
  const r = total / Math.max(1, goal)
  if (r < 0.25) return 1
  if (r < 0.5) return 2
  if (r < 1) return 3
  return 4
}

export function Heatmap({ days, goal }: { days: HeatDay[]; goal: number }) {
  const offset = weekday(days[0]!.day)
  const weeks = Math.ceil((days.length + offset) / 7)
  const width = 28 + weeks * (CELL + GAP)
  const height = 18 + 7 * (CELL + GAP)
  const monthMarks: Array<{ x: number; label: string }> = []
  let lastMonth = -1
  days.forEach((d, i) => {
    const month = Number(d.day.slice(5, 7)) - 1
    const col = Math.floor((i + offset) / 7)
    if (month !== lastMonth && weekday(d.day) === 0) {
      monthMarks.push({ x: 28 + col * (CELL + GAP), label: MONTHS[month]! })
      lastMonth = month
    }
  })
  const active = days.filter((d) => d.total > 0).length
  return (
    <figure className="heatmap">
      <div className="heatmap-scroll">
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={`Активність за пів року: ${count(active, 'активний день', 'активні дні', 'активних днів')}`}>
          {monthMarks.map((m) => (
            <text key={`${m.x}`} x={m.x} y={10} className="heatmap-label">
              {m.label}
            </text>
          ))}
          {[
            ['Пн', 0],
            ['Ср', 2],
            ['Пт', 4],
          ].map(([label, row]) => (
            <text key={label} x={0} y={18 + (row as number) * (CELL + GAP) + CELL - 2} className="heatmap-label">
              {label}
            </text>
          ))}
          {days.map((d, i) => {
            const col = Math.floor((i + offset) / 7)
            const row = weekday(d.day)
            return (
              <rect
                key={d.day}
                x={28 + col * (CELL + GAP)}
                y={18 + row * (CELL + GAP)}
                width={CELL}
                height={CELL}
                rx={2}
                className="heat-cell"
                data-level={level(d.total, goal)}
                data-goal={d.goalMet ? '' : undefined}
              >
                <title>{`${d.day}: ${d.total === 0 ? 'без занять' : `${count(d.total, 'відповідь', 'відповіді', 'відповідей')}, +${d.xp} XP${d.goalMet ? ', мету виконано' : ''}`}`}</title>
              </rect>
            )
          })}
        </svg>
      </div>
      <figcaption className="heatmap-legend">
        <span>менше</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <svg key={l} width={CELL} height={CELL} aria-hidden="true">
            <rect width={CELL} height={CELL} rx={2} className="heat-cell" data-level={l} />
          </svg>
        ))}
        <span>більше · колір рахується від денної мети ({goal})</span>
      </figcaption>
    </figure>
  )
}
