# Exceptions Result і error handling

## Ціль уроку

Навчитися обробляти помилки через exceptions, validation functions, `Result` і sealed models.

## Exceptions

```kotlin
fun parseAge(raw: String): Int {
    return raw.toInt()
}
```

Якщо рядок не число, буде exception.

```kotlin
fun parseAgeOrNull(raw: String): Int? {
    return raw.toIntOrNull()
}
```

## `try` як expression

```kotlin
val age = try {
    raw.toInt()
} catch (e: NumberFormatException) {
    0
}
```

## Validation helpers

```kotlin
fun createUser(name: String, age: Int): User {
    require(name.isNotBlank()) { "name must not be blank" }
    require(age >= 0) { "age must not be negative" }
    return User(name, age)
}
```

- `require` перевіряє аргументи.
- `check` перевіряє state.
- `error` кидає `IllegalStateException`.

## `Result`

`Result<T>` зручний, коли failure - частина API.

```kotlin
fun parseAmount(raw: String): Result<Double> {
    return runCatching {
        raw.toDouble()
    }
}

val message = parseAmount("19.99")
    .map { it * 100 }
    .fold(
        onSuccess = { cents -> "Cents: $cents" },
        onFailure = { error -> "Invalid amount: ${error.message}" }
    )
```

## Sealed result

Для domain-помилок часто краще sealed type.

```kotlin
sealed interface LoginResult {
    data class Success(val userId: String) : LoginResult
    data object InvalidPassword : LoginResult
    data object UserNotFound : LoginResult
}
```

Перевага: помилки мають явні назви, а не приховані exception types.

## Практичне правило

- Validation input -> `require`, nullable, sealed result.
- Неочікувана технічна помилка -> exception.
- API, де failure очікуваний -> `Result` або sealed type.
- UI state -> sealed interface/class.

## Вправа

Створи `register(email: String, password: String): RegisterResult`.

Умови:

1. Email має містити `@`.
2. Password має бути 8+ символів.
3. Result має бути sealed interface.
4. Напиши `when`, який перетворює result у текст.

## Типові помилки

- Ловити `Exception` надто широко.
- Ховати domain-помилки в generic exception.
- Використовувати `Result` для всього.
- Кидати exception там, де nullable або sealed result зробить API яснішим.

## Джерела

- [Exceptions](https://kotlinlang.org/docs/exceptions.html)
- [Result](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-result/)
- [Sealed classes](https://kotlinlang.org/docs/sealed-classes.html)

## Далі

Переходь до [[Guides/Kotlin/06 - Coroutines and Flow/01 - Coroutines basics|coroutines basics]].

