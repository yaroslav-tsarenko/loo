import 'server-only'
import { courseLevels, type Level } from '@/course'
import type { CourseChip } from '@/ui/courses/CourseChips'
import { courseLevelOf, myEnrollments, type Enrollment } from './enrollment'
import { getCourseEntry } from './registry'

export interface LibraryCourse {
  enrollment: Enrollment
  id: string
  title: string
  subtitle: string | null
  icon: string | null
  color: string | null
  // the course's ladder (noob…god or A1…C2), for level pickers
  levels: Level[]
}

// «Мої курси»: enrolled courses that still exist, most recently opened first, active one first.
export async function myLibrary(): Promise<LibraryCourse[]> {
  return libraryFrom(await myEnrollments())
}

// The library from enrollment rows read elsewhere (the shell reads them with the rest: src/server/shell.ts).
export async function libraryFrom(rows: readonly Enrollment[]): Promise<LibraryCourse[]> {
  const out: LibraryCourse[] = []
  for (const enrollment of rows) {
    const entry = await getCourseEntry(enrollment.courseId)
    if (!entry) continue
    const meta = entry.bundle.course
    out.push({ enrollment: { ...enrollment, level: courseLevelOf(enrollment.level, meta) }, id: meta.id, title: meta.title, subtitle: meta.subtitle, icon: meta.icon, color: meta.color, levels: courseLevels(meta) })
  }
  return out.sort((a, b) => Number(b.enrollment.active) - Number(a.enrollment.active))
}

export function courseChips(library: readonly LibraryCourse[]): CourseChip[] {
  return library.map((c) => ({ id: c.id, title: c.title, icon: c.icon, active: c.enrollment.active }))
}
