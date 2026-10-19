---
title: Час, дні, місяці й дати
order: 112
id: en-a1-time
level: A1
icon: px:clock
tags: [english, a1, vocabulary, time, days, months, dates]
prerequisites: ["[[English - A1 - 11. Have got — що в мене є]]"]
estimatedMinutes: 40
---

# Час, дні, місяці й дати

> [!success] Після цієї теми ти зможеш
> - спитати й сказати, котра година: *What time is it? — It's quarter to eight.*;
> - розрізняти *a.m.* і *p.m.*, *half past* і *quarter to*;
> - назвати дні тижня й місяці (з великої літери!);
> - вживати порядкові числівники: *first, second, third, twenty-first*;
> - читати й писати дати й роки: *the 5th of May, 2026 — twenty twenty-six*.

## Передбач

> [!quiz] Котра година, якщо британець каже «It's half past seven»?
> level: A1 · id: en-a1-time-q01
> - [ ] 6:30
> - [x] 7:30
> - [ ] 8:30
> - [ ] 7:15
>
> **Пояснення:** *half past seven* — дослівно «половина **після** сьомої», тобто 7:30. Українське «пів на восьму» — той самий час, але ми рахуємо до наступної години, а англійці — від попередньої. Тут легко заплутатися!

## Котра година?

Спитати можна двома способами: **What time is it?** або **What's the time?** Відповідь завжди починається з **It's…**

| Час | Класично | Цифрами (теж нормально) |
|---|---|---|
| 3:00 | It's three o'clock. | It's three. |
| 3:05 | It's five past three. | It's three oh five. |
| 3:15 | It's quarter past three. | It's three fifteen. |
| 3:30 | It's half past three. | It's three thirty. |
| 3:40 | It's twenty to four. | It's three forty. |
| 3:45 | It's quarter to four. | It's three forty-five. |
| 3:50 | It's ten to four. | It's three fifty. |

Логіка проста: перша половина години — **хвилини past (після) цієї години**, друга половина — **хвилини to (до) наступної**.

> [!diagram] Читаємо 7:45 по-британськи
> ```yaml
> layout: flow
> nodes:
>   - { id: clock, label: "годинник", text: "7:45", tone: blue, icon: "px:clock" }
>   - { id: half, label: "яка половина?", text: "?", tone: yellow }
>   - { id: mins, label: "скільки хвилин?", text: "?", tone: violet }
>   - { id: say, label: "кажемо", text: "?", tone: green }
> steps:
>   - { focus: clock, note: "Маємо 7:45. Спершу дивимося, в якій половині години стрілка." }
>   - { set: { half: "друга → to" }, focus: half, note: "45 хвилин — це друга половина (після :30). Отже, рахуємо до наступної години — to." }
>   - { set: { mins: "60 − 45 = 15" }, focus: mins, note: "До восьмої лишилося 15 хвилин. А 15 хвилин — це quarter (чверть)." }
>   - { set: { say: "quarter to eight" }, focus: say, note: "Разом: It's quarter to eight. Година — наступна, восьма!" }
>   - { set: { clock: "7:20", half: "перша → past", mins: "20", say: "twenty past seven" }, note: "А 7:20 — перша половина: twenty past seven (дослівно «двадцять після сьомої»), тобто двадцять хвилин на восьму." }
> ```

> [!tip] o'clock — лише рівно
> *O'clock* кажуть тільки про повну годину: *It's five o'clock*. «Five fifteen o'clock» — помилка. А *minutes* після чисел 5, 10, 20, 25 зазвичай пропускають: *ten past six*. З іншими числами — додають: *seven minutes past six*.

### a.m. і p.m.

У побуті англійці називають час у 12-годинному форматі. Щоб уточнити, яка половина доби:

| | Що означає | Приклад |
|---|---|---|
| **a.m.** | з півночі до полудня | 8 a.m. — 8 ранку |
| **p.m.** | з полудня до півночі | 8 p.m. — 8 вечора |
| **midday / noon** | 12:00 | at midday — опівдні |
| **midnight** | 00:00 | at midnight — опівночі |

У розмові частіше кажуть *in the morning / in the afternoon / in the evening / at night*: *at seven in the evening*. 24-годинний формат (*eighteen thirty*) трапляється здебільшого в розкладах потягів і літаків.

Про конкретний час — прийменник **at**: *The film starts **at** 8 p.m. I get up **at** half past six.*

