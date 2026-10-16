import { PiArrowRightBold, PiCheckBold, PiTrendUpBold } from 'react-icons/pi'
import { t } from '@/i18n'
import type { CoachDay } from '@/progress/stats'
import type { CoachView } from '@/server/stats/coach'
import { Button } from '@/ui/design/Button'
import { Loo } from '@/ui/design/mascot/Loo'
import { PixelIcon } from '@/ui/design/PixelIcon'
import { ProgressBar } from '@/ui/design/ProgressBar'
import { coachText } from './coach-text'
import { longDay } from './format'

const WEEKDAY = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']

function weekdayShort(day: string): string {
  const [y, m, d] = day.split('-').map(Number) as [number, number, number]
  return WEEKDAY[(new Date(y, m - 1, d, 12).getDay() + 6) % 7]!
}

function WeekDots({ week }: { week: CoachDay[] }) {
  return (
    <ol className="coach-week" aria-label={t('coach.weekLabel')}>
      {week.map((d) => (
        <li key={d.day} data-done={d.done ? '' : undefined} title={t(d.done ? 'coach.dayDone' : 'coach.dayMissed', { day: longDay(d.day) })}>
          <span className="coach-week-dot" aria-hidden="true">
            {d.done ? <PiCheckBold /> : null}
          </span>
          <span className="coach-week-day">{weekdayShort(d.day)}</span>
          <span className="sr-only">{t(d.done ? 'coach.dayDone' : 'coach.dayMissed', { day: longDay(d.day) })}</span>
        </li>
      ))}
    </ol>
  )
}

// «+1% щодня»: Loo thinks while the goal is open and lights the bulb (eureka) once it's done.
export function CoachCard({ coach, variant = 'full' }: { coach: CoachView; variant?: 'full' | 'compact' }) {
  const text = coachText(coach.goal, coach.progress)
  const done = coach.progress.done
  const compact = variant === 'compact'
  return (
    <section className="lu-card coach" data-variant={variant} data-done={done ? '' : undefined} data-pad={compact ? 'sm' : 'md'} aria-labelledby={`coach-title-${variant}`}>
      <div className="coach-loo">
        <Loo mood={done ? 'eureka' : 'thinking'} size={compact ? 64 : 96} label={done ? t('coach.doneShort') : t('coach.title')} />
      </div>
      <div className="coach-body">
        <p className="coach-eyebrow">
          <span className="coach-badge">{t('coach.title')}</span> {t('coach.eyebrow')}
        </p>
        <h2 id={`coach-title-${variant}`} className="coach-title">
          {text.title}
        </h2>
        <p className="coach-sub">{text.sub}</p>
        <div className="coach-progress">
          <ProgressBar value={coach.progress.ratio} tone={done ? 'yellow' : 'purple'} size="sm" label={`${text.title}: ${text.progress}`} className="coach-bar" />
          <span className="coach-progress-text tabular" aria-hidden="true">
            {text.progress}
          </span>
        </div>
        <p className="coach-why">
          <PixelIcon name="bulb" size={18} className="coach-why-icon" /> {text.why}
        </p>
        <div className="coach-foot">
          <span className="coach-streak" title={t('coach.compound', { n: coach.streak, x: coach.multiplier.toFixed(2) })}>
            <PiTrendUpBold aria-hidden="true" className="coach-streak-icon" /> {t('coach.streak', { n: coach.streak })} · <strong className="tabular">{t('coach.multiplier', { x: coach.multiplier.toFixed(2) })}</strong>
          </span>
          {done ? (
            <span className="coach-done" role="status">
              {compact ? t('coach.doneShort') : t('coach.done')}
            </span>
          ) : (
            <Button href={coach.href} size="sm" iconEnd={<PiArrowRightBold size={16} />}>
              {t('coach.go')}
            </Button>
          )}
        </div>
        {compact ? null : (
          <div className="coach-compound">
            <WeekDots week={coach.week} />
            <p className="coach-year">
              <span className="coach-pow">
                1.01<sup>{coach.streak}</sup> = ×{coach.multiplier.toFixed(2)}
              </span>{' '}
              · {t('coach.year')}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
