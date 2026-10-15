---
title: Todo-список з фільтрами
order: 1
level: junior
tags: [state, immutability, persistence, undo, adapter]
prerequisites:
  - "[[JavaScript - 03. Значення та посилання]]"
  - "[[JavaScript - 12. Масиви та функціональний стиль]]"
  - "[[JavaScript - 28. Сховища та Web APIs]]"
estimatedMinutes: 90
id: jsp-ch-01
icon: "✅"
---

# JavaScript Projects - 01. Todo-список з фільтрами

> [!success] 🎯 Після цього розділу ти зможеш
> - Тримати стан застосунку **імутабельно** і розуміти, чому `===` стає дешевою перевіркою «чи щось змінилось».
> - Відокремити бізнес-логіку від сховища через **адаптер** (`getItem` / `setItem`) і підмінити `localStorage` на `Map` у тестах.
> - Безпечно читати збережені дані: биті JSON і чужі формати не валять застосунок.
> - Реалізувати **undo/redo** через історію станів.
> - Зібрати все в один фасад `createTodoApp` з `dispatch` і `subscribe`.

## 🎯 Що збудуємо

TodoMVC-подібний список: додати, відмітити, перейменувати, видалити, фільтри «всі / активні / виконані», лічильник, «очистити виконані», undo/redo і збереження між перезавантаженнями. Ядро — **чисті функції** над масивом задач; зверху — фасад, який склеює їх зі сховищем та історією.

```text
                 ┌───────────── createTodoApp ─────────────┐
 UI (DOM) ──────▶│ dispatch({ type: 'add', title })        │
   ▲             │      │                                   │
   │             │      ▼                                   │
   │             │ чисті функції: addTodo / toggleTodo /    │
   │             │ removeTodo / renameTodo / clearDone      │
   │             │      │ новий масив (або той самий)       │
   │             │      ▼                                   │
   │             │ history.push ──▶ saveTodos(storage) ─────┼──▶ storage-адаптер
   │             │      │                                   │    (localStorage | Map)
   └─subscribe───┼── notify(getState()) ◀── filterTodos,    │
                 │                          getStats        │
                 └─────────────────────────────────────────┘
```

Ключова ідея: **кожна зміна повертає новий масив, а «нічого не змінилось» — той самий масив**. Тоді фасаду досить перевірити `next === prev`, щоб не писати в сховище, не засмічувати історію і не перемальовувати UI.

## 🧭 План кроків

1. `addTodo` — додаємо задачу імутабельно, валідуємо назву. Теорія: [[JavaScript - 03. Значення та посилання]].
2. `toggleTodo`, `removeTodo`, `renameTodo` — оновлення зі **structural sharing**.
3. `filterTodos`, `getStats`, `clearDone` — похідні дані. Теорія: [[JavaScript - 12. Масиви та функціональний стиль]].
4. `createMemoryStorage`, `saveTodos`, `loadTodos` — persistence через адаптер. Теорія: [[JavaScript - 28. Сховища та Web APIs]], [[JavaScript - 23. JSON, structuredClone і серіалізація]].
5. `createHistory` — undo/redo. Теорія: патерни Memento і Command у [[JavaScript - 32. Патерни проєктування]].
6. `createTodoApp` — фасад: `dispatch`, `subscribe`, фільтр, автозбереження.

## 🧩 Розминка

> [!quiz] Заповни пропуски в імутабельному оновленні
> level: junior · type: fill · id: jsp-01-quiz-01 · bank: push, forEach, true
>
> ```js fill
> function updateTodo(todos, id, update) {
>   let changed = false
>   const next = todos.[[map]]((todo) => {
>     if (todo.id !== id) return [[todo]]
>     const updated = update(todo)
>     if (updated !== todo) changed = true
>     return updated
>   })
>   return changed ? next : [[todos]]
> }
> ```
>
> **Пояснення:** незмінені елементи повертаємо **тими самими об'єктами** — це structural sharing. А якщо нічого не змінилось, віддаємо *вихідний* масив: так виклик `toggleTodo(todos, 999)` не створює «фальшиву» зміну.

> [!quiz] Склади undo для історії станів
> level: middle · type: order · id: jsp-01-quiz-02
>
> ```js order
> undo() {
>   if (past.length === 0) return present
>   future = [present, ...future]
>   present = past[past.length - 1]
>   past = past.slice(0, -1)
>   return present
> }
> past.push(present) // ✗
> ```
>
> **Пояснення:** поточний стан іде на початок `future` (щоб `redo` його повернув), новим `present` стає останній з `past`. Мутувати `past.push` тут не можна — це не та операція: undo *забирає* з минулого, а не додає.

## 🛠️ Крок 1. Додаємо задачі

Задача — простий об'єкт `{ id, title, done }`. Масив задач **ніколи не мутуємо**: кожна функція повертає новий масив. id — наступне ціле після найбільшого наявного, щоб не залежати від часу чи випадковості (тести детерміновані).

