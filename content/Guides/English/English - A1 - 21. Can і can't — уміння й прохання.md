---
title: Can і can't — уміння й прохання
order: 121
id: en-a1-can
level: A1
icon: px:dumbbell
tags: [english, a1, grammar, modal-verbs, can, requests]
prerequisites: ["[[English - A1 - 15. Present Simple — питання й заперечення]]"]
estimatedMinutes: 35
---

# Can і can't — уміння й прохання

> [!success] Після цієї теми ти зможеш
> - розповісти, що вмієш і чого не вмієш: *I can swim, but I can't drive.*;
> - спитати про вміння й коротко відповісти: *Can you cook? — Yes, I can.*;
> - попросити дозволу й допомоги: *Can I sit here? Could you help me, please?*;
> - на слух відрізнити *can* /kən/ від *can't* /kɑːnt/.

## Передбач

> [!quiz] Як сказати «Вона вміє плавати»?
> level: A1 · id: en-a1-can-q01
> - [x] She can swim.
> - [ ] She cans swim.
> - [ ] She can to swim.
> - [ ] She can swims.
>
> **Пояснення:** *can* ніколи не змінюється: без *-s*, без *to* після нього, а наступне дієслово — у «голій» формі: *She can swim.*

## Одне слово — і «вмію», і «можу»

Українською ми розрізняємо «вмію плавати» і «можу прийти». Англійською для обох — одне коротке ***can***:

| Що виражає | Приклад | Українською |
|---|---|---|
| уміння | *I **can** swim.* | Я вмію плавати. |
| можливість | *You **can** buy tickets online.* | Квитки можна купити онлайн. |
| дозвіл | ***Can** I sit here? — Sure!* | Можна тут сісти? — Звісно! |
| прохання | ***Can** you help me?* | Можеш мені допомогти? |

### Як побудувати речення

> [!diagram] can + дієслово без змін
> ```yaml
> layout: flow
> nodes:
>   - { id: who, label: "хто", text: "I", tone: blue }
>   - { id: can, label: "модальне", text: "can", tone: violet }
>   - { id: verb, label: "дієслово (базова форма)", text: "swim", tone: green }
> steps:
>   - { focus: [who, can, verb], note: "Схема проста: хто + can + дієслово. I can swim." }
>   - { set: { who: "She" }, focus: who, note: "Змінюємо підмет на she — і… нічого більше не змінюється: She can swim." }
>   - { focus: can, note: "Не «cans» ✗: у can ніколи немає -s. Однаково для I, you, he, she, we, they." }
>   - { focus: verb, note: "Не «to swim» ✗ і не «swims» ✗: після can — дієслово в чистому вигляді." }
>   - { set: { can: "can't" }, focus: can, note: "Заперечення — can't (або повне cannot, одним словом): She can't swim." }
> ```

| | Форма | Приклад |
|---|---|---|
| **+** | *can* + дієслово | *He **can** drive.* |
| **−** | *can't / cannot* + дієслово | *He **can't** drive. He **cannot** drive.* |
| **?** | *Can* + хто + дієслово? | ***Can** he drive?* |
| **коротка відповідь** | *Yes, … can. / No, … can't.* | *Yes, he **can**. / No, he **can't**.* |
| **wh-питання** | питальне слово + *can* + хто + дієслово? | *What **can** you cook? Where **can** I park?* |

Зверни увагу: жодного *do / does*. Не ~~Do you can swim?~~, а ***Can you swim?***

Щоб уточнити, **як добре** вмієш, додай у кінець *well, very well, a bit* або *not … at all*:
*I can cook **very well**. I can speak English **a bit**. I **can't** dance **at all**.*

## Прохання й дозвіл: can чи could

| | Нейтрально | Ввічливіше |
|---|---|---|
| попросити дозволу | ***Can I** open the window?* | ***Could I** open the window?* |
| попросити когось | ***Can you** help me?* | ***Could you** help me, please?* |

*Could* тут не про минуле — це просто мʼякша, ввічливіша форма. З незнайомими людьми, у магазині, на роботі — ***Could you…, please?***

Як відповісти:

| Так | Ні |
|---|---|
| *Sure. / Of course. / Yes, no problem.* | *Sorry, I can't. / I'm afraid not.* |

> [!quiz] Перевір себе: «Can you speak Spanish?» — як коротко сказати «ні»?
> level: A1 · id: en-a1-can-q02
> - [x] No, I can't.
> - [ ] No, I don't.
> - [ ] No, I'm not.
> - [ ] No, I can't speak.
>
> **Пояснення:** коротка відповідь повторює дієслово з питання: питали з *can* — відповідаємо *can / can't*.

## Can чи can't — як почути різницю

Найбільша пастка — на слух. У ствердженні *can* **слабке й коротке** — /kən/, «кəн», а наголос падає на дієслово. *Can't* завжди **наголошене**, а в британській вимові ще й з довгим /ɑː/.

> [!diagram] I can swim чи I can't swim — слухаємо наголос
> ```yaml
> layout: compare
> columns: { yes: "can — так", no: "can't — ні" }
> nodes:
>   - { id: y1, col: yes, label: "речення", text: "I can SWIM.", tone: green }
>   - { id: y2, col: yes, label: "звучить", text: "/aɪ kən ˈswɪm/", note: "«ай кəн СВІМ»", tone: green }
>   - { id: n1, col: no, label: "речення", text: "I CAN'T swim.", tone: red }
>   - { id: n2, col: no, label: "звучить", text: "/aɪ ˈkɑːnt ˈswɪm/", note: "«ай КАНТ свім»", tone: red }
> steps:
>   - { show: [y1, y2], note: "У ствердженні can майже зникає: коротке «кəн». Гучно звучить дієслово — SWIM." }
>   - { show: [n1, n2], note: "У запереченні can't наголошене й довге: «КАНТ». Навіть якщо t не чути, довгий голосний підкаже «ні»." }
>   - { focus: [y1, n1], note: "Порівняй ритм: ай-кəн-СВІМ проти ай-КАНТ-свім. В американській can't — /kænt/, але наголос працює так само." }
> ```

Сильне /kæn/ звучить лише тоді, коли *can* стоїть сам або на ньому логічний наголос: *Yes, I **can**. I think I **can**!*

## Приклади

- I can swim, but I can't dive. — Я вмію плавати, але не вмію пірнати.
- My grandma can't use a smartphone. — Моя бабуся не вміє користуватися смартфоном.
- Can you drive? — Yes, I can. — Ти вмієш водити? — Так, умію.
- You can't park here. — Тут не можна паркуватися.
- Can I borrow your charger? — Sure, here you are. — Можна позичити твою зарядку? — Звісно, тримай.
- Could you say that again, please? — Не могли б ви повторити?
- We can meet at six or seven. — Можемо зустрітися о шостій або о сьомій.
- What languages can you speak? — Якими мовами ти розмовляєш?
- He can play the guitar really well. — Він дуже добре грає на гітарі.
- I'm sorry, I can't come tomorrow. — Вибач, я завтра не зможу прийти.

## Слова

> [!word] can
> ipa: /kæn/ · pos: verb · level: A1 · id: en-a1-can-w01
> uk: могти; уміти
> example: I **can** speak a little English. — Я трохи розмовляю англійською.
> note: у реченні зазвичай слабке /kən/. Ніколи не має *-s* і *to* після себе.

> [!word] can't
> ipa: /kɑːnt/ · ipa-us: /kænt/ · pos: verb · level: A1 · id: en-a1-can-w02
> uk: не могти; не вміти
> example: I **can't** find my keys! — Не можу знайти ключі!
> note: повна форма — *cannot*, одним словом.

> [!word] could
> ipa: /kʊd/ · pos: verb · level: A1 · id: en-a1-can-w03
> uk: міг би (ввічливе прохання)
> example: **Could** you help me, please? — Не могли б ви мені допомогти?
> note: *l* не читається: «куд». Ввічливіше, ніж *can*.

> [!word] swim
> ipa: /swɪm/ · pos: verb · level: A1 · id: en-a1-can-w04
> uk: плавати
> example: Can you **swim**? — Ти вмієш плавати?
> forms: swim → swam → swum

