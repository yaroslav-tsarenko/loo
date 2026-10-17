---
title: Present Simple — стверджувальні речення
order: 114
id: en-a1-present-simple
level: A1
icon: px:repeat
tags: [english, a1, grammar, present-simple, tenses]
prerequisites: ["[[English - A1 - 13. Аудіювання — імена, числа, ціни й час]]"]
estimatedMinutes: 40
---

# Present Simple — стверджувальні речення

> [!success] Після цієї теми ти зможеш
> - розповідати про звички, розклад і факти: *I work in IT. She drinks tea every morning.*;
> - не забувати **-s** після *he / she / it*: *he works, she lives*;
> - правильно писати *goes, watches, studies, plays, has*;
> - вживати маркери часу: *every day, usually, on Mondays, at weekends*.

## Передбач

> [!quiz] Яке речення правильне?
> level: A1 · id: en-a1-present-simple-q01
> - [ ] My sister work in a bank.
> - [ ] My sister is work in a bank.
> - [x] My sister works in a bank.
> - [ ] My sister working in a bank.
>
> **Пояснення:** про постійну роботу — Present Simple. *My sister* = *she*, а після *he / she / it* дієслово отримує **-s**: *works*. Ні *is*, ні *-ing* тут не потрібні.

## Коли вживаємо Present Simple

Present Simple — час для того, що **буває регулярно або є правдою завжди**, а не для того, що відбувається просто зараз.

| Що | Приклад | Переклад |
|---|---|---|
| звички й рутина | I **drink** coffee every morning. | Я щоранку пʼю каву. |
| постійні стани | We **live** in Odesa. | Ми живемо в Одесі. |
| робота, навчання | She **studies** law. | Вона вивчає право. |
| факти й загальні істини | Water **boils** at 100 °C. | Вода кипить за 100 °C. |
| смаки й почуття | He **loves** jazz. | Він обожнює джаз. |

> [!diagram] Present Simple: одна дія — багато разів
> ```yaml
> layout: timeline
> nodes:
>   - { id: past, at: "минулий тиждень", label: "щопонеділка", text: "I go to the gym.", tone: gray }
>   - { id: now, at: "цей тиждень", label: "щопонеділка", text: "I go to the gym.", tone: blue }
>   - { id: next, at: "наступний тиждень", label: "щопонеділка", text: "I go to the gym.", tone: gray }
>   - { id: rule, at: "отже", label: "звичка", text: "I go to the gym on Mondays.", tone: green, icon: "px:repeat" }
> steps:
>   - { show: past, note: "Минулого понеділка я ходив у спортзал." }
>   - { show: now, note: "Цього понеділка — теж. Дія повторюється." }
>   - { show: next, note: "І наступного піду. Це не одна подія, а частина мого життя." }
>   - { show: rule, note: "Повторюване, звичне, постійне — це Present Simple: I go to the gym on Mondays." }
> ```

> [!warning] «Я читаю» — це звичка чи зараз?
> Українське «я читаю» може означати і «я взагалі читаю книжки», і «я зараз читаю». В англійській це **два різні часи**: звичка — *I read a lot* (Present Simple), зараз — *I'm reading* (Present Continuous, тема [[English - A1 - 26. Present Continuous — що відбувається зараз]]).

## Форма: base form і -s

Добра новина: у Present Simple дієслово майже не змінюється. Беремо **початкову форму** (як у словнику) — і лише для **he / she / it** додаємо **-s**.

| Підмет | Дієслово | Приклад |
|---|---|---|
| I | work | I work in IT. |
| you | work | You work hard. |
| we | work | We work from home. |
| they | work | They work at a hospital. |
| **he / she / it** | **works** | He work**s** in a café. |

> [!diagram] Хто отримує -s
> ```yaml
> layout: compare
> columns: { base: "I, you, we, they", s: "he, she, it (і одне імʼя)" }
> nodes:
>   - { id: b1, col: base, label: "підмет", text: "My parents", tone: blue }
>   - { id: b2, col: base, label: "дієслово", text: "live", tone: violet }
>   - { id: b3, col: base, label: "решта", text: "in Kyiv.", tone: gray }
>   - { id: s1, col: s, label: "підмет", text: "My sister", tone: blue }
>   - { id: s2, col: s, label: "дієслово", text: "live", tone: violet }
>   - { id: s3, col: s, label: "решта", text: "in Lviv.", tone: gray }
> steps:
>   - { focus: [b1, s1], note: "Спершу питаємо: хто підмет? My parents = they. My sister = she." }
>   - { focus: b2, note: "they → початкова форма без змін: My parents live in Kyiv." }
>   - { set: { s2: "lives" }, focus: s2, note: "she → додаємо -s: My sister lives in Lviv. Це те «s», яке найчастіше забувають." }
>   - { set: { s1: "Tom / the cat / it", s2: "likes", s3: "fish." }, note: "Будь-яка одна людина, тварина чи річ = he / she / it → -s: The cat likes fish." }
> ```

