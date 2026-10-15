# PostgreSQL - 21. Performance tuning

## Performance tuning починається не з конфігів

Правильний порядок:

1. Знайти bottleneck.
2. Подивитись slow queries.
3. Перевірити indexes і execution plans.
4. Перевірити schema/model.
5. Тільки потім змінювати config.

## Важливі параметри

### shared_buffers

Кеш сторінок PostgreSQL. Часто стартова рекомендація - частина RAM, але точне значення залежить від workload і ОС.

### work_mem

Пам'ять на sort/hash operation. Це не глобальний ліміт, а може множитись на кількість операцій і підключень.

### maintenance_work_mem

Пам'ять для maintenance operations: VACUUM, CREATE INDEX.

### effective_cache_size

Підказка planner-у про те, скільки кешу доступно через PostgreSQL + OS cache.

### max_connections

Занадто багато connections шкодять. Часто потрібен connection pooler, наприклад PgBouncer.

## Connection pooling

Для web-застосунків pooling майже завжди потрібен.

Проблеми без pooling:

- багато backend processes;
- зайва пам'ять;
- context switching;
- connection storms.

## Query-level optimization

- не використовувати `SELECT *` без потреби;
- уникати N+1;
- додавати indexes під запити;
- використовувати keyset pagination;
- батчити write operations;
- контролювати transaction duration.

## Джерела

- [Performance Tips](https://www.postgresql.org/docs/18/performance-tips.html)
- [Resource Consumption](https://www.postgresql.org/docs/18/runtime-config-resource.html)
- [Query Planning](https://www.postgresql.org/docs/18/runtime-config-query.html)
