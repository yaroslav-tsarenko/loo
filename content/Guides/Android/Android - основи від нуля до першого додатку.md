# Android: основи від нуля до першого додатку

Це короткий, але повний конспект Android "на долоні": що таке Android-розробка, як створити проєкт, як запускати додаток, як працюють основні частини app, що таке Activity, Manifest, resources, Compose, state, ViewModel, navigation, data layer, permissions, тести і release.

## Що таке Android-розробка

Android-додаток - це не просто Kotlin-програма. Він живе всередині Android OS, тому залежить від lifecycle, permissions, memory, battery, network, device configuration і системних обмежень.

Типовий Android app має:

- Kotlin-код;
- Android framework APIs;
- Jetpack libraries;
- UI на Jetpack Compose або XML Views;
- `AndroidManifest.xml`;
- resources: strings, colors, themes, images;
- Gradle build configuration;
- data layer: API, database, files;
- tests;
- debug/release builds;
- signing для релізу.

Сучасний рекомендований старт:

- Kotlin;
- Jetpack Compose;
- Material 3;
- single-activity architecture;
- ViewModel;
- StateFlow/Flow;
- Coroutines;
- Navigation Compose;
- Room або DataStore, коли потрібне збереження даних;
- Gradle Kotlin DSL.

## Що треба знати перед Android

Мінімум по Kotlin:

- `val` і `var`;
- functions;
- classes і `data class`;
- null-safety;
- collections;
- lambdas;
- `enum`;
- `sealed class`;
- basic coroutines.

Якщо ці теми ще слабкі, паралельно тримай відкритою нотатку [[Guides/Kotlin/Kotlin - основи від нуля до sealed і enum|Kotlin - основи від нуля до sealed і enum]].

## Як створити Android-проєкт

Найпростіший правильний шлях:

1. Встанови Android Studio.
2. Відкрий `New Project`.
3. Обери `Empty Activity`.
4. Language: `Kotlin`.
5. UI: `Jetpack Compose`.
6. Minimum SDK: залиш рекомендоване IDE значення або API 26+ для навчання.
7. Build configuration: `Kotlin DSL`, якщо доступно.
8. Натисни `Finish`.
9. Дочекайся `Gradle Sync`.
10. Запусти app на emulator або фізичному device.

Для навчання краще `Empty Activity`, бо вона не створює зайвого коду. Спочатку треба зрозуміти базу, а не боротися з великим template.

## Як запускати додаток

Через Android Studio:

1. Дочекайся `Gradle Sync`.
2. Створи emulator через Device Manager або підключи телефон.
3. Обери device зверху в toolbar.
4. Натисни `Run`.
5. Якщо щось падає, дивись `Logcat` і `Build Output`.

Через terminal:

```bash
./gradlew assembleDebug
./gradlew installDebug
./gradlew test
./gradlew connectedAndroidTest
```

Що це означає:

- `assembleDebug` - зібрати debug APK;
- `installDebug` - встановити app на device/emulator;
- `test` - запустити unit tests;
- `connectedAndroidTest` - запустити тести, яким потрібен Android device/emulator.

Якщо app не запускається:

- перевір, чи завершився Gradle Sync;
- перевір, чи emulator реально увімкнений;
- відкрий `Build Output`;
- відкрий `Logcat`;
- спочатку читай першу змістовну помилку, а не тільки останній рядок.

### Правильний порядок запуску під час розробки

Для першого запуску:

1. Відкрий проєкт саме як Gradle project, а не окрему папку `app`.
2. Дочекайся повного `Gradle Sync`.
3. Переконайся, що зверху обраний module `app`.
4. Обери emulator або physical device.
5. Запусти `Run`.
6. Після старту перевір `Logcat`, навіть якщо app відкрився.

Для щоденної роботи:

1. Після маленької зміни запускай app через `Run`.
2. Після зміни Gradle-файлів роби `Sync Now`.
3. Після дивних build errors запускай `./gradlew clean assembleDebug`.
4. Перед важливою перевіркою роби clean install: видали app з device і постав заново.
5. Перед релізом обов'язково перевір `release` build, а не тільки `debug`.

Корисні команди:

```bash
./gradlew clean
./gradlew :app:assembleDebug
./gradlew :app:installDebug
./gradlew :app:testDebugUnitTest
./gradlew :app:connectedDebugAndroidTest
./gradlew :app:assembleRelease
./gradlew :app:bundleRelease
```

