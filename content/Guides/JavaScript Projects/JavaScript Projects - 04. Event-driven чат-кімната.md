---
title: Event-driven чат-кімната
order: 4
level: middle
tags: [events, observer, timers, rate-limiting, classes]
prerequisites:
  - "[[JavaScript - 32. Патерни проєктування]]"
  - "[[JavaScript - 07. Прототипи та класи]]"
  - "[[JavaScript - 08. Event Loop]]"
estimatedMinutes: 110
id: jsp-ch-04
icon: "💬"
---

# JavaScript Projects - 04. Event-driven чат-кімната

> [!success] 🎯 Після цього розділу ти зможеш
> - Написати власний **EventEmitter** з `on`, `once`, `off` і безпечним `emit`.
> - Спроєктувати сховище повідомлень з лімітом і **курсорною пагінацією**.
> - Реалізувати **rate limiting** ковзним вікном і порахувати `retryAfter`.
> - Зробити індикатор «друкує…» на таймерах, який сам гасне, і тестувати його фейковим часом.
> - Скласти з незалежних модулів сервіс чату, що спілкується зі світом лише **подіями**.

## 🎯 Що збудуємо

Ядро чату, як у Slack чи Telegram, — без сервера і без DOM: кімнати, учасники, історія, захист від спаму, «Оля друкує…». Усі модулі не знають один про одного; їх склеює фасад `createChat`, а UI лише підписується на події.

> [!diagram] createChat: шлях одного повідомлення
> ```yaml
> layout: flow
> nodes:
>   - { id: ui, label: "UI", text: "join · typing · send", tone: blue, icon: "px:chat" }
>   - { id: members, label: "members: Map<room, Set<user>>", text: "general: { }", tone: gray }
>   - { id: limiter, label: "createRateLimiter (ковзне вікно)", text: "Оля: 0 / 5 за 10 с", tone: yellow, icon: "px:hourglass" }
>   - { id: store, label: "createMessageStore", text: "порожньо", tone: mint, icon: "px:database" }
>   - { id: emitter, label: "EventEmitter", code: "emit('message', message)", tone: violet, icon: "px:bolt" }
>   - { id: listeners, label: "chat.on('message', …)", text: "UI · звук · непрочитані · логер", tone: green }
> edges:
>   - { from: ui, to: members }
>   - { from: members, to: limiter, label: "учасник?" }
>   - { from: limiter, to: store, label: "ліміт ок" }
>   - { from: store, to: emitter, label: "message" }
>   - { from: emitter, to: listeners, label: "розсилка" }
> steps:
>   - { move: { from: ui, to: members, value: "join('general', 'Оля')" }, set: { members: "general: { Оля }" }, note: "Оля заходить у кімнату. Склад змінився — фасад емітить 'join', і кожен слухач дізнається про нову учасницю." }
>   - { set: { listeners: "«Оля друкує…»" }, focus: [ui, listeners], note: "chat.typing('general', 'Оля'): трекер вмикає «друкує…» і ставить таймер на 3 с. Слухачі події 'typing' показують індикатор." }
>   - { move: { from: ui, to: members, value: "send('general', 'Оля', 'Привіт')" }, note: "Оля надсилає повідомлення. Перша перевірка — чи вона учасниця кімнати. Так; інакше було б { ok: false, error: 'Спершу приєднайся до кімнати' }." }
>   - { move: { from: members, to: limiter, value: "Оля" }, set: { limiter: "Оля: 1 / 5 за 10 с" }, note: "Ковзне вікно: за останні 10 с у Олі менше 5 повідомлень — пропускаємо. Шосте поспіль отримало б 'Забагато повідомлень' і retryAfter." }
>   - { move: { from: limiter, to: store, value: "'Привіт'" }, set: { store: "{ id: 1, user: 'Оля', text: 'Привіт' }" }, note: "Сховище обрізає пробіли, перевіряє довжину й заморожує повідомлення. Автор надіслав текст — typing.stop гасить «друкує…»." }
>   - { move: [{ from: store, to: emitter, value: "message" }, { from: emitter, to: listeners, value: "'Привіт'" }], set: { listeners: "UI · звук · непрочитані · логер ← 'Привіт'" }, line: "emitter:1", note: "emit('message') роздає повідомлення всім слухачам по черзі. Сам емітер не знає, скільки їх і що вони роблять." }
>   - { focus: listeners, note: "Хочеш звук нового повідомлення — додай ще один chat.on('message', …), ядро не змінюється. Це і є слабка зв'язність." }
> ```

Event-driven архітектура = **слабка зв'язність**: той, хто публікує подію, не знає, скільки слухачів її отримає і що вони зроблять. Додати «звук нового повідомлення» — один `chat.on('message', …)`, без правок у ядрі.

## 🧭 План кроків

1. `EventEmitter` — `on` / `once` / `off` / `emit`. Теорія: Observer у [[JavaScript - 32. Патерни проєктування]], класи — [[JavaScript - 07. Прототипи та класи]].
2. `createMessageStore` — валідація, ліміт, курсорна пагінація.
3. `createRateLimiter` — ковзне вікно на `Date.now()`.
4. `createTypingTracker` — «друкує…» на таймерах. Теорія: [[JavaScript - 08. Event Loop]], [[JavaScript - 14. Debounce, throttle та async-патерни]].
5. `formatTyping` — людський текст індикатора.
6. `createChat` — фасад над усім.

## 🧩 Розминка

> [!quiz] Склади безпечний emit
> level: middle · type: order · id: jsp-04-quiz-01
>
> ```js order
> emit(event, ...args) {
>   const list = this.#listeners.get(event)
>   if (!list) return false
>   for (const listener of [...list]) {
>     listener.apply(this, args)
>   }
>   return true
> }
>   for (const listener of list) { // ✗
> ```
>
> **Пояснення:** ітеруємо **копію** масиву. Якщо слухач відпишеться прямо під час `emit` (так робить `once`), `splice` зсуне оригінальний масив і наступний слухач буде пропущений.

> [!quiz] Заповни пропуски в ковзному вікні
> level: middle · type: fill · id: jsp-04-quiz-02 · bank: setInterval, shift, <=
>
> ```js fill
> function tryAcquire(key) {
>   const now = Date.[[now]]()
>   const recent = (hits.get(key) ?? []).[[filter]]((t) => now - t [[<]] interval)
>   if (recent.length >= limit) {
>     hits.set(key, recent)
>     return [[false]]
>   }
>   recent.push(now)
>   hits.set(key, recent)
>   return true
> }
> ```
>
> **Пояснення:** у вікні лишаються лише мітки молодші за `interval`. Строге `<`: мітка рівно `interval` мс тому вже «вийшла» з вікна.

## 🛠️ Крок 1. EventEmitter

Основа всього розділу. Приватне поле `#listeners` ховає внутрішній стан — ніхто ззовні не зламає список слухачів. `on` повертає функцію відписки: найзручніший API для cleanup (так роблять React-хуки, RxJS, Redux).

