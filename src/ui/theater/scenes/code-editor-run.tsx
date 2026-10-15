import { CircleCheck, CircleX, FileCode2, FlaskConical, Play } from 'lucide-react'
import { defineScene, erase } from '../define'
import type { AnyScene, SceneViewProps } from '../types'
import { Caret, Code } from './kit'

type Result = 'idle' | 'pass' | 'fail'

interface S {
  body: string
  results: Result[]
  errors: string[]
  running: boolean
  runs: number
}

const TESTS = [
  ["робить першу літеру великою", "capitalize('аня')", "'Аня'"],
  ['не ламає порожній рядок', "capitalize('')", "''"],
  ['решту рядка не змінює', "capitalize('jS')", "'JS'"],
] as const

const TEST_FILE = [
  "import { capitalize } from './capitalize'",
  '',
  ...TESTS.flatMap(([name, call, expected]) => [`test('${name}', () => {`, `  expect(${call}).toBe(${expected})`, '})']),
]

function Editor({ s, focus }: { s: S; focus: string | null }) {
  const lines = ['export function capitalize(s) {', `  ${s.body}`, '}']
  return (
    <div className="ed-pane">
      <div className="ed-tabs">
        <span data-on="">
          <FileCode2 size={12} /> capitalize.js
        </span>
        <span>
          <FlaskConical size={12} /> capitalize.test.js
        </span>
      </div>
      <div className="ed-code" data-demo="editor">
        {lines.map((l, i) => (
          <div key={i} className="ed-line" data-active={i === 1 && focus === 'body' ? '' : undefined}>
            <span className="ed-num">{i + 1}</span>
            <span className="ed-text" data-demo={i === 1 ? 'body' : undefined}>
              <Code text={l} />
              {i === 1 && focus === 'body' ? <Caret /> : null}
            </span>
          </div>
        ))}
      </div>
      <div className="ed-tests-src">
        {TEST_FILE.map((l, i) => (
          <div key={i} className="ed-line ed-dim">
            <span className="ed-num">{i + 1}</span>
            <Code text={l} />
          </div>
        ))}
      </div>
    </div>
  )
}

function Runner({ s }: { s: S }) {
  const failed = s.results.filter((r) => r === 'fail').length
  const passed = s.results.filter((r) => r === 'pass').length
  return (
    <div className="ed-runner">
      <div className="ed-runner-head">
        <span>Тести</span>
        <span className="ed-run" data-demo="run" data-busy={s.running ? '' : undefined}>
          <Play size={12} /> {s.running ? 'Запуск…' : 'Run'}
        </span>
      </div>
      <div className="ed-results">
        {TESTS.map(([name], i) => {
          const r = s.results[i] ?? 'idle'
          return (
            <div key={name} className="ed-test" data-r={r} data-demo={`t${i}`}>
              <span className="ed-test-icon">{r === 'pass' ? <CircleCheck size={13} /> : r === 'fail' ? <CircleX size={13} /> : '○'}</span>
              <span>
                {name}
                {r === 'fail' && s.errors[i] ? <span className="ed-err">{s.errors[i]}</span> : null}
              </span>
            </div>
          )
        })}
      </div>
      {s.runs > 0 && !s.running ? (
        <div className="ed-summary" data-demo="summary" data-ok={failed === 0 ? '' : undefined}>
          Tests {failed > 0 ? <b className="ed-red">{failed} failed</b> : null}
          {failed > 0 && passed > 0 ? ' | ' : null}
          {passed > 0 ? <b className="ed-green">{passed} passed</b> : null} ({TESTS.length})
        </div>
      ) : null}
    </div>
  )
}

function View({ s, focus }: SceneViewProps<S>) {
  return (
    <div className="ed">
      <Editor s={s} focus={focus} />
      <Runner s={s} />
    </div>
  )
}

const tdd = defineScene<S>({
  id: 'code-editor-run/tdd',
  title: 'TDD у редакторі',
  summary: 'Тести спершу червоні, мінімальний код робить частину зеленою, виправлення — усі.',
  url: 'https://code.example/kata/capitalize',
  device: 'desktop',
  initial: { body: '', results: ['idle', 'idle', 'idle'], errors: [], running: false, runs: 0 },
  View,
  script: ({ caption, click, type, set, wait, highlight }) => [
    caption('Спершу тести — і вони червоні'),
    click('run', { running: true }),
    wait(600),
    set((s) => ({
      running: false,
      runs: s.runs + 1,
      results: ['fail', 'fail', 'fail'],
      errors: ["expected undefined to be 'Аня'", "expected undefined to be ''", "expected undefined to be 'JS'"],
    })),
    highlight('summary', 'Функція ще нічого не повертає — undefined. Червоний тест доводить, що він справді щось перевіряє'),
    caption('Мінімальний код, щоб пройти перший тест'),
    type('body', 'return s[0].toUpperCase() + s.slice(1)'),
    click('run', { running: true }),
    wait(600),
    set((s) => ({ running: false, runs: s.runs + 1, results: ['pass', 'fail', 'pass'], errors: ['', "TypeError: Cannot read properties of undefined (reading 'toUpperCase')", ''] })),
    highlight('t1', "У порожнього рядка немає s[0] — це undefined, і виклик методу падає"),
    caption('Виправляємо граничний випадок'),
    type('body', 'return s.charAt(0).toUpperCase() + s.slice(1)'),
    click('run', { running: true }),
    wait(600),
    set((s) => ({ running: false, runs: s.runs + 1, results: ['pass', 'pass', 'pass'], errors: [] })),
    caption('Зелено — тепер можна рефакторити без страху'),
    highlight('summary', "charAt(0) для '' повертає '', тож усі три тести проходять"),
    wait(800),
  ],
})

export const scenes: Record<string, AnyScene> = { tdd: erase(tdd) }
