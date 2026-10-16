---
title: Symbol, Proxy і Reflect
order: 20
level: senior
tags: [symbol, well-known-symbols, proxy, reflect, metaprogramming, reactivity]
prerequisites:
  - "[[JavaScript - 16. Обʼєкти глибоко]]"
  - "[[JavaScript - 11. Ітератори та генератори]]"
estimatedMinutes: 50
id: jsd-ch-20
icon: "🪄"
---

# Symbol, Proxy і Reflect

> [!success] 🎯 Після цього розділу ти зможеш
> - пояснити, чим `Symbol()` відрізняється від `Symbol.for()` і чому символьні ключі — не приватні;
> - налаштувати поведінку власних об'єктів через well-known symbols: `Symbol.iterator`, `asyncIterator`, `toPrimitive`, `toStringTag`, `hasInstance`;
> - написати `Proxy` з пастками `get`, `set`, `has`, `ownKeys`, `apply` і пояснити інваріанти, які рушій перевіряє;
> - пояснити, навіщо `Reflect` і аргумент `receiver`, і чому проксі ламається на `Map` та `#private` полях;
> - оцінити ціну проксі і побудувати на ньому валідацію, логування та міні-реактивність на кшталт Vue.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: senior · type: output · id: jsd-20-quiz-01
>
> ```js
> const id = Symbol('id');
> const user = { name: 'Ann', [id]: 42 };
> const proxy = new Proxy(user, {
>   get: (target, key) => (key in target ? target[key] : `немає ${String(key)}`),
> });
> console.log(Object.keys(user).length, JSON.stringify(user), proxy.age, proxy[id]);
> ```
>
> **Відповідь:** `1 {"name":"Ann"} немає age 42`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Символьні ключі не бачать `Object.keys` і `JSON.stringify`. Проксі перехоплює **кожне** читання властивості — і рядкові, і символьні ключі; для відсутньої `age` повертає рядок замість `undefined`.

## 🧒 Простими словами

**Symbol** — це бирка з унікальним серійним номером: навіть дві бирки з однаковим написом «id» — різні, і ніхто випадково не переплутає твою бирку з чужою. **Proxy** — секретар перед кабінетом об'єкта: кожен, хто хоче щось узяти, покласти чи подивитись, спершу йде до секретаря, а той вирішує — пропустити, змінити відповідь чи відмовити. **Reflect** — інструкція «як би це зробив сам об'єкт без секретаря»: секретар часто нею користується, щоб після перевірки виконати запит звичайним способом.

## 🔬 Як це працює насправді

### 🔣 Symbol і глобальний реєстр

`Symbol` — сьомий примітив (ES2015). Кожен виклик `Symbol(description)` створює **унікальне** значення; опис — лише підпис для налагодження.

```js
const a = Symbol('id');
const b = Symbol('id');
console.log(a === b, a.description, a.toString()); // → false 'id' 'Symbol(id)'
// `${a}` або a + '' → TypeError: Cannot convert a Symbol value to a string
```

Головне призначення — **ключі властивостей без конфліктів**. Бібліотека може додати до чужого об'єкта символьну властивість і бути певною, що не перетре чуже поле й що її не помітять «звичайні» обходи:

| Операція | Бачить символьні ключі? |
|---|---|
| `for…in`, `Object.keys/values/entries` | ❌ |
| `JSON.stringify` | ❌ |
| `Object.getOwnPropertySymbols`, `Reflect.ownKeys` | ✅ |
| `Object.assign`, spread `{ ...obj }` | ✅ — копіюються |

Тобто символи **приховані, але не приватні**: будь-хто може їх дістати через `Reflect.ownKeys`. Для справжньої приватності — `#private` поля або замикання.

**Глобальний реєстр.** `Symbol.for(key)` шукає символ за рядковим ключем у реєстрі, спільному для всього середовища, **включно з iframe та іншими realm-ами**, і створює його, якщо немає. `Symbol.keyFor(sym)` повертає ключ зареєстрованого символу.

```js
console.log(Symbol.for('app.id') === Symbol.for('app.id')); // → true — той самий символ
console.log(Symbol.keyFor(Symbol.for('app.id')));           // → 'app.id'
console.log(Symbol.keyFor(Symbol('local')));                // → undefined — не в реєстрі
console.log(Symbol.keyFor(Symbol.iterator));                // → undefined — well-known теж ні
```

Так React позначає свої елементи (`$$typeof: Symbol.for('react.element')`, у React 19 — `'react.transitional.element'`): позначку однаково розпізнає копія React з іншого бандла чи iframe, а JSON із сервера підробити її не може — у JSON немає символів. Зворотний бік: зареєстровані символи не можна робити ключами `WeakMap` — вони живуть вічно.

> [!quiz] Перевір себе: оберіть правдиві твердження
> level: middle · type: multi · id: jsd-20-quiz-02
> - [x] `Symbol('x') !== Symbol('x')`
> - [x] `Symbol.for('x') === Symbol.for('x')`
> - [ ] Символьні властивості неможливо прочитати ззовні — вони приватні
> - [x] Spread `{ ...obj }` копіює символьні властивості
> - [ ] `JSON.stringify` серіалізує символьні ключі як рядки
>
> **Пояснення:** `Reflect.ownKeys` і `Object.getOwnPropertySymbols` відкривають усі символьні ключі — це приховування від випадкового доступу, а не захист. `JSON.stringify` символьні ключі пропускає.

### 🧙 Well-known symbols

Специфікація визначає набір **well-known symbols** — «гачків», через які мова питає об'єкт, як з ним поводитися. Визначивши властивість з таким ключем, ти змінюєш поведінку вбудованих операцій.

