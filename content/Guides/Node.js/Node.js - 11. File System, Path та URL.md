# Node.js - 11. File System, Path та URL

## fs/promises

```js
import { readFile, writeFile } from 'node:fs/promises';

const content = await readFile('config.json', 'utf8');
await writeFile('output.txt', content);
```

## Sync API

Sync fs operations блокують event loop.

```js
import { readFileSync } from 'node:fs';

const content = readFileSync('config.json', 'utf8');
```

У CLI або startup code це може бути нормально. У HTTP request handler - зазвичай погано.

## path

```js
import path from 'node:path';

const filePath = path.join(process.cwd(), 'data', 'users.json');
```

## URL

```js
const url = new URL('https://example.com/users?page=2');
console.log(url.searchParams.get('page'));
```

## File URL у ESM

```js
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

## Security

Для user-provided paths:

- нормалізуй шлях;
- не довіряй `../`;
- перевіряй, що результат лишається в allowed directory;
- не відкривай arbitrary file paths із request.

## Джерела

- [File System](https://nodejs.org/docs/latest/api/fs.html)
- [Path](https://nodejs.org/docs/latest/api/path.html)
- [URL](https://nodejs.org/docs/latest/api/url.html)
