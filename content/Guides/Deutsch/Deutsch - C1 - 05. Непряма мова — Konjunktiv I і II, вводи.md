---
title: Непряма мова — Konjunktiv I і II, вводи
id: de-c1-indirekte-rede
level: C1
icon: px:star
tags: [deutsch, c1, grammar, konjunktiv1, konjunktiv2, indirekte-rede, redewiedergabe]
prerequisites: ["[[Deutsch - B2 - 06. Konjunktiv I — непряма мова в новинах]]", "[[Deutsch - C1 - 04. Модальні частки II — eben, halt, wohl, schon, ruhig, bloß]]"]
estimatedMinutes: 50
---

# Непряма мова — Konjunktiv I і II, вводи

> [!success] Після цієї теми ти зможеш
> - обирати форму за повним правилом заміни: Konjunktiv I → Konjunktiv II → *würde* + інфінітив;
> - передавати минуле, майбутнє, пасив і модальні дієслова: *sie habe nicht kommen können*, *das Gesetz werde geändert*;
> - переносити час і місце з чужої ситуації у свою: *morgen → am nächsten Tag*, *hier → dort*;
> - вибирати дієслово-ввід із точним відтінком — *entgegnen, einwenden, zurückweisen, abstreiten, vorgeben* — і правильно з ним будувати речення;
> - переказувати джерела в академічному тексті: *Müller (2019) zufolge …*, *Wie Müller zeigt, …*

## Передбач

> [!quiz] Звіт про переговори: «Die Firmen erklärten, sie ___ in diesem Jahr keine Gewinne.» Яка форма однозначно показує, що це чужі слова?
> level: C1 · type: single · id: de-c1-indirekte-rede-q01
> - [ ] machen
> - [ ] machten
> - [x] würden … machen
> - [ ] machen würden
>
> **Пояснення:** Konjunktiv I *sie machen* збігається з Indikativ, Konjunktiv II *sie machten* — з Präteritum. Обидві форми не позначають непрямої мови, тому лишається *würde* + інфінітив: *sie würden in diesem Jahr keine Gewinne machen*. *machen würden* — хибний порядок слів: у непрямій мові без *dass* дієслово *würden* стоїть на другому місці, а не в кінці.

## Система цілком: правило заміни

На B2 ([[Deutsch - B2 - 06. Konjunktiv I — непряма мова в новинах]]) ти навчився утворювати Konjunktiv I і замінювати його на Konjunktiv II, коли форма збігається з Indikativ. На C1 правило має **три кроки**, і кожен крок перевіряємо однаково: чи видно з форми, що це чужі слова?

1. **Konjunktiv I**, якщо він відрізняється від Indikativ: *er komme, sie habe, man könne, es gebe*.
2. Якщо K I = Indikativ → **Konjunktiv II**: *sie haben → sie hätten*, *ich komme → ich käme*.
3. Якщо й K II збігається з Präteritum (усі слабкі дієслова: *sie machten, sie arbeiteten*) або звучить застаріло (*sie hülfen, sie stünden*) → ***würde* + інфінітив**: *sie würden arbeiten*.

> [!diagram] Яку форму взяти: три перевірки
> ```yaml
> layout: flow
> nodes:
>   - { id: start, label: "пряма мова", text: "„Wir arbeiten mehr.“", tone: gray }
>   - { id: k1, label: "крок 1 · Konjunktiv I", text: "sie arbeiten", note: "= Indikativ?", tone: yellow }
>   - { id: k2, label: "крок 2 · Konjunktiv II", text: "sie arbeiteten", note: "= Präteritum?", tone: yellow }
>   - { id: wuerde, label: "крок 3 · würde + інфінітив", text: "?", tone: pink }
>   - { id: result, label: "результат", text: "…", tone: gray }
> steps:
>   - { focus: start, note: "Передаємо слова представників фірми: „Wir arbeiten mehr.“ У непрямій мові wir → sie." }
>   - { focus: k1, note: "Konjunktiv I від arbeiten для sie — arbeiten. Це те саме, що Indikativ: читач не побачить, що це чужі слова." }
>   - { focus: k2, note: "Konjunktiv II — arbeiteten. У слабкого дієслова це звичайний Präteritum: знову нічого не видно." }
>   - { set: { wuerde: "sie würden arbeiten" }, focus: wuerde, note: "Лишається würde + інфінітив — форма, яку не сплутаєш з Indikativ." }
>   - { set: { result: "Sie sagten, sie würden mehr arbeiten." }, focus: result, note: "Готово. Для er/sie (однина) крок 1 спрацював би одразу: Er sagte, er arbeite mehr." }
> ```
> На практиці крок 1 спрацьовує майже завжди в 3-й особі однини, а в множині й у *ich* — рідко.

| Пряма мова | Крок | Непряма мова |
|---|---|---|
| „Ich **bin** krank.“ | 1 — K I відрізняється | Er sagte, er **sei** krank. |
| „Wir **haben** keine Zeit.“ | 2 — K I = Indikativ | Sie sagten, sie **hätten** keine Zeit. |
| „Wir **kommen** später.“ | 2 — K II *kämen* звичний | Sie sagten, sie **kämen** später. |
| „Wir **arbeiten** mehr.“ | 3 — K II = Präteritum | Sie sagten, sie **würden** mehr **arbeiten**. |
| „Wir **helfen** euch.“ | 3 — K II *hülfen* застарілий | Sie sagten, sie **würden** uns **helfen**. |

> [!tip] würde — не для всіх
> *würde* — лише третій крок. Якщо Konjunktiv I відрізняється від Indikativ, *würde* в письмовому тексті зайве: *Er sagte, er **sei** krank*, а не *er würde krank sein*. У розмові *würde*-форми трапляються частіше, але в есе, протоколі й рефераті очікують правильний крок.

### А що, як Konjunktiv II — замість Konjunktiv I?

У розмові й у частині газет можна почути *Er sagte, er **wäre** krank*, хоча *sei* можливе. Часто стверджують, що такий K II показує сумнів мовця. Посібники з граматики від цього застерігають: у сучасній мові K II в непрямій мові — насамперед замінна або розмовна форма, і надійним сигналом недовіри він не є. Якщо хочеш показати дистанцію, роби це **словами**: дієсловом-вводом (*behaupten, vorgeben*), прислівником (*angeblich*) чи модальним *soll* ([[Deutsch - B2 - 07. Субʼєктивні модальні — soll, will, muss, dürfte]]).

