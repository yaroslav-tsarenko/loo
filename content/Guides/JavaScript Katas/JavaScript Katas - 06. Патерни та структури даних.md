---
title: Патерни та структури даних
order: 6
level: middle
tags: [data-structures, patterns, event-emitter, lru, observable, store, trie]
prerequisites:
  - "[[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви]]"
  - "[[JavaScript - 32. Патерни проєктування]]"
  - "[[JavaScript - 07. Прототипи та класи]]"
estimatedMinutes: 120
id: jsk-ch-06
icon: "🏗️"
---

# JavaScript Katas - 06. Патерни та структури даних

> [!success] 🎯 Що тренуємо
> - Проєктувати **API класу** до реалізації: які методи, що повертають, які інваріанти.
> - Структури з гарантованою складністю: стек і черга O(1), LRU-кеш O(1), Trie O(довжини слова).
> - Патерн «спостерігач» у трьох обличчях: EventEmitter, pub/sub з wildcard-топіками, Observable.
> - Redux-подібний store: незмінний стан, `dispatch`, підписки.

## 🧭 Стратегія

На таких задачах інтерв'юер дивиться, **як ти проєктуєш**. Перед кодом напиши «контракт» у вигляді коментаря:

```js
class LRUCache {
  // get(key)        → value | -1, O(1), робить key «найсвіжішим»
  // put(key, value) → void,       O(1), витісняє найстаріший при переповненні
}
```

**Вибір внутрішньої структури — 80% рішення:**

| Потрібно | Бери | Чому |
|---|---|---|
| LIFO | масив `push`/`pop` | обидва O(1) з кінця |
| FIFO | об'єкт/`Map` з індексами `head`/`tail` або зв'язний список | `shift()` формально O(n) |
| «Найстаріший» + пошук за ключем | `Map` | зберігає порядок вставки; `delete` + `set` = «оновити свіжість» |
| Префікси | дерево вузлів `Map<char, Node>` | пошук не залежить від кількості слів |
| Підписники | `Map<event, Listener[]>` | порядок підписки, швидкий доступ за подією |

**Три правила патерну «спостерігач»:**

1. `subscribe` повертає функцію **відписки** — це робить витоки пам'яті рідкісними.
2. Під час розсилки ітеруй **знімок** списку (`listeners.slice()`): слухач може відписатися або підписати іншого посеред розсилки.
3. Подумай про помилки й завершення: що буде після `complete`? після помилки в обробнику?

> [!tip] Звідки ці патерни
> EventEmitter — Node.js `events`, store — Redux, Observable — RxJS і TC39-пропозиція. Знати оригінал корисно: на співбесіді часто питають «а як це зроблено в Redux?». Детально про патерни — [[JavaScript - 32. Патерни проєктування]].

## 🧩 Збери з пам'яті

> [!quiz] Збери `get` для LRU-кешу на `Map`
> level: middle · type: order · id: jsk-06-quiz-01
>
> ```js order
> get(key) {
>   if (!this.map.has(key)) return -1
>   const value = this.map.get(key)
>   this.map.delete(key)
>   this.map.set(key, value)
>   return value
> }
> return this.map.get(key) ?? -1   // ✗
> ```
>
> **Пояснення:** `delete` + `set` переносить ключ у кінець порядку вставки — тепер він «найсвіжіший». Найстаріший завжди перший: `this.map.keys().next().value`. Варіант з `??` не оновлює свіжість і ламається на значенні `null`.

> [!quiz] Заповни пропуски в `emit`
> level: middle · type: fill · id: jsk-06-quiz-02 · bank: forEach, call, true
>
> ```js fill
> emit(event, ...args) {
>   const listeners = this.events.get(event)
>   if (!listeners || listeners.length === 0) return [[false]]
>   for (const listener of listeners.[[slice]]()) listener.[[apply]](this, args)
>   return true
> }
> ```
>
> **Пояснення:** `slice()` — знімок: якщо слухач відпишеться посеред розсилки, цикл не «перескочить» сусіда. `emit` повертає, чи були слухачі — як у Node.js.

> [!quiz] Заповни пропуски в `dispatch` Redux-подібного store
> level: middle · type: fill · id: jsk-06-quiz-03
>
> ```js fill
> function dispatch(action) {
>   state = [[reducer]](state, action)
>   for (const listener of listeners.[[slice]]()) listener()
>   return [[action]]
> }
> ```
>
> **Пояснення:** reducer — чиста функція `(state, action) → новий state`. Після оновлення сповіщаємо знімок підписників; `dispatch` повертає саму дію, щоб middleware могли її ланцюжити.

## 🛠️ Задачі

