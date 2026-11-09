---
title: Письмо — стилістика й редагування
id: de-c2-stil
level: C2
icon: px:gem
tags: [deutsch, c2, skills, schreiben, stil, redigieren, umformung, goethe-c2, gds]
prerequisites: ["[[Deutsch - C1 - 19. Письмо — Erörterung, Stellungnahme, опис графіка]]", "[[Deutsch - C1 - 02. Nominalstil і Verbalstil — перетворення]]"]
estimatedMinutes: 50
---

# Письмо — стилістика й редагування

> [!success] Після цієї теми ти зможеш
> - виконувати **GDS Schreiben Teil 1**: переформулювати 10 фрагментів тексту з даним словом, не змінюючи його й зберігаючи зміст;
> - знаходити в тексті **штампи, повтори, плеоназми й Stilbruch** і замінювати їх точними формулюваннями;
> - писати **ясно й ритмічно**: дієслово замість ланцюга іменників, коротке поруч із довгим, термін без «елегантної варіації»;
> - редагувати власний текст **у чотири проходи**: зміст → будова → речення → слово й розділові знаки.

## Передбач

> [!quiz] Переформулюй, використавши слово **zur** (його не можна змінювати): *Viele Städte pflanzen mehr Bäume, um die Hitze im Sommer zu verringern.* Яке рішення правильне?
> level: C2 · type: single · id: de-c2-stil-q01
> - [x] Viele Städte pflanzen zur Verringerung der Hitze im Sommer mehr Bäume.
> - [ ] Viele Städte pflanzen zur Verringerung die Hitze im Sommer mehr Bäume.
> - [ ] Viele Städte pflanzen zur Verringern der Hitze im Sommer mehr Bäume.
> - [ ] Viele Städte pflanzen mehr Bäume, zur die Hitze im Sommer zu verringern.
>
> **Пояснення:** *um … zu* + дієслово → *zur* + іменник на *-ung* + **Genitiv**: *zur Verringerung **der** Hitze*. Друге рішення — хибний відмінок (Akkusativ *die*), третє — хибний рід: від дієслова-іменника буде *zum Verringern*, а *zur* вимагає жіночого роду. Четверте змішує дві конструкції. Саме такі перетворення — суть GDS Schreiben Teil 1.

## Пояснення

### Формат Schreiben на GDS

**Goethe-Zertifikat C2: GDS — Schreiben** (80 хв, 2 частини; можна починати з будь-якої; словники заборонені):

| Teil | Завдання | Обсяг | Час | Бали |
|---|---|---|---|---|
| 1 | короткий текст (напр. *Kurzreferat*) з **10 позначеними фрагментами**; кожен переписати з даним словом, яке **не можна змінювати**, і зробити всі потрібні перетворення | 10 фрагментів | 20 хв | 2 / 1 / 0 за кожен = 20 |
| 2 | один текст з 4 тем: 2 «вільні» (лист чи e-mail до редакції щодо трьох тверджень) і 2 літературні (рецензія на роман зі списку) | ≈ 350 слів | 60 хв | 5 критеріїв × 4 бали × 4 = 80 |

Модуль — зі 100 балів, поріг — 60. Teil 2 розбираємо в [[Deutsch - C2 - 16. Письмо — рецензія, лист до редакції, коментар, есе]]; ця тема — про **Teil 1** і про стиль, без якого не буде високих балів за критерій «Wortwahl und Stil» у Teil 2.

> [!note] Джерело формату
> *Modellsatz* GDS (оновлено в березні 2026) і *Durchführungsbestimmungen* C2 (від 1 вересня 2025). Тексти й завдання тут — власні: модельний текст Goethe не копіюємо.

### Teil 1: шість типових перетворень

У Teil 1 тобі дають слово — і ти мусиш перебудувати навколо нього речення. Майже всі завдання зводяться до кількох моделей з C1:

| Тип | Було | Слово | Стало |
|---|---|---|---|
| мета: дієслово → іменник | *um die Hitze zu verringern* | **zur** | *zur Verringerung der Hitze* |
| причина: підрядне → прийменник | *weil die Mieten steigen* | **aufgrund** | *aufgrund der steigenden Mieten* |
| поступка | *obwohl es regnete* | **trotz** | *trotz des Regens* |
| Passiversatz | *Man kann das leicht messen.* | **lässt** | *Das lässt sich leicht messen.* |
| модальність | *Das muss man beachten.* | **ist** | *Das ist zu beachten.* |
| дієслівно-іменна сполука | *Die Eltern zweifelten daran.* | **Zweifel** | *Die Eltern hatten Zweifel daran.* |
| дієслово ↔ прикметник / іменник | *Es wurde klar, dass …* | **Klarheit** | *Man gewann Klarheit darüber, dass …* |
| лексична заміна | *Alle stimmten zu.* | **einverstanden** | *Alle waren einverstanden.* |

> [!diagram] Teil 1: як працювати з даним словом
> ```yaml
> layout: flow
> nodes:
>   - { id: s1, label: "1 · Зміст", text: "що саме каже фрагмент?", note: "час, модальність, заперечення", tone: yellow }
>   - { id: s2, label: "2 · Слово", text: "яку граматику воно вимагає?", note: "відмінок, прийменник, рід", tone: pink }
>   - { id: s3, label: "3 · Перебудова", text: "нове речення навколо слова", note: "слово не змінюємо", tone: yellow }
>   - { id: s4, label: "4 · Перевірка", text: "зміст той самий? речення звʼязне?", note: "порядок слів, узгодження", tone: gray }
> edges:
>   - { from: s1, to: s2 }
>   - { from: s2, to: s3 }
>   - { from: s3, to: s4 }
> steps:
>   - { focus: s1, note: "Спершу зміст: час (waren → не можна писати sind), модальність (kann, muss), заперечення. Усе це має лишитися." }
>   - { focus: s2, note: "Подумай, що вимагає дане слово: zur — Genitiv після іменника; aufgrund, trotz — Genitiv; lässt — sich + інфінітив; Zweifel — haben / hegen + an + Dat." }
>   - { focus: s3, note: "Будуй нове речення навколо слова. Саме слово не можна змінювати: якщо дано Zweifel, ~~zweifelten~~ дасть 0 балів." }
>   - { focus: s4, note: "Перечитай фрагмент у контексті: чи стоїть дієслово там, де треба, чи узгоджено закінчення, чи не загубився відтінок (лише, вже, майже)." }
> ```
> Чотири кроки пронумеровано; кольори лише розділяють сусідні блоки.

