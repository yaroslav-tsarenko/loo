---
title: Наративні часи — Past Simple, Continuous і Perfect
order: 303
id: en-b1-narrative-tenses
level: B1
icon: px:book
tags: [english, b1, grammar, past-perfect, past-continuous, past-simple, storytelling]
prerequisites: ["[[English - A2 - 19. Past Continuous — дія в процесі в минулому]]", "[[English - B1 - 01. Теперішні часи — Simple чи Continuous, дієслова стану]]"]
estimatedMinutes: 45
---

# Наративні часи — Past Simple, Continuous і Perfect

> [!success] Після цієї теми ти зможеш
> - будувати Past Perfect — **had + V3** — і казати, що сталося **раніше** за інший момент у минулому;
> - розповідати історію трьома часами: фон (**was raining**), події (**I opened the door**), передісторія (**someone had broken in**);
> - відчувати різницю між **When I arrived, the train left** і **When I arrived, the train had left**;
> - уживати **by the time**, **already**, **never … before** у розповіді;
> - розповісти про невдалу поїздку в IELTS Speaking Part 2.

## Передбач

> [!quiz] «Коли ми приїхали на вокзал, потяг уже пішов». Як сказати?
> level: B1 · id: en-b1-narrative-tenses-q01
> - [ ] When we got to the station, the train already left.
> - [x] When we got to the station, the train had already left.
> - [ ] When we got to the station, the train was already leaving.
> - [ ] When we had got to the station, the train already left.
>
> **Пояснення:** потяг пішов **до того**, як ми приїхали. Щоб показати «ще раніше в минулому», англійська бере **Past Perfect**: *had left*. Якщо сказати *the train left*, вийде, що він рушив саме в момент нашого приїзду — ми встигли його побачити.

## Простими словами

Кожна історія в минулому має три «шари», і в англійській для кожного свій час:

- **Past Continuous — декорації.** Що відбувалося навколо: *It **was raining**. People **were hurrying** home.*
- **Past Simple — сюжет.** Події одна за одною, як кадри фільму: *I **got** home, **opened** the door and **switched on** the light.*
- **Past Perfect — флешбек.** Що сталося **ще раніше**, до моменту історії: *Someone **had broken** into the flat.*

В українській усе це — один минулий час: «йшов дощ», «я відчинив», «хтось уже заліз». Різницю передають слова «уже», «до того», «перед тим». В англійській її показує сам час дієслова.

> [!diagram] Три шари однієї історії
> ```yaml
> layout: timeline
> nodes:
>   - { id: perfect, at: "раніше", label: "Past Perfect — флешбек", text: "Someone had broken the window.", note: "сталося до моменту історії", tone: violet, icon: "px:hourglass" }
>   - { id: cont, at: "19:00–19:30", label: "Past Continuous — фон", text: "It was raining. I was walking home.", note: "декорації, процес", tone: blue }
>   - { id: s1, at: "19:30", label: "Past Simple — подія 1", text: "I got home.", tone: green }
>   - { id: s2, at: "19:31", label: "Past Simple — подія 2", text: "I saw the broken window.", tone: green }
>   - { id: s3, at: "19:32", label: "Past Simple — подія 3", text: "I called the police.", tone: green, icon: "px:phone" }
> steps:
>   - { show: cont, note: "Починаємо з декорацій: йшов дощ, я йшов додому. Процес — Past Continuous." }
>   - { show: [s1, s2, s3], note: "Сюжет: прийшов, побачив, подзвонив. Події по черзі — Past Simple." }
>   - { show: perfect, note: "А вікно розбили ще до того, як я прийшов. Повертаємося назад у часі — Past Perfect: had broken." }
>   - { focus: [perfect, s2], note: "Разом: When I got home, I saw that someone had broken the window. Past Perfect — це «минуле в минулому»." }
> ```

## Пояснення

### Форма Past Perfect: had + V3

