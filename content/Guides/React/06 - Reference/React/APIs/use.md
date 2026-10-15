# `use`

## Огляд

`use` — це API React, який дозволяє прочитати значення ресурсу, такого як [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) або [контекст](/learn/passing-data-deeply-with-context).

```js
const value = use(resource);
```

---

## Довідка

### `use(resource)`

Викликайте `use` у вашому компоненті для читання значення ресурсу, такого як Promise або контекст.

```jsx
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```

На відміну від хуків React, `use` можна викликати всередині циклів та умовних операторів, таких як `if`. Як і хуки React, функція, що викликає `use`, повинна бути компонентом або хуком.

При виклику з Promise, API `use` інтегрується з [`Suspense`](/reference/react/Suspense) та [Error Boundaries](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Компонент, що викликає `use`, *призупиняється*, поки Promise, переданий в `use`, очікує. Якщо компонент, що викликає `use`, обгорнутий у межу Suspense, буде відображено fallback. Після вирішення Promise fallback Suspense замінюється відрендереними компонентами з даними, повернутими API `use`. Якщо Promise, переданий в `use`, відхилено, буде відображено fallback найближчої межі помилок (Error Boundary).

#### Параметри

- `resource`: джерело даних, з якого ви хочете прочитати значення. Ресурс може бути Promise або контекстом.

#### Повертає

API `use` повертає значення, прочитане з ресурсу, таке як вирішене значення Promise або контексту.

#### Застереження

- API `use` повинен викликатися всередині компонента або хука.
- При отриманні даних у [Server Component](/reference/rsc/server-components) надавайте перевагу `async` та `await` замість `use`. `async` та `await` продовжують рендеринг з точки, де було викликано `await`, тоді як `use` перерендерює компонент після вирішення даних.
- Надавайте перевагу створенню Promises у [Server Components](/reference/rsc/server-components) та передачі їх у [Client Components](/reference/rsc/use-client) замість створення Promises у Client Components. Promises, створені у Client Components, повторно створюються при кожному рендері. Promises, передані з Server Component у Client Component, стабільні між повторними рендерами.

---

## Використання

### Читання контексту за допомогою `use`

Коли [контекст](/learn/passing-data-deeply-with-context) передається в `use`, він працює подібно до [`useContext`](/reference/react/useContext). Тоді як `useContext` повинен викликатися на верхньому рівні вашого компонента, `use` можна викликати всередині умовних операторів `if` та циклів `for`. `use` є кращим вибором порівняно з `useContext`, оскільки він більш гнучкий.

```js
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ...
}
```

`use` повертає значення контексту для контексту, який ви передали. Для визначення значення контексту React шукає в дереві компонентів та знаходить **найближчий провайдер контексту вище** для цього конкретного контексту.

Щоб передати контекст до `Button`, обгорніть його або один з його батьківських компонентів у відповідний провайдер контексту.

```js
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Form() {
  // ... рендерить кнопки всередині ...
}
```

Не має значення, скільки шарів компонентів між провайдером та `Button`. Коли `Button` *де завгодно* всередині `Form` викликає `use(ThemeContext)`, він отримає `"dark"` як значення.

На відміну від [`useContext`](/reference/react/useContext), `use` можна викликати в умовних операторах та циклах.

```js
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
```

`use` викликається зсередини оператора `if`, що дозволяє умовно читати значення з контексту.

> **Увага**: Як і `useContext`, `use(context)` завжди шукає найближчий провайдер контексту *над* компонентом, що його викликає. Він шукає вгору і **не** враховує провайдери контексту в компоненті, з якого ви викликаєте `use(context)`.

#### Приклад: Контекст з умовним рендерингом

```js
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button show={true}>Sign up</Button>
      <Button show={false}>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = use(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ show, children }) {
  if (show) {
    const theme = use(ThemeContext);
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {children}
      </button>
    );
  }
  return false
}
```

---

### Потокова передача даних з сервера на клієнт

Дані можна передавати потоком з сервера на клієнт, передаючи Promise як проп з Server Component у Client Component.

```js
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

Client Component потім бере Promise, отриманий як проп, та передає його в API `use`. Це дозволяє Client Component прочитати значення з Promise, який був спочатку створений Server Component.

```js
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```

Оскільки `Message` обгорнуто у [`Suspense`](/reference/react/Suspense), fallback відображатиметься до вирішення Promise. Коли Promise вирішиться, значення буде прочитано API `use`, і компонент `Message` замінить fallback Suspense.

#### Приклад: Потокова передача даних

```js
// message.js
"use client";

import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

> **Примітка**: При передачі Promise з Server Component у Client Component його вирішене значення повинно бути серіалізованим для передачі між сервером та клієнтом. Типи даних, такі як функції, не серіалізуються та не можуть бути вирішеним значенням такого Promise.

#### Чи слід вирішувати Promise у Server або Client Component?

Promise можна передати з Server Component у Client Component та вирішити в Client Component за допомогою API `use`. Ви також можете вирішити Promise у Server Component за допомогою `await` та передати необхідні дані в Client Component як проп.

```js
export default async function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />
}
```

Але використання `await` у [Server Component](/reference/rsc/server-components) заблокує його рендеринг до завершення оператора `await`. Передача Promise з Server Component у Client Component запобігає блокуванню рендерингу Server Component Promise.

---

### Обробка відхилених Promises

У деяких випадках Promise, переданий в `use`, може бути відхилено. Ви можете обробити відхилені Promises одним з двох способів:

1. Відображення помилки користувачам за допомогою Error Boundary.
2. Надання альтернативного значення за допомогою `Promise.catch`

> **Увага**: `use` не можна викликати в блоці try-catch. Замість блоку try-catch обгорніть компонент у Error Boundary або надайте альтернативне значення за допомогою методу `.catch` Promise.

#### Відображення помилки користувачам за допомогою Error Boundary

Якщо ви хочете відобразити помилку вашим користувачам при відхиленні Promise, ви можете використати [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Щоб використати Error Boundary, обгорніть компонент, де ви викликаєте API `use`, у Error Boundary. Якщо Promise, переданий в `use`, відхилено, буде відображено fallback для Error Boundary.

```js
// message.js
"use client";

import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function MessageContainer({ messagePromise }) {
  return (
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <Suspense fallback={<p>Downloading message...</p>}>
        <Message messagePromise={messagePromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Here is the message: {content}</p>;
}
```

#### Надання альтернативного значення за допомогою `Promise.catch`

Якщо ви хочете надати альтернативне значення при відхиленні Promise, переданого в `use`, ви можете використати метод [`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) Promise.

```js
import { Message } from './message.js';

export default function App() {
  const messagePromise = new Promise((resolve, reject) => {
    reject();
  }).catch(() => {
    return "no new message found.";
  });

  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

Щоб використати метод `catch` Promise, викличте `catch` на об'єкті Promise. `catch` приймає один аргумент: функцію, що приймає повідомлення про помилку як аргумент. Що б не повернула функція, передана в `catch`, буде використано як вирішене значення Promise.

---

## Усунення проблем

### "Suspense Exception: This is not a real error!"

Ви або викликаєте `use` поза компонентом чи функцією-хуком React, або викликаєте `use` в блоці try-catch. Якщо ви викликаєте `use` всередині блоку try-catch, обгорніть компонент у Error Boundary або викличте `catch` Promise для перехоплення помилки та вирішення Promise з іншим значенням.

Якщо ви викликаєте `use` поза компонентом чи функцією-хуком React, перемістіть виклик `use` у компонент або функцію-хук React.

```jsx
// Неправильно
function MessageComponent({messagePromise}) {
  function download() {
    // функція, що викликає `use`, не є компонентом або хуком
    const message = use(messagePromise);
    // ...
  }
}

// Правильно
function MessageComponent({messagePromise}) {
  // `use` викликається з компонента.
  const message = use(messagePromise);
  // ...
}
```

Натомість викликайте `use` поза будь-якими замиканнями компонентів, де функція, що викликає `use`, є компонентом або хуком.