Якщо app "лагає" тільки в emulator, перевір також physical device. Emulator може бути повільним через CPU, RAM, disk або graphics settings.

## Структура Android-проєкту

Типова структура:

```text
MyApp/
  settings.gradle.kts
  build.gradle.kts
  gradle/libs.versions.toml
  app/
    build.gradle.kts
    src/
      main/
        AndroidManifest.xml
        java або kotlin/
          com/example/myapp/
            MainActivity.kt
        res/
          drawable/
          mipmap/
          values/
```

Головні частини:

- `settings.gradle.kts` - які modules є в проєкті;
- root `build.gradle.kts` - загальні build settings;
- `app/build.gradle.kts` - залежності, plugins, Android config для app module;
- `AndroidManifest.xml` - декларація app components, permissions, theme;
- `MainActivity.kt` - стартова Activity;
- `res/` - ресурси app.

### Структура коду для нормальної підтримки

Для маленького app:

```text
com.example.myapp/
  MainActivity.kt
  ui/
    HomeScreen.kt
    HomeViewModel.kt
    HomeUiState.kt
  data/
    UserRepository.kt
    UserApi.kt
  domain/
    User.kt
```

Для середнього і великого app краще групувати за features:

```text
com.example.myapp/
  core/
    database/
    network/
    design/
    common/
  feature/
    home/
      HomeRoute.kt
      HomeScreen.kt
      HomeViewModel.kt
      HomeUiState.kt
    profile/
      ProfileRoute.kt
      ProfileScreen.kt
      ProfileViewModel.kt
      ProfileUiState.kt
  data/
    user/
      UserRepository.kt
      UserDto.kt
      UserDao.kt
  domain/
    model/
      User.kt
```

Принципи:

- `ui` або `feature/*` - екрани, компоненти, ViewModel, UI state;
- `data` - API, DAO, repository implementations, cache;
- `domain` - чисті models і бізнес-правила;
- `core` - спільні речі: network client, database, theme, utils;
- `MainActivity` має бути тонкою: тільки старт app і `setContent`.

Структура сама по собі не робить app швидким, але вона не дає змішувати UI, network, database і business logic. Саме змішування часто призводить до лагів, дублювання, складних recomposition і багів.

## Gradle простими словами

Gradle збирає додаток:

- компілює Kotlin;
- обробляє resources;
- генерує build artifacts;
- пакує APK або AAB;
- запускає тести;
- створює debug і release variants.

У `app/build.gradle.kts` зазвичай є:

```kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.myapp"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.myapp"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }
}
```

`compileSdk` - SDK, яким компілюється app.

`minSdk` - мінімальна Android-версія, на якій app може запускатися.

`targetSdk` - версія Android, під поведінку якої app адаптований.

`applicationId` - унікальний id додатку.

## Як підключати бібліотеки

Найзручніше тримати версії бібліотек у `gradle/libs.versions.toml`.

Приклад:

```toml
[versions]
androidxLifecycle = "x.y.z"
coil = "x.y.z"

[libraries]
androidx-lifecycle-runtime-compose = { module = "androidx.lifecycle:lifecycle-runtime-compose", version.ref = "androidxLifecycle" }
coil-compose = { module = "io.coil-kt:coil-compose", version.ref = "coil" }
```

Потім у `app/build.gradle.kts`:

```kotlin
dependencies {
    implementation(libs.androidx.lifecycle.runtime.compose)
    implementation(libs.coil.compose)
}
```

Після зміни Gradle-файлів:

1. Натисни `Sync Now`.
2. Якщо sync впав, читай `Build Output`.
3. Перевір, що dependency додана саме в module `app`, якщо вона потрібна додатку.
4. Не додавай дві бібліотеки, які роблять одне й те саме.

Що куди підключати:

- `implementation` - звичайна залежність для app;
- `debugImplementation` - тільки для debug build;
- `testImplementation` - для JVM/unit tests;
- `androidTestImplementation` - для instrumentation/Compose UI tests;
- `kapt` або `ksp` - annotation/symbol processors, якщо бібліотека цього потребує.

Практичні правила:

- перед додаванням library перевір, чи Jetpack/Kotlin вже не вирішує задачу;
- не оновлюй усі версії одночасно без потреби;
- після додавання важкої library перевір build time і app size;
- для images краще Coil/Glide, а не ручне декодування bitmap;
- для database краще Room, а не самописний SQLite без потреби;
- для background tasks краще WorkManager, а не нескінченний service.

