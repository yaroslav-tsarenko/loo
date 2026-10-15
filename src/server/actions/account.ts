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
import { GOALS, INTERESTS, LEVELS, MINUTES } from '../services/preferences'

const interests = z.array(z.enum(INTERESTS)).max(INTERESTS.length)
const level = z.enum(LEVELS)
const minutes = z.coerce
  .number()
  .int()
  .refine((n) => (MINUTES as readonly number[]).includes(n))

const onboardingInput = z.object({ goal: z.enum(GOALS), minutes, interests, level, next: z.string().max(2048).optional() })

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
  const input = parseInput(onboardingInput, { goal: one('goal'), minutes: one('minutes'), interests: all('interests'), level: one('level'), next: one('next') })
  const profile = await getProfile()
  const now = Date.now()
  await userScope((db, userId) =>
    db
      .update(profiles)
      .set({
        onboarding: { ...profile?.onboarding, completedAt: now, goal: input.goal },
        preferences: { ...profile?.preferences, interests: input.interests, level: input.level },
        updatedAt: now,
      })
      .where(eq(profiles.id, userId)),
  )
  await writeSetting('dailyMinutes', input.minutes)
  revalidatePath('/', 'layout')
  redirect(safeRedirectPath(input.next))
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
  await userScope((db, userId) =>
    db
      .update(profiles)
      .set({ displayName: input.displayName, avatarUrl, locale: input.locale, preferences: { ...profile?.preferences, interests: input.interests, level: input.level }, updatedAt: now })
      .where(eq(profiles.id, userId)),
  )
  await writeSetting('dailyMinutes', input.minutes)
  await writeSetting('sound', input.sound)
  await writeSetting('haptics', input.haptics)
  revalidatePath('/', 'layout')
  redirect('/account?saved=1')
}
