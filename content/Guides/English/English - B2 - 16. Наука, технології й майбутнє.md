---
title: Наука, технології й майбутнє
order: 416
id: en-b2-science
level: B2
icon: px:microscope
tags: [english, b2, vocabulary, science, technology, ai, space, future, ielts]
prerequisites: ["[[English - B1 - 07. Технології, інтернет і соцмережі]]", "[[English - B1 - 14. Ймовірність — may, might, could, must, can't]]"]
estimatedMinutes: 45
---

# Наука, технології й майбутнє

> [!success] Після цієї теми ти зможеш
> - описати, як працює наукове дослідження: **hypothesis → experiment → findings → peer review → breakthrough** (B2);
> - говорити про штучний інтелект, автоматизацію, космос і медицину майбутнього точними словами, а не «good / bad technology»;
> - робити прогнози з різним ступенем упевненості: *is likely to, could well, is bound to, in the foreseeable future*;
> - будувати аргументи «за» і «проти» для IELTS Writing Task 2 і Speaking Part 3 (*Will AI replace doctors? Is space exploration worth the money?*);
> - відрізняти думку автора від фактів у завданні IELTS Yes / No / Not Given.

## Передбач

> [!quiz] «Вчені провели багато досліджень». Як сказати правильно?
> level: B2 · id: en-b2-science-q01
> - [ ] Scientists have made a lot of researches.
> - [ ] Scientists have done many researches.
> - [x] Scientists have carried out a lot of research.
> - [ ] Scientists have made many research.
>
> **Пояснення:** *research* — **незлічуване**: без *-s*, без *a*, з *a lot of / much*. Дієслова — *do / carry out / conduct research*, але не *make*. Якщо треба порахувати — *a study, two studies* або *a piece of research*.

## Пояснення

### Як народжується відкриття

> [!diagram] Від питання до прориву
> ```yaml
> layout: flow
> nodes:
>   - { id: hyp, label: "hypothesis", text: "Coffee improves memory.", note: "гіпотеза", tone: blue, icon: "px:bulb" }
>   - { id: exp, label: "experiment", text: "200 people, 2 groups", note: "експеримент + sample", tone: violet, icon: "px:testTube" }
>   - { id: find, label: "findings", text: "+12% recall", note: "результати", tone: orange }
>   - { id: peer, label: "peer review", text: "3 experts check it", note: "рецензування", tone: gray, icon: "px:magnifier" }
>   - { id: rep, label: "replicate", text: "Other labs repeat it", note: "відтворення", tone: green, icon: "px:check" }
> steps:
>   - { focus: hyp, note: "Науковці висувають гіпотезу — form a hypothesis: припущення, яке можна перевірити." }
>   - { move: { from: hyp, to: exp, value: "test it" }, note: "Проводять експеримент — conduct an experiment — на вибірці (sample) з 200 людей: одна група пʼє каву, інша — ні." }
>   - { move: { from: exp, to: find, value: "data" }, note: "Отримують результати — findings. The findings suggest… — «результати свідчать…», обережно, без «доводять»." }
>   - { move: { from: find, to: peer, value: "paper" }, note: "Статтю перевіряють незалежні фахівці — it is peer-reviewed. Лише після цього її публікують у журналі." }
>   - { move: { from: peer, to: rep, value: "same result?" }, note: "Інші лабораторії мають відтворити результат — replicate the findings. Тільки тоді можна говорити про breakthrough." }
> ```

Зверни увагу на **обережні дієслова** — вони типові для науки й академічного IELTS: *The findings **suggest / indicate** that…* (свідчать), *This **may / could** explain…* (може пояснювати). Сильне *prove* (довести) науковці вживають рідко — і екзаменатори IELTS це помічають.

### Прогнози: наскільки ти впевнений?

На B2 замість простого *will* є ціла шкала впевненості — вона робить відповідь у Speaking Part 3 значно сильнішою.

| Упевненість | Конструкція | Приклад |
|---|---|---|
| майже 100 % | *be bound to* | *AI **is bound to** change the job market.* — ШІ неодмінно змінить ринок праці. |
| висока | *be likely to; will probably* | *Self-driving cars **are likely to** become common.* — Безпілотні авто, ймовірно, стануть звичними. |
| середня | *could well; may well* | *Humans **could well** reach Mars by 2040.* — Цілком можливо, люди дістануться Марса до 2040-го. |
| низька | *be unlikely to; probably won't* | *Robots **are unlikely to** replace nurses.* — Роботи навряд чи замінять медсестер. |
| часові рамки | *in the foreseeable future; in the long run* | *In the long run, automation will create new jobs.* — У довгостроковій перспективі автоматизація створить нові робочі місця. |

### Для IELTS: технології в Writing Task 2 і Speaking Part 3

Типові теми Task 2: *Some people think that space exploration is a waste of money that should be spent on problems on Earth. Discuss both views.* · *Artificial intelligence will soon replace many workers. Do the advantages outweigh the disadvantages?* Speaking Part 3: *How has technology changed education? Are people too dependent on their phones?*

> [!diagram] План есе «AI: advantages vs disadvantages»
> ```yaml
> layout: compare
> columns: { pro: "Advantages", con: "Disadvantages" }
> nodes:
>   - { id: p1, col: pro, label: "productivity", text: "automates routine tasks", tone: green }
>   - { id: p2, col: pro, label: "medicine", text: "faster, more accurate diagnosis", tone: green }
>   - { id: p3, col: pro, label: "safety", text: "machines do dangerous jobs", tone: green }
>   - { id: c1, col: con, label: "jobs", text: "some roles become obsolete", tone: red }
>   - { id: c2, col: con, label: "privacy", text: "algorithms collect personal data", tone: red }
>   - { id: c3, col: con, label: "inequality", text: "the digital divide grows", tone: red }
> steps:
>   - { focus: [p1, c1], note: "Пара «продуктивність ↔ робочі місця»: automation boosts productivity, but some jobs may become obsolete. Один абзац — одна ідея." }
>   - { focus: [p2, c2], note: "Медицина ↔ приватність: AI can detect diseases earlier, yet it relies on huge amounts of personal data." }
>   - { focus: [p3, c3], note: "Безпека ↔ нерівність: robots can take over dangerous work, but poorer regions risk being left behind — the digital divide." }
>   - { focus: [p1, p2, p3, c1, c2, c3], note: "У висновку — твоя позиція: On balance, I believe the benefits outweigh the drawbacks, provided that… Умова (provided that) — ознака зрілого аргументу." }
> ```

