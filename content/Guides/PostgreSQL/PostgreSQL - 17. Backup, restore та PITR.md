# PostgreSQL - 17. Backup, restore та PITR

## Типи backup

### Logical backup

`pg_dump` створює logical dump.

```bash
pg_dump -Fc -d app_db -f app_db.dump
pg_restore -d app_db_restored app_db.dump
```

Плюси:

- зручно для міграцій між версіями;
- можна відновлювати окремі таблиці;
- переносимо між системами.

Мінуси:

- повільніше на великих базах;
- не дає point-in-time recovery.

### Physical backup

`pg_basebackup` копіює data directory у консистентному стані.

```bash
pg_basebackup -D /backup/base -Fp -Xs -P
```

## WAL archiving

WAL потрібен для recovery. Для PITR треба base backup + archived WAL.

## PITR

Point-in-time recovery дозволяє відновити БД на конкретний момент часу перед помилкою.

Типовий сценарій:

1. Є base backup.
2. Є WAL archive.
3. Створюється новий cluster із backup.
4. PostgreSQL replay-ить WAL до target time.

## Backup policy

Production backup - це не тільки створити backup. Треба регулярно тестувати restore.

Мінімум:

- RPO/RTO визначені;
- автоматичні backups;
- WAL archiving;
- restore drill;
- monitoring backup failures;
- encryption;
- retention policy.

## Джерела

- [Backup and Restore](https://www.postgresql.org/docs/18/backup.html)
- [pg_dump](https://www.postgresql.org/docs/18/app-pgdump.html)
- [pg_basebackup](https://www.postgresql.org/docs/18/app-pgbasebackup.html)
- [Continuous Archiving and PITR](https://www.postgresql.org/docs/18/continuous-archiving.html)
