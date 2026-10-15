import { generateText, Output, type LanguageModel, type LanguageModelUsage } from 'ai'
import { codeVerdict, runSnippet, type RunResult } from './code-check'
import { batchSchema, composeBody, isHttpUrl, strictReelSchema, verdictsSchema, type StrictReel, type Verdict } from './schema'
import type { ChapterTopic, NewsTopic, TopicPlan } from './topics'

// Latest Claude Sonnet / Haiku on the Vercel AI Gateway (checked against https://ai-gateway.vercel.sh/v1/models).
export const DEFAULT_MODEL = 'anthropic/claude-sonnet-5.5'
export const DEFAULT_VERIFY_MODEL = 'anthropic/claude-haiku-5.5'

export function reelModels(env: Record<string, string | undefined> = process.env): { model: string; verifyModel: string } {
  return { model: env.REELS_MODEL?.trim() || DEFAULT_MODEL, verifyModel: env.REELS_VERIFY_MODEL?.trim() || DEFAULT_VERIFY_MODEL }
}

// The gateway authenticates with an API key or a Vercel OIDC token; on Vercel the token arrives per request.
export function gatewayAuth(env: Record<string, string | undefined> = process.env): 'api-key' | 'oidc' | null {
  if (env.AI_GATEWAY_API_KEY?.trim()) return 'api-key'
  if (env.VERCEL_OIDC_TOKEN?.trim() || env.VERCEL) return 'oidc'
  return null
}

export interface FinalReel {
  emoji: string
  title: string
  body: string
  topic: string
  guideId: string | null
  chapterId: string | null
  sourceUrl: string | null
  sourceTitle: string | null
}

export interface Dropped {
  title: string
  stage: 'schema' | 'code' | 'verify' | 'dedupe'
  reason: string
}

export interface GenerateResult {
  reels: FinalReel[]
  dropped: Dropped[]
  usage: { generate: Usage; verify: Usage }
}

export interface Usage {
  inputTokens: number
  outputTokens: number
  totalTokens: number
}

export interface GenerateOptions {
  model: LanguageModel
  verifyModel: LanguageModel
  avoidTitles?: readonly string[]
  today?: string
  runCode?: (code: string) => Promise<RunResult>
  // Returns true when the reference URL answers 200; injected in tests (no network).
  checkUrl?: (url: string) => Promise<boolean>
}

// Reference links the model may suggest for chapter reels; anything else is dropped.
const REF_HOSTS: Record<string, string> = {
  'developer.mozilla.org': 'MDN',
  'tc39.es': 'ECMAScript',
  'javascript.info': 'javascript.info',
  'v8.dev': 'V8 blog',
  'nodejs.org': 'Node.js docs',
  'web.dev': 'web.dev',
  'developer.chrome.com': 'Chrome for Developers',
}

export function refSource(url: string): string | null {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' ? (REF_HOSTS[u.hostname] ?? null) : null
  } catch {
    return null
  }
}

export async function urlResponds(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(5000) })
    return res.ok
  } catch {
    return false
  }
}

function toUsage(u: LanguageModelUsage | undefined): Usage {
  const inputTokens = u?.inputTokens ?? 0
  const outputTokens = u?.outputTokens ?? 0
  return { inputTokens, outputTokens, totalTokens: u?.totalTokens ?? inputTokens + outputTokens }
}

const ZERO: Usage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 }

// ---- Prompts ---------------------------------------------------------------

export const SYSTEM_PROMPT = `Ти — автор «фішок» для навчального застосунку, який робить із розробника топового JavaScript-інженера.
Тон — розумний друг-сеньйор: коротко, точно, з гумором, без води. Мова — українська; терміни англійською в \`code\` там, де так кажуть на співбесідах. Звертайся на «ти».

Фішка — одна ідея на 20–40 секунд, яку хочеться переслати другу: несподіваний факт, пастка, трюк або «чому саме так».

Поля кожної фішки:
- emoji: рівно один емодзі-якір.
- title: гачок до 60 символів, без емодзі і без крапки в кінці.
- body: Markdown до 280 символів, 1–3 речення; можна \`inline code\` і **жирний**; без заголовків, списків, посилань і блоків коду.
- code: опційно, до 6 рядків JavaScript без \`\`\`. Має запускатися як є в Node.js 22: без import/require, DOM, мережі й файлів. Очікуваний вивід — коментарем \`// → значення\` у тому ж рядку. Немає коду — null.
- expectsError: true лише коли код навмисно кидає помилку і фішка саме про неї.
- topic: 2–4 слова; для новин — «Новини: <про що>».
- chapterId / newsId: з вхідних даних, звідки ідея; інакше null.
- refUrl: для фішок з розділів — сторінка MDN, tc39.es, javascript.info, v8.dev або nodejs.org саме про цю тему, лише якщо ти точно знаєш, що вона існує; інакше null. Для новин — null.

Жорсткі правила точності:
1. Кожне твердження — правда за ECMAScript і MDN. Не спрощуй до неправди; якщо спрощуєш — так і скажи («спрощено»).
2. Жодних вигаданих API, методів, опцій, прапорців, версій, дат чи цифр. Не впевнений на 100 % — бери іншу ідею.
3. Код реально виконується, а кожен коментар \`// →\` збігається з фактичним виводом. Не будуй фішку на поведінці, що залежить від середовища чи рушія, якщо не кажеш про це прямо.
4. Новини: лише те, що випливає із заголовка й опису та загальновідомих фактів; не вигадуй деталей релізу. Поясни за 1 хвилину, що сталося і чому це важливо JS-розробнику. newsId обов'язковий.
5. Розділи: спирайся на уривок, але дай новий кут — глибший факт, пастку чи трюк, яких немає серед наявних фішок. Не повторюй наявні заголовки та ідеї.
6. Одна фішка — одна ідея. Жодних дисклеймерів про AI.`

