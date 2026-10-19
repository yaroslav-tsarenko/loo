---
title: Їжа, напої й у кафе
order: 118
id: en-a1-food
level: A1
icon: px:pizza
tags: [english, a1, vocabulary, food, cafe, situation]
prerequisites: ["[[English - A1 - 16. Розпорядок дня і прислівники частоти]]", "[[English - A1 - 04. Числа, вік і номер телефону]]"]
estimatedMinutes: 40
---

# Їжа, напої й у кафе

> [!success] Після цієї теми ти зможеш
> - назвати основні продукти, страви й напої англійською;
> - прочитати просте меню й зрозуміти ціни: *£3.50 — three pounds fifty*;
> - ввічливо замовити в кафе: *I'd like…, Can I have…, please?*;
> - відповісти на *Anything else?* і *Eat in or take away?* та попросити рахунок.

## Передбач

> [!quiz] Як найприродніше попросити каву в кафе?
> level: A1 · id: en-a1-food-q01
> - [ ] I want coffee.
> - [ ] Give me a coffee.
> - [x] Can I have a coffee, please?
> - [ ] Me coffee, please.
>
> **Пояснення:** *I want* і *Give me* граматично правильні, але в кафе звучать різко, майже як наказ. Англійці «загортають» прохання: *Can I have…, please?* або *I'd like…, please.*

## Продукти, страви й напої

Почнемо з того, що лежить на тарілці й у чашці. Не намагайся вивчити все за раз — спершу візьми те, що їси щодня.

| Група | Слова |
|---|---|
| основне | *bread* хліб · *butter* масло · *cheese* сир · *egg* яйце · *rice* рис · *pasta* паста, макарони |
| мʼясо й риба | *meat* мʼясо · *chicken* курка, курятина · *fish* риба |
| овочі й фрукти | *vegetables* овочі · *potato* картоплина · *tomato* помідор · *fruit* фрукти · *salad* салат |
| страви | *soup* суп · *sandwich* сендвіч · *chips* картопля фрі |
| солодке | *cake* торт, тістечко · *biscuit* печиво · *ice cream* морозиво · *sugar* цукор |
| напої | *water* вода · *coffee* кава · *tea* чай · *milk* молоко · *juice* сік |

Зверни увагу: *bread, butter, cheese, rice, meat, water, milk, sugar* англійською **не рахують** — не кажуть ~~a bread~~ чи ~~two milks~~. Про це детально в наступній темі [[English - A1 - 19. Some, any, much, many — лічильні й нелічильні]]. Поки запамʼятай: *some bread, a glass of milk, a cup of tea*.

### Британські й американські назви

| Британія | США | Українською |
|---|---|---|
| *chips* | *fries* | картопля фрі |
| *crisps* | *chips* | чипси |
| *biscuit* | *cookie* | печиво |
| *starter* | *appetizer* | закуска |
| *the bill* | *the check* | рахунок |
| *Eat in or take away?* | *For here or to go?* | Тут чи з собою? |

## Меню й ціни

Звичайне меню в британському кафе виглядає приблизно так:

| MENU | |
|---|---|
| **Starters** | Tomato soup — £4.50 · Green salad — £3.95 |
| **Main courses** | Chicken with rice — £11.00 · Fish and chips — £12.50 · Vegetarian pasta — £9.80 |
| **Desserts** | Chocolate cake — £5.20 · Ice cream — £3.00 |
| **Drinks** | Coffee — £2.80 · Tea — £2.20 · Orange juice — £2.50 · Still / sparkling water — £1.90 |

Як читати ціни вголос:

| Пишемо | Кажемо |
|---|---|
| £4.50 | *four pounds fifty* або просто *four fifty* |
| £12.99 | *twelve ninety-nine* |
| 80p | *eighty p* /piː/ або *eighty pence* |
| $3.25 | *three dollars twenty-five* або *three twenty-five* |
| €10 | *ten euros* |

