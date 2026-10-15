# Extension functions і DSL стиль

## Ціль уроку

Навчитися додавати функції до існуючих типів без inheritance і зрозуміти, як Kotlin DSL стає читабельним.

## Extension function

```kotlin
fun String.isValidEmail(): Boolean {
    return "@" in this && "." in substringAfter("@")
}

println("a@b.com".isValidEmail())
```

Extension не змінює клас реально. Це статична функція з receiver-синтаксисом.

## Extension property

```kotlin
val String.initials: String
    get() = split(" ")
        .filter { it.isNotBlank() }
        .joinToString("") { it.first().uppercase() }
```

Extension property не може мати backing field.

## Nullable receiver

```kotlin
fun String?.orUnknown(): String {
    return this ?: "Unknown"
}
```

## Scope functions

Kotlin має `let`, `run`, `with`, `apply`, `also`.

Практичне правило:

- `let` - перетворити значення або виконати код для nullable.
- `also` - side effect, logging, debugging.
- `apply` - налаштувати object і повернути його.
- `run` - обчислити результат у context.
- `with` - працювати з object без extension-call style.

```kotlin
val user = User(name = "Alex").apply {
    email = "alex@example.com"
}

val length = user.email?.let { email ->
    email.length
}
```

## DSL стиль

Kotlin DSL часто використовує lambdas with receiver.

```kotlin
class HtmlBuilder {
    private val lines = mutableListOf<String>()

    fun h1(text: String) {
        lines += "<h1>$text</h1>"
    }

    fun p(text: String) {
        lines += "<p>$text</p>"
    }

    fun build(): String = lines.joinToString("\n")
}

fun html(block: HtmlBuilder.() -> Unit): String {
    return HtmlBuilder().apply(block).build()
}

val page = html {
    h1("Kotlin")
    p("DSL example")
}
```

## Вправа

Створи DSL для menu:

```kotlin
val menu = menu {
    item("Home", "/")
    item("Guides", "/guides")
}
```

Результат має бути список `MenuItem`.

## Типові помилки

- Створювати extension, яка приховує складну бізнес-логіку.
- Давати extension надто загальну назву.
- Використовувати scope functions ланцюжком так, що код важко читати.
- Забувати, що extension dispatch є static.

## Джерела

- [Extensions](https://kotlinlang.org/docs/extensions.html)
- [Scope functions](https://kotlinlang.org/docs/scope-functions.html)
- [Type-safe builders](https://kotlinlang.org/docs/type-safe-builders.html)

## Далі

Переходь до [[Guides/Kotlin/04 - Functional Kotlin/03 - Generics variance і constraints|generics, variance і constraints]].

