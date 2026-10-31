---
title: Здоровʼя, тіло й у лікаря
id: de-a2-arzt
level: A2
icon: px:heart
tags: [deutsch, a2, vocabulary, gesundheit, arzt]
prerequisites: ["[[Deutsch - A1 - 11. haben, знахідний відмінок і kein]]", "[[Deutsch - A1 - 19. Модальні дієслова — können, müssen, wollen, dürfen, möchten]]"]
estimatedMinutes: 45
---

# Здоровʼя, тіло й у лікаря

> [!success] Після цієї теми ти зможеш
> - назвати частини тіла й сказати, що болить: *Mein Rücken tut weh. Ich habe Halsschmerzen.*;
> - описати симптоми: *Ich habe Fieber und Husten. Mir ist schlecht. Mir ist schwindlig.*;
> - домовитися про Termin, пройти реєстрацію в Praxis і зрозуміти, що таке Rezept, Überweisung і Krankschreibung;
> - відрізнити Apotheke від Drogerie й знати, який номер набрати в Notfall;
> - побажати хворому одужання: *Gute Besserung!*

## Передбач

> [!quiz] Як сказати німецькою «У мене болить голова»?
> level: A2 · type: single · id: de-a2-arzt-q01
> - [x] Ich habe Kopfschmerzen.
> - [ ] Ich bin Kopfschmerzen.
> - [ ] Ich schmerze am Kopf.
> - [ ] Ich tue Kopf weh.
>
> **Пояснення:** українське «болить» німецька передає або іменником *der Schmerz* (*Ich habe Kopfschmerzen*), або дієсловом *wehtun*, де підмет — частина тіла: *Mein Kopf tut weh*. Конструкції з «я» як підметом у значенні «у мене болить» не існує.

## Пояснення

### Що болить: моделі

Українською ми кажемо «болить голова», «болять ноги» — підметом стає частина тіла. Німецька дає кілька способів, і всі їх варто знати.

| Модель | Приклад | Переклад |
|---|---|---|
| **Ich habe** + *-schmerzen* | Ich habe Kopfschmerzen. | У мене болить голова. |
| **Mein … tut weh** | Mein Rücken tut weh. | Болить спина. |
| **Mir tut … weh** (Dativ) | Mir tut der Bauch weh. | Мені болить живіт. |
| **Ich habe Schmerzen** + *in* | Ich habe Schmerzen im Hals. | У мене біль у горлі. |

Складні слова з *-schmerzen* зазвичай стоять у множині: *Kopfschmerzen, Halsschmerzen, Bauchschmerzen, Rückenschmerzen, Zahnschmerzen*. Дієслово *wehtun* узгоджується з тим, що болить: *Mein Kopf **tut** weh*, але *Meine Füße **tun** weh*. У моделі з *Mir tut … weh* «я» стоїть у давальному відмінку (*mir*) — тема [[Deutsch - A2 - 05. Давальний відмінок — Dativ]].

### Як почуваєшся

| Німецькою | Значення |
|---|---|
| Mir ist schlecht. | Мені зле; нудить. |
| Mir ist schwindlig. | У мене паморочиться голова. |
| Mir ist heiß / kalt. | Мені жарко / холодно. |
| Ich habe Fieber. | У мене температура. |
| Ich habe Husten / Schnupfen. | У мене кашель / нежить. |
| Ich bin erkältet. | Я застудився. |
| Ich habe eine Erkältung / die Grippe. | У мене застуда / грип. |
| Es geht mir nicht gut. | Мені не дуже добре. |

> [!tip] Температура — *Fieber*, а не «Temperatur»
> *Ich habe Fieber* означає, що температура підвищена. Слово *die Temperatur* використовують про погоду й про саме вимірювання: *Ich messe meine Temperatur.* Щоб сказати, що в тебе «температура 38», кажуть: *Ich habe 38 Grad Fieber* або *Ich habe Fieber, 38,5.*

### Німецька система: від Hausarzt до Apotheke

У Німеччині з не надто терміновою проблемою зазвичай спершу йдуть до **Hausarzt** (сімейного лікаря). До більшості вузьких спеціалістів (*Facharzt*: Augenarzt, Frauenarzt, Zahnarzt) можна записатися й напряму, але **Überweisung** від Hausarzt часто полегшує отримання Termin; для деяких спеціальностей вона потрібна. Майже всі мають страхування в **Krankenkasse**; на реєстрації в **Praxis** показують **Versichertenkarte**. Лікар може виписати **Rezept** на ліки або **Krankschreibung**, якщо через хворобу не можна працювати.

> [!diagram] Візит до лікаря: від Termin до Apotheke
> ```yaml
> layout: flow
> nodes:
>   - { id: a, label: "1. Запис", text: "einen Termin machen", note: "по телефону або онлайн", tone: yellow }
>   - { id: b, label: "2. Реєстрація", text: "Versichertenkarte abgeben", note: "на рецепції Praxis", tone: pink }
>   - { id: c, label: "3. Огляд", text: "die Untersuchung", note: "Wartezimmer, потім кабінет", tone: yellow }
>   - { id: d, label: "4. Папери", text: "Rezept · Krankschreibung · Überweisung", note: "що виписує лікар", tone: pink }
>   - { id: e, label: "5. Ліки", text: "Apotheke", note: "за Rezept — рецептурні ліки", tone: gray }
> edges:
>   - { from: a, to: b, label: "у день візиту" }
>   - { from: b, to: c, label: "потім" }
>   - { from: c, to: d, label: "за потреби" }
>   - { from: d, to: e, label: "з Rezept" }
> steps:
>   - { focus: a, note: "Без Termin до лікаря зазвичай не потрапиш; у гострому випадку кажи про це одразу при дзвінку." }
>   - { focus: b, note: "На рецепції віддають Versichertenkarte. Без неї можуть попросити документ про страхування пізніше." }
>   - { focus: c, note: "Untersuchung: лікар питає, що болить, і оглядає." }
>   - { focus: d, note: "Rezept — на ліки, Krankschreibung — для роботодавця, Überweisung — до спеціаліста (потрібна не завжди)." }
>   - { focus: e, note: "Рецептурні ліки видає лише Apotheke. Drogerie — інший тип магазину." }
> ```