### Ясність: пʼять правил редактора

1. **Дієслово сильніше за іменник.** *Die Durchführung der Überprüfung erfolgt durch die Behörde* → *Die Behörde prüft.* Nominalstil доречний у праві й науці, але в листі чи рецензії він робить текст **schwerfällig**.
2. **Одна думка — одне речення.** Якщо між *hat* і *überarbeitet* стоять 15 слів, читач губить нитку: винеси підрядне за дужку (*Sie hat das Manuskript überarbeitet, das …*).
3. **Ритм.** Чергуй довгі речення з короткими. Коротке після довгого — найсильніше місце абзацу.
4. **Термін не варіюємо.** У шкільному українському творі вчать «не повторюй слово». У німецькому фактичному тексті повтор терміна — це **точність**: якщо ти почав з *Lernende*, не переходь на *Schüler*, *Kinder* і *junge Menschen*, бо читач подумає, що йдеться про різні групи.
5. **Конкретне замість порожнього.** *Worthülsen* на кшталт *im Bereich der Bildung*, *eine wichtige Rolle spielen*, *in der heutigen Zeit* займають місце, але нічого не кажуть: *im Bereich der Bildung* → *in Schulen*.

### Що вирізає редактор

| Проблема | Приклад | Краще |
|---|---|---|
| **Pleonasmus** — повтор значення | *bereits schon, zusammenaddieren, ein weißer Schimmel* | *bereits, addieren, ein Schimmel* |
| **Redundanz** — те саме двічі | *Abschließend lässt sich zum Schluss sagen …* | *Abschließend lässt sich sagen …* |
| **Floskel / Worthülse** | *In der heutigen Zeit spielt das Thema eine immer wichtigere Rolle.* | *Seit 2020 arbeiten doppelt so viele Menschen im Homeoffice.* |
| **Stilbruch** — різкий перехід регістру | *Die Reform ist aus meiner Sicht echt mega daneben.* | *Die Reform halte ich für verfehlt.* |
| **geschraubt** — штучно «високо» | *Es erscheint mir als nicht gänzlich ausgeschlossen, dass …* | *Vielleicht …* |
| **blumig** — забагато прикрас | *das zauberhafte, unvergessliche, märchenhafte Erlebnis* | *ein Erlebnis, das ich nicht vergessen werde* |
| **Nominalkette** | *zur Sicherstellung der Einhaltung der Vorgaben* | *damit die Vorgaben eingehalten werden* |

### Зразок: до і після редагування

> [!example] Rohfassung
> In der heutigen Zeit spielt das Thema Lesen eine immer wichtigere Rolle. Bezüglich der Durchführung von Leseförderung in Schulen ist festzustellen, dass die Schüler, die Kinder und die jungen Menschen oftmals bereits schon nach kurzer Zeit die Motivation verlieren, was echt schade ist, und somit eine Steigerung der Lesekompetenz nicht erreicht werden kann.

> [!example] Endfassung
> Wer liest, lernt besser – das ist bekannt. Trotzdem verlieren viele Schülerinnen und Schüler schon nach wenigen Wochen die Lust an den Leseprogrammen ihrer Schulen. Warum? Weil die Texte selten mit ihrem Alltag zu tun haben.

Що змінилося: прибрано штамп (*In der heutigen Zeit … eine immer wichtigere Rolle*), ланцюг іменників (*Bezüglich der Durchführung von …*), «варіацію» трьох назв однієї групи, плеоназм *bereits schon* і розмовне *echt schade* (Stilbruch). Одне довге речення стало трьома різної довжини; коротке питання *Warum?* дає ритм. Конкретика (*nach wenigen Wochen*, *mit ihrem Alltag*) замінила загальні слова.

### Редагування в чотири проходи

| Прохід | Питання | Типові дії |
|---|---|---|
| 1 · **Inhalt** | Чи виконано всі пункти завдання? Чи є головна думка? | дописати пункт, викреслити зайвий абзац |
| 2 · **Aufbau** | Чи логічний порядок? Чи видно переходи? | переставити абзаци, додати сполучні фрази |
| 3 · **Satz** | Чи не задовгі речення? Чи не розірвано дужку надто широко? | розбити, винести за дужку, дієслово замість іменника |
| 4 · **Wort & Zeichen** | Термін один? Немає штампів? Коми, артиклі, закінчення? | замінити, викреслити, перевірити кому перед *dass, weil, um … zu* |

> [!tip] Коми, які найчастіше пропускають або ставлять зайві
> - *um … zu, ohne … zu, statt … zu, außer … zu, als … zu* — **кома обовʼязкова**: *Sie kam, um zu helfen.*
> - Порівняння з *als / wie* без речення — **без коми**: *Sie schreibt besser als ich.* *So schnell wie möglich.*
> - Перед *und / oder* у переліку — без коми: *Bücher, Zeitungen und Briefe.*

## Приклади

- *Der Text liest sich flüssig, ist aber an einigen Stellen zu weitschweifig.* — Текст читається легко, але подекуди надто розлогий.
- *Bitte straffen Sie den zweiten Absatz.* — Будь ласка, скоротіть другий абзац.
- *Diesen Satz würde ich ersatzlos streichen.* — Це речення я б просто викреслила.
- *Kannst du meine Bewerbung Korrektur lesen?* — Можеш вичитати мою заяву?
- *Die Rohfassung war doppelt so lang wie die Endfassung.* — Чернетка була вдвічі довша за остаточний варіант.
- *Die These müssen Sie präzisieren: Wer genau ist «man»?* — Тезу треба уточнити: хто саме «man»?
- *Der Ausdruck «echt mega» ist in einem Leserbrief ein Stilbruch.* — Вислів «echt mega» в листі до редакції — стилістичний збій.
- *Ihr Stil ist nüchtern und prägnant.* — Її стиль тверезий і влучний.
- *Das Manuskript geht nächste Woche ins Lektorat.* — Рукопис наступного тижня йде на редагування у видавництві.
- *Eine Nominalisierung ist hier unnötig: Schreiben Sie einfach «wir prüfen».* — Номіналізація тут зайва: напишіть просто «wir prüfen».

