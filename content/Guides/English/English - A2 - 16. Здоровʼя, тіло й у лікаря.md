---
title: Здоровʼя, тіло й у лікаря
order: 216
id: en-a2-health
level: A2
icon: px:bandage
tags: [english, a2, vocabulary, health, body, doctor, should]
prerequisites: ["[[English - A1 - 08. Сімʼя, люди й зовнішність]]", "[[English - A2 - 15. Present Perfect чи Past Simple — just, already, yet]]"]
estimatedMinutes: 40
---

# Здоровʼя, тіло й у лікаря

> [!success] Після цієї теми ти зможеш
> - назвати частини тіла, які найчастіше болять: від **shoulder** до **ankle**;
> - описати симптоми: **I've got a headache**, **My knee hurts**, **I feel dizzy**;
> - записатися до лікаря, зрозуміти поради (**You should…**) і купити ліки в аптеці;
> - не потрапити в пастку хибного друга **recipe ≠ рецепт**.

## Передбач

> [!quiz] Лікар виписав тобі рецепт. Як це англійською?
> level: A2 · id: en-a2-health-q01
> - [ ] The doctor gave me a recipe.
> - [x] The doctor gave me a prescription.
> - [ ] The doctor gave me a receipt.
> - [ ] The doctor gave me a medicine list.
>
> **Пояснення:** **recipe** — рецепт **страви** (борщу, пирога). Рецепт **на ліки** — **prescription**. А **receipt** — чек у магазині. Три схожі слова — три різні речі.

## Простими словами

Про здоровʼя англійці говорять трьома простими «формулами» — вивчи їх, і зможеш пояснити майже будь-яку проблему:

1. **I've got a … + ache / біль** — *I've got a headache* (болить голова), *I've got a cough* (кашель).
2. **My … hurts** — *My knee hurts* (болить коліно). Для множини — *My feet hurt*.
3. **I feel + прикметник** — *I feel sick* (мене нудить), *I feel dizzy* (паморочиться голова), *I feel better* (мені краще).

А лікар відповідає порадами з **should / shouldn't**: *You should rest. You shouldn't go to work.*

> [!diagram] Від симптому до одужання
> ```yaml
> layout: flow
> nodes:
>   - { id: me, label: "симптом", text: "I've got a sore throat.", tone: red, icon: "px:warning" }
>   - { id: gp, label: "у лікаря (GP)", text: "Let me examine you.", tone: blue, icon: "px:person" }
>   - { id: advice, label: "порада", text: "You should rest.", note: "You shouldn't go to work.", tone: violet }
>   - { id: chemist, label: "аптека (chemist's)", text: "One tablet three times a day.", tone: yellow, icon: "px:bandage" }
>   - { id: well, label: "результат", text: "I feel better!", tone: green, icon: "px:heart" }
> edges:
>   - { from: me, to: gp, label: "make an appointment" }
>   - { from: gp, to: advice, label: "examine" }
>   - { from: advice, to: chemist, label: "prescription" }
>   - { from: chemist, to: well, label: "get better" }
> steps:
>   - { focus: me, note: "Болить горло — I've got a sore throat. Формула: I've got a + симптом." }
>   - { move: { from: me, to: gp, value: "appointment" }, note: "Записуємося до сімейного лікаря: I'd like to make an appointment." }
>   - { move: { from: gp, to: advice, value: "should" }, note: "Лікар оглядає (examine) і радить: You should rest. You shouldn't go to work." }
>   - { move: { from: advice, to: chemist, value: "prescription" }, note: "З рецептом — prescription, не recipe! — ідемо в аптеку." }
>   - { move: { from: chemist, to: well, value: "rest" }, set: { well: "I feel much better!" }, note: "Кілька днів відпочинку й ліків — і ти одужуєш: get better." }
> ```

## Пояснення

### Частини тіла, які болять найчастіше

Базові слова — *head, eye, ear, hand, leg, foot* — ти вже знаєш з A1. Додаймо ті, без яких у лікаря не обійтися:

| Верх | Середина | Низ |
|---|---|---|
| neck — шия | chest — груди | knee — коліно |
| throat — горло | stomach — живіт, шлунок | ankle — щиколотка |
| shoulder — плече | back — спина | toe — палець ноги |
| elbow — лікоть | wrist — зап'ясток | skin — шкіра |

