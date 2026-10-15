# prerender

## Огляд

`prerender` рендерить React-дерево в статичний HTML-рядок за допомогою [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).

```js
const {prelude, postponed} = await prerender(reactNode, options?)
```

> **Примітка:** Цей API залежить від Web Streams. Для Node.js використовуйте [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream).

---

## Довідка

### `prerender(reactNode, options?)`

Викличте `prerender` для рендерингу застосунку в статичний HTML.

```js
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

На клієнті викличте [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) для інтерактивності.

#### Параметри

* **`reactNode`**: React-вузол для рендерингу. Кореневий компонент повинен рендерити тег `<html>`.
* **`options`** (необов'язково):
  * **`bootstrapScripts`**: Масив URL для тегів `<script>`.
  * **`bootstrapModules`**: Генерує `<script type="module">`.
  * **`bootstrapScriptContent`**: Inline `<script>` вміст.
  * **`identifierPrefix`**: Префікс для ID з `useId`.
  * **`namespaceURI`**: Кореневий namespace URI.
  * **`onError`**: Callback для серверних помилок.
  * **`progressiveChunkSize`**: Кількість байтів у chunk.
  * **`signal`**: Abort signal для переривання prerendering.

#### Повертає

`prerender` повертає Promise:

- **При успіху** — об'єкт:
  - **`prelude`**: [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) HTML. Можна прочитати весь потік у рядок.
  - **`postponed`**: JSON-серіалізований об'єкт для передачі в [`resume`](/reference/react-dom/server/resume), або `null` якщо все завершено.

- **При невдачі** — Promise reject.

#### Застереження

`nonce` недоступний при prerendering. Nonces повинні бути унікальними для кожного запиту, тому їх включення в prerender було б небезпечним.

### Коли використовувати `prerender`?

Статичний API `prerender` використовується для **статичної генерації сайтів (SSG)**. На відміну від `renderToString`, `prerender` очікує завантаження всіх даних перед resolve. Це робить його придатним для генерації статичного HTML повної сторінки, включаючи дані через Suspense. Для потокової передачі використовуйте [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream).

---

## Використання

### Рендеринг React-дерева в потік статичного HTML

```js
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

### Рендеринг React-дерева в рядок статичного HTML

```js
import { prerender } from 'react-dom/static';

async function renderToString() {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });

  const reader = prelude.getReader();
  let content = '';
  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      return content;
    }
    content += Buffer.from(value).toString('utf8');
  }
}
```

### Очікування завантаження всіх даних

`prerender` очікує завантаження всіх даних перед завершенням. Використовуйте Suspense для suspend на даних:

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

**Лише data sources з підтримкою Suspense активують Suspense component:** фреймворки типу Relay та Next.js, `lazy`, `use`. Suspense **не** виявляє завантаження в Effect або обробнику подій.

### Переривання prerendering

Примусово завершіть prerender після тайм-ауту:

```js
async function renderToString() {
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort()
  }, 10000);

  const {prelude} = await prerender(<App />, {
    signal: controller.signal,
  });
  // ...
}
```

Suspense boundaries з незавершеними дочірніми елементами будуть включені у fallback стані.

---

## Усунення проблем

### Потік не починається до завершення рендерингу всього застосунку

`prerender` очікує завершення рендерингу всього застосунку, включаючи resolve всіх Suspense boundaries. Він призначений для статичної генерації (SSG) та не підтримує потокову передачу.

Для потокової передачі використовуйте [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream).