| Символ | Яку операцію налаштовує |
|---|---|
| `Symbol.iterator` | `for…of`, spread, деструктуризація масиву, `Array.from` |
| `Symbol.asyncIterator` | `for await…of` |
| `Symbol.toPrimitive` | приведення до примітиву: `+obj`, `` `${obj}` ``, `obj + 1`, `==` |
| `Symbol.toStringTag` | `Object.prototype.toString.call(obj)` → `[object Tag]` |
| `Symbol.hasInstance` | оператор `instanceof` |
| `Symbol.dispose` / `asyncDispose` | `using` / `await using` (явне керування ресурсами) |
| також | `species`, `isConcatSpreadable`, `match`, `replace`, `split`, `unscopables` |

```js
const range = {
  from: 1, to: 3,
  *[Symbol.iterator]() { for (let i = this.from; i <= this.to; i++) yield i; },
};
console.log([...range]); // → [1, 2, 3] — генератор як реалізація протоколу ітерації
```

Протоколи ітерації (`Symbol.iterator`, `Symbol.asyncIterator`) детально розібрано в [[JavaScript - 11. Ітератори та генератори]].

**`Symbol.toPrimitive`** отримує **hint** — що саме хоче рушій: `'number'` (унарний `+`, порівняння `>`), `'string'` (шаблонний рядок, `String()`), `'default'` (бінарний `+`, `==`). Він має пріоритет над `valueOf`/`toString` (див. [[JavaScript - 02. Типи та приведення типів]]).

```js
const temp = {
  celsius: 20,
  [Symbol.toPrimitive](hint) {
    return hint === 'string' ? `${this.celsius}°C` : this.celsius;
  },
};
console.log(`${temp}`, temp + 5, temp * 2, temp > 10); // → '20°C' 25 40 true
```

> [!viz] coercion
> scenario: plus-operator

```js
class Even {
  static [Symbol.hasInstance](n) { return Number.isInteger(n) && n % 2 === 0; }
}
console.log(2 instanceof Even, 3 instanceof Even); // → true false

class Money { get [Symbol.toStringTag]() { return 'Money'; } }
console.log(Object.prototype.toString.call(new Money())); // → '[object Money]'
```

> [!quiz] Перевір себе: що виведе код?
> level: senior · type: output · id: jsd-20-quiz-03
>
> ```js
> const price = {
>   [Symbol.toPrimitive](hint) { return hint === 'number' ? 100 : hint === 'string' ? 'сто' : 'default'; },
> };
> console.log(+price, `${price}`, price + '', price * 1);
> ```
>
> **Відповідь:** `100 сто default 100`
>
> **Пояснення:** унарний `+` і `*` просять `'number'`, шаблонний рядок — `'string'`, а бінарний `+` не знає, рядок чи число потрібні, тож передає `'default'`.

### 🪞 Proxy і пастки

`new Proxy(target, handler)` створює об'єкт-обгортку. Кожна **внутрішня операція** над проксі (специфікація називає їх essential internal methods: `[[Get]]`, `[[Set]]`, `[[HasProperty]]`…) спершу шукає відповідну **пастку** (trap) у `handler`. Немає пастки — операція прозоро йде на `target`.

| Пастка | Що перехоплює |
|---|---|
| `get(target, key, receiver)` | читання `p.x`, `p[key]` |
| `set(target, key, value, receiver)` | запис `p.x = v` (повертає `true`/`false`) |
| `has(target, key)` | оператор `in` |
| `deleteProperty(target, key)` | `delete p.x` |
| `ownKeys(target)` | `Object.keys`, `Reflect.ownKeys`, `for…in` |
| `getOwnPropertyDescriptor`, `defineProperty` | читання й визначення дескрипторів |
| `getPrototypeOf`, `setPrototypeOf`, `isExtensible`, `preventExtensions` | робота з прототипом і розширюваністю |
| `apply(target, thisArg, args)` | виклик функції `p(...)` (лише якщо target — функція) |
| `construct(target, args, newTarget)` | `new p(...)` |

> [!diagram] user.age = 30: шлях запису через Proxy
> ```yaml
> layout: flow
> nodes:
>   - { id: code, label: "код", text: "user.age = 30", tone: blue }
>   - { id: proxy, label: "[[Set]] на proxy", text: "handler.set є?", tone: gray, icon: "px:mirror" }
>   - { id: trap, label: "пастка handler.set", code: "set(target, key, value, receiver) {\n  if (key === 'age' && !Number.isInteger(value)) throw new TypeError(…);\n  return Reflect.set(target, key, value, receiver);\n}", tone: violet }
>   - { id: target, label: "target", text: "{ }", tone: green }
> edges:
>   - { from: code, to: proxy, label: "запис" }
>   - { from: proxy, to: trap, label: "так" }
>   - { from: trap, to: target, label: "Reflect.set" }
> steps:
>   - { focus: code, note: "Записуємо user.age = 30. user — не звичайний обʼєкт, а Proxy над порожнім { }." }
>   - { move: { from: code, to: proxy, value: "age = 30" }, note: "Запис — це внутрішня операція [[Set]]. Рушій шукає пастку set у handler; якби її не було, запис пішов би прямо в target." }
>   - { move: { from: proxy, to: trap, value: "('age', 30)" }, line: "trap:1", note: "Пастка є — викликається set(target, 'age', 30, user)." }
>   - { line: "trap:2", note: "Перевірка: 30 — ціле число, тож помилки немає." }
>   - { move: { from: trap, to: target, value: "30" }, line: "trap:3", set: { target: "{ age: 30 }" }, note: "Reflect.set виконує стандартний запис у target і повертає true." }
>   - { set: { code: "user.age = 'тридцять'" }, line: "trap:2", focus: [code, trap], note: "А з 'тридцять' пастка кидає TypeError — запис до target так і не доходить." }
> ```

