---
title: Система часів — simple, continuous, perfect
order: 401
id: en-b2-tense-system
level: B2
icon: px:map
tags: [english, b2, grammar, tenses, aspect, continuous, perfect, ielts]
prerequisites: ["[[English - B1 - 01. Теперішні часи — Simple чи Continuous, дієслова стану]]", "[[English - B1 - 03. Наративні часи — Past Simple, Continuous і Perfect]]", "[[English - B1 - 06. Present Perfect Continuous — for, since, how long]]"]
estimatedMinutes: 45
---

# Система часів — simple, continuous, perfect

> [!success] Після цієї теми ти зможеш
> - бачити 12 англійських часів не як 12 окремих правил, а як систему: **3 часи × 4 аспекти**;
> - обирати аспект за тим, *як* ти бачиш дію: ціла подія, процес, результат до моменту чи тривалість до моменту;
> - збирати будь-яку форму з «конструктора»: **be + -ing**, **have + V3**, **have been + -ing**;
> - правильно обирати час в IELTS Writing Task 1 (минулі дані, зміни до сьогодні, прогнози);
> - говорити про зміни в суспільстві в IELTS Speaking Part 3: *Things **have changed**… People **are increasingly**…*

## Передбач

> [!quiz] Як сказати «Я працюю тут уже пʼять років» (і досі працюю)?
> level: B2 · id: en-b2-tense-system-q01
> - [ ] I work here for five years.
> - [ ] I'm working here for five years.
> - [x] I've been working here for five years.
> - [ ] I worked here for five years.
>
> **Пояснення:** українською тут теперішній час («працюю»), але англієць бачить інше: дія почалася в минулому й **тягнеться до тепер** — це перфектний аспект (*have been working*). *I worked here for five years* означає, що ти там уже не працюєш. Саме такі розбіжності між мовами ми сьогодні розкладемо по поличках.

## Простими словами

В українській дієслово має **час** (минулий, теперішній, майбутній) і **вид** (робив / зробив). В англійській — теж дві «ручки», але друга працює інакше:

1. **Час — коли?** Минуле, теперішнє чи майбутнє. Його показує перше допоміжне дієслово: *was*, *is*, *will*…
2. **Аспект — як я бачу дію?** Їх чотири, і це як чотири способи зняти ту саму подію:
   - **Simple** — фото: подія цілком, факт, звичка. *I **work** in Kyiv.*
   - **Continuous** — відео зсередини: дія триває, ще не завершена, тимчасова. *I'**m working** from home this week.*
   - **Perfect** — погляд назад із якоїсь точки: що вже є *на цей момент*. *I'**ve finished** the report.*
   - **Perfect Continuous** — секундомір: скільки дія тривала *до цієї точки*. *I'**ve been working** since eight.*

Три часи × чотири аспекти = ті самі «12 часів» із таблиць. Тільки тепер це не 12 правил, а **два вибори**: коли — і як бачу.

> [!diagram] Карта часів: 3 часи × 4 аспекти
> ```yaml
> layout: compare
> columns: { past: "Past — минуле", present: "Present — тепер", future: "Future — майбутнє" }
> nodes:
>   - { id: ps, col: past, label: "Simple", text: "I worked", note: "ціла подія в минулому", tone: green }
>   - { id: ns, col: present, label: "Simple", text: "I work", note: "факт, звичка", tone: green }
>   - { id: fs, col: future, label: "Simple", text: "I will work", note: "рішення, прогноз", tone: green }
>   - { id: pc, col: past, label: "Continuous · be + -ing", text: "I was working", note: "процес у момент минулого", tone: blue }
>   - { id: nc, col: present, label: "Continuous · be + -ing", text: "I am working", note: "процес зараз, тимчасово", tone: blue }
>   - { id: fc, col: future, label: "Continuous · be + -ing", text: "I will be working", note: "процес у момент майбутнього", tone: blue }
>   - { id: pp, col: past, label: "Perfect · have + V3", text: "I had worked", note: "раніше за момент у минулому", tone: violet }
>   - { id: np, col: present, label: "Perfect · have + V3", text: "I have worked", note: "минуле, повʼязане з тепер", tone: violet }
>   - { id: fp, col: future, label: "Perfect · have + V3", text: "I will have worked", note: "уже буде до моменту в майбутньому", tone: violet }
>   - { id: ppc, col: past, label: "Perfect Continuous", text: "I had been working", note: "тривало до моменту в минулому", tone: orange }
>   - { id: npc, col: present, label: "Perfect Continuous", text: "I have been working", note: "триває до тепер", tone: orange }
>   - { id: fpc, col: future, label: "Perfect Continuous", text: "I will have been working", note: "тривало до моменту в майбутньому", tone: orange }
> steps:
>   - { show: [ps, ns, fs], note: "Перший рядок — Simple: подія як ціле. Час змінює лише форма дієслова: worked, work, will work." }
>   - { show: [pc, nc, fc], note: "Continuous = be + -ing. Час несе be: was, am, will be. Сенс той самий — дія в процесі." }
>   - { show: [pp, np, fp], note: "Perfect = have + V3. Час несе have: had, have, will have. Сенс — погляд назад із точки відліку." }
>   - { show: [ppc, npc, fpc], note: "Perfect Continuous = have been + -ing: обидва аспекти разом — тривалість до точки відліку." }
>   - { focus: [nc, pc, fc], note: "Читай по рядку: аспект однаковий, міняється лише перше допоміжне. Вивчив рядок — знаєш три часи." }
> ```