| Ідея | Фраза рівня Band 6.5–7 | Переклад |
|---|---|---|
| загроза | ***pose a threat** to privacy / jobs* | становити загрозу приватності / робочим місцям |
| наслідки | *have **far-reaching** consequences* | мати далекосяжні наслідки |
| використати | ***harness** the potential of AI* | використати потенціал ШІ |
| етика | *raise **ethical** concerns* | викликати етичні питання |
| застаріти | *become **obsolete*** | застаріти, стати непотрібним |
| залежність | *an over-**dependence** on technology* | надмірна залежність від технологій |
| нерівність | *widen the **digital divide*** | поглиблювати цифрову нерівність |
| безпрецедентний | *at an **unprecedented** pace* | з безпрецедентною швидкістю |

> [!example] Зразок абзацу для Task 2 (≈ Band 7)
> *Critics of space exploration argue that the billions spent on rockets would be better used to tackle poverty or climate change. However, this view overlooks the far-reaching benefits of space research. **Satellites**, which were originally developed for space programmes, now make accurate weather forecasts and global communication possible, and they are essential for monitoring the effects of climate change itself. Furthermore, many technologies that we take for granted, from water filters to medical scanners, grew out of research for space missions. It could therefore be argued that space exploration is not an alternative to solving problems on Earth, but one of the most effective ways of doing so.*
>
> Що тут працює: спершу чужа позиція (*Critics argue…*), потім заперечення (*However, this view overlooks…*), два конкретні приклади й обережний висновок (*It could therefore be argued…*). Лексика теми — *far-reaching, satellites, monitoring, take for granted*.

## Приклади

- *Scientists have **made a breakthrough** in cancer research.* — Науковці зробили прорив у дослідженні раку.
- *The **findings** were published after a long **peer review**.* — Результати опублікували після тривалого рецензування.
- *Other teams have failed to **replicate** the results.* — Іншим командам не вдалося відтворити результати.
- *Many experts believe that **automation** will change every industry.* — Багато експертів вважають, що автоматизація змінить кожну галузь.
- *Smartphones have made many older **devices** **obsolete**.* — Смартфони зробили багато старіших пристроїв непотрібними.
- *The **spacecraft** will stay in **orbit** for six months.* — Космічний корабель залишатиметься на орбіті шість місяців.
- *The new **vaccine** is still in **clinical trials**.* — Нова вакцина ще проходить клінічні випробування.
- ***Genetic engineering** raises serious **ethical** questions.* — Генна інженерія порушує серйозні етичні питання.
- *We need to **harness** the power of AI responsibly.* — Нам треба відповідально використовувати силу ШІ.
- *Robots are **unlikely to** replace teachers **in the foreseeable future**.* — Найближчим часом роботи навряд чи замінять учителів.

## Слова

### Наукове дослідження

> [!word] hypothesis
> ipa: /haɪˈpɒθəsɪs/ · ipa-us: /haɪˈpɑːθəsɪs/ · pos: noun · level: B2 · id: en-b2-science-w01
> uk: гіпотеза
> example: The experiment was designed to test the **hypothesis**. — Експеримент мав перевірити гіпотезу.
> forms: hypothesis → hypotheses /haɪˈpɒθəsiːz/
> note: формальне. *form / test / support a hypothesis*. Наголос на другому складі: [хай-ПО-те-сіс].

> [!word] experiment
> ipa: /ɪkˈsperɪmənt/ · pos: noun · level: B2 · id: en-b2-science-w02
> uk: експеримент; дослід
> example: They **conducted an experiment** on 200 volunteers. — Вони провели експеримент на 200 добровольцях.
> note: нейтральне. *do / conduct / carry out an experiment*. Дієслово *experiment on / with*. Не плутай з *experience* — досвід!

> [!word] conduct
> ipa: /kənˈdʌkt/ · pos: verb · level: B2 · id: en-b2-science-w03
> uk: проводити (дослідження, опитування, експеримент)
> example: The survey was **conducted** in ten countries. — Опитування провели в десяти країнах.
> note: формальне; нейтрально — *carry out, do*. Іменник *conduct* /ˈkɒndʌkt/ (наголос на першому) — поведінка.

> [!word] observation
> ipa: /ˌɒbzəˈveɪʃən/ · ipa-us: /ˌɑːbzərˈveɪʃən/ · pos: noun · level: B2 · id: en-b2-science-w04
> uk: спостереження
> example: The theory is based on years of careful **observation**. — Теорія ґрунтується на роках ретельних спостережень.
> note: нейтральне-формальне. *make an observation* — також «зробити зауваження»; дієслово *observe*.

> [!word] discovery
> ipa: /dɪˈskʌvəri/ · pos: noun · level: B2 · id: en-b2-science-w05
> uk: відкриття
> example: The **discovery** of penicillin changed medicine forever. — Відкриття пеніциліну назавжди змінило медицину.
> note: нейтральне. *make a discovery*. Дієслово *discover* (B1) — відкрити те, що вже існувало; *invent* — винайти нове.

> [!word] laboratory
> ipa: /ləˈbɒrətri/ · ipa-us: /ˈlæbrətɔːri/ · pos: noun · level: B2 · id: en-b2-science-w06
> uk: лабораторія
> example: The samples were sent to a **laboratory** in Lviv. — Зразки надіслали в лабораторію у Львові.
> note: нейтральне; розмовно — *lab*. Яскрава різниця UK / US: UK [ле-БО-ре-трі], US [ЛЕ-бре-то-рі].

> [!word] sample
> ipa: /ˈsɑːmpəl/ · ipa-us: /ˈsæmpəl/ · pos: noun · level: B2 · id: en-b2-science-w07
> uk: зразок; проба; вибірка
> example: The study used a **sample** of 5,000 adults. — У дослідженні була вибірка з 5 000 дорослих.
> note: нейтральне. *a blood sample* — аналіз крові; *a large / representative sample* — велика / репрезентативна вибірка.

> [!word] theory
> ipa: /ˈθɪəri/ · ipa-us: /ˈθiːəri/ · pos: noun · level: B2 · id: en-b2-science-w08
> uk: теорія
> example: **In theory**, the system should work, but nobody has tested it. — Теоретично система мала б працювати, але ніхто її не перевіряв.
> note: нейтральне. *in theory* ↔ *in practice*. /θ/ на початку — язик між зубами, не «т» і не «ф».

