import { tok, type Frame, type StepScenario, type Token } from '../engine/types'
import { countSteps, run, type Span, type TraceEvent, type TraceKind } from './matcher'

export interface RegexFrame extends Frame {
  pattern: string
  input: string
  // active part of the pattern
  span: Span | null
  pos: number
  start: number
  kind: TraceKind | 'skip'
  // steps taken so far (engine events)
  step: number
  // latest events, newest last
  log: Token[]
  // final match text ('' = empty match), null while searching / no match
  result: string | null
}

export interface RegexExample {
  id: string
  pattern: string
  input: string
  title: string
  intro: string
  outro: string
  skip?: string
}

export const REGEX_EXAMPLES: readonly RegexExample[] = [
  {
    id: 'greedy',
    pattern: '<.+>',
    input: '<a><b>',
    title: 'жадібний',
    intro: 'Шукаємо /<.+>/ у «<a><b>». Квантифікатор + жадібний: спершу бере стільки символів, скільки може, і віддає їх лише тоді, коли решта шаблону не сходиться.',
    outro: 'Збіг — увесь рядок «<a><b>», а не «<a>». Жадібний .+ проковтнув усе до кінця і відступив лише на один символ — до ОСТАННЬОГО «>».',
  },
  {
    id: 'lazy',
    pattern: '<.+?>',
    input: '<a><b>',
    title: 'лінивий',
    intro: 'Той самий рядок, але /<.+?>/. Знак ? після + робить квантифікатор лінивим: він бере мінімум і додає по одному символу, лише коли решта шаблону провалюється.',
    outro: 'Збіг — «<a>»: лінивий .+? зупинився на ПЕРШОМУ «>». Жадібність не змінює, ЧИ є збіг, — вона змінює, ЯКИЙ збіг знайдеться першим.',
  },
  {
    id: 'alternation',
    pattern: '(cat|car)s',
    input: 'cars',
    title: 'альтернатива',
    intro: 'Альтернатива | — теж точка вибору. Рушій пробує варіанти зліва направо і повертається до наступного, якщо далі щось не зійшлося.',
    outro: 'Збіг «cars»: перший варіант cat провалився на третій літері, рушій відступив до | і взяв car. Порядок альтернатив важливий — виграє перша, що дає повний збіг.',
  },
  {
    id: 'catastrophic',
    pattern: '(a+)+b',
    input: 'aaaac',
    title: 'катастрофа',
    intro: '/(a+)+b/ у «aaaac». Літери b немає, тож збігу не буде, але рушій цього не знає: вкладені квантифікатори дають безліч способів поділити «aaaa» між внутрішнім і зовнішнім +.',
    outro: 'Збігу немає, але щоб це довести, рушій перебрав кожне розбиття «aaaa» з кожного старту. Додай одну «a» — і кроків стане приблизно вдвічі більше.',
    skip: 'внутрішній a+ і зовнішній + перебирають інші розбиття «aaaa»: (aaa)(a), (aa)(aa), (a)(aaa)…, а потім те саме для «aaa» і «aa» з наступних стартів. Кожне закінчується провалом на «c».',
  },
  {
    id: 'safe',
    pattern: 'a+b',
    input: 'aaaac',
    title: 'без вкладеності',
    intro: 'Для порівняння — /a+b/ без вкладеного квантифікатора. Тут «aaaa» можна взяти лише одним способом на кожен старт: a+ просто віддає символи по одному.',
    outro: 'Також збігу немає, але кроків у рази менше: на кожному старті a+ віддає символи лінійно, без комбінаторного вибуху. Так виглядає виправлений шаблон.',
  },
]

export type RegexExampleId = (typeof REGEX_EXAMPLES)[number]['id']

const MAX_FRAMES = 60
const HEAD = 44
const TAIL = 14
const LOG_SIZE = 4

function exampleCode(ex: RegexExample): string {
  return `const re = /${ex.pattern}/
console.log('${ex.input}'.match(re)?.[0])`
}

const q = (s: string) => `«${s}»`

function describe(label: string): string {
  if (label === '.') return '«.» (будь-який символ)'
  if (label === '\\d') return '\\d (цифра)'
  if (label === '\\w') return '\\w (літера/цифра/_)'
  if (label === '\\s') return '\\s (пробіл)'
  if (label.startsWith('[')) return `клас ${label}`
  return q(label)
}

const atomQuant = (label: string) => !label.startsWith('(')

