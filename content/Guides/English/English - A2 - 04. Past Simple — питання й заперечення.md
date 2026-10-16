---
title: Past Simple — питання й заперечення
order: 204
id: en-a2-past-questions
level: A2
icon: px:question
tags: [english, a2, grammar, past-simple, questions, negatives]
prerequisites: ["[[English - A2 - 02. Past Simple — правильні й неправильні дієслова]]", "[[English - A1 - 15. Present Simple — питання й заперечення]]"]
estimatedMinutes: 40
---

# Past Simple — питання й заперечення

> [!success] Після цієї теми ти зможеш
> - сказати, чого ти **не** робив: *I didn't go out. She didn't call.*;
> - спитати про минуле: *Did you enjoy it? Where did you go? Why did she leave?*;
> - коротко відповісти: *Yes, I did. / No, we didn't.*;
> - розрізняти *Who called you?* (хто подзвонив) і *Who did you call?* (кому ти дзвонив).

## Передбач

> [!quiz] Як спитати «Ти бачив Марка вчора?»
> level: A2 · id: en-a2-past-questions-q01
> - [x] Did you see Mark yesterday?
> - [ ] Did you saw Mark yesterday?
> - [ ] Do you saw Mark yesterday?
> - [ ] Saw you Mark yesterday?
>
> **Пояснення:** питання в Past Simple будуємо з помічником **did**, а дієслово повертається в базову форму: *Did you **see**…?* Минуле показує вже *did*, тому *saw* тут зайве.

## Простими словами

Уяви, що «минулість» — це рюкзак. У ствердженні його несе саме дієслово: *went, saw, worked*. Але в запереченні й питанні зʼявляється помічник **did** — і забирає рюкзак собі. Дієслово йде налегке, у базовій формі:

- *She **went** home.* → *She **didn't go** home.* → ***Did** she **go** home?*

Одне речення — один рюкзак. Якщо є *did*, дієслово завжди **V1**: *go, see, work*. Ніяких *didn't went* чи *did you saw*.

> [!diagram] Як did забирає минуле в дієслова
> ```yaml
> layout: flow
> nodes:
>   - { id: st, label: твердження, text: "You went to Lviv.", tone: blue }
>   - { id: aux, label: помічник + V1, text: "did + go", tone: violet }
>   - { id: q, label: питання, text: "?", tone: green }
>   - { id: neg, label: заперечення, text: "?", tone: orange }
> edges:
>   - { from: st, to: aux, label: "went = did + go" }
>   - { from: aux, to: q, label: "did — на початок" }
>   - { from: q, to: neg, label: "did + not" }
> steps:
>   - { focus: st, note: "У ствердженні минуле «сидить» у самому дієслові: went." }
>   - { move: { from: st, to: aux, value: "went" }, note: "Розкладаємо went на дві частини: минулість (did) + дієслово без минулого (go)." }
>   - { move: { from: aux, to: q, value: "Did … go" }, set: { q: "Did you go to Lviv?" }, note: "Did стає перед підметом, go лишається після нього. Рюкзак минулого — у did." }
>   - { move: { from: q, to: neg, value: "didn't" }, set: { neg: "You didn't go to Lviv." }, note: "Заперечення: did + not = didn't, а дієслово знову базове — go." }
>   - { focus: [aux, q, neg], note: "Правило одним рядком: є did — дієслово V1. Did you go? I didn't go." }
> ```

## Пояснення

### Заперечення: didn't + V1

| + | − |
|---|---|
| *I **worked** yesterday.* | *I **didn't work** yesterday.* |
| *She **saw** the film.* | *She **didn't see** the film.* |
| *They **bought** a car.* | *They **didn't buy** a car.* |

- **didn't** = did not; повна форма — у формальному письмі.
- Форма однакова для всіх осіб: *I / he / we didn't go.*

> [!quiz] Перевір себе: заперечення
> level: A2 · id: en-a2-past-questions-q02
>
> *I was tired, so I ___ to the party.*
>
> - [x] didn't go
> - [ ] didn't went
> - [ ] not went
> - [ ] don't went
>
> **Пояснення:** після *didn't* — тільки базова форма: **go**. Минуле вже «сидить» у *did*.

### Загальні питання й короткі відповіді

Схема: **Did + підмет + V1…?**

| Питання | Так | Ні |
|---|---|---|
| *Did you enjoy the concert?* | *Yes, I did.* | *No, I didn't.* |
| *Did she call you back?* | *Yes, she did.* | *No, she didn't.* |
| *Did they win?* | *Yes, they did.* | *No, they didn't.* |