> [!word] prove
> ipa: /pruːv/ · pos: verb · level: B2 · id: en-b2-science-w09
> uk: довести; виявитися
> example: Nobody has **proved** that the drug is safe. — Ніхто не довів, що препарат безпечний.
> forms: prove → proved → proved / proven
> note: нейтральне. *proven* — частіше як прикметник: *a proven method*. *prove (to be)* — виявитися: *The idea proved (to be) wrong.*

> [!word] peer review
> ipa: /ˌpɪə rɪˈvjuː/ · ipa-us: /ˌpɪr rɪˈvjuː/ · pos: noun · level: B2 · id: en-b2-science-w10
> uk: рецензування (незалежними фахівцями)
> example: The paper has not passed **peer review** yet. — Стаття ще не пройшла рецензування.
> note: формальне. *peer* — рівний, колега; *a peer-reviewed journal* — рецензований журнал.

> [!word] funding
> ipa: /ˈfʌndɪŋ/ · pos: noun · level: B2 · id: en-b2-science-w11
> uk: фінансування
> example: The project lost its **funding** last year. — Минулого року проєкт утратив фінансування.
> note: нейтральне, незлічуване. *receive / cut / apply for funding*; *government funding for research*.

> [!word] groundbreaking
> ipa: /ˈɡraʊndbreɪkɪŋ/ · pos: adj · level: B2 · id: en-b2-science-w12
> uk: новаторський; революційний
> example: Her **groundbreaking** research changed how we treat diabetes. — Її новаторське дослідження змінило лікування діабету.
> note: нейтральне. Синоніми — *pioneering, revolutionary*.

> [!word] cutting-edge
> ipa: /ˌkʌtɪŋ ˈedʒ/ · ipa-us: /ˌkʌt̬ɪŋ ˈedʒ/ · pos: adj · level: B2 · id: en-b2-science-w13
> uk: передовий; найсучасніший
> example: The hospital uses **cutting-edge** technology. — Лікарня використовує найсучасніші технології.
> note: нейтральне. Перед іменником — з дефісом; після — *at the cutting edge of science*.

> [!word] replicate
> ipa: /ˈreplɪkeɪt/ · pos: verb · level: B2 · id: en-b2-science-w14
> uk: відтворити (результат, експеримент)
> example: No other lab has been able to **replicate** the results. — Жодна інша лабораторія не змогла відтворити результати.
> note: формальне. Іменник — *replication*.

> [!word] conclusive
> ipa: /kənˈkluːsɪv/ · pos: adj · level: B2 · id: en-b2-science-w15
> uk: переконливий; остаточний
> example: There is no **conclusive** evidence that mobile phones cause cancer. — Немає переконливих доказів, що мобільні телефони спричиняють рак.
> note: формальне. Протилежне — *inconclusive* (непереконливий, без однозначного висновку).

### Штучний інтелект і цифровий світ

> [!word] artificial intelligence
> ipa: /ˌɑːtɪfɪʃəl ɪnˈtelɪdʒəns/ · ipa-us: /ˌɑːrt̬ɪfɪʃəl ɪnˈtelədʒəns/ · pos: noun · level: B2 · id: en-b2-science-w16
> uk: штучний інтелект
> example: **Artificial intelligence** can now write code and translate texts. — Штучний інтелект тепер уміє писати код і перекладати тексти.
> note: нейтральне; скорочено *AI* /ˌeɪ ˈaɪ/ (не «ей-ай» з наголосом на першому — наголос на *I*).

> [!word] algorithm
> ipa: /ˈælɡərɪðəm/ · pos: noun · level: B2 · id: en-b2-science-w17
> uk: алгоритм
> example: The **algorithm** decides which posts you see. — Алгоритм вирішує, які дописи ти бачиш.
> note: нейтральне. У середині /ð/ (як у *this*), а не «т»: [ЕЛ-ге-рі-зм].

> [!word] automation
> ipa: /ˌɔːtəˈmeɪʃən/ · ipa-us: /ˌɑːt̬əˈmeɪʃən/ · pos: noun · level: B2 · id: en-b2-science-w18
> uk: автоматизація
> example: **Automation** has replaced many factory jobs. — Автоматизація замінила багато робочих місць на заводах.
> note: нейтральне, ключове слово IELTS. Дієслово — *automate*.

> [!word] innovation
> ipa: /ˌɪnəˈveɪʃən/ · pos: noun · level: B2 · id: en-b2-science-w19
> uk: інновація; нововведення
> example: The government wants to encourage **innovation** in small businesses. — Уряд хоче заохочувати інновації в малому бізнесі.
> note: нейтральне. Злічуване (*a new innovation*) і незлічуване (*technological innovation*).

> [!word] innovative
> ipa: /ˈɪnəvətɪv/ · ipa-us: /ˈɪnəveɪt̬ɪv/ · pos: adj · level: B2 · id: en-b2-science-w20
> uk: інноваційний; новаторський
> example: They came up with an **innovative** way to recycle batteries. — Вони придумали інноваційний спосіб переробки батарейок.
> note: нейтральне. UK [І-не-ве-тів], US [І-не-вей-тів].

> [!word] obsolete
> ipa: /ˈɒbsəliːt/ · ipa-us: /ˌɑːbsəˈliːt/ · pos: adj · level: B2 · id: en-b2-science-w21
> uk: застарілий; що вийшов з ужитку
> example: Fax machines are now almost **obsolete**. — Факси тепер майже вийшли з ужитку.
> note: нейтральне-формальне. *become / make something obsolete*. Наголос: UK на першому, US — на останньому складі.

> [!word] intuitive
> ipa: /ɪnˈtjuːɪtɪv/ · ipa-us: /ɪnˈtuːət̬ɪv/ · pos: adj · level: B2 · id: en-b2-science-w22
> uk: інтуїтивно зрозумілий; інтуїтивний
> example: The app is so **intuitive** that my grandmother uses it without help. — Застосунок такий зрозумілий, що бабуся користується ним без допомоги.
> note: нейтральне. Про інтерфейс — *intuitive / user-friendly*; про людину — *an intuitive person* (людина з розвиненою інтуїцією).

> [!word] cybersecurity
> ipa: /ˌsaɪbəsɪˈkjʊərəti/ · ipa-us: /ˌsaɪbərsɪˈkjʊrət̬i/ · pos: noun · level: B2 · id: en-b2-science-w23
> uk: кібербезпека
> example: Banks spend millions on **cybersecurity**. — Банки витрачають мільйони на кібербезпеку.
> note: нейтральне. UK часто пишуть *cyber security* окремо.

