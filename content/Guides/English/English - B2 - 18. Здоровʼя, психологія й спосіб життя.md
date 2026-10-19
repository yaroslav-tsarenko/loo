---
title: Здоровʼя, психологія й спосіб життя
order: 418
id: en-b2-wellbeing
level: B2
icon: px:heart
tags: [english, b2, vocabulary, health, psychology, mental-health, lifestyle, sport, ielts]
prerequisites: ["[[English - A2 - 16. Здоровʼя, тіло й у лікаря]]", "[[English - B1 - 02. Стосунки й особистість]]"]
estimatedMinutes: 45
---

# Здоровʼя, психологія й спосіб життя

> [!success] Після цієї теми ти зможеш
> - говорити про ментальне здоровʼя делікатно й точно: **anxiety, overwhelmed, resilience, self-esteem, seek help** (B2);
> - описувати звички й спосіб життя: *a sedentary lifestyle, a balanced diet, sleep deprivation, kick the habit*;
> - розуміти пораду лікаря й розповісти про лікування: *diagnosis, treatment, recovery, check-up*;
> - вживати конструкцію *the more…, the better…* і пояснювати звʼязок звичок і наслідків;
> - аргументувати в IELTS Writing Task 2 і Speaking Part 3: «хто відповідає за здоровʼя — людина чи держава?», «чому зростає ожиріння?».

## Передбач

> [!quiz] «Я займаюся спортом тричі на тиждень». Як сказати природно?
> level: B2 · id: en-b2-wellbeing-q01
> - [ ] I go in for sport three times a week.
> - [ ] I make sport three times a week.
> - [x] I work out three times a week.
> - [ ] I sport three times a week.
>
> **Пояснення:** *go in for sport* — застарілий вираз зі старих підручників, носії так майже не кажуть. Природно: ***work out*** (займатися в залі), ***exercise***, ***do sport*** (UK) / ***play sports*** (US) або конкретно: *I go running, I play tennis*. «Make sport» — калька.

## Пояснення

### Замкнене коло: як звички впливають одна на одну

> [!diagram] Як стрес запускає замкнене коло
> ```yaml
> layout: flow
> nodes:
>   - { id: stress, label: "stress", text: "deadlines, worries", note: "стрес", tone: red, icon: "px:warning" }
>   - { id: sleep, label: "sleep deprivation", text: "5 hours a night", note: "недосипання", tone: orange, icon: "px:moon" }
>   - { id: energy, label: "low energy", text: "no time for a workout", note: "немає сил", tone: yellow }
>   - { id: food, label: "processed food", text: "snacks, sugar, coffee", note: "погане харчування", tone: violet }
>   - { id: break, label: "break the cycle", text: "one small habit", note: "розірвати коло", tone: green, icon: "px:sprout" }
> steps:
>   - { focus: stress, note: "Усе починається зі стресу: багато роботи, тривоги — you feel overwhelmed." }
>   - { move: { from: stress, to: sleep, value: "can't switch off" }, note: "Мозок не відпочиває — недосипання (sleep deprivation), а інколи й безсоння (insomnia)." }
>   - { move: { from: sleep, to: energy, value: "tired" }, note: "Без сну бракує сил і витривалості (stamina) — тренування (workout) скасовується." }
>   - { move: { from: energy, to: food, value: "quick fix" }, note: "Втома штовхає до швидкої енергії: солодке, оброблена їжа (processed food), кава. Це ще більше погіршує сон і настрій (mood)." }
>   - { move: { from: food, to: break, value: "walk 20 min" }, note: "Розірвати коло найлегше однією маленькою звичкою: прогулянка, сон на годину раніше. The more you move, the better you sleep." }
> ```

Українською ми кажемо «замкнене коло», англійською — *a vicious circle* (або *cycle*): одна погана річ посилює іншу. Протилежне — *a virtuous circle*, коли одна добра звичка тягне за собою інші.

### Граматика в контексті: *the more…, the better…*

Конструкція з двома порівняльними ступенями показує, що одне змінюється разом з іншим — ідеально для розмови про звички й наслідки.

| Модель | Приклад | Переклад |
|---|---|---|
| *the + comparative…, the + comparative…* | ***The more** you exercise, **the better** you sleep.* | Що більше ти тренуєшся, то краще спиш. |
| з іменником | ***The less** sugar you eat, **the more** energy you have.* | Що менше цукру їси, то більше маєш енергії. |
| коротко, як вигук | *When should I start? — **The sooner, the better.*** | Коли почати? — Що раніше, то краще. |

Ще дві корисні моделі: *get into the habit of **-ing*** (набути звички) і *I've been trying to…* (тривала спроба до сьогодні): *I've **been trying to** get into the habit **of going** to bed earlier.*

### Для IELTS: здоровʼя в Writing Task 2 і Speaking Part 3

Типові питання Task 2: *In many countries, the number of people who are overweight is rising. What are the causes, and what solutions can you suggest?* · *Some people think that governments should tax unhealthy food. To what extent do you agree?* Speaking Part 3: *Why is mental health discussed more today? Whose responsibility is it to keep people healthy?*

> [!diagram] Хто відповідає за здоровʼя? План есе
> ```yaml
> layout: compare
> columns: { ind: "Individuals", gov: "Governments" }
> nodes:
>   - { id: i1, col: ind, label: "choices", text: "diet, exercise, sleep are personal decisions", tone: blue }
>   - { id: i2, col: ind, label: "freedom", text: "adults should not be told what to eat", tone: blue }
>   - { id: g1, col: gov, label: "environment", text: "cheap processed food, few parks", tone: orange }
>   - { id: g2, col: gov, label: "tools", text: "tax sugary drinks, fund healthcare", tone: orange }
>   - { id: both, col: gov, label: "balance", text: "the state makes the healthy choice the easy choice", tone: green }
> steps:
>   - { focus: [i1, i2], note: "Аргумент «за людину»: дорослі самі обирають, що їсти й скільки рухатися; надмірне втручання держави обмежує свободу." }
>   - { focus: [g1, g2], note: "Аргумент «за державу»: середовище (дешева оброблена їжа, брак парків) формує звички; держава має інструменти — податки, освіту, фінансування медицини." }
>   - { focus: both, note: "Збалансована позиція для Band 7: individuals are responsible for their choices, but governments should make the healthy choice the easy one." }
> ```

