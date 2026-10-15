# PostgreSQL - 18. Replication, HA та logical decoding

## Physical streaming replication

Streaming replication передає WAL з primary на replica.

Використання:

- read replicas;
- failover;
- disaster recovery;
- offload backups/analytics.

## Synchronous vs asynchronous

### Asynchronous

Primary не чекає replica перед commit. Швидше, але є ризик втрати останніх транзакцій при failover.

### Synchronous

Primary чекає підтвердження replica. Менший ризик втрати даних, але більша latency і залежність від replica.

## Logical replication

Logical replication передає зміни на рівні таблиць/рядків.

```sql
CREATE PUBLICATION app_pub FOR TABLE users, orders;
CREATE SUBSCRIPTION app_sub
CONNECTION 'host=primary dbname=app_db user=replicator password=secret'
PUBLICATION app_pub;
```

Використання:

- selective replication;
- zero-downtime migrations;
- data pipelines;
- CDC;
- синхронізація між major versions.

## Replication slots

Slot гарантує, що WAL не буде видалений, поки consumer його не прочитає. Якщо consumer зламався, slot може спричинити зростання WAL.

## HA

PostgreSQL сам дає replication primitives, але автоматичний HA зазвичай потребує Patroni, repmgr, cloud-managed HA або іншого orchestration layer.

## Джерела

- [High Availability, Load Balancing, and Replication](https://www.postgresql.org/docs/18/high-availability.html)
- [Logical Replication](https://www.postgresql.org/docs/18/logical-replication.html)
- [Replication Slots](https://www.postgresql.org/docs/18/warm-standby.html#STREAMING-REPLICATION-SLOTS)