> [!task] Стек
> level: junior · difficulty: easy · id: jsk-06-task-01 · tags: data-structures, stack
>
> Реалізуй клас `Stack` (LIFO), усі операції — O(1):
>
> - `push(item)` → нова довжина;
> - `pop()` → верхній елемент або `undefined`, якщо порожньо;
> - `peek()` → верхній елемент без видалення;
> - `size` — геттер; `isEmpty()` → boolean.
>
> ```js starter
> class Stack {
>   // твій код
> }
> ```
>
> ```js tests
> test('LIFO', () => {
>   const s = new Stack()
>   s.push(1)
>   s.push(2)
>   s.push(3)
>   expect(s.pop()).toBe(3)
>   expect(s.pop()).toBe(2)
>   expect(s.pop()).toBe(1)
> })
>
> test('push повертає нову довжину, size — геттер', () => {
>   const s = new Stack()
>   expect(s.push('a')).toBe(1)
>   expect(s.push('b')).toBe(2)
>   expect(s.size).toBe(2)
> })
>
> test('peek не видаляє', () => {
>   const s = new Stack()
>   s.push('x')
>   expect(s.peek()).toBe('x')
>   expect(s.size).toBe(1)
> })
>
> test('порожній стек', () => {
>   const s = new Stack()
>   expect(s.isEmpty()).toBe(true)
>   expect(s.pop()).toBe(undefined)
>   expect(s.peek()).toBe(undefined)
>   expect(s.size).toBe(0)
> })
>
> test('undefined — теж елемент', () => {
>   const s = new Stack()
>   s.push(undefined)
>   expect(s.isEmpty()).toBe(false)
>   expect(s.size).toBe(1)
> })
>
> test('екземпляри незалежні', () => {
>   const a = new Stack()
>   const b = new Stack()
>   a.push(1)
>   expect(b.size).toBe(0)
> })
> ```
>
> > [!hint]- Підказка 1
> > Масив з `push`/`pop` з кінця — обидві операції O(1).
>
> > [!hint]- Підказка 2
> > Сховай масив у приватне поле `#items`, щоб зовнішній код не міг зламати інваріант.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class Stack {
> >   #items = []
> >
> >   push(item) {
> >     return this.#items.push(item)
> >   }
> >
> >   pop() {
> >     return this.#items.pop()
> >   }
> >
> >   peek() {
> >     return this.#items[this.#items.length - 1]
> >   }
> >
> >   get size() {
> >     return this.#items.length
> >   }
> >
> >   isEmpty() {
> >     return this.#items.length === 0
> >   }
> > }
> > ```
> > **Складність:** O(1) на кожну операцію (амортизовано для `push`). **Чому так:** `isEmpty` через довжину, а не через `peek() === undefined` — інакше стек з `undefined` вважався б порожнім. **Що спитають далі:** «min-stack з `getMin()` за O(1)?» — другий стек поточних мінімумів; «де стек у JS-рушії?» — call stack.

> [!task] Черга з O(1) dequeue
> level: junior · difficulty: easy · id: jsk-06-task-02 · tags: data-structures, queue
>
> Реалізуй клас `Queue` (FIFO), усі операції — O(1), **без** `Array.prototype.shift`/`splice`:
>
> - `enqueue(item)` → нова довжина;
> - `dequeue()` → перший елемент або `undefined`;
> - `peek()` → перший елемент без видалення;
> - `size` — геттер; `isEmpty()`.
>
> ```js starter
> class Queue {
>   // твій код
> }
> ```
>
> ```js tests
> test('FIFO', () => {
>   const q = new Queue()
>   q.enqueue(1)
>   q.enqueue(2)
>   q.enqueue(3)
>   expect(q.dequeue()).toBe(1)
>   expect(q.dequeue()).toBe(2)
>   expect(q.dequeue()).toBe(3)
> })
>
> test('enqueue повертає довжину, peek не видаляє', () => {
>   const q = new Queue()
>   expect(q.enqueue('a')).toBe(1)
>   expect(q.enqueue('b')).toBe(2)
>   expect(q.peek()).toBe('a')
>   expect(q.size).toBe(2)
> })
>
> test('порожня черга', () => {
>   const q = new Queue()
>   expect(q.dequeue()).toBe(undefined)
>   expect(q.peek()).toBe(undefined)
>   expect(q.isEmpty()).toBe(true)
>   expect(q.size).toBe(0)
> })
>
> test('чергування операцій', () => {
>   const q = new Queue()
>   q.enqueue(1)
>   q.enqueue(2)
>   q.dequeue()
>   q.enqueue(3)
>   expect(q.dequeue()).toBe(2)
>   expect(q.dequeue()).toBe(3)
>   expect(q.isEmpty()).toBe(true)
>   q.enqueue(4)
>   expect(q.peek()).toBe(4)
>   expect(q.size).toBe(1)
> })
>
> test('без shift і splice', () => {
>   const shift = Array.prototype.shift
>   const splice = Array.prototype.splice
>   Array.prototype.shift = () => { throw new Error('shift заборонено') }
>   Array.prototype.splice = () => { throw new Error('splice заборонено') }
>   try {
>     const q = new Queue()
>     for (let i = 0; i < 1000; i++) q.enqueue(i)
>     let sum = 0
>     while (!q.isEmpty()) sum += q.dequeue()
>     expect(sum).toBe(499500)
>   } finally {
>     Array.prototype.shift = shift
>     Array.prototype.splice = splice
>   }
> })
> ```
>
> > [!hint]- Підказка 1
> > Зберігай елементи в об'єкті (або `Map`) за числовими ключами і тримай два індекси: `head` — звідки брати, `tail` — куди класти.
>
> > [!hint]- Підказка 2
> > `dequeue`: взяти `items[head]`, `delete items[head]`, `head++`. Розмір — `tail - head`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class Queue {
> >   #items = new Map()
> >   #head = 0
> >   #tail = 0
> >
> >   enqueue(item) {
> >     this.#items.set(this.#tail++, item)
> >     return this.size
> >   }
> >
> >   dequeue() {
> >     if (this.isEmpty()) return undefined
> >     const item = this.#items.get(this.#head)
> >     this.#items.delete(this.#head++)
> >     return item
> >   }
> >
> >   peek() {
> >     return this.#items.get(this.#head)
> >   }
> >
> >   get size() {
> >     return this.#tail - this.#head
> >   }
> >
> >   isEmpty() {
> >     return this.size === 0
> >   }
> > }
> > ```
> > **Складність:** O(1) на операцію. **Чому так:** `shift()` за специфікацією зсуває всі елементи (O(n)); V8 інколи оптимізує його, але покладатися на це на співбесіді не варто. **Що спитають далі:** «зв'язний список?» — вузли `{ value, next }` з `head`/`tail`; «кільцевий буфер?» — масив фіксованого розміру з індексами за модулем; «черга на двох стеках?» — амортизовано O(1).

