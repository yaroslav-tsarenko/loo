import { ChevronRight, CircleX, Info } from 'lucide-react'
import { defineScene, erase, type ScriptBuilder } from '../define'
import type { AnyScene, SceneViewProps, Step } from '../types'
import { Caret, Code, DevTools, PageStrip, ToolIcon } from './kit'

type Kind = 'in' | 'out' | 'log' | 'error' | 'table' | 'object'

interface Entry {
  kind: Kind
  text: string
  trace?: string
  demo?: string
}

interface S {
  input: string
  lines: Entry[]
  // object-inspect: 0 collapsed, 1 object open, 2 [[Prototype]] open
  open: number
}

const initial: S = { input: '', lines: [], open: 0 }

const USERS = [
  { name: 'Аня', age: 28 },
  { name: 'Бо', age: 31 },
]

function valueKind(text: string): string {
  if (/^['"]/.test(text)) return 'string'
  if (/^-?\d|^(true|false|NaN|Infinity)$/.test(text)) return 'number'
  if (text === 'undefined' || text === 'null') return 'nullish'
  return 'plain'
}

function ObjectView({ open }: { open: number }) {
  return (
    <div className="dc-obj">
      <span className="dc-obj-head" data-demo="obj-toggle">
        <span className="dc-tri" data-open={open > 0 ? '' : undefined} />
        {open > 0 ? null : <span className="dc-dim">{'{'}</span>}
        {open > 0 ? (
          <span>
            <span className="dc-key">Object</span>
          </span>
        ) : (
          <span>
            <span className="dc-key">name</span>: <span className="dc-str">&apos;Аня&apos;</span>, <span className="dc-key">age</span>: <span className="dc-num">28</span>
            <span className="dc-dim">{'}'}</span>
          </span>
        )}
        <span className="dc-info" title="Value below was evaluated just now">
          <Info size={11} />
        </span>
      </span>
      {open > 0 ? (
        <div className="dc-props">
          <div>
            <span className="dc-key">age</span>: <span className="dc-num">28</span>
          </div>
          <div>
            <span className="dc-key">name</span>: <span className="dc-str">&quot;Аня&quot;</span>
          </div>
          <div className="dc-proto" data-demo="proto-toggle">
            <span className="dc-tri" data-open={open > 1 ? '' : undefined} />
            <span className="dc-key dc-dim">[[Prototype]]</span>: Object
          </div>
          {open > 1 ? (
            <div className="dc-props" data-demo="proto-list">
              {['constructor: ƒ Object()', 'hasOwnProperty: ƒ hasOwnProperty()', 'isPrototypeOf: ƒ isPrototypeOf()', 'propertyIsEnumerable: ƒ propertyIsEnumerable()', 'toLocaleString: ƒ toLocaleString()', 'toString: ƒ toString()', 'valueOf: ƒ valueOf()', '__proto__: null'].map((p) => {
                const [k, v] = p.split(': ')
                return (
                  <div key={p}>
                    <span className="dc-key dc-dim">{k}</span>: <span className={v === 'null' ? 'dc-nullish' : 'dc-fn'}>{v}</span>
                  </div>
                )
              })}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function TableView() {
  return (
    <table className="dc-table">
      <thead>
        <tr>
          <th>(index)</th>
          <th>name</th>
          <th>age</th>
        </tr>
      </thead>
      <tbody>
        {USERS.map((u, i) => (
          <tr key={u.name}>
            <td>{i}</td>
            <td className="dc-str">&apos;{u.name}&apos;</td>
            <td className="dc-num">{u.age}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Line({ entry, open }: { entry: Entry; open: number }) {
  if (entry.kind === 'in') {
    return (
      <div className="dc-line" data-kind="in">
        <ChevronRight size={12} className="dc-gutter" aria-hidden="true" />
        <div className="dc-input">
          {entry.text.split('\n').map((l, i) => (
            <div key={i}>
              <Code text={l} />
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (entry.kind === 'error') {
    return (
      <div className="dc-line" data-kind="error" data-demo={entry.demo}>
        <CircleX size={12} className="dc-gutter" aria-hidden="true" />
        <div>
          <div>{entry.text}</div>
          {entry.trace ? <div className="dc-trace">{entry.trace}</div> : null}
        </div>
        <span className="dc-src">VM412:1</span>
      </div>
    )
  }
  if (entry.kind === 'table') {
    return (
      <div className="dc-line" data-kind="log" data-demo={entry.demo}>
        <span className="dc-gutter" />
        <TableView />
        <span className="dc-src">VM188:2</span>
      </div>
    )
  }
  if (entry.kind === 'object') {
    return (
      <div className="dc-line" data-kind="out" data-demo={entry.demo}>
        <span className="dc-gutter dc-ret" aria-hidden="true">
          ←
        </span>
        <ObjectView open={open} />
      </div>
    )
  }
  if (entry.kind === 'log') {
    return (
      <div className="dc-line" data-kind="log" data-demo={entry.demo}>
        <span className="dc-gutter" />
        <span>{entry.text}</span>
        <span className="dc-src">VM97:{entry.trace ?? '1'}</span>
      </div>
    )
  }
  return (
    <div className="dc-line" data-kind="out" data-demo={entry.demo}>
      <span className="dc-gutter dc-ret" aria-hidden="true">
        ←
      </span>
      <span className={`dc-${valueKind(entry.text)}`}>{entry.text}</span>
    </div>
  )
}

function View({ s, focus }: SceneViewProps<S>) {
  const errors = s.lines.filter((l) => l.kind === 'error').length
  return (
    <div className="sc-split">
      <PageStrip>
        <span className="sc-page-logo">🧪</span>
        <span className="sc-page-title">JS Playground</span>
        <span className="sc-page-chip">F12 → Console</span>
      </PageStrip>
      <DevTools
        tab="Console"
        errors={errors}
        toolbar={
          <>
            <ToolIcon kind="clear" />
            <span className="dt-select">
              top <ToolIcon kind="down" />
            </span>
            <span className="dt-filter">
              <ToolIcon kind="filter" />
              Filter
            </span>
            <span className="dt-grow" />
            <span className="dt-select">
              Default levels <ToolIcon kind="down" />
            </span>
          </>
        }
      >
        <div className="dc-log" data-demo-scroll="log">
          {s.lines.map((entry, i) => (
            <Line key={i} entry={entry} open={s.open} />
          ))}
          <div className="dc-line dc-prompt" data-kind="prompt" data-demo="prompt">
            <ChevronRight size={12} className="dc-gutter dc-accent" aria-hidden="true" />
            <div className="dc-input">
              {s.input.split('\n').map((l, i, all) => (
                <div key={i}>
                  <Code text={l} />
                  {focus === 'prompt' && i === all.length - 1 ? <Caret /> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DevTools>
    </div>
  )
}

type B = ScriptBuilder<S>

// type a snippet into the prompt, press Enter, print what Chrome would print
const run = (b: B, code: string, out: Entry[], ms?: number): Step<S>[] => [
  b.type('prompt', code, { key: 'input', ms }),
  b.wait(250),
  b.set((s) => ({ input: '', lines: [...s.lines, { kind: 'in', text: code }, ...out] })),
  b.wait(700),
]

const base = { url: 'https://playground.dev/', device: 'desktop' as const, initial, View }

const typeofQuirks = defineScene<S>({
  ...base,
  id: 'devtools-console/typeof-quirks',
  title: 'typeof у консолі',
  summary: 'Консоль Chrome показує, що повертає typeof для null, NaN, масивів і функцій.',
  script: (b) => [
    b.caption('typeof null — історичний баг: "object"'),
    ...run(b, 'typeof null', [{ kind: 'out', text: "'object'", demo: 'out-null' }]),
    b.highlight('out-null', 'null — не об’єкт, але typeof каже "object": баг першої реалізації JS, який не виправити'),
    b.caption('NaN — теж number, а масив — object'),
    ...run(b, 'typeof NaN', [{ kind: 'out', text: "'number'" }]),
    ...run(b, 'typeof []', [{ kind: 'out', text: "'object'" }]),
    ...run(b, 'Array.isArray([])', [{ kind: 'out', text: 'true', demo: 'out-array' }]),
    b.highlight('out-array', 'Масив перевіряють через Array.isArray, а не typeof'),
    b.caption('Функція — єдиний об’єкт зі своїм typeof'),
    ...run(b, 'typeof function () {}', [{ kind: 'out', text: "'function'" }]),
    b.caption('Властивість у null — червона TypeError'),
    ...run(b, 'null.length', [{ kind: 'error', text: "Uncaught TypeError: Cannot read properties of null (reading 'length')", trace: '    at <anonymous>:1:6', demo: 'err' }]),
    b.highlight('err', 'Помилка в консолі не ламає сторінку: виняток стосується лише цього введення'),
    b.wait(600),
  ],
})

const promiseCode = `console.log('1 sync')
setTimeout(() => console.log('4 timeout'))
Promise.resolve().then(() => console.log('3 micro'))
console.log('2 sync')`

const asyncCode = `(async () => {
  console.log('A')
  await null
  console.log('C')
})()
console.log('B')`

const promiseOrder = defineScene<S>({
  ...base,
  id: 'devtools-console/promise-order',
  title: 'Порядок виводу промісів',
  summary: 'Синхронні логи, мікрозадачі й таймер друкуються в консолі в порядку event loop.',
  script: (b) => [
    b.caption('Вставляємо чотири рядки й тиснемо Enter'),
    b.type('prompt', promiseCode, { key: 'input', ms: 26 }),
    b.wait(300),
    b.set((s) => ({ input: '', lines: [...s.lines, { kind: 'in', text: promiseCode }, { kind: 'log', text: '1 sync', trace: '1' }, { kind: 'log', text: '2 sync', trace: '4', demo: 'sync' }] })),
    b.caption('Спершу весь синхронний код'),
    b.highlight('sync', 'console.log виконуються одразу, поки скрипт ще в стеку'),
    b.set((s) => ({ lines: [...s.lines, { kind: 'log', text: '3 micro', trace: '3', demo: 'micro' }] })),
    b.caption('Далі мікрозадача з .then'),
    b.highlight('micro', 'Мікрозадачі виконуються, щойно спорожніє стек — раніше за будь-який таймер'),
    b.set((s) => ({ lines: [...s.lines, { kind: 'log', text: '4 timeout', trace: '2', demo: 'macro' }] })),
    b.caption('І лише потім таймер — окрема макрозадача'),
    b.highlight('macro', 'setTimeout(…, 0) потрапляє в чергу задач і чекає наступного оберту event loop'),
    b.caption('await теж віддає продовження в мікрозадачі'),
    b.type('prompt', asyncCode, { key: 'input', ms: 28 }),
    b.wait(300),
    b.set((s) => ({ input: '', lines: [...s.lines, { kind: 'in', text: asyncCode }, { kind: 'log', text: 'A', trace: '2' }, { kind: 'log', text: 'B', trace: '6' }, { kind: 'log', text: 'C', trace: '4', demo: 'after-await' }] })),
    b.highlight('after-await', 'A — синхронно до await, B — решта скрипта, C — продовження після await'),
    b.wait(600),
  ],
})

const thisLost = defineScene<S>({
  ...base,
  id: 'devtools-console/this-lost',
  title: 'Втрачений this у консолі',
  summary: 'Метод класу, збережений у змінну, втрачає this і падає з TypeError; bind і call це лікують.',
  script: (b) => [
    b.caption('Клас із методом — тіло класу завжди в strict mode'),
    ...run(b, "class User { constructor(n) { this.name = n } hi() { return this.name } }", [{ kind: 'out', text: 'undefined' }], 24),
    ...run(b, "const u = new User('Аня')", [{ kind: 'out', text: 'undefined' }]),
    ...run(b, 'u.hi()', [{ kind: 'out', text: "'Аня'", demo: 'ok' }]),
    b.highlight('ok', 'Виклик через крапку: this = u'),
    b.caption('Метод у змінній — і this зникає'),
    ...run(b, 'const hi = u.hi', [{ kind: 'out', text: 'undefined' }]),
    ...run(b, 'hi()', [{ kind: 'error', text: "Uncaught TypeError: Cannot read properties of undefined (reading 'name')", trace: '    at hi (<anonymous>:1:66)\n    at <anonymous>:1:1', demo: 'err' }]),
    b.highlight('err', 'Звичайний виклик без крапки: у strict mode this = undefined, тож this.name кидає TypeError'),
    b.caption('call і bind повертають правильний this'),
    ...run(b, 'hi.call(u)', [{ kind: 'out', text: "'Аня'" }]),
    ...run(b, 'const bound = u.hi.bind(u); bound()', [{ kind: 'out', text: "'Аня'", demo: 'bound' }]),
    b.highlight('bound', 'bind створює нову функцію з назавжди прив’язаним this'),
    b.wait(600),
  ],
})

const usersCode = "const users = [{ name: 'Аня', age: 28 }, { name: 'Бо', age: 31 }]"

const objectInspect = defineScene<S>({
  ...base,
  id: 'devtools-console/object-inspect',
  title: 'console.table і [[Prototype]]',
  summary: 'console.table малює масив об’єктів таблицею, а розгорнутий об’єкт показує свій [[Prototype]].',
  script: (b) => [
    b.caption('Масив об’єктів — одним рядком'),
    ...run(b, usersCode, [{ kind: 'out', text: 'undefined' }], 26),
    b.caption('console.table читається краще за log'),
    ...run(b, 'console.table(users)', [{ kind: 'table', text: '', demo: 'table' }, { kind: 'out', text: 'undefined' }]),
    b.highlight('table', 'Рядки — індекси масиву, колонки — ключі об’єктів'),
    b.caption('Розгортаємо об’єкт…'),
    ...run(b, 'users[0]', [{ kind: 'object', text: '', demo: 'obj' }]),
    b.click('obj-toggle', { open: 1 }),
    b.wait(500),
    b.caption('…і його прихований [[Prototype]]'),
    b.click('proto-toggle', { open: 2 }),
    b.highlight('proto-list', 'Методи на кшталт hasOwnProperty і toString живуть в Object.prototype, а не в самому об’єкті'),
    b.wait(600),
  ],
})

const helloConsole = defineScene<S>({
  ...base,
  id: 'devtools-console/hello-console',
  title: 'Перша програма в консолі',
  summary: 'Перший console.log, опечатка з червоною ReferenceError, виправлення, вираз 2 + 2 і рядок-шаблон зі змінною.',
  script: (b) => [
    b.caption('Пишемо перший рядок і тиснемо Enter'),
    ...run(b, "console.log('Привіт, світ!')", [{ kind: 'log', text: 'Привіт, світ!', demo: 'hello' }, { kind: 'out', text: 'undefined', demo: 'undef' }]),
    b.highlight('hello', 'console.log друкує те, що в дужках'),
    b.highlight('undef', 'Сіре undefined — це результат самої інструкції: console.log нічого не повертає. Не помилка'),
    b.caption('Одна пропущена літера — і червона помилка'),
    ...run(b, "consol.log('Привіт')", [{ kind: 'error', text: 'Uncaught ReferenceError: consol is not defined', trace: '    at <anonymous>:1:1', demo: 'err' }]),
    b.highlight('err', 'ReferenceError: імені consol не існує. Читай повідомлення — воно каже, що саме не так'),
    ...run(b, "console.log('Привіт')", [{ kind: 'log', text: 'Привіт' }, { kind: 'out', text: 'undefined' }]),
    b.caption('Консоль — ще й калькулятор'),
    ...run(b, '2 + 2', [{ kind: 'out', text: '4', demo: 'sum' }]),
    b.highlight('sum', 'Для виразу консоль одразу показує його значення після стрілочки'),
    b.caption('Рядок-шаблон підставляє змінну'),
    ...run(b, "const name = 'Оля'", [{ kind: 'out', text: 'undefined' }]),
    ...run(b, '`Привіт, ${name}!`', [{ kind: 'out', text: "'Привіт, Оля!'", demo: 'tpl' }]),
    b.highlight('tpl', 'У зворотних лапках ${name} замінюється значенням змінної'),
    b.wait(600),
  ],
})

export const scenes: Record<string, AnyScene> = {
  'typeof-quirks': erase(typeofQuirks),
  'promise-order': erase(promiseOrder),
  'this-lost': erase(thisLost),
  'object-inspect': erase(objectInspect),
  'hello-console': erase(helloConsole),
}
