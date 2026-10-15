---
title: Прототипи та класи
order: 7
level: middle
tags: [prototypes, classes, inheritance, oop, new]
prerequisites:
  - "[[JavaScript - 03. Значення та посилання]]"
  - "[[JavaScript - 06. this]]"
estimatedMinutes: 45
id: jsd-ch-07
icon: "🧱"
---

# Прототипи та класи

> [!success] 🎯 Після цього розділу ти зможеш
> - пояснити різницю між `[[Prototype]]`, `__proto__` і властивістю `prototype` функції — без плутанини;
> - пройти prototype chain вручну для будь-якого доступу до властивості, включно із записом (shadowing);
> - описати покроково, що робить `new`, і реалізувати його самостійно;
> - показати, у що «розгортається» `class`, `extends` і `super`, і назвати, чим клас **відрізняється** від функції-конструктора;
> - використати `#private` поля і `static` члени та пояснити, чим вони кращі за конвенцію `_private`.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: middle · type: output · id: jsd-07-quiz-01
>
> ```js
> function Dog(name) {
>   this.name = name;
> }
> Dog.prototype.speak = function () {
>   return `${this.name}: woof`;
> };
> const rex = new Dog('Rex');
> Dog.prototype.speak = function () {
>   return `${this.name}: WOOF`;
> };
> console.log(rex.speak(), rex.hasOwnProperty('speak'));
> ```
>
> **Відповідь:** `Rex: WOOF false`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Метод `speak` не копіюється в `rex` при створенні — у `rex` взагалі немає власного `speak`. Об'єкт лише має **посилання** на `Dog.prototype` і шукає там метод **у момент виклику**. Ми замінили метод у прототипі — і `rex` одразу «бачить» нову версію.

## 🧒 Простими словами

Уяви, що ти питаєш у молодшого брата, як зварити борщ. Він не знає — питає маму. Мама не знає — питає бабусю. Бабуся знає — і відповідь повертається до тебе. Ніхто не переписував рецепт собі в зошит: кожен просто **знає, кого спитати далі**. Це і є **prototype chain**. А якщо брат запише свою версію рецепта у власний зошит — наступного разу він відповість сам, і до бабусі ніхто не дійде (shadowing). Якщо ж бабуся оновить рецепт — усі, хто не має своєї версії, одразу отримають новий.

## 🔬 Як це працює насправді

### 🔗 `[[Prototype]]`, `__proto__` і `prototype` — три різні речі

У JS немає «класів» у класичному розумінні — є **об'єкти, що делегують іншим об'єктам**. Три терміни, які постійно плутають:

| Що | Де живе | Що означає |
|---|---|---|
| **`[[Prototype]]`** | внутрішній слот **кожного** об'єкта | посилання на об'єкт-прототип (або `null`) — «кого питати далі» |
| **`__proto__`** | getter/setter у `Object.prototype` | застарілий (Annex B) спосіб прочитати/записати `[[Prototype]]`. Сучасно — `Object.getPrototypeOf` / `Object.setPrototypeOf` |
| **`F.prototype`** | звичайна властивість **функції** | об'єкт, який стане `[[Prototype]]` для екземплярів, створених через `new F()` |

```js
function Dog(name) { this.name = name; }
const rex = new Dog('Rex');

Object.getPrototypeOf(rex) === Dog.prototype; // → true
rex.__proto__ === Dog.prototype;              // → true (те саме, застарілим способом)
Dog.prototype.constructor === Dog;            // → true — зворотне посилання
rex.constructor === Dog;                      // → true, але це НЕ власна властивість rex
```

Ключова думка: **`rex.prototype` — `undefined`**. Властивість `prototype` мають лише функції, які можна викликати з `new` (звичайні `function` і класи). У стрілкових функцій і методів її немає.

> [!figure] devtools-console
> scenario: object-inspect
>
> Розгорни об’єкт у консолі — і побачиш прихований `[[Prototype]]`: саме там, а не в самому об’єкті, живуть `hasOwnProperty` і `toString`.

> [!quiz] Перевір себе: оберіть правдиві твердження
> level: middle · type: multi · id: jsd-07-quiz-02
> - [x] `Object.getPrototypeOf(rex) === Dog.prototype`
> - [ ] `rex.prototype === Dog.prototype`
> - [x] `[[Prototype]]` є в кожного об'єкта (може бути `null`)
> - [ ] Стрілкові функції мають властивість `prototype`
> - [x] `__proto__` — це accessor, успадкований з `Object.prototype`
>
> **Пояснення:** `prototype` — властивість функції-конструктора, а не екземпляра. У `rex` її немає. `__proto__` працює лише тому, що `rex` успадковує getter з `Object.prototype`, — в об'єкта з `Object.create(null)` його не буде.

### 🔍 Пошук по ланцюжку (lookup)

**Читання** властивості `obj.prop`:

1. Є **власна** (own) властивість `prop` в `obj`? → повернути.
2. Ні → перейти до `[[Prototype]]` і повторити.
3. Дійшли до `null` → `undefined`.

