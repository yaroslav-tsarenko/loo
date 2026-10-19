---
title: Question tags і непрямі питання
order: 326
id: en-b1-questions
level: B1
icon: px:questionBlock
tags: [english, b1, grammar, question-tags, indirect-questions, politeness, intonation]
prerequisites: ["[[English - A2 - 18. Інтонація — питання, переліки, емоції]]", "[[English - B1 - 08. Майбутнє — will, going to, Present Continuous, розклад]]"]
estimatedMinutes: 40
---

# Question tags і непрямі питання

> [!success] Після цієї теми ти зможеш
> - будувати question tags: **It's cold, isn't it?**, **You didn't call, did you?**, **I'm right, aren't I?**;
> - інтонацією показати, питаєш ти чи просиш погодитися: ↘ **isn't it?** проти ↗ **isn't it?**;
> - правильно відповідати на заперечні питання: **You aren't coming, are you? — No, I'm not**;
> - ставити ввічливі непрямі питання: **Could you tell me where the station is?**, **Do you know if it's open?**;
> - писати офіційний лист-запит у форматі IELTS General Training.

## Передбач

> [!quiz] «Ти ж з Одеси, так?» Як сказати англійською?
> level: B1 · id: en-b1-questions-q01
> - [ ] You are from Odesa, yes?
> - [x] You're from Odesa, aren't you?
> - [ ] You're from Odesa, isn't it?
> - [ ] You're from Odesa, are you?
>
> **Пояснення:** українське «так?», «правда?», «чи не так?» англійською — **question tag**: коротке питання в кінці, яке повторює допоміжне дієслово з протилежним знаком: *You **are** … , **aren't** you?* «Isn't it?» на все підряд, як «правда?», не працює.

## Простими словами

**Question tag** — це «хвостик» у кінці речення, яким ти просиш співрозмовника підтвердити або погодитися: «гарний день, правда?», «ти ж не забув, так?». Українською хвостик завжди однаковий — «так?», «правда?». Англійською він **будується з самого речення**: беремо допоміжне дієслово, міняємо знак і додаємо займенник.

**Непряме питання** — це питання, «загорнуте» у ввічливу фразу: не *Where is the station?*, а *Could you tell me where the station **is**?* Усередині обгортки порядок слів стає як у звичайному реченні — підмет перед дієсловом. Так звучить чемніше, особливо з незнайомими людьми, у магазині, на роботі, в офіційних листах.

> [!diagram] Як зібрати question tag
> ```yaml
> layout: flow
> nodes:
>   - { id: sent, label: "речення", text: "She has finished the report", tone: blue }
>   - { id: aux, label: "1. допоміжне", text: "has", tone: violet }
>   - { id: flip, label: "2. протилежний знак", text: "hasn't", tone: orange }
>   - { id: pron, label: "3. займенник", text: "she", tone: yellow }
>   - { id: tag, label: "tag", text: "She has finished the report, hasn't she?", tone: green, icon: "px:check" }
> steps:
>   - { show: sent, note: "Починаємо з твердження: She has finished the report." }
>   - { move: { from: sent, to: aux, value: "has" }, note: "Знаходимо допоміжне дієслово. Тут воно є — has (Present Perfect)." }
>   - { move: { from: aux, to: flip, value: "has → hasn't" }, note: "Речення стверджувальне — tag заперечний. І навпаки: заперечне речення — стверджувальний tag." }
>   - { move: { from: flip, to: pron, value: "she" }, note: "Підмет замінюємо займенником: the report → it, Anna → she, my parents → they." }
>   - { move: { from: pron, to: tag, value: "hasn't she?" }, note: "Готово: She has finished the report, hasn't she? Без допоміжного (Present / Past Simple) беремо do / does / did: She works here, doesn't she?" }
> ```

## Пояснення

### Question tags — головне правило

**Стверджувальне речення → заперечний tag. Заперечне речення → стверджувальний tag.** У tag повторюється допоміжне дієслово (або *be*, модальне), а підмет стає займенником.

