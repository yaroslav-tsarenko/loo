---
title: Як JS виконує код
order: 1
level: junior
tags: [engine, execution-context, call-stack, v8]
prerequisites: []
estimatedMinutes: 30
id: jsd-ch-01
icon: "⚙️"
---

# Як JS виконує код

> [!success] 🎯 Після цього розділу ти зможеш
> - пояснити, що відбувається з кодом від тексту до машинних інструкцій у V8 (parser → AST → Ignition → TurboFan);
> - назвати, з чого складається execution context і чим глобальний контекст відрізняється від контексту функції;
> - намалювати стан call stack у будь-який момент виконання невеликої програми;
> - пояснити, чому довгий синхронний цикл «заморожує» сторінку і що таке run-to-completion;
> - розпізнати stack overflow і переписати рекурсію на цикл із явним стеком.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: junior · type: output · id: jsd-01-quiz-01
>
> ```js
> let done = false;
> setTimeout(() => { done = true; }, 0);
>
> const start = Date.now();
> while (!done && Date.now() - start < 1000) {}
>
> console.log(done);
> ```
>
> - [ ] `true` — таймер на 0 мс спрацює майже одразу
> - [x] `false` — і лише приблизно через секунду
> - [ ] нічого: цикл нескінченний
> - [ ] `TypeError`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Коротко: callback таймера не може «влізти» посеред циклу. Поки поточний код не завершився (call stack не порожній), жоден інший JS-код не виконується. Цикл крутиться всю секунду, бачить `done === false`, виходить за часом — і лише після `console.log(done)` таймер отримує шанс спрацювати.

## 🧒 Простими словами

Уяви кухаря, який працює **сам** на кухні з однією дошкою для нарізання. Рецепт (твій код) він спершу пробігає очима й розкладає на кроки (парсинг), потім готує крок за кроком. Коли рецепт каже «приготуй соус» — він кладе поточну страву збоку і бере нову миску поверх (виклик функції). Соус готовий — прибирає миску і повертається до страви (return). Стопка мисок — це **call stack**. А поки кухар чимось зайнятий, офіціант (таймер, клік, мережа) може лише покласти записку на стіл — кухар прочитає її, тільки коли повністю звільнить дошку. І ще: страви, які він готує сотий раз, він робить «на автоматі» значно швидше — це JIT-компіляція.

## 🔬 Як це працює насправді

### 🏭 Рушій: від тексту до машинного коду

JavaScript-код виконує **рушій** (engine): V8 у Chrome і Node.js, SpiderMonkey у Firefox, JavaScriptCore у Safari. Розгляньмо V8 — **спрощено**, бо реальний конвеєр має більше стадій і евристик.

```text
 source code (текст)
        │  Parser (+ lazy parsing: тіла функцій парсяться, коли вперше потрібні)
        ▼
       AST (abstract syntax tree — дерево конструкцій)
        │  Ignition: компілює AST у bytecode
        ▼
   bytecode ──► Ignition інтерпретує його і збирає feedback
        │       («сюди завжди приходять числа», «в об'єкта завжди така форма»)
        ▼  функція «гаряча»?
   TurboFan (optimizing compiler) → швидкий машинний код
        │  припущення зламалось (прийшов рядок замість числа)?
        └──► deoptimization: назад у bytecode
```

1. **Parser** перетворює текст на **AST**. Синтаксична помилка виявляється саме тут — тому `SyntaxError` у файлі не дає виконатися жодному його рядку.
2. **Ignition** — інтерпретатор: з AST генерує компактний **bytecode** і виконує його. Стартує швидко, але працює не найшвидше.
3. Під час виконання V8 записує **feedback** — які типи й «форми» об'єктів реально трапляються.
4. Коли функція стає «гарячою», **TurboFan** компілює її в оптимізований машинний код, *спекулюючи* на зібраному feedback.
5. Якщо спекуляція не справдилась, відбувається **deoptimization** — повернення до bytecode.

Між Ignition і TurboFan сучасний V8 має ще два рівні — **Sparkplug** (baseline-компілятор) і **Maglev** (швидкий оптимізатор середнього рівня). Ідея та сама: чим «гарячіший» код, тим більше зусиль на його оптимізацію.

```js
function add(a, b) {
  return a + b;
}

for (let i = 0; i < 1e6; i++) add(i, 1); // гаряча функція: TurboFan спеціалізує її під числа
add('a', 'b'); // → 'ab', але оптимізований код під числа може бути викинутий (deopt)
```

Висновок для практики: JS — не «чисто інтерпретована» мова. Це **JIT-компіляція** (just-in-time). Код, що працює зі стабільними типами й формами об'єктів, рушію легше оптимізувати.