> [!viz] proxy-traps
> scenario: get-set

```js
const user = new Proxy({}, {
  set(target, key, value, receiver) {
    if (key === 'age' && !Number.isInteger(value)) throw new TypeError('age має бути цілим');
    return Reflect.set(target, key, value, receiver);
  },
});
user.age = 30;
try { user.age = 'тридцять'; } catch (e) { console.log(e.message); } // → 'age має бути цілим'

const hidden = new Proxy({ _secret: 1, ok: 2 }, {
  has: (t, k) => !String(k).startsWith('_') && k in t,
  ownKeys: (t) => Reflect.ownKeys(t).filter((k) => !String(k).startsWith('_')),
});
console.log('_secret' in hidden, Object.keys(hidden)); // → false ['ok']
```

Проксі **не є** своїм target-ом: `proxy !== target`, а зміни, зроблені напряму через `target`, проксі не перехопить. Проксі масиву лишається масивом для `Array.isArray`, проксі функції — функцією для `typeof`.

> [!quiz] Перевір себе: яка пастка спрацює?
> level: senior · type: multi · id: jsd-20-quiz-04
> - [x] `'x' in proxy` → `has`
> - [x] `Object.keys(proxy)` → `ownKeys` (і `getOwnPropertyDescriptor` для кожного ключа)
> - [ ] `proxy.x = 1` → `defineProperty`, і ніколи `set`
> - [x] `delete proxy.x` → `deleteProperty`
> - [x] `new proxy()` для проксі класу → `construct`
>
> **Пояснення:** присвоєння викликає `set`; якщо пастки `set` немає, стандартний `[[Set]]` на target у процесі може викликати `defineProperty`, але першим спрацьовує саме `set`. `Object.keys` спершу отримує список через `ownKeys`, а потім перевіряє enumerability кожного ключа через `getOwnPropertyDescriptor`.

> [!quiz] Склади проксі, що валідує `age`
> level: middle · type: order · id: jsd-20-quiz-08
>
> ```js order
> const user = new Proxy({}, {
>   set(target, key, value, receiver) {
>     if (key === 'age' && !Number.isInteger(value)) {
>       throw new TypeError('age має бути цілим')
>     }
>     return Reflect.set(target, key, value, receiver)
>   },
> })
>     target[key] = value // ✗
> ```
>
> **Пояснення:** пастка `set` перевіряє значення і передає запис далі через `Reflect.set` з `receiver` — так зберігаються setter-и й успадкування. Пряме `target[key] = value` нічого не повертає, а `set` мусить повернути `true`, інакше в strict mode буде `TypeError`.

### ⚖️ Інваріанти і межі проксі

Проксі не може брехати **будь-як**. Специфікація задає **інваріанти**: якщо результат пастки суперечить незмінним фактам про target, рушій кидає `TypeError`. Найважливіші:

- `get` для non-writable, non-configurable властивості має повернути **її справжнє** значення;
- `set` не може «успішно» змінити non-writable, non-configurable властивість; повернувши `false` у strict mode, викликає `TypeError`;
- `ownKeys` мусить включати всі non-configurable ключі, а для нерозширюваного target — рівно його ключі;
- `has` не може приховати non-configurable властивість.

```js
const frozen = Object.freeze({ x: 1 });
const liar = new Proxy(frozen, { get: () => 2 });
try { liar.x; } catch (e) { console.log(e.constructor.name); } // → TypeError — інваріант порушено
```

**Внутрішні слоти.** `Map`, `Set`, `Date`, `Promise` і класи з `#private` полями зберігають дані у внутрішніх слотах **самого** об'єкта. Метод, викликаний з `this === proxy`, шукає слот на проксі — і не знаходить:

```js
const map = new Proxy(new Map(), {});
try { map.set('a', 1); } catch (e) { console.log(e.message); }
// → 'Method Map.prototype.set called on incompatible receiver #<Map>'

class Counter { #n = 0; inc() { return ++this.#n; } }
try { new Proxy(new Counter(), {}).inc(); } catch (e) { console.log(e.constructor.name); } // → TypeError
```

Обхід — у пастці `get` прив'язувати методи до target: `typeof v === 'function' ? v.bind(target) : v`. Так роблять бібліотеки реактивності для колекцій.

**`Proxy.revocable`** повертає `{ proxy, revoke }`: після `revoke()` будь-яка операція над проксі кидає `TypeError` — зручно, щоб видати сторонньому коду тимчасовий доступ.

> [!quiz] Перевір себе: чому `new Proxy(new Map(), {}).get('a')` кидає TypeError?
> level: senior · id: jsd-20-quiz-05
> - [ ] Бо порожній handler забороняє всі операції
> - [x] Бо `Map.prototype.get` шукає внутрішній слот `[[MapData]]` на `this`, а `this` — проксі, у якого цього слоту немає
> - [ ] Бо проксі не можна створювати для вбудованих об'єктів
> - [ ] Бо `get` — зарезервоване ім'я пастки
>
> **Пояснення:** проксі перехоплює операції над властивостями, але не має внутрішніх слотів target-а. Методи `Map` перевіряють слот на `this` — і отримують проксі.

### 🔧 Reflect і receiver

`Reflect` — об'єкт з 13 функціями, **один в один** з пастками проксі: `Reflect.get`, `set`, `has`, `ownKeys`, `apply`, `construct`… Навіщо, якщо є `obj[key]` і `in`?

