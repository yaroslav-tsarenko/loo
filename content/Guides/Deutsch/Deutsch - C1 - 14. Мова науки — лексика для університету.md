---
title: Мова науки — лексика для університету
id: de-c1-wissenschaftssprache
level: C1
icon: px:books
tags: [deutsch, c1, vocabulary, wissenschaftssprache, studium, dsh, testdaf]
prerequisites: ["[[Deutsch - B2 - 16. Наука, технології й майбутнє]]", "[[Deutsch - B2 - 13. Аудіювання — лекції й конспект]]"]
estimatedMinutes: 55
---

# Мова науки — лексика для університету

> [!success] Після цієї теми ти зможеш
> - розуміти й уживати ключову лексику наукового тексту: *der Befund, der Ansatz, der Forschungsstand, die Stichprobe, die Erhebung*;
> - точно розрізняти близькі терміни: *Hypothese — These — Theorie — Annahme*, *beweisen — belegen — feststellen — aufzeigen*;
> - описувати метод і результат дослідження: *Daten erheben, Ergebnisse einordnen, Befunde gegenüberstellen, etwas ist signifikant / repräsentativ*;
> - упізнавати типові формули для DSH і TestDaF: *Der Text beruht auf …, Daraus ergibt sich …, Der Autor setzt sich mit … auseinander*;
> - знати правила академічної чесності в німецьких університетах: цитування, *Literaturverzeichnis*, *Plagiat*.

## Передбач

> [!quiz] У статті написано: «Die Befunde deuten darauf hin, dass …» Що таке тут *Befunde*?
> level: C1 · type: single · id: de-c1-wissenschaftssprache-q01
> - [ ] знахідки археологів
> - [x] отримані результати, виявлені дані дослідження
> - [ ] висновки рецензентів
> - [ ] гіпотези, які ще треба перевірити
>
> **Пояснення:** *der Befund* — те, що дослідження **виявило** (від *befinden* — «визнати, встановити»). У медицині *der Befund* — результат обстеження (*ein unauffälliger Befund* — «без патології»). Це ще не висновок і не гіпотеза, а саме дані: *Die Befunde deuten darauf hin, dass …* — «отримані дані вказують на те, що …». Значення «знахідка» є в археології, але в науковій статті значно частіше саме «результат».

## Пояснення

### Що вже є з B2 і що додаємо

У темі [[Deutsch - B2 - 16. Наука, технології й майбутнє]] ти вже вивчив *die Forschung, die Studie, die Hypothese, die Erkenntnis*, дієслова *belegen, widerlegen, auswerten, analysieren* і прикметник *empirisch*. Тут додаємо лексику, без якої не обійтися в **Hausarbeit**, на семінарі й на іспитах **DSH** і **TestDaF**: як назвати частини дослідження, як описати метод, як обережно сформулювати результат і як посилатися на інших.

### Будова дослідження: від питання до висновку

> [!diagram] Науковий текст: що за чим іде
> ```yaml
> layout: flow
> nodes:
>   - { id: s1, label: "1 · стан науки", text: "Forschungsstand", note: "що вже відомо? де Forschungslücke?", tone: yellow }
>   - { id: s2, label: "2 · підхід", text: "Ansatz + Theorie", note: "з якого погляду дивимось", tone: pink }
>   - { id: s3, label: "3 · метод", text: "Methode, Stichprobe", note: "Daten erheben: qualitativ / quantitativ", tone: yellow }
>   - { id: s4, label: "4 · результати", text: "Befunde", note: "signifikant? repräsentativ?", tone: pink }
>   - { id: s5, label: "5 · обговорення", text: "einordnen, gegenüberstellen", note: "Fazit: vorläufig, eindeutig, widersprüchlich", tone: gray }
> edges:
>   - { from: s1, to: s2 }
>   - { from: s2, to: s3 }
>   - { from: s3, to: s4 }
>   - { from: s4, to: s5 }
> steps:
>   - { focus: s1, note: "Спершу автор описує Forschungsstand — що вже досліджено — і показує Forschungslücke: чого ще ніхто не зробив. Звідси власне питання (Fragestellung)." }
>   - { focus: s2, note: "Ansatz — підхід, кут зору: soziologischer Ansatz, qualitativer Ansatz. Він спирається на Theorie і задає основні Begriffe, які треба визначити (definieren)." }
>   - { focus: s3, note: "Методика: яку Stichprobe (вибірку) взяли, як Daten erhoben (зібрали дані) — інтервʼю (qualitativ) чи анкета на 2000 осіб (quantitativ)." }
>   - { focus: s4, note: "Befunde — виявлені результати. Тут питання: чи ефект signifikant (статистично значущий) і чи вибірка repräsentativ." }
>   - { focus: s5, note: "Наостанок результати einordnen (вписати в стан науки) і gegenüberstellen (зіставити з іншими). Висновок часто vorläufig — попередній." }
> ```
> Жовті й рожеві блоки — етапи, сірий — підсумок. Кожен блок має мітку.

### Hypothese, These, Theorie, Annahme

Ці чотири слова українці часто плутають, бо в нас «теза», «гіпотеза» й «теорія» вживаються вільніше.

| Термін | Що це | Типове дієслово | Приклад |
|---|---|---|---|
| **die Annahme** | припущення, вихідна умова (часто неперевірена) | *von einer Annahme ausgehen* | *Wir gehen von der Annahme aus, dass …* |
| **die Hypothese** (B2) | припущення, яке **перевіряють** емпірично | *eine Hypothese prüfen, bestätigen, widerlegen* | *Die Hypothese wurde widerlegt.* |
| **die These** | твердження, яке автор **обстоює** аргументами | *eine These vertreten, aufstellen* | *Der Autor vertritt die These, dass …* |
| **die Theorie** | система пояснень, перевірена й узагальнена | *auf einer Theorie beruhen* | *Die Studie beruht auf der Theorie von …* |

> [!diagram] Від припущення до теорії
> ```yaml
> layout: compare
> columns: { a: "ще не перевірено", b: "перевіряється / обстоюється", c: "узагальнено" }
> nodes:
>   - { id: n1, col: a, label: "Annahme", text: "вихідне припущення", note: "von der Annahme ausgehen", tone: yellow }
>   - { id: n2, col: b, label: "Hypothese", text: "перевіряють даними", note: "bestätigen / widerlegen", tone: pink }
>   - { id: n3, col: b, label: "These", text: "обстоюють аргументами", note: "eine These vertreten", tone: pink }
>   - { id: n4, col: c, label: "Theorie", text: "система пояснень", note: "auf einer Theorie beruhen", tone: gray }
> steps:
>   - { focus: n1, note: "Annahme — те, від чого відштовхуються. Її можуть навіть не перевіряти: це умова міркування." }
>   - { focus: [n2, n3], note: "Hypothese перевіряють емпірично (експеримент, опитування). These обстоюють аргументами — типовий жанр гуманітаріїв і есе на іспиті." }
>   - { focus: n4, note: "Theorie — велика система, що пояснює багато фактів. Дослідження на ній ґрунтується (beruht auf) або її розвиває." }
> ```

### beweisen, belegen, feststellen, aufzeigen

