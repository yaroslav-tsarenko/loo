---
title: Present Continuous — що відбувається зараз
order: 126
id: en-a1-present-continuous
level: A1
icon: px:hourglass
tags: [english, a1, grammar, present-continuous, tenses]
prerequisites: ["[[English - A1 - 15. Present Simple — питання й заперечення]]", "[[English - A1 - 03. Дієслово to be — am, is, are]]"]
estimatedMinutes: 40
---

# Present Continuous — що відбувається зараз

> [!success] Після цієї теми ти зможеш
> - сказати, що відбувається просто зараз: *I'm cooking. She's talking on the phone.*;
> - заперечити й спитати: *It isn't raining. What are you doing?*;
> - правильно написати форму на *-ing*: *making, running, lying, studying*;
> - відрізнити звичку від того, що діється зараз: *I work in a bank* проти *I'm working from home today*;
> - знати, які дієслова не люблять *-ing*: *know, like, want, need*.

## Передбач

> [!quiz] Подруга дзвонить, а ти зайнятий. Як сказати «Я зараз працюю»?
> level: A1 · id: en-a1-present-continuous-q01
> - [ ] I work now.
> - [x] I'm working now.
> - [ ] I working now.
> - [ ] I am work now.
>
> **Пояснення:** про дію, що триває **просто зараз**, кажуть *am / is / are* + дієслово з *-ing*: *I'm working*. *I work* — це «я працюю взагалі» (звичка, факт).

## Одне українське «працюю» — два англійські часи

Українською «Я працюю» може означати і «я маю роботу», і «я саме зараз працюю». В англійській ці два значення розрізняють:

- **Present Simple** — звички, факти, «завжди так»: *I **work** in a bank.* (див. [[English - A1 - 14. Present Simple — стверджувальні речення]])
- **Present Continuous** — дія **в процесі**, зараз або в цей період: *I'm **working** from home today.*

> [!diagram] Present Continuous на шкалі часу
> ```yaml
> layout: timeline
> nodes:
>   - { id: start, at: "19:00", text: "Olya starts cooking.", note: "дія почалася", tone: gray }
>   - { id: now, at: "ЗАРАЗ · 19:20", text: "Olya is cooking.", note: "дія в процесі", tone: green }
>   - { id: end, at: "19:45", text: "Dinner is ready!", note: "дія закінчиться", tone: gray }
> steps:
>   - { show: start, focus: start, note: "О сьомій Оля почала готувати вечерю." }
>   - { show: now, note: "Ти дзвониш о 19:20 — дія ще триває: Olya is cooking. Вона «всередині» процесу." }
>   - { show: end, note: "Згодом дія закінчиться, але зараз вона в розпалі. Саме це й показує Present Continuous." }
>   - { focus: now, note: "Сигнальні слова: now, right now, at the moment, Look!, Listen!" }
> ```

## Як будувати

Формула: **хто + am / is / are + дієслово-ing**. Тобто *to be* з теми [[English - A1 - 03. Дієслово to be — am, is, are]] плюс «процесна» форма дієслова.

> [!diagram] be + -ing: два шматки, обидва обовʼязкові
> ```yaml
> layout: flow
> nodes:
>   - { id: who, label: "хто", text: "I", tone: blue }
>   - { id: be, label: "am / is / are", text: "am", tone: violet }
>   - { id: ing, label: "дієслово + -ing", text: "reading", tone: green }
> steps:
>   - { focus: [who, be, ing], note: "I am reading — я (зараз) читаю. Скорочено — I'm reading." }
>   - { set: { who: "She", be: "is" }, focus: [who, be], note: "Для he / she / it — is: She's reading." }
>   - { set: { who: "They", be: "are", ing: "playing" }, focus: [who, be, ing], note: "Для you / we / they — are: They're playing." }
>   - { set: { be: "aren't" }, focus: be, note: "Заперечення — not до be: They aren't playing. I'm not reading." }
>   - { focus: [be, ing], note: "Без be — помилка («I reading» ✗). Без -ing — теж («I am read» ✗). Потрібні обидва шматки." }
> ```

