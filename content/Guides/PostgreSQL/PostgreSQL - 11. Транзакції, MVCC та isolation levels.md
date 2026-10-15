# PostgreSQL - 11. Транзакції, MVCC та isolation levels

## Транзакція

Транзакція групує кілька операцій в один atomic unit.

```sql
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;
```

Якщо щось пішло не так:

```sql
ROLLBACK;
```

## ACID

- **Atomicity** - все або нічого;
- **Consistency** - constraints не порушуються;
- **Isolation** - паралельні транзакції не ламають одна одну;
- **Durability** - після commit дані переживають crash.

## MVCC

PostgreSQL використовує MVCC: читачі не блокують читачів, і зазвичай читачі не блокують писачів. Замість перезапису рядка створюється нова версія tuple, а старі версії прибирає VACUUM.

## Isolation levels

- `READ COMMITTED` - default, кожен statement бачить новий committed snapshot;
- `REPEATABLE READ` - транзакція бачить стабільний snapshot;
- `SERIALIZABLE` - найсильніша ізоляція, може кидати serialization failures.

```sql
BEGIN ISOLATION LEVEL REPEATABLE READ;
-- queries
COMMIT;
```

## Senior-пояснення

Транзакції треба робити короткими. Довга транзакція тримає старі row versions, заважає VACUUM прибирати bloat і може створювати lock contention.

## Джерела

- [Concurrency Control](https://www.postgresql.org/docs/18/mvcc.html)
- [Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html)
