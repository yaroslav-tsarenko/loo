'use server'

import { z } from 'zod'
import { requireUser, userScope } from '../auth'
import { parseInput } from '../auth-guard'
import { ackEvolution } from '../game/ranks'

const ackInput = z.object({ step: z.number().int().min(0).max(100) })

// The full-screen evolution moment was watched: it won't play again for this step.
export async function evolutionSeen(raw: { step: number }): Promise<void> {
  await requireUser()
  const input = parseInput(ackInput, raw)
  await userScope((tx, userId) => ackEvolution(tx, userId, input.step, Date.now()), { lock: true })
}
