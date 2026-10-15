---
title: Тестування JavaScript
order: 33
level: middle
tags: [testing, unit, integration, e2e, mocks, fake-timers, tdd, vitest, playwright]
prerequisites:
  - "[[JavaScript - 10. async і await]]"
  - "[[JavaScript - 14. Debounce, throttle та async-патерни]]"
  - "[[JavaScript - 32. Патерни проєктування]]"
estimatedMinutes: 55
id: jsd-ch-33
icon: "🧪"
---

# JavaScript - 33. Тестування JavaScript

> [!success] 🎯 Після цього розділу ти зможеш
> - Обрати баланс unit / integration / e2e (піраміда чи трофей) і пояснити, що дає кожен рівень.
> - Писати тести за схемою AAA, які перевіряють поведінку, а не реалізацію.
> - Розрізняти stub, spy, mock і fake та не тонути в надмірному мокуванні.
> - Тестувати async-код і таймери з fake timers, DOM — через Testing Library, а користувацькі сценарії — через Playwright.
> - Критично ставитися до snapshot-тестів і покриття та застосувати TDD і property-based тестування.

## 🤔 Передбач

> [!quiz] Що станеться з цим тестом?
> level: middle · id: jsd-33-quiz-01
>
> ```js
> // loadUser повертає проміс з { id, name: 'Ann' }
> test('loads user', () => {
>   loadUser(1).then((u) => expect(u.name).toBe('WRONG'));
> });
> ```
>
> - [ ] Тест впаде з повідомленням `expected 'Ann' to be 'WRONG'`
> - [x] Тест буде позначено як пройдений: перевірка спрацює вже після його завершення
> - [ ] Тест «зависне», доки проміс не виконається
> - [ ] Тест-раннер не дозволить викликати `then` усередині тесту
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Функція тесту повертає `undefined`, тож раннер вважає тест синхронним і завершеним. Assertion спрацює пізніше — у кращому разі як «необроблена помилка після завершення тесту» в іншому місці звіту, у гіршому — непомітно. Ліки: `return` проміс або `async` + `await`.

## 🧒 Простими словами

Тести — це **страхувальна сітка під канатоходцем**. Unit-тести — дрібна сітка під кожним кроком: ловлять одразу, дешево, але лише конкретний крок. Integration — сітка під цілою ділянкою: чи стикуються кроки між собою. E2E — репетиція всього виступу в костюмах: найчесніша, але довга й дорога, і зірватися може через вітер (мережа, анімації), а не через тебе. Добра сітка не та, що найщільніша, а та, яка дає **сміливість змінювати код**: ти рефакториш — і, якщо щось зламав, дізнаєшся за секунди, а не від користувача.

## 🔬 Як це працює насправді

### Піраміда чи трофей: який портфель тестів

| Рівень | Що перевіряє | Швидкість | Впевненість | Крихкість |
|---|---|---|---|---|
| **Static** | типи (TypeScript), лінтер | миттєво | низька, але безкоштовна | — |
| **Unit** | одна функція/модуль ізольовано | мс | у межах одиниці | низька |
| **Integration** | кілька модулів разом: компонент + стан + фейковий API | десятки мс | висока | середня |
| **E2E** | реальний браузер, реальний бекенд, сценарій користувача | секунди | найвища | висока (flaky) |

```text
   Піраміда (Mike Cohn)                 Трофей (Kent C. Dodds)
         /\        E2E                         ___      E2E
        /  \                                  /   \
       /----\      Integration               |     |    Integration  ← найбільше
      /      \                                \___/
     /--------\    Unit  ← найбільше            |      Unit
    /__________\                              [___]    Static (TS, ESLint)
```

Піраміда оптимізує **швидкість і вартість**; трофей — **впевненість на вкладений час**: для фронтенду найбільше вигоди дають інтеграційні тести, що рендерять компонент з його реальними дітьми й підмінюють лише мережу. Спільне в обох: e2e — мало, на критичні шляхи (логін, оплата); бізнес-логіку з розгалуженнями — unit-тестами.

> [!quiz] Перевір себе: який рівень?
> level: junior · type: multi · id: jsd-33-quiz-02
>
> - [x] Функцію розрахунку знижки з 12 правилами найкраще покрити unit-тестами
> - [ ] E2E-тести мають бути основою набору, бо вони найчесніші
> - [x] Форма реєстрації з валідацією й запитом до (підміненого) API — гарний кандидат на integration-тест
> - [x] «Користувач може оплатити замовлення» — кандидат на один e2e-тест
>
> **Пояснення:** e2e найчесніші, але повільні й крихкі — їх тримають для критичних сценаріїв. Розгалужена чиста логіка дешево й повно тестується unit-ами, а взаємодію частин UI найкраще ловлять інтеграційні тести.

### Анатомія доброго тесту: AAA

**Arrange → Act → Assert** — підготуй, дій, перевір. Один тест — одна поведінка; назва описує поведінку, а не метод.

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCart } from './cart.js';

