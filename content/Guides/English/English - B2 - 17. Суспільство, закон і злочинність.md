---
title: Суспільство, закон і злочинність
order: 417
id: en-b2-society
level: B2
icon: px:scales
tags: [english, b2, vocabulary, society, law, crime, justice, politics, ielts]
prerequisites: ["[[English - B1 - 17. Пасивний стан — Present і Past]]", "[[English - B1 - 18. Медіа, новини й реклама]]"]
estimatedMinutes: 45
---

# Суспільство, закон і злочинність

> [!success] Після цієї теми ти зможеш
> - називати злочини й правопорушення точно: **burglary, fraud, vandalism, assault, bribery** — і розуміти, чим вони відрізняються (B2);
> - переказати шлях справи: *suspect → charged with → trial → verdict → sentenced to*;
> - розуміти кримінальні новини з безособовим пасивом: *He **is believed to** have left the country. The man **allegedly** sold fake tickets*;
> - аргументувати в IELTS Writing Task 2 і Speaking Part 3 на теми «покарання чи реабілітація», «камери спостереження», «нерівність»;
> - не плутати *politics / policy*, *lawyer / jurist* і не казати «make a crime».

## Передбач

> [!quiz] «Він скоїв серйозний злочин». Як сказати правильно?
> level: B2 · id: en-b2-society-q01
> - [ ] He made a serious crime.
> - [ ] He did a serious crime.
> - [x] He committed a serious crime.
> - [ ] He created a serious crime.
>
> **Пояснення:** злочин англійською не «роблять», а ***commit***: *commit a crime / an offence / fraud / murder*. Так само *commit suicide* (вчинити самогубство). *Make / do a crime* — кальки, які одразу видають іноземця.

## Пояснення

### Шлях справи: від злочину до вироку

> [!diagram] Як працює правосуддя
> ```yaml
> layout: flow
> nodes:
>   - { id: crime, label: "commit a crime", text: "burglary", note: "злочин", tone: red, icon: "px:warning" }
>   - { id: susp, label: "suspect", text: "arrested", note: "підозрюваний", tone: orange, icon: "px:magnifier" }
>   - { id: charge, label: "be charged with", text: "burglary", note: "обвинувачення", tone: violet }
>   - { id: trial, label: "trial", text: "witnesses + jury", note: "суд", tone: blue, icon: "px:scales" }
>   - { id: verdict, label: "verdict", text: "guilty", note: "вердикт", tone: gray }
>   - { id: sentence, label: "be sentenced to", text: "2 years in prison", note: "вирок, покарання", tone: green }
> steps:
>   - { focus: crime, note: "Хтось скоює злочин — commits a crime. Наприклад, burglary — проникнення в будинок з метою крадіжки." }
>   - { move: { from: crime, to: susp, value: "CCTV" }, note: "Поліція знаходить підозрюваного (a suspect) — завдяки свідкам чи камерам — і заарештовує: he is arrested." }
>   - { move: { from: susp, to: charge, value: "evidence" }, note: "Якщо доказів достатньо, його офіційно обвинувачують: he is charged with burglary. Прийменник — with." }
>   - { move: { from: charge, to: trial, value: "court" }, note: "Справа йде до суду — the trial. Свідки (witnesses) дають показання, а присяжні (the jury) слухають." }
>   - { move: { from: trial, to: verdict, value: "guilty / not guilty" }, note: "Присяжні виносять вердикт — reach a verdict: guilty (винен) або not guilty (невинуватий)." }
>   - { move: { from: verdict, to: sentence, value: "2 years" }, note: "Суддя призначає покарання: he is sentenced to two years in prison. Інші варіанти — a fine (штраф) чи community service (громадські роботи)." }
> ```

> [!tip] Вердикт ≠ вирок
> Українське «вирок» — це і рішення про вину, і покарання. Англійською їх розділяють: ***verdict*** — рішення присяжних «винен / не винен», ***sentence*** — покарання, яке призначає суддя. *The jury returned a guilty verdict, and the judge sentenced him to five years.*

### Граматика в контексті: мова кримінальних новин

Журналісти не можуть стверджувати, що людина винна, доки суд цього не вирішив. Тому новини тримаються на **безособовому пасиві** й обережних словах (тема B2-05):

| Конструкція | Приклад | Переклад |
|---|---|---|
| *is said / believed / thought to + infinitive* | *The suspect **is believed to** be in Poland.* | Вважають, що підозрюваний перебуває в Польщі. |
| *… to have + V3* (про минуле) | *He **is said to have stolen** €2 million.* | Кажуть, що він викрав 2 мільйони євро. |
| *It is alleged / reported that…* | ***It is alleged that** the mayor took bribes.* | Стверджують, що мер брав хабарі. |
| *allegedly* | *The man **allegedly** sold fake tickets.* | Чоловік нібито продавав підроблені квитки. |
| *has been + V3* | *Two men **have been charged with** fraud.* | Двом чоловікам висунули обвинувачення в шахрайстві. |

### Для IELTS: злочинність і суспільство в Task 2 і Speaking Part 3

Типові питання Task 2: *Some people think that the best way to reduce crime is to give longer prison sentences. Others believe there are better alternatives. Discuss both views and give your opinion.* · *Young people are committing more crimes. What are the causes, and what can be done?* Speaking Part 3: *Why do people commit crimes? Should CCTV be used everywhere? Is it important to vote?*

> [!diagram] Дві позиції для есе «Prison or alternatives?»
> ```yaml
> layout: compare
> columns: { prison: "Longer sentences", alt: "Alternatives (rehabilitation)" }
> nodes:
>   - { id: p1, col: prison, label: "deterrent", text: "fear of prison stops potential offenders", tone: blue }
>   - { id: p2, col: prison, label: "public safety", text: "dangerous people are kept off the streets", tone: blue }
>   - { id: p3, col: prison, label: "justice", text: "victims see that crime is punished", tone: blue }
>   - { id: a1, col: alt, label: "reoffending", text: "education and work reduce reoffending", tone: green }
>   - { id: a2, col: alt, label: "cost", text: "community service is far cheaper", tone: green }
>   - { id: a3, col: alt, label: "root causes", text: "tackle poverty, addiction, lack of education", tone: green }
> steps:
>   - { focus: [p1, a1], note: "Головне протистояння: стримування (deterrent) проти реабілітації. Аргумент «за вʼязницю» — страх; «проти» — більшість увʼязнених потім повертаються до злочинів (reoffend)." }
>   - { focus: [p2, a2], note: "Безпека суспільства проти вартості: вʼязниця ізолює небезпечних, але громадські роботи в рази дешевші для платників податків." }
>   - { focus: [p3, a3], note: "Справедливість для жертв проти боротьби з корінними причинами (root causes): бідністю, залежностями, браком освіти." }
>   - { focus: [p1, p2, p3, a1, a2, a3], note: "Типова зріла позиція для Band 7: prison is necessary for violent offenders, but for minor offences alternatives are more effective." }
> ```

