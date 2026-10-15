# 'use server'

## Огляд

`'use server'` позначає серверні функції, які можуть бути викликані з клієнтського коду. Використовується з React Server Components для створення Server Functions.

## Довідка

### `'use server'`

Додайте `'use server'` на початку тіла async функції, щоб позначити функцію як доступну для виклику клієнтом.

```js
async function addToCart(data) {
  'use server';
  // ...
}
```

При виклику Server Function на клієнті виконується мережевий запит до сервера з серіалізованими аргументами. Повернуте значення серіалізується та повертається клієнту.

Ви також можете додати директиву на початку файлу, щоб позначити всі exports як Server Functions:

```js
'use server';

export async function functionOne() { }
export async function functionTwo() { }
```

#### Застереження

- `'use server'` повинен бути на самому початку функції або модуля, перед будь-яким іншим кодом (коментарі допускаються)
- Повинні використовуватися одинарні або подвійні лапки, не зворотні
- Може використовуватися лише в серверних файлах
- Server Functions можуть передаватися до Client Components через props
- Для імпорту Server Function з клієнтського коду використовуйте директиву на рівні модуля
- Може використовуватися лише з async функціями через асинхронні мережеві виклики
- Завжди розглядайте аргументи як ненадійний ввід та авторизуйте мутації
- Повинні викликатися в Transition
- Призначені для мутацій, а не для отримання даних
- Фреймворки зазвичай обробляють одну дію за раз без кешування повернутих значень

## Міркування щодо безпеки

Аргументи Server Functions повністю контролюються клієнтом. **Завжди розглядайте їх як ненадійний ввід** та відповідно валідуйте/екрануйте.

Завжди перевіряйте, що авторизований користувач має право виконати запитувану дію.

**Експериментальні Taint API** (для запобігання витоку конфіденційних даних):
- `experimental_taintUniqueValue`
- `experimental_taintObjectReference`

## Серіалізовані аргументи та повернуті значення

Оскільки виклики відбуваються через мережу, аргументи повинні бути серіалізованими.

### Підтримувані типи

**Примітиви:**
- string, number, bigint, boolean, undefined, null
- symbol (лише глобально зареєстровані через `Symbol.for`)

**Iterable з серіалізованими значеннями:**
- String, Array, Map, Set
- TypedArray та ArrayBuffer

**Інші підтримувані типи:**
- Date
- Екземпляри FormData
- Прості об'єкти (з серіалізованими властивостями)
- Функції, що є Server Functions
- Promises

### Не підтримуються

- React елементи або JSX
- Функції (крім Server Functions)
- Класи та екземпляри класів (крім вбудованих)
- Об'єкти з null prototype
- Не глобально зареєстровані символи
- Events з event handlers

## Використання

### Server Functions у формах

Найпоширеніший випадок використання — мутація даних через форми.

```js
// App.js
async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Request</button>
    </form>
  );
}
```

Коли користувач відправляє форму, React відправляє FormData форми до Server Function. Це забезпечує **progressive enhancement** — форми працюють до завантаження JavaScript.

#### Обробка повернутих значень у формах

Використовуйте `useActionState` для обробки результатів Server Function:

```js
// requestUsername.js
'use server';

export default async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    return 'successful';
  }
  return 'failed';
}
```

```js
// UsernameForm.js
'use client';

import { useActionState } from 'react';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [state, action] = useActionState(requestUsername, null, 'n/a');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">Request</button>
      </form>
      <p>Last submission request returned: {state}</p>
    </>
  );
}
```

`useActionState` може викликатися лише в клієнтському коді.

### Виклик Server Function поза `<form>`

Server Functions є серверними endpoints та можуть бути викликані будь-де в клієнтському коді. Використовуйте `useTransition`:

```js
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };

  return (
    <>
      <p>Total Likes: {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>Like</button>
    </>
  );
}
```

```js
// actions.js
'use server';

let likeCount = 0;
export default async function incrementLike() {
  likeCount++;
  return likeCount;
}
```

**Примітка:** Await promise, повернутий Server Functions, для читання поверненого значення.