### Apotheke ≠ Drogerie

В Україні «аптека» продає майже все. У Німеччині є два різні заклади, і плутати їх легко.

> [!diagram] Apotheke чи Drogerie?
> ```yaml
> layout: compare
> columns: { a: "die Apotheke", b: "die Drogerie" }
> nodes:
>   - { id: a1, col: a, label: "що продає", text: "Medikamente", note: "у тому числі за Rezept", tone: pink }
>   - { id: a2, col: a, label: "хто працює", text: "Apotheker/in", note: "фахівець із ліків", tone: pink }
>   - { id: b1, col: b, label: "що продає", text: "Zahnpasta, Shampoo, Windeln", note: "гігієна й косметика", tone: yellow }
>   - { id: b2, col: b, label: "приклад", text: "dm, Rossmann", note: "мережі в Німеччині", tone: yellow }
> steps:
>   - { focus: [a1, a2], note: "Apotheke: ліки, консультація, рецептурні препарати." }
>   - { focus: [b1, b2], note: "Drogerie: побутова хімія, засоби гігієни, косметика. Рецептурні ліки там не видають." }
> ```
> Рожеві блоки — Apotheke, жовті — Drogerie; назва закладу є в заголовку кожної колонки.

### Notfall: що робити

- **112** — Notruf у Німеччині: Rettungsdienst (*Krankenwagen*) і Feuerwehr; працює по всьому ЄС. **110** — поліція.
- **116 117** — лікарська служба, коли Praxis зачинена, а ситуація не загрозлива для життя (*ärztlicher Bereitschaftsdienst*).
- В Австрії та Швейцарії швидку викликають за номером **144**; 112 там теж приймає дзвінки.
- На початку дзвінка скажи: **Wo?** (адреса — повільно), **Was?** (що сталося), **Wer?** (хто дзвонить). Не клади слухавку — чекай на питання (*Warten auf Rückfragen*).

### Krankschreibung і робота

Коли ти захворів, роботодавця треба повідомити **негайно**. Якщо хвороба триває довше за три календарні дні, потрібна довідка від лікаря — не пізніше наступного робочого дня; роботодавець може вимагати її й раніше. Для застрахованих у gesetzliche Krankenkasse лікар передає дані електронно (*eAU*); приватно застраховані й далі отримують паперову довідку. Повідомити про хворобу має сам працівник.

## Приклади

- Mein Rücken tut seit gestern weh. — Спина болить від учора.
- Ich habe Fieber und Husten. — У мене температура й кашель.
- Mir ist schlecht und mir ist schwindlig. — Мені зле, і голова паморочиться.
- Ich habe einen Termin beim Hausarzt. — Я записаний до сімейного лікаря.
- Haben Sie Ihre Versichertenkarte dabei? — Ви взяли Versichertenkarte?
- Der Arzt hat mir ein Rezept gegeben. — Лікар дав мені рецепт.
- Sie nimmt die Tabletten dreimal am Tag ein. — Вона приймає таблетки тричі на день.
- Wir brauchen einen Krankenwagen! Rufen Sie die 112! — Нам потрібна швидка! Набирайте 112!
- Die Apotheke hat bis 18 Uhr geöffnet. — Аптека працює до 18:00.
- Du bist erkältet? Gute Besserung! — Ти застудився? Одужуй!

## Слова

### Тіло

> [!word] der Rücken
> ipa: /ˈʁʏkn̩/ · pos: noun · level: A2 · id: de-a2-arzt-w01
> uk: спина
> forms: die Rücken
> example: Mein **Rücken** tut nach der Arbeit weh. — Після роботи в мене болить спина.
> note: ü — губи трубочкою, язик як для «і»; -en у кінці — слабке [n̩].

> [!word] der Hals
> ipa: /hals/ · pos: noun · level: A2 · id: de-a2-arzt-w02
> uk: шия; горло
> forms: die Hälse
> example: Ich habe **Halsschmerzen** und Fieber. — У мене болить горло й температура.
> note: Один і той самий Hals — і «шия», і «горло»; болить горло — Halsschmerzen. h — легкий видих.

> [!word] die Schulter
> ipa: /ˈʃʊltɐ/ · pos: noun · level: A2 · id: de-a2-arzt-w03
> uk: плече
> forms: die Schultern
> example: Meine rechte **Schulter** tut weh. — Праве плече болить.
> note: sch = «ш»; -er у кінці вокалізоване [ɐ].

> [!word] der Finger
> ipa: /ˈfɪŋɐ/ · pos: noun · level: A2 · id: de-a2-arzt-w04
> uk: палець (руки)
> forms: die Finger
> example: Ich habe mir den **Finger** geschnitten. — Я порізав палець.
> note: палець ноги — der Zeh (die Zehen). ng = носовий [ŋ], як у «банк».

> [!word] das Knie
> ipa: /kniː/ · pos: noun · level: A2 · id: de-a2-arzt-w05
> uk: коліно
> forms: die Knie
> example: Mein linkes **Knie** schmerzt beim Treppensteigen. — Ліве коліно болить, коли підіймаюсь сходами.
> note: k вимовляємо: «кні». Множина die Knie звучить як [ˈkniːə] (два склади).

> [!word] der Magen
> ipa: /ˈmaːɡn̩/ · pos: noun · level: A2 · id: de-a2-arzt-w06
> uk: шлунок
> forms: die Mägen
> example: Mein **Magen** tut weh. Ich habe nichts gegessen. — Болить шлунок. Я нічого не їв.
> note: Magenschmerzen — біль у шлунку; про біль «у животі» здебільшого кажуть Bauchschmerzen.

