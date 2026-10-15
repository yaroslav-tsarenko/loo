import type { Frame, StepScenario } from '../engine/types'

export interface ProtoObject {
  id: string
  label: string
  emoji: string
  props: Array<{ key: string; value: string }>
  // [[Prototype]]; null only for Object.prototype, undefined for the `null` terminal itself
  proto?: string | null
  col?: 0 | 1
  // function objects: link to their .prototype object
  prototypeOf?: string
}

export interface ProtoFrame extends Frame {
  objects: ProtoObject[]
  cursor: string | null
  key: string | null
  status: 'idle' | 'search' | 'miss' | 'found' | 'end'
  // where the current lookup started (to highlight the walked path)
  from?: string
  output: string[]
}

// ── lookup (interactive: one generated scenario per property) ───
export const LOOKUP_PROPS = ['name', 'jumps', 'eats', 'walk', 'toString', 'fly'] as const
export type LookupProp = (typeof LOOKUP_PROPS)[number]

const NULL: ProtoObject = { id: 'null', label: 'null', emoji: '🚫', props: [] }
const OBJECT_PROTO: ProtoObject = { id: 'objproto', label: 'Object.prototype', emoji: '🏛️', props: [{ key: 'toString', value: 'ƒ' }, { key: 'hasOwnProperty', value: 'ƒ' }, { key: 'valueOf', value: 'ƒ' }], proto: 'null' }

const lookupObjects: ProtoObject[] = [
  { id: 'bunny', label: 'bunny', emoji: '🐰', props: [{ key: 'name', value: "'🐰 Банні'" }], proto: 'rabbit' },
  { id: 'rabbit', label: 'rabbit', emoji: '🐇', props: [{ key: 'jumps', value: 'true' }], proto: 'animal' },
  { id: 'animal', label: 'animal', emoji: '🐾', props: [{ key: 'eats', value: 'true' }, { key: 'walk', value: 'ƒ walk' }], proto: 'objproto' },
  OBJECT_PROTO,
  NULL,
]

const RESULT_OUTPUT: Record<LookupProp, string> = {
  name: '🐰 Банні',
  jumps: 'true',
  eats: 'true',
  walk: 'ƒ walk()',
  toString: 'ƒ toString() { [native code] }',
  fly: 'undefined',
}

function lookupCode(prop: LookupProp): string {
  return `const animal = {
  eats: true,
  walk() { return 'топ-топ' },
}
const rabbit = Object.create(animal)
rabbit.jumps = true

const bunny = Object.create(rabbit)
bunny.name = '🐰 Банні'

console.log(bunny.${prop})`
}

const FOUND_NOTE: Partial<Record<LookupProp, string>> = {
  name: 'Знайдено одразу: name — власна властивість bunny. Далі ланцюжок не перевіряється.',
  walk: 'Знайдено в animal. Метод не скопійовано в bunny — він успадкований; викликаний як bunny.walk(), він отримає this = bunny.',
  toString: 'Знайдено в Object.prototype — сюди ведуть ланцюжки майже всіх об’єктів. Тому в будь-якого {} є toString.',
}

export function buildLookupScenario(prop: LookupProp): StepScenario<ProtoFrame> {
  const chain = ['bunny', 'rabbit', 'animal', 'objproto']
  const frames: ProtoFrame[] = []
  const base = { objects: lookupObjects, key: prop, line: 11, from: 'bunny' }
  frames.push({ ...base, cursor: null, status: 'idle', output: [], note: `Читаємо bunny.${prop}. Ланцюжок: bunny → rabbit → animal → Object.prototype → null. Кожна стрілка — прихований слот [[Prototype]] (він же __proto__).` })
  for (let i = 0; i < chain.length; i++) {
    const id = chain[i]!
    const obj = lookupObjects.find((o) => o.id === id)!
    const own = obj.props.find((p) => p.key === prop)
    frames.push({ ...base, cursor: id, status: 'search', output: [], note: i === 0 ? `Спершу рушій шукає ВЛАСНУ властивість «${prop}» у самому bunny.` : `Перевіряємо власні властивості ${obj.label}.` })
    if (own) {
      frames.push({ ...base, cursor: id, status: 'found', output: [RESULT_OUTPUT[prop]], note: FOUND_NOTE[prop] ?? `Знайдено в ${obj.label}: ${prop} = ${own.value}. bunny читає її через ланцюжок, не маючи власної копії.` })
      return { code: lookupCode(prop), frames }
    }
    const next = lookupObjects.find((o) => o.id === obj.proto)!
    frames.push({ ...base, cursor: id, status: 'miss', output: [], note: `У ${obj.label} немає власної «${prop}» → ідемо за [[Prototype]] до ${next.label}.` })
  }
  frames.push({ ...base, cursor: 'null', status: 'end', output: ['undefined'], note: `[[Prototype]] у Object.prototype — null. Ланцюжок закінчився, «${prop}» ніде немає, тож результат undefined — без помилки.` })
  return { code: lookupCode(prop), frames }
}