### Indikativ у непрямій мові

Indikativ — теж нормальний вибір, коли:

- ввід стоїть у **1-й особі** або в теперішньому часі в розмові: *Ich habe gesagt, dass ich keine Zeit **habe**.*
- дієслово-ввід подає зміст як **факт**: *wissen, zeigen, beweisen, belegen, feststellen*: *Die Studie zeigt, dass Schlafmangel das Lernen **beeinträchtigt**.* Так само з *wie*: *Wie die Studie **zeigt**, …* — автор погоджується з джерелом.

## Час, пасив і модальні дієслова

Час непрямої мови залежить від того, **коли сталося те, про що говорить мовець**.

| Час у прямій мові | Непряма мова | Приклад |
|---|---|---|
| теперішній | K I Präsens | Sie sagte, sie **arbeite** in Linz. |
| будь-який минулий | *habe / sei* + Partizip II | Sie sagte, sie **habe** in Linz **gearbeitet**. |
| майбутній | *werde* + інфінітив | Sie sagte, sie **werde** in Linz **arbeiten**. |
| пасив, теперішній | *werde* + Partizip II | Es hieß, das Gesetz **werde geändert**. |
| пасив, минулий | *sei* + Partizip II + *worden* | Es hieß, das Gesetz **sei geändert worden**. |
| модальне, минулий | *habe* + інфінітив + модальне | Sie sagte, sie **habe** nicht **kommen können**. |
| модальне + пасив | *müsse / könne* + Partizip II + *werden* | Er sagte, das Problem **müsse gelöst werden**. |

Модальне дієслово в минулому дає **подвійний інфінітив**, як у Perfekt: „Ich konnte nicht kommen.“ → *Sie sagte, sie habe nicht kommen können.* Не плутай із *Sie könne nicht gekommen sein* — це вже епістемічне значення: «не може бути, щоб вона прийшла».

## Прохання, накази й питання

| Пряма мова | Непряма мова | Відтінок |
|---|---|---|
| „Kommen Sie sofort!“ | Er sagte, ich **solle** sofort kommen. | наказ, вимога |
| „Rufen Sie mich bitte zurück.“ | Sie bat, man **möge** sie zurückrufen. | ввічливе прохання (книжно) |
| „Sie müssen das Formular unterschreiben.“ | Man sagte mir, ich **müsse** das Formular unterschreiben. | необхідність |
| „Wer hat das entschieden?“ | Sie wollte wissen, wer das **entschieden habe**. | W-питання |
| „Ist das Angebot noch gültig?“ | Er fragte, **ob** das Angebot noch gültig **sei**. | питання «так / ні» |

## Чужа ситуація → твоя ситуація

У непрямій мові ти переказуєш **з іншого місця й часу**. Тому змінюються не лише дієслова, а й займенники, слова часу й місця — так само, як в українській.

| У прямій мові | У непрямій (пізніше, в іншому місці) |
|---|---|
| ich, mein | er / sie, sein / ihr |
| wir, unser | sie, ihr — або *wir, unser*, якщо ти серед них |
| hier | dort |
| heute | an diesem Tag, am selben Tag |
| gestern | am Vortag, am Tag zuvor |
| morgen | am nächsten Tag, am folgenden Tag |
| jetzt | in diesem Moment, damals |
| dieses Jahr | in jenem Jahr, im selben Jahr |

„Ich habe **gestern hier** angerufen“, sagte die Kundin am Montag. → Am Freitag notiert der Mitarbeiter: *Die Kundin gab an, sie habe **am Vortag dort** angerufen.*

> [!diagram] Що міняється, коли переказуєш
> ```yaml
> layout: compare
> columns: { a: "пряма мова (понеділок, у банку)", b: "непряма мова (пʼятниця, звіт)" }
> nodes:
>   - { id: a1, col: a, label: "хто", text: "ich", tone: mint }
>   - { id: a2, col: a, label: "дієслово", text: "habe angerufen", tone: orange }
>   - { id: a3, col: a, label: "коли", text: "gestern", tone: gray }
>   - { id: a4, col: a, label: "де", text: "hier", tone: gray }
>   - { id: b1, col: b, label: "хто", text: "sie", tone: mint }
>   - { id: b2, col: b, label: "дієслово", text: "habe angerufen", tone: orange }
>   - { id: b3, col: b, label: "коли", text: "am Vortag", tone: gray }
>   - { id: b4, col: b, label: "де", text: "dort", tone: gray }
> steps:
>   - { focus: [a1, b1], note: "Займенник — з погляду того, хто переказує: ich → sie." }
>   - { focus: [a2, b2], note: "Дієслово: habe angerufen. Тут K I збігся з Indikativ лише для ich; для sie форма habe вже відрізняється від hat." }
>   - { focus: [a3, b3], note: "gestern було «вчора» для клієнтки в понеділок. У пʼятницю це «напередодні» — am Vortag." }
>   - { focus: [a4, b4], note: "hier — місце мовця. Той, хто пише звіт, — уже не там: dort." }
> ```

## Дієслова-вводи: точний відтінок

Дієслово-ввід — головний інструмент позиції автора. На B2 були *sagen, behaupten, betonen, einräumen, bestreiten*. Тепер — точніші:

| Функція | Дієслова | Будова |
|---|---|---|
| відповідь | **entgegnen**, **erwidern** | jemandem entgegnen, … / auf etw. (Akk) erwidern, … |
| заперечення закиду | **zurückweisen**, **abstreiten**, **leugnen** | den Vorwurf zurückweisen; die Tat abstreiten / leugnen |
| згода | **beipflichten** | jemandem / einer Sache (Dat) beipflichten |
| доповнення | **hinzufügen**, **anmerken** | Er fügte hinzu, … ; Sie merkte an, … |
| уточнення | **klarstellen** | Die Firma stellte klar, … |
| обережне застереження | **zu bedenken geben**, einwenden | Sie gab zu bedenken, … |
| критика | **monieren**, bemängeln | Die Opposition monierte, … |
| констатація | **konstatieren**, feststellen | Der Bericht konstatiert, … |
| дистанція, неправда | **vorgeben**, behaupten | Er gab vor, krank zu sein. |
| опора на джерело | **sich berufen auf** (+ Akk) | Die Zeitung beruft sich auf Insider. |

