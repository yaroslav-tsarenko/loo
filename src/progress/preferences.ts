// Onboarding / profile choices. Pure constants shared by the forms and the actions' validation.

export const GOALS = ['job', 'grow', 'school', 'fun'] as const
export type Goal = (typeof GOALS)[number]

export const MINUTES = [5, 10, 15, 20, 30] as const

// Self-assessed level; the course engine maps it (or a placement test, /placement) to an enrollment level.
export const LEVELS = ['noob', 'junior', 'middle', 'senior', 'god'] as const
export type SelfLevel = (typeof LEVELS)[number]

export const INTERESTS = ['javascript', 'typescript', 'react', 'node', 'browser', 'algorithms', 'system-design', 'interview', 'security', 'english'] as const
export type Interest = (typeof INTERESTS)[number]

// Onboarding «Для чого?»: the options depend on what the course teaches (src/course/schema/manifest.ts SUBJECTS).
// Every purpose maps onto a coarse GOAL, which the rest of the app keeps using; the purpose itself is stored as well.
export const PURPOSES = ['relocate', 'work', 'travel', 'exam', 'school', 'self', 'first-job', 'promotion', 'interview', 'study'] as const
export type Purpose = (typeof PURPOSES)[number]

export const PURPOSE_GOAL: Readonly<Record<Purpose, Goal>> = {
  relocate: 'job',
  work: 'job',
  travel: 'fun',
  exam: 'school',
  school: 'school',
  self: 'fun',
  'first-job': 'job',
  promotion: 'grow',
  interview: 'job',
  study: 'school',
}

export const LANGUAGE_PURPOSES = ['relocate', 'work', 'travel', 'exam', 'school', 'self'] as const satisfies readonly Purpose[]
export const PROGRAMMING_PURPOSES = ['first-job', 'promotion', 'interview', 'study', 'self'] as const satisfies readonly Purpose[]
export const GENERAL_PURPOSES = ['work', 'study', 'self'] as const satisfies readonly Purpose[]

export function purposesFor(subject: string | null | undefined): readonly Purpose[] {
  return subject === 'language' ? LANGUAGE_PURPOSES : subject === 'programming' ? PROGRAMMING_PURPOSES : GENERAL_PURPOSES
}

export function goalOf(purpose: Purpose): Goal {
  return PURPOSE_GOAL[purpose]
}

// Onboarding «Хто ти?»
export const ROLES = ['pupil', 'student', 'working', 'job-seeking', 'parent', 'other'] as const
export type Role = (typeof ROLES)[number]

// Onboarding «З чого почнемо?»: the course's placement test, or its first section.
export const START_MODES = ['placement', 'zero'] as const
export type StartMode = (typeof START_MODES)[number]
