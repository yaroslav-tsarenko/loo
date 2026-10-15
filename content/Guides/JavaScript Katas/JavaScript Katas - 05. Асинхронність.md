---
title: Асинхронність
order: 5
level: middle
tags: [promises, async, concurrency, retry, timeout]
prerequisites:
  - "[[JavaScript - 08. Event Loop]]"
  - "[[JavaScript - 09. Promise]]"
  - "[[JavaScript - 10. async і await]]"
estimatedMinutes: 110
id: jsk-ch-05
icon: "⏳"
---

# JavaScript Katas - 05. Асинхронність

> [!success] 🎯 Що тренуємо
> - Писати комбінатори промісів з нуля: `all`, `allSettled`, `race`, `any`.
> - Перетворювати callback-API на проміси (`promisify`) і обгортати проміси таймаутом.
> - Повтор з експоненційним backoff і пул з обмеженням конкурентності — дві найчастіші «production»-задачі.
> - Тестувати асинхронний код: `await`, `sleep`, фейкові таймери і `.resolves` / `.rejects`.

## 🧭 Стратегія

Будь-який комбінатор промісів — це **лічильник у замиканні** плюс правило, коли результатний проміс завершується:

| Комбінатор | Resolve, коли… | Reject, коли… | Порожній ввід |
|---|---|---|---|
| `all` | **усі** виконались (результати за індексом) | **перший** reject | `[]` одразу |
| `allSettled` | усі завершились (будь-як) | ніколи | `[]` одразу |
| `race` | перший **завершився** успішно | перший завершився з помилкою | вічно pending |
| `any` | **перший** успіх | усі відхилені → `AggregateError` | `AggregateError` одразу |

Шаблон, який покриває всі чотири:

```js
function combinator(iterable) {
  return new Promise((resolve, reject) => {
    const items = Array.from(iterable)    // ітерабельне → масив (Set, генератор)
    let remaining = items.length          // лічильник у замиканні
    items.forEach((item, i) => {
      Promise.resolve(item).then(         // значення і thenable → проміс
        (value) => { /* записати за індексом i, можливо resolve */ },
        (error) => { /* можливо reject */ },
      )
    })
  })
}
```

**Три правила, що рятують на співбесіді:**

1. Пиши результат **за індексом** `results[i] = value`, а не `push` — проміси завершуються в довільному порядку.
2. `Promise.resolve(item)` — і значення, і проміси, і thenable обробляються однаково.
3. Проміс завершується лише раз: повторні `resolve`/`reject` ігноруються, тож «перший виграє» отримуємо безкоштовно.

**Як тестувати.** `await sleep(0)` у тестах — справжня макрозадача: до неї виконуються всі мікрозадачі. Для часу — фейкові таймери: `vi.advanceTimersByTime` спрацьовує синхронно, після нього `await sleep(0)` дає промісам «доїхати». Модель черг — у [[JavaScript - 08. Event Loop]].

## 🧩 Збери з пам'яті

> [!quiz] Збери ядро `Promise.all`
> level: middle · type: order · id: jsk-05-quiz-01
>
> ```js order
> const results = new Array(items.length)
> let remaining = items.length
> if (remaining === 0) return resolve(results)
> items.forEach((item, i) => {
>   Promise.resolve(item).then((value) => {
>     results[i] = value
>     if (--remaining === 0) resolve(results)
>   }, reject)
> })
> results.push(value)   // ✗
> ```
>
> **Пояснення:** результат пишемо за індексом, бо порядок завершення довільний. Порожній ввід треба обробити окремо — інакше лічильник ніколи не дійде до нуля і проміс зависне.

> [!quiz] Заповни пропуски: послідовний запуск через reduce
> level: middle · type: fill · id: jsk-05-quiz-02 · bank: map, all, forEach
>
> ```js fill
> function sequence(tasks) {
>   return tasks.[[reduce]](
>     (chain, task) => chain.[[then]]((results) => task().then((value) => [...results, value])),
>     Promise.[[resolve]]([]),
>   )
> }
> ```
>
> **Пояснення:** кожна наступна задача стартує в `then` попередньої — це ланцюжок, а не паралельний запуск. Сучасна альтернатива — `for…of` з `await` у циклі.

> [!quiz] Заповни пропуски в обгортці з таймаутом
> level: middle · type: fill · id: jsk-05-quiz-03
>
> ```js fill
> function withTimeout(promise, ms) {
>   let timer
>   const timeout = new Promise((_, [[reject]]) => {
>     timer = [[setTimeout]](() => reject(new Error('Timeout')), ms)
>   })
>   return Promise.[[race]]([promise, timeout]).[[finally]](() => clearTimeout(timer))
> }
> ```
>
> **Пояснення:** `race` віддає того, хто завершився першим. `finally` прибирає таймер в обох випадках — інакше він тримає event loop (у Node процес не завершиться) і замикання в пам'яті.

## 🛠️ Задачі

