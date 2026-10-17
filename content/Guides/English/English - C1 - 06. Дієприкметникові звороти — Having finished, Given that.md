---
title: Дієприкметникові звороти — Having finished, Given that
order: 506
id: en-c1-participles
level: C1
icon: px:puzzle
tags: [english, c1, grammar, participle-clauses, academic-style, writing, ielts]
prerequisites: ["[[English - B2 - 09. Підрядні речення — non-defining і скорочені]]", "[[English - B2 - 10. Звʼязки — although, despite, whereas, however]]"]
estimatedMinutes: 50
---

# Дієприкметникові звороти — Having finished, Given that

> [!success] Після цієї теми ти зможеш
> - скорочувати підрядні речення часу, причини, умови й результату до звороту: ***Arriving** at the station, she called me.* · ***Built** in 1890, the bridge…*;
> - обирати форму: **-ing** (одночасно), **having + V3** (раніше), **V3** (пасив), **having been + V3** (пасив раніше);
> - лишати сполучник для ясності: ***After graduating**, **When asked**, **If left untreated**, **Once opened***;
> - помічати й виправляти «висячий» зворот (dangling participle) і знати, які сталі вирази — виняток (*Generally speaking, Given that, Judging by*);
> - писати в IELTS Writing Task 1 речення з результатом (*…, **reaching** a peak of 40 % in 2015*) і підняти бал за Grammatical Range & Accuracy (C1 ≈ IELTS 7.0–8.0).

## Передбач

> [!quiz] «Закінчивши звіт, вона пішла додому». Як сказати?
> level: C1 · id: en-c1-participles-q01
> - [x] Having finished the report, she went home.
> - [ ] Having finish the report, she went home.
> - [ ] Finished the report, she went home.
> - [ ] After she having finished the report, she went home.
>
> **Пояснення:** «зробивши» — дія **раніше** за головну → **having + V3** (*having finished*). *Finished the report* — це форма пасиву («закінчена»), тут вона не підходить. Після *she* потрібне звичайне дієслово (*after she had finished*), а не *having*.

## Простими словами

Український учень має тут перевагу: у нас є **дієприслівниковий зворот** — «Прийшовши додому, я ввімкнув чайник», «Читаючи лист, вона усміхалася». Англійський **participle clause** працює майже так само: це скорочене підрядне речення, у якому немає сполучника й підмета, а дієслово стоїть у формі дієприкметника.

- *When she arrived at the station, she called me.* → ***Arriving** at the station, she called me.* — Приїхавши на вокзал, вона подзвонила мені.
- *Because I didn't know the way, I asked a policeman.* → ***Not knowing** the way, I asked a policeman.* — Не знаючи дороги, я спитав поліцейського.
- *The bridge was built in 1890 and is still in use.* → ***Built** in 1890, the bridge is still in use.* — Збудований 1890 року, міст досі використовується.

Головне правило те саме, що в українській: **підмет звороту = підмет головного речення**. Якщо підмети різні, скорочувати не можна — інакше виходить «висячий» зворот (про нього нижче).

Навіщо це на C1? Зворот робить текст **щільнішим і формальнішим**: два речення стають одним, а зайві *when, because, and then* зникають. Це типовий засіб академічного й новинного стилю — і один зі способів показати «складні структури» в IELTS Writing.

> [!diagram] Як підрядне речення стає зворотом
> ```yaml
> layout: flow
> nodes:
>   - { id: full, label: "повне речення", text: "When she arrived at the station, she called me.", tone: blue }
>   - { id: cut, label: "прибираємо сполучник і підмет", text: "?", tone: yellow }
>   - { id: short, label: "participle clause", text: "?", tone: green }
> steps:
>   - { focus: full, note: "Два підмети — she і she. Підмети однакові, отже підрядне можна скоротити." }
>   - { move: { from: full, to: cut, value: "− When − she" }, set: { cut: "arrived at the station" }, note: "Сполучник when і підмет she зникають: підмет і так зрозумілий з головного речення." }
>   - { move: { from: cut, to: short, value: "arrived → arriving" }, set: { short: "Arriving at the station, she called me." }, note: "Дієслово стає -ing: дія активна і майже одночасна з головною. Після звороту — кома." }
>   - { focus: short, note: "Якщо хочеш підкреслити час, сполучник можна повернути: On arriving / When arriving at the station, she called me." }
> ```

## Пояснення

### Чотири форми звороту

| Форма | Коли | Приклад | Переклад |
|---|---|---|---|
| **-ing** | активна дія одночасно з головною або одразу перед нею | ***Walking** home, I met an old friend.* | Ідучи додому, я зустрів старого друга. |
| **having + V3** | активна дія **раніше**, наголос на завершенні | ***Having lived** in Kyiv for years, he knows every street.* | Проживши в Києві багато років, він знає кожну вулицю. |
| **V3** | **пасив**: підмет зазнає дії | ***Written** in 1949, the novel still feels modern.* | Написаний 1949 року, роман досі здається сучасним. |
| **having been + V3** | пасив, що стався **раніше** | ***Having been warned** twice, he was finally dismissed.* | Отримавши два попередження, він зрештою був звільнений. |