## Слова

### Робота над текстом

> [!word] die Überarbeitung
> ipa: /yːbɐˈʔaʁbaɪ̯tʊŋ/ · pos: noun · level: B2 · id: de-c2-stil-w01
> uk: переробка, доопрацювання (тексту)
> forms: die Überarbeitungen
> example: Nach der **Überarbeitung** ist der Text um ein Drittel kürzer. — Після доопрацювання текст став на третину коротшим.
> note: -ung → die. Також die überarbeitete Auflage — перероблене видання.

> [!word] überarbeiten
> ipa: /yːbɐˈʔaʁbaɪ̯tn̩/ · pos: verb · level: B2 · id: de-c2-stil-w02
> uk: переробляти, доопрацьовувати
> forms: überarbeiten → überarbeitete → hat überarbeitet
> example: Sie **überarbeitet** ihren Essay zum dritten Mal. — Вона втретє доопрацьовує свій есей.
> note: невідокремлюване, наголос на -ar-. sich überarbeiten — перепрацювати, перевтомитися.

> [!word] der Entwurf
> ipa: /ɛntˈvʊʁf/ · pos: noun · level: B2 · id: de-c2-stil-w03
> uk: чернетка, проєкт, начерк
> forms: die Entwürfe
> example: Schick mir den **Entwurf**, ich schaue ihn mir an. — Надішли мені чернетку, я подивлюся.
> note: від entwerfen. Також der Gesetzentwurf — законопроєкт.

> [!word] die Rohfassung
> ipa: /ˈʁoːfasʊŋ/ · pos: noun · level: C1 · id: de-c2-stil-w04
> uk: чорновий варіант
> forms: die Rohfassungen
> example: Die **Rohfassung** darf ruhig zu lang sein. — Чорновий варіант цілком може бути задовгим.
> note: roh — сирий + die Fassung — редакція. Протилежне: die Endfassung.

> [!word] redigieren
> ipa: /ʁediˈɡiːʁən/ · pos: verb · level: C2 · id: de-c2-stil-w05
> uk: редагувати (текст)
> forms: redigieren → redigierte → hat redigiert
> example: Der Artikel wurde stark **redigiert**. — Статтю сильно відредагували.
> note: g тут [ɡ], не «дж». Хто це робить — der Redakteur (газета), der Lektor (видавництво).

> [!word] das Lektorat
> ipa: /lɛktoˈʁaːt/ · pos: noun · level: C2 · id: de-c2-stil-w06
> uk: редагування у видавництві; редакторський відділ
> forms: die Lektorate
> example: Das **Lektorat** hat viele Wiederholungen gefunden. — Редакція видавництва знайшла багато повторів.
> note: der Lektor, die Lektorin — видавничий редактор або викладач мови в університеті, а не «лектор».

> [!word] straffen
> ipa: /ˈʃtʁafn̩/ · pos: verb · level: C1 · id: de-c2-stil-w07
> uk: скорочувати, ущільнювати (текст)
> forms: straffen → straffte → hat gestrafft
> example: Den Mittelteil solltest du etwas **straffen**. — Середню частину варто трохи ущільнити.
> note: від straff — тугий, натягнутий. Текст стає коротшим, але зміст лишається.

> [!word] streichen
> ipa: /ˈʃtʁaɪ̯çn̩/ · pos: verb · level: B2 · id: de-c2-stil-w08
> uk: викреслювати; фарбувати; намазувати
> forms: streichen → strich → hat gestrichen
> example: **Streich** alle Adjektive, die nichts Neues sagen. — Викресли всі прикметники, що не кажуть нічого нового.
> note: ersatzlos streichen — викреслити без заміни. Інші значення: die Wand streichen, Butter aufs Brot streichen.

> [!word] präzisieren
> ipa: /pʁɛtsiˈziːʁən/ · pos: verb · level: C1 · id: de-c2-stil-w09
> uk: уточнювати
> forms: präzisieren → präzisierte → hat präzisiert
> example: Könnten Sie Ihre Frage **präzisieren**? — Чи могли б ви уточнити своє питання?
> note: z = [ts], друге s дзвінке. Прикметник präzise.

> [!word] umformulieren
> ipa: /ˈʊmfɔʁmuliːʁən/ · pos: verb · level: C1 · id: de-c2-stil-w10
> uk: переформульовувати
> forms: umformulieren → formulierte um → hat umformuliert
> example: Ich würde den letzten Satz **umformulieren**. — Я б переформулював останнє речення.
> note: відокремлюване: er formuliert um; але дієприкметник без ge-: umformuliert.

> [!word] Korrektur lesen
> ipa: /kɔʁɛkˈtuːɐ̯ ˈleːzn̩/ · pos: phrase · level: C1 · id: de-c2-stil-w11
> uk: вичитувати (текст на помилки)
> forms: Korrektur lesen → las Korrektur → hat Korrektur gelesen
> example: Meine Kollegin hat den Bericht **Korrektur gelesen**. — Моя колега вичитала звіт.
> note: Korrektur — з великої. Іменник: das Korrekturlesen.

> [!word] die Umformung
> ipa: /ˈʊmfɔʁmʊŋ/ · pos: noun · level: C1 · id: de-c2-stil-w12
> uk: перетворення, трансформація (речення)
> forms: die Umformungen
> example: Nehmen Sie alle notwendigen **Umformungen** vor. — Зробіть усі потрібні перетворення.
> note: типове формулювання завдань GDS і DSH. Дієслово umformen (відокремлюване).

### Оцінка стилю

> [!word] prägnant
> ipa: /pʁɛˈɡnant/ · pos: adj · level: C1 · id: de-c2-stil-w13
> uk: влучний, стислий і чіткий
> example: Fassen Sie die These **prägnant** zusammen. — Сформулюйте тезу стисло й чітко.
> note: g і n — окремі звуки [ɡn]. Похвала стилю: knapp und prägnant.