| Ідея | Фраза рівня Band 6.5–7 | Переклад |
|---|---|---|
| боротися | ***tackle** crime / the problem of…* | боротися зі злочинністю / проблемою… |
| стримувати | *act as a **deterrent**; deter potential offenders* | стримувати потенційних злочинців |
| повторні злочини | *reduce **reoffending** rates* | зменшити рівень рецидиву |
| суворість | *a harsh / lenient sentence* | суворий / мʼякий вирок |
| причини | *address the **root causes** of crime* | усувати корінні причини злочинності |
| законослухняні | ***law-abiding** citizens* | законослухняні громадяни |
| права | *a violation of **human rights*** | порушення прав людини |
| молодь | ***juvenile** crime / delinquency* | злочинність неповнолітніх |

> [!example] Зразок абзацу для Task 2 (≈ Band 7)
> *Those who favour longer prison sentences argue that the fear of losing one's freedom acts as a powerful **deterrent**. However, this argument is weaker than it first appears. Most crimes are committed on impulse or under the influence of drugs or alcohol, and in such situations offenders rarely consider the consequences. Moreover, prisons often fail to change behaviour: in many countries, around half of former inmates **reoffend** within a few years of release. For minor, non-violent offences, therefore, community service combined with education or addiction treatment is likely to be both cheaper and more effective in **tackling** the **root causes** of crime.*
>
> Що тут працює: чужий аргумент (*Those who favour… argue*) → контраргумент з поясненням (*Most crimes are committed on impulse…*) → додатковий доказ (*Moreover*) → висновок з обмеженням (*For minor, non-violent offences, therefore…*). Обережні слова *often, around half, is likely to* — ознака академічного стилю.

## Приклади

- *Burglaries in our area have **risen** by 15% this year.* — Кількість квартирних крадіжок у нашому районі цього року зросла на 15 %.
- *Someone **broke into** my car and took my laptop.* — Хтось проник у мою машину й забрав ноутбук.
- *The director **was charged with** fraud and **bribery**.* — Директорові висунули обвинувачення в шахрайстві й хабарництві.
- *Three **witnesses** saw the attack.* — Напад бачили троє свідків.
- *After two days, the **jury** reached a **verdict**: not **guilty**.* — Через два дні присяжні винесли вердикт: невинуватий.
- *She **was sentenced to** 200 hours of **community service**.* — Її засудили до 200 годин громадських робіт.
- *He got a **fine** for dropping litter.* — Його оштрафували за те, що він смітив на вулиці.
- *The new **legislation** **bans** smoking in all public places.* — Новий закон забороняє куріння в усіх громадських місцях.
- *Many people feel that **CCTV** cameras invade their privacy.* — Багато людей вважають, що камери спостереження порушують їхню приватність.
- *The government must **tackle** the **root causes** of **poverty**.* — Уряд має боротися з корінними причинами бідності.

## Слова

### Злочини

> [!word] commit
> ipa: /kəˈmɪt/ · pos: verb · level: B2 · id: en-b2-society-w01
> uk: скоїти; вчинити (злочин)
> example: Most crimes are **committed** by young men. — Більшість злочинів скоюють молоді чоловіки.
> forms: commit → committed → committed
> note: нейтральне. *commit a crime / an offence / fraud*. Друге значення — *commit (yourself) to something* — зобовʼязатися.

> [!word] offence
> ipa: /əˈfens/ · pos: noun · level: B2 · id: en-b2-society-w02
> uk: правопорушення; злочин
> example: Driving without insurance is a criminal **offence**. — Їзда без страховки — кримінальне правопорушення.
> note: нейтральне-формальне. UK *offence*, US *offense*. *a minor / serious offence*. *take offence* — образитися.

> [!word] offender
> ipa: /əˈfendə/ · ipa-us: /əˈfendər/ · pos: noun · level: B2 · id: en-b2-society-w03
> uk: правопорушник; злочинець
> example: Young **offenders** need education, not just punishment. — Молодим правопорушникам потрібна освіта, а не лише покарання.
> note: формальне. *a first-time / repeat offender* — той, хто вперше / повторно скоїв злочин.

> [!word] burglary
> ipa: /ˈbɜːɡləri/ · ipa-us: /ˈbɝːɡləri/ · pos: noun · level: B2 · id: en-b2-society-w04
> uk: квартирна крадіжка; проникнення з метою крадіжки
> example: There has been a rise in **burglaries** in the area. — У районі почастішали квартирні крадіжки.
> note: нейтральне. Злодій — *a burglar*; дієслово UK *burgle*, US *burglarize*.

> [!word] break into
> ipa: /ˌbreɪk ˈɪntuː/ · pos: phrase · level: B2 · id: en-b2-society-w05
> uk: проникнути (зламати й залізти)
> example: Someone **broke into** our flat while we were away. — Хтось проник у нашу квартиру, поки нас не було.
> forms: break → broke → broken
> note: нейтральне. *break into a house / a car / a computer system*.

> [!word] shoplifting
> ipa: /ˈʃɒplɪftɪŋ/ · ipa-us: /ˈʃɑːplɪftɪŋ/ · pos: noun · level: B2 · id: en-b2-society-w06
> uk: крадіжка в магазині
> example: She was caught **shoplifting** a pair of jeans. — Її спіймали на крадіжці джинсів у магазині.
> note: нейтральне. Людина — *shoplifter*.

> [!word] fraud
> ipa: /frɔːd/ · ipa-us: /frɑːd/ · pos: noun · level: B2 · id: en-b2-society-w07
> uk: шахрайство
> example: Online **fraud** costs consumers billions every year. — Онлайн-шахрайство щороку коштує споживачам мільярди.
> note: нейтральне-формальне. *commit fraud*; *credit card fraud*. Розмовне *scam* (B1) — конкретна афера; *fraud* — юридичний термін.

> [!word] vandalism
> ipa: /ˈvændəlɪzəm/ · pos: noun · level: B2 · id: en-b2-society-w08
> uk: вандалізм
> example: The bus stop was destroyed in an act of **vandalism**. — Зупинку зруйнували вандали.
> note: нейтральне. *vandal* — вандал; *vandalise* (US *vandalize*).

