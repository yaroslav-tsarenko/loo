---
title: Непряма мова — твердження, питання, прохання
order: 319
id: en-b1-reported-speech
level: B1
icon: px:bubbles
tags: [english, b1, grammar, reported-speech, say-tell, backshift, ielts]
prerequisites: ["[[English - B1 - 03. Наративні часи — Past Simple, Continuous і Perfect]]", "[[English - A2 - 15. Present Perfect чи Past Simple — just, already, yet]]"]
estimatedMinutes: 45
---

# Непряма мова — твердження, питання, прохання

> [!success] Після цієї теми ти зможеш
> - переказати чужі слова: *She said (that) she **was** tired.*;
> - правильно вживати **say** і **tell**: *He **said** that…* / *He **told me** that…*;
> - зсувати час назад (backshift) і міняти *I, today, here* на *he, that day, there*;
> - переказувати питання: *She asked **where I lived***, *He asked **if I was** OK*;
> - переказувати прохання й накази: *He **told us not to** be late.*

## Передбач

> [!quiz] Олег сказав тобі: «Я втомився». Як переказати це завтра?
> level: B1 · id: en-b1-reported-speech-q01
> - [ ] Oleh said me that he is tired.
> - [x] Oleh told me that he was tired.
> - [ ] Oleh told that he was tired.
> - [ ] Oleh said me he was tired.
>
> **Пояснення:** дві пастки. **tell** вимагає «кому»: *told **me***; **say** — без «кому» (або *said **to** me*). І час зсувається назад: *I'm tired* → *he **was** tired*.

## Простими словами

Українською ми переказуємо легко: «Олег сказав, що **втомився**» — час не міняється, міняємо лише особу. В англійській зазвичай роблять ще один крок: якщо дієслово переказу в минулому (*said, told, asked*), то й переказане **«відступає» на крок у минуле** — це називається **backshift**.

- *"I **am** tired."* → He said he **was** tired.
- *"I **will** call you."* → She said she **would** call me.
- *"I **can't** swim."* → He said he **couldn't** swim.

Логіка проста: ти розповідаєш про слова, які прозвучали **тоді**, тож усе в них стає «тодішнім».

> [!diagram] Пряма мова → непряма: три кроки
> ```yaml
> layout: flow
> nodes:
>   - { id: direct, label: "пряма мова", text: "Anna: \"I'm working today.\"", tone: blue, icon: "px:chat" }
>   - { id: reported, label: "непряма мова", text: "Anna said …", tone: green, icon: "px:bubbles" }
> edges:
>   - { from: direct, to: reported, label: "переказуємо" }
> steps:
>   - { focus: direct, note: "Анна сказала це в понеділок. Переказуємо в середу — коли «сьогодні» вже минуло." }
>   - { move: { from: direct, to: reported, value: "I → she" }, set: { reported: "Anna said she … working today." }, note: "Крок 1. Займенники: I → she (з погляду того, хто переказує)." }
>   - { move: { from: direct, to: reported, value: "am → was" }, set: { reported: "Anna said she was working today." }, note: "Крок 2. Backshift: Present Continuous → Past Continuous (am working → was working)." }
>   - { move: { from: direct, to: reported, value: "today → that day" }, set: { reported: "Anna said (that) she was working that day." }, note: "Крок 3. Слова часу й місця: today → that day. That після said можна опустити." }
> ```

## Пояснення

### Say чи tell?

| | Як будується | Приклад |
|---|---|---|
| **say** | say (that)… · say **something to** sb | She **said** (that) she was hungry. · He **said** hello **to** me. |
| **tell** | tell **sb** (that)… · tell sb **something** | She **told me** (that) she was hungry. · Tell **me** the truth. |

Коротко: **tell** — завжди з *кому* (*told me / him / us / Anna*); **say** — без *кому* або з **to**.

