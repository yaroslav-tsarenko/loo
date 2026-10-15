# resumeAndPrerenderToNodeStream

## Огляд

`resumeAndPrerenderToNodeStream` продовжує попередньо відрендерене React-дерево до статичного HTML-рядка, використовуючи [Node.js Stream](https://nodejs.org/api/stream.html).

```js
const {prelude, postponed} = await resumeAndPrerenderToNodeStream(reactNode, postponedState, options?)
```

> **Примітка**: Цей API призначений саме для Node.js. Середовища з підтримкою [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), такі як Deno та сучасні edge-середовища, повинні використовувати [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) замість нього.

---

## Довідка

### `resumeAndPrerenderToNodeStream(reactNode, postponedState, options?)`

Викличте `resumeAndPrerenderToNodeStream`, щоб продовжити попередньо відрендерене React-дерево до статичного HTML-рядка.

#### Базовий приклад

```js
import { resumeAndPrerenderToNodeStream } from 'react-dom/static';
import { getPostponedState } from 'storage';

async function handler(request, writable) {
  // Отримуємо та парсимо відкладений стан
  const postponedState = getPostponedState(request);
  const { prelude } = await resumeAndPrerenderToNodeStream(<App />, JSON.parse(postponedState));
  prelude.pipe(writable);
}
```

На клієнті викличте [`hydrateRoot`](/reference/react-dom/client/hydrateRoot), щоб зробити згенерований сервером HTML інтерактивним.

#### Параметри

- **`reactNode`**: React-вузол, з яким ви викликали `prerender` (або попередній `resumeAndPrerenderToNodeStream`). Наприклад, JSX-елемент на кшталт `<App />`. Очікується, що він представляє весь документ, тому компонент `App` повинен рендерити тег `<html>`.

- **`postponedState`**: Непрозорий обʼєкт `postpone`, повернутий з [prerender API](/reference/react-dom/static/index), завантажений з місця, де ви його зберегли (наприклад, redis, файл або S3).

- **`options`** (необовʼязково): Обʼєкт з параметрами потокової передачі.
  - **`signal`** (необовʼязково): [Сигнал переривання](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal), який дозволяє перервати серверний рендеринг і дорендерити решту на клієнті.
  - **`onError`** (необовʼязково): Callback, який спрацьовує при будь-якій серверній помилці, незалежно від того, чи є вона відновлюваною чи ні. За замовчуванням викликає лише `console.error`. Якщо ви перевизначаєте його для логування звітів про збої, переконайтеся, що ви все ще викликаєте `console.error`.

#### Повертає

`resumeAndPrerenderToNodeStream` повертає Promise, який:

- **При успішному рендерингу** вирішується в обʼєкт, що містить:
  - **`prelude`**: [Node.js Stream](https://nodejs.org/api/stream.html) з HTML. Ви можете використовувати цей потік для відправки відповіді частинами або прочитати весь потік у рядок.
  - **`postponed`**: JSON-серіалізовний, непрозорий обʼєкт, який можна передати у [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream) або [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream), якщо `resumeAndPrerenderToNodeStream` був перерваний.

- **При невдачі рендерингу** Promise буде відхилено. Використовуйте це для виведення резервної оболонки.

#### Застереження

`nonce` не є доступною опцією при prerenderʼингу. Nonce повинні бути унікальними для кожного запиту, і якщо ви використовуєте nonce для захисту вашого додатку за допомогою [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP), було б недоречно та небезпечно включати значення nonce в сам prerender.

---

## Коли використовувати `resumeAndPrerenderToNodeStream`?

Статичний API `resumeAndPrerenderToNodeStream` використовується для **статичної серверної генерації (SSG)**. На відміну від `renderToString`, `resumeAndPrerenderToNodeStream` очікує завантаження всіх даних перед вирішенням Promise. Це робить його придатним для генерації статичного HTML для повної сторінки, включаючи дані, які потрібно отримати за допомогою Suspense.

Для потокової передачі контенту в міру його завантаження використовуйте потоковий API серверного рендерингу (SSR), такий як [renderToReadableStream](/reference/react-dom/server/renderToReadableStream).

`resumeAndPrerenderToNodeStream` може бути перерваний і пізніше продовжений іншим `resumeAndPrerenderToNodeStream` або відновлений за допомогою `resume` для підтримки часткового попереднього рендерингу.

---

## Додаткове читання

`resumeAndPrerenderToNodeStream` поводиться подібно до [`prerender`](/reference/react-dom/static/prerender), але може використовуватися для продовження раніше розпочатого процесу prerenderʼингу, який був перерваний. Для отримання додаткової інформації про відновлення попередньо відрендереного дерева дивіться [документацію resume](/reference/react-dom/server/resume#resuming-a-prerender).
