# Dependency injection Hilt Koin manual DI

## Ціль уроку

Зрозуміти dependency injection в Android і коли обирати manual DI, Hilt або Koin.

## Що таке DI

Dependency Injection означає, що class отримує dependencies ззовні, а не створює їх всередині.

Погано:

```kotlin
class TaskViewModel : ViewModel() {
    private val repository = RealTaskRepository()
}
```

Краще:

```kotlin
class TaskViewModel(
    private val repository: TaskRepository
) : ViewModel()
```

## Manual DI

Для маленької app manual DI нормальний:

```kotlin
class AppContainer {
    private val database = createDatabase()
    val taskRepository: TaskRepository = RoomTaskRepository(database.taskDao())
}
```

Плюси:

- прозоро;
- мало магії;
- добре для навчання.

Мінуси:

- boilerplate росте у великих apps.

## Hilt

Hilt - офіційний DI варіант для Android, побудований на Dagger.

Типові елементи:

- `@HiltAndroidApp`;
- `@AndroidEntryPoint`;
- `@HiltViewModel`;
- `@Inject`;
- `@Module`;
- `@Provides`;
- scopes.

## Koin

Koin - Kotlin-first DI framework без annotation processing у стилі Dagger/Hilt.

Плюси:

- простий DSL;
- швидко стартувати.

Мінуси:

- інша runtime/error модель;
- не офіційний Android recommendation.

## Що обрати

- Навчальний small app: manual DI.
- Production Android із Jetpack stack: Hilt.
- Kotlin-first команда, яка усвідомлено хоче runtime DI: Koin.

## Вправа

1. Створи `TaskRepository` interface.
2. Створи fake implementation.
3. Передай repository у ViewModel через factory/manual DI.
4. Замінити fake на real implementation без зміни UI.

## Типові помилки

- Створювати dependencies у ViewModel.
- Протягувати `Context` у domain layer.
- Робити global singleton без lifecycle.
- Впроваджувати Hilt до розуміння basic DI.

## Джерела

- [Dependency injection in Android](https://developer.android.com/training/dependency-injection)
- [Hilt](https://developer.android.com/training/dependency-injection/hilt-android)
- [Manual dependency injection](https://developer.android.com/training/dependency-injection/manual)

## Далі

Переходь до [[Guides/Android/06 - Data Layer/01 - Networking serialization і offline first|networking, serialization і offline first]].

