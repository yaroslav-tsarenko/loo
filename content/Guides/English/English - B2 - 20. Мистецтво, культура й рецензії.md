---
title: Мистецтво, культура й рецензії
order: 420
id: en-b2-culture
level: B2
icon: px:image
tags: [english, b2, vocabulary, art, culture, film, books, music, reviews, ielts]
prerequisites: ["[[English - B1 - 18. Медіа, новини й реклама]]", "[[English - A2 - 20. Почуття й характер — прикметники на -ed та -ing]]"]
estimatedMinutes: 45
---

# Мистецтво, культура й рецензії

> [!success] Після цієї теми ти зможеш
> - говорити про фільми, книжки, музику й виставки точними словами: **plot, cast, sequel, novel, protagonist, exhibition, masterpiece** (B2);
> - оцінювати твір не лише «good / bad», а нюансовано: *gripping, thought-provoking, far-fetched, overrated, beautifully shot*;
> - написати коротку рецензію за чіткою структурою (тип завдання Cambridge B2 і хороша база для IELTS);
> - обговорювати роль мистецтва в суспільстві для IELTS Writing Task 2 і Speaking Part 3: фінансування культури, музеї, глобальна і місцева культура;
> - не плутати *novel* і «новела», *artist* і «артист», *fantastic* і «фантастика».

## Передбач

> [!quiz] «Я зараз читаю дуже цікавий роман». Як сказати правильно?
> level: B2 · id: en-b2-culture-q01
> - [ ] I'm reading a very interesting roman now.
> - [ ] I'm reading a very interesting novella now.
> - [x] I'm reading a really interesting novel at the moment.
> - [ ] I read a very interesting romance now.
>
> **Пояснення:** «роман» (книжка) — ***novel***. *Roman* англійською — «римський», *romance* — любовна історія (або любовний роман як жанр), *novella* — повість. Дія зараз — Present Continuous: *I'm reading*.

## Пояснення

### Як побудувати рецензію

> [!diagram] Рецензія за пʼять кроків
> ```yaml
> layout: flow
> nodes:
>   - { id: title, label: "title", text: "A quiet masterpiece", note: "заголовок з оцінкою", tone: violet }
>   - { id: intro, label: "introduction", text: "what, who, where", note: "що це за твір", tone: blue }
>   - { id: plot, label: "content", text: "plot — no spoilers!", note: "про що", tone: gray }
>   - { id: eval, label: "evaluation", text: "strengths + one weakness", note: "оцінка", tone: orange }
>   - { id: rec, label: "recommendation", text: "If you enjoy…, you'll love…", note: "кому радиш", tone: green, icon: "px:star" }
> steps:
>   - { focus: title, note: "Заголовок одразу натякає на оцінку: A quiet masterpiece, A sequel that falls flat." }
>   - { move: { from: title, to: intro, value: "context" }, note: "Вступ: назва, жанр (genre), режисер чи автор: The film, directed by…, is a historical drama set in 1930s Kharkiv." }
>   - { move: { from: intro, to: plot, value: "Present Simple" }, note: "Сюжет (plot) — у Present Simple і коротко: The protagonist, a young journalist, discovers… Без спойлерів!" }
>   - { move: { from: plot, to: eval, value: "but…" }, note: "Оцінка — найважливіша частина: що вдалося (The cast is superb) і що ні (The ending is rather predictable)." }
>   - { move: { from: eval, to: rec, value: "★★★★" }, note: "Рекомендація: кому сподобається. If you enjoy slow, thought-provoking dramas, don't miss it." }
> ```

### Граматика в контексті: як звучить зріла оцінка

| Прийом | Приклад | Переклад |
|---|---|---|
| прислівник + дієприкметник | *a **beautifully shot**, **brilliantly acted** film* | гарно знятий фільм із блискучою грою акторів |
| | *a **well-written** but **poorly edited** novel* | добре написаний, але погано відредагований роман |
| підсилення / послаблення | *utterly gripping · rather predictable · slightly too long* | надзвичайно захопливий · дещо передбачуваний · трохи задовгий |
| акцент через *What* | ***What I liked most was** the soundtrack.* | Найбільше мені сподобався саундтрек. |
| поступка | ***Although** the plot is far-fetched, the characters are convincing.* | Хоч сюжет і неправдоподібний, персонажі переконливі. |
| рекомендація | ***If you enjoy** crime thrillers, **you'll love** this.* | Якщо любиш кримінальні трилери, тобі сподобається. |

> [!diagram] Оцінні слова парами
> ```yaml
> layout: compare
> columns: { plus: "Хвалимо", minus: "Критикуємо" }
> nodes:
>   - { id: p1, col: plus, label: "сюжет", text: "gripping — can't stop watching", tone: green }
>   - { id: p2, col: plus, label: "ідеї", text: "thought-provoking", tone: green }
>   - { id: p3, col: plus, label: "правдоподібність", text: "convincing characters", tone: green }
>   - { id: p4, col: plus, label: "репутація", text: "critically acclaimed; underrated", tone: green }
>   - { id: m1, col: minus, label: "сюжет", text: "dull; predictable", tone: red }
>   - { id: m2, col: minus, label: "ідеї", text: "the jokes fall flat", tone: red }
>   - { id: m3, col: minus, label: "правдоподібність", text: "far-fetched plot", tone: red }
>   - { id: m4, col: minus, label: "репутація", text: "overrated", tone: red }
> steps:
>   - { focus: [p1, m1], note: "Сюжет: gripping (захопливий) ↔ dull (нудний, млявий) і predictable (передбачуваний — знаєш кінець із першої сцени)." }
>   - { focus: [p2, m2], note: "Ідеї та гумор: thought-provoking (змушує замислитися) ↔ fall flat (не спрацьовує — жарт «падає»)." }
>   - { focus: [p3, m3], note: "Правдоподібність: convincing (переконливий) ↔ far-fetched (притягнутий за вуха)." }
>   - { focus: [p4, m4], note: "Репутація: critically acclaimed (хвалять критики), underrated (недооцінений) ↔ overrated (переоцінений — славу має більшу, ніж заслуговує)." }
> ```

### Для IELTS: культура в Writing Task 2 і Speaking Part 3

