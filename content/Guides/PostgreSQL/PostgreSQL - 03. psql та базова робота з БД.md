# PostgreSQL - 03. psql та базова робота з БД

## psql

`psql` - стандартний CLI-клієнт PostgreSQL. Через нього можна підключатись до БД, виконувати SQL, дивитись структуру таблиць, тестувати запити.

Підключення:

```bash
psql -h localhost -p 5432 -U app -d app_db
psql postgresql://app:secret@localhost:5432/app_db
```

## Корисні meta-команди

```text
\l              -- список баз
\c app_db       -- підключитись до бази
\dt             -- таблиці
\d users        -- структура таблиці
\dn             -- схеми
\du             -- ролі
\x              -- expanded output
\timing         -- показувати час виконання
\?              -- допомога по psql
\q              -- вихід
```

## Створення бази і користувача

```sql
CREATE ROLE app_user WITH LOGIN PASSWORD 'strong-password';
CREATE DATABASE app_db OWNER app_user;
```

## Перевірка таблиць

```sql
CREATE TABLE users (
  id bigserial PRIMARY KEY,
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO users (email) VALUES ('test@example.com');
SELECT * FROM users;
```

## Senior-порада

Навіть якщо в проєкті використовується ORM, `psql` треба знати. У production debugging часто треба швидко перевірити plan, locks, active queries, table size або privileges без UI-інструментів.

## Джерела

- [psql](https://www.postgresql.org/docs/18/app-psql.html)
