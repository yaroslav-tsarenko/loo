# Coroutines Flow lifecycle-aware collection

## Ціль уроку

Навчитися використовувати coroutines і Flow в Android з правильними scopes, dispatchers і lifecycle-aware collection.

## ViewModel scope

```kotlin
class TaskViewModel(
    private val repository: TaskRepository
) : ViewModel() {
    fun refresh() {
        viewModelScope.launch {
            repository.refresh()
        }
    }
}
```

`viewModelScope` автоматично cancel-иться, коли ViewModel cleared.

## Main-safety

Repository suspend functions мають бути main-safe:

```kotlin
class TaskRepository(
    private val ioDispatcher: CoroutineDispatcher
) {
    suspend fun refresh() = withContext(ioDispatcher) {
        api.fetchTasks()
    }
}
```

## Flow у UI

```kotlin
val state by viewModel.state.collectAsStateWithLifecycle()
```

Для XML/View system використовуй `repeatOnLifecycle`.

## stateIn

Перетворення Flow у StateFlow:

```kotlin
val state: StateFlow<TaskListUiState> =
    repository.observeTasks()
        .map { tasks -> TaskListUiState(tasks = tasks) }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000),
            initialValue = TaskListUiState(isLoading = true)
        )
```

## Cancellation

UI-triggered jobs мають cancel-итися, якщо screen/viewmodel зникає. Для search використовуй `flatMapLatest`, debounce і cancellation-aware APIs.

## Вправа

1. Repository expose `Flow<List<Task>>`.
2. ViewModel робить `stateIn`.
3. UI collect через `collectAsStateWithLifecycle`.
4. Додай refresh button.
5. Перевір, що blocking work не на Main.

## Типові помилки

- `GlobalScope`.
- `runBlocking` у Android UI.
- Flow collection у composable без lifecycle.
- Blocking I/O без `Dispatchers.IO`.
- Не інжектити dispatchers для tests.

## Джерела

- [Kotlin coroutines on Android](https://developer.android.com/kotlin/coroutines)
- [Kotlin flows on Android](https://developer.android.com/kotlin/flow)
- [Lifecycle-aware components in Compose](https://developer.android.com/topic/libraries/architecture/compose)
- [Coroutines basics](https://kotlinlang.org/docs/coroutines-basics.html)

## Далі

Переходь до [[Guides/Android/07 - Background Work and System APIs/02 - WorkManager services broadcasts і notifications|WorkManager, services, broadcasts і notifications]].