> [!tip] Пальці
> **Finger** — палець руки, **toe** — палець ноги, **thumb** — великий палець руки. Українське «палець» англійською — три різні слова.

### Як сказати, що болить

| Формула | Коли | Приклад |
|---|---|---|
| I've got a + **-ache** | head, tooth, stomach, back, ear | I've got a **headache**. — У мене болить голова. |
| I've got a + **хвороба / симптом** | cold, cough, sore throat, temperature | I've got a **sore throat**. — У мене болить горло. |
| I've got + **flu** (без *a*) | грип | I've got **flu**. — У мене грип. (US: *the flu*) |
| My … **hurts** / **hurt** | будь-яка частина тіла | My **back hurts**. My **eyes hurt**. |
| I've **hurt** my … | травма | I've **hurt** my wrist. — Я травмував зап'ясток. |
| I feel + **прикметник** | самопочуття | I feel **sick / dizzy / tired / better**. |
| I've got a **pain in** my … | гострий біль у певному місці | I've got a **pain in** my chest. |

> [!note] Британська vs американська
> UK: *I've got a headache* · *I've got a temperature* · *chemist's* · *plaster*. US: *I have a headache* · *I have a fever* · *drugstore / pharmacy* · *Band-Aid*. **Sick** у Британії часто означає «нудить» (*I feel sick*), а в США — просто «хворий» (*I'm sick* = I'm ill).

> [!quiz] Перевір себе: як сказати «У мене болить спина»?
> level: A2 · id: en-a2-health-q02
> - [ ] My back is ill.
> - [x] My back hurts.
> - [ ] I have ill back.
> - [ ] My back is sick.
>
> **Пояснення:** про біль у частині тіла — **My … hurts**. Або *I've got backache* / *I've got a bad back*. **Ill** і **sick** — про людину загалом, не про спину.

### Поради: should і shouldn't

**Should** + базова форма дієслова — «варто, слід». Це м'яка порада, не наказ:

| | Приклад |
|---|---|
| + | You **should** drink a lot of water. — Тобі варто пити багато води. |
| − | You **shouldn't** (should not) go out. — Тобі не варто виходити. |
| ? | **Should** I take these tablets before meals? — Мені пити ці таблетки до їди? |

Ніяких *to* після should і ніякого *-s*: *She should rest*, не ~~*She shoulds to rest*~~. Детально про should, must і have to — у [[English - A2 - 17. Must, have to, should — обовʼязок і порада|наступній темі]].

### Ліки: take, а не drink

Таблетки й ліки англійською **приймають** — **take**: *take a tablet*, *take medicine*, *take two tablets three times a day*. Слово *drink* — лише про воду, чай і сироп, який п'єш із пляшки.

> [!quiz] Перевір себе: обери природну пораду
> level: A2 · type: fill · bank · id: en-a2-health-q03
>
> ```text fill
> You've got a temperature. You [[should]] stay in bed.
> Your stomach hurts? You [[shouldn't]] eat fast food today.
> [[Take]] one tablet three times a day after meals.
> If you don't [[get]] better in three days, come back.
> ```
>
> **Пояснення:** порада зробити — **should**, не робити — **shouldn't**. Ліки — **take**, одужувати — **get better**.

## Приклади

- I've got a terrible **headache**. — У мене страшенно болить голова.
- My **knees hurt** when I go downstairs. — У мене болять коліна, коли я спускаюся сходами.
- I think I've got **flu** — I've got a **temperature** and a **cough**. — Здається, у мене грип: температура й кашель.
- I **feel dizzy**. Can I **lie down** for a minute? — У мене паморочиться голова. Можна я на хвилинку ляжу?
- I'd like to make an **appointment** with Dr Brown. — Я хочу записатися до доктора Брауна.
- What are your **symptoms**? — Які у вас симптоми?
- I'm **allergic** to cats. — У мене алергія на котів.
- You should **rest** and drink plenty of water. — Вам слід відпочивати й пити багато води.
- Can I get these tablets without a **prescription**? — Ці таблетки можна купити без рецепта?
- I hope you **get better** soon! — Одужуй швидше!

## Слова

### Тіло

