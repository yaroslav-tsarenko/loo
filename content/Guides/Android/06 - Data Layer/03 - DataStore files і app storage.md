# DataStore files і app storage

## Ціль уроку

Зрозуміти, де зберігати preferences, typed settings, files і коли обирати DataStore або Room.

## DataStore

DataStore - Jetpack storage solution для key-value pairs або typed objects з Protocol Buffers. Він використовує coroutines і Flow.

Використовуй DataStore для:

- user preferences;
- theme setting;
- onboarding completed;
- small typed settings.

Не використовуй DataStore для:

- великих relational datasets;
- partial updates;
- складних queries;
- referential integrity.

Для цього краще Room.

## Preferences DataStore

```kotlin
val Context.dataStore by preferencesDataStore(name = "settings")

class SettingsRepository(
    private val dataStore: DataStore<Preferences>
) {
    private val darkThemeKey = booleanPreferencesKey("dark_theme")

    val darkTheme: Flow<Boolean> = dataStore.data
        .map { preferences -> preferences[darkThemeKey] ?: false }

    suspend fun setDarkTheme(enabled: Boolean) {
        dataStore.edit { preferences ->
            preferences[darkThemeKey] = enabled
        }
    }
}
```

## Proto DataStore

Proto DataStore дає typed schema, але потребує protobuf setup. Обирай його, якщо settings мають чітку typed structure.

## App-specific files

Для приватних файлів app використовуй app-specific storage. Не проси storage permissions, якщо можна обійтися scoped/app-specific APIs.

## Shared media/documents

Для media/documents, які user очікує бачити в інших apps, використовуй MediaStore або system picker залежно від use case.

## Вправа

1. Додай theme setting у DataStore.
2. Expose `Flow<Boolean>`.
3. ViewModel перетворює це в UI state.
4. Compose theme реагує на setting.
5. Поясни, чому Room тут зайвий.

## Типові помилки

- Використовувати SharedPreferences у новому codebase без причини.
- Зберігати large datasets у DataStore.
- Робити file access без урахування scoped storage.
- Просити permissions для задач, які можна зробити через system picker.

## Джерела

- [DataStore](https://developer.android.com/topic/libraries/architecture/datastore)
- [Data and file storage overview](https://developer.android.com/training/data-storage)
- [App-specific storage](https://developer.android.com/training/data-storage/app-specific)
- [Shared storage](https://developer.android.com/training/data-storage/shared)

## Далі

Переходь до [[Guides/Android/07 - Background Work and System APIs/01 - Coroutines Flow lifecycle-aware collection|Coroutines, Flow і lifecycle-aware collection]].

