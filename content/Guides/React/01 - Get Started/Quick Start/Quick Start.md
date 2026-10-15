# Швидкий старт з React

## Вступ

Ласкаво просимо до документації React! Ця сторінка знайомить вас з 80% концепцій React, які ви будете використовувати щодня.

### Ви дізнаєтесь
- Як створювати та вкладати компоненти
- Як додавати розмітку та стилі
- Як відображати дані
- Як рендерити умови та списки
- Як реагувати на події та оновлювати екран
- Як ділитися даними між компонентами

---

## Створення та вкладення компонентів

Застосунки React складаються з **компонентів**. Компонент — це частина інтерфейсу, яка має власну логіку та зовнішній вигляд — від маленької кнопки до цілої сторінки.

Компоненти React — це JavaScript-функції, які повертають розмітку:

```js
function MyButton() {
  return (
    <button>Я кнопка</button>
  );
}
```

Ви можете вкладати компоненти в інші компоненти:

```js
export default function MyApp() {
  return (
    <div>
      <h1>Ласкаво просимо до мого застосунку</h1>
      <MyButton />
    </div>
  );
}
```

**Важливо:** `<MyButton />` починається з великої літери — це вказує, що це компонент React. Назви компонентів React завжди повинні починатися з великої літери, тоді як HTML-теги мають бути в нижньому регістрі.

Ключові слова `export default` вказують головний компонент у файлі.

---

## Написання розмітки з JSX

Синтаксис розмітки, показаний вище, називається **JSX**. Він необов'язковий, але більшість проєктів React використовують його для зручності.

**Правила JSX:**
- JSX суворіший за HTML
- Ви повинні закривати теги, наприклад `<br />`
- Компоненти не можуть повертати кілька JSX-тегів — оберніть їх у спільний батьківський елемент, як `<div>...</div>` або порожній обгортку `<>...</>`:

```js
function AboutPage() {
  return (
    <>
      <h1>Про нас</h1>
      <p>Привіт.<br />Як справи?</p>
    </>
  );
}
```

