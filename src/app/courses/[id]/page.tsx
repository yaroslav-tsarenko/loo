import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { PiArrowRightBold, PiFlaskFill, PiPlusBold } from 'react-icons/pi'
import { LEVEL_LABEL, LEVELS } from '@/course'
import { messages, t } from '@/i18n'
import { requireUser } from '@/server/auth'
import { enrollCourse, leaveCourse, setCourseLevel, switchCourse } from '@/server/actions/courses'
import { myEnrollments } from '@/server/courses/enrollment'
import { courseListing } from '@/server/courses/bundles'
import { getCourseEntry } from '@/server/courses/registry'
import { param } from '@/ui/auth/AuthShell'
import { Choice, ChoiceGroup } from '@/ui/auth/Choices'
import { Pill } from '@/ui/design/Badge'
import { Button } from '@/ui/design/Button'
import { Icon } from '@/ui/icons/Icon'
import { count } from '@/ui/format'

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const entry = await getCourseEntry((await params).id)
  return { title: entry?.bundle.course.title ?? 'Курс' }
}

export default async function CoursePage({ params, searchParams }: { params: Params; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireUser()
  const [{ id }, query] = await Promise.all([params, searchParams])
  const entry = await getCourseEntry(id)
  if (!entry) notFound()
  const listing = courseListing(entry)
  const { bundle } = entry
  const meta = bundle.course
  const enrollment = (await myEnrollments()).find((e) => e.courseId === id) ?? null
  const m = messages()
  const placementSection = enrollment?.placement ? bundle.sections[enrollment.placement.sectionIndex] : undefined
  const style = { '--course-c': meta.color ?? 'var(--lu-green)' } as CSSProperties
  const path = bundle.sections.filter((s) => s.kind === 'path')
  const stats: Array<[number, string]> = [
    [Math.round(meta.estimatedHours), t('courses.stats.hours')],
    [path.length, t('courses.stats.sections')],
    [bundle.stats.topics, t('courses.stats.topics')],
    [bundle.stats.lessons, t('courses.stats.lessons')],
    [bundle.stats.exercises, t('courses.stats.exercises')],
    [bundle.stats.autoTestedTasks, t('courses.stats.tasks')],
  ]
  return (
    <div className="page course-page" data-width="wide" style={style}>
      <section className="course-hero">
        <span className="course-hero-icon" aria-hidden="true">
          <Icon name={meta.icon ?? '📘'} size={72} />
        </span>
        <div className="course-hero-text">
          <p className="course-hero-eyebrow">
            {listing.source === 'official' ? t('courses.official') : meta.authors.map((a) => a.name).join(', ')} · {LEVEL_LABEL[listing.levels.from]} → {LEVEL_LABEL[listing.levels.to]}
          </p>
          <h1 className="course-hero-title">{meta.title}</h1>
          {meta.subtitle ? <p className="course-hero-sub">{meta.subtitle}</p> : null}
          <div className="course-hero-pills">
            {/* price / likes / comments: data hooks in CourseListing, filled once the marketplace has them */}
            <Pill tone="green" solid size="sm">
              {listing.price ? `${listing.price.amount} ${listing.price.currency}` : t('courses.free')}
            </Pill>
            {meta.tags.slice(0, 5).map((tag) => (
              <Pill key={tag} size="sm">
                #{tag}
              </Pill>
            ))}
          </div>
          <div className="course-hero-cta">
            {enrollment?.active ? (
              <Button href="/path" size="lg" iconEnd={<PiArrowRightBold size={20} />}>
                {t('courses.continue')}
              </Button>
            ) : enrollment ? (
              <form action={switchCourse}>
                <input type="hidden" name="course" value={id} />
                <Button type="submit" size="lg" iconEnd={<PiArrowRightBold size={20} />}>
                  {t('courses.open')}
                </Button>
              </form>
            ) : (
              <form action={enrollCourse}>
                <input type="hidden" name="course" value={id} />
                <Button type="submit" size="lg" icon={<PiPlusBold size={20} />}>
                  {t('courses.enroll')}
                </Button>
              </form>
            )}
            {bundle.placement.enabled ? (
              <Button href={`/placement?course=${id}`} variant="secondary" size="lg" icon={<PiFlaskFill size={20} />}>
                {t('courses.level.placement')}
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <dl className="course-facts">
        {stats.map(([value, label]) => (
          <div key={label} className="course-fact">
            <dd className="tabular">{value}</dd>
            <dt>{label}</dt>
          </div>
        ))}
      </dl>

      {meta.description ? <p className="course-desc">{meta.description}</p> : null}

      <h2 className="gsection-title">{t('courses.learn')}</h2>
      <ul className="course-learn">
        {path.map((s) => (
          <li key={s.id} className="course-learn-item">
            <span className="course-learn-icon" aria-hidden="true">
              <Icon name={s.icon ?? '📍'} size={26} />
            </span>
            <span>
              <strong>{s.title}</strong>
              {s.description ? <span className="course-learn-desc">{s.description}</span> : null}
            </span>
          </li>
        ))}
      </ul>

      <h2 className="gsection-title">{t('courses.program')}</h2>
      <ol className="course-program">
        {bundle.sections.map((s, i) => (
          <li key={s.id} className="lu-card course-program-item" data-pad="sm">
            <details>
              <summary>
                <span className="course-program-icon" aria-hidden="true">
                  <Icon name={s.icon ?? '📍'} size={24} />
                </span>
                <span className="course-program-text">
                  <span className="course-program-title">
                    {s.kind === 'path' ? `${i + 1}. ` : ''}
                    {s.title}
                    {s.kind === 'practice' ? (
                      <Pill size="sm" tone="orange">
                        {t('courses.practice')}
                      </Pill>
                    ) : null}
                  </span>
                  <span className="course-program-meta tabular">
                    {count(s.topics.length, 'тема', 'теми', 'тем')} · ~{Math.max(1, Math.round(s.minutes / 60))} год · {LEVEL_LABEL[s.minLevel]}
                    {s.minLevel !== s.level ? ` → ${LEVEL_LABEL[s.level]}` : ''}
                    {s.exam ? ' · 👑 екзамен' : ''}
                  </span>
                </span>
              </summary>
              <ul className="course-program-topics">
                {s.topics.map((topic) => (
                  <li key={topic.id}>
                    <Icon name={topic.icon ?? '•'} size={18} /> {topic.title}
                    <small className="tabular">
                      {' '}
                      · {topic.lessons.length} ур.{topic.test ? ' · 🏁' : ''}
                    </small>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ol>

      {enrollment ? (
        <section id="level" className="lu-card course-level" data-pad="lg">
          <form action={setCourseLevel}>
            <input type="hidden" name="course" value={id} />
            <input type="hidden" name="next" value={`/courses/${id}?saved=1#level`} />
            <ChoiceGroup legend={t('courses.level.title')} hint={t('courses.level.hint')} wide>
              {LEVELS.map((l) => (
                <Choice key={l} type="radio" name="level" value={l} defaultChecked={l === enrollment.level} required title={m.levels[l].title} sub={m.levels[l].body} />
              ))}
            </ChoiceGroup>
            {enrollment.placement && !enrollment.placement.skipped ? (
              <p className="choice-hint">🧪 {t('courses.level.placementDone', { level: LEVEL_LABEL[enrollment.placement.level as keyof typeof LEVEL_LABEL] ?? enrollment.placement.level, section: placementSection?.title ?? '—' })}</p>
            ) : null}
            {param(query, 'saved') ? (
              <p className="acct-note" role="status">
                {t('courses.level.saved')}
              </p>
            ) : null}
            <div className="course-level-actions">
              <Button type="submit">{t('courses.level.save')}</Button>
            </div>
          </form>
          <form action={leaveCourse} className="course-leave">
            <input type="hidden" name="course" value={id} />
            <Button type="submit" variant="ghost" size="sm">
              {t('courses.leave')}
            </Button>
            <span className="choice-hint">{t('courses.leaveHint')}</span>
          </form>
        </section>
      ) : null}
    </div>
  )
}