1. **Правильна передача за замовчуванням** у пастках: `Reflect.set(target, key, value, receiver)` робить рівно те, що зробив би рушій без проксі.
2. **Булеві результати замість винятків:** `Reflect.defineProperty` повертає `false`, де `Object.defineProperty` кидає `TypeError`.
3. **Функціональні форми операторів:** `Reflect.has(o, k)` замість `k in o`, `Reflect.construct(C, args, NewTarget)` замість `new` з довільним `new.target`.

Найтонше місце — **`receiver`**. Це об'єкт, з яким почалася операція, і він стає `this` для getter-ів і setter-ів. Якщо в пастці писати `target[key]`, getter виконається з `this === target` — **повз проксі**, і всі вкладені звернення не будуть перехоплені:

```js
const source = { name: 'Ann', get greet() { return `Hi, ${this.name}`; } };
const seen = [];
const bad = new Proxy(source, { get(t, k) { seen.push(k); return t[k]; } });
const good = new Proxy(source, { get(t, k, r) { seen.push(k); return Reflect.get(t, k, r); } });
bad.greet;
console.log(seen.join(',')); // → 'greet' — читання name пройшло повз проксі
seen.length = 0;
good.greet;
console.log(seen.join(',')); // → 'greet,name' — getter виконався з this === proxy
```

Для реактивності це критично: якщо `name` прочитано повз проксі, система не дізнається про залежність і не оновить UI. Те саме з успадкуванням: коли проксі стоїть у ланцюжку прототипів, `receiver` вказує на справжній об'єкт-нащадок.

> [!viz] prototype-chain
> scenario: lookup

> [!quiz] Перевір себе: чим `Reflect.defineProperty` відрізняється від `Object.defineProperty`?
> level: middle · id: jsd-20-quiz-06
> - [ ] Нічим, це аліас
> - [x] Повертає `false` замість `TypeError`, якщо властивість визначити неможливо
> - [ ] Працює лише всередині проксі
> - [ ] Не підтримує accessor-дескриптори
>
> **Пояснення:** `Reflect` повертає успіх операції булевим значенням — так зручно повернути результат прямо з пастки `defineProperty`, яка теж має повертати boolean.

> [!quiz] Заповни пропуски: пастка `get`, що не губить залежності
> level: senior · type: fill · id: jsd-20-quiz-09 · bank: target, this, Object
>
> ```js fill
> const tracked = new Proxy(source, {
>   get(target, key, [[receiver]]) {
>     track(key)
>     return [[Reflect]].get(target, key, [[receiver]])
>   },
> })
> ```
>
> **Пояснення:** `receiver` — це сам проксі (або нащадок у ланцюжку прототипів). Передаючи його в `Reflect.get`, ми робимо його `this` для getter-ів — тож `this.name` усередині getter-а знову пройде через пастку і залежність буде записана. `target[key]` виконав би getter повз проксі.

### 🛠️ Сценарії і ціна проксі

**Реактивність (Vue 3, MobX, Solid stores).** `get` записує, хто читає властивість (track), `set` повідомляє залежних (trigger). Спрощено:

```js
let activeEffect = null;
const deps = new Map(); // key → Set(effects)
function reactive(obj) {
  return new Proxy(obj, {
    get(t, k, r) {
      if (activeEffect) { if (!deps.has(k)) deps.set(k, new Set()); deps.get(k).add(activeEffect); }
      return Reflect.get(t, k, r);
    },
    set(t, k, v, r) {
      const ok = Reflect.set(t, k, v, r);
      deps.get(k)?.forEach((fn) => fn());
      return ok;
    },
  });
}
function effect(fn) { activeEffect = fn; fn(); activeEffect = null; }

const state = reactive({ count: 0 });
effect(() => console.log('render', state.count)); // → render 0
state.count++;                                     // → render 1
```

Справжній Vue використовує `WeakMap<target, Map<key, Set<effect>>>`, лінива глибока реактивність, батчинг оновлень — але ядро саме таке. Vue 2 робив те саме через `Object.defineProperty` на кожному полі й тому не бачив **нових** властивостей і змін індексів масиву — проксі це виправив.

**Від'ємні індекси масиву** (як у Python):

```js
const arr = new Proxy([10, 20, 30], {
  get(t, k, r) {
    if (typeof k === 'string' && /^-\d+$/.test(k)) k = String(t.length + Number(k));
    return Reflect.get(t, k, r);
  },
});
console.log(arr[-1], arr[0], arr.length); // → 30 10 3
```

Ще: **логування й трасування** (усі звернення до API), **значення за замовчуванням**, **read-only views** (`set`/`deleteProperty` кидають помилку), **моки в тестах**, **Immer** (чернетка-проксі записує зміни й будує новий іммутабельний стан).

**Ціна.** Кожна операція над проксі — виклик функції-пастки замість оптимізованого inline-кешу доступу до властивості. На простому читанні проксі легко буває в **десятки разів** повільніший за звичайний об'єкт (виміряй у своєму рушії). Тому проксі обгортають «межі» (стан, API), а не гарячі внутрішні цикли, і не загортають кожен елемент великого масиву без потреби. Деталі оптимізацій — [[JavaScript - 31. Продуктивність і V8]].

> [!quiz] Перевір себе: що виведе код?
> level: senior · type: output · id: jsd-20-quiz-07
>
> ```js
> const log = [];
> const api = new Proxy({ a: 1 }, {
>   get(t, k, r) { log.push(`get ${String(k)}`); return Reflect.get(t, k, r); },
>   has(t, k) { log.push(`has ${String(k)}`); return Reflect.has(t, k); },
> });
> if ('a' in api) api.a;
> api.b;
> console.log(log.join(' | '));
> ```
>
> **Відповідь:** `has a | get a | get b`
>
> **Пояснення:** оператор `in` викликає пастку `has`, читання — `get`, навіть для неіснуючої `b`. Проксі бачить кожну операцію в тому порядку, в якому код її виконує.

