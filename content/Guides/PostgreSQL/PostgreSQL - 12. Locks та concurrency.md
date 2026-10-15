# PostgreSQL - 12. Locks та concurrency

## Навіщо locks

Locks потрібні, щоб паралельні транзакції не пошкодили дані. PostgreSQL має table-level locks, row-level locks, advisory locks та внутрішні locks.

## Row-level lock

```sql
BEGIN;

SELECT *
FROM jobs
WHERE status = 'pending'
ORDER BY created_at
LIMIT 1
FOR UPDATE;

UPDATE jobs
SET status = 'processing'
WHERE id = 123;

COMMIT;
```

## SKIP LOCKED для job queue

```sql
SELECT *
FROM jobs
WHERE status = 'pending'
ORDER BY created_at
FOR UPDATE SKIP LOCKED
LIMIT 10;
```

Це дозволяє кільком workers не чекати один одного на заблокованих рядках.

## Deadlock

Deadlock виникає, коли транзакції чекають одна одну циклічно.

Профілактика:

- брати locks в однаковому порядку;
- тримати транзакції короткими;
- не робити user interaction всередині transaction;
- мати retry logic для deadlock/serialization errors.

## Перевірка активних locks

```sql
SELECT
  a.pid,
  a.query,
  l.locktype,
  l.mode,
  l.granted
FROM pg_locks l
JOIN pg_stat_activity a ON a.pid = l.pid
ORDER BY a.query_start;
```

## Джерела

- [Explicit Locking](https://www.postgresql.org/docs/18/explicit-locking.html)
- [pg_locks](https://www.postgresql.org/docs/18/view-pg-locks.html)
