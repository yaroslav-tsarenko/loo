---
title: Сучасний JS і TC39
order: 34
level: middle
tags: [tc39, ecmascript, proposals, es2025, es2026, temporal, compatibility, polyfills]
prerequisites:
  - "[[JavaScript - 11. Ітератори та генератори]]"
  - "[[JavaScript - 12. Масиви та функціональний стиль]]"
  - "[[JavaScript - 21. Модулі — ESM, CommonJS і бандлери]]"
estimatedMinutes: 50
id: jsd-ch-34
icon: "🚀"
---

# JavaScript - 34. Сучасний JS і TC39

> [!success] 🎯 Після цього розділу ти зможеш
> - Пояснити, хто і як змінює JavaScript: TC39, ECMA-262, щорічні релізи ESyyyy і стадії 0 → 4 (включно з 2.7).
> - Назвати ключові можливості кожного релізу ES2015 → ES2026 з прикладом і модернізувати старий код.
> - Відрізнити те, що вже в стандарті (Temporal, `using`, Iterator helpers), від пропозицій, які ще можуть змінитися (decorators, pipeline, signals, pattern matching).
> - Перевірити підтримку через MDN, caniuse, Baseline і node.green та вирішити: транспілювати, поліфілити чи чекати.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: middle · type: output · id: jsd-34-quiz-01
>
> ```js
> // ES2025
> console.log(RegExp.escape('1.5+2'));
> ```
>
> **Відповідь:** `\x31\.5\+2`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Крапка й плюс екрануються очікувано, а от **перша цифра** перетворюється на `\x31`: якщо результат підставлять одразу після `\1` чи `\0` у шаблоні, звичайна цифра змінила б значення зворотного посилання. Такі «дрібниці» TC39 обговорює роками, перш ніж метод потрапить у стандарт.

## 🧒 Простими словами

JavaScript — як **мова, якою говорять мільярди людей**: її не можна «перевидати з нуля», бо зламаються всі вже написані тексти (сайти). Тому нові слова додає **комітет редакторів словника** (TC39), і кожне слово проходить шлях: хтось пропонує ідею (стадія 0–1) → комітет обирає форму (2) → форма затверджена й перевіряється тестами (2.7) → її вже вживають у кількох містах (3, реалізації в браузерах) → слово офіційно в новому виданні словника (4, щорічний реліз). А ти як автор маєш перевірити, чи **твої читачі** (браузери користувачів) уже знають це слово — інакше доведеться пояснити його простішими (поліфіл, транспіляція).

## 🔬 Як це працює насправді

### Хто і як змінює JavaScript

- **ECMAScript** (стандарт ECMA-262) — специфікація мови; JavaScript — її реалізації (V8, SpiderMonkey, JavaScriptCore). Інтернаціоналізація (`Intl`) — окремий стандарт ECMA-402.
- **TC39** — технічний комітет Ecma International: представники рушіїв і компаній, запрошені експерти. Рішення — **консенсусом**, кілька зустрічей на рік, протоколи публічні.
- Специфікація — «жива» на GitHub (`tc39/ecma262`), а **щороку** знімок затверджує Генеральна асамблея Ecma (зазвичай у червні): ES2024, ES2025, ES2026… Потрапляє те, що досягло стадії 4 до «заморозки» видання.
- **ES2015 (ES6)** — останній «великий» реліз; відтоді — щорічні невеликі.
- `fetch`, DOM, `setTimeout`, Web Workers — **не** TC39: це веб-платформа (WHATWG, W3C). Node API — проєкт Node.js.

> [!quiz] Перевір себе: хто відповідає?
> level: junior · type: multi · id: jsd-34-quiz-02
>
> Що з цього визначає саме TC39 (ECMA-262)?
>
> - [x] Синтаксис `async`/`await`
> - [ ] API `fetch`
> - [x] Методи `Set.prototype.union` та інші нові методи `Set`
> - [ ] `document.querySelector`
> - [x] Об'єкт `Temporal`
>
> **Пояснення:** мова й вбудовані об'єкти (`Promise`, `Set`, `Iterator`, `Temporal`) — TC39. Мережа, DOM і таймери — стандарти веб-платформи (WHATWG/W3C), тому вони є в браузері, але не обов'язково в кожному JS-рушії.

### Стадії пропозицій: 0 → 4

| Стадія | Статус | Вхідні вимоги | Що робимо |
|---|---|---|---|
| **0** | ідея, комітет її ще не розглядає | жодних | досліджуємо проблему |
| **1** | проблему взято до розгляду | чемпіон, опис проблеми, публічний репозиторій | шукаємо рішення |
| **2** | обрано бажане рішення, але дизайн — чернетка | початковий текст специфікації, приклади | уточнюємо деталі, експериментальні поліфіли |
| **2.7** | схвалено в принципі, йде валідація | повний текст специфікації, підписи рецензентів і редакторів | пишемо тести Test262, прототипи |
| **3** | рекомендовано до реалізації | достатні тести й досвід | рушії впроваджують, шукають веб-несумісності |
| **4** | готово до включення в стандарт | дві сумісні реалізації, що проходять Test262; досвід у полі; PR у `ecma262` схвалено | потрапляє в найближче видання ESyyyy |

> [!viz] tc39-stages
> scenario: pipeline

```text
 0 ──► 1 ──► 2 ──► 2.7 ──► 3 ──► 4 ──► ESyyyy (червень)
 ідея  проблема  рішення  тести  браузери  стандарт
       ▲                          ▲
       └─ можуть «застрягнути» роками (decorators, pipeline)
                                  └─ з цієї точки — безпечно чекати й поліфілити
```

Практичний висновок: **до стадії 3 синтаксис може змінитися кардинально**. Історія decorators: TypeScript і Babel роками підтримували «legacy»-варіант, а пропозиція, що просунулась далі, має **інший** API — величезні кодові бази мігрували. `Temporal` пройшов шлях від стадії 1 (2017) до стадії 4 (2026) — майже десятиліття.

