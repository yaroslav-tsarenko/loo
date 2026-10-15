import { compileCourseDetailed, MIN_AUTO_QUESTIONS } from '../compile/compile'
import type { CourseSource } from '../compile/source'
import { iconExists, type IconCatalog } from '../icons'
import type { CourseIssue } from '../issues'
import { LEVELS, parseCourseManifest, parseCourseYaml, type CourseBundle, type CourseManifest, type Topic } from '../schema'

// COURSE_FORMAT §7: schema, guides and ranges, unique ids, icons, §4 minimums (warnings), exercise levels,
// test/exam/placement pools, plus the content parser's own issues for the chapters the course uses.
// Task self-tests need a sandbox and live in scripts/ (scripts/lib/task-check.ts).

export interface ValidateOptions {
  // known library icons; without it only the icon syntax is checked
  icons?: IconCatalog
  // [!viz] + [!figure] count per chapter id; without it the illustration minimum is skipped
  figures?: ReadonlyMap<string, number>
}

export interface CourseCheck {
  manifest: CourseManifest | null
  bundle: CourseBundle | null
  issues: CourseIssue[]
}

export const MINIMUMS = { quizzes: 6, flashcards: 6, tasks: 2, reels: 3, figures: 1 } as const

function minimumIssues(topic: Topic, bundle: CourseBundle, opts: ValidateOptions): CourseIssue | null {
  const kinds = topic.exercises.map((id) => bundle.exercises[id]!.kind)
  const count = (k: string) => kinds.filter((x) => x === k).length
  const short: string[] = []
  const need = (have: number, min: number, label: string) => {
    if (have < min) short.push(`${label} ${have}/${min}`)
  }
  need(count('quiz'), MINIMUMS.quizzes, 'тести')
  need(count('flashcard'), MINIMUMS.flashcards, 'картки')
  if (bundle.course.subject === 'programming') need(count('task'), MINIMUMS.tasks, 'задачі')
  need(topic.reels.length, MINIMUMS.reels, 'фішки')
  const figures = opts.figures?.get(topic.chapterId)
  if (figures !== undefined) need(figures, MINIMUMS.figures, 'ілюстрації')
  return short.length > 0 ? { severity: 'warning', code: 'minimum', where: topic.id, message: `«${topic.title}»: мало вправ — ${short.join(', ')}` } : null
}

export function checkCourse(input: unknown, source: CourseSource, opts: ValidateOptions = {}): CourseCheck {
  const parsed = typeof input === 'string' ? parseCourseYaml(input) : parseCourseManifest(input)
  if (!parsed.manifest) return { manifest: null, bundle: null, issues: parsed.errors.map((message) => ({ severity: 'error', code: 'schema', message })) }
  const manifest = parsed.manifest
  const { bundle, issues, chapterIds } = compileCourseDetailed(manifest, source)

  const icon = (ref: string | null | undefined, where: string) => {
    if (ref && !iconExists(ref, opts.icons)) issues.push({ severity: 'error', code: 'unknown-icon', where, message: `Невідома іконка «${ref}» (${where})` })
  }
  icon(manifest.icon, 'course.yaml')
  for (const s of manifest.sections) icon(s.icon, `sections.${s.id}`)

  for (const section of bundle.sections) {
    for (const topic of section.topics) {
      icon(topic.icon, topic.id)
      if (section.kind === 'path') {
        const short = minimumIssues(topic, bundle, opts)
        if (short) issues.push(short)
      }
      const unleveled = topic.exercises.filter((id) => {
        const src = bundle.exercises[id]!.levelSource
        return src === 'topic' || src === 'default'
      })
      if (unleveled.length > 0) {
        issues.push({ severity: 'warning', code: 'no-level', where: topic.id, message: `«${topic.title}»: ${unleveled.length} вправ без рівня (взято рівень теми): ${unleveled.slice(0, 3).join(', ')}${unleveled.length > 3 ? '…' : ''}` })
      }
      if (topic.test && topic.test.pool.length < Math.min(MIN_AUTO_QUESTIONS, bundle.exams.topic.questions)) {
        const topUp = topic.test.fallback.length > 0 ? ', доповнено картками' : ''
        issues.push({ severity: 'warning', code: 'thin-exam', where: topic.id, message: `«${topic.title}»: у тесті теми лише ${topic.test.pool.length} автоперевірних тестів${topUp}` })
      }
      if (section.kind === 'path' && !topic.test) issues.push({ severity: 'warning', code: 'thin-exam', where: topic.id, message: `«${topic.title}»: немає вправ для тесту теми` })
    }
    if (section.kind === 'path' && section.exam && section.exam.questions < bundle.exams.section.questions) {
      issues.push({ severity: 'warning', code: 'thin-exam', where: section.key, message: `Екзамен розділу «${section.title}»: ${section.exam.questions} з ${bundle.exams.section.questions} питань` })
    }
  }

  if (bundle.placement.enabled) {
    const thin = LEVELS.filter((l) => manifest.levels.includes(l) && (bundle.placement.pool[l]?.length ?? 0) < bundle.placement.perLevel)
    if (thin.length > 0) {
      issues.push({ severity: 'warning', code: 'thin-placement', message: `Вступний тест: замало тестів рівнів ${thin.map((l) => `${l} (${bundle.placement.pool[l]?.length ?? 0})`).join(', ')} — потрібно ≥ ${bundle.placement.perLevel}` })
    }
  }

  // Content parser issues for the course's own chapters.
  const used = new Set(chapterIds)
  const paths = new Set(chapterIds.map((id) => source.chapters.get(id)?.path).filter(Boolean))
  for (const i of source.issues ?? []) {
    if (!used.has(i.path) && !paths.has(i.path)) continue
    issues.push({ severity: i.severity, code: 'content', where: i.path, message: `${i.code}: ${i.message}` })
  }
  return { manifest, bundle, issues }
}

export function validateCourse(input: unknown, source: CourseSource, opts: ValidateOptions = {}): CourseIssue[] {
  return checkCourse(input, source, opts).issues
}