| Речення | Tag | Приклад |
|---|---|---|
| **be** | is / are / was / were | It **was** a great film, **wasn't it**? |
| Present Simple | do / does | You **like** jazz, **don't you**? · She **works** here, **doesn't she**? |
| Past Simple | did | They **didn't** call, **did they**? |
| Perfect | have / has / had | You'**ve** been to Paris, **haven't you**? |
| модальне | can / will / should… | We **can** park here, **can't we**? · He **won't** be late, **will he**? |

### Особливі випадки

| Випадок | Приклад |
|---|---|
| **I am → aren't I?** | I'**m** right, **aren't I**? (не ~~amn't I~~) |
| **Let's → shall we?** | **Let's** go, **shall we**? |
| **Наказовий спосіб → will you? / can you? / could you?** | **Close** the door, **will you**? · **Pass** me the salt, **could you**? |
| **There is / are → there** | **There's** a bank near here, **isn't there**? |
| **nobody, no one, nothing, never, hardly** — заперечний зміст → стверджувальний tag | **Nobody** called, **did they**? · **Nothing** happened, **did it**? · You **never** listen, **do you**? |
| **everyone, someone, nobody → they** | **Everyone** is here, **aren't they**? |
| **this / that → it; these / those → they** | **That**'s your car, **isn't it**? |

> [!quiz] Перевір себе: встав tag
> level: B1 · type: fill · bank · id: en-b1-questions-q02
>
> ```text fill
> You've met my brother, [[haven't]] you?
> She doesn't eat meat, [[does]] she?
> They went to the concert, [[didn't]] they?
> It'll be fine, [[won't]] it?
> ```
>
> **Пояснення:** повторюємо допоміжне з протилежним знаком: *'ve → haven't*, *doesn't → does*, *went* (Past Simple) → *didn't*, *'ll → won't*.

> [!quiz] Перевір себе: I'm late, ___?
> level: B1 · id: en-b1-questions-q03
> - [ ] amn't I
> - [ ] am not I
> - [x] aren't I
> - [ ] isn't I
>
> **Пояснення:** з *I am* стандартний tag — **aren't I?** Логіки тут небагато, це просто так усталилося. *Am I not?* існує, але звучить дуже формально.

### Інтонація: питаєш чи просиш погодитися?

- **↘ Спадна** на tag — ти **впевнений** і чекаєш згоди. Це «розмовний клей»: small talk про погоду, коментарі. *It's a lovely day, ↘isn't it?* — *Yes, it's beautiful!*
- **↗ Висхідна** на tag — **справжнє питання**, ти не впевнений. *You've got the keys, ↗haven't you?* (Ти ж узяв ключі? Я не певен.)

### Як відповідати на tag

Носії англійської відповідають **за фактом**, а не «погоджуюся / не погоджуюся з тобою»:

- *You **aren't** coming, are you?* — **No, I'm not.** (= не йду) / **Yes, I am.** (= йду!)
- *You **didn't** forget the tickets, did you?* — **No, I didn't.** They're in my bag. (= не забув)

Українською на «Ти ж не йдеш?» кажуть «Так, не йду» — і англійською це стає плутаниною. Правило: **yes + стверджувальне дієслово, no + заперечне**. Ніколи ~~*Yes, I'm not*~~.

### Непрямі питання — ввічливо й офіційно