> [!task] LRU-кеш
> level: middle · difficulty: medium · id: jsk-06-task-03 · tags: data-structures, map, cache
>
> Реалізуй `LRUCache(capacity)` (Least Recently Used):
>
> - `get(key)` → значення або `-1`, якщо ключа немає; успішний `get` робить ключ «найсвіжішим»;
> - `put(key, value)` — додає або оновлює (теж робить ключ найсвіжішим); якщо розмір перевищив `capacity` — витісняє **найдавніше використаний** ключ.
>
> Обидві операції — O(1). Ключі можуть бути будь-якого типу.
>
> ```js starter
> class LRUCache {
>   constructor(capacity) {
>     // твій код
>   }
>
>   get(key) {
>     // твій код
>   }
>
>   put(key, value) {
>     // твій код
>   }
> }
> ```
>
> ```js tests
> test('класичний сценарій LeetCode', () => {
>   const cache = new LRUCache(2)
>   cache.put(1, 1)
>   cache.put(2, 2)
>   expect(cache.get(1)).toBe(1)
>   cache.put(3, 3)
>   expect(cache.get(2)).toBe(-1)
>   cache.put(4, 4)
>   expect(cache.get(1)).toBe(-1)
>   expect(cache.get(3)).toBe(3)
>   expect(cache.get(4)).toBe(4)
> })
>
> test('put існуючого ключа оновлює значення і свіжість', () => {
>   const cache = new LRUCache(2)
>   cache.put('a', 1)
>   cache.put('b', 2)
>   cache.put('a', 10)
>   cache.put('c', 3)
>   expect(cache.get('a')).toBe(10)
>   expect(cache.get('b')).toBe(-1)
> })
>
> test('ємність 1', () => {
>   const cache = new LRUCache(1)
>   cache.put('x', 1)
>   cache.put('y', 2)
>   expect(cache.get('x')).toBe(-1)
>   expect(cache.get('y')).toBe(2)
> })
>
> test('falsy-значення — не «відсутність»', () => {
>   const cache = new LRUCache(3)
>   cache.put('zero', 0)
>   cache.put('empty', '')
>   cache.put('nil', null)
>   expect(cache.get('zero')).toBe(0)
>   expect(cache.get('empty')).toBe('')
>   expect(cache.get('nil')).toBe(null)
> })
>
> test('об\'єкти як ключі', () => {
>   const cache = new LRUCache(2)
>   const key = { id: 1 }
>   cache.put(key, 'obj')
>   expect(cache.get(key)).toBe('obj')
>   expect(cache.get({ id: 1 })).toBe(-1)
> })
>
> test('get відсутнього ключа не впливає на витіснення', () => {
>   const cache = new LRUCache(2)
>   cache.put(1, 'a')
>   cache.put(2, 'b')
>   cache.get(99)
>   cache.put(3, 'c')
>   expect(cache.get(1)).toBe(-1)
>   expect(cache.get(2)).toBe('b')
> })
> ```
>
> > [!hint]- Підказка 1
> > `Map` ітерується в порядку вставки. Перший ключ — найдавніший: `map.keys().next().value`.
>
> > [!hint]- Підказка 2
> > «Оновити свіжість» = `delete(key)` і знову `set(key, value)` — ключ переїде в кінець.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class LRUCache {
> >   constructor(capacity) {
> >     this.capacity = capacity
> >     this.map = new Map()
> >   }
> >
> >   get(key) {
> >     if (!this.map.has(key)) return -1
> >     const value = this.map.get(key)
> >     this.map.delete(key)
> >     this.map.set(key, value)
> >     return value
> >   }
> >
> >   put(key, value) {
> >     if (this.map.has(key)) this.map.delete(key)
> >     this.map.set(key, value)
> >     if (this.map.size > this.capacity) {
> >       const oldest = this.map.keys().next().value
> >       this.map.delete(oldest)
> >     }
> >   }
> > }
> > ```
> > **Складність:** O(1) на операцію. **Чому так:** `Map` у JS — hash-таблиця **з порядком вставки**, тобто фактично вже «hashmap + двозв'язний список», який довелося б писати вручну в Java/C++. **Що спитають далі:** «без `Map`?» — hashmap на вузли двозв'язного списку з фіктивними head/tail; «TTL?» — зберігати `expiresAt` і перевіряти в `get`; «LFU?» — лічильники частоти + списки за частотою.

> [!task] EventEmitter
> level: middle · difficulty: medium · id: jsk-06-task-04 · tags: patterns, observer, events
>
> Реалізуй клас `EventEmitter`:
>
> - `on(event, listener)` — підписка; повертає функцію відписки. Той самий слухач можна підписати двічі — тоді він викликається двічі;
> - `off(event, listener)` — прибирає **одну** реєстрацію слухача;
> - `once(event, listener)` — спрацює лише раз; його можна прибрати `off(event, listener)` ще до спрацювання;
> - `emit(event, ...args)` — викликає слухачів у порядку підписки з аргументами; повертає `true`, якщо слухачі були. Розсилка йде по **знімку** списку: відписка посеред `emit` не впливає на поточну розсилку.
>
> ```js starter
> class EventEmitter {
>   // твій код
> }
> ```
>
> ```js tests
> test('on + emit з аргументами в порядку підписки', () => {
>   const e = new EventEmitter()
>   const log = []
>   e.on('msg', (a, b) => log.push(`1:${a}${b}`))
>   e.on('msg', (a, b) => log.push(`2:${a}${b}`))
>   expect(e.emit('msg', 'x', 'y')).toBe(true)
>   expect(log).toEqual(['1:xy', '2:xy'])
> })
>
> test('emit без слухачів повертає false', () => {
>   expect(new EventEmitter().emit('nothing')).toBe(false)
> })
>
> test('функція відписки з on', () => {
>   const e = new EventEmitter()
>   const spy = vi.fn()
>   const unsubscribe = e.on('a', spy)
>   unsubscribe()
>   expect(e.emit('a')).toBe(false)
>   expect(spy).toHaveBeenCalledTimes(0)
> })
>
> test('off прибирає одну реєстрацію', () => {
>   const e = new EventEmitter()
>   const spy = vi.fn()
>   e.on('a', spy)
>   e.on('a', spy)
>   e.off('a', spy)
>   e.emit('a')
>   expect(spy).toHaveBeenCalledTimes(1)
> })
>
> test('once спрацьовує один раз', () => {
>   const e = new EventEmitter()
>   const spy = vi.fn()
>   e.once('ready', spy)
>   e.emit('ready', 1)
>   e.emit('ready', 2)
>   expect(spy).toHaveBeenCalledTimes(1)
>   expect(spy).toHaveBeenCalledWith(1)
> })
>
> test('once можна прибрати через off до спрацювання', () => {
>   const e = new EventEmitter()
>   const spy = vi.fn()
>   e.once('ready', spy)
>   e.off('ready', spy)
>   e.emit('ready')
>   expect(spy).toHaveBeenCalledTimes(0)
> })
>
> test('відписка посеред emit не ламає поточну розсилку', () => {
>   const e = new EventEmitter()
>   const log = []
>   const second = () => log.push('second')
>   e.on('tick', () => { log.push('first'); e.off('tick', second) })
>   e.on('tick', second)
>   e.emit('tick')
>   e.emit('tick')
>   expect(log).toEqual(['first', 'second', 'first'])
> })
>
> test('різні події не змішуються, off невідомого — без помилки', () => {
>   const e = new EventEmitter()
>   const spy = vi.fn()
>   e.on('a', spy)
>   e.emit('b')
>   expect(() => e.off('zzz', spy)).not.toThrow()
>   expect(spy).toHaveBeenCalledTimes(0)
> })
> ```
>
> > [!hint]- Підказка 1
> > `Map<event, listener[]>`. Масив, а не `Set`: один слухач може бути зареєстрований двічі.
>
> > [!hint]- Підказка 2
> > `once` реєструє обгортку, а щоб `off(event, original)` її знайшов — збережи оригінал у властивості обгортки (`wrapper.listener = listener`) і порівнюй обидва варіанти.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class EventEmitter {
> >   #events = new Map()
> >
> >   on(event, listener) {
> >     if (!this.#events.has(event)) this.#events.set(event, [])
> >     this.#events.get(event).push(listener)
> >     return () => this.off(event, listener)
> >   }
> >
> >   off(event, listener) {
> >     const listeners = this.#events.get(event)
> >     if (!listeners) return this
> >     const index = listeners.findIndex((l) => l === listener || l.listener === listener)
> >     if (index !== -1) listeners.splice(index, 1)
> >     if (listeners.length === 0) this.#events.delete(event)
> >     return this
> >   }
> >
> >   once(event, listener) {
> >     const wrapper = (...args) => {
> >       this.off(event, wrapper)
> >       listener.apply(this, args)
> >     }
> >     wrapper.listener = listener
> >     return this.on(event, wrapper)
> >   }
> >
> >   emit(event, ...args) {
> >     const listeners = this.#events.get(event)
> >     if (!listeners || listeners.length === 0) return false
> >     for (const listener of listeners.slice()) listener.apply(this, args)
> >     return true
> >   }
> > }
> > ```
> > **Складність:** `on`/`emit` — O(1)/O(k), `off` — O(k), k — кількість слухачів події. **Чому так:** `once` спершу відписується, потім викликає — так рекурсивний `emit` усередині слухача не викличе його вдруге. Видалення порожнього масиву не дає `Map` рости від разових подій. **Що спитають далі:** «помилка в слухачі?» — в Node вона летить з `emit`; можна ловити й емітити `'error'`; «витоки?» — Node попереджає після 10 слухачів (`setMaxListeners`); «типізуй події в TypeScript» — `EventEmitter<{ msg: [string, number] }>`.

