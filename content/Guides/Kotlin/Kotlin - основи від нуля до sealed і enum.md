# Kotlin: основи від нуля до sealed і enum

Це конспект Kotlin "на долоні": що це за мова, як читати код, як писати базову логіку, як створювати класи, як працюють `enum` і `sealed`, як запускати прості програми та Android-додатки.

## Що таке Kotlin

Kotlin - сучасна статично типізована мова від JetBrains. Її часто використовують для Android, backend на JVM, скриптів, desktop і multiplatform.

Головні ідеї:

- код коротший, ніж Java, але типи залишаються строгими;
- null-safety вбудований у мову;
- функції, класи, колекції, лямбди і корутини добре поєднуються;
- Kotlin працює поверх JVM, тому може використовувати Java-бібліотеки.

## Як створювати Kotlin-проєкт

### Для Android

Найкращий старт для Android:

1. Встанови Android Studio.
2. `New Project`.
3. Template: `Empty Activity`.
4. Language: `Kotlin`.
5. UI: `Jetpack Compose`.
6. Build configuration: `Kotlin DSL`, якщо IDE дає такий вибір.
7. Дочекайся `Gradle Sync`.
8. Запусти через кнопку `Run` на emulator або фізичному device.

Для навчання краще починати з `Empty Activity`, а не з великого template. Так ти бачиш, що реально потрібно проєкту.

### Для простого Kotlin/JVM

Якщо треба просто вчити мову без Android:

1. Відкрий IntelliJ IDEA.
2. `New Project`.
3. Обери `Kotlin` або `Kotlin/JVM`.
4. Створи файл `Main.kt`.
5. Додай функцію `main`.

```kotlin
fun main() {
    println("Hello, Kotlin")
}
```

Запуск:

- в IDE: натисни Run біля `main`;
- через Gradle: `./gradlew run`, якщо проєкт налаштований як application;
- для Android: `./gradlew installDebug` або Run в Android Studio.

## Мінімальна програма

```kotlin
fun main() {
    val name = "Yaroslav"
    println("Hello, $name")
}
```

`fun` оголошує функцію. `main` - точка входу для звичайної Kotlin/JVM програми. `println` друкує текст у консоль.

## `val` і `var`

```kotlin
val immutableName = "Alex"
var counter = 0

counter = counter + 1
```

`val` - read-only посилання. Після присвоєння змінити його не можна.

`var` - змінна, яку можна переприсвоювати.

Практичне правило: за замовчуванням використовуй `val`. `var` став тільки тоді, коли значення справді має змінюватися.

## Типи

Kotlin часто сам виводить тип:

```kotlin
val age = 25
val price = 19.99
val isActive = true
val title = "Profile"
```

Можна вказати тип явно:

```kotlin
val age: Int = 25
val price: Double = 19.99
val isActive: Boolean = true
val title: String = "Profile"
```

Базові типи:

- `Int` - ціле число;
- `Long` - велике ціле число;
- `Float`, `Double` - числа з дробовою частиною;
- `Boolean` - `true` або `false`;
- `String` - текст;
- `Char` - один символ;
- `Unit` - аналог "нічого не повертає".

## Рядки

```kotlin
val name = "Alex"
val age = 30

println("Name: $name")
println("Next year: ${age + 1}")
```

Для багаторядкового тексту:

```kotlin
val message = """
    Hello
    Kotlin
""".trimIndent()
```

## Умови

```kotlin
val age = 18

if (age >= 18) {
    println("Adult")
} else {
    println("Minor")
}
```

`if` може повертати значення:

```kotlin
val status = if (age >= 18) "adult" else "minor"
```

## `when`

`when` схожий на `switch`, але сильніший.

```kotlin
val code = 200

val message = when (code) {
    200 -> "OK"
    404 -> "Not found"
    500 -> "Server error"
    else -> "Unknown"
}
```

Можна перевіряти діапазони:

```kotlin
val score = 85

val grade = when (score) {
    in 90..100 -> "A"
    in 75..89 -> "B"
    in 60..74 -> "C"
    else -> "Try again"
}
```

## Цикли

```kotlin
for (i in 1..5) {
    println(i)
}
```

```kotlin
for (i in 5 downTo 1) {
    println(i)
}
```

```kotlin
var count = 0

while (count < 3) {
    println(count)
    count++
}
```

## Функції

```kotlin
fun sum(a: Int, b: Int): Int {
    return a + b
}
```

Якщо функція коротка:

