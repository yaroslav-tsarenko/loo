# renderToReadableStream

## Вступ

`renderToReadableStream` рендерить React-дерево в [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).

```js
const stream = await renderToReadableStream(reactNode, options?)
```

> **Примітка:** Цей API залежить від [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). Для Node.js використовуйте [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream).

---

## Довідка

### `renderToReadableStream(reactNode, options?)`

Викличте `renderToReadableStream` для рендерингу React-дерева як HTML у Readable Web Stream.

```js
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

На клієнті викличте [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) для інтерактивності серверного HTML.

#### Параметри

- **`reactNode`**: React-вузол для рендерингу. Кореневий компонент повинен рендерити тег `<html>`.
- **`options`** (необов'язково):
  - **`bootstrapScripts`**: Масив URL для тегів `<script>`.
  - **`bootstrapModules`**: Генерує `<script type="module">`.
  - **`bootstrapScriptContent`**: Inline `<script>` вміст.
  - **`identifierPrefix`**: Префікс для ID з `useId`.
  - **`namespaceURI`**: Кореневий namespace URI.
  - **`nonce`**: Nonce для CSP.
  - **`onError`**: Callback для серверних помилок.
  - **`progressiveChunkSize`**: Кількість байтів у chunk.
  - **`signal`**: [Abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) для переривання рендерингу.

#### Повертає

`renderToReadableStream` повертає Promise:

- При успішному рендерингу **shell** — Promise resolve з [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).
- При невдачі рендерингу shell — Promise reject. Використовуйте для відправки fallback.

Потік має додаткову властивість:
- **`allReady`**: Promise, що resolve після завершення всього рендерингу. Використовуйте `await stream.allReady` для crawlers та статичної генерації.

---

## Використання

### Рендеринг React-дерева як HTML у Readable Web Stream

```js
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Кореневий компонент повинен повертати **весь документ**. На клієнті гідратуйте весь `document`:

```js
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(document, <App />);
```

### Потокова передача вмісту в міру завантаження

Обгорніть повільні компоненти в `<Suspense>`:

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

React відправить fallback першим, а потім замінить його фактичним вмістом.

> **Примітка:** Лише data sources з підтримкою Suspense активують Suspense component: фреймворки типу Relay та Next.js, `lazy` для завантаження коду, `use` для читання Promise. Suspense **не** виявляє завантаження даних в Effect або обробнику подій.

### Відновлення після помилок у shell

Обгорніть `renderToReadableStream` у `try...catch`:

```js
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

### Відновлення після помилок поза shell

Компоненти всередині `<Suspense>` — не частина shell. При помилці React:
1. Відправить fallback найближчого `<Suspense>` boundary
2. Припинить серверний рендеринг
3. Повторить спробу на клієнті

### Встановлення коду статусу

```js
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      onError(error) {
        didError = true;
        console.error(error);
      }
    });
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

### Очікування всього вмісту для crawlers

```js
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js'],
  });
  let isCrawler = // ... стратегія виявлення ботів
  if (isCrawler) {
    await stream.allReady;
  }
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

### Переривання серверного рендерингу

```js
async function handler(request) {
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort();
  }, 10000);

  const stream = await renderToReadableStream(<App />, {
    signal: controller.signal,
    bootstrapScripts: ['/main.js'],
  });
  // ...
}
```

React відправить залишкові fallbacks як HTML та спробує рендерити решту на клієнті.
