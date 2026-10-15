# Thinking in Compose і composable functions

## Ціль уроку

Зрозуміти декларативну модель Compose: UI як function of state, recomposition і composable functions.

## Декларативний UI

У Compose ти не змінюєш View напряму. Ти описуєш, як UI має виглядати для поточного state.

```kotlin
@Composable
fun Greeting(name: String) {
    Text("Hello, $name")
}
```

Коли state змінюється, Compose запускає recomposition для потрібних частин UI.

## Composable function

Composable:

- має annotation `@Composable`;
- може викликати інші composables;
- не має робити blocking work;
- має бути side-effect free, якщо це просто UI rendering.

## Recomposition

Recomposition - повторний виклик composable functions після зміни state.

Не покладайся на те, що composable викличеться один раз.

Погано:

```kotlin
@Composable
fun Screen() {
    println("Load data")
    loadFromNetwork()
}
```

Краще:

- data loading у ViewModel;
- side effects через `LaunchedEffect`, якщо це UI-related effect;
- state приходить у composable як parameter.

## Preview

```kotlin
@Preview
@Composable
fun GreetingPreview() {
    MaterialTheme {
        Greeting("Android")
    }
}
```

Preview прискорює UI iteration, але не замінює tests і запуск на device.

## Stateless composable

```kotlin
@Composable
fun Counter(
    count: Int,
    onIncrement: () -> Unit
) {
    Button(onClick = onIncrement) {
        Text("Count: $count")
    }
}
```

Такі composables простіше тестувати й перевикористовувати.

## Вправа

Створи:

1. `ProfileHeader(name, subtitle)`.
2. `StatItem(label, value)`.
3. `ProfileScreen`, який складає їх разом.
4. Preview для light і dark theme.

## Типові помилки

- Виконувати network/database calls прямо в composable.
- Зберігати business state у composable без потреби.
- Робити composable з 15 параметрами замість UI state object.
- Ігнорувати previews.

## Джерела

- [Thinking in Compose](https://developer.android.com/develop/ui/compose/mental-model)
- [Composable functions](https://developer.android.com/develop/ui/compose/tutorial)
- [Compose lifecycle](https://developer.android.com/develop/ui/compose/lifecycle)

## Далі

Переходь до [[Guides/Android/03 - Compose UI/02 - Layouts modifiers lists і images|layouts, modifiers, lists і images]].

