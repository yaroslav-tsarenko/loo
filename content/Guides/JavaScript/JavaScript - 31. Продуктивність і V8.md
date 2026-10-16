---
title: Продуктивність і V8
order: 31
level: senior
tags: [performance, v8, jit, hidden-classes, inline-caches, deopt, profiling, long-tasks]
prerequisites:
  - "[[JavaScript - 01. Як JS виконує код]]"
  - "[[JavaScript - 08. Event Loop]]"
  - "[[JavaScript - 13. Пам'ять і збирач сміття]]"
estimatedMinutes: 60
id: jsd-ch-31
icon: "🏎️"
---

# JavaScript - 31. Продуктивність і V8

> [!success] 🎯 Після цього розділу ти зможеш
> - Виміряти перед оптимізацією: Performance panel, `performance.now`, `mark`/`measure`, профілі в Node — і не потрапити в пастки мікробенчмарків.
> - Пояснити конвеєр V8 (Ignition → Sparkplug → Maglev → TurboFan) і що таке спекулятивна оптимізація та деоптимізація.
> - Писати код зі стабільними hidden classes і мономорфними inline caches, розуміти шкоду `delete` і «дірявих» масивів.
> - Прибрати зайві алокації в гарячих шляхах і доречно застосувати мемоізацію.
> - Зменшити вартість JS для сторінки: code splitting, розбиття long tasks через `scheduler.yield()` і чанки.

## 🤔 Передбач

> [!quiz] Чи мають об'єкти однакову форму?
> level: middle · id: jsd-31-quiz-01
>
> ```js
> const a = { x: 1, y: 2 };
> const b = { y: 2, x: 1 };
> // Чи матимуть a і b однаковий hidden class у V8?
> ```
>
> - [ ] Так — набір властивостей той самий
> - [x] Ні — властивості додано в різному порядку
> - [ ] Так, але лише після першого виклику функції з ними
> - [ ] У JS немає класів у об'єктів-літералів
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. V8 будує «форму» (hidden class, у V8 — *Map*) як ланцюжок переходів: `{}` → `+x` → `+y`. Інший порядок — інший ланцюжок, і функція, що отримує обидва об'єкти, бачить **дві** форми замість однієї.

## 🧒 Простими словами

Уяви **склад**, де працівник збирає замовлення. Якщо всі коробки однакові (поличка «x» завжди ліворуч, «y» — праворуч), він за тиждень робить це наосліп і дуже швидко — це **inline cache** і оптимізований код. Якщо коробки щоразу різні, доводиться читати етикетки — повільно. А якщо колись прийде коробка геть іншої форми, працівник мусить зупинитися і повернутися до інструкції — це **деоптимізація**. Головне правило складу: **спершу постій поруч із секундоміром** (виміряй), а потім уже переставляй полиці.

## 🔬 Як це працює насправді

### Спершу виміряй

Оптимізація без вимірювання — гадання. Порядок дій:

1. 🎯 **Метрика користувача**: що саме повільно — завантаження (LCP), реакція на клік (INP), плавність скролу? INP вважається добрим до 200 мс.
2. 🔍 **Профіль**: Chrome DevTools → **Performance** з CPU throttling 4–6× (твій ноутбук не телефон користувача). Червоні трикутники — *long tasks* (> 50 мс); flame chart показує, хто їх створив.
3. 📏 **Точкові заміри** в коді — User Timing API, видно і в профілі:

```js
performance.mark('parse:start');
const data = JSON.parse(hugeJson);
performance.mark('parse:end');
const { duration } = performance.measure('parse', 'parse:start', 'parse:end');
console.log(`parse: ${duration.toFixed(1)} ms`);
```

4. 🔁 **Зміна → повторний замір** у тих самих умовах.

`performance.now()` — монотонний час з високою роздільністю (на відміну від `Date.now()`, не стрибає при зміні системного годинника). Через Spectre браузери його **огрублюють** — до десятків-сотень мікросекунд, точніше в cross-origin isolated контексті ([[JavaScript - 29. Workers і паралельність]]). У Node: `node --cpu-prof app.js` (профіль для DevTools), `node --inspect`, `--prof`.

**Пастки мікробенчмарків:** JIT ще не «розігрівся» (перші ітерації — інтерпретатор); оптимізатор **викинув** обчислення, результат якого не використовується; GC-пауза потрапила в один з прогонів; бенчмарк бачить одну форму даних, а продакшн — десять. Вимірюй на реалістичних даних і дивись на медіану кількох прогонів.

> [!figure] devtools-performance
> scenario: layout-thrashing
>
> Типовий цикл «записав профіль → знайшов long task → виправив → переміряв» на прикладі forced reflow.

> [!quiz] Перевір себе: як вимірювати
> level: middle · type: multi · id: jsd-31-quiz-02
>
> - [x] `performance.now()` краще за `Date.now()` для вимірювання тривалості
> - [ ] Один прогін функції в циклі на 10 ітерацій дає надійну оцінку швидкості
> - [x] Профілювати варто з CPU throttling, бо пристрої користувачів повільніші
> - [ ] Long task — будь-яка задача, довша за 16 мс
> - [x] Якщо результат обчислення в бенчмарку ніде не використовується, оптимізатор може його викинути
>
> **Пояснення:** `Date.now()` має мілісекундну точність і залежить від системного годинника. Long task за визначенням — понад **50 мс**; 16,7 мс — бюджет кадру при 60 Гц. Короткі бенчмарки міряють розігрів JIT, а не стабільну швидкість.

### Конвеєр V8: Ignition, Sparkplug, Maglev, TurboFan