Типові питання Task 2: *Some people think governments should spend money on the arts, while others believe this money should go to healthcare and education. Discuss both views.* · *Should museums and galleries be free?* · *Is global culture replacing local traditions?* Speaking Part 3: *Why do people still go to museums? Should art be compulsory at school?*

| Ідея | Фраза рівня Band 6.5–7 | Переклад |
|---|---|---|
| фінансування | *public funding for the arts* | державне фінансування культури |
| ідентичність | ***preserve** cultural identity / heritage* | зберігати культурну ідентичність / спадщину |
| розвиток | *foster creativity; broaden people's horizons* | розвивати креативність; розширювати світогляд |
| масова культура | ***mainstream** culture; global brands* | мейнстрим, масова культура; глобальні бренди |
| свобода | *artistic freedom vs **censorship*** | творча свобода проти цензури |
| доступ | *make culture accessible to everyone* | робити культуру доступною для всіх |
| сучасне мистецтво | ***contemporary** art; **abstract** painting* | сучасне мистецтво; абстрактний живопис |

> [!example] Зразок абзацу для Task 2 (≈ Band 7)
> *Those who oppose public funding for the arts argue that, when hospitals and schools are short of money, spending on galleries and theatres is a luxury. While this concern is understandable, it overlooks the wider value of culture. Museums, concerts and festivals attract tourists and create jobs, so a well-funded cultural sector can actually generate income for a city. More importantly, the arts help societies **preserve** their identity and give young people a space to think critically and creatively. Without public support, culture risks becoming either a privilege of the wealthy or a purely commercial product shaped by **mainstream** tastes.*
>
> Що тут працює: чужа позиція (*Those who oppose… argue*) → визнання (*While this concern is understandable*) → два аргументи по наростанню (*More importantly*) → наслідок за відсутності підтримки (*Without public support…*). Лексика теми — *public funding, cultural sector, preserve identity, mainstream tastes*.

## Приклади

- *The film is **set in** Lviv in the 1990s.* — Дія фільму відбувається у Львові 1990-х.
- *The **cast** includes some of Ukraine's best actors.* — У фільмі знімаються одні з найкращих акторів України.
- *The **sequel** isn't as good as the original.* — Продовження не таке добре, як оригінал.
- *It's a real **page-turner** — I finished it in two days.* — Від книжки неможливо відірватися — я прочитав її за два дні.
- *The **lyrics** are beautiful, but the melody is a bit **dull**.* — Слова пісні прекрасні, але мелодія трохи нудна.
- *The **exhibition** runs until the end of May.* — Виставка триватиме до кінця травня.
- *Many critics consider it Kurosawa's **masterpiece**.* — Багато критиків вважають цей фільм шедевром Куросави.
- *Honestly, I found the plot rather **far-fetched**.* — Чесно кажучи, сюжет здався мені притягнутим за вуха.
- *Her debut novel was **critically acclaimed**.* — Її дебютний роман дістав схвальні відгуки критиків.
- *The concert took place in a small **venue** near the river.* — Концерт відбувся в невеликому залі біля річки.

## Слова

### Кіно й серіали

> [!word] plot
> ipa: /plɒt/ · ipa-us: /plɑːt/ · pos: noun · level: B2 · id: en-b2-culture-w01
> uk: сюжет
> example: The **plot** is so complicated that I got lost halfway through. — Сюжет такий заплутаний, що я загубився на середині.
> note: нейтральне. *The plot twist* — несподіваний поворот сюжету. Друге значення — змова: *a plot to kill the king*.

> [!word] character
> ipa: /ˈkærəktə/ · ipa-us: /ˈkerəktər/ · pos: noun · level: B2 · id: en-b2-culture-w02
> uk: персонаж; характер
> example: The main **character** is a teenage girl from Odesa. — Головна героїня — дівчина-підліток з Одеси.
> note: нейтральне. *ch* = /k/: [КЕ-рек-те]. *a minor character* — другорядний персонаж; *She has a strong character* — у неї сильний характер.

> [!word] cast
> ipa: /kɑːst/ · ipa-us: /kæst/ · pos: noun · level: B2 · id: en-b2-culture-w03
> uk: акторський склад
> example: The film has an amazing **cast**. — У фільмі приголомшливий акторський склад.
> note: нейтральне. Дієслово *cast somebody as* — дати роль: *She was cast as the queen.* Форми: *cast → cast → cast*.

> [!word] director
> ipa: /dəˈrektə/ · ipa-us: /dəˈrektər/ · pos: noun · level: B2 · id: en-b2-culture-w04
> uk: режисер (кіно, театру); директор
> example: The **director** spent five years making the film. — Режисер знімав фільм пʼять років.
> note: нейтральне. Також /daɪˈrektə/. *directed by* — режисер (у рецензії). *producer* — продюсер, а не «режисер».

> [!word] sequel
> ipa: /ˈsiːkwəl/ · pos: noun · level: B2 · id: en-b2-culture-w05
> uk: продовження (фільму, книжки)
> example: The **sequel** was even more successful than the first film. — Продовження було ще успішнішим за перший фільм.
> note: нейтральне. *prequel* — передісторія; *remake* — нова версія того самого фільму.

> [!word] blockbuster
> ipa: /ˈblɒkbʌstə/ · ipa-us: /ˈblɑːkbʌstər/ · pos: noun · level: B2 · id: en-b2-culture-w06
> uk: блокбастер; касовий хіт
> example: Summer is the season for Hollywood **blockbusters**. — Літо — сезон голлівудських блокбастерів.
> note: нейтральне. Також про книжку: *a blockbuster novel*.

> [!word] box office
> ipa: /ˈbɒks ˌɒfɪs/ · ipa-us: /ˈbɑːks ˌɑːfɪs/ · pos: noun · level: B2 · id: en-b2-culture-w07
> uk: прокат; касові збори; каса (театру, кіно)
> example: The film was a huge **box-office** success. — Фільм мав величезний касовий успіх.
> note: нейтральне. Перед іменником — з дефісом: *box-office hit / flop* (касовий хіт / провал).

> [!word] soundtrack
> ipa: /ˈsaʊndtræk/ · pos: noun · level: B2 · id: en-b2-culture-w08
> uk: саундтрек; музика до фільму
> example: The **soundtrack** is my favourite part of the film. — Саундтрек — моя улюблена частина фільму.
> note: нейтральне. *score* — оригінальна музика композитора до фільму.

