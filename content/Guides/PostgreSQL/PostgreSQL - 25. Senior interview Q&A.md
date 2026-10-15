# PostgreSQL - 25. Senior interview Q&A

## 1. Чому PostgreSQL часто обирають для production?

PostgreSQL дає сильну консистентність, транзакції, MVCC, багатий SQL, constraints, індекси, JSONB, full-text search, partitioning, extensions і зрілу replication/backup ecosystem. Для production це означає, що частину гарантій можна тримати на рівні БД, а не тільки в application code.

## 2. Що таке MVCC?

MVCC - це механізм, де PostgreSQL зберігає кілька версій рядків, щоб транзакції могли бачити консистентний snapshot без грубого блокування читачів. Це покращує concurrency, але створює dead tuples, які треба прибирати через VACUUM.

## 3. Чому довгі транзакції небезпечні?

Вони утримують старий snapshot, заважають VACUUM прибирати старі row versions, можуть збільшувати bloat і створювати lock contention. У production транзакції мають бути короткими і не включати зовнішні API calls або очікування користувача.

## 4. Як зрозуміти, який індекс потрібен?

Починаю з реального slow query і `EXPLAIN (ANALYZE, BUFFERS)`. Дивлюсь на WHERE, JOIN, ORDER BY, cardinality, selectivity. Потім створюю індекс під конкретний pattern і перевіряю, чи покращився plan без надмірного write overhead.

## 5. Чому не можна просто додати індекси на всі колонки?

Кожен індекс займає місце, уповільнює INSERT/UPDATE/DELETE і потребує maintenance. Зайві індекси можуть шкодити більше, ніж допомагати.

## 6. Що таке isolation levels?

Це рівні ізоляції транзакцій. У PostgreSQL default - READ COMMITTED. REPEATABLE READ дає стабільний snapshot у межах транзакції. SERIALIZABLE дає найсильнішу ізоляцію, але може вимагати retry через serialization failures.

## 7. Як працює UPSERT?

Через `INSERT ... ON CONFLICT ... DO UPDATE/DO NOTHING`. Він спирається на unique constraint або unique index і дозволяє атомарно вставити або оновити рядок.

## 8. Коли використовувати JSONB?

JSONB корисний для гнучких атрибутів, metadata, integration payloads. Але core relational data краще моделювати колонками і таблицями, якщо потрібні constraints, joins і часті фільтри.

## 9. Як зробити міграцію без downtime?

Використовую expand-contract: додаю нову структуру backward-compatible способом, роблю backfill батчами, перемикаю читання/запис, потім прибираю стару структуру. Індекси створюю `CONCURRENTLY`, великі locks уникаю.

## 10. Що має бути в production backup strategy?

Автоматичні backups, WAL archiving або managed PITR, encryption, retention policy, monitoring failures і регулярний restore drill. Backup без перевіреного restore - це припущення, а не гарантія.
