# Node.js - 19. Test runner, mocks та coverage

## Built-in test runner

Node.js має вбудований test runner.

```js
import test from 'node:test';
import assert from 'node:assert/strict';

test('adds numbers', () => {
  assert.equal(1 + 2, 3);
});
```

Запуск:

```bash
node --test
```

## Async test

```js
test('loads user', async () => {
  const user = await getUser(1);
  assert.equal(user.id, 1);
});
```

## Mock timers/functions

Node test runner має mocking capabilities через `mock`.

## Coverage

У сучасному Node.js можна використовувати built-in coverage або зовнішні інструменти. У production-командах зазвичай важливі не тільки відсотки, а coverage критичних business flows.

## Test pyramid

- unit tests для pure logic;
- integration tests для DB/API;
- contract tests для зовнішніх API;
- e2e/smoke tests для critical paths.

## Джерела

- [Test Runner](https://nodejs.org/docs/latest/api/test.html)
- [Assert](https://nodejs.org/docs/latest/api/assert.html)
