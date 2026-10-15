# Kotlin JVM Gradle Maven і Java interop

## Ціль уроку

Навчитися налаштовувати Kotlin/JVM проєкт, розуміти Gradle Kotlin DSL і базову сумісність з Java.

## Kotlin/JVM

Kotlin/JVM компілюється у JVM bytecode. Це означає, що Kotlin може:

- використовувати Java libraries;
- запускатися на JVM;
- працювати разом з Java-кодом в одному проєкті;
- використовувати JVM tooling: Gradle, Maven, JUnit, Spring, Ktor.

## Gradle Kotlin DSL

Базовий `build.gradle.kts`:

```kotlin
plugins {
    kotlin("jvm") version "2.4.0"
    application
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
}

application {
    mainClass.set("MainKt")
}

tasks.test {
    useJUnitPlatform()
}
```

## Source sets

```text
src/main/kotlin
src/main/java
src/test/kotlin
src/test/java
```

Kotlin і Java можуть співіснувати.

## Java interop

Виклик Java з Kotlin зазвичай прямий:

```kotlin
val list = java.util.ArrayList<String>()
list.add("Kotlin")
```

Kotlin top-level functions для Java компілюються у class з назвою файлу + `Kt`.

`Utils.kt`:

```kotlin
fun normalize(input: String): String = input.trim().lowercase()
```

З Java:

```java
String value = UtilsKt.normalize(" Kotlin ");
```

## Platform types

Java не має Kotlin nullability у типах за замовчуванням, тому Kotlin бачить такі значення як platform types. Це зона ризику.

```kotlin
val name = javaUser.name
println(name.length) // може впасти, якщо Java повернула null
```

Практика:

- додавати Java nullability annotations;
- робити explicit checks;
- не довіряти platform types без перевірки.

## Maven

Maven теж підтримується, але для Kotlin-проєктів частіше використовують Gradle. Якщо команда вже на Maven, Kotlin можна інтегрувати через `kotlin-maven-plugin`.

## Вправа

1. Створи Kotlin/JVM Gradle-проєкт.
2. Додай Java class `LegacyFormatter`.
3. Виклич його з Kotlin.
4. Додай Kotlin top-level function і виклич її з Java.

## Типові помилки

- Ігнорувати platform types.
- Оновлювати Kotlin version без перевірки сумісності Gradle/AGP.
- Змішувати Groovy DSL і Kotlin DSL без потреби.
- Не використовувати Gradle wrapper.

## Джерела

- [Kotlin Gradle plugin](https://kotlinlang.org/docs/gradle-configure-project.html)
- [Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html)
- [Java interop](https://kotlinlang.org/docs/java-interop.html)
- [Kotlin release process](https://kotlinlang.org/docs/releases.html)
- [What's new in Kotlin 2.4.0](https://kotlinlang.org/docs/whatsnew24.html)

## Далі

Переходь до [[Guides/Kotlin/07 - JVM Gradle and Testing/02 - Тестування Kotlin коду|тестування Kotlin коду]].