Заперечення — **not перед зворотом**: ***Not having received** a reply, she wrote again.* — Не отримавши відповіді, вона написала знову. (Форма *having not received* трапляється, але *not having* — стандартна.)

> [!diagram] Яку форму обрати
> ```yaml
> layout: tree
> nodes:
>   - { id: root, label: "підмет головного речення…", text: "який звʼязок із дією звороту?", tone: gray }
>   - { id: ing, parent: root, label: "…робить дію одночасно", text: "-ing", note: "Walking home, I met Ann.", tone: blue }
>   - { id: hav, parent: root, label: "…зробив дію раніше", text: "having + V3", note: "Having finished, she left.", tone: violet }
>   - { id: v3, parent: root, label: "…зазнає дії (пасив)", text: "V3", note: "Built in 1890, the bridge…", tone: green }
>   - { id: hbv, parent: root, label: "…зазнав дії раніше", text: "having been + V3", note: "Having been warned, he…", tone: orange }
> steps:
>   - { focus: root, note: "Спершу знайди підмет головного речення і спитай: він сам робить дію звороту чи з ним щось роблять?" }
>   - { focus: ing, note: "Сам робить і в той самий час → -ing. Ідучи додому (walking), я зустрів Анну." }
>   - { focus: hav, note: "Сам зробив, і це завершилося до головної дії → having + V3. Закінчивши (having finished), вона пішла." }
>   - { focus: v3, note: "З підметом щось зробили → V3. Міст збудували (built) — міст не будував сам себе." }
>   - { focus: hbv, note: "З підметом щось зробили раніше, і це важливо для послідовності → having been + V3." }
> ```

> [!quiz] «Збудований 1890 року, міст досі використовується». Обери зворот.
> level: C1 · id: en-c1-participles-q02
> - [ ] Building in 1890, the bridge is still in use.
> - [x] Built in 1890, the bridge is still in use.
> - [ ] Having built in 1890, the bridge is still in use.
> - [ ] Been built in 1890, the bridge is still in use.
>
> **Пояснення:** міст **зазнав** дії (його збудували) → пасив **V3**: *Built in 1890*. *Building* і *having built* означали б, що міст сам щось будував. *Been built* без *having* не вживається.

### Яке значення має зворот

Зворот сам по собі не каже, «коли», «чому» чи «за якої умови» — значення підказує контекст:

| Значення | Повне речення | Зворот |
|---|---|---|
| **час** | *When I opened the door, I saw a stranger.* | ***Opening** the door, I saw a stranger.* |
| **причина** | *Because she is a doctor, she knew what to do.* | ***Being** a doctor, she knew what to do.* |
| **умова** | *If it is used correctly, this tool saves hours.* | ***Used** correctly, this tool saves hours.* |
| **результат** (після головного) | *Prices rose sharply, and this forced families to cut spending.* | *Prices rose sharply, **forcing** families to cut spending.* |

Зворот результату — **після** головного речення через кому: *The river burst its banks, **flooding** hundreds of homes.* — Річка вийшла з берегів і затопила сотні будинків. Це улюблена структура IELTS Writing Task 1: *Sales rose steadily, **reaching** a peak of 5 million in 2020.*

### Сполучник + зворот

Іноді без сполучника значення неясне. Тоді його лишають, а підмет і *be* прибирають:

| Сполучник | Форма | Приклад | Переклад |
|---|---|---|---|
| **after / before / since** | -ing | ***After graduating**, she moved to London.* | Після закінчення університету вона переїхала до Лондона. |
| **while / when** | -ing | ***While waiting** for the bus, I read the news.* | Поки чекав автобус, я читав новини. |
| **when / if / unless / once / until** | V3 | ***When asked** about the delay, the spokesperson declined to comment.* | Коли речника спитали про затримку, він відмовився коментувати. |
| | | ***If left untreated**, the infection can spread.* | Якщо інфекцію не лікувати, вона може поширитися. |
| | | ***Once opened**, keep refrigerated.* | Після відкриття зберігати в холодильнику. |
| **on / upon** | -ing | ***On arriving** at the hotel, we were given a welcome drink.* | Щойно ми приїхали в готель, нам дали вітальний напій. |
| **although / though** | -ing / V3 | ***Although living** nearby, he rarely visits.* | Хоча він живе поруч, він рідко заходить. |

*After **having** finished* — не помилка, але *after* уже показує послідовність, тож *After finishing* коротше й природніше.

### With + іменник + -ing / V3

Коли підмети **різні**, але зворот хочеться зберегти, допомагає *with*: ***With** prices **rising**, many people are saving less.* — Оскільки ціни ростуть, багато людей заощаджують менше. ***With** the work **finished**, we went home.* — Коли робота була закінчена, ми пішли додому. Тут підмет звороту (*prices*, *the work*) названо явно, тому «висячого» звороту немає.

### Висячий зворот (dangling participle)

Читач **завжди** «приписує» дію звороту підмету головного речення. Якщо підмет інший, виходить комічно або нелогічно:

- ~~*Walking into the room, the lights went out.*~~ — ніби світло зайшло в кімнату.
  ✓ *Walking into the room, **I** noticed that the lights had gone out.* / ✓ *As I walked into the room, the lights went out.*
