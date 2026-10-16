---
title: Міні-стейт-менеджер
order: 5
level: middle
tags: [redux, reducers, middleware, selectors, time-travel]
prerequisites:
  - "[[JavaScript - 05. Замикання]]"
  - "[[JavaScript - 15. Функції глибоко]]"
  - "[[JavaScript - 32. Патерни проєктування]]"
estimatedMinutes: 110
id: jsp-ch-05
icon: "🗃️"
---

# JavaScript Projects - 05. Міні-стейт-менеджер

> [!success] 🎯 Після цього розділу ти зможеш
> - Написати `createStore` з `dispatch`, `subscribe` і підтримкою **enhancer**-ів — серце Redux у 40 рядках.
> - Скласти стан з незалежних слайсів через `combineReducers`, не ламаючи порівняння за посиланням.
> - Мемоізувати похідні дані **селекторами** і пояснити, коли вони перераховуються.
> - Зрозуміти «цибулю» **middleware** `store => next => action` і написати logger та thunk.
> - Додати **time travel**: undo, redo і перехід на будь-яку точку історії — higher-order reducer'ом.

## 🎯 Що збудуємо

Власний Redux: стор, слайси, селектори, middleware і devtools-подібну історію. Ти побачиш, що за «магією» популярного стейт-менеджера стоять кілька функцій вищого порядку і одне правило — **редьюсер чистий, стан імутабельний**.

> [!diagram] Одна дія крізь стор: middleware → reducer → state → UI
> ```yaml
> layout: flow
> nodes:
>   - { id: ui, label: "UI", text: "count: 0", tone: blue, icon: "px:monitor" }
>   - { id: thunk, label: "middleware · thunk", text: "функція? → виконати її", tone: gray }
>   - { id: logger, label: "middleware · logger", text: "log({ type, prev, next })", tone: gray }
>   - { id: reducer, label: "withHistory(combineReducers(…))", code: "(state, action) → newState", tone: violet }
>   - { id: state, label: "state", text: "{ counter: 0, todos: { past, present, future } }", tone: yellow, icon: "px:box" }
>   - { id: sel, label: "subscribe → createSelector", text: "selectDoneCount: перерахунків 1", tone: green }
> edges:
>   - { from: ui, to: thunk, label: "dispatch(action)" }
>   - { from: thunk, to: logger, label: "next" }
>   - { from: logger, to: reducer, label: "next" }
>   - { from: reducer, to: state, label: "newState" }
>   - { from: state, to: sel, label: "state !== prev" }
>   - { from: sel, to: ui, label: "render", dashed: true }
> steps:
>   - { move: { from: ui, to: thunk, value: "async (dispatch, getState, { wait }) => …" }, note: "Клік «+5 за секунду»: UI диспатчить не обʼєкт, а функцію. Стан UI не змінює — лише описує, що сталося." }
>   - { move: { from: thunk, to: logger, value: "{ type: 'counter/inc', by: 5 }" }, note: "Перший шар «цибулі» — thunk. Він бачить функцію, виконує її, а та після wait(1000) диспатчить звичайну дію-обʼєкт, яка йде далі по ланцюжку." }
>   - { move: { from: logger, to: reducer, value: "{ type: 'counter/inc', by: 5 }" }, note: "logger запам'ятовує prev і передає дію далі через next — аж до справжнього store.dispatch." }
>   - { move: { from: reducer, to: state, value: "newState" }, set: { state: "{ counter: 5, todos: той самий обʼєкт }" }, line: "reducer:1", note: "Чистий редьюсер повертає новий стан: counter 0 → 5. Слайс todos дію не впізнав і повернув той самий обʼєкт — structural sharing." }
>   - { set: { logger: "log({ type: 'counter/inc', prev: 0, next: 5 })" }, focus: logger, note: "Повертаючись назад крізь цибулю, logger бачить новий стан і пише запис «до → після»." }
>   - { move: { from: state, to: sel, value: "state !== prev" }, set: { sel: "selectDoneCount: перерахунків 1 (з кешу)" }, note: "Стан змінився — subscribe кличе render. Вхід селектора state.todos.present не змінився, тож результат береться з кешу без перерахунку." }
>   - { set: { ui: "count: 5" }, focus: [ui, state], note: "UI показує 5. Потік односпрямований: кожна зміна йде однією трубою, тож її можна логувати, відкладати й скасовувати через { past, present, future }." }
> ```

Потік **односпрямований**: UI не змінює стан — лише описує подію діями. Усі зміни проходять крізь одну трубу, тож їх можна логувати, відкладати, відтворювати і скасовувати.

## 🧭 План кроків

1. `createStore` — стан, `dispatch`, `subscribe`, enhancer. Теорія: [[JavaScript - 05. Замикання]].
2. `combineReducers` — слайси зі structural sharing. Теорія: [[JavaScript - 03. Значення та посилання]].
3. `createSelector` — мемоізовані похідні дані.
4. `applyMiddleware` — композиція «цибулею». Теорія: каррінг і композиція в [[JavaScript - 15. Функції глибоко]].
5. `createLogger` і `createThunk` — два класичні middleware. Теорія: [[JavaScript - 10. async і await]].
6. `withHistory` — time travel як higher-order reducer. Теорія: [[JavaScript - 32. Патерни проєктування]].

## 🧩 Розминка

> [!quiz] Заповни пропуски в сигнатурі middleware
> level: middle · type: fill · id: jsp-05-quiz-01 · bank: reduce, store.dispatch
>
> ```js fill
> const logger = ({ [[getState]] }) => (next) => (action) => {
>   const prev = getState()
>   const result = [[next]](action)
>   console.log(action.type, prev, getState())
>   return [[result]]
> }
>
> const dispatch = chain.[[reduceRight]]((next, mw) => mw(next), store.dispatch)
> ```
>
> **Пояснення:** middleware — каррі-функція з трьох рівнів: доступ до стору, наступна ланка, дія. `reduceRight` загортає `store.dispatch` починаючи з **останнього** middleware, тож перший у списку стає зовнішнім шаром «цибулі» і бачить дію першим.

> [!quiz] Склади мемоізований селектор
> level: middle · type: order · id: jsp-05-quiz-02
>
> ```js order
> function selector(state, ...rest) {
>   const args = inputs.map((fn) => fn(state, ...rest))
>   const same = lastArgs !== null && args.every((a, i) => Object.is(a, lastArgs[i]))
>   if (same) return lastResult
>   lastArgs = args
>   lastResult = resultFn(...args)
>   return lastResult
> }
>   const same = JSON.stringify(args) === JSON.stringify(lastArgs) // ✗
> ```
>
> **Пояснення:** порівнюємо **посилання** входів — O(k) і без серіалізації. Завдяки імутабельності «те саме посилання» означає «ті самі дані». `JSON.stringify` повільний, ламається на циклах і функціях і дає хибні збіги.

## 🛠️ Крок 1. createStore

Стор — замикання з трьома змінними: `state`, `listeners` і прапорець `dispatching`. Редьюсер — чиста функція `(state, action) => newState`. Стартова дія `@@INIT` дає кожному редьюсеру шанс повернути свій стан за замовчуванням. Третій аргумент — **enhancer**: функція, що отримує `createStore` і повертає «покращену» версію (так підключаються middleware і devtools).

