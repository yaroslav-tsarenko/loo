---
title: Читання й письмо — анкета, оголошення, листівка
order: 129
id: en-a1-read-write
level: A1
icon: px:clipboard
tags: [english, a1, skills, reading, writing, forms, punctuation]
prerequisites: ["[[English - A1 - 28. Аудіювання — діалоги на щодень]]", "[[English - A1 - 12. Час, дні, місяці й дати]]"]
estimatedMinutes: 40
---

# Читання й письмо — анкета, оголошення, листівка

> [!success] Після цієї теми ти зможеш
> - прочитати вивіску, оголошення чи меню й знайти потрібне: ціну, час, телефон;
> - заповнити просту анкету: **first name**, **surname**, **date of birth**, **address**;
> - написати коротке повідомлення про себе й листівку другові (*Dear Anna, … Love, Olena*);
> - ставити великі літери там, де їх ставлять англійці (**I**, дні, місяці, мови, країни);
> - зʼєднувати думки словами **and**, **but**, **because** і правильно ставити крапку й кому.

## Передбач

> [!quiz] Який рядок написано правильно?
> level: A1 · id: en-a1-read-write-q01
> - [ ] i live in kyiv and i speak ukrainian.
> - [x] I live in Kyiv and I speak Ukrainian.
> - [ ] I Live In Kyiv And I Speak Ukrainian.
> - [ ] I live in kyiv and i speak Ukrainian.
>
> **Пояснення:** в англійській **I** («я») — завжди велика, як і назви міст і мов (*Kyiv*, *Ukrainian*). А от решта слів у реченні — з малої, навіть якщо в заголовках їх інколи пишуть з великої.

## Пояснення

### Читаємо коротко: вивіски й оголошення

На вивісках і в оголошеннях повних речень майже немає — лише ключові слова. Не перекладай усе підряд: шукай те, що тобі потрібно (**час**, **ціну**, **місце**, **телефон**).

| Вивіска | Що означає |
|---|---|
| ENTRANCE / EXIT | вхід / вихід |
| PUSH / PULL | від себе / до себе (на дверях) |
| OPEN / CLOSED | відчинено / зачинено |
| NO SMOKING | не палити |
| TOILETS | туалети |
| FOR SALE | продається |
| FREE | безкоштовно |
| OUT OF ORDER | не працює (автомат, ліфт) |

Оголошення на дошці в гуртожитку:

> [!example] Notice board
> **FOR SALE:** a blue bike, only one year old. **Price:** £40. Call Tom: 07700 900123 (after 6 p.m.).
>
> **ENGLISH CLUB** — every Wednesday, 7–8 p.m., Room 12. **Free!** Everyone is welcome.
>
> **LOST:** a black cat, Tiger. Please call Anna: 07700 900456.

Що робимо: спершу дивимося на **великі слова** (*FOR SALE*, *ENGLISH CLUB*, *LOST*) — це тема оголошення. Потім шукаємо деталь: скільки коштує велосипед? (£40) Коли клуб? (у середу о 7–8 вечора)

### Анкета

Анкета (*form*) — це рядки з короткими відповідями. Пиши без речень: лише слово чи дату.

| Поле анкети | Що писати | Приклад |
|---|---|---|
| First name | імʼя | Olena |
| Surname / Last name | прізвище | Shevchuk |
| Title | Mr / Mrs / Ms | Ms |
| Date of birth | дата народження | 05/06/2001 (5 June 2001) |
| Nationality | громадянство | Ukrainian |
| Address | адреса | 12 Green Street, Leeds |
| Email | електронна пошта | olena.shevchuk@mail.com |
| Phone number | телефон | 07700 900789 |
| Occupation | рід занять | student |
| Signature | підпис | *O. Shevchuk* |

> [!tip] Дата — спершу день чи місяць?
> У Британії й Україні **05/06/2001** — це 5 червня. У США — 6 травня: там спершу місяць. Щоб не плутатися, пиши місяць словом: *5 June 2001*. А **BLOCK CAPITALS** або *in capital letters* в анкеті — пиши друкованими великими літерами.

### Повідомлення про себе

