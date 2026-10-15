# Тестування Kotlin коду

## Ціль уроку

Навчитися писати unit tests для Kotlin, тестувати exceptions, coroutines і просту domain logic.

## Kotlin test

Gradle:

```kotlin
dependencies {
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}
```

Приклад:

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class CalculatorTest {
    @Test
    fun `adds two numbers`() {
        assertEquals(5, 2 + 3)
    }
}
```

## Тестування exceptions

```kotlin
import kotlin.test.Test
import kotlin.test.assertFailsWith

class UserTest {
    @Test
    fun `rejects blank name`() {
        assertFailsWith<IllegalArgumentException> {
            User(name = "")
        }
    }
}
```

## Тестування collections

```kotlin
@Test
fun `filters adults`() {
    val users = listOf(User("Ann", 20), User("Bob", 17))

    val result = users.filter { it.age >= 18 }

    assertEquals(listOf(User("Ann", 20)), result)
}
```

## Тестування coroutines

Підключи test library:

```kotlin
dependencies {
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.11.0")
}
```

Приклад:

```kotlin
import kotlinx.coroutines.test.runTest
import kotlin.test.Test
import kotlin.test.assertEquals

class UserServiceTest {
    @Test
    fun `loads user`() = runTest {
        val service = UserService()

        val user = service.loadUser()

        assertEquals("Alex", user.name)
    }
}
```

## Що тестувати

- Pure functions.
- Validation.
- Domain rules.
- State transitions.
- Error handling.
- Coroutine cancellation/timeout logic.

## Що не тестувати на старті

- Generated code.
- Trivial getters/setters.
- Third-party libraries.
- Implementation details, які не впливають на behavior.

## Вправа

Для `RegisterResult` з попереднього модуля напиши тести:

1. Valid email/password -> success.
2. Invalid email -> email error.
3. Short password -> password error.
4. Message mapping через `when`.

## Типові помилки

- Тестувати порядок implementation steps замість результату.
- Не інжектити dispatcher у coroutine-код.
- Використовувати real time delay у тестах.
- Писати один великий тест на багато сценаріїв.

## Джерела

- [Kotlin test library](https://kotlinlang.org/api/core/kotlin-test/)
- [Testing coroutines on Android](https://developer.android.com/kotlin/coroutines/test)
- [kotlinx-coroutines-test](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/)

## Далі

Переходь до [[Guides/Kotlin/08 - Android Backend and Multiplatform/01 - Kotlin для Android і Compose|Kotlin для Android і Compose]].

