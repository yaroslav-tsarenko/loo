# State hoisting events і UDF

## Ціль уроку

Зрозуміти, як у Compose state flows down, events flow up, і як робити composables stateless.

## State hoisting

State hoisting - перенесення state з child composable до caller.

Stateful:

```kotlin
@Composable
fun SearchBox() {
    var query by remember { mutableStateOf("") }

    OutlinedTextField(
        value = query,
        onValueChange = { query = it }
    )
}
```

Stateless:

```kotlin
@Composable
fun SearchBox(
    query: String,
    onQueryChange: (String) -> Unit
) {
    OutlinedTextField(
        value = query,
        onValueChange = onQueryChange
    )
}
```

## UDF

Unidirectional Data Flow:

1. State іде вниз у UI.
2. User events ідуть вгору.
3. State holder обробляє event.
4. New state знову іде вниз.

```text
ViewModel -> UiState -> Composable
Composable -> UiEvent -> ViewModel
```

## UI state object

```kotlin
data class TaskListUiState(
    val tasks: List<TaskUiModel> = emptyList(),
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)
```

UI state має бути:

- immutable;
- повним для rendering;
- без Android framework dependencies, якщо можливо;
- зручним для previews і tests.

## Events

```kotlin
sealed interface TaskListEvent {
    data object AddClicked : TaskListEvent
    data class TaskCheckedChanged(val id: String, val isDone: Boolean) : TaskListEvent
}
```

## Вправа

Перероби task screen:

1. Створи `TaskListUiState`.
2. Створи callbacks: `onAddClick`, `onTaskClick`, `onDoneChange`.
3. Зроби screen stateless.
4. Додай Preview з fake state.

## Типові помилки

- Зберігати mutable list у UI state.
- Передавати ViewModel у кожен маленький composable.
- Робити child composable stateful без потреби.
- Змішувати navigation events і state без чіткого правила.

## Джерела

- [Compose UI architecture](https://developer.android.com/develop/ui/compose/architecture)
- [State and Jetpack Compose](https://developer.android.com/develop/ui/compose/state)
- [State hoisting](https://developer.android.com/develop/ui/compose/state-hoisting)

## Далі

Переходь до [[Guides/Android/04 - State Navigation and Lifecycle/02 - ViewModel StateFlow і side effects|ViewModel, StateFlow і side effects]].

