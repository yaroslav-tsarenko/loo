import type { Metadata } from 'next'
import { LangPracticePage } from '@/ui/lang/PracticePage'

export const metadata: Metadata = { title: 'Граматика й тести' }

// Practice section «Граматика й тести» of language courses (docs/COURSE_FORMAT.md §2.1), scoped to the active course.
export default async function GrammarPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <LangPracticePage section="grammar" params={await searchParams} />
}
