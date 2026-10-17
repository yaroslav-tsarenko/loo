---
title: Модальні в минулому — must have, should have, could have
order: 407
id: en-b2-past-modals
level: B2
icon: px:magnifier
tags: [english, b2, grammar, modals, past-modals, ielts]
prerequisites: ["[[English - B1 - 14. Ймовірність — may, might, could, must, can't]]", "[[English - A2 - 17. Must, have to, should — обовʼязок і порада]]"]
estimatedMinutes: 45
---

# Модальні в минулому — must have, should have, could have

> [!success] Після цієї теми ти зможеш
> - робити висновки про минуле з доказів: *She **must have** forgotten*, *He **can't have** seen us*, *They **might have** got lost*;
> - критикувати й шкодувати: *You **should have** told me*, *I **shouldn't have** said that*, *We **could have** won*;
> - розрізняти *needn't have done* («зробив, а дарма») і *didn't need to do* («не треба було»);
> - вимовляти *should've, must've, could've* природно — і не писати ~~*should of*~~;
> - обережно міркувати про причини в IELTS Speaking Part 3 (B2 ≈ IELTS 5.5–6.5).

## Передбач

> [!quiz] «Вона, мабуть, забула про зустріч». Як сказати?
> level: B2 · id: en-b2-past-modals-q01
> - [ ] She must forget about the meeting.
> - [x] She must have forgotten about the meeting.
> - [ ] She had to forget about the meeting.
> - [ ] She must forgot about the meeting.
>
> **Пояснення:** висновок про **минуле** — **must have + V3**. *Must forget* — про теперішнє чи обовʼязок, а *had to forget* — «мусила забути» (обовʼязок), що тут безглуздо.

## Простими словами

На B1 ти вже робив висновки про **тепер**: *He **must be** tired. She **can't be** at home.* Щоб перенести цю думку в **минуле**, англійська не змінює сам модальний — вона додає **have + V3**:

> модальне дієслово + **have** + **V3** (третя форма)

*must have gone*, *can't have seen*, *should have told*, *could have won*. Модальне не змінюється за особами: *he must have*, *they must have* — без *has*.

Ці конструкції роблять дві різні роботи:

1. **Дедукція** — ми не бачили, що сталося, але робимо висновок з доказів: *The ground is wet. It **must have rained**.* — Земля мокра. Мабуть, ішов дощ.
2. **Критика і жаль** — ми знаємо, що сталося, і оцінюємо: *You **should have called** me.* — Тобі слід було мені подзвонити (а ти не подзвонив).

> [!diagram] Шкала впевненості: висновки про минуле
> ```yaml
> layout: stack
> nodes:
>   - { id: must, label: "≈ 95 % — так", text: "must have + V3", note: "He must have left already.", tone: green }
>   - { id: may, label: "≈ 50 % — можливо", text: "may / might / could have + V3", note: "He might have missed the bus.", tone: yellow }
>   - { id: cant, label: "≈ 0 % — точно ні", text: "can't / couldn't have + V3", note: "He can't have heard us.", tone: red }
> steps:
>   - { focus: must, note: "Докази переконливі — must have: «напевно, мабуть». Не обовʼязок, а висновок." }
>   - { focus: may, note: "Можливо, так, а можливо, ні — may, might або could have. Різниця між ними мінімальна." }
>   - { focus: cant, note: "Ти впевнений, що цього НЕ було, — can't have або couldn't have. Не mustn't have!" }
> ```

## Пояснення

### Дедукція: must have, can't have, might have

| Впевненість | Форма | Приклад | Переклад |
|---|---|---|---|
| майже точно так | **must have** + V3 | The lights are off. They **must have gone** to bed. | Світло вимкнене. Мабуть, вони вже лягли спати. |
| можливо | **may / might / could have** + V3 | She's late. She **might have missed** the bus. | Вона запізнюється. Можливо, пропустила автобус. |
| майже точно ні | **can't / couldn't have** + V3 | He **can't have finished** already — he only started at ten. | Не може бути, що він уже закінчив, — почав лише о десятій. |
| процес у минулому | **must / might have been** + -ing | Your eyes are red. You **must have been crying**. | У тебе червоні очі. Ти, мабуть, плакала. |

