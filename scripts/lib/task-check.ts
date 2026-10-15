import { Worker } from 'node:worker_threads'
import { isRunnable, solutionCode } from '../../src/content/blocks/task/code'
import type { LearningUnit } from '../../src/content/model'
import { runSuite, type RunReport } from '../../src/ui/code/harness'

// Shared by content:check and course:check: runs a task's reference solution (must pass) and starter (should fail)
// against its ```js tests — the same harness as the browser worker, in a node worker thread with a hard timeout.

const TIMEOUT_MS = 3000

export function selfTest(code: string, tests: string): Promise<RunReport> {
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
    const timer = setTimeout(() => done({ status: 'timeout', tests: [], logs: [], error: `таймаут ${TIMEOUT_MS / 1000} с`, ms: TIMEOUT_MS }), TIMEOUT_MS)
    worker.once('message', done)
    worker.once('error', (e) => done({ status: 'error', tests: [], logs: [], error: e.message, ms: 0 }))
  })
}

export interface TaskProblem {
  severity: 'error' | 'warning'
  code: 'task-self-test' | 'task-starter-passes'
  unitId: string
  chapterId: string
  message: string
}

export interface TaskCheckResult {
  tested: number
  problems: TaskProblem[]
}

function describeFailure(report: RunReport): string {
  return report.error ?? report.tests.filter((t) => !t.ok).map((t) => `«${t.name}»: ${t.error}`).join('; ')
}

async function pool<T>(items: readonly T[], size: number, run: (item: T) => Promise<void>): Promise<void> {
  let next = 0
  const lanes = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (next < items.length) await run(items[next++]!)
  })
  await Promise.all(lanes)
}

export interface TaskCheckOptions {
  // also run starters (they should fail their tests); default true
  starters?: boolean
  concurrency?: number
}

export async function checkTasks(units: readonly LearningUnit[], opts: TaskCheckOptions = {}): Promise<TaskCheckResult> {
  const problems: TaskProblem[] = []
  const runnable = units.filter((u) => u.kind === 'task' && u.code?.tests && isRunnable(u.code.lang))
  let tested = 0
  await pool(runnable, opts.concurrency ?? 6, async (unit) => {
    if (unit.kind !== 'task' || !unit.code?.tests) return
    const reference = solutionCode(unit.solution)
    if (reference) {
      tested++
      const report = await selfTest(reference, unit.code.tests)
      if (report.status !== 'passed') {
        problems.push({ severity: 'error', code: 'task-self-test', unitId: unit.id, chapterId: unit.chapterId, message: `еталон не проходить власні тести: ${describeFailure(report)}` })
      }
    }
    if (opts.starters !== false && unit.code.starter.trim()) {
      const report = await selfTest(unit.code.starter, unit.code.tests)
      if (report.status === 'passed') {
        problems.push({ severity: 'warning', code: 'task-starter-passes', unitId: unit.id, chapterId: unit.chapterId, message: 'заготовка вже проходить усі тести' })
      }
    }
  })
  problems.sort((a, b) => a.unitId.localeCompare(b.unitId))
  return { tested, problems }
}
