---
title: this, прототипи, класи та ООП
order: 3
tags: [this, prototypes, classes, oop, inheritance]
estimatedMinutes: 65
---

# JS Interview Q&A — 03. this, прототипи, класи та ООП

## 🟢 Junior

> [!question]- Від чого залежить значення `this` у звичайній функції?
> *дуже часто · теорія* · `js-03-001`
>
> `this` визначається не місцем оголошення, а **способом виклику** (call-site). Правила за пріоритетом, від найвищого:
>
> 1. `new Fn()` — `this` = новостворений об'єкт.
> 2. Explicit binding — `fn.call(obj)`, `fn.apply(obj)`, `fn.bind(obj)`.
> 3. Implicit binding — `obj.method()`: `this` = об'єкт перед крапкою.
> 4. Default binding — простий виклик `fn()`: `undefined` у strict mode (модулі, класи), `globalThis` у sloppy mode.
>
> Стрілкові функції в цих правилах не беруть участі: вони беруть `this` лексично з оточення.
>
> ```js
> 'use strict';
> function who() { return this?.name; }
> const a = { name: 'a', who };
> who();                   // undefined
> a.who();                 // 'a'
> who.call({ name: 'b' }); // 'b'
> ```
>
> 📚 [[JavaScript - 06. this#🎯 Головна ідея: this визначає виклик|Розділ: як визначається this]] · [MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) · [javascript.info: Object methods, "this"](https://javascript.info/object-methods)

> [!question]- Як стрілкова функція визначає `this`?
> *дуже часто · порівняння* · `js-03-002`
>
> Стрілкова функція не має власного `this` (а також `arguments`, `super`, `new.target`). `this` береться **лексично** — із зовнішньої області видимості, де стрілку створено. Тому `call`/`apply`/`bind` не можуть його змінити, а `new` на стрілці кидає `TypeError`.
>
> ```js
> const timer = {
>   seconds: 0,
>   start() {
>     setInterval(() => { this.seconds++; }, 1000); // this === timer
>   },
>   bad: () => this.seconds, // this з модуля/глобального scope, не timer
> };
> ```
>
> Стрілка ідеальна для callback-ів усередині методів і шкідлива як метод об'єктного літерала.
>
> **На співбесіді:** стрілка як class field (`handle = () => {}`) — навмисний патерн: ініціалізатор поля виконується з `this` = екземпляр, тож метод можна безпечно передавати як callback. Ціна — окрема функція на кожен екземпляр, а не одна на прототипі.
>
> 📚 [[JavaScript - 06. this#➡️ Стрілкові функції: this без правил|Розділ: стрілкові функції]] · [MDN: Arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) · [javascript.info: Arrow functions revisited](https://javascript.info/arrow-functions)

> [!question]- Яка різниця між `call`, `apply` та `bind`?
> *дуже часто · порівняння* · `js-03-003`
>
> `call` і `apply` одразу викликають функцію із заданим `this`; різниця лише в передачі аргументів — списком чи масивом (array-like). `bind` нічого не викликає, а повертає нову **bound function** із зафіксованим `this` і, опційно, частково застосованими аргументами.
>
> ```js
> function greet(greeting, mark) {
>   return `${greeting}, ${this.name}${mark}`;
> }
> const user = { name: 'Ann' };
> greet.call(user, 'Hi', '!');    // 'Hi, Ann!'
> greet.apply(user, ['Hi', '?']); // 'Hi, Ann?'
> const hi = greet.bind(user, 'Hi');
> hi('.');                        // 'Hi, Ann.'
> ```
>
> Сьогодні `apply` здебільшого замінює spread: `fn.call(ctx, ...args)`. У sloppy mode `null`/`undefined` як `thisArg` підміняються на `globalThis`, а примітиви обгортаються в об'єкти; у strict mode `this` передається як є.
>
> 📚 [[JavaScript - 06. this#3️⃣ Explicit binding: call, apply, bind|Розділ: call, apply і bind]] · [MDN: Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) · [javascript.info: Decorators and forwarding, call/apply](https://javascript.info/call-apply-decorators)

> [!question]- Що таке прототип і як працює prototype chain?
> *дуже часто · теорія* · `js-03-004`
>
> Кожен об'єкт має внутрішній слот `[[Prototype]]` — посилання на інший об'єкт або `null`. При читанні властивості рушій шукає її серед власних властивостей, потім у прототипі, потім у прототипі прототипу — аж до `null`. Це і є **prototype chain**. Запис зазвичай створює власну властивість і не змінює прототип (винятки — setter або non-writable властивість у ланцюжку).
>
> ```js
> const animal = { eats: true };
> const dog = Object.create(animal);
> dog.barks = true;
> dog.eats;                                           // true — з прототипу
> Object.hasOwn(dog, 'eats');                         // false
> Object.getPrototypeOf(animal) === Object.prototype; // true
> ```
>
> Методи масивів, `toString`, `hasOwnProperty` — усе це приходить із прототипів (`Array.prototype`, `Object.prototype`), а не зберігається в кожному об'єкті.
>
> 📚 [[JavaScript - 07. Прототипи та класи#🔍 Пошук по ланцюжку (lookup)|Розділ: prototype chain]] · [MDN: Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain) · [javascript.info: Prototypal inheritance](https://javascript.info/prototype-inheritance)

> [!question]- Як працює наслідування класів через `extends` і `super`?
> *часто · код* · `js-03-005`
>
> `extends` налаштовує два ланцюжки: `Child.prototype` → `Parent.prototype` (методи екземплярів) і `Child` → `Parent` (static-члени). У конструкторі похідного класу **`super(...)` треба викликати до першого звернення до `this`** — саме батьківський конструктор створює об'єкт. `super.method()` викликає метод батька з поточним `this`.
>
> ```js
> class Animal {
>   constructor(name) { this.name = name; }
>   speak() { return `${this.name} makes a sound`; }
> }
> class Dog extends Animal {
>   constructor(name) {
>     super(name);
>     this.tricks = [];
>   }
>   speak() { return `${super.speak()} and barks`; }
> }
> new Dog('Rex').speak(); // 'Rex makes a sound and barks'
> ```
>
> Якщо конструктор не оголошено, створюється неявний `constructor(...args) { super(...args); }`. Звернення до `this` до `super()` — `ReferenceError`.
>
> 📚 [[JavaScript - 07. Прототипи та класи#🍬 class — синтаксичний цукор (але не лише)|Розділ: класи і extends]] · [MDN: extends](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends) · [javascript.info: Class inheritance](https://javascript.info/class-inheritance)

> [!question]- Що таке getter і setter і коли їх використовувати?
> *іноді · код* · `js-03-006`
>
> Getter/setter — це **accessor property**: читання властивості викликає `get`, присвоєння — `set`. Використовують для обчислюваних значень і валідації при записі, зберігаючи синтаксис звичайної властивості.
>
> ```js
> class Temperature {
>   #celsius = 0;
>   get fahrenheit() { return this.#celsius * 9 / 5 + 32; }
>   set fahrenheit(f) {
>     if (typeof f !== 'number') throw new TypeError('number expected');
>     this.#celsius = (f - 32) * 5 / 9;
>   }
> }
> const t = new Temperature();
> t.fahrenheit = 212;
> t.fahrenheit; // 212
> ```
>
> Accessor-и класу живуть на прототипі, тому `Object.keys(t)` і `JSON.stringify(t)` їх не бачать. Getter без setter-а: запис ігнорується у sloppy mode і кидає `TypeError` у strict. Getter має бути дешевим і без побічних ефектів.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко|Розділ: обʼєкти глибоко]] · [MDN: get](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) · [javascript.info: Property getters and setters](https://javascript.info/property-accessors)

> [!question]- Чому `this` губиться, коли метод передають як callback?
> *дуже часто · код* · `js-03-007`
>
> Коли метод передають як значення (`arr.forEach(obj.method)`, `onClick={this.handle}`), передається лише функція. Implicit binding працює тільки в момент виклику `obj.method()`, тож далі спрацьовує default binding: у strict mode (а класи завжди strict) `this === undefined` → `TypeError`.
>
> ```js
> class Counter {
>   count = 0;
>   inc() { this.count++; }
> }
> const c = new Counter();
> const { inc } = c;
> inc();                         // TypeError
> [1, 2].forEach(c.inc);         // TypeError
> [1, 2].forEach(() => c.inc()); // ok
> [1, 2].forEach(c.inc, c);      // ok — thisArg
> const bound = c.inc.bind(c);   // ok
> ```
>
> **На співбесіді:** із `setTimeout(c.inc)` помилки не буде, і це підступніше: браузер викликає callback з `this = window`, Node — з об'єктом `Timeout`. Лічильник тихо не зміниться.
>
> 📚 [[JavaScript - 06. this#2️⃣ Implicit binding|Розділ: implicit binding]] · [MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) · [javascript.info: Function binding](https://javascript.info/bind)

## 🟡 Middle

> [!question]- Яка різниця між `__proto__` і `prototype`?
> *часто · порівняння* · `js-03-008`
>
> `prototype` — звичайна властивість функцій-конструкторів і класів: об'єкт, який стане `[[Prototype]]` екземплярів, створених через `new`. `__proto__` — legacy accessor на `Object.prototype`, що читає або записує `[[Prototype]]` конкретного об'єкта. Отже, `new Foo().__proto__ === Foo.prototype`.
>
> - `prototype` є лише у функцій, що можуть бути конструкторами; у стрілок і методів із shorthand-синтаксису його немає.
> - `__proto__` описаний в Annex B і недоступний в об'єктів без `Object.prototype` у ланцюжку (`Object.create(null)`).
> - Стандартна альтернатива — `Object.getPrototypeOf` / `Object.setPrototypeOf`.
>
> ```js
> function Foo() {}
> const f = new Foo();
> Object.getPrototypeOf(f) === Foo.prototype;        // true
> Foo.prototype.constructor === Foo;                 // true
> Object.getPrototypeOf(Foo) === Function.prototype; // true
> Object.create(null).__proto__;                     // undefined
> ```
>
> **На співбесіді:** зміна прототипу вже створеного об'єкта (`setPrototypeOf`) інвалідує inline caches у V8 і сповільнює весь код, що працює з цим об'єктом. Прототип задають при створенні — через `Object.create` або `class`.
>
> 📚 [[JavaScript - 07. Прототипи та класи#🔬 Як це працює насправді|Розділ: прототипи]] · [MDN: Object.prototype.\_\_proto\_\_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto) · [javascript.info: F.prototype](https://javascript.info/function-prototype)

> [!question]- Що робить `Object.create` і навіщо `Object.create(null)`?
> *часто · код* · `js-03-009`
>
> `Object.create(proto, descriptors?)` створює новий об'єкт із заданим `[[Prototype]]` без виклику будь-якого конструктора. Другий аргумент — property descriptors, як у `Object.defineProperties`; не вказані атрибути за замовчуванням `false`.
>
> ```js
> const base = { greet() { return `hi, ${this.name}`; } };
> const u = Object.create(base, {
>   name: { value: 'Ann', enumerable: true },
> });
> u.greet(); // 'hi, Ann'
>
> const dict = Object.create(null);
> dict.toString;         // undefined
> 'constructor' in dict; // false
> ```
>
> `Object.create(null)` дає **чистий словник** без успадкованих ключів: `in` і `for...in` не спіткнуться об `toString` чи `constructor`, а ключ `__proto__` стає звичайним ключем — це захист від prototype pollution. Мінуси: немає `hasOwnProperty` і `toString`, тому `` `${dict}` `` кидає `TypeError`, а перевіряти ключі треба через `Object.hasOwn`. Для динамічних словників із частими вставками й видаленнями зазвичай краще `Map`.
>
> 📚 [[JavaScript - 07. Прототипи та класи#🏗️ Object.create і функції-конструктори|Розділ: Object.create]] · [MDN: Object.create()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create) · [javascript.info: Prototype methods, objects without \_\_proto\_\_](https://javascript.info/prototype-methods)

> [!question]- Що відбувається під капотом при виклику `new F()`?
> *дуже часто · теорія* · `js-03-010`
>
> Для звичайної функції `new F(...args)`:
>
> 1. Створює об'єкт із `[[Prototype]]` = `F.prototype` (якщо `F.prototype` не об'єкт — `Object.prototype`).
> 2. Викликає `F` з `this` = цей об'єкт.
> 3. Якщо `F` повернула об'єкт (включно з функцією) — результатом `new` буде він; повернений примітив ігнорується, повертається створений об'єкт.
>
> Для класів є відмінність: у похідному класі об'єкт створює не сам `new`, а базовий конструктор під час `super()`, тому `this` до `super()` недоступний. **`new.target`** вказує на конструктор, який реально викликали через `new` (або `undefined` при звичайному виклику) — зручно для абстрактних класів.
>
> ```js
> function User(name) { this.name = name; }
> User.prototype.hi = function () { return this.name; };
> new User('Ann').hi(); // 'Ann'
>
> class Shape {
>   constructor() {
>     if (new.target === Shape) throw new TypeError('Shape is abstract');
>   }
> }
> class Circle extends Shape {}
> new Circle(); // ok
> new Shape();  // TypeError
> ```
>
> 📚 [[JavaScript - 07. Прототипи та класи#🆕 Що робить new — крок за кроком|Розділ: що робить new]] · [MDN: new](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) · [javascript.info: Constructor, operator "new"](https://javascript.info/constructor-new)

> [!question]- Чи є `class` лише синтаксичним цукром над функцією-конструктором?
> *часто · порівняння* · `js-03-011`
>
> Здебільшого `class` будує ту саму прототипну модель, але це **не чистий цукор** — є семантичні відмінності:
>
> - Виклик без `new` кидає `TypeError`.
> - Тіло класу завжди виконується в strict mode.
> - Оголошення класу перебуває в TDZ: звернення до рядка оголошення — `ReferenceError` (function declaration доступна одразу).
> - Методи non-enumerable, не мають `prototype` і не можуть бути викликані з `new`.
> - У похідних класах `this` з'являється лише після `super()`, тому `extends Array` чи `extends Error` дають повноцінні екземпляри з правильними internal slots — ES5-патерн `Parent.call(this)` цього не вміє.
> - Є можливості, яких у функцій немає: приватні `#`-члени, static blocks, оголошення полів.
>
> ```js
> class Foo { m() {} }
> Object.keys(Foo.prototype); // []
> new Foo().m.prototype;      // undefined
> Foo();                      // TypeError: Class constructor Foo cannot be invoked without 'new'
> ```
>
> 📚 [[JavaScript - 07. Прототипи та класи#🍬 class — синтаксичний цукор (але не лише)|Розділ: класи]] · [MDN: Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) · [javascript.info: Class basic syntax](https://javascript.info/class)

> [!question]- Як працюють приватні поля `#x` і перевірка `#x in obj`?
> *часто · код* · `js-03-012`
>
> `#x` — справжня приватність на рівні мови, а не конвенція `_x`: доступ можливий лише з коду всередині тіла класу, де поле оголошено. Семантично це **brand**: об'єкт або отримав поле, пройшовши через конструктор класу, або ні. Звернення `obj.#x` до об'єкта без поля кидає `TypeError`, а `#x in obj` (ES2022) безпечно перевіряє наявність.
>
> ```js
> class Money {
>   #cents;
>   constructor(cents) { this.#cents = cents; }
>   static isMoney(v) { return Object(v) === v && #cents in v; }
>   equals(other) {
>     return Money.isMoney(other) && this.#cents === other.#cents;
>   }
> }
> Money.isMoney(new Money(5)); // true
> Money.isMoney({ cents: 5 }); // false
> ```
>
> Особливості:
> - `#`-поля не видно в `Object.keys`, `Reflect.ownKeys`, `JSON.stringify`, `structuredClone`.
> - Proxy їх не перехоплює: методи, що читають `this.#x`, падають, якщо викликані на `new Proxy(instance, {})`.
> - Приватність per-class, а не per-instance: метод бачить `#`-поля інших екземплярів того самого класу.
> - Права частина `#x in v` має бути об'єктом, інакше `TypeError` — звідси `Object(v) === v`.
>
> 📚 [[JavaScript - 07. Прототипи та класи#🔬 Як це працює насправді|Розділ: приватні поля і static]] · [MDN: Private elements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements) · [Spec: Private Names](https://tc39.es/ecma262/#sec-private-names)

> [!question]- Що станеться при `bind` стрілкової функції, повторному `bind` і `new` на bound-функції?
> *іноді · код* · `js-03-013`
>
> - `bind` на стрілці повертає нову функцію, але `this` лишається лексичним; часткове застосування аргументів при цьому працює.
> - Повторний `bind` не змінює `this`: bound function вже має зафіксований `[[BoundThis]]`, наступний `bind` лише додає аргументи. Перший `bind` виграє.
> - `new` на bound-функції ігнорує зафіксований `this` і створює екземпляр цільової функції; preset-аргументи зберігаються. Bound-стрілка з `new` — `TypeError`.
>
> ```js
> function outer() { return (a, b) => [this.id, a, b]; }
> const arrow = outer.call({ id: 1 });
> arrow.bind({ id: 2 }, 'x')('y'); // [1, 'x', 'y']
>
> function who() { return this.id; }
> who.bind({ id: 1 }).bind({ id: 2 })(); // 1
>
> function Point(x, y) { this.x = x; this.y = y; }
> const P = Point.bind({ ignored: true }, 10);
> const p = new P(20); // { x: 10, y: 20 }
> p instanceof Point;  // true
> p instanceof P;      // true — instanceof делегує до target
> ```
>
> **На співбесіді:** саме тому пріоритет `new` вищий за explicit binding. Bound-функція також має `name` на кшталт `'bound who'` і не має властивості `prototype`.
>
> 📚 [[JavaScript - 06. this#🏆 Пріоритет правил|Розділ: пріоритет правил]] · [MDN: Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) · [Spec: Function.prototype.bind](https://tc39.es/ecma262/#sec-function.prototype.bind)

> [!question]- Як працює `instanceof` і як змінити його поведінку через `Symbol.hasInstance`?
> *іноді · теорія* · `js-03-014`
>
> `obj instanceof C` спершу шукає у `C` метод `Symbol.hasInstance` і викликає його (результат приводиться до boolean). Дефолтна реалізація — `Function.prototype[Symbol.hasInstance]` → **OrdinaryHasInstance**: перевіряє, чи зустрічається `C.prototype` у prototype chain `obj` (для bound-функцій — перевірка щодо target). Примітив зліва дає `false`, не-callable справа — `TypeError`.
>
> ```js
> class Even {
>   static [Symbol.hasInstance](n) {
>     return Number.isInteger(n) && n % 2 === 0;
>   }
> }
> 4 instanceof Even; // true
> 3 instanceof Even; // false
> ```
>
> Пастки в реальному коді:
> - Різні realm-и (iframe, `node:vm`): масив з iframe не є `instanceof Array` поточного вікна — використовуй `Array.isArray`.
> - Дві копії бібліотеки в bundle — два різні класи, `instanceof` повертає `false`.
> - Прототип можна підмінити через `Object.setPrototypeOf`, тож це не гарантія типу.
>
> **На співбесіді:** для надійних перевірок між модулями краще brand check (`#x in obj`) або явні type guards.
>
> 📚 [[JavaScript - 07. Прототипи та класи#🔍 Пошук по ланцюжку (lookup)|Розділ: пошук по ланцюжку]] · [MDN: instanceof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) · [MDN: Symbol.hasInstance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance)

> [!question]- Що таке property descriptors і що означають `writable`, `enumerable`, `configurable`?
> *іноді · теорія* · `js-03-015`
>
> Кожна властивість має descriptor. Data property: `value`, `writable`, `enumerable`, `configurable`. Accessor property: `get`, `set`, `enumerable`, `configurable`.
>
> - `writable: false` — присвоєння ігнорується (у strict mode — `TypeError`).
> - `enumerable: false` — властивість не видно у `for...in`, `Object.keys`, spread, `JSON.stringify`.
> - `configurable: false` — не можна видалити, змінити тип чи атрибути; виняток — `writable` можна змінити з `true` на `false`.
>
> **Звичайне присвоєння створює всі атрибути `true`, а `Object.defineProperty` за замовчуванням — усі `false`.**
>
> ```js
> const o = {};
> Object.defineProperty(o, 'id', { value: 1, enumerable: true });
> Object.getOwnPropertyDescriptor(o, 'id');
> // { value: 1, writable: false, enumerable: true, configurable: false }
> o.id = 2;    // тихо ігнорується у sloppy, TypeError у strict
> delete o.id; // false у sloppy, TypeError у strict
> ```
>
> Так влаштовані вбудовані об'єкти: методи на `Array.prototype` non-enumerable, `Math.PI` — non-writable і non-configurable. Для кількох властивостей одразу є `Object.defineProperties`, а `Object.getOwnPropertyDescriptors` повертає descriptors усіх власних властивостей — це основа точного копіювання об'єкта разом з accessor-ами.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко|Розділ: обʼєкти глибоко]] · [MDN: Object.defineProperty()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) · [javascript.info: Property flags and descriptors](https://javascript.info/property-descriptors)

## 🔴 Senior

> [!question]- Чим відрізняються `Object.freeze`, `Object.seal` і `Object.preventExtensions`, і де вони підводять?
> *часто · порівняння* · `js-03-016`
>
> Усі три роблять об'єкт non-extensible; різниця — у тому, що дозволено з наявними властивостями.
>
> | | додати | видалити | змінити значення |
> |---|---|---|---|
> | `preventExtensions` | ні | так | так |
> | `seal` | ні | ні | так |
> | `freeze` | ні | ні | ні |
>
> `seal` робить усі властивості `configurable: false`, `freeze` додатково `writable: false` для data properties. Операція незворотна.
>
> Де підводять у production:
> - **Усе shallow.** Вкладені об'єкти лишаються мутабельними; deep freeze потребує рекурсії з `WeakSet` проти циклів.
> - Accessor-и не заморожуються: setter на frozen-об'єкті продовжує працювати й може мутувати замкнений стан.
> - `#`-поля не є властивостями, тож `freeze` їх не зачіпає.
> - Порушення мовчазні у sloppy mode і кидають `TypeError` у strict, тому баги часто «з'являються» після переходу на ESM чи класи.
> - `Object.freeze(new Uint8Array(4))` кидає `TypeError`: індексовані елементи typed array не можна зробити non-writable.
>
> ```js
> 'use strict';
> Object.isFrozen(Object.seal({})); // true — порожній sealed-об'єкт формально frozen
> const cfg = Object.freeze({ port: 80, db: { host: 'a' } });
> cfg.db.host = 'b'; // ok — freeze shallow
> cfg.port = 81;     // TypeError
> ```
>
> **На співбесіді:** freeze часто вмикають лише в dev як детектор випадкових мутацій state (так робить Immer через autoFreeze), а не як механізм безпеки.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко|Розділ: обʼєкти глибоко]] · [MDN: Object.freeze()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) · [MDN: Object.seal()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)

> [!question]- Який порядок ініціалізації полів класу при наслідуванні і які пастки з цього випливають?
> *іноді · код* · `js-03-017`
>
> Для `new Child()`:
>
> 1. Конструктор `Child` викликає `super()`.
> 2. Базовий конструктор створює об'єкт із прототипом `new.target.prototype` (тобто `Child.prototype`), ініціалізує **поля `Base`**, виконує тіло конструктора `Base`.
> 3. Після повернення з `super()` ініціалізуються **поля `Child`**, потім виконується решта тіла конструктора `Child`.
>
> Пастка 1: базовий конструктор викликає перевизначений метод (template method), який читає поле підкласу — воно ще не ініціалізоване.
>
> ```js
> class Base {
>   constructor() { this.init(); }
>   init() {}
> }
> class Child extends Base {
>   items = [];
>   init() { this.items.push('x'); }
> }
> new Child(); // TypeError: Cannot read properties of undefined (reading 'push')
> ```
>
> Пастка 2: поля класу мають **define-семантику** (`[[DefineOwnProperty]]`), а не set. Поле з тим самим ім'ям, що й accessor батька, створює власну властивість екземпляра і перекриває setter — він не викликається.
>
> ```js
> class A { set value(v) { console.log('setter', v); } }
> class B extends A { value = 1; } // setter не спрацює
> ```
>
> У TypeScript з `useDefineForClassFields: false` (старий дефолт для target нижче ES2022) поля компілюються в присвоєння, тож зміна target або цього прапорця тихо змінює поведінку. Лікування: не викликати перевизначувані методи з конструктора; виносити ініціалізацію в фабрику (`static create()`) або в явний `init()` після конструювання.
>
> 📚 [[JavaScript - 07. Прототипи та класи#🍬 class — синтаксичний цукор (але не лише)|Розділ: класи]] · [MDN: Public class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields) · [javascript.info: Class inheritance](https://javascript.info/class-inheritance)

> [!question]- Як реалізувати mixin-и в JS і які в них проблеми?
> *іноді · код* · `js-03-018`
>
> Два основні підходи:
>
> 1. **Копіювання методів**: `Object.assign(Target.prototype, mixin)`. Простий, але копіює лише own enumerable властивості, getter-и «сплющуються» у значення в момент копіювання, а `super` у методах mixin-а лишається прив'язаним до його оригінального home object.
> 2. **Subclass factory**: функція приймає базовий клас і повертає клас, що його розширює. Зберігає `super`, `instanceof` за ланцюжком, приватні поля й accessor-и.
>
> ```js
> const Serializable = (Base) => class extends Base {
>   toJSON() { return { type: this.constructor.name, ...this }; }
> };
> const Timestamped = (Base) => class extends Base {
>   createdAt = Date.now();
> };
> class Entity {}
> class User extends Serializable(Timestamped(Entity)) {
>   constructor(name) {
>     super();
>     this.name = name;
>   }
> }
> JSON.stringify(new User('Ann')); // '{"type":"User","createdAt":...,"name":"Ann"}'
> ```
>
> Проблеми:
> - Конфлікти імен вирішуються мовчки — перемагає верхній шар.
> - Неявні залежності між mixin-ами (один розраховує на метод іншого), і порядок застосування має значення.
> - Глибокий ланцюжок анонімних класів у дебагері й stack traces.
> - `x instanceof Serializable` не працює: кожен виклик фабрики створює новий клас (можна обійти через `Symbol.hasInstance` із brand-перевіркою).
>
> **На співбесіді:** mixin-и виправдані для cross-cutting поведінки в класових фреймворках (Web Components, Lit), а в прикладному коді композиція через залежності зазвичай простіша й прозоріша.
>
> 📚 [[JavaScript - 32. Патерни проєктування|Розділ: патерни проєктування]] · [MDN: Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) · [javascript.info: Mixins](https://javascript.info/mixins)

> [!question]- Композиція чи наслідування: як обирати і яку ціну має кожне?
> *часто · порівняння* · `js-03-019`
>
> Наслідування моделює «is-a» і жорстко прив'язує підклас до деталей реалізації батька — **fragile base class**: зміна порядку викликів у базі ламає нащадків, яких автор бази не бачить. Композиція — «has-a»/«uses-a»: об'єкт отримує поведінку через залежності чи функції, які замінюються незалежно.
>
> Наслідування доречне, коли:
> - ієрархія неглибока (1–2 рівні) і стабільна, або це контракт платформи (`extends HTMLElement`, `extends Error`);
> - підклас справді підставний замість батька (LSP).
>
> Композиція краща, коли:
> - потрібні комбінації поведінок (A+B, B+C) — наслідування дає вибух класів;
> - поведінку треба підміняти в runtime або в тестах;
> - базовий код належить іншій команді чи бібліотеці.
>
> ```js
> function createCache({ storage, clock = Date, ttl }) {
>   return {
>     get(key) {
>       const hit = storage.get(key);
>       if (!hit || clock.now() - hit.at > ttl) return undefined;
>       return hit.value;
>     },
>     set(key, value) {
>       storage.set(key, { value, at: clock.now() });
>     },
>   };
> }
> const cache = createCache({ storage: new Map(), ttl: 60_000 });
> ```
>
> `storage` і `clock` підміняються без жодного підкласу: Redis-адаптер у production, fake clock у тестах.
>
> **На співбесіді:** «favor composition over inheritance» — не заборона. Сильна відповідь називає конкретну ціну наслідування (fragile base class, залежність від `super`-протоколу, protected-методи як неявний API) і конкретну ціну композиції (більше «проводки», делегування вручну).
>
> 📚 [[JavaScript - 32. Патерни проєктування|Розділ: патерни проєктування]] · [MDN: Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain) · [patterns.dev: Factory Pattern](https://www.patterns.dev/vanilla/factory-pattern)

> [!question]- Що таке method borrowing і навіщо `Function.prototype.call.bind`?
> *іноді · код* · `js-03-020`
>
> Method borrowing — виклик методу одного типу на об'єкті іншого через `call`/`apply`. Це працює, якщо метод **generic**: використовує лише ту «форму» `this`, яку має чужий об'єкт (наприклад, `length` та індекси). Більшість методів `Array.prototype` навмисно generic.
>
> ```js
> function legacy() {
>   return Array.prototype.map.call(arguments, (x) => x * 2);
> }
> legacy(1, 2);                                         // [2, 4]
> Array.prototype.join.call('abc', '-');                // 'a-b-c'
> Object.prototype.toString.call(null);                 // '[object Null]'
> Object.prototype.hasOwnProperty.call(Object.create(null), 'k'); // false
>
> const uncurryThis = Function.prototype.bind.bind(Function.prototype.call);
> const slice = uncurryThis(Array.prototype.slice);
> slice([1, 2, 3], 1);                                  // [2, 3]
> ```
>
> `uncurryThis` перетворює метод на функцію, де `this` стає першим аргументом. Навіщо це senior-у: Node.js core захоплює built-ins при старті (`primordials`) саме так, щоб його код не ламався, якщо користувач перезапише `Array.prototype.map` або станеться prototype pollution. Та сама ідея — у security-sensitive коді та SES/lockdown-оточеннях.
>
> Сучасні альтернативи частини прийомів — `Array.from(arguments)`, rest-параметри та `Object.hasOwn`, тож у новому прикладному коді borrowing потрібен рідко. Обмеження: методи, що залежать від internal slots або `#`-полів, не generic. `Map.prototype.get.call({}, 1)` чи `Date.prototype.getTime.call({})` кидають `TypeError`, бо перевіряють, що `this` — справжній `Map`/`Date`.
>
> 📚 [[JavaScript - 06. this#3️⃣ Explicit binding: call, apply, bind|Розділ: call, apply і bind]] · [MDN: Function.prototype.call()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call) · [javascript.info: Decorators and forwarding, call/apply](https://javascript.info/call-apply-decorators)

> [!question]- Як працюють static-члени і static blocks і чи успадковуються вони?
> *рідко · код* · `js-03-021`
>
> `static` методи й поля належать самому конструктору. `extends` встановлює `Object.getPrototypeOf(Child) === Parent`, тож **static-члени успадковуються через prototype chain конструкторів**, а `this` у static-методі — клас, на якому його викликали. Це основа поліморфних фабрик (`new this()`).
>
> Static field — own property конкретного класу, ініціалізується при виконанні оголошення класу. Пастка: `this.counter++` у static-методі підкласу читає успадковане значення, але записує власну властивість підкласу (copy-on-write), а `this.registry.push(x)` мутує спільний масив батька.
>
> `static { }` (ES2022) — блок, що виконується один раз при оцінці класу, з доступом до приватних членів. Застосування: складна ініціалізація з `try/catch`, узгоджене заповнення кількох static-полів, «friend»-доступ до `#`-полів для коду того самого модуля.
>
> ```js
> let readSecret;
> class Vault {
>   static instances = 0;
>   #secret;
>   constructor(s) { this.#secret = s; }
>   static create(s) {
>     this.instances++;
>     return new this(s);
>   }
>   static {
>     readSecret = (v) => v.#secret;
>   }
> }
> class SubVault extends Vault {}
> SubVault.create('x') instanceof SubVault; // true — this === SubVault
> Object.hasOwn(SubVault, 'instances');     // true — запис створив own property
> Vault.instances;                          // 0
> readSecret(new Vault('k'));               // 'k'
> ```
>
> **На співбесіді:** static-поля і blocks виконуються в порядку оголошення разом, тож static block бачить лише поля, оголошені вище нього.
>
> 📚 [[JavaScript - 07. Прототипи та класи#🔬 Як це працює насправді|Розділ: приватні поля і static]] · [MDN: Static initialization blocks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks) · [javascript.info: Static properties and methods](https://javascript.info/static-properties-methods)

## 🟣 Tech Lead

> [!question]- Коли в кодовій базі обирати класи, а коли plain objects і функції?
> *часто · практика* · `js-03-022`
>
> Вибір визначає не смак, а природа сутності: чи є в неї **ідентичність і мутабельний стан з інваріантами**, чи це дані, що течуть системою.
>
> Класи виправдані для:
> - довгоживучих об'єктів з інкапсульованим станом і життєвим циклом: SDK-клієнт, connection pool, state machine, кеш;
> - контрактів платформи й фреймворків: Web Components, підкласи `Error`, DI-контейнери (NestJS, Angular);
> - випадків, де потрібні brand checks (`#x in obj`) або `instanceof` для помилок.
>
> Plain objects і функції — для:
> - даних: DTO, відповіді API, state у Redux/React. Їх серіалізують, клонують, порівнюють, а `structuredClone`, `JSON` і `postMessage` втрачають прототип. Передати екземпляр класу із Server Component у Client Component у React не можна — лише серіалізовані plain values;
> - бізнес-логіки як чистих функцій: простіше тестувати, а tree-shaking працює на рівні функцій (методи класу окремо не видаляються);
> - UI на хуках.
>
> Ризики класів у спільній кодовій базі: втрата `this` при передачі методів як callback-ів, розростання ієрархій, змішування даних і поведінки, через яке дані перестають бути серіалізованими.
>
> Практичне правило для команди: **дані — plain objects з типами** (TS `type`/`interface`), **сервіси з життєвим циклом — класи або фабрики**, **логіка — функції**; наслідування лише від класів платформи чи фреймворку. Зафіксувати в ADR і code review checklist, щоб рішення не переглядалося в кожному PR.
>
> 📚 [[JavaScript - 32. Патерни проєктування|Розділ: патерни проєктування]] · [MDN: Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) · [patterns.dev: Factory Pattern](https://www.patterns.dev/vanilla/factory-pattern)

> [!question]- Як спроєктувати розширюваний API без глибоких ієрархій наслідування?
> *іноді · практика* · `js-03-023`
>
> Розширюваність дають через **явні точки розширення з контрактом**, а не через «успадкуй і перевизнач protected-метод». Коли ви дозволяєте `extends` свого класу, порядок викликів у конструкторі й внутрішні методи стають публічним API, який уже не змінити без breaking change.
>
> Інструменти:
> - Options object з дефолтами — нові параметри без поломки старих викликів.
> - Strategy / DI — передати об'єкт із вузьким інтерфейсом (`storage`, `fetch`, `logger`).
> - Hooks, plugins, middleware — конвеєр функцій з визначеним порядком (Express/Koa, Vite/Rollup plugins, tapable у webpack).
> - Події (`EventTarget`) — спостереження без втручання в потік.
>
> ```js
> function createClient({ baseUrl, plugins = [] }) {
>   const hooks = { beforeRequest: [], afterResponse: [] };
>   for (const p of plugins) p.setup({ on: (name, fn) => hooks[name].push(fn) });
>   return {
>     async get(path) {
>       const req = new Request(new URL(path, baseUrl));
>       for (const fn of hooks.beforeRequest) await fn(req);
>       let res = await fetch(req);
>       for (const fn of hooks.afterResponse) res = (await fn(res, req)) ?? res;
>       return res;
>     },
>   };
> }
> const auth = (token) => ({
>   setup({ on }) {
>     on('beforeRequest', (req) => req.headers.set('Authorization', `Bearer ${token}`));
>   },
> });
> const api = createClient({ baseUrl: 'https://api.example.com', plugins: [auth('t0k')] });
> ```
>
> Рішення рівня Tech Lead:
> - кожна точка розширення — контракт під semver; відкривайте мінімум і документуйте порядок хуків та обробку помилок у них;
> - версіонуйте plugin API (`apiVersion` у plugin-об'єкті) і валідуйте плагіни при реєстрації;
> - тримайте внутрішні класи неекспортованими: експортуйте фабрики й типи інтерфейсів, а не базові класи для наслідування.
>
> 📚 [[JavaScript - 32. Патерни проєктування|Розділ: патерни проєктування]] · [Refactoring.Guru: Strategy](https://refactoring.guru/design-patterns/strategy) · [Martin Fowler: Inversion of Control Containers and the DI pattern](https://martinfowler.com/articles/injection.html)

## Тести

> [!quiz] Чому дорівнює `this` усередині звичайної функції, викликаної як `fn()` у strict mode?
> level: junior · id: js-03-quiz-01
> - [ ] `globalThis`
> - [x] `undefined`
> - [ ] `null`
> - [ ] сама функція `fn`
>
> **Пояснення:** при default binding у strict mode `this` не підміняється на глобальний об'єкт і лишається `undefined`. `globalThis` підставляється лише в sloppy mode.

> [!quiz] Що поверне `Object.isFrozen(Object.seal({}))`?
> level: senior · id: js-03-quiz-02
> - [ ] `false` — seal не забороняє зміну значень
> - [x] `true`
> - [ ] `TypeError`
> - [ ] `undefined`
>
> **Пояснення:** `isFrozen` перевіряє, що об'єкт non-extensible і всі його властивості non-configurable та non-writable. У порожнього sealed-об'єкта властивостей немає, тож умова виконується «порожньо» і він формально frozen.

> [!quiz] Оберіть усі правильні твердження про `class`.
> level: middle · type: multi · id: js-03-quiz-03
> - [x] Тіло класу завжди виконується в strict mode
> - [x] Методи, оголошені в тілі класу, non-enumerable
> - [ ] Клас можна використати до рядка його оголошення, як function declaration
> - [x] Виклик конструктора класу без `new` кидає `TypeError`
>
> **Пояснення:** оголошення класу перебуває в TDZ, тому звернення до нього до рядка оголошення кидає `ReferenceError`. Решта тверджень — задокументовані відмінності класу від функції-конструктора.

> [!quiz] Що виведе код?
> level: junior · type: output · id: js-03-quiz-04
>
> ```js
> 'use strict';
> const user = {
>   name: 'Ann',
>   greet() { return this?.name; },
> };
> const greet = user.greet;
> const bound = greet.bind({ name: 'Bob' });
> console.log(greet(), bound.call({ name: 'Cid' }));
> ```
>
> - [ ] `Ann Cid`
> - [ ] `undefined Cid`
> - [x] `undefined Bob`
> - [ ] `TypeError`
>
> **Пояснення:** `greet()` викликано без об'єкта, тож у strict mode `this === undefined`, а `this?.name` дає `undefined` без помилки. `call` не може перевизначити `this` bound-функції — лишається `{ name: 'Bob' }`.

> [!quiz] Що виведе код?
> level: senior · type: output · id: js-03-quiz-05
>
> ```js
> class Base {
>   name = 'base';
>   constructor() { console.log(this.describe()); }
>   describe() { return `Base:${this.name}`; }
> }
> class Child extends Base {
>   name = 'child';
>   describe() { return `Child:${this.name}`; }
> }
> new Child();
> ```
>
> - [ ] `Base:base`
> - [x] `Child:base`
> - [ ] `Child:child`
> - [ ] `Child:undefined`
>
> **Пояснення:** прототип екземпляра — `Child.prototype`, тому викликається `Child#describe`. Але на момент виконання тіла конструктора `Base` ініціалізовані лише поля `Base`; поле `name = 'child'` запишеться після повернення з `super()`.

## Задачі

> [!task] Реалізуй `myNew(Ctor, ...args)`
> level: middle · difficulty: easy · id: js-03-task-01 · tags: prototypes, new, this
>
> Умова: напиши функцію `myNew(Ctor, ...args)`, яка відтворює поведінку оператора `new` для звичайних функцій-конструкторів. Створений об'єкт має наслідувати `Ctor.prototype`; якщо конструктор повертає об'єкт або функцію, повертається саме він, а примітив ігнорується. Якщо `Ctor` не функція — кинь `TypeError`. Приклад: `myNew(User, 'Ann')` для `function User(n) { this.name = n; }` повертає об'єкт `{ name: 'Ann' }`, для якого `instanceof User === true`.
>
> > [!hint]- Підказка 1
> > Розбий `new` на три кроки: створити об'єкт, викликати конструктор, вирішити, що повернути.
>
> > [!hint]- Підказка 2
> > Об'єкт із потрібним прототипом дає `Object.create(Ctor.prototype)`, а викликати конструктор з потрібним `this` можна через `apply`.
>
> > [!hint]- Підказка 3
> > Результат конструктора повертай, лише якщо `result !== null` і його `typeof` — `'object'` або `'function'`. Якщо `Ctor.prototype` не об'єкт, справжній `new` бере `Object.prototype`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function myNew(Ctor, ...args) {
> >   if (typeof Ctor !== 'function') {
> >     throw new TypeError(`${String(Ctor)} is not a constructor`);
> >   }
> >   const proto = Object(Ctor.prototype) === Ctor.prototype ? Ctor.prototype : Object.prototype;
> >   const obj = Object.create(proto);
> >   const result = Ctor.apply(obj, args);
> >   const isObject = result !== null && (typeof result === 'object' || typeof result === 'function');
> >   return isObject ? result : obj;
> > }
> >
> > function User(name) { this.name = name; }
> > const u = myNew(User, 'Ann');
> > u instanceof User; // true
> > ```
> >
> > Рішення повторює кроки з алгоритму `[[Construct]]` для звичайних функцій: прототип, виклик з `this`, правило повернення об'єкта. Обмеження: класи так не сконструювати — `Ctor.apply` на класі кидає `TypeError`, а стрілки мають пройти перевірку `typeof`, хоча не є конструкторами. Повноцінна заміна — `Reflect.construct(Ctor, args)`, яка коректно працює з класами, `new.target` і похідними конструкторами.

> [!task] Реалізуй `Function.prototype.myBind`
> level: senior · difficulty: medium · id: js-03-task-02 · tags: this, bind, closures
>
> Умова: реалізуй `Function.prototype.myBind(thisArg, ...preset)` без використання вбудованого `bind`. Повернена функція має викликати оригінал з `thisArg` і аргументами `[...preset, ...args]`. При виклику через `new` зафіксований `this` ігнорується, створюється екземпляр оригінальної функції, і `instanceof` працює як для оригіналу, так і для bound-функції. Бонус: `name` має бути `'bound <name>'`, а `length` — `max(0, original.length - preset.length)`. Приклад: `new (Point.myBind(null, 1))(2)` повертає `{ x: 1, y: 2 }` і `instanceof Point === true`.
>
> > [!hint]- Підказка 1
> > Поверни звичайну (не стрілкову) функцію, щоб вона могла бути викликана з `new`, а оригінал збережи в замиканні.
>
> > [!hint]- Підказка 2
> > Усередині bound-функції `new.target` показує, чи був виклик через `new`.
>
> > [!hint]- Підказка 3
> > Для гілки з `new` використай `Reflect.construct(target, allArgs, new.target)`, а щоб `instanceof` працював, зв'яжи `bound.prototype` з `target.prototype`. `name` і `length` визначай через `Object.defineProperty` — вони non-writable.
>
> > [!solution]- Еталонне рішення
> > ```js
> > Function.prototype.myBind = function (thisArg, ...preset) {
> >   const target = this;
> >   if (typeof target !== 'function') {
> >     throw new TypeError('myBind must be called on a function');
> >   }
> >   function bound(...args) {
> >     const all = [...preset, ...args];
> >     return new.target
> >       ? Reflect.construct(target, all, new.target)
> >       : target.apply(thisArg, all);
> >   }
> >   if (target.prototype !== undefined) bound.prototype = target.prototype;
> >   Object.defineProperty(bound, 'name', { value: `bound ${target.name}` });
> >   Object.defineProperty(bound, 'length', {
> >     value: Math.max(0, target.length - preset.length),
> >   });
> >   return bound;
> > };
> >
> > function Point(x, y) { this.x = x; this.y = y; }
> > const P = Point.myBind({ ignored: true }, 1);
> > const p = new P(2);
> > p.x + p.y;          // 3
> > p instanceof Point; // true
> > p instanceof P;     // true
> > ```
> >
> > `Reflect.construct` з `newTarget = bound` бере прототип з `bound.prototype`, який збігається з `target.prototype`, тому `instanceof` працює в обидва боки; для `class X extends P` прототип правильно береться з підкласу. Bound-стрілка під `new` кине `TypeError` з `Reflect.construct`, як і нативний `bind`. Відмінності від нативу: у справжньої bound-функції немає `prototype` (`instanceof` делегує до target на рівні специфікації), а тут прототип спільний з оригіналом.
