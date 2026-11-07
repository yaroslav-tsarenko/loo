import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { PiArrowRightBold, PiCheckBold, PiFlaskFill, PiPlusBold } from 'react-icons/pi'
import { SECTION_FALLBACK_ICON, TEST_ICON } from '@/content/icons'
import { courseLevels, LEVEL_LABEL, levelShort } from '@/course'
import { contentLanguage, courseHreflangs, localizedCourse } from '@/course/i18n'
import { messages, translator } from '@/i18n'
import { langParam } from '@/server/content-i18n'
import { uiLocale } from '@/server/locale'
import { requireUser } from '@/server/auth'
import { enrollCourse, leaveCourse, setCourseLevel, switchCourse } from '@/server/actions/courses'
import { myEnrollments } from '@/server/courses/enrollment'
import { courseListing } from '@/server/courses/bundles'
import { getCourseEntry } from '@/server/courses/registry'
import { courseSkills } from '@/server/courses/skills'
import { SkillLevels } from '@/ui/courses/SkillLevels'
import { skillCard } from '@/ui/courses/skill-rows'
import { param } from '@/ui/auth/AuthShell'
import { Choice, ChoiceGroup } from '@/ui/auth/Choices'
import { Pill } from '@/ui/design/Badge'
import { Button } from '@/ui/design/Button'
import { GameIcon } from '@/ui/design/GameIcon'
import { Icon } from '@/ui/icons/Icon'
import { count } from '@/ui/format'

type Params = Promise<{ id: string }>

type Search = Promise<Record<string, string | string[] | undefined>>

// the course's texts in the UI locale (or ?lang=) when the course lists it (course.yaml `languages`)
async function courseLang(bundle: Parameters<typeof localizedCourse>[0], query: Record<string, string | string[] | undefined>): Promise<string | null> {
  return contentLanguage(bundle.course, langParam(query) ?? (await uiLocale()), courseHreflangs(bundle))
}

export async function generateMetadata({ params, searchParams }: { params: Params; searchParams: Search }): Promise<Metadata> {
  const [{ id }, query] = await Promise.all([params, searchParams])
  const entry = await getCourseEntry(id)
  if (!entry) return { title: translator(await uiLocale())('courses.course') }
  const texts = localizedCourse(entry.bundle, await courseLang(entry.bundle, query))
  // hreflang only for the languages the course page really has
  const langs = courseHreflangs(entry.bundle)
  const href = `/courses/${id}`
  const source = langs[0]!
  const languages = langs.length > 1 ? { ...Object.fromEntries(langs.map((l) => [l, l === source ? href : `${href}?lang=${l}`])), 'x-default': href } : null
  return { title: texts.title, ...(languages ? { alternates: { languages } } : {}) }
}

