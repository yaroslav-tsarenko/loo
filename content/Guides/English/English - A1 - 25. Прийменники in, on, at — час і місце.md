---
title: Прийменники in, on, at — час і місце
order: 125
id: en-a1-prepositions
level: A1
icon: px:compass
tags: [english, a1, grammar, prepositions, time, place]
prerequisites: ["[[English - A1 - 12. Час, дні, місяці й дати]]", "[[English - A1 - 20. There is, there are — дім і кімнати]]"]
estimatedMinutes: 35
---

# Прийменники in, on, at — час і місце

> [!success] Після цієї теми ти зможеш
> - сказати, коли щось відбувається: *at 7 o'clock, on Monday, in May, in 2026*;
> - сказати, де щось є: *at the bus stop, on the table, in the kitchen*;
> - пояснити логіку «від точки до простору»: *at → on → in*;
> - обійтися без прийменника там, де він не потрібен: *next Monday, this morning, every day*.

## Передбач

> [!quiz] Як сказати «у понеділок»?
> level: A1 · id: en-a1-prepositions-q01
> - [ ] in Monday
> - [x] on Monday
> - [ ] at Monday
> - [ ] Monday in
>
> **Пояснення:** з днями тижня — ***on***: *on Monday, on Fridays*. Українське «у / в» перекладається то як *in*, то як *on*, то як *at* — і саме в цьому вся тема.

## Від точки до простору

Українське «в / у / на» не мапиться на англійські прийменники один до одного. Зате в англійських є проста логіка — **розмір**:

- ***at*** — **точка**: момент на годиннику, точка на мапі;
- ***on*** — **поверхня, лінія**: день у календарі, стіл, стіна;
- ***in*** — **простір, обʼєм**: місяць, рік, кімната, місто.

> [!diagram] at → on → in: від точки до простору
> ```yaml
> layout: flow
> nodes:
>   - { id: at, label: "точка", text: "at", note: "at 7 o'clock", tone: blue }
>   - { id: on, label: "поверхня / день", text: "on", note: "on Monday", tone: violet }
>   - { id: in, label: "простір / період", text: "in", note: "in May", tone: green }
> edges:
>   - { from: at, to: on, label: "більше" }
>   - { from: on, to: in, label: "ще більше" }
> steps:
>   - { focus: at, note: "at — точка. Момент на годиннику: at 7 o'clock, at midnight. Точка на мапі: at the bus stop." }
>   - { focus: on, note: "on — поверхня. День — «аркуш» календаря: on Monday, on 5 May. Предмет на поверхні: on the table." }
>   - { focus: in, note: "in — простір, у якому щось усередині. Довгі періоди: in May, in summer, in 2026. Обʼєм: in the box, in Kyiv." }
>   - { focus: [at, on, in], note: "Час: at 9 → on Friday → in June. Місце: at the door → on the wall → in the room. Чим більше — тим ближче до in." }
> ```

## Час

| Прийменник | Коли | Приклади |
|---|---|---|
| ***at*** | точний час, момент | *at 7 o'clock, at half past six, at midnight, at noon* |
| | частини доби й свята як «точки» | *at night, at the weekend* (US *on the weekend*), *at Christmas* |
| ***on*** | дні й дати | *on Monday, on Fridays, on 5 May, on my birthday, on New Year's Day* |
| | день + частина доби | *on Monday morning, on Saturday night* |
| ***in*** | місяці, роки, пори року, століття | *in May, in 2026, in summer, in the 21st century* |
| | частини доби | *in the morning, in the afternoon, in the evening* |

Зверни увагу на пару, що плутає всіх: ***in** the morning*, але ***at** night*. А *Monday morning* — уже день, тож *on Monday morning*.

### Коли прийменника немає взагалі

Перед ***this, next, last, every*** і словами *today, tomorrow, yesterday* прийменник **не ставимо**:

| Правильно | Неправильно |
|---|---|
| *See you **next Monday**.* | ~~on next Monday~~ |
| *I'm busy **this evening**.* | ~~in this evening~~ |
| *We meet **every Friday**.* | ~~on every Friday~~ |
| *I'm free **tomorrow**.* | ~~at tomorrow~~ |

