# ViewModel StateFlow і side effects

## Ціль уроку

Навчитися тримати screen state у ViewModel, expose StateFlow і правильно виконувати side effects у Compose.

## ViewModel

ViewModel тримає UI-related state і переживає configuration changes.

```kotlin
class TaskListViewModel(
    private val repository: TaskRepository
) : ViewModel() {
    private val _state = MutableStateFlow(TaskListUiState())
    val state = _state.asStateFlow()

    fun onTaskDoneChanged(id: String, isDone: Boolean) {
        viewModelScope.launch {
            repository.setDone(id, isDone)
        }
    }
}
```

## Collect у Compose

```kotlin
@Composable
fun TaskListRoute(
    viewModel: TaskListViewModel = viewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    TaskListScreen(
        state = state,
        onDoneChange = viewModel::onTaskDoneChanged
    )
}
```

Route composable знає про ViewModel. Screen composable бажано лишати stateless.

## Side effects

Compose має спеціальні APIs:

- `LaunchedEffect` - запуск suspend work tied to composition.
- `DisposableEffect` - cleanup.
- `SideEffect` - publish Compose state to non-Compose code.
- `rememberCoroutineScope` - launch coroutine з event handler.
- `derivedStateOf` - derived state optimization.
- `snapshotFlow` - convert Compose state to Flow.

Приклад:

```kotlin
LaunchedEffect(userId) {
    viewModel.load(userId)
}
```

## One-time events

Для snackbar/navigation event можна використовувати:

- callback з ViewModel до navigation layer;
- `SharedFlow` для events;
- state-based event model з explicit consumption.

Головне: не роби one-time event звичайним persistent `StateFlow` без consumption strategy.

## SavedStateHandle

Для navigation arguments і state, який має пережити process recreation:

```kotlin
class DetailsViewModel(
    savedStateHandle: SavedStateHandle
) : ViewModel() {
    private val taskId: String = checkNotNull(savedStateHandle["taskId"])
}
```

## Вправа

1. Створи ViewModel для add task screen.
2. State: title, error, isSaving.
3. Event: title changed, save clicked.
4. Після success відправ navigation event.
5. Screen лиши stateless.

## Типові помилки

- Collect Flow без lifecycle-aware API.
- Тримати repository state прямо в composable.
- Викликати suspend function напряму з composable body.
- Плутати UI state і one-time events.

## Джерела

- [ViewModel overview](https://developer.android.com/topic/libraries/architecture/viewmodel)
- [Lifecycle-aware Flow collection](https://developer.android.com/develop/ui/compose/state#use-other-types-of-state-in-jetpack-compose)
- [Side-effects in Compose](https://developer.android.com/develop/ui/compose/side-effects)
- [Save UI state](https://developer.android.com/topic/libraries/architecture/saving-states)

## Далі

Переходь до [[Guides/Android/04 - State Navigation and Lifecycle/03 - Navigation Compose і adaptive navigation|Navigation Compose і adaptive navigation]].

