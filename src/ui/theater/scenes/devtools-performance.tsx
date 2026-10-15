import { TriangleAlert } from 'lucide-react'
import { defineScene, erase } from '../define'
import type { AnyScene, SceneViewProps } from '../types'
import { Code, DevTools, PageStrip, ToolIcon } from './kit'

interface S {
  // 0 idle, 1 recording, 2 profile shown
  phase: number
  elapsed: number
  fixed: boolean
  // reveals the flame chart left → right
  reveal: number
}

const BAD = ['for (const card of cards) {', '  const h = card.offsetHeight  // читання', "  card.style.height = h + 10 + 'px' // запис", '}']
const GOOD = ['const hs = cards.map((c) => c.offsetHeight) // усі читання', 'cards.forEach((c, i) => {', "  c.style.height = hs[i] + 10 + 'px' // усі записи", '})']

const SLICES = 12

function Flame({ fixed, reveal }: { fixed: boolean; reveal: number }) {
  const taskMs = fixed ? 24 : 182
  return (
    <div className="dp-flame" style={{ ['--reveal' as string]: `${Math.round(reveal * 100)}%` }}>
      <div className="dp-track">
        <span className="dp-track-label">Frames</span>
        <div className="dp-frames">
          {fixed ? (
            <>
              <span className="dp-frame" data-ok="">16.7 ms</span>
              <span className="dp-frame" data-ok="">16.7 ms</span>
              <span className="dp-frame" data-ok="">16.7 ms</span>
            </>
          ) : (
            <>
              <span className="dp-frame" data-ok="">16.7 ms</span>
              <span className="dp-frame dp-frame-long" data-demo="dropped">
                199.9 ms
              </span>
            </>
          )}
        </div>
      </div>
      <div className="dp-track">
        <span className="dp-track-label">Main</span>
        <div className="dp-main">
          <div className="dp-task" data-long={fixed ? undefined : ''} data-demo="task" style={{ width: fixed ? '22%' : '92%' }}>
            Task · {taskMs} ms
          </div>
          <div className="dp-call" style={{ width: fixed ? '20%' : '90%' }}>
            Function call · resizeCards
          </div>
          <div className="dp-slices" data-demo="layouts" style={{ width: fixed ? '20%' : '90%' }}>
            {fixed ? (
              <span className="dp-js" style={{ flex: 1 }} />
            ) : (
              Array.from({ length: SLICES }, (_, i) => (
                <span key={i} className="dp-pair">
                  <span className="dp-js" />
                  <span className="dp-layout" />
                </span>
              ))
            )}
          </div>
          {fixed ? (
            <div className="dp-after" data-demo="one-layout">
              <span className="dp-layout">Layout</span>
              <span className="dp-paint">Paint</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function Summary({ fixed }: { fixed: boolean }) {
  const rows = fixed
    ? [
        ['Scripting', 9, 'js'],
        ['Rendering', 11, 'layout'],
        ['Painting', 4, 'paint'],
      ]
    : [
        ['Scripting', 48, 'js'],
        ['Rendering', 131, 'layout'],
        ['Painting', 3, 'paint'],
      ]
  return (
    <div className="dp-summary" data-demo="summary">
      {rows.map(([name, ms, tone]) => (
        <div key={name as string} className="dp-sum-row">
          <span className="dp-swatch" data-tone={tone as string} />
          <span>{name}</span>
          <span className="dp-sum-ms">{ms} ms</span>
        </div>
      ))}
    </div>
  )
}

function View({ s }: SceneViewProps<S>) {
  const code = s.fixed ? GOOD : BAD
  return (
    <div className="sc-split">
      <PageStrip>
        <span className="sc-page-logo">🗂️</span>
        <span className="sc-page-title">100 карток змінюють висоту</span>
        <span className="sc-page-cards" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} style={{ height: 10 + ((i * 7) % 14) }} />
          ))}
        </span>
      </PageStrip>
      <DevTools
        tab="Performance"
        toolbar={
          <>
            <span data-demo="record">
              <ToolIcon kind="record" on={s.phase === 1} />
            </span>
            <ToolIcon kind="reload" />
            <ToolIcon kind="clear" />
            <span className="dt-select">☑ Screenshots</span>
            <span className="dt-select">☑ Memory</span>
          </>
        }
      >
        <div className="dp">
          <div className="dp-code" data-demo="code">
            {code.map((l, i) => (
              <div key={i}>
                <Code text={l} />
              </div>
            ))}
          </div>
          {s.phase === 0 ? <div className="dp-empty">Натисніть ● Record і виконайте дію на сторінці</div> : null}
          {s.phase === 1 ? (
            <div className="dp-recording">
              <span className="dp-rec-dot" />
              Recording… {(s.elapsed / 1000).toFixed(1)} s
              <span className="dp-stop" data-demo="stop">
                Stop
              </span>
            </div>
          ) : null}
          {s.phase === 2 ? (
            <>
              <Flame fixed={s.fixed} reveal={s.reveal} />
              {!s.fixed ? (
                <div className="dp-warning" data-demo="warning">
                  <TriangleAlert size={13} /> Forced reflow is a likely performance bottleneck.
                </div>
              ) : null}
              <Summary fixed={s.fixed} />
            </>
          ) : null}
        </div>
      </DevTools>
    </div>
  )
}

const layoutThrashing = defineScene<S>({
  id: 'devtools-performance/layout-thrashing',
  title: 'Layout thrashing у Performance',
  summary: 'Запис профілю показує довгу задачу з десятками примусових layout, а виправлений код — один.',
  url: 'https://app.example/feed',
  device: 'desktop',
  initial: { phase: 0, elapsed: 0, fixed: false, reveal: 0 },
  View,
  script: ({ caption, click, set, tween, wait, highlight }) => [
    caption('Записуємо профіль, поки код змінює висоту 100 карток'),
    click('record', { phase: 1, elapsed: 0 }),
    tween('elapsed', 2400, 1200, { ease: 'linear' }),
    click('stop', { phase: 2, reveal: 0 }),
    tween('reveal', 1, 900, { ease: 'out' }),
    caption('Одна задача на 182 мс — кадр пропущено'),
    highlight('task', 'Червоний кут — long task: понад 50 мс головний потік не реагує на користувача'),
    highlight('layouts', 'Фіолетовий Layout після кожного читання offsetHeight: запис зробив розмітку брудною, і читання змушує рахувати її знову'),
    highlight('warning', 'DevTools сам підказує: forced reflow'),
    caption('Виправлення: спершу всі читання, потім усі записи'),
    set({ fixed: true, phase: 0, reveal: 0 }),
    highlight('code', 'Читання більше не чергуються із записами — браузер порахує layout один раз'),
    click('record', { phase: 1, elapsed: 0 }),
    tween('elapsed', 1800, 900, { ease: 'linear' }),
    click('stop', { phase: 2, reveal: 0 }),
    tween('reveal', 1, 700, { ease: 'out' }),
    caption('24 мс замість 182: один Layout і кадри по 16.7 мс'),
    highlight('one-layout', 'Layout рахується один раз — уже в рендерингу кадру, після JS'),
    highlight('summary', 'Rendering впав зі 131 до 11 мс'),
    wait(800),
  ],
})

export const scenes: Record<string, AnyScene> = {
  'layout-thrashing': erase(layoutThrashing),
}
