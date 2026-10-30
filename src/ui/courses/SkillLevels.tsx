import { PiTargetBold, PiTrendDownBold, PiTrendUpBold } from 'react-icons/pi'
import { t } from '@/i18n'
import { Pill } from '@/ui/design/Badge'

// Per-skill levels of a language course (docs/LANGUAGE_COURSE.md «Рівень за навичками»): a compact Loo Pixel-soft card
// for the course page, the profile and the topic-test summary. Pure props, renders on the server and the client.

export type SkillId = 'grammar' | 'vocabulary' | 'reading' | 'listening' | 'pronunciation'

export interface SkillLevelRow {
  skill: SkillId
  level: string
  // test summary: the level before this test
  before?: string
  trend?: 'up' | 'down' | null
}

export interface SkillLevelsProps {
  rows: SkillLevelRow[]
  overall: string
  // the course's exam band (course.yaml `exam:`): «IELTS ~5.5–6.5»; null — no exam line
  exam: { exam: string; label: string } | null
  // under the list: «оновлюється після тестів» / «оновлено за цим тестом»
  note?: string | null
  title?: string
  // no card frame (inside another card)
  bare?: boolean
}

export function SkillLevels({ rows, overall, exam, note, title = t('skills.title'), bare = false }: SkillLevelsProps) {
  return (
    <section className={bare ? 'skill-levels' : 'skill-levels lu-card'} data-pad="sm" aria-label={title}>
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
          <li key={r.skill} data-trend={r.trend ?? undefined}>
            <span className="skill-levels-name">{t(`skills.skill.${r.skill}`)}</span>
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
          </li>
        ))}
      </ul>
      {note ? <p className="skill-levels-note">{note}</p> : null}
    </section>
  )
}

// «Оновлюється після кожного тесту…» + «IELTS — лише орієнтир…» when the course has an exam
export function skillsNote(exam: { exam: string } | null): string {
  return exam ? `${t('skills.note')} ${t('skills.examNote', { exam: exam.exam })}` : t('skills.note')
}