- ~~*Having finished the essay, the TV was switched on.*~~ — ніби телевізор написав есе.
  ✓ *Having finished the essay, **I** switched on the TV.*
- ~~*Being a rainy day, I took an umbrella.*~~ — «я» не є дощовим днем.
  ✓ *As it was a rainy day, I took an umbrella.* / ✓ *It being a rainy day, I took an umbrella.* (книжно)

> [!diagram] Висячий зворот і як його полагодити
> ```yaml
> layout: compare
> columns: { bad: "висячий зворот", good: "виправлено" }
> nodes:
>   - { id: b1, col: bad, label: "хто прийшов?", text: "Arriving late, the meeting had already started.", tone: red }
>   - { id: b2, col: bad, label: "хто перевірив?", text: "Having checked the data, the results were published.", tone: red }
>   - { id: g1, col: good, label: "підмет = той, хто прийшов", text: "Arriving late, I found that the meeting had already started.", tone: green }
>   - { id: g2, col: good, label: "повне підрядне", text: "After the data had been checked, the results were published.", tone: green }
> steps:
>   - { show: [b1, b2], note: "Ліворуч підмети головних речень — the meeting і the results. Виходить, що зустріч запізнилася, а результати самі перевірили дані." }
>   - { show: g1, note: "Спосіб 1: зробити підметом того, хто виконує дію звороту: Arriving late, I found…" }
>   - { show: g2, note: "Спосіб 2: повернути повне підрядне з власним підметом: After the data had been checked…" }
> ```

**Виняток — сталі вирази.** Деякі звороти давно стали «звʼязками» і стосуються мовця, а не підмета, тож висячими не вважаються: ***Generally speaking**, prices are lower in the east.* · ***Judging by** the reviews, the film is worth seeing.* · ***Given** the time, we should leave.* · ***Considering** his age, he's remarkably fit.* · ***Assuming** the train is on time, we'll arrive at six.* · ***Taking everything into account**, the plan is sensible.*

> [!quiz] Перевір себе: які речення правильні? Обери всі.
> level: C1 · type: multi · id: en-c1-participles-q03
> - [x] Judging by the reviews, the film is worth seeing.
> - [ ] Having eaten breakfast, the bus arrived.
> - [x] Generally speaking, flats are cheaper outside the city centre.
> - [ ] Being a rainy day, I took an umbrella.
> - [x] With prices rising, many families are cutting back.
>
> **Пояснення:** *Judging by* і *Generally speaking* — сталі вирази, що стосуються мовця, тому підмет не мусить збігатися. *With prices rising* — підмет звороту названо (*prices*). А от автобус не снідав, і «я» не є дощовим днем — це висячі звороти: *After I had eaten breakfast, the bus arrived* / *As it was a rainy day…*

### IELTS: де звороти дають бал

- **Grammatical Range & Accuracy.** Публічні дескриптори IELTS (переказ своїми словами): Band 6 — суміш простих і складних речень; Band 7 — **різноманітні складні структури** і багато речень без помилок; Band 8 — широкий діапазон структур, помилки рідкісні. Зворот — готова «складна структура», але **висячий** зворот — помилка точності, яка знімає бал.
- **Writing Task 1** — зворот результату й послідовності: *The figure rose to 40 % in 2015, **before falling** to 25 % by 2020.* · *Coal accounted for half of the total, **making** it the largest source.* · ***Starting** at 20 %, the proportion doubled over the decade.*
- **Writing Task 2** — вступ до власної позиції: ***Having considered** both views, I would argue that…* · ***Given** the cost of housing, it is unsurprising that…*
- **Reading** — зворот ховає підмет. Спитай себе: хто виконує дію звороту? Відповідь — підмет головного речення.
- **Не перестарайся:** один зворот на речення — досить. Ланцюжок *Having…, being…, considering…* важко читати.

## Приклади

- **Having spent** ten years abroad, she found it hard to settle back home. — Проживши десять років за кордоном, вона ледве звикла знову до дому.
- **Not wanting** to wake the baby, we spoke in whispers. — Не бажаючи будити малюка, ми говорили пошепки.
- **Asked** about his plans, the minister refused to comment. — Коли міністра спитали про плани, він відмовився коментувати.
- **Located** in the heart of the old town, the hotel is ideal for sightseeing. — Розташований у серці старого міста, готель ідеальний для екскурсій.
- The storm hit the coast overnight, **leaving** thousands without power. — Уночі шторм ударив по узбережжю, і тисячі людей залишилися без світла.
- **Having been rejected** by three publishers, the novel went on to sell millions. — Отримавши відмову від трьох видавців, роман згодом розійшовся мільйонними накладами.
- **While travelling** in Japan, I learned a few words of Japanese. — Подорожуючи Японією, я вивчив кілька японських слів.
- **If stored** properly, the vaccine remains effective for two years. — Якщо правильно зберігати, вакцина залишається ефективною два роки.
- **Considering** how little she practised, she played remarkably well. — Як на те, що вона так мало практикувалася, вона зіграла напрочуд добре.
- **Having said that**, the plan still has a few weaknesses. — Утім, у плану все ж є кілька слабких місць.