| Ідея | Фраза рівня Band 6.5–7 | Переклад |
|---|---|---|
| малорухливість | *lead a **sedentary** lifestyle* | вести малорухливий спосіб життя |
| ожиріння | *rising **obesity** rates* | зростання рівня ожиріння |
| харчування | *maintain a **balanced diet*** | дотримуватися збалансованого харчування |
| податок | *impose a tax on sugary drinks* | запровадити податок на солодкі напої |
| профілактика | *invest in **prevention** rather than **treatment*** | інвестувати в профілактику, а не лише в лікування |
| ментальне здоровʼя | *improve access to **mental health** services* | покращити доступ до психологічної допомоги |
| тривалість життя | ***life expectancy** has risen significantly* | тривалість життя значно зросла |
| вразливі групи | *the most **vulnerable** members of society* | найвразливіші члени суспільства |

> [!example] Зразок абзацу для Task 2 (≈ Band 7)
> *The rise in **obesity** can largely be attributed to changes in the way we live and work. Many adults now lead a **sedentary** lifestyle, spending eight hours or more sitting at a desk and then relaxing in front of a screen in the evening. At the same time, **processed food** has become cheaper and more widely available than fresh produce, particularly in low-income areas. As a result, people consume far more calories than they burn, often without realising it. In other words, the problem is not simply a lack of willpower, but an environment that makes unhealthy choices the easiest ones.*
>
> Що тут працює: тема абзацу (*can largely be attributed to*) → дві причини з деталями → наслідок (*As a result*) → узагальнення (*In other words*). Обережне *largely*, *often*, *particularly* — академічний тон без категоричності.

## Приклади

- *She's been feeling **overwhelmed** since she started her new job.* — Відколи вона почала нову роботу, почувається перевантаженою.
- *There's still a **stigma** around **mental health** in many countries.* — У багатьох країнах досі існує стигма навколо ментального здоровʼя.
- *Talking to a **therapist** helped me understand my **anxiety**.* — Розмови з психотерапевтом допомогли мені зрозуміти свою тривожність.
- *Office workers often lead a **sedentary** lifestyle.* — Офісні працівники часто ведуть малорухливий спосіб життя.
- *He smoked for twenty years before he finally **kicked the habit**.* — Він курив двадцять років, перш ніж нарешті кинув.
- *Regular exercise can **boost** your mood and your **immune system**.* — Регулярні тренування можуть покращити настрій та імунітет.
- *Chocolate is fine **in moderation**.* — Шоколад — це нормально, якщо в міру.
- *The doctor said my **recovery** would take about six weeks.* — Лікар сказав, що одужання триватиме близько шести тижнів.
- ***Life expectancy** in Ukraine has changed a lot over the past century.* — Тривалість життя в Україні дуже змінилася за останнє століття.
- *Stay **hydrated** — drink water before you feel thirsty.* — Пий достатньо води — ще до того, як відчуєш спрагу.

## Слова

### Ментальне здоровʼя

> [!word] mental health
> ipa: /ˌmentəl ˈhelθ/ · pos: noun · level: B2 · id: en-b2-wellbeing-w01
> uk: ментальне (психічне) здоровʼя
> example: Exercise is good for your **mental health** as well as your body. — Спорт корисний не лише для тіла, а й для ментального здоровʼя.
> note: нейтральне. *mental health problems / services / awareness*. Уживай саме цей вираз — «mental problems» звучить грубо.

> [!word] wellbeing
> ipa: /ˌwelˈbiːɪŋ/ · pos: noun · level: B2 · id: en-b2-wellbeing-w02
> uk: добробут; самопочуття; благополуччя
> example: Companies are starting to care about their employees' **wellbeing**. — Компанії починають дбати про самопочуття працівників.
> note: нейтральне-формальне. UK часто *wellbeing*, US — *well-being* з дефісом.

> [!word] anxiety
> ipa: /æŋˈzaɪəti/ · ipa-us: /æŋˈzaɪət̬i/ · pos: noun · level: B2 · id: en-b2-wellbeing-w03
> uk: тривога; тривожність
> example: Many students suffer from **anxiety** before exams. — Багато студентів страждають від тривоги перед іспитами.
> note: нейтральне; також медичний термін (*anxiety disorder*). Вимова: [ен-ЗАЙ-е-ті] — *x* тут /z/.

> [!word] anxious
> ipa: /ˈæŋkʃəs/ · pos: adj · level: B2 · id: en-b2-wellbeing-w04
> uk: стривожений; тривожний
> example: I always feel **anxious** before a job interview. — Перед співбесідою я завжди хвилююся.
> note: нейтральне. *anxious about something*. Вимова інша, ніж в *anxiety*: [ЕНК-шес].

> [!word] depression
> ipa: /dɪˈpreʃən/ · pos: noun · level: B2 · id: en-b2-wellbeing-w05
> uk: депресія
> example: **Depression** is a real illness, not just a bad mood. — Депресія — справжня хвороба, а не просто поганий настрій.
> note: нейтральне. Не кажи «I have depression», коли просто сумно — для цього є *I'm feeling down*. В економіці *depression* — тривалий спад.

> [!word] overwhelmed
> ipa: /ˌəʊvəˈwelmd/ · ipa-us: /ˌoʊvərˈwelmd/ · pos: adj · level: B2 · id: en-b2-wellbeing-w06
> uk: перевантажений; приголомшений (емоціями, справами)
> example: I felt completely **overwhelmed** by all the work. — Я почувався повністю перевантаженим усією цією роботою.
> note: нейтральне. *overwhelmed by / with*; *overwhelming* — нестерпний, приголомшливий.

> [!word] resilience
> ipa: /rɪˈzɪliəns/ · pos: noun · level: B2 · id: en-b2-wellbeing-w07
> uk: стійкість; здатність відновлюватися після труднощів
> example: Ukrainians have shown incredible **resilience**. — Українці показали неймовірну стійкість.
> note: нейтральне-формальне. Прикметник *resilient*. *build resilience* — розвивати стійкість.

> [!word] self-esteem
> ipa: /ˌself ɪˈstiːm/ · pos: noun · level: B2 · id: en-b2-wellbeing-w08
> uk: самооцінка
> example: Social media can damage teenagers' **self-esteem**. — Соцмережі можуть шкодити самооцінці підлітків.
> note: нейтральне. *low / high self-esteem*. Близьке — *self-confidence* (впевненість у собі).

