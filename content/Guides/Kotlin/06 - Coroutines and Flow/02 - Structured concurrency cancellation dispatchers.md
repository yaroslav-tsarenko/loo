# Structured concurrency cancellation dispatchers

## Ціль уроку

Навчитися запускати корутини в правильному scope, керувати cancellation і вибирати dispatcher.

## Structured concurrency

Structured concurrency означає, що coroutine має scope, parent-child relationship і predictable lifetime.

```kotlin
suspend fun loadScreen() = coroutineScope {
    val user = async { loadUser() }
    val orders = async { loadOrders() }

    ScreenData(
        user = user.await(),
        orders = orders.await()
    )
}
```

Якщо одна child coroutine падає, scope коректно обробляє cancellation для пов'язаних coroutines.

## CoroutineScope

`CoroutineScope` задає lifecycle.

На Android:

- `viewModelScope` для ViewModel;
- `lifecycleScope` для LifecycleOwner;
- Compose effects для composable lifecycle.

На backend:

- request scope;
- application scope;
- окремі supervised scopes для background workers.

## Dispatchers

- `Dispatchers.Default` - CPU-bound work.
- `Dispatchers.IO` - blocking I/O: файли, legacy network/database calls.
- `Dispatchers.Main` - UI thread на Android.
- Custom dispatcher - якщо потрібен контроль pool.

```kotlin
withContext(Dispatchers.IO) {
    blockingDatabaseCall()
}
```

## Main-safety

Функція main-safe, якщо її можна викликати з main thread без блокування UI.

```kotlin
class UserRepository(
    private val ioDispatcher: CoroutineDispatcher = Dispatchers.IO
) {
    suspend fun loadUser(): User = withContext(ioDispatcher) {
        blockingLoadUser()
    }
}
```

Для тестів dispatcher краще інжектити.

## Cancellation

Cancellation cooperative. Coroutine має доходити до suspension points або перевіряти active state.

```kotlin
val job = launch {
    while (isActive) {
        doWork()
        delay(100)
    }
}

job.cancelAndJoin()
```

`finally` виконується при cancellation:

```kotlin
try {
    load()
} finally {
    cleanup()
}
```

## Timeout

```kotlin
val result = withTimeoutOrNull(1000) {
    loadUser()
}
```

## SupervisorJob

Supervisor потрібен, коли failure однієї child task не має автоматично падати весь scope.

```kotlin
val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
```

Не використовуй supervisor як default everywhere. Він змінює failure semantics.

## Вправа

Створи `ReportService`:

1. Паралельно завантажує users і payments.
2. Має timeout 2 seconds.
3. Blocking calls виконує на `Dispatchers.IO`.
4. Dispatcher передається через constructor.

## Типові помилки

- Створювати `GlobalScope.launch`.
- Блокувати main thread.
- Не обробляти cancellation.
- Використовувати `Dispatchers.IO` для CPU-bound задач.
- Ховати dispatcher всередині коду, що ускладнює тести.

## Джерела

- [Coroutine context and dispatchers](https://kotlinlang.org/docs/coroutine-context-and-dispatchers.html)
- [Cancellation and timeouts](https://kotlinlang.org/docs/cancellation-and-timeouts.html)
- [Composing suspending functions](https://kotlinlang.org/docs/composing-suspending-functions.html)
- [Kotlin coroutines on Android](https://developer.android.com/kotlin/coroutines)

## Далі

Переходь до [[Guides/Kotlin/06 - Coroutines and Flow/03 - Flow StateFlow SharedFlow channels|Flow, StateFlow, SharedFlow і channels]].