Без дієслова: *laut* (+ Gen / Dat), *zufolge* (після Dat), *nach Angaben* (+ Gen), *dem Vernehmen nach* («за чутками, неофіційно»), *wie … mitteilte*, а після цитати — *so die Ministerin*.

## Переказ кількох речень

У газеті дієслово-ввід звучить один раз, а далі **Konjunktiv I сам тримає «чужий голос»** — навіть у самостійних реченнях:

> [!example] Bericht über eine Pressekonferenz (адаптований текст)
> Die Ministerin wies die Vorwürfe der Opposition zurück. Die Reform sei solide finanziert, die Kosten habe man unabhängig prüfen lassen. Kritiker sollten sich die Zahlen genauer ansehen. Man werde das Gesetz im Herbst vorlegen. Auf die Frage, ob es Verzögerungen geben könne, entgegnete sie, das hänge vom Parlament ab. Die Opposition monierte dagegen, die Pläne seien zu vage.

Усі речення з *sei, habe, sollten, werde, hänge, seien* — слова міністерки чи опозиції, а не твердження газети. *sollten* — Konjunktiv II від *sollen* для множини, бо K I *sollen* = Indikativ.

> [!quiz] Nach dem Text: Wann soll das Gesetz vorgelegt werden?
> level: C1 · type: single · id: de-c1-indirekte-rede-q02
> - [ ] Das hängt vom Parlament ab.
> - [x] im Herbst
> - [ ] sobald die Opposition zustimmt
> - [ ] nach einer unabhängigen Prüfung
>
> **Пояснення:** *Man werde das Gesetz im Herbst vorlegen* — K I Futur: так сказала міністерка. *Das hänge vom Parlament ab* — відповідь на питання про можливі затримки, не про термін.

## Непряма мова в науковому тексті

У рефераті, курсовій чи на DSH ти постійно переказуєш чужі позиції. Головне — читач має бачити, **де думка джерела, а де твоя**.

| Мета | Формула |
|---|---|
| нейтрально переказати | *Müller (2019) argumentiert, Mehrsprachigkeit **fördere** das Denken.* |
| назвати тезу | *Müller vertritt die These, dass …* / *geht davon aus, dass …* |
| джерело без дієслова | ***Müller zufolge** / **Nach Müller** (2019: 45) **sei** …* — частіше з Indikativ: *Nach Müller ist …* |
| погодитися з джерелом | ***Wie** Müller (2019) **zeigt**, fördert Mehrsprachigkeit das Denken.* — Indikativ |
| дистанціюватися | *Müller **behauptet** zwar, …, doch die Daten belegen das nicht.* |
| своя позиція | *Meines Erachtens …*, *Im Folgenden wird gezeigt, dass …* — Indikativ |

## Приклади

- Der Pressesprecher stellte klar, die Firma **plane** keine Entlassungen. — Прессекретар уточнив, що фірма не планує звільнень.
- Die Angeklagte stritt ab, das Geld genommen zu **haben**. — Обвинувачена заперечила, що взяла гроші.
- Auf die Kritik entgegnete der Bürgermeister, man **habe** alle Anwohner informiert. — На критику бургомістр відповів, що всіх мешканців поінформували.
- Die Experten gaben zu bedenken, die Daten **seien** noch nicht vollständig. — Експерти застерегли, що дані ще не повні.
- Sie sagte, sie **habe** wegen des Streiks nicht **kommen können**. — Вона сказала, що через страйк не змогла приїхати.
- Laut Polizei **sei** der Fahrer zu schnell gefahren. — За даними поліції, водій їхав надто швидко.
- Dem Vernehmen nach **wolle** der Konzern seinen Sitz nach Wien verlegen. — За неофіційними даними, концерн хоче перенести штаб-квартиру до Відня.
- Die Mieter gaben an, sie **hätten** die Kaution längst überwiesen. — Орендарі заявили, що давно переказали заставу.
- Er gab vor, kein Deutsch zu verstehen. — Він удавав, що не розуміє німецької.
- Die Kundin bat, man **möge** ihr die Unterlagen per Post schicken. — Клієнтка попросила надіслати їй документи поштою.
- Wie die Autorin überzeugend **zeigt**, **hängt** der Erfolg vom Kontext ab. — Як переконливо показує авторка, успіх залежить від контексту.
- „Das Ziel ist erreicht“, so die Trainerin nach dem Spiel. — «Мети досягнуто», — сказала тренерка після гри.

## Слова

> [!word] die Redewiedergabe
> ipa: /ˈʁeːdəˌviːdɐɡaːbə/ · pos: noun · level: C1 · id: de-c1-indirekte-rede-w01
> uk: передача чужої мови; переказ
> forms: die Redewiedergaben
> example: In Zeitungsartikeln ist die **Redewiedergabe** im Konjunktiv I üblich. — У газетних статтях переказ чужих слів у Konjunktiv I — звична річ.
> note: direkte / indirekte Rede — пряма / непряма мова. Лінгвістичний термін.

> [!word] der Konjunktiv
> ipa: /ˈkɔnjʊŋktiːf/ · pos: noun · level: B2 · id: de-c1-indirekte-rede-w02
> uk: умовний (субʼюнктивний) спосіб
> forms: die Konjunktive
> example: In der indirekten Rede steht meist der **Konjunktiv** I. — У непрямій мові здебільшого вживають Konjunktiv I.
> note: наголос на першому складі, кінцеве v = [f]. Протилежність — der Indikativ, «дійсний спосіб».

> [!word] wiedergeben
> ipa: /ˈviːdɐɡeːbn̩/ · pos: verb · level: B2 · id: de-c1-indirekte-rede-w03
> uk: передавати (зміст); відтворювати
> forms: wiedergeben → gab wieder → hat wiedergegeben (er gibt wieder)
> example: Bitte **geben** Sie die Position des Autors mit eigenen Worten **wieder**. — Будь ласка, передайте позицію автора своїми словами.
> note: відокремлюване: wieder- наголошене. Ще «повертати» (zurückgeben) у книжній мові.

