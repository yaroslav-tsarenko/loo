# UI layer domain layer data layer

## Ціль уроку

Навчитися розділяти responsibilities між UI, domain і data layer.

## UI layer

UI layer:

- displays application data;
- handles user interaction;
- owns screen UI state through ViewModel/state holder;
- maps domain data to UI models;
- calls domain/use cases/repositories.

Приклад state:

```kotlin
data class TaskListUiState(
    val tasks: List<TaskUiModel>,
    val isLoading: Boolean,
    val error: String?
)
```

## Domain layer

Domain layer опційний. Додавай його, коли є reusable business logic або складні rules.

```kotlin
class CompleteTaskUseCase(
    private val repository: TaskRepository
) {
    suspend operator fun invoke(taskId: String) {
        repository.setDone(taskId, true)
    }
}
```

Для маленьких apps ViewModel може напряму викликати repository. Не додавай use case для кожного trivial call автоматично.

## Data layer

Data layer:

- repositories;
- local data sources;
- remote data sources;
- cache strategy;
- DTO/entity mapping;
- offline-first behavior.

```kotlin
interface TaskRepository {
    fun observeTasks(): Flow<List<Task>>
    suspend fun addTask(title: String)
    suspend fun setDone(id: String, isDone: Boolean)
}
```

Implementation:

```kotlin
class OfflineFirstTaskRepository(
    private val dao: TaskDao,
    private val api: TaskApi
) : TaskRepository {
    override fun observeTasks(): Flow<List<Task>> {
        return dao.observeAll().map { entities -> entities.map { it.toDomain() } }
    }
}
```

## Models

- DTO - network shape.
- Entity - database shape.
- Domain model - business shape.
- UI model - display shape.

Не завжди потрібні всі чотири. Додавай mapping, коли є реальна різниця або boundary.

## Вправа

Для expense tracker створи:

1. `TransactionDto`.
2. `TransactionEntity`.
3. `Transaction`.
4. `TransactionUiModel`.
5. Mapping functions.
6. Repository interface.

## Типові помилки

- Один model на всі layers у складному app.
- Mapping заради mapping у дуже простому app.
- Data layer повертає Android UI state.
- Domain layer залежить від Retrofit/Room/Context.

## Джерела

- [UI layer](https://developer.android.com/topic/architecture/ui-layer)
- [Data layer](https://developer.android.com/topic/architecture/data-layer)
- [Domain layer](https://developer.android.com/topic/architecture/domain-layer)

## Далі

Переходь до [[Guides/Android/05 - Architecture/03 - Dependency injection Hilt Koin manual DI|Dependency injection]].