Коротке повідомлення — це 4–6 простих речень: хто ти, звідки, що робиш, що любиш.

> [!example] About me
> Hi! My name is Taras and I'm 24. I'm from Lviv, but I live in Kyiv now. I'm a software developer. I like football and music, but I don't like shopping. I'm learning English because I want to travel. Write to me!

### Листівка

Листівка (*postcard*) має сталу схему: звертання → де ти → що робиш → погода й враження → прощання.

> [!diagram] Як побудована листівка
> ```yaml
> layout: flow
> nodes:
>   - { id: hi, label: "звертання", text: "Dear Anna,", note: "або Hi Anna,", tone: blue, icon: "px:envelope" }
>   - { id: where, label: "де ти", text: "We're in Odesa.", note: "where + with whom", tone: violet, icon: "px:map" }
>   - { id: what, label: "що робите", text: "We swim every day.", note: "Present Simple / Continuous", tone: orange }
>   - { id: feel, label: "погода й враження", text: "It's sunny. I love it!", tone: yellow, icon: "px:sun" }
>   - { id: bye, label: "прощання", text: "Love, Olena", note: "або Best wishes,", tone: green, icon: "px:heart" }
> steps:
>   - { focus: hi, note: "Починаємо зі звертання: Dear + імʼя і кома. Другові можна простіше — Hi Anna," }
>   - { focus: where, note: "Перше речення — де ти і з ким: We're in Odesa with my sister." }
>   - { focus: what, note: "Що робите там: звички — Present Simple (We swim every day), зараз — Continuous (I'm sitting on the beach)." }
>   - { focus: feel, note: "Погода й враження: It's hot and sunny. The food is great. I love it here!" }
>   - { focus: bye, note: "Прощання з комою й підпис з нового рядка: Love, / Best wishes, — і твоє імʼя." }
> ```

> [!example] A postcard
> Dear Anna,
>
> Greetings from Odesa! I'm here with my sister. The hotel is small but nice, and the beach is only five minutes away. We swim every day and eat a lot of ice cream. It's very hot and sunny. Today I'm sitting in a café and writing postcards!
>
> See you soon,
> Love, Olena

### Великі літери й пунктуація

| З великої літери | Приклад | А з малої |
|---|---|---|
| **I** — «я» | *Can I help?* | *me, my* |
| початок речення | *We are here.* | |
| імена й прізвища | *Olena Shevchuk* | |
| дні тижня й місяці | *Monday, May* | пори року: *summer, winter* |
| країни, міста, вулиці | *Ukraine, Leeds, Green Street* | |
| мови й національності | *English, Ukrainian* | предмети: *maths, history* |

| Знак | Назва | Коли |
|---|---|---|
| . | full stop (US period) | у кінці речення |
| , | comma | у переліку, після звертання *Dear Anna,*, перед *but* |
| ? | question mark | у кінці питання |
| ! | exclamation mark | емоція: *Write to me!* |
| ' | apostrophe | скорочення й присвійність: *I'm, Tom's* |

### Звʼязуємо думки: and, but, because

- **and** — «і», додаємо: *I like tea **and** cake.*
- **but** — «але», протиставляємо (перед ним часто кома): *The hotel is small, **but** it's nice.*
- **because** — «бо», пояснюємо причину: *I'm happy **because** it's Friday.*

## Приклади

- *Please write in capital letters.* — Будь ласка, пишіть друкованими великими літерами.
- *What's your date of birth? — The fifth of June, two thousand and one.* — Яка ваша дата народження? — Пʼяте червня 2001 року.
- *Sign here, please.* — Підпишіть тут, будь ласка.
- *The museum is closed on Mondays.* — Музей зачинений по понеділках.
- *Bike for sale — only £40!* — Продається велосипед — лише £40!
- *Entry is free for children.* — Для дітей вхід безкоштовний.
- *Thanks for your message!* — Дякую за повідомлення!
- *Dear Tom, greetings from London!* — Дорогий Томе, вітання з Лондона!
- *I'm tired because I work a lot.* — Я втомлений, бо багато працюю.
- *The weather is cold, but the people are friendly.* — Погода холодна, але люди привітні.

## Слова