Слово *and* і крапку не читаємо: £4.50 — не ~~four and fifty~~ і не ~~four point five~~.

## У кафе — фрази, які працюють

> [!diagram] Замовлення в кафе — крок за кроком
> ```yaml
> layout: flow
> nodes:
>   - { id: hi, label: "привітання", text: "A table for two, please.", tone: blue }
>   - { id: order, label: "замовлення", text: "I'd like the soup, please.", tone: violet }
>   - { id: more, label: "щось іще?", text: "Anything else? — No, thanks.", tone: yellow }
>   - { id: bill, label: "рахунок", text: "Could we have the bill, please?", tone: orange }
>   - { id: bye, label: "прощання", text: "Thank you! Bye!", tone: green }
> edges:
>   - { from: hi, to: order }
>   - { from: order, to: more }
>   - { from: more, to: bill }
>   - { from: bill, to: bye }
> steps:
>   - { focus: hi, note: "Заходиш і кажеш, скільки вас: A table for two, please. У кафе біля стійки цей крок пропускають." }
>   - { focus: order, note: "Замовляєш: I'd like… або Can I have…? І обовʼязково please." }
>   - { focus: more, note: "Офіціант питає Anything else? Нічого не треба — No, thanks / That's all, thanks." }
>   - { focus: bill, note: "Просиш рахунок: Could we have the bill, please? У США — the check." }
>   - { focus: bye, note: "Дякуєш і прощаєшся. Thank you — найчастіші слова в будь-якому кафе." }
> ```

| Хто | Фраза | Що означає |
|---|---|---|
| офіціант | *Are you ready to order?* | Готові замовити? |
| ти | *I'd like the chicken, please.* | Я б хотів курку, будь ласка. |
| ти | *Can I have a glass of water, please?* | Можна мені склянку води? |
| офіціант | *Still or sparkling?* | Негазована чи газована? |
| офіціант | *Anything else?* | Щось іще? |
| ти | *No, thanks. That's all.* | Ні, дякую. Це все. |
| офіціант (у кавʼярні) | *Eat in or take away?* | Тут чи з собою? |
| ти | *Could we have the bill, please?* | Можна рахунок? |

***I'd like*** — це скорочення від *I would like*, «я б хотів». Після нього — іменник: *I'd like **a coffee**.* Не плутай з *I like coffee* — «я люблю каву» взагалі, а не прямо зараз.

> [!quiz] Перевір себе: «Рахунок, будь ласка» в британському ресторані
> level: A1 · id: en-a1-food-q02
> - [ ] The account, please.
> - [x] The bill, please.
> - [ ] The score, please.
> - [ ] The count, please.
>
> **Пояснення:** рахунок у ресторані — *the bill* (у США — *the check*). *Account* — це банківський рахунок або акаунт.

## Приклади

- I'd like a cup of tea with milk, please. — Мені, будь ласка, чашку чаю з молоком.
- Can I have the tomato soup and a green salad? — Можна мені томатний суп і зелений салат?
- Is the fish fresh today? — Риба сьогодні свіжа?
- I'm a vegetarian. I don't eat meat or fish. — Я вегетаріанка. Я не їм мʼяса й риби.
- This chocolate cake is delicious! — Цей шоколадний торт дуже смачний!
- We usually have a light meal in the evening. — Увечері ми зазвичай їмо щось легке.
- Two coffees and one orange juice, please. — Дві кави й один апельсиновий сік, будь ласка.
- The main course is twelve pounds fifty. — Основна страва коштує дванадцять фунтів пʼятдесят.
- What would you like for dessert? — Що бажаєте на десерт?
- Could we have the bill, please? — Можна нам рахунок, будь ласка?

## Слова

> [!word] bread
> ipa: /bred/ · pos: noun · level: A1 · id: en-a1-food-w01
> uk: хліб
> example: Can I have some **bread**, please? — Можна мені трохи хліба?
> note: не рахується: *some bread, a loaf of bread*, не ~~a bread~~.

