---
title: Звʼязки — although, despite, whereas, however
order: 410
id: en-b2-linkers
level: B2
icon: px:link
tags: [english, b2, grammar, linkers, cohesion, writing, ielts]
prerequisites: ["[[English - B1 - 27. Письмо — лист, email, есе-думка]]", "[[English - B2 - 09. Підрядні речення — non-defining і скорочені]]"]
estimatedMinutes: 50
---

# Звʼязки — although, despite, whereas, however

> [!success] Після цієї теми ти зможеш
> - протиставляти трьома способами: ***Although** it rained…*, ***Despite** the rain…*, *It rained. **However**, …*;
> - порівнювати два факти через **whereas / while** і не плутати це з *on the contrary*;
> - показувати причину, результат, мету й умову: *owing to, consequently, so that, provided that*;
> - ставити правильну пунктуацію біля звʼязок і не склеювати речення комою;
> - розуміти критерій IELTS **Coherence & Cohesion** і писати абзац без «механічних» звʼязок (B2 ≈ IELTS 5.5–6.5).

## Передбач

> [!quiz] «Попри дощ, ми пішли гуляти». Як сказати?
> level: B2 · id: en-b2-linkers-q01
> - [ ] Despite of the rain, we went for a walk.
> - [x] Despite the rain, we went for a walk.
> - [ ] Despite it was raining, we went for a walk.
> - [ ] Although the rain, we went for a walk.
>
> **Пояснення:** **despite** — прийменник: після нього **іменник** (*the rain*) або **-ing**, і **без** *of*. *In spite **of*** — з *of*. Повне речення (*it was raining*) — лише після **although** або *despite **the fact that***.

## Простими словами

Звʼязки (linkers, linking words) — це «шви» між думками. Українською «хоча», «попри», «однак» — різні слова, але ми рідко думаємо, як вони поводяться в реченні. В англійській це критично: звʼязки з **однаковим змістом** мають **різну граматику**.

Усі звʼязки діляться на три групи — і саме від групи залежить, що стоїть після них і де ставити кому:

1. **Сполучники** — зʼєднують два речення в одне: *although, even though, whereas, while, because, so that, unless*. Після них — **підмет + дієслово**.
2. **Прийменники** — після них **іменник** або **-ing**: *despite, in spite of, because of, due to, owing to*.
3. **Звʼязки речень** (прислівники) — починають **нове речення** (або йдуть після крапки з комою) і відокремлюються комою: *however, nevertheless, therefore, consequently, moreover, in contrast*.

> [!diagram] Три граматичні групи звʼязок
> ```yaml
> layout: tree
> nodes:
>   - { id: root, label: "звʼязка", text: "що стоїть після неї?", tone: gray }
>   - { id: conj, parent: root, label: "сполучник: + підмет + дієслово", text: "although, even though, whereas, while", note: "Although it rained, we went out.", tone: blue }
>   - { id: prep, parent: root, label: "прийменник: + іменник / -ing", text: "despite, in spite of, because of, owing to", note: "Despite the rain, we went out.", tone: green }
>   - { id: adv, parent: root, label: "нове речення + кома", text: "however, nevertheless, therefore, moreover", note: "It rained. However, we went out.", tone: orange }
> steps:
>   - { focus: root, note: "Перш ніж обрати звʼязку, подивись, що в тебе далі: ціле речення чи лише іменник?" }
>   - { focus: conj, note: "Сполучник «приклеює» підрядне речення: although + it rained. Два речення стають одним." }
>   - { focus: prep, note: "Прийменник тягне іменник чи -ing: despite the rain, despite feeling tired. Повного речення після нього не буває." }
>   - { focus: adv, note: "However і компанія звʼязують окремі речення. Перед ними — крапка (або ;), після — кома." }
> ```

## Пояснення

### Контраст і поступка: хоча, попри, однак

| Звʼязка | Група | Приклад | Переклад |
|---|---|---|---|
| **although / even though** | сполучник | **Although** it was late, we kept working. | Хоча було пізно, ми працювали далі. |
| **though** | сполучник; у кінці — розмовне «втім» | It was cold. We enjoyed it, **though**. | Було холодно. Утім, нам сподобалося. |
| **despite / in spite of** | прийменник | **Despite** the cold / **In spite of** feeling ill, she came. | Попри холод / Попри те, що їй було зле, вона прийшла. |
| **despite the fact that** | прийменник + речення | **Despite the fact that** it was cold, … | Попри те, що було холодно, … |
| **however** | нове речення | It was expensive. **However**, it was worth it. | Це було дорого. Однак воно було того варте. |
| **nevertheless / nonetheless** | нове речення, формально | The plan is risky. **Nevertheless**, we will try. | План ризикований. Попри це, ми спробуємо. |

**Even though** — сильніше за *although*: «хоча **й**». А **even if** — це інше: «**навіть якщо**» (умова, а не факт): *I'll go **even if** it rains* — піду, навіть якщо піде дощ (невідомо, чи піде). *I went **even though** it was raining* — пішов, хоча дощ ішов (факт).

> [!diagram] Одна думка — три конструкції
> ```yaml
> layout: flow
> nodes:
>   - { id: a, label: "although + речення", text: "Although it rained, the match went ahead.", tone: blue }
>   - { id: b, label: "despite + іменник", text: "?", tone: green }
>   - { id: c, label: "крапка + However,", text: "?", tone: orange }
> steps:
>   - { focus: a, note: "Вихідне речення: although + підмет + дієслово (it rained). Одне речення з комою посередині." }
>   - { move: { from: a, to: b, value: "it rained → the rain" }, set: { b: "Despite the rain, the match went ahead." }, note: "Для despite перетворюємо речення на іменник: it rained → the rain. Або -ing: despite raining — тут незграбно." }
>   - { move: { from: b, to: c, value: "два речення" }, set: { c: "It rained. However, the match went ahead." }, note: "However — це вже два речення: крапка, However, кома. Зміст той самий, граматика — різна." }
> ```