test('знижка 10% застосовується до суми від 1000 грн', () => {
  // Arrange
  const cart = createCart();
  cart.add({ id: 'kbd', price: 1200 });
  // Act
  const total = cart.total({ promo: 'SAVE10' });
  // Assert
  assert.equal(total, 1080);
});
```

Властивості доброго тесту:

- 🎯 **перевіряє поведінку**, а не реалізацію — рефакторинг без зміни поведінки не ламає тест;
- 🔁 **детермінований** — не залежить від часу, випадковості, мережі, порядку запуску;
- 🧩 **незалежний** — власний Arrange, жодного спільного змінного стану між тестами;
- 📖 **читається як специфікація** — помилка в CI зрозуміла без відкриття коду.

> [!quiz] Перевір себе: поведінка чи реалізація?
> level: middle · type: multi · id: jsd-33-quiz-03
>
> Які перевірки тестують **поведінку** компонента лічильника?
>
> - [x] Після кліку на «+» на екрані з'являється «1»
> - [ ] Після кліку викликано `setState` з аргументом `1`
> - [ ] Компонент має приватне поле `#count === 1`
> - [x] Після трьох кліків кнопка «+» стає неактивною (ліміт 3)
>
> **Пояснення:** користувач бачить текст і стан кнопок, а не `setState` і приватні поля. Тести на внутрішні деталі ламаються від будь-якого рефакторингу (наприклад, переходу на `useReducer`), навіть коли все працює.

> [!quiz] Склади тест за схемою AAA
> level: junior · type: order · id: jsd-33-quiz-10
>
> ```js order
> test('знижка 10% застосовується до суми від 1000 грн', () => {
>
>   const cart = createCart()
>   cart.add({ id: 'kbd', price: 1200 })
>
>   const total = cart.total({ promo: 'SAVE10' })
>
>   expect(total).toBe(1080)
>
> })
>
>   expect(cart.discountRate).toBe(0.1) // ✗
> ```
>
> **Пояснення:** Arrange (кошик з товаром) → Act (одна дія — порахувати суму) → Assert (перевірити результат, який бачить користувач). Перевірка внутрішнього поля `discountRate` — тест реалізації: він зламається від рефакторингу, навіть коли сума правильна.

### Test doubles: dummy, stub, spy, mock, fake

«Мок» у розмові часто означає будь-яку підміну, але різновиди відрізняються (термінологія Джерарда Месароша):

| Двійник | Що робить | Приклад |
|---|---|---|
| **Dummy** | заповнює параметр, не використовується | `createService({ logger: {} })` |
| **Stub** | повертає заготовлені відповіді | `getUser: async () => ({ id: 1 })` |
| **Spy** | записує виклики (часто поверх справжньої функції) | `vi.spyOn(console, 'error')` |
| **Mock** | наперед запрограмовані очікування викликів, перевіряє взаємодію | `expect(send).toHaveBeenCalledWith('ann@x.ua', …)` |
| **Fake** | робоча спрощена реалізація | in-memory репозиторій замість бази |

```js
test('реєстрація надсилає вітальний лист', async (t) => {
  const db = { insert: async (_, row) => ({ id: 1, ...row }) };   // stub
  const mailer = { send: t.mock.fn(async () => {}) };            // spy/mock
  const users = createUserService({ db, mailer, now: () => new Date(0) });

  await users.register({ email: 'ann@example.com' });

  assert.equal(mailer.send.mock.callCount(), 1);
  assert.deepEqual(mailer.send.mock.calls[0].arguments, ['ann@example.com', 'Ласкаво просимо!']);
});
```

Dependency injection ([[JavaScript - 32. Патерни проєктування]]) робить це тривіальним: двійники передаються параметрами. Мокати **модулі** (`vi.mock('./db.js')`) — потужно, але створює неявний зв'язок з шляхами файлів. Правило: мокай **межі системи** (мережа, час, випадковість, файлова система), а не власні модулі — інакше тести перевіряють, що код викликає те, що ти замокав.

> [!quiz] Перевір себе: який двійник?
> level: middle · id: jsd-33-quiz-04
>
> Замість реальної бази ти передаєш об'єкт з `Map` усередині, який справді зберігає й повертає записи за id. Що це?
>
> - [ ] Stub
> - [ ] Spy
> - [ ] Dummy
> - [x] Fake
>
> **Пояснення:** fake — робоча, але спрощена реалізація. Stub повертав би фіксовані відповіді без логіки, spy записував би виклики. Fake-и чудові для інтеграційних тестів: тест перевіряє результат, а не послідовність викликів.

### Async-код і таймери

Правило №1: тест має **дочекатися** асинхронної роботи — `async`/`await` або `return` проміс. Для помилок — спеціальні перевірки:

```js
await assert.rejects(loadUser(-1), /Not found/);       // node:test
await expect(loadUser(-1)).rejects.toThrow('Not found'); // Vitest / Jest
```

**Fake timers** підмінюють `setTimeout`, `setInterval`, `Date` — і тест керує часом вручну: 5-секундний debounce перевіряється за мілісекунди й детерміновано.

```js
test('debounce викликає fn один раз з останніми аргументами', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const fn = t.mock.fn();
  const d = debounce(fn, 100);

  d(1); d(2); d(3);
  t.mock.timers.tick(99);
  assert.equal(fn.mock.callCount(), 0);
  t.mock.timers.tick(1);
  assert.equal(fn.mock.callCount(), 1);
  assert.deepEqual(fn.mock.calls[0].arguments, [3]);
});
```

У Vitest те саме: `vi.useFakeTimers()`, `vi.advanceTimersByTime(ms)`, `vi.setSystemTime(date)`, `vi.useRealTimers()` в `afterEach`. Підступ — **таймер + проміс**: після «перемотки» callback таймера відпрацював, але `.then`/`await` після нього — це мікрозадачі, які ще треба виконати. Тому для async-коду є `vi.advanceTimersByTimeAsync(ms)`, а в `node:test` — допоміжне «прокручування» черги (`await new Promise((r) => setImmediate(r))`, якщо `setImmediate` не підмінено).

> [!viz] event-loop
> scenario: promise-vs-timeout

