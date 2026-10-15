import type { Frame, StepScenario } from '../engine/types'

// all 13 traps; the handler below defines only get and set
export const TRAPS = ['get', 'set', 'has', 'deleteProperty', 'defineProperty', 'getOwnPropertyDescriptor', 'ownKeys', 'apply', 'construct', 'getPrototypeOf', 'setPrototypeOf', 'isExtensible', 'preventExtensions'] as const
export type TrapName = (typeof TRAPS)[number]

export interface TargetProp {
  key: string
  value: string
  changed?: boolean
  hit?: boolean
}

export interface ProxyFrame extends Frame {
  // what the caller does, e.g. `proxy.age = 30`
  op: string | null
  // internal method the operation becomes: [[Get]], [[Set]], [[HasProperty]]
  internal: string | null
  // which handler slot is consulted; `defined: false` = no trap → forwarded
  trap: { name: TrapName; defined: boolean } | null
  args: string[] | null
  // where control is right now
  stage: 'idle' | 'trap' | 'target' | 'throw'
  result: { text: string; tone: 'ok' | 'error' } | null
  target: TargetProp[]
  output: string[]
  error?: string
}

const code = `const user = { name: 'Ann', age: 25 }
const proxy = new Proxy(user, {
  get(target, key, receiver) {
    console.log(\`get \${key}\`)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    if (key === 'age' && value < 0) {
      throw new TypeError('age < 0')
    }
    console.log(\`set \${key} = \${value}\`)
    return Reflect.set(target, key, value, receiver)
  },
})

console.log(proxy.name)
proxy.age = 30
console.log('age' in proxy)
proxy.age = -1`

const user = (age = '25', mark?: 'name' | 'age' | 'age-changed'): TargetProp[] => [
  { key: 'name', value: "'Ann'", hit: mark === 'name' },
  { key: 'age', value: age, hit: mark === 'age', changed: mark === 'age-changed' },
]

const idle = { op: null, internal: null, trap: null, args: null, stage: 'idle' as const, result: null }
const getName = { op: 'proxy.name', internal: '[[Get]]', trap: { name: 'get' as const, defined: true }, args: ['target', "'name'", 'proxy'] }
const setAge = (v: string) => ({ op: `proxy.age = ${v}`, internal: '[[Set]]', trap: { name: 'set' as const, defined: true }, args: ['target', "'age'", v, 'proxy'] })

const getSet: StepScenario<ProxyFrame> = {
  code,
  frames: [
    { line: 2, ...idle, target: user(), output: [], note: 'new Proxy(target, handler) створює обгортку зі слотами [[ProxyTarget]] і [[ProxyHandler]]. У handler лише get і set — решта 11 внутрішніх операцій ітимуть прямо в target.' },
    { line: 16, ...getName, stage: 'trap', result: null, target: user(), output: [], note: 'Читання proxy.name — це внутрішній метод [[Get]]. Проксі бачить у handler пастку get і викликає її з (target, key, receiver), де receiver — сам proxy.' },
    { line: 4, ...getName, stage: 'trap', result: null, target: user(), output: ['get name'], note: 'Тіло пастки — звичайна функція: логуємо доступ. Сам target поки ніхто не чіпав.' },
    { line: 5, ...getName, stage: 'target', result: { text: "'Ann'", tone: 'ok' }, target: user('25', 'name'), output: ['get name'], note: 'Reflect.get виконує стандартний [[Get]] на target з тими самими аргументами. Reflect має по методу на кожну пастку — так поведінку за замовчуванням не треба переписувати руками.' },
    { line: 16, ...idle, target: user(), output: ['get name', 'Ann'], note: 'Значення, яке повернула пастка, і є результатом proxy.name. Викличний код навіть не знає, що між ним і об’єктом стоїть проксі.' },
    { line: 17, ...setAge('30'), stage: 'trap', result: null, target: user(), output: ['get name', 'Ann'], note: 'Присвоєння — це [[Set]]: викликається пастка set(target, key, value, receiver). Перевірка 30 < 0 не спрацьовує, і ми йдемо далі.' },
    { line: 11, ...setAge('30'), stage: 'trap', result: null, target: user(), output: ['get name', 'Ann', 'set age = 30'], note: 'Логуємо запис. Пастка get тут не спрацювала: присвоєння не читає властивість.' },
    { line: 12, ...setAge('30'), stage: 'target', result: { text: 'true', tone: 'ok' }, target: user('30', 'age-changed'), output: ['get name', 'Ann', 'set age = 30'], note: 'Reflect.set записує 30 у target і повертає true — пастка set мусить повернути true, інакше запис вважається невдалим. Пасток defineProperty і getOwnPropertyDescriptor немає, тож ці кроки теж ідуть у target.' },
    { line: 18, op: "'age' in proxy", internal: '[[HasProperty]]', trap: { name: 'has', defined: false }, args: null, stage: 'target', result: { text: 'true', tone: 'ok' }, target: user('30', 'age'), output: ['get name', 'Ann', 'set age = 30', 'true'], note: 'Оператор in викликає [[HasProperty]]. Пастки has у handler немає, тож проксі прозоро пересилає операцію в target — жодного логу «get».' },
    { line: 19, ...setAge('-1'), stage: 'trap', result: null, target: user('30'), output: ['get name', 'Ann', 'set age = 30', 'true'], note: 'Знову [[Set]] → пастка set, тепер value = -1. Умова key === \'age\' && value < 0 справджується.' },
    { line: 9, ...setAge('-1'), stage: 'throw', result: { text: 'TypeError', tone: 'error' }, target: user('30'), output: ['get name', 'Ann', 'set age = 30', 'true'], error: 'TypeError: age < 0', note: 'Пастка кидає TypeError, і Reflect.set не викликається — у target лишилось 30. Якби вона просто повернула false, у strict-режимі (модулі, класи) теж був би TypeError, а в sloppy-режимі запис мовчки проігнорувався б.' },
  ],
}

export const proxyTrapsScenarios: Record<string, StepScenario<ProxyFrame>> = {
  'get-set': getSet,
}
