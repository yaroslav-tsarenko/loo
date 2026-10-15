# PostgreSQL - 19. VACUUM, autovacuum та storage

## Чому потрібен VACUUM

Через MVCC PostgreSQL не перезаписує рядок напряму. UPDATE створює нову версію row, DELETE позначає row як мертвий. VACUUM прибирає dead tuples, щоб місце можна було використати повторно.

## Autovacuum

Autovacuum автоматично запускає VACUUM і ANALYZE.

Він потрібен для:

- очищення dead tuples;
- запобігання transaction ID wraparound;
- оновлення planner statistics через ANALYZE.

## Bloat

Bloat - це зайве місце у таблицях/індексах через dead tuples або неефективне оновлення.

Причини:

- багато UPDATE/DELETE;
- довгі транзакції;
- autovacuum не встигає;
- занадто слабкі autovacuum settings;
- великі bulk operations.

## VACUUM FULL

`VACUUM FULL` фізично переписує таблицю і повертає місце ОС, але бере сильний lock. У production використовувати дуже обережно.

## ANALYZE

```sql
ANALYZE orders;
```

ANALYZE оновлює статистику для planner.

## Перевірка активності

```sql
SELECT *
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC
LIMIT 20;
```

## Джерела

- [Routine Vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html)
- [VACUUM](https://www.postgresql.org/docs/18/sql-vacuum.html)
- [Monitoring Statistics](https://www.postgresql.org/docs/18/monitoring-stats.html)