function note(e: TraceEvent, ex: RegexExample, steps: number): string {
  switch (e.kind) {
    case 'start':
      return e.start === 0 ? ex.intro : `Усі варіанти зі старту ${e.start - 1} вичерпано → зсуваємо старт на позицію ${e.start} і прикладаємо шаблон знову.`
    case 'char-ok':
      return `${describe(e.label)} збігається з ${q(e.ch ?? '')} на позиції ${e.pos} → рухаємося далі по шаблону і рядку.`
    case 'char-fail':
      return e.ch === undefined
        ? `${describe(e.label)} — а рядок уже закінчився (позиція ${e.pos}). Провал гілки → повертаємося до останньої точки вибору.`
        : `${describe(e.label)} не збігається з ${q(e.ch)} на позиції ${e.pos}. Провал гілки → повертаємося до останньої точки вибору.`
    case 'anchor-ok':
      return e.label === '^' ? '^ — початок рядка, ми на позиції 0 ✓.' : '$ — кінець рядка, далі символів немає ✓.'
    case 'anchor-fail':
      return e.label === '^' ? `^ вимагає позицію 0, а ми на ${e.pos} → провал.` : `$ вимагає кінця рядка, а на позиції ${e.pos} ще ${q(ex.input[e.pos] ?? '')} → провал.`
    case 'quant-stop':
      return `${q(e.label)} більше повторитися не може: жадібно взято ×${e.count}. Тепер пробуємо решту шаблону з позиції ${e.pos}.`
    case 'give-back':
      return `Решта шаблону не зійшлася → backtracking: ${q(e.label)} віддає останнє повторення${atomQuant(e.label) ? ' (один символ)' : ''}, лишається ×${e.count}. Пробуємо решту з позиції ${e.pos}.`
    case 'lazy-rest':
      return `Лінивий ${q(e.label)} має ×${e.count} — цього вже досить, тож спершу пробуємо решту шаблону з позиції ${e.pos}.`
    case 'lazy-more':
      return `Решта шаблону не зійшлася → лінивий ${q(e.label)} неохоче бере ще одне повторення (було ×${e.count}).`
    case 'alt-next':
      return `Попередній варіант не підійшов → backtracking до «|»: пробуємо варіант ${q(e.label)} з тієї ж позиції ${e.pos}.`
    case 'success':
      return ex.outro
    case 'no-match':
      return `${ex.outro} Разом кроків: ${steps}.`
  }
}

function logLabel(e: TraceEvent): string {
  switch (e.kind) {
    case 'start':
      return `▶ старт з ${e.start}`
    case 'char-ok':
      return `✓ ${e.label} = '${e.ch}' @${e.pos}`
    case 'char-fail':
      return `✗ ${e.label} ≠ ${e.ch === undefined ? 'кінець' : `'${e.ch}'`} @${e.pos}`
    case 'anchor-ok':
      return `✓ ${e.label} @${e.pos}`
    case 'anchor-fail':
      return `✗ ${e.label} @${e.pos}`
    case 'quant-stop':
      return `■ ${e.label} ×${e.count}`
    case 'give-back':
      return `↩ ${e.label} віддає → ×${e.count}`
    case 'lazy-rest':
      return `→ ${e.label} ×${e.count}, далі`
    case 'lazy-more':
      return `↩ ${e.label} бере ще`
    case 'alt-next':
      return `↩ | → ${e.label}`
    case 'success':
      return '✅ збіг'
    case 'no-match':
      return '❌ null'
  }
}

export function buildRegexScenario(id: string): StepScenario<RegexFrame> {
  const ex = REGEX_EXAMPLES.find((e) => e.id === id) ?? REGEX_EXAMPLES[0]!
  const result = run(ex.pattern, ex.input)
  const events = result.events
  const log: Token[] = []
  const all: RegexFrame[] = events.map((e, i) => {
    log.push(tok(`e${i + 1}`, logLabel(e)))
    const done = e.kind === 'success' ? (result.match?.text ?? '') : null
    return {
      line: 2,
      note: note(e, ex, result.steps),
      pattern: ex.pattern,
      input: ex.input,
      span: e.span,
      pos: e.pos,
      start: e.start,
      kind: e.kind,
      step: i + 1,
      log: log.slice(-LOG_SIZE),
      result: done,
    }
  })
  let frames = all
  if (all.length > MAX_FRAMES) {
    const head = all.slice(0, HEAD)
    const tail = all.slice(-TAIL)
    const skipped = all.length - HEAD - TAIL
    const last = head.at(-1)!
    const skip: RegexFrame = {
      ...last,
      kind: 'skip',
      span: null,
      step: last.step + skipped,
      log: [...last.log.slice(-(LOG_SIZE - 1)), tok('skip', `⏩ пропущено ${skipped}`)],
      note: `⏩ Пропущено кроків: ${skipped}. Тут ${ex.skip ?? 'рушій продовжує перебирати варіанти.'}`,
    }
    frames = [...head, skip, ...tail]
  }
  return { code: exampleCode(ex), frames }
}

// Step counts of the same engine for growing inputs: nested vs flat quantifier
export function explosionTable(from = 4, to = 10): Array<{ n: number; nested: number; flat: number }> {
  const rows: Array<{ n: number; nested: number; flat: number }> = []
  for (let n = from; n <= to; n++) {
    const s = 'a'.repeat(n) + 'c'
    rows.push({ n, nested: countSteps('(a+)+b', s), flat: countSteps('a+b', s) })
  }
  return rows
}