> [!word] virtual reality
> ipa: /ˌvɜːtʃuəl riˈæləti/ · ipa-us: /ˌvɝːtʃuəl riˈælət̬i/ · pos: noun · level: B2 · id: en-b2-science-w24
> uk: віртуальна реальність
> example: Surgeons now train using **virtual reality**. — Хірурги тепер тренуються у віртуальній реальності.
> note: нейтральне; скорочено *VR*. Пара — *augmented reality (AR)* — доповнена реальність.

> [!word] drone
> ipa: /drəʊn/ · ipa-us: /droʊn/ · pos: noun · level: B2 · id: en-b2-science-w25
> uk: дрон; безпілотник
> example: Farmers use **drones** to check their fields. — Фермери використовують дрони, щоб оглядати поля.
> note: нейтральне. Колокація *fly a drone* — керувати дроном.

> [!word] wearable
> ipa: /ˈweərəbəl/ · ipa-us: /ˈwerəbəl/ · pos: adj · level: B2 · id: en-b2-science-w26
> uk: який можна носити (про ґаджети)
> example: **Wearable** devices can track your heart rate. — Ґаджети, які носять на тілі, можуть відстежувати пульс.
> note: нейтральне. *wearable technology / wearables* — смарт-годинники, фітнес-браслети.

> [!word] dependence
> ipa: /dɪˈpendəns/ · pos: noun · level: B2 · id: en-b2-science-w27
> uk: залежність (від чогось)
> example: Our **dependence on** technology is growing every year. — Наша залежність від технологій зростає щороку.
> note: нейтральне-формальне, часте в IELTS. Прийменник — **on**, не «from»: *dependence on oil*. *over-dependence* — надмірна залежність.

> [!word] tech-savvy
> ipa: /ˈtek ˌsævi/ · pos: adj · level: B2 · id: en-b2-science-w28
> uk: який добре розбирається в технологіях
> example: My grandmother is surprisingly **tech-savvy**. — Моя бабуся напрочуд добре розбирається в техніці.
> note: розмовне. В есе — *digitally literate*.

> [!word] digital divide
> ipa: /ˌdɪdʒɪtəl dɪˈvaɪd/ · pos: noun · level: B2 · id: en-b2-science-w29
> uk: цифрова нерівність
> example: Online learning has widened the **digital divide**. — Онлайн-навчання поглибило цифрову нерівність.
> note: формальне, ключова фраза IELTS: розрив між тими, хто має доступ до інтернету й техніки, і тими, хто не має.

### Космос

> [!word] space exploration
> ipa: /ˈspeɪs ˌekspləˈreɪʃən/ · pos: noun · level: B2 · id: en-b2-science-w30
> uk: дослідження космосу
> example: **Space exploration** is extremely expensive. — Дослідження космосу коштує надзвичайно дорого.
> note: нейтральне. Космос — *space* без артикля: *go into space*, а не «to the cosmos».

> [!word] spacecraft
> ipa: /ˈspeɪskrɑːft/ · ipa-us: /ˈspeɪskræft/ · pos: noun · level: B2 · id: en-b2-science-w31
> uk: космічний апарат; корабель
> example: The **spacecraft** landed safely on the Moon. — Космічний апарат безпечно приземлився на Місяці.
> forms: spacecraft → spacecraft
> note: нейтральне. Множина така сама: *two spacecraft*. Розмовно — *spaceship*.

> [!word] orbit
> ipa: /ˈɔːbɪt/ · ipa-us: /ˈɔːrbɪt/ · pos: noun · level: B2 · id: en-b2-science-w32
> uk: орбіта; (дієслово) обертатися навколо
> example: The station has been **in orbit** since 1998. — Станція перебуває на орбіті з 1998 року.
> note: нейтральне. *go into orbit*; дієслово: *The Moon orbits the Earth.*

> [!word] satellite
> ipa: /ˈsætəlaɪt/ · ipa-us: /ˈsæt̬əlaɪt/ · pos: noun · level: B2 · id: en-b2-science-w33
> uk: супутник (штучний чи природний)
> example: GPS works thanks to dozens of **satellites**. — GPS працює завдяки десяткам супутників.
> note: нейтральне. *launch a satellite*; *satellite TV*.

> [!word] astronaut
> ipa: /ˈæstrənɔːt/ · ipa-us: /ˈæstrənɑːt/ · pos: noun · level: B2 · id: en-b2-science-w34
> uk: астронавт; космонавт
> example: Leonid Kadeniuk was the first **astronaut** of independent Ukraine. — Леонід Каденюк був першим космонавтом незалежної України.
> note: нейтральне. Англійською будь-який космонавт — *astronaut*; *cosmonaut* — лише про радянських і російських.

> [!word] colonise
> ipa: /ˈkɒlənaɪz/ · ipa-us: /ˈkɑːlənaɪz/ · pos: verb · level: B2 · id: en-b2-science-w35
> uk: колонізувати; заселити
> example: Some scientists believe we will **colonise** Mars this century. — Деякі науковці вважають, що ми заселимо Марс у цьому столітті.
> note: нейтральне. UK *colonise*, US *colonize*.

### Медицина майбутнього

> [!word] gene
> ipa: /dʒiːn/ · pos: noun · level: B2 · id: en-b2-science-w36
> uk: ген
> example: Eye colour is controlled by several **genes**. — Колір очей залежить від кількох генів.
> note: нейтральне. Прикметник *genetic* /dʒəˈnetɪk/; *It's in her genes* — це в неї в генах.

> [!word] genetic engineering
> ipa: /dʒəˌnetɪk ˌendʒɪˈnɪərɪŋ/ · ipa-us: /dʒəˌnet̬ɪk ˌendʒɪˈnɪrɪŋ/ · pos: noun · level: B2 · id: en-b2-science-w37
> uk: генна інженерія
> example: **Genetic engineering** could help us grow crops that survive drought. — Генна інженерія може допомогти вирощувати посухостійкі культури.
> note: нейтральне. *genetically modified (GM) food* — ГМ-продукти.

> [!word] vaccine
> ipa: /ˈvæksiːn/ · ipa-us: /vækˈsiːn/ · pos: noun · level: B2 · id: en-b2-science-w38
> uk: вакцина
> example: Scientists developed the **vaccine** in less than a year. — Науковці розробили вакцину менш ніж за рік.
> note: нейтральне. Наголос: UK [ВЕК-сін], US [век-СІН]. *vaccinate* — вакцинувати.

