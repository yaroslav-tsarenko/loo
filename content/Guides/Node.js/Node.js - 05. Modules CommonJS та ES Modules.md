# Node.js - 05. Modules CommonJS та ES Modules

## CommonJS

```js
const fs = require('node:fs');

module.exports = {
  readConfig,
};
```

CommonJS синхронний за природою і історично був default у Node.js.

## ES Modules

```js
import fs from 'node:fs/promises';

export async function readConfig() {
  return fs.readFile('config.json', 'utf8');
}
```

ESM вмикається через:

```json
{
  "type": "module"
}
```

або через розширення `.mjs`.

## node: prefix

Для core modules краще використовувати `node:` prefix:

```js
import { readFile } from 'node:fs/promises';
```

Це явно показує, що модуль вбудований.

## Interop

CommonJS і ESM можуть взаємодіяти, але interop має нюанси:

- `require` не може напряму завантажити async ESM без обмежень;
- default/named exports можуть поводитись інакше;
- path helpers різні: у ESM немає `__dirname` за замовчуванням.

## ESM __dirname аналог

```js
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

## Senior-порада

Для нових проєктів частіше обирають ESM, але треба враховувати tooling, test runner, bundler, tsconfig і сумісність dependencies. У legacy Node.js-коді CommonJS все ще дуже поширений.

## Джерела

- [Modules: CommonJS](https://nodejs.org/docs/latest/api/modules.html)
- [Modules: ECMAScript modules](https://nodejs.org/docs/latest/api/esm.html)