> [!tip] Британська і американська норма
> Для «точно ні» британці кажуть **can't have** / **couldn't have**. В американській розмовній мові поширене ще **must not have**: *He **must not have** heard me* (US) = *He **can't have** heard me* (UK). А от ~~*mustn't have*~~ у значенні висновку британці не вживають.

> [!diagram] Від доказу до висновку
> ```yaml
> layout: flow
> nodes:
>   - { id: clue, label: "доказ", text: "The road is wet.", tone: blue, icon: "px:magnifier" }
>   - { id: think, label: "наскільки впевнений?", text: "≈ 95 %", tone: yellow, icon: "px:think" }
>   - { id: modal, label: "модальне", text: "must", tone: violet }
>   - { id: form, label: "минуле", text: "+ have + V3", tone: orange }
>   - { id: out, label: "висновок", text: "?", tone: green }
> steps:
>   - { focus: clue, note: "Починаємо з того, що бачимо зараз: дорога мокра." }
>   - { move: { from: clue, to: think, value: "майже точно" }, note: "Питаємо себе: наскільки я впевнений? Інших пояснень майже немає." }
>   - { move: { from: think, to: modal, value: "must" }, note: "Майже точно — must. Якби лише «можливо» — might, якби «точно ні» — can't." }
>   - { move: { from: modal, to: form, value: "rain → rained" }, note: "Дощ був у минулому, тож додаємо have + V3." }
>   - { move: { from: form, to: out, value: "висновок" }, set: { out: "It must have rained." }, note: "Готово: It must have rained — мабуть, ішов дощ." }
> ```

> [!quiz] Перевір себе: оціни докази й обери модальне
> level: B2 · type: fill · bank · id: en-b2-past-modals-q02 · bank: must have been
>
> ```text fill
> There's no answer. They [[must have]] gone out — the car isn't here.
> She [[can't have|couldn't have]] taken the money — she was with me all evening.
> I'm not sure where my keys are. I [[might have|may have|could have]] left them at work.
> ```
>
> **Пояснення:** машини немає — майже точно пішли → **must have**; вона весь вечір була з тобою — точно ні → **can't / couldn't have**; не впевнений → **might / may / could have**.

### Критика і жаль: should have, could have, would have

| Форма | Зміст | Приклад | Переклад |
|---|---|---|---|
| **should have** + V3 | треба було, але **не** зробили | You **should have told** me earlier. | Тобі слід було сказати мені раніше. |
| **shouldn't have** + V3 | не треба було, але **зробили** | I **shouldn't have eaten** so much. | Не треба було мені стільки їсти. |
| **ought to have** + V3 | = should have (формальніше, рідше) | They **ought to have apologised**. | Їм слід було вибачитися. |
| **could have** + V3 | була можливість, але **не** скористалися | We **could have won**, but we gave up. | Ми могли виграти, але здалися. |
| **could have** + V3 (докір) | «міг би й…» | You **could have warned** me! | Міг би й попередити мене! |
| **would have** + V3 | хотів би / зробив би, але щось завадило | I **would have come**, but I was ill. | Я б прийшов, але захворів. |

> [!warning] Couldn't have + порівняння = «краще не буває»
> *It **couldn't have been** better!* — це не критика, а захват: «Краще й бути не могло!». Так само *I **couldn't have done** it without you* — «Без тебе я б не впорався».

### Needn't have чи didn't need to?

Українське «не треба було» має два різні англійські відповідники:

> [!diagram] Needn't have vs didn't need to
> ```yaml
> layout: compare
> columns: { neednt: "needn't have + V3", didnt: "didn't need to + V1" }
> nodes:
>   - { id: n1, col: neednt, label: "що сталося", text: "дію зробили — а виявилося, дарма", tone: orange }
>   - { id: n2, col: neednt, label: "приклад", text: "I needn't have cooked — they'd already eaten.", note: "я приготував, але даремно", tone: orange }
>   - { id: d1, col: didnt, label: "що сталося", text: "потреби не було (і зазвичай не робили)", tone: blue }
>   - { id: d2, col: didnt, label: "приклад", text: "I didn't need to cook — we ordered pizza.", note: "я не готував", tone: blue }
> steps:
>   - { show: [n1, n2], note: "Needn't have + V3: дію виконано, а потім зʼясувалося, що вона була непотрібна. Часто з відтінком жалю за витраченими зусиллями." }
>   - { show: [d1, d2], note: "Didn't need to + V1: потреби не було. Здебільшого це означає, що й не робили. Якщо зробили, контекст це покаже: I didn't need to cook, but I did." }
> ```

*Needn't have* — більше британське; в американській частіше *didn't have to* або *didn't need to* + уточнення.

> [!quiz] «Я взяв парасольку, але дощу так і не було». Як сказати?
> level: B2 · id: en-b2-past-modals-q03
> - [x] I needn't have taken an umbrella.
> - [ ] I didn't need to take an umbrella.
> - [ ] I mustn't have taken an umbrella.
> - [ ] I shouldn't take an umbrella.
>
> **Пояснення:** парасольку **взяв**, а вона виявилася непотрібною → **needn't have taken**. *Didn't need to take* натякає, що не брав. *Mustn't have* — не висновок і не жаль, такої моделі тут немає.

## Приклади

- You **must have been** exhausted after the night shift. — Ти, мабуть, була виснажена після нічної зміни.
- He **can't have seen** us — he didn't even wave. — Він не міг нас бачити — навіть не помахав.
- The parcel **might have got** lost in the post. — Посилка, можливо, загубилася на пошті.
- I **should have listened** to my mum. — Треба було послухати маму.
- We **shouldn't have booked** such a cheap hotel. — Не варто було бронювати такий дешевий готель.
- You **could have asked** before taking my charger! — Міг би й спитати, перш ніж брати мою зарядку!
- They **could have been** killed — the driver was going way too fast. — Вони могли загинути — водій їхав надто швидко.
- I **would have called**, but my phone was dead. — Я б подзвонила, але телефон розрядився.
- You **needn't have bought** flowers — but thank you! — Не треба було купувати квіти — але дякую!
- In hindsight, the company **should have invested** more in training. — Заднім числом зрозуміло: компанії слід було більше вкладати в навчання.

## Слова

> [!word] assume
> ipa: /əˈsjuːm/ · ipa-us: /əˈsuːm/ · pos: verb · level: B2 · id: en-b2-past-modals-w01
> uk: припускати, вважати (без доказів)
> example: I **assumed** you must have left already. — Я припустив, що ти вже, мабуть, пішов.
> note: assumption — припущення. Never assume! — Не роби поспішних висновків!

> [!word] deduce
> ipa: /dɪˈdjuːs/ · ipa-us: /dɪˈduːs/ · pos: verb · level: B2 · id: en-b2-past-modals-w02
> uk: робити висновок, виводити (логічно)
> example: From the footprints, she **deduced** that someone must have been in the garden. — За слідами вона зробила висновок, що в саду хтось був.
> note: deduction — дедукція, висновок.

> [!word] in hindsight
> ipa: /ɪn ˈhaɪnd.saɪt/ · pos: phrase · level: B2 · id: en-b2-past-modals-w03
> uk: заднім числом, оглядаючись назад
> example: **In hindsight**, I should have taken the job. — Оглядаючись назад, мені слід було погодитися на ту роботу.
> note: також with hindsight. Ідеально поєднується з should have.

