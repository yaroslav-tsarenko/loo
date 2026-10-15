# PostgreSQL - 08. JOIN, агрегації, CTE та window functions

## JOIN

```sql
SELECT orders.id, users.email, orders.total
FROM orders
JOIN users ON users.id = orders.user_id
WHERE orders.status = 'paid';
```

Типи join:

- `INNER JOIN`
- `LEFT JOIN`
- `RIGHT JOIN`
- `FULL JOIN`
- `CROSS JOIN`
- `LATERAL JOIN`

## GROUP BY

```sql
SELECT user_id, count(*) AS orders_count, sum(total) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY user_id
HAVING sum(total) > 1000;
```

## CTE

```sql
WITH paid_orders AS (
  SELECT *
  FROM orders
  WHERE status = 'paid'
)
SELECT user_id, count(*)
FROM paid_orders
GROUP BY user_id;
```

CTE робить запит читабельнішим. У сучасному PostgreSQL optimizer часто може inline CTE, але якщо використовувати `MATERIALIZED`, це стає optimization boundary.

## Window functions

```sql
SELECT
  user_id,
  id AS order_id,
  total,
  row_number() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn
FROM orders;
```

Корисні функції:

- `row_number()`
- `rank()`
- `dense_rank()`
- `lag()`
- `lead()`
- `sum(...) OVER (...)`

## LATERAL

```sql
SELECT u.id, recent_orders.id AS last_order_id
FROM users u
LEFT JOIN LATERAL (
  SELECT id
  FROM orders o
  WHERE o.user_id = u.id
  ORDER BY created_at DESC
  LIMIT 1
) recent_orders ON true;
```

## Джерела

- [Queries](https://www.postgresql.org/docs/18/queries.html)
- [Window Functions](https://www.postgresql.org/docs/18/functions-window.html)