## Дні тижня

Дні тижня **завжди з великої літери** і з прийменником **on**: *on Monday, on Fridays* (щопʼятниці).

| День | Переклад | Скорочення |
|---|---|---|
| Monday | понеділок | Mon |
| Tuesday | вівторок | Tue |
| Wednesday | середа | Wed |
| Thursday | четвер | Thu |
| Friday | пʼятниця | Fri |
| Saturday | субота | Sat |
| Sunday | неділя | Sun |

*Saturday* і *Sunday* разом — **the weekend** (UK: *at the weekend*, US: *on the weekend*). Решта днів — *weekdays* (будні).

> [!warning] Wednesday читається «венздей»
> У *Wednesday* /ˈwenzdeɪ/ перше *d* не читається. А *Tuesday* /ˈtjuːzdeɪ/ і *Thursday* /ˈθɜːzdeɪ/ легко сплутати на слух: у *Thursday* — /θ/ і довге /ɜː/.

## Місяці

Теж **з великої літери**, з прийменником **in**: *in May, in December*.

| | | | |
|---|---|---|---|
| January — січень | February — лютий | March — березень | April — квітень |
| May — травень | June — червень | July — липень | August — серпень |
| September — вересень | October — жовтень | November — листопад | December — грудень |

## Порядкові числівники: first, second, third…

Для дат, поверхів і рейтингів потрібні порядкові числівники. Більшість — це звичайний числівник + **-th**:

| | | | |
|---|---|---|---|
| 1st **first** | 2nd **second** | 3rd **third** | 4th fourth |
| 5th **fifth** | 6th sixth | 7th seventh | 8th **eighth** |
| 9th **ninth** | 10th tenth | 12th **twelfth** | 13th thirteenth |
| 20th **twentieth** | 21st twenty-first | 22nd twenty-second | 31st thirty-first |

- Виділені — особливі: *first, second, third* — окремі слова, а в інших змінюється написання: *five → fifth, eight → eighth, nine → ninth, twelve → twelfth, twenty → twentieth*.
- У складених змінюється лише остання частина: *twenty-**first**, thirty-**second***.
- У скороченні до цифри додають дві останні літери слова: 1**st**, 2**nd**, 3**rd**, 4**th**.

## Дати

| | Пишемо | Кажемо |
|---|---|---|
| UK | 5 May 2026 / 5th May 2026 | the fifth of May, twenty twenty-six |
| US | May 5, 2026 | May fifth, twenty twenty-six |
| питання | — | What's the date today? — It's the third of March. |
| день народження | — | When's your birthday? — It's on the 21st of July. |

> [!diagram] 05/06/2026 — коли це?
> ```yaml
> layout: compare
> columns: { uk: "Велика Британія, Україна", us: "США" }
> nodes:
>   - { id: u1, col: uk, label: "запис", text: "05/06/2026", tone: blue }
>   - { id: u2, col: uk, label: "порядок", text: "день / місяць / рік", tone: violet }
>   - { id: u3, col: uk, label: "дата", text: "?", tone: green }
>   - { id: s1, col: us, label: "запис", text: "05/06/2026", tone: blue }
>   - { id: s2, col: us, label: "порядок", text: "місяць / день / рік", tone: violet }
>   - { id: s3, col: us, label: "дата", text: "?", tone: green }
> steps:
>   - { focus: [u1, s1], note: "Однаковий запис цифрами. Але читають його по-різному!" }
>   - { focus: [u2, s2], note: "У Британії (як і в Україні) спершу день, потім місяць. У США — спершу місяць." }
>   - { set: { u3: "the 5th of June" }, focus: u3, note: "Британець прочитає це як 5 червня." }
>   - { set: { s3: "May 6th" }, focus: s3, note: "Американець — 6 травня. Різниця — цілий місяць! Для квитків і віз пиши місяць словом: 5 June 2026." }
> ```

### Роки

| Рік | Кажемо |
|---|---|
| 1991 | nineteen ninety-one |
| 1900 | nineteen hundred |
| 2000 | two thousand |
| 2008 | two thousand and eight |
| 2026 | twenty twenty-six (або two thousand and twenty-six) |

Роки до 2000 і після 2010 зазвичай ділять на дві пари цифр: *19 | 91 → nineteen ninety-one*, *20 | 26 → twenty twenty-six*.

## Приклади

