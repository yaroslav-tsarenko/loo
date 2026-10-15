# Наслідування інтерфейси і visibility

## Ціль уроку

Зрозуміти Kotlin-підхід до inheritance, interfaces, overriding і модифікаторів доступу.

## Класи final за замовчуванням

У Kotlin класи й methods не можна наслідувати, якщо вони не позначені `open`.

```kotlin
open class Animal {
    open fun speak() {
        println("...")
    }
}

class Dog : Animal() {
    override fun speak() {
        println("Woof")
    }
}
```

Це зменшує випадкове наслідування.

## Abstract classes

```kotlin
abstract class Shape {
    abstract fun area(): Double

    fun describe() {
        println("Area: ${area()}")
    }
}
```

## Interfaces

```kotlin
interface Repository<T> {
    fun findById(id: String): T?
    fun save(value: T)
}
```

Interface може мати default implementation:

```kotlin
interface Logger {
    fun log(message: String) {
        println(message)
    }
}
```

## Visibility modifiers

- `public` - default, доступно всюди.
- `internal` - доступно в межах module.
- `protected` - доступно в класі та subclasses.
- `private` - доступно в межах declaration/file/class.

Приклад:

```kotlin
internal class UserService(
    private val repository: UserRepository
)
```

## Composition over inheritance

У Kotlin часто краще composition:

```kotlin
class EmailNotifier {
    fun send(message: String) {
        println("Email: $message")
    }
}

class UserService(
    private val notifier: EmailNotifier
) {
    fun register(name: String) {
        notifier.send("Welcome, $name")
    }
}
```

## Вправа

Створи:

1. `interface PaymentProcessor`.
2. Implementations: `CardPaymentProcessor`, `PaypalPaymentProcessor`.
3. `PaymentService`, який приймає `PaymentProcessor` у constructor.
4. Method `pay(amount: Double)`.

## Типові помилки

- Відкривати класи через `open` без реальної потреби.
- Наслідуватися заради code reuse, коли composition простіша.
- Робити все `public`.
- Плутати `internal` з package-private з Java: у Kotlin це module visibility.

## Джерела

- [Inheritance](https://kotlinlang.org/docs/inheritance.html)
- [Interfaces](https://kotlinlang.org/docs/interfaces.html)
- [Visibility modifiers](https://kotlinlang.org/docs/visibility-modifiers.html)

## Далі

Переходь до [[Guides/Kotlin/04 - Functional Kotlin/01 - Lambdas higher order functions і type aliases|lambdas і higher-order functions]].

