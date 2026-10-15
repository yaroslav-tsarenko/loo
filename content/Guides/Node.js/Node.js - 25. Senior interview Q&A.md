# Node.js - 25. Senior interview Q&A

## 1. Як би ви пояснили Node.js senior-інтерв'юеру?

Node.js - це event-driven JavaScript runtime для I/O-heavy backend і tooling. Його сила в async I/O, streams, npm ecosystem і швидкій розробці. Його слабке місце - blocking CPU work у main thread, тому production Node.js вимагає дисципліни навколо event loop, timeouts, backpressure, memory і observability.

## 2. Node.js single-threaded чи ні?

JS-код виконується в одному main thread, але Node.js використовує libuv, OS async I/O і thread pool. Для CPU-heavy задач можна використовувати Worker Threads або окремі процеси. Тому коректніше казати: JavaScript execution зазвичай single-threaded, runtime - ні.

## 3. Що таке event loop?

Event loop - механізм, який виконує callbacks для async operations у фазах. Він дозволяє одному процесу обслуговувати багато I/O operations без thread per request. Якщо заблокувати event loop sync/CPU-heavy кодом, latency росте для всіх requests.

## 4. Що таке backpressure?

Backpressure - ситуація, коли consumer не встигає обробляти дані від producer. У Node.js streams це контролюється через internal buffering і signals. Ігнорування backpressure може привести до memory growth і crash.

## 5. Як обробляти unhandled errors?

Operational errors обробляю локально. Unhandled rejection/uncaught exception логую як fatal і завершую процес через graceful shutdown, бо стан процесу може бути неконсистентним. Restart має робити orchestrator/process manager.

## 6. Як масштабувати Node.js API?

Спочатку прибираю bottlenecks: DB queries, external calls, event loop blocking, connection pooling. Потім horizontal scaling через кілька процесів/контейнерів, load balancer, stateless design, shared cache/queue. CPU-heavy роботу виношу в workers або окремий сервіс.

## 7. Як знайти memory leak?

Дивлюсь RSS/heap trends, роблю heap snapshots, порівнюю retained objects, перевіряю Maps/caches/listeners/timers/closures. Важливо відтворити leak під навантаженням і підтвердити fix повторним профілюванням.

## 8. Як захистити Node.js API?

Runtime validation, authz на сервері, rate limiting, body limits, secure headers, safe DB queries, SSRF protection, dependency scanning, secrets management, logging без sensitive data, регулярні LTS updates.

## 9. Коли використовувати Worker Threads?

Коли є CPU-heavy JS task, яка блокує event loop: image processing, compression, parsing, crypto-like compute, large transformations. Для зовнішніх процесів або isolation краще child_process.

## 10. Як правильно робити graceful shutdown?

На SIGTERM перестати приймати нові connections, дочекатися активних requests, закрити DB/queue clients, flush logs/traces і вийти з кодом 0. Має бути timeout для forced shutdown.