> [!task] Крок 1 · createStore
> level: middle · difficulty: medium · id: jsp-05-task-01 · tags: closures, observer, reducers
>
> Напиши:
>
> - `isPlainObject(value)` — `true` для `{}` і `Object.create(null)`, `false` для масивів, класів, `null`, функцій;
> - `createStore(reducer, preloadedState, enhancer)`:
>   - `reducer` не функція → `TypeError`; якщо передано `enhancer` — поверни `enhancer(createStore)(reducer, preloadedState)`;
>   - одразу диспатчить `{ type: '@@INIT' }`;
>   - `dispatch(action)`: дія не простий об'єкт → `TypeError('Дія має бути простим об\'єктом')`; `type` не рядок → `TypeError('Дія має мати рядковий type')`; виклик з редьюсера → `Error('Редьюсер не може викликати dispatch')`. Повертає `action`;
>   - слухачі `subscribe(listener)` (→ відписка) викликаються після dispatch, **лише якщо стан змінився** (`!==`);
>   - `getState()`.
>
> ```js starter
> function isPlainObject(value) {
>   // твій код
> }
>
> function createStore(reducer, preloadedState, enhancer) {
>   // твій код
> }
> ```
>
> ```js tests
> const counter = (state = 0, action) => {
>   if (action.type === 'inc') return state + (action.by ?? 1)
>   if (action.type === 'reset') return 0
>   return state
> }
>
> test('початковий стан від редьюсера або preloadedState', () => {
>   expect(createStore(counter).getState()).toBe(0)
>   expect(createStore(counter, 10).getState()).toBe(10)
> })
>
> test('dispatch оновлює стан і повертає дію', () => {
>   const store = createStore(counter)
>   const action = { type: 'inc', by: 5 }
>   expect(store.dispatch(action)).toBe(action)
>   expect(store.getState()).toBe(5)
> })
>
> test('слухачі — лише при зміні стану; відписка', () => {
>   const store = createStore(counter)
>   const listener = vi.fn()
>   const unsubscribe = store.subscribe(listener)
>   store.dispatch({ type: 'inc' })
>   store.dispatch({ type: 'unknown' })
>   expect(listener).toHaveBeenCalledTimes(1)
>   unsubscribe()
>   store.dispatch({ type: 'inc' })
>   expect(listener).toHaveBeenCalledTimes(1)
> })
>
> test('валідація дій', () => {
>   const store = createStore(counter)
>   class Action { constructor() { this.type = 'inc' } }
>   expect(() => store.dispatch(new Action())).toThrow('простим об')
>   expect(() => store.dispatch([])).toThrow(TypeError)
>   expect(() => store.dispatch({ kind: 'inc' })).toThrow('рядковий type')
>   expect(isPlainObject(Object.create(null))).toBe(true)
>   expect(isPlainObject(null)).toBe(false)
> })
>
> test('dispatch з редьюсера заборонено', () => {
>   let store
>   const evil = (state = 0, action) => {
>     if (action.type === 'evil') store.dispatch({ type: 'inc' })
>     return state
>   }
>   store = createStore(evil)
>   expect(() => store.dispatch({ type: 'evil' })).toThrow('Редьюсер не може викликати dispatch')
>   expect(() => store.dispatch({ type: 'ok' })).not.toThrow()
> })
>
> test('enhancer отримує createStore', () => {
>   const enhancer = vi.fn((create) => (reducer, preloaded) => ({ ...create(reducer, preloaded), enhanced: true }))
>   const store = createStore(counter, 3, enhancer)
>   expect(store.enhanced).toBe(true)
>   expect(store.getState()).toBe(3)
>   expect(enhancer).toHaveBeenCalledWith(createStore)
>   expect(() => createStore('nope')).toThrow(TypeError)
> })
> ```
>
> > [!hint]- Підказка 1
> > `isPlainObject`: перевір `typeof value === 'object' && value !== null`, потім `Object.getPrototypeOf(value)` — це або `Object.prototype`, або `null`.
>
> > [!hint]- Підказка 2
> > Прапорець `dispatching` став у `true` перед викликом редьюсера і скидай у `finally` — інакше після помилки в редьюсері стор «зависне» назавжди.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function isPlainObject(value) {
> >   if (typeof value !== 'object' || value === null) return false
> >   const proto = Object.getPrototypeOf(value)
> >   return proto === Object.prototype || proto === null
> > }
> >
> > function createStore(reducer, preloadedState, enhancer) {
> >   if (typeof reducer !== 'function') throw new TypeError('reducer має бути функцією')
> >   if (enhancer !== undefined) return enhancer(createStore)(reducer, preloadedState)
> >
> >   let state = preloadedState
> >   const listeners = new Set()
> >   let dispatching = false
> >
> >   function dispatch(action) {
> >     if (!isPlainObject(action)) throw new TypeError('Дія має бути простим об\'єктом')
> >     if (typeof action.type !== 'string') throw new TypeError('Дія має мати рядковий type')
> >     if (dispatching) throw new Error('Редьюсер не може викликати dispatch')
> >     const prev = state
> >     try {
> >       dispatching = true
> >       state = reducer(state, action)
> >     } finally {
> >       dispatching = false
> >     }
> >     if (state !== prev) for (const listener of [...listeners]) listener()
> >     return action
> >   }
> >
> >   dispatch({ type: '@@INIT' })
> >
> >   return {
> >     getState: () => state,
> >     dispatch,
> >     subscribe(listener) {
> >       listeners.add(listener)
> >       return () => listeners.delete(listener)
> >     },
> >   }
> > }
> > ```
> > **Чому так:** дії — прості об'єкти, бо їх треба серіалізувати (логи, devtools, відправка на сервер); екземпляр класу чи функція цього не переживуть. Заборона `dispatch` з редьюсера зберігає редьюсер чистим і робить порядок змін передбачуваним. Сповіщення лише при зміні — наш вибір (Redux сповіщає завжди і покладається на селектори); він працює, бо редьюсери повертають **той самий** стан, коли дія їх не стосується.

## 🛠️ Крок 2. combineReducers

Один редьюсер на весь застосунок — це `switch` на тисячу рядків. `combineReducers` дає кожному **слайсу** стану власний редьюсер, а сам лише роздає їм шматки. Критично: якщо жоден слайс не змінився — повернути **той самий** об'єкт стану, інакше слухачі й селектори думатимуть, що змінилось усе.

