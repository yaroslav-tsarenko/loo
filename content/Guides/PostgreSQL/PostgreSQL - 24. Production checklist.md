# PostgreSQL - 24. Production checklist

## Перед запуском

- Вибрана підтримувана версія PostgreSQL.
- Налаштовані backups і перевірений restore.
- Є monitoring і alerts.
- Є slow query logging.
- Є connection pooling.
- Немає app user із superuser privileges.
- Налаштовані security groups/firewall.
- TLS використовується для remote connections.
- Міграції тестуються на staging.
- Є план upgrade.

## Schema

- Primary keys є в усіх core tables.
- Foreign keys додані там, де потрібна referential integrity.
- Індекси відповідають реальним query patterns.
- Немає зайвих індексів.
- Constraints описують важливі business invariants.
- Naming convention стабільний.

## Performance

- Перевірені slow queries.
- Є `EXPLAIN (ANALYZE, BUFFERS)` для критичних запитів.
- Немає N+1 у найважливіших flows.
- Pagination не ламається на великих таблицях.
- Batch jobs не блокують OLTP workload.

## Reliability

- Backup restore drill проводиться регулярно.
- WAL archiving або managed PITR увімкнено.
- Replication lag моніториться.
- Disk usage моніториться.
- Autovacuum не вимкнений.

## Security

- Least privilege.
- Secrets не лежать у repo.
- RLS або tenant scoping, якщо multi-tenant.
- Audit для критичних операцій.
- Patch updates встановлюються.

## Джерела

- [Server Setup and Operation](https://www.postgresql.org/docs/18/runtime.html)
- [Backup and Restore](https://www.postgresql.org/docs/18/backup.html)
- [Monitoring](https://www.postgresql.org/docs/18/monitoring.html)
