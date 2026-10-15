import Link from 'next/link'
import type { ReactNode } from 'react'
import { PiArrowRightBold, PiBookOpenTextFill, PiCardsThreeFill, PiCheckBold, PiCodeBlockFill, PiExamFill, PiLightningFill, PiPathFill, PiTimerFill } from 'react-icons/pi'
import { budgetFor } from '@/progress/mission'
import type { MissionView } from '@/server/services/mission'
import { Pill } from '@/ui/design/Badge'
import { Button } from '@/ui/design/Button'
import { Card } from '@/ui/design/Card'
import type { Tone } from '@/ui/design/cx'
import { GameIcon } from '@/ui/design/GameIcon'
import { ProgressBar } from '@/ui/design/ProgressBar'
import { Ring } from '@/ui/design/Ring'
import { StatChip } from '@/ui/design/StatChip'
import { BudgetPicker } from './BudgetPicker'

const UNIT: Record<string, [string, string, string]> = {
  card: ['картка', 'картки', 'карток'],
  question: ['питання', 'питання', 'питань'],
  minute: ['хв', 'хв', 'хв'],
  reel: ['фішка', 'фішки', 'фішок'],
  task: ['задача', 'задачі', 'задач'],
  lesson: ['урок', 'уроки', 'уроків'],
}

// Each step kind gets a library icon on a colored tile instead of an emoji.
const STEP_ART: Record<string, { tone: Tone; icon: ReactNode }> = {
  card: { tone: 'purple', icon: <PiCardsThreeFill /> },
  question: { tone: 'blue', icon: <PiExamFill /> },
  minute: { tone: 'green', icon: <PiBookOpenTextFill /> },
  reel: { tone: 'yellow', icon: <PiLightningFill /> },
  task: { tone: 'orange', icon: <PiCodeBlockFill /> },
  lesson: { tone: 'green', icon: <PiPathFill /> },
}

function plural(n: number, forms: [string, string, string]): string {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return forms[0]
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return forms[1]
  return forms[2]
}

export function MissionCard({ mission, dailyMinutes, streak }: { mission: MissionView; dailyMinutes: number; streak: number }) {
  const budget = budgetFor(mission.plan.budget)
  const next = mission.progress.find((p) => !p.complete)
  const started = mission.ratio > 0
  return (
    <Card as="section" variant="raised" tone={mission.complete ? 'yellow' : undefined} padding="lg" className="mission" aria-labelledby="mission-title" data-complete={mission.complete ? '' : undefined}>
      <header className="mission-head">
        <Ring value={mission.ratio} size={76} stroke={8} tone={mission.complete ? 'yellow' : 'green'} label={`Місія дня: ${Math.round(mission.ratio * 100)}%`}>
          {mission.complete ? <GameIcon name="crown" size={34} /> : <span className="mission-ring-pct tabular">{Math.round(mission.ratio * 100)}%</span>}
        </Ring>
        <div className="mission-head-text">
          <span className="mission-tags">
            <Pill size="sm" tone="blue" icon={<span aria-hidden="true">{budget.emoji}</span>}>
              {budget.title} · {mission.plan.budget} хв
            </Pill>
            <Pill size="sm" tone="yellow" icon={<GameIcon name="bolt" size={14} />}>
              +{mission.plan.bonusXp} XP
            </Pill>
          </span>
          <h2 id="mission-title" className="mission-title">
            {mission.complete ? 'Місію виконано. Ти машина 🦾' : started ? 'Місія дня в процесі' : 'Місія дня'}
          </h2>
          <span className="mission-streak">
            <StatChip kind="streak" value={streak} size="sm" active={streak > 0} /> {plural(streak, ['день', 'дні', 'днів'])} поспіль
          </span>
        </div>
      </header>

      <ol className="mission-steps">
        {mission.progress.map(({ step, done, complete }) => {
          const href = mission.hrefs[step.id] ?? '/'
          const isNext = next?.step.id === step.id
          const art = STEP_ART[step.unit] ?? { tone: 'blue' as Tone, icon: <span aria-hidden="true">{step.emoji}</span> }
          return (
            <li key={step.id} className="mission-step" data-complete={complete ? '' : undefined} data-next={isNext ? '' : undefined}>
              <Link href={href} className="mission-step-link">
                <span className="mission-step-icon" data-tone={complete ? 'green' : art.tone} aria-hidden="true">
                  {complete ? <PiCheckBold /> : art.icon}
                </span>
                <span className="mission-step-body">
                  <span className="mission-step-title">{step.title}</span>
                  {isNext ? <span className="mission-step-why">{step.why}</span> : null}
                  <ProgressBar value={done / step.target} size="sm" tone={complete ? 'green' : art.tone} label={step.title} className="mission-step-bar" />
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
        <Button href={mission.hrefs[next.step.id] ?? '/'} size="lg" block iconEnd={<PiArrowRightBold size={20} />} className="mission-go">
          {started ? 'Продовжити' : 'Почати'}: {next.step.title}
        </Button>
      ) : null}

      <details className="mission-budget">
        <summary>
          <PiTimerFill aria-hidden="true" /> Скільки часу сьогодні?
        </summary>
        <BudgetPicker value={dailyMinutes} locked={started && !mission.complete} />
      </details>
    </Card>
  )
}