> [!task] delay
> level: junior · difficulty: easy · id: jsk-05-task-01 · tags: promises, timers
>
> Напиши `delay(ms, value)`: повертає проміс, який виконується значенням `value` через `ms` мілісекунд. Навіть `delay(0)` завершується **асинхронно** — не раніше наступної макрозадачі.
>
> ```js starter
> function delay(ms, value) {
>   // твій код
> }
> ```
>
> ```js tests
> test('повертає Promise', () => {
>   expect(delay(0) instanceof Promise).toBe(true)
> })
>
> test('виконується рівно через ms', async () => {
>   vi.useFakeTimers()
>   let done = false
>   delay(100).then(() => { done = true })
>   vi.advanceTimersByTime(99)
>   await sleep(0)
>   expect(done).toBe(false)
>   vi.advanceTimersByTime(1)
>   await sleep(0)
>   expect(done).toBe(true)
> })
>
> test('виконується переданим значенням', async () => {
>   await expect(delay(5, 'готово')).resolves.toBe('готово')
>   await expect(delay(1)).resolves.toBe(undefined)
> })
>
> test('delay(0) — не синхронно', async () => {
>   let done = false
>   delay(0).then(() => { done = true })
>   await Promise.resolve()
>   expect(done).toBe(false)
>   await sleep(5)
>   expect(done).toBe(true)
> })
> ```
>
> > [!hint]- Підказка 1
> > `new Promise((resolve) => …)` + `setTimeout`.
>
> > [!hint]- Підказка 2
> > `setTimeout(resolve, ms, value)` — третій і далі аргументи `setTimeout` передаються в колбек.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function delay(ms, value) {
> >   return new Promise((resolve) => setTimeout(resolve, ms, value))
> > }
> > ```
> > **Складність:** O(1). **Чому так:** таймер — макрозадача, тож навіть `delay(0)` пропускає вперед усі мікрозадачі й синхронний код. **Що спитають далі:** «скасування?» — приймати `AbortSignal`, на `abort` робити `clearTimeout` і `reject(signal.reason)`; «чому `delay(0)` насправді може бути ≥ 4 мс?» — clamping вкладених таймерів у браузері.

> [!task] promisify
> level: junior · difficulty: easy · id: jsk-05-task-02 · tags: promises, callbacks
>
> Напиши `promisify(fn)`: перетворює функцію з колбеком у стилі Node (`(err, value) => …` — **останній** аргумент) на функцію, що повертає проміс. `this` і аргументи передаються. Синхронна помилка в `fn` теж стає reject.
>
> ```js
> const readAsync = promisify(read)
> readAsync('a.txt').then(console.log)
> ```
>
> ```js starter
> function promisify(fn) {
>   // твій код
> }
> ```
>
> ```js tests
> function divide(a, b, callback) {
>   setTimeout(() => {
>     if (b === 0) callback(new Error('ділення на нуль'))
>     else callback(null, a / b)
>   }, 1)
> }
>
> test('resolve зі значенням колбека', async () => {
>   await expect(promisify(divide)(10, 2)).resolves.toBe(5)
> })
>
> test('reject з помилкою колбека', async () => {
>   await expect(promisify(divide)(1, 0)).rejects.toThrow('ділення на нуль')
> })
>
> test('синхронний колбек теж працює', async () => {
>   const syncFn = (x, cb) => cb(null, x * 2)
>   await expect(promisify(syncFn)(21)).resolves.toBe(42)
> })
>
> test('синхронний throw стає reject', async () => {
>   const broken = () => { throw new Error('впало') }
>   await expect(promisify(broken)()).rejects.toThrow('впало')
> })
>
> test('зберігає this', async () => {
>   const counter = {
>     value: 7,
>     read(cb) { cb(null, this.value) },
>   }
>   counter.readAsync = promisify(counter.read)
>   await expect(counter.readAsync()).resolves.toBe(7)
> })
>
> test('повертає проміс, а не викликає одразу без аргументів', () => {
>   const spy = vi.fn((cb) => cb(null, 1))
>   const wrapped = promisify(spy)
>   expect(spy).toHaveBeenCalledTimes(0)
>   expect(wrapped() instanceof Promise).toBe(true)
>   expect(spy).toHaveBeenCalledTimes(1)
> })
> ```
>
> > [!hint]- Підказка 1
> > Поверни `function (...args)` (заради `this`), яка створює `new Promise` і викликає `fn` з `...args` та власним колбеком у кінці.
>
> > [!hint]- Підказка 2
> > Виняток, кинутий синхронно всередині executor-а `new Promise`, автоматично перетворюється на reject.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function promisify(fn) {
> >   return function (...args) {
> >     return new Promise((resolve, reject) => {
> >       fn.call(this, ...args, (error, value) => {
> >         if (error) reject(error)
> >         else resolve(value)
> >       })
> >     })
> >   }
> > }
> > ```
> > **Складність:** O(1). **Чому так:** executor `new Promise` виконується синхронно і ловить винятки; повторні виклики колбека проміс просто ігнорує. **Що спитають далі:** «колбек з кількома значеннями?» — резолвити масивом або об'єктом (як `util.promisify.custom` у Node); «зворотна операція `callbackify`?».