> [!diagram] Пряме питання → непряме
> ```yaml
> layout: compare
> columns: { direct: "Пряме питання", indirect: "Непряме питання" }
> nodes:
>   - { id: d1, col: direct, label: "be", text: "Where is the station?", note: "is перед підметом", tone: gray }
>   - { id: i1, col: indirect, label: "підмет + дієслово", text: "Could you tell me where the station is?", note: "is — у кінці, як у твердженні", tone: green }
>   - { id: d2, col: direct, label: "do / does / did", text: "What time does the shop open?", tone: gray }
>   - { id: i2, col: indirect, label: "без do / does", text: "Do you know what time the shop opens?", note: "does зникає, -s переходить на дієслово", tone: green }
>   - { id: d3, col: direct, label: "yes / no", text: "Is the museum open today?", tone: gray }
>   - { id: i3, col: indirect, label: "if / whether", text: "Do you know if the museum is open today?", note: "немає питального слова — додаємо if або whether", tone: green }
> steps:
>   - { show: [d1, i1], note: "Після ввічливої «обгортки» (Could you tell me…) порядок слів — як у звичайному реченні: where the station is." }
>   - { show: [d2, i2], note: "Допоміжні do / does / did зникають, дієслово отримує свою форму: does … open → opens; did … go → went." }
>   - { show: [d3, i3], note: "Питання «так / ні» без питального слова — додаємо if або whether: Do you know if / whether…" }
> ```

**Ввічливі обгортки:**

| Обгортка | Приклад |
|---|---|
| Could you tell me…? | Could you tell me **how much this costs**? |
| Do you know…? | Do you know **where Olena lives**? |
| Do you happen to know…? | Do you happen to know **if there's a bus**? |
| Have you got / Do you have any idea…? | Have you got any idea **what time it starts**? |
| I'd like to know… | I'd like to know **whether the price includes breakfast**. |
| I wonder… / I was wondering… | I wonder **who sent this**. |

> [!warning] Знак питання — лише якщо обгортка питальна
> *Could you tell me where he is**?*** — обгортка — питання, ставимо «?». *I wonder where he is**.*** і *I'd like to know if it's free**.*** — обгортка — твердження, ставимо крапку.

**if чи whether?** У розмові обидва: *I don't know **if / whether** he's coming.* **Whether** формальніше. Воно обовʼязкове, коли одразу після нього йде *or not*, а також після прийменника: *It depends on **whether** we have time.*

> [!quiz] Перевір себе: обери непряме питання
> level: B1 · id: en-b1-questions-q04
>
> Excuse me, could you tell me where ___?
>
> - [ ] is the post office
> - [x] the post office is
> - [ ] does the post office is
> - [ ] the post office is it
>
> **Пояснення:** у непрямому питанні — порядок твердження: *where **the post office is***.

## Приклади

- You're new here, **aren't you**? — Ти тут новенький, так?
- She can't swim, **can she**? — Вона ж не вміє плавати?
- **Let's** order pizza, **shall we**? — Давай замовимо піцу, га?
- **Nobody** noticed, **did they**? — Ніхто ж не помітив, правда?
- A: You **haven't** seen my glasses, **have you**? — B: **No, I haven't**, sorry. — Ти не бачив моїх окулярів? — Ні, на жаль.
- **Could you tell me** what time the last train leaves? — Не підкажете, о котрій відходить останній потяг?
- **Do you know if** this café takes cards? — Не знаєш, тут можна розрахуватися карткою?
- **I wonder whether** they got our message. — Цікаво, чи отримали вони наше повідомлення.
- **Do you happen to know** where the toilets are? — Ви, бува, не знаєте, де туалет?
- **I'd like to know** how long the course lasts. — Я хотів би дізнатися, скільки триває курс.
- **Any idea** why the meeting was cancelled? — Не знаєш, чому скасували нараду?

## Слова

> [!word] wonder
> ipa: /ˈwʌn.də/ · ipa-us: /ˈwʌn.dɚ/ · pos: verb · level: B1 · id: en-b1-questions-w01
> uk: запитувати себе, хотіти знати; I wonder… — цікаво…
> forms: wonder → wondered → wondered
> example: I **wonder** what she's doing now. — Цікаво, що вона зараз робить.
> note: не плутай з wander /ˈwɒn.də/ — блукати.