> [!word] drive
> ipa: /draɪv/ · pos: verb · level: A1 · id: en-a1-can-w05
> uk: водити (машину), кермувати
> example: My dad can't **drive**. — Мій тато не вміє водити.
> forms: drive → drove → driven

> [!word] ride
> ipa: /raɪd/ · pos: verb · level: A1 · id: en-a1-can-w06
> uk: їздити (верхи, на велосипеді)
> example: My son can **ride** a bike. — Мій син уміє їздити на велосипеді.
> forms: ride → rode → ridden
> note: *ride a bike / a horse*, але *drive a car*.

> [!word] cook
> ipa: /kʊk/ · pos: verb · level: A1 · id: en-a1-can-w07
> uk: готувати (їжу); кухар
> example: I can **cook** pasta and pancakes. — Я вмію готувати пасту й млинці.
> note: як іменник — кухар: *She's a good cook.* Плита — *cooker*.

> [!word] sing
> ipa: /sɪŋ/ · pos: verb · level: A1 · id: en-a1-can-w08
> uk: співати
> example: She can **sing** really well. — Вона дуже гарно співає.
> forms: sing → sang → sung
> note: у кінці носовий звук /ŋ/, «г» майже не чути.

> [!word] dance
> ipa: /dɑːns/ · ipa-us: /dæns/ · pos: verb · level: A1 · id: en-a1-can-w09
> uk: танцювати
> example: I can't **dance** at all! — Я зовсім не вмію танцювати!

> [!word] draw
> ipa: /drɔː/ · pos: verb · level: A1 · id: en-a1-can-w10
> uk: малювати (олівцем, ручкою)
> example: Can you **draw** a cat? — Можеш намалювати кота?
> forms: draw → drew → drawn
> note: фарбами — *paint*.

> [!word] play the guitar
> ipa: /pleɪ ðə ɡɪˈtɑː/ · ipa-us: /pleɪ ðə ɡɪˈtɑːr/ · pos: phrase · level: A1 · id: en-a1-can-w11
> uk: грати на гітарі
> example: He can **play the guitar** and the piano. — Він уміє грати на гітарі й піаніно.
> note: з музичними інструментами — *the*: *play the piano, play the violin*.

> [!word] ski
> ipa: /skiː/ · pos: verb · level: A1 · id: en-a1-can-w12
> uk: кататися на лижах
> example: We can **ski**, but we can't snowboard. — Ми вміємо кататися на лижах, але не на сноуборді.

> [!word] climb
> ipa: /klaɪm/ · pos: verb · level: A1 · id: en-a1-can-w13
> uk: лазити; підійматися
> example: Cats can **climb** trees. — Коти вміють лазити по деревах.
> note: *b* у кінці не читається: «клайм».

> [!word] fix
> ipa: /fɪks/ · pos: verb · level: A1 · id: en-a1-can-w14
> uk: лагодити; ремонтувати
> example: Can you **fix** my bike? — Можеш полагодити мій велосипед?

> [!word] borrow
> ipa: /ˈbɒrəʊ/ · ipa-us: /ˈbɑːroʊ/ · pos: verb · level: A1 · id: en-a1-can-w15
> uk: позичати (брати на час)
> example: Can I **borrow** your pen? — Можна позичити твою ручку?
> note: *borrow* — брати в когось; давати комусь — *lend*.

> [!word] carry
> ipa: /ˈkæri/ · pos: verb · level: A1 · id: en-a1-can-w16
> uk: нести; носити
> example: Can you **carry** this box? It's heavy. — Можеш понести цю коробку? Вона важка.

> [!word] use
> ipa: /juːz/ · pos: verb · level: A1 · id: en-a1-can-w17
> uk: користуватися; використовувати
> example: Can I **use** your phone? — Можна скористатися твоїм телефоном?
> note: дієслово — з /z/ у кінці; іменник *a use* — з /s/.

> [!word] well
> ipa: /wel/ · pos: adv · level: A1 · id: en-a1-can-w18
> uk: добре
> example: She can swim very **well**. — Вона дуже добре плаває.
> note: *good* — прикметник, *well* — прислівник: *a good swimmer — swims well*.