> [!word] wörtlich
> ipa: /ˈvœʁtlɪç/ · pos: adj · level: B2 · id: de-c1-indirekte-rede-w04
> uk: дослівний; дослівно
> example: Das ist kein **wörtliches** Zitat, sondern eine Zusammenfassung. — Це не дослівна цитата, а стислий переказ.
> note: протилежне — sinngemäß «за змістом». ö — коротке [œ].

> [!word] zurückweisen
> ipa: /tsuˈʁʏkvaɪ̯zn̩/ · pos: verb · level: C1 · id: de-c1-indirekte-rede-w05
> uk: відхиляти; відкидати (закид, вимогу)
> forms: zurückweisen → wies zurück → hat zurückgewiesen
> example: Das Ministerium **wies** die Vorwürfe entschieden **zurück**. — Міністерство рішуче відкинуло звинувачення.
> note: + Akk без прийменника: den Vorwurf zurückweisen (не ~~auf den Vorwurf~~).

> [!word] abstreiten
> ipa: /ˈapʃtʁaɪ̯tn̩/ · pos: verb · level: C1 · id: de-c1-indirekte-rede-w06
> uk: заперечувати (свою причетність)
> forms: abstreiten → stritt ab → hat abgestritten
> example: Der Verdächtige **stritt** jede Beteiligung **ab**. — Підозрюваний заперечив будь-яку причетність.
> note: близьке до bestreiten; abstreiten — частіше про власну вину.

> [!word] leugnen
> ipa: /ˈlɔʏ̯ɡnən/ · pos: verb · level: C1 · id: de-c1-indirekte-rede-w07
> uk: заперечувати (очевидне); не визнавати
> forms: leugnen → leugnete → hat geleugnet
> example: Man kann den Klimawandel nicht **leugnen**. — Зміну клімату не можна заперечувати.
> note: часто про заперечення доведеного факту; ein Leugner — заперечувач. eu = [ɔʏ̯].

> [!word] entgegnen (+ Dat)
> ipa: /ɛntˈɡeːɡnən/ · pos: verb · level: C1 · id: de-c1-indirekte-rede-w08
> uk: заперечити (у відповідь); відповісти
> forms: entgegnen → entgegnete → hat entgegnet
> example: Auf die Frage **entgegnete** sie, das sei nicht ihre Aufgabe. — На питання вона відповіла, що це не її завдання.
> note: jemandem etwas entgegnen; часто з відтінком незгоди. Письмове.

> [!word] erwidern
> ipa: /ɛɐ̯ˈviːdɐn/ · pos: verb · level: C1 · id: de-c1-indirekte-rede-w09
> uk: відповідати; відповідати взаємністю
> forms: erwidern → erwiderte → hat erwidert
> example: Er **erwiderte**, er habe davon nichts gewusst. — Він відповів, що нічого про це не знав.
> note: auf etw. (Akk) erwidern. Ще: einen Gruß / Gefühle erwidern — відповісти на вітання, на почуття.

> [!word] anmerken
> ipa: /ˈanmɛʁkn̩/ · pos: verb · level: C1 · id: de-c1-indirekte-rede-w10
> uk: зауважувати; помічати (по комусь)
> forms: anmerken → merkte an → hat angemerkt
> example: Die Gutachterin **merkte an**, die Stichprobe sei klein. — Рецензентка зауважила, що вибірка невелика.
> note: jemandem etwas anmerken — помітити по комусь: Man merkt ihm die Müdigkeit an. die Anmerkung — примітка.

> [!word] klarstellen
> ipa: /ˈklaːɐ̯ʃtɛlən/ · pos: verb · level: B2 · id: de-c1-indirekte-rede-w11
> uk: уточнювати; чітко пояснювати (щоб не було хибних думок)
> forms: klarstellen → stellte klar → hat klargestellt
> example: Der Verein **stellte klar**, der Trainer bleibe. — Клуб чітко заявив, що тренер залишається.
> note: die Klarstellung — уточнення, спростування непорозуміння.

> [!word] hinzufügen
> ipa: /hɪnˈtsuːfyːɡn̩/ · pos: verb · level: B2 · id: de-c1-indirekte-rede-w12
> uk: додавати
> forms: hinzufügen → fügte hinzu → hat hinzugefügt
> example: Sie **fügte hinzu**, man werde die Ergebnisse veröffentlichen. — Вона додала, що результати оприлюднять.
> note: наголос на -zu-. І в прямому значенні: Salz hinzufügen.

> [!word] vorgeben
> ipa: /ˈfoːɐ̯ɡeːbn̩/ · pos: verb · level: C1 · id: de-c1-indirekte-rede-w13
> uk: удавати; видавати себе за; (норму) задавати
> forms: vorgeben → gab vor → hat vorgegeben (er gibt vor)
> example: Er **gab vor**, Arzt zu sein. — Він видавав себе за лікаря.
> note: як ввід показує, що автор вважає сказане неправдою. Інше значення: eine Frist vorgeben — встановити строк.

> [!word] angeben
> ipa: /ˈanɡeːbn̩/ · pos: verb · level: B1 · id: de-c1-indirekte-rede-w14
> uk: зазначати; повідомляти (дані); розм. хвалитися
> forms: angeben → gab an → hat angegeben (er gibt an)
> example: Der Zeuge **gab an**, er habe nichts gesehen. — Свідок заявив, що нічого не бачив.
> note: у формулярі: Bitte geben Sie Ihre Adresse an. Розм. «хизуватися»: Er gibt mit seinem Auto an.

> [!word] verlauten
> ipa: /fɛɐ̯ˈlaʊ̯tn̩/ · pos: verb · level: C1 · id: de-c1-indirekte-rede-w15
> uk: ставати відомим (з неофіційного джерела)
> forms: verlauten → verlautete → hat / ist verlautet
> example: Wie aus Regierungskreisen **verlautete**, ist eine Einigung nah. — Як стало відомо з урядових кіл, домовленість близька.
> note: etwas verlauten lassen — повідомити (обережно): Die Firma hat nichts verlauten lassen.

> [!word] konstatieren
> ipa: /kɔnstaˈtiːʁən/ · pos: verb · level: C1 · id: de-c1-indirekte-rede-w16
> uk: констатувати
> forms: konstatieren → konstatierte → hat konstatiert
> example: Der Bericht **konstatiert** einen deutlichen Rückgang der Arbeitslosigkeit. — Звіт констатує помітне скорочення безробіття.
> note: книжне; простіше — feststellen. Наголос на -tie-.

