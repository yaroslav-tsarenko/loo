---
title: Реактивні сигнали
order: 6
level: senior
tags: [signals, reactivity, observer, batching, closures]
prerequisites:
  - "[[JavaScript - 05. Замикання]]"
  - "[[JavaScript - 32. Патерни проєктування]]"
  - "[[JavaScript - 13. Пам'ять і збирач сміття]]"
estimatedMinutes: 120
id: jsp-ch-06
icon: "📡"
---

# JavaScript Projects - 06. Реактивні сигнали

> [!success] 🎯 Після цього розділу ти зможеш
> - Написати `signal`, `effect` і `computed` з **автоматичним відстеженням залежностей** — як у Solid, Preact Signals, Vue і Angular.
> - Пояснити, чому залежності треба перевідстежувати на кожному запуску і як це прибирає зайві оновлення.
> - Зробити `computed` **лінивим і кешованим**.
> - Прибрати «глітчі» в діамантових залежностях через **батчинг**.
> - Керувати ресурсами ефектів: cleanup, `untrack`, `dispose` — і прив'язати сигнали до будь-якого об'єкта, включно з DOM.

## 🎯 Що збудуємо

Міні-бібліотеку реактивності на ~120 рядків. Ти пишеш звичайний код — `effect(() => el.textContent = fullName.value)` — а бібліотека **сама** з'ясовує, від чого він залежить, і перезапускає його рівно тоді, коли треба.

> [!diagram] Як сигнали самі знаходять, кого перезапустити
> ```yaml
> layout: tree
> nodes:
>   - { id: eff, label: "effect · bind(el, { textContent: fullName })", text: "el.textContent = —", tone: green, icon: "px:monitor" }
>   - { id: full, parent: eff, label: "fullName (computed) · лінивий, кешований", text: "ще не обчислено", tone: violet }
>   - { id: first, parent: full, label: "firstName (signal)", text: "'Оля'", tone: blue }
>   - { id: last, parent: full, label: "lastName (signal)", text: "'Коваль'", tone: blue }
>   - { id: obs, label: "activeObserver (глобальна змінна)", text: "null", tone: yellow, icon: "px:magnifier" }
>   - { id: pending, label: "pending — ефекти в черзі", text: "{ }", tone: gray }
> steps:
>   - { set: { obs: "effect" }, focus: [obs, eff], note: "effect.run() спершу пише activeObserver = effect — ніби каже: «зараз читаю я». Потім виконує свою функцію." }
>   - { set: { obs: "fullName", full: "обчислюється…" }, focus: [obs, full], note: "Функція ефекту читає fullName.value. Computed лінивий: рахує лише зараз, коли його вперше прочитали, і на час обчислення сам стає activeObserver." }
>   - { move: [{ from: first, to: full, value: "'Оля'" }, { from: last, to: full, value: "'Коваль'" }], set: { full: "'Оля Коваль'" }, note: "first.value і last.value — це get. track(observers) додає activeObserver (fullName) у спостерігачі сигналу, а fullName запам'ятовує сигнали в deps. Так і виникають лінії цього дерева." }
>   - { set: { obs: "null", eff: "el.textContent = 'Оля Коваль'" }, focus: [obs, eff], note: "Обчислення скінчились, activeObserver повертається до prev. Ефект записав текст і тепер підписаний на fullName — жодного ручного subscribe." }
>   - { set: { first: "'Петро'", full: "dirty = true", pending: "{ effect }" }, note: "firstName.value = 'Петро' (set). batch обходить спостерігачів синхронно: computed.notify позначає dirty, effect.notify кладе ефект у pending. Ще нічого не перераховано." }
>   - { set: { pending: "{ }", full: "'Петро Коваль'", eff: "el.textContent = 'Петро Коваль'" }, note: "flush(): кожен ефект із pending виконується РІВНО ОДИН раз. Він читає fullName — той брудний, тож перераховується і віддає свіже значення." }
>   - { focus: [first, last, pending], note: "batch(() => { first = 'X'; last = 'Y' }) — обидві зміни кладуть той самий ефект у pending (це Set), тож текст запишеться один раз, без проміжного «X Коваль»." }
> ```

Глобальна змінна `activeObserver` — увесь «секрет» автотрекінгу: сигнал під час читання дивиться, *хто* його зараз читає, і запам'ятовує цього читача.

## 🧭 План кроків