## Структура, щоб додаток не лагав

Лаги зазвичай з'являються не через назву папок, а через неправильний потік даних і роботу на main thread.

Базова схема:

```text
UI -> ViewModel -> Repository -> API/Database
```

Що має бути в UI:

- показати state;
- викликати callbacks;
- не робити network/database calls напряму;
- не тримати складну бізнес-логіку.

Що має бути у ViewModel:

- `StateFlow` або інший observable state;
- обробка user events;
- запуск coroutines через `viewModelScope`;
- мапінг domain result у UI state.

Що має бути в Repository:

- network/database/cache;
- retry/cache logic;
- перетворення DTO/entity у domain models.

Що допомагає не лагати:

- не блокувати main thread;
- не робити важкі обчислення в composable body;
- не завантажувати великі images без image library;
- не тримати величезні списки через `Column`, використовуй `LazyColumn`;
- не створювати нові heavy objects на кожну recomposition;
- використовувати stable UI state і маленькі composables;
- показувати loading state для повільних операцій;
- робити pagination для великих списків;
- кешувати дані, якщо network повільний;
- перевіряти performance на слабшому device, а не тільки на швидкому emulator.

Приклад поганої ідеї:

```kotlin
@Composable
fun HomeScreen() {
    val users = runBlocking {
        repository.loadUsers()
    }

    Column {
        users.forEach { Text(it.name) }
    }
}
```

Проблеми: `runBlocking` блокує UI, network у composable, `Column` для потенційно великого списку.

Краще:

```kotlin
@Composable
fun HomeScreen(
    users: List<User>,
    isLoading: Boolean
) {
    if (isLoading) {
        CircularProgressIndicator()
    } else {
        LazyColumn {
            items(users) { user ->
                Text(user.name)
            }
        }
    }
}
```

## Activity

`Activity` - екран або entry point, який Android OS може створювати, зупиняти, пересоздавати і знищувати.

У сучасному Compose-проєкті часто використовують single-activity architecture: одна `MainActivity`, а екрани всередині перемикаються через Compose Navigation.

Мінімальна Activity:

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            MaterialTheme {
                Text("Hello, Android")
            }
        }
    }
}
```

`onCreate` викликається, коли Activity створюється.

`setContent` задає Compose UI.

## Lifecycle

Android може пересоздати Activity після:

- rotation;
- зміни мови;
- зміни theme;
- нестачі пам'яті;
- повернення з background.

Базові lifecycle callbacks:

- `onCreate` - Activity створюється;
- `onStart` - стає видимою;
- `onResume` - користувач може взаємодіяти;
- `onPause` - Activity частково закривається;
- `onStop` - більше не видима;
- `onDestroy` - знищується.

Практичне правило: не зберігай важливий state тільки в Activity local variables. Для UI state використовуй ViewModel, а для довготривалих даних - repository/database/DataStore.

## AndroidManifest.xml

Manifest описує app для системи.

Приклад:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:theme="@style/Theme.MyApp"
        android:label="@string/app_name">

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

Тут:

- `application` - загальні налаштування app;
- `activity` - реєстрація Activity;
- `MAIN` + `LAUNCHER` - ця Activity стартує з іконки app;
- `exported` - чи доступний component іншим app.

Permissions теж оголошуються в manifest:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

## Resources

Resources - це не Kotlin-код, а дані app:

- `res/values/strings.xml` - тексти;
- `res/values/colors.xml` - кольори;
- `res/values/themes.xml` - теми;
- `res/drawable/` - images/vector drawables;
- `res/mipmap/` - launcher icons.

Приклад `strings.xml`:

```xml
<resources>
    <string name="app_name">My App</string>
</resources>
```

Практичне правило: user-facing text краще тримати в strings resources, особливо якщо може бути localization.

## Jetpack Compose

Jetpack Compose - декларативний UI toolkit. Ти описуєш, як UI має виглядати для поточного state, а Compose сам оновлює екран, коли state змінюється.

Composable function:

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name")
}
```

Screen:

```kotlin
@Composable
fun HomeScreen() {
    Column {
        Text("Home")
        Button(onClick = { }) {
            Text("Continue")
        }
    }
}
```

Основні composables:

- `Text` - текст;
- `Button` - кнопка;
- `TextField` - поле вводу;
- `Column` - вертикальний layout;
- `Row` - горизонтальний layout;
- `Box` - накладання елементів;
- `LazyColumn` - список;
- `Image` - зображення.

## Modifier

`Modifier` налаштовує розмір, padding, background, click behavior, alignment.

```kotlin
Text(
    text = "Hello",
    modifier = Modifier
        .padding(16.dp)
        .fillMaxWidth()
)
```

Порядок modifier-ів важливий:

```kotlin
Modifier
    .background(Color.Red)
    .padding(16.dp)
```

і

```kotlin
Modifier
    .padding(16.dp)
    .background(Color.Red)
```

виглядатимуть по-різному.

## State в Compose

State - це дані, від яких залежить UI.

Мінімальний counter:

```kotlin
@Composable
fun CounterScreen() {
    var count by remember { mutableStateOf(0) }

    Column {
        Text("Count: $count")
        Button(onClick = { count++ }) {
            Text("Add")
        }
    }
}
```

`remember` зберігає state між recomposition, але не завжди переживає configuration changes. Для state екрана краще ViewModel.

## Recomposition

Recomposition - це коли Compose повторно викликає composable-функції, бо змінився state.

Практичні правила:

- composable має бути легкою;
- не роби network/database calls прямо в body composable;
- не створюй важкі об'єкти без `remember`;
- UI має бути функцією від state.

## State hoisting

State hoisting - це винесення state вище, щоб composable була більш контрольованою.

Погано для reusable компонента:

```kotlin
@Composable
fun NameInput() {
    var name by remember { mutableStateOf("") }

    TextField(
        value = name,
        onValueChange = { name = it }
    )
}
```

Краще:

```kotlin
@Composable
fun NameInput(
    name: String,
    onNameChange: (String) -> Unit
) {
    TextField(
        value = name,
        onValueChange = onNameChange
    )
}
```

Так компонент не вирішує сам, де живе state.

## ViewModel

ViewModel тримає state екрана і переживає configuration changes.

```kotlin
data class HomeUiState(
    val isLoading: Boolean = false,
    val name: String = "",
    val error: String? = null
)

class HomeViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    fun onNameChange(name: String) {
        _uiState.update { it.copy(name = name) }
    }
}
```

У Compose:

```kotlin
@Composable
fun HomeRoute(
    viewModel: HomeViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    HomeScreen(
        state = uiState,
        onNameChange = viewModel::onNameChange
    )
}
```

Практичне правило:

- `Route` composable працює з ViewModel;
- `Screen` composable отримує state і callbacks;
- UI-компоненти не повинні напряму знати про repository/API.

## UI state

Для простого state часто достатньо `data class`:

```kotlin
data class ProfileUiState(
    val isLoading: Boolean = false,
    val user: User? = null,
    val error: String? = null
)
```

Для чітко розділених станів зручно `sealed`:

```kotlin
sealed class ProfileUiState {
    data object Loading : ProfileUiState()
    data class Content(val user: User) : ProfileUiState()
    data class Error(val message: String) : ProfileUiState()
}
```

`data class` зручний, коли багато полів можуть комбінуватися.

`sealed` зручний, коли стани взаємовиключні: або loading, або content, або error.

## Navigation

Navigation потрібна для переходів між екранами.

У Compose зазвичай використовують Navigation Compose.

Приклад route:

```kotlin
object Routes {
    const val HOME = "home"
    const val DETAILS = "details/{id}"
}
```

Схематично:

```kotlin
NavHost(
    navController = navController,
    startDestination = Routes.HOME
) {
    composable(Routes.HOME) {
        HomeScreen(
            onOpenDetails = { id ->
                navController.navigate("details/$id")
            }
        )
    }

    composable(Routes.DETAILS) {
        DetailsScreen()
    }
}
```

Правила:

- не передавай великі об'єкти через route;
- передавай id, а дані завантажуй через repository;
- не тримай navigation logic у маленьких UI-компонентах;
- для більших app використовуй typed routes або sealed routes.

## Data layer

Data layer відповідає за дані:

- network;
- database;
- cache;
- files;
- preferences;
- repositories.

Repository ховає деталі джерел даних:

```kotlin
class UserRepository(
    private val api: UserApi,
    private val dao: UserDao
) {
    suspend fun getUser(id: Int): User {
        val cached = dao.getUser(id)
        if (cached != null) return cached

        val remote = api.getUser(id)
        dao.saveUser(remote)
        return remote
    }
}
```

UI не має знати, чи дані прийшли з API, database або cache.

## Network

Для network часто використовують Retrofit або Ktor.

Типова ідея:

```kotlin
interface UserApi {
    suspend fun getUser(id: Int): UserDto
}
```

Network models не завжди варто використовувати прямо в UI. Часто краще мапити:

```kotlin
data class UserDto(
    val id: Int,
    val fullName: String
)

data class User(
    val id: Int,
    val name: String
)

fun UserDto.toDomain(): User {
    return User(
        id = id,
        name = fullName
    )
}
```

## Database і local storage

Для structured local database використовують Room.

Для маленьких налаштувань використовують DataStore.

Коли що брати:

- Room - users, posts, cached data, tables, relations, queries;
- DataStore - token, flags, settings, selected theme;
- files - images, exports, large raw content.

## Coroutines в Android

Coroutines потрібні для async роботи.

У ViewModel:

```kotlin
class ProfileViewModel(
    private val repository: UserRepository
) : ViewModel() {
    fun loadUser(id: Int) {
        viewModelScope.launch {
            val user = repository.getUser(id)
        }
    }
}
```

Правила:

- network/database не виконувати на main thread;
- у ViewModel використовувати `viewModelScope`;
- не використовувати `GlobalScope` без дуже сильної причини;
- помилки обробляти явно;
- loading/error state показувати в UI.

## Permissions

Permissions потрібні для доступу до чутливих можливостей:

- camera;
- location;
- microphone;
- contacts;
- storage/media;
- notifications.

Два кроки:

1. Оголосити permission у Manifest.
2. Запросити permission у runtime, якщо вона runtime-permission.

Приклад manifest:

```xml
<uses-permission android:name="android.permission.CAMERA" />
```

Практичні правила:

- проси permission тільки тоді, коли вона реально потрібна;
- пояснюй користувачу, навіщо вона;
- обробляй denied state;
- не вважай, що permission завжди буде granted;
- permission може бути відкликана після встановлення app.

## Background work

Не всю роботу можна робити просто в background thread. Android обмежує background execution заради battery.

Для відкладеної гарантованої роботи використовують WorkManager:

- sync data;
- upload logs;
- periodic cleanup;
- retryable background tasks.

Не використовуй нескінченні background services без потреби.

## Dependency Injection

DI означає: клас не створює всі залежності сам, а отримує їх ззовні.

Погано:

```kotlin
class ProfileViewModel : ViewModel() {
    private val repository = UserRepository()
}
```

Краще:

```kotlin
class ProfileViewModel(
    private val repository: UserRepository
) : ViewModel()
```

Для малих проєктів можна manual DI. Для більших Android-проєктів часто використовують Hilt або Koin.

## Архітектура простими словами

Базова структура:

```text
ui -> viewmodel -> repository -> api/database
```

UI:

- показує state;
- відправляє events.

ViewModel:

- тримає UI state;
- реагує на events;
- викликає use cases/repositories.

Repository:

- працює з network/database/cache;
- повертає domain data.

Domain:

- моделі і бізнес-правила;
- може бути маленьким або відсутнім у простих app.

## Debugging

Основні інструменти:

- `Logcat` - logs і crashes;
- `Build Output` - build errors;
- debugger - breakpoints;
- Layout Inspector - перевірка UI;
- Profiler - memory, CPU, network;
- APK Analyzer - розмір APK/AAB.

Мінімальний log:

```kotlin
Log.d("Profile", "User loaded: $user")
```

У production не залишай зайві logs з персональними даними, tokens або payment data.

## Testing

В Android є кілька рівнів тестів:

- unit tests - швидкі JVM-тести без device;
- instrumentation tests - тести на device/emulator;
- Compose UI tests - перевірка UI;
- integration tests - перевірка кількох шарів разом.

Що тестувати спочатку:

- pure Kotlin functions;
- ViewModel logic;
- repository behavior;
- mappers;
- validation;
- critical UI flows.

Приклад unit test:

```kotlin
class CalculatorTest {
    @Test
    fun sum_returnsCorrectResult() {
        val result = sum(2, 3)

        assertEquals(5, result)
    }
}
```

## Debug vs release

Debug:

