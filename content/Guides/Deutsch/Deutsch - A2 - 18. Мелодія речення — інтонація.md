---
title: Мелодія речення — інтонація
id: de-a2-intonation
level: A2
icon: px:headphones
tags: [deutsch, a2, pronunciation, intonation, satzmelodie]
prerequisites: ["[[Deutsch - A2 - 13. Наголос у реченні, ритм і редуковане -e]]", "[[Deutsch - A1 - 09. Питання й місце дієслова — V2 і W-Fragen]]"]
estimatedMinutes: 40
---

# Мелодія речення — інтонація

> [!success] Після цієї теми ти зможеш
> - поставити правильну мелодію у твердженні (↘), W-питанні (↘) і питанні «так / ні» (↗);
> - вимовити перелік (*Brot, Milch, Käse und Eier*) і питання з вибором (*Kaffee oder Tee?*) так, щоб слухач зрозумів, де закінчується речення;
> - висловити здивування, сумнів і ввічливе перепитування: *Echt? Wirklich? Wie bitte?*;
> - почути на слух, питають тебе чи ствердження.

## Передбач

> [!quiz] Як звучить наприкінці питання «Hast du Zeit?»
> level: A2 · type: single · id: de-a2-intonation-q01
> - [ ] голос падає ↘, як у твердженні
> - [x] голос іде вгору ↗
> - [ ] голос тримається рівно →
> - [ ] голос піднімається в середині й падає наприкінці
>
> **Пояснення:** у питанні «так / ні» дієслово стоїть першим, а голос піднімається до кінця: *Hast du Zeit? ↗* Якщо знизити голос, воно звучить менш як питання: сухіше й наполегливіше.

## Три основні мелодії

Інтонація — це зміна висоти голосу в реченні. В німецькій мові є кілька типових «мелодій» (так вони працюють у стандартній німецькій; в окремих регіонах вони можуть відрізнятися).

| Тип речення | Мелодія наприкінці | Приклад |
|---|---|---|
| Твердження | падіння ↘ | *Ich komme aus der Ukraine. ↘* |
| W-питання | падіння ↘ | *Wie heißt du? ↘* |
| Прохання, наказ | падіння ↘ | *Komm bitte schnell! ↘* |
| Питання «так / ні» | підйом ↗ | *Hast du Zeit? ↗* |
| Перепитування | підйом ↗ | *Wie bitte? ↗* |
| Перелік | підйом на кожному пункті, падіння на останньому | *Brot ↗, Milch ↗, Käse ↗ und Eier ↘* |

> [!diagram] Куди йде голос
> ```yaml
> layout: compare
> columns: { a: "падіння ↘", b: "підйом ↗" }
> nodes:
>   - { id: a1, col: a, label: "твердження", text: "Ich wohne in Köln. ↘", tone: yellow }
>   - { id: a2, col: a, label: "W-питання", text: "Wo wohnst du? ↘", tone: yellow }
>   - { id: a3, col: a, label: "наказ", text: "Komm schnell! ↘", tone: yellow }
>   - { id: b1, col: b, label: "питання «так / ні»", text: "Wohnst du in Köln? ↗", tone: pink }
>   - { id: b2, col: b, label: "перепитування", text: "Wie bitte? ↗", tone: pink }
>   - { id: b3, col: b, label: "перелік (не останній)", text: "Brot ↗, Milch ↗ …", tone: pink }
> steps:
>   - { focus: [a1, a2, a3], note: "Закінчене речення: голос падає. У W-питанні нове слово вже є (wo, wie, wann), тому підйом не потрібен." }
>   - { focus: [b1, b2, b3], note: "Незакінчена думка або питання без питального слова: голос піднімається. Слухач чекає відповіді або продовження." }
> ```
> Падіння = «я закінчив», підйом = «я чекаю».

### Чим відрізняється від української

В українській мові питання без питального слова зазвичай має підйом на тому слові, про яке питають, а далі голос знову падає: *Ти ЗАВТРА йдеш?* (підйом на «завтра», далі спад) У німецькій мові підйом в питанні «так / ні» зазвичай тягнеться **до кінця речення**: *Kommst du mit? ↗* Тому українці часто опускають голос наприкінці, і питання звучить як ствердження.

### Перелік і питання з вибором

- **Перелік:** на кожному пункті голос трохи піднімається («буде ще»), а на останньому падає: *Ich brauche Brot ↗, Milch ↗, Käse ↗ und Eier ↘.*
- **Питання з вибором (alternative question)**: на першому варіанті підйом, на другому падіння: *Möchten Sie Kaffee ↗ oder Tee ↘?* Відповідь «ja» тут не підходить: треба вибрати.

