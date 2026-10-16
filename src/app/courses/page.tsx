import type { Metadata } from 'next'
import { PiBooksFill } from 'react-icons/pi'
import { messages, t } from '@/i18n'
import { myLibrary } from '@/server/courses/library'
import { listCourses } from '@/server/courses/registry'
import { requireUser } from '@/server/auth'
import { CourseCard } from '@/ui/courses/CourseCard'
import { CourseChips } from '@/ui/courses/CourseChips'
import { courseChips } from '@/server/courses/library'

export const metadata: Metadata = { title: 'Курси' }

// Marketplace: every listed course (official now; user-uploaded later), with «Мої курси» on top.
export default async function CoursesPage() {
  await requireUser()
  const [courses, library] = await Promise.all([listCourses(), myLibrary()])
  const enrolled = new Map(library.map((c) => [c.id, c.enrollment]))
  const soon = messages().landing.courses.items
  return (
    <div className="page courses-page" data-width="wide">
      <header className="ghead">
        <span className="ghead-badge" data-tone="green" aria-hidden="true">
          <PiBooksFill size={38} />
        </span>
        <div className="ghead-text">
          <h1 className="ghead-title">{t('courses.title')}</h1>
          <p className="ghead-lead">{t('courses.lead')}</p>
        </div>
      </header>

      <h2 className="gsection-title">
        {t('courses.library')} <span className="gsection-count tabular">{library.length}</span>
      </h2>
      {library.length > 0 ? <CourseChips courses={courseChips(library)} next="/path" label={t('courses.library')} /> : <p className="empty-note">{t('courses.libraryEmpty')}</p>}

      <h2 className="gsection-title">
        {t('courses.catalog')} <span className="gsection-count tabular">{courses.length}</span>
      </h2>
      <div className="course-grid">
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} enrolled={enrolled.has(c.id)} active={enrolled.get(c.id)?.active ?? false} />
        ))}
      </div>

      <h2 className="gsection-title">{t('courses.soon')}</h2>
      <p className="ghead-lead courses-soon-lead">{t('courses.soonLead')}</p>
      <ul className="courses-soon">
        {soon.map((s) => (
          <li key={s.title} className="lu-card courses-soon-item" data-pad="sm">
            <span aria-hidden="true">{s.emoji}</span> {s.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