> [!task] Крок 1 · EventEmitter
> level: middle · difficulty: medium · id: jsp-04-task-01 · tags: observer, classes, events
>
> Напиши `class EventEmitter`:
>
> - `on(event, listener)` — підписка; повертає функцію відписки; `listener` не функція → `TypeError`;
> - `once(event, listener)` — слухач спрацює один раз; теж повертає відписку;
> - `off(event, listener)` — відписка;
> - `emit(event, ...args)` — викликає слухачів у порядку підписки з аргументами і `this` = емітер; повертає `true`, якщо слухачі були, інакше `false`. Відписка під час `emit` не повинна пропускати інших слухачів;
> - `listenerCount(event)`.
>
> ```js starter
> class EventEmitter {
>   // твій код
> }
> ```
>
> ```js tests
> test('on + emit передають аргументи в порядку підписки', () => {
>   const emitter = new EventEmitter()
>   const calls = []
>   emitter.on('msg', (a, b) => calls.push(['first', a, b]))
>   emitter.on('msg', (a) => calls.push(['second', a]))
>   expect(emitter.emit('msg', 1, 2)).toBe(true)
>   expect(calls).toEqual([['first', 1, 2], ['second', 1]])
>   expect(emitter.emit('nobody')).toBe(false)
> })
>
> test('on повертає відписку, off теж працює', () => {
>   const emitter = new EventEmitter()
>   const a = vi.fn()
>   const b = vi.fn()
>   const offA = emitter.on('x', a)
>   emitter.on('x', b)
>   offA()
>   emitter.off('x', b)
>   emitter.emit('x')
>   expect(a).toHaveBeenCalledTimes(0)
>   expect(b).toHaveBeenCalledTimes(0)
>   expect(emitter.listenerCount('x')).toBe(0)
> })
>
> test('once спрацьовує один раз', () => {
>   const emitter = new EventEmitter()
>   const spy = vi.fn()
>   emitter.once('ready', spy)
>   emitter.emit('ready', 'ok')
>   emitter.emit('ready', 'again')
>   expect(spy).toHaveBeenCalledTimes(1)
>   expect(spy).toHaveBeenCalledWith('ok')
> })
>
> test('відписка під час emit не пропускає наступного слухача', () => {
>   const emitter = new EventEmitter()
>   const second = vi.fn()
>   emitter.once('x', () => {})
>   emitter.on('x', second)
>   emitter.emit('x')
>   expect(second).toHaveBeenCalledTimes(1)
> })
>
> test('this у слухачі — емітер; не функція — TypeError', () => {
>   const emitter = new EventEmitter()
>   let seen = null
>   emitter.on('x', function () { seen = this })
>   emitter.emit('x')
>   expect(seen).toBe(emitter)
>   expect(() => emitter.on('x', 'nope')).toThrow(TypeError)
> })
> ```
>
> > [!hint]- Підказка 1
> > `#listeners = new Map()` — подія → масив слухачів. `on` повертає `() => this.off(event, listener)` (стрілка — щоб `this` був емітером).
>
> > [!hint]- Підказка 2
> > `once` — це `on` з обгорткою, яка спершу відписується, потім викликає оригінал: `const off = this.on(event, (...args) => { off(); listener.apply(this, args) })`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class EventEmitter {
> >   #listeners = new Map()
> >
> >   on(event, listener) {
> >     if (typeof listener !== 'function') throw new TypeError('listener має бути функцією')
> >     if (!this.#listeners.has(event)) this.#listeners.set(event, [])
> >     this.#listeners.get(event).push(listener)
> >     return () => this.off(event, listener)
> >   }
> >
> >   once(event, listener) {
> >     const off = this.on(event, (...args) => {
> >       off()
> >       listener.apply(this, args)
> >     })
> >     return off
> >   }
> >
> >   off(event, listener) {
> >     const list = this.#listeners.get(event)
> >     if (!list) return
> >     const index = list.indexOf(listener)
> >     if (index !== -1) list.splice(index, 1)
> >     if (list.length === 0) this.#listeners.delete(event)
> >   }
> >
> >   emit(event, ...args) {
> >     const list = this.#listeners.get(event)
> >     if (!list) return false
> >     for (const listener of [...list]) listener.apply(this, args)
> >     return true
> >   }
> >
> >   listenerCount(event) {
> >     return this.#listeners.get(event)?.length ?? 0
> >   }
> > }
> > ```
> > **Чому так:** масив, а не `Set`, — бо той самий слухач може бути підписаний двічі (як у Node). Копія `[...list]` в `emit` — захист від мутації під час ітерації. Порожні списки видаляємо, щоб `Map` не росла від одноразових подій. `once` відписується **до** виклику — навіть якщо слухач кине помилку чи знову викличе `emit`, другого спрацювання не буде. Обмеження: `off(event, original)` не прибере `once`-слухача — Node зберігає для цього `wrapper.listener`.

## 🛠️ Крок 2. Сховище повідомлень

Повідомлення — **незмінні** (`Object.freeze`): після відправки їх ніхто не редагує випадково. Історія кімнати обмежена — інакше пам'ять росте безмежно. Пагінація — **курсорна**: «дай 20 повідомлень старших за id 340». На відміну від `offset`, курсор не «з'їжджає», коли приходять нові повідомлення.

> [!task] Крок 2 · createMessageStore
> level: middle · difficulty: medium · id: jsp-04-task-02 · tags: pagination, validation, immutability
>
> Додай `createMessageStore({ limit = 100, maxLength = 500 } = {})`:
>
> - `add({ room, user, text })` — текст з `trim`; порожній → `Error('Порожнє повідомлення')`; довший за `maxLength` → `Error('Повідомлення довше за <maxLength> символів')`. Створює **заморожене** повідомлення `{ id, room, user, text, ts }` (`id` — наскрізний лічильник від 1, `ts` — `Date.now()`) і повертає його. У кімнаті лишаються лише останні `limit` повідомлень;
> - `list(room, { before = Infinity, limit = 20 } = {})` — останні `limit` повідомлень кімнати з `id < before`, від старших до новіших.
>
> ```js starter
> class EventEmitter {
>   #listeners = new Map()
>
>   on(event, listener) {
>     if (typeof listener !== 'function') throw new TypeError('listener має бути функцією')
>     if (!this.#listeners.has(event)) this.#listeners.set(event, [])
>     this.#listeners.get(event).push(listener)
>     return () => this.off(event, listener)
>   }
>
>   once(event, listener) {
>     const off = this.on(event, (...args) => {
>       off()
>       listener.apply(this, args)
>     })
>     return off
>   }
>
>   off(event, listener) {
>     const list = this.#listeners.get(event)
>     if (!list) return
>     const index = list.indexOf(listener)
>     if (index !== -1) list.splice(index, 1)
>     if (list.length === 0) this.#listeners.delete(event)
>   }
>
>   emit(event, ...args) {
>     const list = this.#listeners.get(event)
>     if (!list) return false
>     for (const listener of [...list]) listener.apply(this, args)
>     return true
>   }
>
>   listenerCount(event) {
>     return this.#listeners.get(event)?.length ?? 0
>   }
> }
>
> function createMessageStore({ limit = 100, maxLength = 500 } = {}) {
>   // твій код
> }
> ```
>
> ```js tests
> test('add створює заморожене повідомлення з id і часом', () => {
>   vi.useFakeTimers()
>   vi.setSystemTime(1000)
>   const store = createMessageStore()
>   const message = store.add({ room: 'general', user: 'Оля', text: '  Привіт!  ' })
>   expect(message).toEqual({ id: 1, room: 'general', user: 'Оля', text: 'Привіт!', ts: 1000 })
>   expect(Object.isFrozen(message)).toBe(true)
>   expect(store.add({ room: 'random', user: 'Петро', text: 'Йо' }).id).toBe(2)
> })
>
> test('валідація тексту', () => {
>   const store = createMessageStore({ maxLength: 5 })
>   expect(() => store.add({ room: 'r', user: 'u', text: '   ' })).toThrow('Порожнє повідомлення')
>   expect(() => store.add({ room: 'r', user: 'u', text: '123456' })).toThrow('довше за 5 символів')
>   expect(store.list('r')).toEqual([])
> })
>
> test('кімнати ізольовані', () => {
>   const store = createMessageStore()
>   store.add({ room: 'a', user: 'u', text: '1' })
>   store.add({ room: 'b', user: 'u', text: '2' })
>   expect(store.list('a').map((m) => m.text)).toEqual(['1'])
>   expect(store.list('nope')).toEqual([])
> })
>
> test('ліміт історії відкидає найстаріші', () => {
>   const store = createMessageStore({ limit: 3 })
>   for (let i = 1; i <= 5; i++) store.add({ room: 'r', user: 'u', text: String(i) })
>   expect(store.list('r').map((m) => m.text)).toEqual(['3', '4', '5'])
> })
>
> test('курсорна пагінація', () => {
>   const store = createMessageStore()
>   for (let i = 1; i <= 10; i++) store.add({ room: 'r', user: 'u', text: `m${i}` })
>   const page1 = store.list('r', { limit: 3 })
>   expect(page1.map((m) => m.id)).toEqual([8, 9, 10])
>   const page2 = store.list('r', { before: page1[0].id, limit: 3 })
>   expect(page2.map((m) => m.id)).toEqual([5, 6, 7])
>   expect(store.list('r', { before: 3, limit: 5 }).map((m) => m.id)).toEqual([1, 2])
> })
> ```
>
> > [!hint]- Підказка 1
> > `rooms = new Map()` (кімната → масив) і лічильник `seq` у замиканні. Ліміт: після `push` — `if (list.length > limit) list.splice(0, list.length - limit)`.
>
> > [!hint]- Підказка 2
> > `list`: `messages.filter((m) => m.id < before).slice(-count)` — `slice` з від'ємним аргументом бере останні.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class EventEmitter {
> >   #listeners = new Map()
> >
> >   on(event, listener) {
> >     if (typeof listener !== 'function') throw new TypeError('listener має бути функцією')
> >     if (!this.#listeners.has(event)) this.#listeners.set(event, [])
> >     this.#listeners.get(event).push(listener)
> >     return () => this.off(event, listener)
> >   }
> >
> >   once(event, listener) {
> >     const off = this.on(event, (...args) => {
> >       off()
> >       listener.apply(this, args)
> >     })
> >     return off
> >   }
> >
> >   off(event, listener) {
> >     const list = this.#listeners.get(event)
> >     if (!list) return
> >     const index = list.indexOf(listener)
> >     if (index !== -1) list.splice(index, 1)
> >     if (list.length === 0) this.#listeners.delete(event)
> >   }
> >
> >   emit(event, ...args) {
> >     const list = this.#listeners.get(event)
> >     if (!list) return false
> >     for (const listener of [...list]) listener.apply(this, args)
> >     return true
> >   }
> >
> >   listenerCount(event) {
> >     return this.#listeners.get(event)?.length ?? 0
> >   }
> > }
> >
> > function createMessageStore({ limit = 100, maxLength = 500 } = {}) {
> >   const rooms = new Map()
> >   let seq = 0
> >   return {
> >     add({ room, user, text }) {
> >       const body = String(text ?? '').trim()
> >       if (body === '') throw new Error('Порожнє повідомлення')
> >       if (body.length > maxLength) throw new Error(`Повідомлення довше за ${maxLength} символів`)
> >       const message = Object.freeze({ id: ++seq, room, user, text: body, ts: Date.now() })
> >       if (!rooms.has(room)) rooms.set(room, [])
> >       const list = rooms.get(room)
> >       list.push(message)
> >       if (list.length > limit) list.splice(0, list.length - limit)
> >       return message
> >     },
> >     list(room, { before = Infinity, limit: count = 20 } = {}) {
> >       const list = rooms.get(room) ?? []
> >       return list.filter((message) => message.id < before).slice(-count)
> >     },
> >   }
> > }
> > ```
> > **Чому так:** наскрізний зростаючий `id` — природний курсор: «старші за X» стабільне, навіть якщо за секунду прийшло 50 нових повідомлень (з `offset` сторінки б з'їхали і дублювались). `Object.freeze` робить повідомлення безпечними для передачі будь-якому слухачу: ніхто не змінить історію «під ногами» в інших. Ліміт — захист пам'яті; старі повідомлення в реальному чаті живуть у БД, а в пам'яті — лише «гаряче вікно».

## 🛠️ Крок 3. Rate limiting

Захист від флуду: не більше `limit` повідомлень за `interval` мс на користувача. **Ковзне вікно** зберігає мітки часу останніх спроб і рахує, скільки з них молодші за `interval`. На відміну від фіксованого вікна («5 за календарну хвилину»), воно не дозволяє 10 повідомлень на стику двох хвилин.

> [!task] Крок 3 · createRateLimiter
> level: middle · difficulty: medium · id: jsp-04-task-03 · tags: rate-limiting, time, map
>
> Додай `createRateLimiter({ limit, interval })`:
>
> - `tryAcquire(key)` — якщо за останні `interval` мс (мітки з `Date.now() - t < interval`) для `key` було менше `limit` дозволених спроб — запам'ятовує мітку і повертає `true`; інакше `false` (відмова **не** записується);
> - `retryAfter(key)` — через скільки мс звільниться місце (`0`, якщо вже є місце);
> - ключі незалежні; ключі без активних міток не повинні накопичуватись у пам'яті.
>
> ```js starter
> class EventEmitter {
>   #listeners = new Map()
>
>   on(event, listener) {
>     if (typeof listener !== 'function') throw new TypeError('listener має бути функцією')
>     if (!this.#listeners.has(event)) this.#listeners.set(event, [])
>     this.#listeners.get(event).push(listener)
>     return () => this.off(event, listener)
>   }
>
>   once(event, listener) {
>     const off = this.on(event, (...args) => {
>       off()
>       listener.apply(this, args)
>     })
>     return off
>   }
>
>   off(event, listener) {
>     const list = this.#listeners.get(event)
>     if (!list) return
>     const index = list.indexOf(listener)
>     if (index !== -1) list.splice(index, 1)
>     if (list.length === 0) this.#listeners.delete(event)
>   }
>
>   emit(event, ...args) {
>     const list = this.#listeners.get(event)
>     if (!list) return false
>     for (const listener of [...list]) listener.apply(this, args)
>     return true
>   }
>
>   listenerCount(event) {
>     return this.#listeners.get(event)?.length ?? 0
>   }
> }
>
> function createMessageStore({ limit = 100, maxLength = 500 } = {}) {
>   const rooms = new Map()
>   let seq = 0
>   return {
>     add({ room, user, text }) {
>       const body = String(text ?? '').trim()
>       if (body === '') throw new Error('Порожнє повідомлення')
>       if (body.length > maxLength) throw new Error(`Повідомлення довше за ${maxLength} символів`)
>       const message = Object.freeze({ id: ++seq, room, user, text: body, ts: Date.now() })
>       if (!rooms.has(room)) rooms.set(room, [])
>       const list = rooms.get(room)
>       list.push(message)
>       if (list.length > limit) list.splice(0, list.length - limit)
>       return message
>     },
>     list(room, { before = Infinity, limit: count = 20 } = {}) {
>       const list = rooms.get(room) ?? []
>       return list.filter((message) => message.id < before).slice(-count)
>     },
>   }
> }
>
> function createRateLimiter({ limit, interval }) {
>   // твій код
> }
> ```
>
> ```js tests
> test('пропускає limit спроб і блокує наступну', () => {
>   vi.useFakeTimers()
>   const limiter = createRateLimiter({ limit: 3, interval: 1000 })
>   expect([limiter.tryAcquire('оля'), limiter.tryAcquire('оля'), limiter.tryAcquire('оля')]).toEqual([true, true, true])
>   expect(limiter.tryAcquire('оля')).toBe(false)
> })
>
> test('вікно ковзає: звільняється найстаріша мітка', () => {
>   vi.useFakeTimers()
>   const limiter = createRateLimiter({ limit: 2, interval: 1000 })
>   limiter.tryAcquire('u')
>   vi.advanceTimersByTime(500)
>   limiter.tryAcquire('u')
>   expect(limiter.tryAcquire('u')).toBe(false)
>   vi.advanceTimersByTime(500)
>   expect(limiter.tryAcquire('u')).toBe(true)
>   expect(limiter.tryAcquire('u')).toBe(false)
> })
>
> test('retryAfter', () => {
>   vi.useFakeTimers()
>   const limiter = createRateLimiter({ limit: 2, interval: 1000 })
>   expect(limiter.retryAfter('u')).toBe(0)
>   limiter.tryAcquire('u')
>   vi.advanceTimersByTime(300)
>   limiter.tryAcquire('u')
>   expect(limiter.retryAfter('u')).toBe(700)
>   vi.advanceTimersByTime(700)
>   expect(limiter.retryAfter('u')).toBe(0)
> })
>
> test('ключі незалежні', () => {
>   vi.useFakeTimers()
>   const limiter = createRateLimiter({ limit: 1, interval: 1000 })
>   expect(limiter.tryAcquire('a')).toBe(true)
>   expect(limiter.tryAcquire('b')).toBe(true)
>   expect(limiter.tryAcquire('a')).toBe(false)
> })
>
> test('відмови не продовжують блокування', () => {
>   vi.useFakeTimers()
>   const limiter = createRateLimiter({ limit: 1, interval: 1000 })
>   limiter.tryAcquire('u')
>   for (let i = 0; i < 9; i++) {
>     vi.advanceTimersByTime(100)
>     limiter.tryAcquire('u')
>   }
>   vi.advanceTimersByTime(100)
>   expect(limiter.tryAcquire('u')).toBe(true)
> })
> ```
>
> > [!hint]- Підказка 1
> > `Map` ключ → масив міток. Допоміжна `recent(key)` фільтрує мітки за `Date.now() - t < interval`, оновлює `Map` (або видаляє ключ, якщо порожньо) і повертає масив.
>
> > [!hint]- Підказка 2
> > `retryAfter`: якщо `recent.length < limit` → `0`, інакше `recent[0] + interval - Date.now()` — коли «випаде» найстаріша мітка.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class EventEmitter {
> >   #listeners = new Map()
> >
> >   on(event, listener) {
> >     if (typeof listener !== 'function') throw new TypeError('listener має бути функцією')
> >     if (!this.#listeners.has(event)) this.#listeners.set(event, [])
> >     this.#listeners.get(event).push(listener)
> >     return () => this.off(event, listener)
> >   }
> >
> >   once(event, listener) {
> >     const off = this.on(event, (...args) => {
> >       off()
> >       listener.apply(this, args)
> >     })
> >     return off
> >   }
> >
> >   off(event, listener) {
> >     const list = this.#listeners.get(event)
> >     if (!list) return
> >     const index = list.indexOf(listener)
> >     if (index !== -1) list.splice(index, 1)
> >     if (list.length === 0) this.#listeners.delete(event)
> >   }
> >
> >   emit(event, ...args) {
> >     const list = this.#listeners.get(event)
> >     if (!list) return false
> >     for (const listener of [...list]) listener.apply(this, args)
> >     return true
> >   }
> >
> >   listenerCount(event) {
> >     return this.#listeners.get(event)?.length ?? 0
> >   }
> > }
> >
> > function createMessageStore({ limit = 100, maxLength = 500 } = {}) {
> >   const rooms = new Map()
> >   let seq = 0
> >   return {
> >     add({ room, user, text }) {
> >       const body = String(text ?? '').trim()
> >       if (body === '') throw new Error('Порожнє повідомлення')
> >       if (body.length > maxLength) throw new Error(`Повідомлення довше за ${maxLength} символів`)
> >       const message = Object.freeze({ id: ++seq, room, user, text: body, ts: Date.now() })
> >       if (!rooms.has(room)) rooms.set(room, [])
> >       const list = rooms.get(room)
> >       list.push(message)
> >       if (list.length > limit) list.splice(0, list.length - limit)
> >       return message
> >     },
> >     list(room, { before = Infinity, limit: count = 20 } = {}) {
> >       const list = rooms.get(room) ?? []
> >       return list.filter((message) => message.id < before).slice(-count)
> >     },
> >   }
> > }
> >
> > function createRateLimiter({ limit, interval }) {
> >   const hits = new Map()
> >
> >   function recent(key) {
> >     const now = Date.now()
> >     const list = (hits.get(key) ?? []).filter((time) => now - time < interval)
> >     if (list.length === 0) hits.delete(key)
> >     else hits.set(key, list)
> >     return list
> >   }
> >
> >   return {
> >     tryAcquire(key) {
> >       const list = recent(key)
> >       if (list.length >= limit) return false
> >       list.push(Date.now())
> >       hits.set(key, list)
> >       return true
> >     },
> >     retryAfter(key) {
> >       const list = recent(key)
> >       return list.length < limit ? 0 : list[0] + interval - Date.now()
> >     },
> >   }
> > }
> > ```
> > **Чому так:** ковзне вікно з мітками точне і просте; пам'ять — O(limit) на ключ, а порожні ключі видаляються. Відмови не записуються — інакше спамер, що тисне кнопку, блокував би себе вічно (хоча на сервері іноді саме так і карають). Альтернатива — **token bucket**: O(1) пам'яті (кількість токенів + час), дозволяє контрольовані сплески. `retryAfter` — те, що сервер повертає в заголовку `Retry-After` разом зі статусом `429`.

## 🛠️ Крок 4. «Друкує…» на таймерах

Індикатор набору — **ефемерний** стан: клієнт шле «я друкую» на кожне натискання, але «я перестав» може не надіслати ніколи (закрив вкладку, зник інтернет). Тому кожен сигнал запускає таймер, і без нового сигналу користувач сам зникає зі списку через `timeout`.

> [!task] Крок 4 · createTypingTracker
> level: middle · difficulty: hard · id: jsp-04-task-04 · tags: timers, state, cleanup
>
> Додай `createTypingTracker({ timeout = 3000, onChange = () => {} } = {})`:
>
> - `typing(room, user)` — користувач друкує: (пере)запускає його таймер на `timeout` мс; якщо його ще не було у списку — `onChange(room, users)`;
> - коли таймер спливає — користувач зникає, `onChange(room, users)`;
> - `stop(room, user)` — прибрати одразу (з `onChange`), очистивши таймер; якщо не друкував — нічого;
> - `list(room)` — масив користувачів у порядку, в якому вони почали друкувати;
> - `dispose()` — прибирає всі таймери.
>
> ```js starter
> class EventEmitter {
>   #listeners = new Map()
>
>   on(event, listener) {
>     if (typeof listener !== 'function') throw new TypeError('listener має бути функцією')
>     if (!this.#listeners.has(event)) this.#listeners.set(event, [])
>     this.#listeners.get(event).push(listener)
>     return () => this.off(event, listener)
>   }
>
>   once(event, listener) {
>     const off = this.on(event, (...args) => {
>       off()
>       listener.apply(this, args)
>     })
>     return off
>   }
>
>   off(event, listener) {
>     const list = this.#listeners.get(event)
>     if (!list) return
>     const index = list.indexOf(listener)
>     if (index !== -1) list.splice(index, 1)
>     if (list.length === 0) this.#listeners.delete(event)
>   }
>
>   emit(event, ...args) {
>     const list = this.#listeners.get(event)
>     if (!list) return false
>     for (const listener of [...list]) listener.apply(this, args)
>     return true
>   }
>
>   listenerCount(event) {
>     return this.#listeners.get(event)?.length ?? 0
>   }
> }
>
> function createMessageStore({ limit = 100, maxLength = 500 } = {}) {
>   const rooms = new Map()
>   let seq = 0
>   return {
>     add({ room, user, text }) {
>       const body = String(text ?? '').trim()
>       if (body === '') throw new Error('Порожнє повідомлення')
>       if (body.length > maxLength) throw new Error(`Повідомлення довше за ${maxLength} символів`)
>       const message = Object.freeze({ id: ++seq, room, user, text: body, ts: Date.now() })
>       if (!rooms.has(room)) rooms.set(room, [])
>       const list = rooms.get(room)
>       list.push(message)
>       if (list.length > limit) list.splice(0, list.length - limit)
>       return message
>     },
>     list(room, { before = Infinity, limit: count = 20 } = {}) {
>       const list = rooms.get(room) ?? []
>       return list.filter((message) => message.id < before).slice(-count)
>     },
>   }
> }
>
> function createRateLimiter({ limit, interval }) {
>   const hits = new Map()
>
>   function recent(key) {
>     const now = Date.now()
>     const list = (hits.get(key) ?? []).filter((time) => now - time < interval)
>     if (list.length === 0) hits.delete(key)
>     else hits.set(key, list)
>     return list
>   }
>
>   return {
>     tryAcquire(key) {
>       const list = recent(key)
>       if (list.length >= limit) return false
>       list.push(Date.now())
>       hits.set(key, list)
>       return true
>     },
>     retryAfter(key) {
>       const list = recent(key)
>       return list.length < limit ? 0 : list[0] + interval - Date.now()
>     },
>   }
> }
>
> function createTypingTracker({ timeout = 3000, onChange = () => {} } = {}) {
>   // твій код
> }
> ```
>
> ```js tests
> test('typing додає користувача і повідомляє один раз', () => {
>   vi.useFakeTimers()
>   const onChange = vi.fn()
>   const tracker = createTypingTracker({ timeout: 1000, onChange })
>   tracker.typing('r', 'Оля')
>   tracker.typing('r', 'Оля')
>   tracker.typing('r', 'Петро')
>   expect(tracker.list('r')).toEqual(['Оля', 'Петро'])
>   expect(onChange).toHaveBeenCalledTimes(2)
>   expect(onChange).toHaveBeenCalledWith('r', ['Оля', 'Петро'])
> })
>
> test('сам гасне після timeout', () => {
>   vi.useFakeTimers()
>   const onChange = vi.fn()
>   const tracker = createTypingTracker({ timeout: 1000, onChange })
>   tracker.typing('r', 'Оля')
>   vi.advanceTimersByTime(1000)
>   expect(tracker.list('r')).toEqual([])
>   expect(onChange.mock.calls.at(-1)).toEqual(['r', []])
> })
>
> test('новий сигнал продовжує таймер', () => {
>   vi.useFakeTimers()
>   const tracker = createTypingTracker({ timeout: 1000 })
>   tracker.typing('r', 'Оля')
>   vi.advanceTimersByTime(800)
>   tracker.typing('r', 'Оля')
>   vi.advanceTimersByTime(800)
>   expect(tracker.list('r')).toEqual(['Оля'])
>   vi.advanceTimersByTime(200)
>   expect(tracker.list('r')).toEqual([])
> })
>
> test('stop прибирає одразу і чистить таймер', () => {
>   vi.useFakeTimers()
>   const onChange = vi.fn()
>   const tracker = createTypingTracker({ timeout: 1000, onChange })
>   tracker.typing('r', 'Оля')
>   tracker.stop('r', 'Оля')
>   tracker.stop('r', 'Оля')
>   expect(tracker.list('r')).toEqual([])
>   expect(vi.getTimerCount()).toBe(0)
>   expect(onChange).toHaveBeenCalledTimes(2)
> })
>
> test('кімнати незалежні, dispose чистить усе', () => {
>   vi.useFakeTimers()
>   const tracker = createTypingTracker({ timeout: 1000 })
>   tracker.typing('a', 'Оля')
>   tracker.typing('b', 'Петро')
>   expect(tracker.list('a')).toEqual(['Оля'])
>   expect(tracker.list('b')).toEqual(['Петро'])
>   tracker.dispose()
>   expect(vi.getTimerCount()).toBe(0)
>   expect(tracker.list('a')).toEqual([])
> })
> ```
>
> > [!hint]- Підказка 1
> > `rooms = new Map()` (кімната → `Map` користувач → id таймера). Внутрішня `Map` пам'ятає порядок вставки — це і є «хто почав першим».
>
> > [!hint]- Підказка 2
> > `typing`: `const isNew = !users.has(user); clearTimeout(users.get(user)); users.set(user, setTimeout(() => stop(room, user), timeout)); if (isNew) onChange(room, list(room))`. Перезапис наявного ключа в `Map` не змінює його позицію.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class EventEmitter {
> >   #listeners = new Map()
> >
> >   on(event, listener) {
> >     if (typeof listener !== 'function') throw new TypeError('listener має бути функцією')
> >     if (!this.#listeners.has(event)) this.#listeners.set(event, [])
> >     this.#listeners.get(event).push(listener)
> >     return () => this.off(event, listener)
> >   }
> >
> >   once(event, listener) {
> >     const off = this.on(event, (...args) => {
> >       off()
> >       listener.apply(this, args)
> >     })
> >     return off
> >   }
> >
> >   off(event, listener) {
> >     const list = this.#listeners.get(event)
> >     if (!list) return
> >     const index = list.indexOf(listener)
> >     if (index !== -1) list.splice(index, 1)
> >     if (list.length === 0) this.#listeners.delete(event)
> >   }
> >
> >   emit(event, ...args) {
> >     const list = this.#listeners.get(event)
> >     if (!list) return false
> >     for (const listener of [...list]) listener.apply(this, args)
> >     return true
> >   }
> >
> >   listenerCount(event) {
> >     return this.#listeners.get(event)?.length ?? 0
> >   }
> > }
> >
> > function createMessageStore({ limit = 100, maxLength = 500 } = {}) {
> >   const rooms = new Map()
> >   let seq = 0
> >   return {
> >     add({ room, user, text }) {
> >       const body = String(text ?? '').trim()
> >       if (body === '') throw new Error('Порожнє повідомлення')
> >       if (body.length > maxLength) throw new Error(`Повідомлення довше за ${maxLength} символів`)
> >       const message = Object.freeze({ id: ++seq, room, user, text: body, ts: Date.now() })
> >       if (!rooms.has(room)) rooms.set(room, [])
> >       const list = rooms.get(room)
> >       list.push(message)
> >       if (list.length > limit) list.splice(0, list.length - limit)
> >       return message
> >     },
> >     list(room, { before = Infinity, limit: count = 20 } = {}) {
> >       const list = rooms.get(room) ?? []
> >       return list.filter((message) => message.id < before).slice(-count)
> >     },
> >   }
> > }
> >
> > function createRateLimiter({ limit, interval }) {
> >   const hits = new Map()
> >
> >   function recent(key) {
> >     const now = Date.now()
> >     const list = (hits.get(key) ?? []).filter((time) => now - time < interval)
> >     if (list.length === 0) hits.delete(key)
> >     else hits.set(key, list)
> >     return list
> >   }
> >
> >   return {
> >     tryAcquire(key) {
> >       const list = recent(key)
> >       if (list.length >= limit) return false
> >       list.push(Date.now())
> >       hits.set(key, list)
> >       return true
> >     },
> >     retryAfter(key) {
> >       const list = recent(key)
> >       return list.length < limit ? 0 : list[0] + interval - Date.now()
> >     },
> >   }
> > }
> >
> > function createTypingTracker({ timeout = 3000, onChange = () => {} } = {}) {
> >   const rooms = new Map()
> >
> >   function list(room) {
> >     return [...(rooms.get(room)?.keys() ?? [])]
> >   }
> >
> >   function stop(room, user) {
> >     const users = rooms.get(room)
> >     if (!users?.has(user)) return
> >     clearTimeout(users.get(user))
> >     users.delete(user)
> >     if (users.size === 0) rooms.delete(room)
> >     onChange(room, list(room))
> >   }
> >
> >   function typing(room, user) {
> >     if (!rooms.has(room)) rooms.set(room, new Map())
> >     const users = rooms.get(room)
> >     const isNew = !users.has(user)
> >     clearTimeout(users.get(user))
> >     users.set(user, setTimeout(() => stop(room, user), timeout))
> >     if (isNew) onChange(room, list(room))
> >   }
> >
> >   function dispose() {
> >     for (const users of rooms.values()) for (const timer of users.values()) clearTimeout(timer)
> >     rooms.clear()
> >   }
> >
> >   return { typing, stop, list, dispose }
> > }
> > ```
> > **Чому так:** таймер на користувача — по суті `debounce` для кожної пари кімната+користувач: сигнали продовжують життя, тиша його завершує. `onChange` лише при **зміні складу** — UI не перемальовується на кожне натискання клавіші. Порожні кімнати видаляються, а `dispose` чистить таймери: забутий таймер тримає замикання з кімнатою в пам'яті і стріляє після «смерті» компонента.

## 🛠️ Крок 5. Людський текст індикатора

Маленький, але показовий крок: форматування — окрема чиста функція. Її легко тестувати, локалізувати і перевикористати в мобільному клієнті.

> [!task] Крок 5 · formatTyping
> level: junior · difficulty: easy · id: jsp-04-task-05 · tags: strings, formatting
>
> Додай `formatTyping(users, me = null)` — текст індикатора без поточного користувача `me`:
>
> - нікого → `''`;
> - один → `'Оля друкує…'`;
> - двоє → `'Оля і Петро друкують…'`;
> - троє і більше → `'Оля, Петро та ще 2 друкують…'` (перші двоє + кількість решти).
>
> Використовуй символ трикрапки `…`, а не три крапки.
>
> ```js starter
> class EventEmitter {
>   #listeners = new Map()
>
>   on(event, listener) {
>     if (typeof listener !== 'function') throw new TypeError('listener має бути функцією')
>     if (!this.#listeners.has(event)) this.#listeners.set(event, [])
>     this.#listeners.get(event).push(listener)
>     return () => this.off(event, listener)
>   }
>
>   once(event, listener) {
>     const off = this.on(event, (...args) => {
>       off()
>       listener.apply(this, args)
>     })
>     return off
>   }
>
>   off(event, listener) {
>     const list = this.#listeners.get(event)
>     if (!list) return
>     const index = list.indexOf(listener)
>     if (index !== -1) list.splice(index, 1)
>     if (list.length === 0) this.#listeners.delete(event)
>   }
>
>   emit(event, ...args) {
>     const list = this.#listeners.get(event)
>     if (!list) return false
>     for (const listener of [...list]) listener.apply(this, args)
>     return true
>   }
>
>   listenerCount(event) {
>     return this.#listeners.get(event)?.length ?? 0
>   }
> }
>
> function createMessageStore({ limit = 100, maxLength = 500 } = {}) {
>   const rooms = new Map()
>   let seq = 0
>   return {
>     add({ room, user, text }) {
>       const body = String(text ?? '').trim()
>       if (body === '') throw new Error('Порожнє повідомлення')
>       if (body.length > maxLength) throw new Error(`Повідомлення довше за ${maxLength} символів`)
>       const message = Object.freeze({ id: ++seq, room, user, text: body, ts: Date.now() })
>       if (!rooms.has(room)) rooms.set(room, [])
>       const list = rooms.get(room)
>       list.push(message)
>       if (list.length > limit) list.splice(0, list.length - limit)
>       return message
>     },
>     list(room, { before = Infinity, limit: count = 20 } = {}) {
>       const list = rooms.get(room) ?? []
>       return list.filter((message) => message.id < before).slice(-count)
>     },
>   }
> }
>
> function createRateLimiter({ limit, interval }) {
>   const hits = new Map()
>
>   function recent(key) {
>     const now = Date.now()
>     const list = (hits.get(key) ?? []).filter((time) => now - time < interval)
>     if (list.length === 0) hits.delete(key)
>     else hits.set(key, list)
>     return list
>   }
>
>   return {
>     tryAcquire(key) {
>       const list = recent(key)
>       if (list.length >= limit) return false
>       list.push(Date.now())
>       hits.set(key, list)
>       return true
>     },
>     retryAfter(key) {
>       const list = recent(key)
>       return list.length < limit ? 0 : list[0] + interval - Date.now()
>     },
>   }
> }
>
> function createTypingTracker({ timeout = 3000, onChange = () => {} } = {}) {
>   const rooms = new Map()
>
>   function list(room) {
>     return [...(rooms.get(room)?.keys() ?? [])]
>   }
>
>   function stop(room, user) {
>     const users = rooms.get(room)
>     if (!users?.has(user)) return
>     clearTimeout(users.get(user))
>     users.delete(user)
>     if (users.size === 0) rooms.delete(room)
>     onChange(room, list(room))
>   }
>
>   function typing(room, user) {
>     if (!rooms.has(room)) rooms.set(room, new Map())
>     const users = rooms.get(room)
>     const isNew = !users.has(user)
>     clearTimeout(users.get(user))
>     users.set(user, setTimeout(() => stop(room, user), timeout))
>     if (isNew) onChange(room, list(room))
>   }
>
>   function dispose() {
>     for (const users of rooms.values()) for (const timer of users.values()) clearTimeout(timer)
>     rooms.clear()
>   }
>
>   return { typing, stop, list, dispose }
> }
>
> function formatTyping(users, me = null) {
>   // твій код
> }
> ```
>
> ```js tests
> test('нікого', () => {
>   expect(formatTyping([])).toBe('')
>   expect(formatTyping(['Я'], 'Я')).toBe('')
> })
>
> test('один', () => {
>   expect(formatTyping(['Оля'])).toBe('Оля друкує…')
> })
>
> test('двоє', () => {
>   expect(formatTyping(['Оля', 'Петро'])).toBe('Оля і Петро друкують…')
> })
>
> test('багато', () => {
>   expect(formatTyping(['Оля', 'Петро', 'Ія', 'Марко'])).toBe('Оля, Петро та ще 2 друкують…')
> })
>
> test('себе не показуємо', () => {
>   expect(formatTyping(['Оля', 'Я', 'Петро'], 'Я')).toBe('Оля і Петро друкують…')
> })
> ```
>
> > [!hint]- Підказка 1
> > Спершу `const others = users.filter((u) => u !== me)`, далі — кілька `if` за `others.length`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class EventEmitter {
> >   #listeners = new Map()
> >
> >   on(event, listener) {
> >     if (typeof listener !== 'function') throw new TypeError('listener має бути функцією')
> >     if (!this.#listeners.has(event)) this.#listeners.set(event, [])
> >     this.#listeners.get(event).push(listener)
> >     return () => this.off(event, listener)
> >   }
> >
> >   once(event, listener) {
> >     const off = this.on(event, (...args) => {
> >       off()
> >       listener.apply(this, args)
> >     })
> >     return off
> >   }
> >
> >   off(event, listener) {
> >     const list = this.#listeners.get(event)
> >     if (!list) return
> >     const index = list.indexOf(listener)
> >     if (index !== -1) list.splice(index, 1)
> >     if (list.length === 0) this.#listeners.delete(event)
> >   }
> >
> >   emit(event, ...args) {
> >     const list = this.#listeners.get(event)
> >     if (!list) return false
> >     for (const listener of [...list]) listener.apply(this, args)
> >     return true
> >   }
> >
> >   listenerCount(event) {
> >     return this.#listeners.get(event)?.length ?? 0
> >   }
> > }
> >
> > function createMessageStore({ limit = 100, maxLength = 500 } = {}) {
> >   const rooms = new Map()
> >   let seq = 0
> >   return {
> >     add({ room, user, text }) {
> >       const body = String(text ?? '').trim()
> >       if (body === '') throw new Error('Порожнє повідомлення')
> >       if (body.length > maxLength) throw new Error(`Повідомлення довше за ${maxLength} символів`)
> >       const message = Object.freeze({ id: ++seq, room, user, text: body, ts: Date.now() })
> >       if (!rooms.has(room)) rooms.set(room, [])
> >       const list = rooms.get(room)
> >       list.push(message)
> >       if (list.length > limit) list.splice(0, list.length - limit)
> >       return message
> >     },
> >     list(room, { before = Infinity, limit: count = 20 } = {}) {
> >       const list = rooms.get(room) ?? []
> >       return list.filter((message) => message.id < before).slice(-count)
> >     },
> >   }
> > }
> >
> > function createRateLimiter({ limit, interval }) {
> >   const hits = new Map()
> >
> >   function recent(key) {
> >     const now = Date.now()
> >     const list = (hits.get(key) ?? []).filter((time) => now - time < interval)
> >     if (list.length === 0) hits.delete(key)
> >     else hits.set(key, list)
> >     return list
> >   }
> >
> >   return {
> >     tryAcquire(key) {
> >       const list = recent(key)
> >       if (list.length >= limit) return false
> >       list.push(Date.now())
> >       hits.set(key, list)
> >       return true
> >     },
> >     retryAfter(key) {
> >       const list = recent(key)
> >       return list.length < limit ? 0 : list[0] + interval - Date.now()
> >     },
> >   }
> > }
> >
> > function createTypingTracker({ timeout = 3000, onChange = () => {} } = {}) {
> >   const rooms = new Map()
> >
> >   function list(room) {
> >     return [...(rooms.get(room)?.keys() ?? [])]
> >   }
> >
> >   function stop(room, user) {
> >     const users = rooms.get(room)
> >     if (!users?.has(user)) return
> >     clearTimeout(users.get(user))
> >     users.delete(user)
> >     if (users.size === 0) rooms.delete(room)
> >     onChange(room, list(room))
> >   }
> >
> >   function typing(room, user) {
> >     if (!rooms.has(room)) rooms.set(room, new Map())
> >     const users = rooms.get(room)
> >     const isNew = !users.has(user)
> >     clearTimeout(users.get(user))
> >     users.set(user, setTimeout(() => stop(room, user), timeout))
> >     if (isNew) onChange(room, list(room))
> >   }
> >
> >   function dispose() {
> >     for (const users of rooms.values()) for (const timer of users.values()) clearTimeout(timer)
> >     rooms.clear()
> >   }
> >
> >   return { typing, stop, list, dispose }
> > }
> >
> > function formatTyping(users, me = null) {
> >   const others = users.filter((user) => user !== me)
> >   if (others.length === 0) return ''
> >   if (others.length === 1) return `${others[0]} друкує…`
> >   if (others.length === 2) return `${others[0]} і ${others[1]} друкують…`
> >   return `${others[0]}, ${others[1]} та ще ${others.length - 2} друкують…`
> > }
> > ```
> > **Чому так:** трекер віддає **дані** (масив імен), а текст — справа представлення. Так ядро не залежить від мови інтерфейсу: для англійської версії замінюємо лише `formatTyping` (або беремо `Intl.ListFormat` + `Intl.PluralRules`). Фільтр `me` — частина представлення: сервер не знає, хто дивиться на екран.

## 🛠️ Крок 6. Фасад createChat

Склеюємо модулі. Фасад володіє членством у кімнатах і правилами («писати можна лише учасникам», «надіслане повідомлення гасить "друкує…"»), а все, що відбулося, публікує подіями. Результат `send` — об'єкт `{ ok, … }`: UI покаже причину відмови і `retryAfter`.

> [!task] Крок 6 · createChat
> level: senior · difficulty: hard · id: jsp-04-task-06 · tags: facade, events, integration
>
> Додай `createChat({ rateLimit = { limit: 5, interval: 10000 }, typingTimeout = 3000, historyLimit = 100 } = {})`, що повертає:
>
> - `on(event, listener)` → відписка. Події: `'join'` і `'leave'` (`{ room, user }`), `'message'` (повідомлення зі сховища), `'typing'` (`{ room, users }`);
> - `join(room, user)` / `leave(room, user)` → `true`, якщо склад змінився, інакше `false`; `leave` також гасить «друкує…»;
> - `members(room)` — масив учасників;
> - `typing(room, user)` — лише для учасників;
> - `send(room, user, text)`:
>   - не учасник → `{ ok: false, error: 'Спершу приєднайся до кімнати' }`;
>   - ліміт вичерпано → `{ ok: false, error: 'Забагато повідомлень', retryAfter }` (ліміт — на користувача);
>   - помилка валідації → `{ ok: false, error: <повідомлення помилки> }`;
>   - успіх → гасить «друкує…» автора, емітить `'message'`, повертає `{ ok: true, message }`;
> - `history(room, options)` — як `list` у сховищі; `dispose()`.
>
> ```js starter
> class EventEmitter {
>   #listeners = new Map()
>
>   on(event, listener) {
>     if (typeof listener !== 'function') throw new TypeError('listener має бути функцією')
>     if (!this.#listeners.has(event)) this.#listeners.set(event, [])
>     this.#listeners.get(event).push(listener)
>     return () => this.off(event, listener)
>   }
>
>   once(event, listener) {
>     const off = this.on(event, (...args) => {
>       off()
>       listener.apply(this, args)
>     })
>     return off
>   }
>
>   off(event, listener) {
>     const list = this.#listeners.get(event)
>     if (!list) return
>     const index = list.indexOf(listener)
>     if (index !== -1) list.splice(index, 1)
>     if (list.length === 0) this.#listeners.delete(event)
>   }
>
>   emit(event, ...args) {
>     const list = this.#listeners.get(event)
>     if (!list) return false
>     for (const listener of [...list]) listener.apply(this, args)
>     return true
>   }
>
>   listenerCount(event) {
>     return this.#listeners.get(event)?.length ?? 0
>   }
> }
>
> function createMessageStore({ limit = 100, maxLength = 500 } = {}) {
>   const rooms = new Map()
>   let seq = 0
>   return {
>     add({ room, user, text }) {
>       const body = String(text ?? '').trim()
>       if (body === '') throw new Error('Порожнє повідомлення')
>       if (body.length > maxLength) throw new Error(`Повідомлення довше за ${maxLength} символів`)
>       const message = Object.freeze({ id: ++seq, room, user, text: body, ts: Date.now() })
>       if (!rooms.has(room)) rooms.set(room, [])
>       const list = rooms.get(room)
>       list.push(message)
>       if (list.length > limit) list.splice(0, list.length - limit)
>       return message
>     },
>     list(room, { before = Infinity, limit: count = 20 } = {}) {
>       const list = rooms.get(room) ?? []
>       return list.filter((message) => message.id < before).slice(-count)
>     },
>   }
> }
>
> function createRateLimiter({ limit, interval }) {
>   const hits = new Map()
>
>   function recent(key) {
>     const now = Date.now()
>     const list = (hits.get(key) ?? []).filter((time) => now - time < interval)
>     if (list.length === 0) hits.delete(key)
>     else hits.set(key, list)
>     return list
>   }
>
>   return {
>     tryAcquire(key) {
>       const list = recent(key)
>       if (list.length >= limit) return false
>       list.push(Date.now())
>       hits.set(key, list)
>       return true
>     },
>     retryAfter(key) {
>       const list = recent(key)
>       return list.length < limit ? 0 : list[0] + interval - Date.now()
>     },
>   }
> }
>
> function createTypingTracker({ timeout = 3000, onChange = () => {} } = {}) {
>   const rooms = new Map()
>
>   function list(room) {
>     return [...(rooms.get(room)?.keys() ?? [])]
>   }
>
>   function stop(room, user) {
>     const users = rooms.get(room)
>     if (!users?.has(user)) return
>     clearTimeout(users.get(user))
>     users.delete(user)
>     if (users.size === 0) rooms.delete(room)
>     onChange(room, list(room))
>   }
>
>   function typing(room, user) {
>     if (!rooms.has(room)) rooms.set(room, new Map())
>     const users = rooms.get(room)
>     const isNew = !users.has(user)
>     clearTimeout(users.get(user))
>     users.set(user, setTimeout(() => stop(room, user), timeout))
>     if (isNew) onChange(room, list(room))
>   }
>
>   function dispose() {
>     for (const users of rooms.values()) for (const timer of users.values()) clearTimeout(timer)
>     rooms.clear()
>   }
>
>   return { typing, stop, list, dispose }
> }
>
> function formatTyping(users, me = null) {
>   const others = users.filter((user) => user !== me)
>   if (others.length === 0) return ''
>   if (others.length === 1) return `${others[0]} друкує…`
>   if (others.length === 2) return `${others[0]} і ${others[1]} друкують…`
>   return `${others[0]}, ${others[1]} та ще ${others.length - 2} друкують…`
> }
>
> function createChat({ rateLimit = { limit: 5, interval: 10000 }, typingTimeout = 3000, historyLimit = 100 } = {}) {
>   // твій код
> }
> ```
>
> ```js tests
> test('join / leave / members і події', () => {
>   const chat = createChat()
>   const events = []
>   chat.on('join', (e) => events.push(['join', e.user]))
>   chat.on('leave', (e) => events.push(['leave', e.user]))
>   expect(chat.join('general', 'Оля')).toBe(true)
>   expect(chat.join('general', 'Оля')).toBe(false)
>   chat.join('general', 'Петро')
>   expect(chat.members('general')).toEqual(['Оля', 'Петро'])
>   expect(chat.leave('general', 'Петро')).toBe(true)
>   expect(chat.leave('general', 'Петро')).toBe(false)
>   expect(events).toEqual([['join', 'Оля'], ['join', 'Петро'], ['leave', 'Петро']])
> })
>
> test('send: подія message та історія', () => {
>   const chat = createChat()
>   const onMessage = vi.fn()
>   chat.on('message', onMessage)
>   chat.join('general', 'Оля')
>   const result = chat.send('general', 'Оля', 'Привіт')
>   expect(result.ok).toBe(true)
>   expect(result.message.text).toBe('Привіт')
>   expect(onMessage).toHaveBeenCalledWith(result.message)
>   expect(chat.history('general').map((m) => m.text)).toEqual(['Привіт'])
> })
>
> test('не учасник і невалідний текст', () => {
>   const chat = createChat()
>   expect(chat.send('general', 'Гість', 'hi')).toEqual({ ok: false, error: 'Спершу приєднайся до кімнати' })
>   chat.join('general', 'Оля')
>   expect(chat.send('general', 'Оля', '   ')).toEqual({ ok: false, error: 'Порожнє повідомлення' })
> })
>
> test('typing: подія, і повідомлення гасить індикатор', () => {
>   vi.useFakeTimers()
>   const chat = createChat({ typingTimeout: 1000 })
>   const typing = []
>   chat.on('typing', (e) => typing.push(e.users))
>   chat.join('r', 'Оля')
>   chat.typing('r', 'Оля')
>   chat.typing('r', 'Чужий')
>   chat.send('r', 'Оля', 'готово')
>   expect(typing).toEqual([['Оля'], []])
> })
>
> test('rate limit з retryAfter', () => {
>   vi.useFakeTimers()
>   const chat = createChat({ rateLimit: { limit: 2, interval: 1000 } })
>   chat.join('r', 'Оля')
>   chat.send('r', 'Оля', '1')
>   chat.send('r', 'Оля', '2')
>   const blocked = chat.send('r', 'Оля', '3')
>   expect(blocked.ok).toBe(false)
>   expect(blocked.error).toBe('Забагато повідомлень')
>   expect(blocked.retryAfter).toBe(1000)
>   vi.advanceTimersByTime(1000)
>   expect(chat.send('r', 'Оля', '3').ok).toBe(true)
> })
>
> test('leave гасить typing, dispose чистить таймери', () => {
>   vi.useFakeTimers()
>   const chat = createChat({ typingTimeout: 1000 })
>   const typing = []
>   chat.on('typing', (e) => typing.push(e.users))
>   chat.join('r', 'Оля')
>   chat.join('r', 'Петро')
>   chat.typing('r', 'Оля')
>   chat.typing('r', 'Петро')
>   chat.leave('r', 'Оля')
>   expect(typing.at(-1)).toEqual(['Петро'])
>   chat.dispose()
>   expect(vi.getTimerCount()).toBe(0)
> })
> ```
>
> > [!hint]- Підказка 1
> > Створи всередині `events = new EventEmitter()`, `store`, `limiter` і `typingTracker` з `onChange: (room, users) => events.emit('typing', { room, users })`. Членство — `Map<room, Set<user>>`.
>
> > [!hint]- Підказка 2
> > `send`: перевірки по черзі (членство → ліміт → `store.add` у `try/catch`). Лише після успіху — `typingTracker.stop` і `events.emit('message', message)`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class EventEmitter {
> >   #listeners = new Map()
> >
> >   on(event, listener) {
> >     if (typeof listener !== 'function') throw new TypeError('listener має бути функцією')
> >     if (!this.#listeners.has(event)) this.#listeners.set(event, [])
> >     this.#listeners.get(event).push(listener)
> >     return () => this.off(event, listener)
> >   }
> >
> >   once(event, listener) {
> >     const off = this.on(event, (...args) => {
> >       off()
> >       listener.apply(this, args)
> >     })
> >     return off
> >   }
> >
> >   off(event, listener) {
> >     const list = this.#listeners.get(event)
> >     if (!list) return
> >     const index = list.indexOf(listener)
> >     if (index !== -1) list.splice(index, 1)
> >     if (list.length === 0) this.#listeners.delete(event)
> >   }
> >
> >   emit(event, ...args) {
> >     const list = this.#listeners.get(event)
> >     if (!list) return false
> >     for (const listener of [...list]) listener.apply(this, args)
> >     return true
> >   }
> >
> >   listenerCount(event) {
> >     return this.#listeners.get(event)?.length ?? 0
> >   }
> > }
> >
> > function createMessageStore({ limit = 100, maxLength = 500 } = {}) {
> >   const rooms = new Map()
> >   let seq = 0
> >   return {
> >     add({ room, user, text }) {
> >       const body = String(text ?? '').trim()
> >       if (body === '') throw new Error('Порожнє повідомлення')
> >       if (body.length > maxLength) throw new Error(`Повідомлення довше за ${maxLength} символів`)
> >       const message = Object.freeze({ id: ++seq, room, user, text: body, ts: Date.now() })
> >       if (!rooms.has(room)) rooms.set(room, [])
> >       const list = rooms.get(room)
> >       list.push(message)
> >       if (list.length > limit) list.splice(0, list.length - limit)
> >       return message
> >     },
> >     list(room, { before = Infinity, limit: count = 20 } = {}) {
> >       const list = rooms.get(room) ?? []
> >       return list.filter((message) => message.id < before).slice(-count)
> >     },
> >   }
> > }
> >
> > function createRateLimiter({ limit, interval }) {
> >   const hits = new Map()
> >
> >   function recent(key) {
> >     const now = Date.now()
> >     const list = (hits.get(key) ?? []).filter((time) => now - time < interval)
> >     if (list.length === 0) hits.delete(key)
> >     else hits.set(key, list)
> >     return list
> >   }
> >
> >   return {
> >     tryAcquire(key) {
> >       const list = recent(key)
> >       if (list.length >= limit) return false
> >       list.push(Date.now())
> >       hits.set(key, list)
> >       return true
> >     },
> >     retryAfter(key) {
> >       const list = recent(key)
> >       return list.length < limit ? 0 : list[0] + interval - Date.now()
> >     },
> >   }
> > }
> >
> > function createTypingTracker({ timeout = 3000, onChange = () => {} } = {}) {
> >   const rooms = new Map()
> >
> >   function list(room) {
> >     return [...(rooms.get(room)?.keys() ?? [])]
> >   }
> >
> >   function stop(room, user) {
> >     const users = rooms.get(room)
> >     if (!users?.has(user)) return
> >     clearTimeout(users.get(user))
> >     users.delete(user)
> >     if (users.size === 0) rooms.delete(room)
> >     onChange(room, list(room))
> >   }
> >
> >   function typing(room, user) {
> >     if (!rooms.has(room)) rooms.set(room, new Map())
> >     const users = rooms.get(room)
> >     const isNew = !users.has(user)
> >     clearTimeout(users.get(user))
> >     users.set(user, setTimeout(() => stop(room, user), timeout))
> >     if (isNew) onChange(room, list(room))
> >   }
> >
> >   function dispose() {
> >     for (const users of rooms.values()) for (const timer of users.values()) clearTimeout(timer)
> >     rooms.clear()
> >   }
> >
> >   return { typing, stop, list, dispose }
> > }
> >
> > function formatTyping(users, me = null) {
> >   const others = users.filter((user) => user !== me)
> >   if (others.length === 0) return ''
> >   if (others.length === 1) return `${others[0]} друкує…`
> >   if (others.length === 2) return `${others[0]} і ${others[1]} друкують…`
> >   return `${others[0]}, ${others[1]} та ще ${others.length - 2} друкують…`
> > }
> >
> > function createChat({ rateLimit = { limit: 5, interval: 10000 }, typingTimeout = 3000, historyLimit = 100 } = {}) {
> >   const events = new EventEmitter()
> >   const store = createMessageStore({ limit: historyLimit })
> >   const limiter = createRateLimiter(rateLimit)
> >   const rooms = new Map()
> >   const typingTracker = createTypingTracker({
> >     timeout: typingTimeout,
> >     onChange: (room, users) => events.emit('typing', { room, users }),
> >   })
> >
> >   const isMember = (room, user) => rooms.get(room)?.has(user) ?? false
> >
> >   return {
> >     on: (event, listener) => events.on(event, listener),
> >     join(room, user) {
> >       if (isMember(room, user)) return false
> >       if (!rooms.has(room)) rooms.set(room, new Set())
> >       rooms.get(room).add(user)
> >       events.emit('join', { room, user })
> >       return true
> >     },
> >     leave(room, user) {
> >       if (!isMember(room, user)) return false
> >       rooms.get(room).delete(user)
> >       typingTracker.stop(room, user)
> >       events.emit('leave', { room, user })
> >       return true
> >     },
> >     members: (room) => [...(rooms.get(room) ?? [])],
> >     typing(room, user) {
> >       if (isMember(room, user)) typingTracker.typing(room, user)
> >     },
> >     send(room, user, text) {
> >       if (!isMember(room, user)) return { ok: false, error: 'Спершу приєднайся до кімнати' }
> >       if (!limiter.tryAcquire(user)) return { ok: false, error: 'Забагато повідомлень', retryAfter: limiter.retryAfter(user) }
> >       let message
> >       try {
> >         message = store.add({ room, user, text })
> >       } catch (error) {
> >         return { ok: false, error: error.message }
> >       }
> >       typingTracker.stop(room, user)
> >       events.emit('message', message)
> >       return { ok: true, message }
> >     },
> >     history: (room, options) => store.list(room, options),
> >     dispose() {
> >       typingTracker.dispose()
> >     },
> >   }
> > }
> > ```
> > **Чому так:** **композиція** замість наслідування: фасад *має* емітер, а не *є* ним, тож назовні видно лише `on`, а `emit` лишається внутрішнім — ніхто ззовні не підробить подію `'message'`. Кожен модуль робить одне, а правила взаємодії зібрані в одному місці. Подія публікується **після** запису в історію — слухач, який одразу читає `history`, побачить нове повідомлення. Невалідні спроби теж витрачають ліміт — це свідоме антиспам-рішення.

## 🎤 На співбесіді

> [!interview] Як би ти масштабував цей чат до мільйона одночасних користувачів?
> level: senior · frequency: часто · id: jsp-04-int-01
>
> ---
>
> Наш `createChat` — це один процес. У продакшні: клієнти тримають **WebSocket** до багатьох stateless gateway-серверів; між серверами — **pub/sub** (Redis, NATS, Kafka): повідомлення публікується в канал кімнати, і кожен gateway розсилає його своїм підключеним учасникам. Кімнати **шардуються** за `hash(roomId)`. Історія — у БД з індексом `(room_id, id)` для курсорної пагінації; id — монотонні й глобально унікальні (Snowflake / ULID), щоб сортувати без координації. **Ефемерне** («друкує…», присутність) не пишемо в БД — лише pub/sub з TTL, і троттлимо сигнали на клієнті (раз на 2–3 с, а не на кожну клавішу). **Rate limit** — на gateway і в Redis (token bucket атомарним скриптом). Великі кімнати (100k учасників) — fan-out стає вузьким місцем: батчимо доставку, а лічильники непрочитаних рахуємо ліниво.
>
> 📚 [[JavaScript - 32. Патерни проєктування]] · [MDN: WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) · [Socket.IO docs](https://socket.io/docs/v4/)

> [!interview] Як гарантувати, що повідомлення не загубляться і не задублюються при поганій мережі?
> level: senior · frequency: іноді · id: jsp-04-int-02
>
> ---
>
> **Оптимістичний UI**: клієнт одразу показує повідомлення зі статусом «надсилається» і **клієнтським id** (`crypto.randomUUID()`). **Ідемпотентність**: сервер зберігає клієнтський id і на повторну відправку того ж id не створює дубль — тому ретраї безпечні. **Підтвердження (ack)**: сервер відповідає серверним `id`; без ack за N секунд — повтор з backoff; після кількох невдач — статус «не надіслано, повторити». **Порядок**: серверні id монотонні в межах кімнати; клієнт сортує за ними, а не за часом свого годинника. **Відновлення після розриву**: клієнт пам'ятає останній отриманий `id` і просить «все після X» — курсорна пагінація з кроку 2, лише в інший бік. Події, що прийшли двічі (і з сокета, і з дозавантаження), відкидаємо за `id`.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP]] · [MDN: Idempotent](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent) · [MDN: BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)

## 🧠 Закріплення

> [!question]- Навіщо `emit` ітерує копію масиву слухачів?
> *часто · пастка* · `jsp-04-001`
>
> Слухач може відписатися під час `emit` (так працює `once`) або підписати нового. `splice` в оригінальному масиві зсуває індекси, і цикл пропускає наступного слухача. Копія `[...list]` фіксує список на момент події: усі, хто був підписаний, отримають її рівно раз.
>
> 📚 [[JavaScript - 32. Патерни проєктування]] · [Node.js: Events](https://nodejs.org/api/events.html)

> [!question]- Чому `on` повертає функцію відписки?
> *часто · дизайн* · `jsp-04-002`
>
> Не треба зберігати посилання на слухача, щоб потім викликати `off(event, listener)` — особливо зручно для стрілок, створених «на місці». Відписка — значення, яке можна повернути з `useEffect`, скласти в масив cleanup-функцій тощо. Незабута відписка — головний захист від витоків пам'яті через слухачів.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття]] · [MDN: EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)

> [!question]- Чому курсорна пагінація краща за `offset` для чату?
> *часто · дизайн* · `jsp-04-003`
>
> Між запитами сторінок приходять нові повідомлення. `offset=20` після 5 нових повідомлень покаже 5 уже бачених ще раз. Курсор «старші за id 340» стабільний незалежно від нових даних, а в БД це швидкий пошук за індексом замість пропуску N рядків.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP]] · [MDN: 429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429)

> [!question]- Ковзне вікно, фіксоване вікно і token bucket — у чому різниця?
> *іноді · порівняння* · `jsp-04-004`
>
> **Фіксоване** вікно (лічильник на хвилину) просте, але на стику хвилин дозволяє подвійний сплеск. **Ковзне** з мітками точне, але зберігає до `limit` міток на ключ. **Token bucket** — O(1): відро токенів поповнюється з постійною швидкістю, запит забирає токен; дозволяє контрольовані сплески. На серверах найчастіше — token bucket або ковзне вікно-наближення в Redis.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни]] · [Wikipedia: Token bucket](https://en.wikipedia.org/wiki/Token_bucket)

> [!question]- Чому «друкує…» гасне по таймеру, а не лише за сигналом «перестав»?
> *часто · дизайн* · `jsp-04-005`
>
> Сигнал «перестав» може не прийти ніколи: закрили вкладку, зник інтернет, впав застосунок. Без таймера користувач «друкував би» вічно. Тому кожен сигнал «друкую» продовжує життя індикатора, а тиша довше за `timeout` гасить його — по суті debounce на пару кімната+користувач.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни]] · [Socket.IO docs](https://socket.io/docs/v4/)

> [!question]- Чому фасад чату містить EventEmitter, а не наслідує його?
> *іноді · дизайн* · `jsp-04-006`
>
> Композиція відкриває назовні лише `on`; `emit` лишається внутрішнім, тож сторонній код не може підробити подію `'message'` чи `'join'`. Наслідування `class Chat extends EventEmitter` віддало б увесь API емітера як публічний контракт. Правило: «has-a» за замовчуванням, «is-a» — лише коли об'єкт справді *є* різновидом базового.
>
> 📚 [[JavaScript - 07. Прототипи та класи]] · [Refactoring Guru: Adapter](https://refactoring.guru/design-patterns/adapter)

## ⚡ Фішки

> [!reel] 🧯 Node вбиває процес за подію 'error' без слухача
> У Node `emitter.emit('error', err)` без жодного слухача `'error'` кидає `err` і може покласти процес. Тому на кожен потік і сокет — `on('error', …)`.

> [!reel] 🔒 #private — справжня приватність
> Поле `#listeners` недоступне ззовні навіть через `Object.keys` чи `JSON.stringify`. Спроба `emitter.#listeners` поза класом — `SyntaxError` ще до виконання.

> [!reel] 🗺️ Map пам'ятає порядок вставки
> Перезапис наявного ключа не змінює його позицію — тому «хто почав друкувати першим» зберігається без окремого масиву.
>
> ```js
> const m = new Map([['a', 1], ['b', 2]])
> m.set('a', 3)
> [...m.keys()] // → ['a', 'b']
> ```

## 🖥️ Зібрати в браузері

Збережи як `chat.html`. Дві панелі — Оля і Петро — сидять в одній кімнаті через спільний `createChat`. Друкуй в одній панелі — в іншій з'явиться «друкує…», надішли 6 повідомлень за 10 секунд — спрацює rate limit.

```html
<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <title>Чат</title>
  <style>
    body { font: 15px system-ui, sans-serif; margin: 24px; }
    .panes { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .pane { border: 1px solid #ccc; border-radius: 8px; padding: 12px; display: flex; flex-direction: column; height: 420px; }
    .messages { flex: 1; overflow-y: auto; list-style: none; padding: 0; margin: 0; }
    .messages li { margin: 4px 0; }
    .messages .me { text-align: right; color: #1565c0; }
    .system { color: #888; font-style: italic; }
    .typing { color: #888; min-height: 1.3em; font-size: 13px; }
    .error { color: #c62828; font-size: 13px; min-height: 1.3em; }
  </style>
</head>
<body>
  <h1>💬 Кімната #general</h1>
  <div class="panes" id="panes"></div>
  <script>
class EventEmitter {
  #listeners = new Map()

  on(event, listener) {
    if (typeof listener !== 'function') throw new TypeError('listener має бути функцією')
    if (!this.#listeners.has(event)) this.#listeners.set(event, [])
    this.#listeners.get(event).push(listener)
    return () => this.off(event, listener)
  }

  once(event, listener) {
    const off = this.on(event, (...args) => {
      off()
      listener.apply(this, args)
    })
    return off
  }

  off(event, listener) {
    const list = this.#listeners.get(event)
    if (!list) return
    const index = list.indexOf(listener)
    if (index !== -1) list.splice(index, 1)
    if (list.length === 0) this.#listeners.delete(event)
  }

  emit(event, ...args) {
    const list = this.#listeners.get(event)
    if (!list) return false
    for (const listener of [...list]) listener.apply(this, args)
    return true
  }

  listenerCount(event) {
    return this.#listeners.get(event)?.length ?? 0
  }
}

function createMessageStore({ limit = 100, maxLength = 500 } = {}) {
  const rooms = new Map()
  let seq = 0
  return {
    add({ room, user, text }) {
      const body = String(text ?? '').trim()
      if (body === '') throw new Error('Порожнє повідомлення')
      if (body.length > maxLength) throw new Error(`Повідомлення довше за ${maxLength} символів`)
      const message = Object.freeze({ id: ++seq, room, user, text: body, ts: Date.now() })
      if (!rooms.has(room)) rooms.set(room, [])
      const list = rooms.get(room)
      list.push(message)
      if (list.length > limit) list.splice(0, list.length - limit)
      return message
    },
    list(room, { before = Infinity, limit: count = 20 } = {}) {
      const list = rooms.get(room) ?? []
      return list.filter((message) => message.id < before).slice(-count)
    },
  }
}

function createRateLimiter({ limit, interval }) {
  const hits = new Map()

  function recent(key) {
    const now = Date.now()
    const list = (hits.get(key) ?? []).filter((time) => now - time < interval)
    if (list.length === 0) hits.delete(key)
    else hits.set(key, list)
    return list
  }

  return {
    tryAcquire(key) {
      const list = recent(key)
      if (list.length >= limit) return false
      list.push(Date.now())
      hits.set(key, list)
      return true
    },
    retryAfter(key) {
      const list = recent(key)
      return list.length < limit ? 0 : list[0] + interval - Date.now()
    },
  }
}

function createTypingTracker({ timeout = 3000, onChange = () => {} } = {}) {
  const rooms = new Map()

  function list(room) {
    return [...(rooms.get(room)?.keys() ?? [])]
  }

  function stop(room, user) {
    const users = rooms.get(room)
    if (!users?.has(user)) return
    clearTimeout(users.get(user))
    users.delete(user)
    if (users.size === 0) rooms.delete(room)
    onChange(room, list(room))
  }

  function typing(room, user) {
    if (!rooms.has(room)) rooms.set(room, new Map())
    const users = rooms.get(room)
    const isNew = !users.has(user)
    clearTimeout(users.get(user))
    users.set(user, setTimeout(() => stop(room, user), timeout))
    if (isNew) onChange(room, list(room))
  }

  function dispose() {
    for (const users of rooms.values()) for (const timer of users.values()) clearTimeout(timer)
    rooms.clear()
  }

  return { typing, stop, list, dispose }
}

function formatTyping(users, me = null) {
  const others = users.filter((user) => user !== me)
  if (others.length === 0) return ''
  if (others.length === 1) return `${others[0]} друкує…`
  if (others.length === 2) return `${others[0]} і ${others[1]} друкують…`
  return `${others[0]}, ${others[1]} та ще ${others.length - 2} друкують…`
}

function createChat({ rateLimit = { limit: 5, interval: 10000 }, typingTimeout = 3000, historyLimit = 100 } = {}) {
  const events = new EventEmitter()
  const store = createMessageStore({ limit: historyLimit })
  const limiter = createRateLimiter(rateLimit)
  const rooms = new Map()
  const typingTracker = createTypingTracker({
    timeout: typingTimeout,
    onChange: (room, users) => events.emit('typing', { room, users }),
  })

  const isMember = (room, user) => rooms.get(room)?.has(user) ?? false

  return {
    on: (event, listener) => events.on(event, listener),
    join(room, user) {
      if (isMember(room, user)) return false
      if (!rooms.has(room)) rooms.set(room, new Set())
      rooms.get(room).add(user)
      events.emit('join', { room, user })
      return true
    },
    leave(room, user) {
      if (!isMember(room, user)) return false
      rooms.get(room).delete(user)
      typingTracker.stop(room, user)
      events.emit('leave', { room, user })
      return true
    },
    members: (room) => [...(rooms.get(room) ?? [])],
    typing(room, user) {
      if (isMember(room, user)) typingTracker.typing(room, user)
    },
    send(room, user, text) {
      if (!isMember(room, user)) return { ok: false, error: 'Спершу приєднайся до кімнати' }
      if (!limiter.tryAcquire(user)) return { ok: false, error: 'Забагато повідомлень', retryAfter: limiter.retryAfter(user) }
      let message
      try {
        message = store.add({ room, user, text })
      } catch (error) {
        return { ok: false, error: error.message }
      }
      typingTracker.stop(room, user)
      events.emit('message', message)
      return { ok: true, message }
    },
    history: (room, options) => store.list(room, options),
    dispose() {
      typingTracker.dispose()
    },
  }
}

    // ---------- DOM-шар: одна панель на користувача
    const ROOM = 'general'
    const chat = createChat({ rateLimit: { limit: 5, interval: 10000 }, typingTimeout: 2500 })

    function createPane(user) {
      const pane = document.createElement('section')
      pane.className = 'pane'
      const title = Object.assign(document.createElement('h2'), { textContent: user })
      const list = Object.assign(document.createElement('ul'), { className: 'messages' })
      const typing = Object.assign(document.createElement('div'), { className: 'typing' })
      const error = Object.assign(document.createElement('div'), { className: 'error' })
      const form = document.createElement('form')
      const input = Object.assign(document.createElement('input'), { placeholder: 'Повідомлення…', autocomplete: 'off' })
      form.append(input, Object.assign(document.createElement('button'), { textContent: 'Надіслати' }))
      pane.append(title, list, typing, error, form)

      const addLine = (text, className) => {
        list.append(Object.assign(document.createElement('li'), { textContent: text, className }))
        list.scrollTop = list.scrollHeight
      }

      chat.on('message', (m) => addLine(`${m.user === user ? '' : m.user + ': '}${m.text}`, m.user === user ? 'me' : ''))
      chat.on('join', (e) => addLine(`${e.user} приєднується`, 'system'))
      chat.on('leave', (e) => addLine(`${e.user} виходить`, 'system'))
      chat.on('typing', (e) => {
        if (e.room === ROOM) typing.textContent = formatTyping(e.users, user)
      })

      input.addEventListener('input', () => chat.typing(ROOM, user))
      form.addEventListener('submit', (event) => {
        event.preventDefault()
        const result = chat.send(ROOM, user, input.value)
        error.textContent = result.ok ? '' : result.retryAfter ? `${result.error}: спробуй через ${Math.ceil(result.retryAfter / 1000)} с` : result.error
        if (result.ok) input.value = ''
      })
      return pane
    }

    const panes = document.getElementById('panes')
    panes.append(createPane('Оля'), createPane('Петро'))
    chat.join(ROOM, 'Оля')
    chat.join(ROOM, 'Петро')
  </script>
</body>
</html>
```

> [!tip] Наступний рівень — справжні вкладки
> Обгорни `chat.on('message')` і `send` у [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel): кожна вкладка — окремий користувач, повідомлення ходять між вкладками без сервера. Це той самий pub/sub, що й Redis між серверами, тільки в межах браузера.

## 📚 Джерела та що почитати

- 🟢 [Node.js — Events](https://nodejs.org/api/events.html) — еталонний EventEmitter: `once`, `'error'`, порядок слухачів
- 🟢 [MDN — EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) — браузерний аналог: `addEventListener`, `{ once, signal }`
- 🟡 [MDN — WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) — транспорт для справжнього чату
- 🟡 [MDN — BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) — pub/sub між вкладками
- 🟡 [MDN — 429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429) — як сервер повідомляє про rate limit
- 🟡 [Wikipedia — Token bucket](https://en.wikipedia.org/wiki/Token_bucket) — альтернатива ковзному вікну
- 🛠️ [Socket.IO — документація](https://socket.io/docs/v4/) — кімнати, ack, reconnect «з коробки»

> [!important] Підсумок
> - Події = слабка зв'язність: публікатор не знає слухачів; `on` повертає відписку.
> - `emit` ітерує копію слухачів; `once` відписується до виклику.
> - Історія: ліміт у пам'яті + курсорна пагінація за монотонним `id`.
> - Rate limit — ковзне вікно з `retryAfter`; ефемерний стан («друкує…») живе на таймерах і сам гасне.
> - Фасад *містить* емітер (композиція) і публікує події лише після успішних змін.
