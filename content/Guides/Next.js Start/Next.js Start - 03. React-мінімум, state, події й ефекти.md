---
title: React-мінімум, state, події й ефекти
id: nextjs-start-03
slug: 03-react-state-events-effects
order: 3
level: noob
skill: foundations
icon: px:bolt
tags: [nextjs, react, state, events, useState, useEffect, hooks, beginner]
prerequisites:
  - "[[Next.js Start - 02. React-мінімум, компоненти, JSX і props]]"
estimatedMinutes: 40
nextVersion: 16.3.8
---

# React-мінімум, state, події й ефекти

> [!success] 🎯 Після цього розділу ти зможеш
> - зробити компонент інтерактивним: `useState` і обробники подій (`onClick`, `onChange`);
> - пояснити, чому після `setCount(count + 1)` змінна `count` ще стара, і коли потрібна функція-оновлювач;
> - оновлювати обʼєкти й масиви в state без мутацій — копією через `...`, `map`, `filter`;
> - підняти стан у спільного батька, щоб два компоненти бачили одне значення;
> - відрізнити **ефект** (синхронізація із зовнішнім світом) від **обчислення під час рендеру** і прибрати зайвий `useEffect`;
> - дотримуватися правил хуків і знати, чому в Next.js хуки працюють лише у файлах з `'use client'`.

## 🤔 Передбач

> [!quiz] Що покаже кнопка після одного кліку?
> level: junior · type: output · id: nextjs-start-03-quiz-01
>
> ```tsx
> // app/snapshot/snapshot.tsx
> 'use client'
>
> import { useState } from 'react'
>
> export default function Snapshot() {
>   const [a, setA] = useState(0)
>   return (
>     <button
>       onClick={() => {
>         setA(a + 1)
>         setA(a + 1)
>         setA(a + 1)
>       }}
>     >
>       a = {a}
>     </button>
>   )
> }
> ```
>
> - [x] `a = 1`
> - [ ] `a = 3`
> - [ ] `a = 0` — без перезавантаження сторінки нічого не зміниться
> - [ ] Помилка: не можна викликати `setA` кілька разів підряд
>
> **Пояснення:** не переймайся, якщо помилився — це найчастіший сюрприз у React, розберемо нижче. У цьому кліку `a` дорівнює `0`, тож усі три виклики просять одне й те саме: «наступного разу `a` = 1».

## 🧒 Простими словами

Уяви табло на стадіоні. На ньому показано рахунок — це **UI**. Табло нічого не памʼятає саме: рахунок записаний у блокноті оператора — це **state**. Коли команда забиває, оператор не малює цифру на табло фломастером, а виправляє запис у блокноті й натискає «оновити». Табло перемальовується з блокнота — це **рендер**. А якщо оператор заодно вмикає сирену на стадіоні, це вже дія у зовнішньому світі поза табло — **ефект**.

Головне правило: змінюєш запис у блокноті, а не табло. React сам перемалює те, що треба.

## 🔬 Як це працює насправді

### 🧠 Навіщо state

У попередній темі компонент був функцією, яка отримує props і повертає JSX. Спробуймо зробити лічильник звичайною змінною:

```tsx
// ❌ не працює
export default function Counter() {
  let count = 0
  return <button onClick={() => count++}>Кліків: {count}</button>
}
```

Клік змінює `count`, але на екрані завжди `0`. Причин дві:

1. **Локальна змінна не живе між рендерами.** Рендер (render) — це виклик функції компонента. Наступного разу React викличе `Counter()` знову, і `let count = 0` почнеться з нуля.
2. **Зміна локальної змінної не запускає рендер.** React не знає, що щось змінилося, і не викликає компонент повторно.

**State** (стан) — памʼять компонента між рендерами. Отримують її хуком `useState`. **Хук** (hook) — це функція React з назвою на `use…`, яку викликають у тілі компонента, щоб «підключити» можливість React: стан, ефект, контекст.

```tsx
// app/counter/counter.tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)
  }

  return <button onClick={handleClick}>Кліків: {count}</button>
}
```

`useState(0)` повертає пару: **поточне значення** (`count`) і **функцію-сетер** (`setCount`). `0` — початкове значення, React використає його лише в першому рендері. Виклик `setCount(1)` робить дві речі: записує нове значення і просить React відрендерити компонент ще раз. Квадратні дужки — звичайна деструктуризація масиву, тож назви обираєш сам; домовленість — `щось` і `setЩось`.

State належить **конкретному екземпляру** компонента на екрані. Якщо сторінка рендерить `<Counter />` двічі, кожен лічильник має власний `count`, і клік по одному не чіпає інший.