> [!word] at all
> ipa: /ət ˈɔːl/ · pos: phrase · level: A1 · id: en-a1-can-w19
> uk: зовсім (не); анітрохи
> example: I can't cook **at all**. — Я зовсім не вмію готувати.
> note: лише в запереченнях і питаннях; стоїть у кінці.

> [!word] of course
> ipa: /əv ˈkɔːs/ · ipa-us: /əv ˈkɔːrs/ · pos: phrase · level: A1 · id: en-a1-can-w20
> uk: звісно; авжеж
> example: Can I sit here? — **Of course!** — Можна тут сісти? — Звісно!
> note: на прохання — дружньо. А у відповідь на звичайне питання (*Do you like music?*) *Of course!* може звучати як «очевидно ж!».

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-can-l01
> audio: I can't drive.
> - [ ] I can drive.
> - [x] I can't drive.
> - [ ] I can't dance.

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-can-l02
> audio: Can you play the guitar?
> - [x] Can you play the guitar?
> - [ ] Can you play the piano?
> - [ ] You can play the guitar.

> [!listen] Напиши або скажи, що почуєш
> level: A1 · type: dictation · speed: slow · id: en-a1-can-l03
> audio: Could you open the window, please?

> [!listen] Напиши або скажи, що почуєш
> level: A1 · type: dictation · speed: slow · id: en-a1-can-l04
> audio: She can speak three languages.

> [!listen] Чого НЕ вміє брат?
> level: A1 · type: answer · speed: slow · id: en-a1-can-l05
> audio: My brother can swim and he can ride a horse, but he can't drive.
> - [ ] Плавати
> - [ ] Їздити верхи
> - [x] Водити машину

## Вимова

> [!pair] I can swim /aɪ kən ˈswɪm/ — I can't swim /aɪ ˈkɑːnt ˈswɪm/
> level: A1 · id: en-a1-can-p01
> say: I can't swim
> tip: «так» — коротке «кəн» і наголос на *swim*; «ні» — довге наголошене «КАНТ».

> [!pair] She can drive /ʃi kən ˈdraɪv/ — She can't drive /ʃi ˈkɑːnt ˈdraɪv/
> level: A1 · id: en-a1-can-p02
> say: She can drive
> tip: слухай, на що падає наголос: на *drive* — це «вміє».

> [!pair] We can come /wi kən ˈkʌm/ — We can't come /wi ˈkɑːnt ˈkʌm/
> level: A1 · id: en-a1-can-p03
> say: We can't come
> tip: *t* у *can't* перед приголосним часто «ковтають» — орієнтуйся на довгий /ɑː/ і наголос.

> [!pair] He can cook /hi kən ˈkʊk/ — He can't cook /hi ˈkɑːnt ˈkʊk/
> level: A1 · id: en-a1-can-p04
> say: He can cook
> tip: «кəн КУК» — ритм «та-та-ТАМ»; «КАНТ кук» — «та-ТАМ-та».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-can-s01
> text: I can swim, but I can't ski.
> ipa: /aɪ kən ˈswɪm bət aɪ ˈkɑːnt ˈskiː/
> tip: перше *can* — слабке «кəн», друге *can't* — гучне й довге «КАНТ».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-can-s02
> text: Can you drive? Yes, I can.
> ipa: /kən jə ˈdraɪv jes aɪ ˈkæn/
> tip: у питанні *can* слабке, у відповіді — сильне /kæn/ з відкритим «е-а».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-can-s03
> text: Could you help me, please?
> ipa: /kʊd jə ˈhelp mi pliːz/
> tip: *could* — «куд», без «л». *Help* починається з легкого видиху /h/, не з «г».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-can-s04
> text: I can't cook at all.
> ipa: /aɪ ˈkɑːnt ˈkʊk ət ˈɔːl/
> tip: *at all* звучить злито: «ə-ТОЛ».

## Типові помилки українців

> [!pitfall] «I can to swim», «She cans», «He can swims»
> Після *can* — дієслово без *to* і без *-s*: *I can swim. She can swim.* Сам *can* теж ніколи не отримує *-s*.

