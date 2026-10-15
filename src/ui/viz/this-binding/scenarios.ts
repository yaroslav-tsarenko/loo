import type { Frame, StepScenario } from '../engine/types'

export interface ThisFrame extends Frame {
  // the call expression that decides `this`
  call?: string
  rule?: string
  thisValue?: string
  output: string[]
}

const lostCode = `'use strict'
const user = {
  name: 'Аня',
  hi() {
    console.log(this?.name)
  },
}

user.hi()
const hi = user.hi
hi()

function run(cb) { cb() }
run(user.hi)
run(() => user.hi())
run(user.hi.bind(user))`

const lostThis: StepScenario<ThisFrame> = {
  code: lostCode,
  frames: [
    { line: 9, call: 'user.hi()', rule: 'неявне · через крапку', thisValue: 'user', output: ['Аня'], note: 'Виклик через крапку: this — об’єкт перед крапкою, тобто user. Друкується «Аня».' },
    { line: 10, output: ['Аня'], note: 'hi = user.hi копіює лише посилання на функцію. Функція не «пам’ятає» об’єкт: this визначається в момент виклику, а не створення.' },
    { line: 11, call: 'hi()', rule: 'за замовчуванням · strict', thisValue: 'undefined', output: ['Аня', 'undefined'], note: 'Звичайний виклик без крапки. У strict mode this = undefined, тож this?.name дає undefined (без ?. був би TypeError).' },
    { line: 13, call: 'cb()  ← run(user.hi)', rule: 'за замовчуванням · strict', thisValue: 'undefined', output: ['Аня', 'undefined', 'undefined'], note: 'run(user.hi) передає ту саму функцію без об’єкта, а всередині run її викликають як cb() — без крапки. Саме так this губиться в колбеках.' },
    { line: 15, call: 'user.hi()  ← у стрілці', rule: 'неявне · через крапку', thisValue: 'user', output: ['Аня', 'undefined', 'undefined', 'Аня'], note: 'Стрілка-обгортка сама викликає user.hi() з крапкою — і this знову user.' },
    { line: 16, call: 'cb()  ← bound-функція', rule: 'явне · bind', thisValue: 'user', output: ['Аня', 'undefined', 'undefined', 'Аня', 'Аня'], note: 'bind створює нову функцію з назавжди прив’язаним this = user. Як її не викликай, this не зміниться (перебити може лише new).' },
  ],
}

const arrowCode = `'use strict'
const team = {
  name: '🚀 Ракета',
  list: ['Аня', 'Бо'],
  showRegular() {
    this.list.forEach(function (m) {
      console.log(m, this?.name)
    })
  },
  showArrow() {
    this.list.forEach((m) => {
      console.log(m, this.name)
    })
  },
}

team.showRegular()
team.showArrow()`

const arrow: StepScenario<ThisFrame> = {
  code: arrowCode,
  frames: [
    { line: 17, call: 'team.showRegular()', rule: 'неявне · через крапку', thisValue: 'team', output: [], note: 'showRegular викликано через крапку, тож усередині методу this = team.' },
    { line: 6, call: 'this.list.forEach(fn)', rule: 'неявне · через крапку', thisValue: 'team', output: [], note: 'this.list працює, бо this = team. Але колбек викликатиме сам forEach — без крапки і без другого аргументу thisArg.' },
    { line: 7, call: 'fn("Аня")  ← усередині forEach', rule: 'за замовчуванням · strict', thisValue: 'undefined', output: ['Аня undefined'], note: 'Звичайна function має ВЛАСНИЙ this, і для неї це звичайний виклик: у strict mode this = undefined.' },
    { line: 7, call: 'fn("Бо")  ← усередині forEach', rule: 'за замовчуванням · strict', thisValue: 'undefined', output: ['Аня undefined', 'Бо undefined'], note: 'Те саме для «Бо». Класичні фікси до ES2015 — const self = this або forEach(fn, this).' },
    { line: 18, call: 'team.showArrow()', rule: 'неявне · через крапку', thisValue: 'team', output: ['Аня undefined', 'Бо undefined'], note: 'showArrow теж викликано через крапку: this = team.' },
    { line: 12, call: '(m) => …  ← усередині forEach', rule: 'лексичний · стрілка', thisValue: 'team', output: ['Аня undefined', 'Бо undefined', 'Аня 🚀 Ракета'], note: 'Стрілка не має власного this — вона бере його з оточення, де її створено, тобто з виклику showArrow. this = team.' },
    { line: 12, call: '(m) => …  ← усередині forEach', rule: 'лексичний · стрілка', thisValue: 'team', output: ['Аня undefined', 'Бо undefined', 'Аня 🚀 Ракета', 'Бо 🚀 Ракета'], note: 'Тому стрілки ідеальні для колбеків у методах. Але не як самі методи: { f: () => this } візьме this ззовні об’єкта, а call/bind його не змінять.' },
  ],
}

export const thisScenarios: Record<string, StepScenario<ThisFrame>> = {
  'lost-this': lostThis,
  arrow,
}
