---
title: Інтонація — питання, переліки, емоції
order: 218
id: en-a2-intonation
level: A2
icon: px:wand
tags: [english, a2, pronunciation, intonation, questions, politeness]
prerequisites: ["[[English - A2 - 13. Наголос у реченні й слабкі форми]]"]
estimatedMinutes: 35
---

# Інтонація — питання, переліки, емоції

> [!success] Після цієї теми ти зможеш
> - опускати голос ↘ у твердженнях і wh-питаннях і піднімати ↗ у питаннях «так / ні»;
> - вимовляти переліки й питання-вибір: *apples ↗, bananas ↗ and pears ↘*, *Tea ↗ or coffee ↘?*;
> - перепитувати й дивуватися: *Sorry? ↗*, *Really? ↗*;
> - звучати зацікавлено та ввічливо, а не байдуже чи різко;
> - розрізняти «справжнє» питання-хвостик і хвостик, що просить згоди: *isn't it ↗* / *isn't it ↘*.

## Передбач

> [!quiz] Ти кажеш «Thank you» рівним низьким голосом, без руху вгору чи вниз. Як це, найімовірніше, сприйме англієць?
> level: A2 · id: en-a2-intonation-q01
> - [ ] як звичайну щиру подяку
> - [x] як байдужість або навіть роздратування
> - [ ] як питання
> - [ ] інтонація в англійській нічого не означає
>
> **Пояснення:** в англійській мелодія голосу несе **ставлення**. Рівне монотонне *Thank you* звучить холодно. Щира подяка починається високо й падає: *THANK you ↘*. Слова ті самі — враження протилежне.

## Пояснення

### Де «живе» інтонація

Мелодія речення будується навколо **головного наголошеного слова** — зазвичай останнього змістового слова у фразі. Саме на ньому голос робить головний рух: падає ↘ або піднімається ↗.

*I live in KYIV ↘.* — рух на *Kyiv*.
*Do you live in KYIV ↗?* — рух теж на *Kyiv*, але вгору.

> [!diagram] Два базові рухи голосу
> ```yaml
> layout: compare
> columns: { fall: "↘ Падіння — завершено, впевнено", rise: "↗ Підйом — відкрито, питаю" }
> nodes:
>   - { id: f1, col: fall, label: "твердження", text: "I'm from LVIV ↘.", tone: blue }
>   - { id: f2, col: fall, label: "wh-питання", text: "Where do you LIVE ↘?", tone: blue }
>   - { id: f3, col: fall, label: "наказ", text: "Close the DOOR ↘.", tone: blue }
>   - { id: f4, col: fall, label: "вигук", text: "How LOVEly ↘!", tone: blue }
>   - { id: r1, col: rise, label: "питання так / ні", text: "Are you from LVIV ↗?", tone: orange }
>   - { id: r2, col: rise, label: "перепитування", text: "SORry ↗?", tone: orange }
>   - { id: r3, col: rise, label: "здивування, інтерес", text: "REALly ↗?", tone: orange }
>   - { id: r4, col: rise, label: "незавершений перелік", text: "apples ↗, bananas ↗…", tone: orange }
> steps:
>   - { show: [f1, r1], note: "Те саме слово Lviv: падіння — я повідомляю факт; підйом — я питаю і чекаю «так» чи «ні»." }
>   - { show: [f2, r2], note: "Wh-питання (where, what, why…) зазвичай падають: питальне слово вже показує, що це питання. Sorry? ↗ — «не почув, повтори»." }
>   - { show: [f3, r3], note: "Наказ і прохання падають. Really? ↗ з широким підйомом — «справді? розкажи ще!»." }
>   - { show: [f4, r4], note: "Вигук падає з висоти. Підйом у переліку — сигнал «я ще не закінчив»." }
> ```

### Головні правила

| Тип | Мелодія | Приклад |
|---|---|---|
| твердження | ↘ | *I've got two BROthers ↘.* |
| wh-питання (*what, where, why, how*) | ↘ | *What's your NAME ↘?* |
| питання так / ні | ↗ | *Is this your BAG ↗?* |
| наказ, порада | ↘ | *Sit DOWN ↘, please.* |
| перепитування, здивування | ↗ (широко) | *Sorry ↗?* *Really ↗?* *Tomorrow ↗?* |
| незавершений перелік | ↗ ↗ … ↘ на останньому | *red ↗, green ↗ and BLUE ↘* |
| питання-вибір | ↗ … ↘ | *Tea ↗ or COFfee ↘?* |
| хвостик, що чекає згоди | ↘ | *It's cold today, ISn't it ↘?* |
| хвостик — справжнє питання | ↗ | *You're coming, AREn't you ↗?* |

