# Flow StateFlow SharedFlow channels

## Ціль уроку

Зрозуміти stream-підхід у Kotlin: cold Flow, operators, collection, StateFlow, SharedFlow і channels.

## Flow

`Flow<T>` - асинхронний stream значень одного типу. На відміну від suspend function, яка повертає одне значення, Flow може emit кілька значень.

```kotlin
import kotlinx.coroutines.flow.*

fun numbers(): Flow<Int> = flow {
    emit(1)
    emit(2)
    emit(3)
}
```

Collection:

```kotlin
numbers().collect { value ->
    println(value)
}
```

## Cold stream

Звичайний `flow {}` cold: код всередині стартує тільки коли є collector.

```kotlin
val flow = flow {
    println("Started")
    emit(1)
}

flow.collect()
flow.collect()
```

`Started` буде надруковано двічі.

## Operators

```kotlin
val result = numbers()
    .filter { it % 2 == 1 }
    .map { it * 10 }
    .toList()
```

Common operators:

- `map`
- `filter`
- `transform`
- `take`
- `onEach`
- `catch`
- `combine`
- `flatMapLatest`
- `debounce`

## Error handling

```kotlin
repository.userUpdates()
    .catch { error -> emit(User.Unknown) }
    .collect { user -> render(user) }
```

## StateFlow

`StateFlow` тримає поточний state і завжди має value.

```kotlin
class CounterViewModel {
    private val _count = MutableStateFlow(0)
    val count: StateFlow<Int> = _count

    fun increment() {
        _count.value += 1
    }
}
```

Підходить для UI state.

## SharedFlow

`SharedFlow` підходить для events, які можуть мати багато subscribers.

```kotlin
private val _events = MutableSharedFlow<String>()
val events = _events.asSharedFlow()

suspend fun notify(message: String) {
    _events.emit(message)
}
```

## Channels

Channel - нижчорівневий primitive для передачі значень між coroutines.

```kotlin
val channel = Channel<Int>()

launch {
    channel.send(1)
    channel.close()
}

for (value in channel) {
    println(value)
}
```

Для більшості application-level streams починай з Flow/StateFlow/SharedFlow, а channels використовуй, коли потрібна explicit producer-consumer координація.

## Вправа

Створи `search(queryFlow: Flow<String>): Flow<List<Result>>`, який:

1. Ігнорує пусті query.
2. Робить debounce.
3. Для кожного нового query скасовує попередній search.
4. Обробляє помилки через `catch`.

## Типові помилки

- Collect Flow у неправильному lifecycle scope.
- Використовувати SharedFlow для state, коли потрібен StateFlow.
- Забувати, що cold Flow не працює без collector.
- Робити blocking work всередині flow без правильного dispatcher.

## Джерела

- [Asynchronous Flow](https://kotlinlang.org/docs/flow.html)
- [Kotlin flows on Android](https://developer.android.com/kotlin/flow)
- [Channels](https://kotlinlang.org/docs/channels.html)

## Далі

Переходь до [[Guides/Kotlin/07 - JVM Gradle and Testing/01 - Kotlin JVM Gradle Maven і Java interop|Kotlin JVM, Gradle, Maven і Java interop]].

