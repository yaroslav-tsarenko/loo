# PostgreSQL - 10. EXPLAIN та оптимізація запитів

## EXPLAIN

```sql
EXPLAIN
SELECT *
FROM orders
WHERE user_id = 123
ORDER BY created_at DESC
LIMIT 20;
```

## EXPLAIN ANALYZE

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM orders
WHERE user_id = 123
ORDER BY created_at DESC
LIMIT 20;
```

`ANALYZE` реально виконує запит. Для `UPDATE`/`DELETE` краще запускати в transaction і робити rollback, якщо це тільки діагностика.

## На що дивитися

- estimated rows vs actual rows;
- sequential scan чи index scan;
- nested loop/hash join/merge join;
- sort method і memory usage;
- shared hit/read buffers;
- planning time/execution time.

## Типові проблеми

### Немає індексу

Запит фільтрує по колонці, але PostgreSQL робить Seq Scan.

### Погана селективність

Індекс є, але optimizer не використовує його, бо умова повертає занадто багато рядків.

### Застаріла статистика

```sql
ANALYZE orders;
```

### N+1 query pattern

ORM робить багато дрібних запитів замість одного join/batch query.

## Senior-підхід

1. Виміряти реальний slow query.
2. Подивитись `EXPLAIN (ANALYZE, BUFFERS)`.
3. Зрозуміти cardinality і selectivity.
4. Додати або змінити index тільки під конкретний query.
5. Перевірити write overhead і розмір індексу.

## Джерела

- [Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html)
- [Performance Tips](https://www.postgresql.org/docs/18/performance-tips.html)