> [!tip] Питання-вибір: одна фраза, два значення
> *Would you like tea ↗ or coffee ↘?* — вибери одне з двох. Відповідь: *Coffee, please.*
> *Would you like tea or coffee ↗?* (один підйом у кінці) — «хочеш чогось випити?». Відповідь: *Yes, please* або *No, thanks*.

### Переліки

Голос піднімається на кожному пункті, поки перелік не закінчиться, і падає на останньому:

> [!diagram] Перелік у магазині
> ```yaml
> layout: flow
> nodes:
>   - { id: a, label: "↗", text: "apples", note: "буде ще", tone: orange }
>   - { id: b, label: "↗", text: "bananas", note: "буде ще", tone: orange }
>   - { id: c, label: "↗", text: "some milk", note: "буде ще", tone: orange }
>   - { id: d, label: "↘", text: "and bread", note: "кінець", tone: blue }
> steps:
>   - { focus: a, note: "I need apples ↗ — голос іде вгору: слухач розуміє, що перелік триває." }
>   - { focus: b, note: "bananas ↗ — знову вгору. Кожен підйом — «чекай, ще не все»." }
>   - { focus: c, note: "some milk ↗ — ще один пункт." }
>   - { focus: d, note: "and BREAD ↘ — and і падіння голосу разом кажуть: перелік завершено." }
> ```

### Емоції та ввічливість

Англійці говорять у **ширшому діапазоні**, ніж ми: голос піднімається вище й опускається нижче. Для українського вуха це іноді звучить «театрально», але для англійського **вузький діапазон звучить байдуже, сумно або грубо**.

- *Hello ↗!* з підйомом — привітно; *Hello ↘* низько й рівно — «чого тобі?».
- *Thank you ↘* — почни високо на THANK і опусти.
- *Really ↗?* з широким підйомом — щира зацікавленість; рівне *Really.* ↘ — «ну-ну, звісно».
- *Sorry ↗?* — «не почув»; *Sorry ↘.* — «вибач».
- *Oh dear ↘* — співчуття; *Lovely ↘!* — радість, з високого початку.

### Що каже українська інтонація

Добра новина: твердження й wh-питання в українській теж зазвичай падають — тут у тебе вже правильна база. Відмінності:

1. **Питання так / ні.** В українській голос різко злітає на слові, про яке питаємо, а потім може падати: «Ти пІдеш↗ завтра?». В англійській підйом починається на останньому наголошеному слові й **триває до кінця**: *Are you going TOmorrow ↗?*
2. **Діапазон.** Українська мелодія спокійніша й вужча. В англійській «рівний» голос легко сприйняти як нудьгу або невдоволення. Сміливіше «малюй» голосом.
3. **Ввічливі прохання.** Українське «Дайте води» з рівною інтонацією нормальне; англійське *Give me some water ↘* — різкий наказ. Потрібні і слова (*Could I have…?*), і мелодія.

## Приклади

- *Where do you live ↘?* — Де ти живеш?
- *Do you live near here ↗?* — Ти живеш поблизу?
- *I bought apples ↗, bananas ↗ and pears ↘.* — Я купив яблука, банани й груші.
- *Tea ↗ or coffee ↘? — Coffee, please.* — Чай чи кава? — Каву, будь ласка.
- *Sorry ↗? Can you say that again?* — Перепрошую? Можете повторити?
- *I've got a new job! — Really ↗? That's great ↘!* — У мене нова робота! — Справді? Чудово!
- *It's a lovely day, isn't it ↘?* — Гарний день, правда ж?
- *You're Anna's brother, aren't you ↗?* — Ти ж брат Анни, так?
- *I failed the test. — Oh dear ↘. What a pity ↘.* — Я провалив тест. — Ох. Як шкода.
- *Guess what ↘? I'm getting married!* — Уяви собі! Я виходжу заміж!

## Слова

> [!word] tone
> ipa: /təʊn/ · ipa-us: /toʊn/ · pos: noun · level: A2 · id: en-a2-intonation-w01
> uk: тон; інтонація; сигнал (телефону)
> example: Don't speak to me in that **tone**! — Не говори зі мною таким тоном!

> [!word] pitch
> ipa: /pɪtʃ/ · pos: noun · level: A2 · id: en-a2-intonation-w02
> uk: висота (голосу, звуку); поле (футбольне)
> example: Her voice has a high **pitch**. — У неї високий голос.

