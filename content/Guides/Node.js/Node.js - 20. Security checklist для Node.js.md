# Node.js - 20. Security checklist для Node.js

## Input validation

Валідуй усе, що приходить ззовні: body, query, params, headers, files, webhooks.

## Injection

Не конкатенуй SQL/commands.

```js
// Погано
await db.query(`SELECT * FROM users WHERE id = ${id}`);

// Добре
await db.query('SELECT * FROM users WHERE id = $1', [id]);
```

## Command injection

Уникай `exec` з user input. Краще `execFile` або library API.

## Prototype pollution

Обережно merge-ити user objects у config/options.

## SSRF

Якщо сервер робить request за user-provided URL, перевіряй allowlist, block private IP ranges, redirects і protocols.

## Secrets

- не логувати;
- не зберігати в repo;
- використовувати secret manager;
- ротація.

## HTTP security

- HTTPS;
- secure cookies;
- CSRF для cookie-based auth;
- CORS allowlist;
- rate limiting;
- request body limits;
- security headers.

## Dependencies

- `npm audit`;
- SCA tooling;
- lockfile review;
- мінімум dependencies;
- оновлення LTS і packages.

## Джерела

- [Node.js Security Best Practices](https://nodejs.org/en/learn/getting-started/security-best-practices)
- [OWASP Node.js Docker Security](https://cheatsheetseries.owasp.org/)