> [!quiz] Перевір себе: fake timers
> level: middle · type: output · id: jsd-33-quiz-05
>
> ```js
> vi.useFakeTimers();
> const fn = vi.fn();
> setTimeout(fn, 1000);
> setTimeout(fn, 3000);
> vi.advanceTimersByTime(999);
> console.log(fn.mock.calls.length);
> vi.advanceTimersByTime(1);
> console.log(fn.mock.calls.length);
> vi.runAllTimers();
> console.log(fn.mock.calls.length);
> ```
>
> **Відповідь:** `0 1 2`
>
> **Пояснення:** за 999 мс жоден таймер не настав; ще 1 мс — спрацював перший. `runAllTimers` виконує всі заплановані таймери незалежно від часу (обережно з `setInterval` — раннер обмежує кількість ітерацій, щоб не зациклитися).

> [!quiz] Заповни пропуски: друга спроба рівно через 100 мс
> level: middle · type: fill · id: jsd-33-quiz-11 · bank: runAllTimers, mock, toBe
>
> ```js fill
> const flush = async () => { for (let i = 0; i < 10; i++) await Promise.resolve() }
>
> test('друга спроба рівно через 100 мс', async () => {
>   vi.[[useFakeTimers]]()
>   const fn = vi.[[fn]](async () => { throw new Error('flaky') })
>   retry(fn, { delay: 100 }).catch(() => {})
>   await flush()
>   vi.[[advanceTimersByTime]](99)
>   await flush()
>   expect(fn).toHaveBeenCalledTimes(1)
>   vi.advanceTimersByTime(1)
>   await flush()
>   expect(fn).[[toHaveBeenCalledTimes]](2)
> })
> ```
>
> **Пояснення:** fake timers роблять тест миттєвим і детермінованим. Після перемотки продовження `retry` — мікрозадачі, тому між кроками `flush()` прокручує чергу. Перевірка на 99 мс доводить, що спроба не відбулася **раніше**.

### Тестування DOM

Два середовища: **імітація DOM у Node** (jsdom, happy-dom) — швидко, але без layout, CSS і справжніх подій браузера; **реальний браузер** (Vitest browser mode, Playwright component testing) — повільніше, зате чесно.

Філософія **Testing Library**: «чим більше тести схожі на те, як користуються застосунком, тим більше впевненості вони дають». Шукай елементи так, як шукає користувач (і скрінрідер): за роллю, підписом, текстом — а не за класами чи `data-testid` (останній — запасний варіант).

```jsx
// Vitest + jsdom + @testing-library/react
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('показує помилку для порожнього email', async () => {
  const user = userEvent.setup();
  render(<SignupForm />);
  await user.click(screen.getByRole('button', { name: /зареєструватися/i }));
  expect(screen.getByRole('alert')).toHaveTextContent('Вкажіть email');
});
```

`userEvent` імітує повну послідовність подій (`pointerdown`, `focus`, `keydown`, `input`…), на відміну від `fireEvent`, який диспатчить одну подію. Для асинхронних появ — `await screen.findByText(…)` (чекає й повторює запит).

> [!quiz] Перевір себе: запити Testing Library
> level: middle · type: multi · id: jsd-33-quiz-06
>
> Які запити відповідають принципам Testing Library?
>
> - [x] `screen.getByRole('button', { name: 'Зберегти' })`
> - [x] `screen.getByLabelText('Email')`
> - [ ] `container.querySelector('.btn-primary-v2')`
> - [ ] `wrapper.state().isOpen`
>
> **Пояснення:** роль і підпис — те, що бачить і чує користувач; такі тести ще й ловлять проблеми доступності. CSS-класи й внутрішній стан — деталі реалізації, які змінюються без зміни поведінки.

### Snapshot-тести: за і проти

Snapshot зберігає серіалізований результат у файл і далі порівнює з ним.

| ✅ Добре для | ❌ Погано для |
|---|---|
| невеликих стабільних виходів: повідомлення помилок, CLI-вивід, AST, згенерований SQL | великих деревах компонентів на сотні рядків |
| швидкого «зафіксуй як є» перед рефакторингом легасі | перевірки **наміру** — snapshot не каже, що саме важливо |
| inline-снапшотів (`toMatchInlineSnapshot`) — видно прямо в тесті | частих змін: команда звикає тиснути `-u` не дивлячись |

Головна проблема — **«оновити все»**: коли diff на 300 рядків, його ніхто не читає, і баг потрапляє в еталон. Якщо snapshot використовується — тримай його маленьким і сфокусованим, а ключові властивості перевіряй явними assertion-ами.

> [!quiz] Перевір себе: snapshot
> level: middle · type: multi · id: jsd-33-quiz-07
>
> - [x] Snapshot-тест падає при будь-якій зміні виходу — навіть безпечній
> - [ ] Snapshot доводить, що вихід правильний
> - [x] Inline-снапшот невеликого рядка помилки — розумне використання
> - [ ] Що більший snapshot, то надійніший тест
>
> **Пояснення:** snapshot доводить лише, що вихід **не змінився** з моменту запису — правильним його мав визнати той, хто записував. Великі снапшоти перетворюються на шум, який оновлюють не читаючи.

### Покриття: що воно (не) означає

Coverage вимірює, які рядки, гілки, функції **виконалися** під час тестів (Vitest/Jest — через V8 або Istanbul, Node — `node --test --experimental-test-coverage`). Воно добре показує **непротестоване**, але нічого не каже про якість протестованого:

```js
function discount(price, isVip) {
  if (isVip) return price * 0.9;
  return price;
}
test('discount', () => {
  discount(100, true);
  discount(100, false);  // 100 % рядків і гілок — і жодної перевірки!
});
```

