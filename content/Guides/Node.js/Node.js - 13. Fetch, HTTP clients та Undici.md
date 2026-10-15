# Node.js - 13. Fetch, HTTP clients та Undici

## fetch у Node.js

Сучасний Node.js має global `fetch`.

```js
const response = await fetch('https://api.example.com/users');

if (!response.ok) {
  throw new Error(`Request failed: ${response.status}`);
}

const data = await response.json();
```

## Timeout через AbortController

```js
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 3000);

try {
  const response = await fetch(url, { signal: controller.signal });
  return await response.json();
} finally {
  clearTimeout(timeout);
}
```

## Undici

Node.js використовує Undici як HTTP client implementation для fetch. Undici також можна використовувати напряму для advanced pooling, dispatchers і performance-sensitive clients.

## Production concerns

- timeouts;
- retries з idempotency;
- circuit breakers;
- connection pooling;
- response size limits;
- structured logging;
- tracing headers;
- handling non-2xx responses.

## Джерела

- [Fetch](https://nodejs.org/docs/latest/api/globals.html#fetch)
- [Undici](https://nodejs.org/docs/latest/api/undici.html)