const REASON: Record<ChapterTopic['reason'], string> = {
  weak: 'слабка тема учня — закрий типову помилку чи пастку',
  current: 'учень читає це зараз — поглиб матеріал',
  random: 'для різноманітності',
}

function newsBlock(n: NewsTopic): string {
  return [`[${n.key}] ${n.title}`, `Джерело: ${n.source} · ${n.url}`, n.summary ? `Опис: ${n.summary.slice(0, 600)}` : 'Опис: —'].join('\n')
}

function chapterBlock(c: ChapterTopic): string {
  const existing = c.existingReelTitles.length ? c.existingReelTitles.map((t) => `- ${t}`).join('\n') : '- (немає)'
  return [`### ${c.chapterId} — ${c.title} · фішок: ${c.reels} · ${REASON[c.reason]}`, 'Наявні фішки (не повторюй):', existing, 'Уривок:', '"""', c.excerpt || '(порожньо)', '"""'].join('\n')
}

export function buildPrompt(plan: TopicPlan, avoidTitles: readonly string[] = [], today = new Date().toISOString().slice(0, 10)): string {
  const parts = [`Сьогодні ${today}. Згенеруй рівно ${plan.ask} фішок.`]
  if (plan.news.length) parts.push(`## Новини JS за останні 48 год (по одній фішці на кожну)\n\n${plan.news.map(newsBlock).join('\n\n')}`)
  if (plan.chapters.length) parts.push(`## Розділи посібника\n\n${plan.chapters.map(chapterBlock).join('\n\n')}`)
  if (avoidTitles.length) parts.push(`## Уже були нещодавно (не повторюй ці ідеї)\n${avoidTitles.slice(0, 80).map((t) => `- ${t}`).join('\n')}`)
  return parts.join('\n\n')
}

export const VERIFY_SYSTEM = `Ти — суворий технічний редактор і фактчекер JavaScript (ECMAScript, MDN, Node.js). Перевір кожну фішку й поверни вердикт для кожного index:
- keep — усе правдиво, код коректний, коментарі \`// →\` збігаються з фактичним виводом.
- fix — дрібна вада (неточне формулювання, хибний коментар виводу, задовгий текст): поверни виправлені title, body, code повністю, з тими ж обмеженнями (title ≤ 60, body ≤ 280 без блоків коду, code ≤ 6 рядків або null).
- drop — фактична помилка по суті, вигадане API / опція / версія / цифра, неперевірюване чи спекулятивне твердження, або новинна фішка стверджує те, чого немає в описі джерела.
Будь консервативним: сумніваєшся — drop. «Sandbox» — реальний результат виконання коду в Node.js (таймери емулюються в правильному порядку); якщо коментар \`// →\` йому суперечить — fix або drop.`

interface Candidate {
  reel: StrictReel
  news: NewsTopic | null
  chapter: ChapterTopic | null
  refUrl: string | null
  run: RunResult | null
}

function verifyBlock(c: Candidate, i: number): string {
  const lines = [`### #${i} ${c.reel.emoji} ${c.reel.title}`, `Тема: ${c.reel.topic}`, `Текст: ${c.reel.body}`]
  lines.push(c.reel.code ? `Код:\n\`\`\`js\n${c.reel.code}\n\`\`\`` : 'Код: немає')
  if (c.run) lines.push(`Sandbox: ${codeVerdict(c.run, c.reel.expectsError).note}${c.reel.expectsError ? ' (помилка очікувана)' : ''}`)
  if (c.news) lines.push(`Джерело-новина: ${c.news.title}${c.news.summary ? ` — ${c.news.summary.slice(0, 600)}` : ''}`)
  return lines.join('\n')
}

export function buildVerifyPrompt(items: readonly Candidate[]): string {
  return `Перевір ${items.length} фішок:\n\n${items.map(verifyBlock).join('\n\n')}`
}

// ---- Pipeline --------------------------------------------------------------