> [!diagram] Конвеєр V8: від коду до оптимізації й назад
> ```yaml
> layout: stack
> nodes:
>   - { id: src, label: "вихідний код", code: "function add(a, b) {\n  return a + b;\n}", tone: blue }
>   - { id: parse, label: Parser, text: "AST", tone: gray }
>   - { id: ign, label: "Ignition — інтерпретатор", text: "bytecode + feedback vector", tone: violet }
>   - { id: spark, label: "Sparkplug — базовий компілятор", text: "bytecode → машинний код, майже без оптимізацій", tone: mint }
>   - { id: mag, label: "Maglev — швидкий оптимізуючий JIT", text: "досить гарний код досить швидко", tone: yellow }
>   - { id: tf, label: "TurboFan — спекулятивні оптимізації", text: "найшвидший код для гарячих функцій", tone: green }
> edges:
>   - { from: src, to: parse }
>   - { from: parse, to: ign }
>   - { from: ign, to: spark }
>   - { from: spark, to: mag }
>   - { from: mag, to: tf }
>   - { from: tf, to: ign, label: deopt, tone: red, dashed: true }
> steps:
>   - { move: { from: src, to: parse, value: "source" }, note: "Спершу парсер розбирає текст функції в дерево AST." }
>   - { move: { from: parse, to: ign, value: bytecode }, set: { ign: "feedback: a, b — малі цілі" }, note: "Ignition компілює AST у компактний bytecode і починає виконувати. Заодно записує в feedback vector, які типи реально приходять." }
>   - { move: { from: ign, to: spark, value: "часто викликається" }, note: "Функцію викликають часто — Sparkplug швидко перекладає bytecode в машинний код, прибираючи накладні витрати інтерпретатора." }
>   - { move: { from: spark, to: mag, value: "hot and stable" }, note: "Типи стабільні — Maglev оптимізує на основі feedback: «досить гарний код досить швидко»." }
>   - { move: { from: mag, to: tf, value: "дуже гаряча" }, set: { tf: "рахує лише цілі + guard" }, note: "Для справді гарячого коду TurboFan робить спекуляцію: add 10 000 разів бачив цілі — значить, генеруємо код лише для цілих і ставимо дешеву перевірку (guard)." }
>   - { move: { from: tf, to: ign, value: "add('1', 2)" }, set: { tf: "guard ✗ → deopt" }, note: "Прийшов рядок — guard спрацьовує, припущення хибне. Деоптимізація: назад у bytecode, збирати новий feedback." }
> ```

- **Ignition** (з 2017) — інтерпретатор: компактний bytecode, швидкий старт. Під час виконання заповнює **feedback vector**: які форми об'єктів і типи значень бачив кожен рядок.
- **Sparkplug** (2021) — перекладає bytecode в машинний код без аналізу: прибирає накладні витрати інтерпретатора.
- **Maglev** (2023) — оптимізуючий компілятор, що компілює в рази швидше за TurboFan: «досить гарний код досить швидко».
- **TurboFan** — для справді гарячого коду: inline-підстановка функцій, прибирання перевірок, escape analysis. З нещодавніх версій має новий бекенд Turboshaft.

Ключова ідея — **спекулятивна оптимізація**: якщо `add(a, b)` 10 000 разів отримував малі цілі, оптимізований код рахує саме цілі й ставить дешеву перевірку (*guard*). Прийшов рядок — guard спрацьовує, і відбувається **деоптимізація**. Побачити це можна прапорцями Node:

```text
$ node --trace-opt app.js
[marking <JSFunction add> for optimization to MAGLEV, ConcurrencyMode::kConcurrent, reason: hot and stable]
$ node --trace-deopt app.js
[bailout (kind: deopt-eager, reason: wrong map): begin. deoptimizing …]
```

> [!quiz] Перевір себе: рівні JIT
> level: senior · id: jsd-31-quiz-03
>
> Навіщо V8 кілька рівнів компіляції замість одного найкращого компілятора?
>
> - [ ] Кожен рівень підтримує різну версію ECMAScript
> - [x] Компромісом між часом компіляції та якістю коду: холодний код не варто довго оптимізувати, а гарячий — варто
> - [ ] TurboFan працює лише в Node.js, а Maglev — у браузері
> - [ ] Щоб виконувати один і той самий код паралельно на кількох ядрах
>
> **Пояснення:** більшість коду виконується кілька разів — для нього вистачить інтерпретатора чи Sparkplug. Дорогі оптимізації окупаються лише для гарячих функцій, і краще, щоб на них був зібраний feedback.

### Hidden classes — форми об'єктів

