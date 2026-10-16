import { PixelIcon } from '@/ui/design/PixelIcon'
import { defineScene, erase } from '../define'
import type { AnyScene, SceneViewProps } from '../types'
import { Caret, Code, DevTools, PageStrip } from './kit'

interface S {
  modalOpen: boolean
  // 0 none, 1 leaky snapshot, 2 snapshot after the fix
  snapshot: number
  filter: string
  expanded: boolean
  selected: boolean
  fixed: boolean
}

const ROWS: Array<[string, string, string, string]> = [
  ['(compiled code)', '—', '1 204 kB', '1 204 kB'],
  ['(string)', '2', '611 kB', '611 kB'],
  ['Array', '2', '96 kB', '2 340 kB'],
  ['Object', '2', '58 kB', '1 102 kB'],
  ['HTMLDivElement', '4', '12 kB', '310 kB'],
  ['Window', '1', '0.1 kB', '980 kB'],
]
const DETACHED: [string, string, string, string] = ['Detached HTMLDivElement', '4', '0.2 kB', '1 912 kB']

const RETAINERS: Array<[string, number, string?]> = [
  ['modal in system / Context @38215', 3, 'r-context'],
  ['context in function onKeydown() @38213', 2, 'r-fn'],
  ['handler in EventListener (window, keydown) @38190', 1],
  ['Window / app.example @1', 0],
]

const FIX = ['function close() {', '  modal.remove()', "  window.removeEventListener('keydown', onKeydown)", '}']

function View({ s, focus }: SceneViewProps<S>) {
  const leaking = s.snapshot === 1
  const rows = [...ROWS, ...(leaking ? [DETACHED] : [])].filter(([name]) => name.toLowerCase().includes(s.filter.toLowerCase()))
  return (
    <div className="sc-split">
      <PageStrip>
        <span className="sc-page-logo">
          <PixelIcon name="monitor" size={22} />
        </span>
        <span className="sc-page-title">Модальне вікно</span>
        <span className="sc-page-btn" data-demo="open-modal">
          Відкрити
        </span>
        {s.modalOpen ? (
          <span className="sc-modal" data-demo="close-modal">
            Діалог ✕
          </span>
        ) : null}
      </PageStrip>
      <DevTools tab="Memory">
        <div className="dm">
          <aside className="dm-side">
            <div className="dm-side-title">Profiles</div>
            <div className="dm-side-group">HEAP SNAPSHOTS</div>
            {s.snapshot >= 1 ? <div className="dm-snap" data-on={s.snapshot === 1 ? '' : undefined}>Snapshot 1 · 6.3 MB</div> : null}
            {s.snapshot >= 2 ? <div className="dm-snap" data-on="">Snapshot 2 · 4.4 MB</div> : null}
          </aside>
          <div className="dm-main">
            {s.snapshot === 0 ? (
              <div className="dm-start">
                <div className="dm-radio" data-on="">
                  <span /> Heap snapshot
                </div>
                <div className="dm-radio">
                  <span /> Allocations on timeline
                </div>
                <div className="dm-radio">
                  <span /> Allocation sampling
                </div>
                <span className="dm-take" data-demo="take">
                  Take snapshot
                </span>
              </div>
            ) : (
              <>
                {s.fixed ? (
                  <div className="dm-fix" data-demo="fix">
                    {FIX.map((l, i) => (
                      <div key={i}>
                        <Code text={l} />
                      </div>
                    ))}
                  </div>
                ) : null}
                <div className="dm-toolbar">
                  <span className="dt-select">Summary ▾</span>
                  <span className="dm-filter" data-demo="filter">
                    {s.filter || (focus === 'filter' ? '' : <span className="dm-ph">Class filter</span>)}
                    {focus === 'filter' ? <Caret /> : null}
                  </span>
                  {s.fixed ? <span className="dm-take dm-take-sm" data-demo="take2">Take snapshot</span> : null}
                </div>
                <div className="dm-table">
                  <div className="dm-row dm-head">
                    <span>Constructor</span>
                    <span>Distance</span>
                    <span>Shallow</span>
                    <span>Retained</span>
                  </div>
                  {rows.map(([name, d, sh, rt]) => {
                    const detached = name.startsWith('Detached')
                    return (
                      <div key={name}>
                        <div className="dm-row" data-detached={detached ? '' : undefined} data-demo={detached ? 'detached' : undefined}>
                          <span>
                            <span className="dc-tri" data-open={detached && s.expanded ? '' : undefined} /> {name}
                            {detached ? <em>×1</em> : null}
                          </span>
                          <span>{d}</span>
                          <span>{sh}</span>
                          <span>{rt}</span>
                        </div>
                        {detached && s.expanded ? (
                          <div className="dm-row dm-child" data-demo="node" data-selected={s.selected ? '' : undefined}>
                            <span>{'Detached <div class="modal"> @38220'}</span>
                            <span>4</span>
                            <span>0.2 kB</span>
                            <span>1 912 kB</span>
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                  {rows.length === 0 ? <div className="dm-none" data-demo="none">Немає об’єктів, що відповідають фільтру</div> : null}
                </div>
                {s.selected && leaking ? (
                  <div className="dm-retainers" data-demo="retainers">
                    <div className="dm-row dm-head">
                      <span>Retainers</span>
                      <span>Distance</span>
                    </div>
                    {RETAINERS.map(([label, d, demo], i) => (
                      <div key={label} className="dm-row" data-demo={demo} style={{ paddingLeft: 8 + i * 14 }}>
                        <span>
                          <span className="dc-tri" data-open="" /> {label}
                        </span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </DevTools>
    </div>
  )
}

const detachedDom = defineScene<S>({
  id: 'devtools-memory/detached-dom',
  title: 'Detached DOM у Memory',
  summary: 'Знімок купи знаходить модальне вікно, яке видалили зі сторінки, але досі тримає слухач на window.',
  url: 'https://app.example/modal',
  device: 'desktop',
  initial: { modalOpen: false, snapshot: 0, filter: '', expanded: false, selected: false, fixed: false },
  View,
  script: ({ caption, click, type, set, wait, highlight }) => [
    caption('Відкриваємо й закриваємо модалку'),
    click('open-modal', { modalOpen: true }),
    wait(500),
    click('close-modal', { modalOpen: false }),
    caption('Знімок купи після закриття'),
    click('take', { snapshot: 1 }),
    wait(400),
    type('filter', 'Detached'),
    highlight('detached', 'Detached — вузол прибрали з DOM, але до нього ще веде шлях від коренів, тож GC не може його звільнити'),
    click('detached', { expanded: true }),
    click('node', { selected: true }),
    caption('Retainers показують, хто тримає вузол'),
    highlight('r-context', 'Змінна modal живе в контексті замикання…'),
    highlight('r-fn', '…функції onKeydown, яку ми додали на window і забули зняти'),
    caption('Виправлення: знімаємо слухача при закритті'),
    set({ fixed: true, selected: false, expanded: false }),
    highlight('fix', 'removeEventListener рве ланцюжок window → слухач → замикання → modal'),
    click('take2', { snapshot: 2 }),
    highlight('none', 'У новому знімку відірваних вузлів немає — 1.9 MB звільнено'),
    wait(800),
  ],
})

export const scenes: Record<string, AnyScene> = {
  'detached-dom': erase(detachedDom),
}
