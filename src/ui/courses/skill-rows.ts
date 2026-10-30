import { courseLadder, LEVEL_LABEL, levelShort, nextSkillStep, skillTitle, weakestSkills, type CourseBundle, type Level, type SkillsView } from '@/course'
import { t } from '@/i18n'
import type { SkillLevelRow } from './SkillLevels'

// SkillsView (src/course/select/skills.ts) → the rows of <SkillLevels>. Language courses keep their compact look
// (CEFR ids, no bars); courses with declared skills get the skill titles, IT ranks, a bar per skill (θ on the
// ladder), the weakest skill marked and a «next step» line.

export interface SkillCard {
  rows: SkillLevelRow[]
  overall: string
  next: string | null
  note: string
}

// «Оновлюється після тестів…» (language: with the IELTS caveat); `answers` — show how many test answers it rests on.
function noteOf(language: boolean, view: SkillsView, answers: boolean): string {
  if (view.answers === 0) return t('skills.start')
  const base = language ? t('skills.note') : 'Оновлюється після кожного тесту теми й екзамену.'
  return answers ? `${base} · ${t('skills.answers', { n: view.answers })}` : base
}

export function skillCard(bundle: Pick<CourseBundle, 'course'>, view: SkillsView, levels: readonly Level[], opts: { answers?: boolean } = {}): SkillCard {
  const language = courseLadder(bundle.course) === 'cefr'
  const note = noteOf(language, view, opts.answers ?? false)
  if (language) return { rows: view.skills.map((v) => ({ skill: v.skill, level: v.level })), overall: view.overall, next: null, note }
  const weakest = view.skills.length > 1 ? weakestSkills(view, 1)[0] : undefined
  const spread = view.skills.some((s) => s.level !== view.skills[0]?.level)
  const rows = view.skills.map(
    (v): SkillLevelRow => ({
      skill: v.skill,
      label: skillTitle(bundle.course, v.skill),
      level: levelShort(v.level),
      ratio: Math.max(0, Math.min(1, v.theta / levels.length)),
      mark: spread && weakest?.skill === v.skill ? 'weak' : null,
    }),
  )
  const step = nextSkillStep(view, levels)
  const next = step ? `Наступний крок: «${skillTitle(bundle.course, step.skill)}» до ${LEVEL_LABEL[step.to]}` : null
  return { rows, overall: levelShort(view.overall), next, note }
}
