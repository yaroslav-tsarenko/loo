import { compileCourseDetailed, MIN_AUTO_QUESTIONS } from '../compile/compile'
import type { CourseSource } from '../compile/source'
import { iconExists, type IconCatalog } from '../icons'
import type { CourseIssue } from '../issues'
import { courseKind, courseLevels, coursePractice, PLACEMENT_SKILLS, parseCourseManifest, parseCourseYaml, PRACTICE_NEEDS, type CourseBundle, type CourseManifest, type ExerciseKind, type Level, levelRank, type Topic } from '../schema'

// COURSE_FORMAT §7: schema, guides and ranges, unique ids, icons, §4 minimums (warnings), exercise levels,
// test/exam/placement pools, plus the content parser's own issues for the chapters the course uses.
// Task self-tests need a sandbox and live in scripts/ (scripts/lib/task-check.ts).

export interface ValidateOptions {
  // known library icons; without it only the icon syntax is checked
  icons?: IconCatalog
  // [!viz] + [!figure] + [!diagram] count per chapter id; without it the illustration minimum is skipped
  figures?: ReadonlyMap<string, number>
}

export interface CourseCheck {
  manifest: CourseManifest | null
  bundle: CourseBundle | null
  issues: CourseIssue[]
}

// Language courses (docs/ENGLISH_SYLLABUS.md §1.3): every topic trains listening and speaking too.
export const MINIMUMS = { quizzes: 6, flashcards: 6, tasks: 2, reels: 3, figures: 1, listening: 1, speaking: 1 } as const

export const REVIEW_TAG = 'review'
const isReview = (topic: Topic): boolean => topic.tags.includes(REVIEW_TAG)

function minimumIssues(topic: Topic, bundle: CourseBundle, opts: ValidateOptions): CourseIssue | null {
  const kinds = topic.exercises.map((id) => bundle.exercises[id]!.kind)
  const count = (...k: ExerciseKind[]) => kinds.filter((x) => k.includes(x)).length
  const short: string[] = []
  const need = (have: number, min: number, label: string) => {
    if (have < min) short.push(`${label} ${have}/${min}`)
  }
  const language = courseKind(bundle.course) === 'language'
  // a listening choice and a minimal pair are auto-graded tests; [!word] is a card
  need(language ? count('quiz', 'listen', 'pair') : count('quiz'), MINIMUMS.quizzes, 'тести')
  // a review topic («Підсумок A1 — тест рівня», tag `review`) brings no new words or terms: it tests the topics it
  // sums up, so the cards minimum doesn't apply (its quizzes, listening and speaking minimums still do)
  if (!isReview(topic)) need(count('flashcard', 'word'), MINIMUMS.flashcards, language ? 'картки (слова)' : 'картки')
  if (bundle.course.subject === 'programming') need(count('task'), MINIMUMS.tasks, 'задачі')
  if (language) {
    need(count('listen'), MINIMUMS.listening, 'аудіювання')
    need(count('speak', 'pair'), MINIMUMS.speaking, 'вимова')
  }
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

  if (bundle.placement.enabled && bundle.placement.bank) {
    issues.push(...bankIssues(bundle))
  } else if (bundle.placement.enabled) {
    // levels that only planned sections (B1…C2 «скоро») teach have no questions yet — not a gap
    const covered = (l: Level) => bundle.sections.some((s) => s.status !== 'planned' && levelRank(s.minLevel) <= levelRank(l) && levelRank(l) <= levelRank(s.level))
    const plannedOnly = new Set(bundle.sections.filter((s) => s.status === 'planned').map((s) => s.level).filter((l) => !covered(l)))
    const thin = courseLevels(bundle.course).filter((l) => !plannedOnly.has(l) && (bundle.placement.pool[l]?.length ?? 0) < bundle.placement.perLevel)
    if (thin.length > 0) {
      issues.push({ severity: 'warning', code: 'thin-placement', message: `Вступний тест: замало тестів рівнів ${thin.map((l) => `${l} (${bundle.placement.pool[l]?.length ?? 0})`).join(', ')} — потрібно ≥ ${bundle.placement.perLevel}` })
    }
  }

  // Practice sections the course offers but has nothing for (e.g. «tasks» without a single [!task]).
  const kinds = new Set(Object.values(bundle.exercises).map((e) => e.kind))
  for (const id of coursePractice(bundle.course)) {
    const needs = PRACTICE_NEEDS[id]
    if (needs && !needs.some((k) => kinds.has(k))) {
      issues.push({ severity: 'warning', code: 'empty-practice', where: 'practice', message: `Розділ практики «${id}»: у курсі немає вправ типу ${needs.join(' / ')}` })
    }
  }

  // Content parser issues for the course's own chapters.
  const used = new Set(chapterIds)
  const paths = new Set(chapterIds.map((id) => source.chapters.get(id)?.path ?? source.placementChapters?.get(id)?.path).filter(Boolean))
  for (const i of source.issues ?? []) {
    if (!used.has(i.path) && !paths.has(i.path)) continue
    issues.push({ severity: i.severity, code: 'content', where: i.path, message: `${i.code}: ${i.message}` })
  }
  return { manifest, bundle, issues }
}

// Bank mode (docs/LANGUAGE_COURSE.md «Банк вступного тесту»): every level of the ladder needs enough questions for a
// probe plus the follow-up, all four skills and enough diff ≥ 2 items (guessing protection).
function bankIssues(bundle: CourseBundle): CourseIssue[] {
  const { bank = {}, perLevel, followUp = 0 } = bundle.placement
  const items = Object.values(bank)
  const want = perLevel * 2 + followUp
  const missing: string[] = []
  const thin: string[] = []
  const skills: string[] = []
  const hard: string[] = []
  for (const l of courseLevels(bundle.course)) {
    const at = items.filter((i) => i.level === l)
    if (at.length === 0) {
      missing.push(l)
      continue
    }
    if (at.length < want) thin.push(`${l} (${at.length})`)
    const lacking = PLACEMENT_SKILLS.filter((s) => !at.some((i) => i.skill === s))
    if (lacking.length > 0) skills.push(`${l}: ${lacking.join(', ')}`)
    if (at.filter((i) => i.diff >= 2).length < perLevel) hard.push(l)
  }
  const out: CourseIssue[] = []
  const warn = (message: string) => out.push({ severity: 'warning', code: 'thin-placement', where: 'placement', message: `Банк вступного тесту: ${message}` })
  if (missing.length > 0) warn(`немає питань рівнів ${missing.join(', ')} — тест їх не перевіряє`)
  if (thin.length > 0) warn(`замало питань: ${thin.join(', ')} — потрібно ≥ ${want} (краще 40)`)
  if (skills.length > 0) warn(`без навичок — ${skills.join('; ')}`)
  if (hard.length > 0) warn(`замало питань diff ≥ 2 на рівнях ${hard.join(', ')} — захист від вгадування слабший`)
  return out
}

export function validateCourse(input: unknown, source: CourseSource, opts: ValidateOptions = {}): CourseIssue[] {
  return checkCourse(input, source, opts).issues
}
