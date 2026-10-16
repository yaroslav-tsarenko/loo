---
title: Some, any, much, many — лічильні й нелічильні
order: 119
id: en-a1-countable
level: A1
icon: px:abacus
tags: [english, a1, grammar, countable, uncountable, quantifiers]
prerequisites: ["[[English - A1 - 18. Їжа, напої й у кафе]]", "[[English - A1 - 06. Артиклі a, an і множина іменників]]"]
estimatedMinutes: 35
---

# Some, any, much, many — лічильні й нелічильні

> [!success] Після цієї теми ти зможеш
> - відрізнити лічильні іменники (*an egg, two eggs*) від нелічильних (*water, money, advice*);
> - вибрати *some* чи *any* у ствердженні, запереченні, питанні й ввічливій пропозиції;
> - спитати *How many…?* і *How much…?* та сказати «багато» — *many, much, a lot of*;
> - порахувати нерахівне: *a bottle of water, a slice of bread, a piece of advice*.

## Передбач

> [!quiz] Яке речення правильне?
> level: A1 · id: en-a1-countable-q01
> - [ ] I need an advice.
> - [ ] I need some advices.
> - [x] I need some advice.
> - [ ] I need advices.
>
> **Пояснення:** українські «поради» — множина, а англійське *advice* — **нелічильне**: без *a / an* і без *-s*. Одну пораду кажуть *a piece of advice*.

## Лічильні й нелічильні

Англійська ділить іменники на два табори:

- **лічильні** (*countable*) — те, що можна порахувати поштучно: *an egg, two eggs, three apples, a chair, ten chairs*;
- **нелічильні** (*uncountable*) — маса, рідина, речовина чи абстрактне поняття: *water, milk, bread, rice, money, time, information*.

Нелічильний іменник поводиться як «вода» в українській: **без *a / an*, без *-s***, а дієслово після нього — в однині: *The water **is** cold.*

| | Лічильні | Нелічильні |
|---|---|---|
| приклади | *egg, apple, banana, chair, friend, euro* | *water, bread, cheese, money, advice, news* |
| *a / an* | ✓ *an egg* | ✗ ~~a water~~ |
| множина | ✓ *two eggs* | ✗ ~~two waters~~ |
| дієслово | *The eggs **are** fresh.* | *The bread **is** fresh.* |
| «скільки?» | *How **many** eggs?* | *How **much** bread?* |

Підступ для україномовних — слова, які **в нас у множині**, а в англійській нелічильні й однина:

| Українською | Англійською | Правильно |
|---|---|---|
| гроші | *money* | *My money **is** in the bag.* |
| новини | *news* | *The news **is** good.* |
| меблі | *furniture* | *The furniture **is** new.* |
| поради | *advice* | *Thanks for the advice.* |
| домашні завдання | *homework* | *I have a lot of homework.* |
| багаж | *luggage* | *Is this your luggage?* |

> [!diagram] Лічильне чи нелічильне — що змінюється
> ```yaml
> layout: compare
> columns: { c: "Лічильні — egg", u: "Нелічильні — water" }
> nodes:
>   - { id: c1, col: c, label: "один і багато", text: "an egg · two eggs", tone: blue }
>   - { id: c2, col: c, label: "скільки?", text: "How many eggs?", tone: blue }
>   - { id: c3, col: c, label: "небагато", text: "not many eggs", tone: blue }
>   - { id: u1, col: u, label: "порція", text: "some water · a glass of water", tone: mint }
>   - { id: u2, col: u, label: "скільки?", text: "How much water?", tone: mint }
>   - { id: u3, col: u, label: "небагато", text: "not much water", tone: mint }
> steps:
>   - { show: [c1, u1], note: "Яйце можна порахувати: an egg, two eggs. Воду — ні: ні a water, ні two waters. Замість цього — some water або a glass of water." }
>   - { show: [c2, u2], note: "Питаємо «скільки?»: про штуки — How many, про масу — How much." }
>   - { show: [c3, u3], note: "Те саме в запереченні: not many eggs, але not much water." }
>   - { focus: [c1, c2, c3, u1, u2, u3], note: "А some, any і a lot of підходять обом: some eggs, some water; a lot of eggs, a lot of water." }
> ```

