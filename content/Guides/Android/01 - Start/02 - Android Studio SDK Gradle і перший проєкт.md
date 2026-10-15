# Android Studio SDK Gradle і перший проєкт

## Ціль уроку

Підготувати середовище, створити перший Android-проєкт і зрозуміти, що робить Android Studio.

## Що встановити

- Android Studio.
- Android SDK через SDK Manager.
- Android Emulator або фізичний Android device.
- JDK, який постачається з Android Studio або сумісний із поточним AGP.
- Git.

## Створення проєкту

У Android Studio:

1. New Project.
2. Template: Empty Activity.
3. Language: Kotlin.
4. UI: Jetpack Compose.
5. Minimum SDK: залежить від цілі, для навчання можна API 26+ або рекомендоване IDE значення.
6. Build configuration: Kotlin DSL, якщо доступно.

## Що таке Gradle

Gradle збирає app: компілює Kotlin, обробляє resources, пакує APK/AAB, запускає tests, створює debug/release variants.

Типові файли:

```text
settings.gradle.kts
build.gradle.kts
app/build.gradle.kts
gradle/libs.versions.toml
gradlew
gradlew.bat
```

## Перший запуск

1. Дочекайся Gradle sync.
2. Створи emulator або підключи device.
3. Натисни Run.
4. Перевір Logcat, якщо app не стартує.

## Мінімальний Compose screen

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            MaterialTheme {
                Text("Hello, Android")
            }
        }
    }
}
```

## Debug vs release

Debug build:

- швидкий для розробки;
- має debug signing;
- може містити debug tools/logging.

Release build:

- minify/optimize може бути ввімкнено;
- підписується release key;
- має бути протестований окремо.

## Вправа

1. Створи Empty Activity Compose project.
2. Запусти на emulator.
3. Зміни текст на своє ім'я.
4. Додай `Button`, який змінює counter.
5. Зроби screenshot для себе як контрольну точку.

## Типові помилки

- Не чекати Gradle sync і редагувати напівзламаний проєкт.
- Ставити занадто низький minSdk без потреби.
- Ігнорувати помилки emulator/device.
- Перевіряти тільки debug build.

## Джерела

- [Android Studio](https://developer.android.com/studio)
- [Create your first Android app](https://developer.android.com/codelabs/basic-android-kotlin-compose-first-app)
- [Configure your build](https://developer.android.com/build)
- [Get started with Compose](https://developer.android.com/develop/ui/compose/documentation)

## Далі

Переходь до [[Guides/Android/01 - Start/03 - Структура Android проєкту|структури Android проєкту]].