| | Форма | Приклад |
|---|---|---|
| **+** | *I'm / he's / she's / it's / we're / you're / they're* + *-ing* | *She's **talking** on the phone.* |
| **−** | *I'm not / isn't / aren't* + *-ing* | *It **isn't raining**. We **aren't watching** TV.* |
| **?** | *Am / Is / Are* + хто + *-ing*? | ***Are** you **listening**? **Is** he **sleeping**?* |
| **коротка відповідь** | *Yes, I am. / No, I'm not.* | *Is it raining? — Yes, it **is**. / No, it **isn't**.* |
| **wh-питання** | питальне слово + *am / is / are* + хто + *-ing*? | *What **are** you **doing**? Where **is** she **going**?* |

### Правопис -ing

| Правило | Приклади |
|---|---|
| зазвичай — просто *+ing* | *read → reading, play → playing, study → studying, see → seeing* |
| *-e*, яке не читається, у кінці зникає | *make → making, write → writing, dance → dancing* (але *see → seeing*) |
| короткий наголошений голосний + один приголосний → подвоєння | *run → running, sit → sitting, swim → swimming, stop → stopping* |
| *-ie* → *-y* | *lie → lying, die → dying* |
| не подвоюємо *w, x, y*, а також коли останній склад ненаголошений | *fix → fixing, play → playing, visit → visiting* |

У британському варіанті ще подвоюють *l*: *travel → travelling* (US *traveling*).

> [!quiz] Перевір себе: як правильно написати run + -ing?
> level: A1 · id: en-a1-present-continuous-q02
> - [ ] runing
> - [x] running
> - [ ] runnning
> - [ ] runeing
>
> **Пояснення:** *run* — короткий голосний + один приголосний, тому *n* подвоюється: *running*. Так само *sitting, swimming, stopping*.

## Коли вживати

1. **Просто зараз**: *Shh! The baby **is sleeping**. Look! It's **snowing**!*
2. **У цей період** (тимчасово, навколо «зараз»): *I'm **reading** a great book this week. We're **staying** at a hotel.*
3. Сигнали: ***now, right now, at the moment, today, this week, Look!, Listen!***

### Present Simple чи Present Continuous

> [!diagram] Звичка чи процес
> ```yaml
> layout: compare
> columns: { simple: "Present Simple — завжди, звичка", cont: "Present Continuous — зараз, тимчасово" }
> nodes:
>   - { id: s1, col: simple, text: "I work in a bank.", note: "моя робота взагалі", tone: blue }
>   - { id: s2, col: simple, text: "She usually drives to work.", note: "звичка", tone: blue }
>   - { id: s3, col: simple, text: "It rains a lot in London.", note: "факт", tone: blue }
>   - { id: c1, col: cont, text: "I'm working from home today.", note: "лише сьогодні", tone: green }
>   - { id: c2, col: cont, text: "She's walking today — her car is broken.", note: "зараз інакше", tone: green }
>   - { id: c3, col: cont, text: "Look! It's raining.", note: "у цю хвилину", tone: green }
> steps:
>   - { show: [s1, c1], note: "Робота в банку — постійний факт (Simple). Робота з дому — лише сьогодні (Continuous)." }
>   - { show: [s2, c2], note: "Зазвичай їздить машиною — звичка. Сьогодні йде пішки — тимчасово." }
>   - { show: [s3, c3], note: "У Лондоні часто дощить — факт. Дивись, дощ! — те, що відбувається зараз." }
> ```

### Дієслова, які не люблять -ing

Деякі дієслова описують **стан**, а не дію: думки, почуття, бажання, володіння. Вони майже завжди в Present Simple, навіть коли йдеться про «зараз»:

***know, understand, like, love, hate, want, need, have*** (= мати, володіти)

- *I **know** the answer.* — не ~~I'm knowing~~
- *She **wants** a coffee now.* — не ~~is wanting~~
- *I **have** a car.* — не ~~I'm having a car~~. Але *I'm having breakfast* — можна: тут *have* = «їсти», це дія.

## Приклади