## Some чи any

*Some* і *any* означають «трохи, кілька, якась кількість». Українською їх часто взагалі не перекладають.

| Речення | Слово | Приклад |
|---|---|---|
| ствердження (+) | ***some*** | *I've got **some** eggs. We need **some** bread.* |
| заперечення (−) | ***any*** | *I haven't got **any** eggs. We don't need **any** bread.* |
| питання (?) | ***any*** | *Have you got **any** eggs? Is there **any** milk?* |
| пропозиція, прохання | ***some*** | *Would you like **some** tea? Can I have **some** water?* |

Останній рядок — найцікавіший: у питанні-пропозиції чи проханні ми **очікуємо «так»**, тому лишаємо *some*.

> [!diagram] Some чи any — як вибрати
> ```yaml
> layout: tree
> nodes:
>   - { id: q, text: "Яке речення?", tone: gray }
>   - { id: plus, parent: q, label: "ствердження +", text: "some", note: "I need some eggs.", tone: green }
>   - { id: minus, parent: q, label: "заперечення −", text: "any", note: "I don't need any eggs.", tone: red }
>   - { id: ask, parent: q, label: "питання ?", text: "any", note: "Do you need any eggs?", tone: blue }
>   - { id: offer, parent: q, label: "пропозиція / прохання", text: "some", note: "Would you like some tea?", tone: violet }
> steps:
>   - { show: plus, note: "Стверджуємо, що щось є або потрібне, — some." }
>   - { show: minus, note: "Заперечуємо — any: don't need any, haven't got any." }
>   - { show: ask, note: "Звичайне питання — теж any: Do you need any…?" }
>   - { show: offer, note: "Але якщо пропонуємо чи просимо й чекаємо «так» — повертаємося до some: Would you like some tea? Can I have some water?" }
> ```

## Much, many, a lot of — «багато»

| Слово | З якими іменниками | Де найчастіше | Приклад |
|---|---|---|---|
| ***many*** | лічильні (множина) | −, ? | *I don't have **many** friends here. How **many** eggs?* |
| ***much*** | нелічильні | −, ? | *We don't have **much** time. How **much** money?* |
| ***a lot of*** | обидва | + (і всюди) | *She has **a lot of** friends. We have **a lot of** time.* |

У ствердженнях носії рідко кажуть ~~I have much money~~ — це звучить книжно. Природно: ***I have a lot of money.*** А *much* і *many* чудово живуть у питаннях і запереченнях.

**How many…?** — для штук: *How many apples do you want?*
**How much…?** — для маси й для **ціни**: *How much milk do we need? How much is this?* (детально про ціни — у [[English - A1 - 22. Одяг, кольори й у магазині]]).

> [!quiz] Перевір себе: «How ___ apples do you want?»
> level: A1 · id: en-a1-countable-q02
> - [x] many
> - [ ] much
> - [ ] a lot
>
> **Пояснення:** *apples* — лічильні, у множині, тому *How many*. *A lot* без *of* питання не будує.

## Як порахувати нерахівне

Нелічильне не можна порахувати поштучно, але можна порахувати **порції й упаковки**: *a + одиниця + of + іменник*.

| Одиниця | Українською | З чим |
|---|---|---|
| *a bottle of* | пляшка | *water, milk, wine* |
| *a cup of / a glass of* | чашка / склянка | *tea, coffee / water, juice* |
| *a slice of* | скибка, шматочок | *bread, pizza, cheese* |
| *a piece of* | шматок; «одна штука» | *cake, paper, advice, information* |
| *a loaf of* | буханка | *bread* |
| *a packet of* (US *a pack of*) | пачка | *biscuits, rice, tea* |
| *a kilo of* | кілограм | *potatoes, apples, meat* |
| *a tin of* (US *a can of*) | бляшанка | *tomatoes, beans, soup* |
| *a jar of* | банка (скляна) | *jam, honey, coffee* |

Множина — в одиниці: *two **bottles** of water, three **slices** of pizza*. Слово після *of* не змінюється.

## Приклади

