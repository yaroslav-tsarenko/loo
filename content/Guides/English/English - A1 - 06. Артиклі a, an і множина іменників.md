---
title: Артиклі a, an і множина іменників
order: 106
id: en-a1-articles
level: A1
icon: px:blocks
tags: [english, a1, grammar, articles, plural]
prerequisites: ["[[English - A1 - 05. Короткі й довгі голосні]]"]
estimatedMinutes: 35
---

# Артиклі a, an і множина іменників

> [!success] Після цієї теми ти зможеш
> - ставити *a* або *an* перед іменником за **звуком**, а не за літерою: *a university, an hour*;
> - пояснити, навіщо англійцям артикль і коли вперше зʼявляється *the*;
> - утворювати множину: *books, boxes, babies, men, children, feet*;
> - не ставити *a* перед множиною: *a book → books*.

## Передбач

> [!quiz] Яке поєднання правильне?
> level: A1 · id: en-a1-articles-q01
> - [ ] an university
> - [x] an hour
> - [ ] a hour
> - [ ] a umbrella
>
> **Пояснення:** вибір *a / an* залежить від **першого звуку**, а не літери. *Hour* /aʊə/ починається з голосного звуку (h не читається) → *an hour*. *University* /juː-/ починається зі звуку [й] → *a university*. *Umbrella* /ʌ-/ → *an umbrella*.

## Навіщо артикль, якщо в українській його немає

Українською ми кажемо «Я бачу кота» — і з контексту зрозуміло, якого. Англійська хоче, щоб перед **злічуваним іменником в однині** (те, що можна порахувати: one cat, two cats) стояло якесь «службове» слово: *a, the, my, this…* Найпростіше з них — артикль *a / an*. Він означає «один, якийсь, один з багатьох»:

| Українською | Англійською | Що означає артикль |
|---|---|---|
| У мене є кіт. | I have **a** cat. | один, якийсь кіт |
| Вона лікарка. | She's **a** doctor. | одна з багатьох лікарок |
| Це хороша ідея! | It's **a** good idea! | одна з можливих ідей |
| Почекай годину. | Wait **an** hour. | одна година |

> [!tip] Артикль — як «один» без наголосу
> *A / an* історично і є словом *one*, яке «стерлося». Тому з **множиною** воно не вживається: *a cat*, але просто *cats*.

## A чи an: слухай перший звук

Правило одне: **перед приголосним звуком — a, перед голосним звуком — an.** Дивимося не на літеру, а на те, як слово звучить.

| a + приголосний звук | an + голосний звук |
|---|---|
| a book /bʊk/ | an apple /ˈæpl/ |
| a dog /dɒɡ/ | an idea /aɪˈdɪə/ |
| a **u**niversity /ˌjuːnɪ-/ — звук [й] | an **u**mbrella /ʌmˈbrelə/ — звук [а] |
| a **E**uropean /ˌjʊərə-/ — звук [й] | an **e**gg /eɡ/ |
| a **o**ne-way ticket /wʌn/ — звук [w] | an **o**range /ˈɒrɪndʒ/ |
| a **h**ouse /haʊs/ — h читається | an **h**our /aʊə/ — h не читається |

> [!diagram] Як вибрати a чи an
> ```yaml
> layout: flow
> nodes:
>   - { id: word, label: "слово", text: "hour", tone: blue }
>   - { id: sound, label: "перший ЗВУК", text: "?", tone: violet }
>   - { id: rule, label: "голосний?", text: "?", tone: yellow }
>   - { id: art, label: "артикль", text: "?", tone: green }
> steps:
>   - { focus: word, note: "Беремо слово hour. Перша літера — h, приголосна. Але літера нам не важлива!" }
>   - { set: { sound: "/aʊ/" }, focus: sound, note: "Слухаємо: h у hour не вимовляється, слово звучить «ауе». Перший звук — /aʊ/." }
>   - { set: { rule: "так" }, focus: rule, note: "/aʊ/ — голосний звук." }
>   - { set: { art: "an hour" }, focus: art, note: "Голосний звук → an. Звідси an hour, хоча пишеться через h." }
>   - { set: { word: "university", sound: "/j/", rule: "ні", art: "a university" }, note: "А university починається зі звуку /j/ — це [й], а він приголосний → a university, хоча на початку літера u." }
> ```

