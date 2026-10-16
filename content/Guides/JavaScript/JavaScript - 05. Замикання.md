---
title: Замикання
order: 5
level: middle
tags: [closures, scope, functions, memoization]
prerequisites:
  - "[[JavaScript - 04. Scope, hoisting і TDZ]]"
estimatedMinutes: 40
id: jsd-ch-05
icon: "🎒"
---

# Замикання

> [!success] 🎯 Після цього розділу ти зможеш
> - пояснити замикання через lexical environment і внутрішній слот `[[Environment]]`, а не через «функція пам'ятає змінні»;
> - передбачити, чи бачить замикання **поточне** значення змінної, чи «знімок»;
> - пояснити, чому `for (var …)` і `for (let …)` дають різні результати з callback-ами;
> - використати замикання для приватного стану, module pattern, `once` і мемоізації;
> - розпізнати витоки пам'яті й «застарілі» замикання (stale closures).

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: middle · type: output · id: jsd-05-quiz-01
>
> ```js
> function makeCounter() {
>   let count = 0;
>   return () => ++count;
> }
> const a = makeCounter();
> const b = makeCounter();
> a();
> a();
> console.log(a(), b());
> ```
>
> **Відповідь:** `3 1`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Кожен виклик `makeCounter()` створює **нове** оточення з власним `count`. Функція `a` тримає перше оточення, `b` — друге. Вони не знають одна про одну, хоча код у них однаковий.

## 🧒 Простими словами

Уяви, що кожна функція при народженні отримує **рюкзак**. Туди кладуть не копії речей, а **доступ до кімнати**, у якій вона народилась, — зі всіма змінними. Функцію можна винести з дому, передати іншому, викликати через годину — рюкзак завжди з нею, і вона може зазирнути в «рідну кімнату» й навіть щось там переставити. Якщо ж кімнату ніхто більше не відвідує й жоден рюкзак не веде до неї — прибиральник (GC) її звільнить.

## 🔬 Як це працює насправді

### 🎒 Lexical environment і `[[Environment]]`

З [[JavaScript - 04. Scope, hoisting і TDZ]] ми знаємо: кожен scope — це **lexical environment**: таблиця імен (environment record) + посилання `outer` на зовнішнє оточення.

Тепер ключова деталь зі специфікації: **кожен об'єкт функції має внутрішній слот `[[Environment]]`**. Він заповнюється **в момент створення функції** посиланням на оточення, де вона створена. При кожному **виклику** функції рушій створює нове оточення для її тіла, у якого `outer = [[Environment]]`.

> [!diagram] [[Environment]]: функція несе оточення з собою
> ```yaml
> layout: nest
> nodes:
>   - { id: global, label: "global", code: "function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst a = makeCounter();\na();", tone: gray }
>   - { id: e1, label: "E1 — оточення виклику makeCounter()", parent: global, tone: violet }
>   - { id: count, label: "count", text: "0", parent: e1, tone: yellow }
>   - { id: fn, label: "() => ++count", text: "[[Environment]] = E1", note: "«рюкзак» функції", parent: e1, tone: mint, icon: "px:backpack" }
>   - { id: body, label: "оточення тіла a()", text: "{ }", note: "outer → E1 → global", parent: e1, tone: blue }
> steps:
>   - { show: global, line: "global:5", note: "Виконується const a = makeCounter() — викликаємо фабрику." }
>   - { show: [e1, count], line: "global:2", note: "Виклик створює нове оточення E1, у ньому count = 0." }
>   - { show: fn, line: "global:3", note: "Стрілкова функція створюється всередині E1, тож її [[Environment]] назавжди = E1." }
>   - { focus: [fn, e1], line: "global:5", note: "makeCounter завершилась, але E1 не знищено: функція в a досі тримає на нього посилання." }
>   - { show: body, line: "global:6", note: "a() створює нове порожнє оточення тіла, а його outer = [[Environment]] = E1." }
>   - { set: { count: "1" }, line: "global:3", note: "++count: у тілі count немає — пошук іде по outer в E1 і змінює саму змінну. Тепер count = 1." }
>   - { hide: body, focus: [fn, count], note: "Виклик закінчився — оточення тіла зникло. E1 з count = 1 живе далі, поки живе a." }
> ```

**Замикання** (closure) — це комбінація функції та оточення, на яке вказує її `[[Environment]]`. Тобто технічно **кожна функція в JS — замикання**. Цікавим це стає, коли функція переживає виклик, у якому народилась: оточення не знищується, бо на нього ще є посилання.

Найважливіше слідство: замикання тримає **змінні** (bindings), а не **значення**. Воно бачить актуальний стан і може його змінювати.