> [!word] therapy
> ipa: /ˈθerəpi/ · pos: noun · level: B2 · id: en-b2-wellbeing-w09
> uk: терапія; психотерапія
> example: She's been in **therapy** for a year, and it really helps. — Вона рік ходить до психотерапевта, і це справді допомагає.
> note: нейтральне. *be in therapy*, *go to therapy*; фахівець — *therapist*. Також фізична: *physiotherapy* (UK) / *physical therapy* (US).

> [!word] seek help
> ipa: /ˌsiːk ˈhelp/ · pos: phrase · level: B2 · id: en-b2-wellbeing-w10
> uk: звернутися по допомогу
> example: If you feel this way for weeks, it's important to **seek help**. — Якщо ти почуваєшся так тижнями, важливо звернутися по допомогу.
> forms: seek → sought → sought
> note: формальне-нейтральне. Розмовно — *get help*, *talk to someone*. *seek advice / treatment*.

> [!word] stigma
> ipa: /ˈstɪɡmə/ · pos: noun · level: B2 · id: en-b2-wellbeing-w11
> uk: стигма; соціальне тавро
> example: There's still a **stigma** attached to going to a psychologist. — Досі існує стигма щодо звернення до психолога.
> note: формальне. *the stigma of / around / attached to something*; *reduce the stigma*.

> [!word] mindfulness
> ipa: /ˈmaɪndfəlnəs/ · pos: noun · level: B2 · id: en-b2-wellbeing-w12
> uk: усвідомленість; практика уважності
> example: Ten minutes of **mindfulness** a day can reduce stress. — Десять хвилин усвідомленості на день можуть зменшити стрес.
> note: нейтральне. *practise mindfulness* (US *practice*); *be mindful of* — зважати на.

> [!word] mood
> ipa: /muːd/ · pos: noun · level: B2 · id: en-b2-wellbeing-w13
> uk: настрій
> example: A short walk can really improve your **mood**. — Коротка прогулянка справді може покращити настрій.
> note: нейтральне. *be in a good / bad mood*; *I'm not in the mood (for)* — у мене немає настрою; *mood swings* — перепади настрою.

> [!word] unwind
> ipa: /ʌnˈwaɪnd/ · pos: verb · level: B2 · id: en-b2-wellbeing-w14
> uk: розслабитися; відпочити (після напруги)
> example: I like to **unwind** with a book after work. — Після роботи я люблю відпочити з книжкою.
> forms: unwind → unwound → unwound
> note: нейтральне-розмовне. Минулий час — /ʌnˈwaʊnd/ [ан-ВАУНД]. Синонім — *relax* (A2).

> [!word] peer pressure
> ipa: /ˈpɪə ˌpreʃə/ · ipa-us: /ˈpɪr ˌpreʃər/ · pos: noun · level: B2 · id: en-b2-wellbeing-w15
> uk: тиск однолітків (оточення)
> example: Many teenagers start smoking because of **peer pressure**. — Багато підлітків починають курити через тиск однолітків.
> note: нейтральне. *peers* — ровесники, люди твого кола.

> [!word] loneliness
> ipa: /ˈləʊnlinəs/ · ipa-us: /ˈloʊnlinəs/ · pos: noun · level: B2 · id: en-b2-wellbeing-w16
> uk: самотність
> example: **Loneliness** can be as harmful to health as smoking. — Самотність може шкодити здоровʼю не менше за куріння.
> note: нейтральне. Прикметник *lonely* (B1) — самотній (сумно); *alone* — сам (просто без інших, не обовʼязково сумно).

### Звички й спосіб життя

> [!word] lifestyle
> ipa: /ˈlaɪfstaɪl/ · pos: noun · level: B2 · id: en-b2-wellbeing-w17
> uk: спосіб життя
> example: Small **lifestyle** changes can add years to your life. — Невеликі зміни в способі життя можуть подовжити життя на кілька років.
> note: нейтральне. *lead / have a healthy lifestyle*; *lifestyle choices*.

> [!word] sedentary
> ipa: /ˈsedəntəri/ · ipa-us: /ˈsedənteri/ · pos: adj · level: B2 · id: en-b2-wellbeing-w18
> uk: малорухливий; сидячий
> example: A **sedentary** job increases the risk of back problems. — Сидяча робота підвищує ризик проблем зі спиною.
> note: формальне, ключове слово IELTS. *a sedentary lifestyle*. Розмовно — *I sit all day*.

> [!word] balanced diet
> ipa: /ˌbælənst ˈdaɪət/ · pos: noun · level: B2 · id: en-b2-wellbeing-w19
> uk: збалансоване харчування
> example: A **balanced diet** includes plenty of fruit and vegetables. — У збалансованому раціоні багато фруктів і овочів.
> note: нейтральне. *diet* — це не лише «дієта для схуднення», а й раціон загалом: *a healthy diet, a vegetarian diet*.

> [!word] processed food
> ipa: /ˌprəʊsest ˈfuːd/ · ipa-us: /ˌprɑːsest ˈfuːd/ · pos: noun · level: B2 · id: en-b2-wellbeing-w20
> uk: оброблена (промислово перероблена) їжа
> example: Try to eat less **processed food** and more fresh produce. — Намагайся їсти менше обробленої їжі й більше свіжих продуктів.
> note: нейтральне. Також *junk food* (розм., шкідлива їжа), *ultra-processed food* (наукове).

> [!word] nutrition
> ipa: /njuˈtrɪʃən/ · ipa-us: /nuˈtrɪʃən/ · pos: noun · level: B2 · id: en-b2-wellbeing-w21
> uk: харчування; поживність
> example: Good **nutrition** is essential for children's development. — Правильне харчування необхідне для розвитку дітей.
> note: формальне-нейтральне. *nutritious* — поживний; *nutritionist* — дієтолог.

> [!word] obesity
> ipa: /əʊˈbiːsəti/ · ipa-us: /oʊˈbiːsət̬i/ · pos: noun · level: B2 · id: en-b2-wellbeing-w22
> uk: ожиріння
> example: Childhood **obesity** has doubled in some countries. — У деяких країнах дитяче ожиріння подвоїлося.
> note: формальне (медичне). Прикметник *obese*. Нейтрально про людину — *overweight*; *fat* — грубо.

