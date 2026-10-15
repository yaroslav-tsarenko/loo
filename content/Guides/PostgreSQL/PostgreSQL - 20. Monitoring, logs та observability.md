# PostgreSQL - 20. Monitoring, logs та observability

## Що моніторити

- availability;
- connections;
- query latency;
- slow queries;
- locks;
- deadlocks;
- replication lag;
- WAL growth;
- disk usage;
- cache hit ratio;
- autovacuum;
- bloat;
- checkpoint behavior.

## pg_stat_activity

```sql
SELECT
  pid,
  state,
  wait_event_type,
  wait_event,
  now() - query_start AS duration,
  query
FROM pg_stat_activity
WHERE state <> 'idle'
ORDER BY query_start;
```

## pg_stat_statements

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

Потім можна дивитись найважчі запити:

```sql
SELECT
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;
```

## Slow query logs

Корисні параметри:

```conf
log_min_duration_statement = 500ms
log_lock_waits = on
deadlock_timeout = 1s
```

## Production observability

Добрий production setup має:

- metrics exporter;
- dashboards;
- alerts;
- slow query analysis;
- log aggregation;
- backup monitoring;
- replication monitoring;
- capacity planning.

## Джерела

- [Monitoring Database Activity](https://www.postgresql.org/docs/18/monitoring.html)
- [Statistics Collector](https://www.postgresql.org/docs/18/monitoring-stats.html)
- [pg_stat_statements](https://www.postgresql.org/docs/18/pgstatstatements.html)
