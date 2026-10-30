import { ladderOf, type CourseExam, type Level } from '../schema'

// The approximate band of the course's external exam for a CEFR level (course.yaml `exam:`, schema/exam.ts):
// English → IELTS (Cambridge / British Council CEFR ↔ IELTS alignment), German → Goethe-Zertifikat, … Only an
// orientation: those exams also score writing and speaking, which placement and topic tests don't measure.

export interface ExamBand {
  // the exam's name: «IELTS»
  exam: string
  // «5.5–6.5» or «нижче 4.0»; extra labels appended as « · TestDaF TDN 4»
  label: string
}

// null: the course has no exam, the level isn't on the CEFR ladder, or it has no band and no `below` text
export function examBand(exam: CourseExam | null | undefined, level: Level): ExamBand | null {
  if (!exam || ladderOf(level) !== 'cefr') return null
  const cefr = level as keyof CourseExam['bands']
  const base = exam.bands[cefr] ?? exam.below
  if (!base) return null
  const also = exam.also?.[cefr]
  return { exam: exam.name, label: also ? `${base} · ${also}` : base }
}