- We need some bread and a lot of potatoes. — Нам потрібно трохи хліба й багато картоплі.
- There isn't any milk in the fridge. — У холодильнику немає молока.
- Would you like some coffee? — Yes, please! — Хочеш кави? — Так, будь ласка!
- How many brothers and sisters do you have? — Скільки в тебе братів і сестер?
- How much money do you need? — Скільки тобі потрібно грошей?
- I don't have much time today. — У мене сьогодні небагато часу.
- Can I give you a piece of advice? — Можна дам тобі одну пораду?
- The news is bad, I'm afraid. — На жаль, новини погані.
- I'd like two slices of pizza and a bottle of water. — Мені дві скибки піци й пляшку води.
- Our new furniture is from IKEA. — Наші нові меблі з IKEA.

## Слова

> [!word] money
> ipa: /ˈmʌni/ · pos: noun · level: A1 · id: en-a1-countable-w01
> uk: гроші
> example: I don't have much **money** this month. — Цього місяця в мене небагато грошей.
> note: нелічильне, однина: *My money **is** in the bank.*

> [!word] advice
> ipa: /ədˈvaɪs/ · pos: noun · level: A1 · id: en-a1-countable-w02
> uk: порада; поради
> example: Can you give me some **advice**? — Можеш дати мені пораду?
> note: нелічильне: *a piece of advice*, не ~~an advice~~. Дієслово «радити» — *advise* /ədˈvaɪz/ зі звуком «з».

> [!word] information
> ipa: /ˌɪnfəˈmeɪʃn/ · ipa-us: /ˌɪnfərˈmeɪʃn/ · pos: noun · level: A1 · id: en-a1-countable-w03
> uk: інформація; відомості
> example: I need some **information** about the hotel. — Мені потрібна інформація про готель.
> note: без *-s*: не ~~informations~~.

> [!word] news
> ipa: /njuːz/ · ipa-us: /nuːz/ · pos: noun · level: A1 · id: en-a1-countable-w04
> uk: новини; новина
> example: The **news** is good! — Новини хороші!
> note: хоч і з *-s* на кінці, це **однина**: *the news is*. Одна новина — *a piece of news*.

> [!word] homework
> ipa: /ˈhəʊmwɜːk/ · ipa-us: /ˈhoʊmwɝːk/ · pos: noun · level: A1 · id: en-a1-countable-w05
> uk: домашнє завдання
> example: We have a lot of **homework** today. — Сьогодні в нас багато домашнього завдання.
> note: нелічильне: *do your homework*, не ~~homeworks~~.

> [!word] furniture
> ipa: /ˈfɜːnɪtʃə/ · ipa-us: /ˈfɝːnɪtʃər/ · pos: noun · level: A1 · id: en-a1-countable-w06
> uk: меблі
> example: We need some new **furniture** for the kitchen. — Нам потрібні нові меблі для кухні.
> note: однина: *The furniture **is** old.* Один предмет — *a piece of furniture*.

> [!word] luggage
> ipa: /ˈlʌɡɪdʒ/ · pos: noun · level: A1 · id: en-a1-countable-w07
> uk: багаж
> example: How much **luggage** do you have? — Скільки у вас багажу?
> note: у США частіше *baggage*. Самі валізи рахуються: *two suitcases*.

> [!word] bottle
> ipa: /ˈbɒtl/ · ipa-us: /ˈbɑːtl/ · pos: noun · level: A1 · id: en-a1-countable-w08
> uk: пляшка
> example: A **bottle** of water, please. — Пляшку води, будь ласка.

> [!word] piece
> ipa: /piːs/ · pos: noun · level: A1 · id: en-a1-countable-w09
> uk: шматок; одна штука (чогось нелічильного)
> example: Would you like a **piece** of cake? — Хочеш шматочок торта?
> note: звучить так само, як *peace* (мир).

> [!word] slice
> ipa: /slaɪs/ · pos: noun · level: A1 · id: en-a1-countable-w10
> uk: скибка; тонкий шматочок
> example: Two **slices** of pizza, please. — Дві скибки піци, будь ласка.

> [!word] loaf
> ipa: /ləʊf/ · ipa-us: /loʊf/ · pos: noun · level: A1 · id: en-a1-countable-w11
> uk: буханка; батон
> example: Can you buy a **loaf** of bread? — Можеш купити буханку хліба?
> forms: loaf → loaves