| Дієслово | Відтінок | Приклад |
|---|---|---|
| **beweisen** | довести остаточно (логіка, математика, право) | *Der Satz wurde mathematisch bewiesen.* |
| **belegen** (B2) | підтвердити даними, джерелами | *Die Zahlen belegen den Trend.* |
| **feststellen** | встановити, констатувати факт | *Wir stellten fest, dass die Werte sinken.* |
| **aufzeigen** | показати, виявити (проблему, звʼязок) | *Die Studie zeigt Probleme auf.* |
| **hinweisen auf** | вказувати на (обережно) | *Die Befunde weisen auf einen Zusammenhang hin.* |

У німецькому науковому тексті про емпіричні результати рідко пишуть *beweisen*: дані *belegen*, *zeigen*, *weisen darauf hin*. Українське «доводить» у перекладі статті — найчастіше *belegt* або *zeigt*.

### Korrelation чи Kausalität

*Die Korrelation* — два показники змінюються разом. *Die Kausalität* — один **спричиняє** інший. Фраза *Korrelation ist nicht gleich Kausalität* — класика семінарів: якщо люди з дорогими кросівками бігають швидше, це ще не значить, що кросівки причина.

### Посилання на інших: цитування

| Мета | Формула |
|---|---|
| посилатися на джерело | *Ich beziehe mich auf …* · *in Bezug auf …* |
| пряма цитата | *„…“ (Müller 2020, S. 15)* — номер сторінки обовʼязковий |
| переказ | *Laut Müller (2020) …* · *Müller zufolge …* (детально — у [[Deutsch - C1 - 05. Непряма мова — Konjunktiv I і II, вводи]]) |
| виноска | *die Fußnote*: додаткове пояснення або джерело внизу сторінки |
| список джерел | *das Literaturverzeichnis* у кінці роботи |

## Приклади

- *Der **Forschungsstand** zu diesem Thema ist noch dünn.* — Стан досліджень на цю тему ще слабкий.
- *Die Arbeit schließt eine **Forschungslücke**.* — Робота заповнює прогалину в дослідженнях.
- *Für die Studie wurden Daten von 2000 Personen **erhoben**.* — Для дослідження зібрали дані 2000 осіб.
- *Die **Stichprobe** ist nicht **repräsentativ**, weil nur Studierende befragt wurden.* — Вибірка нерепрезентативна, бо опитали лише студентів.
- *Der Unterschied ist statistisch **signifikant**.* — Різниця статистично значуща.
- *Die **Befunde** weisen auf einen Zusammenhang zwischen Schlaf und Leistung **hin**.* — Отримані дані вказують на звʼязок між сном і успішністю.
- *Zunächst muss der **Begriff** „Integration“ **definiert** werden.* — Спершу треба визначити поняття «інтеграція».
- *Die Autorin **setzt sich** kritisch mit dem Ansatz von Habermas **auseinander**.* — Авторка критично аналізує підхід Габермаса.
- *Die Studie **beruht auf** einer **qualitativen** Befragung.* — Дослідження ґрунтується на якісному опитуванні.
- *Aus den Daten **ergibt sich** ein **widersprüchliches** Bild.* — З даних постає суперечлива картина.
- *Die Ergebnisse sind **vorläufig** und müssen überprüft werden.* — Результати попередні, їх треба перевірити.
- *Wer abschreibt, ohne die Quelle zu nennen, begeht ein **Plagiat**.* — Хто списує, не називаючи джерела, вчиняє плагіат.

## Слова

### Дослідження: стан, підхід, метод

> [!word] der Befund
> ipa: /bəˈfʊnt/ · pos: noun · level: C1 · id: de-c1-wissenschaftssprache-w01
> uk: результат (дослідження, обстеження); виявлені дані
> forms: die Befunde
> example: Die **Befunde** deuten auf einen Zusammenhang hin. — Отримані дані вказують на звʼязок.
> note: у медицині — результат обстеження: ein unauffälliger Befund (без патології). Кінцеве d — [t].

> [!word] der Ansatz
> ipa: /ˈanzats/ · pos: noun · level: C1 · id: de-c1-wissenschaftssprache-w02
> uk: підхід; концепція
> forms: die Ansätze
> example: Die Autorin verfolgt einen soziologischen **Ansatz**. — Авторка застосовує соціологічний підхід.
> note: ein neuer, interdisziplinärer, qualitativer Ansatz. Ще значення: зачаток (erste Ansätze — перші ознаки). s після n дзвінке: [nz].

> [!word] die Methode
> ipa: /meˈtoːdə/ · pos: noun · level: B1 · id: de-c1-wissenschaftssprache-w03
> uk: метод; спосіб
> forms: die Methoden
> example: Mit welcher **Methode** wurden die Daten ausgewertet? — Яким методом опрацьовували дані?
> note: наголос на -to-. Die Methodik — сукупність методів, методологія роботи. th читаємо як [t].

> [!word] der Forschungsstand
> ipa: /ˈfɔʁʃʊŋsˌʃtant/ · pos: noun · level: C1 · id: de-c1-wissenschaftssprache-w04
> uk: стан досліджень (що вже відомо)
> forms: — (без множини)
> example: Im ersten Kapitel wird der **Forschungsstand** dargestellt. — У першому розділі описано стан досліджень.
> note: обовʼязкова частина Hausarbeit і дисертації. Типово: den Forschungsstand zusammenfassen, aufarbeiten.

> [!word] die Forschungslücke
> ipa: /ˈfɔʁʃʊŋsˌlʏkə/ · pos: noun · level: C1 · id: de-c1-wissenschaftssprache-w05
> uk: прогалина в дослідженнях
> forms: die Forschungslücken
> example: Die Arbeit schließt eine **Forschungslücke**. — Робота заповнює прогалину в дослідженнях.
> note: die Lücke — прогалина. Колокація: eine Forschungslücke schließen / aufzeigen.

> [!word] die Stichprobe
> ipa: /ˈʃtɪçˌpʁoːbə/ · pos: noun · level: C1 · id: de-c1-wissenschaftssprache-w06
> uk: вибірка; вибіркова перевірка
> forms: die Stichproben
> example: Die **Stichprobe** umfasst 500 Personen. — Вибірка охоплює 500 осіб.
> note: eine repräsentative, zufällige Stichprobe. У побуті — вибіркова перевірка: Die Polizei kontrolliert stichprobenartig.

> [!word] die Erhebung
> ipa: /ɛɐ̯ˈheːbʊŋ/ · pos: noun · level: C1 · id: de-c1-wissenschaftssprache-w07
> uk: збирання даних; опитування, обстеження
> forms: die Erhebungen
> example: Die **Erhebung** fand im Frühjahr 2024 statt. — Опитування провели навесні 2024 року.
> note: від erheben. Ще значення: підвищення (die Erhebung von Gebühren — стягнення зборів), височина. -ung — завжди die.

> [!word] der Datensatz
> ipa: /ˈdaːtn̩ˌzats/ · pos: noun · level: C1 · id: de-c1-wissenschaftssprache-w08
> uk: набір даних; запис (у базі даних)
> forms: die Datensätze
> example: Der **Datensatz** ist öffentlich zugänglich. — Набір даних є у відкритому доступі.
> note: die Daten — лише множина (дані); один запис — der Datensatz. Рід від der Satz.

> [!word] die Variable
> ipa: /vaˈʁi̯aːblə/ · pos: noun · level: C1 · id: de-c1-wissenschaftssprache-w09
> uk: змінна
> forms: die Variablen
> example: Alter und Einkommen sind die wichtigsten **Variablen**. — Вік і дохід — найважливіші змінні.
> note: v = [v], наголос на -ri-. Відмінюється як іменник жін. роду: eine Variable, zwei Variablen. abhängige / unabhängige Variable — залежна / незалежна змінна.

