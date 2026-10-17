---
title: Пасивний стан — Present і Past
order: 317
id: en-b1-passive
level: B1
icon: px:gear
tags: [english, b1, grammar, passive, present-simple-passive, past-simple-passive, ielts]
prerequisites: ["[[English - A2 - 02. Past Simple — правильні й неправильні дієслова]]", "[[English - A2 - 14. Present Perfect — досвід, ever, never]]"]
estimatedMinutes: 45
---

# Пасивний стан — Present і Past

> [!success] Після цієї теми ти зможеш
> - будувати пасив у Present і Past Simple: **is made**, **are grown**, **was built**, **were arrested**;
> - вирішувати, коли пасив природніший за активний стан, і коли додавати **by…**;
> - питати й відповідати в пасиві: *When **was** it **built**? Where **were** you **born**?*;
> - читати новини й описи процесів, де пасив на кожному кроці;
> - описати процес у IELTS Writing Task 1 (*First, the beans **are picked**…*).

## Передбач

> [!quiz] Як сказати «Цей міст збудували в 1890 році» (невідомо, хто саме)?
> level: B1 · id: en-b1-passive-q01
> - [ ] This bridge built in 1890.
> - [x] This bridge was built in 1890.
> - [ ] This bridge is built in 1890.
> - [ ] They was built this bridge in 1890.
>
> **Пояснення:** нам важливий міст, а не будівельники → пасив: **was** (минуле від *be*) + **built** (V3). Без *was* речення означало б «міст сам щось збудував».

## Простими словами

Українською ми часто кажемо «міст **збудували**», «тут **розмовляють** англійською», «його **заарештовано**» — і не називаємо, хто це зробив. Англійська для цього має **пасивний стан** (passive voice): **be + V3**.

- **Active** (активний): хто робить → що робить → з чим. *Picasso **painted** Guernica.*
- **Passive** (пасивний): з чим щось роблять → що з ним роблять → (ким). *Guernica **was painted** by Picasso.*

Пасив обирають, коли **важливіше те, що сталося, ніж хто це зробив**: виконавець невідомий (*My bike was stolen*), очевидний (*He was arrested* — звісно, поліцією), неважливий (*Rice is grown in Asia*) — або коли ми хочемо почати речення з відомої теми.

> [!diagram] Active → passive за чотири кроки
> ```yaml
> layout: flow
> nodes:
>   - { id: subj, label: "підмет (хто)", text: "Someone", tone: gray, icon: "px:person" }
>   - { id: verb, label: "дієслово", text: "stole", tone: blue }
>   - { id: obj, label: "обʼєкт (що)", text: "my bike.", tone: violet, icon: "px:box" }
> steps:
>   - { focus: [subj, verb, obj], note: "Активне речення: Someone stole my bike. Хто вкрав — невідомо, і це не головне." }
>   - { move: { from: obj, to: subj, value: "My bike" }, set: { subj: "My bike", obj: "—" }, note: "Крок 1. Обʼєкт стає підметом: тепер речення про велосипед." }
>   - { set: { verb: "was stolen" }, focus: verb, note: "Крок 2. Дієслово → be у тому самому часі + V3: stole (Past) → was stolen." }
>   - { set: { obj: "(by someone)" }, focus: obj, note: "Крок 3. Виконавець — через by. Але «by someone» нічого не каже, тож його просто викидаємо." }
>   - { set: { obj: "" }, focus: [subj, verb], note: "Крок 4. Результат: My bike was stolen. Коротко й по суті — так і пишуть у новинах і поліцейських звітах." }
> ```

## Пояснення

### Форма: be + V3

Час показує лише **be**; головне дієслово завжди у формі **V3** (past participle: *made, built, written, invented*).

| | Present Simple Passive | Past Simple Passive |
|---|---|---|
| **+** | It **is made** in Italy. · They **are made** in Italy. | It **was built** in 1890. · They **were built** in 1890. |
| **−** | It **isn't made** in China. | They **weren't invited**. |
| **?** | **Is** English **spoken** here? | **When was** the bridge **built**? |
| **wh-** | **Where are** these phones **produced**? | **Who was** the telephone **invented by**? |

> [!tip] Where were you born?
> «Народитися» англійською — завжди пасив: ***I was born*** in Lviv. Не ~~*I born*~~ і не ~~*I am born*~~ про себе дорослого.