> [!word] jump to conclusions
> ipa: /dʒʌmp tə kənˈkluː.ʒənz/ · pos: phrase · level: B2 · id: en-b2-past-modals-w04
> uk: робити поспішні висновки
> example: Don't **jump to conclusions** — he might have just forgotten. — Не поспішай з висновками — можливо, він просто забув.

> [!word] misplace
> ipa: /ˌmɪsˈpleɪs/ · pos: verb · level: B2 · id: en-b2-past-modals-w05
> uk: покласти не на місце, загубити (на час)
> example: I must have **misplaced** my glasses somewhere. — Я, мабуть, кудись поклав окуляри.
> note: м'якше за lose: річ десь поруч, просто не там.

> [!word] suspect
> ipa: /səˈspekt/ · pos: verb · level: B2 · id: en-b2-past-modals-w06
> uk: підозрювати
> example: I **suspect** she might have known all along. — Підозрюю, що вона, можливо, знала все від початку.
> note: дієслово — наголос на 2-му складі (sus-PECT); іменник a suspect /ˈsʌs.pekt/ — підозрюваний.

> [!word] forgetful
> ipa: /fəˈɡet.fəl/ · ipa-us: /fɚˈɡet.fəl/ · pos: adj · level: B2 · id: en-b2-past-modals-w07
> uk: забудькуватий
> example: Grandad's getting a bit **forgetful** — he must have left the door open again. — Дідусь стає забудькуватим — мабуть, знову залишив двері відчиненими.

> [!word] reckless
> ipa: /ˈrek.ləs/ · pos: adj · level: B2 · id: en-b2-past-modals-w08
> uk: безрозсудний, ризиковий
> example: That was **reckless** — you could have been killed! — Це було безрозсудно — ти міг загинути!
> note: reckless driving — небезпечне водіння (юридичний термін).

> [!word] have a narrow escape
> ipa: /hæv ə ˈnær.əʊ ɪˈskeɪp/ · ipa-us: /hæv ə ˈner.oʊ ɪˈskeɪp/ · pos: phrase · level: B2 · id: en-b2-past-modals-w09
> uk: ледве врятуватися, дивом уникнути біди
> example: We **had a narrow escape** — the tree could have fallen on our car. — Ми дивом уникнули біди — дерево могло впасти на нашу машину.

> [!word] speculate
> ipa: /ˈspek.jə.leɪt/ · pos: verb · level: B2 · id: en-b2-past-modals-w10
> uk: міркувати, висувати припущення
> example: Scientists **speculate** that the comet may have caused the extinction. — Науковці припускають, що вимирання могла спричинити комета.
> note: speculate about / on sth; speculation — здогадки, спекуляції.

## Слухаємо

> [!listen] Що ти почув?
> level: B2 · type: choice · id: en-b2-past-modals-l01
> audio: You should've told me about the party.
> - [x] You should've told me about the party.
> - [ ] You shouldn't have told me about the party.
> - [ ] You should tell me about the party.
>
> **Пояснення:** *should've* /ˈʃʊd.əv/ — *have* зводиться до слабкого [əv]. У *shouldn't have* чути /nt/: [ШУД-нт-əв]. Зміст протилежний: «мав сказати» проти «не варто було казати».

> [!listen] Що ти почув?
> level: B2 · type: choice · id: en-b2-past-modals-l02
> audio: She might've missed the last train.
> - [ ] She must've missed the last train.
> - [x] She might've missed the last train.
> - [ ] She might miss the last train.
>
> **Пояснення:** *might've* /ˈmaɪ.təv/ — дифтонг /aɪ/; *must've* /ˈmʌs.təv/ — коротке /ʌ/. Різниця у впевненості: «можливо» проти «мабуть».

> [!listen] Надрукуй почуте
> level: B2 · type: dictation · id: en-b2-past-modals-l03
> audio: He can't have finished the report already.

