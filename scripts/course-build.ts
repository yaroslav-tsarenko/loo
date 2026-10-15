import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { checkCourse, CourseBundleSchema } from '../src/course'
import { listOfficialCourses, loadCourseSource, loadIconCatalog } from './lib/course-source'

// Usage: pnpm course:build [--force]
// Compiles every official course (<vault>/Courses/*/course.yaml) into content/courses/<id>.json,
// which ships with the app (next.config.ts → outputFileTracingIncludes ./content/**).
// A course with validation errors is not written unless --force. Task self-tests: pnpm course:check.

const force = process.argv.includes('--force')
const outDir = path.resolve('content', 'courses')
const courses = await listOfficialCourses()
if (courses.length === 0) {
  console.error('Офіційних курсів не знайдено (очікується <vault>/Courses/<id>/course.yaml)')
  process.exit(1)
}

const icons = await loadIconCatalog()
let failed = 0
await mkdir(outDir, { recursive: true })
for (const pkg of courses) {
  const { snapshot } = await loadCourseSource(pkg)
  const { bundle, issues } = checkCourse(pkg.source, snapshot, { icons })
  const errors = issues.filter((i) => i.severity === 'error')
  const name = path.basename(pkg.dir)
  if (!bundle || (errors.length > 0 && !force)) {
    failed++
    console.log(`❌ ${name}: ${errors.length} помилок — не записано (pnpm course:check ${name})`)
    for (const e of errors.slice(0, 10)) console.log(`   ${e.code}${e.where ? ` · ${e.where}` : ''} · ${e.message}`)
    continue
  }
  // Sanity: the bundle must round-trip through its own schema.
  const valid = CourseBundleSchema.safeParse(bundle)
  if (!valid.success) {
    failed++
    console.log(`❌ ${name}: bundle не відповідає схемі — ${valid.error.issues[0]?.path.join('.')}: ${valid.error.issues[0]?.message}`)
    continue
  }
  const file = path.join(outDir, `${bundle.course.id}.json`)
  const json = JSON.stringify(bundle)
  await writeFile(file, `${json}\n`)
  const s = bundle.stats
  console.log(`✅ ${bundle.course.id}@${bundle.course.version} → ${path.relative(process.cwd(), file)} · ${(json.length / 1024).toFixed(0)} КБ · розділів ${s.sections} · тем ${s.topics} · уроків ${s.lessons} · вправ ${s.exercises}${errors.length ? ` · ⚠️ ${errors.length} помилок (--force)` : ''}`)
}
process.exit(failed > 0 ? 1 : 0)