> [!pitfall] «Do you can…?», «I don't can»
> *Can* сам будує питання й заперечення — *do* йому не потрібне: ***Can** you cook? I **can't** cook.*

> [!pitfall] «Give me your pen» замість прохання
> Українське «Дай ручку» між друзями — норма, а англійською наказовий спосіб у проханні звучить грубувато. Кажи ***Can I borrow** your pen?* або ***Could you pass** me the pen, please?*

> [!pitfall] Чуємо «can», а сказали «can't»
> У швидкому мовленні *t* у *can't* часто не чути. Орієнтуйся на **наголос і довжину**: «кəн СВІМ» — уміє, «КАНТ свім» — не вміє. Сумніваєшся — перепитай: *Sorry, can or can't?*

## Ситуація: у бібліотеці

> [!listen] Послухай діалог. Що B НЕ може зробити?
> level: A1 · type: answer · speed: slow · id: en-a1-can-l06
> audio: A: Excuse me, can I sit here?
> audio: B: Of course.
> audio: A: Thanks. Sorry, can I borrow your pen?
> audio: B: Sure, here you are.
> audio: A: And could you watch my bag for a minute?
> audio: B: Sorry, I can't. I'm leaving now.
> - [ ] Дозволити сісти поруч
> - [ ] Позичити ручку
> - [x] Наглянути за сумкою

Тепер ти — A. Попроси вголос:

> [!speak] «Перепрошую, можна тут сісти?»
> level: A1 · id: en-a1-can-s05
> text: Excuse me, can I sit here?
> ipa: /ɪkˈskjuːz mi kən aɪ ˈsɪt hɪə/
> tip: *excuse* — «ік-СКЮЗ» з дзвінким /z/. *Sit* — короткий /ɪ/; з довгим /iː/ вийде інше слово.

> [!speak] «Не могли б ви хвилинку наглянути за моєю сумкою?»
> level: A1 · id: en-a1-can-s06
> text: Could you watch my bag for a minute?
> ipa: /kʊd jə ˈwɒtʃ maɪ ˈbæɡ fər ə ˈmɪnɪt/
> tip: *bag* — відкритий /æ/ і дзвінке /ɡ/ у кінці: не «бек». *Minute* — «МІ-ніт».

## Практика

> [!quiz] Заповни пропуски: can чи can't
> level: A1 · type: fill · bank · id: en-a1-can-q03
>
> ```text fill
> I'm sorry, I [[can't]] come to your party. I'm very busy.
> [[Can]] you help me with my bag?
> Fish [[can]] swim, but they [[can't]] walk.
> ```
>
> **Пояснення:** «не можу прийти» — *can't come*; прохання — *Can you…?*; що риби вміють і чого не вміють — *can / can't*.

> [!quiz] Яке прохання найввічливіше?
> level: A1 · id: en-a1-can-q04
> - [ ] Open the window.
> - [ ] You open the window.
> - [ ] Can open the window?
> - [x] Could you open the window, please?
>
> **Пояснення:** *Could you…, please?* — мʼяке, ввічливе прохання. Наказ *Open the window* без *please* звучить різко.

> [!quiz] Склади прохання: «Можна позичити твою ручку?»
> level: A1 · type: order · id: en-a1-can-q05
>
> ```text order
> Can
> I
> borrow
> your pen?
> to borrow # ✗
> ```
>
> **Пояснення:** *Can + I + дієслово без to*. Беремо собі — *borrow*.

> [!quiz] Що виражає «Can I use your phone?»
> level: A1 · id: en-a1-can-q06
> - [ ] уміння
> - [x] прохання дозволу
> - [ ] пораду
> - [ ] наказ
>
> **Пояснення:** *Can I…?* — «можна мені…?», тобто просимо дозволу.

