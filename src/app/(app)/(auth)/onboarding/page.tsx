import type { Metadata } from 'next'
import { levelShort } from '@/course'
import { safeRedirectPath } from '@/lib/redirect'
import { requireUser } from '@/server/auth'
import { listCourses } from '@/server/courses/registry'
import { MINUTES } from '@/progress/preferences'
import { readSettings } from '@/server/settings'
import { param } from '@/ui/auth/AuthShell'
import { OnboardingWizard, type WizardCourse } from '@/ui/auth/OnboardingWizard'

export const metadata: Metadata = { title: 'Налаштуймо шлях', robots: { index: false, follow: false } }

// First sign-in: a one-question-per-screen wizard (src/ui/auth/OnboardingWizard.tsx), subject-neutral — the directions
// and courses come from the registry, the «скоро» ones from src/course/catalog-soon.ts. One submit at the end
// (completeOnboarding): profile + dailyMinutes + the first enrollment; «Вступний тест» continues at /placement.
export default async function OnboardingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireUser()
  const [params, settings, courses] = await Promise.all([searchParams, readSettings(), listCourses()])
  const daily = (MINUTES as readonly number[]).includes(settings.dailyMinutes) ? settings.dailyMinutes : 10
  const list: WizardCourse[] = courses.map((c) => ({
    id: c.id,
    title: c.meta.title,
    subtitle: c.meta.subtitle ?? null,
    icon: c.meta.icon ?? 'px:book',
    subject: c.meta.subject,
    target: c.meta.target ?? null,
    exam: c.meta.exam?.name ?? null,
    range: `${levelShort(c.levels.from)} → ${levelShort(c.levels.to)}`,
  }))
  return (
    <main className="onb-page">
      <OnboardingWizard courses={list} next={safeRedirectPath(param(params, 'next'))} defaultMinutes={daily} />
    </main>
  )
}