> [!word] clinical trial
> ipa: /ˌklɪnɪkəl ˈtraɪəl/ · pos: noun · level: B2 · id: en-b2-science-w39
> uk: клінічне випробування
> example: The drug is now in the final stage of **clinical trials**. — Препарат зараз на останньому етапі клінічних випробувань.
> note: формальне. *take part in a clinical trial*.

> [!word] stem cell
> ipa: /ˈstem sel/ · pos: noun · level: B2 · id: en-b2-science-w40
> uk: стовбурова клітина
> example: **Stem cell** research may one day help people with spinal injuries. — Дослідження стовбурових клітин колись може допомогти людям з травмами хребта.
> note: нейтральне-наукове.

### Майбутнє й етика

> [!word] ethical
> ipa: /ˈeθɪkəl/ · pos: adj · level: B2 · id: en-b2-science-w41
> uk: етичний
> example: Cloning animals raises serious **ethical** questions. — Клонування тварин порушує серйозні етичні питання.
> note: нейтральне-формальне. *ethics* — етика; *unethical* — неетичний.

> [!word] unprecedented
> ipa: /ʌnˈpresɪdentɪd/ · pos: adj · level: B2 · id: en-b2-science-w42
> uk: безпрецедентний; небачений
> example: Technology is changing at an **unprecedented** pace. — Технології змінюються з небаченою швидкістю.
> note: формальне, сильне слово для IELTS. Наголос на другому складі: [ан-ПРЕ-сі-ден-тід].

> [!word] limitation
> ipa: /ˌlɪmɪˈteɪʃən/ · pos: noun · level: B2 · id: en-b2-science-w43
> uk: обмеження; слабке місце (дослідження, методу)
> example: The study has one important **limitation**: the sample was very small. — Дослідження має одне важливе обмеження: вибірка була дуже малою.
> note: формальне, типове для наукових текстів. *have / acknowledge limitations*. Синоніми — *drawback, downside* (розм.).

> [!word] safeguard
> ipa: /ˈseɪfɡɑːd/ · ipa-us: /ˈseɪfɡɑːrd/ · pos: verb · level: B2 · id: en-b2-science-w44
> uk: захищати; убезпечувати
> example: New laws are needed to **safeguard** our personal data. — Потрібні нові закони, щоб захистити наші персональні дані.
> note: формальне, сильне слово для IELTS. *safeguard somebody's privacy / interests / rights*. Іменник: *safeguards against misuse* — запобіжники від зловживань.

> [!word] far-reaching
> ipa: /ˌfɑː ˈriːtʃɪŋ/ · ipa-us: /ˌfɑːr ˈriːtʃɪŋ/ · pos: adj · level: B2 · id: en-b2-science-w45
> uk: далекосяжний
> example: The internet has had **far-reaching** effects on society. — Інтернет мав далекосяжні наслідки для суспільства.
> note: формальне. *far-reaching consequences / changes / effects*.

> [!word] foreseeable
> ipa: /fɔːˈsiːəbəl/ · ipa-us: /fɔːrˈsiːəbəl/ · pos: adj · level: B2 · id: en-b2-science-w46
> uk: передбачуваний; доступний для прогнозу
> example: Robots won't replace nurses **in the foreseeable future**. — Найближчим часом роботи не замінять медсестер.
> note: формальне, найчастіше у фразі *in / for the foreseeable future* — у найближчому майбутньому.

> [!word] harness
> ipa: /ˈhɑːnɪs/ · ipa-us: /ˈhɑːrnɪs/ · pos: verb · level: B2 · id: en-b2-science-w47
> uk: використовувати; поставити на службу (енергію, потенціал)
> example: We must **harness** technology to fight climate change. — Ми маємо поставити технології на службу боротьбі зі зміною клімату.
> note: формальне. Буквально *harness* — упряж; *harness the power of the sun / wind / AI*.

## Слухаємо

> [!listen] Що повідомили науковці?
> level: B2 · type: answer · id: en-b2-science-l01
> audio: Scientists in Japan say they have made a major breakthrough in battery technology. The new battery charges in under five minutes, but the team warns that it will not be available to consumers for at least ten years.
> - [ ] нова батарея вже продається в магазинах
> - [x] створили батарею, що заряджається за 5 хвилин, але в продажу вона буде не раніше ніж через 10 років
> - [ ] батарея працює десять років без зарядки
> - [ ] експеримент не вдався
>
> **Пояснення:** *charges in under five minutes* — заряджається менш ніж за 5 хвилин; *will not be available to consumers for at least ten years* — для покупців — щонайменше через 10 років.

> [!listen] Обери почуте
> level: B2 · type: choice · id: en-b2-science-l02
> audio: The findings have not yet been peer-reviewed.
> - [ ] The findings have already been peer-reviewed.
> - [x] The findings have not yet been peer-reviewed.
> - [ ] The findings will never be reviewed.
>
> **Пояснення:** *not yet* — «ще не». У природному мовленні *have not* часто звучить як *haven't* — слухай заперечення уважно, воно змінює весь зміст.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: en-b2-science-l03
> audio: Artificial intelligence could make some jobs obsolete.

> [!listen] IELTS Listening, Part 4 — лекція. Який головний аргумент лектора на користь польотів людей у космос?
> level: B2 · type: answer · id: en-b2-science-l04
> audio: So why do we still send people into space when robots are much cheaper? The main argument is flexibility. A robot can only do what it was programmed to do, whereas an astronaut can react to the unexpected. That said, a crewed mission costs roughly ten times more.
> - [ ] Astronauts are cheaper than robots.
> - [x] Humans can deal with situations nobody planned for.
> - [ ] Robots are too slow.
> - [ ] The public is more interested in astronauts.
>
> **Пояснення:** *an astronaut can react to the unexpected* = *deal with situations nobody planned for* — парафраз. Ціна — пастка: люди якраз **дорожчі** (*ten times more*).

> [!listen] IELTS Listening, Part 3 — студенти обговорюють експеримент. Що пропонує друга студентка?
> level: B2 · type: answer · id: en-b2-science-l05
> audio: A: Our results don't support the hypothesis at all. Should we just change it?
> audio: B: Not yet. The sample was only twenty people. Let's repeat the experiment with a much bigger group before we draw any conclusions.
> - [ ] змінити гіпотезу
> - [x] повторити експеримент на більшій вибірці
> - [ ] опублікувати результати
> - [ ] попросити допомоги викладача
>
> **Пояснення:** *repeat the experiment with a much bigger group* — повторити на більшій групі. Пропозицію змінити гіпотезу вона відкидає: *Not yet*.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: en-b2-science-l06
> audio: In the foreseeable future, robots will not replace doctors.