Коротка відповідь — лише *did / didn't*, без основного дієслова: не «Yes, I enjoyed», а ***Yes, I did.***

### Спеціальні питання: QASI

Запамʼятай порядок **Q-A-S-I**: **Q**uestion word → **A**uxiliary (*did*) → **S**ubject → **I**nfinitive (V1).

| Q | A | S | I | … |
|---|---|---|---|---|
| **Where** | **did** | you | **go** | on holiday? |
| **What** | **did** | she | **buy**? | |
| **When** | **did** | they | **arrive**? | |
| **Why** | **did** | he | **leave** | so early? |
| **How** | **did** | you | **get** | there? |

> [!quiz] Перевір себе: склади питання
> level: A2 · type: fill · bank: does, went · id: en-a2-past-questions-q03
>
> ```text fill
> [[Did]] you enjoy the film?
> Where [[did]] she [[go]] last weekend?
> What did you [[buy]] at the market?
> ```
>
> **Пояснення:** загальне питання починається з **Did**; у спеціальному *did* іде одразу після питального слова; основне дієслово — базове: **go**, **buy**.

### Who called? чи Who did you call?

Тут українцям легко заплутатися, бо в нас різниця лише у відмінку: «**хто** подзвонив» і «**кому** ти дзвонив».

- Якщо *who / what* — **підмет** (той, хто виконує дію), *did* **не потрібен**, а дієслово стоїть у минулій формі: ***Who called** you?* — Хто тобі подзвонив? ***What happened?*** — Що сталося?
- Якщо *who / what* — **додаток** (над ким / чим виконують дію), працює звичайна схема з *did*: ***Who did** you **call**?* — Кому ти дзвонив?

> [!diagram] Who — підмет чи додаток?
> ```yaml
> layout: compare
> columns: { subj: "Who = підмет: без did", obj: "Who = додаток: з did" }
> nodes:
>   - { id: s1, col: subj, text: "Taras called Anna.", note: "Хто дзвонив? — Тарас" }
>   - { id: s2, col: subj, text: "Who called Anna?", note: "Хто подзвонив Анні?", tone: violet }
>   - { id: s3, col: subj, text: "— Taras.", tone: green }
>   - { id: o1, col: obj, text: "Taras called Anna.", note: "Кому дзвонив Тарас? — Анні" }
>   - { id: o2, col: obj, text: "Who did Taras call?", note: "Кому подзвонив Тарас?", tone: blue }
>   - { id: o3, col: obj, text: "— Anna.", tone: green }
> steps:
>   - { focus: [s1, o1], note: "Одне й те саме речення. Але питати можна про різних людей." }
>   - { show: s2, note: "Питаємо про того, ХТО дзвонив: who займає місце Taras. Порядок слів не міняється, did не потрібен — called." }
>   - { show: s3, note: "Відповідь — підмет: Taras (did)." }
>   - { show: o2, note: "Питаємо, КОМУ дзвонили: who — додаток. Потрібна звичайна схема: Who + did + Taras + call." }
>   - { show: o3, note: "Відповідь — додаток: Anna. Підказка: якщо після who одразу стоїть дієслово — did не потрібен." }
> ```

### Was / were — без did

*To be* живе за власними правилами з теми [[English - A2 - 01. Was і were — минуле дієслова to be|Was і were]]: ***Were** you tired? — Yes, I **was**. I **wasn't** at home.* Ніякого «did you be» чи «I didn't was».

## Приклади

- *I didn't sleep well last night.* — Я погано спав цієї ночі.
- *Did you have a good time? — Yes, I did, thanks!* — Ти добре провів час? — Так, дякую!
- *Where did you buy that jacket?* — Де ти купив цю куртку?
- *Why didn't you tell me?* — Чому ти мені не сказав?
- *How did you get to the airport? — We took a taxi.* — Як ви дісталися аеропорту? — Взяли таксі.
- *What happened? — I fell off my bike.* — Що сталося? — Я впав з велосипеда.
- *Who told you about the party?* — Хто тобі сказав про вечірку?
- *Who did you invite?* — Кого ти запросив?
- *She didn't recognise me at first.* — Спочатку вона мене не впізнала.
- *Did they win? — No, they didn't. They lost 1–3.* — Вони виграли? — Ні, програли 1:3.

## Слова

> [!word] happen
> ipa: /ˈhæp.ən/ · pos: verb · level: A2 · id: en-a2-past-questions-w01
> uk: траплятися, відбуватися
> example: What **happened** to your car? — Що сталося з твоєю машиною?
> note: What happened? — без did, бо what тут підмет.