```kotlin
fun sum(a: Int, b: Int): Int = a + b
```

Параметри за замовчуванням:

```kotlin
fun greet(name: String = "Guest") {
    println("Hello, $name")
}
```

Named arguments:

```kotlin
greet(name = "Alex")
```

## Null-safety

У Kotlin звичайний тип не може бути `null`.

```kotlin
val name: String = "Alex"
```

Nullable тип позначається `?`.

```kotlin
val name: String? = null
```

Безпечний виклик:

```kotlin
val length = name?.length
```

Elvis operator:

```kotlin
val length = name?.length ?: 0
```

Небезпечний оператор `!!`:

```kotlin
val length = name!!.length
```

`!!` каже: "я точно знаю, що тут не null". Якщо це неправда, буде crash. У production-коді краще уникати `!!`.

## Колекції

Read-only список:

```kotlin
val names = listOf("Alex", "Maria", "John")
```

Mutable список:

```kotlin
val names = mutableListOf("Alex")
names.add("Maria")
```

Map:

```kotlin
val users = mapOf(
    1 to "Alex",
    2 to "Maria"
)
```

Set:

```kotlin
val tags = setOf("android", "kotlin", "compose")
```

Корисні операції:

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

val doubled = numbers.map { it * 2 }
val even = numbers.filter { it % 2 == 0 }
val firstBig = numbers.firstOrNull { it > 3 }
val sum = numbers.sum()
```

Практичне правило: якщо колекцію не треба змінювати, використовуй `listOf`, `mapOf`, `setOf`, а не mutable-версії.

## Лямбди

Лямбда - функція як значення.

```kotlin
val multiply: (Int, Int) -> Int = { a, b -> a * b }

println(multiply(2, 3))
```

У колекціях часто використовується `it`:

```kotlin
val names = listOf("Alex", "Maria")
val upper = names.map { it.uppercase() }
```

## Класи

```kotlin
class User(
    val id: Int,
    var name: String
) {
    fun rename(newName: String) {
        name = newName
    }
}
```

Використання:

```kotlin
val user = User(id = 1, name = "Alex")
user.rename("Maria")
```

`val` у constructor створює read-only property. `var` створює property, яку можна змінювати.

## `data class`

`data class` потрібен для моделей даних.

```kotlin
data class User(
    val id: Int,
    val name: String,
    val email: String
)
```

Kotlin автоматично створює:

- `toString`;
- `equals`;
- `hashCode`;
- `copy`;
- destructuring.

```kotlin
val user = User(1, "Alex", "alex@mail.com")
val updated = user.copy(name = "Maria")
```

Практичне правило: DTO, UI state, database entity, response model часто роблять через `data class`.

## `object`

`object` створює singleton.

```kotlin
object AppConfig {
    const val API_URL = "https://api.example.com"
}
```

Використання:

```kotlin
println(AppConfig.API_URL)
```

## `companion object`

`companion object` - об'єкт всередині класу для factory methods або констант.

```kotlin
class User private constructor(
    val name: String
) {
    companion object {
        fun guest(): User = User("Guest")
    }
}

val guest = User.guest()
```

## Інтерфейси

```kotlin
interface UserRepository {
    fun getUser(id: Int): User?
}
```

Реалізація:

```kotlin
class InMemoryUserRepository : UserRepository {
    private val users = listOf(User(1, "Alex", "alex@mail.com"))

    override fun getUser(id: Int): User? {
        return users.firstOrNull { it.id == id }
    }
}
```

Інтерфейси допомагають відділяти "що треба зробити" від "як саме це зробити".

## Наслідування

У Kotlin класи за замовчуванням `final`. Щоб дозволити наслідування, треба `open`.

```kotlin
open class Animal {
    open fun speak() {
        println("Sound")
    }
}

class Dog : Animal() {
    override fun speak() {
        println("Bark")
    }
}
```

На практиці в Kotlin частіше використовують композицію, інтерфейси, `data class` і `sealed class`, ніж глибоке наслідування.

## `enum class`

`enum` потрібен, коли є фіксований набір простих значень.

```kotlin
enum class OrderStatus {
    CREATED,
    PAID,
    SHIPPED,
    CANCELLED
}
```

Використання:

```kotlin
val status = OrderStatus.PAID