> [!word] der Körper
> ipa: /ˈkœʁpɐ/ · pos: noun · level: A2 · id: de-a2-arzt-w07
> uk: тіло
> forms: die Körper
> example: Mein ganzer **Körper** tut weh. — Болить усе тіло.
> note: ö — губи як для «о», язик як для «е».

> [!word] die Haut
> ipa: /haʊ̯t/ · pos: noun · level: A2 · id: de-a2-arzt-w08
> uk: шкіра
> forms: die Häute
> example: Meine **Haut** ist rot und juckt. — Шкіра червона й свербить.
> note: у побуті множину майже не вживають.

> [!word] das Blut
> ipa: /bluːt/ · pos: noun · level: A2 · id: de-a2-arzt-w09
> uk: кров
> forms: — (без множини)
> example: Die Ärztin nimmt mir **Blut** ab. — Лікарка бере в мене кров.
> note: кінцеве t звучить виразно: «блут».

### Симптоми й хвороби

> [!word] der Schmerz
> ipa: /ʃmɛʁts/ · pos: noun · level: A2 · id: de-a2-arzt-w10
> uk: біль
> forms: die Schmerzen
> example: Ich habe starke **Schmerzen** im Rücken. — У мене сильний біль у спині.
> note: найчастіше вживають множину; Schmerztablette — знеболювальне.

> [!word] das Fieber
> ipa: /ˈfiːbɐ/ · pos: noun · level: A2 · id: de-a2-arzt-w11
> uk: температура; жар
> forms: — (без множини)
> example: Das Kind hat seit zwei Tagen **Fieber**. — У дитини вже два дні температура.
> note: ie = довге [iː]; f = «ф». Температуру вимірюють: Fieber messen.

> [!word] der Husten
> ipa: /ˈhuːstn̩/ · pos: noun · level: A2 · id: de-a2-arzt-w12
> uk: кашель
> forms: — (без множини)
> example: Ich habe seit einer Woche **Husten**. — У мене вже тиждень кашель.
> note: дієслово — husten: Er hustet viel. h — видих.

> [!word] der Schnupfen
> ipa: /ˈʃnʊpfn̩/ · pos: noun · level: A2 · id: de-a2-arzt-w13
> uk: нежить
> forms: — (без множини)
> example: Ich habe **Schnupfen** und Kopfschmerzen. — У мене нежить і болить голова.
> note: Schnupfen — це саме нежить, а не загальна застуда (die Erkältung). pf — одне злите звучання [pf].

> [!word] die Erkältung
> ipa: /ɛɐ̯ˈkɛltʊŋ/ · pos: noun · level: A2 · id: de-a2-arzt-w14
> uk: застуда
> forms: die Erkältungen
> example: Im Herbst haben viele Leute eine **Erkältung**. — Восени багато людей застуджуються.
> note: іменники на -ung жіночого роду. Дієслово — sich erkälten (застудитися).

> [!word] die Grippe
> ipa: /ˈɡʁɪpə/ · pos: noun · level: A2 · id: de-a2-arzt-w15
> uk: грип
> forms: — (без множини)
> example: Meine Kollegin hat die **Grippe**. — Моя колега хворіє на грип.
> note: у розмові Grippe часто називають і сильну застуду; медично це різні хвороби.

> [!word] die Allergie
> ipa: /alɛʁˈɡiː/ · pos: noun · level: B1 · id: de-a2-arzt-w16
> uk: алергія
> forms: die Allergien
> example: Ich habe eine **Allergie** gegen Katzen. — У мене алергія на котів.
> note: наголос на кінці -ie [ˈɡiː]; «алергія на» — Allergie gegen + Akk. Прикметник — allergisch.

> [!word] schwindlig
> ipa: /ˈʃvɪndlɪç/ · pos: adj · level: B1 · id: de-a2-arzt-w17
> uk: який відчуває запаморочення
> example: Mir ist **schwindlig**. Ich muss mich setzen. — У мене паморочиться голова. Мені треба сісти.
> note: зазвичай з Dativ: Mir ist schwindlig. -ig у кінці = [ɪç]. Пишуть також schwindelig.

> [!word] erkältet
> ipa: /ɛɐ̯ˈkɛltət/ · pos: adj · level: A2 · id: de-a2-arzt-w18
> uk: застуджений
> example: Ich bin **erkältet** und bleibe heute zu Hause. — Я застудився й сьогодні лишаюсь удома.
> note: стан: Ich bin erkältet; сам процес — Ich habe mich erkältet (я застудився).

### У лікаря

> [!word] der Hausarzt
> ipa: /ˈhaʊ̯sʔaːɐ̯tst/ · pos: noun · level: A2 · id: de-a2-arzt-w19
> uk: сімейний лікар
> forms: die Hausärzte
> example: Ich gehe morgen zu meinem **Hausarzt**. — Завтра я йду до свого сімейного лікаря.
> note: жінка — die Hausärztin. Вузький спеціаліст — der Facharzt. AT: також Arzt für Allgemeinmedizin.

> [!word] die Sprechstunde
> ipa: /ˈʃpʁɛçʃtʊndə/ · pos: noun · level: A2 · id: de-a2-arzt-w20
> uk: години прийому
> forms: die Sprechstunden
> example: Die **Sprechstunde** beginnt um neun Uhr. — Прийом починається о девʼятій.
> note: sp на початку складу = «шп»; ch після е = [ç].

> [!word] das Rezept
> ipa: /ʁeˈtsɛpt/ · pos: noun · level: A2 · id: de-a2-arzt-w21
> uk: рецепт (лікарський; кулінарний)
> forms: die Rezepte
> example: Der Arzt schreibt mir ein **Rezept**. — Лікар виписує мені рецепт.
> note: те саме слово — і «рецепт ліків», і «кулінарний рецепт». Рецептурні ліки — verschreibungspflichtig.

