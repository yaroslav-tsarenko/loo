import Link from 'next/link'
import { budgetFor } from '@/progress/mission'
import type { MissionView } from '@/server/services/mission'
import { BudgetPicker } from './BudgetPicker'

const UNIT: Record<string, [string, string, string]> = {
  card: ['картка', 'картки', 'карток'],
  question: ['питання', 'питання', 'питань'],
  minute: ['хв', 'хв', 'хв'],
  reel: ['фішка', 'фішки', 'фішок'],
  task: ['задача', 'задачі', 'задач'],
  lesson: ['урок', 'уроки', 'уроків'],
}

function plural(n: number, forms: [string, string, string]): string {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return forms[0]
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return forms[1]
  return forms[2]
}

function Ring({ ratio, done }: { ratio: number; done: boolean }) {
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <svg className="mission-ring" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r={r} className="mission-ring-track" />
      <circle cx="32" cy="32" r={r} className="mission-ring-fill" strokeDasharray={c} strokeDashoffset={c * (1 - ratio)} data-done={done ? '' : undefined} />
      <text x="32" y="37" textAnchor="middle" className="mission-ring-label">
        {done ? '🏆' : `${Math.round(ratio * 100)}%`}
      </text>
    </svg>
  )
}

export function MissionCard({ mission, dailyMinutes, streak }: { mission: MissionView; dailyMinutes: number; streak: number }) {
  const budget = budgetFor(mission.plan.budget)
  const next = mission.progress.find((p) => !p.complete)
  const started = mission.ratio > 0
  return (
    <section className="mission" aria-labelledby="mission-title" data-complete={mission.complete ? '' : undefined}>
      <header className="mission-head">
        <Ring ratio={mission.ratio} done={mission.complete} />
        <div className="mission-head-text">
          <span className="eyebrow">
            {budget.emoji} {budget.title} · {mission.plan.budget} хв · +{mission.plan.bonusXp} XP бонус
          </span>
          <h2 id="mission-title" className="mission-title">
            {mission.complete ? 'Місію виконано. Ти машина 🦾' : started ? 'Місія дня в процесі' : 'Місія дня'}
          </h2>
          <span className="mission-streak">
            🔥 <strong className="tabular">{streak}</strong> {plural(streak, ['день', 'дні', 'днів'])} поспіль
          </span>
        </div>
      </header>

      <ol className="mission-steps">
        {mission.progress.map(({ step, done, complete }) => {
          const href = mission.hrefs[step.id] ?? '/'
          const isNext = next?.step.id === step.id
          return (
            <li key={step.id} className="mission-step" data-complete={complete ? '' : undefined} data-next={isNext ? '' : undefined}>
              <Link href={href} className="mission-step-link">
                <span className="mission-step-emoji" aria-hidden="true">
                  {complete ? '✅' : step.emoji}
                </span>
                <span className="mission-step-body">
                  <span className="mission-step-title">{step.title}</span>
                  <span className="mission-step-why">{step.why}</span>
                  <span className="mission-step-bar" aria-hidden="true">
                    <span style={{ transform: `scaleX(${done / step.target})` }} />
                  </span>
                </span>
                <span className="mission-step-count tabular">
                  {done}/{step.target}
                  <span className="mission-step-unit"> {plural(step.target, UNIT[step.unit]!)}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ol>

      {next ? (
        <Link href={mission.hrefs[next.step.id] ?? '/'} className="mission-cta">
          {started ? 'Продовжити' : 'Почати'}: {next.step.emoji} {next.step.title} →
        </Link>
      ) : null}

      <details className="mission-budget">
        <summary>⏱️ Скільки часу сьогодні?</summary>
        <BudgetPicker value={dailyMinutes} locked={started && !mission.complete} />
      </details>
    </section>
  )
}