> [!word] assault
> ipa: /əˈsɔːlt/ · ipa-us: /əˈsɑːlt/ · pos: noun · level: B2 · id: en-b2-society-w09
> uk: напад; насильство (фізичне)
> example: He was arrested for **assault** after a fight outside a bar. — Його заарештували за напад після бійки біля бару.
> note: формальне (юридичне). Дієслово теж: *assault somebody*. Розмовно — *attack*.

> [!word] murder
> ipa: /ˈmɜːdə/ · ipa-us: /ˈmɝːdər/ · pos: noun · level: B2 · id: en-b2-society-w10
> uk: (умисне) вбивство
> example: He was found guilty of **murder**. — Його визнали винним у вбивстві.
> note: нейтральне. *murderer* — убивця. *manslaughter* — ненавмисне вбивство.

> [!word] bribe
> ipa: /braɪb/ · pos: noun · level: B2 · id: en-b2-society-w11
> uk: хабар; (дієслово) давати хабар
> example: The official was accused of taking **bribes**. — Посадовця звинуватили в отриманні хабарів.
> note: нейтральне. *take / accept / offer a bribe*; дієслово *bribe somebody*; *bribery* — хабарництво.

> [!word] corruption
> ipa: /kəˈrʌpʃən/ · pos: noun · level: B2 · id: en-b2-society-w12
> uk: корупція
> example: The new law is designed to fight **corruption**. — Новий закон має боротися з корупцією.
> note: нейтральне-формальне. *corrupt* — корумпований (*corrupt officials*).

> [!word] cybercrime
> ipa: /ˈsaɪbəkraɪm/ · ipa-us: /ˈsaɪbərkraɪm/ · pos: noun · level: B2 · id: en-b2-society-w13
> uk: кіберзлочинність
> example: **Cybercrime** is growing faster than any other type of crime. — Кіберзлочинність зростає швидше за будь-який інший вид злочинів.
> note: нейтральне. Повʼязане — *hacker, scam, identity theft* (крадіжка особистих даних).

> [!word] juvenile
> ipa: /ˈdʒuːvənaɪl/ · ipa-us: /ˈdʒuːvənəl/ · pos: adj · level: B2 · id: en-b2-society-w14
> uk: неповнолітній; підлітковий
> example: **Juvenile** crime has fallen over the past decade. — За останнє десятиліття злочинність неповнолітніх знизилася.
> note: формальне. *juvenile delinquency* — правопорушення неповнолітніх. Чітка різниця UK [ДЖУ-ве-найл] / US [ДЖУ-ве-нл].

### Правосуддя й покарання

> [!word] a suspect
> ipa: /ˈsʌspekt/ · pos: noun · level: B2 · id: en-b2-society-w15
> uk: підозрюваний
> example: Police have arrested two **suspects**. — Поліція затримала двох підозрюваних.
> note: нейтральне. Іменник — наголос на першому [СА-спект]; дієслово *suspect* /səˈspekt/ — на другому [се-СПЕКТ].

> [!word] be charged with
> ipa: /bi ˈtʃɑːdʒd wɪð/ · ipa-us: /bi ˈtʃɑːrdʒd wɪð/ · pos: phrase · level: B2 · id: en-b2-society-w16
> uk: отримати офіційне обвинувачення в
> example: Two men **have been charged with** burglary. — Двом чоловікам висунули обвинувачення у квартирній крадіжці.
> note: формальне (новини, суд). Порівняй: *accuse somebody **of*** (звинувачувати, будь-хто) і *charge somebody **with*** (офіційно, поліція чи прокурор).

> [!word] trial
> ipa: /ˈtraɪəl/ · pos: noun · level: B2 · id: en-b2-society-w17
> uk: суд; судовий процес
> example: The **trial** is expected to last three weeks. — Очікується, що судовий процес триватиме три тижні.
> note: нейтральне. *be on trial (for)* — бути під судом; *stand trial* — постати перед судом. Будівля суду — *court* (B1).

> [!word] jury
> ipa: /ˈdʒʊəri/ · ipa-us: /ˈdʒʊri/ · pos: noun · level: B2 · id: en-b2-society-w18
> uk: присяжні; журі
> example: The **jury** found him not guilty. — Присяжні визнали його невинуватим.
> note: нейтральне. Збірний іменник: UK часто *the jury **are***, US — *the jury **is***. Один присяжний — *a juror*.

> [!word] reach a verdict
> ipa: /ˌriːtʃ ə ˈvɜːdɪkt/ · ipa-us: /ˌriːtʃ ə ˈvɝːdɪkt/ · pos: phrase · level: B2 · id: en-b2-society-w19
> uk: винести вердикт (про присяжних)
> example: The jury **reached a verdict** after six hours. — Присяжні винесли вердикт через шість годин.
> note: нейтральне-формальне. Також *return a verdict*; *a guilty / not guilty verdict*. *Verdict* ≠ покарання (*sentence*).

> [!word] guilty
> ipa: /ˈɡɪlti/ · pos: adj · level: B2 · id: en-b2-society-w20
> uk: винний (у злочині); винуватий (почуття)
> example: She was found **guilty of** fraud. — Її визнали винною в шахрайстві.
> note: нейтральне. *be found guilty / not guilty of*; *plead guilty* — визнати свою вину в суді; *feel guilty* — почуватися винним.

> [!word] innocent
> ipa: /ˈɪnəsənt/ · pos: adj · level: B2 · id: en-b2-society-w21
> uk: невинний
> example: Everyone is **innocent** until proven guilty. — Кожен невинуватий, доки не доведено протилежне.
> note: нейтральне. У суді формально кажуть *not guilty*, а *innocent* — у загальному значенні.

> [!word] witness
> ipa: /ˈwɪtnəs/ · pos: noun · level: B2 · id: en-b2-society-w22
> uk: свідок
> example: Police are appealing for **witnesses** to the accident. — Поліція шукає свідків аварії.
> note: нейтральне. Дієслово *witness* — стати свідком: *She witnessed the attack.*

> [!word] be sentenced to
> ipa: /bi ˈsentənst tə/ · pos: phrase · level: B2 · id: en-b2-society-w23
> uk: бути засудженим до (покарання)
> example: He **was sentenced to** five years in prison. — Його засудили до пʼяти років увʼязнення.
> note: формальне. *sentence* тут — вирок, покарання (*a long / harsh / lenient sentence*); не плутай з «реченням».

> [!word] a fine
> ipa: /ə ˈfaɪn/ · pos: noun · level: B2 · id: en-b2-society-w24
> uk: штраф
> example: She had to pay **a fine** of €100. — Їй довелося заплатити штраф 100 євро.
> note: нейтральне. Дієслово: *be fined* — бути оштрафованим (*He was fined €50 for speeding*). Те саме слово, що *fine* «добре», але інше значення.

