---
title: "SQL JOIN простими словами: INNER, LEFT, RIGHT, FULL"
description: "SQL JOIN простими словами: розбери INNER, LEFT, RIGHT і FULL JOIN на реальних прикладах PostgreSQL та навчися не губити рядки в запитах."
category: sql
tags:
  - SQL
  - PostgreSQL
  - Бази даних
  - JOIN
  - Запити
keywords:
  - sql join
  - left join
  - inner join приклади
  - види join sql
  - sql join простими словами
  - left join приклади
  - right join sql
  - full join sql
  - join таблиць sql
date: 2026-10-20
cover: /blog/sql-join-prostymy-slovamy-inner-left-right-full-join/cover.webp
coverAlt: Дві таблиці бази даних з’єднуються спільними елементами як пазл
faq:
  - q: Що таке SQL JOIN простими словами?
    a: JOIN — це спосіб поєднати рядки з кількох таблиць за спільною умовою, найчастіше за первинним і зовнішнім ключем.
  - q: Чим INNER JOIN відрізняється від LEFT JOIN?
    a: INNER JOIN повертає лише рядки, для яких є пара в обох таблицях. LEFT JOIN повертає всі рядки з лівої таблиці, а дані з правої додає там, де є збіг. Якщо збігу немає, стовпці правої таблиці будуть NULL.
  - q: Чи варто використовувати RIGHT JOIN?
    a: RIGHT JOIN працює коректно, але на практиці його часто замінюють на LEFT JOIN, просто помінявши таблиці місцями. Так запит зазвичай легше читати.
  - q: Коли потрібен FULL JOIN?
    a: "FULL JOIN потрібен, коли треба побачити всі рядки з обох таблиць: і зі збігами, і без пари з будь-якого боку. Це корисно для звіряння даних між системами або таблицями."
  - q: Чому після LEFT JOIN зникають рядки без пари?
    a: Найчастіше причина в умові WHERE для правої таблиці. WHERE фільтрує результат після JOIN, тому рядки, де праві стовпці дорівнюють NULL, можуть не пройти фільтр. Щоб зберегти всі рядки зліва, умову для правої таблиці часто треба перенести в ON.
---

SQL `JOIN` — це спосіб поєднати рядки з кількох таблиць в один результат. Наприклад, окремо є таблиця клієнтів, окремо — таблиця замовлень. `JOIN` допомагає відповісти на запитання: «Хто що замовив?».

Найчастіше `JOIN` використовують, коли дані розкладені по нормалізованих таблицях: користувачі, замовлення, товари, категорії, платежі. Це правильно для бази даних, але для звіту, API або сторінки застосунку дані треба зібрати докупи.

Головне: різні види `JOIN` відповідають на різні запитання. `INNER JOIN` бере тільки збіги, `LEFT JOIN` зберігає всі рядки з лівої таблиці, `RIGHT JOIN` — з правої, а `FULL JOIN` показує все з обох боків.

## Ідея JOIN на простому прикладі

Уяви дві таблиці:

- `customers` — клієнти;
- `orders` — замовлення.

У таблиці `orders` є стовпець `customer_id`. Він посилається на `customers.id` і показує, хто зробив замовлення. Таку пару стовпців часто використовують в умові `JOIN`.

```sql
-- Дані для прикладів: PostgreSQL 16+
-- Спочатку видаляємо залежні таблиці, щоб скрипт можна було запускати повторно.
DROP TABLE IF EXISTS order_promotions;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS warehouse_products;
DROP TABLE IF EXISTS catalog_products;

CREATE TABLE customers (
  id integer PRIMARY KEY,
  name text NOT NULL,
  city text NOT NULL
);

CREATE TABLE orders (
  id integer PRIMARY KEY,
  customer_id integer REFERENCES customers(id),
  total numeric(10, 2) NOT NULL,
  status text NOT NULL
);

INSERT INTO customers (id, name, city) VALUES
  (1, 'Олена', 'Львів'),
  (2, 'Тарас', 'Київ'),
  (3, 'Ірина', 'Одеса'),
  (4, 'Марко', 'Харків');

INSERT INTO orders (id, customer_id, total, status) VALUES
  (101, 1, 1200.00, 'paid'),
  (102, 1, 450.00, 'new'),
  (103, 2, 980.00, 'paid'),
  (104, 3, 300.00, 'cancelled');
```

Тут Марко має профіль клієнта, але не має замовлень. Олена має два замовлення. Це важливо: `JOIN` не просто склеює таблиці, а створює рядки результату за кожним збігом.

