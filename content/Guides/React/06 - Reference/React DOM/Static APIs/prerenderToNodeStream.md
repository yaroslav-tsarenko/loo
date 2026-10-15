# prerenderToNodeStream

## Огляд

`prerenderToNodeStream` рендерить React-дерево в статичний HTML за допомогою [Node.js Stream](https://nodejs.org/api/stream.html).

```js
const {prelude, postponed} = await prerenderToNodeStream(reactNode, options?)
```

> **Примітка:** Цей API специфічний для Node.js. Середовища з Web Streams повинні використовувати [`prerender`](/reference/react-dom/static/prerender).

---

## Довідка

### `prerenderToNodeStream(reactNode, options?)`

Викличте `prerenderToNodeStream` для рендерингу застосунку в статичний HTML.

```js
import { prerenderToNodeStream } from 'react-dom/static';

app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js'],
  });

  response.setHeader('Content-Type', 'text/plain');
  prelude.pipe(response);
});
```

На клієнті викличте [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) для інтерактивності.

#### Параметри

- **`reactNode`**: React-вузол для рендерингу. Кореневий компонент повинен рендерити тег `<html>`.
- **`options`** (необов'язково):
  - **`bootstrapScripts`**: Масив URL для тегів `<script>`.
  - **`bootstrapModules`**: Генерує `<script type="module">`.
  - **`bootstrapScriptContent`**: Inline `<script>` вміст.
  - **`identifierPrefix`**: Префікс для ID з `useId`.
  - **`namespaceURI`**: Кореневий namespace URI.
  - **`onError`**: Callback для серверних помилок.
  - **`progressiveChunkSize`**: Кількість байтів у chunk.
  - **`signal`**: Abort signal для переривання prerendering.

#### Повертає

`prerenderToNodeStream` повертає Promise:

- **При успіху** — об'єкт:
  - **`prelude`**: [Node.js Stream](https://nodejs.org/api/stream.html) HTML.
  - **`postponed`**: JSON-серіалізований об'єкт для `resumeToPipeableStream`, або `null`.

- **При невдачі** — Promise reject.

#### Застереження

`nonce` недоступний при prerendering. Nonces повинні бути унікальними для кожного запиту.

### Коли використовувати `prerenderToNodeStream`?

Статичний API `prerenderToNodeStream` використовується для статичної генерації сайтів (SSG). На відміну від `renderToString`, `prerenderToNodeStream` очікує завантаження всіх даних. Для потокової передачі використовуйте [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream).

---

## Використання

### Рендеринг React-дерева в потік статичного HTML

```js
import { prerenderToNodeStream } from 'react-dom/static';

app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js'],
  });

  response.setHeader('Content-Type', 'text/html');
  prelude.pipe(response);
});
```

Кореневий компонент повинен повертати **весь документ, включаючи тег `<html>`**:

```js
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

На клієнті гідратуйте весь документ:

```js
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(document, <App />);
```

### Читання шляхів до CSS та JS ресурсів зі збірки

Кінцеві URL ресурсів часто хешуються після збірки. Кореневий компонент може читати реальні імена файлів з map, переданого як prop:

```js
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        <title>My app</title>
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
      </head>
      ...
    </html>
  );
}
```

Серіалізуйте та передайте `assetMap` на клієнт через `bootstrapScriptContent`:

```js
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App assetMap={assetMap} />, {
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });
  prelude.pipe(response);
});
```

На клієнті:

```js
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(document, <App assetMap={window.assetMap} />);
```

### Рендеринг React-дерева в рядок статичного HTML

```js
import { prerenderToNodeStream } from 'react-dom/static';

async function renderToString() {
  const {prelude} = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js']
  });

  return new Promise((resolve, reject) => {
    let data = '';
    prelude.on('data', chunk => {
      data += chunk;
    });
    prelude.on('end', () => resolve(data));
    prelude.on('error', reject);
  });
}
```

### Очікування завантаження всіх даних

`prerenderToNodeStream` очікує завантаження всіх даних перед resolve. Використовуйте Suspense для suspend на даних:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

**Лише data sources з підтримкою Suspense** активують Suspense component: фреймворки типу Relay та Next.js, `lazy`, `use`. Suspense **не** виявляє завантаження в Effect або обробнику подій.

### Переривання prerendering

```js
async function renderToString() {
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort()
  }, 10000);

  const {prelude} = await prerenderToNodeStream(<App />, {
    signal: controller.signal,
  });
  // ...
}
```

Suspense boundaries з незавершеними дочірніми елементами будуть включені у fallback стані. Це можна використовувати для часткового prerendering разом з [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream).

---

## Усунення проблем

### Потік не починається до завершення рендерингу всього застосунку

`prerenderToNodeStream` очікує завершення рендерингу, включаючи resolve всіх Suspense boundaries. Він призначений для статичної генерації (SSG) та не підтримує потокову передачу в міру завантаження.

Для потокової передачі використовуйте [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream).
