# PostgreSQL - 13. JSONB, arrays, ranges та full-text search

## JSONB

```sql
CREATE TABLE products (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb
);
```

Запити:

```sql
SELECT *
FROM products
WHERE attributes ->> 'color' = 'black';

SELECT *
FROM products
WHERE attributes @> '{"brand": "Apple"}';
```

GIN index:

```sql
CREATE INDEX products_attributes_gin_idx
ON products USING gin (attributes);
```

## Arrays

```sql
SELECT *
FROM posts
WHERE tags @> ARRAY['postgresql'];
```

## Ranges

```sql
CREATE TABLE room_bookings (
  room_id bigint NOT NULL,
  during tstzrange NOT NULL,
  EXCLUDE USING gist (room_id WITH =, during WITH &&)
);
```

Це забороняє overlapping bookings для однієї кімнати.

## Full-text search

```sql
SELECT *
FROM articles
WHERE to_tsvector('english', title || ' ' || body)
      @@ plainto_tsquery('english', 'postgres indexes');
```

Індекс:

```sql
CREATE INDEX articles_search_idx
ON articles
USING gin (to_tsvector('english', title || ' ' || body));
```

## Коли не використовувати JSONB

JSONB не має замінювати реляційну модель для core domain data. Якщо по полю часто фільтрують, join-ять, валідують constraints або будують звіти, краще зробити нормальні колонки/таблиці.

## Джерела

- [JSON Functions and Operators](https://www.postgresql.org/docs/18/functions-json.html)
- [Arrays](https://www.postgresql.org/docs/18/arrays.html)
- [Range Types](https://www.postgresql.org/docs/18/rangetypes.html)
- [Full Text Search](https://www.postgresql.org/docs/18/textsearch.html)
