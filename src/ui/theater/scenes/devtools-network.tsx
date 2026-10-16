import { Save, X } from 'lucide-react'
import { PixelIcon } from '@/ui/design/PixelIcon'
import { defineScene, erase } from '../define'
import type { AnyScene, SceneViewProps } from '../types'
import { DevTools, PageStrip, ToolIcon } from './kit'

interface Row {
  id: string
  name: string
  method: string
  status: string
  type: string
  initiator: string
  size: string
  time: string
  // waterfall position, ms from navigation start
  start: number
  dur: number
  tone?: 'preflight' | 'cache' | 'muted'
}

interface S {
  rows: Row[]
  selected: string | null
  // grows the newest waterfall bars
  grow: number
  saved: boolean
}

type Pair = [string, string, string?]

interface Details {
  general: Pair[]
  response: Pair[]
  request: Pair[]
}

const WATERFALL_MS = 1400

const pageLoad: Row[] = [
  { id: 'doc', name: 'orders', method: 'GET', status: '200', type: 'document', initiator: 'Other', size: '4.1 kB', time: '62 ms', start: 0, dur: 62, tone: 'muted' },
  { id: 'js', name: 'app.js', method: 'GET', status: '200', type: 'script', initiator: 'orders', size: '48.2 kB', time: '95 ms', start: 70, dur: 95, tone: 'muted' },
  { id: 'logo', name: 'logo.svg', method: 'GET', status: '200', type: 'svg+xml', initiator: 'orders', size: '3.2 kB', time: '40 ms', start: 75, dur: 40, tone: 'muted' },
]

const preflight: Row = { id: 'pre', name: 'orders', method: 'OPTIONS', status: '204', type: 'preflight', initiator: 'Preflight', size: '0 B', time: '41 ms', start: 900, dur: 41, tone: 'preflight' }
const post: Row = { id: 'post', name: 'orders', method: 'POST', status: '201', type: 'fetch', initiator: 'app.js:42', size: '312 B', time: '88 ms', start: 944, dur: 88 }

const reloaded: Row[] = [
  { id: 'doc2', name: 'orders', method: 'GET', status: '304', type: 'document', initiator: 'Other', size: '220 B', time: '35 ms', start: 0, dur: 35 },
  { id: 'js2', name: 'app.js', method: 'GET', status: '304', type: 'script', initiator: 'orders', size: '180 B', time: '28 ms', start: 42, dur: 28 },
  { id: 'logo2', name: 'logo.svg', method: 'GET', status: '200', type: 'svg+xml', initiator: 'orders', size: '(memory cache)', time: '0 ms', start: 44, dur: 1, tone: 'cache' },
]

const DETAILS: Record<string, Details> = {
  pre: {
    general: [
      ['Request URL', 'https://api.example/orders'],
      ['Request Method', 'OPTIONS', 'h-method'],
      ['Status Code', '204 No Content'],
    ],
    response: [
      ['access-control-allow-headers', 'content-type'],
      ['access-control-allow-methods', 'GET, POST, PUT'],
      ['access-control-allow-origin', 'https://app.example', 'h-allow-pre'],
      ['access-control-max-age', '600'],
    ],
    request: [
      ['access-control-request-headers', 'content-type', 'h-ask'],
      ['access-control-request-method', 'POST'],
      ['origin', 'https://app.example'],
    ],
  },
  post: {
    general: [
      ['Request URL', 'https://api.example/orders'],
      ['Request Method', 'POST'],
      ['Status Code', '201 Created'],
    ],
    response: [
      ['access-control-allow-origin', 'https://app.example', 'h-allow'],
      ['content-type', 'application/json'],
    ],
    request: [
      ['content-type', 'application/json'],
      ['origin', 'https://app.example'],
    ],
  },
  js2: {
    general: [
      ['Request URL', 'https://app.example/app.js'],
      ['Request Method', 'GET'],
      ['Status Code', '304 Not Modified', 'h-304'],
    ],
    response: [
      ['cache-control', 'no-cache'],
      ['etag', '"7f3a9c"'],
    ],
    request: [['if-none-match', '"7f3a9c"', 'h-inm']],
  },
}

function Waterfall({ row, grow, fresh }: { row: Row; grow: number; fresh: boolean }) {
  const left = (row.start / WATERFALL_MS) * 100
  const width = Math.max(0.6, (row.dur / WATERFALL_MS) * 100 * (fresh ? grow : 1))
  return (
    <span className="dn-wf">
      <span className="dn-wf-bar" data-tone={row.tone} style={{ left: `${left}%`, width: `${width}%` }} />
    </span>
  )
}

function Section({ title, pairs }: { title: string; pairs: Pair[] }) {
  return (
    <div className="dn-section">
      <div className="dn-section-title">▾ {title}</div>
      {pairs.map(([k, v, demo]) => (
        <div key={k} className="dn-pair" data-demo={demo}>
          <span className="dn-k">{k}</span>
          <span className="dn-v">{v}</span>
        </div>
      ))}
    </div>
  )
}

