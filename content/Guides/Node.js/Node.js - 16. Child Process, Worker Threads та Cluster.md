# Node.js - 16. Child Process, Worker Threads та Cluster

## child_process

Для запуску зовнішніх процесів:

```js
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const { stdout } = await execFileAsync('node', ['--version']);
```

Не передавай user input у shell без sanitization. Краще `execFile`, ніж `exec`, якщо shell не потрібен.

## Worker Threads

Для CPU-heavy JS-коду:

```js
import { Worker } from 'node:worker_threads';

const worker = new Worker(new URL('./worker.js', import.meta.url));
worker.postMessage({ input: 42 });
```

Worker Threads мають окремий JS thread, але в тому самому process.

## Cluster

Cluster дозволяє запускати кілька worker processes, які ділять server port. У сучасному production часто замінюється process manager, контейнерами або orchestrator-ом.

## Коли що обирати

- `child_process` - зовнішня команда або ізоляція process.
- `worker_threads` - CPU-heavy JS у межах одного service.
- `cluster` - multi-process Node server, якщо немає контейнерного scaling.

## Джерела

- [Child Process](https://nodejs.org/docs/latest/api/child_process.html)
- [Worker Threads](https://nodejs.org/docs/latest/api/worker_threads.html)
- [Cluster](https://nodejs.org/docs/latest/api/cluster.html)