> [!word] shoulder
> ipa: /ˈʃəʊl.də/ · ipa-us: /ˈʃoʊl.dɚ/ · pos: noun · level: A2 · id: en-a2-health-w01
> uk: плече
> example: My left **shoulder** hurts. — У мене болить ліве плече.

> [!word] neck
> ipa: /nek/ · pos: noun · level: A2 · id: en-a2-health-w02
> uk: шия
> example: I slept badly and now my **neck** hurts. — Я погано спав, і тепер болить шия.

> [!word] chest
> ipa: /tʃest/ · pos: noun · level: A2 · id: en-a2-health-w03
> uk: груди, грудна клітка
> example: I've got a pain in my **chest**. — У мене біль у грудях.

> [!word] stomach
> ipa: /ˈstʌm.ək/ · pos: noun · level: A2 · id: en-a2-health-w04
> uk: живіт; шлунок
> example: Don't swim on a full **stomach**. — Не плавай на повний шлунок.
> note: ch читається як [k]: СТА-мек.

> [!word] back
> ipa: /bæk/ · pos: noun · level: A2 · id: en-a2-health-w05
> uk: спина
> example: Lift the box with your legs, not your **back**. — Піднімай коробку ногами, а не спиною.

> [!word] knee
> ipa: /niː/ · pos: noun · level: A2 · id: en-a2-health-w06
> uk: коліно
> example: He fell off his bike and hurt his **knee**. — Він упав з велосипеда й забив коліно.
> note: k на початку німе.

> [!word] ankle
> ipa: /ˈæŋ.kəl/ · pos: noun · level: A2 · id: en-a2-health-w07
> uk: щиколотка, гомілковостопний суглоб
> example: I twisted my **ankle** on the stairs. — Я підвернув ногу на сходах.

> [!word] wrist
> ipa: /rɪst/ · pos: noun · level: A2 · id: en-a2-health-w08
> uk: зап'ясток
> example: She wears a watch on her left **wrist**. — Вона носить годинник на лівій руці.
> note: w на початку німе.

> [!word] elbow
> ipa: /ˈel.bəʊ/ · ipa-us: /ˈel.boʊ/ · pos: noun · level: A2 · id: en-a2-health-w09
> uk: лікоть
> example: Don't put your **elbows** on the table. — Не клади лікті на стіл.

> [!word] throat
> ipa: /θrəʊt/ · ipa-us: /θroʊt/ · pos: noun · level: A2 · id: en-a2-health-w10
> uk: горло
> example: My **throat** is dry. — У мене пересохло в горлі.

> [!word] toe
> ipa: /təʊ/ · ipa-us: /toʊ/ · pos: noun · level: A2 · id: en-a2-health-w11
> uk: палець ноги
> example: I hit my **toe** on the door. — Я вдарився пальцем ноги об двері.

> [!word] skin
> ipa: /skɪn/ · pos: noun · level: A2 · id: en-a2-health-w12
> uk: шкіра
> example: Use sun cream — you've got very pale **skin**. — Користуйся кремом від сонця: у тебе дуже бліда шкіра.

### Симптоми

> [!word] headache
> ipa: /ˈhed.eɪk/ · pos: noun · level: A2 · id: en-a2-health-w13
> uk: головний біль
> example: I've got a **headache**. — У мене болить голова.
> note: ache читається [eɪk], ch = [k].

> [!word] toothache
> ipa: /ˈtuːθ.eɪk/ · pos: noun · level: A2 · id: en-a2-health-w14
> uk: зубний біль
> example: I've had **toothache** all night. — У мене всю ніч болів зуб.

> [!word] stomachache
> ipa: /ˈstʌm.ək.eɪk/ · pos: noun · level: A2 · id: en-a2-health-w15
> uk: біль у животі
> example: I ate too much and now I've got **stomachache**. — Я переїв, і тепер болить живіт.
> note: UK часто пишуть окремо: stomach ache.

> [!word] sore throat
> ipa: /ˌsɔː ˈθrəʊt/ · ipa-us: /ˌsɔːr ˈθroʊt/ · pos: phrase · level: A2 · id: en-a2-health-w16
> uk: біль у горлі
> example: I've got a **sore throat**, so I can't sing today. — У мене болить горло, тож сьогодні я не співатиму.