## Правопис -s, -es, -ies

| Правило | Приклади |
|---|---|
| більшість дієслів: **+ s** | work → works, live → lives, play → plays, love → loves |
| -s, -ss, -sh, -ch, -x, -o: **+ es** | miss → misses, wash → washes, watch → watches, fix → fixes, go → goes, do → does |
| приголосний + y: **y → ies** | study → studies, try → tries, cry → cries |
| голосний + y: **+ s** | play → plays, stay → stays, say → says |
| неправильне | have → **has** |

> [!tip] Вимова -s
> Закінчення звучить трьома способами: /s/ — *works, likes*; /z/ — *lives, plays*; /ɪz/ — *watches, washes*. Окремо запамʼятай: *does* /dʌz/, *says* /sez/, *goes* /ɡəʊz/. Детально — у [[English - A1 - 23. Кінцеві приголосні й закінчення -s]].

## Маркери часу

Слова, що «підказують» Present Simple:

| Маркер | Де стоїть | Приклад |
|---|---|---|
| every day / week / year | у кінці | I call my mum **every day**. |
| on Mondays, at weekends | у кінці | We play football **on Sundays**. |
| in the morning / evening | у кінці | She reads **in the evening**. |
| once / twice a week | у кінці | He goes swimming **twice a week**. |
| always, usually, often, sometimes, never | **перед** дієсловом | I **usually** get up at seven. |

Прислівники частоти (*always, usually, never…*) детально розбираємо в темі [[English - A1 - 16. Розпорядок дня і прислівники частоти]].

## Приклади

- I live in Kharkiv and work as a designer. — Я живу в Харкові й працюю дизайнером.
- My brother studies medicine. — Мій брат вивчає медицину.
- She goes to bed at eleven every night. — Вона щовечора лягає спати об одинадцятій.
- They have two dogs. — У них дві собаки.
- Our shop opens at nine and closes at six. — Наш магазин відчиняється о девʼятій і зачиняється о шостій.
- My dad watches the news every evening. — Тато щовечора дивиться новини.
- The baby cries a lot at night. — Малюк багато плаче вночі.
- Cats sleep about fifteen hours a day. — Коти сплять близько пʼятнадцяти годин на добу.
- He tries to speak English every day. — Він намагається говорити англійською щодня.
- I agree with you. — Я з тобою згоден.

## Слова

> [!word] live
> ipa: /lɪv/ · pos: verb · level: A1 · id: en-a1-present-simple-w01
> uk: жити; мешкати
> example: She **lives** near the station. — Вона живе біля вокзалу.
> note: дієслово live — коротке /ɪ/; прикметник live («наживо») — /laɪv/.

> [!word] work
> ipa: /wɜːk/ · ipa-us: /wɝːk/ · pos: verb · level: A1 · id: en-a1-present-simple-w02
> uk: працювати
> example: My mum **works** at a school. — Моя мама працює в школі.

> [!word] study
> ipa: /ˈstʌdi/ · pos: verb · level: A1 · id: en-a1-present-simple-w03
> uk: вчитися; вивчати
> example: He **studies** at university. — Він навчається в університеті.
> forms: study → studies

> [!word] like
> ipa: /laɪk/ · pos: verb · level: A1 · id: en-a1-present-simple-w04
> uk: подобатися; любити
> example: I **like** pizza. — Я люблю піцу. / Мені подобається піца.
> note: «Мені подобається» → I like: хто відчуває — той підмет.

> [!word] love
> ipa: /lʌv/ · pos: verb · level: A1 · id: en-a1-present-simple-w05
> uk: любити; кохати; обожнювати
> example: My daughter **loves** music. — Моя донька обожнює музику.

> [!word] hate
> ipa: /heɪt/ · pos: verb · level: A1 · id: en-a1-present-simple-w06
> uk: ненавидіти; дуже не любити
> example: I **hate** Mondays! — Терпіти не можу понеділки!

> [!word] want
> ipa: /wɒnt/ · ipa-us: /wɑːnt/ · pos: verb · level: A1 · id: en-a1-present-simple-w07
> uk: хотіти
> example: She **wants** a new phone. — Вона хоче новий телефон.