- What time is it? — It's ten past nine. — Котра година? — Десять хвилин на десяту.
- The shop opens at 9 a.m. and closes at 6 p.m. — Магазин відчиняється о 9 ранку й зачиняється о 6 вечора.
- My English class is on Tuesday and Thursday. — Заняття з англійської в мене у вівторок і четвер.
- We go to the sea in August. — Ми їздимо на море в серпні.
- My birthday is on the twelfth of October. — У мене день народження дванадцятого жовтня.
- What's the date today? — It's the first of September. — Яке сьогодні число? — Перше вересня.
- I was born in nineteen ninety-eight. — Я народився в тисяча девʼятсот девʼяносто восьмому році.
- See you tomorrow at half past five! — До завтра, о пів на шосту!
- The office is on the third floor. — Офіс на третьому поверсі.

## Слова

### Час

> [!word] time
> ipa: /taɪm/ · pos: noun · level: A1 · id: en-a1-time-w01
> uk: час; раз
> example: What **time** is it? — Котра година?

> [!word] What time is it?
> ipa: /ˌwɒt ˈtaɪm ɪz ɪt/ · ipa-us: /ˌwʌt ˈtaɪm ɪz ɪt/ · pos: phrase · level: A1 · id: en-a1-time-w02
> uk: котра година?
> example: Excuse me, **what time is it**? — It's two o'clock. — Перепрошую, котра година? — Друга.
> note: також What's the time?

> [!word] o'clock
> ipa: /əˈklɒk/ · ipa-us: /əˈklɑːk/ · pos: adv · level: A1 · id: en-a1-time-w03
> uk: рівно (про повну годину)
> example: The train leaves at six **o'clock**. — Потяг відходить рівно о шостій.

> [!word] half past
> ipa: /ˌhɑːf ˈpɑːst/ · ipa-us: /ˌhæf ˈpæst/ · pos: phrase · level: A1 · id: en-a1-time-w04
> uk: пів на (наступну годину); … тридцять
> example: It's **half past** seven. — Пів на восьму (7:30).
> note: half past seven = 7:30, а не 6:30! Розмовне UK half seven = 7:30.

> [!word] quarter
> ipa: /ˈkwɔːtə/ · ipa-us: /ˈkwɔːrt̬ər/ · pos: noun · level: A1 · id: en-a1-time-w05
> uk: чверть; 15 хвилин
> example: It's **quarter** to ten. — За чверть десята (9:45).
> note: UK quarter to / past; US часто a quarter of / after.

> [!word] minute
> ipa: /ˈmɪnɪt/ · pos: noun · level: A1 · id: en-a1-time-w06
> uk: хвилина
> example: Wait a **minute**, please. — Зачекай хвилинку, будь ласка.

> [!word] clock
> ipa: /klɒk/ · ipa-us: /klɑːk/ · pos: noun · level: A1 · id: en-a1-time-w07
> uk: годинник (настінний, будильник)
> example: The **clock** in the kitchen is slow. — Годинник на кухні відстає.
> note: наручний — watch; будильник — alarm clock.

> [!word] midday
> ipa: /ˌmɪdˈdeɪ/ · pos: noun · level: A1 · id: en-a1-time-w08
> uk: полудень
> example: We have lunch at **midday**. — Ми обідаємо опівдні.
> note: синонім — noon.

> [!word] midnight
> ipa: /ˈmɪdnaɪt/ · pos: noun · level: A1 · id: en-a1-time-w09
> uk: північ (00:00)
> example: The party ends at **midnight**. — Вечірка закінчується опівночі.

> [!word] today
> ipa: /təˈdeɪ/ · pos: adv · level: A1 · id: en-a1-time-w10
> uk: сьогодні
> example: What's the date **today**? — Яке сьогодні число?

> [!word] tomorrow
> ipa: /təˈmɒrəʊ/ · ipa-us: /təˈmɑːroʊ/ · pos: adv · level: A1 · id: en-a1-time-w11
> uk: завтра
> example: See you **tomorrow**! — До завтра!

> [!word] week
> ipa: /wiːk/ · pos: noun · level: A1 · id: en-a1-time-w12
> uk: тиждень
> example: I go swimming twice a **week**. — Я ходжу плавати двічі на тиждень.

> [!word] weekend
> ipa: /ˌwiːkˈend/ · ipa-us: /ˈwiːkend/ · pos: noun · level: A1 · id: en-a1-time-w13
> uk: вихідні (субота й неділя)
> example: What are your plans for the **weekend**? — Які плани на вихідні?
> note: UK at the weekend; US on the weekend.