> [!word] cough
> ipa: /kɒf/ · ipa-us: /kɑːf/ · pos: noun · level: A2 · id: en-a2-health-w17
> uk: кашель; кашляти
> example: That's a bad **cough**. You should see a doctor. — Поганий кашель. Тобі варто піти до лікаря.
> note: gh читається як [f].

> [!word] flu
> ipa: /fluː/ · pos: noun · level: A2 · id: en-a2-health-w18
> uk: грип
> example: Half of my class is off with **flu**. — Пів класу на лікарняному з грипом.
> note: UK — have flu, US — have the flu.

> [!word] temperature
> ipa: /ˈtem.prə.tʃə/ · ipa-us: /ˈtem.pɚ.ə.tʃɚ/ · pos: noun · level: A2 · id: en-a2-health-w19
> uk: температура; (have a temperature) жар
> example: She's got a high **temperature**. — У неї висока температура.
> note: US частіше have a fever.

> [!word] pain
> ipa: /peɪn/ · pos: noun · level: A2 · id: en-a2-health-w20
> uk: біль
> example: Where exactly is the **pain**? — Де саме болить?

> [!word] injured
> ipa: /ˈɪn.dʒəd/ · ipa-us: /ˈɪn.dʒɚd/ · pos: adj · level: A2 · id: en-a2-health-w21
> uk: травмований, поранений
> example: Two people were **injured** in the accident. — В аварії постраждали двоє людей.
> note: дієслово — injure; про легкий біль частіше hurt.

> [!word] dizzy
> ipa: /ˈdɪz.i/ · pos: adj · level: A2 · id: en-a2-health-w22
> uk: у кого паморочиться голова
> example: I stood up too fast and felt **dizzy**. — Я різко встав, і запаморочилося в голові.

> [!word] sneeze
> ipa: /sniːz/ · pos: verb · level: A2 · id: en-a2-health-w23
> uk: чхати
> example: I can't stop **sneezing** — I think I'm allergic to something. — Не можу перестати чхати, здається, у мене на щось алергія.
> note: на чхання кажуть Bless you! — Будь здоров!

> [!word] feel sick
> ipa: /fiːl sɪk/ · pos: phrase · level: A2 · id: en-a2-health-w24
> uk: нудити (UK); почуватися хворим (US)
> example: I **feel sick** on long bus journeys. — Мене нудить у довгих поїздках автобусом.

> [!word] runny nose
> ipa: /ˌrʌn.i ˈnəʊz/ · ipa-us: /ˌrʌn.i ˈnoʊz/ · pos: phrase · level: A2 · id: en-a2-health-w25
> uk: нежить
> example: I've got a **runny nose** and a sore throat. — У мене нежить і болить горло.

### У лікаря й в аптеці

> [!word] appointment
> ipa: /əˈpɔɪnt.mənt/ · pos: noun · level: A2 · id: en-a2-health-w26
> uk: запис (на прийом), зустріч
> example: I've got a doctor's **appointment** at ten. — У мене прийом у лікаря о десятій.

> [!word] GP
> ipa: /ˌdʒiː ˈpiː/ · pos: noun · level: A2 · id: en-a2-health-w27
> uk: сімейний лікар, терапевт (UK)
> example: You should see your **GP** first. — Спочатку вам варто піти до сімейного лікаря.
> note: від general practitioner; US — family doctor.

> [!word] patient
> ipa: /ˈpeɪ.ʃənt/ · pos: noun · level: A2 · id: en-a2-health-w28
> uk: пацієнт
> example: The doctor has five more **patients** this morning. — Сьогодні зранку в лікаря ще п'ять пацієнтів.
> note: як прикметник — «терплячий».

> [!word] symptom
> ipa: /ˈsɪmp.təm/ · pos: noun · level: A2 · id: en-a2-health-w29
> uk: симптом
> example: What are your **symptoms**? — Які у вас симптоми?

> [!word] medicine
> ipa: /ˈmed.ɪ.sən/ · pos: noun · level: A2 · id: en-a2-health-w30
> uk: ліки; медицина
> example: Take this **medicine** before bed. — Прийми ці ліки перед сном.
> note: у британському мовленні часто два склади: /ˈmed.sən/.

> [!word] tablet
> ipa: /ˈtæb.lət/ · pos: noun · level: A2 · id: en-a2-health-w31
> uk: таблетка; планшет
> example: Take two **tablets** with water. — Прийміть дві таблетки, запиваючи водою.
> note: синонім — pill.

