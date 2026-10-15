// Onboarding / profile choices. Pure constants shared by the forms and the actions' validation.

export const GOALS = ['job', 'grow', 'school', 'fun'] as const
export type Goal = (typeof GOALS)[number]

export const MINUTES = [5, 10, 15, 20, 30] as const

// Self-assessed level; the course engine maps it (or a placement test, /placement) to an enrollment level.
export const LEVELS = ['noob', 'junior', 'middle', 'senior', 'god'] as const
export type SelfLevel = (typeof LEVELS)[number]

export const INTERESTS = ['javascript', 'typescript', 'react', 'node', 'browser', 'algorithms', 'system-design', 'interview', 'security', 'english'] as const
export type Interest = (typeof INTERESTS)[number]
