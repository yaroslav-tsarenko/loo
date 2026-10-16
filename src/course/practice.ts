// No zod here: the client shell imports it (zod schemas — ./schema/practice.ts).
// What kind of course this is and which practice sections it offers (docs/COURSE_FORMAT.md §2.1).
// The shell (sidebar «Практика», mobile tabs) renders a course's sections from this data; the UI registry
// src/ui/shell/course-nav.ts maps every section id to a label, icon, route and badge. A new kind or section is a
// new entry here + there, never a new code path in the shell.

export const COURSE_KINDS = ['programming', 'language', 'general'] as const
export type CourseKind = (typeof COURSE_KINDS)[number]

export const PRACTICE_SECTIONS = [
  // every course
  'path',
  'cards',
  'tests',
  'mistakes',
  // programming
  'tasks',
  'roadmap',
  // language
  'words',
  'listening',
  'pronunciation',
  'grammar',
] as const
export type PracticeSectionId = (typeof PRACTICE_SECTIONS)[number]

// Default sections (and their order) when course.yaml has no `practice:`.
export const DEFAULT_PRACTICE: Record<CourseKind, readonly PracticeSectionId[]> = {
  programming: ['path', 'cards', 'tests', 'tasks', 'mistakes', 'roadmap'],
  language: ['path', 'words', 'listening', 'pronunciation', 'grammar', 'mistakes'],
  general: ['path', 'cards', 'tests', 'mistakes'],
}

export type PracticeExerciseKind = 'quiz' | 'flashcard' | 'interview' | 'task' | 'word' | 'listen' | 'speak' | 'pair'

// Exercise kinds a section draws from (course:check warns when the course has none of them).
export const PRACTICE_NEEDS: Partial<Record<PracticeSectionId, readonly PracticeExerciseKind[]>> = {
  cards: ['flashcard', 'interview'],
  words: ['word'],
  tests: ['quiz'],
  grammar: ['quiz'],
  tasks: ['task'],
  listening: ['listen'],
  pronunciation: ['speak', 'pair'],
}

export function kindForSubject(subject: string | null | undefined): CourseKind {
  if (subject === 'programming') return 'programming'
  if (subject === 'language') return 'language'
  return 'general'
}

// Declared order, duplicates and unknown ids dropped; `path` (the course spine) is always there, first.
export function resolvePractice(kind: CourseKind, declared?: readonly string[] | null): PracticeSectionId[] {
  const known = new Set<string>(PRACTICE_SECTIONS)
  const list = (declared && declared.length > 0 ? declared : DEFAULT_PRACTICE[kind]).filter((id): id is PracticeSectionId => known.has(id))
  const out = [...new Set(list)].filter((id) => id !== 'path')
  return ['path', ...out]
}

interface MetaLike {
  subject: string
  kind?: CourseKind | null
  practice?: readonly string[] | null
}

// Bundles compiled before `kind` / `practice` existed resolve from `subject`.
export function courseKind(meta: MetaLike): CourseKind {
  return meta.kind ?? kindForSubject(meta.subject)
}

export function coursePractice(meta: MetaLike): PracticeSectionId[] {
  return resolvePractice(courseKind(meta), meta.practice)
}

// Guides shown in the sidebar «Теорія» of a course: declared `theory` or, by default, the guides its sections use.
export function courseTheory(bundle: { theory?: readonly string[] | null; sections: readonly { guideId: string }[] }): string[] {
  if (bundle.theory && bundle.theory.length > 0) return [...new Set(bundle.theory)]
  return [...new Set(bundle.sections.map((s) => s.guideId))]
}