> [!word] special effects
> ipa: /ˌspeʃəl ɪˈfekts/ · pos: noun · level: B2 · id: en-b2-culture-w09
> uk: спецефекти
> example: The **special effects** are impressive, but the story is weak. — Спецефекти вражають, але історія слабка.
> note: нейтральне; також *visual effects*, *CGI* (компʼютерна графіка).

> [!word] be set in
> ipa: /bi ˈset ɪn/ · pos: phrase · level: B2 · id: en-b2-culture-w10
> uk: (про дію твору) відбуватися в (місці, часі)
> example: The novel **is set in** Kyiv during the Second World War. — Дія роману відбувається в Києві під час Другої світової війни.
> note: нейтральне. Не «the action happens in» — природніше *The story is set in…*; *the setting* — місце й час дії.

> [!word] adaptation
> ipa: /ˌædæpˈteɪʃən/ · pos: noun · level: B2 · id: en-b2-culture-w11
> uk: екранізація; адаптація
> example: The series is an **adaptation** of a bestselling novel. — Серіал — екранізація роману-бестселера.
> note: нейтральне. *a film / stage adaptation of*; дієслово *be adapted for the screen*.

> [!word] spoiler
> ipa: /ˈspɔɪlə/ · ipa-us: /ˈspɔɪlər/ · pos: noun · level: B2 · id: en-b2-culture-w12
> uk: спойлер
> example: No **spoilers**, please — I haven't seen the last episode! — Без спойлерів, будь ласка, — я ще не бачив останньої серії!
> note: розмовне. *Spoiler alert!* — Увага, спойлер! Дієслово *spoil the ending*.

> [!word] genre
> ipa: /ˈʒɒnrə/ · ipa-us: /ˈʒɑːnrə/ · pos: noun · level: B2 · id: en-b2-culture-w13
> uk: жанр
> example: Horror is my least favourite **genre**. — Жахи — жанр, який я люблю найменше.
> note: нейтральне. Французьке слово, починається з /ʒ/ — [ЖОН-ре], не «джанр».

### Література

> [!word] novel
> ipa: /ˈnɒvəl/ · ipa-us: /ˈnɑːvəl/ · pos: noun · level: B2 · id: en-b2-culture-w14
> uk: роман (книжка)
> example: Her first **novel** was translated into twenty languages. — Її перший роман переклали двадцятьма мовами.
> note: нейтральне. Хибний друг: «новела» — *short story*. *novelist* — романіст, письменник.

> [!word] fiction
> ipa: /ˈfɪkʃən/ · pos: noun · level: B2 · id: en-b2-culture-w15
> uk: художня література; вигадка
> example: I prefer **fiction** to biographies. — Художню літературу я люблю більше, ніж біографії.
> note: нейтральне. *non-fiction* — нон-фікшн (документальна, наукова); *science fiction (sci-fi)* — наукова фантастика.

> [!word] protagonist
> ipa: /prəˈtæɡənɪst/ · ipa-us: /proʊˈtæɡənɪst/ · pos: noun · level: B2 · id: en-b2-culture-w16
> uk: головний герой; протагоніст
> example: The **protagonist** is a lonely old man who finds a dog. — Головний герой — самотній старий, який знаходить собаку.
> note: формальне (рецензії, есе). Розмовно — *the main character*. Протилежне — *antagonist*.

> [!word] page-turner
> ipa: /ˈpeɪdʒ ˌtɜːnə/ · ipa-us: /ˈpeɪdʒ ˌtɝːnər/ · pos: noun · level: B2 · id: en-b2-culture-w17
> uk: книжка, від якої неможливо відірватися
> example: Her new thriller is a real **page-turner**. — Від її нового трилера неможливо відірватися.
> note: розмовне-нейтральне, типове для рецензій.

> [!word] playwright
> ipa: /ˈpleɪraɪt/ · pos: noun · level: B2 · id: en-b2-culture-w18
> uk: драматург
> example: Shakespeare is the world's most famous **playwright**. — Шекспір — найвідоміший драматург світу.
> note: нейтральне. Пишеться *-wright* (майстер, як *shipwright*), а не *-write*! літери *w* і *gh* не читаються: [ПЛЕЙ-райт].

### Музика й сцена

> [!word] lyrics
> ipa: /ˈlɪrɪks/ · pos: noun · level: B2 · id: en-b2-culture-w19
> uk: слова (тексти) пісні
> example: I love the melody, but I can't understand the **lyrics**. — Мені подобається мелодія, але я не розумію слів.
> note: нейтральне, множина. *lyricist* — автор текстів пісень.

> [!word] venue
> ipa: /ˈvenjuː/ · pos: noun · level: B2 · id: en-b2-culture-w20
> uk: місце проведення (концерту, події)
> example: The band is looking for a bigger **venue**. — Гурт шукає більший майданчик.
> note: нейтральне-формальне. *a music / sports / wedding venue*.

> [!word] gig
> ipa: /ɡɪɡ/ · pos: noun · level: B2 · id: en-b2-culture-w21
> uk: концерт (особливо невеликий, живий)
> example: Are you coming to the **gig** on Saturday? — Ти прийдеш на концерт у суботу?
> note: розмовне. Також — тимчасовий підробіток: *the gig economy*. Формально — *concert, performance*.

> [!word] performance
> ipa: /pəˈfɔːməns/ · ipa-us: /pərˈfɔːrməns/ · pos: noun · level: B2 · id: en-b2-culture-w22
> uk: виступ; гра (актора); вистава
> example: Her **performance** as Lesya Ukrainka is unforgettable. — Її гра в ролі Лесі Українки незабутня.
> note: нейтральне. *give a performance*; *a live performance*. Не плутай з «перформанс» у сучасному мистецтві — це *performance art*.

> [!word] rehearsal
> ipa: /rɪˈhɜːsəl/ · ipa-us: /rɪˈhɝːsəl/ · pos: noun · level: B2 · id: en-b2-culture-w23
> uk: репетиція
> example: The actors have **rehearsals** every evening. — Актори репетирують щовечора.
> note: нейтральне. *a dress rehearsal* — генеральна репетиція. Дієслово *rehearse* (B1).