## Слова

> [!word] having said that
> ipa: /ˈhæv.ɪŋ ˈsed ðæt/ · pos: phrase · level: C1 · id: en-c1-participles-w01
> uk: утім, а втім, водночас
> example: The hotel was expensive. **Having said that**, the service was excellent. — Готель був дорогий. Утім, обслуговування було чудове.
> note: нейтральний регістр, у мовленні й есе; вводить застереження до щойно сказаного. Синонім — that said.

> [!word] generally speaking
> ipa: /ˈdʒen.ər.əl.i ˈspiː.kɪŋ/ · ipa-us: /ˈdʒen.ɚ.əl.i ˈspiː.kɪŋ/ · pos: phrase · level: C1 · id: en-c1-participles-w02
> uk: загалом кажучи, як правило
> example: **Generally speaking**, older cars use more fuel. — Загалом кажучи, старі автомобілі споживають більше пального.
> note: нейтральний; сталий зворот — висячим не вважається. Корисний для обережних узагальнень в IELTS.

> [!word] broadly speaking
> ipa: /ˈbrɔːd.li ˈspiː.kɪŋ/ · ipa-us: /ˈbrɑːd.li ˈspiː.kɪŋ/ · pos: phrase · level: C1 · id: en-c1-participles-w03
> uk: у загальних рисах, загалом
> example: **Broadly speaking**, the reforms have been a success. — У загальних рисах реформи вдалися.
> note: нейтрально-формальний; ще обережніше за generally speaking — «якщо не вдаватися в деталі».

> [!word] strictly speaking
> ipa: /ˈstrɪkt.li ˈspiː.kɪŋ/ · pos: phrase · level: C1 · id: en-c1-participles-w04
> uk: строго кажучи, власне кажучи
> example: **Strictly speaking**, a tomato is a fruit, not a vegetable. — Строго кажучи, помідор — це фрукт, а не овоч.
> note: нейтральний; уточнює точне значення чи правило.

> [!word] judging by
> ipa: /ˈdʒʌdʒ.ɪŋ baɪ/ · pos: phrase · level: C1 · id: en-c1-participles-w05
> uk: судячи з
> example: **Judging by** the queue, the new café is very popular. — Судячи з черги, нова кавʼярня дуже популярна.
> note: нейтральний; також judging from. Висновок з побаченого — зручно для hedging.

> [!word] considering
> ipa: /kənˈsɪd.ər.ɪŋ/ · ipa-us: /kənˈsɪd.ɚ.ɪŋ/ · pos: prep · level: C1 · id: en-c1-participles-w06
> uk: зважаючи на; як на
> example: She did well, **considering** she had only two days to prepare. — Вона впоралася добре, як на те, що мала лише два дні на підготовку.
> note: нейтральний; + іменник, + (that) + речення, а в розмові й у кінці речення: He did well, considering.

> [!word] assuming
> ipa: /əˈsjuː.mɪŋ/ · ipa-us: /əˈsuː.mɪŋ/ · pos: conj · level: C1 · id: en-c1-participles-w07
> uk: якщо припустити, що; за умови, що
> example: **Assuming** the weather stays fine, we'll have lunch outside. — Якщо погода не зіпсується, пообідаємо надворі.
> note: нейтральний; також assuming that. Умова, яку мовець вважає ймовірною.

> [!word] with this in mind
> ipa: /wɪð ˈðɪs ɪn ˈmaɪnd/ · pos: phrase · level: C1 · id: en-c1-participles-w08
> uk: з огляду на це, зважаючи на це
> example: The town is very hilly. **With this in mind**, bring comfortable shoes. — Місто дуже горбисте. Зважаючи на це, візьміть зручне взуття.
> note: нейтрально-формальний; звʼязка-підсумок замість канцелярського «беручи до уваги вищевикладене». Також bearing this in mind.

> [!word] bearing in mind
> ipa: /ˈbeə.rɪŋ ɪn ˈmaɪnd/ · ipa-us: /ˈber.ɪŋ ɪn ˈmaɪnd/ · pos: phrase · level: C1 · id: en-c1-participles-w09
> uk: зважаючи на, з огляду на
> example: **Bearing in mind** the traffic, we should leave now. — З огляду на затори, нам слід вирушати зараз.
> note: нейтральний; + іменник або that + речення. Українське «беручи до уваги» — частіше саме так, а не taking into consideration.

> [!word] all things considered
> ipa: /ˈɔːl θɪŋz kənˈsɪd.əd/ · ipa-us: /ˈɑːl θɪŋz kənˈsɪd.ɚd/ · pos: phrase · level: C1 · id: en-c1-participles-w10
> uk: зрештою, з огляду на все
> example: **All things considered**, it was a successful year. — З огляду на все, рік був успішний.
> note: нейтральний; підсумок після зважування плюсів і мінусів. У висновку есе — taking everything into account (формальніше).