> [!task] Redux-подібний store
> level: middle · difficulty: medium · id: jsk-06-task-05 · tags: patterns, state, redux
>
> Напиши `createStore(reducer, preloadedState)`, що повертає `{ getState, dispatch, subscribe }`:
>
> - при створенні store робить внутрішній `dispatch({ type: '@@INIT' })`, тож стан = `reducer(preloadedState, initAction)`;
> - `dispatch(action)` — `action` має бути plain object з полем `type`, інакше кидає `Error`; оновлює стан через reducer, сповіщає підписників і повертає `action`;
> - виклик `dispatch` **усередині reducer** кидає `Error`;
> - `subscribe(listener)` повертає функцію відписки (повторний виклик безпечний); слухачі викликаються без аргументів після кожного `dispatch`, за знімком списку.
>
> ```js starter
> function createStore(reducer, preloadedState) {
>   // твій код
> }
> ```
>
> ```js tests
> function counter(state = 0, action) {
>   switch (action.type) {
>     case 'inc': return state + 1
>     case 'add': return state + action.payload
>     default: return state
>   }
> }
>
> test('початковий стан з reducer або preloadedState', () => {
>   expect(createStore(counter).getState()).toBe(0)
>   expect(createStore(counter, 10).getState()).toBe(10)
> })
>
> test('dispatch оновлює стан і повертає action', () => {
>   const store = createStore(counter)
>   const action = { type: 'add', payload: 5 }
>   expect(store.dispatch(action)).toBe(action)
>   store.dispatch({ type: 'inc' })
>   expect(store.getState()).toBe(6)
> })
>
> test('reducer отримує @@INIT при створенні', () => {
>   const seen = []
>   createStore((state = null, action) => { seen.push(action.type); return state })
>   expect(seen).toEqual(['@@INIT'])
> })
>
> test('підписники викликаються після кожного dispatch', () => {
>   const store = createStore(counter)
>   const states = []
>   store.subscribe(() => states.push(store.getState()))
>   store.dispatch({ type: 'inc' })
>   store.dispatch({ type: 'inc' })
>   expect(states).toEqual([1, 2])
> })
>
> test('відписка, повторна відписка безпечна', () => {
>   const store = createStore(counter)
>   const spy = vi.fn()
>   const unsubscribe = store.subscribe(spy)
>   unsubscribe()
>   unsubscribe()
>   store.dispatch({ type: 'inc' })
>   expect(spy).toHaveBeenCalledTimes(0)
> })
>
> test('відписка під час сповіщення діє з наступного dispatch', () => {
>   const store = createStore(counter)
>   const log = []
>   let unsubscribeB
>   store.subscribe(() => { log.push('A'); unsubscribeB() })
>   unsubscribeB = store.subscribe(() => log.push('B'))
>   store.dispatch({ type: 'inc' })
>   store.dispatch({ type: 'inc' })
>   expect(log).toEqual(['A', 'B', 'A'])
> })
>
> test('некоректна дія — Error', () => {
>   const store = createStore(counter)
>   expect(() => store.dispatch('inc')).toThrow()
>   expect(() => store.dispatch({ payload: 1 })).toThrow()
>   expect(() => store.dispatch(null)).toThrow()
> })
>
> test('dispatch у reducer заборонений', () => {
>   let store
>   store = createStore((state = 0, action) => {
>     if (action.type === 'evil') store.dispatch({ type: 'inc' })
>     return state
>   })
>   expect(() => store.dispatch({ type: 'evil' })).toThrow()
> })
> ```
>
> > [!hint]- Підказка 1
> > У замиканні: `state`, `listeners` (масив) і прапорець `isDispatching`.
>
> > [!hint]- Підказка 2
> > Прапорець ставиться перед викликом reducer і знімається у `finally`. Відписка — `filter` або `splice` за індексом, з власним прапорцем `subscribed` для ідемпотентності.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function createStore(reducer, preloadedState) {
> >   let state = preloadedState
> >   let listeners = []
> >   let isDispatching = false
> >
> >   function getState() {
> >     return state
> >   }
> >
> >   function dispatch(action) {
> >     const isPlain = action !== null && typeof action === 'object' && Object.getPrototypeOf(action) === Object.prototype
> >     if (!isPlain) throw new Error('Actions must be plain objects')
> >     if (action.type === undefined) throw new Error('Actions must have a "type" property')
> >     if (isDispatching) throw new Error('Reducers may not dispatch actions')
> >     try {
> >       isDispatching = true
> >       state = reducer(state, action)
> >     } finally {
> >       isDispatching = false
> >     }
> >     for (const listener of listeners.slice()) listener()
> >     return action
> >   }
> >
> >   function subscribe(listener) {
> >     let subscribed = true
> >     listeners.push(listener)
> >     return () => {
> >       if (!subscribed) return
> >       subscribed = false
> >       listeners = listeners.filter((l) => l !== listener)
> >     }
> >   }
> >
> >   dispatch({ type: '@@INIT' })
> >   return { getState, dispatch, subscribe }
> > }
> > ```
> > **Складність:** `dispatch` — O(reducer + кількість слухачів). **Чому так:** заборона dispatch у reducer тримає reducer чистим; знімок слухачів робить відписки посеред розсилки передбачуваними. Тут `filter` прибирає **всі** реєстрації того самого слухача — Redux прибирає одну за індексом. **Що спитають далі:** «`combineReducers`?» — reducer, що делегує піддеревам стану; «middleware?» — `applyMiddleware` загортає `dispatch` ланцюжком `store => next => action`; «чому стан незмінний?» — порівняння за посиланням для ререндерів і time-travel debugging.

> [!task] Trie (префіксне дерево)
> level: middle · difficulty: medium · id: jsk-06-task-06 · tags: data-structures, trie, strings
>
> Реалізуй клас `Trie`:
>
> - `insert(word)` — додає слово (повторне додавання нічого не змінює);
> - `search(word)` → `true`, лише якщо **саме це слово** додано;
> - `startsWith(prefix)` → `true`, якщо є хоч одне слово з таким префіксом (`''` — префікс будь-чого, навіть у порожньому дереві);
> - `wordsWithPrefix(prefix)` → масив усіх слів з префіксом, **відсортований** (`.sort()` за замовчуванням).
>
> Складність `insert`/`search`/`startsWith` — O(довжини слова), незалежно від кількості слів.
>
> ```js starter
> class Trie {
>   // твій код
> }
> ```
>
> ```js tests
> test('insert, search і startsWith', () => {
>   const trie = new Trie()
>   trie.insert('apple')
>   expect(trie.search('apple')).toBe(true)
>   expect(trie.search('app')).toBe(false)
>   expect(trie.startsWith('app')).toBe(true)
>   trie.insert('app')
>   expect(trie.search('app')).toBe(true)
> })
>
> test('відсутні слова і префікси', () => {
>   const trie = new Trie()
>   trie.insert('cat')
>   expect(trie.search('cats')).toBe(false)
>   expect(trie.search('dog')).toBe(false)
>   expect(trie.startsWith('ca')).toBe(true)
>   expect(trie.startsWith('co')).toBe(false)
> })
>
> test('порожній префікс і порожнє слово', () => {
>   const trie = new Trie()
>   expect(trie.startsWith('')).toBe(true)
>   expect(trie.search('')).toBe(false)
>   trie.insert('')
>   expect(trie.search('')).toBe(true)
> })
>
> test('wordsWithPrefix — відсортовано, без дублікатів', () => {
>   const trie = new Trie()
>   for (const w of ['apply', 'app', 'apple', 'banana', 'app', 'ape']) trie.insert(w)
>   expect(trie.wordsWithPrefix('ap')).toEqual(['ape', 'app', 'apple', 'apply'])
>   expect(trie.wordsWithPrefix('app')).toEqual(['app', 'apple', 'apply'])
>   expect(trie.wordsWithPrefix('x')).toEqual([])
> })
>
> test('wordsWithPrefix з порожнім префіксом — усі слова', () => {
>   const trie = new Trie()
>   for (const w of ['b', 'a', 'c']) trie.insert(w)
>   expect(trie.wordsWithPrefix('')).toEqual(['a', 'b', 'c'])
> })
>
> test('кирилиця і регістр', () => {
>   const trie = new Trie()
>   trie.insert('кіт')
>   trie.insert('Кит')
>   expect(trie.search('кіт')).toBe(true)
>   expect(trie.search('кит')).toBe(false)
>   expect(trie.wordsWithPrefix('к')).toEqual(['кіт'])
> })
> ```
>
> > [!hint]- Підказка 1
> > Вузол: `{ children: new Map(), isWord: false }`. Корінь — порожній вузол.
>
> > [!hint]- Підказка 2
> > Спільний приватний метод `#find(prefix)` повертає вузол наприкінці шляху або `null` — на ньому будуються `search`, `startsWith` і `wordsWithPrefix` (далі DFS, збираючи шлях).
>
> > [!solution]- Еталонне рішення
> > ```js
> > class Trie {
> >   #root = { children: new Map(), isWord: false }
> >
> >   insert(word) {
> >     let node = this.#root
> >     for (const ch of word) {
> >       if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), isWord: false })
> >       node = node.children.get(ch)
> >     }
> >     node.isWord = true
> >   }
> >
> >   #find(prefix) {
> >     let node = this.#root
> >     for (const ch of prefix) {
> >       node = node.children.get(ch)
> >       if (!node) return null
> >     }
> >     return node
> >   }
> >
> >   search(word) {
> >     return this.#find(word)?.isWord ?? false
> >   }
> >
> >   startsWith(prefix) {
> >     return this.#find(prefix) !== null
> >   }
> >
> >   wordsWithPrefix(prefix) {
> >     const start = this.#find(prefix)
> >     if (!start) return []
> >     const words = []
> >     const visit = (node, path) => {
> >       if (node.isWord) words.push(path)
> >       for (const [ch, child] of node.children) visit(child, path + ch)
> >     }
> >     visit(start, prefix)
> >     return words.sort()
> >   }
> > }
> > ```
> > **Складність:** `insert`/`search`/`startsWith` — O(L); `wordsWithPrefix` — O(розміру піддерева + k log k на сортування). **Чому так:** `for…of` по рядку йде кодовими точками — емодзі не розпадуться на сурогати. `Map` дітей підтримує будь-який алфавіт. **Що спитають далі:** «автодоповнення з топ-5 за популярністю?» — зберігати лічильник у вузлі й кеш топ-k; «видалення слова?» — зняти `isWord` і підрізати порожні гілки знизу вгору; «пам'ять?» — стиснене дерево (radix tree).

