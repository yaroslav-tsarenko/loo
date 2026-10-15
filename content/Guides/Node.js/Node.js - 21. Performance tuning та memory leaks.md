# Node.js - 21. Performance tuning та memory leaks

## Що міряти

- event loop delay;
- p95/p99 latency;
- throughput;
- memory RSS/heap;
- GC pauses;
- CPU profile;
- external dependency latency.

## Типові bottlenecks

- blocking sync code;
- CPU-heavy JSON/crypto/compression;
- N+1 DB/API calls;
- no connection pooling;
- huge payloads;
- memory leaks через global caches/listeners/timers;
- backpressure ignored.

## Heap snapshot

```bash
node --inspect src/index.js
```

Далі Chrome DevTools -> Memory.

## CPU profiling

```bash
node --cpu-prof src/index.js
```

## Memory leak приклади

- Map без eviction;
- EventEmitter listeners не знімаються;
- intervals не очищаються;
- request-specific data зберігається глобально;
- streams не закриваються.

## Senior-підхід

Не оптимізуй наосліп. Спочатку метрика, потім profiling, потім конкретна зміна, потім повторне вимірювання.

## Джерела

- [Profiling Node.js Applications](https://nodejs.org/en/learn/getting-started/profiling)
- [Diagnostics](https://nodejs.org/en/learn/diagnostics)