> [!word] packet
> ipa: /ˈpækɪt/ · pos: noun · level: A1 · id: en-a1-countable-w12
> uk: пачка; пакет
> example: A **packet** of biscuits, please. — Пачку печива, будь ласка.
> note: у США — *pack* або *package*.

> [!word] kilo
> ipa: /ˈkiːləʊ/ · ipa-us: /ˈkiːloʊ/ · pos: noun · level: A1 · id: en-a1-countable-w13
> uk: кілограм
> example: Two **kilos** of potatoes, please. — Два кілограми картоплі, будь ласка.
> note: повне слово — *kilogram* (UK також *kilogramme*).

> [!word] tin
> ipa: /tɪn/ · pos: noun · level: A1 · id: en-a1-countable-w14
> uk: бляшанка; консервна банка
> example: We need a **tin** of tomatoes for the soup. — Для супу потрібна бляшанка помідорів.
> note: у США — *can*: *a can of tomatoes*; для напоїв і британці кажуть *a can of cola*.

> [!word] jar
> ipa: /dʒɑː/ · ipa-us: /dʒɑːr/ · pos: noun · level: A1 · id: en-a1-countable-w15
> uk: банка (скляна)
> example: There's a **jar** of honey on the shelf. — На полиці стоїть банка меду.

> [!word] some
> ipa: /sʌm/ · pos: pron · level: A1 · id: en-a1-countable-w16
> uk: трохи; кілька; якийсь
> example: I'd like **some** water, please. — Мені води, будь ласка.
> note: у реченні зазвичай слабке /səm/. Часто не перекладається.

> [!word] any
> ipa: /ˈeni/ · pos: pron · level: A1 · id: en-a1-countable-w17
> uk: якийсь; трохи (у питаннях); жодного (у запереченнях)
> example: Do you have **any** questions? — У вас є питання?
> note: читається «ЕНІ», не «ані».

> [!word] much
> ipa: /mʌtʃ/ · pos: pron · level: A1 · id: en-a1-countable-w18
> uk: багато (з нелічильними)
> example: We don't have **much** time. — У нас небагато часу.
> note: переважно в питаннях і запереченнях: *How much…? not much*.

> [!word] many
> ipa: /ˈmeni/ · pos: pron · level: A1 · id: en-a1-countable-w19
> uk: багато (з лічильними)
> example: How **many** people are in your family? — Скільки людей у твоїй родині?
> note: читається «МЕНІ», не «мані».

> [!word] a lot of
> ipa: /ə ˈlɒt əv/ · ipa-us: /ə ˈlɑːt əv/ · pos: phrase · level: A1 · id: en-a1-countable-w20
> uk: багато
> example: She drinks **a lot of** coffee. — Вона пʼє багато кави.
> note: підходить і для лічильних, і для нелічильних. У розмові — також *lots of*.

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-countable-l01
> audio: How many eggs do we need?
> - [x] How many eggs do we need?
> - [ ] How many eggs do you need?
> - [ ] How much bread do we need?

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-countable-l02
> audio: Can I have a bottle of water and two slices of pizza?
> - [ ] Can I have a glass of water and two slices of pizza?
> - [x] Can I have a bottle of water and two slices of pizza?
> - [ ] Can I have a bottle of water and two pieces of cake?

> [!listen] Надрукуй, що почуєш
> level: A1 · type: dictation · speed: slow · id: en-a1-countable-l03
> audio: Would you like some tea?

> [!listen] Надрукуй, що почуєш
> level: A1 · type: dictation · speed: slow · id: en-a1-countable-l04
> audio: I don't have any money.

> [!listen] Що НЕ потрібно купувати?
> level: A1 · type: answer · speed: slow · id: en-a1-countable-l05
> audio: A: What do we need from the shop?
> audio: B: A loaf of bread, a kilo of potatoes and six eggs. We don't need any milk — we've got a lot.
> - [ ] Хліб
> - [x] Молоко
> - [ ] Яйця

## Вимова

