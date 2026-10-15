---
title: this
order: 6
level: middle
tags: [this, binding, call, apply, bind, arrow-functions]
prerequisites:
  - "[[JavaScript - 01. Як JS виконує код]]"
  - "[[JavaScript - 05. Замикання]]"
estimatedMinutes: 35
id: jsd-ch-06
icon: "👉"
---

# this

> [!success] 🎯 Після цього розділу ти зможеш
> - визначити `this` у будь-якому виклику за чотирма правилами (default, implicit, explicit, `new`) та їхнім пріоритетом;
> - знайти місце, де `this` «губиться», і виправити його трьома способами;
> - пояснити, чому стрілкові функції не мають власного `this` і де це корисно, а де шкодить;
> - вільно використовувати `call`, `apply`, `bind` і пояснити, чому `bind` двічі не працює;
> - передбачити `this` у методах класу, class fields і обробниках подій.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: middle · type: output · id: jsd-06-quiz-01
>
> ```js
> 'use strict';
> const user = {
>   login: 'ann',
>   show() { return this.login; },
> };
> const show = user.show;
> console.log(user.show());
> console.log(show());
> ```
>
> - [ ] `'ann'`, потім `'ann'`
> - [x] `'ann'`, потім `TypeError`
> - [ ] `'ann'`, потім `undefined`
> - [ ] `undefined`, потім `undefined`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Функція `show` — та сама, але викликана **інакше**: без об'єкта перед крапкою. У strict mode такий виклик дає `this === undefined`, а читання `undefined.login` кидає `TypeError`. `this` визначає не місце, де функцію написали, а **спосіб, яким її викликали**.

## 🧒 Простими словами

`this` — це слово «я» в реченні. Його значення залежить від того, **хто говорить**, а не від того, хто написав речення. Фразу «я голодний» у сценарії можна дати будь-якому актору: скаже Аня — «я» = Аня, скаже Боб — «я» = Боб. Якщо ж фразу прочитає диктор за кадром, ніхто не знає, хто цей «я» (`undefined`). А стрілкова функція — це **цитата**: «Аня сказала: "я голодна"». Хоч хто її читатиме, «я» — завжди Аня.

## 🔬 Як це працює насправді

### 🎯 Головна ідея: `this` визначає виклик