val text = when (status) {
    OrderStatus.CREATED -> "Created"
    OrderStatus.PAID -> "Paid"
    OrderStatus.SHIPPED -> "Shipped"
    OrderStatus.CANCELLED -> "Cancelled"
}
```

`enum` може мати properties:

```kotlin
enum class Priority(val label: String) {
    LOW("Low"),
    MEDIUM("Medium"),
    HIGH("High")
}
```

Коли використовувати `enum`:

- статус замовлення;
- роль користувача;
- тип сортування;
- фіксований режим екрана;
- простий набір опцій без різних структур даних.

## `sealed class` і `sealed interface`

`sealed` потрібен, коли є обмежений набір варіантів, але кожен варіант може мати різні дані.

```kotlin
sealed class UiState {
    data object Loading : UiState()
    data class Success(val users: List<User>) : UiState()
    data class Error(val message: String) : UiState()
}
```

Використання:

```kotlin
fun render(state: UiState) {
    when (state) {
        UiState.Loading -> println("Loading")
        is UiState.Success -> println("Users: ${state.users.size}")
        is UiState.Error -> println("Error: ${state.message}")
    }
}
```

Перевага: `when` знає всі можливі варіанти. Якщо ти додаси новий стан, компілятор підкаже, де треба оновити логіку.

`sealed interface` схожий, але дає більше гнучкості з реалізаціями:

```kotlin
sealed interface PaymentResult

data class PaymentSuccess(val transactionId: String) : PaymentResult
data class PaymentFailure(val reason: String) : PaymentResult
data object PaymentPending : PaymentResult
```

Коли використовувати `sealed`:

- UI state: `Loading`, `Success`, `Error`;
- result операції: `Success`, `Failure`, `Pending`;
- події екрана;
- navigation routes;
- domain states, де різні стани мають різні поля.

Коротко:

- `enum` - прості фіксовані значення одного типу;
- `sealed` - фіксовані варіанти, але з різною структурою даних.

## Exceptions

```kotlin
fun parseAge(input: String): Int {
    return input.toIntOrNull() ?: throw IllegalArgumentException("Invalid age")
}
```

`try` може повертати значення:

```kotlin
val age = try {
    input.toInt()
} catch (e: NumberFormatException) {
    0
}
```

Для бізнес-логіки часто краще повертати `sealed` result, а не кидати exception всюди.

```kotlin
sealed class LoginResult {
    data class Success(val user: User) : LoginResult()
    data class Error(val message: String) : LoginResult()
}
```

## Generics

Generics дозволяють писати код, який працює з різними типами.

```kotlin
class Box<T>(val value: T)

val intBox = Box(10)
val stringBox = Box("Hello")
```

Приклад result:

```kotlin
sealed class Result<out T> {
    data class Success<T>(val value: T) : Result<T>()
    data class Error(val message: String) : Result<Nothing>()
}
```

## Extension functions

Extension function додає функцію до існуючого типу без зміни його коду.

```kotlin
fun String.firstLetter(): String {
    return this.firstOrNull()?.toString() ?: ""
}

println("Kotlin".firstLetter())
```

В Android extension functions часто використовують для маленьких helper-ів, але не варто ховати в них складну бізнес-логіку.

## Scope functions

Kotlin має `let`, `run`, `with`, `apply`, `also`.

`let` зручно використовувати з nullable:

```kotlin
val name: String? = "Alex"

name?.let {
    println(it.uppercase())
}
```

`apply` зручно для налаштування об'єкта:

```kotlin
val user = User(1, "Alex", "alex@mail.com").copy(
    name = "Maria"
)
```

Не зловживай scope functions. Якщо код стає важко читати через `it`, краще написати звичайні змінні.

## Coroutines коротко

Coroutines потрібні для асинхронної роботи: network, database, files, background tasks.

```kotlin
suspend fun loadUser(id: Int): User {
    return api.getUser(id)
}
```

`suspend` означає, що функція може призупинитися без блокування потоку.

В Android типовий підхід:

```kotlin
viewModelScope.launch {
    val user = repository.loadUser(id)
}
```

Базові правила:

- network/database роби не на main thread;
- у ViewModel використовуй `viewModelScope`;
- не запускай глобальні корутини без потреби;
- для stream даних використовуй `Flow`;
- UI state краще тримати як `StateFlow`.

## Flow коротко

`Flow` - потік значень у часі.

```kotlin
fun observeUsers(): Flow<List<User>> {
    return userDao.observeUsers()
}
```

В Android UI часто підписується на `StateFlow`:

```kotlin
data class UsersUiState(
    val isLoading: Boolean = false,
    val users: List<User> = emptyList(),
    val error: String? = null
)
```

Для складних станів можна використовувати `sealed class`.

## Kotlin в Android: мінімальна картина

Типовий сучасний Android-проєкт:

```text
app/
  src/main/
    AndroidManifest.xml
    java або kotlin/
      com/example/app/
        MainActivity.kt
        ui/
        data/
        domain/
        di/
    res/