> [!word] das Medikament
> ipa: /medikaˈmɛnt/ · pos: noun · level: A2 · id: de-a2-arzt-w22
> uk: ліки; препарат
> forms: die Medikamente
> example: Das **Medikament** hole ich in der Apotheke. — Ліки я візьму в аптеці.
> note: «ліки» в однині: ein Medikament, множина — die Medikamente. Наголос на -ment.

> [!word] die Tablette
> ipa: /taˈblɛtə/ · pos: noun · level: A2 · id: de-a2-arzt-w23
> uk: таблетка
> forms: die Tabletten
> example: Nehmen Sie die **Tablette** zweimal am Tag. — Приймайте таблетку двічі на день.
> note: наголос на другому складі.

> [!word] die Krankenkasse
> ipa: /ˈkʁaŋkn̩kasə/ · pos: noun · level: A2 · id: de-a2-arzt-w24
> uk: лікарняна каса; страхова компанія (медична)
> forms: die Krankenkassen
> example: Welche **Krankenkasse** haben Sie? — У якій Krankenkasse Ви застраховані?
> note: медичне страхування в Німеччині обовʼязкове, більшість застрахована в gesetzliche Krankenkasse. У Швейцарії базове страхування також обовʼязкове, але пропонують його приватні Krankenkassen.

> [!word] die Versichertenkarte
> ipa: /fɛɐ̯ˈzɪçɐtn̩kaʁtə/ · pos: noun · level: B1 · id: de-a2-arzt-w25
> uk: картка страхувальника
> forms: die Versichertenkarten
> example: Bitte geben Sie Ihre **Versichertenkarte** an der Anmeldung ab. — Будь ласка, віддайте картку на реєстрації.
> note: офіційно — elektronische Gesundheitskarte (eGK). AT: e-card; CH: Versichertenkarte.

> [!word] die Krankschreibung
> ipa: /ˈkʁaŋkʃʁaɪ̯bʊŋ/ · pos: noun · level: B1 · id: de-a2-arzt-w26
> uk: лікарняний (довідка про непрацездатність)
> forms: die Krankschreibungen
> example: Ich brauche eine **Krankschreibung** für meinen Chef. — Мені потрібен лікарняний для керівника.
> note: «лікар виписав мені лікарняний» — Der Arzt hat mich krankgeschrieben. Офіційна назва: Arbeitsunfähigkeitsbescheinigung.

> [!word] die Untersuchung
> ipa: /ʊntɐˈzuːxʊŋ/ · pos: noun · level: B1 · id: de-a2-arzt-w27
> uk: огляд; обстеження
> forms: die Untersuchungen
> example: Nach der **Untersuchung** weiß ich mehr. — Після огляду я знатиму більше.
> note: -ung — жіночий рід. Наголос на -such- (довге [uː]).

> [!word] untersuchen
> ipa: /ʊntɐˈzuːxn̩/ · pos: verb · level: B1 · id: de-a2-arzt-w28
> uk: оглядати; досліджувати
> forms: untersuchen → untersuchte → hat untersucht
> example: Die Ärztin **untersucht** den Patienten. — Лікарка оглядає пацієнта.
> note: наголос на -such-; префікс unter- тут безнаголосний, дієслово нероздільне.

> [!word] die Impfung
> ipa: /ˈɪmpfʊŋ/ · pos: noun · level: B1 · id: de-a2-arzt-w29
> uk: щеплення
> forms: die Impfungen
> example: Die **Impfung** gegen Grippe ist im Herbst. — Щеплення від грипу — восени.
> note: щеплення — gegen + Akk: Impfung gegen Grippe. Документ — der Impfpass.

> [!word] der Notruf
> ipa: /ˈnoːtʁuːf/ · pos: noun · level: B1 · id: de-a2-arzt-w30
> uk: екстрений виклик
> forms: die Notrufe
> example: Der **Notruf** in Deutschland ist die 112. — Екстрений номер у Німеччині — 112.
> note: AT, CH: швидка допомога — 144.

> [!word] der Notfall
> ipa: /ˈnoːtfal/ · pos: noun · level: B1 · id: de-a2-arzt-w31
> uk: невідкладний випадок
> forms: die Notfälle
> example: Das ist ein **Notfall**! Bitte kommen Sie schnell! — Це невідкладний випадок! Будь ласка, приїжджайте швидко!
> note: у Notfall — «у невідкладному випадку»; Notdienst — чергова служба (черговий лікар — der Bereitschaftsarzt).

> [!word] der Krankenwagen
> ipa: /ˈkʁaŋkn̩vaːɡn̩/ · pos: noun · level: A2 · id: de-a2-arzt-w32
> uk: швидка допомога (автомобіль)
> forms: die Krankenwagen
> example: Der **Krankenwagen** ist in fünf Minuten da. — Швидка буде за пʼять хвилин.
> note: у рятувальній службі — RTW (Rettungswagen, екстрена допомога) і KTW (Krankentransportwagen, транспортування). Кінцеве -wagen: w = «в», g = [ɡ] «ґ».

> [!word] die Notaufnahme
> ipa: /ˈnoːtʔaʊ̯fnaːmə/ · pos: noun · level: B1 · id: de-a2-arzt-w33
> uk: приймальне відділення; невідкладна допомога
> forms: die Notaufnahmen
> example: Wir fahren sofort in die **Notaufnahme**. — Ми їдемо відразу в приймальне відділення.
> note: Notaufnahme — відділення лікарні (Krankenhaus) для невідкладних випадків; AT: часто Ambulanz, CH: Notfallstation.

> [!word] die Drogerie
> ipa: /dʁoɡəˈʁiː/ · pos: noun · level: A2 · id: de-a2-arzt-w34
> uk: дрогері (магазин гігієни й косметики)
> forms: die Drogerien
> example: Shampoo und Zahnpasta kaufe ich in der **Drogerie**. — Шампунь і зубну пасту я купую в дрогері.
> note: Drogerie — не аптека: рецептурних ліків там немає. Наголос на -rie.

