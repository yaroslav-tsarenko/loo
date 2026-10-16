---
title: Will — прогнози, обіцянки, рішення
order: 211
id: en-a2-will
level: A2
icon: px:bulb
tags: [english, a2, grammar, future, will, shall]
prerequisites: ["[[English - A2 - 10. Be going to — плани й наміри]]"]
estimatedMinutes: 40
---

# Will — прогнози, обіцянки, рішення

> [!success] Після цієї теми ти зможеш
> - висловити думку про майбутнє: *I think it'll rain. She probably won't come.*;
> - ухвалити рішення просто під час розмови: *I'll have the soup. I'll get it!*;
> - запропонувати допомогу й пообіцяти: *I'll carry that. I won't tell anyone.*;
> - запропонувати щось з *Shall I…? / Shall we…?*;
> - обрати між *will* і *going to*.

## Передбач

> [!quiz] Дзвонить телефон, ти кажеш: «Я візьму!» Як англійською?
> level: A2 · id: en-a2-will-q01
> - [ ] I'm going to get it!
> - [ ] I get it!
> - [x] I'll get it!
> - [ ] I will to get it!
>
> **Пояснення:** рішення народилося **просто зараз**, у момент розмови, — це **will**: *I'll get it!* *Going to* — для рішень, ухвалених раніше. Після *will* — V1 без *to*.

## Простими словами

Якщо *going to* — це «я вже вирішив», то **will** — це «вирішую просто зараз» або «я так думаю». Will — слово **думки й моменту**:

- **прогноз-думка:** *I think Ukraine **will** win.* (доказів немає, просто віриш);
- **рішення в цю секунду:** *It's cold. I'**ll** close the window.*;
- **пропозиція допомоги:** *Your bag looks heavy. I'**ll** carry it.*;
- **обіцянка:** *I'**ll** call you tonight. I **won't** forget.*;
- **прохання:** ***Will** you help me?*

Граматика — найпростіша з усіх часів: **will + V1** для всіх осіб, без *-s*, без *to*.

> [!diagram] Рішення народжується зараз
> ```yaml
> layout: flow
> nodes:
>   - { id: event, label: "щось стається", text: "The phone is ringing.", tone: orange, icon: "px:phone" }
>   - { id: think, label: "думка в цю мить", text: "Хто візьме? — Я!", tone: gray, icon: "px:think" }
>   - { id: say, label: "will", text: "I'll get it!", tone: violet }
> edges:
>   - { from: event, to: think, label: "зараз" }
>   - { from: think, to: say, label: "рішення" }
> steps:
>   - { focus: event, note: "Дзвонить телефон. Секунду тому ти про це навіть не думав." }
>   - { move: { from: event, to: think, value: "?" }, note: "Рішення народжується просто в момент розмови." }
>   - { move: { from: think, to: say, value: "will + get" }, note: "Миттєве рішення → will: I'll get it! Ніяких попередніх планів — тому не going to." }
>   - { focus: say, set: { event: "The soup looks good.", say: "I'll have the soup." }, note: "Так само в ресторані: дивишся меню й вирішуєш — I'll have the soup." }
> ```

## Пояснення

### Форми

