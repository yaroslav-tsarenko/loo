import 'server-only'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { authMode, SESSION_COOKIE, verifySessionToken } from '@/lib/auth'

// Every server action is a public POST endpoint: proxy.ts blocks unauthenticated action calls,
// and each action re-checks here (defense in depth; becomes requireUser() with multi-user auth).
export async function requireSession(): Promise<void> {
  const mode = authMode()
  if (mode === 'open') return
  if (mode === 'password' && (await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value))) return
  throw new Error('Unauthorized')
}

// Validates action input without echoing it back to the caller.
export function parseInput<T extends z.ZodType>(schema: T, input: unknown): z.infer<T> {
  const result = schema.safeParse(input)
  if (!result.success) throw new Error('Invalid input')
  return result.data
}

// Shared field schemas.
export const ids = {
  unit: z.string().min(1).max(200),
  chapter: z.string().min(1).max(300),
  lesson: z.string().min(1).max(300),
  session: z.uuid(),
  durationMs: z.number().transform((n) => Math.max(0, Math.min(Math.round(n), 3_600_000))),
}