> [!task] Крок 2 · combineReducers
> level: middle · difficulty: medium · id: jsp-05-task-02 · tags: reducers, structural-sharing
>
> Додай `combineReducers(reducers)` → редьюсер `(state = {}, action)`:
>
> - для кожного ключа викликає `reducers[key](state[key], action)` і збирає новий об'єкт;
> - слайс повернув `undefined` → `Error('Редьюсер "<key>" повернув undefined')`;
> - якщо жоден слайс не змінився (і набір ключів той самий) — повертає **вихідний** `state`.
>
> ```js starter
> function isPlainObject(value) {
>   if (typeof value !== 'object' || value === null) return false
>   const proto = Object.getPrototypeOf(value)
>   return proto === Object.prototype || proto === null
> }
>
> function createStore(reducer, preloadedState, enhancer) {
>   if (typeof reducer !== 'function') throw new TypeError('reducer має бути функцією')
>   if (enhancer !== undefined) return enhancer(createStore)(reducer, preloadedState)
>
>   let state = preloadedState
>   const listeners = new Set()
>   let dispatching = false
>
>   function dispatch(action) {
>     if (!isPlainObject(action)) throw new TypeError('Дія має бути простим об\'єктом')
>     if (typeof action.type !== 'string') throw new TypeError('Дія має мати рядковий type')
>     if (dispatching) throw new Error('Редьюсер не може викликати dispatch')
>     const prev = state
>     try {
>       dispatching = true
>       state = reducer(state, action)
>     } finally {
>       dispatching = false
>     }
>     if (state !== prev) for (const listener of [...listeners]) listener()
>     return action
>   }
>
>   dispatch({ type: '@@INIT' })
>
>   return {
>     getState: () => state,
>     dispatch,
>     subscribe(listener) {
>       listeners.add(listener)
>       return () => listeners.delete(listener)
>     },
>   }
> }
>
> function combineReducers(reducers) {
>   // твій код
> }
> ```
>
> ```js tests
> const counter = (state = 0, action) => (action.type === 'inc' ? state + 1 : state)
> const todos = (state = [], action) => (action.type === 'add' ? [...state, action.title] : state)
>
> test('збирає стан зі слайсів', () => {
>   const store = createStore(combineReducers({ counter, todos }))
>   expect(store.getState()).toEqual({ counter: 0, todos: [] })
>   store.dispatch({ type: 'add', title: 'x' })
>   expect(store.getState()).toEqual({ counter: 0, todos: ['x'] })
> })
>
> test('незмінені слайси — ті самі посилання', () => {
>   const reducer = combineReducers({ counter, todos })
>   const s1 = reducer(undefined, { type: '@@INIT' })
>   const s2 = reducer(s1, { type: 'inc' })
>   expect(s2).not.toBe(s1)
>   expect(s2.todos).toBe(s1.todos)
> })
>
> test('дія, що нікого не стосується, повертає той самий стан', () => {
>   const reducer = combineReducers({ counter, todos })
>   const s1 = reducer(undefined, { type: '@@INIT' })
>   expect(reducer(s1, { type: 'noop' })).toBe(s1)
> })
>
> test('undefined від слайсу — помилка', () => {
>   const broken = (state, action) => (action.type === 'boom' ? undefined : state ?? 1)
>   const reducer = combineReducers({ broken })
>   const s1 = reducer(undefined, { type: '@@INIT' })
>   expect(() => reducer(s1, { type: 'boom' })).toThrow('Редьюсер "broken" повернув undefined')
> })
>
> test('зайві ключі з preloadedState прибираються', () => {
>   const reducer = combineReducers({ counter })
>   const next = reducer({ counter: 5, legacy: true }, { type: 'noop' })
>   expect(next).toEqual({ counter: 5 })
> })
> ```
>
> > [!hint]- Підказка 1
> > `const keys = Object.keys(reducers)`, у циклі — `next[key] = value` і прапорець `changed`, якщо `value !== state[key]`.
>
> > [!hint]- Підказка 2
> > Не забудь випадок «зайвих ключів»: `changed ||= Object.keys(state).length !== keys.length`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function isPlainObject(value) {
> >   if (typeof value !== 'object' || value === null) return false
> >   const proto = Object.getPrototypeOf(value)
> >   return proto === Object.prototype || proto === null
> > }
> >
> > function createStore(reducer, preloadedState, enhancer) {
> >   if (typeof reducer !== 'function') throw new TypeError('reducer має бути функцією')
> >   if (enhancer !== undefined) return enhancer(createStore)(reducer, preloadedState)
> >
> >   let state = preloadedState
> >   const listeners = new Set()
> >   let dispatching = false
> >
> >   function dispatch(action) {
> >     if (!isPlainObject(action)) throw new TypeError('Дія має бути простим об\'єктом')
> >     if (typeof action.type !== 'string') throw new TypeError('Дія має мати рядковий type')
> >     if (dispatching) throw new Error('Редьюсер не може викликати dispatch')
> >     const prev = state
> >     try {
> >       dispatching = true
> >       state = reducer(state, action)
> >     } finally {
> >       dispatching = false
> >     }
> >     if (state !== prev) for (const listener of [...listeners]) listener()
> >     return action
> >   }
> >
> >   dispatch({ type: '@@INIT' })
> >
> >   return {
> >     getState: () => state,
> >     dispatch,
> >     subscribe(listener) {
> >       listeners.add(listener)
> >       return () => listeners.delete(listener)
> >     },
> >   }
> > }
> >
> > function combineReducers(reducers) {
> >   const keys = Object.keys(reducers)
> >   return function combination(state = {}, action) {
> >     let changed = Object.keys(state).length !== keys.length
> >     const next = {}
> >     for (const key of keys) {
> >       const prev = state[key]
> >       const value = reducers[key](prev, action)
> >       if (value === undefined) throw new Error(`Редьюсер "${key}" повернув undefined`)
> >       next[key] = value
> >       if (value !== prev) changed = true
> >     }
> >     return changed ? next : state
> >   }
> > }
> > ```
> > **Чому так:** кожен слайс отримує **лише свою** частину стану — редьюсери ізольовані й тестуються окремо, команди не наступають одна одній на ноги. Повернення того самого `state` при відсутності змін — ланка ланцюжка «посилання змінилось ⇔ дані змінились», на якому стоять сповіщення стору і мемоізовані селектори. `undefined` заборонений, бо це майже завжди забутий `return state` у гілці `default`.

## 🛠️ Крок 3. Мемоізовані селектори

Похідні дані («виконані задачі», «сума кошика») не зберігаємо в стані — обчислюємо селекторами. Але `filter` на кожен рендер створює **новий масив**, і UI думає, що дані змінились. `createSelector` перераховує результат, лише коли змінились **входи** (за посиланням).

> [!task] Крок 3 · createSelector
> level: middle · difficulty: medium · id: jsp-05-task-03 · tags: memoization, selectors
>
> Додай `createSelector(...inputSelectors, resultFn)`:
>
> - повертає `selector(state, ...rest)`: кожен вхідний селектор отримує `(state, ...rest)`;
> - якщо всі входи `Object.is`-рівні попереднім — повертає **попередній** результат без виклику `resultFn`;
> - інакше викликає `resultFn(...входи)` і запам'ятовує;
> - `selector.recomputations` — скільки разів викликався `resultFn`.
>
> ```js starter
> function isPlainObject(value) {
>   if (typeof value !== 'object' || value === null) return false
>   const proto = Object.getPrototypeOf(value)
>   return proto === Object.prototype || proto === null
> }
>
> function createStore(reducer, preloadedState, enhancer) {
>   if (typeof reducer !== 'function') throw new TypeError('reducer має бути функцією')
>   if (enhancer !== undefined) return enhancer(createStore)(reducer, preloadedState)
>
>   let state = preloadedState
>   const listeners = new Set()
>   let dispatching = false
>
>   function dispatch(action) {
>     if (!isPlainObject(action)) throw new TypeError('Дія має бути простим об\'єктом')
>     if (typeof action.type !== 'string') throw new TypeError('Дія має мати рядковий type')
>     if (dispatching) throw new Error('Редьюсер не може викликати dispatch')
>     const prev = state
>     try {
>       dispatching = true
>       state = reducer(state, action)
>     } finally {
>       dispatching = false
>     }
>     if (state !== prev) for (const listener of [...listeners]) listener()
>     return action
>   }
>
>   dispatch({ type: '@@INIT' })
>
>   return {
>     getState: () => state,
>     dispatch,
>     subscribe(listener) {
>       listeners.add(listener)
>       return () => listeners.delete(listener)
>     },
>   }
> }
>
> function combineReducers(reducers) {
>   const keys = Object.keys(reducers)
>   return function combination(state = {}, action) {
>     let changed = Object.keys(state).length !== keys.length
>     const next = {}
>     for (const key of keys) {
>       const prev = state[key]
>       const value = reducers[key](prev, action)
>       if (value === undefined) throw new Error(`Редьюсер "${key}" повернув undefined`)
>       next[key] = value
>       if (value !== prev) changed = true
>     }
>     return changed ? next : state
>   }
> }
>
> function createSelector(...fns) {
>   // твій код
> }
> ```
>
> ```js tests
> const selectTodos = (state) => state.todos
> const selectDone = createSelector(selectTodos, (todos) => todos.filter((t) => t.done))
>
> test('обчислює похідні дані', () => {
>   const state = { todos: [{ id: 1, done: true }, { id: 2, done: false }], filter: 'all' }
>   expect(selectDone(state)).toEqual([{ id: 1, done: true }])
> })
>
> test('ті самі входи — той самий результат без перерахунку', () => {
>   const select = createSelector(selectTodos, (todos) => todos.filter((t) => t.done))
>   const todos = [{ id: 1, done: true }]
>   const a = select({ todos, filter: 'all' })
>   const b = select({ todos, filter: 'done' })
>   expect(b).toBe(a)
>   expect(select.recomputations).toBe(1)
> })
>
> test('зміна входу — перерахунок', () => {
>   const select = createSelector(selectTodos, (todos) => todos.length)
>   select({ todos: [1] })
>   select({ todos: [1] })
>   expect(select.recomputations).toBe(2)
> })
>
> test('кілька входів і додаткові аргументи', () => {
>   const selectById = createSelector(
>     (state) => state.users,
>     (state, id) => id,
>     (users, id) => users.find((u) => u.id === id)?.name,
>   )
>   const state = { users: [{ id: 1, name: 'Оля' }, { id: 2, name: 'Петро' }] }
>   expect(selectById(state, 2)).toBe('Петро')
>   expect(selectById(state, 2)).toBe('Петро')
>   expect(selectById.recomputations).toBe(1)
>   expect(selectById(state, 1)).toBe('Оля')
>   expect(selectById.recomputations).toBe(2)
> })
>
> test('селектори композиційні', () => {
>   const selectCount = createSelector(selectDone, (done) => done.length)
>   const state = { todos: [{ done: true }, { done: true }] }
>   expect(selectCount(state)).toBe(2)
>   expect(selectCount(state)).toBe(2)
>   expect(selectCount.recomputations).toBe(1)
> })
> ```
>
> > [!hint]- Підказка 1
> > `const resultFn = fns.at(-1)`, `const inputs = fns.slice(0, -1)`. Замість стрілки оголоси `function selector(state, ...rest)` — так зручно додати їй властивість `recomputations`.
>
> > [!hint]- Підказка 2
> > Зберігай `lastArgs` (масив значень входів) і `lastResult`. Порівняння — `args.every((a, i) => Object.is(a, lastArgs[i]))`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function isPlainObject(value) {
> >   if (typeof value !== 'object' || value === null) return false
> >   const proto = Object.getPrototypeOf(value)
> >   return proto === Object.prototype || proto === null
> > }
> >
> > function createStore(reducer, preloadedState, enhancer) {
> >   if (typeof reducer !== 'function') throw new TypeError('reducer має бути функцією')
> >   if (enhancer !== undefined) return enhancer(createStore)(reducer, preloadedState)
> >
> >   let state = preloadedState
> >   const listeners = new Set()
> >   let dispatching = false
> >
> >   function dispatch(action) {
> >     if (!isPlainObject(action)) throw new TypeError('Дія має бути простим об\'єктом')
> >     if (typeof action.type !== 'string') throw new TypeError('Дія має мати рядковий type')
> >     if (dispatching) throw new Error('Редьюсер не може викликати dispatch')
> >     const prev = state
> >     try {
> >       dispatching = true
> >       state = reducer(state, action)
> >     } finally {
> >       dispatching = false
> >     }
> >     if (state !== prev) for (const listener of [...listeners]) listener()
> >     return action
> >   }
> >
> >   dispatch({ type: '@@INIT' })
> >
> >   return {
> >     getState: () => state,
> >     dispatch,
> >     subscribe(listener) {
> >       listeners.add(listener)
> >       return () => listeners.delete(listener)
> >     },
> >   }
> > }
> >
> > function combineReducers(reducers) {
> >   const keys = Object.keys(reducers)
> >   return function combination(state = {}, action) {
> >     let changed = Object.keys(state).length !== keys.length
> >     const next = {}
> >     for (const key of keys) {
> >       const prev = state[key]
> >       const value = reducers[key](prev, action)
> >       if (value === undefined) throw new Error(`Редьюсер "${key}" повернув undefined`)
> >       next[key] = value
> >       if (value !== prev) changed = true
> >     }
> >     return changed ? next : state
> >   }
> > }
> >
> > function createSelector(...fns) {
> >   const resultFn = fns.at(-1)
> >   const inputs = fns.slice(0, -1)
> >   let lastArgs = null
> >   let lastResult
> >
> >   function selector(state, ...rest) {
> >     const args = inputs.map((input) => input(state, ...rest))
> >     const same = lastArgs !== null && args.every((arg, i) => Object.is(arg, lastArgs[i]))
> >     if (same) return lastResult
> >     selector.recomputations++
> >     lastArgs = args
> >     lastResult = resultFn(...args)
> >     return lastResult
> >   }
> >
> >   selector.recomputations = 0
> >   return selector
> > }
> > ```
> > **Чому так:** мемоізація за посиланнями входів працює **лише** завдяки імутабельності: той самий масив `todos` гарантує ті самі дані. Повернення того самого результату важливе не лише для швидкості — React-компонент з `useSelector` не перемалюється, бо `===` нового і старого результату дає `true`. Кеш розміром 1 — свідомий вибір reselect: він дешевий, але селектор з різними аргументами (як `selectById(state, 1)` / `(state, 2)` по черзі) щоразу перераховується.

## 🛠️ Крок 4. applyMiddleware

Middleware — це «цибуля» навколо `dispatch`: кожен шар бачить дію, може її змінити, затримати, проковтнути або передати далі через `next`. Сигнатура `store => next => action` — каррінг: рівень стору налаштовується раз, рівень `next` — при складанні ланцюжка, рівень дії — на кожен dispatch.