> [!word] month
> ipa: /mʌnθ/ · pos: noun · level: A1 · id: en-a1-time-w14
> uk: місяць (календарний)
> example: There are twelve **months** in a year. — У році дванадцять місяців.
> note: місяць на небі — the moon.

> [!word] date
> ipa: /deɪt/ · pos: noun · level: A1 · id: en-a1-time-w15
> uk: дата; число; побачення
> example: What's the **date** today? — Яке сьогодні число?

> [!word] birthday
> ipa: /ˈbɜːθdeɪ/ · ipa-us: /ˈbɝːθdeɪ/ · pos: noun · level: A1 · id: en-a1-time-w16
> uk: день народження
> example: Happy **birthday**! — З днем народження!

### Порядкові числівники

> [!word] first
> ipa: /fɜːst/ · ipa-us: /fɝːst/ · pos: adj · level: A1 · id: en-a1-time-w17
> uk: перший
> example: It's the **first** of January. — Перше січня.

> [!word] second
> ipa: /ˈsekənd/ · pos: adj · level: A1 · id: en-a1-time-w18
> uk: другий; (іменник) секунда
> example: My flat is on the **second** floor. — Моя квартира на другому поверсі.
> note: так рахують у США. У Британії перший поверх — ground floor, тож second floor — це наш третій.

> [!word] third
> ipa: /θɜːd/ · ipa-us: /θɝːd/ · pos: adj · level: A1 · id: en-a1-time-w19
> uk: третій
> example: Today is the **third** of May. — Сьогодні третє травня.

### Дні тижня

> [!word] Monday
> ipa: /ˈmʌndeɪ/ · pos: noun · level: A1 · id: en-a1-time-w20
> uk: понеділок
> example: I start work on **Monday**. — Я починаю роботу в понеділок.

> [!word] Tuesday
> ipa: /ˈtjuːzdeɪ/ · ipa-us: /ˈtuːzdeɪ/ · pos: noun · level: A1 · id: en-a1-time-w21
> uk: вівторок
> example: The meeting is on **Tuesday**. — Нарада у вівторок.

> [!word] Wednesday
> ipa: /ˈwenzdeɪ/ · pos: noun · level: A1 · id: en-a1-time-w22
> uk: середа
> example: We have football on **Wednesdays**. — У нас футбол по середах.
> note: перше d не читається: «венздей».

> [!word] Thursday
> ipa: /ˈθɜːzdeɪ/ · ipa-us: /ˈθɝːzdeɪ/ · pos: noun · level: A1 · id: en-a1-time-w23
> uk: четвер
> example: See you on **Thursday**. — Побачимося в четвер.

> [!word] Friday
> ipa: /ˈfraɪdeɪ/ · pos: noun · level: A1 · id: en-a1-time-w24
> uk: пʼятниця
> example: **Friday** is my favourite day. — Пʼятниця — мій улюблений день.

> [!word] Saturday
> ipa: /ˈsætədeɪ/ · ipa-us: /ˈsæt̬ərdeɪ/ · pos: noun · level: A1 · id: en-a1-time-w25
> uk: субота
> example: The shops are busy on **Saturday**. — У суботу в магазинах багато людей.

> [!word] Sunday
> ipa: /ˈsʌndeɪ/ · pos: noun · level: A1 · id: en-a1-time-w26
> uk: неділя
> example: On **Sunday** we visit my grandparents. — У неділю ми їздимо до бабусі й дідуся.

### Місяці

> [!word] January
> ipa: /ˈdʒænjuəri/ · ipa-us: /ˈdʒænjueri/ · pos: noun · level: A1 · id: en-a1-time-w27
> uk: січень
> example: It's very cold in **January**. — У січні дуже холодно.

> [!word] February
> ipa: /ˈfebruəri/ · ipa-us: /ˈfebrueri/ · pos: noun · level: A1 · id: en-a1-time-w28
> uk: лютий
> example: **February** is the shortest month. — Лютий — найкоротший місяць.
> note: багато носіїв кажуть /ˈfebjuəri/, «фебʼюері».

> [!word] March
> ipa: /mɑːtʃ/ · ipa-us: /mɑːrtʃ/ · pos: noun · level: A1 · id: en-a1-time-w29
> uk: березень
> example: Spring starts in **March**. — Весна починається в березні.