Для звичайних функцій (`function`, методи об'єктів і класів) `this` — це **неявний параметр**, значення якого підставляється **в момент виклику**. На відміну від змінних, він **не** лексичний: не важливо, де функцію оголошено, важливо — як її викликано.

Щоб визначити `this`, подивись на **місце виклику** (call-site) і пройдися по чотирьох правилах.

> [!viz] this-binding
> scenario: rules

### 1️⃣ Default binding

Звичайний виклик без нічого: `fn()`.

- **Strict mode** (модулі, класи, `'use strict'`): `this === undefined`.
- **Sloppy mode**: `this === globalThis` (`window` у браузері).

```js
'use strict';
function whoAmI() {
  return this;
}
whoAmI(); // → undefined
```

Sloppy-поведінка — джерело багів: `this.x = 1` у «загубленому» методі тихо створює глобальну змінну. Strict mode перетворює це на гучну помилку.

### 2️⃣ Implicit binding

Виклик як **метод**: `obj.method()`. `this` — об'єкт **безпосередньо перед крапкою** (або перед `[...]`) на момент виклику.

```js
const nested = {
  name: 'outer',
  child: {
    name: 'inner',
    get() { return this.name; },
  },
};
nested.child.get(); // → 'inner' — лише останній об'єкт перед викликом
```

**Lost this** — найчастіший баг. Implicit binding працює **лише в момент виклику через крапку**. Як тільки метод відірвали від об'єкта, зв'язок зникає:

```js
'use strict';
const user = { login: 'ann', show() { return this.login; } };

const show = user.show;        show();               // ❌ присвоєння у змінну
setTimeout(user.show, 0);                            // ❌ передача як callback
const { show: s } = user;      s();                  // ❌ деструктуризація
[1].map(user.show);                                  // ❌ передача в метод масиву
(0, user.show)();                                    // ❌ comma-оператор повертає «голу» функцію
(user.show)();                                       // ✅ дужки не заважають — 'ann'
```

> [!viz] this-binding
> scenario: lost-this

Три способи «прив'язати» `this` назад: `bind`, стрілкова обгортка або стрілкове class field (нижче).

```js
setTimeout(user.show.bind(user), 0);  // ✅
setTimeout(() => user.show(), 0);     // ✅ виклик знову через крапку
```

> [!quiz] Перевір себе: у яких рядках `this` всередині `log` буде об'єктом `logger`?
> level: middle · type: multi · id: jsd-06-quiz-02
>
> ```js
> const logger = { prefix: '>', log(msg) { return this.prefix + msg; } };
> ```
>
> - [x] `logger.log('a')`
> - [ ] `const f = logger.log; f('a')`
> - [x] `logger['log']('a')`
> - [ ] `['a'].forEach(logger.log)`
> - [x] `['a'].forEach((m) => logger.log(m))`
> - [ ] `(0, logger.log)('a')`
>
> **Пояснення:** `this` = об'єкт перед крапкою чи квадратними дужками **в момент виклику**. У стрілковій обгортці `logger.log(m)` викликається саме так. В інших варіантах викликається «гола» функція → default binding.

### 3️⃣ Explicit binding: `call`, `apply`, `bind`

Задати `this` вручну:

| Метод | Що робить | Синтаксис |
|---|---|---|
| `call` | викликає одразу | `fn.call(thisArg, a, b)` |
| `apply` | викликає одразу, аргументи — масивом | `fn.apply(thisArg, [a, b])` |
| `bind` | **повертає нову функцію** з назавжди прив'язаним `this` (і, опційно, першими аргументами) | `fn.bind(thisArg, a)` |

```js
function sum(x, y) {
  return this.base + x + y;
}
const ctx = { base: 1 };
sum.call(ctx, 2, 3);    // → 6
sum.apply(ctx, [2, 3]); // → 6
sum.bind(ctx, 2)(3);    // → 6 — partial application: x уже 2
```

`bind` прив'язує **остаточно**. Повторний `bind` чи `call` на прив'язаній функції не змінять `this` — вони лише обгортають обгортку:

```js
function getId() { return this.id; }
const a = { id: 'a' }, b = { id: 'b' };
getId.bind(a).bind(b)(); // → 'a'
getId.bind(a).call(b);   // → 'a'
```

Багато вбудованих методів масивів приймають `thisArg` другим аргументом: `arr.map(fn, thisArg)`, `forEach`, `filter`, `some`, `every`, `find`.

> [!quiz] Перевір себе: що поверне `getId.bind(a).call(b)`?
> level: middle · id: jsd-06-quiz-03
> - [x] `'a'`
> - [ ] `'b'`
> - [ ] `undefined`
> - [ ] `TypeError`
>
> **Пояснення:** `bind` створює *bound function*, яка ігнорує переданий їй `this` і завжди викликає оригінал з `a`. `call(b)` змінює `this` лише для самої обгортки, а та його не використовує. Див. [MDN: Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).

> [!quiz] Перевір себе: впиши потрібний метод — `call`, `apply` чи `bind`
> level: junior · type: fill · id: jsd-06-quiz-07 · bank: new, this
>
> ```js fill
> function greet(greeting, mark) {
>   return greeting + ', ' + this.name + mark
> }
> const ann = { name: 'Ann' }
> greet.[[call]](ann, 'Hi', '!')       // викликати зараз, аргументи списком
> greet.[[apply]](ann, ['Hi', '!'])    // викликати зараз, аргументи масивом
> const hi = greet.[[bind]](ann, 'Hi') // нова функція на потім
> hi('?') // → 'Hi, Ann?'
> ```
>
> **Пояснення:** `call` і `apply` викликають функцію одразу й відрізняються лише формою аргументів. `bind` нічого не викликає — повертає обгортку з назавжди прив'язаним `this` і, за бажанням, першими аргументами (partial application).

### 4️⃣ `new` binding

Виклик через `new` створює **новий об'єкт** і підставляє його як `this` (покроковий алгоритм `new` — у [[JavaScript - 07. Прототипи та класи]]).

```js
function Person(name) {
  this.name = name;
}
const p = new Person('Ann');
p.name; // → 'Ann'
```

### 🏆 Пріоритет правил

Якщо до одного виклику застосовні кілька правил:

**`new` > explicit (`bind`/`call`/`apply`) > implicit (`obj.`) > default**

```js
const obj = { id: 'obj', getId };
obj.getId.call(b);   // → 'b'   — explicit сильніший за implicit

const Bound = Person.bind({ name: 'ignored' });
const q = new Bound('Ann');
q.name;              // → 'Ann' — new сильніший за bind
q instanceof Person; // → true
```

Цікаво: `new` ігнорує прив'язаний `this`, але **зберігає прив'язані аргументи** — `new (Person.bind(null, 'Partial'))()` створить `{ name: 'Partial' }`.

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-06-quiz-04
>
> ```js
> function Box(v) { this.v = v; }
> const target = { v: 'target' };
> const BoundBox = Box.bind(target);
> const box = new BoundBox('new');
> console.log(box.v, target.v);
> ```
>
> **Відповідь:** `new target`
>
> **Пояснення:** `new` має найвищий пріоритет: створюється новий об'єкт, і `this` всередині `Box` — він, а не `target`. Тому `target` лишився незмінним.

### ➡️ Стрілкові функції: `this` без правил

Стрілкові функції **не мають власного `this`**. Вони беруть його **лексично** — з оточення, де створені, так само як звичайну змінну через замикання. Жодне з чотирьох правил на них не діє:

- `call`/`apply`/`bind` не змінять `this` (аргументи передадуться);
- `new` неможливий: `TypeError: … is not a constructor`;
- також немає власних `arguments`, `super`, `new.target` і `prototype`.

```js
const team = {
  name: 'core',
  members: ['ann', 'bob'],
  list() {
    // this тут — team (implicit binding)
    return this.members.map((m) => `${m}@${this.name}`); // стрілка бере this з list
  },
};
team.list(); // → ['ann@core', 'bob@core']
```

> [!viz] this-binding
> scenario: arrow

Зі звичайною функцією всередині `map` `this` був би `undefined` (default binding у strict), і код упав би. До ES2015 писали `const self = this;` — по суті ручне замикання.

Зворотний бік: стрілка як **метод об'єкта** — майже завжди помилка. Об'єктний літерал не створює scope, тож `this` береться ззовні (модуль: `undefined`, класичний скрипт: `window`).

```js
const counter = {
  count: 0,
  inc: () => this.count++, // ❌ this — не counter, а зовнішній this
};
```

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-06-quiz-05
>
> ```js
> const o = {
>   name: 'o',
>   make() { return () => this.name; },
> };
> const fn = o.make();
> console.log(fn(), fn.call({ name: 'other' }));
> ```
>
> **Відповідь:** `o o`
>
> **Пояснення:** стрілку створено всередині `make`, викликаної як `o.make()`, тож вона назавжди бере `this === o`. `call` не може його змінити.

> [!quiz] Перевір себе: склади клас, у якому таймер справді збільшує `ticks`
> level: middle · type: order · id: jsd-06-quiz-08
>
> ```js order
> class Clock {
>   ticks = 0
>   start() {
>     setInterval(() => {
>       this.ticks++
>     }, 1000)
>   }
> }
>     setInterval(function () { // ✗
> ```
>
> **Пояснення:** стрілку створено всередині `start()`, яку викликають як `clock.start()`, тож її `this` — годинник, хоч би як таймер її викликав. Звичайну `function` таймер викликає сам — і `this` вже не годинник.

### 🏛️ `this` у класах і обробниках подій

**Класи** завжди виконуються в strict mode. Методи класу живуть у `prototype` і поводяться як звичайні функції: implicit binding при виклику через екземпляр, `undefined` — якщо метод відірвали.

**Class field зі стрілкою** створює окрему функцію для **кожного екземпляра** з `this`, прив'язаним до нього назавжди (стрілка створюється в конструкторі, де `this` — новий екземпляр):

```js
class Timer {
  seconds = 0;
  tick() { this.seconds++; }            // у Timer.prototype, спільний для всіх
  tickArrow = () => { this.seconds++; }; // власна властивість кожного екземпляра
}
const t = new Timer();
const { tick, tickArrow } = t;
tickArrow();   // ✅ t.seconds === 1
tick();        // ❌ TypeError: Cannot read properties of undefined (reading 'seconds')
```

Компроміс: стрілкові поля не «губляться», але займають пам'ять на кожен екземпляр, недоступні через `super.method()` і не тестуються через прототип.

> [!figure] devtools-console
> scenario: this-lost
>
> Метод класу, збережений у змінну, викликається без крапки: у strict mode `this` стає `undefined`, і консоль показує TypeError. `call` і `bind` повертають правильний `this`.

**Обробники подій DOM.** `addEventListener` викликає звичайну функцію з `this === event.currentTarget` (елемент, на якому висить слухач). Стрілка ж бере зовнішній `this`.

```js
button.addEventListener('click', function () {
  this.classList.toggle('active'); // this === button
});
button.addEventListener('click', () => {
  // this — зовнішній; використовуй event.currentTarget
});
```

> [!quiz] Перевір себе: оберіть правдиві твердження
> level: middle · type: multi · id: jsd-06-quiz-06
> - [x] Метод класу, переданий як callback без `bind`, отримає `this === undefined`
> - [ ] Тіло класу виконується в sloppy mode, тож `this` стане `window`
> - [x] Стрілкове class field створюється окремо для кожного екземпляра
> - [x] У слухачі `addEventListener` зі звичайною функцією `this` — це `event.currentTarget`
> - [ ] Стрілковий обробник події отримує `this === event.target`
>
> **Пояснення:** класи завжди strict, тому загублений метод отримує `undefined`. Стрілки не мають власного `this` — ні в class fields (там він захоплюється з конструктора), ні в обробниках.

## ⚠️ Пастки

> [!pitfall] Метод як callback
> Передаючи метод у `setTimeout`, `addEventListener`, `then`, `map`, ти передаєш **функцію без об'єкта**.
>
> ```js
> class Api {
>   base = '/api';
>   get(path) { return this.base + path; }
> }
> const api = new Api();
> ['/a', '/b'].map(api.get);                // ❌ TypeError
> ['/a', '/b'].map((p) => api.get(p));      // ✅
> ['/a', '/b'].map(api.get, api);           // ✅ thisArg
> ```

> [!pitfall] Звичайна функція всередині методу
> Вкладена `function` має **власний** `this` (default binding), а не `this` методу.
>
> ```js
> const counter = {
>   count: 0,
>   start() {
>     [1, 2, 3].forEach(function () {
>       this.count++; // ❌ this === undefined у strict
>     });
>   },
> };
> // ✅ стрілка: [1, 2, 3].forEach(() => this.count++)
> ```

> [!pitfall] `bind` у кожному рендері
> `fn.bind(this)` щоразу створює **нову** функцію. Передана в мемоізований компонент чи в `removeEventListener`, вона буде «іншою».
>
> ```js
> el.addEventListener('click', this.onClick.bind(this));
> el.removeEventListener('click', this.onClick.bind(this)); // ❌ не зніме — нова функція
> // ✅ зберегти: this.onClick = this.onClick.bind(this) у конструкторі
> ```

## 🎤 На співбесіді

> [!interview] Як визначається `this` у JavaScript?
> level: middle · frequency: дуже часто · id: jsd-06-int-01
>
> ---
>
> Для звичайних функцій `this` визначається **способом виклику**, а не місцем оголошення. Чотири правила за пріоритетом: **`new`** — новий об'єкт; **explicit** — `call`/`apply`/`bind` задають явно; **implicit** — `obj.method()` дає `obj`; **default** — `undefined` у strict mode або `globalThis` у sloppy. Стрілкові функції — виняток: власного `this` немає, вони беруть його лексично із зовнішнього scope, і жодне правило на них не діє. Типова пастка — «загублений this», коли метод передають як callback.
>
> 📚 [[JavaScript - 06. this#🎯 Головна ідея: this визначає виклик|Розділ: як визначається this]] · [MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) · [Spec: ResolveThisBinding](https://tc39.es/ecma262/#sec-resolvethisbinding)

> [!interview] Чим відрізняються `call`, `apply` і `bind`?
> level: junior · frequency: часто · id: jsd-06-int-02
>
> ---
>
> Усі три задають `this`. `call(thisArg, ...args)` і `apply(thisArg, argsArray)` викликають функцію **одразу** й відрізняються лише форматом аргументів. `bind(thisArg, ...args)` нічого не викликає, а **повертає нову функцію** з назавжди прив'язаним `this` і, опційно, частиною аргументів (partial application). Прив'язку `bind` не можна перебити ні повторним `bind`, ні `call` — лише `new` ігнорує прив'язаний `this`.
>
> 📚 [[JavaScript - 06. this#3️⃣ Explicit binding: call, apply, bind|Розділ: call, apply і bind]] · [MDN: Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) · [javascript.info: Decorators and forwarding, call/apply](https://javascript.info/call-apply-decorators)

> [!interview] Чому стрілкові функції не підходять для методів об'єкта, але ідеальні для callback-ів?
> level: middle · frequency: часто · id: jsd-06-int-03
>
> ---
>
> Стрілка не має власного `this` і бере його з оточення, де створена. Об'єктний літерал не створює scope, тому стрілка-метод отримує зовнішній `this` (модуль — `undefined`), а не об'єкт. А в callback-ах усередині методу це саме те, що треба: стрілка в `map` чи `setTimeout` бачить `this` методу, тоді як звичайна функція отримала б default binding. У класах стрілкове field дає метод, прив'язаний до екземпляра, ціною окремої функції на кожен екземпляр.
>
> 📚 [[JavaScript - 06. this#➡️ Стрілкові функції: this без правил|Розділ: стрілкові функції]] · [MDN: Arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) · [javascript.info: Arrow functions revisited](https://javascript.info/arrow-functions)

## 🔗 Зв'язки

- [[JavaScript - 04. Scope, hoisting і TDZ]] — змінні мають лексичний scope, а `this` звичайних функцій — ні; саме ця різниця породжує більшість плутанини.
- [[JavaScript - 05. Замикання]] — стрілкова функція захоплює `this` так само, як замикання захоплює змінну.
- [[JavaScript - 07. Прототипи та класи]] — `new` binding і методи в `prototype` — механіка, на якій тримаються класи.
- [[JavaScript - 14. Debounce, throttle та async-патерни]] — обгортки на кшталт `debounce` мають коректно передавати `this` через `fn.apply(this, args)`.

## ⚡ Фішки

> [!reel] 🎭 Дужки не гублять this, а кома — губить
> `(obj.fn)()` — це досі виклик методу. А `(0, obj.fn)()` — comma-оператор повертає «голу» функцію. Бандлери навмисно генерують `(0, _mod.fn)()`, щоб імпортована функція не отримала модуль як `this`.

> [!reel] 🔒 bind двічі — нічого не змінить
> Прив'язана функція ігнорує свій `this`. Друга прив'язка обгортає першу, але всередину все одно потрапляє перший об'єкт.
>
> ```js
> f.bind(a).bind(b)() // this === a
> ```

> [!reel] 💪 new перемагає bind
> Якщо викликати прив'язану функцію через `new`, прив'язаний `this` проігнорується — створиться новий об'єкт. А от прив'язані аргументи збережуться.

> [!reel] ⏱️ this у setTimeout залежить від середовища
> Звичайна функція-callback таймера в браузері отримає `window`, а в Node.js — об'єкт `Timeout`. Ще одна причина використовувати стрілки або `bind`.

> [!reel] 🏹 Стрілка — не конструктор
> У стрілок немає `prototype` і внутрішнього `[[Construct]]`, тож `new (() => {})` кидає `TypeError: … is not a constructor`.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Чому `this` у JS «залежить від виклику»?
> *дуже часто · теорія* · `jsd-06-001`
>
> Для звичайних функцій `this` — неявний параметр, який підставляється при виклику: через крапку — об'єкт перед нею, через `new` — новий об'єкт, через `call`/`apply`/`bind` — заданий, просто `fn()` — `undefined` (strict) або `globalThis`. Одна й та сама функція може мати різний `this` у різних викликах.
>
> 📚 [[JavaScript - 06. this#🎯 Головна ідея: this визначає виклик|Розділ: як визначається this]] · [MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) · [javascript.info: Object methods, "this"](https://javascript.info/object-methods)

> [!question]- Що буде з `this`, якщо передати метод як callback?
> *дуже часто · код* · `jsd-06-002`
>
> Він «загубиться»: передається лише функція, без об'єкта. Callback викликається як `fn()` → default binding (`undefined` у strict, `TypeError` при зверненні до властивостей). Рішення: `bind`, стрілкова обгортка або стрілкове class field.
>
> 📚 [[JavaScript - 06. this#2️⃣ Implicit binding|Розділ: implicit binding]] · [javascript.info: Function binding](https://javascript.info/bind) · [MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

> [!question]- Чи мають стрілкові функції власний `this`?
> *дуже часто · теорія* · `jsd-06-003`
>
> Ні. Вони беруть `this` з оточення, де створені (лексично). `call`, `apply`, `bind` і `new` не можуть його змінити.
>
> 📚 [[JavaScript - 06. this#➡️ Стрілкові функції: this без правил|Розділ: стрілкові функції]] · [MDN: Arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) · [Spec: OrdinaryCallBindThis](https://tc39.es/ecma262/#sec-ordinarycallbindthis)

### 🟡 Middle

> [!question]- Який пріоритет правил прив'язки `this`?
> *часто · теорія* · `jsd-06-004`
>
> `new` > explicit (`bind`/`call`/`apply`) > implicit (`obj.method()`) > default. Стрілкові функції — поза цією системою.
>
> 📚 [[JavaScript - 06. this#🏆 Пріоритет правил|Розділ: пріоритет правил]] · [MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) · [YDKJS: Objects & Classes](https://github.com/getify/You-Dont-Know-JS/tree/2nd-ed/objects-classes)

> [!question]- Чому `getId.bind(a).bind(b)()` повертає id об'єкта `a`?
> *іноді · код* · `jsd-06-005`
>
> Перша прив'язка створює bound function, яка завжди викликає оригінал з `a` і ігнорує свій власний `this`. Друга прив'язка змінює `this` лише для зовнішньої обгортки — а той не використовується.
>
> 📚 [[JavaScript - 06. this#3️⃣ Explicit binding: call, apply, bind|Розділ: bind]] · [MDN: Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) · [Spec: Function.prototype.bind](https://tc39.es/ecma262/#sec-function.prototype.bind)

> [!question]- Чим метод класу відрізняється від стрілкового class field щодо `this`?
> *часто · порівняння* · `jsd-06-006`
>
> Метод живе в `prototype`, спільний для всіх екземплярів, і `this` визначається викликом (губиться при передачі як callback). Стрілкове field створюється в конструкторі для кожного екземпляра й має `this`, назавжди прив'язаний до нього. Ціна — пам'ять на кожен екземпляр і відсутність у прототипі (не можна викликати через `super`).
>
> 📚 [[JavaScript - 06. this#🏛️ this у класах і обробниках подій|Розділ: this у класах]] · [MDN: Public class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields) · [MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

> [!question]- Яким буде `this` у слухачі `addEventListener`?
> *іноді · теорія* · `jsd-06-007`
>
> Для звичайної функції — `event.currentTarget`, тобто елемент, на якому зареєстровано слухач (не обов'язково `event.target`, де подія виникла). Для стрілки — зовнішній `this`, тож елемент беруть з `event.currentTarget`.
>
> 📚 [[JavaScript - 06. this#🏛️ this у класах і обробниках подій|Розділ: this в обробниках подій]] · [MDN: addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) · [MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

### 🔴 Senior

> [!question]- Чому бандлери компілюють виклик імпорту як `(0, _module.fn)()`?
> *рідко · код* · `jsd-06-008`
>
> Імпортована функція в ES-модулі викликається без об'єкта — `this === undefined`. Якщо скомпілювати її в `_module.fn()`, з'явиться implicit binding і `this` стане об'єктом модуля — інша семантика. Comma-оператор повертає саме значення функції, тож виклик знову «голий», як у специфікації.
>
> 📚 [[JavaScript - 06. this#2️⃣ Implicit binding|Розділ: implicit binding]] · [MDN: Comma operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comma_operator) · [MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

> [!question]- Як реалізувати спрощений `bind` самостійно?
> *іноді · код* · `jsd-06-009`
>
> ```js
> Function.prototype.myBind = function (ctx, ...preset) {
>   const fn = this;
>   return function (...args) {
>     return fn.apply(ctx, [...preset, ...args]);
>   };
> };
> ```
>
> Спрощено: справжній `bind` ще й поважає `new` (тоді `this` — новий об'єкт, а не `ctx`), не має `prototype`, і має `name` виду `"bound fn"` та коректний `length`.
>
> 📚 [[JavaScript - 06. this#3️⃣ Explicit binding: call, apply, bind|Розділ: bind]] · [MDN: Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) · [javascript.info: Function binding](https://javascript.info/bind)

## 🛠️ Практика

> [!task] Визнач `this`
> level: middle · difficulty: easy · id: jsd-06-task-01 · tags: this
>
> Код виконується в ES-модулі (strict). Для кожного рядка вкажи, що буде виведено (або помилку).
>
> ```js
> const shop = {
>   title: 'Shop',
>   getTitle() { return this?.title; },
>   getTitleArrow: () => this?.title,
>   delayed() { return [1].map(() => this.title)[0]; },
> };
> console.log(shop.getTitle());          // (1)
> console.log(shop.getTitleArrow());     // (2)
> const g = shop.getTitle;
> console.log(g());                      // (3)
> console.log(g.call({ title: 'Mall' })); // (4)
> console.log(shop.delayed());           // (5)
> ```
>
> Запиши п'ять результатів у масив `results` (значення як є: рядки в лапках, `undefined` — як `undefined`).
>
> ```js starter
> const results = [
>   // твій код: (1), (2), (3), (4), (5)
> ]
> ```
>
> ```js tests
> test('(1) метод через крапку — implicit binding', () => {
>   expect(results[0]).toBe('Shop')
> })
>
> test('(2) стрілка-метод бере this модуля', () => {
>   expect(results).toHaveLength(5)
>   expect(results[1]).toBeUndefined()
> })
>
> test('(3) «відірваний» метод у strict — default binding', () => {
>   expect(results).toHaveLength(5)
>   expect(results[2]).toBeUndefined()
> })
>
> test('(4) call задає this явно', () => {
>   expect(results[3]).toBe('Mall')
> })
>
> test('(5) стрілка всередині методу бере this методу', () => {
>   expect(results[4]).toBe('Shop')
> })
> ```
>
> > [!hint]- Підказка 1
> > Для кожного рядка знайди місце виклику й пройди правила від `new` до default.
>
> > [!hint]- Підказка 2
> > Який `this` на верхньому рівні ES-модуля?
>
> > [!solution]- Еталонне рішення
> > ```js
> > const results = [
> >   'Shop',    // (1) implicit binding
> >   undefined, // (2) стрілка бере this модуля (undefined), ?. рятує від помилки
> >   undefined, // (3) default binding у strict, ?. рятує від помилки
> >   'Mall',    // (4) explicit binding
> >   'Shop',    // (5) стрілка в map бере this методу delayed, викликаного як shop.delayed()
> > ]
> > ```

> [!task] Поясни своїми словами, чому стрілки «рятують» this
> level: middle · difficulty: medium · id: jsd-06-task-02 · tags: feynman, this, arrow-functions
>
> Поясни колезі, чому в цьому коді `clock.ticks` назавжди лишається `0` (помилки при цьому немає!), а заміна `function` на стрілку його лагодить. У поясненні має бути: що таке call-site, яке правило спрацьовує для звичайної функції, і чому для стрілки правила взагалі не застосовуються.
>
> ```js
> class Clock {
>   ticks = 0;
>   start() {
>     setInterval(function () { this.ticks++; }, 1000);
>   }
> }
> new Clock().start();
> ```
>
> > [!hint]- Підказка 1
> > Хто і як викликає функцію, передану в `setInterval`?
>
> > [!hint]- Підказка 2
> > Стрілка «пам'ятає» `this` так само, як замикання пам'ятає змінну. Чий `this` вона запам'ятає?
>
> > [!solution]- Еталонне пояснення
> > У звичайної функції `this` не належить їй назавжди — він визначається в момент виклику, у місці, де її викликають (call-site). Тут функцію викликаємо не ми, а таймер, і годинника він не знає. Браузер передає як `this` об'єкт `window`, Node.js — свій об'єкт `Timeout`. Тож `this.ticks++` щосекунди записує `NaN` у властивість **чужого** об'єкта (`undefined + 1`), а `clock.ticks` ніхто не чіпає. Помилки немає — тому такий баг особливо підступний. (Якби callback викликали «голим» у strict mode, `this` був би `undefined` і ми б хоча б отримали `TypeError`.)
> >
> > Стрілка не має власного `this` — правила виклику до неї не застосовуються взагалі. Вона бере `this` з місця, де її **створили**, точно як замикання бере зовнішню змінну. Створили її всередині `start()`, яку викликали як `clock.start()`, тож `this` там — годинник. Хоч таймер викликатиме стрілку як завгодно, вона завжди звертатиметься до годинника.

> [!task] Реалізуй повноцінний `bind` з підтримкою `new`
> level: senior · difficulty: hard · id: jsd-06-task-03 · tags: this, bind, prototypes
>
> Напиши `bindPolyfill(fn, ctx, ...preset)`, який поводиться як `fn.bind(ctx, ...preset)`, включно з викликом через `new`: тоді `this` має бути новим об'єктом, `instanceof fn` — `true`, а прив'язані аргументи — зберігатися.
>
> ```js
> function Point(x, y) { this.x = x; this.y = y; }
> const BoundPoint = bindPolyfill(Point, { ignored: true }, 1);
> const p = new BoundPoint(2);
> p.x === 1 && p.y === 2 && p instanceof Point; // → true
> bindPolyfill(function () { return this.v; }, { v: 7 })(); // → 7
> ```
>
> ```js starter
> function bindPolyfill(fn, ctx, ...preset) {
>   // твій код
> }
> ```
>
> ```js tests
> test('звичайний виклик використовує ctx', () => {
>   const getV = bindPolyfill(function () { return this.v }, { v: 7 })
>   expect(getV()).toBe(7)
> })
>
> test('прив\'язані аргументи йдуть перед новими', () => {
>   const join = bindPolyfill(function (...xs) { return this.sep + xs.join(this.sep) }, { sep: '-' }, 'a', 'b')
>   expect(join('c')).toBe('-a-b-c')
> })
>
> test('this не можна перебити через call', () => {
>   const getV = bindPolyfill(function () { return this.v }, { v: 1 })
>   expect(getV.call({ v: 2 })).toBe(1)
> })
>
> test('new створює новий обʼєкт, ігнорує ctx і зберігає аргументи', () => {
>   function Point(x, y) { this.x = x; this.y = y }
>   const ctx = { ignored: true }
>   const BoundPoint = bindPolyfill(Point, ctx, 1)
>   const p = new BoundPoint(2)
>   expect(p.x).toBe(1)
>   expect(p.y).toBe(2)
>   expect(p).toBeInstanceOf(Point)
>   expect(ctx.x).toBeUndefined()
> })
>
> test('не використовує вбудований bind', () => {
>   expect(bindPolyfill.toString()).not.toMatch(/\.bind\(/)
> })
> ```
>
> > [!hint]- Підказка 1
> > Як усередині обгортки дізнатися, що її викликали через `new`? Подивись на `new.target`.
>
> > [!hint]- Підказка 2
> > При `new` найпростіше делегувати оригіналу: `Reflect.construct(fn, args)` — і `instanceof` спрацює автоматично.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function bindPolyfill(fn, ctx, ...preset) {
> >   return function bound(...args) {
> >     const all = [...preset, ...args];
> >     if (new.target) {
> >       return Reflect.construct(fn, all); // new ігнорує ctx
> >     }
> >     return fn.apply(ctx, all);
> >   };
> > }
> > ```
> >
> > `new.target` дорівнює `undefined` при звичайному виклику і посилається на функцію при `new`. У цьому разі ми не використовуємо `ctx` (пріоритет `new` > explicit), а створюємо об'єкт через `Reflect.construct(fn, …)` — він отримує `fn.prototype` як прототип, тож `instanceof Point` — `true`. Повернення об'єкта з конструктора замінює `this`, створений для `bound`, — тому результат `new BoundPoint` і є цей об'єкт.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Object methods, "this"](https://javascript.info/object-methods) — `this` у методах і чому його значення визначає виклик.
- 🟢 [javascript.info — Function binding](https://javascript.info/bind) — втрата `this` у callback-ах і `bind` як рішення.
- 🟡 [MDN — this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) — повний довідник: функції, класи, стрілки, обробники подій.
- 🟡 [MDN — Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) — bound functions, часткове застосування і взаємодія з `new`.
- 🟡 [MDN — Arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) — чому у стрілок немає власного `this` і коли це перевага.
- 🟡 [YDKJS — Objects & Classes](https://github.com/getify/You-Dont-Know-JS/tree/2nd-ed/objects-classes) — чотири правила прив'язки `this` і їхній пріоритет.
- 🔴 [ECMAScript — OrdinaryCallBindThis](https://tc39.es/ecma262/#sec-ordinarycallbindthis) — як рушій прив'язує `this` під час виклику (і пропускає для стрілок).
- 🔴 [ECMAScript — ResolveThisBinding](https://tc39.es/ecma262/#sec-resolvethisbinding) — звідки береться значення `this` у виразі.

> [!important] Підсумок
> - `this` звичайної функції визначається **способом виклику**, а не місцем оголошення.
> - Чотири правила за пріоритетом: `new` > explicit (`call`/`apply`/`bind`) > implicit (`obj.fn()`) > default (`undefined` у strict, `globalThis` у sloppy).
> - Метод, відірваний від об'єкта (callback, змінна, деструктуризація), втрачає `this`; лікується `bind`, стрілковою обгорткою або стрілковим class field.
> - Стрілки не мають власного `this` — беруть його лексично; `call`/`bind`/`new` на них не діють.
> - Класи завжди strict; у DOM-слухачі звичайна функція отримує `this === event.currentTarget`.