Перший рядок `'use client'` — вимога Next.js: хуки працюють лише в Client Components. Без нього збірка падає. Чому так — у [[#🧭 Хуки в Next.js]], а детально — у [[Next.js - 07. Server і Client Components]].

### 🖱️ Події

**Обробник подій** (event handler) — функція, яку React викличе у відповідь на дію користувача: клік, введення тексту, відправку форми. Його передають у JSX як prop з назвою `on…`: `onClick`, `onChange`, `onSubmit`.

Важливо передати **саму функцію**, а не результат її виклику:

```tsx
<button onClick={handleClick}>…</button>        // ✅ React викличе при кліку
<button onClick={() => remove(t.id)}>…</button>  // ✅ стрілка, бо потрібен аргумент
<button onClick={handleClick()}>…</button>      // ❌ викликається під час рендеру
```

У третьому рядку `handleClick()` виконується щоразу, коли React рендерить кнопку, а в `onClick` потрапляє те, що функція повернула (`undefined`). Якщо всередині є `setCount`, вийде нескінченний цикл: рендер → `setCount` → новий рендер → `setCount`… React зупинить його помилкою `Too many re-renders. React limits the number of renders to prevent an infinite loop.` У `.tsx` TypeScript підсвітить це ще до запуску: `Type 'void' is not assignable to type 'MouseEventHandler<HTMLButtonElement> | undefined'` — функція нічого не повертає, а `onClick` чекає функцію (як читати такі повідомлення — у [[Next.js Start - 04. TypeScript-мінімум для Next.js]]).

Обробник отримує обʼєкт події. Найчастіше з нього беруть `e.target.value` (текст у полі) і викликають `e.preventDefault()` (скасувати стандартну дію браузера, наприклад перезавантаження сторінки при відправці форми):

```tsx
<input value={query} onChange={(e) => setQuery(e.target.value)} />
```

Тут поле **кероване** (controlled): його значення завжди береться зі state, а кожне натискання клавіші оновлює state.

Компоненти можуть приймати обробники як props: prop називають `onЩось` (`onSelect`, `onShow`), а функцію всередині — `handleЩось`.

> [!quiz] Перевір себе: яка кнопка видалить саме цю справу?
> level: junior · id: nextjs-start-03-quiz-02
>
> Є функція `remove(id: number)`, що прибирає справу зі списку. Як підключити її до кнопки в рядку справи `t`?
>
> - [x] `<button onClick={() => remove(t.id)}>✕</button>`
> - [ ] `<button onClick={remove(t.id)}>✕</button>`
> - [ ] `<button onClick={remove}>✕</button>`
> - [ ] `<button onClick="remove(t.id)">✕</button>`
>
> **Пояснення:** `remove(t.id)` без стрілки виконається під час рендеру й видалить усі справи одна за одною. `onClick={remove}` отримає обʼєкт події замість `id`. Рядок замість функції — це синтаксис HTML, у JSX він не працює (TypeScript не пропустить такий код).

### 📸 State як знімок

Повернімося до 🤔 Передбач. Ключ до відповіді: **state — це знімок**. Кожен рендер бачить власне, незмінне значення `count`. Сетер не змінює змінну в поточному виклику функції, а **ставить у чергу** нове значення для наступного рендеру.

```tsx
onClick={() => {
  setA(a + 1) // a = 0 → «наступного разу 1»
  setA(a + 1) // a досі 0 → «наступного разу 1»
  setA(a + 1) // a досі 0 → «наступного разу 1»
  console.log(a) // 0
}}
```

React дочекається, поки обробник закінчиться, і зробить **один** рендер на всі оновлення одразу. Це називається **batching** (групування): так React не перемальовує екран тричі через один клік. У новому рендері `a` = 1.

> [!diagram] Що відбувається після кліку
> ```yaml
> layout: flow
> nodes:
>   - { id: click, label: "користувач", text: "клік", tone: gray, icon: "px:monitor" }
>   - { id: handler, label: "обробник", code: "setCount(count + 1)", note: "count = 0 у цьому рендері", tone: blue }
>   - { id: queue, label: "React · черга", text: "порожньо", note: "екран ще старий", tone: yellow }
>   - { id: render, label: "новий рендер", code: "Counter()", note: "count = ?", tone: violet }
>   - { id: dom, label: "DOM", text: "Кліків: 0", tone: green, icon: "px:bolt" }
> edges:
>   - { from: click, to: handler, label: "onClick" }
>   - { from: handler, to: queue, label: "сетер" }
>   - { from: queue, to: render, label: "рендер" }
>   - { from: render, to: dom, label: "оновлення" }
> steps:
>   - { focus: click, note: "Користувач клікає. React викликає handleClick — функцію з поточного рендеру, де count = 0." }
>   - { move: { from: click, to: handler, value: "подія" }, line: "handler:1", note: "setCount(count + 1) — це setCount(1). Змінна count у цьому виклику лишається 0." }
>   - { move: { from: handler, to: queue, value: "1" }, set: { queue: "count → 1" }, note: "Сетер не міняє екран, а ставить нове значення в чергу. Інші сетери з того ж обробника стануть туди ж." }
>   - { move: { from: queue, to: render, value: "count = 1" }, note: "Обробник закінчився, і React один раз викликає Counter() знову. Тепер useState повертає 1." }
>   - { move: { from: render, to: dom, value: "1" }, set: { dom: "Кліків: 1" }, note: "React порівнює новий JSX зі старим і змінює в DOM лише текст кнопки." }
> ```
> Сетер — це прохання «наступного разу покажи ось це», а не присвоєння змінній.

А якщо треба справді додати тричі? Передай сетеру **функцію-оновлювач** (updater function): вона отримує **попереднє значення з черги** і повертає нове.

```tsx
setB((n) => n + 1) // 0 → 1
setB((n) => n + 1) // 1 → 2
setB((n) => n + 1) // 2 → 3
```

React виконує оновлювачі по черзі під час наступного рендеру, тож кожен бачить результат попереднього. Правило просте: якщо нове значення залежить від старого і оновлень може бути кілька підряд (або код виконається пізніше, як у таймері), пиши `setX((prev) => …)`. Якщо просто ставиш значення (`setQuery('')`), оновлювач не потрібен.

> [!quiz] Перевір себе: значення плюс оновлювач
> level: junior · type: output · id: nextjs-start-03-quiz-03
>
> `number` спершу дорівнює `0`. Що покаже кнопка після одного кліку?
>
> ```tsx
> <button
>   onClick={() => {
>     setNumber(number + 5)
>     setNumber((n) => n + 1)
>   }}
> >
>   {number}
> </button>
> ```
>
> - [x] `6`
> - [ ] `1`
> - [ ] `5`
> - [ ] `11`
>
> **Пояснення:** черга виглядає як «замінити на 5», потім «взяти попереднє й додати 1». React виконує її по порядку: 0 → 5 → 6. Варіант `1` вийшов би, якби оновлювач отримував значення з поточного рендеру, а не з черги.

### 🧱 Обʼєкти й масиви: заміняй, а не змінюй

State може бути обʼєктом чи масивом. Тут найважливіше правило теми: **не змінюй (не мутуй) обʼєкт у state — створюй новий**.

**Мутація** — зміна наявного обʼєкта на місці: `user.name = 'Оля'`, `todos.push(x)`. React вирішує, чи потрібен рендер, порівнюючи старе й нове значення через `Object.is`. Якщо передати сетеру той самий обʼєкт, React бачить «нічого не змінилося» і рендер пропускає.

```tsx
// app/profile/profile-form.tsx (фрагмент)
const [profile, setProfile] = useState<Profile>({ name: 'Оля', city: 'Львів' })

// ❌ мутація: той самий обʼєкт — React рендер пропускає
profile.city = 'Київ'
setProfile(profile)

// ✅ новий обʼєкт: копіюємо старі поля, перезаписуємо одне
setProfile({ ...profile, name: e.target.value })
```

Після кліку з мутацією на екрані лишається «Оля · Львів», а щойно користувач надрукує символ у полі імені, зʼявиться «Оля! · Київ». Мутація «спливла» з іншим рендером — симптом далеко від причини.

`...profile` (spread) копіює всі поля в новий обʼєкт, а поля після нього перезаписують потрібні. Spread поверхневий: для вкладеного обʼєкта копіюй кожен рівень — `{ ...user, address: { ...user.address, city: 'Київ' } }`.

З масивами так само: обирай методи, що **повертають новий масив**.

| Що зробити | ❌ мутує | ✅ новий масив |
|---|---|---|
| додати | `push`, `unshift` | `[...arr, item]`, `[item, ...arr]` |
| прибрати | `splice`, `pop`, `shift` | `filter` |
| змінити елемент | `arr[i] = x` | `map` |
| відсортувати, перевернути | `sort`, `reverse` | `toSorted`, `toReversed` або `[...arr].sort()` |

Справжній список справ:

```tsx
// app/todos/todo-list.tsx (фрагмент)
function add() {
  setTodos([...todos, { id: nextId++, title, done: false }]) // додати в кінець
  setTitle('')
}

function toggle(id: number) {
  setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))) // змінити один
}

function remove(id: number) {
  setTodos(todos.filter((t) => t.id !== id)) // прибрати
}
```

У `toggle` змінена справа — **новий** обʼєкт, а решта — ті самі обʼєкти, без копій.

> [!quiz] Перевір себе: які оновлення правильні?
> level: junior · type: multi · id: nextjs-start-03-quiz-04
>
> `items` — масив у state, `setItems` — його сетер. Які виклики коректно оновлять екран?
>
> - [x] `setItems([...items, newItem])`
> - [x] `setItems(items.filter((i) => i.id !== id))`
> - [x] `setItems(items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)))`
> - [ ] `items.push(newItem); setItems(items)`
> - [ ] `setItems(items.sort((a, b) => a.price - b.price))`
>
> **Пояснення:** перші три повертають новий масив. `push` змінює той самий масив, і React пропускає рендер. `sort` теж сортує **на місці** й повертає той самий масив — легко пропустити, бо виглядає як «новий». Правильно — `items.toSorted(…)` або `[...items].sort(…)`.

> [!quiz] Перевір себе: заповни незмінні оновлення
> level: junior · type: fill · bank: push, splice · id: nextjs-start-03-quiz-05
>
> ```tsx fill
> function toggle(id: number) {
>   setTodos(todos.[[map]]((t) => (t.id === id ? { [[...t]], done: [[!t.done]] } : t)))
> }
>
> function remove(id: number) {
>   setTodos(todos.[[filter]]((t) => t.id !== id))
> }
> ```
>
> **Пояснення:** `map` повертає новий масив тієї ж довжини — так змінюють один елемент. Змінений елемент — новий обʼєкт: копія `...t` з перевернутим `done`. `filter` повертає новий масив без справи. `push` і `splice` змінюють масив на місці, тож тут не підходять.

### ⬆️ Підняття стану

Часто два компоненти мають показувати одне й те саме значення. Приклад — акордеон: дві панелі, і відкритою може бути лише одна. Якщо кожна `Panel` тримає власний `isActive`, вони не знають одна про одну, і відкриються обидві.

Рішення — **підняти стан** (lifting state up): прибрати state з дітей і перенести в найближчого спільного батька. Батько передає дітям значення через props і функцію, щоб його змінити.

```tsx
// app/accordion/accordion.tsx
'use client'

import { useState } from 'react'

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0) // стан живе в батьку

  return (
    <>
      <Panel title="Доставка" isActive={activeIndex === 0} onShow={() => setActiveIndex(0)}>
        Відправляємо щодня до 18:00.
      </Panel>
      <Panel title="Оплата" isActive={activeIndex === 1} onShow={() => setActiveIndex(1)}>
        Карткою або при отриманні.
      </Panel>
    </>
  )
}

function Panel({
  title,
  isActive,
  onShow,
  children,
}: {
  title: string
  isActive: boolean
  onShow: () => void
  children: React.ReactNode
}) {
  return (
    <section>
      <h3>{title}</h3>
      {isActive ? <p>{children}</p> : <button onClick={onShow}>Показати</button>}
    </section>
  )
}
```

`Panel` тепер **керований** компонент: що показувати, вирішує батько. Дані течуть униз (props), а події — вгору (виклик `onShow`). Для кожного значення має бути одне **джерело правди**: компонент, що тримає його в state.

> [!diagram] Стан у батьку, props у дітях
> ```yaml
> layout: tree
> nodes:
>   - { id: acc, label: "Accordion", code: "activeIndex = 0", note: "єдине джерело правди", tone: violet }
>   - { id: p1, label: "Panel «Доставка»", text: "isActive: true", parent: acc, tone: green }
>   - { id: p2, label: "Panel «Оплата»", text: "isActive: false", note: "кнопка «Показати»", parent: acc, tone: gray }
> steps:
>   - { focus: acc, note: "Стан тримає лише Accordion. Панелі отримують isActive і onShow через props." }
>   - { focus: p2, note: "Користувач клікає «Показати» в другій панелі. Панель не міняє себе сама, а викликає onShow — функцію батька." }
>   - { set: { acc: "activeIndex = 1" }, focus: acc, note: "onShow викликає setActiveIndex(1). Змінився state батька, тож React рендерить Accordion знову." }
>   - { set: { p1: "isActive: false", p2: "isActive: true" }, focus: [p1, p2], note: "Обидві панелі отримують нові props. Перша згортається, друга відкривається: відкритою не може бути більше однієї." }
> ```
> Дані течуть униз, події — вгору.

### 🧮 Похідний стан

Найпоширеніша помилка новачка — тримати в state те, що можна **порахувати**. Якщо значення виводиться з props чи іншого state, це **похідне значення** (derived state). Його рахують прямо під час рендеру, звичайною змінною:

```tsx
// app/cart/cart.tsx (фрагмент)
// ❌ зайвий стан і зайвий ефект: total завжди можна порахувати з items
const [total, setTotal] = useState(0)
useEffect(() => {
  setTotal(items.reduce((sum, i) => sum + i.price * i.qty, 0))
}, [items])

// ✅ похідне значення: рахуємо під час рендеру
const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
```

Перший варіант гірший трьома способами. Він робить зайвий рендер: спершу зі старим `total`, потім ефект ставить новий, і React рендерить ще раз. Він може розійтися з даними: забув оновити `total` в одному місці — і на екрані неправда. І його видно на сторінці: у серверному HTML продакшн-збірки перший варіант показує «Разом: 0 ₴», а другий — «Разом: 620 ₴». Ефекти на сервері не виконуються, тож користувач бачить спершу нуль, а потім стрибок.

Так само з `todos.filter((t) => !t.done).length` у списку справ, з `firstName + ' ' + lastName` чи з відфільтрованим списком за пошуковим запитом: тримай у state мінімум (`todos`, `query`), а решту рахуй. Важке обчислення можна закешувати хуком `useMemo` (або це зробить React Compiler), але почни з простої змінної.

### ⚡ useEffect: синхронізація із зовнішнім світом

Більшість коду компонента — рендер або обробники подій. Але іноді компонент має щось робити просто тому, що він **на екрані**: оновити заголовок вкладки, запустити таймер, підписатися на подію браузера. Це **ефект** (Effect) — код, що синхронізує компонент із **системою поза React**.

```tsx
// app/title/title-sync.tsx
'use client'

import { useEffect, useState } from 'react'

export default function TitleSync() {
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    document.title = unread > 0 ? `(${unread}) Пошта` : 'Пошта' // синхронізація із зовнішнім світом
  }, [unread]) // перезапускати, коли змінився unread

  return <button onClick={() => setUnread(unread + 1)}>Новий лист ({unread})</button>
}
```

`useEffect(setup, deps)` приймає функцію і **масив залежностей**. React запускає `setup` **після** того, як оновив DOM, а не під час рендеру. Масив каже, коли запускати знову:

| Виклик | Коли запускається |
|---|---|
| `useEffect(fn)` | після кожного рендеру |
| `useEffect(fn, [])` | один раз, після першої появи компонента |
| `useEffect(fn, [a, b])` | після першої появи і щоразу, коли змінилось `a` або `b` |

У залежності пишуть **усі** props і state, які ефект читає. Їх не обирають «за бажанням», а знаходять у коді — лінтер `react-hooks/exhaustive-deps` (є в `eslint-config-next`) підкаже, що пропущено.

Якщо ефект щось запускає, він має це й зупиняти. Для цього `setup` повертає **функцію очищення** (cleanup):

```tsx
// app/clock/clock.tsx
'use client'

import { useEffect, useState } from 'react'

export default function Clock() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    console.log('старт таймера')
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => {
      console.log('стоп таймера')
      clearInterval(id) // cleanup: прибираємо за собою
    }
  }, []) // [] — лише після першого показу

  return <p>Минуло {seconds} с</p>
}
```

React викликає cleanup перед кожним повторним запуском ефекту і коли компонент зникає з екрана. Без нього після переходу на іншу сторінку таймер тікав би далі, а після повернення їх стало б два. З `cacheComponents: true` Next.js не знімає сторінку при переході, а ховає її через React `<Activity>`: cleanup ефектів спрацьовує при схованні, а state зберігається до повернення (детально — у [[Next.js - 04. Навігація під капотом]]).

Зверни увагу на `setSeconds((s) => s + 1)`. Функція в `setInterval` створена в першому рендері, де `seconds` = 0. З `setSeconds(seconds + 1)` лічильник застрягне на `1`: і через 4 секунди на екрані «Минуло 1 с». Оновлювач читає свіже значення з черги.

У `next dev` консоль браузера покаже `старт таймера`, `стоп таймера`, `старт таймера`. Це не баг: у розробці Strict Mode (в App Router увімкнений за замовчуванням) **навмисно** монтує компонент, знімає і монтує знову, щоб перевірити cleanup. У продакшн-збірці запуск один. Якщо подвійний запуск щось ламає, допиши cleanup, а не вимикай Strict Mode.

> [!quiz] Перевір себе: склади, що відбувається з `Clock` у `next dev`
> level: junior · type: order · id: nextjs-start-03-quiz-06
>
> ```order
> React викликає Clock() і отримує JSX
> React оновлює DOM: на екрані «Минуло 0 с»
> Ефект запускає таймер: «старт таймера»
> Strict Mode знімає компонент: cleanup пише «стоп таймера»
> Strict Mode монтує знову: ефект пише «старт таймера»
> Користувач іде зі сторінки: cleanup зупиняє таймер
> Ефект запускає таймер ще до того, як React оновив DOM ✗
> ```
>
> **Пояснення:** спершу рендер, потім оновлення DOM, і лише потім ефект — тому ефект і бачить готовий DOM. Подвійний запуск з cleanup між ними — перевірка Strict Mode, лише в розробці. Останній cleanup спрацьовує, коли компонент зникає з екрана.

### 🚫 Коли ефект не потрібен

Ефект — «аварійний вихід» з React, для звʼязку із зовнішнім світом. Якщо зовнішньої системи немає, ефект, найімовірніше, зайвий. Документація React присвятила цьому окрему сторінку «You Might Not Need an Effect». Короткий перелік:

| Хочеш… | Замість ефекту |
|---|---|
| порахувати значення з props чи state (сума, фільтр, `fullName`) | рахуй під час рендеру ([[#🧮 Похідний стан]]) |
| зробити щось у відповідь на клік чи відправку форми | пиши код в обробнику події |
| скинути весь стан компонента, коли змінився prop (`userId`) | передай `key={userId}`, і React створить компонент наново |
| отримати дані для сторінки в Next.js | читай їх у Server Component (тема [[Next.js Start - 10. Дані на сервері]]) |
| оновити state батька, коли змінився state дитини | підніми стан ([[#⬆️ Підняття стану]]) |

Ефект запускається **після** рендеру, тож `setState` з нього — ще один рендер, а на сервері ефекти не виконуються зовсім. Якщо код має вигляд «коли змінилося X — постав Y», спершу спробуй порахувати Y з X прямо в рендері.

> [!quiz] Перевір себе: де зайвий ефект?
> level: junior · id: nextjs-start-03-quiz-07
>
> Який із цих ефектів варто прибрати?
>
> - [x] `useEffect(() => { setFullName(first + ' ' + last) }, [first, last])`
> - [ ] `useEffect(() => { document.title = title }, [title])`
> - [ ] `useEffect(() => { const id = setInterval(tick, 1000); return () => clearInterval(id) }, [])`
> - [ ] `useEffect(() => { window.addEventListener('resize', onResize); return () => window.removeEventListener('resize', onResize) }, [])`
>
> **Пояснення:** `fullName` повністю виводиться з `first` і `last`: `const fullName = first + ' ' + last` під час рендеру, без state і зайвого рендеру. Інші три синхронізують компонент із зовнішнім світом — заголовком вкладки, таймером, подіями вікна, — і саме для цього ефекти існують.

### 📏 Правила хуків

Хуки — звичайні функції, але з двома правилами:

1. **Викликай хуки лише на верхньому рівні компонента**: не в умовах, циклах, після раннього `return`, не у вкладених функціях і обробниках.
2. **Викликай хуки лише з компонентів React або власних хуків** (функцій, чия назва починається з `use`), а не зі звичайних функцій.

Чому так суворо? React не знає імен твоїх змінних. Він памʼятає state компонента як **список за порядком викликів**: перший `useState` — комірка 1, другий — комірка 2. Якщо в одному рендері хук пропустили через `if`, усі наступні «зʼїдуть» на чужі комірки.

```tsx
// app/conditional/search.tsx
'use client'

import { useState } from 'react'

export default function Search({ enabled }: { enabled: boolean }) {
  if (!enabled) return null // ранній return…
  const [query, setQuery] = useState('') // ❌ …а хук після нього
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />
}
```

ESLint у проєкті `create-next-app` ловить це одразу (вивід `npx eslint` на 16.3.8):

```text
8:29  error  React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?  react-hooks/rules-of-hooks
```

Виправлення — перенести хук над умовою, а умову застосувати до JSX. Якщо логіка з хуками повторюється в кількох компонентах, її виносять у **власний хук** — функцію `useЩось`, усередині якої інші хуки. Правила для неї ті самі.

> [!quiz] Перевір себе: що порушує правила хуків?
> level: junior · type: multi · id: nextjs-start-03-quiz-08
>
> - [x] `if (isLoggedIn) { const [name, setName] = useState('') }`
> - [x] `items.map((item) => { const [open, setOpen] = useState(false); return … })` у тілі компонента
> - [x] `function handleClick() { const [x, setX] = useState(0) }`
> - [ ] `const [a, setA] = useState(0)` і `const [b, setB] = useState('')` підряд на початку компонента
> - [ ] `function useCart() { const [items, setItems] = useState([]); return items }`
>
> **Пояснення:** умова, цикл і обробник роблять кількість чи порядок викликів різним між рендерами або виносять хук з рендеру. Кілька хуків підряд на верхньому рівні — нормальна справа. `useCart` — власний хук: назва з `use`, хук усередині на верхньому рівні. Для списку, де кожен елемент має свій `open`, виносять окремий компонент `<Item />` з власним state.

### 🧭 Хуки в Next.js

У Next.js App Router кожен файл за замовчуванням — **Server Component**: він виконується на сервері, а в браузер приходить лише результат. На сервері немає кліків і повторних рендерів, тож `useState`, `useEffect` та обробники подій там не мають сенсу. Хук у файлі без директиви зупиняє збірку. Ось справжнє повідомлення з `next dev` на 16.3.8:

```text
⨯ ./app/server-hook/page.tsx:2:10
Error: You're importing a module that depends on `useState` into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the `"use client"` directive.
```

Файл і рядок показують, де імпортовано хук, а підказка в кінці — що робити. Директива `'use client'` першим рядком робить компонент **Client Component**: його код поїде в браузер і зможе реагувати на дії користувача.

Але не став `'use client'` на всю сторінку. Тримай сторінку серверною, а інтерактивний шматок винось в окремий маленький файл з директивою, як у всіх прикладах вище: `page.tsx` без директиви імпортує `counter.tsx` з нею. Так у браузер їде менше коду, а сторінка читає дані прямо на сервері. Детально про межу — у [[Next.js - 07. Server і Client Components]].

І ще: Client Component **теж** рендериться на сервері для першого HTML, але ефекти там не виконуються. Тому `window` і `localStorage` чіпають лише в `useEffect` чи обробниках.

> [!quiz] Що буде в серверному HTML?
> level: junior · type: output · id: nextjs-start-03-quiz-09
>
> Сторінка (Server Component) рендерить Client Component `CartWithEffect` з товарами на 620 ₴. Що побачить `curl` у HTML продакшн-збірки?
>
> ```tsx
> // app/cart/cart.tsx
> 'use client'
>
> export function CartWithEffect({ items }: { items: Item[] }) {
>   const [total, setTotal] = useState(0)
>   useEffect(() => {
>     setTotal(items.reduce((sum, i) => sum + i.price * i.qty, 0))
>   }, [items])
>   return <p>Разом: {total} ₴</p>
> }
> ```
>
> - [x] `Разом: 0 ₴`
> - [ ] `Разом: 620 ₴`
> - [ ] Порожній `<p>` — Client Components рендеряться лише в браузері
> - [ ] Помилка збірки: `useEffect` не можна в компоненті з props
>
> **Пояснення:** Client Component рендериться на сервері, але ефект там не запускається, тож `total` лишається початковим `0`. У браузері ефект порахує 620, і число «стрибне». Похідне значення `const total = items.reduce(…)` дало б 620 одразу, і в HTML, і на екрані.

### 🏭 Як це роблять у продакшні

- **State — мінімальний**: лише те, що не можна порахувати (введений текст, обраний id). Решта — похідні змінні.
- **Складна логіка оновлень — у reducer**: одна функція `reducer(state, action)` з хуком `useReducer`, яку легко тестувати без браузера (задача 3 нижче).
- **Ефекти — рідкість.** Дані — у Server Components, реакція на дії — в обробниках, форми — через Server Actions ([[Next.js Start - 11. Перша форма і Server Action]]). `useEffect` — для таймерів, підписок і браузерних API.
- **Лінтер увімкнений**: `react-hooks/rules-of-hooks` і `react-hooks/exhaustive-deps` ловлять більшість помилок з хуками.

## ⚠️ Пастки

> [!pitfall] Виклик замість функції в onClick
> `onClick={handleClick()}` виконується під час рендеру. З сетером усередині — нескінченний цикл і `Too many re-renders`.
>
> ```tsx
> <button onClick={handleClick()}>+</button> // ❌
> <button onClick={handleClick}>+</button>   // ✅
> ```

> [!pitfall] Мутація і той самий обʼєкт у сетері
> React порівнює значення через `Object.is`. Той самий обʼєкт — «нічого не змінилося», рендеру немає, а зміна вилізе пізніше.
>
> ```tsx
> todos.push(newTodo); setTodos(todos)   // ❌
> setTodos([...todos, newTodo])          // ✅
> ```

> [!pitfall] Читати state одразу після сетера
> Сетер не змінює змінну в поточному рендері. Нове значення буде лише в наступному.
>
> ```tsx
> setCount(count + 1)
> console.log(count) // ❌ старе значення
> ```

> [!pitfall] Стара змінна в таймері
> Функція в `setInterval` памʼятає state свого рендеру. З `[]` у залежностях лічильник застрягне на 1.
>
> ```tsx
> setInterval(() => setSeconds(seconds + 1), 1000)   // ❌ завжди 0 + 1
> setInterval(() => setSeconds((s) => s + 1), 1000)  // ✅
> ```

> [!pitfall] Ефект для похідного значення
> Зайвий рендер, ризик розсинхрону і нуль у серверному HTML. Рахуй під час рендеру.
>
> ```tsx
> useEffect(() => setTotal(sum(items)), [items]) // ❌
> const total = sum(items)                       // ✅
> ```

## 🔗 Звʼязки

- [[Next.js Start - 02. React-мінімум, компоненти, JSX і props]] — компоненти, JSX і props, на які спирається ця тема.
- [[Next.js Start - 04. TypeScript-мінімум для Next.js]] — як типізувати state (`useState<User | null>(null)`), props і обробники.
- [[Next.js - 07. Server і Client Components]] — чому хуки лише в Client Components і де проводити межу `'use client'`.
- [[Next.js Start - 10. Дані на сервері]] і [[Next.js Start - 11. Перша форма і Server Action]] — дані й форми без `useEffect`.
- [[JavaScript - 03. Значення та посилання]] — чому мутація обʼєкта не створює «нове значення».
- Довідник React: [[useState]], [[useEffect]], [[Rules of Hooks]], [[You Might Not Need an Effect]], [[Extracting State Logic into a Reducer]].

## ⚡ Фішки

> [!reel] 📸 State — це знімок, а не змінна
> У кожному рендері `count` — константа. Сетер не міняє її, а замовляє наступний рендер з новим значенням.
>
> ```tsx
> setCount(count + 1)
> console.log(count) // досі старе
> ```

> [!reel] 🔁 Оновлювач рахує від попереднього
> Три `setN(n + 1)` дають +1, три `setN((n) => n + 1)` — +3. Оновлювач отримує значення з черги, а не з рендеру.

> [!reel] 🧱 Мутація не викликає рендер
> `todos.push(x); setTodos(todos)` — той самий масив, і React нічого не перемальовує. Зміна вилізе з наступним рендером, де її не чекаєш.

> [!reel] 🧮 Що можна порахувати — не тримай у state
> Сума кошика, відфільтрований список, `fullName` — звичайні змінні в рендері. Ефект для них — зайвий рендер і нуль у серверному HTML.

> [!reel] 👯 У dev ефект запускається двічі — навмисно
> Strict Mode у `next dev` монтує компонент, знімає і монтує знову, щоб перевірити cleanup. У продакшні — один запуск.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке state і чим він відрізняється від звичайної змінної?
> *дуже часто · теорія* · `nextjs-start-03-card-01`
>
> State — памʼять компонента між рендерами, яку дає `useState`. Звичайна змінна створюється заново при кожному виклику компонента, а її зміна не запускає рендер. Сетер state робить обидві речі: зберігає значення і просить React відрендерити компонент знову.
>
> 📚 [[Next.js Start - 03. React-мінімум, state, події й ефекти#🧠 Навіщо state|Розділ: навіщо state]] · [React: State — a Component's Memory](https://react.dev/learn/state-a-components-memory)

> [!question]- Чому `onClick={handleClick()}` — помилка?
> *часто · код* · `nextjs-start-03-card-02`
>
> Дужки викликають функцію під час рендеру, і в `onClick` потрапляє її результат. Треба передати саму функцію: `onClick={handleClick}` або стрілку `onClick={() => remove(id)}`, коли потрібен аргумент. Із сетером усередині виклик у рендері дає нескінченний цикл.
>
> 📚 [[Next.js Start - 03. React-мінімум, state, події й ефекти#🖱️ Події|Розділ: події]] · [React: Responding to Events](https://react.dev/learn/responding-to-events)

> [!question]- Чому після `setCount(count + 1)` у тому ж обробнику `count` старий?
> *дуже часто · теорія* · `nextjs-start-03-card-03`
>
> State — знімок рендеру: у поточному виклику компонента `count` не змінюється. Сетер ставить значення в чергу, React після обробника робить один рендер (batching), і лише в ньому `count` нове.
>
> 📚 [[Next.js Start - 03. React-мінімум, state, події й ефекти#📸 State як знімок|Розділ: state як знімок]] · [React: State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)

> [!question]- Що таке функція-оновлювач і коли її використовувати?
> *часто · код* · `nextjs-start-03-card-04`
>
> Функція, яку передають сетеру замість значення: `setCount((c) => c + 1)`. Вона отримує попереднє значення з черги. Потрібна, коли нове значення залежить від старого і оновлень кілька підряд або код виконається пізніше (таймер, `setInterval`).
>
> 📚 [[Next.js Start - 03. React-мінімум, state, події й ефекти#📸 State як знімок|Розділ: оновлювач]] · [React: Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)

> [!question]- Як правильно оновити обʼєкт у state?
> *дуже часто · код* · `nextjs-start-03-card-05`
>
> Створити новий обʼєкт і передати його сетеру: `setUser({ ...user, name })`. Мутація `user.name = …` з тим самим обʼєктом не запускає рендер. Spread поверхневий: вкладені обʼєкти копіюють на кожному рівні.
>
> 📚 [[Next.js Start - 03. React-мінімум, state, події й ефекти#🧱 Обʼєкти й масиви: заміняй, а не змінюй|Розділ: обʼєкти й масиви]] · [React: Updating Objects in State](https://react.dev/learn/updating-objects-in-state)

> [!question]- Як додати, прибрати і змінити елемент масиву в state?
> *дуже часто · код* · `nextjs-start-03-card-06`
>
> Додати — `[...arr, item]`, прибрати — `filter`, змінити — `map` з новим обʼєктом для зміненого елемента, сортувати — `toSorted` або копію `[...arr].sort()`. `push`, `splice`, `sort`, `reverse` змінюють масив на місці — у state їх не використовують.
>
> 📚 [[Next.js Start - 03. React-мінімум, state, події й ефекти#🧱 Обʼєкти й масиви: заміняй, а не змінюй|Розділ: обʼєкти й масиви]] · [React: Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state)

> [!question]- Що таке підняття стану?
> *часто · теорія* · `nextjs-start-03-card-07`
>
> Перенесення state з кількох дітей у найближчого спільного батька, коли вони мають бачити одне значення. Батько передає значення props і функцію-обробник (`onShow`), діти її викликають. Так у значення одне джерело правди.
>
> 📚 [[Next.js Start - 03. React-мінімум, state, події й ефекти#⬆️ Підняття стану|Розділ: підняття стану]] · [React: Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)

### 🟡 Middle

> [!question]- Що таке похідний стан і чому його не тримають у useState?
> *дуже часто · практика* · `nextjs-start-03-card-08`
>
> Значення, яке можна порахувати з props чи state: сума кошика, кількість невиконаних справ, відфільтрований список. Його рахують під час рендеру. Копія в state з ефектом дає зайвий рендер, ризик розсинхрону, а в серверному HTML — початкове значення замість справжнього.
>
> 📚 [[Next.js Start - 03. React-мінімум, state, події й ефекти#🧮 Похідний стан|Розділ: похідний стан]] · [React: Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)

> [!question]- Що означає масив залежностей useEffect: без нього, `[]` і `[a]`?
> *дуже часто · теорія* · `nextjs-start-03-card-09`
>
> Без масиву — ефект після кожного рендеру. `[]` — один раз після першої появи. `[a]` — після появи і щоразу, коли `a` змінилось. У масиві мають бути всі props і state, які ефект читає; лінтер `exhaustive-deps` це перевіряє.
>
> 📚 [[Next.js Start - 03. React-мінімум, state, події й ефекти#⚡ useEffect: синхронізація із зовнішнім світом|Розділ: useEffect]] · [React: useEffect](https://react.dev/reference/react/useEffect)

> [!question]- Навіщо cleanup і чому в dev ефект запускається двічі?
> *часто · теорія* · `nextjs-start-03-card-10`
>
> Cleanup — функція, яку повертає ефект: зупиняє таймер, відписується, закриває зʼєднання. React викликає її перед повторним запуском і при знятті компонента. У `next dev` Strict Mode навмисно монтує, знімає і монтує компонент знову, щоб показати ефекти без cleanup. У продакшні запуск один.
>
> 📚 [[Next.js Start - 03. React-мінімум, state, події й ефекти#⚡ useEffect: синхронізація із зовнішнім світом|Розділ: cleanup]] · [React: Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)

> [!question]- Які правила хуків і чому вони існують?
> *часто · теорія* · `nextjs-start-03-card-11`
>
> Хуки викликають лише на верхньому рівні компонента чи власного хука: не в умовах, циклах, обробниках і не після раннього `return`. React зберігає state за порядком викликів хуків, тож порядок має бути однаковим у кожному рендері. Порушення ловить `react-hooks/rules-of-hooks`.
>
> 📚 [[Next.js Start - 03. React-мінімум, state, події й ефекти#📏 Правила хуків|Розділ: правила хуків]] · [React: Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)

> [!question]- Чому `useState` у `page.tsx` ламає збірку в Next.js?
> *часто · практика* · `nextjs-start-03-card-12`
>
> У App Router файли за замовчуванням — Server Components, а хуки працюють лише в Client Components. Next.js зупиняє збірку з `You're importing a module that depends on useState into a React Server Component module`. Виправлення — винести інтерактивну частину в окремий файл з `'use client'` і імпортувати його зі сторінки.
>
> 📚 [[Next.js Start - 03. React-мінімум, state, події й ефекти#🧭 Хуки в Next.js|Розділ: хуки в Next.js]] · [Next.js: use client](https://nextjs.org/docs/app/api-reference/directives/use-client)

## 🛠️ Практика

> [!task] Порахуй підсумок кошика
> level: junior · difficulty: easy · id: nextjs-start-03-task-01 · tags: derived-state, react
>
> Замість чотирьох `useState` для кількості, суми, знижки й доставки компонент кошика рахуватиме все з `items` під час рендеру. Напиши функцію `summarizeCart(items, promo)`, що повертає `{ count, subtotal, discount, delivery, total }`:
>
> - `count` — сума `qty`, `subtotal` — сума `price * qty`;
> - промокод `'MINUS10'` дає знижку 10 % від `subtotal`, округлену `Math.round`; інший код чи `null` — знижка `0`;
> - доставка `100`, якщо `subtotal` менший за `1000`; від `1000` і для порожнього кошика — `0`;
> - `total = subtotal - discount + delivery`;
> - вхідний масив не змінюй.
>
> Задача на TypeScript: типи знімаються перед запуском і не перевіряються, тести дивляться на значення.
>
> ```ts starter
> type CartItem = { id: string; price: number; qty: number }
>
> type CartSummary = {
>   count: number
>   subtotal: number
>   discount: number
>   delivery: number
>   total: number
> }
>
> function summarizeCart(items: CartItem[], promo: string | null): CartSummary {
>   // твій код
>   return { count: 0, subtotal: 0, discount: 0, delivery: 0, total: 0 }
> }
> ```
>
> ```ts tests
> const cup = { id: 'cup', price: 250, qty: 2 }
> const tea = { id: 'tea', price: 120, qty: 1 }
>
> test('порожній кошик — усе нулі, без доставки', () => {
>   expect(summarizeCart([], null)).toEqual({ count: 0, subtotal: 0, discount: 0, delivery: 0, total: 0 })
> })
>
> test('рахує кількість і суму з урахуванням qty', () => {
>   expect(summarizeCart([cup, tea], null)).toEqual({ count: 3, subtotal: 620, discount: 0, delivery: 100, total: 720 })
> })
>
> test('MINUS10 дає 10 % знижки з округленням', () => {
>   const s = summarizeCart([{ id: 'x', price: 333, qty: 1 }], 'MINUS10')
>   expect(s.discount).toBe(33)
>   expect(s.total).toBe(333 - 33 + 100)
> })
>
> test('від 1000 ₴ доставка безкоштовна, невідомий код ігнорується', () => {
>   const s = summarizeCart([{ id: 'kettle', price: 1000, qty: 1 }], 'SALE')
>   expect(s).toEqual({ count: 1, subtotal: 1000, discount: 0, delivery: 0, total: 1000 })
> })
>
> test('не змінює вхідний масив', () => {
>   const items = [cup, tea]
>   const copy = JSON.parse(JSON.stringify(items))
>   summarizeCart(items, 'MINUS10')
>   expect(items).toEqual(copy)
> })
> ```
>
> > [!hint]- Підказка 1
> > `reduce` з початковим значенням `0`: `items.reduce((sum, i) => sum + i.price * i.qty, 0)`.
>
> > [!hint]- Підказка 2
> > Поріг доставки перевіряй за `subtotal` до знижки, а порожній кошик — окремо: `subtotal === 0`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function summarizeCart(items: CartItem[], promo: string | null): CartSummary {
> >   const count = items.reduce((sum, i) => sum + i.qty, 0)
> >   const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
> >   const discount = promo === 'MINUS10' ? Math.round(subtotal * 0.1) : 0
> >   const delivery = subtotal > 0 && subtotal < 1000 ? 100 : 0
> >   return { count, subtotal, discount, delivery, total: subtotal - discount + delivery }
> > }
> > ```
> >
> > У компоненті це один рядок: `const summary = summarizeCart(items, promo)`. State — лише `items` і `promo`, решта похідне, тож розсинхрону не буває, а серверний HTML одразу показує правильну суму.

> [!task] Змоделюй чергу оновлень state
> level: junior · difficulty: easy · id: nextjs-start-03-task-02 · tags: state, batching, react
>
> Напиши `applyUpdates(base, queue)` — так React рахує state для наступного рендеру. `base` — значення в поточному рендері, `queue` — те, що передали сетеру в одному обробнику, по порядку:
>
> - якщо елемент черги — **функція**, це оновлювач: виклич її з результатом попереднього кроку;
> - інакше це нове значення: воно просто замінює попереднє.
>
> ```js
> // setA(a + 1) тричі при a = 0 → у черзі [1, 1, 1]
> applyUpdates(0, [1, 1, 1]) // → 1
> applyUpdates(0, [5, (n) => n + 1]) // → 6
> ```
>
> ```js starter
> function applyUpdates(base, queue) {
>   // твій код
> }
> ```
>
> ```js tests
> test('порожня черга — значення не змінюється', () => {
>   expect(applyUpdates(7, [])).toBe(7)
> })
>
> test('три однакові значення дають одне оновлення', () => {
>   expect(applyUpdates(0, [1, 1, 1])).toBe(1)
> })
>
> test('три оновлювачі додають тричі', () => {
>   const inc = (n) => n + 1
>   expect(applyUpdates(0, [inc, inc, inc])).toBe(3)
> })
>
> test('значення, потім оновлювач: 0 → 5 → 6', () => {
>   expect(applyUpdates(0, [5, (n) => n + 1])).toBe(6)
> })
>
> test('оновлювач, потім значення: значення перемагає', () => {
>   expect(applyUpdates(0, [(n) => n + 1, 42])).toBe(42)
> })
>
> test('працює з будь-якими значеннями, не лише з числами', () => {
>   expect(applyUpdates('a', [(s) => s + 'b', (s) => s + 'c'])).toBe('abc')
> })
> ```
>
> > [!hint]- Підказка 1
> > Пройди чергу циклом, тримаючи «поточний результат», що спершу дорівнює `base`.
>
> > [!hint]- Підказка 2
> > Відрізнити оновлювач від значення: `typeof update === 'function'`. Оновлювач отримує результат попереднього кроку, а не `base`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function applyUpdates(base, queue) {
> >   let result = base
> >   for (const update of queue) {
> >     result = typeof update === 'function' ? update(result) : update
> >   }
> >   return result
> > }
> > ```
> >
> > Це і є «state як знімок»: `setA(a + 1)` кладе в чергу вже пораховане число, тож три такі виклики — три однакові значення. Оновлювач рахує від попереднього кроку. Через це в React не можна зберегти функцію в state простим `setX(fn)` — її сприймуть як оновлювач; пишуть `setX(() => fn)`.

> [!task] Напиши reducer списку справ
> level: junior · difficulty: medium · id: nextjs-start-03-task-03 · tags: reducer, immutability, react
>
> Коли сетерів багато, логіку оновлень збирають в одну функцію **reducer**: `(state, action) => newState`. Її підключають хуком `useReducer`, а тестують як звичайну функцію. Напиши `todosReducer(todos, action)` для дій:
>
> - `added` (`id`, `title`) — додає `{ id, title, done: false }` у кінець; якщо `title` після `trim()` порожній — повертає **той самий** масив;
> - `toggled` (`id`) — перевертає `done` у цієї справи;
> - `renamed` (`id`, `title`) — змінює `title`;
> - `removed` (`id`) — прибирає справу;
> - невідома дія — повертає той самий масив.
>
> Не мутуй ні масив, ні справи: змінена справа — новий обʼєкт, незмінені — ті самі обʼєкти (так React бачить, що змінилося лише одне).
>
> ```ts starter
> type Todo = { id: number; title: string; done: boolean }
>
> type TodoAction =
>   | { type: 'added'; id: number; title: string }
>   | { type: 'toggled'; id: number }
>   | { type: 'renamed'; id: number; title: string }
>   | { type: 'removed'; id: number }
>
> function todosReducer(todos: Todo[], action: TodoAction): Todo[] {
>   // ❌ мутує state — React не побачить змін
>   if (action.type === 'added') {
>     todos.push({ id: action.id, title: action.title, done: false })
>   }
>   return todos
> }
> ```
>
> ```ts tests
> const initial = () => [
>   { id: 1, title: 'Вивчити useState', done: true },
>   { id: 2, title: 'Вивчити useEffect', done: false },
> ]
>
> test('added додає в кінець і не змінює старий масив', () => {
>   const todos = initial()
>   const next = todosReducer(todos, { type: 'added', id: 3, title: 'Здати проєкт' })
>   expect(next).not.toBe(todos)
>   expect(todos).toHaveLength(2)
>   expect(next[2]).toEqual({ id: 3, title: 'Здати проєкт', done: false })
> })
>
> test('added з порожньою назвою повертає той самий масив', () => {
>   const todos = initial()
>   expect(todosReducer(todos, { type: 'added', id: 3, title: '   ' })).toBe(todos)
> })
>
> test('toggled створює нову справу, решта — ті самі обʼєкти', () => {
>   const todos = initial()
>   const next = todosReducer(todos, { type: 'toggled', id: 2 })
>   expect(next[1]).toEqual({ id: 2, title: 'Вивчити useEffect', done: true })
>   expect(next[1]).not.toBe(todos[1])
>   expect(todos[1].done).toBe(false)
>   expect(next[0]).toBe(todos[0])
> })
>
> test('renamed змінює лише назву', () => {
>   const todos = initial()
>   const next = todosReducer(todos, { type: 'renamed', id: 1, title: 'Вивчити хуки' })
>   expect(next[0]).toEqual({ id: 1, title: 'Вивчити хуки', done: true })
>   expect(todos[0].title).toBe('Вивчити useState')
> })
>
> test('removed прибирає справу', () => {
>   const todos = initial()
>   const next = todosReducer(todos, { type: 'removed', id: 1 })
>   expect(next.map((t) => t.id)).toEqual([2])
>   expect(todos).toHaveLength(2)
> })
>
> test('невідома дія повертає той самий масив', () => {
>   const todos = initial()
>   expect(todosReducer(todos, { type: 'cleared' } as any)).toBe(todos)
> })
> ```
>
> > [!hint]- Підказка 1
> > `switch (action.type)` з `case` на кожну дію. Для `added` — `[...todos, нова]`, для `removed` — `filter`.
>
> > [!hint]- Підказка 2
> > Для `toggled` і `renamed` — `map`: якщо `t.id === action.id`, поверни `{ ...t, … }`, інакше саму `t`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function todosReducer(todos: Todo[], action: TodoAction): Todo[] {
> >   switch (action.type) {
> >     case 'added': {
> >       const title = action.title.trim()
> >       if (!title) return todos
> >       return [...todos, { id: action.id, title, done: false }]
> >     }
> >     case 'toggled':
> >       return todos.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t))
> >     case 'renamed':
> >       return todos.map((t) => (t.id === action.id ? { ...t, title: action.title } : t))
> >     case 'removed':
> >       return todos.filter((t) => t.id !== action.id)
> >     default:
> >       return todos
> >   }
> > }
> > ```
> >
> > У компоненті: `const [todos, dispatch] = useReducer(todosReducer, initialTodos)` і `dispatch({ type: 'toggled', id })` в обробнику. Повернути той самий масив, коли нічого не змінилося, — теж частина контракту: React порівняє через `Object.is` і пропустить зайвий рендер.

## 📚 Джерела та що почитати

- 🟢 [React — Adding Interactivity](https://react.dev/learn/adding-interactivity) — події, state, знімок, оновлення обʼєктів і масивів.
- 🟢 [React — Managing State](https://react.dev/learn/managing-state) — структура стану, підняття стану, reducer.
- 🟢 [React — State as a Snapshot](https://react.dev/learn/state-as-a-snapshot) — чому значення не змінюється одразу.
- 🟢 [React — Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state) — таблиця мутуючих і немутуючих методів.
- 🟡 [React — Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects) — ефекти, залежності, cleanup, Strict Mode.
- 🟡 [React — You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) — найкорисніша сторінка про ефекти.
- 🟡 [React — Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks) — правила і приклади порушень.
- 🟡 [Next.js — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — коли потрібен `'use client'`.
- 🛠️ [Next.js — use client](https://nextjs.org/docs/app/api-reference/directives/use-client) — довідник директиви.

> [!important] Підсумок
> - State — памʼять компонента між рендерами (`useState`). Сетер ставить нове значення в чергу і запускає рендер; у поточному рендері значення не змінюється.
> - Обробнику передають функцію, а не її виклик. Якщо нове значення залежить від старого — функція-оновлювач `setX((prev) => …)`.
> - Обʼєкти й масиви в state не мутують: `{ ...obj }`, `[...arr, x]`, `map`, `filter`, `toSorted`.
> - Спільне значення живе в спільному батьку: дані вниз через props, події вгору через `onЩось`.
> - Що можна порахувати з props і state — рахуй під час рендеру. `useEffect` — лише для синхронізації із зовнішнім світом, з cleanup.
> - Хуки — лише на верхньому рівні компонента. У Next.js — лише у файлах з `'use client'`, і краще на маленьких листках.
