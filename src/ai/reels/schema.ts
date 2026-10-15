import { z } from 'zod'

// Limits from LEARNING_PLAYBOOK §4: title ≤ 60, body ≤ 280, optional code ≤ 6 lines.
export const LIMITS = { title: 60, body: 280, codeLines: 6, codeChars: 420 } as const

// What the model is asked to return. Limits live in descriptions, not in the JSON schema:
// one over-long title must not reject the whole batch — strict checks run per reel afterwards.
export const draftSchema = z.object({
  emoji: z.string().describe('Рівно один емодзі-якір'),
  title: z.string().describe(`Заголовок-гачок, до ${LIMITS.title} символів, без емодзі`),
  body: z.string().describe(`Markdown, до ${LIMITS.body} символів, без блоків коду, заголовків і посилань`),
  code: z.string().nullable().describe(`JavaScript до ${LIMITS.codeLines} рядків без \`\`\`, або null`),
  expectsError: z.boolean().describe('true, якщо код навмисно кидає помилку (рілс про помилку)'),
  topic: z.string().describe('Коротка тема: "Event Loop", "Замикання", "Новини: Node.js 26"'),
  chapterId: z.string().nullable().describe('id розділу з вхідних даних або null'),
  newsId: z.string().nullable().describe('id новини (N1, N2…) з вхідних даних або null'),
  refUrl: z.string().nullable().describe('MDN / tc39.es / javascript.info / v8.dev / nodejs.org про цю тему або null'),
})
export type ReelDraft = z.infer<typeof draftSchema>

export const batchSchema = z.object({ reels: z.array(draftSchema) })

export const verdictSchema = z.object({
  index: z.number().int().describe('Номер рілса зі списку'),
  verdict: z.enum(['keep', 'fix', 'drop']),
  reason: z.string().describe('Коротко: що не так або чому ок'),
  fix: z
    .object({ title: z.string(), body: z.string(), code: z.string().nullable() })
    .nullable()
    .describe('Лише для verdict = fix: виправлені поля повністю'),
})
export type Verdict = z.infer<typeof verdictSchema>

export const verdictsSchema = z.object({ verdicts: z.array(verdictSchema) })

const EMOJI = /^(?:\p{Extended_Pictographic}|\p{Regional_Indicator}{2})(?:\u{FE0F}|\u{20E3}|\p{Emoji_Modifier}|\u{200D}\p{Extended_Pictographic}\u{FE0F}?)*$/u
const HTTP_URL = /^https?:\/\/[^\s<>"']+$/
// No fenced code, headings, raw HTML or non-http links in the prose part.
const BODY_FORBIDDEN = /```|^#{1,6}\s|<\/?[a-z][^>]*>|\]\((?!https?:\/\/)[^)]*\)/im

export function codeLines(code: string): number {
  return code.trim().split('\n').length
}

// Strict per-reel check, run after generation and after every "fix".
export const strictReelSchema = draftSchema.extend({
  emoji: z.string().trim().regex(EMOJI, 'один емодзі'),
  title: z.string().trim().min(4).max(LIMITS.title),
  body: z
    .string()
    .trim()
    .min(20)
    .max(LIMITS.body)
    .refine((s) => !BODY_FORBIDDEN.test(s), 'body: без блоків коду, заголовків, HTML і не-http посилань'),
  code: z
    .string()
    .trim()
    .max(LIMITS.codeChars)
    .refine((s) => codeLines(s) <= LIMITS.codeLines, `код ≤ ${LIMITS.codeLines} рядків`)
    .refine((s) => !s.includes('```'), 'код без ```')
    .nullable()
    .transform((s) => (s ? s : null)),
  topic: z.string().trim().min(2).max(40),
})
export type StrictReel = z.infer<typeof strictReelSchema>

export function isHttpUrl(value: string | null | undefined): value is string {
  return typeof value === 'string' && HTTP_URL.test(value)
}

// Stored body = prose + optional fenced JS, the same shape as a [!reel] callout in the guides.
export function composeBody(body: string, code: string | null): string {
  return code ? `${body.trim()}\n\n\`\`\`js\n${code.trim()}\n\`\`\`` : body.trim()
}

export function splitBody(stored: string): { body: string; code: string | null } {
  const m = /\n*```js\n([\s\S]*?)\n```\s*$/.exec(stored)
  return m ? { body: stored.slice(0, m.index).trim(), code: m[1]! } : { body: stored.trim(), code: null }
}