## ⚠️ Пастки

> [!pitfall] `target[key]` у пастці замість `Reflect.get`
> Getter-и виконуються з `this === target`, і вкладені читання проходять повз проксі. Реактивність не бачить залежностей, логер — звернень. Завжди передавай `receiver`: `Reflect.get(target, key, receiver)`.

> [!pitfall] Пастка `set` без `return true`
> Пастка має повернути boolean. Забутий `return` — це `undefined`, тобто «невдача», і в strict mode (модулі, класи) присвоєння кине `TypeError: 'set' on proxy: trap returned falsish`.
>
> ```js
> const p = new Proxy({}, { set(t, k, v) { t[k] = v; } }); // ❌ немає return
> // у модулі: p.x = 1 → TypeError
> ```

> [!pitfall] Символ у шаблонному рядку
> Символи не приводяться до рядка неявно: `` `key: ${sym}` `` і `'id: ' + sym` кидають `TypeError`. Використовуй `String(sym)` або `sym.description`. Особливо підступно в пастках проксі, де `key` може бути символом (`Symbol.iterator`, `Symbol.toPrimitive`) — логер з `` `get ${key}` `` впаде на першому `for…of`.

> [!pitfall] Проксі над `Map`, `Date` чи класом з `#private`
> Методи шукають внутрішні слоти на `this`, а там проксі — `TypeError: incompatible receiver`. Прив'язуй методи до target у пастці `get` або проксуй не сам об'єкт, а «фасад» з власними методами.

## 🎤 На співбесіді

> [!interview] Що таке Symbol і навіщо він потрібен?
> level: middle · frequency: часто · id: jsd-20-int-01
>
> ---
>
> Примітивний тип для унікальних ідентифікаторів: кожен `Symbol()` неповторний, опис — лише для налагодження. Застосування: (1) ключі властивостей без конфліктів імен — бібліотека додає метадані до чужого об'єкта, і вони не видні в `Object.keys`, `for…in` і `JSON.stringify` (але доступні через `Reflect.ownKeys` — це не приватність); (2) well-known symbols — гачки мови: `Symbol.iterator`, `asyncIterator`, `toPrimitive`, `toStringTag`, `hasInstance`; (3) `Symbol.for` — глобальний реєстр, спільний між realm-ами (так React позначає елементи). Символ не приводиться до рядка неявно.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect#🔣 Symbol і глобальний реєстр|Розділ: Symbol]] · [MDN: Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) · [Spec: Well-Known Symbols](https://tc39.es/ecma262/#sec-well-known-symbols)

> [!interview] Як працює Proxy і де його застосовують?
> level: senior · frequency: часто · id: jsd-20-int-02
>
> ---
>
> `new Proxy(target, handler)` перехоплює внутрішні операції над об'єктом — читання, запис, `in`, `delete`, перелік ключів, виклик, `new` — через 13 пасток; без пастки операція прозоро йде на target. Рушій перевіряє інваріанти (не можна «змінити» frozen-властивість чи приховати non-configurable ключ). Застосування: реактивність Vue 3 і MobX (`get` — track, `set` — trigger), валідація, логування, значення за замовчуванням, read-only views, Immer, моки. Обмеження: об'єкти з внутрішніми слотами (`Map`, `Date`, `#private`) потребують прив'язки методів, `proxy !== target`, і проксі помітно повільніший за звичайний доступ.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect#🪞 Proxy і пастки|Розділ: Proxy]] · [MDN: Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) · [javascript.info: Proxy and Reflect](https://javascript.info/proxy)

> [!interview] Навіщо Reflect, якщо є звичайні оператори?
> level: senior · frequency: іноді · id: jsd-20-int-03
>
> ---
>
> `Reflect` дає функції з тими самими іменами й сигнатурами, що й пастки проксі, тож у пастці найпростіше «виконати операцію як зазвичай». Головне — аргумент `receiver` у `Reflect.get/set`: getter-и й setter-и отримують правильний `this` (проксі чи нащадка), і вкладені звернення не обходять проксі. Крім того, `Reflect` повертає `true/false` замість винятків (`defineProperty`, `set`), дає функціональні форми операторів (`has`, `deleteProperty`) і `Reflect.construct` з довільним `newTarget`.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect#🔧 Reflect і receiver|Розділ: Reflect]] · [MDN: Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect) · [Spec: The Reflect Object](https://tc39.es/ecma262/#sec-reflection)

## 🔗 Зв'язки

- [[JavaScript - 11. Ітератори та генератори]] — `Symbol.iterator` і `Symbol.asyncIterator` — протоколи, які споживає `for…of`.
- [[JavaScript - 02. Типи та приведення типів]] — `Symbol.toPrimitive` перекриває `valueOf`/`toString` в абстрактній операції ToPrimitive.
- [[JavaScript - 16. Обʼєкти глибоко]] — дескриптори й `freeze` визначають, які інваріанти проксі перевіряє рушій.
- [[JavaScript - 07. Прототипи та класи]] — `receiver` і пошук по ланцюжку; `#private` і внутрішні слоти.
- [[JavaScript - 32. Патерни проєктування]] — Proxy як втілення патернів Proxy, Decorator і Observer.

## ⚡ Фішки

> [!reel] 🏷️ React позначає елементи символом
> Кожен React-елемент має `$$typeof` — символ з глобального реєстру (`Symbol.for('react.element')`, у React 19 — `'react.transitional.element'`). JSON із сервера не може містити символ, тож підробити елемент через XSS-ін'єкцію в дані не вийде.