## Пояснення

### Конструктор: перше допоміжне несе час

Кожна складна форма — це «цеглинки», що чіпляються одна до одної в незмінному порядку: **(will) + (have + V3) + (be + -ing) + дієслово**. Перше допоміжне показує час, решта — аспект.

| Аспект | Формула | Past | Present | Future |
|---|---|---|---|---|
| **Simple** | — | she **wrote** | she **writes** | she **will write** |
| **Continuous** | be + V-ing | she **was writing** | she **is writing** | she **will be writing** |
| **Perfect** | have + V3 | she **had written** | she **has written** | she **will have written** |
| **Perfect Continuous** | have been + V-ing | she **had been writing** | she **has been writing** | she **will have been writing** |

Питання й заперечення будуються однаково для всіх: перше допоміжне виходить наперед або отримує *not*.

- **Had** you **been waiting** long? — Ти довго чекав?
- She **won't have finished** by six. — До шостої вона ще не закінчить.
- **Is** he **working** today? — Він сьогодні працює?

> [!tip] Хитрість для довгих форм
> Розбирай форму з кінця: *will have been working* → **working** (процес) + **have been** (до точки відліку) + **will** (у майбутньому). Так само її й будуй — справа наліво від змісту до часу.

> [!quiz] Перевір себе: збери форму
> level: B2 · id: en-b2-tense-system-q02
>
> By next June, she ___ at this company for ten years. (вона там працює й далі працюватиме)
>
> - [ ] will work
> - [ ] will be working
> - [x] will have been working
> - [ ] has been working
>
> **Пояснення:** точка відліку — *next June* (майбутнє → **will**), рахуємо тривалість до неї (**have been + -ing**). *Has been working* відраховує до *тепер*, а не до червня.

### Simple — подія як ціле

Simple не «найпростіший» час, а найнейтральніший погляд: ми не заглядаємо всередину дії, а називаємо її цілком.

- факти й звички: *Water **boils** at 100 °C. I **go** to the gym twice a week.*
- ланцюжок подій в історії: *She **opened** the door, **looked** around and **left**.*
- завершена подія з конкретним часом: *We **met** in 2019.*
- рішення й прогнози: *I'**ll call** you back. Prices **will rise**.*

### Continuous — дія зсередини

Continuous ставить нас *усередину* дії: вона почалася, ще не скінчилася, і ми бачимо її в процесі.

- процес у конкретний момент: *At 8 p.m. I **was cooking**.* — О восьмій я саме готував.
- тимчасова ситуація: *I'**m staying** with my parents this month.*
- зміна, тенденція: *The climate **is getting** warmer.*
- фон для події: *While we **were talking**, the lights went out.*
- роздратування з *always*: *You'**re always interrupting** me!*

> [!warning] Дієслова стану не люблять continuous
> *know, believe, own, belong, need, prefer, seem, understand* описують стан, а не процес: ~~*I'm knowing*~~ → *I **know***. Детальніше — у [[English - B1 - 01. Теперішні часи — Simple чи Continuous, дієслова стану]].

> [!quiz] Перевір себе: ціла подія чи процес?
> level: B2 · id: en-b2-tense-system-q03
>
> *I usually ___ on the train, but this week I ___ to podcasts instead.*
>
> - [ ] am reading … listen
> - [x] read … am listening
> - [ ] read … listen
> - [ ] am reading … am listening
>
> **Пояснення:** *usually* — звичка, тож Simple (*read*). *This week* — тимчасова ситуація, тож Continuous (*am listening*). Один і той самий час (present), але два різні погляди.

### Perfect — погляд назад із точки відліку

Головне слово для перфекта — **точка відліку**. Ми стоїмо в якомусь моменті й дивимося назад: що *вже* сталося до нього, який результат чи досвід ми маємо.

| Точка відліку | Форма | Приклад |
|---|---|---|
| тепер | have / has + V3 | I**'ve lost** my keys. (і зараз їх немає) |
| момент у минулому | had + V3 | When I got home, I realised I **had lost** my keys. |
| момент у майбутньому | will have + V3 | By Friday, I **will have finished** the report. |

Present Perfect дивиться з *теперішнього* моменту, тому не дружить зі словами завершеного часу: ~~*I've seen him yesterday*~~ → *I **saw** him yesterday*. Yesterday, last week, in 2019, ago — це вже ціла подія в минулому, тобто Past Simple.