> [!word] clarify
> ipa: /ˈklær.ə.faɪ/ · ipa-us: /ˈkler.ə.faɪ/ · pos: verb · level: B1 · id: en-b1-questions-w02
> uk: уточнити, пояснити
> forms: clarify → clarified → clarified
> example: Could you **clarify** what you mean by "flexible hours"? — Чи не могли б ви уточнити, що маєте на увазі під «гнучким графіком»?
> note: формальне; у розмові — Could you explain…?

> [!word] Could you tell me…?
> ipa: /kʊd ju ˈtel mi/ · pos: phrase · level: B1 · id: en-b1-questions-w03
> uk: Чи не могли б ви сказати…? Не підкажете…?
> example: **Could you tell me** where the nearest pharmacy is? — Не підкажете, де найближча аптека?
> note: далі — порядок слів твердження.

> [!word] Do you happen to know…?
> ipa: /də ju ˈhæp.ən tə ˈnəʊ/ · ipa-us: /də ju ˈhæp.ən tə ˈnoʊ/ · pos: phrase · level: B1 · id: en-b1-questions-w04
> uk: Ви, бува, не знаєте…?
> example: **Do you happen to know** if the bank is open on Saturdays? — Ви, бува, не знаєте, чи працює банк у суботу?

> [!word] Any idea…?
> ipa: /ˈen.i aɪˈdɪə/ · ipa-us: /ˈen.i aɪˈdiː.ə/ · pos: phrase · level: B1 · id: en-b1-questions-w05
> uk: Не знаєш…? Є ідеї…?
> example: **Any idea** where I put my phone? — Не знаєш, куди я поклав телефон?
> note: розмовне; повніше — Have you got / Do you have any idea…?

> [!word] I'd like to know…
> ipa: /aɪd ˈlaɪk tə ˈnəʊ/ · ipa-us: /aɪd ˈlaɪk tə ˈnoʊ/ · pos: phrase · level: B1 · id: en-b1-questions-w06
> uk: Я хотів би дізнатися…
> example: **I'd like to know** whether the room has a balcony. — Я хотів би дізнатися, чи є в номері балкон.
> note: типово для офіційних листів і дзвінків; у кінці — крапка, не «?».

> [!word] Can I ask you something?
> ipa: /kən aɪ ˈɑːsk ju ˈsʌm.θɪŋ/ · ipa-us: /kən aɪ ˈæsk ju ˈsʌm.θɪŋ/ · pos: phrase · level: B1 · id: en-b1-questions-w07
> uk: Можна тебе / вас про щось спитати?
> example: **Can I ask you something?** Why did you choose this job? — Можна дещо спитати? Чому ти обрав цю роботу?

> [!word] Do you mind if I ask…?
> ipa: /də ju ˈmaɪnd ɪf aɪ ˈɑːsk/ · ipa-us: /də ju ˈmaɪnd ɪf aɪ ˈæsk/ · pos: phrase · level: B1 · id: en-b1-questions-w08
> uk: Можна поцікавитися…? (дуже чемно)
> example: **Do you mind if I ask** how old you are? — Можна поцікавитися, скільки вам років?
> note: щоб дозволити, кажуть No, not at all / Go ahead (No тут означає «не заперечую»).

## Слухаємо

> [!listen] Що ти почув?
> level: B1 · type: choice · id: en-b1-questions-l01
> audio: You're from Kharkiv, aren't you?
> - [x] You're from Kharkiv, aren't you?
> - [ ] You were from Kharkiv, weren't you?
> - [ ] You're from Kharkiv, are you?

> [!listen] Що ти почув?
> level: B1 · type: choice · id: en-b1-questions-l02
> audio: Could you tell me where the toilets are?
> - [ ] Could you tell me where are the toilets?
> - [x] Could you tell me where the toilets are?
> - [ ] Can you tell me where the toilet is?

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: en-b1-questions-l03
> audio: You haven't seen my keys, have you?
> accept: You have not seen my keys, have you?

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: en-b1-questions-l04
> audio: Do you know what time the bank opens?

