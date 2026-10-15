# Networking serialization і offline first

## Ціль уроку

Навчитися проєктувати network layer, DTO, error handling і offline-first data flow.

## Network layer

Популярні варіанти:

- Retrofit + OkHttp;
- Ktor Client;
- GraphQL clients;
- raw OkHttp для спеціальних випадків.

Network layer не має повертати UI state напряму.

## DTO

```kotlin
@Serializable
data class TaskDto(
    val id: String,
    val title: String,
    val completed: Boolean
)
```

Mapping:

```kotlin
fun TaskDto.toDomain(): Task {
    return Task(
        id = id,
        title = title,
        isDone = completed
    )
}
```

## Error handling

Плануй:

- no internet;
- timeout;
- 401/403;
- 404;
- 500;
- invalid JSON;
- partial data;
- retry strategy.

Repository може повертати Flow з local data, а sync errors окремо показувати як UI events/state.

## Offline-first

Offline-first підхід:

1. UI observes local database.
2. Repository syncs remote -> local.
3. User changes пишуться local first або queued.
4. Background sync через WorkManager.

Це дає app, яка не стає порожньою без network.

## Вправа

Спроєктуй API для tasks:

1. `TaskDto`.
2. `TaskApi`.
3. `TaskRemoteDataSource`.
4. `TaskRepository`.
5. Mapping DTO -> domain.
6. Error model для network failure.

## Типові помилки

- Показувати тільки network response без local cache.
- Змішувати DTO і UI model.
- Не обробляти empty/error/loading states.
- Retry без backoff і cancellation.

## Джерела

- [Data layer](https://developer.android.com/topic/architecture/data-layer)
- [Offline first](https://developer.android.com/topic/architecture/data-layer/offline-first)
- [Kotlin serialization](https://kotlinlang.org/docs/serialization.html)
- [Ktor Client](https://ktor.io/docs/client-create-new-application.html)

## Далі

Переходь до [[Guides/Android/06 - Data Layer/02 - Room database migrations і repositories|Room database, migrations і repositories]].