> [!quiz] Перевір себе: «The lesson starts ___ 7 o'clock.»
> level: A1 · id: en-a1-prepositions-q02
> - [x] at
> - [ ] on
> - [ ] in
>
> **Пояснення:** точний час на годиннику — точка, тому *at*.

## Місце

| Прийменник | Коли | Приклади |
|---|---|---|
| ***at*** | точка, місце події чи діяльності | *at the bus stop, at the door, at the end of the street, at home, at work, at school, at a party* |
| ***on*** | поверхня, лінія | *on the table, on the wall, on the floor, on the second floor, on the left* |
| | громадський транспорт | *on the bus, on the train, on the plane* |
| ***in*** | всередині простору | *in the box, in the kitchen, in the car, in bed, in the middle* |
| | міста, країни, райони | *in London, in Ukraine, in the city centre, in the park* |

> [!diagram] Час і місце поруч
> ```yaml
> layout: compare
> columns: { time: "Час", place: "Місце" }
> nodes:
>   - { id: t1, col: time, label: "at — точка", text: "at 6:30 · at night", tone: blue }
>   - { id: t2, col: time, label: "on — день", text: "on Sunday · on 1 June", tone: violet }
>   - { id: t3, col: time, label: "in — період", text: "in July · in 2026 · in the morning", tone: green }
>   - { id: p1, col: place, label: "at — точка", text: "at the bus stop · at work", tone: blue }
>   - { id: p2, col: place, label: "on — поверхня", text: "on the table · on the bus", tone: violet }
>   - { id: p3, col: place, label: "in — всередині", text: "in the kitchen · in Lviv", tone: green }
> steps:
>   - { show: [t1, p1], note: "at — точка: момент на годиннику або точка на маршруті. Ти «в точці» на зупинці чи на роботі." }
>   - { show: [t2, p2], note: "on — поверхня: день у календарі, стіл, стіна. І громадський транспорт: on the bus — там можна стояти, як на платформі." }
>   - { show: [t3, p3], note: "in — простір навколо: довгий період або кімната, машина, місто." }
>   - { focus: [p2, p3], note: "Тонкий момент: on the bus / on the train, але in the car / in a taxi — у маленькому транспорті ти «всередині коробки»." }
> ```

***At home, at work, at school*** — без артикля. А «вдома» в значенні «в будинку» теж буває *in the house* — коли важливо, що саме всередині.

## Приклади

- I get up at seven in the morning. — Я встаю о сьомій ранку.
- The shop is closed on Sundays. — По неділях магазин зачинений.
- My birthday is in July, on the 14th. — Мій день народження в липні, чотирнадцятого.
- We usually go to the seaside in summer. — Улітку ми зазвичай їздимо на море.
- I can't sleep at night — it's too hot. — Не можу спати вночі — занадто спекотно.
- She's at work now. Call her in the evening. — Вона зараз на роботі. Подзвони їй увечері.
- Your phone is on the table in the kitchen. — Твій телефон на столі на кухні.
- I'm on the bus. I'll be there in ten minutes. — Я в автобусі. Буду за десять хвилин.
- The café is at the end of the street. — Кафе в кінці вулиці.
- See you next Friday! — Побачимося наступної пʼятниці!

## Слова

> [!word] at
> ipa: /æt/ · pos: prep · level: A1 · id: en-a1-prepositions-w01
> uk: о (годині); біля; на; в (точці)
> example: Let's meet **at** six **at** the station. — Зустріньмося о шостій на вокзалі.
> note: у реченні зазвичай слабке /ət/.

> [!word] on
> ipa: /ɒn/ · ipa-us: /ɑːn/ · pos: prep · level: A1 · id: en-a1-prepositions-w02
> uk: на (поверхні); у (день)
> example: The book is **on** the table. See you **on** Monday! — Книжка на столі. До понеділка!

> [!word] in
> ipa: /ɪn/ · pos: prep · level: A1 · id: en-a1-prepositions-w03
> uk: в, у (всередині; протягом періоду)
> example: I live **in** Kharkiv. My birthday is **in** March. — Я живу в Харкові. Мій день народження в березні.