> [!word] orchestra
> ipa: /ˈɔːkɪstrə/ · ipa-us: /ˈɔːrkɪstrə/ · pos: noun · level: B2 · id: en-b2-culture-w24
> uk: оркестр
> example: The city **orchestra** gives free concerts in the park. — Міський оркестр дає безкоштовні концерти в парку.
> note: нейтральне. *ch* = /k/; наголос на першому: [ОО-кі-стре]. *conductor* — диригент.

### Образотворче мистецтво

> [!word] exhibition
> ipa: /ˌeksɪˈbɪʃən/ · pos: noun · level: B2 · id: en-b2-culture-w25
> uk: виставка
> example: There's a new photography **exhibition** at the museum. — У музеї нова фотовиставка.
> note: нейтральне. Літера *h* не читається: [ек-сі-БІ-шн]. *hold / put on an exhibition*; US також *exhibit*.

> [!word] gallery
> ipa: /ˈɡæləri/ · pos: noun · level: B2 · id: en-b2-culture-w26
> uk: галерея
> example: The **gallery** has a large collection of Ukrainian avant-garde art. — У галереї велика колекція українського авангарду.
> note: нейтральне. *an art gallery*. У театрі *the gallery* — гальорка.

> [!word] masterpiece
> ipa: /ˈmɑːstəpiːs/ · ipa-us: /ˈmæstərpiːs/ · pos: noun · level: B2 · id: en-b2-culture-w27
> uk: шедевр
> example: Many people consider it the greatest **masterpiece** of the Renaissance. — Багато хто вважає це найбільшим шедевром Відродження.
> note: нейтральне. Сильне слово — не кажи так про кожен фільм, що сподобався.

> [!word] sculpture
> ipa: /ˈskʌlptʃə/ · ipa-us: /ˈskʌlptʃər/ · pos: noun · level: B2 · id: en-b2-culture-w28
> uk: скульптура
> example: There's a huge metal **sculpture** in front of the gallery. — Перед галереєю стоїть величезна металева скульптура.
> note: нейтральне. Митець — *sculptor*. *p* вимовляється: [СКАЛП-че].

> [!word] portrait
> ipa: /ˈpɔːtreɪt/ · ipa-us: /ˈpɔːrtrət/ · pos: noun · level: B2 · id: en-b2-culture-w29
> uk: портрет
> example: The museum has a **portrait** of Taras Shevchenko painted by himself. — У музеї є автопортрет Тараса Шевченка.
> note: нейтральне. *a self-portrait* — автопортрет; *landscape* — пейзаж; *still life* — натюрморт.

> [!word] abstract
> ipa: /ˈæbstrækt/ · pos: adj · level: B2 · id: en-b2-culture-w30
> uk: абстрактний
> example: I don't really understand **abstract** art. — Я не дуже розумію абстрактне мистецтво.
> note: нейтральне. Іменник *abstract* — анотація (наукової статті).

> [!word] contemporary
> ipa: /kənˈtempərəri/ · ipa-us: /kənˈtempəreri/ · pos: adj · level: B2 · id: en-b2-culture-w31
> uk: сучасний (про мистецтво, культуру)
> example: The festival focuses on **contemporary** Ukrainian music. — Фестиваль присвячений сучасній українській музиці.
> note: нейтральне-формальне. *contemporary art* — сучасне мистецтво (останні десятиліття); *modern art* — ширше, приблизно з кінця XIX ст.

> [!word] curator
> ipa: /kjʊəˈreɪtə/ · ipa-us: /ˈkjʊreɪt̬ər/ · pos: noun · level: B2 · id: en-b2-culture-w32
> uk: куратор (виставки, колекції)
> example: The **curator** gave us a tour of the new exhibition. — Куратор провів нам екскурсію новою виставкою.
> note: нейтральне. Наголос: UK [кʼю-РЕЙ-те], US [КʼЮ-рей-тер]. Дієслово *curate*.

### Оцінка й рецензії

> [!word] riveting
> ipa: /ˈrɪvɪtɪŋ/ · ipa-us: /ˈrɪvɪt̬ɪŋ/ · pos: adj · level: B2 · id: en-b2-culture-w33
> uk: захопливий; від якого неможливо відірватися
> example: Her performance in the final scene is absolutely **riveting**. — Від її гри у фінальній сцені неможливо відірватися.
> note: нейтральне, сильніше за *interesting*. Від *rivet* — заклепка: тебе ніби «пришпилює» до екрана. Синонім — *gripping*.

> [!word] thought-provoking
> ipa: /ˈθɔːt prəˌvəʊkɪŋ/ · ipa-us: /ˈθɑːt prəˌvoʊkɪŋ/ · pos: adj · level: B2 · id: en-b2-culture-w34
> uk: що змушує замислитися
> example: It's a **thought-provoking** film about war and memory. — Це фільм про війну й памʼять, який змушує замислитися.
> note: нейтральне-формальне, улюблене слово рецензентів.

> [!word] moving
> ipa: /ˈmuːvɪŋ/ · pos: adj · level: B2 · id: en-b2-culture-w35
> uk: зворушливий
> example: The ending is so **moving** that half the audience was crying. — Фінал такий зворушливий, що пів зали плакало.
> note: нейтральне. Синонім — *touching*. *I was deeply moved* — я був глибоко зворушений.

> [!word] stunning
> ipa: /ˈstʌnɪŋ/ · pos: adj · level: B2 · id: en-b2-culture-w36
> uk: приголомшливий; надзвичайно гарний
> example: The scenery in the film is absolutely **stunning**. — Краєвиди у фільмі просто приголомшливі.
> note: нейтральне. Екстремальний прикметник: *absolutely stunning*, але не «very stunning».

> [!word] overrated
> ipa: /ˌəʊvəˈreɪtɪd/ · ipa-us: /ˌoʊvərˈreɪt̬ɪd/ · pos: adj · level: B2 · id: en-b2-culture-w37
> uk: переоцінений
> example: Everyone loves that series, but I think it's **overrated**. — Усі люблять цей серіал, а я вважаю його переоціненим.
> note: нейтральне-розмовне. Протилежне — *underrated* (недооцінений).

> [!word] predictable
> ipa: /prɪˈdɪktəbəl/ · pos: adj · level: B2 · id: en-b2-culture-w38
> uk: передбачуваний
> example: The plot is so **predictable** that I guessed the ending in ten minutes. — Сюжет такий передбачуваний, що я вгадав кінець за десять хвилин.
> note: нейтральне. Протилежне — *unpredictable*, *full of surprises*.

