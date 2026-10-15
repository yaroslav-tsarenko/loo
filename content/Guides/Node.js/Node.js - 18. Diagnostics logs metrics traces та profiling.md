# Node.js - 18. Diagnostics logs metrics traces та profiling

## Що треба бачити в production

- request latency;
- error rate;
- process memory;
- event loop delay;
- CPU usage;
- active handles;
- unhandled errors;
- slow external dependencies;
- GC pauses;
- logs з correlation id.

## Structured logs

```js
logger.info({ userId, requestId }, 'user updated');
```

Не логуй secrets, tokens, passwords, payment data.

## perf_hooks

```js
import { monitorEventLoopDelay } from 'node:perf_hooks';

const histogram = monitorEventLoopDelay({ resolution: 20 });
histogram.enable();

setInterval(() => {
  console.log({
    mean: histogram.mean,
    max: histogram.max,
  });
  histogram.reset();
}, 10000);
```

## process reports

Node.js може генерувати diagnostic reports для debugging crashes/hangs.

## Inspector

```bash
node --inspect src/index.js
```

## OpenTelemetry

Для distributed tracing у production часто використовують OpenTelemetry instrumentation.

## Джерела

- [Diagnostics](https://nodejs.org/docs/latest/api/diagnostics_channel.html)
- [perf_hooks](https://nodejs.org/docs/latest/api/perf_hooks.html)
- [Report](https://nodejs.org/docs/latest/api/report.html)
- [Debugger](https://nodejs.org/docs/latest/api/debugger.html)