| + | − | ? | Коротка відповідь |
|---|---|---|---|
| I **will** (I**'ll**) go | I **won't** go | **Will** you go? | *Yes, I will. / No, I won't.* |
| she**'ll** help | she **won't** help | **Will** she help? | *Yes, she will. / No, she won't.* |
| it**'ll** be fine | it **won't** be easy | **Will** it be OK? | *Yes, it will. / No, it won't.* |

- **won't** = will not, звучить /wəʊnt/ — не плутай з *want* /wɒnt/.
- У розмові *will* майже завжди скорочується: *I'll, you'll, she'll, we'll, they'll, it'll* /ˈɪt.əl/.

> [!quiz] Перевір себе: форми will
> level: A2 · type: fill · bank: wills, will to · id: en-a2-will-q02
>
> ```text fill
> Don't worry, she [[will]] call you back.
> They [[won't]] be late — they're always on time.
> [[Will]] you be at home tomorrow?
> ```
>
> **Пояснення:** *will* однаковий для всіх осіб; заперечення — *won't*; у питанні *will* стає перед підметом.

### Прогнози-думки: I think, probably, I'm sure

Прогноз з *will* часто «обгорнутий» словами впевненості:

- ***I think** it'll be sunny. **I'm sure** you'll pass.*
- ***I don't think** he'll come.* — природніше, ніж «I think he won't come».
- ***Probably / definitely*** стоять **після** *will*, але **перед** *won't*: *She'll **probably** be late. She **probably** won't come.*
- ***Perhaps / maybe*** — на початку: ***Perhaps** they'll stay longer.*

> [!quiz] Перевір себе: де стоїть probably?
> level: A2 · id: en-a2-will-q03
> - [ ] He probably will be late.
> - [x] He'll probably be late.
> - [ ] He'll be probably late.
> - [ ] Probably he'll late.
>
> **Пояснення:** *probably* стоїть між *will* і основним дієсловом: *He'll **probably** be late.* У запереченні — перед *won't*: *He probably won't come.*

### Пропозиції, обіцянки, прохання

| Функція | Приклад |
|---|---|
| пропозиція допомоги | *I'll carry that for you.* |
| обіцянка | *I'll pay you back tomorrow. I won't tell anyone.* |
| прохання | *Will you close the door, please?* |
| відмова | *The car **won't** start.* — Машина не заводиться. |

### Shall I…? Shall we…?

***Shall*** у сучасній британській живе майже лише в питаннях з *I* і *we*:

- ***Shall I** open the window?* — Відчинити вікно? (пропоную допомогу)
- ***Shall we** go for a walk?* — Може, підемо прогулятися? (пропоную разом)
- *What **shall we** do tonight?* — Що робитимемо ввечері?

Американці частіше кажуть *Should I…? / Do you want me to…? / Let's…*

### Will чи going to?

> [!diagram] Will проти going to
> ```yaml
> layout: compare
> columns: { will: "will — думка й мить", gt: "going to — план і доказ" }
> nodes:
>   - { id: w1, col: will, text: "I think it'll rain tomorrow.", note: "просто моя думка", tone: violet }
>   - { id: g1, col: gt, text: "Look at those clouds! It's going to rain.", note: "доказ перед очима", tone: blue }
>   - { id: w2, col: will, text: "We need milk? OK, I'll buy some.", note: "вирішив зараз", tone: violet }
>   - { id: g2, col: gt, text: "I'm going to buy milk after work.", note: "вирішив раніше", tone: blue }
>   - { id: w3, col: will, text: "I'll help you, I promise.", note: "обіцянка, пропозиція", tone: violet }
>   - { id: g3, col: gt, text: "We're going to move to Lviv.", note: "намір, план", tone: blue }
> steps:
>   - { show: [w1, g1], note: "Прогноз. Will — бо я так думаю. Going to — бо я бачу причину просто зараз." }
>   - { show: [w2, g2], note: "Рішення. Will — народилося в розмові. Going to — ухвалене до неї." }
>   - { show: [w3, g3], note: "Will — ще й обіцянки, пропозиції, прохання. Going to — наміри й плани." }
>   - { focus: [w2, g2], note: "Тест: чи вирішив ти це ДО розмови? Так → going to. Ні, просто зараз → will." }
> ```

> [!quiz] Перевір себе: will чи going to?
> level: A2 · id: en-a2-will-q04
>
> *I've already decided. I ___ study medicine.*
>
> - [ ] will
> - [x] am going to
> - [ ] shall
> - [ ] 'll probably
>
> **Пояснення:** *already decided* — рішення ухвалене раніше → **going to**.

## Приклади

- *I think you'll love this film.* — Думаю, тобі сподобається цей фільм.
- *It's late. I'll take a taxi.* — Пізно. Візьму таксі.
- *Don't worry, I won't tell anyone.* — Не хвилюйся, я нікому не скажу.
- *Will you marry me?* — Ти вийдеш за мене?
- *I'll probably stay at home tonight.* — Сьогодні ввечері я, мабуть, буду вдома.
- *I don't think it'll be very expensive.* — Не думаю, що це буде дуже дорого.
- *Shall I make some tea? — Yes, please!* — Зробити чаю? — Так, будь ласка!
- *Shall we meet at eight?* — Зустрінемося о восьмій?
- *The door won't open!* — Двері не відчиняються!
- *Hopefully, the weather will be better at the weekend.* — Сподіваюся, на вихідних погода буде краща.

## Слова

> [!word] probably
> ipa: /ˈprɒb.ə.bli/ · ipa-us: /ˈprɑː.bə.bli/ · pos: adv · level: A2 · id: en-a2-will-w01
> uk: мабуть, імовірно
> example: It'll **probably** snow tonight. — Уночі, мабуть, піде сніг.
> note: після will, перед won't: He probably won't come.

> [!word] perhaps
> ipa: /pəˈhæps/ · ipa-us: /pɚˈhæps/ · pos: adv · level: A2 · id: en-a2-will-w02
> uk: можливо
> example: **Perhaps** we'll meet again one day. — Можливо, колись ми ще зустрінемося.
> note: трохи формальніше за maybe.

> [!word] certainly
> ipa: /ˈsɜː.tən.li/ · ipa-us: /ˈsɝː.tən.li/ · pos: adv · level: A2 · id: en-a2-will-w03
> uk: безперечно, звісно
> example: She'll **certainly** win — she's the best. — Вона безперечно переможе — вона найкраща.
> note: Certainly! — ввічливе «Звісно!» у відповідь на прохання.

> [!word] hopefully
> ipa: /ˈhəʊp.fəl.i/ · ipa-us: /ˈhoʊp.fəl.i/ · pos: adv · level: A2 · id: en-a2-will-w04
> uk: сподіваюся, будемо сподіватися
> example: **Hopefully**, the train won't be late. — Сподіваюся, поїзд не запізниться.

> [!word] promise
> ipa: /ˈprɒm.ɪs/ · ipa-us: /ˈprɑː.mɪs/ · pos: verb · level: A2 · id: en-a2-will-w05
> uk: обіцяти; (n) обіцянка
> example: I **promise** I'll be careful. — Обіцяю, буду обережним.
> note: keep a promise — дотримати обіцянки; break a promise — порушити.

> [!word] offer
> ipa: /ˈɒf.ə/ · ipa-us: /ˈɑː.fɚ/ · pos: verb · level: A2 · id: en-a2-will-w06
> uk: пропонувати; (n) пропозиція
> example: He **offered** to help me with my suitcase. — Він запропонував допомогти мені з валізою.
> note: offer to do something — запропонувати щось зробити.

> [!word] prediction
> ipa: /prɪˈdɪk.ʃən/ · pos: noun · level: A2 · id: en-a2-will-w07
> uk: прогноз, передбачення
> example: My **prediction**? Brazil will win the World Cup. — Мій прогноз? Бразилія виграє чемпіонат світу.
> note: дієслово — predict.

> [!word] forecast
> ipa: /ˈfɔː.kɑːst/ · ipa-us: /ˈfɔːr.kæst/ · pos: noun · level: A2 · id: en-a2-will-w08
> uk: прогноз (погоди)
> example: The weather **forecast** says it'll be windy. — За прогнозом погоди буде вітряно.

> [!word] in the future
> ipa: /ɪn ðə ˈfjuː.tʃə/ · ipa-us: /ɪn ðə ˈfjuː.tʃɚ/ · pos: phrase · level: A2 · id: en-a2-will-w09
> uk: у майбутньому
> example: **In the future**, cars will drive themselves. — У майбутньому машини їздитимуть самі.

> [!word] I'll get it
> ipa: /aɪl ˈɡet ɪt/ · pos: phrase · level: A2 · id: en-a2-will-w10
> uk: я візьму / я відчиню (телефон, двері)
> example: Someone's at the door! — **I'll get it!** — Хтось у дверях! — Я відчиню!

> [!word] Shall I…?
> ipa: /ʃəl aɪ/ · ipa-us: /ʃəl aɪ/ · pos: phrase · level: A2 · id: en-a2-will-w11
> uk: Мені …? (пропозиція допомоги: «Відчинити? Допомогти?»)
> example: **Shall I** call a taxi for you? — Викликати вам таксі?
> note: британське; в американській — Should I…? / Do you want me to…?

> [!word] Shall we…?
> ipa: /ʃəl wi/ · pos: phrase · level: A2 · id: en-a2-will-w12
> uk: Може, ми …? Давай …? (пропозиція зробити разом)
> example: **Shall we** go to the cinema tonight? — Може, підемо сьогодні в кіно?
> note: схоже на Let's…: Let's go to the cinema!

## Слухаємо

> [!listen] Що ти почув?
> level: A2 · type: choice · id: en-a2-will-l01
> audio: I'll call you later.
> - [x] I'll call you later.
> - [ ] I call you later.
> - [ ] I'll tell you later.

> [!listen] Що ти почув?
> level: A2 · type: choice · id: en-a2-will-l02
> audio: I won't forget.
> - [ ] I want to forget.
> - [x] I won't forget.
> - [ ] I don't forget.

> [!listen] Надрукуй почуте
> level: A2 · type: dictation · id: en-a2-will-l03
> audio: I think it will be sunny tomorrow.

> [!listen] Надрукуй почуте
> level: A2 · type: dictation · id: en-a2-will-l04
> audio: Shall I open the window?

> [!listen] Що замовила Ніна?
> level: A2 · type: answer · id: en-a2-will-l05
> audio: A: Are you ready to order?
> audio: B: Yes. I'll have the chicken soup, please.
> audio: A: And to drink?
> audio: B: Just water, thanks. Oh, and I'll have a green salad too.
> - [ ] Курку, салат і сік
> - [x] Курячий суп, салат і воду
> - [ ] Лише суп
> - [ ] Суп і чай

> [!listen] Яка погода буде на півдні?
> level: A2 · type: answer · id: en-a2-will-l06
> audio: And now the weather forecast for tomorrow. It'll be cold and cloudy in the north, with some snow in the mountains. In the south it'll be sunny, but it won't be very warm.
> - [ ] Холодно й хмарно
> - [ ] Сніг у горах
> - [x] Сонячно, але не дуже тепло
> - [ ] Спекотно

## Вимова

Скорочення *'ll* — це лише «темне» /l/ після займенника: *I'll* /aɪl/, *you'll* /juːl/, *she'll* /ʃiːl/. Якщо його не вимовити, *I'll go* перетвориться на *I go*.

> [!pair] won't /wəʊnt/ — want /wɒnt/
> level: A2 · id: en-a2-will-p01
> say: won't
> tip: won't — дифтонг /əʊ/: «воунт». want — коротке округлене /ɒ/: «вонт».

> [!pair] I'll go /aɪl ɡəʊ/ — I go /aɪ ɡəʊ/
> level: A2 · id: en-a2-will-p02
> say: I go
> tip: у I'll є коротке /l/ між «ай» і «ґоу». Немає /l/ — значить, теперішній час.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-will-s01
> text: I'll help you with that.
> ipa: /aɪl ˈhelp ju wɪð ˈðæt/
> tip: I'll — «айл», одним складом. help — h легкий видих, не «г».

> [!speak] Скажи вголос
> level: A2 · id: en-a2-will-s02
> text: I won't tell anyone, I promise.
> ipa: /aɪ ˈwəʊnt ˈtel ˈen.i.wʌn aɪ ˈprɒm.ɪs/
> tip: won't — «воунт», не want. promise — ПРО-міс, наголос на перший склад.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-will-s03
> text: Shall we go for a walk?
> ipa: /ʃəl wi ˌɡəʊ fər ə ˈwɔːk/
> tip: shall тут слабке /ʃəl/. walk — l мовчить: /wɔːk/, «во-ок».

> [!speak] Скажи вголос
> level: A2 · id: en-a2-will-s04
> text: It'll probably rain tomorrow.
> ipa: /ˈɪt.əl ˈprɒb.ə.bli ˈreɪn təˈmɒr.əʊ/
> tip: it'll — два склади: «ІТ-л». probably у швидкій мові — «ПРОБ-лі».

> [!speak] Скажи вголос
> level: A2 · id: en-a2-will-s05
> text: I'll have the soup, please.
> ipa: /aɪl ˈhæv ðə ˈsuːp pliːz/
> tip: магічна фраза в ресторані. soup — довге /uː/: «су-уп».

> [!speak] Скажи вголос
> level: A2 · id: en-a2-will-s06
> text: I don't think she'll come.
> ipa: /aɪ ˈdəʊnt ˈθɪŋk ʃiːl ˈkʌm/
> tip: she'll — «шіл» з довгим /iː/. think — /θ/, кінчик язика між зубами.

## Типові помилки українців

> [!pitfall] «I will to go», «She wills come»
> *Will* — модальне слово: після нього **V1 без to**, і воно не змінюється за особами: *I **will go**, she **will come***.

> [!pitfall] «Will I open the window?» як пропозиція
> Українською «Відчинити вікно?» — і все зрозуміло. Англійською пропозиція допомоги — ***Shall I open the window?*** «Will I…?» питає про прогноз: «Чи відчиню я вікно (у майбутньому)?».

> [!pitfall] «I think it won't rain»
> Граматично можливо, але англійці природніше заперечують *think*: ***I don't think** it'll rain.* А «буду робити» і «зроблю» — обидва просто *will*: англійська не розрізняє вид, як українська.

## Практика

> [!quiz] У подруги важка сумка. Що ти скажеш?
> level: A2 · id: en-a2-will-q05
> - [ ] I carry it for you.
> - [x] I'll carry it for you.
> - [ ] I'm going to carry it for you.
> - [ ] I will carrying it for you.
>
> **Пояснення:** пропозиція допомоги, яка народилася просто зараз, — **will**: *I'll carry it.*

> [!quiz] Склади речення: «Не думаю, що піде дощ»
> level: A2 · type: order · id: en-a2-will-q06
>
> ```text order
> I
> don't think
> it
> will rain.
> won't rain. // ✗
> ```
>
> **Пояснення:** англійці заперечують *think*, а не *will*: *I don't think it will rain.*

> [!quiz] Як запропонувати допомогу?
> level: A2 · id: en-a2-will-q07
>
> «Відчинити вікно?» — питаєш ти в задушливій кімнаті.
>
> - [ ] Will I open the window?
> - [x] Shall I open the window?
> - [ ] Do I open the window?
> - [ ] Am I opening the window?
>
> **Пояснення:** пропозиція «мені зробити…?» — ***Shall I…?***

> [!quiz] Обери правильну репліку
> level: A2 · id: en-a2-will-q08
>
> *— Oh no, I've forgotten my wallet! — Don't worry, I ___.*
>
> - [ ] pay
> - [ ] am going to pay
> - [x] 'll pay
> - [ ] paying
>
> **Пояснення:** рішення допомогти ухвалене просто в розмові → *I'll pay*.

> [!quiz] Обери всі правильні речення
> level: A2 · id: en-a2-will-q09
> - [x] I'll probably see you tomorrow.
> - [ ] She will to call you.
> - [x] Will you help me, please?
> - [ ] He'll be probably late.
> - [x] They won't believe it!
>
> **Пояснення:** після *will* — V1 без *to*; *probably* стоїть між *will* і дієсловом: *He'll probably be late.*

> [!quiz] Встав will / won't / promise
> level: A2 · type: fill · bank: want, wills · id: en-a2-will-q10
>
> ```text fill
> I [[promise]] I [[won't]] be late again.
> Thanks for the money. I [[will]] pay you back on Friday.
> ```
>
> **Пояснення:** обіцянка — *I promise* + *will / won't*. *Want* звучить схоже на *won't*, але означає «хочу».

> [!quiz] Склади питання: «Зустрінемося о восьмій?»
> level: A2 · type: order · id: en-a2-will-q11
>
> ```text order
> Shall
> we
> meet
> at eight?
> meeting // ✗
> ```
>
> **Пояснення:** пропозиція зробити щось разом — ***Shall we** + V1…?*

> [!quiz] Офіціант питає, що ти замовиш. «I'll have the fish» означає…
> level: A2 · id: en-a2-will-q12
> - [ ] Я маю рибу.
> - [x] Я візьму рибу.
> - [ ] У мене буде риба вдома.
> - [ ] Я їв рибу.
>
> **Пояснення:** *I'll have…* — стандартний спосіб замовити в кафе: рішення ухвалюєш просто зараз.

> [!quiz] Встав will або won't
> level: A2 · type: fill · bank · id: en-a2-will-q13
>
> ```text fill
> I'm sure you [[will]] love the new flat.
> I don't think they [[will]] win the match.
> Don't worry, the dentist [[won't]] hurt you.
> ```
>
> **Пояснення:** після *I don't think* — стверджувальне *will*: заперечення вже є в *don't*. «Не зробить боляче» — *won't hurt*.

> [!quiz] Обери природну форму
> level: A2 · id: en-a2-will-q14
>
> *Who knows? Maybe one day people ___ on Mars.*
>
> - [x] will live
> - [ ] are living
> - [ ] live
> - [ ] are going to living
>
> **Пояснення:** далека думка-прогноз без доказів і планів → **will**: *people will live on Mars*.

## Фішки

> [!reel] 🇩🇪 Will колись означало «хочу»
> Давньоанглійське willan — «хотіти». Німці досі кажуть ich will — «я хочу». В англійській «бажання» перетворилося на майбутнє, а «хотіти» залишилося в іменнику will — воля.

> [!reel] 🫖 Shall I make some tea?
> Shall майже зникло зі щоденної мови, але живе в британських пропозиціях: Shall I…? Shall we…? У США замість нього — Should I…? або Do you want me to…?

> [!reel] 🍽️ «I'll have…» — ключ до будь-якого кафе
> I'll have a latte. I'll have the burger. Офіціант чує рішення «зараз» — і все. Не «I want», яке звучить різкувато, і не «Give me».

## Джерела та що почитати

- 🟢 R. Murphy — *Essential Grammar in Use* (Cambridge): розділи про *will / shall* і *I will* vs *I'm going to*.
- 🟢 [Cambridge Dictionary — Will](https://dictionary.cambridge.org/grammar/british-grammar/will) — значення й форми.
- 🟡 [Cambridge Dictionary — Future: will and shall](https://dictionary.cambridge.org/grammar/british-grammar/future-will-and-shall) — прогнози, рішення, пропозиції.
- 🟡 [Cambridge Dictionary — Shall](https://dictionary.cambridge.org/grammar/british-grammar/shall) — *Shall I…? Shall we…?* у британській і американській.

> [!important] Підсумок
> - **will + V1** для всіх осіб; *'ll*, заперечення **won't** /wəʊnt/.
> - Will — думка-прогноз (*I think it'll…, probably*), миттєве рішення (*I'll have the soup*), пропозиція, обіцянка, прохання.
> - *Probably* — після *will*, перед *won't*; *I don't think … will*.
> - ***Shall I…?*** — пропоную допомогу, ***Shall we…?*** — пропоную разом.
> - Вирішив раніше або бачиш доказ — *going to*; вирішуєш зараз або просто думаєш — *will*.