Об'єкт у JS — словник, але пошук за рядком у кожному `obj.x` був би повільним. Тому V8 зберігає для об'єкта **hidden class** (у V8 — *Map*, в інших рушіях — *Shape*/*Structure*): опис «властивість `x` — у слоті 0, `y` — у слоті 1». Об'єкти з однаковою історією додавання властивостей **ділять** одну форму, а значення лежать у компактному масиві слотів.

> [!diagram] Hidden classes: дерево форм
> ```yaml
> layout: tree
> nodes:
>   - { id: s0, label: "порожня форма", code: "a = {}", tone: gray }
>   - { id: s1, label: Shape1, text: "{ x: слот 0 }", parent: s0, tone: violet }
>   - { id: s2, label: Shape2, text: "{ x: 0, y: 1 }", note: "a.x = …; a.y = …", parent: s1, tone: green }
>   - { id: s3, label: Shape3, text: "{ x: 0, z: 1 }", note: "b.x = …; b.z = …", parent: s1, tone: orange }
> steps:
>   - { focus: s0, note: "Новий об'єкт {} має порожню форму: жодної властивості ще немає." }
>   - { show: s1, move: { from: s0, to: s1, value: "+x" }, note: "a.x = … — V8 переходить до форми Shape1: «x лежить у слоті 0»." }
>   - { show: s2, move: { from: s1, to: s2, value: "+y" }, note: "a.y = … — форма Shape2. Кожен об'єкт, що отримав x, а потім y, ділить цю саму форму — і доступ obj.y стає просто «взяти слот 1»." }
>   - { show: s3, move: { from: s1, to: s3, value: "+z" }, note: "Об'єкт b після x отримав z — інша гілка, інша форма. Код, що бачить і a, і b, вже поліморфний і повільніший." }
>   - { focus: [s2, s3], note: "Тому { x: 1, y: 2 } і { y: 2, x: 1 } мають різні форми. Правило: ініціалізуй усі поля в одному порядку, навіть як null." }
> ```

```js
// node --allow-natives-syntax shapes.js   (%-функції — лише для налагодження!)
function Point(x, y) { this.x = x; this.y = y; }
console.log(%HaveSameMap(new Point(1, 2), new Point(3, 4))); // → true
console.log(%HaveSameMap({ x: 1, y: 2 }, { y: 2, x: 1 }));   // → false
```

Практичні правила:

- ініціалізуй **усі** поля в конструкторі (або полях класу) в одному порядку — навіть як `null`;
- не додавай властивості «потім» лише деяким екземплярам;
- для словників з динамічними ключами (id → значення) бери `Map`, а не об'єкт.

> [!viz] hidden-classes
> scenario: shapes

> [!quiz] Перевір себе: форми
> level: middle · type: multi · id: jsd-31-quiz-04
>
> Які пари об'єктів **гарантовано** матимуть одну форму в V8?
>
> - [x] Два екземпляри класу, де всі поля оголошено як поля класу
> - [ ] `{ a: 1, b: 2 }` і `{ b: 2, a: 1 }`
> - [ ] `const o = new User(); o.admin = true;` і звичайний `new User()`
> - [x] Два літерали `{ id: 1, name: 'A' }` і `{ id: 2, name: 'B' }`
>
> **Пояснення:** форма залежить від набору **і порядку** властивостей, а не від значень. Додавання `admin` одному екземпляру переводить його на іншу гілку переходів.

> [!quiz] Заповни пропуски: стабільні форми й packed-масив
> level: middle · type: fill · id: jsd-31-quiz-10 · bank: delete, of
>
> ```js fill
> class Point {
>   x; y; label
>   constructor(x, y, label = [[null|undefined]]) {
>     this.x = x
>     this.y = y
>     this.label = label
>   }
> }
> const points = Array.[[from]]({ length: 1000 }, (_, i) => new Point(i, i))
> function hide(p) { p.label = [[null|undefined]] } // замість delete
> ```
>
> **Пояснення:** усі поля оголошено й ініціалізовано в одному порядку, тож усі точки ділять одну форму. `Array.from` заповнює масив послідовно — він лишається packed, без дірок. Обнулення замість `delete` не переводить об'єкт у dictionary mode.

### Inline caches: мономорфні, поліморфні, мегаморфні

Кожне місце доступу `obj.x` у коді має **inline cache** (IC) — запам'ятовує, для якої форми де лежить `x`:

| Стан IC | Скільки форм бачив | Що відбувається |
|---|---|---|
| **monomorphic** | 1 | одна перевірка форми + читання слота — найшвидше |
| **polymorphic** | 2–4 | лінійна перевірка кількох форм — трохи повільніше |
| **megamorphic** | > 4 | пошук у глобальному кеші — помітно повільніше, гірше інлайниться |

```js
function area(s) { return s.w * s.h; }       // IC для s.w і s.h

area({ w: 1, h: 2 });                         // monomorphic
area({ h: 2, w: 1 });                         // polymorphic — порядок інший
area({ w: 1, h: 2, color: 'red' });           // ще одна форма
area({ w: 1, h: 2, id: 1 });
area({ kind: 'sq', w: 1, h: 2 });             // > 4 форм → megamorphic
```

Для більшості коду це не має значення. Але у гарячих функціях (рендер списку на тисячі елементів, парсер, ігровий цикл) мономорфність може дати кратну різницю. Типова причина мегаморфності — «універсальна» функція, яка обробляє об'єкти десятка різних форм: нормалізуй дані до однієї форми на вході.

> [!viz] hidden-classes
> scenario: inline-cache

> [!quiz] Перевір себе: стан IC
> level: senior · id: jsd-31-quiz-05
>
> Функція `getId(o) { return o.id }` викликається з об'єктами 12 різних форм (різні моделі API). У якому стані буде IC для `o.id`?
>
> - [ ] monomorphic
> - [ ] polymorphic
> - [x] megamorphic
> - [ ] IC вимикається для функцій з одним параметром
>
> **Пояснення:** понад 4 форми в одному місці — megamorphic. Код працюватиме, але повільніше: кожне читання — пошук у глобальному кеші. Якщо це гаряче місце — нормалізуй об'єкти (спільний клас або однакова фабрика).

### Деоптимізації і чому не варто delete

Оптимізований код тримається на припущеннях. Типові причини деоптимізації:

- 🔀 **wrong map** — прийшов об'єкт іншої форми;
- 🔢 **not a Smi** — функція бачила малі цілі, а прийшов дріб чи рядок;
- 🕳️ читання за межами масиву або з «дірки»;
- 🔁 часті deopt → V8 після кількох спроб перестає оптимізувати функцію.

Одна деоптимізація — не проблема. Проблема — **цикл** «оптимізував → деоптимізував» у гарячому коді.

**`delete` ламає форму.** Видалення властивості переводить об'єкт у *dictionary mode* (повільні властивості — хеш-таблиця замість слотів):

```js
// node --allow-natives-syntax
const user = { id: 1, password: 'x', name: 'Ann' };
console.log(%HasFastProperties(user)); // → true
delete user.password;
console.log(%HasFastProperties(user)); // → false — тепер «словник»
```

Альтернативи: присвоїти `undefined`/`null` (форма та сама), створити новий об'єкт без поля — `const { password, ...safe } = user`, або для справді динамічних ключів — `Map` ([[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви]]).

> [!quiz] Перевір себе: що зберігає форму?
> level: middle · type: multi · id: jsd-31-quiz-06
>
> Потрібно «прибрати» `password` з об'єкта користувача в гарячому коді. Які варіанти **не** переводять об'єкт у dictionary mode?
>
> - [ ] `delete user.password`
> - [x] `user.password = undefined`
> - [x] `const { password, ...publicUser } = user`
> - [ ] `Reflect.deleteProperty(user, 'password')`
>
> **Пояснення:** `Reflect.deleteProperty` — той самий `delete`. Присвоєння `undefined` лишає форму незмінною (але ключ лишається в `Object.keys`). Rest-деструктуризація створює **новий** об'єкт зі стабільною формою.

### Elements kinds масивів

Для масивів V8 окремо відстежує **тип елементів** (elements kind) — від найспеціалізованішого до найзагальнішого:

> [!diagram] Elements kinds: тільки в бік загальнішого
> ```yaml
> layout: compare
> columns: { packed: "packed — без дірок", holey: "holey — з дірками" }
> nodes:
>   - { id: psmi, col: packed, text: PACKED_SMI, note: "[1, 2, 3]", tone: green }
>   - { id: pdbl, col: packed, text: PACKED_DOUBLE, note: "+ 4.5", tone: yellow }
>   - { id: pel, col: packed, text: PACKED_ELEMENTS, note: "+ 'x'", tone: orange }
>   - { id: hsmi, col: holey, text: HOLEY_SMI, note: "new Array(3)", tone: yellow }
>   - { id: hdbl, col: holey, text: HOLEY_DOUBLE, tone: orange }
>   - { id: hel, col: holey, text: HOLEY_ELEMENTS, tone: red }
> edges:
>   - { from: psmi, to: pdbl }
>   - { from: pdbl, to: pel }
>   - { from: hsmi, to: hdbl }
>   - { from: hdbl, to: hel }
> steps:
>   - { focus: psmi, note: "const arr = [1, 2, 3] — лише малі цілі (Smi) без дірок. Це PACKED_SMI, найшвидший вид." }
>   - { move: { from: psmi, to: pdbl, value: "push(4.5)" }, note: "Додали дробове число — масив переходить у PACKED_DOUBLE." }
>   - { move: { from: pdbl, to: pel, value: "push('x')" }, note: "Додали рядок — тепер PACKED_ELEMENTS: довільні значення, найзагальніший вид." }
>   - { focus: pel, note: "Видалимо 'x' — масив НЕ повернеться назад. Переходи односторонні: лише вниз, до загальнішого." }
>   - { focus: hsmi, note: "new Array(3) або arr[100] = 1 дають holey-масив: кожне читання перевіряє «дірку» і може піти в прототип." }
>   - { focus: [psmi, pdbl, pel, hsmi, hdbl, hel], note: "Packed можна «зіпсувати» до holey, але не навпаки. Тому заповнюй масиви послідовно і не змішуй типи в гарячому коді." }
> ```

- `[1, 2, 3]` — `PACKED_SMI`: найшвидші операції.
- `push(4.5)` → `PACKED_DOUBLE`; `push('x')` → `PACKED_ELEMENTS`. Якщо потім видалити `'x'`, масив **не повернеться** назад.
- `new Array(3)` або `arr[100] = 1` дають **holey**-масив: кожне читання має перевіряти «дірку» і, можливо, йти в прототип.

```js
// node --allow-natives-syntax
const arr = [1, 2, 3];
console.log(%HasSmiElements(arr));     // → true
arr.push(4.5);
console.log(%HasDoubleElements(arr));  // → true
console.log(%HasHoleyElements(new Array(3))); // → true
```

Правила: заповнюй масиви послідовно (`push`, `Array.from({ length: n }, …)`), не змішуй типи в гарячих масивах, не читай за межами `length`. Для чисел у великих обсягах — typed arrays (`Float64Array`): фіксований тип і компактна пам'ять.

> [!quiz] Перевір себе: elements kinds
> level: senior · type: multi · id: jsd-31-quiz-07
>
> - [x] `const a = [1, 2, 3]; a.push(1.5);` переводить масив у `PACKED_DOUBLE_ELEMENTS`
> - [ ] Після `a.pop()` того `1.5` масив повертається в `PACKED_SMI_ELEMENTS`
> - [x] `new Array(1000)` створює holey-масив
> - [x] `Array.from({ length: 1000 }, () => 0)` створює packed-масив
> - [ ] Holey-масиви неможливо оптимізувати взагалі
>
> **Пояснення:** переходи elements kinds односторонні — «загальність» не відкочується. Holey-масиви оптимізуються, просто з додатковими перевірками на дірки.

### Алокації, мемоізація і гарячі шляхи

Створення об'єкта в V8 дешеве, а смерть молодого об'єкта майже безкоштовна ([[JavaScript - 13. Пам'ять і збирач сміття]]). Але в **гарячому шляху** (обробник `pointermove`, кадр анімації, цикл на мільйон ітерацій) мільйони тимчасових масивів і замикань створюють тиск на GC і паузи.

```js
// ❌ кожен кадр: новий масив, нові об'єкти, проміжні масиви з map/filter
function frame(particles) {
  return particles.map((p) => ({ x: p.x + p.vx, y: p.y + p.vy })).filter((p) => p.x < W);
}

// ✅ мутуємо на місці у зарезервованій пам'яті
const xs = new Float64Array(N), vxs = new Float64Array(N);
function frameFast() {
  for (let i = 0; i < N; i++) xs[i] += vxs[i];
}
```

**Мемоізація** — кеш результатів чистої функції за аргументами: міняє пам'ять на час.

```js
const memo = (fn) => {
  const cache = new Map();
  return (n) => {
    if (!cache.has(n)) cache.set(n, fn(n));
    return cache.get(n);
  };
};
const fib = memo((n) => (n < 2 ? n : fib(n - 1) + fib(n - 2)));
console.log(fib(50)); // → 12586269025 — миттєво замість хвилин
```

Мемоізація доречна, коли функція **чиста**, дорога, і ті самі аргументи **повторюються**. Інакше кеш лише росте (витік, [[JavaScript - 13. Пам'ять і збирач сміття]]) — обмежуй розмір (LRU) або бери `WeakMap` для об'єктних ключів.

> [!quiz] Перевір себе: коли мемоізувати?
> level: middle · type: multi · id: jsd-31-quiz-08
>
> - [x] Дорогий підрахунок макета за тим самим набором параметрів, що повторюється
> - [ ] `Math.random()`-обгортка, щоб «прискорити» генерацію чисел
> - [ ] Функція, яка щоразу отримує новий об'єкт-аргумент і порівнюється за посиланням
> - [x] Парсинг однакових рядків-шаблонів, які приходять знову і знову
>
> **Пояснення:** мемоізація працює лише для чистих функцій з повторюваними аргументами. Для нових об'єктів на кожен виклик кеш ніколи не влучає, зате тримає пам'ять.

> [!quiz] Склади мемоізацію на `Map`
> level: junior · type: order · id: jsd-31-quiz-11
>
> ```js order
> const memo = (fn) => {
>   const cache = new Map()
>   return (n) => {
>     if (!cache.has(n)) cache.set(n, fn(n))
>     return cache.get(n)
>   }
> }
>     if (cache.get(n)) return cache.get(n) // ✗
> ```
>
> **Пояснення:** перевірка `has`, а не `if (cache.get(n))`, коректно кешує й «хибні» результати на кшталт `0`. `Map` приймає ключі будь-якого типу; для об'єктних ключів без витоків пам'яті — `WeakMap`.

### Bundle size, code splitting і long tasks

**Байт JS дорожчий за байт зображення:** його треба завантажити, розпарсити, скомпілювати й виконати — і все це конкурує за головний потік. Що допомагає:

- ✂️ **code splitting** — динамічний `import()` для того, що не потрібно одразу (редактор, графіки, адмінка): бандлер винесе це в окремий чанк ([[JavaScript - 21. Модулі — ESM, CommonJS і бандлери]]);
- 🌳 **tree shaking** — ESM-імпорти конкретних функцій замість цілих бібліотек;
- 🔍 аналіз бандла (`rollup-plugin-visualizer`, `source-map-explorer`) — часто 80 % ваги дають 2–3 залежності.

```js
button.addEventListener('click', async () => {
  const { openEditor } = await import('./editor.js'); // завантажиться лише на клік
  openEditor();
});
```

**Long tasks.** Задача > 50 мс блокує відповідь на ввід — INP росте. Рецепт — **розбити** роботу на шматки й між ними **віддавати керування** головному потоку, щоб браузер обробив клік і намалював кадр:

```js
function yieldToMain() {
  if (globalThis.scheduler?.yield) return scheduler.yield(); // Chrome 129+, Firefox 142+
  return new Promise((resolve) => setTimeout(resolve, 0));   // fallback
}

async function processAll(items) {
  let deadline = performance.now() + 8;               // бюджет ~8 мс
  for (const item of items) {
    process(item);
    if (performance.now() >= deadline) {
      await yieldToMain();
      deadline = performance.now() + 8;
    }
  }
}
```

`scheduler.yield()` кращий за `setTimeout`: продовження стає в чергу з **пріоритетом** перед іншими задачами, тож твоя робота не «загубиться» за сторонніми скриптами. Якщо роботу неможливо розбити — це кандидат у воркер ([[JavaScript - 29. Workers і паралельність]]).

> [!viz] event-loop
> scenario: basic-timeout

> [!diagram] Long task проти роботи шматками
> ```yaml
> layout: compare
> columns: { long: "без розбиття", split: "з yield" }
> nodes:
>   - { id: b1, col: long, text: "400 мс суцільної роботи", note: "одна long task", tone: red }
>   - { id: b2, col: long, text: "клік чекає…", tone: orange, icon: "px:cursor" }
>   - { id: b3, col: long, text: "INP 400+ мс", tone: red }
>   - { id: y1, col: split, text: "8 мс роботи", tone: blue }
>   - { id: y2, col: split, text: "▲ yield: браузер обробив клік і кадр", tone: green, icon: "px:cursor" }
>   - { id: y3, col: split, text: "8 мс → ▲ → 8 мс → ▲ …", tone: blue }
> steps:
>   - { show: b1, note: "Обробник синхронно обробляє всі items за 400 мс. Це одна long task — головний потік зайнятий увесь цей час." }
>   - { show: [b2, b3], note: "Користувач клікає, але клік чекає кінця задачі. Затримка відгуку (INP) — понад 400 мс." }
>   - { show: y1, note: "З розбиттям: обробляємо items, поки не вичерпали бюджет ~8 мс (deadline = performance.now() + 8)." }
>   - { show: y2, note: "await yieldToMain() віддає керування циклу подій: браузер встигає обробити клік і намалювати кадр." }
>   - { show: y3, note: "Далі — наступний шматок по 8 мс, і так до кінця. Роботи стільки ж, але сторінка весь час відгукується." }
> ```

> [!quiz] Перевір себе: long tasks
> level: senior · type: multi · id: jsd-31-quiz-09
>
> Обробник кліку синхронно фільтрує й рендерить 50 000 рядків за 400 мс. Що реально покращить INP?
>
> - [x] Спершу оновити UI (індикатор), а важку частину розбити на шматки з `await scheduler.yield()`
> - [ ] Обгорнути обробку в `Promise.resolve().then(...)`
> - [x] Віртуалізувати список — рендерити лише видимі рядки
> - [ ] Замінити `for` на `forEach`
>
> **Пояснення:** мікрозадачі виконуються **до** рендеру й обробки вводу — `Promise.then` не віддає керування браузеру ([[JavaScript - 08. Event Loop]]). Допомагають справжні точки поступки (`scheduler.yield`, `setTimeout`) і зменшення самої роботи.

## ⚠️ Пастки

> [!pitfall] Оптимізація без профілю
> Переписати `forEach` на `for`, кешувати `arr.length`, замінити `map` на цикл «бо швидше» — у 99 % випадків непомітно, а код гіршає. Вузьке місце майже завжди деінде: зайвий ре-рендер, layout thrashing, N+1 запитів, мегабайтний бандл. Спершу Performance panel.

> [!pitfall] Мікробенчмарк, який міряє порожнечу
> Оптимізатор викидає код без спостережуваних ефектів.
>
> ```js
> const t = performance.now();
> for (let i = 0; i < 1e7; i++) Math.sqrt(i); // результат нікуди не йде
> console.log(performance.now() - t);         // міряєш «нічого»
> ```
>
> Накопичуй результат і виводь його, роби розігрів, повторюй кілька разів, порівнюй медіани — або бери інструмент (`mitata`, `tinybench`).

> [!pitfall] `%`-функції і прапорці V8 у продакшн-коді
> `--allow-natives-syntax`, `%OptimizeFunctionOnNextCall` — інструменти налагодження рушія. Вони не стандарт, змінюються між версіями і можуть зламати процес. Для навчання й експериментів — так; у коді — ніколи.

## 🎤 На співбесіді

> [!interview] Що таке hidden classes і inline caches у V8 і як вони впливають на код?
> level: senior · frequency: часто · id: jsd-31-int-01
>
> ---
>
> Hidden class (у V8 — Map) описує форму об'єкта: які властивості і в яких слотах. Об'єкти з однаковим набором і **порядком** додавання властивостей ділять форму, тож доступ `obj.x` — це читання слота за відомим зміщенням. Inline cache у кожному місці доступу запам'ятовує форму→зміщення: одна форма — monomorphic (найшвидше), 2–4 — polymorphic, більше — megamorphic (пошук у глобальному кеші). Висновки для коду: ініціалізувати всі поля в конструкторі в одному порядку, не додавати поля вибірково, не `delete`-ити (dictionary mode), для динамічних ключів — `Map`, нормалізувати дані в гарячих функціях.
>
> 📚 [[JavaScript - 31. Продуктивність і V8#Hidden classes — форми об'єктів|Розділ: hidden classes]] · [Mathias Bynens: Shapes and Inline Caches](https://mathiasbynens.be/notes/shapes-ics)

> [!interview] Як працює JIT у V8 і що таке деоптимізація?
> level: senior · frequency: іноді · id: jsd-31-int-02
>
> ---
>
> Код парситься в AST і компілюється в bytecode, який виконує інтерпретатор Ignition, збираючи feedback про типи й форми. Гарячі функції компілюються далі: Sparkplug — швидкий базовий компілятор без оптимізацій, Maglev — швидкий оптимізуючий, TurboFan — найагресивніший. Оптимізація спекулятивна: компілятор припускає ті типи й форми, які бачив, і ставить guards. Якщо прийшов інший тип чи форма — деоптимізація: повернення в bytecode з поточним станом. Одиничні deopt нормальні; проблема — цикли оптимізація/деоптимізація в гарячому коді через нестабільні типи.
>
> 📚 [[JavaScript - 31. Продуктивність і V8#Конвеєр V8: Ignition, Sparkplug, Maglev, TurboFan|Розділ: конвеєр V8]] · [V8 blog: Maglev](https://v8.dev/blog/maglev)

> [!interview] Сторінка «підвисає» після кліку. Як будеш шукати й виправляти?
> level: senior · frequency: часто · id: jsd-31-int-03
>
> ---
>
> Відтворюю з CPU throttling у Performance panel, знаходжу long task після кліку і дивлюсь flame chart: чий код, чи є forced layout, скільки рендеру. Якщо це JS-обчислення — зменшую роботу (віртуалізація списку, мемоізація дорогих чистих обчислень, прибрати зайві ре-рендери), розбиваю решту на шматки з `scheduler.yield()` (fallback — `setTimeout`), спершу показую миттєвий фідбек. Те, що не ділиться, — у Web Worker. Перевіряю результат метрикою INP у полі (RUM), а не лише в лабораторії. Окремо дивлюсь бандл: code splitting і ліниві `import()`.
>
> 📚 [[JavaScript - 31. Продуктивність і V8#Bundle size, code splitting і long tasks|Розділ: long tasks]] · [web.dev: Optimize long tasks](https://web.dev/articles/optimize-long-tasks)

## 🔗 Зв'язки

- [[JavaScript - 01. Як JS виконує код]] — парсинг і компіляція — перший крок конвеєра V8.
- [[JavaScript - 08. Event Loop]] — чому мікрозадачі не віддають керування рендеру, а `scheduler.yield` — так.
- [[JavaScript - 13. Пам'ять і збирач сміття]] — алокації в гарячих шляхах = тиск на GC.
- [[JavaScript - 29. Workers і паралельність]] — що робити, коли роботу неможливо розбити.
- [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери]] — tree shaking і code splitting.

## ⚡ Фішки

> [!reel] 🧬 { x, y } і { y, x } — різні «класи»
> Для V8 порядок додавання властивостей визначає hidden class. Два літерали з тими самими ключами в іншому порядку — дві різні форми і поліморфний доступ.

> [!reel] 🪦 delete вбиває швидкі властивості
> Після `delete obj.prop` V8 переводить об'єкт у dictionary mode — хеш-таблицю. Хочеш прибрати поле — `obj.prop = undefined` або `const { prop, ...rest } = obj`.

> [!reel] 🕳️ new Array(3) — масив з дірками
> `new Array(3)` створює holey-масив, і він назавжди лишиться holey. `Array.from({ length: 3 }, () => 0)` — packed і швидший для читання.
>
> ```js
> [, 1]      // holey
> [0, 1]     // packed
> ```

> [!reel] 🍰 Promise.then не рятує від long task
> Мікрозадачі виконуються до рендеру й обробки вводу. Щоб браузер «вдихнув» — `await scheduler.yield()` або `setTimeout`.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Чому для вимірювання краще `performance.now()`, ніж `Date.now()`?
> *часто · порівняння* · `jsd-31-001`
>
> `performance.now()` монотонний (не стрибає при зміні системного годинника) і має субмілісекундну роздільність, хоч браузери її огрублюють через Spectre. `Date.now()` — ціле число мілісекунд «настінного» часу.
>
> 📚 [[JavaScript - 31. Продуктивність і V8#Спершу виміряй|Розділ: виміряй]] · [MDN: Performance.now()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)

> [!question]- Що таке long task і чим він шкодить?
> *дуже часто · теорія* · `jsd-31-002`
>
> Задача на головному потоці довша за 50 мс. Поки вона виконується, браузер не обробляє ввід і не малює кадри — інтерфейс «замерзає», росте INP. Ліки — розбити роботу з поступками (`scheduler.yield`), зменшити її або винести у воркер.
>
> 📚 [[JavaScript - 31. Продуктивність і V8#Bundle size, code splitting і long tasks|Розділ: long tasks]] · [web.dev: Optimize long tasks](https://web.dev/articles/optimize-long-tasks)

> [!question]- Навіщо code splitting?
> *часто · практика* · `jsd-31-003`
>
> Щоб не завантажувати, не парсити й не виконувати на старті код, який не потрібен одразу. Динамічний `import()` змушує бандлер винести модуль в окремий чанк, що завантажується на вимогу (маршрут, модалка, редактор).
>
> 📚 [[JavaScript - 31. Продуктивність і V8#Bundle size, code splitting і long tasks|Розділ: code splitting]] · [web.dev: Code splitting](https://web.dev/articles/reduce-javascript-payloads-with-code-splitting)

### 🟡 Middle

> [!question]- Що таке hidden class і як писати код, дружній до нього?
> *часто · теорія* · `jsd-31-004`
>
> Внутрішній опис форми об'єкта: набір властивостей і їхні слоти. Однаковий набір і порядок додавання → спільна форма і швидкий доступ. Ініціалізуй усі поля в конструкторі в одному порядку, не додавай поля вибірково, не `delete`, для динамічних ключів — `Map`.
>
> 📚 [[JavaScript - 31. Продуктивність і V8#Hidden classes — форми об'єктів|Розділ: hidden classes]] · [V8 blog: Fast properties](https://v8.dev/blog/fast-properties)

> [!question]- Чим monomorphic IC відрізняється від megamorphic?
> *іноді · порівняння* · `jsd-31-005`
>
> Monomorphic — місце доступу бачило одну форму: одна перевірка й пряме читання слота. Polymorphic — 2–4 форми, перевірка по черзі. Megamorphic — понад 4: пошук у глобальному кеші, гірше інлайниться, повільніше.
>
> 📚 [[JavaScript - 31. Продуктивність і V8#Inline caches: мономорфні, поліморфні, мегаморфні|Розділ: inline caches]] · [Mathias Bynens: Shapes and Inline Caches](https://mathiasbynens.be/notes/shapes-ics)

> [!question]- Чому `delete obj.prop` шкодить продуктивності і чим замінити?
> *часто · практика* · `jsd-31-006`
>
> V8 переводить об'єкт у dictionary mode: властивості в хеш-таблиці, IC не можуть використати швидкі слоти. Заміни: `obj.prop = undefined`, новий об'єкт через `const { prop, ...rest } = obj`, `Map` для динамічних ключів.
>
> 📚 [[JavaScript - 31. Продуктивність і V8#Деоптимізації і чому не варто delete|Розділ: delete і деоптимізації]] · [V8 blog: Fast properties](https://v8.dev/blog/fast-properties)

### 🔴 Senior

> [!question]- Опиши конвеєр V8 від вихідного коду до оптимізованого машинного коду.
> *часто · теорія* · `jsd-31-007`
>
> Parser → AST → Ignition (bytecode + feedback vector) → Sparkplug (базовий машинний код без оптимізацій) → Maglev (швидкий оптимізуючий JIT) → TurboFan (спекулятивні оптимізації, inlining). При хибному припущенні — deopt назад у bytecode.
>
> 📚 [[JavaScript - 31. Продуктивність і V8#Конвеєр V8: Ignition, Sparkplug, Maglev, TurboFan|Розділ: конвеєр V8]] · [V8 blog: Sparkplug](https://v8.dev/blog/sparkplug)

> [!question]- Що таке elements kinds і як не погіршити їх?
> *іноді · теорія* · `jsd-31-008`
>
> V8 відстежує тип елементів масиву: SMI → DOUBLE → ELEMENTS, кожен у packed чи holey варіанті; переходи лише в бік загальнішого. Заповнюй масиви послідовно, не створюй дірок (`new Array(n)`, запис далеко за `length`), не змішуй типи, не читай за межами — для чисел бери typed arrays.
>
> 📚 [[JavaScript - 31. Продуктивність і V8#Elements kinds масивів|Розділ: elements kinds]] · [V8 blog: Elements kinds](https://v8.dev/blog/elements-kinds)

> [!question]- Чому `scheduler.yield()` кращий за `setTimeout(0)` для розбиття задач?
> *рідко · порівняння* · `jsd-31-009`
>
> Обидва віддають керування браузеру. Але продовження після `scheduler.yield()` стає в чергу з вищим пріоритетом, ніж нові задачі, тож робота не відсувається за сторонні скрипти; `setTimeout` ставить продовження в кінець і може мати clamping до ≥ 4 мс. Підтримка: Chrome 129+, Firefox 142+, тож потрібен fallback.
>
> 📚 [[JavaScript - 31. Продуктивність і V8#Bundle size, code splitting і long tasks|Розділ: long tasks]] · [MDN: Scheduler.yield()](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield)

## 🛠️ Практика

> [!task] Поясни своїми словами: форми й кеші
> level: senior · difficulty: easy · id: jsd-31-task-01 · tags: feynman, v8, hidden-classes
>
> Поясни (до 6 речень) колезі без знань рушіїв, чому `{ x, y }` і `{ y, x }` — різні форми для V8, що таке inline cache і чому функція, яка отримує об'єкти 10 різних форм, може бути повільнішою. Використай аналогію.
>
> > [!hint]- Підказка 1
> > Що «запам'ятовує» конкретне місце в коді, де читається `obj.x`?
>
> > [!hint]- Підказка 2
> > Аналогія: склад, полички, етикетки — або бланк анкети з фіксованими полями.
>
> > [!solution]- Еталонне пояснення
> > Для V8 об'єкт — це бланк з полями у фіксованих клітинках, а «форма» описує, в якій клітинці яке поле; форма будується з того, в якому порядку поля дописували, тому `{ x, y }` і `{ y, x }` — різні бланки. Кожне місце в коді, де читається `obj.x`, запам'ятовує: «для цього бланка `x` у клітинці 0» — це inline cache. Поки приходять однакові бланки, читання миттєве: глянув на тип бланка — і одразу в потрібну клітинку. Якщо бланків 2–4 види, доводиться перебирати кілька підказок, а якщо 10 — підказки не вміщаються, і щоразу треба шукати в загальному довіднику. Тому гаряча функція, що працює з однотипними об'єктами, швидша, ніж «універсальна» для всього підряд.

> [!task] Знайди проблеми продуктивності
> level: senior · difficulty: medium · id: jsd-31-task-02 · tags: v8, shapes, arrays
>
> Цей код рендерить 100 000 точок на кадр. Знайди чотири проблеми, що заважають V8 його оптимізувати, і перепиши.
>
> ```js
> class Point {
>   constructor(x, y, label) {
>     this.x = x;
>     if (label) this.label = label;
>     this.y = y;
>   }
> }
> const points = new Array(100_000);
> for (let i = 0; i < points.length; i++) points[i] = new Point(i, i * 0.5, i % 10 ? null : `#${i}`);
> points.push('separator');
>
> function step() {
>   for (const p of points) {
>     if (typeof p === 'string') continue;
>     p.x += 1;
>     if (p.x > 1000) delete p.label;
>   }
> }
> ```
>
> ```js starter
> // Знайди 4 проблеми, що заважають V8, і перепиши
> class Point {
>   constructor(x, y, label) {
>     this.x = x;
>     if (label) this.label = label;
>     this.y = y;
>   }
> }
> const points = new Array(100_000);
> for (let i = 0; i < points.length; i++) points[i] = new Point(i, i * 0.5, i % 10 ? null : `#${i}`);
> points.push('separator');
>
> function step() {
>   for (const p of points) {
>     if (typeof p === 'string') continue;
>     p.x += 1;
>     if (p.x > 1000) delete p.label;
>   }
> }
> ```
>
> > [!hint]- Підказка 1
> > Скільки форм у екземплярів `Point`? Чи однаковий порядок полів?
>
> > [!hint]- Підказка 2
> > Подивись на створення масиву, на рядок у масиві об'єктів і на `delete`.
>
> > [!solution]- Еталонне рішення
> > Проблеми: (1) умовне поле `label` між `x` і `y` дає дві форми (`x,label,y` і `x,y`) — доступ поліморфний; (2) `new Array(100_000)` — holey-масив; (3) рядок `'separator'` серед об'єктів — масив неоднорідний, у циклі зайва гілка; (4) `delete p.label` переводить точки в dictionary mode прямо в гарячому циклі.
> >
> > ```js
> > class Point {
> >   x; y; label;                       // усі поля, завжди в одному порядку
> >   constructor(x, y, label = null) {
> >     this.x = x;
> >     this.y = y;
> >     this.label = label;
> >   }
> > }
> >
> > const points = Array.from({ length: 100_000 }, (_, i) =>
> >   new Point(i, i * 0.5, i % 10 ? null : `#${i}`)); // packed, одна форма
> > const separators = [100_000];                      // службові дані — окремо
> >
> > function step() {
> >   for (let i = 0; i < points.length; i++) {
> >     const p = points[i];
> >     p.x += 1;
> >     if (p.x > 1000) p.label = null;                // замість delete
> >   }
> > }
> > ```
> >
> > Для справжніх 100 000 точок на кадр наступний крок — structure of arrays: `Float64Array` для `x` і `y` замість об'єктів — без алокацій і з ідеальною локальністю пам'яті.

> [!task] Обробка великого масиву без long tasks
> level: senior · difficulty: hard · id: jsd-31-task-03 · tags: long-tasks, scheduler, async
>
> Напиши `processInChunks(items, fn, { budget = 8, signal })`: застосовує `fn(item, i)` до кожного елемента, повертає проміс з масивом результатів, але ніколи не працює довше `budget` мс без поступки головному потоку. Підтримай скасування через `AbortSignal`. Використай `scheduler.yield()`, якщо він є, інакше `setTimeout`.
>
> ```js
> const r = await processInChunks(Array.from({ length: 3000 }, (_, i) => i), heavy, { budget: 8 });
> console.log(r.length); // → 3000, а таймери й кліки встигали спрацьовувати під час роботи
> await processInChunks([1, 2, 3], heavy, { signal: AbortSignal.abort() }); // ❌ AbortError
> ```
>
> ```js starter
> function yieldToMain() {
>   if (globalThis.scheduler?.yield) return scheduler.yield()
>   return new Promise((resolve) => setTimeout(resolve, 0))
> }
>
> async function processInChunks(items, fn, { budget = 8, signal } = {}) {
>   // твій код
> }
> ```
>
> ```js tests
> // Тести керують часом: setTimeout і performance.now — фейкові
> const useFakeYield = () => {
>   vi.useFakeTimers()
>   Object.defineProperty(globalThis, 'scheduler', { value: undefined, configurable: true, writable: true })
> }
> const flush = async () => { for (let i = 0; i < 10; i++) await Promise.resolve() }
> let turn = 0
> async function drive(promise) {
>   let done = false
>   promise.then(() => { done = true }, () => { done = true })
>   for (let i = 0; i < 1000 && !done; i++) { turn++; vi.advanceTimersByTime(1); await flush() }
>   return promise
> }
>
> test('застосовує fn(item, i) до кожного елемента', async () => {
>   useFakeYield()
>   const r = await drive(processInChunks([10, 20, 30], (x, i) => x + i))
>   expect(r).toEqual([10, 21, 32])
> })
>
> test('порожній масив — порожній результат', async () => {
>   useFakeYield()
>   expect(await drive(processInChunks([], () => 1))).toEqual([])
> })
>
> test('не працює довше budget мс без поступки', async () => {
>   useFakeYield()
>   const perTurn = new Map()
>   const heavy = (x) => {
>     vi.advanceTimersByTime(1) // кожен елемент «коштує» 1 мс
>     perTurn.set(turn, (perTurn.get(turn) ?? 0) + 1)
>     return x * 2
>   }
>   const items = Array.from({ length: 50 }, (_, i) => i)
>   const r = await drive(processInChunks(items, heavy, { budget: 5 }))
>   expect(r).toHaveLength(50)
>   expect(perTurn.size).toBeGreaterThanOrEqual(8)
>   expect(Math.max(...perTurn.values())).toBeLessThanOrEqual(6)
> })
>
> test('вже скасований сигнал — AbortError, fn не викликається', async () => {
>   useFakeYield()
>   const fn = vi.fn()
>   const err = await drive(processInChunks([1, 2, 3], fn, { signal: AbortSignal.abort() })).catch((e) => e)
>   expect(err.name).toBe('AbortError')
>   expect(fn).not.toHaveBeenCalled()
> })
>
> test('скасування посеред роботи зупиняє обробку', async () => {
>   useFakeYield()
>   const controller = new AbortController()
>   const fn = vi.fn(() => vi.advanceTimersByTime(1))
>   const p = processInChunks(Array.from({ length: 100 }, (_, i) => i), fn, { budget: 3, signal: controller.signal })
>   const err = p.catch((e) => e)
>   await flush()
>   controller.abort(new Error('stop'))
>   vi.advanceTimersByTime(1)
>   await flush()
>   expect((await err).message).toBe('stop')
>   expect(fn.mock.calls.length).toBeLessThan(10)
> })
> ```
>
> > [!hint]- Підказка 1
> > Перевіряй час не після кожного шматка фіксованого розміру, а за дедлайном: `performance.now() >= deadline`.
>
> > [!hint]- Підказка 2
> > `signal.throwIfAborted()` на кожній ітерації — найпростіший спосіб скасування.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function yieldToMain() {
> >   if (globalThis.scheduler?.yield) return scheduler.yield();
> >   return new Promise((resolve) => setTimeout(resolve, 0));
> > }
> >
> > async function processInChunks(items, fn, { budget = 8, signal } = {}) {
> >   const results = [];
> >   let deadline = performance.now() + budget;
> >   for (let i = 0; i < items.length; i++) {
> >     signal?.throwIfAborted();
> >     results.push(fn(items[i], i));
> >     if (performance.now() >= deadline) {
> >       await yieldToMain();
> >       deadline = performance.now() + budget;
> >     }
> >   }
> >   return results;
> > }
> > ```
> >
> > Чому дедлайн, а не «по 100 елементів»: вартість елементів різна, а пристрої — у рази повільніші за твій. Бюджет 5–10 мс лишає браузеру час на кадр (16,7 мс при 60 Гц). Якщо один `fn(item)` сам триває понад 50 мс — розбиття не допоможе, потрібен воркер. Код працює і в Node (`performance` і `setTimeout` глобальні).

## 📚 Джерела та що почитати

- 🟢 [web.dev — Optimize long tasks](https://web.dev/articles/optimize-long-tasks) — розбиття задач, `scheduler.yield()` і чому `setTimeout` — компроміс.
- 🟢 [Chrome DevTools — Analyze runtime performance](https://developer.chrome.com/docs/devtools/performance) — практикум з Performance panel.
- 🟡 [Mathias Bynens — JavaScript engine fundamentals: Shapes and Inline Caches](https://mathiasbynens.be/notes/shapes-ics) — найкраще пояснення форм та IC з ілюстраціями.
- 🟡 [V8 blog — Fast properties](https://v8.dev/blog/fast-properties) — швидкі й словникові властивості, чому шкодить `delete`.
- 🟡 [V8 blog — Elements kinds](https://v8.dev/blog/elements-kinds) — packed/holey, SMI/DOUBLE, односторонні переходи.
- 🔴 [V8 blog — Sparkplug](https://v8.dev/blog/sparkplug) і [Maglev](https://v8.dev/blog/maglev) — як влаштовані проміжні рівні JIT.
- 🔴 [V8 blog — The cost of JavaScript in 2019](https://v8.dev/blog/cost-of-javascript-2019) — куди йде час при завантаженні JS.
- 🎥 [Mathias Bynens & Benedikt Meurer — JavaScript Engines: The Good Parts](https://www.youtube.com/watch?v=5nmpokoRaZI) — доповідь про форми, IC і масиви.

> [!important] Підсумок
> - Спершу виміряй: метрика користувача → профіль з throttling → `mark`/`measure` → зміна → повторний замір; остерігайся мікробенчмарків.
> - V8: Ignition збирає feedback, Sparkplug → Maglev → TurboFan компілюють гарячий код спекулятивно; хибне припущення = деоптимізація.
> - Стабільні форми (усі поля в конструкторі, один порядок, без `delete`) дають мономорфні inline caches; > 4 форм — megamorphic.
> - Масиви: заповнюй послідовно, без дірок і змішаних типів; для чисел — typed arrays; у гарячих шляхах уникай алокацій, мемоізуй лише дороге й повторюване.
> - Менше JS на старті (code splitting, tree shaking) і жодних long tasks: розбивай роботу з `scheduler.yield()`, неподільне — у воркер.