> [!listen] Чого не знає перехожий?
> level: B1 · type: answer · id: en-b1-questions-l05
> audio: A: Excuse me, do you happen to know if there's a pharmacy near here?
> audio: B: Yes, there's one on Park Street, just past the bank. But I'm not sure whether it's open on Sundays.
> - [ ] Де саме розташована аптека
> - [x] Чи працює аптека в неділю
> - [ ] Чи є поруч банк
> - [ ] Як пройти на Park Street

> [!listen] Чи забула Соня квитки?
> level: B1 · type: answer · id: en-b1-questions-l06
> audio: A: Sonia, you didn't forget the tickets, did you?
> audio: B: No, I didn't. They're in my bag.
> - [ ] Так, забула
> - [x] Ні, квитки в неї в сумці
> - [ ] Вона не знає, де квитки
> - [ ] Квитки в сумці в її друга
>
> **Пояснення:** *No, I didn't* = «Ні, не забула». В англійській *no* йде разом із заперечним дієсловом, тож відповідь означає те саме, що й речення після неї.

> [!listen] IELTS Listening, Part 1 — запиши прізвище
> level: B1 · type: answer · id: en-b1-questions-l07
> audio: A: Could you tell me how you spell your surname?
> audio: B: Sure. It's Hrytsenko. H, R, Y, T, S, E, N, K, O.
> audio: A: Thank you. And could you tell me what your phone number is?
>
> **Booking form.** Surname: ________
>
> - [ ] Gritsenko
> - [ ] Hritsenko
> - [x] Hrytsenko
> - [ ] Hrytzenko
>
> **Пояснення:** у IELTS Part 1 імена й назви диктують по літерах, і помилка в одній літері — неправильна відповідь. Тренуй назви англійських літер, особливо *Y* /waɪ/, *H* /eɪtʃ/, *K* /keɪ/.

> [!listen] IELTS Listening, Part 3 — multiple choice
> level: B1 · type: answer · id: en-b1-questions-l08
> audio: A: You've finished the questionnaire, haven't you?
> audio: B: Almost. But I still don't know whether we should include first-year students.
> audio: A: Hmm. I wonder if our tutor would let us. Shall we email her?
> audio: B: Good idea.
>
> **What is the student unsure about?**
>
> - [ ] how to write the questionnaire
> - [x] who to include in the survey
> - [ ] when to send the questionnaire
> - [ ] the tutor's email address
>
> **Пояснення:** *I don't know **whether** we should include first-year students* — сумнів щодо того, кого включати в опитування. *Questionnaire* і *survey* — перефразування, типове для IELTS.

## Вимова

> [!speak] Скажи вголос — спадна інтонація ↘ (чекаєш згоди)
> level: B1 · id: en-b1-questions-s01
> text: It's a lovely day, isn't it?
> ipa: /ɪts ə ˈlʌv.li deɪ ˈɪz.ənt ɪt/
> tip: на isn't голос іде вниз ↘ — ти не питаєш, а запрошуєш погодитися. isn't it — звʼязуй [ˈɪz.ənt‿ɪt].
> uk: Чудовий день, правда?

> [!speak] Скажи вголос — висхідна інтонація ↗ (справжнє питання)
> level: B1 · id: en-b1-questions-s02
> text: You're coming tonight, aren't you?
> ipa: /jɔː ˈkʌm.ɪŋ təˈnaɪt ˈɑːnt juː/
> tip: на aren't you голос іде вгору ↗ — ти не впевнений і справді питаєш. aren't — [ɑːnt], без «р» у британській.
> uk: Ти ж прийдеш сьогодні ввечері?

> [!speak] Скажи вголос
> level: B1 · id: en-b1-questions-s03
> text: I'm a bit late, aren't I?
> ipa: /aɪm ə bɪt leɪt ˈɑːnt aɪ/
> tip: aren't I — [ˈɑːnt aɪ], два чіткі склади; спадна інтонація — визнаєш факт.
> uk: Я трохи запізнився, так?