![Дві множини рядків із перетином, який показує логіку JOIN](/blog/sql-join-prostymy-slovamy-inner-left-right-full-join/img-1.webp)

Базова форма запиту така:

```sql
SELECT стовпці
FROM ліва_таблиця
JOIN права_таблиця
  ON умова_збігу;
```

Слово «ліва» означає таблицю після `FROM`, а «права» — таблицю після `JOIN`. Це не про структуру бази, а про порядок у конкретному запиті.

> [!note] Нотатка
> У PostgreSQL запис `JOIN` без уточнення означає те саме, що й `INNER JOIN`. Для навчання та читабельності краще писати тип з’єднання явно.

## INNER JOIN: тільки ті, хто має пару

`INNER JOIN` повертає лише рядки, для яких умова збігу істинна в обох таблицях. Якщо клієнт не має замовлення — його не буде в результаті. Якщо замовлення не має відповідного клієнта — його теж не буде.

```sql
SELECT
  customers.name,
  orders.id AS order_id,
  orders.total
FROM customers
INNER JOIN orders
  ON orders.customer_id = customers.id
ORDER BY customers.id, orders.id;

-- Результат:
-- name  | order_id | total
-- Олена | 101      | 1200.00
-- Олена | 102      | 450.00
-- Тарас | 103      | 980.00
-- Ірина | 104      | 300.00
```

Марка немає, бо в нього немає замовлень. Олена з’явилася двічі, бо має два замовлення.

### Коли використовувати INNER JOIN

Використовуй `INNER JOIN`, коли тобі потрібні тільки повні пари:

1. замовлення з даними клієнта;
2. коментарі з авторами;
3. товари з категоріями, якщо товар без категорії не має значення для запиту;
4. платежі з пов’язаними рахунками.

Приклад: знайти оплачені замовлення з іменами клієнтів.

```sql
SELECT
  c.name,
  o.id AS order_id,
  o.total
FROM orders AS o
INNER JOIN customers AS c
  ON c.id = o.customer_id
WHERE o.status = 'paid'
ORDER BY o.id;

-- Результат:
-- name  | order_id | total
-- Олена | 101      | 1200.00
-- Тарас | 103      | 980.00
```

Тут використано псевдоніми `c` і `o`. Це короткі імена таблиць у межах запиту. Вони особливо корисні, коли таблиць кілька або назви стовпців повторюються.

> [!tip] Порада
> Завжди явно вказуй, з якої таблиці береш стовпець: `c.name`, `o.id`, `o.total`. Так запит легше читати, а помилок через однакові назви стовпців стає менше.

## LEFT JOIN: усі зліва, навіть без пари

`LEFT JOIN`, або `LEFT OUTER JOIN`, повертає всі рядки з лівої таблиці. Якщо у правій таблиці немає збігу, PostgreSQL заповнює стовпці правої таблиці значеннями `NULL`.

```sql
SELECT
  c.name,
  o.id AS order_id,
  o.total
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.id
ORDER BY c.id, o.id;

-- Результат:
-- name  | order_id | total
-- Олена | 101      | 1200.00
-- Олена | 102      | 450.00
-- Тарас | 103      | 980.00
-- Ірина | 104      | 300.00
-- Марко | NULL     | NULL
```

Марко залишився в результаті, хоча замовлень немає. Саме в цьому сила `LEFT JOIN`: він не губить рядки з основної таблиці.

### Коли використовувати LEFT JOIN

`LEFT JOIN` потрібен, коли ліва таблиця — головна, а права лише додає деталі.

Приклади:

- показати всіх клієнтів і кількість їхніх замовлень;
- знайти клієнтів без замовлень;
- показати всі курси, навіть якщо на деякі ще ніхто не записався;
- показати всі товари, навіть якщо вони ще не продавалися.

Знайдемо клієнтів без замовлень:

```sql
SELECT c.id, c.name
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.id
WHERE o.id IS NULL;

-- Результат:
-- id | name
-- 4  | Марко
```

Чому `IS NULL`, а не `= NULL`? У SQL `NULL` означає «невідоме значення» або «значення відсутнє». Його перевіряють через `IS NULL` / `IS NOT NULL`, а не через `=`.

Порахуємо замовлення для кожного клієнта:

```sql
SELECT
  c.name,
  COUNT(o.id) AS orders_count
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY c.id;

-- Результат:
-- name  | orders_count
-- Олена | 2
-- Тарас | 1
-- Ірина | 1
-- Марко | 0
```

Зверни увагу: `COUNT(o.id)` повертає `0` для Марка, бо рахує тільки значення, що не є `NULL`. Якби ми написали `COUNT(*)`, Марко мав би `1`, бо сам рядок після `LEFT JOIN` існує.