> [!word] April
> ipa: /ˈeɪprəl/ · pos: noun · level: A1 · id: en-a1-time-w30
> uk: квітень
> example: My birthday is in **April**. — У мене день народження у квітні.

> [!word] May
> ipa: /meɪ/ · pos: noun · level: A1 · id: en-a1-time-w31
> uk: травень
> example: The exam is on the 20th of **May**. — Іспит 20 травня.

> [!word] June
> ipa: /dʒuːn/ · pos: noun · level: A1 · id: en-a1-time-w32
> uk: червень
> example: School finishes in **June**. — Навчання в школі закінчується в червні.

> [!word] July
> ipa: /dʒuˈlaɪ/ · pos: noun · level: A1 · id: en-a1-time-w33
> uk: липень
> example: We go to the sea in **July**. — У липні ми їдемо на море.
> note: наголос на другому складі: ju-LY.

> [!word] August
> ipa: /ˈɔːɡəst/ · ipa-us: /ˈɑːɡəst/ · pos: noun · level: A1 · id: en-a1-time-w34
> uk: серпень
> example: Ukraine's Independence Day is on the 24th of **August**. — День Незалежності України — 24 серпня.

> [!word] September
> ipa: /sepˈtembə/ · ipa-us: /sepˈtembər/ · pos: noun · level: A1 · id: en-a1-time-w35
> uk: вересень
> example: The school year starts in **September**. — Навчальний рік починається у вересні.

> [!word] October
> ipa: /ɒkˈtəʊbə/ · ipa-us: /ɑːkˈtoʊbər/ · pos: noun · level: A1 · id: en-a1-time-w36
> uk: жовтень
> example: It often rains in **October**. — У жовтні часто йде дощ.

> [!word] November
> ipa: /nəʊˈvembə/ · ipa-us: /noʊˈvembər/ · pos: noun · level: A1 · id: en-a1-time-w37
> uk: листопад
> example: My sister was born in **November**. — Моя сестра народилася в листопаді.

> [!word] December
> ipa: /dɪˈsembə/ · ipa-us: /dɪˈsembər/ · pos: noun · level: A1 · id: en-a1-time-w38
> uk: грудень
> example: Christmas is in **December**. — Різдво в грудні.

### Ще

> [!word] a.m.
> ipa: /ˌeɪ ˈem/ · pos: adv · level: A1 · id: en-a1-time-w39
> uk: до полудня; ранку
> example: The museum opens at 10 **a.m.** — Музей відчиняється о 10 ранку.

> [!word] p.m.
> ipa: /ˌpiː ˈem/ · pos: adv · level: A1 · id: en-a1-time-w40
> uk: після полудня; дня; вечора
> example: The film starts at 7 **p.m.** — Фільм починається о 7 вечора.

## Слухаємо

> [!listen] Котра година?
> level: A1 · type: choice · speed: slow · id: en-a1-time-l01
> audio: It's quarter past six.
> - [ ] 5:45
> - [x] 6:15
> - [ ] 6:45

> [!listen] Котра година?
> level: A1 · type: choice · speed: slow · id: en-a1-time-l02
> audio: It's twenty to nine.
> - [ ] 9:20
> - [ ] 8:20
> - [x] 8:40

> [!listen] Котра година?
> level: A1 · type: choice · speed: slow · id: en-a1-time-l03
> audio: It's half past eleven.
> - [x] 11:30
> - [ ] 10:30
> - [ ] 11:15

> [!listen] Який день?
> level: A1 · type: choice · speed: slow · id: en-a1-time-l04
> audio: The dentist is on Thursday.
> - [ ] у вівторок
> - [x] у четвер
> - [ ] у пʼятницю

> [!listen] Яка дата?
> level: A1 · type: choice · speed: slow · id: en-a1-time-l05
> audio: It's the twenty-second of February.
> - [x] 22 лютого
> - [ ] 2 лютого
> - [ ] 22 листопада

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: en-a1-time-l06
> audio: What time is it?

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: en-a1-time-l07
> audio: My birthday is in June.

> [!listen] Послухай. Коли й о котрій зустріч?
> level: A1 · type: answer · speed: slow · id: en-a1-time-l08
> audio: A: When's the meeting?
> audio: B: It's on Wednesday, the ninth of March.
> audio: A: What time?
> audio: B: At quarter to three in the afternoon.
> - [x] у середу 9 березня о 14:45
> - [ ] у середу 9 травня о 15:15
> - [ ] у вівторок 19 березня о 14:45

