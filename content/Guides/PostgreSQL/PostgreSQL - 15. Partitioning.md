# PostgreSQL - 15. Partitioning

## Що таке partitioning

Partitioning розбиває одну логічну таблицю на фізичні частини. Це допомагає з великими таблицями, архівуванням, retention, performance і maintenance.

## Range partitioning

```sql
CREATE TABLE events (
  id bigint GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz NOT NULL,
  payload jsonb NOT NULL
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2026_01
PARTITION OF events
FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

## List partitioning

```sql
CREATE TABLE invoices (
  id bigint,
  region text NOT NULL,
  total numeric(12, 2)
) PARTITION BY LIST (region);
```

## Hash partitioning

```sql
CREATE TABLE users_partitioned (
  id bigint,
  email text
) PARTITION BY HASH (id);
```

## Коли partitioning потрібен

- таблиця дуже велика;
- є природний ключ розбиття, наприклад дата;
- треба швидко видаляти старі дані;
- запити часто фільтрують по partition key;
- maintenance однієї великої таблиці став проблемою.

## Коли не потрібен

- таблиця маленька;
- немає стабільного partition key;
- проблема вирішується індексом;
- команда не готова підтримувати lifecycle partitions.

## Джерела

- [Table Partitioning](https://www.postgresql.org/docs/18/ddl-partitioning.html)
