# PostgreSQL - 09. Індекси

## Для чого індекси

Індекс прискорює читання, але уповільнює записи і займає місце. Індекс треба створювати під реальні query patterns, а не "про всяк випадок".

## B-tree

Default index. Добре працює для equality, range, sorting.

```sql
CREATE INDEX users_email_idx ON users (email);
CREATE INDEX orders_created_at_idx ON orders (created_at DESC);
```

## Composite index

```sql
CREATE INDEX orders_user_status_created_idx
ON orders (user_id, status, created_at DESC);
```

Порядок колонок важливий. Індекс `(user_id, status)` не те саме, що `(status, user_id)`.

## Unique index

```sql
CREATE UNIQUE INDEX users_email_unique_idx ON users (lower(email));
```

## Partial index

```sql
CREATE INDEX orders_pending_idx
ON orders (created_at)
WHERE status = 'pending';
```

Добре підходить, коли часто фільтруєш маленький subset.

## Expression index

```sql
CREATE INDEX users_lower_email_idx ON users (lower(email));
```

## GIN

GIN часто використовують для JSONB, arrays, full-text search.

```sql
CREATE INDEX products_metadata_gin_idx ON products USING gin (metadata);
```

## GiST / SP-GiST / BRIN

- **GiST** - ranges, геодані через extensions, full-text scenarios.
- **SP-GiST** - спеціалізовані структури даних.
- **BRIN** - великі таблиці, де фізичний порядок корелює зі значенням, наприклад timestamp у log table.

```sql
CREATE INDEX events_created_brin_idx ON events USING brin (created_at);
```

## CONCURRENTLY

Для production:

```sql
CREATE INDEX CONCURRENTLY orders_user_id_idx ON orders (user_id);
```

Це довше, але менше блокує записи.

## Джерела

- [Indexes](https://www.postgresql.org/docs/18/indexes.html)
- [Index Types](https://www.postgresql.org/docs/18/indexes-types.html)
