# Unit UI instrumentation і Compose tests

## Ціль уроку

Навчитися тестувати Android app на кількох рівнях: unit, ViewModel, repository, Room DAO, Compose UI, instrumentation.

## Test pyramid

Більше:

- unit tests;
- pure Kotlin tests;
- ViewModel tests;
- repository tests з fake data sources.

Менше, але обов'язково:

- Compose UI tests;
- instrumentation tests;
- end-to-end smoke flows.

## Unit tests

`src/test` запускається на JVM.

```kotlin
class ValidateTaskTitleTest {
    @Test
    fun blankTitleIsInvalid() {
        val result = validateTaskTitle("")
        assertFalse(result.isValid)
    }
}
```

## ViewModel tests

Тестуй:

- initial state;
- state transitions;
- error states;
- events;
- coroutine behavior.

Використовуй fake repositories і test dispatchers.

## Room tests

DAO tests часто instrumentation або Robolectric/in-memory database.

## Compose UI tests

```kotlin
@get:Rule
val composeTestRule = createComposeRule()

@Test
fun addButtonIsVisible() {
    composeTestRule.setContent {
        TaskListScreen(...)
    }

    composeTestRule
        .onNodeWithText("Add")
        .assertIsDisplayed()
}
```

## Instrumentation tests

`src/androidTest` запускається на device/emulator. Використовуй для:

- UI flows;
- platform integration;
- Room/device behavior;
- permissions;
- navigation smoke tests.

## Вправа

Для task app напиши:

1. Unit test для validation.
2. ViewModel test для add task.
3. Compose test для empty state.
4. Navigation smoke test.
5. DAO test для insert/query.

## Типові помилки

- Тестувати тільки UI.
- Не тестувати error states.
- Використовувати real network у tests.
- Писати flaky tests з real delays.
- Не ставити content descriptions/test tags там, де UI tests потребують stable selectors.

## Джерела

- [Test apps on Android](https://developer.android.com/training/testing)
- [What to test in Android](https://developer.android.com/training/testing/fundamentals/what-to-test)
- [Testing in Compose](https://developer.android.com/develop/ui/compose/testing)
- [Testing coroutines on Android](https://developer.android.com/kotlin/coroutines/test)

## Далі

Переходь до [[Guides/Android/08 - Testing Debugging and Performance/02 - Debugging logging profiling і app quality|debugging, logging, profiling і app quality]].