> [!word] Oh dear!
> ipa: /əʊ ˈdɪə/ · ipa-us: /oʊ ˈdɪr/ · pos: phrase · level: A2 · id: en-a2-intonation-w03
> uk: ох!; о, ні!; ой-ой (співчуття, легке засмучення)
> example: I've lost my keys. — **Oh dear!** — Я загубив ключі. — Ох, ні!
> note: голос падає ↘ на dear.

> [!word] lovely
> ipa: /ˈlʌvli/ · pos: adj · level: A2 · id: en-a2-intonation-w04
> uk: чудовий; гарний; милий
> example: What a **lovely** day! — Який чудовий день!
> note: у Британії — універсальна позитивна реакція: Lovely! ↘ — Чудово!

> [!word] actually
> ipa: /ˈæktʃuəli/ · pos: adv · level: A2 · id: en-a2-intonation-w05
> uk: насправді; взагалі-то
> example: **Actually**, I'm from Kharkiv, not Kyiv. — Взагалі-то я з Харкова, не з Києва.
> note: хибний друг: не «актуально». Часто з fall-rise ↘↗ — мʼяко виправляє співрозмовника.

> [!word] Fair enough.
> ipa: /ˌfeər ɪˈnʌf/ · ipa-us: /ˌfer ɪˈnʌf/ · pos: phrase · level: A2 · id: en-a2-intonation-w06
> uk: справедливо; резонно; гаразд
> example: I can't come — I'm working. — **Fair enough.** — Не можу прийти — працюю. — Що ж, зрозуміло.

> [!word] How come?
> ipa: /ˌhaʊ ˈkʌm/ · pos: phrase · level: A2 · id: en-a2-intonation-w07
> uk: як так?; чому?
> example: I'm not going to the party. — **How come?** — Я не піду на вечірку. — Як так?
> note: розмовне; після нього — прямий порядок слів: How come you're late?

> [!word] No way!
> ipa: /ˌnəʊ ˈweɪ/ · ipa-us: /ˌnoʊ ˈweɪ/ · pos: phrase · level: A2 · id: en-a2-intonation-w08
> uk: та ну!; не може бути!; ні за що!
> example: I won the lottery! — **No way!** — Я виграв у лотерею! — Не може бути!
> note: здивування — широкий рух голосу; відмова — різке падіння ↘.

> [!word] What a pity!
> ipa: /ˌwɒt ə ˈpɪti/ · ipa-us: /ˌwʌt ə ˈpɪti/ · pos: phrase · level: A2 · id: en-a2-intonation-w09
> uk: як шкода!
> example: The concert is cancelled. — **What a pity!** — Концерт скасували. — Як шкода!

> [!word] Guess what?
> ipa: /ˌɡes ˈwɒt/ · ipa-us: /ˌɡes ˈwʌt/ · pos: phrase · level: A2 · id: en-a2-intonation-w10
> uk: уяви собі!; знаєш що?
> example: **Guess what?** We're moving to Lviv! — Уяви собі! Ми переїжджаємо до Львова!
> note: вступ до новини; голос падає на what ↘.

## Слухаємо

> [!listen] Мовець стверджує чи питає?
> level: A2 · type: answer · speed: slow · id: en-a2-intonation-l01
> audio: You're from Kyiv?
> - [ ] стверджує: «Ти з Києва.»
> - [x] питає, перепитує: «Ти з Києва?»

> [!listen] Скільки різних фруктів купив мовець?
> level: A2 · type: answer · speed: slow · id: en-a2-intonation-l02
> audio: I bought apples, bananas, oranges and pears.
> - [ ] три
> - [x] чотири
> - [ ] пʼять

> [!listen] Як правильно відповісти?
> level: A2 · type: answer · id: en-a2-intonation-l03
> audio: Would you like tea or coffee?
> - [x] обрати одне: Tea, please. / Coffee, please.
> - [ ] Yes, please.
> - [ ] I'm fine, thanks.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · id: en-a2-intonation-l04
> audio: What time does the film start?

> [!listen] Як реагує друга людина?
> level: A2 · type: answer · id: en-a2-intonation-l05
> audio: A: I've got a new job!
> audio: B: Really? That's fantastic! Where?
> audio: A: At a bank in the city centre.
> - [ ] не вірить і сердиться
> - [x] щиро радіє і розпитує
> - [ ] байдуже, бо їй нецікаво