> [!quiz] Перевір себе: say чи tell?
> level: B1 · type: fill · bank · id: en-b1-reported-speech-q02
>
> ```text fill
> Maria [[told]] me that she was moving to Kraków.
> The doctor [[said]] it was nothing serious.
> Can you [[tell]] us what happened?
> He [[said]] goodbye to everyone and left.
> ```
>
> **Пояснення:** після **tell** — особа (*me, us*); **say** — без особи або *say goodbye **to** everyone*.

### Backshift — таблиця зсуву

| Пряма мова | Непряма мова |
|---|---|
| Present Simple: "I **live** in Kyiv." | Past Simple: He said he **lived** in Kyiv. |
| Present Continuous: "I'**m waiting**." | Past Continuous: She said she **was waiting**. |
| Present Perfect: "I'**ve finished**." | Past Perfect: He said he **had finished**. |
| Past Simple: "I **saw** it." | Past Perfect: She said she **had seen** it. (у розмові часто лишають *saw*) |
| will: "I'**ll help**." | would: He said he **would help**. |
| can: "I **can** come." | could: She said she **could** come. |
| may: "I **may** be late." | might: He said he **might** be late. |
| must: "I **must** go." | had to: She said she **had to** go. (або *must*) |

> [!tip] Коли не треба зсувати
> - Дієслово переказу в теперішньому: *She **says** she **is** tired.* (переказуєш щойно, по телефону)
> - Сказане **досі правда** — зсув необовʼязковий: *He said he **lives** in Kyiv* (і досі там живе). *Our teacher said the Earth **goes** round the Sun.*
> - *could, would, should, might* і Past Perfect не змінюються.

### Займенники, час і місце

| Пряма мова | Непряма мова |
|---|---|
| today | that day |
| tomorrow | the next day / the following day |
| yesterday | the day before / the previous day |
| next week | the following week |
| last week | the week before |
| now | then / at that time |
| here | there |
| this | that |
| … ago | … before |

Міняй лише те, що **справді змінилося**. Якщо переказуєш того ж дня — *He said he was busy **today***.

> [!quiz] Перевір себе: обери правильний переказ
> level: B1 · id: en-b1-reported-speech-q03
>
> Тиждень тому Ірина сказала: *"I'll call you tomorrow."*
>
> - [ ] Iryna said she will call me tomorrow.
> - [x] Iryna said she would call me the next day.
> - [ ] Iryna told she would call me the next day.
> - [ ] Iryna said me she would call the next day.
>
> **Пояснення:** *will → would*, *tomorrow → the next day* (бо «завтра» було тиждень тому), *said* без особи.

### Непрямі питання

У переказаному питанні — **прямий порядок слів, як у ствердженні**, без *do / does / did* і без знака питання.

> [!diagram] Пряме питання → непряме
> ```yaml
> layout: compare
> columns: { direct: "пряме питання", reported: "непряме (переказане)" }
> nodes:
>   - { id: d1, col: direct, label: "wh-питання", text: "\"Where do you live?\"", tone: blue }
>   - { id: r1, col: reported, text: "She asked me where I lived.", note: "без do, прямий порядок: I lived", tone: green }
>   - { id: d2, col: direct, label: "yes / no питання", text: "\"Are you hungry?\"", tone: blue }
>   - { id: r2, col: reported, text: "He asked if / whether I was hungry.", note: "if або whether замість «чи»", tone: green }
>   - { id: d3, col: direct, label: "прохання", text: "\"Please close the door.\"", tone: blue }
>   - { id: r3, col: reported, text: "She asked me to close the door.", note: "ask / tell + sb + to V1", tone: green }
>   - { id: d4, col: direct, label: "наказ «не…»", text: "\"Don't be late!\"", tone: blue }
>   - { id: r4, col: reported, text: "He told us not to be late.", note: "not to — заперечення перед to", tone: green }
> steps:
>   - { show: [d1, r1], note: "Wh-питання: те саме питальне слово, але далі порядок ствердження — where I lived. Do зникає, час зсувається." }
>   - { show: [d2, r2], note: "Питання «так / ні»: додаємо if або whether (= «чи»). Are you → I was." }
>   - { show: [d3, r3], note: "Прохання: ask + особа + to + V1. Please зникає — його ввічливість уже в asked." }
>   - { show: [d4, r4], note: "Наказ «не роби»: tell + особа + not to + V1." }
> ```