> [!word] prescription
> ipa: /prɪˈskrɪp.ʃən/ · pos: noun · level: A2 · id: en-a2-health-w32
> uk: рецепт (на ліки)
> example: You need a **prescription** for these antibiotics. — На ці антибіотики потрібен рецепт.
> note: хибний друг: recipe — рецепт страви.

> [!word] chemist's
> ipa: /ˈkem.ɪsts/ · pos: noun · level: A2 · id: en-a2-health-w33
> uk: аптека (UK)
> example: Is there a **chemist's** near here? — Тут поблизу є аптека?
> note: також pharmacy; US — drugstore.

> [!word] plaster
> ipa: /ˈplɑː.stə/ · ipa-us: /ˈplæs.tɚ/ · pos: noun · level: A2 · id: en-a2-health-w34
> uk: пластир (UK)
> example: Put a **plaster** on that cut. — Заклей поріз пластирем.
> note: US — Band-Aid; також «гіпс» (a leg in plaster).

> [!word] examine
> ipa: /ɪɡˈzæm.ɪn/ · pos: verb · level: A2 · id: en-a2-health-w35
> uk: оглядати (пацієнта)
> example: The doctor **examined** my throat. — Лікар оглянув моє горло.

> [!word] allergic
> ipa: /əˈlɜː.dʒɪk/ · ipa-us: /əˈlɝː.dʒɪk/ · pos: adj · level: A2 · id: en-a2-health-w36
> uk: алергічний; (be allergic to) мати алергію на
> example: Are you **allergic** to anything? — У вас є на щось алергія?
> note: наголос на другий склад: а-ЛЕР-джик.

> [!word] get better
> ipa: /ɡet ˈbet.ə/ · ipa-us: /ɡet ˈbet̬.ɚ/ · pos: phrase · level: A2 · id: en-a2-health-w37
> uk: одужувати, ставати краще
> example: Get well soon! I hope you **get better** quickly. — Одужуй! Сподіваюся, тобі швидко покращає.

> [!word] rest
> ipa: /rest/ · pos: verb · level: A2 · id: en-a2-health-w38
> uk: відпочивати; (noun) відпочинок
> example: You should **rest** for a few days. — Вам треба кілька днів відпочити.

> [!word] healthy
> ipa: /ˈhel.θi/ · pos: adj · level: A2 · id: en-a2-health-w39
> uk: здоровий; корисний для здоров'я
> example: She eats **healthy** food and goes swimming. — Вона харчується здоровою їжею й ходить плавати.

> [!word] lie down
> ipa: /laɪ ˈdaʊn/ · pos: phrase · level: A2 · id: en-a2-health-w40
> uk: лягти (полежати)
> forms: lie → lay → lain
> example: If you feel dizzy, **lie down** for a while. — Якщо паморочиться голова, полеж трохи.

## Слухаємо

> [!listen] Що ти почув?
> level: A2 · type: choice · id: en-a2-health-l01
> audio: My knee hurts when I run.
> - [ ] My knees hurt when I run.
> - [x] My knee hurts when I run.
> - [ ] My neck hurts when I run.

> [!listen] Що ти почув?
> level: A2 · type: choice · id: en-a2-health-l02
> audio: I've got a sore throat and a runny nose.
> - [x] I've got a sore throat and a runny nose.
> - [ ] I've got a sore throat and a cough.
> - [ ] I've got a headache and a runny nose.

> [!listen] Надрукуй почуте
> level: A2 · type: dictation · id: en-a2-health-l03
> audio: You should stay in bed for two days.

> [!listen] Надрукуй почуте
> level: A2 · type: dictation · id: en-a2-health-l04
> audio: Take one tablet three times a day.

> [!listen] Що порадив лікар?
> level: A2 · type: answer · id: en-a2-health-l05
> audio: A: So, what's the problem?
> audio: B: I've had a terrible cough for a week, and last night I had a temperature.
> audio: A: Let me listen to your chest. Hmm, it's not serious. You should drink lots of warm water and rest. And you shouldn't go to work until Friday.
> - [ ] Терміново йти в лікарню
> - [x] Пити багато теплої води, відпочивати й не ходити на роботу до пʼятниці
> - [ ] Приймати антибіотики й ходити на роботу
> - [ ] Повернутися наступного тижня на рентген