> [!listen] Надрукуй почуте
> level: B2 · type: dictation · id: en-b2-past-modals-l04
> audio: We needn't have taken a taxi.
> accept: We need not have taken a taxi.

> [!listen] IELTS Listening · Part 3: чому, на думку студентів, експеримент не вдався?
> level: B2 · type: answer · tags: ielts · id: en-b2-past-modals-l05
> audio: A: Why do you think the results were so strange?
> audio: B: It can't have been the temperature — we checked it twice.
> audio: A: True. Maybe the samples were the problem?
> audio: B: Yes, they must have been contaminated. We should have used new containers.
> - [ ] Неправильна температура
> - [x] Забруднені зразки
> - [ ] Вони двічі перевіряли не те
> - [ ] Нові контейнери були браковані
>
> **Пояснення:** температуру відкинули — *It **can't have been** the temperature*. Причина — *they **must have been** contaminated*. Нові контейнери вони **не** використали (*should have used*), тож останній варіант — пастка.

> [!listen] IELTS Listening · Part 4: яке пояснення лектор називає найновішим?
> level: B2 · type: answer · tags: ielts · id: en-b2-past-modals-l06
> audio: For years, historians believed the town must have been destroyed by an earthquake. However, recent studies of the soil suggest that it may have been abandoned because of a long drought.
> - [ ] Місто зруйнував землетрус
> - [x] Люди могли покинути місто через тривалу посуху
> - [ ] Місто захопили вороги
> - [ ] Історики досі вважають, що причина — землетрус
>
> **Пояснення:** *For years… believed* — стара версія (землетрус). *However, recent studies… suggest… **may have been** abandoned because of a long drought* — нова. Слово *However* у лекції — сигнал: зараз буде головне.

## Вимова

Модальне + *have* у мовленні зливаються: *have* втрачає /h/ і стає слабким [əv].

| Пишемо | Чуємо | IPA |
|---|---|---|
| should have | should've | /ˈʃʊd.əv/ |
| could have | could've | /ˈkʊd.əv/ |
| must have | must've | /ˈmʌs.təv/ |
| might have | might've | /ˈmaɪ.təv/ |
| shouldn't have | [шуднтəв] | /ˈʃʊd.ənt.əv/ |

> [!speak] Скажи вголос
> level: B2 · id: en-b2-past-modals-s01
> text: You should have told me.
> ipa: /juː ʃʊd əv təʊld miː/
> tip: should have → should've [ШУД-əв]: h зникає, have стає слабким. Наголос — на told.
> uk: Тобі слід було мені сказати.

> [!speak] Скажи вголос
> level: B2 · id: en-b2-past-modals-s02
> text: She must have missed the train.
> ipa: /ʃiː mʌst əv mɪst ðə treɪn/
> tip: must have → [МАС-тəв]; missed — одне /t/ у кінці: [мɪст], не «міс-сед».
> uk: Вона, мабуть, пропустила потяг.

> [!speak] Скажи вголос
> level: B2 · id: en-b2-past-modals-s03
> text: They can't have finished already.
> ipa: /ðeɪ kɑːnt əv ˈfɪn.ɪʃt ɔːlˈred.i/
> tip: can't у британській — довге /ɑː/ [каант], в американській — /æ/ [кент]. Наголос: CAN'T і FIN-ished.
> uk: Не може бути, що вони вже закінчили.

> [!speak] Скажи вголос
> level: B2 · id: en-b2-past-modals-s04
> text: I needn't have worried.
> ipa: /aɪ ˈniː.dənt əv ˈwʌr.id/
> tip: needn't — [НІ-днт] з довгим /iː/; worried — /ʌ/, як у but, не «воррід».
> uk: Даремно я хвилювався.

> [!speak] Скажи вголос
> level: B2 · id: en-b2-past-modals-s05
> text: We could have won the match.
> ipa: /wiː kʊd əv wʌn ðə mætʃ/
> tip: could've [КУД-əв]; won звучить так само, як one — /wʌn/.
> uk: Ми могли виграти матч.