> [!word] weitschweifig
> ipa: /ˈvaɪ̯tʃvaɪ̯fɪç/ · pos: adj · level: C2 · id: de-c2-stil-w14
> uk: розлогий, багатослівний
> example: Die Einleitung ist zu **weitschweifig**. — Вступ надто розлогий.
> note: пор. abschweifen — відхилятися від теми. Протилежне: knapp, prägnant.

> [!word] schwerfällig
> ipa: /ˈʃveːɐ̯fɛlɪç/ · pos: adj · level: C1 · id: de-c2-stil-w15
> uk: важкий, неповороткий (про стиль, рухи)
> example: Die vielen Nominalketten machen den Text **schwerfällig**. — Через ланцюги іменників текст стає важким.
> note: також про людину: ein schwerfälliger Gang — важка хода.

> [!word] holprig
> ipa: /ˈhɔlpʁɪç/ · pos: adj · level: C1 · id: de-c2-stil-w16
> uk: незграбний, «кострубатий» (про стиль); вибоїстий
> example: Die Übersetzung liest sich etwas **holprig**. — Переклад читається трохи незграбно.
> note: буквально про дорогу з вибоїнами. Протилежне: flüssig.

> [!word] geschraubt
> ipa: /ɡəˈʃʁaʊ̯pt/ · pos: adj · level: C2 · id: de-c2-stil-w17
> uk: манірний, штучно «високий»
> example: Schreib nicht so **geschraubt**, schreib einfach, was du meinst. — Не пиши так манірно, пиши просто, що маєш на увазі.
> note: від schrauben — закручувати. Синонім: gestelzt. b перед t — [p].

> [!word] nüchtern
> ipa: /ˈnʏçtɐn/ · pos: adj · level: C1 · id: de-c2-stil-w18
> uk: тверезий, стриманий, діловий (стиль); натщесерце
> example: Der Bericht ist **nüchtern** und sachlich geschrieben. — Звіт написано тверезо й по-діловому.
> note: інші значення: тверезий (не пʼяний) і натщесерце (nüchtern zur Blutabnahme kommen).

> [!word] schnörkellos
> ipa: /ˈʃnœʁkl̩loːs/ · pos: adj · level: C2 · id: de-c2-stil-w19
> uk: простий, без прикрас
> example: Ihr **schnörkelloser** Stil passt gut zum Thema. — Її простий стиль без прикрас добре пасує до теми.
> note: der Schnörkel — завиток, оздоба. Похвала в рецензіях.

> [!word] blumig
> ipa: /ˈbluːmɪç/ · pos: adj · level: C1 · id: de-c2-stil-w20
> uk: квітчастий, надто прикрашений
> example: Die Beschreibung ist mir zu **blumig**. — Як на мене, опис надто квітчастий.
> note: від die Blume. У стилістиці — критика: забагато епітетів і метафор.

> [!word] die Redundanz
> ipa: /ʁedʊnˈdants/ · pos: noun · level: C2 · id: de-c2-stil-w21
> uk: надмірність, зайвий повтор
> forms: die Redundanzen
> example: Kürzen Sie die **Redundanzen** im Schlussteil. — Приберіть зайві повтори в завершальній частині.
> note: прикметник redundant. У техніці — резервування (позитивне значення).

> [!word] der Pleonasmus
> ipa: /pleoˈnasmʊs/ · pos: noun · level: C2 · id: de-c2-stil-w22
> uk: плеоназм
> forms: die Pleonasmen
> example: «Bereits schon» ist ein typischer **Pleonasmus**. — «Bereits schon» — типовий плеоназм.
> note: e і o читають окремо: ple-o-nas-mus. -ismus/-asmus → der.

> [!word] der Stilbruch
> ipa: /ˈʃtiːlbʁʊx/ · pos: noun · level: C2 · id: de-c2-stil-w23
> uk: стилістичний збій, змішання стилів
> forms: die Stilbrüche
> example: Ein Jugendwort in einem Bewerbungsschreiben ist ein **Stilbruch**. — Молодіжне слово в листі-заяві — це стилістичний збій.
> note: der Stil + der Bruch. Свідомий Stilbruch — прийом гумору й сатири.

> [!word] die Worthülse
> ipa: /ˈvɔʁthʏlzə/ · pos: noun · level: C2 · id: de-c2-stil-w24
> uk: порожня фраза, слово без змісту
> forms: die Worthülsen
> example: Die Rede bestand nur aus **Worthülsen**. — Промова складалася лише з порожніх фраз.
> note: die Hülse — гільза, оболонка. Близько: die Floskel, die Phrase.

### Мова й форма

> [!word] die Wortwahl
> ipa: /ˈvɔʁtvaːl/ · pos: noun · level: C1 · id: de-c2-stil-w25
> uk: вибір слів, лексика
> forms: — (без множини)
> example: Die **Wortwahl** ist der Textsorte angemessen. — Лексика відповідає жанру тексту.
> note: критерій оцінки на GDS: «Sind Wortwahl und Stil … angemessen?»

> [!word] der Satzbau
> ipa: /ˈzatsbaʊ̯/ · pos: noun · level: B2 · id: de-c2-stil-w26
> uk: будова речення, синтаксис
> forms: — (без множини)
> example: Achte auf einen abwechslungsreichen **Satzbau**. — Стеж за різноманітною будовою речень.
> note: z = [ts]. Близько: die Syntax (термін).

> [!word] die Lesbarkeit
> ipa: /ˈleːsbaːɐ̯kaɪ̯t/ · pos: noun · level: C1 · id: de-c2-stil-w27
> uk: читабельність
> forms: — (без множини)
> example: Kurze Absätze verbessern die **Lesbarkeit**. — Короткі абзаци покращують читабельність.
> note: -keit → die. Також про почерк: die Lesbarkeit der Handschrift.