> [!word] addiction
> ipa: /əˈdɪkʃən/ · pos: noun · level: B2 · id: en-b2-wellbeing-w23
> uk: залежність (від речовини чи дії)
> example: Gambling **addiction** can destroy families. — Залежність від азартних ігор може зруйнувати родину.
> note: нейтральне. *addiction to something*; прикметник *addicted to* (B1), *addictive* — що викликає залежність.

> [!word] kick the habit
> ipa: /ˌkɪk ðə ˈhæbɪt/ · pos: phrase · level: B2 · id: en-b2-wellbeing-w24
> uk: позбутися шкідливої звички; «завʼязати»
> example: My dad finally **kicked the habit** after thirty years of smoking. — Тато нарешті кинув курити після тридцяти років.
> note: розмовне. Нейтрально — *give up / quit smoking*; формально — *break the habit*.

> [!word] sleep deprivation
> ipa: /ˈsliːp ˌdeprɪˈveɪʃən/ · pos: noun · level: B2 · id: en-b2-wellbeing-w25
> uk: недосипання; позбавлення сну
> example: **Sleep deprivation** affects memory and concentration. — Недосипання впливає на памʼять і концентрацію.
> note: формальне. Розмовно — *I'm not getting enough sleep*. *be sleep-deprived*.

> [!word] insomnia
> ipa: /ɪnˈsɒmniə/ · ipa-us: /ɪnˈsɑːmniə/ · pos: noun · level: B2 · id: en-b2-wellbeing-w26
> uk: безсоння
> example: She has suffered from **insomnia** for years. — Вона роками страждає від безсоння.
> note: нейтральне-медичне. *suffer from insomnia*. Людина — *an insomniac*.

> [!word] workout
> ipa: /ˈwɜːkaʊt/ · ipa-us: /ˈwɝːkaʊt/ · pos: noun · level: B2 · id: en-b2-wellbeing-w27
> uk: тренування
> example: I do a twenty-minute **workout** every morning. — Щоранку я роблю двадцятихвилинне тренування.
> note: нейтральне. Іменник пишеться разом; дієслово окремо — *work out* (B1).

> [!word] stamina
> ipa: /ˈstæmɪnə/ · pos: noun · level: B2 · id: en-b2-wellbeing-w28
> uk: витривалість
> example: Swimming is great for building **stamina**. — Плавання чудово розвиває витривалість.
> note: нейтральне. *build up / improve your stamina*. Синонім у спорті — *endurance*.

> [!word] boost
> ipa: /buːst/ · pos: verb · level: B2 · id: en-b2-wellbeing-w29
> uk: підвищувати; посилювати; підбадьорювати
> example: Sunlight can **boost** your mood. — Сонячне світло може покращити настрій.
> note: нейтральне, дуже часте в медіа: *boost your energy / confidence / immune system*. Іменник: *a boost*.

> [!word] out of shape
> ipa: /ˌaʊt əv ˈʃeɪp/ · pos: phrase · level: B2 · id: en-b2-wellbeing-w30
> uk: у поганій фізичній формі
> example: I'm so **out of shape** — I got tired after one flight of stairs. — Я в жахливій формі — втомився після одного прольоту сходів.
> note: розмовне. Протилежне — *in (good) shape*; *get (back) in shape* — повернути форму.

> [!word] in moderation
> ipa: /ɪn ˌmɒdəˈreɪʃən/ · ipa-us: /ɪn ˌmɑːdəˈreɪʃən/ · pos: phrase · level: B2 · id: en-b2-wellbeing-w31
> uk: помірно; в міру
> example: Coffee is fine **in moderation**. — Кава — це нормально, якщо в міру.
> note: нейтральне. *moderate exercise* — помірні фізичні навантаження.

> [!word] hydrated
> ipa: /haɪˈdreɪtɪd/ · ipa-us: /haɪˈdreɪt̬ɪd/ · pos: adj · level: B2 · id: en-b2-wellbeing-w32
> uk: з достатньою кількістю води в організмі
> example: Remember to stay **hydrated** during the race. — Не забувай пити воду під час забігу.
> note: нейтральне. *stay / keep hydrated*; протилежне — *dehydrated* (зневоднений).

### Медицина й профілактика

> [!word] chronic
> ipa: /ˈkrɒnɪk/ · ipa-us: /ˈkrɑːnɪk/ · pos: adj · level: B2 · id: en-b2-wellbeing-w33
> uk: хронічний
> example: She suffers from **chronic** back pain. — Вона страждає від хронічного болю в спині.
> note: нейтральне-медичне. *ch* = /k/. Протилежне — *acute* (гострий).

> [!word] prevention
> ipa: /prɪˈvenʃən/ · pos: noun · level: B2 · id: en-b2-wellbeing-w34
> uk: профілактика; запобігання
> example: **Prevention** is better than cure. — Запобігти легше, ніж лікувати.
> note: нейтральне. Дієслово *prevent something / somebody from doing something*; *preventive / preventative medicine*.

> [!word] diagnosis
> ipa: /ˌdaɪəɡˈnəʊsɪs/ · ipa-us: /ˌdaɪəɡˈnoʊsɪs/ · pos: noun · level: B2 · id: en-b2-wellbeing-w35
> uk: діагноз; діагностика
> example: Early **diagnosis** saves lives. — Рання діагностика рятує життя.
> forms: diagnosis → diagnoses /ˌdaɪəɡˈnəʊsiːz/
> note: нейтральне-формальне. *make a diagnosis*; дієслово *be diagnosed with* — отримати діагноз.

> [!word] treatment
> ipa: /ˈtriːtmənt/ · pos: noun · level: B2 · id: en-b2-wellbeing-w36
> uk: лікування
> example: The new **treatment** has helped thousands of patients. — Нове лікування допомогло тисячам пацієнтів.
> note: нейтральне. *receive / undergo treatment for something*. Дієслово *treat* — лікувати.

> [!word] recovery
> ipa: /rɪˈkʌvəri/ · pos: noun · level: B2 · id: en-b2-wellbeing-w37
> uk: одужання; відновлення
> example: We wish him a quick **recovery**. — Бажаємо йому швидкого одужання.
> note: нейтральне. *make a full recovery*; дієслово *recover from*. В економіці — пожвавлення.