> [!task] Pub/sub з wildcard-топіками
> level: senior · difficulty: hard · id: jsk-06-task-07 · tags: patterns, observer, recursion
>
> Напиши `createPubSub()`, що повертає `{ subscribe, publish }`. Топіки — сегменти через крапку (`user.login.success`).
>
> - `subscribe(pattern, handler)` → функція відписки. У патерні `*` — рівно **один** будь-який сегмент, `#` — **нуль або більше** сегментів (як у RabbitMQ topic exchange);
> - `publish(topic, data)` викликає всі обробники, чий патерн збігся, у порядку підписки, з аргументами `(data, topic)`; повертає **кількість** викликаних обробників.
>
> ```js starter
> function createPubSub() {
>   // твій код
> }
> ```
>
> ```js tests
> test('точний збіг', () => {
>   const bus = createPubSub()
>   const spy = vi.fn()
>   bus.subscribe('user.login', spy)
>   expect(bus.publish('user.login', { id: 1 })).toBe(1)
>   expect(spy).toHaveBeenCalledWith({ id: 1 }, 'user.login')
>   expect(bus.publish('user.logout', {})).toBe(0)
> })
>
> test('* — рівно один сегмент', () => {
>   const bus = createPubSub()
>   const seen = []
>   bus.subscribe('user.*', (_, topic) => seen.push(topic))
>   bus.publish('user.login')
>   bus.publish('user.login.success')
>   bus.publish('user')
>   bus.publish('admin.login')
>   expect(seen).toEqual(['user.login'])
> })
>
> test('* посередині', () => {
>   const bus = createPubSub()
>   const seen = []
>   bus.subscribe('order.*.paid', (_, topic) => seen.push(topic))
>   bus.publish('order.42.paid')
>   bus.publish('order.42.cancelled')
>   bus.publish('order.paid')
>   expect(seen).toEqual(['order.42.paid'])
> })
>
> test('# — нуль або більше сегментів', () => {
>   const bus = createPubSub()
>   const seen = []
>   bus.subscribe('user.#', (_, topic) => seen.push(topic))
>   bus.publish('user')
>   bus.publish('user.login')
>   bus.publish('user.login.success')
>   bus.publish('users.login')
>   expect(seen).toEqual(['user', 'user.login', 'user.login.success'])
> })
>
> test('# у середині і окремо', () => {
>   const bus = createPubSub()
>   const middle = []
>   const all = []
>   bus.subscribe('a.#.z', (_, topic) => middle.push(topic))
>   bus.subscribe('#', (_, topic) => all.push(topic))
>   for (const topic of ['a.z', 'a.b.z', 'a.b.c.z', 'a.b']) bus.publish(topic)
>   expect(middle).toEqual(['a.z', 'a.b.z', 'a.b.c.z'])
>   expect(all).toEqual(['a.z', 'a.b.z', 'a.b.c.z', 'a.b'])
> })
>
> test('порядок підписки і кількість', () => {
>   const bus = createPubSub()
>   const log = []
>   bus.subscribe('#', () => log.push('all'))
>   bus.subscribe('chat.message', () => log.push('exact'))
>   bus.subscribe('chat.*', () => log.push('star'))
>   expect(bus.publish('chat.message', 'hi')).toBe(3)
>   expect(log).toEqual(['all', 'exact', 'star'])
> })
>
> test('відписка', () => {
>   const bus = createPubSub()
>   const spy = vi.fn()
>   const unsubscribe = bus.subscribe('x.*', spy)
>   unsubscribe()
>   expect(bus.publish('x.y')).toBe(0)
>   expect(spy).toHaveBeenCalledTimes(0)
> })
> ```
>
> > [!hint]- Підказка 1
> > Розбий патерн і топік на сегменти й напиши рекурсивну `matches(patternParts, topicParts)`. Базовий випадок: порожній патерн збігається лише з порожнім топіком.
>
> > [!hint]- Підказка 2
> > Для `#` спробуй «з'їсти» 0, 1, 2, … сегментів топіка і рекурсивно зіставити решту патерну. Для `*` — рівно один сегмент.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function matches(pattern, topic, p = 0, t = 0) {
> >   if (p === pattern.length) return t === topic.length
> >   const head = pattern[p]
> >   if (head === '#') {
> >     for (let skip = t; skip <= topic.length; skip++) {
> >       if (matches(pattern, topic, p + 1, skip)) return true
> >     }
> >     return false
> >   }
> >   if (t === topic.length) return false
> >   return (head === '*' || head === topic[t]) && matches(pattern, topic, p + 1, t + 1)
> > }
> >
> > function createPubSub() {
> >   let subscriptions = []
> >
> >   function subscribe(pattern, handler) {
> >     const subscription = { parts: pattern.split('.'), handler }
> >     subscriptions.push(subscription)
> >     return () => {
> >       subscriptions = subscriptions.filter((s) => s !== subscription)
> >     }
> >   }
> >
> >   function publish(topic, data) {
> >     const parts = topic.split('.')
> >     let count = 0
> >     for (const { parts: pattern, handler } of subscriptions.slice()) {
> >       if (!matches(pattern, parts)) continue
> >       handler(data, topic)
> >       count++
> >     }
> >     return count
> >   }
> >
> >   return { subscribe, publish }
> > }
> > ```
> > **Складність:** `publish` — O(S · P · T) у гіршому випадку для S підписок (через `#` з перебором), зазвичай близько O(S · T). **Чому так:** рекурсія з індексами не створює нових масивів на кожному кроці; кожна підписка — окремий об'єкт, тож та сама функція може бути підписана на різні патерни й відписуватися незалежно. **Що спитають далі:** «мільйон підписок?» — дерево патернів (trie по сегментах) замість лінійного перебору; «мемоізація `#`?» — DP по `(p, t)`, як у задачі wildcard matching.