> [!word] die Korrelation
> ipa: /kɔʁelaˈtsi̯oːn/ · pos: noun · level: C1 · id: de-c1-wissenschaftssprache-w10
> uk: кореляція; взаємозвʼязок
> forms: die Korrelationen
> example: Es besteht eine starke **Korrelation** zwischen Bildung und Einkommen. — Між освітою й доходом існує сильна кореляція.
> note: zwischen + Dat. -ion → die. Не плутай із die Kausalität (причиновий звʼязок).

> [!word] die Kausalität
> ipa: /kaʊ̯zaliˈtɛːt/ · pos: noun · level: C1 · id: de-c1-wissenschaftssprache-w11
> uk: причиновість; причиново-наслідковий звʼязок
> forms: die Kausalitäten
> example: Eine Korrelation beweist noch keine **Kausalität**. — Кореляція ще не доводить причиновості.
> note: прикметник kausal: ein kausaler Zusammenhang. -tät → die. au — дифтонг [aʊ̯].

> [!word] das Kriterium
> ipa: /kʁiˈteːʁi̯ʊm/ · pos: noun · level: B2 · id: de-c1-wissenschaftssprache-w12
> uk: критерій
> forms: die Kriterien
> example: Nach welchen **Kriterien** wurden die Texte ausgewählt? — За якими критеріями відбирали тексти?
> note: -um → das; множина -ien: die Kriterien (не ~~Kriteriums~~). Наголос на -te-.

> [!word] der Untersuchungsgegenstand
> ipa: /ʊntɐˈzuːxʊŋsˌɡeːɡn̩ʃtant/ · pos: noun · level: C1 · id: de-c1-wissenschaftssprache-w13
> uk: предмет дослідження
> forms: die Untersuchungsgegenstände
> example: **Untersuchungsgegenstand** sind Online-Kommentare zur Klimapolitik. — Предмет дослідження — онлайн-коментарі щодо кліматичної політики.
> note: рід від der Gegenstand. Часто без артикля на початку речення, як у прикладі.

> [!word] die Annahme
> ipa: /ˈanaːmə/ · pos: noun · level: B2 · id: de-c1-wissenschaftssprache-w14
> uk: припущення; прийняття
> forms: die Annahmen
> example: Wir gehen von der **Annahme** aus, dass die Preise steigen. — Ми виходимо з припущення, що ціни зростатимуть.
> note: von der Annahme ausgehen, dass … Друге значення — прийняття: die Annahme eines Pakets, eines Antrags.

> [!word] die Theorie
> ipa: /teoˈʁiː/ · pos: noun · level: B1 · id: de-c1-wissenschaftssprache-w15
> uk: теорія
> forms: die Theorien
> example: Die Studie beruht auf der **Theorie** des sozialen Lernens. — Дослідження ґрунтується на теорії соціального навчання.
> note: наголос на кінцевому -rie; множина [teoˈʁiːən]. In der Theorie … in der Praxis — теоретично … на практиці.

> [!word] der Begriff
> ipa: /bəˈɡʁɪf/ · pos: noun · level: B1 · id: de-c1-wissenschaftssprache-w16
> uk: поняття; термін
> forms: die Begriffe
> example: Der **Begriff** „Heimat“ ist schwer zu übersetzen. — Поняття Heimat важко перекласти.
> note: einen Begriff definieren, klären. Розмовне: im Begriff sein, etwas zu tun — збиратися щось зробити. Ein Begriff sein — бути відомим (Der Name ist mir ein Begriff).

> [!word] die Definition
> ipa: /definiˈtsi̯oːn/ · pos: noun · level: B1 · id: de-c1-wissenschaftssprache-w17
> uk: визначення; дефініція
> forms: die Definitionen
> example: Es gibt keine einheitliche **Definition** von Armut. — Єдиного визначення бідності немає.
> note: -tion = [tsi̯oːn], наголос на останньому складі. Laut Definition / per Definition — за визначенням.

> [!word] der Diskurs
> ipa: /dɪsˈkʊʁs/ · pos: noun · level: C1 · id: de-c1-wissenschaftssprache-w18
> uk: дискурс; суспільне обговорення теми
> forms: die Diskurse
> example: Der öffentliche **Diskurs** über Migration hat sich verändert. — Публічний дискурс про міграцію змінився.
> note: не синонім die Diskussion (конкретне обговорення). Diskurs — сукупність висловлювань на тему в суспільстві. Наголос на -kurs.

> [!word] das Phänomen
> ipa: /fɛnoˈmeːn/ · pos: noun · level: B2 · id: de-c1-wissenschaftssprache-w19
> uk: явище; феномен
> forms: die Phänomene
> example: Das **Phänomen** ist seit den 1990er-Jahren bekannt. — Явище відоме з 1990-х років.
> note: ph = [f], наголос на останньому складі. Буденно: Er ist ein Phänomen — він неймовірний.

> [!word] die Analyse
> ipa: /anaˈlyːzə/ · pos: noun · level: B2 · id: de-c1-wissenschaftssprache-w20
> uk: аналіз
> forms: die Analysen
> example: Die **Analyse** der Interviews dauerte drei Monate. — Аналіз інтервʼю тривав три місяці.
> note: дієслово analysieren (B2). y = [yː], з округленими губами. Укр. «аналіз» — ч. р., нім. — die.

### Текст і джерела

> [!word] die Fachliteratur
> ipa: /ˈfaxlɪtəʁaˌtuːɐ̯/ · pos: noun · level: B2 · id: de-c1-wissenschaftssprache-w21
> uk: фахова література
> forms: — (без множини)
> example: Zu diesem Thema gibt es kaum deutschsprachige **Fachliteratur**. — На цю тему майже немає фахової літератури німецькою.
> note: die Literatur у науці — усі джерела на тему, не лише художня. Die Sekundärliteratur — дослідження про джерело.

> [!word] das Literaturverzeichnis
> ipa: /lɪtəʁaˈtuːɐ̯fɛɐ̯ˌtsaɪ̯çnɪs/ · pos: noun · level: B2 · id: de-c1-wissenschaftssprache-w22
> uk: список літератури; бібліографія
> forms: die Literaturverzeichnisse
> example: Alle zitierten Werke müssen im **Literaturverzeichnis** stehen. — Усі цитовані праці мають бути в списку літератури.
> note: рід від das Verzeichnis. Множина -nisse (подвоєне s).

> [!word] die Fußnote
> ipa: /ˈfuːsˌnoːtə/ · pos: noun · level: B2 · id: de-c1-wissenschaftssprache-w23
> uk: виноска
> forms: die Fußnoten
> example: Die Quelle steht in der **Fußnote**. — Джерело вказано у виносці.
> note: der Fuß (низ сторінки) + die Note. CH: Fussnote.

> [!word] die Abhandlung
> ipa: /ˈaphandlʊŋ/ · pos: noun · level: C1 · id: de-c1-wissenschaftssprache-w24
> uk: трактат; наукова праця (стаття)
> forms: die Abhandlungen
> example: Kant schrieb eine **Abhandlung** über den ewigen Frieden. — Кант написав трактат про вічний мир.
> note: книжне слово для ґрунтовного наукового тексту. Від abhandeln — розглядати тему. b перед h — [p].

