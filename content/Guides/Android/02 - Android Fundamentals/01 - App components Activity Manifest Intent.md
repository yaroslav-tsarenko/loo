# App components Activity Manifest Intent

## Ціль уроку

Зрозуміти головні Android components, роль Activity, Manifest і Intent.

## App components

Android має кілька основних components:

- `Activity` - екран або entry point для UI.
- `Service` - довша робота без UI, але з сучасними background limits.
- `BroadcastReceiver` - реакція на broadcast events.
- `ContentProvider` - structured data sharing між apps.

Сучасні Compose-apps часто мають одну Activity, а screens реалізують як composable destinations.

## Activity

Activity controlled by OS. Вона може бути created, started, resumed, paused, stopped, destroyed.

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            App()
        }
    }
}
```

Activity не має містити business logic. Її роль:

- set up UI;
- host navigation;
- connect system entry point with app composition.

## Manifest declaration

```xml
<activity
    android:name=".MainActivity"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

`MAIN` + `LAUNCHER` робить Activity launcher entry point.

## Intent

Intent описує дію.

Explicit intent:

```kotlin
val intent = Intent(this, DetailsActivity::class.java)
startActivity(intent)
```

Implicit intent:

```kotlin
val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://developer.android.com"))
startActivity(intent)
```

У Compose single-activity app частіше використовують Navigation Compose для internal screens, а intents - для external/system interactions.

## Exported components

`android:exported="true"` означає, що component може бути доступний іншим apps, якщо intent filters дозволяють. Для internal components став `false`.

## Вправа

1. Знайди launcher Activity у Manifest.
2. Додай кнопку "Open website".
3. Відкрий URL через implicit intent.
4. Поясни, чому для внутрішнього переходу краще Navigation Compose.

## Типові помилки

- Писати business logic в Activity.
- Робити components exported без потреби.
- Передавати complex objects через Intent extras.
- Використовувати multiple activities без архітектурної причини.

## Джерела

- [Application fundamentals](https://developer.android.com/guide/components/fundamentals)
- [Activities](https://developer.android.com/guide/components/activities/intro-activities)
- [Intents and intent filters](https://developer.android.com/guide/components/intents-filters)
- [App manifest](https://developer.android.com/guide/topics/manifest/manifest-intro)

## Далі

Переходь до [[Guides/Android/02 - Android Fundamentals/02 - Resources themes strings і assets|resources, themes, strings і assets]].

