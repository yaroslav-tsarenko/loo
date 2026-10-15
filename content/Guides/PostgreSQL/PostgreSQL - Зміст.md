# PostgreSQL - Зміст

> Покроковий практичний гайд по PostgreSQL: від базових понять до production, performance, security, backup, replication і типових senior-питань.

PostgreSQL часто скорочують як Postgres. Правильна офіційна назва - **PostgreSQL**.

---

## Швидкий маршрут навчання

1. [[PostgreSQL - 01. Що таке PostgreSQL та архітектура]]
2. [[PostgreSQL - 02. Встановлення та локальний старт]]
3. [[PostgreSQL - 03. psql та базова робота з БД]]
4. [[PostgreSQL - 04. SQL основи]]
5. [[PostgreSQL - 05. Типи даних]]
6. [[PostgreSQL - 06. Схеми, таблиці та constraints]]
7. [[PostgreSQL - 07. CRUD, UPSERT, COPY та RETURNING]]
8. [[PostgreSQL - 08. JOIN, агрегації, CTE та window functions]]
9. [[PostgreSQL - 09. Індекси]]
10. [[PostgreSQL - 10. EXPLAIN та оптимізація запитів]]
11. [[PostgreSQL - 11. Транзакції, MVCC та isolation levels]]
12. [[PostgreSQL - 12. Locks та concurrency]]
13. [[PostgreSQL - 13. JSONB, arrays, ranges та full-text search]]
14. [[PostgreSQL - 14. Views, materialized views, functions та triggers]]
15. [[PostgreSQL - 15. Partitioning]]
16. [[PostgreSQL - 16. Roles, privileges, RLS та security]]
17. [[PostgreSQL - 17. Backup, restore та PITR]]
18. [[PostgreSQL - 18. Replication, HA та logical decoding]]
19. [[PostgreSQL - 19. VACUUM, autovacuum та storage]]
20. [[PostgreSQL - 20. Monitoring, logs та observability]]
21. [[PostgreSQL - 21. Performance tuning]]
22. [[PostgreSQL - 22. Міграції та evolution schema]]
23. [[PostgreSQL - 23. Extensions та корисні можливості]]
24. [[PostgreSQL - 24. Production checklist]]
25. [[PostgreSQL - 25. Senior interview Q&A]]
26. [[PostgreSQL - 26. SQL шпаргалка]]

---

## Що треба знати про актуальність

- Current major version у офіційній документації: PostgreSQL 18.
- Станом на 2026-05-14 PostgreSQL опублікував patch-релізи 18.4, 17.10, 16.14, 15.18, 14.23.
- PostgreSQL 14 має EOL 2026-11-12, тому для нового production-проєкту краще планувати 16/17/18 залежно від сумісності інфраструктури.

---

## Офіційні джерела

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PostgreSQL 18 Documentation](https://www.postgresql.org/docs/18/)
- [PostgreSQL Tutorial - Getting Started](https://www.postgresql.org/docs/18/tutorial-start.html)
- [The SQL Language](https://www.postgresql.org/docs/18/sql.html)
- [Indexes](https://www.postgresql.org/docs/18/indexes.html)
- [Concurrency Control](https://www.postgresql.org/docs/18/mvcc.html)
- [Server Setup and Operation](https://www.postgresql.org/docs/18/runtime.html)
- [Release Notes](https://www.postgresql.org/docs/release/)
