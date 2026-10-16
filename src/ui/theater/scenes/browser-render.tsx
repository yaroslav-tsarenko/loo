import { defineScene, erase } from '../define'
import type { AnyScene, SceneViewProps } from '../types'

interface S {
  stage: number
  html: string
  css: string
  dom: number
  layout: number
  paint: number
  layers: number
}

const STAGES = ['Байти', 'DOM', 'CSSOM', 'Render tree', 'Layout', 'Paint', 'Composite']

const HTML = `<header>Кавʼярня</header>
<main>
  <h1>Флет вайт</h1>
  <p class="price">95 ₴</p>
  <button>Купити</button>
  <p hidden>Промо</p>
</main>
<script src="app.js"></script>`

const CSS = `header { position: sticky; top: 0 }
.price { color: green }
button { will-change: transform }`

const DOM: Array<[string, number, boolean]> = [
  ['html', 0, true],
  ['head', 1, false],
  ['body', 1, true],
  ['header', 2, true],
  ['main', 2, true],
  ['h1', 3, true],
  ['p.price', 3, true],
  ['button', 3, true],
  ['p[hidden]', 3, false],
  ['script', 2, false],
]

const RULES = [
  ['header', 'position: sticky; top: 0'],
  ['.price', 'color: green'],
  ['button', 'will-change: transform'],
  ['[hidden] (UA)', 'display: none'],
]

const BOXES: Array<[string, string]> = [
  ['header', '0, 0 · 360×44'],
  ['h1', '16, 60 · 328×32'],
  ['p.price', '16, 100 · 328×22'],
  ['button', '16, 134 · 120×40'],
]

const PAINT = ["fillRect header #3b2a20", "drawText 'Кавʼярня'", "drawText 'Флет вайт'", "drawText '95 ₴' green", "fillRect button #2383e2", "drawText 'Купити' white"]
const LAYERS = [
  ['Root layer', 'увесь документ'],
  ['header', 'sticky: прокручується окремо'],
  ['button', 'will-change: transform'],
]

function Page({ s }: { s: S }) {
  const laid = s.stage >= 4
  const painted = s.stage >= 5 ? s.paint : 0
  const split = s.stage >= 6 ? s.layers : 0
  return (
    <div className="br-page" data-laid={laid ? '' : undefined} style={{ ['--paint' as string]: painted, ['--split' as string]: split }}>
      <div className="br-layer br-header" data-demo="box-header" style={{ opacity: laid ? 1 : 0, transform: `translate(${split * 14}px, ${split * -10}px)` }}>
        <span>Кавʼярня</span>
        {laid && painted < 1 ? <em>360×44</em> : null}
      </div>
      <div className="br-layer br-root" style={{ opacity: laid ? 1 : 0 }}>
        <div className="br-h1">
          <span>Флет вайт</span>
          {laid && painted < 1 ? <em>328×32</em> : null}
        </div>
        <div className="br-price">
          <span>95 ₴</span>
          {laid && painted < 1 ? <em>328×22</em> : null}
        </div>
        <div className="br-btn" data-demo="box-button" style={{ transform: `translate(${split * 22}px, ${split * 12}px)` }}>
          <span>Купити</span>
        </div>
      </div>
      {!laid ? <div className="br-blank">{s.stage === 0 ? 'Порожній екран: прийшли лише байти' : 'Ще нічого не намальовано'}</div> : null}
    </div>
  )
}

