# PostgreSQL - 26. SQL шпаргалка

## Підключення

```bash
psql postgresql://user:password@localhost:5432/dbname
```

## Таблиця

```sql
CREATE TABLE users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

## Insert

```sql
INSERT INTO users (email, name)
VALUES ('a@example.com', 'Alice')
RETURNING *;
```

## Upsert

```sql
INSERT INTO users (email, name)
VALUES ('a@example.com', 'Alice')
ON CONFLICT (email)
DO UPDATE SET name = EXCLUDED.name
RETURNING *;
```

## Index

```sql
CREATE INDEX CONCURRENTLY users_created_at_idx ON users (created_at DESC);
```

## JSONB

```sql
SELECT *
FROM products
WHERE metadata @> '{"brand": "Apple"}';
```

## EXPLAIN

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM orders
WHERE user_id = 123
ORDER BY created_at DESC
LIMIT 20;
```

## Locks

```sql
SELECT pid, state, wait_event_type, wait_event, query
FROM pg_stat_activity
WHERE state <> 'idle';
```

## Table sizes

```sql
SELECT
  relname,
  pg_size_pretty(pg_total_relation_size(relid)) AS total_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
```

## Active slow queries

```sql
SELECT
  pid,
  now() - query_start AS duration,
  query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;
```
