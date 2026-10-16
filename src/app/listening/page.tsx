import type { Metadata } from 'next'
import { LangPracticePage } from '@/ui/lang/PracticePage'

export const metadata: Metadata = { title: 'Аудіювання' }

// Practice section «Аудіювання» of language courses (docs/COURSE_FORMAT.md §2.1), scoped to the active course.
export default async function ListeningPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <LangPracticePage section="listening" params={await searchParams} />
}