> [!word] der Lesefluss
> ipa: /ˈleːzəˌflʊs/ · pos: noun · level: C1 · id: de-c2-stil-w28
> uk: плавність читання
> forms: — (без множини)
> example: Die vielen Klammern stören den **Lesefluss**. — Численні дужки заважають плавно читати.
> note: lesen + der Fluss. Типове зауваження редактора.

> [!word] die Nominalisierung
> ipa: /nominaliˈziːʁʊŋ/ · pos: noun · level: C1 · id: de-c2-stil-w29
> uk: номіналізація, перетворення на іменник
> forms: die Nominalisierungen
> example: Zu viele **Nominalisierungen** machen den Text schwer lesbar. — Забагато номіналізацій ускладнюють читання.
> note: протилежне: die Verbalisierung. Тема C1-02: Nominalstil і Verbalstil.

> [!word] die Zeichensetzung
> ipa: /ˈtsaɪ̯çn̩ˌzɛtsʊŋ/ · pos: noun · level: B2 · id: de-c2-stil-w30
> uk: пунктуація
> forms: — (без множини)
> example: Die **Zeichensetzung** prüfe ich ganz zum Schluss. — Пунктуацію я перевіряю в самому кінці.
> note: das Zeichen + setzen. Синонім: die Interpunktion. Кома — das Komma.

> [!word] das Semikolon
> ipa: /zemiˈkoːlɔn/ · pos: noun · level: C1 · id: de-c2-stil-w31
> uk: крапка з комою
> forms: die Semikolons
> example: Ein **Semikolon** trennt stärker als ein Komma, aber schwächer als ein Punkt. — Крапка з комою розділяє сильніше за кому, але слабше за крапку.
> note: також мн. die Semikola. s на початку дзвінке [z].

## Слухаємо

> [!listen] Напиши або скажи, що почув
> level: C2 · type: dictation · id: de-c2-stil-l01
> audio: Diesen Satz würde ich ersatzlos streichen, er sagt nichts Neues.
> explain: *ersatzlos streichen* — викреслити без заміни; *würde … streichen* — ввічлива порада в Konjunktiv II. Кома перед другим головним реченням.

## Вимова

> [!speak] Скажи вголос: порада редактора
> level: C2 · id: de-c2-stil-s01
> text: Der Text ist prägnant, aber an einigen Stellen etwas holprig.
> ipa: /deːɐ̯ tɛkst ɪst pʁɛˈɡnant ˈaːbɐ an ˈaɪ̯nɪɡn̩ ˈʃtɛlən ˈɛtvas ˈhɔlpʁɪç/
> tip: *prägnant* — наголос на останньому складі, g і n вимовляй окремо; *holprig* — у кінці мʼяке [ç], а не «к».
> uk: Текст влучний, але подекуди трохи незграбний.

## Типові помилки українців

> [!pitfall] «Не повторюй слово» — не для німецького фактичного тексту
> Українська шкільна звичка — замінювати повтор синонімом: *die Schüler … die Kinder … die jungen Menschen … die Lernenden*. У німецькому звіті, листі до редакції чи науковому тексті читач подумає, що це **чотири різні групи**. Термін тримай незмінним; варіюй дієслова й будову речень, а не назву предмета.

> [!pitfall] Кома перед als і wie, як в українській
> ~~Sie schreibt besser, als ich.~~ → *Sie schreibt besser als ich.* В українській перед «ніж» і «як» у порівнянні кома часто стоїть, у німецькій перед *als / wie* без дієслова — ні. Кома потрібна, лише якщо після *als / wie* іде речення з дієсловом: *Sie schreibt besser, als ich dachte.*

> [!pitfall] Teil 1: змінене дане слово — 0 балів
> Дано **Zweifel**, а ти пишеш *Die Eltern zweifelten daran* — граматично правильно, але завдання не виконано, бо слово змінено. Так само дано **lässt**, а в тебе *ließ*. Слово з правого стовпця копіюй **точно**, а змінюй усе навколо нього.

> [!pitfall] Канцелярит з української
> «Здійснюється проведення перевірки» дослівно дає ~~Es erfolgt die Durchführung einer Überprüfung~~ — граматично можливо, але так пише хіба Behörde. У листі, рецензії чи коментарі: *Wir prüfen …* / *Die Stadt prüft …* Номінальний стиль лишай для права й науки, де він справді доречний.

## Ситуація: консультація в редакторки

> [!listen] Авторка обговорює з редакторкою видавництва свій рукопис. Що радить редакторка?
> level: C2 · type: answer · id: de-c2-stil-l02
> audio: A: Ehrlich gesagt finde ich den zweiten Teil zu weitschweifig. Da wiederholen Sie dreimal dasselbe.
> audio: B: Soll ich ihn ganz streichen?
> audio: A: Nein, straffen reicht. Und bleiben Sie bei einem Begriff: Mal heißt es Patienten, mal Kranke, mal Betroffene.
> - [x] Скоротити другу частину, а не викидати її, і вживати один термін замість трьох.
> - [ ] Повністю викреслити другу частину.
> - [ ] Додати більше синонімів, щоб текст звучав різноманітніше.
> - [ ] Нічого не змінювати: повтори роблять текст переконливішим.
>
> **Пояснення:** *straffen reicht* — досить ущільнити (не *ganz streichen*); *Bleiben Sie bei einem Begriff* — тримайтеся одного терміна. Переклад: — Чесно кажучи, друга частина, як на мене, надто розлога. Там ви тричі повторюєте те саме. — Мені її повністю викреслити? — Ні, досить ущільнити. І тримайтеся одного поняття: то «пацієнти», то «хворі», то «ті, кого це стосується».

> [!speak] Ситуація: попроси вичитати текст
> level: C2 · id: de-c2-stil-s02
> text: Könntest du meinen Leserbrief Korrektur lesen, bevor ich ihn abschicke?
> ipa: /ˈkœntəst duː ˈmaɪ̯nən ˈleːzɐbʁiːf kɔʁɛkˈtuːɐ̯ ˈleːzn̩ bəˈfoːɐ̯ ɪç iːn ˈapʃɪkə/
> tip: *Korrektur* — наголос на -tur; *abschicke* — b перед sch звучить як [p]; *bevor* — наголос на другому складі.
> uk: Можеш вичитати мій лист до редакції, перш ніж я його надішлю?