> [!task] Promise.all
> level: middle · difficulty: medium · id: jsk-05-task-03 · tags: promises, combinators
>
> Напиши `promiseAll(iterable)` без `Promise.all`:
>
> - приймає будь-яке ітерабельне (масив, `Set`) зі значень, промісів і thenable;
> - виконується масивом результатів **у порядку вводу**;
> - відхиляється **першою** помилкою, не чекаючи решти;
> - порожній ввід → `[]`.
>
> ```js starter
> function promiseAll(iterable) {
>   // твій код
> }
> ```
>
> ```js tests
> const later = (value, ms) => new Promise((resolve) => setTimeout(resolve, ms, value))
>
> test('зберігає порядок вводу, а не завершення', async () => {
>   await expect(promiseAll([later('a', 15), later('b', 1), later('c', 5)])).resolves.toEqual(['a', 'b', 'c'])
> })
>
> test('звичайні значення і thenable', async () => {
>   const thenable = { then(resolve) { resolve('t') } }
>   await expect(promiseAll([1, Promise.resolve(2), thenable])).resolves.toEqual([1, 2, 't'])
> })
>
> test('порожній ввід', async () => {
>   await expect(promiseAll([])).resolves.toEqual([])
> })
>
> test('приймає Set', async () => {
>   await expect(promiseAll(new Set([1, 2]))).resolves.toEqual([1, 2])
> })
>
> test('відхиляється першою помилкою, не чекаючи решти', async () => {
>   const never = new Promise(() => {})
>   await expect(promiseAll([never, Promise.reject(new Error('бум'))])).rejects.toThrow('бум')
> })
>
> test('повертає Promise', () => {
>   expect(promiseAll([]) instanceof Promise).toBe(true)
> })
>
> test('не використовує вбудований Promise.all', async () => {
>   const original = Promise.all
>   Promise.all = () => { throw new Error('Promise.all заборонено') }
>   try {
>     await expect(promiseAll([1, later(2, 1)])).resolves.toEqual([1, 2])
>   } finally {
>     Promise.all = original
>   }
> })
> ```
>
> > [!hint]- Підказка 1
> > `Array.from(iterable)` дає довжину наперед і працює для будь-якого ітерабельного.
>
> > [!hint]- Підказка 2
> > Лічильник `remaining`: зменшуй при кожному успіху, `resolve(results)` — коли дійшов до 0. `reject` можна передати напряму другим аргументом `then`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function promiseAll(iterable) {
> >   return new Promise((resolve, reject) => {
> >     const items = Array.from(iterable)
> >     const results = new Array(items.length)
> >     let remaining = items.length
> >     if (remaining === 0) return resolve(results)
> >     items.forEach((item, i) => {
> >       Promise.resolve(item).then((value) => {
> >         results[i] = value
> >         if (--remaining === 0) resolve(results)
> >       }, reject)
> >     })
> >   })
> > }
> > ```
> > **Складність:** O(n). **Чому так:** `Promise.resolve(item)` уніфікує значення, проміси й thenable; перший `reject` фіксує стан, решта викликів ігноруються. **Що спитають далі:** «скасувати решту при першій помилці?» — проміси не скасовуються; передавати `AbortController.signal` у задачі; «чому `all` — fail-fast, а не чекає всіх?» — для «всіх результатів» є `allSettled`.

> [!task] Promise.allSettled
> level: middle · difficulty: medium · id: jsk-05-task-04 · tags: promises, combinators
>
> Напиши `promiseAllSettled(iterable)`: чекає завершення **всіх** і виконується масивом описів у порядку вводу — `{ status: 'fulfilled', value }` або `{ status: 'rejected', reason }`. Ніколи не відхиляється.
>
> ```js starter
> function promiseAllSettled(iterable) {
>   // твій код
> }
> ```
>
> ```js tests
> const later = (value, ms) => new Promise((resolve) => setTimeout(resolve, ms, value))
>
> test('змішані результати в порядку вводу', async () => {
>   const error = new Error('ні')
>   const result = await promiseAllSettled([later('a', 10), Promise.reject(error), 3])
>   expect(result).toEqual([
>     { status: 'fulfilled', value: 'a' },
>     { status: 'rejected', reason: error },
>     { status: 'fulfilled', value: 3 },
>   ])
> })
>
> test('усі відхилені — все одно resolve', async () => {
>   const result = await promiseAllSettled([Promise.reject(1), Promise.reject(2)])
>   expect(result).toEqual([{ status: 'rejected', reason: 1 }, { status: 'rejected', reason: 2 }])
> })
>
> test('порожній ввід', async () => {
>   await expect(promiseAllSettled([])).resolves.toEqual([])
> })
>
> test('чекає найповільнішого', async () => {
>   let slowDone = false
>   const slow = later('slow', 20).then((v) => { slowDone = true; return v })
>   await promiseAllSettled([Promise.reject(new Error('fast')), slow])
>   expect(slowDone).toBe(true)
> })
>
> test('приймає ітерабельне', async () => {
>   function* gen() { yield 1; yield Promise.resolve(2) }
>   await expect(promiseAllSettled(gen())).resolves.toEqual([{ status: 'fulfilled', value: 1 }, { status: 'fulfilled', value: 2 }])
> })
> ```
>
> > [!hint]- Підказка 1
> > Той самий каркас, що й `all`, але обидві гілки `then` записують опис і зменшують лічильник.
>
> > [!hint]- Підказка 2
> > Альтернатива в один рядок: перетворити кожен проміс на «завжди успішний» і віддати в свій `promiseAll`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function promiseAllSettled(iterable) {
> >   return new Promise((resolve) => {
> >     const items = Array.from(iterable)
> >     const results = new Array(items.length)
> >     let remaining = items.length
> >     if (remaining === 0) return resolve(results)
> >     const settle = (i, outcome) => {
> >       results[i] = outcome
> >       if (--remaining === 0) resolve(results)
> >     }
> >     items.forEach((item, i) => {
> >       Promise.resolve(item).then(
> >         (value) => settle(i, { status: 'fulfilled', value }),
> >         (reason) => settle(i, { status: 'rejected', reason }),
> >       )
> >     })
> >   })
> > }
> > ```
> > **Складність:** O(n). **Чому так:** обробник помилки в `then` «гасить» reject, тож результатний проміс не може відхилитися. **Що спитають далі:** «коли `allSettled` краще за `all`?» — незалежні запити, де часткові дані корисні (дашборд з віджетами); «як отримати лише успішні?» — `filter((r) => r.status === 'fulfilled')`.

