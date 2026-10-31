import { describe, expect, it } from 'vitest'
import { createContext, runInContext } from 'node:vm'
import { getVersion } from 'sucrase'
import { checkTasks, selfTest } from '../../scripts/lib/task-check'
import { bundleTsStrip } from '../../scripts/lib/ts-strip-bundle'
import { isRunnable, isTypeScript, taskCodeProblems } from '@/content/blocks/task/code'
import type { TaskUnit } from '@/content/model'
import { extractFile } from '@/content/parse/extract'
import { parseMarkdown } from '@/content/parse/markdown'
import { TS_STRIP_SOURCE, TS_STRIP_SUCRASE_VERSION } from '@/ui/code/ts-strip.bundle.generated'
import { prepareTypeScript, stripTypes } from '@/ui/code/ts-strip'
import { workerSource } from '@/ui/code/worker-source'

const run = (ts: string) => new Function(stripTypes(ts))()

describe('stripTypes', () => {
  it('removes interfaces, type aliases, generics, as, satisfies, non-null and parameter properties', () => {
    const src = `interface Point { x: number; y: number }
type Box<T> = { value: T }
function first<T>(items: readonly T[]): T | undefined { return items[0] }
const p = { x: 1, y: 2 } satisfies Point
const q = (p as unknown) as Point
const box: Box<number> = { value: first<number>([3])! }
class User { constructor(private readonly name: string, public age?: number) {} hi(): string { return this.name } }
return [q.x + q.y, box.value, new User('Ann').hi(), p?.x ?? 0]`
    expect(run(src)).toEqual([3, 3, 'Ann', 1])
  })

  it('compiles enums (numeric, string, const) to runtime objects', () => {
    expect(run(`enum Dir { Up, Down = 5, Left }\nenum S { A = 'a' }\nconst enum K { X = 2 }\nreturn [Dir.Up, Dir.Left, Dir[5], S.A, K.X]`)).toEqual([0, 6, 'Down', 'a', 2])
  })

  it('keeps line numbers and modern JS untouched', () => {
    const src = 'interface A {\n  x: number\n}\ntype B = string\nconst a: A = { x: 1 }\nclass F { #p = 1; static s = a?.x ?? 2 }\nthrow new Error("line 7")'
    const out = stripTypes(src)
    expect(out.split('\n')).toHaveLength(src.split('\n').length)
    expect(out.split('\n')[6]).toBe('throw new Error("line 7")')
    expect(out).toContain('#p = 1')
    expect(out).toContain('a?.x ?? 2')
    // plain JS goes through unchanged
    const js = 'const f = (x) => x * 2\nconsole.log(f(2))'
    expect(stripTypes(js)).toBe(js)
  })

  it('reports syntax errors with the harness wording and a position', () => {
    expect(prepareTypeScript('const x: = 1', 'test("a", () => {})')).toEqual({ ok: false, error: expect.stringMatching(/^Синтаксична помилка у твоєму коді: SyntaxError: .*\(1:\d+\)/) })
    expect(prepareTypeScript('const x = 1', 'test("a", (: number) => {})')).toMatchObject({ ok: false, error: expect.stringMatching(/^Синтаксична помилка в тестах/) })
  })
})

describe('bundled stripper', () => {
  it('is in sync with ts-strip.ts and the installed sucrase (run `pnpm runner:build` if not)', async () => {
    expect(TS_STRIP_SUCRASE_VERSION).toBe(getVersion())
    expect(await bundleTsStrip()).toBe(TS_STRIP_SOURCE)
  })

  it('strips exactly like the Node path', () => {
    const prepare = new Function(`"use strict"; return ${TS_STRIP_SOURCE}`)() as typeof prepareTypeScript
    const code = 'enum E { A }\nfunction f<T>(x: T): T { return x }'
    expect(prepare(code, 'test("t", () => expect(f<number>(E.A)).toBe(0))')).toEqual(prepareTypeScript(code, 'test("t", () => expect(f<number>(E.A)).toBe(0))'))
    expect(TS_STRIP_SOURCE).not.toMatch(/ts-interface-checker|sourcesContent/)
  })
})

