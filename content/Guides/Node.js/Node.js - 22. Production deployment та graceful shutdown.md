# Node.js - 22. Production deployment та graceful shutdown

## Production запуск

Node.js процес має запускатися під process manager або orchestrator:

- systemd;
- PM2;
- Docker/Kubernetes;
- serverless platform;
- managed PaaS.

## Graceful shutdown

```js
const server = app.listen(3000);

async function shutdown(signal) {
  logger.info({ signal }, 'shutting down');

  server.close(async () => {
    await db.end();
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('forced shutdown');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
```

## Health checks

- liveness: process alive;
- readiness: app готовий приймати traffic;
- startup: app завершив boot.

## Config

- env vars;
- secret manager;
- config validation on startup;
- різні config для dev/staging/prod.

## Docker

Поради:

- використовувати LTS image;
- не запускати як root;
- multi-stage build;
- `npm ci --omit=dev` для production dependencies;
- healthcheck;
- graceful shutdown через SIGTERM.

## Джерела

- [Process](https://nodejs.org/docs/latest/api/process.html)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
