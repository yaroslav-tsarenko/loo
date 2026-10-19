---
title: Одяг, кольори й у магазині
order: 122
id: en-a1-clothes
level: A1
icon: px:tag
tags: [english, a1, vocabulary, clothes, colours, shopping, situation]
prerequisites: ["[[English - A1 - 19. Some, any, much, many — лічильні й нелічильні]]", "[[English - A1 - 21. Can і can't — уміння й прохання]]"]
estimatedMinutes: 40
---

# Одяг, кольори й у магазині

> [!success] Після цієї теми ти зможеш
> - назвати одяг, взуття й кольори: *a blue jumper, black jeans, white trainers*;
> - сказати, що зазвичай носиш: *I usually wear jeans and a T-shirt.*;
> - спитати ціну правильно: *How much is it? / How much are they?*;
> - поміряти й вибрати розмір: *Can I try it on? It's too big. Have you got a smaller size?*

## Передбач

> [!quiz] Як сказати «червона сукня»?
> level: A1 · id: en-a1-clothes-q01
> - [x] a red dress
> - [ ] a dress red
> - [ ] a reds dress
> - [ ] red a dress
>
> **Пояснення:** прикметник (і колір теж) стоїть **перед** іменником: *a red dress*. І прикметники в англійській ніколи не отримують *-s*: *red shoes*, не ~~reds shoes~~.

## Одяг і взуття

| Що | Слова |
|---|---|
| верх | *shirt* сорочка · *T-shirt* футболка · *jumper* светр · *jacket* куртка, піджак · *coat* пальто |
| низ | *trousers* штани · *jeans* джинси · *shorts* шорти · *skirt* спідниця · *dress* сукня |
| взуття | *shoes* туфлі, взуття · *trainers* кросівки · *boots* черевики, чоботи · *socks* шкарпетки |
| аксесуари | *hat* капелюх, шапка · *scarf* шарф · *gloves* рукавички |

Саме слово ***clothes*** — «одяг» — **завжди множина** й не має однини: *My clothes **are** in the wardrobe.* Один предмет одягу — *a piece of clothing* або просто назва: *a shirt*.

### Штани, які завжди «вони»

*Trousers, jeans, shorts, pyjamas* (а також *glasses*) — це «парні» слова: англійці бачать дві штанини, тому слово завжди в множині.

- ***These** jeans **are** new.* — Ці джинси нові. (не ~~This jeans is~~)
- ***How much are they?*** — Скільки вони коштують?
- Щоб порахувати, кажи ***a pair of***: *a pair of jeans, two pairs of trousers.*

### Носити — wear

«Бути вдягненим у щось, носити» — ***wear***: *I usually **wear** jeans to work. She always **wears** black.* Не ~~I dress jeans~~ і не ~~I carry a hat~~.

## Кольори

| Колір | Українською | Колір | Українською |
|---|---|---|---|
| *red* | червоний | *black* | чорний |
| *blue* | синій, блакитний | *white* | білий |
| *green* | зелений | *grey* (US *gray*) | сірий |
| *yellow* | жовтий | *brown* | коричневий |
| *pink* | рожевий | *purple* | фіолетовий |

Світліший і темніший відтінок — *light* / *dark*: *light blue* (блакитний), *dark green* (темно-зелений). Питання про колір — ***What colour is it?*** (US *color*).

> [!diagram] Де стоїть колір
> ```yaml
> layout: flow
> nodes:
>   - { id: art, label: "артикль", text: "a", tone: gray }
>   - { id: adj, label: "колір / прикметник", text: "red", tone: red }
>   - { id: noun, label: "що?", text: "dress", tone: blue }
> steps:
>   - { focus: [art, adj, noun], note: "Схема: артикль + колір + річ. A red dress — червона сукня." }
>   - { set: { art: "two", adj: "black", noun: "jumpers" }, focus: [adj, noun], note: "Множина — лише в іменнику: two black jumpers. Колір не змінюється: не «blacks» ✗." }
>   - { set: { art: "a", adj: "dark blue", noun: "coat" }, focus: adj, note: "Відтінок — теж перед іменником: a dark blue coat — темно-синє пальто." }
>   - { set: { art: "—", adj: "white", noun: "trainers" }, focus: [adj, noun], note: "Без артикля в множині: I've got white trainers. Колір — завжди ПЕРЕД річчю." }
> ```