> [!word] form
> ipa: /fɔːm/ · ipa-us: /fɔːrm/ · pos: noun · level: A1 · id: en-a1-read-write-w01
> uk: анкета; бланк; форма
> example: Please fill in this **form**. — Будь ласка, заповніть цю анкету.

> [!word] first name
> ipa: /ˈfɜːst neɪm/ · ipa-us: /ˈfɜːrst neɪm/ · pos: noun · level: A1 · id: en-a1-read-write-w02
> uk: імʼя
> example: My **first name** is Olena. — Моє імʼя — Олена.
> note: в анкеті поруч — *surname* або *last name* (прізвище).

> [!word] date of birth
> ipa: /ˌdeɪt əv ˈbɜːθ/ · ipa-us: /ˌdeɪt əv ˈbɜːrθ/ · pos: noun · level: A1 · id: en-a1-read-write-w03
> uk: дата народження
> example: **Date of birth:** 5 June 2001. — Дата народження: 5 червня 2001.
> note: скорочено — *DOB*.

> [!word] address
> ipa: /əˈdres/ · ipa-us: /ˈædres/ · pos: noun · level: A1 · id: en-a1-read-write-w04
> uk: адреса
> example: What's your **address**? — 12 Green Street. — Яка ваша адреса? — Грін-стріт, 12.
> note: пишеться з двома *d* і двома *s*. Email — теж *email address*.

> [!word] signature
> ipa: /ˈsɪɡnətʃə/ · ipa-us: /ˈsɪɡnətʃər/ · pos: noun · level: A1 · id: en-a1-read-write-w05
> uk: підпис
> example: Put your **signature** here, please. — Поставте тут свій підпис, будь ласка.
> note: дієслово «підписати» — *sign*: *Sign here, please.*

> [!word] occupation
> ipa: /ˌɒkjuˈpeɪʃən/ · ipa-us: /ˌɑːkjuˈpeɪʃən/ · pos: noun · level: A1 · id: en-a1-read-write-w06
> uk: рід занять; професія (в анкетах)
> example: **Occupation:** teacher. — Рід занять: учитель.
> note: у розмові питають простіше: *What do you do?*

> [!word] email
> ipa: /ˈiːmeɪl/ · pos: noun · level: A1 · id: en-a1-read-write-w07
> uk: електронний лист; електронна пошта
> example: I've got an **email** from my teacher. — Я отримав лист від учителя.
> note: також дієслово: *Email me!* — Напиши мені на пошту!

> [!word] message
> ipa: /ˈmesɪdʒ/ · pos: noun · level: A1 · id: en-a1-read-write-w08
> uk: повідомлення
> example: Thanks for your **message**! — Дякую за повідомлення!
> note: не «месадж»: /ˈmesɪdʒ/ — «МЕ-сідж».

> [!word] postcard
> ipa: /ˈpəʊstkɑːd/ · ipa-us: /ˈpoʊstkɑːrd/ · pos: noun · level: A1 · id: en-a1-read-write-w09
> uk: листівка
> example: I always send **postcards** from my holidays. — Я завжди надсилаю листівки з відпустки.

> [!word] beach
> ipa: /biːtʃ/ · pos: noun · level: A1 · id: en-a1-read-write-w10
> uk: пляж
> example: We go to the **beach** every day. — Ми щодня ходимо на пляж.
> note: довге /iː/: «бі-і-ітч». З коротким /ɪ/ вийде зовсім інше, грубе слово.

> [!word] Dear …
> ipa: /dɪə/ · ipa-us: /dɪr/ · pos: phrase · level: A1 · id: en-a1-read-write-w11
> uk: дорогий / дорога … (звертання в листі)
> example: **Dear** Anna, thank you for your letter. — Дорога Анно, дякую за лист.
> note: після імені — кома. Звучить так само, як *deer* (олень).

> [!word] Best wishes
> ipa: /ˌbest ˈwɪʃɪz/ · pos: phrase · level: A1 · id: en-a1-read-write-w12
> uk: з найкращими побажаннями (наприкінці листа)
> example: **Best wishes**, Taras — З найкращими побажаннями, Тарас.
> note: близьким — *Love,* (з любовʼю).

