import type { Root, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'
import { DIFFICULTIES, type Difficulty, type TaskCode, type TaskUnit } from '../../model'
import { fenceWords, levelFrom, readMetaParagraph, splitTags } from '../meta'
import type { UnitDefinition } from '../types'

const HINT = new Set(['hint', 'підказка'])
const SOLUTION = new Set(['solution', 'answer', 'рішення'])
const STARTER = new Set(['starter', 'заготовка'])
const TESTS = new Set(['tests', 'test', 'тести'])

function toDifficulty(value: string | undefined): Difficulty {
  const normalized = (value ?? '').toLowerCase()
  if ((DIFFICULTIES as readonly string[]).includes(normalized)) return normalized as Difficulty
  if (normalized === 'легка') return 'easy'
  if (normalized === 'складна') return 'hard'
  return 'medium'
}

function fenceLang(lang: string | null | undefined): string {
  const value = lang?.toLowerCase() ?? ''
  return !value || STARTER.has(value) || TESTS.has(value) ? 'js' : value
}

export const taskDefinition: UnitDefinition = {
  type: 'task',
  aliases: ['exercise', 'задача'],
  extract(node, ctx) {
    const titleText = toString({ type: 'paragraph', children: node.title }).trim()
    const children = node.children as RootContent[]
    const meta = readMetaParagraph(children[0])
    const rest = meta ? children.slice(1) : children
    const statement: RootContent[] = []
    const hints: Root[] = []
    let solution: Root | null = null
    let starter: { lang: string; value: string } | null = null
    let tests: { lang: string; value: string } | null = null
    for (const child of rest) {
      const words = child.type === 'code' ? fenceWords(child) : []
      if (child.type === 'code' && !starter && words.some((w) => STARTER.has(w))) {
        starter = { lang: fenceLang(child.lang), value: child.value }
      } else if (child.type === 'code' && !tests && words.some((w) => TESTS.has(w))) {
        tests = { lang: fenceLang(child.lang), value: child.value }
      } else if (child.type === 'callout' && HINT.has(child.calloutType)) {
        hints.push({ type: 'root', children: child.children as RootContent[] })
      } else if (child.type === 'callout' && SOLUTION.has(child.calloutType)) {
        solution = { type: 'root', children: child.children as RootContent[] }
      } else statement.push(child)
    }
    const statementRoot: Root = { type: 'root', children: statement }
    const code: TaskCode | null = starter || tests ? { lang: (starter ?? tests)!.lang, starter: starter?.value ?? '', tests: tests?.value ?? null } : null
    const { id, source } = ctx.resolveId(meta?.values.id ?? null, `${titleText}\n${toString(statementRoot)}`)
    const unit: TaskUnit = {
      id,
      kind: 'task',
      guideId: ctx.guideId,
      chapterId: ctx.chapterId,
      sectionSlug: ctx.sectionSlug,
      level: levelFrom([meta?.values.level ?? '']) ?? ctx.level,
      tags: splitTags(meta?.values.tags),
      idSource: source,
      difficulty: toDifficulty(meta?.values.difficulty),
      title: node.title,
      titleText,
      statement: statementRoot,
      hints,
      solution,
      code,
      searchText: `${titleText}\n${toString(statementRoot)}`,
    }
    return unit
  },
}
