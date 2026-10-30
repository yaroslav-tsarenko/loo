import type { Root } from 'mdast'
import type { TaskUnit } from '../../model'

// TypeScript tasks run after their types are stripped (src/ui/code/ts-strip.ts); types are never checked.
export const TS_LANGS = new Set(['ts', 'typescript'])
export const RUNNABLE_LANGS = new Set(['js', 'javascript', 'mjs', 'cjs', ...TS_LANGS])

export function isRunnable(lang: string): boolean {
  return RUNNABLE_LANGS.has(lang)
}

export function isTypeScript(lang: string): boolean {
  return TS_LANGS.has(lang)
}

// First code fence of the reference solution (used by content:check to self-test the task)
export function solutionCode(solution: Root | null): string | null {
  for (const node of solution?.children ?? []) if (node.type === 'code') return node.value
  return null
}

export function taskCodeProblems(unit: TaskUnit): string[] {
  const code = unit.code
  if (!code?.tests) return []
  const out: string[] = []
  if (!isRunnable(code.lang)) out.push(`Задача ${unit.id}: тести запускаються лише для JavaScript (\`js\`) і TypeScript (\`ts\`), а не \`${code.lang}\``)
  if (!/\btest\s*\(/.test(code.tests)) out.push(`Задача ${unit.id}: у блоці tests немає жодного test(…)`)
  return out
}