> [!quiz] Перевір себе: які речення правильні? Обери всі.
> level: B2 · type: multi · id: en-b2-linkers-q02
> - [x] In spite of the traffic, we arrived on time.
> - [ ] Despite of the traffic, we arrived on time.
> - [x] Despite leaving late, we arrived on time.
> - [ ] Despite we left late, we arrived on time.
> - [x] Despite the fact that we left late, we arrived on time.
>
> **Пояснення:** *despite* / *in spite of* + **іменник** (*the traffic*) або **-ing** (*leaving*); повне речення — тільки через *the fact that*. ~~*Despite of*~~ — суміш двох виразів.

### Порівняння двох фактів: whereas, while, in contrast

**Whereas** і **while** зіставляють два різні факти: *My brother loves football, **whereas** I prefer tennis.* — Мій брат обожнює футбол, **тоді як** я віддаю перевагу тенісу. На початку нового речення — ***In contrast*** / ***By contrast***: *Sales rose in Europe. **In contrast**, they fell in Asia.*

> [!warning] On the contrary ≠ «натомість», «навпаки» при порівнянні
> ***On the contrary*** заперечує щойно сказане: «— Was the film boring? — **On the contrary**, it was brilliant!» (Нудний? Зовсім навпаки!). Для **порівняння двох різних речей** вживай *whereas*, *while*, *in contrast*, *on the other hand*: ~~*Men prefer action films. On the contrary, women…*~~ → ***In contrast**, women…*

> [!quiz] Обери звʼязку: «У Києві влітку спекотно, тоді як у Лондоні — помірно»
> level: B2 · id: en-b2-linkers-q03
> - [x] Summers in Kyiv are hot, whereas in London they are mild.
> - [ ] Summers in Kyiv are hot, on the contrary in London they are mild.
> - [ ] Summers in Kyiv are hot, despite in London they are mild.
> - [ ] Summers in Kyiv are hot, however in London they are mild.
>
> **Пояснення:** порівняння двох фактів в одному реченні — **whereas** (або *while*). *On the contrary* — для заперечення, *despite* не бере речення, а *, however* посеред речення без крапки — comma splice.

### Причина і результат

| Значення | Сполучник (+ речення) | Прийменник (+ іменник) | Звʼязка речень |
|---|---|---|---|
| причина | because, as, since, **given that** | because of, due to, **owing to** | **for this reason** (у наступному реченні) |
| результат | so | — | therefore, **consequently**, **as a result**, **hence**, **thus** |

- ***Owing to** the strike, all flights were cancelled.* — Через страйк усі рейси скасували. (формально)
- *The delay was **due to** bad weather.* — Затримка була через погану погоду. (*due to* часто після *be*)
- ***Given that** he has no experience, his salary is quite high.* — Зважаючи на те, що досвіду в нього немає, зарплата в нього досить висока.
- *Fewer people use cash. **Consequently**, many banks are closing branches.* — Дедалі менше людей користуються готівкою. Як наслідок, багато банків закривають відділення.
- *The site is very old; **hence** the strict rules.* — Памʼятка дуже стара — звідси й суворі правила. (*hence* + іменник, книжно)

### Мета: щоб

| Звʼязка | Що далі | Приклад |
|---|---|---|
| **to / in order to / so as to** | V1 (однаковий підмет) | I got up early **in order to** catch the train. |
| **in order not to / so as not to** | V1 — заперечення | I left early **so as not to** miss the train. |
| **so that** | підмет + can / could / will / would | I left early **so that** I **wouldn't** miss the train. |

*So that* — коли підмети різні: *I'll speak slowly **so that** everyone **can** understand.* — Говоритиму повільно, щоб усі могли зрозуміти.

### Додавання й умова

- **Moreover / furthermore** (формально) — «більше того»: *The flat is cheap. **Moreover**, it's close to the metro.*
- **Besides** — «до того ж» (розмовніше): *I'm too tired to go out. **Besides**, it's raining.* Як прийменник = «окрім»: *Besides English, she speaks Polish.*
- **Similarly** — «так само»: *Prices rose in Lviv. **Similarly**, rents went up in Kyiv.*
- **Provided (that) / as long as** — «за умови, що»: *You can borrow my car **as long as** you bring it back by six.*
- **Admittedly** — «треба визнати»: ***Admittedly**, the plan is expensive. However, …* — ідеально для поступки в есе.

### Пунктуація звʼязок

| Тип | Схема | Приклад |
|---|---|---|
| сполучник на початку | **Although** A, B. | *Although it was late, we stayed.* |
| сполучник посередині | A **although** B. (кома необовʼязкова; перед *whereas* — зазвичай кома) | *We stayed although it was late.* |
| звʼязка речень | A. **However**, B. / A; **however**, B. | *It was late. However, we stayed.* |
| звʼязка речень усередині | A. B, **however**, C. | *The rest of us, however, stayed.* |

> [!quiz] Перевір себе: although, despite чи however?
> level: B2 · type: fill · bank · id: en-b2-linkers-q04 · bank: in spite, whereas
>
> ```text fill
> [[Although]] he had a cold, he ran the marathon.
> [[Despite]] his cold, he ran the marathon.
> He had a cold. [[However]], he ran the marathon.
> ```
>
> **Пояснення:** *although* + **речення** (*he had a cold*); *despite* + **іменник** (*his cold*); *However* — **нове речення** з комою. *In spite* без *of* не працює.