describe('worker source with the stripper', () => {
  // Runs the real worker script in a fresh vm context standing in for a worker global
  function boot() {
    const posted: { type: string; report?: { status: string; error: string | null; tests: { ok: boolean }[] } }[] = []
    const ctx = createContext({ setTimeout, clearTimeout, setInterval, clearInterval, console, fetch: () => 'leak', importScripts: () => 'leak' })
    runInContext('globalThis.postMessage = (m) => posted(m); globalThis.addEventListener = () => {}', Object.assign(ctx, { posted: (m: (typeof posted)[number]) => posted.push(m) }))
    runInContext(workerSource(), ctx)
    const send = (data: Record<string, unknown>) =>
      new Promise<(typeof posted)[number]['report']>((resolve) => {
        ;(ctx as { onmessage: (e: unknown) => void }).onmessage({ data: { token: 'tk', ...data } })
        const wait = () => {
          const done = posted.find((m) => m.type === 'done')
          if (done) resolve(done.report)
          else setTimeout(wait, 5)
        }
        wait()
      })
    return { ctx, send }
  }

  it('includes the stripper and still blocks fetch and importScripts', () => {
    const source = workerSource()
    expect(source).toContain(TS_STRIP_SOURCE)
    expect(() => new Function(source)).not.toThrow()
    for (const name of ['fetch', 'importScripts', 'XMLHttpRequest', 'WebSocket']) expect(source).toMatch(new RegExp(`["']${name}["']`))
    const { ctx } = boot()
    expect(runInContext('[typeof fetch, typeof importScripts, typeof __tsStrip]', ctx)).toEqual(['undefined', 'undefined', 'undefined'])
  })

  it('runs TS only when asked; JS messages are not stripped', async () => {
    const ts = { code: 'function add(a: number, b: number): number { return a + b }', tests: 'test("adds", () => expect(add(1, 2) as number).toBe(3))' }
    expect(await boot().send({ ...ts, typescript: true })).toMatchObject({ status: 'passed' })
    expect(await boot().send(ts)).toMatchObject({ status: 'error', error: expect.stringMatching(/^Синтаксична помилка у твоєму коді/) })
    expect(await boot().send({ code: 'const x: = 1', tests: 'test("a", () => {})', typescript: true })).toMatchObject({ status: 'error', error: expect.stringMatching(/^Синтаксична помилка у твоєму коді: SyntaxError/) })
  })
})

describe('TypeScript tasks', () => {
  const md = `> [!task] Сума масиву
> level: junior · difficulty: easy · id: ts-sum
>
> Напиши \`sum(items)\` для масиву \`Item[]\`.
>
> \`\`\`ts starter
> interface Item { price: number }
> function sum(items: Item[]): number {
>   return 0
> }
> \`\`\`
>
> \`\`\`ts tests
> enum Price { Low = 1, High = 10 }
> test('сума цін', () => {
>   const items: Item[] = [{ price: Price.Low }, { price: Price.High }]
>   expect(sum(items)).toBe(11)
> })
> \`\`\`
>
> > [!solution]- Рішення
> > \`\`\`ts
> > interface Item { price: number }
> > function sum(items: Item[]): number {
> >   return items.reduce<number>((acc, item) => acc + item.price, 0)
> > }
> > \`\`\``

  const unit = () => {
    const { root, meta } = parseMarkdown(md)
    return extractFile({ root, meta, guideId: 'g', chapterId: 'g/ch', path: 'Guides/G/Test - 01. Файл.md', fileName: 'Test - 01. Файл' }).units[0] as TaskUnit
  }

  it('parses ts fences as a runnable TypeScript task', () => {
    const t = unit()
    expect(t.code?.lang).toBe('ts')
    expect(isRunnable('ts') && isRunnable('typescript') && isTypeScript('typescript') && !isTypeScript('js')).toBe(true)
    expect(taskCodeProblems(t)).toEqual([])
  })

  it('content:check path: the reference passes and the starter fails', async () => {
    expect(await checkTasks([unit()])).toEqual({ tested: 1, problems: [] })
    const t = unit()
    const starter = await selfTest(t.code!.starter, t.code!.tests!, true)
    expect(starter.status).toBe('failed')
    // a starter that already solves it is flagged, same as for JS
    const solved = { ...t, code: { ...t.code!, starter: 'function sum(items: { price: number }[]): number { return 11 }' } }
    expect((await checkTasks([solved])).problems.map((p) => p.code)).toEqual(['task-starter-passes'])
  })

  it('reports a broken TS reference as a self-test error', async () => {
    const t = unit()
    const broken = { ...t, solution: { type: 'root' as const, children: [{ type: 'code' as const, lang: 'ts', value: 'function sum(items: Item[]): number { return 0 }' }] } }
    const { problems } = await checkTasks([broken])
    expect(problems).toMatchObject([{ code: 'task-self-test', severity: 'error' }])
  })
})