> [!word] need
> ipa: /niːd/ · pos: verb · level: A1 · id: en-a1-present-simple-w08
> uk: потребувати; бути потрібним
> example: I **need** a holiday. — Мені потрібна відпустка.
> note: «Мені потрібно» → I need.

> [!word] play
> ipa: /pleɪ/ · pos: verb · level: A1 · id: en-a1-present-simple-w09
> uk: грати; гратися
> example: The children **play** in the park every day. — Діти щодня граються в парку.
> forms: play → plays

> [!word] listen
> ipa: /ˈlɪsn/ · pos: verb · level: A1 · id: en-a1-present-simple-w10
> uk: слухати
> example: He **listens** to podcasts in the car. — Він слухає подкасти в машині.
> note: t не читається; слухати когось — listen **to** somebody.

> [!word] help
> ipa: /help/ · pos: verb · level: A1 · id: en-a1-present-simple-w11
> uk: допомагати
> example: My son often **helps** me in the kitchen. — Мій син часто допомагає мені на кухні.

> [!word] visit
> ipa: /ˈvɪzɪt/ · pos: verb · level: A1 · id: en-a1-present-simple-w12
> uk: відвідувати; ходити в гості
> example: We **visit** my grandma every Sunday. — Ми щонеділі відвідуємо бабусю.

> [!word] open
> ipa: /ˈəʊpən/ · ipa-us: /ˈoʊpən/ · pos: verb · level: A1 · id: en-a1-present-simple-w13
> uk: відчиняти(ся); відкривати(ся)
> example: The bank **opens** at nine. — Банк відчиняється о девʼятій.

> [!word] close
> ipa: /kləʊz/ · ipa-us: /kloʊz/ · pos: verb · level: A1 · id: en-a1-present-simple-w14
> uk: зачиняти(ся); закривати(ся)
> example: The shop **closes** at eight. — Магазин зачиняється о восьмій.
> note: дієслово — дзвінке /z/; прикметник close («близький») — /kləʊs/.

> [!word] wash
> ipa: /wɒʃ/ · ipa-us: /wɑːʃ/ · pos: verb · level: A1 · id: en-a1-present-simple-w15
> uk: мити; прати
> example: He **washes** his car every week. — Він щотижня миє машину.
> forms: wash → washes

> [!word] try
> ipa: /traɪ/ · pos: verb · level: A1 · id: en-a1-present-simple-w16
> uk: намагатися; пробувати
> example: She always **tries** new food. — Вона завжди пробує нову їжу.
> forms: try → tries

> [!word] cry
> ipa: /kraɪ/ · pos: verb · level: A1 · id: en-a1-present-simple-w17
> uk: плакати
> example: The baby **cries** when he's hungry. — Малюк плаче, коли голодний.
> forms: cry → cries

> [!word] walk
> ipa: /wɔːk/ · pos: verb · level: A1 · id: en-a1-present-simple-w18
> uk: ходити пішки; гуляти
> example: She **walks** to work every day. — Вона щодня ходить на роботу пішки.
> note: l не читається: «во-ок». Не плутай з work /wɜːk/.

> [!word] look at
> ipa: /ˈlʊk ət/ · pos: phrase · level: A1 · id: en-a1-present-simple-w19
> uk: дивитися на
> example: **Look at** this photo! — Подивись на це фото!
> note: дивитися фільм / телевізор — watch; дивитися на щось — look at.

> [!word] agree
> ipa: /əˈɡriː/ · pos: verb · level: A1 · id: en-a1-present-simple-w20
> uk: погоджуватися
> example: I **agree** with you. — Я з тобою згоден.
> note: «Я згоден» = I agree, не «I am agree».

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-present-simple-l01
> audio: She works in a hospital.
> - [x] She works in a hospital.
> - [ ] She work in a hospital.
> - [ ] She's working in a hospital.

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-present-simple-l02
> audio: My dad watches TV every evening.
> - [ ] My dad watch TV every evening.
> - [x] My dad watches TV every evening.
> - [ ] My dad watches TV every morning.

> [!listen] Надрукуй почуте
> level: A1 · type: dictation · speed: slow · id: en-a1-present-simple-l03
> audio: He studies English.

> [!listen] Надрукуй почуте
> level: A1 · type: dictation · speed: slow · id: en-a1-present-simple-l04
> audio: We visit our grandparents on Sundays.

