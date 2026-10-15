# Node.js - 03. Runtime архітектура V8, libuv та bindings

## Основні частини

- **V8** - JavaScript engine: parsing, JIT, garbage collection.
- **libuv** - event loop, async I/O, thread pool, timers, networking primitives.
- **Node core modules** - стандартна бібліотека.
- **C++ bindings** - міст між JS API і системними можливостями.

## Що відбувається під час виконання

1. Node.js запускає процес.
2. V8 виконує JavaScript.
3. Async operations реєструються в libuv або OS.
4. Callback/promise continuation повертається в event loop.
5. V8 виконує JS-код callback-ів.

## Thread pool

libuv має thread pool для деяких операцій:

- частина `fs`;
- DNS через `dns.lookup`;
- crypto operations;
- compression;
- user code через native addons.

Розмір thread pool можна змінити через `UV_THREADPOOL_SIZE`, але це не silver bullet. Якщо всі threads забиті expensive crypto/fs operations, latency інших операцій може вирости.

## Senior-пояснення

Node.js не є "single-threaded" у буквальному сенсі. JavaScript виконується в одному main thread, але runtime використовує OS async I/O і thread pool. Важлива різниця: твій JS-код не повинен блокувати main thread.

## Джерела

- [Node.js API Docs](https://nodejs.org/docs/latest/api/)
- [Don't Block the Event Loop](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop)