### Емоції та ввічливість

Мелодія передає ставлення до сказаного:

| Фраза | Мелодія | Значення |
|---|---|---|
| *Echt? ↗* | підйом | «Справді?» (здивування, цікавість) |
| *Echt. ↘* | падіння | «Справді.» (констатація; може звучати байдуже) |
| *Wirklich? ↗* | підйом | «Справді?» |
| *Wie bitte? ↗* | підйом | ввічливе перепитування |
| *Wie bitte?! ↘* | різке падіння | обурення: «Що?!» |
| *Ach so! ↘* | падіння | «А, зрозуміло!» |

> [!diagram] Ввічливе чи різке: одна фраза, дві мелодії
> ```yaml
> layout: flow
> nodes:
>   - { id: q, label: "Wie bitte? ↗", text: "ввічливе перепитування", tone: yellow }
>   - { id: e, label: "Wie bitte?! ↘", text: "обурення, різкість", tone: pink }
>   - { id: n, label: "Ach so! ↘", text: "зрозумів, дякую", tone: gray }
> steps:
>   - { focus: q, note: "Підйом голосу: «Я не розчув, повторіть, будь ласка.» Це звичайна ввічлива формула." }
>   - { focus: e, note: "Те саме слово з різким падінням, паузою й гучністю: «Що ви сказали?!» Так можна образити співрозмовника." }
>   - { focus: n, note: "Ach so! — коротке падіння, іноді з довгим [ax]. Показує, що ти зрозумів нову інформацію." }
> ```
> Мелодія вирішує, чи ти ввічливий.

## Приклади

- Hast du heute Zeit? ↗ — Ти маєш сьогодні час?
- Wie heißt du? ↘ — Як тебе звати?
- Ich komme aus der Ukraine. ↘ — Я з України.
- Ich brauche Brot, Milch, Käse und Eier. — Мені потрібні хліб, молоко, сир і яйця.
- Möchten Sie Kaffee oder Tee? — Ви хочете каву чи чай?
- Kannst du mir helfen? ↗ — Чи можеш ти мені допомогти?
- Komm bitte schnell! ↘ — Іди, будь ласка, швидше!
- Echt? Das ist ja toll! — Справді? Це ж чудово!
- Du kommst morgen? ↗ — Ти приходиш завтра? (питання за порядком слів твердження)
- Ach so! Jetzt verstehe ich. — А, тепер зрозуміло.
- Danke schön! ↘ — Щиро дякую!

## Слова

> [!word] die Intonation
> ipa: /ɪntonaˈtsi̯oːn/ · pos: noun · level: B1 · id: de-a2-intonation-w01
> uk: інтонація
> forms: die Intonationen
> example: Die **Intonation** verrät, ob es eine Frage ist. — Інтонація показує, чи це питання.
> note: -tion = [tsi̯oːn], наголос на останньому складі (див. A2-03). Часто чуєш разом: Intonation und Betonung.

> [!word] die Melodie
> ipa: /meloˈdiː/ · pos: noun · level: A2 · id: de-a2-intonation-w02
> uk: мелодія
> forms: die Melodien
> example: Die **Melodie** des Satzes geht nach unten. — Мелодія речення йде вниз.
> note: наголос на -die; множина die Melodien /meloˈdiːən/. Також про пісню: eine schöne Melodie.

> [!word] die Satzmelodie
> ipa: /ˈzatsmeloˌdiː/ · pos: noun · level: B1 · id: de-a2-intonation-w03
> uk: мелодія речення
> forms: die Satzmelodien
> example: Die **Satzmelodie** zeigt, wie der Satz endet. — Мелодія речення показує, як закінчується речення.
> note: складне слово Satz + Melodie; головний наголос на Satz-.

> [!word] steigen
> ipa: /ˈʃtaɪ̯ɡn̩/ · pos: verb · level: A2 · id: de-a2-intonation-w04
> uk: підніматися; зростати
> forms: steigen → stieg → ist gestiegen
> example: Bei einer Frage **steigt** die Stimme am Ende. — У питанні голос наприкінці піднімається.
> note: Perfekt з sein. ei = [aɪ̯], st на початку = «шт». Steigen також: in den Bus einsteigen.