## Перше знайомство з the

*The* — «той самий, відомий нам обом». Головна схема для A1: **вперше згадуємо — a, далі — the**.

| Ситуація | Приклад | Переклад |
|---|---|---|
| перша згадка → повторна | I see **a** man and **a** woman. **The** man is tall. | Я бачу чоловіка й жінку. (Цей) чоловік високий. |
| обидва знають, про що мова | Close **the** door, please. | Зачини двері, будь ласка. (ці, що тут) |
| єдине у світі | **the** sun, **the** moon, **the** sky | сонце, місяць, небо |

> [!diagram] a → the: як предмет стає «знайомим»
> ```yaml
> layout: timeline
> nodes:
>   - { id: s1, at: "речення 1", label: "перша згадка", text: "I've got a new phone.", tone: blue }
>   - { id: s2, at: "речення 2", label: "уже знайомий", text: "The phone is very fast.", tone: green }
>   - { id: s3, at: "речення 3", label: "все ще той самий", text: "I love the phone!", tone: green }
> steps:
>   - { show: s1, note: "Співрозмовник ще нічого не знає про телефон — це «якийсь, один» телефон: a phone." }
>   - { show: s2, note: "Тепер ми обидва знаємо, про який телефон ідеться, — the phone." }
>   - { show: s3, note: "І далі — the, доки говоримо про той самий телефон." }
> ```

Усі тонкощі *the* (географія, установи, загальні твердження) — на рівні B1. Поки що вистачить: **a = якийсь, перший раз; the = той самий, відомий**.

## Множина: звичайні правила

| Правило | Приклади | Переклад |
|---|---|---|
| більшість слів: **+ s** | book → books, car → cars, phone → phones | книжки, машини, телефони |
| -s, -ss, -sh, -ch, -x: **+ es** | bus → buses, class → classes, dish → dishes, watch → watches, box → boxes | автобуси, класи, тарілки, годинники, коробки |
| деякі на -o: **+ es** | tomato → tomatoes, potato → potatoes | помідори, картоплини |
| інші на -o: **+ s** | photo → photos, piano → pianos | фото, піаніно |
| приголосний + y: **y → ies** | baby → babies, city → cities, party → parties | немовлята, міста, вечірки |
| голосний + y: **+ s** | boy → boys, toy → toys, day → days | хлопці, іграшки, дні |
| часто -f / -fe: **→ ves** | wife → wives, knife → knives, life → lives | дружини, ножі, життя |

> [!tip] Навіщо -es
> Спробуй вимовити «boxs» чи «watchs» — язик спотикається. Тому між свистячим чи шиплячим звуком і s вставляють голосний: *boxes* /ˈbɒksɪz/, *watches* /ˈwɒtʃɪz/. Детально про звуки закінчення -s — у [[English - A1 - 23. Кінцеві приголосні й закінчення -s]].

## Множина: неправильні слова

Кілька дуже частих слів змінюються всередині — їх просто вчимо парами.

| Однина | Множина | Переклад |
|---|---|---|
| man | men | чоловік — чоловіки |
| woman | women | жінка — жінки |
| child | children | дитина — діти |
| person | people | людина — люди |
| foot | feet | стопа — стопи |
| tooth | teeth | зуб — зуби |
| mouse | mice | миша — миші |
| sheep, fish | sheep, fish | вівця — вівці, риба — риби (форма та сама) |