```text
rex ──[[Prototype]]──► Dog.prototype ──► Object.prototype ──► null
{ name }               { speak,          { toString, hasOwnProperty,
                         constructor }     valueOf, ... }
```

> [!viz] prototype-chain
> scenario: lookup

Саме тому `rex.toString()` працює, хоча ніхто не писав `toString` для собак. Масиви так само: `[]` → `Array.prototype` (тут `map`, `filter`, `push`) → `Object.prototype` → `null`.

**Запис** `obj.prop = value` працює **інакше**: ланцюжок не змінюється — створюється або оновлюється **власна** властивість `obj`, яка **затінює** (shadowing) властивість прототипу. Два винятки: якщо в ланцюжку є **setter** для `prop` — викликається він; якщо там **non-writable** властивість — запис мовчки ігнорується (у strict mode — `TypeError`).

```js
const base = { count: 0 };
const child = Object.create(base);
child.count++;            // читання з base (0), запис — у child!
console.log(child.count, base.count);   // → 1 0
console.log(Object.hasOwn(child, 'count')); // → true
```

Як відрізнити власні властивості від успадкованих:

```js
'toString' in {};               // → true  — `in` дивиться весь ланцюжок
Object.hasOwn({}, 'toString');  // → false — лише власні
for (const k in child) {}       // ⚠️ for...in обходить і успадковані enumerable-властивості
Object.keys(child);             // → ['count'] — лише власні enumerable
```

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-07-quiz-03
>
> ```js
> const proto = { tags: [], level: 1 };
> const a = Object.create(proto);
> const b = Object.create(proto);
> a.tags.push('x');
> a.level = 2;
> console.log(b.tags.length, b.level);
> ```
>
> **Відповідь:** `1 1`
>
> **Пояснення:** `a.tags.push` — це **читання** `tags` (знайдено в прототипі) і мутація спільного масиву, тож `b` теж бачить `'x'`. А `a.level = 2` — **запис**, він створив власну властивість у `a`, не зачепивши прототип. Мораль: не клади мутабельні дані в прототип.

### 🏗️ Object.create і функції-конструктори

**`Object.create(proto)`** — найпряміший спосіб створити об'єкт із заданим `[[Prototype]]`:

```js
const animal = {
  describe() { return `${this.name} is an animal`; },
};
const cat = Object.create(animal);
cat.name = 'Tom';
cat.describe(); // → 'Tom is an animal' — this === cat (implicit binding)

const dict = Object.create(null); // об'єкт без прототипу — «чистий словник»
'toString' in dict;               // → false — жодних успадкованих ключів
```

**Функція-конструктор** — патерн до ES2015: дані — у `this` (на кожен екземпляр), методи — у `F.prototype` (один на всіх, економія пам'яті).

```js
function User(name) {
  this.name = name;             // власна властивість кожного екземпляра
}
User.prototype.hi = function () { // одна функція для всіх екземплярів
  return `Hi, ${this.name}`;
};
const u1 = new User('Ann');
const u2 = new User('Bob');
u1.hi === u2.hi; // → true — та сама функція з прототипу
```

> [!quiz] Перевір себе: заповни пропуски у функції-конструкторі
> level: junior · type: fill · id: jsd-07-quiz-07 · bank: __proto__, constructor, self
>
> ```js fill
> function User(name) {
>   [[this]].name = name
> }
> User.[[prototype]].hi = function () {
>   return 'Hi, ' + this.name
> }
> const ann = [[new]] User('Ann')
> Object.getPrototypeOf(ann) === User.[[prototype]] // → true
> ```
>
> **Пояснення:** дані кладуться в `this` (власні для кожного екземпляра), методи — у `User.prototype` (один на всіх). `new` створює об'єкт, чий `[[Prototype]]` — саме `User.prototype`. `__proto__` — це «погляд з боку дитини» (`ann.__proto__`), а не властивість конструктора.

### 🆕 Що робить `new` — крок за кроком

`new F(...args)` (для звичайної функції, спрощено):

1. **Створити** новий порожній об'єкт.
2. **Прив'язати** його `[[Prototype]]` до `F.prototype` (якщо `F.prototype` не об'єкт — до `Object.prototype`).
3. **Викликати** `F` з `this` = новий об'єкт і переданими аргументами.
4. **Повернути**: якщо `F` повернула **об'єкт** (або функцію) — його; інакше (примітив чи нічого) — новий об'єкт.

```js
function A() { this.x = 1; return { x: 2 }; } // повертає об'єкт — він і буде результатом
function B() { this.x = 1; return 42; }       // примітив ігнорується
new A().x; // → 2
new B().x; // → 1
```

Для класів кроки ті самі, з поправками: похідний клас (`extends`) не створює об'єкт сам — це робить базовий конструктор під час `super()` (див. нижче).

`instanceof` — дзеркало кроку 2: `obj instanceof F` перевіряє, чи є `F.prototype` **десь у ланцюжку** `obj`. (Це можна перевизначити через `Symbol.hasInstance`.)