> [!word] life expectancy
> ipa: /ˈlaɪf ɪkˌspektənsi/ · pos: noun · level: B2 · id: en-b2-wellbeing-w38
> uk: (очікувана) тривалість життя
> example: **Life expectancy** has risen thanks to better healthcare. — Тривалість життя зросла завдяки кращій медицині.
> note: формальне-нейтральне, часте в IELTS Task 1 і Task 2. *average life expectancy*.

> [!word] healthcare
> ipa: /ˈhelθkeə/ · ipa-us: /ˈhelθker/ · pos: noun · level: B2 · id: en-b2-wellbeing-w39
> uk: охорона здоровʼя; медичне обслуговування
> example: Everyone should have access to free **healthcare**. — Кожен повинен мати доступ до безоплатної медицини.
> note: нейтральне. UK також *health care* окремо. *the healthcare system*; *healthcare workers*.

> [!word] immune system
> ipa: /ɪˈmjuːn ˌsɪstəm/ · pos: noun · level: B2 · id: en-b2-wellbeing-w40
> uk: імунна система; імунітет
> example: Lack of sleep weakens the **immune system**. — Брак сну послаблює імунну систему.
> note: нейтральне. «Імунітет» у побуті — саме *immune system*; *immunity* — специфічніше (*immunity to a disease*).

> [!word] check-up
> ipa: /ˈtʃek ʌp/ · pos: noun · level: B2 · id: en-b2-wellbeing-w41
> uk: профілактичний огляд; медогляд
> example: You should have a **check-up** once a year. — Медогляд варто проходити раз на рік.
> note: нейтральне. Іменник з дефісом; дієслово окремо — *check up on somebody*.

> [!word] contagious
> ipa: /kənˈteɪdʒəs/ · pos: adj · level: B2 · id: en-b2-wellbeing-w42
> uk: заразний
> example: Stay at home — the flu is very **contagious**. — Залишайся вдома — грип дуже заразний.
> note: нейтральне. Переносно: *Her laugh is contagious* — її сміх заразний. Синонім — *infectious*.

> [!word] posture
> ipa: /ˈpɒstʃə/ · ipa-us: /ˈpɑːstʃər/ · pos: noun · level: B2 · id: en-b2-wellbeing-w43
> uk: постава
> example: Bad **posture** at your desk can cause back pain. — Погана постава за столом може спричиняти біль у спині.
> note: нейтральне. *good / poor posture*.

> [!word] self-care
> ipa: /ˌself ˈkeə/ · ipa-us: /ˌself ˈker/ · pos: noun · level: B2 · id: en-b2-wellbeing-w44
> uk: турбота про себе
> example: Saying no to extra work is also a form of **self-care**. — Відмовитися від зайвої роботи — теж форма турботи про себе.
> note: нейтральне-розмовне (соцмережі, психологія).

> [!word] vulnerable
> ipa: /ˈvʌlnərəbəl/ · pos: adj · level: B2 · id: en-b2-wellbeing-w45
> uk: вразливий
> example: Older people are more **vulnerable** to the flu. — Люди похилого віку вразливіші до грипу.
> note: нейтральне-формальне, часте в IELTS. *vulnerable to something*; *vulnerable groups* — вразливі групи.

## Слухаємо

> [!listen] Що радить лікар?
> level: B2 · type: answer · id: en-b2-wellbeing-l01
> audio: Your blood tests are fine, but your lifestyle is quite sedentary. I'd suggest at least thirty minutes of walking a day, and try to cut down on processed food. Let's do another check-up in six months.
> - [ ] приймати ліки й повторити аналізи через місяць
> - [x] більше рухатися, їсти менше обробленої їжі й прийти на огляд через пів року
> - [ ] почати бігати марафони
> - [ ] повністю відмовитися від їжі ввечері
>
> **Пояснення:** *sedentary* — малорухливий → *thirty minutes of walking a day*; *cut down on processed food* — менше обробленої їжі; *another check-up in six months* — огляд через пів року.

> [!listen] Обери почуте
> level: B2 · type: choice · id: en-b2-wellbeing-l02
> audio: I've been feeling quite anxious lately.
> - [ ] I've been feeling quite angry lately.
> - [x] I've been feeling quite anxious lately.
> - [ ] I felt quite anxious last year.
>
> **Пояснення:** *anxious* [ЕНК-шес] — тривожний; *angry* — злий. *I've been feeling* — тривалий стан до сьогодні, а не минуле.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: en-b2-wellbeing-l03
> audio: A balanced diet can boost your immune system.

> [!listen] IELTS Listening, Part 4 — лекція про сон. Яка частка дорослих регулярно спить менше семи годин?
> level: B2 · type: answer · id: en-b2-wellbeing-l04
> audio: Most adults need between seven and nine hours of sleep a night. Yet surveys suggest that around a third of adults regularly get less than seven. The effects of sleep deprivation go far beyond tiredness. It weakens the immune system and is closely linked to anxiety and depression.
> - [ ] about a quarter
> - [x] about one in three
> - [ ] about half
> - [ ] most adults
>
> **Пояснення:** *around a third* = *about one in three*. Пастка — *Most adults* на початку: це про те, скільки сну **потрібно**, а не скільки недосипає.

> [!listen] IELTS Listening, Part 3 — студенти обговорюють психологічну допомогу в школах. Що додає другий студент?
> level: B2 · type: answer · id: en-b2-wellbeing-l05
> audio: A: I think every school should have a counsellor that students can talk to.
> audio: B: Agreed, but a counsellor alone isn't enough. Teachers need some training too, so they can spot the warning signs early.
> - [ ] Шкільний психолог не потрібен.
> - [ ] Учням варто ходити до приватних терапевтів.
> - [x] Учителів теж треба навчити помічати тривожні ознаки.
> - [ ] Батьки мають відповідати за ментальне здоровʼя дітей.
>
> **Пояснення:** *Agreed, but… isn't enough* — він погоджується й **додає**: *Teachers need some training too, so they can spot the warning signs early.*

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: en-b2-wellbeing-l06
> audio: Mental health problems are nothing to be ashamed of.

## Ситуація: колега на межі