```js
let name = 'Ann';
const greet = () => `Hi, ${name}`;
name = 'Bob';
console.log(greet()); // → 'Hi, Bob' — не «знімок», а жива змінна
```

> [!quiz] Перевір себе: коли заповнюється `[[Environment]]` функції?
> level: middle · id: jsd-05-quiz-02
> - [ ] При кожному виклику функції
> - [x] Один раз — коли створюється об'єкт функції
> - [ ] Коли функцію повертають з іншої функції
> - [ ] Коли функцію передають як callback
>
> **Пояснення:** `[[Environment]]` фіксується при створенні функції — саме тому scope лексичний. При кожному виклику створюється нове оточення **тіла**, але його `outer` завжди вказує на той самий `[[Environment]]`.

### 🔢 Лічильники й приватний стан

Кожен виклик функції-фабрики створює **нове** оточення, тому замикання з різних викликів незалежні — це видно з `🤔 Передбач`.

> [!viz] scope-chain
> scenario: closure-counter

До появи `#private` полів у класах замикання були **єдиним** способом зробити справжній приватний стан — і досі залишаються найпростішим:

```js
function createCounter(start = 0, step = 1) {
  let value = start; // ніхто ззовні не може змінити value напряму
  return {
    inc: () => (value += step),
    dec: () => (value -= step),
    reset: () => (value = start),
    get value() { return value; },
  };
}
const c = createCounter(10, 5);
c.inc();
c.inc();
console.log(c.value); // → 20
c.value = 0;          // нічого не дасть: є лише getter
console.log(c.count); // → undefined — змінної ззовні не видно взагалі
```

Методи `inc`, `dec`, `reset` створені в одному виклику, тож **ділять одне оточення** — зміни одного видно іншим.

**Module pattern** — той самий прийом у масштабі модуля: IIFE (функція, що викликається одразу) створює приватний scope і повертає публічний API.

```js
const store = (() => {
  const items = []; // приватно
  return {
    add: (x) => items.push(x),
    count: () => items.length,
  };
})();
store.add('a');
store.count(); // → 1
```

ES-модулі зробили цей прийом вбудованим: все, що не `export`, — приватне для файлу. Але механізм той самий — лексичне оточення модуля.

> [!quiz] Перевір себе: оберіть правдиві твердження про `createCounter` вище
> level: middle · type: multi · id: jsd-05-quiz-03
> - [x] Два виклики `createCounter()` дають незалежні лічильники
> - [x] `inc` і `reset` одного лічильника змінюють ту саму змінну `value`
> - [ ] `value` можна прочитати як `c.count`
> - [ ] Після повернення з `createCounter` змінна `value` знищується
> - [x] Змінити `value` ззовні можна лише через методи
>
> **Пояснення:** оточення виклику живе, поки на нього посилаються методи. Усі методи одного лічильника поділяють його, а різні виклики фабрики створюють різні оточення.

> [!quiz] Перевір себе: склади лічильник із приватним станом
> level: junior · type: order · id: jsd-05-quiz-07
>
> ```js order
> function makeCounter() {
>   let count = 0
>   return {
>     inc: () => ++count,
>     get: () => count,
>   }
> }
>     inc: () => count + 1, // ✗
> ```
>
> **Пояснення:** `count` оголошено у виклику `makeCounter`, а обидва методи створені там само — тож вони ділять одне оточення. `++count` **змінює** змінну в замиканні; `count + 1` лише обчислює нове число й нічого не зберігає.

### 🔁 Цикли: `var` проти `let`

Класика співбесід:

```js
const fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(() => i);
}
console.log(fns.map((f) => f())); // → [3, 3, 3]
```

`var i` — одна змінна на всю функцію. Усі три стрілки замкнули **ту саму** змінну, і на момент виклику вона вже `3`.

З `let` специфікація робить особливу річ: **на кожну ітерацію створюється нове оточення** з копією `i` (операція *CreatePerIterationEnvironment*). Кожне замикання отримує свою змінну.

```js
const fns = [];
for (let i = 0; i < 3; i++) {
  fns.push(() => i);
}
console.log(fns.map((f) => f())); // → [0, 1, 2]
```

> [!viz] scope-chain
> scenario: loop-var-vs-let

Порядок кроків для `let` (спрощено): створити оточення ітерації → перевірити умову → виконати тіло → **скопіювати** поточне `i` у нове оточення → виконати `i++` вже в новому. Тому зміна `i` в тілі впливає на «свою» ітерацію і переноситься далі.

До ES2015 це лікували IIFE, яка створювала нове оточення вручну:

```js
for (var i = 0; i < 3; i++) {
  ((j) => fns.push(() => j))(i); // j — окрема змінна для кожного виклику IIFE
}
```