## Вимова

> [!pair] Tuesday /ˈtjuːzdeɪ/ — Thursday /ˈθɜːzdeɪ/
> level: A1 · id: en-a1-time-p01
> say: Thursday
> tip: Tuesday — «тʼюзд-ей», Thursday — /θ/ (язик між зубами) і довге /ɜː/.

> [!pair] fourteenth /ˌfɔːˈtiːnθ/ — fortieth /ˈfɔːtiəθ/
> level: A1 · id: en-a1-time-p02
> say: fourteenth
> tip: як і в кількісних числівниках (fourteen — forty), -teenth наголошене й довге, а -tieth — коротке з наголосом на початку.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-time-s01
> text: It's quarter to eight.
> ipa: /ɪts ˈkwɔːtə tu ˈeɪt/
> tip: quarter — «кво-оте», w після k. Наголос на числі: EIGHT.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-time-s02
> text: Wednesday, Thursday, Saturday
> ipa: /ˈwenzdeɪ ˈθɜːzdeɪ ˈsætədeɪ/
> tip: Wednesday — без першого d; Saturday — широке /æ/ на початку.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-time-s03
> text: the first, the second, the third
> ipa: /ðə ˈfɜːst ðə ˈsekənd ðə ˈθɜːd/
> tip: first і third — однаковий звук /ɜː/, як «йо» без «й»; third — з /θ/.

> [!speak] Скажи дату
> level: A1 · id: en-a1-time-s04
> text: It's the twenty-first of July.
> ipa: /ɪts ðə ˌtwenti ˈfɜːst əv dʒuˈlaɪ/
> tip: of тут слабке /əv/; у July наголос на останньому складі.

> [!speak] Скажи рік
> level: A1 · id: en-a1-time-s05
> text: twenty twenty-six
> ipa: /ˌtwenti ˌtwenti ˈsɪks/
> tip: рік ділимо навпіл: 20 | 26.

## Типові помилки українців

> [!pitfall] «Half eight» — це 8:30, а не «пів на восьму»
> Українці рахують до наступної години («пів на восьму» = 7:30), британці — від попередньої: **half past seven** = 7:30. Розмовне британське *half eight* = **8:30**. Неправильно зрозумієш — запізнишся на годину.

> [!pitfall] monday, june — з маленької
> В англійській дні тижня й місяці — **завжди з великої**: *Monday, June*. Українська звичка писати їх з маленької дає помилку в кожному листі.

> [!pitfall] «in Monday», «on May»
> День — **on** (*on Monday, on the 5th of May*), місяць і рік — **in** (*in May, in 2026*), точний час — **at** (*at 6 p.m.*). Детально — у [[English - A1 - 25. Прийменники in, on, at — час і місце]].

## Ситуація: запис до перукаря

> [!listen] Телефонна розмова з салоном
> level: A1 · type: choice · speed: slow · id: en-a1-time-l09
> audio: A: Good morning, Style Studio.
> audio: B: Hi, can I come on Friday?
> audio: A: Friday the fourteenth? Yes. Is half past four OK?
> audio: B: Half past four? Perfect. Thank you!
> - [x] пʼятниця, 14-те, 16:30
> - [ ] пʼятниця, 4-те, 14:30
> - [ ] четвер, 14-те, 16:30

Підтверди запис уголос.

> [!speak] «О пів на пʼяту в пʼятницю? Чудово!»
> level: A1 · id: en-a1-time-s06
> text: Half past four on Friday? Perfect!
> ipa: /ˌhɑːf pɑːst ˈfɔːr ɒn ˈfraɪdeɪ ˈpɜːfɪkt/
> tip: у half l не читається: «га-аф» з видихом /h/.

## Практика

> [!quiz] Як по-британськи сказати 9:45?
> level: A1 · id: en-a1-time-q02
> - [ ] quarter past nine
> - [x] quarter to ten
> - [ ] quarter to nine
> - [ ] forty-five past nine
>
> **Пояснення:** друга половина години → *to* + наступна година: до десятої лишилася чверть.

> [!quiz] Твій потяг відходить о «8 p.m.». Коли це?
> level: A1 · id: en-a1-time-q03
> - [ ] о 8 ранку
> - [x] о 20:00
> - [ ] о 8 після опівночі
>
> **Пояснення:** *p.m.* — після полудня: 8 p.m. = 20:00.

