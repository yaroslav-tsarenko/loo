---
title: Present Simple — питання й заперечення
order: 115
id: en-a1-present-questions
level: A1
icon: px:question
tags: [english, a1, grammar, present-simple, questions, negatives]
prerequisites: ["[[English - A1 - 14. Present Simple — стверджувальні речення]]"]
estimatedMinutes: 40
---

# Present Simple — питання й заперечення

> [!success] Після цієї теми ти зможеш
> - заперечувати: *I don't eat meat. She doesn't smoke.*;
> - ставити питання «так / ні»: *Do you work here? Does he speak English?*;
> - ставити питання з *what, where, when, who, why, how*: *Where do you live?*;
> - коротко відповідати: *Yes, I do. / No, she doesn't.*;
> - не робити класичну помилку «Where you live?».

## Передбач

> [!quiz] Як спитати «Де ти живеш?»
> level: A1 · id: en-a1-present-questions-q01
> - [ ] Where you live?
> - [ ] Where are you live?
> - [x] Where do you live?
> - [ ] Where you do live?
>
> **Пояснення:** українською питання часто відрізняється від твердження лише інтонацією. Англійське питання в Present Simple потребує **помічника do**, і він стоїть **перед підметом**: *Where **do** you live?*

## Помічник do / does

У Present Simple звичайні дієслова не вміють самі робити питання й заперечення. На допомогу приходить «службове» дієслово **do** (для he / she / it — **does**). Воно нічого не перекладається, а лише «тримає» граматику.

| | I / you / we / they | he / she / it |
|---|---|---|
| + | I **work**. | She **works**. |
| − | I **don't** work. | She **doesn't** work. |
| ? | **Do** you work? | **Does** she work? |

*Don't* = *do not*, *doesn't* = *does not*. У розмові — майже завжди скорочення.

> [!diagram] Куди зникає -s: works → doesn't work
> ```yaml
> layout: flow
> nodes:
>   - { id: subj, label: "підмет", text: "She", tone: blue }
>   - { id: aux, label: "помічник", text: "—", tone: yellow }
>   - { id: verb, label: "дієслово", text: "works", tone: violet }
>   - { id: rest, label: "решта", text: "at a bank.", tone: gray }
> steps:
>   - { focus: [subj, verb], note: "Твердження: She works at a bank. Позначка he / she / it — це -s у works." }
>   - { set: { aux: "does" }, move: { from: verb, to: aux, value: "-s" }, note: "Для заперечення кличемо помічника. -s «перестрибує» до нього: do + s = does." }
>   - { set: { aux: "doesn't", verb: "work" }, focus: [aux, verb], note: "Додаємо not → doesn't. Дієслово лишається БЕЗ -s: She doesn't work at a bank." }
>   - { set: { subj: "Does she", aux: "", rest: "at a bank?" }, focus: subj, note: "У питанні does стає перед підметом: Does she work at a bank? Дієслово знову без -s." }
> ```

