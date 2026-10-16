---
title: Дієслово to be — am, is, are
order: 103
id: en-a1-be
level: A1
icon: px:letterTile
tags: [english, a1, grammar, to-be, pronouns]
prerequisites: ["[[English - A1 - 02. Знайомство — привітання, країни й національності]]"]
estimatedMinutes: 35
---

# Дієслово to be — am, is, are

> [!success] Після цієї теми ти зможеш
> - назвати особові займенники *I, you, he, she, it, we, they* і правильно вибрати *am / is / are*;
> - сказати, хто ти, звідки, як почуваєшся і де ти зараз: *I'm a student. I'm tired. I'm at home.*;
> - заперечити й спитати: *She isn't here. Are you ready?*;
> - коротко відповісти: *Yes, I am. / No, they aren't.*

## Передбач

> [!quiz] Як перекласти «Я студент»?
> level: A1 · id: en-a1-be-q01
> - [ ] I student.
> - [ ] I student am.
> - [x] I am a student.
> - [ ] Me is student.
>
> **Пояснення:** в українській «є» зазвичай пропускаємо. В англійській **кожне речення має дієслово**, тож потрібне *am*. І ще артикль *a* перед професією — про нього в темі [[English - A1 - 06. Артиклі a, an і множина іменників]].

## Навіщо англійцям «є»

Українською ми кажемо «Я студент», «Вона вдома», «Кава гаряча» — і нічого не бракує. Англійське речення так не працює: у ньому **завжди є підмет і дієслово**. Якщо жодної дії немає (ніхто не біжить, не читає, не їсть), на місце дієслова стає *to be* — «бути, є, знаходитися».

| Українською | Англійською | Що робить be |
|---|---|---|
| Я студент. | I **am** a student. | хто ти |
| Вона вдома. | She **is** at home. | де ти |
| Кава гаряча. | The coffee **is** hot. | який предмет |
| Нам 30. | We **are** 30. | вік |
| Мені холодно. | I **am** cold. | як почуваєшся |

> [!diagram] Як «Я студент» стає англійським реченням
> ```yaml
> layout: flow
> nodes:
>   - { id: subj, label: "хто?", text: "I", tone: blue }
>   - { id: verb, label: "дієслово be", text: "?", tone: violet }
>   - { id: rest, label: "хто / який / де", text: "a student", tone: green }
> steps:
>   - { focus: [subj, rest], note: "Українською вистачає двох слів: «Я студент». Англійською так не можна — бракує дієслова." }
>   - { set: { verb: "am" }, focus: verb, note: "На порожнє місце стає be. Для I це завжди am." }
>   - { focus: [subj, verb, rest], note: "Готово: I am a student. Скорочено — I'm a student." }
>   - { set: { subj: "She", verb: "is", rest: "at home" }, note: "Та сама схема для «Вона вдома»: She is at home. Для he / she / it — is." }
>   - { set: { subj: "They", verb: "are", rest: "tired" }, note: "«Вони втомлені»: They are tired. Для you / we / they — are." }
> ```
> Підмет → be → решта. Ця «рамка» працює в тисячах речень.

## Особові займенники

| Англійською | Українською | Примітка |
|---|---|---|
| I | я | завжди з великої літери, навіть у середині речення |
| you | ти / ви | одне слово і для «ти», і для ввічливого «ви», і для «ви» (багато людей) |
| he | він | лише про людей (і улюблених тварин) |
| she | вона | лише про людей (і улюблених тварин) |
| it | воно / він / вона (про речі) | предмети, тварини, погода, час: *It's a phone. It's cold.* |
| we | ми | |
| they | вони | і про людей, і про речі |

> [!tip] Стіл — «він», а в англійській — it
> В українській стіл — «він», книжка — «вона». В англійській у речей роду немає: **все це it**. *Where is my phone? — It's on the table.* (Де мій телефон? — **Він** на столі.)

## Форми: am, is, are

Лише три форми на всіх — і жодних винятків:

| Підмет | Повна форма | Скорочення | Приклад |
|---|---|---|---|
| I | am | I'm | I'm Ukrainian. |
| he / she / it | is | he's / she's / it's | She's a doctor. |
| you / we / they | are | you're / we're / they're | We're friends. |

У розмові й неформальних повідомленнях майже завжди звучать **скорочення**: *I'm, she's, they're*. Повну форму вживають для наголосу (*I **am** ready!* — я ж **таки** готовий!) і в офіційних текстах.