> [!task] Observable-lite
> level: senior · difficulty: hard · id: jsk-06-task-08 · tags: patterns, observer, streams
>
> Реалізуй клас `Observable` — мінімальний «холодний» потік у стилі RxJS:
>
> - `new Observable(subscribeFn)` — `subscribeFn(subscriber)` викликається **на кожен** `subscribe` (лінивість), отримує `subscriber` з методами `next`, `error`, `complete` і може повернути функцію очищення (teardown);
> - `subscribe(observer)` — `observer` це функція (`next`) або об'єкт з будь-якими з `next`/`error`/`complete`; повертає `{ unsubscribe() }`;
> - після `error` чи `complete` жодні події більше не доставляються, а teardown викликається **рівно раз** (навіть якщо завершення сталося синхронно всередині `subscribeFn`);
> - `unsubscribe()` зупиняє доставку і викликає teardown (повторно — нічого);
> - виняток у `subscribeFn` доставляється як `error`;
> - `map(fn)` і `filter(fn)` повертають новий `Observable`; виняток у `fn` стає `error`;
> - `Observable.of(...values)` — віддає значення синхронно й завершується.
>
> ```js starter
> class Observable {
>   constructor(subscribeFn) {
>     // твій код
>   }
>
>   subscribe(observer) {
>     // твій код
>   }
>
>   map(fn) {
>     // твій код
>   }
>
>   filter(fn) {
>     // твій код
>   }
>
>   static of(...values) {
>     // твій код
>   }
> }
> ```
>
> ```js tests
> test('лінивий і холодний: subscribeFn на кожну підписку', () => {
>   const subscribeFn = vi.fn((s) => s.next(1))
>   const source = new Observable(subscribeFn)
>   expect(subscribeFn).toHaveBeenCalledTimes(0)
>   source.subscribe(() => {})
>   source.subscribe(() => {})
>   expect(subscribeFn).toHaveBeenCalledTimes(2)
> })
>
> test('of + функція-спостерігач + complete', () => {
>   const values = []
>   const complete = vi.fn()
>   Observable.of(1, 2, 3).subscribe({ next: (v) => values.push(v), complete })
>   expect(values).toEqual([1, 2, 3])
>   expect(complete).toHaveBeenCalledTimes(1)
> })
>
> test('після complete нічого не доставляється, teardown — рівно раз', () => {
>   const teardown = vi.fn()
>   const values = []
>   const source = new Observable((s) => {
>     s.next('a')
>     s.complete()
>     s.next('b')
>     s.complete()
>     return teardown
>   })
>   const sub = source.subscribe((v) => values.push(v))
>   sub.unsubscribe()
>   expect(values).toEqual(['a'])
>   expect(teardown).toHaveBeenCalledTimes(1)
> })
>
> test('error зупиняє потік і йде в обробник', () => {
>   const error = vi.fn()
>   const complete = vi.fn()
>   const values = []
>   new Observable((s) => {
>     s.next(1)
>     s.error('boom')
>     s.next(2)
>     s.complete()
>   }).subscribe({ next: (v) => values.push(v), error, complete })
>   expect(values).toEqual([1])
>   expect(error).toHaveBeenCalledWith('boom')
>   expect(complete).toHaveBeenCalledTimes(0)
> })
>
> test('виняток у subscribeFn стає error', () => {
>   const error = vi.fn()
>   new Observable(() => { throw new Error('впало') }).subscribe({ error })
>   expect(error.mock.calls[0][0].message).toBe('впало')
> })
>
> test('unsubscribe зупиняє інтервал і викликає teardown', () => {
>   vi.useFakeTimers()
>   const values = []
>   const teardown = vi.fn()
>   const ticks = new Observable((s) => {
>     let n = 0
>     const id = setInterval(() => s.next(n++), 10)
>     return () => { teardown(); clearInterval(id) }
>   })
>   const sub = ticks.subscribe((v) => values.push(v))
>   vi.advanceTimersByTime(35)
>   sub.unsubscribe()
>   sub.unsubscribe()
>   vi.advanceTimersByTime(100)
>   expect(values).toEqual([0, 1, 2])
>   expect(teardown).toHaveBeenCalledTimes(1)
>   expect(vi.getTimerCount()).toBe(0)
> })
>
> test('map і filter ланцюжком', () => {
>   const values = []
>   const complete = vi.fn()
>   Observable.of(1, 2, 3, 4)
>     .filter((x) => x % 2 === 0)
>     .map((x) => x * 10)
>     .subscribe({ next: (v) => values.push(v), complete })
>   expect(values).toEqual([20, 40])
>   expect(complete).toHaveBeenCalledTimes(1)
> })
>
> test('виняток у map стає error і відписує джерело', () => {
>   const teardown = vi.fn()
>   const error = vi.fn()
>   const source = new Observable((s) => {
>     s.next(1)
>     s.next(2)
>     return teardown
>   })
>   source.map((x) => { if (x === 2) throw new Error('bad'); return x }).subscribe({ error })
>   expect(error).toHaveBeenCalledTimes(1)
>   expect(teardown).toHaveBeenCalledTimes(1)
> })
> ```
>
> > [!hint]- Підказка 1
> > Усередині `subscribe` тримай прапорець `closed` і `teardown`. `subscriber.next` перевіряє `closed`; `error`/`complete` ставлять `closed = true`, доставляють подію і викликають teardown.
>
> > [!hint]- Підказка 2
> > Якщо потік завершився синхронно, teardown ще невідомий, поки `subscribeFn` не повернувся. Після повернення: «якщо вже `closed` — одразу викликати teardown». Обгорни сам виклик teardown, щоб він спрацював не більше разу.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class Observable {
> >   constructor(subscribeFn) {
> >     this._subscribeFn = subscribeFn
> >   }
> >
> >   subscribe(observer = {}) {
> >     const handlers = typeof observer === 'function' ? { next: observer } : observer
> >     let closed = false
> >     let teardown = null
> >     const runTeardown = () => {
> >       const fn = teardown
> >       teardown = null
> >       if (fn) fn()
> >     }
> >     const subscriber = {
> >       next(value) {
> >         if (!closed) handlers.next?.(value)
> >       },
> >       error(err) {
> >         if (closed) return
> >         closed = true
> >         handlers.error?.(err)
> >         runTeardown()
> >       },
> >       complete() {
> >         if (closed) return
> >         closed = true
> >         handlers.complete?.()
> >         runTeardown()
> >       },
> >       get closed() {
> >         return closed
> >       },
> >     }
> >     try {
> >       const result = this._subscribeFn(subscriber)
> >       teardown = typeof result === 'function' ? result : null
> >     } catch (err) {
> >       subscriber.error(err)
> >     }
> >     if (closed) runTeardown()
> >     return {
> >       unsubscribe() {
> >         if (closed) return
> >         closed = true
> >         runTeardown()
> >       },
> >     }
> >   }
> >
> >   map(fn) {
> >     return this.#pipeThrough((value, out) => out.next(fn(value)))
> >   }
> >
> >   filter(fn) {
> >     return this.#pipeThrough((value, out) => {
> >       if (fn(value)) out.next(value)
> >     })
> >   }
> >
> >   #pipeThrough(onValue) {
> >     return new Observable((out) => {
> >       const subscription = this.subscribe({
> >         next(value) {
> >           try {
> >             onValue(value, out)
> >           } catch (err) {
> >             out.error(err)
> >           }
> >         },
> >         error: (err) => out.error(err),
> >         complete: () => out.complete(),
> >       })
> >       return () => subscription.unsubscribe()
> >     })
> >   }
> >
> >   static of(...values) {
> >     return new Observable((subscriber) => {
> >       for (const value of values) subscriber.next(value)
> >       subscriber.complete()
> >     })
> >   }
> > }
> > ```
> > **Складність:** O(1) на подію на кожен оператор. **Чому так:** прапорець `closed` — єдине джерело правди для «потік живий»; `runTeardown` обнуляє посилання і гарантує одноразовість. Оператор підписується на джерело всередині **нового** Observable — тому ланцюжки теж ліниві, а teardown нижнього потоку відписує верхній. **Що спитають далі:** «чим Observable відрізняється від Promise?» — ліниві, багато значень, скасовувані; «hot vs cold?» — Subject розсилає одне джерело багатьом; «`switchMap`?» — відписка від попереднього внутрішнього потоку на кожне нове значення.

## 🎤 На співбесіді

> [!interview] Як реалізувати LRU-кеш з O(1) без `Map` з порядком вставки?
> level: senior · frequency: часто · id: jsk-06-int-01
>
> ---
>
> Hashmap «ключ → вузол» плюс **двозв'язний список** вузлів за свіжістю з фіктивними `head`/`tail`. `get`: знайти вузол у hashmap за O(1), вирізати зі списку (O(1) завдяки `prev`/`next`) і вставити на початок. `put`: оновити або створити вузол на початку; при переповненні зняти вузол перед `tail` і видалити його ключ з hashmap. У JS `Map` вже гарантує порядок вставки, тож `delete` + `set` дає те саме. Варто згадати, що в реальному коді кеш потребує ще й TTL та обмеження за розміром у байтах.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви]] · [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

> [!interview] Чим EventEmitter, Observable і Promise відрізняються як моделі асинхронності?
> level: senior · frequency: часто · id: jsk-06-int-02
>
> ---
>
> Promise — **одне** значення в майбутньому, «гарячий» (робота стартує при створенні), не скасовується, помилка — частина моделі. EventEmitter — багато подій, «гарячий», немає поняття завершення чи помилки (крім домовленості про подію `'error'`), відписка вручну. Observable — багато значень, **лінивий і холодний** (кожна підписка запускає джерело заново), має `error`/`complete`, скасовується через `unsubscribe` з гарантованим teardown, компонується операторами (`map`, `filter`, `switchMap`). Тому Observable — природна модель для потоків подій UI і websocket-ів.
>
> 📚 [[JavaScript - 32. Патерни проєктування]] · [RxJS: Observable](https://rxjs.dev/guide/observable) · [TC39: Observable proposal](https://github.com/tc39/proposal-observable)

> [!interview] Як не допустити витоків пам'яті з підписками?
> level: middle · frequency: часто · id: jsk-06-int-03
>
> ---
>
> Кожна підписка тримає слухача, а слухач — своє замикання (компонент, DOM-вузли, великі дані). Якщо емітер живе довше за підписника — підписник ніколи не звільниться. Тому `subscribe` повертає функцію відписки, яку викликають у cleanup (`useEffect` return, `disconnectedCallback`, `AbortSignal` у `addEventListener`). Плюс: `once` для разових подій, ліміт слухачів з попередженням (як `setMaxListeners` у Node), видалення порожніх списків, `WeakRef` лише в рідкісних випадках.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття]] · [Node.js: Events](https://nodejs.org/api/events.html)

## ⚡ Фішки

> [!reel] 🗺️ Map — це вже LRU наполовину
> `Map` пам'ятає порядок вставки. `delete` + `set` переносить ключ у кінець, а `map.keys().next().value` — найстаріший. LRU у 15 рядків.

> [!reel] 🧊 Холодний Observable = функція
> Observable — по суті функція, що приймає спостерігача. Немає підписки — нічого не відбувається. Дві підписки — два незалежні запуски.

> [!reel] 🐇 RabbitMQ-маски: * і #
> У topic exchange `*` — рівно одне слово, `#` — нуль або більше. `logs.#` ловить і `logs`, і `logs.app.error`, а `logs.*` — лише `logs.app`.