// ── class-sugar ──────────────────────────────────────────────────
const classCode = `class Animal {
  constructor(name) { this.name = name }
  speak() { return \`\${this.name} 🔊\` }
}
class Dog extends Animal {
  bark() { return 'Гав! 🐶' }
}

const rex = new Dog('Рекс')
console.log(rex.speak())
console.log(typeof Dog)`

const FN_PROTO: ProtoObject = { id: 'fnproto', label: 'Function.prototype', emoji: '⚙️', props: [{ key: 'call', value: 'ƒ' }, { key: 'bind', value: 'ƒ' }], proto: 'objproto', col: 0 }
const OBJ1: ProtoObject = { ...OBJECT_PROTO, col: 1 }
const NULL1: ProtoObject = { ...NULL, col: 1 }
const animalFn: ProtoObject = { id: 'Animal', label: 'Animal', emoji: '🧩', props: [{ key: 'prototype', value: '→' }], proto: 'fnproto', col: 0, prototypeOf: 'AnimalP' }
const animalP: ProtoObject = { id: 'AnimalP', label: 'Animal.prototype', emoji: '📘', props: [{ key: 'constructor', value: 'Animal' }, { key: 'speak', value: 'ƒ' }], proto: 'objproto', col: 1 }
const dogFn: ProtoObject = { id: 'Dog', label: 'Dog', emoji: '🧩', props: [{ key: 'prototype', value: '→' }], proto: 'Animal', col: 0, prototypeOf: 'DogP' }
const dogP: ProtoObject = { id: 'DogP', label: 'Dog.prototype', emoji: '📗', props: [{ key: 'constructor', value: 'Dog' }, { key: 'bark', value: 'ƒ' }], proto: 'AnimalP', col: 1 }
const rexEmpty: ProtoObject = { id: 'rex', label: 'rex', emoji: '🐕', props: [], proto: 'DogP', col: 1 }
const rex: ProtoObject = { ...rexEmpty, props: [{ key: 'name', value: "'Рекс'" }] }

const step1 = [animalFn, FN_PROTO, animalP, OBJ1, NULL1]
const step2 = [dogFn, animalFn, FN_PROTO, dogP, animalP, OBJ1, NULL1]
const step3 = [dogFn, animalFn, FN_PROTO, rexEmpty, dogP, animalP, OBJ1, NULL1]
const step4 = [dogFn, animalFn, FN_PROTO, rex, dogP, animalP, OBJ1, NULL1]

const classSugar: StepScenario<ProtoFrame> = {
  code: classCode,
  frames: [
    { line: 1, objects: step1, cursor: null, key: null, status: 'idle', output: [], note: 'class Animal створює ФУНКЦІЮ Animal і об’єкт Animal.prototype. Метод speak лягає в Animal.prototype — одна копія на всі екземпляри.' },
    { line: 5, objects: step2, cursor: null, key: null, status: 'idle', output: [], note: 'extends будує ДВА ланцюжки: Dog.prototype → Animal.prototype (методи екземплярів) і Dog → Animal (статичні члени).' },
    { line: 9, objects: step3, cursor: 'rex', key: null, status: 'idle', output: [], note: 'new Dog(…): у Dog немає свого constructor, тож неявний викликає super(...args). Об’єкт створює Animal, але з [[Prototype]] = Dog.prototype, бо new.target = Dog.' },
    { line: 2, objects: step4, cursor: 'rex', key: 'name', status: 'found', output: [], note: 'Конструктор Animal записує name як ВЛАСНУ властивість rex. Методів у rex немає — лише дані.' },
    { line: 10, objects: step4, cursor: 'rex', key: 'speak', from: 'rex', status: 'miss', output: [], note: 'rex.speak(): власної speak у rex немає → ідемо за [[Prototype]] до Dog.prototype.' },
    { line: 10, objects: step4, cursor: 'DogP', key: 'speak', from: 'rex', status: 'miss', output: [], note: 'У Dog.prototype лише constructor і bark → далі, до Animal.prototype.' },
    { line: 10, objects: step4, cursor: 'AnimalP', key: 'speak', from: 'rex', status: 'found', output: ['Рекс 🔊'], note: 'Знайдено в Animal.prototype. Викликано як rex.speak(), тож this = rex і this.name = «Рекс».' },
    { line: 11, objects: step4, cursor: 'Dog', key: null, status: 'idle', output: ['Рекс 🔊', 'function'], note: 'typeof Dog — "function". class — це синтаксис над функцією-конструктором і прототипами, плюс бонуси: strict mode, обов’язковий new, неперелічувані методи.' },
  ],
}

export const prototypeScenarios: Record<string, StepScenario<ProtoFrame>> = {
  'class-sugar': classSugar,
}
