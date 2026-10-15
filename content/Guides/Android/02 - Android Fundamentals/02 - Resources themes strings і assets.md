# Resources themes strings і assets

## Ціль уроку

Навчитися працювати з Android resources: strings, drawables, themes, density, localization і assets.

## Навіщо resources

Resources дозволяють відокремити дані, які залежать від мови, theme, screen size, density або platform configuration.

Навіть у Compose не варто hardcode-ити user-facing text прямо в UI.

## Strings

`res/values/strings.xml`:

```xml
<resources>
    <string name="app_name">Tasks</string>
    <string name="add_task">Add task</string>
</resources>
```

У Compose:

```kotlin
Text(stringResource(R.string.add_task))
```

## Localization

```text
res/values/strings.xml
res/values-uk/strings.xml
res/values-fr/strings.xml
```

Правило: усі user-facing тексти мають бути в resources, якщо app готується до localization.

## Drawables і density

Android має різні density buckets:

- mdpi
- hdpi
- xhdpi
- xxhdpi
- xxxhdpi

Vector drawables часто кращі для icons, bitmap - для фото/складних зображень.

## Themes

У Compose Material 3 theme зазвичай задається Kotlin-кодом, але Android theme у Manifest усе одно потрібна для window, splash, status bar, startup behavior.

```xml
<application android:theme="@style/Theme.MyApp">
```

Compose:

```kotlin
@Composable
fun MyAppTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = lightColorScheme(),
        typography = Typography(),
        content = content
    )
}
```

## Assets vs raw resources

- `assets/` - файли з довільною структурою, доступ через AssetManager.
- `res/raw/` - raw resources з generated IDs.

## Вправа

1. Винеси назву кнопки в `strings.xml`.
2. Додай український переклад у `values-uk`.
3. Додай vector icon.
4. Використай icon у Compose button.

## Типові помилки

- Hardcode text у composables.
- Використовувати bitmap icon там, де потрібен vector.
- Ігнорувати dark theme.
- Не перевіряти UI з довшими перекладами.

## Джерела

- [App resources overview](https://developer.android.com/guide/topics/resources/providing-resources)
- [String resources](https://developer.android.com/guide/topics/resources/string-resource)
- [App assets and files](https://developer.android.com/training/data-storage/app-specific)
- [Material 3 in Compose](https://developer.android.com/develop/ui/compose/designsystems/material3)

## Далі

Переходь до [[Guides/Android/02 - Android Fundamentals/03 - Lifecycle configuration changes і process death|lifecycle, configuration changes і process death]].