### Perfect Continuous — тривалість до точки відліку

Тут обидва аспекти разом: процес (*-ing*) + погляд назад (*have been*). Відповідає на питання **«як довго?»** або пояснює видимий результат процесу.

- *I've **been waiting** for you for an hour!* — Я чекаю на тебе вже годину!
- *Your eyes are red. Have you **been crying**?* — У тебе червоні очі. Ти плакала?
- *She was exhausted because she **had been working** all night.* — Вона була виснажена, бо працювала всю ніч.

**Perfect чи Perfect Continuous?** Perfect рахує *результат* («скільки зроблено»), Perfect Continuous — *процес* («скільки часу»):

- *I've **written** three emails.* — Я написав три листи (результат: три).
- *I've **been writing** emails all morning.* — Я весь ранок пишу листи (процес, тривалість).

> [!quiz] Перевір себе: результат чи процес?
> level: B2 · type: fill · bank · id: en-b2-tense-system-q04
>
> ```text fill
> Sorry I'm late! Have you [[been waiting]] long?
> I've [[read]] four chapters, so I'm halfway through the book.
> The streets are wet. It has [[been raining]] all night.
> ```
>
> **Пояснення:** «довго чекаєш?» — тривалість процесу, отже **been waiting**. «Чотири розділи» — порахований результат, отже **read** (V3, Present Perfect). Мокрі вулиці — видимий слід процесу, отже **been raining**.

> [!diagram] Один момент — чотири аспекти
> ```yaml
> layout: timeline
> nodes:
>   - { id: pc, at: "з 17:00", label: "Past Perfect Continuous — тривалість до точки", text: "I had been cooking since five.", note: "процес, що тягнувся до восьмої", tone: orange, icon: "px:hourglass" }
>   - { id: pp, at: "до 20:00", label: "Past Perfect — уже готово", text: "I had already made the salad.", note: "результат до точки відліку", tone: violet }
>   - { id: point, at: "20:00", label: "точка відліку · Past Simple", text: "My friends arrived at eight.", tone: gray, icon: "px:clock" }
>   - { id: c, at: "20:00", label: "Past Continuous — у процесі", text: "I was still frying the fish.", note: "дія триває саме в цю мить", tone: blue }
>   - { id: s, at: "після 20:00", label: "Past Simple — наступні події", text: "We sat down and ate.", tone: green }
> steps:
>   - { show: point, note: "Ставимо точку відліку: друзі прийшли о восьмій. Усі інші форми рахуються від неї." }
>   - { show: c, note: "Що відбувалося в цю саму мить? Я ще смажив рибу — Past Continuous: дія всередині процесу." }
>   - { show: pp, note: "Що вже було готове до восьмої? Салат — Past Perfect: had made. Дивимося назад від точки." }
>   - { show: pc, note: "Скільки часу я на той момент уже готував? З пʼятої — Past Perfect Continuous: had been cooking." }
>   - { show: s, note: "А далі — нові події по черзі: сіли, поїли. Знову Past Simple." }
> ```

### Як обрати час: три питання

Коли вагаєшся, постав собі три питання — і форма збереться сама:

1. **Коли?** → минуле, теперішнє чи майбутнє (перше допоміжне: *was / is / will*).
2. **Ціла подія чи процес?** → Simple чи Continuous.
3. **Чи є точка відліку, від якої я дивлюся назад?** → якщо так, додай Perfect (*have + V3*).

> [!diagram] Три питання — одна форма
> ```yaml
> layout: flow
> nodes:
>   - { id: when, label: "1 · Коли?", text: "завтра о 10:00", tone: blue, icon: "px:calendar" }
>   - { id: how, label: "2 · Ціла подія чи процес?", text: "процес", tone: mint }
>   - { id: ref, label: "3 · Погляд назад від точки?", text: "ні", tone: violet }
>   - { id: out, label: "форма", text: "I'll be working at 10 tomorrow.", tone: green, icon: "px:check" }
> edges:
>   - { from: when, to: how, label: "future → will" }
>   - { from: how, to: ref, label: "процес → be + -ing" }
>   - { from: ref, to: out, label: "без have" }
> steps:
>   - { focus: when, note: "Завтра — майбутнє. Отже, перше допоміжне — will." }
>   - { focus: how, note: "О десятій я буду посеред роботи — це процес, а не ціла подія. Додаємо be + -ing." }
>   - { focus: ref, note: "Чи рахуємо щось до цього моменту? Ні — тож перфекта немає." }
>   - { focus: out, note: "Збираємо: will + be + working = Future Continuous." }
>   - { set: { when: "до кінця року", how: "результат", ref: "так — до кінця року", out: "I'll have finished the course by December." }, focus: [when, how, ref, out], note: "Інша ситуація: майбутнє + ціла подія + погляд назад від грудня = will have finished (Future Perfect)." }
> ```

### Слова-сигнали — підказка, а не закон