## У магазині: ціна, розмір, примірка

### How much is it чи How much are they

> [!diagram] Скільки коштує: is it чи are they
> ```yaml
> layout: compare
> columns: { one: "Одна річ", many: "Кілька речей / «парні» слова" }
> nodes:
>   - { id: o1, col: one, label: "що", text: "this shirt · this dress", tone: blue }
>   - { id: o2, col: one, label: "питання", text: "How much is it?", tone: blue }
>   - { id: o3, col: one, label: "відповідь", text: "It's £25.", tone: blue }
>   - { id: m1, col: many, label: "що", text: "these shoes · these jeans", tone: violet }
>   - { id: m2, col: many, label: "питання", text: "How much are they?", tone: violet }
>   - { id: m3, col: many, label: "відповідь", text: "They're £60.", tone: violet }
> steps:
>   - { show: [o1, o2], note: "Одна річ — this і is it: How much is this shirt? How much is it?" }
>   - { show: o3, note: "Відповідь — It's… : It's twenty-five pounds." }
>   - { show: [m1, m2], note: "Кілька речей або «парні» jeans, trousers, shoes — these і are they: How much are these jeans?" }
>   - { show: m3, note: "Відповідь — They're… : They're sixty pounds." }
> ```

Можна й довше: *How much **does** it cost? How much **do** they cost?* А от ~~How much costs it?~~ — помилка (калька з «Скільки коштує?»).

### Розмір і примірка

| Ти кажеш | Українською |
|---|---|
| *I'm just looking, thanks.* | Я просто дивлюся, дякую. |
| *Have you got this in blue?* | У вас є таке саме в синьому кольорі? |
| *Can I try it on? / Can I try them on?* | Можна поміряти? |
| *Where are the changing rooms?* | Де примірочні? |
| *It's too big / too small / too long.* | Завелика / замала / задовга. |
| *Have you got a smaller / bigger size?* | Є менший / більший розмір? |
| *It fits.* | Підходить за розміром. |
| *I'll take it.* | Я візьму. |

Продавець може спитати: ***Can I help you?*** (Вам допомогти?) і ***What size are you?*** (Який у вас розмір?) — *I'm a medium* або *I'm a size 10 / a 38*. Британські, американські й європейські розміри відрізняються, тож краще міряти.

***Fit*** — про розмір: *The jeans fit.* ***Suit*** — про те, чи личить: *Blue really suits you!*

> [!quiz] Перевір себе: «How much ___ these shoes?»
> level: A1 · id: en-a1-clothes-q02
> - [ ] is
> - [x] are
> - [ ] it is
> - [ ] does
>
> **Пояснення:** *these shoes* — множина, тому *How much are these shoes?* Відповідь — *They're…*

## Приклади

- I usually wear jeans and a T-shirt at the weekend. — У вихідні я зазвичай ношу джинси й футболку.
- She's got a beautiful red coat. — У неї гарне червоне пальто.
- How much is this jumper? — It's thirty pounds. — Скільки коштує цей светр? — Тридцять фунтів.
- How much are these boots? — They're eighty-five. — Скільки коштують ці черевики? — Вісімдесят пʼять.
- Can I try these trousers on? — Можна поміряти ці штани?
- This dress is too small. Have you got a bigger size? — Ця сукня замала. У вас є більший розмір?
- Have you got this shirt in white? — У вас є така сорочка білого кольору?
- These shoes are cheap, but those are really expensive. — Ці туфлі дешеві, а ті — дуже дорогі.
- Grey really suits you. — Тобі дуже личить сірий.
- I'm just looking, thanks. — Я просто дивлюся, дякую.

## Слова

> [!word] clothes
> ipa: /kləʊðz/ · ipa-us: /kloʊðz/ · pos: noun · level: A1 · id: en-a1-clothes-w01
> uk: одяг
> example: My **clothes** are in the wardrobe. — Мій одяг у шафі.
> note: лише множина: *clothes are*. У швидкому мовленні часто звучить як /kləʊz/. *Cloth* — тканина.