> [!word] community service
> ipa: /kəˌmjuːnəti ˈsɜːvɪs/ · ipa-us: /kəˌmjuːnət̬i ˈsɝːvɪs/ · pos: noun · level: B2 · id: en-b2-society-w25
> uk: громадські (виправні) роботи
> example: Instead of prison, he was given 150 hours of **community service**. — Замість увʼязнення йому призначили 150 годин громадських робіт.
> note: нейтральне. Часте в IELTS як *alternative to prison*.

> [!word] capital punishment
> ipa: /ˌkæpɪtəl ˈpʌnɪʃmənt/ · ipa-us: /ˌkæpət̬əl ˈpʌnɪʃmənt/ · pos: noun · level: B2 · id: en-b2-society-w26
> uk: смертна кара
> example: Ukraine abolished **capital punishment** in 2000. — Україна скасувала смертну кару у 2000 році.
> note: формальне. Розмовніше — *the death penalty*. *abolish* — скасувати.

> [!word] deterrent
> ipa: /dɪˈterənt/ · ipa-us: /dɪˈtɝːrənt/ · pos: noun · level: B2 · id: en-b2-society-w27
> uk: стримувальний чинник; засіб стримування
> example: Heavy fines act as a **deterrent** to dangerous drivers. — Великі штрафи стримують небезпечних водіїв.
> note: формальне, ключове слово IELTS. Дієслово *deter somebody from doing something*.

> [!word] rehabilitation
> ipa: /ˌriːəˌbɪlɪˈteɪʃən/ · ipa-us: /ˌriːəˌbɪləˈteɪʃən/ · pos: noun · level: B2 · id: en-b2-society-w28
> uk: реабілітація; повернення до нормального життя
> example: Prisons should focus on **rehabilitation**, not just punishment. — Вʼязниці мають зосереджуватися на реабілітації, а не лише на покаранні.
> note: формальне. Дієслово *rehabilitate offenders*. Розмовно — *rehab* (переважно про лікування залежностей).

> [!word] reoffend
> ipa: /ˌriːəˈfend/ · pos: verb · level: B2 · id: en-b2-society-w29
> uk: повторно скоїти злочин
> example: Prisoners who learn a trade are less likely to **reoffend**. — Увʼязнені, які опанували професію, рідше скоюють повторні злочини.
> note: формальне. *reoffending rates* — рівень рецидиву.

> [!word] law-abiding
> ipa: /ˈlɔː əˌbaɪdɪŋ/ · ipa-us: /ˈlɑː əˌbaɪdɪŋ/ · pos: adj · level: B2 · id: en-b2-society-w30
> uk: законослухняний
> example: Most people are **law-abiding** citizens. — Більшість людей — законослухняні громадяни.
> note: нейтральне-формальне. *abide by the law / the rules* — дотримуватися закону.

> [!word] enforce
> ipa: /ɪnˈfɔːs/ · ipa-us: /ɪnˈfɔːrs/ · pos: verb · level: B2 · id: en-b2-society-w31
> uk: забезпечувати виконання (закону, правила)
> example: The speed limit is rarely **enforced** here. — Обмеження швидкості тут рідко контролюють.
> note: формальне. *law enforcement* — правоохоронні органи.

> [!word] legislation
> ipa: /ˌledʒɪˈsleɪʃən/ · pos: noun · level: B2 · id: en-b2-society-w32
> uk: законодавство; закони
> example: The government plans to introduce new **legislation** on data privacy. — Уряд планує ухвалити нове законодавство про захист даних.
> note: формальне, незлічуване. *pass / introduce legislation*. Один закон — *a law* (B1), *an act*.

> [!word] ban
> ipa: /bæn/ · pos: verb · level: B2 · id: en-b2-society-w33
> uk: забороняти; (іменник) заборона
> example: Many cities have **banned** cars from the centre. — Багато міст заборонили вʼїзд автомобілів до центру.
> forms: ban → banned → banned
> note: нейтральне, частіше в новинах, ніж *forbid*. *ban something*, *ban somebody from doing something*, *a ban on smoking*.

### Суспільство, права, політика

> [!word] human rights
> ipa: /ˌhjuːmən ˈraɪts/ · pos: noun · level: B2 · id: en-b2-society-w34
> uk: права людини
> example: Torture is a serious violation of **human rights**. — Катування — серйозне порушення прав людини.
> note: нейтральне-формальне. *protect / violate human rights*; *the right to vote* — право голосу.

> [!word] inequality
> ipa: /ˌɪnɪˈkwɒləti/ · ipa-us: /ˌɪnɪˈkwɑːlət̬i/ · pos: noun · level: B2 · id: en-b2-society-w35
> uk: нерівність
> example: Income **inequality** has grown in many countries. — У багатьох країнах зросла нерівність доходів.
> note: формальне. *gender / income / social inequality*. Протилежне — *equality*.

> [!word] discrimination
> ipa: /dɪˌskrɪmɪˈneɪʃən/ · pos: noun · level: B2 · id: en-b2-society-w36
> uk: дискримінація
> example: The law protects workers against **discrimination**. — Закон захищає працівників від дискримінації.
> note: нейтральне-формальне. *discrimination against somebody* (не «of»); *age / racial discrimination*.

> [!word] poverty
> ipa: /ˈpɒvəti/ · ipa-us: /ˈpɑːvərt̬i/ · pos: noun · level: B2 · id: en-b2-society-w37
> uk: бідність; злидні
> example: Millions of children still live in **poverty**. — Мільйони дітей досі живуть у бідності.
> note: нейтральне. *live in poverty*; *the poverty line* — межа бідності. Прикметник — *poor*.

> [!word] homelessness
> ipa: /ˈhəʊmləsnəs/ · ipa-us: /ˈhoʊmləsnəs/ · pos: noun · level: B2 · id: en-b2-society-w38
> uk: безпритульність; безхатність
> example: Rising rents have led to an increase in **homelessness**. — Через зростання орендної плати безпритульних стало більше.
> note: нейтральне. Люди — *homeless people* або *the homeless*.

> [!word] citizen
> ipa: /ˈsɪtɪzən/ · ipa-us: /ˈsɪt̬əzən/ · pos: noun · level: B2 · id: en-b2-society-w39
> uk: громадянин
> example: Every **citizen** has the right to vote. — Кожен громадянин має право голосу.
> note: нейтральне. *citizenship* — громадянство; *senior citizens* — люди похилого віку (ввічливо).