> [!word] dull
> ipa: /dʌl/ · pos: adj · level: B2 · id: en-b2-culture-w39
> uk: нудний; млявий; тьмяний
> example: The first half is a bit **dull**, but it gets better. — Перша половина трохи нудна, але далі краще.
> note: нейтральне. Синонім *boring* (A2), трохи стриманіший. Також про колір і погоду: *a dull day*.

> [!word] far-fetched
> ipa: /ˌfɑː ˈfetʃt/ · ipa-us: /ˌfɑːr ˈfetʃt/ · pos: adj · level: B2 · id: en-b2-culture-w40
> uk: неправдоподібний; притягнутий за вуха
> example: The idea that a teenager could hack the Pentagon is a bit **far-fetched**. — Ідея, що підліток міг би зламати Пентагон, трохи притягнута за вуха.
> note: нейтральне. Протилежне — *convincing, believable, realistic*.

> [!word] convincing
> ipa: /kənˈvɪnsɪŋ/ · pos: adj · level: B2 · id: en-b2-culture-w41
> uk: переконливий
> example: She gives a very **convincing** performance as a doctor. — Вона дуже переконливо грає лікарку.
> note: нейтральне. *convincing argument / evidence*. *convinced* (B1) — переконаний (про людину).

> [!word] critically acclaimed
> ipa: /ˌkrɪtɪkli əˈkleɪmd/ · pos: adj · level: B2 · id: en-b2-culture-w42
> uk: високо оцінений критиками
> example: The **critically acclaimed** film won three awards. — Фільм, який високо оцінили критики, отримав три нагороди.
> note: формальне-нейтральне. *acclaim* — схвалення, визнання.

> [!word] fall flat
> ipa: /ˌfɔːl ˈflæt/ · ipa-us: /ˌfɑːl ˈflæt/ · pos: phrase · level: B2 · id: en-b2-culture-w43
> uk: не мати успіху; не спрацювати (про жарт, ідею)
> example: Most of the jokes **fall flat**. — Більшість жартів не спрацьовують.
> forms: fall → fell → fallen
> note: розмовне-нейтральне. *The ending fell flat* — фінал розчарував.

### Культура й суспільство

> [!word] mainstream
> ipa: /ˈmeɪnstriːm/ · pos: adj · level: B2 · id: en-b2-culture-w44
> uk: масовий; популярний; мейнстримний
> example: Ukrainian music has become more **mainstream** in Europe. — Українська музика стала популярнішою в Європі.
> note: нейтральне. Іменник: *the mainstream*. Протилежне — *alternative, niche, independent (indie)*.

> [!word] censorship
> ipa: /ˈsensəʃɪp/ · ipa-us: /ˈsensərʃɪp/ · pos: noun · level: B2 · id: en-b2-culture-w45
> uk: цензура
> example: Many writers fought against **censorship** in the Soviet Union. — Багато письменників боролися проти цензури в Радянському Союзі.
> note: нейтральне-формальне. *censor* — цензор / цензурувати.

> [!word] preserve
> ipa: /prɪˈzɜːv/ · ipa-us: /prɪˈzɝːv/ · pos: verb · level: B2 · id: en-b2-culture-w46
> uk: зберігати; охороняти (від зникнення)
> example: The museum works to **preserve** traditional crafts. — Музей працює над збереженням традиційних ремесел.
> note: нейтральне-формальне, часте в IELTS: *preserve culture / traditions / historic buildings*. Іменник *preservation*.

## Слухаємо

> [!listen] Що критикує рецензент?
> level: B2 · type: answer · id: en-b2-culture-l01
> audio: If you're expecting another predictable superhero blockbuster, think again. The plot is clever, the cast is excellent, and the ending is genuinely moving. My only complaint? At nearly three hours, it's at least thirty minutes too long.
> - [ ] передбачуваний сюжет
> - [ ] слабкий акторський склад
> - [x] фільм задовгий
> - [ ] сумний фінал
>
> **Пояснення:** *My only complaint* — «моє єдине зауваження»: *it's at least thirty minutes too long*. *Predictable* — пастка: рецензент каже, що фільм якраз **не** такий (*think again*).

> [!listen] Обери почуте
> level: B2 · type: choice · id: en-b2-culture-l02
> audio: Honestly, I thought it was overrated.
> - [x] Honestly, I thought it was overrated.
> - [ ] Honestly, I thought it was underrated.
> - [ ] Honestly, I thought it was over too quickly.
>
> **Пояснення:** *over-* (пере-) ↔ *under-* (недо-): *overrated* — переоцінений, *underrated* — недооцінений. Протилежні оцінки, тож слухай префікс.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: en-b2-culture-l03
> audio: The exhibition features works by contemporary Ukrainian artists.

> [!listen] IELTS Listening, Part 2 — оголошення в музеї. Де і до коли триває фотовиставка?
> level: B2 · type: answer · id: en-b2-culture-l04
> audio: Welcome to the City Art Museum. The modern art collection is on the second floor. The exhibition of Ukrainian photography is in the east wing until the end of March. Guided tours start every hour from the main entrance and are free on Sundays.
> - [ ] на другому поверсі, до кінця травня
> - [x] у східному крилі, до кінця березня
> - [ ] біля головного входу, щонеділі
> - [ ] у західному крилі, до кінця березня
>
> **Пояснення:** *in the east wing until the end of March*. Другий поверх — це колекція модерного мистецтва, головний вхід — початок екскурсій. У Part 2 часто кілька місць і дат поруч — записуй, до чого кожне належить.

> [!listen] IELTS Listening, Part 3 — студенти планують проєкт. Що пропонує друга студентка?
> level: B2 · type: answer · id: en-b2-culture-l05
> audio: A: Should we compare the novel with the film adaptation?
> audio: B: Good idea, but the film changes the ending completely. Let's focus on how the director presents the protagonist instead.
> - [ ] порівняти фінали роману й фільму
> - [x] зосередитися на тому, як режисер показує головного героя
> - [ ] відмовитися від фільму й аналізувати лише роман
> - [ ] написати власний фінал
>
> **Пояснення:** *Let's focus on how the director presents the protagonist instead* — головний герой (*protagonist*) у фільмі. Фінал — причина, чому порівнювати його **не** варто.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: en-b2-culture-l06
> audio: The novel is a real page-turner, but the ending falls flat.

