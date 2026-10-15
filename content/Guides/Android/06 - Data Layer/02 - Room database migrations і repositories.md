# Room database migrations і repositories

## Ціль уроку

Навчитися зберігати structured data через Room, писати DAO, entities, migrations і repository.

## Room

Room - Jetpack persistence library над SQLite.

Основні частини:

- `@Entity`;
- `@Dao`;
- `@Database`;
- migrations;
- type converters;
- Flow queries.

## Entity

```kotlin
@Entity(tableName = "tasks")
data class TaskEntity(
    @PrimaryKey val id: String,
    val title: String,
    val isDone: Boolean
)
```

## DAO

```kotlin
@Dao
interface TaskDao {
    @Query("SELECT * FROM tasks ORDER BY title")
    fun observeAll(): Flow<List<TaskEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(task: TaskEntity)

    @Query("UPDATE tasks SET isDone = :isDone WHERE id = :id")
    suspend fun setDone(id: String, isDone: Boolean)
}
```

## Database

```kotlin
@Database(
    entities = [TaskEntity::class],
    version = 1
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun taskDao(): TaskDao
}
```

## Migrations

Коли schema змінюється, version має зростати і потрібна migration.

```kotlin
val MIGRATION_1_2 = object : Migration(1, 2) {
    override fun migrate(db: SupportSQLiteDatabase) {
        db.execSQL("ALTER TABLE tasks ADD COLUMN createdAt INTEGER NOT NULL DEFAULT 0")
    }
}
```

Не використовуй destructive migration у production без усвідомлення втрати даних.

## Repository

```kotlin
class RoomTaskRepository(
    private val dao: TaskDao
) : TaskRepository {
    override fun observeTasks(): Flow<List<Task>> {
        return dao.observeAll().map { list -> list.map { it.toDomain() } }
    }
}
```

## Вправа

1. Додай Room до task app.
2. Створи `TaskEntity`.
3. Створи `TaskDao`.
4. Підключи database.
5. Repository expose `Flow<List<Task>>`.
6. Напиши migration 1 -> 2 для нового поля.

## Типові помилки

- Database operations на main thread.
- Немає migrations.
- Entity використовується як UI model у всьому app.
- Не тестувати DAO.

## Джерела

- [Room](https://developer.android.com/training/data-storage/room)
- [Room entities](https://developer.android.com/training/data-storage/room/defining-data)
- [Room DAO](https://developer.android.com/training/data-storage/room/accessing-data)
- [Room migrations](https://developer.android.com/training/data-storage/room/migrating-db-versions)

## Далі

Переходь до [[Guides/Android/06 - Data Layer/03 - DataStore files і app storage|DataStore, files і app storage]].