> [!quiz] Перевір себе: стадії
> level: middle · type: multi · id: jsd-34-quiz-03
>
> - [x] Для стадії 4 потрібні дві сумісні реалізації, що проходять Test262
> - [ ] Пропозиція стадії 2 гарантовано увійде в стандарт без змін
> - [x] На стадії 2.7 повний текст специфікації вже схвалено, йде написання тестів
> - [ ] Стадія 3 означає, що фіча вже є в усіх браузерах
>
> **Пояснення:** стадія 2 — «бажане рішення, але чернетка», вона може змінитися чи бути відкликана. Стадія 3 — сигнал рушіям реалізовувати; підтримка в браузерах з'являється поступово й нерівномірно.

### Тур ES2015 → ES2020

| Реліз | Ключове | Приклад |
|---|---|---|
| **ES2015** | `let/const`, стрілки, класи, модулі, проміси, деструктуризація, шаблонні рядки, `Map/Set`, `Symbol`, ітератори й генератори, `Proxy/Reflect` | ``const { id, ...rest } = obj; `id=${id}` `` |
| **ES2016** | `**`, `Array.prototype.includes` | `2 ** 10; [NaN].includes(NaN) // → true` |
| **ES2017** | `async/await`, `Object.values/entries`, `padStart/padEnd`, `SharedArrayBuffer` + `Atomics` | `'7'.padStart(3, '0') // → '007'` |
| **ES2018** | rest/spread для об'єктів, асинхронна ітерація, `Promise.prototype.finally`, іменовані групи й lookbehind у RegExp, прапорець `s` | `for await (const chunk of stream) {}` |
| **ES2019** | `flat/flatMap`, `Object.fromEntries`, `trimStart/trimEnd`, необов'язкова змінна в `catch` | `[1, [2, [3]]].flat(Infinity) // → [1, 2, 3]` |
| **ES2020** | `?.`, `??`, `BigInt`, `Promise.allSettled`, `globalThis`, динамічний `import()`, `matchAll` | `user?.profile?.name ?? 'Анонім'` |

```js
const cfg = { retries: 0 };
console.log(cfg.retries || 3);   // → 3 — 0 вважається «відсутнім» 😬
console.log(cfg.retries ?? 3);   // → 0 — ?? реагує лише на null/undefined
console.log(2n ** 64n);          // → 18446744073709551616n
```

> [!quiz] Перевір себе: ES2015–ES2020
> level: junior · type: output · id: jsd-34-quiz-04
>
> ```js
> const settings = { volume: 0, theme: '' };
> console.log(settings.volume ?? 50, settings.theme || 'dark', settings.lang?.code);
> ```
>
> **Відповідь:** `0 dark undefined`
>
> **Пояснення:** `??` замінює лише `null`/`undefined`, тож `0` лишається. `||` замінює будь-яке falsy-значення, і порожній рядок стає `'dark'`. `?.` повертає `undefined` замість помилки, коли `lang` відсутній.

> [!quiz] Заповни пропуски: значення за замовчуванням без сюрпризів
> level: junior · type: fill · id: jsd-34-quiz-09 · bank: ||, ., &&
>
> ```js fill
> const settings = { volume: 0, theme: '' }
> const volume = settings.volume [[??]] 50          // → 0
> const lang = settings.profile[[?.]]lang [[??]] 'uk'  // → 'uk'
> settings.theme [[\|\|=]] 'dark'                    // порожній рядок → 'dark'
> ```
>
> **Пояснення:** `??` замінює лише `null`/`undefined`, тож збережена гучність `0` не губиться. `?.` повертає `undefined` замість `TypeError`, коли `profile` немає. `||=` (ES2021) присвоює, якщо значення falsy — саме те, що треба для порожнього рядка.

### Тур ES2021 → ES2025

| Реліз | Ключове |
|---|---|
| **ES2021** | `replaceAll`, `Promise.any`, `\|\|=` `&&=` `??=`, роздільники `1_000_000`, `WeakRef` і `FinalizationRegistry` |
| **ES2022** | поля класів і `#private`, статичні блоки, top-level `await`, `.at()`, `Object.hasOwn`, `error.cause`, прапорець `/d`, `#x in obj` |
| **ES2023** | `toSorted`/`toReversed`/`toSpliced`/`with` (без мутацій), `findLast`/`findLastIndex`, hashbang `#!`, символи як ключі `WeakMap` |
| **ES2024** | `Object.groupBy`/`Map.groupBy`, `Promise.withResolvers`, прапорець RegExp `/v`, resizable і transferable `ArrayBuffer`, `Atomics.waitAsync`, `isWellFormed` |
| **ES2025** | Iterator helpers (`Iterator.from`, `.map/.filter/.take/.drop/.toArray`…), методи `Set` (`union`, `intersection`, `difference`…), import attributes і JSON-модулі, `RegExp.escape`, модифікатори RegExp, дубльовані іменовані групи, `Promise.try`, `Float16Array` |

```js
// ES2023: копії замість мутацій
const scores = [30, 10, 20];
console.log(scores.toSorted((a, b) => a - b), scores); // → [10, 20, 30] [30, 10, 20]

// ES2024: групування і «розгорнутий» проміс
console.log(Object.groupBy([1, 2, 3, 4], (n) => (n % 2 ? 'odd' : 'even')));
// → [Object: null prototype] { odd: [1, 3], even: [2, 4] }
const { promise, resolve } = Promise.withResolvers();

// ES2025: множини й імпорт JSON
console.log(new Set([1, 2, 3]).intersection(new Set([2, 3, 9]))); // → Set(2) { 2, 3 }
import config from './config.json' with { type: 'json' };
```

**Iterator helpers** — ліниві аналоги методів масивів для **будь-якого** ітератора ([[JavaScript - 11. Ітератори та генератори]]): обчислюють лише стільки, скільки потрібно, і працюють навіть з нескінченними генераторами.

> [!viz] generators
> scenario: yield-pingpong

> [!quiz] Перевір себе: ліниві ітератори
> level: middle · type: output · id: jsd-34-quiz-05
>
> ```js
> function* naturals() {
>   let n = 1;
>   while (true) { console.log('gen', n); yield n++; }
> }
> const r = naturals().filter((n) => n % 2 === 0).map((n) => n * 10).take(2).toArray();
> console.log(r);
> ```
>
> **Відповідь:** `gen 1` `gen 2` `gen 3` `gen 4` `[ 20, 40 ]`
>
> **Пояснення:** helpers тягнуть значення по одному: `take(2)` після другого результату закриває ланцюжок, і генератор більше не викликається. З масивами (`[...naturals()]`) це був би нескінченний цикл.

