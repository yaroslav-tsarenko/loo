# Lambdas higher order functions і type aliases

## Ціль уроку

Навчитися передавати поведінку як значення: lambdas, function types, higher-order functions і type aliases.

## Lambda

```kotlin
val double = { x: Int -> x * 2 }
println(double(5))
```

Якщо параметр один, можна використовувати `it`:

```kotlin
val names = listOf("Ann", "Bob")
val upper = names.map { it.uppercase() }
```

## Function type

```kotlin
val operation: (Int, Int) -> Int = { a, b -> a + b }
```

## Higher-order function

Функція, яка приймає або повертає функцію.

```kotlin
fun calculate(a: Int, b: Int, operation: (Int, Int) -> Int): Int {
    return operation(a, b)
}

val result = calculate(10, 5) { a, b -> a - b }
```

## Trailing lambda

Якщо останній параметр функції - lambda, її можна винести за дужки.

```kotlin
val adults = users.filter { it.age >= 18 }
```

## Returning functions

```kotlin
fun multiplier(factor: Int): (Int) -> Int {
    return { value -> value * factor }
}

val triple = multiplier(3)
println(triple(10))
```

## Type aliases

```kotlin
typealias Validator<T> = (T) -> Boolean

fun validateEmail(email: String, validator: Validator<String>): Boolean {
    return validator(email)
}
```

Typealias не створює новий тип, а дає читабельну назву.

## Вправа

Створи validation pipeline:

1. `typealias StringValidator = (String) -> Boolean`
2. Validators: `notBlank`, `hasAt`, `shortEnough`
3. Function `validate(value: String, validators: List<StringValidator>): Boolean`
4. Перевір email.

## Типові помилки

- Писати складну lambda на 20 рядків замість named function.
- Зловживати `it`, коли явна назва параметра читабельніша.
- Використовувати typealias як повноцінну domain-модель.
- Ігнорувати nullable function types: `(() -> Unit)?`.

## Джерела

- [Lambdas](https://kotlinlang.org/docs/lambdas.html)
- [Type aliases](https://kotlinlang.org/docs/type-aliases.html)
- [Inline functions](https://kotlinlang.org/docs/inline-functions.html)

## Далі

Переходь до [[Guides/Kotlin/04 - Functional Kotlin/02 - Extension functions і DSL стиль|extension functions і DSL стилю]].