> [!listen] Що відчуває друга людина?
> level: A2 · type: answer · id: en-a2-intonation-l06
> audio: A: I failed my driving test again.
> audio: B: Oh dear. What a pity! You can try again next month.
> - [x] співчуває і підбадьорює
> - [ ] сміється
> - [ ] радіє

> [!listen] Чому перша людина їде до Парижа?
> level: A2 · type: answer · id: en-a2-intonation-l07
> audio: A: Guess what? I'm going to Paris next week!
> audio: B: No way! How come?
> audio: A: I won a competition at work.
> audio: B: Lucky you!
> - [ ] у відрядження
> - [x] виграла конкурс на роботі
> - [ ] у відпустку з родиною

> [!listen] Чи справді перша людина не знає, яка погода?
> level: A2 · type: answer · id: en-a2-intonation-l08
> audio: A: It's a lovely day, isn't it?
> audio: B: Yes, it's beautiful. Perfect for a walk.
> - [ ] так, вона питає, бо не бачить погоди
> - [x] ні, вона просто починає розмову й чекає згоди
> - [ ] ні, вона скаржиться на погоду

## Вимова

### Мінімальні пари: та сама фраза — інша мелодія

Слова однакові, різниця лише в русі голосу. Слухай кінець фрази.

> [!pair] Sorry? /ˈsɒri ↗/ — Sorry. /ˈsɒri ↘/
> level: A2 · id: en-a2-intonation-p01
> say: Sorry?
> tip: ↗ — «перепрошую, не почув»; ↘ — «вибач».

> [!pair] Really? /ˈrɪəli ↗/ — Really. /ˈrɪəli ↘/
> level: A2 · id: en-a2-intonation-p02
> say: Really.
> tip: ↗ — «справді?» з інтересом; ↘ — спокійне підтвердження «справді так».

> [!pair] Coffee? /ˈkɒfi ↗/ — Coffee. /ˈkɒfi ↘/
> level: A2 · id: en-a2-intonation-p03
> say: Coffee?
> tip: ↗ — пропозиція «кави?»; ↘ — відповідь «каву».

> [!pair] Tomorrow? /təˈmɒrəʊ ↗/ — Tomorrow. /təˈmɒrəʊ ↘/
> level: A2 · id: en-a2-intonation-p04
> say: Tomorrow.
> tip: ↗ — здивоване перепитування; ↘ — факт.

### Скажи вголос

> [!speak] Спитай, де людина живе
> level: A2 · id: en-a2-intonation-s01
> text: Where do you live?
> ipa: /ˈweə də jə ˈlɪv ↘/
> tip: wh-питання — голос падає на LIVE ↘. Не піднімай голос у кінці.

> [!speak] Спитай, чи людина живе поблизу
> level: A2 · id: en-a2-intonation-s02
> text: Do you live near here?
> ipa: /də jə ˈlɪv nɪə ˈhɪə ↗/
> tip: питання так / ні — голос іде вгору на HERE і до кінця ↗.

> [!speak] Перелічи покупки
> level: A2 · id: en-a2-intonation-s03
> text: I need apples, bananas, milk and bread.
> ipa: /aɪ niːd ˈæpəlz ↗ bəˈnɑːnəz ↗ ˈmɪlk ↗ ən ˈbred ↘/
> tip: ↗ на кожному пункті, ↘ лише на bread.

> [!speak] Запропонуй вибір
> level: A2 · id: en-a2-intonation-s04
> text: Tea or coffee?
> ipa: /ˈtiː ↗ ə ˈkɒfi ↘/
> tip: tea ↗ — вгору, coffee ↘ — вниз. Це вибір з двох.

> [!speak] Перепитай
> level: A2 · id: en-a2-intonation-s05
> text: Sorry? Can you say that again?
> ipa: /ˈsɒri ↗ kən juː ˈseɪ ðæt əˈɡen ↘/
> tip: Sorry ↗ — широкий підйом; далі прохання з падінням ↘.

> [!speak] Здивуйся й зрадій
> level: A2 · id: en-a2-intonation-s06
> text: Really? That's fantastic!
> ipa: /ˈrɪəli ↗ ðæts fænˈtæstɪk ↘/
> tip: Really ↗ — голос злітає високо; fan-TAS-tic ↘ — падає з висоти.

> [!speak] Подякуй щиро
> level: A2 · id: en-a2-intonation-s07
> text: Thank you so much!
> ipa: /ˈθæŋk juː səʊ ˈmʌtʃ ↘/
> tip: почни високо й опусти голос на MUCH ↘. Рівний голос звучить холодно.

