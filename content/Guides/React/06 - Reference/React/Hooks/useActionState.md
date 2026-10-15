# useActionState

## Вступ

`useActionState` — це React Hook, який дозволяє оновлювати state з побічними ефектами, використовуючи [Actions](/reference/react/useTransition#functions-called-in-starttransition-are-called-actions).

```js
const [state, dispatchAction, isPending] = useActionState(reducerAction, initialState, permalink?);
```

---

## Довідка

### `useActionState(reducerAction, initialState, permalink?)`

Викликайте `useActionState` на верхньому рівні вашого компонента для створення state для результату Action.

```js
import { useActionState } from 'react';

function reducerAction(previousState, actionPayload) {
  // ...
}

function MyCart({initialState}) {
  const [state, dispatchAction, isPending] = useActionState(reducerAction, initialState);
  // ...
}
```

#### Параметри

* **`reducerAction`**: Функція, яка викликається при запуску Action. При виклику вона отримує попередній state (спочатку `initialState`, який ви надали, потім попереднє повернуте значення) як перший аргумент, а потім `actionPayload`, переданий у `dispatchAction`.

* **`initialState`**: Значення, яким ви хочете ініціалізувати state. React ігнорує цей аргумент після першого виклику `dispatchAction`.

* **`permalink`** (необов'язково): Рядок, що містить унікальний URL сторінки, яку модифікує ця форма.
  * Для використання на сторінках з [React Server Components](/reference/rsc/server-components) з прогресивним покращенням.
  * Якщо `reducerAction` є [Server Function](/reference/rsc/server-functions) і форма відправляється до завантаження JavaScript-бандлу, браузер перейде на вказаний permalink URL замість URL поточної сторінки.

#### Повертає

`useActionState` повертає масив з рівно трьома значеннями:

1. Поточний state. Під час першого рендеру він відповідатиме `initialState`, який ви передали. Після виклику `dispatchAction` він відповідатиме значенню, поверненому `reducerAction`.
2. Функція `dispatchAction`, яку ви викликаєте всередині [Actions](/reference/react/useTransition#functions-called-in-starttransition-are-called-actions).
3. Прапорець `isPending`, який повідомляє, чи є очікувані Actions для цього Hook.

#### Застереження

* `useActionState` — це Hook, тому ви можете викликати його лише **на верхньому рівні компонента** або власних Hooks. Не можна викликати його всередині циклів або умов. Якщо це потрібно, виділіть новий компонент і перенесіть state до нього.
* React ставить у чергу та виконує кілька викликів `dispatchAction` послідовно. Кожен виклик `reducerAction` отримує результат попереднього виклику.
* Функція `dispatchAction` має стабільну ідентичність, тому ви часто бачитимете, що вона пропущена в залежностях Effect.
* При використанні опції `permalink` переконайтеся, що той самий компонент форми рендериться на сторінці призначення (включно з тим самим `reducerAction` та `permalink`).
* При використанні Server Functions, `initialState` потрібно [серіалізувати](/reference/rsc/use-server#serializable-parameters-and-return-values).
* Якщо `dispatchAction` викидає помилку, React скасовує всі дії в черзі та показує найближчий [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary).

> **Примітка**: `dispatchAction` має викликатися з Action. Ви можете обгорнути його в [`startTransition`](/reference/react/startTransition) або передати до [Action prop](/reference/react/useTransition#exposing-action-props-from-components).

---

### Функція `reducerAction`

Функція `reducerAction`, передана до `useActionState`, отримує попередній state і повертає новий state.

На відміну від reducers у `useReducer`, `reducerAction` може бути асинхронною та виконувати побічні ефекти:

```js
async function reducerAction(previousState, actionPayload) {
  const newState = await post(actionPayload);
  return newState;
}
```

#### Параметри

* **`previousState`**: Останній state. Спочатку дорівнює `initialState`. Після першого виклику `dispatchAction` дорівнює останньому поверненому state.
* **`actionPayload`** (необов'язково): Аргумент, переданий до `dispatchAction`. Може бути значенням будь-якого типу.

#### Повертає

`reducerAction` повертає новий state та запускає Transition для повторного рендеру з цим state.

#### Застереження

* `reducerAction` може бути синхронною або асинхронною.
* `reducerAction` не викликається двічі у `<StrictMode>`, оскільки призначена для побічних ефектів.
* Тип повернення `reducerAction` має відповідати типу `initialState`.

---

## Використання

### Додавання state до Action

Викликайте `useActionState` на верхньому рівні вашого компонента для створення state для результату Action.

```js
import { useActionState } from 'react';

async function addToCartAction(prevCount) {
  // ...
}
function Counter() {
  const [count, dispatchAction, isPending] = useActionState(addToCartAction, 0);
  // ...
}
```

#### Приклад: Оформлення квитків

```js
import { useActionState, startTransition } from 'react';
import { addToCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(async (prevCount) => {
    return await addToCart(prevCount)
  }, 0);

  function handleClick() {
    startTransition(() => {
      dispatchAction();
    });
  }

  return (
    <div className="checkout">
      <h2>Оформлення</h2>
      <div className="row">
        <span>Квитки на Eras Tour</span>
        <span>Кількість: {count}</span>
      </div>
      <div className="row">
        <button onClick={handleClick}>Додати квиток{isPending ? ' 🌀' : '  '}</button>
      </div>
      <hr />
      <Total quantity={count} />
    </div>
  );
}
```

Кожного разу, коли ви натискаєте "Додати квиток", React ставить виклик `addToCartAction` у чергу. React показує стан очікування, поки всі квитки не будуть додані, а потім рендерить з фінальним state.

---

### Використання кількох типів Action

Щоб обробляти кілька типів, ви можете передати аргумент до `dispatchAction`. За домовленістю, прийнято використовувати оператор switch:

```js
import { useActionState, startTransition } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

  function handleAdd() {
    startTransition(() => {
      dispatchAction({ type: 'ADD' });
    });
  }

  function handleRemove() {
    startTransition(() => {
      dispatchAction({ type: 'REMOVE' });
    });
  }

  return (
    <div className="checkout">
      <h2>Оформлення</h2>
      <div className="row">
        <span>Квитки на Eras Tour</span>
        <span className="stepper">
          <span className="qty">{isPending ? '🌀' : count}</span>
          <span className="buttons">
            <button onClick={handleAdd}>▲</button>
            <button onClick={handleRemove}>▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={count} isPending={isPending}/>
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

#### Чим `useActionState` відрізняється від `useReducer`?

- **Використовуйте `useReducer`** для керування state вашого UI. Reducer має бути чистим.
- **Використовуйте `useActionState`** для керування state ваших Actions. Reducer може виконувати побічні ефекти.

---

### Використання з `useOptimistic`

Ви можете поєднати `useActionState` з [`useOptimistic`](/reference/react/useOptimistic) для показу миттєвого зворотного зв'язку в UI:

```js
import { useActionState, startTransition, useOptimistic } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);
  const [optimisticCount, setOptimisticCount] = useOptimistic(count);

  function handleAdd() {
    startTransition(() => {
      setOptimisticCount(c => c + 1);
      dispatchAction({ type: 'ADD' });
    });
  }

  function handleRemove() {
    startTransition(() => {
      setOptimisticCount(c => c - 1);
      dispatchAction({ type: 'REMOVE' });
    });
  }

  return (
    <div className="checkout">
      <h2>Оформлення</h2>
      <div className="row">
        <span>Квитки на Eras Tour</span>
        <span className="stepper">
          <span className="pending">{isPending && '🌀'}</span>
          <span className="qty">{optimisticCount}</span>
          <span className="buttons">
            <button onClick={handleAdd}>▲</button>
            <button onClick={handleRemove}>▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={optimisticCount} isPending={isPending}/>
    </div>
  );
}
```

---

### Скасування дій у черзі

Ви можете використовувати `AbortController` для скасування очікуваних Actions:

```js
import { useActionState, useRef } from 'react';

export default function Checkout() {
  const abortRef = useRef(null);
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

  async function addAction() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    await dispatchAction({ type: 'ADD', signal: abortRef.current.signal });
  }
  // ...
}
```

> **Пастка**: Скасування Action не завжди безпечне. Наприклад, якщо Action виконує мутацію (запис у базу даних), скасування мережевого запиту не скасовує зміни на стороні сервера.

---

### Використання з `<form>` Action props

Ви можете передати функцію `dispatchAction` як prop `action` до `<form>`. При такому використанні React автоматично обгортає відправку в Transition:

```js
import { useActionState, useOptimistic } from 'react';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);
  const [optimisticCount, setOptimisticCount] = useOptimistic(count);

  async function formAction(formData) {
    const type = formData.get('type');
    if (type === 'ADD') {
      setOptimisticCount(c => c + 1);
    } else {
      setOptimisticCount(c => Math.max(0, c - 1));
    }
    return dispatchAction(formData);
  }

  return (
    <form action={formAction} className="checkout">
      <h2>Оформлення</h2>
      <div className="row">
        <span>Квитки на Eras Tour</span>
        <span className="stepper">
          <span className="pending">{isPending && '🌀'}</span>
          <span className="qty">{optimisticCount}</span>
          <span className="buttons">
            <button type="submit" name="type" value="ADD">▲</button>
            <button type="submit" name="type" value="REMOVE">▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </form>
  );
}
```

---

### Обробка помилок

Є два способи обробки помилок з `useActionState`:

1. Для **відомих помилок** (наприклад, помилки валідації) — поверніть їх як частину state з `reducerAction` та відобразіть в UI.
2. Для **невідомих помилок** — викиньте помилку. React скасує всі дії в черзі та покаже найближчий Error Boundary.

---

## Вирішення проблем

### Мій прапорець `isPending` не оновлюється

Якщо ви викликаєте `dispatchAction` вручну (не через Action prop), переконайтеся, що ви обгортаєте виклик у [`startTransition`](/reference/react/startTransition):

```js
import { useActionState, startTransition } from 'react';

function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAction, null);

  function handleClick() {
    // ✅ Правильно: обгорнуто в startTransition
    startTransition(() => {
      dispatchAction();
    });
  }
  // ...
}
```

### Мій Action не може прочитати дані форми

При використанні `useActionState`, `reducerAction` отримує додатковий аргумент як перший — попередній state. Дані форми є другим аргументом:

```js
// Без useActionState
function action(formData) {
  const name = formData.get('name');
}

// З useActionState
function action(prevState, formData) {
  const name = formData.get('name');
}
```

### Помилка: "An async function with useActionState was called outside of a transition"

Ця помилка виникає, коли `dispatchAction` викликається поза Transition. Обгорніть виклик у `startTransition`:

```js
function handleClick() {
  // ✅ Правильно: обгорнуто в startTransition
  startTransition(() => {
    dispatchAction();
  });
}
```

Або передайте `dispatchAction` до Action prop.