## Приклади

- **Even though** I'd set two alarms, I overslept. — Хоча я поставив два будильники, я все одно проспав.
- **In spite of** the bad reviews, the film was a huge success. — Попри погані відгуки, фільм мав величезний успіх.
- My sister is an early bird, **whereas** I'm a night owl. — Моя сестра — жайворонок, а я — сова.
- The company lost its biggest client. **Consequently**, twenty people lost their jobs. — Компанія втратила найбільшого клієнта. Як наслідок, двадцять людей утратили роботу.
- **Owing to** heavy snow, the school will be closed tomorrow. — Через сильний снігопад школа завтра буде зачинена.
- I wrote the address down **so that** I wouldn't forget it. — Я записав адресу, щоб не забути.
- We took the motorway **so as to** save time. — Ми поїхали автомагістраллю, щоб зекономити час.
- You can stay **as long as** you keep the music down. — Можеш залишитися, якщо не вмикатимеш музику гучно.
- **Admittedly**, the course is expensive. **Nevertheless**, it's worth every penny. — Треба визнати, курс дорогий. Проте він вартий кожної копійки.
- **Given that** the meeting starts at nine, we should leave at eight. — Зважаючи на те, що зустріч о девʼятій, нам слід вийти о восьмій.
- He didn't apologise. **On the contrary**, he blamed me! — Він не вибачився. Навпаки, звинуватив мене!

## Слова

### Контраст і поступка

> [!word] whereas
> ipa: /weərˈæz/ · ipa-us: /werˈæz/ · pos: conj · level: B2 · id: en-b2-linkers-w01
> uk: тоді як, а
> example: I like spicy food, **whereas** my husband can't stand it. — Я люблю гостре, а мій чоловік його терпіти не може.
> note: порівнює два факти; формальніше за while.

> [!word] whilst
> ipa: /waɪlst/ · pos: conj · level: B2 · id: en-b2-linkers-w02
> uk: тоді як; поки
> example: **Whilst** some experts support the plan, others are sceptical. — Тоді як одні експерти підтримують план, інші налаштовані скептично.
> note: британське й формальне = while; в американській звучить старомодно.

> [!word] in spite of
> ipa: /ɪn ˈspaɪt əv/ · pos: prep · level: B2 · id: en-b2-linkers-w03
> uk: попри, незважаючи на
> example: **In spite of** the noise, the baby slept well. — Попри шум, малюк добре спав.
> note: in spite **of** = despite (без of). Далі — іменник або -ing.

> [!word] even though
> ipa: /ˈiː.vən ðəʊ/ · ipa-us: /ˈiː.vən ðoʊ/ · pos: conj · level: B2 · id: en-b2-linkers-w04
> uk: хоча й, незважаючи на те що
> example: She went to work **even though** she had a fever. — Вона пішла на роботу, хоча мала температуру.
> note: сильніше за although; про факт. Не плутай з even if.

> [!word] even if
> ipa: /ˈiː.vən ɪf/ · pos: conj · level: B2 · id: en-b2-linkers-w05
> uk: навіть якщо
> example: I'll finish this today, **even if** I have to stay up all night. — Я закінчу це сьогодні, навіть якщо доведеться не спати всю ніч.
> note: умова (може статися чи ні), а не факт.

> [!word] though
> ipa: /ðəʊ/ · ipa-us: /ðoʊ/ · pos: conj · level: B2 · id: en-b2-linkers-w06
> uk: хоча; утім (у кінці речення)
> example: The hotel was a bit noisy. Great location, **though**. — Готель був трохи галасливий. Зате розташування чудове.
> note: розмовне; у кінці речення = however. th — /ð/, дзвінке.

> [!word] nevertheless
> ipa: /ˌnev.ə.ðəˈles/ · ipa-us: /ˌnev.ɚ.ðəˈles/ · pos: adv · level: B2 · id: en-b2-linkers-w07
> uk: проте, однак, все ж
> example: The risks are high. **Nevertheless**, we have decided to go ahead. — Ризики високі. Проте ми вирішили продовжувати.
> note: формальніше й сильніше за however; одне слово.

> [!word] nonetheless
> ipa: /ˌnʌn.ðəˈles/ · pos: adv · level: B2 · id: en-b2-linkers-w08
> uk: проте, однаково
> example: It was a difficult year. **Nonetheless**, the company made a profit. — Рік був важкий. Однак компанія отримала прибуток.
> note: синонім nevertheless; часто й у кінці: It was hard but worth it **nonetheless**.

> [!word] in contrast
> ipa: /ɪn ˈkɒn.trɑːst/ · ipa-us: /ɪn ˈkɑːn.træst/ · pos: phrase · level: B2 · id: en-b2-linkers-w09
> uk: на противагу, натомість
> example: Rents rose by 10 % in Kyiv. **In contrast**, they fell in smaller towns. — Оренда в Києві зросла на 10 %. Натомість у малих містах вона подешевшала.
> note: також by contrast; in contrast to sth — на відміну від.

> [!word] on the contrary
> ipa: /ɒn ðə ˈkɒn.trə.ri/ · ipa-us: /ɑːn ðə ˈkɑːn.tre.ri/ · pos: phrase · level: B2 · id: en-b2-linkers-w10
> uk: навпаки (заперечуючи сказане)
> example: "Was it boring?" "**On the contrary**, it was fascinating!" — «Було нудно?» — «Навпаки, дуже цікаво!»
> note: не для порівняння двох речей — для цього in contrast / whereas.