> [!word] have a good time
> ipa: /hæv ə ˌɡʊd ˈtaɪm/ · pos: phrase · level: A2 · id: en-a2-past-questions-w02
> uk: добре провести час
> example: Did you **have a good time** in Rome? — Ти добре провів час у Римі?

> [!word] miss
> ipa: /mɪs/ · pos: verb · level: A2 · id: en-a2-past-questions-w03
> uk: пропускати; не встигнути (на транспорт); сумувати за
> example: I **missed** the bus, so I was late. — Я не встиг на автобус, тому запізнився.
> note: I miss you — я сумую за тобою.

> [!word] notice
> ipa: /ˈnəʊ.tɪs/ · ipa-us: /ˈnoʊ.t̬ɪs/ · pos: verb · level: A2 · id: en-a2-past-questions-w04
> uk: помічати
> example: Did you **notice** her new haircut? — Ти помітив її нову стрижку?

> [!word] invite
> ipa: /ɪnˈvaɪt/ · pos: verb · level: A2 · id: en-a2-past-questions-w05
> uk: запрошувати
> example: Who did you **invite** to the wedding? — Кого ви запросили на весілля?

> [!word] recognise
> ipa: /ˈrek.əɡ.naɪz/ · pos: verb · level: A2 · id: en-a2-past-questions-w06
> uk: упізнавати
> example: I didn't **recognise** you with glasses! — Я не впізнав тебе в окулярах!
> note: recognise (UK) / recognize (US).

> [!word] by mistake
> ipa: /baɪ mɪˈsteɪk/ · pos: phrase · level: A2 · id: en-a2-past-questions-w07
> uk: помилково, випадково
> example: I took your umbrella **by mistake**. — Я помилково взяв твою парасольку.

> [!word] on purpose
> ipa: /ɒn ˈpɜː.pəs/ · ipa-us: /ɑːn ˈpɝː.pəs/ · pos: phrase · level: A2 · id: en-a2-past-questions-w08
> uk: навмисно
> example: Sorry! I didn't do it **on purpose**. — Вибач! Я не навмисно.

> [!word] tell the truth
> ipa: /ˌtel ðə ˈtruːθ/ · pos: phrase · level: A2 · id: en-a2-past-questions-w09
> uk: казати правду
> example: Did he **tell the truth**? — Він сказав правду?
> note: тільки tell, не say: tell the truth, tell a lie.

> [!word] lie
> ipa: /laɪ/ · pos: verb · level: A2 · id: en-a2-past-questions-w10
> forms: lie → lied → lied
> uk: брехати
> example: She **lied** to me about her age. — Вона збрехала мені про свій вік.
> note: у значенні «брехати» — правильне дієслово. Іменник: a lie — брехня.

## Слухаємо

> [!listen] Що ти почув?
> level: A2 · type: choice · id: en-a2-past-questions-l01
> audio: Did you call her?
> - [ ] Do you call her?
> - [x] Did you call her?
> - [ ] Did you tell her?

> [!listen] Що ти почув?
> level: A2 · type: choice · id: en-a2-past-questions-l02
> audio: She didn't come.
> - [x] She didn't come.
> - [ ] She doesn't come.
> - [ ] She did come.

> [!listen] Надрукуй почуте
> level: A2 · type: dictation · id: en-a2-past-questions-l03
> audio: Why did you leave so early?

> [!listen] Надрукуй почуте
> level: A2 · type: dictation · id: en-a2-past-questions-l04
> audio: We didn't have time for lunch.

> [!listen] Чому Ден не пішов на вечірку?
> level: A2 · type: answer · id: en-a2-past-questions-l05
> audio: A: Did you go to Maria's party on Friday?
> audio: B: No, I didn't. I wanted to, but I missed the last bus.
> audio: A: Oh no! Who told you about it?
> audio: B: Maria did. She sent me a message.
> - [ ] Його не запросили
> - [x] Він не встиг на останній автобус
> - [ ] Він захворів
> - [ ] Він забув про вечірку

> [!listen] Що сталося з телефоном?
> level: A2 · type: answer · id: en-a2-past-questions-l06
> audio: A: What happened to your phone?
> audio: B: I dropped it in the street.
> audio: A: Did it break?
> audio: B: No, it didn't, luckily. But there's a scratch on the screen.
> - [ ] Його вкрали
> - [ ] Він розбився
> - [x] Його впустили, він не зламався, але на екрані подряпина
> - [ ] Його забули в автобусі

## Вимова

