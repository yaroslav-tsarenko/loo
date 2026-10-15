# Умовний рендеринг

## Огляд

Ваші компоненти React часто потребують відображення різного контенту залежно від умов. React використовує стандартний синтаксис JavaScript, такий як оператори `if`, `&&` та `? :` для умовного рендерингу.

### Цілі навчання
- Повертати різний JSX залежно від умов
- Умовно включати або виключати фрагменти JSX
- Розпізнавати поширений умовний синтаксис у кодових базах React

---

## Умовне повернення JSX

### Базовий паттерн з `if`/`else`

Коли prop визначає, що рендерити, використовуйте умовні оператори:

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✅</li>;
  }
  return <li className="item">{name}</li>;
}
```

Це повертає різні дерева JSX залежно від значення prop `isPacked`.

### Повернення нічого з `null`

Щоб умовно нічого не рендерити, поверніть `null`:

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}
```

> **Примітка:** Повернення `null` є нечастим на практиці. Краще умовно включати/виключати компоненти в JSX батьківського компонента.

---

## Умовне включення JSX

### Зменшення дублювання коду

Замість дублювання подібного JSX у кількох гілках, вбудовуйте умови в єдину структуру JSX.

### Умовний (тернарний) оператор (`? :`)

Тернарний оператор забезпечує компактний умовний синтаксис:

```js
return (
  <li className="item">
    {isPacked ? name + ' ✅' : name}
  </li>
);
```

Читається як: "якщо `isPacked` true, рендерити `name + ' ✅'`, інакше рендерити `name`"

#### Складний тернарний оператор з вкладеним JSX

```js
return (
  <li className="item">
    {isPacked ? (
      <del>
        {name + ' ✅'}
      </del>
    ) : (
      name
    )}
  </li>
);
```

**Найкраща практика:** Використовуйте тернарні оператори для простих умов. Для складної вкладеної розмітки розгляньте можливість витягнення дочірніх компонентів.

### Логічний оператор AND (`&&`)

Використовуйте `&&`, коли хочете рендерити JSX, якщо умова true, інакше — нічого:

```js
return (
  <li className="item">
    {name} {isPacked && '✅'}
  </li>
);
```

Читається як: "якщо `isPacked`, рендерити галочку, інакше — нічого"

**Поведінка JavaScript:** Вираз `&&` повертає правий бік, якщо лівий — `true`. React трактує `false`, `null` та `undefined` як "дірки" в дереві JSX і нічого не рендерить.

#### Увага: Числа та `&&`

Не ставте числа з лівого боку `&&`:

```js
// ❌ Неправильно — рендерить 0, коли messageCount дорівнює 0
messageCount && <p>New messages</p>

// ✅ Правильно — перетворює лівий бік на boolean
messageCount > 0 && <p>New messages</p>
```

JavaScript перетворює лівий бік на boolean, але якщо це `0`, React рендерить `0` замість нічого.

### Умовне присвоєння JSX змінній

Для максимальної гнучкості та читабельності, особливо зі складною логікою, використовуйте оператори `if` зі змінною:

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✅";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}
```

Цей підхід працює з довільним JSX:

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✅"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}
```

**Перевага:** Найбільш багатослівний, але найбільш гнучкий підхід, особливо для складних умов.

---

## Підсумок

- Керуйте логікою розгалуження за допомогою JavaScript в React
- Повертайте JSX умовно за допомогою операторів `if`
- Зберігайте JSX у змінні та включайте через фігурні дужки
- **Тернарний оператор:** `{cond ? <A /> : <B />}` означає "якщо `cond`, рендерити `<A />`, інакше `<B />`"
- **Логічний AND:** `{cond && <A />}` означає "якщо `cond`, рендерити `<A />`, інакше нічого"
- Скорочення є поширеними, але необов'язковими — використовуйте звичайний `if`, коли вважаєте за потрібне

---

## Практичні завдання

### Завдання 1: Покажіть іконку для незапакованих елементів

Використовуйте умовний оператор для рендерингу ❌, якщо `isPacked` не true (разом з ✅ для запакованих елементів).

**Рішення:**
```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✅' : '❌'}
    </li>
  );
}
```

### Завдання 2: Покажіть важливість елемента з `&&`

Рендеріть "_(Importance: X)_" курсивом для елементів з ненульовою важливістю, використовуючи `&&`.

**Рішення:**
```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}
```

**Ключовий момент:** Використовуйте `importance > 0 && ...` замість `importance && ...`, щоб уникнути рендерингу `0`.

### Завдання 3: Рефакторинг серії `? :` на `if` та змінні

Перетворіть кілька тернарних умов на один оператор `if` зі згрупованими змінними.

**Рішення:**
```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'leaf';
    caffeine = '15–70 mg/cup';
    age = '4,000+ years';
  } else if (name === 'coffee') {
    part = 'bean';
    caffeine = '80–185 mg/cup';
    age = '1,000+ years';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{part}</dd>
        <dt>Caffeine content</dt>
        <dd>{caffeine}</dd>
        <dt>Age</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}
```

**Альтернатива (на основі об'єктів):**
```js
const drinks = {
  tea: {
    part: 'leaf',
    caffeine: '15–70 mg/cup',
    age: '4,000+ years'
  },
  coffee: {
    part: 'bean',
    caffeine: '80–185 mg/cup',
    age: '1,000+ years'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{info.part}</dd>
        <dt>Caffeine content</dt>
        <dd>{info.caffeine}</dd>
        <dt>Age</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}
```
