# Що таке Kotlin і де його використовують

## Ціль уроку

Зрозуміти, навіщо існує Kotlin, у яких екосистемах він корисний і як не загубитися між JVM, Android, backend, JS, Native та Multiplatform.

## Коротко

Kotlin - сучасна статично типізована мова від JetBrains. Вона проєктувалась як практична мова для JVM з хорошою сумісністю з Java, але зараз також підтримує Android, backend, JavaScript, WebAssembly, Native та Kotlin Multiplatform.

Головні ідеї Kotlin:

- менше шаблонного коду, ніж у Java;
- null-safety на рівні типів;
- сильна типізація з type inference;
- функціональні можливості без відмови від ООП;
- корутини для асинхронного коду;
- сумісність з Java та JVM-екосистемою;
- можливість ділити бізнес-логіку між платформами через KMP.

## Де Kotlin використовують

### Android

Kotlin є основною мовою сучасної Android-розробки. Android Studio має first-class підтримку Kotlin, Jetpack Compose написаний під Kotlin-стиль, а корутини та Flow стали типовим способом писати асинхронний Android-код.

### Backend

Kotlin добре працює на JVM, тому його використовують із Spring Boot, Ktor, Micronaut, Quarkus, Exposed, jOOQ, Gradle, Kafka, PostgreSQL та іншими звичними backend-інструментами.

### CLI і tooling

Kotlin підходить для консольних утиліт, Gradle-плагінів, скриптів, генераторів і внутрішніх devtools.

### Multiplatform

Kotlin Multiplatform дає змогу винести спільну бізнес-логіку в `commonMain`, а platform-specific код залишити в Android/iOS/JVM/JS/Native source sets.

## Що вчити першим

Порядок для новачка:

1. Синтаксис, типи, функції.
2. Null-safety.
3. Класи, data/sealed/enum/object.
4. Collections.
5. Lambdas і extension functions.
6. Exceptions і `Result`.
7. Coroutines.
8. Gradle і тестування.
9. Обраний напрям: Android, backend або KMP.

## Що не варто вчити першим

- Kotlin Multiplatform до базової мови.
- Coroutines без функцій і lambdas.
- Compose без розуміння state і Kotlin-класів.
- Reflection і compiler plugins на старті.

## Перевір себе

- Чим Kotlin відрізняється від Java на практиці?
- Чому null-safety важлива?
- Що таке JVM і чому Kotlin може використовувати Java-бібліотеки?
- Для чого потрібен Kotlin Multiplatform?

## Джерела

- [Kotlin docs](https://kotlinlang.org/docs/home.html)
- [Get started with Kotlin](https://kotlinlang.org/docs/getting-started.html)
- [Kotlin and Android](https://developer.android.com/kotlin/)
- [Kotlin Multiplatform overview](https://kotlinlang.org/docs/multiplatform/kmp-overview.html)

## Далі

Переходь до [[Guides/Kotlin/01 - Start/02 - Налаштування середовища|налаштування середовища]].