| Сигнал | Зазвичай | Приклад |
|---|---|---|
| yesterday, ago, last…, in 2019 | Past Simple | I **moved** here two years ago. |
| since, for (до тепер) | Present Perfect (Continuous) | I**'ve lived** here since 2021. |
| at this time tomorrow | Future Continuous | At this time tomorrow I**'ll be flying**. |
| by + момент | Perfect (будь-якого часу) | By then, she **had left** / **will have left**. |
| while, at that moment | Continuous | **While** I **was driving**, … |
| always (роздратування) | Continuous | He**'s always losing** his keys. |

Але зміст важливіший за сигнал: *for* буває і з Past Simple (*I **lived** in Lviv **for** five years* — і вже там не живу).

> [!note] Британська й американська норми
> В американській розмовній мові з *just, already, yet* часто вживають Past Simple: *Did you eat yet? I **just saw** him.* У британській нормі (і в IELTS Writing) надійніше — Present Perfect: *Have you eaten yet? I'**ve just seen** him.* Обидва варіанти правильні у своєму середовищі.

### IELTS: як обрати час у Writing і Speaking

- **Writing Task 1 (графіки й таблиці).** Час визначає період на графіку:
  - дані в минулому (1990–2020) → **Past Simple**: *The number of cyclists **rose** steadily between 1990 and 2010.*
  - зміни до сьогодні (якщо графік доходить до «now») → **Present Perfect**: *Since 2015, the figure **has fluctuated**.*
  - прогнози → **will / is expected to / will have + V3**: *By 2040, the figure **will have doubled**.*
  - процеси → **Present Simple Passive** (див. [[English - B2 - 05. Пасив глибше — have something done, it is said that]]).
- **Speaking Part 3.** Питання на кшталт *How has… changed?* чекають контрасту часів: *In the past, people **used to**… Nowadays, more people **are working** remotely, and this **has changed**…* Кілька аспектів в одній відповіді — плюс до критерію Grammatical Range & Accuracy.

## Приклади

- I **work** for a logistics company, but this month I**'m working** on a project in Poland. — Я працюю в логістичній компанії, але цього місяця працюю над проєктом у Польщі.
- I**'ve worked** with three different teams so far. — Досі я встиг попрацювати з трьома командами.
- She **was living** in Berlin when the war started. — Коли почалася війна, вона жила в Берліні.
- By the time the ambulance arrived, he **had stopped** breathing. — Поки приїхала швидка, він уже перестав дихати.
- They **had been arguing** for hours before they finally agreed. — Вони сперечалися годинами, перш ніж нарешті погодилися.
- Don't call at nine — I**'ll be having** dinner with my parents. — Не дзвони о девʼятій — я вечерятиму з батьками.
- By 2030, the city **will have built** fifty kilometres of cycle lanes. — До 2030 року місто збудує пʼятдесят кілометрів велодоріжок.
- Next month I **will have been teaching** for twenty years. — Наступного місяця буде двадцять років, як я викладаю.
- Prices **are rising** faster than wages. — Ціни ростуть швидше за зарплати.
- **Have** you ever **been** to Japan? — Yes, I **went** there in 2018. — Ти колись бував у Японії? — Так, їздив туди 2018 року.

## Слова

> [!word] aspect
> ipa: /ˈæs.pekt/ · pos: noun · level: B2 · id: en-b2-tense-system-w01
> uk: аспект; бік, сторона (питання)
> example: Cost is only one **aspect** of the problem. — Вартість — лише один бік проблеми.
> note: у граматиці — аспект дієслова (simple, continuous, perfect). Наголос на першому складі: AS-pect.