> [!task] Promise.race і Promise.any
> level: middle · difficulty: medium · id: jsk-05-task-05 · tags: promises, combinators
>
> Напиши дві функції:
>
> - `promiseRace(iterable)` — завершується так само, як **перший завершений** проміс (успіх чи помилка). Порожній ввід — вічно pending.
> - `promiseAny(iterable)` — виконується **першим успіхом**; якщо всі відхилені — відхиляється `AggregateError` з помилками **в порядку вводу** у полі `errors`. Порожній ввід — одразу `AggregateError`.
>
> ```js starter
> function promiseRace(iterable) {
>   // твій код
> }
>
> function promiseAny(iterable) {
>   // твій код
> }
> ```
>
> ```js tests
> const later = (value, ms) => new Promise((resolve) => setTimeout(resolve, ms, value))
> const fail = (reason, ms) => new Promise((_, reject) => setTimeout(reject, ms, reason))
>
> test('race: перший успіх', async () => {
>   await expect(promiseRace([later('slow', 20), later('fast', 2)])).resolves.toBe('fast')
> })
>
> test('race: перша помилка теж перемагає', async () => {
>   await expect(promiseRace([later('slow', 20), fail(new Error('швидка помилка'), 2)])).rejects.toThrow('швидка помилка')
> })
>
> test('race: значення — одразу переможець', async () => {
>   await expect(promiseRace([later('p', 5), 'value'])).resolves.toBe('value')
> })
>
> test('race: порожній ввід — вічно pending', async () => {
>   let settled = false
>   promiseRace([]).then(() => { settled = true }, () => { settled = true })
>   await sleep(10)
>   expect(settled).toBe(false)
> })
>
> test('any: ігнорує помилки до першого успіху', async () => {
>   await expect(promiseAny([fail('e1', 1), later('ok', 10), fail('e2', 2)])).resolves.toBe('ok')
> })
>
> test('any: усі відхилені — AggregateError з помилками в порядку вводу', async () => {
>   let error
>   try {
>     await promiseAny([fail('slow', 10), fail('fast', 1)])
>   } catch (e) {
>     error = e
>   }
>   expect(error instanceof AggregateError).toBe(true)
>   expect(error.errors).toEqual(['slow', 'fast'])
> })
>
> test('any: порожній ввід — одразу AggregateError', async () => {
>   await expect(promiseAny([])).rejects.toThrow(AggregateError)
> })
> ```
>
> > [!hint]- Підказка 1
> > `race` — найпростіший: підпиши `resolve` і `reject` на кожен елемент. Порожній цикл нічого не підпише — проміс сам лишиться pending.
>
> > [!hint]- Підказка 2
> > `any` — дзеркало `all`: лічильник рахує **помилки**, а помилки пишуться за індексом. `new AggregateError(errors, message)`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function promiseRace(iterable) {
> >   return new Promise((resolve, reject) => {
> >     for (const item of iterable) Promise.resolve(item).then(resolve, reject)
> >   })
> > }
> >
> > function promiseAny(iterable) {
> >   return new Promise((resolve, reject) => {
> >     const items = Array.from(iterable)
> >     const errors = new Array(items.length)
> >     let remaining = items.length
> >     if (remaining === 0) return reject(new AggregateError(errors, 'All promises were rejected'))
> >     items.forEach((item, i) => {
> >       Promise.resolve(item).then(resolve, (error) => {
> >         errors[i] = error
> >         if (--remaining === 0) reject(new AggregateError(errors, 'All promises were rejected'))
> >       })
> >     })
> >   })
> > }
> > ```
> > **Складність:** O(n) обидві. **Чому так:** «перший виграє» — властивість самого промісу: після першого `resolve`/`reject` наступні ігноруються. **Що спитають далі:** «де `race` в реальному коді?» — таймаути; «де `any`?» — запит до кількох дзеркал/CDN, береться найшвидша успішна відповідь.

> [!task] Таймаут для промісу
> level: middle · difficulty: medium · id: jsk-05-task-06 · tags: promises, timers
>
> Напиши `withTimeout(promise, ms)`:
>
> - якщо `promise` завершився раніше за `ms` — повертає його результат чи помилку;
> - інакше відхиляється помилкою з `name === 'TimeoutError'` і повідомленням, що містить `Timeout`;
> - **таймер прибирається**, щойно результат відомий (жодних «висячих» таймерів);
> - `promise` може бути і звичайним значенням.
>
> ```js starter
> function withTimeout(promise, ms) {
>   // твій код
> }
> ```
>
> ```js tests
> const later = (value, ms) => new Promise((resolve) => setTimeout(resolve, ms, value))
>
> test('встиг — повертає результат', async () => {
>   await expect(withTimeout(later('ok', 2), 50)).resolves.toBe('ok')
> })
>
> test('не встиг — TimeoutError', async () => {
>   let error
>   try {
>     await withTimeout(new Promise(() => {}), 10)
>   } catch (e) {
>     error = e
>   }
>   expect(error.name).toBe('TimeoutError')
>   expect(error.message).toContain('Timeout')
> })
>
> test('власна помилка промісу пробрасується', async () => {
>   await expect(withTimeout(Promise.reject(new Error('своя')), 50)).rejects.toThrow('своя')
> })
>
> test('спрацьовує рівно через ms (фейкові таймери)', async () => {
>   vi.useFakeTimers()
>   let error = null
>   withTimeout(new Promise(() => {}), 100).catch((e) => { error = e })
>   vi.advanceTimersByTime(99)
>   await sleep(0)
>   expect(error).toBe(null)
>   vi.advanceTimersByTime(1)
>   await sleep(0)
>   expect(error.name).toBe('TimeoutError')
> })
>
> test('прибирає таймер після успіху', async () => {
>   vi.useFakeTimers()
>   await withTimeout(Promise.resolve(1), 1000)
>   expect(vi.getTimerCount()).toBe(0)
> })
>
> test('прибирає таймер після помилки', async () => {
>   vi.useFakeTimers()
>   await withTimeout(Promise.reject(new Error('x')), 1000).catch(() => {})
>   expect(vi.getTimerCount()).toBe(0)
> })
>
> test('звичайне значення', async () => {
>   await expect(withTimeout(5, 10)).resolves.toBe(5)
> })
> ```
>
> > [!hint]- Підказка 1
> > Створи проміс-таймер, що відхиляється через `ms`, і віддай `Promise.race` між ним і `promise`.
>
> > [!hint]- Підказка 2
> > Збережи id таймера в зовнішній змінній і зроби `clearTimeout` у `.finally()` — він виконається **до** того, як завершиться повернений проміс.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function withTimeout(promise, ms) {
> >   let timer
> >   const timeout = new Promise((_, reject) => {
> >     timer = setTimeout(() => {
> >       const error = new Error(`Timeout after ${ms}ms`)
> >       error.name = 'TimeoutError'
> >       reject(error)
> >     }, ms)
> >   })
> >   return Promise.race([Promise.resolve(promise), timeout]).finally(() => clearTimeout(timer))
> > }
> > ```
> > **Складність:** O(1). **Чому так:** `race` віддає першого; `finally` не змінює результат, але гарантує прибирання таймера в обох гілках. **Що спитають далі:** «а сама операція скасовується?» — ні, ми лише перестаємо чекати; справжнє скасування — `AbortSignal.timeout(ms)` у `fetch` або передача сигналу в задачу; «чому `name = 'TimeoutError'`?» — щоб викликач міг відрізнити таймаут від інших помилок (так робить і `AbortSignal.timeout`).