> [!example] Розмова на кухні в офісі
> **Marta:** Hey, Dan. You look exhausted. Is everything OK?
> **Dan:** Not really. I've been sleeping about four hours a night. I just feel completely **overwhelmed** with this project.
> **Marta:** That sounds hard. Have you talked to your manager?
> **Dan:** No… I don't want them to think I can't cope.
> **Marta:** I get that, but asking for help isn't a weakness. Honestly, **the longer** you wait, **the worse** it gets.
> **Dan:** I know. I've stopped going to the gym, I'm living on coffee and snacks…
> **Marta:** Classic vicious circle. Maybe start with one thing — like a short walk at lunch? It really **boosts** my **mood**.
> **Dan:** Yeah, maybe. And our company has free sessions with a **therapist**, right?
> **Marta:** It does. Lots of people use it now — there's much less **stigma** than before. I think you should **seek help** before it turns into burnout.
>
> Марта не дає лекцій: спершу співчуває (*That sounds hard*), потім мʼяко радить (*Maybe start with…*, *I think you should…*). А *I get that, but…* — природний спосіб погодитися з почуттями й водночас заперечити висновок.

## Вимова

> [!speak] Скажи вголос
> level: B2 · id: en-b2-wellbeing-s01
> text: I've been trying to cut down on sugar.
> ipa: /aɪv bɪn ˈtraɪɪŋ tə ˌkʌt ˈdaʊn ɒn ˈʃʊɡə/
> tip: been — слабке [бін]; cut‿down — /t/ майже зникає перед /d/; sugar — /ʃ/: [ШУ-ге].
> uk: Я намагаюся їсти менше цукру.

> [!speak] Скажи вголос
> level: B2 · id: en-b2-wellbeing-s02
> text: The more you exercise, the better you sleep.
> ipa: /ðə ˈmɔː ju ˈeksəsaɪz ðə ˈbetə ju ˈsliːp/
> tip: Ритм: наголос на *more* і *better* — це серце конструкції. exercise — [ЕК-се-сайз].
> uk: Що більше ти тренуєшся, то краще спиш.

> [!speak] Скажи вголос
> level: B2 · id: en-b2-wellbeing-s03
> text: Anxiety and depression are treatable conditions.
> ipa: /æŋˈzaɪəti ən dɪˈpreʃən ə ˈtriːtəbəl kənˈdɪʃənz/
> tip: anxiety — [ен-ЗАЙ-е-ті], *x* тут /z/; treatable — [ТРІ-те-бл].
> uk: Тривожність і депресія — хвороби, які піддаються лікуванню.

> [!speak] IELTS Speaking, Part 3 — «Why do so many young people suffer from anxiety?»
> level: B2 · id: en-b2-wellbeing-s04
> text: Social media creates constant pressure to look perfect, and many teenagers feel overwhelmed by it.
> ipa: /ˈsəʊʃəl ˈmiːdiə kriˈeɪts ˈkɒnstənt ˈpreʃə tə ˈlʊk ˈpɜːfɪkt ən ˈmeni ˈtiːneɪdʒəz ˈfiːl ˌəʊvəˈwelmd baɪ ɪt/
> tip: Причина + наслідок в одному реченні. overwhelmed — [оу-ве-ВЕЛМД], літера *h* не читається; perfect — [ПЕ-фікт].
> uk: Соцмережі створюють постійний тиск виглядати ідеально, і багато підлітків почуваються від цього перевантаженими.

> [!speak] IELTS Speaking, Part 3 — «Should the government be responsible for people's health?»
> level: B2 · id: en-b2-wellbeing-s05
> text: Partly. The state should make healthcare affordable, but individuals are responsible for their own lifestyle choices.
> ipa: /ˈpɑːtli ðə ˈsteɪt ʃəd ˈmeɪk ˈhelθkeər əˈfɔːdəbəl bət ˌɪndɪˈvɪdʒuəlz ə rɪˈspɒnsəbəl fə ðeər ˈəʊn ˈlaɪfstaɪl ˈtʃɔɪsɪz/
> tip: *Partly* + дві сторони — збалансована відповідь Band 7. healthcare‿affordable — звʼязне /r/ (UK); individuals — [ін-ді-ВІ-джу-елз].
> uk: Частково. Держава має робити медицину доступною, але люди самі відповідають за свій спосіб життя.

> [!speak] IELTS Speaking, Part 3 — «Is there still a stigma around mental health?»
> level: B2 · id: en-b2-wellbeing-s06
> text: Less than before, but many men still feel embarrassed to seek help.
> ipa: /ˈles ðən bɪˈfɔː bət ˈmeni ˈmen ˈstɪl ˈfiːl ɪmˈbærəst tə ˈsiːk ˈhelp/
> tip: Порівняння з минулим (*Less than before*) — простий спосіб розгорнути відповідь. embarrassed — подвійні *rr* і *ss*: [ім-БЕ-рест].
> uk: Менше, ніж раніше, але багатьом чоловікам досі ніяково звертатися по допомогу.

> [!speak] IELTS Speaking, Part 3 — «How can people lead a healthier lifestyle?»
> level: B2 · id: en-b2-wellbeing-s07
> text: Small changes work best, like taking the stairs, drinking more water and going to bed earlier.
> ipa: /ˈsmɔːl ˈtʃeɪndʒɪz ˈwɜːk ˈbest laɪk ˈteɪkɪŋ ðə ˈsteəz ˈdrɪŋkɪŋ ˈmɔː ˈwɔːtər ən ˈɡəʊɪŋ tə ˈbed ˈɜːliə/
> tip: Узагальнення + три приклади через кому — чіткий ритм переліку з інтонацією ↗ ↗ ↘. stairs — [СТЕЄЗ].
> uk: Найкраще працюють маленькі зміни: ходити сходами, пити більше води й раніше лягати спати.

## Типові помилки українців

