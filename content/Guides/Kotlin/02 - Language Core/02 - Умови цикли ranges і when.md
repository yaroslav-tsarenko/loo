# Умови цикли ranges і when

## Ціль уроку

Навчитися керувати потоком виконання: `if`, `when`, `for`, `while`, ranges і operator `in`.

## `if` як expression

В Kotlin `if` може повертати значення.

```kotlin
val age = 20
val status = if (age >= 18) "adult" else "minor"
```

Блоки теж повертають останній вираз:

```kotlin
val discount = if (age >= 65) {
    println("Senior discount")
    0.2
} else {
    0.0
}
```

## `when`

`when` - потужніша заміна `switch`.

```kotlin
val role = "admin"

val permissions = when (role) {
    "admin" -> "all"
    "editor" -> "write"
    "viewer" -> "read"
    else -> "none"
}
```

`when` без аргумента:

```kotlin
val score = 82

val grade = when {
    score >= 90 -> "A"
    score >= 80 -> "B"
    score >= 70 -> "C"
    else -> "D"
}
```

## Ranges

```kotlin
for (i in 1..5) {
    println(i)
}

for (i in 5 downTo 1) {
    println(i)
}

for (i in 0 until 10 step 2) {
    println(i)
}
```

Перевірка входження:

```kotlin
val age = 17
val canStudy = age in 6..18
```

## Цикли

`for`:

```kotlin
val names = listOf("Ann", "Bob", "Cara")

for (name in names) {
    println(name)
}
```

`while`:

```kotlin
var attempts = 3

while (attempts > 0) {
    println("Attempts left: $attempts")
    attempts--
}
```

`do while`:

```kotlin
var input: String

do {
    input = readln()
} while (input.isBlank())
```

## `break` і `continue`

```kotlin
for (number in 1..10) {
    if (number == 3) continue
    if (number == 8) break
    println(number)
}
```

## Вправа

Напиши програму оцінювання:

1. Приймає `score` від 0 до 100.
2. Через `when` визначає grade.
3. Через range перевіряє валідність score.
4. Для невалідного score друкує помилку.

## Типові помилки

- Забути `else`, коли `when` використовується як expression.
- Використовувати `..` там, де треба `until`.
- Писати довгі вкладені `if`, коли `when` читається краще.

## Джерела

- [Control flow](https://kotlinlang.org/docs/control-flow.html)
- [Ranges and progressions](https://kotlinlang.org/docs/ranges.html)

## Далі

Переходь до [[Guides/Kotlin/02 - Language Core/03 - Функції параметри і області видимості|функцій, параметрів і областей видимості]].

