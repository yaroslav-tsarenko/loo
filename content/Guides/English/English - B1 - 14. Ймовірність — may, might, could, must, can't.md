---
title: Ймовірність — may, might, could, must, can't
order: 314
id: en-b1-modals-possibility
level: B1
icon: px:dice
tags: [english, b1, grammar, modals, possibility, deduction, may, might, must, ielts]
prerequisites: ["[[English - A2 - 17. Must, have to, should — обовʼязок і порада]]", "[[English - A2 - 11. Will — прогнози, обіцянки, рішення]]"]
estimatedMinutes: 40
---

# Ймовірність — may, might, could, must, can't

> [!success] Після цієї теми ти зможеш
> - показати, наскільки ти впевнений: **must be** (точно), **might be** (можливо), **can't be** (точно ні);
> - робити висновки з доказів, як детектив: *The lights are off — they **must be** asleep.*;
> - говорити про можливе майбутнє: *It **might** rain later.*;
> - не плутати **mustn't** (заборона) з **can't** (неможливо) і **maybe** з **may be**;
> - обережно висловлювати думку, як вимагає IELTS (*It **may** be because…*).

## Передбач

> [!quiz] Сусід не відчиняє, світло вимкнене, машини немає. Що ти скажеш?
> level: B1 · id: en-b1-modals-possibility-q01
> - [ ] They mustn't be at home.
> - [x] They can't be at home.
> - [ ] They don't must be at home.
> - [ ] They can be not at home.
>
> **Пояснення:** висновок «точно ні, не може бути» — **can't be**. *Mustn't* означає заборону («їм заборонено бути вдома»), а не впевненість. Це найпідступніше місце теми.

## Простими словами

Ти вже знаєш **must** і **can** як «мусити» і «вміти». Але в англійській ці самі слова мають друге життя — вони показують, **наскільки ти впевнений**. Уяви термометр впевненості:

- **must** — «я майже впевнений, що ТАК» (бо бачу докази): *She's wearing a ring — she **must** be married.*
- **may / might / could** — «можливо, 50 на 50»: *He **might** be at the gym.*
- **might not / may not** — «можливо, ні»: *She **may not** know about it.*
- **can't** — «я майже впевнений, що НІ»: *That **can't** be true!*

Українською це «мабуть / напевно», «може», «не може бути». Носії англійської частіше, ніж ми, передають ступінь упевненості модальним дієсловом, а не словами на кшталт *probably*.

> [!diagram] Шкала впевненості
> ```yaml
> layout: stack
> nodes:
>   - { id: must, label: "≈ 95 % так", text: "She must be at work.", note: "мабуть / напевно (є докази)", tone: green, icon: "px:check" }
>   - { id: might, label: "≈ 50 %", text: "She may / might / could be at work.", note: "можливо, може бути", tone: yellow, icon: "px:question" }
>   - { id: mightnt, label: "≈ 30 %", text: "She may not / might not be at work.", note: "можливо, ні", tone: orange }
>   - { id: cant, label: "≈ 5 % — майже точно ні", text: "She can't be at work.", note: "не може бути (є докази)", tone: red, icon: "px:cross" }
> steps:
>   - { show: must, note: "Нагорі — must: висновок з доказів. Її сумки немає, компʼютер увімкнений — must be at work." }
>   - { show: might, note: "Посередині — may, might, could: просто можливість. Ніяких доказів, лише припущення." }
>   - { show: mightnt, note: "Might not / may not — «можливо, ні». Тут не можна сказати could not: couldn't означає «не може бути», як can't." }
>   - { show: cant, note: "Внизу — can't: висновок «точно ні». Не mustn't! Mustn't — заборона, а не ймовірність." }
> ```

## Пояснення

### Форми

Після всіх модальних — **V1 без to**: *must be, might go, can't know*. Для того, що відбувається **зараз**, — **be + -ing**: *She **must be sleeping**. They **might be having** lunch.*

