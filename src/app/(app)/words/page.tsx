import type { Metadata } from 'next'
import { LangPracticePage } from '@/ui/lang/PracticePage'

export const metadata: Metadata = { title: 'Слова' }

// Practice section «Слова» of language courses (docs/COURSE_FORMAT.md §2.1), scoped to the active course.
export default async function WordsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <LangPracticePage section="words" params={await searchParams} />
}