> [!word] election
> ipa: /ɪˈlekʃən/ · pos: noun · level: B2 · id: en-b2-society-w40
> uk: вибори
> example: The next **election** will take place in spring. — Наступні вибори відбудуться навесні.
> note: нейтральне. *hold / win / lose an election*; *a general election* (UK) — парламентські вибори.

> [!word] vote
> ipa: /vəʊt/ · ipa-us: /voʊt/ · pos: verb · level: B2 · id: en-b2-society-w41
> uk: голосувати; (іменник) голос
> example: Young people are less likely to **vote** than older people. — Молодь голосує рідше, ніж старші люди.
> note: нейтральне. *vote for / against*; *cast a vote* (формально). *voter* — виборець; *turnout* — явка.

> [!word] policy
> ipa: /ˈpɒləsi/ · ipa-us: /ˈpɑːləsi/ · pos: noun · level: B2 · id: en-b2-society-w42
> uk: політика (конкретний курс, правила)
> example: The government has changed its **policy** on immigration. — Уряд змінив свою політику щодо імміграції.
> note: нейтральне. *policy* — план дій (*a new education policy*), *politics* — політика як сфера, боротьба партій. Ще: *insurance policy* — страховий поліс.

> [!word] welfare
> ipa: /ˈwelfeə/ · ipa-us: /ˈwelfer/ · pos: noun · level: B2 · id: en-b2-society-w43
> uk: добробут; соціальна допомога
> example: The **welfare** of children must come first. — Добробут дітей має бути на першому місці.
> note: нейтральне-формальне. *the welfare state* — соціальна держава. US *be on welfare* — жити на соцдопомогу (UK — *be on benefits*).

> [!word] surveillance
> ipa: /səˈveɪləns/ · ipa-us: /sərˈveɪləns/ · pos: noun · level: B2 · id: en-b2-society-w44
> uk: спостереження; стеження
> example: Some people think mass **surveillance** goes too far. — Деякі люди вважають, що масове стеження — це занадто.
> note: формальне. *under surveillance* — під наглядом; *surveillance cameras*.

> [!word] CCTV
> ipa: /ˌsiː siː tiː ˈviː/ · pos: noun · level: B2 · id: en-b2-society-w45
> uk: камери відеоспостереження
> example: The robbery was caught on **CCTV**. — Пограбування зафіксували камери відеоспостереження.
> note: нейтральне, переважно UK (*closed-circuit television*). US частіше *security cameras*.

> [!word] combat
> ipa: /ˈkɒmbæt/ · ipa-us: /ˈkɑːmbæt/ · pos: verb · level: B2 · id: en-b2-society-w46
> uk: боротися з; протидіяти
> example: The city has a new plan to **combat** street crime. — Місто має новий план боротьби з вуличною злочинністю.
> forms: combat → combated / combatted → combated / combatted
> note: формальне (новини, есе): *combat crime / corruption / disease*. Нейтрально — *fight* (без *with*!), *tackle*.

> [!word] root cause
> ipa: /ˌruːt ˈkɔːz/ · ipa-us: /ˌruːt ˈkɑːz/ · pos: noun · level: B2 · id: en-b2-society-w47
> uk: першопричина; корінна причина
> example: Poverty is often the **root cause** of crime. — Бідність часто є корінною причиною злочинності.
> note: нейтральне-формальне. *address / tackle the root causes of something*.

> [!word] anti-social behaviour
> ipa: /ˌænti ˌsəʊʃəl bɪˈheɪvjə/ · ipa-us: /ˌænt̬i ˌsoʊʃəl bɪˈheɪvjər/ · pos: noun · level: B2 · id: en-b2-society-w48
> uk: антигромадська поведінка (дрібне хуліганство, шум, графіті)
> example: Residents complained about **anti-social behaviour** in the park. — Мешканці скаржилися на хуліганство в парку.
> note: нейтральне, UK (US *antisocial behavior*). Не плутай з *antisocial* «нетовариський» у розмові.

> [!word] immigration
> ipa: /ˌɪmɪˈɡreɪʃən/ · pos: noun · level: B2 · id: en-b2-society-w49
> uk: імміграція
> example: **Immigration** is one of the main issues in the election. — Імміграція — одне з головних питань на виборах.
> note: нейтральне. *immigrant* — той, хто приїхав; *emigrate* (B1) — виїхати з країни.

## Слухаємо

> [!listen] Що сталося?
> level: B2 · type: answer · id: en-b2-society-l01
> audio: A twenty-three-year-old man has been charged with fraud after he allegedly sold fake concert tickets online. Police say more than two hundred people lost money. He will appear in court next month.
> - [ ] чоловіка засудили до увʼязнення за крадіжку квитків
> - [x] чоловікові висунули обвинувачення в шахрайстві — він нібито продавав фальшиві квитки
> - [ ] двісті людей заарештували за підробку квитків
> - [ ] концерт скасували через шахраїв
>
> **Пояснення:** *has been charged with fraud* — обвинувачення, а не вирок; *allegedly* — «нібито», бо суду ще не було (*will appear in court next month*).

> [!listen] Обери почуте
> level: B2 · type: choice · id: en-b2-society-l02
> audio: He was found not guilty of all charges.
> - [ ] He was found guilty of all charges.
> - [x] He was found not guilty of all charges.
> - [ ] He pleaded guilty to all charges.
>
> **Пояснення:** *not* у швидкому мовленні короткий, але змінює все: *found not guilty* — визнаний невинуватим. *Plead guilty* — сам визнав провину.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: en-b2-society-l03
> audio: The suspect was sentenced to two years in prison.

> [!listen] IELTS Listening, Part 4 — лекція з кримінології. Що, за словами лектора, найкраще стримує злочинців?
> level: B2 · type: answer · id: en-b2-society-l04
> audio: Many people assume that longer prison sentences reduce crime. However, research suggests that what really deters offenders is the likelihood of being caught, not the length of the sentence. In other words, more police on the streets may work better than harsher punishments.
> - [ ] longer prison sentences
> - [x] a high chance of being caught
> - [ ] harsher punishments for young offenders
> - [ ] more prisons
>
> **Пояснення:** *what really deters offenders is the likelihood of being caught* = *a high chance of being caught*. Довгі вироки — це те, що «багато хто вважає» (*Many people assume*), а лектор це заперечує.

