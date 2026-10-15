# renderToPipeableStream

## Огляд

`renderToPipeableStream` рендерить React-дерево в pipeable [Node.js Stream](https://nodejs.org/api/stream.html).

```js
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
```

> **Примітка:** Цей API специфічний для Node.js. Середовища з Web Streams повинні використовувати [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream).

---

## Довідка

### `renderToPipeableStream(reactNode, options?)`

Викличте `renderToPipeableStream` для рендерингу React-дерева як HTML у Node.js Stream.

```js
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

На клієнті викличте [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) для інтерактивності серверного HTML.

#### Параметри

- **`reactNode`**: React-вузол для рендерингу. Кореневий компонент повинен рендерити тег `<html>`.
- **`options`** (необов'язково):
  - **`bootstrapScripts`**: Масив URL для тегів `<script>`, що включають скрипт із викликом `hydrateRoot`.
  - **`bootstrapModules`**: Аналогічно, але генерує `<script type="module">`.
  - **`bootstrapScriptContent`**: Рядок для inline `<script>`.
  - **`identifierPrefix`**: Префікс для ID з `useId`.
  - **`namespaceURI`**: Кореневий namespace URI для потоку.
  - **`nonce`**: Nonce для CSP.
  - **`onAllReady`**: Callback після завершення всього рендерингу. Використовуйте для crawlers та статичної генерації.
  - **`onError`**: Callback для серверних помилок.
  - **`onShellReady`**: Callback після рендерингу початкової shell. Встановіть код статусу та викличте `pipe` тут.
  - **`onShellError`**: Callback при помилці рендерингу shell. Дозволяє відправити fallback HTML.
  - **`progressiveChunkSize`**: Кількість байтів у chunk.

#### Повертає

Об'єкт з двома методами:
- **`pipe`**: Виводить HTML у Writable Node.js Stream.
- **`abort`**: Дозволяє перервати серверний рендеринг та рендерити решту на клієнті.

---

## Використання

### Рендеринг React-дерева як HTML у Node.js Stream

```js
import { renderToPipeableStream } from 'react-dom/server';

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Кореневий компонент повинен повертати **весь документ, включаючи тег `<html>`**. На клієнті скрипт повинен гідратувати весь документ:

```js
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(document, <App />);
```

### Потокова передача вмісту в міру завантаження

Потоковий рендеринг дозволяє користувачам бачити вміст до завантаження всіх даних. Обгорніть повільні компоненти в `<Suspense>`:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

React відправить HTML fallback (`PostsGlimmer`) першим, а потім — фактичний вміст з inline `<script>` для заміни.

### Визначення вмісту shell

Частина застосунку за межами `<Suspense>` boundaries — це *shell*. Вона визначає найраніший стан завантаження, який побачить користувач. Callback `onShellReady` спрацьовує після рендерингу всієї shell.

### Відновлення після помилок у shell

При помилці рендерингу shell використовуйте `onShellError` для відправки fallback HTML:

```js
const { pipe } = renderToPipeableStream(<App />, {
  onShellReady() {
    response.statusCode = 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>');
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

### Відновлення після помилок поза shell

Якщо компонент всередині `<Suspense>` видає помилку, React:
1. Відправить HTML fallback найближчого `<Suspense>` boundary
2. Припинить рендеринг цього компонента на сервері
3. Повторить спробу рендерингу на клієнті

### Встановлення коду статусу

Потоковий рендеринг створює компроміс: ви не можете змінити код статусу після початку потоку. Використовуйте `didError` прапорець:

```js
let didError = false;

const { pipe } = renderToPipeableStream(<App />, {
  onShellReady() {
    response.statusCode = didError ? 500 : 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onError(error) {
    didError = true;
    console.error(error);
  }
});
```

### Очікування всього вмісту для crawlers

Використовуйте callback `onAllReady` для crawlers та статичної генерації:

```js
const { pipe } = renderToPipeableStream(<App />, {
  onShellReady() {
    if (!isCrawler) {
      response.statusCode = didError ? 500 : 200;
      pipe(response);
    }
  },
  onAllReady() {
    if (isCrawler) {
      response.statusCode = didError ? 500 : 200;
      pipe(response);
    }
  },
});
```

### Переривання серверного рендерингу

Примусово завершіть серверний рендеринг після тайм-ауту:

```js
const { pipe, abort } = renderToPipeableStream(<App />, {
  // ...
});

setTimeout(() => {
  abort();
}, 10000);
```

React відправить залишкові loading fallbacks як HTML та спробує рендерити решту на клієнті.