## Ситуація: після кіно

> [!example] Друзі виходять із кінотеатру
> **Sofia:** So? What did you think?
> **Maks:** Honestly? I found it a bit **overrated**. Everyone said it was a **masterpiece**, but the **plot** was pretty **far-fetched**.
> **Sofia:** Really? I thought it was **gripping**! And the **cast** was amazing — especially the actress who played the mother.
> **Maks:** OK, I'll give you that. Her **performance** was really **convincing**. And the **soundtrack** was **stunning**.
> **Sofia:** What I liked most was the ending. It was so **moving**.
> **Maks:** See, that's where it **fell flat** for me. It was so **predictable** — I guessed it in the first twenty minutes.
> **Sofia:** Fair enough. But you have to admit it was **beautifully shot**.
> **Maks:** True. Let's just agree to disagree. Want to read the **novel** it's based on? Apparently, it's a real **page-turner**.
>
> Зверни увагу, як друзі сперечаються ввічливо: *Really? I thought…*, *OK, I'll give you that* (тут згоден), *Fair enough. But you have to admit…*, *Let's agree to disagree* — «залишимося кожен при своїй думці».

## Вимова

> [!speak] Скажи вголос
> level: B2 · id: en-b2-culture-s01
> text: The plot was gripping and the acting was superb.
> ipa: /ðə ˈplɒt wəz ˈɡrɪpɪŋ ən ði ˈæktɪŋ wəz suːˈpɜːb/
> tip: gripping — /ɡr/ разом, без голосного між ними; superb — наголос на другому: [су-ПЕБ].
> uk: Сюжет був захопливий, а акторська гра — чудова.

> [!speak] Скажи вголос
> level: B2 · id: en-b2-culture-s02
> text: It's a beautifully shot film, but the ending is predictable.
> ipa: /ɪts ə ˈbjuːtɪfli ˈʃɒt ˈfɪlm bət ði ˈendɪŋ ɪz prɪˈdɪktəbəl/
> tip: beautifully — 3–4 склади [БʼЮ-ті-флі]; film — один склад /fɪlm/, не «філем».
> uk: Фільм гарно знятий, але фінал передбачуваний.

> [!speak] Скажи вголос
> level: B2 · id: en-b2-culture-s03
> text: What genre of music do you listen to?
> ipa: /ˈwɒt ˈʒɒnrə əv ˈmjuːzɪk də ju ˈlɪsən tuː/
> tip: genre — /ʒ/ як «ж»: [ЖОН-ре]; listen — літера *t* не читається; to в кінці — сильна форма [ту].
> uk: Яку музику (якого жанру) ти слухаєш?

> [!speak] IELTS Speaking, Part 3 — «Should governments spend money on the arts?»
> level: B2 · id: en-b2-culture-s04
> text: Yes, because art brings communities together, but funding should be shared fairly between big cities and smaller towns.
> ipa: /ˈjes bɪˈkɒz ˈɑːt ˈbrɪŋz kəˈmjuːnətiz təˈɡeðə bət ˈfʌndɪŋ ʃəd bi ˈʃeəd ˈfeəli bɪˈtwiːn ˈbɪɡ ˈsɪtiz ən ˈsmɔːlə ˈtaʊnz/
> tip: Позиція + причина + умова (*but…*) — зріла відповідь. together — /ð/; fairly — [ФЕЄ-лі].
> uk: Так, бо мистецтво обʼєднує громади, але фінансування треба справедливо розподіляти між великими містами й меншими містечками.

> [!speak] IELTS Speaking, Part 3 — «Why do people still go to museums when everything is online?»
> level: B2 · id: en-b2-culture-s05
> text: Seeing a masterpiece in real life is a completely different experience from looking at it on a screen.
> ipa: /ˈsiːɪŋ ə ˈmɑːstəpiːs ɪn ˈrɪəl ˈlaɪf ɪz ə kəmˈpliːtli ˈdɪfrənt ɪkˈspɪəriəns frəm ˈlʊkɪŋ ət ɪt ɒn ə ˈskriːn/
> tip: *different from* — британська норма (US також *different than*). masterpiece — [МААС-те-піс]; experience — [ік-СПІЕ-рі-енс].
> uk: Побачити шедевр наживо — зовсім інший досвід, ніж дивитися на нього на екрані.

> [!speak] IELTS Speaking, Part 3 — «Is global culture replacing local traditions?»
> level: B2 · id: en-b2-culture-s06
> text: In many ways, yes. Young people mostly follow mainstream culture, so we need to preserve local music and crafts.
> ipa: /ɪn ˈmeni ˈweɪz ˈjes ˈjʌŋ ˈpiːpəl ˈməʊstli ˈfɒləʊ ˈmeɪnstriːm ˈkʌltʃə səʊ wi ˈniːd tə prɪˈzɜːv ˈləʊkəl ˈmjuːzɪk ən ˈkrɑːfts/
> tip: *In many ways* — часткова згода, звучить зважено. preserve — /z/: [прі-ЗЕВ]; crafts — /fts/ у кінці.
> uk: Багато в чому так. Молодь здебільшого орієнтується на масову культуру, тож нам треба зберігати місцеву музику й ремесла.

> [!speak] IELTS Speaking, Part 3 — «Should art be a compulsory subject at school?»
> level: B2 · id: en-b2-culture-s07
> text: I think so. Art teaches children to think creatively, which is useful in almost every job.
> ipa: /aɪ ˈθɪŋk ˈsəʊ ˈɑːt ˈtiːtʃɪz ˈtʃɪldrən tə ˈθɪŋk kriˈeɪtɪvli wɪtʃ ɪz ˈjuːsfəl ɪn ˈɔːlməʊst ˈevri ˈdʒɒb/
> tip: *which is…* про все речення — тема B2-09. creatively — [кри-ЕЙ-тів-лі], наголос на другому складі.
> uk: Думаю, так. Мистецтво вчить дітей мислити креативно, а це корисно майже на будь-якій роботі.

## Типові помилки українців