> [!listen] Послухай розповідь. Що правда про Ліну?
> level: A1 · type: answer · speed: slow · id: en-a1-present-simple-l05
> audio: This is Lina. She lives in Dnipro. She works at a bank. She gets up at seven and goes to work by bus. In the evening she plays tennis.
> - [x] Живе в Дніпрі, працює в банку, увечері грає в теніс.
> - [ ] Живе в Києві, працює в школі, увечері читає.
> - [ ] Живе в Дніпрі, їздить на роботу машиною.

## Вимова

> [!speak] Скажи вголос
> level: A1 · id: en-a1-present-simple-s01
> text: He works, she lives, it watches.
> ipa: /hi ˈwɜːks ʃi ˈlɪvz ɪt ˈwɒtʃɪz/
> tip: три звучання -s: /s/ у works, /z/ у lives, /ɪz/ у watches.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-present-simple-s02
> text: She goes, he does, it says.
> ipa: /ʃi ˈɡəʊz hi ˈdʌz ɪt ˈsez/
> tip: does — «даз», не «доуз»; says — «сез», не «сейз».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-present-simple-s03
> text: I live in Kyiv and I work in IT.
> ipa: /aɪ ˈlɪv ɪn ˈkiːɪv ənd aɪ ˈwɜːk ɪn ˌaɪ ˈtiː/
> tip: live — коротке /ɪ/ (не «ліів»); work — /ɜː/, не «ворк».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-present-simple-s04
> text: My sister studies law.
> ipa: /maɪ ˈsɪstə ˈstʌdiz ˈlɔː/
> tip: studies — «стадіз», дзвінке z; law — довге /ɔː/, без «у» в кінці.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-present-simple-s05
> text: I agree with you.
> ipa: /aɪ əˈɡriː wɪð juː/
> tip: with — /ð/: язик між зубами. Не «віз» і не «вид».

## Типові помилки українців

> [!pitfall] Забута -s: «He work», «My mum cook»
> Найчастіша помилка навіть у тих, хто давно вчить англійську. Тренуй рефлекс: **he / she / it / одне імʼя → -s**. *He work**s**. My mum cook**s**. The shop open**s** at nine.*

> [!pitfall] «I am work», «She is live» — be там, де є дієслово
> Present Simple **не потребує be**: *I work, she lives*. «I am work» — суміш двох часів. А *I'm working* — це вже Present Continuous, про те, що відбувається саме зараз.

> [!pitfall] «They likes», «She haves»
> -s — **лише** для he / she / it: *They like*. А *have* для he / she / it — неправильне: **has**. «She haves» не буває.

## Ситуація: знайомство на курсах

> [!listen] Нові знайомі розповідають про себе
> level: A1 · type: choice · speed: slow · id: en-a1-present-simple-l06
> audio: A: So, what do you do, Andriy?
> audio: B: I'm a programmer. I work from home. And my wife teaches maths at a school.
> audio: A: Nice! And your kids?
> audio: B: Our son studies in Poland and our daughter lives with us.
> - [x] Андрій працює з дому, дружина викладає математику.
> - [ ] Андрій викладає математику, дружина — програмістка.
> - [ ] Син живе з батьками, донька навчається в Польщі.

Розкажи про себе вголос.

> [!speak] «Я живу у Львові. Моя сестра працює в лікарні».
> level: A1 · id: en-a1-present-simple-s06
> text: I live in Lviv. My sister works at a hospital.
> ipa: /aɪ ˈlɪv ɪn ləˈviːv maɪ ˈsɪstə ˈwɜːks ət ə ˈhɒspɪtl/
> tip: works ət — зливається: «вьоркс-ет». Не ковтай -s!

## Практика

> [!quiz] Обери правильну форму: «Olha ___ three languages.»
> level: A1 · id: en-a1-present-simple-q02
> - [ ] speak
> - [x] speaks
> - [ ] is speak
> - [ ] speaking
>
> **Пояснення:** *Olha* = *she* → *speaks*.

> [!quiz] Обери правильну форму: «My parents ___ in a village.»
> level: A1 · id: en-a1-present-simple-q03
> - [x] live
> - [ ] lives
> - [ ] are live
> - [ ] living
>
> **Пояснення:** *my parents* = *they* → початкова форма *live*.

> [!quiz] Де правильно написано форму з -s?
> level: A1 · id: en-a1-present-simple-q04
> - [ ] studys, plaies, gos
> - [x] studies, plays, goes
> - [ ] studies, plaies, goes
> - [ ] studyes, plays, gos
>
> **Пояснення:** приголосний + y → *ies* (*studies*), голосний + y → *s* (*plays*), -o → *es* (*goes*).

