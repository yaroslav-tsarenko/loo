# Debugging logging profiling і app quality

## Ціль уроку

Навчитися знаходити проблеми через Android Studio tools, Logcat, debugger, profiler, emulator і quality guidelines.

## Debugger

Використовуй breakpoints для:

- ViewModel event handlers;
- repository calls;
- mapping functions;
- permission results;
- navigation callbacks.

Не debug-ь усе через logs.

## Logcat

Logs мають бути корисними:

- feature tag;
- event/context;
- без sensitive user data;
- debug logs не мають засмічувати release.

## Android Studio Profiler

Профілюй:

- CPU;
- memory;
- network;
- energy;
- startup.

## Layout Inspector

Для Compose перевіряй composition tree, recompositions і UI hierarchy.

## Emulator matrix

Тестуй хоча б:

- small phone;
- large phone;
- tablet/foldable;
- dark mode;
- different font scale;
- Android API lower/current/latest target.

## App quality

Core app quality включає:

- stability;
- privacy/security;
- performance;
- accessibility;
- behavior across form factors;
- permissions;
- background work;
- release readiness.

## Вправа

1. Запусти app на двох різних emulator sizes.
2. Увімкни dark mode.
3. Збільш font scale.
4. Перевір Logcat на errors.
5. Відкрий profiler під час scroll list.

## Типові помилки

- Перевіряти тільки один emulator.
- Логувати tokens/email/location.
- Ігнорувати warnings у Logcat.
- Не тестувати release build.
- Не перевіряти accessibility і font scaling.

## Джерела

- [Android Studio debugging](https://developer.android.com/studio/debug)
- [Logcat](https://developer.android.com/studio/debug/logcat)
- [Profile your app](https://developer.android.com/studio/profile)
- [Core app quality](https://developer.android.com/docs/quality-guidelines/core-app-quality)

## Далі

Переходь до [[Guides/Android/08 - Testing Debugging and Performance/03 - Performance memory startup і battery|performance, memory, startup і battery]].