> [!word] upon
> ipa: /əˈpɒn/ · ipa-us: /əˈpɑːn/ · pos: prep · level: C1 · id: en-c1-participles-w11
> uk: щойно, після (формально); на
> example: **Upon** receiving your payment, we will send the tickets. — Щойно отримаємо оплату, ми надішлемо квитки.
> note: формальний варіант on; upon + -ing / іменник = «щойно»: upon arrival — після прибуття. У розмові — on, when, as soon as.

> [!word] dangling participle
> ipa: /ˈdæŋ.ɡlɪŋ pɑːˈtɪs.ɪ.pəl/ · ipa-us: /ˈdæŋ.ɡlɪŋ ˈpɑːr.t̬ə.sɪ.pəl/ · pos: noun · level: C1 · id: en-c1-participles-w12
> uk: висячий дієприкметниковий зворот (граматична помилка)
> example: "Walking home, the rain started" contains a **dangling participle**. — У реченні «Walking home, the rain started» — висячий зворот.
> note: термін граматики; також misrelated participle. Наголос у participle (UK) — paTIciple або PARticiple; обидва варіанти поширені.

## Слухаємо

> [!listen] Що ти почув?
> level: C1 · type: choice · id: en-c1-participles-l01
> audio: Having missed the last train, we had to take a taxi.
> - [x] Having missed the last train, we had to take a taxi.
> - [ ] Missing the last train, we had to take a taxi.
> - [ ] Having missed the last bus, we had to take a taxi.
>
> **Пояснення:** кінцеве [t] у *missed* майже зникає перед *the*, тож орієнтуйся на *having* на початку: саме воно показує, що дія сталася раніше. *Missing* звучало б як [ˈmɪsɪŋ] — без *having*.

> [!listen] Надрукуй почуте
> level: C1 · type: dictation · id: en-c1-participles-l02
> audio: Built in the twelfth century, the castle attracts thousands of visitors every year.

> [!listen] IELTS Listening · Part 4: що зʼясували дослідники?
> level: C1 · type: answer · tags: ielts · id: en-c1-participles-l03
> audio: Having analysed energy data from two thousand homes, the researchers found that smart meters reduced electricity use by about twelve percent. Faced with rising bills, however, many families had already started saving energy before the meters were installed.
> - [x] Розумні лічильники скоротили споживання електрики приблизно на 12 %
> - [ ] Сімʼї почали економити лише після встановлення лічильників
> - [ ] Рахунки за електрику зменшилися на 12 %
> - [ ] Дослідники самі встановили лічильники у двох тисячах будинків
>
> **Пояснення:** *Having analysed…, the researchers found that smart meters reduced electricity use by about twelve percent* — пряма відповідь. *Faced with rising bills* — зворот причини: через зростання рахунків сімʼї почали економити **ще до** (*already… before*) встановлення. Дослідники **аналізували дані**, а не встановлювали лічильники.

> [!listen] IELTS Listening · Part 2: яка частина музею працює до восьмої?
> level: C1 · type: answer · tags: ielts · id: en-c1-participles-l04
> audio: When asked about tickets, staff will direct you to the main desk. The east wing, having been restored last year, now stays open until eight, whereas the rest of the museum closes at six.
> - [ ] Головна каса
> - [x] Східне крило
> - [ ] Увесь музей
> - [ ] Жодна — музей закривається о шостій
>
> **Пояснення:** *The east wing, having been restored last year, now stays open until eight* — зворот *having been restored* вставлено посередині, і він легко відволікає увагу. *Whereas the rest of the museum closes at six* — решта зачиняється о шостій.

## Вимова

> [!speak] Скажи вголос
> level: C1 · id: en-c1-participles-s01
> text: Having finished the report, she went home early.
> ipa: /ˈhæv.ɪŋ ˈfɪn.ɪʃt ðə rɪˈpɔːt ʃi ˈwent həʊm ˈɜː.li/
> tip: finished — кінцеве [ʃt], одним складом після fin-. Після звороту — коротка пауза з легким підйомом тону, наче «продовження буде».
> uk: Закінчивши звіт, вона пішла додому раніше.

> [!speak] Скажи вголос
> level: C1 · id: en-c1-participles-s02
> text: Generally speaking, people underestimate how long things take.
> ipa: /ˈdʒen.ər.əl.i ˈspiː.kɪŋ ˈpiː.pəl ˌʌn.dərˈes.tɪ.meɪt haʊ ˈlɒŋ ˈθɪŋz teɪk/
> tip: generally — 3–4 склади, наголос на першому [ДЖЕН]; underestimate — головний наголос на -ES-. Після speaking — пауза.
> uk: Загалом кажучи, люди недооцінюють, скільки часу забирають справи.

> [!speak] IELTS Speaking · Part 2 — почни розповідь зі звороту
> level: C1 · id: en-c1-participles-s03
> text: Having grown up in a small town, I've always loved quiet places.
> ipa: /ˈhæv.ɪŋ ˈɡrəʊn ˈʌp ɪn ə ˈsmɔːl taʊn aɪv ˈɔːl.weɪz ˈlʌvd ˈkwaɪ.ət ˈpleɪ.sɪz/
> tip: тема картки — «Describe a place where you like to relax». grown up — звʼязуй: [ɡrəʊ-nʌp]. Зворот одразу показує причину — це плюс за Fluency & Coherence.
> uk: Оскільки я виріс у маленькому місті, я завжди любив тихі місця.