> [!quiz] Перевір себе: де виникає SyntaxError?
> level: junior · id: jsd-01-quiz-02
> - [ ] Під час виконання рядка з помилкою, попередні рядки встигають виконатися
> - [x] Під час парсингу, ще до виконання будь-якого коду цього скрипта
> - [ ] Лише в TurboFan, коли функція стає гарячою
> - [ ] Під час deoptimization
>
> **Пояснення:** парсер має побудувати AST для всього скрипта. Якщо текст не є валідним JS, дерево не будується — і виконувати нічого. Тому `console.log(1); let = ;` не виведе навіть `1`.

### 📦 Execution context: «кімната», де виконується код

Будь-який код виконується всередині **execution context** — внутрішньої структури, яка відповідає на запитання «які змінні тут видно, що таке `this` і де ми зараз у коді». **Спрощено** (у специфікації компонентів більше) контекст містить:

| Компонент | Що це |
|---|---|
| **Environment record** | «таблиця» змінних цього контексту: `var`, `let`, `const`, функції, параметри |
| **Outer reference** | посилання на зовнішнє оточення — так утворюється scope chain |
| **`this` binding** | значення `this` (в специфікації зберігається в environment record) |

Корисна (неофіційна, але точна за наслідками) модель — **дві фази**:

1. **Створення.** Рушій проходить код контексту і реєструє оголошення: *function declarations* створюються одразу повністю, `var` отримує `undefined`, а `let`/`const`/`class` реєструються, але лишаються **неініціалізованими** (TDZ).
2. **Виконання.** Код іде рядок за рядком, присвоєння записують значення.

```js
console.log(typeof greet); // → "function"  (оголошення створене на фазі створення)
console.log(x);            // → undefined   (var вже є, але без значення)
var x = 1;
function greet() {}
```

Саме ця модель пояснює hoisting — детально в [[JavaScript - 04. Scope, hoisting і TDZ]].

> [!quiz] Перевір себе: що виведе код?
> level: junior · type: output · id: jsd-01-quiz-03
>
> ```js
> console.log(sum(2, 3));
> console.log(total);
> var total = 10;
> function sum(a, b) { return a + b; }
> ```
>
> - [x] `5`, потім `undefined`
> - [ ] `ReferenceError` на першому рядку
> - [ ] `5`, потім `10`
> - [ ] `undefined`, потім `undefined`
>
> **Пояснення:** на фазі створення `sum` вже повноцінна функція, а `total` — `undefined`. Присвоєння `= 10` станеться пізніше, на фазі виконання.

### 🌍 Global vs function context

**Глобальний контекст** створюється один раз, коли запускається скрипт. Він:

- прив'язаний до **глобального об'єкта** (`window` у браузері, `global` у Node.js, універсально — `globalThis`);
- у класичному скрипті має `this === globalThis` (у ES-модулі `this` на верхньому рівні — `undefined`);
- кладе `var` і function declarations верхнього рівня як **властивості** глобального об'єкта, а `let`/`const`/`class` — в окремий декларативний record, який глобальному об'єкту не належить.

```js
// класичний <script> у браузері
var a = 1;
let b = 2;
console.log(window.a); // → 1
console.log(window.b); // → undefined
```

**Контекст функції** створюється **на кожен виклик** — не на оголошення. Два виклики однієї функції — два незалежні контексти з власними змінними:

```js
function counter() {
  let n = 0;
  n++;
  return n;
}
counter(); // → 1
counter(); // → 1 — кожен виклик отримує свій новий n
```

У контексті функції з'являються також параметри, `arguments` (для звичайних функцій) і свій `this`, який залежить від способу виклику — про це [[JavaScript - 06. this]].

> [!quiz] Перевір себе: оберіть правдиві твердження
> level: junior · type: multi · id: jsd-01-quiz-04
> - [x] Контекст функції створюється при кожному виклику
> - [ ] Контекст функції створюється один раз, коли рушій бачить оголошення
> - [x] `var` на верхньому рівні класичного скрипта стає властивістю `globalThis`
> - [ ] `let` на верхньому рівні теж стає властивістю `globalThis`
> - [x] У ES-модулі `this` на верхньому рівні — `undefined`
>
> **Пояснення:** контекст — це «запуск», а не «опис» функції. Глобальні `let`/`const` живуть у декларативному record, тому `window.b` — `undefined`.

### 🥞 Call stack

**Call stack** (у специфікації — *execution context stack*) — стек контекстів виконання за принципом LIFO. На вершині завжди **running execution context** — той, чий код виконується зараз.

- Старт скрипта → у стек кладеться глобальний контекст.
- Виклик функції → новий контекст кладеться **зверху**, поточний «ставиться на паузу».
- `return` (або кінець функції, або виняток) → контекст знімається, виконання продовжується там, де зупинився попередній.