## 🧠 Закріплення

> [!question]- Чому `shift()` — погана основа для черги?
> *часто · теорія* · `jsk-06-001`
>
> За специфікацією `shift` зсуває всі елементи на одну позицію — O(n), тож n операцій дають O(n²). Двоіндексне сховище (`head`/`tail`) чи зв'язний список дають O(1) на `dequeue`.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль]] · [MDN: Array.prototype.shift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)

> [!question]- Чому в `emit` треба ітерувати копію списку слухачів?
> *часто · код* · `jsk-06-002`
>
> Слухач може відписатися (або відписати іншого) посеред розсилки. Видалення з масиву під час `for` за індексом зсуває елементи, і наступний слухач буде пропущений. Знімок `slice()` фіксує список на момент `emit`.
>
> 📚 [[JavaScript - 32. Патерни проєктування]] · [Node.js: Events](https://nodejs.org/api/events.html)

> [!question]- Як `once` дає змогу відписатися через `off(event, original)`?
> *іноді · код* · `jsk-06-003`
>
> `once` реєструє обгортку, а оригінал зберігає у властивості обгортки (`wrapper.listener = listener`). `off` шукає слухача, у якого `l === listener || l.listener === listener`. Так зроблено і в Node.js.
>
> 📚 [[JavaScript - 05. Замикання]] · [GreatFrontEnd: Event Emitter](https://www.greatfrontend.com/questions/javascript/event-emitter)

> [!question]- Що таке Trie і де він корисний?
> *часто · теорія* · `jsk-06-004`
>
> Дерево, де кожне ребро — символ, а шлях від кореня — префікс. Пошук слова чи префікса — O(L) незалежно від кількості слів. Застосування: автодоповнення, перевірка орфографії, маршрутизація URL, IP-маршрутизація.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви]] · [GreatFrontEnd: Trie (Prefix Tree)](https://www.greatfrontend.com/questions/algo/trie-prefix-searching)

> [!question]- Які три принципи Redux відтворює `createStore`?
> *часто · теорія* · `jsk-06-005`
>
> Єдине джерело правди (один об'єкт стану), стан лише для читання (змінюється тільки через `dispatch` дії), зміни описуються **чистими** reducer-ами `(state, action) → newState`. Звідси заборона `dispatch` усередині reducer.
>
> 📚 [[JavaScript - 32. Патерни проєктування]] · [Redux: createStore](https://redux.js.org/api/createstore)

> [!question]- Що гарантує teardown в Observable?
> *іноді · теорія* · `jsk-06-006`
>
> Функція, повернена з `subscribeFn`, викликається рівно один раз — при `unsubscribe`, `complete` або `error`. Туди кладуть очищення ресурсів: `clearInterval`, `removeEventListener`, закриття сокета.
>
> 📚 [[JavaScript - 32. Патерни проєктування]] · [RxJS: Observable](https://rxjs.dev/guide/observable)

> [!question]- Чому LRU повертає `-1` через `has`, а не через `get(key) ?? -1`?
> *рідко · пастка* · `jsk-06-007`
>
> `??` спрацює і для збереженого `null`/`undefined`, повернувши `-1` замість значення; до того ж такий `get` не оновлює свіжість ключа. `has` чітко відрізняє «ключа немає».
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви]] · [MDN: Map.prototype.has()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has)

## 📚 Джерела та що почитати

- 🟢 [patterns.dev — Observer Pattern](https://www.patterns.dev/vanilla/observer-pattern) — патерн «спостерігач» з прикладами
- 🟡 [Node.js — Events](https://nodejs.org/api/events.html) — еталонний EventEmitter: `once`, `prependListener`, `'error'`
- 🟡 [Redux — createStore](https://redux.js.org/api/createstore) — контракт оригіналу
- 🟡 [RxJS — Observable](https://rxjs.dev/guide/observable) — pull vs push, холодні потоки, teardown
- 🔴 [TC39 — Observable proposal](https://github.com/tc39/proposal-observable) — семантика Observable як стандарту
- 🛠️ [GreatFrontEnd — Event Emitter](https://www.greatfrontend.com/questions/javascript/event-emitter) і [Event Emitter II](https://www.greatfrontend.com/questions/javascript/event-emitter-ii)
- 🛠️ [GreatFrontEnd — Trie (Prefix Tree)](https://www.greatfrontend.com/questions/algo/trie-prefix-searching) і [Queue](https://www.greatfrontend.com/questions/algo/queue)
- 🛠️ [BFE.dev — create an Event Emitter](https://bigfrontend.dev/problem/create-an-Event-Emitter)

> [!important] Підсумок
> - Спершу контракт (методи, повернення, складність), потім внутрішня структура.
> - `Map` з порядком вставки — основа LRU; черга — індекси `head`/`tail`, не `shift`.
> - Спостерігач: `subscribe` повертає відписку, розсилка по знімку списку.
> - Observable: лінивий, `closed` + одноразовий teardown; оператори — нові Observable.
> - Store: чистий reducer, заборона dispatch у reducer, сповіщення після кожної дії.
