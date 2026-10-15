# Node.js - 07. Async programming Promises, async-await та AbortController

## Promise

```js
const result = await fetch('https://example.com');
```

`async/await` робить async code схожим на sync, але він все одно виконується через Promise/microtasks.

## Promise.all

```js
const [user, orders] = await Promise.all([
  getUser(userId),
  getOrders(userId),
]);
```

Використовуй для незалежних async operations.

## Promise.allSettled

```js
const results = await Promise.allSettled(tasks);
```

Корисно, коли треба зібрати всі результати, навіть якщо частина впала.

## AbortController

```js
const controller = new AbortController();

const timeout = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch(url, { signal: controller.signal });
  return await response.json();
} finally {
  clearTimeout(timeout);
}
```

## Timeout helper

```js
function withTimeout(ms) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  return {
    signal: controller.signal,
    cleanup: () => clearTimeout(timeout),
  };
}
```

## Senior-поради

- Не роби async operations послідовними, якщо вони незалежні.
- Завжди думай про timeout, cancellation і retry.
- Не ковтай помилки в `catch`.
- Для retry потрібна idempotency або розуміння side effects.

## Джерела

- [Promises](https://nodejs.org/docs/latest/api/globals.html#class-promise)
- [AbortController](https://nodejs.org/docs/latest/api/globals.html#class-abortcontroller)