> [!speak] IELTS Speaking · Part 3 — обережний прогноз
> level: C1 · id: en-c1-participles-s04
> text: Judging by recent trends, more people will be working from home in ten years.
> ipa: /ˈdʒʌdʒ.ɪŋ baɪ ˈriː.sənt ˈtrendz mɔː ˈpiː.pəl wɪl bi ˈwɜː.kɪŋ frəm ˈhəʊm ɪn ˈten ˈjɪəz/
> tip: питання Part 3 — «How will working life change in the future?». judging — два [dʒ], не [ж]; trends — кінцеве [dz].
> uk: Судячи з нинішніх тенденцій, через десять років більше людей працюватимуть з дому.

## Типові помилки українців

> [!pitfall] Висячий зворот — і в українській теж помилка
> Українська норма та сама: дієприслівниковий зворот стосується підмета речення. ~~«Підʼїжджаючи до станції, у мене злетів капелюх»~~ — помилка в обох мовах. Перевіряй: **хто** виконує дію звороту? Саме він має бути підметом головного речення: ~~*Arriving at the airport, my phone died*~~ → *Arriving at the airport, **I** realised my phone had died* / *When I arrived at the airport, my phone died.*

> [!pitfall] «Написаний» і «написавши» — V3 і -ing
> В українській «написаний» (пасив) і «написавши» (актив) звучать по-різному, а в англійській учні їх плутають: ~~*Writing in 1949, the novel…*~~ (ніби роман сам писав) → ***Written** in 1949, the novel…*. Підмет зазнає дії → **V3**; підмет сам діє → **-ing / having + V3**.

> [!pitfall] «Беручи до уваги вищевикладене…» — канцелярит у звороті
> Ланцюжки на кшталт «Беручи до уваги вищевикладене та враховуючи зазначене…» в англійську перекладають дослівно: ~~*Taking into consideration the above-mentioned and considering the stated…*~~. Звучить бюрократично і важко. Англійський академічний стиль — **один** короткий зворот: ***Given this**, …* · ***With this in mind**, …* · ***Bearing this in mind**, …*

> [!pitfall] «After finished», «before to leave»
> Після прийменників *after, before, since, on, by* — тільки **-ing**: ~~*After finished the course*~~ → ***After finishing** the course* (або *After I finished…*); ~~*Before to leave*~~ → ***Before leaving***. Виняток — сполучники *when, if, once, unless, until* + V3 у пасиві: *when asked, if left, once opened*.

## Практика

> [!quiz] Обери форму звороту
> level: C1 · type: fill · bank · id: en-c1-participles-q04 · bank: Writing, Having written
>
> ```text fill
> [[Feeling]] tired after the long flight, I went straight to bed.
> [[Having lost]] his keys twice that week, he decided to get a spare set.
> [[Made]] from recycled plastic, the bags are fully biodegradable.
> [[Having been told]] the news, she called her parents immediately.
> ```
>
> **Пояснення:** стан одночасно з головною дією → *Feeling*; дія завершилася раніше (двічі за тиждень) → *Having lost*; пакети **зробили** → пасив *Made*; їй **сказали** раніше → *Having been told*. *Writing / Having written* — пастки з неправильним значенням.

> [!quiz] Яке значення звороту: «Used correctly, this app can save you hours every week.»
> level: C1 · id: en-c1-participles-q05
> - [ ] Час: коли застосунок використали
> - [x] Умова: якщо користуватися застосунком правильно
> - [ ] Причина: тому що застосунком користувалися правильно
> - [ ] Результат: тож застосунок використали правильно
>
> **Пояснення:** *Used correctly* = *If it is used correctly*. V3 на початку речення часто має значення **умови**, особливо з теперішнім часом і *can / will* у головному реченні.

> [!quiz] Склади речення: «Проживши за кордоном десять років, вона говорить трьома мовами»
> level: C1 · type: order · id: en-c1-participles-q06
>
> ```text order
> Having lived
> abroad for ten years,
> she speaks
> three languages.
> Living abroad // ✗
> ```
>
> **Пояснення:** десять років життя за кордоном — **до** теперішнього моменту, і саме вони пояснюють результат → *having + V3*. *Living abroad* означало б, що вона живе там і зараз.

> [!quiz] Перепиши підрядне як зворот
> level: C1 · type: fill · id: en-c1-participles-q07
>
> ```text fill
> When I opened the drawer, I found an old photo. → [[Opening]] the drawer, I found an old photo.
> Because he didn't know the address, he called a taxi. → [[Not]] knowing the address, he called a taxi.
> If it is stored properly, the cheese keeps for months. → [[Stored]] properly, the cheese keeps for months.
> After she had graduated, she joined a law firm. → [[Having]] graduated, she joined a law firm.
> ```
>
> **Пояснення:** час → *-ing*; заперечення → *Not* перед зворотом; пасивна умова → *V3*; дія раніше → *Having graduated*. *After graduated* — неможливо: після *after* лише *graduating*.