**Порада:** Якщо у вас багато HTML для конвертації в JSX, використовуйте [онлайн-конвертер](https://transform.tools/html-to-jsx).

---

## Додавання стилів

У React CSS-клас вказується за допомогою `className` (аналог HTML-атрибуту `class`):

```js
<img className="avatar" />
```

Правила CSS пишуться в окремому CSS-файлі:

```css
/* У вашому CSS */
.avatar {
  border-radius: 50%;
}
```

React не диктує, як додавати CSS-файли. У найпростішому випадку додайте тег `<link>` у ваш HTML. Якщо ви використовуєте інструмент збірки або фреймворк, зверніться до його документації.

---

## Відображення даних

JSX дозволяє вставляти розмітку в JavaScript. Фігурні дужки дозволяють "повернутися" до JavaScript для вбудовування змінних:

```js
return (
  <h1>
    {user.name}
  </h1>
);
```

Ви також можете використовувати фігурні дужки замість лапок для атрибутів:
- `className="avatar"` передає рядок `"avatar"`
- `src={user.imageUrl}` передає значення JavaScript-змінної

```js
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

Ви можете розміщувати складні вирази всередині фігурних дужок JSX, включаючи конкатенацію рядків:

```js
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://react.dev/images/docs/scientists/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Фото ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

**Примітка:** `style={{}}` — це звичайний об'єкт всередині фігурних дужок JSX `style={ }`. Використовуйте атрибут `style`, коли стилі залежать від JavaScript-змінних.

---

## Умовний рендеринг

React не має спеціального синтаксису для умов. Використовуйте звичайні техніки JavaScript, такі як оператори `if`:

```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```

Для більш компактного коду використовуйте умовний оператор `?` (працює всередині JSX):

```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

Коли вам не потрібна гілка `else`, використовуйте логічний оператор `&&`:

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

Усі підходи працюють також для умовного задання атрибутів.

---

## Рендеринг списків

Використовуйте можливості JavaScript, такі як цикли `for` та функцію масиву `map()`, для рендерингу списків.

Наприклад, маючи масив продуктів:

```js
const products = [
  { title: 'Капуста', id: 1 },
  { title: 'Часник', id: 2 },
  { title: 'Яблуко', id: 3 },
];
```

Використовуйте `map()` для перетворення масиву в елементи `<li>`:

```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

**Важливо:** Кожен елемент списку потребує атрибуту `key` — рядок або число, яке унікально ідентифікує цей елемент серед його сусідів. Зазвичай це дані з бази даних (наприклад, ID). React використовує ключі для відстеження змін при вставці, видаленні або переупорядкуванні елементів.

```js
const products = [
  { title: 'Капуста', isFruit: false, id: 1 },
  { title: 'Часник', isFruit: false, id: 2 },
  { title: 'Яблуко', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

---

## Реагування на події

Оголошуйте функції-**обробники подій** всередині компонентів:

```js
function MyButton() {
  function handleClick() {
    alert('Ви натиснули на мене!');
  }

  return (
    <button onClick={handleClick}>
      Натисни мене
    </button>
  );
}
```

**Важливо:** `onClick={handleClick}` без дужок! Не викликайте функцію — просто передайте її. React викличе її, коли користувач натисне.

---

## Оновлення екрану

Щоб компоненти "запам'ятовували" інформацію, додайте **state** за допомогою hook `useState`.

Спочатку імпортуйте `useState` з React:

```js
import { useState } from 'react';
```

Оголосіть змінну state всередині вашого компонента:

```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

`useState` повертає дві речі:
- Поточне значення state (`count`)
- Функцію для його оновлення (`setCount`)

Конвенція: пишіть `[something, setSomething]`.

При першому відображенні `count` дорівнює `0` (значення, передане в `useState()`). Викличте `setCount()` з новим значенням для оновлення:

```js
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Натиснуто {count} разів
    </button>
  );
}
```

React повторно викличе вашу функцію-компонент. Цього разу `count` буде `1`, потім `2` і т.д.

Якщо ви рендерите один і той самий компонент кілька разів, кожен отримує власний state:

```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Лічильники, що оновлюються окремо</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Натиснуто {count} разів
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

Кожна кнопка "запам'ятовує" свій власний `count` і не впливає на інші.

---

## Використання Hooks

Функції, що починаються з `use`, називаються **Hooks**. `useState` — це вбудований Hook. Знайдіть інші в [довіднику API](/reference/react). Ви можете писати власні Hooks, комбінуючи існуючі.

**Обмеження:** Ви можете викликати Hooks тільки на верхньому рівні компонентів (або інших Hooks). Щоб використовувати `useState` в умові або циклі, витягніть новий компонент і помістіть його туди.

---

## Обмін даними між компонентами

У попередньому прикладі кожен `MyButton` мав незалежний state `count`. Однак часто потрібно, щоб компоненти **ділилися даними та оновлювалися разом**.

Щоб кілька компонентів `MyButton` відображали та оновлювали одне й те саме значення `count`, перемістіть state "вгору" до найближчого компонента, що містить їх усіх (у цьому випадку `MyApp`).

**Крок 1:** Перемістіть state з `MyButton` до `MyApp`:

```js
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Лічильники, що оновлюються окремо</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... ми переміщуємо код звідси ...
}
```

**Крок 2:** Передайте state з `MyApp` до кожного `MyButton` разом зі спільним обробником натискання через props:

```js
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Лічильники, що оновлюються разом</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

Інформація, передана таким чином, називається **props**.

**Крок 3:** Змініть `MyButton`, щоб він читав props від батьківського компонента:

```js
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Натиснуто {count} разів
    </button>
  );
}
```

При натисканні кнопки спрацьовує обробник `onClick`, який виконує функцію `handleClick` з `MyApp`. Це викликає `setCount(count + 1)`, збільшуючи state. Нове значення `count` передається як prop обом кнопкам, тому вони відображають оновлене значення. **Це називається "підняття state вгору" (lifting state up).**

```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Лічильники, що оновлюються разом</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Натиснуто {count} разів
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

---

## Наступні кроки

Тепер ви знаєте основи написання коду React! Перегляньте [Підручник](/learn/tutorial-tic-tac-toe), щоб попрактикуватися та створити свій перший міні-застосунок з React.
