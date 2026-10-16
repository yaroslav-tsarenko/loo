import type { Frame, StepScenario } from '../engine/types'

export type GenState = 'suspendedStart' | 'executing' | 'suspendedYield' | 'completed'

export interface GenFrame extends Frame {
  // who holds control right now
  active: 'caller' | 'generator'
  genState: GenState
  // value travelling between caller and generator on this step
  message?: { dir: 'in' | 'out'; text: string }
  vars: Array<{ name: string; value: string }>
  output: string[]
}

const code = `function* dialog() {
  const name = yield 'Як звати?'
  const mood = yield \`Привіт, \${name}!\`
  return \`\${name}: \${mood}\`
}

const gen = dialog()
console.log(gen.next().value)
console.log(gen.next('Аня').value)
console.log(gen.next('круто').value)
console.log(gen.next().done)`

const yieldPingpong: StepScenario<GenFrame> = {
  code,
  frames: [
    { line: 7, active: 'caller', genState: 'suspendedStart', vars: [], output: [], note: 'Виклик dialog() НЕ виконує тіло. Він лише створює об’єкт-генератор у стані suspendedStart.' },
    { line: 8, active: 'generator', genState: 'executing', message: { dir: 'in', text: 'next()' }, vars: [], output: [], note: 'gen.next() передає керування генератору, і тіло стартує з першого рядка. Аргумент першого next() ігнорується: ще немає yield, який би його прийняв.' },
    { line: 2, active: 'caller', genState: 'suspendedYield', message: { dir: 'out', text: "{ value: 'Як звати?', done: false }" }, vars: [], output: ['Як звати?'], note: 'yield віддає значення назовні і ставить генератор на паузу посеред виразу. next() повертає { value, done: false }, керування — знову у виклику.' },
    { line: 9, active: 'generator', genState: 'executing', message: { dir: 'in', text: "next('Аня')" }, vars: [{ name: 'name', value: "'Аня'" }], output: ['Як звати?'], note: "next('Аня') відновлює генератор, і вираз yield, на якому він спав, обчислюється в 'Аня'. Так значення летить ВСЕРЕДИНУ." },
    { line: 3, active: 'caller', genState: 'suspendedYield', message: { dir: 'out', text: "{ value: 'Привіт, Аня!', done: false }" }, vars: [{ name: 'name', value: "'Аня'" }], output: ['Як звати?', 'Привіт, Аня!'], note: 'Другий yield знову віддає значення і паузить генератор. Локальна name збережена — генератор пам’ятає весь свій стан.' },
    { line: 10, active: 'generator', genState: 'executing', message: { dir: 'in', text: "next('круто')" }, vars: [{ name: 'name', value: "'Аня'" }, { name: 'mood', value: "'круто'" }], output: ['Як звати?', 'Привіт, Аня!'], note: "next('круто') відновлює генератор: mood = 'круто'." },
    { line: 4, active: 'caller', genState: 'completed', message: { dir: 'out', text: "{ value: 'Аня: круто', done: true }" }, vars: [{ name: 'name', value: "'Аня'" }, { name: 'mood', value: "'круто'" }], output: ['Як звати?', 'Привіт, Аня!', 'Аня: круто'], note: 'return завершує генератор: next() повертає { value, done: true }. Зверніть увагу: for…of значення з return не бачить — лише yield.' },
    { line: 11, active: 'caller', genState: 'completed', message: { dir: 'out', text: '{ value: undefined, done: true }' }, vars: [], output: ['Як звати?', 'Привіт, Аня!', 'Аня: круто', 'true'], note: 'Завершений генератор на кожен next() відповідає { value: undefined, done: true }. Генератор — це функція, яку можна ставити на паузу і продовжувати.' },
  ],
}

export const generatorScenarios: Record<string, StepScenario<GenFrame>> = {
  'yield-pingpong': yieldPingpong,
}
