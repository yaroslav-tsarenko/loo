---
title: Підсумок B1 — тест рівня
order: 330
id: en-b1-review
level: B1
icon: px:star
tags: [english, b1, review, test, grammar, vocabulary, pronunciation, listening, ielts]
prerequisites: ["[[English - B1 - 29. Говоріння — розповідь, думка, згода й незгода]]", "[[English - B1 - 28. Читання — статті й стратегії skimming, scanning]]", "[[English - B1 - 27. Письмо — лист, email, есе-думка]]", "[[English - A2 - 30. Підсумок A2 — тест рівня]]"]
estimatedMinutes: 70
---

# Підсумок B1 — тест рівня

> [!success] Після цієї теми ти знатимеш
> - чи закрив рівень **B1**: усі часи для розповіді, умовні речення, модальні, пасив, непряма мова, означальні речення, артиклі;
> - чи впевнено тримаєш лексику B1: стосунки, технології, довкілля, карʼєра, медіа, колокації, словотвір, фразові дієслова;
> - як ти виконуєш завдання у форматі **IELTS** — Listening, Reading, Writing, Speaking — і що означає твій орієнтовний бал;
> - які теми повторити — у поясненні кожного питання є номер теми.

Нового матеріалу тут немає: карта граматики рівня, ключові форми, чеклісти, великий змішаний тест і міні-IELTS. Проходь без підказок і записуй помилки — вони покажуть, куди повернутися.

## Передбач