> [!word] die Hausarbeit
> ipa: /ˈhaʊ̯sʔaʁˌbaɪ̯t/ · pos: noun · level: B2 · id: de-c1-wissenschaftssprache-w25
> uk: курсова (семінарська) робота; також хатня робота
> forms: die Hausarbeiten
> example: Die **Hausarbeit** muss bis zum 31. März abgegeben werden. — Курсову треба здати до 31 березня.
> note: в університеті — письмова робота після семінару (10–20 сторінок). У побуті — хатні справи. Шкільне «домашнє завдання» — die Hausaufgabe.

> [!word] das Exzerpt
> ipa: /ɛksˈtsɛʁpt/ · pos: noun · level: C1 · id: de-c1-wissenschaftssprache-w26
> uk: конспект-виписка (з тексту)
> forms: die Exzerpte
> example: Vor dem Schreiben mache ich zu jedem Buch ein **Exzerpt**. — Перед тим як писати, роблю виписки з кожної книжки.
> note: дієслово exzerpieren. Зміст: головні тези + цитати зі сторінками. Наголос на -zerpt.

> [!word] das Plagiat
> ipa: /plaˈɡi̯aːt/ · pos: noun · level: C1 · id: de-c1-wissenschaftssprache-w27
> uk: плагіат
> forms: die Plagiate
> example: Die Universität hat in der Arbeit mehrere **Plagiate** gefunden. — Університет знайшов у роботі кілька фрагментів плагіату.
> note: укр. — ч. р., нім. — das. Дієслово plagiieren. Ein Plagiat begehen — вчинити плагіат.

### Дієслова наукового тексту

> [!word] erörtern
> ipa: /ɛɐ̯ˈʔœʁtɐn/ · pos: verb · level: C1 · id: de-c1-wissenschaftssprache-w28
> uk: докладно обговорювати; розглядати (питання з різних боків)
> forms: erörtern → erörterte → hat erörtert
> example: Im zweiten Teil werden die Vor- und Nachteile **erörtert**. — У другій частині розглянуто переваги й недоліки.
> note: іменник die Erörterung (B2) — жанр есе-міркування. Невідокремлюване er-: Er erörtert die Frage.

> [!word] beweisen
> ipa: /bəˈvaɪ̯zn̩/ · pos: verb · level: B1 · id: de-c1-wissenschaftssprache-w29
> uk: доводити (остаточно)
> forms: beweisen → bewies → hat bewiesen
> example: Der Satz des Pythagoras lässt sich mathematisch **beweisen**. — Теорему Піфагора можна довести математично.
> note: про емпіричні дані частіше belegen (B2) або zeigen. beweisen — для логіки, математики, суду. Іменник der Beweis.

> [!word] ermitteln
> ipa: /ɛɐ̯ˈmɪtl̩n/ · pos: verb · level: B2 · id: de-c1-wissenschaftssprache-w30
> uk: встановлювати, визначати (через пошук, розрахунок); розслідувати
> forms: ermitteln → ermittelte → hat ermittelt
> example: Die Forscher **ermittelten** den Durchschnittswert für jede Gruppe. — Дослідники визначили середнє значення для кожної групи.
> note: у поліції: Die Polizei ermittelt gegen ihn — розслідує справу проти нього. Іменник die Ermittlung.

> [!word] erheben
> ipa: /ɛɐ̯ˈheːbn̩/ · pos: verb · level: C1 · id: de-c1-wissenschaftssprache-w31
> uk: збирати (дані); стягувати (збір)
> forms: erheben → erhob → hat erhoben
> example: Die Daten wurden mit einem Fragebogen **erhoben**. — Дані зібрали за допомогою анкети.
> note: Daten erheben — сталий науковий вираз. Також: Gebühren erheben, Anspruch / Einspruch erheben (B2), die Stimme erheben (підвищити голос).

> [!word] feststellen
> ipa: /ˈfɛstʃtɛlən/ · pos: verb · level: B1 · id: de-c1-wissenschaftssprache-w32
> uk: встановлювати, констатувати; помічати
> forms: feststellen → stellte fest → hat festgestellt
> example: Wir **stellten fest**, dass die Werte im Winter sinken. — Ми встановили, що взимку показники знижуються.
> note: відокремлюване. Іменник die Feststellung. Буденно: Ich stelle fest, du hast recht — бачу, ти маєш рацію.

> [!word] aufzeigen
> ipa: /ˈaʊ̯ftsaɪ̯ɡn̩/ · pos: verb · level: C1 · id: de-c1-wissenschaftssprache-w33
> uk: показувати, виявляти (проблему, можливість)
> forms: aufzeigen → zeigte auf → hat aufgezeigt
> example: Die Studie **zeigt** mehrere Probleme **auf**. — Дослідження виявляє кілька проблем.
> note: книжніше за zeigen. Типово: Probleme, Möglichkeiten, Wege, Grenzen aufzeigen.

> [!word] definieren
> ipa: /defiˈniːʁən/ · pos: verb · level: B2 · id: de-c1-wissenschaftssprache-w34
> uk: визначати; давати дефініцію
> forms: definieren → definierte → hat definiert
> example: Zuerst muss man **definieren**, was „Erfolg“ bedeutet. — Спершу треба визначити, що означає «успіх».
> note: -ieren: наголос на -nie-, Perfekt без ge-. Пасив: Der Begriff wird als … definiert.

> [!word] sich beziehen auf (+ Akk)
> ipa: /zɪç bəˈtsiːən aʊ̯f/ · pos: verb · level: B2 · id: de-c1-wissenschaftssprache-w35
> uk: посилатися на; стосуватися
> forms: sich beziehen → bezog sich → hat sich bezogen
> example: Ich **beziehe mich auf** die Studie von 2021. — Я посилаюся на дослідження 2021 року.
> note: auf + Akk. Без sich — інші значення: eine Wohnung beziehen (вселитися), Gehalt beziehen (отримувати). In Bezug auf + Akk — щодо.

> [!word] einordnen
> ipa: /ˈaɪ̯nʔɔʁdnən/ · pos: verb · level: B2 · id: de-c1-wissenschaftssprache-w36
> uk: класифікувати; вписувати в контекст
> forms: einordnen → ordnete ein → hat eingeordnet
> example: Die Ergebnisse werden im Kapitel 5 **eingeordnet**. — У розділі 5 результати вписано в контекст досліджень.
> note: etwas in einen Zusammenhang einordnen. У місті: sich einordnen — перешикуватися в ряд (на дорозі).

> [!word] gegenüberstellen
> ipa: /ɡeːɡn̩ˈʔyːbɐʃtɛlən/ · pos: verb · level: C1 · id: de-c1-wissenschaftssprache-w37
> uk: зіставляти; протиставляти
> forms: gegenüberstellen → stellte gegenüber → hat gegenübergestellt
> example: Im Fazit werden beide Positionen **gegenübergestellt**. — У висновку обидві позиції зіставлено.
> note: etwas (Akk) einer Sache (Dat) gegenüberstellen. Іменник die Gegenüberstellung. Наголос на -über-.

