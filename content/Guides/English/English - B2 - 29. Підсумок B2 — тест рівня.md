---
title: Підсумок B2 — тест рівня
order: 429
id: en-b2-review
level: B2
icon: px:target
tags: [english, b2, review, test, grammar, vocabulary, pronunciation, listening, ielts]
prerequisites: ["[[English - B2 - 28. Ситуації — оренда, скарги, банк, співбесіда]]", "[[English - B2 - 27. Читання — довгі тексти, висновки й тон автора]]", "[[English - B2 - 26. Говоріння — аргументація, дискусія, переконання]]", "[[English - B2 - 25. Письмо — есе for and against, звіт, відгук]]", "[[English - B1 - 30. Підсумок B1 — тест рівня]]"]
estimatedMinutes: 90
---

# Підсумок B2 — тест рівня

> [!success] Після цієї теми ти знатимеш
> - чи закрив рівень **B2**: уся система часів, Future Perfect, третій і змішані умовні, *wish*, пасив і каузатив, дієслова непрямої мови, модальні в минулому, герундій та інфінітив, non-defining і скорочені підрядні, звʼязки;
> - чи впевнено тримаєш лексику B2: бізнес, наука, закон, здоровʼя, економіка, культура, фразові дієслова за частками, ідіоми, колокації, словотвір;
> - чи розумієш природне мовлення: звʼязне мовлення, *gonna / wanna*, лекції, фільми й дискусії;
> - як ти виконуєш **міні-IELTS** — Listening Parts 3–4, Academic Reading, Writing Task 1 і 2, Speaking Part 2–3 — і що означає орієнтовний бал **5.5–6.5**;
> - які теми повторити — у кінці кожного пояснення є номер теми.

Нового матеріалу тут немає: карта граматики рівня, ключові форми, чеклісти, великий змішаний тест і міні-IELTS. Проходь без підказок і записуй помилки — номер теми в поясненні покаже, куди повернутися.

## Передбач

> [!quiz] If I ___ about the traffic, I would have left earlier.
> level: B2 · id: en-b2-review-q01
> - [ ] knew
> - [ ] would know
> - [x] had known
> - [ ] have known
>
> **Пояснення:** уявне минуле — третій умовний: *if* + Past Perfect, головна частина — *would have* + V3. Українське «якби я знав» не показує часу, тому українці часто пишуть *If I knew* — це вже про теперішнє. (тема 03)

## Карта рівня B2

### Граматика B2 одним поглядом

> [!diagram] Граматика B2: шість гілок
> ```yaml
> layout: tree
> nodes:
>   - { id: root, label: "B2", text: "Граматика рівня", note: "точність і відтінки значень", tone: gray, icon: "px:target" }
>   - { id: tenses, parent: root, label: "теми 01, 02", text: "Часи як система", note: "аспекти simple / continuous / perfect · will be doing · will have done", tone: blue }
>   - { id: unreal, parent: root, label: "теми 03, 04", text: "Нереальне", note: "3-й і змішані умовні · wish · if only · I'd rather · it's time", tone: violet }
>   - { id: passive, parent: root, label: "теми 05, 06", text: "Пасив і переказ", note: "have it done · it is said that · suggest / deny / warn", tone: green }
>   - { id: modals, parent: root, label: "тема 07", text: "Модальні в минулому", note: "must have · can't have · should have · needn't have", tone: orange }
>   - { id: patterns, parent: root, label: "тема 08", text: "Герундій та інфінітив", note: "remember / stop / try + -ing чи to", tone: mint }
>   - { id: clauses, parent: root, label: "теми 09, 10", text: "Речення й звʼязки", note: ", which… · the man sitting… · although / despite / whereas", tone: yellow }
> steps:
>   - { focus: root, note: "B2 — рівень, на якому ти не просто будуєш речення, а обираєш відтінок: процес чи результат, факт чи припущення, жаль чи критика." }
>   - { focus: tenses, note: "Часи як система: аспект (simple, continuous, perfect) × час. Плюс майбутнє з поглядом назад: By 2030 I'll have finished." }
>   - { focus: unreal, note: "Нереальне: що було б, якби (If I had known…), змішані умовні (If I'd taken the job, I'd be rich now) і жаль (I wish I had…)." }
>   - { focus: passive, note: "Пасив усіх часів, каузатив (I had my car repaired), безособовий пасив (He is said to be…) і дієслова-репортери з їхніми моделями." }
>   - { focus: [modals, patterns], note: "Модальні в минулому — висновки й критика (She must have forgotten. You should have told me). Герундій чи інфінітив змінює значення: stop smoking ≠ stop to smoke." }
>   - { focus: clauses, note: "Складні речення: non-defining з комами, which про все речення, participle clauses; звʼязки контрасту, причини й мети з правильною пунктуацією." }
> ```

### Уявне тепер і уявне минуле

> [!diagram] Нереальне: тепер чи минуле
> ```yaml
> layout: compare
> columns: { now: "уявне тепер (B1 + тема 04)", past: "уявне минуле (теми 03, 04)" }
> nodes:
>   - { id: c2, col: now, label: "2-й умовний", text: "If I had time, I'd help.", note: "if + Past · would + V1", tone: blue }
>   - { id: c3, col: past, label: "3-й умовний", text: "If I had had time, I'd have helped.", note: "if + Past Perfect · would have + V3", tone: violet }
>   - { id: w1, col: now, label: "жаль про тепер", text: "I wish I knew the answer.", note: "wish + Past", tone: blue }
>   - { id: w2, col: past, label: "жаль про минуле", text: "I wish I had known.", note: "wish + Past Perfect", tone: violet }
>   - { id: mx, col: now, label: "змішаний", text: "If I'd taken that job, I'd be rich now.", note: "минула умова → теперішній наслідок", tone: orange }
> steps:
>   - { show: [c2, c3], note: "Крок назад у часі: Past → Past Perfect, would → would have + V3. If I had time — зараз; if I had had time — тоді." }
>   - { show: [w1, w2], note: "Wish працює так само: I wish I knew — шкода, що не знаю зараз; I wish I had known — шкода, що не знав тоді." }
>   - { show: mx, note: "Змішаний умовний: умова в минулому, наслідок — тепер. If I'd taken that job (тоді), I'd be rich now (зараз)." }
> ```

### Усі теми B2

1. [[English - B2 - 01. Система часів — simple, continuous, perfect|Система часів — simple, continuous, perfect]]
2. [[English - B2 - 02. Future Continuous і Future Perfect|Future Continuous і Future Perfect]]
3. [[English - B2 - 03. Третій і змішані умовні|Третій і змішані умовні]]
4. [[English - B2 - 04. Wish, if only, I'd rather, it's time|Wish, if only, I'd rather, it's time]]
5. [[English - B2 - 05. Пасив глибше — have something done, it is said that|Пасив глибше — have something done, it is said that]]
6. [[English - B2 - 06. Непряма мова — suggest, admit, deny, warn|Непряма мова — suggest, admit, deny, warn]]
7. [[English - B2 - 07. Модальні в минулому — must have, should have, could have|Модальні в минулому — must have, should have, could have]]
8. [[English - B2 - 08. Герундій та інфінітив — remember, stop, try|Герундій та інфінітив — remember, stop, try]]
9. [[English - B2 - 09. Підрядні речення — non-defining і скорочені|Підрядні речення — non-defining і скорочені]]
10. [[English - B2 - 10. Звʼязки — although, despite, whereas, however|Звʼязки — although, despite, whereas, however]]
11. [[English - B2 - 11. Звʼязне мовлення — випадіння, злиття, intrusive r|Звʼязне мовлення — випадіння, злиття, intrusive r]]
12. [[English - B2 - 12. Розмовні скорочення — gonna, wanna, gotta, dunno|Розмовні скорочення — gonna, wanna, gotta, dunno]]
13. [[English - B2 - 13. Аудіювання — лекції й нотатки|Аудіювання — лекції й нотатки]]
14. [[English - B2 - 14. Аудіювання — фільми й серіали|Аудіювання — фільми й серіали]]
15. [[English - B2 - 15. Бізнес — зустрічі, переговори, листування|Бізнес — зустрічі, переговори, листування]]
16. [[English - B2 - 16. Наука, технології й майбутнє|Наука, технології й майбутнє]]
17. [[English - B2 - 17. Суспільство, закон і злочинність|Суспільство, закон і злочинність]]
18. [[English - B2 - 18. Здоровʼя, психологія й спосіб життя|Здоровʼя, психологія й спосіб життя]]
19. [[English - B2 - 19. Гроші, економіка й споживання|Гроші, економіка й споживання]]
20. [[English - B2 - 20. Мистецтво, культура й рецензії|Мистецтво, культура й рецензії]]
21. [[English - B2 - 21. Фразові дієслова — частки up, out, off, down, over|Фразові дієслова — частки up, out, off, down, over]]
22. [[English - B2 - 22. Ідіоми й сталі вирази B2|Ідіоми й сталі вирази B2]]
23. [[English - B2 - 23. Колокації — прикметник, іменник, прислівник|Колокації — прикметник, іменник, прислівник]]
24. [[English - B2 - 24. Словотвір — складні слова й заперечні префікси|Словотвір — складні слова й заперечні префікси]]
25. [[English - B2 - 25. Письмо — есе for and against, звіт, відгук|Письмо — есе for and against, звіт, відгук]]
26. [[English - B2 - 26. Говоріння — аргументація, дискусія, переконання|Говоріння — аргументація, дискусія, переконання]]
27. [[English - B2 - 27. Читання — довгі тексти, висновки й тон автора|Читання — довгі тексти, висновки й тон автора]]
28. [[English - B2 - 28. Ситуації — оренда, скарги, банк, співбесіда|Ситуації — оренда, скарги, банк, співбесіда]]

### Ключові форми

**Часи й майбутнє**

| Що | Форма | Приклад | Тема |
|---|---|---|---|
| аспект continuous | be + V-ing — процес, тимчасове, роздратування | *He**'s always interrupting** me!* | 01 |
| аспект perfect | have + V3 — результат до точки відліку | *By the time we arrived, they**'d left**.* | 01 |
| Past Perfect Continuous | had been + V-ing | *We**'d been waiting** for an hour when the bus came.* | 01 |
| Future Continuous | will be + V-ing | *This time tomorrow I**'ll be flying** to Rome.* | 02 |
| Future Perfect | will have + V3 | *By 2030 we**'ll have cut** emissions by half.* | 02 |
| Future Perfect Continuous | will have been + V-ing | *In June I**'ll have been working** here for ten years.* | 02 |

**Нереальне**