> [!quiz] Перевір себе: обери форму
> level: B1 · id: en-b1-passive-q02
>
> Millions of cups of tea ___ in the UK every day.
>
> - [ ] drink
> - [x] are drunk
> - [ ] is drunk
> - [ ] are drink
>
> **Пояснення:** чашки чаю не п'ють самі — їх п'ють люди → пасив. *Cups* — множина → **are** + V3 **drunk** (drink → drank → drunk).

### Коли пасив природніший

| Ситуація | Приклад |
|---|---|
| виконавець невідомий | My wallet **was stolen** on the bus. |
| виконавець очевидний | The thief **was arrested** last night. (поліцією, звісно) |
| виконавець неважливий | Coffee **is grown** in Brazil and Vietnam. |
| процеси й інструкції | The milk **is heated** to 72 °C. |
| новини, офіційні тексти | Three people **were injured** in the accident. |
| річ — тема розмови | This song is great. It **was written** by a 17-year-old. |

### By + виконавець

Додаємо **by…**, лише коли виконавець — **нова й важлива** інформація:

- *Harry Potter* **was written by** J. K. Rowling. — «Гаррі Поттера» написала Дж. К. Ролінґ.
- The building **was designed by** a Ukrainian architect. — Будівлю спроєктував український архітектор.

Не пиши *by people*, *by someone*, *by them*: *English is spoken in many countries* ~~*by people*~~.

> [!quiz] Перевір себе: потрібне by чи ні?
> level: B1 · type: multi · id: en-b1-passive-q03
> - [x] The Mona Lisa was painted by Leonardo da Vinci.
> - [ ] Bread is sold by people in bakeries.
> - [x] My phone was stolen yesterday.
> - [ ] The robber was arrested by the police officers who arrested him.
> - [x] The telephone was invented by Alexander Graham Bell.
>
> **Пояснення:** **by** — коли виконавець важливий (Леонардо, Белл). *By people* і повтор очевидного — зайві.

### Дієслова, які не бувають пасивними

Пасив можливий лише для дієслів з **обʼєктом** (*build a house → a house is built*). Дієслова без обʼєкта — **happen, arrive, die, go, come, seem, sleep** — пасиву не мають:

- What **happened**? ~~*What was happened?*~~
- The plane **arrived** late. ~~*The plane was arrived late.*~~

### Опис процесу — пасив у дії

> [!diagram] Як роблять шоколад — процес у пасиві
> ```yaml
> layout: flow
> nodes:
>   - { id: s1, label: "1", text: "Cocoa beans are picked by hand.", tone: green, icon: "px:sprout" }
>   - { id: s2, label: "2", text: "They are dried in the sun.", tone: yellow, icon: "px:sun" }
>   - { id: s3, label: "3", text: "The beans are transported to factories.", tone: blue, icon: "px:truck" }
>   - { id: s4, label: "4", text: "They are roasted and ground.", tone: orange, icon: "px:fire" }
>   - { id: s5, label: "5", text: "Sugar and milk are added.", tone: pink }
> steps:
>   - { show: s1, note: "У процесі важливо, ЩО відбувається з сировиною, а не хто працює. Тому — пасив: are picked." }
>   - { show: s2, note: "They = the beans. Present Simple Passive — бо процес повторюється завжди." }
>   - { show: s3, note: "Transport — перевозити; are transported." }
>   - { show: s4, note: "Два дієслова з одним be: are roasted and ground (grind → ground)." }
>   - { show: s5, note: "Так само пишуть IELTS Writing Task 1 — «процес»: First…, then…, after that…, finally… + пасив." }
> ```

## Приклади

- English **is spoken** in more than 50 countries. — Англійською розмовляють у понад 50 країнах.
- These trainers **are made** in Vietnam. — Ці кросівки виготовляють у Вʼєтнамі.
- I **was born** in 2001. — Я народився у 2001 році.
- The museum **was opened** in 1905. — Музей відкрили у 1905 році.
- Penicillin **was discovered** by Alexander Fleming. — Пеніцилін відкрив Александер Флемінґ.
- Two men **were arrested** after the robbery. — Після пограбування затримали двох чоловіків.
- **Is** breakfast **included** in the price? — Сніданок входить у вартість?
- The letters **are sorted** and then **delivered** the next morning. — Листи сортують, а наступного ранку доставляють.
- The old town **was** badly **damaged** in the war. — Старе місто сильно пошкодили під час війни.
- This book **was translated** into forty languages. — Цю книжку переклали сорока мовами.

## Слова

> [!word] invent
> ipa: /ɪnˈvent/ · pos: verb · level: B1 · id: en-b1-passive-w01
> uk: винаходити
> example: The light bulb **was invented** in the 19th century. — Лампу розжарювання винайшли в XIX столітті.
> note: invention — винахід; inventor — винахідник.