> [!listen] IELTS Listening, Part 1 — заява в поліцію. Коли сталася крадіжка?
> level: B2 · type: answer · id: en-b2-society-l05
> audio: A: Could I have your surname, please?
> audio: B: Yes, it's Kovalenko. K-O-V-A-L-E-N-K-O.
> audio: A: And when did the burglary happen?
> audio: B: On Tuesday the fourteenth, sometime between two and four in the afternoon. I was at work.
> - [ ] у четвер, 14-го, увечері
> - [x] у вівторок, 14-го, між 14:00 і 16:00
> - [ ] у вівторок, 4-го, зранку
> - [ ] у вихідні, коли родина була у відʼїзді
>
> **Пояснення:** IELTS Part 1 перевіряє дати, час і правопис. *Tuesday* ≠ *Thursday*, *fourteenth* ≠ *fourth*; *between two and four in the afternoon* — 14:00–16:00.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: en-b2-society-l06
> audio: Community service can be more effective than a short prison sentence.

## Ситуація: свідок у поліції

> [!example] Оксана бачила, як крали велосипед
> **Officer:** Thanks for coming in. I understand you **witnessed** the theft yesterday?
> **Oksana:** Yes. I was waiting at the bus stop, and I saw a young man cut the lock on a bike outside the library.
> **Officer:** Can you describe the **suspect**?
> **Oksana:** He was about twenty, tall, with a grey hoodie and a black backpack. He rode off towards the station.
> **Officer:** That's very helpful. There's **CCTV** near the library, so we'll check the footage.
> **Oksana:** What will happen if you catch him?
> **Officer:** If there's enough evidence, he'll **be charged with** theft. For a first **offence**, he'd probably get **community service** or **a fine** rather than prison.
> **Oksana:** Will I have to go to court?
> **Officer:** Only if he pleads **not guilty** and the case goes to **trial**. Then you might be asked to give evidence as a **witness**.
>
> Зверни увагу на послідовність: *witness → suspect → CCTV → charged with → offence → trial*. І на мʼякі прогнози поліцейського: *he'd probably get…*, *you might be asked…*

## Вимова

> [!speak] Скажи вголос
> level: B2 · id: en-b2-society-s01
> text: He was charged with fraud and bribery.
> ipa: /hi wəz ˈtʃɑːdʒd wɪð ˈfrɔːd ən ˈbraɪbəri/
> tip: charged — один склад [ЧААДЖД]; fraud — довге [ɔː]: [ФРООД], не «фрауд».
> uk: Йому висунули обвинувачення в шахрайстві й хабарництві.

> [!speak] Скажи вголос
> level: B2 · id: en-b2-society-s02
> text: The jury found her not guilty.
> ipa: /ðə ˈdʒʊəri ˈfaʊnd hə ˈnɒt ˈɡɪlti/
> tip: guilty — літера *u* не читається: [ГІЛ-ті]; jury — [ДЖУ-рі]; виділи голосом *not*.
> uk: Присяжні визнали її невинуватою.

> [!speak] IELTS Speaking, Part 3 — «Why do young people commit crimes?»
> level: B2 · id: en-b2-society-s03
> text: Often the root cause is poverty or boredom, so we should give teenagers more opportunities, not just punish them.
> ipa: /ˈɒfən ðə ˈruːt ˈkɔːz ɪz ˈpɒvəti ɔː ˈbɔːdəm səʊ wi ʃəd ˈɡɪv ˈtiːneɪdʒəz ˈmɔːr ˌɒpəˈtjuːnətiz ˈnɒt ˈdʒʌst ˈpʌnɪʃ ðəm/
> tip: Причина → рішення: так будується відповідь Part 3. в often *t* зазвичай не вимовляють: [О-фн]; opportunities — [о-пе-ТЬЮ-не-тіз].
> uk: Часто корінна причина — бідність або нудьга, тож підліткам треба давати більше можливостей, а не лише карати їх.

> [!speak] IELTS Speaking, Part 3 — «Is prison the best way to deal with criminals?»
> level: B2 · id: en-b2-society-s04
> text: Not for minor offences. Community service is cheaper and helps offenders avoid reoffending.
> ipa: /ˈnɒt fə ˈmaɪnər əˈfensɪz kəˈmjuːnəti ˈsɜːvɪs ɪz ˈtʃiːpər ən ˈhelps əˈfendəz əˈvɔɪd ˌriːəˈfendɪŋ/
> tip: offences — [е-ФЕН-сіз]; community — наголос на -MU-: [ке-МʼЮ-не-ті].
> uk: Не для дрібних правопорушень. Громадські роботи дешевші й допомагають правопорушникам не повертатися до злочинів.

> [!speak] IELTS Speaking, Part 3 — «Should CCTV cameras be installed everywhere?»
> level: B2 · id: en-b2-society-s05
> text: They help the police, but too much surveillance can threaten our privacy and basic human rights.
> ipa: /ðeɪ ˈhelp ðə pəˈliːs bət ˈtuː ˈmʌtʃ səˈveɪləns kən ˈθretən aʊə ˈprɪvəsi ən ˈbeɪsɪk ˈhjuːmən ˈraɪts/
> tip: surveillance — [се-ВЕЙ-ленс]; threaten — /θr/ на початку; privacy — UK [ПРІ-ве-сі], US [ПРАЙ-ве-сі].
> uk: Вони допомагають поліції, але надмірне стеження може загрожувати нашій приватності й базовим правам людини.

> [!speak] IELTS Speaking, Part 3 — «Why is it important for citizens to vote?»
> level: B2 · id: en-b2-society-s06
> text: If people don't vote, decisions about taxes, schools and healthcare are made by a small minority.
> ipa: /ɪf ˈpiːpəl ˈdəʊnt ˈvəʊt dɪˈsɪʒənz əˈbaʊt ˈtæksɪz ˈskuːlz ən ˈhelθkeər ə ˈmeɪd baɪ ə ˈsmɔːl maɪˈnɒrəti/
> tip: vote — /v/ (зуби на губі), не /w/; decisions — /ʒ/ як «ж»; healthcare — /lθ/: [ХЕЛС-кеє].
> uk: Якщо люди не голосують, рішення про податки, школи й охорону здоровʼя ухвалює невелика меншість.

## Типові помилки українців

> [!pitfall] «Make a crime», «make a law»
> Кальки з «зробити злочин», «зробити закон». Злочин ***commit***, закон ***pass*** (ухвалити) або ***introduce*** (запровадити), закон ***break*** (порушити) або ***obey*** (дотримуватися). Покарання ***impose*** (призначити) — *impose a fine*. А «боротися з проблемою» — ***tackle the problem***, не «fight with the problem».

> [!pitfall] «My brother is a jurist»
> *Jurist* англійською — рідкісне слово для теоретика права, науковця. Звичайний «юрист» — ***lawyer***; у Британії ще ***solicitor*** (консультує, готує документи) і ***barrister*** (виступає в суді), у США — ***attorney***. Так само «юридичний факультет» — *law school / the faculty of law*.