> [!word] monieren
> ipa: /moˈniːʁən/ · pos: verb · level: C1 · id: de-c1-indirekte-rede-w17
> uk: критикувати; висловлювати претензію
> forms: monieren → monierte → hat moniert
> example: Der Rechnungshof **monierte**, die Kosten seien nicht nachvollziehbar. — Рахункова палата зауважила, що витрати не можна простежити.
> note: книжне, офіційне; синоніми — bemängeln, beanstanden.

> [!word] beipflichten (+ Dat)
> ipa: /ˈbaɪ̯pflɪçtn̩/ · pos: verb · level: C1 · id: de-c1-indirekte-rede-w18
> uk: погоджуватися (з кимось, з чимось)
> forms: beipflichten → pflichtete bei → hat beigepflichtet
> example: Die Kollegin **pflichtete** ihm **bei**: Die Frist sei zu knapp. — Колега погодилася з ним: строк надто стислий.
> note: + Dativ: jemandem / einer Meinung beipflichten. Нейтральніше — zustimmen.

> [!word] zu bedenken geben
> ipa: /tsuː bəˈdɛŋkn̩ ˈɡeːbn̩/ · pos: phrase · level: C1 · id: de-c1-indirekte-rede-w19
> uk: застерігати; звертати увагу (на ризик)
> forms: zu bedenken geben → gab zu bedenken → hat zu bedenken gegeben
> example: Die Ärztin **gab zu bedenken**, dass die Studie sehr klein sei. — Лікарка звернула увагу на те, що дослідження дуже невелике.
> note: ввічливий спосіб заперечити; часто в дискусіях і протоколах.

> [!word] sich berufen auf (+ Akk)
> ipa: /zɪç bəˈʁuːfn̩ aʊ̯f/ · pos: verb · level: C1 · id: de-c1-indirekte-rede-w20
> uk: посилатися на
> forms: sich berufen → berief sich → hat sich berufen
> example: Die Zeitung **beruft sich auf** interne Dokumente. — Газета посилається на внутрішні документи.
> note: + Akk: sich auf eine Quelle / auf das Gesetz berufen. Ще: berufen — призначати на посаду (einen Professor berufen).

> [!word] die Pressemitteilung
> ipa: /ˈpʁɛsəˌmɪtaɪ̯lʊŋ/ · pos: noun · level: B2 · id: de-c1-indirekte-rede-w21
> uk: прес-реліз
> forms: die Pressemitteilungen
> example: In einer **Pressemitteilung** erklärte das Unternehmen, man prüfe den Vorfall. — У прес-релізі компанія заявила, що перевіряє інцидент.
> note: синонім — die Presseerklärung. Скорочено в редакціях: PM.

> [!word] der Augenzeuge
> ipa: /ˈaʊ̯ɡn̩ˌtsɔʏ̯ɡə/ · pos: noun · level: B2 · id: de-c1-indirekte-rede-w22
> uk: очевидець
> forms: die Augenzeugen
> example: **Augenzeugen** berichteten, das Auto sei bei Rot gefahren. — Очевидці розповіли, що авто їхало на червоне світло.
> note: n-відміна: des Augenzeugen, dem Augenzeugen. Жінка — die Augenzeugin.

> [!word] dem Vernehmen nach
> ipa: /deːm fɛɐ̯ˈneːmən naːx/ · pos: phrase · level: C1 · id: de-c1-indirekte-rede-w23
> uk: як стало відомо; за неофіційними даними
> example: **Dem Vernehmen nach** soll der Vertrag nächste Woche unterschrieben werden. — За неофіційними даними, договір мають підписати наступного тижня.
> note: газетне; джерело не називають. Часто з sollen або Konjunktiv I.

> [!word] die Einschätzung
> ipa: /ˈaɪ̯nʃɛtsʊŋ/ · pos: noun · level: B2 · id: de-c1-indirekte-rede-w24
> uk: оцінка; судження
> forms: die Einschätzungen
> example: Nach **Einschätzung** der Experten sei das Risiko gering. — За оцінкою експертів, ризик невеликий.
> note: einschätzen — оцінювати. Nach Einschätzung + Gen — типовий газетний ввід.

> [!word] die Darstellung
> ipa: /ˈdaːɐ̯ʃtɛlʊŋ/ · pos: noun · level: B2 · id: de-c1-indirekte-rede-w25
> uk: виклад; версія (подій); зображення
> forms: die Darstellungen
> example: Nach **Darstellung** der Polizei sei der Mann geflohen. — За версією поліції, чоловік утік.
> note: Nach eigener Darstellung … — за власними словами. Також «графічне зображення»: eine grafische Darstellung.

## Слухаємо

> [!listen] Що ти почув?
> level: C1 · type: choice · id: de-c1-indirekte-rede-l01
> audio: Die Sprecherin sagte, man habe nicht früher reagieren können.
> - [x] Die Sprecherin sagte, man habe nicht früher reagieren können.
> - [ ] Die Sprecherin sagte, man hätte nicht früher reagieren können.
> - [ ] Die Sprecherin sagte, man habe nicht früher reagiert.

> [!listen] Напиши або скажи, що почув
> level: C1 · type: dictation · id: de-c1-indirekte-rede-l02
> audio: Das Ministerium wies die Vorwürfe entschieden zurück.
> explain: zurückweisen — відокремлюване: wies … zurück. Vorwürfe — множина від der Vorwurf.

> [!listen] Напиши або скажи, що почув
> level: C1 · type: dictation · id: de-c1-indirekte-rede-l03
> audio: Augenzeugen gaben an, der Fahrer sei bei Rot gefahren.
> explain: gaben an — від angeben. sei gefahren — K I Perfekt із sein (рух).

> [!listen] Послухай новину. Що каже концерн?
> level: C1 · type: answer · id: de-c1-indirekte-rede-l04
> audio: Dem Vernehmen nach will der Konzern sein Werk in Linz schließen. Das Unternehmen stellte jedoch klar, es gebe keine solchen Pläne. Man prüfe lediglich, wie man die Kosten senken könne.
> - [ ] підтверджує закриття заводу
> - [x] заперечує плани закриття і каже, що лише шукає способи знизити витрати
> - [ ] відмовляється коментувати
>
> **Пояснення:** *Dem Vernehmen nach* — неофіційна інформація. Концерн *stellte klar, es gebe keine solchen Pläne* — чітко заперечив; *man prüfe lediglich* — «лише перевіряє», як знизити витрати.

