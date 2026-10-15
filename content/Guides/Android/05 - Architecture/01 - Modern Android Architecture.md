# Modern Android Architecture

## Ціль уроку

Зрозуміти офіційно рекомендовану Android-архітектуру: layers, separation of concerns, UDF, coroutines, Flow і DI.

## Основна ідея

Android Developers рекомендують архітектуру, яка масштабується, тестується й адаптується до різних form factors.

Мінімальні layers:

- UI layer;
- data layer.

Опційно:

- domain layer.

## Common principles

### Separation of concerns

Activity/Fragment/Composable не мають містити всю логіку app. UI показує state і відправляє events.

### Drive UI from data models

UI має бути результатом state, а не набором ручних imperative updates.

### Single source of truth

Для кожного типу даних має бути зрозуміле джерело правди: database, repository cache, remote API, DataStore.

### Unidirectional Data Flow

State down, events up. Це правило добре працює на UI, domain і data boundaries.

## Типова схема

```text
UI screen
  -> ViewModel
    -> UseCase або Repository
      -> DataSource
        -> Network/Database/DataStore
```

Dependencies ідуть всередину: UI залежить від domain/data contracts, data не має залежати від UI.

## Чому це важливо

Без architecture Android app швидко стає fragile:

- Activity містить network/database/UI logic;
- lifecycle bugs;
- важко тестувати;
- неможливо замінити API або storage;
- duplicate state;
- navigation і business logic перемішані.

## Вправа

Візьми task app і намалюй layers:

1. UI: screens, ViewModels, UI state.
2. Domain: use cases, entities.
3. Data: repositories, local/remote data sources.
4. Познач dependency direction.

## Типові помилки

- Робити "Clean Architecture" з 10 layers для маленької app.
- Тримати Android `Context` у domain logic.
- Плутати DTO, entity і UI model.
- Мати кілька competing sources of truth.

## Джерела

- [Guide to app architecture](https://developer.android.com/jetpack/arch)
- [Architecture recommendations](https://developer.android.com/topic/architecture/recommendations)
- [Compose UI architecture](https://developer.android.com/develop/ui/compose/architecture)

## Далі

Переходь до [[Guides/Android/05 - Architecture/02 - UI layer domain layer data layer|UI layer, domain layer і data layer]].

