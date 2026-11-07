import { readFileSync } from 'node:fs'

// Load test against the perf lab (docs/PERFORMANCE.md «The lab»): N virtual learners loop through a realistic
// session — home, map, a lesson with 5 answers, words, profile, counts — for D seconds, with think time between
// steps. Reports throughput, latency percentiles per step, errors, and the database turns the lab proxy counted.
//
// Usage: pnpm tsx scripts/load-test.ts [--base http://127.0.0.1:3310] [--vus 10,50,100] [--seconds 30] [--think 300]
// All learners share the lab's one signed-in user (writes contend on the same rows: a pessimistic case).

const args = process.argv.slice(2)
const arg = (name: string, fallback: string) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] ? args[i + 1]! : fallback
}
const base = arg('base', 'http://127.0.0.1:3310')
const control = arg('control', 'http://127.0.0.1:54342')
const levels = arg('vus', '10,50,100').split(',').map(Number)
const seconds = Number(arg('seconds', '30'))
const think = Number(arg('think', '300'))
const cookie = readFileSync('tmp/perf-lab/cookie.txt', 'utf8').trim()
const manifest = JSON.parse(readFileSync('.next/server/server-reference-manifest.json', 'utf8')) as { node: Record<string, { exportedName?: string }> }
const actionId = (name: string) => Object.entries(manifest.node).find(([, v]) => v.exportedName === name)?.[0] ?? ''

const LESSON = 'english-a1-c2:a1:en-a1-alphabet:core-1'
const QUIZ = { unitId: 'en-a1-alphabet-q01', chosen: ['c'], text: null, durationMs: 1200 }

const get = (p: string) => fetch(base + p, { headers: { cookie }, redirect: 'manual' })
const action = (name: string, body: unknown[], at: string) =>
  fetch(base + at, {
    method: 'POST',
    redirect: 'manual',
    headers: { cookie, 'next-action': actionId(name), accept: 'text/x-component', 'content-type': 'text/plain;charset=UTF-8', origin: base },
    body: JSON.stringify(body),
  })

type Step = [name: string, run: (ctx: { session: string | null }) => Promise<Response>]
const lessonPath = `/learn/${encodeURIComponent(LESSON)}`
const SESSION: Step[] = [
  ['page /', () => get('/')],
  ['page /path', () => get('/path')],
  ['page /learn', () => get(lessonPath)],
  ['startLesson', () => action('startLesson', [LESSON], lessonPath)],
  ...Array.from({ length: 5 }, (): Step => [`answer`, (ctx) => action('answerQuiz', [{ ...QUIZ, sessionId: ctx.session }], lessonPath)]),
  ['page /words', () => get('/words')],
  ['api /counts', () => get('/api/counts')],
  ['page /profile', () => get('/profile')],
]

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const pct = (xs: number[], p: number) => [...xs].sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor((xs.length * p) / 100))] ?? 0
const turns = async () => ((await (await fetch(`${control}/stats`)).json()) as { turns: number }).turns

for (const vus of levels) {
  const lat = new Map<string, number[]>()
  let ok = 0
  let errors = 0
  const until = Date.now() + seconds * 1000
  const t0 = await turns()
  const started = performance.now()
  await Promise.all(
    Array.from({ length: vus }, async (_, v) => {
      await sleep((v * think) / Math.max(1, vus)) // stagger
      while (Date.now() < until) {
        const ctx = { session: null as string | null }
        for (const [name, run] of SESSION) {
          if (Date.now() >= until) break
          const t = performance.now()
          try {
            const res = await run(ctx)
            const text = await res.text()
            if (name === 'startLesson') ctx.session = /"([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})"/.exec(text)?.[1] ?? null
            if (res.status >= 400) errors++
            else ok++
          } catch {
            errors++
          }
          const list = lat.get(name) ?? []
          list.push(performance.now() - t)
          lat.set(name, list)
          await sleep(think * (0.5 + Math.random()))
        }
      }
    }),
  )
  const elapsed = (performance.now() - started) / 1000
  const dbTurns = (await turns()) - t0
  const all = [...lat.values()].flat()
  console.log(`\n=== ${vus} learners · ${elapsed.toFixed(0)} s · ${(ok / elapsed).toFixed(1)} req/s · errors ${errors} · DB turns ${(dbTurns / elapsed).toFixed(0)}/s (${(dbTurns / Math.max(1, ok)).toFixed(1)} per request)`)
  console.log(`all     p50 ${pct(all, 50).toFixed(0)} ms  p95 ${pct(all, 95).toFixed(0)} ms  p99 ${pct(all, 99).toFixed(0)} ms`)
  for (const [name, xs] of lat) console.log(`${name.padEnd(14)} n=${String(xs.length).padStart(5)}  p50 ${pct(xs, 50).toFixed(0).padStart(5)} ms  p95 ${pct(xs, 95).toFixed(0).padStart(5)} ms`)
  await sleep(2000)
}