> [!quiz] Обери всі правильно написані речення
> level: A1 · type: multi · id: en-a1-time-q04
> - [x] My birthday is on the 3rd of March.
> - [ ] The concert is on july 5th.
> - [x] I'm free on Saturday.
> - [ ] It's six o'clock and ten minutes.
>
> **Пояснення:** місяці й дні — з великої (*July*). 6:10 — *ten past six*; *o'clock* — лише рівно.

> [!quiz] Який порядковий числівник написано правильно?
> level: A1 · id: en-a1-time-q05
> - [ ] fiveth
> - [ ] nineth
> - [x] twelfth
> - [ ] twentyth
>
> **Пояснення:** *fifth, ninth, twelfth, twentieth* — особливе написання.

> [!quiz] Заповни пропуски: котра година
> level: A1 · type: fill · bank · id: en-a1-time-q06
>
> ```text fill
> 4:30 — It's half [[past]] four.
> 4:45 — It's quarter [[to]] five.
> 5:00 — It's five [[o'clock]].
> 5:10 — It's ten past [[five]].
> ```
>
> **Пояснення:** перша половина — *past*, друга — *to* наступної; рівно — *o'clock*.

> [!quiz] Заповни пропуски: порядкові числа
> level: A1 · type: fill · id: en-a1-time-q07
>
> ```text fill
> 1st = [[first]]
> 2nd = [[second]]
> 3rd = [[third]]
> 21st = twenty-[[first]]
> ```
>
> **Пояснення:** у складених числах змінюється лише остання частина: *twenty-first*.

> [!quiz] Склади питання: «Коли твій день народження?»
> level: A1 · type: order · id: en-a1-time-q08
>
> ```text order
> When
> is
> your
> birthday?
> ```
>
> **Пояснення:** *When + is + your birthday?* У розмові — *When's your birthday?*

> [!quiz] Склади відповідь: «Сьогодні пʼяте травня»
> level: A1 · type: order · id: en-a1-time-q09
>
> ```text order
> It's
> the
> fifth
> of
> May.
> five // ✗
> ```
>
> **Пояснення:** дату кажемо порядковим числом: *the fifth of May* (UK) або *May fifth* (US).

> [!quiz] Американець пише 04/07/2026. Яка це дата?
> level: A1 · id: en-a1-time-q10
> - [ ] 4 липня 2026
> - [x] 7 квітня 2026
> - [ ] 7 серпня 2026
>
> **Пояснення:** у США спершу місяць: 04 — квітень (April), 07 — день. Британець прочитав би 4 липня.

## Фішки

> [!reel] 🌙 Monday — день Місяця
> *Monday* — *Moon day*, *Sunday* — *Sun day*, *Saturday* — день Сатурна. А *Tuesday, Wednesday, Thursday, Friday* названі на честь скандинавських богів: Тюра, Одіна (Woden), Тора й Фрігг.

> [!reel] 📅 Чому September — «сьомий»
> *Septem* латиною — сім, *octo* — вісім, *novem* — девʼять, *decem* — десять. У давньому римському календарі рік починався з березня, тож вересень справді був сьомим.

> [!reel] ⏰ Звідки o'clock
> *O'clock* — скорочення від *of the clock*, «за годинником». Колись так відрізняли час на годиннику від часу «за сонцем».

## Джерела та що почитати

- [British Council LearnEnglish](https://learnenglish.britishcouncil.org/) — вправи *Telling the time* і *Dates*.
- [Cambridge Dictionary — English Grammar Today](https://dictionary.cambridge.org/grammar/british-grammar/) — статті *Dates* і *Time*.
- [BBC Learning English](https://www.bbc.co.uk/learningenglish/) — уроки для початківців про час і дати.

> [!important] Підсумок
> - *What time is it? — It's…*: перша половина години — *past*, друга — *to* наступної; рівно — *o'clock*.
> - *Half past seven* = 7:30; *a.m.* — до полудня, *p.m.* — після.
> - Дні й місяці — з великої літери; *on Monday*, *in May*, *at 6 p.m.*
> - Порядкові: *first, second, third, fifth, ninth, twelfth, twentieth, twenty-first*.
> - Дати: UK *the 5th of May*, US *May 5th*; роки — парами: *twenty twenty-six*.
