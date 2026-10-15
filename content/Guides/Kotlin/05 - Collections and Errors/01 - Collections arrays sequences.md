# Collections arrays sequences

## Ціль уроку

Навчитися працювати з `List`, `Set`, `Map`, mutable/read-only collections, arrays і sequences.

## Read-only і mutable collections

```kotlin
val names: List<String> = listOf("Ann", "Bob")
val mutableNames: MutableList<String> = mutableListOf("Ann")

mutableNames += "Bob"
```

Read-only не означає immutable object у строгому сенсі. Це інтерфейс без write methods.

## List

```kotlin
val numbers = listOf(1, 2, 3, 4)

println(numbers[0])
println(numbers.first())
println(numbers.last())
println(numbers.filter { it % 2 == 0 })
println(numbers.map { it * 10 })
```

## Set

```kotlin
val tags = setOf("kotlin", "jvm", "kotlin")
println(tags.size) // 2
```

## Map

```kotlin
val usersById = mapOf(
    1 to "Ann",
    2 to "Bob"
)

println(usersById[1])
```

Mutable map:

```kotlin
val scores = mutableMapOf<String, Int>()
scores["Ann"] = 90
scores["Bob"] = 75
```

## Common operations

```kotlin
data class User(val name: String, val age: Int)

val users = listOf(
    User("Ann", 20),
    User("Bob", 17),
    User("Cara", 25)
)

val adults = users.filter { it.age >= 18 }
val names = users.map { it.name }
val byAge = users.groupBy { it.age >= 18 }
val oldest = users.maxByOrNull { it.age }
val totalAge = users.sumOf { it.age }
```

## Arrays

Arrays мають фіксований розмір.

```kotlin
val numbers = arrayOf(1, 2, 3)
numbers[0] = 10
```

Для primitive arrays:

```kotlin
val ints = intArrayOf(1, 2, 3)
```

## Sequences

Collections operations зазвичай створюють проміжні collections. `Sequence` виконує lazy pipeline.

```kotlin
val result = (1..1_000_000)
    .asSequence()
    .filter { it % 2 == 0 }
    .map { it * 2 }
    .take(10)
    .toList()
```

Використовуй `Sequence`, коли:

- pipeline довгий;
- даних багато;
- потрібна lazy обробка;
- є short-circuit operations на кшталт `take`, `first`, `any`.

## Вправа

Є список транзакцій:

```kotlin
data class Transaction(
    val id: String,
    val category: String,
    val amount: Double
)
```

Зроби:

1. Суму всіх витрат.
2. Групування за category.
3. Top-3 найбільші транзакції.
4. Перевірку, чи є транзакція більше 1000.

## Типові помилки

- Використовувати mutable collections без потреби.
- Плутати array і list.
- Додавати `asSequence()` у маленьких списках без вигоди.
- Робити складну business logic одним довгим chain.

## Джерела

- [Collections overview](https://kotlinlang.org/docs/collections-overview.html)
- [Collection operations](https://kotlinlang.org/docs/collection-operations.html)
- [Constructing collections](https://kotlinlang.org/docs/constructing-collections.html)
- [Sequences](https://kotlinlang.org/docs/sequences.html)
- [Arrays](https://kotlinlang.org/docs/arrays.html)

## Далі

Переходь до [[Guides/Kotlin/05 - Collections and Errors/02 - Exceptions Result і error handling|exceptions, Result і error handling]].

