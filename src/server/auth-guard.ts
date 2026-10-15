import 'server-only'
import { z } from 'zod'

// Every server action is a public POST endpoint: proxy.ts blocks action calls without a session, and each action
// re-checks with requireUser() / userScope() from ./auth (defense in depth), then validates its input here.

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