```js
function multiply(a, b) {
  return a * b;
}
function square(n) {
  return multiply(n, n);
}
function printSquare(n) {
  console.log(square(n));
}
printSquare(4); // → 16
```

```text
крок 1        крок 2         крок 3          крок 4         крок 5
                             multiply
              square         square          square
printSquare   printSquare    printSquare     printSquare    printSquare → console.log(16)
(global)      (global)       (global)        (global)       (global)
```

> [!viz] call-stack
> scenario: nested-calls

Стек видно у будь-якій помилці: `error.stack` і DevTools показують саме ланцюжок кадрів від вершини донизу. `console.trace()` друкує його без помилки.

**Рекурсія** — це просто багато кадрів однієї функції в стеку. Кожен кадр має свої `n`:

```js
function factorial(n) {
  if (n <= 1) return 1;          // базовий випадок — без нього стек ніколи не почне зменшуватись
  return n * factorial(n - 1);
}
factorial(4); // → 24: стек росте до 4 кадрів factorial, потім «згортається»
```

> [!viz] call-stack
> scenario: recursion

Стек має **обмежений розмір**. Рекурсія без базового випадку (або просто дуже глибока) його переповнює:

```js
function depth(n) {
  return depth(n + 1);
}
try {
  depth(0);
} catch (e) {
  console.log(e.name);    // → "RangeError"
  console.log(e.message); // → "Maximum call stack size exceeded" (текст V8)
}
```

> [!viz] call-stack
> scenario: stack-overflow

Ліміт залежить від рушія і розміру кадру: у Node.js за замовчуванням це порядку **10 тисяч** простих викликів. Специфікація ES2015 описує *proper tail calls*, які прибрали б цю проблему для хвостової рекурсії, але реалізовані вони лише в Safari.

> [!quiz] Перевір себе: скільки кадрів функцій максимально буде в стеку?
> level: junior · id: jsd-01-quiz-05
>
> ```js
> function a() { b(); c(); }
> function b() { c(); }
> function c() {}
> a();
> ```
>
> - [ ] 4 — `a`, `b`, `c`, `c`
> - [x] 3 — `a`, `b`, `c` (плюс глобальний контекст)
> - [ ] 2 — `a` і щось одне з викликаних
> - [ ] 1 — функції виконуються по черзі
>
> **Пояснення:** найглибша точка — `a → b → c`. Коли `c` і `b` повернулися, стек знову `a`, і другий виклик `c()` додає лише один кадр: `a → c`. Кадри не накопичуються, вони знімаються при return.

> [!quiz] Перевір себе: склади рекурсивний `factorial`, який не переповнить стек на малих n
> level: junior · type: order · id: jsd-01-quiz-07
>
> ```js order
> function factorial(n) {
>   if (n <= 1) return 1
>   return n * factorial(n - 1)
> }
>   return n * factorial(n) // ✗
> ```
>
> **Пояснення:** базовий випадок `n <= 1` іде **першим** — саме він зупиняє ріст стеку. Виклик `factorial(n)` з тим самим аргументом ніколи не наближається до базового випадку і закінчиться `RangeError: Maximum call stack size exceeded`.

### 🧵 Один потік і run-to-completion

JS-код у межах одного середовища (вкладка, worker, процес Node) виконується в **одному потоці** з **одним call stack**. Немає двох функцій, які виконуються «одночасно» в одному heap.

Звідси головне правило — **run-to-completion**: як тільки почалося виконання задачі (скрипта, callback-а, обробника події), вона працює **до кінця**, поки стек не спорожніє. Ніхто не може перервати її посередині й виконати інший JS-код.