> [!word] sinken
> ipa: /ˈzɪŋkn̩/ · pos: verb · level: B1 · id: de-a2-intonation-w05
> uk: опускатися; знижуватися
> forms: sinken → sank → ist gesunken
> example: Am Ende der Aussage **sinkt** die Stimme. — Наприкінці ствердження голос опускається.
> note: Perfekt з sein. s на початку слова перед голосним = [z], nk = [ŋk]. Синонім: fallen (падати).

> [!word] die Aussage
> ipa: /ˈaʊ̯szaːɡə/ · pos: noun · level: B1 · id: de-a2-intonation-w06
> uk: твердження; висловлювання
> forms: die Aussagen
> example: Eine **Aussage** endet mit fallender Stimme. — Твердження закінчується спадним голосом.
> note: aus + Sage. Der Aussagesatz — розповідне речення. Також: показання (у суді, у поліції).

> [!word] die Überraschung
> ipa: /yːbɐˈʁaʃʊŋ/ · pos: noun · level: A2 · id: de-a2-intonation-w07
> uk: сюрприз; здивування
> forms: die Überraschungen
> example: Das ist eine schöne **Überraschung**! — Це приємний сюрприз!
> note: наголос на -rasch-; über- слабке. Дієслово überraschen (невідокремлюване): Du hast mich überrascht.

> [!word] Ach so!
> ipa: /ax ˈzoː/ · pos: phrase · level: A2 · id: de-a2-intonation-w08
> uk: А, ось воно що! Зрозуміло.
> example: **Ach so!** Du wohnst in Bonn. — А, ось воно що! Ти живеш у Бонні.
> note: ach = [ax]. Реакція на нову інформацію: «Тепер зрозуміло.»

## Слухаємо

> [!listen] Питання чи твердження?
> level: A2 · type: answer · speed: slow · id: de-a2-intonation-l01
> audio: Du kommst morgen?
> - [x] питання: голос іде вгору ↗
> - [ ] твердження: голос іде вниз ↘
> - [ ] наказ
>
> **Пояснення:** порядок слів тут як у реченні *Du kommst morgen.*, тож питання показує лише мелодія: підйом ↗ до кінця.

> [!listen] Питання чи твердження? Ті самі слова
> level: A2 · type: answer · speed: slow · id: de-a2-intonation-l02
> audio: Du kommst morgen.
> - [ ] питання: голос іде вгору ↗
> - [x] твердження: голос падає ↘
> - [ ] прохання
>
> **Пояснення:** ті самі слова, що в попередньому завданні, але мелодія падає ↘, тож це констатація: «Ти приходиш завтра.»

> [!listen] Послухай. Як реагує B?
> level: A2 · type: answer · speed: slow · id: de-a2-intonation-l03
> audio: A: Ich habe morgen Geburtstag.
> audio: B: Echt? Das wusste ich nicht!
> - [ ] сердито
> - [x] здивовано
> - [ ] байдуже
>
> **Пояснення:** *Echt?* з підйомом і *Das wusste ich nicht!* показують здивування.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-intonation-l04
> audio: Wie bitte? Können Sie das wiederholen?
> explain: *Wie bitte?* — ввічливе перепитування з підйомом. Далі — прохання з *können Sie*: «Чи можете Ви це повторити?»

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-intonation-l05
> audio: Ich brauche Brot, Milch, Käse und Eier.
> explain: у переліку голос піднімається на кожному пункті й падає на останньому: *Eier ↘*. Перед *und* коми немає.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-intonation-l06
> audio: Haben Sie Kinder?
> explain: питання «так / ні» з ввічливим *Sie*: голос піднімається. Дієслово *haben* стоїть першим.

> [!listen] Послухай. Що вибирає B?
> level: A2 · type: answer · speed: slow · id: de-a2-intonation-l07
> audio: A: Möchtest du Suppe oder Salat?
> audio: B: Suppe, bitte.
> - [x] суп
> - [ ] салат
> - [ ] і те, й те
>
> **Пояснення:** питання з *oder* — це вибір, а не «так / ні». Тому відповідь називає варіант: *Suppe, bitte.*

> [!listen] Послухай. Навіщо B повторює «Der Bahnhof?»
> level: A2 · type: answer · speed: slow · id: de-a2-intonation-l08
> audio: A: Wo ist der Bahnhof?
> audio: B: Der Bahnhof? Der ist dort.
> - [ ] обурюється питанням
> - [x] перепитує, щоб переконатися, що почув правильно
> - [ ] не знає, де вокзал
>
> **Пояснення:** повторене слово з підйомом означає «Ти питаєш про вокзал?» Це нормальна розмовна техніка.