> [!pitfall] Novel ≠ новела
> ***Novel*** — **роман** (велика книжка). Українська «новела» чи «оповідання» — ***short story***, «повість» — ***novella***. А «роман» у значенні «любовна історія між людьми» — ***affair*** або ***romance***. Тож *She's written three novels and a collection of short stories* — «Вона написала три романи й збірку оповідань».

> [!pitfall] Artist ≠ артист
> ***Artist*** — насамперед **художник** (і ширше — митець, творча людина: *recording artist* — виконавець). «Артист» на сцені — ***actor / actress***, ***performer***, ***entertainer***; «артист цирку» — *circus performer*. Тож *My brother is an artist* — він малює, а не грає в театрі.

> [!pitfall] «I like fantastic films»
> ***Fantastic*** — «чудовий, неймовірний» (*The concert was fantastic!*). Жанр «фантастика» — ***science fiction*** (***sci-fi***) або ***fantasy*** (фентезі — магія, дракони). Тож *I love sci-fi* — «Я люблю фантастику», а *fantastic films* — просто «чудові фільми».

> [!pitfall] «Let's go to the 7 o'clock seance»
> ***Séance*** англійською — спіритичний сеанс (виклик духів!). Кіносеанс — ***showing*** або ***screening***: *Let's go to the 7 p.m. showing.* «Афіша» — ***poster*** або *what's on* / *listings*; «премʼєра» — *premiere*; «квитки на вечірній сеанс» — *tickets for the evening showing*.

## Практика

> [!quiz] «The jokes fell flat.» Що сталося?
> level: B2 · id: en-b2-culture-q02
> - [ ] Жарти були дуже смішні.
> - [x] Жарти не спрацювали — ніхто не сміявся.
> - [ ] Жарти були образливі.
> - [ ] Жарти вирізали з фільму.
>
> **Пояснення:** *fall flat* — не мати очікуваного ефекту: жарт «падає», фінал розчаровує, план не спрацьовує.

> [!quiz] Які прикметники звучать як похвала у рецензії? Обери всі.
> level: B2 · id: en-b2-culture-q03
> - [x] gripping
> - [x] thought-provoking
> - [ ] far-fetched
> - [x] stunning
> - [ ] dull
>
> **Пояснення:** *gripping* — захопливий, *thought-provoking* — змушує думати, *stunning* — приголомшливий. *Far-fetched* (неправдоподібний) і *dull* (нудний) — критика.

> [!quiz] Кіно: заповни пропуски
> level: B2 · type: fill · id: en-b2-culture-q04 · bank: story, actors, continuation
>
> ```text fill
> The [[plot]] is simple: a family moves to a village and discovers a secret.
> The [[cast]] includes three Oscar winners.
> The [[sequel]] is coming out next year.
> It was the biggest [[box-office|box office]] hit of the summer.
> ```

> [!quiz] Мистецтво: заповни пропуски
> level: B2 · type: fill · id: en-b2-culture-q05 · bank: exposition, artist, picture
>
> ```text fill
> The [[exhibition]] runs until the end of May.
> You can see the painting in the national [[gallery]].
> Many critics call it the artist's greatest [[masterpiece]].
> The [[curator]] explained how the works were chosen.
> ```
>
> **Пояснення:** українська «експозиція» → *exhibition* (або *display*); *exposition* англійською — переважно «виклад, пояснення» (у тексті чи музиці).

> [!quiz] Склади речення-акцент: «Найбільше мені сподобався саундтрек».
> level: B2 · type: order · id: en-b2-culture-q06
>
> ```text order
> What I
> liked most
> was
> the soundtrack.
> it was ✗
> ```
>
> **Пояснення:** *What I liked most was…* — так виділяють головне (cleft sentence). Порядок: *What + підмет + дієслово* — без інверсії, як у непрямому питанні.

> [!quiz] «Мій двоюрідний брат — артист театру». Обери правильний варіант.
> level: B2 · id: en-b2-culture-q07
> - [ ] My cousin is a theatre artist.
> - [x] My cousin is a stage actor.
> - [ ] My cousin is an artiste of theatre.
> - [ ] My cousin is a theatre painter.
>
> **Пояснення:** «артист театру» — *actor / stage actor*. *Artist* — насамперед художник; *theatre artist* звучить як художник-декоратор.

> [!quiz] «Я обожнюю фантастику — особливо про космос». Обери правильний варіант.
> level: B2 · id: en-b2-culture-q08
> - [ ] I adore fantastic, especially about space.
> - [x] I love science fiction, especially stories set in space.
> - [ ] I love fantastic films about the cosmos.
> - [ ] I love fantasy science about space.
>
> **Пояснення:** жанр — *science fiction (sci-fi)*; *fantastic* — «чудовий». «Про космос» — *set in space*, без *cosmos* (тема B2-16).

> [!quiz] Обери прислівник: «It's a ___ acted film — every performance is convincing.»
> level: B2 · id: en-b2-culture-q09
> - [ ] brilliant
> - [x] brilliantly
> - [ ] brillianty
> - [ ] brilliance
>
> **Пояснення:** перед дієприкметником (*acted, written, shot*) — **прислівник**: *brilliantly acted, beautifully shot, well written*. Прикметник *brilliant* стоїть перед іменником: *a brilliant film*.

> [!quiz] IELTS Academic Reading: True, False чи Not Given?
> level: B2 · id: en-b2-culture-q10
>
> **Free entry, full galleries?** In 2001, the UK government removed admission charges at its major national museums. Over the following decade, the number of visits to the museums that had previously charged more than doubled. However, critics point out that the social background of visitors changed far less than expected: free entry encouraged more visits, but many came from people who were already regular museum-goers. In recent years, several museums have introduced charges for special exhibitions in order to cover rising costs. Supporters of free entry argue that its value cannot be measured by visitor numbers alone, since museums also serve schools, researchers and tourists.
>
> *Statement:* **Visitor numbers fell after admission charges were removed.**
> - [ ] True
> - [x] False
> - [ ] Not Given
>
> **Пояснення:** *the number of visits… more than doubled* — більш ніж подвоїлася. Твердження каже протилежне → **False**.