> [!quiz] Обери всі речення, де Present Simple доречний
> level: A1 · type: multi · id: en-a1-present-simple-q05
> - [x] I drink tea every morning.
> - [x] The sun rises in the east.
> - [ ] Look! It rains now.
> - [x] She works at a bank.
>
> **Пояснення:** звички, факти, постійна робота — Present Simple. Те, що відбувається саме зараз (*Look!*), — Present Continuous: *It's raining.*

> [!quiz] Як перекласти «Мій брат грає на гітарі й любить джаз»?
> level: A1 · id: en-a1-present-simple-q06
> - [ ] My brother play the guitar and like jazz.
> - [ ] My brother is play the guitar and is like jazz.
> - [x] My brother plays the guitar and likes jazz.
> - [ ] My brother plays the guitar and like jazz.
>
> **Пояснення:** -s потрібне **обом** дієсловам, бо підмет той самий — *he*.

> [!quiz] Заповни пропуски: -s чи без
> level: A1 · type: fill · bank · id: en-a1-present-simple-q07
>
> ```text fill
> I [[work]] in Kyiv, but my husband [[works]] in Irpin.
> We [[live]] in a flat. My mum [[lives]] in a house.
> ```
>
> **Пояснення:** I / we → без -s; my husband, my mum (he / she) → з -s.

> [!quiz] Напиши форму для he / she / it
> level: A1 · type: fill · id: en-a1-present-simple-q08
>
> ```text fill
> go → she [[goes]]
> watch → he [[watches]]
> study → she [[studies]]
> have → it [[has]]
> stay → he [[stays]]
> ```
>
> **Пояснення:** -o і -ch → *es*; приголосний + y → *ies*; *have → has*; голосний + y → просто *s*.

> [!quiz] Заповни розповідь про Макса
> level: A1 · type: fill · bank · id: en-a1-present-simple-q09
>
> ```text fill
> Max [[gets]] up at seven. He [[has]] breakfast and [[goes]] to work by bike.
> He [[finishes]] work at six.
> ```
>
> **Пояснення:** про Макса (he) — кожне дієслово з -s: *gets, has, goes, finishes*.

> [!quiz] Склади речення: «Вона щодня дзвонить мамі»
> level: A1 · type: order · id: en-a1-present-simple-q10
>
> ```text order
> She
> calls
> her
> mum
> every
> day.
> is // ✗
> ```
>
> **Пояснення:** підмет → дієслово з -s → обʼєкт → маркер часу в кінці. *Is* не потрібне.

> [!quiz] Склади речення: «Мої друзі живуть у Варшаві»
> level: A1 · type: order · id: en-a1-present-simple-q11
>
> ```text order
> My
> friends
> live
> in
> Warsaw.
> lives // ✗
> ```
>
> **Пояснення:** *my friends* = *they* → *live* без -s.

> [!quiz] Як сказати «Я згоден»?
> level: A1 · id: en-a1-present-simple-q12
> - [ ] I am agree.
> - [x] I agree.
> - [ ] I agreed am.
> - [ ] Me agree.
>
> **Пояснення:** *agree* — дієслово, тому *be* не потрібне: *I agree. She agrees.*

## Фішки

> [!reel] 🐍 Самотня -s
> Колись у англійських дієсловах були закінчення майже для кожної особи, як в українській: *I love, thou lovest, he loveth*. Усі зникли, крім одного — *-s* для he / she / it. Тому про неї так легко забути.

> [!reel] 📰 Заголовки живуть у Present Simple
> *President visits Kyiv. Team wins cup.* Газетні заголовки пишуть у Present Simple навіть про те, що вже сталося: так коротше й «живіше».

> [!reel] ⚽ Коментатори теж
> *Shevchenko passes, shoots… and scores!* Спортивні коментатори описують швидкі дії в Present Simple — кожна дія коротка і вже завершена.

## Джерела та що почитати

- [British Council LearnEnglish — A1–A2 grammar](https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar) — розділ *Present simple*.
- [Cambridge Dictionary — English Grammar Today](https://dictionary.cambridge.org/grammar/british-grammar/) — стаття *Present simple*.
- R. Murphy — *Essential Grammar in Use* — розділи: Present Simple, ствердження.

> [!important] Підсумок
> - Present Simple — звички, розклад, постійні стани, факти: *I work in IT. Water boils at 100 °C.*
> - Форма: початкова форма дієслова; для *he / she / it* — **+ s**.
> - *-es* після s, sh, ch, x, o (*goes, watches*); приголосний + y → *ies* (*studies*); *have → has*.
> - Жодного *be*: *I work*, не «I am work».
> - Маркери: *every day, on Mondays, at weekends, usually, often*.