> [!word] shirt
> ipa: /ʃɜːt/ · ipa-us: /ʃɝːt/ · pos: noun · level: A1 · id: en-a1-clothes-w02
> uk: сорочка
> example: He always wears a white **shirt** to work. — Він завжди носить на роботу білу сорочку.

> [!word] T-shirt
> ipa: /ˈtiː ʃɜːt/ · ipa-us: /ˈtiː ʃɝːt/ · pos: noun · level: A1 · id: en-a1-clothes-w03
> uk: футболка
> example: It's hot — I'm in shorts and a **T-shirt**. — Спекотно, я в шортах і футболці.
> note: названа за формою літери T.

> [!word] jumper
> ipa: /ˈdʒʌmpə/ · ipa-us: /ˈdʒʌmpər/ · pos: noun · level: A1 · id: en-a1-clothes-w04
> uk: светр; джемпер
> example: Take a warm **jumper**. — Візьми теплий светр.
> note: у США — *sweater*.

> [!word] jacket
> ipa: /ˈdʒækɪt/ · pos: noun · level: A1 · id: en-a1-clothes-w05
> uk: куртка; піджак
> example: I need a new **jacket** for the autumn. — Мені потрібна нова куртка на осінь.

> [!word] coat
> ipa: /kəʊt/ · ipa-us: /koʊt/ · pos: noun · level: A1 · id: en-a1-clothes-w06
> uk: пальто
> example: It's cold. Put on your **coat**! — Холодно. Вдягни пальто!

> [!word] dress
> ipa: /dres/ · pos: noun · level: A1 · id: en-a1-clothes-w07
> uk: сукня
> example: What a beautiful **dress**! — Яка гарна сукня!
> note: як дієслово *dress* — одягати(ся): *get dressed*. Але «носити джинси» — *wear jeans*.

> [!word] skirt
> ipa: /skɜːt/ · ipa-us: /skɝːt/ · pos: noun · level: A1 · id: en-a1-clothes-w08
> uk: спідниця
> example: She's wearing a long green **skirt**. — На ній довга зелена спідниця.

> [!word] trousers
> ipa: /ˈtraʊzəz/ · ipa-us: /ˈtraʊzərz/ · pos: noun · level: A1 · id: en-a1-clothes-w09
> uk: штани; брюки
> example: These **trousers** are too long. — Ці штани задовгі.
> note: завжди множина. У США — *pants*; а британські *pants* — труси!

> [!word] jeans
> ipa: /dʒiːnz/ · pos: noun · level: A1 · id: en-a1-clothes-w10
> uk: джинси
> example: How much are these **jeans**? — Скільки коштують ці джинси?
> note: завжди множина: *a pair of jeans*.

> [!word] shorts
> ipa: /ʃɔːts/ · ipa-us: /ʃɔːrts/ · pos: noun · level: A1 · id: en-a1-clothes-w11
> uk: шорти
> example: In summer I wear **shorts** every day. — Улітку я щодня ношу шорти.

> [!word] shoes
> ipa: /ʃuːz/ · pos: noun · level: A1 · id: en-a1-clothes-w12
> uk: туфлі; взуття
> example: I need comfortable **shoes** for walking. — Мені потрібне зручне взуття для прогулянок.
> forms: shoe → shoes

> [!word] trainers
> ipa: /ˈtreɪnəz/ · ipa-us: /ˈtreɪnərz/ · pos: noun · level: A1 · id: en-a1-clothes-w13
> uk: кросівки
> example: My **trainers** are white. — Мої кросівки білі.
> note: у США — *sneakers*.

> [!word] boots
> ipa: /buːts/ · pos: noun · level: A1 · id: en-a1-clothes-w14
> uk: черевики; чоботи
> example: I wear **boots** in winter. — Узимку я ношу черевики.
> forms: boot → boots

> [!word] socks
> ipa: /sɒks/ · ipa-us: /sɑːks/ · pos: noun · level: A1 · id: en-a1-clothes-w15
> uk: шкарпетки
> example: Where are my blue **socks**? — Де мої сині шкарпетки?
> forms: sock → socks

> [!word] hat
> ipa: /hæt/ · pos: noun · level: A1 · id: en-a1-clothes-w16
> uk: капелюх; шапка
> example: Take a **hat** — it's sunny. — Візьми капелюх, надворі сонце.
> note: бейсболка — *cap*. Перший звук — легкий видих /h/.

