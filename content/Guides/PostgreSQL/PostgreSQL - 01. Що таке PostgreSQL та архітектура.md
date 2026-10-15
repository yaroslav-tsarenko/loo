# PostgreSQL - 01. Що таке PostgreSQL та архітектура

## Коротко

PostgreSQL - це open-source об'єктно-реляційна СУБД. Вона підтримує SQL, транзакції, MVCC, індекси, constraints, JSON/JSONB, full-text search, extensions, partitioning, replication і багато production-механізмів, які потрібні для серйозних систем.

PostgreSQL добре підходить, коли потрібні:

- консистентність даних;
- складні SQL-запити;
- транзакції;
- сильна модель constraints;
- аналітичні запити середньої складності;
- JSONB без переходу на окрему document database;
- розширюваність через extensions.

## Архітектура на високому рівні

PostgreSQL працює як server process, до якого клієнти підключаються через TCP або Unix socket. На кожне підключення створюється backend process. Дані зберігаються у data directory, а зміни журналюються у WAL.

Ключові частини:

- **client** - застосунок, psql, migration tool, ORM;
- **postmaster/main server process** - приймає підключення;
- **backend process** - обслуговує конкретне підключення;
- **shared buffers** - кеш сторінок PostgreSQL у пам'яті;
- **WAL** - write-ahead log для durability та recovery;
- **background writer/checkpointer/autovacuum** - службові процеси;
- **system catalogs** - метадані про таблиці, індекси, ролі, типи.

## Як виконується запит

1. Клієнт відправляє SQL.
2. Parser перевіряє синтаксис.
3. Analyzer зв'язує імена таблиць/колонок із catalog metadata.
4. Rewriter застосовує rules/views.
5. Planner/optimizer будує execution plan.
6. Executor виконує план.
7. Результат повертається клієнту.

## Senior-пояснення

PostgreSQL варто сприймати не як "місце, де лежать таблиці", а як окрему runtime-систему з власним планувальником, кешем, transaction engine, storage engine і security model. Більшість production-проблем виникає не через SQL сам по собі, а через неправильну модель даних, відсутність індексів, погані транзакційні межі, неврахований autovacuum або неконтрольоване зростання таблиць.

## Джерела

- [What Is PostgreSQL?](https://www.postgresql.org/docs/18/intro-whatis.html)
- [Architectural Fundamentals](https://www.postgresql.org/docs/18/tutorial-arch.html)
