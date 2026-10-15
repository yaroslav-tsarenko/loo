# Data enum sealed object і companion

## Ціль уроку

Навчитися вибирати правильний тип конструкції для моделей, станів, singleton-ів і factory logic.

## Data classes

`data class` підходить для immutable data models.

```kotlin
data class User(
    val id: Int,
    val name: String,
    val email: String
)
```

Автоматично генерується:

- `equals`
- `hashCode`
- `toString`
- `copy`
- `componentN` для destructuring

```kotlin
val user = User(1, "Alex", "alex@example.com")
val renamed = user.copy(name = "Sam")

val (id, name) = user
```

## Enum

`enum class` підходить для фіксованого списку значень.

```kotlin
enum class Role {
    ADMIN,
    EDITOR,
    VIEWER
}
```

З properties:

```kotlin
enum class Priority(val weight: Int) {
    LOW(1),
    MEDIUM(2),
    HIGH(3)
}
```

## Sealed classes і sealed interfaces

`sealed` підходить для закритої ієрархії станів або результатів.

```kotlin
sealed interface UiState {
    data object Loading : UiState
    data class Success(val items: List<String>) : UiState
    data class Error(val message: String) : UiState
}

fun render(state: UiState) {
    when (state) {
        UiState.Loading -> println("Loading")
        is UiState.Success -> println(state.items)
        is UiState.Error -> println(state.message)
    }
}
```

Перевага: `when` може бути exhaustive без `else`.

## Object

`object` створює singleton.

```kotlin
object AppConfig {
    const val API_URL = "https://api.example.com"
}
```

## Companion object

`companion object` - член класу, який можна викликати через назву класу.

```kotlin
class Email private constructor(val value: String) {
    companion object {
        fun parse(raw: String): Email {
            require("@" in raw) { "Invalid email" }
            return Email(raw.lowercase())
        }
    }
}

val email = Email.parse("USER@EXAMPLE.COM")
```

## Вправа

Опиши checkout:

1. `data class Product`.
2. `enum class PaymentStatus`.
3. `sealed interface PaymentResult` з `Success`, `Declined`, `NetworkError`.
4. Function `message(result: PaymentResult): String` через exhaustive `when`.

## Типові помилки

- Використовувати `enum`, коли потрібні різні payloads для різних станів.
- Використовувати `data class` для mutable entity з identity-heavy логікою.
- Робити global state через `object` без потреби.
- Додавати `else` у `when` по sealed типу й втрачати compile-time контроль.

## Джерела

- [Data classes](https://kotlinlang.org/docs/data-classes.html)
- [Enum classes](https://kotlinlang.org/docs/enum-classes.html)
- [Sealed classes and interfaces](https://kotlinlang.org/docs/sealed-classes.html)
- [Object declarations](https://kotlinlang.org/docs/object-declarations.html)

## Далі

Переходь до [[Guides/Kotlin/03 - Object Oriented Kotlin/03 - Наслідування інтерфейси і visibility|наслідування, інтерфейсів і visibility]].