> [!quiz] Перевір себе: що виведе код?
> level: senior · type: output · id: jsd-05-quiz-04
>
> ```js
> const fns = [];
> for (let i = 0; i < 3; i++) {
>   fns.push(() => i);
>   i++;
> }
> console.log(fns.map((f) => f()).join(','));
> ```
>
> **Відповідь:** `1,3`
>
> **Пояснення:** ітерація 1: `i = 0`, замикання створено, у тілі `i++` → `1` (у тому самому оточенні, тож замикання бачить `1`). Далі `1` копіюється в нове оточення, `i++` → `2`. Ітерація 2: замикання бачить свою `i`, а тіло робить її `3`. Копія `3` → `i++` → `4`, умова хибна. Двоє замикань: `1` і `3`. Див. [Spec: CreatePerIterationEnvironment](https://tc39.es/ecma262/#sec-createperiterationenvironment).

### 🧠 Практичні патерни: once, фабрики, мемоізація

**Фабрики функцій / partial application** — «запам'ятати» частину аргументів:

```js
const multiplier = (factor) => (x) => x * factor;
const double = multiplier(2);
double(5); // → 10
```

**`once`** — виконати функцію лише один раз:

```js
function once(fn) {
  let done = false;
  let result;
  return function (...args) {
    if (!done) {
      done = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}
const init = once(() => 42);
init(); // → 42 — fn виконано
init(); // → 42 — з кешу, fn більше не викликається
```

**Мемоізація** — кешування результату чистої функції за аргументами. Кеш живе в замиканні й переживає виклики:

```js
function memoizeOne(fn) {
  const cache = new Map();
  return (arg) => {
    if (!cache.has(arg)) cache.set(arg, fn(arg));
    return cache.get(arg);
  };
}
const slowSquare = (n) => { for (let i = 0; i < 1e7; i++); return n * n; };
const fastSquare = memoizeOne(slowSquare);
fastSquare(9); // повільно, обчислено
fastSquare(9); // миттєво, з кешу
```

Саме на цих ідеях побудовані `debounce` і `throttle` — таймер живе в замиканні (див. [[JavaScript - 14. Debounce, throttle та async-патерни]]).

> [!quiz] Перевір себе: чому кеш у `memoizeOne` не обнуляється між викликами `fastSquare`?
> level: middle · id: jsd-05-quiz-05
> - [ ] Бо `Map` — глобальний об'єкт
> - [x] Бо `cache` створений один раз у виклику `memoizeOne`, а повернута функція тримає це оточення
> - [ ] Бо стрілкові функції не створюють нового оточення при виклику
> - [ ] Бо рушій автоматично мемоізує чисті функції
>
> **Пояснення:** `const cache` належить оточенню виклику `memoizeOne(...)`. Кожен виклик `fastSquare` створює нове оточення лише для свого тіла (з `arg`), а `cache` знаходить через `outer`.

> [!quiz] Перевір себе: заповни пропуски в `memoizeOne` з пам'яті
> level: middle · type: fill · id: jsd-05-quiz-08 · bank: Set, add, this
>
> ```js fill
> function memoizeOne(fn) {
>   const cache = new [[Map]]()
>   return (arg) => {
>     if (!cache.[[has]](arg)) cache.[[set]](arg, [[fn]](arg))
>     return cache.[[get]](arg)
>   }
> }
> ```
>
> **Пояснення:** `cache` створюється **один раз** — у виклику `memoizeOne`, а не всередині повернутої стрілки. Якби `new Map()` стояв у тілі стрілки, кеш обнулявся б на кожному виклику. `Map`, а не об'єкт, — щоб ключем міг бути будь-який тип без приведення до рядка.

### 🗑️ Замикання і пам'ять

Оточення живе, поки до нього є шлях із «коренів» (глобальних змінних, стеку, активних таймерів, обробників подій). Замикання — такий шлях. Тому:

- обробник події, що замкнув великий масив, тримає масив, поки обробник не знято (`removeEventListener`, `AbortController`);
- `setInterval` без `clearInterval` тримає своє замикання вічно;
- кеш мемоізації росте без меж, якщо його не обмежити.

Деталь реалізації V8 (не специфікація): рушій тримає не все оточення, а лише змінні, які **реально використовуються** якимось замиканням. Але всі замикання одного scope ділять **один** об'єкт-контекст. Тож якщо одна функція використовує `bigData`, а інша — ні, `bigData` житиме, поки жива **будь-яка** з них.

```js
function setup() {
  const bigData = new Array(1e6).fill('x');
  const logSize = () => console.log(bigData.length); // використовує bigData
  return () => 'tiny';                              // не використовує, але ділить контекст
}
const tiny = setup();
// logSize вже недосяжна, але bigData НЕ звільниться: logSize змусила V8 покласти
// bigData у спільний контекст, а tiny посилається на той самий контекст.
// Перевірено через WeakRef + gc() у Node: bigData живе, поки живе tiny.
```

Якщо прибрати `logSize`, `bigData` взагалі не потрапить у контекст і звільниться одразу після `setup()`.

Глибше про досяжність і GC — [[JavaScript - 13. Пам'ять і збирач сміття]].

> [!quiz] Перевір себе: що з цього може тримати великий об'єкт у пам'яті через замикання?
> level: middle · type: multi · id: jsd-05-quiz-06
> - [x] `setInterval`, callback якого використовує цей об'єкт, і який ніколи не очищається
> - [x] Обробник `addEventListener`, що використовує об'єкт, який так і не зняли
> - [ ] Замикання, на яке більше немає жодного посилання
> - [x] Необмежений кеш мемоізації з об'єктами-ключами в `Map`
>
> **Пояснення:** утримує лише **досяжне** замикання. Функція, на яку ніхто не посилається, разом зі своїм оточенням — кандидат на збирання.

## ⚠️ Пастки

> [!pitfall] Stale closure у React
> Callback замкнув значення стану з **того рендеру**, у якому створений. Інтервал, створений один раз, вічно бачить `count === 0`.
>
> ```js
> function Counter() {
>   const [count, setCount] = useState(0);
>   useEffect(() => {
>     const id = setInterval(() => setCount(count + 1), 1000); // count завжди 0
>     return () => clearInterval(id);
>   }, []);
>   // ✅ setCount((c) => c + 1) — бере актуальне значення
> }
> ```

> [!pitfall] Очікування «знімка» замість живої змінної
> Замикання бачить змінну, а не значення на момент створення. Якщо потрібен знімок — скопіюй значення в нову змінну (параметр, `const` у блоці).
>
> ```js
> let status = 'loading';
> const report = () => `status: ${status}`;
> status = 'done';
> report(); // → 'status: done', а не 'loading'
> ```

> [!pitfall] Слухач, який неможливо зняти
> Анонімна функція в `addEventListener` — це щоразу новий об'єкт. `removeEventListener` з «такою ж» функцією нічого не зніме, і замикання житиме вічно.
>
> ```js
> el.addEventListener('click', () => handle(data));
> el.removeEventListener('click', () => handle(data)); // ❌ інша функція
>
> const controller = new AbortController();
> el.addEventListener('click', () => handle(data), { signal: controller.signal });
> controller.abort(); // ✅ знімає слухача
> ```

## 🎤 На співбесіді

> [!interview] Що таке замикання? Наведіть практичний приклад.
> level: middle · frequency: дуже часто · id: jsd-05-int-01
>
> ---
>
> Замикання — це функція разом із лексичним оточенням, у якому вона створена. Кожна функція має внутрішній слот `[[Environment]]`, що фіксується при створенні; при виклику її тіло отримує нове оточення з `outer` на нього. Тому функція має доступ до змінних зовнішнього scope навіть після того, як зовнішня функція завершилась, — і бачить їхні **поточні** значення, а не знімок. Застосування: приватний стан (лічильник, module pattern), фабрики й partial application, `once`, мемоізація, `debounce`/`throttle`, обробники подій, що пам'ятають контекст.
>
> 📚 [[JavaScript - 05. Замикання#🔬 Як це працює насправді|Розділ: замикання]] · [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) · [Spec: Environment Records](https://tc39.es/ecma262/#sec-environment-records)

> [!interview] Чому `for (var i…)` із `setTimeout` виводить 3, 3, 3, а з `let` — 0, 1, 2?
> level: middle · frequency: дуже часто · id: jsd-05-int-02
>
> ---
>
> `var` має function scope: у циклі одна змінна `i`, усі callback-и замикають її, а виконуються вже після циклу, коли `i === 3`. Для `let` у заголовку `for` специфікація створює **нове лексичне оточення на кожну ітерацію** і копіює туди поточне значення, тож кожен callback замикає свою `i`. Старий фікс — IIFE з параметром або `setTimeout(fn, 0, i)` з передачею аргументу.
>
> 📚 [[JavaScript - 05. Замикання#🔁 Цикли: var проти let|Розділ: цикли і замикання]] · [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) · [Spec: CreatePerIterationEnvironment](https://tc39.es/ecma262/#sec-createperiterationenvironment)

> [!interview] Чи можуть замикання спричинити витік пам'яті?
> level: senior · frequency: часто · id: jsd-05-int-03
>
> ---
>
> Самі по собі — ні: оточення збирається GC, щойно недосяжне жодне замикання. Витік виникає, коли замикання **лишається досяжним** довше, ніж потрібно: не знятий слухач подій, не очищений `setInterval`, підписка без відписки, необмежений кеш. У V8 є ще нюанс: замикання одного scope ділять один контекст, тож велика змінна, потрібна одному замиканню, живе, поки живе будь-яке з них. Лікування — знімати слухачі (`AbortController`), чистити таймери, обмежувати кеші (LRU, `WeakMap` для ключів-об'єктів), обнуляти великі змінні.
>
> 📚 [[JavaScript - 05. Замикання#🗑️ Замикання і пам'ять|Розділ: замикання і пам'ять]] · [MDN: Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management) · [Vyacheslav Egorov: Grokking V8 closures](https://mrale.ph/blog/2012-09-23-grokking-v8-closures-for-fun.html)

## 🔗 Зв'язки

- [[JavaScript - 04. Scope, hoisting і TDZ]] — замикання — прямий наслідок лексичного scope: `[[Environment]]` і є «місцем, де функцію написали».
- [[JavaScript - 06. this]] — `this` **не** замикається звичайними функціями, але замикається стрілковими — ще один вид «лексичного захоплення».
- [[JavaScript - 07. Прототипи та класи]] — `#private` поля класів — альтернатива приватному стану через замикання, зі своїми плюсами (спільні методи в прототипі).
- [[JavaScript - 13. Пам'ять і збирач сміття]] — коли саме оточення замикання стає сміттям.
- [[JavaScript - 14. Debounce, throttle та async-патерни]] — практичні утиліти, побудовані на таймері в замиканні.

## ⚡ Фішки

> [!reel] 🎒 Кожна функція в JS — замикання
> Навіть функція верхнього рівня має `[[Environment]]` — глобальне оточення. Просто ми помічаємо замикання, лише коли функція переживає виклик, у якому народилась.

> [!reel] 🔁 for (let …) створює нову змінну на кожну ітерацію
> Специфікація копіює `i` у свіже оточення перед кожним кроком. Тому стрілки в циклі з `let` бачать 0, 1, 2, а з `var` — одну спільну змінну.

> [!reel] 🧪 Замикання — це не знімок
> Функція бачить змінну, а не її старе значення.
>
> ```js
> let x = 1;
> const getX = () => x;
> x = 2;
> getX(); // → 2
> ```

> [!reel] 🏢 Module pattern старший за модулі
> До ES2015 бібліотеки (jQuery, Lodash) загортали весь код в IIFE, щоб приховати змінні й не засмічувати `window`. ES-модулі просто зробили цей scope автоматичним.

> [!reel] 🧠 V8 замикає лише те, що треба
> Рушій аналізує, які змінні реально використовуються вкладеними функціями, і тримає в контексті тільки їх. Решта живе на стеку й зникає після виклику. Тож замикання не тягне «все оточення» — лише потрібне.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке замикання простими словами?
> *дуже часто · теорія* · `jsd-05-001`
>
> Функція, яка має доступ до змінних зовнішньої функції навіть після того, як та завершилась. Технічно — функція + посилання на лексичне оточення, у якому її створили.
>
> 📚 [[JavaScript - 05. Замикання#🔬 Як це працює насправді|Розділ: замикання]] · [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) · [javascript.info: Variable scope, closure](https://javascript.info/closure)

> [!question]- Чому два лічильники з однієї фабрики незалежні?
> *часто · код* · `jsd-05-002`
>
> Кожен виклик фабрики створює **нове** оточення з власними змінними. Повернута функція замикає саме своє оточення, тому лічильники не впливають один на одного.
>
> 📚 [[JavaScript - 05. Замикання#🔢 Лічильники й приватний стан|Розділ: лічильники й приватний стан]] · [javascript.info: Variable scope, closure](https://javascript.info/closure) · [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)

> [!question]- Як зробити приватну змінну без класів?
> *часто · практика* · `jsd-05-003`
>
> Оголосити її всередині функції і повернути методи, які з нею працюють. Ззовні до змінної немає жодного шляху, крім цих методів.
>
> ```js
> function wallet() {
>   let balance = 0;
>   return { deposit: (x) => (balance += x), get: () => balance };
> }
> ```
>
> 📚 [[JavaScript - 05. Замикання#🔢 Лічильники й приватний стан|Розділ: приватний стан]] · [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) · [patterns.dev: Module Pattern](https://www.patterns.dev/vanilla/module-pattern)

### 🟡 Middle

> [!question]- Що таке `[[Environment]]`?
> *іноді · теорія* · `jsd-05-004`
>
> Внутрішній слот кожного об'єкта функції, який при **створенні** функції отримує посилання на поточне лексичне оточення. При виклику функції її нове оточення отримує `outer = [[Environment]]`. Це і є механізм замикань і лексичного scope.
>
> 📚 [[JavaScript - 05. Замикання#🔬 Як це працює насправді|Розділ: lexical environment]] · [Spec: Environment Records](https://tc39.es/ecma262/#sec-environment-records) · [javascript.info: Variable scope, closure](https://javascript.info/closure)

> [!question]- Чим відрізняється поведінка `var` і `let` у циклі з замиканнями?
> *дуже часто · порівняння* · `jsd-05-005`
>
> `var` — одна змінна на всю функцію, усі замикання бачать її фінальне значення. `let` у заголовку `for` — нове оточення на кожну ітерацію з копією значення, тож кожне замикання має свою змінну.
>
> 📚 [[JavaScript - 05. Замикання#🔁 Цикли: var проти let|Розділ: цикли і замикання]] · [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) · [Spec: CreatePerIterationEnvironment](https://tc39.es/ecma262/#sec-createperiterationenvironment)

> [!question]- Чому замикання бачить нове значення змінної, змінене після його створення?
> *часто · теорія* · `jsd-05-006`
>
> Бо замикання тримає посилання на **оточення** (environment record), а не копію значень. Читання змінної — це щоразу пошук у цьому оточенні, тож видно актуальний стан.
>
> 📚 [[JavaScript - 05. Замикання#🔬 Як це працює насправді|Розділ: lexical environment]] · [javascript.info: Variable scope, closure](https://javascript.info/closure) · [Spec: Environment Records](https://tc39.es/ecma262/#sec-environment-records)

> [!question]- Що таке stale closure і як її уникнути в React?
> *часто · практика* · `jsd-05-007`
>
> Callback, що замкнув значення з попереднього рендеру й не бачить нового стану (наприклад, інтервал з `[]` у залежностях). Рішення: functional update `setX((prev) => …)`, правильні залежності ефекту або `useRef` для мутабельного значення.
>
> 📚 [[JavaScript - 05. Замикання#⚠️ Пастки|Розділ: stale closure]] · [React: useState](https://react.dev/reference/react/useState) · [React: Removing Effect Dependencies](https://react.dev/learn/removing-effect-dependencies)

### 🔴 Senior

> [!question]- Як працює мемоізація через замикання і які в неї ризики?
> *іноді · практика* · `jsd-05-008`
>
> Кеш (`Map`) створюється в оточенні функції-обгортки й живе, поки жива обгортка. Ризики: необмежений ріст пам'яті (потрібен LRU або TTL), утримання об'єктів-ключів (`WeakMap` вирішує, але працює лише для об'єктів), неправильні ключі (`JSON.stringify` плутає `undefined`/`null`, порядок ключів), мемоізація нечистих функцій.
>
> 📚 [[JavaScript - 05. Замикання#🧠 Практичні патерни: once, фабрики, мемоізація|Розділ: мемоізація]] · [javascript.info: Decorators and forwarding, call/apply](https://javascript.info/call-apply-decorators) · [MDN: WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)

> [!question]- Чому одне замикання може тримати в пам'яті дані, які воно не використовує (V8)?
> *рідко · теорія* · `jsd-05-009`
>
> V8 зберігає змінні, використані хоча б одним вкладеним замиканням, в одному спільному об'єкті-контексті для всього scope. Якщо замикання A використовує `bigData`, а замикання B — ні, B все одно посилається на той самий контекст, тож `bigData` живе, поки живе B. Рішення — обнулити змінну (`bigData = null`) або винести роботу з нею в окрему функцію.
>
> 📚 [[JavaScript - 05. Замикання#🗑️ Замикання і пам'ять|Розділ: замикання і пам'ять]] · [Vyacheslav Egorov: Grokking V8 closures](https://mrale.ph/blog/2012-09-23-grokking-v8-closures-for-fun.html) · [Chrome DevTools: Heap snapshots](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots)

## 🛠️ Практика

> [!task] Реалізуй `once`
> level: junior · difficulty: easy · id: jsd-05-task-01 · tags: closures
>
> Напиши `once(fn)`: повертає обгортку, яка викликає `fn` лише першого разу (з переданими аргументами й `this`), а наступні виклики повертають збережений результат.
>
> ```js
> const init = once((x) => { console.log('init'); return x * 2; });
> init(5); // виведе 'init', поверне 10
> init(7); // нічого не виведе, поверне 10
> ```
>
> ```js starter
> function once(fn) {
>   // твій код
> }
> ```
>
> ```js tests
> test('викликає fn лише першого разу', () => {
>   const spy = vi.fn((x) => x * 2)
>   const init = once(spy)
>   init(5)
>   init(7)
>   init(9)
>   expect(spy).toHaveBeenCalledTimes(1)
>   expect(spy).toHaveBeenCalledWith(5)
> })
>
> test('наступні виклики повертають збережений результат', () => {
>   const init = once((x) => x * 2)
>   expect(init(5)).toBe(10)
>   expect(init(7)).toBe(10)
> })
>
> test('не викликає fn вдруге, навіть якщо вона повернула undefined', () => {
>   const spy = vi.fn(() => undefined)
>   const run = once(spy)
>   run()
>   run()
>   expect(spy).toHaveBeenCalledTimes(1)
> })
>
> test('передає this викликача', () => {
>   const obj = { name: 'Ann', greet: once(function () { return this.name }) }
>   expect(obj.greet()).toBe('Ann')
> })
>
> test('кожна обгортка має власний стан', () => {
>   const a = once(() => 'a')
>   const b = once(() => 'b')
>   expect(a()).toBe('a')
>   expect(b()).toBe('b')
> })
> ```
>
> > [!hint]- Підказка 1
> > Де зберегти результат, щоб він пережив виклик обгортки?
>
> > [!hint]- Підказка 2
> > Окремий прапорець `called` надійніший за перевірку `result === undefined` — подумай, чому.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function once(fn) {
> >   let called = false;
> >   let result;
> >   return function (...args) {
> >     if (!called) {
> >       called = true;
> >       result = fn.apply(this, args);
> >     }
> >     return result;
> >   };
> > }
> > ```
> >
> > `called` і `result` живуть в оточенні виклику `once` і спільні для всіх викликів обгортки. Прапорець потрібен, бо `fn` може законно повернути `undefined`. `function` замість стрілки — щоб передати `this` викликача (див. [[JavaScript - 06. this]]).

> [!task] Поясни своїми словами, що таке замикання
> level: middle · difficulty: medium · id: jsd-05-task-02 · tags: feynman, closures
>
> Поясни джуну, який знає лише змінні й функції, що таке замикання. Пояснення має відповісти на три питання: (1) як функція «пам'ятає» змінні після завершення зовнішньої функції; (2) чому це не копія значень; (3) коли ця пам'ять звільняється.
>
> > [!hint]- Підказка 1
> > Почни з того, що відбувається при **створенні** функції, а не при її виклику.
>
> > [!hint]- Підказка 2
> > Аналогія з рюкзаком або ключем від кімнати добре відповідає на всі три питання.
>
> > [!solution]- Еталонне пояснення
> > Коли JS виконує функцію, він створює для неї «кімнату» зі змінними. Зазвичай після завершення функції кімнату прибирають. Але якщо всередині кімнати створили іншу функцію, ця нова функція отримує при народженні **ключ від кімнати**, де народилась (у специфікації — слот `[[Environment]]`).
> >
> > (1) Тож коли ми повертаємо внутрішню функцію назовні й викликаємо її пізніше, вона відчиняє свою рідну кімнату ключем і знаходить там змінні. Кімнату не прибрали саме тому, що в когось є ключ.
> >
> > (2) У кімнаті лежать **самі змінні**, а не фотографії їхніх значень. Якщо хтось змінив змінну після створення функції, функція побачить нове значення; якщо функція змінить змінну — це побачать усі, хто має ключ від тієї ж кімнати.
> >
> > (3) Кімнату приберуть, коли зникнуть усі функції з ключами від неї — тобто на них більше ніхто не посилається. Тому забутий обробник події чи таймер може тримати кімнату (і все в ній) вічно.

> [!task] Мемоізація для будь-якої кількості аргументів
> level: senior · difficulty: hard · id: jsd-05-task-03 · tags: closures, memoization, map
>
> Напиши `memoize(fn)`, яка кешує результати для **будь-якої** кількості аргументів **будь-яких** типів. Об'єкти порівнюються за посиланням, `NaN` має кешуватися коректно. `JSON.stringify` використовувати не можна (він плутає `1` і `'1'` та не розрізняє різні об'єкти з однаковим вмістом).
>
> ```js
> let calls = 0;
> const add = memoize((x, y) => (calls++, x + y));
> add(1, 2); add(1, 2); add(2, 1);
> calls; // → 2
> ```
>
> ```js starter
> function memoize(fn) {
>   // твій код
> }
> ```
>
> ```js tests
> test('кешує за набором аргументів з урахуванням порядку', () => {
>   const spy = vi.fn((x, y) => x + y)
>   const add = memoize(spy)
>   expect(add(1, 2)).toBe(3)
>   expect(add(1, 2)).toBe(3)
>   expect(add(2, 1)).toBe(3)
>   expect(spy).toHaveBeenCalledTimes(2)
> })
>
> test('розрізняє 1 і "1"', () => {
>   const spy = vi.fn((x) => typeof x)
>   const kind = memoize(spy)
>   expect(kind(1)).toBe('number')
>   expect(kind('1')).toBe('string')
>   expect(spy).toHaveBeenCalledTimes(2)
> })
>
> test('коректно кешує NaN', () => {
>   const spy = vi.fn((x) => x)
>   const id = memoize(spy)
>   id(NaN)
>   id(NaN)
>   expect(spy).toHaveBeenCalledTimes(1)
> })
>
> test('обʼєкти порівнюються за посиланням', () => {
>   const spy = vi.fn((o) => o.v)
>   const read = memoize(spy)
>   const obj = { v: 1 }
>   read(obj)
>   read(obj)
>   read({ v: 1 })
>   expect(spy).toHaveBeenCalledTimes(2)
> })
>
> test('різна кількість аргументів — різні ключі, нуль аргументів теж кешується', () => {
>   const spy = vi.fn((...args) => args.length)
>   const count = memoize(spy)
>   expect(count()).toBe(0)
>   expect(count()).toBe(0)
>   expect(count(1)).toBe(1)
>   expect(count(1, undefined)).toBe(2)
>   expect(spy).toHaveBeenCalledTimes(3)
> })
> ```
>
> > [!hint]- Підказка 1
> > Один `Map` з ключем-рядком не підходить. А якщо кожен аргумент — це рівень вкладеності?
>
> > [!hint]- Підказка 2
> > Дерево (trie) з `Map`: перший аргумент → `Map` другого рівня → … Результат зберігай у вузлі під спеціальним ключем, який не може збігтися з аргументом.
>
> > [!hint]- Підказка 3
> > `Map` використовує SameValueZero — `NaN` знаходиться як ключ «безкоштовно». Унікальний ключ для результату — `Symbol`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function memoize(fn) {
> >   const root = new Map();
> >   const RESULT = Symbol('result');
> >   return function (...args) {
> >     let node = root;
> >     for (const arg of args) {
> >       if (!node.has(arg)) node.set(arg, new Map());
> >       node = node.get(arg);
> >     }
> >     if (!node.has(RESULT)) node.set(RESULT, fn.apply(this, args));
> >     return node.get(RESULT);
> >   };
> > }
> > ```
> >
> > `root` живе в замиканні й накопичує дерево між викликами. `Map` порівнює ключі через SameValueZero: об'єкти — за посиланням, `NaN` дорівнює `NaN`, `1` і `'1'` різні. `Symbol` гарантує, що жоден аргумент не перезапише результат. Обмеження: кеш росте без меж і тримає об'єкти-аргументи — у продакшні додають LRU або `WeakMap` на рівнях з об'єктами.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Variable scope, closure](https://javascript.info/closure) — найкраще пояснення замикань через lexical environment.
- 🟡 [MDN — Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) — довідник з прикладами: приватні методи, цикли, продуктивність.
- 🟡 [YDKJS — Scope & Closures](https://github.com/getify/You-Dont-Know-JS/tree/2nd-ed/scope-closures) — глибоко про замикання і модульний патерн.
- 🟡 [React — Removing Effect Dependencies](https://react.dev/learn/removing-effect-dependencies) — stale closures у `useEffect` і як їх уникнути.
- 🔴 [ECMAScript — Environment Records](https://tc39.es/ecma262/#sec-environment-records) — першоджерело: Environment Records і посилання `outer`.
- 🔴 [ECMAScript — CreatePerIterationEnvironment](https://tc39.es/ecma262/#sec-createperiterationenvironment) — чому `for (let …)` створює нову змінну на ітерацію.
- 🔴 [Vyacheslav Egorov — Grokking V8 closures](https://mrale.ph/blog/2012-09-23-grokking-v8-closures-for-fun.html) — як V8 реалізує контексти замикань і чому вони утримують пам'ять.
- 🛠️ [Chrome DevTools — Heap snapshots](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots) — як знайти замикання, що тримає зайве, у heap snapshot.

> [!important] Підсумок
> - Кожна функція при створенні запам'ятовує лексичне оточення у слоті `[[Environment]]`; функція + це оточення = замикання.
> - Замикання тримає **змінні**, а не знімки значень: бачить і може змінювати актуальний стан.
> - Кожен виклик фабрики — нове оточення, тож замикання з різних викликів незалежні; методи з одного виклику — ділять стан.
> - `for (let …)` створює нове оточення на кожну ітерацію; `var` — одну змінну на всю функцію.
> - Оточення живе, поки досяжне хоч одне замикання: знімай слухачі, чисти таймери, обмежуй кеші.
