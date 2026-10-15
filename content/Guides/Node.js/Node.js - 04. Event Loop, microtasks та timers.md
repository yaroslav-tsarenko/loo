# Node.js - 04. Event Loop, microtasks та timers

## Event loop

Event loop координує виконання callback-ів для async operations. Він проходить через phases: timers, pending callbacks, poll, check, close callbacks та інші внутрішні етапи.

## Timers

```js
setTimeout(() => {
  console.log('timeout');
}, 0);

setImmediate(() => {
  console.log('immediate');
});
```

Порядок між `setTimeout(..., 0)` і `setImmediate` залежить від контексту запуску, особливо якщо вони викликаються всередині I/O callback.

## Microtasks

Promise callbacks виконуються в microtask queue.

```js
console.log('start');

Promise.resolve().then(() => console.log('promise'));

setTimeout(() => console.log('timeout'), 0);

console.log('end');
```

Типовий порядок:

```text
start
end
promise
timeout
```

## process.nextTick

`process.nextTick` має особливу чергу і може виконуватись перед promise microtasks. Якщо зловживати ним рекурсивно, можна starving event loop.

## Що блокує event loop

- sync filesystem;
- великий JSON.parse/stringify;
- CPU-heavy loops;
- synchronous crypto;
- regex із catastrophic backtracking;
- великі serial computations.

## Джерела

- [Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
- [Timers API](https://nodejs.org/docs/latest/api/timers.html)
- [process.nextTick](https://nodejs.org/docs/latest/api/process.html#processnexttickcallback-args)