А як тоді працюють таймери, мережа і кліки? Їх обслуговує **середовище** (браузер, Node.js) поза JS-потоком. Готовий результат стає в **чергу** у вигляді callback-а, а **event loop** бере його лише коли стек порожній. Саме тому в `🤔 Передбач` таймер не спрацював: стек був зайнятий циклом. Повна картина черг — у [[JavaScript - 08. Event Loop]].

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
for (let i = 0; i < 1e8; i++) {} // ~0.1 с роботи
console.log('C');
// → A, C, B — B завжди після C, скільки б не тривав цикл
```

Наслідки для практики:

- **Довгий синхронний код блокує все**: рендер, кліки, таймери. Сторінка «зависає».
- Важкі обчислення виносять у **Web Worker** (окремий потік з окремим стеком і heap — спілкування лише повідомленнями) або розбивають на шматки.
- Винятки, що «порушують» run-to-completion, — **добровільні**: генератори і `async`-функції самі віддають керування на `yield`/`await` (див. [[JavaScript - 10. async і await]]).

> [!quiz] Перевір себе: що виведе код?
> level: junior · type: output · id: jsd-01-quiz-06
>
> ```js
> setTimeout(() => console.log('timeout'), 0);
> function heavy() {
>   for (let i = 0; i < 1e7; i++) {}
>   console.log('heavy done');
> }
> heavy();
> console.log('end');
> ```
>
> **Відповідь:** `heavy done end timeout`
>
> **Пояснення:** таймер лише реєструє callback. Весь синхронний код (`heavy()` і `console.log('end')`) виконується до кінця, і тільки потім, на порожньому стеку, event loop запускає callback таймера.

> [!quiz] Перевір себе: заповни пропуски, щоб довга робота не блокувала сторінку
> level: middle · type: fill · id: jsd-01-quiz-08 · bank: setInterval, return, while, 1000
>
> ```js fill
> function processInChunks(items, handle, chunkSize = 1000) {
>   let i = 0
>   function chunk() {
>     const end = Math.min(i + [[chunkSize]], items.length)
>     for (; i < end; i++) handle(items[i])
>     if (i [[<]] items.length) [[setTimeout]](chunk, [[0]])
>   }
>   chunk()
> }
> ```
>
> **Пояснення:** кожен шматок — окрема задача, що виконується до кінця (run-to-completion), а між шматками стек порожніє і браузер встигає обробити кліки й перемалювати сторінку. Наступний шматок плануємо через `setTimeout(chunk, 0)` — «записка на стіл», а не виклик зараз.

## ⚠️ Пастки

> [!pitfall] «setTimeout(fn, 0) виконає fn одразу»
> Нуль — це **мінімальна** затримка, а не обіцянка. Callback стає в чергу й чекає, поки звільниться стек і пройдуть microtasks.
>
> ```js
> setTimeout(() => console.log('later'), 0);
> console.log('now');
> // → now, later
> ```

> [!pitfall] Глибока рекурсія на «реальних» даних
> На тестових даних із глибиною 10 рекурсія працює, а на продакшн-дереві з глибиною 20 000 падає з `RangeError`. Якщо глибина залежить від вхідних даних — використовуй цикл з явним стеком.
>
> ```js
> let list = null;
> for (let i = 0; i < 1e5; i++) list = { value: i, next: list };
> const len = (node) => (node ? 1 + len(node.next) : 0);
> len(list); // → RangeError: Maximum call stack size exceeded
> ```

> [!pitfall] «async-функція виконується в іншому потоці»
> Ні. Код `async`-функції до першого `await` виконується **синхронно** в тому самому потоці. `await` лише ділить функцію на шматки, які пізніше виконуються як microtasks — у тому ж потоці.
>
> ```js
> async function work() {
>   console.log('inside');
> }
> work();
> console.log('after');
> // → inside, after
> ```

## 🎤 На співбесіді

> [!interview] Як JavaScript виконує код? Він інтерпретований чи компільований?
> level: junior · frequency: часто · id: jsd-01-int-01
>
> ---
>
> Обидва. Рушій (наприклад, V8) парсить текст в AST, інтерпретатор **Ignition** перетворює AST у bytecode і виконує його, паралельно збираючи feedback про типи. Гарячі функції компілюються оптимізувальним компілятором **TurboFan** у машинний код на основі цих спостережень; якщо припущення ламається — відбувається deoptimization. Це **JIT-компіляція**. Сам код виконується в execution context-ах, які складаються в call stack, в одному потоці, за принципом run-to-completion.
>
> 📚 [[JavaScript - 01. Як JS виконує код#🏭 Рушій: від тексту до машинного коду|Розділ: рушій і JIT]] · [V8: Launching Ignition and TurboFan](https://v8.dev/blog/launching-ignition-and-turbofan) · [V8: Sparkplug](https://v8.dev/blog/sparkplug)

> [!interview] Що таке call stack і що відбувається при stack overflow?
> level: junior · frequency: дуже часто · id: jsd-01-int-02
>
> ---
>
> Call stack — стек execution context-ів (LIFO). Виклик функції кладе новий кадр, `return` знімає. На вершині — код, що виконується зараз. Розмір стеку обмежений, тож надто глибока рекурсія (зазвичай без базового випадку) кидає `RangeError: Maximum call stack size exceeded`. Лікування — базовий випадок, ітеративний алгоритм із явним стеком/чергою або trampolining. Tail call optimization є у стандарті, але працює лише в Safari, тож покладатися на неї не можна.
>
> 📚 [[JavaScript - 01. Як JS виконує код#🥞 Call stack|Розділ: call stack]] · [MDN: Call stack](https://developer.mozilla.org/en-US/docs/Glossary/Call_stack) · [javascript.info: Recursion and stack](https://javascript.info/recursion)

> [!interview] JS однопотоковий. Як тоді сторінка одночасно чекає мережу, таймери і кліки?
> level: middle · frequency: часто · id: jsd-01-int-03
>
> ---
>
> Однопотоковий саме **JS-код**: один стек, run-to-completion. Мережа, таймери, ввід обробляються середовищем (браузер, libuv у Node) у власних потоках. Коли подія готова, середовище ставить callback у чергу, а event loop запускає його, коли стек порожній. Тому чекати багато речей одночасно можна, а *виконувати* JS — лише одне за раз. Для справжнього паралелізму обчислень є Web Workers / `worker_threads` — окремі потоки з окремими стеками й heap.
>
> 📚 [[JavaScript - 01. Як JS виконує код#🧵 Один потік і run-to-completion|Розділ: один потік і run-to-completion]] · [MDN: JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model) · [javascript.info: Event loop](https://javascript.info/event-loop)

## 🔗 Зв'язки

- [[JavaScript - 04. Scope, hoisting і TDZ]] — фаза створення контексту пояснює, чому `var` дорівнює `undefined` до присвоєння, а `let` кидає помилку.
- [[JavaScript - 05. Замикання]] — outer reference у контексті — це і є механізм, через який функція «пам'ятає» зовнішні змінні.
- [[JavaScript - 06. this]] — `this` є частиною контексту й визначається способом виклику.
- [[JavaScript - 08. Event Loop]] — продовження історії: що відбувається, коли стек спорожнів.
- [[JavaScript - 13. Пам'ять і збирач сміття]] — call stack — лише половина пам'яті; об'єкти живуть у heap.

## ⚡ Фішки

> [!reel] 🧨 SyntaxError вбиває весь файл, а не рядок
> Парсер має побудувати дерево для всього скрипта до виконання. Одна помилка синтаксису — і не виконається навіть перший `console.log`.
>
> ```js
> console.log('hi'); // не виведеться
> let = ;
> ```

> [!reel] 🐌→🚀 Одна функція — чотири швидкості
> У V8 код проходить рівні Ignition → Sparkplug → Maglev → TurboFan. Чим частіше функція викликається, тим агресивніше її оптимізують. А якщо раптом передаси рядок замість числа — може статися deopt.

> [!reel] 📏 Стек у Node.js — це ~10 000 кадрів
> Проста рекурсія в Node падає приблизно на десятій тисячі викликів (залежить від розміру кадру). Ліміт можна змінити прапорцем `--stack-size`, але краще переписати на цикл.

> [!reel] 🍎 Tail calls є в стандарті, але не в Chrome
> ES2015 вимагає proper tail calls у strict mode. Реалізував їх лише Safari. V8 спробував, але прибрав — через втрату кадрів у stack trace і складність налагодження.

> [!reel] 🛑 alert() зупиняє весь JS на сторінці
> `alert`, `confirm`, `prompt` блокують потік: таймери не спрацьовують, обробники не викликаються, поки користувач не натисне OK. Run-to-completion у найчистішому вигляді.

> [!reel] 📜 Event loop не описаний у специфікації JS
> ECMAScript визначає лише jobs і агентів. Сам event loop описує HTML spec (браузери) і libuv (Node). Тому порядок деяких callback-ів у браузері й Node відрізняється.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке execution context?
> *часто · теорія* · `jsd-01-001`
>
> Внутрішня структура, в якій виконується код: environment record зі змінними, посилання на зовнішнє оточення (scope chain) і значення `this`. Буває глобальний (один на скрипт), функціональний (новий на **кожен виклик**) і для `eval`. Модулі мають власний контекст.
>
> 📚 [[JavaScript - 01. Як JS виконує код#📦 Execution context: «кімната», де виконується код|Розділ: execution context]] · [MDN: JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model) · [Spec: Execution Contexts](https://tc39.es/ecma262/#sec-execution-contexts)

> [!question]- Що таке call stack і за яким принципом він працює?
> *дуже часто · теорія* · `jsd-01-002`
>
> Стек execution context-ів за принципом LIFO. Виклик функції кладе кадр зверху, `return` (або виняток) знімає. На вершині — код, який виконується зараз; усі нижчі кадри чекають повернення.
>
> 📚 [[JavaScript - 01. Як JS виконує код#🥞 Call stack|Розділ: call stack]] · [MDN: Call stack](https://developer.mozilla.org/en-US/docs/Glossary/Call_stack) · [Spec: Execution Contexts](https://tc39.es/ecma262/#sec-execution-contexts)

> [!question]- Що таке run-to-completion?
> *часто · теорія* · `jsd-01-003`
>
> Правило: розпочата задача (скрипт, callback, обробник) виконується до кінця, поки стек не спорожніє. Інший JS-код не може її перервати. Тому callback таймера чекає, доки завершиться навіть дуже довгий цикл.
>
> 📚 [[JavaScript - 01. Як JS виконує код#🧵 Один потік і run-to-completion|Розділ: run-to-completion]] · [MDN: JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model) · [HTML Spec: Event loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)

> [!question]- Чому `RangeError: Maximum call stack size exceeded`?
> *часто · код* · `jsd-01-004`
>
> Стек має обмежений розмір, а кожен виклик додає кадр. Рекурсія без базового випадку (або надто глибока) переповнює стек. Лікується базовим випадком або переписуванням на цикл із явним стеком.
>
> ```js
> const f = () => f();
> f(); // → RangeError
> ```
>
> 📚 [[JavaScript - 01. Як JS виконує код#🥞 Call stack|Розділ: call stack]] · [MDN: RangeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError) · [javascript.info: Recursion and stack](https://javascript.info/recursion)

### 🟡 Middle

> [!question]- Чому JS не можна назвати «чисто інтерпретованою» мовою?
> *іноді · теорія* · `jsd-01-005`
>
> Сучасні рушії використовують JIT: V8 спершу інтерпретує bytecode (Ignition), збирає feedback про типи і компілює гарячі функції в машинний код (Sparkplug, Maglev, TurboFan). Тобто код компілюється — але під час виконання, а не заздалегідь.
>
> 📚 [[JavaScript - 01. Як JS виконує код#🏭 Рушій: від тексту до машинного коду|Розділ: рушій і JIT]] · [V8: Launching Ignition and TurboFan](https://v8.dev/blog/launching-ignition-and-turbofan) · [V8: Maglev](https://v8.dev/blog/maglev)

> [!question]- Що таке deoptimization і чому вона трапляється?
> *іноді · теорія* · `jsd-01-006`
>
> TurboFan оптимізує функцію, *припускаючи*, що типи і форми об'єктів будуть такі ж, як раніше. Якщо припущення ламається (прийшов рядок замість числа, в об'єкт додали нову властивість), оптимізований код стає невалідним, і V8 повертається до bytecode. Стабільні типи = менше deopt.
>
> 📚 [[JavaScript - 01. Як JS виконує код#🏭 Рушій: від тексту до машинного коду|Розділ: рушій і JIT]] · [V8: Hidden classes](https://v8.dev/docs/hidden-classes) · [Mathias Bynens: Shapes and Inline Caches](https://mathiasbynens.be/notes/shapes-ics)

> [!question]- Чим відрізняються `var` і `let` на верхньому рівні класичного скрипта?
> *іноді · порівняння* · `jsd-01-007`
>
> `var` (і function declarations) стає властивістю глобального об'єкта: `window.a`. `let`, `const`, `class` живуть в окремому декларативному record — `window.b` буде `undefined`, хоча `b` видно всюди в скриптах сторінки.
>
> 📚 [[JavaScript - 01. Як JS виконує код#🌍 Global vs function context|Розділ: global vs function context]] · [MDN: var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var) · [Spec: GlobalDeclarationInstantiation](https://tc39.es/ecma262/#sec-globaldeclarationinstantiation)

> [!question]- Чому таймер не спрацьовує посеред довгого циклу, якщо час уже минув?
> *часто · теорія* · `jsd-01-008`
>
> Бо таймер лише ставить callback у чергу, а event loop бере щось із черги лише коли call stack порожній. Цикл тримає стек зайнятим, тому callback чекає — це наслідок run-to-completion, а не неточності таймерів.
>
> 📚 [[JavaScript - 01. Як JS виконує код#🧵 Один потік і run-to-completion|Розділ: run-to-completion]] · [MDN: setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout) · [javascript.info: Event loop](https://javascript.info/event-loop)

### 🔴 Senior

> [!question]- Чому генератори і `async`-функції не порушують run-to-completion?
> *рідко · теорія* · `jsd-01-009`
>
> Вони призупиняються **добровільно** — лише в точках `yield`/`await`. Їхній кадр знімається зі стеку, а стан зберігається в об'єкті генератора. Між точками зупинки код так само виконується до кінця без переривань. Ніхто ззовні не може зупинити функцію посередині виразу.
>
> 📚 [[JavaScript - 01. Як JS виконує код#🧵 Один потік і run-to-completion|Розділ: run-to-completion]] · [MDN: JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model) · [MDN: Iterators and generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators)

> [!question]- Як зробити паралельні обчислення в JS, якщо потік один?
> *іноді · практика* · `jsd-01-010`
>
> Web Workers (браузер) або `worker_threads` (Node): кожен worker — окремий агент зі своїм потоком, стеком, heap і event loop. Спілкування — через `postMessage` (structured clone) або спільну пам'ять `SharedArrayBuffer` + `Atomics`. Альтернатива без потоків — розбити роботу на шматки й віддавати керування event loop між ними.
>
> 📚 [[JavaScript - 01. Як JS виконує код#🧵 Один потік і run-to-completion|Розділ: один потік]] · [MDN: Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) · [MDN: SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)

## 🛠️ Практика

> [!task] Намалюй стек
> level: junior · difficulty: easy · id: jsd-01-task-01 · tags: call-stack
>
> Для кожного `console.log` запиши, які кадри є в call stack у цей момент (від вершини донизу).
>
> ```js
> function greet(name) {
>   console.log('1:', name);
>   return format(name);
> }
> function format(name) {
>   console.log('2:', name);
>   return name.toUpperCase();
> }
> console.log('0');
> const result = greet('ann');
> console.log('3:', result);
> ```
>
> Запиши відповідь в об'єкт `stacks`: ключ — те, що надрукує `console.log`, значення — масив кадрів **від вершини донизу**. Глобальний контекст познач рядком `'global'`.
>
> ```js starter
> const stacks = {
>   '0': [],
>   '1: ann': [],
>   '2: ann': [],
>   '3: ANN': [],
>   // твій код: заповни масиви кадрів
> }
> ```
>
> ```js tests
> test('на старті скрипта в стеку лише глобальний контекст', () => {
>   expect(stacks['0']).toEqual(['global'])
> })
>
> test('виклик greet кладе кадр поверх global', () => {
>   expect(stacks['1: ann']).toEqual(['greet', 'global'])
> })
>
> test('format опиняється на вершині, greet чекає під ним', () => {
>   expect(stacks['2: ann']).toEqual(['format', 'greet', 'global'])
> })
>
> test('після return кадри greet і format зняті', () => {
>   expect(stacks['3: ANN']).toEqual(['global'])
> })
> ```
>
> > [!hint]- Підказка 1
> > Глобальний контекст — завжди найнижчий кадр, поки скрипт виконується.
>
> > [!hint]- Підказка 2
> > Сам `console.log` теж на мить додає кадр, але для відповіді враховуй лише свої функції.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const stacks = {
> >   '0': ['global'],
> >   '1: ann': ['greet', 'global'],
> >   '2: ann': ['format', 'greet', 'global'],
> >   '3: ANN': ['global'], // greet і format уже повернулись
> > }
> > ```
> >
> > Ключ: після `return` кадр знімається, тому на момент `'3:'` у стеку знову лише глобальний контекст.

