import { readFileSync } from 'node:fs'
import path from 'node:path'

// Performance bench (docs/PERFORMANCE.md): times signed-in pages and server actions of a `next start` build wired to
// scripts/perf-lab.ts, at several database round-trip times. For each case it reports the median wall time per RTT,
// the measured sequential DB round trips (turns counted by the lab's latency proxy) and the server's [perf] line.
//
// Usage: pnpm tsx scripts/perf-bench.ts [--base http://127.0.0.1:3310] [--rtt 0,20] [--n 5] [--log tmp/perf-server.log]
//        [--only /path,answerQuiz]

const args = process.argv.slice(2)
const arg = (name: string, fallback: string) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] ? args[i + 1]! : fallback
}
const base = arg('base', 'http://127.0.0.1:3310')
const control = arg('control', 'http://127.0.0.1:54342')
const rtts = arg('rtt', '0,20').split(',').map(Number)
const n = Number(arg('n', '5'))
const logPath = path.resolve(arg('log', 'tmp/perf-server.log'))
const only = arg('only', '')
  .split(',')
  .filter(Boolean)
const cookie = readFileSync('tmp/perf-lab/cookie.txt', 'utf8').trim()

const manifest = JSON.parse(readFileSync('.next/server/server-reference-manifest.json', 'utf8')) as { node: Record<string, { exportedName?: string; filename?: string }> }
const actionId = (name: string) => {
  const hit = Object.entries(manifest.node).find(([, v]) => v.exportedName === name)
  if (!hit) throw new Error(`action ${name} not in manifest`)
  return hit[0]
}

const LESSON = 'english-a1-c2:a1:en-a1-alphabet:core-1'
const QUIZ = { unitId: 'en-a1-alphabet-q01', chosen: ['c'] }

interface Case {
  name: string
  run: (ctx: { session: string | null }) => Promise<Response>
  setup?: () => Promise<{ session: string | null }>
}

const page = (p: string): Case => ({ name: p, run: () => fetch(base + p, { headers: { cookie }, redirect: 'manual' }) })

async function action(name: string, args: unknown[], at = '/'): Promise<Response> {
  return fetch(base + at, {
    method: 'POST',
    redirect: 'manual',
    headers: { cookie, 'next-action': actionId(name), accept: 'text/x-component', 'content-type': 'text/plain;charset=UTF-8', origin: base },
    body: JSON.stringify(args),
  })
}

async function newLessonSession(): Promise<{ session: string | null }> {
  const res = await action('startLesson', [LESSON], `/learn/${encodeURIComponent(LESSON)}`)
  const text = await res.text()
  return { session: /"([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})"/.exec(text)?.[1] ?? null }
}

const CASES: Case[] = [
  page('/'),
  page('/path'),
  page(`/learn/${encodeURIComponent(LESSON)}`),
  page('/review'),
  page('/quiz'),
  page('/words'),
  page('/g/javascript'),
  page(`/g/javascript/${encodeURIComponent('05-замикання')}`),
  page('/shop'),
  page('/loo'),
  page('/profile'),
  page('/leagues'),
  page('/mistakes'),
  page('/courses'),
  page('/api/counts'),
  { name: 'answerQuiz (practice)', run: () => action('answerQuiz', [{ ...QUIZ, text: null, durationMs: 1200, sessionId: null }], '/quiz') },
  {
    name: 'answerQuiz (lesson)',
    setup: newLessonSession,
    run: ({ session }) => action('answerQuiz', [{ ...QUIZ, text: null, durationMs: 1200, sessionId: session }], `/learn/${encodeURIComponent(LESSON)}`),
  },
  { name: 'startLesson', run: () => action('startLesson', [LESSON], `/learn/${encodeURIComponent(LESSON)}`) },
  { name: 'equipItem', run: () => action('equipItem', [{ slot: 'hat', itemId: null }], '/shop') },
]

const turns = async (): Promise<number> => ((await (await fetch(`${control}/stats`)).json()) as { turns: number }).turns
const setRtt = async (ms: number) => void (await fetch(`${control}/rtt?ms=${ms}`))
const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)] ?? 0
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function lastPerfLine(): string {
  const lines = readFileSync(logPath, 'utf8').trim().split('\n').filter((l) => l.startsWith('[perf]'))
  return (lines.at(-1) ?? '').replace(/^\[perf\] /, '')
}

const rows: string[] = []
for (const c of CASES.filter((c) => only.length === 0 || only.includes(c.name) || only.some((o) => c.name.startsWith(o)))) {
  const times = new Map<number, number[]>()
  let rt = 0
  let perf = ''
  let status = 0
  for (const rtt of rtts) {
    await setRtt(rtt)
    const ctx = c.setup ? await c.setup() : { session: null }
    await (await c.run(ctx)).text() // warm
    const list: number[] = []
    const rts: number[] = []
    for (let i = 0; i < n; i++) {
      const before = await turns()
      const started = performance.now()
      const res = await c.run(ctx)
      await res.text()
      list.push(performance.now() - started)
      status = res.status
      await sleep(30)
      rts.push((await turns()) - before)
    }
    times.set(rtt, list)
    rt = median(rts)
    perf = lastPerfLine()
  }
  const cols = rtts.map((r) => `${Math.round(median(times.get(r) ?? []))}ms@${r}`).join(' ')
  rows.push(`${c.name.padEnd(34)} ${String(status).padEnd(4)} ${cols.padEnd(24)} ${String(rt).padStart(4)} RT  | ${perf}`)
  console.log(rows.at(-1))
}
await setRtt(0)
