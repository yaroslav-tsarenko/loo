# PostgreSQL - 05. Типи даних

## Числові

- `smallint`, `integer`, `bigint`
- `numeric` / `decimal` для грошей і точних розрахунків
- `real`, `double precision` для floating point

Для ID у нових схемах часто використовують:

```sql
id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY
```

## Текст

- `text` - практичний default для рядків;
- `varchar(n)` - коли є реальне бізнес-обмеження довжини;
- `char(n)` - майже ніколи не потрібен у прикладному коді.

## Дата і час

- `timestamp` - дата/час без timezone;
- `timestamptz` - timestamp with time zone;
- `date`, `time`, `interval`.

Для production найчастіше краще `timestamptz`.

```sql
created_at timestamptz NOT NULL DEFAULT now()
```

## Boolean

```sql
active boolean NOT NULL DEFAULT true
```

## UUID

PostgreSQL має UUID type. У PostgreSQL 18 додано `uuidv7()`, який генерує timestamp-ordered UUID.

```sql
id uuid PRIMARY KEY DEFAULT uuidv7()
```

## JSON і JSONB

- `json` зберігає текст JSON;
- `jsonb` зберігає binary representation і зазвичай краще для query/index.

```sql
metadata jsonb NOT NULL DEFAULT '{}'::jsonb
```

## Arrays

```sql
tags text[] NOT NULL DEFAULT '{}'
```

Arrays корисні, але не мають замінювати нормалізовані many-to-many зв'язки, якщо треба робити складні join/query.

## Ranges

```sql
availability tstzrange
```

Range types добре підходять для бронювань, календарів, періодів дії тарифів.

## Джерела

- [Data Types](https://www.postgresql.org/docs/18/datatype.html)
- [UUID Type](https://www.postgresql.org/docs/18/datatype-uuid.html)
- [JSON Functions and Operators](https://www.postgresql.org/docs/18/functions-json.html)