function Panel({ s }: { s: S }) {
  if (s.stage <= 1) {
    return (
      <>
        <pre className="br-src">{s.html}</pre>
        <div className="br-tree" data-demo="dom">
          {DOM.slice(0, s.dom).map(([name, depth]) => (
            <div key={name} style={{ paddingLeft: depth * 14 }}>
              {name}
            </div>
          ))}
        </div>
      </>
    )
  }
  if (s.stage === 2) {
    return (
      <>
        <pre className="br-src">{s.css}</pre>
        <div className="br-tree" data-demo="cssom">
          {RULES.map(([sel, decl]) => (
            <div key={sel}>
              <b>{sel}</b> {'{'} {decl} {'}'}
            </div>
          ))}
        </div>
      </>
    )
  }
  if (s.stage === 3) {
    return (
      <div className="br-tree" data-demo="render-tree">
        {DOM.map(([name, depth, visible]) => (
          <div key={name} style={{ paddingLeft: depth * 14 }} data-out={visible ? undefined : ''} data-demo={name === 'p[hidden]' ? 'hidden-node' : undefined}>
            {name}
            {visible ? null : <em> — не рендериться</em>}
          </div>
        ))}
      </div>
    )
  }
  if (s.stage === 4) {
    return (
      <div className="br-tree" data-demo="boxes">
        {BOXES.map(([name, geo]) => (
          <div key={name}>
            <b>{name}</b> <span className="br-dim">x, y · w×h = {geo}</span>
          </div>
        ))}
      </div>
    )
  }
  if (s.stage === 5) {
    return (
      <div className="br-tree" data-demo="paint">
        {PAINT.slice(0, Math.max(1, Math.round(s.paint * PAINT.length))).map((p) => (
          <div key={p}>{p}</div>
        ))}
      </div>
    )
  }
  return (
    <div className="br-tree" data-demo="layers">
      {LAYERS.map(([name, why]) => (
        <div key={name}>
          <b>{name}</b> <span className="br-dim">{why}</span>
        </div>
      ))}
    </div>
  )
}

function View({ s }: SceneViewProps<S>) {
  return (
    <div className="br">
      <div className="br-stage">
        <Page s={s} />
      </div>
      <div className="br-side">
        <ol className="br-steps">
          {STAGES.map((name, i) => (
            <li key={name} data-on={i === s.stage ? '' : undefined} data-done={i < s.stage ? '' : undefined}>
              {name}
            </li>
          ))}
        </ol>
        <div className="br-panel">
          <Panel s={s} />
        </div>
      </div>
    </div>
  )
}

const pipeline = defineScene<S>({
  id: 'browser-render/pipeline',
  title: 'Критичний шлях рендерингу',
  summary: 'Браузер перетворює HTML і CSS на DOM, CSSOM і render tree, рахує layout, малює і збирає шари.',
  url: 'https://coffee.example/',
  device: 'desktop',
  initial: { stage: 0, html: '', css: '', dom: 0, layout: 0, paint: 0, layers: 0 },
  View,
  script: ({ caption, set, stream, tween, wait, highlight }) => [
    caption('HTML приходить байтами й розбирається в DOM'),
    set({ stage: 1 }),
    stream('html', HTML, { ms: 12 }),
    tween('dom', DOM.length, 900, { ease: 'linear' }),
    highlight('dom', 'Кожен тег стає вузлом дерева DOM — навіть head і script'),
    caption('CSS розбирається в CSSOM'),
    set({ stage: 2 }),
    stream('css', CSS, { ms: 14 }),
    highlight('cssom', 'Правила з таблиць стилів і браузерні стилі за замовчуванням ([hidden] → display: none)'),
    caption('DOM + CSSOM = render tree: лише те, що буде видно'),
    set({ stage: 3 }),
    highlight('hidden-node', 'display: none не потрапляє в render tree; visibility: hidden — потрапляє, бо займає місце'),
    caption('Layout рахує геометрію кожного блоку'),
    set({ stage: 4 }),
    highlight('boxes', 'Позиції й розміри залежать від ширини вікна — тому resize запускає layout знову'),
    caption('Paint записує команди малювання'),
    set({ stage: 5 }),
    tween('paint', 1, 1400, { ease: 'linear' }),
    caption('Composite збирає шари — часто на GPU'),
    set({ stage: 6 }),
    tween('layers', 1, 700),
    highlight('layers', 'transform і opacity шарів змінюються без нового layout і paint — тому вони найдешевші для анімацій'),
    tween('layers', 0, 700),
    wait(800),
  ],
})

export const scenes: Record<string, AnyScene> = { pipeline: erase(pipeline) }