> [!word] butter
> ipa: /ˈbʌtə/ · ipa-us: /ˈbʌtər/ · pos: noun · level: A1 · id: en-a1-food-w02
> uk: вершкове масло
> example: I have toast with **butter** for breakfast. — На сніданок я їм тост з маслом.
> note: олія — *oil*.

> [!word] cheese
> ipa: /tʃiːz/ · pos: noun · level: A1 · id: en-a1-food-w03
> uk: сир (твердий)
> example: A **cheese** sandwich, please. — Сендвіч із сиром, будь ласка.
> note: кисломолочний сир — *cottage cheese*.

> [!word] egg
> ipa: /eɡ/ · pos: noun · level: A1 · id: en-a1-food-w04
> uk: яйце
> example: I eat two **eggs** every morning. — Я щоранку зʼїдаю два яйця.

> [!word] meat
> ipa: /miːt/ · pos: noun · level: A1 · id: en-a1-food-w05
> uk: мʼясо
> example: I don't eat **meat**. — Я не їм мʼяса.
> note: звучить так само, як *meet* (зустрічати).

> [!word] chicken
> ipa: /ˈtʃɪkɪn/ · pos: noun · level: A1 · id: en-a1-food-w06
> uk: курка; курятина
> example: I'd like the **chicken** with rice. — Мені курку з рисом.

> [!word] fish
> ipa: /fɪʃ/ · pos: noun · level: A1 · id: en-a1-food-w07
> uk: риба
> example: We often have **fish** on Fridays. — Ми часто їмо рибу по пʼятницях.
> forms: one fish → two fish

> [!word] rice
> ipa: /raɪs/ · pos: noun · level: A1 · id: en-a1-food-w08
> uk: рис
> example: Chicken with **rice**, please. — Курку з рисом, будь ласка.

> [!word] pasta
> ipa: /ˈpæstə/ · ipa-us: /ˈpɑːstə/ · pos: noun · level: A1 · id: en-a1-food-w09
> uk: паста; макарони
> example: The kids love **pasta** with cheese. — Діти обожнюють пасту з сиром.

> [!word] potato
> ipa: /pəˈteɪtəʊ/ · ipa-us: /pəˈteɪtoʊ/ · pos: noun · level: A1 · id: en-a1-food-w10
> uk: картоплина; картопля
> example: Do you want some **potatoes**? — Хочеш картоплі?
> forms: potato → potatoes

> [!word] tomato
> ipa: /təˈmɑːtəʊ/ · ipa-us: /təˈmeɪtoʊ/ · pos: noun · level: A1 · id: en-a1-food-w11
> uk: помідор
> example: **Tomato** soup is my favourite. — Томатний суп — мій улюблений.
> forms: tomato → tomatoes
> note: британці кажуть «тə-МА-тəу», американці — «тə-МЕЙ-тоу».

> [!word] vegetables
> ipa: /ˈvedʒtəblz/ · pos: noun · level: A1 · id: en-a1-food-w12
> uk: овочі
> example: Eat more **vegetables**! — Їж більше овочів!
> note: три склади, а не чотири: «ВЕДЖ-тə-блз». Розмовне скорочення — *veg* або *veggies*.

> [!word] fruit
> ipa: /fruːt/ · pos: noun · level: A1 · id: en-a1-food-w13
> uk: фрукти; плід
> example: I have **fruit** for dessert. — На десерт я їм фрукти.
> note: зазвичай без множини: *a lot of fruit*. *ui* читається як «у»: «фрут».

> [!word] salad
> ipa: /ˈsæləd/ · pos: noun · level: A1 · id: en-a1-food-w14
> uk: салат (страва)
> example: A green **salad**, please. — Зелений салат, будь ласка.

> [!word] soup
> ipa: /suːp/ · pos: noun · level: A1 · id: en-a1-food-w15
> uk: суп
> example: The **soup** is very hot. — Суп дуже гарячий.
> note: читається «суп», не «соуп». Суп англійці не пʼють, а їдять: *have / eat soup*.