> [!word] ongoing
> ipa: /ˈɒnˌɡəʊ.ɪŋ/ · ipa-us: /ˈɑːnˌɡoʊ.ɪŋ/ · pos: adj · level: B2 · id: en-b2-tense-system-w02
> uk: триваючий, поточний, що не припиняється
> example: The investigation is still **ongoing**. — Розслідування ще триває.
> note: стоїть і перед іменником (an ongoing project), і після be (it's ongoing).

> [!word] in progress
> ipa: /ɪn ˈprəʊ.ɡres/ · ipa-us: /ɪn ˈprɑː.ɡres/ · pos: phrase · level: B2 · id: en-b2-tense-system-w03
> uk: у процесі, триває
> example: Please be quiet — an exam is **in progress**. — Будь ласка, тихо: триває іспит.
> note: часто на табличках: Work in progress — «Ведуться роботи».

> [!word] duration
> ipa: /djʊəˈreɪ.ʃən/ · ipa-us: /dʊˈreɪ.ʃən/ · pos: noun · level: B2 · id: en-b2-tense-system-w04
> uk: тривалість
> example: Phones must be switched off for the **duration** of the flight. — Телефони мають бути вимкнені протягом усього польоту.
> note: for the duration of — протягом усього (часу).

> [!word] reference point
> ipa: /ˈref.ər.əns ˌpɔɪnt/ · ipa-us: /ˈref.ɚ.əns ˌpɔɪnt/ · pos: noun · level: B2 · id: en-b2-tense-system-w05
> uk: точка відліку, орієнтир
> example: We use the 2020 figures as a **reference point**. — Ми беремо дані 2020 року за точку відліку.

> [!word] background
> ipa: /ˈbæk.ɡraʊnd/ · pos: noun · level: B2 · id: en-b2-tense-system-w06
> uk: фон, тло; походження, освіта й досвід (людини)
> example: I could hear music in the **background**. — На фоні було чути музику.
> example: She comes from a medical **background**. — Вона з медичного середовища.

> [!word] time frame
> ipa: /ˈtaɪm ˌfreɪm/ · pos: noun · level: B2 · id: en-b2-tense-system-w07
> uk: часові рамки, термін
> example: The graph covers a **time frame** of thirty years. — Графік охоплює період у тридцять років.
> note: пишуть і timeframe — одним словом.

> [!word] increasingly
> ipa: /ɪnˈkriː.sɪŋ.li/ · pos: adv · level: B2 · id: en-b2-tense-system-w08
> uk: дедалі більше, усе (+ прикметник)
> example: It's becoming **increasingly** difficult to find a cheap flat. — Знайти дешеву квартиру стає дедалі важче.
> note: улюблене слово IELTS Speaking Part 3 і Writing Task 2 разом із Present Continuous: is increasingly + V-ing.

> [!word] steadily
> ipa: /ˈsted.əl.i/ · pos: adv · level: B2 · id: en-b2-tense-system-w09
> uk: стабільно, неухильно, рівномірно
> example: Sales rose **steadily** between 2010 and 2020. — З 2010 по 2020 рік продажі стабільно зростали.
> note: IELTS Writing Task 1: rise / fall steadily, a steady increase.

> [!word] fluctuate
> ipa: /ˈflʌk.tʃu.eɪt/ · pos: verb · level: B2 · id: en-b2-tense-system-w10
> uk: коливатися, змінюватися то вгору, то вниз
> example: The price of oil has **fluctuated** a lot this year. — Цього року ціна на нафту сильно коливалася.
> forms: fluctuate → fluctuated → fluctuated; noun — fluctuation

## Слухаємо

> [!listen] Що ти почув?
> level: B2 · type: choice · id: en-b2-tense-system-l01
> audio: I've been waiting for you for over an hour.
> - [ ] I waited for you for over an hour.
> - [x] I've been waiting for you for over an hour.
> - [ ] I'd been waiting for you for over an hour.
>
> **Пояснення:** скорочення *I've* звучить як [айв] — ледь чутне [в] перед *been*. Почути його — значить зрозуміти, що людина чекає досі.

> [!listen] Що ти почув?
> level: B2 · type: choice · id: en-b2-tense-system-l02
> audio: When I called her, she'd already had dinner.
> - [ ] When I called her, she was having dinner.
> - [ ] When I called her, she had dinner.
> - [x] When I called her, she'd already had dinner.
>
> **Пояснення:** *she'd already had* — Past Perfect: вечеря закінчилася ще до дзвінка. *She'd* у швидкому мовленні — майже [шид].

> [!listen] Надрукуй почуте
> level: B2 · type: dictation · id: en-b2-tense-system-l03
> audio: By the time we got there, everyone had left.

> [!listen] Надрукуй почуте
> level: B2 · type: dictation · id: en-b2-tense-system-l04
> audio: She's been learning English since she was six.

> [!listen] IELTS Listening, Part 4. Choose the correct answer. What happened to the tram network after 1950?
> level: B2 · type: answer · tags: ielts · id: en-b2-tense-system-l05
> audio: By 1950, the tram network had grown to forty lines. Over the next two decades, however, it was gradually replaced by buses.
> audio: Today the city is rebuilding some of the old routes, and by 2030 it will have reopened twelve of them.
> - [ ] It grew to forty lines.
> - [x] Buses slowly took its place.
> - [ ] Twelve lines were reopened.
> - [ ] The city started rebuilding it.
>
> **Пояснення:** після 1950 — *over the next two decades it was gradually replaced by buses*: автобуси поступово його витіснили (у відповіді перефразовано: *slowly took its place*). Сорок ліній — це вже *had grown* **до** 1950; відбудова — *is rebuilding* **тепер**; дванадцять ліній — *will have reopened* **до 2030**. Час дієслова — ключ до правильного періоду.

> [!listen] Чому Даря втомлена?
> level: B2 · type: answer · id: en-b2-tense-system-l06
> audio: A: You look exhausted, Daria. Are you OK?
> audio: B: I've been revising for my finals since six this morning. I've done three past papers already.
> audio: A: Three? No wonder! Take a break.
> - [ ] Вона погано спала.
> - [x] Вона з шостої ранку готується до іспитів.
> - [ ] Вона щойно склала три іспити.
> - [ ] Вона працювала вночі.
>
> **Пояснення:** *I've been revising since six* — процес, що триває з шостої (Present Perfect Continuous пояснює втому). *I've done three past papers* — результат: три пробні тести розвʼязано, а не три іспити складено.

## Вимова

> [!speak] Скажи вголос
> level: B2 · id: en-b2-tense-system-s01
> text: I've been working here for three years.
> ipa: /aɪv bɪn ˈwɜː.kɪŋ hɪə fə θriː jɪəz/
> tip: been — слабке [бін], for — слабке /fə/. Наголос лише на working, three, years.

> [!speak] Скажи вголос
> level: B2 · id: en-b2-tense-system-s02
> text: What were you doing at eight last night?
> ipa: /wɒt wə juː ˈduː.ɪŋ ət eɪt lɑːst naɪt/
> tip: were — слабке /wə/; у last night звук [t] майже зникає: [ла:с-найт].

> [!speak] Скажи вголос
> level: B2 · id: en-b2-tense-system-s03
> text: By the time we arrived, the film had already started.
> ipa: /baɪ ðə taɪm wiː əˈraɪvd ðə fɪlm həd ɔːlˈred.i ˈstɑː.tɪd/
> tip: had — слабке /həd/; started — закінчення -ed тут /ɪd/, бо перед ним [t].

> [!speak] Скажи вголос
> level: B2 · id: en-b2-tense-system-s04
> text: This time next week, I'll be lying on a beach.
> ipa: /ðɪs taɪm nekst wiːk aɪl bi ˈlaɪ.ɪŋ ɒn ə biːtʃ/
> tip: beach — довге /iː/, тягни його! Коротке [ɪ] дасть зовсім інше, грубе слово.

> [!speak] Скажи вголос
> level: B2 · id: en-b2-tense-system-s05
> text: The number of users has risen steadily over the past decade.
> ipa: /ðə ˈnʌm.bər əv ˈjuː.zəz həz ˈrɪz.ən ˈsted.əl.i ˈəʊ.və ðə pɑːst ˈdek.eɪd/
> tip: risen — /ˈrɪz.ən/ з дзвінким [z]; decade — наголос на першому складі: DEC-ade.

> [!speak] IELTS Speaking, Part 3 — як змінилася робота?
> level: B2 · id: en-b2-tense-system-s06
> text: More people have started working from home, and companies are increasingly hiring staff remotely.
> ipa: /mɔː ˈpiː.pəl həv ˈstɑː.tɪd ˈwɜː.kɪŋ frəm həʊm ənd ˈkʌm.pə.niz ər ɪnˈkriː.sɪŋ.li ˈhaɪə.rɪŋ stɑːf rɪˈməʊt.li/
> tip: питання екзаменатора — «How has the way people work changed in recent years?». Present Perfect (зміна до тепер) + Present Continuous (тенденція) в одній відповіді показують Grammatical Range.

## Типові помилки українців

> [!pitfall] «I live here for five years»
> Українське «живу тут пʼять років» — теперішній час, тому рука тягнеться до Present Simple. Але англійська бачить дію, що почалася в минулому й триває досі, — це перфект: *I**'ve lived** / I**'ve been living** here for five years.* ~~*I live here for five years*~~ ~~*I'm living here since 2021*~~.

> [!pitfall] Доконаний вид ≠ Present Perfect
> «Я **прочитав** цю книжку вчора» — доконаний вид, але англійською це **Past Simple**: *I **read** this book yesterday.* Present Perfect потрібен не для «завершеності», а для звʼязку з *тепер* і без конкретного минулого часу: *I**'ve read** this book* (я її знаю, маю цей досвід). ~~*I have read it yesterday*~~.

> [!pitfall] Недоконаний вид ≠ Continuous
> «Я **читав** цю книжку» — недоконаний вид, але часто це досвід, а не процес: *I**'ve read** this book* (так, знайомий з нею). Continuous — лише коли ти справді «всередині» дії: *I **was reading** it when you called.*

> [!pitfall] Сигнальне слово замість змісту
> *for* не завжди означає перфект, а *always* — не завжди Simple. *I **lived** in Odesa **for** ten years* — ти там більше не живеш (Past Simple). *She's **always** complaining* — роздратування (Continuous). Спершу думай про зміст, потім перевіряй слово-сигнал.

## Практика

> [!quiz] Яке речення неправильне?
> level: B2 · id: en-b2-tense-system-q05
> - [ ] I've lost my phone — have you seen it?
> - [x] I've seen that film last weekend.
> - [ ] I saw that film last weekend.
> - [ ] Have you ever seen a ghost?
>
> **Пояснення:** *last weekend* — завершений час у минулому, тож тільки **Past Simple**: *I **saw** that film last weekend.* Present Perfect із конкретним минулим часом не вживається.

> [!quiz] Обери всі правильні речення
> level: B2 · type: multi · id: en-b2-tense-system-q06
> - [x] By the time I woke up, my flatmate had already left.
> - [ ] I'm knowing the answer, but I can't say it.
> - [x] This time tomorrow, we'll be driving through the Alps.
> - [ ] She has been to Paris in 2015.
> - [x] He's been playing the guitar since he was twelve.
>
> **Пояснення:** *know* — дієслово стану, без continuous (*I know*). З *in 2015* — Past Simple (*She **went** to Paris in 2015*). Решта правильні: Past Perfect до точки в минулому, Future Continuous у конкретний момент майбутнього, Present Perfect Continuous з *since*.

> [!quiz] Постав дієслова в правильну форму
> level: B2 · type: fill · id: en-b2-tense-system-q07
>
> *Олег розповідає про свою роботу.*
>
> ```text fill
> I [[work|am working]] for a small IT company in Lviv. (зазвичай)
> Right now we [[are developing]] a new app for a bank. (цими тижнями)
> I [[joined]] the company in 2022.
> Since then, I [[have worked]] on six projects.
> By the end of this year, we [[will have launched]] the app.
> ```
>
> **Пояснення:** постійна робота — *work* (можна й *am working*, якщо підкреслюєш, що це тимчасово); проєкт «цими тижнями» — Present Continuous; *in 2022* — Past Simple; *since then* + результат (шість проєктів) — Present Perfect; *by the end of this year* — Future Perfect.

> [!quiz] Обери аспект
> level: B2 · type: fill · bank: has finished, was working · id: en-b2-tense-system-q08
>
> ```text fill
> When the power went off, I [[was writing]] an important email.
> I'm exhausted — I [[have been cleaning]] the flat all day.
> By the time the police arrived, the thieves [[had escaped]].
> Don't phone me at seven tomorrow — I [[will be driving]] home.
> ```
>
> **Пояснення:** процес у момент події — Past Continuous; втома від тривалого процесу — Present Perfect Continuous; втекли *до* приїзду поліції — Past Perfect; конкретна мить у майбутньому — Future Continuous. Зайві слова з банку — інші часи.

> [!quiz] Склади питання: «Як довго ти вчиш англійську?»
> level: B2 · type: order · id: en-b2-tense-system-q09
>
> ```text order
> How long
> have you
> been
> learning
> English?
> are you // ✗
> ```
>
> **Пояснення:** «як довго» + дія триває досі = Present Perfect Continuous: *How long **have** you **been learning**…?* ~~*How long are you learning*~~ — калька з української.

> [!quiz] Склади речення: «Завтра о цій порі я летітиму до Лісабона»
> level: B2 · type: order · id: en-b2-tense-system-q10
>
> ```text order
> This time tomorrow
> I'll
> be
> flying
> to Lisbon.
> have // ✗
> ```
>
> **Пояснення:** процес у конкретний момент майбутнього — Future Continuous: *will be + -ing*. *Have* тут зайве: ми не дивимося назад від якоїсь точки.

> [!quiz] Що означає речення? *When I arrived, Marta was leaving.*
> level: B2 · id: en-b2-tense-system-q11
> - [ ] Марта пішла задовго до мого приходу.
> - [x] Коли я прийшов, Марта саме виходила — ми ледь розминулися.
> - [ ] Марта пішла, бо я прийшов.
> - [ ] Марта ще не збиралася йти.
>
> **Пояснення:** *was leaving* — Past Continuous: дія в процесі в момент мого приходу. Порівняй: *had left* — уже пішла раніше; *left* — пішла після того, як я прийшов.

> [!quiz] Американець питає: *Did you eat yet?* Що правда?
> level: B2 · id: en-b2-tense-system-q12
> - [ ] Це помилка: з yet завжди лише Present Perfect.
> - [x] Це звичайна американська розмовна форма; у британській нормі й в IELTS Writing надійніше *Have you eaten yet?*
> - [ ] Так кажуть лише британці.
> - [ ] Це означає «Ти їв учора?»
>
> **Пояснення:** у США Past Simple з *just, already, yet* — норма розмовної мови. Британська норма і формальне письмо надають перевагу Present Perfect. Знати обидва варіанти — корисно для Listening, де звучать різні акценти.

### У форматі IELTS

> [!quiz] IELTS Reading — True, False or Not Given?
> level: B2 · tags: ielts · id: en-b2-tense-system-q13
>
> *When Northwind Software introduced a four-day week in 2022, most of its staff had already been working from home for two years. Since then, productivity has risen by 12 per cent, according to the company. Managers say they are now considering a similar scheme for their warehouse employees, although no decision has been made yet.*
>
> **Statement:** *Northwind staff started working from home after the four-day week was introduced.*
>
> - [ ] True
> - [x] False
> - [ ] Not Given
>
> **Пояснення:** *had already been working from home for two years* — Past Perfect Continuous: робота з дому почалася **до** 2022 року. Твердження перевертає порядок → **False**.

> [!quiz] IELTS Reading — True, False or Not Given?
> level: B2 · tags: ielts · id: en-b2-tense-system-q14
>
> *When Northwind Software introduced a four-day week in 2022, most of its staff had already been working from home for two years. Since then, productivity has risen by 12 per cent, according to the company. Managers say they are now considering a similar scheme for their warehouse employees, although no decision has been made yet.*
>
> **Statement:** *Warehouse employees at Northwind now work a four-day week.*
>
> - [ ] True
> - [x] False
> - [ ] Not Given
>
> **Пояснення:** *are now considering* (лише розглядають) + *no decision has been made yet* (рішення ще немає) → вони **не** працюють чотири дні. Текст прямо суперечить твердженню → **False**. Not Given було б, якби текст узагалі не згадував склад.

> [!quiz] IELTS Reading — Summary completion. Choose ONE word from the box for each gap.
> level: B2 · type: fill · bank: banned, decreased, ignoring · tags: ielts · id: en-b2-tense-system-q15
>
> *Electric scooters first appeared on the streets of Kyiv in 2019. At first, few people used them, but their popularity grew quickly during the next two years. Today the city council is discussing new rules, as the number of accidents involving scooters has also increased.*
>
> ```text fill
> Electric scooters were [[introduced]] in Kyiv in 2019.
> Their popularity [[increased]] rapidly over the following two years.
> At present, the city council is [[considering]] new regulations.
> Scooter [[accidents]] have also become more frequent.
> ```
>
> **Пояснення:** IELTS майже ніколи не повторює слова тексту — шукай перефраз: *first appeared* → *were introduced*; *grew quickly* → *increased rapidly*; *is discussing* → *is considering* (Present Continuous — процес, що триває зараз); *the number of accidents has increased* → *accidents have become more frequent*. *Banned, decreased, ignoring* суперечать тексту.

> [!quiz] IELTS Writing Task 1 — заверши опис графіка
> level: B2 · type: fill · bank: has doubled, rises · tags: ielts · id: en-b2-tense-system-q16
>
> *Графік показує кількість велосипедистів у місті з 1990 по 2020 рік і прогноз на 2040 рік.*
>
> ```text fill
> Between 1990 and 2010, the number of cyclists [[rose]] steadily.
> In the following decade, the figure [[fluctuated]] between 20,000 and 25,000.
> By 2040, the number [[will have doubled]] compared with 2020.
> ```
>
> **Пояснення:** весь період графіка (1990–2020) — у минулому, тож **Past Simple** (*rose, fluctuated*). Прогноз до точки в майбутньому — **Future Perfect** (*will have doubled*). *Has doubled* описувало б зміну до сьогодні, а *rises* — загальну істину; для минулих даних у Task 1 вони не підходять.

## Фішки

> [!reel] 🧮 А часів в англійській — лише два
> Багато лінгвістів рахують в англійському дієслові лише два часи, які видно в самій формі: минулий і теперішній (worked / work). Will — модальне дієслово, а continuous і perfect — «надбудови» з допоміжних. «12 часів» — зручна навчальна таблиця.

> [!reel] 🍔 I'm lovin' it
> Слоган McDonald's (2003) порушує «правило»: love — дієслово стану, і continuous з ним рідкісний. Але саме тому фраза звучить живо: «я кайфую просто зараз». Носії так грають аспектом свідомо.

> [!reel] 📈 Continuous стає популярнішим
> Корпусні дослідження британської й американської англійської XX століття показують: форм be + -ing стає дедалі більше, особливо в розмовній мові. Англійці все частіше «знімають відео», а не «фотографують» дію.

## Джерела та що почитати

- 🟢 R. Murphy — *English Grammar in Use* (Cambridge): розділи про present, past, perfect і future — як система.
- 🟢 [British Council LearnEnglish — B1–B2 grammar](https://learnenglish.britishcouncil.org/grammar/b1-b2-grammar) — tenses, continuous aspect, perfect aspect.
- 🟡 [Cambridge Dictionary — English Grammar Today](https://dictionary.cambridge.org/grammar/british-grammar/) — статті *Tense and aspect*, *Present perfect simple or past simple?*
- 🟡 M. Swan — *Practical English Usage*: tenses, progressive and perfective aspects.
- 🟡 [IELTS.org](https://ielts.org) — формат Writing Task 1 (графіки) і Speaking Part 3.

> [!important] Підсумок
> - Форма = **час** (перше допоміжне: *was / is / will*) + **аспект** (simple, continuous, perfect, perfect continuous).
> - **Simple** — подія цілком; **Continuous** (*be + -ing*) — процес, тимчасове, фон; **Perfect** (*have + V3*) — погляд назад від точки відліку; **Perfect Continuous** (*have been + -ing*) — тривалість до точки.
> - Present Perfect не вживається з завершеним часом (*yesterday, ago, in 2019*).
> - Українські вид і час не перекладаються напряму: думай про точку відліку й про те, як ти бачиш дію.
> - IELTS Task 1: минулі дані — Past Simple, зміни до тепер — Present Perfect, прогнози — *will / will have + V3*.