> [!word] die Salbe
> ipa: /ˈzalbə/ · pos: noun · level: B1 · id: de-a2-arzt-w35
> uk: мазь
> forms: die Salben
> example: Tragen Sie die **Salbe** zweimal täglich auf. — Наносьте мазь двічі на день.
> note: s перед голосним — дзвінке [z].

> [!word] das Pflaster
> ipa: /ˈpflastɐ/ · pos: noun · level: B1 · id: de-a2-arzt-w36
> uk: пластир
> forms: die Pflaster
> example: Hast du ein **Pflaster**? Ich habe mich geschnitten. — У тебе є пластир? Я порізався.
> note: pfl- — три приголосні разом: [pf] + [l].

> [!word] die Überweisung
> ipa: /yːbɐˈvaɪ̯zʊŋ/ · pos: noun · level: B1 · id: de-a2-arzt-w37
> uk: направлення; грошовий переказ
> forms: die Überweisungen
> example: Der Hausarzt gibt mir eine **Überweisung** zum Orthopäden. — Сімейний лікар дає мені направлення до ортопеда.
> note: те саме слово — і «банківський переказ» (тема про банк).

> [!word] der Patient
> ipa: /paˈtsi̯ɛnt/ · pos: noun · level: A2 · id: de-a2-arzt-w38
> uk: пацієнт
> forms: die Patienten
> example: Der nächste **Patient**, bitte! — Наступний пацієнт, будь ласка!
> note: жінка — die Patientin, die Patientinnen. -ti- читається [tsi̯].

> [!word] einnehmen
> ipa: /ˈaɪ̯nneːmən/ · pos: verb · level: A2 · id: de-a2-arzt-w39
> uk: приймати (ліки)
> forms: einnehmen → er nimmt ein · nahm ein · hat eingenommen
> example: Ich **nehme** die Tablette morgens **ein**. — Я приймаю таблетку вранці.
> note: відокремлюване: ein|nehmen; Tabletten nehmen теж можна, але einnehmen — точніше.

> [!word] verschreiben
> ipa: /fɛɐ̯ˈʃʁaɪ̯bn̩/ · pos: verb · level: B1 · id: de-a2-arzt-w40
> uk: виписувати (рецепт)
> forms: verschreiben → verschrieb → hat verschrieben
> example: Der Arzt **verschreibt** mir ein Antibiotikum. — Лікар виписує мені антибіотик.
> note: нероздільне, префікс ver- безнаголосний. Рецептурні ліки — verschreibungspflichtig.

> [!word] Gute Besserung!
> ipa: /ˈɡuːtə ˈbɛsəʁʊŋ/ · pos: phrase · level: A2 · id: de-a2-arzt-w41
> uk: Одужуй! / Одужуйте!
> example: Du bist krank? **Gute Besserung!** — Ти хворий? Одужуй!
> note: слово «Besserung» — «покращення». Відповідь: Danke! Дякую!

> [!word] Mir ist schlecht.
> ipa: /miːɐ̯ ɪst ʃlɛçt/ · pos: phrase · level: A2 · id: de-a2-arzt-w42
> uk: Мені зле / Мене нудить.
> example: **Mir ist schlecht.** Ich glaube, ich habe etwas Falsches gegessen. — Мені зле. Здається, я зʼїв щось не те.
> note: mir — давальний відмінок. Es geht mir schlecht — ширше: «мені погано / мої справи кепські».

## Слухаємо

> [!listen] Що ти почув?
> level: A2 · type: choice · speed: slow · id: de-a2-arzt-l01
> audio: Mein Kopf tut weh.
> - [x] Mein Kopf tut weh.
> - [ ] Meine Füße tun weh.
> - [ ] Mir tut der Kopf weh.
>
> **Пояснення:** підмет *mein Kopf* — однина, тому *tut*. Для *meine Füße* було б *tun*. Третій варіант за змістом той самий, але слова стоять в іншому порядку — слухай, що саме сказали.

> [!listen] Що ти почув?
> level: A2 · type: choice · speed: slow · id: de-a2-arzt-l02
> audio: Ich habe Fieber und Husten.
> - [ ] Ich habe Fieber und Schnupfen.
> - [x] Ich habe Fieber und Husten.
> - [ ] Ich habe Kopfschmerzen und Husten.
>
> **Пояснення:** *Husten* (кашель) і *Schnupfen* (нежить) звучать зовсім по-різному. *Fieber* — [ˈfiːbɐ], довге [iː].

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-arzt-l03
> audio: Mir ist schwindlig.
> explain: пишемо *Mir ist schwindlig*, з Dativ *mir*. Слово *schwindlig* у кінці має -ig, яке звучить як [ɪç].

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-arzt-l04
> audio: Ich habe einen Termin um neun Uhr.
> explain: *einen Termin* — знахідний відмінок чоловічого роду: *ein* → *einen*.

> [!listen] Послухай телефонну розмову. На який день записали пацієнтку?
> level: A2 · type: answer · speed: slow · id: de-a2-arzt-l05
> audio: A: Praxis Doktor Neumann, guten Tag.
> audio: B: Guten Tag. Ich habe starke Halsschmerzen und Fieber. Kann ich heute noch kommen?
> audio: A: Heute ist leider alles voll. Morgen um halb zehn geht es.
> audio: B: Ja, das passt. Mein Name ist Bondar.
> - [ ] сьогодні
> - [x] завтра о пів на десяту
> - [ ] завтра о девʼятій
>
> **Пояснення:** *halb zehn* — це 9:30 (тобто пів на десяту), а не 10:30. *Heute ist alles voll* — сьогодні вже всі місця зайняті.

