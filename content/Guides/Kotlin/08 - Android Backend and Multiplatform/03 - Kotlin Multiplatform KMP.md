# Kotlin Multiplatform KMP

## Ціль уроку

Зрозуміти, що таке Kotlin Multiplatform, яку логіку можна ділити між платформами й коли KMP доречний.

## Що таке KMP

Kotlin Multiplatform - технологія JetBrains для sharing code між Android, iOS, desktop, web і server з можливістю залишати platform-specific частини нативними.

KMP не означає, що все має бути спільним. Часто достатньо ділити:

- domain models;
- validation;
- networking;
- repositories;
- business rules;
- formatting;
- use cases;
- tests.

UI можна:

- залишити native на кожній платформі;
- або ділити через Compose Multiplatform, якщо це підходить продукту.

## Source sets

Типова ідея:

```text
shared/
  src/
    commonMain/
    commonTest/
    androidMain/
    iosMain/
```

`commonMain` містить спільний Kotlin-код.

Platform-specific code:

```kotlin
// commonMain
expect class Platform() {
    val name: String
}
```

```kotlin
// androidMain
actual class Platform {
    actual val name: String = "Android"
}
```

```kotlin
// iosMain
actual class Platform {
    actual val name: String = "iOS"
}
```

## Коли KMP доречний

KMP варто розглядати, якщо:

- Android та iOS мають спільну бізнес-логіку;
- команда хоче зменшити дублювання;
- продукт має довгий lifecycle;
- є Kotlin expertise;
- platform-specific UI все одно важливий.

KMP може бути зайвим, якщо:

- проєкт маленький;
- команда не знає Kotlin;
- потрібно швидко зробити MVP без складної shared logic;
- бізнес-логіка сильно різна на платформах.

## Gradle і сумісність

KMP сильно залежить від версій Kotlin, Gradle, Android Gradle Plugin, Xcode і KMP tooling. Перед оновленням перевіряй release notes і compatibility guides.

Для Kotlin 2.4.0 офіційні release notes вказують на сумісність з Gradle 7.6.3-9.5.0 і мінімальний Android Gradle Plugin 8.5.2.

## Вправа

Спроєктуй shared module для expense tracker:

1. `Transaction`
2. `Category`
3. `MoneyFormatter`
4. `TransactionValidator`
5. `ExpenseSummaryUseCase`
6. Platform-specific `Clock`

Познач, що піде в `commonMain`, а що в `androidMain`/`iosMain`.

## Типові помилки

- Починати з KMP до розуміння Kotlin core.
- Намагатися шарити 100% коду без продуктової потреби.
- Ігнорувати version compatibility.
- Робити platform-specific hacks у common code.
- Не тестувати common logic.

## Джерела

- [Kotlin Multiplatform overview](https://kotlinlang.org/docs/multiplatform/kmp-overview.html)
- [KMP project structure](https://kotlinlang.org/docs/multiplatform/multiplatform-discover-project.html)
- [Kotlin releases](https://kotlinlang.org/docs/releases.html)
- [What's new in Kotlin 2.4.0](https://kotlinlang.org/docs/whatsnew24.html)

## Далі

Переходь до [[Guides/Kotlin/09 - Practice Projects/01 - Roadmap практики і проєкти|roadmap практики і проєктів]].