> [!word] admittedly
> ipa: /ədˈmɪt.ɪd.li/ · pos: adv · level: B2 · id: en-b2-linkers-w11
> uk: щоправда, треба визнати
> example: **Admittedly**, the flat is small, but it's in a great area. — Щоправда, квартира маленька, але в чудовому районі.
> note: поступка перед контраргументом; в есе — Admittedly… However…

### Причина й результат

> [!word] owing to
> ipa: /ˈəʊ.ɪŋ tə/ · ipa-us: /ˈoʊ.ɪŋ tə/ · pos: prep · level: B2 · id: en-b2-linkers-w12
> uk: через, унаслідок
> example: The concert was postponed **owing to** the singer's illness. — Концерт перенесли через хворобу співака.
> note: формально; + іменник. Розмовне — because of.

> [!word] given that
> ipa: /ˈɡɪv.ən ðæt/ · pos: conj · level: B2 · id: en-b2-linkers-w13
> uk: зважаючи на те, що; оскільки
> example: **Given that** you've never been there, you should take a map. — Зважаючи на те, що ти там ніколи не був, візьми мапу.
> note: також given + іменник: given the circumstances — за таких обставин.

> [!word] for this reason
> ipa: /fə ðɪs ˈriː.zən/ · ipa-us: /fɚ ðɪs ˈriː.zən/ · pos: phrase · level: B2 · id: en-b2-linkers-w14
> uk: з цієї причини, тому
> example: Many students work part-time. **For this reason**, lectures are recorded. — Багато студентів підробляють. Тому лекції записують.
> note: звʼязує з попереднім реченням; корисне в есе замість чергового therefore.

> [!word] consequently
> ipa: /ˈkɒn.sɪ.kwənt.li/ · ipa-us: /ˈkɑːn.sə.kwənt.li/ · pos: adv · level: B2 · id: en-b2-linkers-w15
> uk: отже, як наслідок
> example: He didn't revise. **Consequently**, he failed the exam. — Він не повторював матеріал. Як наслідок, провалив іспит.
> note: consequence — наслідок. Наголос на першому складі: CON-se-quent-ly.

> [!word] as a result
> ipa: /əz ə rɪˈzʌlt/ · pos: phrase · level: B2 · id: en-b2-linkers-w16
> uk: у результаті, як наслідок
> example: The road was blocked. **As a result**, we were two hours late. — Дорогу перекрили. У результаті ми запізнилися на дві години.
> note: as a result **of** + іменник: as a result of the storm.

> [!word] hence
> ipa: /hens/ · pos: adv · level: B2 · id: en-b2-linkers-w17
> uk: звідси, тому
> example: The town is built on seven hills, **hence** its nickname. — Місто стоїть на семи пагорбах — звідси й прізвисько.
> note: книжне; часто + іменник без дієслова.

> [!word] thus
> ipa: /ðʌs/ · pos: adv · level: B2 · id: en-b2-linkers-w18
> uk: таким чином, отже
> example: The new engine uses less fuel and **thus** produces fewer emissions. — Новий двигун споживає менше пального і, отже, дає менше викидів.
> note: формально, для письма. th — дзвінке /ð/.

### Мета й умова

> [!word] in order to
> ipa: /ɪn ˈɔː.də tə/ · ipa-us: /ɪn ˈɔːr.dɚ tə/ · pos: phrase · level: B2 · id: en-b2-linkers-w19
> uk: для того щоб
> example: She saved money **in order to** study abroad. — Вона відкладала гроші, щоб навчатися за кордоном.
> note: + V1; заперечення — in order not to. У розмові частіше просто to.

> [!word] so as to
> ipa: /səʊ əz tə/ · ipa-us: /soʊ əz tə/ · pos: phrase · level: B2 · id: en-b2-linkers-w20
> uk: щоб, для того щоб
> example: We spoke quietly **so as not to** wake the baby. — Ми говорили тихо, щоб не розбудити малюка.
> note: найчастіше в запереченні: so as not to + V1.

> [!word] so that
> ipa: /səʊ ðæt/ · ipa-us: /soʊ ðæt/ · pos: conj · level: B2 · id: en-b2-linkers-w21
> uk: щоб, для того щоб
> example: I'll send you the link **so that** you can join the call. — Я надішлю тобі посилання, щоб ти міг приєднатися до дзвінка.
> note: + підмет + can / could / will / would; зручно, коли підмети різні.

> [!word] provided that
> ipa: /prəˈvaɪ.dɪd ðæt/ · pos: conj · level: B2 · id: en-b2-linkers-w22
> uk: за умови, що
> example: You can take the day off, **provided that** you finish the report first. — Можеш узяти вихідний за умови, що спершу закінчиш звіт.
> note: також providing (that); формальніше за as long as.

> [!word] as long as
> ipa: /əz ˈlɒŋ əz/ · ipa-us: /əz ˈlɑːŋ əz/ · pos: conj · level: B2 · id: en-b2-linkers-w23
> uk: якщо тільки, за умови що
> example: You can borrow my bike **as long as** you're careful with it. — Можеш узяти мій велосипед, якщо будеш з ним обережний.
> note: має й буквальне значення — «доки»: as long as I live.

### Додавання, підсумок, звʼязність

> [!word] moreover
> ipa: /mɔːˈrəʊ.və/ · ipa-us: /mɔːrˈoʊ.vɚ/ · pos: adv · level: B2 · id: en-b2-linkers-w24
> uk: більше того, крім того
> example: The plan is cheap. **Moreover**, it can be put into practice quickly. — План дешевий. Більше того, його можна швидко втілити.
> note: формально; додає сильніший аргумент. Не став на початок кожного речення.