- "What time **does** the film start?" → He asked what time the film **started**. ~~*what time did the film start*~~
- "**Have** you **been** to Lviv?" → She asked **if** I **had been** to Lviv.
- "Can you help me?" → He asked **if** I **could** help him. / He asked me **to help** him.

> [!quiz] Перевір себе: переказане питання
> level: B1 · id: en-b1-reported-speech-q04
>
> *"Where are you going?"* — asked my mum.
>
> - [ ] My mum asked where was I going.
> - [ ] My mum asked where I am going?
> - [x] My mum asked where I was going.
> - [ ] My mum asked me where did I go.
>
> **Пояснення:** у непрямому питанні — порядок ствердження (*I was going*), backshift (*are → was*) і крапка замість знака питання.

### Інші дієслова переказу

Носії рідко повторюють *said, said, said*. Точніші дієслова одразу передають намір:

| Дієслово | Конструкція | Приклад |
|---|---|---|
| **explain** | explain (to sb) that… | He **explained that** the shop was closed. |
| **admit** | admit (that) / admit + -ing | She **admitted** (that) she was wrong. |
| **mention** | mention (that)… | He **mentioned that** he was moving. |
| **warn** | warn sb (not) to… | They **warned us not to** swim there. |
| **remind** | remind sb to… | **Remind me to** buy milk. |
| **promise** | promise to… / promise (that)… | She **promised to** call. |
| **apologise** | apologise (to sb) for + -ing | He **apologised for** being late. |

## Приклади

- She **said** she **was** really tired. — Вона сказала, що дуже втомилася.
- He **told me** he **had** never **been** to London. — Він сказав мені, що ніколи не був у Лондоні.
- They **said** they **would** come **the next day**. — Вони сказали, що прийдуть наступного дня.
- My boss **asked** if I **could** work on Saturday. — Начальник спитав, чи можу я попрацювати в суботу.
- The officer **asked** me where I **was** from. — Офіцер спитав, звідки я.
- The teacher **told** us **not to** use our phones. — Учителька сказала нам не користуватися телефонами.
- She **asked** me **to** open the window. — Вона попросила мене відчинити вікно.
- He **admitted** that he **had** broken the vase. — Він зізнався, що розбив вазу.
- The pilot **announced** that we **were** about to land. — Пілот оголосив, що ми ось-ось приземлимося.
- I wasn't sure **whether** he **was** joking. — Я не був певен, чи він жартує.

## Слова

> [!word] explain
> ipa: /ɪkˈspleɪn/ · pos: verb · level: B1 · id: en-b1-reported-speech-w01
> uk: пояснювати
> example: Can you **explain** to me how it works? — Можеш пояснити мені, як це працює?
> note: explain **to** sb — не ~~explain me~~. Іменник — explanation.

> [!word] admit
> ipa: /ədˈmɪt/ · pos: verb · level: B1 · id: en-b1-reported-speech-w02
> uk: визнавати, зізнаватися
> example: He **admitted** that he had made a mistake. — Він визнав, що помилився.
> note: admit + -ing: She admitted taking the money.

> [!word] mention
> ipa: /ˈmen.ʃən/ · pos: verb · level: B1 · id: en-b1-reported-speech-w03
> uk: згадувати (у розмові)
> example: She **mentioned** that she had a new job. — Вона згадала, що в неї нова робота.
> note: Don't mention it! — Нема за що! (UK, у відповідь на подяку).

