import { PiTargetBold, PiTrendDownBold, PiTrendUpBold } from 'react-icons/pi'
import { t } from '@/i18n'
import { Pill } from '@/ui/design/Badge'
import { Icon } from '@/ui/icons/Icon'

// Per-skill levels of a course with a skill model (docs/LANGUAGE_COURSE.md «Рівень за навичками», COURSE_FORMAT §5):
// a compact Loo Pixel-soft card for the course page, the profile, the topic-test summary and the placement result.
// N skills, labels from the bundle (course.skills titles); a bar per skill when the caller gives its position on the
// ladder; an optional «next step» line. Pure props, renders on the server and the client.

// The language skills keep their translated labels when the caller passes no label.
const LANGUAGE_SKILLS = ['grammar', 'vocabulary', 'reading', 'listening', 'pronunciation'] as const
type LanguageSkill = (typeof LANGUAGE_SKILLS)[number]
const isLanguageSkill = (id: string): id is LanguageSkill => (LANGUAGE_SKILLS as readonly string[]).includes(id)

export function skillLabel(id: string, label?: string | null): string {
  if (label) return label
  return isLanguageSkill(id) ? t(`skills.skill.${id}`) : id
}

export interface SkillLevelRow {
  skill: string
  // the skill's title (course.skills); absent → the language label or the id
  label?: string
  level: string
  // test summary: the level before this test
  before?: string
  trend?: 'up' | 'down' | null
  // position on the course ladder, 0…1 (θ / number of levels): drawn as a bar
  ratio?: number
  // weakest / strongest skills (placement result, profile)
  mark?: 'strong' | 'weak' | null
}

export interface SkillLevelsProps {
  rows: SkillLevelRow[]
  overall: string
  // the course's exam band (course.yaml `exam:`): «IELTS ~5.5–6.5»; null — no exam line
  exam: { exam: string; label: string } | null
  // under the list: «оновлюється після тестів» / «оновлено за цим тестом»
  note?: string | null
  // «Наступний крок: …» (courses with skills)
  next?: string | null
  title?: string
  // no card frame (inside another card)
  bare?: boolean
}

export function SkillLevels({ rows, overall, exam, note, next, title = t('skills.title'), bare = false }: SkillLevelsProps) {
  const bars = rows.some((r) => r.ratio !== undefined)
  return (
    <section className={bare ? 'skill-levels' : 'skill-levels lu-card'} data-pad="sm" data-bars={bars ? '' : undefined} aria-label={title}>
      <header className="skill-levels-head">
        <h3 className="skill-levels-title">{title}</h3>
        <span className="skill-levels-pills">
          <Pill size="sm" tone="violet">
            {t('skills.overall', { level: overall })}
          </Pill>
          {exam ? (
            <Pill size="sm" tone="blue" icon={<PiTargetBold />}>
              {t('skills.exam', { exam: exam.exam, band: exam.label })}
            </Pill>
          ) : null}
        </span>
      </header>
      <ul className="skill-levels-list">
        {rows.map((r) => (
          <li key={r.skill} data-trend={r.trend ?? undefined} data-mark={r.mark ?? undefined}>
            <span className="skill-levels-name">{skillLabel(r.skill, r.label)}</span>
            <span className="skill-levels-level tabular">
              {r.before && r.before !== r.level ? (
                <>
                  <s>{r.before}</s> {r.level}
                </>
              ) : (
                r.level
              )}
              {r.trend === 'up' ? <PiTrendUpBold aria-label={t('skills.up')} /> : r.trend === 'down' ? <PiTrendDownBold aria-label={t('skills.down')} /> : null}
            </span>
            {r.ratio !== undefined ? (
              <span className="skill-levels-bar" aria-hidden="true">
                <i style={{ width: `${Math.round(Math.max(0.04, Math.min(1, r.ratio)) * 100)}%` }} />
              </span>
            ) : null}
          </li>
        ))}
      </ul>
      {next ? (
        <p className="skill-levels-next">
          <Icon name="px:target" size={18} /> {next}
        </p>
      ) : null}
      {note ? <p className="skill-levels-note">{note}</p> : null}
    </section>
  )
}

// «Оновлюється після кожного тесту…» + «IELTS — лише орієнтир…» when the course has an exam
export function skillsNote(exam: { exam: string } | null): string {
  return exam ? `${t('skills.note')} ${t('skills.examNote', { exam: exam.exam })}` : t('skills.note')
}