> [!quiz] Перевір себе: у якому порядку `new` виконує кроки?
> level: middle · id: jsd-07-quiz-04
> - [x] Створити об'єкт → прив'язати `[[Prototype]]` до `F.prototype` → викликати `F` з `this` = об'єкт → повернути об'єкт (якщо `F` не повернула інший об'єкт)
> - [ ] Викликати `F` → скопіювати методи з `F.prototype` в результат → повернути
> - [ ] Створити об'єкт → скопіювати в нього всі методи `F.prototype` → викликати `F`
> - [ ] Викликати `F` з `this` = `F.prototype` → повернути `F.prototype`
>
> **Пояснення:** методи ніколи не копіюються — новий об'єкт лише отримує посилання на прототип. Саме тому зміна `Dog.prototype.speak` з `🤔 Передбач` видна вже створеним об'єктам.

### 🍬 `class` — синтаксичний цукор (але не лише)

`class` будує ту саму прототипну конструкцію: конструктор + методи в `prototype`.

```js
class User {
  constructor(name) { this.name = name; }
  hi() { return `Hi, ${this.name}`; }
}
typeof User;                           // → 'function'
Object.getOwnPropertyNames(User.prototype); // → ['constructor', 'hi']
```

> [!viz] prototype-chain
> scenario: class-sugar

Але це **не 100% цукор** — клас має гарантії, яких немає у функції-конструктора:

| | `function User` | `class User` |
|---|---|---|
| Виклик без `new` | працює (і `this` — `undefined`/`globalThis`) | `TypeError: Class constructor … cannot be invoked without 'new'` |
| Режим | залежить від файлу | **завжди strict** |
| Методи в `for...in` | enumerable (видно) | **non-enumerable** |
| Hoisting | повністю hoisted | **TDZ**, як `let` |
| `super`, `#private`, `static {}` | немає | є |

**`extends` і `super`** будують **два** ланцюжки одночасно:

```js
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} makes a sound`; }
  static create(name) { return new this(name); }
}
class Dog extends Animal {
  speak() { return super.speak() + ' (woof)'; }
}

new Dog('Rex').speak(); // → 'Rex makes a sound (woof)'
Object.getPrototypeOf(Dog.prototype) === Animal.prototype; // → true — для екземплярів
Object.getPrototypeOf(Dog) === Animal;                     // → true — для static
Dog.create('Max') instanceof Dog;                          // → true — static успадкований, this === Dog
```

Правила `super`:

- У конструкторі похідного класу `super(...)` **обов'язковий** і має бути викликаний **до** першого звернення до `this`, інакше `ReferenceError`. Причина: об'єкт створює **базовий** конструктор, до `super()` `this` просто ще не існує.
- Якщо конструктор не написано, неявно додається `constructor(...args) { super(...args); }`.
- `super.method()` шукає метод у прототипі **батьківського класу** (через внутрішній `[[HomeObject]]` методу) і викликає з поточним `this`.

> [!quiz] Перевір себе: що станеться?
> level: middle · id: jsd-07-quiz-05
>
> ```js
> class Base { constructor() { this.ready = true; } }
> class Child extends Base {
>   constructor() {
>     this.extra = 1;
>     super();
>   }
> }
> new Child();
> ```
>
> - [ ] Створиться об'єкт `{ extra: 1, ready: true }`
> - [ ] Створиться об'єкт `{ ready: true }`, `extra` загубиться
> - [x] `ReferenceError`: звернення до `this` до виклику `super()`
> - [ ] `SyntaxError` на етапі парсингу
>
> **Пояснення:** у похідному класі `this` ініціалізується лише результатом `super()`. До того він у стані, схожому на TDZ. Це помилка виконання, а не парсингу.

> [!quiz] Перевір себе: склади похідний клас з власним конструктором
> level: middle · type: order · id: jsd-07-quiz-08
>
> ```js order
> class Animal {
>   constructor(name) {
>     this.name = name
>   }
> }
> class Dog extends Animal {
>   constructor(name) {
>     super(name)
>     this.sound = 'woof'
>   }
> }
>     Animal.call(this, name) // ✗
> ```
>
> **Пояснення:** у похідному класі `super(name)` має йти **до** будь-якого `this` — саме базовий конструктор створює об'єкт. `Animal.call(this, …)` — прийом епохи функцій-конструкторів; клас без `new` викликати не можна (`TypeError`).

### 🔐 `#private` поля і `static`

**`#private`** поля — справжня приватність на рівні мови (не конвенція `_name`):

- доступні лише **всередині тіла класу**, де оголошені — навіть підкласи їх не бачать (`SyntaxError` при спробі);
- не видно в `Object.keys`, `JSON.stringify`, `for...in`, Proxy їх не перехоплює;
- звернення до `#x` в об'єкта, що не має цього поля, кидає `TypeError`;
- `#x in obj` — безпечна перевірка «чи цей об'єкт створений моїм класом» (*brand check*).

