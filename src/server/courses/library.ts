import 'server-only'
import type { CourseChip } from '@/ui/courses/CourseChips'
import { myEnrollments, type Enrollment } from './enrollment'
import { getCourseEntry } from './registry'

export interface LibraryCourse {
  enrollment: Enrollment
  id: string
  title: string
  subtitle: string | null
  icon: string | null
  color: string | null
}

// «Мої курси»: enrolled courses that still exist, most recently opened first, active one first.
export async function myLibrary(): Promise<LibraryCourse[]> {
  const rows = await myEnrollments()
  const out: LibraryCourse[] = []
  for (const enrollment of rows) {
    const entry = await getCourseEntry(enrollment.courseId)
    if (!entry) continue
    const meta = entry.bundle.course
    out.push({ enrollment, id: meta.id, title: meta.title, subtitle: meta.subtitle, icon: meta.icon, color: meta.color })
  }
  return out.sort((a, b) => Number(b.enrollment.active) - Number(a.enrollment.active))
}

export function courseChips(library: readonly LibraryCourse[]): CourseChip[] {
  return library.map((c) => ({ id: c.id, title: c.title, icon: c.icon, active: c.enrollment.active }))
}