> [!word] sandwich
> ipa: /ˈsænwɪtʃ/ · pos: noun · level: A1 · id: en-a1-food-w16
> uk: сендвіч; бутерброд
> example: I usually have a **sandwich** for lunch. — На обід я зазвичай їм сендвіч.
> note: *d* майже не чути: «СЕН-віч».

> [!word] chips
> ipa: /tʃɪps/ · pos: noun · level: A1 · id: en-a1-food-w17
> uk: картопля фрі (UK)
> example: Fish and **chips**, please. — Рибу з картоплею фрі, будь ласка.
> note: у США картопля фрі — *fries*, а *chips* — чипси. Британські чипси — *crisps*.

> [!word] cake
> ipa: /keɪk/ · pos: noun · level: A1 · id: en-a1-food-w18
> uk: торт; тістечко
> example: Would you like a piece of **cake**? — Хочеш шматочок торта?

> [!word] biscuit
> ipa: /ˈbɪskɪt/ · pos: noun · level: A1 · id: en-a1-food-w19
> uk: печиво
> example: Tea and **biscuits** — a very British snack. — Чай із печивом — дуже британський перекус.
> note: у США — *cookie*. *u* не читається: «БІС-кіт».

> [!word] ice cream
> ipa: /ˌaɪs ˈkriːm/ · pos: noun · level: A1 · id: en-a1-food-w20
> uk: морозиво
> example: Two **ice creams**, please — chocolate and vanilla. — Два морозива, будь ласка: шоколадне й ванільне.

> [!word] sugar
> ipa: /ˈʃʊɡə/ · ipa-us: /ˈʃʊɡər/ · pos: noun · level: A1 · id: en-a1-food-w21
> uk: цукор
> example: Coffee with milk and no **sugar**. — Кава з молоком без цукру.
> note: починається зі звуку «ш»: «ШУ-гə».

> [!word] water
> ipa: /ˈwɔːtə/ · ipa-us: /ˈwɑːtər/ · pos: noun · level: A1 · id: en-a1-food-w22
> uk: вода
> example: A glass of **water**, please. — Склянку води, будь ласка.
> note: перший звук — /w/, губи трубочкою, не «в»: «ВО-тə».

> [!word] coffee
> ipa: /ˈkɒfi/ · ipa-us: /ˈkɑːfi/ · pos: noun · level: A1 · id: en-a1-food-w23
> uk: кава
> example: Two **coffees**, please. — Дві кави, будь ласка.
> note: як напій — не рахується (*I drink coffee*), але в кафе кажуть *a coffee, two coffees* — тобто чашки.

> [!word] tea
> ipa: /tiː/ · pos: noun · level: A1 · id: en-a1-food-w24
> uk: чай
> example: Do you take milk in your **tea**? — Ви пʼєте чай з молоком?

> [!word] milk
> ipa: /mɪlk/ · pos: noun · level: A1 · id: en-a1-food-w25
> uk: молоко
> example: Is there any **milk** in the fridge? — У холодильнику є молоко?

> [!word] juice
> ipa: /dʒuːs/ · pos: noun · level: A1 · id: en-a1-food-w26
> uk: сік
> example: An orange **juice**, please. — Апельсиновий сік, будь ласка.

> [!word] sparkling
> ipa: /ˈspɑːklɪŋ/ · ipa-us: /ˈspɑːrklɪŋ/ · pos: adj · level: A1 · id: en-a1-food-w27
> uk: газований (про воду)
> example: Still or **sparkling** water? — Вам негазовану чи газовану воду?
> note: негазована — *still water*.

> [!word] meal
> ipa: /miːl/ · pos: noun · level: A1 · id: en-a1-food-w28
> uk: прийом їжі; страва
> example: Breakfast is the most important **meal** of the day. — Сніданок — найважливіший прийом їжі за день.
> note: *Enjoy your meal!* — Смачного!

