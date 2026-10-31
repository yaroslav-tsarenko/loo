'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { profiles } from '@/db/schema'
import { LOCALES, type Locale } from '@/i18n'
import { safeRedirectPath } from '@/lib/redirect'
import { getProfile, requireUser, userScope } from '../auth'
import { parseInput } from '../auth-guard'
import { writeSetting } from '../settings'
import { courseLevelOf, enrollIn } from '../courses/enrollment'
import { getCourse } from '../courses/registry'
import { minutesSchema as minutes, onboardingInput, purposeFits } from '../services/onboarding-input'
import { goalOf, INTERESTS, LEVELS } from '../services/preferences'

const interests = z.array(z.enum(INTERESTS)).max(INTERESTS.length)
const level = z.enum(LEVELS)

function formInput(form: FormData) {
  const one = (k: string) => {
    const v = form.get(k)
    return typeof v === 'string' ? v : undefined
  }
  return { one, all: (k: string) => form.getAll(k).filter((v): v is string => typeof v === 'string') }
}

// First sign-in wizard (src/ui/auth/OnboardingWizard.tsx), one submit at the end: course, «Для чого?» (purpose → the
// coarse goal the rest of the app reads), «Хто ти?», daily minutes, where to start and the «Хочу це» votes →
// profile.onboarding + the dailyMinutes setting + the first enrollment. Subject-neutral: no self-assessed level — the
// course's own placement test (or «з нуля») says where to start.
export async function completeOnboarding(form: FormData): Promise<void> {
  await requireUser()
  const { one, all } = formInput(form)
  const input = parseInput(onboardingInput, {
    minutes: one('minutes'),
    purpose: one('purpose'),
    role: one('role'),
    wishes: all('wishes'),
    next: one('next'),
    course: one('course') || undefined,
    start: one('start') || undefined,
  })
  const profile = await getProfile()
  const now = Date.now()
  const course = input.course ? await getCourse(input.course) : null
  if (input.course && !course) throw new Error('Unknown course')
  // the purpose list depends on what the course teaches
  if (!purposeFits(input.purpose, course?.course.subject)) throw new Error('Invalid input')
  await userScope(
    async (db, userId) => {
      await db
        .update(profiles)
        .set({
          onboarding: { ...profile?.onboarding, completedAt: now, goal: goalOf(input.purpose), purpose: input.purpose, role: input.role, wishes: input.wishes },
          preferences: { ...profile?.preferences, interests: profile?.preferences.interests ?? [], level: profile?.preferences.level ?? 'noob' },
          updatedAt: now,
        })
        .where(eq(profiles.id, userId))
      if (course) {
        // «Почати з нуля»: the first section at the course's own first level (A1 for a language, the bottom rung for code);
        // the placement test sets its own result later.
        const startLevel = courseLevelOf('noob', course.course)
        const placement = input.start === 'zero' ? { level: startLevel, sectionIndex: 0, sectionId: course.sections[0]?.id ?? null, confident: false, asked: 0, at: now, skipped: true } : null
        await enrollIn(db, userId, course.course.id, { level: startLevel, activate: true, placement, now })
      }
    },
    { tx: true },
  )
  await writeSetting('dailyMinutes', input.minutes)
  revalidatePath('/', 'layout')
  const next = safeRedirectPath(input.next)
  if (course && input.start === 'placement') redirect(`/placement?course=${course.course.id}&next=${encodeURIComponent(next)}`)
  redirect(next)
}

const profileInput = z.object({
  displayName: z.string().trim().min(1).max(60),
  avatar: z.enum(['oauth', 'initials']),
  locale: z.enum(LOCALES as unknown as [Locale, ...Locale[]]),
  minutes,
  interests,
  level,
  sound: z.boolean(),
  haptics: z.boolean(),
})

export async function updateProfile(form: FormData): Promise<void> {
  const user = await requireUser()
  const { one, all } = formInput(form)
  const input = parseInput(profileInput, {
    displayName: one('displayName') ?? '',
    avatar: one('avatar') ?? 'initials',
    locale: one('locale') ?? 'uk',
    minutes: one('minutes'),
    interests: all('interests'),
    level: one('level'),
    sound: one('sound') === 'on',
    haptics: one('haptics') === 'on',
  })
  const profile = await getProfile()
  const now = Date.now()
  // The avatar is never a user-supplied URL: either the identity provider's picture (https-validated) or initials.
  const avatarUrl = input.avatar === 'oauth' ? user.avatarUrl : null
  // the form lists the broad interests only: keep topic tags picked on the profile («Мої уподобання»)
  const extra = (profile?.preferences.interests ?? []).filter((i) => !(INTERESTS as readonly string[]).includes(i))
  const interestList = [...new Set([...input.interests, ...extra])]
  await userScope((db, userId) =>
    db
      .update(profiles)
      .set({ displayName: input.displayName, avatarUrl, locale: input.locale, preferences: { ...profile?.preferences, interests: interestList, level: input.level }, updatedAt: now })
      .where(eq(profiles.id, userId)),
  )
  await writeSetting('dailyMinutes', input.minutes)
  await writeSetting('sound', input.sound)
  await writeSetting('haptics', input.haptics)
  revalidatePath('/', 'layout')
  redirect('/account?saved=1')
}
