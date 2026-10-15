# Server Functions

## Огляд

Server Functions — це async функції, що виконуються на сервері та можуть бути викликані з Client Components. Вони визначаються за допомогою директиви `"use server"` та працюють у межах React Server Components.

**Примітка:** До вересня 2024 року всі Server Functions називалися "Server Actions". Тепер Server Functions, передані в action props або викликані з actions, є конкретно "Server Actions", але не всі Server Functions є Server Actions.

## Ключова концепція

Server Functions дозволяють Client Components викликати async функції, що виконуються на сервері. Коли Server Function визначена з директивою `"use server"`, ваш фреймворк автоматично створює посилання на неї та передає це посилання Client Components. При виклику на клієнті React відправляє запит до сервера для виконання функції та повертає результат.

## Примітка щодо реалізації

> **Для бандлерів/фреймворків:** Хоча Server Functions у React 19 є стабільними, базові API, що використовуються для їх реалізації, не дотримуються semver та можуть ламатися між мінорними версіями React 19.x. Рекомендується прив'язуватися до конкретної версії React або використовувати Canary реліз.

---

## Патерни використання

### 1. Створення Server Function з Server Component

Server Components можуть визначати Server Functions з директивою `"use server"`:

```js
// Server Component
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Server Function
    'use server';

    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```

React рендерить Server Component, створює посилання на `createNoteAction` та передає його Client Component `Button`. При натисканні React відправляє запит до сервера:

```js
"use client";

export default function Button({onClick}) {
  console.log(onClick);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={() => onClick()}>Create Empty Note</button>
}
```

### 2. Імпорт Server Functions з Client Components

Client Components можуть імпортувати Server Functions з файлів, що використовують директиву `"use server"`:

```js
"use server";

export async function createNote() {
  await db.notes.create();
}
```

Бандлер створює посилання на функцію. При виклику на клієнті:

```js
"use client";
import {createNote} from './actions';

function EmptyNote() {
  console.log(createNote);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}
  return <button onClick={() => createNote()} />
}
```

### 3. Server Functions з Actions

Server Functions можуть викликатися з Actions на клієнті за допомогою `useTransition`:

```js
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
}
```

```js
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const submitAction = async () => {
    startTransition(async () => {
      const {error} = await updateName(name);
      if (error) {
        setError(error);
      } else {
        setName('');
      }
    })
  }

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {error && <span>Failed: {error}</span>}
    </form>
  )
}
```

Це дозволяє отримати доступ до стану `isPending` Server Function, обгортаючи її в Action.

### 4. Server Functions з Form Actions

Server Functions працюють з новими можливостями Form у React 19. Передайте Server Function напряму у форму:

```js
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  )
}
```

React автоматично скидає форму при успішному відправленні. Використовуйте `useActionState` для доступу до стану очікування, останньої відповіді або підтримки progressive enhancement.

### 5. Server Functions з `useActionState`

Викликайте Server Functions з `useActionState` для типових сценаріїв, де вам потрібен стан очікування та повернута відповідь:

```js
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  );
}
```

React автоматично повторює відправлення форм, введені до завершення гідрації, дозволяючи взаємодію користувача до гідрації додатку.

### 6. Progressive Enhancement з `useActionState`

Server Functions підтримують progressive enhancement через третій аргумент `useActionState`:

```js
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, null, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

Коли permalink надано `useActionState`, React перенаправляє на вказаний URL, якщо форма відправлена до завантаження JavaScript бандлу.

---

## Пов'язана документація

- Директива `"use server"`
- React Server Components
- Хук `useActionState`