> [!task] Retry з експоненційним backoff
> level: middle · difficulty: medium · id: jsk-05-task-07 · tags: async, retry, backoff
>
> Напиши `retry(fn, { retries = 3, delay = 0, factor = 2 } = {})`:
>
> - викликає `fn(attempt)` (нумерація спроб з **1**); `fn` може повернути значення, проміс або кинути синхронно;
> - при успіху — повертає результат;
> - при помилці — чекає `delay * factor ** (attempt - 1)` мс і пробує знову, загалом не більше `retries + 1` спроб;
> - якщо всі спроби невдалі — відхиляється **останньою** помилкою.
>
> ```js starter
> async function retry(fn, { retries = 3, delay = 0, factor = 2 } = {}) {
>   // твій код
> }
> ```
>
> ```js tests
> test('успіх з першої спроби', async () => {
>   const fn = vi.fn(async () => 'ok')
>   await expect(retry(fn)).resolves.toBe('ok')
>   expect(fn).toHaveBeenCalledTimes(1)
> })
>
> test('успіх з третьої спроби, номери спроб з 1', async () => {
>   const attempts = []
>   const result = await retry(async (attempt) => {
>     attempts.push(attempt)
>     if (attempt < 3) throw new Error(`fail ${attempt}`)
>     return 'done'
>   })
>   expect(result).toBe('done')
>   expect(attempts).toEqual([1, 2, 3])
> })
>
> test('вичерпав спроби — остання помилка', async () => {
>   const fn = vi.fn(async (attempt) => { throw new Error(`fail ${attempt}`) })
>   await expect(retry(fn, { retries: 2 })).rejects.toThrow('fail 3')
>   expect(fn).toHaveBeenCalledTimes(3)
> })
>
> test('retries: 0 — рівно одна спроба', async () => {
>   const fn = vi.fn(() => Promise.reject(new Error('no')))
>   await expect(retry(fn, { retries: 0 })).rejects.toThrow('no')
>   expect(fn).toHaveBeenCalledTimes(1)
> })
>
> test('синхронний throw теж повторюється', async () => {
>   let calls = 0
>   const fn = () => {
>     calls++
>     if (calls === 1) throw new Error('sync')
>     return 'sync ok'
>   }
>   await expect(retry(fn)).resolves.toBe('sync ok')
> })
>
> test('експоненційні паузи між спробами', async () => {
>   const times = []
>   const fn = async () => {
>     times.push(Date.now())
>     throw new Error('x')
>   }
>   await retry(fn, { retries: 2, delay: 10, factor: 3 }).catch(() => {})
>   expect(times).toHaveLength(3)
>   expect(times[1] - times[0]).toBeGreaterThanOrEqual(8)
>   expect(times[2] - times[1]).toBeGreaterThanOrEqual(25)
> })
> ```
>
> > [!hint]- Підказка 1
> > Цикл `for (let attempt = 1; attempt <= retries + 1; attempt++)` з `try { return await fn(attempt) } catch …`.
>
> > [!hint]- Підказка 2
> > `await fn(attempt)` усередині `try` ловить і reject, і синхронний `throw`. Після останньої спроби не чекай — одразу кидай помилку.
>
> > [!solution]- Еталонне рішення
> > ```js
> > async function retry(fn, { retries = 3, delay = 0, factor = 2 } = {}) {
> >   let lastError
> >   for (let attempt = 1; attempt <= retries + 1; attempt++) {
> >     try {
> >       return await fn(attempt)
> >     } catch (error) {
> >       lastError = error
> >       if (attempt > retries) break
> >       const wait = delay * factor ** (attempt - 1)
> >       await new Promise((resolve) => setTimeout(resolve, wait))
> >     }
> >   }
> >   throw lastError
> > }
> > ```
> > **Складність:** O(retries) спроб; сумарне очікування — геометрична прогресія `delay · (factor^retries − 1) / (factor − 1)`. **Чому так:** `return await` усередині `try` — обов'язково: без `await` reject пролетить повз `catch`. **Що спитають далі:** «jitter?» — випадкова частка паузи, щоб тисячі клієнтів не повторювали синхронно (thundering herd); «що не можна повторювати?» — неідемпотентні операції (оплата) без ключа ідемпотентності; помилки 4xx на кшталт 400/401.

