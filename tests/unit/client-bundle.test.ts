import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

// What the browser downloads: everything reachable through value imports from a 'use client' module. Parsers and
// highlighters (yaml, unified/remark, shiki) are server-side work — one stray import from a module the client also
// uses (a grader, a block definition) puts ~80 KB gzip on every page (docs/PERFORMANCE.md). ESLint sees one file at a
// time; this walks the graph, so a transitive leak shows up with the path that causes it.

const ROOT = path.resolve('src')
const HEAVY = [/^yaml$/, /^unified$/, /^remark-/, /^rehype-/, /^shiki$/, /^@shikijs\//, /^gray-matter$/, /^node:/, /^postgres$/, /^drizzle-orm/]
const SERVER_ONLY_MODULES = [/^src\/content\/parse\//, /^src\/server\//, /^src\/db\//]

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(ts|tsx)$/.test(name) && !name.endsWith('.d.ts')) out.push(p)
  }
  return out
}

const sourceCache = new Map<string, string>()
const source = (file: string) => {
  let s = sourceCache.get(file)
  if (s === undefined) {
    s = readFileSync(file, 'utf8')
    sourceCache.set(file, s)
  }
  return s
}

// Value imports and re-exports only (`import type`, `export type` are erased).
function specifiers(code: string): string[] {
  const out: string[] = []
  const stripped = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
  const re = /^\s*(import|export)\s+(type\s+)?([^'"]*?)\s*(?:from\s*)?['"]([^'"]+)['"]/gm
  for (const m of stripped.matchAll(re)) {
    if (m[2]) continue
    const clause = m[3] ?? ''
    if (m[1] === 'export' && !/^\*|^\{/.test(clause)) continue
    // `import { type A, type B } from` — all-type named imports are erased too
    const named = /^\{([^}]*)\}$/.exec(clause.trim())
    if (named && named[1]!.split(',').map((s) => s.trim()).filter(Boolean).every((s) => s.startsWith('type '))) continue
    out.push(m[4]!)
  }
  // dynamic import() is a separate chunk loaded on demand — not in the first load, so not followed
  return out
}

function resolve(from: string, spec: string): string | null {
  let base: string
  if (spec.startsWith('@/')) base = path.join(ROOT, spec.slice(2))
  else if (spec.startsWith('.')) base = path.resolve(path.dirname(from), spec)
  else return null
  for (const c of [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')]) if (existsSync(c) && statSync(c).isFile()) return c
  return null
}

const rel = (f: string) => path.relative(process.cwd(), f)

function leaks(entry: string): string[] {
  const seen = new Map<string, string | null>([[entry, null]])
  const queue = [entry]
  const found: string[] = []
  const chain = (f: string): string => {
    const parts: string[] = []
    for (let cur: string | null = f; cur; cur = seen.get(cur) ?? null) parts.unshift(rel(cur))
    return parts.join(' → ')
  }
  while (queue.length) {
    const file = queue.shift()!
    // a server-only marker stops the walk: Next fails the build if it ever reaches the client
    if (file !== entry && /^\s*import ['"]server-only['"]/m.test(source(file))) continue
    // 'use server' modules reach the browser as action references, not code
    if (/^\s*['"]use server['"]/.test(source(file))) continue
    if (SERVER_ONLY_MODULES.some((re) => re.test(rel(file)))) {
      found.push(chain(file))
      continue
    }
    for (const spec of specifiers(source(file))) {
      if (HEAVY.some((re) => re.test(spec))) {
        found.push(`${chain(file)} → ${spec}`)
        continue
      }
      const next = resolve(file, spec)
      if (next && !seen.has(next)) {
        seen.set(next, file)
        queue.push(next)
      }
    }
  }
  return found
}

describe('client bundle', () => {
  const clientEntries = walk(ROOT).filter((f) => /^\s*['"]use client['"]/.test(source(f)))

  it('finds the client entry points', () => {
    expect(clientEntries.length).toBeGreaterThan(50)
  })

  it('no client module reaches a parser, a highlighter or server code', () => {
    const all = [...new Set(clientEntries.flatMap(leaks))]
    expect(all).toEqual([])
  })

  it("a UI module that uses server code says so: import 'server-only' (a client import then fails the build)", () => {
    const offenders = walk(path.join(ROOT, 'ui'))
      .filter((f) => !/^\s*['"]use client['"]/.test(source(f)) && !/^\s*import ['"]server-only['"]/m.test(source(f)))
      .flatMap((f) =>
        specifiers(source(f))
          .filter((spec) => spec.startsWith('@/server/') || spec.startsWith('@/db'))
          .filter((spec) => {
            const target = resolve(f, spec)
            return !(target && /^\s*['"]use server['"]/.test(source(target)))
          })
          .map((spec) => `${rel(f)} → ${spec}`),
      )
    expect(offenders).toEqual([])
  })
})
