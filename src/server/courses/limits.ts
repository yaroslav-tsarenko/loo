import 'server-only'
import { hitRateLimit, type RateLimitRule } from '@/lib/rate-limit'
import { dbRateLimitStore } from '../rate-limit-store'

// Per-user write limits for course actions (docs/SECURITY.md §4.6: ~120 writes / min per user).
export const COURSE_LIMITS = {
  // enroll, switch, leave, level change
  library: { limit: 30, windowMs: 60_000 },
  // starting and submitting topic tests / exams
  test: { limit: 30, windowMs: 60_000 },
  // placement steps (one per answer) and applying the result
  placement: { limit: 120, windowMs: 60_000 },
} satisfies Record<string, RateLimitRule>

export async function limitUser(userId: string, scope: keyof typeof COURSE_LIMITS): Promise<void> {
  const result = await hitRateLimit(dbRateLimitStore, `course-${scope}:user:${userId}`, COURSE_LIMITS[scope])
  if (!result.allowed) throw new Error('Rate limit')
}