> [!listen] Послухай фрагмент лекції. Як лекторка ставиться до тези Müller?
> level: C1 · type: answer · id: de-c1-indirekte-rede-l05
> audio: Müller behauptet zwar, Mehrsprachigkeit verbessere das Gedächtnis. Die neueren Daten belegen das aber nicht. Wie Becker zeigt, hängt der Effekt stark vom Alter ab.
> - [ ] повністю погоджується з Müller
> - [x] дистанціюється від Müller і погоджується з Becker
> - [ ] не згадує жодного іншого дослідження
>
> **Пояснення:** *behauptet zwar … aber* — дистанція. *Wie Becker zeigt, hängt* — Indikativ після *wie … zeigt*: лекторка приймає висновок Becker.

## Вимова

У непрямій мові головне — **чітке закінчення**: *er habe* [ˈhaːbə], *sie sei* [zaɪ̯], *man könne* [ˈkœnə]. Кінцеве *-e* слабке, але чутне: якщо його «зʼїсти», вийде *hab*, і слухач почує розмовний Indikativ. У *seien* — два склади [ˈzaɪ̯ən]. Дієслова-вводи з префіксами мають наголос на корені: *ent**geg**nen*, *er**wi**dern*, а відокремлювані — на префіксі: ***ab**streiten, **an**merken, **klar**stellen*.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-indirekte-rede-s01
> text: Sie sagte, sie habe nicht kommen können.
> ipa: /ziː ˈzaːktə ziː ˈhaːbə nɪçt ˈkɔmən ˈkœnən/
> tip: habe — довге [aː], кінцеве -e чути. kommen — коротке [ɔ], können — коротке [œ]: не плутай.
> uk: Вона сказала, що не змогла прийти.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-indirekte-rede-s02
> text: Er entgegnete, das sei nicht seine Aufgabe.
> ipa: /eːɐ̯ ɛntˈɡeːɡnətə das zaɪ̯ nɪçt ˈzaɪ̯nə ˈaʊ̯fɡaːbə/
> tip: entgegnete — наголос на -geg- з довгим [eː]; gn вимовляємо обидва звуки.
> uk: Він заперечив, що це не його завдання.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-indirekte-rede-s03
> text: Die Kundin bat, man möge sie zurückrufen.
> ipa: /diː ˈkʊndɪn baːt man ˈmøːɡə ziː tsuˈʁʏkʁuːfn̩/
> tip: möge — довге [øː]: губи округлені, язик як для [e]. zurück — наголос на -rück.
> uk: Клієнтка попросила їй передзвонити.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-indirekte-rede-s04
> text: Die Zeitung beruft sich auf interne Dokumente.
> ipa: /diː ˈtsaɪ̯tʊŋ bəˈʁuːft zɪç aʊ̯f ɪnˈtɛʁnə dokuˈmɛntə/
> tip: beruft — наголос на -ruft, довге [uː]. intern — наголос на -tern.
> uk: Газета посилається на внутрішні документи.

## Типові помилки українців

> [!pitfall] würde скрізь
> *Er sagte, er würde krank sein* звучить як майбутнє («що захворіє»); *Sie meinte, sie würde keine Zeit haben* — теж майбутнє («що не матиме часу»). Для теперішнього в письмовій нормі: якщо Konjunktiv I відрізняється від Indikativ, бери його: *er **sei** krank, sie **habe** keine Zeit*. *würde* — лише третій крок, коли і K I, і K II не відрізняються від Indikativ (*sie würden arbeiten*).

> [!pitfall] «Завтра» лишилося «завтра»
> В українській, переказуючи через тиждень, ми кажемо «сказав, що прийде наступного дня», а не «завтра». У німецькій — так само: ~~Er sagte am Montag, er komme morgen~~ (у пʼятничному звіті) → *er komme **am nächsten Tag***. *hier → dort*, *mein → sein / ihr*, *gestern → am Vortag*.

> [!pitfall] «Нібито» = Konjunktiv II?
> Українське «нібито» не перекладається автоматично формою *wäre / hätte*. K II у непрямій мові часто просто замінна або розмовна форма. Сумнів передавай словами: *Er **soll** krank sein*, *Er ist **angeblich** krank*, *Er **behauptet**, krank zu sein*.

> [!pitfall] Керування дієслів-вводів
> «Відкинув звинувачення» — *den Vorwurf **zurückweisen*** (Akk), не ~~auf den Vorwurf zurückweisen~~. «Погодився з нею» — *ihr **beipflichten*** (Dat), не ~~mit ihr beipflichten~~. «Відповів йому» — *ihm **entgegnen***. «Посилається на» — *sich **auf** etwas (Akk) **berufen***.

## Ситуація: протокол наради

> [!listen] Послухай фрагмент наради (A — Herr Lenz, B — Frau Kraus). Що пропонує Frau Kraus?
> level: C1 · type: answer · id: de-c1-indirekte-rede-l06
> audio: A: Ich halte den Termin im März für unrealistisch. Wir brauchen mindestens zwei Monate mehr.
> audio: B: Das sehe ich auch so. Aber wir sollten zuerst mit dem Kunden sprechen, bevor wir etwas versprechen.
> - [ ] скасувати проєкт
> - [x] спершу поговорити з клієнтом, а вже потім щось обіцяти
> - [ ] залишити термін у березні
>
> **Пояснення:** Frau Kraus (B) погоджується, що березень нереальний (*Das sehe ich auch so*), і радить спершу поговорити з клієнтом. У протоколі: *Frau Kraus pflichtete Herrn Lenz bei, gab aber zu bedenken, man solle zuerst mit dem Kunden sprechen.*

Перекажи позицію пана Ленца для протоколу.

> [!speak] «Пан Ленц сказав, що вважає березневий термін нереальним.»
> level: C1 · id: de-c1-indirekte-rede-s05
> text: Herr Lenz erklärte, er halte den Termin im März für unrealistisch.
> ipa: /hɛʁ lɛnts ɛɐ̯ˈklɛːɐ̯tə eːɐ̯ ˈhaltə deːn tɛʁˈmiːn ɪm mɛʁts fyːɐ̯ ˈʊnʁealɪstɪʃ/
> tip: halte — K I від halten, кінцеве -e чути. Termin — наголос на -min. März — ä коротке, z = [ts].
> uk: Пан Ленц заявив, що вважає березневий термін нереальним.

