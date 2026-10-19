import type { Metadata } from 'next'
import { messages, t } from '@/i18n'
import { safeRedirectPath } from '@/lib/redirect'
import { completeOnboarding } from '@/server/actions/account'
import { getProfile, requireUser } from '@/server/auth'
import { listCourses } from '@/server/courses/registry'
import { levelShort, SUBJECTS, type Subject } from '@/course'
import { GOALS, MINUTES } from '@/server/services/preferences'
import { readSettings } from '@/server/settings'
import { param } from '@/ui/auth/AuthShell'
import { Choice, ChoiceGroup } from '@/ui/auth/Choices'
import { Logo } from '@/ui/design/brand/Logo'
import { Button } from '@/ui/design/Button'
import { LooSays } from '@/ui/design/mascot/LooSays'
import { Icon } from '@/ui/icons/Icon'

// Goal choices get an icon (the strings themselves carry no emoji).
const GOAL_ICON: Record<(typeof GOALS)[number], string> = { job: 'px:target', grow: 'px:rocket', school: 'px:gradCap', fun: 'px:star' }
const SUBJECT_ICON: Record<Subject, string> = {
  language: 'px:globe',
  programming: 'px:code',
  science: 'px:microscope',
  psychology: 'px:brain',
  business: 'px:clipboard',
  security: 'px:shield',
  other: 'px:books',
}
const subjectOf = (s: string): Subject => ((SUBJECTS as readonly string[]).includes(s) ? (s as Subject) : 'other')

export const metadata: Metadata = { title: 'Налаштуймо шлях', robots: { index: false, follow: false } }

// First sign-in, subject-neutral (languages, code, psychology… — whatever the catalog has): course, goal, daily minutes →
// profile (+ dailyMinutes setting) and the first enrollment; «Пройти вступний тест» continues at /placement, «Почати з
// нуля» starts at the course's first section. No coding-specific questions: the course's own placement finds the level.
export default async function OnboardingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireUser()
  const [params, profile, settings, courses] = await Promise.all([searchParams, getProfile(), readSettings(), listCourses()])
  const m = messages()
  const goal = profile?.onboarding.goal ?? 'grow'
  // courses grouped by subject, groups in SUBJECTS order; nothing pre-selected unless there is only one course
  const groups = SUBJECTS.map((subject) => ({ subject, courses: courses.filter((c) => subjectOf(c.meta.subject) === subject) })).filter((g) => g.courses.length > 0)
  const daily = (MINUTES as readonly number[]).includes(settings.dailyMinutes) ? settings.dailyMinutes : 10
  return (
    <main className="onb-page">
      <header className="auth-top">
        <Logo size={34} />
      </header>
      <form action={completeOnboarding} className="onb-form">
        <input type="hidden" name="next" value={safeRedirectPath(param(params, 'next'))} />
        <LooSays mood="wave" size={96} text={t('onboarding.loo')} />
        <h1 className="onb-title">{t('onboarding.title')}</h1>
        <p className="onb-lead">{t('onboarding.lead')}</p>

        {courses.length > 0 ? (
          <ChoiceGroup legend={t('onboarding.course.title')} hint={t('onboarding.course.hint')} wide>
            {groups.map((g) => (
              <div key={g.subject} className="onb-subject" role="group" aria-label={m.onboarding.subjects[g.subject]}>
                {groups.length > 1 ? (
                  <p className="onb-subject-title">
                    <Icon name={SUBJECT_ICON[g.subject]} size={18} /> {m.onboarding.subjects[g.subject]}
                  </p>
                ) : null}
                <div className="choice-grid">
                  {g.courses.map((c) => (
                    <Choice
                      key={c.id}
                      type="radio"
                      name="course"
                      value={c.id}
                      defaultChecked={courses.length === 1}
                      required
                      title={
                        <span className="onb-course">
                          <Icon name={c.meta.icon ?? 'px:book'} size={26} /> {c.meta.title}
                        </span>
                      }
                      sub={
                        <>
                          {c.meta.subtitle ? <span className="onb-course-sub">{c.meta.subtitle}</span> : null}
                          <span className="onb-course-range">
                            {levelShort(c.levels.from)} → {levelShort(c.levels.to)}
                          </span>
                        </>
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </ChoiceGroup>
        ) : null}

        <ChoiceGroup legend={t('onboarding.goal.title')} wide>
          {GOALS.map((g) => (
            <Choice key={g} type="radio" name="goal" value={g} defaultChecked={g === goal} required icon={<Icon name={GOAL_ICON[g]} size={24} />} title={m.onboarding.goal.options[g]} />
          ))}
        </ChoiceGroup>

        <ChoiceGroup legend={t('onboarding.minutes.title')}>
          {MINUTES.map((n) => (
            <Choice key={n} type="radio" name="minutes" value={String(n)} defaultChecked={n === daily} required title={t('onboarding.minutes.option', { n })} sub={m.onboarding.minutes.labels[n]} />
          ))}
        </ChoiceGroup>

        {courses.length > 0 ? (
          <ChoiceGroup legend={t('onboarding.start.title')} wide>
            <Choice type="radio" name="start" value="placement" defaultChecked required icon={<Icon name="px:testTube" size={24} />} title={t('onboarding.start.placement')} sub={t('onboarding.start.placementSub')} />
            <Choice type="radio" name="start" value="zero" required icon={<Icon name="px:sprout" size={24} />} title={t('onboarding.start.zero')} sub={t('onboarding.start.zeroSub')} />
          </ChoiceGroup>
        ) : (
          <p className="choice-hint onb-placement">
            <Icon name="px:testTube" size={18} /> {t('onboarding.placement')}
          </p>
        )}

        <div className="onb-submit">
          <Button type="submit" size="lg" block iconEnd={<Icon name="px:rocket" size={22} />}>
            {t('onboarding.submit')}
          </Button>
        </div>
      </form>
    </main>
  )
}