1. `signal` — значення, `peek`, ручна підписка. Теорія: Observer у [[JavaScript - 32. Патерни проєктування]].
2. `effect` + автоматичне відстеження і динамічні залежності. Теорія: [[JavaScript - 05. Замикання]].
3. `computed` — лінивий кешований сигнал.
4. `batch` — одна хвиля оновлень без глітчів. Теорія: [[JavaScript - 08. Event Loop]].
5. Cleanup, `untrack`, `dispose` — ресурси й витоки. Теорія: [[JavaScript - 13. Пам'ять і збирач сміття]].
6. `bind` і `bindInput` — шар прив'язки до звичайних об'єктів і DOM. Теорія: [[JavaScript - 25. DOM і події]].

## 🧩 Розминка

> [!quiz] Заповни пропуски в track
> level: senior · type: fill · id: jsp-06-quiz-01 · bank: undefined, push, observers
>
> ```js fill
> function track(observers) {
>   if (activeObserver === [[null]]) return
>   observers.[[add]](activeObserver)
>   activeObserver.[[deps]].add(observers)
> }
> ```
>
> **Пояснення:** зв'язок двосторонній: сигнал знає своїх спостерігачів (щоб сповістити), а спостерігач — свої залежності (щоб відписатися від усіх перед наступним запуском). Без другої половини динамічні залежності «прилипали» б назавжди.

> [!quiz] Склади запуск ефекту з відстеженням
> level: senior · type: order · id: jsp-06-quiz-02
>
> ```js order
> function run() {
>   if (observer.disposed) return
>   cleanupDeps(observer)
>   const prev = activeObserver
>   activeObserver = observer
>   try {
>     fn()
>   } finally {
>     activeObserver = prev
>   }
> }
>     activeObserver = null // ✗
> ```
>
> **Пояснення:** перед запуском відписуємось від старих залежностей — `fn` зараз збере актуальні. Відновлюємо **попередній** спостерігач, а не `null`: ефект може запускатися всередині іншого ефекту чи `computed`, і зовнішній має продовжити відстеження.

## 🛠️ Крок 1. Сигнал

Сигнал — контейнер значення, який знає своїх спостерігачів. Спостерігач — об'єкт з методом `notify()` (а не голий колбек): на наступних кроках так само виглядатимуть ефекти й computed. Однакове значення (`Object.is`) не сповіщає нікого.

> [!task] Крок 1 · signal
> level: middle · difficulty: easy · id: jsp-06-task-01 · tags: observer, getters-setters
>
> Напиши `signal(initial)` → об'єкт:
>
> - геттер/сеттер `value`; сеттер з тим самим значенням (`Object.is`) нічого не робить;
> - `peek()` — значення;
> - `subscribe(fn)` — `fn(newValue)` після кожної **зміни**; повертає відписку. Відписка під час сповіщення не повинна ламати інших.
>
> Зберігай спостерігачів як об'єкти `{ notify() }` у `Set`.
>
> ```js starter
> function signal(initial) {
>   // твій код
> }
> ```
>
> ```js tests
> test('читання і запис', () => {
>   const count = signal(1)
>   expect(count.value).toBe(1)
>   count.value = 2
>   expect(count.value).toBe(2)
>   expect(count.peek()).toBe(2)
> })
>
> test('subscribe отримує нові значення; відписка', () => {
>   const count = signal(0)
>   const seen = []
>   const unsubscribe = count.subscribe((v) => seen.push(v))
>   count.value = 1
>   count.value = 2
>   unsubscribe()
>   count.value = 3
>   expect(seen).toEqual([1, 2])
> })
>
> test('те саме значення не сповіщає (Object.is)', () => {
>   const s = signal(NaN)
>   const spy = vi.fn()
>   s.subscribe(spy)
>   s.value = NaN
>   expect(spy).toHaveBeenCalledTimes(0)
>   s.value = 0
>   s.value = -0
>   expect(spy).toHaveBeenCalledTimes(2)
> })
>
> test('відписка під час сповіщення не ламає інших', () => {
>   const s = signal(0)
>   const second = vi.fn()
>   const off = s.subscribe(() => off())
>   s.subscribe(second)
>   s.value = 1
>   s.value = 2
>   expect(second).toHaveBeenCalledTimes(2)
> })
>
> test('сигнали незалежні', () => {
>   const a = signal('a')
>   const b = signal('b')
>   const spy = vi.fn()
>   a.subscribe(spy)
>   b.value = 'B'
>   expect(spy).toHaveBeenCalledTimes(0)
> })
> ```
>
> > [!hint]- Підказка 1
> > `get value()` і `set value(next)` у літералі об'єкта; змінна `value` і `Set` спостерігачів живуть у замиканні.
>
> > [!hint]- Підказка 2
> > `subscribe`: `const observer = { notify: () => fn(value) }`. У сеттері ітеруй копію: `for (const o of [...observers]) o.notify()`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function signal(initial) {
> >   let value = initial
> >   const observers = new Set()
> >   return {
> >     get value() {
> >       return value
> >     },
> >     set value(next) {
> >       if (Object.is(next, value)) return
> >       value = next
> >       for (const observer of [...observers]) observer.notify()
> >     },
> >     peek: () => value,
> >     subscribe(fn) {
> >       const observer = { notify: () => fn(value) }
> >       observers.add(observer)
> >       return () => observers.delete(observer)
> >     },
> >   }
> > }
> > ```
> > **Чому так:** геттер/сеттер дає природний синтаксис `count.value++` і — головне — **точку перехоплення читання**, без якої автотрекінг на наступному кроці неможливий. `Object.is` замість `===` коректно порівнює `NaN` (не сповіщає даремно) і відрізняє `0` від `-0`. Спостерігач-об'єкт, а не функція, — спільний інтерфейс для підписок, ефектів і computed.

## 🛠️ Крок 2. effect і автоматичне відстеження

`effect(fn)` запускає `fn` одразу, а потім — щоразу, коли змінюється будь-який сигнал, який `fn` **прочитала під час останнього запуску**. Ключ — глобальна `activeObserver`: перед `fn` ставимо в неї ефект, а геттер сигналу реєструє того, хто читає. Перед кожним запуском ефект відписується від усіх старих залежностей — так `if (flag.value) a.value else b.value` підписаний лише на ту гілку, що виконалась.

> [!task] Крок 2 · track, cleanupDeps, effect
> level: senior · difficulty: hard · id: jsp-06-task-02 · tags: reactivity, dependency-tracking, closures
>
> Додай до коду кроку 1:
>
> - `let activeObserver = null`;
> - `track(observers)` — якщо є `activeObserver`, додає його в `observers`, а `observers` — у `activeObserver.deps`;
> - `cleanupDeps(observer)` — видаляє `observer` з усіх наборів у його `deps` і очищує `deps`;
> - у геттері `value` сигналу — виклик `track(observers)` (`peek` не відстежується!);
> - `effect(fn)` — спостерігач `{ deps, notify }`: запускає `fn` одразу і на кожне `notify`; перед кожним запуском — `cleanupDeps`; повертає `dispose()`, після якого ефект більше не запускається. Відновлюй **попередній** `activeObserver` після запуску (навіть якщо `fn` кинула помилку).
>
> ```js starter
> function signal(initial) {
>   let value = initial
>   const observers = new Set()
>   return {
>     get value() {
>       return value
>     },
>     set value(next) {
>       if (Object.is(next, value)) return
>       value = next
>       for (const observer of [...observers]) observer.notify()
>     },
>     peek: () => value,
>     subscribe(fn) {
>       const observer = { notify: () => fn(value) }
>       observers.add(observer)
>       return () => observers.delete(observer)
>     },
>   }
> }
>
> let activeObserver = null
>
> function track(observers) {
>   // твій код
> }
>
> function cleanupDeps(observer) {
>   // твій код
> }
>
> // TODO: у геттері value сигналу виклич track(observers)
>
> function effect(fn) {
>   // твій код
> }
> ```
>
> ```js tests
> test('ефект запускається одразу і на зміну', () => {
>   const count = signal(1)
>   const seen = []
>   effect(() => seen.push(count.value))
>   count.value = 2
>   count.value = 2
>   expect(seen).toEqual([1, 2])
> })
>
> test('динамічні залежності', () => {
>   const flag = signal(true)
>   const a = signal('a')
>   const b = signal('b')
>   const seen = []
>   effect(() => seen.push(flag.value ? a.value : b.value))
>   b.value = 'B'
>   expect(seen).toEqual(['a'])
>   flag.value = false
>   a.value = 'A'
>   expect(seen).toEqual(['a', 'B'])
>   b.value = 'BB'
>   expect(seen).toEqual(['a', 'B', 'BB'])
> })
>
> test('peek не створює залежність', () => {
>   const a = signal(1)
>   const b = signal(10)
>   const seen = []
>   effect(() => seen.push(a.value + b.peek()))
>   b.value = 20
>   a.value = 2
>   expect(seen).toEqual([11, 22])
> })
>
> test('dispose зупиняє ефект', () => {
>   const s = signal(0)
>   const spy = vi.fn(() => s.value)
>   const dispose = effect(spy)
>   dispose()
>   s.value = 1
>   expect(spy).toHaveBeenCalledTimes(1)
> })
>
> test('ланцюжок ефектів і відновлення activeObserver після помилки', () => {
>   const a = signal(1)
>   const double = signal(0)
>   effect(() => {
>     double.value = a.value * 2
>   })
>   const seen = []
>   effect(() => seen.push(double.value))
>   a.value = 5
>   expect(seen).toEqual([2, 10])
>   expect(() => effect(() => {
>     a.value
>     throw new Error('boom')
>   })).toThrow('boom')
>   const outside = signal(0)
>   outside.value
>   expect(activeObserver).toBeNull()
> })
> ```
>
> > [!hint]- Підказка 1
> > `track`: `if (activeObserver === null) return; observers.add(activeObserver); activeObserver.deps.add(observers)`.
>
> > [!hint]- Підказка 2
> > `effect`: `const observer = { deps: new Set(), disposed: false, notify: () => run() }`. У `run`: перевір `disposed`, `cleanupDeps(observer)`, збережи `prev`, постав `activeObserver = observer`, `try { fn() } finally { activeObserver = prev }`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > let activeObserver = null
> >
> > function track(observers) {
> >   if (activeObserver === null) return
> >   observers.add(activeObserver)
> >   activeObserver.deps.add(observers)
> > }
> >
> > function cleanupDeps(observer) {
> >   for (const observers of observer.deps) observers.delete(observer)
> >   observer.deps.clear()
> > }
> >
> > function signal(initial) {
> >   let value = initial
> >   const observers = new Set()
> >   return {
> >     get value() {
> >       track(observers)
> >       return value
> >     },
> >     set value(next) {
> >       if (Object.is(next, value)) return
> >       value = next
> >       for (const observer of [...observers]) observer.notify()
> >     },
> >     peek: () => value,
> >     subscribe(fn) {
> >       const observer = { notify: () => fn(value) }
> >       observers.add(observer)
> >       return () => observers.delete(observer)
> >     },
> >   }
> > }
> >
> > function effect(fn) {
> >   const observer = { deps: new Set(), disposed: false, notify: () => run() }
> >
> >   function run() {
> >     if (observer.disposed) return
> >     cleanupDeps(observer)
> >     const prev = activeObserver
> >     activeObserver = observer
> >     try {
> >       fn()
> >     } finally {
> >       activeObserver = prev
> >     }
> >   }
> >
> >   run()
> >   return () => {
> >     observer.disposed = true
> >     cleanupDeps(observer)
> >   }
> > }
> > ```
> > **Чому так:** автотрекінг — це «хто зараз виконується» в глобальній змінній плюс перехоплення читання. Ніяких масивів залежностей, як у `useEffect`, — їх неможливо забути чи переплутати. Повна відписка перед кожним запуском (`cleanupDeps`) робить залежності **динамічними**: ефект підписаний рівно на те, що прочитав востаннє. `prev` замість `null` підтримує вкладені ефекти і computed, а `finally` не лишає систему зламаною після винятку.

## 🛠️ Крок 3. computed — лінивий і кешований

`computed(fn)` — сигнал, значення якого виводиться з інших. Він водночас **спостерігач** (залежить від сигналів) і **джерело** (від нього залежать ефекти). Він лінивий: не рахує, поки його ніхто не читає, і кешує результат до зміни залежностей. При зміні він лише ставить прапорець `dirty` і передає сповіщення далі — а перераховує при наступному читанні.

> [!task] Крок 3 · computed
> level: senior · difficulty: hard · id: jsp-06-task-03 · tags: reactivity, memoization, lazy
>
> Додай `computed(fn)` → `{ value (лише геттер), peek() }`:
>
> - `fn` не викликається до першого читання;
> - повторні читання без змін залежностей не викликають `fn`;
> - зміна залежності позначає computed «брудним» і сповіщає **його** спостерігачів (ефекти, інші computed); `fn` перераховується при наступному читанні;
> - читання `value` всередині ефекту чи іншого computed відстежується; `peek()` — ні;
> - залежності `fn` динамічні (як в ефекті).
>
> ```js starter
> let activeObserver = null
>
> function track(observers) {
>   if (activeObserver === null) return
>   observers.add(activeObserver)
>   activeObserver.deps.add(observers)
> }
>
> function cleanupDeps(observer) {
>   for (const observers of observer.deps) observers.delete(observer)
>   observer.deps.clear()
> }
>
> function signal(initial) {
>   let value = initial
>   const observers = new Set()
>   return {
>     get value() {
>       track(observers)
>       return value
>     },
>     set value(next) {
>       if (Object.is(next, value)) return
>       value = next
>       for (const observer of [...observers]) observer.notify()
>     },
>     peek: () => value,
>     subscribe(fn) {
>       const observer = { notify: () => fn(value) }
>       observers.add(observer)
>       return () => observers.delete(observer)
>     },
>   }
> }
>
> function effect(fn) {
>   const observer = { deps: new Set(), disposed: false, notify: () => run() }
>
>   function run() {
>     if (observer.disposed) return
>     cleanupDeps(observer)
>     const prev = activeObserver
>     activeObserver = observer
>     try {
>       fn()
>     } finally {
>       activeObserver = prev
>     }
>   }
>
>   run()
>   return () => {
>     observer.disposed = true
>     cleanupDeps(observer)
>   }
> }
>
> function computed(fn) {
>   // твій код
> }
> ```
>
> ```js tests
> test('лінивий і кешований', () => {
>   const a = signal(2)
>   const fn = vi.fn(() => a.value * 10)
>   const big = computed(fn)
>   expect(fn).toHaveBeenCalledTimes(0)
>   expect(big.value).toBe(20)
>   expect(big.value).toBe(20)
>   expect(fn).toHaveBeenCalledTimes(1)
> })
>
> test('перераховується після зміни залежності — при читанні', () => {
>   const a = signal(1)
>   const fn = vi.fn(() => a.value + 1)
>   const next = computed(fn)
>   next.value
>   a.value = 5
>   expect(fn).toHaveBeenCalledTimes(1)
>   expect(next.value).toBe(6)
>   expect(fn).toHaveBeenCalledTimes(2)
> })
>
> test('ефект реагує на computed', () => {
>   const first = signal('Оля')
>   const last = signal('Коваль')
>   const full = computed(() => `${first.value} ${last.value}`)
>   const seen = []
>   effect(() => seen.push(full.value))
>   last.value = 'Шевченко'
>   expect(seen).toEqual(['Оля Коваль', 'Оля Шевченко'])
> })
>
> test('computed від computed', () => {
>   const n = signal(2)
>   const square = computed(() => n.value * n.value)
>   const plusOne = computed(() => square.value + 1)
>   expect(plusOne.value).toBe(5)
>   n.value = 3
>   expect(plusOne.value).toBe(10)
> })
>
> test('peek не відстежується, динамічні залежності', () => {
>   const useA = signal(true)
>   const a = signal('a')
>   const b = signal('b')
>   const fn = vi.fn(() => (useA.value ? a.value : b.value))
>   const pick = computed(fn)
>   const seen = []
>   effect(() => seen.push(pick.peek()))
>   useA.value = false
>   expect(seen).toEqual(['a'])
>   expect(pick.value).toBe('b')
>   a.value = 'A'
>   expect(pick.value).toBe('b')
>   expect(fn).toHaveBeenCalledTimes(2)
> })
> ```
>
> > [!hint]- Підказка 1
> > У замиканні: `value`, `dirty = true`, `observers = new Set()` і внутрішній спостерігач `self = { deps: new Set(), notify() { … } }`. `notify`: якщо вже `dirty` — вихід; інакше `dirty = true` і сповісти копію `observers`.
>
> > [!hint]- Підказка 2
> > Внутрішня `read()`: якщо `dirty` — `cleanupDeps(self)`, постав `activeObserver = self`, порахуй `fn()`, віднови `prev`, `dirty = false`. Геттер `value` = `track(observers)` + `read()`; `peek` = просто `read()`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > let activeObserver = null
> >
> > function track(observers) {
> >   if (activeObserver === null) return
> >   observers.add(activeObserver)
> >   activeObserver.deps.add(observers)
> > }
> >
> > function cleanupDeps(observer) {
> >   for (const observers of observer.deps) observers.delete(observer)
> >   observer.deps.clear()
> > }
> >
> > function signal(initial) {
> >   let value = initial
> >   const observers = new Set()
> >   return {
> >     get value() {
> >       track(observers)
> >       return value
> >     },
> >     set value(next) {
> >       if (Object.is(next, value)) return
> >       value = next
> >       for (const observer of [...observers]) observer.notify()
> >     },
> >     peek: () => value,
> >     subscribe(fn) {
> >       const observer = { notify: () => fn(value) }
> >       observers.add(observer)
> >       return () => observers.delete(observer)
> >     },
> >   }
> > }
> >
> > function effect(fn) {
> >   const observer = { deps: new Set(), disposed: false, notify: () => run() }
> >
> >   function run() {
> >     if (observer.disposed) return
> >     cleanupDeps(observer)
> >     const prev = activeObserver
> >     activeObserver = observer
> >     try {
> >       fn()
> >     } finally {
> >       activeObserver = prev
> >     }
> >   }
> >
> >   run()
> >   return () => {
> >     observer.disposed = true
> >     cleanupDeps(observer)
> >   }
> > }
> >
> > function computed(fn) {
> >   let value
> >   let dirty = true
> >   const observers = new Set()
> >   const self = {
> >     deps: new Set(),
> >     notify() {
> >       if (dirty) return
> >       dirty = true
> >       for (const observer of [...observers]) observer.notify()
> >     },
> >   }
> >
> >   function read() {
> >     if (dirty) {
> >       cleanupDeps(self)
> >       const prev = activeObserver
> >       activeObserver = self
> >       try {
> >         value = fn()
> >       } finally {
> >         activeObserver = prev
> >       }
> >       dirty = false
> >     }
> >     return value
> >   }
> >
> >   return {
> >     get value() {
> >       track(observers)
> >       return read()
> >     },
> >     peek: read,
> >   }
> > }
> > ```
> > **Чому так:** це модель **push-pull**: зміна *штовхає* дешевий сигнал «я брудний» вниз по графу, а дороге обчислення *тягнеться* лише тоді, коли значення справді потрібне. Computed, який ніхто не читає, не коштує нічого. `if (dirty) return` у `notify` обриває повторні хвилі: брудний computed уже сповістив своїх спостерігачів. Обмеження: ефект над computed перезапуститься навіть якщо новий результат дорівнює старому — Preact Signals і Solid додатково порівнюють значення.

## 🛠️ Крок 4. batch і «діамант» без глітчів

Проблема: `a` → `b = a * 2` і `c = a + 1`, ефект читає `b` і `c`. Зміна `a` сповіщає `b` → ефект запускається **одразу** і бачить нове `b`, але… далі сповіщається `c` → ефект запускається вдруге. Перший запуск — зайвий, а в складніших графах він ще й бачить неузгоджений стан («глітч»). Рішення: ефекти не запускаються в `notify`, а стають у чергу `pending` і виконуються **один раз** після завершення хвилі. `batch(fn)` дає те саме для кількох присвоєнь поспіль.

> [!task] Крок 4 · batch і черга ефектів
> level: senior · difficulty: hard · id: jsp-06-task-04 · tags: batching, scheduling, glitches
>
> Зміни і доповни код:
>
> - `batchDepth`, `pending = new Set()`; `batch(fn)` — виконує `fn` (повертає її результат); після **зовнішнього** batch — `flush()`;
> - `flush()` — поки `pending` не порожній: бере копію, очищає `pending`, викликає `run()` кожного спостерігача. Під час `flush` `activeObserver` має бути `null`; повторний вхід у `flush` (з ефекту) — нічого не робить, зовнішній цикл підбере нові ефекти. Понад 100 хвиль поспіль → очистити чергу і кинути `Error('Схоже на нескінченний цикл ефектів')`;
> - сеттер сигналу сповіщає спостерігачів **усередині** `batch`;
> - `notify` ефекту і підписки `subscribe` лише додає спостерігача в `pending` (у них з'являється метод `run`); `notify` computed лишається синхронним;
> - `dispose` ефекту і відписка `subscribe` прибирають спостерігача і з `pending`.
>
> ```js starter
> let activeObserver = null
>
> function track(observers) {
>   if (activeObserver === null) return
>   observers.add(activeObserver)
>   activeObserver.deps.add(observers)
> }
>
> function cleanupDeps(observer) {
>   for (const observers of observer.deps) observers.delete(observer)
>   observer.deps.clear()
> }
>
> function signal(initial) {
>   let value = initial
>   const observers = new Set()
>   return {
>     get value() {
>       track(observers)
>       return value
>     },
>     set value(next) {
>       if (Object.is(next, value)) return
>       value = next
>       for (const observer of [...observers]) observer.notify()
>     },
>     peek: () => value,
>     subscribe(fn) {
>       const observer = { notify: () => fn(value) }
>       observers.add(observer)
>       return () => observers.delete(observer)
>     },
>   }
> }
>
> function effect(fn) {
>   const observer = { deps: new Set(), disposed: false, notify: () => run() }
>
>   function run() {
>     if (observer.disposed) return
>     cleanupDeps(observer)
>     const prev = activeObserver
>     activeObserver = observer
>     try {
>       fn()
>     } finally {
>       activeObserver = prev
>     }
>   }
>
>   run()
>   return () => {
>     observer.disposed = true
>     cleanupDeps(observer)
>   }
> }
>
> function computed(fn) {
>   let value
>   let dirty = true
>   const observers = new Set()
>   const self = {
>     deps: new Set(),
>     notify() {
>       if (dirty) return
>       dirty = true
>       for (const observer of [...observers]) observer.notify()
>     },
>   }
>
>   function read() {
>     if (dirty) {
>       cleanupDeps(self)
>       const prev = activeObserver
>       activeObserver = self
>       try {
>         value = fn()
>       } finally {
>         activeObserver = prev
>       }
>       dirty = false
>     }
>     return value
>   }
>
>   return {
>     get value() {
>       track(observers)
>       return read()
>     },
>     peek: read,
>   }
> }
>
> let batchDepth = 0
> let flushing = false
> const pending = new Set()
>
> function batch(fn) {
>   // твій код
> }
>
> function flush() {
>   // твій код
> }
>
> // TODO: сеттер сигналу — сповіщення всередині batch(…)
> // TODO: effect і subscribe — notify додає в pending, run виконує
> ```
>
> ```js tests
> test('batch: один запуск ефекту на кілька змін', () => {
>   const a = signal(1)
>   const b = signal(2)
>   const seen = []
>   effect(() => seen.push(a.value + b.value))
>   const result = batch(() => {
>     a.value = 10
>     b.value = 20
>     return 'готово'
>   })
>   expect(result).toBe('готово')
>   expect(seen).toEqual([3, 30])
> })
>
> test('вкладені batch — flush лише наприкінці зовнішнього', () => {
>   const a = signal(0)
>   const seen = []
>   effect(() => seen.push(a.value))
>   batch(() => {
>     batch(() => {
>       a.value = 1
>     })
>     expect(seen).toEqual([0])
>     a.value = 2
>   })
>   expect(seen).toEqual([0, 2])
> })
>
> test('діамант без глітчів', () => {
>   const a = signal(1)
>   const b = computed(() => a.value * 2)
>   const c = computed(() => a.value + 1)
>   const seen = []
>   effect(() => seen.push(`${b.value}/${c.value}`))
>   a.value = 5
>   expect(seen).toEqual(['2/2', '10/6'])
> })
>
> test('subscribe теж батчиться', () => {
>   const a = signal(0)
>   const spy = vi.fn()
>   a.subscribe(spy)
>   batch(() => {
>     a.value = 1
>     a.value = 2
>   })
>   expect(spy).toHaveBeenCalledTimes(1)
>   expect(spy).toHaveBeenCalledWith(2)
> })
>
> test('ефект, що пише в сигнал, і захист від нескінченного циклу', () => {
>   const a = signal(1)
>   const double = signal(0)
>   effect(() => {
>     double.value = a.value * 2
>   })
>   const seen = []
>   effect(() => seen.push(double.value))
>   a.value = 3
>   expect(seen).toEqual([2, 6])
>   const loop = signal(0)
>   expect(() => effect(() => {
>     loop.value = loop.value + 1
>   })).toThrow('нескінченний цикл')
> })
>
> test('dispose у batch скасовує запланований запуск', () => {
>   const a = signal(0)
>   const spy = vi.fn(() => a.value)
>   const dispose = effect(spy)
>   batch(() => {
>     a.value = 1
>     dispose()
>   })
>   expect(spy).toHaveBeenCalledTimes(1)
> })
> ```
>
> > [!hint]- Підказка 1
> > `batch`: `batchDepth++; try { return fn() } finally { batchDepth--; if (batchDepth === 0) flush() }`. Сеттер: `batch(() => { for (const o of [...observers]) o.notify() })`.
>
> > [!hint]- Підказка 2
> > `flush`: `if (flushing) return; flushing = true; const prev = activeObserver; activeObserver = null; try { let rounds = 0; while (pending.size) { … } } finally { activeObserver = prev; flushing = false }`.
>
> > [!hint]- Підказка 3
> > В ефекті: `const observer = { deps: new Set(), disposed: false, notify: () => pending.add(observer), run }`. У `subscribe`: `{ notify: () => pending.add(observer), run: () => fn(value) }`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > let activeObserver = null
> > let batchDepth = 0
> > let flushing = false
> > const pending = new Set()
> >
> > function track(observers) {
> >   if (activeObserver === null) return
> >   observers.add(activeObserver)
> >   activeObserver.deps.add(observers)
> > }
> >
> > function cleanupDeps(observer) {
> >   for (const observers of observer.deps) observers.delete(observer)
> >   observer.deps.clear()
> > }
> >
> > function batch(fn) {
> >   batchDepth++
> >   try {
> >     return fn()
> >   } finally {
> >     batchDepth--
> >     if (batchDepth === 0) flush()
> >   }
> > }
> >
> > function flush() {
> >   if (flushing) return
> >   flushing = true
> >   const prev = activeObserver
> >   activeObserver = null
> >   try {
> >     let rounds = 0
> >     while (pending.size > 0) {
> >       if (++rounds > 100) {
> >         pending.clear()
> >         throw new Error('Схоже на нескінченний цикл ефектів')
> >       }
> >       const queue = [...pending]
> >       pending.clear()
> >       for (const observer of queue) observer.run()
> >     }
> >   } finally {
> >     activeObserver = prev
> >     flushing = false
> >   }
> > }
> >
> > function signal(initial) {
> >   let value = initial
> >   const observers = new Set()
> >   return {
> >     get value() {
> >       track(observers)
> >       return value
> >     },
> >     set value(next) {
> >       if (Object.is(next, value)) return
> >       value = next
> >       batch(() => {
> >         for (const observer of [...observers]) observer.notify()
> >       })
> >     },
> >     peek: () => value,
> >     subscribe(fn) {
> >       const observer = { notify: () => pending.add(observer), run: () => fn(value) }
> >       observers.add(observer)
> >       return () => {
> >         observers.delete(observer)
> >         pending.delete(observer)
> >       }
> >     },
> >   }
> > }
> >
> > function effect(fn) {
> >   const observer = { deps: new Set(), disposed: false, notify: () => pending.add(observer), run }
> >
> >   function run() {
> >     if (observer.disposed) return
> >     cleanupDeps(observer)
> >     const prev = activeObserver
> >     activeObserver = observer
> >     try {
> >       fn()
> >     } finally {
> >       activeObserver = prev
> >     }
> >   }
> >
> >   run()
> >   return () => {
> >     observer.disposed = true
> >     cleanupDeps(observer)
> >     pending.delete(observer)
> >   }
> > }
> >
> > function computed(fn) {
> >   let value
> >   let dirty = true
> >   const observers = new Set()
> >   const self = {
> >     deps: new Set(),
> >     notify() {
> >       if (dirty) return
> >       dirty = true
> >       for (const observer of [...observers]) observer.notify()
> >     },
> >   }
> >
> >   function read() {
> >     if (dirty) {
> >       cleanupDeps(self)
> >       const prev = activeObserver
> >       activeObserver = self
> >       try {
> >         value = fn()
> >       } finally {
> >         activeObserver = prev
> >       }
> >       dirty = false
> >     }
> >     return value
> >   }
> >
> >   return {
> >     get value() {
> >       track(observers)
> >       return read()
> >     },
> >     peek: read,
> >   }
> > }
> > ```
> > **Чому так:** дві фази — **позначити** (синхронно, дешево, по всьому графу) і **виконати** (ефекти один раз, коли граф уже узгоджений) — це і є glitch-free. `Set` як черга дедуплікує: ефект, до якого сповіщення дійшло двома шляхами, виконається раз. Computed лишаються синхронними, бо лише ставлять прапорець, а ефекти читають їх уже після всієї хвилі. Сеттер завжди батчить сам себе — одиночне присвоєння теж проходить двофазно. Захист від 100+ хвиль перетворює зависання вкладки на зрозумілу помилку.

## 🛠️ Крок 5. Cleanup, untrack і ресурси

Ефекти створюють ресурси: таймери, підписки, слухачі DOM. Перед повторним запуском і при `dispose` їх треба звільнити — інакше витоки й «привиди». Конвенція (як у React і Solid): ефект **повертає** функцію очищення. А `untrack(fn)` дозволяє прочитати сигнал усередині ефекту, **не** підписуючись на нього.

> [!task] Крок 5 · cleanup і untrack
> level: senior · difficulty: medium · id: jsp-06-task-05 · tags: cleanup, memory, reactivity
>
> Доповни:
>
> - `untrack(fn)` — виконує `fn` з `activeObserver = null` і повертає її результат;
> - `effect(fn)`: якщо `fn` повернула функцію — це cleanup. Він викликається **перед** наступним запуском і при `dispose` (один раз), без відстеження залежностей;
> - повторний `dispose()` нічого не робить.
>
> ```js starter
> let activeObserver = null
> let batchDepth = 0
> let flushing = false
> const pending = new Set()
>
> function track(observers) {
>   if (activeObserver === null) return
>   observers.add(activeObserver)
>   activeObserver.deps.add(observers)
> }
>
> function cleanupDeps(observer) {
>   for (const observers of observer.deps) observers.delete(observer)
>   observer.deps.clear()
> }
>
> function batch(fn) {
>   batchDepth++
>   try {
>     return fn()
>   } finally {
>     batchDepth--
>     if (batchDepth === 0) flush()
>   }
> }
>
> function flush() {
>   if (flushing) return
>   flushing = true
>   const prev = activeObserver
>   activeObserver = null
>   try {
>     let rounds = 0
>     while (pending.size > 0) {
>       if (++rounds > 100) {
>         pending.clear()
>         throw new Error('Схоже на нескінченний цикл ефектів')
>       }
>       const queue = [...pending]
>       pending.clear()
>       for (const observer of queue) observer.run()
>     }
>   } finally {
>     activeObserver = prev
>     flushing = false
>   }
> }
>
> function signal(initial) {
>   let value = initial
>   const observers = new Set()
>   return {
>     get value() {
>       track(observers)
>       return value
>     },
>     set value(next) {
>       if (Object.is(next, value)) return
>       value = next
>       batch(() => {
>         for (const observer of [...observers]) observer.notify()
>       })
>     },
>     peek: () => value,
>     subscribe(fn) {
>       const observer = { notify: () => pending.add(observer), run: () => fn(value) }
>       observers.add(observer)
>       return () => {
>         observers.delete(observer)
>         pending.delete(observer)
>       }
>     },
>   }
> }
>
> function effect(fn) {
>   const observer = { deps: new Set(), disposed: false, notify: () => pending.add(observer), run }
>
>   function run() {
>     if (observer.disposed) return
>     cleanupDeps(observer)
>     const prev = activeObserver
>     activeObserver = observer
>     try {
>       fn()
>     } finally {
>       activeObserver = prev
>     }
>   }
>
>   run()
>   return () => {
>     observer.disposed = true
>     cleanupDeps(observer)
>     pending.delete(observer)
>   }
> }
>
> function computed(fn) {
>   let value
>   let dirty = true
>   const observers = new Set()
>   const self = {
>     deps: new Set(),
>     notify() {
>       if (dirty) return
>       dirty = true
>       for (const observer of [...observers]) observer.notify()
>     },
>   }
>
>   function read() {
>     if (dirty) {
>       cleanupDeps(self)
>       const prev = activeObserver
>       activeObserver = self
>       try {
>         value = fn()
>       } finally {
>         activeObserver = prev
>       }
>       dirty = false
>     }
>     return value
>   }
>
>   return {
>     get value() {
>       track(observers)
>       return read()
>     },
>     peek: read,
>   }
> }
>
> function untrack(fn) {
>   // твій код
> }
>
> // TODO: effect — збережи результат fn() як cleanup,
> // виклич його (через untrack) перед наступним run і в dispose
> ```
>
> ```js tests
> test('cleanup перед повторним запуском бачить старі значення', () => {
>   const id = signal(1)
>   const log = []
>   effect(() => {
>     const current = id.value
>     log.push(`підписка ${current}`)
>     return () => log.push(`відписка ${current}`)
>   })
>   id.value = 2
>   expect(log).toEqual(['підписка 1', 'відписка 1', 'підписка 2'])
> })
>
> test('cleanup при dispose — один раз', () => {
>   const cleanup = vi.fn()
>   const dispose = effect(() => cleanup)
>   dispose()
>   dispose()
>   expect(cleanup).toHaveBeenCalledTimes(1)
> })
>
> test('cleanup прибирає таймери', () => {
>   vi.useFakeTimers()
>   const delay = signal(100)
>   const ticks = []
>   const dispose = effect(() => {
>     const timer = setInterval(() => ticks.push(delay.peek()), delay.value)
>     return () => clearInterval(timer)
>   })
>   vi.advanceTimersByTime(250)
>   delay.value = 50
>   expect(vi.getTimerCount()).toBe(1)
>   dispose()
>   expect(vi.getTimerCount()).toBe(0)
>   expect(ticks).toEqual([100, 100])
> })
>
> test('untrack читає без підписки', () => {
>   const a = signal(1)
>   const b = signal(10)
>   const seen = []
>   effect(() => seen.push(a.value + untrack(() => b.value)))
>   b.value = 20
>   a.value = 2
>   expect(seen).toEqual([11, 22])
>   expect(untrack(() => 'результат')).toBe('результат')
> })
>
> test('ефект без cleanup працює як раніше', () => {
>   const a = signal(0)
>   const seen = []
>   effect(() => {
>     seen.push(a.value)
>   })
>   a.value = 1
>   expect(seen).toEqual([0, 1])
> })
> ```
>
> > [!hint]- Підказка 1
> > `untrack` — копія патерну з `run`: збережи `prev`, постав `null`, `try { return fn() } finally { activeObserver = prev }`.
>
> > [!hint]- Підказка 2
> > В ефекті заведи `let cleanup = null` і функцію `runCleanup()`: забирає `cleanup` у локальну змінну, обнуляє, і якщо це функція — `untrack(current)`. Виклич її в `run` після `cleanupDeps` і в `dispose`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > let activeObserver = null
> > let batchDepth = 0
> > let flushing = false
> > const pending = new Set()
> >
> > function track(observers) {
> >   if (activeObserver === null) return
> >   observers.add(activeObserver)
> >   activeObserver.deps.add(observers)
> > }
> >
> > function cleanupDeps(observer) {
> >   for (const observers of observer.deps) observers.delete(observer)
> >   observer.deps.clear()
> > }
> >
> > function untrack(fn) {
> >   const prev = activeObserver
> >   activeObserver = null
> >   try {
> >     return fn()
> >   } finally {
> >     activeObserver = prev
> >   }
> > }
> >
> > function batch(fn) {
> >   batchDepth++
> >   try {
> >     return fn()
> >   } finally {
> >     batchDepth--
> >     if (batchDepth === 0) flush()
> >   }
> > }
> >
> > function flush() {
> >   if (flushing) return
> >   flushing = true
> >   const prev = activeObserver
> >   activeObserver = null
> >   try {
> >     let rounds = 0
> >     while (pending.size > 0) {
> >       if (++rounds > 100) {
> >         pending.clear()
> >         throw new Error('Схоже на нескінченний цикл ефектів')
> >       }
> >       const queue = [...pending]
> >       pending.clear()
> >       for (const observer of queue) observer.run()
> >     }
> >   } finally {
> >     activeObserver = prev
> >     flushing = false
> >   }
> > }
> >
> > function signal(initial) {
> >   let value = initial
> >   const observers = new Set()
> >   return {
> >     get value() {
> >       track(observers)
> >       return value
> >     },
> >     set value(next) {
> >       if (Object.is(next, value)) return
> >       value = next
> >       batch(() => {
> >         for (const observer of [...observers]) observer.notify()
> >       })
> >     },
> >     peek: () => value,
> >     subscribe(fn) {
> >       const observer = { notify: () => pending.add(observer), run: () => fn(value) }
> >       observers.add(observer)
> >       return () => {
> >         observers.delete(observer)
> >         pending.delete(observer)
> >       }
> >     },
> >   }
> > }
> >
> > function effect(fn) {
> >   let cleanup = null
> >   const observer = { deps: new Set(), disposed: false, notify: () => pending.add(observer), run }
> >
> >   function runCleanup() {
> >     const current = cleanup
> >     cleanup = null
> >     if (typeof current === 'function') untrack(current)
> >   }
> >
> >   function run() {
> >     if (observer.disposed) return
> >     cleanupDeps(observer)
> >     runCleanup()
> >     const prev = activeObserver
> >     activeObserver = observer
> >     try {
> >       cleanup = fn()
> >     } finally {
> >       activeObserver = prev
> >     }
> >   }
> >
> >   run()
> >   return () => {
> >     if (observer.disposed) return
> >     observer.disposed = true
> >     cleanupDeps(observer)
> >     pending.delete(observer)
> >     runCleanup()
> >   }
> > }
> >
> > function computed(fn) {
> >   let value
> >   let dirty = true
> >   const observers = new Set()
> >   const self = {
> >     deps: new Set(),
> >     notify() {
> >       if (dirty) return
> >       dirty = true
> >       for (const observer of [...observers]) observer.notify()
> >     },
> >   }
> >
> >   function read() {
> >     if (dirty) {
> >       cleanupDeps(self)
> >       const prev = activeObserver
> >       activeObserver = self
> >       try {
> >         value = fn()
> >       } finally {
> >         activeObserver = prev
> >       }
> >       dirty = false
> >     }
> >     return value
> >   }
> >
> >   return {
> >     get value() {
> >       track(observers)
> >       return read()
> >     },
> >     peek: read,
> >   }
> > }
> > ```
> > **Чому так:** cleanup живе в замиканні **конкретного** запуску, тож бачить старі значення (`відписка 1`) — саме те, що треба, щоб відписатися від старого ресурсу. Він виконується через `untrack`: читання сигналів у cleanup не повинно підписувати ефект. Обнулення `cleanup` перед викликом гарантує «рівно один раз», навіть якщо cleanup кине помилку. `untrack` — аварійний вихід із автотрекінгу: «мені потрібне поточне значення, але не реагуй на нього».

## 🛠️ Крок 6. Шар прив'язки до об'єктів

Сигнали не знають про DOM — і не мусять. `bind(target, bindings)` прив'язує властивості **будь-якого** об'єкта до сигналів чи функцій: у тестах це звичайний `{}`, у браузері — `HTMLElement` (`textContent`, `className`, `disabled` — теж просто властивості). `bindInput` додає зворотний напрям: введення користувача пише в сигнал.

> [!task] Крок 6 · bind і bindInput
> level: senior · difficulty: medium · id: jsp-06-task-06 · tags: binding, dom-free, two-way
>
> Додай:
>
> - `bind(target, bindings)` — для кожної пари `prop: source`:
>   - `source` — функція → ефект `target[prop] = source()`;
>   - `source` — об'єкт із властивістю `value` (сигнал, computed) → ефект `target[prop] = source.value`;
>   - інакше — одноразове присвоєння;
>   - повертає `dispose()` для всіх ефектів;
> - `bindInput(input, sig)` — двосторонній зв'язок: ефект `input.value = sig.value` + слухач `'input'`, що пише `input.value` у `sig`; повертає `dispose()`, який зупиняє ефект і знімає слухача.
>
> ```js starter
> let activeObserver = null
> let batchDepth = 0
> let flushing = false
> const pending = new Set()
>
> function track(observers) {
>   if (activeObserver === null) return
>   observers.add(activeObserver)
>   activeObserver.deps.add(observers)
> }
>
> function cleanupDeps(observer) {
>   for (const observers of observer.deps) observers.delete(observer)
>   observer.deps.clear()
> }
>
> function untrack(fn) {
>   const prev = activeObserver
>   activeObserver = null
>   try {
>     return fn()
>   } finally {
>     activeObserver = prev
>   }
> }
>
> function batch(fn) {
>   batchDepth++
>   try {
>     return fn()
>   } finally {
>     batchDepth--
>     if (batchDepth === 0) flush()
>   }
> }
>
> function flush() {
>   if (flushing) return
>   flushing = true
>   const prev = activeObserver
>   activeObserver = null
>   try {
>     let rounds = 0
>     while (pending.size > 0) {
>       if (++rounds > 100) {
>         pending.clear()
>         throw new Error('Схоже на нескінченний цикл ефектів')
>       }
>       const queue = [...pending]
>       pending.clear()
>       for (const observer of queue) observer.run()
>     }
>   } finally {
>     activeObserver = prev
>     flushing = false
>   }
> }
>
> function signal(initial) {
>   let value = initial
>   const observers = new Set()
>   return {
>     get value() {
>       track(observers)
>       return value
>     },
>     set value(next) {
>       if (Object.is(next, value)) return
>       value = next
>       batch(() => {
>         for (const observer of [...observers]) observer.notify()
>       })
>     },
>     peek: () => value,
>     subscribe(fn) {
>       const observer = { notify: () => pending.add(observer), run: () => fn(value) }
>       observers.add(observer)
>       return () => {
>         observers.delete(observer)
>         pending.delete(observer)
>       }
>     },
>   }
> }
>
> function effect(fn) {
>   let cleanup = null
>   const observer = { deps: new Set(), disposed: false, notify: () => pending.add(observer), run }
>
>   function runCleanup() {
>     const current = cleanup
>     cleanup = null
>     if (typeof current === 'function') untrack(current)
>   }
>
>   function run() {
>     if (observer.disposed) return
>     cleanupDeps(observer)
>     runCleanup()
>     const prev = activeObserver
>     activeObserver = observer
>     try {
>       cleanup = fn()
>     } finally {
>       activeObserver = prev
>     }
>   }
>
>   run()
>   return () => {
>     if (observer.disposed) return
>     observer.disposed = true
>     cleanupDeps(observer)
>     pending.delete(observer)
>     runCleanup()
>   }
> }
>
> function computed(fn) {
>   let value
>   let dirty = true
>   const observers = new Set()
>   const self = {
>     deps: new Set(),
>     notify() {
>       if (dirty) return
>       dirty = true
>       for (const observer of [...observers]) observer.notify()
>     },
>   }
>
>   function read() {
>     if (dirty) {
>       cleanupDeps(self)
>       const prev = activeObserver
>       activeObserver = self
>       try {
>         value = fn()
>       } finally {
>         activeObserver = prev
>       }
>       dirty = false
>     }
>     return value
>   }
>
>   return {
>     get value() {
>       track(observers)
>       return read()
>     },
>     peek: read,
>   }
> }
>
> function bind(target, bindings) {
>   // твій код
> }
>
> function bindInput(input, sig) {
>   // твій код
> }
> ```
>
> ```js tests
> function fakeInput() {
>   const listeners = new Set()
>   return {
>     value: '',
>     addEventListener: (type, fn) => type === 'input' && listeners.add(fn),
>     removeEventListener: (type, fn) => listeners.delete(fn),
>     type(text) {
>       this.value = text
>       for (const fn of [...listeners]) fn({ target: this })
>     },
>     get listenerCount() {
>       return listeners.size
>     },
>   }
> }
>
> test('bind: сигнали, функції і статичні значення', () => {
>   const name = signal('Оля')
>   const el = {}
>   bind(el, { textContent: name, title: () => `Привіт, ${name.value}!`, className: 'greeting' })
>   expect(el).toEqual({ textContent: 'Оля', title: 'Привіт, Оля!', className: 'greeting' })
>   name.value = 'Петро'
>   expect(el.title).toBe('Привіт, Петро!')
>   expect(el.textContent).toBe('Петро')
> })
>
> test('computed як джерело і dispose', () => {
>   const count = signal(1)
>   const label = computed(() => `×${count.value}`)
>   const el = {}
>   const dispose = bind(el, { textContent: label, disabled: () => count.value >= 3 })
>   count.value = 3
>   expect(el).toEqual({ textContent: '×3', disabled: true })
>   dispose()
>   count.value = 1
>   expect(el.textContent).toBe('×3')
> })
>
> test('batch — один запис на кілька змін', () => {
>   const first = signal('A')
>   const last = signal('B')
>   const writes = []
>   const el = { set textContent(v) { writes.push(v) } }
>   bind(el, { textContent: () => `${first.value} ${last.value}` })
>   batch(() => {
>     first.value = 'X'
>     last.value = 'Y'
>   })
>   expect(writes).toEqual(['A B', 'X Y'])
> })
>
> test('bindInput: двосторонній зв\'язок', () => {
>   const query = signal('старт')
>   const input = fakeInput()
>   const dispose = bindInput(input, query)
>   expect(input.value).toBe('старт')
>   input.type('react')
>   expect(query.value).toBe('react')
>   query.value = 'vue'
>   expect(input.value).toBe('vue')
>   dispose()
>   expect(input.listenerCount).toBe(0)
>   query.value = 'svelte'
>   expect(input.value).toBe('vue')
> })
>
> test('міні-компонент: лічильник', () => {
>   const count = signal(0)
>   const doubled = computed(() => count.value * 2)
>   const output = {}
>   const button = {}
>   bind(output, { textContent: () => `${count.value} × 2 = ${doubled.value}` })
>   bind(button, { disabled: () => count.value >= 2 })
>   const click = () => count.value++
>   click()
>   click()
>   expect(output.textContent).toBe('2 × 2 = 4')
>   expect(button.disabled).toBe(true)
> })
> ```
>
> > [!hint]- Підказка 1
> > `Object.entries(bindings)` і три гілки. Для функції: `effect(() => { target[prop] = source() })` — **з фігурними дужками**, інакше стрілка поверне значення, і якщо воно функція — `effect` вважатиме його cleanup.
>
> > [!hint]- Підказка 2
> > `bindInput`: `const stop = effect(() => { input.value = sig.value })`, `const onInput = () => { sig.value = input.value }`, `input.addEventListener('input', onInput)`; `dispose` — `stop()` і `removeEventListener`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > let activeObserver = null
> > let batchDepth = 0
> > let flushing = false
> > const pending = new Set()
> >
> > function track(observers) {
> >   if (activeObserver === null) return
> >   observers.add(activeObserver)
> >   activeObserver.deps.add(observers)
> > }
> >
> > function cleanupDeps(observer) {
> >   for (const observers of observer.deps) observers.delete(observer)
> >   observer.deps.clear()
> > }
> >
> > function untrack(fn) {
> >   const prev = activeObserver
> >   activeObserver = null
> >   try {
> >     return fn()
> >   } finally {
> >     activeObserver = prev
> >   }
> > }
> >
> > function batch(fn) {
> >   batchDepth++
> >   try {
> >     return fn()
> >   } finally {
> >     batchDepth--
> >     if (batchDepth === 0) flush()
> >   }
> > }
> >
> > function flush() {
> >   if (flushing) return
> >   flushing = true
> >   const prev = activeObserver
> >   activeObserver = null
> >   try {
> >     let rounds = 0
> >     while (pending.size > 0) {
> >       if (++rounds > 100) {
> >         pending.clear()
> >         throw new Error('Схоже на нескінченний цикл ефектів')
> >       }
> >       const queue = [...pending]
> >       pending.clear()
> >       for (const observer of queue) observer.run()
> >     }
> >   } finally {
> >     activeObserver = prev
> >     flushing = false
> >   }
> > }
> >
> > function signal(initial) {
> >   let value = initial
> >   const observers = new Set()
> >   return {
> >     get value() {
> >       track(observers)
> >       return value
> >     },
> >     set value(next) {
> >       if (Object.is(next, value)) return
> >       value = next
> >       batch(() => {
> >         for (const observer of [...observers]) observer.notify()
> >       })
> >     },
> >     peek: () => value,
> >     subscribe(fn) {
> >       const observer = { notify: () => pending.add(observer), run: () => fn(value) }
> >       observers.add(observer)
> >       return () => {
> >         observers.delete(observer)
> >         pending.delete(observer)
> >       }
> >     },
> >   }
> > }
> >
> > function effect(fn) {
> >   let cleanup = null
> >   const observer = { deps: new Set(), disposed: false, notify: () => pending.add(observer), run }
> >
> >   function runCleanup() {
> >     const current = cleanup
> >     cleanup = null
> >     if (typeof current === 'function') untrack(current)
> >   }
> >
> >   function run() {
> >     if (observer.disposed) return
> >     cleanupDeps(observer)
> >     runCleanup()
> >     const prev = activeObserver
> >     activeObserver = observer
> >     try {
> >       cleanup = fn()
> >     } finally {
> >       activeObserver = prev
> >     }
> >   }
> >
> >   run()
> >   return () => {
> >     if (observer.disposed) return
> >     observer.disposed = true
> >     cleanupDeps(observer)
> >     pending.delete(observer)
> >     runCleanup()
> >   }
> > }
> >
> > function computed(fn) {
> >   let value
> >   let dirty = true
> >   const observers = new Set()
> >   const self = {
> >     deps: new Set(),
> >     notify() {
> >       if (dirty) return
> >       dirty = true
> >       for (const observer of [...observers]) observer.notify()
> >     },
> >   }
> >
> >   function read() {
> >     if (dirty) {
> >       cleanupDeps(self)
> >       const prev = activeObserver
> >       activeObserver = self
> >       try {
> >         value = fn()
> >       } finally {
> >         activeObserver = prev
> >       }
> >       dirty = false
> >     }
> >     return value
> >   }
> >
> >   return {
> >     get value() {
> >       track(observers)
> >       return read()
> >     },
> >     peek: read,
> >   }
> > }
> >
> > function bind(target, bindings) {
> >   const disposers = []
> >   for (const [prop, source] of Object.entries(bindings)) {
> >     if (typeof source === 'function') {
> >       disposers.push(effect(() => {
> >         target[prop] = source()
> >       }))
> >     } else if (source !== null && typeof source === 'object' && 'value' in source) {
> >       disposers.push(effect(() => {
> >         target[prop] = source.value
> >       }))
> >     } else {
> >       target[prop] = source
> >     }
> >   }
> >   return () => {
> >     for (const dispose of disposers) dispose()
> >   }
> > }
> >
> > function bindInput(input, sig) {
> >   const stop = effect(() => {
> >     input.value = sig.value
> >   })
> >   const onInput = () => {
> >     sig.value = input.value
> >   }
> >   input.addEventListener('input', onInput)
> >   return () => {
> >     stop()
> >     input.removeEventListener('input', onInput)
> >   }
> > }
> > ```
> > **Чому так:** кожна властивість — окремий ефект, тож зміна імені оновлює лише `textContent`, а не весь «компонент». Це **fine-grained reactivity**: без віртуального DOM і diff, оновлення йдуть точно в ті вузли, які залежать від сигналу (так працюють Solid і Svelte 5). Зв'язок з DOM — лише через властивості й `addEventListener`, тож шар тестується на звичайних об'єктах. Двосторонній зв'язок не зациклюється: запис того самого значення у сигнал відсікається `Object.is`.

## 🎤 На співбесіді

> [!interview] Як би ти масштабував цю реактивну систему на інтерфейс з десятками тисяч вузлів?
> level: senior · frequency: іноді · id: jsp-06-int-01
>
> ---
>
> **Топологічний порядок**: наш `flush` виконує ефекти в порядку постановки в чергу; у великих графах computed може перерахуватися двічі. Промислові рушії (Preact Signals, Solid, Angular) використовують **розфарбування** вузлів (`clean / check / dirty`) і версії сигналів: при читанні computed спершу перевіряє, чи справді змінились версії джерел, і лише тоді перераховується — плюс відсікають ефекти, якщо новий результат computed дорівнює старому. **Пам'ять**: ефекти тримають сигнали й навпаки; без `dispose` компонентів граф росте. Тому вводять **власність (ownership)**: ефекти, створені всередині компонента, реєструються в його scope і знищуються разом з ним (`createRoot` у Solid, `effectScope` у Vue). **Планування**: великі хвилі розбивають і виконують у мікрозадачі або `requestAnimationFrame`, щоб синхронізувати з рендером. **Списки**: для масивів — keyed-мапінг (`mapArray`, `<For>`), щоб не перестворювати всі рядки на зміну одного.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття]] · [TC39 Signals proposal](https://github.com/tc39/proposal-signals) · [Preact Signals](https://preactjs.com/guide/v10/signals/)

> [!interview] Сигнали чи віртуальний DOM: у чому різниця і коли що обирати?
> level: senior · frequency: часто · id: jsp-06-int-02
>
> ---
>
> **Virtual DOM** (React): компонент — функція стану, при зміні вона виконується **заново цілком**, а diff порівнює старе і нове дерево, щоб знайти мінімальні зміни DOM. Проста ментальна модель («UI = f(state)»), але робота пропорційна розміру компонента, а не зміні; оптимізація — мемоізація вручну (`memo`, `useMemo`). **Сигнали** (Solid, Svelte 5, Vue, Angular): граф залежностей відомий заздалегідь, зміна сигналу оновлює **лише** ті вузли DOM, що його читають, — робота пропорційна зміні, без diff. Ціна — інша модель: компонент виконується раз, деструктуризація пропсів ламає реактивність, треба розуміти `untrack` і власність ефектів. Обирав би сигнали для дуже інтерактивних інтерфейсів з частими дрібними оновленнями (дашборди, редактори), VDOM — коли важливіші екосистема й передбачуваність. React Compiler, своєю чергою, автоматизує мемоізацію — підходи зближуються.
>
> 📚 [[JavaScript - 26. Як браузер рендерить сторінку]] · [Vue: Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html) · [Ryan Carniato: Building a Reactive Library from Scratch](https://dev.to/ryansolid/building-a-reactive-library-from-scratch-1i0p)

## 🧠 Закріплення

> [!question]- Як сигнал дізнається, хто його читає?
> *часто · теорія* · `jsp-06-001`
>
> Через глобальну змінну `activeObserver`: ефект або computed перед виконанням своєї функції записує в неї себе, а геттер `value` сигналу додає поточного `activeObserver` у свій набір спостерігачів. Після виконання відновлюється попередній спостерігач — так працюють і вкладені обчислення.
>
> 📚 [[JavaScript - 05. Замикання]] · [Ryan Carniato: Building a Reactive Library from Scratch](https://dev.to/ryansolid/building-a-reactive-library-from-scratch-1i0p)

> [!question]- Навіщо ефекту відписуватися від усіх залежностей перед кожним запуском?
> *часто · дизайн* · `jsp-06-002`
>
> Щоб залежності були **динамічними**: у `flag ? a : b` після перемикання `flag` ефект більше не залежить від `a`. Без повного перевідстеження ефект лишався б підписаним на все, що будь-коли читав, — зайві запуски і витоки пам'яті. Двосторонній зв'язок `deps` робить відписку дешевою.
>
> 📚 [[JavaScript - 32. Патерни проєктування]] · [Vue: Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)

> [!question]- Що означає «computed лінивий» і чому це добре?
> *часто · теорія* · `jsp-06-003`
>
> Зміна залежності лише ставить прапорець `dirty`; перерахунок відбувається при наступному читанні. Computed, який зараз ніхто не читає (прихована вкладка, згорнута панель), не коштує нічого, а кілька змін поспіль дають один перерахунок. Це модель push (сповіщення) — pull (обчислення).
>
> 📚 [[JavaScript - 05. Замикання]] · [Preact Signals](https://preactjs.com/guide/v10/signals/)

> [!question]- Що таке «глітч» у реактивній системі і як його прибирає батчинг?
> *іноді · теорія* · `jsp-06-004`
>
> Глітч — тимчасово неузгоджений стан, який бачить ефект: у діаманті `a → b, c → effect` ефект запускається після оновлення `b`, але до оновлення `c`. Батчинг ділить роботу на дві фази: спершу синхронно позначити весь граф, потім виконати кожен ефект один раз, коли всі computed уже актуальні.
>
> 📚 [[JavaScript - 08. Event Loop]] · [TC39 Signals proposal](https://github.com/tc39/proposal-signals)

> [!question]- Навіщо `untrack`?
> *іноді · код* · `jsp-06-005`
>
> Щоб прочитати сигнал усередині ефекту, **не** підписуючись на нього: наприклад, логувати поточного користувача при зміні сторінки, але не перезапускати логування при зміні користувача. Також cleanup і колбеки подій виконуються без відстеження, щоб випадково не створити залежність.
>
> 📚 [[JavaScript - 32. Патерни проєктування]] · [SolidJS: Signals](https://docs.solidjs.com/concepts/signals)

> [!question]- Чому ефект повертає cleanup-функцію, а не має окремий `onDispose`?
> *часто · дизайн* · `jsp-06-006`
>
> Cleanup створюється в тому самому замиканні, що й ресурс (таймер, слухач), тож має до нього доступ і бачить значення саме того запуску. Він викликається перед кожним повтором і при `dispose` — ресурс завжди звільняється до створення нового. Та сама конвенція в React `useEffect` і Solid.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття]] · [Angular: Signals](https://angular.dev/guide/signals)

## ⚡ Фішки

> [!reel] 📡 Сигнали можуть стати частиною мови
> TC39 розглядає пропозицію `Signal.State` і `Signal.Computed` — спільне ядро для Angular, Vue, Solid, Preact, Svelte. Автори фреймворків працюють над нею разом.

> [!reel] 🧲 Деструктуризація вбиває реактивність
> `const { value } = count` читає значення **один раз** — далі це просто число. Тому в Solid не деструктуризують props, а у Vue є `toRefs`.
>
> ```js
> const { value } = count // знімок, не підписка
> ```

> [!reel] ⚛️ Svelte 5 = сигнали
> Руни `$state`, `$derived`, `$effect` у Svelte 5 — це сигнал, computed і effect, які компілятор підставляє замість тебе.

## 🖥️ Зібрати в браузері

Збережи як `signals.html`. Конвертер температур з двостороннім зв'язком і форма імені — **без** жодного ручного оновлення DOM: лише сигнали й `bind`. Справжні `<input>` і `<output>` мають ті самі `value`, `textContent` і `addEventListener`, що й наші фейкові об'єкти в тестах.

```html
<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <title>Сигнали</title>
  <style>
    body { font: 16px system-ui, sans-serif; max-width: 520px; margin: 40px auto; }
    label { display: block; margin: 8px 0; }
    .hot { color: #c62828; } .cold { color: #1565c0; }
    fieldset { margin: 16px 0; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>📡 Сигнали</h1>
  <fieldset>
    <legend>Привітання</legend>
    <label>Ім'я <input id="first" /></label>
    <label>Прізвище <input id="last" /></label>
    <p><output id="greeting"></output></p>
    <button id="reset">Скинути</button>
  </fieldset>
  <fieldset>
    <legend>Температура</legend>
    <label>°C <input id="celsius" type="number" /></label>
    <label>°F <input id="fahrenheit" type="number" /></label>
    <p id="verdict"></p>
  </fieldset>
  <p id="renders"></p>
  <script>
let activeObserver = null
let batchDepth = 0
let flushing = false
const pending = new Set()

function track(observers) {
  if (activeObserver === null) return
  observers.add(activeObserver)
  activeObserver.deps.add(observers)
}

function cleanupDeps(observer) {
  for (const observers of observer.deps) observers.delete(observer)
  observer.deps.clear()
}

function untrack(fn) {
  const prev = activeObserver
  activeObserver = null
  try {
    return fn()
  } finally {
    activeObserver = prev
  }
}

function batch(fn) {
  batchDepth++
  try {
    return fn()
  } finally {
    batchDepth--
    if (batchDepth === 0) flush()
  }
}

function flush() {
  if (flushing) return
  flushing = true
  const prev = activeObserver
  activeObserver = null
  try {
    let rounds = 0
    while (pending.size > 0) {
      if (++rounds > 100) {
        pending.clear()
        throw new Error('Схоже на нескінченний цикл ефектів')
      }
      const queue = [...pending]
      pending.clear()
      for (const observer of queue) observer.run()
    }
  } finally {
    activeObserver = prev
    flushing = false
  }
}

function signal(initial) {
  let value = initial
  const observers = new Set()
  return {
    get value() {
      track(observers)
      return value
    },
    set value(next) {
      if (Object.is(next, value)) return
      value = next
      batch(() => {
        for (const observer of [...observers]) observer.notify()
      })
    },
    peek: () => value,
    subscribe(fn) {
      const observer = { notify: () => pending.add(observer), run: () => fn(value) }
      observers.add(observer)
      return () => {
        observers.delete(observer)
        pending.delete(observer)
      }
    },
  }
}

function effect(fn) {
  let cleanup = null
  const observer = { deps: new Set(), disposed: false, notify: () => pending.add(observer), run }

  function runCleanup() {
    const current = cleanup
    cleanup = null
    if (typeof current === 'function') untrack(current)
  }

  function run() {
    if (observer.disposed) return
    cleanupDeps(observer)
    runCleanup()
    const prev = activeObserver
    activeObserver = observer
    try {
      cleanup = fn()
    } finally {
      activeObserver = prev
    }
  }

  run()
  return () => {
    if (observer.disposed) return
    observer.disposed = true
    cleanupDeps(observer)
    pending.delete(observer)
    runCleanup()
  }
}

function computed(fn) {
  let value
  let dirty = true
  const observers = new Set()
  const self = {
    deps: new Set(),
    notify() {
      if (dirty) return
      dirty = true
      for (const observer of [...observers]) observer.notify()
    },
  }

  function read() {
    if (dirty) {
      cleanupDeps(self)
      const prev = activeObserver
      activeObserver = self
      try {
        value = fn()
      } finally {
        activeObserver = prev
      }
      dirty = false
    }
    return value
  }

  return {
    get value() {
      track(observers)
      return read()
    },
    peek: read,
  }
}

function bind(target, bindings) {
  const disposers = []
  for (const [prop, source] of Object.entries(bindings)) {
    if (typeof source === 'function') {
      disposers.push(effect(() => {
        target[prop] = source()
      }))
    } else if (source !== null && typeof source === 'object' && 'value' in source) {
      disposers.push(effect(() => {
        target[prop] = source.value
      }))
    } else {
      target[prop] = source
    }
  }
  return () => {
    for (const dispose of disposers) dispose()
  }
}

function bindInput(input, sig) {
  const stop = effect(() => {
    input.value = sig.value
  })
  const onInput = () => {
    sig.value = input.value
  }
  input.addEventListener('input', onInput)
  return () => {
    stop()
    input.removeEventListener('input', onInput)
  }
}

    // ---------- стан
    const first = signal('Оля')
    const last = signal('Коваль')
    const full = computed(() => `${first.value} ${last.value}`.trim())
    const celsius = signal(20)
    const fahrenheit = computed(() => Math.round(celsius.value * 9 / 5 + 32))
    let writes = 0

    // ---------- DOM-шар: лише прив'язки
    const $ = (id) => document.getElementById(id)
    bindInput($('first'), first)
    bindInput($('last'), last)
    bind($('greeting'), { textContent: () => (writes++, full.value ? `Привіт, ${full.value}! 👋` : 'Як тебе звати?') })
    bind($('reset'), { disabled: () => first.value === '' && last.value === '' })
    $('reset').addEventListener('click', () => batch(() => {
      first.value = ''
      last.value = ''
    }))

    // число ↔ рядок: власний адаптер замість bindInput
    effect(() => { $('celsius').value = String(celsius.value) })
    effect(() => { $('fahrenheit').value = String(fahrenheit.value) })
    $('celsius').addEventListener('input', (e) => { if (e.target.value !== '') celsius.value = Number(e.target.value) })
    $('fahrenheit').addEventListener('input', (e) => { if (e.target.value !== '') celsius.value = Math.round((Number(e.target.value) - 32) * 5 / 9) })
    bind($('verdict'), {
      textContent: () => (celsius.value >= 25 ? '🔥 Спекотно' : celsius.value <= 0 ? '🥶 Мороз' : '🙂 Комфортно'),
      className: () => (celsius.value >= 25 ? 'hot' : celsius.value <= 0 ? 'cold' : ''),
    })

    // скільки разів реально оновився текст привітання
    effect(() => {
      full.value
      untrack(() => { $('renders').textContent = `Оновлень привітання: ${writes}` })
    })
  </script>
</body>
</html>
```

> [!tip] Подивись на точковість
> Відкрий DevTools → Elements і друкуй у полі «Ім'я»: підсвічується (оновлюється) лише `<output>`, а не вся сторінка. Натисни «Скинути» — обидва поля очищуються в одному `batch`, і лічильник оновлень зростає лише на 1.

## 📚 Джерела та що почитати

- 🟢 [Preact — Signals](https://preactjs.com/guide/v10/signals/) — API, близький до нашого, з поясненням лінивості
- 🟢 [SolidJS — Signals](https://docs.solidjs.com/concepts/signals) — fine-grained reactivity у фреймворку
- 🟡 [Ryan Carniato — Building a Reactive Library from Scratch](https://dev.to/ryansolid/building-a-reactive-library-from-scratch-1i0p) — автор Solid пише те саме, що й ми
- 🟡 [Vue — Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html) — `track`/`trigger` на Proxy
- 🟡 [Angular — Signals](https://angular.dev/guide/signals) — `signal`, `computed`, `effect`, `untracked`
- 🔴 [TC39 — Signals proposal](https://github.com/tc39/proposal-signals) — алгоритм, розфарбування вузлів, мотивація стандарту

> [!important] Підсумок
> - Автотрекінг = глобальний `activeObserver` + перехоплення читання в геттері.
> - Ефект перевідстежує залежності на кожному запуску — залежності динамічні.
> - `computed` лінивий і кешований: push «брудний» → pull значення при читанні.
> - Батчинг (позначити → виконати) дає один запуск ефекту на хвилю і прибирає глітчі.
> - Ресурси ефектів — через cleanup і `dispose`; DOM — лише ще один об'єкт із властивостями.