## Практика

> [!quiz] „Ich konnte wegen des Streiks nicht kommen.“ → Sie sagte, sie ___
> level: C1 · type: single · id: de-c1-indirekte-rede-q03
> - [x] habe wegen des Streiks nicht kommen können.
> - [ ] sei wegen des Streiks nicht gekommen können.
> - [ ] habe wegen des Streiks nicht kommen gekonnt.
> - [ ] könne wegen des Streiks nicht gekommen sein.
>
> **Пояснення:** минуле модального дієслова в K I — *habe* + подвійний інфінітив: *habe … kommen können*. *könne … gekommen sein* має епістемічне значення («не може бути, щоб вона прийшла»), а дві інші форми граматично неможливі.

> [!quiz] У понеділок колега сказав тобі: „Ich komme morgen zu euch.“ У пʼятницю ти пишеш звіт. Як правильно?
> level: C1 · type: single · id: de-c1-indirekte-rede-q04
> - [x] Er sagte, er komme am nächsten Tag zu uns.
> - [ ] Er sagte, er komme morgen zu euch.
> - [ ] Er sagte, er komme am Vortag zu uns.
> - [ ] Er sagte, er kommt morgen zu euch.
>
> **Пояснення:** з пʼятниці «завтра» понеділка — *am nächsten Tag*; *euch* з погляду автора звіту — *uns*. *am Vortag* — «напередодні», протилежний напрямок у часі. *kommt* — Indikativ, а *morgen* і *euch* не перенесено.

> [!quiz] „Rufen Sie mich bitte zurück.“ У письмовому звіті: Die Kundin bat, man ___ sie zurückrufen.
> level: C1 · type: single · id: de-c1-indirekte-rede-q05
> - [x] möge
> - [ ] mag
> - [ ] soll
> - [ ] müsse
>
> **Пояснення:** ввічливе прохання в непрямій мові — *möge* (K I від *mögen*). *mag* і *soll* — Indikativ, а *müsse* перетворює прохання на необхідність.

> [!quiz] Які дієслова-вводи показують, що автор вважає сказане сумнівним або неправдивим?
> level: C1 · type: multi · id: de-c1-indirekte-rede-q06
> - [x] vorgeben
> - [x] behaupten
> - [ ] mitteilen
> - [ ] konstatieren
> - [ ] angeben
>
> **Пояснення:** *vorgeben* — «удавати», *behaupten* — «стверджувати без доказів». *mitteilen* і *angeben* нейтральні, *konstatieren* — фіксує факт.

> [!quiz] «Auf die Kritik ___ die Ministerin, man habe alle Regeln eingehalten.» (відповіла, заперечуючи)
> level: C1 · type: single · id: de-c1-indirekte-rede-q07
> - [x] entgegnete
> - [ ] merkte an
> - [ ] pflichtete bei
> - [ ] gab vor
>
> **Пояснення:** відповідь на критику з незгодою — *entgegnen*. *anmerken* — доповнити побіжним зауваженням, не відповідь на закид. *beipflichten* — погодитися (і потребує Dativ). *vorgeben* — удавати.

> [!quiz] «Der Minister sagte, er hätte nichts gewusst.» Що можна сказати про цю форму?
> level: C1 · type: single · id: de-c1-indirekte-rede-q08
> - [ ] Автор точно не вірить міністрові.
> - [x] K II тут може бути просто розмовною чи замінною формою — про сумнів автора він надійно не говорить.
> - [ ] Це нереальна умова: міністр знав.
> - [ ] Це помилка: K II у непрямій мові неможливий.
>
> **Пояснення:** K II в непрямій мові можливий і поширений, особливо в розмові. Але вважати його маркером недовіри ненадійно. Сумнів автор показує дієсловом-вводом чи словом *angeblich*.

> [!quiz] Обери форму: «Wie die Studie zeigt, ___ Schlafmangel das Lernen.»
> level: C1 · type: single · id: de-c1-indirekte-rede-q09
> - [x] beeinträchtigt
> - [ ] beeinträchtige
> - [ ] beeinträchtigte
> - [ ] würde beeinträchtigen
>
> **Пояснення:** *Wie … zeigt* — автор приймає результат як доведений, тому Indikativ: *beeinträchtigt*. K I *beeinträchtige* доречний після нейтрального вводу: *Die Studie behauptet, Schlafmangel beeinträchtige …*

> [!quiz] Які речення відповідають письмовій нормі непрямої мови?
> level: C1 · type: multi · id: de-c1-indirekte-rede-q10
> - [x] Die Forscher erklärten, sie würden die Daten veröffentlichen.
> - [x] Der Sprecher sagte, das Gesetz trete im Mai in Kraft.
> - [ ] Die Zeugen gaben an, sie haben nichts gesehen.
> - [x] Die Autorin betont, Sprache sei ein soziales Phänomen.
> - [ ] Er sagte, er wäre gestern in Wien.
>
> **Пояснення:** *veröffentlichen* — K I і K II збігаються з Indikativ і Präteritum → *würden*. *trete*, *sei* — K I. *sie haben* = Indikativ → *hätten*. Минуле — K I Perfekt: *er sei gestern in Wien gewesen*.

> [!quiz] «Müller (2019) ___ die These, Mehrsprachigkeit fördere das Denken.»
> level: C1 · type: single · id: de-c1-indirekte-rede-q11
> - [x] vertritt
> - [ ] entgegnet
> - [ ] widerspricht
> - [ ] pflichtet bei
>
> **Пояснення:** *eine These vertreten* — обстоювати тезу (+ Akk). *entgegnen* (відповісти щось у відповідь), *widersprechen* і *beipflichten* (+ Dat) не передають «обстоювати тезу»; *eine These vertreten* — стала сполука.

