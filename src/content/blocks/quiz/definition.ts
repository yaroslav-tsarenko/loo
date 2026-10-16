import type { List, Paragraph, PhrasingContent, Root, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'
import type { QuizExercise, QuizMode, QuizOption, QuizUnit } from '../../model'
import { levelFrom, placementFields, readMetaParagraph, splitTags } from '../meta'
import type { UnitDefinition } from '../types'
import { isRoleFence, parseFill, parseOrder } from './exercise'

export function labeledParagraph(node: RootContent, labels: RegExp): Paragraph | null {
  if (node.type !== 'paragraph') return null
  const first = node.children[0]
  if (!first || first.type !== 'strong') return null
  const label = toString(first).trim()
  if (!labels.test(label)) return null
  const rest = node.children.slice(1)
  const head = rest[0]
  if (head?.type === 'text') {
    const value = head.value.replace(/^[\s:—-]+/, '')
    if (value) rest[0] = { type: 'text', value }
    else rest.shift()
  }
  return { type: 'paragraph', children: rest }
}

export function isTaskList(node: RootContent): node is List {
  return node.type === 'list' && node.children.length > 0 && node.children.every((item) => typeof item.checked === 'boolean')
}

export function optionContent(item: List['children'][number]): PhrasingContent[] {
  const out: PhrasingContent[] = []
  for (const child of item.children) {
    if (child.type === 'paragraph') {
      if (out.length > 0) out.push({ type: 'text', value: ' ' })
      out.push(...child.children)
    }
  }
  return out
}

export const EXPLANATION = /^(пояснення|explanation|чому)\s*:?$/i
const ANSWER = /^(відповідь|answer)\s*:?$/i

export const quizDefinition: UnitDefinition = {
  type: 'quiz',
  aliases: ['test', 'mcq'],
  extract(node, ctx) {
    const promptText = toString({ type: 'paragraph', children: node.title }).trim()
    const children = node.children as RootContent[]
    const meta = readMetaParagraph(children[0])
    const rest = meta ? children.slice(1) : children.slice()
    let options: QuizOption[] = []
    let freeAnswer: string | null = null
    let explanation: Root | null = null
    const body: RootContent[] = []
    for (let i = 0; i < rest.length; i++) {
      const child = rest[i]!
      if (options.length === 0 && isTaskList(child)) {
        options = child.children.map((item, index) => ({
          id: String.fromCharCode(97 + index),
          content: optionContent(item),
          correct: item.checked === true,
        }))
        continue
      }
      const explained = labeledParagraph(child, EXPLANATION)
      if (explained) {
        explanation = { type: 'root', children: [explained, ...rest.slice(i + 1)] }
        break
      }
      const answered = labeledParagraph(child, ANSWER)
      if (answered) {
        freeAnswer = toString(answered).trim()
        continue
      }
      body.push(child)
    }
    const declared = meta?.values.type?.toLowerCase()
    const correctCount = options.filter((o) => o.correct).length
    let mode: QuizMode = correctCount > 1 ? 'multi' : 'single'
    if (declared === 'output' || declared === 'code') mode = 'output'
    else if (declared === 'multi' || declared === 'multiple') mode = 'multi'
    // Parsons / fill-in: the tagged fence (or the first fence when type is declared) is the exercise
    let exercise: QuizExercise | null = null
    let exerciseText = ''
    for (const role of ['order', 'fill'] as const) {
      if (exercise) break
      const index = body.findIndex((n) => n.type === 'code' && isRoleFence(n, role))
      const at = index >= 0 ? index : declared === role ? body.findIndex((n) => n.type === 'code') : -1
      const fence = body[at]
      if (!fence || fence.type !== 'code') {
        if (declared === role) mode = role
        continue
      }
      body.splice(at, 1)
      mode = role
      exerciseText = fence.value
      if (role === 'order') exercise = parseOrder(fence)
      else {
        const bankValue = meta?.values.bank
        const bank = Boolean(bankValue) || (meta?.flags.some((f) => f.toLowerCase() === 'bank') ?? false)
        exercise = parseFill(fence, bank, bankValue ? bankValue.split(',').map((w) => w.trim()).filter(Boolean) : [])
      }
    }
    const interactive = mode === 'order' || mode === 'fill'
    if (!interactive && options.length === 0 && !freeAnswer) return null
    if (interactive) {
      options = []
      freeAnswer = null
    }
    const basis = `${promptText}\n${toString({ type: 'root', children: body })}${exerciseText ? `\n${exerciseText}` : ''}`
    const { id, source } = ctx.resolveId(meta?.values.id ?? null, basis)
    const unit: QuizUnit = {
      id,
      kind: 'quiz',
      guideId: ctx.guideId,
      chapterId: ctx.chapterId,
      sectionSlug: ctx.sectionSlug,
      level: levelFrom([meta?.values.level ?? '']) ?? ctx.level,
      tags: splitTags(meta?.values.tags),
      idSource: source,
      mode,
      prompt: node.title,
      promptText,
      body: { type: 'root', children: body },
      options,
      freeAnswer,
      explanation,
      exercise,
      ...placementFields(meta?.values.skill, meta?.values.diff),
      searchText: `${promptText}\n${options.map((o) => toString({ type: 'paragraph', children: o.content })).join('\n')}${exerciseText ? `\n${exerciseText}` : ''}`,
    }
    return unit
  },
}