> [!speak] IELTS Speaking · Part 3 — оцінка минулих рішень
> level: B2 · id: en-b2-past-modals-s06
> text: In hindsight, the city should have invested in public transport instead of building more roads.
> ipa: /ɪn ˈhaɪnd.saɪt ðə ˈsɪt.i ʃʊd əv ɪnˈves.tɪd ɪn ˌpʌb.lɪk ˈtræn.spɔːt ɪnˈsted əv ˈbɪl.dɪŋ mɔː rəʊdz/
> tip: питання Part 3 — «What mistakes have cities made in the past?». Should have + V3 — точна критика минулого рішення (Grammatical Range). instead‿of — звʼяжи d з голосним.
> uk: Заднім числом зрозуміло: місту слід було інвестувати в громадський транспорт, а не будувати більше доріг.

## Типові помилки українців

> [!pitfall] «Must have» — це не «мусив»
> *She **must have** left* — «вона, **мабуть**, пішла» (висновок), а не «вона мусила піти». Обовʼязок у минулому — **had to**: *She **had to** leave early* — Їй довелося піти раніше. Українське «мав» (і «мав би», і «мусив») заплутує — перевір: це припущення чи обовʼязок?

> [!pitfall] «Should of», «could of»
> На слух *should've* = /ˈʃʊd.əv/, і навіть носії іноді пишуть ~~*should of*~~. Це помилка: після модального завжди **have**. В есе IELTS пиши повністю: *should **have***, *could **have***; скорочення *should've* — лише в неформальному тексті.