> [!word] scarf
> ipa: /skɑːf/ · ipa-us: /skɑːrf/ · pos: noun · level: A1 · id: en-a1-clothes-w17
> uk: шарф; хустка
> example: My grandma knits **scarves** for everyone. — Моя бабуся всім вʼяже шарфи.
> forms: scarf → scarves

> [!word] gloves
> ipa: /ɡlʌvz/ · pos: noun · level: A1 · id: en-a1-clothes-w18
> uk: рукавички
> example: Don't forget your **gloves**! — Не забудь рукавички!
> note: *o* читається як /ʌ/: «главз».

> [!word] colour
> ipa: /ˈkʌlə/ · ipa-us: /ˈkʌlər/ · pos: noun · level: A1 · id: en-a1-clothes-w19
> uk: колір
> example: What **colour** is your car? — Якого кольору твоя машина?
> note: у США пишуть *color*.

> [!word] red
> ipa: /red/ · pos: adj · level: A1 · id: en-a1-clothes-w20
> uk: червоний
> example: I'd like the **red** one, please. — Мені червону, будь ласка.

> [!word] blue
> ipa: /bluː/ · pos: adj · level: A1 · id: en-a1-clothes-w21
> uk: синій; блакитний
> example: He's got **blue** eyes and a **blue** shirt. — У нього блакитні очі й синя сорочка.
> note: блакитний — *light blue*, темно-синій — *dark blue* або *navy*.

> [!word] green
> ipa: /ɡriːn/ · pos: adj · level: A1 · id: en-a1-clothes-w22
> uk: зелений
> example: Have you got this in **green**? — У вас є таке в зеленому кольорі?

> [!word] yellow
> ipa: /ˈjeləʊ/ · ipa-us: /ˈjeloʊ/ · pos: adj · level: A1 · id: en-a1-clothes-w23
> uk: жовтий
> example: She's wearing a **yellow** raincoat. — На ній жовтий дощовик.

> [!word] black
> ipa: /blæk/ · pos: adj · level: A1 · id: en-a1-clothes-w24
> uk: чорний
> example: I always wear **black** jeans. — Я завжди ношу чорні джинси.

> [!word] white
> ipa: /waɪt/ · pos: adj · level: A1 · id: en-a1-clothes-w25
> uk: білий
> example: These **white** trainers are new. — Ці білі кросівки нові.
> note: *h* не читається: «вайт», з /w/.

> [!word] grey
> ipa: /ɡreɪ/ · pos: adj · level: A1 · id: en-a1-clothes-w26
> uk: сірий
> example: A **grey** jumper goes with everything. — Сірий светр пасує до всього.
> note: у США пишуть *gray*.

> [!word] brown
> ipa: /braʊn/ · pos: adj · level: A1 · id: en-a1-clothes-w27
> uk: коричневий
> example: Are these **brown** boots in the sale? — Ці коричневі черевики зі знижкою?

> [!word] pink
> ipa: /pɪŋk/ · pos: adj · level: A1 · id: en-a1-clothes-w28
> uk: рожевий
> example: My daughter loves **pink**. — Моя донька обожнює рожевий.

> [!word] purple
> ipa: /ˈpɜːpl/ · ipa-us: /ˈpɝːpl/ · pos: adj · level: A1 · id: en-a1-clothes-w29
> uk: фіолетовий; пурпуровий
> example: She's got a **purple** scarf. — У неї фіолетовий шарф.

> [!word] size
> ipa: /saɪz/ · pos: noun · level: A1 · id: en-a1-clothes-w30
> uk: розмір
> example: What **size** are you? — Який у вас розмір?
> note: дзвінке /z/ у кінці: «сайз».

> [!word] medium
> ipa: /ˈmiːdiəm/ · pos: adj · level: A1 · id: en-a1-clothes-w31
> uk: середній (розмір M)
> example: I'm a **medium**. — У мене розмір M.
> note: розміри: *small (S), medium (M), large (L), extra large (XL)*.

> [!word] large
> ipa: /lɑːdʒ/ · ipa-us: /lɑːrdʒ/ · pos: adj · level: A1 · id: en-a1-clothes-w32
> uk: великий (розмір L)
> example: Have you got this in **large**? — У вас є такий розміру L?
> note: хибний друг: *large* — великий, а не «широкий» (широкий — *wide*).

