# Node.js - 17. Events, EventEmitter та AsyncLocalStorage

## EventEmitter

```js
import { EventEmitter } from 'node:events';

const bus = new EventEmitter();

bus.on('user.created', (user) => {
  console.log(user.id);
});

bus.emit('user.created', { id: 1 });
```

## Error event

Якщо EventEmitter emit-ить `error` без listener, процес може впасти.

```js
bus.on('error', (error) => {
  logger.error({ error }, 'event bus error');
});
```

## AsyncLocalStorage

AsyncLocalStorage дозволяє зберігати context між async calls, наприклад request id.

```js
import { AsyncLocalStorage } from 'node:async_hooks';

const storage = new AsyncLocalStorage();

function withRequestContext(req, handler) {
  return storage.run({ requestId: req.headers['x-request-id'] }, handler);
}

function getRequestId() {
  return storage.getStore()?.requestId;
}
```

## Використання

- request correlation id;
- tracing;
- tenant context;
- auth context для logging.

## Джерела

- [Events](https://nodejs.org/docs/latest/api/events.html)
- [Async Context](https://nodejs.org/docs/latest/api/async_context.html)
- [Async Hooks](https://nodejs.org/docs/latest/api/async_hooks.html)