> [!word] abgrenzen von (+ Dat)
> ipa: /ˈapɡʁɛntsn̩ fɔn/ · pos: verb · level: C1 · id: de-c1-wissenschaftssprache-w38
> uk: розмежовувати; відмежовувати від
> forms: abgrenzen → grenzte ab → hat abgegrenzt
> example: Der Begriff „Flucht“ muss von „Migration“ **abgegrenzt** werden. — Поняття «втеча» треба розмежувати з «міграцією».
> note: sich abgrenzen von — відмежовуватися (від думки, групи). Іменник die Abgrenzung.

> [!word] sich auseinandersetzen mit (+ Dat)
> ipa: /zɪç aʊ̯sʔaɪ̯ˈnandɐzɛtsn̩ mɪt/ · pos: verb · level: B2 · id: de-c1-wissenschaftssprache-w39
> uk: ґрунтовно розбиратися з; критично аналізувати
> forms: sich auseinandersetzen → setzte sich auseinander → hat sich auseinandergesetzt
> example: Die Autorin **setzt sich** kritisch **mit** dem Ansatz **auseinander**. — Авторка критично аналізує цей підхід.
> note: mit + Dat. Не «сідати окремо»! Іменник die Auseinandersetzung — і ґрунтовний аналіз, і сварка.

> [!word] beruhen auf (+ Dat)
> ipa: /bəˈʁuːən aʊ̯f/ · pos: verb · level: C1 · id: de-c1-wissenschaftssprache-w40
> uk: ґрунтуватися на; базуватися на
> forms: beruhen → beruhte → hat beruht
> example: Die Ergebnisse **beruhen auf** einer Befragung von 800 Lehrkräften. — Результати ґрунтуються на опитуванні 800 учителів.
> note: auf + Dat (не Akk!). Сталий вираз: Das beruht auf Gegenseitigkeit — це взаємно.

> [!word] sich ergeben aus (+ Dat)
> ipa: /zɪç ɛɐ̯ˈɡeːbn̩ aʊ̯s/ · pos: verb · level: C1 · id: de-c1-wissenschaftssprache-w41
> uk: випливати з; виходити з
> forms: sich ergeben → ergab sich → hat sich ergeben
> example: Daraus **ergibt sich** die Frage, ob … — Звідси постає питання, чи …
> note: aus + Dat. Без sich: Die Summe ergibt 100 — сума становить 100. Kein Unterschied ergab sich — різниці не виявилося.

> [!word] zugrunde liegen
> ipa: /tsuˈɡʁʊndə ˈliːɡn̩/ · pos: verb · level: C1 · id: de-c1-wissenschaftssprache-w42
> uk: лежати в основі
> forms: zugrunde liegen → lag zugrunde → hat zugrunde gelegen
> example: Der Studie **liegt** ein Datensatz von 2023 **zugrunde**. — В основі дослідження лежить набір даних 2023 року.
> note: керування — Dativ: einer Sache zugrunde liegen. Також пишуть zu Grunde. AT/CH/півд. Німеччина: ist zugrunde gelegen.

> [!word] hinweisen auf (+ Akk)
> ipa: /ˈhɪnvaɪ̯zn̩ aʊ̯f/ · pos: verb · level: B1 · id: de-c1-wissenschaftssprache-w43
> uk: вказувати на; звертати увагу на
> forms: hinweisen → wies hin → hat hingewiesen
> example: Die Daten **weisen** auf einen Anstieg **hin**. — Дані вказують на зростання.
> note: обережніше за beweisen. Darauf hinweisen, dass … Іменник der Hinweis.

### Оцінка результату: прикметники

> [!word] signifikant
> ipa: /zɪɡnifiˈkant/ · pos: adj · level: C1 · id: de-c1-wissenschaftssprache-w44
> uk: статистично значущий; суттєвий
> example: Zwischen den Gruppen gab es keinen **signifikanten** Unterschied. — Між групами не було статистично значущої різниці.
> note: у статистиці — точний термін (p-Wert). У пресі — просто «суттєвий»: ein signifikanter Anstieg.

> [!word] repräsentativ
> ipa: /ʁepʁɛzɛntaˈtiːf/ · pos: adj · level: B2 · id: de-c1-wissenschaftssprache-w45
> uk: репрезентативний; показовий
> example: Die Umfrage ist **repräsentativ** für die deutsche Bevölkerung. — Опитування репрезентативне для населення Німеччини.
> note: für + Akk. Кінцеве v — [f], у формах із закінченням — [v]: eine repräsentative Stichprobe.

> [!word] einschlägig
> ipa: /ˈaɪ̯nʃlɛːɡɪç/ · pos: adj · level: C1 · id: de-c1-wissenschaftssprache-w46
> uk: відповідний, профільний (про літературу, досвід)
> example: Er hat die **einschlägige** Fachliteratur gelesen. — Він прочитав профільну фахову літературу.
> note: також у вакансіях: einschlägige Berufserfahrung — досвід саме в цій галузі. У праві: einschlägig vorbestraft — судимий за подібний злочин.

> [!word] maßgeblich
> ipa: /ˈmaːsɡeːplɪç/ · pos: adj · level: C1 · id: de-c1-wissenschaftssprache-w47
> uk: вирішальний; визначальний; авторитетний
> example: Sie war **maßgeblich** an der Entwicklung beteiligt. — Вона відіграла вирішальну роль у розробці.
> note: maßgeblich beteiligt sein an + Dat, maßgeblich beeinflussen. ß = [s]; b перед l оглушується до [p]. CH: massgeblich.

> [!word] qualitativ
> ipa: /kvalitaˈtiːf/ · pos: adj · level: B2 · id: de-c1-wissenschaftssprache-w48
> uk: якісний (про метод); за якістю
> example: Die Studie arbeitet mit **qualitativen** Interviews. — Дослідження використовує якісні інтервʼю.
> note: qualitative Forschung — інтервʼю, аналіз текстів, мало учасників. qu = [kv]. Не плутай із hochwertig (якісний товар).

> [!word] quantitativ
> ipa: /kvantitaˈtiːf/ · pos: adj · level: B2 · id: de-c1-wissenschaftssprache-w49
> uk: кількісний
> example: Für die **quantitative** Analyse wurden 2000 Fragebögen ausgewertet. — Для кількісного аналізу опрацювали 2000 анкет.
> note: quantitative Forschung — числа, статистика, багато учасників. Пара: qualitativ ↔ quantitativ.

> [!word] vorläufig
> ipa: /ˈfoːɐ̯lɔʏ̯fɪç/ · pos: adj · level: B1 · id: de-c1-wissenschaftssprache-w50
> uk: попередній; тимчасовий
> example: Die Ergebnisse sind **vorläufig**. — Результати попередні.
> note: vorläufiges Endergebnis — попередній підсумок (вибори). Як прислівник: vorläufig — поки що.

> [!word] eindeutig
> ipa: /ˈaɪ̯ndɔʏ̯tɪç/ · pos: adj · level: B1 · id: de-c1-wissenschaftssprache-w51
> uk: однозначний; явний
> example: Die Daten sind nicht **eindeutig**. — Дані неоднозначні.
> note: протилежне: mehrdeutig, uneindeutig. -ig = [ɪç].

> [!word] widersprüchlich
> ipa: /ˈviːdɐʃpʁʏçlɪç/ · pos: adj · level: B2 · id: de-c1-wissenschaftssprache-w52
> uk: суперечливий
> example: Die bisherigen Befunde sind **widersprüchlich**. — Наявні результати суперечливі.
> note: від widersprechen. wider- (проти) з одним i, на відміну від wieder (знову).

