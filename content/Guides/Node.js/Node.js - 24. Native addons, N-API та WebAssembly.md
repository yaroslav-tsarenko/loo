# Node.js - 24. Native addons, N-API та WebAssembly

## Native addons

Native addons дозволяють писати частину логіки на C/C++/Rust і викликати з Node.js.

Використання:

- performance-critical code;
- системні інтеграції;
- bindings до existing libraries;
- crypto/media/data processing.

## N-API

N-API дає стабільний ABI layer для native addons, щоб зменшити залежність від конкретної версії V8.

## node-gyp

Історичний інструмент для збирання native addons. Він може ускладнювати install через platform-specific build dependencies.

## WebAssembly

WASM може бути альтернативою native addon для portable compute-heavy modules.

## Trade-offs

- складніший build;
- platform compatibility;
- security review;
- debugging складніший;
- deployment images мають містити потрібні native dependencies.

## Джерела

- [C++ addons](https://nodejs.org/docs/latest/api/addons.html)
- [Node-API](https://nodejs.org/docs/latest/api/n-api.html)
