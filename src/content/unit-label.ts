import type { LearningUnit, QuizUnit } from './model'

// First meaningful line of an order/fill exercise, blanks masked
function exerciseLine(unit: QuizUnit): string | undefined {
  const ex = unit.exercise
  if (!ex) return undefined
  const text = ex.kind === 'order' ? ex.pieces.find((p) => !p.distractor)?.code ?? '' : ex.segments.map((s) => (s.kind === 'text' ? s.value : '___')).join('')
  return text.split('\n').find((l) => l.trim())?.trim()
}

export function unitLabel(unit: LearningUnit): string {
  if (unit.kind === 'quiz') {
    const code = unit.body.children.find((n) => n.type === 'code')
    const firstLine = code && code.type === 'code' ? code.value.split('\n').find((l) => l.trim())?.trim() : exerciseLine(unit)
    const text = unit.promptText.length < 40 && firstLine ? `${unit.promptText} ${firstLine}` : unit.promptText
    return text.slice(0, 240)
  }
  const text = unit.kind === 'flashcard' ? unit.questionText : unit.titleText
  return text.slice(0, 240)
}