## Ситуація: подкаст про відкриття

> [!example] Подкаст «Science Today»: інтервʼю з дослідницею
> **Host:** Dr Bondar, your team has just published some exciting **findings**. What did you discover?
> **Dr Bondar:** We've developed a material that removes plastic particles from water. In the **laboratory**, it removed over ninety per cent of them.
> **Host:** That sounds like a real **breakthrough**!
> **Dr Bondar:** It's promising, but I'd be careful with that word. So far we've only tested small **samples**. Other teams need to **replicate** our results.
> **Host:** When could it be used in real life?
> **Dr Bondar:** If the next tests go well, we **could well** see the first filters within five years. But **in the foreseeable future**, it won't solve the whole problem.
> **Host:** What's the biggest challenge now?
> **Dr Bondar:** Honestly? **Funding**. Research like this is expensive, and investors want quick results.
>
> Зверни увагу, як науковиця **обережно** формулює висновки: *It's promising, but…*, *could well*, *if the next tests go well*. Так звучить академічна англійська — і так варто відповідати в IELTS Speaking Part 3, коли говориш про майбутнє.

## Вимова

> [!speak] Скажи вголос
> level: B2 · id: en-b2-science-s01
> text: The findings suggest that the hypothesis was wrong.
> ipa: /ðə ˈfaɪndɪŋz səˈdʒest ðət ðə haɪˈpɒθəsɪs wəz ˈrɒŋ/
> tip: hypothesis — [хай-ПО-те-сіс] з /θ/; suggest — UK [се-ДЖЕСТ]; wrong — літера *w* не читається.
> uk: Результати свідчать, що гіпотеза була хибною.

> [!speak] Скажи вголос (UK)
> level: B2 · id: en-b2-science-s02
> text: I spent the whole summer working in a laboratory.
> ipa: /aɪ ˈspent ðə ˈhəʊl ˈsʌmə ˈwɜːkɪŋ ɪn ə ləˈbɒrətri/
> tip: laboratory — UK [ле-БО-ре-трі] (4 склади), US [ЛЕ-бре-то-рі]; whole — літера *w* не читається: [хоул].
> uk: Я все літо пропрацював у лабораторії.

> [!speak] IELTS Speaking, Part 3 — «Will AI create more jobs than it destroys?»
> level: B2 · id: en-b2-science-s03
> text: Automation will replace some routine jobs, but it will also create new roles we can't imagine yet.
> ipa: /ˌɔːtəˈmeɪʃən wɪl rɪˈpleɪs səm ruːˈtiːn ˈdʒɒbz bət ɪt wɪl ˈɔːlsəʊ kriˈeɪt ˈnjuː ˈrəʊlz wi ˈkɑːnt ɪˈmædʒɪn ˈjet/
> tip: Баланс «мінус + плюс» через *but… also* — сильна відповідь. routine — наголос на другому: [ру-ТІН]; roles — [роулз].
> uk: Автоматизація замінить деякі рутинні професії, але водночас створить нові, яких ми ще й уявити не можемо.

> [!speak] IELTS Speaking, Part 3 — «Should governments spend money on space exploration?»
> level: B2 · id: en-b2-science-s04
> text: I believe they should, because space research has given us satellites, weather forecasts and new medical technologies.
> ipa: /aɪ bɪˈliːv ðeɪ ˈʃʊd bɪˈkɒz ˈspeɪs rɪˈsɜːtʃ həz ˈɡɪvən əs ˈsætəlaɪts ˈweðə ˈfɔːkɑːsts ən ˈnjuː ˈmedɪkəl tekˈnɒlədʒiz/
> tip: Позиція + причина + три приклади. satellites — [СЕ-те-лайтс]; forecasts — /sts/ у кінці, не ковтай.
> uk: Я вважаю, що варто, бо космічні дослідження дали нам супутники, прогнози погоди й нові медичні технології.

> [!speak] IELTS Speaking, Part 3 — «Are people too dependent on technology?»
> level: B2 · id: en-b2-science-s05
> text: To some extent, yes. Most of us would struggle to get through a single day without our smartphones.
> ipa: /tə ˈsʌm ɪkˈstent ˈjes ˈməʊst əv əs wəd ˈstrʌɡəl tə ˈɡet θruː ə ˈsɪŋɡəl ˈdeɪ wɪˈðaʊt aʊə ˈsmɑːtfəʊnz/
> tip: *To some extent* — частково погоджуєшся, це звучить зріліше, ніж просто *yes*. through — /θr/; without — /ð/.
> uk: До певної міри так. Більшості з нас було б важко прожити хоч один день без смартфона.

> [!speak] IELTS Speaking, Part 3 — «What are the dangers of genetic engineering?»
> level: B2 · id: en-b2-science-s06
> text: The main concern is that it could be used not to cure diseases but to design so-called perfect babies.
> ipa: /ðə ˈmeɪn kənˈsɜːn ɪz ðət ɪt kəd bi ˈjuːzd ˈnɒt tə ˈkjʊə dɪˈziːzɪz bət tə dɪˈzaɪn ˌsəʊˈkɔːld ˈpɜːfɪkt ˈbeɪbiz/
> tip: *not to… but to…* — контраст, виділяй голосом обидва дієслова. diseases — [ді-ЗІ-зіз], обидва *s* дзвінкі.
> uk: Головне побоювання — що її можуть використовувати не для лікування хвороб, а для створення так званих ідеальних дітей.

> [!speak] Скажи вголос
> level: B2 · id: en-b2-science-s07
> text: The new vaccine is going through clinical trials.
> ipa: /ðə ˈnjuː ˈvæksiːn ɪz ˈɡəʊɪŋ θruː ˈklɪnɪkəl ˈtraɪəlz/
> tip: vaccine — UK [ВЕК-сін], US [век-СІН]; through — /θr/, язик між зубами, потім одразу r.
> uk: Нова вакцина проходить клінічні випробування.

## Типові помилки українців

