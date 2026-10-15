# Node.js - 09. Buffers, binary data та encoding

## Buffer

`Buffer` представляє binary data.

```js
const buffer = Buffer.from('hello', 'utf8');
console.log(buffer.toString('hex'));
console.log(buffer.toString('utf8'));
```

## Encoding

Поширені encoding:

- `utf8`;
- `base64`;
- `hex`;
- `ascii`;
- `latin1`.

## Читання файлу як Buffer

```js
import { readFile } from 'node:fs/promises';

const data = await readFile('image.png');
console.log(Buffer.isBuffer(data));
```

## Base64

```js
const token = Buffer.from('user:password').toString('base64');
const decoded = Buffer.from(token, 'base64').toString('utf8');
```

## Security

Не використовуй deprecated unsafe patterns для створення buffer. Якщо потрібен буфер певного розміру:

```js
const safe = Buffer.alloc(1024);
const fastButUnsafe = Buffer.allocUnsafe(1024);
```

`allocUnsafe` швидший, але може містити старі дані в пам'яті, поки ти їх не перезапишеш.

## Джерела

- [Buffer](https://nodejs.org/docs/latest/api/buffer.html)