> [!word] discover
> ipa: /dɪˈskʌv.ə/ · ipa-us: /dɪˈskʌv.ɚ/ · pos: verb · level: B1 · id: en-b1-passive-w02
> uk: відкривати (щось, що вже існувало); виявляти
> example: The planet **was discovered** in 1846. — Цю планету відкрили у 1846 році.
> note: discover — знайти те, що вже було (планета, острів); invent — створити нове (машина).

> [!word] produce
> ipa: /prəˈdʒuːs/ · ipa-us: /prəˈduːs/ · pos: verb · level: B1 · id: en-b1-passive-w03
> uk: виробляти, виготовляти
> example: Most of the world's coffee **is produced** in Brazil. — Більшість кави у світі виробляють у Бразилії.
> note: (noun) produce /ˈprɒdʒ.uːs/ — фермерські продукти; наголос зсувається.

> [!word] design
> ipa: /dɪˈzaɪn/ · pos: verb · level: B1 · id: en-b1-passive-w04
> uk: проєктувати, розробляти; (noun) дизайн, проєкт
> example: The tower **was designed** by Gustave Eiffel's company. — Вежу спроєктувала компанія Ґюстава Ейфеля.
> note: g німе, s читається як /z/: [ді-ЗАЙН].

> [!word] translate
> ipa: /trænzˈleɪt/ · pos: verb · level: B1 · id: en-b1-passive-w05
> uk: перекладати
> example: The novel **was translated** into Ukrainian in 2015. — Роман переклали українською у 2015 році.
> note: translate from Ukrainian into English; translation, translator.

> [!word] deliver
> ipa: /dɪˈlɪv.ə/ · ipa-us: /dɪˈlɪv.ɚ/ · pos: verb · level: B1 · id: en-b1-passive-w06
> uk: доставляти
> example: Parcels **are delivered** twice a day. — Посилки доставляють двічі на день.

> [!word] arrest
> ipa: /əˈrest/ · pos: verb · level: B1 · id: en-b1-passive-w07
> uk: заарештовувати, затримувати; (noun) арешт
> example: The man **was arrested** at the airport. — Чоловіка затримали в аеропорту.
> note: be under arrest — бути заарештованим.

> [!word] destroy
> ipa: /dɪˈstrɔɪ/ · pos: verb · level: B1 · id: en-b1-passive-w08
> uk: руйнувати, знищувати
> example: The castle **was destroyed** by fire in 1700. — Замок знищила пожежа у 1700 році.

> [!word] damage
> ipa: /ˈdæm.ɪdʒ/ · pos: verb · level: B1 · id: en-b1-passive-w09
> uk: пошкоджувати; (noun) шкода, пошкодження
> example: Several cars **were damaged** in the storm. — Під час бурі пошкодило кілька автівок.
> note: damage — частково зіпсувати; destroy — знищити повністю. Іменник незлічуваний: a lot of damage.

> [!word] be made of
> ipa: /bi ˈmeɪd əv/ · pos: phrase · level: B1 · id: en-b1-passive-w10
> uk: бути зробленим з (матеріалу)
> example: This table **is made of** oak. — Цей стіл зроблений з дуба.
> note: made of — матеріал видно (wood, glass); made from — матеріал змінився (paper is made from wood).

> [!word] export
> ipa: /ɪkˈspɔːt/ · ipa-us: /ɪkˈspɔːrt/ · pos: verb · level: B1 · id: en-b1-passive-w11
> uk: експортувати, вивозити
> example: Ukrainian grain **is exported** all over the world. — Українське зерно експортують по всьому світу.
> note: (noun) export /ˈek.spɔːt/ — наголос на першому складі; протилежне — import.

> [!word] process
> ipa: /ˈprəʊ.ses/ · ipa-us: /ˈprɑː.ses/ · pos: noun · level: B1 · id: en-b1-passive-w12
> uk: процес
> example: The diagram shows the **process** of making paper. — Схема показує процес виготовлення паперу.
> note: стандартний початок IELTS Task 1: The diagram shows / illustrates the process of…

> [!word] sort
> ipa: /sɔːt/ · ipa-us: /sɔːrt/ · pos: verb · level: B1 · id: en-b1-passive-w13
> uk: сортувати; (noun) вид, сорт
> example: The rubbish **is sorted** into paper, glass and plastic. — Сміття сортують на папір, скло й пластик.
> note: sort out — розібратися, владнати.