| | Усі особи (I, you, he, she, it, we, they) |
|---|---|
| **+** | She **had (she'd) left**. · We **had (we'd) finished**. |
| **−** | I **hadn't (had not) seen** it. · They **hadn't arrived**. |
| **?** | **Had** you **met** him before? — Yes, I **had**. / No, I **hadn't**. |
| wh-? | Where **had** they **gone**? · What **had** happened? |

**had** — однакове для всіх осіб. **V3** — третя форма (*gone, seen, written, finished*).

> [!warning] I'd — це had чи would?
> **I'd** може бути і *I had*, і *I would*. Дивись, що далі: **I'd + V3** = had (*I'd **left***), **I'd + base form** = would (*I'd **leave***).

### Коли потрібен Past Perfect

Past Perfect потрібен **лише тоді, коли ми «відмотуємо» назад** від моменту історії. Якщо події йдуть по порядку, вистачає Past Simple.

| Ситуація | Приклад |
|---|---|
| **Подія раніше за інший момент у минулому** | When I got to the office, the meeting **had** already **started**. — Коли я прийшов, нарада вже почалася. |
| **by the time** — «до того часу, як» | By the time the police arrived, the thief **had escaped**. — Коли приїхала поліція, злодій уже втік. |
| **Досвід до певного моменту** (never / ever … before) | I **had never seen** the sea before that trip. — До тієї поїздки я ніколи не бачив моря. |
| **Причина** (because, as) | She was upset because she **had failed** her exam. — Вона засмутилася, бо провалила іспит. |
| **Думки, усвідомлення** (realise, remember, find out, discover) | I realised I **had left** my wallet at home. — Я зрозумів, що залишив гаманець удома. |

### When + Past Simple чи Past Perfect — різний зміст

> [!diagram] When we arrived, the film… started чи had started?
> ```yaml
> layout: compare
> columns: { simple: "when + Past Simple — одна за одною", perfect: "when + Past Perfect — уже сталося" }
> nodes:
>   - { id: s1, col: simple, label: "спершу ми, потім фільм", text: "When we arrived, the film started.", note: "Ми прийшли — і фільм почався (ми встигли).", tone: green }
>   - { id: p1, col: perfect, label: "спершу фільм, потім ми", text: "When we arrived, the film had started.", note: "Фільм уже йшов (ми запізнилися).", tone: violet }
>   - { id: s2, col: simple, label: "", text: "When I called her, she left.", note: "Я подзвонив — і тоді вона пішла.", tone: green }
>   - { id: p2, col: perfect, label: "", text: "When I called her, she had left.", note: "Вона пішла ще до мого дзвінка.", tone: violet }
> steps:
>   - { show: [s1], note: "Два Past Simple з when — події одна за одною, у тому порядку, як їх названо: прийшли, потім почався фільм." }
>   - { show: [p1], note: "Past Perfect перевертає порядок: фільм почався раніше, ніж ми прийшли. Ми запізнилися." }
>   - { show: [s2, p2], note: "Те саме з дзвінком: left — пішла після дзвінка (може, через нього?), had left — пішла ще до того, як я подзвонив." }
> ```

> [!tip] Не зловживай Past Perfect
> Після **after** і **before** порядок і так зрозумілий, тож Past Perfect необовʼязковий: *After I **finished** / **had finished** work, I went home* — обидва правильні. А в ланцюжку подій по порядку Past Perfect — помилка: ~~*I had got up, had had a shower and went to work*~~ → *I **got up**, **had** a shower and **went** to work.*

> [!quiz] Перевір себе: Past Simple чи Past Perfect?
> level: B1 · type: fill · bank · id: en-b1-narrative-tenses-q02
>
> ```text fill
> When I got to the cinema, the film [[had started]], so I missed the beginning.
> I [[opened]] the door, [[turned]] on the light and sat down.
> She didn't want to watch the film because she [[had seen]] it before.
> ```
>
> **Пояснення:** фільм почався **раніше** за мій прихід — *had started*; фільм бачила **до** цього вечора — *had seen*. Відчинив, увімкнув, сів — події по порядку, Past Simple.

### Розповідь: усі три часи разом

Типова структура історії англійською:

1. **Фон** — Past Continuous: *It **was** a cold evening. Snow **was falling**…*
2. **Події** — Past Simple: *Suddenly the phone **rang**. I **answered** it…*
3. **Передісторія й причини** — Past Perfect: *It was Anna. We **hadn't spoken** for years…*

> [!note] Past Perfect Continuous — для впізнавання
> Якщо дія **тривала** до моменту в минулому, кажуть *had been + -ing*: *We **had been waiting** for two hours when the bus finally came.* — Ми чекали вже дві години, коли нарешті приїхав автобус. Детальніше про «тривалість до моменту» — у темі про Present Perfect Continuous.

> [!quiz] Перевір себе: що сталося раніше?
> level: B1 · id: en-b1-narrative-tenses-q03
>
> *When Anna got to the party, Tom had gone home.*
>
> - [x] Том пішов, а потім прийшла Анна — вони не зустрілися
> - [ ] Анна прийшла, а потім пішов Том
> - [ ] Вони прийшли одночасно
> - [ ] Том пішов, бо прийшла Анна
>
> **Пояснення:** Past Perfect (*had gone*) — подія **раніша**. Том уже пішов, коли Анна прийшла.

## Приклади

- By the time I **woke up**, everyone **had** already **left**. — Коли я прокинувся, усі вже пішли.
- I **didn't recognise** him because he **had grown** a beard. — Я його не впізнав, бо він відпустив бороду.
- We **were having** dinner when we **heard** a loud noise outside. — Ми вечеряли, коли почули гучний шум надворі.
- She **had never flown** before, so she **was** a bit nervous. — Вона ніколи раніше не літала, тож трохи нервувала.
- When I **checked** my bag, I **realised** that I **had left** my passport at the hotel. — Коли я перевірив сумку, то зрозумів, що залишив паспорт у готелі.
- **Had** you **met** her before the wedding? — No, I **hadn't**. — Ти був знайомий з нею до весілля? — Ні.
- It **turned out** that the shop **had closed** an hour earlier. — Виявилося, що магазин зачинився на годину раніше.
- **Fortunately**, someone **had found** my phone and **handed** it in. — На щастя, хтось знайшов мій телефон і здав його.
- The roads **were** wet because it **had rained** all night. — Дороги були мокрі, бо всю ніч ішов дощ.
- I **got lost** because I **hadn't charged** my phone. — Я заблукав, бо не зарядив телефон.

## Слова

> [!word] by the time
> ipa: /baɪ ðə taɪm/ · pos: conj · level: B1 · id: en-b1-narrative-tenses-w01
> uk: до того часу, як; поки
> example: **By the time** we got to the beach, it had started to rain. — Коли ми дісталися пляжу, уже почався дощ.
> note: після by the time про минуле — Past Simple, у головній частині — часто Past Perfect.

> [!word] realise
> ipa: /ˈrɪə.laɪz/ · ipa-us: /ˈriː.ə.laɪz/ · pos: verb · level: B1 · id: en-b1-narrative-tenses-w02
> uk: усвідомити, зрозуміти (раптом)
> example: I suddenly **realised** that I'd left the oven on. — Я раптом зрозумів, що не вимкнув духовку.
> note: US spelling realize. Хибний друг: «реалізувати» — це carry out, achieve.

> [!word] earlier
> ipa: /ˈɜː.li.ə/ · ipa-us: /ˈɝː.li.ɚ/ · pos: adv · level: B1 · id: en-b1-narrative-tenses-w03
> uk: раніше, перед тим
> example: I called you **earlier**, but you didn't answer. — Я дзвонив тобі раніше, але ти не відповів.

> [!word] beforehand
> ipa: /bɪˈfɔː.hænd/ · ipa-us: /bɪˈfɔːr.hænd/ · pos: adv · level: B1 · id: en-b1-narrative-tenses-w04
> uk: заздалегідь, наперед
> example: We had booked the tickets **beforehand**, so we didn't have to queue. — Ми забронювали квитки заздалегідь, тож не довелося стояти в черзі.

> [!word] to my surprise
> ipa: /tə maɪ səˈpraɪz/ · ipa-us: /tə maɪ sɚˈpraɪz/ · pos: phrase · level: B1 · id: en-b1-narrative-tenses-w05
> uk: на мій подив, на диво
> example: **To my surprise**, the shop had already closed. — На мій подив, магазин уже зачинився.
> note: займенник змінюється: to her surprise, to everyone's surprise.

> [!word] fortunately
> ipa: /ˈfɔː.tʃən.ət.li/ · ipa-us: /ˈfɔːr.tʃən.ət.li/ · pos: adv · level: B1 · id: en-b1-narrative-tenses-w06
> uk: на щастя
> example: **Fortunately**, nobody was hurt. — На щастя, ніхто не постраждав.
> note: синонім — luckily.

> [!word] shocked
> ipa: /ʃɒkt/ · ipa-us: /ʃɑːkt/ · pos: adj · level: B1 · id: en-b1-narrative-tenses-w07
> uk: шокований, приголомшений
> example: We were **shocked** when we heard that the hotel had closed. — Ми були приголомшені, коли почули, що готель закрився.
> note: shocking — який шокує: shocking news.

> [!word] relieved
> ipa: /rɪˈliːvd/ · pos: adj · level: B1 · id: en-b1-narrative-tenses-w08
> uk: який відчув полегшення
> example: I was so **relieved** when they told me that someone had found my bag. — Яке ж полегшення я відчув, коли мені сказали, що хтось знайшов мою сумку!
> note: іменник relief: What a relief! — Яке полегшення!

> [!word] leave behind
> ipa: /liːv bɪˈhaɪnd/ · pos: verb · level: B1 · id: en-b1-narrative-tenses-w09
> uk: залишити, забути (десь)
> forms: leave → left → left
> example: I realised I had **left** my umbrella **behind** in the taxi. — Я зрозумів, що забув парасольку в таксі.

> [!word] rush
> ipa: /rʌʃ/ · pos: verb · level: B1 · id: en-b1-narrative-tenses-w10
> uk: поспішати, мчати
> example: We **rushed** to the station, but the train had already gone. — Ми помчали на вокзал, але потяг уже пішов.
> note: іменник: the rush hour — година пік.

> [!word] panic
> ipa: /ˈpæn.ɪk/ · pos: verb · level: B1 · id: en-b1-narrative-tenses-w11
> uk: панікувати
> forms: panic → panicked → panicked
> example: Don't **panic** — I've got a spare key. — Не панікуй, у мене є запасний ключ.
> note: у формах додається k: panicked, panicking.

> [!word] lock yourself out
> ipa: /lɒk jɔːˈself ˈaʊt/ · ipa-us: /lɑːk jɚˈself ˈaʊt/ · pos: phrase · level: B1 · id: en-b1-narrative-tenses-w12
> uk: зачинити двері й лишитися без ключів (ключі всередині)
> forms: lock → locked → locked
> example: I **locked myself out** and had to call my landlord. — Я зачинив двері, а ключі лишилися всередині, тож довелося дзвонити орендодавцю.
> note: займенник змінюється: she locked herself out, we locked ourselves out.

## Слухаємо

> [!listen] Що ти почув?
> level: B1 · type: choice · id: en-b1-narrative-tenses-l01
> audio: I'd already eaten when they arrived.
> - [ ] I already ate when they arrived.
> - [x] I'd already eaten when they arrived.
> - [ ] I was already eating when they arrived.

> [!listen] Що ти почув?
> level: B1 · type: choice · id: en-b1-narrative-tenses-l02
> audio: By the time we got there, the shop had closed.
> - [ ] By the time we got there, the shop closed.
> - [ ] By the time we got there, the shop was closing.
> - [x] By the time we got there, the shop had closed.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: en-b1-narrative-tenses-l03
> audio: She realised she had left her phone at home.
> accept: She realised she'd left her phone at home. | She realized she had left her phone at home.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: en-b1-narrative-tenses-l04
> audio: I had never seen snow before.
> accept: I'd never seen snow before.

> [!listen] Чому Ліза з Марком не полетіли?
> level: B1 · type: answer · id: en-b1-narrative-tenses-l05
> audio: A: So how was your trip to Rome?
> audio: B: Don't ask! When we got to the airport, our plane had already left.
> audio: A: What? Were you late?
> audio: B: No, we were on time, but Mark had written down the wrong departure time.
> - [ ] Вони запізнилися через затор
> - [ ] Рейс скасували
> - [x] Марк записав неправильний час вильоту, і літак уже відлетів
> - [ ] Вони забули паспорти вдома

> [!listen] IELTS Listening, Part 2 — multiple choice
> level: B1 · type: answer · id: en-b1-narrative-tenses-l06
> audio: Welcome to Hartley Castle. The first tower was built in about 1150. By the time Lord Hartley bought the castle in 1350, a storm had destroyed most of that tower, so he built a new one on the same spot. That's the tower you can see today.
>
> **Why did Lord Hartley build a new tower?**
>
> - [ ] Because the old tower was too small.
> - [x] Because a storm had damaged the old one.
> - [ ] Because the castle had no tower in 1350.
> - [ ] Because he wanted to build it in a different place.
>
> **Пояснення:** *By the time Lord Hartley bought the castle, a storm **had destroyed** most of that tower* — буря сталася раніше за купівлю. У питанні IELTS слово *damaged* — перефразування *destroyed*: у Listening правильний варіант майже ніколи не повторює запис слово в слово.

## Вимова

> [!speak] Скажи вголос
> level: B1 · id: en-b1-narrative-tenses-s01
> text: When I got home, I realised I'd lost my keys.
> ipa: /wen aɪ ɡɒt həʊm aɪ ˈrɪə.laɪzd aɪd lɒst maɪ kiːz/
> tip: I'd — один склад [aɪd], /d/ легенько; realised закінчується на дзвінке /zd/.
> uk: Коли я прийшов додому, то зрозумів, що загубив ключі.

> [!speak] Скажи вголос
> level: B1 · id: en-b1-narrative-tenses-s02
> text: By the time we arrived, the film had started.
> ipa: /baɪ ðə taɪm wiː əˈraɪvd ðə fɪlm əd ˈstɑː.tɪd/
> tip: had посеред речення слабке — [həd] або навіть [əd]; started — закінчення [ɪd].
> uk: Коли ми прийшли, фільм уже почався.

> [!speak] Скажи вголос
> level: B1 · id: en-b1-narrative-tenses-s03
> text: I'd never been abroad before.
> ipa: /aɪd ˈnev.ə biːn əˈbrɔːd bɪˈfɔː/
> tip: never — /v/ зубами по губі, не «w»; abroad — довге [ɔː].
> uk: До того я ніколи не був за кордоном.

> [!speak] Скажи вголос
> level: B1 · id: en-b1-narrative-tenses-s04
> text: Had you met him before?
> ipa: /həd juː ˈmet ɪm bɪˈfɔː/
> tip: had на початку питання часто слабке [həd]; him після приголосного — [ɪm], h випадає.
> uk: Ти був з ним знайомий раніше?

> [!speak] Скажи вголос
> level: B1 · id: en-b1-narrative-tenses-s05
> text: It was getting dark, and we were all very tired.
> ipa: /ɪt wəz ˈɡet.ɪŋ dɑːk ən wiː wər ɔːl ˈver.i ˈtaɪəd/
> tip: were all — звʼязуй через /r/: [wər‿ɔːl]; dark — довге [ɑː].
> uk: Сутеніло, і ми всі дуже втомилися.

> [!speak] IELTS Speaking, Part 2 — «Describe a journey that went wrong»
> level: B1 · id: en-b1-narrative-tenses-s06
> text: When we got to the station, we found out that our train had already left.
> ipa: /wen wiː ɡɒt tə ðə ˈsteɪ.ʃən wiː faʊnd ˈaʊt ðət ˈaʊə treɪn həd ɔːlˈred.i left/
> tip: у Part 2 оцінюють і граматичний діапазон: Past Perfect у розповіді — плюс до оцінки. found out — звʼязуй [faʊnd‿aʊt].
> uk: Коли ми приїхали на вокзал, зʼясувалося, що наш потяг уже пішов.

## Типові помилки українців

> [!pitfall] «When I came, he already left» — без Past Perfect
> Українське «він уже пішов» — звичайний минулий час, слово «уже» робить усю роботу. В англійській *already* не рятує: потрібне *he **had** already **left***. Інакше виходить «коли я прийшов, він тоді й пішов».

> [!pitfall] Past Perfect «для солідності»
> Деякі учні вирішують, що Past Perfect — «більш минулий» або «більш граматичний», і ставлять його в кожне речення: ~~*Yesterday I had gone to the cinema*~~. Past Perfect потрібен **лише відносно іншого моменту в минулому**. Немає точки відліку — бери Past Simple: *Yesterday I **went** to the cinema*.

> [!pitfall] «I had been to London last year» — без точки відліку
> Калька з «я був у Лондоні» → ~~*I had been to London last year*~~. З *last year* — Past Simple: *I **went** to London last year*. Past Perfect — тільки коли є пізніший момент: *Before I moved there, I **had been** to London twice.*

> [!pitfall] «I didn't know that he has left»
> Українська після «не знав, що» вживає звичайний минулий час («не знав, що він пішов») або навіть теперішній («не знав, що він тут»). В англійській розповідь у минулому «тягне» час назад: *I didn't know that he **had left**.*

## Практика

> [!quiz] Обери правильне речення
> level: B1 · id: en-b1-narrative-tenses-q04
> - [ ] I was so hungry because I hadn't eat all day.
> - [ ] I was so hungry because I hadn't ate all day.
> - [x] I was so hungry because I hadn't eaten all day.
> - [ ] I was so hungry because I haven't eaten all day.
>
> **Пояснення:** причина, що передувала моменту в минулому, — Past Perfect: **hadn't + V3** (*eaten*, не *eat* і не *ate*). *Haven't eaten* — теперішній перфект, він не узгоджується з *I was*.

> [!quiz] Обери всі правильні речення
> level: B1 · type: multi · id: en-b1-narrative-tenses-q05
> - [x] By the time the doctor arrived, the patient had woken up.
> - [ ] I had gone to Paris in 2019.
> - [x] She was nervous because she had never given a speech before.
> - [x] After we had finished dinner, we went for a walk.
> - [ ] When I had arrived, they were already eating.
> - [x] After we finished dinner, we went for a walk.
>
> **Пояснення:** *in 2019* без другого моменту — лише Past Simple (*I went*). *When I arrived* — це сама точка відліку, тут Past Perfect не потрібен. Після *after* підходять обидва варіанти.

> [!quiz] Яке речення означає, що ми побачили, як автобус рушає?
> level: B1 · id: en-b1-narrative-tenses-q06
> - [x] When we got to the bus stop, the bus left.
> - [ ] When we got to the bus stop, the bus had left.
> - [ ] By the time we got to the bus stop, the bus had left.
>
> **Пояснення:** два Past Simple з *when* — події одна за одною: ми підійшли, і тоді автобус рушив. З *had left* автобус пішов **до** нашого приходу — ми його вже не бачили.

> [!quiz] Постав дієслова в правильну форму
> level: B1 · type: fill · id: en-b1-narrative-tenses-q07
>
> ```text fill
> When I [[got]] (get) to the airport, I [[realised|realized]] (realise) that I [[had forgotten]] (forget) my passport.
> It [[was snowing]] (snow) heavily, and the roads [[were]] (be) dangerous.
> We [[had never seen]] (never / see) such a beautiful place before.
> ```
>
> **Пояснення:** події по порядку — *got, realised*; паспорт забув раніше — *had forgotten*; фон — *was snowing*; досвід до моменту — *had never seen*. *Realized* — американське написання, теж прийнято.

> [!quiz] Встав сполучник
> level: B1 · type: fill · bank: during, until · id: en-b1-narrative-tenses-q08
>
> ```text fill
> [[By the time]] the firefighters arrived, the fire had spread to the roof.
> I didn't call you [[because]] I had lost your number.
> She was walking home [[when]] she heard someone shout her name.
> ```
>
> **Пояснення:** *by the time* — «поки, до того часу як» (часто з Past Perfect); *because* — причина; *when* — коротка подія посеред процесу.

> [!quiz] Склади речення: «Вона зрозуміла, що забула паспорт»
> level: B1 · type: order · id: en-b1-narrative-tenses-q09
>
> ```text order
> She
> realised
> that she
> had forgotten
> her passport.
> has forgotten // ✗
> ```
>
> **Пояснення:** усвідомлення — Past Simple (*realised*), забула ще раніше — Past Perfect (*had forgotten*). *Has forgotten* у розповіді про минуле не узгоджується.

> [!quiz] Склади речення: «Коли приїхала поліція, злодій уже втік»
> level: B1 · type: order · id: en-b1-narrative-tenses-q10
>
> ```text order
> By the time
> the police arrived,
> the thief
> had already
> escaped.
> ```
>
> **Пояснення:** після *by the time* — Past Simple (*arrived*), у головній частині — Past Perfect (*had escaped*). *Already* — між *had* і V3.

> [!quiz] Де Past Perfect зайвий?
> level: B1 · id: en-b1-narrative-tenses-q11
> - [ ] I couldn't pay because I had left my wallet at home.
> - [x] Yesterday I had got up early, had made coffee and had gone for a run.
> - [ ] By the time I got there, she had gone.
> - [ ] He told me he had never been to Spain.
>
> **Пояснення:** у другому реченні події йдуть **по порядку** і немає пізнішого моменту відліку — потрібен Past Simple: *I got up, made coffee and went for a run.*

> [!quiz] Як спитати: «Ти коли-небудь літав до тієї поїздки?»
> level: B1 · id: en-b1-narrative-tenses-q12
> - [ ] Did you ever flown before that trip?
> - [x] Had you ever flown before that trip?
> - [ ] Have you ever flew before that trip?
> - [ ] Had you ever flew before that trip?
>
> **Пояснення:** досвід до моменту в минулому — Past Perfect. Питання: **Had + підмет + V3** — *flown* (fly → flew → flown).

### У форматі IELTS

> [!quiz] IELTS Reading — True, False чи Not Given?
> level: B1 · id: en-b1-narrative-tenses-q13
>
> *When Jack arrived in Edinburgh, he went straight to his hotel. To his surprise, the receptionist told him that his booking had been cancelled. Jack had paid for the room two months earlier, so he was very angry. Fortunately, another hotel nearby had a free room.*
>
> **Statement:** Jack paid for the hotel room after he arrived in Edinburgh.
>
> - [ ] True
> - [x] False
> - [ ] Not Given
>
> **Пояснення:** *Jack **had paid** for the room two months **earlier*** — він заплатив задовго до приїзду. Твердження суперечить тексту → False. Past Perfect у тексті — ключ до правильної послідовності.

> [!quiz] IELTS Reading — True, False чи Not Given?
> level: B1 · id: en-b1-narrative-tenses-q14
>
> *When Jack arrived in Edinburgh, he went straight to his hotel. To his surprise, the receptionist told him that his booking had been cancelled. Jack had paid for the room two months earlier, so he was very angry. Fortunately, another hotel nearby had a free room.*
>
> **Statement:** The second hotel was cheaper than the first one.
>
> - [ ] True
> - [ ] False
> - [x] Not Given
>
> **Пояснення:** про ціну другого готелю в тексті нічого немає. Not Given — не «здається, ні», а «текст про це мовчить».

> [!quiz] IELTS Reading — summary completion
> level: B1 · type: fill · bank: was leaving, has left, lost · id: en-b1-narrative-tenses-q15
>
> *Last summer Olena flew to Lisbon for a conference. When she landed, she couldn't find her suitcase: the airline had sent it to Madrid by mistake. She had packed her laptop in the suitcase, so she bought a new one in the city. The suitcase finally arrived two days later.*
>
> Заповни резюме словами з банку (є зайві).
>
> ```text fill
> When Olena [[landed]] in Lisbon, her suitcase was missing.
> The airline [[had sent]] it to the wrong city.
> She [[bought]] a new laptop because her old one [[was]] in the suitcase.
> ```
>
> **Пояснення:** події історії — *landed, bought*; валізу відправили раніше — *had sent*; стан на той момент — *was*. *Has left* — теперішній перфект, у розповіді про минуле не підходить.

> [!tip] IELTS Writing — спробуй сам
> **General Training, Task 1 (формальний лист, 150+ слів).** *You stayed in a hotel last week, and when you got home you realised you had left something in your room.* Write a letter to the hotel manager. In your letter: describe what you left and where; explain what happened on the day you left; say what you would like the manager to do.
> Підказка: *When I got home, I realised I **had left** my watch in the bathroom.*

## Фішки

> [!reel] 🎞️ Past Perfect — кнопка «флешбек»
> Режисери показують минуле чорно-білим кадром, а англійська — словом had. Почув had + V3 — значить, оповідач «відмотав плівку» назад.

> [!reel] 📚 Казка — це три часи
> «It was a dark night. The wind was howling. Suddenly someone knocked at the door. Cinderella had lost her mother years before…» Фон — Continuous, події — Simple, передісторія — Perfect. Так написана майже кожна історія.

> [!reel] 🗣️ У розмові Past Perfect рідшає
> Носії часто кажуть «After I finished, I went home» — без had, бо after і так показує порядок. А от з by the time і realised Past Perfect тримається міцно.

## Джерела та що почитати

- 🟢 R. Murphy — *English Grammar in Use* (Cambridge): past perfect, past perfect continuous, розповідні часи.
- 🟢 [British Council LearnEnglish — Grammar B1–B2](https://learnenglish.britishcouncil.org/grammar/b1-b2-grammar) — past perfect і narrative tenses з вправами.
- 🟡 [Cambridge Dictionary — English Grammar Today](https://dictionary.cambridge.org/grammar/british-grammar/) — past perfect simple, when / by the time.
- 🟡 M. Swan — *Practical English Usage*: past perfect, after + past simple / past perfect.
- 🟡 [IELTS — офіційний сайт](https://ielts.org/) — формат Speaking Part 2 і Listening Part 2.

> [!important] Підсумок
> - **Past Simple** — події історії по порядку; **Past Continuous** — фон; **Past Perfect** (*had + V3*) — те, що сталося ще раніше.
> - Past Perfect потрібен, лише коли є пізніший момент відліку в минулому.
> - *When I arrived, the film **started*** (після мене) ≠ *the film **had started*** (до мене).
> - Типові «друзі» Past Perfect: **by the time**, **already**, **never … before**, **because**, **realised / found out that**.
> - Після **after / before** Past Perfect необовʼязковий — порядок і так ясний.