- 📉 **branch coverage** корисніше за line coverage — показує не пройдені `else`;
- 🎯 ціль у відсотках стимулює писати тести «для цифри» — краще вимагати тести для **ризикових** місць;
- 🧬 **mutation testing** (Stryker) чесніший: інструмент вносить дрібні мутації в код (`>` → `>=`, `+` → `-`) і перевіряє, чи впаде хоча б один тест. Мутант, що «вижив», — дірка в перевірках.

> [!quiz] Перевір себе: покриття
> level: senior · type: multi · id: jsd-33-quiz-08
>
> - [x] 100 % покриття можливе без жодного assertion
> - [x] Низьке покриття надійно вказує на непротестований код
> - [ ] Висока line coverage гарантує, що всі гілки `if/else` перевірені
> - [x] Mutation testing перевіряє, чи тести справді ловлять зміни поведінки
>
> **Пояснення:** покриття — асиметрична метрика: низьке — точно погано, високе — ще нічого не доводить. Line coverage може бути 100 % при непройденій гілці в однорядковому `cond ? a : b`, тому дивись на branch coverage і мутаційне тестування.

### TDD і property-based testing

**TDD** — цикл, у якому тест пишеться **до** коду:

1. 🔴 **Red** — напиши маленький тест на наступну поведінку; переконайся, що він падає (і з правильної причини).
2. 🟢 **Green** — напиши мінімум коду, щоб тест пройшов.
3. 🔵 **Refactor** — поліпши код (і тести), тримаючи все зеленим.

TDD особливо добре працює для чистої логіки з чіткою специфікацією (парсери, валідація, розрахунки) і для виправлення багів: спершу тест, що відтворює баг. Для дослідницького UI-коду часто зручніше писати тести одразу після.

> [!figure] code-editor-run
> scenario: tdd
>
> Повний цикл red → green: три тести спершу падають, мінімальний код проходить два, а граничний випадок з порожнім рядком змушує виправити реалізацію.

**Property-based testing** перевіряє не конкретні приклади, а **властивості**, що мають виконуватись для будь-якого входу; бібліотека генерує сотні випадкових входів, а знайшовши контрприклад — **зменшує** (shrinking) його до мінімального:

```js
import fc from 'fast-check';
test('сортування впорядковує і зберігає довжину', () => {
  fc.assert(fc.property(fc.array(fc.integer()), (arr) => {
    const s = mySort(arr);
    return s.length === arr.length && s.every((x, i) => i === 0 || s[i - 1] <= x);
  }));
}); // типові властивості: round-trip, інваріанти, ідемпотентність, звірка з еталоном
```

> [!quiz] Перевір себе: TDD і властивості
> level: middle · type: multi · id: jsd-33-quiz-09
>
> - [x] У TDD спершу переконуються, що новий тест **падає**
> - [ ] На кроці Green пишуть одразу фінальну оптимальну реалізацію
> - [x] `decode(encode(x))` дорівнює `x` — класична властивість для property-based тесту
> - [x] Shrinking зменшує знайдений контрприклад до мінімального, щоб його було легко зрозуміти
>
> **Пояснення:** тест, що не падав до коду, міг нічого не перевіряти. На Green — мінімум коду, а якість — на кроці Refactor. Без shrinking контрприклад був би випадковим масивом на 80 елементів замість `[2, 10]`.

### Інструменти: Vitest, Jest, node:test, Playwright

| Інструмент | Для чого | Особливості |
|---|---|---|
| **Vitest** | unit/integration, особливо у Vite-проєктах | Jest-сумісний API (`describe/it/expect`, `vi.fn`), нативний ESM і TS, browser mode |
| **Jest** | unit/integration, великі легасі-проєкти | величезна екосистема; ESM історично з налаштуваннями |
| **node:test** | бібліотеки, бекенд, скрипти | вбудований у Node, без залежностей: `node --test`, `mock.fn`, `mock.timers`, coverage |
| **Playwright** | e2e і component tests у Chromium, Firefox, WebKit | авто-очікування, trace viewer, паралельність, мережеві перехоплювачі |

```js
import { test, expect } from '@playwright/test'; // e2e
test('користувач бачить кошик після додавання товару', async ({ page }) => {
  await page.goto('/catalog');
  await page.getByRole('button', { name: 'Додати в кошик' }).first().click();
  await expect(page.getByRole('link', { name: 'Кошик (1)' })).toBeVisible();
});
```

## ⚠️ Пастки

> [!pitfall] Тест, що ніколи не падає
> Забутий `await`/`return`, assertion у callback-у, який не викликався, `try/catch`, що ковтає помилку. Перевір новий тест «ламанням»: зміни код так, щоб він був неправильним, — тест має почервоніти.
>
> ```js
> test('кидає помилку', async () => {
>   try { await parse('bad'); } catch (e) { expect(e.message).toMatch(/syntax/); } // ❌ якщо не кинув — зелений
> });
> test('кидає помилку', async () => {
>   await expect(parse('bad')).rejects.toThrow(/syntax/);                       // ✅
> });
> ```

> [!pitfall] Спільний змінний стан між тестами
> Модульна змінна, яку змінює один тест, глобальний singleton, не скинуті моки й таймери — тести починають залежати від порядку запуску й «мигають» у CI. Створюй усе в Arrange кожного тесту, `vi.restoreAllMocks()` і `vi.useRealTimers()` — в `afterEach`.