> [!quiz] I ___ in this city since 2021, and I still love it.
> level: B1 · id: en-b1-review-q01
> - [ ] live
> - [ ] am living
> - [x] have been living
> - [ ] was living
>
> **Пояснення:** дія почалася в минулому й триває досі (*since 2021*) — Present Perfect Continuous (або Simple: *I've lived*). «Я живу тут з 2021» українською — теперішній час, англійською — **ніколи** не *I live / I'm living since…* (тема 06)

## Карта рівня B1

### Граматика B1 одним поглядом

> [!diagram] Граматика B1: сім гілок
> ```yaml
> layout: tree
> nodes:
>   - { id: root, label: "B1", text: "Граматика рівня", note: "що ти вже вмієш будувати", tone: gray, icon: "px:star" }
>   - { id: tenses, parent: root, label: "часи · теми 01, 03, 04, 06, 08", text: "Розповідь і майбутнє", note: "Past Perfect, used to, PP Continuous, усі форми майбутнього", tone: blue }
>   - { id: cond, parent: root, label: "теми 10, 11", text: "Умовні речення", note: "0, 1, 2 · unless · as soon as", tone: violet }
>   - { id: modals, parent: root, label: "теми 14, 15", text: "Модальні", note: "must / might / can't · could / was able to / managed to", tone: orange }
>   - { id: passive, parent: root, label: "тема 17", text: "Пасив", note: "is made · was built · by + хто", tone: green }
>   - { id: reported, parent: root, label: "тема 19", text: "Непряма мова", note: "backshift · say / tell · asked if", tone: mint }
>   - { id: clauses, parent: root, label: "теми 20, 26", text: "Підрядні й питання", note: "who / which / whose · isn't it? · Could you tell me where…", tone: yellow }
>   - { id: articles, parent: root, label: "тема 25", text: "Артиклі", note: "the Alps · go to school · — life is…", tone: pink }
> steps:
>   - { focus: root, note: "B1 — рівень, на якому ти розповідаєш історії, обґрунтовуєш думку й переказуєш чужі слова. Граматика рівня — сім гілок." }
>   - { focus: tenses, note: "Часи: фон (was walking), подія (saw), «ще раніше» (had left), звички в минулому (used to, would), тривалість до тепер (have been doing), вибір форми майбутнього." }
>   - { focus: cond, note: "Умовні: реальне (If it rains, we'll stay) і уявне (If I had time, I'd travel). Після if, when, as soon as — без will." }
>   - { focus: modals, note: "Модальні: наскільки ти впевнений (must, might, can't) і вміння в різних часах (could, was able to, managed to)." }
>   - { focus: [passive, reported], note: "Пасив — коли важливо, що сталося, а не хто зробив. Непряма мова — переказ: час «зсувається» назад." }
>   - { focus: [clauses, articles], note: "Підрядні й питання: хто / який / чий, question tags, ввічливі непрямі питання. Артиклі: назви, установи, загальні твердження." }
> ```

### Часи B1 на одній шкалі

> [!diagram] Часи B1: від «ще раніше» до розкладу
> ```yaml
> layout: timeline
> nodes:
>   - { id: pp, at: "ще раніше в минулому", label: "Past Perfect", text: "I'd left my keys at work.", note: "подія до іншої минулої події", tone: violet }
>   - { id: ut, at: "колись, тепер ні", label: "used to / would", text: "I used to live in Odesa.", note: "минулі звички й стани", tone: gray }
>   - { id: pc, at: "фон історії", label: "Past Continuous", text: "I was walking home…", note: "процес у момент минулого", tone: blue }
>   - { id: ps, at: "подія історії", label: "Past Simple", text: "…when it started to rain.", note: "головні події по черзі", tone: green }
>   - { id: ppc, at: "з минулого до тепер", label: "Present Perfect Continuous", text: "I've been learning English for 3 years.", note: "тривалість, процес", tone: orange }
>   - { id: now, at: "зараз і завжди", label: "Present Simple / Continuous", text: "I work in IT, but I'm working from home this week.", note: "постійне vs тимчасове", tone: mint }
>   - { id: fut, at: "майбутнє", label: "will · going to · Present Cont. · розклад", text: "My train leaves at 7. I'm meeting Ann at 9.", note: "форма — за наміром", tone: yellow }
> steps:
>   - { show: [pc, ps], note: "Каркас історії: Past Continuous — фон (I was walking), Past Simple — подія, що сталася (it started to rain)." }
>   - { show: pp, note: "Past Perfect — крок «ще далі в минуле»: I realised I'd left my keys at work — ключі я залишив ДО того, як зрозумів." }
>   - { show: ut, note: "used to — те, що було колись, а тепер ні: I used to live in Odesa. Would — лише для повторюваних дій, не для станів." }
>   - { show: ppc, note: "Present Perfect Continuous — від минулого до тепер, з for / since / How long: I've been learning English for three years." }
>   - { show: now, note: "Present Simple — постійне, Present Continuous — тимчасове. Дієслова стану (know, belong, seem) — без -ing." }
>   - { show: fut, note: "Майбутнє: розклад — Present Simple, домовленість — Present Continuous, план — going to, рішення зараз і прогноз — will." }
> ```

### Усі теми B1

1. [[English - B1 - 01. Теперішні часи — Simple чи Continuous, дієслова стану|Теперішні часи — Simple чи Continuous, дієслова стану]]
2. [[English - B1 - 02. Стосунки й особистість|Стосунки й особистість]]
3. [[English - B1 - 03. Наративні часи — Past Simple, Continuous і Perfect|Наративні часи — Past Simple, Continuous і Perfect]]
4. [[English - B1 - 04. Used to, would і be used to|Used to, would і be used to]]
5. [[English - B1 - 05. Звʼязне мовлення — linking|Звʼязне мовлення — linking]]
6. [[English - B1 - 06. Present Perfect Continuous — for, since, how long|Present Perfect Continuous — for, since, how long]]
7. [[English - B1 - 07. Технології, інтернет і соцмережі|Технології, інтернет і соцмережі]]
8. [[English - B1 - 08. Майбутнє — will, going to, Present Continuous, розклад|Майбутнє — will, going to, Present Continuous, розклад]]
9. [[English - B1 - 09. Аудіювання — новини, подкасти, оголошення|Аудіювання — новини, подкасти, оголошення]]
10. [[English - B1 - 10. Умовні речення — нульовий і перший|Умовні речення — нульовий і перший]]
11. [[English - B1 - 11. Другий умовний — уявні ситуації|Другий умовний — уявні ситуації]]
12. [[English - B1 - 12. Довкілля, природа й клімат|Довкілля, природа й клімат]]
13. [[English - B1 - 13. Слабкі форми й ритм мовлення|Слабкі форми й ритм мовлення]]
14. [[English - B1 - 14. Ймовірність — may, might, could, must, can't|Ймовірність — may, might, could, must, can't]]
15. [[English - B1 - 15. Can, could, be able to, manage to|Can, could, be able to, manage to]]
16. [[English - B1 - 16. Робота, карʼєра й співбесіда|Робота, карʼєра й співбесіда]]
17. [[English - B1 - 17. Пасивний стан — Present і Past|Пасивний стан — Present і Past]]
18. [[English - B1 - 18. Медіа, новини й реклама|Медіа, новини й реклама]]
19. [[English - B1 - 19. Непряма мова — твердження, питання, прохання|Непряма мова — твердження, питання, прохання]]
20. [[English - B1 - 20. Означальні речення — who, which, that, where, whose|Означальні речення — who, which, that, where, whose]]
21. [[English - B1 - 21. Аудіювання — інтервʼю й розмови носіїв|Аудіювання — інтервʼю й розмови носіїв]]
22. [[English - B1 - 22. Колокації — make, do, have, take, get|Колокації — make, do, have, take, get]]
23. [[English - B1 - 23. Словотвір — префікси й суфікси|Словотвір — префікси й суфікси]]
24. [[English - B1 - 24. Фразові дієслова й ідіоми B1|Фразові дієслова й ідіоми B1]]
25. [[English - B1 - 25. Артиклі глибше — the, a і нульовий артикль|Артиклі глибше — the, a і нульовий артикль]]
26. [[English - B1 - 26. Question tags і непрямі питання|Question tags і непрямі питання]]
27. [[English - B1 - 27. Письмо — лист, email, есе-думка|Письмо — лист, email, есе-думка]]
28. [[English - B1 - 28. Читання — статті й стратегії skimming, scanning|Читання — статті й стратегії skimming, scanning]]
29. [[English - B1 - 29. Говоріння — розповідь, думка, згода й незгода|Говоріння — розповідь, думка, згода й незгода]]

### Ключові форми

**Часи й конструкції**

| Що | Форма | Приклад | Тема |
|---|---|---|---|
| Present Continuous (тимчасове) | am / is / are + V-ing | *I'm staying with friends this week.* | 01 |
| Past Perfect | had + V3 | *When we arrived, the film **had started**.* | 03 |
| used to / would | used to + V1 · would + V1 (дії) | *I **used to** have long hair. We **would** swim every day.* | 04 |
| be / get used to | be used to + **V-ing** / іменник | *I'm used to **getting up** early.* | 04 |
| Present Perfect Continuous | have / has been + V-ing | *She**'s been working** here for two years.* | 06 |
| Майбутнє | розклад · домовленість · план · рішення | *leaves at 7 · I'm meeting · I'm going to · I'll help* | 08 |

**Умовні речення**

| Тип | if-частина | головна частина | Приклад | Тема |
|---|---|---|---|---|
| нульовий (завжди) | Present Simple | Present Simple | *If you heat ice, it melts.* | 10 |
| перший (реально) | Present Simple | will + V1 | *If it rains, we**'ll** stay at home.* | 10 |
| часові підрядні | when / as soon as / unless + Present | will + V1 | *I'll call you **as soon as** I **arrive**.* | 10 |
| другий (уявно) | Past Simple (were) | would + V1 | *If I **were** you, I**'d** take the job.* | 11 |

**Модальні, пасив, непряма мова**

| Що | Форма | Приклад | Тема |
|---|---|---|---|
| впевненість | must ≈ 95 % · may / might / could ≈ 50 % · can't ≈ 0 % | *She **can't** be at home — I've just seen her.* | 14 |
| вміння в минулому | could (загалом) · was able to / managed to (один успіх) | *I **managed to** find the key.* | 15 |
| пасив | am / is / are + V3 · was / were + V3 | *English **is spoken** here. It **was built** in 1890.* | 17 |
| непряма мова | is → was · will → would · have done → had done | *She said (that) she **was** tired.* | 19 |
| питання / прохання в непрямій | asked **if** / **where** + прямий порядок · asked **to** + V1 | *He asked **where I lived**. She asked me **to wait**.* | 19 |
| означальні | who · which · that · where · whose | *the man **whose** car was stolen* | 20 |
| question tags | + речення → − tag · − речення → + tag | *You're from Lviv, **aren't you**?* | 26 |
| непрямі питання | Could you tell me + питальне слово + **підмет + дієслово** | *Could you tell me where **the station is**?* | 26 |

### Чекліст «я вмію» B1

- розповісти історію з минулого: фон, події, що сталося ще раніше; розповісти, як було колись і що змінилося;
- сказати, як довго щось триває, і пояснити, чим займався останнім часом;
- обрати форму майбутнього: план, домовленість, розклад, рішення, прогноз;
- говорити про реальні й уявні ситуації, давати поради (*If I were you…*);
- висловити впевненість і сумнів (*must, might, can't*), сказати, що вдалося, а що ні;
- описати процес і новину пасивом; переказати чужі слова, питання й прохання;
- зрозуміти головну думку й ключові деталі новин, подкастів, оголошень та інтервʼю в повільному темпі;
- читати статті на знайомі теми, швидко знаходити деталь і відрізняти False від Not Given;
- написати особистий і простий офіційний лист, есе-думку 180–250 слів з абзацами й звʼязками;
- аргументувати думку, погодитися й ввічливо не погодитися, розповісти за cue card 1–2 хвилини.

## Приклади

- *I was walking home when I realised I'd left my keys at work.* — Я йшов додому, коли зрозумів, що залишив ключі на роботі.
- *We used to live by the sea, so I'm used to swimming in cold water.* — Ми колись жили біля моря, тож я звик плавати в холодній воді.
- *She's been working on this project since January.* — Вона працює над цим проєктом із січня.
- *I'm seeing the dentist on Friday, and my train leaves at 7.* — У пʼятницю я йду до стоматолога, а мій поїзд відходить о сьомій.
- *If I had more free time, I'd learn to play the guitar.* — Якби я мав більше вільного часу, я б навчився грати на гітарі.
- *He's not answering — he might be in a meeting.* — Він не відповідає — можливо, він на нараді.
- *The museum was built in 1890 and is visited by thousands of people every year.* — Музей збудували 1890 року, і щороку його відвідують тисячі людей.
- *She told me she had already applied for the job.* — Вона сказала мені, що вже подала заявку на цю роботу.
- *That's the woman whose son works with me.* — Це та жінка, чий син працює зі мною.
- *Could you tell me what time the museum opens?* — Чи не підкажете, о котрій відкривається музей?

## Слова

Нових карток тут немає — повтори в розділі «Слова» картки B1. Перевір, чи знаєш хоча б по 5 слів у кожній групі:

| Група | Приклади | Тема |
|---|---|---|
| стосунки й характер | get on with, fall out, reliable, stubborn, trust | 02 |
| технології | back up, log in, update, scroll, password | 07 |
| довкілля | renewable, pollution, recycle, endangered, climate change | 12 |
| карʼєра | apply for, CV, salary, promotion, strengths | 16 |
| медіа | headline, advert, fake news, journalist, broadcast | 18 |
| колокації | make a decision, do a favour, take a break, have a go, get lost | 22 |
| словотвір | unclear, disagree, rewrite, harmful, development | 23 |
| фразові й ідіоми | run out of, put off, come across, a piece of cake | 24 |
| письмо | Yours faithfully, However, In addition, In conclusion | 27 |
| дискусія | In my opinion, I see your point, but…, That's a good question | 29 |

## Слухаємо

### Новини, оголошення, інтервʼю

> [!listen] Про що головна новина?
> level: B1 · type: answer · id: en-b1-review-l01
> audio: Good evening. The city council has announced that from next month all buses in the city centre will be electric. The first twenty new buses were delivered yesterday, and drivers are being trained this week.
> - [ ] у місті скасовують автобуси в центрі
> - [x] з наступного місяця всі автобуси в центрі будуть електричними
> - [ ] водіїв автобусів звільняють
>
> **Пояснення:** gist — у першому реченні новини: *all buses in the city centre will be electric*. Двадцять автобусів і навчання водіїв — деталі. (тема 09)

> [!listen] Що мають зробити пасажири?
> level: B1 · type: answer · id: en-b1-review-l02
> audio: Passengers for the fourteen twenty train to Odesa are asked to go to platform six, where the train is now waiting. Please have your tickets ready.
> - [ ] чекати на шостій платформі до 14:20
> - [x] іти на шосту платформу, де вже стоїть поїзд, і приготувати квитки
> - [ ] купити квитки на поїзд о 14:20
>
> **Пояснення:** *are asked to go* — пасив у ввічливому оголошенні: «пасажирів просять пройти». *Is now waiting* — поїзд уже там. (теми 09, 17)

> [!listen] Як змінилося ставлення жінки до роботи з дому?
> level: B1 · type: answer · id: en-b1-review-l03
> audio: A: So, do you enjoy working from home?
> audio: B: Well, I used to love it, to be honest. But these days I really miss my colleagues, so I've started going back to the office twice a week.
> - [ ] їй завжди подобалося працювати з дому
> - [x] раніше подобалося, а тепер вона сумує за колегами й частково повернулася в офіс
> - [ ] вона ніколи не працювала з дому
>
> **Пояснення:** *I used to love it* — «колись», а *but these days…* — зміна думки. В інтервʼю слухай слова-повороти: *but, actually, these days, to be honest*. (теми 04, 21)

> [!listen] Що сказала лікарка?
> level: B1 · type: answer · id: en-b1-review-l04
> audio: A: So, what did the doctor say?
> audio: B: She told me to rest for a few days, and she asked whether I'd been sleeping well. I said I hadn't.
> - [x] порадила відпочити й спитала, чи добре він спав
> - [ ] сказала, що він має більше спати на роботі
> - [ ] спитала, чи він відпочивав минулого тижня
>
> **Пояснення:** *told me to rest* — прохання / порада в непрямій мові (*tell + to*); *asked whether I'd been sleeping* — непряме питання з backshift. (тема 19)

> [!listen] Надрукуй почуте
> level: B1 · type: dictation · id: en-b1-review-l05
> audio: Turn it off and put it away.
> accept: Turn it off and put it away
>
> **Пояснення:** у швидкому мовленні це звучить як три «слова»: *tur-ni-toff* · *an-pu-ti-ta-way*. Приголосний у кінці чіпляється до голосного наступного слова. (тема 05)

> [!listen] Надрукуй почуте
> level: B1 · type: dictation · id: en-b1-review-l06
> audio: I've been waiting for an hour.
> accept: I have been waiting for an hour. | I've been waiting for 1 hour.
>
> **Пояснення:** *been* /bɪn/, *for* /fə/, *an* /ən/ — слабкі форми; наголос лише на *WAIT-* і *HOUR*. (теми 06, 13)

## Вимова

### Чекліст вимови

| Що | Перевір себе | Тема |
|---|---|---|
| linking: приголосний + голосний | *turn‿it‿off* · *an‿apple* · *pick‿it‿up* | 05 |
| linking: /j/ і /w/ між голосними | *I‿(j)agree* · *go‿(w)out* · *two‿(w)ears* | 05 |
| linking /r/ (UK) | *far‿away* · *more‿eggs* | 05 |
| слабкі форми | *for* /fə/ · *from* /frəm/ · *have* /əv/ · *was* /wəz/ · *can* /kən/ | 13 |
| ритм і наголос | 3 удари в *I've been WAITing for an HOUR* · фразові: *give UP*, *pick it UP* | 13 |
| сильна форма в кінці | *Who are you waiting **for** /fɔː/?* · *Yes, I **can** /kæn/.* | 13 |
| question tags | ↘ «ти ж згоден» · ↗ «я справді питаю» | 26 |
| наголос у словотворі | ***PHO**tograph* → *pho**TO**grapher*, ***ECO**nomy* → *eco**NOM**ic* | 23 |

### Мінімальні пари

> [!pair] He'd left /hiːd ˈleft/ — He left /hi ˈleft/
> level: B1 · id: en-b1-review-p01
> say: He'd left
> tip: *'d* перед *left* майже зливається з /l/ — слухай коротку «затримку» перед *left*. Без неї — простий Past Simple. (теми 03, 13)

> [!pair] I used to /aɪ ˈjuːst tə/ — I'm used to /aɪm ˈjuːst tə/
> level: B1 · id: en-b1-review-p02
> say: I'm used to
> tip: *I'm* — чути /m/. *I used to* — «колись», *I'm used to* — «я звик». Зміст зовсім різний! (тема 04)

> [!pair] If I win /ɪf aɪ ˈwɪn/ — If I won /ɪf aɪ ˈwʌn/
> level: B1 · id: en-b1-review-p03
> say: If I won
> tip: *won* звучить як *one* — /wʌn/. *If I win* — реальна можливість (1st), *If I won* — уявна (2nd). (теми 10, 11)

> [!pair] an aim /ən‿ˈeɪm/ — a name /ə ˈneɪm/
> level: B1 · id: en-b1-review-p04
> say: an aim
> tip: через linking *an‿aim* і *a name* звучать майже однаково. Розрізняє лише наголос і крихітна пауза: *a NAME* vs *an‿AIM*. (тема 05)

> [!pair] It's made /ɪts ˈmeɪd/ — It was made /ɪt wəz ˈmeɪd/
> level: B1 · id: en-b1-review-p05
> say: It was made
> tip: *was* у пасиві слабке — /wəz/, але склад є: «іт-вез-МЕЙД». *It's made* — Present, *It was made* — Past. (теми 13, 17)

> [!pair] I've been waiting /aɪv bɪn ˈweɪtɪŋ/ — I'm waiting /aɪm ˈweɪtɪŋ/
> level: B1 · id: en-b1-review-p06
> say: I've been waiting
> tip: *been* у реченні — коротке /bɪn/, а не /biːn/. Його легко пропустити, а без нього зникає «як довго». (теми 06, 13)

### Скажи вголос

> [!speak] Розкажи початок історії.
> level: B1 · id: en-b1-review-s01
> text: I was walking home when I realised I'd left my keys at work.
> ipa: /aɪ wəz ˈwɔːkɪŋ ˈhəʊm wen aɪ ˈrɪəlaɪzd aɪd ˈleft maɪ ˈkiːz ət ˈwɜːk/
> tip: *was* і *at* — слабкі /wəz ət/; *I'd* — коротко «айд»; *walking* — l німа.
> uk: Я йшов додому, коли зрозумів, що залишив ключі на роботі.

> [!speak] Скажи, як довго ти вчиш англійську.
> level: B1 · id: en-b1-review-s02
> text: I've been learning English for three years.
> ipa: /aɪv bɪn ˈlɜːnɪŋ ˈɪŋɡlɪʃ fə ˈθriː ˈjɪəz/
> tip: *been* /bɪn/ і *for* /fə/ — слабкі; *three* — /θ/, кінчик язика між зубами.
> uk: Я вчу англійську вже три роки.

> [!speak] Помрій уголос.
> level: B1 · id: en-b1-review-s03
> text: If I had more time, I'd travel more.
> ipa: /ɪf aɪ həd ˈmɔː ˈtaɪm aɪd ˈtrævl ˈmɔː/
> tip: *I'd* — «айд», не «ай вуд»; *travel* — /æ/, широко відкритий рот.
> uk: Якби я мав більше часу, я б більше подорожував.

> [!speak] Ввічливо не погодься.
> level: B1 · id: en-b1-review-s04
> text: I see your point, but I'm not sure I agree.
> ipa: /aɪ ˈsiː jə ˈpɔɪnt bət aɪm ˈnɒt ˈʃʊər aɪ əˈɡriː/
> tip: *your* і *but* — слабкі /jə bət/; *sure‿I* — з легким /r/ між голосними.
> uk: Я розумію твою думку, але не впевнений, що згоден.

> [!speak] Ввічливо спитай дорогу.
> level: B1 · id: en-b1-review-s05
> text: Could you tell me where the nearest station is?
> ipa: /kʊd ju ˈtel mi weə ðə ˈnɪərɪst ˈsteɪʃn ɪz/
> tip: *could you* — «куджу»; у кінці — *the station **is***, а не *is the station*.
> uk: Чи не підкажете, де найближча станція?

> [!speak] Почни розмову з question tag.
> level: B1 · id: en-b1-review-s06
> text: It's a lovely day, isn't it?
> ipa: /ɪts ə ˈlʌvli ˈdeɪ ˈɪznt ɪt/
> tip: голос **опускається** на *isn't it* ↘ — ти не питаєш, а запрошуєш погодитися.
> uk: Чудовий день, правда ж?

## Типові помилки українців

> [!pitfall] Will після if, when, as soon as
> «Якщо завтра **буде** дощ…» → *If it ~~will rain~~ **rains** tomorrow…*; «Подзвоню, щойно **приїду**» → *I'll call you as soon as I **arrive***. Після *if, when, unless, as soon as, before, after* — теперішній час, *will* лише в головній частині.

> [!pitfall] «Живу тут з 2021» — Present Simple
> *I ~~live~~ here since 2021* — помилка. Українське «живу з…» англійською — Present Perfect (Continuous): *I've lived / I've been living here **since** 2021*, *I've been working here **for** two years*.

> [!pitfall] Порядок слів у непрямій мові й питаннях
> *Could you tell me where ~~is the station~~?* → *where **the station is***. *He asked me where ~~do I live~~* → *where **I lived***. І *say* без «кому»: *She ~~said me~~* → *She **told** me* / *She **said** (to me)*.

## Практика

Тест рівня — питання з усіх 29 тем B1. Номер теми для повторення — у поясненні.

### Частина 1. Часи

> [!quiz] Sorry, I can't talk now. I ___ dinner.
> level: B1 · id: en-b1-review-q02
> - [ ] cook
> - [x] 'm cooking
> - [ ] 've cooked
> - [ ] cooked
>
> **Пояснення:** дія відбувається саме зараз — Present Continuous. Present Simple — звички й факти: *I cook every evening.* (тема 01)

> [!quiz] Які речення правильні? Обери всі.
> level: B1 · type: multi · id: en-b1-review-q03
> - [x] I'm thinking about changing my job.
> - [x] This bag belongs to my sister.
> - [ ] I'm knowing him for ten years.
> - [x] She's having a shower at the moment.
> - [ ] This coat is costing £80.
>
> **Пояснення:** *know, belong, cost* — дієслова стану, без -ing. Але *think* (обдумувати) і *have* (приймати душ, обідати) мають і значення дії — тоді -ing можливе. А «знаю 10 років» — *I've known him for ten years*. (теми 01, 06)

> [!quiz] When we got to the cinema, the film ___, so we missed the beginning.
> level: B1 · id: en-b1-review-q04
> - [ ] already started
> - [x] had already started
> - [ ] has already started
> - [ ] was already starting
>
> **Пояснення:** фільм почався **раніше**, ніж ми прийшли, — Past Perfect: *had started*. З *already started* виходить, що він почався вже після приходу. (тема 03)

> [!quiz] Розкажи історію: Past Simple, Continuous чи Perfect?
> level: B1 · type: fill · id: en-b1-review-q05 · bank: walked, had started, was leaving
>
> ```text fill
> I [[was walking]] home when it [[started]] to rain.
> I didn't have an umbrella because I [[had left]] it at the office.
> ```

> [!quiz] When I was a child, I ___ hate vegetables, but now I love them.
> level: B1 · id: en-b1-review-q06
> - [x] used to
> - [ ] use to
> - [ ] was used to
> - [ ] would
>
> **Пояснення:** минулий **стан**, якого вже немає, — *used to*. *Would* — лише для повторюваних **дій** (*We would play outside every day*), не для станів і почуттів (*hate, have, live*). (тема 04)

> [!quiz] I've lived in London for a year, so I ___ on the left now.
> level: B1 · id: en-b1-review-q07
> - [ ] used to drive
> - [ ] am used to drive
> - [x] 'm used to driving
> - [ ] use to driving
>
> **Пояснення:** «звик до чогось» — *be used to* + **-ing**: *I'm used to driving on the left*. *Used to drive* — «колись їздив», а тепер ні. (тема 04)

> [!quiz] Why are your hands so dirty? — I ___ in the garden all morning.
> level: B1 · id: en-b1-review-q08
> - [ ] worked
> - [ ] 've worked
> - [x] 've been working
> - [ ] was working
>
> **Пояснення:** видно наслідок **процесу**, що щойно тривав (*all morning*), — Present Perfect Continuous. Якщо важливий **результат** чи кількість — Simple: *I've planted ten trees.* (тема 06)

> [!quiz] Hurry up! The train ___ at 7.15.
> level: B1 · id: en-b1-review-q09
> - [x] leaves
> - [ ] is going to leave
> - [ ] will leaving
> - [ ] leave
>
> **Пояснення:** розклад (поїзди, уроки, фільми) — Present Simple: *The train leaves at 7.15.* (тема 08)

> [!quiz] Склади речення про домовленість: «У пʼятницю ми зустрічаємося з клієнтами».
> level: B1 · type: order · id: en-b1-review-q10
>
> ```text order
> We're
> meeting
> the clients
> on Friday.
> will meet ✗
> ```

> [!quiz] I've just realised I haven't got any cash. — Don't worry, I ___ you some.
> level: B1 · id: en-b1-review-q11
> - [ ] 'm going to lend
> - [x] 'll lend
> - [ ] lend
> - [ ] 'm lending
>
> **Пояснення:** рішення, прийняте **просто зараз**, і пропозиція допомоги — *will*. *Going to* — план, вирішений раніше. (тема 08)

### Частина 2. Умовні речення

> [!quiz] If it ___ tomorrow, we'll stay at home.
> level: B1 · id: en-b1-review-q12
> - [ ] will rain
> - [x] rains
> - [ ] rained
> - [ ] would rain
>
> **Пояснення:** перший умовний: *if* + Present Simple, головна частина — *will*. Після *if* — без *will*. (тема 10)

> [!quiz] I'll call you as soon as I ___ at the airport.
> level: B1 · id: en-b1-review-q13
> - [ ] will arrive
> - [x] arrive
> - [ ] arrived
> - [ ] would arrive
>
> **Пояснення:** часові підрядні (*when, as soon as, before, after, until*) про майбутнє — теж Present Simple. (тема 10)

> [!quiz] You won't pass the exam ___ you start studying now.
> level: B1 · id: en-b1-review-q14
> - [ ] if
> - [x] unless
> - [ ] when
> - [ ] as soon as
>
> **Пояснення:** *unless* = *if … not*: «якщо **не** почнеш». *You won't pass if you don't start studying.* (тема 10)

> [!quiz] If I ___ you, I'd accept the offer.
> level: B1 · id: en-b1-review-q15
> - [ ] am
> - [ ] will be
> - [x] were
> - [ ] would be
>
> **Пояснення:** порада через уявну ситуацію — *If I were you* (з усіма особами можна *were*). (тема 11)

> [!quiz] Другий умовний: заповни пропуски
> level: B1 · type: fill · id: en-b1-review-q16 · bank: have, will learn, would have
>
> ```text fill
> If I [[had]] more free time, I [[would learn]] to play the guitar.
> ```

> [!quiz] Ти майже не віриш, що виграєш у лотерею, але мрієш. Що скажеш?
> level: B1 · id: en-b1-review-q17
> - [ ] If I win the lottery, I'll travel the world.
> - [x] If I won the lottery, I'd travel the world.
> - [ ] If I will win the lottery, I travel the world.
> - [ ] If I would win the lottery, I'd travel the world.
>
> **Пояснення:** малоймовірне, уявне — другий умовний: *if* + Past, *would* + V1. Перший (*If I win…*) — коли це реальний шанс. *Would* в if-частині — помилка. (теми 10, 11)

### Частина 3. Модальні дієслова

> [!quiz] She isn't answering her phone. She ___ be in a meeting — I'm not sure.
> level: B1 · id: en-b1-review-q18
> - [ ] must
> - [x] might
> - [ ] can't
> - [ ] should
>
> **Пояснення:** просто можливість, без доказів (*I'm not sure*) — *might / may / could*. (тема 14)

> [!quiz] He ___ be at home. I've just seen him at the gym.
> level: B1 · id: en-b1-review-q19
> - [ ] mustn't
> - [x] can't
> - [ ] might
> - [ ] doesn't have to
>
> **Пояснення:** висновок «точно ні» з доказом — *can't*. *Mustn't* — це заборона, а не ймовірність. (тема 14)

> [!quiz] They've been travelling for fifteen hours. They ___ be exhausted.
> level: B1 · id: en-b1-review-q20
> - [x] must
> - [ ] can't
> - [ ] have to
> - [ ] mustn't
>
> **Пояснення:** логічний висновок «напевно так» — *must*: 15 годин у дорозі — доказ. (тема 14)

> [!quiz] The door was locked, but after ten minutes I ___ open it with a credit card.
> level: B1 · id: en-b1-review-q21
> - [ ] could
> - [x] managed to
> - [ ] can
> - [ ] was able
>
> **Пояснення:** один конкретний успіх після зусиль — *managed to* / *was able to*. *Could* у стверджувальному реченні — загальне вміння в минулому: *I could swim when I was five.* (тема 15)

> [!quiz] I hope I'll ___ speak Spanish fluently one day.
> level: B1 · id: en-b1-review-q22
> - [ ] can
> - [x] be able to
> - [ ] could
> - [ ] manage
>
> **Пояснення:** *can* не має форм майбутнього й інфінітива, тому після *will* — *be able to*: *I'll be able to…* (тема 15)

### Частина 4. Пасив, непряма мова, підрядні, артиклі

> [!quiz] This bridge ___ in 1890.
> level: B1 · id: en-b1-review-q23
> - [ ] built
> - [ ] is built
> - [x] was built
> - [ ] has built
>
> **Пояснення:** міст сам себе не будував, а коли — відомо (1890) — Past Simple Passive: *was / were* + V3. (тема 17)

> [!quiz] Склади речення в пасиві: «Англійською розмовляють у всьому світі».
> level: B1 · type: order · id: en-b1-review-q24
>
> ```text order
> English
> is
> spoken
> all over the world.
> speaks ✗
> ```

> [!quiz] The thief was caught ___ two police officers.
> level: B1 · id: en-b1-review-q25
> - [ ] from
> - [x] by
> - [ ] with
> - [ ] of
>
> **Пояснення:** хто виконав дію в пасиві — *by*: *was caught by the police*. *With* — інструмент: *opened with a key*. (тема 17)

> [!quiz] «I'm really tired», she said. → She said that she ___ really tired.
> level: B1 · id: en-b1-review-q26
> - [ ] is
> - [x] was
> - [ ] has been
> - [ ] were
>
> **Пояснення:** backshift: *am / is* → *was*, *will* → *would*, *have done* → *had done*. (тема 19)

> [!quiz] He ___ me that he would be late.
> level: B1 · id: en-b1-review-q27
> - [ ] said
> - [x] told
> - [ ] spoke
> - [ ] talked
>
> **Пояснення:** *tell* + кому: *He told **me** (that)…*; *say* — без «кому»: *He said (that)…* (тема 19)

> [!quiz] Перекажи питання й прохання
> level: B1 · type: fill · id: en-b1-review-q28 · bank: did I live, closing, do I live
>
> ```text fill
> "Where do you live?" → She asked me where [[I lived]].
> "Please close the door." → He asked me [[to close]] the door.
> ```

> [!quiz] That's the woman ___ son plays for the national team.
> level: B1 · id: en-b1-review-q29
> - [ ] who
> - [ ] which
> - [x] whose
> - [ ] that
>
> **Пояснення:** належність, «чий» — *whose*: *the woman whose son…* (тема 20)

> [!quiz] У яких реченнях можна пропустити who / which / that? Обери всі.
> level: B1 · type: multi · id: en-b1-review-q30
> - [x] The book that I bought yesterday is great.
> - [x] The man who we met at the party was a pilot.
> - [ ] The man who lives next door is a pilot.
> - [ ] The shop which sells cheap phones has closed.
>
> **Пояснення:** займенник можна пропустити, коли він — **додаток** (після нього є свій підмет: *I bought, we met*). Коли він сам підмет (*who lives, which sells*) — не можна. (тема 20)

> [!quiz] ___ dogs are usually more loyal than ___ cats.
> level: B1 · id: en-b1-review-q31
> - [ ] The / the
> - [x] — / —
> - [ ] A / a
> - [ ] The / —
>
> **Пояснення:** загальне твердження про всіх собак і котів — множина **без артикля**. *The dogs* — конкретні, відомі собаки. (тема 25)

> [!quiz] Яке речення правильне?
> level: B1 · id: en-b1-review-q32
> - [x] Last year we climbed in the Alps and visited Lake Geneva.
> - [ ] Last year we climbed in Alps and visited the Lake Geneva.
> - [ ] Last year we climbed in the Alps and visited the Lake Geneva.
> - [ ] Last year we climbed in an Alps and visited Lake Geneva.
>
> **Пояснення:** гірські хребти — з *the* (*the Alps, the Carpathians*), окремі озера — без (*Lake Geneva*). (тема 25)

> [!quiz] My grandma is in ___ hospital — she broke her leg.
> level: B1 · id: en-b1-review-q33
> - [ ] the
> - [ ] a
> - [x] — (без артикля)
> - [ ] an
>
> **Пояснення:** установа за призначенням (лежить як пацієнт) — без артикля: *in hospital, go to school, in prison*. *I went to **the** hospital to visit her* — будівля, куди прийшов відвідувач. (тема 25)

> [!quiz] You're from Lviv, ___?
> level: B1 · id: en-b1-review-q34
> - [ ] isn't it
> - [x] aren't you
> - [ ] don't you
> - [ ] are you
>
> **Пояснення:** стверджувальне речення → заперечний tag; той самий допоміжний і займенник: *You are… → aren't you?* (тема 26)

> [!quiz] Склади ввічливе питання: «Чи не підкажете, де вокзал?»
> level: B1 · type: order · id: en-b1-review-q35
>
> ```text order
> Could you
> tell me
> where
> the station
> is?
> is the station ✗
> ```

### Частина 5. Слова

> [!quiz] I really ___ my sister — we hardly ever argue.
> level: B1 · id: en-b1-review-q36
> - [x] get on with
> - [ ] fall out with
> - [ ] get over
> - [ ] look after
>
> **Пояснення:** *get on (well) with* — ладнати; *fall out with* — посваритися; *get over* — оговтатися; *look after* — доглядати. (тема 02)

> [!quiz] Always ___ your files before you update the system.
> level: B1 · id: en-b1-review-q37
> - [x] back up
> - [ ] log in
> - [ ] scroll
> - [ ] post
>
> **Пояснення:** *back up* — зробити резервну копію. Іменник — *a backup*. (тема 07)

> [!quiz] We need more ___ energy, such as solar and wind power.
> level: B1 · id: en-b1-review-q38
> - [x] renewable
> - [ ] recycled
> - [ ] endangered
> - [ ] polluted
>
> **Пояснення:** *renewable* — відновлюваний (сонце, вітер). *Recycled* — перероблений (папір, пластик), *endangered* — зникаючий вид. (тема 12)

> [!quiz] After two years she was ___ to team leader.
> level: B1 · id: en-b1-review-q39
> - [x] promoted
> - [ ] applied
> - [ ] hired
> - [ ] retired
>
> **Пояснення:** *be promoted (to)* — отримати підвищення. *Apply for* — подати заявку, *hire* — найняти, *retire* — вийти на пенсію. (тема 16)

> [!quiz] Заголовок: «PRESIDENT TO VISIT KYIV». Що він означає?
> level: B1 · id: en-b1-review-q40
> - [ ] Президент щойно відвідав Київ.
> - [x] Президент відвідає Київ.
> - [ ] Президент хоче, щоб його відвідали в Києві.
> - [ ] Президент постійно їздить до Києва.
>
> **Пояснення:** у заголовках *to* + V1 — майбутня подія, Present Simple — те, що щойно сталося (*PRESIDENT VISITS KYIV*), пасив без *be* (*BRIDGE CLOSED*). (тема 18)

> [!quiz] Make, do, take чи have?
> level: B1 · type: fill · id: en-b1-review-q41 · bank: get
>
> ```text fill
> Could you [[do]] me a favour?
> I can't [[make]] a decision right now.
> You look tired — let's [[take]] a break.
> I've never tried surfing, but I'd love to [[have]] a go.
> ```

> [!quiz] The instructions were so ___ that nobody understood what to do.
> level: B1 · id: en-b1-review-q42
> - [x] unclear
> - [ ] disclear
> - [ ] inclear
> - [ ] misclear
>
> **Пояснення:** заперечний префікс до *clear* — *un-*: *unclear, unhappy, unfair*. *Dis-* — з дієсловами й деякими прикметниками: *disagree, dishonest*. (тема 23)

> [!quiz] Утвори потрібне слово
> level: B1 · type: fill · id: en-b1-review-q43 · bank: successfully, harmless, develop
>
> ```text fill
> She's a very [[successful]] businesswoman. (success)
> Plastic bags are [[harmful]] to sea animals. (harm)
> The [[development]] of the city centre took ten years. (develop)
> ```

> [!quiz] We've ___ milk. Could you buy some on your way home?
> level: B1 · id: en-b1-review-q44
> - [x] run out of
> - [ ] put off
> - [ ] come across
> - [ ] given up
>
> **Пояснення:** *run out of* — скінчитися (у нас). *Put off* — відкласти, *come across* — натрапити, *give up* — кинути. (тема 24)

> [!quiz] «Don't worry about the test — it'll be a piece of cake.» Що це означає?
> level: B1 · id: en-b1-review-q45
> - [ ] після тесту буде торт
> - [x] тест буде дуже легким
> - [ ] тест буде коротким
> - [ ] тест складатиметься з частин
>
> **Пояснення:** *a piece of cake* — «простіше простого». Ідіоми не перекладаються дослівно. (тема 24)

### Частина 6. Навички й вимова

> [!quiz] Де між словами зʼявляється легкий звук /w/?
> level: B1 · id: en-b1-review-q46
> - [x] go out
> - [ ] I agree
> - [ ] turn it off
> - [ ] far away
>
> **Пояснення:** після /uː/, /əʊ/, /aʊ/ вставляємо /w/: *go‿(w)out*. *I‿(j)agree* — /j/, *turn‿it‿off* — приголосний до голосного, *far‿away* — /r/. (тема 05)

> [!quiz] Як звучить for у питанні «Who are you waiting for?»
> level: B1 · id: en-b1-review-q47
> - [ ] /fə/ — слабко, як завжди
> - [x] /fɔː/ — повна форма, бо слово в кінці речення
> - [ ] /fər/ — з чітким r
> - [ ] не вимовляється
>
> **Пояснення:** прийменник у кінці речення, під наголосом чи окремо — **сильна** форма. Усередині (*This is for you*) — слабка /fə/. (тема 13)

> [!quiz] Перед IELTS Listening ти маєш 30 секунд, щоб прочитати питання. Що найкорисніше зробити?
> level: B1 · id: en-b1-review-q48
> - [ ] закрити очі й розслабитися
> - [x] підкреслити ключові слова й передбачити тип відповіді (число, імʼя, дата)
> - [ ] заздалегідь вписати відповіді навмання
> - [ ] перекласти всі питання українською
>
> **Пояснення:** передбачення — головна стратегія аудіювання: знаючи, що чекаєш число чи імʼя, ти «ловиш» його в потоці. (тема 09)

> [!quiz] Співрозмовник каже: «It's not a bad idea, but I'm not sure it'll work in practice.» Яке його ставлення?
> level: B1 · id: en-b1-review-q49
> - [ ] повністю «за»
> - [x] сумнівається, хоч і не відкидає ідею
> - [ ] категорично проти
> - [ ] байдуже
>
> **Пояснення:** *not a bad idea* — ввічлива частина, *but I'm not sure* — справжня думка. В інтервʼю слухай, що йде **після** *but*. (тема 21)

> [!quiz] Лист починається «Dear Sir or Madam,». Як його закінчити?
> level: B1 · id: en-b1-review-q50
> - [ ] Love,
> - [ ] Best wishes,
> - [x] Yours faithfully,
> - [ ] See you soon!
>
> **Пояснення:** не знаєш імені адресата — *Yours faithfully*; знаєш (*Dear Mr Brown*) — *Yours sincerely*. *Love, Best wishes* — для друзів. (тема 27)

> [!quiz] The flat is quite small. ___, it's very close to the city centre.
> level: B1 · id: en-b1-review-q51
> - [ ] Because
> - [x] However
> - [ ] In addition
> - [ ] So
>
> **Пояснення:** протиставлення двох речень — *However,* (з комою). *In addition* — додає ще один аргумент в той самий бік. (тема 27)

> [!quiz] Тобі треба швидко знайти в статті, коли відкрили музей. Як читаєш?
> level: B1 · id: en-b1-review-q52
> - [ ] уважно читаю кожне слово з початку
> - [ ] skimming — лише заголовок і перші речення абзаців
> - [x] scanning — очима шукаю число чи дату
> - [ ] перекладаю текст у перекладачі
>
> **Пояснення:** конкретна деталь (дата, імʼя, число) — *scanning*. *Skimming* — для загальної думки. (тема 28)

> [!quiz] Яка фраза — ввічлива незгода?
> level: B1 · id: en-b1-review-q53
> - [ ] You're wrong.
> - [ ] That's stupid.
> - [x] I see your point, but I don't think that's always true.
> - [ ] Exactly!
>
> **Пояснення:** спершу визнай думку співрозмовника (*I see your point*), потім — своя (*but…*). *Exactly!* — повна згода. (тема 29)

## Міні-IELTS

> [!important] IELTS і рівень B1
> - За офіційним узгодженням Cambridge / British Council рівень **B1 ≈ IELTS 4.0–5.0** (орієнтовно). Це ціль цього рівня: B2 — уже 5.5–6.5.
> - Бал — середнє чотирьох модулів: Listening, Reading, Writing, Speaking. Письмо й говоріння тут не оцінюються автоматично — перевір себе за чеклістами.
> - Завдання нижче — власні, у форматі іспиту. Справжні тести — у джерелах наприкінці.

### Listening Part 1 — бронювання курсу

Побутова розмова двох людей. Ти чуєш запис **один раз** — як на іспиті.

> [!listen] Запиши прізвище (ONE WORD)
> level: B1 · type: answer · id: en-b1-review-l07
> audio: A: Can I have your surname, please?
> audio: B: Sure. It's Shevchuk. S, H, E, V, C, H, U, K.
> - [x] Shevchuk
> - [ ] Shewchuk
> - [ ] Schevchuk
>
> **Пояснення:** у Part 1 прізвище диктують по літерах — пиши саме те, що чуєш, без «знайомих» варіантів. (тема 09)

> [!listen] Запиши номер телефону
> level: B1 · type: answer · id: en-b1-review-l08
> audio: A: And a contact number?
> audio: B: It's oh seven nine double four, six one two, three oh eight.
> - [ ] 07944 621 308
> - [x] 07944 612 308
> - [ ] 07494 612 308
>
> **Пояснення:** *oh* = 0, *double four* = 44. Номери диктують групами — записуй групу одразу, не чекай кінця. (теми 09, A1-13)

> [!listen] Коли починається курс?
> level: B1 · type: answer · id: en-b1-review-l09
> audio: A: When does the course start?
> audio: B: On the third of March — oh, sorry, no. The third is the open day. The first lesson is on the tenth.
> - [ ] 3 березня
> - [x] 10 березня
> - [ ] 13 березня
>
> **Пояснення:** самовиправлення (*oh, sorry, no*) — найчастіша пастка Part 1. Правильна відповідь — остання. (тема 09)

> [!listen] Скільки заплатить студентка?
> level: B1 · type: answer · id: en-b1-review-l10
> audio: A: How much is the course?
> audio: B: It's a hundred and twenty pounds for ten weeks, but students get twenty per cent off, so for you it's ninety-six.
> - [ ] £120
> - [ ] £20
> - [x] £96
>
> **Пояснення:** у записі звучать три числа — потрібне те, що стосується саме цієї людини: *for you it's ninety-six*. (тема 09)

### Listening Part 2 — гід у парку

Монолог на побутову тему: план місцевості й вибір відповіді.

> [!listen] Де стоянка для велосипедів? Подивись на план і послухай.
> level: B1 · type: answer · id: en-b1-review-l11
> audio: When you come through the main gate, the visitor centre is right in front of you. The bike park is behind the visitor centre, to the right of the lake.
>
> | | ліворуч | посередині | праворуч |
> |---|---|---|---|
> | **дальня частина** | **A** | Lake | **B** |
> | **середина** | **C** | Visitor centre | **D** |
> | **біля входу** | Car park | ⬆ Main gate | **E** |
>
> - [ ] A
> - [x] B
> - [ ] C
> - [ ] D
> - [ ] E
>
> **Пояснення:** *behind the visitor centre* — у дальній частині, *to the right of the lake* — праворуч від озера. Отже, B. (тема 09)

> [!listen] Чому закрита північна стежка?
> level: B1 · type: answer · id: en-b1-review-l12
> audio: The north path is closed this week — not because of the weather, as many visitors think, but because workers are repairing the old bridge.
> - [ ] через погану погоду
> - [x] ремонтують старий міст
> - [ ] забагато відвідувачів
>
> **Пояснення:** *not because of the weather* — дистрактор: слово звучить, але його заперечено. Відповідь — після *but because*. (тема 09)

### Reading — True / False / Not Given і matching

Прочитай текст. Спершу skimming (1 хвилина), потім питання.

> [!example] Repair cafés: fixing more than things
> **A.** The first repair café opened in Amsterdam in 2009. The idea was simple: once a month, local people bring broken things — lamps, bicycles, clothes, toasters — and volunteers try to fix them for free. Today there are more than 2,500 repair cafés around the world, from Kyiv to California.
>
> **B.** Most volunteers are retired engineers, electricians or tailors, but you don't need to be an expert to join. "Half of our helpers learned everything here," says Olena Marchuk, who runs a repair café in Lviv. Visitors are expected to stay and watch, so that next time they can do the repair themselves.
>
> **C.** Supporters say the cafés help the environment. Every year, millions of tonnes of electronic waste are thrown away, and a lot of it is not seriously broken. According to one Dutch study, about 70 per cent of the items brought to repair cafés are fixed successfully.
>
> **D.** However, not everyone is happy. Some shop owners complain that free repairs take customers away from them. Others point out that many modern gadgets are designed in a way that makes repair almost impossible: batteries are glued in, and spare parts are not sold.

> [!quiz] IELTS True / False / Not Given: «The first repair café was opened in the Netherlands.»
> level: B1 · id: en-b1-review-q54
> - [x] True
> - [ ] False
> - [ ] Not Given
>
> **Пояснення:** абзац A: *opened in Amsterdam* — Амстердам у Нідерландах. Парафраз (*Amsterdam* → *the Netherlands*) — типовий для True. (тема 28)

> [!quiz] IELTS True / False / Not Given: «Visitors pay a small fee for each repair.»
> level: B1 · id: en-b1-review-q55
> - [ ] True
> - [x] False
> - [ ] Not Given
>
> **Пояснення:** абзац A: *volunteers try to fix them **for free***. Текст прямо каже протилежне → False. (тема 28)

> [!quiz] IELTS True / False / Not Given: «Olena Marchuk used to work as an electrician.»
> level: B1 · id: en-b1-review-q56
> - [ ] True
> - [ ] False
> - [x] Not Given
>
> **Пояснення:** про Олену сказано лише, що вона *runs a repair café in Lviv*. Ким вона працювала раніше — у тексті немає. Електрики згадані, але не про неї → Not Given. (теми 04, 28)

> [!quiz] IELTS Matching headings: який заголовок для абзацу B?
> level: B1 · id: en-b1-review-q57
> - [ ] i. A worldwide movement from one small idea
> - [x] ii. Learning by watching
> - [ ] iii. Good for the planet
> - [ ] v. Only experts can help
>
> **Пояснення:** головна думка B — не обовʼязково бути експертом, а відвідувачі дивляться й вчаться (*stay and watch… do the repair themselves*). Заголовок v прямо суперечить тексту. (тема 28)

> [!quiz] IELTS Matching headings: який заголовок для абзацу D?
> level: B1 · id: en-b1-review-q58
> - [ ] iii. Good for the planet
> - [x] iv. Criticism and difficulties
> - [ ] vi. How to open your own repair café
> - [ ] i. A worldwide movement from one small idea
>
> **Пояснення:** *However, not everyone is happy* — абзац про критику (власники магазинів) і труднощі (батареї приклеєні, запчастин немає). (тема 28)

> [!quiz] IELTS Sentence completion: ONE WORD ONLY з тексту
> level: B1 · type: fill · id: en-b1-review-q59 · bank: week, pay, sold
>
> ```text fill
> Repair cafés usually take place once a [[month]].
> Visitors should stay and [[watch]] the repair.
> In many modern gadgets, the batteries are [[glued]] in.
> ```

### Writing Task 1 — лист (General Training)

> [!example] Завдання (20 хвилин, 150+ слів)
> *You have recently moved to a new flat in another city. Write a letter to an English-speaking friend. In your letter:*
> - *describe your new flat*
> - *say what you like and don't like about the area*
> - *invite your friend to come and visit*
>
> *Write at least 150 words. You do NOT need to write any addresses. Begin your letter as follows: **Dear …,***

**Чекліст перед здачею** (тема 27):

- [ ] регістр неформальний: *Dear Tom, / Hi Tom,* … *Best wishes, / Love,* — без *Yours faithfully*;
- [ ] **усі три пункти** завдання — кожен в окремому абзаці; плюс коротке вступне й завершальне речення;
- [ ] 150+ слів (порахуй слова в рядку × кількість рядків);
- [ ] різні часи: *I've been living here for a month*, *I used to…*, *If you come in May, we'll…*;
- [ ] звʼязки: *However, Apart from that, The best thing is…, What's more*;
- [ ] скорочення (*I've, it's*) — у неформальному листі можна; в офіційному — краще ні;
- [ ] фінальна фраза: *Let me know when you're free! / Hope to see you soon!*

> [!quiz] IELTS Writing Task 1 (GT): яке речення найкраще відкриває цей лист?
> level: B1 · id: en-b1-review-q60
> - [ ] I am writing to inform you about my change of address.
> - [x] Sorry it's taken me so long to write — I've been really busy with the move!
> - [ ] Dear Sir or Madam, I would like to complain about my flat.
> - [ ] Flat. New. Big. Come.
>
> **Пояснення:** лист другові — неформальний регістр: скорочення, дружній тон, Present Perfect Continuous для «останнім часом». Перший варіант — для офіційного листа. (теми 06, 27)

### Writing Task 2 — есе-думка

> [!example] Завдання (40 хвилин, 250+ слів)
> *Some people think that children should not be allowed to have their own smartphones until they are at least 14 years old.*
>
> *To what extent do you agree or disagree?*
>
> *Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.*

**Чекліст перед здачею** (тема 27; критерії — Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy):

- [ ] **вступ**: перефразуй тему (не копіюй!) + чітка позиція: *I partly agree that…*;
- [ ] **два абзаци тіла**: причина → пояснення → приклад; одна головна думка на абзац;
- [ ] **висновок**: повтори позицію іншими словами, без нових аргументів;
- [ ] звʼязки: *Firstly, In addition, However, For example, As a result, In conclusion*;
- [ ] граматика B1 для «діапазону»: умовні (*If children had phones…*), пасив (*it is often said*), означальні (*parents who…*), модальні (*might, can't*);
- [ ] лексика теми: *screen time, addicted, online safety, social media* (теми 07, 18);
- [ ] 250+ слів, без скорочень (*do not*, а не *don't*), без «I think» у кожному реченні.

### Speaking Part 2 — cue card

> [!example] Картка (cue card)
> **Describe a skill you learned that was difficult at first.**
> You should say:
> - what the skill is
> - when and how you learned it
> - what problems you had
>
> and explain how you feel about this skill now.

**1 хвилина** — нотатки (5–7 ключових слів), **2 хвилини** — монолог (тема 29). Покажи граматику B1: *I used to think…* (04), *I'd been trying for weeks before…* (03), *In the end I managed to…* (15), *I've been doing it for two years now* (06), *If I hadn't…* — це вже B2, на B1 досить *If I had more time, I'd…* (11).

> [!speak] Почни відповідь Part 2.
> level: B1 · id: en-b1-review-s07
> text: I'd like to talk about a skill that I found difficult at first.
> ipa: /aɪd ˈlaɪk tə ˈtɔːk əˈbaʊt ə ˈskɪl ðət aɪ ˈfaʊnd ˈdɪfɪkəlt ət ˈfɜːst/
> tip: *talk* — l німа: /tɔːk/; *that* і *at* — слабкі /ðət ət/; *difficult* — наголос на першому складі.
> uk: Я хотів би розповісти про навичку, яка спочатку давалася мені важко.

> [!tip] Твоя черга
> Постав таймер: 1 хвилина на нотатки, 2 хвилини — говори. Запиши себе й переслухай: чи всі пункти картки є? чи були паузи довші за 3 секунди? скільки різних часів і звʼязок ти вжив? Говорив 2 хвилини без зупинок і зі звʼязками — це вже рівень band 5.

## Фішки

> [!reel] 🚪 B1 — «поріг» самостійності
> Англійська назва рівня B1 у CEFR — *Threshold*, «поріг». З нього людина вже не турист, а самостійний користувач мови: може розповісти історію, обґрунтувати думку й впоратися з більшістю ситуацій у подорожі.

> [!reel] 🎯 IELTS 4.0–5.0 — що це означає
> B1 у балах IELTS — приблизно 4.0–5.0. Для багатьох університетів треба 6.0–6.5, для візи чи роботи — від 4.0. Кожні пів бала — це помітно більше слів, точніша граматика й довші відповіді без пауз.

> [!reel] 🚀 Що далі на B2
> На B2 зʼявляться третій умовний (*If I had known…*), *wish*, модальні в минулому (*must have been*), *despite / whereas*, фільми й лекції в оригіналі — і IELTS 5.5–6.5.

## Джерела та що почитати

- [Council of Europe — CEFR](https://www.coe.int/en/web/common-european-framework-reference-languages) — що означає рівень B1 (Threshold).
- [IELTS — формат тесту](https://ielts.org/take-a-test/test-types) — Listening, Reading, Writing, Speaking; Academic і General Training.
- [Cambridge English — B1 Preliminary](https://www.cambridgeenglish.org/exams-and-tests/preliminary/) — формат і зразки екзамену рівня B1.
- [British Council LearnEnglish — B1–B2 grammar](https://learnenglish.britishcouncil.org/grammar/b1-b2-grammar) — повторення граматики з вправами.
- R. Murphy — *English Grammar in Use* — часи, умовні, пасив, непряма мова, артиклі.
- *Cambridge IELTS* (Cambridge University Press) — офіційні пробні тести для самоперевірки.

> [!important] Підсумок
> - B1 = наративні часи, used to, Present Perfect Continuous, усі форми майбутнього, умовні 0–2, модальні ймовірності й уміння, пасив, непряма мова, означальні, артиклі, question tags.
> - Найчастіші помилки: *if it will rain*, *I live here since 2021*, *mustn't* замість *can't*, *where is the station* у непрямому питанні, *said me*.
> - Помилився — відкрий тему з номером у поясненні й пройди її тест ще раз.
> - 80 % і більше — ти готовий до B2, а в IELTS орієнтовно цілишся в 4.5–5.0.