## Landeskunde: Wer bestimmt, wie man richtig schreibt?

> [!example] Wer bestimmt, wie man richtig schreibt?
> Wer im deutschen Sprachraum wissen will, ob man „aufgrund“ oder „auf Grund“ schreibt, schlägt meist im Duden nach. Viele halten den Duden deshalb für die offizielle Instanz der deutschen Rechtschreibung. Das war er tatsächlich einmal, ist er aber heute nicht mehr. Im November 1955 erklärten die Kultusminister der westdeutschen Länder den Duden in allen Zweifelsfällen der Rechtschreibung für verbindlich. Dieses sogenannte Duden-Privileg galt mehr als vierzig Jahre lang und wurde erst im Zuge der Rechtschreibreform von 1996 aufgehoben (Beschluss der KMK 1995, Wiener Absichtserklärung 1996, in Kraft seit August 1998).
>
> Seitdem gibt es ein amtliches Regelwerk, das nicht ein Verlag, sondern die staatlichen Stellen der deutschsprachigen Länder in Kraft setzen. Die Reform war von Anfang an umstritten. Eltern, Lehrkräfte und Schriftsteller protestierten, über die neuen Regeln wurde vor Gericht gestritten, und einige große Zeitungen, unter ihnen die „Frankfurter Allgemeine Zeitung“, kehrten zeitweise sogar zur alten Schreibung zurück. Für viele Menschen ging es dabei um mehr als um Kommas und Doppel-s: Sie empfanden es als Zumutung, dass der Staat ihnen vorschreiben wollte, wie sie ihre eigene Sprache zu schreiben hätten. Um den Streit zu beruhigen, wurde 2004 der Rat für deutsche Rechtschreibung eingerichtet. Er hat heute 41 Mitglieder aus sieben Ländern und Regionen, neben Deutschland, Österreich und der Schweiz zum Beispiel auch aus Liechtenstein und Südtirol. Zu ihnen gehören Wissenschaftlerinnen und Wissenschaftler, aber auch Sprachpraktiker, etwa aus Verlagen, Schulen und Redaktionen.
>
> Mit den Änderungen von 2006 schloss der Rat seine erste Arbeitsphase ab; seither beobachtet er vor allem, wie sich das tatsächliche Schreiben entwickelt. Seine Vorschläge zur Anpassung des Regelwerks wurden 2011, 2017 und zuletzt 2024 veröffentlicht. Die aktuelle Fassung ist seit dem 1. Juli 2024 verbindlich. Das Wörterverzeichnis darin umfasst mehrere Tausend Einträge. Bei manchen Wörtern sind zwei Schreibungen gleichberechtigt erlaubt, zum Beispiel „aufgrund“ und „auf Grund“ oder „Biografie“ und „Biographie“.
>
> Verbindlich ist dieses Regelwerk allerdings nur für Schulen und Behörden. Wer privat einen Roman, einen Leserbrief oder eine E-Mail schreibt, darf schreiben, wie er möchte. Verlage und Zeitungen legen deshalb oft eigene Hausregeln fest, damit ihre Texte einheitlich aussehen. Wo das Regelwerk Varianten zulässt, entscheidet dann das Lektorat, welche Form im ganzen Buch gilt. Für eine Prüfung wie das Goethe-Zertifikat C2 bedeutet das: Beide erlaubten Varianten sind richtig, aber ein Text wirkt sorgfältiger, wenn er sich für eine entscheidet und sie konsequent beibehält.
>
> Der Duden ist trotzdem nicht überflüssig geworden. Er richtet sich nach dem amtlichen Regelwerk und gibt bei Varianten eine Empfehlung, die gelb markiert ist. Außerdem verzeichnet er viel mehr Wörter, als das amtliche Wörterverzeichnis enthält, und informiert über Bedeutung, Herkunft und Grammatik. Für Fragen des Stils, die keine Regel entscheiden kann, bleibt ohnehin das eigene Urteil gefragt. Ob ein Satz zu lang, ein Wort zu blumig oder ein Absatz überflüssig ist, steht in keinem Regelwerk. Das lernt man nur, indem man viel liest, eigene Texte mit Abstand noch einmal prüft und sich nicht scheut, ganze Passagen zu streichen.

> [!quiz] Nach dem Text: Welche Aussage über den Duden stimmt heute?
> level: C2 · type: single · id: de-c2-stil-q02
> - [ ] Er ist bis heute die einzige verbindliche Instanz der Rechtschreibung.
> - [x] Er war bis 1996 in Zweifelsfällen verbindlich, folgt heute aber dem amtlichen Regelwerk.
> - [ ] Er wurde 2004 durch den Rat für deutsche Rechtschreibung ersetzt und erscheint nicht mehr.
> - [ ] Er verzeichnet nur die Wörter des amtlichen Wörterverzeichnisses.
>
> **Пояснення:** *Duden-Privileg* діяло з 1955 до 1996 року; тепер *Er richtet sich nach dem amtlichen Regelwerk*. Рада не замінила Duden, а Duden містить *viel mehr Wörter* за кілька тисяч статей офіційного словника.

> [!quiz] Nach dem Text: Was stimmt über den Rat für deutsche Rechtschreibung? Wähle alle richtigen Aussagen.
> level: C2 · type: multi · id: de-c2-stil-q03
> - [x] Er wurde 2004 eingerichtet.
> - [x] Seine Mitglieder kommen aus sieben Ländern und Regionen.
> - [x] Die aktuelle Fassung seines Regelwerks ist seit Juli 2024 verbindlich.
> - [ ] Er schreibt allen Menschen vor, wie sie privat schreiben müssen.
>
> **Пояснення:** 2004, 41 член із семи країн і регіонів, чинна редакція — з 1 липня 2024 року. Обовʼязкові правила — *nur für Schulen und Behörden*; приватно кожен пише, як хоче.

