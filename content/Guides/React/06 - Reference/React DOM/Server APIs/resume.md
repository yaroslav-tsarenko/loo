# resume

## Огляд

`resume` передає попередньо відрендерене React-дерево у [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).

```js
const stream = await resume(reactNode, postponedState, options?)
```

> **Примітка**: Цей API залежить від [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). Для Node.js використовуйте [`resumeToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) замість нього.

---

## Довідка

### `resume(node, postponedState, options?)`

Викличте `resume`, щоб відновити рендеринг попередньо відрендереного React-дерева у вигляді HTML у [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).

```js
import { resume } from 'react-dom/server';
import { getPostponedState } from './storage';

async function handler(request, writable) {
  // Отримуємо відкладений стан з попереднього prerenderʼу
  const postponed = await getPostponedState(request);
  const resumeStream = await resume(<App />, postponed);
  return resumeStream.pipeTo(writable);
}
```

#### Параметри

- **`reactNode`**: React-вузол, з яким ви викликали `prerender`. Наприклад, JSX-елемент на кшталт `<App />`. Очікується, що він представляє весь документ, тому компонент `App` повинен рендерити тег `<html>`.

- **`postponedState`**: Непрозорий обʼєкт `postpone`, повернутий з [prerender API](/reference/react-dom/static/index), завантажений з місця, де ви його зберегли (наприклад, redis, файл або S3).

- **`options`** (необовʼязково): Обʼєкт з параметрами потокової передачі.
  - **`nonce`** (необовʼязково): Рядок [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) для дозволу скриптів для [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  - **`signal`** (необовʼязково): [Сигнал переривання](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal), який дозволяє перервати серверний рендеринг і дорендерити решту на клієнті.
  - **`onError`** (необовʼязково): Callback, який спрацьовує при будь-якій серверній помилці, незалежно від того, чи є вона відновлюваною чи ні. За замовчуванням викликає лише `console.error`. Якщо ви перевизначаєте його для логування звітів про збої, переконайтеся, що ви все ще викликаєте `console.error`.

#### Повертає

`resume` повертає Promise:

- Якщо `resume` успішно створив оболонку (shell), Promise вирішиться у [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream), який можна передати у [Writable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream).
- Якщо в оболонці (shell) відбудеться помилка, Promise буде відхилено з цією помилкою.

Повернутий потік має додаткову властивість:

- **`allReady`**: Promise, який вирішується, коли весь рендеринг завершено. Ви можете зробити `await stream.allReady` перед поверненням відповіді для краулерів та статичної генерації. Якщо ви це зробите, ви не отримаєте прогресивного завантаження. Потік міститиме фінальний HTML.

#### Застереження

- `resume` не приймає опції `bootstrapScripts`, `bootstrapScriptContent` або `bootstrapModules`. Натомість ці опції потрібно передати у виклик `prerender`, який генерує `postponedState`. Ви також можете вручну вставити bootstrap-контент у writable stream.
- `resume` не приймає `identifierPrefix`, оскільки префікс має бути однаковим і в `prerender`, і в `resume`.
- Оскільки `nonce` не можна передати в prerender, ви повинні передавати `nonce` у `resume` лише тоді, коли ви не передаєте скрипти в prerender.
- `resume` виконує повторний рендеринг від кореня, доки не знайде компонент, який не був повністю попередньо відрендерений. Тільки повністю попередньо відрендерені компоненти (компонент і всі його дочірні елементи завершили prerenderʼинг) пропускаються повністю.

---

## Використання

### Відновлення Prerender

API `resume` використовується разом із API `prerender` для реалізації багатошарового рендерингу:

1. **Шар 1 (Prerender)**: Попередній рендеринг компонентів, які готові; переривання при досягненні асинхронних границь
2. **Шар 2 (Resume)**: Відновлення рендерингу після отримання необхідних даних
3. **Шар 3 (Hydrate)**: Гідрація клієнта інтерактивними компонентами

```js
import {
  flushReadableStreamToFrame,
  getUser,
  Postponed,
  sleep,
} from "./demo-helpers";
import { StrictMode, Suspense, use, useEffect } from "react";
import { prerender } from "react-dom/static";
import { resume } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";

function Header() {
  return <header>Me and my descendants can be prerendered</header>;
}

const { promise: cookies, resolve: resolveCookies } = Promise.withResolvers();

function Main() {
  const { sessionID } = use(cookies);
  const user = getUser(sessionID);

  useEffect(() => {
    console.log("reached interactivity!");
  }, []);

  return (
    <main>
      Hello, {user.name}!
      <button onClick={() => console.log("hydrated!")}>
        Clicking me requires hydration.
      </button>
    </main>
  );
}

function Shell({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

function App() {
  return (
    <Shell>
      <Suspense fallback="loading header">
        <Header />
      </Suspense>
      <Suspense fallback="loading main">
        <Main />
      </Suspense>
    </Shell>
  );
}

async function main(frame) {
  // Шар 1: Prerender
  const controller = new AbortController();
  const prerenderedApp = prerender(<App />, {
    signal: controller.signal,
    onError(error) {
      if (error instanceof Postponed) {
        // Очікувана відкладена помилка — ігноруємо
      } else {
        console.error(error);
      }
    },
  });
  
  setTimeout(() => {
    controller.abort(new Postponed());
  });

  const { prelude, postponed } = await prerenderedApp;
  await flushReadableStreamToFrame(prelude, frame);

  // Шар 2: Resume — відновлюємо рендеринг після отримання даних
  await sleep(2000);
  resolveCookies({ sessionID: "abc" });

  const stream = await resume(<App />, postponed);
  await flushReadableStreamToFrame(stream, frame);

  // Шар 3: Hydrate — робимо додаток інтерактивним
  await sleep(2000);
  hydrateRoot(frame.contentWindow.document, <App />);
}

main(document.getElementById("container"));
```

### Додаткове читання

- Відновлення (resume) поводиться як `renderToReadableStream`. Для більшої кількості прикладів перегляньте [розділ використання `renderToReadableStream`](/reference/react-dom/server/renderToReadableStream#usage).
- [Розділ використання `prerender`](/reference/react-dom/static/prerender#usage) містить приклади того, як використовувати `prerender` конкретно.
