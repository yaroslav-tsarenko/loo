# PostgreSQL - 06. Схеми, таблиці та constraints

## Schema

Schema - namespace всередині database. За замовчуванням часто використовується `public`, але для великих систем краще явно організовувати схеми.

```sql
CREATE SCHEMA billing;
```

## Таблиця

```sql
CREATE TABLE billing.invoices (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id bigint NOT NULL,
  status text NOT NULL,
  total numeric(12, 2) NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now()
);
```

## Constraints

Constraints переносять бізнес-правила ближче до даних.

```sql
CREATE TABLE users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE,
  age integer CHECK (age >= 18),
  created_at timestamptz NOT NULL DEFAULT now()
);
```

Основні constraints:

- `PRIMARY KEY`
- `FOREIGN KEY`
- `UNIQUE`
- `NOT NULL`
- `CHECK`
- `EXCLUDE`

## Foreign key

```sql
CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
```

## Важливий production-нюанс

Foreign key на child table не створює автоматично index. Якщо часто шукаєш по `orders.user_id`, створи index:

```sql
CREATE INDEX orders_user_id_idx ON orders (user_id);
```

## Джерела

- [Data Definition](https://www.postgresql.org/docs/18/ddl.html)
- [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html)
- [Schemas](https://www.postgresql.org/docs/18/ddl-schemas.html)
