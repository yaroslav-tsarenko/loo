'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { profiles } from '@/db/schema'
import { getProfile, requireUser, userScope } from '../auth'
import { parseInput } from '../auth-guard'
import { interestOptions } from '../preferences'
import { writeSetting } from '../settings'
import { MINUTES } from '../services/preferences'

const MAX_INTERESTS = 30
const tag = z.string().regex(/^[a-z0-9][a-z0-9-]{0,39}$/)
const minutes = z.coerce
  .number()
  .int()
  .refine((n) => (MINUTES as readonly number[]).includes(n))

// «Мої уподобання» chips on the profile: one tap adds or removes an interest (only tags the catalog offers).
export async function toggleInterest(form: FormData): Promise<void> {
  await requireUser()
  const value = parseInput(tag, form.get('tag'))
  const allowed = new Set((await interestOptions()).map((o) => o.tag))
  if (!allowed.has(value)) throw new Error('Unknown interest')
  const profile = await getProfile()
  const current = new Set(profile?.preferences.interests ?? [])
  if (current.has(value)) current.delete(value)
  else if (current.size < MAX_INTERESTS) current.add(value)
  const interests = [...current]
  await userScope((db, userId) =>
    db
      .update(profiles)
      .set({ preferences: { ...profile?.preferences, interests }, updatedAt: Date.now() })
      .where(eq(profiles.id, userId)),
  )
  revalidatePath('/profile')
}

export async function setDailyMinutes(form: FormData): Promise<void> {
  await requireUser()
  await writeSetting('dailyMinutes', parseInput(minutes, form.get('minutes')))
  revalidatePath('/', 'layout')
}