## Заперечення: not

Щоб заперечити, ставимо *not* **після** am / is / are.

| Повна форма | Скорочення (два варіанти) | Переклад |
|---|---|---|
| I am not tired. | I'm not tired. | Я не втомлений. |
| He is not here. | He isn't here. / He's not here. | Його тут немає. |
| They are not late. | They aren't late. / They're not late. | Вони не запізнюються. |

> [!warning] «I amn't» не існує
> Для *I* є лише одне скорочення: **I'm not**. Форм «I amn't» чи «I aren't» у стандартній англійській немає.

## Питання: be стрибає вперед

У питанні *am / is / are* міняється місцями з підметом. Жодних допоміжних слів не треба — тільки перестановка й знак питання.

| Твердження | Питання | Переклад |
|---|---|---|
| You are ready. | **Are** you ready? | Ти готовий? |
| She is from Lviv. | **Is** she from Lviv? | Вона зі Львова? |
| It is expensive. | **Is** it expensive? | Це дорого? |
| They are at home. | **Are** they at home? | Вони вдома? |
| — | Where **are** you? | Де ти? |
| — | How old **is** he? | Скільки йому років? |

З питальним словом порядок той самий: **питальне слово → be → підмет → решта**: *Where is the station? What is your name?*

> [!diagram] Твердження і питання: що змінюється
> ```yaml
> layout: compare
> columns: { plus: "Твердження", q: "Питання" }
> nodes:
>   - { id: p1, col: plus, label: "1", text: "She", tone: blue }
>   - { id: p2, col: plus, label: "2", text: "is", tone: violet }
>   - { id: p3, col: plus, label: "3", text: "a teacher.", tone: green }
>   - { id: q1, col: q, label: "1", text: "Is", tone: violet }
>   - { id: q2, col: q, label: "2", text: "she", tone: blue }
>   - { id: q3, col: q, label: "3", text: "a teacher?", tone: green }
> steps:
>   - { focus: [p1, p2, p3], note: "Твердження: підмет She, потім is, потім решта. Вона вчителька." }
>   - { focus: [q1, p2], note: "У питанні is перестрибує на перше місце. Жодного do, жодних нових слів." }
>   - { focus: [q2, q3], note: "Підмет she стає другим, решта не змінюється. Лише крапка → знак питання." }
>   - { set: { q1: "Where is", q3: "?" }, focus: [q1, q2, q3], note: "З питальним словом: Where is she? — воно стає ще перед is." }
> ```

## Короткі відповіді

На питання «так / ні» англійці рідко відповідають одним *Yes* — частіше додають підмет і be:

| Питання | Так | Ні |
|---|---|---|
| Are you a student? | Yes, I am. | No, I'm not. |
| Is he British? | Yes, he is. | No, he isn't. |
| Is it cold? | Yes, it is. | No, it isn't. |
| Are they friends? | Yes, they are. | No, they aren't. |

> [!warning] Yes, I'm — так не можна
> У короткій **ствердній** відповіді be стоїть у кінці, і скорочувати його не можна: *Yes, I **am**. Yes, she **is**.* А в запереченні скорочення — норма: *No, she isn't.*

## Приклади

- I'm a student and my sister is a teacher. — Я студент, а моя сестра — вчителька.
- We're from Odesa. — Ми з Одеси.
- Is it your phone? — No, it isn't. — Це твій телефон? — Ні.
- They aren't at home. They're at work. — Їх немає вдома. Вони на роботі.
- Are you hungry? — Yes, I am! — Ти голодний? — Так!
- The museum is closed today. — Музей сьогодні зачинений.
- You're right, and I'm wrong. — Ти маєш рацію, а я помиляюся.
- Where are my keys? — They're on the table. — Де мої ключі? — Вони на столі.
- I'm not sure. — Я не впевнений.
- It's late. Good night! — Уже пізно. На добраніч!

## Слова

> [!word] student
> ipa: /ˈstjuːdnt/ · ipa-us: /ˈstuːdnt/ · pos: noun · level: A1 · id: en-a1-be-w01
> uk: студент; учень
> example: I'm a **student** at Kyiv University. — Я студент Київського університету.

