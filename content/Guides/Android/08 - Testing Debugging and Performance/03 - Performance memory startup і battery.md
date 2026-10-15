# Performance memory startup і battery

## Ціль уроку

Навчитися думати про Android performance: startup, jank, memory, recomposition, battery і background work.

## Startup

Погано для startup:

- важка робота в `Application.onCreate`;
- synchronous disk/network calls на main thread;
- eager initialization усіх SDK;
- blocking dependency graph.

Практика:

- lazy initialization;
- baseline profiles;
- defer non-critical work;
- measure cold/warm startup.

## Jank

Jank - пропущені frames або нестабільний UI rendering.

Причини:

- heavy work on main thread;
- надто складний layout;
- excessive recomposition;
- великі images;
- inefficient lazy list items.

## Compose performance

Правила:

- stable keys у lazy lists;
- не створюй expensive objects у composable body без `remember`;
- state має бути scoped мінімально;
- derived values через `remember`/`derivedStateOf` там, де треба;
- не trigger-ь recomposition всього screen через дрібний state.

## Memory

Типові leaks:

- static reference to Activity/Context;
- coroutine scope, який живе довше lifecycle;
- listener не знятий;
- bitmap/cache без limits;
- ViewModel тримає Activity context.

## Battery

Battery-friendly:

- WorkManager constraints;
- batching sync;
- no polling loops;
- use push when appropriate;
- avoid wake locks unless necessary.

## Вправа

1. Додай LazyColumn з 1000 items.
2. Постав stable keys.
3. Перевір profiler під час scroll.
4. Додай fake heavy computation і перенеси її з Main.
5. Поясни, що змінилося.

## Типові помилки

- Оптимізувати без вимірювання.
- Робити network/disk на main thread.
- Ігнорувати startup cost third-party SDK.
- Запускати periodic background work занадто часто.
- Тримати Activity context у singleton.

## Джерела

- [Guide to app performance](https://developer.android.com/topic/performance)
- [Performance tests](https://developer.android.com/training/testing/instrumented-tests/performance)
- [Compose performance](https://developer.android.com/develop/ui/compose/performance)
- [App startup](https://developer.android.com/topic/performance/appstartup)

## Далі

Переходь до [[Guides/Android/09 - Security Release and Practice/01 - Security privacy і hardening checklist|security, privacy і hardening checklist]].

