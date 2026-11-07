import { z } from 'zod'
import { MAX_WISHES, WISH_IDS } from '@/course/catalog-soon'
import { MINUTES, PURPOSES, purposesFor, ROLES, START_MODES, type Purpose } from '@/progress/preferences'

// Input of the first sign-in wizard (src/ui/auth/OnboardingWizard.tsx → completeOnboarding). Pure, so it is unit-tested
// (tests/unit/onboarding.test.ts); the action re-checks the purpose against the chosen course (purposeFits).

export const minutesSchema = z.coerce
  .number()
  .int()
  .refine((n) => (MINUTES as readonly number[]).includes(n))

export const courseIdSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(64)

export const onboardingInput = z.object({
  minutes: minutesSchema,
  purpose: z.enum(PURPOSES),
  role: z.enum(ROLES),
  // «Хочу це» votes for directions / courses that are not there yet; duplicates collapse
  wishes: z
    .array(z.enum(WISH_IDS))
    .max(MAX_WISHES)
    .default([])
    .transform((w) => [...new Set(w)]),
  next: z.string().max(2048).optional(),
  course: courseIdSchema.optional(),
  start: z.enum(START_MODES).optional(),
})
export type OnboardingInput = z.infer<typeof onboardingInput>

// The purpose must be one the wizard offers for the course's subject (no course → the general list).
export function purposeFits(purpose: Purpose, subject: string | null | undefined): boolean {
  return purposesFor(subject).includes(purpose)
}