> [!word] friend
> ipa: /frend/ · pos: noun · level: A1 · id: en-a1-be-w02
> uk: друг; подруга
> example: Max and I are **friends**. — Ми з Максом друзі.
> note: читається «френд» — літера i не вимовляється.

> [!word] busy
> ipa: /ˈbɪzi/ · pos: adj · level: A1 · id: en-a1-be-w03
> uk: зайнятий
> example: Sorry, I'm **busy** now. — Вибач, я зараз зайнятий.
> note: читається «бізі», не «бюзі».

> [!word] tired
> ipa: /ˈtaɪəd/ · ipa-us: /ˈtaɪərd/ · pos: adj · level: A1 · id: en-a1-be-w04
> uk: втомлений
> example: We're **tired** after work. — Ми втомлені після роботи.

> [!word] hungry
> ipa: /ˈhʌŋɡri/ · pos: adj · level: A1 · id: en-a1-be-w05
> uk: голодний
> example: Are you **hungry**? — Ти голодний?
> note: «Я хочу їсти» = I'm hungry.

> [!word] thirsty
> ipa: /ˈθɜːsti/ · ipa-us: /ˈθɝːsti/ · pos: adj · level: A1 · id: en-a1-be-w06
> uk: який хоче пити; спраглий
> example: I'm **thirsty**. Is there any water? — Я хочу пити. Є вода?

> [!word] ready
> ipa: /ˈredi/ · pos: adj · level: A1 · id: en-a1-be-w07
> uk: готовий
> example: Dinner is **ready**! — Вечеря готова!

> [!word] late
> ipa: /leɪt/ · pos: adj · level: A1 · id: en-a1-be-w08
> uk: пізній; який запізнюється
> example: Sorry, I'm **late**. — Вибач, я запізнився.
> note: «Я запізнююся» = I'm late — дієслово be, а не окреме «запізнюватися».

> [!word] right
> ipa: /raɪt/ · pos: adj · level: A1 · id: en-a1-be-w09
> uk: правильний; правий (має рацію)
> example: You're **right**. — Ти маєш рацію.

> [!word] wrong
> ipa: /rɒŋ/ · ipa-us: /rɔːŋ/ · pos: adj · level: A1 · id: en-a1-be-w10
> uk: неправильний; помилковий
> example: Sorry, it's the **wrong** number. — Вибачте, це неправильний номер.
> note: w не читається: «ронг».

> [!word] sure
> ipa: /ʃɔː/ · ipa-us: /ʃʊr/ · pos: adj · level: A1 · id: en-a1-be-w11
> uk: впевнений
> example: Are you **sure**? — Yes, I am. — Ти впевнений? — Так.

> [!word] at home
> ipa: /ət ˈhəʊm/ · ipa-us: /ət ˈhoʊm/ · pos: phrase · level: A1 · id: en-a1-be-w12
> uk: вдома
> example: Is your mum **at home**? — Твоя мама вдома?

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-be-l01
> audio: She isn't at home.
> - [ ] She's at home.
> - [x] She isn't at home.
> - [ ] Is she at home?

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-be-l02
> audio: We're tired.
> - [x] We're tired.
> - [ ] We were tired.
> - [ ] They're tired.

> [!listen] Надрукуй почуте
> level: A1 · type: dictation · speed: slow · id: en-a1-be-l03
> audio: Are you ready?

> [!listen] Надрукуй почуте
> level: A1 · type: dictation · speed: slow · id: en-a1-be-l04
> audio: I'm not sure.

> [!listen] Послухай діалог. Де зараз Том?
> level: A1 · type: answer · speed: slow · id: en-a1-be-l05
> audio: A: Hi, Kate! Is Tom at home?
> audio: B: No, he isn't. He's at work.
> - [ ] вдома
> - [x] на роботі
> - [ ] в університеті

> [!listen] Послухай діалог. Яка відповідь правдива?
> level: A1 · type: answer · speed: slow · id: en-a1-be-l06
> audio: A: Are you and Ira students?
> audio: B: Yes, we are. We're students at the same university.
> - [x] Обидві — студентки одного університету.
> - [ ] Вони вчительки.
> - [ ] Лише одна з них студентка.

## Вимова