> [!word] snack
> ipa: /snæk/ · pos: noun · level: A1 · id: en-a1-food-w29
> uk: перекус
> example: I have a **snack** at four o'clock. — О четвертій я перекушую.

> [!word] menu
> ipa: /ˈmenjuː/ · pos: noun · level: A1 · id: en-a1-food-w30
> uk: меню
> example: Can I see the **menu**, please? — Можна меню?
> note: наголос на першому складі: «МЕН-ю».

> [!word] waiter
> ipa: /ˈweɪtə/ · ipa-us: /ˈweɪtər/ · pos: noun · level: A1 · id: en-a1-food-w31
> uk: офіціант
> example: The **waiter** brings the menu. — Офіціант приносить меню.
> note: офіціантка — *waitress*; нейтральне слово, особливо в США, — *server*.

> [!word] bill
> ipa: /bɪl/ · pos: noun · level: A1 · id: en-a1-food-w32
> uk: рахунок (у ресторані)
> example: Could we have the **bill**, please? — Можна нам рахунок?
> note: у США — *the check*.

> [!word] starter
> ipa: /ˈstɑːtə/ · ipa-us: /ˈstɑːrtər/ · pos: noun · level: A1 · id: en-a1-food-w33
> uk: закуска (перед основною стравою)
> example: For a **starter**, I'd like the soup. — На закуску я візьму суп.
> note: у США — *appetizer*.

> [!word] main course
> ipa: /ˌmeɪn ˈkɔːs/ · ipa-us: /ˌmeɪn ˈkɔːrs/ · pos: noun · level: A1 · id: en-a1-food-w34
> uk: основна страва
> example: For my **main course**, the fish, please. — На основну страву — рибу, будь ласка.

> [!word] dessert
> ipa: /dɪˈzɜːt/ · ipa-us: /dɪˈzɝːt/ · pos: noun · level: A1 · id: en-a1-food-w35
> uk: десерт
> example: What would you like for **dessert**? — Що бажаєте на десерт?
> note: дві *s* і наголос у кінці: «ді-ЗЕРТ». *Desert* /ˈdezət/ з однією *s* — пустеля.

> [!word] cup
> ipa: /kʌp/ · pos: noun · level: A1 · id: en-a1-food-w36
> uk: чашка
> example: A **cup** of tea, please. — Чашку чаю, будь ласка.

> [!word] glass
> ipa: /ɡlɑːs/ · ipa-us: /ɡlæs/ · pos: noun · level: A1 · id: en-a1-food-w37
> uk: склянка; келих; скло
> example: A **glass** of orange juice, please. — Склянку апельсинового соку, будь ласка.

> [!word] delicious
> ipa: /dɪˈlɪʃəs/ · pos: adj · level: A1 · id: en-a1-food-w38
> uk: дуже смачний
> example: This soup is **delicious**! — Цей суп неймовірно смачний!
> note: простіше — *It's really good* або *It's tasty*.

> [!word] vegetarian
> ipa: /ˌvedʒəˈteəriən/ · ipa-us: /ˌvedʒəˈteriən/ · pos: noun · level: A1 · id: en-a1-food-w39
> uk: вегетаріанець; вегетаріанка; вегетаріанський
> example: I'm a **vegetarian**. — Я вегетаріанець.
> note: про людину — *a vegetarian*, не ~~I'm vegetables~~. Веган — *a vegan* /ˈviːɡən/.

> [!word] I'd like…
> ipa: /aɪd ˈlaɪk/ · pos: phrase · level: A1 · id: en-a1-food-w40
> uk: Я б хотів (хотіла)…
> example: **I'd like** a coffee and a cheese sandwich, please. — Я б хотів каву й сендвіч із сиром, будь ласка.
> note: *I'd = I would*. Ввічливіше, ніж *I want*.

> [!word] Can I have…?
> ipa: /kən aɪ ˈhæv/ · pos: phrase · level: A1 · id: en-a1-food-w41
> uk: Можна мені…?
> example: **Can I have** the menu, please? — Можна мені меню?
> note: ще ввічливіше — *Could I have…?*

