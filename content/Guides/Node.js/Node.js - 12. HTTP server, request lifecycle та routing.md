# Node.js - 12. HTTP server, request lifecycle та routing

## Базовий HTTP server

```js
import http from 'node:http';

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(3000);
```

## Request lifecycle

1. TCP connection.
2. HTTP parser.
3. Request object.
4. Body reading.
5. Routing.
6. Business logic.
7. Response headers/body.
8. Connection keep-alive або close.

## Body parsing

```js
async function readJson(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
```

Production body parser має мати size limit.

## Frameworks

У реальних API частіше використовують Fastify, Express, NestJS, Hono або framework поверх Node.js. Але core `http` треба розуміти, бо всі abstractions стоять над request/response lifecycle.

## Джерела

- [HTTP](https://nodejs.org/docs/latest/api/http.html)
- [HTTP/2](https://nodejs.org/docs/latest/api/http2.html)
