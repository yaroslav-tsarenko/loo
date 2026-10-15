# PostgreSQL - 23. Extensions та корисні можливості

## Extensions

PostgreSQL можна розширювати через extensions.

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

## Корисні extensions

### pg_stat_statements

Аналітика виконання запитів.

### pg_trgm

Trigram search для fuzzy text search.

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX users_email_trgm_idx ON users USING gin (email gin_trgm_ops);
```

### btree_gin / btree_gist

Допомагають індексувати типи через GIN/GiST у складних сценаріях.

### postgres_fdw

Доступ до віддалених PostgreSQL-серверів.

### hstore

Key-value datatype. У нових системах часто замінюється JSONB, але все ще може траплятися.

### uuid-ossp / pgcrypto

Історично використовували для UUID/crypto functions. У сучасних версіях частина UUID-функціональності є builtin.

## Generated columns

```sql
CREATE TABLE people (
  first_name text NOT NULL,
  last_name text NOT NULL,
  full_name text GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED
);
```

У PostgreSQL 18 virtual generated columns стали default behavior для generated columns.

## Джерела

- [Additional Supplied Modules and Extensions](https://www.postgresql.org/docs/18/contrib.html)
- [pg_trgm](https://www.postgresql.org/docs/18/pgtrgm.html)
- [postgres_fdw](https://www.postgresql.org/docs/18/postgres-fdw.html)