> [!speak] Скажи вголос
> level: A1 · id: en-a1-be-s01
> text: I'm a student.
> ipa: /aɪm ə ˈstjuːdnt/
> tip: I'm — один склад, «айм». Артикль a — коротке нейтральне /ə/.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-be-s02
> text: She's from Lviv.
> ipa: /ʃiːz frəm ləˈviːv/
> tip: she's закінчується дзвінким /z/ — «шіз», а не «шіс».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-be-s03
> text: They aren't at home.
> ipa: /ðeɪ ɑːnt ət ˈhəʊm/
> tip: aren't — одне довге «а-ант», без «р» у британській вимові. Home — «г» не кажемо, це легкий видих /h/.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-be-s04
> text: Are you ready?
> ipa: /ɑː juː ˈredi/
> tip: питання «так / ні» — голос угору ↗ на ready.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-be-s05
> text: Yes, I am. No, I'm not.
> ipa: /jes aɪ ˈæm nəʊ aɪm ˈnɒt/
> tip: у короткій відповіді am звучить повністю й наголошено: «ай ЕМ».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-be-s06
> text: It isn't cold today.
> ipa: /ɪt ˈɪznt kəʊld təˈdeɪ/
> tip: isn't — «ізнт», з дзвінким /z/ посередині.

## Типові помилки українців

> [!pitfall] Речення без be: «I student», «She very nice»
> Українська дозволяє пропустити «є», англійська — ні. *I **am** a student. She **is** very nice. The coffee **is** hot.* Перевіряй кожне речення: якщо в ньому немає жодного дієслова, найімовірніше, бракує am / is / are.

> [!pitfall] «I am agree», «I am live in Kyiv» — be там, де вже є дієслово
> Навпаки теж буває: be додають до справжнього дієслова. *Agree, live, work, like* — це вже дієслова, be їм не потрібне: **I agree. I live in Kyiv.** Детальніше — у темі [[English - A1 - 14. Present Simple — стверджувальні речення]].

> [!pitfall] «Мені холодно» ≠ «To me is cold»
> Стани, які українською звучать як «мені холодно / мені 20 / мені страшно», англійською будуються з **I am**: *I'm cold. I'm 20. I'm scared.* Хто відчуває — той і підмет.

## Ситуація: на рецепції хостелу

> [!listen] Послухай діалог на рецепції
> level: A1 · type: choice · speed: slow · id: en-a1-be-l07
> audio: A: Good evening! Are you Ms Bondar?
> audio: B: Yes, I am. I'm sorry, I'm late.
> audio: A: That's OK. Your room is ready. It's room twelve.
> audio: B: Great, thank you. Is the café open now?
> audio: A: No, it isn't. It's open in the morning.
> - [x] Номер готовий, а кафе зараз зачинене.
> - [ ] Номер не готовий, кафе відчинене.
> - [ ] Пані Бондар прийшла вчасно.

Відповідай адміністраторові вголос.

> [!speak] «Так, це я. Вибачте, я запізнилася».
> level: A1 · id: en-a1-be-s07
> text: Yes, I am. I'm sorry, I'm late.
> ipa: /jes aɪ ˈæm aɪm ˈsɒri aɪm ˈleɪt/
> tip: I'm late — «айм лейт», без «запізнилася» як окремого дієслова.

## Практика

> [!quiz] Обери правильну форму: «My parents ___ from Kharkiv.»
> level: A1 · id: en-a1-be-q02
> - [ ] am
> - [ ] is
> - [x] are
> - [ ] be
>
> **Пояснення:** *my parents* = *they* → **are**.

> [!quiz] Обери правильну форму: «The weather ___ nice today.»
> level: A1 · id: en-a1-be-q03
> - [ ] am
> - [x] is
> - [ ] are
>
> **Пояснення:** *the weather* = *it* → **is**.

> [!quiz] Як перекласти «Вони не вдома»?
> level: A1 · id: en-a1-be-q04
> - [ ] They not at home.
> - [ ] They don't at home.
> - [x] They aren't at home.
> - [ ] They isn't at home.
>
> **Пояснення:** заперечення be — просто *not* після *are*: *They are not / aren't at home*. *Don't* тут не потрібне.

> [!quiz] Яка коротка відповідь правильна? «Are you tired?» — «Yes, …»
> level: A1 · id: en-a1-be-q05
> - [ ] Yes, I'm.
> - [x] Yes, I am.
> - [ ] Yes, I are.
> - [ ] Yes, you are.
>
> **Пояснення:** у ствердній короткій відповіді be не скорочується: *Yes, I am.*

