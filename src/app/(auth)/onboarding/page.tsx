import type { Metadata } from 'next'
import { messages, t } from '@/i18n'
import { safeRedirectPath } from '@/lib/redirect'
import { completeOnboarding } from '@/server/actions/account'
import { getProfile, requireUser } from '@/server/auth'
import { listCourses } from '@/server/courses/registry'
import { GOALS, INTERESTS, LEVELS, MINUTES } from '@/server/services/preferences'
import { readSettings } from '@/server/settings'
import { param } from '@/ui/auth/AuthShell'
import { Choice, ChoiceGroup } from '@/ui/auth/Choices'
import { Logo } from '@/ui/design/brand/Logo'
import { Button } from '@/ui/design/Button'
import { LooSays } from '@/ui/design/mascot/LooSays'
import { Icon } from '@/ui/icons/Icon'

// Goal choices get an icon (the strings themselves carry no emoji).
const GOAL_ICON: Record<(typeof GOALS)[number], string> = { job: 'px:target', grow: 'px:rocket', school: 'px:gradCap', fun: 'px:star' }

export const metadata: Metadata = { title: 'Налаштуймо шлях', robots: { index: false, follow: false } }

// First sign-in: course, goal, daily minutes, interests, self-assessed level → profile (+ dailyMinutes setting) and the
// first enrollment; «Пройти вступний тест» continues at /placement, «Почати з нуля» starts at the first section.
export default async function OnboardingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireUser()
  const [params, profile, settings, courses] = await Promise.all([searchParams, getProfile(), readSettings(), listCourses()])
  const m = messages()
  const goal = profile?.onboarding.goal ?? 'grow'
  const level = profile?.preferences.level ?? 'noob'
  const chosen = new Set(profile?.preferences.interests ?? ['javascript'])
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
            {courses.map((c, i) => (
              <Choice
                key={c.id}
                type="radio"
                name="course"
                value={c.id}
                defaultChecked={i === 0}
                required
                title={
                  <span className="onb-course">
                    <Icon name={c.meta.icon ?? 'px:book'} size={26} /> {c.meta.title}
                  </span>
                }
                sub={c.meta.subtitle ?? undefined}
              />
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

        <ChoiceGroup legend={t('onboarding.interests.title')} hint={t('onboarding.interests.hint')}>
          {INTERESTS.map((i) => (
            <Choice key={i} type="checkbox" name="interests" value={i} defaultChecked={chosen.has(i)} title={m.interests[i]} />
          ))}
        </ChoiceGroup>

        <ChoiceGroup legend={t('onboarding.level.title')} hint={t('onboarding.level.hint')} wide>
          {LEVELS.map((l) => (
            <Choice key={l} type="radio" name="level" value={l} defaultChecked={l === level} required title={m.levels[l].title} sub={m.levels[l].body} />
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
