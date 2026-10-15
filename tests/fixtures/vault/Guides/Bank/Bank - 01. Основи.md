---
title: Основи
order: 1
---

# Bank — 01. Основи

## 🟢 Junior

> [!question]- Яка різниця між `==` і `===`?
> *дуже часто · порівняння* · `bk-01-001`
>
> `===` порівнює без приведення.
>
> ```js
> 0 == ''
> ```

> [!question]- Питання без id?
> *часто · теорія*
>
> Відповідь без id.

## 🔴 Senior

> [!question]- Що таке event loop?
> *іноді · теорія* · `bk-01-002`
>
> Механізм.

## Тести

> [!quiz] Що поверне `typeof null`?
> level: junior · id: bk-01-quiz-01
> - [ ] `"null"`
> - [x] `"object"`
> - [ ] `"undefined"`
>
> **Пояснення:** історичний баг.

> [!quiz] Оберіть усі falsy
> level: middle · type: multi · id: bk-01-quiz-02
> - [x] `0`
> - [x] `""`
> - [ ] `[]`

> [!quiz] Що виведе код?
> level: senior · type: output · id: bk-01-quiz-03
>
> ```js
> console.log(1)
> ```
>
> **Відповідь:** `1`

## Задачі

> [!task] Реалізуй `once`
> level: middle · difficulty: easy · id: bk-01-task-01 · tags: closures
>
> Умова задачі.
>
> > [!hint]- Підказка 1
> > Замикання.
>
> > [!hint]- Підказка 2
> > Прапорець.
>
> > [!solution]- Рішення
> > ```js
> > const once = (fn) => fn
> > ```

> [!interview] Що таке hoisting?
> level: middle
>
> Питання про підняття.
>
> ---
>
> Оголошення піднімаються.