> [!quiz] Склади лінивий ланцюжок Iterator helpers
> level: middle · type: order · id: jsd-34-quiz-10
>
> Потрібно отримати `[4, 7, 10]` з нескінченного генератора `naturals()` (1, 2, 3, …): кратні 3, збільшені на 1, перші три.
>
> ```js order
> const result = naturals()
>   .filter((n) => n % 3 === 0)
>   .map((n) => n + 1)
>   .take(3)
>   .toArray()
>   .slice(0, 3) // ✗
> ```
>
> **Пояснення:** helpers ліниві: `take(3)` закриває генератор після третього значення, а `toArray()` збирає результат. Якщо поміняти `filter` і `map` місцями, перевірка кратності діятиме вже на `n + 1`. `slice` — метод масиву: на нескінченному генераторі до нього просто не дійде.

### ES2026 і те, що вже на стадії 4

**ES2026** (затверджено в червні 2026):

- `Array.fromAsync` — масив з асинхронного ітерованого;
- `Error.isError` — надійна перевірка «це справжня помилка», навіть з іншого realm;
- `Math.sumPrecise` — сума без накопичення похибки (`[0.1, 0.2, 0.3]` → рівно `0.6`);
- `Uint8Array.fromBase64` / `.toBase64()` / hex — base64 без `atob` і рядкових хаків;
- `Iterator.concat` — послідовне з'єднання ітераторів;
- доступ до вихідного тексту в `JSON.parse` (`context.source`) і `JSON.rawJSON` — точні великі числа;
- `Map.prototype.getOrInsert` / `getOrInsertComputed` (пропозиція «Upsert»).

```js
// Node 25 / сучасні браузери
console.log(Error.isError(new TypeError('x')), Error.isError({ message: 'x' })); // → true false
console.log(new Uint8Array([104, 105]).toBase64());                            // → aGk=
console.log(JSON.parse('{"id": 12345678901234567890}', (k, v, ctx) =>
  k === 'id' ? BigInt(ctx.source) : v));                                       // → { id: 12345678901234567890n }

// Chrome 145+, Firefox 144+, Safari 26.2+ (у Node 25 ще немає)
const groups = new Map();
groups.getOrInsertComputed('admins', () => []).push('Ann');
```

**Уже стадія 4, увійде в ES2027:**

- 🕰️ **Temporal** — нарешті нормальні дати й час: незмінні типи `Temporal.PlainDate`, `ZonedDateTime`, `Duration`, часові пояси й календарі ([[JavaScript - 24. Дати, час та Intl]]). Підтримка: Chrome 144+, Firefox 139+, у Safari — поки в preview.
- 🧹 **Explicit Resource Management** — `using` / `await using`, `Symbol.dispose`, `DisposableStack`: детерміноване звільнення ресурсів наприкінці блоку.
- 🔗 Ітератори: `Iterator.zip` (спільна ітерація), `.chunks(n)` / `.windows(n)`, `.includes`, `.join`; а також `Atomics.pause` для спін-циклів.

```js
// using — Node 25, Chrome 134+, Firefox 141+
{
  using file = { [Symbol.dispose]() { console.log('closed'); } };
  console.log('working');
} // → working, closed — навіть якщо всередині кинуто помилку
```

> [!quiz] Перевір себе: що вже в стандарті?
> level: middle · type: multi · id: jsd-34-quiz-06
>
> Станом на жовтень 2026 — що вже досягло **стадії 4**?
>
> - [x] `Temporal`
> - [x] `using` і `Symbol.dispose` (Explicit Resource Management)
> - [ ] Pipeline-оператор `|>`
> - [x] `Map.prototype.getOrInsertComputed`
> - [ ] Pattern matching (`match`)
>
> **Пояснення:** Temporal і Explicit Resource Management отримали стадію 4 у 2026 і увійдуть в ES2027; Upsert — уже в ES2026. Pipeline — стадія 2, pattern matching — стадія 1: їхній синтаксис ще може змінитися.

### Пропозиції, за якими варто стежити