> [!word] warn
> ipa: /wɔːn/ · ipa-us: /wɔːrn/ · pos: verb · level: B1 · id: en-b1-reported-speech-w04
> uk: попереджати
> example: The guide **warned** us not to go near the edge. — Гід попередив, щоб ми не підходили до краю.
> note: warn sb (not) to do sth; warning — попередження. Звучить як worn.

> [!word] remind
> ipa: /rɪˈmaɪnd/ · pos: verb · level: B1 · id: en-b1-reported-speech-w05
> uk: нагадувати
> example: **Remind** me to call the dentist. — Нагадай мені подзвонити стоматологу.
> note: remind sb to do sth; remind sb of sb — нагадувати когось: You remind me of my brother.

> [!word] announce
> ipa: /əˈnaʊns/ · pos: verb · level: B1 · id: en-b1-reported-speech-w06
> uk: оголошувати
> example: They **announced** that the flight was delayed. — Оголосили, що рейс затримується.

> [!word] whether
> ipa: /ˈweð.ə/ · ipa-us: /ˈweð.ɚ/ · pos: conj · level: B1 · id: en-b1-reported-speech-w07
> uk: чи
> example: She asked **whether** I needed any help. — Вона спитала, чи не потрібна мені допомога.
> note: = if у непрямих питаннях; трохи формальніше. Звучить як weather.

> [!word] the next day
> ipa: /ðə nekst ˈdeɪ/ · pos: phrase · level: B1 · id: en-b1-reported-speech-w08
> uk: наступного дня
> example: He said he would call **the next day**. — Він сказав, що подзвонить наступного дня.
> note: формальніше — the following day. Заміна tomorrow у непрямій мові.

> [!word] gossip
> ipa: /ˈɡɒs.ɪp/ · ipa-us: /ˈɡɑː.səp/ · pos: noun · level: B1 · id: en-b1-reported-speech-w09
> uk: плітки; пліткар; (verb) пліткувати
> example: Don't believe it — it's just office **gossip**. — Не вір, це просто офісні плітки.
> note: незлічуване: a piece of gossip.

> [!word] according to
> ipa: /əˈkɔː.dɪŋ tə/ · ipa-us: /əˈkɔːr.dɪŋ tə/ · pos: prep · level: B1 · id: en-b1-reported-speech-w10
> uk: за словами; згідно з
> example: **According to** Olha, the meeting was cancelled. — За словами Ольги, нараду скасували.
> note: не кажи ~~according to me~~ — краще in my opinion.

## Слухаємо

> [!listen] Що ти почув?
> level: B1 · type: choice · id: en-b1-reported-speech-l01
> audio: She told me she was leaving.
> - [x] She told me she was leaving.
> - [ ] She told me she is leaving.
> - [ ] She said me she was leaving.

> [!listen] Що ти почув?
> level: B1 · type: choice · id: en-b1-reported-speech-l02
> audio: He asked if I could help him.
> - [ ] He asked if I can help him.
> - [x] He asked if I could help him.
> - [ ] He asked me to help him.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: en-b1-reported-speech-l03
> audio: The doctor told me not to worry.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: en-b1-reported-speech-l04
> audio: She asked me where I was from.

> [!listen] Що Тарас переказує про розмову з начальницею?
> level: B1 · type: answer · id: en-b1-reported-speech-l05
> audio: A: So what did your boss say, Taras?
> audio: B: She told me she was happy with my work. She said I could work from home on Fridays.
> audio: A: That's great! Did she mention a pay rise?
> audio: B: She said she would think about it.
> - [ ] Начальниця підвищила йому зарплату.
> - [x] Вона задоволена його роботою, дозволила працювати з дому по пʼятницях і подумає про підвищення.
> - [ ] Вона попросила його працювати по пʼятницях в офісі.
> - [ ] Вона нічого не сказала про його роботу.
>
> **Пояснення:** *She said I could work from home on Fridays* — дозвіл; *She said she would think about it* — підвищення ще не дали, лише подумає.