> [!speak] Вислови співчуття
> level: A2 · id: en-a2-intonation-s08
> text: Oh dear. What a pity!
> ipa: /əʊ ˈdɪə ↘ ˌwɒt ə ˈpɪti ↘/
> tip: мʼяко, обидві фрази падають ↘; голос нижчий і тепліший.

> [!speak] Почни світську розмову
> level: A2 · id: en-a2-intonation-s09
> text: It's a lovely day, isn't it?
> ipa: /ɪts ə ˈlʌvli ˈdeɪ ↘ ˈɪzənt ɪt ↘/
> tip: хвостик isn't it ↘ — ти не питаєш, а чекаєш згоди.

> [!speak] Перевір здогад
> level: A2 · id: en-a2-intonation-s10
> text: You're Anna's brother, aren't you?
> ipa: /jɔːr ˈænəz ˈbrʌðə ↘ ˈɑːnt juː ↗/
> tip: хвостик aren't you ↗ — справжнє питання, ти не впевнений.

> [!speak] Ввічливо попроси
> level: A2 · id: en-a2-intonation-s11
> text: Could you open the window, please?
> ipa: /kʊd juː ˈəʊpən ðə ˈwɪndəʊ ↗ pliːz/
> tip: мʼякий підйом на WINdow ↗ робить прохання ввічливим.

> [!speak] Поділися новиною
> level: A2 · id: en-a2-intonation-s12
> text: Guess what? I'm getting married!
> ipa: /ˌɡes ˈwɒt ↘ aɪm ˌɡetɪŋ ˈmærid ↘/
> tip: широкий діапазон: MARried — високо і різко вниз ↘.

## Типові помилки українців

> [!pitfall] Монотонність = байдужість
> Українська мелодія спокійніша, тому українці англійською часто звучать рівно. Англійці чують у цьому нудьгу, втому або невдоволення. Особливо у фразах *Thank you*, *Hello*, *That's great*: «малюй» голосом ширше, ніж здається природним.

> [!pitfall] Підйом у wh-питаннях
> *Where do you live ↗?* з підйомом звучить як здивоване перепитування або допит. Wh-питання зазвичай **падають**: *Where do you LIVE ↘?* Підйом лишаємо для питань «так / ні».

> [!pitfall] Різкі прохання
> *Give me the menu ↘.* — наказ. Ввічливо: *Could I have the menu ↗, please?* Слова *could* і *please* важливі, але без мʼякої мелодії навіть вони звучать вимогливо.

## Практика

> [!quiz] Яка інтонація в кінці питання «Where do you work?»
> level: A2 · id: en-a2-intonation-q02
> - [x] ↘ падіння
> - [ ] ↗ підйом
> - [ ] рівна
>
> **Пояснення:** wh-питання (*where, what, when, why, how*) зазвичай падають ↘.

> [!quiz] У яких реченнях голос у кінці зазвичай піднімається ↗? Обери всі.
> level: A2 · type: multi · id: en-a2-intonation-q03
> - [x] Are you tired?
> - [ ] What's your name?
> - [x] Sorry? (не почув)
> - [ ] Close the door, please.
> - [x] Do you like jazz?
>
> **Пояснення:** питання так / ні і перепитування — ↗. Wh-питання і прохання-наказ — ↘.

> [!quiz] Як вимовити перелік «red, green and blue»?
> level: A2 · id: en-a2-intonation-q04
> - [ ] red ↘, green ↘ and blue ↘
> - [x] red ↗, green ↗ and blue ↘
> - [ ] red ↘, green ↘ and blue ↗
> - [ ] усе рівно
>
> **Пояснення:** ↗ на кожному пункті — «ще не все», ↘ на останньому — «кінець переліку».

> [!quiz] Офіціант питає: «Would you like tea ↗ or coffee ↘?» Що відповісти?
> level: A2 · id: en-a2-intonation-q05
> - [ ] Yes, please.
> - [x] Coffee, please.
> - [ ] No, thank you, I'm fine.
> - [ ] Both is good.
>
> **Пояснення:** ↗…↘ — питання-вибір: обери одне. На *tea or coffee ↗* (один підйом) можна відповісти *Yes, please*.

> [!quiz] «It's cold today, isn't it ↘?» з падінням у хвостику означає…
> level: A2 · id: en-a2-intonation-q06
> - [ ] мовець справді не знає, чи холодно
> - [x] мовець упевнений і чекає згоди
> - [ ] мовець сердиться
> - [ ] мовець питає про завтра
>
> **Пояснення:** хвостик ↘ — «правда ж?», запрошення погодитися. Хвостик ↗ — справжнє питання.