> [!listen] Послухай діалог у Praxis. Що просить подати адміністраторка?
> level: A2 · type: answer · speed: slow · id: de-a2-arzt-l06
> audio: A: Guten Morgen. Wie kann ich Ihnen helfen?
> audio: B: Guten Morgen. Ich habe einen Termin bei Frau Doktor Neumann, um neun Uhr.
> audio: A: Haben Sie Ihre Versichertenkarte dabei?
> audio: B: Ja, hier bitte.
> audio: A: Danke. Nehmen Sie bitte im Wartezimmer Platz.
> - [ ] Rezept
> - [x] Versichertenkarte
> - [ ] Überweisung
>
> **Пояснення:** *Haben Sie … dabei?* — «Ви маєте … із собою?». На реєстрації першою питають картку. *Wartezimmer* — зал очікування.

## Вимова

Чотири звуки в цій темі зручно відпрацювати разом: **[ç]** після переднього голосного (*Sprechstunde, schlecht, schwindlig*), **[ʃ]** на початку складу в *sp-, st-, sch-*, **[ts]** (*Rezept, Patient*) і **ü** (*Rücken, Körper, Überweisung*).

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-arzt-s01
> text: Mein Rücken tut weh.
> ipa: /maɪ̯n ˈʁʏkn̩ tuːt veː/
> tip: ü — губи трубочкою, язик як для «і»; -en у кінці — слабке [n̩], без окремого «е».
> uk: У мене болить спина.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-arzt-s02
> text: Mir ist schlecht und schwindlig.
> ipa: /miːɐ̯ ɪst ʃlɛçt ʊnt ˈʃvɪndlɪç/
> tip: schlecht закінчується на [çt]; -ig у кінці читаємо [ɪç]. w — «в».
> uk: Мені зле, і голова паморочиться.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-arzt-s03
> text: Ich habe Halsschmerzen.
> ipa: /ɪç ˈhaːbə ˈhalsʃmɛʁtsn̩/
> tip: h — видих, не «г». sch + m = «шм». rz у Schmerzen: горлове [ʁ] і далі [ts].
> uk: У мене болить горло.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-arzt-s04
> text: Der Arzt schreibt ein Rezept.
> ipa: /deːɐ̯ aːɐ̯tst ʃʁaɪ̯pt aɪ̯n ʁeˈtsɛpt/
> tip: Arzt — [aːɐ̯tst], без окремого «е»; ei = [aɪ̯]; z = [ts].
> uk: Лікар виписує рецепт.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-arzt-s05
> text: Ich habe einen Termin um neun Uhr.
> ipa: /ɪç ˈhaːbə ˈaɪ̯nən tɛʁˈmiːn ʊm nɔʏ̯n uːɐ̯/
> tip: Termin — наголос на -min. neun — дифтонг [ɔʏ̯]: один плавний звук, а не окремі «о» та «й».
> uk: У мене запис на девʼяту годину.

## Типові помилки українців

> [!pitfall] «Ich tue Kopf weh» і «Ich schmerze»
> Український підмет — частина тіла, і в німецькій теж: *Mein Kopf **tut** weh*, *Meine Füße **tun** weh*. Якщо «я» — підмет, то потрібна інша конструкція: *Ich **habe** Kopfschmerzen*. З «я» як підметом *wehtun* означає, що ти завдаєш біль комусь: *Ich tue dir weh* — «я завдаю тобі болю».

> [!pitfall] Apotheke ≠ Drogerie
> В Україні аптека продає і ліки, і косметику. У Німеччині **Apotheke** — передусім ліки, а гігієна й косметика — у **Drogerie** (dm, Rossmann). Рецептурні ліки Drogerie не видає, тож «за рецептом — у Drogerie» не спрацює.

> [!pitfall] «Мені зле» ≠ «Ich bin schlecht»
> *Mir ist schlecht* — нудить, кепсько. *Ich bin schlecht* означає, що ти поганий у чомусь (*Ich bin schlecht in Mathe*) або погана людина. Щоб сказати «мені погано» в загальному сенсі (справи, настрій, самопочуття), кажуть *Es geht mir schlecht*.

> [!pitfall] Krankenhaus чи Praxis?
> Зі звичайною застудою чи болем у спині йдуть до **Hausarzt** у **Praxis** за **Termin**, а не в **Krankenhaus**. До **Notaufnahme** їдуть, коли справді невідкладно — і якщо життя в небезпеці, то дзвонять **112**. У вихідні й увечері, коли Praxis зачинена, а ситуація не критична, допомагає **116 117**.

## Ситуація: у Praxis на реєстрації

> [!listen] Послухай діалог. Що каже пацієнтка про свої симптоми?
> level: A2 · type: answer · speed: slow · id: de-a2-arzt-l07
> audio: A: Guten Tag. Was fehlt Ihnen?
> audio: B: Mir ist seit gestern schlecht, und ich habe Fieber.
> audio: A: Haben Sie auch Husten?
> audio: B: Nein, aber mein Kopf tut weh.
> audio: A: Gut. Ich messe erst einmal Ihr Fieber.
> - [ ] нудить, кашель і біль у горлі
> - [x] нудить, температура й болить голова
> - [ ] кашель, нежить і біль у спині
>
> **Пояснення:** *Was fehlt Ihnen?* — «Що з Вами?» (дослівно «що Вам бракує»). Пацієнтка заперечує кашель: *Nein*, але називає *Kopf tut weh*.

Тепер скажи те саме від свого імені.

> [!speak] «Мені зле від учора, і в мене температура.»
> level: A2 · speed: slow · id: de-a2-arzt-s06
> text: Mir ist seit gestern schlecht, und ich habe Fieber.
> ipa: /miːɐ̯ ɪst zaɪ̯t ˈɡɛstɐn ʃlɛçt ʊnt ɪç ˈhaːbə ˈfiːbɐ/
> tip: seit — прийменник «з»: [zaɪ̯t], як і seid. gestern — g на початку слова дає «ґ». Fieber — довге [iː].
> uk: Мені зле від учора, і в мене температура.