> [!speak] Скажи вголос
> level: B1 · id: en-b1-questions-s04
> text: Let's take a break, shall we?
> ipa: /lets teɪk ə breɪk ʃəl wiː/
> tip: shall тут слабке — [ʃəl]; take a — зливай [teɪk‿ə].
> uk: Зробімо перерву, га?

> [!speak] Скажи вголос
> level: B1 · id: en-b1-questions-s05
> text: Could you tell me where the station is?
> ipa: /kʊd ju ˈtel mi weə ðə ˈsteɪ.ʃən ɪz/
> tip: у could літера l не читається: [kʊd]; is у кінці — дзвінке /z/, інтонація чемна, з легким підйомом.
> uk: Не підкажете, де вокзал?

> [!speak] Скажи вголос
> level: B1 · id: en-b1-questions-s06
> text: Do you know if the museum is open today?
> ipa: /də ju ˈnəʊ ɪf ðə mjuːˈziː.əm ɪz ˈəʊ.pən təˈdeɪ/
> tip: do you — слабке [də ju]; museum — наголос на другому складі: [mjuːˈziː.əm].
> uk: Не знаєш, чи працює сьогодні музей?

> [!speak] Скажи вголос
> level: B1 · id: en-b1-questions-s07
> text: I wonder whether they've arrived yet.
> ipa: /aɪ ˈwʌn.də ˈweð.ə ðeɪv əˈraɪvd jet/
> tip: wonder — /ʌ/, як коротке «а»: [ˈwʌn.də]; whether — /ð/, дзвінке th.
> uk: Цікаво, чи вони вже приїхали.

> [!speak] IELTS Speaking, Part 3 — попроси пояснити питання
> level: B1 · id: en-b1-questions-s08
> text: Sorry, could you tell me what you mean by public spaces?
> ipa: /ˈsɒr.i kʊd ju ˈtel mi wɒt ju ˈmiːn baɪ ˈpʌb.lɪk ˈspeɪ.sɪz/
> tip: у Part 3 можна попросити екзаменатора пояснити або перефразувати питання — бали за це не знімають. Непряме питання (what you mean, а не what do you mean) звучить упевнено й граматично правильно.
> uk: Вибачте, а що ви маєте на увазі під громадськими просторами?

## Типові помилки українців

> [!pitfall] «..., isn't it?» на все підряд
> Українське «так?» / «правда?» однакове для всіх речень, тож хочеться всюди казати *isn't it?* Але tag будується з речення: *You like coffee, **don't you**?*, *They were late, **weren't they**?*, *She can drive, **can't she**?* Універсальне розмовне *…, right?* існує, але воно неформальне.

> [!pitfall] «Yes, I'm not» — відповідь на заперечне питання
> «Ти ж не йдеш?» — «Так, не йду». В англійській *yes* не поєднується з запереченням: *You aren't going, are you?* — ***No**, I'm not.* Якщо все ж ідеш — ***Yes**, I am!*

> [!pitfall] «Could you tell me where is the station?»
> Порядок слів прямого питання (*where is…*) переносять в обгортку. У непрямому питанні порядок слів — **як у твердженні**: *Could you tell me where **the station is**?*

> [!pitfall] «Do you know what time does it start?»
> Подвійне питання: обгортка вже питальна, тож усередині **do / does / did зникають**: *Do you know what time **it starts**?*

## Практика

> [!quiz] Обери всі правильні речення
> level: B1 · type: multi · id: en-b1-questions-q05
> - [x] You've been to Rome, haven't you?
> - [ ] She speaks French, isn't she?
> - [x] Nobody saw us, did they?
> - [ ] Let's start, don't we?
> - [x] There aren't any tickets left, are there?
> - [x] Open the window, will you?
>
> **Пояснення:** *speaks* (Present Simple) → *doesn't she?*; *Let's* → *shall we?*. *Nobody* має заперечний зміст — тому стверджувальний tag *did they?*