function View({ s }: SceneViewProps<S>) {
  const details = s.selected ? DETAILS[s.selected] : null
  const latest = s.rows.at(-1)?.id
  return (
    <div className="sc-split">
      <PageStrip>
        <span className="sc-page-logo">
          <PixelIcon name="box" size={22} />
        </span>
        <span className="sc-page-title">app.example — Замовлення</span>
        <span className="sc-page-btn" data-demo="save" data-done={s.saved ? '' : undefined}>
          {s.saved ? (
            '✓ Збережено'
          ) : (
            <>
              <Save size={13} strokeWidth={2} aria-hidden="true" /> Зберегти
            </>
          )}
        </span>
      </PageStrip>
      <DevTools
        tab="Network"
        toolbar={
          <>
            <ToolIcon kind="record" on />
            <ToolIcon kind="clear" />
            <ToolIcon kind="reload" demo="reload" />
            <span className="dt-filter">
              <ToolIcon kind="filter" />
              Filter
            </span>
            <span className="dn-chips">
              <span data-on="">All</span>
              <span>Fetch/XHR</span>
              <span>Doc</span>
              <span>JS</span>
            </span>
          </>
        }
      >
        <div className="dn" data-detail={details ? '' : undefined}>
          <div className="dn-table" role="table">
            <div className="dn-row dn-head" role="row">
              <span>Name</span>
              <span>Status</span>
              <span className="dn-c-type">Type</span>
              <span className="dn-c-init">Initiator</span>
              <span className="dn-c-size">Size</span>
              <span>Time</span>
              <span className="dn-c-wf">Waterfall</span>
            </div>
            {s.rows.map((r) => (
              <div key={r.id} className="dn-row" role="row" data-demo={`row-${r.id}`} data-tone={r.tone} data-selected={s.selected === r.id ? '' : undefined} data-status={r.status[0]}>
                <span className="dn-name">
                  {r.name}
                  {r.method !== 'GET' ? <em>{r.method}</em> : null}
                </span>
                <span className="dn-status">{r.status}</span>
                <span className="dn-c-type">{r.type}</span>
                <span className="dn-c-init">{r.initiator}</span>
                <span className="dn-c-size">{r.size}</span>
                <span>{r.time}</span>
                <span className="dn-c-wf">
                  <Waterfall row={r} grow={s.grow} fresh={r.id === latest} />
                </span>
              </div>
            ))}
          </div>
          {details ? (
            <div className="dn-details">
              <div className="dn-details-tabs">
                <X size={12} />
                <span data-on="">Headers</span>
                <span>Payload</span>
                <span>Preview</span>
                <span>Response</span>
                <span>Timing</span>
              </div>
              <div className="dn-details-body">
                <Section title="General" pairs={details.general} />
                <Section title="Response Headers" pairs={details.response} />
                <Section title="Request Headers" pairs={details.request} />
              </div>
            </div>
          ) : null}
          <div className="dn-foot">
            {s.rows.length} requests · {s.rows.some((r) => r.tone === 'cache') ? '52.4 kB resources' : 'transferred'}
          </div>
        </div>
      </DevTools>
    </div>
  )
}

const corsPreflight = defineScene<S>({
  id: 'devtools-network/cors-preflight',
  title: 'CORS preflight у Network',
  summary: 'POST з JSON на інший origin спершу породжує OPTIONS-запит, і лише після дозволу йде сам POST.',
  url: 'https://app.example/orders',
  device: 'desktop',
  initial: { rows: pageLoad, selected: null, grow: 1, saved: false },
  View,
  script: ({ caption, click, set, tween, wait, highlight }) => [
    caption('Сторінка app.example шле fetch POST з JSON на api.example'),
    click('save'),
    set((s) => ({ rows: [...s.rows, preflight], grow: 0 })),
    tween('grow', 1, 500, { ease: 'out' }),
    caption('Спершу браузер сам шле OPTIONS — preflight'),
    set((s) => ({ rows: [...s.rows, post], grow: 0, saved: true })),
    tween('grow', 1, 700, { ease: 'out' }),
    click('row-pre', { selected: 'pre' }),
    highlight('h-ask', 'Браузер питає: чи можна POST із заголовком content-type: application/json?'),
    highlight('h-allow-pre', 'Сервер дозволяє цей origin, методи й заголовки; max-age кешує відповідь на 10 хв'),
    caption('Дозвіл отримано — тепер справжній POST'),
    click('row-post', { selected: 'post' }),
    highlight('h-allow', 'Без access-control-allow-origin у відповіді JS отримав би CORS error, хоча запит до сервера дійшов'),
    wait(800),
  ],
})

const cacheRevalidate = defineScene<S>({
  id: 'devtools-network/cache-revalidate',
  title: '304 Not Modified у Network',
  summary: 'Після перезавантаження браузер перевіряє кеш через ETag і отримує 304 без тіла.',
  url: 'https://app.example/orders',
  device: 'desktop',
  initial: { rows: pageLoad, selected: null, grow: 1, saved: false },
  View,
  script: ({ caption, click, set, tween, wait, highlight }) => [
    caption('Перше завантаження: усе прийшло з мережі зі статусом 200'),
    highlight('row-js', 'app.js — 48.2 kB тіла, сервер додав ETag і cache-control: no-cache'),
    caption('Перезавантажуємо сторінку'),
    click('reload'),
    set({ rows: [], grow: 0 }),
    wait(300),
    set({ rows: reloaded }),
    tween('grow', 1, 600, { ease: 'out' }),
    highlight('row-logo2', 'logo.svg свіжий (max-age), тож узятий з кешу без жодного запиту — 0 ms'),
    caption('app.js перевіряється умовним запитом'),
    click('row-js2', { selected: 'js2' }),
    highlight('h-inm', 'Браузер надсилає збережений ETag в if-none-match'),
    highlight('h-304', 'Файл не змінився: 304 без тіла — 180 B замість 48.2 kB'),
    wait(800),
  ],
})

export const scenes: Record<string, AnyScene> = {
  'cors-preflight': erase(corsPreflight),
  'cache-revalidate': erase(cacheRevalidate),
}