> [!word] furthermore
> ipa: /ˌfɜː.ðəˈmɔː/ · ipa-us: /ˈfɝː.ðɚ.mɔːr/ · pos: adv · level: B2 · id: en-b2-linkers-w25
> uk: крім того, до того ж
> example: The software is free. **Furthermore**, it's easy to use. — Програма безкоштовна. До того ж нею легко користуватися.
> note: синонім moreover; в есе чергуй з in addition і what's more.

> [!word] besides
> ipa: /bɪˈsaɪdz/ · pos: adv · level: B2 · id: en-b2-linkers-w26
> uk: до того ж; окрім (як прийменник)
> example: I don't want to go. **Besides**, I've got nothing to wear. — Я не хочу йти. До того ж мені нема чого вдягнути.
> note: розмовніше за moreover. Не плутай з beside — поруч.

> [!word] similarly
> ipa: /ˈsɪm.ɪ.lə.li/ · ipa-us: /ˈsɪm.ə.lɚ.li/ · pos: adv · level: B2 · id: en-b2-linkers-w27
> uk: так само, аналогічно
> example: Coffee prices rose in 2022. **Similarly**, tea became more expensive. — Ціни на каву зросли 2022 року. Так само подорожчав і чай.
> note: показує схожість — протилежність in contrast.

> [!word] in other words
> ipa: /ɪn ˈʌð.ə wɜːdz/ · ipa-us: /ɪn ˈʌð.ɚ wɝːdz/ · pos: phrase · level: B2 · id: en-b2-linkers-w28
> uk: іншими словами, тобто
> example: The project is over budget. **In other words**, we've run out of money. — Проєкт вийшов за межі бюджету. Іншими словами, гроші скінчилися.
> note: пояснює простіше те, що щойно сказано.

> [!word] to sum up
> ipa: /tə sʌm ˈʌp/ · pos: phrase · level: B2 · id: en-b2-linkers-w29
> uk: підсумовуючи, отже
> example: **To sum up**, the benefits of the scheme clearly outweigh the costs. — Отже, переваги програми явно переважають витрати.
> note: синонім in conclusion; у висновку есе нових аргументів не додають.

> [!word] cohesion
> ipa: /kəʊˈhiː.ʒən/ · ipa-us: /koʊˈhiː.ʒən/ · pos: noun · level: B2 · id: en-b2-linkers-w30
> uk: звʼязність (тексту), згуртованість
> example: Linking words and pronouns give a text **cohesion**. — Звʼязки й займенники роблять текст звʼязним.
> note: IELTS: Coherence & Cohesion — один із чотирьох критеріїв Writing і Speaking (там — Fluency & Coherence). coherent — логічний.

## Слухаємо

> [!listen] Що ти почув?
> level: B2 · type: choice · id: en-b2-linkers-l01
> audio: Despite the heavy rain, the match went ahead.
> - [x] Despite the heavy rain, the match went ahead.
> - [ ] Because of the heavy rain, the match was cancelled.
> - [ ] Despite the heavy rain, the match was called off.
>
> **Пояснення:** *despite* — «попри»: матч **відбувся** (*went ahead*). *Called off* — «скасували», протилежний зміст.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: en-b2-linkers-l02
> audio: Although she was exhausted, she kept working until midnight.

> [!listen] IELTS Listening · Part 3: чим відрізняються дві статті?
> level: B2 · type: answer · tags: ielts · id: en-b2-linkers-l03
> audio: A: So, which article should we use for the presentation?
> audio: B: Well, the first one focuses on the costs of tourism, whereas the second looks at the benefits for local people.
> audio: A: Right. Nevertheless, neither of them has recent data, so we'll need a third source.
> - [ ] Обидві статті — про витрати на туризм
> - [x] Перша — про витрати, друга — про користь для місцевих
> - [ ] Друга стаття має свіжіші дані
> - [ ] Студенти вирішили використати лише першу статтю
>
> **Пояснення:** *whereas* зіставляє дві статті: *costs* проти *benefits for local people*. *Nevertheless, neither of them has recent data* — у **жодній** немає свіжих даних, тож третій варіант хибний. У Part 3 звʼязки — головні сигнали: *whereas* (порівняння), *nevertheless* (поворот).

> [!listen] IELTS Listening · Part 4: що сталося через новий податок?
> level: B2 · type: answer · tags: ielts · id: en-b2-linkers-l04
> audio: In 2018, the city introduced a tax on plastic bags. As a result, their use fell by almost 80 percent within a year. However, the sale of thicker reusable bags rose sharply, so the total amount of plastic did not fall as much as expected.
> - [ ] Продаж товстих багаторазових пакетів упав
> - [x] Використання пластикових пакетів скоротилося майже на 80 %
> - [ ] Загальна кількість пластику зменшилася на 80 %
> - [ ] Податок скасували через рік
>
> **Пояснення:** *As a result* — пряма відповідь: *their use fell by almost 80 percent*. Далі *However* попереджає про поворот: загальна кількість пластику впала **менше**, ніж очікували, — пастка для неуважних.

## Вимова

> [!speak] Скажи вголос
> level: B2 · id: en-b2-linkers-s01
> text: Despite the rain, we had a great time.
> ipa: /dɪˈspaɪt ðə reɪn wi hæd ə ɡreɪt taɪm/
> tip: de-SPITE — наголос на другому складі; після despite коротка пауза не потрібна — лише після the rain.
> uk: Попри дощ, ми чудово провели час.

> [!speak] Скажи вголос
> level: B2 · id: en-b2-linkers-s02
> text: Although it was expensive, it was worth it.
> ipa: /ɔːlˈðəʊ ɪt wəz ɪkˈspen.sɪv ɪt wəz ˈwɜːθ ɪt/
> tip: although — /ð/ дзвінке, наголос на другому складі [ол-ДЗОУ]; worth — /ɜː/ і глухе /θ/ в кінці.
> uk: Хоча це було дорого, воно було того варте.