## RIGHT JOIN: усі справа, але рідше потрібен

`RIGHT JOIN`, або `RIGHT OUTER JOIN`, — дзеркальна версія `LEFT JOIN`. Він повертає всі рядки з правої таблиці й додає дані з лівої, якщо є збіг.

У більшості реальних запитів `RIGHT JOIN` можна переписати як `LEFT JOIN`, просто помінявши таблиці місцями. Тому його варто знати, але в командному коді частіше бачиш саме `LEFT JOIN`.

Створімо таблицю промокодів, які можуть бути прив’язані до замовлення. Один промокод ще не використано.

```sql
DROP TABLE IF EXISTS order_promotions;

CREATE TABLE order_promotions (
  id integer PRIMARY KEY,
  order_id integer REFERENCES orders(id),
  code text NOT NULL
);

INSERT INTO order_promotions (id, order_id, code) VALUES
  (1, 101, 'WELCOME'),
  (2, NULL, 'BLACK_FRIDAY');
```

Тепер покажемо всі промокоди, навіть ті, які ще не прив’язані до замовлення:

```sql
SELECT
  o.id AS order_id,
  p.code
FROM orders AS o
RIGHT JOIN order_promotions AS p
  ON p.order_id = o.id
ORDER BY p.id;

-- Результат:
-- order_id | code
-- 101      | WELCOME
-- NULL     | BLACK_FRIDAY
```

Те саме через `LEFT JOIN`, зазвичай читабельніше:

```sql
SELECT
  o.id AS order_id,
  p.code
FROM order_promotions AS p
LEFT JOIN orders AS o
  ON o.id = p.order_id
ORDER BY p.id;

-- Результат:
-- order_id | code
-- 101      | WELCOME
-- NULL     | BLACK_FRIDAY
```

> [!note] Нотатка
> `RIGHT JOIN` не гірший за `LEFT JOIN`. Просто `LEFT JOIN` легше сприймати: читаєш зліва направо й одразу бачиш головну таблицю.

## FULL JOIN: усе з обох таблиць

`FULL JOIN`, або `FULL OUTER JOIN`, повертає:

1. рядки зі збігами;
2. рядки з лівої таблиці без пари;
3. рядки з правої таблиці без пари.

Це корисно для звіряння: наприклад, коли треба порівняти дані з двох систем і знайти, що є тільки в одній із них.

![Покупці та замовлення з’єднані зв’язками, частина записів без пари](/blog/sql-join-prostymy-slovamy-inner-left-right-full-join/img-2.webp)

Для прикладу створімо дві таблиці: товари на складі та товари в каталозі сайту.

```sql
DROP TABLE IF EXISTS warehouse_products;
DROP TABLE IF EXISTS catalog_products;

CREATE TABLE warehouse_products (
  sku text PRIMARY KEY,
  quantity integer NOT NULL
);

CREATE TABLE catalog_products (
  sku text PRIMARY KEY,
  title text NOT NULL
);

INSERT INTO warehouse_products (sku, quantity) VALUES
  ('A-100', 12),
  ('B-200', 5),
  ('C-300', 0);

INSERT INTO catalog_products (sku, title) VALUES
  ('A-100', 'Навушники'),
  ('B-200', 'Клавіатура'),
  ('D-400', 'Миша');
```

Тепер подивимося, що збігається, а що є лише з одного боку:

```sql
SELECT
  COALESCE(w.sku, c.sku) AS sku,
  w.quantity,
  c.title
FROM warehouse_products AS w
FULL JOIN catalog_products AS c
  ON c.sku = w.sku
ORDER BY sku;

-- Результат:
-- sku   | quantity | title
-- A-100 | 12       | Навушники
-- B-200 | 5        | Клавіатура
-- C-300 | 0        | NULL
-- D-400 | NULL     | Миша
```

`COALESCE(w.sku, c.sku)` повертає перше значення, що не є `NULL`. Якщо товар є тільки на складі, беремо `w.sku`; якщо тільки в каталозі — `c.sku`.

Можемо одразу додати статус:

```sql
SELECT
  COALESCE(w.sku, c.sku) AS sku,
  CASE
    WHEN w.sku IS NOT NULL AND c.sku IS NOT NULL THEN 'є всюди'
    WHEN w.sku IS NOT NULL THEN 'є тільки на складі'
    ELSE 'є тільки в каталозі'
  END AS match_status
FROM warehouse_products AS w
FULL JOIN catalog_products AS c
  ON c.sku = w.sku
ORDER BY sku;

-- Результат:
-- sku   | match_status
-- A-100 | є всюди
-- B-200 | є всюди
-- C-300 | є тільки на складі
-- D-400 | є тільки в каталозі
```