> [!word] transport
> ipa: /trænˈspɔːt/ · ipa-us: /trænˈspɔːrt/ · pos: verb · level: B1 · id: en-b1-passive-w14
> uk: перевозити, транспортувати; (noun) транспорт
> example: The fruit **is transported** by ship. — Фрукти перевозять морем.
> note: (noun) transport /ˈtræn.spɔːt/ — наголос на першому складі; public transport — громадський транспорт (US також transportation).

> [!word] award
> ipa: /əˈwɔːd/ · ipa-us: /əˈwɔːrd/ · pos: noun · level: B1 · id: en-b1-passive-w15
> uk: нагорода, премія; (verb) нагороджувати
> example: She **was awarded** the Nobel Prize in 1911. — Їй присудили Нобелівську премію у 1911 році.
> note: win an award — отримати нагороду; be awarded sth — пасив дуже частий.

## Слухаємо

> [!listen] Що ти почув?
> level: B1 · type: choice · id: en-b1-passive-l01
> audio: The house was built in 1920.
> - [ ] The house is built in 1920.
> - [x] The house was built in 1920.
> - [ ] The house was bought in 1920.

> [!listen] Надрукуй почуте
> level: B1 · type: dictation · id: en-b1-passive-l02
> audio: English is spoken all over the world.

> [!listen] Надрукуй почуте
> level: B1 · type: dictation · id: en-b1-passive-l03
> audio: Two men were arrested last night.

> [!listen] Новини. Що сталося зі старою бібліотекою?
> level: B1 · type: answer · id: en-b1-passive-l04
> audio: And now the local news. The old city library was badly damaged by a fire last night. Nobody was hurt, but hundreds of books were destroyed. The fire was started by an electrical fault. The library will be closed for six months.
> - [ ] Бібліотеку повністю знищено, є постраждалі.
> - [x] Будівлю сильно пошкодила пожежа, сотні книжок згоріли, ніхто не постраждав.
> - [ ] Бібліотеку закрили через проблеми з електрикою, але пожежі не було.
> - [ ] Бібліотеку пограбували вночі.
>
> **Пояснення:** *was badly damaged* — сильно пошкоджена (не знищена); *nobody was hurt* — ніхто не постраждав; *books were destroyed* — книжки знищені. Новини люблять пасив: важливо, що сталося, а не хто.

> [!listen] IELTS Listening, Part 2. Choose the correct answer. What happens to the chocolate after it is tested?
> level: B1 · type: answer · id: en-b1-passive-l05
> audio: Welcome to the factory. Here the cocoa beans are roasted and ground into a paste. Then sugar and milk are added. Every batch is tested by our experts. After that, the chocolate is poured into moulds and cooled, and finally it is wrapped by machines.
> - [ ] Sugar and milk are added.
> - [x] It is put into moulds and cooled.
> - [ ] The beans are roasted.
> - [ ] It is wrapped by hand.
>
> **Пояснення:** *After that, the chocolate is poured into moulds and cooled* — *poured* перефразовано як *put*. Пакують *by machines*, а не вручну — пастка.

## Вимова

> [!speak] Скажи вголос
> level: B1 · id: en-b1-passive-s01
> text: Where were you born?
> ipa: /weə wə juː bɔːn/
> ipa-us: /wer wɚ juː bɔːrn/
> tip: where і were — різні звуки: /weə/ і слабке /wə/; born — довге /ɔː/.

> [!speak] Скажи вголос
> level: B1 · id: en-b1-passive-s02
> text: It was made in Italy.
> ipa: /ɪt wəz meɪd ɪn ˈɪt.əl.i/
> tip: was — слабке /wəz/; made‿in зливаються: [мей-дін].

> [!speak] Скажи вголос
> level: B1 · id: en-b1-passive-s03
> text: The bridge was designed by a famous engineer.
> ipa: /ðə brɪdʒ wəz dɪˈzaɪnd baɪ ə ˈfeɪ.məs ˌen.dʒɪˈnɪə/
> tip: designed — g німе, кінцеве /d/: [ді-ЗАЙНД]; engineer — наголос у кінці: en-gi-NEER.

> [!speak] Скажи вголос
> level: B1 · id: en-b1-passive-s04
> text: Is breakfast included?
> ipa: /ɪz ˈbrek.fəst ɪnˈkluː.dɪd/
> tip: breakfast — [БРЕК-фəст], не «брекфаст»; included — -ed після d вимовляється /ɪd/.