> [!speak] Скажи вголос
> level: B2 · id: en-b2-linkers-s03
> text: You can borrow my car as long as you drive carefully.
> ipa: /juː kən ˈbɒr.əʊ maɪ kɑː əz ˈlɒŋ əz juː draɪv ˈkeə.fəl.i/
> tip: as long as — обидва as слабкі [əz], наголос лише на LONG; can — слабке [кəн].
> uk: Можеш позичити мою машину, якщо їздитимеш обережно.

> [!speak] IELTS Speaking · Part 3 — поступка й контраргумент
> level: B2 · id: en-b2-linkers-s04
> text: Admittedly, online learning is convenient. Nevertheless, I think nothing can replace a real classroom.
> ipa: /ədˈmɪt.ɪd.li ˈɒn.laɪn ˈlɜː.nɪŋ ɪz kənˈviː.ni.ənt ˌnev.ə.ðəˈles aɪ θɪŋk ˈnʌθ.ɪŋ kən rɪˈpleɪs ə rɪəl ˈklɑːs.ruːm/
> tip: питання Part 3 — «Will online learning replace traditional schools?». Admittedly… Nevertheless… — визнаєш інший бік і повертаєшся до своєї думки: так звучить розвинена відповідь (Fluency & Coherence). ne-ver-the-LESS — наголос на останньому складі.
> uk: Треба визнати, онлайн-навчання зручне. Проте, на мою думку, ніщо не замінить справжнього класу.

## Типові помилки українців

> [!pitfall] «Despite of», «despite it was…»
> **Despite** — без *of*: *despite the rain*. **In spite of** — з *of*. І після обох — **іменник або -ing**, не речення: ~~*despite it was raining*~~ → *despite **the rain*** / *despite **the fact that** it was raining* / ***although** it was raining*.

> [!pitfall] «Although…, but…»
> Українське «хоча…, але…» — нормальна пара, а в англійській **одна** звʼязка на одне протиставлення: ~~*Although it was late, but we stayed*~~ → ***Although** it was late, we stayed* або *It was late, **but** we stayed*. Те саме з *because… so…*: ~~*Because it rained, so we stayed*~~.

> [!pitfall] «It was late, however we stayed» — кома замість крапки
> **However** — не сполучник, а звʼязка речень. Перед нею — **крапка** або **крапка з комою**, після — кома: *It was late**. However,** we stayed.* / *It was late**; however,** we stayed.* Кома перед *however* «склеює» два речення (comma splice) — у IELTS це помилка Grammatical Accuracy.

> [!pitfall] «On the contrary» для порівняння
> «Навпаки» українською вживається широко, але ***on the contrary*** лише **заперечує** попереднє твердження. Щоб зіставити дві різні речі, бери ***in contrast***, ***whereas*** або ***on the other hand***: *Cats are independent. **In contrast**, dogs need constant attention.*

## Практика

> [!quiz] «Я піду на вечірку, навіть якщо вона буде нудною». Обери звʼязку.
> level: B2 · id: en-b2-linkers-q05
> - [ ] I'll go to the party even though it's boring.
> - [x] I'll go to the party even if it's boring.
> - [ ] I'll go to the party despite it's boring.
> - [ ] I'll go to the party although if it's boring.
>
> **Пояснення:** «навіть **якщо**» — умова, ще невідомо, чи буде нудно → **even if**. *Even though* — про факт («хоча вона нудна»). *Despite* не бере речення.