- What are you doing? — I'm watching a film. — Що ти робиш? — Дивлюся фільм.
- Shh! The children are sleeping. — Тихо! Діти сплять.
- She isn't working today. She's at home. — Вона сьогодні не працює. Вона вдома.
- Look! That man is running after the bus! — Дивись! Той чоловік біжить за автобусом!
- Are you listening to me? — Yes, I am! — Ти мене слухаєш? — Так!
- It's raining, so we're staying at home. — Іде дощ, тож ми сидимо вдома.
- I'm texting my mum — wait a second. — Пишу мамі повідомлення — секунду.
- Why is the baby crying? — Чому дитина плаче?
- We're visiting my grandparents this weekend. — Цими вихідними ми в гостях у бабусі й дідуся.
- I know you're tired, but we need to hurry. — Я знаю, що ти втомився, але треба поспішати.

## Слова

> [!word] at the moment
> ipa: /ət ðə ˈməʊmənt/ · ipa-us: /ət ðə ˈmoʊmənt/ · pos: phrase · level: A1 · id: en-a1-present-continuous-w01
> uk: зараз; у цей момент
> example: She's in a meeting **at the moment**. — Вона зараз на нараді.

> [!word] right now
> ipa: /ˌraɪt ˈnaʊ/ · pos: phrase · level: A1 · id: en-a1-present-continuous-w02
> uk: просто зараз; цієї ж миті
> example: I'm busy **right now**. Can I call you back? — Я зараз зайнятий. Можна я передзвоню?

> [!word] now
> ipa: /naʊ/ · pos: adv · level: A1 · id: en-a1-present-continuous-w03
> uk: зараз; тепер
> example: What are you doing **now**? — Що ти зараз робиш?

> [!word] talk on the phone
> ipa: /tɔːk ɒn ðə ˈfəʊn/ · ipa-us: /tɑːk ɑːn ðə ˈfoʊn/ · pos: phrase · level: A1 · id: en-a1-present-continuous-w04
> uk: говорити по телефону
> example: Shh! Dad is **talking on the phone**. — Тихо! Тато говорить по телефону.
> note: *on the phone*, а не ~~by the phone~~.

> [!word] look
> ipa: /lʊk/ · pos: verb · level: A1 · id: en-a1-present-continuous-w05
> uk: дивитися; глянути
> example: **Look!** It's snowing! — Дивись! Сніг іде!
> note: дивитися на щось — *look **at***: *Look at that dog!*

> [!word] take a photo
> ipa: /teɪk ə ˈfəʊtəʊ/ · ipa-us: /teɪk ə ˈfoʊtoʊ/ · pos: phrase · level: A1 · id: en-a1-present-continuous-w06
> uk: фотографувати; сфотографувати
> example: Smile! I'm **taking a photo**. — Усміхніться! Я фотографую.
> note: *take*, а не ~~make a photo~~ — типова калька з «зробити фото».

> [!word] whisper
> ipa: /ˈwɪspə/ · ipa-us: /ˈwɪspər/ · pos: verb · level: A1 · id: en-a1-present-continuous-w07
> uk: шепотіти
> example: Why are you **whispering**? — Чому ти шепочеш?
> note: *wh* тут читається як /w/: «ВІС-пə».

> [!word] text
> ipa: /tekst/ · pos: verb · level: A1 · id: en-a1-present-continuous-w08
> uk: писати повідомлення (SMS, у месенджері)
> example: Stop **texting** and eat your dinner! — Годі писати повідомлення, їж вечерю!
> note: як іменник — текст або повідомлення: *I got your text.*

> [!word] tidy
> ipa: /ˈtaɪdi/ · pos: verb · level: A1 · id: en-a1-present-continuous-w09
> uk: прибирати; наводити лад
> example: I'm **tidying** my room. — Я прибираю в кімнаті.
> note: часто *tidy up*. Як прикметник — охайний: *a tidy room*.

> [!word] chat
> ipa: /tʃæt/ · pos: verb · level: A1 · id: en-a1-present-continuous-w10
> uk: балакати; спілкуватися (в чаті)
> example: The girls are **chatting** in the kitchen. — Дівчата балакають на кухні.
> note: подвоєння: *chat → chatting*.

> [!word] clean
> ipa: /kliːn/ · pos: verb · level: A1 · id: en-a1-present-continuous-w11
> uk: прибирати; чистити
> example: I'm **cleaning** the kitchen. — Я прибираю на кухні.
> note: як прикметник — чистий: *a clean shirt*.