> [!reel] 🪞 Vue 3 = Proxy, Vue 2 = defineProperty
> Vue 2 вішав getter/setter на кожне поле й не бачив нових властивостей та `arr[i] = x`. Vue 3 перейшов на Proxy — і перехоплює все, включно з додаванням і видаленням ключів.

> [!reel] 🐍 Від'ємні індекси за 5 рядків
> Proxy з пасткою `get` перетворює `arr[-1]` на `arr[arr.length - 1]`. Хоча для цього вже є `arr.at(-1)` — без проксі й без втрати швидкості.

> [!reel] ⚖️ Proxy не може брехати про frozen-поля
> Якщо властивість target-а non-writable і non-configurable, пастка `get` зобов'язана повернути справжнє значення. Інакше — `TypeError`: рушій перевіряє інваріанти.

> [!reel] 🧾 toStringTag керує [object …]
> `Object.prototype.toString.call(x)` читає `x[Symbol.toStringTag]`. Так `Map` показує `[object Map]`, а твій клас — що завгодно.
>
> ```js
> class Money { get [Symbol.toStringTag]() { return 'Money'; } }
> String(new Money()); // → '[object Money]'
> ```

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Чи дорівнюють один одному два `Symbol('id')`?
> *часто · теорія* · `jsd-20-001`
>
> Ні. Кожен виклик `Symbol()` створює унікальне значення, опис — лише підпис. Однакові символи за ключем дає лише глобальний реєстр: `Symbol.for('id') === Symbol.for('id')`.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect#🔣 Symbol і глобальний реєстр|Розділ: Symbol]] · [javascript.info: Symbol type](https://javascript.info/symbol)

> [!question]- Чи видно символьні ключі в `Object.keys` і `JSON.stringify`?
> *часто · теорія* · `jsd-20-002`
>
> Ні, як і в `for…in`. Їх показують `Object.getOwnPropertySymbols` і `Reflect.ownKeys`, а `Object.assign` і spread копіюють. Тож символи приховані, але не приватні.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect#🔣 Symbol і глобальний реєстр|Розділ: символьні ключі]] · [MDN: Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)

> [!question]- Як зробити власний об'єкт ітерабельним?
> *часто · код* · `jsd-20-003`
>
> Визначити метод `[Symbol.iterator]()`, що повертає ітератор; найпростіше — генератором: `*[Symbol.iterator]() { yield … }`. Тоді працюють `for…of`, spread і `Array.from`.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect#🧙 Well-known symbols|Розділ: well-known symbols]] · [MDN: Symbol.iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator)

### 🟡 Middle

> [!question]- Які hint-и отримує `Symbol.toPrimitive` і коли?
> *іноді · теорія* · `jsd-20-004`
>
> `'number'` — унарний `+`, арифметика (`*`, `-`), порівняння `<`/`>`; `'string'` — шаблонні рядки, `String(obj)`, ключ властивості; `'default'` — бінарний `+` і `==`. Метод має повернути примітив, інакше `TypeError`.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect#🧙 Well-known symbols|Розділ: toPrimitive]] · [MDN: Symbol.toPrimitive](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive)

> [!question]- Що станеться, якщо в об'єкта-handler немає потрібної пастки?
> *часто · теорія* · `jsd-20-005`
>
> Операція прозоро виконується на target, ніби проксі немає. Порожній handler `{}` дає «прозору» обгортку (з тією різницею, що `proxy !== target`).
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect#🪞 Proxy і пастки|Розділ: пастки]] · [MDN: Proxy() constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy)

> [!question]- Що має повертати пастка `set` і що буде, якщо забути `return`?
> *іноді · код* · `jsd-20-006`
>
> Boolean: `true` — успіх. `undefined` трактується як невдача, і в strict mode присвоєння кидає `TypeError: trap returned falsish`. Найпростіше — `return Reflect.set(target, key, value, receiver)`.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect#⚖️ Інваріанти і межі проксі|Розділ: інваріанти]] · [MDN: handler.set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/set)

### 🔴 Senior

> [!question]- Навіщо аргумент `receiver` у пастках `get`/`set`?
> *іноді · теорія* · `jsd-20-007`
>
> `receiver` — об'єкт, з якого почалася операція (зазвичай сам проксі або нащадок у ланцюжку прототипів). `Reflect.get(t, k, receiver)` виконує getter з `this === receiver`, тож вкладені звернення теж проходять через проксі. `t[k]` виконав би getter з `this === target` — повз проксі.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect#🔧 Reflect і receiver|Розділ: receiver]] · [MDN: handler.get](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/get)

> [!question]- Які інваріанти проксі перевіряє рушій? Наведіть два.
> *рідко · теорія* · `jsd-20-008`
>
> Пастка `get` для non-writable non-configurable властивості має повернути її справжнє значення; `ownKeys` мусить містити всі non-configurable ключі (а для нерозширюваного target — рівно його ключі); `has` не може приховати non-configurable властивість; `set` не може вдати успіх для frozen-поля. Порушення — `TypeError`.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect#⚖️ Інваріанти і межі проксі|Розділ: інваріанти]] · [Spec: Invariants of the Essential Internal Methods](https://tc39.es/ecma262/#sec-invariants-of-the-essential-internal-methods)

> [!question]- Як Vue 3 відстежує залежності через Proxy?
> *іноді · практика* · `jsd-20-009`
>
> `reactive(obj)` повертає проксі. Пастка `get` під час виконання ефекту (рендеру, `computed`) записує пару «target.key → ефект» у `WeakMap<target, Map<key, Set<effect>>>` — це track. Пастка `set` після `Reflect.set` знаходить ефекти для ключа і ставить їх у чергу — trigger. Глибока реактивність лінива: вкладений об'єкт загортається в проксі при першому читанні.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect#🛠️ Сценарії і ціна проксі|Розділ: реактивність]] · [Vue: Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)