> [!quiz] Мета: обери звʼязку
> level: B2 · type: fill · bank · id: en-b2-linkers-q06 · bank: because, despite
>
> ```text fill
> I set an alarm [[so that]] I wouldn't oversleep.
> She took notes [[in order to]] remember the details.
> We whispered [[so as not to]] wake the children.
> ```
>
> **Пояснення:** **so that** + підмет + *would(n't)*; **in order to** + V1; **so as not to** + V1 — заперечна мета. *Because* — причина, а не мета.

> [!quiz] Склади речення: «Попри те, що їй було зле, вона пішла на роботу»
> level: B2 · type: order · id: en-b2-linkers-q07
>
> ```text order
> In spite of
> feeling ill,
> she went
> to work.
> she felt ill, // ✗
> ```
>
> **Пояснення:** *in spite of* + **-ing** (*feeling ill*). Повне речення *she felt ill* після *in spite of* неможливе.

> [!quiz] Склади речення: «Ми вийшли раніше, щоб не пропустити потяг»
> level: B2 · type: order · id: en-b2-linkers-q08
>
> ```text order
> We left early
> so that
> we wouldn't
> miss the train.
> ```
>
> **Пояснення:** *so that* + підмет + **would(n't)** + V1 для мети в минулому.

> [!quiz] Де пунктуація правильна?
> level: B2 · id: en-b2-linkers-q09
> - [ ] The hotel was lovely, however the food was terrible.
> - [x] The hotel was lovely. However, the food was terrible.
> - [ ] The hotel was lovely however, the food was terrible.
> - [ ] The hotel was lovely. However the food, was terrible.
>
> **Пояснення:** **However** починає нове речення: крапка перед, кома після. Можна й *The hotel was lovely; however, the food was terrible.*

> [!quiz] Перепиши, зберігши зміст
> level: B2 · type: fill · id: en-b2-linkers-q10
>
> ```text fill
> Although the hotel was expensive, we stayed there. → Despite [[the]] high price of the hotel, we stayed there.
> Although he was tired, he finished the race. → In spite [[of]] being tired, he finished the race.
> She trained hard. However, she didn't win. → [[Although|Even though|Though]] she trained hard, she didn't win.
> Tom loves cities. His wife prefers the countryside. → Tom loves cities, [[whereas|while|whilst]] his wife prefers the countryside.
> ```
>
> **Пояснення:** *despite* + іменникова група (*the high price*); *in spite **of*** + -ing; *however* → сполучник *although / even though*; два факти в одному реченні — *whereas / while*.

> [!quiz] Які речення про результат правильні? Обери всі.
> level: B2 · type: multi · id: en-b2-linkers-q11
> - [x] The factory closed. Consequently, many people lost their jobs.
> - [x] As a result of the factory closing, many people lost their jobs.
> - [ ] The factory closed, consequently many people lost their jobs.
> - [x] The factory closed, so many people lost their jobs.
> - [ ] Owing to the factory closed, many people lost their jobs.
>
> **Пояснення:** *Consequently* — нове речення з комою ✓; *as a result **of*** + -ing ✓; *so* — сполучник, кома перед ним ✓. *, consequently* без крапки — comma splice; *owing to* + **іменник / -ing** (*owing to the factory closing* або *owing to the closure*), а не речення.

> [!quiz] «Was the exam difficult?» — «…, it was surprisingly easy.» Обери звʼязку.
> level: B2 · id: en-b2-linkers-q12
> - [ ] In contrast
> - [x] On the contrary
> - [ ] Whereas
> - [ ] Despite
>
> **Пояснення:** відповідь заперечує припущення співрозмовника («важкий?» — «навпаки, легкий») → **on the contrary**. *In contrast* і *whereas* порівнюють два різні факти, а *despite* — прийменник.

### Coherence & Cohesion простими словами

У IELTS Writing чверть оцінки — критерій **Coherence & Cohesion**:

| Частина | Що це | Як отримати бал |
|---|---|---|
| **Coherence** — логіка | чи легко стежити за думкою | одна головна ідея на абзац, логічний порядок: теза → пояснення → приклад |
| **Cohesion** — «нитки» між реченнями | як речення повʼязані одне з одним | точні звʼязки, займенники *this / these / such*, синоніми замість повторів, *the former / the latter* |

Що оцінюють за публічними дескрипторами (переказ своїми словами): на **Band 5** звʼязок мало, вони неточні або їх забагато; на **Band 6** звʼязки працюють, але іноді механічно чи з помилками; на **Band 7** — різноманітні звʼязки вжито доречно, хоча трапляються недоліки. Тобто бал дають за **точність і природність**, а не за кількість *Moreover* на абзац.

> [!diagram] Механічна і природна звʼязність
> ```yaml
> layout: compare
> columns: { mech: "механічно (≈ Band 5–6)", nat: "природно (≈ Band 7)" }
> nodes:
>   - { id: m1, col: mech, label: "речення 1", text: "Firstly, cars cause pollution.", tone: orange }
>   - { id: m2, col: mech, label: "речення 2", text: "Moreover, cars cause traffic jams.", tone: orange }
>   - { id: m3, col: mech, label: "речення 3", text: "Furthermore, cars are expensive.", tone: orange }
>   - { id: n1, col: nat, label: "речення 1", text: "Private cars are a major source of pollution in cities.", tone: green }
>   - { id: n2, col: nat, label: "речення 2", text: "They also cause traffic jams, which waste millions of working hours.", tone: green }
>   - { id: n3, col: nat, label: "речення 3", text: "For this reason, many cities now charge drivers to enter the centre.", tone: green }
> steps:
>   - { show: [m1, m2, m3], note: "Ліворуч кожне речення починається зі звʼязки, а слово cars повторюється тричі. Ідеї просто складено в купу — це «механічна» звʼязність." }
>   - { show: [n1, n2, n3], note: "Праворуч — займенник They замість повтору, which про попередню думку, For this reason веде до наслідку. Звʼязки — лише там, де вони несуть зміст." }
> ```

> [!quiz] IELTS Writing Task 2 · Який абзац краще за критерієм Coherence & Cohesion?
> level: B2 · tags: ielts · id: en-b2-linkers-q13
> - [ ] Firstly, social media is bad. Moreover, social media is addictive. Furthermore, social media is bad for sleep. In conclusion, social media is bad.
> - [x] Social media can be highly addictive. As a result, many teenagers spend hours scrolling at night, which affects their sleep and, consequently, their performance at school.
> - [ ] Social media is addictive, however teenagers use it, therefore they don't sleep, moreover their marks are bad.
> - [ ] Although social media is addictive, but teenagers use it at night.
>
> **Пояснення:** другий абзац — ланцюжок «причина → наслідок → ще один наслідок» з точними звʼязками (*As a result, which, consequently*) і без повторів. Перший — механічний (звʼязка на кожне речення, *social media* × 4), третій склеює речення комами, четвертий має ~~*Although…, but*~~.

> [!quiz] IELTS Writing Task 2 · Заповни абзац есе звʼязками
> level: B2 · type: fill · bank · tags: ielts · id: en-b2-linkers-q14 · bank: on the contrary, despite
>
> ```text fill
> Some people believe that public transport should be free. [[Admittedly]], this would cost the government a great deal of money.
> [[Nevertheless|Nonetheless|However]], I believe the benefits would be significant.
> Fewer people would drive into city centres. [[Consequently|As a result]], air quality would improve.
> In addition, poorer families would save money, [[whereas|while]] at present they spend a large part of their income on travel.
> ```
>
> **Пояснення:** *Admittedly* — поступка (визнаєш мінус); *Nevertheless* — поворот до своєї позиції; *Consequently* — наслідок; *whereas* — порівняння «тоді — зараз». *On the contrary* не підходить: нічого не заперечується; *despite* не може стояти перед реченням.

> [!quiz] IELTS Writing · Яка порада щодо Coherence & Cohesion правильна?
> level: B2 · tags: ielts · id: en-b2-linkers-q15
> - [ ] Почни кожне речення зі звʼязки — що більше, то вищий бал.
> - [x] Вживай звʼязки там, де вони показують логіку, а повтори замінюй займенниками й синонімами.
> - [ ] Пиши есе одним довгим абзацом, щоб думка не переривалася.
> - [ ] Обирай найрідкісніші звʼязки, навіть якщо не впевнений у значенні.
>
> **Пояснення:** механічні звʼязки на кожному реченні — ознака Band 5–6. Бал підіймають **точні** звʼязки, займенники (*this, they, such*), синоніми й чіткі абзаци. Неправильно вжита «розумна» звʼязка (*on the contrary* замість *in contrast*) шкодить більше, ніж просте *but*.

### У форматі IELTS Reading

*Many companies now allow staff to work from home. Supporters claim that this improves productivity; however, the evidence is far from clear. In my view, the real benefit is not productivity but flexibility, which allows parents to balance work and childcare. Admittedly, some employees feel isolated. Nevertheless, I believe the advantages clearly outweigh this drawback, provided that teams meet in person at least once a week.*

> [!quiz] IELTS Reading · Yes / No / Not Given: «There is strong evidence that working from home makes people more productive.»
> level: B2 · tags: ielts · id: en-b2-linkers-q16
> - [ ] Yes
> - [x] No
> - [ ] Not Given
>
> **Пояснення:** Yes / No / Not Given перевіряє **думку автора**. Автор пише *the evidence is far from clear* — чітких доказів **немає**. Твердження протилежне → **No**. Зверни увагу на *however*: після нього — власна позиція автора, а до нього — чужа (*Supporters claim*).

> [!quiz] IELTS Reading · Yes / No / Not Given: «Remote teams should meet face to face regularly.»
> level: B2 · tags: ielts · id: en-b2-linkers-q17
> - [x] Yes
> - [ ] No
> - [ ] Not Given
>
> **Пояснення:** *provided that teams meet in person at least once a week* — автор вважає регулярні зустрічі умовою успіху. *Face to face* = *in person*, *regularly* = *at least once a week* → **Yes**.

> [!quiz] IELTS Reading · Summary completion: обери слово з банку
> level: B2 · type: fill · bank · tags: ielts · id: en-b2-linkers-q18 · bank: productivity, salary
>
> ```text fill
> According to the writer, the main advantage of working from home is [[flexibility]].
> One disadvantage is that some workers feel [[isolated]].
> ```
>
> **Пояснення:** *the real benefit is **not productivity but flexibility*** — автор прямо відкидає *productivity*, це пастка. *Feel isolated* — недолік, який автор визнає через *Admittedly*. *Salary* у тексті немає.

> [!tip] IELTS Writing — спробуй сам
> **Task 2 (250+ слів).** *Some people believe that tourism brings more problems than benefits to local communities. To what extent do you agree or disagree?*
> Підказка: ***Admittedly**, … **Nevertheless**, … Tourism creates jobs, **whereas** … **Owing to** …, **Consequently**, … **Provided that** …* — і перевір: чи кожна звʼязка несе зміст?

## Фішки

> [!reel] 🧲 Cohesion — щоб текст «злипся»
> Cohesion походить від латинського cohaerere — «злипатися, триматися разом». Той самий корінь у coherent і adhesive (клейкий). Звʼязний текст буквально «склеєний».

> [!reel] 😤 Despite колись означало «зневага»
> Despite прийшло зі старофранцузького despit — «зневага», від латинського despectus, «погляд згори вниз». «In despite of» колись означало «на зло, всупереч». Of давно відпало — тому despite of сьогодні помилка.

> [!reel] 🇬🇧 Whilst — британський акцент на письмі
> Whilst майже не трапляється в американській англійській, де його вважають старомодним. У Британії воно звичне в офіційних текстах — одне слово видає, хто писав.

## Джерела та що почитати

- 🟢 R. Murphy — *English Grammar in Use* (Cambridge): units «although / though / even though / in spite of / despite», «in case», «unless / as long as», «to…, for…, and so that…».
- 🟢 [British Council LearnEnglish — B1–B2 grammar](https://learnenglish.britishcouncil.org/grammar/b1-b2-grammar) — contrasting ideas: although, despite, however.
- 🟡 [Cambridge Dictionary — English Grammar Today](https://dictionary.cambridge.org/grammar/british-grammar/) — *Linking words and expressions*, *On the contrary*, *Despite*.
- 🟡 M. Swan — *Practical English Usage*: discourse markers, contrast, purpose.
- 🟡 [IELTS — офіційний сайт](https://ielts.org) — публічні band descriptors Writing (Coherence & Cohesion).

> [!important] Підсумок
> - Три групи: **сполучник** + речення (*although, whereas, so that*), **прийменник** + іменник / -ing (*despite, in spite of, owing to*), **звʼязка речень** після крапки + кома (*however, nevertheless, consequently*).
> - ~~*despite of*~~, ~~*despite it was*~~ → *despite the rain / despite the fact that…*; ~~*Although…, but…*~~ — одна звʼязка.
> - *even though* — факт; *even if* — умова. *whereas / in contrast* — порівняння; *on the contrary* — заперечення.
> - Мета: *to / in order to / so as (not) to* + V1; *so that* + підмет + can / would.
> - Coherence & Cohesion: точні звʼязки + займенники й синоніми, без «Moreover» на кожному реченні.