> [!word] entrance
> ipa: /ˈentrəns/ · pos: noun · level: A1 · id: en-a1-read-write-w13
> uk: вхід
> example: The **entrance** is on the left. — Вхід ліворуч.

> [!word] exit
> ipa: /ˈeksɪt/ · pos: noun · level: A1 · id: en-a1-read-write-w14
> uk: вихід
> example: Where's the **exit**? — Де вихід?
> note: на вивісках у Британії часто *WAY OUT*.

> [!word] for sale
> ipa: /fə ˈseɪl/ · ipa-us: /fər ˈseɪl/ · pos: phrase · level: A1 · id: en-a1-read-write-w15
> uk: продається
> example: This flat is **for sale**. — Ця квартира продається.

> [!word] price
> ipa: /praɪs/ · pos: noun · level: A1 · id: en-a1-read-write-w16
> uk: ціна
> example: What's the **price** of this bike? — Яка ціна цього велосипеда?

> [!word] free
> ipa: /friː/ · pos: adj · level: A1 · id: en-a1-read-write-w17
> uk: безкоштовний; вільний
> example: The museum is **free** on Sundays. — У неділю вхід до музею безкоштовний.
> note: *Are you free tonight?* — Ти вільний сьогодні ввечері?

> [!word] full stop
> ipa: /ˌfʊl ˈstɒp/ · pos: noun · level: A1 · id: en-a1-read-write-w18
> uk: крапка (в кінці речення)
> example: Put a **full stop** at the end of the sentence. — Постав крапку в кінці речення.
> note: US — *period* /ˈpɪriəd/. Крапка в email чи сайті — *dot*.

> [!word] comma
> ipa: /ˈkɒmə/ · ipa-us: /ˈkɑːmə/ · pos: noun · level: A1 · id: en-a1-read-write-w19
> uk: кома
> example: Write a **comma** after "Dear Anna". — Постав кому після «Dear Anna».

> [!word] question mark
> ipa: /ˈkwestʃən mɑːk/ · ipa-us: /ˈkwestʃən mɑːrk/ · pos: noun · level: A1 · id: en-a1-read-write-w20
> uk: знак питання
> example: Every question ends with a **question mark**. — Кожне питання закінчується знаком питання.

## Слухаємо

> [!listen] Коли музей зачинений?
> level: A1 · type: answer · speed: slow · id: en-a1-read-write-l01
> audio: Welcome to the City Museum. The museum is open from Tuesday to Sunday, from ten a.m. to six p.m. It is closed on Mondays. Entry is free for children.
> - [ ] у неділю
> - [x] у понеділок
> - [ ] у вівторок

> [!listen] Надрукуй адресу
> level: A1 · type: dictation · speed: slow · id: en-a1-read-write-l02
> audio: My address is 12 Green Street, Leeds.
> accept: My address is twelve Green Street, Leeds.

> [!listen] Голосове повідомлення. Де зараз Кейт?
> level: A1 · type: answer · speed: slow · id: en-a1-read-write-l03
> audio: Hi Olena, it's Kate. I'm at the beach with my brother. The weather is great! Call me later. Bye!
> - [ ] у кафе з подругою
> - [x] на пляжі з братом
> - [ ] удома з братом

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-read-write-l04
> audio: Please write your surname in capital letters.
> - [x] Please write your surname in capital letters.
> - [ ] Please write your first name in small letters.
> - [ ] Please sign your name at the bottom.

## Вимова

> [!speak] Тебе питають дату народження. Скажи: 5 червня 2001.
> level: A1 · id: en-a1-read-write-s01
> text: My date of birth is the fifth of June, two thousand and one.
> ipa: /maɪ ˌdeɪt əv ˈbɜːθ ɪz ðə ˈfɪfθ əv ˈdʒuːn ˈtuː ˈθaʊzənd ənd ˈwʌn/
> tip: fifth — /fθ/ у кінці: язик між зубами після f. Birth — /θ/, не «ф».