> [!quiz] Як найкраще виправити речення «Walking into the office, the smell of coffee hit me»?
> level: C1 · id: en-c1-participles-q08
> - [ ] Walking into the office, the coffee smelled strongly.
> - [x] As I walked into the office, the smell of coffee hit me.
> - [ ] Having walked into the office, the smell of coffee hit me.
> - [ ] Walked into the office, the smell of coffee hit me.
>
> **Пояснення:** у вихідному реченні запах «заходить в офіс». Найпростіше — повернути повне підрядне з підметом *I*. *Having walked* лишає ту саму проблему, а *Walked* — ще й пасив.

> [!quiz] «Якщо інфекцію не лікувати, вона може поширитися». Обери варіант.
> level: C1 · id: en-c1-participles-q09
> - [ ] If leaving untreated, the infection can spread.
> - [x] If left untreated, the infection can spread.
> - [ ] If having left untreated, the infection can spread.
> - [ ] If untreating, the infection can spread.
>
> **Пояснення:** інфекцію **залишають** без лікування — пасив → *if + V3*: *If left untreated*. Це скорочення від *If it is left untreated*. Так пишуть у медичних текстах та інструкціях.

> [!quiz] Склади речення про графік: «Ціни різко зросли, змусивши багато сімей скоротити витрати»
> level: C1 · type: order · id: en-c1-participles-q10
>
> ```text order
> Prices rose sharply,
> forcing many families
> to cut their spending.
> and forced // ✗
> ```
>
> **Пояснення:** зворот **результату** стоїть після головного речення через кому: *…, forcing many families to…*. Варіант з *and forced* теж існує (*Prices rose sharply and forced many families to…*), але це вже два дієслова-присудки, а не зворот, і кома перед *and* тут зайва.

> [!quiz] Які речення правильні? Обери всі.
> level: C1 · type: multi · id: en-c1-participles-q11
> - [x] Once opened, the jar should be kept in the fridge.
> - [ ] Once opening, the jar should be kept in the fridge.
> - [x] While waiting for the results, she tried to stay calm.
> - [x] On arriving at the airport, we went straight to check-in.
> - [ ] After finished the exam, I went for a walk.
>
> **Пояснення:** *once + V3* (банку відкривають — пасив) ✓; *while + -ing* ✓; *on + -ing* = «щойно» ✓. *Once opening* — банка не відкриває себе сама; *after finished* — після *after* потрібне *finishing*.

### У форматі IELTS

> [!quiz] IELTS Writing Task 1 · Яке речення найкраще описує лінійний графік?
> level: C1 · tags: ielts · id: en-c1-participles-q12
>
> *Графік: кількість відвідувачів музею, 2010–2020. Стабільне зростання до 2019 року (пік — 2 млн), різке падіння у 2020-му.*
>
> - [ ] The number of visitors rose. It reached 2 million in 2019. Then it fell in 2020.
> - [x] Visitor numbers rose steadily, reaching a peak of 2 million in 2019, before falling sharply in 2020.
> - [ ] Rising steadily, 2019 saw a peak of 2 million visitors, falling sharply in 2020.
> - [ ] Visitor numbers rose steadily, reached a peak of 2 million in 2019, fell sharply in 2020.
>
> **Пояснення:** друге речення поєднує три етапи двома зворотами (*reaching…, before falling…*), і підмет усюди один — *visitor numbers*. Перше — набір простих речень (≈ Band 6). Третє — висячий зворот: *2019* не «зростав». Четверте — три дієслова через кому без сполучника (comma splice).

> [!quiz] IELTS Writing Task 1 · Поєднай речення зворотом
> level: C1 · type: fill · bank · tags: ielts · id: en-c1-participles-q13 · bank: leaded, accounted
>
> ```text fill
> Sales fell in 2009. This led to hundreds of job losses. → Sales fell in 2009, [[leading]] to hundreds of job losses.
> Coal produced half of the electricity. This made it the main source. → Coal produced half of the electricity, [[making]] it the main source.
> The figure started at 20 %. It doubled over the decade. → [[Starting]] at 20 %, the figure doubled over the decade.
> Wind power grew rapidly. It made up a third of the total by 2020. → Wind power grew rapidly, [[accounting]] for a third of the total by 2020.
> ```
>
> **Пояснення:** другі речення-наслідки стають зворотом результату з **-ing**: *leading to, making it*. *Starting at* — зворот на початку з тим самим підметом (*the figure*). *Accounting for* — «становлячи». *Leaded* і *accounted* — неправильні форми.

> [!quiz] IELTS Writing Task 2 · Підніми Band-6 речення до Band 7–8
> level: C1 · tags: ielts · id: en-c1-participles-q14
>
> *Band 6: «Because the government wanted to reduce traffic, it introduced a congestion charge, and this made the air cleaner.»*
>
> - [ ] Wanting to reduce traffic, a congestion charge was introduced, making the air cleaner.
> - [x] Seeking to reduce traffic, the government introduced a congestion charge, which led to cleaner air.
> - [ ] Having wanted to reduce traffic, the government introducing a congestion charge, the air became cleaner.
> - [ ] Because wanting to reduce traffic, the government introduced a congestion charge and made the air cleaner.
>
> **Пояснення:** правильний варіант має зворот із **тим самим підметом** (*the government*), точніше дієслово *seeking* і звʼязку *which led to*. Перший — висячий зворот (податок сам «хотів»). Третій — речення без головного дієслова. Четвертий — ~~*because wanting*~~ (*because* не скорочується до звороту).