> [!task] Крок 1 · addTodo
> level: junior · difficulty: easy · id: jsp-01-task-01 · tags: immutability, arrays
>
> Напиши дві функції:
>
> - `nextId(todos)` — найбільший `id` у масиві + 1 (для порожнього — `1`);
> - `addTodo(todos, title)` — повертає **новий** масив з новою задачею в кінці: `{ id: nextId(todos), title, done: false }`. Назву обрізай від пробілів (`trim`). Порожня назва (або лише пробіли) → кинь `Error` з текстом `'Назва задачі не може бути порожньою'`.
>
> ```js starter
> function nextId(todos) {
>   // твій код
> }
>
> function addTodo(todos, title) {
>   // твій код
> }
> ```
>
> ```js tests
> test('додає задачу в кінець з done: false', () => {
>   expect(addTodo([], 'Купити хліб')).toEqual([{ id: 1, title: 'Купити хліб', done: false }])
> })
>
> test('id росте від найбільшого наявного', () => {
>   const todos = addTodo(addTodo([], 'a'), 'b')
>   expect(todos.map((t) => t.id)).toEqual([1, 2])
>   expect(nextId([{ id: 7, title: 'x', done: false }, { id: 3, title: 'y', done: true }])).toBe(8)
> })
>
> test('обрізає пробіли в назві', () => {
>   expect(addTodo([], '   Прочитати книжку  ')[0].title).toBe('Прочитати книжку')
> })
>
> test('порожня назва — помилка', () => {
>   expect(() => addTodo([], '')).toThrow('не може бути порожньою')
>   expect(() => addTodo([], '    ')).toThrow('не може бути порожньою')
> })
>
> test('не мутує вхідний масив', () => {
>   const before = Object.freeze([{ id: 1, title: 'a', done: false }])
>   const after = addTodo(before, 'b')
>   expect(before).toHaveLength(1)
>   expect(after).not.toBe(before)
>   expect(after[0]).toBe(before[0])
> })
> ```
>
> > [!hint]- Підказка 1
> > `reduce` з початковим `0`: `todos.reduce((max, t) => Math.max(max, t.id), 0) + 1`.
>
> > [!hint]- Підказка 2
> > Новий масив — spread: `[...todos, newTodo]`. `push` впаде на замороженому масиві в тесті — і це добре: він ловить мутацію.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function nextId(todos) {
> >   return todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1
> > }
> >
> > function addTodo(todos, title) {
> >   const text = String(title ?? '').trim()
> >   if (text === '') throw new Error('Назва задачі не може бути порожньою')
> >   return [...todos, { id: nextId(todos), title: text, done: false }]
> > }
> > ```
> > **Чому так:** імутабельне додавання — `[...todos, item]` — зберігає старі об'єкти (тест перевіряє `after[0] === before[0]`), тому порівняння «що змінилось» лишається дешевим. Валідація на вході — найраніша точка, де можна відкинути сміття: далі весь код може вважати назву непорожньою. `String(title ?? '')` захищає від `undefined` і чисел.

## 🛠️ Крок 2. Оновлення без мутацій

Три операції однієї форми: знайти задачу за `id`, повернути масив, де замінено лише її. Спільну частину виносимо в `updateTodo` — і отримуємо безкоштовну оптимізацію: якщо нічого не змінилось, повертаємо **той самий** масив.

> [!task] Крок 2 · toggle, remove, rename
> level: junior · difficulty: easy · id: jsp-01-task-02 · tags: immutability, structural-sharing
>
> Додай до коду з кроку 1:
>
> - `updateTodo(todos, id, update)` — застосовує `update(todo)` до задачі з цим `id`; якщо `update` повернув той самий об'єкт або задачі немає — повертає **вихідний масив** (`===`);
> - `toggleTodo(todos, id)` — перемикає `done`;
> - `removeTodo(todos, id)` — видаляє; якщо такої задачі немає — повертає вихідний масив;
> - `renameTodo(todos, id, title)` — нова назва з `trim`; **порожня назва видаляє задачу** (як у TodoMVC); та сама назва — без змін.
>
> Незмінені задачі мають лишитися тими самими об'єктами.
>
> ```js starter
> function nextId(todos) {
>   return todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1
> }
>
> function addTodo(todos, title) {
>   const text = String(title ?? '').trim()
>   if (text === '') throw new Error('Назва задачі не може бути порожньою')
>   return [...todos, { id: nextId(todos), title: text, done: false }]
> }
>
> function updateTodo(todos, id, update) {
>   // твій код
> }
>
> function toggleTodo(todos, id) {
>   // твій код
> }
>
> function removeTodo(todos, id) {
>   // твій код
> }
>
> function renameTodo(todos, id, title) {
>   // твій код
> }
> ```
>
> ```js tests
> const base = () => [
>   { id: 1, title: 'a', done: false },
>   { id: 2, title: 'b', done: true },
> ]
>
> test('toggle перемикає done і не чіпає інші задачі', () => {
>   const todos = base()
>   const next = toggleTodo(todos, 1)
>   expect(next[0]).toEqual({ id: 1, title: 'a', done: true })
>   expect(next[1]).toBe(todos[1])
>   expect(todos[0].done).toBe(false)
> })
>
> test('невідомий id — той самий масив', () => {
>   const todos = base()
>   expect(toggleTodo(todos, 99)).toBe(todos)
>   expect(removeTodo(todos, 99)).toBe(todos)
>   expect(renameTodo(todos, 99, 'x')).toBe(todos)
> })
>
> test('remove видаляє задачу', () => {
>   expect(removeTodo(base(), 1)).toEqual([{ id: 2, title: 'b', done: true }])
> })
>
> test('rename обрізає пробіли, та сама назва — без змін', () => {
>   const todos = base()
>   expect(renameTodo(todos, 2, '  нова  ')[1].title).toBe('нова')
>   expect(renameTodo(todos, 2, ' b ')).toBe(todos)
> })
>
> test('порожня назва видаляє задачу', () => {
>   expect(renameTodo(base(), 1, '   ')).toEqual([{ id: 2, title: 'b', done: true }])
> })
>
> test('updateTodo повертає той самий масив, якщо update нічого не змінив', () => {
>   const todos = base()
>   expect(updateTodo(todos, 1, (t) => t)).toBe(todos)
> })
> ```
>
> > [!hint]- Підказка 1
> > У `updateTodo` пройди `map`-ом і заведи прапорець `changed`: він стає `true`, лише якщо `update(todo) !== todo`.
>
> > [!hint]- Підказка 2
> > `removeTodo`: `filter`, а потім порівняй довжини — однакові означають, що нічого не видалено.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function nextId(todos) {
> >   return todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1
> > }
> >
> > function addTodo(todos, title) {
> >   const text = String(title ?? '').trim()
> >   if (text === '') throw new Error('Назва задачі не може бути порожньою')
> >   return [...todos, { id: nextId(todos), title: text, done: false }]
> > }
> >
> > function updateTodo(todos, id, update) {
> >   let changed = false
> >   const next = todos.map((todo) => {
> >     if (todo.id !== id) return todo
> >     const updated = update(todo)
> >     if (updated !== todo) changed = true
> >     return updated
> >   })
> >   return changed ? next : todos
> > }
> >
> > function toggleTodo(todos, id) {
> >   return updateTodo(todos, id, (todo) => ({ ...todo, done: !todo.done }))
> > }
> >
> > function removeTodo(todos, id) {
> >   const next = todos.filter((todo) => todo.id !== id)
> >   return next.length === todos.length ? todos : next
> > }
> >
> > function renameTodo(todos, id, title) {
> >   const text = String(title ?? '').trim()
> >   if (text === '') return removeTodo(todos, id)
> >   return updateTodo(todos, id, (todo) => (todo.title === text ? todo : { ...todo, title: text }))
> > }
> > ```
> > **Чому так:** «той самий масив, якщо нічого не змінилось» — контракт, на якому стоїть увесь фасад: на кроці 6 `next === prev` означатиме «не зберігати, не писати в історію, не сповіщати». Structural sharing (незмінені задачі — ті самі об'єкти) дає React-у, мемоізованим селекторам і нашому diff дешеве порівняння за посиланням. Спільний `updateTodo` прибирає дублювання — це вже маленький «редьюсер».

## 🛠️ Крок 3. Фільтри та статистика

Фільтр — не окремий стан списку, а **похідні дані**: ми не зберігаємо «активні задачі», а обчислюємо їх з повного масиву. Предикати тримаємо в об'єкті-мапі — додати новий фільтр означає додати один рядок.

> [!task] Крок 3 · filterTodos, getStats, clearDone
> level: junior · difficulty: easy · id: jsp-01-task-03 · tags: arrays, derived-state
>
> Додай:
>
> - `FILTERS` — об'єкт предикатів `all`, `active`, `done`;
> - `filterTodos(todos, filter = 'all')` — задачі, що проходять фільтр; невідомий фільтр → `Error` з текстом `'Невідомий фільтр: <назва>'`. Увага: `'toString'` теж невідомий фільтр!
> - `getStats(todos)` → `{ total, active, done }`;
> - `clearDone(todos)` — прибирає виконані; якщо їх немає — повертає вихідний масив.
>
> ```js starter
> function nextId(todos) {
>   return todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1
> }
>
> function addTodo(todos, title) {
>   const text = String(title ?? '').trim()
>   if (text === '') throw new Error('Назва задачі не може бути порожньою')
>   return [...todos, { id: nextId(todos), title: text, done: false }]
> }
>
> function updateTodo(todos, id, update) {
>   let changed = false
>   const next = todos.map((todo) => {
>     if (todo.id !== id) return todo
>     const updated = update(todo)
>     if (updated !== todo) changed = true
>     return updated
>   })
>   return changed ? next : todos
> }
>
> function toggleTodo(todos, id) {
>   return updateTodo(todos, id, (todo) => ({ ...todo, done: !todo.done }))
> }
>
> function removeTodo(todos, id) {
>   const next = todos.filter((todo) => todo.id !== id)
>   return next.length === todos.length ? todos : next
> }
>
> function renameTodo(todos, id, title) {
>   const text = String(title ?? '').trim()
>   if (text === '') return removeTodo(todos, id)
>   return updateTodo(todos, id, (todo) => (todo.title === text ? todo : { ...todo, title: text }))
> }
>
> const FILTERS = {
>   // твій код
> }
>
> function filterTodos(todos, filter = 'all') {
>   // твій код
> }
>
> function getStats(todos) {
>   // твій код
> }
>
> function clearDone(todos) {
>   // твій код
> }
> ```
>
> ```js tests
> const todos = [
>   { id: 1, title: 'a', done: false },
>   { id: 2, title: 'b', done: true },
>   { id: 3, title: 'c', done: false },
> ]
>
> test('фільтри all / active / done', () => {
>   expect(filterTodos(todos).map((t) => t.id)).toEqual([1, 2, 3])
>   expect(filterTodos(todos, 'active').map((t) => t.id)).toEqual([1, 3])
>   expect(filterTodos(todos, 'done').map((t) => t.id)).toEqual([2])
> })
>
> test('невідомий фільтр — помилка, навіть якщо це метод Object.prototype', () => {
>   expect(() => filterTodos(todos, 'urgent')).toThrow('Невідомий фільтр: urgent')
>   expect(() => filterTodos(todos, 'toString')).toThrow('Невідомий фільтр')
> })
>
> test('статистика', () => {
>   expect(getStats(todos)).toEqual({ total: 3, active: 2, done: 1 })
>   expect(getStats([])).toEqual({ total: 0, active: 0, done: 0 })
> })
>
> test('clearDone прибирає виконані', () => {
>   expect(clearDone(todos).map((t) => t.id)).toEqual([1, 3])
> })
>
> test('clearDone без виконаних — той самий масив', () => {
>   const active = todos.filter((t) => !t.done)
>   expect(clearDone(active)).toBe(active)
> })
> ```
>
> > [!hint]- Підказка 1
> > `FILTERS[filter]` для `'toString'` поверне `Object.prototype.toString` — функцію! Перевіряй власні ключі: `Object.hasOwn(FILTERS, filter)`.
>
> > [!hint]- Підказка 2
> > `clearDone` — це `filter` за предикатом `FILTERS.active`, але спершу перевір `todos.some(FILTERS.done)`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function nextId(todos) {
> >   return todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1
> > }
> >
> > function addTodo(todos, title) {
> >   const text = String(title ?? '').trim()
> >   if (text === '') throw new Error('Назва задачі не може бути порожньою')
> >   return [...todos, { id: nextId(todos), title: text, done: false }]
> > }
> >
> > function updateTodo(todos, id, update) {
> >   let changed = false
> >   const next = todos.map((todo) => {
> >     if (todo.id !== id) return todo
> >     const updated = update(todo)
> >     if (updated !== todo) changed = true
> >     return updated
> >   })
> >   return changed ? next : todos
> > }
> >
> > function toggleTodo(todos, id) {
> >   return updateTodo(todos, id, (todo) => ({ ...todo, done: !todo.done }))
> > }
> >
> > function removeTodo(todos, id) {
> >   const next = todos.filter((todo) => todo.id !== id)
> >   return next.length === todos.length ? todos : next
> > }
> >
> > function renameTodo(todos, id, title) {
> >   const text = String(title ?? '').trim()
> >   if (text === '') return removeTodo(todos, id)
> >   return updateTodo(todos, id, (todo) => (todo.title === text ? todo : { ...todo, title: text }))
> > }
> >
> > const FILTERS = {
> >   all: () => true,
> >   active: (todo) => !todo.done,
> >   done: (todo) => todo.done,
> > }
> >
> > function filterTodos(todos, filter = 'all') {
> >   if (!Object.hasOwn(FILTERS, filter)) throw new Error(`Невідомий фільтр: ${filter}`)
> >   return todos.filter(FILTERS[filter])
> > }
> >
> > function getStats(todos) {
> >   const done = todos.filter(FILTERS.done).length
> >   return { total: todos.length, active: todos.length - done, done }
> > }
> >
> > function clearDone(todos) {
> >   return todos.some(FILTERS.done) ? todos.filter(FILTERS.active) : todos
> > }
> > ```
> > **Чому так:** мапа предикатів — патерн Strategy в мініатюрі: новий фільтр «сьогодні» — один рядок, без `switch`. `Object.hasOwn` закриває класичну дірку «ключ з прототипу»: `FILTERS['constructor']` теж існує. Похідні дані (видимі задачі, лічильники) **не зберігаємо** — інакше їх треба синхронізувати з основним масивом, і рано чи пізно вони розійдуться.

## 🛠️ Крок 4. Збереження через адаптер

Бізнес-логіка не повинна знати, **де** лежать дані. Вона говорить з адаптером, що має інтерфейс `localStorage`: `getItem`, `setItem`, `removeItem`. У браузері передамо справжній `localStorage`, у тестах — обгортку над `Map`. Дані з диска — **недовірені**: їх міг зіпсувати користувач, стара версія застосунку або інше розширення.

> [!task] Крок 4 · createMemoryStorage, saveTodos, loadTodos
> level: junior · difficulty: medium · id: jsp-01-task-04 · tags: persistence, adapter, json
>
> Додай:
>
> - `createMemoryStorage(map = new Map())` — адаптер з `getItem(key)` (немає ключа → `null`, як у `localStorage`), `setItem(key, value)` (зберігає **рядок**: `String(value)`), `removeItem(key)`;
> - `STORAGE_KEY = 'todos:v1'`;
> - `saveTodos(storage, todos)` — `JSON.stringify` під ключем `STORAGE_KEY`;
> - `loadTodos(storage)` — масив задач. Немає даних, битий JSON, не масив → `[]`. Елементи, що не схожі на задачу (`id` — ціле число, `title` — рядок, `done` — boolean), відкидай.
>
> ```js starter
> function nextId(todos) {
>   return todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1
> }
>
> function addTodo(todos, title) {
>   const text = String(title ?? '').trim()
>   if (text === '') throw new Error('Назва задачі не може бути порожньою')
>   return [...todos, { id: nextId(todos), title: text, done: false }]
> }
>
> function updateTodo(todos, id, update) {
>   let changed = false
>   const next = todos.map((todo) => {
>     if (todo.id !== id) return todo
>     const updated = update(todo)
>     if (updated !== todo) changed = true
>     return updated
>   })
>   return changed ? next : todos
> }
>
> function toggleTodo(todos, id) {
>   return updateTodo(todos, id, (todo) => ({ ...todo, done: !todo.done }))
> }
>
> function removeTodo(todos, id) {
>   const next = todos.filter((todo) => todo.id !== id)
>   return next.length === todos.length ? todos : next
> }
>
> function renameTodo(todos, id, title) {
>   const text = String(title ?? '').trim()
>   if (text === '') return removeTodo(todos, id)
>   return updateTodo(todos, id, (todo) => (todo.title === text ? todo : { ...todo, title: text }))
> }
>
> const FILTERS = {
>   all: () => true,
>   active: (todo) => !todo.done,
>   done: (todo) => todo.done,
> }
>
> function filterTodos(todos, filter = 'all') {
>   if (!Object.hasOwn(FILTERS, filter)) throw new Error(`Невідомий фільтр: ${filter}`)
>   return todos.filter(FILTERS[filter])
> }
>
> function getStats(todos) {
>   const done = todos.filter(FILTERS.done).length
>   return { total: todos.length, active: todos.length - done, done }
> }
>
> function clearDone(todos) {
>   return todos.some(FILTERS.done) ? todos.filter(FILTERS.active) : todos
> }
>
> function createMemoryStorage(map = new Map()) {
>   // твій код
> }
>
> const STORAGE_KEY = 'todos:v1'
>
> function saveTodos(storage, todos) {
>   // твій код
> }
>
> function loadTodos(storage) {
>   // твій код
> }
> ```
>
> ```js tests
> test('memory storage поводиться як localStorage', () => {
>   const storage = createMemoryStorage()
>   expect(storage.getItem('missing')).toBeNull()
>   storage.setItem('n', 5)
>   expect(storage.getItem('n')).toBe('5')
>   storage.removeItem('n')
>   expect(storage.getItem('n')).toBeNull()
> })
>
> test('save → load повертає ті самі задачі', () => {
>   const map = new Map()
>   const todos = addTodo(addTodo([], 'a'), 'b')
>   saveTodos(createMemoryStorage(map), todos)
>   expect(typeof map.get('todos:v1')).toBe('string')
>   expect(loadTodos(createMemoryStorage(map))).toEqual(todos)
> })
>
> test('порожнє сховище — порожній список', () => {
>   expect(loadTodos(createMemoryStorage())).toEqual([])
> })
>
> test('битий JSON не валить застосунок', () => {
>   const storage = createMemoryStorage(new Map([['todos:v1', '{oops']]))
>   expect(loadTodos(storage)).toEqual([])
> })
>
> test('чужий формат і сміттєві елементи відкидаються', () => {
>   const notArray = createMemoryStorage(new Map([['todos:v1', '{"a":1}']]))
>   expect(loadTodos(notArray)).toEqual([])
>   const mixed = createMemoryStorage(new Map([['todos:v1', JSON.stringify([{ id: 1, title: 'ok', done: false }, { id: '2', title: 'bad', done: false }, null, 42])]]))
>   expect(loadTodos(mixed)).toEqual([{ id: 1, title: 'ok', done: false }])
> })
> ```
>
> > [!hint]- Підказка 1
> > `map.has(key) ? map.get(key) : null` — саме `null`, бо так відповідає `localStorage.getItem`.
>
> > [!hint]- Підказка 2
> > `JSON.parse` у `try/catch`, потім `Array.isArray(data) ? data.filter(isTodo) : []`. Окрема функція `isTodo(x)` перевіряє типи полів (і що `x` — не `null`).
>
> > [!solution]- Еталонне рішення
> > ```js
> > function nextId(todos) {
> >   return todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1
> > }
> >
> > function addTodo(todos, title) {
> >   const text = String(title ?? '').trim()
> >   if (text === '') throw new Error('Назва задачі не може бути порожньою')
> >   return [...todos, { id: nextId(todos), title: text, done: false }]
> > }
> >
> > function updateTodo(todos, id, update) {
> >   let changed = false
> >   const next = todos.map((todo) => {
> >     if (todo.id !== id) return todo
> >     const updated = update(todo)
> >     if (updated !== todo) changed = true
> >     return updated
> >   })
> >   return changed ? next : todos
> > }
> >
> > function toggleTodo(todos, id) {
> >   return updateTodo(todos, id, (todo) => ({ ...todo, done: !todo.done }))
> > }
> >
> > function removeTodo(todos, id) {
> >   const next = todos.filter((todo) => todo.id !== id)
> >   return next.length === todos.length ? todos : next
> > }
> >
> > function renameTodo(todos, id, title) {
> >   const text = String(title ?? '').trim()
> >   if (text === '') return removeTodo(todos, id)
> >   return updateTodo(todos, id, (todo) => (todo.title === text ? todo : { ...todo, title: text }))
> > }
> >
> > const FILTERS = {
> >   all: () => true,
> >   active: (todo) => !todo.done,
> >   done: (todo) => todo.done,
> > }
> >
> > function filterTodos(todos, filter = 'all') {
> >   if (!Object.hasOwn(FILTERS, filter)) throw new Error(`Невідомий фільтр: ${filter}`)
> >   return todos.filter(FILTERS[filter])
> > }
> >
> > function getStats(todos) {
> >   const done = todos.filter(FILTERS.done).length
> >   return { total: todos.length, active: todos.length - done, done }
> > }
> >
> > function clearDone(todos) {
> >   return todos.some(FILTERS.done) ? todos.filter(FILTERS.active) : todos
> > }
> >
> > function createMemoryStorage(map = new Map()) {
> >   return {
> >     getItem: (key) => (map.has(key) ? map.get(key) : null),
> >     setItem: (key, value) => {
> >       map.set(key, String(value))
> >     },
> >     removeItem: (key) => {
> >       map.delete(key)
> >     },
> >   }
> > }
> >
> > const STORAGE_KEY = 'todos:v1'
> >
> > function saveTodos(storage, todos) {
> >   storage.setItem(STORAGE_KEY, JSON.stringify(todos))
> > }
> >
> > function isTodo(value) {
> >   return value !== null && typeof value === 'object' && Number.isInteger(value.id) && typeof value.title === 'string' && typeof value.done === 'boolean'
> > }
> >
> > function loadTodos(storage) {
> >   const raw = storage.getItem(STORAGE_KEY)
> >   if (raw === null) return []
> >   try {
> >     const data = JSON.parse(raw)
> >     return Array.isArray(data) ? data.filter(isTodo) : []
> >   } catch {
> >     return []
> >   }
> > }
> > ```
> > **Чому так:** адаптер (Adapter / Dependency Injection) робить логіку тестованою без браузера і дає змогу завтра підставити IndexedDB чи сервер. `String(value)` повторює поведінку `localStorage`, який усе перетворює на рядки — так тести ловлять ті самі баги, що й продакшн. Версія в ключі (`v1`) — задел на міграції: коли формат зміниться, `todos:v2` не прочитає старі дані як нові. Валідація на читанні — принцип «будь ліберальним у тому, що приймаєш»: краще втратити один зіпсований запис, ніж увесь застосунок.

## 🛠️ Крок 5. Undo / redo

Історія — три змінні: `past` (стек минулих станів), `present`, `future` (стек скасованих). Імутабельність робить це тривіальним: ми зберігаємо **посилання** на старі масиви, а не глибокі копії, бо їх ніхто не змінить.

> [!task] Крок 5 · createHistory
> level: middle · difficulty: medium · id: jsp-01-task-05 · tags: undo, memento
>
> Додай `createHistory(initial, limit = 100)`, що повертає об'єкт:
>
> - `present` — геттер поточного стану;
> - `push(state)` — новий стан; старий іде в `past`, `future` очищується. Якщо `state === present` — нічого не робить. У `past` зберігається не більше `limit` станів (найстаріші відкидаються);
> - `undo()` / `redo()` — переходять назад / вперед і повертають новий `present`; якщо нікуди — повертають поточний;
> - `canUndo()` / `canRedo()`.
>
> ```js starter
> function nextId(todos) {
>   return todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1
> }
>
> function addTodo(todos, title) {
>   const text = String(title ?? '').trim()
>   if (text === '') throw new Error('Назва задачі не може бути порожньою')
>   return [...todos, { id: nextId(todos), title: text, done: false }]
> }
>
> function updateTodo(todos, id, update) {
>   let changed = false
>   const next = todos.map((todo) => {
>     if (todo.id !== id) return todo
>     const updated = update(todo)
>     if (updated !== todo) changed = true
>     return updated
>   })
>   return changed ? next : todos
> }
>
> function toggleTodo(todos, id) {
>   return updateTodo(todos, id, (todo) => ({ ...todo, done: !todo.done }))
> }
>
> function removeTodo(todos, id) {
>   const next = todos.filter((todo) => todo.id !== id)
>   return next.length === todos.length ? todos : next
> }
>
> function renameTodo(todos, id, title) {
>   const text = String(title ?? '').trim()
>   if (text === '') return removeTodo(todos, id)
>   return updateTodo(todos, id, (todo) => (todo.title === text ? todo : { ...todo, title: text }))
> }
>
> const FILTERS = {
>   all: () => true,
>   active: (todo) => !todo.done,
>   done: (todo) => todo.done,
> }
>
> function filterTodos(todos, filter = 'all') {
>   if (!Object.hasOwn(FILTERS, filter)) throw new Error(`Невідомий фільтр: ${filter}`)
>   return todos.filter(FILTERS[filter])
> }
>
> function getStats(todos) {
>   const done = todos.filter(FILTERS.done).length
>   return { total: todos.length, active: todos.length - done, done }
> }
>
> function clearDone(todos) {
>   return todos.some(FILTERS.done) ? todos.filter(FILTERS.active) : todos
> }
>
> function createMemoryStorage(map = new Map()) {
>   return {
>     getItem: (key) => (map.has(key) ? map.get(key) : null),
>     setItem: (key, value) => {
>       map.set(key, String(value))
>     },
>     removeItem: (key) => {
>       map.delete(key)
>     },
>   }
> }
>
> const STORAGE_KEY = 'todos:v1'
>
> function saveTodos(storage, todos) {
>   storage.setItem(STORAGE_KEY, JSON.stringify(todos))
> }
>
> function isTodo(value) {
>   return value !== null && typeof value === 'object' && Number.isInteger(value.id) && typeof value.title === 'string' && typeof value.done === 'boolean'
> }
>
> function loadTodos(storage) {
>   const raw = storage.getItem(STORAGE_KEY)
>   if (raw === null) return []
>   try {
>     const data = JSON.parse(raw)
>     return Array.isArray(data) ? data.filter(isTodo) : []
>   } catch {
>     return []
>   }
> }
>
> function createHistory(initial, limit = 100) {
>   // твій код
> }
> ```
>
> ```js tests
> test('undo повертає попередній стан, redo — наступний', () => {
>   const h = createHistory('a')
>   h.push('b')
>   h.push('c')
>   expect(h.undo()).toBe('b')
>   expect(h.undo()).toBe('a')
>   expect(h.redo()).toBe('b')
>   expect(h.present).toBe('b')
> })
>
> test('push після undo очищує future', () => {
>   const h = createHistory(1)
>   h.push(2)
>   h.undo()
>   h.push(3)
>   expect(h.canRedo()).toBe(false)
>   expect(h.redo()).toBe(3)
> })
>
> test('той самий стан не потрапляє в історію', () => {
>   const state = [1]
>   const h = createHistory(state)
>   h.push(state)
>   expect(h.canUndo()).toBe(false)
> })
>
> test('limit обмежує глибину undo', () => {
>   const h = createHistory(0, 2)
>   h.push(1)
>   h.push(2)
>   h.push(3)
>   expect(h.undo()).toBe(2)
>   expect(h.undo()).toBe(1)
>   expect(h.canUndo()).toBe(false)
>   expect(h.undo()).toBe(1)
> })
>
> test('порожня історія', () => {
>   const h = createHistory('x')
>   expect(h.canUndo()).toBe(false)
>   expect(h.canRedo()).toBe(false)
>   expect(h.undo()).toBe('x')
>   expect(h.redo()).toBe('x')
> })
> ```
>
> > [!hint]- Підказка 1
> > `push`: `past = [...past, present].slice(-limit)` — `slice` з від'ємним аргументом лишає останні `limit` елементів.
>
> > [!hint]- Підказка 2
> > `redo` дзеркальний до `undo`: поточний іде в кінець `past`, новим `present` стає `future[0]`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function nextId(todos) {
> >   return todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1
> > }
> >
> > function addTodo(todos, title) {
> >   const text = String(title ?? '').trim()
> >   if (text === '') throw new Error('Назва задачі не може бути порожньою')
> >   return [...todos, { id: nextId(todos), title: text, done: false }]
> > }
> >
> > function updateTodo(todos, id, update) {
> >   let changed = false
> >   const next = todos.map((todo) => {
> >     if (todo.id !== id) return todo
> >     const updated = update(todo)
> >     if (updated !== todo) changed = true
> >     return updated
> >   })
> >   return changed ? next : todos
> > }
> >
> > function toggleTodo(todos, id) {
> >   return updateTodo(todos, id, (todo) => ({ ...todo, done: !todo.done }))
> > }
> >
> > function removeTodo(todos, id) {
> >   const next = todos.filter((todo) => todo.id !== id)
> >   return next.length === todos.length ? todos : next
> > }
> >
> > function renameTodo(todos, id, title) {
> >   const text = String(title ?? '').trim()
> >   if (text === '') return removeTodo(todos, id)
> >   return updateTodo(todos, id, (todo) => (todo.title === text ? todo : { ...todo, title: text }))
> > }
> >
> > const FILTERS = {
> >   all: () => true,
> >   active: (todo) => !todo.done,
> >   done: (todo) => todo.done,
> > }
> >
> > function filterTodos(todos, filter = 'all') {
> >   if (!Object.hasOwn(FILTERS, filter)) throw new Error(`Невідомий фільтр: ${filter}`)
> >   return todos.filter(FILTERS[filter])
> > }
> >
> > function getStats(todos) {
> >   const done = todos.filter(FILTERS.done).length
> >   return { total: todos.length, active: todos.length - done, done }
> > }
> >
> > function clearDone(todos) {
> >   return todos.some(FILTERS.done) ? todos.filter(FILTERS.active) : todos
> > }
> >
> > function createMemoryStorage(map = new Map()) {
> >   return {
> >     getItem: (key) => (map.has(key) ? map.get(key) : null),
> >     setItem: (key, value) => {
> >       map.set(key, String(value))
> >     },
> >     removeItem: (key) => {
> >       map.delete(key)
> >     },
> >   }
> > }
> >
> > const STORAGE_KEY = 'todos:v1'
> >
> > function saveTodos(storage, todos) {
> >   storage.setItem(STORAGE_KEY, JSON.stringify(todos))
> > }
> >
> > function isTodo(value) {
> >   return value !== null && typeof value === 'object' && Number.isInteger(value.id) && typeof value.title === 'string' && typeof value.done === 'boolean'
> > }
> >
> > function loadTodos(storage) {
> >   const raw = storage.getItem(STORAGE_KEY)
> >   if (raw === null) return []
> >   try {
> >     const data = JSON.parse(raw)
> >     return Array.isArray(data) ? data.filter(isTodo) : []
> >   } catch {
> >     return []
> >   }
> > }
> >
> > function createHistory(initial, limit = 100) {
> >   let past = []
> >   let present = initial
> >   let future = []
> >   return {
> >     get present() {
> >       return present
> >     },
> >     push(state) {
> >       if (state === present) return
> >       past = [...past, present].slice(-limit)
> >       present = state
> >       future = []
> >     },
> >     undo() {
> >       if (past.length === 0) return present
> >       future = [present, ...future]
> >       present = past[past.length - 1]
> >       past = past.slice(0, -1)
> >       return present
> >     },
> >     redo() {
> >       if (future.length === 0) return present
> >       past = [...past, present]
> >       present = future[0]
> >       future = future.slice(1)
> >       return present
> >     },
> >     canUndo: () => past.length > 0,
> >     canRedo: () => future.length > 0,
> >   }
> > }
> > ```
> > **Чому так:** це патерн Memento: зберігаємо знімки стану, а не інверсні операції. Він працює лише завдяки імутабельності — знімок не зміниться «під ногами». Пам'ять не вибухає: сусідні знімки ділять незмінені задачі (structural sharing), а `limit` обмежує глибину. Альтернатива — Command з `undo()` для кожної дії — економніша, але кожну операцію треба вміти інвертувати.

## 🛠️ Крок 6. Фасад createTodoApp

Склеюємо все: чисті функції змінюють задачі, історія пам'ятає стани, адаптер зберігає, підписники дізнаються про зміни. UI спілкується лише з фасадом через **дії** — об'єкти `{ type, ...payload }`.

> [!task] Крок 6 · createTodoApp
> level: middle · difficulty: hard · id: jsp-01-task-06 · tags: facade, observer, state
>
> Додай `createTodoApp({ storage })`, що повертає:
>
> - `getState()` → `{ todos, filter, visible, stats, canUndo, canRedo }` (`visible` — відфільтровані задачі);
> - `dispatch(action)` — дії `{ type: 'add', title }`, `{ type: 'toggle', id }`, `{ type: 'remove', id }`, `{ type: 'rename', id, title }`, `{ type: 'clearDone' }`; невідомий `type` → `Error('Невідома дія: <type>')`;
> - `setFilter(filter)` — змінює фільтр (невідомий → помилка з `filterTodos`); фільтр **не** потрапляє в історію undo;
> - `undo()` / `redo()`;
> - `subscribe(listener)` → функція відписки; слухач отримує новий `getState()`.
>
> Початкові задачі — з `loadTodos(storage)`. Після **кожної реальної** зміни задач (включно з undo/redo) — `saveTodos` і сповіщення. Якщо дія нічого не змінила (масив той самий) — ні збереження, ні сповіщення.
>
> ```js starter
> function nextId(todos) {
>   return todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1
> }
>
> function addTodo(todos, title) {
>   const text = String(title ?? '').trim()
>   if (text === '') throw new Error('Назва задачі не може бути порожньою')
>   return [...todos, { id: nextId(todos), title: text, done: false }]
> }
>
> function updateTodo(todos, id, update) {
>   let changed = false
>   const next = todos.map((todo) => {
>     if (todo.id !== id) return todo
>     const updated = update(todo)
>     if (updated !== todo) changed = true
>     return updated
>   })
>   return changed ? next : todos
> }
>
> function toggleTodo(todos, id) {
>   return updateTodo(todos, id, (todo) => ({ ...todo, done: !todo.done }))
> }
>
> function removeTodo(todos, id) {
>   const next = todos.filter((todo) => todo.id !== id)
>   return next.length === todos.length ? todos : next
> }
>
> function renameTodo(todos, id, title) {
>   const text = String(title ?? '').trim()
>   if (text === '') return removeTodo(todos, id)
>   return updateTodo(todos, id, (todo) => (todo.title === text ? todo : { ...todo, title: text }))
> }
>
> const FILTERS = {
>   all: () => true,
>   active: (todo) => !todo.done,
>   done: (todo) => todo.done,
> }
>
> function filterTodos(todos, filter = 'all') {
>   if (!Object.hasOwn(FILTERS, filter)) throw new Error(`Невідомий фільтр: ${filter}`)
>   return todos.filter(FILTERS[filter])
> }
>
> function getStats(todos) {
>   const done = todos.filter(FILTERS.done).length
>   return { total: todos.length, active: todos.length - done, done }
> }
>
> function clearDone(todos) {
>   return todos.some(FILTERS.done) ? todos.filter(FILTERS.active) : todos
> }
>
> function createMemoryStorage(map = new Map()) {
>   return {
>     getItem: (key) => (map.has(key) ? map.get(key) : null),
>     setItem: (key, value) => {
>       map.set(key, String(value))
>     },
>     removeItem: (key) => {
>       map.delete(key)
>     },
>   }
> }
>
> const STORAGE_KEY = 'todos:v1'
>
> function saveTodos(storage, todos) {
>   storage.setItem(STORAGE_KEY, JSON.stringify(todos))
> }
>
> function isTodo(value) {
>   return value !== null && typeof value === 'object' && Number.isInteger(value.id) && typeof value.title === 'string' && typeof value.done === 'boolean'
> }
>
> function loadTodos(storage) {
>   const raw = storage.getItem(STORAGE_KEY)
>   if (raw === null) return []
>   try {
>     const data = JSON.parse(raw)
>     return Array.isArray(data) ? data.filter(isTodo) : []
>   } catch {
>     return []
>   }
> }
>
> function createHistory(initial, limit = 100) {
>   let past = []
>   let present = initial
>   let future = []
>   return {
>     get present() {
>       return present
>     },
>     push(state) {
>       if (state === present) return
>       past = [...past, present].slice(-limit)
>       present = state
>       future = []
>     },
>     undo() {
>       if (past.length === 0) return present
>       future = [present, ...future]
>       present = past[past.length - 1]
>       past = past.slice(0, -1)
>       return present
>     },
>     redo() {
>       if (future.length === 0) return present
>       past = [...past, present]
>       present = future[0]
>       future = future.slice(1)
>       return present
>     },
>     canUndo: () => past.length > 0,
>     canRedo: () => future.length > 0,
>   }
> }
>
> function createTodoApp({ storage }) {
>   // твій код
> }
> ```
>
> ```js tests
> test('стартує з даних у сховищі', () => {
>   const storage = createMemoryStorage()
>   saveTodos(storage, [{ id: 1, title: 'з минулого', done: true }])
>   const app = createTodoApp({ storage })
>   expect(app.getState().todos).toEqual([{ id: 1, title: 'з минулого', done: true }])
>   expect(app.getState().stats).toEqual({ total: 1, active: 0, done: 1 })
> })
>
> test('dispatch змінює стан, зберігає і сповіщає', () => {
>   const storage = createMemoryStorage()
>   const app = createTodoApp({ storage })
>   const listener = vi.fn()
>   app.subscribe(listener)
>   app.dispatch({ type: 'add', title: 'Тест' })
>   app.dispatch({ type: 'toggle', id: 1 })
>   expect(listener).toHaveBeenCalledTimes(2)
>   expect(listener.mock.calls[1][0].todos).toEqual([{ id: 1, title: 'Тест', done: true }])
>   expect(loadTodos(storage)).toEqual([{ id: 1, title: 'Тест', done: true }])
> })
>
> test('дія без змін не зберігає і не сповіщає', () => {
>   const storage = createMemoryStorage()
>   storage.setItem = vi.fn(storage.setItem)
>   const app = createTodoApp({ storage })
>   const listener = vi.fn()
>   app.subscribe(listener)
>   app.dispatch({ type: 'toggle', id: 42 })
>   app.dispatch({ type: 'clearDone' })
>   expect(listener).toHaveBeenCalledTimes(0)
>   expect(storage.setItem).toHaveBeenCalledTimes(0)
> })
>
> test('undo / redo відновлюють і зберігають стан', () => {
>   const storage = createMemoryStorage()
>   const app = createTodoApp({ storage })
>   app.dispatch({ type: 'add', title: 'a' })
>   app.dispatch({ type: 'add', title: 'b' })
>   app.undo()
>   expect(app.getState().todos.map((t) => t.title)).toEqual(['a'])
>   expect(loadTodos(storage)).toHaveLength(1)
>   expect(app.getState().canRedo).toBe(true)
>   app.redo()
>   expect(app.getState().todos.map((t) => t.title)).toEqual(['a', 'b'])
> })
>
> test('фільтр змінює visible, але не історію', () => {
>   const app = createTodoApp({ storage: createMemoryStorage() })
>   app.dispatch({ type: 'add', title: 'a' })
>   app.dispatch({ type: 'add', title: 'b' })
>   app.dispatch({ type: 'toggle', id: 2 })
>   app.setFilter('done')
>   expect(app.getState().visible.map((t) => t.title)).toEqual(['b'])
>   app.undo()
>   expect(app.getState().filter).toBe('done')
>   expect(app.getState().visible).toEqual([])
>   expect(() => app.setFilter('nope')).toThrow('Невідомий фільтр')
> })
>
> test('відписка і невідома дія', () => {
>   const app = createTodoApp({ storage: createMemoryStorage() })
>   const listener = vi.fn()
>   const unsubscribe = app.subscribe(listener)
>   unsubscribe()
>   app.dispatch({ type: 'add', title: 'x' })
>   expect(listener).toHaveBeenCalledTimes(0)
>   expect(() => app.dispatch({ type: 'fly' })).toThrow('Невідома дія: fly')
> })
> ```
>
> > [!hint]- Підказка 1
> > Зроби мапу `reducers = { add: (todos, action) => addTodo(todos, action.title), … }`. `dispatch` бере редьюсер (через `Object.hasOwn`!), рахує `next` і передає в `commit(next)`.
>
> > [!hint]- Підказка 2
> > `commit(next)`: якщо `next === history.present` — вихід. Інакше `history.push(next)`, `saveTodos`, `notify()`. Undo/redo — та сама трійка, але замість `push` — `history.undo()`.
>
> > [!hint]- Підказка 3
> > `notify` проходить по **копії** слухачів (`[...listeners]`) — так відписка всередині слухача не зламає цикл.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function nextId(todos) {
> >   return todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1
> > }
> >
> > function addTodo(todos, title) {
> >   const text = String(title ?? '').trim()
> >   if (text === '') throw new Error('Назва задачі не може бути порожньою')
> >   return [...todos, { id: nextId(todos), title: text, done: false }]
> > }
> >
> > function updateTodo(todos, id, update) {
> >   let changed = false
> >   const next = todos.map((todo) => {
> >     if (todo.id !== id) return todo
> >     const updated = update(todo)
> >     if (updated !== todo) changed = true
> >     return updated
> >   })
> >   return changed ? next : todos
> > }
> >
> > function toggleTodo(todos, id) {
> >   return updateTodo(todos, id, (todo) => ({ ...todo, done: !todo.done }))
> > }
> >
> > function removeTodo(todos, id) {
> >   const next = todos.filter((todo) => todo.id !== id)
> >   return next.length === todos.length ? todos : next
> > }
> >
> > function renameTodo(todos, id, title) {
> >   const text = String(title ?? '').trim()
> >   if (text === '') return removeTodo(todos, id)
> >   return updateTodo(todos, id, (todo) => (todo.title === text ? todo : { ...todo, title: text }))
> > }
> >
> > const FILTERS = {
> >   all: () => true,
> >   active: (todo) => !todo.done,
> >   done: (todo) => todo.done,
> > }
> >
> > function filterTodos(todos, filter = 'all') {
> >   if (!Object.hasOwn(FILTERS, filter)) throw new Error(`Невідомий фільтр: ${filter}`)
> >   return todos.filter(FILTERS[filter])
> > }
> >
> > function getStats(todos) {
> >   const done = todos.filter(FILTERS.done).length
> >   return { total: todos.length, active: todos.length - done, done }
> > }
> >
> > function clearDone(todos) {
> >   return todos.some(FILTERS.done) ? todos.filter(FILTERS.active) : todos
> > }
> >
> > function createMemoryStorage(map = new Map()) {
> >   return {
> >     getItem: (key) => (map.has(key) ? map.get(key) : null),
> >     setItem: (key, value) => {
> >       map.set(key, String(value))
> >     },
> >     removeItem: (key) => {
> >       map.delete(key)
> >     },
> >   }
> > }
> >
> > const STORAGE_KEY = 'todos:v1'
> >
> > function saveTodos(storage, todos) {
> >   storage.setItem(STORAGE_KEY, JSON.stringify(todos))
> > }
> >
> > function isTodo(value) {
> >   return value !== null && typeof value === 'object' && Number.isInteger(value.id) && typeof value.title === 'string' && typeof value.done === 'boolean'
> > }
> >
> > function loadTodos(storage) {
> >   const raw = storage.getItem(STORAGE_KEY)
> >   if (raw === null) return []
> >   try {
> >     const data = JSON.parse(raw)
> >     return Array.isArray(data) ? data.filter(isTodo) : []
> >   } catch {
> >     return []
> >   }
> > }
> >
> > function createHistory(initial, limit = 100) {
> >   let past = []
> >   let present = initial
> >   let future = []
> >   return {
> >     get present() {
> >       return present
> >     },
> >     push(state) {
> >       if (state === present) return
> >       past = [...past, present].slice(-limit)
> >       present = state
> >       future = []
> >     },
> >     undo() {
> >       if (past.length === 0) return present
> >       future = [present, ...future]
> >       present = past[past.length - 1]
> >       past = past.slice(0, -1)
> >       return present
> >     },
> >     redo() {
> >       if (future.length === 0) return present
> >       past = [...past, present]
> >       present = future[0]
> >       future = future.slice(1)
> >       return present
> >     },
> >     canUndo: () => past.length > 0,
> >     canRedo: () => future.length > 0,
> >   }
> > }
> >
> > function createTodoApp({ storage }) {
> >   const history = createHistory(loadTodos(storage))
> >   const listeners = new Set()
> >   let filter = 'all'
> >
> >   const reducers = {
> >     add: (todos, action) => addTodo(todos, action.title),
> >     toggle: (todos, action) => toggleTodo(todos, action.id),
> >     remove: (todos, action) => removeTodo(todos, action.id),
> >     rename: (todos, action) => renameTodo(todos, action.id, action.title),
> >     clearDone: (todos) => clearDone(todos),
> >   }
> >
> >   function getState() {
> >     const todos = history.present
> >     return {
> >       todos,
> >       filter,
> >       visible: filterTodos(todos, filter),
> >       stats: getStats(todos),
> >       canUndo: history.canUndo(),
> >       canRedo: history.canRedo(),
> >     }
> >   }
> >
> >   function notify() {
> >     const state = getState()
> >     for (const listener of [...listeners]) listener(state)
> >   }
> >
> >   function persistAndNotify() {
> >     saveTodos(storage, history.present)
> >     notify()
> >   }
> >
> >   return {
> >     getState,
> >     dispatch(action) {
> >       if (!Object.hasOwn(reducers, action.type)) throw new Error(`Невідома дія: ${action.type}`)
> >       const next = reducers[action.type](history.present, action)
> >       if (next === history.present) return
> >       history.push(next)
> >       persistAndNotify()
> >     },
> >     setFilter(next) {
> >       filterTodos([], next)
> >       if (next === filter) return
> >       filter = next
> >       notify()
> >     },
> >     undo() {
> >       if (!history.canUndo()) return
> >       history.undo()
> >       persistAndNotify()
> >     },
> >     redo() {
> >       if (!history.canRedo()) return
> >       history.redo()
> >       persistAndNotify()
> >     },
> >     subscribe(listener) {
> >       listeners.add(listener)
> >       return () => listeners.delete(listener)
> >     },
> >   }
> > }
> > ```
> > **Чому так:** фасад — **єдина точка входу** для змін (дії-об'єкти, як у Redux). Тому збереження, історія і сповіщення живуть в одному місці, а не розмазані по обробниках кнопок. Дія — дані, а не виклик методу: її можна залогувати, відправити на сервер чи відтворити. Фільтр — стан **перегляду**, не даних: його не зберігаємо в undo, бо користувач не чекає, що «скасувати» перемкне вкладку. `filterTodos([], next)` — дешевий спосіб перевикористати валідацію фільтра.

## 🎤 На співбесіді

> [!interview] Як би ти масштабував цей todo до 50 000 задач і синхронізації між пристроями?
> level: senior · frequency: часто · id: jsp-01-int-01
>
> ---
>
> **Рендер:** 50 000 DOM-вузлів — повільно; потрібна віртуалізація (малюємо лише видиме вікно) і ключі за `id`, щоб оновлювати точково. **Похідні дані:** `filterTodos` і `getStats` — O(n) на кожну зміну; мемоізуємо за посиланням на масив (structural sharing це дозволяє) або тримаємо лічильники інкрементально. **Сховище:** `localStorage` синхронний (блокує головний потік на серіалізації мегабайтів) і має ліміт ~5 МБ — переходимо на IndexedDB з пакетним записом через debounce. **Синхронізація:** дії вже є даними — відправляємо їх на сервер як лог операцій (event sourcing), з оптимістичним застосуванням локально, а конфлікти вирішуємо за `updatedAt` (last-write-wins) або CRDT, якщо потрібна справжня колаборація. id робимо глобально унікальними (`crypto.randomUUID()`), бо `max + 1` на двох пристроях дасть колізії.
>
> 📚 [[JavaScript - 28. Сховища та Web APIs]] · [MDN: Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) · [Martin Fowler: Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)

> [!interview] Знімки стану чи команди: як би ти зробив undo в редакторі з великим документом?
> level: senior · frequency: іноді · id: jsp-01-int-02
>
> ---
>
> **Знімки (Memento)**, як у нашому `createHistory`, прості й надійні: undo — просто повернути старе посилання. Завдяки імутабельності й structural sharing кожен знімок коштує лише змінених вузлів, а не всього документа. Обмеження — пам'ять на дуже великих станах і неможливість «скасувати лише мою дію» в спільному документі. **Команди (Command)** зберігають операцію з методом `undo()` (інверсією): економно і дає змогу групувати дії (транзакції «перетягнув 10 елементів» = один undo). Для колаборації потрібні команди, які можна трансформувати відносно чужих змін (OT) або CRDT. На практиці: знімки — для локального стану форм і невеликих застосунків, команди — для редакторів; плюс групування дрібних дій (набір тексту) по таймеру.
>
> 📚 [[JavaScript - 32. Патерни проєктування]] · [Refactoring Guru: Memento](https://refactoring.guru/design-patterns/memento) · [Redux: Implementing Undo History](https://redux.js.org/usage/implementing-undo-history)

## 🧠 Закріплення

> [!question]- Чому функції todo повертають той самий масив, якщо нічого не змінилось?
> *часто · дизайн* · `jsp-01-001`
>
> Це контракт «посилання змінилось ⇔ дані змінились». Він дає змогу фасаду одним `next === prev` вирішити: не зберігати, не писати в історію, не сповіщати UI. Без нього кожен клік по неіснуючому id створював би фальшивий крок undo і зайвий запис у сховище.
>
> 📚 [[JavaScript - 03. Значення та посилання]] · [MDN: Equality comparisons](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)

> [!question]- Що таке structural sharing і навіщо він тут?
> *часто · теорія* · `jsp-01-002`
>
> Новий стан перевикористовує незмінені частини старого: після `toggleTodo` у новому масиві лише одна задача — новий об'єкт, решта — ті самі посилання. Це робить копіювання дешевим, історію undo — компактною, а перевірку «чи змінилась задача» — порівнянням `===`.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль]] · [Redux: Immutable Update Patterns](https://redux.js.org/usage/structuring-reducers/immutable-update-patterns)

> [!question]- Навіщо передавати сховище як параметр, а не викликати `localStorage` напряму?
> *дуже часто · дизайн* · `jsp-01-003`
>
> Це Dependency Injection + Adapter: логіка залежить від інтерфейсу `getItem/setItem`, а не від браузера. У тестах (і в Web Worker, де `localStorage` немає) підставляємо `Map`, у продакшні — `localStorage`, завтра — IndexedDB чи сервер, не чіпаючи бізнес-код.
>
> 📚 [[JavaScript - 32. Патерни проєктування]] · [Refactoring Guru: Adapter](https://refactoring.guru/design-patterns/adapter)

> [!question]- Чому `FILTERS[filter]` небезпечно без `Object.hasOwn`?
> *часто · пастка* · `jsp-01-004`
>
> Звичайний об'єкт успадковує `Object.prototype`: `FILTERS['toString']` і `FILTERS['constructor']` — функції, тож «невідомий фільтр» мовчки пройде перевірку і поверне сміття. `Object.hasOwn(FILTERS, key)` перевіряє лише власні ключі. Альтернатива — `Map` або `Object.create(null)`.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко]] · [MDN: Object.hasOwn()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)

> [!question]- Чому `loadTodos` валідує дані, а не довіряє `JSON.parse`?
> *часто · дизайн* · `jsp-01-005`
>
> Сховище — зовнішній вхід: дані могла записати стара версія застосунку, розширення чи користувач у DevTools. Битий JSON кидає `SyntaxError`, а чужий формат зламає код далі. Ловимо помилку, перевіряємо форму і відкидаємо сміття — застосунок стартує завжди. Версія в ключі (`todos:v1`) дозволяє робити міграції.
>
> 📚 [[JavaScript - 23. JSON, structuredClone і серіалізація]] · [MDN: JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)

> [!question]- Чому фільтр не входить в історію undo?
> *іноді · дизайн* · `jsp-01-006`
>
> Фільтр — стан **перегляду** (як скрол чи відкрита вкладка), а не дані користувача. «Скасувати» має відміняти зміни задач; якби воно перемикало вкладки, користувач втратив би довіру до кнопки. Розділення «дані vs UI-стан» — базове рішення будь-якого стейт-менеджменту.
>
> 📚 [[JavaScript - 32. Патерни проєктування]] · [Redux: Implementing Undo History](https://redux.js.org/usage/implementing-undo-history)

> [!question]- Навіщо дії-об'єкти `{ type, ... }` замість методів `app.add()`?
> *часто · дизайн* · `jsp-01-007`
>
> Дія — дані: її можна залогувати, серіалізувати, відправити на сервер, відтворити для відлагодження. Усі зміни проходять через один `dispatch`, тож збереження, історія й сповіщення реалізовані один раз. Це патерн Command і основа Redux / useReducer.
>
> 📚 [[JavaScript - 32. Патерни проєктування]] · [Refactoring Guru: Command](https://refactoring.guru/design-patterns/command)

## ⚡ Фішки

> [!reel] 💾 localStorage зберігає лише рядки
> `setItem('n', 5)` збереже `'5'`, а об'єкт стане `'[object Object]'`. Тому завжди `JSON.stringify` при записі і `JSON.parse` у `try/catch` при читанні.
>
> ```js
> localStorage.setItem('x', { a: 1 })
> localStorage.getItem('x') // → "[object Object]"
> ```

> [!reel] 🕳️ Фільтр «toString» існує
> Об'єкт-мапа успадковує методи прототипу. Перевіряй власні ключі.
>
> ```js
> const FILTERS = { all: () => true }
> typeof FILTERS.toString          // → "function" 😱
> Object.hasOwn(FILTERS, 'toString') // → false
> ```

> [!reel] ⚖️ Імутабельність = дешеве «що змінилось?»
> Якщо дані не мутують, порівняння двох станів — один `===`, а не глибокий обхід. На цьому стоять `React.memo`, Redux і наш undo.

## 🖥️ Зібрати в браузері

Збережи як `todo.html` і відкрий у браузері. Уся логіка — дослівно еталон кроку 6; DOM-шар лише читає `getState()` і відправляє дії. Сховище — справжній `localStorage`: у нього той самий інтерфейс, що й у нашого адаптера.

```html
<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <title>Todo</title>
  <style>
    body { font: 16px system-ui, sans-serif; max-width: 480px; margin: 40px auto; }
    li { display: flex; gap: 8px; align-items: center; padding: 4px 0; }
    li.done span { text-decoration: line-through; opacity: .6; }
    li span { flex: 1; cursor: text; }
    nav button[aria-pressed="true"] { font-weight: bold; }
  </style>
</head>
<body>
  <h1>✅ Todo</h1>
  <form id="add"><input name="title" placeholder="Що треба зробити?" autofocus /> <button>Додати</button></form>
  <ul id="list"></ul>
  <p id="stats"></p>
  <nav id="filters">
    <button data-filter="all">Усі</button>
    <button data-filter="active">Активні</button>
    <button data-filter="done">Виконані</button>
  </nav>
  <p>
    <button id="undo">↶ Undo</button>
    <button id="redo">↷ Redo</button>
    <button id="clear">Очистити виконані</button>
  </p>
  <script>
function nextId(todos) {
  return todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1
}

function addTodo(todos, title) {
  const text = String(title ?? '').trim()
  if (text === '') throw new Error('Назва задачі не може бути порожньою')
  return [...todos, { id: nextId(todos), title: text, done: false }]
}

function updateTodo(todos, id, update) {
  let changed = false
  const next = todos.map((todo) => {
    if (todo.id !== id) return todo
    const updated = update(todo)
    if (updated !== todo) changed = true
    return updated
  })
  return changed ? next : todos
}

function toggleTodo(todos, id) {
  return updateTodo(todos, id, (todo) => ({ ...todo, done: !todo.done }))
}

function removeTodo(todos, id) {
  const next = todos.filter((todo) => todo.id !== id)
  return next.length === todos.length ? todos : next
}

function renameTodo(todos, id, title) {
  const text = String(title ?? '').trim()
  if (text === '') return removeTodo(todos, id)
  return updateTodo(todos, id, (todo) => (todo.title === text ? todo : { ...todo, title: text }))
}

const FILTERS = {
  all: () => true,
  active: (todo) => !todo.done,
  done: (todo) => todo.done,
}

function filterTodos(todos, filter = 'all') {
  if (!Object.hasOwn(FILTERS, filter)) throw new Error(`Невідомий фільтр: ${filter}`)
  return todos.filter(FILTERS[filter])
}

function getStats(todos) {
  const done = todos.filter(FILTERS.done).length
  return { total: todos.length, active: todos.length - done, done }
}

function clearDone(todos) {
  return todos.some(FILTERS.done) ? todos.filter(FILTERS.active) : todos
}

function createMemoryStorage(map = new Map()) {
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => {
      map.set(key, String(value))
    },
    removeItem: (key) => {
      map.delete(key)
    },
  }
}