> [!speak] Скажи вголос
> level: A1 · id: en-a1-countable-s01
> text: Would you like some tea?
> ipa: /wʊd jə ˈlaɪk səm ˈtiː/
> tip: *would* — без «л»: «вуд». *Would you* злито: «ву-джу» або «вуд-йə». *Some* слабке — «сəм».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-countable-s02
> text: How many eggs do we need?
> ipa: /haʊ ˈmeni ˈeɡz də wi ˈniːd/
> tip: *many* — «МЕ-ні». *Eggs* закінчується на дзвінке /z/: «егз», не «екс».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-countable-s03
> text: How much money do you have?
> ipa: /haʊ ˈmʌtʃ ˈmʌni də jə ˈhæv/
> tip: *much* і *money* — однаковий короткий /ʌ/, як «а» в слові «мак».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-countable-s04
> text: Can I have a piece of cake, please?
> ipa: /kən aɪ ˈhæv ə ˈpiːs əv ˈkeɪk pliːz/
> tip: *a piece of* — «ə-ПІС-əв», *of* слабке, майже «ə».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-countable-s05
> text: Can you give me some advice?
> ipa: /kən juː ˈɡɪv mi səm ədˈvaɪs/
> tip: advice — наголос на «ВАЙС» і глухе /s/ у кінці. Зі звуком /z/ вийде дієслово *advise*.

## Типові помилки українців

> [!pitfall] «Money are», «the news are» — бо «гроші є», «новини є»
> В українській *гроші, новини, меблі* — множина. В англійській *money, news, furniture* — однина: *My money **is** here. The news **is** good. This furniture **is** new.*

> [!pitfall] «Advices», «informations», «furnitures»
> Нелічильні не мають множини. Хочеш порахувати — додай одиницю: *a piece of advice, two pieces of information, three pieces of furniture*. Або просто *some advice, a lot of information*.

> [!pitfall] «How much apples?», «many water»
> «Скільки» українською одне, а англійською два: ***How many*** + лічильні (*apples, people, days*), ***How much*** + нелічильні (*water, money, time*) і ціна. Перевір іменник: можна сказати *two …s*? Тоді *many*.

> [!pitfall] «I have any questions» — any у ствердженні
> У ствердженні майже завжди *some*: *I have **some** questions.* *Any* — для заперечення й питання: *I don't have **any** questions. Do you have **any** questions?*

## Практика

> [!quiz] «How ___ water do you drink every day?»
> level: A1 · id: en-a1-countable-q03
> - [ ] many
> - [x] much
> - [ ] lot
>
> **Пояснення:** *water* — нелічильне, тому *How much*.

> [!quiz] Заповни пропуски: some чи any
> level: A1 · type: fill · bank · id: en-a1-countable-q04
>
> ```text fill
> We need [[some]] bread, but we don't need [[any]] butter.
> Do we need [[any]] eggs?
> Would you like [[some]] coffee?
> ```
>
> **Пояснення:** ствердження — *some*, заперечення й звичайне питання — *any*, пропозиція (*Would you like…?*) — знову *some*.

> [!quiz] «The news ___ really good today!»
> level: A1 · id: en-a1-countable-q05
> - [x] is
> - [ ] are
> - [ ] be
>
> **Пояснення:** *news* — нелічильне й поводиться як однина, попри *-s* у кінці.

> [!quiz] Склади питання: «Скільки в тебе грошей?»
> level: A1 · type: order · id: en-a1-countable-q06
>
> ```text order
> How much
> money
> do you
> have?
> How many # ✗
> ```
>
> **Пояснення:** *money* — нелічильне, тому *How much*. Далі звичайне питання Present Simple: *do you have*.

> [!quiz] Заповни пропуски: порції й упаковки
> level: A1 · type: fill · bank: glass, jar · id: en-a1-countable-q07
>
> ```text fill
> a [[bottle]] of water
> two [[slices]] of pizza
> a [[loaf]] of bread
> a [[piece]] of advice
> ```
>
> **Пояснення:** множину отримує одиниця: *two slices*. Порада — завжди *a piece of advice*.

> [!quiz] Як сказати «У мене багато друзів»?
> level: A1 · id: en-a1-countable-q08
> - [x] I have a lot of friends.
> - [ ] I have much friends.
> - [ ] I have a lot friends.
> - [ ] I have many of friends.
>
> **Пояснення:** у ствердженні найприродніше *a lot of* (з *of*!). *Much* — лише для нелічильних.