| Впевненість | Теперішнє | Зараз у процесі | Майбутнє |
|---|---|---|---|
| майже так | He **must be** tired. | He **must be working**. | (He**'ll** probably…) |
| можливо | He **may / might / could be** tired. | He **might be working**. | He **might come** tomorrow. |
| можливо, ні | He **may not / might not be** tired. | He **might not be working**. | He **might not come**. |
| майже ні | He **can't / couldn't be** tired. | He **can't be working**. | — |

> [!tip] Must not в американській англійській
> У США для висновку «мабуть, ні» часто кажуть **must not**: *He must not be home* — «Його, мабуть, немає вдома». У британській англійській звичніше *can't*, тож на іспитах і в цьому курсі для «точно ні» — **can't**.

> [!quiz] Перевір себе: обери модальне
> level: B1 · id: en-b1-modals-possibility-q02
>
> Ihor has worked for twelve hours without a break. He ___ be exhausted.
>
> - [x] must
> - [ ] can't
> - [ ] mustn't
> - [ ] might not
>
> **Пояснення:** 12 годин без перерви — сильний доказ → «напевно втомився» → **must be**.

### Дедукція — висновок з доказів

**Must** і **can't** — це завжди логічний висновок: є факт → робимо вивід. Без доказів так не кажуть.

> [!diagram] Як детектив: доказ → висновок
> ```yaml
> layout: flow
> nodes:
>   - { id: clue, label: "доказ", text: "He's got a tan and lots of luggage.", tone: blue, icon: "px:magnifier" }
>   - { id: think, label: "думка", text: "Засмага + валізи…", tone: gray, icon: "px:think" }
>   - { id: concl, label: "висновок", text: "?", tone: green }
> edges:
>   - { from: clue, to: think, label: "бачу" }
>   - { from: think, to: concl, label: "отже" }
> steps:
>   - { focus: clue, note: "Спершу — факти, які ти бачиш або чуєш." }
>   - { move: { from: clue, to: think, value: "?" }, note: "Зважуєш докази. Чим вони сильніші, тим вища впевненість." }
>   - { move: { from: think, to: concl, value: "must" }, set: { concl: "He must be back from holiday." }, note: "Сильні докази «так» → must be." }
>   - { set: { clue: "Her phone is on the table.", concl: "She can't be far away." }, focus: [clue, concl], note: "Сильні докази «ні» → can't. Телефон на столі — вона не могла далеко піти." }
> ```

- The phone's ringing. It **must be** my mum — she always calls at eight. — Телефон дзвонить. Мабуть, це мама: вона завжди дзвонить о восьмій.
- You've only just eaten. You **can't be** hungry again! — Ти ж щойно поїв. Не може бути, щоб ти знову зголоднів!
- She's not answering. She **might be** in a meeting. — Вона не відповідає. Можливо, вона на нараді.

### Можливість у майбутньому: may, might, could

Про майбутнє, коли не впевнений, — **may, might, could** (майже однакові; **may** трохи впевненіше й формальніше, **might** — найчастіше в розмові):

- It **might** rain this afternoon. — Пополудні може піти дощ.
- I **may** be late tonight. — Можливо, я сьогодні запізнюся.
- Don't touch it — it **could** be dangerous. — Не чіпай, це може бути небезпечно.
- We **might not** go on holiday this year. — Можливо, цього року ми не поїдемо у відпустку.

> [!warning] Can — лише загальна можливість
> **Can** означає «буває, таке можливо взагалі»: *It **can** be very cold in Kharkiv in January* (так буває). Про конкретне майбутнє — **could / might**: *It **might** be cold tomorrow*, а не ~~*It can be cold tomorrow*~~.

> [!quiz] Перевір себе: may, might чи can't?
> level: B1 · type: fill · bank: mustn't · id: en-b1-modals-possibility-q03
>
> ```text fill
> Take a coat — it [[might|may|could]] get cold later.
> That [[can't]] be Taras — he's in Canada this month.
> I'm not sure, but the shop [[may not|might not]] be open on Sunday.
> ```
>
> **Пояснення:** «може похолодати» — **might / may / could**; «не може бути, він у Канаді» — **can't**; «можливо, не працює» — **may not / might not**. *Mustn't* — пастка: це заборона.

### Maybe чи may be?

- **maybe** (одне слово) — прислівник «можливо», стоїть на початку: ***Maybe** he's ill.*
- **may be** (два слова) — модальне + дієслово: *He **may be** ill.*

Значення однакове, а написання — ні. Не пиши ~~*He maybe ill*~~.

## Приклади

- You **must be** Anna's sister — you look just like her! — Ти, мабуть, сестра Анни — ви дуже схожі!
- This **can't be** the right address. There's no house here. — Не може бути, щоб це була правильна адреса. Тут немає будинку.
- She **might be** at the gym. She usually goes on Tuesdays. — Можливо, вона в спортзалі: зазвичай вона ходить по вівторках.
- I **may not** have time to call you tomorrow. — Можливо, завтра я не матиму часу тобі подзвонити.
- Don't eat that mushroom — it **could** be poisonous. — Не їж цей гриб, він може бути отруйним.
- They **must be having** dinner — I can smell something delicious. — Вони, мабуть, вечеряють: я чую смачний запах.
- It's **likely** to snow tonight. — Уночі, ймовірно, буде сніг.
- **Maybe** we should ask someone for directions. — Може, варто в когось спитати дорогу?
- That's **impossible**! He **can't** have two jobs and study full-time. — Це неможливо! Він не може мати дві роботи й ще вчитися на денному.
- The detective found a **clue** — the thief **must be** someone from the hotel. — Детектив знайшов зачіпку: злодій, напевно, хтось із готелю.

## Слова

> [!word] might
> ipa: /maɪt/ · pos: verb · level: B1 · id: en-b1-modals-possibility-w01
> uk: можливо (щось станеться / є), може
> example: Take an umbrella — it **might** rain. — Візьми парасольку: може піти дощ.
> note: заперечення might not / mightn't (UK); gh не читається.

> [!word] may
> ipa: /meɪ/ · pos: verb · level: B1 · id: en-b1-modals-possibility-w02
> uk: можливо; (формально) можна
> example: I **may** be a bit late. — Можливо, я трохи запізнюся.
> note: may not — «можливо, ні»; скорочення mayn't майже не вживають. May I…? — ввічливе «можна мені…?».

> [!word] maybe
> ipa: /ˈmeɪ.bi/ · pos: adv · level: B1 · id: en-b1-modals-possibility-w03
> uk: можливо, мабуть
> example: **Maybe** she missed the bus. — Можливо, вона спізнилася на автобус.
> note: одне слово, зазвичай на початку речення. Не плутай з may be (модальне + be).

> [!word] possible
> ipa: /ˈpɒs.ə.bəl/ · ipa-us: /ˈpɑː.sə.bəl/ · pos: adj · level: B1 · id: en-b1-modals-possibility-w04
> uk: можливий
> example: Is it **possible** to change my ticket? — Чи можна поміняти квиток?
> note: as soon as possible (ASAP) — якнайшвидше.

> [!word] conclusion
> ipa: /kənˈkluː.ʒən/ · pos: noun · level: B1 · id: en-b1-modals-possibility-w05
> uk: висновок
> example: What **conclusion** can we draw from this? — Який висновок можна з цього зробити?
> note: come to a conclusion — дійти висновку; in conclusion — на завершення (есе).

> [!word] certain
> ipa: /ˈsɜː.tən/ · ipa-us: /ˈsɝː.tən/ · pos: adj · level: B1 · id: en-b1-modals-possibility-w06
> uk: впевнений; певний
> example: Are you **certain** it was him? — Ти впевнений, що це був він?
> note: сильніше за sure; certainly — звісно.

> [!word] evidence
> ipa: /ˈev.ɪ.dəns/ · pos: noun · level: B1 · id: en-b1-modals-possibility-w07
> uk: докази, свідчення
> example: There's no **evidence** that he was there. — Немає доказів, що він там був.
> note: незлічуване: a piece of evidence, не ~~an evidence~~.

> [!word] obviously
> ipa: /ˈɒb.vi.əs.li/ · ipa-us: /ˈɑːb.vi.əs.li/ · pos: adv · level: B1 · id: en-b1-modals-possibility-w08
> uk: очевидно, ясна річ
> example: She's **obviously** tired — she's been yawning all day. — Вона явно втомилася: позіхає цілий день.

> [!word] clue
> ipa: /kluː/ · pos: noun · level: B1 · id: en-b1-modals-possibility-w09
> uk: підказка; доказ, зачіпка
> example: The police have no **clues** yet. — У поліції поки немає жодних зачіпок.
> note: I haven't got a clue! — гадки не маю!

> [!word] mystery
> ipa: /ˈmɪs.tər.i/ · ipa-us: /ˈmɪs.tɚ.i/ · pos: noun · level: B1 · id: en-b1-modals-possibility-w10
> uk: таємниця, загадка; детектив (жанр)
> example: Where my keys went is a **mystery**. — Куди поділися мої ключі — загадка.

## Слухаємо

> [!listen] Що ти почув?
> level: B1 · type: choice · id: en-b1-modals-possibility-l01
> audio: She can't be at home.
> - [x] She can't be at home.
> - [ ] She can be at home.
> - [ ] She must be at home.

> [!listen] Що ти почув?
> level: B1 · type: choice · id: en-b1-modals-possibility-l02
> audio: It might rain later.
> - [ ] It may rain later.
> - [x] It might rain later.
> - [ ] It must rain later.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: en-b1-modals-possibility-l03
> audio: You must be very tired after your journey.

> [!listen] Наскільки Макс упевнений, де ключі?
> level: B1 · type: answer · id: en-b1-modals-possibility-l04
> audio: A: Max, have you seen my keys?
> audio: B: They might be in your jacket. Or they could be in the car.
> audio: A: They can't be in the car — I walked to work today.
> audio: B: Then they must be in your jacket.
> - [ ] Ключі точно в машині.
> - [x] Спершу він не впевнений, а потім робить висновок, що ключі, мабуть, у куртці.
> - [ ] Він точно знає, що ключі вдома на столі.
> - [ ] Він вважає, що ключі вкрали.
>
> **Пояснення:** *might… could…* — спершу лише припущення. Машину виключає *can't* (пішки на роботу), і лишається *must be in your jacket*.

> [!listen] IELTS Listening, Part 2. Choose the correct answer. What does the guide say about the weather?
> level: B1 · type: answer · id: en-b1-modals-possibility-l05
> audio: Welcome to the mountain walk. Please keep your raincoats with you. The sky looks clear now, but the weather can change very quickly up here, and it may get foggy near the top. If it does, we might have to turn back early.
> - [ ] It will definitely be foggy at the top.
> - [x] There is a chance of fog, and the walk could end early.
> - [ ] It is raining now, so the walk is cancelled.
> - [ ] The weather never changes in the mountains.
>
> **Пояснення:** *it **may** get foggy* і *we **might** have to turn back* — лише можливість, не впевненість. Варіант з *definitely* — пастка: у тексті немає певності.

> [!listen] Хто, на думку дівчини, стоїть біля дверей?
> level: B1 · type: answer · id: en-b1-modals-possibility-l06
> audio: A: Someone's at the door. Is it the pizza?
> audio: B: It can't be the pizza. We only ordered five minutes ago.
> audio: A: Then who could it be?
> audio: B: It must be Dan. He said he'd bring my charger back.
> - [ ] Курʼєр з піцою.
> - [x] Мабуть, Ден, який мав повернути зарядку.
> - [ ] Сусід, який скаржиться на шум.
> - [ ] Вона гадки не має.
>
> **Пояснення:** піцу виключено (*can't be* — замовили 5 хвилин тому), а *must be Dan* — висновок: він обіцяв занести зарядку.

## Вимова

> [!speak] Скажи вголос
> level: B1 · id: en-b1-modals-possibility-s01
> text: You must be joking!
> ipa: /juː məst bi ˈdʒəʊ.kɪŋ/
> tip: must у середині фрази — слабке /məst/, а t майже зникає: [мес-бі].

> [!speak] Скажи вголос
> level: B1 · id: en-b1-modals-possibility-s02
> text: That can't be true.
> ipa: /ðæt kɑːnt bi truː/
> ipa-us: /ðæt kænt bi truː/
> tip: can't — довге /ɑː/ (UK) або /æ/ (US), t ледь чути. Can't завжди під наголосом, на відміну від can.

> [!speak] Скажи вголос
> level: B1 · id: en-b1-modals-possibility-s03
> text: It might rain this afternoon.
> ipa: /ɪt maɪt reɪn ðɪs ˌɑːf.təˈnuːn/
> tip: might — дифтонг /aɪ/, gh не читається: [майт]; afternoon — наголос у кінці: af-ter-NOON.

> [!speak] Скажи вголос
> level: B1 · id: en-b1-modals-possibility-s04
> text: She may not know about it.
> ipa: /ʃiː meɪ nɒt nəʊ əˈbaʊt ɪt/
> tip: у know літера k не читається: [ноу]; not і know — не зливай в одне слово, легка пауза.

> [!speak] Скажи вголос
> level: B1 · id: en-b1-modals-possibility-s05
> text: They must be having dinner.
> ipa: /ðeɪ məst bi ˈhæv.ɪŋ ˈdɪn.ə/
> tip: having — /æ/ відкрите, -ing з носовим /ŋ/ без «г» у кінці.

> [!speak] IELTS Speaking, Part 3 — обережна відповідь
> level: B1 · id: en-b1-modals-possibility-s06
> text: It might be because young people spend more time online.
> ipa: /ɪt maɪt bi bɪˈkɒz jʌŋ ˈpiː.pəl spend mɔː taɪm ˌɒnˈlaɪn/
> tip: питання — «Why do young people read fewer books today?». Might be because… — так звучить обережна, зважена думка (hedging), яку в IELTS цінують.

## Типові помилки українців

> [!pitfall] mustn't замість can't
> «Він не може бути вдома» — ***He can't be at home***. *He mustn't be at home* британець зрозуміє як «йому заборонено бути вдома». Must і mustn't — не дзеркальна пара в значенні ймовірності: протилежність *must be* — **can't be**.

> [!pitfall] «He maybe tired», «Maybe he is maybe…»
> **maybe** — окреме слово на початку: *Maybe he's tired.* **may be** — два слова як дієслово: *He may be tired.* Не змішуй їх і не дублюй сумнів.

> [!pitfall] «It can rain tomorrow»
> Українське «завтра **може** піти дощ» — про конкретний випадок. Англійською — **might / may / could**: *It might rain tomorrow.* **Can** — для загальної можливості: *It can rain a lot in autumn.*

> [!pitfall] «She must to be…», «He mights…»
> Після модальних немає *to*, і вони не мають закінчення *-s*: *She **must be** at work*, *He **might know***.

## Практика

> [!quiz] Твій друг каже: «Я щойно виграв поїздку на Балі!» Найприродніша реакція?
> level: B1 · id: en-b1-modals-possibility-q04
> - [x] You must be so happy!
> - [ ] You can be so happy!
> - [ ] You mustn't be so happy!
> - [ ] You might to be so happy!
>
> **Пояснення:** очевидний висновок «напевно, ти щасливий!» — **must be**.

> [!quiz] Обери всі правильні речення
> level: B1 · type: multi · id: en-b1-modals-possibility-q05
> - [x] He might not come to the party.
> - [ ] She mights be at home.
> - [x] They must be sleeping — all the lights are off.
> - [ ] It can't to be true.
> - [x] Maybe he's stuck in traffic.
>
> **Пояснення:** модальні без *-s* і без *to*: *might be*, *can't be*. *Must be sleeping* — висновок про дію зараз. *Maybe* — окреме слово на початку.

> [!quiz] Встав must, might або can't
> level: B1 · type: fill · bank · id: en-b1-modals-possibility-q06
>
> ```text fill
> She's been running for an hour. She [[must]] be thirsty.
> I'm not sure where Oleh is. He [[might]] be in the library.
> This [[can't]] be my bag — mine is blue.
> You [[must]] be the new student. Welcome!
> ```
>
> **Пояснення:** докази «так» → **must**; невпевненість → **might**; докази «ні» → **can't**.

> [!quiz] Перефразуй за допомогою модального дієслова: «Maybe he is at work»
> level: B1 · type: fill · id: en-b1-modals-possibility-q07
>
> ```text fill
> Maybe he is at work. → He [[may|might|could]] be at work.
> I'm sure she's at home. → She [[must]] be at home.
> I'm sure it isn't Petro. → It [[can't|cannot|couldn't]] be Petro.
> Perhaps they won't come. → They [[might not|may not]] come.
> ```
>
> **Пояснення:** *maybe / perhaps* → **may / might / could**; *I'm sure… is* → **must**; *I'm sure… isn't* → **can't**; «можливо, ні» → **might not / may not**.

> [!quiz] Склади речення: «Вона, мабуть, зараз працює»
> level: B1 · type: order · id: en-b1-modals-possibility-q08
>
> ```text order
> She
> must
> be
> working
> now.
> mustn't // ✗
> ```
>
> **Пояснення:** висновок про дію в процесі — **must be + -ing**.

> [!quiz] Склади речення: «Можливо, завтра похолодає»
> level: B1 · type: order · id: en-b1-modals-possibility-q09
>
> ```text order
> It
> might
> get
> colder
> tomorrow.
> can // ✗
> ```
>
> **Пояснення:** конкретна можливість у майбутньому — **might**, а не *can*.

> [!quiz] Що означає «You can't be serious!»?
> level: B1 · id: en-b1-modals-possibility-q10
> - [ ] Тобі заборонено бути серйозним!
> - [x] Ти, мабуть, жартуєш! / Не може бути, щоб ти казав це серйозно!
> - [ ] Ти не вмієш бути серйозним.
> - [ ] Ти, можливо, серйозний.
>
> **Пояснення:** *can't be* — висновок «не може бути». Розмовний вираз недовіри, як і *You must be joking!*

> [!quiz] Яке речення про конкретне майбутнє правильне?
> level: B1 · id: en-b1-modals-possibility-q11
> - [ ] The train can be late tonight because of the snow.
> - [x] The train might be late tonight because of the snow.
> - [ ] The train must to be late tonight because of the snow.
> - [ ] The train maybe late tonight because of the snow.
>
> **Пояснення:** конкретний вечір і можливість → **might be**. *Can* — загальна можливість, *maybe* — прислівник, а не дієслово.

> [!quiz] Обери речення, яке показує найбільшу впевненість
> level: B1 · id: en-b1-modals-possibility-q12
> - [ ] It might be Olena's car.
> - [ ] It could be Olena's car.
> - [x] It must be Olena's car.
> - [ ] It may be Olena's car.
>
> **Пояснення:** **must** — найвища точка на шкалі «так». *May, might, could* — лише можливість.

### У форматі IELTS

> [!quiz] IELTS Reading — True, False or Not Given?
> level: B1 · tags: ielts · id: en-b1-modals-possibility-q13
>
> *Scientists are still not certain why some birds fly thousands of kilometres every year. One theory suggests that they may follow the Earth's magnetic field. Others believe the birds might use the position of the sun and stars. Most researchers agree that more than one factor is likely to be involved.*
>
> **Statement:** *Scientists have proved that birds use the Earth's magnetic field to find their way.*
>
> - [ ] True
> - [x] False
> - [ ] Not Given
>
> **Пояснення:** у тексті — *not certain*, *may follow*, *one theory suggests*: це припущення, а не доказ. *Have proved* суперечить *are still not certain* → **False**. Модальні в IELTS Reading — ключ до таких питань.

> [!quiz] IELTS Reading — Matching. Наскільки автор упевнений? Постав certain, possible або impossible.
> level: B1 · type: fill · bank · tags: ielts · id: en-b1-modals-possibility-q14
>
> ```text fill
> "The ancient wall must be over two thousand years old." → [[certain]]
> "The tools could have a religious purpose." → [[possible]]
> "The site can't be a Roman fort — it is too old." → [[impossible]]
> "The village may be older than the wall." → [[possible]]
> ```
>
> **Пояснення:** **must** → автор упевнений (*certain*); **could / may** → можливо (*possible*); **can't** → виключено (*impossible*). Такі завдання — matching features — перевіряють, чи бачиш ти ступінь упевненості автора.

## Фішки

> [!reel] 🕵️ Must be — улюблене слово Шерлока
> «You have been in Afghanistan, I perceive». Шерлок Голмс робить висновки з дрібниць — засмаги, постави. Англійська дедукція тримається на must і can't: факт → висновок.

> [!reel] 🌦️ May чи might — що впевненіше?
> Колись might було минулим від may. Тепер вони майже рівні, але багато носіїв відчувають may трохи впевненішим і формальнішим, а might — розмовним і обережнішим. У прогнозі погоди почуєш обидва.

> [!reel] 🤏 Hedging — мистецтво не стверджувати
> В академічній англійській рідко пишуть «це так». Пишуть It may be…, This might suggest…, It is likely that… Це hedging — обережність, і в IELTS Writing вона піднімає бал.

## Джерела та що почитати

- 🟢 R. Murphy — *English Grammar in Use* (Cambridge): units про must і can't, may і might.
- 🟢 [British Council LearnEnglish — Modals: deductions about the present](https://learnenglish.britishcouncil.org/grammar/b1-b2-grammar/modals-deductions-about-present) — пояснення й вправи.
- 🟡 [Cambridge Dictionary — English Grammar Today](https://dictionary.cambridge.org/grammar/british-grammar/) — статті про may, might, must, can't.
- 🟡 M. Swan — *Practical English Usage*: must (deduction), may і might, can (possibility).

> [!important] Підсумок
> - **must be** — «напевно так» (є докази); **can't be** — «не може бути» (є докази).
> - **may / might / could** — «можливо»; **may not / might not** — «можливо, ні».
> - Дія зараз: **must / might / can't + be + -ing**.
> - Конкретне майбутнє — **might / may / could**, не *can*.
> - **mustn't** — заборона, не ймовірність; **maybe** — одне слово, **may be** — два.