```

Мінімальний `MainActivity` з Compose:

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            MaterialTheme {
                Greeting(name = "Kotlin")
            }
        }
    }
}

@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name")
}
```

## Як запускати Android-додаток

Через Android Studio:

1. Дочекайся `Gradle Sync`.
2. Обери emulator або physical device.
3. Натисни `Run`.
4. Якщо app не стартує, відкрий `Logcat`.
5. Якщо збірка падає, дивись `Build Output`, а не тільки останній рядок помилки.

Через terminal:

```bash
./gradlew assembleDebug
./gradlew installDebug
./gradlew test
./gradlew connectedAndroidTest
```

Що означають команди:

- `assembleDebug` - зібрати debug APK;
- `installDebug` - встановити debug app на підключений device/emulator;
- `test` - запустити JVM/unit тести;
- `connectedAndroidTest` - запустити instrumentation тести на device/emulator.

### Як правильно запускати Kotlin/JVM-проєкт

Для звичайного Kotlin-проєкту без Android:

1. Відкрий проєкт в IntelliJ IDEA як Gradle project.
2. Переконайся, що є `settings.gradle.kts` і `build.gradle.kts`.
3. Створи `Main.kt` з `fun main()`.
4. Запусти `main` з IDE або через Gradle.

Приклад `build.gradle.kts`:

```kotlin
plugins {
    kotlin("jvm") version "x.y.z"
    application
}

repositories {
    mavenCentral()
}

application {
    mainClass.set("MainKt")
}
```

Запуск:

```bash
./gradlew run
./gradlew test
./gradlew build
```

Якщо `./gradlew run` не працює:

- перевір, чи підключений plugin `application`;
- перевір `mainClass`;
- перевір, чи файл з `main` лежить у `src/main/kotlin`;
- відкрий Gradle errors, а не тільки console output.

### Як правильно підключати бібліотеки в Kotlin

Для Kotlin/JVM бібліотеки додаються в `build.gradle.kts`.

```kotlin
repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:x.y.z")
    testImplementation(kotlin("test"))
}
```

Краще для більших проєктів тримати версії в `gradle/libs.versions.toml`.

```toml
[versions]
coroutines = "x.y.z"

[libraries]
kotlinx-coroutines-core = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "coroutines" }
```

І потім:

```kotlin
dependencies {
    implementation(libs.kotlinx.coroutines.core)
}
```

Що означають configurations:

- `implementation` - бібліотека потрібна основному коду;
- `testImplementation` - тільки для tests;
- `runtimeOnly` - потрібна під час запуску, але не для компіляції;
- `compileOnly` - потрібна для компіляції, але не пакується в runtime.

Практичне правило: не додавай бібліотеку, якщо задача вирішується стандартною бібліотекою Kotlin. Кожна залежність додає complexity, version conflicts і потенційні security/update проблеми.

## Як краще створювати додаток

Для нового навчального Android-додатку:

1. Створи `Empty Activity`.
2. Обери Kotlin + Compose.
3. Не додавай одразу багато бібліотек.
4. Спочатку зроби один екран.
5. Потім винеси UI state.
6. Потім додай ViewModel.
7. Потім repository.
8. Потім network/database.
9. Потім navigation.
10. Потім tests.

Правильний порядок важливий: якщо почати з архітектури, DI, database і navigation одночасно, буде складно зрозуміти, де саме проблема.

## Базова структура коду

Для невеликого app:

```text
com.example.app/
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

Для більшого app краще групувати за features:

```text
com.example.app/
  core/
    network/
    database/
    ui/
  feature/
    home/
      HomeScreen.kt
      HomeViewModel.kt
      HomeUiState.kt
    profile/
      ProfileScreen.kt
      ProfileViewModel.kt
      ProfileUiState.kt
```

## Структура Kotlin-коду, щоб проєкт не розвалювався

Для Kotlin/JVM:

```text
src/
  main/
    kotlin/
      com/example/app/
        Main.kt
        feature/
        core/
        data/
        domain/
  test/
    kotlin/
      com/example/app/
```

Для Android логіка схожа:

```text
com.example.app/
  core/
    common/
    network/
    database/
  feature/
    home/
    profile/
  data/
    user/
  domain/
    model/
