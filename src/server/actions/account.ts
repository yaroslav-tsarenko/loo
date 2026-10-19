'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { profiles } from '@/db/schema'
import { safeRedirectPath } from '@/lib/redirect'
import { getProfile, requireUser, userScope } from '../auth'
import { parseInput } from '../auth-guard'
import { writeSetting } from '../settings'
import { courseLevelOf, enrollIn } from '../courses/enrollment'
import { getCourse } from '../courses/registry'
import { GOALS, INTERESTS, LEVELS, MINUTES } from '../services/preferences'

const interests = z.array(z.enum(INTERESTS)).max(INTERESTS.length)
const level = z.enum(LEVELS)
const minutes = z.coerce
  .number()
  .int()
  .refine((n) => (MINUTES as readonly number[]).includes(n))

const courseId = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(64)
// The questionnaire is subject-neutral (any course: languages, code, …): no interests or self-level — the course choice
// says what, the placement test (or «з нуля») says where to start. Old fields stay optional for older clients.
const onboardingInput = z.object({
  goal: z.enum(GOALS),
  minutes,
  interests: interests.optional(),
  level: level.optional(),
  next: z.string().max(2048).optional(),
  course: courseId.optional(),
  start: z.enum(['placement', 'zero']).optional(),
})

function formInput(form: FormData) {
  const one = (k: string) => {
    const v = form.get(k)
    return typeof v === 'string' ? v : undefined
  }
  return { one, all: (k: string) => form.getAll(k).filter((v): v is string => typeof v === 'string') }
}

// First sign-in questionnaire → profile (goal, interests, level) + the daily time budget setting.
export async function completeOnboarding(form: FormData): Promise<void> {
  await requireUser()
  const { one, all } = formInput(form)
  const input = parseInput(onboardingInput, {
    goal: one('goal'),
    minutes: one('minutes'),
    interests: all('interests'),
    level: one('level'),
    next: one('next'),
    course: one('course') || undefined,
    start: one('start') || undefined,
  })
  const profile = await getProfile()
  const now = Date.now()
  const course = input.course ? await getCourse(input.course) : null
  if (input.course && !course) throw new Error('Unknown course')
  await userScope(
    async (db, userId) => {
      await db
        .update(profiles)
        .set({
          onboarding: { ...profile?.onboarding, completedAt: now, goal: input.goal },
          preferences: { ...profile?.preferences, interests: input.interests?.length ? input.interests : (profile?.preferences.interests ?? []), level: input.level ?? profile?.preferences.level ?? 'noob' },
          updatedAt: now,
        })
        .where(eq(profiles.id, userId))
      if (course) {
        // «Почати з нуля»: the first section at the course's own first level (A1 for a language, the bottom rung for code);
        // the placement test sets its own result later.
        const startLevel = courseLevelOf(input.level ?? 'noob', course.course)
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
  locale: z.enum(['uk']),
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