> [!listen] IELTS Listening, Part 3. Choose the correct answer. What did the tutor tell the students to do?
> level: B1 · type: answer · id: en-b1-reported-speech-l06
> audio: A: Did you talk to Dr Evans about our project?
> audio: B: Yes. She said our topic was too general. She told us to focus on just one city and asked whether we had interviewed any local people.
> audio: A: We haven't yet. Did she give us more time?
> audio: B: No, she reminded us that the deadline was still Friday.
> - [ ] Choose a more general topic.
> - [x] Concentrate on one city.
> - [ ] Hand in the project after Friday.
> - [ ] Stop interviewing local people.
>
> **Пояснення:** *She told us to focus on just one city* — у варіанті перефразовано як *concentrate on*. Додаткового часу не дали: дедлайн, як і раніше, у пʼятницю.

## Вимова

> [!pair] said /sed/ — sad /sæd/
> level: B1 · id: en-b1-reported-speech-p01
> say: said
> tip: said — як українське [е] (/sed/), а не «сейд»; sad — відкрите /æ/, рот ширше. Said пишеться з ai, але звучить коротко.

> [!speak] Скажи вголос
> level: B1 · id: en-b1-reported-speech-s01
> text: She said she was tired.
> ipa: /ʃiː sed ʃiː wəz ˈtaɪəd/
> tip: said — [сед], не «сейд»; was — слабке /wəz/.

> [!speak] Скажи вголос
> level: B1 · id: en-b1-reported-speech-s02
> text: He told me not to worry.
> ipa: /hiː təʊld miː nɒt tə ˈwʌr.i/
> tip: told — дифтонг /əʊ/ і темне l; worry — /ʌ/, як у but, не «вори».

> [!speak] Скажи вголос
> level: B1 · id: en-b1-reported-speech-s03
> text: She asked me where I lived.
> ipa: /ʃiː ɑːskt miː weər aɪ lɪvd/
> tip: asked — три приголосні в кінці /skt/: [а-скт]; lived — дзвінке /vd/.

> [!speak] Скажи вголос
> level: B1 · id: en-b1-reported-speech-s04
> text: They asked whether we needed any help.
> ipa: /ðeɪ ɑːskt ˈweð.ə wiː ˈniː.dɪd ˈen.i help/
> tip: whether — /ð/ дзвінке, язик між зубами; звучить так само, як weather.

> [!speak] Скажи вголос
> level: B1 · id: en-b1-reported-speech-s05
> text: He apologised for being late.
> ipa: /hiː əˈpɒl.ə.dʒaɪzd fə ˈbiː.ɪŋ leɪt/
> tip: a-PO-lo-gised — наголос на другому складі; for — слабке /fə/.

> [!speak] IELTS Speaking, Part 2 — порада, яку тобі дали
> level: B1 · id: en-b1-reported-speech-s06
> text: My grandfather told me that I should never give up, and he said that hard work always pays off.
> ipa: /maɪ ˈɡræn.fɑː.ðə təʊld miː ðət aɪ ʃʊd ˈnev.ə ɡɪv ʌp ənd hiː sed ðət hɑːd wɜːk ˈɔːl.weɪz peɪz ɒf/
> tip: Cue card «Describe a piece of good advice you received». Told me that… / said that… — переказ показує граматичну різноманітність. Hard work always pays off — загальна правда, тож без backshift.

## Типові помилки українців

> [!pitfall] «He said me», «He told that»
> В українській «сказати» — одне дієслово, а в англійській їх два: *say* і *tell*. **tell** — завжди з особою: *He **told me** that…* **say** — без особи або з *to*: *He **said** (to me) that…* ~~*He said me*~~, ~~*He told that*~~.

> [!pitfall] Порядок слів у непрямих питаннях
> «Вона спитала, де я живу» — ~~*She asked where do I live*~~. У непрямому питанні — **порядок ствердження** без *do / did*: *She asked **where I lived***. Те саме у ввічливих питаннях: *Could you tell me **where the station is**?*