## Вимова

Мінімальні пари нижче тренують звуки з фраз цієї теми; саму мелодію відпрацьовуй у `[!speak]`.

> [!pair] Zeit /tsaɪ̯t/ — seit /zaɪ̯t/
> level: A2 · id: de-a2-intonation-p01
> say: Zeit
> tip: *Zeit* починається на [ts], *seit* на дзвінке [z]. Обидва слова є в фразах з цієї теми: *Hast du Zeit?* і *seit zwei Jahren*.

> [!pair] Tee /teː/ — See /zeː/
> level: A2 · id: de-a2-intonation-p02
> say: Tee
> tip: *Tee* [t] і довге [eː], *See* — [z] і те саме [eː]. Не додавай «й» після голосного.

> [!pair] Brot /bʁoːt/ — Boot /boːt/
> level: A2 · id: de-a2-intonation-p03
> say: Brot
> tip: *Brot* має горловий [ʁ] після [b], *Boot* — ні. Обидва голосні довгі [oː].

> [!pair] toll /tɔl/ — Tal /taːl/
> level: A2 · id: de-a2-intonation-p04
> say: toll
> tip: у *toll* короткий [ɔ] і подвоєне ll, у *Tal* довгий [aː].

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-intonation-s01
> text: Hast du Zeit?
> ipa: /hast duː tsaɪ̯t/
> tip: питання «так / ні»: голос піднімається до кінця ↗. Не опускай голос на Zeit.
> uk: Ти маєш час?

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-intonation-s02
> text: Wie heißt du?
> ipa: /viː haɪ̯st duː/
> tip: W-питання: максимум висоти на heißt, далі голос падає ↘. ß = [s].
> uk: Як тебе звати?

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-intonation-s03
> text: Ich komme aus der Ukraine.
> ipa: /ɪç ˈkɔmə aʊ̯s deːɐ̯ ukʁaˈiːnə/
> tip: твердження: голос падає на Ukraine ↘. Наголос на -ine: [ukʁaˈiːnə]; ai = окремі [a] + [iː].
> uk: Я з України.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-intonation-s04
> text: Ich brauche Brot, Milch, Käse und Eier.
> ipa: /ɪç ˈbʁaʊ̯xə bʁoːt mɪlç ˈkɛːzə ʊnt ˈaɪ̯ɐ/
> tip: перелік: Brot ↗ Milch ↗ Käse ↗ und Eier ↘. Milch — ch після l = [ç]; Eier — [aɪ̯ɐ].
> uk: Мені потрібні хліб, молоко, сир і яйця.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-intonation-s05
> text: Wie bitte?
> ipa: /viː ˈbɪtə/
> tip: ввічливе перепитування: голос піднімається на bitte ↗.
> uk: Перепрошую?

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-intonation-s06
> text: Echt? Das ist ja toll!
> ipa: /ɛçt das ɪst jaː tɔl/
> tip: Echt? — підйом ↗, ch = [ç]. Toll! — падіння ↘ з емоцією; ja тут підсилює: «ж бо».
> uk: Справді? Це ж чудово!

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-intonation-s07
> text: Möchten Sie Kaffee oder Tee?
> ipa: /ˈmœçtn̩ ziː ˈkafe ˈoːdɐ teː/
> tip: питання з вибором: Kaffee ↗, oder Tee ↘. möchten — ö коротке [œ], ch = [ç].
> uk: Ви хочете каву чи чай?

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-intonation-s08
> text: Kannst du mir helfen?
> ipa: /kanst duː miːɐ̯ ˈhɛlfn̩/
> tip: питання «так / ні» з модальним дієсловом: підйом наприкінці ↗. mir — [miːɐ̯], довге [iː].
> uk: Чи можеш ти мені допомогти?

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-intonation-s09
> text: Komm bitte schnell!
> ipa: /kɔm ˈbɪtə ʃnɛl/
> tip: наказ: падіння ↘ на schnell. sch = «ш».
> uk: Іди, будь ласка, швидше!

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-intonation-s10
> text: Ach so! Jetzt verstehe ich.
> ipa: /ax zoː jɛtst fɛɐ̯ˈʃteːə ɪç/
> tip: Ach so! — падіння ↘; ach = [x]. verstehe — наголос на -steh-, ich — [ç].
> uk: А, тепер зрозуміло.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-intonation-s11
> text: Du kommst morgen?
> ipa: /duː kɔmst ˈmɔʁɡn̩/
> tip: порядок слів як у реченні, але підйом ↗ робить його питанням: «Ти ж приходиш завтра?»
> uk: Ти приходиш завтра?

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-intonation-s12
> text: Danke schön!
> ipa: /ˈdaŋkə ʃøːn/
> tip: подяка: падіння ↘ на schön. ö довге [øː], губи «о», язик «е».
> uk: Щиро дякую!