> [!word] Anything else?
> ipa: /ˈeniθɪŋ ˈels/ · pos: phrase · level: A1 · id: en-a1-food-w42
> uk: Щось іще?
> example: **Anything else?** — No, thanks. That's all. — Щось іще? — Ні, дякую. Це все.

> [!word] Eat in or take away?
> ipa: /iːt ˈɪn ɔː teɪk əˈweɪ/ · ipa-us: /iːt ˈɪn ɔːr teɪk əˈweɪ/ · pos: phrase · level: A1 · id: en-a1-food-w43
> uk: Тут чи з собою?
> example: **Eat in or take away?** — Take away, please. — Тут чи з собою? — З собою, будь ласка.
> note: у США — *For here or to go?* Їжа з собою: UK *takeaway*, US *takeout*.

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-food-l01
> audio: Can I have a cup of tea, please?
> - [x] Can I have a cup of tea, please?
> - [ ] Can I have a cup of coffee, please?
> - [ ] Can I have a glass of tea, please?

> [!listen] Скільки треба заплатити?
> level: A1 · type: choice · speed: slow · id: en-a1-food-l02
> audio: That's four pounds fifty, please.
> - [ ] £4.15
> - [x] £4.50
> - [ ] £14.50

> [!listen] Напиши або скажи, що почуєш
> level: A1 · type: dictation · speed: slow · id: en-a1-food-l03
> audio: I'd like the chicken soup, please.

> [!listen] Напиши або скажи, що почуєш
> level: A1 · type: dictation · speed: slow · id: en-a1-food-l04
> audio: Could we have the bill, please?

> [!listen] Скільки коштує салат?
> level: A1 · type: answer · speed: slow · id: en-a1-food-l05
> audio: The fish is twelve pounds, and the salad is six fifty.
> - [ ] £12
> - [x] £6.50
> - [ ] £6.15

## Вимова

> [!speak] Скажи вголос
> level: A1 · id: en-a1-food-s01
> text: I'd like a glass of water, please.
> ipa: /aɪd ˈlaɪk ə ˈɡlɑːs əv ˈwɔːtə pliːz/
> tip: *I'd* — коротке «айд», *d* ледь чутно. *A glass of* — «ə-ГЛАС-əв», *of* слабке.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-food-s02
> text: Can I have the bill, please?
> ipa: /kən aɪ ˈhæv ðə ˈbɪl pliːz/
> tip: *can* тут слабке — «кəн». Наголошені слова — have і bill.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-food-s03
> text: Sparkling water, please.
> ipa: /ˈspɑːklɪŋ ˈwɔːtə pliːz/
> tip: у кінці — носове /ŋ/ без «г»: не «спарклінг», а приблизно «СПАК-лін».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-food-s04
> text: I'm a vegetarian. I don't eat meat.
> ipa: /aɪm ə ˌvedʒəˈteəriən aɪ dəʊnt iːt ˈmiːt/
> tip: наголос на «ТЕ»: «ве-джə-ТЕ-рі-əн». *Eat meat* — два довгі /iː/.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-food-s05
> text: This cake is delicious!
> ipa: /ðɪs ˈkeɪk ɪz dɪˈlɪʃəs/
> tip: *this* — язик між зубами /ð/, не «зіс». Delicious — «ді-ЛІ-шəс».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-food-s06
> text: A coffee with milk and no sugar, please.
> ipa: /ə ˈkɒfi wɪð ˈmɪlk ən nəʊ ˈʃʊɡə pliːz/
> tip: *sugar* — «ШУ-гə», з «ш» на початку. *And* звучить як коротке «əн».

## Типові помилки українців

> [!pitfall] «I want a coffee», «Give me…» — занадто прямо
> Українське «Дайте каву» в кафе — норма. Англійською *Give me a coffee* чи *I want a coffee* звучать як вимога. Кажи *Can I have…?*, *Could I have…?* або *I'd like…* — і не забувай ***please***: в англійській воно потрібне майже в кожному проханні.