> [!pitfall] «The police made a protocol»
> «Протокол» у поліції — ***a report*** або ***a statement*** (показання): *The police took my statement. I filed a police report.* *Protocol* англійською — «етикет, процедура» (*diplomatic protocol, safety protocols*). А протокол зборів — *the minutes*.

> [!pitfall] Politics чи policy?
> Українське «політика» — це два англійські слова. ***Politics*** — сфера, вибори, партії (*I'm not interested in politics*; дієслово в однині: *Politics **is** a dirty game*). ***Policy*** — конкретний курс чи правила (*the government's immigration policy*, *a no-smoking policy*). «Політик» — ***politician***, а «політичний» — ***political***.

## Практика

> [!quiz] «The jury reached a verdict.» Що сталося?
> level: B2 · id: en-b2-society-q02
> - [ ] Присяжні пішли на перерву.
> - [x] Присяжні ухвалили рішення, винна людина чи ні.
> - [ ] Суддя призначив покарання.
> - [ ] Свідок дав показання.
>
> **Пояснення:** *verdict* — рішення присяжних (*guilty / not guilty*). Покарання призначає суддя — *sentence*.

> [!quiz] Що з переліченого — злочини? Обери всі.
> level: B2 · id: en-b2-society-q03
> - [x] fraud
> - [x] burglary
> - [ ] verdict
> - [x] vandalism
> - [ ] witness
>
> **Пояснення:** *fraud* — шахрайство, *burglary* — квартирна крадіжка, *vandalism* — вандалізм. *Verdict* — рішення присяжних, *witness* — свідок.

> [!quiz] Шлях справи: заповни пропуски
> level: B2 · type: fill · id: en-b2-society-q04 · bank: accused, judged, imprisoned
>
> ```text fill
> The suspect was [[charged]] with burglary.
> The [[trial]] lasted two weeks.
> The [[jury]] found him guilty.
> He was [[sentenced]] to three years in prison.
> ```
>
> **Пояснення:** *be charged with* (не «accused with» — *accused of*); *judged* — оцінений, а не засуджений; *imprisoned* — увʼязнений, але після нього не буває *to three years*.

> [!quiz] Колокації: закон і злочин
> level: B2 · type: fill · id: en-b2-society-q05 · bank: make, do, fight
>
> ```text fill
> It's easy to [[commit]] a crime online without being caught.
> Parliament [[passed]] a new law on cybercrime.
> Anyone who [[breaks]] the law must face the consequences.
> The government needs to [[tackle]] the root causes of crime.
> ```

> [!quiz] Склади речення з новин: «Вважають, що чоловік виїхав з країни».
> level: B2 · type: order · id: en-b2-society-q06
>
> ```text order
> The man
> is believed
> to have left
> the country.
> is believed that ✗
> ```
>
> **Пояснення:** *subject + is believed + to have + V3* — про дію в минулому. Інший варіант — *It is believed **that** the man has left the country*; змішувати обидві конструкції не можна.

> [!quiz] «Уряд запровадив нову міграційну політику». Яке слово?
> level: B2 · id: en-b2-society-q07
> - [ ] The government has introduced new immigration politics.
> - [x] The government has introduced a new immigration policy.
> - [ ] The government has introduced a new immigration politic.
> - [ ] The government has introduced a new immigration political.
>
> **Пояснення:** конкретний курс, набір правил — *policy* (злічуване: *a new policy*). *Politics* — політика як сфера.

> [!quiz] «Мій брат — юрист у великій фірмі». Обери природний варіант.
> level: B2 · id: en-b2-society-q08
> - [ ] My brother is a jurist in a big firm.
> - [x] My brother is a lawyer at a big law firm.
> - [ ] My brother is a juror in a big firm.
> - [ ] My brother is a judge in a big firm.
>
> **Пояснення:** юрист — *lawyer* (UK також *solicitor*, US *attorney*). *Jurist* — науковець-правознавець, *juror* — присяжний, *judge* — суддя.

> [!quiz] «Supporters of strict laws argue that heavy fines act as a deterrent.» Що означає deterrent?
> level: B2 · id: en-b2-society-q09
> - [ ] спосіб заробити гроші для держави
> - [x] те, що стримує людей від порушень
> - [ ] покарання для неповнолітніх
> - [ ] доказ у суді
>
> **Пояснення:** *deterrent* — стримувальний чинник: страх штрафу *deters* (стримує) людей від порушення. Ключове слово для есе про покарання.

> [!quiz] IELTS Academic Reading: True, False чи Not Given?
> level: B2 · id: en-b2-society-q10
>
> **Rethinking punishment.** Over the past few decades, Norway has redesigned its prison system around a simple principle: a prison sentence should take away a person's freedom, but nothing else. Inmates in many Norwegian prisons cook their own meals, study for qualifications and take part in work programmes designed to prepare them for life after release. Critics have described the approach as "holiday camps for criminals". Yet the country's reoffending rate is among the lowest in Europe: roughly one in five released prisoners is convicted again within two years, compared with nearly half in some other countries. Supporters argue that the system is not only more humane but also cheaper in the long run, because fewer people return to prison. However, some researchers point out that Norway's small population and strong welfare state make it difficult to know whether the model would work elsewhere.
>
> *Statement:* **Some Norwegian prisoners can study while they are serving their sentence.**
> - [x] True
> - [ ] False
> - [ ] Not Given
>
> **Пояснення:** *Inmates… study for qualifications* — увʼязнені навчаються, щоб здобути кваліфікацію. *Inmates* = *prisoners*, *serving their sentence* = перебувають у вʼязниці → **True**.

> [!quiz] IELTS Academic Reading: True, False чи Not Given? (той самий текст)
> level: B2 · id: en-b2-society-q11
>
> **Rethinking punishment.** Over the past few decades, Norway has redesigned its prison system around a simple principle: a prison sentence should take away a person's freedom, but nothing else. Inmates in many Norwegian prisons cook their own meals, study for qualifications and take part in work programmes designed to prepare them for life after release. Critics have described the approach as "holiday camps for criminals". Yet the country's reoffending rate is among the lowest in Europe: roughly one in five released prisoners is convicted again within two years, compared with nearly half in some other countries. Supporters argue that the system is not only more humane but also cheaper in the long run, because fewer people return to prison. However, some researchers point out that Norway's small population and strong welfare state make it difficult to know whether the model would work elsewhere.
>
> *Statement:* **About half of the prisoners released in Norway commit another crime within two years.**
> - [ ] True
> - [x] False
> - [ ] Not Given
>
> **Пояснення:** у Норвегії — *roughly one in five* (близько 20 %). *Nearly half* — це про **інші** країни. Число є в тексті, але належить іншому підмету → **False**.