> [!speak] Скажи вголос
> level: A2 · id: en-a2-past-questions-s01
> text: Did you have a good weekend?
> ipa: /dɪd ju ˌhæv ə ˌɡʊd ˌwiːkˈend/
> tip: у швидкій мові did you зливається в /ˈdɪdʒə/ — «діджу». Голос угору в кінці: це питання «так / ні».

> [!speak] Скажи вголос
> level: A2 · id: en-a2-past-questions-s02
> text: I didn't see him.
> ipa: /aɪ ˈdɪd.ənt ˈsiː ɪm/
> tip: didn't — два склади: ДІД-нт; кінцеве t майже не чути. him без h — /ɪm/: так говорять носії.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-past-questions-s03
> text: What did you do yesterday?
> ipa: /ˈwɒt dɪd ju ˈduː ˈjes.tə.deɪ/
> tip: наголос на what і do — це головні слова. did you — швидко й тихо.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-past-questions-s04
> text: Where did you go on holiday?
> ipa: /ˈweə dɪd ju ˈɡəʊ ɒn ˈhɒl.ə.deɪ/
> tip: holiday — наголос на перший склад: ХО-лі-дей. Голос униз у кінці: це wh-питання.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-past-questions-s05
> text: Who told you that?
> ipa: /ˈhuː ˈtəʊld ju ˈðæt/
> tip: who — /huː/, h — легкий видих, не «г» і не «х». told — «тоулд», з дифтонгом.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-past-questions-s06
> text: No, I didn't.
> ipa: /nəʊ aɪ ˈdɪd.ənt/
> tip: коротка відповідь звучить упевнено: наголос на didn't, голос униз.

## Типові помилки українців

> [!pitfall] «Did you went?», «I didn't saw»
> Минуле позначаємо **один раз**. Є *did* — дієслово базове: *Did you **go**? I didn't **see** it.* Дві мітки минулого в одному реченні — як дві крапки в кінці.

> [!pitfall] «Where you went?» — без did
> Українською питання часто звучить як стверджувальне речення з інтонацією: «Куди ти пішов?». Англійською потрібен помічник і порядок QASI: ***Where did you go?***

> [!pitfall] «Who did call you?», «What did happen?»
> Коли *who / what* — це той, **хто** діє, *did* не потрібен: ***Who called** you? **What happened**?* Форма з *did* («Who did call you?») можлива лише як емоційне підкреслення, а «What did happen?» у звичайному питанні — помилка.

## Практика

> [!quiz] «Хто тобі подзвонив?» — як сказати?
> level: A2 · id: en-a2-past-questions-q04
> - [ ] Who did you call?
> - [x] Who called you?
> - [ ] Who did call you?
> - [ ] Who you called?
>
> **Пояснення:** питаємо про того, **хто** дзвонив, — *who* є підметом, тому без *did* і дієслово в минулому: *called*. *Who did you call?* — «Кому ти дзвонив?».

> [!quiz] Склади питання: «Де ти купив цю куртку?»
> level: A2 · type: order · id: en-a2-past-questions-q05
>
> ```text order
> Where
> did
> you
> buy
> that jacket?
> bought // ✗
> ```
>
> **Пояснення:** QASI: *Where* → *did* → *you* → **buy** (V1). *Bought* тут зайве — минуле вже в *did*.

> [!quiz] Встав коротку відповідь
> level: A2 · id: en-a2-past-questions-q06
>
> *Did your team win yesterday? — No, they ___. They lost.*
>
> - [ ] don't
> - [ ] weren't
> - [x] didn't
> - [ ] didn't win it
>
> **Пояснення:** питання з *did* → відповідь *did / didn't*. Основне дієслово в короткій відповіді не повторюємо.

> [!quiz] Зроби речення заперечними
> level: A2 · type: fill · id: en-a2-past-questions-q07
>
> ```text fill
> I saw the film. → I [[didn't see|did not see]] the film.
> She went to work. → She [[didn't go|did not go]] to work.
> They had lunch. → They [[didn't have|did not have]] lunch.
> ```
>
> **Пояснення:** *didn't* + V1: *saw → didn't see, went → didn't go, had → didn't have*.

> [!quiz] Обери всі правильні речення
> level: A2 · id: en-a2-past-questions-q08
> - [x] Did you enjoy the trip?
> - [ ] Where did you went?
> - [x] What happened next?
> - [ ] I didn't knew the answer.
> - [x] Why didn't she call?
>
> **Пояснення:** після *did / didn't* — тільки V1: *Where did you **go**? I didn't **know***. *What happened?* — правильно без *did*, бо *what* тут підмет.