> [!speak] Попроси анкету в рецепції.
> level: A1 · id: en-a1-read-write-s02
> text: Can I have a form, please?
> ipa: /kən aɪ hæv ə ˈfɔːm pliːz/
> tip: form — довге /ɔː/ без «р»: «фо-ом».

> [!speak] Прочитай початок листівки.
> level: A1 · id: en-a1-read-write-s03
> text: Dear Anna, greetings from Odesa!
> ipa: /dɪər ˈænə ˈɡriːtɪŋz frəm əʊˈdesə/
> tip: dear — дифтонг /ɪə/: «ді-е». Greetings — довге /iː/ і /ŋ/ без «г» у кінці.

## Типові помилки українців

> [!pitfall] Мала літера в i, днях і мовах
> Українською «я», «понеділок», «англійська» — з малої. Англійською — **I**, **Monday**, **English** завжди з великої. Але пори року — з малої: *in summer*.

> [!pitfall] Імʼя й прізвище плутають місцями
> В анкеті *first name* — це **імʼя** (Olena), *surname* / *last name* — **прізвище** (Shevchuk). Не пиши спершу прізвище «як у списку класу». А *name* у питанні *What's your name?* — зазвичай імʼя або повне імʼя.

> [!pitfall] Одне довге речення через коми
> Українською можна «Я живу в Києві, я працюю, мені подобається». Англійською краще розбити: *I live in Kyiv. I work in IT. I like it.* Або зʼєднати: *I live in Kyiv **and** I work in IT.* Ланцюжок речень через кому — помилка.

## Практика

> [!quiz] Ти бачиш на дверях табличку PULL. Що робити?
> level: A1 · id: en-a1-read-write-q02
> - [ ] штовхнути двері від себе
> - [x] потягнути двері до себе
> - [ ] двері не працюють
> - [ ] це вихід
>
> **Пояснення:** *pull* — тягнути до себе, *push* — штовхати від себе. Вихід — *EXIT* або *WAY OUT*.

> [!quiz] Прочитай: «FOR SALE: a blue bike, only one year old. Price: £40. Call Tom after 6 p.m.» Що правда?
> level: A1 · id: en-a1-read-write-q03
> - [ ] Том купує велосипед за £40.
> - [x] Том продає синій велосипед за £40.
> - [ ] Велосипеду 40 років.
> - [ ] Тому треба дзвонити до 6 ранку.
>
> **Пояснення:** *for sale* — продається, *price* — ціна, *after 6 p.m.* — після шостої вечора.

> [!quiz] Анкета: Olena Shevchuk. Що писати в полі Surname?
> level: A1 · id: en-a1-read-write-q04
> - [ ] Olena
> - [x] Shevchuk
> - [ ] Ms
> - [ ] Olena Shevchuk
>
> **Пояснення:** *surname* (або *last name*) — прізвище. Імʼя — *first name*, а *Ms* — це поле *Title*.

> [!quiz] Які слова завжди пишуться з великої літери? Обери всі.
> level: A1 · type: multi · id: en-a1-read-write-q05
> - [x] Monday
> - [x] English
> - [x] I
> - [x] April
> - [ ] summer
> - [ ] coffee
>
> **Пояснення:** дні, місяці, мови й займенник *I* — з великої. Пори року (*summer*) і звичайні іменники (*coffee*) — з малої.

> [!quiz] Британська анкета: Date of birth 05/06/2001. Коли людина народилася?
> level: A1 · id: en-a1-read-write-q06
> - [x] 5 червня 2001
> - [ ] 6 травня 2001
> - [ ] 5 травня 2006
> - [ ] 6 червня 2005
>
> **Пояснення:** у Британії (як і в Україні) — день / місяць / рік. Американець прочитав би це як 6 травня — тому місяць надійніше писати словом.

> [!quiz] Як закінчити листівку близькій подрузі?
> level: A1 · id: en-a1-read-write-q07
> - [ ] Goodbye, Olena.
> - [x] Love, Olena
> - [ ] Dear, Olena
> - [ ] Signature: Olena
>
> **Пояснення:** другові чи родині — *Love,* і імʼя з нового рядка. Нейтрально — *Best wishes,*. *Dear* — це початок листа, а не кінець.