> [!quiz] Друг каже: «I've got a new job!» Яка реакція звучить щиро зацікавлено?
> level: A2 · id: en-a2-intonation-q07
> - [ ] «Really.» — рівно й низько
> - [x] «Really? ↗ That's great! ↘» — з широким рухом голосу
> - [ ] «OK.»
> - [ ] «And?»
>
> **Пояснення:** зацікавленість в англійській — це широкий діапазон голосу. Рівне *Really.* звучить як «ну і що».

> [!quiz] Постав стрілку: ↗ чи ↘
> level: A2 · type: fill · id: en-a2-intonation-q08 · bank
>
> ```text fill
> Is this your bag [[↗]]
> What's your name [[↘]]
> You're from Kyiv? (здивовано) [[↗]]
> Sit down, please [[↘]]
> ```

> [!quiz] Постав стрілки в переліку
> level: A2 · type: fill · id: en-a2-intonation-q09 · bank
>
> ```text fill
> I speak Ukrainian [[↗]], Polish [[↗]] and English [[↘]].
> ```

> [!quiz] Склади ввічливе прохання
> level: A2 · type: order · id: en-a2-intonation-q10
>
> ```text order
> Could
> you
> open
> the
> window,
> please?
> ```
>
> **Пояснення:** *Could you…?* + мʼякий підйом на *window* — ввічливо. *Open the window ↘* — наказ.

> [!quiz] Чим англійське питання «так / ні» відрізняється від українського за мелодією?
> level: A2 · id: en-a2-intonation-q11
> - [ ] нічим
> - [x] в англійській голос піднімається на останньому наголошеному слові й іде вгору до кінця
> - [ ] в англійській голос у кінці завжди падає
> - [ ] в англійській питання вимовляють пошепки
>
> **Пояснення:** в українській підйом — на слові, про яке питаємо, де б воно не стояло. В англійській головний рух — наприкінці: *Are you coming toMORrow ↗?*

> [!quiz] Чому англійцю може здатися, що ти грубий, хоча слова ввічливі?
> level: A2 · id: en-a2-intonation-q12
> - [ ] через акцент у голосних
> - [x] через рівну, монотонну інтонацію з вузьким діапазоном
> - [ ] через швидкий темп
> - [ ] через слабкі форми службових слів
>
> **Пояснення:** в англійській ставлення передається мелодією. Рівний голос = байдужість чи невдоволення.

## Фішки

> [!reel] 🎢 Англійці «співають» ширше
> В англійській голос зазвичай рухається в ширшому діапазоні, ніж в українській: вище на наголосах і нижче в кінці. Тому нам здається, що англійці «грають», а їм — що ми сумуємо.

> [!reel] ☕ Tea or coffee — два питання в одному
> *Tea ↗ or coffee ↘?* — «що саме?». *Tea or coffee ↗?* — «хочеш чогось?». Однакові слова, різні питання — і різні правильні відповіді.

> [!reel] ✋ Actually — не «актуально»
> *Actually* означає «насправді», «взагалі-то». Британці додають його з мелодією ↘↗, щоб мʼяко не погодитися: *Actually ↘↗, I think it's Tuesday.* — це ввічливіше, ніж пряме *No*.

## Джерела та що почитати

- [BBC Learning English — Intonation](https://www.bbc.co.uk/learningenglish/english/features/pronunciation) — відео про підйом і падіння.
- [British Council TeachingEnglish — Intonation](https://www.teachingenglish.org.uk/professional-development/teachers/pronunciation) — правила й приклади.
- [Cambridge Dictionary — Grammar: Question tags](https://dictionary.cambridge.org/grammar/british-grammar/question-tags) — хвостики й інтонація.
- J. C. Wells — *English Intonation: An Introduction*: найдоступніший підручник з інтонації.
- M. Hancock — *English Pronunciation in Use* (Intermediate), розділи про intonation.

> [!important] Підсумок
> - Головний рух голосу — на останньому наголошеному слові фрази.
> - ↘ — твердження, wh-питання, накази, вигуки, хвостик-«правда ж?».
> - ↗ — питання так / ні, перепитування, здивування, незавершений перелік, хвостик-справжнє питання.
> - Перелік: ↗ ↗ ↗ … ↘; вибір: *Tea ↗ or coffee ↘?*
> - Ширший діапазон голосу = зацікавленість і ввічливість; монотонність = байдужість.
