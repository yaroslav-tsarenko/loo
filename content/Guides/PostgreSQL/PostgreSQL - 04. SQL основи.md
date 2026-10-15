# PostgreSQL - 04. SQL основи

## SELECT

```sql
SELECT id, email
FROM users
WHERE active = true
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;
```

## WHERE

```sql
SELECT *
FROM orders
WHERE status = 'paid'
  AND total_amount > 100
  AND created_at >= now() - interval '30 days';
```

## INSERT

```sql
INSERT INTO users (email, name)
VALUES ('a@example.com', 'Alice')
RETURNING id, created_at;
```

## UPDATE

```sql
UPDATE users
SET name = 'Alice Cooper',
    updated_at = now()
WHERE id = 1
RETURNING *;
```

## DELETE

```sql
DELETE FROM sessions
WHERE expires_at < now();
```

## NULL

У SQL `NULL` означає відсутність значення. Його не можна коректно порівнювати через `=`.

```sql
SELECT * FROM users WHERE deleted_at IS NULL;
SELECT * FROM users WHERE deleted_at IS NOT NULL;
```

## ORDER BY і pagination

Offset pagination проста, але погано масштабується на великих таблицях:

```sql
SELECT *
FROM users
ORDER BY id
LIMIT 50 OFFSET 10000;
```

Краще keyset pagination:

```sql
SELECT *
FROM users
WHERE id > 10000
ORDER BY id
LIMIT 50;
```

## Джерела

- [The SQL Language](https://www.postgresql.org/docs/18/sql.html)
- [Queries](https://www.postgresql.org/docs/18/queries.html)
