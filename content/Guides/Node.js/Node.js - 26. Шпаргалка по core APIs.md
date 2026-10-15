# Node.js - 26. Шпаргалка по core APIs

## fs

```js
import { readFile } from 'node:fs/promises';
const text = await readFile('file.txt', 'utf8');
```

## path

```js
import path from 'node:path';
const file = path.join(process.cwd(), 'data.json');
```

## http

```js
import http from 'node:http';

http.createServer((req, res) => {
  res.end('ok');
}).listen(3000);
```

## stream pipeline

```js
import { pipeline } from 'node:stream/promises';
await pipeline(readable, transform, writable);
```

## crypto

```js
import { randomUUID } from 'node:crypto';
const id = randomUUID();
```

## events

```js
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
```

## worker_threads

```js
import { Worker } from 'node:worker_threads';
const worker = new Worker(new URL('./worker.js', import.meta.url));
```

## test

```js
import test from 'node:test';
import assert from 'node:assert/strict';
```

## fetch

```js
const response = await fetch('https://example.com');
const body = await response.text();
```
