# `<form>`

## Вступ

Вбудований браузерний компонент `<form>` дозволяє створювати інтерактивні елементи управління для відправки інформації.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

---

## Довідка

### `<form>`

Щоб створити інтерактивні елементи управління для відправки інформації, рендеріть вбудований браузерний компонент `<form>`.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

#### Props

`<form>` підтримує всі загальні props елементів.

**`action`**: URL або функція.
- Коли URL передається в `action`, форма поводиться як стандартний HTML-компонент форми
- Коли функція передається в `action`, ця функція обробляє відправку форми в Transition за шаблоном Action prop
- Функція, передана в `action`, може бути async і буде викликана з одним аргументом — [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) відправленої форми
- Prop `action` може бути перевизначений атрибутом `formAction` на компоненті `<button>`, `<input type="submit">` або `<input type="image">`

#### Застереження

- Коли функція передається в `action` або `formAction`, HTTP-метод буде POST незалежно від значення prop `method`

---

## Використання

### Обробка відправки форми на клієнті

Передайте функцію в prop `action` форми, щоб запустити функцію при відправці форми. `FormData` буде передано функції як аргумент, тому ви зможете отримати доступ до даних, відправлених формою. Це відрізняється від звичайного HTML action, який приймає лише URL. Після успішного виконання функції `action` всі некеровані поля форми скидаються.

```js
export default function Search() {
  function search(formData) {
    const query = formData.get("query");
    alert(`You searched for '${query}'`);
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

### Обробка відправки форми через Server Function

Рендеріть `<form>` з полем введення та кнопкою відправки. Передайте Server Function (функцію, позначену `'use server'`) в prop `action` форми, щоб запустити функцію при відправці форми.

Передача Server Function в `<form action>` дозволяє користувачам відправляти форми без увімкненого JavaScript або до завантаження коду. Це корисно для користувачів з повільним з'єднанням, пристроєм або вимкненим JavaScript і подібно до того, як форми працюють, коли URL передається в prop `action`.

Ви можете використовувати приховані поля форми для надання даних action-у `<form>`. Server Function буде викликана з даними прихованого поля як екземпляром `FormData`.

```jsx
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(formData) {
    'use server'
    const productId = formData.get('productId')
    await updateCart(productId)
  }
  return (
    <form action={addToCart}>
        <input type="hidden" name="productId" value={productId} />
        <button type="submit">Add to Cart</button>
    </form>
  );
}
```

**Використання `bind` для додаткових аргументів**

Замість використання прихованих полів форми ви можете викликати метод `bind` для надання додаткових аргументів. Це прив'яже новий аргумент (`productId`) до функції на додаток до `formData`, що передається як аргумент.

```jsx
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(productId, formData) {
    "use server";
    await updateCart(productId)
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

Коли `<form>` рендериться Server Component і Server Function передається в prop `action` `<form>`, форма працює з progressive enhancement.

### Відображення стану очікування під час відправки форми

Щоб відобразити стан очікування під час відправки форми, ви можете викликати Hook `useFormStatus` у компоненті, що рендериться в `<form>`, і прочитати повернуту властивість `pending`.

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

### Оптимістичне оновлення даних форми

Hook `useOptimistic` надає спосіб оптимістично оновлювати інтерфейс користувача до завершення фонової операції, наприклад мережевого запиту. У контексті форм ця техніка допомагає зробити застосунки більш чуйними. Коли користувач відправляє форму, замість очікування відповіді сервера інтерфейс негайно оновлюється з очікуваним результатом.

Наприклад, коли користувач вводить повідомлення у форму та натискає кнопку "Send", Hook `useOptimistic` дозволяє повідомленню негайно з'явитися в списку з міткою "Sending...", навіть до того, як повідомлення фактично відправлено на сервер. Цей "оптимістичний" підхід створює враження швидкості та чуйності. Потім форма намагається дійсно відправити повідомлення у фоновому режимі. Коли сервер підтвердить отримання повідомлення, мітка "Sending..." видаляється.

```js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages((messages) => [...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

### Обробка помилок відправки форми

У деяких випадках функція, викликана prop `action` `<form>`, викидає помилку. Ви можете обробити ці помилки, обгорнувши `<form>` в Error Boundary. Якщо функція, викликана prop `action` `<form>`, викидає помилку, буде відображено fallback для error boundary.

```js
import { ErrorBoundary } from "react-error-boundary";

export default function Search() {
  function search() {
    throw new Error("search error");
  }
  return (
    <ErrorBoundary
      fallback={<p>There was an error while submitting the form</p>}
    >
      <form action={search}>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
    </ErrorBoundary>
  );
}
```

### Відображення помилки відправки форми без JavaScript

Відображення повідомлення про помилку відправки форми до завантаження JavaScript-бандлу для progressive enhancement вимагає, щоб:

1. `<form>` рендерився Client Component
2. Функція, передана в prop `action` `<form>`, була Server Function
3. Використовувався Hook `useActionState` для відображення повідомлення про помилку

`useActionState` приймає два параметри: Server Function та початковий стан. `useActionState` повертає два значення: змінну стану та action. Action, повернений `useActionState`, слід передати в prop `action` форми. Змінна стану, повернена `useActionState`, може використовуватися для відображення повідомлення про помилку.

```js
import { useActionState } from "react";
import { signUpNewUser } from "./api";

export default function Page() {
  async function signup(prevState, formData) {
    "use server";
    const email = formData.get("email");
    try {
      await signUpNewUser(email);
      alert(`Added "${email}"`);
    } catch (err) {
      return err.toString();
    }
  }
  const [message, signupAction] = useActionState(signup, null);
  return (
    <>
      <h1>Signup for my newsletter</h1>
      <p>Signup with the same email twice to see an error</p>
      <form action={signupAction} id="signup-form">
        <label htmlFor="email">Email: </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>Sign up</button>
        {!!message && <p>{message}</p>}
      </form>
    </>
  );
}
```

### Обробка кількох типів відправки

Форми можуть бути спроектовані для обробки кількох action-ів відправки залежно від натиснутої кнопки. Кожна кнопка всередині форми може бути пов'язана з окремою дією або поведінкою через встановлення prop `formAction`.

Коли користувач натискає конкретну кнопку, форма відправляється, і виконується відповідна дія, визначена атрибутами та action цієї кнопки.

```js
export default function Search() {
  function publish(formData) {
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`'${content}' was published with the '${button}' button`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`Your draft of '${content}' has been saved!`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} cols={40} />
      <br />
      <button type="submit" name="button" value="submit">Publish</button>
      <button formAction={save}>Save draft</button>
    </form>
  );
}
```
