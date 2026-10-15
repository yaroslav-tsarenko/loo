# Node.js - 10. Streams та backpressure

## Що таке stream

Stream дозволяє обробляти дані частинами, не тримаючи все в пам'яті. Це критично для великих файлів, HTTP responses, compression, uploads, logs.

Типи:

- Readable;
- Writable;
- Duplex;
- Transform.

## pipeline

```js
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

await pipeline(
  createReadStream('input.log'),
  createGzip(),
  createWriteStream('input.log.gz'),
);
```

`pipeline` правильно обробляє backpressure і errors.

## Backpressure

Backpressure виникає, коли producer генерує дані швидше, ніж consumer може їх обробити. Якщо ігнорувати backpressure, процес може з'їсти пам'ять.

## Async iterator

```js
import { createReadStream } from 'node:fs';

for await (const chunk of createReadStream('large.txt', 'utf8')) {
  console.log(chunk);
}
```

## Senior-порада

Не використовуй `readFile` для дуже великих файлів або streaming uploads. Streams - правильний primitive для memory-safe data flow.

## Джерела

- [Stream](https://nodejs.org/docs/latest/api/stream.html)
- [Backpressuring in Streams](https://nodejs.org/en/learn/modules/backpressuring-in-streams)