> [!listen] Що купує жінка в аптеці?
> level: A2 · type: answer · id: en-a2-health-l06
> audio: A: Hello. Can I help you?
> audio: B: Yes, I've got a bad headache. Have you got something for it?
> audio: A: These tablets are good. Take two every four hours, but not more than eight a day. Are you allergic to anything?
> audio: B: No, I'm not. And a box of plasters, please.
> - [ ] Лише пластир
> - [ ] Ліки від кашлю й пластир
> - [x] Таблетки від головного болю й пластир
> - [ ] Таблетки за рецептом

## Ситуація: запис до лікаря

> [!example] Діалог по телефону
> **Receptionist:** Good morning, Park Lane Surgery. How can I help?
> **Olena:** Hello, I'd like to make an appointment with a GP, please.
> **Receptionist:** What's the problem?
> **Olena:** I've hurt my wrist. It's swollen and it really hurts.
> **Receptionist:** When did it happen?
> **Olena:** Yesterday — I fell off my bike.
> **Receptionist:** Can you come in at half past eleven today?
> **Olena:** Yes, that's fine. Thank you!
>
> *Surgery* (UK) тут — не «хірургія», а **кабінет сімейного лікаря**, поліклініка. Зверни увагу: *I've hurt* (результат зараз) → *When did it happen?* → *Yesterday* (Past Simple з датою).

## Вимова

> [!speak] Скажи вголос
> level: A2 · id: en-a2-health-s01
> text: I've got a terrible headache.
> ipa: /aɪv ɡɒt ə ˈter.ə.bəl ˈhed.eɪk/
> tip: headache — «ГЕД-ейк» з легким видихом /h/, а не «хедейч»: ch тут [k].

> [!speak] Скажи вголос
> level: A2 · id: en-a2-health-s02
> text: My back hurts.
> ipa: /maɪ bæk hɜːts/
> tip: hurts — довгий /ɜː/ без «р», як у слові bird; язик не вібрує.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-health-s03
> text: I'd like to make an appointment, please.
> ipa: /aɪd laɪk tə meɪk ən əˈpɔɪnt.mənt pliːz/
> tip: make‿an зливаються: [мей-кен]; наголос appointment — на «POINT».

> [!speak] Скажи вголос
> level: A2 · id: en-a2-health-s04
> text: How often should I take them?
> ipa: /haʊ ˈɒf.ən ʃʊd aɪ teɪk ðəm/
> tip: should — [шуд], l німе; often — зазвичай без [t]: ОФ-ен.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-health-s05
> text: You should stay in bed and rest.
> ipa: /juː ʃʊd steɪ ɪn bed ən rest/
> tip: bed — дзвінке [d] у кінці, не оглушуй до «бет».

> [!speak] Скажи вголос
> level: A2 · id: en-a2-health-s06
> text: I feel dizzy and a bit sick.
> ipa: /aɪ fiːl ˈdɪz.i ən ə bɪt sɪk/
> tip: feel — довге /iː/ і «темне» l у кінці; dizzy — дзвінке [z].

## Типові помилки українців

> [!pitfall] recipe — це не рецепт від лікаря
> «Рецепт на ліки» — **prescription**. **Recipe** — рецепт пирога. А **receipt** /rɪˈsiːt/ (p німе) — чек. *Can I have a receipt?* — у магазині; *You need a prescription* — в аптеці.

> [!pitfall] «My head is ill» і «I drink pills»
> «Болить голова» — не *My head is ill*, а *I've got a headache* або *My head hurts*. **Ill / sick** — про людину: *I'm ill*. Таблетки не «п'ють», а **приймають**: *take a tablet / take medicine*.

> [!pitfall] «I have temperature» без артикля
> Жар — *I've got **a** temperature* (UK) або *I have **a** fever* (US). Без *a* речення звучить як «у мене є температура» — вона є в усіх, навіть у здорових. Так само: *a headache, a cold, a cough, a sore throat*, але *flu* — без *a*.

## Практика

> [!quiz] Яке речення звучить природно?
> level: A2 · id: en-a2-health-q04
> - [ ] I have pain of head.
> - [ ] My head is sick.
> - [x] I've got a headache.
> - [ ] I have a head ache in me.
>
> **Пояснення:** стандартна формула — **I've got a headache** (US: *I have a headache*).