> [!speak] IELTS Speaking, Part 1 — розкажи про своє місто
> level: B1 · id: en-b1-passive-s05
> text: My town was founded in the twelfth century, and it's known for its old churches.
> ipa: /maɪ taʊn wəz ˈfaʊn.dɪd ɪn ðə twelfθ ˈsen.tʃər.i ənd ɪts nəʊn fər ɪts əʊld ˈtʃɜː.tʃɪz/
> tip: Питання — «Tell me about your hometown». was founded і is known — два пасиви в одній відповіді. twelfth — /lfθ/: кінчик язика між зубами.

## Типові помилки українців

> [!pitfall] «The bridge built in 1890»
> Без **be** речення стає активним і безглуздим: «міст збудував…». Пасив = **be + V3**: *The bridge **was built** in 1890.* Українське «збудували» без підмета штовхає пропустити *was*.

> [!pitfall] «What was happened?», «He was died»
> **happen, die, arrive, come, go** не мають обʼєкта, а отже, і пасиву: *What **happened**? He **died** in 1990.* Але «народитися» — навпаки, лише пасив: *I **was born**…*

> [!pitfall] V2 замість V3
> *The window was broke*, *The letter was wrote* — помилка. Після *be* — **третя форма**: *was **broken***, *was **written***, *were **chosen***. Неправильні дієслова доведеться знати всі три форми.

> [!pitfall] «It was made by people», «by someone»
> **By** + очевидний або невідомий виконавець нічого не додає. Пиши *by…* лише тоді, коли це нова й важлива інформація: *It was painted **by Van Gogh***.

## Практика

> [!quiz] Обери правильне речення
> level: B1 · id: en-b1-passive-q04
> - [ ] The pyramids was built about 4,500 years ago.
> - [ ] The pyramids built about 4,500 years ago.
> - [x] The pyramids were built about 4,500 years ago.
> - [ ] The pyramids are built about 4,500 years ago.
>
> **Пояснення:** *pyramids* — множина, давно в минулому → **were** + V3 **built**.

> [!quiz] Постав дієслово в пасив (Present або Past)
> level: B1 · type: fill · id: en-b1-passive-q05
>
> ```text fill
> Paper [[is made]] from wood. (make)
> The first email [[was sent]] in 1971. (send)
> These cars [[are produced]] in Germany. (produce)
> The Harry Potter books [[were written]] by J. K. Rowling. (write)
> ```
>
> **Пояснення:** загальний факт — Present (*is made, are produced*); історія — Past (*was sent, were written*). Однина — *is / was*, множина — *are / were*.

> [!quiz] Постав пасивні питання
> level: B1 · type: fill · bank: did, does · id: en-b1-passive-q06
>
> ```text fill
> When [[was]] the Eiffel Tower built?
> Where [[are]] these phones made?
> [[Is]] English spoken in Malta?
> Who [[was]] penicillin discovered by?
> ```
>
> **Пояснення:** у пасивних питаннях допоміжне — **be** (*was, are, is*), а не *do / did*: *When **was** it built?* — не ~~*When did it built?*~~

> [!quiz] Обери всі правильні речення
> level: B1 · type: multi · id: en-b1-passive-q07
> - [x] My bag was stolen at the station.
> - [ ] The accident was happened at night.
> - [x] Rice is grown in many Asian countries.
> - [ ] The letter was wrote in 1850.
> - [x] I was born in Odesa.
>
> **Пояснення:** *happen* пасиву не має → *The accident happened*. Після *was* — V3: *was **written***.

> [!quiz] Перетвори активне речення на пасивне
> level: B1 · type: fill · id: en-b1-passive-q08
>
> ```text fill
> They clean the rooms every day. → The rooms [[are cleaned]] every day.
> Someone broke the window last night. → The window [[was broken]] last night.
> The police arrested the driver. → The driver [[was arrested]].
> People speak French in Quebec. → French [[is spoken]] in Quebec.
> ```
>
> **Пояснення:** обʼєкт стає підметом, *be* — у тому самому часі, що й активне дієслово, далі V3. *They, someone, the police, people* — очевидні або невідомі, тож *by…* не потрібне.

> [!quiz] Склади речення: «Цей замок збудували в XV столітті»
> level: B1 · type: order · id: en-b1-passive-q09
>
> ```text order
> This castle
> was
> built
> in the 15th century.
> did // ✗
> ```
>
> **Пояснення:** пасив Past Simple: **was + built**. *Did* у пасиві не потрібне.