> [!word] relevant
> ipa: /ʁeleˈvant/ · pos: adj · level: B2 · id: de-c1-wissenschaftssprache-w53
> uk: релевантний; суттєвий, важливий (для чогось)
> example: Für die Fragestellung ist dieser Aspekt nicht **relevant**. — Для дослідницького питання цей аспект не суттєвий.
> note: für + Akk. v = [v], наголос на -vant. Іменник die Relevanz.

## Слухаємо

> [!listen] Що ти почув?
> level: C1 · type: choice · id: de-c1-wissenschaftssprache-l01
> audio: Die Stichprobe ist nicht repräsentativ.
> - [x] Die Stichprobe ist nicht repräsentativ.
> - [ ] Die Stichprobe ist nicht relevant.
> - [ ] Die Stichproben sind nicht repräsentativ.
>
> **Пояснення:** однина (*ist*) і *repräsentativ* — «репрезентативна». *Relevant* — «суттєва», інше значення.

> [!listen] Що каже лекторка про результати?
> level: C1 · type: answer · id: de-c1-wissenschaftssprache-l02
> audio: Die Befunde weisen zwar auf einen Zusammenhang hin, aber eine Kausalität lässt sich daraus nicht ableiten.
> - [x] Звʼязок є, але причиновості з цього не виведеш.
> - [ ] Дослідження довело причиновий звʼязок.
> - [ ] Звʼязку між показниками немає.
> - [ ] Результати ще не опрацьовано.
>
> **Пояснення:** *zwar … aber* — поступка: звʼязок (*Zusammenhang*) дані показують, але *eine Kausalität lässt sich nicht ableiten* — причиновості з цього вивести не можна. Класичне «кореляція ≠ причиновість».

> [!listen] Напиши, що почув
> level: C1 · type: dictation · id: de-c1-wissenschaftssprache-l03
> audio: Die Daten wurden mit einem Fragebogen erhoben.

## Вимова

> [!speak] Скажи вголос
> level: C1 · id: de-c1-wissenschaftssprache-s01
> text: Der Unterschied ist statistisch signifikant.
> ipa: /deːɐ̯ ˈʊntɐʃiːt ɪst ʃtaˈtɪstɪʃ zɪɡnifiˈkant/
> tip: statistisch — st на початку [ʃt], у середині слова st — [st]; signifikant — gn тут [ɡn], наголос на -kant.
> uk: Різниця статистично значуща.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-wissenschaftssprache-s02
> text: Daraus ergibt sich die Frage, ob die Theorie stimmt.
> ipa: /daˈʁaʊ̯s ɛɐ̯ˈɡiːpt zɪç diː ˈfʁaːɡə ɔp diː teoˈʁiː ʃtɪmt/
> tip: ergibt — b перед t [p]: [ɛɐ̯ˈɡiːpt]; Theorie — th = [t], наголос на останньому складі; ob — кінцеве b [p].
> uk: Звідси постає питання, чи правильна теорія.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-wissenschaftssprache-s03
> text: Die Autorin setzt sich kritisch mit dem Ansatz auseinander.
> ipa: /diː aʊ̯ˈtoːʁɪn zɛtst zɪç ˈkʁiːtɪʃ mɪt deːm ˈanzats aʊ̯sʔaɪ̯ˈnandɐ/
> tip: Autorin — au [aʊ̯], наголос на -to-; auseinander — наголос на -nan-, між aus і ein — легкий розрив [ʔ].
> uk: Авторка критично аналізує цей підхід.

## Типові помилки українців

> [!pitfall] «Доводить» — не завжди beweisen
> *Die Umfrage beweist, dass Jugendliche weniger lesen.* звучить надто категорично → Die Umfrage **zeigt / belegt**, dass … Опитування нічого не доводить остаточно — воно показує й підтверджує. *Beweisen* лишаємо для математики, логіки й суду. Обережні формулювання — ознака доброго наукового стилю: *Die Daten weisen darauf hin, dass …*

> [!pitfall] These, Hypothese, Theorie — не синоніми
> В українській «теза» часто означає просто головну думку чи пункт виступу. Німецька *These* — **твердження, яке ти обстоюєш** (*Ich vertrete die These, dass …*). *Hypothese* перевіряють даними, *Theorie* — велика система пояснень. *Meine Theorie ist, dass das Handy schadet* звучить неточно (це радше твердження, ніж теорія); у есе краще → *Meine These lautet: …*

> [!pitfall] Хибні друзі університету
> ***Die Hausarbeit*** — не лише хатні справи, а й курсова робота. ***Das Referat*** — усна доповідь на семінарі, а не письмовий «реферат». ***Die Dissertation*** — докторська робота (Dr.), окремого ступеня «кандидат наук» у Німеччині немає. ***Der Diskurs*** — не «дискусія» (*die Diskussion*), а суспільне поле висловлювань.

> [!pitfall] Прийменник при науковому дієслові
> ~~Die Studie beruht auf eine Befragung~~ → beruht auf **einer** Befragung (Dat). ~~sich beziehen auf der Studie~~ → sich beziehen auf **die Studie** (Akk). ~~sich auseinandersetzen über~~ → sich auseinandersetzen **mit** (+ Dat). Вчи такі дієслова разом із прийменником і відмінком, як у картках.

## Ситуація: консультація в професорки

> [!listen] Олег приходить на Sprechstunde щодо Hausarbeit. Що радить професорка?
> level: C1 · type: answer · id: de-c1-wissenschaftssprache-l04
> audio: A: Ich möchte untersuchen, ob Social Media die Sprache verändert.
> audio: B: Spannend. Aber grenzen Sie das Thema ab: Welche Plattform, welche Altersgruppe? Und lesen Sie zuerst die einschlägige Literatur zum Forschungsstand.
> - [x] Звузити тему й спершу ознайомитися з профільною літературою.
> - [ ] Розширити тему на всі соцмережі.
> - [ ] Одразу збирати дані без читання літератури.
> - [ ] Змінити тему, бо вона нецікава.
>
> **Пояснення:** *grenzen Sie das Thema ab* — розмежуйте, звузьте тему (яка платформа, яка вікова група); *lesen Sie zuerst die einschlägige Literatur zum Forschungsstand* — спершу прочитайте профільну літературу. *Spannend* — «цікаво», тож тему не відкидають. Переклад: — Я хочу дослідити, чи змінюють соцмережі мову. — Цікаво. Але звузьте тему: яка платформа, яка вікова група? І спершу прочитайте профільну літературу про стан досліджень.

> [!speak] Ситуація: опиши свій підхід
> level: C1 · id: de-c1-wissenschaftssprache-s04
> text: Meine Arbeit beruht auf einer qualitativen Befragung von zwanzig Studierenden.
> ipa: /ˈmaɪ̯nə ˈaʁbaɪ̯t bəˈʁuːt aʊ̯f ˈaɪ̯nɐ kvalitaˈtiːvən bəˈfʁaːɡʊŋ fɔn ˈtsvantsɪç ˈʃtuːdiːʁəndn̩/
> tip: beruht — h не вимовляється, довге [uː]; qualitativen — qu = [kv], v між голосними — [v]; zwanzig — -ig = [ɪç].
> uk: Моя робота ґрунтується на якісному опитуванні двадцяти студентів.

## Landeskunde: Die Plagiatsaffäre und die gute wissenschaftliche Praxis

