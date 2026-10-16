import type { Root, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'
import type { AudioLine, ListenSpec, ListenType, QuizOption, QuizUnit } from '../../model'
import { FieldBag, isSlow, readFields } from '../lang/fields'
import { levelFrom, placementFields, splitTags } from '../meta'
import { EXPLANATION, isTaskList, labeledParagraph, optionContent } from '../quiz/definition'
import type { UnitDefinition } from '../types'

// `> [!listen] Що ти почув?` — listening (docs/LANGUAGE_COURSE.md). A quiz of mode 'listen' for the engine:
//   type: choice    — pick what was said (options = transcripts; the right one is server-side only)
//   type: answer    — a question about what was said (options = answers)
//   type: dictation — type what you heard (graded without case / punctuation, src/content/blocks/lang/grade.ts)
// `audio:` lines are spoken in order; `audio: A: …` / `audio: B: …` make a dialogue with alternating voices.

// skill / diff: placement bank items (docs/LANGUAGE_COURSE.md «Банк вступного тесту»)
const KEYS = new Set(['level', 'type', 'id', 'audio', 'speed', 'accept', 'tags', 'lang', 'explain', 'skill', 'diff'])
const TYPES: readonly ListenType[] = ['choice', 'dictation', 'answer']

export const MAX_AUDIO_CHARS = 300

const SPEAKER = /^([A-ZА-ЯІЇЄҐ][\p{L}\d ]{0,15}?)\s*:\s+(\S.*)$/u

// `A: Where are you from?` → speaker A; a plain sentence → no speaker
export function audioLine(value: string): AudioLine {
  const m = SPEAKER.exec(value.trim())
  return m ? { speaker: m[1]!.trim(), text: m[2]!.trim() } : { speaker: null, text: value.trim() }
}

// What a dictation expects: every line's words, speakers dropped.
export const dictationText = (lines: readonly AudioLine[]): string => lines.map((l) => l.text).join(' ')

export const listenDefinition: UnitDefinition = {
  type: 'listen',
  aliases: ['listening', 'аудіювання'],
  extract(node, ctx) {
    const promptText = toString({ type: 'paragraph', children: node.title }).trim() || 'Послухай'
    const { fields, rest } = readFields(node.children as RootContent[], KEYS)
    const f = new FieldBag(fields)
    const lines = f
      .all('audio')
      .map((a) => audioLine(a.text))
      .filter((l) => l.text)
    let options: QuizOption[] = []
    let explanation: Root | null = null
    const body: RootContent[] = []
    for (let i = 0; i < rest.length; i++) {
      const child = rest[i]!
      if (options.length === 0 && isTaskList(child)) {
        options = child.children.map((item, index) => ({ id: String.fromCharCode(97 + index), content: optionContent(item), correct: item.checked === true }))
        continue
      }
      const explained = labeledParagraph(child, EXPLANATION)
      if (explained) {
        explanation = { type: 'root', children: [explained, ...rest.slice(i + 1)] }
        break
      }
      body.push(child)
    }
    const explain = f.get('explain')
    if (!explanation && explain) explanation = { type: 'root', children: [{ type: 'paragraph', children: explain.phrasing }] }
    const declared = f.text('type')?.toLowerCase() as ListenType | undefined
    const type: ListenType = declared && TYPES.includes(declared) ? declared : options.length > 0 ? 'choice' : 'dictation'
    if (declared && !TYPES.includes(declared)) ctx.report?.('warning', `[!listen] «${promptText}»: невідомий type «${declared}» (choice | dictation | answer)`)
    if (lines.length === 0) ctx.report?.('error', `[!listen] «${promptText}»: немає рядка audio:`)
    if (type !== 'dictation' && options.length < 2) ctx.report?.('error', `[!listen] «${promptText}» (type: ${type}): потрібно ≥ 2 варіанти - [ ] / - [x]`)
    if (type === 'dictation' && options.length > 0) {
      ctx.report?.('warning', `[!listen] «${promptText}»: у диктанті варіанти ігноруються`)
      options = []
    }
    const spoken = lines.reduce((n, l) => n + l.text.length, 0)
    if (spoken > MAX_AUDIO_CHARS) ctx.report?.('warning', `[!listen] «${promptText}»: ${spoken} символів аудіо — краще ≤ ${MAX_AUDIO_CHARS}`)
    if (lines.length === 0 || (type !== 'dictation' && options.length < 2)) return null
    const listen: ListenSpec = {
      type,
      lines,
      slow: isSlow(f.text('speed')),
      accept: (f.text('accept') ?? '')
        .split('|')
        .map((a) => a.trim())
        .filter(Boolean),
    }
    const audioText = dictationText(lines)
    const { id, source } = ctx.resolveId(f.text('id'), `listen:${promptText}\n${audioText}`)
    const unit: QuizUnit = {
      id,
      kind: 'quiz',
      guideId: ctx.guideId,
      chapterId: ctx.chapterId,
      sectionSlug: ctx.sectionSlug,
      level: levelFrom([f.text('level') ?? '']) ?? ctx.level,
      tags: splitTags(f.text('tags') ?? undefined),
      idSource: source,
      mode: 'listen',
      prompt: node.title.length > 0 ? node.title : [{ type: 'text', value: promptText }],
      promptText,
      body: { type: 'root', children: body },
      options,
      freeAnswer: type === 'dictation' ? audioText : null,
      explanation,
      exercise: null,
      listen,
      ...(f.text('lang') ? { lang: f.text('lang')! } : {}),
      ...placementFields(f.text('skill'), f.text('diff')),
      // search shows the prompt only: the transcript is the answer of choice / dictation items
      searchText: promptText,
    }
    return unit
  },
}
