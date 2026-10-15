# useTransition

## Огляд

`useTransition` — це React Hook, який дозволяє рендерити частину UI у фоновому режимі без блокування взаємодій користувача.

```js
const [isPending, startTransition] = useTransition()
```

---

## Довідка

### `useTransition()`

Викликайте `useTransition` на верхньому рівні компонента для позначення оновлень state як Transitions.

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

#### Параметри

`useTransition` не приймає жодних параметрів.

#### Повертає

Масив з двома елементами:

1. Прапорець `isPending` — повідомляє, чи є очікуваний Transition.
2. Функція `startTransition` — дозволяє позначити оновлення як Transition.

---

### `startTransition(action)`

Функція `startTransition` дозволяє позначити оновлення як Transition.

```js
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

> **Примітка:** Функції, що викликаються в `startTransition`, називаються "Actions". За домовленістю, будь-який callback всередині `startTransition` має називатися `action` або включати суфікс "Action".

#### Параметри

- `action`: Функція, яка оновлює state. React викликає `action` негайно і позначає всі оновлення state, заплановані під час виклику, як Transitions. Оновлення state, позначені як Transitions, будуть неблокуючими.

#### Застереження

- `useTransition` — це Hook, його можна викликати лише в компонентах або власних Hooks.
- Функція, передана до `startTransition`, викликається негайно, позначаючи всі оновлення state під час виконання як Transitions.
- Потрібно обгортати оновлення state після `await` у додатковий `startTransition`.
- Оновлення, позначені як Transition, можуть бути перервані іншими оновленнями state.
- Transition оновлення не можна використовувати для контролю текстових полів введення.

---

## Використання

### Виконання неблокуючих оновлень з Actions

```js
import {useState, useTransition} from 'react';
import {updateQuantity} from './api';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);

  function onSubmit(newQuantity) {
    startTransition(async function () {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  }
  // ...
}
```

Функція, передана до `startTransition`, називається "Action". Ви можете оновлювати state та виконувати побічні ефекти всередині Action, і робота буде виконуватися у фоновому режимі без блокування взаємодій.

Для зворотного зв'язку з користувачем, `isPending` перемикається на `true` при першому виклику `startTransition` і залишається `true`, поки всі Actions не завершаться.

---

### Відкриття action prop з компонентів

```js
export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

Оскільки батьківський компонент оновлює state всередині `action`, це оновлення позначається як Transition.

---

### Відображення візуального стану очікування

Використовуйте `isPending` для індикації користувачу:

```js
function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();

  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
}
```

---

### Запобігання небажаним індикаторам завантаження

При використанні з `<Suspense>`, Transitions "чекають" достатньо довго, щоб не приховувати *вже показаний* контент. Без Transitions при навігації до нової вкладки весь контейнер замінювався б спінером.

---

### Побудова маршрутизатора з підтримкою Suspense

Рекомендується позначати навігацію по сторінках як Transitions:

```js
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
}
```

Три причини:

- Transitions можна перервати — користувач може натиснути інше посилання без очікування.
- Transitions запобігають небажаним спінерам.
- Transitions чекають завершення побічних ефектів.

---

### Відображення помилки за допомогою Error Boundary

Якщо функція, передана до `startTransition`, викидає помилку, можна відобразити її через Error Boundary:

```js
import { useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>Щось пішло не так</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          addComment();
        });
      }}
    >
      Додати коментар
    </button>
  );
}
```

---

## Вирішення проблем

### Оновлення input у Transition не працює

Не можна використовувати Transition для state, що контролює input:

```js
// ❌ Не працює для контрольованого input
startTransition(() => {
  setText(e.target.value);
});
```

Оновлення input має бути синхронним. Рішення:

1. Оголосіть дві окремі змінні state: одну для input (синхронну), іншу для оновлення в Transition.
2. Використовуйте `useDeferredValue`.

### React не трактує оновлення state як Transition

Оновлення state має відбуватися *під час* виклику `startTransition`:

```js
// ✅ Правильно
startTransition(() => {
  setPage('/about');
});

// ❌ Неправильно: після startTransition в setTimeout
startTransition(() => {
  setTimeout(() => {
    setPage('/about'); // Не позначається як Transition
  }, 1000);
});

// ✅ Правильно: setTimeout обгортає startTransition
setTimeout(() => {
  startTransition(() => {
    setPage('/about');
  });
}, 1000);
```

### Оновлення state після `await` не є Transition

Обгорніть оновлення state після `await` у додатковий `startTransition`:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ✅ Використання startTransition після await
  startTransition(() => {
    setPage('/about');
  });
});
```

### Функція, передана до `startTransition`, виконується негайно

```js
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
// Виведе: 1, 2, 3
```

**Це очікувана поведінка.** Функція не відкладається, як `setTimeout`. React виконує її негайно, але оновлення state під час виконання позначаються як Transitions.