> [!example] Wie eine Doktorarbeit einen Minister zu Fall brachte
> Am 16. Februar 2011 berichtete die Süddeutsche Zeitung, dass die Doktorarbeit des damaligen Verteidigungsministers Karl-Theodor zu Guttenberg Stellen enthalte, die aus anderen Texten übernommen worden seien, ohne die Quelle zu nennen. Die Arbeit mit dem Titel „Verfassung und Verfassungsvertrag“ war an der Universität Bayreuth entstanden.
>
> Schon am nächsten Tag gründete ein anonymer Doktorand im Internet das „GuttenPlag Wiki“. Hunderte Freiwillige verglichen dort die Dissertation Satz für Satz mit anderen Texten. Bis zum 6. April 2011 hatten die Freiwilligen auf 94,14 Prozent aller Seiten des Haupttextes Plagiate entdeckt. Am 23. Februar 2011 erkannte die Universität Bayreuth dem Minister den Doktorgrad ab, am 1. März erklärte er seinen Rücktritt. Eine Kommission der Universität kam im Mai 2011 zu dem Ergebnis, er habe vorsätzlich getäuscht. Guttenberg hatte eine bewusste Täuschung bestritten. Der Bericht der Kommission empfahl der Universität unter anderem, Plagiatssoftware einzusetzen und die Betreuung von Promovierenden zu verbessern.
>
> Die Affäre löste eine breite Debatte über die Qualität von Doktorarbeiten aus. Nach dem Vorbild von GuttenPlag entstanden weitere Plattformen, auf denen Freiwillige Dissertationen prüfen; in den folgenden Jahren verloren auch andere Politikerinnen und Politiker ihren Titel. Viele Hochschulen setzen seitdem Software ein, die Texte mit Datenbanken vergleicht, auch wenn ein Programm allein nicht entscheiden kann, ob ein Plagiat vorliegt.
>
> Was „gute wissenschaftliche Praxis“ bedeutet, beschreibt in Deutschland vor allem die Deutsche Forschungsgemeinschaft (DFG). Ihr Kodex umfasst 19 Leitlinien. Dazu gehören etwa die ehrliche Dokumentation von Methoden und Daten und die Kennzeichnung fremder Gedanken. Die DFG nennt die Umsetzung des Kodex in eigenes Recht die verbindliche Grundlage für die Förderung wissenschaftlicher Einrichtungen; Hochschulen müssen die Regeln also in ihren Satzungen verankern.
>
> Für Studierende heißt das: Unter einer Hausarbeit steht in der Regel eine unterschriebene Erklärung, dass man die Arbeit selbstständig verfasst und alle Quellen angegeben hat. Jede wörtliche Übernahme braucht Anführungszeichen und eine genaue Quellenangabe mit Seitenzahl, jede sinngemäße Übernahme einen Verweis. Wer das vergisst, riskiert, dass die Arbeit als nicht bestanden gewertet wird. Die genauen Zitierregeln unterscheiden sich allerdings von Fach zu Fach: In den Rechtswissenschaften zitiert man oft in Fußnoten, in vielen Naturwissenschaften im laufenden Text mit Autor und Jahr. Lies deshalb vor der ersten Hausarbeit das Merkblatt deines Instituts und frage im Zweifel bei der Betreuerin oder beim Betreuer nach.

> [!quiz] Nach dem Text: Was war das „GuttenPlag Wiki“?
> level: C1 · type: single · id: de-c1-wissenschaftssprache-q02
> - [ ] eine Kommission der Universität Bayreuth
> - [x] eine Internetplattform, auf der Freiwillige die Dissertation prüften
> - [ ] eine Software, die Texte automatisch vergleicht
> - [ ] ein Artikel der Süddeutschen Zeitung
>
> **Пояснення:** *gründete ein anonymer Doktorand im Internet das „GuttenPlag Wiki“. Hunderte Freiwillige verglichen dort die Dissertation …* Комісія університету — окремий орган, а програмне забезпечення зʼявляється в тексті пізніше як загальна практика.

> [!quiz] Nach dem Text: In welcher Reihenfolge geschah es?
> level: C1 · type: single · id: de-c1-wissenschaftssprache-q03
> - [x] Zeitungsbericht → Aberkennung des Doktorgrads → Rücktritt → Ergebnis der Kommission
> - [ ] Rücktritt → Zeitungsbericht → Aberkennung des Doktorgrads → Ergebnis der Kommission
> - [ ] Ergebnis der Kommission → Aberkennung des Doktorgrads → Rücktritt
> - [ ] Zeitungsbericht → Ergebnis der Kommission → Rücktritt → Aberkennung des Doktorgrads
>
> **Пояснення:** 16 лютого 2011 — стаття в газеті, 23 лютого — позбавлення ступеня, 1 березня — відставка, травень 2011 — висновок комісії про навмисний обман.

> [!quiz] Was stimmt laut Text? Wähle alle richtigen Aussagen.
> level: C1 · type: multi · id: de-c1-wissenschaftssprache-q04
> - [x] Der Kodex der DFG umfasst 19 Leitlinien.
> - [x] Wörtliche Zitate brauchen eine Quellenangabe mit Seitenzahl.
> - [ ] Software kann allein entscheiden, ob ein Plagiat vorliegt.
> - [ ] Guttenberg gab sofort zu, bewusst getäuscht zu haben.
>
> **Пояснення:** про 19 настанов DFG і про цитати з номером сторінки сказано прямо. Текст наголошує, що *ein Programm allein nicht entscheiden kann*, а Гуттенберг *eine bewusste Täuschung bestritten* — заперечував.

## Практика

> [!quiz] Дослідник опитав 30 студентів одного факультету й пише про «всю молодь Німеччини». Що не так?
> level: C1 · type: single · id: de-c1-wissenschaftssprache-q05
> - [x] Die Stichprobe ist nicht repräsentativ.
> - [ ] Die Stichprobe ist nicht signifikant.
> - [ ] Die Stichprobe ist zu qualitativ.
> - [ ] Die Stichprobe ist nicht eindeutig.
>
> **Пояснення:** вибірка не відображає всієї молоді — вона *nicht repräsentativ*. *Signifikant* стосується результату (різниці, ефекту), а не вибірки; *qualitativ* — характеристика методу, не помилка; *eindeutig* — про висновки чи дані.

> [!quiz] Яке дієслово доречне в статті про опитування? «Die Umfrage ___, dass viele Studierende nebenbei arbeiten.»
> level: C1 · type: single · id: de-c1-wissenschaftssprache-q06
> - [ ] beweist endgültig
> - [x] zeigt
> - [ ] erörtert
> - [ ] definiert
>
> **Пояснення:** опитування *zeigt* (показує) — нейтрально й точно. *Beweist endgültig* для емпіричних даних звучить надто категорично. *Erörtern* — розглядати питання з різних боків (це робить автор, а не опитування), *definieren* — давати визначення.

> [!quiz] Які слова описують метод дослідження? Обери всі.
> level: C1 · type: multi · id: de-c1-wissenschaftssprache-q07
> - [x] die Stichprobe
> - [x] die Erhebung
> - [ ] das Literaturverzeichnis
> - [x] qualitativ
> - [ ] die Fußnote
>
> **Пояснення:** вибірка (*Stichprobe*), збирання даних (*Erhebung*) і тип методу (*qualitativ*) — частини методики. *Literaturverzeichnis* і *Fußnote* — оформлення тексту й джерел.

