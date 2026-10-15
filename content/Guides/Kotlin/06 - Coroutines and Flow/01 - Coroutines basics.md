# Coroutines basics

## Ціль уроку

Зрозуміти `suspend`, `launch`, `async`, `delay`, `runBlocking` і чому корутини не те саме, що threads.

## Що таке coroutine

Coroutine - suspendable computation. Вона може призупинити виконання без блокування thread, а потім продовжити з того самого місця.

У Kotlin ключове слово `suspend` є частиною мови, але більшість coroutine API знаходиться в бібліотеці `kotlinx.coroutines`.

Gradle dependency для JVM:

```kotlin
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.11.0")
}
```

## `suspend`

```kotlin
suspend fun fetchUserName(): String {
    delay(500)
    return "Alex"
}
```

`suspend` function можна викликати тільки з іншої suspend function або з coroutine builder.

## `runBlocking`

Для навчання або CLI entry point:

```kotlin
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
    val name = fetchUserName()
    println(name)
}
```

У production Android/backend коді `runBlocking` використовуй обережно: він блокує current thread.

## `launch`

`launch` запускає coroutine і повертає `Job`.

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    val job = launch {
        delay(1000)
        println("Done")
    }

    println("Waiting")
    job.join()
}
```

## `async`

`async` запускає coroutine і повертає `Deferred<T>`.

```kotlin
fun main() = runBlocking {
    val a = async { loadA() }
    val b = async { loadB() }

    println(a.await() + b.await())
}

suspend fun loadA(): Int {
    delay(500)
    return 10
}

suspend fun loadB(): Int {
    delay(500)
    return 20
}
```

## `delay` vs `Thread.sleep`

`delay` suspends coroutine. `Thread.sleep` блокує thread.

```kotlin
delay(1000)        // добре в coroutine
Thread.sleep(1000) // блокує thread
```

## Вправа

Напиши CLI-програму:

1. `suspend fun loadUser(): String`
2. `suspend fun loadOrders(): List<String>`
3. Запусти їх паралельно через `async`.
4. Виведи результат після `await`.

## Типові помилки

- Викликати suspend function зі звичайної функції без coroutine.
- Використовувати `Thread.sleep` у coroutine.
- Використовувати `async`, але одразу робити `await`, втрачаючи паралельність.
- Сприймати coroutines як автоматичну багатопоточність.

## Джерела

- [Coroutines overview](https://kotlinlang.org/docs/coroutines-overview.html)
- [Coroutines basics](https://kotlinlang.org/docs/coroutines-basics.html)
- [Coroutine context and dispatchers](https://kotlinlang.org/docs/coroutine-context-and-dispatchers.html)

## Далі

Переходь до [[Guides/Kotlin/06 - Coroutines and Flow/02 - Structured concurrency cancellation dispatchers|structured concurrency, cancellation і dispatchers]].