> [!quiz] Склади питання: «Де ти народився?»
> level: B1 · type: order · id: en-b1-passive-q10
>
> ```text order
> Where
> were
> you
> born?
> did // ✗
> ```
>
> **Пояснення:** *be born* — пасив, тож питання будуємо через **were**: *Where were you born?*

> [!quiz] Яке речення природніше в новинах?
> level: B1 · id: en-b1-passive-q11
> - [ ] Somebody stole a famous painting from the museum last night.
> - [x] A famous painting was stolen from the museum last night.
> - [ ] A famous painting stole from the museum last night.
> - [ ] The museum was stolen a famous painting last night.
>
> **Пояснення:** у новині головне — картина, а злодій невідомий → пасив. Третій варіант без *was* означає «картина вкрала», а четвертий плутає обʼєкт.

> [!quiz] made of чи made from?
> level: B1 · type: fill · bank · id: en-b1-passive-q12
>
> ```text fill
> This ring is made [[of]] gold.
> Wine is made [[from]] grapes.
> The bridge is made [[of]] steel and glass.
> Cheese is made [[from]] milk.
> ```
>
> **Пояснення:** **of** — матеріал лишився тим самим (золото, сталь видно); **from** — сировина змінилася (виноград → вино, молоко → сир).

### У форматі IELTS

> [!quiz] IELTS Writing Task 1 — заверши опис процесу (пасив + звʼязки)
> level: B1 · type: fill · bank: recycle, collecting · tags: ielts · id: en-b1-passive-q13
>
> *The diagram shows how glass bottles are recycled.*
>
> ```text fill
> First, the used bottles [[are collected]] from special bins.
> Then they [[are taken]] to a recycling plant, where they are sorted by colour.
> After that, the glass [[is crushed]] and melted.
> Finally, new bottles [[are made]] and sent to shops.
> ```
>
> **Пояснення:** у Task 1 «процес» майже кожне речення — Present Simple Passive (*are collected, are taken, is crushed, are made*) плюс звʼязки **First → Then → After that → Finally**. Активні форми (*recycle, collecting*) тут не підходять.

> [!quiz] IELTS Reading — True, False or Not Given?
> level: B1 · tags: ielts · id: en-b1-passive-q14
>
> *The first modern Olympic Games were held in Athens in 1896. Around 240 athletes from 14 countries took part, and all of them were men. Women were allowed to compete for the first time four years later, in Paris.*
>
> **Statement:** *The 1896 Games were watched by more than 50,000 people.*
>
> - [ ] True
> - [ ] False
> - [x] Not Given
>
> **Пояснення:** у тексті є місце, рік, кількість атлетів і країн — але **ні слова про глядачів**. Інформації немає → **Not Given**. Не підставляй власні знання: IELTS перевіряє лише те, що написано.

## Фішки

> [!reel] 🕵️ «Mistakes were made»
> Улюблена фраза політиків: «Були допущені помилки». Пасив без by дозволяє визнати провину й не сказати, чия вона. Американські коментатори жартома називають це «past exonerative tense» — «виправдувальний минулий час».

> [!reel] 🧪 Науковий стиль любить пасив
> «The solution was heated to 80 °C» — у наукових статтях традиційно писали в пасиві: важливий експеримент, а не дослідник. Сьогодні журнали дедалі частіше дозволяють «We heated…».

> [!reel] 👶 I was born — бо нас народжують
> Born — стара V3 від bear («виносити, народити»). Тому «я народився» буквально «я був народжений» — і лише пасив: I was born.

## Джерела та що почитати

- 🟢 R. Murphy — *English Grammar in Use* (Cambridge): units про passive, be born.
- 🟢 [British Council LearnEnglish — Active and passive voice](https://learnenglish.britishcouncil.org/grammar/b1-b2-grammar/active-passive-voice) — пояснення й вправи.
- 🟡 [Cambridge Dictionary — English Grammar Today](https://dictionary.cambridge.org/grammar/british-grammar/) — стаття «Passive: forms».
- 🟡 [IELTS.org](https://ielts.org) — зразки Writing Task 1 (процеси й діаграми).

> [!important] Підсумок
> - Пасив = **be + V3**: *is / are made* (Present), *was / were built* (Past).
> - Обираємо, коли виконавець невідомий, очевидний чи неважливий — або коли важливіша сама річ / подія.
> - **by + виконавець** — лише коли це нова, важлива інформація.
> - Питання — через **be**: *When **was** it built? Where **were** you born?*
> - *happen, arrive, die* пасиву не мають; *be born* — лише пасив.