> [!word] do the shopping
> ipa: /duː ðə ˈʃɒpɪŋ/ · ipa-us: /duː ðə ˈʃɑːpɪŋ/ · pos: phrase · level: A1 · id: en-a1-present-continuous-w12
> uk: купувати продукти; робити покупки
> example: Mum is **doing the shopping** at the supermarket. — Мама купує продукти в супермаркеті.
> note: *go shopping* — ходити по магазинах для задоволення; *do the shopping* — звичайні щоденні покупки.

> [!word] download
> ipa: /ˌdaʊnˈləʊd/ · ipa-us: /ˌdaʊnˈloʊd/ · pos: verb · level: A1 · id: en-a1-present-continuous-w13
> uk: завантажувати (з інтернету)
> example: Wait, I'm **downloading** the tickets. — Зачекай, я завантажую квитки.
> note: як іменник — наголос на першому складі: *a DOWNload*.

> [!word] wait for
> ipa: /ˈweɪt fə/ · ipa-us: /ˈweɪt fər/ · pos: phrase · level: A1 · id: en-a1-present-continuous-w14
> uk: чекати (на когось, щось)
> example: I'm **waiting for** the bus. — Я чекаю на автобус.
> note: обовʼязково *for*: не ~~I'm waiting the bus~~.

> [!word] get ready
> ipa: /ɡet ˈredi/ · pos: phrase · level: A1 · id: en-a1-present-continuous-w15
> uk: збиратися; готуватися
> example: Wait a minute, I'm **getting ready**! — Хвилинку, я збираюся!
> note: *get → getting* — подвоєння *t*.

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-present-continuous-l01
> audio: She's watching TV.
> - [x] She's watching TV.
> - [ ] She watches TV.
> - [ ] She's washing the car.

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-present-continuous-l02
> audio: Are you listening to me?
> - [x] Are you listening to me?
> - [ ] Are they listening to me?
> - [ ] You're listening to me.

> [!listen] Напиши або скажи, що почуєш
> level: A1 · type: dictation · speed: slow · id: en-a1-present-continuous-l03
> audio: We're having dinner at the moment.

> [!listen] Напиши або скажи, що почуєш
> level: A1 · type: dictation · speed: slow · id: en-a1-present-continuous-l04
> audio: It isn't raining now.

> [!listen] Що зараз робить людина?
> level: A1 · type: answer · speed: slow · id: en-a1-present-continuous-l05
> audio: Hi! Sorry, I can't talk now. I'm on the bus. I'm going to the doctor.
> - [ ] Сидить у лікаря
> - [x] Їде автобусом до лікаря
> - [ ] Чекає на автобус удома

## Вимова

> [!speak] Скажи вголос
> level: A1 · id: en-a1-present-continuous-s01
> text: What are you doing?
> ipa: /ˈwɒt ə jə ˈduːɪŋ/
> tip: у швидкій мові *What are you* зливається: «вот-ə-йə». Наголос — на *What* і *doing*.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-present-continuous-s02
> text: I'm working from home today.
> ipa: /aɪm ˈwɜːkɪŋ frəm ˈhəʊm təˈdeɪ/
> tip: *-ing* — носовий /ŋ/ без «г» у кінці: «ВЕР-кін(г)», ледь чутно.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-present-continuous-s03
> text: Look! It's snowing!
> ipa: /ˈlʊk ɪts ˈsnəʊɪŋ/
> tip: *look* — короткий /ʊ/: «лук», не «луук». *Snowing* — «СНОУ-інг».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-present-continuous-s04
> text: She isn't listening.
> ipa: /ʃi ˈɪznt ˈlɪsnɪŋ/
> tip: *isn't* — дзвінке /z/: «ізнт». *Listening* — без «т»: «ЛІС-нінг».

## Типові помилки українців

> [!pitfall] «I reading», «She cooking» — забули be
> В українській допоміжного дієслова немає, тож його легко загубити. Present Continuous — це **завжди два шматки**: *I'**m** read**ing**. She'**s** cook**ing**.*

> [!pitfall] «I am work now» — забули -ing
> Друга половина помилки: *be* є, а *-ing* немає. *I am work* — так англійською не кажуть. Правильно: *I'**m** work**ing** now.*

> [!pitfall] «I'm going to the gym every day» про звичку
> Регулярні дії, розклад, «завжди» — Present Simple: *I **go** to the gym every day.* Present Continuous — лише про «зараз» і «в цей період».

