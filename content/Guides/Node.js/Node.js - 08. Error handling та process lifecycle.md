# Node.js - 08. Error handling та process lifecycle

## Operational vs programmer errors

Operational errors:

- database unavailable;
- timeout;
- invalid user input;
- network failure.

Programmer errors:

- bug у коді;
- undefined access;
- invariant violation;
- неправильний API contract.

Operational errors обробляємо і повертаємо контрольовану відповідь. Programmer errors часто мають падати в monitoring і приводити до restart process.

## try/catch

```js
try {
  const user = await getUser(id);
  return user;
} catch (error) {
  logger.error({ error, id }, 'failed to get user');
  throw error;
}
```

## unhandledRejection / uncaughtException

```js
process.on('unhandledRejection', (reason) => {
  logger.fatal({ reason }, 'unhandled rejection');
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.fatal({ error }, 'uncaught exception');
  process.exit(1);
});
```

Після uncaught exception процес може бути в неконсистентному стані. Зазвичай треба graceful shutdown і restart через process manager/orchestrator.

## Exit signals

```js
process.on('SIGTERM', async () => {
  await server.close();
  await db.close();
  process.exit(0);
});
```

## Джерела

- [Errors](https://nodejs.org/docs/latest/api/errors.html)
- [Process](https://nodejs.org/docs/latest/api/process.html)