| Що | Форма | Приклад | Тема |
|---|---|---|---|
| третій умовний | if + Past Perfect → would have + V3 | *If I'd known, I**'d have called**.* | 03 |
| змішаний (минуле → тепер) | if + Past Perfect → would + V1 | *If I'd studied medicine, I**'d be** a doctor now.* | 03 |
| змішаний (тепер → минуле) | if + Past → would have + V3 | *If she **weren't** so shy, she**'d have come**.* | 03 |
| жаль про тепер / минуле | wish + Past / Past Perfect | *I wish I **knew**. I wish I **had known**.* | 04 |
| роздратування | wish + would | *I wish you **would stop** shouting.* | 04 |
| I'd rather · it's time | + інша особа + Past | *I'd rather you **didn't**. It's time we **went**.* | 04 |

**Пасив, переказ, модальні**

| Що | Форма | Приклад | Тема |
|---|---|---|---|
| пасив усіх часів | be (у потрібному часі) + V3 | *The bridge **is being built**. It **will have been finished** by May.* | 05 |
| каузатив | have / get + обʼєкт + V3 | *I **had my car repaired**.* | 05 |
| безособовий пасив | it is said that… · he is said to (have) + V | *He **is said to have left** the country.* | 05 |
| дієслова непрямої мови | + -ing · + to · + обʼєкт + to · + that | *She **denied taking** it. He **warned me not to** go. They **suggested that** we wait.* | 06 |
| висновок про минуле | must have · can't have · might have + V3 | *She **must have forgotten**.* | 07 |
| критика й жаль | should have · shouldn't have · could have + V3 | *You **should have told** me.* | 07 |
| зайва дія | needn't have + V3 ≠ didn't need to | *We **needn't have cooked** so much.* | 07 |

**Дієслівні моделі, підрядні, звʼязки**

| Що | Форма | Приклад | Тема |
|---|---|---|---|
| remember / forget | + -ing — спогад · + to — не забути зробити | *I remember **locking** it. Remember **to lock** it.* | 08 |
| stop / try | stop **doing** — припинити · stop **to do** — зупинитися, щоб · try **doing** — експеримент · try **to do** — намагатися | *Try **restarting** it.* | 08 |
| прийменник + -ing | look forward **to**, be used **to**, it's no use **-ing** | *I'm looking forward to **seeing** you.* | 08 |
| non-defining | кома + who / which (не that) | *My brother, **who** lives in Lviv, is a doctor.* | 09 |
| which про все речення | …, which… | *He passed, **which** surprised everyone.* | 09 |
| participle clauses | V-ing / V3 замість who / which | *the man **sitting** next to me · a house **built** in 1900* | 09 |
| контраст | although + речення · despite + іменник / -ing · whereas · However, | ***Despite** the rain, we went. Some agree, **whereas** others don't.* | 10 |
| мета | to · in order to · so as (not) to · so that + can / could | *He left early **so as not to** be late.* | 10 |

### Чекліст «я вмію» B2

