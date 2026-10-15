# Null safety

## Ціль уроку

Зрозуміти, як Kotlin зменшує ризик `NullPointerException`, і навчитися працювати з nullable типами.

## Nullable і non-null типи

За замовчуванням тип не приймає `null`.

```kotlin
val name: String = "Alex"
// name = null // помилка
```

Nullable тип позначається `?`.

```kotlin
val middleName: String? = null
```

## Safe call `?.`

```kotlin
val length = middleName?.length
```

Тип `length` буде `Int?`, бо результат може бути `null`.

## Elvis operator `?:`

```kotlin
val displayName = middleName ?: "No middle name"
```

Можна кинути помилку:

```kotlin
val email = user.email ?: error("Email is required")
```

## Smart casts

```kotlin
fun printLength(text: String?) {
    if (text != null) {
        println(text.length)
    }
}
```

Після перевірки `text != null` компілятор розуміє, що `text` є `String`.

## Not-null assertion `!!`

```kotlin
val length = middleName!!.length
```

`!!` каже компілятору: "я гарантую, що тут не null". Якщо гарантія хибна, буде `NullPointerException`.

Правило: у production-коді `!!` має бути дуже рідкісним. Краще зробити явну перевірку, `?:`, `requireNotNull`, або змінити модель даних.

## `let` для nullable

```kotlin
middleName?.let { value ->
    println(value.uppercase())
}
```

## Nullable collections

Це різні типи:

```kotlin
val a: List<String> = listOf("A")       // список не null, елементи не null
val b: List<String>? = null             // список може бути null
val c: List<String?> = listOf("A", null) // елементи можуть бути null
val d: List<String?>? = null            // і список, і елементи можуть бути null
```

## Вправа

Створи `User`:

```kotlin
data class User(
    val id: Int,
    val name: String,
    val email: String?
)
```

Напиши функцію `displayContact(user: User): String`, яка:

1. Повертає email, якщо він є.
2. Повертає `"No email for <name>"`, якщо email null.
3. Не використовує `!!`.

## Типові помилки

- Використовувати nullable тип там, де значення має бути обов'язковим.
- Ставити `!!` замість нормального handling.
- Плутати `List<T>?` і `List<T?>`.
- Не враховувати platform types із Java interop.

## Джерела

- [Null safety](https://kotlinlang.org/docs/null-safety.html)
- [Java interop and nullability](https://kotlinlang.org/docs/java-interop.html#null-safety-and-platform-types)

## Далі

Переходь до [[Guides/Kotlin/03 - Object Oriented Kotlin/01 - Класи конструктори і properties|класів, конструкторів і properties]].