## Типові помилки українців

> [!pitfall] Питання «так / ні» без підйому
> Українець часто опускає голос наприкінці, бо так закінчуємо фразу. У німецькій *Hast du Zeit?* без підйому звучить як вимога або ствердження. Дієслово на першому місці вже показує питання, але мелодія його підтримує: голос іде вгору **до кінця**.

> [!pitfall] Підйом у W-питанні, де його не потрібно
> *Wie heißt du?* зазвичай падає наприкінці. Підйом у такому питанні не помилка, але змінює значення: дружня цікавість або перепитування. Нейтральна мелодія — падіння. Тому не підіймай голос на кожному питанні автоматично.

> [!pitfall] Кожен пункт переліку падає
> *Brot ↘, Milch ↘, Käse ↘ und Eier ↘* — слухач думає, що кожен пункт останній. На всіх пунктах, крім останнього, голос трохи піднімається або тримається; падіння лише в кінці: *… und Eier ↘.*

> [!pitfall] «Echt.» і «Wirklich.» без емоції
> Українці часто виражають емоції словами, а не мелодією. Німецьке *Echt?* із плоскою мелодією звучить байдуже, а з падінням — як констатація. Щоб показати здивування, голос має піднятися: *Echt? ↗ Wirklich? ↗*

## Практика

> [!quiz] Яка мелодія в питанні «Wie heißt du?»
> level: A2 · type: single · id: de-a2-intonation-q02
> - [x] зазвичай падіння наприкінці ↘
> - [ ] обовʼязково підйом ↗
> - [ ] рівний тон на всьому реченні
> - [ ] підйом на *du*, потім пауза
>
> **Пояснення:** у W-питанні є питальне слово, тому голос падає. Підйом можливий для дружнього тону, але це не нейтральна мелодія.

> [!quiz] Яка мелодія в реченні «Ich komme aus der Ukraine»?
> level: A2 · type: single · id: de-a2-intonation-q03
> - [ ] підйом наприкінці ↗
> - [x] падіння наприкінці ↘
> - [ ] рівно →
> - [ ] підйом у середині, падіння на початку
>
> **Пояснення:** твердження закінчується падінням: інформація повна.

> [!quiz] Які з цих фраз зазвичай закінчуються підйомом?
> level: A2 · type: multi · id: de-a2-intonation-q04
> - [x] Kommst du morgen?
> - [ ] Wann kommst du?
> - [x] Wie bitte?
> - [ ] Ich komme morgen.
> - [x] Haben Sie Kinder?
>
> **Пояснення:** підйом мають питання «так / ні» та ввічливе *Wie bitte?*. W-питання (*Wann …*) і твердження закінчуються падінням.

> [!quiz] Де голос падає в реченні «Ich brauche Brot, Milch, Käse und Eier»?
> level: A2 · type: single · id: de-a2-intonation-q05
> - [ ] на кожному пункті переліку
> - [ ] лише на *Brot*
> - [x] на останньому пункті: *Eier*
> - [ ] ніде: голос весь час піднімається
>
> **Пояснення:** у переліку незавершені пункти піднімаються або тримаються рівно, а завершення (*und Eier*) падає.

> [!quiz] Що означає «Echt?» з підйомом?
> level: A2 · type: single · id: de-a2-intonation-q06
> - [ ] «Я згоден.»
> - [x] «Справді? Серйозно?» (здивування)
> - [ ] «Неправда.»
> - [ ] «Повторіть, будь ласка.»
>
> **Пояснення:** *Echt?* з підйомом показує здивування чи цікавість. Для повтору потрібне *Wie bitte?*.

> [!quiz] Де падає голос у питанні «Möchten Sie Kaffee oder Tee?»
> level: A2 · type: single · id: de-a2-intonation-q07
> - [ ] на *Kaffee*
> - [x] на *Tee*: перший варіант піднімається ↗, другий падає ↘
> - [ ] голос піднімається на обох варіантах
> - [ ] голос не змінюється
>
> **Пояснення:** питання з вибором має «два кроки»: перший варіант піднімається, останній закінчується падінням.