```js
class Counter {
  #count = 0;
  inc() { return ++this.#count; }
  static isCounter(obj) { return #count in obj; }
}
const c = new Counter();
c.inc();
c.inc();            // → 2
Object.keys(c);     // → []
JSON.stringify(c);  // → '{}'
Counter.isCounter(c);  // → true
Counter.isCounter({}); // → false
// c.#count;        // SyntaxError поза класом
```

**`static`** — члени самого класу (конструктора), а не екземплярів: фабрики, кеші, утиліти. Бувають `static` методи, поля, `static #private` і блоки ініціалізації `static { … }`.

```js
class Config {
  static #instance = null;
  static get() {
    return (Config.#instance ??= new Config());
  }
}
Config.get() === Config.get(); // → true — singleton
```

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-07-quiz-06
>
> ```js
> class Wallet {
>   #balance = 100;
>   owner = 'ann';
>   static currency = 'UAH';
> }
> const w = new Wallet();
> console.log(Object.keys(w).length, w.currency, Wallet.currency);
> ```
>
> **Відповідь:** `1 undefined UAH`
>
> **Пояснення:** `#balance` — приватне поле, у `Object.keys` не потрапляє, тож власна видима властивість лише `owner`. `static currency` належить самому класу `Wallet`, а не екземплярам і не `Wallet.prototype`, тому `w.currency` — `undefined`.

## ⚠️ Пастки

> [!pitfall] Мутабельні дані в прототипі
> Масив чи об'єкт у прототипі — один на всі екземпляри. Мутація через одного видна всім.
>
> ```js
> function Team() {}
> Team.prototype.members = [];
> const t1 = new Team();
> const t2 = new Team();
> t1.members.push('ann');
> t2.members; // → ['ann'] 😱 — дані тримай у конструкторі (this.members = [])
> ```

> [!pitfall] Заміна `prototype` цілком губить `constructor`
> Присвоєння нового об'єкта в `F.prototype` викидає автоматичне `constructor`.
>
> ```js
> function Car() {}
> Car.prototype = { drive() {} };
> new Car().constructor === Car;    // → false (тепер Object)
> // ✅ Car.prototype.drive = ... або додай constructor: Car вручну
> ```

> [!pitfall] `Object.setPrototypeOf` на гарячому шляху
> Зміна `[[Prototype]]` існуючого об'єкта ламає оптимізації рушія (hidden classes, inline caches) для цього об'єкта й коду, що його використовує. Задавай прототип при створенні: `Object.create(proto)` або `class … extends`.
>
> ```js
> const obj = {};
> Object.setPrototypeOf(obj, proto); // ⚠️ повільно
> const better = Object.create(proto);
> ```

> [!pitfall] Метод класу як callback
> Методи живуть у прототипі й отримують `this` від виклику — передані як callback, вони його гублять. Детально — [[JavaScript - 06. this]].
>
> ```js
> button.addEventListener('click', counter.inc); // ❌ this — button
> button.addEventListener('click', () => counter.inc()); // ✅
> ```

## 🎤 На співбесіді