> [!warning] women читається «вімін»
> *Woman* /ˈwʊmən/ — «вумен», але *women* /ˈwɪmɪn/ — «вімін»: змінюється звук у першому складі, хоча на письмі — лише o → e у другому.

## Приклади

- She's a teacher and he's an engineer. — Вона вчителька, а він інженер.
- I need an umbrella. It's raining. — Мені потрібна парасолька. Іде дощ.
- Kyiv is a big city. Lviv and Odesa are big cities too. — Київ — велике місто. Львів та Одеса — теж великі міста.
- There's a cat and two mice in this cartoon. — У цьому мультику кіт і дві миші.
- The children are in the garden. — Діти в саду.
- I brush my teeth twice a day. — Я чищу зуби двічі на день.
- It's an old photo of my grandparents. — Це старе фото моїх бабусі й дідуся.
- Wait an hour, please. — Почекай годину, будь ласка.
- Three women and two men work here. — Тут працюють три жінки й двоє чоловіків.

## Слова

> [!word] hour
> ipa: /ˈaʊə/ · ipa-us: /ˈaʊər/ · pos: noun · level: A1 · id: en-a1-articles-w01
> uk: година
> example: The film is two **hours** long. — Фільм триває дві години.
> note: h не читається → an hour.

> [!word] university
> ipa: /ˌjuːnɪˈvɜːsəti/ · ipa-us: /ˌjuːnɪˈvɝːsət̬i/ · pos: noun · level: A1 · id: en-a1-articles-w02
> uk: університет
> example: My brother is at **university**. — Мій брат навчається в університеті.
> forms: university → universities
> note: починається зі звуку /j/ → a university.

> [!word] umbrella
> ipa: /ʌmˈbrelə/ · pos: noun · level: A1 · id: en-a1-articles-w03
> uk: парасолька
> example: Take an **umbrella**. — Візьми парасольку.

> [!word] idea
> ipa: /aɪˈdɪə/ · ipa-us: /aɪˈdiːə/ · pos: noun · level: A1 · id: en-a1-articles-w04
> uk: ідея
> example: That's a great **idea**! — Чудова ідея!
> note: наголос на другому складі: ai-DEA. Перед ним an: an idea.

> [!word] animal
> ipa: /ˈænɪml/ · pos: noun · level: A1 · id: en-a1-articles-w05
> uk: тварина
> example: A dog is an **animal**. — Собака — тварина.

> [!word] man
> ipa: /mæn/ · pos: noun · level: A1 · id: en-a1-articles-w06
> uk: чоловік
> forms: man → men
> example: Who is that **man**? — Хто той чоловік?

> [!word] woman
> ipa: /ˈwʊmən/ · pos: noun · level: A1 · id: en-a1-articles-w07
> uk: жінка
> forms: woman → women /ˈwɪmɪn/
> example: Two **women** are at the door. — Біля дверей дві жінки.

> [!word] child
> ipa: /tʃaɪld/ · pos: noun · level: A1 · id: en-a1-articles-w08
> uk: дитина
> forms: child → children /ˈtʃɪldrən/
> example: They have three **children**. — У них троє дітей.

> [!word] person
> ipa: /ˈpɜːsn/ · ipa-us: /ˈpɝːsn/ · pos: noun · level: A1 · id: en-a1-articles-w09
> uk: людина; особа
> forms: person → people
> example: She's a very nice **person**. — Вона дуже приємна людина.
> note: «люди» — people (а peoples — народи).

> [!word] foot
> ipa: /fʊt/ · pos: noun · level: A1 · id: en-a1-articles-w10
> uk: стопа; нога (нижче щиколотки)
> forms: foot → feet
> example: My **feet** are cold. — У мене мерзнуть ноги.

> [!word] tooth
> ipa: /tuːθ/ · pos: noun · level: A1 · id: en-a1-articles-w11
> uk: зуб
> forms: tooth → teeth
> example: Brush your **teeth**! — Почисти зуби!