> [!word] at work
> ipa: /ət ˈwɜːk/ · ipa-us: /ət ˈwɝːk/ · pos: phrase · level: A1 · id: en-a1-prepositions-w04
> uk: на роботі
> example: Dad is **at work** until six. — Тато на роботі до шостої.
> note: без артикля, як *at home, at school*.

> [!word] at night
> ipa: /ət ˈnaɪt/ · pos: phrase · level: A1 · id: en-a1-prepositions-w05
> uk: уночі; вночі
> example: I never drink coffee **at night**. — Я ніколи не пʼю каву вночі.
> note: але *in the morning, in the afternoon, in the evening*.

> [!word] at the weekend
> ipa: /ət ðə ˌwiːkˈend/ · pos: phrase · level: A1 · id: en-a1-prepositions-w06
> uk: у вихідні
> example: What do you do **at the weekend**? — Що ти робиш у вихідні?
> note: у США — *on the weekend* /ɑːn ðə ˈwiːkend/, з наголосом на першому складі.

> [!word] in the morning
> ipa: /ɪn ðə ˈmɔːnɪŋ/ · ipa-us: /ɪn ðə ˈmɔːrnɪŋ/ · pos: phrase · level: A1 · id: en-a1-prepositions-w07
> uk: уранці; вранці
> example: I go running **in the morning**. — Я бігаю вранці.
> note: «сьогодні вранці» — *this morning*, без *in*.

> [!word] in bed
> ipa: /ɪn ˈbed/ · pos: phrase · level: A1 · id: en-a1-prepositions-w08
> uk: у ліжку
> example: It's ten o'clock and you're still **in bed**! — Уже десята, а ти ще в ліжку!
> note: без артикля. *On the bed* — зверху на покривалі: *Your bag is on the bed.*

> [!word] on the bus
> ipa: /ɒn ðə ˈbʌs/ · ipa-us: /ɑːn ðə ˈbʌs/ · pos: phrase · level: A1 · id: en-a1-prepositions-w09
> uk: в автобусі
> example: I read books **on the bus**. — Я читаю книжки в автобусі.
> note: так само *on the train, on the plane*, але *in the car, in a taxi*.

> [!word] on holiday
> ipa: /ɒn ˈhɒlədeɪ/ · ipa-us: /ɑːn ˈhɑːlədeɪ/ · pos: phrase · level: A1 · id: en-a1-prepositions-w10
> uk: у відпустці; на відпочинку
> example: My boss is **on holiday** this week. — Мій начальник цього тижня у відпустці.
> note: у США — *on vacation*.

> [!word] in the middle
> ipa: /ɪn ðə ˈmɪdl/ · pos: phrase · level: A1 · id: en-a1-prepositions-w11
> uk: посередині; в центрі
> example: There's a big table **in the middle** of the room. — Посеред кімнати великий стіл.

> [!word] at the end
> ipa: /ət ði ˈend/ · pos: phrase · level: A1 · id: en-a1-prepositions-w12
> uk: у кінці; наприкінці
> example: The bank is **at the end** of the street. — Банк у кінці вулиці.
> note: перед голосним *the* звучить як /ði/.

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-prepositions-l01
> audio: The meeting is on Monday at ten.
> - [x] The meeting is on Monday at ten.
> - [ ] The meeting is on Sunday at ten.
> - [ ] The meeting is on Monday at two.

> [!listen] Надрукуй, що почуєш
> level: A1 · type: dictation · speed: slow · id: en-a1-prepositions-l02
> audio: My birthday is in May.

> [!listen] Надрукуй, що почуєш
> level: A1 · type: dictation · speed: slow · id: en-a1-prepositions-l03
> audio: She's at work at the moment.

> [!listen] Коли починається відпустка?
> level: A1 · type: answer · speed: slow · id: en-a1-prepositions-l04
> audio: Our holiday starts on the tenth of August. The train leaves at seven in the morning.
> - [x] Десятого серпня, поїзд о сьомій ранку
> - [ ] Сьомого серпня, поїзд о десятій ранку
> - [ ] Десятого серпня, поїзд о сьомій вечора