> [!quiz] IELTS Academic Reading: True, False чи Not Given? (той самий текст)
> level: B2 · id: en-b2-society-q12
>
> **Rethinking punishment.** Over the past few decades, Norway has redesigned its prison system around a simple principle: a prison sentence should take away a person's freedom, but nothing else. Inmates in many Norwegian prisons cook their own meals, study for qualifications and take part in work programmes designed to prepare them for life after release. Critics have described the approach as "holiday camps for criminals". Yet the country's reoffending rate is among the lowest in Europe: roughly one in five released prisoners is convicted again within two years, compared with nearly half in some other countries. Supporters argue that the system is not only more humane but also cheaper in the long run, because fewer people return to prison. However, some researchers point out that Norway's small population and strong welfare state make it difficult to know whether the model would work elsewhere.
>
> *Statement:* **Several other countries have successfully copied the Norwegian model.**
> - [ ] True
> - [ ] False
> - [x] Not Given
>
> **Пояснення:** текст лише каже, що **важко знати**, чи модель спрацює деінде. Чи її вже хтось копіював — не сказано → **Not Given**. Не плутай «невідомо, чи спрацює» з «не спрацювала» (це було б False).

> [!quiz] IELTS Summary completion: заповни пропуски словами з банку (той самий текст)
> level: B2 · type: fill · id: en-b2-society-q13 · bank: rights, money, term, education
>
> ```text fill
> In Norway, a prison sentence should only take away a person's [[freedom]].
> Prisoners cook their own [[meals]] and join [[work]] programmes.
> Supporters believe the system is cheaper in the long [[run]].
> ```
>
> **Пояснення:** *in the long run* — стала фраза «у довгостроковій перспективі». *In the long term* теж існує, але в summary completion беруть слово з тексту — а там *run*. *Rights* і *education* — логічні пастки, проте в тексті *freedom* і *work programmes*.

> [!quiz] IELTS Writing Task 2: яке речення найкраще перефразовує тему есе?
> level: B2 · id: en-b2-society-q14
>
> *Task:* **Some people think that the best way to reduce crime is to give longer prison sentences.**
> - [ ] Some people think that the best way to reduce crime is to give longer prison sentences.
> - [x] It is sometimes argued that harsher punishments are the most effective way to cut crime rates.
> - [ ] Prison sentences should be longer for all crimes.
> - [ ] Many people believe that crime has increased because of short sentences.
>
> **Пояснення:** *longer prison sentences → harsher punishments*, *reduce crime → cut crime rates*, *some people think → it is sometimes argued*. Третій варіант — уже твоя позиція, а не парафраз теми; четвертий змінює зміст (причина замість способу).

> [!quiz] IELTS Writing Task 2: обери найточніше дієслово. «Governments should ___ the root causes of crime, such as poverty and lack of education.»
> level: B2 · id: en-b2-society-q15
> - [ ] fight with
> - [x] tackle
> - [ ] solve up
> - [ ] make against
>
> **Пояснення:** *tackle / address the root causes* — природна колокація академічного стилю. «Fight with» — калька («боротися з»); *fight crime* можна, але без *with*.

> [!quiz] Словотвір: заповни потрібною формою слова з дужок
> level: B2 · type: fill · id: en-b2-society-q16 · bank: offence, burglary, shoplifter
>
> ```text fill
> (offend) Young [[offenders]] should be given a second chance.
> (burgle) A [[burglar]] broke into the house through the window.
> (shoplift) [[Shoplifting]] costs supermarkets millions every year.
> (law) Most people are [[law-abiding]] citizens.
> ```
>
> **Пояснення:** людина — *offender, burglar, shoplifter*; явище — *offence, burglary, shoplifting*. Читай, хто чи що потрібне в реченні: *Young ___ should be given* — люди; *___ costs supermarkets* — явище.

## Фішки

> [!reel] ⚖️ Verdict — «сказано правдиво»
> *Verdict* походить від середньовічної латини *vere dictum* — «правдиво сказане»: присяжні мали «сказати правду» про справу. А *jury* — від *jurare*, «присягати». Тож присяжні — буквально «ті, хто присягнув сказати правду».

> [!reel] 🕵️ Alibi — латинське «деінде»
> *I have an alibi* — «у мене є алібі». Латинське *alibi* означає просто «в іншому місці». Захист у суді колись буквально казав: обвинувачений був *alibi* — деінде. Сьогодні слово ще й розмовне «виправдання»: *Traffic is his alibi for being late.*

> [!reel] 💷 Get away scot-free
> *He got away scot-free* — «він вийшов сухим з води». Шотландці тут ні до чого: *scot* — давній податок у середньовічній Англії. *Scot-free* — «звільнений від податку», тобто той, кому не довелося платити. Згодом — той, хто уникнув покарання.

## Джерела та що почитати

- 🟢 [Cambridge Dictionary](https://dictionary.cambridge.org/) — UK / US: *offence / offense, juvenile, poverty*; позначки *law, formal*.
- 🟢 [BBC Learning English — News Review](https://www.bbc.co.uk/learningenglish/english/features/news-review) — лексика заголовків про суди й злочини з поясненнями.
- 🟡 M. McCarthy, F. O'Dell — *English Vocabulary in Use: Upper-Intermediate*: розділи «Crime», «The law», «Politics and public institutions».
- 🟡 [IELTS — офіційний сайт](https://ielts.org) (Writing test format) — Task 2: типи есе, зокрема «discuss both views».
- 🟡 [UN — Universal Declaration of Human Rights](https://www.un.org/en/about-us/universal-declaration-of-human-rights) — короткий оригінальний текст: *rights, equality, discrimination* в живому контексті.

> [!important] Підсумок
> - Злочини: *commit a crime / an offence*; *burglary (break into), shoplifting, fraud, vandalism, assault, murder, bribe, corruption, cybercrime*.
> - Правосуддя: *suspect → be charged with → trial (jury, witnesses) → verdict (guilty / not guilty) → be sentenced to / a fine / community service*.
> - Новини: *is believed to have…, allegedly, It is alleged that…*
> - IELTS: *tackle crime, act as a deterrent, reduce reoffending, address the root causes, law-abiding citizens, human rights, inequality, surveillance*.
> - Пастки: не «make a crime», *lawyer* (не jurist), *statement / report* (не protocol), *politics* ≠ *policy*.
