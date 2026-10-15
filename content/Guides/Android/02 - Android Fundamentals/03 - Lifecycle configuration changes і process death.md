# Lifecycle configuration changes і process death

## Ціль уроку

Зрозуміти, чому Android може пересоздати UI, як переживати rotation/configuration changes і що таке process death.

## Activity lifecycle

Ключові callbacks:

- `onCreate`
- `onStart`
- `onResume`
- `onPause`
- `onStop`
- `onDestroy`

Не треба будувати app навколо manual lifecycle callbacks, але треба розуміти, коли UI видимий, коли active і коли може бути destroyed.

## Configuration changes

Rotation, language change, dark mode, font scale, screen size і foldable posture можуть призвести до recreation.

Проблема:

```kotlin
var counter = 0
```

Якщо counter живе тільки в Activity local state, він може зникнути після recreation.

## Compose state survival

`remember` переживає recomposition, але не configuration change.

```kotlin
var count by remember { mutableStateOf(0) }
```

`rememberSaveable` може пережити configuration change через saved instance state для простих значень.

```kotlin
var count by rememberSaveable { mutableStateOf(0) }
```

Для screen state і business logic використовуй ViewModel.

## Process death

Android може вбити process у background. Коли user повернеться, app може бути recreated. ViewModel не переживає process death.

Що зберігати:

- UI transient state: `rememberSaveable` або `SavedStateHandle`.
- Business data: database/network cache.
- User preferences: DataStore.

## Lifecycle-aware collection

Flow у UI треба collect lifecycle-aware способом:

```kotlin
val state by viewModel.state.collectAsStateWithLifecycle()
```

Це допомагає не робити зайву роботу, коли UI не active.

## Вправа

1. Зроби counter на `remember`.
2. Поверни екран і подивись, чи зберігся state.
3. Замінити на `rememberSaveable`.
4. Перенеси counter у ViewModel.
5. Поясни різницю між трьома варіантами.

## Типові помилки

- Думати, що ViewModel переживає process death.
- Тримати network result тільки в composable local state.
- Collect Flow без lifecycle-aware API.
- Ігнорувати font scale і screen size changes.

## Джерела

- [Activity lifecycle](https://developer.android.com/guide/components/activities/activity-lifecycle)
- [Save UI state](https://developer.android.com/topic/libraries/architecture/saving-states)
- [Lifecycle in Compose](https://developer.android.com/topic/libraries/architecture/compose)
- [State and Jetpack Compose](https://developer.android.com/develop/ui/compose/state)

## Далі

Переходь до [[Guides/Android/03 - Compose UI/01 - Thinking in Compose і composable functions|Thinking in Compose і composable functions]].

