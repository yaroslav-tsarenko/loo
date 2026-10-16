import Link from 'next/link'
import { PiPlusBold } from 'react-icons/pi'
import { switchCourse } from '@/server/actions/courses'
import { Icon } from '@/ui/icons/Icon'

export interface CourseChip {
  id: string
  title: string
  icon: string | null
  active: boolean
}

// «Мої курси» switcher: one chip per enrolled course (a tiny form → switchCourse), plus the catalogue.
export function CourseChips({ courses, next = '/path', label = 'Мої курси' }: { courses: CourseChip[]; next?: string; label?: string }) {
  return (
    <nav className="gchips cp-chips" aria-label={label}>
      {courses.map((c) =>
        c.active ? (
          <span key={c.id} className="gchip" aria-current="page">
            <Icon name={c.icon ?? 'px:book'} size={18} /> {c.title}
          </span>
        ) : (
          <form key={c.id} action={switchCourse} className="cp-chip-form">
            <input type="hidden" name="course" value={c.id} />
            <input type="hidden" name="next" value={next} />
            <button type="submit" className="gchip">
              <Icon name={c.icon ?? 'px:book'} size={18} /> {c.title}
            </button>
          </form>
        ),
      )}
      <Link href="/courses" className="gchip">
        <PiPlusBold aria-hidden="true" /> Курси
      </Link>
    </nav>
  )
}