## Як обрати JOIN і не загубити рядки

### Порівняння видів JOIN

| Вид JOIN | Що повертає | Коли використовувати |
|---|---|---|
| `INNER JOIN` | Лише рядки зі збігом в обох таблицях | Коли потрібні тільки повні пари |
| `LEFT JOIN` | Усі рядки з лівої таблиці + збіги справа | Коли ліва таблиця головна |
| `RIGHT JOIN` | Усі рядки з правої таблиці + збіги зліва | Рідко; часто краще переписати як `LEFT JOIN` |
| `FULL JOIN` | Усі рядки з обох таблиць | Коли треба знайти збіги й розбіжності |

Ментальна модель проста:

- `INNER` питає: «Де є пара?»
- `LEFT` питає: «Покажи всіх зліва, а пару додай, якщо є».
- `RIGHT` питає: «Покажи всіх справа, а пару додай, якщо є».
- `FULL` питає: «Покажи все, навіть без пар».

### ON і WHERE: різниця, через яку губляться рядки

Одна з найпоширеніших помилок — додати умову для правої таблиці в `WHERE` після `LEFT JOIN` і випадково перетворити запит майже на `INNER JOIN`.

Припустімо, треба показати всіх клієнтів і лише їхні оплачені замовлення. Якщо замовлень немає або вони не оплачені, клієнт усе одно має залишитися.

Небезпечний варіант:

```sql
SELECT
  c.name,
  o.id AS order_id,
  o.status
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.id
WHERE o.status = 'paid'
ORDER BY c.id;

-- Результат:
-- name  | order_id | status
-- Олена | 101      | paid
-- Тарас | 103      | paid
```

Марко зник, бо для нього `o.status` дорівнює `NULL`, а умова `o.status = 'paid'` не проходить. Ірина теж зникла, бо її замовлення скасоване.

Правильний варіант для цієї задачі — перенести умову в `ON`:

```sql
SELECT
  c.name,
  o.id AS order_id,
  o.status
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.id
 AND o.status = 'paid'
ORDER BY c.id;

-- Результат:
-- name  | order_id | status
-- Олена | 101      | paid
-- Тарас | 103      | paid
-- Ірина | NULL     | NULL
-- Марко | NULL     | NULL
```

Правило:

- умова в `ON` впливає на те, які рядки вважаються парою;
- умова в `WHERE` фільтрує вже готовий результат.

> [!pitfall] Типова помилка
> Після `LEFT JOIN` умови на стовпці правої таблиці в `WHERE` часто прибирають рядки без пари. Якщо хочеш зберегти всі рядки зліва, подумай, чи не має ця умова бути в `ON`.

### JOIN і дублювання рядків

`JOIN` не гарантує, що кількість рядків залишиться такою самою. Якщо одному рядку зліва відповідають три рядки справа, у результаті буде три рядки.

Наприклад, Олена має два замовлення:

```sql
SELECT
  c.name,
  o.id AS order_id
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.id
WHERE c.name = 'Олена'
ORDER BY o.id;

-- Результат:
-- name  | order_id
-- Олена | 101
-- Олена | 102
```

Це не помилка `JOIN`. Це правильне відображення зв’язку «один до багатьох».

Якщо тобі потрібен один рядок на клієнта, використовуй агрегацію:

```sql
SELECT
  c.name,
  SUM(o.total) AS total_spent
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY c.id;

-- Результат:
-- name  | total_spent
-- Олена | 1650.00
-- Тарас | 980.00
-- Ірина | 300.00
-- Марко | NULL
```

Для нуля замість `NULL`:

```sql
SELECT
  c.name,
  COALESCE(SUM(o.total), 0) AS total_spent
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY c.id;

-- Результат:
-- name  | total_spent
-- Олена | 1650.00
-- Тарас | 980.00
-- Ірина | 300.00
-- Марко | 0
```

### Що відбувається з NULL у ключах JOIN

Якщо умова з’єднання має вигляд `a.key = b.key`, то `NULL` не збігається навіть із `NULL`. Для SQL значення `NULL` означає невідомість, а не звичайне значення.

Саме тому промокод `BLACK_FRIDAY` з `order_id = NULL` не з’єднався з жодним замовленням. Це очікувана поведінка.

Якщо в PostgreSQL тобі справді треба вважати два `NULL` рівними в умові з’єднання, існує оператор `IS NOT DISTINCT FROM`. Але для зв’язків через первинні й зовнішні ключі зазвичай використовують звичайне `=`.