> [!task] Поясни своїми словами: чому сторінка «зависає»
> level: junior · difficulty: medium · id: jsd-01-task-02 · tags: feynman, run-to-completion
>
> Поясни другові-дизайнеру (без слів «event loop» і «стек»), чому під час виконання такого коду кнопки на сторінці не реагують, і чому додавання `setTimeout(updateProgress, 0)` **усередині** циклу не покаже прогрес.
>
> ```js
> for (let i = 0; i < 1e9; i++) {
>   if (i % 1e8 === 0) setTimeout(() => updateProgress(i), 0);
> }
> ```
>
> > [!hint]- Підказка 1
> > Згадай кухаря з однією дошкою: що він робить із записками офіціанта, поки ріже?
>
> > [!hint]- Підказка 2
> > `setTimeout` нічого не виконує — він лише кладе записку на стіл.
>
> > [!solution]- Еталонне пояснення
> > Браузер виконує код сторінки «одним працівником», і цей працівник ніколи не кидає справу посередині. Поки цикл крутиться, він зайнятий на 100%: клік по кнопці, перемальовування екрана, таймери — це записки, які кладуть йому на стіл, але він їх прочитає лише коли повністю закінчить поточну роботу.
> >
> > `setTimeout(..., 0)` не каже «зроби зараз», він каже «поклади записку: зробити, коли звільнишся». Тому всі десять записок про прогрес будуть прочитані **після** циклу — одна за одною, а користувач побачить відразу 100%. Щоб прогрес оновлювався, саму роботу треба різати на шматки й між шматками віддавати керування (наступний шматок — через `setTimeout`), або винести обчислення в окремого працівника — Web Worker.

