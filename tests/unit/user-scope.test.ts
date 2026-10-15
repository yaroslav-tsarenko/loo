import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { is } from 'drizzle-orm'
import { getTableConfig, PgTable } from 'drizzle-orm/pg-core'
import { describe, expect, it } from 'vitest'
import * as schema from '@/db/schema'

// Static guard (docs/SECURITY.md §4.2.5): every query builder that touches a per-user table must mention the user —
// `userId` (the variable or a `table.userId` column) somewhere in its chain — or carry an explicit
// `// cross-user: <reason>` comment within the three lines above it (system jobs, admin, profile creation).
// RLS on Supabase is the second line of defense; this keeps the first one honest.

const ROOT = path.resolve(__dirname, '../..')
const SCAN = ['src/server', 'src/app', 'src/news', 'src/ai']

const exportName = new Map<unknown, string>(Object.entries(schema).map(([k, v]) => [v, k]))
const USER_TABLES = (Object.values(schema) as unknown[])
  .filter((t): t is PgTable => is(t, PgTable))
  .filter((t) => getTableConfig(t).columns.some((c) => c.name === 'user_id') || getTableConfig(t).name === 'profiles')
  .map((t) => exportName.get(t)!)

function files(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...files(full))
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full)
  }
  return out
}

// From `{` of a template placeholder, the index just past its matching `}`.
function closeBrace(src: string, open: number): number {
  let depth = 0
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++
    else if (src[i] === '}' && --depth === 0) return i + 1
  }
  return src.length
}

// From an opening parenthesis, the index just past its matching close (strings and templates skipped).
function closeParen(src: string, open: number): number {
  let depth = 0
  for (let i = open; i < src.length; i++) {
    const ch = src[i]
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch
      for (i++; i < src.length && src[i] !== quote; i++) {
        if (src[i] === '\\') i++
        else if (quote === '`' && src[i] === '$' && src[i + 1] === '{') i = closeBrace(src, i + 1) - 1
      }
      continue
    }
    if (ch === '(') depth++
    else if (ch === ')' && --depth === 0) return i + 1
  }
  return src.length
}

// The method chain that continues after a call: `.where(...).orderBy(...)…`
function chainFrom(src: string, callOpen: number): string {
  let end = closeParen(src, callOpen)
  for (;;) {
    const rest = src.slice(end)
    const m = /^\s*\.\s*([A-Za-z_$][\w$]*)\s*(<[^>]*>)?\s*\(/.exec(rest)
    if (!m) break
    end = closeParen(src, end + m[0].length - 1)
  }
  return src.slice(callOpen, end)
}

export interface Finding {
  file: string
  line: number
  call: string
}

export function scan(file: string, src: string): Finding[] {
  const findings: Finding[] = []
  const tables = USER_TABLES.join('|')
  const re = new RegExp(`\\.(from|update|delete|insert|innerJoin|leftJoin|rightJoin|fullJoin)\\(\\s*(${tables})\\b`, 'g')
  for (const m of src.matchAll(re)) {
    const at = m.index!
    const chain = chainFrom(src, at + m[0].indexOf('('))
    if (/\buserId\b|\buser\.id\b/.test(chain)) continue
    const line = src.slice(0, at).split('\n').length
    const above = src.split('\n').slice(Math.max(0, line - 4), line).join('\n')
    if (/\/\/ cross-user: \S/.test(above)) continue
    findings.push({ file: path.relative(ROOT, file), line, call: `${m[1]}(${m[2]})` })
  }
  return findings
}

describe('per-user query scoping (static check)', () => {
  it('knows the per-user tables', () => {
    expect(USER_TABLES).toEqual(expect.arrayContaining(['attempts', 'srsCards', 'mistakes', 'xpLedger', 'userSettings', 'newsReads', 'reelState', 'profiles']))
    expect(USER_TABLES).not.toContain('units')
    expect(USER_TABLES).not.toContain('newsItems')
  })

  it('flags unscoped access and accepts scoped / annotated access', () => {
    const bad = `const rows = await db.select().from(srsCards).where(lte(srsCards.due, now))`
    const good = `const rows = await db.select().from(srsCards).where(and(eq(srsCards.userId, userId), lte(srsCards.due, now)))`
    const insert = 'await tx.insert(xpLedger).values({ userId, amount: 1, reason: `x${a}` })'
    const annotated = '// cross-user: system job\nawait db.update(attempts).set({ unitId: b }).where(eq(attempts.unitId, a))'
    expect(scan('x.ts', bad)).toHaveLength(1)
    expect(scan('x.ts', good)).toHaveLength(0)
    expect(scan('x.ts', insert)).toHaveLength(0)
    expect(scan('x.ts', annotated)).toHaveLength(0)
    expect(scan('x.ts', 'db.select().from(units).innerJoin(mistakes, eq(units.id, mistakes.unitId))')).toHaveLength(1)
  })

  it('finds no unscoped per-user query in the app', () => {
    const findings = SCAN.flatMap((dir) => files(path.join(ROOT, dir))).flatMap((file) => scan(file, readFileSync(file, 'utf8')))
    expect(findings).toEqual([])
  })
})