> [!pitfall] «The account, please» — хибний рахунок
> Рахунок у ресторані — ***the bill*** (US *the check*). *Account* — банківський рахунок, акаунт у застосунку. А *score* — рахунок у грі.

> [!pitfall] «A bread», «two milks», «breads» — рахуємо нелічильне
> *Bread, butter, cheese, rice, meat, sugar, milk, water* в англійській — як «вода» в українській: їх не рахують поштучно. *Some bread, a loaf of bread, a glass of milk.* Детально — у [[English - A1 - 19. Some, any, much, many — лічильні й нелічильні]].

> [!pitfall] «I'm vegetables» замість «I'm a vegetarian»
> *Vegetables* — овочі, *vegetarian* — людина, яка не їсть мʼяса. І артикль: *I'm **a** vegetarian.*

## Ситуація: у кавʼярні

> [!listen] Послухай діалог. Що й як замовляє клієнт?
> level: A1 · type: answer · speed: slow · id: en-a1-food-l06
> audio: A: Hi! What can I get you?
> audio: B: Can I have a cappuccino and a cheese sandwich, please?
> audio: A: Sure. Eat in or take away?
> audio: B: Take away, please.
> audio: A: Anything else?
> audio: B: No, thanks. How much is that?
> audio: A: That's seven pounds twenty.
> - [x] Капучино й сендвіч із сиром, з собою, за £7.20
> - [ ] Капучино й сендвіч із сиром, у кавʼярні, за £7.20
> - [ ] Чай і сендвіч із сиром, з собою, за £2.70

Тепер ти — клієнт. Скажи свої репліки вголос:

> [!speak] «Можна мені капучино й сендвіч із сиром?»
> level: A1 · id: en-a1-food-s07
> text: Can I have a cappuccino and a cheese sandwich, please?
> ipa: /kən aɪ ˈhæv ə ˌkæpəˈtʃiːnəʊ ən ə ˈtʃiːz ˈsænwɪtʃ pliːz/
> tip: cappuccino — «ке-пə-ЧІ-ноу», наголос на «ЧІ». *Cheese* — довге /iː/ і дзвінке /z/ в кінці.

> [!speak] «З собою, будь ласка. Скільки з мене?»
> level: A1 · id: en-a1-food-s08
> text: Take away, please. How much is that?
> ipa: /teɪk əˈweɪ pliːz haʊ ˈmʌtʃ ɪz ˈðæt/
> tip: *How much is that?* — наголос на *much* і *that*, тон униз у кінці.

## Практика

> [!quiz] Заповни пропуски: розмова з офіціантом
> level: A1 · type: fill · bank: want, other · id: en-a1-food-q03
>
> ```text fill
> Waiter: Are you ready to [[order]]?
> You:    Yes. I'd [[like]] the fish, please.
> Waiter: Anything [[else]]?
> You:    A glass of [[water]], please.
> ```
>
> **Пояснення:** *ready to order* — готові замовити; *I'd like* — ввічливе «я б хотів»; *Anything else?* — «щось іще?».

> [!quiz] Як прочитати ціну £3.50?
> level: A1 · id: en-a1-food-q04
> - [x] three pounds fifty
> - [ ] three and fifty pounds
> - [ ] three point five pounds
> - [ ] three pounds and fifty pences
>
> **Пояснення:** фунти, потім пенси без *and*: *three pounds fifty* або просто *three fifty*.

> [!quiz] Склади прохання: «Можна мені чашку чаю, будь ласка?»
> level: A1 · type: order · id: en-a1-food-q05
>
> ```text order
> Can I
> have
> a cup of
> tea, please?
> want # ✗
> ```
>
> **Пояснення:** *Can I have…?* — найуживаніша ввічлива форма прохання. *Want* тут зайве.