> [!quiz] Які іменники нелічильні? Обери всі правильні
> level: A1 · type: multi · id: en-a1-countable-q09
> - [x] money
> - [x] advice
> - [ ] apple
> - [x] furniture
> - [ ] chair
> - [x] news
>
> **Пояснення:** *apple* і *chair* рахуються (*two apples, four chairs*). *Money, advice, furniture, news* — ні, хоч українською це «гроші, поради, меблі, новини» у множині.

> [!quiz] Склади ввічливу пропозицію: «Хочеш апельсинового соку?»
> level: A1 · type: order · id: en-a1-countable-q10
>
> ```text order
> Would you like
> some
> orange juice?
> any # ✗
> ```
>
> **Пояснення:** у пропозиції ми чекаємо «так», тому *some*, хоча це питання.

> [!quiz] Як попросити шматочок торта?
> level: A1 · id: en-a1-countable-q11
> - [x] Can I have a piece of cake, please?
> - [ ] Can I have a cake piece, please?
> - [ ] Can I have one cakes, please?
> - [ ] Can I have a slice cake, please?
>
> **Пояснення:** *a piece of cake* — шматок торта. *A cake* — цілий торт.

> [!quiz] Заповни пропуски: much чи many
> level: A1 · type: fill · bank · id: en-a1-countable-q12
>
> ```text fill
> How [[many]] children do you have?
> How [[much]] time do we have?
> We don't have [[much]] money.
> I don't have [[many]] friends here.
> ```
>
> **Пояснення:** *children, friends* — лічильні (*many*); *time, money* — нелічильні (*much*).

## Фішки

> [!reel] 💸 Гроші, які завжди в однині
> Українські «гроші», «меблі», «новини», «поради» — множина. Англійські *money, furniture, news, advice* — однина без *-s*: *The news is good. My money is in the bank.*

> [!reel] 📰 News — не «North, East, West, South»
> Популярна байка каже, що *news* — це перші літери сторін світу. Насправді це просто стара множина від *new* — «нові речі». Сьогодні *news* поводиться як однина: *The news is…*

> [!reel] 🍞 Lord — «охоронець хліба»
> Слово *lord* походить від давньоанглійського *hlāfweard* — «той, хто стереже буханку» (*hlāf* — сучасне *loaf*). А *lady* — від *hlǣfdīge*, «та, що місить хліб».

## Джерела та що почитати

- [Cambridge Dictionary — Nouns: countable and uncountable](https://dictionary.cambridge.org/grammar/british-grammar/nouns-countable-and-uncountable) — лічильні й нелічильні з прикладами.
- [Cambridge Dictionary — Some](https://dictionary.cambridge.org/grammar/british-grammar/some) і [Any](https://dictionary.cambridge.org/grammar/british-grammar/any) — коли яке слово.
- [Cambridge Dictionary — Much, many, a lot of, lots of](https://dictionary.cambridge.org/grammar/british-grammar/much-many-a-lot-of-lots-of-quantifiers) — слова кількості.
- [Cambridge Dictionary — Advice or advise?](https://dictionary.cambridge.org/grammar/british-grammar/advice-or-advise), [News](https://dictionary.cambridge.org/grammar/british-grammar/news), [Furniture](https://dictionary.cambridge.org/grammar/british-grammar/furniture) — типові пастки.
- R. Murphy — *Essential Grammar in Use*, розділи про countable / uncountable, *some / any* і *much / many*.

> [!important] Підсумок
> - Лічильні: *an egg, two eggs*. Нелічильні: *water, bread, money, advice, news* — без *a / an* і без *-s*, дієслово в однині.
> - *some* — у ствердженні, пропозиції й проханні; *any* — у запереченні й питанні.
> - *How many* + лічильні, *How much* + нелічильні (і ціна).
> - «Багато»: *a lot of* — у ствердженнях; *many / much* — переважно в питаннях і запереченнях.
> - Порції: *a bottle of water, a slice of pizza, a loaf of bread, a piece of advice*.