> [!speak] «У мене болить живіт, і мені потрібен лікарняний.»
> level: A2 · speed: slow · id: de-a2-arzt-s07
> text: Mein Bauch tut weh, und ich brauche eine Krankschreibung.
> ipa: /maɪ̯n baʊ̯x tuːt veː ʊnt ɪç ˈbʁaʊ̯xə ˈaɪ̯nə ˈkʁaŋkʃʁaɪ̯bʊŋ/
> tip: Bauch — [x] «х» глибоко, як у «бах»; brauche — тут [x] теж. Krank-: ng = [ŋ] + k.
> uk: У мене болить живіт, і мені потрібен лікарняний.

## Landeskunde: Beim Arzt in Deutschland

> [!example] Beim Arzt in Deutschland
> Wenn man krank ist, ruft man zuerst bei der Hausarztpraxis an und bekommt einen Termin. Bei einem Notfall wartet man nicht: Unter der Nummer 112 ruft man den Krankenwagen. In der Praxis gibt man die Versichertenkarte an der Anmeldung ab. Nach der Untersuchung bekommt man vielleicht ein Rezept und holt das Medikament in der Apotheke. Eine Drogerie ist keine Apotheke: Dort kauft man zum Beispiel Zahnpasta und Shampoo, aber keine Medikamente auf Rezept. Wer wegen einer Krankheit nicht arbeiten kann, braucht eine Krankschreibung. Wenn die Praxis geschlossen ist und es nicht dringend ist, hilft die Nummer 116 117.
>
> **Переклад:** Коли людина хвора, вона спершу телефонує до кабінету сімейного лікаря й отримує запис. У невідкладному випадку чекати не слід: за номером 112 викликають швидку. У кабінеті на реєстрації віддають картку страхувальника. Після огляду, можливо, отримують рецепт і беруть ліки в аптеці. Drogerie — не аптека: там купують, наприклад, зубну пасту й шампунь, але не ліки за рецептом. Хто через хворобу не може працювати, потребує лікарняного. Якщо кабінет зачинений, а справа не термінова, допомагає номер 116 117.

> [!quiz] Що радить текст робити першим, якщо ти захворів, але це не терміново?
> level: A2 · type: single · id: de-a2-arzt-q02
> - [ ] поїхати в Notaufnahme
> - [x] зателефонувати до Hausarztpraxis і домовитися про Termin
> - [ ] піти в Drogerie по рецептурні ліки
> - [ ] одразу набрати 112
>
> **Пояснення:** текст: *ruft man zuerst bei der Hausarztpraxis an und bekommt einen Termin*. 112 — для *Notfall*, а Drogerie рецептурних ліків не продає.

> [!quiz] Де можна купити ліки за рецептом?
> level: A2 · type: single · id: de-a2-arzt-q03
> - [ ] у Drogerie
> - [x] в Apotheke
> - [ ] у Praxis при реєстрації
> - [ ] у Krankenkasse
>
> **Пояснення:** *Das Medikament holt man in der Apotheke.* Drogerie продає гігієну й косметику, а Praxis і Krankenkasse ліків не видають.

> [!quiz] Коли людині потрібна Krankschreibung?
> level: A2 · type: single · id: de-a2-arzt-q04
> - [ ] коли в неї є Rezept
> - [x] коли вона через хворобу не може працювати
> - [ ] коли вона йде до Apotheke
> - [ ] коли вона набирає 116 117
>
> **Пояснення:** *Wer wegen einer Krankheit nicht arbeiten kann, braucht eine Krankschreibung.* Rezept — на ліки, не на роботу.

## Практика

> [!quiz] Що зазвичай купують у Drogerie?
> level: A2 · type: single · id: de-a2-arzt-q05
> - [x] Shampoo і Zahnpasta
> - [ ] антибіотик за Rezept
> - [ ] Krankschreibung
> - [ ] Überweisung
>
> **Пояснення:** Drogerie продає гігієну й косметику. Рецептурні ліки видає Apotheke, а Krankschreibung і Überweisung виписує лікар.

> [!quiz] Обери всі правильні речення про самопочуття
> level: A2 · type: multi · id: de-a2-arzt-q06
> - [x] Mir tut der Bauch weh.
> - [x] Ich habe Fieber.
> - [ ] Ich bin Fieber.
> - [x] Mir ist schwindlig.
> - [ ] Ich habe schwindlig.
>
> **Пояснення:** *Fieber* — іменник, тож *haben*: *Ich habe Fieber*. *schwindlig* — прикметник у конструкції з Dativ: *Mir ist schwindlig*. *Ich bin Fieber* і *Ich habe schwindlig* — типові калькування.

> [!quiz] Що з цього лікар виписує пацієнтові? Обери всі правильні відповіді
> level: A2 · type: multi · id: de-a2-arzt-q07
> - [x] Rezept
> - [x] Krankschreibung
> - [x] Überweisung
> - [ ] Versichertenkarte
> - [ ] Tablette
>
> **Пояснення:** лікар виписує *Rezept, Krankschreibung, Überweisung*. Versichertenkarte видає Krankenkasse — її пацієнт сам приносить на реєстрацію, а Tablette — це вже сама форма ліків.

> [!quiz] Заповни пропуски
> level: A2 · type: fill · bank: Untersuchung, Notruf · id: de-a2-arzt-q08
>
> ```text fill
> Ich habe Husten und [[Fieber]].
> Mir tut der [[Rücken]] weh.
> Der Arzt schreibt ein [[Rezept]].
> Die Tabletten bekomme ich in der [[Apotheke]].
> ```
>
> **Пояснення:** *Fieber* — без артикля («Husten und Fieber»); *der Rücken* — чоловічий рід; *ein Rezept* — середній; *die Apotheke* — жіночий, тож *in der*. Слова *Untersuchung* і *Notruf* не пасують за змістом чи родом.