Стан на **жовтень 2026** (перевіряй актуальний у [tc39/proposals](https://github.com/tc39/proposals)):

| Пропозиція | Стадія | Що дає |
|---|---|---|
| Deferring Module Evaluation (`import defer`) | 3 | лінива ініціалізація модулів — швидший старт |
| Source Phase Imports, Import Text | 3 | імпорт WebAssembly-модулів і тексту як ресурсу |
| Decorators, Decorator Metadata | 2.7 | `@logged` для класів і їхніх членів (стандартний, не legacy-варіант) |
| ShadowRealm | 2.7 | ізольоване виконання коду з окремими глобальними об'єктами |
| Pipeline operator `\|>` | 2 | `value \|> f(%) \|> g(%)` замість вкладених викликів |
| Async Context | 2 | контекст, що «пливе» крізь `await` (трасування, логування) |
| Structs, Iterator.range, `Math.clamp` | 2 | фіксовані за формою об'єкти, діапазони, обмеження числа |
| Signals | 1 | спільна модель реактивності для фреймворків |
| Pattern Matching | 1 | `match (value) { … }` — деструктуризація з умовами |
| Type Annotations | 1 | синтаксис типів, який рушій ігнорує (TS без компіляції) |

```js
// ⚠️ ескізи — синтаксис пропозицій стадій 1–2 може змінитися
const slug = title |> %.trim() |> %.toLowerCase() |> %.replaceAll(' ', '-');

class Service {
  @logged
  fetchUser(id) { /* … */ }
}
```

> [!quiz] Перевір себе: чи можна в продакшн?
> level: senior · type: multi · id: jsd-34-quiz-07
>
> Яке рішення **розумне** для продакшн-кодової бази в жовтні 2026?
>
> - [x] Використовувати Iterator helpers і методи `Set`, якщо цільові браузери їх підтримують
> - [ ] Переписати весь код на pipeline-оператор через Babel-плагін — він точно буде в стандарті саме таким
> - [x] Почати впроваджувати `Temporal` з поліфілом там, де немає нативної підтримки
> - [x] Використовувати decorators через TypeScript, усвідомлюючи, що пропозиція ще на стадії 2.7
>
> **Пояснення:** стадія 4 — безпечно (з поліфілом для старих рушіїв). Синтаксис стадії 2 — ставка: якщо пропозиція зміниться, код доведеться мігрувати. Decorators уже широко використовуються через TypeScript, але це свідомий ризик.

### Як перевірити підтримку і користуватися новим

| Інструмент | Що показує |
|---|---|
| **MDN** — таблиця «Browser compatibility» внизу кожної сторінки | версії браузерів і Node для кожного методу |
| **Baseline** (на MDN, caniuse, webstatus.dev) | *Newly available* — є в усіх основних браузерах; *Widely available* — уже 30 місяців |
| **caniuse.com** | частки користувачів з підтримкою, нотатки про баги |
| **node.green** | підтримка ES-фіч по версіях Node |
| **Test262 / test262.fyi** | наскільки рушії проходять офіційні тести |

Як використати нове, не зламавши старих користувачів:

- **синтаксис** (`?.`, `class #x`, `using`) не поліфілиться — його **транспілюють** (Babel, TypeScript, esbuild, SWC) до цільових версій із `browserslist`;
- **API** (`Object.groupBy`, `Set.prototype.union`) **поліфілиться**: `core-js` або точкові поліфіли, бажано лише там, де потрібно;
- **feature detection** замість перевірки браузера: `if (typeof Object.groupBy === 'function')`, `'Temporal' in globalThis`.

> [!quiz] Перевір себе: транспіляція чи поліфіл?
> level: middle · type: multi · id: jsd-34-quiz-08
>
> Що можна додати **поліфілом** (без перетворення синтаксису)?
>
> - [x] `Promise.withResolvers`
> - [ ] Оператор `??`
> - [x] `Array.prototype.toSorted`
> - [ ] `using` declarations
> - [x] `Set.prototype.union`
>
> **Пояснення:** поліфіл — це JS-код, що додає відсутні функції до вбудованих об'єктів. Новий синтаксис старий парсер просто не зрозуміє — його треба переписати транспілятором до еквівалентного старого коду.

## ⚠️ Пастки

> [!pitfall] «Stage 3 = можна в продакшн без поліфілів»
> Стадія 3 означає, що рушії **почали** реалізацію. Підтримка може бути лише в одному браузері або за прапорцем. Перевір MDN/Baseline для своєї аудиторії, а не стадію.

> [!pitfall] Babel-плагін для ранньої пропозиції
> Синтаксис стадій 0–2 може змінитися або зникнути (історія decorators, кілька варіантів pipeline). Код, написаний «на виріст», доведеться переписувати — і codemod-и будуть не для всього.

> [!pitfall] Поліфіл, що змінює вбудовані прототипи «по-своєму»
> Самописний `Array.prototype.groupBy` (поза стандартом) у минулому **блокував** стандартизацію: TC39 мусив перейменувати метод на `Object.groupBy`, щоб не зламати сайти зі старими бібліотеками (так само `flatten` став `flat`, а `contains` — `includes`). Додаєш поліфіл — лише стандартної фічі, з перевіркою наявності й неперелічуваною властивістю.

> [!pitfall] `Object.groupBy` повертає об'єкт без прототипу
> Результат має `null`-прототип: на ньому немає `hasOwnProperty` і `toString`.
>
> ```js
> const g = Object.groupBy([1, 2], (n) => (n > 1 ? 'big' : 'small'));
> g.hasOwnProperty('big');   // ❌ TypeError: g.hasOwnProperty is not a function
> Object.hasOwn(g, 'big');   // ✅ true
> ```

## 🎤 На співбесіді

> [!interview] Як нові можливості потрапляють у JavaScript?
> level: middle · frequency: часто · id: jsd-34-int-01
>
> ---
>
> Через процес TC39 — технічного комітету Ecma, що веде стандарт ECMA-262. Пропозиція проходить стадії: 0 — ідея; 1 — комітет визнає проблему, є чемпіон; 2 — обрано рішення, є чернетка специфікації; 2.7 — специфікацію схвалено, пишуться тести Test262; 3 — рекомендовано до реалізації, рушії впроваджують; 4 — дві сумісні реалізації, досвід використання, PR у специфікацію. Щороку в червні Ecma затверджує нове видання ESyyyy з усім, що досягло стадії 4. Рішення — консенсусом; веб-API (fetch, DOM) — окремі стандарти WHATWG/W3C.
>
> 📚 [[JavaScript - 34. Сучасний JS і TC39#Стадії пропозицій: 0 → 4|Розділ: стадії]] · [TC39 Process Document](https://tc39.es/process-document/)

> [!interview] Що нового в останніх версіях ECMAScript?
> level: middle · frequency: часто · id: jsd-34-int-02
>
> ---
>
> ES2023 — копіювальні методи масивів (`toSorted`, `with`) і `findLast`. ES2024 — `Object.groupBy`/`Map.groupBy`, `Promise.withResolvers`, RegExp `/v`, resizable `ArrayBuffer`. ES2025 — Iterator helpers (ліниві `map/filter/take` для будь-яких ітераторів), методи `Set` (`union`, `intersection`…), JSON-модулі з `with { type: 'json' }`, `RegExp.escape`, `Promise.try`, `Float16Array`. ES2026 — `Array.fromAsync`, `Error.isError`, `Math.sumPrecise`, base64 для `Uint8Array`, `Iterator.concat`, `Map.getOrInsert`. Уже стадія 4 і чекає ES2027: Temporal і `using` для керування ресурсами.
>
> 📚 [[JavaScript - 34. Сучасний JS і TC39#Тур ES2021 → ES2025|Розділ: ES2021–ES2025]] · [GitHub: tc39/proposals — finished](https://github.com/tc39/proposals/blob/main/finished-proposals.md)

> [!interview] Як безпечно використовувати нові фічі мови в продакшні?
> level: senior · frequency: іноді · id: jsd-34-int-03
>
> ---
>
> Визначаю цільову аудиторію через `browserslist` і перевіряю фічу на MDN/Baseline, caniuse, для сервера — node.green. Синтаксис транспілюю (Babel, TypeScript, SWC) до цільових версій; API поліфілю (`core-js` з `useBuiltIns: 'usage'` або точкові поліфіли) і роблю feature detection замість user-agent. Пропозиції нижче стадії 3 у продакшн не тягну — синтаксис може змінитися; виняток — свідомі ставки на кшталт decorators у TypeScript. Слідкую за розміром поліфілів, щоб сучасні браузери не тягнули зайвого (differential serving або лише потрібні поліфіли).
>
> 📚 [[JavaScript - 34. Сучасний JS і TC39#Як перевірити підтримку і користуватися новим|Розділ: підтримка]] · [web.dev: Baseline](https://web.dev/baseline)

## 🔗 Зв'язки

- [[JavaScript - 11. Ітератори та генератори]] — протокол ітерації, на якому стоять Iterator helpers.
- [[JavaScript - 12. Масиви та функціональний стиль]] — `toSorted`, `with`, `groupBy` і чому копії замість мутацій.
- [[JavaScript - 24. Дати, час та Intl]] — `Date` vs `Temporal`.
- [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви]] — нові методи `Set`, `getOrInsert`, `Float16Array`.
- [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери]] — import attributes, `import defer`, транспіляція.
- [[JavaScript - 32. Патерни проєктування]] — decorators як мовна підтримка патерну Decorator.

## ⚡ Фішки

> [!reel] 🏷️ Чому flatten став flat
> Бібліотека MooTools колись додала свій `Array.prototype.flatten`. Стандартний метод з тим самим іменем зламав би сайти — і TC39 назвав його `flat`. Жартома цю кризу звали «smooshgate».

> [!reel] 🕰️ Temporal: майже 10 років шляху
> Стадія 1 — 2017, стадія 4 — 2026. Стільки часу знадобилось, щоб замінити `Date`, скопійований у 1995 з Java, на нормальні дати, часові пояси й календарі.

> [!reel] 🦥 Iterator helpers ліниві
> `naturals().filter(even).take(2).toArray()` працює з нескінченним генератором: значення тягнуться по одному, і після другого ланцюжок закривається.
>
> ```js
> Iterator.from([1, 2, 3]).map((x) => x * 2).toArray(); // → [2, 4, 6]
> ```

> [!reel] 🧮 0.1 + 0.2 + 0.3 нарешті 0.6
> `Math.sumPrecise([0.1, 0.2, 0.3])` (ES2026) повертає `0.6`, а звичайне додавання — `0.6000000000000001`. Метод рахує точну суму й округлює лише в кінці.

> [!reel] 🧹 using прибирає за тобою
> `using conn = openConnection()` викличе `conn[Symbol.dispose]()` наприкінці блоку — навіть при помилці. Як `try/finally`, тільки без `finally`.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке TC39 і ECMAScript?
> *часто · теорія* · `jsd-34-001`
>
> ECMAScript (ECMA-262) — стандарт мови, JavaScript — його реалізації в рушіях. TC39 — технічний комітет Ecma International, що розвиває стандарт консенсусом і щороку публікує нове видання ESyyyy.
>
> 📚 [[JavaScript - 34. Сучасний JS і TC39#Хто і як змінює JavaScript|Розділ: TC39]] · [tc39.es](https://tc39.es/)

> [!question]- Чим `??` відрізняється від `||`?
> *дуже часто · порівняння* · `jsd-34-002`
>
> `a ?? b` повертає `b`, лише якщо `a` — `null` або `undefined`. `a || b` — якщо `a` будь-яке falsy (`0`, `''`, `false`, `NaN`). Для значень за замовчуванням, де `0` чи `''` валідні, — `??`.
>
> 📚 [[JavaScript - 34. Сучасний JS і TC39#Тур ES2015 → ES2020|Розділ: ES2015–ES2020]] · [MDN: Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)

> [!question]- Чим `toSorted` відрізняється від `sort`?
> *часто · порівняння* · `jsd-34-003`
>
> `sort` сортує масив на місці й повертає той самий масив; `toSorted` (ES2023) повертає **новий** відсортований масив, не змінюючи оригінал. Так само `toReversed`, `toSpliced`, `with`.
>
> 📚 [[JavaScript - 34. Сучасний JS і TC39#Тур ES2021 → ES2025|Розділ: ES2021–ES2025]] · [MDN: Array.prototype.toSorted()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted)

### 🟡 Middle

> [!question]- Назви стадії TC39 і що означає кожна.
> *часто · теорія* · `jsd-34-004`
>
> 0 — ідея; 1 — проблему взято до розгляду, є чемпіон; 2 — обрано рішення, чернетка специфікації; 2.7 — специфікацію схвалено, пишуться тести; 3 — рекомендовано до реалізації; 4 — дві сумісні реалізації з Test262, готово до стандарту.
>
> 📚 [[JavaScript - 34. Сучасний JS і TC39#Стадії пропозицій: 0 → 4|Розділ: стадії]] · [TC39 Process Document](https://tc39.es/process-document/)

> [!question]- Чим Iterator helpers відрізняються від методів масивів?
> *іноді · порівняння* · `jsd-34-005`
>
> Працюють з будь-яким ітератором (генератори, `map.keys()`, потоки), обчислюються ліниво — по одному значенню на запит — і не створюють проміжних масивів. Тому підходять для нескінченних послідовностей; для результату — `.toArray()`.
>
> 📚 [[JavaScript - 34. Сучасний JS і TC39#Тур ES2021 → ES2025|Розділ: Iterator helpers]] · [MDN: Iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator)

> [!question]- Як перевірити, чи можна використовувати фічу в продакшні?
> *часто · практика* · `jsd-34-006`
>
> Подивитись таблицю сумісності на MDN і статус Baseline, caniuse для часток користувачів, node.green для Node; зіставити з `browserslist` проєкту. Відсутній синтаксис — транспілювати, відсутній API — поліфілити з feature detection.
>
> 📚 [[JavaScript - 34. Сучасний JS і TC39#Як перевірити підтримку і користуватися новим|Розділ: підтримка]] · [MDN: Baseline compatibility](https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility)

### 🔴 Senior

> [!question]- Чому деякі методи отримали «дивні» імена (`flat`, `includes`, `Object.groupBy`)?
> *іноді · теорія* · `jsd-34-007`
>
> Принцип «don't break the web»: старі бібліотеки (MooTools, Prototype, Sugar) додавали методи з такими самими іменами, але іншою поведінкою, і стандартні реалізації зламали б сайти. Тому `flatten` → `flat`, `contains` → `includes`, а `Array.prototype.group` став статичним `Object.groupBy`.
>
> 📚 [[JavaScript - 34. Сучасний JS і TC39#Хто і як змінює JavaScript|Розділ: TC39]] · [MDN: Object.groupBy()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy)

> [!question]- Що дає Explicit Resource Management (`using`)?
> *іноді · теорія* · `jsd-34-008`
>
> Детерміноване звільнення ресурсів: `using x = …` викликає `x[Symbol.dispose]()` при виході з блоку (навіть через виняток), `await using` — `Symbol.asyncDispose`. `DisposableStack` збирає кілька ресурсів. Замінює громіздкі `try/finally` для файлів, з'єднань, локів. Стадія 4 у 2026, увійде в ES2027.
>
> 📚 [[JavaScript - 34. Сучасний JS і TC39#ES2026 і те, що вже на стадії 4|Розділ: стадія 4]] · [MDN: using](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/using)

> [!question]- Чим транспіляція відрізняється від поліфілу?
> *часто · порівняння* · `jsd-34-009`
>
> Транспіляція переписує **синтаксис** у старий еквівалент під час збирання (`?.` → перевірки на `null`) — старий парсер нового синтаксису не зрозуміє. Поліфіл — JS-код, що в рантаймі додає відсутні **API** (`Promise.withResolvers`) з перевіркою наявності. Babel `preset-env` + `core-js` поєднують обидва.
>
> 📚 [[JavaScript - 34. Сучасний JS і TC39#Як перевірити підтримку і користуватися новим|Розділ: поліфіли]] · [Babel: preset-env](https://babeljs.io/docs/babel-preset-env)

## 🛠️ Практика

> [!task] Поясни своїми словами: шлях пропозиції
> level: middle · difficulty: easy · id: jsd-34-task-01 · tags: feynman, tc39
>
> Поясни (до 6 речень) колезі, як ідея на кшталт pipeline-оператора може (або не може) потрапити в JavaScript, що означають стадії 2, 3 і 4 і чому ти не радиш тягнути його в продакшн через Babel-плагін, хоча `Temporal` з поліфілом — радиш.
>
> > [!hint]- Підказка 1
> > Що може змінитися на стадії 2 і що вже зафіксовано на стадії 4?
>
> > [!hint]- Підказка 2
> > Різниця між **синтаксисом** (не поліфілиться) і **API** (поліфілиться).
>
> > [!solution]- Еталонне пояснення
> > Нову фічу пропонує чемпіон у TC39, і вона піднімається стадіями: на 1 комітет погоджується, що проблема варта уваги, на 2 — обирає бажане рішення, але ще в чернетці, на 2.7 схвалює повну специфікацію й пише тести, на 3 рушії починають реалізацію, а на 4 — є дві сумісні реалізації, і фіча йде в найближчий щорічний ESyyyy. Pipeline зараз на стадії 2: форма ще може змінитися — так уже було, коли конкурували кілька варіантів синтаксису, — і код, переписаний на Babel-плагін, доведеться мігрувати. До того ж це синтаксис: без транспілятора старий браузер його не розпарсить. `Temporal` уже на стадії 4 — API зафіксовано, і поліфіл просто додає об'єкт, який пізніше заміниться нативним без змін у коді. Тому стадія 4 + поліфіл — інвестиція, а стадія 2 + плагін — ставка.

> [!task] Модернізуй старий код
> level: middle · difficulty: medium · id: jsd-34-task-02 · tags: es2015, es2023, es2025, refactoring
>
> Перепиши код, використовуючи можливості ES2015–ES2025, без зміни поведінки (для валідних входів). Поясни, які фічі використав.
>
> ```js
> function getActiveNames(users, opts) {
>   opts = opts || {};
>   var limit = opts.limit !== undefined ? opts.limit : 10;
>   var result = [];
>   for (var i = 0; i < users.length; i++) {
>     var u = users[i];
>     if (u.active && u.profile && u.profile.name) result.push(u.profile.name);
>   }
>   return result.slice(0, limit);
> }
> function groupByRole(users) {
>   var groups = {};
>   users.forEach(function (u) {
>     if (!groups.hasOwnProperty(u.role)) groups[u.role] = [];
>     groups[u.role].push(u);
>   });
>   return groups;
> }
> function last(arr) { return arr[arr.length - 1]; }
> function sortedCopy(arr) { return arr.slice().sort(function (a, b) { return a - b; }); }
> ```
>
> 🧪 Тести перевіряють і поведінку, і переваги нових API: `getActiveNames` має зупинятися, щойно набере `limit` імен (а не обходити весь масив), а `groupByRole` — не ламатися на ролях на кшталт `'hasOwnProperty'` чи `'__proto__'`. Заготовка — старий код, тож спершу тести будуть червоні.
>
> ```js starter
> // Перепиши на ES2015–ES2025
> function getActiveNames(users, opts) {
>   opts = opts || {};
>   var limit = opts.limit !== undefined ? opts.limit : 10;
>   var result = [];
>   for (var i = 0; i < users.length; i++) {
>     var u = users[i];
>     if (u.active && u.profile && u.profile.name) result.push(u.profile.name);
>   }
>   return result.slice(0, limit);
> }
> function groupByRole(users) {
>   var groups = {};
>   users.forEach(function (u) {
>     if (!groups.hasOwnProperty(u.role)) groups[u.role] = [];
>     groups[u.role].push(u);
>   });
>   return groups;
> }
> function last(arr) { return arr[arr.length - 1]; }
> function sortedCopy(arr) { return arr.slice().sort(function (a, b) { return a - b; }); }
> ```
>
> ```js tests
> const user = (name, active = true, role = 'dev') => ({ active, role, profile: name ? { name } : undefined })
>
> test('getActiveNames: лише активні з іменем, limit за замовчуванням 10', () => {
>   const users = [user('Ann'), user('Bob', false), user(null), user('Eve')]
>   expect(getActiveNames(users)).toEqual(['Ann', 'Eve'])
>   const many = Array.from({ length: 15 }, (_, i) => user(`u${i}`))
>   expect(getActiveNames(many)).toHaveLength(10)
>   expect(getActiveNames(many, { limit: 2 })).toEqual(['u0', 'u1'])
> })
>
> test('getActiveNames ліниво зупиняється, щойно набере limit', () => {
>   const data = Array.from({ length: 1000 }, (_, i) => user(`u${i}`))
>   let reads = 0
>   const users = new Proxy(data, {
>     get(target, key, receiver) {
>       if (typeof key === 'string' && /^\d+$/.test(key)) reads++
>       return Reflect.get(target, key, receiver)
>     },
>   })
>   expect(getActiveNames(users, { limit: 3 })).toEqual(['u0', 'u1', 'u2'])
>   expect(reads).toBeLessThanOrEqual(10)
> })
>
> test('groupByRole групує за роллю', () => {
>   const a = user('A', true, 'admin')
>   const b = user('B', true, 'dev')
>   const c2 = user('C', true, 'admin')
>   const groups = groupByRole([a, b, c2])
>   expect(Object.keys(groups)).toEqual(['admin', 'dev'])
>   expect(groups.admin).toEqual([a, c2])
> })
>
> test('groupByRole не ламається на ролях з «небезпечними» іменами', () => {
>   const groups = groupByRole([user('A', true, 'hasOwnProperty'), user('B', true, 'hasOwnProperty'), user('C', true, '__proto__')])
>   expect(groups.hasOwnProperty).toHaveLength(2)
>   expect(Object.keys(groups)).toEqual(['hasOwnProperty', '__proto__'])
> })
>
> test('last і sortedCopy не мутують вхід', () => {
>   const arr = [30, 10, 20]
>   expect(last(arr)).toBe(20)
>   expect(last([])).toBeUndefined()
>   expect(sortedCopy(arr)).toEqual([10, 20, 30])
>   expect(arr).toEqual([30, 10, 20])
> })
> ```
>
> > [!hint]- Підказка 1
> > Параметри за замовчуванням + деструктуризація, `?.`, стрілки, `at`, `toSorted`, `Object.groupBy`.
>
> > [!hint]- Підказка 2
> > Для `getActiveNames` спробуй Iterator helpers: `users.values().filter(…).map(…).take(limit).toArray()` — зупиниться, щойно набере `limit` імен.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const getActiveNames = (users, { limit = 10 } = {}) =>
> >   users.values()                                   // ітератор масиву
> >     .filter((u) => u.active && u.profile?.name)    // ES2020 ?. + ES2025 helpers
> >     .map((u) => u.profile.name)
> >     .take(limit)                                   // лінива зупинка
> >     .toArray();
> >
> > const groupByRole = (users) => Object.groupBy(users, (u) => u.role); // ES2024
> > const last = (arr) => arr.at(-1);                                    // ES2022
> > const sortedCopy = (arr) => arr.toSorted((a, b) => a - b);           // ES2023
> > ```
> >
> > Нюанси «без зміни поведінки»: `{ limit = 10 } = {}` спрацьовує на `undefined`, як і оригінал, але `getActiveNames(users, null)` тепер кине помилку (оригінал терпів `null`). `Object.groupBy` повертає об'єкт з `null`-прототипом — код, що викликав `groups.hasOwnProperty`, треба перевести на `Object.hasOwn`. `at(-1)` для порожнього масиву так само повертає `undefined`.

> [!task] Поліфіли за правилами стандарту
> level: senior · difficulty: hard · id: jsd-34-task-03 · tags: polyfill, es2026, maps
>
> Напиши поліфіли `Map.prototype.getOrInsert(key, value)` і `Map.prototype.getOrInsertComputed(key, callback)` (ES2026) та `Object.groupBy(items, callback)` (ES2024) як функції `getOrInsert`, `getOrInsertComputed`, `groupBy` і встанови їх помічником `defineMethod(target, name, fn)` (тести викликають функції напряму — у сучасному рушії нативні методи вже можуть бути). Поліфіли: додаються лише за відсутності нативних; є **неперелічуваними** (як вбудовані методи); `getOrInsertComputed` викликає `callback(key)` лише для відсутнього ключа й кидає `TypeError`, якщо `callback` — не функція; `-0` як ключ нормалізується до `+0` (як у `Map.prototype.set`).
>
> ```js
> const counts = new Map();
> for (const w of 'a b a c a b'.split(' ')) counts.set(w, counts.getOrInsert(w, 0) + 1);
> console.log(counts); // → Map(3) { 'a' => 3, 'b' => 2, 'c' => 1 }
>
> const byLen = new Map();
> for (const w of ['hi', 'yo', 'hey']) byLen.getOrInsertComputed(w.length, () => []).push(w);
> console.log(byLen); // → Map(2) { 2 => [ 'hi', 'yo' ], 3 => [ 'hey' ] }
> console.log(Object.keys(Map.prototype).includes('getOrInsert')); // → false
> ```
>
> ```js starter
> function defineMethod(target, name, fn) {
>   // твій код: лише якщо нативного немає; неперелічуваний метод
> }
>
> function getOrInsert(key, value) {
>   // твій код (this — Map)
> }
>
> function getOrInsertComputed(key, callback) {
>   // твій код
> }
>
> function groupBy(items, callback) {
>   // твій код
> }
>
> defineMethod(Map.prototype, 'getOrInsert', getOrInsert)
> defineMethod(Map.prototype, 'getOrInsertComputed', getOrInsertComputed)
> defineMethod(Object, 'groupBy', groupBy)
> ```
>
> ```js tests
> test('defineMethod додає неперелічуваний метод з атрибутами вбудованих', () => {
>   const target = {}
>   const fn = () => 1
>   expect(defineMethod(target, 'm', fn)).toBe(true)
>   expect(Object.keys(target)).toEqual([])
>   expect(Object.getOwnPropertyDescriptor(target, 'm'))
>     .toEqual({ value: fn, writable: true, enumerable: false, configurable: true })
> })
>
> test('defineMethod не перезаписує наявний (нативний) метод', () => {
>   const native = () => 'native'
>   const target = { m: native }
>   expect(defineMethod(target, 'm', () => 'poly')).toBe(false)
>   expect(target.m).toBe(native)
> })
>
> test('getOrInsert: рахує слова', () => {
>   const counts = new Map()
>   for (const w of 'a b a c a b'.split(' ')) counts.set(w, getOrInsert.call(counts, w, 0) + 1)
>   expect(counts).toEqual(new Map([['a', 3], ['b', 2], ['c', 1]]))
> })
>
> test('getOrInsertComputed викликає callback лише для відсутнього ключа', () => {
>   const byLen = new Map()
>   const make = vi.fn(() => [])
>   for (const w of ['hi', 'yo', 'hey']) getOrInsertComputed.call(byLen, w.length, make).push(w)
>   expect(byLen).toEqual(new Map([[2, ['hi', 'yo']], [3, ['hey']]]))
>   expect(make).toHaveBeenCalledTimes(2)
>   expect(() => getOrInsertComputed.call(new Map(), 'k', 'не функція')).toThrow(TypeError)
> })
>
> test('getOrInsertComputed нормалізує -0 до +0 і передає ключ у callback', () => {
>   const m = new Map()
>   let received
>   getOrInsertComputed.call(m, -0, (k) => { received = k; return 'v' })
>   expect(Object.is(received, 0)).toBe(true)
>   expect(Object.is([...m.keys()][0], 0)).toBe(true)
> })
>
> test('groupBy: об\'єкт без прототипу, callback отримує індекс', () => {
>   const g = groupBy([1, 2, 3, 4], (n, i) => (i < 2 ? 'first' : n % 2 ? 'odd' : 'even'))
>   expect(Object.getPrototypeOf(g)).toBeNull()
>   expect(Object.keys(g)).toEqual(['first', 'odd', 'even'])
>   expect(g.first).toEqual([1, 2])
>   expect(groupBy(new Set(['a', 'bb']), (s) => s.length)['2']).toEqual(['bb'])
> })
> ```
>
> > [!hint]- Підказка 1
> > Звичайне присвоєння `Map.prototype.x = fn` створює **перелічувану** властивість. Що використати замість нього?
>
> > [!hint]- Підказка 2
> > `Object.groupBy` повертає об'єкт, створений через `Object.create(null)`, а ключі — результат callback-а, приведений до ключа властивості.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function defineMethod(target, name, fn) {
> >   if (typeof target[name] === 'function') return false;  // нативний — не чіпаємо
> >   Object.defineProperty(target, name, {
> >     value: fn, writable: true, enumerable: false, configurable: true,
> >   });
> >   return true;
> > }
> >
> > function getOrInsert(key, value) {
> >   if (!this.has(key)) this.set(key, value);
> >   return this.get(key);
> > }
> >
> > function getOrInsertComputed(key, callback) {
> >   if (typeof callback !== 'function') throw new TypeError('callback is not a function');
> >   if (this.has(key)) return this.get(key);
> >   if (key === 0) key = 0;                  // -0 → +0
> >   const value = callback(key);
> >   this.set(key, value);
> >   return value;
> > }
> >
> > function groupBy(items, callback) {
> >   const result = Object.create(null);
> >   let i = 0;
> >   for (const item of items) {
> >     const key = String(callback(item, i++)); // спрощено: спека використовує ToPropertyKey (символи лишаються символами)
> >     (result[key] ??= []).push(item);
> >   }
> >   return result;
> > }
> >
> > defineMethod(Map.prototype, 'getOrInsert', getOrInsert);
> > defineMethod(Map.prototype, 'getOrInsertComputed', getOrInsertComputed);
> > defineMethod(Object, 'groupBy', groupBy);
> > ```
> >
> > Атрибути `writable: true, configurable: true, enumerable: false` — саме такі в усіх вбудованих методів. Перевірка `typeof … === 'function'` не дає перезаписати швидку нативну реалізацію. Для продакшну краще брати `core-js`: він враховує крайові випадки специфікації (`this`, що не є `Map`, і тому подібне) і тестується на Test262.

## 📚 Джерела та що почитати

- 🟢 [GitHub — tc39/proposals](https://github.com/tc39/proposals) — актуальні стадії всіх активних пропозицій.
- 🟢 [GitHub — tc39/proposals: finished proposals](https://github.com/tc39/proposals/blob/main/finished-proposals.md) — що в якому ESyyyy вийшло.
- 🟡 [TC39 — Process Document](https://tc39.es/process-document/) — офіційний опис стадій 0–4 і вимог до них.
- 🟡 [web.dev — Baseline](https://web.dev/baseline) — як читати статуси Newly/Widely available.
- 🟡 [MDN — Iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator) — Iterator helpers з прикладами.
- 🟡 [MDN — Temporal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal) — новий API дат і часу.
- 🔴 [ECMAScript® 2026 Language Specification](https://tc39.es/ecma262/2026/) — чинне видання стандарту.
- 🛠️ [node.green](https://node.green/) — підтримка ES-фіч по версіях Node.js.
- 🛠️ [core-js](https://github.com/zloirock/core-js) — найповніша бібліотека поліфілів стандартних API.

> [!important] Підсумок
> - JavaScript розвиває TC39 консенсусом; стандарт ECMA-262 виходить щороку (ESyyyy), а веб-API — окремі стандарти.
> - Стадії: 0 ідея → 1 проблема → 2 рішення-чернетка → 2.7 схвалена специфікація й тести → 3 реалізації → 4 стандарт (дві сумісні реалізації + Test262).
> - Головне за останні роки: копіювальні методи масивів (2023), `groupBy` і `withResolvers` (2024), Iterator helpers, методи `Set`, JSON-модулі (2025), `Error.isError`, `Math.sumPrecise`, base64, `getOrInsert` (2026); Temporal і `using` уже на стадії 4.
> - Decorators (2.7), pipeline (2), signals і pattern matching (1) ще можуть змінитися — у продакшн лише як свідома ставка.
> - Підтримку перевіряй через MDN/Baseline, caniuse, node.green; синтаксис — транспілюй, API — поліфіль з feature detection.
