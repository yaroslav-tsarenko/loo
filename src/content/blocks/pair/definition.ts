import type { Root, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'
import type { PairSpec, PairWord, QuizUnit } from '../../model'
import { normalizeText } from '../lang/grade'
import { FieldBag, ipaOf, readFields } from '../lang/fields'
import { levelFrom, splitTags } from '../meta'
import type { UnitDefinition } from '../types'

// `> [!pair] ship /ʃɪp/ — sheep /ʃiːp/` + `say: sheep` — minimal pairs (docs/LANGUAGE_COURSE.md). The learner hears
// `say` and picks which of the two words it was: a quiz of mode 'pair' with options a / b, graded on the server.

const KEYS = new Set(['level', 'id', 'say', 'tip', 'tags', 'lang'])

export const PAIR_PROMPT = 'Яке слово прозвучало?'

const SIDE = /^(.*?\S)\s*(\/[^/]+\/|\[[^\]]+\])?\s*$/

function side(raw: string): PairWord | null {
  const m = SIDE.exec(raw.trim())
  if (!m) return null
  const word = m[1]!.trim()
  return word ? { word, ipa: ipaOf(m[2] ?? null) } : null
}

// «ship /ʃɪp/ — sheep /ʃiːp/» · «ship – sheep» · «ship vs sheep» · «ship / sheep»
export function parsePairTitle(title: string): [PairWord, PairWord] | null {
  const parts = title.split(/\s+[—–]\s+|\s+-\s+|\s+vs\.?\s+/i)
  if (parts.length !== 2) {
    const slash = title.split(/\s+\|\s+/)
    if (slash.length !== 2) return null
    parts.splice(0, parts.length, ...slash)
  }
  const a = side(parts[0]!)
  const b = side(parts[1]!)
  return a && b ? [a, b] : null
}

export const pairDefinition: UnitDefinition = {
  type: 'pair',
  aliases: ['minimal-pair', 'пара'],
  extract(node, ctx) {
    const title = toString({ type: 'paragraph', children: node.title }).trim()
    const words = parsePairTitle(title)
    if (!words) {
      ctx.report?.('error', `[!pair] «${title}»: заголовок має бути «слово /IPA/ — слово /IPA/»`)
      return null
    }
    const { fields, rest } = readFields(node.children as RootContent[], KEYS)
    const f = new FieldBag(fields)
    const say = f.text('say')
    const said = say ? words.findIndex((w) => normalizeText(w.word) === normalizeText(say)) : -1
    if (!say) ctx.report?.('error', `[!pair] «${title}»: немає say: (яке слово звучить)`)
    else if (said < 0) ctx.report?.('error', `[!pair] «${title}»: say «${say}» не збігається з жодним словом пари`)
    if (!say || said < 0) return null
    const tip = f.get('tip')
    const spec: PairSpec = { words, say: words[said]!.word, tip: tip?.text ?? null }
    const explanation: Root | null = tip ? { type: 'root', children: [{ type: 'paragraph', children: tip.phrasing }] } : null
    const { id, source } = ctx.resolveId(f.text('id'), `pair:${title}\n${say}`)
    const unit: QuizUnit = {
      id,
      kind: 'quiz',
      guideId: ctx.guideId,
      chapterId: ctx.chapterId,
      sectionSlug: ctx.sectionSlug,
      level: levelFrom([f.text('level') ?? '']) ?? ctx.level,
      tags: splitTags(f.text('tags') ?? undefined),
      idSource: source,
      mode: 'pair',
      prompt: [{ type: 'text', value: PAIR_PROMPT }],
      promptText: PAIR_PROMPT,
      body: { type: 'root', children: rest },
      options: words.map((w, i) => ({ id: String.fromCharCode(97 + i), content: [{ type: 'text', value: w.word }], correct: i === said })),
      freeAnswer: null,
      explanation,
      exercise: null,
      pair: spec,
      ...(f.text('lang') ? { lang: f.text('lang')! } : {}),
      searchText: `${words[0].word} — ${words[1].word}`,
    }
    return unit
  },
}