> [!pitfall] «I'm knowing», «I'm wanting», «I'm understanding»
> Дієслова стану — *know, understand, like, love, want, need, have* (володіти) — у Present Simple навіть «зараз»: *I **know**. I **understand**. I **want** a coffee.*

## Ситуація: телефонна розмова

> [!listen] Послухай розмову. Що робить Макс?
> level: A1 · type: answer · speed: slow · id: en-a1-present-continuous-l06
> audio: A: Hi, Olya! What are you doing?
> audio: B: I'm cooking dinner. Max is helping me — well, he's eating the cheese!
> audio: A: Ha-ha! Are the kids sleeping?
> audio: B: No, they aren't. They're watching cartoons. Why?
> audio: A: Because I'm standing outside your door. Open it!
> - [x] Нібито допомагає готувати, а насправді їсть сир
> - [ ] Дивиться мультики з дітьми
> - [ ] Стоїть під дверима

Тепер ти — Оля. Відповідай уголос:

> [!speak] «Я зараз готую вечерю».
> level: A1 · id: en-a1-present-continuous-s05
> text: I'm cooking dinner at the moment.
> ipa: /aɪm ˈkʊkɪŋ ˈdɪnə ət ðə ˈməʊmənt/
> tip: *at the moment* — «əт-ðə-МОУ-мəнт», наголос на «МОУ».

> [!speak] «Діти дивляться мультики».
> level: A1 · id: en-a1-present-continuous-s06
> text: The kids are watching cartoons.
> ipa: /ðə ˈkɪdz ə ˈwɒtʃɪŋ kɑːˈtuːnz/
> tip: *watching* — /tʃ/ посередині: «ВО-чінг». *Cartoons* — наголос на «ТУНЗ».

## Практика

> [!quiz] Як правильно написати make + -ing?
> level: A1 · id: en-a1-present-continuous-q03
> - [x] making
> - [ ] makeing
> - [ ] makking
> - [ ] makin
>
> **Пояснення:** *-e*, яке не читається, у кінці зникає: *make → making, write → writing, dance → dancing*.

> [!quiz] Заповни пропуски: am, is чи are
> level: A1 · type: fill · bank · id: en-a1-present-continuous-q04
>
> ```text fill
> I [[am]] reading a book.
> My sister [[is]] cooking dinner.
> The kids [[are]] playing football in the garden.
> ```
>
> **Пояснення:** *I — am, he / she / it — is, you / we / they — are*. Друга частина — дієслово з *-ing*.

> [!quiz] Напиши форму з -ing
> level: A1 · type: fill · id: en-a1-present-continuous-q05
>
> ```text fill
> sit   →  [[sitting]]
> write →  [[writing]]
> play  →  [[playing]]
> lie   →  [[lying]]
> ```
>
> **Пояснення:** *sit* — подвоєння; *write* — без *e*; *play* — просто *+ing* (*y* не подвоюємо); *lie* — *ie* стає *y*.

> [!quiz] «My brother ___ in a bank, but today he ___ from home.»
> level: A1 · id: en-a1-present-continuous-q06
> - [ ] is working / works
> - [x] works / is working
> - [ ] works / works
> - [ ] is working / is working
>
> **Пояснення:** робота в банку — постійний факт (*works*), робота з дому — лише сьогодні (*is working*).

> [!quiz] Яке речення правильне?
> level: A1 · id: en-a1-present-continuous-q07
> - [x] I want a new phone.
> - [ ] I'm wanting a new phone.
> - [ ] I wanting a new phone.
> - [ ] I am want a new phone.
>
> **Пояснення:** *want* — дієслово стану, тому Present Simple навіть про «зараз».

> [!quiz] Склади питання: «Що ти робиш?»
> level: A1 · type: order · id: en-a1-present-continuous-q08
>
> ```text order
> What
> are
> you
> doing?
> do # ✗
> ```
>
> **Пояснення:** питальне слово + *are* + хто + *-ing*. Допоміжне тут — *be*, а не *do*.