> [!pitfall] «I bought new technique for the kitchen»
> Українська «техніка» (пристрої) ≠ англійське ***technique*** — це «прийом, метод» (*a breathing technique*, *a new teaching technique*). Пристрої — ***appliances*** (побутова техніка: *kitchen appliances*), ***equipment*** (обладнання, незлічуване), ***devices / gadgets***. А «технології» загалом — ***technology***.

> [!pitfall] «Researches», «make a research»
> *Research* і *evidence*, *equipment*, *software*, *information* — **незлічувані**: не мають *-s* і *a*. Кажи *a lot of research*, *some evidence*, *a piece of equipment*. Дієслова: *do / carry out / conduct research*, не «make». Якщо треба кількість — *two studies*, *several experiments*.

> [!pitfall] Experience чи experiment?
> Звучать схоже, але: ***experience*** — досвід, пережите (*I have experience in IT*), ***experiment*** — дослід (*an experiment on mice*). «Я провів експеримент» — *I **did / conducted an experiment***; «Це був цікавий досвід» — *It was an interesting **experience***.

> [!pitfall] «Fly to the cosmos», «cosmonaut»
> «Космос» англійською — ***space*** (без артикля!): *go into space*, *in space*, *space travel*. *Cosmos* — філософсько-поетичне «всесвіт», у побуті так не кажуть. Українська «космонавтка» — ***astronaut***; *cosmonaut* у текстах англійською — лише про радянських і російських.

## Практика

> [!quiz] «Fax machines are now obsolete.» Що це означає?
> level: B2 · id: en-b2-science-q02
> - [ ] Факси тепер дуже дорогі.
> - [x] Факси вийшли з ужитку — ними майже не користуються.
> - [ ] Факси тепер знову в моді.
> - [ ] Факси заборонені.
>
> **Пояснення:** *obsolete* — застарілий, замінений чимось новішим. *become / make something obsolete*.

> [!quiz] Які дієслова поєднуються з research? Обери всі.
> level: B2 · id: en-b2-science-q03
> - [x] conduct research
> - [x] carry out research
> - [ ] make research
> - [x] fund research
> - [ ] give research
>
> **Пояснення:** *do / carry out / conduct research* — проводити, *fund research* — фінансувати. «Make research» — калька з «робити дослідження».

> [!quiz] Етапи дослідження: заповни пропуски
> level: B2 · type: fill · id: en-b2-science-q04 · bank: experience, theory, prove
>
> ```text fill
> First, the team formed a [[hypothesis]].
> Then they conducted an [[experiment]] on 300 volunteers.
> The [[findings]] were published in a scientific journal.
> Other labs were able to [[replicate]] the results.
> ```

> [!quiz] Космос: заповни пропуски
> level: B2 · type: fill · id: en-b2-science-q05 · bank: cosmos, cosmonaut
>
> ```text fill
> The station has been in [[orbit]] since 1998.
> In 1961, Yuri Gagarin became the first person to go into [[space]].
> Heidemarie Stefanyshyn-Piper, an American of Ukrainian descent, was a NASA [[astronaut]].
> GPS depends on a network of [[satellites]].
> ```
>
> **Пояснення:** *go into space* — без артикля. Американка українського походження Гайдемарі Стефанишин-Пайпер літала з NASA — вона *astronaut*; *cosmonaut* англійською кажуть лише про радянських і російських.

> [!quiz] Склади прогноз: «Найближчим часом ШІ навряд чи замінить учителів».
> level: B2 · type: order · id: en-b2-science-q06
>
> ```text order
> In the foreseeable future,
> AI is
> unlikely to
> replace teachers.
> will unlikely ✗
> ```
>
> **Пояснення:** *be unlikely to + дієслово* — «навряд чи». Варіант «will unlikely» — помилка; можна *AI probably won't replace teachers*.

> [!quiz] «Ми купили нову побутову техніку». Як сказати англійською?
> level: B2 · id: en-b2-science-q07
> - [ ] We bought a new technique.
> - [ ] We bought new techniques for home.
> - [x] We bought some new kitchen appliances.
> - [ ] We bought a new technic.
>
> **Пояснення:** *technique* — прийом, метод. Побутова техніка — *appliances*, обладнання — *equipment*.

> [!quiz] «У мене пʼять років досвіду в біотехнологіях». Обери правильний варіант.
> level: B2 · id: en-b2-science-q08
> - [ ] I have five years of experiment in biotechnology.
> - [x] I have five years of experience in biotechnology.
> - [ ] I have five years experiences in biotechnology.
> - [ ] I have experienced five years in biotechnology.
>
> **Пояснення:** досвід роботи — *experience* (незлічуване в цьому значенні). *Experiment* — дослід.

> [!quiz] Яке слово найточніше? «Technology is changing at an ___ pace.»
> level: B2 · id: en-b2-science-q09
> - [ ] unprecedent
> - [x] unprecedented
> - [ ] unpreceded
> - [ ] imprecedented
>
> **Пояснення:** *precedent* → *unprecedented* (небачений, безпрецедентний): заперечний префікс *un-* + *-ed*. Сильне слово для IELTS Writing.

> [!quiz] IELTS Academic Reading: Yes, No чи Not Given? (Чи збігається твердження з думкою автора?)
> level: B2 · id: en-b2-science-q10
>
> **Machines that diagnose.** Over the past decade, algorithms trained on millions of medical images have learned to detect certain cancers as accurately as experienced doctors. In one widely reported trial, an AI system identified early signs of breast cancer more reliably than a single radiologist, although it performed no better than two radiologists working together. Enthusiasts claim that such tools will soon make specialists unnecessary. In my view, this is a serious misreading of the evidence. The systems are remarkably good at narrow, well-defined tasks, but they cannot talk to a frightened patient or weigh up a treatment that involves difficult trade-offs. The real promise of medical AI lies not in replacing doctors but in freeing them from routine work, so that they can spend more time on the parts of medicine that machines cannot do.
>
> *Statement:* **AI systems will soon make medical specialists unnecessary.**
> - [ ] Yes
> - [x] No
> - [ ] Not Given
>
> **Пояснення:** так вважають *enthusiasts*, а автор називає це *a serious misreading of the evidence* — хибним прочитанням даних. Думка автора протилежна → **No**. Пастка: твердження є в тексті, але це **чужа** думка.