## Типові помилки

### 1. Писати JOIN без правильної умови

```sql
-- Погано: умова не пов’язує таблиці
SELECT c.name, o.id
FROM customers AS c
JOIN orders AS o
  ON true;
```

Такий запит створить комбінацію кожного клієнта з кожним замовленням. Це називають декартовим добутком. Іноді він потрібен, але майже ніколи випадково.

Правильно:

```sql
SELECT c.name, o.id
FROM customers AS c
JOIN orders AS o
  ON o.customer_id = c.id;
```

### 2. Плутати LEFT JOIN і INNER JOIN

Якщо треба знайти клієнтів без замовлень, `INNER JOIN` не допоможе, бо він уже прибрав усіх без пари.

```sql
-- Правильно для пошуку рядків без пари
SELECT c.name
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.id
WHERE o.id IS NULL;
```

### 3. Використовувати = NULL

```sql
-- Погано
WHERE o.id = NULL;

-- Добре
WHERE o.id IS NULL;
```

У SQL `NULL` не дорівнює навіть самому собі. Для нього є окремі оператори.

### 4. Не враховувати зв’язок один до багатьох

Якщо після `JOIN` рядків стало більше, спершу перевір зв’язки в даних. Можливо, один клієнт має кілька замовлень, товар має кілька тегів, а користувач — кілька ролей.

### 5. Фільтрувати праву таблицю в WHERE після LEFT JOIN

```sql
-- Часто не те, що потрібно: клієнти без paid-замовлень зникнуть
SELECT c.name, o.id
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.id
WHERE o.status = 'paid';
```

Якщо потрібно залишити всіх клієнтів, перенось фільтр на праву таблицю в `ON`.

### 6. Обирати RIGHT JOIN, коли LEFT JOIN читабельніший

Це не синтаксична помилка, але часто ускладнює підтримку запиту. Якщо можеш зробити головну таблицю лівою — зроби.

## Перевір себе

Використовуй таблиці `customers` і `orders` з початку статті.

1. Напиши запит, який показує імена клієнтів і `id` їхніх замовлень, але тільки для клієнтів із замовленнями.
2. Напиши запит, який показує всіх клієнтів і кількість їхніх оплачених замовлень. Клієнти без оплачених замовлень мають залишитися з нулем.
3. Напиши запит, який знаходить клієнтів без жодного замовлення.
4. Поясни, чому умова `WHERE o.status = 'paid'` після `LEFT JOIN` може прибрати клієнтів без замовлень.
5. Що поверне `FULL JOIN` між складом і каталогом, якщо товар є тільки в каталозі?

> [!solution]- Відповіді
> 1.
> ```sql
> SELECT c.name, o.id AS order_id
> FROM customers AS c
> INNER JOIN orders AS o
>   ON o.customer_id = c.id
> ORDER BY c.id, o.id;
> ```
>
> 2.
> ```sql
> SELECT
>   c.name,
>   COUNT(o.id) AS paid_orders_count
> FROM customers AS c
> LEFT JOIN orders AS o
>   ON o.customer_id = c.id
>  AND o.status = 'paid'
> GROUP BY c.id, c.name
> ORDER BY c.id;
> ```
>
> Результат:
>
> ```sql
> -- name  | paid_orders_count
> -- Олена | 1
> -- Тарас | 1
> -- Ірина | 0
> -- Марко | 0
> ```
>
> 3.
> ```sql
> SELECT c.name
> FROM customers AS c
> LEFT JOIN orders AS o
>   ON o.customer_id = c.id
> WHERE o.id IS NULL;
> ```
>
> 4. `WHERE` фільтрує результат після `JOIN`. Для клієнтів без замовлень стовпці `o.*` дорівнюють `NULL`, тому умова `o.status = 'paid'` не виконується, і рядок зникає.
>
> 5. Рядок залишиться в результаті. Стовпці з каталогу матимуть значення, а стовпці зі складу будуть `NULL`.

## Коротко

- `JOIN` поєднує рядки з таблиць за умовою, найчастіше через первинний і зовнішній ключ.
- `INNER JOIN` повертає тільки рядки, які мають пару в обох таблицях.
- `LEFT JOIN` зберігає всі рядки з лівої таблиці, навіть якщо справа немає збігу.
- `RIGHT JOIN` робить те саме для правої таблиці, але часто його зручніше переписати як `LEFT JOIN`.
- `FULL JOIN` показує все з обох таблиць і добре підходить для звіряння даних.
- Після `LEFT JOIN` будь обережним із `WHERE`: умови на праву таблицю можуть непомітно прибрати рядки без пари.
