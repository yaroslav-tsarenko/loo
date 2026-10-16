import path from 'node:path'
import { checkCourse, LEVEL_LABEL, LEVELS, type CourseBundle, type CourseIssue } from '../src/course'
import { countFigures, listOfficialCourses, loadCourseSource, loadIconCatalog, resolveCourse } from './lib/course-source'
import { checkTasks } from './lib/task-check'

// Usage: pnpm course:check <dir | course-id> [--no-tasks] [--verbose]
// Validates course.yaml, compiles the CourseBundle, prints a summary and self-tests every auto-tested task
// (reference solution must pass, starter should fail). Exit code 1 on errors; warnings don't fail.

const args = process.argv.slice(2)
const target = args.find((a) => !a.startsWith('--'))
const runTasks = !args.includes('--no-tasks')
const verbose = args.includes('--verbose')
const WARNINGS_PER_CODE = 6

if (!target) {
  const official = await listOfficialCourses()
  console.error(`Вкажи курс: pnpm course:check <папка | id>. Офіційні: ${official.map((c) => path.basename(c.dir)).join(', ') || '—'}`)
  process.exit(1)
}
const pkg = await resolveCourse(target)
if (!pkg) {
  console.error(`Курс «${target}» не знайдено (ні папки з course.yaml, ні офіційного курсу з таким id)`)
  process.exit(1)
}

const started = performance.now()
const { snapshot, config } = await loadCourseSource(pkg)
const icons = await loadIconCatalog()
const first = checkCourse(pkg.source, snapshot, { icons })
const chapterIds = first.bundle?.sections.flatMap((s) => s.topics.map((t) => t.chapterId)) ?? []
const figures = await countFigures(snapshot, config, chapterIds)
const { bundle, issues } = checkCourse(pkg.source, snapshot, { icons, figures })

const fmt = (n: number) => n.toLocaleString('uk-UA')
const hours = (minutes: number) => `${(Math.round(minutes / 6) / 10).toLocaleString('uk-UA')} год`

function printSummary(b: CourseBundle) {
  const c = b.course
  console.log(`\n# ${c.title} (${c.id}) v${c.version}`)
  console.log(`  ${pkg!.official ? 'офіційний курс · посібники зі спільної Guides/' : 'пакет'} · ${pkg!.yamlPath}`)
  if (c.subtitle) console.log(`  ${c.subtitle}`)
  console.log('')
  for (const s of b.sections) {
    const lessons = s.topics.reduce((sum, t) => sum + t.lessons.length, 0)
    const ex = s.topics.reduce((sum, t) => sum + t.exercises.length, 0)
    const tasks = s.topics.reduce((sum, t) => sum + t.exercises.filter((id) => b.exercises[id]!.kind === 'task').length, 0)
    const levels = s.minLevel === s.level ? s.level : `${s.minLevel}→${s.level}`
    const exam = s.exam ? `екзамен ${s.exam.questions} пит.${s.exam.testOut ? ' (test-out)' : ''}` : s.kind === 'practice' ? 'банк практики' : 'без екзамену'
    console.log(`  ${String(s.index + 1).padStart(2)}. ${s.icon ?? '•'} ${s.title} [${s.kind}] · ${s.guideDir} · тем ${s.topics.length} · уроків ${lessons} · вправ ${ex} · задач ${tasks} · ${levels} · ${exam} · ${hours(s.minutes)}`)
  }
  const st = b.stats
  console.log(`\n  Розділів ${st.sections} · тем ${st.topics} · уроків ${fmt(st.lessons)} · вправ ${fmt(st.exercises)}`)
  console.log(`  Тести ${fmt(st.quizzes)} · картки ${fmt(st.flashcards)} · співбесіда ${fmt(st.interview)} · задачі ${fmt(st.tasks)} (з автотестами ${fmt(st.autoTestedTasks)}) · фішки ${fmt(st.reels)}`)
  console.log(`  Тестів тем ${st.topicTests} · екзаменів розділів ${st.sectionExams} · ≈ ${st.hours.toLocaleString('uk-UA')} год`)
  console.log(`  Рівні вправ: ${LEVELS.map((l) => `${l} (${LEVEL_LABEL[l]}) ${fmt(st.byLevel[l])}`).join(' · ')}`)
  if (b.placement.enabled) console.log(`  Вступний тест (≤ ${b.placement.maxQuestions} пит., ${b.placement.perLevel}/рівень): ${LEVELS.map((l) => `${l} ${b.placement.pool[l]?.length ?? 0}`).join(' · ')}`)
}

function printIssues(list: CourseIssue[]) {
  const errors = list.filter((i) => i.severity === 'error')
  const warnings = list.filter((i) => i.severity === 'warning')
  for (const i of errors) console.log(`  [error] ${i.code}${i.where ? ` · ${i.where}` : ''} · ${i.message}`)
  const byCode = new Map<string, CourseIssue[]>()
  for (const w of warnings) byCode.set(w.code, [...(byCode.get(w.code) ?? []), w])
  for (const [code, items] of byCode) {
    const shown = verbose ? items : items.slice(0, WARNINGS_PER_CODE)
    console.log(`  [warning] ${code} × ${items.length}`)
    for (const w of shown) console.log(`      ${w.message}`)
    if (shown.length < items.length) console.log(`      … ще ${items.length - shown.length} (--verbose)`)
  }
}

if (bundle) printSummary(bundle)

if (runTasks && bundle) {
  const units = Object.keys(bundle.exercises).map((id) => snapshot.units.get(id)).filter((u) => u !== undefined)
  const t0 = performance.now()
  const { tested, problems } = await checkTasks(units)
  for (const p of problems) {
    const topic = bundle.exercises[p.unitId]?.topicId
    issues.push({ severity: p.severity, code: 'task', where: topic, message: `${p.code} · ${p.unitId}: ${p.message}` })
  }
  console.log(`\n  🧪 Задач з автотестами перевірено: ${tested} (еталон проходить, заготовка — ні) за ${Math.round((performance.now() - t0) / 100) / 10} с`)
}

console.log('')
printIssues(issues)
const errors = issues.filter((i) => i.severity === 'error').length
const warnings = issues.length - errors
console.log(`\n${errors === 0 ? '✅' : '❌'} Помилок: ${errors} · попереджень: ${warnings} · ${Math.round(performance.now() - started)} мс`)
process.exit(errors > 0 ? 1 : 0)