> [!quiz] Заповни пропуски
> level: A2 · type: fill · bank: рівно, пошепки · id: de-a2-intonation-q08
>
> ```text fill
> У питанні «так / ні» голос іде [[вгору]], а в W-питанні й твердженні — [[вниз]].
> ```
>
> **Пояснення:** питання «так / ні» ↗, W-питання й твердження ↘. Слова «рівно» і «пошепки» не описують мелодію: вона саме піднімається або падає.

> [!quiz] Заповни пропуск
> level: A2 · type: fill · bank: danke, gern · id: de-a2-intonation-q09
>
> ```text fill
> Wie [[bitte]]? Ich habe das nicht verstanden.
> ```
>
> **Пояснення:** *Wie bitte?* — ввічливе перепитування з підйомом. *Wie danke* не існує, а *Wie gern* тут не підходить.

> [!quiz] Склади питання: «Маєш завтра час?»
> level: A2 · type: order · id: de-a2-intonation-q10
>
> ```text order
> Hast
> du
> morgen
> Zeit?
> bist ✗
> ```
>
> **Пояснення:** у питанні «так / ні» дієслово *hast* стоїть першим. Ми кажемо *Zeit haben*, а не *Zeit sein*.

> [!quiz] Склади питання з вибором: «Ви хочете каву чи чай?»
> level: A2 · type: order · id: de-a2-intonation-q11
>
> ```text order
> Möchten
> Sie
> Kaffee
> oder
> Tee?
> möchtest ✗
> ```
>
> **Пояснення:** до *Sie* дієслово має форму *möchten*; *möchtest* — для *du*. Перший варіант піднімається, другий падає.

> [!quiz] Чим «Wie bitte?» (↗) відрізняється від «Wie bitte?!» (різке ↘)?
> level: A2 · type: single · id: de-a2-intonation-q12
> - [ ] нічим: це однаковий вираз
> - [ ] перше — питання з вибором, друге — перелік
> - [x] перше — ввічливе перепитування, друге може звучати як обурення
> - [ ] друге — ввічливіше
>
> **Пояснення:** слова ті самі, а мелодія змінює ставлення. Різке падіння й гучність можуть образити.

## Фішки

> [!reel] 🎶 Одне «Ja» — пʼять значень
> *Ja? ↗* (по телефону: «Слухаю?» або «Справді?»), *Ja. ↘* («Так»), *Jaaa … →* («Ну, можливо…»), *Ja!* («Звісно!»), *Ja?!* (обурення: «Невже?!»). Німці розрізняють їх мелодією, а не словами. Тому спробуй промовити *Ja* кількома способами й послухай, що чується.

> [!reel] 🗺️ Мелодія залежить від регіону
> У різних німецькомовних регіонах мелодія звучить по-різному: німці легко відрізняють швейцарців, австрійців, саксонців чи мешканців півночі навіть за інтонацією. Правила в цій темі описують нейтральну мелодію стандартної німецької. Окремі регіони можуть мати інший підйом і падіння.

> [!reel] ❓ «Bitte?» — це «що?»
> Слово *bitte* означає «будь ласка», але з підйомом *Bitte? ↗* воно працює як *Wie bitte?*: «Перепрошую?» Все вирішує інтонація і ситуація.

## Джерела та що почитати

- [Wikipedia — Intonation](https://de.wikipedia.org/wiki/Intonation_(Sprachwissenschaft)) — про мелодію мовлення.
- [Wikipedia — Aussprache der deutschen Sprache](https://de.wikipedia.org/wiki/Aussprache_der_deutschen_Sprache) — огляд німецької фонетики, зокрема інтонації.
- [DWDS — Intonation](https://www.dwds.de/wb/Intonation) — значення й вимова слова.
- [DWDS — Melodie](https://www.dwds.de/wb/Melodie) — значення й вимова слова.
- [DWDS — Überraschung](https://www.dwds.de/wb/%C3%9Cberraschung) — значення й вимова слова.
- [DWDS — höflich](https://www.dwds.de/wb/h%C3%B6flich) — значення й вимова слова.

> [!important] Підсумок
> - Твердження, W-питання й наказ закінчуються падінням ↘.
> - Питання «так / ні» і *Wie bitte?* закінчуються підйомом ↗.
> - У переліку голос піднімається на незавершених пунктах і падає на останньому; у питанні з вибором — ↗ на першому варіанті, ↘ на другому.
> - Мелодія передає здивування (*Echt? ↗*), ввічливість (*Wie bitte? ↗*) і обурення (*Wie bitte?! ↘*).
