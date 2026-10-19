'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { buckLedger } from '@/db/schema'
import { dayKey } from '@/progress/day'
import { requireAdmin, userScope } from '../auth'
import { parseInput } from '../auth-guard'

// Owner testing: credit test bucks to the admin's OWN account (shop, gear, refills). Admin only (ADMIN_EMAILS role),
// never another user; a regular ledger row (reason 'admin-grant'), so the balance, history and RLS stay consistent.
const grantInput = z.object({ amount: z.coerce.number().int().min(1).max(10_000) })

export async function grantTestBucks(form: FormData): Promise<void> {
  await requireAdmin()
  const { amount } = parseInput(grantInput, { amount: form.get('amount') })
  const now = Date.now()
  await userScope((db, userId) => db.insert(buckLedger).values({ userId, amount, reason: 'admin-grant', refId: `admin:${now}`, createdAt: now, day: dayKey(now) }).then(() => undefined))
  revalidatePath('/', 'layout')
}