> [!quiz] IELTS Academic Reading: True, False чи Not Given? (той самий текст)
> level: B2 · id: en-b2-culture-q11
>
> **Free entry, full galleries?** In 2001, the UK government removed admission charges at its major national museums. Over the following decade, the number of visits to the museums that had previously charged more than doubled. However, critics point out that the social background of visitors changed far less than expected: free entry encouraged more visits, but many came from people who were already regular museum-goers. In recent years, several museums have introduced charges for special exhibitions in order to cover rising costs. Supporters of free entry argue that its value cannot be measured by visitor numbers alone, since museums also serve schools, researchers and tourists.
>
> *Statement:* **Free admission did not change the social mix of visitors as much as people had hoped.**
> - [x] True
> - [ ] False
> - [ ] Not Given
>
> **Пояснення:** *the social background of visitors changed far less than expected* = *did not change the social mix as much as people had hoped*. Парафраз: *background → mix*, *expected → hoped* → **True**.

> [!quiz] IELTS Academic Reading: True, False чи Not Given? (той самий текст)
> level: B2 · id: en-b2-culture-q12
>
> **Free entry, full galleries?** In 2001, the UK government removed admission charges at its major national museums. Over the following decade, the number of visits to the museums that had previously charged more than doubled. However, critics point out that the social background of visitors changed far less than expected: free entry encouraged more visits, but many came from people who were already regular museum-goers. In recent years, several museums have introduced charges for special exhibitions in order to cover rising costs. Supporters of free entry argue that its value cannot be measured by visitor numbers alone, since museums also serve schools, researchers and tourists.
>
> *Statement:* **Special exhibitions attract more visitors than permanent collections.**
> - [ ] True
> - [ ] False
> - [x] Not Given
>
> **Пояснення:** про спецвиставки сказано лише, що за них **почали брати плату**. Порівняння відвідуваності немає → **Not Given**.

> [!quiz] IELTS Summary completion: заповни пропуски словами з банку (той самий текст)
> level: B2 · type: fill · id: en-b2-culture-q13 · bank: halved, tourists, tickets, permanent
>
> ```text fill
> After charges were removed, visits to the formerly paid museums more than [[doubled]].
> Many of the new visits came from people who were already [[regular]] museum-goers.
> Some museums now charge for [[special]] exhibitions.
> Museums also serve schools, researchers and [[tourists]].
> ```
>
> **Пояснення:** *halved* — протилежне; *permanent* — пастка до *special*. У банку можуть бути й правильні слова — *tourists* тут якраз правильна відповідь, тож не відкидай слово лише тому, що воно «надто очевидне».

> [!quiz] IELTS Writing Task 2: яке речення найкраще замінює «Art is good for children»?
> level: B2 · id: en-b2-culture-q14
> - [ ] Art is very very good for kids.
> - [x] Art fosters creativity and helps children express their emotions.
> - [ ] Art is a good thing for children and it is good.
> - [ ] Children like art because it is nice.
>
> **Пояснення:** *good, nice, kids* — найчастіші «порожні» слова в есе Band 5. Точне дієслово (*fosters creativity*) і конкретний ефект (*express their emotions*) піднімають оцінку за Lexical Resource.

> [!quiz] Рецензія: заповни пропуски прикметниками з банку
> level: B2 · type: fill · id: en-b2-culture-q15 · bank: underrated, moving
>
> ```text fill
> I guessed the ending in the first ten minutes — the plot is very [[predictable]].
> Everyone says it's the best film of the year, but I think it's [[overrated]].
> A teenager saves the world with a toothbrush? That's a bit [[far-fetched]].
> Although the story is strange, the actors are completely [[convincing]].
> ```

## Фішки

> [!reel] 💣 Blockbuster — від бомби до кіно
> У 1940-х *blockbuster* називали величезні авіабомби, здатні зруйнувати цілий квартал (*block*). Згодом слово перейшло на гучні успіхи — спершу вистави, потім фільми, на які черга стояла «навколо кварталу». Сьогодні це касовий хіт з великим бюджетом.

> [!reel] 🎭 Break a leg!
> Перед виставою англомовні актори бажають не *Good luck*, а *Break a leg!* — «Зламай ногу!». Театральні люди забобонні: побажання удачі нібито приносить невдачу, тож бажають протилежне. Точне походження виразу невідоме — версій щонайменше пʼять. Українське «Ні пуху ні пера!» працює за тим самим принципом.

> [!reel] 🖼️ Як крадіжка зробила Мону Лізу зіркою
> У 1911 році італієць Вінченцо Перуджа, який працював у Луврі, просто виніс «Мону Лізу» під одягом. Картину шукали два роки, газети всього світу друкували її портрет — і саме тоді вона стала найвідомішою картиною на планеті. Знайшли її у Флоренції 1913 року, коли Перуджа спробував її продати.

## Джерела та що почитати

- 🟢 [Cambridge Dictionary](https://dictionary.cambridge.org/) — UK / US: *curator, portrait, contemporary, masterpiece*; позначки *informal* (*gig, page-turner*).
- 🟢 [British Council LearnEnglish — Reading B2](https://learnenglish.britishcouncil.org/skills/reading/b2-reading) — рецензії й статті про культуру з вправами.
- 🟡 [The Guardian — Culture](https://www.theguardian.com/culture) — живі рецензії на фільми, книжки й виставки: збирай оцінні прикметники.
- 🟡 M. McCarthy, F. O'Dell — *English Vocabulary in Use: Upper-Intermediate*: розділи «Art and literature», «Cinema and theatre».
- 🟡 [IELTS — офіційний сайт](https://ielts.org) (Speaking test format) — Part 3: абстрактні питання про культуру й суспільство.

> [!important] Підсумок
> - Кіно: *plot, character, cast, director, sequel, blockbuster, box office, soundtrack, special effects, adaptation, be set in, genre, spoiler*.
> - Література й сцена: *novel, fiction, protagonist, page-turner, playwright, lyrics, venue, gig, performance, rehearsal, orchestra*.
> - Мистецтво: *exhibition, gallery, masterpiece, sculpture, portrait, abstract, contemporary, curator*.
> - Оцінка: *gripping, thought-provoking, moving, stunning, convincing, critically acclaimed* ↔ *dull, predictable, far-fetched, overrated, fall flat*; *beautifully shot, brilliantly acted*; *What I liked most was…*
> - Пастки: *novel* = роман, *artist* = художник, *fantastic* ≠ фантастика (*sci-fi*), кіносеанс — *showing*, не «seance».