## Вимова

> [!speak] Скажи вголос
> level: A1 · id: en-a1-prepositions-s01
> text: I get up at seven in the morning.
> ipa: /aɪ ɡet ˈʌp ət ˈsevn ɪn ðə ˈmɔːnɪŋ/
> tip: прийменники слабкі й короткі: «ət», «ɪn». Наголос — на *up, seven, morning*.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-prepositions-s02
> text: See you on Monday!
> ipa: /ˈsiː juː ɒn ˈmʌndeɪ/
> tip: *Monday* — «МАН-дей», з /ʌ/, а не «мон».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-prepositions-s03
> text: My keys are on the table in the kitchen.
> ipa: /maɪ ˈkiːz ər ɒn ðə ˈteɪbl ɪn ðə ˈkɪtʃɪn/
> tip: *keys* — дзвінке /z/ у кінці: «кіːз». *On the* злито: «о-нðə».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-prepositions-s04
> text: I'm usually at home at the weekend.
> ipa: /aɪm ˈjuːʒuəli ət ˈhəʊm ət ðə ˌwiːkˈend/
> tip: два *at* — обидва слабкі «ət». *Weekend* у британській — з наголосом на *end*.

## Типові помилки українців

> [!pitfall] «In Monday», «at May» — одне «у» на всі випадки
> Українське «у понеділок, у травні, о сьомій» англійською — три різні прийменники: ***on** Monday, **in** May, **at** seven*. Перевір «розмір»: точка — *at*, день — *on*, період — *in*.

> [!pitfall] «On next week», «in this morning»
> Перед *next, last, this, every* прийменник не ставимо: *next week, this morning, every day, last Friday*.

> [!pitfall] «I'm at the bus» / «in the bus»
> У громадському транспорті — ***on***: *on the bus, on the train, on the plane*. У машині й таксі — ***in***: *in the car, in a taxi*.

> [!pitfall] «At the home», «in work», «in the bed»
> Сталі фрази без артикля: ***at home, at work, at school, in bed***. «Я в ліжку» — *I'm in bed*, а не ~~in the bed~~ (хіба що йдеться про конкретне ліжко).

## Практика

> [!quiz] «I was born ___ 2001.»
> level: A1 · id: en-a1-prepositions-q03
> - [ ] at
> - [ ] on
> - [x] in
>
> **Пояснення:** рік — довгий період, «простір», тому *in*: *in 2001, in 2026*.

> [!quiz] Як сказати «наступного понеділка»?
> level: A1 · id: en-a1-prepositions-q04
> - [x] next Monday
> - [ ] on next Monday
> - [ ] in next Monday
> - [ ] at next Monday
>
> **Пояснення:** з *next, last, this, every* прийменник не потрібен.

> [!quiz] Заповни пропуски: час
> level: A1 · type: fill · bank · id: en-a1-prepositions-q05
>
> ```text fill
> My birthday is [[in]] May, [[on]] the 12th.
> The party starts [[at]] 8 o'clock [[in]] the evening.
> ```
>
> **Пояснення:** місяць — *in*, дата — *on*, точна година — *at*, частина доби — *in the evening*.

> [!quiz] Заповни пропуски: місце
> level: A1 · type: fill · bank · id: en-a1-prepositions-q06
>
> ```text fill
> The keys are [[on]] the table.
> Mum is [[in]] the kitchen.
> Dad is [[at]] work.
> I'm waiting [[at]] the bus stop.
> ```
>
> **Пояснення:** на поверхні — *on*, всередині кімнати — *in*, сталі фрази й точки — *at work, at the bus stop*.

> [!quiz] Як сказати «Він ще в ліжку»?
> level: A1 · id: en-a1-prepositions-q07
> - [x] He's still in bed.
> - [ ] He's still on bed.
> - [ ] He's still at bed.
> - [ ] He's still into bed.
>
> **Пояснення:** стала фраза — *in bed*, без артикля.

> [!quiz] «Sorry, I can't talk — I'm ___ the train.»
> level: A1 · id: en-a1-prepositions-q08
> - [ ] in
> - [x] on
> - [ ] at
>
> **Пояснення:** громадський транспорт — *on*: *on the train, on the bus*.