> [!quiz] Де купити пластир і таблетки у Великій Британії?
> level: A2 · id: en-a2-health-q05
> - [ ] At the surgery
> - [x] At the chemist's
> - [ ] At the receipt
> - [ ] At the kitchen
>
> **Пояснення:** **chemist's** (або *pharmacy*) — аптека. **Surgery** — кабінет лікаря, де тебе оглядають.

> [!quiz] Друг чхає. Що йому сказати?
> level: A2 · id: en-a2-health-q06
> - [x] Bless you!
> - [ ] Be healthy!
> - [ ] Good health to you!
> - [ ] Cheers!
>
> **Пояснення:** на чхання кажуть **Bless you!** «Be healthy» — калька з «Будь здоров!», англійці так не кажуть. *Cheers!* — тост або «дякую».

> [!quiz] Встав частину тіла
> level: A2 · type: fill · bank: elbow · id: en-a2-health-q07
>
> ```text fill
> I wear my watch on my [[wrist]].
> I can't turn my head — my [[neck]] hurts.
> She twisted her [[ankle]] when she was running.
> Speak louder? Sorry, I've got a sore [[throat]].
> ```
>
> **Пояснення:** годинник — на **wrist**; повертати голову — **neck**; підвернути ногу — **ankle**; хрипнути — **throat**.

> [!quiz] Встав hurt / hurts і правильну форму
> level: A2 · type: fill · id: en-a2-health-q08
>
> ```text fill
> My feet [[hurt]] after the marathon.
> My left ear [[hurts]].
> I've [[hurt]] my back, so I can't carry the boxes.
> ```
>
> **Пояснення:** *feet* — множина → **hurt**; *ear* — однина → **hurts**. Третя форма hurt — теж **hurt** (hurt → hurt → hurt).

> [!quiz] Склади речення: «Тобі не варто йти на роботу завтра»
> level: A2 · type: order · id: en-a2-health-q09
>
> ```text order
> You
> shouldn't
> go
> to work
> tomorrow.
> to go // ✗
> ```
>
> **Пояснення:** після **should / shouldn't** — дієслово без *to*: *shouldn't go*.

> [!quiz] Склади речення: «Я хотів би записатися на прийом»
> level: A2 · type: order · id: en-a2-health-q10
>
> ```text order
> I'd like
> to make
> an appointment
> with the doctor.
> ```
>
> **Пояснення:** *make an appointment* — сталий вираз «записатися на прийом». *I'd like to…* — ввічливе «я б хотів».

## Фішки

> [!reel] 🤧 Bless you! — звідки це
> Колись вірили, що під час чхання душа може вилетіти з тіла, тож сусіди швиденько «благословляли»: (God) bless you! Відповідь — Thank you.

> [!reel] 🦵 Німі літери в тілі
> knee, wrist, thumb, stomach: k, w, b не читаються, а ch у stomach — [k]. Анатомія англійською — тренування читання!

> [!reel] 🏥 Surgery — не завжди операція
> У Британії doctor's surgery — кабінет сімейного лікаря. «Іду в surgery» означає «до терапевта», а не «на операцію».

## Джерела та що почитати

- 🟢 [British Council LearnEnglish — Vocabulary A1–A2](https://learnenglish.britishcouncil.org/vocabulary/a1-a2-vocabulary) — тематичні вправи, зокрема про тіло й здоровʼя.
- 🟢 [Cambridge Dictionary](https://dictionary.cambridge.org/) — вимова UK / US і приклади до кожного слова.
- 🟡 M. McCarthy, F. O'Dell — *English Vocabulary in Use: Elementary* (Cambridge): розділи про тіло, здоровʼя й хвороби.
- 🟡 [NHS — Health A to Z](https://www.nhs.uk/conditions/) — справжні британські тексти про симптоми (для сміливих).

> [!important] Підсумок
> - Три формули: **I've got a headache / a cough** · **My knee hurts** · **I feel dizzy / sick / better**.
> - Поради: **You should / shouldn't + дієслово** (без *to*).
> - Ліки **take**, рецепт — **prescription** (не *recipe*), аптека — **chemist's / pharmacy**.
> - **A** temperature, **a** cold, **a** sore throat, але **flu** (UK) без артикля.