> [!quiz] Nach dem Text: Was empfiehlt der Text für Varianten wie „aufgrund“ und „auf Grund“?
> level: C2 · type: single · id: de-c2-stil-q04
> - [ ] Nur „auf Grund“ ist richtig, weil es älter ist.
> - [ ] Man sollte beide Formen abwechselnd benutzen, damit der Text lebendig wirkt.
> - [x] Beide sind erlaubt, aber man sollte sich für eine entscheiden und sie im ganzen Text beibehalten.
> - [ ] Man muss immer die gelb markierte Duden-Empfehlung verwenden.
>
> **Пояснення:** *Beide erlaubten Varianten sind richtig, aber ein Text wirkt sorgfältiger, wenn er sich für eine entscheidet und sie konsequent beibehält.* Рекомендація Duden — порада, а не обовʼязок.

## Практика

> [!quiz] Що правда про GDS Schreiben? Обери всі.
> level: C2 · type: multi · id: de-c2-stil-q05
> - [x] Teil 1 триває 20 хвилин і має 10 фрагментів для переформулювання.
> - [x] Дане слово в Teil 1 не можна змінювати.
> - [x] Teil 2 важить більше: максимум 80 зі 100 балів.
> - [ ] У Teil 1 треба написати текст на ≈ 350 слів.
> - [ ] Можна користуватися словником синонімів.
>
> **Пояснення:** Teil 1 — 20 хв, 10 фрагментів, 2 / 1 / 0 балів кожен (разом 20); Teil 2 — 60 хв, ≈ 350 слів, до 80 балів. Словники заборонені.

> [!quiz] Яка версія найясніша для листа до редакції?
> level: C2 · type: single · id: de-c2-stil-q06
> - [ ] Hinsichtlich der Durchführung der Sanierung erfolgt seitens der Stadt keine Information der Anwohner.
> - [x] Die Stadt informiert die Anwohner nicht darüber, wann sie die Brücke saniert.
> - [ ] Bezüglich der Sanierungsdurchführung ist eine Nichtinformation der Anwohner festzustellen.
> - [ ] In der heutigen Zeit spielt die Information der Anwohner bei Sanierungen eine immer wichtigere Rolle.
>
> **Пояснення:** друга версія — дієслово (*informiert*), конкретний діяч (*die Stadt*), конкретний предмет (*die Brücke*). Перша й третя — ланцюги іменників (*Hinsichtlich der Durchführung …, Nichtinformation*). Четверта — штамп без конкретного змісту.

> [!quiz] Teil 1: заверши переформулювання (дане слово вже стоїть у новому реченні)
> level: C2 · type: fill · id: de-c2-stil-q07 · bank: steigende, kann, hat
>
> ```text fill
> weil die Temperaturen steigen → aufgrund der [[steigenden]] Temperaturen
> Man kann den Effekt leicht messen. → Der Effekt [[lässt]] sich leicht messen.
> Das muss man berücksichtigen. → Das [[ist]] zu berücksichtigen.
> Die Stadt zweifelte daran. → Die Stadt hatte [[Zweifel]] daran.
> ```
>
> **Пояснення:** *aufgrund* + Genitiv множини: *der steigend**en** Temperaturen* (*steigende* — хибне закінчення). Passiversatz *sich lassen*: *Der Effekt lässt sich messen* (*kann sich messen* — неграматично). *sein + zu* + інфінітив = обовʼязок (*hat zu* вимагає діяча: *Man hat das zu berücksichtigen*). *zweifeln an* → *Zweifel haben an* + Dat.

> [!quiz] У Teil 1 дано слово **Zweifel** для фрагмента *Viele Eltern zweifelten am Nutzen des Projekts.* Яке рішення дасть бали?
> level: C2 · type: single · id: de-c2-stil-q08
> - [ ] Viele Eltern zweifelten stark am Nutzen des Projekts.
> - [x] Viele Eltern hatten Zweifel am Nutzen des Projekts.
> - [ ] Viele Eltern hatten Zweifeln am Nutzen des Projekts.
> - [ ] Viele Eltern zweifeln am Nutzen des Projekts.
>
> **Пояснення:** слово *Zweifel* треба вжити без змін і зберегти зміст і час: *hatten Zweifel an* + Dat. Перше рішення не вживає даного слова, третє змінює його (*Zweifeln*), четверте змінює час (Präsens замість Präteritum).

> [!quiz] Які вирази — плеоназми? Обери всі.
> level: C2 · type: multi · id: de-c2-stil-q09
> - [x] bereits schon
> - [x] ein weißer Schimmel
> - [x] zusammenaddieren
> - [ ] ein alter Baum
> - [ ] eine schnelle Entscheidung
>
> **Пояснення:** *bereits* = *schon*; *Schimmel* — уже білий кінь; *addieren* — уже «складати разом». *Ein alter Baum* і *eine schnelle Entscheidung* — звичайні означення: прикметник додає нову інформацію.

> [!quiz] Де правильні розділові знаки?
> level: C2 · type: single · id: de-c2-stil-q10
> - [ ] Sie schreibt besser, als ich.
> - [x] Sie schreibt besser als ich.
> - [ ] Sie schreibt, besser als ich.
> - [ ] Sie schreibt besser als, ich.
>
> **Пояснення:** порівняння з *als* без дієслова — без коми. Кома зʼявилася б лише перед реченням: *Sie schreibt besser, als ich erwartet hatte.*

> [!quiz] Яке речення пунктуаційно правильне за чинними правилами?
> level: C2 · type: single · id: de-c2-stil-q11
> - [ ] Sie kam um zu helfen.
> - [x] Sie kam, um zu helfen.
> - [ ] Sie kam um, zu helfen.
> - [ ] Sie, kam um zu helfen.
>
> **Пояснення:** інфінітивна група з *um, ohne, statt, anstatt, außer, als* завжди відокремлюється комою: *Sie kam, um zu helfen.* Так само *Er ging, ohne zu grüßen.*

> [!quiz] Склади речення: «Вона доопрацювала рукопис, який їй надіслало видавництво.»
> level: C2 · type: order · id: de-c2-stil-q12
>
> ```text order
> Sie hat
> das Manuskript
> überarbeitet,
> das ihr der Verlag
> geschickt hatte.
> geschickt gehabt hat. ✗
> ```
>
> **Пояснення:** відносне речення винесено за дужку (*hat … überarbeitet, das …*) — так текст читається легше, ніж із довгою вставкою всередині дужки. Plusquamperfekt — *geschickt hatte*; ~~geschickt gehabt hat~~ — подвійний Perfekt, розмовна форма, у письмовій нормі її уникають.