export async function generateReels(plan: TopicPlan, opts: GenerateOptions): Promise<GenerateResult> {
  const runCode = opts.runCode ?? ((code: string) => runSnippet(code))
  const checkUrl = opts.checkUrl ?? urlResponds
  const dropped: Dropped[] = []
  if (plan.ask === 0) return { reels: [], dropped, usage: { generate: ZERO, verify: ZERO } }

  const gen = await generateText({
    model: opts.model,
    system: SYSTEM_PROMPT,
    prompt: buildPrompt(plan, opts.avoidTitles, opts.today),
    output: Output.object({ schema: batchSchema, name: 'reels', description: 'Фішки для стрічки' }),
    maxOutputTokens: 8000,
    timeout: 140_000,
  })
  const genUsage = toUsage(gen.usage)

  // Stage 1: strict shape, known references, sources filled from our own data (never from the model).
  const newsByKey = new Map(plan.news.map((n) => [n.key, n]))
  const chapterById = new Map(plan.chapters.map((c) => [c.chapterId, c]))
  const candidates: Candidate[] = []
  for (const raw of gen.output.reels) {
    const parsed = strictReelSchema.safeParse(raw)
    if (!parsed.success) {
      dropped.push({ title: String(raw.title), stage: 'schema', reason: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') })
      continue
    }
    const news = raw.newsId ? (newsByKey.get(raw.newsId) ?? null) : null
    if (raw.newsId && !news) {
      dropped.push({ title: raw.title, stage: 'schema', reason: `невідомий newsId ${raw.newsId}` })
      continue
    }
    const chapter = raw.chapterId ? (chapterById.get(raw.chapterId) ?? null) : null
    const refUrl = !news && isHttpUrl(raw.refUrl) && refSource(raw.refUrl) ? raw.refUrl : null
    candidates.push({ reel: { ...parsed.data, chapterId: chapter?.chapterId ?? null, newsId: news?.key ?? null }, news, chapter, refUrl, run: null })
  }

  // Stage 2: execute the code; unexpected throws / hangs are dropped before spending verify tokens.
  await Promise.all(candidates.map(async (c) => (c.run = c.reel.code ? await runCode(c.reel.code) : null)))
  const runnable = candidates.filter((c) => {
    if (!c.run) return true
    const v = codeVerdict(c.run, c.reel.expectsError)
    if (!v.ok) dropped.push({ title: c.reel.title, stage: 'code', reason: v.note })
    return v.ok
  })

  // Stage 3: an independent fact-check pass. No verdict → not published.
  let verdicts: Verdict[] = []
  let verifyUsage = ZERO
  if (runnable.length) {
    const ver = await generateText({
      model: opts.verifyModel,
      system: VERIFY_SYSTEM,
      prompt: buildVerifyPrompt(runnable),
      output: Output.object({ schema: verdictsSchema, name: 'verdicts' }),
      maxOutputTokens: 6000,
      timeout: 90_000,
    })
    verdicts = ver.output.verdicts
    verifyUsage = toUsage(ver.usage)
  }

  const finals: Candidate[] = []
  for (const [i, c] of runnable.entries()) {
    const v = verdicts.find((x) => x.index === i)
    if (!v) {
      dropped.push({ title: c.reel.title, stage: 'verify', reason: 'немає вердикту' })
      continue
    }
    if (v.verdict === 'drop') {
      dropped.push({ title: c.reel.title, stage: 'verify', reason: v.reason })
      continue
    }
    if (v.verdict === 'fix') {
      if (!v.fix) {
        dropped.push({ title: c.reel.title, stage: 'verify', reason: `fix без виправлення: ${v.reason}` })
        continue
      }
      const fixed = strictReelSchema.safeParse({ ...c.reel, ...v.fix })
      if (!fixed.success) {
        dropped.push({ title: c.reel.title, stage: 'verify', reason: `виправлення не пройшло схему: ${fixed.error.issues[0]?.message ?? ''}` })
        continue
      }
      const run = fixed.data.code ? await runCode(fixed.data.code) : null
      const cv = run ? codeVerdict(run, fixed.data.expectsError) : { ok: true, note: '' }
      if (!cv.ok) {
        dropped.push({ title: fixed.data.title, stage: 'code', reason: `після fix: ${cv.note}` })
        continue
      }
      finals.push({ ...c, reel: fixed.data, run })
      continue
    }
    finals.push(c)
  }

  // Reference links are checked live; a dead link drops the link, not the reel.
  const reels = await Promise.all(
    finals.map(async (c): Promise<FinalReel> => {
      const ref = c.refUrl && (await checkUrl(c.refUrl)) ? c.refUrl : null
      return {
        emoji: c.reel.emoji,
        title: c.reel.title,
        body: composeBody(c.reel.body, c.reel.code),
        // The feed tells news reels apart by this prefix.
        topic: c.news && !c.reel.topic.startsWith('Новини') ? `Новини: ${c.reel.topic}`.slice(0, 40) : c.reel.topic,
        guideId: c.chapter?.guideId ?? null,
        chapterId: c.chapter?.chapterId ?? null,
        sourceUrl: c.news?.url ?? ref,
        sourceTitle: c.news ? c.news.title : ref ? refSource(ref) : null,
      }
    }),
  )
  return { reels, dropped, usage: { generate: genUsage, verify: verifyUsage } }
}
