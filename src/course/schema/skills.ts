import { z } from 'zod'
import { courseLadder, type Level } from './level'

// Learner skills as course data (docs/NEXTJS_SYLLABUS.md §7, docs/COURSE_FORMAT.md §2 `skills`).
// A course with skills has a «skill model»: every exercise trains one skill, the learner has a level per skill
// (src/course/select/skills.ts), the placement test can measure them one by one (`placement.perSkill`) and the path
// marks topics below the learner's skill level as known (src/course/select/path.ts).
// * language courses without `skills:` — the five skills below (the placement bank measures four of them);
// * programming / general courses without `skills:` — no skill model (the JavaScript course works as before).

export const SKILL_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const SkillDefSchema = z.object({
  id: z.string().regex(SKILL_ID, 'id навички: [a-z0-9-]').max(40),
  title: z.string().min(1).max(60),
  description: z.string().max(300).optional(),
  icon: z.string().min(1).optional(),
})
export type SkillDef = z.infer<typeof SkillDefSchema>

// Skills of a language learner: the four the placement bank measures plus pronunciation ([!speak] / [!pair]).
// Every exercise of a language course trains one of them (src/course/compile/difficulty.ts → exerciseSkill).
export const LEARNER_SKILLS = ['grammar', 'vocabulary', 'reading', 'listening', 'pronunciation'] as const
export const LearnerSkillSchema = z.enum(LEARNER_SKILLS)
export type LearnerSkill = z.infer<typeof LearnerSkillSchema>

// Skills a language placement bank measures (docs/LANGUAGE_COURSE.md «Банк вступного тесту»).
export const PLACEMENT_SKILLS = ['grammar', 'vocabulary', 'reading', 'listening'] as const
export const PlacementSkillSchema = z.enum(PLACEMENT_SKILLS)
export type PlacementSkill = z.infer<typeof PlacementSkillSchema>

// The default skill model per course kind: `learner` — what the learner gets a level in, `placement` — what the
// placement bank measures (and the overall level averages). Titles are the ones the UI always showed.
export const DEFAULT_SKILLS = {
  language: {
    learner: [
      { id: 'grammar', title: 'Граматика' },
      { id: 'vocabulary', title: 'Лексика' },
      { id: 'reading', title: 'Читання' },
      { id: 'listening', title: 'Аудіювання' },
      { id: 'pronunciation', title: 'Вимова' },
    ] satisfies SkillDef[],
    placement: [...PLACEMENT_SKILLS] as string[],
  },
} as const

// What the skill helpers need of a course (the bundle's `course`, or the manifest).
export interface SkillCourse {
  kind?: string | null
  subject?: string | null
  levels?: readonly Level[] | null
  skills?: readonly SkillDef[] | null
}

const isLanguage = (course: SkillCourse): boolean => courseLadder(course) === 'cefr'

// The course's skills, in course order: declared ones, the language defaults, or none.
export function courseSkills(course: SkillCourse): SkillDef[] {
  if (course.skills && course.skills.length > 0) return [...course.skills]
  return isLanguage(course) ? [...DEFAULT_SKILLS.language.learner] : []
}

export const courseSkillIds = (course: SkillCourse): string[] => courseSkills(course).map((s) => s.id)

// The course has a skill model (per-skill levels, per-skill placement, known topics).
export const hasSkillModel = (bundle: { course: SkillCourse }): boolean => courseSkills(bundle.course).length > 0

// Skills the placement bank measures and the overall level averages: the language four, `placement.skills`, or all.
export function placementSkillIds(bundle: { course: SkillCourse; placement?: { skills?: readonly string[] | null } | null }): string[] {
  const own = bundle.placement?.skills
  if (own && own.length > 0) return [...own]
  if (isLanguage(bundle.course)) return [...DEFAULT_SKILLS.language.placement]
  return courseSkillIds(bundle.course)
}

// The skill model used by the estimate (src/course/select/skills.ts): all skills, and those the overall level averages.
export interface SkillModel {
  skills: readonly string[]
  overall: readonly string[]
}

export const LANGUAGE_SKILL_MODEL: SkillModel = { skills: LEARNER_SKILLS, overall: PLACEMENT_SKILLS }

export function skillModelOf(bundle: { course: SkillCourse; placement?: { skills?: readonly string[] | null } | null }): SkillModel {
  const skills = courseSkillIds(bundle.course)
  const overall = placementSkillIds(bundle).filter((s) => skills.includes(s))
  return { skills, overall: overall.length > 0 ? overall : skills }
}

export function skillTitle(course: SkillCourse, id: string): string {
  return courseSkills(course).find((s) => s.id === id)?.title ?? id
}