> [!task] Переживи глибину 100 000
> level: middle · difficulty: hard · id: jsd-01-task-03 · tags: recursion, call-stack
>
> Напиши `deepFlatten(arr)`, який розгортає масив будь-якої вкладеності й **не падає** на глибині 100 000. Порядок елементів має зберегтися.
>
> ```js
> deepFlatten([1, [2, [3, [4]], 5]]); // → [1, 2, 3, 4, 5]
>
> let deep = [42];
> for (let i = 0; i < 100000; i++) deep = [deep];
> deepFlatten(deep); // → [42], без RangeError
> ```
>
> ```js starter
> function deepFlatten(input) {
>   // твій код
> }
> ```
>
> ```js tests
> test('розгортає вкладені масиви зі збереженням порядку', () => {
>   expect(deepFlatten([1, [2, [3, [4]], 5]])).toEqual([1, 2, 3, 4, 5])
> })
>
> test('порожній масив і порожні вкладені масиви дають []', () => {
>   expect(deepFlatten([])).toEqual([])
>   expect(deepFlatten([[], [[]]])).toEqual([])
> })
>
> test('не чіпає не-масиви: рядки, обʼєкти, null', () => {
>   const obj = { a: 1 }
>   expect(deepFlatten(['ab', [obj, [null]]])).toEqual(['ab', obj, null])
> })
>
> test('не падає на глибині 100 000', () => {
>   let deep = [42]
>   for (let i = 0; i < 100000; i++) deep = [deep]
>   expect(deepFlatten(deep)).toEqual([42])
> })
>
> test('не мутує вхідний масив', () => {
>   const input = [1, [2, [3]]]
>   deepFlatten(input)
>   expect(input).toEqual([1, [2, [3]]])
> })
> ```
>
> > [!hint]- Підказка 1
> > Рекурсивне рішення використовує call stack рушія як сховище «що ще обробити». Заміни його своїм масивом.
>
> > [!hint]- Підказка 2
> > Бери елементи з кінця стеку через `pop()`. Якщо елемент — масив, поклади його вміст назад у стек; інакше — в результат. Подумай, як виправити порядок.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function deepFlatten(input) {
> >   const stack = [...input];
> >   const result = [];
> >   while (stack.length > 0) {
> >     const item = stack.pop();
> >     if (Array.isArray(item)) stack.push(...item);
> >     else result.push(item);
> >   }
> >   return result.reverse();
> > }
> > ```
> >
> > `pop()` бере елементи з кінця, тому результат збирається задом наперед — `reverse()` наприкінці відновлює порядок. Глибина вкладеності більше не впливає на call stack: «стек» тепер — звичайний масив у heap, обмежений лише пам'яттю. (Обережно: `push(...item)` для масиву з сотнями тисяч елементів на одному рівні теж може впертися в ліміт аргументів — тоді додавай циклом.)

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Recursion and stack](https://javascript.info/recursion) — call stack і контекст виконання на прикладах рекурсії, з малюнками стеку.
- 🟡 [MDN — JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model) — офіційна модель виконання: агенти, realms, стек контекстів і черга задач.
- 🟡 [V8 — Launching Ignition and TurboFan](https://v8.dev/blog/launching-ignition-and-turbofan) — як V8 перейшов на конвеєр інтерпретатор + оптимізувальний компілятор.
- 🟡 [V8 — Sparkplug](https://v8.dev/blog/sparkplug) — навіщо між Ignition і TurboFan з'явився швидкий неоптимізувальний компілятор.
- 🔴 [Mathias Bynens — Shapes and Inline Caches](https://mathiasbynens.be/notes/shapes-ics) — shapes та inline caches — фундамент оптимізацій і деоптимізацій.
- 🔴 [ECMAScript — Execution Contexts](https://tc39.es/ecma262/#sec-execution-contexts) — першоджерело: з чого складається execution context і як працює стек.
- 🔴 [ECMAScript — Agents](https://tc39.es/ecma262/#sec-agents) — агент як «потік виконання» JS і його зв'язок з run-to-completion.
- 🎥 [Philip Roberts — What the heck is the event loop anyway? (відео)](https://www.youtube.com/watch?v=8aGhZQkoFbQ) — класична доповідь про стек, Web APIs і черги з наочною анімацією.
- 🛠️ [Chrome DevTools — Debug JavaScript](https://developer.chrome.com/docs/devtools/javascript) — панель Call Stack і брейкпоінти, щоб побачити стек наживо.

> [!important] Підсумок
> - V8 (спрощено): parser → AST → Ignition (bytecode + feedback) → TurboFan (оптимізований машинний код) ⇄ deoptimization. Це JIT, а не «чиста інтерпретація».
> - Код виконується в execution context: змінні, outer reference (scope chain), `this`. Глобальний — один, функціональний — на кожен виклик.
> - Call stack — LIFO-стек контекстів; надто глибока рекурсія → `RangeError: Maximum call stack size exceeded`.
> - Один потік + run-to-completion: поки стек зайнятий, жоден callback не виконається — довгий синхронний код блокує сторінку.
