import type { Metadata } from 'next'
import { LangPracticePage } from '@/ui/lang/PracticePage'

export const metadata: Metadata = { title: 'Вимова' }

// Practice section «Вимова» of language courses (docs/COURSE_FORMAT.md §2.1), scoped to the active course.
export default async function PronunciationPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <LangPracticePage section="pronunciation" params={await searchParams} />
}