> [!pitfall] Забутий backshift
> В українській «Він сказав, що **втомився**» час не змінюється. В англійській після *said* зазвичай зсуваємо: *He said he **was** tired*, *She said she **would** come*. Без зсуву — лише коли сказане досі правда.

> [!pitfall] «He asked me don't go»
> Прохання й накази — через **to + V1**: *He asked me **to** stay. He told me **not to** go.* ~~*He asked me don't go*~~, ~~*He said me to go*~~ (з *say* така конструкція неможлива).

## Практика

> [!quiz] Обери правильний переказ: "I'm moving to Canada."
> level: B1 · id: en-b1-reported-speech-q05
> - [ ] She said me she was moving to Canada.
> - [ ] She told she was moving to Canada.
> - [x] She said she was moving to Canada.
> - [ ] She said she is moving to Canada yesterday.
>
> **Пояснення:** *said* без особи; *am moving → was moving*.

> [!quiz] Обери всі правильні речення
> level: B1 · type: multi · id: en-b1-reported-speech-q06
> - [x] He told us that the meeting was cancelled.
> - [ ] She asked me what time was it.
> - [x] They asked if we wanted to join them.
> - [ ] The teacher said us to be quiet.
> - [x] My dad told me not to drive too fast.
>
> **Пояснення:** у непрямому питанні — *what time **it was***. *Say* не вживають з особою й *to*-інфінітивом: *The teacher **told** us to be quiet.*

> [!quiz] Перекажи: зсунь час назад
> level: B1 · type: fill · id: en-b1-reported-speech-q07
>
> ```text fill
> "I live in Odesa." → He said he [[lived]] in Odesa.
> "I'll help you." → She said she [[would]] help me.
> "I can't swim." → He said he [[couldn't|could not]] swim.
> "I've lost my keys." → She said she [[had]] lost her keys.
> ```
>
> **Пояснення:** *live → lived*, *will → would*, *can't → couldn't*, *have lost → had lost* (Present Perfect → Past Perfect).

> [!quiz] Перекажи питання
> level: B1 · type: fill · bank: did, do · id: en-b1-reported-speech-q08
>
> ```text fill
> "Where do you work?" → She asked me where I [[worked]].
> "Are you OK?" → He asked [[if|whether]] I was OK.
> "What are you doing?" → Mum asked what I [[was]] doing.
> "Did you see the match?" → He asked if I [[had]] seen the match.
> ```
>
> **Пояснення:** без *do / did*: *where I **worked***; yes / no → **if / whether**; *are → was*; *did you see → had seen*.

> [!quiz] Склади речення: «Вона попросила мене зачинити двері»
> level: B1 · type: order · id: en-b1-reported-speech-q09
>
> ```text order
> She
> asked
> me
> to close
> the door.
> said // ✗
> ```
>
> **Пояснення:** прохання — **ask + особа + to + V1**. *Said me to close* — неможливо.

> [!quiz] Склади переказане питання: «Він спитав, де вокзал»
> level: B1 · type: order · id: en-b1-reported-speech-q10
>
> ```text order
> He
> asked
> where
> the station
> was.
> did // ✗
> ```
>
> **Пояснення:** порядок ствердження: *where the station **was***, без *did* і без знака питання.

> [!quiz] Лікар сказав тобі: «Don't eat sugar for a week». Як переказати?
> level: B1 · id: en-b1-reported-speech-q11
> - [ ] The doctor said me don't eat sugar for a week.
> - [x] The doctor told me not to eat sugar for a week.
> - [ ] The doctor told me to not eating sugar for a week.
> - [ ] The doctor said to not eat me sugar for a week.
>
> **Пояснення:** заборона — **tell + особа + not to + V1**.