> [!word] cheap
> ipa: /tʃiːp/ · pos: adj · level: A1 · id: en-a1-clothes-w33
> uk: дешевий
> example: These T-shirts are really **cheap**. — Ці футболки дуже дешеві.

> [!word] expensive
> ipa: /ɪkˈspensɪv/ · pos: adj · level: A1 · id: en-a1-clothes-w34
> uk: дорогий (за ціною)
> example: This coat is too **expensive**. — Це пальто задороге.
> note: «дорогий» у значенні «милий» — *dear*.

> [!word] try on
> ipa: /traɪ ˈɒn/ · ipa-us: /traɪ ˈɑːn/ · pos: phrase · level: A1 · id: en-a1-clothes-w35
> uk: міряти; приміряти
> example: Can I **try** this jacket **on**? — Можна поміряти цю куртку?
> note: *it* і *them* стоять посередині: *try it on, try them on*.

> [!word] fit
> ipa: /fɪt/ · pos: verb · level: A1 · id: en-a1-clothes-w36
> uk: підходити за розміром
> example: These jeans don't **fit** me. — Ці джинси мені не за розміром.

> [!word] suit
> ipa: /suːt/ · pos: verb · level: A1 · id: en-a1-clothes-w37
> uk: личити; пасувати
> example: That colour really **suits** you! — Цей колір тобі дуже личить!
> note: як іменник *a suit* — костюм.

> [!word] changing room
> ipa: /ˈtʃeɪndʒɪŋ ruːm/ · pos: noun · level: A1 · id: en-a1-clothes-w38
> uk: примірочна
> example: The **changing rooms** are over there. — Примірочні он там.
> note: у США — *fitting room*.

> [!word] wear
> ipa: /weə/ · ipa-us: /wer/ · pos: verb · level: A1 · id: en-a1-clothes-w39
> uk: носити (одяг); бути вдягненим
> example: I usually **wear** a suit to work. — На роботу я зазвичай ношу костюм.
> forms: wear → wore → worn
> note: звучить так само, як *where*.

> [!word] I'm just looking
> ipa: /aɪm dʒʌst ˈlʊkɪŋ/ · pos: phrase · level: A1 · id: en-a1-clothes-w40
> uk: Я просто дивлюся
> example: Can I help you? — **I'm just looking**, thanks. — Вам допомогти? — Я просто дивлюся, дякую.

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-clothes-l01
> audio: How much are these jeans?
> - [ ] How much is this jumper?
> - [x] How much are these jeans?
> - [ ] How much are these shoes?

> [!listen] Скільки коштує річ?
> level: A1 · type: choice · speed: slow · id: en-a1-clothes-l02
> audio: It's twenty-four ninety-nine.
> - [x] £24.99
> - [ ] £20.49
> - [ ] £24.90

> [!listen] Напиши або скажи, що почуєш
> level: A1 · type: dictation · speed: slow · id: en-a1-clothes-l03
> audio: Can I try it on?

> [!listen] Напиши або скажи, що почуєш
> level: A1 · type: dictation · speed: slow · id: en-a1-clothes-l04
> audio: These shoes are too small.

> [!listen] Якого кольору кросівки?
> level: A1 · type: answer · speed: slow · id: en-a1-clothes-l05
> audio: Today I've got a blue jumper, black jeans and white trainers.
> - [ ] Сині
> - [ ] Чорні
> - [x] Білі

## Вимова

