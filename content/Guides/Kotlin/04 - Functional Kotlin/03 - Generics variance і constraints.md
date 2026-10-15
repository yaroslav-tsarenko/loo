# Generics variance і constraints

## Ціль уроку

Зрозуміти generic-класи й функції, `out`, `in`, constraints і star-projections.

## Generic function

```kotlin
fun <T> firstOrNull(items: List<T>): T? {
    return items.firstOrNull()
}
```

## Generic class

```kotlin
class Box<T>(val value: T)

val stringBox = Box("Kotlin")
val intBox = Box(42)
```

## Constraints

```kotlin
fun <T : Comparable<T>> maxOfTwo(a: T, b: T): T {
    return if (a >= b) a else b
}
```

Кілька constraints:

```kotlin
fun <T> saveAndLog(value: T)
    where T : CharSequence,
          T : Comparable<T> {
    println(value)
}
```

## Variance: `out`

`out` означає producer. Тип можна безпечно читати.

```kotlin
interface Source<out T> {
    fun next(): T
}
```

Якщо `Cat : Animal`, тоді `Source<Cat>` можна використовувати як `Source<Animal>`.

## Variance: `in`

`in` означає consumer. Тип можна безпечно передавати всередину.

```kotlin
interface Sink<in T> {
    fun accept(value: T)
}
```

Якщо `Cat : Animal`, тоді `Sink<Animal>` можна використовувати як `Sink<Cat>`.

## PECS правило

Producer Extends, Consumer Super з Java у Kotlin виглядає так:

- Producer -> `out`
- Consumer -> `in`

## Star projection

```kotlin
fun printAll(values: List<*>) {
    values.forEach { println(it) }
}
```

`List<*>` означає список невідомого типу. Читати можна як `Any?`, додавати конкретні значення не можна.

## Вправа

Створи:

1. `interface Repository<out T> { fun findAll(): List<T> }`
2. `interface Validator<in T> { fun validate(value: T): Boolean }`
3. `class UserRepository : Repository<User>`
4. `class AnyUserValidator : Validator<User>`

Поясни, де producer, а де consumer.

## Типові помилки

- Не розрізняти producer і consumer.
- Додавати `out`/`in` навмання.
- Використовувати generics там, де конкретний тип зробить API простішим.
- Забувати constraints і потім робити unsafe casts.

## Джерела

- [Generics](https://kotlinlang.org/docs/generics.html)

## Далі

Переходь до [[Guides/Kotlin/05 - Collections and Errors/01 - Collections arrays sequences|collections, arrays і sequences]].

