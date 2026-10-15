# PostgreSQL - 14. Views, materialized views, functions та triggers

## View

View - збережений SQL-запит.

```sql
CREATE VIEW active_users AS
SELECT id, email, created_at
FROM users
WHERE deleted_at IS NULL;
```

## Materialized view

Materialized view зберігає результат фізично.

```sql
CREATE MATERIALIZED VIEW daily_revenue AS
SELECT date_trunc('day', paid_at) AS day, sum(total) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY 1;
```

Оновлення:

```sql
REFRESH MATERIALIZED VIEW daily_revenue;
```

Для меншого блокування:

```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_revenue;
```

## Functions

```sql
CREATE FUNCTION touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
```

## Trigger

```sql
CREATE TRIGGER users_touch_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION touch_updated_at();
```

## Senior-поради

- View покращує читабельність, але не завжди performance.
- Materialized view треба оновлювати; це cache, а не live table.
- Trigger корисний для invariants, але може приховувати side effects.
- Business logic у DB має бути контрольованою і задокументованою.

## Джерела

- [Views](https://www.postgresql.org/docs/18/sql-createview.html)
- [Materialized Views](https://www.postgresql.org/docs/18/rules-materializedviews.html)
- [PL/pgSQL](https://www.postgresql.org/docs/18/plpgsql.html)
- [Triggers](https://www.postgresql.org/docs/18/triggers.html)