> [!quiz] «Що бажаєте на ___?» — обери правильне слово
> level: A1 · id: en-a1-food-q06
> - [x] What would you like for dessert?
> - [ ] What would you like for desert?
> - [ ] What would you like for disert?
>
> **Пояснення:** солодке після обіду — *dessert* (дві *s*, наголос у кінці). *Desert* — пустеля.

> [!quiz] Заповни пропуски: британське слово → американське
> level: A1 · type: fill · bank: candy, cracker · id: en-a1-food-q07
>
> ```text fill
> chips    →  [[fries]]
> biscuit  →  [[cookie]]
> the bill →  the [[check]]
> ```
>
> **Пояснення:** британські *chips* в Америці — *fries*, *biscuit* — *cookie*, а рахунок — *the check*.

> [!quiz] Бариста питає: «Eat in or take away?» Що це означає?
> level: A1 · id: en-a1-food-q08
> - [ ] Їсти будете зараз чи пізніше?
> - [x] Будете їсти тут чи візьмете з собою?
> - [ ] Вам щось іще?
> - [ ] Ви готові замовити?
>
> **Пояснення:** *eat in* — їсти в закладі, *take away* — забрати з собою. Американський варіант — *For here or to go?*

> [!quiz] Склади речення: «Можна нам рахунок, будь ласка?»
> level: A1 · type: order · id: en-a1-food-q09
>
> ```text order
> Could we
> have
> the bill,
> please?
> the account # ✗
> ```
>
> **Пояснення:** *Could we have…?* — ще ввічливіше, ніж *Can we have…?* Рахунок — *the bill*.

> [!quiz] Як сказати «Я не їм мʼяса — я вегетаріанка»?
> level: A1 · id: en-a1-food-q10
> - [ ] I don't eat meat. I'm vegetables.
> - [x] I don't eat meat. I'm a vegetarian.
> - [ ] I don't eat a meat. I'm vegetarian food.
> - [ ] I'm not eat meat. I'm a vegetarian.
>
> **Пояснення:** *vegetarian* — людина, *vegetables* — овочі. *Meat* без артикля (не рахується), а заперечення — *I don't eat*, не ~~I'm not eat~~.

## Фішки

> [!reel] 🍟 Chips у Лондоні й Нью-Йорку
> Замов *chips* у Лондоні — отримаєш картоплю фрі. У Нью-Йорку — пакетик чипсів. Британські чипси — *crisps*, американська картопля фрі — *fries*.

> [!reel] 🥪 Граф Сендвіч і його бутерброд
> За популярною легендою, у XVIII столітті граф Сендвіч не хотів відриватися від картярського столу й попросив мʼясо між двома скибками хліба. Так страва отримала його титул.

> [!reel] 💷 Чайові: Лондон проти Нью-Йорка
> У британському ресторані часто вже є *service charge* близько 12,5 % у рахунку — перевір, перш ніж додавати чайові. У США чайові 15–20 % — фактично частина ціни.

## Джерела та що почитати

- [Cambridge Dictionary — Please and thank you](https://dictionary.cambridge.org/grammar/british-grammar/please-and-thank-you) — коли й де ставити *please*.
- [Cambridge Dictionary — Requests](https://dictionary.cambridge.org/grammar/british-grammar/requests) — як просити ввічливо.
- [Oxford Learner's Dictionaries](https://www.oxfordlearnersdictionaries.com/) — вимова UK / US кожного слова з аудіо.
- [BBC Learning English](https://www.bbc.co.uk/learningenglish) — короткі сценки в кафе й ресторані.

> [!important] Підсумок
> - Їжа й напої: *bread, cheese, chicken, fish, rice, soup, salad, cake; water, coffee, tea, milk, juice*.
> - Багато продуктів не рахуються: *some bread, a glass of milk, a cup of tea*.
> - Ввічливе замовлення: *I'd like…, please. / Can I have…, please?* — і завжди *please*.
> - Офіціант: *Anything else? Still or sparkling? Eat in or take away?*
> - Ціни: *£4.50 — four pounds fifty*; рахунок — *the bill* (US *the check*).
