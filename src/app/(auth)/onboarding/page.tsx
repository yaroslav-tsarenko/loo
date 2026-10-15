import type { Metadata } from 'next'
import { messages, t } from '@/i18n'
import { safeRedirectPath } from '@/lib/redirect'
import { completeOnboarding } from '@/server/actions/account'
import { getProfile, requireUser } from '@/server/auth'
import { GOALS, INTERESTS, LEVELS, MINUTES } from '@/server/services/preferences'
import { readSettings } from '@/server/settings'
import { param } from '@/ui/auth/AuthShell'
import { Choice, ChoiceGroup } from '@/ui/auth/Choices'
import { Logo } from '@/ui/design/brand/Logo'
import { Button } from '@/ui/design/Button'
import { LooSays } from '@/ui/design/mascot/LooSays'

export const metadata: Metadata = { title: 'Налаштуймо шлях', robots: { index: false, follow: false } }

// First sign-in: goal, daily minutes, interests, self-assessed level → profile (+ dailyMinutes setting).
// TODO(course engine): offer the placement test at /placement once src/course/select ships it.
export default async function OnboardingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireUser()
  const [params, profile, settings] = await Promise.all([searchParams, getProfile(), readSettings()])
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

        <ChoiceGroup legend={t('onboarding.goal.title')} wide>
          {GOALS.map((g) => (
            <Choice key={g} type="radio" name="goal" value={g} defaultChecked={g === goal} required title={m.onboarding.goal.options[g]} />
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
        <p className="choice-hint onb-placement">🧪 {t('onboarding.placement')}</p>

        <div className="onb-submit">
          <Button type="submit" size="lg" block>
            {t('onboarding.submit')}
          </Button>
        </div>
      </form>
    </main>
  )
}