> [!quiz] Заповни пропуски за правилом заміни (письмова норма; у дужках — пряма мова)
> level: C1 · type: fill · id: de-c1-indirekte-rede-q12
>
> ```text fill
> Die Firmen erklärten, sie [[würden]] neue Stellen schaffen. („Wir schaffen neue Stellen.“)
> Die Zeugin sagte, sie [[habe]] den Täter gesehen. („Ich habe den Täter gesehen.“)
> Die Zeugen sagten, sie [[hätten]] den Täter gesehen. („Wir haben den Täter gesehen.“)
> Die Ministerin sagte, sie [[sei]] zufrieden. („Ich bin zufrieden.“)
> ```
>
> **Пояснення:** *schaffen*: K I = Indikativ, K II *schüfen* застарів → *würden*. *sie habe* (однина) відрізняється від *hat*. Множина *haben* = Indikativ → *hätten*. *sei* — завжди K I.

> [!quiz] Заповни дієслова-вводи
> level: C1 · type: fill · bank: gab, Nach · id: de-c1-indirekte-rede-q13
>
> ```text fill
> Die Firma [[wies]] die Vorwürfe entschieden [[zurück]].
> Der Angeklagte [[stritt]] jede Schuld [[ab]].
> [[Dem]] Vernehmen nach plant die Regierung Neuwahlen.
> Die Opposition [[monierte]], der Plan sei zu teuer.
> ```
>
> **Пояснення:** *zurückweisen → wies … zurück*, *abstreiten → stritt … ab*, сталий вираз *dem Vernehmen nach* (не ~~nach Vernehmen~~), *monieren* — критикувати.

> [!quiz] Перенеси час і місце: «я»-ситуація → звіт через тиждень
> level: C1 · type: fill · id: de-c1-indirekte-rede-q14
>
> ```text fill
> „Ich war gestern hier.“ → Er sagte, er sei [[am Vortag|am Tag zuvor|tags zuvor]] [[dort]] gewesen.
> „Wir kommen morgen.“ → Sie sagten, sie kämen [[am nächsten Tag|am folgenden Tag|tags darauf]].
> „Das ist mein Büro.“ → Sie sagte, das sei [[ihr]] Büro.
> ```
>
> **Пояснення:** *gestern → am Vortag*, *hier → dort*, *morgen → am nächsten Tag*, *mein* у словах жінки → *ihr*.

> [!quiz] Склади речення: «Міністерка визнала, що припустилися помилок»
> level: C1 · type: order · id: de-c1-indirekte-rede-q15
>
> ```text order
> Die Ministerin räumte ein,
> dass
> man
> Fehler
> gemacht
> habe.
> sei ✗
> ```
>
> **Пояснення:** підрядне з *dass* — дієслово в кінці: *gemacht habe*. *machen* утворює Perfekt із *haben*, тому *sei* — помилка допоміжного.

> [!quiz] Склади газетне речення: «Ситуація стабільна, — сказала речниця»
> level: C1 · type: order · id: de-c1-indirekte-rede-q16
>
> ```text order
> Die Lage
> sei
> stabil,
> so
> die Sprecherin.
> seien ✗
> ```
>
> **Пояснення:** *so* + особа після переказу — короткий газетний ввід. *die Lage* — однина, тому *sei*, а не *seien*.

> [!quiz] Письмова норма: «Er versprach, er ___ das Geld bis Freitag zurückzahlen.»
> level: C1 · type: single · id: de-c1-indirekte-rede-q17
> - [x] werde
> - [ ] wurde
> - [ ] sei
> - [ ] habe
>
> **Пояснення:** майбутнє в непрямій мові — *werde* + інфінітив (K I відрізняється від *wird*). *wurde* — Präteritum, *sei / habe* утворюють минуле й не поєднуються з інфінітивом *zurückzahlen*.

## Фішки

> [!reel] 🧮 «Es sei x eine Zahl»
> Математики досі пишуть Konjunktiv I: *Es sei x eine reelle Zahl* — «нехай x — дійсне число». Це той самий Konjunktiv I, що й у *Man nehme 200 g Mehl*: не чужі слова, а припущення чи інструкція.

> [!reel] 📜 laut — від «звуку» до «згідно з»
> Прийменник *laut* (*laut Polizei*) — родич слова *der Laut*. За етимологічним словником Pfeifer, у XV ст. він скоротився з середньоверхньонімецького *nāch lūte (der briefe)* — «за звучанням (листів)», тобто дослівно.

> [!reel] 🗞️ «so die Ministerin»
> У німецьких новинах ввід часто стискають до одного слова: „Wir sind zufrieden“, **so** die Ministerin. Українською — «— сказала міністерка». Таке *so* стоїть після цитати й не потребує дієслова.

## Джерела та що почитати

- [DWDS — laut](https://www.dwds.de/wb/laut) — прийменник *laut* і його етимологія (Pfeifer).
- [DWDS — zurückweisen](https://www.dwds.de/wb/zur%C3%BCckweisen) — значення й типові сполуки.
- [DWDS — entgegnen](https://www.dwds.de/wb/entgegnen) — керування й приклади.
- [DWDS — verlauten](https://www.dwds.de/wb/verlauten) — *verlauten* і *verlauten lassen*.
- [Duden Sprachratgeber — Die drei Modi der deutschen Sprache](https://www.duden.de/sprachwissen/sprachratgeber/Die-drei-Modi-der-deutschen-Sprache) — Indikativ, Konjunktiv I і II, приклади непрямої мови.
- Duden — *Die Grammatik* (Band 4) — розділ про Konjunktiv у непрямій мові й правило заміни.
- H. Dreyer, R. Schmitt — *Lehr- und Übungsbuch der deutschen Grammatik* (Hueber) — розділ «Indirekte Rede».

> [!important] Підсумок
> - Правило заміни: **K I** → якщо = Indikativ, **K II** → якщо = Präteritum або застаріле, ***würde* + інфінітив**.
> - Минуле — *habe / sei* + Partizip II; майбутнє — *werde*; модальне в минулому — *habe … kommen können*; прохання — *solle / möge*.
> - Переносимо займенники, час і місце: *morgen → am nächsten Tag*, *hier → dort*.
> - Дистанцію показують слова (*behaupten, vorgeben, angeblich, soll*), а не K II сам собою.
> - Після *wie … zeigt*, *wissen*, *beweisen* — Indikativ: автор приймає зміст як факт.
> - Ввід — це позиція: *entgegnen* (+ Dat), *zurückweisen* (+ Akk), *beipflichten* (+ Dat), *sich berufen auf* (+ Akk).
