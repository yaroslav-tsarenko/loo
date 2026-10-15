# PostgreSQL - 07. CRUD, UPSERT, COPY та RETURNING

## INSERT + RETURNING

```sql
INSERT INTO users (email, name)
VALUES ('alice@example.com', 'Alice')
RETURNING id, created_at;
```

`RETURNING` дозволяє одразу отримати згенеровані поля без другого запиту.

## UPDATE + RETURNING

```sql
UPDATE users
SET name = 'Alice Cooper',
    updated_at = now()
WHERE id = 1
RETURNING *;
```

## UPSERT

```sql
INSERT INTO users (email, name)
VALUES ('alice@example.com', 'Alice')
ON CONFLICT (email)
DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = now()
RETURNING *;
```

## DELETE

```sql
DELETE FROM sessions
WHERE expires_at < now()
RETURNING id;
```

## COPY

`COPY` використовується для швидкого імпорту/експорту.

```sql
COPY users(email, name)
FROM '/tmp/users.csv'
WITH (FORMAT csv, HEADER true);
```

У `psql` для локальних файлів часто використовують `\copy`, бо воно читає файл на стороні клієнта.

## Senior-поради

- Для batch insert краще один multi-row insert або COPY, а не тисячі одиночних insert.
- `ON CONFLICT` має спиратись на реальний unique constraint/index.
- Масові update/delete можуть створювати bloat; плануй VACUUM і batching.

## Джерела

- [Data Manipulation](https://www.postgresql.org/docs/18/dml.html)
- [INSERT](https://www.postgresql.org/docs/18/sql-insert.html)
- [COPY](https://www.postgresql.org/docs/18/sql-copy.html)