> [!quiz] Обери найточніше дієслово: "OK, it was me. I ate your cake."
> level: B1 · id: en-b1-reported-speech-q12
> - [ ] He reminded that he had eaten my cake.
> - [ ] He warned that he had eaten my cake.
> - [x] He admitted that he had eaten my cake.
> - [ ] He announced me that he had eaten my cake.
>
> **Пояснення:** «так, це був я» — зізнання → **admitted**. *Remind* і *warn* потребують особи (*reminded me*), а *announce me* неможливо.

### У форматі IELTS

> [!quiz] IELTS Reading — Matching features. Хто це сказав? Обери A, B або C.
> level: B1 · type: fill · bank · tags: ielts · id: en-b1-reported-speech-q13
>
> *Three experts were asked about working from home. **A** — Dr Lee said that people who worked from home were often more productive. **B** — Professor Shah warned that many employees felt lonely without colleagues. **C** — Ms Novak admitted that her company had saved money on offices, but she said that meetings were harder to organise.*
>
> ```text fill
> Working from home can reduce a company's costs. → [[C]]
> Remote workers may miss social contact. → [[B]]
> Some people get more done at home. → [[A]]
> It is more difficult to arrange meetings. → [[C]]
> ```
>
> **Пояснення:** IELTS перефразовує: *saved money on offices* → *reduce costs*; *felt lonely without colleagues* → *miss social contact*; *more productive* → *get more done*; *harder to organise* → *more difficult to arrange*. Один експерт може відповідати кільком твердженням.

> [!quiz] IELTS Reading — True, False or Not Given?
> level: B1 · tags: ielts · id: en-b1-reported-speech-q14
>
> *When the new bridge opened, the mayor told reporters that it had cost £20 million. She said that it would reduce traffic in the city centre and promised that the old bridge would become a park. A local business owner complained that the work had taken two years longer than planned.*
>
> **Statement:** *The mayor said that the old bridge would be closed to all traffic.*
>
> - [ ] True
> - [ ] False
> - [x] Not Given
>
> **Пояснення:** мерка пообіцяла зробити старий міст **парком**, але чи його повністю закриють для транспорту — у тексті не сказано. Не роби власних висновків → **Not Given**.

## Фішки

> [!reel] 📞 Зіпсований телефон англійською
> Британська назва гри «зіпсований телефон» — Chinese whispers, американська — Telephone. Першу назву тепер вважають застарілою й образливою, тож її дедалі частіше уникають.

> [!reel] ✍️ Said — найкраще дієслово переказу
> Письменникам радять не замінювати said на exclaimed, stated, declared без потреби: said «невидиме», читач його не помічає. Точне дієслово — лише коли воно додає зміст: admitted, warned.

> [!reel] 🙊 Gossip колись був хрещеним
> Староанглійське godsibb — «рідний у Бозі», хрещений батько чи мати. Хрещені балакали біля породіллі, і слово поступово стало означати балачки — а потім плітки.

## Джерела та що почитати

- 🟢 R. Murphy — *English Grammar in Use* (Cambridge): units «Reported speech», «Reported questions».
- 🟢 [British Council LearnEnglish — Reported speech: statements](https://learnenglish.britishcouncil.org/grammar/b1-b2-grammar/reported-speech-statements) — пояснення й вправи.
- 🟡 [Cambridge Dictionary — English Grammar Today](https://dictionary.cambridge.org/grammar/british-grammar/) — статті «Reported speech», «say or tell?».
- 🟡 M. Swan — *Practical English Usage*: indirect speech, say and tell.

> [!important] Підсумок
> - **say** (that)… / say sth **to** sb; **tell sb** (that)… — *tell* завжди з особою.
> - Після *said / told / asked* — **backshift**: Present → Past, *will → would*, *can → could*, Present Perfect / Past → Past Perfect.
> - Міняй займенники й слова часу: *today → that day, tomorrow → the next day, here → there*.
> - Питання: прямий порядок слів, без *do*; yes / no → **if / whether**.
> - Прохання й накази: **ask / tell sb (not) to + V1**.
