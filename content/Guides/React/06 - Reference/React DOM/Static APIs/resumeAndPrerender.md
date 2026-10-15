# resumeAndPrerender

## Огляд

`resumeAndPrerender` продовжує попередньо відрендерене React-дерево до статичного HTML-рядка, використовуючи [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).

```js
const { prelude, postponed } = await resumeAndPrerender(reactNode, postponedState, options?)
```

> **Важливо**: Цей API залежить від [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). Для Node.js використовуйте [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) замість нього.

---

## Довідка

### `resumeAndPrerender(reactNode, postponedState, options?)`

Викличте `resumeAndPrerender`, щоб продовжити попередньо відрендерене React-дерево до статичного HTML-рядка.

#### Приклад

```js
import { resumeAndPrerender } from 'react-dom/static';
import { getPostponedState } from 'storage';

async function handler(request, response) {
  // Отримуємо відкладений стан
  const postponedState = getPostponedState(request);
  const { prelude } = await resumeAndPrerender(<App />, postponedState, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

На клієнті викличте [`hydrateRoot`](/reference/react-dom/client/hydrateRoot), щоб зробити згенерований сервером HTML інтерактивним.

#### Параметри

- **`reactNode`**: React-вузол, з яким ви викликали `prerender` (або попередній `resumeAndPrerender`). Наприклад, JSX-елемент на кшталт `<App />`. Очікується, що він представляє весь документ, тому компонент `App` повинен рендерити тег `<html>`.

- **`postponedState`**: Непрозорий обʼєкт `postpone`, повернутий з [prerender API](/reference/react-dom/static/index), завантажений з місця, де ви його зберегли (наприклад, redis, файл або S3).

- **`options`** (необовʼязково): Обʼєкт з параметрами потокової передачі.
  - **`signal`** (необовʼязково): [Сигнал переривання](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal), який дозволяє перервати серверний рендеринг і дорендерити решту на клієнті.
  - **`onError`** (необовʼязково): Callback, який спрацьовує при будь-якій серверній помилці, незалежно від того, чи є вона відновлюваною чи ні. За замовчуванням викликає лише `console.error`. Якщо ви перевизначаєте його для логування звітів про збої, переконайтеся, що ви все ще викликаєте `console.error`.

#### Повертає

Повертає Promise, який:

- **При успіху** вирішується в обʼєкт, що містить:
  - **`prelude`**: [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) з HTML. Ви можете використовувати цей потік для відправки відповіді частинами або прочитати весь потік у рядок.
  - **`postponed`**: JSON-серіалізовний, непрозорий обʼєкт, який можна передати у [`resume`](/reference/react-dom/server/resume) або [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender), якщо `prerender` був перерваний.

- **При невдачі** Promise буде відхилено. Використовуйте це для виведення резервної оболонки.

#### Застереження

`nonce` не є доступною опцією при prerenderʼингу. Nonce повинні бути унікальними для кожного запиту, і якщо ви використовуєте nonce для захисту вашого додатку за допомогою [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP), було б недоречно та небезпечно включати значення nonce в сам prerender.

---

## Коли використовувати `resumeAndPrerender`?

Статичний API `resumeAndPrerender` використовується для **статичної серверної генерації (SSG)**. На відміну від `renderToString`, `resumeAndPrerender` очікує завантаження всіх даних перед вирішенням Promise. Це робить його придатним для генерації статичного HTML для повної сторінки, включаючи дані, які потрібно отримати за допомогою Suspense.

Для потокової передачі контенту в міру його завантаження використовуйте потоковий API серверного рендерингу (SSR), такий як [renderToReadableStream](/reference/react-dom/server/renderToReadableStream).

`resumeAndPrerender` може бути перерваний і пізніше продовжений іншим `resumeAndPrerender` або відновлений за допомогою `resume` для підтримки часткового попереднього рендерингу.

---

## Використання

`resumeAndPrerender` поводиться подібно до [`prerender`](/reference/react-dom/static/prerender), але може використовуватися для продовження раніше розпочатого процесу prerenderʼингу, який був перерваний. Для отримання додаткової інформації про відновлення попередньо відрендереного дерева дивіться [документацію resume](/reference/react-dom/server/resume#resuming-a-prerender).
