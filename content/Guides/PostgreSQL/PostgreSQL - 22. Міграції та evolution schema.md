# PostgreSQL - 22. Міграції та evolution schema

## Принципи міграцій

Міграція має бути:

- versioned;
- repeatable у CI/staging;
- backward-compatible, якщо deployment rolling;
- перевірена на production-like data volume;
- з rollback або forward-fix планом.

## Безпечне додавання колонки

```sql
ALTER TABLE users ADD COLUMN timezone text;
```

Потім backfill батчами:

```sql
UPDATE users
SET timezone = 'UTC'
WHERE timezone IS NULL
LIMIT 1000;
```

У PostgreSQL `UPDATE ... LIMIT` напряму немає, тому зазвичай використовують CTE:

```sql
WITH batch AS (
  SELECT id
  FROM users
  WHERE timezone IS NULL
  LIMIT 1000
)
UPDATE users
SET timezone = 'UTC'
FROM batch
WHERE users.id = batch.id;
```

## Додавання NOT NULL

Безпечний порядок:

1. Додати nullable column.
2. Backfill.
3. Додати check constraint `NOT VALID`.
4. Validate constraint.
5. Перевести в `NOT NULL`, якщо доречно.

## Індекси в production

```sql
CREATE INDEX CONCURRENTLY users_email_idx ON users (email);
```

Не запускати `CREATE INDEX CONCURRENTLY` всередині transaction block.

## Expand-contract pattern

Для зміни schema без downtime:

1. Expand: додати нову колонку/таблицю.
2. Dual-write або backfill.
3. Перемкнути читання.
4. Contract: прибрати старе поле після стабілізації.

## Джерела

- [ALTER TABLE](https://www.postgresql.org/docs/18/sql-altertable.html)
- [CREATE INDEX](https://www.postgresql.org/docs/18/sql-createindex.html)