> [!pitfall] «Mustn't have» замість «can't have»
> «Він не міг цього бачити» (впевнений, що ні) → *He **can't have** seen it* / *He **couldn't have** seen it*. ~~*He mustn't have seen it*~~ — у британській так не кажуть: *mustn't* означає заборону. (В американській розмовній є *must not have* — але *can't have* зрозуміють усюди.)

> [!pitfall] «Не треба було»: needn't have чи didn't need to
> Якщо ти **зробив** щось непотрібне — *I **needn't have** cooked* / *I **didn't need to** cook, but I did*. Якщо **не робив**, бо не було потреби, — *I **didn't need to** cook*. Одне українське «не треба було» — два різні факти.

## Практика

> [!quiz] «Ти міг би й попередити мене!» Обери речення.
> level: B2 · id: en-b2-past-modals-q04
> - [ ] You can warn me!
> - [x] You could have warned me!
> - [ ] You must have warned me!
> - [ ] You could warned me!
>
> **Пояснення:** докір за те, чого людина **не зробила**, — **could have + V3**. *Must have warned* — «ти, мабуть, мене попередив» (висновок), а *could warned* — неможлива форма.

> [!quiz] Встав should have або shouldn't have і дієслово в правильній формі
> level: B2 · type: fill · id: en-b2-past-modals-q05
>
> ```text fill
> I failed the exam. I [[should have studied|should've studied]] harder. (study)
> My head hurts. I [[shouldn't have stayed]] up so late. (stay)
> We missed the flight. We [[should have left|should've left]] home earlier. (leave)
> ```
>
> **Пояснення:** жаль про те, чого **не** зробив, — **should have + V3**; про те, що **зробив** даремно, — **shouldn't have + V3**. *Leave → left*.

> [!quiz] Склади речення: «Не може бути, щоб вона нас бачила»
> level: B2 · type: order · id: en-b2-past-modals-q06
>
> ```text order
> She
> can't
> have
> seen
> us.
> saw // ✗
> ```
>
> **Пояснення:** **can't + have + V3**: *seen*, не *saw*. Після модального — завжди *have* і третя форма.

> [!quiz] Склади речення: «Даремно ми брали таксі»
> level: B2 · type: order · id: en-b2-past-modals-q07
>
> ```text order
> We
> needn't
> have
> taken
> a taxi.
> ```
>
> **Пояснення:** таксі **взяли**, а виявилося, що не треба було → **needn't have + V3**.

> [!quiz] У яких реченнях дія НЕ відбулася? Обери всі.
> level: B2 · type: multi · id: en-b2-past-modals-q08
> - [x] You should have called me.
> - [x] We could have gone by train.
> - [ ] I needn't have bought so much food.
> - [x] I would have helped, but nobody asked me.
> - [ ] She shouldn't have told him the truth.
>
> **Пояснення:** *should have called* — не подзвонив; *could have gone* — могли, але не поїхали; *would have helped* — допоміг би, але не допоміг. А в *needn't have bought* і *shouldn't have told* дія **відбулася** — і про неї шкодують.

> [!quiz] «У нього червоні очі». Обери найкращий висновок.
> level: B2 · id: en-b2-past-modals-q09
> - [ ] He must cry.
> - [x] He must have been crying.
> - [ ] He had to cry.
> - [ ] He can't have been crying.
>
> **Пояснення:** процес у недалекому минулому, наслідок видно зараз → **must have been + -ing**. *Had to cry* — «мусив плакати», а *can't have* — протилежний висновок.

> [!quiz] Перепиши: обери модальну форму
> level: B2 · type: fill · id: en-b2-past-modals-q10
>
> ```text fill
> I'm sure he didn't steal it. → He [[can't have|couldn't have]] stolen it.
> Perhaps they got lost. → They [[might have|may have|could have]] got lost.
> I'm sure she was joking. → She [[must have]] been joking.
> It wasn't necessary to bring food, but I did. → I [[needn't have]] brought food.
> ```
>
> **Пояснення:** «впевнений, що ні» — **can't / couldn't have**; «можливо» — **might / may / could have**; «впевнений, що так» — **must have**; «зробив даремно» — **needn't have**.

> [!quiz] Яке речення означає «Можливо, вона сіла не на той автобус»?
> level: B2 · id: en-b2-past-modals-q11
> - [ ] She must have taken the wrong bus.
> - [x] She might have taken the wrong bus.
> - [ ] She should have taken the wrong bus.
> - [ ] She can't have taken the wrong bus.
>
> **Пояснення:** «можливо» — **might have** (так само *may / could have*). *Must have* — «мабуть, напевно», *should have* — «слід було» (безглуздо: ніхто не радить сідати не в той автобус), *can't have* — «точно ні».

> [!quiz] «Без тебе я б не впорався». Як сказати?
> level: B2 · id: en-b2-past-modals-q12
> - [x] I couldn't have done it without you.
> - [ ] I can't do it without you.
> - [ ] I mustn't have done it without you.
> - [ ] I shouldn't have done it without you.
>
> **Пояснення:** *couldn't have done* — «не зміг би зробити» (в уявному минулому без тебе). Це вдячність, а не критика.

### У форматі IELTS

*The Old Mill Bridge collapsed in March 2021, just two days after a severe storm. Engineers who examined the site agreed that the storm may have contributed to the collapse, but they found that the steel supports had been badly corroded for years. According to their report, regular inspections should have identified the problem much earlier. Nobody was injured, although a bus had crossed the bridge only minutes before.*

> [!quiz] IELTS Reading · True / False / Not Given: «The engineers were certain that the storm caused the collapse.»
> level: B2 · tags: ielts · id: en-b2-past-modals-q13
> - [ ] True
> - [x] False
> - [ ] Not Given
>
> **Пояснення:** *the storm **may have contributed*** — «можливо, сприяла»: це обережне припущення, а не впевненість. До того ж головною причиною названо корозію. Твердження суперечить тексту → **False**. Модальні в минулому в Reading — ключ до ступеня впевненості автора.

> [!quiz] IELTS Reading · True / False / Not Given: «The bridge had not been inspected for several years.»
> level: B2 · tags: ielts · id: en-b2-past-modals-q14
> - [ ] True
> - [ ] False
> - [x] Not Given
>
> **Пояснення:** *regular inspections **should have** identified the problem* — регулярні перевірки **мали б** виявити проблему. Чи перевірки були і як часто — текст не каже. Не додумуй → **Not Given**.

> [!quiz] IELTS Reading · Summary completion: ОДНЕ слово з тексту
> level: B2 · type: fill · bank · tags: ielts · id: en-b2-past-modals-q15 · bank: driver, wind, months
>
> ```text fill
> The bridge fell down shortly after a severe [[storm]].
> The main problem was that the steel supports were [[corroded]].
> Luckily, no one was hurt, even though a [[bus]] had used the bridge minutes earlier.
> ```
>
> **Пояснення:** відповідь — точне слово з тексту, яке вписується граматично. *Wind* — синонім-пастка (у тексті *storm*), *driver* і *months* у тексті немає.

> [!quiz] IELTS Writing Task 1 · Якого речення НЕ варто писати в описі графіка продажів?
> level: B2 · tags: ielts · id: en-b2-past-modals-q16
> - [ ] Sales fell sharply between 2018 and 2020.
> - [x] Sales must have fallen because people lost interest in the product.
> - [ ] Sales reached a peak of 40,000 units in 2017.
> - [ ] The figure remained stable for the next two years.
>
> **Пояснення:** у Task 1 (Academic) описуєш **лише дані** з графіка. Здогадки про причини (*must have fallen because…*) — це інформація, якої на графіку немає, і вона шкодить Task Achievement. Модальні в минулому бережи для Task 2 і Speaking Part 3: *Governments **should have** acted sooner.*

> [!tip] IELTS Speaking Part 2 — спробуй сам
> **Cue card:** *Describe a decision you made that you later regretted. You should say: what the decision was, when you made it, why you made it, and explain what you should have done instead.*
> Підказка: *In hindsight, I **should have**… I **could have**… but I didn't… If I'd known…, I **would have**…*

## Фішки

> [!reel] 📝 Should of — помилка на слух
> Should've звучить як /ˈʃʊd.əv/, а of у потоці мовлення — теж /əv/. Тому ~~should of~~ трапляється навіть у носіїв. Словники й учителі одностайні: це помилка.

> [!reel] 🔍 Must have — мова Шерлока
> Шерлок Голмс у першій же зустрічі з Ватсоном здогадується, що той був в Афганістані. Його дедукція — це, по суті, must have і can't have: висновок про минуле з дрібних доказів.

> [!reel] 👓 Hindsight is 20/20
> Американська приказка «hindsight is 20/20» — заднім числом бачиш ідеально. 20/20 — це норма зору в США (тест з 20 футів). Британці тест міряють у метрах — 6/6.

## Джерела та що почитати

- 🟢 R. Murphy — *English Grammar in Use* (Cambridge): units «must have / can't have», «may have / might have», «should», «needn't have».
- 🟢 [British Council LearnEnglish — B1–B2 grammar](https://learnenglish.britishcouncil.org/grammar/b1-b2-grammar) — modals: deductions about the past.
- 🟡 [Cambridge Dictionary — English Grammar Today](https://dictionary.cambridge.org/grammar/british-grammar/) — статті *Modality*, *need*, *should*.
- 🟡 M. Swan — *Practical English Usage*: must have, should have, needn't have vs didn't need to.

> [!important] Підсумок
> - Модальне + **have + V3** — про минуле. Модальне не змінюється: *he must have*, не *has*.
> - Дедукція: **must have** (майже точно), **may / might / could have** (можливо), **can't / couldn't have** (точно ні).
> - Критика й жаль: **should(n't) have**, **could have** (була можливість), **would have** (хотів, але не вийшло).
> - **needn't have done** — зробив даремно; **didn't need to do** — потреби не було.
> - Вимова: *should've* /ˈʃʊd.əv/ — але пишемо **should have**, ніколи ~~*should of*~~.
