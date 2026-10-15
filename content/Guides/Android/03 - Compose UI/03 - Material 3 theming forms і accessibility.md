# Material 3 theming forms і accessibility

## Ціль уроку

Навчитися збирати базовий production-like UI: Material 3 components, theme, form state, validation і accessibility.

## Material 3

Material 3 дає готові composables:

- `Scaffold`
- `TopAppBar`
- `Button`
- `TextField`
- `Card`
- `NavigationBar`
- `SnackbarHost`
- `FloatingActionButton`

```kotlin
Scaffold(
    topBar = {
        TopAppBar(title = { Text("Tasks") })
    },
    floatingActionButton = {
        FloatingActionButton(onClick = onAdd) {
            Icon(Icons.Default.Add, contentDescription = "Add")
        }
    }
) { padding ->
    TaskList(
        modifier = Modifier.padding(padding)
    )
}
```

## Theme

Theme має централізувати:

- colors;
- typography;
- shapes;
- dark/light behavior.

```kotlin
@Composable
fun AppTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = lightColorScheme(),
        typography = Typography(),
        content = content
    )
}
```

## Forms

```kotlin
@Composable
fun TaskForm(
    title: String,
    onTitleChange: (String) -> Unit,
    error: String?,
    onSubmit: () -> Unit
) {
    Column {
        OutlinedTextField(
            value = title,
            onValueChange = onTitleChange,
            label = { Text("Title") },
            isError = error != null,
            supportingText = {
                if (error != null) Text(error)
            }
        )

        Button(onClick = onSubmit) {
            Text("Save")
        }
    }
}
```

## Accessibility

Базові правила:

- interactive element має мати зрозумілий label;
- decorative icons мають `contentDescription = null`;
- text має підтримувати font scaling;
- contrast має бути достатній;
- touch targets мають бути достатнього розміру;
- UI має працювати з screen reader.

## Вправа

Створи add task screen:

1. `Scaffold`.
2. `TopAppBar`.
3. `OutlinedTextField`.
4. Validation error.
5. Save button.
6. Accessibility-friendly labels.

## Типові помилки

- Hardcode colors замість theme.
- Не показувати validation state.
- Робити icon-only button без accessible label.
- Ігнорувати TalkBack/font scale.

## Джерела

- [Material 3 in Compose](https://developer.android.com/develop/ui/compose/designsystems/material3)
- [Text input in Compose](https://developer.android.com/develop/ui/compose/text/user-input)
- [Accessibility in Compose](https://developer.android.com/develop/ui/compose/accessibility)
- [Semantics in Compose](https://developer.android.com/develop/ui/compose/accessibility/semantics)

## Далі

Переходь до [[Guides/Android/04 - State Navigation and Lifecycle/01 - State hoisting events і UDF|state hoisting, events і UDF]].