> [!pitfall] «I have sympathy to him» у значенні «він мені подобається»
> *Sympathy* — хибний друг: це **співчуття** (*I have a lot of sympathy for her — she's been through a lot*). «Симпатія», «він мені симпатичний» — *I **like** him*, *I **find** him **attractive / nice***, *I have **a soft spot for** him*. А «співчуваю» в горі — *I'm so sorry for your loss.*

> [!pitfall] «He's very nervous» про дратівливу людину
> Англійське ***nervous*** — «схвильований, переживає» (*nervous before an exam*). Українське «нервовий» у значенні «дратівливий, вибухає через дрібниці» — ***irritable***, ***short-tempered***, ***on edge***. «Мене це нервує» — *It **gets on my nerves** / It **annoys** me*.

> [!pitfall] «I sit on a diet»
> Калька з «сидіти на дієті». Правильно — *I'm **on** a diet* (зараз), *I'm **going on** a diet* (починаю). І памʼятай: *diet* — це ще й звичайний раціон: *Japanese people have a healthy **diet**.* Не означає, що вони худнуть.

> [!pitfall] «Go in for sport», «make sport»
> *Go in for sport* — вираз зі старих радянських підручників, у сучасній мові майже не трапляється. Кажи ***do sport*** (UK), ***play sports*** (US), ***exercise***, ***work out***, ***keep fit*** — або конкретно: *I go swimming, I do yoga, I play football*. «Займатися» англійською щоразу інше дієслово: *go* + -ing, *do* + yoga / karate, *play* + ігри з мʼячем.

## Практика

> [!quiz] «I have a sedentary job.» Що це означає?
> level: B2 · id: en-b2-wellbeing-q02
> - [ ] У мене небезпечна робота.
> - [x] У мене сидяча, малорухлива робота.
> - [ ] У мене нічні зміни.
> - [ ] У мене тимчасова робота.
>
> **Пояснення:** *sedentary* — сидячий, малорухливий: *a sedentary job / lifestyle*. Ключове слово для IELTS-есе про ожиріння.

> [!quiz] Які слова описують емоційний стан людини? Обери всі.
> level: B2 · id: en-b2-wellbeing-q03
> - [x] anxious
> - [x] overwhelmed
> - [ ] sedentary
> - [x] in a bad mood
> - [ ] contagious
>
> **Пояснення:** *anxious* — тривожний, *overwhelmed* — перевантажений, *in a bad mood* — у поганому настрої. *Sedentary* — про спосіб життя, *contagious* — про хворобу.

> [!quiz] Спосіб життя: заповни пропуски
> level: B2 · type: fill · id: en-b2-wellbeing-q04 · bank: balance, sitting, process
>
> ```text fill
> A [[balanced]] diet includes fruit, vegetables and protein.
> Try to avoid [[processed]] food like crisps and ready meals.
> [[Sleep]] deprivation affects your memory.
> Office workers often lead a [[sedentary]] lifestyle.
> ```

> [!quiz] Сталі вирази: заповни пропуски
> level: B2 · type: fill · id: en-b2-wellbeing-q05 · bank: tradition, assistance, immunity
>
> ```text fill
> After twenty years of smoking, he finally kicked the [[habit]].
> If you feel low for weeks, don't hesitate to seek [[help]].
> Vitamin D helps to boost your [[immune]] system.
> Coffee is fine in [[moderation]].
> ```

> [!quiz] Склади речення: «Що більше ти тренуєшся, то краще спиш».
> level: B2 · type: order · id: en-b2-wellbeing-q06
>
> ```text order
> The more
> you exercise,
> the better
> you sleep.
> more better ✗
> ```
>
> **Пояснення:** *the + comparative…, the + comparative…* — обидві частини з *the*. «More better» — помилка: *better* уже порівняльний ступінь.

> [!quiz] «Він мені дуже симпатичний». Як сказати природно?
> level: B2 · id: en-b2-wellbeing-q07
> - [ ] I have a big sympathy to him.
> - [x] I really like him.
> - [ ] He is very sympathetic for me.
> - [ ] I feel sympathy on him.
>
> **Пояснення:** *sympathy* — співчуття, *sympathetic* — співчутливий. «Подобається, симпатичний» — *like*, *find somebody nice / attractive*.

> [!quiz] «Через роботу він став дуже нервовим і дратівливим». Обери точний варіант.
> level: B2 · id: en-b2-wellbeing-q08
> - [ ] He's become very nervous to everyone because of work.
> - [x] He's become very irritable because of work.
> - [ ] He's become very nervy on people because of work.
> - [ ] He's become very angry-nervous because of work.
>
> **Пояснення:** «дратівливий» — *irritable* (або *short-tempered, on edge*). *Nervous* — схвильований, наляканий перед чимось.

> [!quiz] Яке слово? «There is still a social ___ attached to depression, so many people hide it.»
> level: B2 · id: en-b2-wellbeing-q09
> - [x] stigma
> - [ ] symptom
> - [ ] stamina
> - [ ] status
>
> **Пояснення:** *stigma* — соціальне тавро, осуд: через нього люди приховують проблему. *Symptom* — симптом, *stamina* — витривалість.

> [!quiz] IELTS Academic Reading: True, False чи Not Given?
> level: B2 · id: en-b2-wellbeing-q10
>
> **Prescribing community.** In parts of the UK, doctors can now offer patients a "social prescription" instead of, or alongside, medication. A patient suffering from mild depression or loneliness might be referred to a gardening club, a walking group or an art class. Early studies suggest that such activities can reduce anxiety and improve self-esteem, particularly among older people who live alone. However, the evidence is still limited: many studies are small, and few have followed patients for longer than a year. Some doctors also worry that social prescribing could be used to save money, replacing treatment that patients genuinely need. Nevertheless, supporters argue that it addresses a problem that pills cannot solve — the lack of meaningful contact with other people.
>
> *Statement:* **Social prescriptions are always given instead of medication.**
> - [ ] True
> - [x] False
> - [ ] Not Given
>
> **Пояснення:** *instead of, **or alongside**, medication* — замість ліків **або разом** з ними. *Always instead of* суперечить тексту → **False**. Слова-«абсолюти» (*always, never, all*) у твердженнях — сигнал перевірити уважно.

> [!quiz] IELTS Academic Reading: True, False чи Not Given? (той самий текст)
> level: B2 · id: en-b2-wellbeing-q11
>
> **Prescribing community.** In parts of the UK, doctors can now offer patients a "social prescription" instead of, or alongside, medication. A patient suffering from mild depression or loneliness might be referred to a gardening club, a walking group or an art class. Early studies suggest that such activities can reduce anxiety and improve self-esteem, particularly among older people who live alone. However, the evidence is still limited: many studies are small, and few have followed patients for longer than a year. Some doctors also worry that social prescribing could be used to save money, replacing treatment that patients genuinely need. Nevertheless, supporters argue that it addresses a problem that pills cannot solve — the lack of meaningful contact with other people.
>
> *Statement:* **Some doctors are concerned that social prescribing might be used to cut costs.**
> - [x] True
> - [ ] False
> - [ ] Not Given
>
> **Пояснення:** *Some doctors also worry that… could be used to save money* = *are concerned that… might be used to cut costs*. Парафраз: *worry → are concerned*, *save money → cut costs* → **True**.

> [!quiz] IELTS Academic Reading: True, False чи Not Given? (той самий текст)
> level: B2 · id: en-b2-wellbeing-q12
>
> **Prescribing community.** In parts of the UK, doctors can now offer patients a "social prescription" instead of, or alongside, medication. A patient suffering from mild depression or loneliness might be referred to a gardening club, a walking group or an art class. Early studies suggest that such activities can reduce anxiety and improve self-esteem, particularly among older people who live alone. However, the evidence is still limited: many studies are small, and few have followed patients for longer than a year. Some doctors also worry that social prescribing could be used to save money, replacing treatment that patients genuinely need. Nevertheless, supporters argue that it addresses a problem that pills cannot solve — the lack of meaningful contact with other people.
>
> *Statement:* **Gardening clubs have proved more effective than walking groups.**
> - [ ] True
> - [ ] False
> - [x] Not Given
>
> **Пояснення:** обидва заходи лише **перелічено** як приклади; про те, що ефективніше, — ані слова → **Not Given**.

> [!quiz] IELTS Summary completion: заповни пропуски словами з банку (той самий текст)
> level: B2 · type: fill · id: en-b2-wellbeing-q13 · bank: medication, stress, research, support
>
> ```text fill
> A patient with mild depression or [[loneliness]] may be sent to a gardening club.
> Early studies show these activities can improve [[self-esteem]].
> However, the [[evidence]] is still limited.
> Supporters say social prescribing tackles the lack of meaningful [[contact]] with others.
> ```
>
> **Пояснення:** *research* за змістом близьке до *evidence*, але в тексті саме *the evidence is still limited*. *Support* — логічна пастка до *contact*. У summary completion спершу шукай місце в тексті за ключовими словами (*mild depression, early studies, supporters*), а потім — точне слово.

> [!quiz] IELTS Writing Task 2: яке речення найдоречніше в академічному есе?
> level: B2 · id: en-b2-wellbeing-q14
> - [ ] Too many people are really fat these days.
> - [x] Obesity rates have risen sharply in recent decades.
> - [ ] Fat people is a big problem nowadays.
> - [ ] There are loads of overweight guys everywhere.
>
> **Пояснення:** академічний стиль — нейтральні терміни (*obesity rates*), точний опис тенденції (*have risen sharply in recent decades*) і без розмовних *really, loads of, guys*. *Fat* у есе звучить грубо й оцінно.

> [!quiz] Прийменники: заповни пропуски
> level: B2 · type: fill · id: en-b2-wellbeing-q15 · bank: of, with, in
>
> ```text fill
> She has suffered [[from]] insomnia for years.
> Her addiction [[to]] online games worried her parents.
> It took him six weeks to recover [[from]] the operation.
> I always feel anxious [[about]] flying.
> ```
>
> **Пояснення:** *suffer from*, *addiction to*, *recover from*, *anxious about*. Українські «страждати **від**» і «залежність **від**» підштовхують до *from*, але *addiction* вимагає *to*.

## Фішки

> [!reel] 😴 Insomnia і наш «сон»
> *Insomnia* — латинське «без сну»: *in-* (не) + *somnus* (сон). А тепер найцікавіше: латинське *somnus* і українське «сон» — далекі родичі, обидва йдуть від одного праіндоєвропейського кореня. Тож коли ти кажеш «сон», ти вимовляєш слово, якому кілька тисяч років.

> [!reel] 🧘 Mindfulness — переклад з палі
> Слово *mindfulness* у сучасному значенні зʼявилося, коли британський дослідник буддизму Т. В. Ріс-Девідс у 1881 році шукав переклад для поняття *sati* з мови палі — «памʼятання, уважність». Понад століття потому воно стало модним словом психології, бізнес-тренінгів і застосунків для медитації.

> [!reel] 🍎 An apple a day
> *An apple a day keeps the doctor away* — «Яблуко на день — і лікар не потрібен». Найраніша відома версія записана в Уельсі 1866 року і звучала довше: «Їж яблуко перед сном — і позбавиш лікаря заробітку». Наука скромніша: яблука корисні, але від візитів до лікаря не рятують.

## Джерела та що почитати

- 🟢 [NHS — Every Mind Matters](https://www.nhs.uk/every-mind-matters/) — прості тексти британської системи охорони здоровʼя про тривогу, сон і стрес: живий B2.
- 🟢 [Cambridge Dictionary](https://dictionary.cambridge.org/) — UK / US: *nutrition, posture, sedentary*; позначки *formal / informal*.
- 🟡 [BBC Learning English — 6 Minute English](https://www.bbc.co.uk/learningenglish/english/features/6-minute-english) — епізоди про сон, звички, ментальне здоровʼя.
- 🟡 M. McCarthy, F. O'Dell — *English Vocabulary in Use: Upper-Intermediate*: розділи «Health and medicine», «Feelings and emotions».
- 🟡 [IELTS — офіційний сайт](https://ielts.org) (Speaking test format) — Part 3: як розгортати відповідь (думка → причина → приклад).

> [!important] Підсумок
> - Ментальне здоровʼя: *anxiety (anxious), depression, overwhelmed, resilience, self-esteem, therapy, seek help, stigma, mindfulness, unwind*.
> - Спосіб життя: *a sedentary lifestyle, a balanced diet, processed food, obesity, sleep deprivation, insomnia, kick the habit, in moderation, boost*.
> - Медицина: *prevention, diagnosis, treatment, recovery, check-up, chronic, contagious, life expectancy, healthcare, immune system*.
> - Граматика: *The more you exercise, the better you sleep*; *get into the habit of -ing*.
> - Пастки: *sympathy* = співчуття, *nervous* ≠ дратівливий (*irritable*), *be on a diet* (не «sit»), *work out / do sport* (не «go in for sport»).