> [!quiz] Друг питає: «You don't eat meat, do you?» Ти вегетаріанець. Що відповіси?
> level: B1 · id: en-b1-questions-q06
> - [ ] Yes, I don't.
> - [x] No, I don't.
> - [ ] Yes, I do.
> - [ ] No, I do.
>
> **Пояснення:** ти **не їси** мʼяса → заперечне дієслово → *No, I don't*. *Yes, I do* означало б «ні, я їм мʼясо».

> [!quiz] Встав question tag
> level: B1 · type: fill · id: en-b1-questions-q07
>
> ```text fill
> Nothing happened, [[did it]]?
> There's a cash machine near here, [[isn't there]]?
> Everyone enjoyed the party, [[didn't they]]?
> You'll help me, [[won't you]]?
> ```
>
> **Пояснення:** *nothing* — заперечний зміст → *did it*; *there's* → *isn't there*; *everyone* → *they*, Past Simple → *didn't they*; *'ll* → *won't you*.

> [!quiz] Заверши непрямі питання
> level: B1 · type: fill · id: en-b1-questions-q08
>
> ```text fill
> Where does Ira live? → Do you know where Ira [[lives]]?
> Is this seat free? → Could you tell me [[if|whether]] this seat is free?
> What did he say? → I'd like to know what he [[said]].
> ```
>
> **Пояснення:** *does … live* → *lives*; питання «так / ні» → *if / whether*; *did … say* → *said*. Допоміжні do / does / did у непрямому питанні зникають.

> [!quiz] Склади ввічливе питання: «Не підкажете, де найближчий банк?»
> level: B1 · type: order · id: en-b1-questions-q09
>
> ```text order
> Could you
> tell me
> where
> the nearest bank
> is?
> ```
>
> **Пояснення:** обгортка *Could you tell me* + питальне слово + **підмет + дієслово**.

> [!quiz] Склади питання: «Не знаєш, чи прийде Анна?»
> level: B1 · type: order · id: en-b1-questions-q10
>
> ```text order
> Do you know
> if
> Anna
> is coming?
> is Anna // ✗
> ```
>
> **Пояснення:** питання «так / ні» — додаємо **if**, далі порядок твердження: *Anna is coming*.

> [!quiz] Де пунктуація правильна?
> level: B1 · id: en-b1-questions-q11
> - [ ] I wonder why she left?
> - [x] I wonder why she left.
> - [ ] I wonder why did she leave.
> - [ ] I wonder, why she left?
>
> **Пояснення:** *I wonder…* — твердження, тож крапка. І порядок слів прямий: *why she left*, без *did*.

> [!quiz] Співрозмовник каже «You're Olena's brother, ↗aren't you?» з висхідною інтонацією. Що це означає?
> level: B1 · id: en-b1-questions-q12
> - [ ] Він точно знає, що ти брат Олени, і просто підтримує розмову
> - [x] Він не впевнений і справді питає
> - [ ] Він сердиться
> - [ ] Він стверджує, що ти не брат Олени
>
> **Пояснення:** **↗ висхідна** інтонація на tag — справжнє питання, мовець не певен. **↘ Спадна** — впевненість, очікування згоди.

### У форматі IELTS

> [!quiz] IELTS Reading — True, False чи Not Given?
> level: B1 · id: en-b1-questions-q13
>
> *Dear Sir or Madam, I am writing to ask for information about your evening Spanish course. I would like to know whether the course is suitable for complete beginners. Could you also tell me how many students there are in each group? I am free on Tuesdays and Thursdays only. Yours faithfully, Petro Bondar*
>
> **Statement:** Petro wants to know the size of the groups.
>
> - [x] True
> - [ ] False
> - [ ] Not Given
>
> **Пояснення:** *Could you also tell me how many students there are in each group?* — «скільки студентів у групі» = розмір групи. Перефразування → True.