## 🛠️ Практика

> [!task] Об'єкт зі значенням за замовчуванням
> level: junior · difficulty: easy · id: jsd-20-task-01 · tags: proxy
>
> Напиши `withDefault(obj, fallback)`: проксі, що повертає `fallback` для відсутніх властивостей, але не ламає `in`, `Object.keys` і символьні ключі (`Symbol.iterator` та інші мають працювати як зазвичай).
>
> ```js
> const counts = withDefault({ apples: 2 }, 0);
> counts.apples;        // → 2
> counts.pears;         // → 0
> 'pears' in counts;    // → false
> counts.pears += 1;    // → 1 — тепер властивість існує
> ```
>
> ```js starter
> function withDefault(obj, fallback) {
>   return new Proxy(obj, {
>     // твій код
>   })
> }
> ```
>
> ```js tests
> test('існуючі властивості читаються як є', () => {
>   expect(withDefault({ apples: 2 }, 0).apples).toBe(2)
> })
>
> test('відсутні властивості дають fallback', () => {
>   const counts = withDefault({ apples: 2 }, 0)
>   expect(counts.pears).toBe(0)
>   counts.pears += 1
>   expect(counts.pears).toBe(1)
> })
>
> test('in і Object.keys показують реальний вміст', () => {
>   const counts = withDefault({ apples: 2 }, 0)
>   expect('pears' in counts).toBe(false)
>   expect(Object.keys(counts)).toEqual(['apples'])
> })
>
> test('успадковані методи не замінюються на fallback', () => {
>   const o = withDefault({}, 'x')
>   expect(typeof o.toString).toBe('function')
> })
>
> test('символьні ключі не перехоплюються', () => {
>   const arr = withDefault([1, 2], 0)
>   expect([...arr]).toEqual([1, 2])
>   expect(arr[Symbol('нема')]).toBeUndefined()
> })
> ```
>
> > [!hint]- Підказка 1
> > Потрібна лише пастка `get`. Як перевірити, що властивість є — включно з успадкованими?
>
> > [!hint]- Підказка 2
> > Символьні ключі пропускай без змін — інакше `[...counts]` чи `` `${counts}` `` поведуться дивно.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function withDefault(obj, fallback) {
> >   return new Proxy(obj, {
> >     get(target, key, receiver) {
> >       if (typeof key === 'symbol' || Reflect.has(target, key)) {
> >         return Reflect.get(target, key, receiver);
> >       }
> >       return fallback;
> >     },
> >   });
> > }
> > ```
> >
> > `Reflect.has` бачить і успадковані властивості (як `toString`), тож методи прототипу не замінюються на `fallback`. `in` і `Object.keys` не перехоплюються — вони чесно показують реальний вміст. Обережно з об'єктами як `fallback`: усі відсутні ключі повертатимуть **той самий** об'єкт.

> [!task] Поясни своїми словами: що таке Proxy і Reflect
> level: middle · difficulty: medium · id: jsd-20-task-02 · tags: feynman, proxy, reflect
>
> Поясни джуну, як працює `Proxy`, навіщо в пастках використовують `Reflect` і чому Vue 3 «бачить», що компонент прочитав `state.count`. Використай аналогію і згадай `receiver`. До 7 речень.
>
> > [!hint]- Підказка 1
> > Секретар перед кабінетом: що він робить з кожним відвідувачем?
>
> > [!hint]- Підказка 2
> > Що буде, якщо секретар сам зайде в кабінет «з чорного ходу» замість передати запит офіційно?
>
> > [!solution]- Еталонне пояснення
> > Proxy — це секретар, якого ставлять перед об'єктом: кожна дія з об'єктом — прочитати властивість, записати, перевірити `in`, видалити — спершу потрапляє до секретаря, тобто до функції-пастки. Секретар може записати відвідувача в журнал, відмовити (кинути помилку) або підмінити відповідь, а якщо пастки немає — просто пропускає запит до об'єкта. Reflect — це «офіційна процедура»: `Reflect.get` чи `Reflect.set` виконують операцію рівно так, як зробив би сам рушій, тому після перевірки секретар зазвичай передає запит через Reflect. Важливо передати `receiver` — того, хто насправді прийшов: тоді getter усередині об'єкта, звертаючись до `this.name`, знову пройде через секретаря, а не через чорний хід. Vue 3 загортає стан у такий проксі: коли компонент під час рендеру читає `state.count`, пастка `get` записує «цей компонент залежить від count». Коли хтось змінює `state.count`, пастка `set` знаходить усіх, хто його читав, і просить їх перемалюватися.

> [!task] Глибокий read-only проксі з журналом спроб запису
> level: senior · difficulty: hard · id: jsd-20-task-03 · tags: proxy, reflect, immutability
>
> Напиши `readonly(obj, onViolation)`: повертає проксі, через який **не можна** змінити ні сам об'єкт, ні вкладені об'єкти (на будь-якій глибині). Кожна спроба `set`, `delete` чи `defineProperty` викликає `onViolation(path, operation)` і повертає `false`. Один і той самий вкладений об'єкт має щоразу повертатися **тим самим** проксі.
>
> ```js
> const log = [];
> const cfg = readonly({ db: { host: 'a' }, list: [1] }, (path, op) => log.push(`${op} ${path}`));
> cfg.db.host = 'b';             // у sloppy mode тихо, у strict — TypeError
> delete cfg.list[0];
> console.log(cfg.db.host, cfg.db === cfg.db, log);
> // → 'a' true ['set db.host', 'deleteProperty list.0']
> ```
>
> ```js starter
> function readonly(root, onViolation) {
>   // твій код
> }
> ```
>
> ```js tests
> test('запис і видалення блокуються та журналюються з шляхом', () => {
>   const log = []
>   const cfg = readonly({ db: { host: 'a' }, list: [1] }, (path, op) => log.push(`${op} ${path}`))
>   expect(Reflect.set(cfg.db, 'host', 'b')).toBe(false)
>   expect(Reflect.deleteProperty(cfg.list, '0')).toBe(false)
>   expect(cfg.db.host).toBe('a')
>   expect(cfg.list[0]).toBe(1)
>   expect(log).toEqual(['set db.host', 'deleteProperty list.0'])
> })
>
> test('у strict mode присвоєння кидає TypeError', () => {
>   const cfg = readonly({ a: 1 }, () => {})
>   expect(() => { cfg.a = 2 }).toThrow(TypeError)
>   expect(cfg.a).toBe(1)
> })
>
> test('defineProperty теж заборонено', () => {
>   const ops = []
>   const cfg = readonly({ a: {} }, (path, op) => ops.push(op))
>   expect(Reflect.defineProperty(cfg.a, 'x', { value: 1 })).toBe(false)
>   expect(ops).toEqual(['defineProperty'])
> })
>
> test('той самий вкладений об\'єкт — той самий проксі', () => {
>   const cfg = readonly({ db: { host: 'a' } }, () => {})
>   expect(cfg.db === cfg.db).toBe(true)
> })
>
> test('frozen-властивості не ламають інваріант get', () => {
>   const inner = {}
>   const obj = {}
>   Object.defineProperty(obj, 'locked', { value: inner, writable: false, configurable: false })
>   const cfg = readonly(obj, () => {})
>   expect(cfg.locked).toBe(inner)
> })
> ```
>
> > [!hint]- Підказка 1
> > У пастці `get` загортай результат у новий проксі, якщо це об'єкт. Шлях передавай далі.
>
> > [!hint]- Підказка 2
> > Для стабільної ідентичності кешуй проксі у `WeakMap<target, proxy>`.
>
> > [!hint]- Підказка 3
> > Обережно з інваріантами: якщо властивість target-а non-configurable і non-writable (frozen), `get` мусить повернути саме її значення, а не проксі.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function readonly(root, onViolation) {
> >   const cache = new WeakMap(); // target → proxy
> >   const wrap = (target, path) => {
> >     if (cache.has(target)) return cache.get(target);
> >     const deny = (op) => (t, key) => {
> >       onViolation([...path, String(key)].join('.'), op);
> >       return false;
> >     };
> >     const proxy = new Proxy(target, {
> >       get(t, key, receiver) {
> >         const value = Reflect.get(t, key, receiver);
> >         const desc = Reflect.getOwnPropertyDescriptor(t, key);
> >         const locked = desc && !desc.configurable && !desc.writable;
> >         if (value !== null && typeof value === 'object' && !locked) {
> >           return wrap(value, [...path, String(key)]);
> >         }
> >         return value;
> >       },
> >       set: deny('set'),
> >       deleteProperty: deny('deleteProperty'),
> >       defineProperty: deny('defineProperty'),
> >     });
> >     cache.set(target, proxy);
> >     return proxy;
> >   };
> >   return wrap(root, []);
> > }
> > ```
> >
> > `WeakMap` дає стабільну ідентичність (`cfg.db === cfg.db`) і не тримає об'єкти в пам'яті. Повернення `false` у strict mode перетворюється на `TypeError` — це бажана поведінка. Обмеження: шлях запам'ятовується за першим доступом — якщо той самий об'єкт досяжний двома шляхами, журнал покаже перший; методи `Map`/`Set` через такий проксі не працюватимуть без прив'язки до target.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Symbol type](https://javascript.info/symbol) — символи, реєстр і системні символи для старту.
- 🟢 [javascript.info — Proxy and Reflect](https://javascript.info/proxy) — усі пастки з прикладами, інваріанти й receiver.
- 🟡 [MDN — Meta programming](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Meta_programming) — огляд Proxy і Reflect як інструментів метапрограмування.
- 🟡 [MDN — Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) — довідник пасток і обмежень (внутрішні слоти, private).
- 🟡 [MDN — Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) — повний список well-known symbols.
- 🟡 [Vue — Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html) — як Vue 3 будує реактивність на Proxy.
- 🔴 [V8 — Optimizing ES2015 proxies](https://v8.dev/blog/optimizing-proxies) — як V8 прискорював проксі і чому вони все одно дорожчі.
- 🔴 [ECMAScript — Proxy Object Internal Methods](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots) — першоджерело: як кожна пастка викликається й перевіряється.
- 🔴 [ECMAScript — Invariants of the Essential Internal Methods](https://tc39.es/ecma262/#sec-invariants-of-the-essential-internal-methods) — точний список інваріантів.

> [!important] Підсумок
> - `Symbol()` — унікальний примітив для ключів без конфліктів; символьні ключі приховані від `keys`/`JSON`, але не приватні; `Symbol.for` — глобальний реєстр між realm-ами.
> - Well-known symbols — гачки мови: `iterator`, `asyncIterator`, `toPrimitive` (з hint-ами), `toStringTag`, `hasInstance`, `dispose`.
> - `Proxy` перехоплює 13 внутрішніх операцій; без пастки операція йде на target; інваріанти не дають брехати про незмінні властивості.
> - У пастках використовуй `Reflect` з `receiver` — інакше getter-и й вкладені звернення обходять проксі; `Map`, `Date` і `#private` потребують прив'язки методів.
> - Проксі — основа реактивності (Vue 3, MobX), валідації й логування, але помітно повільніший за звичайний доступ — став його на межах, а не в гарячих циклах.
