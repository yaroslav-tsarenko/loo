import { defaultVaultConfig } from '../src/content/config'
import { loadSnapshot } from '../src/content/store'
import { checkTasks } from './lib/task-check'

// Usage: pnpm content:check [guide-id|dir]
// Prints chapters, unit counts by kind and all content issues for a guide.
// Tasks with ```js tests are self-checked: the reference solution must pass its own tests.

const guideArg = process.argv[2]
const snapshot = await loadSnapshot(defaultVaultConfig(), new Map(), 1)
const guides = guideArg ? snapshot.guides.filter((g) => g.id === guideArg || g.dir === guideArg) : snapshot.guides
if (guides.length === 0) {
  console.error(`Посібник «${guideArg}» не знайдено. Доступні: ${snapshot.guides.map((g) => g.id).join(', ')}`)
  process.exit(1)
}
let problems = 0
for (const guide of guides) {
  console.log(`\n# ${guide.title} (${guide.id}) — ${guide.chapterIds.length} розділів`)
  for (const chapterId of guide.chapterIds) {
    const chapter = snapshot.chapters.get(chapterId)!
    const units = snapshot.unitsByChapter.get(chapterId) ?? []
    const by = (k: string) => units.filter((u) => u.kind === k).length
    console.log(`  ${chapter.number ?? '–'}. ${chapter.title} · id=${chapter.id} · картки ${by('flashcard')} · тести ${by('quiz')} · задачі ${by('task')} · ${chapter.estimatedMinutes} хв`)
  }
  const paths = new Set(guide.chapterIds.map((id) => snapshot.chapters.get(id)?.path))
  const guideIssues = snapshot.issues.filter((i) => paths.has(i.path) || guide.chapterIds.includes(i.path) || i.path.includes(`/${guide.dir}/`))
  for (const issue of guideIssues) {
    problems++
    console.log(`  [${issue.severity}] ${issue.code} · ${issue.path} · ${issue.message}`)
  }
  const units = guide.chapterIds.flatMap((id) => snapshot.unitsByChapter.get(id) ?? [])
  const { tested, problems: taskProblems } = await checkTasks(units, { starters: false })
  for (const p of taskProblems) {
    problems++
    console.log(`  [${p.severity}] ${p.code} · ${p.unitId} · ${p.message}`)
  }
  if (tested > 0) console.log(`  🧪 еталонних рішень перевірено тестами: ${tested}`)
}
console.log(problems === 0 ? '\n✅ Проблем немає' : `\n⚠️  Проблем: ${problems}`)
process.exit(problems > 0 ? 1 : 0)