> [!speak] Скажи вголос
> level: A1 · id: en-a1-clothes-s01
> text: How much is this jacket?
> ipa: /haʊ ˈmʌtʃ ɪz ðɪs ˈdʒækɪt/
> tip: jacket — «ДЖЕ-кіт», з відкритим /æ/. *This* — /ð/, язик між зубами.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-clothes-s02
> text: Can I try these trousers on?
> ipa: /kən aɪ ˈtraɪ ðiːz ˈtraʊzəz ˈɒn/
> tip: *these* — довге /iː/ і дзвінке /z/: «ðіз». Trousers — «ТРАУ-зəз».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-clothes-s03
> text: It's too big. Have you got a smaller size?
> ipa: /ɪts ˈtuː ˈbɪɡ həv jə ɡɒt ə ˈsmɔːlə ˈsaɪz/
> tip: *big* — дзвінке /ɡ/ у кінці, не «бік». *Size* — дзвінке /z/.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-clothes-s04
> text: I'm just looking, thanks.
> ipa: /aɪm dʒʌst ˈlʊkɪŋ θæŋks/
> tip: *thanks* — /θ/: кінчик язика між зубами й видих, не «сенкс» і не «фенкс».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-clothes-s05
> text: I usually wear jeans and a T-shirt.
> ipa: /aɪ ˈjuːʒuəli weə ˈdʒiːnz ənd ə ˈtiː ʃɜːt/
> tip: *wear* — «веə», губи трубочкою на /w/. *Jeans* — довге /iː/ і /z/: «джінз».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-clothes-s06
> text: Where are the changing rooms?
> ipa: /weər ə ðə ˈtʃeɪndʒɪŋ ruːmz/
> tip: *changing* — «ЧЕЙН-джінг», дифтонг /eɪ/.

## Типові помилки українців

> [!pitfall] «A dress red», «reds shoes»
> Колір — **перед** іменником і **без** множини: *a red dress, red shoes*. Українською можна сказати «сукня червона», англійською — ні.

> [!pitfall] «This jeans is…», «a trousers»
> *Jeans, trousers, shorts, pyjamas* — завжди множина: ***These** jeans **are** nice. How much **are they**?* Одну річ рахуємо так: *a pair of trousers*.

> [!pitfall] «How much costs it?»
> Калька з «Скільки коштує?». Правильно: ***How much is it?*** (найчастіше) або ***How much does it cost?*** Для кількох речей — *How much are they?*

> [!pitfall] «I dress jeans», «I carry glasses»
> «Носити одяг, окуляри, прикраси» — ***wear***: *I wear jeans. She wears glasses.* *Carry* — нести в руках: *carry a bag*.

## Ситуація: купуємо куртку

> [!listen] Послухай діалог. Що купує B?
> level: A1 · type: answer · speed: slow · id: en-a1-clothes-l06
> audio: A: Hi, can I help you?
> audio: B: Yes, have you got this jacket in black?
> audio: A: Yes, we have. What size are you?
> audio: B: Medium, I think. Can I try it on?
> audio: A: Sure. The changing rooms are over there.
> audio: B: It fits! How much is it?
> audio: A: It's forty-five pounds.
> audio: B: Great, I'll take it.
> - [x] Чорну куртку розміру M за £45
> - [ ] Чорну куртку розміру L за £54
> - [ ] Синю куртку розміру M за £45

Тепер ти — покупець. Скажи вголос:

> [!speak] «У вас є ця куртка в чорному кольорі?»
> level: A1 · id: en-a1-clothes-s07
> text: Have you got this jacket in black?
> ipa: /həv jə ɡɒt ðɪs ˈdʒækɪt ɪn ˈblæk/
> tip: *in black* — «ін БЛЕК», відкритий /æ/, як у *bag*.

> [!speak] «Підходить! Я візьму».
> level: A1 · id: en-a1-clothes-s08
> text: It fits! I'll take it.
> ipa: /ɪt ˈfɪts aɪl ˈteɪk ɪt/
> tip: *I'll* — «айл», одним складом. *Take it* злито: «ТЕЙ-кіт».

## Практика

> [!quiz] Заповни пропуски: одна річ чи кілька
> level: A1 · type: fill · bank · id: en-a1-clothes-q03
>
> ```text fill
> How much [[is]] this T-shirt? — [[It's]] twelve pounds.
> How much [[are]] these jeans? — [[They're]] forty pounds.
> ```
>
> **Пояснення:** одна річ — *is / it's*, кілька або «парні» слова — *are / they're*.

> [!quiz] Як спитати «Скільки це коштує?»
> level: A1 · id: en-a1-clothes-q04
> - [x] How much is it?
> - [ ] How much costs it?
> - [ ] How many is it?
> - [ ] How much it costs?
>
> **Пояснення:** про ціну — *How much*. Найпростіше: *How much is it?* Повний варіант — *How much does it cost?*