> [!quiz] Обери звʼязку: «I like tea, ___ I don't like coffee.»
> level: A1 · id: en-a1-read-write-q08
> - [ ] and
> - [x] but
> - [ ] because
> - [ ] so
>
> **Пояснення:** друга частина протиставляє першу — *but* (але). *And* додає, *because* пояснює причину.

> [!quiz] Заповни повідомлення про себе
> level: A1 · type: fill · id: en-a1-read-write-q09 · bank: so, or
>
> ```text fill
> Hi! My [[name]] is Taras. I'm from Lviv, [[but]] I live in Kyiv now.
> I like football [[and]] music.
> I'm learning English [[because]] I want to travel.
> ```

> [!quiz] Постав великі літери, де треба
> level: A1 · type: fill · id: en-a1-read-write-q10 · bank: monday, i, english, may
>
> ```text fill
> On [[Monday]] [[I]] have an [[English]] lesson.
> My birthday is in [[May]].
> ```

> [!quiz] Склади речення з листівки: «Ми щодня ходимо на пляж».
> level: A1 · type: order · id: en-a1-read-write-q11
>
> ```text order
> We
> go
> to
> the
> beach
> every day.
> ```

> [!quiz] Склади питання: «Можна мені анкету, будь ласка?»
> level: A1 · type: order · id: en-a1-read-write-q12
>
> ```text order
> Can
> I
> have
> a
> form,
> please?
> ```

> [!quiz] Заповни листівку
> level: A1 · type: fill · id: en-a1-read-write-q13 · bank: Goodbye, from
>
> ```text fill
> [[Dear]] Anna,
> Greetings from Odesa! The weather is hot [[and]] sunny.
> I'm happy [[because]] the sea is warm.
> See you soon,
> [[Love]], Olena
> ```

> [!quiz] Який знак ставлять у кінці питання?
> level: A1 · id: en-a1-read-write-q14
> - [ ] full stop
> - [ ] comma
> - [x] question mark
> - [ ] apostrophe
>
> **Пояснення:** *Where do you live?* — у кінці *question mark* (?). *Full stop* (.) — у кінці звичайного речення.

## Фішки

> [!reel] 🔠 Чому «I» завжди велике?
> У середньовічних рукописах самотня маленька «i» губилася поміж інших літер і зливалася з сусідніми словами. Писарі почали робити її високою — і звичка закріпилася. Тому *I* велике навіть посеред речення.

> [!reel] 🏖️ Wish you were here!
> Найвідоміша фраза з британських листівок — *Wish you were here!* («Шкода, що тебе тут немає!»). Її пишуть так часто, що вона стала кліше. Так називається й відома пісня Pink Floyd (1975).

> [!reel] 📅 Одна дата — два дні народження
> 05/06 для британця — 5 червня, для американця — 6 травня. Через це в міжнародних анкетах часто просять формат DD/MM/YYYY або місяць словами. Сумніваєшся — пиши *5 June*.

## Джерела та що почитати

- [British Council LearnEnglish — Reading A1](https://learnenglish.britishcouncil.org/skills/reading/a1-reading) — вивіски, оголошення, короткі повідомлення.
- [British Council LearnEnglish — Writing A1](https://learnenglish.britishcouncil.org/skills/writing/a1-writing) — анкети, листівки, повідомлення про себе.
- [Cambridge English — A2 Key: Reading and Writing](https://www.cambridgeenglish.org/exams-and-tests/key/) — формат «оголошення + питання» і коротке повідомлення.
- Oxford Learner's Dictionaries — розділ *Punctuation* (full stop, comma, apostrophe).

> [!important] Підсумок
> - Вивіски й оголошення читай за ключовими словами: тема → деталь (ціна, час, телефон).
> - Анкета: *first name* — імʼя, *surname* — прізвище, *date of birth* — дата (день / місяць у Британії).
> - Листівка: *Dear Anna,* → де ти → що робиш → погода → *Love, / Best wishes,* + імʼя.
> - З великої: **I**, дні, місяці, мови, країни, імена. Пори року — з малої.
> - Звʼязки: **and** (і), **but** (але), **because** (бо); одне речення — одна думка, у кінці крапка.
