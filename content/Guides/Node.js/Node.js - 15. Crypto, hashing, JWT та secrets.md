# Node.js - 15. Crypto, hashing, JWT та secrets

## crypto

```js
import { createHash } from 'node:crypto';

const hash = createHash('sha256')
  .update('hello')
  .digest('hex');
```

## Password hashing

Не використовуй SHA-256 напряму для паролів. Для паролів потрібні password hashing algorithms: Argon2, bcrypt, scrypt.

Node.js має `crypto.scrypt`:

```js
import { scrypt, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

const salt = randomBytes(16).toString('hex');
const key = await scryptAsync('password', salt, 64);
```

## randomUUID

```js
import { randomUUID } from 'node:crypto';

const id = randomUUID();
```

## JWT

JWT - це формат токена, а не security-рішення сам по собі. Важливо:

- перевіряти signature;
- перевіряти `exp`, `iss`, `aud`;
- не класти секретні дані в payload;
- мати key rotation;
- не використовувати weak algorithms.

## Secrets

- не зберігати secrets у git;
- використовувати env/secret manager;
- не логувати tokens;
- обмежувати доступ;
- ротація ключів.

## Джерела

- [Crypto](https://nodejs.org/docs/latest/api/crypto.html)
- [Web Crypto API](https://nodejs.org/docs/latest/api/webcrypto.html)