> [!quiz] «Ти був на роботі вчора?» — як правильно?
> level: A2 · id: en-a2-past-questions-q09
> - [ ] Did you be at work yesterday?
> - [ ] Did you was at work yesterday?
> - [x] Were you at work yesterday?
> - [ ] You were at work yesterday?
>
> **Пояснення:** *to be* не дружить з *did*: питання будуємо перестановкою — ***Were** you…?*

> [!quiz] Склади питання: «Що сталося на зустрічі?»
> level: A2 · type: order · id: en-a2-past-questions-q10
>
> ```text order
> What
> happened
> at the meeting?
> did // ✗
> ```
>
> **Пояснення:** *what* — підмет (що сталося?), тож *did* не потрібен: *What happened…?*

> [!quiz] Встав питальне слово і did, де потрібно
> level: A2 · type: fill · bank: When, Whose · id: en-a2-past-questions-q11
>
> ```text fill
> [[Who]] broke the window? — The kids next door.
> [[Who]] [[did]] you meet at the party? — My old teacher.
> [[Why]] [[did]] they leave so early? — They were tired.
> ```
>
> **Пояснення:** перше питання — про того, **хто** розбив, тому *did* немає: *Who broke…?* У другому *who* — **кого** зустрів, отже *Who did you meet?* Третє — звичайне питання з *Why did…?*

> [!quiz] «Who did you meet?» — що це означає?
> level: A2 · id: en-a2-past-questions-q12
> - [ ] Хто тебе зустрів?
> - [x] Кого ти зустрів?
> - [ ] Хто кого зустрів?
> - [ ] Ти когось зустрів?
>
> **Пояснення:** є *did* і підмет *you* — отже, *you* зустрічав, а *who* — це **кого**. «Хто тебе зустрів?» = *Who met you?*

> [!quiz] Склади речення: «Вона не сказала мені правду»
> level: A2 · type: order · id: en-a2-past-questions-q13
>
> ```text order
> She
> didn't
> tell
> me
> the truth.
> told // ✗
> ```
>
> **Пояснення:** *didn't* + V1 (**tell**). «Казати правду» — завжди *tell the truth*.

> [!quiz] Знайди правильний варіант
> level: A2 · id: en-a2-past-questions-q14
> - [ ] Why you didn't call me?
> - [ ] Why did you didn't call me?
> - [x] Why didn't you call me?
> - [ ] Why not you called me?
>
> **Пояснення:** у запереченому питанні *didn't* стоїть одразу після питального слова, перед підметом: *Why **didn't** you call…?*

## Фішки

> [!reel] 🎒 Минуле — один рюкзак на речення
> Did і went — обидва «несуть минуле». Тому разом вони не ходять: або She went, або Did she go? Двох рюкзаків на одне речення не буває.

> [!reel] 🗣️ «Didja see that?»
> У живій мові did you злипається в /ˈdɪdʒə/. Американці навіть пишуть так у коміксах: Didja see that? Почуєш «джа» — шукай у реченні did you.

> [!reel] 💪 Did для наголосу
> У стверджувальному реченні did теж буває — для емоції: I did lock the door! — «Я ж таки замкнув двері!». Наголос падає саме на did.

## Джерела та що почитати

- 🟢 R. Murphy — *Essential Grammar in Use* (Cambridge): розділи про *I didn't… / Did you…?* і питання *Who saw you? / Who did you see?*
- 🟢 [Cambridge Dictionary — Past simple (I worked)](https://dictionary.cambridge.org/grammar/british-grammar/past-simple-i-worked) — заперечення й питання.
- 🟡 [Cambridge Dictionary — Questions: wh- questions](https://dictionary.cambridge.org/grammar/british-grammar/questions-wh-questions) — порядок слів у спеціальних питаннях.
- 🟡 [Cambridge Dictionary — Questions: interrogative pronouns (what, who)](https://dictionary.cambridge.org/grammar/british-grammar/questions-interrogative-pronouns-what-who) — коли *who / what* підмет, а коли додаток.
- 🟡 [BBC Learning English](https://www.bbc.co.uk/learningenglish) — вправи на питання в минулому.

> [!important] Підсумок
> - Заперечення: **didn't + V1** — *I didn't go*.
> - Питання: **Did + підмет + V1?** — *Did you go?*; спеціальне — **QASI**: *Where did you go?*
> - Короткі відповіді: *Yes, I did. / No, I didn't.*
> - *Who / what* — підмет → без *did*: *Who called you? What happened?*; додаток → з *did*: *Who did you call?*
> - *Was / were* питання й заперечення будують без *did*.
