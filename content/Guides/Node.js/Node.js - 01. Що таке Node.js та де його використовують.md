# Node.js - 01. Що таке Node.js та де його використовують

## Коротко

Node.js - це JavaScript runtime для server-side і tooling-сценаріїв. Він побудований на V8, використовує libuv для event loop, async I/O і thread pool, а також має стандартні core modules: `fs`, `http`, `stream`, `crypto`, `net`, `tls`, `worker_threads`, `child_process` та інші.

## Де Node.js сильний

- REST/GraphQL API;
- BFF-шари;
- real-time сервіси через WebSocket/SSE;
- CLI tooling;
- build tools;
- streaming data pipelines;
- serverless functions;
- integration services;
- I/O-heavy workloads.

## Де Node.js не завжди найкращий

- CPU-heavy обчислення в одному потоці;
- high-frequency low-latency systems;
- задачі, де потрібні жорсткі real-time guarantees;
- дуже важка data processing без worker model.

Це не означає, що Node.js не може виконувати CPU-heavy задачі. Але для цього потрібні Worker Threads, native modules, WebAssembly або винесення роботи в окремі сервіси.

## Senior-пояснення

Node.js варто сприймати як event-driven runtime. Він дуже ефективний, коли процес чекає на мережу, диск, БД або зовнішні API. Але якщо заблокувати event loop CPU-heavy кодом або sync I/O, один процес почне погано відповідати всім клієнтам.

## Джерела

- [About Node.js](https://nodejs.org/en/about)
- [Node.js API Docs](https://nodejs.org/docs/latest/api/)