> [!pitfall] Мокаєш усе — тестуєш моки
> Коли кожна залежність підмінена, тест перевіряє лише, що функція викликає те, що ти очікуєш, а не що система працює. Рефакторинг ламає десятки тестів, а реальні баги інтеграції проходять. Мокай межі (мережа, час, випадковість), а всередині використовуй справжній код або fake-и.

## 🎤 На співбесіді

> [!interview] Яка різниця між unit, integration і e2e-тестами і як розподіляти зусилля?
> level: middle · frequency: дуже часто · id: jsd-33-int-01
>
> ---
>
> Unit тестує одиницю ізольовано — швидко, точно локалізує помилку, але не ловить проблеми стику. Integration перевіряє кілька частин разом (компонент зі станом і підміненою мережею) — найкраще співвідношення впевненості до вартості у фронтенді. E2E проганяє сценарій користувача в реальному браузері з бекендом — найчесніше, але повільно й крихко. Піраміда радить багато unit і мало e2e; трофей Кента Доддса — статичний аналіз в основі, найбільше integration, трохи unit для складної логіки і кілька e2e на критичні шляхи. Я обираю за ризиком: розгалужена логіка — unit, взаємодії UI — integration, гроші й логін — e2e.
>
> 📚 [[JavaScript - 33. Тестування JavaScript#Піраміда чи трофей: який портфель тестів|Розділ: піраміда і трофей]] · [Kent C. Dodds: The Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)

> [!interview] Чим mock відрізняється від stub і spy? Коли мокати?
> level: middle · frequency: часто · id: jsd-33-int-02
>
> ---
>
> Stub повертає заготовлені відповіді й нічого не перевіряє — потрібен, щоб довести код до потрібного стану. Spy записує виклики (часто поверх справжньої функції), щоб потім перевірити, як її викликали. Mock — двійник з очікуваннями щодо взаємодії: тест перевіряє, що виклик стався з потрібними аргументами. Fake — робоча спрощена реалізація (in-memory база). Мокаю межі системи: мережу, час, випадковість, сторонні сервіси; власні модулі — якомога рідше, бо тоді тест прив'язаний до реалізації. Dependency injection робить підміну простою без моків модульної системи.
>
> 📚 [[JavaScript - 33. Тестування JavaScript#Test doubles: dummy, stub, spy, mock, fake|Розділ: test doubles]] · [Martin Fowler: Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html)

> [!interview] Як протестувати код з `setTimeout` і промісами?
> level: senior · frequency: часто · id: jsd-33-int-03
>
> ---
>
> Fake timers: `vi.useFakeTimers()` (або `mock.timers` у `node:test`) підмінюють таймери й `Date`, і тест перемотує час `advanceTimersByTime`, тож debounce на 5 секунд перевіряється миттєво й детерміновано. Нюанс — після спрацювання таймера продовження через `await` — це мікрозадачі; для async-коду беру `advanceTimersByTimeAsync`, який прокручує й їх. Тест обов'язково `async` з `await`, а помилки — через `rejects`. Після тесту — `useRealTimers()` і скидання моків. Альтернатива — DI годинника: передати `now`/`sleep` параметром.
>
> 📚 [[JavaScript - 33. Тестування JavaScript#Async-код і таймери|Розділ: async і таймери]] · [Vitest: Mocking timers](https://vitest.dev/guide/mocking/timers)

## 🔗 Зв'язки

- [[JavaScript - 32. Патерни проєктування]] — dependency injection робить код тестованим без моків модулів.
- [[JavaScript - 08. Event Loop]] — чому після «перемотки» таймерів треба ще виконати мікрозадачі.
- [[JavaScript - 10. async і await]] — тест має дочекатися проміса, інакше перевірка спрацює «в порожнечу».
- [[JavaScript - 14. Debounce, throttle та async-патерни]] — debounce, retry і пули — ідеальні кандидати на fake timers.
- [[JavaScript - 25. DOM і події]] — події, які імітує `userEvent`, і чому jsdom ≠ браузер.

## ⚡ Фішки

> [!reel] 🟢 Зелений тест без await — брехун
> `test(() => { load().then(check) })` завершується раніше за перевірку. Завжди `await` або `return` проміс — інакше тест зелений навіть для зламаного коду.

> [!reel] ⏩ 5 секунд debounce за 1 мілісекунду
> Fake timers підмінюють `setTimeout`, і тест сам перемотує час.
>
> ```js
> vi.useFakeTimers();
> debounced('a');
> vi.advanceTimersByTime(5000);
> ```

> [!reel] 💯 100 % покриття, 0 перевірок
> Coverage рахує виконані рядки, а не перевірені. Функцію можна викликати в тесті без жодного `expect` — і отримати зелену сотню.

> [!reel] 🎲 Тест, що сам вигадує приклади
> Property-based тести генерують сотні входів і зменшують знайдений баг до мінімального прикладу. `[...arr].sort()` «ламається» на `[2, 10]` — рядкове порівняння.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке AAA у тестах?
> *часто · теорія* · `jsd-33-001`
>
> Arrange — підготувати дані й залежності; Act — виконати одну дію; Assert — перевірити результат. Структура робить тест читабельним і змушує тестувати одну поведінку.
>
> 📚 [[JavaScript - 33. Тестування JavaScript#Анатомія доброго тесту: AAA|Розділ: AAA]] · [Martin Fowler: The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)

> [!question]- Як правильно тестувати асинхронну функцію?
> *дуже часто · практика* · `jsd-33-002`
>
> Зробити тест `async` і `await` результат (або `return` проміс). Для помилок — `await expect(p).rejects.toThrow()` / `assert.rejects`. Без `await` тест завершується раніше за перевірку і проходить навіть для зламаного коду.
>
> 📚 [[JavaScript - 33. Тестування JavaScript#Async-код і таймери|Розділ: async-код]] · [Node.js: Test runner](https://nodejs.org/api/test.html)

### 🟡 Middle

> [!question]- Що таке fake timers і яка в них головна пастка?
> *часто · практика* · `jsd-33-003`
>
> Підміна `setTimeout`/`setInterval`/`Date`, яку тест перемотує вручну — швидко й детерміновано. Пастка: після спрацювання таймера продовження через `await` — мікрозадачі, їх треба прокрутити (`advanceTimersByTimeAsync` у Vitest), інакше тест бачить «старий» стан. І не забути `useRealTimers()` після тесту.
>
> 📚 [[JavaScript - 33. Тестування JavaScript#Async-код і таймери|Розділ: fake timers]] · [Vitest: Mocking timers](https://vitest.dev/guide/mocking/timers)

> [!question]- Чим stub відрізняється від fake?
> *іноді · порівняння* · `jsd-33-004`
>
> Stub повертає заготовлені відповіді без логіки (`getUser → { id: 1 }`). Fake — робоча спрощена реалізація з поведінкою (in-memory репозиторій, що справді зберігає й шукає). Fake-и дають реалістичніші інтеграційні тести.
>
> 📚 [[JavaScript - 33. Тестування JavaScript#Test doubles: dummy, stub, spy, mock, fake|Розділ: test doubles]] · [Martin Fowler: TestDouble](https://martinfowler.com/bliki/TestDouble.html)

> [!question]- Чому Testing Library радить шукати елементи за роллю, а не за класом?
> *часто · теорія* · `jsd-33-005`
>
> Користувач і допоміжні технології бачать роль, підпис і текст, а не CSS-класи. Такі запити не ламаються від рефакторингу верстки й одночасно перевіряють доступність. `data-testid` — запасний варіант, коли семантичного запиту немає.
>
> 📚 [[JavaScript - 33. Тестування JavaScript#Тестування DOM|Розділ: тестування DOM]] · [Testing Library: Guiding Principles](https://testing-library.com/docs/guiding-principles)

### 🔴 Senior

> [!question]- Чому 100 % покриття не гарантує якості і що чесніше?
> *часто · теорія* · `jsd-33-006`
>
> Покриття фіксує виконання, а не перевірку: код можна викликати без assertion. Line coverage пропускає гілки в однорядкових виразах. Чесніше — branch coverage для пошуку дірок і mutation testing (Stryker): якщо мутація коду не валить жодного тесту, перевірки слабкі.
>
> 📚 [[JavaScript - 33. Тестування JavaScript#Покриття: що воно (не) означає|Розділ: покриття]] · [Martin Fowler: The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)

> [!question]- Коли snapshot-тести шкодять?
> *іноді · теорія* · `jsd-33-007`
>
> Коли вони великі (сотні рядків розмітки) і часто змінюються: diff ніхто не читає, оновлюють `-u` не дивлячись, і баг потрапляє в еталон. Snapshot не виражає намір — не видно, що саме важливо. Корисні маленькі inline-снапшоти стабільних виходів.
>
> 📚 [[JavaScript - 33. Тестування JavaScript#Snapshot-тести: за і проти|Розділ: snapshot]] · [Vitest: Snapshot](https://vitest.dev/guide/snapshot)

> [!question]- Що таке property-based testing і які властивості перевіряти?
> *рідко · теорія* · `jsd-33-008`
>
> Замість конкретних прикладів формулюється властивість для будь-якого входу; бібліотека (fast-check) генерує входи й зменшує контрприклад (shrinking). Типові властивості: round-trip (`decode(encode(x)) === x`), інваріанти (довжина, впорядкованість), ідемпотентність, порівняння з простою еталонною реалізацією.
>
> 📚 [[JavaScript - 33. Тестування JavaScript#TDD і property-based testing|Розділ: property-based]] · [fast-check](https://fast-check.dev/)

## 🛠️ Практика

> [!task] Поясни своїми словами: двійники
> level: middle · difficulty: easy · id: jsd-33-task-01 · tags: feynman, mocks
>
> Поясни (до 6 речень), чим відрізняються stub, spy, mock і fake, на прикладі тестування «реєстрації користувача, яка пише в базу і надсилає лист». Скажи, що з цього ти мокав би, а що — ні, і чому.
>
> > [!hint]- Підказка 1
> > Що з цих залежностей — межа системи (зовнішній світ), а що — твій власний код?
>
> > [!hint]- Підказка 2
> > Аналогія: каскадер, манекен, прихована камера, репетиційний майданчик.
>
> > [!solution]- Еталонне пояснення
> > Уяви зйомки фільму. Stub — манекен, який стоїть у кадрі й завжди «відповідає» однаково: база, що на будь-який `insert` повертає `{ id: 1 }`. Spy — прихована камера: справжній або фейковий `mailer.send`, який записує, з якими аргументами його викликали. Mock — актор з чітким сценарієм: тест наперед очікує, що лист буде надіслано рівно раз на певну адресу. Fake — репетиційний майданчик: in-memory база на `Map`, яка справді зберігає й знаходить користувачів. Я підміняв би пошту (зовнішній сервіс — spy/mock) і базу (fake для швидкості або тестова база в інтеграційних тестах), але не власну логіку валідації — інакше тест перевірятиме мої моки, а не код.

> [!task] Протестуй retry з fake timers
> level: middle · difficulty: medium · id: jsd-33-task-02 · tags: testing, fake-timers, node-test
>
> Є функція з [[JavaScript - 14. Debounce, throttle та async-патерни]] (спрощена):
>
> ```js
> const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
> export async function retry(fn, { retries = 3, delay = 100 } = {}) {
>   for (let attempt = 0; ; attempt++) {
>     try { return await fn(attempt); }
>     catch (err) {
>       if (attempt >= retries) throw err;
>       await sleep(delay * 2 ** attempt);
>     }
>   }
> }
> ```
>
> Напиши на `node:test` два тести, які працюють миттєво (без реального очікування): (1) після двох невдач `retry` повертає `'ok'`, друга спроба відбувається рівно через 100 мс, а не раніше; (2) коли спроби вичерпано, проміс відхиляється останньою помилкою, а `fn` викликано `retries + 1` разів.
>
> ```js starter
> import { test } from 'node:test';
> import assert from 'node:assert/strict';
> import { retry } from './retry.js';
>
> test('повертає результат після двох невдач', async (t) => {
>   // твій код
> });
>
> test('кидає останню помилку, коли спроби вичерпано', async (t) => {
>   // твій код
> });
> ```
>
> > [!hint]- Підказка 1
> > `t.mock.timers.enable({ apis: ['setTimeout'] })` і `t.mock.timers.tick(ms)`. Після `tick` продовження `retry` — мікрозадачі. Потрібен хелпер, що «прокручує» чергу: `setImmediate` не підмінено.
>
> > [!hint]- Підказка 2
> > Для другого тесту створи `assert.rejects(...)` **до** перемотування — щоб відхилення не стало «необробленим».
>
> > [!solution]- Еталонне рішення
> > ```js
> > import { test } from 'node:test';
> > import assert from 'node:assert/strict';
> > import { retry } from './retry.js';
> >
> > const flush = () => new Promise((resolve) => setImmediate(resolve)); // setImmediate не підмінено
> >
> > test('повертає результат після двох невдач', async (t) => {
> >   t.mock.timers.enable({ apis: ['setTimeout'] });
> >   const fn = t.mock.fn(async (attempt) => {
> >     if (attempt < 2) throw new Error('flaky');
> >     return 'ok';
> >   });
> >
> >   const promise = retry(fn, { delay: 100 });
> >   await flush();
> >   assert.equal(fn.mock.callCount(), 1);
> >   t.mock.timers.tick(99);
> >   await flush();
> >   assert.equal(fn.mock.callCount(), 1);   // ще рано
> >   t.mock.timers.tick(1);
> >   await flush();
> >   assert.equal(fn.mock.callCount(), 2);   // рівно через 100 мс
> >   t.mock.timers.tick(200);
> >
> >   assert.equal(await promise, 'ok');
> >   assert.equal(fn.mock.callCount(), 3);
> > });
> >
> > test('кидає останню помилку, коли спроби вичерпано', async (t) => {
> >   t.mock.timers.enable({ apis: ['setTimeout'] });
> >   const fn = t.mock.fn(async () => { throw new Error('down'); });
> >   const assertion = assert.rejects(retry(fn, { retries: 2, delay: 100 }), /down/);
> >   await flush(); t.mock.timers.tick(100);
> >   await flush(); t.mock.timers.tick(200);
> >   await assertion;
> >   assert.equal(fn.mock.callCount(), 3);
> > });
> > ```
> >
> > Запуск: `node --test`. У Vitest те саме коротше: `vi.useFakeTimers()` і `await vi.advanceTimersByTimeAsync(100)` — він сам прокручує мікрозадачі між таймерами.

> [!task] Міні-бібліотека property-based тестів зі shrinking
> level: senior · difficulty: hard · id: jsd-33-task-03 · tags: property-based, testing, generators
>
> Напиши `checkProperty(property, { runs = 200, seed = 42 })`: генерує `runs` випадкових масивів цілих чисел (довжина 0–20, значення −50…50) з **детермінованого** seed; якщо `property(arr)` повертає `false` або кидає — зменшує контрприклад (видаляючи елементи й наближаючи числа до нуля), поки властивість продовжує падати, і повертає `{ ok: false, counterexample }`; інакше — `{ ok: true }`.
>
> ```js
> const buggySort = (arr) => [...arr].sort();               // рядкове порівняння!
> console.log(checkProperty((arr) => {
>   const s = buggySort(arr);
>   return s.every((x, i) => i === 0 || s[i - 1] <= x);
> }));
> // → { ok: false, run: 0, seed: 42, counterexample: [ -11, -12 ] }  (конкретні числа залежать від генератора)
> ```
>
> ```js starter
> function createRng(seed) {
>   // твій код: детермінований PRNG, напр. mulberry32
> }
>
> function checkProperty(property, { runs = 200, seed = 42 } = {}) {
>   // твій код
> }
> ```
>
> ```js tests
> const isSorted = (s) => s.every((x, i) => i === 0 || s[i - 1] <= x)
> const buggySort = (arr) => [...arr].sort() // рядкове порівняння
>
> test('властивість, що завжди виконується — ok: true', () => {
>   expect(checkProperty((arr) => Array.isArray(arr)).ok).toBe(true)
> })
>
> test('викликає property рівно runs разів, генерує масиви в межах', () => {
>   const seen = []
>   const r = checkProperty((arr) => { seen.push(arr); return true }, { runs: 50 })
>   expect(r.ok).toBe(true)
>   expect(seen).toHaveLength(50)
>   for (const arr of seen) {
>     expect(arr.length).toBeLessThanOrEqual(20)
>     expect(arr.every((x) => Number.isInteger(x) && x >= -50 && x <= 50)).toBe(true)
>   }
>   expect(new Set(seen.map((a) => a.length)).size).toBeGreaterThan(1)
> })
>
> test('знаходить і зменшує контрприклад для зламаного сортування', () => {
>   const property = (arr) => isSorted(buggySort(arr))
>   const r = checkProperty(property)
>   expect(r.ok).toBe(false)
>   const ce = r.counterexample
>   expect(property(ce)).toBe(false)
>   expect(ce).toHaveLength(2)
>   // мінімальний: жоден крок shrinking уже не падає
>   for (let i = 0; i < ce.length; i++) {
>     expect(property(ce.toSpliced(i, 1))).toBe(true)
>   }
> })
>
> test('виняток у property — теж падіння; числа зменшуються до нуля', () => {
>   const r = checkProperty((arr) => {
>     if (arr.some((x) => x < 0)) throw new Error('negative')
>     return true
>   })
>   expect(r.ok).toBe(false)
>   expect(r.counterexample).toEqual([-1])
> })
>
> test('детермінований: той самий seed — той самий результат', () => {
>   const property = (arr) => arr.length < 15
>   expect(checkProperty(property, { seed: 7 })).toEqual(checkProperty(property, { seed: 7 }))
>   const seenA = []
>   const seenB = []
>   checkProperty((a) => { seenA.push(a); return true }, { runs: 5, seed: 1 })
>   checkProperty((a) => { seenB.push(a); return true }, { runs: 5, seed: 2 })
>   expect(seenA).not.toEqual(seenB)
> })
> ```
>
> > [!hint]- Підказка 1
> > `Math.random()` не можна засіяти — потрібен простий PRNG (наприклад, mulberry32) у замиканні.
>
> > [!hint]- Підказка 2
> > Shrinking — генератор кандидатів: масив без i-го елемента (`toSpliced(i, 1)`) і масив з i-м числом, поділеним навпіл (`with(i, …)`). Бери першого кандидата, що теж падає, і повторюй, доки такі є.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function createRng(seed) {                 // mulberry32
> >   let s = seed >>> 0;
> >   return () => {
> >     s = (s + 0x6d2b79f5) >>> 0;
> >     let t = s;
> >     t = Math.imul(t ^ (t >>> 15), t | 1);
> >     t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
> >     return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32;
> >   };
> > }
> >
> > const intArray = (rand, { maxLength = 20, min = -50, max = 50 } = {}) =>
> >   Array.from({ length: Math.floor(rand() * (maxLength + 1)) },
> >     () => min + Math.floor(rand() * (max - min + 1)));
> >
> > function* shrinkArray(arr) {
> >   for (let i = 0; i < arr.length; i++) yield arr.toSpliced(i, 1);
> >   for (let i = 0; i < arr.length; i++) {
> >     if (arr[i] !== 0) yield arr.with(i, Math.trunc(arr[i] / 2) || 0); // || 0 прибирає -0
> >   }
> > }
> >
> > function checkProperty(property, { runs = 200, seed = 42 } = {}) {
> >   const rand = createRng(seed);
> >   const holds = (input) => { try { return property(input) !== false; } catch { return false; } };
> >   for (let run = 0; run < runs; run++) {
> >     let counterexample = intArray(rand);
> >     if (holds(counterexample)) continue;
> >     let improved = true;
> >     while (improved) {
> >       improved = false;
> >       for (const candidate of shrinkArray(counterexample)) {
> >         if (!holds(candidate)) { counterexample = candidate; improved = true; break; }
> >       }
> >     }
> >     return { ok: false, run, seed, counterexample };
> >   }
> >   return { ok: true, runs };
> > }
> > ```
> >
> > Чому seed важливий: впавши в CI, тест має відтворюватися локально тим самим seed. Справжні бібліотеки (fast-check) роблять те саме, але з композиційними генераторами (`fc.record`, `fc.string`…) і розумнішим shrinking.

## 📚 Джерела та що почитати

- 🟢 [Vitest — Getting Started](https://vitest.dev/guide/) — сучасний раннер з Jest-сумісним API.
- 🟢 [Testing Library — Guiding Principles](https://testing-library.com/docs/guiding-principles) — чому тестувати «як користувач».
- 🟡 [Martin Fowler — The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) — рівні тестів з прикладами і компромісами.
- 🟡 [Kent C. Dodds — The Testing Trophy and Testing Classifications](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications) — альтернатива піраміді для фронтенду.
- 🟡 [Martin Fowler — Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html) — класичний текст про двійники та стилі тестування.
- 🟡 [Node.js — Test runner](https://nodejs.org/api/test.html) — `node:test`, `mock.fn`, `mock.timers`, coverage.
- 🛠️ [Playwright — Getting started](https://playwright.dev/docs/intro) — e2e у трьох рушіях з авто-очікуванням.
- 🛠️ [fast-check](https://fast-check.dev/) — property-based testing для JS/TS.

> [!important] Підсумок
> - Портфель тестів — за ризиком: unit для розгалуженої логіки, integration для взаємодії частин (найкращий ROI у фронтенді), кілька e2e для критичних шляхів.
> - AAA, одна поведінка на тест, перевірка поведінки замість реалізації, детермінованість і незалежність.
> - Stub відповідає, spy записує, mock очікує, fake працює; мокай межі системи, а DI робить підміну тривіальною.
> - Async — завжди `await`/`rejects`; таймери — fake timers з прокручуванням мікрозадач; DOM — запити за роллю й підписом.
> - Snapshot і coverage — допоміжні сигнали, не доказ якості; TDD (red → green → refactor) і property-based тести знаходять те, що приклади пропускають.