> [!word] mouse
> ipa: /maʊs/ · pos: noun · level: A1 · id: en-a1-articles-w12
> uk: миша; мишка (компʼютерна)
> forms: mouse → mice
> example: My cat is afraid of **mice**! — Мій кіт боїться мишей!

> [!word] box
> ipa: /bɒks/ · ipa-us: /bɑːks/ · pos: noun · level: A1 · id: en-a1-articles-w13
> uk: коробка; ящик
> forms: box → boxes
> example: The **boxes** are in the car. — Коробки в машині.

> [!word] watch
> ipa: /wɒtʃ/ · ipa-us: /wɑːtʃ/ · pos: noun · level: A1 · id: en-a1-articles-w14
> uk: (наручний) годинник
> forms: watch → watches
> example: It's a nice **watch**. — Гарний годинник.
> note: настінний годинник — clock.

> [!word] baby
> ipa: /ˈbeɪbi/ · pos: noun · level: A1 · id: en-a1-articles-w15
> uk: немовля; малюк
> forms: baby → babies
> example: The **baby** is asleep. — Малюк спить.

> [!word] party
> ipa: /ˈpɑːti/ · ipa-us: /ˈpɑːrt̬i/ · pos: noun · level: A1 · id: en-a1-articles-w16
> uk: вечірка; свято
> forms: party → parties
> example: It's a birthday **party**. — Це святкування дня народження.

> [!word] toy
> ipa: /tɔɪ/ · pos: noun · level: A1 · id: en-a1-articles-w17
> uk: іграшка
> forms: toy → toys
> example: The children's **toys** are everywhere. — Дитячі іграшки розкидані всюди.

> [!word] photo
> ipa: /ˈfəʊtəʊ/ · ipa-us: /ˈfoʊt̬oʊ/ · pos: noun · level: A1 · id: en-a1-articles-w18
> uk: фото; світлина
> forms: photo → photos
> example: Look at these **photos**! — Подивись на ці фото!

> [!word] class
> ipa: /klɑːs/ · ipa-us: /klæs/ · pos: noun · level: A1 · id: en-a1-articles-w19
> uk: клас; заняття; урок
> forms: class → classes
> example: My English **class** is on Monday. — Заняття з англійської в мене в понеділок.

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-articles-l01
> audio: It's an old university.
> - [x] It's an old university.
> - [ ] It's a old university.
> - [ ] It's old universities.

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-articles-l02
> audio: The children are with two women.
> - [ ] The child is with two women.
> - [x] The children are with two women.
> - [ ] The children are with a woman.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: en-a1-articles-l03
> audio: I need an umbrella.

> [!listen] Послухай. Скільки дітей у Марти?
> level: A1 · type: answer · speed: slow · id: en-a1-articles-l04
> audio: A: Marta, have you got children?
> audio: B: Yes, two. A boy and a baby girl. The boy is five.
> - [ ] одна дитина
> - [x] двоє: хлопчик пʼяти років і маленька донька
> - [ ] пʼятеро дітей

## Вимова

> [!speak] Скажи вголос
> level: A1 · id: en-a1-articles-s01
> text: an hour, a house, an umbrella, a university
> ipa: /ən ˈaʊə ə ˈhaʊs ən ʌmˈbrelə ə ˌjuːnɪˈvɜːsəti/
> tip: a і an — слабкі /ə/, /ən/. Не «ей» і не «ен» з наголосом. An зливається з наступним голосним: «е-нау-е».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-articles-s02
> text: one man, two men; one woman, two women
> ipa: /wʌn ˈmæn tuː ˈmen wʌn ˈwʊmən tuː ˈwɪmɪn/
> tip: man — широке /æ/, men — /e/. Woman — «вумен», women — «вімін».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-articles-s03
> text: boxes, watches, classes, buses
> ipa: /ˈbɒksɪz ˈwɒtʃɪz ˈklɑːsɪz ˈbʌsɪz/
> tip: -es тут — окремий склад /ɪz/: box-iz, watch-iz.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-articles-s04
> text: The children are at a party.
> ipa: /ðə ˈtʃɪldrən ər ət ə ˈpɑːti/
> tip: the перед приголосним — /ðə/: язик між зубами, звук дзвінкий. Are, at, a — усі слабкі.