- швидкий для розробки;
- debug signing;
- debug logs/tools;
- не оптимізований як production.

Release:

- підписується release key;
- може використовувати minify/shrink;
- має бути протестований окремо;
- саме release build іде в Play Store.

Команди:

```bash
./gradlew assembleDebug
./gradlew assembleRelease
./gradlew bundleRelease
```

`bundleRelease` створює AAB, який зазвичай використовують для Google Play.

## Signing і Play release

Для release потрібен signing key.

Перед релізом перевір:

- app id правильний;
- versionCode збільшений;
- versionName правильний;
- release build запускається;
- permissions обґрунтовані;
- privacy policy є, якщо потрібна;
- crash-free basic flow;
- app не логить secrets;
- app працює після clean install;
- app працює після update зі старої версії.

## Як краще вчити Android

Порядок:

1. Kotlin basics.
2. Створити Empty Activity Compose app.
3. Зрозуміти Activity, Manifest, resources.
4. Зробити кілька Compose screens.
5. Зрозуміти state і recomposition.
6. Додати ViewModel.
7. Додати Navigation.
8. Додати fake repository.
9. Додати real network або local database.
10. Додати loading/error states.
11. Написати unit tests.
12. Зібрати release build.

Не починай одразу з Hilt, Room, Retrofit, Navigation, auth і складної архітектури в одному проєкті. Так складно зрозуміти, що саме зламалося.

## Перший практичний проєкт

Зроби маленький Todo або Notes app.

Мінімальні features:

- список нотаток;
- додати нотатку;
- відкрити деталі;
- видалити нотатку;
- empty state;
- error state;
- простий local storage.

Порядок реалізації:

1. Створи UI без backend/database.
2. Зроби fake list у ViewModel.
3. Додай events: add/delete/open.
4. Додай Navigation.
5. Додай repository.
6. Потім додай Room або DataStore.
7. Напиши кілька unit tests для ViewModel.

## Типові помилки новачків

- Не чекати Gradle Sync.
- Ігнорувати `Build Output`.
- Писати network calls прямо в composable.
- Тримати весь state у `MainActivity`.
- Використовувати `remember` для state, який має переживати rotation.
- Не обробляти loading/error.
- Передавати великі objects через navigation route.
- Просити permissions на старті app без причини.
- Не тестувати release build.
- Плутати debug behavior із production behavior.
- Додавати занадто багато бібліотек до того, як зрозуміла задача.
- Додавати бібліотеки без розуміння, у який Gradle configuration вони мають іти.
- Використовувати `Column` для сотень елементів замість `LazyColumn`.
- Робити heavy work на main thread.
- Змішувати UI, API, database і business logic в одному файлі.

## Міні-шпаргалка

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            MaterialTheme {
                HomeRoute()
            }
        }
    }
}

data class HomeUiState(
    val isLoading: Boolean = false,
    val title: String = "",
    val error: String? = null
)

class HomeViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState = _uiState.asStateFlow()

    fun onTitleChange(title: String) {
        _uiState.update { it.copy(title = title) }
    }
}

@Composable
fun HomeRoute(
    viewModel: HomeViewModel = viewModel()
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    HomeScreen(
        state = state,
        onTitleChange = viewModel::onTitleChange
    )
}

@Composable
fun HomeScreen(
    state: HomeUiState,
    onTitleChange: (String) -> Unit
) {
    Column(modifier = Modifier.padding(16.dp)) {
        TextField(
            value = state.title,
            onValueChange = onTitleChange
        )

        Text(text = "Title: ${state.title}")
    }
}
```

## Що читати далі

- [[Guides/Android/01 - Start/02 - Android Studio SDK Gradle і перший проєкт|Android Studio SDK Gradle і перший проєкт]]
- [[Guides/Android/01 - Start/03 - Структура Android проєкту|Структура Android проєкту]]
- [[Guides/Android/02 - Android Fundamentals/01 - App components Activity Manifest Intent|App components Activity Manifest Intent]]
- [[Guides/Android/03 - Compose UI/01 - Thinking in Compose і composable functions|Thinking in Compose і composable functions]]
- [[Guides/Android/04 - State Navigation and Lifecycle/02 - ViewModel StateFlow і side effects|ViewModel StateFlow і side effects]]
- [[Guides/Android/05 - Architecture/01 - Modern Android Architecture|Modern Android Architecture]]