export default async function CoursePage({ params, searchParams }: { params: Params; searchParams: Search }) {
  await requireUser()
  const [{ id }, query, locale] = await Promise.all([params, searchParams, uiLocale()])
  const t = translator(locale)
  const entry = await getCourseEntry(id)
  if (!entry) notFound()
  const listing = courseListing(entry)
  const { bundle } = entry
  const meta = bundle.course
  const enrollment = (await myEnrollments()).find((e) => e.courseId === id) ?? null
  // language courses: per-skill levels + the exam band (course.yaml `exam:`; the stored estimate comes with the base rows, no extra query)
  const skills = await courseSkills(bundle, enrollment)
  const card = skills ? skillCard(bundle, skills.view, skills.levels, { answers: true }) : null
  const m = messages(locale)
  const texts = localizedCourse(bundle, await courseLang(bundle, query))
  const placementSection = enrollment?.placement ? bundle.sections[enrollment.placement.sectionIndex] : undefined
  const style = { '--course-c': meta.color ?? 'var(--lu-violet)' } as CSSProperties
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
          <Icon name={meta.icon ?? 'px:book'} size={72} />
        </span>
        <div className="course-hero-text">
          <p className="course-hero-eyebrow">
            {listing.source === 'official' ? t('courses.official') : meta.authors.map((a) => a.name).join(', ')} · {levelShort(listing.levels.from)} → {levelShort(listing.levels.to)}
          </p>
          <h1 className="course-hero-title">{texts.title}</h1>
          {texts.subtitle ? <p className="course-hero-sub">{texts.subtitle}</p> : null}
          <div className="course-hero-pills">
            {/* price / likes / comments: data hooks in CourseListing, filled once the marketplace has them */}
            <Pill tone="mint" solid size="sm">
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

      {skills && card ? (
        <SkillLevels
          rows={card.rows}
          overall={card.overall}
          exam={skills.view.exam}
          next={card.next}
          note={card.note}
        />
      ) : null}

      {texts.description ? <p className="course-desc">{texts.description}</p> : null}

      <h2 className="gsection-title">{t('courses.learn')}</h2>
      <ul className="course-learn">
        {path.map((s) => (
          <li key={s.id} className="course-learn-item">
            <span className="course-learn-icon" aria-hidden="true">
              <Icon name={s.icon ?? SECTION_FALLBACK_ICON} size={26} />
            </span>
            <span>
              <strong>{texts.section(s.key, s).title}</strong>
              {texts.section(s.key, s).description ? <span className="course-learn-desc">{texts.section(s.key, s).description}</span> : null}
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
                  <Icon name={s.icon ?? SECTION_FALLBACK_ICON} size={24} />
                </span>
                <span className="course-program-text">
                  <span className="course-program-title">
                    {s.kind === 'path' ? `${i + 1}. ` : ''}
                    {texts.section(s.key, s).title}
                    {s.kind === 'practice' ? (
                      <Pill size="sm" tone="orange">
                        {t('courses.practice')}
                      </Pill>
                    ) : null}
                  </span>
                  <span className="course-program-meta tabular">
                    {s.status === 'planned' ? `${t('courses.soonShort')} · ${LEVEL_LABEL[s.level]}` : `${locale === 'uk' ? count(s.topics.length, 'тема', 'теми', 'тем') : t('courses.topics', { n: s.topics.length })} · ${t('courses.hours', { n: Math.max(1, Math.round(s.minutes / 60)) })} · ${LEVEL_LABEL[s.minLevel]}`}
                    {s.minLevel !== s.level ? ` → ${LEVEL_LABEL[s.level]}` : ''}
                    {s.exam ? (
                      <>
                        {' · '}
                        <GameIcon name="crown" size={14} /> {t('courses.exam')}
                      </>
                    ) : null}
                  </span>
                </span>
              </summary>
              <ul className="course-program-topics">
                {s.topics.map((topic) => (
                  <li key={topic.id}>
                    <Icon name={topic.icon ?? 'px:book'} size={18} /> {topic.title}
                    <small className="tabular">
                      {' '}
                      · {t('courses.lessonsShort', { n: topic.lessons.length })}
                      {topic.test ? (
                        <>
                          {' · '}
                          <Icon name={TEST_ICON} size={14} label={t('courses.topicTest')} />
                        </>
                      ) : null}
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
              {courseLevels(meta).map((l) => (
                <Choice key={l} type="radio" name="level" value={l} defaultChecked={l === enrollment.level} required title={m.levels[l].title} sub={m.levels[l].body} />
              ))}
            </ChoiceGroup>
            {enrollment.placement && !enrollment.placement.skipped ? (
              <p className="choice-hint">
                <Icon name="px:testTube" size={18} /> {t('courses.level.placementDone', { level: LEVEL_LABEL[enrollment.placement.level as keyof typeof LEVEL_LABEL] ?? enrollment.placement.level, section: placementSection?.title ?? '—' })}</p>
            ) : null}
            {param(query, 'saved') ? (
              <p className="acct-note" role="status">
                <PiCheckBold aria-hidden="true" /> {t('courses.level.saved')}
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
