import Link from 'next/link'
import type { CSSProperties } from 'react'
import { PiArrowRightBold, PiCheckCircleFill, PiClockFill, PiPlusBold, PiStackFill } from 'react-icons/pi'
import { levelShort } from '@/course'
import { enrollCourse, switchCourse } from '@/server/actions/courses'
import type { CourseListing } from '@/server/courses/registry'
import { Pill } from '@/ui/design/Badge'
import { Button } from '@/ui/design/Button'
import { Icon } from '@/ui/icons/Icon'
import { count } from '@/ui/format'

export interface CourseCardProps {
  course: CourseListing
  enrolled: boolean
  active: boolean
}

// Marketplace card: a cover washed with the course colour and the course icon, level range, hours, sections; enroll / open CTA.
export function CourseCard({ course, enrolled, active }: CourseCardProps) {
  const { meta, stats } = course
  const style = { '--course-c': meta.color ?? 'var(--lu-violet)' } as CSSProperties
  const paths = course.sections.filter((s) => s.kind === 'path').length
  return (
    <article className="course-card lu-card" data-variant="raised" style={style}>
      <Link href={`/courses/${course.id}`} className="course-card-cover" aria-label={`${meta.title} — сторінка курсу`}>
        <span className="course-card-icon" aria-hidden="true">
          <Icon name={meta.icon ?? 'px:book'} size={56} />
        </span>
        {enrolled ? (
          <span className="course-card-badge">
            <PiCheckCircleFill aria-hidden="true" /> {active ? 'Активний' : 'У бібліотеці'}
          </span>
        ) : null}
      </Link>
      <div className="course-card-body">
        <h3 className="course-card-title">
          <Link href={`/courses/${course.id}`}>{meta.title}</Link>
        </h3>
        {meta.subtitle ? <p className="course-card-sub">{meta.subtitle}</p> : null}
        <div className="course-card-pills">
          <Pill size="sm" tone="purple">
            {levelShort(course.levels.from)} → {levelShort(course.levels.to)}
          </Pill>
          <Pill size="sm" tone="blue" icon={<PiClockFill />}>
            ~{Math.round(meta.estimatedHours)} год
          </Pill>
          <Pill size="sm" tone="mint" icon={<PiStackFill />}>
            {count(paths, 'розділ', 'розділи', 'розділів')}
          </Pill>
        </div>
        <p className="course-card-meta tabular">
          {count(stats.topics, 'тема', 'теми', 'тем')} · {count(stats.lessons, 'урок', 'уроки', 'уроків')} · {count(stats.tasks, 'задача', 'задачі', 'задач')}
        </p>
        <div className="course-card-actions">
          {active ? (
            <Button href="/path" block iconEnd={<PiArrowRightBold size={18} />}>
              Продовжити
            </Button>
          ) : enrolled ? (
            <form action={switchCourse}>
              <input type="hidden" name="course" value={course.id} />
              <Button type="submit" block iconEnd={<PiArrowRightBold size={18} />}>
                Відкрити
              </Button>
            </form>
          ) : (
            <form action={enrollCourse}>
              <input type="hidden" name="course" value={course.id} />
              <Button type="submit" block icon={<PiPlusBold size={18} />}>
                Додати в бібліотеку
              </Button>
            </form>
          )}
        </div>
      </div>
    </article>
  )
}