## Типові помилки українців

> [!pitfall] «She is doctor», «I am student»
> Найчастіша помилка всіх, у кого в мові немає артиклів. Професія, роль, «хто ти» в однині — **з a / an**: *She's **a** doctor. I'm **a** student. He's **an** engineer.* У множині — без артикля: *They're doctors.*

> [!pitfall] «an university», «a hour» — дивимося на літеру
> Літера оманлива. *University, Europe, one* починаються з приголосного звуку → **a**. *Hour, honest* — h не читається, тож перший звук голосний → **an**. Скажи слово вголос — і почуєш правильний артикль.

> [!pitfall] «a books», «childrens», «peoples»
> *A / an* — лише з одниною: **a book, books**. *Children, people, men* — вже множина, ще одне -s не додаємо. (*Peoples* існує, але означає «народи».)

## Практика

> [!quiz] Обери правильний варіант: «My dad is ___ engineer.»
> level: A1 · id: en-a1-articles-q02
> - [ ] a
> - [x] an
> - [ ] —
> - [ ] the
>
> **Пояснення:** *engineer* /ˌendʒɪˈnɪə/ починається з голосного звуку → *an engineer*. Без артикля не можна — професія в однині.

> [!quiz] Де всі артиклі вжито правильно?
> level: A1 · id: en-a1-articles-q03
> - [ ] an university, a hour, a apple
> - [x] a university, an hour, an apple
> - [ ] an university, an hour, an apple
> - [ ] a university, a hour, an apple
>
> **Пояснення:** вирішує перший **звук**: /j/ — a; голосний /aʊ/, /æ/ — an.

> [!quiz] Обери всі правильні множини
> level: A1 · type: multi · id: en-a1-articles-q04
> - [x] babies
> - [ ] boxs
> - [x] toys
> - [ ] childs
> - [x] feet
>
> **Пояснення:** baby → babies (приголосний + y), box → boxes (+ es після x), toy → toys (голосний + y), child → children, foot → feet.

> [!quiz] Як перекласти «Вона медсестра, а він студент»?
> level: A1 · id: en-a1-articles-q05
> - [ ] She is nurse and he is student.
> - [x] She's a nurse and he's a student.
> - [ ] She's an nurse and he's an student.
> - [ ] She's the nurse and he's the student.
>
> **Пояснення:** професія в однині — з *a*; *nurse* і *student* починаються з приголосних → *a*. *The* означало б «та сама медсестра, про яку ми вже говорили».

> [!quiz] Заповни пропуски: a чи an
> level: A1 · type: fill · bank · id: en-a1-articles-q06
>
> ```text fill
> I've got [[a]] dog and [[an]] old cat.
> It's [[an]] interesting idea.
> She lives in [[a]] small house.
> ```
>
> **Пояснення:** *old, interesting* починаються з голосного звуку → *an*. *Dog, small* — з приголосного → *a*. Артикль залежить від слова **одразу після нього**, навіть якщо це прикметник.

> [!quiz] Напиши множину
> level: A1 · type: fill · id: en-a1-articles-q07
>
> ```text fill
> one city — two [[cities]]
> one watch — two [[watches]]
> one woman — two [[women]]
> one person — two [[people]]
> one tooth — two [[teeth]]
> ```
>
> **Пояснення:** city → cities (y → ies), watch → watches (+ es після ch), а *women, people, teeth* — неправильні, їх вчимо напамʼять.

