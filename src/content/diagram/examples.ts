// Reference `[!diagram]` sources: shown on /viz and used as templates in CONTENT_SPEC.md §14.
export const DIAGRAM_EXAMPLES: readonly { title: string; yaml: string }[] = [
  {
    title: 'Функція: аргумент → обробка → результат',
    yaml: `layout: flow
nodes:
  - { id: arg, label: аргумент, text: "5", tone: blue, icon: "px:box" }
  - { id: fn, label: функція, code: "function double(x) {\\n  return x * 2\\n}" }
  - { id: out, label: результат, text: "?", tone: green }
edges:
  - { from: arg, to: fn, label: "double(5)" }
  - { from: fn, to: out, label: return }
steps:
  - { focus: arg, note: "Викликаємо double(5): значення 5 — це аргумент." }
  - { move: { from: arg, to: fn, value: "x = 5" }, line: "fn:1", note: "5 потрапляє всередину функції й стає параметром x." }
  - { line: "fn:2", note: "Виконується тіло: x * 2 → 5 * 2 = 10." }
  - { move: { from: fn, to: out, value: "10" }, set: { out: "10" }, line: "fn:2", note: "return віддає 10 назовні — це і є результат виклику." }
  - { focus: [arg, fn, out], note: "Ту саму функцію можна викликати з будь-яким числом: double(7) → 14." }`,
  },
  {
    title: 'Call stack: функція викликає функцію',
    yaml: `layout: stack
nodes:
  - { id: c, label: кадр, code: "greet()", tone: mint }
  - { id: b, label: кадр, code: "sayHi('Оля')", tone: blue }
  - { id: a, label: кадр, code: "main()", tone: violet }
steps:
  - { show: a, note: "Програма стартує з main() — перший кадр у стеку." }
  - { show: b, note: "main викликає sayHi — новий кадр кладеться зверху." }
  - { show: c, note: "sayHi викликає greet — стек росте далі." }
  - { hide: c, focus: b, note: "greet завершилась — її кадр знято, керування повертається в sayHi." }
  - { hide: b, focus: a, note: "sayHi теж завершилась — лишився тільки main." }`,
  },
  {
    title: 'Замикання: функція памʼятає своє оточення',
    yaml: `layout: nest
nodes:
  - { id: global, label: глобальне оточення, code: "const counter = makeCounter()", tone: gray }
  - { id: make, label: "makeCounter()", code: "let count = 0", parent: global, tone: violet }
  - { id: inner, label: "повернута функція", code: "return () => ++count", parent: make, tone: mint }
  - { id: value, label: count, text: "0", parent: make, tone: yellow }
steps:
  - { show: [global, make, value], line: "make:1", note: "makeCounter() створює своє оточення з count = 0." }
  - { show: inner, note: "Вона повертає функцію, яка бачить це оточення." }
  - { set: { value: "1" }, line: "inner:1", note: "counter() → ++count: оточення живе далі, count = 1." }
  - { set: { value: "2" }, line: "inner:1", note: "Ще раз counter() → 2. Ніхто ззовні count не бачить — тільки замикання." }`,
  },
]