> [!quiz] Склади речення: «Мій день народження в липні».
> level: A1 · type: order · id: en-a1-prepositions-q09
>
> ```text order
> My birthday
> is
> in
> July.
> on # ✗
> ```
>
> **Пояснення:** місяць — період, тому *in July*. А конкретна дата — *on 14 July*.

> [!quiz] Склади речення: «Ми живемо в квартирі на третьому поверсі».
> level: A1 · type: order · id: en-a1-prepositions-q10
>
> ```text order
> We
> live
> in a flat
> on the third floor.
> at the third floor. # ✗
> ```
>
> **Пояснення:** у квартирі — *in a flat* (простір), на поверсі — *on the third floor* (рівень, «поверхня»).

> [!quiz] Як сказати «вночі»?
> level: A1 · id: en-a1-prepositions-q11
> - [x] at night
> - [ ] on night
> - [ ] in night
> - [ ] at the night
>
> **Пояснення:** виняток, який треба просто запамʼятати: *in the morning, in the evening*, але *at night* — без артикля.

> [!quiz] Обери речення з правильним прийменником. Кілька відповідей
> level: A1 · type: multi · id: en-a1-prepositions-q12
> - [x] I'm at work.
> - [x] She's on holiday.
> - [ ] We met in Monday.
> - [x] The picture is on the wall.
> - [ ] He lives at London.
>
> **Пояснення:** день — *on Monday*; місто — *in London*. Решта правильні.

> [!quiz] Заповни пропуски
> level: A1 · type: fill · bank · id: en-a1-prepositions-q13
>
> ```text fill
> [[In]] the morning I'm [[at]] home, but [[in]] the afternoon I'm [[at]] work.
> ```
>
> **Пояснення:** частини дня — *in the morning / in the afternoon*; сталі фрази — *at home, at work*.

> [!quiz] Який варіант — американський?
> level: A1 · id: en-a1-prepositions-q14
> - [ ] at the weekend
> - [x] on the weekend
> - [ ] in the weekend
> - [ ] at weekend
>
> **Пояснення:** у Британії — *at the weekend*, у США — *on the weekend*. Решта — помилки.

## Фішки

> [!reel] 📍 Прийменник як GPS
> *At* — точка на мапі, *on* — поверхня, *in* — всередині. *I'm at the station* — я в цій точці маршруту. *I'm in the station* — я всередині будівлі вокзалу.

> [!reel] 🚌 On the bus, in the car
> Чому так? В автобусі можна встати й пройтися — ти ніби «на платформі». У легковику сидиш усередині «коробки». Тому *on the bus, on the train*, але *in the car, in a taxi*.

> [!reel] 🕛 Noon колись був о третій
> *Noon* (*at noon* — опівдні) походить від латинського *nona hora* — «девʼята година» від світанку, тобто близько 15:00. З часом «девʼята година» зʼїхала на полудень.

## Джерела та що почитати

- [Cambridge Dictionary — At, on and in (time)](https://dictionary.cambridge.org/grammar/british-grammar/at-in-and-on-time) — прийменники часу.
- [Cambridge Dictionary — At, on and in (place)](https://dictionary.cambridge.org/grammar/british-grammar/at-in-and-on-place) — прийменники місця.
- [Cambridge Dictionary — Prepositions](https://dictionary.cambridge.org/grammar/british-grammar/prepositions) — загальний огляд.
- [BBC Learning English](https://www.bbc.co.uk/learningenglish) — короткі уроки про *in / on / at*.
- R. Murphy — *Essential Grammar in Use*, розділи про *at / on / in* (час і місце).

> [!important] Підсумок
> - Логіка розміру: *at* — точка, *on* — поверхня / день, *in* — простір / період.
> - Час: *at 7, at night, at the weekend; on Monday, on 5 May; in May, in 2026, in summer, in the morning*.
> - Місце: *at the bus stop, at home, at work; on the table, on the wall, on the bus; in the room, in the car, in Kyiv, in bed*.
> - Без прийменника: *next / last / this / every…, today, tomorrow*.
