# Roadmap практики проєкти і джерела

## Ціль уроку

Закріпити Android курс через практичні проєкти й мати список джерел для подальшого навчання.

## Проєкт 1: Counter і Profile

Рівень: після модуля 3.

Функції:

- Compose layout;
- Material 3 theme;
- state;
- preview;
- accessibility labels.

Що тренує:

- composables;
- modifiers;
- state;
- resources.

## Проєкт 2: Task manager

Рівень: після модуля 4.

Функції:

- task list;
- add task;
- details;
- navigation;
- ViewModel;
- StateFlow;
- validation.

Що тренує:

- UDF;
- ViewModel;
- Navigation Compose;
- state hoisting.

## Проєкт 3: Offline notes

Рівень: після модуля 6.

Функції:

- Room database;
- repository;
- search;
- DataStore theme setting;
- empty/error states;
- DAO tests.

Що тренує:

- data layer;
- persistence;
- Flow;
- local-first UI.

## Проєкт 4: Weather або GitHub client

Рівень: після networking.

Функції:

- network API;
- DTO mapping;
- loading/error states;
- local cache;
- retry;
- pull to refresh.

## Проєкт 5: Background sync app

Рівень: після модуля 7.

Функції:

- WorkManager sync;
- network constraints;
- notification;
- retry;
- manual refresh;
- logs/profiling.

## Проєкт 6: Production checklist app

Рівень: після модуля 9.

Вимоги:

- unit tests;
- Compose UI tests;
- release build;
- minify enabled;
- security checklist;
- permission review;
- app quality review;
- README з architecture diagram.

## Офіційні джерела

- [Android Developers](https://developer.android.com/)
- [Kotlin and Android](https://developer.android.com/kotlin/)
- [Guide to app architecture](https://developer.android.com/jetpack/arch)
- [Architecture recommendations](https://developer.android.com/topic/architecture/recommendations)
- [Get started with Jetpack Compose](https://developer.android.com/develop/ui/compose/documentation)
- [Compose UI architecture](https://developer.android.com/develop/ui/compose/architecture)
- [State and Jetpack Compose](https://developer.android.com/develop/ui/compose/state)
- [Navigation with Compose](https://developer.android.com/develop/ui/compose/navigation)
- [ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel)
- [Kotlin coroutines on Android](https://developer.android.com/kotlin/coroutines)
- [Kotlin flows on Android](https://developer.android.com/kotlin/flow)
- [Room](https://developer.android.com/training/data-storage/room)
- [DataStore](https://developer.android.com/topic/libraries/architecture/datastore)
- [WorkManager](https://developer.android.com/topic/libraries/architecture/workmanager)
- [Permissions](https://developer.android.com/training/permissions)
- [Testing Android apps](https://developer.android.com/training/testing)
- [Compose testing](https://developer.android.com/develop/ui/compose/testing)
- [App performance](https://developer.android.com/topic/performance)
- [Security best practices](https://developer.android.com/privacy-and-security/security-best-practices)
- [Build variants](https://developer.android.com/build/build-variants)
- [Sign your app](https://developer.android.com/studio/publish/app-signing)

## Що вчити після курсу

Якщо ціль Android Junior:

1. Compose layouts and state.
2. ViewModel + Flow.
3. Room + DataStore.
4. Navigation.
5. Testing basics.
6. Permissions.
7. Debugging/profiling.

Якщо ціль Middle:

1. Offline-first architecture.
2. Modularization.
3. Paging.
4. WorkManager advanced.
5. Performance and Baseline Profiles.
6. Security/privacy review.
7. CI/CD and Play release.

## Фінальна перевірка

Ти готовий робити реальний Android app, якщо можеш:

- пояснити Activity lifecycle і process death;
- написати Compose screen зі state hoisting;
- підключити ViewModel і StateFlow;
- побудувати Navigation graph;
- створити repository з Room/DataStore/network;
- зробити permission flow з denied state;
- написати unit і Compose UI tests;
- зібрати release build і пояснити signing/minify.

Після завершення повернися до [[Guides/Android/Зміст|змісту]] і познач статус кожного модуля: `read`, `coded`, `tested`, `project done`.