> [!quiz] Склади питання: «Можна це поміряти?»
> level: A1 · type: order · id: en-a1-clothes-q05
>
> ```text order
> Can I
> try
> it
> on?
> on it? # ✗
> ```
>
> **Пояснення:** займенник *it* стоїть між *try* і *on*: *try it on*.

> [!quiz] «Ці штани мені завеликі» — яке речення правильне?
> level: A1 · id: en-a1-clothes-q06
> - [x] These trousers are too big for me.
> - [ ] This trousers is too big for me.
> - [ ] These trousers is very big for me.
> - [ ] This trouser are too big for me.
>
> **Пояснення:** *trousers* — множина: *these … are*. «Завеликий» — *too big* (*very big* — просто «дуже великий»).

> [!quiz] Заповни пропуски: британське слово → американське
> level: A1 · type: fill · bank: shorts, boots · id: en-a1-clothes-q07
>
> ```text fill
> trousers  →  [[pants]]
> jumper    →  [[sweater]]
> trainers  →  [[sneakers]]
> ```
>
> **Пояснення:** в американській англійській штани — *pants*, светр — *sweater*, кросівки — *sneakers*. Обережно: британські *pants* — це труси.

> [!quiz] Продавець питає «Can I help you?», а ти відповідаєш «I'm just looking». Що ти сказав?
> level: A1 · id: en-a1-clothes-q08
> - [x] Я просто дивлюся.
> - [ ] Я шукаю примірочну.
> - [ ] Я вже вибрав.
> - [ ] Допоможіть мені, будь ласка.
>
> **Пояснення:** *I'm just looking* — ввічлива відмова від допомоги: поки що просто дивлюся.

> [!quiz] Склади речення: «Вона зазвичай носить чорні джинси».
> level: A1 · type: order · id: en-a1-clothes-q09
>
> ```text order
> She
> usually
> wears
> black jeans.
> jeans black. # ✗
> ```
>
> **Пояснення:** прислівник частоти перед дієсловом, *wears* з *-s*, колір — перед річчю.

> [!quiz] Як сказати «Тобі дуже личить!»?
> level: A1 · id: en-a1-clothes-q10
> - [x] It really suits you!
> - [ ] It really fits to you!
> - [ ] It is very suit for you!
> - [ ] It really wears you!
>
> **Пояснення:** *suit* — личить, пасує на вигляд. *Fit* — підходить за розміром: *It fits you* (без *to*).

## Фішки

> [!reel] 👖 Pants у Лондоні — це труси
> Американець скаже *I like your pants* про штани. У Британії це прозвучить як комплімент білизні. Британські штани — *trousers*, американські — *pants*.

> [!reel] 🍊 Колір orange назвали на честь апельсина
> До XVI століття англійці не мали окремої назви для помаранчевого — казали щось на кшталт «жовто-червоний». Потім до Англії привезли апельсини, і фрукт подарував назву кольору.

> [!reel] 🧦 Чому штани — «пара»
> *A pair of trousers* — бо колись штанини справді шили й носили окремо, по одній на ногу. Дві штанини давно зшили, а граматика лишилася в множині.

## Джерела та що почитати

- [Cambridge Dictionary — Word choice: cloth, clothes, or clothing?](https://dictionary.cambridge.org/grammar/british-grammar/clothes) — різниця між схожими словами.
- [Cambridge Dictionary — Nouns: countable and uncountable](https://dictionary.cambridge.org/grammar/british-grammar/nouns-countable-and-uncountable) — зокрема слова лише в множині.
- [Oxford Learner's Dictionaries](https://www.oxfordlearnersdictionaries.com/) — британська й американська вимова з аудіо.
- [BBC Learning English](https://www.bbc.co.uk/learningenglish) — діалоги в магазинах.

> [!important] Підсумок
> - Одяг: *shirt, T-shirt, jumper, jacket, coat, dress, skirt, trousers, jeans, shoes, trainers*; *clothes* — лише множина.
> - Колір — перед іменником і без *-s*: *a red dress, black shoes*.
> - *Jeans, trousers, shorts* — множина: *These jeans are… / a pair of jeans*.
> - Ціна: *How much is it? / How much are they?* — не ~~How much costs it?~~
> - Примірка: *Can I try it on? It's too big. It fits. I'll take it.* Носити — *wear*; личить — *suit*.