> [!quiz] Заповни пропуски дієсловами
> level: A2 · type: fill · bank: bin, hat · id: de-a2-arzt-q09
>
> ```text fill
> Mir [[ist]] schlecht.
> Mein Kopf [[tut]] weh.
> Der Arzt [[schreibt]] mich krank.
> Ich [[nehme]] die Tablette dreimal am Tag [[ein]].
> ```
>
> **Пояснення:** *Mir ist schlecht* — Dativ + *ist* (не *bin*). *Mein Kopf tut weh* — підмет в однині. *Der Arzt schreibt mich krank* — Präsens, не *hat*. *einnehmen* розділяється: *Ich nehme … ein*.

> [!quiz] Склади речення, почни зі слова Mir: «Мені болить спина»
> level: A2 · type: order · id: de-a2-arzt-q10
>
> ```text order
> Mir
> tut
> der
> Rücken
> weh.
> mich ✗
> ```
>
> **Пояснення:** конструкція *Mir tut der Rücken weh*: *mir* — Dativ; *weh* — відокремлена частина в кінці. Форма *mich* (знахідний) тут неправильна.

> [!quiz] Склади питання: «У тебе є запис до лікаря?»
> level: A2 · type: order · id: de-a2-arzt-q11
>
> ```text order
> Hast
> du
> einen
> Termin?
> ein ✗
> ```
>
> **Пояснення:** *der Termin* — чоловічий рід, після *haben* — знахідний: *einen Termin*. Форма *ein Termin* помилкова.

> [!quiz] Ти бачиш, як людина знепритомніла, і треба викликати швидку в Німеччині. Який номер набрати?
> level: A2 · type: single · id: de-a2-arzt-q12
> - [ ] 911
> - [x] 112
> - [ ] 110
> - [ ] 116 117
>
> **Пояснення:** 112 — екстрений виклик у Німеччині. 911 — американський номер, 110 — поліція, 116 117 — лікарська служба для нетермінових випадків.

> [!quiz] Що означає «Mir ist schlecht»?
> level: A2 · type: single · id: de-a2-arzt-q13
> - [ ] Я погана людина.
> - [x] Мені зле; мене нудить.
> - [ ] Мені холодно.
> - [ ] Мені соромно.
>
> **Пояснення:** *Mir ist schlecht* — про самопочуття. Погану людину виражає *Ich bin schlecht*.

> [!quiz] Колега каже, що в нього грип. Що ти скажеш?
> level: A2 · type: single · id: de-a2-arzt-q14
> - [x] Gute Besserung!
> - [ ] Gesundheit!
> - [ ] Guten Appetit!
> - [ ] Viel Glück!
>
> **Пояснення:** *Gute Besserung!* — побажання одужання. *Gesundheit!* кажуть, коли хтось чхнув, *Guten Appetit!* — перед їжею, *Viel Glück!* — на удачу.

## Фішки

> [!reel] 🏛️ Apotheke — «склад» по-грецьки
> Слово *Apotheke* походить від грецького *apothḗkē* — «склад, комора». Колись в аптеці зберігали трави й сушені рослини; відтоді назва лишилася, і в багатьох мовах аптека — це «склад ліків».

> [!reel] 🍀 Не плутай: Gute Besserung і Hals- und Beinbruch
> Хворому кажуть *Gute Besserung!* Побажання *Hals- und Beinbruch!* («поламай шию й ногу») — це на удачу перед іспитом або виступом, а не хворому. Походження пояснюють по-різному: за однією версією — від ідиш *hazloche un broche* («успіх і благословення»), за іншою — це побажання «навпаки», щоб не наврочити (як *toi, toi, toi*).

> [!reel] 🩺 Krankenkasse з 1883 року
> Закон про обовʼязкове медичне страхування робітників ухвалили в Німеччині 1883 року, за канцлера Отто фон Бісмарка. Закон зробив страхування обовʼязковим для робітників і заклав основу сучасної gesetzliche Krankenversicherung, хоч система відтоді сильно змінилася.

## Джерела та що почитати

- [DWDS — Apotheke](https://www.dwds.de/wb/Apotheke): значення, походження слова, вимова.
- [DWDS — Krankenkasse](https://www.dwds.de/wb/Krankenkasse): значення й вживання слова.
- [DWDS — Rezept](https://www.dwds.de/wb/Rezept): два значення слова — «рецепт ліків» і «кулінарний рецепт».
- [DWDS — wehtun](https://www.dwds.de/wb/wehtun): відмінювання, написання, приклади.
- [Duden — Drogerie](https://www.duden.de/rechtschreibung/Drogerie): значення слова й відмінність від аптеки.
- [Ärztlicher Bereitschaftsdienst 116 117](https://www.116117.de/): офіційна сторінка служби лікаря на виклик.
- [Gesetz über die Zahlung des Arbeitsentgelts an Feiertagen und im Krankheitsfall (§ 5)](https://www.gesetze-im-internet.de/entgfg/__5.html): повідомлення про хворобу й довідка про непрацездатність.
- [DW — Nicos Weg (A2)](https://learngerman.dw.com/uk/nicos-weg/c-36519789): безкоштовний відеокурс Deutsche Welle, діалоги в лікаря.

> [!important] Підсумок
> - Болить: *Ich habe Kopfschmerzen* або *Mein Kopf tut weh* (підмет — частина тіла) чи *Mir tut der Kopf weh* (Dativ).
> - Самопочуття: *Mir ist schlecht / schwindlig*, *Ich habe Fieber / Husten / Schnupfen*, *Ich bin erkältet*.
> - Система: **Termin** → **Praxis** (Versichertenkarte) → **Untersuchung** → **Rezept / Krankschreibung / Überweisung** → **Apotheke**.
> - **Apotheke** — ліки, **Drogerie** — гігієна й косметика. Notfall: **112**; нетерміново, коли Praxis зачинена, — **116 117**.
> - *Gute Besserung!* — побажання хворому.