> [!quiz] Заповни пропуски, перекладаючи підказки
> level: A1 · type: fill · bank: very, good · id: en-a1-can-q07
>
> ```text fill
> Я зовсім не вмію танцювати.     →  I can't dance [[at all]].
> Він добре грає на гітарі.       →  He can play the guitar [[well]].
> Можна тут сісти? — Звісно!      →  Can I sit here? — [[Of course]]!
> ```
>
> **Пояснення:** *at all* підсилює заперечення, *well* — прислівник «добре» (не *good*), *Of course* — «звісно».

> [!quiz] Склади речення: «Моя сестра розмовляє трьома мовами».
> level: A1 · type: order · id: en-a1-can-q08
>
> ```text order
> My sister
> can
> speak
> three languages.
> speaks # ✗
> ```
>
> **Пояснення:** про знання мов природно говорити з *can*. Після *can* — *speak* без *-s*.

> [!quiz] Як правильно написати заперечну форму повністю?
> level: A1 · id: en-a1-can-q09
> - [x] cannot
> - [ ] cann't
> - [ ] can'not
> - [ ] cant
>
> **Пояснення:** повна форма — *cannot*, одним словом. Скорочено — *can't* з апострофом.

> [!quiz] У якому реченні can звучить сильно — /kæn/?
> level: A1 · id: en-a1-can-q10
> - [ ] I can swim.
> - [ ] We can go now.
> - [x] Yes, I can.
> - [ ] She can cook.
>
> **Пояснення:** у короткій відповіді *can* стоїть у кінці й наголошене — /kæn/. У решті речень воно слабке /kən/, а наголос на дієслові.

> [!quiz] Склади питання: «Що ти вмієш готувати?»
> level: A1 · type: order · id: en-a1-can-q11
>
> ```text order
> What
> can
> you
> cook?
> do # ✗
> ```
>
> **Пояснення:** питальне слово + *can* + хто + дієслово. Жодного *do*.

> [!quiz] Заповни пропуски в діалозі
> level: A1 · type: fill · bank · id: en-a1-can-q12
>
> ```text fill
> Can you drive? — No, I [[can't]]. But I [[can]] ride a bike.
> ```
>
> **Пояснення:** коротка відповідь — *No, I can't*; далі ствердження — *I can ride*.

## Фішки

> [!reel] 🧠 *Can* колись означало «знати»
> Давньоанглійське *cunnan* означало «знати, вміти». Воно споріднене з *know* і з *cunning* — хитрий, «знаючий». Тому *I can swim* — дослівно «я знаю, як плавати».

> [!reel] 🥫 Can you open a can?
> «Можеш відкрити бляшанку?» Модальне *can* і бляшанка *a can* — випадкові близнюки: друге походить від давнього слова «посудина». Пишуться й звучать однаково.

> [!reel] 🗽 can't у Лондоні й Нью-Йорку
> Британець каже /kɑːnt/ — «КАНТ», з довгим «а». Американець — /kænt/, майже як *can*. Тому в США «ні» розпізнають за наголосом: *I CAN'T go* проти *I can GO*.

## Джерела та що почитати

- [Cambridge Dictionary — Can](https://dictionary.cambridge.org/grammar/british-grammar/can) — форми й значення *can*.
- [Cambridge Dictionary — Could](https://dictionary.cambridge.org/grammar/british-grammar/could) — *could* у проханнях і пропозиціях.
- [Cambridge Dictionary — Can, could or may?](https://dictionary.cambridge.org/grammar/british-grammar/permission) — як просити дозволу.
- [Cambridge Dictionary — Requests](https://dictionary.cambridge.org/grammar/british-grammar/requests) — ввічливі прохання.
- [BBC Learning English](https://www.bbc.co.uk/learningenglish) — вправи на вимову *can / can't*.
- R. Murphy — *Essential Grammar in Use*, розділ про *can / can't* і *could*.

> [!important] Підсумок
> - *can* — «вмію, можу, можна»: уміння, можливість, дозвіл, прохання.
> - *can* + дієслово без *to* і без *-s*, однаково для всіх осіб; питання й заперечення — без *do*.
> - *can't* = *cannot* (одним словом). Короткі відповіді: *Yes, I can. / No, I can't.*
> - Ввічливо: *Could you…, please? Could I…?*
> - На слух: *can* — слабке «кəн», *can't* — наголошене «КАНТ».