- обирати час за аспектом: процес чи результат, тимчасове чи постійне; говорити про майбутнє з поглядом назад (*By then I'll have…*);
- міркувати про минуле, якого не було, і його наслідки для теперішнього; висловлювати жаль і роздратування (*I wish…, If only…, I'd rather you didn't…*);
- переказувати чужі слова точними дієсловами (*admit, deny, warn, suggest, accuse of*) і передавати чутки безособовим пасивом (*is said to have…*);
- робити висновки про минуле й критикувати (*must have, can't have, should have, needn't have*);
- будувати складні речення з non-defining і скороченими підрядними та звʼязками контрасту, причини й мети;
- розуміти природне швидке мовлення, лекції з нотатками, фільми й серіали без адаптації;
- обговорювати бізнес, науку, закон, здоровʼя, економіку й культуру; вживати фразові дієслова, ідіоми й колокації B2;
- написати есе *for and against*, звіт, відгук і IELTS Task 1 з overview; аргументувати й ввічливо сперечатися;
- розвʼязувати складні побутові ситуації: оренда, банк, ескалація скарги, співбесіда.

## Приклади

- *By the time I got to the station, the train had already left, so I'll be working from home tomorrow.* — Коли я дістався до вокзалу, поїзд уже пішов, тож завтра я працюватиму з дому.
- *If I had listened to my parents, I wouldn't be in this mess now.* — Якби я послухав батьків, я б зараз не вскочив у цю халепу.
- *I wish I had taken that job — it's high time I changed careers.* — Шкода, що я не взяв ту роботу, — мені давно пора змінити професію.
- *The castle is said to have been built in the 12th century.* — Кажуть, замок збудували в XII столітті.
- *She denied breaking the vase, but she must have done it — nobody else was at home.* — Вона заперечила, що розбила вазу, але це точно вона — більше нікого вдома не було.
- *Have you tried turning it off and on again?* — Ти пробував вимкнути й увімкнути знову?
- *My sister, who works in a bank, lent me the money, which was very kind of her.* — Моя сестра, яка працює в банку, позичила мені гроші, що було дуже мило з її боку.
- *Despite the rain, the match went ahead, whereas the concert was cancelled.* — Попри дощ, матч відбувся, тоді як концерт скасували.
- *We need to get the ball rolling — the deadline has been brought forward.* — Треба братися до справи — дедлайн перенесли на раніше.
- *I take your point, but on balance I think the benefits outweigh the drawbacks.* — Я розумію твій аргумент, але загалом, гадаю, переваги переважують недоліки.

## Слова

Нових карток тут немає — повтори в розділі «Слова» картки B2. Перевір, чи знаєш хоча б по 5 слів у кожній групі:

| Група | Приклади | Тема |
|---|---|---|
| бізнес | agenda, take the minutes, bring forward, stakeholder, counter-offer, follow up | 15 |
| наука й технології | hypothesis, conduct, replicate, cutting-edge, obsolete, limitation | 16 |
| закон і суспільство | be charged with, reach a verdict, be sentenced to, deterrent, legislation | 17 |
| здоровʼя й психологія | resilience, overwhelmed, sedentary, kick the habit, in moderation | 18 |
| економіка й гроші | inflation, the cost of living, splash out, rip-off, disposable income | 19 |
| культура й рецензії | plot, critically acclaimed, thought-provoking, far-fetched, fall flat | 20 |
| фразові за частками | rule out, carry out, wear off, back down, blow over, narrow down | 21 |
| ідіоми й біноміали | up in the air, cut corners, make ends meet, pros and cons, by and large | 22 |
| колокації | heavy traffic, a slim chance, highly unlikely, rise sharply, pose a threat | 23 |
| словотвір | irreversible, misinterpret, underestimate, drawback, time-consuming | 24 |
| письмо й аргументація | overview, respectively, on balance, detrimental, I take your point, granted | 25, 26 |
| читання й ситуації | infer, stance, plausible, tenancy agreement, standing order, escalate | 27, 28 |

## Слухаємо

### Новини, розмови, лекції

> [!listen] Що відомо про підозрюваного напевно?
> level: B2 · type: answer · id: en-b2-review-l01
> audio: The suspect, who is believed to have left the country last week, is said to be living in Spain. Police are expected to make a statement later today.
> - [ ] поліція точно знає, що він в Іспанії
> - [x] нічого напевно: за повідомленнями, він виїхав і живе в Іспанії, але це не підтверджено
> - [ ] його вже заарештували в Іспанії
>
> **Пояснення:** *is believed to have left*, *is said to be living* — безособовий пасив: так новини передають чутки й неперевірені дані. Факт лише один: заява поліції буде пізніше. (тема 05)

> [!listen] Що робитиме друга людина?
> level: B2 · type: answer · id: en-b2-review-l02
> audio: A: Wanna grab a coffee?
> audio: B: Can't, I gotta finish this report. Lemme text you when I'm done, OK?
> - [ ] піде на каву просто зараз
> - [x] спершу закінчить звіт, а потім напише
> - [ ] не хоче пити каву взагалі
>
> **Пояснення:** *wanna* = want to, *gotta* = have got to, *lemme* = let me. На слух це одне «слово» — вчися впізнавати, але в листі й есе пиши повні форми. (тема 12)

> [!listen] Надрукуй почуте
> level: B2 · type: dictation · id: en-b2-review-l03
> audio: I'd rather you didn't tell anyone.
> accept: I would rather you didn't tell anyone. | I'd rather you did not tell anyone.
>
> **Пояснення:** *I'd rather* + інша особа + Past: *you didn't tell* — хоча мова про тепер чи майбутнє. *I'd* /aɪd/ звучить коротко, *didn't* — часто без кінцевого /t/. (тема 04)

> [!listen] Надрукуй почуте
> level: B2 · type: dictation · id: en-b2-review-l04
> audio: We should have left a bit earlier.
> accept: We should've left a bit earlier.
>
> **Пояснення:** у швидкому мовленні *should have* → /ʃʊdəv/, а *left a bit* → «лефтабіт»: приголосний чіпляється до голосного (catenation), /t/ у *bit* перед голосним може стати легким. (тема 11)

> [!listen] Що вирішили про запуск?
> level: B2 · type: answer · id: en-b2-review-l05
> audio: A: Can we bring the launch forward to May?
> audio: B: I'm afraid that's non-negotiable. The supplier can't deliver before June. Let's touch base again next week.
> - [ ] запуск перенесли на травень
> - [x] запуск лишається в червні — раніше постачальник не може
> - [ ] запуск відклали на невизначений строк
>
> **Пояснення:** *bring forward* — перенести на **раніше**; *non-negotiable* — «не обговорюється»; *touch base* — коротко звʼязатися. Пропозицію відхилено. (тема 15)

> [!listen] Що зробить орендар, якщо до пʼятниці нічого не зміниться?
> level: B2 · type: answer · id: en-b2-review-l06
> audio: I've already called three times about the leak, and nothing's been done. If it isn't fixed by Friday, I'll have no choice but to take this further.
> - [ ] сам полагодить протікання
> - [ ] перестане платити оренду
> - [x] поскаржиться вище — до керівництва чи омбудсмена
>
> **Пояснення:** *take this further* — ескалація скарги на вищий рівень. *Nothing's been done* — пасив Present Perfect: результат (точніше, його відсутність) важливий зараз. (тема 28)

> [!listen] Що лектор вважає головним?
> level: B2 · type: answer · id: en-b2-review-l07
> audio: Incidentally, the first umbrellas were used for shade, not rain. Anyway, the key point is that their basic design hardly changed for three hundred years.
> - [ ] перші парасолі захищали від сонця
> - [x] конструкція парасолі майже не змінювалася триста років
> - [ ] парасолі вигадали триста років тому
>
> **Пояснення:** *Incidentally* — відступ (цікаво, але не головне), *Anyway, the key point is* — повернення до головної думки. В IELTS відповідь часто стоїть одразу після такого покажчика. (тема 13)

## Вимова

### Чекліст вимови

| Що | Перевір себе | Тема |
|---|---|---|
| elision — випадіння /t d/ | *nex(t) day* · *las(t) week* · *han(d)bag* | 11 |
| assimilation — злиття | *ten boys* → /tem bɔɪz/ · *did you* → /dɪdʒu/ · *don't you* → /dəʊntʃu/ | 11 |
| catenation — зчеплення | *an‿ice‿man* · *left‿a‿bit* · *turn‿it‿off* | 11 |
| intrusive / linking r (UK) | *law‿(r)and order* · *idea‿(r)of* · *far‿away* | 11 |
| glottal stop | *football* /ˈfʊʔbɔːl/ · *not now* /nɒʔ naʊ/ | 11 |
| розмовні скорочення | *gonna, wanna, gotta, dunno, lemme* — розпізнавай на слух, не пиши в есе | 12 |
| модальні в минулому | *should have* /ˈʃʊdəv/ · *must have* /ˈmʌstəv/ · *could have* /ˈkʊdəv/ | 07 |
| скорочення в умовних | *If I'd known, I'd've…* — /aɪd/ і /ˈaɪdəv/ | 03 |
| наголос у словотворі | *irRELevant* · *underESTimate* · *STATE-of-the-ART* | 24 |

### Мінімальні пари

> [!pair] You should've gone /ju ˈʃʊdəv ˈɡɒn/ — You should go /ju ʃəd ˈɡəʊ/
> level: B2 · id: en-b2-review-p01
> say: You should've gone
> tip: *should've* — /ˈʃʊdəv/, а *gone* — /ɡɒn/ з коротким /ɒ/. *Should go* — порада на майбутнє, *should've gone* — критика минулого. (тема 07)

> [!pair] I'll have finished /aɪl əv ˈfɪnɪʃt/ — I'll finish /aɪl ˈfɪnɪʃ/
> level: B2 · id: en-b2-review-p02
> say: I'll have finished
> tip: *have* у Future Perfect слабке /əv/, але в кінці чути /t/ — *finished*. Без нього це просто майбутнє. (тема 02)

> [!pair] an ice man /ən‿ˈaɪs mæn/ — a nice man /ə ˈnaɪs mæn/
> level: B2 · id: en-b2-review-p03
> say: an ice man
> tip: через catenation обидва звучать майже однаково — «енайсмен». Розрізняє лише крихітна пауза й те, де починається наголошений склад. (тема 11)

> [!pair] I had it cut /aɪ ˈhæd ɪt ˈkʌt/ — I cut it /aɪ ˈkʌt ɪt/
> level: B2 · id: en-b2-review-p04
> say: I had it cut
> tip: *had it* звучить як «хедіт» — склад є. *I had it cut* — мені підстригли (каузатив), *I cut it* — я сам. (тема 05)

> [!pair] I wish I had /aɪ wɪʃ aɪ ˈhæd/ — I wish I'd had /aɪ wɪʃ aɪd ˈhæd/
> level: B2 · id: en-b2-review-p05
> say: I wish I'd had
> tip: *I'd had* — /aɪd hæd/, перед *had* коротка «зупинка» /d/. *I wish I had* — шкода про тепер, *I wish I'd had* — шкода про минуле. (тема 04)

### Скажи вголос

> [!speak] Пошкодуй про минуле.
> level: B2 · id: en-b2-review-s01
> text: If I'd known about the traffic, I'd have left earlier.
> ipa: /ɪf aɪd ˈnəʊn əˈbaʊt ðə ˈtræfɪk aɪd əv ˈleft ˈɜːliə/
> tip: *I'd have* — /aɪd əv/, майже «айдев»; *traffic* — широке /æ/.
> uk: Якби я знав про затори, я б виїхав раніше.

> [!speak] Скажи, що встигнеш до певного моменту.
> level: B2 · id: en-b2-review-s02
> text: By this time next year, I'll have finished my degree.
> ipa: /baɪ ðɪs ˈtaɪm nekst ˈjɪə aɪl əv ˈfɪnɪʃt maɪ dɪˈɡriː/
> tip: *next year* — /t/ у *next* майже зникає (elision); *degree* — наголос на другому складі.
> uk: До цього часу наступного року я вже закінчу навчання.

> [!speak] Зроби висновок про минуле.
> level: B2 · id: en-b2-review-s03
> text: She must have forgotten about the meeting.
> ipa: /ʃi ˈmʌst əv fəˈɡɒtn əˈbaʊt ðə ˈmiːtɪŋ/
> tip: *must have* — /ˈmʌstəv/, /t/ ледь чутно; *forgotten* — наголос на *GOT*.
> uk: Вона, мабуть, забула про зустріч.

> [!speak] Зваж плюси й мінуси.
> level: B2 · id: en-b2-review-s04
> text: Although the plan has some drawbacks, on balance I'm in favour of it.
> ipa: /ɔːlˈðəʊ ðə ˈplæn həz səm ˈdrɔːbæks ɒn ˈbæləns aɪm ɪn ˈfeɪvər əv ɪt/
> tip: *although* — /ð/ і наголос на другому складі; *favour of it* — звʼязуй: «фейверовіт».
> uk: Хоча план має деякі недоліки, загалом я його підтримую.

> [!speak] Ввічливо не погодься.
> level: B2 · id: en-b2-review-s05
> text: I take your point, but with all due respect, that's not entirely true.
> ipa: /aɪ ˈteɪk jə ˈpɔɪnt bət wɪð ˈɔːl ˈdjuː rɪˈspekt ðæts ˈnɒt ɪnˈtaɪəli ˈtruː/
> tip: *your* і *but* — слабкі /jə bət/; *not entirely* — наголос на *TIRE*, голос м'який, не агресивний.
> uk: Я розумію твою думку, але, при всій повазі, це не зовсім так.

> [!speak] Ескалюй скаргу ввічливо.
> level: B2 · id: en-b2-review-s06
> text: I'd like to take this further, so could you give me a reference number?
> ipa: /aɪd ˈlaɪk tə ˈteɪk ðɪs ˈfɜːðə səʊ kʊdʒu ˈɡɪv mi ə ˈrefrəns ˈnʌmbə/
> tip: *could you* — /kʊdʒu/ (злиття /d/ + /j/); *reference* — два склади: /ˈrefrəns/.
> uk: Я хотів би передати це питання вище, тож чи не могли б ви дати мені номер звернення?

## Типові помилки українців

> [!pitfall] «Якби я знав…» — If I knew замість If I had known
> Українське «якби» однакове для тепер і минулого, англійська — ні. Про **минуле**: *If I ~~knew~~ **had known**, I ~~would tell~~ **would have told** you.* Про тепер: *If I knew his number, I'd call him.* Те саме з *wish*: *I wish I ~~didn't say~~ **hadn't said** that.*

> [!pitfall] Despite of, suggest to, deny to
> *~~Despite of~~ **Despite** the rain* (або *in spite **of***). *He ~~suggested me to go~~ **suggested going** / **suggested that I (should) go**.* *She ~~denied to take~~ **denied taking** it.* Дієслова непрямої мови мають свої моделі — вчи їх разом із дієсловом.

> [!pitfall] Кома перед that і «however» як сполучник
> У non-defining — лише *which / who* з комами: *My car, ~~that~~ **which** is old, …*. *However* не зʼєднує два речення комою: *It was expensive~~, however~~**. However,** it worked.* (або *…expensive; however, it worked*).

## Практика

Тест рівня — питання з усіх 28 тем B2. Номер теми для повторення — у кінці пояснення.

### Частина 1. Часи й майбутнє

> [!quiz] By the time the meeting finally started, we ___ for over an hour.
> level: B2 · id: en-b2-review-q02
> - [ ] were waiting
> - [ ] have been waiting
> - [x] had been waiting
> - [ ] waited
>
> **Пояснення:** тривалість процесу **до** моменту в минулому (*by the time… started*) — Past Perfect Continuous: *had been* + V-ing. (тема 01)

> [!quiz] Які речення правильні? Обери всі.
> level: B2 · type: multi · id: en-b2-review-q03
> - [ ] I've been knowing her for years.
> - [x] She's being very rude today — that's not like her.
> - [x] He's always interrupting me!
> - [ ] This soup is tasting great.
> - [x] We're seeing the bank manager on Monday.
>
> **Пояснення:** *be being rude* — тимчасова поведінка; *always* + continuous — роздратування; *seeing* = зустрічатися (дія). А *know* і *taste* (смакувати як стан) — без -ing: *I've known her*, *it tastes great*. (тема 01)

> [!quiz] Look at the graph: house prices ___ steadily since 2020, and they're still going up.
> level: B2 · id: en-b2-review-q04
> - [ ] rose
> - [ ] are rising
> - [x] have been rising
> - [ ] had risen
>
> **Пояснення:** процес від минулого до тепер, який триває (*still going up*), — Present Perfect Continuous. Для IELTS Task 1 з датами в минулому (*from 2010 to 2020*) — Past Simple. (тема 01)

> [!quiz] Don't call me at eight — I ___ dinner with my parents then.
> level: B2 · id: en-b2-review-q05
> - [ ] 'll have
> - [x] 'll be having
> - [ ] 'll have had
> - [ ] have
>
> **Пояснення:** дія **в процесі** в певний момент майбутнього — Future Continuous: *will be* + V-ing. (тема 02)

> [!quiz] By 2030, the company ___ its carbon emissions by half.
> level: B2 · id: en-b2-review-q06
> - [ ] will cut
> - [ ] will be cutting
> - [x] will have cut
> - [ ] has cut
>
> **Пояснення:** *by* + момент у майбутньому — результат **до** нього: Future Perfect, *will have* + V3. (тема 02)

> [!quiz] Майбутнє: процес чи результат?
> level: B2 · type: fill · id: en-b2-review-q07 · bank: will be working, will lie
>
> ```text fill
> By June I [[will have been working]] here for ten years.
> This time next week I [[will be lying]] on a beach in Greece.
> ```
>
> **Пояснення:** «скільки триватиме до моменту» — Future Perfect Continuous (*will have been working … for ten years*); «у процесі в той момент» — Future Continuous (*will be lying*). (тема 02)

### Частина 2. Умовні речення й wish

> [!quiz] If I ___ the alarm, I wouldn't have missed the flight.
> level: B2 · id: en-b2-review-q08
> - [ ] heard
> - [x] had heard
> - [ ] would hear
> - [ ] have heard
>
> **Пояснення:** третій умовний: *if* + Past Perfect, головна — *would have* + V3. *Would* в if-частині не ставимо. (тема 03)

> [!quiz] If I had studied medicine, I ___ a doctor now.
> level: B2 · id: en-b2-review-q09
> - [ ] would have been
> - [x] would be
> - [ ] will be
> - [ ] had been
>
> **Пояснення:** змішаний умовний: умова в минулому (*had studied*), наслідок — **тепер** (*now*): *would* + V1. (тема 03)

> [!quiz] If she weren't so shy, she ___ to the party last night.
> level: B2 · id: en-b2-review-q10
> - [ ] would go
> - [x] would have gone
> - [ ] had gone
> - [ ] went
>
> **Пояснення:** інший змішаний: постійна риса **тепер** (*weren't so shy*) → наслідок у **минулому** (*last night*): *would have* + V3. (тема 03)

> [!quiz] Склади речення: «Якби не твоя допомога, ми б не встигли».
> level: B2 · type: order · id: en-b2-review-q11
>
> ```text order
> If it hadn't been for
> your help,
> we wouldn't have
> made it.
> wouldn't made it ✗
> ```
>
> **Пояснення:** *If it hadn't been for* + іменник — «якби не» про минуле; *make it* — встигнути, впоратися. Після *have* — V3: *have made*. (тема 03)

> [!quiz] I wish I ___ to the party — everyone says it was amazing.
> level: B2 · id: en-b2-review-q12
> - [ ] went
> - [ ] would go
> - [x] had gone
> - [ ] have gone
>
> **Пояснення:** жаль про **минуле** — *wish* + Past Perfect. *I wish I went* — неправильно: Past після *wish* — про теперішнє. (тема 04)

> [!quiz] I wish you ___ leaving your socks on the floor! It drives me mad.
> level: B2 · id: en-b2-review-q13
> - [ ] stopped
> - [x] would stop
> - [ ] had stopped
> - [ ] will stop
>
> **Пояснення:** роздратування через чужу поведінку, яку хочеш змінити, — *wish* + *would*. Про себе так не кажуть: не *I wish I would…* (тема 04)

> [!quiz] It's nearly midnight. It's high time we ___ home.
> level: B2 · id: en-b2-review-q14
> - [ ] go
> - [x] went
> - [ ] will go
> - [ ] had gone
>
> **Пояснення:** *It's (high) time* + підмет + Past — «давно пора» (значення — теперішнє). Можна й *It's time **to go***. (тема 04)

> [!quiz] I'd rather you ___ my phone without asking.
> level: B2 · id: en-b2-review-q15
> - [ ] don't use
> - [x] didn't use
> - [ ] not to use
> - [ ] wouldn't use
>
> **Пояснення:** *I'd rather* + **інша особа** + Past: *I'd rather you didn't*. Про себе — інфінітив без *to*: *I'd rather stay at home.* (тема 04)

### Частина 3. Пасив, непряма мова, модальні в минулому

> [!quiz] I'm not going to cut my hair myself — I'm going to ___ at the hairdresser's tomorrow.
> level: B2 · id: en-b2-review-q16
> - [ ] cut it
> - [ ] have cut it
> - [x] have it cut
> - [ ] have it cutting
>
> **Пояснення:** каузатив — хтось робить для тебе: *have* + обʼєкт + V3 (*have it cut*, *get my car repaired*). (тема 05)

> [!quiz] Experts think the painting was stolen in the 1990s. → The painting ___ stolen in the 1990s.
> level: B2 · id: en-b2-review-q17
> - [ ] is thought to be
> - [x] is thought to have been
> - [ ] thinks to have been
> - [ ] is thinking to have been
>
> **Пояснення:** безособовий пасив про **минуле**: *is thought / said / believed* + *to have been* + V3. *To be stolen* — про тепер чи загалом. (тема 05)

> [!quiz] Пасив у різних часах
> level: B2 · type: fill · id: en-b2-review-q18 · bank: is building, will be completing
>
> ```text fill
> The new bridge [[is being built]] at the moment.
> By the end of next year, it [[will have been completed]].
> ```
>
> **Пояснення:** пасив будь-якого часу = *be* у цьому часі + V3: *is being built* (Present Continuous), *will have been completed* (Future Perfect). (тема 05)

> [!quiz] People say that the minister is going to resign. Як це сказати безособово?
> level: B2 · id: en-b2-review-q19
> - [x] It is said that the minister is going to resign.
> - [ ] It says that the minister is resigned.
> - [ ] The minister is said that he will resign.
> - [ ] The minister says to resign.
>
> **Пояснення:** дві моделі: *It is said that…* або *The minister is said **to be going** to resign*. Змішувати їх (*is said that he…*) не можна. (тема 05)

> [!quiz] "Why don't we take a taxi?" → He suggested ___ a taxi.
> level: B2 · id: en-b2-review-q20
> - [ ] to take
> - [x] taking
> - [ ] us to take
> - [ ] to taking
>
> **Пояснення:** *suggest* + **-ing** або *suggest that* + підмет + (*should*) V1: *He suggested that we (should) take a taxi*. *Suggest somebody to do* — помилка. (тема 06)

> [!quiz] Які речення правильні? Обери всі.
> level: B2 · type: multi · id: en-b2-review-q21
> - [x] They accused him of lying.
> - [x] She insisted on paying for dinner.
> - [x] He warned me not to touch the wire.
> - [ ] She advised me going to a doctor.
> - [ ] He apologised to be late.
>
> **Пояснення:** *accuse of* + -ing, *insist on* + -ing, *warn* + обʼєкт + (*not*) *to*. Правильно: *advised me **to go***, *apologised **for being** late*. (тема 06)

> [!quiz] Перекажи точним дієсловом
> level: B2 · type: fill · id: en-b2-review-q22 · bank: seeing, to break
>
> ```text fill
> "You should see a lawyer," she told me. → She advised me [[to see]] a lawyer.
> "I didn't break the window!" he said. → He denied [[breaking|having broken]] the window.
> ```
>
> **Пояснення:** *advise* + обʼєкт + *to* V1; *deny* + -ing (або *having* + V3, коли підкреслюєш минуле). (тема 06)

> [!quiz] The streets are wet. It ___ during the night.
> level: B2 · id: en-b2-review-q23
> - [ ] should have rained
> - [x] must have rained
> - [ ] can't have rained
> - [ ] needn't have rained
>
> **Пояснення:** логічний висновок про минуле з доказом (мокрі вулиці) — *must have* + V3. (тема 07)

> [!quiz] She ___ the email — she replied to it an hour ago.
> level: B2 · id: en-b2-review-q24
> - [ ] must have missed
> - [x] can't have missed
> - [ ] should have missed
> - [ ] needn't have missed
>
> **Пояснення:** «точно ні» про минуле — *can't / couldn't have* + V3. *Mustn't have* у цьому значенні не вживають. (тема 07)

> [!quiz] Ти наготував їжі на десятьох, а прийшли четверо. Що скажеш?
> level: B2 · id: en-b2-review-q25
> - [x] I needn't have cooked so much food.
> - [ ] I mustn't have cooked so much food.
> - [ ] I couldn't have cooked so much food.
> - [ ] I hadn't to cook so much food.
>
> **Пояснення:** *needn't have* + V3 — дію **зробили**, але вона виявилась зайвою. *I didn't need to cook* зазвичай означає, що й не готував, бо не було потреби. (тема 07)

> [!quiz] You ___ me you were ill! I would have helped.
> level: B2 · id: en-b2-review-q26
> - [x] should have told
> - [ ] must have told
> - [ ] would tell
> - [ ] needn't have told
>
> **Пояснення:** критика чи жаль про минуле — *should have* + V3 («треба було сказати»). *Must have told* — висновок «напевно сказав». (тема 07)

### Частина 4. Герундій та інфінітив, підрядні, звʼязки

> [!quiz] I clearly remember ___ the door, but now it's open!
> level: B2 · id: en-b2-review-q27
> - [ ] to lock
> - [x] locking
> - [ ] lock
> - [ ] to have locked
>
> **Пояснення:** *remember* + **-ing** — спогад про те, що вже зробив. *Remember **to lock*** — не забути зробити в майбутньому. (тема 08)

> [!quiz] Значення змінюється: -ing чи to?
> level: B2 · type: fill · id: en-b2-review-q28 · bank: to see, buying, to restart
>
> ```text fill
> I'll never forget [[seeing]] the ocean for the first time.
> On the way home we stopped [[to buy]] some bread.
> Have you tried [[restarting]] your laptop?
> ```
>
> **Пояснення:** *forget doing* — про спогад; *stop to do* — зупинитися, **щоб** щось зробити (*stop doing* — припинити); *try doing* — спробувати як експеримент. (тема 08)

> [!quiz] It's no use ___ about it — the decision has already been made.
> level: B2 · id: en-b2-review-q29
> - [ ] to complain
> - [x] complaining
> - [ ] complain
> - [ ] for complaining
>
> **Пояснення:** *It's no use / There's no point (in)* + **-ing**. Так само *can't help laughing*, *be worth seeing*. (тема 08)

> [!quiz] I'm really looking forward ___ you next week.
> level: B2 · id: en-b2-review-q30
> - [ ] to see
> - [ ] seeing
> - [x] to seeing
> - [ ] for seeing
>
> **Пояснення:** у *look forward to* слово *to* — прийменник, а після прийменника — **-ing**. Так само *be used to*, *object to*, *be accustomed to*. (тема 08)

> [!quiz] У мене один брат. Яке речення правильне?
> level: B2 · id: en-b2-review-q31
> - [ ] My brother who lives in Lviv, is a doctor.
> - [ ] My brother, that lives in Lviv, is a doctor.
> - [x] My brother, who lives in Lviv, is a doctor.
> - [ ] My brother, who lives in Lviv is a doctor.
>
> **Пояснення:** брат один — інформація додаткова (non-defining): дві коми, *who / which*, не *that*. (тема 09)

> [!quiz] He passed all his exams, ___ surprised everyone.
> level: B2 · id: en-b2-review-q32
> - [ ] what
> - [ ] that
> - [x] which
> - [ ] who
>
> **Пояснення:** *which* після коми може стосуватися **всього речення**: те, що він склав іспити, всіх здивувало. *What* і *that* так не вживаються. (тема 09)

> [!quiz] The woman ___ next to me on the plane turned out to be a famous chef.
> level: B2 · id: en-b2-review-q33
> - [x] sitting
> - [ ] sits
> - [ ] who sitting
> - [ ] was sitting
>
> **Пояснення:** скорочене підрядне (participle clause): *the woman sitting* = *the woman who was sitting*. Активне значення — V-ing, пасивне — V3: *a house built in 1900*. (тема 09)

> [!quiz] I have two sisters, both of ___ are teachers.
> level: B2 · id: en-b2-review-q34
> - [ ] who
> - [x] whom
> - [ ] them
> - [ ] which
>
> **Пояснення:** після *some of, both of, most of, none of* про людей — *whom*, про речі — *which*: *two cars, neither of which works*. *Both of them* потребує нового речення. (тема 09)

> [!quiz] ___ the heavy rain, the match went ahead.
> level: B2 · id: en-b2-review-q35
> - [ ] Although
> - [x] Despite
> - [ ] However
> - [ ] Even though
>
> **Пояснення:** після *despite / in spite of* — іменник або -ing; після *although / even though* — ціле речення: *Although it was raining heavily, …* (тема 10)

> [!quiz] Some people love city life, ___ others prefer the peace and quiet of the countryside.
> level: B2 · id: en-b2-review-q36
> - [x] whereas
> - [ ] despite
> - [ ] however
> - [ ] in spite of
>
> **Пояснення:** *whereas* (або *while*) протиставляє дві частини одного речення. *However* починає нове речення: *… city life. However, others…* (тема 10)

> [!quiz] Які речення правильні? Обери всі.
> level: B2 · type: multi · id: en-b2-review-q37
> - [x] The plan was expensive. However, it worked.
> - [x] Although it was late, we kept working.
> - [ ] Despite of the cost, they bought the house.
> - [x] In spite of being tired, she finished the report.
> - [ ] The plan was expensive, however it worked.
>
> **Пояснення:** *However* — після крапки (або крапки з комою) і з комою після нього; *despite* без *of*; *in spite of* + -ing — правильно. (тема 10)

> [!quiz] Склади речення: «Він вийшов рано, щоб не застрягнути в заторі».
> level: B2 · type: order · id: en-b2-review-q38
>
> ```text order
> He left early
> so as
> not to
> get stuck in traffic.
> for ✗
> ```
>
> **Пояснення:** заперечна мета — *so as not to* / *in order not to* + V1 (не *for not to*). Ще варіант: *so that he wouldn't get stuck*. (тема 10)

### Частина 5. Як звучить жива англійська

> [!quiz] Де звучить **intrusive r** — /r/, якого немає в написанні?
> level: B2 · id: en-b2-review-q39
> - [x] law and order
> - [ ] far away
> - [ ] go out
> - [ ] I agree
>
> **Пояснення:** *law‿(r)and order* — /r/ вставляємо між голосними, хоч літери r немає. *Far away* — linking r (r є в написанні), *go‿(w)out* — /w/, *I‿(j)agree* — /j/. (тема 11)

> [!quiz] У швидкому мовленні «ten boys» звучить як /tem bɔɪz/. Що це за явище?
> level: B2 · id: en-b2-review-q40
> - [ ] elision — звук випав
> - [x] assimilation — звук уподібнився сусідньому
> - [ ] intrusive r
> - [ ] catenation — приголосний перейшов до наступного слова
>
> **Пояснення:** /n/ перед /b/ стає /m/ — губи вже готуються до /b/. Це асиміляція. Elision — коли звук зникає: *nex(t) day*. (тема 11)

> [!quiz] Де можна написати «gonna»?
> level: B2 · id: en-b2-review-q41
> - [ ] у мотиваційному листі роботодавцю
> - [ ] в есе на IELTS
> - [x] у повідомленні другові або в репліці персонажа
> - [ ] в офіційній скарзі
>
> **Пояснення:** *gonna, wanna, gotta* — розмовний регістр: переписка з друзями, діалоги в художньому тексті. В іспиті, листі чи звіті — *going to, want to, have got to*. (тема 12)

> [!quiz] «Dunno, lemme check.» Що сказали повністю?
> level: B2 · id: en-b2-review-q42
> - [x] I don't know, let me check.
> - [ ] Don't know, let me chat.
> - [ ] I don't know, leave me, check.
> - [ ] Done now, let's check.
>
> **Пояснення:** *dunno* = (I) don't know, *lemme* = let me. Звуки «склеюються», але граматика лишається повною. (тема 12)

> [!quiz] Лектор каже: «Incidentally, …». Що буде далі?
> level: B2 · id: en-b2-review-q43
> - [ ] головна думка лекції
> - [x] відступ — цікава, але не головна інформація
> - [ ] висновок
> - [ ] приклад до попереднього пункту
>
> **Пояснення:** *Incidentally / As an aside* — відступ; повернення — *Anyway, back to…*. Головне звучить після *The key point is…*, приклад — після *A case in point is…*. (тема 13)

> [!quiz] Лектор: «The population roughly doubled between 1950 and 2000.» Яка нотатка найкраща?
> level: B2 · id: en-b2-review-q44
> - [ ] The population roughly doubled between 1950 and 2000.
> - [x] pop. ≈ ×2, 1950–2000
> - [ ] population
> - [ ] 1950, 2000
>
> **Пояснення:** нотатки — іменниками й символами: *pop.*, *≈* (approximately), *×2*. Повне речення писати задовго, а одне слово не зберігає змісту. (тема 13)

> [!quiz] У фільмі після вечері друг каже: «Put your wallet away — it's on me.» Що він має на увазі?
> level: B2 · id: en-b2-review-q45
> - [ ] гаманець лежить на ньому
> - [x] він платить за всіх
> - [ ] треба розділити рахунок
> - [ ] він забув гаманець
>
> **Пояснення:** *It's on me* — «я пригощаю». Розмовні фрази фільмів часто не перекладаються дослівно: *my bad* — моя провина, *you bet* — ще б пак. (тема 14)

> [!quiz] Колега рівним голосом: «Oh, great. Another meeting.» Як це розуміти?
> level: B2 · id: en-b2-review-q46
> - [ ] щиро радіє новій зустрічі
> - [x] сарказм — насправді він не в захваті
> - [ ] питає, чи буде зустріч
> - [ ] пропонує провести зустріч
>
> **Пояснення:** *deadpan* — жарт чи сарказм «з камʼяним обличчям»: позитивні слова, рівна інтонація, негативний зміст. Слухай не лише слова, а й тон. (тема 14)

### Частина 6. Лексика B2

> [!quiz] Let's add this point to the ___ for Monday's meeting.
> level: B2 · id: en-b2-review-q47
> - [x] agenda
> - [ ] minutes
> - [ ] deadline
> - [ ] stakeholder
>
> **Пояснення:** *agenda* — порядок денний (що обговорюватимуть); *minutes* — протокол (що вже обговорили); *stakeholder* — зацікавлена сторона. (тема 15)

> [!quiz] Wednesday is too late. Could we ___ the meeting to Monday?
> level: B2 · id: en-b2-review-q48
> - [x] bring forward
> - [ ] put off
> - [ ] adjourn
> - [ ] overrun
>
> **Пояснення:** *bring forward* — перенести на **раніше**; *put off* — відкласти на пізніше; *adjourn* — оголосити перерву; *overrun* — затягнутися довше запланованого. (тема 15)

> [!quiz] Other labs couldn't ___ the results, so the study was heavily criticised.
> level: B2 · id: en-b2-review-q49
> - [x] replicate
> - [ ] harness
> - [ ] colonise
> - [ ] safeguard
>
> **Пояснення:** *replicate* — відтворити (експеримент, результат). Якщо результат не повторюється, висновок вважають ненадійним. (тема 16)

> [!quiz] Суд і покарання
> level: B2 · type: fill · id: en-b2-review-q50 · bank: accused, arrested
>
> ```text fill
> The businessman was [[charged]] with fraud.
> After a three-week trial, the jury [[reached]] a verdict.
> He was [[sentenced]] to five years in prison.
> ```
>
> **Пояснення:** *be charged **with*** — бути обвинуваченим (офіційно); *accused* — з *of*; *reach a verdict* — винести вердикт; *be sentenced to* — бути засудженим до. (тема 17)

> [!quiz] Regular exercise helps to build ___ — the ability to recover quickly from difficulties.
> level: B2 · id: en-b2-review-q51
> - [x] resilience
> - [ ] stigma
> - [ ] insomnia
> - [ ] posture
>
> **Пояснення:** *resilience* — стійкість, здатність відновлюватися. *Stigma* — тавро, упередження; *insomnia* — безсоння; *posture* — постава. (тема 18)

> [!quiz] Prices are rising much faster than wages, so ___ has become a serious problem.
> level: B2 · id: en-b2-review-q52
> - [x] the cost of living
> - [ ] disposable income
> - [ ] a status symbol
> - [ ] impulse buying
>
> **Пояснення:** *the cost of living* — вартість життя (їжа, житло, рахунки). *Disposable income* — гроші, що лишаються після обовʼязкових витрат. (тема 19)

> [!quiz] I ___ on a new phone last weekend — to be honest, it was a bit of a rip-off.
> level: B2 · id: en-b2-review-q53
> - [x] splashed out
> - [ ] haggled
> - [ ] went broke
> - [ ] cut back
>
> **Пояснення:** *splash out (on)* — розщедритися, витратити багато; *rip-off* — «обдираловка». *Haggle* — торгуватися, *cut back* — скоротити витрати. (тема 19)

> [!quiz] The plot was so ___ that I guessed the ending in the first ten minutes.
> level: B2 · id: en-b2-review-q54
> - [x] predictable
> - [ ] thought-provoking
> - [ ] riveting
> - [ ] critically acclaimed
>
> **Пояснення:** *predictable* — передбачуваний (мінус для сюжету). Інші — похвала: *thought-provoking* — змушує думати, *riveting* — захопливий, *critically acclaimed* — схвалений критиками. (тема 20)

### Частина 7. Фразові дієслова, ідіоми, колокації, словотвір

> [!quiz] The police have ___ murder — they're sure it was an accident.
> level: B2 · id: en-b2-review-q55
> - [x] ruled out
> - [ ] carried out
> - [ ] phased out
> - [ ] dropped out
>
> **Пояснення:** *out* тут — «прибрати, виключити»: *rule out* — виключити можливість. *Carry out* — провести (дослідження), *phase out* — поступово скасувати, *drop out* — кинути навчання. (тема 21)

> [!quiz] Don't worry about the argument — it'll soon ___.
> level: B2 · id: en-b2-review-q56
> - [x] blow over
> - [ ] win over
> - [ ] knock over
> - [ ] hand over
>
> **Пояснення:** *blow over* — минути, вщухнути (про бурю, скандал, сварку). *Win over* — переконати, *knock over* — перекинути, *hand over* — передати. (тема 21)

> [!quiz] We still don't know if the project will get funding — everything's ___.
> level: B2 · id: en-b2-review-q57
> - [x] up in the air
> - [ ] in the red
> - [ ] on edge
> - [ ] around the clock
>
> **Пояснення:** *up in the air* — не вирішено. *In the red* — у мінусі, *on edge* — знервований, *around the clock* — цілодобово. (тема 22)

> [!quiz] Який вираз звучить природно?
> level: B2 · id: en-b2-review-q58
> - [x] sooner or later
> - [ ] later or sooner
> - [ ] quiet and peace
> - [ ] sound and safe
>
> **Пояснення:** біноміали мають **сталий порядок**: *sooner or later, peace and quiet, safe and sound, pros and cons*. Переставлені — звучать як помилка. (тема 22)

> [!quiz] I'm ___ aware of the risks, but I still want to try.
> level: B2 · id: en-b2-review-q59
> - [x] fully
> - [ ] strongly
> - [ ] heavily
> - [ ] bitterly
>
> **Пояснення:** колокація *fully aware*. Так само *strongly opposed*, *heavily dependent on*, *bitterly disappointed* — прислівник «підбирається» до прикметника. (тема 23)

> [!quiz] Колокації: обери слово
> level: B2 · type: fill · id: en-b2-review-q60 · bank: strong, big, make
>
> ```text fill
> There's [[heavy]] traffic on the bridge this morning.
> I only have a [[rough]] idea of the total cost.
> Air pollution can [[pose]] a serious threat to health.
> ```
>
> **Пояснення:** *heavy traffic* (не *strong*), *a rough idea* — приблизне уявлення, *pose a threat* — становити загрозу. Колокації вчи парами, а не окремими словами. (тема 23)

> [!quiz] Once the forest is destroyed, the damage is ___ — it can't be undone.
> level: B2 · id: en-b2-review-q61
> - [x] irreversible
> - [ ] unreversible
> - [ ] inreversible
> - [ ] disreversible
>
> **Пояснення:** перед *r* заперечний префікс *in-* стає *ir-*: *irreversible, irrelevant, irresponsible*; перед *l* — *il-* (*illegal*), перед *m, p* — *im-* (*impractical*). (тема 24)

> [!quiz] Словотвір: утвори слово з дужок
> level: B2 · type: fill · id: en-b2-review-q62 · bank: unconsistent, misestimated
>
> ```text fill
> The two sets of results are [[inconsistent]] with each other. (CONSISTENT)
> We badly [[underestimated]] how long the project would take. (ESTIMATE)
> Her [[upbringing]] in a small village shaped her values. (BRING UP)
> ```
>
> **Пояснення:** *in-* + *consistent*; *under-* — «замало» (*underestimate, underpaid*); фразове *bring up* → іменник *upbringing* — виховання. (тема 24)

### Частина 8. Навички

> [!quiz] IELTS Writing Task 1: що обовʼязково має бути в overview?
> level: B2 · id: en-b2-review-q63
> - [ ] усі цифри з графіка по порядку
> - [x] головні тенденції й порівняння без дрібних деталей
> - [ ] твоя думка про причини змін
> - [ ] переписане завдання слово в слово
>
> **Пояснення:** overview (*Overall, …*) — 1–2 речення про головне: що росло, що падало, що найбільше. Без нього Task Achievement рідко буває вище 5. Причин і думок у Task 1 не пишуть. (тема 25)

> [!quiz] Есе for and against (формат Cambridge B2): де висловити власну позицію?
> level: B2 · id: en-b2-review-q64
> - [ ] у кожному абзаці
> - [ ] лише у вступі
> - [x] у висновку, після того як зважив аргументи обох сторін
> - [ ] ніде — есе має бути нейтральним до кінця
>
> **Пояснення:** структура: вступ (тема без позиції) → аргументи «за» → аргументи «проти» → висновок з позицією (*On balance, I believe…*). В IELTS *To what extent do you agree?* позицію дають уже у вступі. (тема 25)

> [!quiz] Яка фраза — ввічливий спосіб вклинитися в дискусію?
> level: B2 · id: en-b2-review-q65
> - [ ] Stop talking, it's my turn.
> - [x] Sorry to interrupt, but can I just come in here?
> - [ ] You're wrong, listen to me.
> - [ ] Whatever.
>
> **Пояснення:** *Sorry to interrupt / Can I just come in here?* — ввічливо перебити. А щоб утримати слово: *Bear with me* або *If I could just finish…* (тема 26)

> [!quiz] IELTS Speaking Part 3: «Will people read fewer books in the future?» Яка відповідь найсильніша?
> level: B2 · id: en-b2-review-q66
> - [ ] Yes.
> - [ ] I don't know, maybe yes, maybe no.
> - [x] That's a tricky one. I'd imagine people will read just as much, but more on screens, because… For example, my younger brother…
> - [ ] Books are very important in our life and everybody should read books.
>
> **Пояснення:** Part 3 — думка → причина → приклад, з обережними фразами (*I'd imagine, there's a good chance*). Коротке «Yes» і загальники не показують ні Fluency, ні Lexical Resource. (тема 26)

> [!quiz] «The so-called "miracle diet" has, unsurprisingly, failed to deliver.» Яке ставлення автора?
> level: B2 · id: en-b2-review-q67
> - [ ] захоплення
> - [ ] нейтральне
> - [x] скептичне, іронічне
> - [ ] сумнів у собі
>
> **Пояснення:** *so-called* і лапки — дистанція й іронія; *unsurprisingly* — «я так і знав». Тон автора видно з оцінних слів, а не лише з фактів. (тема 27)

> [!quiz] В IELTS Reading питання бувають True / False / Not Given або Yes / No / Not Given. Коли — Yes / No / Not Given?
> level: B2 · id: en-b2-review-q68
> - [ ] коли текст про науку
> - [x] коли твердження стосуються думок і позиції автора
> - [ ] коли в тексті немає цифр
> - [ ] це одне й те саме, назви довільні
>
> **Пояснення:** TFNG перевіряє **факти** в тексті, YNNG — **погляди автора** (*the writer believes / suggests*). В обох Not Given — інформації немає, а не «неправда». (тема 27)

> [!quiz] Ти щомісяця 1-го числа платиш за оренду однакову суму, і перекази робить банк автоматично. Як це називається?
> level: B2 · id: en-b2-review-q69
> - [x] a standing order
> - [ ] a direct debit
> - [ ] a bank statement
> - [ ] a cash withdrawal
>
> **Пояснення:** *standing order* — ти сам налаштовуєш фіксований регулярний платіж. *Direct debit* — компанія сама списує суму (може змінюватися), *bank statement* — виписка. (тема 28)

> [!quiz] Ти скаржишся в службу підтримки втретє. Що найкраще сказати, щоб ескалювати скаргу ввічливо, але твердо?
> level: B2 · id: en-b2-review-q70
> - [ ] This is ridiculous, I hate your company!
> - [ ] OK, no problem, I'll wait.
> - [x] I appreciate your help, but this is the third time I've called. I'd like to speak to a manager.
> - [ ] Give me my money now.
>
> **Пояснення:** формула ескалації: визнай людину (*I appreciate…*) → факти (*the third time*) → чітка вимога (*speak to a manager, put it in writing, take this further*). (тема 28)

## Міні-IELTS

> [!important] IELTS і рівень B2
> - За офіційним узгодженням Cambridge / British Council рівень **B2 ≈ IELTS 5.5–6.5** (орієнтовно). Саме цей діапазон часто просять університети й роботодавці; C1 — уже 7.0–8.0.
> - Бал — середнє чотирьох модулів: Listening, Reading, Writing, Speaking. Письмо й говоріння тут не оцінюються автоматично — перевір себе за чеклістами з критеріями банда.
> - Завдання нижче — власні, у форматі іспиту. Справжні пробні тести — у джерелах наприкінці.

> [!diagram] Міні-IELTS: чотири модулі
> ```yaml
> layout: flow
> nodes:
>   - { id: lis, label: "Listening · 30 хв", text: "Parts 3–4", note: "навчальна дискусія · лекція", tone: blue, icon: "px:mic" }
>   - { id: rea, label: "Reading · 60 хв", text: "Academic", note: "TFNG · YNNG · headings · endings", tone: green, icon: "px:books" }
>   - { id: wri, label: "Writing · 60 хв", text: "Task 1 + Task 2", note: "150+ і 250+ слів", tone: orange, icon: "px:scroll" }
>   - { id: spe, label: "Speaking · 11–14 хв", text: "Parts 2–3", note: "cue card · дискусія", tone: violet, icon: "px:chat" }
> steps:
>   - { focus: lis, note: "Listening: на B2 найважливіші Parts 3 і 4 — саме вони відділяють 5.5 від 6.5. Слухаєш один раз." }
>   - { focus: rea, note: "Reading: три довгі тексти, 40 питань за 60 хвилин. Тут — один текст і чотири типи завдань." }
>   - { focus: wri, note: "Writing: Task 1 — опис даних з overview, Task 2 — есе. Task 2 важить удвічі більше, тож починай з нього або дай йому 40 хвилин." }
>   - { focus: spe, note: "Speaking: Part 2 — 1 хвилина на нотатки й 2 хвилини монологу, Part 3 — абстрактна дискусія на ту саму тему." }
> ```

### Listening Part 3 — навчальна дискусія

Двоє студентів, Maya і Tom, обговорюють з викладачкою проєкт про харчові відходи в студентській їдальні. Слухай **один раз**.

> [!listen] Як студенти зібрали дані?
> level: B2 · type: answer · id: en-b2-review-l08
> audio: A: So, Maya, how did you collect your data in the end?
> audio: B: At first we planned to interview the kitchen staff, but in the end we weighed the food left on plates every lunchtime for two weeks.
> - [ ] опитали працівників кухні
> - [x] два тижні зважували залишки їжі на тарілках
> - [ ] роздали анкети студентам
>
> **Пояснення:** *At first we planned… but in the end…* — план змінився. Перше, що звучить, у Part 3 часто дистрактор: відповідь — після *in the end*. (тема 13)

> [!listen] Що думає Maya про головну причину відходів?
> level: B2 · type: answer · id: en-b2-review-l09
> audio: A: I think the main problem is portion size.
> audio: B: I'm not so sure, Tom. Portions matter, but most of the waste was salad, which people take because it's free and then don't eat.
> - [ ] погоджується, що головне — великі порції
> - [x] частково не погоджується: найбільше викидають безкоштовний салат
> - [ ] вважає, що студенти не люблять салат через смак
>
> **Пояснення:** *I'm not so sure* — ввічлива незгода, *Portions matter, but…* — поступка, після *but* — власна думка. *Which people take…* — non-defining про салат. (тема 26)

> [!listen] Що радить викладачка?
> level: B2 · type: answer · id: en-b2-review-l10
> audio: Your results are interesting, but the sample is rather small. Two weeks in one canteen won't convince anyone. I'd suggest repeating it next term in the other two canteens as well.
> - [ ] переписати висновки
> - [x] наступного семестру повторити дослідження ще у двох їдальнях
> - [ ] скоротити дослідження до одного тижня
>
> **Пояснення:** *the sample is rather small* — головна слабкість (*limitation*), *I'd suggest repeating* — порада (*suggest* + -ing). (тема 06)

> [!listen] З чого студенти почнуть звіт?
> level: B2 · type: answer · id: en-b2-review-l11
> audio: A: So shall we write up the survey section first?
> audio: B: Actually, let's do the charts first. The survey section depends on them anyway.
> audio: A: Fair enough.
> - [ ] з опису опитування
> - [x] з діаграм
> - [ ] з висновків
>
> **Пояснення:** *Actually* — сигнал, що зараз буде виправлення чи інша думка; *Fair enough* — згода. Перша пропозиція (*survey section*) — дистрактор. (тема 13)

### Listening Part 4 — лекція

Лекція з історії вуличного освітлення. Слухай покажчики: план, поворот, відступ, підсумок.

> [!listen] Чим лектор завершить лекцію?
> level: B2 · type: answer · id: en-b2-review-l12
> audio: Today I'd like to look at the history of street lighting. I'll begin with oil lamps, then move on to gas, and finally I'll talk about the arrival of electric light.
> - [ ] олійними лампами
> - [ ] газовими ліхтарями
> - [x] появою електричного освітлення
>
> **Пояснення:** план лекції: *I'll begin with… then move on to… and finally…* — запиши пункти стовпчиком і лиши під кожним місце. (тема 13)

> [!listen] Чому міста запроваджували газове освітлення?
> level: B2 · type: answer · id: en-b2-review-l13
> audio: Gas lighting spread quickly in the early nineteenth century. However, the main reason cities adopted it wasn't beauty. It was crime: officials believed that well-lit streets were safer.
> - [ ] щоб прикрасити місто
> - [x] щоб зменшити злочинність — освітлені вулиці вважали безпечнішими
> - [ ] бо газ був дешевшим за олію
>
> **Пояснення:** *However, the main reason… wasn't beauty* — дистрактор названо й заперечено; відповідь — після повороту: *It was crime*. (тема 13)

> [!listen] Яка перевага електричних ламп?
> level: B2 · type: answer · id: en-b2-review-l14
> audio: Incidentally, the job of lamplighter survived in some towns for decades. Anyway, back to the main point: electric lamps were far cheaper to run, although they were expensive to install.
> - [ ] їх було дешево встановити
> - [x] вони були значно дешевші в експлуатації
> - [ ] вони не потребували ліхтарників
>
> **Пояснення:** *cheaper to run* ≠ *cheap to install* — лектор каже, що встановлення було **дорогим** (*although*). Відступ про ліхтарників після *Incidentally* — не відповідь. (тема 10)

> [!listen] Який головний висновок лекції?
> level: B2 · type: answer · id: en-b2-review-l15
> audio: To sum up, each new technology was adopted less for comfort than for reasons of safety and cost. And that's a pattern we'll see again next week, when we look at traffic lights.
> - [x] нові технології запроваджували передусім через безпеку й вартість
> - [ ] комфорт завжди був головною причиною змін
> - [ ] світлофори винайшли разом з електричними лампами
>
> **Пояснення:** *To sum up* — підсумок; *less for comfort than for safety and cost* — порівняння «менше …, ніж …». Наступна тема — лише анонс. (тема 13)

### Academic Reading — один текст, чотири типи завдань

Прочитай текст. Спершу skimming (2 хвилини): про що кожен абзац? Потім питання. На іспиті на один текст — близько 20 хвилин.

> [!example] Sleeping across borders: the return of the night train
> **A.** For most of the twentieth century, overnight trains were an ordinary way to cross Europe. By the early 2000s, however, they were disappearing one route at a time. Low-cost airlines could carry passengers from one capital to another in two hours, and new high-speed lines made many daytime journeys shorter. Rail companies, under pressure to cut costs, began to see sleeper services as a luxury they could not afford: a sleeping car holds far fewer people than an ordinary carriage, it makes only one journey every twenty-four hours, and it needs staff on board throughout the night.
>
> **B.** Then, in the mid-2010s, something unexpected happened. Instead of quietly closing their last routes, several operators began to buy carriages that others had retired, and a handful of small private companies launched new services. Routes that had been abandoned only a few years earlier were brought back, and some of them sold out weeks in advance during the summer.
>
> **C.** Supporters point to two main advantages. The first is environmental: according to one estimate, a passenger travelling by night train is responsible for only a fraction of the carbon emissions produced by the same journey by air. The second is practical. A night train leaves from the city centre in the evening and arrives in another city centre the next morning, so travellers save both the trip to the airport and the cost of a hotel room.
>
> **D.** Yet the revival faces serious obstacles. Operators must pay a charge for every kilometre they use on other countries' railways, and these charges vary widely from one border to the next. Many carriages are more than thirty years old, and new ones take years to build. Booking a journey that crosses three countries can still be surprisingly complicated, and because engineering work is usually carried out at night, timetables are often changed at short notice. As a result, a ticket for a sleeper cabin frequently costs more than a flight on the same route.
>
> **E.** In my view, comparing these two prices is misleading. A flight ticket does not include the hotel, the airport transfer or the environmental damage, and it is hardly surprising that a train which pays for its tracks looks expensive next to a plane which pays almost nothing for the sky. If governments are serious about reducing emissions, they should treat night trains as public infrastructure, like roads, rather than expecting them to make a profit on their own. I am far less certain, though, that this will happen. Nostalgia is a pleasant feeling, but it is not a business model, and without public money the current enthusiasm may well fade.
>
> **F.** What happens next depends on decisions that are being made now. New carriages have been ordered, and several governments have promised to simplify cross-border booking. Whether passengers will keep choosing a narrow bed over a two-hour flight is a question that only the next decade will answer.

> [!quiz] IELTS True / False / Not Given: «Sleeping cars were considered expensive partly because each one is used for only one journey a day.»
> level: B2 · id: en-b2-review-q71
> - [x] True
> - [ ] False
> - [ ] Not Given
>
> **Пояснення:** абзац A: *it makes only one journey every twenty-four hours* — парафраз *one journey a day*. Парафраз, а не ті самі слова, — типова ознака True. (тема 27)

> [!quiz] IELTS True / False / Not Given: «The number of night train passengers in Europe has doubled since the mid-2010s.»
> level: B2 · id: en-b2-review-q72
> - [ ] True
> - [ ] False
> - [x] Not Given
>
> **Пояснення:** у B є повернення маршрутів і розпродані квитки влітку, але **жодних цифр** про кількість пасажирів. Логічно «мабуть, зросло» — не підстава для True. (тема 27)

> [!quiz] IELTS True / False / Not Given: «A sleeper cabin is usually cheaper than a flight on the same route.»
> level: B2 · id: en-b2-review-q73
> - [ ] True
> - [x] False
> - [ ] Not Given
>
> **Пояснення:** абзац D: *a ticket for a sleeper cabin frequently costs more than a flight* — текст прямо каже протилежне → False. (тема 27)

> [!quiz] IELTS Yes / No / Not Given: «The usual comparison between the price of a night train and the price of a flight is unfair.»
> level: B2 · id: en-b2-review-q74
> - [x] Yes
> - [ ] No
> - [ ] Not Given
>
> **Пояснення:** абзац E: *In my view, comparing these two prices is misleading* — позиція автора збігається з твердженням. (тема 27)

> [!quiz] IELTS Yes / No / Not Given: «Night trains should be expected to make a profit without help from the state.»
> level: B2 · id: en-b2-review-q75
> - [ ] Yes
> - [x] No
> - [ ] Not Given
>
> **Пояснення:** автор вважає, що їх варто розглядати як *public infrastructure… rather than expecting them to make a profit on their own* — протилежна думка → No. (тема 27)

> [!quiz] IELTS Yes / No / Not Given: «Airlines will soon start running their own night trains.»
> level: B2 · id: en-b2-review-q76
> - [ ] Yes
> - [ ] No
> - [x] Not Given
>
> **Пояснення:** авіакомпанії згадані лише як конкуренти; про їхні плани автор нічого не каже → Not Given. (тема 27)

Заголовки для завдань на matching headings:

- i. Why the night train lost out
- ii. A comeback few expected
- iii. Cheaper than flying
- iv. Greener and more convenient
- v. Obstacles to growth
- vi. A matter for governments, not just markets
- vii. The end of the line
- viii. How sleeper carriages are built

> [!quiz] IELTS Matching headings: який заголовок для абзацу B?
> level: B2 · id: en-b2-review-q77
> - [x] ii. A comeback few expected
> - [ ] iii. Cheaper than flying
> - [ ] vii. The end of the line
> - [ ] viii. How sleeper carriages are built
>
> **Пояснення:** *something unexpected happened… routes… were brought back* — неочікуване повернення. *Carriages* згадано, але не те, як їх будують, — пастка «знайоме слово». (тема 27)

> [!quiz] IELTS Matching headings: який заголовок для абзацу D?
> level: B2 · id: en-b2-review-q78
> - [ ] i. Why the night train lost out
> - [ ] iii. Cheaper than flying
> - [ ] iv. Greener and more convenient
> - [x] v. Obstacles to growth
>
> **Пояснення:** *Yet the revival faces serious obstacles* — перше речення абзацу часто й є його темою; далі — перелік перешкод. (тема 27)

> [!quiz] IELTS Matching headings: який заголовок для абзацу E?
> level: B2 · id: en-b2-review-q79
> - [ ] ii. A comeback few expected
> - [ ] iii. Cheaper than flying
> - [x] vi. A matter for governments, not just markets
> - [ ] vii. The end of the line
>
> **Пояснення:** головна думка E — *governments… should treat night trains as public infrastructure… rather than expecting them to make a profit*. Ціни згадані, але як аргумент, а не тема. (тема 27)

> [!quiz] IELTS Sentence endings: «Rail companies began to see sleeper services as a luxury because…»
> level: B2 · id: en-b2-review-q80
> - [x] each carriage carries few passengers and makes only one trip a day.
> - [ ] passengers can avoid paying for a hotel room.
> - [ ] they were banned in several countries.
> - [ ] booking has become much simpler.
>
> **Пояснення:** абзац A: *holds far fewer people… only one journey every twenty-four hours… needs staff*. Друге закінчення — правда з тексту, але про інше (переваги, абзац C). (тема 27)

> [!quiz] IELTS Sentence endings: «By choosing a night train, travellers can avoid…»
> level: B2 · id: en-b2-review-q81
> - [ ] the charges for using other countries' railways.
> - [x] paying for a hotel room.
> - [ ] any changes to the timetable.
> - [ ] the trip to the city centre.
>
> **Пояснення:** абзац C: *travellers save both the trip to the airport and the cost of a hotel room*. До центру міста їхати якраз зручно — поїзд саме там. (тема 27)

> [!quiz] IELTS Sentence endings: «The writer suggests that nostalgia…»
> level: B2 · id: en-b2-review-q82
> - [ ] is the main reason passengers choose night trains.
> - [x] cannot by itself keep the services running.
> - [ ] has made governments invest in new carriages.
> - [ ] is shared by most rail operators.
>
> **Пояснення:** *Nostalgia is a pleasant feeling, but it is not a business model* — тобто одних почуттів недостатньо, потрібні гроші. (тема 27)

> [!quiz] IELTS Summary completion: NO MORE THAN TWO WORDS з тексту
> level: B2 · type: fill · id: en-b2-review-q83 · bank: hotel, private
>
> ```text fill
> Night trains declined because of competition from [[low-cost airlines]] and new [[high-speed]] lines.
> Since the mid-2010s, operators have brought back routes that had been [[abandoned]] only a few years earlier.
> ```
>
> **Пояснення:** слова беруться **з тексту** (абзаци A і B) без змін і не більше двох; перевір, що речення граматично правильне з твоєю відповіддю. (тема 27)

### Writing Task 1 — таблиця (Academic)

> [!example] Завдання (20 хвилин, 150+ слів)
> *The table below shows the percentage of employees in four occupations who worked from home at least two days a week in 2015, 2020 and 2025.*
>
> *Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.*
>
> | Occupation | 2015 | 2020 | 2025 |
> |---|---|---|---|
> | IT specialists | 18% | 72% | 64% |
> | Accountants | 9% | 55% | 41% |
> | Teachers | 2% | 38% | 6% |
> | Nurses | 1% | 4% | 3% |
>
> *Дані вигадані для вправи.*

> [!quiz] IELTS Writing Task 1: яке речення — найкраще overview?
> level: B2 · id: en-b2-review-q84
> - [ ] In 2015, 18% of IT specialists, 9% of accountants, 2% of teachers and 1% of nurses worked from home.
> - [x] Overall, working from home became far more common in all four jobs by 2020 and then declined, but it remained much more widespread among IT specialists and accountants than among teachers and nurses.
> - [ ] Working from home increased because of the pandemic, which was a terrible time for everyone.
> - [ ] The table shows the percentage of employees who worked from home.
>
> **Пояснення:** overview — головні тенденції (зросло → знизилось) і головне порівняння (офісні vs неофісні), без цифр. Перелік цифр — це деталі, причини — домисли, а останнє речення лише переписує завдання. (тема 25)

> [!quiz] Мова Task 1: доповни речення
> level: B2 · type: fill · id: en-b2-review-q85 · bank: at, of
>
> ```text fill
> The figure for teachers [[peaked]] at 38% in 2020, before falling [[to]] just 6% in 2025.
> IT specialists were [[by]] far the most likely to work from home.
> ```
>
> **Пояснення:** *peak at* — досягти піку; *fall **to*** — до рівня (*fall **by*** — на скільки); *by far the most* — «значно більше за всіх». (тема 23)

**Чекліст перед здачею Task 1** (тема 25; критерії — Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy):

- [ ] **Task Achievement**: вступ перефразовує завдання (*The table compares…*), є чіткий **overview**, ключові цифри наведено й порівняно; без власних думок і причин;
- [ ] **Coherence & Cohesion**: 4 абзаци — вступ, overview, деталі групою 1 (IT і бухгалтери), деталі групою 2 (вчителі й медсестри); референція замість повторів (*the figure for…, the latter*);
- [ ] **Lexical Resource**: різні дієслова трендів (*rose sharply, peaked at, fell back, remained low*), приблизність (*just under two-thirds, roughly a third*), без повторів *increase / increase*;
- [ ] **Grammatical Range & Accuracy**: Past Simple для минулих років, порівняння (*twice as high as*, *whereas*), participle clause (*…, reaching a peak of 72%*), правильні прийменники *to / by / at*;
- [ ] 150+ слів, приблизно 20 хвилин.

### Writing Task 2 — есе

> [!example] Завдання (40 хвилин, 250+ слів)
> *Some people believe that university education should be free for all students. Others think that students should pay at least part of the cost themselves.*
>
> *Discuss both these views and give your own opinion.*
>
> *Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.*

> [!quiz] IELTS Writing Task 2: яке речення найкраще завершує вступ до цього есе?
> level: B2 · id: en-b2-review-q86
> - [ ] Education is very important in our life nowadays.
> - [ ] In this essay I will write about free education.
> - [x] This essay will examine both views before arguing that a mixed system, in which tuition is free but students contribute to living costs, is the fairest solution.
> - [ ] Universities should be free because free universities are good for everyone.
>
> **Пояснення:** у *Discuss both views and give your opinion* вступ має назвати обидві позиції і **твою** — так оцінюють Task Response. Загальники й повтори без позиції тягнуть бал униз. (тема 25)

**Чекліст перед здачею Task 2** (тема 25):

- [ ] **Task Response**: обидві думки розкрито, твоя позиція — у вступі й висновку, без суперечностей; кожен аргумент — з поясненням і прикладом;
- [ ] **Coherence & Cohesion**: вступ → абзац «за безкоштовне» → абзац «за оплату» → висновок; одна головна думка на абзац; звʼязки різні й доречні (*Admittedly, Nevertheless, Consequently, On balance*), без механічного *Firstly, Secondly, Also*;
- [ ] **Lexical Resource**: лексика теми (*tuition fees, student debt, access to education, taxpayers*), колокації (*a key factor, have an impact on, widen access*), обережні формулювання (*it could be argued that, arguably*);
- [ ] **Grammatical Range & Accuracy**: умовні, зокрема змішані (*If university were free, more people would…*), пасив (*it is often argued that…*), non-defining (*…, which would…*), *despite / whereas*; без *don't / can't* в академічному стилі;
- [ ] 250+ слів, перевір час: 5 хвилин план, 30 — текст, 5 — перевірка.

### Speaking Part 2 — cue card

> [!example] Картка (cue card)
> **Describe a time when you had to change your plans at the last minute.**
> You should say:
> - what the plan was
> - why you had to change it
> - what you did instead
>
> and explain how you felt about it.

**1 хвилина** — нотатки (5–7 ключових слів), **2 хвилини** — монолог (тема 26). Покажи граматику B2: *I'd been looking forward to it for weeks* (01, 08), *If I'd checked the forecast, I wouldn't have…* (03), *I should have booked earlier* (07), *I wish I'd known* (04), *we ended up…, which turned out to be…* (09, 21).

> [!speak] Почни відповідь Part 2.
> level: B2 · id: en-b2-review-s07
> text: I'd like to talk about a trip that I had to cancel at the very last minute.
> ipa: /aɪd ˈlaɪk tə ˈtɔːk əˈbaʊt ə ˈtrɪp ðət aɪ ˈhæd tə ˈkænsl ət ðə ˈveri ˈlɑːst ˈmɪnɪt/
> tip: *had to* — /ˈhæd tə/, слабке *to*; *last minute* — /t/ у *last* майже зникає (elision).
> uk: Я хотів би розповісти про поїздку, яку мені довелося скасувати в останню хвилину.

**Part 3 — дискусія** (питання екзаменатора; відповідай 3–5 реченнями: думка → причина → приклад → можливо, інший бік):

- *Why do some people find it difficult to change their plans?*
- *Is it better to plan your life in detail or to stay flexible?*
- *How might technology change the way people plan their time in the future?* — шанс для *will be doing / will have changed*.

> [!speak] Почни відповідь Part 3.
> level: B2 · id: en-b2-review-s08
> text: That's a tricky one, but I'd imagine that by 2040 most of our planning will have been done by apps.
> ipa: /ðæts ə ˈtrɪki wʌn bət aɪd ɪˈmædʒɪn ðət baɪ ˌtwenti ˈfɔːti ˈməʊst əv aʊə ˈplænɪŋ wɪl əv bɪn ˈdʌn baɪ ˈæps/
> tip: *I'd imagine* — /aɪd ɪˈmædʒɪn/, наголос на *MA*; *will have been done* — слабкі /wɪl əv bɪn/, наголос на *DONE*.
> uk: Складне питання, але, гадаю, до 2040 року більшість нашого планування робитимуть застосунки.

> [!tip] Твоя черга — і критерії Speaking
> Постав таймер: 1 хвилина на нотатки, 2 хвилини — говори, потім 4 хвилини на три питання Part 3. Запиши себе й переслухай за чотирма критеріями:
> - **Fluency & Coherence** — говорив без довгих пауз, зі звʼязками (*what's more, on the other hand, in the end*);
> - **Lexical Resource** — ідіоми й колокації B2 доречно (*at the eleventh hour, a blessing in disguise*), перефразування, коли бракує слова;
> - **Grammatical Range & Accuracy** — третій умовний, *wish*, модальні в минулому, Future Perfect — і без помилок у базових часах;
> - **Pronunciation** — звʼязне мовлення, слабкі форми, наголос у реченні, інтонація, а не «слово за словом».
>
> Усі чотири впевнено — це орієнтовно band 6–6.5.

## Фішки

> [!reel] 🧭 B2 — «Vantage», точка огляду
> Англійська назва рівня B2 у CEFR — *Vantage*, «вигідна позиція». З неї вже видно мову цілком: ти розумієш суть складних текстів і фахових дискусій, говориш спонтанно й можеш обстояти позицію з плюсами й мінусами.

> [!reel] 🎯 IELTS 5.5–6.5 — що це означає
> B2 у балах IELTS — приблизно 5.5–6.5. Саме 6.0–6.5 найчастіше вимагають для бакалаврату в англомовних університетах, а для багатьох робочих і візових програм досить 5.5–6.0. Різниця між 6.0 і 7.0 — це вже C1: точність, рідкісна лексика й менше помилок.

> [!reel] 🚀 Що далі на C1
> На C1 зʼявляться інверсія (*Never have I seen…*), cleft-речення (*What I need is…*), умовні без *if* (*Had I known…*), hedging і академічний стиль, швидка розмова з різними акцентами — і IELTS 7.0+.

## Джерела та що почитати

- [Council of Europe — CEFR](https://www.coe.int/en/web/common-european-framework-reference-languages) — що означає рівень B2 (Vantage).
- [IELTS — офіційний сайт](https://ielts.org) — формат Listening, Reading, Writing, Speaking; Academic і General Training; публічні band descriptors.
- [Take IELTS (British Council)](https://takeielts.britishcouncil.org/) — підготовка, безкоштовні пробні матеріали, як рахують бал.
- [Cambridge English — B2 First](https://www.cambridgeenglish.org/exams-and-tests/first/) — формат і зразки екзамену рівня B2.
- [British Council LearnEnglish — B1–B2 grammar](https://learnenglish.britishcouncil.org/grammar/b1-b2-grammar) — повторення граматики з вправами.
- R. Murphy — *English Grammar in Use* — часи, умовні, пасив, модальні, герундій та інфінітив, підрядні.
- *Cambridge IELTS* (Cambridge University Press) — офіційні пробні тести для самоперевірки.

> [!important] Підсумок
> - B2 = система часів, Future Perfect, третій і змішані умовні, *wish*, пасив усіх часів і каузатив, дієслова непрямої мови, модальні в минулому, герундій vs інфінітив, non-defining і participle clauses, звʼязки.
> - Найчастіші помилки: *If I knew* замість *If I had known*, *despite of*, *suggest me to*, *deny to do*, *that* після коми, *however* як сполучник, *I didn't need to* замість *needn't have*.
> - Помилився — відкрий тему з номером у поясненні й пройди її тест ще раз.
> - 80 % і більше — ти готовий до C1, а в IELTS орієнтовно цілишся в 6.0–6.5.