> [!quiz] Склади речення: «Що коротше речення, то легше його зрозуміти.»
> level: C2 · type: order · id: de-c2-stil-q13
>
> ```text order
> Je kürzer
> der Satz ist,
> desto leichter
> versteht man ihn.
> man versteht ihn. ✗
> ```
>
> **Пояснення:** *je …* — підрядна частина, дієслово в кінці (*ist*); *desto …* займає перше місце головного речення, тож далі одразу дієслово: *desto leichter **versteht** man ihn*. Порядок *desto leichter man versteht* — калька з української.

> [!quiz] Заповни пропуски: поради редактора
> level: C2 · type: fill · id: de-c2-stil-q14 · bank: verlängern, wiederholen
>
> ```text fill
> Der dritte Absatz sagt nichts Neues, den würde ich ganz [[streichen]].
> Der Rest ist etwas lang, du solltest ihn [[straffen|kürzen]].
> «Man» ist zu ungenau, diese Behauptung musst du [[präzisieren]].
> ```
>
> **Пояснення:** *streichen* — викреслити повністю; *straffen* — скоротити, зберігши зміст; *präzisieren* — уточнити. *verlängern* суперечить зауваженню «задовго», *wiederholen* — саме те, від чого редактор застерігає.

> [!quiz] Де стилістичний збій (Stilbruch) у листі до редакції?
> level: C2 · type: single · id: de-c2-stil-q15
> - [ ] Mit großem Interesse habe ich Ihren Artikel gelesen.
> - [ ] Ihre Argumente überzeugen mich nur zum Teil.
> - [x] Die Idee mit der Citymaut finde ich ehrlich gesagt voll daneben.
> - [ ] Ich bitte Sie, auch die Sicht der Pendler zu berücksichtigen.
>
> **Пояснення:** *voll daneben* — розмовне, молодіжне; у листі до редакції воно різко ламає регістр. Нейтрально: *Die Idee einer Citymaut halte ich für verfehlt.* Інші речення стилістично однорідні.

## Фішки

> [!reel] ✏️ Лектор, який не читає лекцій
> Німецький *Lektor* — це не «лектор». У видавництві він редагує рукописи (*das Lektorat*), а в університеті *Lektorin* — викладачка мови, наприклад DAAD-Lektorin в Україні. Слово походить від латинського *lector* — «читач». Тобто це людина, яка читає уважніше за всіх.

> [!reel] 📏 Wolf Schneider і короткі речення
> Журналіст Вольф Шнайдер (1925–2022) до 1995 року очолював Гамбурзьку школу журналістики (згодом Henri-Nannen-Schule). Він написав книжки про стиль «Deutsch für Profis» (1982) і «Deutsch für Kenner» (1987). Його головна порада, якщо переказати своїми словами: дієслово замість іменника, коротке речення замість ланцюга і конкретне слово замість абстрактного.

> [!reel] 🖍️ Rotstift
> *Den Rotstift ansetzen* — буквально «взятися за червоний олівець», тобто різко скорочувати: текст, бюджет, витрати. Колись редактори справді правили рукописи червоним олівцем. Звідси й газетне *dem Rotstift zum Opfer fallen* — «стати жертвою скорочення».

## Джерела та що почитати

- [Goethe-Institut — Modellsatz Goethe-Zertifikat C2: GDS (PDF)](https://www.goethe.de/pro/relaunch/prf/materialien/C2/c2_modellsatz.pdf): Schreiben Teil 1 (переформулювання 10 фрагментів) і Teil 2, критерії оцінювання.
- [Goethe-Institut — Durchführungsbestimmungen C2 (PDF)](https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_C2_neu.pdf): бали за Teil 1 і Teil 2, поріг 60.
- [Rat für deutsche Rechtschreibung — Der Rat](https://www.rechtschreibrat.com/der-rat/): склад і завдання ради.
- [Rat für deutsche Rechtschreibung — Regeln und Wörterverzeichnis](https://www.rechtschreibrat.com/regeln-und-woerterverzeichnis/): чинне офіційне Regelwerk (з 1 липня 2024), варіантні написання.
- [Wikipedia — Duden](https://de.wikipedia.org/wiki/Duden): рішення 1955 року й скасування Duden-Privileg 1996 року.
- [Wikipedia — Reform der deutschen Rechtschreibung von 1996](https://de.wikipedia.org/wiki/Reform_der_deutschen_Rechtschreibung_von_1996): суперечки, суди й повернення деяких газет до старої орфографії.
- [Wikipedia — Wolf Schneider](https://de.wikipedia.org/wiki/Wolf_Schneider): біографія й книжки про стиль.
- [DWDS — redigieren](https://www.dwds.de/wb/redigieren) і [Duden — Pleonasmus](https://www.duden.de/rechtschreibung/Pleonasmus): значення й приклади.

> [!important] Підсумок
> - **GDS Schreiben:** 80 хв; Teil 1 — 10 фрагментів за 20 хв з даним словом, яке **не змінюють** (до 20 балів); Teil 2 — ≈ 350 слів за 60 хв (до 80 балів).
> - **Типові перетворення Teil 1:** *um … zu → zur + Gen*, *weil → aufgrund + Gen*, *obwohl → trotz*, *man kann → lässt sich*, *muss man → ist zu*, *zweifeln → Zweifel haben*.
> - **Ясність:** дієслово замість ланцюга іменників, одна думка — одне речення, чергування довгих і коротких речень, **термін не варіюємо**, конкретика замість *Worthülsen*.
> - **Викреслюємо:** *Pleonasmus* (*bereits schon*), *Redundanz*, *Floskeln*, *Stilbruch* (*voll daneben* у листі до редакції).
> - **Редагуємо в 4 проходи:** Inhalt → Aufbau → Satz → Wort & Zeichen; кома обовʼязкова перед *um / ohne / statt … zu*, але не перед *als / wie* без дієслова.
