# Структура Android проєкту

## Ціль уроку

Навчитися орієнтуватися в Android-проєкті: module, source sets, Manifest, resources, Gradle і package structure.

## Базова структура

```text
MyApp/
  settings.gradle.kts
  build.gradle.kts
  gradle/
  app/
    build.gradle.kts
    src/
      main/
        AndroidManifest.xml
        java/
        kotlin/
        res/
      test/
      androidTest/
```

## App module

`app` - Android application module. У ньому зазвичай лежить:

- production code;
- AndroidManifest;
- resources;
- unit tests;
- instrumentation tests;
- build config для app.

У великих проєктах додають feature modules і library modules.

## Source sets

- `src/main` - production code.
- `src/test` - JVM unit tests.
- `src/androidTest` - tests на device/emulator.
- `src/debug` - debug-only code/resources.
- `src/release` - release-only code/resources.

## Manifest

`AndroidManifest.xml` декларує app-level metadata і components:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:theme="@style/Theme.MyApp">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

Для Android 12+ components з intent-filter мають явно задавати `android:exported`.

## Resources

`res/` містить не-Kotlin ресурси:

```text
res/
  drawable/
  mipmap/
  values/
    strings.xml
    colors.xml
    themes.xml
```

У Compose частина styling іде в Kotlin, але strings, icons, themes, adaptive resources і localization усе одно важливі.

## Package structure

Для навчання:

```text
com.example.myapp/
  MainActivity.kt
  core/
  feature/
  data/
  domain/
  ui/
```

Для невеликого app краще feature-first:

```text
tasks/
  data/
  domain/
  ui/
```

## Вправа

1. Відкрий `AndroidManifest.xml`.
2. Знайди `MainActivity`.
3. Знайди `app/build.gradle.kts`.
4. Створи package `tasks/ui`.
5. Перенеси простий `TaskListScreen` у цей package.

## Типові помилки

- Змішувати весь код у root package.
- Думати, що `res/values/strings.xml` не потрібен у Compose.
- Не розуміти різницю між `test` і `androidTest`.
- Випадково міняти applicationId без розуміння наслідків.

## Джерела

- [App manifest overview](https://developer.android.com/guide/topics/manifest/manifest-intro)
- [App resources overview](https://developer.android.com/guide/topics/resources/providing-resources)
- [Build configuration](https://developer.android.com/build)

## Далі

Переходь до [[Guides/Android/02 - Android Fundamentals/01 - App components Activity Manifest Intent|app components, Activity, Manifest та Intent]].

