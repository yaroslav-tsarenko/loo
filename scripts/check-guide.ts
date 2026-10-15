import { Worker } from 'node:worker_threads'
import { isRunnable, solutionCode } from '../src/content/blocks/task/code'
import { defaultVaultConfig } from '../src/content/config'
import { loadSnapshot } from '../src/content/store'
import { runSuite, type RunReport } from '../src/ui/code/harness'

// Usage: pnpm content:check [guide-id|dir]
// Prints chapters, unit counts by kind and all content issues for a guide.
// Tasks with ```js tests are self-checked: the reference solution must pass its own tests.

// Same harness as the browser worker, isolated in a node worker thread with a hard timeout
function selfTest(code: string, tests: string): Promise<RunReport> {
  const source = `var __name = (f) => f
const { parentPort, workerData } = require('node:worker_threads')
const run = ${runSuite.toString()}
const host = { setTimeout, clearTimeout, setInterval, clearInterval, now: Date.now }
run(workerData.code, workerData.tests, () => {}, host).then((r) => parentPort.postMessage(r), (e) => parentPort.postMessage({ status: 'error', tests: [], logs: [], error: String(e), ms: 0 }))`
  return new Promise((resolve) => {
    const worker = new Worker(source, { eval: true, workerData: { code, tests } })
    const done = (report: RunReport) => {
      clearTimeout(timer)
      void worker.terminate()
      resolve(report)
    }
    const timer = setTimeout(() => done({ status: 'timeout', tests: [], logs: [], error: 'таймаут 3 с', ms: 3000 }), 3000)
    worker.once('message', done)
    worker.once('error', (e) => done({ status: 'error', tests: [], logs: [], error: e.message, ms: 0 }))
  })
}

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
  let tested = 0
  for (const chapterId of guide.chapterIds) {
    for (const unit of snapshot.unitsByChapter.get(chapterId) ?? []) {
      if (unit.kind !== 'task' || !unit.code?.tests || !isRunnable(unit.code.lang)) continue
      const reference = solutionCode(unit.solution)
      if (!reference) continue
      tested++
      const report = await selfTest(reference, unit.code.tests)
      if (report.status === 'passed') continue
      problems++
      const failed = report.tests.filter((t) => !t.ok).map((t) => `«${t.name}»: ${t.error}`)
      console.log(`  [error] task-self-test · ${unit.id} · еталон не проходить власні тести: ${report.error ?? failed.join('; ')}`)
    }
  }
  if (tested > 0) console.log(`  🧪 еталонних рішень перевірено тестами: ${tested}`)
}
console.log(problems === 0 ? '\n✅ Проблем немає' : `\n⚠️  Проблем: ${problems}`)
process.exit(problems > 0 ? 1 : 0)
