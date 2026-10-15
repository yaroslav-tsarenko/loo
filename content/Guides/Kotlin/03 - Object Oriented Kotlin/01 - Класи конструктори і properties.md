# Класи конструктори і properties

## Ціль уроку

Навчитися описувати об'єкти предметної області через класи, primary/secondary constructors, properties і methods.

## Базовий клас

```kotlin
class User(
    val id: Int,
    var name: String
)
```

Використання:

```kotlin
val user = User(id = 1, name = "Alex")
println(user.name)
user.name = "Sam"
```

`val` property має getter. `var` має getter і setter.

## Init block

```kotlin
class User(
    val id: Int,
    val name: String
) {
    init {
        require(id > 0) { "id must be positive" }
        require(name.isNotBlank()) { "name must not be blank" }
    }
}
```

## Methods

```kotlin
class BankAccount(
    val owner: String,
    private var balance: Double
) {
    fun deposit(amount: Double) {
        require(amount > 0)
        balance += amount
    }

    fun currentBalance(): Double = balance
}
```

## Custom getter

```kotlin
class Rectangle(
    val width: Int,
    val height: Int
) {
    val area: Int
        get() = width * height
}
```

## Secondary constructor

Використовуй рідко. Зазвичай краще default parameters або factory function.

```kotlin
class Person(val name: String, val age: Int) {
    constructor(name: String) : this(name, age = 0)
}
```

## Вправа

Створи `Task`:

```kotlin
class Task(
    val id: Int,
    val title: String,
    var isDone: Boolean = false
)
```

Додай:

1. `init` validation.
2. Method `complete()`.
3. Computed property `statusLabel`.
4. Приклад створення й оновлення задачі.

## Типові помилки

- Робити всі properties `var`.
- Виносити validation у випадкові місця замість `init` або factory.
- Зловживати secondary constructors.
- Писати Java-style getters/setters вручну без потреби.

## Джерела

- [Classes](https://kotlinlang.org/docs/classes.html)
- [Properties](https://kotlinlang.org/docs/properties.html)
- [Visibility modifiers](https://kotlinlang.org/docs/visibility-modifiers.html)

## Далі

Переходь до [[Guides/Kotlin/03 - Object Oriented Kotlin/02 - Data enum sealed object і companion|data, enum, sealed, object і companion]].