> [!quiz] Заповни пропуски: a чи the
> level: A1 · type: fill · bank · id: en-a1-articles-q08
>
> ```text fill
> I've got [[a]] new bike. [[The]] bike is red.
> Look at [[the]] sky! It's beautiful.
> ```
>
> **Пояснення:** перша згадка — *a bike*, повторна — *the bike*. Небо одне на всіх — *the sky*.

> [!quiz] Склади речення: «Діти в парку»
> level: A1 · type: order · id: en-a1-articles-q09
>
> ```text order
> The
> children
> are
> in
> the
> park.
> childrens // ✗
> ```
>
> **Пояснення:** *children* — уже множина, тому *are*. «Childrens» не існує.

> [!quiz] Склади речення: «Це гарна ідея»
> level: A1 · type: order · id: en-a1-articles-q10
>
> ```text order
> It's
> a
> good
> idea.
> an // ✗
> ```
>
> **Пояснення:** після артикля йде *good* (приголосний звук), тому *a*, хоча *idea* сама по собі — *an idea*.

> [!quiz] Чому правильно «a one-way ticket», а не «an one-way ticket»?
> level: A1 · id: en-a1-articles-q11
> - [ ] Бо *one* — числівник, а з числівниками завжди *a*.
> - [x] Бо *one* звучить /wʌn/ — з приголосного звуку [w].
> - [ ] Це виняток, який треба просто запамʼятати.
>
> **Пояснення:** *one* пишеться з *o*, але вимовляється /wʌn/. Звук [w] — приголосний → *a*. Правило те саме: дивимося на звук.

> [!quiz] Обери правильне речення
> level: A1 · id: en-a1-articles-q12
> - [ ] I have a friends in London.
> - [ ] I have friend in London.
> - [x] I have friends in London.
> - [ ] I have an friends in London.
>
> **Пояснення:** *a / an* лише з одниною. Множина — без артикля: *friends*. А одне *friend* без артикля стояти не може: *a friend*.

## Фішки

> [!reel] 🍎 Як «a napron» став «an apron»
> Колись англійці казали *a napron* (фартух). Але на слух *a napron* і *an apron* звучать однаково — і n «перестрибнула» до артикля. Так само *a nadder* став *an adder* (гадюка). А в *orange* (від арабського *nāranj*) n загубилася ще у французькій та італійській — до англійської слово прийшло вже без неї.

> [!reel] 🐭 Чому mice, а не mouses
> *Mouse — mice, foot — feet, tooth — teeth, man — men* — залишки давньої англійської, де множину робили зміною голосного всередині слова (як у німецькій *Maus — Mäuse*). Вижили лише найчастіші слова.

> [!reel] 🖱️ Комп’ютерні mice чи mouses?
> Про компʼютерних мишок кажуть і *mice*, і *mouses*. Словники визнають обидві форми, але *mice* все одно вживають частіше. Тож якщо в тебе дві мишки на столі — не помилишся ні так, ні так.

## Джерела та що почитати

- [British Council LearnEnglish — A1–A2 grammar](https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar) — розділи *a / an*, *the* і *plural nouns*.
- [Cambridge Dictionary — English Grammar Today](https://dictionary.cambridge.org/grammar/british-grammar/) — статті *A / an* і *Nouns: singular and plural*.
- R. Murphy — *Essential Grammar in Use* — розділи: a / an, множина.
- M. Swan — *Practical English Usage*, розділи про артиклі.

> [!important] Підсумок
> - Злічуваний іменник в однині не стоїть сам: *a book, an hour, my book, the book*.
> - *A* — перед приголосним **звуком**, *an* — перед голосним **звуком**: *a university, an hour*.
> - Перша згадка — *a*, далі — *the*; *the* — і для єдиного у світі: *the sun*.
> - Множина: + s; після s / sh / ch / x — + es; приголосний + y → ies.
> - Неправильні: *men, women, children, people, feet, teeth, mice*. З множиною *a / an* не вживаємо.
