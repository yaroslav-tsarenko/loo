# Navigation Compose і adaptive navigation

## Ціль уроку

Навчитися будувати navigation graph у Compose, передавати мінімальні arguments і думати про adaptive navigation.

## Navigation basics

Navigation має:

- `NavController`;
- `NavHost`;
- destinations;
- routes;
- back stack.

```kotlin
@Composable
fun AppNavHost(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = "tasks"
    ) {
        composable("tasks") {
            TaskListRoute(
                onTaskClick = { id -> navController.navigate("tasks/$id") }
            )
        }

        composable("tasks/{taskId}") {
            TaskDetailsRoute()
        }
    }
}
```

## Arguments

Не передавай complex objects між destinations. Передавай мінімум: ID або small primitive args.

Погано:

```text
navigate(taskObject)
```

Краще:

```kotlin
navController.navigate("tasks/${task.id}")
```

Destination завантажує дані через repository по ID.

## Navigation events

Screen не має напряму знати `NavController`.

```kotlin
TaskListScreen(
    state = state,
    onTaskClick = { id -> onNavigateToDetails(id) }
)
```

`NavController` краще тримати на app/navigation layer.

## Back stack

```kotlin
navController.popBackStack()
```

Для login/logout flow часто треба очистити back stack:

```kotlin
navController.navigate("home") {
    popUpTo("login") { inclusive = true }
}
```

## Adaptive navigation

На phones може бути bottom navigation, на tablets - navigation rail або permanent drawer. Для list-detail app на великому екрані можна показувати list і detail одночасно.

Правило: navigation graph - це не тільки routes, а й UX для різних screen sizes.

## Вправа

Створи navigation:

1. `tasks`
2. `tasks/{taskId}`
3. `settings`
4. Bottom navigation для `tasks/settings`.
5. Detail відкривається з task ID.

## Типові помилки

- Передавати великі objects як arguments.
- Викликати `NavController` з глибоких UI components.
- Не тестувати back behavior.
- Проєктувати navigation тільки під один phone screen.

## Джерела

- [Navigation with Compose](https://developer.android.com/develop/ui/compose/navigation)
- [Navigation overview](https://developer.android.com/guide/navigation)
- [Adaptive navigation](https://developer.android.com/develop/ui/compose/layouts/adaptive)

## Далі

Переходь до [[Guides/Android/05 - Architecture/01 - Modern Android Architecture|Modern Android Architecture]].

