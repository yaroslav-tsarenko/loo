# resumeToPipeableStream

## Огляд

`resumeToPipeableStream` передає попередньо відрендерене React-дерево у pipeable [Node.js Stream](https://nodejs.org/api/stream.html).

```js
const {pipe, abort} = await resumeToPipeableStream(reactNode, postponedState, options?)
```

> **Примітка**: Цей API призначений саме для Node.js. Середовища з підтримкою [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), такі як Deno та сучасні edge-середовища, повинні використовувати [`resume`](/reference/react-dom/server/resume) замість нього.

---

## Довідка

### `resumeToPipeableStream(node, postponed, options?)`

Викличте `resumeToPipeableStream`, щоб відновити рендеринг попередньо відрендереного React-дерева у вигляді HTML у [Node.js Stream](https://nodejs.org/api/stream.html#writable-streams).

```js
import { resumeToPipeableStream } from 'react-dom/server';
import { getPostponedState } from './storage';

async function handler(request, response) {
  // Отримуємо відкладений стан з попереднього prerenderʼу
  const postponed = await getPostponedState(request);
  const { pipe } = resumeToPipeableStream(<App />, postponed, {
    onShellReady: () => {
      // Починаємо потокову передачу, коли оболонка готова
      pipe(response);
    }
  });
}
```

#### Параметри

- **`reactNode`**: React-вузол, з яким ви викликали `prerender`. Наприклад, JSX-елемент на кшталт `<App />`. Очікується, що він представляє весь документ, тому компонент `App` повинен рендерити тег `<html>`.

- **`postponedState`**: Непрозорий обʼєкт `postpone`, повернутий з [prerender API](/reference/react-dom/static/index), завантажений з місця, де ви його зберегли (наприклад, redis, файл або S3).

- **`options`** (необовʼязково): Обʼєкт з параметрами потокової передачі.
  - **`nonce`** (необовʼязково): Рядок [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) для дозволу скриптів для [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  - **`signal`** (необовʼязково): [Сигнал переривання](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal), який дозволяє перервати серверний рендеринг і дорендерити решту на клієнті.
  - **`onError`** (необовʼязково): Callback, який спрацьовує при будь-якій серверній помилці, незалежно від того, чи є вона відновлюваною чи ні. За замовчуванням викликає лише `console.error`. Якщо ви перевизначаєте його для логування звітів про збої, переконайтеся, що ви все ще викликаєте `console.error`.
  - **`onShellReady`** (необовʼязково): Callback, який спрацьовує одразу після завершення рендерингу оболонки (shell). Тут можна викликати `pipe`, щоб почати потокову передачу. React буде передавати додатковий контент після оболонки разом з вбудованими тегами `<script>`, які замінюють HTML-заглушки завантаження на фактичний контент.
  - **`onShellError`** (необовʼязково): Callback, який спрацьовує, якщо під час рендерингу оболонки сталася помилка. Він отримує помилку як аргумент. Жоден байт ще не був відправлений з потоку, і ні `onShellReady`, ні `onAllReady` не будуть викликані, тому ви можете вивести резервну HTML-оболонку або використати prelude.

#### Повертає

`resumeToPipeableStream` повертає обʼєкт з двома методами:

- **`pipe`**: Виводить HTML у наданий [Writable Node.js Stream](https://nodejs.org/api/stream.html#writable-streams). Викличте `pipe` в `onShellReady`, якщо хочете увімкнути потокову передачу, або в `onAllReady` для краулерів та статичної генерації.
- **`abort`**: Дозволяє перервати серверний рендеринг і дорендерити решту на клієнті.

#### Застереження

- `resumeToPipeableStream` не приймає опції `bootstrapScripts`, `bootstrapScriptContent` або `bootstrapModules`. Натомість ці опції потрібно передати у виклик `prerender`, який генерує `postponedState`. Ви також можете вручну вставити bootstrap-контент у writable stream.
- `resumeToPipeableStream` не приймає `identifierPrefix`, оскільки префікс має бути однаковим і в `prerender`, і в `resumeToPipeableStream`.
- Оскільки `nonce` не можна передати в prerender, ви повинні передавати `nonce` у `resumeToPipeableStream` лише тоді, коли ви не передаєте скрипти в prerender.
- `resumeToPipeableStream` виконує повторний рендеринг від кореня, доки не знайде компонент, який не був повністю попередньо відрендерений. Тільки повністю попередньо відрендерені компоненти (компонент і всі його дочірні елементи завершили prerenderʼинг) пропускаються повністю.

---

## Використання

### Додаткове читання

- Відновлення (resume) поводиться як `renderToReadableStream`. Для більшої кількості прикладів перегляньте [розділ використання `renderToReadableStream`](/reference/react-dom/server/renderToReadableStream#usage).
- [Розділ використання `prerender`](/reference/react-dom/static/prerender#usage) містить приклади того, як використовувати `prerenderToNodeStream` конкретно.