### IELTS Reading — True / False / Not Given

*Discovered in 1799 by French soldiers rebuilding a fort near the town of Rashid (Rosetta), the stone soon attracted the attention of scholars. Inscribed in 196 BC, it carries the same decree in three scripts: hieroglyphic, Demotic and Ancient Greek. Handed over to the British after the French surrender in Egypt in 1801, it was shipped to London and has been on display in the British Museum almost continuously since 1802. Building on earlier work by the English scientist Thomas Young, the French scholar Jean-François Champollion announced in 1822 that he had deciphered the hieroglyphs, having compared the Greek text with the Egyptian signs.*

> [!quiz] IELTS Reading · True / False / Not Given: «The stone was found by archaeologists searching for ancient texts.»
> level: C1 · tags: ielts · id: en-c1-participles-q15
> - [ ] True
> - [x] False
> - [ ] Not Given
>
> **Пояснення:** зворот *Discovered in 1799 by French soldiers rebuilding a fort* прямо каже, хто знайшов камінь: **солдати**, які **відбудовували форт**, а не археологи, що шукали тексти → **False**.

> [!quiz] IELTS Reading · True / False / Not Given: «Champollion's success owed nothing to earlier researchers.»
> level: C1 · tags: ielts · id: en-c1-participles-q16
> - [ ] True
> - [x] False
> - [ ] Not Given
>
> **Пояснення:** *Building on earlier work by … Thomas Young* — Шампольйон **спирався** на попередню роботу. Твердження суперечить тексту → **False**. Зверни увагу: ключ — у звороті на початку речення, а не в головній частині.

> [!quiz] IELTS Reading · True / False / Not Given: «The stone was damaged on its way to London.»
> level: C1 · tags: ielts · id: en-c1-participles-q17
> - [ ] True
> - [ ] False
> - [x] Not Given
>
> **Пояснення:** текст каже лише, що камінь *was shipped to London*, і нічого — про його стан під час перевезення. Інформації немає → **Not Given**.

> [!tip] IELTS Writing — спробуй сам
> **Task 1 (150+ слів).** Опиши будь-який графік зі змінами за кілька років і вжий щонайменше три звороти: ***Starting** at…*, *…, **reaching** a peak of…*, *…, **before falling** to…*, *…, **accounting for**…*. Потім перевір кожен: чи підмет звороту — той самий, що в головному реченні?

## Фішки

> [!reel] 🎩 Капелюх, що злетів сам
> Найвідоміший висячий зворот — у Чехова, «Жалобная книга» (1884): пасажир записує, що, підʼїжджаючи до станції, у нього злетів капелюх. Відтоді фраза — шкільний приклад того, як не можна будувати зворот. В англійській правило таке саме.

> [!reel] 📜 Participle — «учасник» двох світів
> Латинське participium — від particeps, «той, хто бере участь». Граматисти назвали так форму, що «бере участь» і в дієслові (має час і стан), і в прикметнику (описує іменник). Це калька з грецького терміна metochē.

> [!reel] 🥫 Мова етикеток
> Подивись на упаковку їжі: «Once opened, keep refrigerated and use within 3 days». Етикетки й інструкції люблять звороти з V3 — коротко й без зайвих підметів. Так само в медицині: «If left untreated…».

## Джерела та що почитати

- 🟢 M. Hewings — *Advanced Grammar in Use* (Cambridge): розділи про participle clauses (-ing, -ed, having + V3) і звороти після сполучників.
- 🟢 [Cambridge Dictionary — English Grammar Today](https://dictionary.cambridge.org/grammar/british-grammar/) — *Clauses*, *-ing forms*, *Participle clauses* (пошук на сторінці граматики).
- 🟡 M. Swan — *Practical English Usage* (Oxford): participle clauses, misrelated (dangling) participles і сталі вирази на кшталт *generally speaking*.
- 🟡 R. Murphy — *English Grammar in Use* (Cambridge): -ing and -ed clauses — база перед C1.
- 🟡 [IELTS — офіційний сайт](https://ielts.org) — публічні band descriptors Writing (Grammatical Range & Accuracy).

> [!important] Підсумок
> - Зворот = підрядне без сполучника й підмета: ***Arriving** at the station, she called me.* Підмет звороту = підмет головного речення.
> - **-ing** — одночасно, активно; **having + V3** — раніше; **V3** — пасив; **having been + V3** — пасив раніше; заперечення — ***Not** having…*.
> - Сполучник для ясності: *after / before / while / on + -ing*; *when / if / once / unless + V3* (*if left untreated*).
> - Висячий зворот — помилка; сталі вирази (*generally speaking, judging by, given, considering, assuming*) — ні.
> - IELTS: *…, **reaching** a peak of…*, *…, **before falling** to…* у Task 1; один зворот на речення, без канцеляриту.