> [!quiz] «Der Autor vertritt die ___, dass Bildung der wichtigste Faktor ist.» Що пасує?
> level: C1 · type: single · id: de-c1-wissenschaftssprache-q08
> - [x] These
> - [ ] Erhebung
> - [ ] Stichprobe
> - [ ] Kausalität
>
> **Пояснення:** *eine These vertreten* — обстоювати твердження. *These* — твердження, яке обстоюють; *Erhebung* (збирання даних), *Stichprobe* (вибірка) і *Kausalität* (причинність) за змістом не підходять. *Theorie* теж можна «вести» (*eine Theorie vertreten*), але вона означає систему пояснень, а не окреме твердження.

> [!quiz] Заповни прийменники
> level: C1 · type: fill · id: de-c1-wissenschaftssprache-q09 · bank: über, an, für
>
> ```text fill
> Die Ergebnisse beruhen [[auf]] einer Umfrage.
> Ich beziehe mich [[auf]] die Studie von Müller.
> Die Autorin setzt sich [[mit]] dem Ansatz auseinander.
> Der Begriff wird [[von]] „Migration“ abgegrenzt.
> ```
>
> **Пояснення:** *beruhen auf + Dat*, *sich beziehen auf + Akk*, *sich auseinandersetzen mit + Dat*, *abgrenzen von + Dat*. Дистрактори — типові кальки: ~~auseinandersetzen über~~, ~~beruhen an~~, ~~abgrenzen für~~.

> [!quiz] Заповни науковий текст
> level: C1 · type: fill · id: de-c1-wissenschaftssprache-q10 · bank: Begriff, Annahme, Methode
>
> ```text fill
> Im ersten Kapitel wird der [[Forschungsstand]] dargestellt.
> Die Arbeit schließt damit eine [[Forschungslücke]].
> Für die Studie wurden [[Daten]] von 500 Personen erhoben.
> Die [[Befunde]] deuten auf einen Zusammenhang hin.
> ```
>
> **Пояснення:** *den Forschungsstand darstellen*, *eine Forschungslücke schließen*, *Daten erheben*, *die Befunde deuten auf … hin*. *Begriff, Annahme, Methode* граматично могли б стояти поруч, але не утворюють цих колокацій (*~~eine Methode schließen~~*).

> [!quiz] Склади речення: «В основі дослідження лежить набір даних 2023 року.»
> level: C1 · type: order · id: de-c1-wissenschaftssprache-q11
>
> ```text order
> Der Studie
> liegt
> ein Datensatz von 2023
> zugrunde.
> Die Studie ✗
> ```
>
> **Пояснення:** *einer Sache zugrunde liegen* — з Dativ: ***der Studie** liegt … zugrunde*. Підмет — *ein Datensatz*. *Die Studie* у Nominativ зробило б речення неграматичним.

> [!quiz] Склади речення: «Авторка критично аналізує підхід.»
> level: C1 · type: order · id: de-c1-wissenschaftssprache-q12
>
> ```text order
> Die Autorin
> setzt sich
> kritisch
> mit dem Ansatz
> auseinander.
> über den Ansatz ✗
> ```
>
> **Пояснення:** *sich auseinandersetzen **mit** + Dat*; відокремлюваний префікс *auseinander* — у кінці речення. *Über* — калька з «розмірковувати про».

> [!quiz] «Es besteht eine Korrelation zwischen Eisverkauf und Sonnenbrand.» Який висновок коректний?
> level: C1 · type: single · id: de-c1-wissenschaftssprache-q13
> - [x] Beide hängen wohl von einer dritten Variablen ab: dem Sonnenschein.
> - [ ] Eis verursacht Sonnenbrand; das ist eine Kausalität.
> - [ ] Der Zusammenhang ist bewiesen und eindeutig kausal.
> - [ ] Eine Korrelation ist dasselbe wie eine Kausalität.
>
> **Пояснення:** класичний приклад: обидва показники зростають через третю змінну (*Variable*) — сонячну погоду. Кореляція не доводить причиновості (*Kausalität*).

> [!quiz] Ти хочеш написати, що результати ще не остаточні. Яке слово точне?
> level: C1 · type: single · id: de-c1-wissenschaftssprache-q14
> - [ ] widersprüchlich
> - [x] vorläufig
> - [ ] einschlägig
> - [ ] maßgeblich
>
> **Пояснення:** *vorläufig* — попередній. *Widersprüchlich* — суперечливий (інша думка: дані суперечать одне одному), *einschlägig* — профільний, *maßgeblich* — вирішальний.

## Фішки

> [!reel] 📚 Hausarbeit — і курсова, і прибирання
> *Die Hausarbeit* в університеті — письмова робота після семінару. Удома — це прання, прибирання й готування. Тож фраза *Ich habe noch viel Hausarbeit* без контексту двозначна. Шкільне «домашнє» — *die Hausaufgaben*.

> [!reel] 🍦 Морозиво й сонячні опіки
> Що більше продають морозива, то більше сонячних опіків. Значить, морозиво шкодить шкірі? Ні: обидва залежать від сонця. На німецьких семінарах це кажуть коротко: *Korrelation ist nicht gleich Kausalität.*

> [!reel] 🔎 Пропущені виноски, що зламали карʼєру
> 2011 року волонтери вікі-платформи GuttenPlag вручну порівнювали докторську міністра оборони з джерелами. За кілька тижнів він втратив ступінь і пішов у відставку. Відтоді «Plagiat» — одне з найвідоміших слів німецької наукової мови.

## Джерела та що почитати

- [DWDS — Befund](https://www.dwds.de/wb/Befund): значення в науці й медицині.
- [DWDS — Stichprobe](https://www.dwds.de/wb/Stichprobe): вибірка, вибіркова перевірка.
- [DWDS — erheben](https://www.dwds.de/wb/erheben): Daten erheben, Gebühren erheben.
- [DWDS — einschlägig](https://www.dwds.de/wb/einschl%C3%A4gig): значення й колокації.
- [Ombudsgremium für die wissenschaftliche Integrität in Deutschland — Kodex der DFG](https://wissenschaftliche-integritaet.de/kodex/): 19 настанов доброї наукової практики.
- [Wikipedia — Plagiatsaffäre Guttenberg](https://de.wikipedia.org/wiki/Plagiatsaff%C3%A4re_Guttenberg): хронологія, GuttenPlag Wiki, рішення Університету Байройта.

> [!important] Підсумок
> - Будова дослідження: *Forschungsstand → Forschungslücke → Ansatz / Theorie → Methode (Stichprobe, Erhebung) → Befunde → einordnen, gegenüberstellen*.
> - Розрізняй *Annahme* (припущення), *Hypothese* (перевіряють), *These* (обстоюють), *Theorie* (система пояснень).
> - Про емпіричні дані пиши обережно: *zeigen, belegen, hinweisen auf, sich ergeben aus*; *beweisen* — для логіки й математики.
> - Оцінюй результат точно: *signifikant, repräsentativ, vorläufig, eindeutig / widersprüchlich*; *qualitativ ↔ quantitativ*.
> - Прийменник — частина дієслова: *beruhen auf + Dat, sich beziehen auf + Akk, sich auseinandersetzen mit + Dat, abgrenzen von + Dat*.
> - Академічна чесність: кожна цитата — з джерелом і сторінкою, усе — у *Literaturverzeichnis*; *Plagiat* може коштувати ступеня.
