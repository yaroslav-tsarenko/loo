# useFormStatus

## Огляд

`useFormStatus` — це React Hook з `react-dom`, який надає інформацію про статус останньої відправки форми.

```js
const { pending, data, method, action } = useFormStatus();
```

---

## Довідка

### `useFormStatus()`

Hook `useFormStatus` надає інформацію про статус останньої відправки форми.

```js
import { useFormStatus } from "react-dom";
import action from './actions';

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>Submit</button>
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

Компонент `Submit` повинен бути рендерений всередині `<form>`, щоб отримати інформацію про статус. Hook повертає властивості, такі як `pending`, які вказують, чи форма активно відправляється.

#### Параметри

`useFormStatus` не приймає жодних параметрів.

#### Повертає

Об'єкт `status` з наступними властивостями:

- **`pending`**: Булеве значення. Якщо `true`, батьківська `<form>` очікує на відправку. Інакше `false`.

- **`data`**: Об'єкт, що реалізує [інтерфейс `FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData), який містить дані, що відправляє батьківська `<form>`. Якщо немає активної відправки або батьківської `<form>`, значення буде `null`.

- **`method`**: Рядок зі значенням `'get'` або `'post'`. Вказує, чи батьківська `<form>` відправляється за допомогою HTTP-методу `GET` або `POST`. За замовчуванням `<form>` використовує метод `GET`, і його можна змінити за допомогою властивості [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method).

- **`action`**: Посилання на функцію, передану в prop `action` батьківської `<form>`. Якщо батьківської `<form>` немає, властивість буде `null`. Якщо в prop `action` передано URL-значення або `action` не вказано, `status.action` буде `null`.

#### Застереження

- Hook `useFormStatus` повинен викликатися з компонента, який рендериться всередині `<form>`.
- `useFormStatus` повертає інформацію про статус лише для батьківської `<form>`. Він не повертає інформацію про статус для будь-якої `<form>`, що рендериться в тому ж компоненті або дочірніх компонентах.

---

## Використання

### Відображення стану очікування під час відправки форми

Щоб відобразити стан очікування під час відправки форми, викличте Hook `useFormStatus` у компоненті, що рендериться в `<form>`, і прочитайте повернуту властивість `pending`.

```js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

#### Підводний камінь

`useFormStatus` не повертає інформацію про статус для `<form>`, що рендериться в тому ж компоненті.

Hook `useFormStatus` повертає інформацію про статус лише для батьківської `<form>`, а не для будь-якої `<form>`, що рендериться в тому ж компоненті, що викликає Hook, або дочірніх компонентах.

**Неправильно:**
```js
function Form() {
  // `pending` ніколи не буде true
  // useFormStatus не відстежує форму, що рендериться в цьому компоненті
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

**Правильно:**
```js
function Submit() {
  // `pending` буде визначено з форми, що обгортає компонент Submit
  const { pending } = useFormStatus();
  return <button disabled={pending}>...</button>;
}

function Form() {
  // Це та <form>, яку відстежує useFormStatus
  return (
    <form action={submit}>
      <Submit />
    </form>
  );
}
```

### Читання даних форми, що відправляються

Ви можете використовувати властивість `data` з інформації про статус, що повертається з `useFormStatus`, щоб відобразити, які дані відправляє користувач.

```js
import {useState, useMemo, useRef} from 'react';
import {useFormStatus} from 'react-dom';

export default function UsernameForm() {
  const {pending, data} = useFormStatus();

  return (
    <div>
      <h3>Request a Username: </h3>
      <input type="text" name="username" disabled={pending}/>
      <button type="submit" disabled={pending}>
        Submit
      </button>
      <br />
      <p>{data ? `Requesting ${data?.get("username")}...`: ''}</p>
    </div>
  );
}
```

У батьківському компоненті:

```js
import UsernameForm from './UsernameForm';
import { submitForm } from "./actions.js";
import {useRef} from 'react';

export default function App() {
  const ref = useRef(null);
  return (
    <form ref={ref} action={async (formData) => {
      await submitForm(formData);
      ref.current.reset();
    }}>
      <UsernameForm />
    </form>
  );
}
```

---

## Усунення проблем

### `status.pending` ніколи не дорівнює `true`

`useFormStatus` повертає інформацію про статус лише для батьківської `<form>`.

Якщо компонент, що викликає `useFormStatus`, не вкладений у `<form>`, `status.pending` завжди повертатиме `false`. Переконайтеся, що `useFormStatus` викликається в компоненті, який є дочірнім елементом `<form>`.

`useFormStatus` не відстежує статус `<form>`, що рендериться в тому ж компоненті. Дивіться розділ "Підводний камінь" для деталей.
