# Node.js - 14. Net, TCP, TLS та HTTPS

## net

`node:net` дозволяє створювати TCP server/client.

```js
import net from 'node:net';

const server = net.createServer((socket) => {
  socket.write('hello\n');
  socket.end();
});

server.listen(4000);
```

## TLS

`node:tls` додає encrypted sockets.

## HTTPS

```js
import https from 'node:https';
import { readFileSync } from 'node:fs';

const server = https.createServer({
  key: readFileSync('server.key'),
  cert: readFileSync('server.crt'),
}, (req, res) => {
  res.end('secure');
});

server.listen(3443);
```

## Production

У production TLS часто завершується на load balancer, reverse proxy або ingress. Але backend все одно має правильно працювати з forwarded headers, trusted proxy config і secure cookies.

## Джерела

- [Net](https://nodejs.org/docs/latest/api/net.html)
- [TLS](https://nodejs.org/docs/latest/api/tls.html)
- [HTTPS](https://nodejs.org/docs/latest/api/https.html)