> [!interview] Що таке прототипне наслідування?
> level: middle · frequency: дуже часто · id: jsd-07-int-01
>
> ---
>
> Кожен об'єкт має внутрішнє посилання `[[Prototype]]` на інший об'єкт або `null`. Якщо властивості немає в самому об'єкті, рушій шукає її в прототипі, потім у прототипі прототипу — до `null`. Методи не копіюються, а **делегуються**: тисяча екземплярів ділять одну функцію з прототипу, а зміна прототипу видна всім одразу. Запис же створює власну властивість, яка затінює прототипну. `class` і `extends` — зручний синтаксис над тим самим механізмом, з додатковими гарантіями (strict mode, обов'язковий `new`, `super`, `#private`).
>
> 📚 [[JavaScript - 07. Прототипи та класи#🔍 Пошук по ланцюжку (lookup)|Розділ: prototype chain]] · [MDN: Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain) · [javascript.info: Prototypal inheritance](https://javascript.info/prototype-inheritance)

> [!interview] Чим відрізняються `__proto__` і `prototype`?
> level: middle · frequency: часто · id: jsd-07-int-02
>
> ---
>
> `prototype` — звичайна властивість функції-конструктора (чи класу): об'єкт, який стане прототипом екземплярів, створених через `new`. `__proto__` — успадкований з `Object.prototype` getter/setter, що дає доступ до `[[Prototype]]` **конкретного** об'єкта. Отже, `new Dog().__proto__ === Dog.prototype`. У екземпляра немає `prototype`, а `__proto__` вважається застарілим — сучасно використовують `Object.getPrototypeOf` / `Object.create`.
>
> 📚 [[JavaScript - 07. Прототипи та класи#🔬 Як це працює насправді|Розділ: прототипи]] · [MDN: Object.prototype.\_\_proto\_\_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto) · [javascript.info: F.prototype](https://javascript.info/function-prototype)

> [!interview] Що відбувається при виклику `new`?
> level: middle · frequency: часто · id: jsd-07-int-03
>
> ---
>
> Чотири кроки: створюється новий об'єкт; його `[[Prototype]]` вказує на `F.prototype`; `F` викликається з `this`, що дорівнює цьому об'єкту; якщо `F` явно повернула об'єкт — результатом буде він, інакше — створений об'єкт. У похідних класах об'єкт створює базовий конструктор через `super()`, тому `this` до `super()` недоступний.
>
> 📚 [[JavaScript - 07. Прототипи та класи#🆕 Що робить new — крок за кроком|Розділ: що робить new]] · [MDN: new](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) · [javascript.info: Constructor, operator "new"](https://javascript.info/constructor-new)

## 🔗 Зв'язки

- [[JavaScript - 06. this]] — методи з прототипу отримують `this` від виклику; `new` — четверте правило прив'язки.
- [[JavaScript - 05. Замикання]] — альтернатива `#private`: приватний стан через замикання (але тоді методи не діляться через прототип).
- [[JavaScript - 03. Значення та посилання]] — прототип — це посилання, тому мутабельний масив у прототипі спільний для всіх.
- [[JavaScript - 02. Типи та приведення типів]] — `toString` і `valueOf`, які викликає ToPrimitive, знаходяться саме через prototype chain.
- [[JavaScript - 11. Ітератори та генератори]] — `Symbol.iterator` у прототипі робить екземпляри класу ітерованими.

## ⚡ Фішки

> [!reel] 🧬 Методи не копіюються — їх позичають
> Змінив метод у `Dog.prototype` — і всі вже створені собаки одразу «вивчили» новий трюк. Ніякого копіювання при `new`, лише посилання.

> [!reel] 🕳️ Object.create(null) — об'єкт без минулого
> У такого об'єкта немає `toString`, `hasOwnProperty`, навіть `__proto__`. Ідеальний словник: ключ `'constructor'` чи `'__proto__'` не зламає логіку.
>
> ```js
> const d = Object.create(null);
> 'toString' in d // → false
> ```

> [!reel] 🍬 class — не зовсім цукор
> Функцію-конструктор можна викликати без `new`, а клас — ні. Клас завжди strict, його методи не видно в `for...in`, і в нього є TDZ. Механізм той самий, гарантії — інші.

> [!reel] 🔒 #private не бачать навіть діти
> Підклас не може звернутися до `#field` батька — це `SyntaxError` ще на етапі парсингу. Справжня інкапсуляція, а не конвенція з `_`.

> [!reel] 🐔 Function — екземпляр Object, а Object — екземпляр Function
> `Object instanceof Function` — `true` (Object — функція). `Function instanceof Object` — теж `true`. Курка і яйце прототипного світу.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке prototype chain?
> *дуже часто · теорія* · `jsd-07-001`
>
> Ланцюжок об'єктів, пов'язаних посиланнями `[[Prototype]]`. При читанні властивості рушій шукає її в об'єкті, потім у його прототипі і так далі до `null`. Наприклад: `[]` → `Array.prototype` → `Object.prototype` → `null`.
>
> 📚 [[JavaScript - 07. Прототипи та класи#🔍 Пошук по ланцюжку (lookup)|Розділ: prototype chain]] · [MDN: Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain) · [Spec: OrdinaryGet](https://tc39.es/ecma262/#sec-ordinaryget)

> [!question]- Чим `Object.hasOwn(obj, key)` відрізняється від `key in obj`?
> *часто · порівняння* · `jsd-07-002`
>
> `hasOwn` перевіряє лише **власні** властивості об'єкта. `in` — увесь prototype chain. `'toString' in {}` — `true`, `Object.hasOwn({}, 'toString')` — `false`.
>
> 📚 [[JavaScript - 07. Прототипи та класи#🔍 Пошук по ланцюжку (lookup)|Розділ: пошук по ланцюжку]] · [MDN: Object.hasOwn()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn) · [MDN: in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in)

> [!question]- Чому методи кладуть у `prototype`, а не в конструктор?
> *часто · теорія* · `jsd-07-003`
>
> Метод у `prototype` існує в одному екземплярі й ділиться всіма об'єктами через делегування. Метод, створений у конструкторі (`this.fn = function…`), — окрема функція для кожного об'єкта, що марнує пам'ять. Дані ж навпаки — у конструкторі, щоб не були спільними.
>
> 📚 [[JavaScript - 07. Прототипи та класи#🏗️ Object.create і функції-конструктори|Розділ: функції-конструктори]] · [MDN: Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain) · [javascript.info: F.prototype](https://javascript.info/function-prototype)

### 🟡 Middle

> [!question]- Чим `__proto__` відрізняється від `prototype`?
> *дуже часто · порівняння* · `jsd-07-004`
>
> `F.prototype` — властивість функції: об'єкт-прототип для майбутніх екземплярів `new F()`. `obj.__proto__` — застарілий accessor до `[[Prototype]]` конкретного об'єкта. Зв'язок: `new F().__proto__ === F.prototype`.
>
> 📚 [[JavaScript - 07. Прототипи та класи#🔬 Як це працює насправді|Розділ: прототипи]] · [MDN: Object.prototype.\_\_proto\_\_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto) · [javascript.info: Prototypal inheritance](https://javascript.info/prototype-inheritance)

> [!question]- Що відбувається при записі властивості, яка є в прототипі?
> *іноді · код* · `jsd-07-005`
>
> Зазвичай створюється **власна** властивість об'єкта, що затінює прототипну; прототип не змінюється. Винятки: якщо в ланцюжку є setter — викликається він; якщо властивість у прототипі non-writable — запис ігнорується (strict — `TypeError`).
>
> 📚 [[JavaScript - 07. Прототипи та класи#🔍 Пошук по ланцюжку (lookup)|Розділ: запис і shadowing]] · [javascript.info: Prototypal inheritance](https://javascript.info/prototype-inheritance) · [Spec: OrdinarySet](https://tc39.es/ecma262/#sec-ordinaryset)

> [!question]- Чому в похідному класі не можна використати `this` до `super()`?
> *часто · теорія* · `jsd-07-006`
>
> У похідному класі об'єкт створює не він сам, а **базовий** конструктор під час `super()`. До цього `this` не ініціалізований, і звернення кидає `ReferenceError`. Так гарантується, що базова частина об'єкта (включно з вбудованими класами на кшталт `Array`, `Error`) створена першою.
>
> 📚 [[JavaScript - 07. Прототипи та класи#🍬 class — синтаксичний цукор (але не лише)|Розділ: класи]] · [MDN: super](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super) · [javascript.info: Class inheritance](https://javascript.info/class-inheritance)

> [!question]- Чим клас відрізняється від функції-конструктора?
> *часто · порівняння* · `jsd-07-007`
>
> Клас не можна викликати без `new` (`TypeError`), тіло завжди strict, методи non-enumerable, оголошення має TDZ, доступні `super`, `#private`, `static`-блоки, а похідні класи коректно наслідують вбудовані типи (`extends Array`). Механізм наслідування — той самий прототипний.
>
> 📚 [[JavaScript - 07. Прототипи та класи#🍬 class — синтаксичний цукор (але не лише)|Розділ: класи]] · [MDN: Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) · [javascript.info: Class basic syntax](https://javascript.info/class)

### 🔴 Senior

> [!question]- Які два ланцюжки будує `class B extends A`?
> *іноді · теорія* · `jsd-07-008`
>
> Для екземплярів: `B.prototype.[[Prototype]] = A.prototype` — так працюють успадковані методи. Для самих конструкторів: `B.[[Prototype]] = A` — так успадковуються `static`-методи (і `this` у них — `B`). Функції-конструктори до ES2015 зазвичай будували лише перший ланцюжок.
>
> 📚 [[JavaScript - 07. Прототипи та класи#🍬 class — синтаксичний цукор (але не лише)|Розділ: класи і extends]] · [MDN: extends](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends) · [javascript.info: Static properties and methods](https://javascript.info/static-properties-methods)

> [!question]- Як працює brand check `#field in obj` і навіщо він?
> *рідко · код* · `jsd-07-009`
>
> Повертає `true`, лише якщо `obj` був ініціалізований конструктором класу, що оголосив `#field`. На відміну від `instanceof`, не обманюється підміною прототипу чи `Symbol.hasInstance` і не кидає помилку. Корисно в статичних методах на кшталт `equals(other)` перед зверненням до `other.#field`.
>
> 📚 [[JavaScript - 07. Прототипи та класи#🔬 Як це працює насправді|Розділ: приватні поля і static]] · [MDN: Private elements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements) · [Spec: Private Names](https://tc39.es/ecma262/#sec-private-names)

## 🛠️ Практика

> [!task] Намалюй ланцюжок
> level: middle · difficulty: easy · id: jsd-07-task-01 · tags: prototypes
>
> Для коду нижче намалюй prototype chain екземпляра `admin` до `null` і дай відповіді на питання.
>
> ```js
> class User { hi() { return 'hi'; } }
> class Admin extends User { ban() {} }
> const admin = new Admin();
> // 1) Object.hasOwn(admin, 'hi')
> // 2) 'hi' in admin
> // 3) admin instanceof User
> // 4) Object.getPrototypeOf(Admin) === User
> ```
>
> Запиши ланцюжок у масив `chain` — **самі об'єкти-прототипи** по порядку від найближчого (без `null`), а відповіді 1–4 — boolean-літералами в масив `answers`.
>
> ```js starter
> class User { hi() { return 'hi'; } }
> class Admin extends User { ban() {} }
> const admin = new Admin();
>
> const chain = [
>   // твій код: прототипи admin по порядку
> ]
> const answers = [
>   // твій код: відповіді на 1), 2), 3), 4)
> ]
> ```
>
> ```js tests
> test('найближчий прототип — Admin.prototype', () => {
>   expect(chain[0]).toBe(Admin.prototype)
> })
>
> test('далі User.prototype і Object.prototype, після нього — null', () => {
>   expect(chain[1]).toBe(User.prototype)
>   expect(chain[2]).toBe(Object.prototype)
>   expect(chain).toHaveLength(3)
> })
>
> test('1–2: hi не власна, але знаходиться через ланцюжок', () => {
>   expect(answers[0]).toBe(false)
>   expect(answers[1]).toBe(true)
> })
>
> test('3–4: instanceof і звʼязок самих конструкторів', () => {
>   expect(answers[2]).toBe(true)
>   expect(answers[3]).toBe(true)
> })
> ```
>
> > [!hint]- Підказка 1
> > Методи класу лежать у його `prototype`, а не в екземплярі.
>
> > [!hint]- Підказка 2
> > `extends` пов'язує і `prototype`-об'єкти, і самі конструктори.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class User { hi() { return 'hi'; } }
> > class Admin extends User { ban() {} }
> > const admin = new Admin();
> >
> > const chain = [Admin.prototype, User.prototype, Object.prototype];
> > const answers = [false, true, true, true];
> > ```
> >
> > ```text
> > admin ──► Admin.prototype ──► User.prototype ──► Object.prototype ──► null
> > { }       { constructor, ban }  { constructor, hi }  { toString, ... }
> > ```
> >
> > 1) `false` — `hi` не власна. 2) `true` — знайдено в ланцюжку. 3) `true` — `User.prototype` є в ланцюжку `admin`. 4) `true` — `extends` також робить `User` прототипом `Admin` (для успадкування `static`).

> [!task] Поясни своїми словами різницю між `prototype` і `__proto__`
> level: middle · difficulty: medium · id: jsd-07-task-02 · tags: feynman, prototypes
>
> Поясни колезі, який вивчав Java, різницю між `Dog.prototype` і `rex.__proto__` (де `rex = new Dog()`). Поясни, чому `rex.prototype` — `undefined`, і чому зміна `Dog.prototype.bark` впливає на вже створеного `rex`. Без слова «клас» у поясненні механізму.
>
> > [!hint]- Підказка 1
> > Одне з них — «шаблон для майбутніх дітей», інше — «посилання на того, у кого я питаю».
>
> > [!hint]- Підказка 2
> > Згадай аналогію «брат → мама → бабуся».
>
> > [!solution]- Еталонне пояснення
> > У JS об'єкти не створюються «за кресленням» — кожен об'єкт просто має посилання на інший об'єкт, у якого він питає, якщо чогось не знає сам. Це посилання і є `rex.__proto__` (правильніше — внутрішній `[[Prototype]]`). Воно є в **кожного** об'єкта.
> >
> > `Dog.prototype` — це звичайна властивість функції `Dog`, у якій лежить об'єкт «для майбутніх дітей». Коли ми пишемо `new Dog()`, JS створює порожній об'єкт і робить так, щоб він питав саме в `Dog.prototype`. Тому `rex.__proto__ === Dog.prototype`: це один і той самий об'єкт, видимий з двох боків — з боку «батька» і з боку «дитини».
> >
> > `rex.prototype` — `undefined`, бо `rex` не функція й не збирається «народжувати» інших через `new`. А зміна `Dog.prototype.bark` видна `rex`, бо він не має своєї копії методу — він щоразу питає в `Dog.prototype`. На відміну від Java, де методи прибиті до класу на етапі компіляції, тут ланцюжок «живий» і перевіряється при кожному зверненні.

> [!task] Реалізуй `myNew` і `myInstanceOf`
> level: senior · difficulty: hard · id: jsd-07-task-03 · tags: prototypes, new, instanceof
>
> Реалізуй без `new`, `instanceof`, `class` і `__proto__`:
>
> 1. `myNew(Ctor, ...args)` — повторює алгоритм `new` для звичайних функцій (включно з випадком, коли конструктор повертає об'єкт).
> 2. `myInstanceOf(obj, Ctor)` — повторює `instanceof` (без `Symbol.hasInstance`).
>
> ```js
> function Dog(name) { this.name = name; }
> Dog.prototype.speak = function () { return this.name + ': woof'; };
> myNew(Dog, 'Rex').speak();        // → 'Rex: woof'
> myInstanceOf(myNew(Dog, 'Rex'), Dog); // → true
> myInstanceOf([], Object);         // → true
> myInstanceOf(1, Number);          // → false — примітив
> myInstanceOf(Object.create(null), Object); // → false
> ```
>
> ```js starter
> function myNew(Ctor, ...args) {
>   // твій код
> }
>
> function myInstanceOf(obj, Ctor) {
>   // твій код
> }
> ```
>
> ```js tests
> function Dog(name) { this.name = name }
> Dog.prototype.speak = function () { return this.name + ': woof' }
>
> test('myNew створює обʼєкт з прототипом Ctor.prototype', () => {
>   const rex = myNew(Dog, 'Rex')
>   expect(rex.speak()).toBe('Rex: woof')
>   expect(Object.getPrototypeOf(rex)).toBe(Dog.prototype)
>   expect(Object.hasOwn(rex, 'name')).toBe(true)
> })
>
> test('myNew повертає обʼєкт, який повернув конструктор, і ігнорує примітив', () => {
>   function A() { this.x = 1; return { x: 2 } }
>   function B() { this.x = 1; return 42 }
>   expect(myNew(A).x).toBe(2)
>   expect(myNew(B).x).toBe(1)
> })
>
> test('myNew падає на Object.prototype, якщо prototype не обʼєкт', () => {
>   function F() {}
>   F.prototype = 5
>   expect(Object.getPrototypeOf(myNew(F))).toBe(Object.prototype)
> })
>
> test('myInstanceOf шукає Ctor.prototype по всьому ланцюжку', () => {
>   expect(myInstanceOf(myNew(Dog, 'Rex'), Dog)).toBe(true)
>   expect(myInstanceOf([], Object)).toBe(true)
>   expect(myInstanceOf([], Dog)).toBe(false)
> })
>
> test('myInstanceOf: примітиви і обʼєкти без прототипу — false', () => {
>   expect(myInstanceOf(1, Number)).toBe(false)
>   expect(myInstanceOf(null, Object)).toBe(false)
>   expect(myInstanceOf(Object.create(null), Object)).toBe(false)
> })
>
> test('myNew не використовує new', () => {
>   expect(myNew.toString()).not.toMatch(/\bnew\s+\w/)
> })
> ```
>
> > [!hint]- Підказка 1
> > `Object.create(proto)` робить кроки 1–2 алгоритму `new` за один виклик.
>
> > [!hint]- Підказка 2
> > Для кроку 4 перевір, чи результат конструктора — об'єкт (не `null`) або функція.
>
> > [!hint]- Підказка 3
> > `instanceof` — це цикл по `Object.getPrototypeOf`, поки не знайдеш `Ctor.prototype` або не дійдеш до `null`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function myNew(Ctor, ...args) {
> >   const proto =
> >     typeof Ctor.prototype === 'object' && Ctor.prototype !== null
> >       ? Ctor.prototype
> >       : Object.prototype;
> >   const obj = Object.create(proto);           // кроки 1–2
> >   const result = Ctor.apply(obj, args);       // крок 3
> >   const isObject =
> >     (typeof result === 'object' && result !== null) || typeof result === 'function';
> >   return isObject ? result : obj;             // крок 4
> > }
> >
> > function myInstanceOf(obj, Ctor) {
> >   if ((typeof obj !== 'object' || obj === null) && typeof obj !== 'function') {
> >     return false; // примітиви ніколи не instanceof
> >   }
> >   let proto = Object.getPrototypeOf(obj);
> >   while (proto !== null) {
> >     if (proto === Ctor.prototype) return true;
> >     proto = Object.getPrototypeOf(proto);
> >   }
> >   return false;
> > }
> > ```
> >
> > `myNew` не підходить для класів (їх не можна викликати через `apply` без `new`) — для них у справжньому коді є `Reflect.construct`. Випадок `F.prototype = 5` обробляє fallback на `Object.prototype` — саме так робить і специфікація.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Prototypal inheritance](https://javascript.info/prototype-inheritance) — `[[Prototype]]`, `__proto__` і пошук властивостей.
- 🟢 [javascript.info — Class inheritance](https://javascript.info/class-inheritance) — `extends`, `super` і `[[HomeObject]]`.
- 🟡 [MDN — Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain) — ланцюжок прототипів, конструктори і продуктивність пошуку.
- 🟡 [MDN — Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) — усе про синтаксис класів: поля, статика, геттери.
- 🟡 [MDN — Private elements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements) — приватні поля, методи і brand check `#x in obj`.
- 🟡 [YDKJS — Objects & Classes](https://github.com/getify/You-Dont-Know-JS/tree/2nd-ed/objects-classes) — альтернативний погляд на «класи» в JS.
- 🔴 [ECMAScript — OrdinaryGet](https://tc39.es/ecma262/#sec-ordinaryget) — алгоритм читання властивості по ланцюжку.
- 🔴 [ECMAScript — Class Definitions](https://tc39.es/ecma262/#sec-class-definitions) — що насправді робить рушій, коли бачить `class`.

> [!important] Підсумок
> - Кожен об'єкт має `[[Prototype]]`; читання властивості йде по ланцюжку до `null`, запис — створює власну властивість (shadowing).
> - `F.prototype` — шаблон для екземплярів `new F()`; `obj.__proto__` (краще `Object.getPrototypeOf`) — посилання конкретного об'єкта. `new F().__proto__ === F.prototype`.
> - `new`: створити об'єкт → прив'язати до `F.prototype` → викликати `F` з `this` = об'єкт → повернути його (або об'єкт, який повернула `F`).
> - `class` — прототипи + гарантії: обов'язковий `new`, strict, non-enumerable методи, TDZ, `super` (до `this`!), два ланцюжки при `extends`.
> - `#private` — справжня приватність навіть від підкласів; `static` — члени самого конструктора, успадковуються через `extends`.