```

Що куди класти:

- `domain` - чисті моделі і бізнес-правила без Android UI;
- `data` - repository, API, database, cache;
- `feature` - екрани, ViewModel, UI state, screen-specific logic;
- `core` - спільні helper-и, base classes, network/database setup;
- `test` - тести, а не тимчасовий код.

Правила, які реально впливають на швидкість і лаги:

- не блокуй main thread;
- не роби network/database в UI-функціях;
- не створюй зайві mutable global objects;
- не тримай великі списки в пам'яті без потреби;
- для повільних операцій використовуй coroutines;
- для stream даних використовуй Flow;
- не перераховуй важкі значення на кожен render/recomposition;
- розділяй pure logic і platform logic, щоб pure logic легко тестувалась.

Поганий сигнал у структурі: один файл `MainActivity.kt` або `Main.kt`, де є UI, API calls, parsing, storage, navigation і business rules разом. Такий код швидко стає повільним і важким для зміни.

Краще, щоб кожен шар мав одну відповідальність:

```text
UI показує -> ViewModel керує state -> Repository дістає дані -> Data source працює з API/DB
```

## Практичні поради

- Пиши `val` частіше, ніж `var`.
- Не використовуй `!!`, якщо можна обробити null нормально.
- Для моделей використовуй `data class`.
- Для фіксованих простих опцій використовуй `enum`.
- Для UI/result/domain станів використовуй `sealed`.
- Не пиши величезні функції: краще кілька маленьких.
- Не ховай складну логіку в Composable-функціях.
- ViewModel має керувати state, але не має знати про Android UI details.
- Repository має ховати джерело даних: API, database, cache.
- Не додавай бібліотеку, якщо стандартний Kotlin або Jetpack вже вирішує задачу.
- Помилки читай зверху вниз: перша реальна помилка часто важливіша за останню.
- Після кожного маленького кроку запускай app.
- Підключай бібліотеки через Gradle усвідомлено: окремо main code, tests і Android tests.
- Для Android не роби важку роботу в Composable-функціях.
- Для великих списків використовуй lazy-підхід і pagination.
- Для чистої Kotlin-логіки пиши unit tests без Android emulator.

## Типові помилки новачків

- Плутати `val` і immutable object. `val` не дозволяє переприсвоїти змінну, але сам об'єкт може бути mutable.
- Робити все nullable: `String?`, `Int?`, `User?` без потреби.
- Використовувати `!!` замість нормальної перевірки.
- Створювати mutable collection там, де достатньо read-only.
- Писати бізнес-логіку прямо в UI.
- Створювати багато класів до того, як задача стала зрозумілою.
- Ігнорувати Gradle Sync errors.
- Запускати тільки happy path і не перевіряти error/loading стани.
- Підключати libraries навмання і потім отримувати version conflicts.
- Тримати весь код в одному файлі.
- Блокувати main thread через `runBlocking` у UI або Android-коді.
- Змішувати Kotlin business logic з Android framework там, де можна зробити чистий клас.

## Міні-шпаргалка

```kotlin
val name = "Alex"                  // read-only
var count = 0                      // mutable
val age: Int = 25                  // explicit type
val nullable: String? = null       // can be null
val length = nullable?.length ?: 0 // safe null handling

fun sum(a: Int, b: Int) = a + b

data class User(val id: Int, val name: String)

enum class Role {
    USER,
    ADMIN
}

sealed class ScreenState {
    data object Loading : ScreenState()
    data class Content(val user: User) : ScreenState()
    data class Error(val message: String) : ScreenState()
}
```

## Що вчити далі

1. Kotlin basics: functions, classes, null-safety, collections.
2. Kotlin для Android: Activity, Compose, state, ViewModel.
3. Coroutines і Flow.
4. Gradle basics.
5. Architecture: UI layer, data layer, repository.
6. Room, DataStore, Retrofit/Ktor.
7. Testing.
8. Release build і Play Console.

## Пов'язано

- [[Guides/Android/Зміст|Android: повний покроковий курс]]
- [[Guides/Android/01 - Start/02 - Android Studio SDK Gradle і перший проєкт|Android Studio SDK Gradle і перший проєкт]]
- [[Guides/Android/01 - Start/03 - Структура Android проєкту|Структура Android проєкту]]
- [[Guides/Android/04 - State Navigation and Lifecycle/02 - ViewModel StateFlow і side effects|ViewModel StateFlow і side effects]]