> [!quiz] IELTS Reading — True, False чи Not Given?
> level: B1 · id: en-b1-questions-q14
>
> *Dear Sir or Madam, I am writing to ask for information about your evening Spanish course. I would like to know whether the course is suitable for complete beginners. Could you also tell me how many students there are in each group? I am free on Tuesdays and Thursdays only. Yours faithfully, Petro Bondar*
>
> **Statement:** Petro has studied Spanish before.
>
> - [ ] True
> - [ ] False
> - [x] Not Given
>
> **Пояснення:** Петро питає, чи підходить курс для початківців, але **не каже**, чи вчив він іспанську раніше. Можна здогадуватися, та текст цього не стверджує → Not Given.

> [!quiz] IELTS Writing — заверши лист-запит
> level: B1 · type: fill · bank: is the price, does it include · id: en-b1-questions-q15
>
> Встав вирази з банку, щоб питання в листі були граматично правильні (є зайві).
>
> ```text fill
> I would like to know [[whether]] the room has a sea view.
> Could you tell me what [[the price is]] for two nights?
> I would also like to know if it [[includes]] breakfast.
> ```
>
> **Пояснення:** у непрямих питаннях — *whether / if* і порядок твердження: *what the price is*, *if it includes*. Зайві *is the price* і *does it include* — порядок прямого питання, у формальному листі це помилка.

> [!tip] IELTS Writing — спробуй сам
> **General Training, Task 1 (формальний лист, 150+ слів).** *You are planning to take a short course at a language school in another city.* Write a letter to the school. In your letter: introduce yourself and say which course you are interested in; ask about the dates and the price; ask whether the school can help with accommodation.
> Підказка: формальний лист = непрямі питання: *I would like to know whether… Could you please tell me how much… I would be grateful if you could let me know…*

## Фішки

> [!reel] 🇬🇧 Британський small talk тримається на tags
> «Lovely weather, isn't it?» — це не питання про погоду, а запрошення до розмови. Правильна відповідь — не «так», а реакція: «Gorgeous! Finally some sun!»

> [!reel] 🤔 Чому «aren't I», а не «amn't I»?
> «Amn't I» досі можна почути в Ірландії й Шотландії. У стандартній англійській прижилося «aren't I» — колись це була розмовна вимова «an't I», яку записали як aren't.

> [!reel] 🎩 Непряме питання = піджак для питання
> «Where's the toilet?» — у джинсах. «Could you tell me where the toilet is?» — у піджаку. Зміст той самий, але з незнайомими людьми й в офіційних листах краще бути «в піджаку».

## Джерела та що почитати

- 🟢 R. Murphy — *English Grammar in Use* (Cambridge): question tags, Do you know where…? (indirect questions), auxiliary verbs.
- 🟢 [British Council LearnEnglish — Grammar B1–B2](https://learnenglish.britishcouncil.org/grammar/b1-b2-grammar) — question tags і indirect questions з вправами.
- 🟡 [Cambridge Dictionary — English Grammar Today](https://dictionary.cambridge.org/grammar/british-grammar/) — question tags, intonation, indirect questions.
- 🟡 [BBC Learning English](https://www.bbc.co.uk/learningenglish/) — вимова й інтонація question tags.
- 🟡 [IELTS — офіційний сайт](https://ielts.org/) — формат Listening (Part 1, Part 3) і General Training Writing Task 1.

> [!important] Підсумок
> - **Tag** = допоміжне дієслово з протилежним знаком + займенник: *It's cold, isn't it?* · *You didn't call, did you?*
> - Особливі: *I'm → aren't I?*, *Let's → shall we?*, наказовий → *will you?*, *nobody / nothing / never* → стверджувальний tag.
> - **↘** — чекаю згоди, **↗** — справді питаю. Відповідь — за фактом: *No, I'm not* / *Yes, I am*.
> - **Непряме питання**: обгортка (*Could you tell me / Do you know / I'd like to know*) + **порядок твердження** без do / does / did.
> - «Так / ні» → **if / whether**; після *I wonder*, *I'd like to know* — крапка.
