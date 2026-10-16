import type { Frame, StepScenario } from '../engine/types'

export const PAYLOAD = '<img src=x onerror=alert(1)>'

export type XssSink = 'innerHTML' | 'textContent' | 'DOMPurify' | 'setHTML' | 'TrustedHTML'

export interface DomAttr {
  name: string
  value: string
  danger?: boolean
  removed?: boolean
}

export interface DomNode {
  id: string
  // '#text' for text nodes
  tag: string
  text?: string
  attrs?: DomAttr[]
  // short label next to the node, e.g. "не виконується"
  flag?: string
  tone?: 'danger' | 'safe' | 'muted'
}

export type PagePart = { kind: 'text'; text: string } | { kind: 'img' }

export interface XssFrame extends Frame {
  // value of ?q= as the user sees it in the address bar
  query: string
  // source → variable → sink highlight
  stage: 'url' | 'source' | 'sink'
  q: string | null
  sink: { name: XssSink; tone: 'danger' | 'safe' | 'blocked' } | null
  // children of #results; null = nothing inserted yet
  tree: DomNode[] | null
  page: PagePart[]
  alert?: string
  verdict?: { tone: 'danger' | 'safe' | 'blocked'; text: string }
  output: string[]
  error?: string
}

const code = `// https://shop.example/search?q=<img src=x onerror=alert(1)>
const q = new URLSearchParams(location.search).get('q')

// ✗ sink: рядок стає HTML-розміткою
results.innerHTML = 'Шукали: ' + q

// ✓ текст, а не HTML
results.textContent = 'Шукали: ' + q

// ✓ санітизація прибирає onerror
results.innerHTML = DOMPurify.sanitize('Шукали: ' + q)
results.setHTML('Шукали: ' + q) // Sanitizer API

// ✓ CSP: require-trusted-types-for 'script'
results.innerHTML = 'Шукали: ' + q // ✗ TypeError
const policy = trustedTypes.createPolicy('app', {
  createHTML: (s) => DOMPurify.sanitize(s),
})
results.innerHTML = policy.createHTML('Шукали: ' + q)`

const label = (): DomNode => ({ id: 'label', tag: '#text', text: '"Шукали: "' })
const img = (attrs: DomAttr[], tone: DomNode['tone'], flag?: string): DomNode => ({ id: 'img', tag: 'img', attrs, tone, flag })
const evil = [
  { name: 'src', value: 'x' },
  { name: 'onerror', value: 'alert(1)', danger: true },
]
const cleaned = [
  { name: 'src', value: 'x' },
  { name: 'onerror', value: 'alert(1)', removed: true },
]
const brokenPage: PagePart[] = [{ kind: 'text', text: 'Шукали: ' }, { kind: 'img' }]
const base = { query: PAYLOAD, q: PAYLOAD, output: [] as string[] }

const domSink: StepScenario<XssFrame> = {
  code,
  frames: [
    { line: 1, ...base, q: null, stage: 'url', sink: null, tree: null, page: [], note: 'Атакувальник надсилає жертві посилання з payload у ?q=. Для сервера це звичайний пошуковий запит, а небезпека чекає у фронтенд-коді.' },
    { line: 2, ...base, stage: 'source', sink: null, tree: null, page: [], note: 'Source: location.search контролює будь-хто, хто дав посилання. URLSearchParams декодує %3C у «<», і q — це рядок з розміткою.' },
    { line: 5, ...base, stage: 'sink', sink: { name: 'innerHTML', tone: 'danger' }, tree: [label(), img(evil, 'danger')], page: brokenPage, note: 'Sink: innerHTML віддає рядок HTML-парсеру. Той будує справжній DOM — текстовий вузол і елемент <img> з атрибутом onerror.' },
    {
      line: 5,
      ...base,
      stage: 'sink',
      sink: { name: 'innerHTML', tone: 'danger' },
      tree: [label(), img(evil, 'danger', 'onerror спрацював')],
      page: brokenPage,
      alert: '1',
      verdict: { tone: 'danger', text: 'DOM XSS: чужий код виконано у твоєму origin' },
      output: [],
      note: 'Браузер вантажить src="x", отримує помилку й запускає обробник onerror — код атакувальника виконується з доступом до DOM, cookie без HttpOnly і localStorage.',
    },
    {
      line: 5,
      ...base,
      query: '<script>alert(1)</script>',
      q: '<script>alert(1)</script>',
      stage: 'sink',
      sink: { name: 'innerHTML', tone: 'danger' },
      tree: [label(), { id: 'script', tag: 'script', text: 'alert(1)', tone: 'muted', flag: 'не виконується' }],
      page: [{ kind: 'text', text: 'Шукали: ' }],
      note: 'Для порівняння: <script> через innerHTML парсер позначає як «already started», і він не виконується. Саме тому атакують через обробники: onerror, onload у <svg>.',
    },
    { line: 8, ...base, stage: 'sink', sink: { name: 'textContent', tone: 'safe' }, tree: [{ id: 'text', tag: '#text', text: `"Шукали: ${PAYLOAD}"`, tone: 'safe' }], page: [{ kind: 'text', text: `Шукали: ${PAYLOAD}` }], verdict: { tone: 'safe', text: 'безпечно: лише текст' }, note: 'textContent не викликає HTML-парсер: весь рядок стає одним текстовим вузлом. Користувач бачить «<img…>» як символи, а не як тег.' },
    { line: 11, ...base, stage: 'sink', sink: { name: 'DOMPurify', tone: 'safe' }, tree: [label(), img(cleaned, 'safe')], page: brokenPage, verdict: { tone: 'safe', text: 'безпечно: onerror вирізано' }, note: 'DOMPurify розбирає рядок в інертному документі, вирізає скрипти, обробники on* і javascript:-посилання й віддає чистий HTML. Картинка лишається, але без обробника.' },
    { line: 12, ...base, stage: 'sink', sink: { name: 'setHTML', tone: 'safe' }, tree: [label(), img(cleaned, 'safe')], page: brokenPage, verdict: { tone: 'safe', text: 'безпечно: вбудований санітайзер' }, note: 'setHTML (HTML Sanitizer API) робить те саме нативно, одним проходом парсера. Скрипти й обробники подій він прибирає завжди, навіть з власним конфігом.' },
    {
      line: 15,
      ...base,
      stage: 'sink',
      sink: { name: 'TrustedHTML', tone: 'blocked' },
      tree: null,
      page: [],
      verdict: { tone: 'blocked', text: 'заблоковано: рядок замість TrustedHTML' },
      output: [],
      error: "TypeError: This document requires 'TrustedHTML' assignment.",
      note: 'З CSP require-trusted-types-for \'script\' sink innerHTML більше не приймає рядки — лише об’єкти TrustedHTML. Присвоєння кидає TypeError, і нічого не вставляється.',
    },
    {
      line: 19,
      ...base,
      stage: 'sink',
      sink: { name: 'TrustedHTML', tone: 'safe' },
      tree: [label(), img(cleaned, 'safe')],
      page: brokenPage,
      verdict: { tone: 'safe', text: 'безпечно: HTML лише через політику' },
      error: "TypeError: This document requires 'TrustedHTML' assignment.",
      note: 'TrustedHTML створює лише політика, тож перевіряти на рев’ю треба кілька політик, а не сотні sinks. А strict CSP без \'unsafe-inline\' ще й блокує inline-обробники на кшталт onerror.',
    },
  ],
}

export const xssScenarios: Record<string, StepScenario<XssFrame>> = {
  'dom-sink': domSink,
}