> [!warning] -s буває лише один раз
> Якщо в реченні є *does* або *doesn't*, основне дієслово — **без -s**: *She doesn't work* (не «doesn't works»), *Does he like…?* (не «Does he likes»). Позначку he / she / it уже «забрав» помічник.

## Заперечення

| Англійською | Переклад |
|---|---|
| I **don't** eat meat. | Я не їм мʼяса. |
| My dad **doesn't** smoke. | Тато не курить. |
| We **don't** have a car. | У нас немає машини. |
| She **doesn't** like horror films. | Вона не любить фільми жахів. |
| They **don't** live here. | Вони тут не живуть. |

## Питання «так / ні» і короткі відповіді

**Do / Does + підмет + дієслово (без -s) + решта?**

| Питання | Так | Ні |
|---|---|---|
| **Do** you speak English? | Yes, I **do**. | No, I **don't**. |
| **Does** your sister work? | Yes, she **does**. | No, she **doesn't**. |
| **Do** they live near here? | Yes, they **do**. | No, they **don't**. |
| **Does** the shop open on Sunday? | Yes, it **does**. | No, it **doesn't**. |

Коротка відповідь повторює помічника, а не основне дієслово: *Do you like it? — Yes, I **do**.* (не «Yes, I like»).

## Питання з питальними словами

**Питальне слово + do / does + підмет + дієслово + решта?** Цю схему часто запамʼятовують як **QUASI**: **Q**uestion word, **A**uxiliary (do / does), **S**ubject, **I**nfinitive (дієслово).

| Слово | Значення | Приклад | Переклад |
|---|---|---|---|
| what | що, який | What **do** you do? | Ким ти працюєш? |
| where | де, куди | Where **does** she live? | Де вона живе? |
| when | коли | When **do** you get up? | Коли ти встаєш? |
| what time | о котрій | What time **does** the film start? | О котрій починається фільм? |
| who | кого, з ким | Who **do** you live with? | З ким ти живеш? |
| why | чому | Why **do** you study English? | Чому ти вчиш англійську? |
| how | як | How **do** you get to work? | Як ти добираєшся на роботу? |
| how often | як часто | How often **does** he call you? | Як часто він тобі дзвонить? |
| which | який (з кількох) | Which bus **do** you take? | Яким автобусом ти їдеш? |

> [!diagram] Збираємо питання за схемою QUASI
> ```yaml
> layout: flow
> nodes:
>   - { id: q, label: "Q — питальне слово", text: "Where", tone: yellow }
>   - { id: a, label: "A — помічник", text: "?", tone: violet }
>   - { id: s, label: "S — підмет", text: "your brother", tone: blue }
>   - { id: i, label: "I — дієслово", text: "?", tone: green }
> steps:
>   - { focus: q, note: "Питання «Де працює твій брат?» починаємо з питального слова: Where." }
>   - { set: { a: "does" }, focus: a, note: "Підмет your brother = he, тому помічник — does. Він стоїть одразу після Where." }
>   - { focus: s, note: "Потім підмет: your brother." }
>   - { set: { i: "work?" }, focus: i, note: "І дієслово в початковій формі: work — без -s, бо -s уже в does. Where does your brother work?" }
>   - { set: { a: "do", s: "you", i: "live?" }, note: "Та сама схема для you: Where do you live? Пропустиш do — вийде «Where you live?», найчастіша помилка." }
> ```

> [!tip] Who без do
> Якщо *who* питає про **підмет** (хто робить дію), *do* не потрібне, а дієслово отримує -s: ***Who lives** here?* — Хто тут живе? Порівняй: ***Who do you** live with?* — З ким ти живеш? (тут *you* — підмет). Детально — на рівні A2.

## Be чи do?

Не кожне питання потребує *do*! Якщо в реченні є **be** (*am / is / are*), він сам робить питання й заперечення.

| З be | З іншим дієсловом |
|---|---|
| **Are** you a student? | **Do** you study? |
| She **isn't** at home. | She **doesn't** live here. |
| Where **is** he from? | Where **does** he come from? |

Ніколи не поєднуй: «Do you are…?», «Are you live…?» — помилки.

## Приклади

- I don't drink coffee, but I love tea. — Я не пʼю каву, але обожнюю чай.
- Does your son go to school? — Yes, he does. — Твій син ходить до школи? — Так.
- What do you do? — I'm a nurse. — Ким ти працюєш? — Я медсестра.
- Why do you get up so early? — Because I start work at seven. — Чому ти встаєш так рано? — Бо починаю роботу о сьомій.
- My grandma doesn't use the internet. — Моя бабуся не користується інтернетом.
- How often do you see your parents? — Як часто ти бачишся з батьками?
- We don't work on Saturdays. — Ми не працюємо по суботах.
- Do they remember us? — Вони нас памʼятають?
- Which one do you want, the red one or the blue one? — Який ти хочеш, червоний чи синій?

## Слова

> [!word] why
> ipa: /waɪ/ · pos: adv · level: A1 · id: en-a1-present-questions-w01
> uk: чому; навіщо
> example: **Why** do you live in the city? — Чому ти живеш у місті?

> [!word] because
> ipa: /bɪˈkɒz/ · ipa-us: /bɪˈkʌz/ · pos: conj · level: A1 · id: en-a1-present-questions-w02
> uk: тому що; бо
> example: I study English **because** I want to travel. — Я вчу англійську, бо хочу подорожувати.
> note: розмовне — 'cause /kəz/.

> [!word] when
> ipa: /wen/ · pos: adv · level: A1 · id: en-a1-present-questions-w03
> uk: коли
> example: **When** do you have lunch? — Коли ти обідаєш?

> [!word] where
> ipa: /weə/ · ipa-us: /wer/ · pos: adv · level: A1 · id: en-a1-present-questions-w04
> uk: де; куди
> example: **Where** does your sister work? — Де працює твоя сестра?

> [!word] who
> ipa: /huː/ · pos: pron · level: A1 · id: en-a1-present-questions-w05
> uk: хто; кого
> example: **Who** do you live with? — З ким ти живеш?
> note: w не читається: «хуу».

> [!word] how
> ipa: /haʊ/ · pos: adv · level: A1 · id: en-a1-present-questions-w06
> uk: як
> example: **How** do you spell your name? — Як пишеться твоє імʼя?

> [!word] which
> ipa: /wɪtʃ/ · pos: pron · level: A1 · id: en-a1-present-questions-w07
> uk: який (з кількох); котрий
> example: **Which** colour do you like, red or green? — Який колір тобі подобається, червоний чи зелений?
> note: what — вибір без обмежень; which — з кількох відомих варіантів.

> [!word] remember
> ipa: /rɪˈmembə/ · ipa-us: /rɪˈmembər/ · pos: verb · level: A1 · id: en-a1-present-questions-w08
> uk: памʼятати; згадувати
> example: Do you **remember** my name? — Ти памʼятаєш, як мене звати?

> [!word] really
> ipa: /ˈrɪəli/ · ipa-us: /ˈriːəli/ · pos: adv · level: A1 · id: en-a1-present-questions-w09
> uk: справді; дуже
> example: I don't **really** like football. — Я не дуже люблю футбол.
> note: Really? — Справді? (реакція в розмові).

> [!word] different
> ipa: /ˈdɪfrənt/ · pos: adj · level: A1 · id: en-a1-present-questions-w10
> uk: різний; інший
> example: My brother and I are very **different**. — Ми з братом дуже різні.
> note: different from — відмінний від.

> [!word] the same
> ipa: /ðə ˈseɪm/ · pos: phrase · level: A1 · id: en-a1-present-questions-w11
> uk: той самий; однаковий
> example: We work in **the same** office. — Ми працюємо в одному офісі.
> note: завжди з the: the same, не «same» самостійно в реченні.

> [!word] smoke
> ipa: /sməʊk/ · ipa-us: /smoʊk/ · pos: verb · level: A1 · id: en-a1-present-questions-w12
> uk: курити; диміти
> example: My dad doesn't **smoke**. — Тато не курить.

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-present-questions-l01
> audio: She doesn't eat meat.
> - [ ] She don't eat meat.
> - [x] She doesn't eat meat.
> - [ ] She doesn't eat fish.

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-present-questions-l02
> audio: Where does he work?
> - [x] Where does he work?
> - [ ] Where do you work?
> - [ ] Where is he working?

> [!listen] Надрукуй почуте
> level: A1 · type: dictation · speed: slow · id: en-a1-present-questions-l03
> audio: Do you speak English?

> [!listen] Надрукуй почуте
> level: A1 · type: dictation · speed: slow · id: en-a1-present-questions-l04
> audio: I don't remember.

> [!listen] Послухай. Що правда про Ніну?
> level: A1 · type: answer · speed: slow · id: en-a1-present-questions-l05
> audio: A: Does Nina drive to work?
> audio: B: No, she doesn't. She doesn't have a car. She goes by bus.
> - [ ] Ніна їздить на роботу машиною.
> - [x] Ніна їздить автобусом, машини в неї немає.
> - [ ] Ніна ходить пішки.

> [!listen] Послухай. Чому Ден вчить польську?
> level: A1 · type: answer · speed: slow · id: en-a1-present-questions-l06
> audio: A: Why do you study Polish, Dan?
> audio: B: Because my girlfriend is from Kraków.
> - [ ] бо працює в Польщі
> - [x] бо його дівчина з Кракова
> - [ ] бо любить польське кіно

## Вимова

> [!speak] Скажи вголос
> level: A1 · id: en-a1-present-questions-s01
> text: Do you live here?
> ipa: /də juː ˈlɪv hɪə/
> tip: do на початку питання слабке /də/ — «дьо-ю». Голос угору ↗.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-present-questions-s02
> text: Where do you work?
> ipa: /ˌweə də juː ˈwɜːk/
> tip: wh-питання — голос униз ↘ у кінці. Наголос на WORK.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-present-questions-s03
> text: She doesn't like coffee.
> ipa: /ʃi ˈdʌznt laɪk ˈkɒfi/
> tip: doesn't — «дазнт», дзвінке /z/; t у кінці майже не чути.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-present-questions-s04
> text: Yes, I do. No, he doesn't.
> ipa: /jes aɪ ˈduː nəʊ hi ˈdʌznt/
> tip: у короткій відповіді do — повне й наголошене /duː/.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-present-questions-s05
> text: Why do you study English?
> ipa: /ˌwaɪ də juː ˈstʌdi ˈɪŋɡlɪʃ/
> tip: English — «інгліш», не «енгліш».

## Типові помилки українців

> [!pitfall] «Where you live?», «You like coffee?»
> Українське питання будується інтонацією, тож рука «забуває» помічника. Англійська вимагає: ***Where do you live? Do you like coffee?*** (У розмові *You like coffee?* з інтонацією буває, але це неформальне перепитування, а не норма.)

> [!pitfall] «Does she works?», «He doesn't likes»
> Після *does / doesn't* — **початкова форма**: *Does she work? He doesn't like.* -s з'являється в реченні лише один раз.

> [!pitfall] «I don't know nothing» — подвійне заперечення
> Українською «я нічого не знаю» — два заперечення, і це норма. В англійській одне заперечення: ***I don't know anything*** або *I know nothing*. «I don't know nothing» — помилка (або дуже розмовне просторіччя).

## Ситуація: співбесіда в мовній школі

> [!listen] Адміністраторка знайомиться з новим студентом
> level: A1 · type: choice · speed: slow · id: en-a1-present-questions-l07
> audio: A: Do you speak any other languages?
> audio: B: Yes, I do. I speak Ukrainian and a little Polish.
> audio: A: And why do you want to learn English?
> audio: B: Because I work with people from different countries.
> audio: A: Great. When do you finish work?
> audio: B: At six. So evening classes are perfect.
> - [x] Студент знає українську й трохи польську, закінчує роботу о шостій.
> - [ ] Студент не знає інших мов і працює вечорами.
> - [ ] Студент хоче денні заняття.

Відповідай адміністраторці.

> [!speak] «Бо я працюю з людьми з різних країн».
> level: A1 · id: en-a1-present-questions-s06
> text: Because I work with people from different countries.
> ipa: /bɪˈkɒz aɪ ˈwɜːk wɪð ˈpiːpl frəm ˈdɪfrənt ˈkʌntriz/
> tip: different — два склади в розмові: «ДІФ-рент».

## Практика

> [!quiz] Обери правильне: «My brother ___ like fish.»
> level: A1 · id: en-a1-present-questions-q02
> - [ ] don't
> - [x] doesn't
> - [ ] isn't
> - [ ] not
>
> **Пояснення:** *my brother* = *he* → *doesn't*. *Isn't* — заперечення для *be*, а тут дієслово *like*.

> [!quiz] Обери правильне питання
> level: A1 · id: en-a1-present-questions-q03
> - [ ] Does she works here?
> - [ ] Do she work here?
> - [x] Does she work here?
> - [ ] Is she work here?
>
> **Пояснення:** *she* → *does*, дієслово без -s.

> [!quiz] «Do you have a pet?» Яка коротка відповідь правильна?
> level: A1 · id: en-a1-present-questions-q04
> - [ ] Yes, I have a pet do.
> - [x] Yes, I do.
> - [ ] Yes, I am.
> - [ ] Yes, I does.
>
> **Пояснення:** питання з *do* → відповідь з *do*: *Yes, I do / No, I don't*.

> [!quiz] Обери всі правильні речення
> level: A1 · type: multi · id: en-a1-present-questions-q05
> - [x] Where do your parents live?
> - [ ] Where your parents live?
> - [x] He doesn't speak French.
> - [ ] Are you work on Mondays?
> - [x] What time does the shop open?
>
> **Пояснення:** питання потребує *do / does*; з дієсловом *work* не вживаємо *are*: *Do you work on Mondays?*

> [!quiz] Яке питання про Тараса граматично правильне?
> level: A1 · id: en-a1-present-questions-q06
> - [ ] Where Taras lives?
> - [ ] Where does Taras lives?
> - [x] Where does Taras live?
> - [ ] Where do Taras live?
>
> **Пояснення:** *Taras* = *he* → *does* + *live* без -s.

> [!quiz] Яке питання — до «I go to the gym three times a week»?
> level: A1 · id: en-a1-present-questions-q07
> - [ ] Where do you go?
> - [x] How often do you go to the gym?
> - [ ] Why do you go to the gym?
> - [ ] When does you go to the gym?
>
> **Пояснення:** *three times a week* відповідає на *How often…?* (як часто).

> [!quiz] Як перекласти «Вона не памʼятає мій номер»?
> level: A1 · id: en-a1-present-questions-q08
> - [ ] She don't remember my number.
> - [ ] She doesn't remembers my number.
> - [x] She doesn't remember my number.
> - [ ] She isn't remember my number.
>
> **Пояснення:** *she* → *doesn't* + *remember* без -s.

> [!quiz] Заповни пропуски: do, does, don't, doesn't
> level: A1 · type: fill · bank · id: en-a1-present-questions-q09
>
> ```text fill
> A: [[Do]] you like jazz?
> B: No, I [[don't]]. But my wife loves it.
> A: [[Does]] she play an instrument?
> B: Yes, she [[does]]. She plays the piano. But she [[doesn't]] sing.
> ```
>
> **Пояснення:** *you* → *do / don't*, *she* → *does / doesn't*.

> [!quiz] Заповни питальні слова
> level: A1 · type: fill · bank: who, which · id: en-a1-present-questions-q10
>
> ```text fill
> [[Where]] do you live? — In Kyiv.
> [[When]] does the lesson start? — At ten.
> [[Why]] do you get up so early? — Because I start work at seven.
> [[How]] do you go to work? — By metro.
> ```
>
> **Пояснення:** місце — *where*, час — *when*, причина — *why*, спосіб — *how*.

> [!quiz] Заповни заперечення
> level: A1 · type: fill · id: en-a1-present-questions-q11
>
> ```text fill
> I like tea, but I [[don't]] like coffee.
> Max eats fish, but he [[doesn't]] eat meat.
> They speak English, but they [[don't]] speak French.
> ```
>
> **Пояснення:** I / they → *don't*, Max (he) → *doesn't*.

> [!quiz] Склади питання: «Де працює твоя мама?»
> level: A1 · type: order · id: en-a1-present-questions-q12
>
> ```text order
> Where
> does
> your
> mum
> work?
> works? // ✗
> ```
>
> **Пояснення:** QUASI: *Where* → *does* → *your mum* → *work* (без -s).

> [!quiz] Склади речення: «Ми не працюємо в неділю»
> level: A1 · type: order · id: en-a1-present-questions-q13
>
> ```text order
> We
> don't
> work
> on
> Sundays.
> aren't // ✗
> ```
>
> **Пояснення:** заперечення звичайного дієслова — *don't*; *aren't* — лише для *be*.

> [!quiz] Склади питання: «Чому ти вчиш англійську?»
> level: A1 · type: order · id: en-a1-present-questions-q14
>
> ```text order
> Why
> do
> you
> study
> English?
> ```
>
> **Пояснення:** питальне слово → *do* → *you* → дієслово → решта.

## Фішки

> [!reel] 🧩 Do — найпрацьовитіше слово англійської
> *Do* буває і помічником (*Do you know?*), і звичайним дієсловом «робити». Тому *What do you do?* — нормальне питання: «Що ти робиш (за фахом)?», тобто «Ким ти працюєш?»

> [!reel] 🎸 I can't get no satisfaction
> Rolling Stones співають подвійне заперечення — і в пісні це звучить круто. Але це розмовний стиль. На співбесіді чи в листі — *I can't get any satisfaction*.

> [!reel] 🗣️ Do you…? звучить як «дʼю»
> У швидкій розмові *Do you* зливається в /dʒə/ — «дже»: *D'you like it?* Почуєш «Джелайкіт?» — це воно.

## Джерела та що почитати

- [British Council LearnEnglish — A1–A2 grammar](https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar) — розділ *Present simple: questions and negatives*.
- [Cambridge Dictionary — English Grammar Today](https://dictionary.cambridge.org/grammar/british-grammar/) — статті *Questions* і *Negation*.
- R. Murphy — *Essential Grammar in Use*, units 6–8 (don't / doesn't, Do you…?, питальні слова).

> [!important] Підсумок
> - Заперечення: *don't / doesn't* + початкова форма: *She doesn't work.*
> - Питання: *Do / Does* + підмет + дієслово: *Does he speak English?*
> - Питальні слова — схема QUASI: *Where do you live? What time does it start?*
> - Короткі відповіді: *Yes, I do. / No, she doesn't.*
> - -s лише один раз: *does work*, не «does works»; з *be* — без *do*: *Are you…?*