> [!task] Крок 4 · applyMiddleware
> level: senior · difficulty: hard · id: jsp-05-task-04 · tags: middleware, composition, currying
>
> Додай `applyMiddleware(...middlewares)` → enhancer `(createStore) => (reducer, preloadedState) => store`:
>
> - створює звичайний стор і повертає його копію з новим `dispatch`;
> - кожен middleware отримує `api = { getState, dispatch }`, де `api.dispatch` проходить **крізь увесь ланцюжок** (а не лише базовий dispatch);
> - ланцюжок складається так, що **перший** middleware бачить дію першим;
> - виклик `api.dispatch` під час побудови ланцюжка (на рівні `store => …`) → `Error('dispatch під час побудови middleware заборонено')`.
>
> ```js starter
> function isPlainObject(value) {
>   if (typeof value !== 'object' || value === null) return false
>   const proto = Object.getPrototypeOf(value)
>   return proto === Object.prototype || proto === null
> }
>
> function createStore(reducer, preloadedState, enhancer) {
>   if (typeof reducer !== 'function') throw new TypeError('reducer має бути функцією')
>   if (enhancer !== undefined) return enhancer(createStore)(reducer, preloadedState)
>
>   let state = preloadedState
>   const listeners = new Set()
>   let dispatching = false
>
>   function dispatch(action) {
>     if (!isPlainObject(action)) throw new TypeError('Дія має бути простим об\'єктом')
>     if (typeof action.type !== 'string') throw new TypeError('Дія має мати рядковий type')
>     if (dispatching) throw new Error('Редьюсер не може викликати dispatch')
>     const prev = state
>     try {
>       dispatching = true
>       state = reducer(state, action)
>     } finally {
>       dispatching = false
>     }
>     if (state !== prev) for (const listener of [...listeners]) listener()
>     return action
>   }
>
>   dispatch({ type: '@@INIT' })
>
>   return {
>     getState: () => state,
>     dispatch,
>     subscribe(listener) {
>       listeners.add(listener)
>       return () => listeners.delete(listener)
>     },
>   }
> }
>
> function combineReducers(reducers) {
>   const keys = Object.keys(reducers)
>   return function combination(state = {}, action) {
>     let changed = Object.keys(state).length !== keys.length
>     const next = {}
>     for (const key of keys) {
>       const prev = state[key]
>       const value = reducers[key](prev, action)
>       if (value === undefined) throw new Error(`Редьюсер "${key}" повернув undefined`)
>       next[key] = value
>       if (value !== prev) changed = true
>     }
>     return changed ? next : state
>   }
> }
>
> function createSelector(...fns) {
>   const resultFn = fns.at(-1)
>   const inputs = fns.slice(0, -1)
>   let lastArgs = null
>   let lastResult
>
>   function selector(state, ...rest) {
>     const args = inputs.map((input) => input(state, ...rest))
>     const same = lastArgs !== null && args.every((arg, i) => Object.is(arg, lastArgs[i]))
>     if (same) return lastResult
>     selector.recomputations++
>     lastArgs = args
>     lastResult = resultFn(...args)
>     return lastResult
>   }
>
>   selector.recomputations = 0
>   return selector
> }
>
> function applyMiddleware(...middlewares) {
>   // твій код
> }
> ```
>
> ```js tests
> const counter = (state = 0, action) => (action.type === 'inc' ? state + (action.by ?? 1) : state)
>
> test('порядок «цибулі»', () => {
>   const log = []
>   const mw = (name) => () => (next) => (action) => {
>     log.push(`${name}>`)
>     const result = next(action)
>     log.push(`<${name}`)
>     return result
>   }
>   const store = createStore(counter, undefined, applyMiddleware(mw('A'), mw('B')))
>   store.dispatch({ type: 'inc' })
>   expect(log).toEqual(['A>', 'B>', '<B', '<A'])
>   expect(store.getState()).toBe(1)
> })
>
> test('middleware може змінити дію', () => {
>   const double = () => (next) => (action) => next(action.type === 'inc' ? { ...action, by: (action.by ?? 1) * 2 } : action)
>   const store = createStore(counter, undefined, applyMiddleware(double))
>   store.dispatch({ type: 'inc', by: 3 })
>   expect(store.getState()).toBe(6)
> })
>
> test('middleware може проковтнути дію', () => {
>   const blockAll = () => () => () => 'заблоковано'
>   const store = createStore(counter, undefined, applyMiddleware(blockAll))
>   expect(store.dispatch({ type: 'inc' })).toBe('заблоковано')
>   expect(store.getState()).toBe(0)
> })
>
> test('api.dispatch проходить крізь увесь ланцюжок', () => {
>   const seen = []
>   const spy = () => (next) => (action) => {
>     seen.push(action.type)
>     return next(action)
>   }
>   const expand = ({ dispatch }) => (next) => (action) => {
>     if (action.type === 'twice') {
>       dispatch({ type: 'inc' })
>       return dispatch({ type: 'inc' })
>     }
>     return next(action)
>   }
>   const store = createStore(counter, undefined, applyMiddleware(spy, expand))
>   store.dispatch({ type: 'twice' })
>   expect(store.getState()).toBe(2)
>   expect(seen).toEqual(['twice', 'inc', 'inc'])
> })
>
> test('getState і заборона dispatch під час побудови', () => {
>   let seenState
>   const peek = ({ getState }) => (next) => (action) => {
>     const result = next(action)
>     seenState = getState()
>     return result
>   }
>   const store = createStore(counter, 10, applyMiddleware(peek))
>   store.dispatch({ type: 'inc' })
>   expect(seenState).toBe(11)
>   const eager = ({ dispatch }) => {
>     dispatch({ type: 'inc' })
>     return (next) => next
>   }
>   expect(() => createStore(counter, undefined, applyMiddleware(eager))).toThrow('dispatch під час побудови middleware заборонено')
> })
> ```
>
> > [!hint]- Підказка 1
> > Спершу `let dispatch = () => { throw … }`, а в `api` поклади **стрілку** `(action) => dispatch(action)` — вона прочитає змінну `dispatch` у момент виклику, коли там уже буде готовий ланцюжок.
>
> > [!hint]- Підказка 2
> > `const chain = middlewares.map((mw) => mw(api))`, потім `dispatch = chain.reduceRight((next, mw) => mw(next), store.dispatch)`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function isPlainObject(value) {
> >   if (typeof value !== 'object' || value === null) return false
> >   const proto = Object.getPrototypeOf(value)
> >   return proto === Object.prototype || proto === null
> > }
> >
> > function createStore(reducer, preloadedState, enhancer) {
> >   if (typeof reducer !== 'function') throw new TypeError('reducer має бути функцією')
> >   if (enhancer !== undefined) return enhancer(createStore)(reducer, preloadedState)
> >
> >   let state = preloadedState
> >   const listeners = new Set()
> >   let dispatching = false
> >
> >   function dispatch(action) {
> >     if (!isPlainObject(action)) throw new TypeError('Дія має бути простим об\'єктом')
> >     if (typeof action.type !== 'string') throw new TypeError('Дія має мати рядковий type')
> >     if (dispatching) throw new Error('Редьюсер не може викликати dispatch')
> >     const prev = state
> >     try {
> >       dispatching = true
> >       state = reducer(state, action)
> >     } finally {
> >       dispatching = false
> >     }
> >     if (state !== prev) for (const listener of [...listeners]) listener()
> >     return action
> >   }
> >
> >   dispatch({ type: '@@INIT' })
> >
> >   return {
> >     getState: () => state,
> >     dispatch,
> >     subscribe(listener) {
> >       listeners.add(listener)
> >       return () => listeners.delete(listener)
> >     },
> >   }
> > }
> >
> > function combineReducers(reducers) {
> >   const keys = Object.keys(reducers)
> >   return function combination(state = {}, action) {
> >     let changed = Object.keys(state).length !== keys.length
> >     const next = {}
> >     for (const key of keys) {
> >       const prev = state[key]
> >       const value = reducers[key](prev, action)
> >       if (value === undefined) throw new Error(`Редьюсер "${key}" повернув undefined`)
> >       next[key] = value
> >       if (value !== prev) changed = true
> >     }
> >     return changed ? next : state
> >   }
> > }
> >
> > function createSelector(...fns) {
> >   const resultFn = fns.at(-1)
> >   const inputs = fns.slice(0, -1)
> >   let lastArgs = null
> >   let lastResult
> >
> >   function selector(state, ...rest) {
> >     const args = inputs.map((input) => input(state, ...rest))
> >     const same = lastArgs !== null && args.every((arg, i) => Object.is(arg, lastArgs[i]))
> >     if (same) return lastResult
> >     selector.recomputations++
> >     lastArgs = args
> >     lastResult = resultFn(...args)
> >     return lastResult
> >   }
> >
> >   selector.recomputations = 0
> >   return selector
> > }
> >
> > function applyMiddleware(...middlewares) {
> >   return (createStore) => (reducer, preloadedState) => {
> >     const store = createStore(reducer, preloadedState)
> >     let dispatch = () => {
> >       throw new Error('dispatch під час побудови middleware заборонено')
> >     }
> >     const api = {
> >       getState: store.getState,
> >       dispatch: (action, ...args) => dispatch(action, ...args),
> >     }
> >     const chain = middlewares.map((middleware) => middleware(api))
> >     dispatch = chain.reduceRight((next, middleware) => middleware(next), store.dispatch)
> >     return { ...store, dispatch }
> >   }
> > }
> > ```
> > **Чому так:** `reduceRight` — це `compose`: `A(B(store.dispatch))`, тож `A` — зовнішній шар і бачить дію першим, а `next` у `B` — справжній `dispatch`. Стрілка в `api.dispatch` — пізнє зв'язування через замикання: middleware отримують посилання ще до того, як ланцюжок зібраний, але викликають уже готовий. Тому `dispatch` зсередини middleware (як у thunk) проходить крізь **усі** шари, включно з логером.

## 🛠️ Крок 5. Logger і thunk

Два middleware, що пояснюють, навіщо взагалі «цибуля». **Logger** бачить стан до і після кожної дії — основа devtools. **Thunk** дозволяє диспатчити **функції**: асинхронна логіка («завантаж, потім збережи») живе поза редьюсерами, які мусять лишатися чистими.

> [!task] Крок 5 · createLogger і createThunk
> level: middle · difficulty: medium · id: jsp-05-task-05 · tags: middleware, async, thunk
>
> Додай:
>
> - `createLogger(log = console.log)` → middleware, що після кожної дії викликає `log({ type, prev, next })` (стан до і після) і повертає результат `next`;
> - `createThunk(extra)` → middleware: якщо дія — функція, викликає `action(dispatch, getState, extra)` і повертає її результат (не передаючи далі); інакше — `next(action)`.
>
> ```js starter
> function isPlainObject(value) {
>   if (typeof value !== 'object' || value === null) return false
>   const proto = Object.getPrototypeOf(value)
>   return proto === Object.prototype || proto === null
> }
>
> function createStore(reducer, preloadedState, enhancer) {
>   if (typeof reducer !== 'function') throw new TypeError('reducer має бути функцією')
>   if (enhancer !== undefined) return enhancer(createStore)(reducer, preloadedState)
>
>   let state = preloadedState
>   const listeners = new Set()
>   let dispatching = false
>
>   function dispatch(action) {
>     if (!isPlainObject(action)) throw new TypeError('Дія має бути простим об\'єктом')
>     if (typeof action.type !== 'string') throw new TypeError('Дія має мати рядковий type')
>     if (dispatching) throw new Error('Редьюсер не може викликати dispatch')
>     const prev = state
>     try {
>       dispatching = true
>       state = reducer(state, action)
>     } finally {
>       dispatching = false
>     }
>     if (state !== prev) for (const listener of [...listeners]) listener()
>     return action
>   }
>
>   dispatch({ type: '@@INIT' })
>
>   return {
>     getState: () => state,
>     dispatch,
>     subscribe(listener) {
>       listeners.add(listener)
>       return () => listeners.delete(listener)
>     },
>   }
> }
>
> function combineReducers(reducers) {
>   const keys = Object.keys(reducers)
>   return function combination(state = {}, action) {
>     let changed = Object.keys(state).length !== keys.length
>     const next = {}
>     for (const key of keys) {
>       const prev = state[key]
>       const value = reducers[key](prev, action)
>       if (value === undefined) throw new Error(`Редьюсер "${key}" повернув undefined`)
>       next[key] = value
>       if (value !== prev) changed = true
>     }
>     return changed ? next : state
>   }
> }
>
> function createSelector(...fns) {
>   const resultFn = fns.at(-1)
>   const inputs = fns.slice(0, -1)
>   let lastArgs = null
>   let lastResult
>
>   function selector(state, ...rest) {
>     const args = inputs.map((input) => input(state, ...rest))
>     const same = lastArgs !== null && args.every((arg, i) => Object.is(arg, lastArgs[i]))
>     if (same) return lastResult
>     selector.recomputations++
>     lastArgs = args
>     lastResult = resultFn(...args)
>     return lastResult
>   }
>
>   selector.recomputations = 0
>   return selector
> }
>
> function applyMiddleware(...middlewares) {
>   return (createStore) => (reducer, preloadedState) => {
>     const store = createStore(reducer, preloadedState)
>     let dispatch = () => {
>       throw new Error('dispatch під час побудови middleware заборонено')
>     }
>     const api = {
>       getState: store.getState,
>       dispatch: (action, ...args) => dispatch(action, ...args),
>     }
>     const chain = middlewares.map((middleware) => middleware(api))
>     dispatch = chain.reduceRight((next, middleware) => middleware(next), store.dispatch)
>     return { ...store, dispatch }
>   }
> }
>
> function createLogger(log = console.log) {
>   // твій код
> }
>
> function createThunk(extra) {
>   // твій код
> }
> ```
>
> ```js tests
> const counter = (state = 0, action) => (action.type === 'inc' ? state + (action.by ?? 1) : state)
>
> test('logger фіксує стан до і після', () => {
>   const entries = []
>   const store = createStore(counter, 0, applyMiddleware(createLogger((e) => entries.push(e))))
>   store.dispatch({ type: 'inc', by: 2 })
>   expect(entries).toEqual([{ type: 'inc', prev: 0, next: 2 }])
> })
>
> test('thunk викликає функцію з dispatch, getState і extra', () => {
>   const api = { name: 'fake-api' }
>   const store = createStore(counter, 5, applyMiddleware(createThunk(api)))
>   const result = store.dispatch((dispatch, getState, extra) => {
>     dispatch({ type: 'inc', by: getState() })
>     return extra.name
>   })
>   expect(result).toBe('fake-api')
>   expect(store.getState()).toBe(10)
> })
>
> test('асинхронний thunk', async () => {
>   const store = createStore(counter, 0, applyMiddleware(createThunk()))
>   const loadAndInc = () => async (dispatch) => {
>     await Promise.resolve()
>     dispatch({ type: 'inc', by: 7 })
>     return 'done'
>   }
>   const promise = store.dispatch(loadAndInc())
>   expect(store.getState()).toBe(0)
>   await expect(promise).resolves.toBe('done')
>   expect(store.getState()).toBe(7)
> })
>
> test('thunk першим: logger бачить лише справжні дії', () => {
>   const entries = []
>   const store = createStore(counter, 0, applyMiddleware(createThunk(), createLogger((e) => entries.push(e.type))))
>   store.dispatch((dispatch) => {
>     dispatch({ type: 'inc' })
>     dispatch({ type: 'inc' })
>   })
>   expect(entries).toEqual(['inc', 'inc'])
>   expect(store.getState()).toBe(2)
> })
>
> test('без thunk функція — не дія', () => {
>   const store = createStore(counter)
>   expect(() => store.dispatch(() => {})).toThrow(TypeError)
> })
> ```
>
> > [!hint]- Підказка 1
> > Logger: `({ getState }) => (next) => (action) => { const prev = getState(); const result = next(action); log({ type: action.type, prev, next: getState() }); return result }`.
>
> > [!hint]- Підказка 2
> > Thunk використовує **`dispatch` з api**, а не `next`: так дії, які диспатчить функція, пройдуть увесь ланцюжок (і logger їх побачить).
>
> > [!solution]- Еталонне рішення
> > ```js
> > function isPlainObject(value) {
> >   if (typeof value !== 'object' || value === null) return false
> >   const proto = Object.getPrototypeOf(value)
> >   return proto === Object.prototype || proto === null
> > }
> >
> > function createStore(reducer, preloadedState, enhancer) {
> >   if (typeof reducer !== 'function') throw new TypeError('reducer має бути функцією')
> >   if (enhancer !== undefined) return enhancer(createStore)(reducer, preloadedState)
> >
> >   let state = preloadedState
> >   const listeners = new Set()
> >   let dispatching = false
> >
> >   function dispatch(action) {
> >     if (!isPlainObject(action)) throw new TypeError('Дія має бути простим об\'єктом')
> >     if (typeof action.type !== 'string') throw new TypeError('Дія має мати рядковий type')
> >     if (dispatching) throw new Error('Редьюсер не може викликати dispatch')
> >     const prev = state
> >     try {
> >       dispatching = true
> >       state = reducer(state, action)
> >     } finally {
> >       dispatching = false
> >     }
> >     if (state !== prev) for (const listener of [...listeners]) listener()
> >     return action
> >   }
> >
> >   dispatch({ type: '@@INIT' })
> >
> >   return {
> >     getState: () => state,
> >     dispatch,
> >     subscribe(listener) {
> >       listeners.add(listener)
> >       return () => listeners.delete(listener)
> >     },
> >   }
> > }
> >
> > function combineReducers(reducers) {
> >   const keys = Object.keys(reducers)
> >   return function combination(state = {}, action) {
> >     let changed = Object.keys(state).length !== keys.length
> >     const next = {}
> >     for (const key of keys) {
> >       const prev = state[key]
> >       const value = reducers[key](prev, action)
> >       if (value === undefined) throw new Error(`Редьюсер "${key}" повернув undefined`)
> >       next[key] = value
> >       if (value !== prev) changed = true
> >     }
> >     return changed ? next : state
> >   }
> > }
> >
> > function createSelector(...fns) {
> >   const resultFn = fns.at(-1)
> >   const inputs = fns.slice(0, -1)
> >   let lastArgs = null
> >   let lastResult
> >
> >   function selector(state, ...rest) {
> >     const args = inputs.map((input) => input(state, ...rest))
> >     const same = lastArgs !== null && args.every((arg, i) => Object.is(arg, lastArgs[i]))
> >     if (same) return lastResult
> >     selector.recomputations++
> >     lastArgs = args
> >     lastResult = resultFn(...args)
> >     return lastResult
> >   }
> >
> >   selector.recomputations = 0
> >   return selector
> > }
> >
> > function applyMiddleware(...middlewares) {
> >   return (createStore) => (reducer, preloadedState) => {
> >     const store = createStore(reducer, preloadedState)
> >     let dispatch = () => {
> >       throw new Error('dispatch під час побудови middleware заборонено')
> >     }
> >     const api = {
> >       getState: store.getState,
> >       dispatch: (action, ...args) => dispatch(action, ...args),
> >     }
> >     const chain = middlewares.map((middleware) => middleware(api))
> >     dispatch = chain.reduceRight((next, middleware) => middleware(next), store.dispatch)
> >     return { ...store, dispatch }
> >   }
> > }
> >
> > function createLogger(log = console.log) {
> >   return ({ getState }) => (next) => (action) => {
> >     const prev = getState()
> >     const result = next(action)
> >     log({ type: action.type, prev, next: getState() })
> >     return result
> >   }
> > }
> >
> > function createThunk(extra) {
> >   return ({ dispatch, getState }) => (next) => (action) => {
> >     if (typeof action === 'function') return action(dispatch, getState, extra)
> >     return next(action)
> >   }
> > }
> > ```
> > **Чому так:** редьюсер мусить бути чистим (без запитів, таймерів, `Date.now()`), тож побічні ефекти потрібно десь тримати — thunk дає для цього «функцію-дію» з доступом до `dispatch` і `getState`. `extra` — ін'єкція залежностей: у тестах передаєш фейковий API, як `fetcher` у розділі 3. Порядок важливий: thunk має бути **першим**, щоб функції не доходили до logger'а і базового `dispatch`, який їх відкине.

## 🛠️ Крок 6. Time travel

Редьюсери чисті, стан імутабельний — отже, будь-який момент історії можна просто **зберегти** і повернути. `withHistory` — higher-order reducer: приймає звичайний редьюсер і повертає новий, що зберігає `{ past, present, future }` і розуміє службові дії. Сам стор нічого не знає про історію.

> [!task] Крок 6 · withHistory
> level: senior · difficulty: hard · id: jsp-05-task-06 · tags: time-travel, higher-order-reducer, undo
>
> Додай:
>
> - `withHistory(reducer, { limit = 50 } = {})` → редьюсер зі станом `{ past, present, future }`:
>   - початковий стан: `{ past: [], present: reducer(undefined, action), future: [] }`;
>   - `{ type: '@@history/UNDO' }` / `'@@history/REDO'` — крок назад / вперед (якщо нікуди — той самий стан);
>   - `{ type: '@@history/JUMP', index }` — перейти на позицію `index` у таймлайні `[...past, present, ...future]` (некоректний індекс або поточна позиція — той самий стан);
>   - будь-яка інша дія: `next = reducer(present, action)`; якщо `next === present` — той самий стан; інакше `present` іде в `past` (не більше `limit`), `future` очищується;
> - творці дій `undo()`, `redo()`, `jumpTo(index)`;
> - `selectTimeline(state)` → `{ timeline, index }` (`index === past.length`).
>
> ```js starter
> function isPlainObject(value) {
>   if (typeof value !== 'object' || value === null) return false
>   const proto = Object.getPrototypeOf(value)
>   return proto === Object.prototype || proto === null
> }
>
> function createStore(reducer, preloadedState, enhancer) {
>   if (typeof reducer !== 'function') throw new TypeError('reducer має бути функцією')
>   if (enhancer !== undefined) return enhancer(createStore)(reducer, preloadedState)
>
>   let state = preloadedState
>   const listeners = new Set()
>   let dispatching = false
>
>   function dispatch(action) {
>     if (!isPlainObject(action)) throw new TypeError('Дія має бути простим об\'єктом')
>     if (typeof action.type !== 'string') throw new TypeError('Дія має мати рядковий type')
>     if (dispatching) throw new Error('Редьюсер не може викликати dispatch')
>     const prev = state
>     try {
>       dispatching = true
>       state = reducer(state, action)
>     } finally {
>       dispatching = false
>     }
>     if (state !== prev) for (const listener of [...listeners]) listener()
>     return action
>   }
>
>   dispatch({ type: '@@INIT' })
>
>   return {
>     getState: () => state,
>     dispatch,
>     subscribe(listener) {
>       listeners.add(listener)
>       return () => listeners.delete(listener)
>     },
>   }
> }
>
> function combineReducers(reducers) {
>   const keys = Object.keys(reducers)
>   return function combination(state = {}, action) {
>     let changed = Object.keys(state).length !== keys.length
>     const next = {}
>     for (const key of keys) {
>       const prev = state[key]
>       const value = reducers[key](prev, action)
>       if (value === undefined) throw new Error(`Редьюсер "${key}" повернув undefined`)
>       next[key] = value
>       if (value !== prev) changed = true
>     }
>     return changed ? next : state
>   }
> }
>
> function createSelector(...fns) {
>   const resultFn = fns.at(-1)
>   const inputs = fns.slice(0, -1)
>   let lastArgs = null
>   let lastResult
>
>   function selector(state, ...rest) {
>     const args = inputs.map((input) => input(state, ...rest))
>     const same = lastArgs !== null && args.every((arg, i) => Object.is(arg, lastArgs[i]))
>     if (same) return lastResult
>     selector.recomputations++
>     lastArgs = args
>     lastResult = resultFn(...args)
>     return lastResult
>   }
>
>   selector.recomputations = 0
>   return selector
> }
>
> function applyMiddleware(...middlewares) {
>   return (createStore) => (reducer, preloadedState) => {
>     const store = createStore(reducer, preloadedState)
>     let dispatch = () => {
>       throw new Error('dispatch під час побудови middleware заборонено')
>     }
>     const api = {
>       getState: store.getState,
>       dispatch: (action, ...args) => dispatch(action, ...args),
>     }
>     const chain = middlewares.map((middleware) => middleware(api))
>     dispatch = chain.reduceRight((next, middleware) => middleware(next), store.dispatch)
>     return { ...store, dispatch }
>   }
> }
>
> function createLogger(log = console.log) {
>   return ({ getState }) => (next) => (action) => {
>     const prev = getState()
>     const result = next(action)
>     log({ type: action.type, prev, next: getState() })
>     return result
>   }
> }
>
> function createThunk(extra) {
>   return ({ dispatch, getState }) => (next) => (action) => {
>     if (typeof action === 'function') return action(dispatch, getState, extra)
>     return next(action)
>   }
> }
>
> function withHistory(reducer, { limit = 50 } = {}) {
>   // твій код
> }
>
> const undo = () => ({ type: '@@history/UNDO' })
> const redo = () => ({ type: '@@history/REDO' })
> const jumpTo = (index) => ({ type: '@@history/JUMP', index })
>
> function selectTimeline(state) {
>   // твій код
> }
> ```
>
> ```js tests
> const counter = (state = 0, action) => (action.type === 'inc' ? state + 1 : state)
>
> test('початковий стан і запис історії', () => {
>   const store = createStore(withHistory(counter))
>   expect(store.getState()).toEqual({ past: [], present: 0, future: [] })
>   store.dispatch({ type: 'inc' })
>   store.dispatch({ type: 'inc' })
>   expect(store.getState()).toEqual({ past: [0, 1], present: 2, future: [] })
> })
>
> test('undo / redo і очищення future', () => {
>   const store = createStore(withHistory(counter))
>   store.dispatch({ type: 'inc' })
>   store.dispatch({ type: 'inc' })
>   store.dispatch(undo())
>   expect(store.getState().present).toBe(1)
>   store.dispatch(redo())
>   expect(store.getState().present).toBe(2)
>   store.dispatch(undo())
>   store.dispatch({ type: 'inc' })
>   expect(store.getState()).toEqual({ past: [0, 1], present: 2, future: [] })
> })
>
> test('нічого не змінилось — той самий стан, слухачі мовчать', () => {
>   const store = createStore(withHistory(counter))
>   const listener = vi.fn()
>   store.subscribe(listener)
>   store.dispatch({ type: 'noop' })
>   store.dispatch(undo())
>   store.dispatch(redo())
>   expect(listener).toHaveBeenCalledTimes(0)
> })
>
> test('jumpTo і selectTimeline', () => {
>   const store = createStore(withHistory(counter))
>   for (let i = 0; i < 4; i++) store.dispatch({ type: 'inc' })
>   store.dispatch(jumpTo(1))
>   expect(selectTimeline(store.getState())).toEqual({ timeline: [0, 1, 2, 3, 4], index: 1 })
>   store.dispatch(jumpTo(4))
>   expect(store.getState().present).toBe(4)
>   const before = store.getState()
>   store.dispatch(jumpTo(99))
>   store.dispatch(jumpTo(4))
>   expect(store.getState()).toBe(before)
> })
>
> test('limit і робота з combineReducers', () => {
>   const todos = (state = [], action) => (action.type === 'add' ? [...state, action.title] : state)
>   const store = createStore(combineReducers({ counter, todos: withHistory(todos, { limit: 2 }) }))
>   store.dispatch({ type: 'add', title: 'a' })
>   store.dispatch({ type: 'add', title: 'b' })
>   store.dispatch({ type: 'add', title: 'c' })
>   expect(store.getState().todos.past).toEqual([['a'], ['a', 'b']])
>   store.dispatch({ type: 'inc' })
>   expect(store.getState().counter).toBe(1)
>   expect(store.getState().todos.past).toHaveLength(2)
> })
> ```
>
> > [!hint]- Підказка 1
> > `if (state === undefined) return { past: [], present: reducer(undefined, action), future: [] }`, далі `switch (action.type)`.
>
> > [!hint]- Підказка 2
> > `JUMP`: `const timeline = [...past, present, ...future]`; новий стан — `{ past: timeline.slice(0, index), present: timeline[index], future: timeline.slice(index + 1) }`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function isPlainObject(value) {
> >   if (typeof value !== 'object' || value === null) return false
> >   const proto = Object.getPrototypeOf(value)
> >   return proto === Object.prototype || proto === null
> > }
> >
> > function createStore(reducer, preloadedState, enhancer) {
> >   if (typeof reducer !== 'function') throw new TypeError('reducer має бути функцією')
> >   if (enhancer !== undefined) return enhancer(createStore)(reducer, preloadedState)
> >
> >   let state = preloadedState
> >   const listeners = new Set()
> >   let dispatching = false
> >
> >   function dispatch(action) {
> >     if (!isPlainObject(action)) throw new TypeError('Дія має бути простим об\'єктом')
> >     if (typeof action.type !== 'string') throw new TypeError('Дія має мати рядковий type')
> >     if (dispatching) throw new Error('Редьюсер не може викликати dispatch')
> >     const prev = state
> >     try {
> >       dispatching = true
> >       state = reducer(state, action)
> >     } finally {
> >       dispatching = false
> >     }
> >     if (state !== prev) for (const listener of [...listeners]) listener()
> >     return action
> >   }
> >
> >   dispatch({ type: '@@INIT' })
> >
> >   return {
> >     getState: () => state,
> >     dispatch,
> >     subscribe(listener) {
> >       listeners.add(listener)
> >       return () => listeners.delete(listener)
> >     },
> >   }
> > }
> >
> > function combineReducers(reducers) {
> >   const keys = Object.keys(reducers)
> >   return function combination(state = {}, action) {
> >     let changed = Object.keys(state).length !== keys.length
> >     const next = {}
> >     for (const key of keys) {
> >       const prev = state[key]
> >       const value = reducers[key](prev, action)
> >       if (value === undefined) throw new Error(`Редьюсер "${key}" повернув undefined`)
> >       next[key] = value
> >       if (value !== prev) changed = true
> >     }
> >     return changed ? next : state
> >   }
> > }
> >
> > function createSelector(...fns) {
> >   const resultFn = fns.at(-1)
> >   const inputs = fns.slice(0, -1)
> >   let lastArgs = null
> >   let lastResult
> >
> >   function selector(state, ...rest) {
> >     const args = inputs.map((input) => input(state, ...rest))
> >     const same = lastArgs !== null && args.every((arg, i) => Object.is(arg, lastArgs[i]))
> >     if (same) return lastResult
> >     selector.recomputations++
> >     lastArgs = args
> >     lastResult = resultFn(...args)
> >     return lastResult
> >   }
> >
> >   selector.recomputations = 0
> >   return selector
> > }
> >
> > function applyMiddleware(...middlewares) {
> >   return (createStore) => (reducer, preloadedState) => {
> >     const store = createStore(reducer, preloadedState)
> >     let dispatch = () => {
> >       throw new Error('dispatch під час побудови middleware заборонено')
> >     }
> >     const api = {
> >       getState: store.getState,
> >       dispatch: (action, ...args) => dispatch(action, ...args),
> >     }
> >     const chain = middlewares.map((middleware) => middleware(api))
> >     dispatch = chain.reduceRight((next, middleware) => middleware(next), store.dispatch)
> >     return { ...store, dispatch }
> >   }
> > }
> >
> > function createLogger(log = console.log) {
> >   return ({ getState }) => (next) => (action) => {
> >     const prev = getState()
> >     const result = next(action)
> >     log({ type: action.type, prev, next: getState() })
> >     return result
> >   }
> > }
> >
> > function createThunk(extra) {
> >   return ({ dispatch, getState }) => (next) => (action) => {
> >     if (typeof action === 'function') return action(dispatch, getState, extra)
> >     return next(action)
> >   }
> > }
> >
> > function withHistory(reducer, { limit = 50 } = {}) {
> >   return function history(state, action) {
> >     if (state === undefined) return { past: [], present: reducer(undefined, action), future: [] }
> >     const { past, present, future } = state
> >     switch (action.type) {
> >       case '@@history/UNDO':
> >         if (past.length === 0) return state
> >         return { past: past.slice(0, -1), present: past[past.length - 1], future: [present, ...future] }
> >       case '@@history/REDO':
> >         if (future.length === 0) return state
> >         return { past: [...past, present], present: future[0], future: future.slice(1) }
> >       case '@@history/JUMP': {
> >         const timeline = [...past, present, ...future]
> >         const { index } = action
> >         if (!Number.isInteger(index) || index < 0 || index >= timeline.length || index === past.length) return state
> >         return { past: timeline.slice(0, index), present: timeline[index], future: timeline.slice(index + 1) }
> >       }
> >       default: {
> >         const next = reducer(present, action)
> >         if (next === present) return state
> >         return { past: [...past, present].slice(-limit), present: next, future: [] }
> >       }
> >     }
> >   }
> > }
> >
> > const undo = () => ({ type: '@@history/UNDO' })
> > const redo = () => ({ type: '@@history/REDO' })
> > const jumpTo = (index) => ({ type: '@@history/JUMP', index })
> >
> > function selectTimeline(state) {
> >   return { timeline: [...state.past, state.present, ...state.future], index: state.past.length }
> > }
> > ```
> > **Чому так:** higher-order reducer — Decorator для редьюсера: історію можна загорнути навколо будь-якого слайсу, не змінюючи ні його, ні стор (тест з `combineReducers` історизує лише `todos`). Time travel можливий **лише** тому, що редьюсери чисті, а стан імутабельний: знімки не змінюються, і повторне застосування дає той самий результат. Префікс `@@history/` — простір імен, щоб службові дії не конфліктували з дією `UNDO` у бізнес-коді.

