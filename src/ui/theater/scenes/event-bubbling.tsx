import { ArrowDown, ArrowUp, Crosshair, ListTodo } from 'lucide-react'
import { defineScene, erase } from '../define'
import type { AnyScene, SceneViewProps } from '../types'
import { Caret, Code } from './kit'

type Phase = 'idle' | 'capture' | 'target' | 'bubble'

interface S {
  items: string[]
  hop: number
  phase: Phase
  clicked: string | null
  log: string[]
  draft: string
}

const PATH = ['window', 'document', 'html', 'body', 'ul#list', 'li', 'button.del']
const UL = 4
const TARGET = PATH.length - 1

const PHASE_LABEL: Record<Phase, string> = {
  idle: 'очікування',
  capture: '1 · capture ↓',
  target: '2 · target',
  bubble: '3 · bubble ↑',
}

function View({ s, focus }: SceneViewProps<S>) {
  const at = Math.round(s.hop)
  return (
    <div className="ev">
      <div className="ev-page">
        <h3 className="ev-title">
          <ListTodo size={18} strokeWidth={2} aria-hidden="true" /> Справи
        </h3>
        <div className="ev-form">
          <span className="ev-input" data-demo="draft">
            {s.draft || (focus === 'draft' ? '' : <span className="ev-ph">Нова справа…</span>)}
            {focus === 'draft' ? <Caret /> : null}
          </span>
          <span className="ev-add" data-demo="add">
            Додати
          </span>
        </div>
        <ul className="ev-list" data-demo="list" data-active={s.phase !== 'idle' && at === UL ? '' : undefined}>
          {s.items.map((name) => (
            <li key={name} className="ev-item" data-active={s.clicked === name && s.phase !== 'idle' && at === UL + 1 ? '' : undefined}>
              <span>{name}</span>
              <span className="ev-del" data-demo={`del-${name}`} data-clicked={s.clicked === name ? '' : undefined} data-active={s.clicked === name && s.phase !== 'idle' && at === TARGET ? '' : undefined}>
                ✕
              </span>
            </li>
          ))}
        </ul>
        <div className="ev-code">
          <Code text="list.addEventListener('click', (e) => {" />
          <Code text="  const btn = e.target.closest('.del')" />
          <Code text="  if (btn) btn.closest('li').remove()" />
          <Code text="})" />
        </div>
      </div>
      <div className="ev-side">
        <div className="ev-phase" data-phase={s.phase}>
          {s.phase === 'capture' ? <ArrowDown size={13} /> : s.phase === 'bubble' ? <ArrowUp size={13} /> : <Crosshair size={13} />}
          {PHASE_LABEL[s.phase]}
        </div>
        <ol className="ev-path" data-demo="path">
          {PATH.map((node, i) => (
            <li key={node} data-on={s.phase !== 'idle' && i === at ? '' : undefined} data-passed={s.phase === 'capture' ? (i < at ? '' : undefined) : s.phase === 'bubble' ? (i > at ? '' : undefined) : undefined} data-handler={i === UL ? '' : undefined}>
              <code>{node}</code>
              {i === UL ? <span className="ev-badge">слухач</span> : null}
            </li>
          ))}
        </ol>
        <div className="ev-log" data-demo="log">
          {s.log.length === 0 ? <span className="ev-ph">console</span> : null}
          {s.log.map((l, i) => (
            <div key={i}>› {l}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

const LOG = 'target: button.del · currentTarget: ul#list'

const delegation = defineScene<S>({
  id: 'event-bubbling/delegation',
  title: 'Спливання і делегування',
  summary: 'Клік по кнопці спускається від window (capture), доходить до кнопки і спливає назад до слухача на списку.',
  url: 'https://todo.example/',
  device: 'desktop',
  initial: { items: ['Хліб', 'Молоко', 'Яблука'], hop: 0, phase: 'idle', clicked: null, log: [], draft: '' },
  View,
  script: ({ caption, click, type, set, tween, wait, highlight }) => [
    caption('Один слухач на <ul> замість окремого на кожній кнопці'),
    highlight('list', 'Слухач click висить лише на списку'),
    click('del-Молоко', { clicked: 'Молоко', phase: 'capture', hop: 0 }),
    caption('Capture: подія спускається від window до кнопки'),
    tween('hop', TARGET, 900, { ease: 'linear' }),
    set({ phase: 'target' }),
    caption('Target: подія дісталася кнопки ✕'),
    wait(700),
    set({ phase: 'bubble' }),
    caption('Bubble: подія спливає вгору і на <ul> спрацьовує наш слухач'),
    tween('hop', UL, 500, { ease: 'linear' }),
    set((s) => ({ log: [...s.log, LOG], items: s.items.filter((i) => i !== 'Молоко') })),
    highlight('log', 'e.target — кнопка, де стався клік; e.currentTarget — ul, де висить слухач'),
    tween('hop', 0, 600, { ease: 'linear' }),
    set({ phase: 'idle', clicked: null }),
    caption('Нова справа працює без нового слухача'),
    type('draft', 'Кава'),
    click('add', (s) => ({ items: [...s.items, s.draft], draft: '' })),
    click('del-Кава', { clicked: 'Кава', phase: 'capture', hop: 0 }),
    tween('hop', TARGET, 500, { ease: 'linear' }),
    set({ phase: 'bubble' }),
    tween('hop', UL, 300, { ease: 'linear' }),
    set((s) => ({ log: [...s.log, LOG], items: s.items.filter((i) => i !== 'Кава') })),
    highlight('path', 'Делегування працює, бо click спливає. focus, blur, mouseenter не спливають — для них є focusin/focusout'),
    set({ phase: 'idle', clicked: null, hop: 0 }),
    wait(800),
  ],
})

export const scenes: Record<string, AnyScene> = { delegation: erase(delegation) }