const STORAGE_KEY = 'todos:v1'

function saveTodos(storage, todos) {
  storage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function isTodo(value) {
  return value !== null && typeof value === 'object' && Number.isInteger(value.id) && typeof value.title === 'string' && typeof value.done === 'boolean'
}

function loadTodos(storage) {
  const raw = storage.getItem(STORAGE_KEY)
  if (raw === null) return []
  try {
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data.filter(isTodo) : []
  } catch {
    return []
  }
}

function createHistory(initial, limit = 100) {
  let past = []
  let present = initial
  let future = []
  return {
    get present() {
      return present
    },
    push(state) {
      if (state === present) return
      past = [...past, present].slice(-limit)
      present = state
      future = []
    },
    undo() {
      if (past.length === 0) return present
      future = [present, ...future]
      present = past[past.length - 1]
      past = past.slice(0, -1)
      return present
    },
    redo() {
      if (future.length === 0) return present
      past = [...past, present]
      present = future[0]
      future = future.slice(1)
      return present
    },
    canUndo: () => past.length > 0,
    canRedo: () => future.length > 0,
  }
}

function createTodoApp({ storage }) {
  const history = createHistory(loadTodos(storage))
  const listeners = new Set()
  let filter = 'all'

  const reducers = {
    add: (todos, action) => addTodo(todos, action.title),
    toggle: (todos, action) => toggleTodo(todos, action.id),
    remove: (todos, action) => removeTodo(todos, action.id),
    rename: (todos, action) => renameTodo(todos, action.id, action.title),
    clearDone: (todos) => clearDone(todos),
  }

  function getState() {
    const todos = history.present
    return {
      todos,
      filter,
      visible: filterTodos(todos, filter),
      stats: getStats(todos),
      canUndo: history.canUndo(),
      canRedo: history.canRedo(),
    }
  }

  function notify() {
    const state = getState()
    for (const listener of [...listeners]) listener(state)
  }

  function persistAndNotify() {
    saveTodos(storage, history.present)
    notify()
  }

  return {
    getState,
    dispatch(action) {
      if (!Object.hasOwn(reducers, action.type)) throw new Error(`Невідома дія: ${action.type}`)
      const next = reducers[action.type](history.present, action)
      if (next === history.present) return
      history.push(next)
      persistAndNotify()
    },
    setFilter(next) {
      filterTodos([], next)
      if (next === filter) return
      filter = next
      notify()
    },
    undo() {
      if (!history.canUndo()) return
      history.undo()
      persistAndNotify()
    },
    redo() {
      if (!history.canRedo()) return
      history.redo()
      persistAndNotify()
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

    // ---------- DOM-шар
    const app = createTodoApp({ storage: localStorage })
    const $ = (selector) => document.querySelector(selector)

    function render(state) {
      $('#list').replaceChildren(...state.visible.map((todo) => {
        const li = document.createElement('li')
        li.dataset.id = todo.id
        li.className = todo.done ? 'done' : ''
        const checkbox = Object.assign(document.createElement('input'), { type: 'checkbox', checked: todo.done })
        checkbox.dataset.action = 'toggle'
        const title = document.createElement('span')
        title.textContent = todo.title // textContent, не innerHTML — без XSS
        title.dataset.action = 'rename'
        const remove = Object.assign(document.createElement('button'), { textContent: '✕' })
        remove.dataset.action = 'remove'
        li.append(checkbox, title, remove)
        return li
      }))
      $('#stats').textContent = `Активних: ${state.stats.active} з ${state.stats.total}`
      for (const button of document.querySelectorAll('#filters button')) {
        button.setAttribute('aria-pressed', String(button.dataset.filter === state.filter))
      }
      $('#undo').disabled = !state.canUndo
      $('#redo').disabled = !state.canRedo
    }

    $('#add').addEventListener('submit', (event) => {
      event.preventDefault()
      const input = event.target.elements.title
      try {
        app.dispatch({ type: 'add', title: input.value })
        input.value = ''
      } catch (error) {
        input.setCustomValidity(error.message)
        input.reportValidity()
        input.setCustomValidity('')
      }
    })

    // делегування: один слухач на весь список
    $('#list').addEventListener('click', (event) => {
      const id = Number(event.target.closest('li')?.dataset.id)
      const action = event.target.dataset.action
      if (action === 'toggle') app.dispatch({ type: 'toggle', id })
      if (action === 'remove') app.dispatch({ type: 'remove', id })
    })
    $('#list').addEventListener('dblclick', (event) => {
      if (event.target.dataset.action !== 'rename') return
      const id = Number(event.target.closest('li').dataset.id)
      const title = prompt('Нова назва (порожня — видалити)', event.target.textContent)
      if (title !== null) app.dispatch({ type: 'rename', id, title })
    })
    $('#filters').addEventListener('click', (event) => {
      if (event.target.dataset.filter) app.setFilter(event.target.dataset.filter)
    })
    $('#undo').addEventListener('click', () => app.undo())
    $('#redo').addEventListener('click', () => app.redo())
    $('#clear').addEventListener('click', () => app.dispatch({ type: 'clearDone' }))
    document.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
        event.preventDefault()
        event.shiftKey ? app.redo() : app.undo()
      }
    })

    app.subscribe(render)
    render(app.getState())
  </script>
</body>
</html>
```

> [!tip] Поекспериментуй
> Відкрий DevTools → Application → Local Storage і подивись на ключ `todos:v1`. Зіпсуй JSON руками й перезавантаж сторінку — застосунок стартує з порожнім списком, а не з білим екраном. Це твій `loadTodos` у дії.

## 📚 Джерела та що почитати

- 🟢 [TodoMVC](https://todomvc.com/) — той самий застосунок на десятках фреймворків: порівняй архітектури
- 🟢 [javascript.info — localStorage, sessionStorage](https://javascript.info/localstorage) — API сховища з прикладами
- 🟡 [MDN — Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) — ліміти, події `storage`, синхронність
- 🟡 [Redux — Implementing Undo History](https://redux.js.org/usage/implementing-undo-history) — `past / present / future`, як у нашому кроці 5
- 🟡 [Redux — Immutable Update Patterns](https://redux.js.org/usage/structuring-reducers/immutable-update-patterns) — імутабельні оновлення вкладених даних
- 🛠️ [Refactoring Guru — Memento](https://refactoring.guru/design-patterns/memento) і [Command](https://refactoring.guru/design-patterns/command) — два підходи до undo
- 🛠️ [Refactoring Guru — Adapter](https://refactoring.guru/design-patterns/adapter) — патерн за нашим storage-адаптером

> [!important] Підсумок
> - Імутабельний стан + «той самий масив, якщо нічого не змінилось» = дешеве `===` для збереження, історії й рендеру.
> - Похідні дані (фільтр, лічильники) обчислюємо, а не зберігаємо.
> - Сховище — інжектований адаптер; дані з нього валідуємо, бо вони недовірені.
> - Undo/redo — `past / present / future`; працює завдяки імутабельності.
> - Фасад з `dispatch` і `subscribe` — єдина точка змін; DOM лише малює стан.