> [!quiz] Обери всі правильні речення
> level: A1 · type: multi · id: en-a1-be-q06
> - [x] I'm not hungry.
> - [ ] I amn't hungry.
> - [x] He isn't at work.
> - [x] We're not late.
> - [ ] She not ready.
>
> **Пояснення:** для I — лише *I'm not*. У *She not ready* бракує *is*: *She isn't ready.*

> [!quiz] Заповни пропуски формами be
> level: A1 · type: fill · bank · id: en-a1-be-q07
>
> ```text fill
> Hi! I [[am]] Oksana. I [[am]] from Dnipro.
> My brother [[is]] a student.
> My parents [[are]] doctors.
> ```
>
> **Пояснення:** I → am, my brother → is, my parents → are.

> [!quiz] Заповни пропуски: питання й коротка відповідь
> level: A1 · type: fill · bank: am · id: en-a1-be-q08
>
> ```text fill
> A: [[Is]] Mark your friend?
> B: Yes, he [[is]].
> A: [[Are]] you and Mark from London?
> B: No, we [[aren't]]. We're from Manchester.
> ```
>
> **Пояснення:** *Mark* = *he* → *Is…? — Yes, he is.* *You and Mark* = *you* (ви) → *Are…?*, відповідь від «ми» → *No, we aren't.*

> [!quiz] Склади питання: «Де твої ключі?»
> level: A1 · type: order · id: en-a1-be-q09
>
> ```text order
> Where
> are
> your
> keys?
> ```
>
> **Пояснення:** питальне слово → be → підмет. *Keys* — множина, тому *are*.

> [!quiz] Склади речення: «Моя сестра не вдома»
> level: A1 · type: order · id: en-a1-be-q10
>
> ```text order
> My
> sister
> isn't
> at
> home.
> don't // ✗
> ```
>
> **Пояснення:** заперечення be — *isn't*. *Don't* з be не вживаємо.

> [!quiz] Як сказати англійською «Мені 25»?
> level: A1 · id: en-a1-be-q11
> - [ ] I have 25.
> - [ ] To me is 25.
> - [x] I'm 25.
> - [ ] I have 25 years.
>
> **Пояснення:** вік — через be: *I'm 25* або *I'm 25 years old*. Детально — у темі [[English - A1 - 04. Числа, вік і номер телефону]].

> [!quiz] Що замінює «it» у відповіді? «Where's my bag? — It's in the car.»
> level: A1 · id: en-a1-be-q12
> - [ ] власника сумки
> - [x] сумку
> - [ ] машину
>
> **Пояснення:** *it* — про предмет, про який питали, тобто *my bag*. Українською ми б сказали «вона в машині», а англійською сумка — *it*.

## Фішки

> [!reel] 🧬 be — найдивніше дієслово англійської
> Подивись на форми: *be, am, is, are, was, were, been*. Вони походять від трьох різних давніх коренів, які злилися в одне дієслово. Тому *am* і *is* зовсім не схожі на *be*.

> [!reel] 🤏 Чому I завжди з великої
> У середньовічних рукописах маленьке *i* легко губилося поруч з іншими літерами. Писарі почали видовжувати його — так зʼявилося велике *I*. Тепер воно велике навіть у середині речення.

> [!reel] 👥 You колись було лише «ви»
> Колись в англійській було *thou* — «ти» і *you* — «ви». Ввічливе *you* поступово витіснило *thou*. Тепер усі на «ви» — тому англійці й не мають проблеми «ти чи ви».

## Джерела та що почитати

- [British Council LearnEnglish — A1–A2 grammar](https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar) — розділ про verb *be*.
- [Cambridge Dictionary — English Grammar Today](https://dictionary.cambridge.org/grammar/british-grammar/) — статті *Be* і *Pronouns*.
- R. Murphy — *Essential Grammar in Use*, units 1–3 (am / is / are, питання).
- M. Swan — *Practical English Usage*, розділи про be і короткі відповіді.

> [!important] Підсумок
> - В англійському реченні завжди є дієслово; якщо дії немає — ставимо be.
> - I **am**, he / she / it **is**, you / we / they **are**; скорочення *I'm, she's, they're*.
> - Заперечення — *not* після be: *isn't, aren't, I'm not*.
> - Питання — be на початок: *Are you ready? Where is she?*
> - Короткі відповіді: *Yes, I am* (без скорочення) / *No, I'm not*.