## 🎤 На співбесіді

> [!interview] Як би ти масштабував такий стор на великий застосунок: 100+ слайсів і кілька команд?
> level: senior · frequency: часто · id: jsp-05-int-01
>
> ---
>
> **Структура**: слайси за фічами (feature folders), кожна команда володіє своїми редьюсерами, селекторами і діями з префіксом простору імен (`cart/add`). **Ліниве підключення** редьюсерів (`replaceReducer` при завантаженні чанку) — щоб не тягнути весь застосунок у перший бандл. **Нормалізація**: сутності як `{ ids, entities }`, а не вкладені масиви — оновлення O(1) і без дублікатів. **Серверний стан** (кеш запитів) — не в глобальному сторі вручну, а в RTK Query / TanStack Query; у сторі лишається клієнтський стан. **Продуктивність**: мемоізовані селектори, підписки з селекторами (`useSyncExternalStore` + порівняння результату), щоб зміна одного слайсу не перемальовувала весь UI. **Правила**: лише серіалізовні дії і стан (devtools, логування, SSR-гідратація), ESLint-правила проти мутацій, Immer для зручних імутабельних оновлень.
>
> 📚 [[JavaScript - 32. Патерни проєктування]] · [Redux: Deriving Data with Selectors](https://redux.js.org/usage/deriving-data-selectors) · [Redux: Middleware](https://redux.js.org/understanding/history-and-design/middleware)

> [!interview] Що ламає time travel і відтворюваність у Redux-подібному сторі?
> level: senior · frequency: іноді · id: jsp-05-int-02
>
> ---
>
> **Нечисті редьюсери**: `Date.now()`, `Math.random()`, `crypto.randomUUID()` всередині редьюсера дають різний результат при повторному застосуванні дій — час, id і випадковість треба генерувати **до** dispatch і класти в дію. **Мутації**: `state.items.push(x)` змінює і «старий» знімок — історія показує неправду, а селектори не бачать зміни. **Несеріалізовні значення** в стані чи діях (класи, функції, проміси, `Map`, DOM-вузли) не переживуть збереження сесії, devtools і SSR. **Побічні ефекти** в редьюсерах (запити, `localStorage`) повторюються при time travel — їм місце в middleware/thunk. **Зовнішній стан**, не відображений у сторі (дані в `ref`, глобальні змінні), не «відмотується» разом з історією.
>
> 📚 [[JavaScript - 03. Значення та посилання]] · [Redux: Implementing Undo History](https://redux.js.org/usage/implementing-undo-history) · [Redux: createStore](https://redux.js.org/api/createstore)

## 🧠 Закріплення

> [!question]- Чому редьюсер мусить бути чистою функцією?
> *дуже часто · теорія* · `jsp-05-001`
>
> Однакові `(state, action)` → однаковий результат, без побічних ефектів. Це дає тестованість (виклик — і порівняння), time travel і повторне відтворення дій, передбачуваний порядок змін і можливість дешево порівнювати стани за посиланням. Запити, таймери, випадковість — у middleware або в даних дії.
>
> 📚 [[JavaScript - 15. Функції глибоко]] · [Redux: createStore](https://redux.js.org/api/createstore)

> [!question]- Навіщо middleware три вкладені функції `store => next => action`?
> *часто · код* · `jsp-05-002`
>
> Кожен рівень налаштовується у свій момент: `store` — один раз при створенні (доступ до `getState`/`dispatch`), `next` — при складанні ланцюжка (наступний шар), `action` — на кожен dispatch. Каррінг дозволяє скласти ланцюжок через `reduceRight` один раз, а не на кожну дію.
>
> 📚 [[JavaScript - 15. Функції глибоко]] · [Redux: applyMiddleware](https://redux.js.org/api/applymiddleware)

> [!question]- Чому `combineReducers` повертає той самий об'єкт, якщо слайси не змінились?
> *часто · дизайн* · `jsp-05-003`
>
> Інакше кожна дія (навіть та, що нікого не стосується) створювала б новий кореневий об'єкт — і всі слухачі, селектори й компоненти вважали б, що змінилось усе. Збереження посилання робить перевірку `prev === next` правдивою на кожному рівні дерева.
>
> 📚 [[JavaScript - 03. Значення та посилання]] · [Redux: combineReducers](https://redux.js.org/api/combinereducers)

> [!question]- Коли мемоізований селектор перераховує результат?
> *часто · код* · `jsp-05-004`
>
> Коли хоча б один вхідний селектор повернув значення, не `Object.is`-рівне попередньому. Кеш розміру 1: зміна аргументу туди-назад (`id=1`, `id=2`, `id=1`) щоразу перераховує. Рішення — фабрика селекторів на компонент або кеш більшого розміру.
>
> 📚 [[JavaScript - 05. Замикання]] · [Reselect](https://github.com/reduxjs/reselect)

> [!question]- Навіщо thunk, якщо можна викликати API прямо в компоненті?
> *часто · дизайн* · `jsp-05-005`
>
> Thunk виносить асинхронну бізнес-логіку з UI: її можна перевикористати з кількох місць, тестувати без рендеру (передавши фейковий API в `extra`) і логувати разом з діями. Компонент лише каже «завантаж кошик», а не знає про endpoints, ретраї і порядок дій.
>
> 📚 [[JavaScript - 10. async і await]] · [Redux Thunk](https://github.com/reduxjs/redux-thunk)

> [!question]- Чому дії мають бути простими серіалізовними об'єктами?
> *часто · дизайн* · `jsp-05-006`
>
> Дію логують, показують у devtools, записують для відтворення багу, відправляють між вкладками або на сервер. Екземпляри класів втрачають прототип при серіалізації, функції й проміси не серіалізуються зовсім. Тому `createStore` відкидає все, що не є простим об'єктом з рядковим `type`.
>
> 📚 [[JavaScript - 23. JSON, structuredClone і серіалізація]] · [Redux: createStore](https://redux.js.org/api/createstore)

> [!question]- Що таке higher-order reducer і навіщо він для undo?
> *іноді · дизайн* · `jsp-05-007`
>
> Функція, що приймає редьюсер і повертає новий редьюсер з додатковою поведінкою — Decorator для редьюсерів. `withHistory` додає `past/present/future` і службові дії до будь-якого слайсу, не змінюючи ні сам слайс, ні стор. Так само роблять `persistReducer`, `resettable`, логування.
>
> 📚 [[JavaScript - 32. Патерни проєктування]] · [Redux: Implementing Undo History](https://redux.js.org/usage/implementing-undo-history)

## ⚡ Фішки

> [!reel] 🧅 Ядро Redux — кілька функцій
> Ядро Redux — `createStore`, `combineReducers`, `applyMiddleware`, `compose`: кілька сотень рядків разом з перевірками. Ти щойно написав усе це. Решта екосистеми (RTK, Immer, devtools) — зручності поверх.

> [!reel] ⏪ Time travel — побічний продукт, а не фіча
> Дан Абрамов зробив Redux, щоб показати hot reloading і time travel на React Europe 2015. Вони «безкоштовні», бо стан імутабельний, а редьюсери чисті.

> [!reel] 🔁 reduceRight = compose
> Складання middleware — звичайний `compose` з розділу про функції.
>
> ```js
> const compose = (...fns) => (x) => fns.reduceRight((acc, f) => f(acc), x)
> compose(a, b)(dispatch) // → a(b(dispatch))
> ```

## 🖥️ Зібрати в браузері

Збережи як `store.html`. Лічильник і список задач на твоєму сторі; асинхронна кнопка через thunk; logger пише в консоль; повзунок «devtools» мандрує історією `todos`.

```html
<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <title>Міні-Redux</title>
  <style>
    body { font: 16px system-ui, sans-serif; max-width: 560px; margin: 40px auto; }
    fieldset { margin: 16px 0; border-radius: 8px; }
    input[type=range] { width: 100%; }
    code { background: #f3f3f3; padding: 2px 4px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>🗃️ Міні-Redux</h1>
  <fieldset>
    <legend>Лічильник</legend>
    <output id="count">0</output>
    <button id="inc">+1</button>
    <button id="incLater">+5 через 1 с (thunk)</button>
  </fieldset>
  <fieldset>
    <legend>Задачі (з історією)</legend>
    <form id="add"><input name="title" placeholder="Нова задача" /> <button>Додати</button></form>
    <ul id="todos"></ul>
    <p>Виконано: <span id="doneCount">0</span></p>
    <button id="undo">↶ Undo</button> <button id="redo">↷ Redo</button>
  </fieldset>
  <fieldset>
    <legend>🛠️ Devtools: <code id="pos"></code></legend>
    <input id="timeline" type="range" min="0" max="0" value="0" />
  </fieldset>
  <script>
function isPlainObject(value) {
  if (typeof value !== 'object' || value === null) return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

function createStore(reducer, preloadedState, enhancer) {
  if (typeof reducer !== 'function') throw new TypeError('reducer має бути функцією')
  if (enhancer !== undefined) return enhancer(createStore)(reducer, preloadedState)

  let state = preloadedState
  const listeners = new Set()
  let dispatching = false

  function dispatch(action) {
    if (!isPlainObject(action)) throw new TypeError('Дія має бути простим об\'єктом')
    if (typeof action.type !== 'string') throw new TypeError('Дія має мати рядковий type')
    if (dispatching) throw new Error('Редьюсер не може викликати dispatch')
    const prev = state
    try {
      dispatching = true
      state = reducer(state, action)
    } finally {
      dispatching = false
    }
    if (state !== prev) for (const listener of [...listeners]) listener()
    return action
  }

  dispatch({ type: '@@INIT' })

  return {
    getState: () => state,
    dispatch,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

function combineReducers(reducers) {
  const keys = Object.keys(reducers)
  return function combination(state = {}, action) {
    let changed = Object.keys(state).length !== keys.length
    const next = {}
    for (const key of keys) {
      const prev = state[key]
      const value = reducers[key](prev, action)
      if (value === undefined) throw new Error(`Редьюсер "${key}" повернув undefined`)
      next[key] = value
      if (value !== prev) changed = true
    }
    return changed ? next : state
  }
}

function createSelector(...fns) {
  const resultFn = fns.at(-1)
  const inputs = fns.slice(0, -1)
  let lastArgs = null
  let lastResult

  function selector(state, ...rest) {
    const args = inputs.map((input) => input(state, ...rest))
    const same = lastArgs !== null && args.every((arg, i) => Object.is(arg, lastArgs[i]))
    if (same) return lastResult
    selector.recomputations++
    lastArgs = args
    lastResult = resultFn(...args)
    return lastResult
  }

  selector.recomputations = 0
  return selector
}

function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState) => {
    const store = createStore(reducer, preloadedState)
    let dispatch = () => {
      throw new Error('dispatch під час побудови middleware заборонено')
    }
    const api = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args),
    }
    const chain = middlewares.map((middleware) => middleware(api))
    dispatch = chain.reduceRight((next, middleware) => middleware(next), store.dispatch)
    return { ...store, dispatch }
  }
}

function createLogger(log = console.log) {
  return ({ getState }) => (next) => (action) => {
    const prev = getState()
    const result = next(action)
    log({ type: action.type, prev, next: getState() })
    return result
  }
}

function createThunk(extra) {
  return ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') return action(dispatch, getState, extra)
    return next(action)
  }
}

function withHistory(reducer, { limit = 50 } = {}) {
  return function history(state, action) {
    if (state === undefined) return { past: [], present: reducer(undefined, action), future: [] }
    const { past, present, future } = state
    switch (action.type) {
      case '@@history/UNDO':
        if (past.length === 0) return state
        return { past: past.slice(0, -1), present: past[past.length - 1], future: [present, ...future] }
      case '@@history/REDO':
        if (future.length === 0) return state
        return { past: [...past, present], present: future[0], future: future.slice(1) }
      case '@@history/JUMP': {
        const timeline = [...past, present, ...future]
        const { index } = action
        if (!Number.isInteger(index) || index < 0 || index >= timeline.length || index === past.length) return state
        return { past: timeline.slice(0, index), present: timeline[index], future: timeline.slice(index + 1) }
      }
      default: {
        const next = reducer(present, action)
        if (next === present) return state
        return { past: [...past, present].slice(-limit), present: next, future: [] }
      }
    }
  }
}

const undo = () => ({ type: '@@history/UNDO' })
const redo = () => ({ type: '@@history/REDO' })
const jumpTo = (index) => ({ type: '@@history/JUMP', index })

function selectTimeline(state) {
  return { timeline: [...state.past, state.present, ...state.future], index: state.past.length }
}

    // ---------- редьюсери застосунку
    const counter = (state = 0, action) => (action.type === 'counter/inc' ? state + (action.by ?? 1) : state)
    const todos = (state = [], action) => {
      switch (action.type) {
        case 'todos/add': return [...state, { id: action.id, title: action.title, done: false }]
        case 'todos/toggle': return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t))
        default: return state
      }
    }

    const store = createStore(
      combineReducers({ counter, todos: withHistory(todos, { limit: 100 }) }),
      undefined,
      applyMiddleware(createThunk({ wait: (ms) => new Promise((r) => setTimeout(r, ms)) }), createLogger(console.log)),
    )

    const selectTodos = (state) => state.todos.present
    const selectDoneCount = createSelector(selectTodos, (list) => list.filter((t) => t.done).length)

    // ---------- DOM-шар
    const $ = (id) => document.getElementById(id)
    function render() {
      const state = store.getState()
      $('count').textContent = state.counter
      $('todos').replaceChildren(...selectTodos(state).map((todo) => {
        const li = document.createElement('li')
        const box = Object.assign(document.createElement('input'), { type: 'checkbox', checked: todo.done })
        box.addEventListener('change', () => store.dispatch({ type: 'todos/toggle', id: todo.id }))
        li.append(box, ` ${todo.title}`)
        return li
      }))
      $('doneCount').textContent = selectDoneCount(state)
      const { timeline, index } = selectTimeline(state.todos)
      $('timeline').max = timeline.length - 1
      $('timeline').value = index
      $('pos').textContent = `${index + 1} / ${timeline.length} · перерахунків селектора: ${selectDoneCount.recomputations}`
    }

    $('inc').addEventListener('click', () => store.dispatch({ type: 'counter/inc' }))
    $('incLater').addEventListener('click', () => store.dispatch(async (dispatch, getState, { wait }) => {
      await wait(1000)
      dispatch({ type: 'counter/inc', by: 5 })
    }))
    $('add').addEventListener('submit', (event) => {
      event.preventDefault()
      const title = event.target.elements.title.value.trim()
      if (!title) return
      // id генеруємо ДО dispatch — редьюсер лишається чистим
      store.dispatch({ type: 'todos/add', id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, title })
      event.target.reset()
    })
    $('undo').addEventListener('click', () => store.dispatch(undo()))
    $('redo').addEventListener('click', () => store.dispatch(redo()))
    $('timeline').addEventListener('input', (event) => store.dispatch(jumpTo(Number(event.target.value))))

    store.subscribe(render)
    render()
  </script>
</body>
</html>
```

> [!tip] Подивись на свій logger
> Відкрий консоль: кожна дія — рядок `{ type, prev, next }`. Клацни «+1» — і зверни увагу, що лічильник *не* потрапляє в історію повзунка: `withHistory` загортає лише слайс `todos`.

## 📚 Джерела та що почитати

- 🟢 [Redux — createStore](https://redux.js.org/api/createstore) — оригінальний API, який ми повторили
- 🟡 [Redux — Middleware](https://redux.js.org/understanding/history-and-design/middleware) — покрокове виведення `applyMiddleware` від monkey-patching до каррінгу
- 🟡 [Redux — Deriving Data with Selectors](https://redux.js.org/usage/deriving-data-selectors) — коли і як мемоізувати
- 🟡 [Redux — Implementing Undo History](https://redux.js.org/usage/implementing-undo-history) — higher-order reducer для undo
- 🟡 [Redux — combineReducers](https://redux.js.org/api/combinereducers) і [applyMiddleware](https://redux.js.org/api/applymiddleware) — довідка з нюансами
- 🛠️ [Reselect](https://github.com/reduxjs/reselect) — промислова версія `createSelector`
- 🛠️ [Redux Thunk](https://github.com/reduxjs/redux-thunk) — оригінальний thunk (кілька рядків коду!)

> [!important] Підсумок
> - Стор = замикання зі станом, слухачами і чистим редьюсером; дії — прості серіалізовні об'єкти.
> - `combineReducers` і селектори зберігають посилання, коли нічого не змінилось — на цьому стоїть продуктивність.
> - Middleware — «цибуля» `store => next => action`, складена `reduceRight`; `api.dispatch` проходить увесь ланцюжок.
> - Побічні ефекти — у thunk/middleware, ніколи в редьюсерах.
> - Time travel — higher-order reducer над імутабельним станом.