> [!quiz] IELTS Academic Reading: Yes, No чи Not Given? (той самий текст)
> level: B2 · id: en-b2-science-q11
>
> **Machines that diagnose.** Over the past decade, algorithms trained on millions of medical images have learned to detect certain cancers as accurately as experienced doctors. In one widely reported trial, an AI system identified early signs of breast cancer more reliably than a single radiologist, although it performed no better than two radiologists working together. Enthusiasts claim that such tools will soon make specialists unnecessary. In my view, this is a serious misreading of the evidence. The systems are remarkably good at narrow, well-defined tasks, but they cannot talk to a frightened patient or weigh up a treatment that involves difficult trade-offs. The real promise of medical AI lies not in replacing doctors but in freeing them from routine work, so that they can spend more time on the parts of medicine that machines cannot do.
>
> *Statement:* **In the trial, the AI system did better than two radiologists working as a team.**
> - [ ] Yes
> - [x] No
> - [ ] Not Given
>
> **Пояснення:** *it performed no better than two radiologists working together* — не краще за двох. Краще воно було лише за **одного** лікаря → **No**.

> [!quiz] IELTS Academic Reading: Yes, No чи Not Given? (той самий текст)
> level: B2 · id: en-b2-science-q12
>
> **Machines that diagnose.** Over the past decade, algorithms trained on millions of medical images have learned to detect certain cancers as accurately as experienced doctors. In one widely reported trial, an AI system identified early signs of breast cancer more reliably than a single radiologist, although it performed no better than two radiologists working together. Enthusiasts claim that such tools will soon make specialists unnecessary. In my view, this is a serious misreading of the evidence. The systems are remarkably good at narrow, well-defined tasks, but they cannot talk to a frightened patient or weigh up a treatment that involves difficult trade-offs. The real promise of medical AI lies not in replacing doctors but in freeing them from routine work, so that they can spend more time on the parts of medicine that machines cannot do.
>
> *Statement:* **Medical AI should first be introduced in countries with too few doctors.**
> - [ ] Yes
> - [ ] No
> - [x] Not Given
>
> **Пояснення:** автор нічого не каже про країни чи порядок впровадження. Логічна думка, але її немає в тексті → **Not Given**.

> [!quiz] IELTS Summary completion: заповни пропуски словами з банку (той самий текст)
> level: B2 · type: fill · id: en-b2-science-q13 · bank: patients, complex, creative, specialists
>
> ```text fill
> AI learned to detect some cancers by studying millions of medical [[images]].
> In one trial, it was more reliable than a single [[radiologist]].
> According to the writer, AI is very good at [[narrow]] tasks.
> Its real value is in freeing doctors from [[routine]] work.
> ```
>
> **Пояснення:** *complex* — протилежне до *narrow, well-defined*; *creative* — за змістом схоже на пастку до *routine*, але в тексті саме *routine work*.

> [!quiz] IELTS Writing Task 2: які вирази надто розмовні для есе? Обери всі.
> level: B2 · id: en-b2-science-q14
> - [x] kids are gonna use AI for everything
> - [x] a lot of stuff
> - [ ] pose a threat to privacy
> - [ ] have far-reaching consequences
> - [x] tech-savvy guys
>
> **Пояснення:** *gonna, stuff, guys, kids* — розмовні; в есе — *children are likely to…, many things / a wide range of…, digitally literate people*. *Pose a threat*, *far-reaching consequences* — саме та лексика, що піднімає бал за Lexical Resource.

> [!quiz] На який склад наголос у британському laboratory?
> level: B2 · id: en-b2-science-q15
> - [ ] LA-bo-ra-to-ry
> - [x] la-BO-ra-to-ry
> - [ ] la-bo-RA-to-ry
> - [ ] la-bo-ra-TO-ry
>
> **Пояснення:** UK — /ləˈbɒrətri/: наголос на другому складі, *-tory* стискається до [трі]. US — /ˈlæbrətɔːri/: наголос на першому.

## Фішки

> [!reel] 🤖 Robot — чеське слово
> Слово *robot* вигадав чеський художник Йозеф Чапек для пʼєси свого брата Карела «R.U.R.» (1920). Основа — чеське *robota*, «панщина, підневільна праця» — родич українського «робота». Тож кожен робот у світі — «панщинник» за походженням.

> [!reel] 🐛 Перший справжній баг
> У 1947 році команда, де працювала Ґрейс Гоппер, знайшла в компʼютері Harvard Mark II справжнього метелика, що застряг у реле. Його вклеїли в журнал з підписом «перший справжній випадок, коли знайшли баг». Слово *bug* у значенні «збій» інженери вживали й раніше, але ця історія зробила його легендою.

> [!reel] 🚀 Astronaut, cosmonaut, taikonaut
> *Astronaut* — грецьке «зоряний мореплавець», *cosmonaut* — «мореплавець усесвіту». США обрали перше, СРСР — друге, а китайських космонавтів у медіа іноді звуть *taikonauts* (від китайського *tàikōng* — космос). Одна професія — три слова, і за кожним стоїть історія космічних перегонів.

## Джерела та що почитати

- 🟢 [Cambridge Dictionary](https://dictionary.cambridge.org/) — UK / US: *laboratory, vaccine, obsolete, leverage*; позначки *formal / specialized*.
- 🟢 [BBC Learning English — 6 Minute English](https://www.bbc.co.uk/learningenglish/english/features/6-minute-english) — короткі подкасти про науку й технології з лексикою B2.
- 🟡 M. McCarthy, F. O'Dell — *English Vocabulary in Use: Upper-Intermediate*: розділи «Science and technology», «Computers and the internet».
- 🟡 [IELTS — офіційний сайт](https://ielts.org) (Academic Reading format) — Yes / No / Not Given: як відрізнити думку автора від фактів.
- 🟡 [Academic Word List (A. Coxhead)](https://www.wgtn.ac.nz/lals/resources/academicwordlist) — *hypothesis, conduct, theory, innovation, ethical* — усі з AWL.

> [!important] Підсумок
> - Дослідження: *form a hypothesis → conduct an experiment → findings → peer review → replicate → breakthrough*; *research* — незлічуване.
> - Обережні висновки: *The findings suggest / indicate…*, а не «prove». Прогнози: *be bound to → be likely to → could well → be unlikely to*; *in the foreseeable future*.
> - Технології: *AI, algorithm, automation, obsolete, cybersecurity, digital divide, dependence on*.
> - IELTS: *pose a threat to, far-reaching consequences, harness the potential, raise ethical concerns, at an unprecedented pace*.
> - Пастки: *technique* ≠ техніка (*appliances, equipment*), *experience* ≠ *experiment*, *go into space*, не «to the cosmos».
