# Node.js - Зміст

> Повний покроковий гайд по Node.js: runtime, event loop, modules, async programming, streams, HTTP, security, diagnostics, performance і production.

Node.js - це JavaScript runtime на базі V8, який дозволяє виконувати JavaScript поза браузером. Його сильна сторона - I/O-bound backend, API, real-time сервіси, CLI, tooling, workers, streams і інтеграція з npm ecosystem.

---

## Швидкий маршрут навчання

1. [[Node.js - 01. Що таке Node.js та де його використовують]]
2. [[Node.js - 02. Встановлення, версії та LTS]]
3. [[Node.js - 03. Runtime архітектура V8, libuv та bindings]]
4. [[Node.js - 04. Event Loop, microtasks та timers]]
5. [[Node.js - 05. Modules CommonJS та ES Modules]]
6. [[Node.js - 06. npm, package.json та dependency management]]
7. [[Node.js - 07. Async programming Promises, async-await та AbortController]]
8. [[Node.js - 08. Error handling та process lifecycle]]
9. [[Node.js - 09. Buffers, binary data та encoding]]
10. [[Node.js - 10. Streams та backpressure]]
11. [[Node.js - 11. File System, Path та URL]]
12. [[Node.js - 12. HTTP server, request lifecycle та routing]]
13. [[Node.js - 13. Fetch, HTTP clients та Undici]]
14. [[Node.js - 14. Net, TCP, TLS та HTTPS]]
15. [[Node.js - 15. Crypto, hashing, JWT та secrets]]
16. [[Node.js - 16. Child Process, Worker Threads та Cluster]]
17. [[Node.js - 17. Events, EventEmitter та AsyncLocalStorage]]
18. [[Node.js - 18. Diagnostics logs metrics traces та profiling]]
19. [[Node.js - 19. Test runner, mocks та coverage]]
20. [[Node.js - 20. Security checklist для Node.js]]
21. [[Node.js - 21. Performance tuning та memory leaks]]
22. [[Node.js - 22. Production deployment та graceful shutdown]]
23. [[Node.js - 23. TypeScript у Node.js]]
24. [[Node.js - 24. Native addons, N-API та WebAssembly]]
25. [[Node.js - 25. Senior interview Q&A]]
26. [[Node.js - 26. Шпаргалка по core APIs]]

---

## Актуальність

- Офіційний endpoint `https://nodejs.org/docs/latest/api/` веде на current API документацію Node.js.
- Current-версія потрібна для нових API та вивчення платформи.
- Для production зазвичай обирають Active LTS або Maintenance LTS, а не current, якщо немає конкретної причини.
- Станом на 2026 Node.js release line має активні LTS-гілки v24 Krypton та v22 Jod, а current-гілка - v26.

---

## Офіційні джерела

- [Node.js Latest API Docs](https://nodejs.org/docs/latest/api/)
- [Node.js Releases](https://nodejs.org/en/about/previous-releases)
- [Node.js Learn](https://nodejs.org/en/learn)
- [Node.js Security Best Practices](https://nodejs.org/en/learn/getting-started/security-best-practices)