> [!quiz] Склади речення: «Вона мене не слухає».
> level: A1 · type: order · id: en-a1-present-continuous-q09
>
> ```text order
> She
> isn't
> listening
> to me.
> doesn't # ✗
> ```
>
> **Пояснення:** заперечення Present Continuous — *isn't / aren't / I'm not* + *-ing*. *Doesn't* — для Present Simple.

> [!quiz] «Are you working?» — як коротко сказати «так»?
> level: A1 · id: en-a1-present-continuous-q10
> - [x] Yes, I am.
> - [ ] Yes, I'm.
> - [ ] Yes, I do.
> - [ ] Yes, I working.
>
> **Пояснення:** питали з *are* — відповідаємо *am*. У короткій відповіді «так» скорочення немає: *Yes, I am*, а не ~~Yes, I'm~~.

> [!quiz] Яке речення описує те, що відбувається саме зараз?
> level: A1 · id: en-a1-present-continuous-q11
> - [x] Look! It's raining.
> - [ ] It rains a lot in London.
> - [ ] It often rains in autumn.
> - [ ] Does it rain in summer?
>
> **Пояснення:** *Look!* і *It's raining* — процес у цю хвилину. Решта речень — загальні факти (Present Simple).

> [!quiz] Які дієслова зазвичай НЕ вживають з -ing? Кілька відповідей
> level: A1 · type: multi · id: en-a1-present-continuous-q12
> - [x] know
> - [x] like
> - [ ] read
> - [x] want
> - [ ] cook
>
> **Пояснення:** *know, like, want* — стани (знання, почуття, бажання). *Read* і *cook* — дії: *I'm reading, she's cooking*.

> [!quiz] Заповни пропуски в діалозі
> level: A1 · type: fill · bank: do, goes · id: en-a1-present-continuous-q13
>
> ```text fill
> Where [[are]] you going? — I'm [[going]] to the shop.
> ```
>
> **Пояснення:** питання — *are you going*, відповідь — *I'm going*. *Go → going* без змін.

> [!quiz] Склади речення: «Цього тижня ми живемо в готелі».
> level: A1 · type: order · id: en-a1-present-continuous-q14
>
> ```text order
> We
> are
> staying
> at a hotel
> this week.
> stay # ✗
> ```
>
> **Пояснення:** тимчасова ситуація — Present Continuous: *are staying*. *This week* — у кінці.

## Фішки

> [!reel] 🍔 «I'm lovin' it» — свідома помилка
> Слоган McDonald's порушує правило: *love* — дієслово стану, «правильно» *I love it*. Але *-ing* робить почуття живим, «просто зараз» — тому реклама так і звучить.

> [!reel] 🅿️ Паркінг, шопінг, кемпінг
> Українська позичила англійське *-ing* разом зі словами: *parking, shopping, camping, briefing*. В англійській це також іменники-«процеси»: *Shopping is fun.*

> [!reel] 🏃 Чому running, але visiting
> Подвоюємо приголосний, лише коли наголос на останньому складі: *RUN → running, beGIN → beginning*. А в *VISit* наголос на першому — тому *visiting*.

## Джерела та що почитати

- [Cambridge Dictionary — Present continuous](https://dictionary.cambridge.org/grammar/british-grammar/present-continuous) — форма, правопис і вживання.
- [Cambridge Dictionary — Present simple or present continuous?](https://dictionary.cambridge.org/grammar/british-grammar/present-simple-or-present-continuous) — як вибрати час.
- [Cambridge Dictionary — Spelling](https://dictionary.cambridge.org/grammar/british-grammar/spelling) — подвоєння приголосних і *-e*.
- [BBC Learning English](https://www.bbc.co.uk/learningenglish) — короткі уроки граматики з аудіо.
- R. Murphy — *Essential Grammar in Use*, розділи про Present Continuous і порівняння з Present Simple.

> [!important] Підсумок
> - Present Continuous — дія в процесі зараз або в цей період: *am / is / are + -ing*.
> - Заперечення: *I'm not / isn't / aren't + -ing*; питання: *Are you…ing? What are you doing?*
> - Правопис: *make → making, run → running, lie → lying, play → playing*.
> - Звичка й факт — Present Simple (*I work in a bank*), зараз і тимчасово — Continuous (*I'm working from home today*).
> - Дієслова стану без *-ing*: *know, understand, like, love, want, need, have* (володіти).