> [!task] Пул промісів з обмеженням конкурентності
> level: senior · difficulty: hard · id: jsk-05-task-08 · tags: async, concurrency
>
> Напиши `promisePool(tasks, limit)`: `tasks` — масив **функцій**, що повертають проміс (або значення). Запусти їх так, щоб одночасно виконувалось **не більше `limit`**, і щойно одна завершилась — стартувала наступна (без «пачок»).
>
> - результат — масив значень **у порядку вводу**;
> - перша помилка відхиляє результат, і **нові** задачі після неї не стартують;
> - порожній масив → `[]`; `limit` — ціле ≥ 1, інакше відхилення з `RangeError`.
>
> ```js starter
> function promisePool(tasks, limit) {
>   // твій код
> }
> ```
>
> ```js tests
> const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
>
> test('порядок результатів — як у вводі', async () => {
>   const tasks = [30, 5, 15, 1].map((ms, i) => async () => { await wait(ms); return i })
>   await expect(promisePool(tasks, 2)).resolves.toEqual([0, 1, 2, 3])
> })
>
> test('не більше limit одночасно і саме limit у піку', async () => {
>   let active = 0
>   let peak = 0
>   const tasks = Array.from({ length: 8 }, () => async () => {
>     active++
>     peak = Math.max(peak, active)
>     await wait(5)
>     active--
>   })
>   await promisePool(tasks, 3)
>   expect(peak).toBe(3)
> })
>
> test('наступна задача стартує одразу, а не пачкою', async () => {
>   const log = []
>   const tasks = [
>     async () => { await wait(40); log.push('довга завершилась') },
>     async () => { await wait(5) },
>     async () => { log.push('третя стартувала') },
>   ]
>   await promisePool(tasks, 2)
>   expect(log).toEqual(['третя стартувала', 'довга завершилась'])
> })
>
> test('перша помилка відхиляє і зупиняє запуск нових', async () => {
>   const started = []
>   const tasks = [
>     async () => { started.push(0); throw new Error('впала') },
>     async () => { started.push(1) },
>     async () => { started.push(2) },
>   ]
>   await expect(promisePool(tasks, 1)).rejects.toThrow('впала')
>   await sleep(5)
>   expect(started).toEqual([0])
> })
>
> test('порожній масив і limit більший за кількість задач', async () => {
>   await expect(promisePool([], 2)).resolves.toEqual([])
>   await expect(promisePool([() => 1, () => Promise.resolve(2)], 10)).resolves.toEqual([1, 2])
> })
>
> test('некоректний limit — RangeError', async () => {
>   await expect((async () => promisePool([() => 1], 0))()).rejects.toThrow(RangeError)
> })
> ```
>
> > [!hint]- Підказка 1
> > Спільний лічильник `next` — індекс наступної задачі. Функція `runNext()` бере `next++` і запускає задачу; коли та завершилась — знову `runNext()`.
>
> > [!hint]- Підказка 2
> > Стартуй `min(limit, tasks.length)` «робітників». Окремий лічильник `done` вирішує, коли `resolve(results)`. Прапорець `failed` зупиняє нові запуски.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function promisePool(tasks, limit) {
> >   return new Promise((resolve, reject) => {
> >     if (!Number.isInteger(limit) || limit < 1) throw new RangeError('limit must be a positive integer')
> >     const results = new Array(tasks.length)
> >     if (tasks.length === 0) return resolve(results)
> >     let next = 0
> >     let done = 0
> >     let failed = false
> >
> >     const runNext = () => {
> >       if (failed || next >= tasks.length) return
> >       const index = next++
> >       new Promise((res) => res(tasks[index]())).then(
> >         (value) => {
> >           results[index] = value
> >           done++
> >           if (done === tasks.length) resolve(results)
> >           else runNext()
> >         },
> >         (error) => {
> >           failed = true
> >           reject(error)
> >         },
> >       )
> >     }
> >
> >     for (let i = 0; i < Math.min(limit, tasks.length); i++) runNext()
> >   })
> > }
> > ```
> > **Складність:** O(n) операцій; час ≈ оптимальний розклад з `limit` слотами. **Чому так:** `next++` безпечний — JS однопотоковий, перемикання між «робітниками» лише на асинхронних межах. `new Promise((res) => res(task()))` ловить і синхронний `throw`. Пачки через `Promise.all` по `limit` штук простіші, але одна повільна задача блокує всю пачку. **Що спитають далі:** «limit = 1?» — послідовний запуск; «динамічне додавання задач?» — черга з методом `add` (дивись розділ «Хардкор»); «allSettled-семантика?» — зберігати помилки в результат замість reject.

## 🎤 На співбесіді

> [!interview] Чим відрізняються `Promise.all`, `allSettled`, `race` і `any`?
> level: middle · frequency: дуже часто · id: jsk-05-int-01
>
> ---
>
> `all` — усі успіхи в порядку вводу або перша помилка (fail-fast). `allSettled` — завжди виконується масивом `{status, value | reason}`, чекає всіх. `race` — копіює стан **першого завершеного** (успіх чи помилка), типовий кейс — таймаут. `any` — перший **успіх**; усі помилки → `AggregateError`, кейс — найшвидше з дзеркал. Порожній ввід: `all`/`allSettled` → `[]`, `race` — вічно pending, `any` — одразу `AggregateError`. Жоден із них не скасовує «програвші» проміси.
>
> 📚 [[JavaScript - 09. Promise]] · [MDN: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) · [javascript.info: Promise API](https://javascript.info/promise-api)

> [!interview] Як обмежити кількість одночасних запитів і чому не пачками?
> level: senior · frequency: часто · id: jsk-05-int-02
>
> ---
>
> Пул «робітників»: стартую `limit` задач, кожна після завершення бере наступну за спільним індексом; результати пишу за індексом. Пачки (`for` по шматках + `await Promise.all(chunk)`) простіші, але найповільніша задача пачки простоює всі інші слоти — пропускна здатність падає. Потрібно продумати: семантику помилок (fail-fast чи збирати всі), скасування решти через `AbortController`, retry окремих задач, пріоритети. У продакшні — `p-limit`/`p-queue`.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни]] · [GreatFrontEnd: Map Async Limit](https://www.greatfrontend.com/questions/javascript/map-async-limit) · [BFE.dev: throttle Promises](https://bigfrontend.dev/problem/throttle-Promises)

> [!interview] Як правильно робити retry мережевих запитів?
> level: senior · frequency: часто · id: jsk-05-int-03
>
> ---
>
> Експоненційний backoff (`base · 2^attempt`) з **jitter** — випадковою часткою паузи, щоб клієнти після збою не били сервер синхронно; верхня межа паузи й кількості спроб. Повторювати лише тимчасові помилки (мережа, 429, 503 — з урахуванням `Retry-After`), не 4xx на кшталт 400/401/404. Неідемпотентні операції (POST-оплата) — тільки з ключем ідемпотентності. Плюс загальний таймаут/`AbortSignal`, щоб retry не тривав вічно, і логування кожної спроби.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP]] · [AWS Architecture Blog: Exponential Backoff And Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)

## ⚡ Фішки

> [!reel] 🏁 Promise.race([]) не завершиться ніколи
> Порожня «гонка» не має учасників — проміс назавжди pending. А `Promise.any([])` одразу відхиляється `AggregateError`, `Promise.all([])` — одразу `[]`.

> [!reel] 🪤 `return fn()` у try не ловить reject
> Без `await` проміс повертається «як є», і його відхилення пролітає повз `catch`.
>
> ```js
> try { return await fn() } catch { /* ловить */ }
> ```

> [!reel] 🧵 Пул — це лише `next++`
> JS однопотоковий, тож спільний лічильник між «робітниками» не потребує блокувань: перемикання стається тільки на `await`.

## 🧠 Закріплення

> [!question]- Чому в `promiseAll` результат пишуть за індексом, а не через `push`?
> *дуже часто · код* · `jsk-05-001`
>
> Проміси завершуються в довільному порядку, а контракт `all` — результати **у порядку вводу**. `results[i] = value` прив'язує значення до позиції незалежно від часу завершення.
>
> 📚 [[JavaScript - 09. Promise]] · [MDN: Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

> [!question]- Навіщо `Promise.resolve(item)` у комбінаторах?
> *часто · теорія* · `jsk-05-002`
>
> Уніфікує вхід: звичайне значення стає виконаним промісом, проміс повертається як є, thenable «засвоюється» (викликається його `then`). Після цього всі елементи обробляються однаковим `.then`.
>
> 📚 [[JavaScript - 09. Promise]] · [MDN: Promise.resolve()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)

> [!question]- Що таке `AggregateError`?
> *іноді · теорія* · `jsk-05-003`
>
> Помилка, що містить кілька помилок у полі `errors`. Нею відхиляється `Promise.any`, коли всі проміси відхилені (або ввід порожній). Можна створити вручну: `new AggregateError([e1, e2], 'message')`.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка]] · [MDN: AggregateError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)

> [!question]- Чи скасовує `Promise.race` «програвший» запит?
> *часто · пастка* · `jsk-05-004`
>
> Ні. Проміс — лише результат, а не сама операція. Запит продовжить виконуватися, просто його результат ігнорується. Справжнє скасування — `AbortController` / `AbortSignal.timeout()`.
>
> 📚 [[JavaScript - 10. async і await]] · [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

> [!question]- Чим `delay(0)` відрізняється від `await Promise.resolve()`?
> *часто · теорія* · `jsk-05-005`
>
> `await Promise.resolve()` — мікрозадача: продовження виконається до будь-якого таймера чи рендеру. `delay(0)` — макрозадача (таймер): спершу спорожниться вся черга мікрозадач.
>
> 📚 [[JavaScript - 08. Event Loop]] · [MDN: Using microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)

> [!question]- Що таке jitter у backoff і навіщо він?
> *іноді · теорія* · `jsk-05-006`
>
> Випадкова добавка до паузи між повторами. Без неї тисячі клієнтів, що впали одночасно, повторюють запити синхронними хвилями й знову кладуть сервер (thundering herd). Jitter «розмазує» навантаження в часі.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни]] · [AWS: Exponential Backoff And Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)

> [!question]- Як `promisify` обробляє синхронну помилку у функції?
> *рідко · код* · `jsk-05-007`
>
> Функція викликається всередині executor-а `new Promise(...)`. Executor виконується синхронно, і будь-який виняток у ньому автоматично перетворюється на reject повернутого промісу — окремий `try/catch` не потрібен.
>
> 📚 [[JavaScript - 09. Promise]] · [javascript.info: Promisification](https://javascript.info/promisify)

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Promise API](https://javascript.info/promise-api) — усі комбінатори з прикладами
- 🟢 [javascript.info — Promisification](https://javascript.info/promisify) — `promisify` крок за кроком
- 🟡 [MDN — Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) — стани, ланцюжки, статичні методи
- 🟡 [Node.js — util.promisify](https://nodejs.org/api/util.html#utilpromisifyoriginal) — як це зроблено в Node, включно з `custom`
- 🟡 [AWS Architecture Blog — Exponential Backoff And Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/) — чому без jitter backoff не працює
- 🛠️ [GreatFrontEnd — Promise.all](https://www.greatfrontend.com/questions/javascript/promise-all), [Promise.any](https://www.greatfrontend.com/questions/javascript/promise-any), [Promise Timeout](https://www.greatfrontend.com/questions/javascript/promise-timeout)
- 🛠️ [GreatFrontEnd — Map Async Limit](https://www.greatfrontend.com/questions/javascript/map-async-limit) — варіація пулу
- 🛠️ [BFE.dev — implement async helper sequence()](https://bigfrontend.dev/problem/implement-async-helper-sequence) — послідовний запуск

> [!important] Підсумок
> - Комбінатор = `new Promise` + лічильник у замиканні + запис результату за індексом.
> - `Promise.resolve(item)` уніфікує значення, проміси й thenable; проміс завершується лише раз.
> - Таймаут = `race` з таймером + `finally(clearTimeout)`; це «перестати чекати», а не скасувати.
> - Retry: `return await` у `try`, експоненційна пауза, jitter, лише ідемпотентні операції.
> - Пул: `limit` робітників на спільному `next++` краще за пачки.
