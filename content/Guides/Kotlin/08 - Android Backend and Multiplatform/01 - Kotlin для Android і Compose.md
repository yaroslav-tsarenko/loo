# Kotlin для Android і Compose

## Ціль уроку

Зрозуміти, як Kotlin використовується в Android: ViewModel, coroutines, Flow, Compose state і lifecycle.

## Kotlin на Android

Kotlin є стандартним вибором для сучасної Android-розробки. Типовий стек:

- Android Studio;
- Kotlin;
- Jetpack Compose;
- ViewModel;
- Coroutines;
- Flow/StateFlow;
- Room;
- Retrofit/Ktor Client;
- Hilt/Koin для DI.

## Compose і Kotlin

Composable function:

```kotlin
@Composable
fun Greeting(name: String) {
    Text("Hello, $name")
}
```

State:

```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }

    Button(onClick = { count++ }) {
        Text("Count: $count")
    }
}
```

## ViewModel + StateFlow

```kotlin
data class CounterState(val count: Int = 0)

class CounterViewModel : ViewModel() {
    private val _state = MutableStateFlow(CounterState())
    val state = _state.asStateFlow()

    fun increment() {
        _state.update { it.copy(count = it.count + 1) }
    }
}
```

Compose collection:

```kotlin
@Composable
fun CounterScreen(viewModel: CounterViewModel = viewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    Button(onClick = viewModel::increment) {
        Text("Count: ${state.count}")
    }
}
```

## Coroutines на Android

```kotlin
class UserViewModel(
    private val repository: UserRepository
) : ViewModel() {
    fun load() {
        viewModelScope.launch {
            val user = repository.loadUser()
            // update state
        }
    }
}
```

Repository має бути main-safe:

```kotlin
class UserRepository(
    private val ioDispatcher: CoroutineDispatcher
) {
    suspend fun loadUser(): User = withContext(ioDispatcher) {
        blockingApi.loadUser()
    }
}
```

## Практичний Android-порядок навчання

1. Kotlin core.
2. Compose basics.
3. State hoisting.
4. ViewModel.
5. Navigation.
6. Coroutines + Flow.
7. Room.
8. Networking.
9. Testing.
10. Architecture.

## Вправа

Зроби Compose screen:

1. Text input для task title.
2. Button add.
3. List tasks.
4. ViewModel з `MutableStateFlow`.
5. Усі зміни через immutable `copy`.

## Типові помилки

- Тримати business logic прямо в composable.
- Collect Flow без lifecycle-aware API.
- Блокувати main thread.
- Передавати mutable collections у UI state.
- Плутати one-time events і persistent state.

## Джерела

- [Kotlin and Android](https://developer.android.com/kotlin/)
- [Kotlin coroutines on Android](https://developer.android.com/kotlin/coroutines)
- [Kotlin flows on Android](https://developer.android.com/kotlin/flow)
- [Kotlin for Jetpack Compose](https://developer.android.com/develop/ui/compose/kotlin)

## Далі

Переходь до [[Guides/Kotlin/08 - Android Backend and Multiplatform/02 - Backend з Ktor|backend з Ktor]].

